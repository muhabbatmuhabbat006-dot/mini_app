const tg = window.Telegram.WebApp;

tg.expand();

let currentQuestion = 0;
let score = 0;


const questions = [

{
question: "Oshqozon-ichak traktining yuqumli bo‘lmagan patologiyasi tufayli kelib chiqadigan ko‘ngil aynishi va qusish sababi:",
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
"Homiladorlik testi",
"Qat’iy yotoq rejimi"
],
correct:3
},


{
question:"Yara kasalligi terapiyasi quyidagilarni o‘z ichiga oladi:",
answers:[
"Yotoq tartibi va maxsus parhez",
"Aminoglikozid antibiotiklar",
"Jarrohlik davosi",
"Ovqatni to‘liq to‘xtatish"
],
correct:0
}

]; 

{
question:"Yarani jarrohlik yo‘li bilan davolashga ko‘rsatma:",
answers:[
"Malignizatsiya",
"Kamqonlik",
"Tez-tez zarda qaynashi",
"TVI 27 dan pastligi"
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
question:"Takroriy qusish bilan murojaat qilgan bemorda zarur:",
answers:[
"Serukal tavsiya qilish",
"Oshqozonni yuvish",
"Sababini aniqlash uchun anamnez yig‘ish",
"Umumiy siydik tahlili"
],
correct:2
},


{
question:"Ta’sirlangan ichak sindromida eng ko‘p uchraydigan belgi:",
answers:[
"Asosan ich qotishi",
"Defekatsiya chastotasining o‘zgarishi",
"Sutli parhezdan keyin yaxshilanish",
"Qon ketishi"
],
correct:1
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

    <h2>${currentQuestion + 1}/8</h2>

    <h3>${q.question}</h3>


    ${q.answers.map((answer,index)=>

    `<button onclick="checkAnswer(${index})">
    ${answer}
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

    }

    else{

        finishTest();

    }

}



function finishTest(){


    tg.sendData(JSON.stringify({

        score: score,

        total: questions.length

    }));



    document.body.innerHTML = `

    <h2>✅ Test tugadi</h2>

    <h3>Natija: ${score}/${questions.length}</h3>

    `;

}
