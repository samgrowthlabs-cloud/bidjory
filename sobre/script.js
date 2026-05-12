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
});