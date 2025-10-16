const notificationPanel = document.querySelector('aside.notification');

function closeNotification(notificationElement, type = 'time') {
    const intervalId = notificationElement.dataset.intervalId;
    if (intervalId) {
        clearInterval(parseInt(intervalId));
    }

    notificationElement.classList.remove('add');

    if (type === 'excess') {
        notificationElement.classList.add('trash');
    } else {
        notificationElement.classList.add('remove');
    }

    notificationElement.addEventListener('animationend', function handler(event) {
        if (event.animationName === 'notification-slideout' || event.animationName === 'notification-trash') {
            notificationElement.remove();
            this.removeEventListener('animationend', handler);
        }
    });
}

function createNotification(title, text, durationInSeconds) {
    const MAX_NOTIFICATIONS = 3;

    const notificationContent = document.createElement('div');
    notificationContent.classList.add('notification-content');

    notificationContent.innerHTML = `
        <button class="close-notification"><i class="bi bi-x-circle-fill"></i></button>
        <h1>${title}</h1>
        <p>${text}</p>
        <div class="progressbar">
            <div class="percentage"></div>
        </div>
        <small>${durationInSeconds} seconds remaining...</small>
    `;

    notificationPanel.appendChild(notificationContent);

    setTimeout(() => {
        notificationContent.classList.add('add');
        notificationPanel.scrollTop = notificationPanel.scrollHeight;
    }, 10);

    const currentNotifications = notificationPanel.querySelectorAll('.notification-content');
    if (currentNotifications.length > MAX_NOTIFICATIONS) {
        for (let i = 0; i < currentNotifications.length - MAX_NOTIFICATIONS; i++) {
            closeNotification(currentNotifications[i], 'excess');
        }
    }

    const progressBarPercentage = notificationContent.querySelector('.percentage');
    const countdownText = notificationContent.querySelector('small');

    let elapsedSeconds = 0;
    let intervalId;

    const updateProgressBar = () => {
        elapsedSeconds++;
        const percentageWidth = (elapsedSeconds / durationInSeconds) * 100;
        progressBarPercentage.style.width = `${percentageWidth}%`;

        const remainingSeconds = durationInSeconds - elapsedSeconds;
        countdownText.textContent = `${remainingSeconds} segundos restantes...`;

        if (elapsedSeconds > durationInSeconds) {
            clearInterval(intervalId);
            closeNotification(notificationContent, 'time');
        }
    };

    intervalId = setInterval(updateProgressBar, 1000);

    notificationContent.dataset.intervalId = intervalId;

    const closeButton = notificationContent.querySelector('.close-notification');
    closeButton.addEventListener('click', () => {
        closeNotification(notificationContent, 'manual');
    });
}

export { createNotification, closeNotification };