/* --- Specora quiz engine --- */

/* --- TIMING + SCORING CONSTANTS --- */
const OVERALL_TIME_LIMIT = 120;      // whole quiz countdown (seconds)
const NORMAL_QUESTION_TIME = 15;     // seconds for a normal text question
const MEDIA_QUESTION_TIME = 20;      // longer limit for audio / video questions

const BASE_POINTS = 3;               // points added to chosen specialisation
const SPEED_BONUS_POINTS = 1;        // extra points if answered in first half of limit

/* --- localStorage KEYS --- */
const STUDENT_KEY = "currentStudent";   // student form data from index.html
const LAST_SET_KEY = "lastQuizSet";     // remembers "A" or "B" for next attempt
const RESULT_KEY = "latestQuizResult";  // final scores object for results.html
const QUIZ_LOCKED_KEY = "quizLocked";   // "true" after finish until Retake

/* Fixed category order — also used when converting scores to percentages. */
const TIE_BREAK_ORDER = ["fullStack", "machineLearning", "arVr", "lowLevel"];

/* --- SHARED MEDIA QUESTIONS --- */
const audioQuestion = {
  id: "media-audio",
  type: "audio",                     // displayQuestion branches on this
  text: "Listen to the short audio prompt, then choose the activity that appeals to you most.",
  mediaSrc: "assets1/audio/Audio_qn.mp3",
  options: [
    { text: "The first", category: "fullStack" },
    { text: "The second", category: "machineLearning" },
    { text: "The third", category: "arVr" },
    { text: "The fourth(last)", category: "lowLevel" }
  ]
};

const videoQuestion = {
  id: "media-video",
  type: "video",
  text: "Watch the short video, then answer once it pauses.",
  mediaSrc: "assets1/video/Video Project 2.mp4",
  pauseAt: 12,                       // JS auto-pauses playback at this second
  prompt: "If you were to join this team which part would you enjoy developing?",
  options: [
    { text: "The website students use to book rooms and manage reservations", category: "fullStack" },
    { text: "The system that analyses room usage and predicts busy periods", category: "machineLearning" },
    { text: "A virtual version of the room where students can practise or explore", category: "arVr" },
    { text: "The software that communicates with the room’s lights and sensors", category: "lowLevel" }
  ]
};

/* --- QUESTION BANKS (SET A + SET B) --- */
const quizQuestionSets = {

  A: [
    { id: "a1", type: "normal", text: "When starting a new project, what excites you most?",
      options: [
        { text: "Designing how the website looks and feels", category: "fullStack" },
        { text: "Finding patterns hidden in a big dataset", category: "machineLearning" },
        { text: "Imagining a 3D space someone could step into", category: "arVr" },
        { text: "Understanding exactly how the computer runs your code", category: "lowLevel" }
      ] },
    { id: "a2", type: "normal", text: "Which weekend activity sounds most appealing?",
      options: [
        { text: "Building a small app from scratch", category: "fullStack" },
        { text: "Teaching a computer to recognise your handwriting", category: "machineLearning" },
        { text: "Trying out a new VR headset demo", category: "arVr" },
        { text: "Tinkering with a Raspberry Pi or microcontroller", category: "lowLevel" }
      ] },
    { id: "a3", type: "normal", text: "A friend asks for your help with a problem. What do you enjoy fixing most?",
      options: [
        { text: "A form on their website that isn't working", category: "fullStack" },
        { text: "Predicting which of their photos people will like most", category: "machineLearning" },
        { text: "Making their game world feel more immersive", category: "arVr" },
        { text: "Their program running too slowly on old hardware", category: "lowLevel" }
      ] },
    { id: "a4", type: "normal", text: "Which subject would you enjoy reading about for fun?",
      options: [
        { text: "How modern web apps talk to servers", category: "fullStack" },
        { text: "How neural networks learn from examples", category: "machineLearning" },
        { text: "How motion tracking works in headsets", category: "arVr" },
        { text: "How a CPU actually executes instructions", category: "lowLevel" }
      ] },
    audioQuestion,
    { id: "a5", type: "normal", text: "Pick the tool you'd most enjoy getting good at.",
      options: [
        { text: "A front-end framework for building interfaces", category: "fullStack" },
        { text: "A library for training prediction models", category: "machineLearning" },
        { text: "A 3D engine for building interactive worlds", category: "arVr" },
        { text: "A debugger for stepping through machine code", category: "lowLevel" }
      ] },
    { id: "a6", type: "normal", text: "Which achievement would feel most satisfying?",
      options: [
        { text: "Launching a website that real people use", category: "fullStack" },
        { text: "Building a model that predicts something accurately", category: "machineLearning" },
        { text: "Creating an experience someone finds genuinely immersive", category: "arVr" },
        { text: "Making a program run noticeably faster", category: "lowLevel" }
      ] },
    { id: "a7", type: "normal", text: "Which class topic sounds most interesting to you?",
      options: [
        { text: "Databases and how websites store data", category: "fullStack" },
        { text: "Statistics and how machines learn from data", category: "machineLearning" },
        { text: "Computer graphics and rendering", category: "arVr" },
        { text: "Operating systems and computer architecture", category: "lowLevel" }
      ] },
    videoQuestion,
    { id: "a8", type: "normal", text: "If you joined a hackathon team, which role would you pick first?",
      options: [
        { text: "Building the app people will actually click through", category: "fullStack" },
        { text: "Training the model that powers the app's smart feature", category: "machineLearning" },
        { text: "Designing the immersive demo everyone remembers", category: "arVr" },
        { text: "Making sure everything runs fast under pressure", category: "lowLevel" }
      ] }
  ],

  B: [
    { id: "b1", type: "normal", text: "You have a free afternoon with no plans. What do you gravitate toward?",
      options: [
        { text: "Redesigning a website's layout for fun", category: "fullStack" },
        { text: "Playing with a dataset to see what you can find", category: "machineLearning" },
        { text: "Exploring a new VR or AR app", category: "arVr" },
        { text: "Reading about how computer chips are designed", category: "lowLevel" }
      ] },
    { id: "b2", type: "normal", text: "Which of these YouTube videos would you click on first?",
      options: [
        { text: "\u201cBuild a full website in a weekend\u201d", category: "fullStack" },
        { text: "\u201cHow AI recognises faces\u201d", category: "machineLearning" },
        { text: "\u201cInside the newest VR headset\u201d", category: "arVr" },
        { text: "\u201cHow your computer boots up, step by step\u201d", category: "lowLevel" }
      ] },
    { id: "b3", type: "normal", text: "A younger student asks what you want to build one day. You say:",
      options: [
        { text: "\u201cAn app that helps people do something useful daily.\u201d", category: "fullStack" },
        { text: "\u201cSomething that learns and improves on its own.\u201d", category: "machineLearning" },
        { text: "\u201cA world people can step into and explore.\u201d", category: "arVr" },
        { text: "\u201cSomething incredibly fast and efficient under the hood.\u201d", category: "lowLevel" }
      ] },
    { id: "b4", type: "normal", text: "Which small win would make your day?",
      options: [
        { text: "A tricky bug in your website's form finally works", category: "fullStack" },
        { text: "Your model's accuracy jumps after tuning it", category: "machineLearning" },
        { text: "A scene finally feels believable in your headset", category: "arVr" },
        { text: "You shave milliseconds off a slow function", category: "lowLevel" }
      ] },
    audioQuestion,
    { id: "b5", type: "normal", text: "Pick the project you'd rather spend a whole semester on.",
      options: [
        { text: "A booking or e-commerce website", category: "fullStack" },
        { text: "A tool that predicts something from data", category: "machineLearning" },
        { text: "A short interactive VR experience", category: "arVr" },
        { text: "A tiny operating system or driver", category: "lowLevel" }
      ] },
    { id: "b6", type: "normal", text: "Which complaint would bother you the most while using an app?",
      options: [
        { text: "The interface is confusing and ugly", category: "fullStack" },
        { text: "The recommendations it gives are clearly wrong", category: "machineLearning" },
        { text: "The 3D environment feels flat and unconvincing", category: "arVr" },
        { text: "It's laggy and drains your battery fast", category: "lowLevel" }
      ] },
    { id: "b7", type: "normal", text: "Which club would you join first at university?",
      options: [
        { text: "Web development club", category: "fullStack" },
        { text: "AI and data science club", category: "machineLearning" },
        { text: "Game and VR development club", category: "arVr" },
        { text: "Robotics and embedded systems club", category: "lowLevel" }
      ] },
    videoQuestion,
    { id: "b8", type: "normal", text: "Pick the compliment you'd most want to hear about your work.",
      options: [
        { text: "\u201cThis site feels so smooth to use.\u201d", category: "fullStack" },
        { text: "\u201cHow did it predict that so well?\u201d", category: "machineLearning" },
        { text: "\u201cI actually forgot I wasn't really there.\u201d", category: "arVr" },
        { text: "\u201cThis runs incredibly fast for what it's doing.\u201d", category: "lowLevel" }
      ] }
  ]
};

/* --- RUNTIME STATE --- */
let activeQuestions = [];                      // the chosen A or B array
let currentQuestionIndex = 0;                  // which question is on screen (0-based)
let pendingSelection = null;                   // last clicked option (not scored yet)
let questionStartTime = null;                  // Date.now() when question opened
let currentQuestionTimeLimit = NORMAL_QUESTION_TIME; // used for speed-bonus check

let overallSecondsRemaining = OVERALL_TIME_LIMIT;
let questionSecondsRemaining = NORMAL_QUESTION_TIME;
let overallTimerId = null;                     // setInterval handle for overall clock
let questionTimerId = null;                    // setInterval handle for question clock

/* Running point totals — one counter per specialisation. */
const categoryScores = { fullStack: 0, machineLearning: 0, arVr: 0, lowLevel: 0 };

/* --- QUESTION SET SELECTION --- */
function chooseQuestionSet() {
  const lastSet = localStorage.getItem(LAST_SET_KEY);
  const nextSet = lastSet === "A" ? "B" : "A"; // first visit (no key) → "A"
  localStorage.setItem(LAST_SET_KEY, nextSet);
  return quizQuestionSets[nextSet];
}

/* --- PAGE BOOT (DOMContentLoaded) --- */
document.addEventListener("DOMContentLoaded", function () {
  /* Gate 1: quiz already finished → force Results (must use Retake). */
  if (localStorage.getItem(QUIZ_LOCKED_KEY) === "true") {
    window.location.href = "results.html";
    return;
  }

  /* Gate 2: no student details → send back to Home form. */
  const studentData = localStorage.getItem(STUDENT_KEY);
  if (!studentData) {
    window.location.href = "index.html";
    return;
  }

  activeQuestions = chooseQuestionSet();
  startOverallTimer();
  displayQuestion(currentQuestionIndex);

  /* Next / Finish button: score current pick, then move on. */
  document.getElementById("next-btn").addEventListener("click", function () {
    commitCurrentAnswer();
    advanceToNextQuestion();
  });
});

/* --- TIME FORMATTING HELPER --- */
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const pad = function (n) { return n < 10 ? "0" + n : "" + n; };
  return pad(minutes) + ":" + pad(seconds);
}

/* --- OVERALL QUIZ TIMER --- */
function startOverallTimer() {
  if (overallTimerId !== null) clearInterval(overallTimerId);

  overallSecondsRemaining = OVERALL_TIME_LIMIT;
  updateOverallTimerDisplay();

  overallTimerId = setInterval(function () {
    overallSecondsRemaining -= 1;
    updateOverallTimerDisplay();

    if (overallSecondsRemaining <= 0) {
      clearInterval(overallTimerId);
      overallTimerId = null;
      handleOverallTimeout();
    }
  }, 1000);
}

/* Update #overall-timer text + urgency CSS classes (warning / danger). */
function updateOverallTimerDisplay() {
  const el = document.getElementById("overall-timer");
  el.textContent = formatTime(overallSecondsRemaining);

  el.classList.remove("timer-warning", "timer-danger");
  if (overallSecondsRemaining <= 20) {
    el.classList.add("timer-danger");
  } else if (overallSecondsRemaining <= 60) {
    el.classList.add("timer-warning");
  }
}

/* --- PER-QUESTION TIMER --- */
function startQuestionTimer(limitSeconds) {
  if (questionTimerId !== null) clearInterval(questionTimerId);

  currentQuestionTimeLimit = limitSeconds;
  questionSecondsRemaining = limitSeconds;
  questionStartTime = Date.now();
  updateQuestionTimerDisplay();

  questionTimerId = setInterval(function () {
    questionSecondsRemaining -= 1;
    updateQuestionTimerDisplay();

    if (questionSecondsRemaining <= 0) {
      clearInterval(questionTimerId);
      questionTimerId = null;
      handleQuestionTimeout();
    }
  }, 1000);
}

/* Update #question-timer + show “almost up” notice at 5 seconds. */
function updateQuestionTimerDisplay() {
  const el = document.getElementById("question-timer");
  el.textContent = "00:" + (questionSecondsRemaining < 10 ? "0" : "") + questionSecondsRemaining;

  el.classList.remove("timer-warning", "timer-danger");
  if (questionSecondsRemaining <= 5) {
    el.classList.add("timer-danger");
  } else if (questionSecondsRemaining <= 10) {
    el.classList.add("timer-warning");
  }

  if (questionSecondsRemaining === 5) {
    showTimeoutMessage("Hurry — time is almost up for this question!");
  }
}

/* --- DYNAMIC QUESTION RENDER (DOM UPDATES) --- */
function displayQuestion(index) {
  clearTimeoutMessage();

  const question = activeQuestions[index];
  pendingSelection = null;

  /* Progress label + bar width (% of quiz complete). */
  const totalQuestions = activeQuestions.length;
  document.getElementById("progress-text").textContent =
    "Question " + (index + 1) + " of " + totalQuestions;
  const percentComplete = Math.round(((index + 1) / totalQuestions) * 100);
  const progressFill = document.getElementById("progress-bar-fill");
  progressFill.style.width = percentComplete + "%";
  progressFill.classList.remove("is-ticking");
  void progressFill.offsetWidth; /* force reflow so CSS tick animation restarts */
  progressFill.classList.add("is-ticking");

  document.getElementById("question-text").textContent = question.text;

  /* Wipe previous question’s dynamic DOM nodes. */
  const mediaArea = document.getElementById("media-area");
  mediaArea.innerHTML = "";
  const optionsContainer = document.getElementById("answer-options");
  optionsContainer.innerHTML = "";

  const nextBtn = document.getElementById("next-btn");
  nextBtn.disabled = true; /* enabled again in selectOption() */
  nextBtn.textContent = (index === activeQuestions.length - 1) ? "Finish quiz" : "Next question";

  if (question.type === "audio") {
    buildAudioQuestion(question, mediaArea);
    buildOptions(question, optionsContainer);
    startQuestionTimer(MEDIA_QUESTION_TIME);
  } else if (question.type === "video") {
    buildVideoQuestion(question, mediaArea, optionsContainer);
    startQuestionTimer(MEDIA_QUESTION_TIME);
  } else {
    buildOptions(question, optionsContainer);
    startQuestionTimer(NORMAL_QUESTION_TIME);
  }
}

/* --- ANSWER OPTION BUTTONS --- */
function buildOptions(question, container) {
  question.options.forEach(function (option) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = option.text;
    button.addEventListener("click", function () {
      selectOption(button, option);
    });
    container.appendChild(button);
  });
}

/* Real-time UI state: only one option selected; unlock Next. */
function selectOption(buttonElement, option) {
  const allButtons = document.querySelectorAll(".option-btn");
  allButtons.forEach(function (btn) {
    btn.classList.remove("selected", "is-pressed");
  });

  buttonElement.classList.add("selected", "is-pressed");
  window.setTimeout(function () {
    buttonElement.classList.remove("is-pressed");
  }, 160);

  pendingSelection = option; /* used later by commitCurrentAnswer() */
  document.getElementById("next-btn").disabled = false;
}

/* --- INTERACTIVE AUDIO PLAYER --- */
function buildAudioQuestion(question, container) {
  const wrapper = document.createElement("div");
  wrapper.className = "media-audio";

  const audio = document.createElement("audio");
  audio.src = question.mediaSrc;
  audio.id = "quiz-audio";

  const controls = document.createElement("div");
  controls.className = "media-controls";

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "btn media-btn";
  toggleBtn.textContent = "\u25B6 Play";

  /* Toggle play ↔ pause based on current audio state. */
  toggleBtn.addEventListener("click", function () {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  /* Keep button label in sync with playback events. */
  audio.addEventListener("play", function () {
    toggleBtn.textContent = "\u23F8 Pause";
  });
  audio.addEventListener("pause", function () {
    toggleBtn.textContent = "\u25B6 Play";
  });
  audio.addEventListener("ended", function () {
    toggleBtn.textContent = "\u25B6 Play";
  });

  const replayBtn = document.createElement("button");
  replayBtn.type = "button";
  replayBtn.className = "btn media-btn";
  replayBtn.textContent = "\u21BA Replay";
  replayBtn.addEventListener("click", function () {
    audio.currentTime = 0;
    audio.play();
  });

  controls.appendChild(toggleBtn);
  controls.appendChild(replayBtn);
  wrapper.appendChild(audio);
  wrapper.appendChild(controls);
  container.appendChild(wrapper);
}

/* --- INTERACTIVE VIDEO PLAYER --- */
function buildVideoQuestion(question, mediaContainer, optionsContainer) {
  const wrapper = document.createElement("div");
  wrapper.className = "media-video";

  const video = document.createElement("video");
  video.src = question.mediaSrc;
  video.id = "quiz-video";
  video.setAttribute("playsinline", "");

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "btn media-btn";
  toggleBtn.textContent = "\u25B6 Play video";

  const muteBtn = document.createElement("button");
  muteBtn.type = "button";
  muteBtn.className = "btn media-btn";
  muteBtn.textContent = "\u{1F50A} Mute";

  toggleBtn.addEventListener("click", function () {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  muteBtn.addEventListener("click", function () {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "\u{1F507} Unmute" : "\u{1F50A} Mute";
  });

  video.addEventListener("play", function () {
    toggleBtn.textContent = "\u23F8 Pause video";
  });
  video.addEventListener("pause", function () {
    toggleBtn.textContent = "\u25B6 Play video";
  });

  let alreadyPaused = false; /* ensure we only auto-pause once */

  /* timeupdate fires many times during playback — check against pauseAt. */
  video.addEventListener("timeupdate", function () {
    if (!alreadyPaused && video.currentTime >= question.pauseAt) {
      video.pause();
      alreadyPaused = true;

      const revealText = document.createElement("p");
      revealText.className = "media-reveal-prompt";
      revealText.textContent = question.prompt;
      optionsContainer.appendChild(revealText);

      buildOptions(question, optionsContainer); /* unlock answers after pause */
    }
  });

  wrapper.appendChild(video);
  wrapper.appendChild(toggleBtn);
  wrapper.appendChild(muteBtn);
  mediaContainer.appendChild(wrapper);
}

/* --- SCORING ENGINE --- */
function commitCurrentAnswer() {
  if (pendingSelection === null) {
    return;
  }

  categoryScores[pendingSelection.category] += BASE_POINTS;

  const elapsedSeconds = (Date.now() - questionStartTime) / 1000;
  if (elapsedSeconds <= currentQuestionTimeLimit / 2) {
    categoryScores[pendingSelection.category] += SPEED_BONUS_POINTS;
  }
}

/* --- QUESTION NAVIGATION --- */
function advanceToNextQuestion() {
  const isLastQuestion = currentQuestionIndex === activeQuestions.length - 1;

  if (isLastQuestion) {
    submitQuiz();
    return;
  }

  currentQuestionIndex += 1;
  displayQuestion(currentQuestionIndex);
}

/* --- TIMEOUT HANDLERS --- */
function handleQuestionTimeout() {
  commitCurrentAnswer();
  lockCurrentControls();
  showTimeoutMessage("Time is up! Moving to the next question.");

  setTimeout(function () {
    advanceToNextQuestion();
  }, 1200);
}

function handleOverallTimeout() {
  if (questionTimerId !== null) {
    clearInterval(questionTimerId);
    questionTimerId = null;
  }

  commitCurrentAnswer();
  lockCurrentControls();
  showTimeoutMessage("Time's up for the whole quiz! Submitting your answers now.");

  setTimeout(function () {
    submitQuiz();
  }, 1200);
}

/* Disable options + Next; pause any playing media. */
function lockCurrentControls() {
  document.querySelectorAll(".option-btn").forEach(function (btn) { btn.disabled = true; });
  document.getElementById("next-btn").disabled = true;

  const audio = document.getElementById("quiz-audio");
  if (audio) audio.pause();
  const video = document.getElementById("quiz-video");
  if (video) video.pause();
}

/* Inject / replace the amber timeout banner inside #question-card. */
function showTimeoutMessage(message) {
  const existing = document.getElementById("timeout-message");
  if (existing) existing.remove();

  const msg = document.createElement("p");
  msg.id = "timeout-message";
  msg.className = "timeout-message";
  msg.textContent = message;
  document.getElementById("question-card").appendChild(msg);
}

function clearTimeoutMessage() {
  const existing = document.getElementById("timeout-message");
  if (existing) existing.remove();
}

/* --- SUBMIT / SCORING SUMMARY --- */
function submitQuiz() {
  if (overallTimerId !== null) { clearInterval(overallTimerId); overallTimerId = null; }
  if (questionTimerId !== null) { clearInterval(questionTimerId); questionTimerId = null; }

  const totalPoints =
    categoryScores.fullStack + categoryScores.machineLearning +
    categoryScores.arVr + categoryScores.lowLevel;

  /* Convert raw points → percentage share of the total. */
  const percentages = {};
  TIE_BREAK_ORDER.forEach(function (category) {
    percentages[category] = totalPoints === 0
      ? 25
      : Math.round((categoryScores[category] / totalPoints) * 100);
  });

  /* Highest percentage wins; earlier TIE_BREAK_ORDER item wins exact ties. */
  let topCategory = TIE_BREAK_ORDER[0];
  TIE_BREAK_ORDER.forEach(function (category) {
    if (percentages[category] > percentages[topCategory]) {
      topCategory = category;
    }
  });

  const studentDetails = JSON.parse(localStorage.getItem(STUDENT_KEY));
  const completedSet = localStorage.getItem(LAST_SET_KEY);

  const result = {
    studentName: studentDetails.firstName + " " + studentDetails.lastName,
    questionSet: completedSet,
    scores: categoryScores,
    percentages: percentages,
    topCategory: topCategory,
    completedAt: new Date().toISOString()
  };

  localStorage.setItem(RESULT_KEY, JSON.stringify(result));
  localStorage.setItem(QUIZ_LOCKED_KEY, "true");

  window.location.href = "results.html";
}
