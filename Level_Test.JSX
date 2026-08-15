import React, { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";

const COURSES = [
  { id: "ai", icon: "🤖", title: "AI & Smart Technology", accent: "var(--periwinkle)" },
  { id: "python", icon: "🐍", title: "Programming & Python", accent: "var(--teal)" },
  { id: "canva", icon: "🎨", title: "Canva & Creative Design", accent: "var(--coral)" },
  { id: "english", icon: "🇬🇧", title: "English Communication", accent: "var(--amber)" },
  { id: "scratch", icon: "🎮", title: "Scratch & Game Dev", accent: "var(--teal)" },
];

// Python maps to the real 4-level curriculum, scored out of 15.
const PYTHON_QUIZ = {
  max: 15,
  questions: [
    {
      q: "Have you written any code before?",
      options: [
        { t: "Never", v: 0 },
        { t: "A little, in block tools like Scratch", v: 1 },
        { t: "Yes, simple Python scripts", v: 2 },
        { t: "Yes, I'm comfortable with loops & functions", v: 3 },
      ],
    },
    {
      q: "What does a variable do?",
      options: [
        { t: "Not sure", v: 0 },
        { t: "I have a vague idea", v: 1 },
        { t: "It stores a value you can reuse", v: 2 },
        { t: "I could explain it with an example", v: 3 },
      ],
    },
    {
      q: "Can you read simple if / else logic?",
      options: [
        { t: "No", v: 0 },
        { t: "A little", v: 1 },
        { t: "Yes, I can follow it", v: 2 },
        { t: "Yes, and I can write it myself", v: 3 },
      ],
    },
    {
      q: "Have you used loops (for / while)?",
      options: [
        { t: "Never heard of them", v: 0 },
        { t: "Heard of them", v: 1 },
        { t: "Used them a bit", v: 2 },
        { t: "Use them comfortably", v: 3 },
      ],
    },
    {
      q: "Have you built even a tiny project — a game, calculator, script?",
      options: [
        { t: "No", v: 0 },
        { t: "Followed a tutorial", v: 1 },
        { t: "Built something small on my own", v: 2 },
        { t: "Built and debugged my own project", v: 3 },
      ],
    },
  ],
  levels: [
    {
      max: 3,
      name: "Level 1 — Foundations",
      blurb: "You're starting fresh, and that's exactly where this level begins.",
      points: ["How programs think: logic & sequence", "Variables and data types", "Getting input, printing output"],
    },
    {
      max: 7,
      name: "Level 2 — Control Flow",
      blurb: "You've got the basics. You'll move quickly into decisions and loops.",
      points: ["If / else decisions", "For and while loops", "Debugging: reading error messages"],
    },
    {
      max: 11,
      name: "Level 3 — Data Structures",
      blurb: "Solid fundamentals. You're ready to organize real data.",
      points: ["Lists and indexing", "Dictionaries", "Combining data to model real things"],
    },
    {
      max: 15,
      name: "Level 4 — Build a Project",
      blurb: "You already think like a programmer. Time to ship something.",
      points: ["Writing functions", "Planning a mini project", "Ship it: a quiz game or calculator"],
    },
  ],
};

// Other courses aren't live yet, so this is a lighter readiness/curiosity check
// scored out of 8, mapped to the three age tiers rather than curriculum levels.
const READINESS_BANDS = [
  { max: 3, name: "Explorer", blurb: "Perfect place to start — playful, visual, hands-on lessons." },
  { max: 6, name: "Builder", blurb: "You've got a head start. Expect to move quickly into guided projects." },
  { max: 8, name: "Creator", blurb: "You're ready to dive in — expect independent, project-driven work." },
];

const READINESS_QUIZZES = {
  ai: [
    {
      q: "Do you know what AI is used for?",
      options: [{ t: "Not really", v: 0 }, { t: "Heard of it, like chatbots", v: 1 }, { t: "Used AI tools before", v: 2 }],
    },
    {
      q: "Are you comfortable trying new apps or tools on your own?",
      options: [{ t: "I need help", v: 0 }, { t: "Sometimes", v: 1 }, { t: "Yes, I explore on my own", v: 2 }],
    },
    {
      q: "Are you curious about how computers make decisions?",
      options: [{ t: "Not sure", v: 0 }, { t: "A little curious", v: 1 }, { t: "Very curious, I ask a lot of questions", v: 2 }],
    },
    {
      q: "Have you used a creative AI tool — image or chat — before?",
      options: [{ t: "No", v: 0 }, { t: "Once or twice", v: 1 }, { t: "Yes, a few times", v: 2 }],
    },
  ],
  canva: [
    {
      q: "Have you ever made a poster, slide, or social post?",
      options: [{ t: "No", v: 0 }, { t: "For school, once", v: 1 }, { t: "Yes, a few times", v: 2 }],
    },
    {
      q: "Are you comfortable picking colors and fonts that go together?",
      options: [{ t: "Not really", v: 0 }, { t: "A bit", v: 1 }, { t: "Yes", v: 2 }],
    },
    {
      q: "Have you used Canva or a similar design app?",
      options: [{ t: "Never", v: 0 }, { t: "Tried it once", v: 1 }, { t: "Use it sometimes", v: 2 }],
    },
    {
      q: "Do you enjoy drawing or arranging things visually?",
      options: [{ t: "Not much", v: 0 }, { t: "Sometimes", v: 1 }, { t: "Yes, I love it", v: 2 }],
    },
  ],
  english: [
    {
      q: "How comfortable are you speaking English in a group?",
      options: [{ t: "Shy about it", v: 0 }, { t: "Okay with some practice", v: 1 }, { t: "Comfortable", v: 2 }],
    },
    {
      q: "Do you read English books or shows without much help?",
      options: [{ t: "No", v: 0 }, { t: "Sometimes", v: 1 }, { t: "Yes", v: 2 }],
    },
    {
      q: "Can you tell a short story out loud in English?",
      options: [{ t: "Hard for me", v: 0 }, { t: "With some effort", v: 1 }, { t: "Yes", v: 2 }],
    },
    {
      q: "Have you given a presentation in English before?",
      options: [{ t: "No", v: 0 }, { t: "Once", v: 1 }, { t: "Yes, more than once", v: 2 }],
    },
  ],
  scratch: [
    {
      q: "Have you used Scratch or a similar block-coding tool?",
      options: [{ t: "Never", v: 0 }, { t: "Once or twice", v: 1 }, { t: "Yes, made something", v: 2 }],
    },
    {
      q: "Do you enjoy figuring out how games work?",
      options: [{ t: "Not really", v: 0 }, { t: "A bit", v: 1 }, { t: "Yes, a lot", v: 2 }],
    },
    {
      q: "Are you comfortable with drag-and-drop and trial and error?",
      options: [{ t: "Not really", v: 0 }, { t: "Sometimes", v: 1 }, { t: "Yes", v: 2 }],
    },
    {
      q: "Have you ever finished making something — a story, animation, or game?",
      options: [{ t: "No", v: 0 }, { t: "Started but didn't finish", v: 1 }, { t: "Yes, finished one", v: 2 }],
    },
  ],
};

function getQuiz(courseId) {
  if (courseId === "python") return { questions: PYTHON_QUIZ.questions, max: PYTHON_QUIZ.max };
  return { questions: READINESS_QUIZZES[courseId], max: READINESS_QUIZZES[courseId].length * 2 };
}

function getResult(courseId, score) {
  if (courseId === "python") {
    return PYTHON_QUIZ.levels.find((l) => score <= l.max) || PYTHON_QUIZ.levels[PYTHON_QUIZ.levels.length - 1];
  }
  return READINESS_BANDS.find((b) => score <= b.max) || READINESS_BANDS[READINESS_BANDS.length - 1];
}

function ScoreDial({ percent, accent }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width="132" height="132" viewBox="0 0 132 132" className="dial">
      <circle cx="66" cy="66" r={r} fill="none" stroke="var(--line)" strokeWidth="10" />
      <circle
        cx="66"
        cy="66"
        r={r}
        fill="none"
        stroke={accent}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 66 66)"
        className="dial-fill"
      />
      <text x="66" y="72" textAnchor="middle" className="dial-text">
        {percent}%
      </text>
    </svg>
  );
}

function QuizPanel({ course, onDone, onExit }) {
  const quiz = useMemo(() => getQuiz(course.id), [course.id]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const question = quiz.questions[step];
  const progress = Math.round((step / quiz.questions.length) * 100);

  function choose(value) {
    const next = [...answers, value];
    if (step + 1 < quiz.questions.length) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      const total = next.reduce((a, b) => a + b, 0);
      onDone(total, quiz.max);
    }
  }

  return (
    <div className="quiz-card" style={{ "--accent": course.accent }}>
      <div className="quiz-top">
        <button className="text-btn" onClick={onExit}>
          <ArrowLeft size={15} /> Change course
        </button>
        <span className="quiz-count">
          Question {step + 1} of {quiz.questions.length}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <h3 className="question">{question.q}</h3>
      <div className="options">
        {question.options.map((opt, i) => (
          <button className="option-btn" key={i} onClick={() => choose(opt.v)}>
            {opt.t}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultPanel({ course, score, max, onRetake, onExit }) {
  const result = getResult(course.id, score);
  const percent = Math.round((score / max) * 100);
  const isPython = course.id === "python";

  return (
    <div className="quiz-card result-card" style={{ "--accent": course.accent }}>
      <div className="quiz-top">
        <button className="text-btn" onClick={onExit}>
          <ArrowLeft size={15} /> Change course
        </button>
      </div>

      <div className="result-head">
        <ScoreDial percent={percent} accent={course.accent} />
        <div>
          <span className="result-eyebrow">
            <Sparkles size={13} /> Your level
          </span>
          <h2 className="result-name">{result.name}</h2>
        </div>
      </div>

      <p className="result-blurb">{result.blurb}</p>

      {isPython && (
        <>
          <h4 className="section-label">You'll start with</h4>
          <ul className="preview-list">
            {result.points.map((p, i) => (
              <li key={i}>
                <span className="preview-dot" />
                {p}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="result-actions">
        <button className="cta-btn">Explore {course.title}</button>
        <button className="cta-btn outline" onClick={onRetake}>
          <RotateCcw size={15} /> Retake test
        </button>
      </div>
    </div>
  );
}

export default function LevelTestPage() {
  const [activeCourse, setActiveCourse] = useState(null);
  const [result, setResult] = useState(null); // { score, max }

  function selectCourse(course) {
    setActiveCourse(course);
    setResult(null);
  }

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --paper: #F3F6F4;
          --paper-raised: #FFFFFF;
          --ink: #14302E;
          --ink-soft: #4B615F;
          --teal: #0E6E66;
          --teal-deep: #0A4F49;
          --amber: #F2A93B;
          --coral: #EF6F5C;
          --periwinkle: #6C7BD1;
          --line: rgba(20,48,46,0.12);
        }
        * { box-sizing: border-box; }
        .app {
          background: var(--paper);
          color: var(--ink);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
        }
        .app :focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
        h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; margin: 0; color: var(--ink); }
        p { margin: 0; }
        button { font-family: inherit; cursor: pointer; }

        .wrap { max-width: 780px; margin: 0 auto; padding: 0 24px; }

        .nav {
          border-bottom: 1px solid var(--line);
          padding: 18px 0;
        }
        .nav-inner {
          max-width: 780px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; gap: 10px;
        }
        .logo { display: flex; align-items: center; gap: 10px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; }
        .logo-mark {
          width: 28px; height: 28px; border-radius: 8px; background: var(--teal); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
        }

        .intro { padding: 56px 0 34px; text-align: center; }
        .eyebrow {
          font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--teal-deep); background: rgba(14,110,102,0.09);
          display: inline-block; padding: 5px 10px; border-radius: 6px; margin-bottom: 16px;
        }
        .intro h1 { font-size: clamp(28px, 4vw, 38px); line-height: 1.15; }
        .intro p { margin-top: 14px; color: var(--ink-soft); font-size: 15.5px; max-width: 50ch; margin-left: auto; margin-right: auto; }

        .course-picker {
          display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
          padding-bottom: 44px;
        }
        .course-chip {
          display: flex; align-items: center; gap: 8px;
          background: var(--paper-raised); border: 1.5px solid var(--line);
          padding: 10px 16px; border-radius: 100px; font-size: 14px; font-weight: 600;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .course-chip:hover { transform: translateY(-1px); }
        .course-chip.active { border-color: var(--chip-accent); background: color-mix(in srgb, var(--chip-accent) 8%, white); }
        .chip-icon { font-size: 17px; }

        .empty-state {
          text-align: center; padding: 60px 20px 80px;
          color: var(--ink-soft); font-size: 14.5px;
        }

        .quiz-card {
          background: var(--paper-raised);
          border: 1px solid var(--line);
          border-top: 3px solid var(--accent);
          border-radius: 16px;
          padding: 30px 30px 34px;
          margin-bottom: 80px;
        }
        .quiz-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px;
        }
        .text-btn {
          background: none; border: none; color: var(--ink-soft);
          font-size: 13.5px; font-weight: 600; display: flex; align-items: center; gap: 6px;
          padding: 4px 0;
        }
        .text-btn:hover { color: var(--ink); }
        .quiz-count {
          font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--ink-soft);
        }

        .progress-track {
          height: 6px; background: var(--line); border-radius: 100px; overflow: hidden; margin-bottom: 28px;
        }
        .progress-fill {
          height: 100%; background: var(--accent); border-radius: 100px;
          transition: width 0.3s ease;
        }

        .question { font-size: 21px; line-height: 1.35; margin-bottom: 22px; }

        .options { display: flex; flex-direction: column; gap: 10px; }
        .option-btn {
          text-align: left;
          background: var(--paper);
          border: 1.5px solid var(--line);
          padding: 14px 16px;
          border-radius: 10px;
          font-size: 14.5px;
          font-weight: 500;
          color: var(--ink);
          transition: border-color 0.15s ease, background 0.15s ease, transform 0.1s ease;
        }
        .option-btn:hover { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 6%, white); transform: translateX(2px); }

        .result-head {
          display: flex; align-items: center; gap: 22px; margin-bottom: 18px; flex-wrap: wrap;
        }
        .dial { flex-shrink: 0; }
        .dial-fill { transition: stroke-dashoffset 0.6s ease; }
        .dial-text {
          font-family: 'JetBrains Mono', monospace; font-size: 18px; fill: var(--ink);
          font-weight: 500;
        }
        .result-eyebrow {
          display: flex; align-items: center; gap: 6px;
          font-family: 'JetBrains Mono', monospace; font-size: 12px; text-transform: uppercase;
          letter-spacing: 0.05em; color: var(--ink-soft); margin-bottom: 6px;
        }
        .result-name { font-size: 24px; }
        .result-blurb { color: var(--ink-soft); font-size: 15px; margin-bottom: 24px; }

        .section-label {
          font-family: 'JetBrains Mono', monospace; font-size: 12px; text-transform: uppercase;
          letter-spacing: 0.05em; color: var(--ink-soft); margin-bottom: 12px;
        }
        .preview-list { list-style: none; margin: 0 0 24px; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .preview-list li { display: flex; align-items: center; gap: 10px; font-size: 14.5px; }
        .preview-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }

        .result-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .cta-btn {
          background: var(--teal); color: white; border: none; padding: 12px 20px;
          border-radius: 9px; font-weight: 600; font-size: 14.5px;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .cta-btn.outline { background: transparent; color: var(--ink); border: 1.5px solid var(--line); }
        .cta-btn.outline:hover { border-color: var(--ink); }
      `}</style>

      <nav className="nav">
        <div className="nav-inner">
          <div className="logo">
            <span className="logo-mark">&lt;/&gt;</span>
            SparkLab Academy
          </div>
        </div>
      </nav>

      <section className="wrap intro">
        <span className="eyebrow">2-minute check</span>
        <h1>Find your level before you start</h1>
        <p>
          Pick a course below and answer a few quick questions. We'll tell you
          exactly where to begin — no guesswork.
        </p>
      </section>

      <div className="wrap course-picker">
        {COURSES.map((c) => (
          <button
            key={c.id}
            className={"course-chip" + (activeCourse?.id === c.id ? " active" : "")}
            style={{ "--chip-accent": c.accent }}
            onClick={() => selectCourse(c)}
          >
            <span className="chip-icon">{c.icon}</span>
            {c.title}
          </button>
        ))}
      </div>

      <div className="wrap">
        {!activeCourse && (
          <div className="empty-state">Pick a course above to start its level check.</div>
        )}

        {activeCourse && !result && (
          <QuizPanel
            course={activeCourse}
            onExit={() => setActiveCourse(null)}
            onDone={(score, max) => setResult({ score, max })}
          />
        )}

        {activeCourse && result && (
          <ResultPanel
            course={activeCourse}
            score={result.score}
            max={result.max}
            onRetake={() => setResult(null)}
            onExit={() => {
              setActiveCourse(null);
              setResult(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
