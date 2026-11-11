const search = document.querySelector("#search");
const clear = document.querySelector("input[type=search]");
const searchButton = document.querySelector("#search-button");
const topButton = document.getElementById("top-button");

export function searchFn(list, render, selector) {
    const text = search.value.toLowerCase().trim();
    const section = document.querySelector("section");
    const filtered = [...list].filter(element => {
        const name = element.name.toLowerCase();
        return name.includes(text);
    });
    let collection = document.getElementsByTagName('h1');
    if (collection.length > 0) return
    if (filtered.length === 0) {
        section.innerText = ``
        let nothing = document.createElement("h1");
        nothing.classList.add("nothing");
        nothing.textContent = "За твоїм запитом нічого не знайдено 🥲";
        document.body.append(nothing);
        return
    }
    render(filtered, selector);
}

export function listeners(getList, render, selector) {
    if (clear) {
        clear.addEventListener("input", e => {
            if (e.target.value.trim() === '') render(getList(), selector);
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
            window.scrollTo({top: 0, behavior: 'smooth'})
        });
    }
}
