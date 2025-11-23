const TELEGRAM_BOT_TOKEN = '7913390114:AAF50F7H4bwoaQE3VQZ2IMTAM2sUFVdP9l8';
const TELEGRAM_CHAT_ID = '7710420463';

// Notification Logic
function showNotification(title, message, type = 'success') {
    const notification = document.getElementById('notification');
    const notifTitle = document.getElementById('notification-title');
    const notifMessage = document.getElementById('notification-message');
    const notifIcon = document.getElementById('notification-icon');

    notifTitle.textContent = title;
    notifMessage.textContent = message;

    // Reset classes
    notification.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');

    // Icon based on type
    if (type === 'success') {
        notifIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>';
    } else {
        notifIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>';
    }

    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
}

async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('text', message);
    formData.append('parse_mode', 'HTML');

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Telegram API Error: ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error('Failed to send Telegram message:', error);
        showNotification('Ошибка', 'Не удалось отправить сообщение. Позвоните нам.', 'error');
        return false;
    }
}

// Handle "Application" form submission (Footer)
async function handleApplicationSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const phone = form.querySelector('input[type="tel"]').value;

    if (!name || !phone) {
        showNotification('Внимание', 'Пожалуйста, заполните все поля.', 'error');
        return;
    }

    const message = `
<b>🔔 Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${name}
📞 <b>Телефон:</b> ${phone}
    `;

    const success = await sendTelegramMessage(message);
    if (success) {
        showNotification('Заявка принята!', 'Мы свяжемся с вами в ближайшее время.');
        form.reset();
    }
}

// Handle "Order" form submission (Modal)
async function handleOrderSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const product = document.getElementById('modal-product').textContent;
    const name = form.querySelector('input[type="text"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    const comment = form.querySelector('textarea').value;

    if (!name || !phone) {
        showNotification('Внимание', 'Пожалуйста, заполните обязательные поля.', 'error');
        return;
    }

    const message = `
<b>🛒 Новый заказ!</b>

📦 <b>Товар:</b> ${product}
👤 <b>Имя:</b> ${name}
📞 <b>Телефон:</b> ${phone}
💬 <b>Комментарий:</b> ${comment || 'Нет комментария'}
    `;

    const success = await sendTelegramMessage(message);
    if (success) {
        closeModal();
        showNotification('Заказ оформлен!', 'Менеджер свяжется с вами для уточнения деталей.');
        form.reset();
    }
}
