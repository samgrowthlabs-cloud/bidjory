/**
 * Bidjory - Projetos Page Script
 * Sistema dinâmico de projetos com Cloudflare D1
 */

let projects = [];

const API_URL = "https://bidjory-api.bidjorysamuel.workers.dev/projects";
const PROJECTS_SOCIAL_SETTINGS_CATEGORY = "__site_social_settings__";
const PROJECTS_TIMELINE_SETTINGS_CATEGORY = "__site_timeline_settings__";

const statusLabels = {
    active: "Ativo",
    building: "Em desenvolvimento",
    testing: "Em laboratório",
    beta: "Beta público",
    maintenance: "Manutenção",
    private: "Privado",
    archived: "Arquivado",
    inactive: "Descontinuado"
};

// ==========================================
// COR DINÂMICA DO PROGRESSO
// ==========================================
function getProgressColor(progress) {
    if (progress <= 50) {
        // vermelho → azul
        const ratio = progress / 50;

        const r = Math.round(239 + (59 - 239) * ratio);
        const g = Math.round(68 + (130 - 68) * ratio);
        const b = Math.round(68 + (246 - 68) * ratio);

        return `rgb(${r}, ${g}, ${b})`;
    }

    // azul → verde
    const ratio = (progress - 50) / 50;

    const r = Math.round(59 + (34 - 59) * ratio);
    const g = Math.round(130 + (197 - 130) * ratio);
    const b = Math.round(246 + (94 - 246) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
}

// ==========================================
// CARREGAR PROJETOS DO D1
// ==========================================
async function loadProjects() {
    const grid = document.getElementById('projetosGrid');
    if (!grid) return;

    grid.setAttribute('aria-busy', 'true');
    grid.innerHTML = Array.from({ length: 6 }, (_, index) => `
        <article class="projeto-card projeto-skeleton" aria-hidden="true" style="--skeleton-delay: ${index * 70}ms">
            <div class="skeleton-block skeleton-banner"></div>
            <div class="skeleton-block skeleton-avatar"></div>
            <div class="skeleton-heading"><div class="skeleton-block skeleton-title"></div><div class="skeleton-block skeleton-status"></div></div>
            <div class="skeleton-block skeleton-line skeleton-line--wide"></div>
            <div class="skeleton-block skeleton-line skeleton-line--short"></div>
            <div class="skeleton-tags"><div class="skeleton-block skeleton-tag"></div><div class="skeleton-block skeleton-tag skeleton-tag--short"></div></div>
            <div class="skeleton-block skeleton-progress"></div>
            <div class="skeleton-footer"><div class="skeleton-block skeleton-year"></div><div class="skeleton-block skeleton-button"></div></div>
        </article>
    `).join('');

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Erro ao buscar projetos");
        }

        const allProjects = await response.json();
        projects = allProjects.filter(project =>
            project.category !== PROJECTS_SOCIAL_SETTINGS_CATEGORY &&
            project.category !== PROJECTS_TIMELINE_SETTINGS_CATEGORY
        );

        renderProjects();

    } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        grid.removeAttribute('aria-busy');

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

    grid.removeAttribute('aria-busy');
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

        const clickableStatuses = ["active", "building", "beta"];


        const hasLink =
            clickableStatuses.includes(project.status) &&
            project.link &&
            project.link !== "#";

        const linkHref = hasLink ? project.link : "#";

        const linkTarget = hasLink
            ? ' target="_blank" rel="noopener noreferrer"'
            : "";

        const linkClass = hasLink
            ? "projeto-link projeto-link--active"
            : "projeto-link projeto-link--disabled";

        const disabledLinkTexts = {
            testing: "Em breve",
            maintenance: "Em manutenção",
            private: "Privado",
            archived: "Arquivado",
            inactive: "Descontinuado"
        };

        const linkText = hasLink
            ? "Ver projeto"
            : disabledLinkTexts[project.status] || "Indisponível";

        const linkIcon = hasLink
                ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 3h7v7M11 3L3 11" stroke="currentColor" stroke-width="1.5"/></svg>'
                : '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

        const tags = Array.isArray(project.tags) ? project.tags : [];
        const progress = Math.min(Math.max(Number(project.progress || 0), 0), 100);
        const progressColor = getProgressColor(progress);

        card.innerHTML = `

            ${
            project.banner
                ? `<div class="projeto-banner"><img src="${project.banner}" alt="Banner do projeto ${project.title || ""}"></div>`
                : `<div class="projeto-banner projeto-banner--fallback"></div>`
            }

            ${
            project.avatar
                ? `<div class="projeto-avatar"><img src="${project.avatar}" alt="${project.title || "Projeto"}"></div>`
                : `<div class="projeto-avatar projeto-avatar--fallback">B</div>`
            }
            <div class="projeto-header">
                <h3 class="projeto-title">${project.title || ""}</h3>
                <span class="status ${statusClass}">${statusLabel}</span>
            </div>

            <p class="projeto-desc">${project.description || ""}</p>

            <div class="projeto-tags">
                ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>

            <div class="projeto-progress-row">
                <div class="projeto-progress">
                    <div
                        class="projeto-progress-bar"
                        style="width: ${progress}%; background: ${progressColor};">
                    </div>
                </div>

                <span class="projeto-progress-percent">${progress}%</span>
            </div>

            <div class="projeto-footer">
                <span class="projeto-year">${project.year || ""}</span>

                <div class="projeto-actions">
                    <button class="projeto-expand" type="button" aria-label="Ver detalhes de ${project.title || "Projeto"}">Expandir <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M5 2H2v3M9 2h3v3M5 12H2V9m7 3h3V9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>
                    <a href="${linkHref}" class="${linkClass}"${linkTarget} aria-label="${linkText}: ${project.title || "Projeto"}">
                        ${linkText}
                        ${linkIcon}
                    </a>
                </div>
            </div>
        `;

        card.querySelector('.projeto-expand').addEventListener('click', () => {
            openProjectModal(project, { statusLabel, statusClass, progress, progressColor, hasLink, linkHref, linkText });
        });

        grid.appendChild(card);
    });

    initRevealAnimations();
}

// ==========================================
// ANIMAÇÕES
// ==========================================
function openProjectModal(project, details) {
    document.querySelector('.projeto-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'projeto-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'projetoModalTitle');
    const tags = Array.isArray(project.tags) ? project.tags : [];
    modal.innerHTML = `
        <div class="projeto-modal-backdrop" data-close-modal></div>
        <article class="projeto-modal-content">
            <button class="projeto-modal-close" type="button" data-close-modal aria-label="Fechar detalhes"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>
            <div class="projeto-modal-banner ${project.banner ? '' : 'projeto-banner--fallback'}">${project.banner ? `<img src="${project.banner}" alt="Banner do projeto ${project.title || ''}">` : ''}</div>
            <div class="projeto-modal-body">
                <div class="projeto-modal-heading">
                    ${project.avatar ? `<div class="projeto-modal-avatar"><img src="${project.avatar}" alt=""></div>` : `<div class="projeto-modal-avatar projeto-avatar--fallback">B</div>`}
                    <div><span class="status ${details.statusClass}">${details.statusLabel}</span><h2 id="projetoModalTitle">${project.title || ''}</h2></div>
                </div>
                <p class="projeto-modal-desc">${project.description || ''}</p>
                <div class="projeto-tags">${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                <div class="projeto-modal-meta"><div><span>Progresso</span><strong>${details.progress}%</strong></div><div class="projeto-progress"><div class="projeto-progress-bar" style="width:${details.progress}%; background:${details.progressColor}"></div></div></div>
                <div class="projeto-modal-footer"><span class="projeto-year">${project.year || ''}</span>${details.hasLink ? `<a href="${details.linkHref}" class="projeto-link projeto-link--active" target="_blank" rel="noopener noreferrer">Abrir projeto <span aria-hidden="true">↗</span></a>` : `<span class="projeto-link projeto-link--disabled">${details.linkText}</span>`}</div>
            </div>
        </article>`;
    const closeModal = () => {
        modal.classList.remove('is-open');
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', handleKeydown);
        setTimeout(() => modal.remove(), 220);
    };
    const handleKeydown = event => { if (event.key === 'Escape') closeModal(); };
    modal.querySelectorAll('[data-close-modal]').forEach(element => element.addEventListener('click', closeModal));
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleKeydown);
    requestAnimationFrame(() => { modal.classList.add('is-open'); modal.querySelector('.projeto-modal-close').focus(); });
}
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