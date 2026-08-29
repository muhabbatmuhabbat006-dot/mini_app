const tg = window.Telegram.WebApp;

tg.expand();

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

let questions = uashQuestions;


// ================= START TEST =================

function startTest() {

    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;

    questions = [...uashQuestions];

    questions.sort(() => Math.random() - 0.5);

    showQuestion();
}


// ================= SHOW QUESTION =================

function showQuestion() {

    if (currentQuestion >= questions.length) {
        finishTest();
        return;
    }

    selectedAnswer = null;

    const q = questions[currentQuestion];

    const total = questions.length;

    const progress = (currentQuestion / total) * 100;


    document.querySelector(".container").innerHTML = `

        <div class="progress-area">

            <div class="progress-info">

                <span>
                    Savol ${currentQuestion + 1}
                </span>

                <span>
                    ${total} ta
                </span>

            </div>


            <div class="progress-line">

                <div
                    class="progress-fill"
                    style="width:${progress}%">
                </div>

            </div>

        </div>


        <div class="question-number">

            ${currentQuestion + 1} / ${total}

        </div>


        <div class="question">

            <h3>
                ${q.question}
            </h3>

        </div>


        <div id="answers"></div>


        <div id="result"></div>


        <button
            id="nextButton"
            class="next-button"
            onclick="nextQuestion()"
            style="display:none;">

            Кейингиси →

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


// ================= CHECK ANSWER =================

function checkAnswer(selected) {

    if (selectedAnswer !== null) {
        return;
    }

    selectedAnswer = selected;


    const buttons =
        document.querySelectorAll(".answer-button");

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

                ✅ Тўғри жавоб!

            </div>

        `;

    } else {

        buttons[selected].classList.add("wrong");

        buttons[correct].classList.add("correct");


        document.getElementById("result").innerHTML = `

            <div class="wrong-result">

                ❌ Нотўғри жавоб!

                <div class="correct-answer">

                    ✅ Тўғри жавоб:

                    <b>
                        ${questions[currentQuestion].answers[correct]}
                    </b>

                </div>

            </div>

        `;

    }


    document.getElementById("nextButton").style.display =
        "block";

}


// ================= NEXT QUESTION =================

function nextQuestion() {

    currentQuestion++;

    showQuestion();

}


// ================= FINISH TEST =================

function finishTest() {

    const total = questions.length;

    const percent =
        Math.round((score / total) * 100);


    let resultTitle = "";
    let resultText = "";
    let resultIcon = "";


    if (percent >= 90) {

        resultIcon = "🏆";

        resultTitle = "Аъло натижа!";

        resultText =
            "Сиз тестни жуда юқори натижа билан якунладингиз.";

    }

    else if (percent >= 70) {

        resultIcon = "🎉";

        resultTitle = "Яхши натижа!";

        resultText =
            "Билимингиз яхши даражада.";

    }

    else if (percent >= 50) {

        resultIcon = "👍";

        resultTitle = "Қониқарли натижа";

        resultText =
            "Натижангизни янада яхшилашингиз мумкин.";

    }

    else {

        resultIcon = "📚";

        resultTitle = "Кўпроқ тайёрланинг";

        resultText =
            "Мавзуларни қайта кўриб чиқиб, яна ҳаракат қилиб кўринг.";

    }


    document.querySelector(".container").innerHTML = `

        <div class="result-card">

            <div class="result-icon">

                ${resultIcon}

            </div>


            <h2>

                ${resultTitle}

            </h2>


            <div class="result-score">

                ${score} / ${total}

            </div>


            <div class="result-percent">

                ${percent}%

            </div>


            <p>

                ${resultText}

            </p>


            <div class="result-progress">

                <div
                    class="result-progress-fill"
                    style="width:${percent}%">

                </div>

            </div>


            <div class="subscription-message">

                🔒

                <br><br>

                <b>
                    Текин тестлар тугади!
                </b>

                <br><br>

                Давом этиш учун обуна сотиб олинг.

            </div>


            <button
                class="send-button"
                onclick="sendResult()">

                📤 Натижани ботга юбориш

            </button>

        </div>

    `;

}


// ================= SEND RESULT =================

function sendResult() {

    const result = {

        score: score,

        total: questions.length

    };


    console.log(result);


    tg.sendData(
        JSON.stringify(result)
    );

}
