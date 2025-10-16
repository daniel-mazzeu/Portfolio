document.addEventListener('DOMContentLoaded', () => {
    // A constante 'allSections' e as variáveis de efeito não são mais necessárias
    const fadeDuration = 300; 

    // A lógica 'shouldApplyEffect' e as funções de rotação/reset 'applyPerspectiveRotation', 'resetRotation' 
    // e os listeners de 'mousemove', 'mouseleave', 'touchmove', 'touchend', 'touchcancel' e 'resize'
    // foram removidos.

    // A função de navegação é mantida, pois é a lógica principal restante.
    const navigateToSection = (targetSelector) => {
        // Verifica se o seletor é válido e existe. (Preserva jQuery para a lógica de navegação existente)
        if (!targetSelector || targetSelector === '#' || $(targetSelector).length === 0) {
            return;
        }
        
        // Se a seção já está visível, apenas atualiza o histórico sem animação.
        if ($(targetSelector).is(':visible')) {
            history.pushState(null, '', targetSelector);
            return;
        }
        
        // Oculta a seção visível atual com fade-out e mostra a nova com fade-in.
        $('main section:visible').fadeOut(fadeDuration, function() {
            // Usa 'flex' para garantir que a seção apareça corretamente, já que o CSS original pode ter 'display: flex'.
            $(targetSelector).fadeIn(fadeDuration).css('display', 'flex');
            history.pushState(null, '', targetSelector);
        });
    };
    
    // --- Lógica de Inicialização e Eventos de Navegação ---
    
    // Define o hash padrão (primeiro link da aside, ou '#about')
    let defaultHash = $('aside a[href^="#"]').first().attr('href') || '#about';

    const urlHash = window.location.hash;
    let initialSelector = defaultHash;

    // Se houver um hash válido na URL, usa-o.
    if (urlHash && $(urlHash).length) {
        initialSelector = urlHash;
    }
    
    // Oculta todas as seções e mostra a seção inicial.
    $('main section').hide(); 
    $(initialSelector).show().css('display', 'flex'); 
    
    // Define o estado inicial do histórico.
    history.replaceState(null, '', initialSelector);

    // Evento de clique para links na barra lateral (aside).
    $('aside a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const targetSelector = $(this).attr('href');
        navigateToSection(targetSelector);
    });
    
    // Evento para navegação usando os botões 'voltar'/'avançar' do navegador.
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || defaultHash;
        navigateToSection(hash);
    });
});