window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetSelector = this.getAttribute('href');
        if (!targetSelector) return;
        const target = document.querySelector(targetSelector);
        if (!target) return;
        e.preventDefault();
        if (navLinks) navLinks.classList.remove('active');
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

function ensureToastContainer() {
    let el = document.getElementById('toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'toast';
        el.className = 'toast';
        el.innerHTML = `
            <div class="toast-icon"><i class="fas fa-check-circle"></i></div>
            <div class="toast-message"></div>
            <button class="toast-close" aria-label="Close toast"><i class="fas fa-times"></i></button>
        `;
        document.body.appendChild(el);
        const closeBtn = el.querySelector('.toast-close');
        if (closeBtn) closeBtn.addEventListener('click', () => hideToast());
    }
    return el;
}

let toastTimeoutId = null;
function showToast(message, { error = false, duration = 3500 } = {}) {
    const el = ensureToastContainer();
    const icon = el.querySelector('.toast-icon i');
    const msg = el.querySelector('.toast-message');
    if (msg) msg.textContent = message;
    el.classList.toggle('error', !!error);
    if (icon) icon.className = error ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
    el.classList.add('show');
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    toastTimeoutId = setTimeout(() => hideToast(), duration);
}

function hideToast() {
    const el = document.getElementById('toast');
    if (!el) return;
    el.classList.remove('show');
}

function notify(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 5000);
    } else {
        showToast(message);
    }
}

function notifyError(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 5000);
    } else {
        showToast(message, { error: true });
    }
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.dataset._oldText = submitButton.textContent || '';
            submitButton.textContent = 'Sending...';
        }

        try {
            const formData = new FormData(contactForm);
            const action = (contactForm.getAttribute('action') || '').trim();

            if (action.includes('formsubmit.co')) {
                const endpoint = action.replace('/neuronauticsllp@gmail.com', '/ajax/neuronauticsllp@gmail.com');
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: formData
                });
                if (!res.ok) throw new Error('Failed request');
                await res.json().catch(() => ({}));
                notify('Thank you! Your message has been submitted.');
                contactForm.reset();
            } else {
                const payload = {};
                formData.forEach((value, key) => { payload[key] = value; });
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok || (data && data.ok === false)) throw new Error('Failed');
                notify('Message sent successfully!');
                contactForm.reset();
            }
        } catch (err) {
            console.error(err);
            notifyError('Sorry, there was a problem sending your message. Please try again later.');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = submitButton.dataset._oldText || 'Send';
                delete submitButton.dataset._oldText;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
    heroContent.style.transition = 'opacity 1s, transform 1s';
    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 300);
});


