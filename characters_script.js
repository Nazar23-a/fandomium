"use strict"
/*jshint esversion: 8, browser: true*/

import {reversedSort, reversedSortByDate, sort, sortByDate} from "./sort.mjs";
import {listeners} from './search.mjs';
import {render} from './render.mjs'
import {load} from './load.mjs';
import {pagination, getPageItems} from "./pagination.mjs";

const data = await load("characters.json");

let characters = data;
let originalCharacters = [...data];
const firstPageItems = getPageItems(characters);

function update() {
    render(firstPageItems, "#characters");
    pagination(characters, render, "#characters");
    currentPage = 1;
}

render(firstPageItems, "#characters");
pagination(characters, render, "#characters");

const def = document.querySelector("#default");
const alphabetical = document.querySelector("#alphabetical");
const reversedAlphabetical = document.querySelector("#reversed-alphabetical");
const newer = document.querySelector("#newer");
const older = document.querySelector("#older");

if(alphabetical) {
    alphabetical.addEventListener("click", () => {
        characters = sort(characters);
        update();
    });
}

if(reversedAlphabetical) {
    reversedAlphabetical.addEventListener("click", () => {
        characters = reversedSort(characters);
        update();
    });
}

if(newer) {
    newer.addEventListener("click", () => {
        characters = sortByDate(characters);
        update();
    });
}

if(older) {
    older.addEventListener("click", () => {
        characters = reversedSortByDate(characters);
        update();
    });
}

if(def) {
    def.addEventListener("click", () => {
        characters = [...originalCharacters];
        update();
    });
}
listeners(() => characters, render, '#characters');

const button = document.querySelector("#sort-button");
const menu = document.querySelector("#menu");

button.addEventListener("click", function () {
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
});