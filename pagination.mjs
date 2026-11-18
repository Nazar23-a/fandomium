export let itemsPerPage = 4;
export let currentPage = 1;

export function resetPage() {currentPage = 1}
export function pagination(list, render, selector) {
    const container = document.querySelector('#pagination');
    container.innerHTML = '';
    const totalPages = Math.ceil(list.length / itemsPerPage);
    for(let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-button');
        button.classList.toggle('active', i === currentPage);
        button.addEventListener('click', () => {
            currentPage = i;
            pagination(list, render, selector);
            const pageItems = getPageItems(list);
            render(pageItems, selector);
            window.scrollTo({ top: 0 });
        });
        container.appendChild(button);
    }
}
export function getPageItems(list) {
    const start = (currentPage - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
}