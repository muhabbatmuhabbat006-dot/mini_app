const tg = window.Telegram.WebApp;

tg.expand();

let currentQuestion = 0;
let score = 0;

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
question:"Yara kasalligi terapiyasi quyidagilarni o‘z ichiga oladi:",
answers:[
"Yotoq tartibi va maxsus parhez",
"Aminoglikozidlar guruhi antibiotiklari",
"Faqat jarrohlik davosi",
"Oziq-ovqatni to‘liq to‘xtatish"
],
correct:0
},

{
question:"Yarani jarrohlik yo‘li bilan davolashga ko‘rsatma:",
answers:[
"Malignizatsiya",
"Kamqonlik",
"TVI 27 dan pastligi",
"Tez-tez zarda qaynashi"
],
correct:0
},
    {
question:"Yarani jarrohlik yo‘li bilan davolash asorati:",
answers:[
"Giperglikemiya",
"Temir tanqisligi anemiyasi",
"Demping sindromi",
"Kuchli kekirish"
],
correct:2
},

{
question:"Takroriy qusish shikoyati bilan murojaat qilgan bemorlarda quyidagilar zarur:",
answers:[
"Serukalning tavsiya qilinishi",
"Oshqozonni yuvish",
"Sababini aniqlash uchun anamnez yig‘ish",
"Umumiy siydik tahlilini o‘tkazish"
],
correct:2
},

{
question:"Ta’sirlangan ichak sindromida eng ko‘p uchraydigan belgi:",
answers:[
"Asosan ich qotishi",
"Defekatsiya chastotasining o‘zgarishi",
"Sutli parhez tayinlangandan so‘ng belgilarning yaxshilanishi",
"Qon ketishi"
],
correct:1
},

{
question:"Ta’sirlangan ichak sindromi tashxisini qo‘yish mezoni:",
answers:[
"Ertalab ko‘ngil aynishi",
"Belbog‘simon og‘riq",
"Malina jelesi ko‘rinishidagi axlat",
"To‘liq bo‘shatilmaganlik hissi"
],
correct:3
},

{
question:"Bolalarda qabziyatni keltirib chiqaruvchi omil:",
answers:[
"Ratsionda fruktozaning ko‘pligi",
"Laktoza yetishmovchiligi",
"Ichak rivojlanishining tug‘ma patologiyasi",
"Suvni ko‘p ichish"
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
    let q = questions[currentQuestion];

    let html = `
        <div class="container">
            <h2>${currentQuestion + 1}/${questions.length}</h2>
            <h3>${q.question}</h3>
    `;

    q.answers.forEach((answer, index) => {
        html += `
            <button onclick="checkAnswer(${index})">
                ${answer}
            </button>
        `;
    });

    html += `</div>`;

    document.body.innerHTML = html;
}

function checkAnswer(answer) {
    if (answer === questions[currentQuestion].correct) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        finishTest();
    }
}

function finishTest() {

    tg.sendData(JSON.stringify({
        score: score,
        total: questions.length
    }));

    document.body.innerHTML = `
        <div class="container">
            <h2>✅ Test tugadi</h2>
            <h3>Natija: ${score}/${questions.length}</h3>
        </div>
    `;
}
