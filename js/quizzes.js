// --- Placeholder question bank (4 items for early testing) ---
const quizQuestions = [
  {
    id: "q1",                        // unique question id
    type: "normal",                  // text-only (no media)
    text: "When starting a new project, what excites you most?",
    options: [                       // each option maps to one SE path
      { text: "Designing how the website looks and feels", category: "fullStack" },
      { text: "Finding patterns hidden in a big dataset", category: "machineLearning" },
      { text: "Imagining a 3D space someone could step into", category: "arVr" },
      { text: "Understanding exactly how the computer runs your code", category: "lowLevel" }
    ]
  },
  {
    id: "q2",
    type: "normal",
    text: "Which weekend activity sounds most appealing?",
    options: [
      { text: "Building a small app from scratch", category: "fullStack" },
      { text: "Teaching a computer to recognise your handwriting", category: "machineLearning" },
      { text: "Trying out a new VR headset demo", category: "arVr" },
      { text: "Tinkering with a Raspberry Pi or microcontroller", category: "lowLevel" }
    ]
  },
  {
    id: "q3",
    type: "normal",
    text: "A friend asks for your help with a problem. What do you enjoy fixing most?",
    options: [
      { text: "A form on their website that isn't working", category: "fullStack" },
      { text: "Predicting which of their photos people will like most", category: "machineLearning" },
      { text: "Making their game world feel more immersive", category: "arVr" },
      { text: "Their program running too slowly on old hardware", category: "lowLevel" }
    ]
  },
  {
    id: "q4",
    type: "normal",
    text: "Which subject would you enjoy reading about for fun?",
    options: [
      { text: "How modern web apps talk to servers", category: "fullStack" },
      { text: "How neural networks learn from examples", category: "machineLearning" },
      { text: "How motion tracking works in headsets", category: "arVr" },
      { text: "How a CPU actually executes instructions", category: "lowLevel" }
    ]
  }
];

// --- Runtime state ---
let currentQuestionIndex = 0; // which question is on screen
let selectedOptionForCurrentQuestion = null; // pick before scoring exists

// --- Page boot: require student, show Q1 ---
document.addEventListener("DOMContentLoaded", function () {
  const studentData = localStorage.getItem("currentStudent"); // check landing form data
  if (!studentData) {
    window.location.href = "index.html"; // require landing form first
    return;
  }

  displayQuestion(currentQuestionIndex); // render first question

  const nextBtn = document.getElementById("next-btn");
  nextBtn.addEventListener("click", moveToNextQuestion); // wire Next button
});

// --- Render one question + progress UI ---
function displayQuestion(index) {
  const question = quizQuestions[index];

  selectedOptionForCurrentQuestion = null; // reset pick

  const totalQuestions = 10; // planned full-quiz total (placeholder set is smaller)
  document.getElementById("progress-text").textContent =
    "Question " + (index + 1) + " of " + totalQuestions; // DOM: progress label

  const percentComplete = Math.round(((index + 1) / totalQuestions) * 100);
  document.getElementById("progress-bar-fill").style.width = percentComplete + "%"; // DOM bar

  document.getElementById("question-text").textContent = question.text; // DOM: prompt

  const optionsContainer = document.getElementById("answer-options");
  optionsContainer.innerHTML = ""; // clear previous buttons

  question.options.forEach(function (option) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = option.text;

    button.addEventListener("click", function () {
      selectOption(button, option); // store selection
    });

    optionsContainer.appendChild(button); // DOM: add option
  });

  const nextBtn = document.getElementById("next-btn");
  nextBtn.disabled = true; // until an option is chosen
  nextBtn.textContent = (index === quizQuestions.length - 1) ? "Finish" : "Next question"; // last-Q label
}

// --- Option selection (UI only in this placeholder) ---
function selectOption(buttonElement, option) {
  const allButtons = document.querySelectorAll(".option-btn");
  allButtons.forEach(function (btn) {
    btn.classList.remove("selected"); // one selection only
  });

  buttonElement.classList.add("selected"); // highlight choice
  selectedOptionForCurrentQuestion = option; // remember for later scoring

  document.getElementById("next-btn").disabled = false; // enable Next
}

// --- Advance or show placeholder end screen ---
function moveToNextQuestion() {
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  if (isLastQuestion) {
    const questionCard = document.getElementById("question-card");
    questionCard.innerHTML =
      '<p class="disclaimer-text">This is the end of today\'s placeholder questions. ' +
      "Scoring, the full 10-question set, and the results page are built tomorrow.</p>"; // DOM: end note
    return; // placeholder end (no results redirect yet)
  }

  currentQuestionIndex = currentQuestionIndex + 1; // move to next index
  displayQuestion(currentQuestionIndex);           // re-render
}
