const dania = document.querySelector('.dania');
const daniaToggleButton = document.querySelector('.dania > button.dania-toggle');

const CLOSE_ICON_HTML = '<i class="bi bi-x"></i>'; 
const DANIA_TEXT = 'DAN-IA';

if (dania && daniaToggleButton) {
    daniaToggleButton.innerHTML = DANIA_TEXT;

    daniaToggleButton.addEventListener('click', () => {
        dania.classList.toggle('toggle'); 
        
        const isDaniaOpen = dania.classList.contains('toggle');
        
        if (isDaniaOpen) {
            daniaToggleButton.innerHTML = CLOSE_ICON_HTML;
        } else {
            daniaToggleButton.innerHTML = DANIA_TEXT;
        }
    });
} else {
    console.error('Erro: Elementos ".dania" ou "button.dania-toggle" não foram encontrados.');
}