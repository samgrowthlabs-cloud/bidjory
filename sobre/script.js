/**
 * Bidjory - Sobre Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Atualiza ano
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Aplica tema (herdado do global via window.Bidjory se disponível)
    if (window.Bidjory && window.Bidjory.theme) {
        window.Bidjory.applyTheme(window.Bidjory.theme);
    }

    const timeline = document.getElementById('timeline');
    if (!timeline) return;
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
        cards.forEach((card) => {
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
        cards.forEach((card) => card.classList.toggle('is-active', card === activeCard));
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
});
