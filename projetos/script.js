/**
 * Bidjory - Projetos Page Script
 * Sistema dinâmico de projetos
 */

// ==========================================
// DADOS DOS PROJETOS
// ==========================================
const projects = [
    {
        title: "SamGrowthLabs",
        description: "Empresa e estrutura de negócios e mídia. Hub central para desenvolvimento de produtos digitais, conteúdo e growth.",
        status: "active",
        tags: ["Negócios", "Mídia", "Growth"],
        year: "2025",
        link: "https://samgrowthlabs.com.br",
        category: "business",
        progress: 60
    },
    {
        title: "Educafinance",
        description: "Educação financeira simplificada.",
        status: "building",
        tags: ["Educação", "Finanças", "Cursos"],
        year: "2025",
        link: "#",
        category: "education",
        progress: 40
    },
    {
        title: "Samzin",
        description: "Conteúdo, histórias e vídeos de alta qualidade sobre finanças, mercado financeiro e comportamento econômico.",
        status: "active",
        tags: ["Conteúdo", "Vídeos", "Storytelling"],
        year: "2024",
        link: "https://samzin.samgrowthlabs.com.br",
        category: "media",
        progress: 90
    },
 
];

const statusLabels = {
    active: "Ativo",
    testing: "Em laboratório",
    building: "Em desenvolvimento",
    inactive: "Pausado"
};

// ==========================================
// RENDERIZAÇÃO
// ==========================================
function renderProjects() {
    const grid = document.getElementById('projetosGrid');
    if (!grid) return;

    grid.innerHTML = '';

    projects.forEach((project, index) => {
        const card = document.createElement('article');
        card.className = 'projeto-card reveal';
        card.style.transitionDelay = `${index * 80}ms`;

        const statusLabel = statusLabels[project.status] || project.status;
        const statusClass = `status-${project.status}`;
        const hasLink = project.link && project.link !== '#';
        const linkHref = hasLink ? project.link : '#';
        const linkTarget = hasLink ? ' target="_blank" rel="noopener noreferrer"' : '';
        const linkClass = hasLink ? 'projeto-link projeto-link--active' : 'projeto-link projeto-link--disabled';
        const linkText = hasLink ? 'Ver projeto' : 'Em breve';
        const linkIcon = hasLink 
            ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M4 3h7v7M11 3L3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            : '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M5 7h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

        // Cor da barra de progresso baseada no status
        const progressColors = {
            active: 'var(--status-active)',
            testing: 'var(--status-testing)',
            building: 'var(--status-building)',
            inactive: 'var(--status-inactive)'
        };

        card.innerHTML = `
            <div class="projeto-header">
                <h3 class="projeto-title">${project.title}</h3>
                <span class="status ${statusClass}">${statusLabel}</span>
            </div>
            <p class="projeto-desc">${project.description}</p>
            <div class="projeto-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="projeto-progress">
                <div class="projeto-progress-bar" style="width: ${project.progress}%; background: ${progressColors[project.status]};"></div>
            </div>
            <div class="projeto-footer">
                <span class="projeto-year">${project.year}</span>
                <a href="${linkHref}" class="${linkClass}"${linkTarget} aria-label="${linkText}: ${project.title}">
                    ${linkText}
                    ${linkIcon}
                </a>
            </div>
        `;

        grid.appendChild(card);
    });

    // Re-inicializa animações
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
    projects,
    renderProjects,
    addProject: (project) => {
        projects.push(project);
        renderProjects();
    }
};

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    renderProjects();
});