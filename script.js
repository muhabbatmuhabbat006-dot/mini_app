const tg = window.Telegram.WebApp;
tg.expand();

let currentQuestion = 0;
let score = 0;

let questions = uashQuestions;

const params = new URLSearchParams(window.location.search);
const directionId = params.get("direction_id");

function startTest() {
    currentQuestion = 0;
    score = 0;

    questions = [...uashQuestions];

    questions.sort(() => Math.random() - 0.5);

    questions = questions.slice(0, 10);

    showQuestion();
}

function showQuestion() {

    if (currentQuestion >= questions.length) {
        finishTest(true);
        return;
    }

    const q = questions[currentQuestion];

    const remaining =
        questions.length - currentQuestion;

    const progress =
        (currentQuestion / questions.length) * 100;

    document.querySelector(".container").innerHTML = `

        <div class="progress-area">

            <div class="progress-info">
                <span>📚 Savol</span>
                <span>
                    ${currentQuestion + 1}/${questions.length}
                </span>
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

            <h3>
                ${q.question}
            </h3>

        </div>

        <div id="answers"></div>

        <div id="result"></div>

        <button
            class="finish-test-button"
            onclick="confirmFinish()">

            🏁 Testni yakunlash

        </button>
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

    document.getElementById("answers").innerHTML =
        answerHTML;
}

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

                <b>
                    ${questions[currentQuestion].answers[correct]}
                </b>

            </div>

            <button
                class="next-button"
                onclick="nextQuestion()">

                ➡️ Keyingisi

            </button>
        `;
    }
}

function nextQuestion() {

    currentQuestion++;

    showQuestion();
}

function confirmFinish() {

    const remaining =
        questions.length - currentQuestion;

    if (remaining <= 0) {

        finishTest(true);

        return;
    }

    showFinishModal(remaining);
}

function showFinishModal(remaining) {

    const modal =
        document.createElement("div");

    modal.className = "modal-overlay";

    modal.innerHTML = `

        <div class="modal-box">

            <h3>
                ⚠️ Testni yakunlash
            </h3>

            <p>

                Sizda hali
                <b>${remaining} ta savol</b>
                bor.

            </p>

            <p>

                Testni hozir yakunlasangiz,
                javob bermagan savollar
                <b>noto‘g‘ri</b>
                hisoblanadi.

            </p>

            <p>
                Davom etamizmi?
            </p>

            <div class="modal-buttons">

                <button
                    class="cancel-button"
                    onclick="closeModal()">

                    Отмена

                </button>

                <button
                    class="ok-button"
                    onclick="finishTest(false)">

                    OK

                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);
}

function closeModal() {

    const modal =
        document.querySelector(".modal-overlay");

    if (modal) {
        modal.remove();
    }
}

function finishTest(fullFinish) {

    closeModal();

    const totalQuestions =
        questions.length;

    const finalScore = score;

    const percent =
        Math.round(
            (finalScore / totalQuestions) * 100
        );

    let status;

    if (percent >= 70) {
        status = "✅ Qoniqarli";
    } else {
        status = "❌ Qoniqarsiz";
    }

    document.querySelector(".container").innerHTML = `

        <div class="result-card">

            <div class="result-icon">

                ${percent >= 70 ? "🎉" : "❌"}

            </div>

            <h2>
                ${status}
            </h2>

            <div class="result-percent">
                ${percent}%
            </div>

            <div class="result-score">

                ${totalQuestions} dan
                ${finalScore} ta to‘g‘ri javob

            </div>

            ${
                !fullFinish
                ?
                `
                <div class="wrong-result">

                    ⚠️ Test to‘liq yechilmagani
                    uchun tarix saqlanmadi

                </div>
                `
                :
                `
                <div class="correct-result">

                    🎉 Test to‘liq yakunlandi!

                </div>
                `
            }

            <button
                class="send-button"
                onclick="sendResult()">

                📤 Natijani botga yuborish

            </button>

            <button
                class="retry-button"
                onclick="startTest()">

                🔄 Yana urinish

            </button>

        </div>
    `;
}

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
