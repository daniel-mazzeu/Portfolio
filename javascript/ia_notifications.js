import { createNotification } from './notification.js';

document.addEventListener('DOMContentLoaded', () => {
    createNotification('Welcome!', 'Thanks for visiting our site.', 5);
});