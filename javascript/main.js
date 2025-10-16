document.addEventListener('DOMContentLoaded', () => {
    const allSections = document.querySelectorAll('main section');
    const MAX_ROTATION = 15;

    const applyPerspectiveRotation = (clientX, clientY) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;

        const mouseX = clientX - centerX;
        const mouseY = clientY - centerY;

        const normalizeX = mouseX / centerX;
        const normalizeY = mouseY / centerY;
        
        const rotationX = normalizeY * MAX_ROTATION * -1; 
        const rotationY = normalizeX * MAX_ROTATION; 
        
        const transformValue = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

        allSections.forEach(section => {
            section.style.transform = transformValue;
        });
    };

    const resetRotation = () => {
        allSections.forEach(section => {
            section.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    };
    
    document.body.addEventListener('mousemove', (e) => {
        applyPerspectiveRotation(e.clientX, e.clientY);
    });

    document.body.addEventListener('mouseleave', resetRotation);

    document.body.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            applyPerspectiveRotation(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true }); 
    
    document.body.addEventListener('touchend', resetRotation);
    document.body.addEventListener('touchcancel', resetRotation); 
    
    const fadeDuration = 300; 
    
    const navigateToSection = (targetSelector) => {
        
        if (!targetSelector || targetSelector === '#' || $(targetSelector).length === 0) {
            return;
        }
        
        if ($(targetSelector).is(':visible')) {
            history.pushState(null, '', targetSelector);
            return;
        }
        
        $('main section:visible').fadeOut(fadeDuration, function() {
            $(targetSelector).fadeIn(fadeDuration).css('display', 'flex');
            history.pushState(null, '', targetSelector);
        });
    };
    
    let defaultHash = $('aside a[href^="#"]').first().attr('href') || '#about';

    const urlHash = window.location.hash;
    let initialSelector = defaultHash;

    if (urlHash && $(urlHash).length) {
        initialSelector = urlHash;
    }
    
    $('main section').hide(); 
    $(initialSelector).show().css('display', 'flex');;
    
    history.replaceState(null, '', initialSelector);

    $('aside a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const targetSelector = $(this).attr('href');
        navigateToSection(targetSelector);
    });
    
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || defaultHash;
        navigateToSection(hash);
    });
    
});