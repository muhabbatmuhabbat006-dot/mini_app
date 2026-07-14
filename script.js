const tg = window.Telegram.WebApp;
tg.expand();

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

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
    showQuestion();
}

function showQuestion() {

    selectedAnswer = null;

    let q = questions[currentQuestion];

    let html = `
    <div class="container">

    <h2>${currentQuestion + 1}/${questions.length}</h2>

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
}
function checkAnswer(index){

    if(selectedAnswer !== null){
        return;
    }

    selectedAnswer = index;

    let q = questions[currentQuestion];

    let buttons = document.querySelectorAll("button");

    buttons.forEach(btn=>{
        btn.disabled = true;
    });

    if(index === q.correct){

        score++;

        buttons[index].style.background = "green";

        document.getElementById("result").innerHTML =
        "<h3 style='color:green'>✅ To'g'ri javob!</h3>";

    }else{

        buttons[index].style.background = "red";

        buttons[q.correct].style.background = "green";

        document.getElementById("result").innerHTML =
        "<h3 style='color:red'>❌ Noto'g'ri!</h3>";

    }

    document.getElementById("nextBtn").style.display = "inline-block";

}


function nextQuestion(){

    currentQuestion++;

    if(currentQuestion < questions.length){

        showQuestion();

    }else{

        finishTest();

    }

}


function finishTest(){

    tg.sendData(JSON.stringify({

        score:score,

        total:questions.length

    }));

    let percent = Math.round(score*100/questions.length);

    document.body.innerHTML = `
    <div class="container">

    <h2>✅ Test tugadi</h2>

    <h3>${score}/${questions.length}</h3>

    <h2>${percent}%</h2>

    </div>
    `;

}
