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
        block.dataset.side = index % 2 === 0 ? 'left' : 'right';
        block.dataset.step = String(index + 1).padStart(2, '0');

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
        const start = vh * (window.innerWidth <= 768 ? 0.38 : 0.32);
        const distance = Math.max(rect.height - vh * (window.innerWidth <= 768 ? 0.5 : 0.42), 1);
        timeline.style.setProperty('--timeline-progress', Math.min(Math.max((start - rect.top) / distance, 0), 1).toFixed(4));
        const focusLine = vh * (window.innerWidth <= 768 ? 0.46 : 0.5);
        let activeCard = null;
        let closest = Infinity;

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const center = cardRect.top + cardRect.height / 2;
            const visible = cardRect.top < vh * 0.88;
            const focusDistance = Math.abs(center - focusLine);
            const focusRange = window.innerWidth <= 768 ? vh * 0.72 : vh * 0.66;
            const focus = reduceMotion ? 1 : Math.max(0.04, 1 - focusDistance / focusRange);
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


function initVisionAnimation() {
    const vision = document.querySelector('.sobre-visao');
    if (!vision) return;

    const text = vision.querySelector('p');
    if (text && !text.dataset.animated) {
        const content = text.textContent.trim();
        text.setAttribute('aria-label', content);
        text.textContent = '';
        content.split(/\s+/).forEach((word, index, words) => {
            const span = document.createElement('span');
            span.className = 'vision-word';
            span.setAttribute('aria-hidden', 'true');
            span.style.setProperty('--word-index', index);
            span.textContent = word + (index < words.length - 1 ? '\u00a0' : '');
            text.appendChild(span);
        });
        text.dataset.animated = 'true';
    }

    const observer = new IntersectionObserver(([entry]) => {
        vision.classList.toggle('is-focused', entry.isIntersecting);
    }, {
        threshold: window.innerWidth <= 768 ? 0.45 : 0.62,
        rootMargin: '-12% 0px -12% 0px'
    });

    observer.observe(vision);
}

document.addEventListener('DOMContentLoaded', async () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    initVisionAnimation();

    if (window.Bidjory?.theme) {
        window.Bidjory.applyTheme(window.Bidjory.theme);
    }

    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    await loadTimeline(timeline);
    initTimelineAnimation(timeline);
});
