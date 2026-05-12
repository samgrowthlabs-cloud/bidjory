/**
 * Bidjory - Contato Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    if (window.Bidjory && window.Bidjory.theme) {
        window.Bidjory.applyTheme(window.Bidjory.theme);
    }
});