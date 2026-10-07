/* =======================================================
   회사소개 전용 JavaScript (about.html)
   - 타이핑 애니메이션
   - SVG 배경선 드로잉
======================================================= */

const titleStr = 'Who We Are ?';
const descStr = '인간과 기술의 결합으로 무한한 미래를 설계하는 파트너,\n커넥트입니다.';

const titleEl = document.getElementById('type-title');
const descEl = document.getElementById('type-desc');
const titleCursor = document.querySelector('.title-cursor');
const descCursor = document.querySelector('.desc-cursor');
const bgLine = document.querySelector('.hero-bg-line');

let tIdx = 0;
let dIdx = 0;

function typeTitle() {
    if (tIdx === 0) bgLine.classList.add('animate');

    if (tIdx < titleStr.length) {
        if (titleStr[tIdx] === '\n') {
            titleEl.appendChild(document.createElement('br'));
        } else {
            titleEl.appendChild(document.createTextNode(titleStr[tIdx]));
        }
        tIdx++;
        setTimeout(typeTitle, 100);
    } else {
        titleCursor.style.display = 'none';
        descCursor.style.display = 'inline-block';
        setTimeout(typeDesc, 300);
    }
}

function typeDesc() {
    if (dIdx < descStr.length) {
        if (descStr[dIdx] === '\n') {
            descEl.appendChild(document.createElement('br'));
        } else {
            descEl.appendChild(document.createTextNode(descStr[dIdx]));
        }
        dIdx++;
        setTimeout(typeDesc, 50);
    }
}

window.onload = () => {
    const path = document.querySelector('.hero-bg-line path');
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    typeTitle();
};
