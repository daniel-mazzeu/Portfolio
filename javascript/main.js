document.addEventListener('DOMContentLoaded', () => {
    const fadeDuration = 50; 

    const navigateToSection = (targetSelector) => {
        if (!targetSelector || targetSelector === '#' || $(targetSelector).length === 0) {
            return;
        }
        
        if ($(targetSelector).is(':visible') && parseFloat($(targetSelector).css('opacity')) === 1) {
            history.pushState(null, '', targetSelector);
            return;
        }
        
        $('main section:visible').fadeTo(fadeDuration, 0, function() {
            $(this).hide(); 
            
            $(targetSelector)
                .css({'display': 'flex', 'opacity': 0}) 
                .fadeTo(fadeDuration, 1, function() {
                    history.pushState(null, '', targetSelector);
                });
        });
    };
    
    let defaultHash = $('aside a[href^="#"]').first().attr('href') || '#about';

    const urlHash = window.location.hash;
    let initialSelector = defaultHash;

    if (urlHash && $(urlHash).length) {
        initialSelector = urlHash;
    }
    
    $('main section').hide().css('opacity', 0); 
    $(initialSelector).css('display', 'flex').fadeTo(0, 1); 
    
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