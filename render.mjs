const DOMPurify = window.DOMPurify;

const htmlPolicy = trustedTypes.createPolicy('app-html', {
    createHTML(input) {
        return DOMPurify.sanitize(input, {
            RETURN_TRUSTED_TYPE: false,
        });
    },
});

export function render(list, selector) {
    const label = selector === "#fandoms" ? "Персонажі: " : "З фандому: ";
    const characterCards = document.querySelector(selector);
    if (!characterCards) return;
    characterCards.replaceChildren();
    list.forEach(element => {
        const card = document.createElement("div");
        card.classList.add("card");
        const html = `
        <img src="${element.image}" alt="${element.name}" loading="lazy">
        <h2 class="heading">${element.name}</h2>
        <h3 class="from-fandom">${label}${element.relatedWith.join(", ")}</h3>
        <p class="desc">${element.desc}</p>`;
        card.innerHTML = htmlPolicy.createHTML(html);
        characterCards.append(card);
    });
}