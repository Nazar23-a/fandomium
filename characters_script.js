"use strict"
/*jshint esversion: 8, browser: true*/

import {reversedSort, reversedSortByDate, sort, sortByDate} from "./sort.mjs";
import {searchFn, listeners} from './search.mjs';
import {render} from './render.mjs'
import {load} from './load.mjs';

const data = await load("characters.json");

let characters = data;
let originalCharacters = [...data];

render(characters, "#characters");

const def = document.querySelector("#default");
const alphabetical = document.querySelector("#alphabetical");
const reversedAlphabetical = document.querySelector("#reversed-alphabetical");
const newer = document.querySelector("#newer");
const older = document.querySelector("#older");

if(alphabetical) {
    alphabetical.addEventListener("click", () => {
        characters = sort(characters);
        render(characters);
    });
}

if(reversedAlphabetical) {
    reversedAlphabetical.addEventListener("click", () => {
        characters = reversedSort(characters);
        render(characters);
    });
}

if(newer) {
    newer.addEventListener("click", () => {
        characters = sortByDate(characters);
        render(characters);
    });
}

if(older) {
    older.addEventListener("click", () => {
        characters = reversedSortByDate(characters);
        render(characters);
    });
}

if(def) {
    def.addEventListener("click", () => {
        characters = [...originalCharacters];
        render(characters);
    });
}

listeners(() => characters, render);