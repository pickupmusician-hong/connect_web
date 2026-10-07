/* =======================================================
   메인 페이지 전용 JavaScript (index.html)
   - 공지사항 미리보기 렌더링
   - Canvas 파티클 네트워크 애니메이션
   - 사업영역 가로 슬라이더
   - 풀페이지 세로 스크롤 제어
   - 섹션별 헤더 테마 동기화
======================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const fpWrapper = document.getElementById('fp-wrapper');
    const header = document.getElementById('header');
    const sections = Array.from(document.querySelectorAll('.fp-section'));
    const businessSec = document.getElementById('business');
    let triggerNetworkAnimation = null;

    /* -------------------------------------------------------
       1. 공지사항 미리보기 렌더링 (data.js의 noticeData 사용)
    ------------------------------------------------------- */
    const listContainer = document.getElementById('main-notice-list');
    if (listContainer && typeof noticeData !== 'undefined') {
        noticeData.slice(0, 3).forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="notice.html?id=${index}" class="notice-item">
                    <h3 class="item-title">${item.title}</h3>
                    <span class="item-date">${item.date}</span>
                </a>
            `;
            listContainer.appendChild(li);
        });
    }

    /* -------------------------------------------------------
       2. Canvas '연결' 애니메이션 — 위/아래에서 흰색 선이 중앙에서 만남
    ------------------------------------------------------- */
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let strands = [];
        let meetParticles = [];
        let startTime = 0;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // 만남 지점 (오른쪽 중앙)
        function getMeetPoint() {
            return {
                x: canvas.width * 0.75,
                y: canvas.height * 0.5
            };
        }

        function createStrands() {
            const meet = getMeetPoint();
            const w = canvas.width;
            const h = canvas.height;

            // 이전 버전의 맘에 드셨던 '꼬불꼬불한' S자 궤적을 위한 탄젠트 벡터
            const tx = w * 0.35;
            const ty = h * 0.15;

            // 선이 맞닿을 때의 픽셀 빈틈(버벅임)을 완벽히 덮기 위해 
            // 위쪽 선만 아주 미세하게(1.5%) 중앙점(meet)을 파고들어(오버랩) 덮어주게 설정
            const ox = tx * 0.015;
            const oy = ty * 0.015;

            return [
                // 위쪽 선: 이전 버전의 꼬불꼬불한 형태 복원
                {
                    startX: w * 0.2,
                    startY: -50,
                    cp1x: w * 0.85,
                    cp1y: h * 0.2,
                    // 미세 오버랩을 적용하여 빈틈 없이 겹치게 하되, 꼬임 버그 방지를 위해 cp2도 함께 연장
                    cp2x: (meet.x - tx) + ox, 
                    cp2y: (meet.y - ty) + oy, 
                    endX: meet.x + ox,
                    endY: meet.y + oy,
                    progress: 0,
                    delay: 0
                },
                // 아래쪽 선: 이전 버전의 꼬불꼬불한 형태 복원
                {
                    startX: w * 0.9,
                    startY: h + 50,
                    cp1x: w * 0.15,
                    cp1y: h * 0.8,
                    cp2x: meet.x + tx, 
                    cp2y: meet.y + ty,
                    endX: meet.x,
                    endY: meet.y,
                    progress: 0,
                    delay: 0
                }
            ];
        }

        // 만남 파티클
        class MeetParticle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.5 + Math.random() * 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.life = 1.0;
                this.decay = 0.006 + Math.random() * 0.012;
                this.radius = 1.5 + Math.random() * 3;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vx *= 0.98;
                this.vy *= 0.98;
                this.life -= this.decay;
            }
            draw(ctx) {
                if (this.life <= 0) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * this.life, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.life * 0.9})`;
                ctx.fill();
            }
        }

        function initStrands() {
            resizeCanvas();
            strands = createStrands();
            meetParticles = [];
            hasConnected = false;
            animationDone = false;
            explosionGlowAlpha = 1.0;
            startTime = performance.now();
        }

        // 베지에 곡선 좌표
        function bezierPoint(t, sx, sy, c1x, c1y, c2x, c2y, ex, ey) {
            const u = 1 - t;
            return {
                x: u*u*u*sx + 3*u*u*t*c1x + 3*u*t*t*c2x + t*t*t*ex,
                y: u*u*u*sy + 3*u*u*t*c1y + 3*u*t*t*c2y + t*t*t*ey
            };
        }

        function drawStrand(s) {
            if (s.progress <= 0) return;
            const t = Math.min(s.progress, 1);

            // 곡선 그리기
            ctx.beginPath();
            const steps = Math.floor(t * 200);
            for (let i = 0; i <= steps; i++) {
                const ti = i / 200;
                const pt = bezierPoint(ti, s.startX, s.startY, s.cp1x, s.cp1y, s.cp2x, s.cp2y, s.endX, s.endY);
                if (i === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            }

            const opacity = window.innerWidth > 768 ? 1 : (0.85 * Math.min(t * 2, 1));
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 24;
            ctx.lineCap = 'round';
            ctx.stroke();

            // 선 끝 빛나는 점 (폭발 후 서서히 같이 사라짐)
            if (explosionGlowAlpha > 0) {
                const head = bezierPoint(t, s.startX, s.startY, s.cp1x, s.cp1y, s.cp2x, s.cp2y, s.endX, s.endY);
                const dotAlpha = 0.95 * explosionGlowAlpha;
                const glowAlpha = 0.7 * explosionGlowAlpha;

                ctx.beginPath();
                ctx.arc(head.x, head.y, 5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${dotAlpha})`;
                ctx.fill();

                // 글로우
                const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 25);
                glow.addColorStop(0, `rgba(255, 255, 255, ${glowAlpha})`);
                glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.beginPath();
                ctx.arc(head.x, head.y, 25, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();
            }
        }

        let hasConnected = false;
        let animationDone = false;
        let isStarted = false;
        let explosionGlowAlpha = 1.0;

        function animate() {
            if (!isStarted) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const elapsed = (performance.now() - startTime) / 1000;

            let allConnected = true;

            // 선 진행
            strands.forEach(s => {
                const adjustedTime = elapsed - s.delay;
                if (adjustedTime < 0) {
                    s.progress = 0;
                    allConnected = false;
                } else if (adjustedTime < 1.5) {
                    const raw = adjustedTime / 1.5;
                    s.progress = raw < 0.5
                        ? 4 * raw * raw * raw
                        : 1 - Math.pow(-2 * raw + 2, 3) / 2;
                    // 시각적 딜레이를 없애기 위해 97% 진행 시점부터 미리 폭발(글로우) 트리거
                    if (s.progress < 0.97) allConnected = false;
                } else {
                    s.progress = 1;
                }
                drawStrand(s);
            });

            // 연결 시 파티클 폭발
            if (allConnected && !hasConnected) {
                hasConnected = true;
                const meet = getMeetPoint();
                for (let i = 0; i < 10; i++) {
                    meetParticles.push(new MeetParticle(
                        meet.x + (Math.random() - 0.5) * 12,
                        meet.y + (Math.random() - 0.5) * 12
                    ));
                }
            }

            // 연결 글로우 (폭발 시 터지고 서서히 사라짐)
            if (allConnected && explosionGlowAlpha > 0) {
                const meet = getMeetPoint();
                const a1 = 0.85 * explosionGlowAlpha;
                const a2 = 0.35 * explosionGlowAlpha;
                const glow = ctx.createRadialGradient(meet.x, meet.y, 0, meet.x, meet.y, 80);
                glow.addColorStop(0, `rgba(255, 255, 255, ${a1})`);
                glow.addColorStop(0.4, `rgba(255, 255, 255, ${a2})`);
                glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.beginPath();
                ctx.arc(meet.x, meet.y, 80, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();
                
                // 매 프레임 투명도 감소 (약 1초 동안 페이드아웃)
                explosionGlowAlpha -= 0.015;
            }

            // 파티클 업데이트
            meetParticles = meetParticles.filter(p => p.life > 0);
            meetParticles.forEach(p => { p.update(); p.draw(ctx); });

            if (allConnected && meetParticles.length === 0 && explosionGlowAlpha <= 0) {
                animationDone = true;
                return; // 파티클과 폭발 글로우가 모두 사라지면 루프 정지 (선과 25px 작은 점은 렌더링 유지)
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        triggerNetworkAnimation = () => {
            if (!isStarted) {
                isStarted = true;
                initStrands();
                animate();
            }
        };

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (isStarted) {
                    cancelAnimationFrame(animationFrameId);
                    initStrands();
                    // 리사이즈 시 이미 연결된 상태면 즉시 완성된 모습으로
                    if (animationDone || hasConnected) {
                        strands.forEach(s => s.progress = 1);
                        hasConnected = true;
                        meetParticles = []; // 폭발 파티클 생략
                        animate(); // 1 프레임만 그려서 고정
                    } else {
                        animate();
                    }
                }
            }, 200);
        });
    }

    /* -------------------------------------------------------
       3. 사업영역(Business) 가로 스크롤 및 테마 동기화
    ------------------------------------------------------- */
    const bizSlider = document.getElementById('biz-slider');
    const bizDots = document.querySelectorAll('.biz-dot');
    const bizPrev = document.querySelector('.biz-prev');
    const bizNext = document.querySelector('.biz-next');

    function updateBusinessTheme(index = -1) {
        if (!bizSlider || !businessSec) return;
        if (index === -1) {
            index = Math.round(bizSlider.scrollLeft / bizSlider.clientWidth);
        }

        // 화살표 버튼 비활성화 상태 업데이트
        if (bizPrev) bizPrev.disabled = index === 0;
        if (bizNext) bizNext.disabled = index === 1;

        // 도트 UI 업데이트
        bizDots.forEach(dot => dot.classList.remove('active'));
        if (bizDots[index]) bizDots[index].classList.add('active');

        // 슬라이드 클래스 토글 (CSS 연동용)
        businessSec.classList.remove('slide0-active', 'slide1-active');
        businessSec.classList.add(`slide${index}-active`);

        // 현재 활성화된 화면이 business 일 때만 상단 헤더 색상 연동
        if (businessSec.classList.contains('is-active')) {
            // 비디오 슬라이드로 변경되면서 1번, 2번 슬라이드 모두 배경이 어둡기 때문에 항상 화이트 헤더(dark-mode) 유지
            header.className = 'header dark-mode';
        }
    }

    if (bizSlider) {
        bizSlider.addEventListener('scroll', () => { updateBusinessTheme(); }, { passive: true });

        bizDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                bizSlider.scrollTo({
                    left: index * bizSlider.clientWidth,
                    behavior: 'smooth'
                });
            });
        });

        if (bizPrev) bizPrev.addEventListener('click', () => bizSlider.scrollBy({ left: -bizSlider.clientWidth, behavior: 'smooth' }));
        if (bizNext) bizNext.addEventListener('click', () => bizSlider.scrollBy({ left: bizSlider.clientWidth, behavior: 'smooth' }));

        // PC용 마우스 드래그 스와이프
        let isBizDragging = false;
        let startX;
        let scrollLeft;

        bizSlider.addEventListener('mousedown', (e) => {
            isBizDragging = true;
            startX = e.pageX - bizSlider.offsetLeft;
            scrollLeft = bizSlider.scrollLeft;
            bizSlider.style.scrollBehavior = 'auto';
        });
        bizSlider.addEventListener('mouseleave', () => {
            isBizDragging = false;
            bizSlider.style.scrollBehavior = 'smooth';
        });
        bizSlider.addEventListener('mouseup', () => {
            isBizDragging = false;
            bizSlider.style.scrollBehavior = 'smooth';
        });
        bizSlider.addEventListener('mousemove', (e) => {
            if (!isBizDragging) return;
            e.preventDefault();
            const x = e.pageX - bizSlider.offsetLeft;
            const walk = (x - startX) * 1.5;
            bizSlider.scrollLeft = scrollLeft - walk;
        });
    }

    /* -------------------------------------------------------
       4. 세로 스크롤 시 섹션 감지 (IntersectionObserver)
    ------------------------------------------------------- */
    const observerOptions = { root: fpWrapper, rootMargin: '0px', threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const reveals = entry.target.querySelectorAll('.reveal');
                reveals.forEach(el => el.classList.add('is-visible'));

                sections.forEach(el => el.classList.remove('is-active'));
                entry.target.classList.add('is-active');

                // 섹션별 헤더 테마 변경
                if (entry.target.id === 'about') {
                    header.className = 'header blue-mode';
                    if (triggerNetworkAnimation) triggerNetworkAnimation();
                } else if (entry.target.id === 'tech') {
                    header.className = 'header tech-mode';
                } else if (entry.target.id === 'business') {
                    updateBusinessTheme();
                    // CCTV 애니메이션은 최초 1회만 실행
                    if (!businessSec.classList.contains('cctv-done')) {
                        businessSec.classList.add('cctv-done');
                    }
                } else {
                    header.className = 'header';
                }
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));

    // 하단 화살표 클릭 시 부드러운 스크롤 이동
    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                fpWrapper.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* -------------------------------------------------------
       5. PC 마우스 세로 휠 이벤트 제어 (한 섹션씩 이동)
    ------------------------------------------------------- */
    let isScrolling = false;
    fpWrapper.addEventListener('wheel', (e) => {
        if (window.innerWidth <= 768) return;

        // 가로 스와이프 제스처(매직마우스, 트랙패드 등) 감지 시 풀페이지 상하 스크롤을 막음
        if (e.target.closest('#biz-slider') && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            return;
        }

        if (isScrolling) {
            e.preventDefault();
            return;
        }

        let currentIdx = Math.round(fpWrapper.scrollTop / fpWrapper.clientHeight);
        let nextIdx = currentIdx;

        if (e.deltaY > 0 && currentIdx < sections.length - 1) {
            nextIdx++;
        } else if (e.deltaY < 0 && currentIdx > 0) {
            nextIdx--;
        }

        if (nextIdx !== currentIdx) {
            e.preventDefault();
            isScrolling = true;
            fpWrapper.scrollTo({
                top: sections[nextIdx].offsetTop,
                behavior: 'smooth'
            });
            setTimeout(() => { isScrolling = false; }, 800);
        }
    }, { passive: false });
});
