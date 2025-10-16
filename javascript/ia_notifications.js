import { createNotification } from './notifications.js';

const messages = [
    "Dica Dev: A melhor forma de aprender é começando um projeto novo. Que tal explorar um dos meus frameworks?",
    "Que bom ter você por aqui! Dê uma olhada na minha expertise em Inteligência Artificial (FIAP).",
    "Não deixe de ver meus projetos em React! O desenvolvimento front-end é uma das minhas paixões.",
    "Buscando um back-end robusto? Explore meu conhecimento em PHP e SQLServer!",
    "Lembrete: O código limpo de hoje é o futuro fácil de amanhã. Continue explorando!",
    "Parabéns por buscar inovação! Minha área de Python está ligada à Análise de Dados e IA.",
    "Curiosidade: Este portfólio é responsivo graças ao CSS-3, com foco em Mobile-First.",
    "O que achou do design? Se precisar de algo do tipo, meu HTML e CSS são avaliados com 5 estrelas!",
    "Não esqueça de visitar meu projeto na L009, focado em automação de processos.",
    "Estou sempre inovando. Volte em breve para ver as novidades!",
];

function sendRandomNotification() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    const currentMessage = messages[randomIndex];

    createNotification('Daniel Mazzeu', currentMessage, 10);
}

document.addEventListener('DOMContentLoaded', () => {
    createNotification('Daniel Mazzeu', 'Seja bem vindo(a) ao meu portfólio. Espero que goste!', 5);
    setTimeout(sendRandomNotification, 10000); 
    setInterval(sendRandomNotification, 60000); 
});