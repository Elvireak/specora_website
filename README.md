# Specora

**Specora** (from *specialisation* + *exploration*) is a short interactive quiz for first-year Software Engineering students. It helps them explore which BSE specialisation may match their interests.

> **Note:** Results are **guidance only**. They do not replace academic advice or a final specialisation decision.

---

## Specialisations covered

- Full-Stack Web Development  
- Machine Learning  
- AR/VR Development  
- Low-Level Programming

---

## Pages


| Page    | File           | Purpose                                           |
| ------- | -------------- | ------------------------------------------------- |
| Home    | `index.html`   | Hero, about Specora, student details form         |
| Quiz    | `quiz.html`    | Timed quiz with text, audio, and video questions  |
| Results | `results.html` | Match card, canvas chart, scores, next steps, FAQ |
| Contact | `contact.html` | Author info, feedback form, FAQ                   |


---



## How to run

This is a **static website** (HTML, CSS, JavaScript). No build step or server framework is required.

1. Open the project folder on your computer (wherever you cloned or downloaded Specora)
2. Open `index.html` in a modern browser
  **or** use a simple local server (recommended for media assets), for example:
  - VS Code / Cursor: “Live Server”

Start on **Home**, fill in the student form, then continue to the quiz.

---



## Main features

- Student form validation (name, 10-digit ID, `@alustudent.com` email)
- Two alternating question sets (A / B) so retakes feel fresh
- Dual timers: overall quiz time + per-question countdown
- Interactive **audio** and **video** questions
- Scoring with base points and a speed bonus
- Results page with animated **canvas** bar chart
- Light / dark theme toggle
- Contact form with category dropdown and Mauritian phone validation
- FAQ accordion on Results and Contact
- Responsive layout for desktop and mobile

---



## Project structure

```
Draft_of_BSE-Pathfinder/
├── index.html          # Home
├── quiz.html           # Quiz
├── results.html        # Results
├── contact.html        # Contact & feedback
├── css/
│   ├── base.css        # Shared styles, theme, nav, footer
│   ├── landing.css     # Home / hero
│   ├── quiz.css        # Quiz UI
│   ├── results.css     # Results UI
│   └── contact.css     # Contact UI
├── js/
│   ├── theme.js        # Light / dark mode
│   ├── nav.js          # Mobile menu + Quiz lock
│   ├── motion.js       # Scroll reveal, FAQ, back-to-top
│   ├── landing.js      # Home form + hero slideshow
│   ├── quiz.js         # Quiz engine (timers, media, scoring)
│   ├── results.js      # Results display + canvas chart
│   └── contact.js      # Contact form validation
└── assets1/
    ├── images/         # Logos, hero images, profile photo
    ├── audio/          # Quiz audio question
    └── video/          # Quiz video question
```

---



## Browser storage

The site uses `localStorage` (no backend):


| Key                | Used for                                                |
| ------------------ | ------------------------------------------------------- |
| `currentStudent`   | Name, student ID, and email from the Home form          |
| `lastQuizSet`      | Remembers set A or B for the next attempt               |
| `latestQuizResult` | Scores and percentages for the Results page             |
| `quizLocked`       | Blocks Quiz after finish until Retake / new form submit |
| `preferredTheme`   | Light or dark mode preference                           |


---



## Typical user flow

1. Open **Home** → enter student details → **Continue to quiz**
2. Complete the **Quiz** (answer before timers run out)
3. View **Results** (match, chart, next steps)
4. Optionally **Retake** (new questions) or send feedback on **Contact**

---



## Developed by

Elvire Akayezu . A year 1 BSE Student  

Educational project · © 2026 Specora
