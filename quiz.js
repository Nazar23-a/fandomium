"use strict";
/*jshint esversion: 8*/

let questions = [];
let questionOrder = [];
let currentQuestionIndex = 0;
let points = 0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function loadQuestions() {
    try {
        const response = await fetch("./questions.json");

        if (!response.ok) {
            console.log("Помилка: Не вдалося завантажити питання");
            questions = [];
            return;
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            console.log("Помилка: Файл запитань порожній або має хибний формат");
            questions = [];
            return;
        }

        questions = data;
        console.log("Запитання завантажено успішно:", questions);
    }
    catch (error) {
        console.log("Критична помилка:", error);
        questions = [];
    }
}

function renderQuestions() {
    const questionContainer = document.getElementById("question");
    const currentQuestion = questions[questionOrder[currentQuestionIndex]];

    questionContainer.innerHTML = "";

    const card = document.createElement("div");
    card.classList.add("card");

    const title = document.createElement("h2");
    title.textContent = currentQuestion.question;
    card.appendChild(title);

    const picture = document.createElement("picture");
    if(currentQuestion.imageMobile) {
        const source = document.createElement("source");
        source.media = "(max-width: 500px)";
        source.srcset = currentQuestion.imageMobile;
        picture.appendChild(source);
    }

    const img = document.createElement("img");
    img.src = currentQuestion.image;
    img.alt = currentQuestion.question;
    img.loading = 'eager';
    img.decoding = "async";
    picture.appendChild(img);
    card.appendChild(picture);

    const list = document.createElement("ol");
    list.classList.add("answers-list");

    currentQuestion.answers.forEach((answer, index) => {
        const item = document.createElement("li");
        const label = document.createElement("label");
        const input = document.createElement("input");

        input.type = "radio";
        input.name = "answer";
        input.value = index;
        input.id = `answer-${index}`;

        label.htmlFor = input.id;
        label.append(input, document.createTextNode(" " + answer));

        item.appendChild(label);
        list.appendChild(item);
    });

    card.appendChild(list);

    const feedback = document.createElement("p");
    feedback.id = "feedback";
    feedback.setAttribute("aria-live", "polite");
    card.appendChild(feedback);

    const nextButton = document.createElement("button");
    nextButton.id = "next";
    nextButton.textContent = "Далі";
    nextButton.hidden = true;
    nextButton.addEventListener("click", nextQuestion);

    card.appendChild(nextButton);
    questionContainer.appendChild(card);

    list.addEventListener("change", checkAnswer);

    const progress = document.createElement("p");
    progress.classList.add("progress");
    progress.textContent =
        `Запитання ${currentQuestionIndex + 1} з ${questions.length}`;

    card.prepend(progress);
}

function checkAnswer(event) {
    const selected = event.target;

    if (selected.type !== "radio") return;

    const currentQuestion = questions[questionOrder[currentQuestionIndex]];
    const correctIndex = currentQuestion.correct;

    const options = document.querySelectorAll(
        '#question input[name="answer"]'
    );

    const feedback = document.getElementById("feedback");
    const nextButton = document.getElementById("next");

    // Блокуємо всі варіанти після вибору
    options.forEach(option => {
        option.disabled = true;

        const label = option.closest("label");
        const item = label.closest("li");

        if (Number(option.value) === correctIndex) {
            item.classList.add("correct");
        }
    });

    if (Number(selected.value) === correctIndex) {
        selected.closest("label")
            .closest("li")
            .classList.add("selected-correct");

        feedback.textContent = "✅ Правильно! Молодець!";
        feedback.className = "feedback-success";

        points++;
    } else {
        selected.closest("label")
            .closest("li")
            .classList.add("incorrect");

        feedback.textContent = "❌ Неправильно! Зелений варіант — правильна відповідь.";
        feedback.className = "feedback-error";
    }

    nextButton.hidden = false;
    nextButton.focus();
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    renderQuestions();
}

function showResults() {
    const questionContainer = document.getElementById("question");
    questionContainer.innerHTML = "";

    const card = document.createElement("div");
    card.classList.add("card", "results");

    const title = document.createElement("h2");
    title.textContent = "🎉 Тест завершено!";
    card.appendChild(title);

    const result = document.createElement("p");
    result.textContent =
        `Ти набрав ${points} з ${questions.length} балів!`;
    card.appendChild(result);

    const percentage = Math.round(points / questions.length * 100);

    const score = document.createElement("p");
    score.textContent = `Результат: ${percentage}%`;
    card.appendChild(score);

    const meter = document.createElement("meter");
    meter.min = 0;
    meter.max = questions.length;
    meter.value = points;
    meter.textContent = `${points} з ${questions.length}`;
    card.appendChild(meter);

    const restartButton = document.createElement("button");
    restartButton.textContent = "🔄 Пройти ще раз";
    restartButton.addEventListener("click", reset);

    card.appendChild(restartButton);
    questionContainer.appendChild(card);
}

function reset() {
    points = 0;
    currentQuestionIndex = 0;

    questionOrder = questions.map((_, index) => index);
    shuffle(questionOrder);

    renderQuestions();
}

const start = document.getElementById("start");
const greetings = document.getElementById("greetings");
start.addEventListener("click", async () => {
    start.disabled = true;
    await loadQuestions();
    if (questions.length === 0) {
        greetings.textContent = "Не вдалося завантажити запитання."
        start.disabled = false;
        return;
    }
    start.hidden = true;
    greetings.textContent = "";
    reset();
});