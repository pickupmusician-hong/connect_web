/* =======================================================
   CONNECT 공통 JavaScript 모듈
   - 모바일 햄버거 메뉴
   - IntersectionObserver 기반 Reveal 애니메이션
   - 현재 페이지 네비게이션 활성 표시
======================================================= */

/**
 * 모바일 햄버거 메뉴 토글 설정
 */
function setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
}

/**
 * IntersectionObserver 기반 Reveal(페이드업) 애니메이션 설정
 * @param {Object} options - IntersectionObserver 옵션 오버라이드
 * @returns {IntersectionObserver} 생성된 옵저버 인스턴스
 */
function setupRevealObserver(options = {}) {
    const observerOptions = {
        root: options.root || null,
        rootMargin: options.rootMargin || '0px 0px -5% 0px',
        threshold: options.threshold || 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (!options.keepObserving) {
                    obs.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return observer;
}

/**
 * 현재 페이지에 해당하는 네비게이션 링크에 활성 클래스 추가
 */
function markActiveNavLink() {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-link').forEach(link => {
        const linkFile = link.getAttribute('href').split('/').pop().split('?')[0];
        if (linkFile === currentFile) {
            link.classList.add('is-current');
        }
    });
}

/* -------------------------------------------------------
   자동 초기화 (DOMContentLoaded)
   - 메인 페이지(page-home)는 커스텀 옵저버를 사용하므로 기본 Reveal 건너뜀
------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    markActiveNavLink();

    // 메인 페이지는 fullpage 커스텀 옵저버를 사용하므로 기본 reveal 스킵
    if (!document.body.classList.contains('page-home')) {
        setupRevealObserver();
    }
});
