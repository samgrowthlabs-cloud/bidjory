/**
 * Bidjory - Sobre Page Script
 */

const TIMELINE_API_URL = "https://bidjory-api.bidjorysamuel.workers.dev/projects";
const TIMELINE_SETTINGS_CATEGORY = "__site_timeline_settings__";
const DEFAULT_TIMELINE_ITEMS = [
    { year: "2021", description: "Desde cedo desenvolvi uma forte curiosidade por computadores. Nesse período comecei a explorar tecnologia por conta própria e a entender como sistemas e softwares funcionavam." },
    { year: "2022", description: "Comecei a programar de forma autodidata e a aprender na prática. Também realizei pequenos trabalhos freelance na área, ganhando experiência real com desenvolvimento, mesmo de forma inicial." },
    { year: "2023", description: "Tive meu primeiro contato mais profundo com finanças e investimentos. Comecei a estudar o assunto por interesse próprio e a entender como o mercado financeiro funciona." },
    { year: "2024", description: "Aprofundei ainda mais meus estudos em finanças e comecei a pensar em como unir tecnologia, conteúdo e educação financeira em algo mais estruturado." },
    { year: "2025", description: "Criei a ideia de um projeto próprio e comecei a estruturar mentalmente uma possível holding focada em finanças, mídia e tecnologia." },
    { year: "2026", description: "Iniciei o projeto Samzin, um canal focado em finanças e documentários, com a intenção de criar conteúdo educativo e narrativo sobre o tema." }
];

function renderTimeline(timeline, items) {
    timeline.querySelectorAll('.sobre-block, .timeline-loading').forEach(element => element.remove());

    items.forEach((item, index) => {
        const block = document.createElement('div');
        block.className = 'sobre-block';
        block.style.gridRow = String(index + 1);

        const dot = document.createElement('span');
        dot.className = 'timeline-dot';
        dot.setAttribute('aria-hidden', 'true');

        const year = document.createElement('span');
        year.className = 'sobre-year';
        year.textContent = item.year;

        const description = document.createElement('p');
        description.textContent = item.description;

        block.append(dot, year, description);
        timeline.appendChild(block);
    });
}

async function loadTimeline(timeline) {
    let items = DEFAULT_TIMELINE_ITEMS;

    try {
        const response = await fetch(TIMELINE_API_URL);
        if (!response.ok) throw new Error('Erro ao carregar a linha do tempo');

        const records = await response.json();
        const settings = records.find(record => record.category === TIMELINE_SETTINGS_CATEGORY);
        if (settings?.description) {
            const savedItems = JSON.parse(settings.description);
            if (Array.isArray(savedItems)) {
                items = savedItems.filter(item => item?.year && item?.description);
            }
        }
    } catch (error) {
        console.error('Não foi possível carregar a linha do tempo:', error);
    }

    renderTimeline(timeline, items);
}

function initTimelineAnimation(timeline) {
    const cards = [...timeline.querySelectorAll('.sobre-block')];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    const updateTimeline = () => {
        const vh = window.innerHeight;
        const rect = timeline.getBoundingClientRect();
        const start = vh * 0.72;
        const distance = Math.max(rect.height - start + vh * 0.3, 1);
        timeline.style.setProperty('--timeline-progress', Math.min(Math.max((start - rect.top) / distance, 0), 1).toFixed(4));
        const focusLine = vh * 0.5;
        let activeCard = null;
        let closest = Infinity;

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const center = cardRect.top + cardRect.height / 2;
            const visible = cardRect.top < vh * 0.88;
            const focusDistance = Math.abs(center - focusLine);
            const focus = reduceMotion ? 1 : Math.max(0.08, 1 - focusDistance / (vh * 0.62));
            card.style.setProperty('--focus', focus.toFixed(3));
            card.classList.toggle('is-visible', visible);
            card.classList.toggle('is-passed', center < focusLine);
            if (visible && cardRect.bottom > 0 && focusDistance < closest) {
                closest = focusDistance;
                activeCard = card;
            }
        });

        cards.forEach(card => card.classList.toggle('is-active', card === activeCard));
        ticking = false;
    };

    const requestUpdate = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateTimeline);
        }
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    updateTimeline();
}

document.addEventListener('DOMContentLoaded', async () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    if (window.Bidjory?.theme) {
        window.Bidjory.applyTheme(window.Bidjory.theme);
    }

    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    await loadTimeline(timeline);
    initTimelineAnimation(timeline);
});
