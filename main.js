// ============================
// 1. ШАПКА — изменение при скролле
// ============================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============================
// 2. БУРГЕР-МЕНЮ
// ============================
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const overlay = document.getElementById('overlay');

function toggleMenu() {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
}

burger.addEventListener('click', toggleMenu);
mobileClose.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Закрытие при клике на ссылку
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// ============================
// 3. КНОПКА "НАВЕРХ"
// ============================
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
});

scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================
// 4. АНИМАЦИЯ ПОЯВЛЕНИЯ (Intersection Observer)
// ============================
const animateElements = document.querySelectorAll(
    '.game-card, .feature-card, .step-card, .stat-card, .contact-card'
);

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

console.log('🚀 1Win сайт загружен');
console.log('🔗 Реферальная ссылка: https://one-vv7878.com/?p=1sjz');
