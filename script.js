/**
 * Bidjory - Script Global
 * Tema, navegação, animações
 */

// ==========================================
// SISTEMA DE TEMA
// ==========================================
const theme = {
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    accentColor: "#666666",
    background: "#ffffff",
    text: "#000000",
    textSecondary: "#555555",
    borderColor: "#e5e5e5",
    statusColors: {
        active: "#10b981",
        testing: "#f59e0b",
        building: "#3b82f6",
        inactive: "#9ca3af"
    }
};

function applyTheme(t) {
    const root = document.documentElement;
    root.style.setProperty('--primary', t.primaryColor);
    root.style.setProperty('--secondary', t.secondaryColor);
    root.style.setProperty('--accent', t.accentColor);
    root.style.setProperty('--background', t.background);
    root.style.setProperty('--text', t.text);
    root.style.setProperty('--text-secondary', t.textSecondary);
    root.style.setProperty('--border', t.borderColor);
    root.style.setProperty('--status-active', t.statusColors.active);
    root.style.setProperty('--status-testing', t.statusColors.testing);
    root.style.setProperty('--status-building', t.statusColors.building);
    root.style.setProperty('--status-inactive', t.statusColors.inactive);
}

applyTheme(theme);

// Exporta para console
window.Bidjory = {
    theme,
    applyTheme,
    updateTheme: (newTheme) => {
        Object.assign(theme, newTheme);
        applyTheme(theme);
    }
};

// ==========================================
// REVEAL ANIMATIONS
// ==========================================
function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
}

// ==========================================
// MOBILE MENU
// ==========================================
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    if (!hamburger || !nav) return;

    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    const open = () => {
        nav.classList.add('active');
        overlay.classList.add('active');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const close = () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
        nav.classList.contains('active') ? close() : open();
    });

    overlay.addEventListener('click', close);

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', close);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
}

// ==========================================
// HEADER SCROLL
// ==========================================
function initHeaderScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
}

// ==========================================
// FOOTER YEAR
// ==========================================
function updateYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initMobileMenu();
    initHeaderScroll();
    updateYear();
});