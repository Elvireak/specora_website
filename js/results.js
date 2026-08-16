/* --- Specora results page --- */

/* --- localStorage KEYS (must match quiz.js) --- */
const RESULT_KEY = "latestQuizResult";
const STUDENT_KEY = "currentStudent";
const QUIZ_LOCKED_KEY = "quizLocked";

/* --- SPECIALISATION COPY BANK --- */
const specialisationInfo = {
  fullStack: {
    label: "Full-Stack Web Development",
    shortLabel: "Full-Stack",
    description:
      "You're drawn to building complete, usable products - from what people " +
      "see and click, through to how the site actually works behind the scenes.",
    nextSteps: [
      "Build one small personal project website end-to-end, from layout to a working form.",
      "Get comfortable with HTML, CSS, and JavaScript before picking up a framework.",
      "Learn the basics of how a website stores and retrieves data (databases)."
    ]
  },
  machineLearning: {
    label: "Machine Learning",
    shortLabel: "Machine Learning",
    description:
      "You enjoy finding patterns in data and teaching systems to make useful " +
      "predictions rather than following fixed, hand-written rules.",
    nextSteps: [
      "Get comfortable with Python and basic statistics fundamentals.",
      "Try a beginner-friendly course, such as Kaggle Learn's introductory tracks.",
      "Experiment with one small, real dataset you're personally curious about."
    ]
  },
  arVr: {
    label: "AR/VR Development",
    shortLabel: "AR/VR",
    description:
      "You're excited by building immersive spaces and experiences people can " +
      "step into, rather than just look at on a flat screen.",
    nextSteps: [
      "Explore a beginner 3D engine tutorial, such as Unity's official starter guide.",
      "Learn the basic maths behind 3D space: vectors, rotation, and scale.",
      "Try building one very small AR effect using a tool like WebXR or ARCore."
    ]
  },
  lowLevel: {
    label: "Low-Level Programming",
    shortLabel: "Low-Level",
    description:
      "You're most engaged by understanding exactly what's happening under the " +
      "hood - memory, performance, and how software actually talks to hardware.",
    nextSteps: [
      "Learn the fundamentals of C, and how memory allocation actually works.",
      "Study the basics of how an operating system manages processes and memory.",
      "Try a small hands-on project with a microcontroller, such as an Arduino."
    ]
  }
};

/* --- FALLBACK COPY (ALL SCORES EQUAL) --- */
const ALL_EQUAL_DESCRIPTION =
  "Your answers did not indicate one clear preference. You appear open to " +
  "exploring different areas of software engineering. Try the quiz again with " +
  "new questions or complete a small beginner project in each area.";

const ALL_EQUAL_NEXT_STEPS = [
  "Retake the quiz with a new set of questions to see if a clearer preference emerges.",
  "Try a small beginner project in each specialisation and notice which one you enjoy most.",
  "Talk with a tutor or mentor about the kinds of problems you like solving day to day."
];

/* Map each category to a CSS custom property used when painting chart bars. */
const categoryColors = {
  fullStack: "--color-primary",
  machineLearning: "--color-accent",
  arVr: "--color-warning",
  lowLevel: "--color-text-muted"
};

/* Keep last chart data so window resize can redraw without re-animating. */
let lastDrawnPercentages = null;

/* --- PAGE BOOT --- */
document.addEventListener("DOMContentLoaded", function () {
  const savedResult = localStorage.getItem(RESULT_KEY);

  /* No quiz taken yet → show empty CTA, hide results panel. */
  if (!savedResult) {
    document.getElementById("empty-state").hidden = false;
    document.getElementById("results-content").hidden = true;
    return;
  }

  const result = JSON.parse(savedResult);
  displayResult(result);

  /* Ensure Quiz stays locked while a result exists. */
  if (localStorage.getItem(QUIZ_LOCKED_KEY) !== "true") {
    localStorage.setItem(QUIZ_LOCKED_KEY, "true");
  }

  /* Retake: clear student + lock so Home form shows again (keeps lastQuizSet). */
  function startRetake() {
    localStorage.removeItem(STUDENT_KEY);
    localStorage.removeItem(QUIZ_LOCKED_KEY);
    window.location.href = "index.html";
  }

  document.getElementById("retake-btn").addEventListener("click", startRetake);

  /* Event delegation: retake link inside next-steps list. */
  document.getElementById("next-steps-list").addEventListener("click", function (event) {
    const link = event.target.closest("a.next-step-retake");
    if (!link) return;
    event.preventDefault();
    startRetake();
  });

  /* Redraw chart when viewport width changes (no grow animation). */
  window.addEventListener("resize", function () {
    if (lastDrawnPercentages) {
      drawResultsChart(lastDrawnPercentages, false);
    }
  });
});

/* --- OUTCOME CLASSIFIER --- */
function analyseOutcome(percentages) {
  const categories = Object.keys(percentages);
  const values = categories.map(function (category) {
    return percentages[category];
  });

  const allEqual = values.every(function (value) {
    return value === values[0];
  });

  if (allEqual) {
    return { type: "allEqual", topCategories: [] };
  }

  const maxValue = Math.max.apply(null, values);
  const topCategories = categories.filter(function (category) {
    return percentages[category] === maxValue;
  });

  if (topCategories.length > 1) {
    return { type: "tie", topCategories: topCategories };
  }

  return { type: "clear", topCategories: topCategories };
}

/* --- TEXT HELPERS FOR TIES --- */
function joinWithAnd(items) {
  if (items.length <= 1) {
    return items[0] || "";
  }
  if (items.length === 2) {
    return items[0] + " and " + items[1];
  }
  return items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];
}

function buildTieDescription(topCategories) {
  const labels = topCategories.map(function (category) {
    return specialisationInfo[category].label;
  });
  return (
    "Your highest scores are tied between " +
    joinWithAnd(labels) +
    ". Please retake the quiz with new questions to receive a clearer recommendation."
  );
}

function buildTieNextSteps(topCategories) {
  const shortNames = joinWithAnd(
    topCategories.map(function (category) {
      return specialisationInfo[category].shortLabel;
    })
  );

  return [
    "Retake the quiz with new questions to break the tie between " + shortNames + ".",
    "Try a small beginner task in each tied area and compare which feels more natural.",
    "Review module outlines for both specialisations with a tutor before deciding."
  ];
}

/* --- DYNAMIC RESULTS UI (DOM UPDATES) --- */
function displayResult(result) {
  document.getElementById("empty-state").hidden = true;
  document.getElementById("results-content").hidden = false;

  const outcome = analyseOutcome(result.percentages);
  const matchCard = document.getElementById("match-card");
  const matchLabel = document.getElementById("match-card-label");
  const matchHeading = document.getElementById("match-heading");
  const matchDescription = document.getElementById("top-category-description");
  const stepsList = document.getElementById("next-steps-list");

  /* Greeting uses first name only. */
  const firstName = (result.studentName || "").trim().split(/\s+/)[0] || "there";
  document.getElementById("student-greeting").textContent = "Hi, " + firstName + "!";

  /* Neutral card style when there is no preferred specialisation. */
  matchCard.classList.toggle("is-neutral", outcome.type === "allEqual");
  stepsList.innerHTML = "";

  let nextSteps = [];
  const highlightedCategories = outcome.topCategories.slice();

  /* --- Match card content by outcome type --- */
  if (outcome.type === "allEqual") {
    matchLabel.textContent = "Your strongest match";
    matchHeading.textContent = "None";
    matchDescription.textContent = ALL_EQUAL_DESCRIPTION;
    nextSteps = ALL_EQUAL_NEXT_STEPS;
  } else if (outcome.type === "tie") {
    const shortNames = joinWithAnd(
      outcome.topCategories.map(function (category) {
        return specialisationInfo[category].shortLabel;
      })
    );
    matchLabel.textContent = "Your strongest match";
    matchHeading.textContent = shortNames;
    matchDescription.textContent = buildTieDescription(outcome.topCategories);
    nextSteps = buildTieNextSteps(outcome.topCategories);
  } else {
    const topCategory = outcome.topCategories[0];
    const topInfo = specialisationInfo[topCategory];
    matchLabel.textContent = "Your strongest match";
    matchHeading.textContent = topInfo.label;
    matchDescription.textContent = topInfo.description;
    nextSteps = topInfo.nextSteps;
  }

  /* --- Build next-steps <li> elements; turn “Retake…” into a link --- */
  nextSteps.forEach(function (step) {
    const li = document.createElement("li");
    if (/^Retake the quiz/i.test(step)) {
      li.innerHTML = step.replace(
        /^Retake the quiz/i,
        '<a href="index.html" class="next-step-retake">Retake the quiz</a>'
      );
    } else {
      li.textContent = step;
    }
    stepsList.appendChild(li);
  });

  /* --- Ranked score list (highest % first) with cascade animation delay --- */
  const scoreList = document.getElementById("score-list");
  scoreList.innerHTML = "";

  const sortedCategories = Object.keys(result.percentages).sort(function (a, b) {
    return result.percentages[b] - result.percentages[a];
  });

  sortedCategories.forEach(function (category, index) {
    const li = document.createElement("li");
    li.className = "score-item score-cascade";
    li.style.setProperty("--cascade-i", String(index));
    if (highlightedCategories.indexOf(category) !== -1) {
      li.classList.add("is-top");
    }
    li.innerHTML =
      '<span class="score-label">' + specialisationInfo[category].label + "</span>" +
      '<span class="score-percent">' + result.percentages[category] + "%</span>";
    scoreList.appendChild(li);
  });

  lastDrawnPercentages = result.percentages;
  drawResultsChart(result.percentages, true);
}

/* --- CANVAS BAR CHART RENDERER --- */
function drawResultsChart(percentages, shouldAnimate) {
  const canvas = document.getElementById("results-canvas");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = shouldAnimate !== false && !reduceMotion;

  /* --- Canvas sizing (CSS pixels vs backing-store pixels) --- */
  const displayWidth = canvas.clientWidth;
  const cssHeight = 360;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(displayWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);
  canvas.style.height = cssHeight + "px";

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); /* draw using CSS pixel coordinates */

  const categories = Object.keys(percentages);

  /* Read live theme colours so dark mode chart stays readable. */
  const rootStyles = getComputedStyle(document.documentElement);
  const textColor = rootStyles.getPropertyValue("--color-text").trim();
  const mutedColor = rootStyles.getPropertyValue("--color-text-muted").trim();

  /* --- Geometry of the plot area --- */
  const padLeft = 48;
  const padRight = 16;
  const padTop = 28;
  const padBottom = 56;
  const chartWidth = displayWidth - padLeft - padRight;
  const chartHeight = cssHeight - padTop - padBottom;
  const barGap = Math.max(18, chartWidth * 0.06);
  const barWidth = (chartWidth - barGap * (categories.length - 1)) / categories.length;
  const maxValue = 100;
  const yTicks = [0, 20, 40, 60, 80, 100];

  const animationDurationMs = 850;
  const startTime = performance.now();

  /* Easing: fast start, slow finish (smoother than linear). */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function drawFrame(now) {
    const elapsed = now - startTime;
    const rawProgress = animate ? Math.min(elapsed / animationDurationMs, 1) : 1;
    const progress = easeOutCubic(rawProgress);

    ctx.clearRect(0, 0, displayWidth, cssHeight);

    /* --- Horizontal grid + left-side % labels --- */
    yTicks.forEach(function (tick) {
      const y = padTop + chartHeight - (tick / maxValue) * chartHeight;

      ctx.strokeStyle = mutedColor;
      ctx.globalAlpha = 0.35;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + chartWidth, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      ctx.fillStyle = mutedColor;
      ctx.font = "12px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(tick + "%", padLeft - 10, y);
    });

    /* --- Solid X and Y axes --- */
    ctx.strokeStyle = textColor;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, padTop + chartHeight);
    ctx.lineTo(padLeft + chartWidth, padTop + chartHeight);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;

    /* --- One rounded bar per specialisation --- */
    categories.forEach(function (category, index) {
      const value = percentages[category];
      const animatedValue = value * progress;
      const barHeight = (animatedValue / maxValue) * chartHeight;

      const x = padLeft + index * (barWidth + barGap);
      const y = padTop + chartHeight - barHeight;

      const colorVarName = categoryColors[category];
      ctx.fillStyle = rootStyles.getPropertyValue(colorVarName).trim();

      /* Rounded top corners via quadratic curves. */
      const radius = Math.min(6, barWidth / 4, barHeight);
      ctx.beginPath();
      ctx.moveTo(x, y + barHeight);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, y + barHeight);
      ctx.closePath();
      ctx.fill();

      /* % value above the bar */
      ctx.fillStyle = textColor;
      ctx.font = "600 14px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(Math.round(animatedValue) + "%", x + barWidth / 2, y - 6);

      /* Category label under the bar (may wrap). */
      const shortLabel = specialisationInfo[category].label
        .replace("Development", "")
        .replace("Programming", "")
        .trim();
      ctx.fillStyle = mutedColor;
      ctx.font = "13px 'Segoe UI', Arial, sans-serif";
      ctx.textBaseline = "top";
      wrapText(ctx, shortLabel, x + barWidth / 2, padTop + chartHeight + 10, barWidth + 12, 15);
    });

    if (rawProgress < 1) {
      requestAnimationFrame(drawFrame);
    }
  }

  requestAnimationFrame(drawFrame);
}

/* --- CANVAS TEXT WRAP HELPER --- */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;

  words.forEach(function (word, index) {
    const testLine = line + word + " ";
    if (ctx.measureText(testLine).width > maxWidth && index > 0) {
      ctx.fillText(line.trim(), x, lineY);
      line = word + " ";
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line.trim(), x, lineY);
}
