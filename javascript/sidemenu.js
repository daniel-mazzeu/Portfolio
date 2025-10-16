document.addEventListener('DOMContentLoaded', () => {
    const sidemenu = document.querySelector('aside.sidemenu');
    const toggleButton = document.querySelector('aside.sidemenu > button.sidemenu-toggle');
    const searchInput = document.querySelector('.header-search input');

    const searchableMenuItems = document.querySelectorAll('aside.sidemenu > section.body > .menu');
    const footerMenuItems = document.querySelectorAll('aside.sidemenu > section.footer > .menu');

    const allMenuItems = document.querySelectorAll('aside.sidemenu > section.body > .menu, aside.sidemenu > section.footer > .menu');
    const allMenuLinks = document.querySelectorAll('.sidemenu .menu .link, .sidemenu .submenu a');

    const menuContainersWithSubmenu = document.querySelectorAll('aside.sidemenu > section.body > div.menu:has(.submenu), aside.sidemenu > section.footer > div.menu:has(.submenu)');
    const menuStates = new Map();

    let activeLinkBeforeSearch = null;
    let currentActiveLink = null;
    
    const scrollOffset = 60;

    const header = sidemenu ? sidemenu.querySelector('section.header') : null;
    const body = sidemenu ? sidemenu.querySelector('section.body') : null;
    const footer = sidemenu ? sidemenu.querySelector('section.footer') : null;

    if (header && body && footer) {
        const setBodyHeight = () => {
            const sidemenuHeight = sidemenu.offsetHeight;
            const headerHeight = header.offsetHeight;
            const footerHeight = footer.offsetHeight;
            const adjustedBodyHeight = sidemenuHeight - headerHeight - footerHeight;

            body.style.height = `${adjustedBodyHeight}px`;
            body.style.marginTop = `${headerHeight}px`;
        };

        setBodyHeight();

        window.addEventListener('resize', setBodyHeight);

        const observerConfig = { childList: true, subtree: true, attributes: true };

        const headerObserver = new MutationObserver(setBodyHeight);
        headerObserver.observe(header, observerConfig);

        const footerObserver = new MutationObserver(setBodyHeight);
        footerObserver.observe(footer, observerConfig);

    } else {
        console.error('Erro: Sections "header", "body" or "footer" were not found.');
    }

    function removeActiveClass() {
        allMenuLinks.forEach(link => {
            link.classList.remove('active');
        });
        allMenuItems.forEach(menuItem => {
            menuItem.classList.remove('active');
        });
    }

    function setActiveLink(linkToActivate) {
        removeActiveClass();

        linkToActivate.classList.add('active');
        currentActiveLink = linkToActivate;

        let currentElement = linkToActivate;
        while (currentElement) {
            if (currentElement.classList.contains('menu')) {
                currentElement.classList.add('active');
            }
            currentElement = currentElement.parentElement;
        }
    }

    if (sidemenu && toggleButton) {
        const toggleIcon = toggleButton.querySelector('i');

        toggleButton.addEventListener('click', () => {
            sidemenu.classList.toggle('toggle');

            if (toggleIcon) {
                if (sidemenu.classList.contains('toggle')) {
                    toggleIcon.classList.remove('bi-list');
                    toggleIcon.classList.add('bi-x');
                } else {
                    toggleIcon.classList.remove('bi-x');
                    toggleIcon.classList.add('bi-list');
                }
            }
        });
    } else {
        console.error('Erro: Elements "sidemenu" or "sidemenu-toggle" were not found.');
    }

    const ignoredSidemenuLinks = document.querySelectorAll('aside a[data-href="false"]');
    ignoredSidemenuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
        });
    });

    const closeAside = document.querySelectorAll('aside a:not([data-href="false"])');
    closeAside.forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || href === '' || !href.startsWith('#')) {
                const toggleIcon = toggleButton.querySelector('i');
                sidemenu.classList.remove('toggle'); 
                
                if (toggleIcon) {
                    toggleIcon.classList.remove('bi-x');
                    toggleIcon.classList.add('bi-list');
                }
            }
        });
    });

    menuContainersWithSubmenu.forEach(menuContainer => {
        const menuLink = menuContainer.querySelector('a.link');
        const submenu = menuContainer.querySelector('.submenu');

        if (menuLink && submenu) {
            const state = {
                isSubmenuLockedOpen: false,
                menuContainer: menuContainer,
                openSubmenu: () => {
                    submenu.style.display = 'flex';
                    menuContainer.classList.add('active');
                    menuContainer.classList.remove('remove');
                },
                closeSubmenu: () => {
                    if (!state.isSubmenuLockedOpen) {
                        submenu.style.display = 'none';
                        menuContainer.classList.remove('active');
                        menuContainer.classList.add('remove');
                    }
                }
            };

            menuStates.set(menuContainer, state);
            
            menuLink.addEventListener('click', (event) => {
                event.preventDefault();

                if (menuLink.dataset.href === 'false') {
                    menuStates.forEach(s => {
                        if (s !== state && s.isSubmenuLockedOpen) {
                            s.isSubmenuLockedOpen = false;
                            s.closeSubmenu();
                        }
                    });
                    
                    if (searchInput.value.trim()) {
                        removeActiveClass();
                    }
                }

                if (submenu.style.display === 'flex') {
                    if (state.isSubmenuLockedOpen) {
                        state.isSubmenuLockedOpen = false;
                        state.closeSubmenu();
                        menuLink.classList.remove('active');
                        menuContainer.classList.remove('active');
                    } else {
                        state.isSubmenuLockedOpen = true;
                        if (!menuLink.closest('.submenu')) {
                            setActiveLink(menuLink);
                        }
                    }
                } else {
                    state.isSubmenuLockedOpen = true;
                    state.openSubmenu();
                    if (!menuLink.closest('.submenu')) {
                        setActiveLink(menuLink);
                    }
                }
            });

            document.addEventListener('click', (event) => {
                if (submenu.style.display === 'flex' && !menuContainer.contains(event.target) && !state.isSubmenuLockedOpen && searchInput.value.trim() === '') {
                    const activeLinkInsideThisSubmenu = submenu.querySelector('a.active');
                    if (!activeLinkInsideThisSubmenu) {
                        state.closeSubmenu();
                        menuLink.classList.remove('active');
                        menuContainer.classList.remove('active');
                    }
                }
            });

        }
    });

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim();

            allMenuLinks.forEach(link => {
                if (link !== activeLinkBeforeSearch) {
                    link.classList.remove('active');
                }
            });
            allMenuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
            });

            menuStates.forEach(state => {
                state.isSubmenuLockedOpen = false;
                state.closeSubmenu();
            });

            if (searchTerm === '') {
                searchableMenuItems.forEach(menuItem => {
                    menuItem.style.display = 'flex';
                    menuItem.querySelectorAll('.submenu a').forEach(subLink => {
                        subLink.style.display = 'flex';
                    });
                });

                if (activeLinkBeforeSearch) {
                    setActiveLink(activeLinkBeforeSearch);
                    const parentMenuContainer = activeLinkBeforeSearch.closest('.menu');
                    if (parentMenuContainer) {
                        const parentMenuState = menuStates.get(parentMenuContainer);
                        if (parentMenuState) {
                            parentMenuState.openSubmenu();
                            parentMenuState.isSubmenuLockedOpen = true;
                        }
                    }
                } else {
                    removeActiveClass();
                }

            } else {
                searchableMenuItems.forEach(menuItem => {
                    const linkTextElement = menuItem.querySelector('.link p');
                    const submenuLinks = menuItem.querySelectorAll('.submenu a');
                    let matchesSearchTerm = false;

                    let mainLinkWasActiveBeforeSearch = (activeLinkBeforeSearch && linkTextElement && linkTextElement.parentElement === activeLinkBeforeSearch);

                    if (linkTextElement && linkTextElement.textContent.toLowerCase().includes(searchTerm)) {
                        matchesSearchTerm = true;
                    }

                    let anySublinkMatches = false;
                    
                    submenuLinks.forEach(subLink => {
                        const subLinkWasActiveBeforeSearch = (activeLinkBeforeSearch === subLink);

                        if (subLink.textContent.toLowerCase().includes(searchTerm)) {
                            matchesSearchTerm = true;
                            anySublinkMatches = true;
            
                            subLink.style.display = 'flex'; 

                            const parentMenuState = menuStates.get(menuItem);
                            if (parentMenuState) {
                                parentMenuState.openSubmenu();
                                parentMenuState.isSubmenuLockedOpen = false;

                                if (subLinkWasActiveBeforeSearch) {
                                    subLink.classList.add('active');
                                } else {
                                    subLink.classList.remove('active');
                                }
                            }
                        } else {
                            subLink.style.display = 'none'; 
                            
                            if (subLink !== activeLinkBeforeSearch) {
                                subLink.classList.remove('active');
                            }
                        }
                    });

                    if (matchesSearchTerm) {
                        menuItem.style.display = 'flex';

                        const mainLinkOfMenu = menuItem.querySelector('a.link');
                        if (mainLinkOfMenu) {
                            if ((linkTextElement && linkTextElement.textContent.toLowerCase().includes(searchTerm)) || mainLinkWasActiveBeforeSearch) {
                                mainLinkOfMenu.classList.add('active');
                            } else {
                                mainLinkOfMenu.classList.remove('active');
                            }
                        }

                        // Reativa o link que estava ativo antes, se ele estiver contido neste menu
                        if (activeLinkBeforeSearch && menuItem.contains(activeLinkBeforeSearch)) {
                            activeLinkBeforeSearch.classList.add('active');
                            const parentMenuState = menuStates.get(activeLinkBeforeSearch.closest('.menu'));
                            if (parentMenuState) {
                                parentMenuState.openSubmenu();
                                parentMenuState.isSubmenuLockedOpen = false;
                            }
                        }

                    } else {
                        // Oculta o item de menu pai se não houver correspondência
                        menuItem.style.display = 'none';
                        menuItem.classList.remove('active');
                        const mainLinkOfSubmenu = menuItem.querySelector('a.link[data-href="false"]');
                        if (mainLinkOfSubmenu) {
                            mainLinkOfSubmenu.classList.remove('active');
                        }
                        const state = menuStates.get(menuItem);
                        if (state) {
                            state.isSubmenuLockedOpen = false;
                            state.closeSubmenu();
                        }
                    }
                });
            }

            footerMenuItems.forEach(footerItem => {
                footerItem.style.display = 'flex';
            });
        });
    }

    allMenuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            const isAnchorLink = href && href.startsWith('#') && href.length > 1;

            if (link.dataset.href === 'false' && !link.closest('.submenu')) {
                event.preventDefault();
            } else if (!link.dataset.href || isAnchorLink || (link.closest('.submenu') && (!href || href === ''))) {
                
                if (isAnchorLink) {
                    event.preventDefault(); 
                    
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - scrollOffset,
                            behavior: 'smooth'
                        });
                        
                        history.pushState(null, null, href); 
                        
                        if (sidemenu.classList.contains('toggle')) {
                            const toggleIcon = toggleButton.querySelector('i');
                            sidemenu.classList.remove('toggle');
                            if (toggleIcon) {
                                toggleIcon.classList.remove('bi-x');
                                toggleIcon.classList.add('bi-list');
                            }
                        }
                    }
                } else if (href === '') {
                    event.preventDefault();
                }

                menuStates.forEach(s => {
                    if (s.menuContainer !== link.closest('.menu')) {
                        s.isSubmenuLockedOpen = false;
                        s.closeSubmenu();
                    }
                });

                setActiveLink(link);

                activeLinkBeforeSearch = link;

                const parentMenuContainer = link.closest('.menu');
                if (parentMenuContainer) {
                    const parentMenuState = menuStates.get(parentMenuContainer);
                    if (parentMenuState) {
                        parentMenuState.openSubmenu();
                        parentMenuState.isSubmenuLockedOpen = true;
                    }
                }
                
                if (searchInput) {
                    searchInput.value = '';
                    // Dispara o evento de input para reverter a exibição normal do menu
                    searchInput.dispatchEvent(new Event('input')); 
                }
            }
        });
    });

    const currentPath = window.location.hash;

    if (currentPath) {
        let foundActiveLink = false;
        allMenuLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                setActiveLink(link);
                activeLinkBeforeSearch = link;
                foundActiveLink = true;

                const parentMenuContainer = link.closest('.menu');
                if (parentMenuContainer) {
                    const parentMenuState = menuStates.get(parentMenuContainer);
                    if (parentMenuState) {
                        parentMenuState.openSubmenu();
                        parentMenuState.isSubmenuLockedOpen = true;
                    }
                }
            }
        });

        const targetElement = document.querySelector(currentPath);
        if (targetElement) {
             window.scrollTo({
                 top: targetElement.offsetTop - scrollOffset,
                 behavior: 'smooth'
             });
        }
    }
});