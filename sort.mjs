"use strict";

const sortButton = document.querySelector("#sort-button");
const menu = document.querySelector("#menu");

sortButton.addEventListener("click", event => {
    menu.hidden = !menu.hidden;
})

export function sort(list) {return [...list].sort((a, b) => a.name.localeCompare(b.name, 'uk'));}

export function reversedSort(list) {return [...list].sort((a, b) => b.name.localeCompare(a.name, 'uk'));}

export function sortByDate(list) {return [...list].sort((a, b) => new Date(b.addDate) - new Date(a.addDate));}

export function reversedSortByDate(list) {return [...list].sort((a, b) => new Date(a.addDate) - new Date(b.addDate));}