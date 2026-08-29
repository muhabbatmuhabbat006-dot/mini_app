const tg = window.Telegram.WebApp;

tg.expand();

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

let timer;
let timeLeft = 30;

let questions = uashQuestions;


// ================= DIRECTION ID =================

const urlParams = new URLSearchParams(
    window.location.search
);

const directionId = parseInt(
    urlParams.get("direction_id")
);


// ================= START TEST =================

function startTest() {

    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;

    questions = [...uashQuestions];

    questions.sort(
        () => Math.random() - 0.5
    );

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


    document.querySelector(".container").innerHTML = `

        <div class="progress-area">

            <div class="progress-info">

                <span>
                    Savol ${currentQuestion + 1}
                </span>

                <span>
                    ${questions.length} ta
                </span>

            </div>


            <div class="progress-line">

                <div
                    class="progress-fill"
                    style="width:${
                        ((currentQuestion) /
                        questions.length) * 100
                    }%">
                </div>

            </div>

        </div>


        <div class="question-number">

            ${currentQuestion + 1} /
            ${questions.length}

        </div>


        <div class="question">

            ${q.question}

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


    document.getElementById(
        "answers"
    ).innerHTML = answerHTML;

}


// ================= CHECK ANSWER =================

function checkAnswer(selected) {

    if (selectedAnswer !== null) {

        return;
    }


    selectedAnswer = selected;


    const buttons =
        document.querySelectorAll(
            ".answer-button"
        );


    buttons.forEach(
        btn => btn.disabled = true
    );


    const correct =
        questions[currentQuestion].correct;


    if (selected === correct) {

        score++;


        buttons[selected]
            .classList.add("correct");


        document.getElementById(
            "result"
        ).innerHTML = `

            <div class="correct-result">

                ✅ Тўғри жавоб!

            </div>

        `;

    } else {

        buttons[selected]
            .classList.add("wrong");


        buttons[correct]
            .classList.add("correct");


        document.getElementById(
            "result"
        ).innerHTML = `

            <div class="wrong-result">

                ❌ Нотўғри жавоб!

                <div class="correct-answer">

                    ✅ Тўғри жавоб:

                    <b>
                        ${
                            questions[
                                currentQuestion
                            ].answers[correct]
                        }
                    </b>

                </div>

            </div>

        `;

    }


    document.getElementById(
        "nextButton"
    ).style.display = "block";

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
        Math.round(
            (score / total) * 100
        );


    let title;


    if (percent >= 90) {

        title = "🏆 A'lo natija!";

    } else if (percent >= 70) {

        title = "🎉 Yaxshi natija!";

    } else if (percent >= 50) {

        title = "👍 Qoniqarli natija";

    } else {

        title = "📚 Ko‘proq tayyorlaning";

    }


    document.querySelector(
        ".container"
    ).innerHTML = `

        <div class="result-card">

            <div class="result-icon">

                ${
                    percent >= 70
                    ? "🏆"
                    : "📚"
                }

            </div>


            <h2>

                ${title}

            </h2>


            <div class="result-score">

                ${score} / ${total}

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

                Test yakunlandi.

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


    console.log(
        "WEBAPP RESULT:",
        result
    );


    tg.sendData(
        JSON.stringify(result)
    );

}
