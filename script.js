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

let questions = [];

let testStarted = false;

let testCompleted = false;

let selectedAnswer = false;


// ==================================================
// YO'NALISH ID
// ==================================================

const params =
    new URLSearchParams(window.location.search);

const directionId =
    params.get("direction_id");


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


    // ----------------------------------------------
    // TESTNI BOSHLAGANINI BELGILASH
    // ----------------------------------------------

    testStarted = true;

    testCompleted = false;

    selectedAnswer = false;


    currentQuestion = 0;

    score = 0;


    // ----------------------------------------------
    // SAVOLLARNI OLISH
    // ----------------------------------------------

    questions = [...uashQuestions];


    // ----------------------------------------------
    // SAVOLLARNI ARALASHTIRISH
    // ----------------------------------------------

    questions.sort(
        () => Math.random() - 0.5
    );


    // ----------------------------------------------
    // 10 TA SAVOL
    // ----------------------------------------------

    questions =
        questions.slice(0, 10);


    showQuestion();
}


// ==================================================
// SAVOLNI KO'RSATISH
// ==================================================

function showQuestion() {

    if (currentQuestion >= questions.length) {

        finishTest(true);

        return;
    }


    selectedAnswer = false;


    const q =
        questions[currentQuestion];


    const progress =
        ((currentQuestion + 1) /
        questions.length) * 100;


    document.querySelector(".container").innerHTML = `

        <!-- ====================================== -->
        <!-- PROGRESS -->
        <!-- ====================================== -->

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


            <div class="progress-line">

                <div
                    class="progress-fill"
                    style="width:${progress}%">
                </div>

            </div>

        </div>


        <!-- ====================================== -->
        <!-- SAVOL -->
        <!-- ====================================== -->

        <div class="question">

            <div class="question-number">

                Savol ${currentQuestion + 1}

            </div>


            <h3>

                ${q.question}

            </h3>

        </div>


        <!-- ====================================== -->
        <!-- JAVOBLAR -->
        <!-- ====================================== -->

        <div id="answers"></div>


        <!-- ====================================== -->
        <!-- NATIJA -->
        <!-- ====================================== -->

        <div id="result"></div>


        <!-- ====================================== -->
        <!-- TESTNI YAKUNLASH -->
        <!-- ====================================== -->

        <button
            class="finish-test-button"
            onclick="confirmFinish()">

            🏁 Testni yakunlash

        </button>


        <!-- ====================================== -->
        <!-- ORQAGA -->
        <!-- ====================================== -->

        <button
            class="close-button"
            onclick="confirmExit()">

            ← Orqaga

        </button>

    `;


    // ==================================================
    // JAVOB VARIANTLARI
    // ==================================================

    let answerHTML = "";


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


    document.getElementById("answers").innerHTML =
        answerHTML;
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
        questions[currentQuestion].correct;


    // ==================================================
    // TO'G'RI JAVOB
    // ==================================================

    if (selected === correct) {

        score++;


        buttons[selected]
            .classList
            .add("correct");


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
    // NOTO'G'RI JAVOB
    // ==================================================

    else {

        buttons[selected]
            .classList
            .add("wrong");


        buttons[correct]
            .classList
            .add("correct");


        document.getElementById(
            "result"
        ).innerHTML = `

            <div class="wrong-result">

                ❌ Noto‘g‘ri javob!

            </div>


            <div class="correct-answer">

                ✅ To‘g‘ri javob:

                <b>
                    ${
                        questions[
                            currentQuestion
                        ].answers[correct]
                    }
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
// TESTNI YAKUNLASHNI TASDIQLASH
// ==================================================

function confirmFinish() {

    const remaining =
        questions.length -
        currentQuestion;


    if (remaining <= 0) {

        finishTest(true);

        return;
    }


    showFinishModal(remaining);
}


// ==================================================
// YAKUNLASH MODALI
// ==================================================

function showFinishModal(remaining) {

    closeModal();


    const modal =
        document.createElement("div");


    modal.className =
        "modal-overlay";


    modal.innerHTML = `

        <div class="confirm-modal">

            <div class="modal-error">

                ⚠️ Огоҳлантириш

            </div>


            <div class="confirm-text">

                Сизда ҳали
                <b>
                    ${remaining} та савол
                </b>
                бор.

                <br><br>

                Тестни ҳозир якунласангиз,
                жавоб берилмаган саволлар
                <b>
                    нотўғри
                </b>
                ҳисобланади.

                <br><br>

                Тестни якунлайсизми?

            </div>


            <div class="confirm-buttons">

                <button
                    class="cancel-button"
                    onclick="closeModal()">

                    Отмена

                </button>


                <button
                    class="ok-button"
                    onclick="finishTest(false)">

                    Тестни якунлаш

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);
}


// ==================================================
// MODALNI YOPISH
// ==================================================

function closeModal() {

    const modal =
        document.querySelector(
            ".modal-overlay"
        );


    if (modal) {

        modal.remove();

    }

}


// ==================================================
// ORQAGA CHIQISH
// ==================================================

function confirmExit() {

    const remaining =
        questions.length -
        currentQuestion;


    if (remaining <= 0) {

        finishTest(true);

        return;
    }


    const modal =
        document.createElement("div");


    modal.className =
        "modal-overlay";


    modal.innerHTML = `

        <div class="confirm-modal">

            <div class="modal-error">

                ⚠️ Тесттен чиқиш

            </div>


            <div class="confirm-text">

                Сиз тестни тугалламадингиз.

                <br><br>

                Агар ҳозир чиқсангиз,
                <b>
                    бепул тест ҳуқуқингиз
                    сарфланган ҳисобланади.
                </b>

                <br><br>

                Тестни якунланг ёки
                обуна олинг.

            </div>


            <div class="confirm-buttons">

                <button
                    class="cancel-button"
                    onclick="closeModal()">

                    Давом этиш

                </button>


                <button
                    class="ok-button"
                    onclick="finishTest(false)">

                    Тестни якунлаш

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);
}


// ==================================================
// TEST YAKUNI
// ==================================================

function finishTest(fullFinish) {

    closeModal();


    testCompleted = true;


    const totalQuestions =
        questions.length;


    const finalScore =
        score;


    const percent =
        Math.round(
            (finalScore /
            totalQuestions) * 100
        );


    let status;

    let icon;

    let comment;


    // ==================================================
    // NATIJA BAHOSI
    // ==================================================

    if (percent >= 90) {

        status =
            "🏆 A’lo";

        icon = "🏆";

        comment = `
            Juda yaxshi natija!
            Bilim darajangiz yuqori.
        `;

    }

    else if (percent >= 70) {

        status =
            "✅ Qoniqarli";

        icon = "🎉";

        comment = `
            Yaxshi natija.
            Kamchiliklarni takrorlasangiz,
            natijangiz yanada yaxshilanadi.
        `;

    }

    else {

        status =
            "❌ Qoniqarsiz";

        icon = "❌";

        comment = `
            Bilimlaringizni yana bir bor
            takrorlash va testni qayta ishlash
            tavsiya etiladi.
        `;

    }


    document.querySelector(
        ".container"
    ).innerHTML = `

        <div class="result-card">

            <div class="result-icon">

                ${icon}

            </div>


            <h2>

                ${status}

            </h2>


            <div class="result-percent">

                ${percent}%

            </div>


            <div class="result-score">

                ${totalQuestions} dan
                ${finalScore} ta
                to‘g‘ri javob

            </div>


            <!-- ================================= -->
            <!-- PROGRESS -->
            <!-- ================================= -->

            <div class="result-progress">

                <div
                    class="result-progress-fill"
                    style="width:${percent}%">

                </div>

            </div>


            <!-- ================================= -->
            <!-- FIKR -->
            <!-- ================================= -->

            <div class="subscription-message">

                📊 <b>Natija haqida fikr</b>

                <br><br>

                ${comment}

            </div>


            ${
                !fullFinish
                ?
                `

                <div class="incomplete-warning">

                    ⚠️ Test to‘liq yechilmagan.

                    <br>

                    Javob berilmagan savollar
                    noto‘g‘ri hisoblandi.

                </div>

                `
                :
                `

                <div class="correct-result">

                    🎉 Test to‘liq yakunlandi!

                </div>

                `
            }


            <!-- ================================= -->
            <!-- NATIJANI YUBORISH -->
            <!-- ================================= -->

            <button
                class="send-button"
                onclick="sendResult()">

                📤 Natijani yuborish

            </button>


            <!-- ================================= -->
            <!-- YANA URINISH -->
            <!-- ================================= -->

            <button
                class="retry-button"
                onclick="startTest()">

                🔄 Yana urinish

            </button>


            <!-- ================================= -->
            <!-- ORQAGA -->
            <!-- ================================= -->

            <button
                class="finish-close-button"
                onclick="goBack()">

                ← Orqaga

            </button>

        </div>

    `;
}


// ==================================================
// ORQAGA QAYTISH
// ==================================================

function goBack() {

    if (window.history.length > 1) {

        window.history.back();

    }

    else {

        tg.close();

    }

}


// ==================================================
// NATIJANI BOTGA YUBORISH
// ==================================================

function sendResult() {

    const result = {

        user_id: telegramId,

        score: score,

        total: questions.length,

        percent:
            Math.round(
                (score /
                questions.length) * 100
            ),

        direction_id:
            directionId,

        full_finish:
            testCompleted

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
// BOSHLANG'ICH OYNA
// ==================================================

if (telegramId) {

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
                Sizga 10 ta savoldan
                iborat bepul test beriladi.
            </p>


            <p>
                ⚠️ Bepul test
                Telegram ID bo‘yicha
                faqat bir marta beriladi.
            </p>


            <button
                class="send-button"
                onclick="startTest()">

                🆓 Bepul testni boshlash

            </button>

        </div>

    `;

}


// ==================================================
// TELEGRAM ID MA'LUMOTI
// ==================================================

window.testStartedFromTelegram = {

    user_id: telegramId,

    direction_id: directionId,

    free_test: true

};


// ==================================================
// KONSOLDA TEKSHIRISH
// ==================================================

console.log(
    "===================================="
);

console.log(
    "Telegram ID:",
    telegramId
);

console.log(
    "Yo'nalish ID:",
    directionId
);

console.log(
    "Bepul test:",
    true
);

console.log(
    "===================================="
);
