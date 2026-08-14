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

const SOCIALS_API_URL = "https://bidjory-api.bidjorysamuel.workers.dev/projects";
const SOCIAL_SETTINGS_CATEGORY = "__site_social_settings__";
const socialNetworks = {
    instagram: { label: "Instagram", icon: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"4.2\"/><circle cx=\"17.4\" cy=\"6.7\" r=\"1\" class=\"social-icon-fill\"/></svg>" },
    youtube: { label: "YouTube", icon: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M21.2 7.1a2.8 2.8 0 0 0-2-2C17.4 4.6 12 4.6 12 4.6s-5.4 0-7.2.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2.3 12a29 29 0 0 0 .5 4.9 2.8 2.8 0 0 0 2 2c1.8.5 7.2.5 7.2.5s5.4 0 7.2-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-4.9 29 29 0 0 0-.5-4.9Z\"/><path d=\"m10 15.2 5.2-3.2L10 8.8v6.4Z\" class=\"social-icon-fill\"/></svg>" },
    tiktok: { label: "TikTok", icon: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M14.5 3v11.2a4.7 4.7 0 1 1-4-4.6v3.2a1.6 1.6 0 1 0 .8 1.4V3h3.2Zm0 0c.5 2.6 2 4 4.5 4.4v3.2A8.2 8.2 0 0 1 14.5 9\"/></svg>" },
    linkedin: { label: "LinkedIn", icon: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M5.4 8.7V19M5.4 5.2v.1M10.1 19v-5.7c0-2.5 4.6-3.2 4.6.4V19M10.1 9.8V19M18.8 19v-6.2\"/></svg>" },
    x: { label: "X / Twitter", icon: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 4 20 20M20 4 4 20\"/></svg>" },
    facebook: { label: "Facebook", icon: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M14.5 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.5 1.6-1.5H18V4a24 24 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.4V10H8.5v3h2.8v8\"/></svg>" },
    github: { label: "GitHub", icon: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 2.8a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.3-2.3-.3-4.7-1.1-4.7-5a4 4 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7a4 4 0 0 1 1 2.7c0 3.9-2.4 4.7-4.7 5 .4.3.7 1 .7 1.9v2.7c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.8Z\"/></svg>" }
};

function createSocialLinks(settings, className) {
    const container = document.createElement("div");
    container.className = className;
    container.setAttribute("aria-label", "Redes sociais");
    Object.entries(socialNetworks).forEach(([key, network]) => {
        if (!settings[key]) return;
        const link = document.createElement("a");
        link.href = settings[key];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", network.label);
        link.title = network.label;
        link.innerHTML = network.icon;
        container.appendChild(link);
    });
    return container;
}

async function initSocialLinks() {
    try {
        const response = await fetch(SOCIALS_API_URL);
        if (!response.ok) return;
        const projects = await response.json();
        const record = projects.find(project => project.category === SOCIAL_SETTINGS_CATEGORY);
        if (!record?.description) return;
        const settings = JSON.parse(record.description);

        document.querySelectorAll(".footer .container").forEach(footer => {
            const links = createSocialLinks(settings, "footer-socials");
            if (links.children.length) footer.appendChild(links);
        });

        const contactContent = document.querySelector(".contato-content");
        if (contactContent) {
            const links = createSocialLinks(settings, "contato-socials");
            if (links.children.length) contactContent.appendChild(links);
        }
    } catch (error) {
        console.error("Não foi possível carregar as redes sociais:", error);
    }
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
    initSocialLinks();
});