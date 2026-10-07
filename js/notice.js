/* =======================================================
   공지사항 전용 JavaScript (notice.html)
   - 목록/상세 뷰 전환
   - URL 쿼리 파라미터 & History API 라우팅
   - data.js의 noticeData 사용
======================================================= */

const itemsPerPage = 10;
let currentPage = 1;

const listView = document.getElementById('notice-list-view');
const detailView = document.getElementById('notice-detail-view');
const listContainer = document.getElementById('notice-list-container');
const paginationContainer = document.getElementById('pagination-container');

function renderList(page) {
    listContainer.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentData = noticeData.slice(start, end);

    currentData.forEach((item, index) => {
        const actualIndex = start + index;
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="?id=${actualIndex}" class="notice-item" onclick="event.preventDefault(); showDetail(${actualIndex}, true)">
                <h3 class="item-title">${item.title}</h3>
                <span class="item-date">${item.date}</span>
            </a>
        `;
        listContainer.appendChild(li);
    });
}

function renderPagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(noticeData.length / itemsPerPage) || 1;
    if (totalPages <= 1) return;
}

function updatePage() {
    renderList(currentPage);
    renderPagination();
}

function showDetail(index, pushToHistory = false) {
    const data = noticeData[index];
    if (!data) return;

    document.getElementById('detail-title').innerText = data.title;
    document.getElementById('detail-date').innerText = data.date;
    document.getElementById('detail-body').innerHTML = data.content;

    listView.style.display = 'none';
    detailView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (pushToHistory) {
        history.pushState({ view: 'detail', index: index }, '', '?id=' + index);
    }
}

function showList(pushToHistory = false) {
    detailView.style.display = 'none';
    listView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (pushToHistory) {
        history.pushState({ view: 'list' }, '', window.location.pathname);
    }
}

window.addEventListener('popstate', (e) => {
    if (e.state && e.state.view === 'detail') {
        showDetail(e.state.index, false);
    } else {
        showList(false);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('id')) {
        const id = parseInt(params.get('id'));
        if (!isNaN(id) && id >= 0 && id < noticeData.length) {
            renderList(currentPage);
            showDetail(id, false);
            history.replaceState({ view: 'detail', index: id }, '', '?id=' + id);
            return;
        }
    }
    renderList(currentPage);
    history.replaceState({ view: 'list' }, '', window.location.pathname);
});
