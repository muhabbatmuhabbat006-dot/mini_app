const tg = window.Telegram.WebApp;
tg.expand();

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

let timer;
let timeLeft = 30;
const questions = [
{
question:"Oshqozon-ichak traktining yuqumli bo‘lmagan patologiyasi tufayli kelib chiqadigan ko‘ngil aynishi va qusish sababi:",
answers:[
"O‘tkir qorin",
"Ovqatdan zaharlanish",
"Homiladorlar toksikozi",
"Enterobioz"
],
correct:0
},

{
question:"Ko‘ngil aynishi va qusishning metabolik sababi:",
answers:[
"Migren",
"Dori vositalaridan zaharlanish",
"Mener kasalligi",
"Uremiya"
],
correct:3
},

{
question:"Ko‘ngil aynishi va qusishda davolash taktikasiga kirmaydi:",
answers:[
"Anamnezni sinchiklab yig‘ish",
"Najas tahlili",
"Yosh ayollarda homiladorlik testi",
"Qat’iy yotoq rejimi"
],
correct:3
},

{
question:"Yara kasalligi terapiyasi:",
answers:[
"Yotoq tartibi va maxsus parhez",
"Aminoglikozidlar",
"Faqat operatsiya",
"Ovqatni to‘xtatish"
],
correct:0
},

{
question:"Yarani jarrohlik davolashga ko‘rsatma:",
answers:[
"Malignizatsiya",
"Kamqonlik",
"TVI pastligi",
"Zarda qaynashi"
],
correct:0
},

{
question:"Yarani jarrohlik davolash asorati:",
answers:[
"Giperglikemiya",
"Temir tanqisligi",
"Demping sindromi",
"Kekirish"
],
correct:2
},

{
question:"Takroriy qusishda birinchi navbatda nima qilinadi?",
answers:[
"Serukal berish",
"Oshqozonni yuvish",
"Anamnez yig‘ish",
"Operatsiya"
],
correct:2
},

{
question:"Ta’sirlangan ichak sindromida asosiy belgi:",
answers:[
"Ich qotishi",
"Defekatsiya chastotasining o‘zgarishi",
"Qon ketishi",
"Sut ichganda yaxshilanish"
],
correct:1
},

{
question:"Ta’sirlangan ichak sindromi mezoni:",
answers:[
"Ertalab ko‘ngil aynishi",
"Bel og‘rig‘i",
"Malina jelesi axlat",
"To‘liq bo‘shatilmaganlik hissi"
],
correct:3
},

{
question:"Bolalarda qabziyat sababi:",
answers:[
"Fruktoza ko‘pligi",
"Laktoza yetishmovchiligi",
"Ichak tug‘ma patologiyasi",
"Suv ko‘p ichish"
],
correct:2
}
];
function startTest() {

    currentQuestion = 0;
    score = 0;

    questions.sort(() => Math.random() - 0.5);

    showQuestion();

}

function showQuestion() {

    selectedAnswer = null;

    let q = questions[currentQuestion];

    let html = `
    <div class="container">

    <h2>${currentQuestion + 1}/${questions.length}</h2>

<div style="
width:100%;
height:18px;
background:#ddd;
border-radius:10px;
margin:15px 0;
">

<div id="progressBar"
style="
width:${((currentQuestion + 1)/questions.length)*100}%;
height:18px;
background:#28a745;
border-radius:10px;
transition:0.5s;
">
</div>

</div>

<h3 id="timer">⏰ 30 soniya</h3>
<h3>${q.question}</h3>
    `;

    q.answers.forEach((answer, index) => {

        html += `
        <button id="btn${index}"
        onclick="checkAnswer(${index})">
        ${answer}
        </button>
        `;

    });

    html += `
    <br><br>

    <div id="result"></div>

    <button
    id="nextBtn"
    onclick="nextQuestion()"
    style="display:none;">
    ➡️ Keyingi savol
    </button>

    </div>
    `;

    document.body.innerHTML = html;

timeLeft = 30;
startTimer();
}
function checkAnswer(index){

    if(selectedAnswer !== null){
        return;
    }

    selectedAnswer = index;

    let q = questions[currentQuestion];

    let buttons = document.querySelectorAll("button");

    document.querySelectorAll("[id^='btn']").forEach(btn=>{
    btn.disabled = true;
});

    if(index === q.correct){

    score++;

    document.getElementById("btn"+index).style.background = "green";

    document.getElementById("result").innerHTML =
    "<h3 style='color:green'>✅ To'g'ri javob!</h3>";

}else{

    document.getElementById("btn"+index).style.background = "red";

    document.getElementById("btn"+q.correct).style.background = "green";

    document.getElementById("result").innerHTML =
`
<h3 style='color:red'>❌ Noto'g'ri!</h3>

<p style="color:green;font-size:18px;">
✅ To'g'ri javob:<br>
<b>${q.answers[q.correct]}</b>
</p>
`;

}

// 1,5 soniyadan keyin avtomatik keyingi savol
setTimeout(function(){

    nextQuestion();

},1500);

}

function nextQuestion(){

    clearInterval(timer);

    currentQuestion++;

    if(currentQuestion < questions.length){

        showQuestion();

    }else{

        finishTest();

    }

}


function startTimer(){

    clearInterval(timer);

    timer = setInterval(function(){

        timeLeft--;

        const timerElement = document.getElementById("timer");

        if(timerElement){
            timerElement.innerHTML = "⏰ " + timeLeft + " soniya";
        }

        if(timeLeft <= 10 && timerElement){
            timerElement.style.color = "red";
        }

        if(timeLeft <= 0){

            clearInterval(timer);

            nextQuestion();

        }

    },1000);

}


function finishTest(){

    clearInterval(timer);

    tg.sendData(JSON.stringify({

        score:score,

        total:questions.length

    }));

    function finishTest(){

    clearInterval(timer);

    tg.sendData(JSON.stringify({

        score: score,

        total: questions.length

    }));

    let percent = Math.round(score * 100 / questions.length);

    let grade = "";

    if(percent >= 90){
        grade = "🏆 A'lo";
    }
    else if(percent >= 70){
        grade = "🥈 Yaxshi";
    }
    else if(percent >= 50){
        grade = "🥉 Qoniqarli";
    }
    else{
        grade = "📚 Qayta tayyorlaning";
    }

    document.body.innerHTML = `
    <div class="container">

        <h2>✅ Test tugadi</h2>

        <h3>Natija: ${score}/${questions.length}</h3>

        <h2>${percent}%</h2>

        <h2>${grade}</h2>

    </div>
    `;

}
