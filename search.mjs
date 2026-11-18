const search = document.querySelector("#search");
const searchButton = document.querySelector("#search-button");
const topButton = document.getElementById("top-button");
const container = document.querySelector('#pagination');

import {itemsPerPage, getPageItems, pagination, resetPage} from "./pagination.mjs";

export function searchFn(list, render, selector) {
    document.querySelector('.nothing')?.remove();

    const text = search.value.toLowerCase().trim();
    const section = document.querySelector("section");
    let buttons = document.querySelectorAll(".pagination-button");
    const filtered = [...list].filter(element => {
        const name = element.name.toLowerCase();
        return name.includes(text);
    });
    const pageItems = getPageItems(filtered);
    if (filtered.length === 0) {
        section.textContent = ``;
        let nothing = document.createElement("h1");
        nothing.classList.add("nothing");
        nothing.textContent = "За твоїм запитом нічого не знайдено 🥲";
        buttons.forEach(button => {button.style.display = "none";});
        document.body.append(nothing);
        return
    }
    if(filtered.length <= itemsPerPage) {
        render(filtered, selector);
        resetPage();
        container.textContent = '';
        return;
    }
    buttons.forEach(button => {button.style.display = "";});
    getPageItems(filtered);
    render(pageItems, selector);
    pagination(filtered, render, selector);
    resetPage();
}

export function listeners(getList, render, selector) {
    if (search) {
        search.addEventListener("input", e => {
            if (e.target.value.trim() === '') searchFn(getList(), render, selector);
        });
    }
    if (searchButton) {
        searchButton.addEventListener("click", () => {
            searchFn(getList(), render, selector);
        });
    }
    if (search) {
        search.addEventListener("keydown", event => {
            if (event.key === "Enter") searchFn(getList(), render, selector);
        });
    }
    if (topButton) {
        topButton.addEventListener("click", () => {
            window.scrollTo({top: 0});
        });
    }
}
