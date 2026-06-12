/**
 * Bidjory - Projetos Page Script
 * Sistema dinâmico de projetos com Cloudflare D1
 */

let projects = [];

const API_URL = "https://bidjory-api.bidjorysamuel.workers.dev/projects";

const statusLabels = {
    active: "Ativo",
    testing: "Em laboratório",
    building: "Em desenvolvimento",
    inactive: "Pausado"
};

// ==========================================
// CARREGAR PROJETOS DO D1
// ==========================================
async function loadProjects() {
    const grid = document.getElementById('projetosGrid');
    if (!grid) return;

    grid.innerHTML = `
        <p class="projetos-loading">
            Carregando projetos...
        </p>
    `;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Erro ao buscar projetos");
        }

        projects = await response.json();

        renderProjects();

    } catch (error) {
        console.error("Erro ao carregar projetos:", error);

        grid.innerHTML = `
            <p class="projetos-error">
                Não foi possível carregar os projetos agora.
            </p>
        `;
    }
}

// ==========================================
// RENDERIZAÇÃO
// ==========================================
function renderProjects() {
    const grid = document.getElementById('projetosGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!projects.length) {
        grid.innerHTML = `
            <p class="projetos-empty">
                Nenhum projeto cadastrado ainda.
            </p>
        `;
        return;
    }

    projects.forEach((project, index) => {
        const card = document.createElement('article');
        card.className = 'projeto-card reveal';
        card.style.transitionDelay = `${index * 80}ms`;

        const statusLabel = statusLabels[project.status] || project.status || "Indefinido";
        const statusClass = `status-${project.status || "building"}`;

        const hasLink = project.link && project.link !== '#';
        const linkHref = hasLink ? project.link : '#';
        const linkTarget = hasLink ? ' target="_blank" rel="noopener noreferrer"' : '';
        const linkClass = hasLink ? 'projeto-link projeto-link--active' : 'projeto-link projeto-link--disabled';
        const linkText = hasLink ? 'Ver projeto' : 'Em breve';

        const linkIcon = hasLink 
            ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M4 3h7v7M11 3L3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            : '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M5 7h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

        const progressColors = {
            active: 'var(--status-active)',
            testing: 'var(--status-testing)',
            building: 'var(--status-building)',
            inactive: 'var(--status-inactive)'
        };

        const tags = Array.isArray(project.tags) ? project.tags : [];
        const progress = Math.min(Math.max(Number(project.progress || 0), 0), 100);
        const progressColor = progressColors[project.status] || 'var(--status-building)';

        card.innerHTML = `
            <div class="projeto-header">
                <h3 class="projeto-title">${project.title || ""}</h3>
                <span class="status ${statusClass}">${statusLabel}</span>
            </div>

            <p class="projeto-desc">${project.description || ""}</p>

            <div class="projeto-tags">
                ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>

            <div class="projeto-progress">
                <div 
                    class="projeto-progress-bar" 
                    style="width: ${progress}%; background: ${progressColor};">
                </div>
            </div>

            <div class="projeto-footer">
                <span class="projeto-year">${project.year || ""}</span>

                <a href="${linkHref}" class="${linkClass}"${linkTarget} aria-label="${linkText}: ${project.title || "Projeto"}">
                    ${linkText}
                    ${linkIcon}
                </a>
            </div>
        `;

        grid.appendChild(card);
    });

    initRevealAnimations();
}

// ==========================================
// ANIMAÇÕES
// ==========================================
function initRevealAnimations() {
    setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(el);
        });
    }, 50);
}

// ==========================================
// EXPORTA DADOS
// ==========================================
window.BidjoryProjects = {
    get projects() {
        return projects;
    },
    renderProjects,
    reloadProjects: loadProjects
};

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    loadProjects();
});