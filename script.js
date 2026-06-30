/**
 * Bidjory - Script Global
 * Tema, navegação, animações
 */

const theme = {
    primaryColor: "#2dd4bf",
    secondaryColor: "#080d14",
    accentColor: "#2dd4bf",
    background: "#070b12",
    text: "#f8fafc",
    textSecondary: "#b8c4d6",
    muted: "#8b9bb0",
    borderColor: "rgba(45, 212, 191, 0.18)",
    statusColors: {
        active: "#2dd4bf",
        testing: "#f59e0b",
        building: "#3b82f6",
        inactive: "#64748b"
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
    root.style.setProperty('--muted', t.muted);
    root.style.setProperty('--border', t.borderColor);
    root.style.setProperty('--status-active', t.statusColors.active);
    root.style.setProperty('--status-testing', t.statusColors.testing);
    root.style.setProperty('--status-building', t.statusColors.building);
    root.style.setProperty('--status-inactive', t.statusColors.inactive);
}

applyTheme(theme);

window.Bidjory = {
    theme,
    applyTheme,
    updateTheme: (newTheme) => {
        Object.assign(theme, newTheme);
        applyTheme(theme);
    }
};

function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = Math.min(index * 80, 400);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });
    elements.forEach(el => observer.observe(el));
}

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    if (!hamburger || !nav) return;

    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function open() {
        nav.classList.add('active');
        overlay.classList.add('active');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        nav.classList.contains('active') ? close() : open();
    });

    overlay.addEventListener('click', close);

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', close);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) close();
    });
}

function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
}

function updateYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initMobileMenu();
    initHeaderScroll();
    updateYear();
});