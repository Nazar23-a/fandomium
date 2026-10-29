"use strict"
/*jshint esversion: 8, browser: true*/

import {sort, sortByDate, reversedSort, reversedSortByDate} from "./sort.mjs";
import {searchFn, listeners} from './search.mjs';
import {render} from './render.mjs';
import {load} from './load.mjs';

const data = await load("fandoms.json");

let fandoms = data;
let originalFandoms = [...data];

render(fandoms, "#fandoms");

const def = document.querySelector("#default");
const alphabetical = document.querySelector("#alphabetical");
const reversedAlphabetical = document.querySelector("#reversed-alphabetical");
const newer = document.querySelector("#newer");
const older = document.querySelector("#older");

if(alphabetical) {
    alphabetical.addEventListener("click", () => {
        fandoms = sort(fandoms);
        render(fandoms, "#fandoms");
    });
}

if(reversedAlphabetical) {
    reversedAlphabetical.addEventListener("click", () => {
        fandoms = reversedSort(fandoms);
        render(fandoms, "#fandoms");
    });
}

if(newer) {
    newer.addEventListener("click", () => {
        fandoms = sortByDate(fandoms);
        render(fandoms, "#fandoms");
    });
}

if(older) {
    older.addEventListener("click", () => {
        fandoms = reversedSortByDate(fandoms);
        render(fandoms, "#fandoms");
    });
}

if(def) {
    def.addEventListener("click", () => {
        fandoms = [...originalFandoms];
        render(fandoms, "#fandoms");
    });
}

listeners(() => fandoms, render, "#fandoms");