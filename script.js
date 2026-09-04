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

let accessType = "free";

let testStarted = false;

let testCompleted = false;

let selectedAnswer = false;

// ==================================================
// YO‘NALISH ID
// ==================================================

const params = new URLSearchParams(
    window.location.search
);

const directionId = params.get("direction_id");


// ==================================================
// API MANZILI
// ==================================================

const API_URL =
    "https://pole-shaved-diameter-considers.trycloudflare.com/api/tests";


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
// YO‘NALISH ID TEKSHIRISH
// ==================================================

if (!directionId && telegramId) {

    document.querySelector(".container").innerHTML = `

        <div class="result-card">

            <div class="result-icon">
                ⚠️
            </div>

            <h2>
                Yo‘nalish tanlanmagan
            </h2>

            <p>
                Testni boshlash uchun
                avval yo‘nalishni tanlang.
            </p>

        </div>

    `;

}


// ==================================================
// TESTNI BOSHLASH
// ==================================================

async function startTest() {

    if (!telegramId) {

        return;

    }


    if (!directionId) {

        alert(
            "❌ Yo‘nalish aniqlanmadi."
        );

        return;

    }


    // ----------------------------------------------
    // TEST HOLATI
    // ----------------------------------------------

    testStarted = true;

    testCompleted = false;

    selectedAnswer = false;

    currentQuestion = 0;

    score = 0;

    questions = [];


    // ----------------------------------------------
    // YUKLANAYOTGAN OYNA
    // ----------------------------------------------

    document.querySelector(
        ".container"
    ).innerHTML = `

        <div class="result-card">

            <div class="result-icon">
                ⏳
            </div>

            <h2>
                Testlar yuklanmoqda...
            </h2>

            <p>
                Iltimos, biroz kuting.
            </p>

        </div>

    `;


       // ==================================================
    // API DAN TESTLARNI OLISH
    // ==================================================

    try {

        const url =
            API_URL +
            "?direction_id=" +
            encodeURIComponent(directionId) +
            "&user_id=" +
            encodeURIComponent(telegramId);


        console.log(
            "API:",
            url
        );


        const response =
            await fetch(url);


        // ==================================================
        // SERVER JAVOBINI TEKSHIRISH
        // ==================================================

        if (!response.ok) {

            throw new Error(
                "Server javobi: " +
                response.status
            );

        }


        const data =
            await response.json();


        // ==================================================
        // TESTGA KIRISH TURI
        // ==================================================

        accessType =
            data.access_type || "free";


        console.log(
            "API NATIJA:",
            data
        );


        // ==================================================
        // OBUNA KERAK
        // ==================================================

        if (
            data.subscription_required === true
        ) {

            showSubscriptionRequired(
                data
            );

            return;

        }


        // ==================================================
        // API XATOSI
        // ==================================================

        if (
            data.success !== true
        ) {

            throw new Error(
                data.message ||
                data.error ||
                "Testlarni olishda xatolik."
            );

        }


        // ==================================================
        // TESTLAR YO‘Q
        // ==================================================

        if (
            !Array.isArray(data.tests) ||
            data.tests.length === 0
        ) {

            document.querySelector(
                ".container"
            ).innerHTML = `

                <div class="result-card">

                    <div class="result-icon">
                        📭
                    </div>

                    <h2>
                        Testlar mavjud emas
                    </h2>

                    <p>
                        Ushbu yo‘nalish uchun
                        hozircha test savollari
                        kiritilmagan.
                    </p>

                    <button
                        class="finish-close-button"
                        onclick="goBack()">

                        ← Orqaga

                    </button>

                </div>

            `;

            return;

        }


        // ==================================================
        // TESTLARNI SAQLASH
        // ==================================================

        questions =
            data.tests;


        // ==================================================
        // TESTLARNI ARALASHTIRISH
        // ==================================================

        questions.sort(
            () => Math.random() - 0.5
        );


        // ==================================================
        // 5 TA NAMUNA BEPUL TEST
        // ==================================================

        questions =
            questions.slice(0, 5);


        // ==================================================
// TESTNI KO‘RSATISH
// ==================================================

showQuestion();


} catch (error) {

    console.error(
        "TEST API ERROR:",
        error
    );


    document.querySelector(
        ".container"
    ).innerHTML = `

        <div class="result-card">

            <div class="result-icon">
                ❌
            </div>

            <h2>
                Xatolik yuz berdi
            </h2>

            <p>
                Testlarni yuklab bo‘lmadi.
            </p>

            <p>
                <small>
                    ${error.message}
                </small>
            </p>

            <button
                class="retry-button"
                onclick="startTest()">

                🔄 Qayta urinish

            </button>

            <button
                class="finish-close-button"
                onclick="goBack()">

                ← Orqaga

            </button>

        </div>

    `;

    }

}

// ==================================================
// OBUNA KERAK
// ==================================================
function showSubscriptionRequired(data) {

    const usedFree =
        data.used_free ?? 5;


    document.querySelector(
        ".container"
    ).innerHTML = `

        <div class="result-card">

            <div class="result-icon">
                🔒
            </div>

            <h2>
                Obuna kerak
            </h2>

            <div class="subscription-message">

                ⚠️ Sizning 5 ta bepul
                testingiz tugagan.

                <br><br>

                📝 Ishlatilgan bepul testlar:

                <b>
                    ${usedFree}
                </b>

                <br><br>

                To‘liq testlardan foydalanish
                uchun obuna sotib oling.

            </div>


            <button
                class="send-button"
                onclick="sendSubscriptionRequest()">

                💳 Obuna sotib olish

            </button>


            <button
                class="finish-close-button"
                onclick="goBack()">

                ← Orqaga

            </button>

        </div>

    `;

}


// ==================================================
// OBUNA SO‘ROVI
// ==================================================

function sendSubscriptionRequest() {

    if (!telegramId) {

        return;

    }


    const result = {

        type:
            "subscription_required",

        user_id:
            telegramId,

        direction_id:
            directionId

    };


    console.log(
        "OBUNA SO‘ROVI:",
        result
    );


    tg.sendData(
        JSON.stringify(result)
    );

}


// ==================================================
// SAVOLNI KO‘RSATISH
// ==================================================

function showQuestion() {

    if (
        currentQuestion >=
        questions.length
    ) {

        finishTest(true);

        return;

    }


    selectedAnswer = false;


    const q =
        questions[currentQuestion];


    const progress =
        (
            (currentQuestion + 1) /
            questions.length
        ) * 100;


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


    if (
        Array.isArray(q.answers)
    ) {

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
    // TO‘G‘RI JAVOB
    // ==================================================

    if (
        selected === correct
    ) {

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
    // NOTO‘G‘RI JAVOB
    // ==================================================

    else {

        buttons[selected]
            .classList
            .add("wrong");


        if (buttons[correct]) {

            buttons[correct]
                .classList
                .add("correct");

        }


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


    showFinishModal(
        remaining
    );

}


// ==================================================
// YAKUNLASH MODALI
// ==================================================

function showFinishModal(
    remaining
) {

    closeModal();


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "modal-overlay";


    modal.innerHTML = `

        <div class="confirm-modal">

            <div class="modal-error">

                ⚠️ Ogohlantirish

            </div>


            <div class="confirm-text">

                Sizda hali

                <b>
                    ${remaining} ta savol
                </b>

                bor.

                <br><br>

                Testni hozir yakunlasangiz,
                javob berilmagan savollar
                <b>
                    noto‘g‘ri
                </b>
                hisoblanadi.

                <br><br>

                Testni yakunlaysizmi?

            </div>


            <div class="confirm-buttons">

                <button
                    class="cancel-button"
                    onclick="closeModal()">

                    Bekor qilish

                </button>


                <button
                    class="ok-button"
                    onclick="finishTest(false)">

                    Testni yakunlash

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

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
        document.createElement(
            "div"
        );


    modal.className =
        "modal-overlay";


    modal.innerHTML = `

        <div class="confirm-modal">

            <div class="modal-error">

                ⚠️ Testdan chiqish

            </div>


            <div class="confirm-text">

                Siz testni tugatmadingiz.

                <br><br>

                Agar hozir chiqsangiz,

                <b>
                    bepul test huquqingiz
                    sarflangan hisoblanadi.
                </b>

                <br><br>

                Testni yakunlang yoki
                obuna oling.

            </div>


            <div class="confirm-buttons">

                <button
                    class="cancel-button"
                    onclick="closeModal()">

                    Davom etish

                </button>


                <button
                    class="ok-button"
                    onclick="finishTest(false)">

                    Testni yakunlash

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


// ==================================================
// TEST YAKUNI
// ==================================================

function finishTest(
    fullFinish
) {

    closeModal();


    testCompleted =
        fullFinish;


    const totalQuestions =
        questions.length;


    const finalScore =
        score;


    const percent =
        totalQuestions > 0
        ?
        Math.round(
            (
                finalScore /
                totalQuestions
            ) * 100
        )
        :
        0;


    let status;

    let icon;

    let comment;


    // ==================================================
    // NATIJA BAHOSI
    // ==================================================

    if (percent >= 90) {

        status =
            "🏆 A’lo";

        icon =
            "🏆";

        comment = `
            Juda yaxshi natija!
            Bilim darajangiz yuqori.
        `;

    }

    else if (percent >= 70) {

        status =
            "✅ Qoniqarli";

        icon =
            "🎉";

        comment = `
            Yaxshi natija.
            Kamchiliklarni takrorlasangiz,
            natijangiz yanada yaxshilanadi.
        `;

    }

    else {

        status =
            "❌ Qoniqarsiz";

        icon =
            "❌";

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


            <div class="result-progress">

                <div
                    class="result-progress-fill"
                    style="width:${percent}%">

                </div>

            </div>


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


            <button
                class="send-button"
                onclick="sendResult()">

                📤 Natijani yuborish

            </button>


            <div class="subscription-message">

                🔒 <b>5 ta bepul testingiz tugadi.</b>

                <br><br>

                To‘liq testlardan foydalanish
                uchun obuna sotib oling.

            </div>


            <button
                class="send-button"
                onclick="sendSubscriptionRequest()">

                💳 Obuna sotib olish

            </button>


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

    if (
        window.history.length > 1
    ) {

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
            0,

        direction_id:
            directionId,

        full_finish:
            testCompleted,

        access_type:
            accessType

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
    directionId
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

                Sizga 5 ta bepul test
                beriladi.

            </p>


            <p>

                📚 Har bir yo‘nalish uchun
                bepul test limiti alohida
                hisoblanadi.

            </p>


            <p>

                🔒 Bepul testlar tugagach,
                to‘liq testlardan foydalanish
                uchun obuna kerak bo‘ladi.

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
// TELEGRAM ID MA‘LUMOTI
// ==================================================

window.testStartedFromTelegram = {

    user_id:
        telegramId,

    direction_id:
        directionId,

    free_test:
        true

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
    "Yo‘nalish ID:",
    directionId
);

console.log(
    "API:",
    API_URL
);

console.log(
    "===================================="
);
