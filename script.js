const tg = window.Telegram.WebApp;

tg.expand();


let currentQuestion = 0;
let score = 0;


const questions = [
    {
        question: "Қандли диабетда асосий гормон қайси?",
        answers: [
            "Инсулин",
            "Адреналин",
            "Тироксин",
            "Кортизол"
        ],
        correct: 0
    },

    {
        question: "Қон босимини ўлчаш асбоби?",
        answers: [
            "Тонометр",
            "Термометр",
            "Фонендоскоп",
            "ЭКГ"
        ],
        correct: 0
    },

    {
        question: "Тана ҳароратини ўлчаш учун?",
        answers: [
            "Термометр",
            "Тонометр",
            "Глюкометр",
            "Спирометр"
        ],
        correct: 0
    }

];



function startTest(){

    currentQuestion = 0;
    score = 0;

    showQuestion();

}



function showQuestion(){

    let q = questions[currentQuestion];


    document.body.innerHTML = `

    <h2>${q.question}</h2>

    ${q.answers.map((a,index)=>

    `<button onclick="checkAnswer(${index})">
    ${a}
    </button>`

    ).join("")}

    `;

}



function checkAnswer(answer){

    let q = questions[currentQuestion];


    if(answer === q.correct){
        score++;
    }


    currentQuestion++;


    if(currentQuestion < questions.length){

        showQuestion();

    } else {

        finishTest();

    }

}



function finishTest(){

    let result = {

        score: score,

        total: questions.length

    };


    tg.sendData(JSON.stringify(result));


    document.body.innerHTML = `

    <h2>✅ Test tugadi</h2>

    <p>
    Natija: ${score}/${questions.length}
    </p>

    `;

}
