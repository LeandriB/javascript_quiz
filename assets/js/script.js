// Declare Global variables
var currentQuestion = 0;
var question = document.getElementById("question-container");
var startButton = document.getElementById("start-button");
var quizIntro = document.getElementById("quiz-intro");
var quiz = document.getElementById("quiz-container");
var answerOptions = document.getElementById("answer-options");
var result = document.getElementById("result");
var resultText = document.querySelector(".result-txt");

// Global score variables
var scoreCard = document.getElementById("score-card");
var score = document.getElementById("score");
var leaderboard = document.getElementById("leaderboard-container");
var submitButton = document.getElementById("submit-button");
var inputEl = document.getElementById("initials");
var viewScores = document.querySelector("leaderboard");

// Global Reset variables
var clearButton = document.getElementById("clear-button");
var backButton = document.getElementById("back-button");

// Global timer variables
var time = 75;
var penalty = 10;
var timerInterval;
var displayTimer = document.getElementById("timer");

// Quiz questions
var questions =  [
    {
        question: "Commonly used data values do not include ______.",
        answers: [
            "boolean",
            "numbers & strings",
            "arrays",
            "alerts",
        ],
        correctAnswer: "alerts",
    },
    {
        question: "Arrays in Javascript are used to store ______.",
        answers: [
            "booleans",
            "numbers & strings",
            "other arrays",
            "all of the above",
        ],
        correctAnswer: "all of the above",
    },
    {
        question: "String values must be enclosed within ______ when being assigned to variables.",
        answers: [
            "commas",
            "curly brackets",
            "quotes",
            "parenthesis",
        ],
        correctAnswer: "parenthesis",
    }, 
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        answers: [
            "JavaScript",
            "terminal/bash",
            "for loops",
            "console.log",
        ],
        correctAnswer: "console.log",
    },
    {
        question: "The condition in an if else statement is enclosed with ______.",
        answers: [
            "square brackets",
            "curly brackets",
            "quotes",
            "parenthesis",
        ],
        correctAnswer: "parenthesis",
    }
]

// Define start quiz functions
var startQuiz = function() {
    
    // Remove quiz intro along with start button click
    quizIntro.setAttribute("hidden", true);
    question.removeAttribute("hidden");

    // Render question
    showQuestions();
    // Call startTimer function on button click
    startTimer();

};

// Render questions on page
var showQuestions = function() {

    var question = questions[currentQuestion];
    var answers = question.answers;

    var headerEl = document.querySelector(".question-txt");
    headerEl.textContent = question.question;

    for (i = 0; i < answers.length; i++) {
        var answer = answers[i];
        var answerButton = document.getElementById("answer-button" + i);
        answerButton.textContent = answer;
    }
}

// Check answer against user input
var checkAnswer = function(event) {
    var userInput = event.target;
    result.style.display = "block";

    if (userInput.textContent === questions[currentQuestion].correctAnswer) {
        resultText.textContent = "Correct";
        // Display next question
        nextQuestion();
    } else if(userInput.textContent !== questions[currentQuestion].correctAnswer) {
        time = time - penalty;
        resultText.textContent = "Incorrect";
        // Display next question
        nextQuestion();
    } else {
        stopQuiz();
    }
};

// Next question handler function
var nextQuestion = function() {

    currentQuestion++;

    if(currentQuestion < questions.length) {
        showQuestions();
    } else {
        stopQuiz();
    }
};

 //Countdown timer that executes when start button is clicked
var startTimer = function(){
    timerInterval = setInterval(function() {
        // time--;
        displayTime();
        if (time < 1) {
            stopQuiz();
        }
    }, 1000)
};

// Display time on page
var displayTime = function() {
    displayTimer.textContent = time;
    console.log(time)
}

// End sequence for quiz
var stopQuiz = function () {
    clearInterval(timerInterval);
    question.setAttribute("hidden", true)
    scoreCard.removeAttribute("hidden");
    score.textContent = time;
}

// Save score on leaderboard
var saveScore = function(event) {
    
    event.preventDefault();
    
    if (!inputEl.value) {
        alert("Enter your initials before submitting");
        return;
    }

    var scoreInfo = {
        initials: inputEl.value,
        score: time,
    }

    updateScores(scoreInfo);

    scoreCard.setAttribute("hidden", true);
    leaderboard.removeAttribute("hidden", true);

    displayScores();

}

// Display highscores
var displayScores = function() {

    //TODO: Sort scores
    var sort = sortScores();

    var scoreList = document.getElementById("highscores");
    scoreList.innerHTML = "";
    for (i = 0; i < sort.length; i++) {
        var scoreEntries = sort[i];
        var scoreEl = document.createElement("li");
        scoreList.textContent =
        scoreEntries.initials + " - " + scoreEntries.score;
        scoreList.append(scoreEl);
    }
}

// Sort scores from highest to lowest
var sortScores = function() {
    var scoreArray = getScores();
    if (!scoreArray) {
        return;
    }

    scoreArray.sort(function (a, b) {
        return b.score - a.score;
    });
    return scoreArray;
}

// LocalStorage
// Updates the leaderboard stored in local storage
var updateScores = function(scoreInfo) {
    var scoreArray = getScores();
    //append new score item
    scoreArray.push(scoreInfo);
    localStorage.setItem("scoreArray", JSON.stringify(scoreArray));
}

//Retrieve scores from local storage and parse object using JSON.parse
var getScores = function() {
    var savedScores = localStorage.getItem("scoreArray");
    if (savedScores !== null) {
        var scoreArray = JSON.parse(savedScores);
        return scoreArray;
    } else {
        scoreArray = [];
    }
    return scoreArray;
}

// Reset functions
//clear local storage and display empty leaderboard
var clearScores = function() {
    localStorage.clear();
    // TODO: clear from UI
    getScores();
}

//Hide leaderboard card show start card
var playAgain = function() {
    leaderboard.setAttribute("hidden", true);
    quizIntro.removeAttribute("hidden");

    // Reset Timer
    time = 75;
    displayTimer.innerHTML = "75"
    clearInterval(timerInterval);

    // Reset question index
    currentQuestion = 0;

}

var showHighscores = function() {
//   TODO: call hide element
    scoreCard.removeAttribute("hidden");

        // //stop countdown
        clearInterval(intervalID);

  //assign undefined to time and display that, so that time does not appear on page
    time = undefined;
    displayTime();

  // Display scores
    displayScores();
}

// Hide Elements
var HideEl = function() {
    quiz.setAttribute("hidden", true);
    questionCard.setAttribute("hidden", true);
    scoreCard.setAttribute("hidden", true);
    leaderboardCard.setAttribute("hidden", true);
}


// Event Listeners
startButton.addEventListener("click", startQuiz);
answerOptions.addEventListener("click", checkAnswer);
submitButton.addEventListener("click", saveScore);
clearButton.addEventListener("click", clearScores);
backButton.addEventListener("click", playAgain);
// viewScores.addEventListener("click", showHighscores);
