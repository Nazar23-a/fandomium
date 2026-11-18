"use strict"
/*jshint esversion: 8, browser: true*/

import {sort, sortByDate, reversedSort, reversedSortByDate} from "./sort.mjs";
import {listeners} from './search.mjs';
import {render} from './render.mjs';
import {load} from './load.mjs';
import {pagination, getPageItems, resetPage} from "./pagination.mjs";

const data = await load("fandoms.json");

let fandoms = data;
let originalFandoms = [...data];
const firstPageItems = getPageItems(fandoms);

function update() {
    resetPage()
    render(getPageItems(fandoms), "#fandoms");
    pagination(fandoms, render, "#fandoms");
}

render(firstPageItems, "#fandoms");
pagination(fandoms, render, "#fandoms");

const def = document.querySelector("#default");
const alphabetical = document.querySelector("#alphabetical");
const reversedAlphabetical = document.querySelector("#reversed-alphabetical");
const newer = document.querySelector("#newer");
const older = document.querySelector("#older");

if(alphabetical) {
    alphabetical.addEventListener("click", () => {
        fandoms = sort(fandoms);
       update();
    });
}

if(reversedAlphabetical) {
    reversedAlphabetical.addEventListener("click", () => {
        fandoms = reversedSort(fandoms);
        update();
    });
}

if(newer) {
    newer.addEventListener("click", () => {
        fandoms = sortByDate(fandoms);
        update();
    });
}

if(older) {
    older.addEventListener("click", () => {
        fandoms = reversedSortByDate(fandoms);
        update();
    });
}

if(def) {
    def.addEventListener("click", () => {
        fandoms = [...originalFandoms];
        update();
    });
}

listeners(() => fandoms, render, "#fandoms");
const button = document.querySelector("#sort-button");
const menu = document.querySelector("#menu");

button.addEventListener("click", function () {
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
});