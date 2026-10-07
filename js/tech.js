/* =======================================================
   핵심기술 전용 JavaScript (tech.html)
   - 아코디언 카드 인터랙션
======================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const accCards = document.querySelectorAll('.acc-card');

    accCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                accCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            }
        });

        card.addEventListener('click', () => {
            accCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
});
