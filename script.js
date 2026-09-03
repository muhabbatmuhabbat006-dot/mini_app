const tg = window.Telegram.WebApp;

tg.expand();
tg.ready();


// ==================================================
// TELEGRAM USER
// ==================================================

const telegramUser = tg.initDataUnsafe?.user;
const telegramId = telegramUser?.id;


// ==================================================
// TEST HOLATI
// ==================================================

let currentQuestion = 0;
let score = 0;
let selectedAnswer = false;
let questions = [];


// ==================================================
// 5 TA NAMUNA TEST
// ==================================================

const FREE_TEST_LIMIT = 5;


// ==================================================
// LOCAL TESTLAR
// ==================================================

if (typeof uashQuestions !== "undefined" && Array.isArray(uashQuestions)) {

    questions = [...uashQuestions];

} else {

    questions = [];

}


// ==================================================
// TELEGRAM ID TEKSHIRISH
// ==================================================

if (!telegramId) {

    document.querySelector(".container").innerHTML = `

        <div class="result-card">

            <div class="result-icon">
                ⚠️
            </div>

            <h2>
                Telegram orqali kiring
            </h2>

            <p>
                Testdan foydalanish uchun
                Mini App'ni Telegram ichida
                ochishingiz kerak.
            </p>

        </div>

    `;

}


// ==================================================
// TESTNI BOSHLASH
// ==================================================

function startTest() {

    if (!telegramId) {
        return;
    }


    if (!questions.length) {

        document.querySelector(".container").innerHTML = `

            <div class="result-card">

                <div class="result-icon">
                    📭
                </div>

                <h2>
                    Testlar mavjud emas
                </h2>

                <p>
                    Hozircha test savollari
                    kiritilmagan.
                </p>

            </div>

        `;

        return;
    }


    // Test holatini tozalash

    currentQuestion = 0;
    score = 0;
    selectedAnswer = false;


    // Testlarni nusxalab aralashtirish

    questions =
        [...questions].sort(
            () => Math.random() - 0.5
        );


    // ==================================================
    // 5 TA NAMUNA TEST
    // ==================================================

    questions =
        questions.slice(0, FREE_TEST_LIMIT);


    showQuestion();

}


// ==================================================
// SAVOLNI KO‘RSATISH
// ==================================================

function showQuestion() {

    if (
        currentQuestion >=
        questions.length
    ) {

        finishTest();

        return;
    }


    selectedAnswer = false;


    const q =
        questions[currentQuestion];


    document.querySelector(
        ".container"
    ).innerHTML = `

        <div class="progress-area">

            <div class="progress-info">

                <span>
                    📚 Test
                </span>

                <span>
                    ${currentQuestion + 1}
                    /
                    ${questions.length}
                </span>

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

    `;


    let answerHTML = "";


    if (Array.isArray(q.answers)) {

        q.answers.forEach(
            (answer, index) => {

                answerHTML += `

                    <button
                        class="answer-button"
                        onclick="checkAnswer(${index})">

                        ${answer}

                    </button>

                `;

            }
        );

    }


    document.getElementById(
        "answers"
    ).innerHTML = answerHTML;

}


// ==================================================
// JAVOBNI TEKSHIRISH
// ==================================================

function checkAnswer(selected) {

    if (selectedAnswer) {
        return;
    }


    selectedAnswer = true;


    const buttons =
        document.querySelectorAll(
            "#answers button"
        );


    buttons.forEach(
        button => {

            button.disabled = true;

        }
    );


    const correct =
        Number(
            questions[
                currentQuestion
            ].correct
        );


    // ==================================================
    // TO‘G‘RI
    // ==================================================

    if (selected === correct) {

        score++;


        if (buttons[selected]) {

            buttons[selected]
                .classList
                .add("correct");

        }


        document.getElementById(
            "result"
        ).innerHTML = `

            <div class="correct-result">

                ✅ To‘g‘ri javob!

            </div>

            <button
                class="next-button"
                onclick="nextQuestion()">

                ➡️ Keyingisi

            </button>

        `;

    }


    // ==================================================
    // NOTO‘G‘RI
    // ==================================================

    else {

        if (buttons[selected]) {

            buttons[selected]
                .classList
                .add("wrong");

        }


        if (buttons[correct]) {

            buttons[correct]
                .classList
                .add("correct");

        }


        const correctAnswer =
            Array.isArray(
                questions[currentQuestion].answers
            )
            &&
            questions[currentQuestion]
                .answers[correct]
                ?
                questions[currentQuestion]
                    .answers[correct]
                :
                "Noma'lum";


        document.getElementById(
            "result"
        ).innerHTML = `

            <div class="wrong-result">

                ❌ Noto‘g‘ri javob!

            </div>

            <div class="correct-answer">

                ✅ To‘g‘ri javob:

                <b>
                    ${correctAnswer}
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


// ==================================================
// KEYINGI SAVOL
// ==================================================

function nextQuestion() {

    currentQuestion++;

    showQuestion();

}


// ==================================================
// TEST YAKUNI
// ==================================================

function finishTest() {

    const total =
        questions.length;


    const percent =
        total > 0
        ?
        Math.round(
            (score / total) * 100
        )
        :
        0;


    document.querySelector(
        ".container"
    ).innerHTML = `

        <div class="result-card">

            <div class="result-icon">

                ${
                    percent >= 70
                    ? "🎉"
                    : "📚"
                }

            </div>


            <h2>
                Test yakunlandi!
            </h2>


            <div class="result-percent">

                ${percent}%

            </div>


            <div class="result-score">

                ${total} dan
                ${score} ta
                to‘g‘ri javob

            </div>


            <div class="result-progress">

                <div
                    class="result-progress-fill"
                    style="width:${percent}%">

                </div>

            </div>


            <button
                class="send-button"
                onclick="sendResult()">

                📤 Natijani botga yuborish

            </button>


            <button
                class="retry-button"
                onclick="startTest()">

                🔄 Qayta ishlash

            </button>


            <button
                class="finish-close-button"
                onclick="tg.close()">

                ✖ Yopish

            </button>

        </div>

    `;

}


// ==================================================
// NATIJANI BOTGA YUBORISH
// ==================================================

function sendResult() {

    if (!telegramId) {

        return;

    }


    const result = {

        type:
            "test_result",

        user_id:
            telegramId,

        score:
            score,

        total:
            questions.length,

        percent:
            questions.length > 0
            ?
            Math.round(
                (
                    score /
                    questions.length
                ) * 100
            )
            :
            0

    };


    console.log(
        "TEST NATIJASI:",
        result
    );


    tg.sendData(
        JSON.stringify(result)
    );

}


// ==================================================
// BOSHLANG‘ICH OYNA
// ==================================================

if (
    telegramId &&
    questions.length
) {

    document.querySelector(
        ".container"
    ).innerHTML = `

        <div class="result-card">

            <div class="result-icon">
                📝
            </div>


            <h1>
                Test platformasi
            </h1>


            <p>
                Sizga
                <b>5 ta bepul test</b>
                beriladi.
            </p>


            <p>
                📚 Testlar aralashtirib
                beriladi.
            </p>


            <button
                class="send-button"
                onclick="startTest()">

                🆓 5 ta bepul testni boshlash

            </button>

        </div>

    `;

}


// ==================================================
// TELEGRAM MA‘LUMOTI
// ==================================================

window.testStartedFromTelegram = {

    user_id:
        telegramId,

    free_test:
        true,

    free_limit:
        FREE_TEST_LIMIT

};


// ==================================================
// KONSOL
// ==================================================

console.log(
    "===================================="
);

console.log(
    "Telegram ID:",
    telegramId
);

console.log(
    "Testlar soni:",
    questions.length
);

console.log(
    "Bepul test limiti:",
    FREE_TEST_LIMIT
);

console.log(
    "===================================="
);