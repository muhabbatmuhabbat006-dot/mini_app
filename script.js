const tg = window.Telegram.WebApp;
tg.expand();

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

let timer;
let timeLeft = 30;

let questions = uashQuestions;

function startTest() {

    currentQuestion = 0;
    score = 0;

    questions.sort(() => Math.random() - 0.5);

    showQuestion();

}
