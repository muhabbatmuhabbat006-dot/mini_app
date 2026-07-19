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

function showQuestion() {

    if (currentQuestion >= questions.length) {
        finishTest();
        return;
    }

    const q = questions[currentQuestion];

    document.querySelector(".container").innerHTML = `
        <h2>${currentQuestion + 1}/${questions.length}</h2>
        <h3>${q.question}</h3>

        <div id="answers"></div>

        <p id="timer"></p>
    `;

    let answerHTML = "";

    q.answers.forEach((answer, index) => {

        answerHTML += `
            <button onclick="checkAnswer(${index})">
                ${answer}
            </button><br><br>
        `;

    });

    document.getElementById("answers").innerHTML = answerHTML;

}

function checkAnswer(selected) {

    // Иккинчи марта босилишини олдини олиш
    const buttons = document.querySelectorAll("#answers button");
    buttons.forEach(btn => btn.disabled = true);

    const correct = questions[currentQuestion].correct;

    let result = document.createElement("h2");

    if (selected === correct) {
        score++;
        result.innerHTML = "✅ Тўғри!";
        result.style.color = "green";
    } else {
        result.innerHTML =
            `❌ Нотўғри!<br>✅ Тўғри жавоб: ${questions[currentQuestion].answers[correct]}`;
        result.style.color = "red";
    }

    document.querySelector(".container").appendChild(result);

    // 3 секунддан кейин кейинги савол
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 3000);

}

function finishTest() {

    document.querySelector(".container").innerHTML = `
        <h2>✅ Test yakunlandi!</h2>

        <h1>${score} / ${questions.length}</h1>

        <button onclick="sendResult()">
            📤 Natijani botga yuborish
        </button>
    `;

}

function sendResult() {

    tg.sendData(JSON.stringify({

        score: score,

        total: questions.length

    }));

    tg.close();

}
