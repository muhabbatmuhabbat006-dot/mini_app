* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background: #f2f7f4;
    color: #222;
}

.container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

/* ================= PROGRESS ================= */

.progress-area {
    margin-bottom: 20px;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    margin-bottom: 8px;
    color: #333;
}

.progress-line {
    width: 100%;
    height: 8px;
    background: #dfe7e2;
    border-radius: 10px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: #22a447;
    border-radius: 10px;
    transition: width 0.4s ease;
}

/* ================= QUESTION ================= */

.question-number {
    text-align: center;
    font-size: 16px;
    color: #555;
    margin-bottom: 15px;
}

.question {
    background: white;
    padding: 20px;
    border-radius: 15px;
    line-height: 1.5;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
    margin-bottom: 18px;
}

/* ================= ANSWERS ================= */

#answers {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.answer-button {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 12px;
    background: white;
    color: #222;
    font-size: 16px;
    text-align: left;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    transition: 0.2s;
}

.answer-button:hover {
    transform: translateY(-1px);
}

.answer-button:disabled {
    cursor: default;
}

/* ================= CORRECT ================= */

.answer-button.correct {
    background: #d9f5df;
    color: #16752d;
    border: 2px solid #22a447;
}

/* ================= WRONG ================= */

.answer-button.wrong {
    background: #ffe0e0;
    color: #c62828;
    border: 2px solid #e53935;
}

/* ================= RESULT ================= */

#result {
    margin-top: 15px;
}

.correct-result {
    background: #d9f5df;
    color: #16752d;
    padding: 14px;
    border-radius: 12px;
    text-align: center;
    font-weight: bold;
}

.wrong-result {
    background: #ffe0e0;
    color: #c62828;
    padding: 14px;
    border-radius: 12px;
    text-align: center;
    font-weight: bold;
}

.correct-answer {
    margin-top: 10px;
    background: white;
    color: #16752d;
    padding: 10px;
    border-radius: 8px;
}

/* ================= NEXT BUTTON ================= */

.next-button {
    width: 100%;
    margin-top: 15px;
    padding: 15px;
    border: none;
    border-radius: 12px;
    background: #22a447;
    color: white;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
}

.next-button:hover {
    background: #198c3b;
}

/* ================= RESULT CARD ================= */

.result-card {
    background: white;
    padding: 25px;
    border-radius: 18px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.result-icon {
    font-size: 50px;
    margin-bottom: 10px;
}

.result-score {
    font-size: 35px;
    font-weight: bold;
    margin: 15px 0;
}

.result-percent {
    font-size: 24px;
    font-weight: bold;
    color: #22a447;
    margin-bottom: 15px;
}

.result-progress {
    width: 100%;
    height: 10px;
    background: #dfe7e2;
    border-radius: 10px;
    overflow: hidden;
    margin: 20px 0;
}

.result-progress-fill {
    height: 100%;
    background: #22a447;
    border-radius: 10px;
}

.send-button {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 12px;
    background: #22a447;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}

/* ================= MOBILE ================= */

@media (max-width: 500px) {

    .container {
        padding: 15px;
    }

    .question {
        padding: 17px;
        font-size: 16px;
    }

    .answer-button {
        font-size: 15px;
        padding: 14px;
    }

}
