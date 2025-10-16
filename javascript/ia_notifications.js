import { createNotification } from './notifications.js';

const messages = [
    "Seja bem vindo(a) ao meu portfólio. Espero que goste!",
    "Dica Dev: A melhor forma de aprender é começando um projeto novo.",
    "Que bom ter você por aqui!.",
    "O desenvolvimento front-end é uma das minhas paixões.",
    "Buscando um back-end robusto? Explore o conhecimento em PHP e SQLServer!",
    "Lembrete: O código limpo de hoje é o futuro fácil de amanhã. Continue explorando!",
    "Parabéns por buscar inovação!",
    "Curiosidade: Este portfólio é responsivo graças ao CSS-3, com foco em Mobile-First.",
    "O que achou do design? Se precisar de algo do tipo, entre em contato comigo!",
    "Não esqueça de visitar meu projeto na L009, focado em automação de processos.",
    "Estou sempre inovando. Volte em breve para ver as novidades!",
];

let availableMessages = [...messages]; 

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(availableMessages);

function sendRandomNotification() {
    if (availableMessages.length === 0) {
        availableMessages = [...messages];
        shuffleArray(availableMessages);
    }

    const currentMessage = availableMessages.pop();

    if (currentMessage) {
        createNotification('Daniel Mazzeu', currentMessage, 10);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(sendRandomNotification, 10000); 
    setInterval(sendRandomNotification, 60000); 
});