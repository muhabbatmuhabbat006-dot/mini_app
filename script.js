const tg = window.Telegram.WebApp;
tg.expand();

let currentQuestion = 0;
let score = 0;

let questions = uashQuestions;

// ================= DIRECTION ID =================

const params = new URLSearchParams(window.location.search);
const directionId = params.get("direction_id");

// ================= START TEST =================

function startTest() {

    currentQuestion = 0;
    score = 0;

    questions = [...uashQuestions];

    questions.sort(() => Math.random() - 0.5);

    // Фақат 10 та савол
    questions = questions.slice(0, 10);

    showQuestion();
}

// ================= SHOW QUESTION =================

function showQuestion() {

    if (currentQuestion >= questions.length) {
        finishTest();
        return;
    }

    const q = questions[currentQuestion];

    const progress = ((currentQuestion) / questions.length) * 100;

    document.querySelector(".container").innerHTML = `

        <div class="progress-area">

            <div class="progress-info">
                <span>📚 Savol</span>
                <span>${currentQuestion + 1}/${questions.length}</span>
            </div>

            <div class="progress-line">
                <div
                    class="progress-fill"
                    style="width:${progress}%">
                </div>
            </div>

        </div>

        <div class="question">
            <div class="question-number">
                Savol ${currentQuestion + 1}
            </div>

            <h3>${q.question}</h3>
        </div>

        <div id="answers"></div>

        <div id="result"></div>
    `;

    let answerHTML = "";

    q.answers.forEach((answer, index) => {

        answerHTML += `
            <button
                class="answer-button"
                onclick="checkAnswer(${index})">
                ${answer}
            </button>
        `;

    });

    document.getElementById("answers").innerHTML = answerHTML;
}

// ================= CHECK ANSWER =================

function checkAnswer(selected) {

    const buttons =
        document.querySelectorAll("#answers button");

    buttons.forEach(btn => {
        btn.disabled = true;
    });

    const correct =
        questions[currentQuestion].correct;

    if (selected === correct) {

        score++;

        buttons[selected].classList.add("correct");

        document.getElementById("result").innerHTML = `
            <div class="correct-result">
                ✅ To‘g‘ri javob!
            </div>

            <button
                class="next-button"
                onclick="nextQuestion()">
                ➡️ Keyingisi
            </button>
        `;

    } else {

        buttons[selected].classList.add("wrong");

        buttons[correct].classList.add("correct");

        document.getElementById("result").innerHTML = `
            <div class="wrong-result">
                ❌ Noto‘g‘ri javob!
            </div>

            <div class="correct-answer">
                ✅ To‘g‘ri javob:
                <b>${questions[currentQuestion].answers[correct]}</b>
            </div>

            <button
                class="next-button"
                onclick="nextQuestion()">
                ➡️ Keyingisi
            </button>
        `;
    }
}

// ================= NEXT QUESTION =================

function nextQuestion() {

    currentQuestion++;

    showQuestion();
}

// ================= FINISH TEST =================

function finishTest() {

    const percent =
        Math.round((score / questions.length) * 100);

    document.querySelector(".container").innerHTML = `

        <div class="result-card">

            <div class="result-icon">
                🎉
            </div>

            <h2>Test yakunlandi!</h2>

            <div class="result-score">
                ${score} / ${questions.length}
            </div>

            <div class="result-percent">
                ${percent}%
            </div>

            <div class="result-progress">
                <div
                    class="result-progress-fill"
                    style="width:${percent}%">
                </div>
            </div>

            <p>
                🎁 Siz 10 ta bepul namunaviy
                savolni ishladingiz.
            </p>

            <button
                class="send-button"
                onclick="sendResult()">
                📤 Natijani botga yuborish
            </button>

        </div>
    `;
}

// ================= SEND RESULT =================

function sendResult() {

    const result = {

        score: score,

        total: questions.length,

        direction_id: directionId
    };

    console.log(result);

    tg.sendData(
        JSON.stringify(result)
    );
}
