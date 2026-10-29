const search = document.querySelector("#search");
const clear = document.querySelector("input[type=search]");
const searchButton = document.querySelector("#search-button");
const topButton = document.getElementById("top-button");

export function searchFn(list, render) {
    const text = search.value.toLowerCase().trim();
    const filtered = [...list].filter(element => {
        const name = element.name.toLowerCase();
        return name.includes(text);
    });
    render(filtered);
}

export function listeners(getList, render) {
    clear.addEventListener("input", e => {
        if (e.target.value.trim() === '') render(getList());
    });
    searchButton.addEventListener("click", () => {
        searchFn(getList(), render);
    });
    search.addEventListener("keydown", event => {
        if(event.key === "Enter") searchFn(getList(), render);
    });
    topButton.addEventListener("click", () => {
        window.scrollTo({ top: 0})
    });
}
