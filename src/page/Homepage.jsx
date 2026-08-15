import React, { useState, useEffect } from "react";
import { X, ArrowRight, Check, Clock, Users, Wifi } from "lucide-react";

const COURSES = [
  {
    id: "ai",
    icon: "🤖",
    title: "AI & Smart Technology",
    tagline: "Discover AI, explore smart technologies, and learn how to use AI creatively and responsibly.",
    ages: "10–18",
    status: "soon",
    accent: "var(--periwinkle)",
    preview: [
      "What AI actually is — and isn't",
      "Training a simple model by hand",
      "Using AI tools responsibly and critically",
      "Build-your-own mini AI project",
    ],
  },
  {
    id: "python",
    icon: "🐍",
    title: "Programming & Python",
    tagline: "Learn programming fundamentals, problem-solving, and Python by building fun and practical projects.",
    ages: "8–18",
    status: "open",
    accent: "var(--teal)",
    format: { length: "1 month", cadence: "2 sessions / week", mode: "Live, online" },
    levels: [
      {
        name: "Level 1 — Foundations",
        sessions: "Sessions 1–2",
        points: ["How programs think: logic & sequence", "Variables and data types", "Getting input, printing output"],
      },
      {
        name: "Level 2 — Control Flow",
        sessions: "Sessions 3–4",
        points: ["If / else decisions", "For and while loops", "Debugging: reading error messages"],
      },
      {
        name: "Level 3 — Data Structures",
        sessions: "Sessions 5–6",
        points: ["Lists and indexing", "Dictionaries", "Combining data to model real things"],
      },
      {
        name: "Level 4 — Build a Project",
        sessions: "Sessions 7–8",
        points: ["Writing functions", "Planning a mini project", "Ship it: a quiz game or calculator"],
      },
    ],
  },
  {
    id: "canva",
    icon: "🎨",
    title: "Canva & Creative Design",
    tagline: "Learn design principles and use Canva to create posters, presentations, social media content, branding, and more.",
    ages: "8–16",
    status: "soon",
    accent: "var(--coral)",
    preview: [
      "Color, layout and type basics",
      "Designing posters & presentations",
      "Social media content kits",
      "Building a simple brand identity",
    ],
  },
  {
    id: "english",
    icon: "🇬🇧",
    title: "English Communication & Conversation",
    tagline: "Build confidence in speaking English through conversations, storytelling, vocabulary, presentations, and interactive activities.",
    ages: "6–14",
    status: "soon",
    accent: "var(--amber)",
    preview: [
      "Everyday conversation practice",
      "Storytelling & vocabulary games",
      "Presenting in front of a group",
      "Interactive speaking activities",
    ],
  },
  {
    id: "scratch",
    icon: "🎮",
    title: "Scratch & Game Development",
    tagline: "Learn programming concepts through Scratch by creating animations, interactive stories, games, and fun projects.",
    ages: "6–12",
    status: "soon",
    accent: "var(--teal)",
    preview: [
      "Sprites, events & movement",
      "Animations and interactive stories",
      "Building your first game",
      "Sharing and playtesting projects",
    ],
  },
];

const AGE_TIERS = [
  { label: "Explorers", range: "6–9", desc: "First steps, playful and visual" },
  { label: "Builders", range: "10–13", desc: "Real tools, guided projects" },
  { label: "Creators", range: "14–18", desc: "Independent, project-driven" },
];

function useTypewriter(lines, speed = 32, pause = 900) {
  const [display, setDisplay] = useState([]);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let li = 0;
    let ci = 0;
    let current = [];

    function tick() {
      if (cancelled) return;
      if (li >= lines.length) return;
      const line = lines[li];
      if (ci <= line.length) {
        const shown = [...current, line.slice(0, ci)];
        setDisplay(shown);
        ci++;
        setTimeout(tick, speed);
      } else {
        current = [...current, line];
        li++;
        ci = 0;
        setTimeout(tick, pause);
      }
    }
    tick();

    const blink = setInterval(() => setCursorOn((c) => !c), 500);
    return () => {
      cancelled = true;
      clearInterval(blink);
    };
  }, []);

  return { display, cursorOn };
}

function Terminal() {
  const lines = [
    "> academy.enroll(student)",
    "Welcome! Ages 6–18 build real things here.",
    "> courses.load('python')",
    "Loading: Programming & Python — ready ✓",
  ];
  const { display, cursorOn } = useTypewriter(lines);

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="dot" style={{ background: "#EF6F5C" }} />
        <span className="dot" style={{ background: "#F2A93B" }} />
        <span className="dot" style={{ background: "#3FB68B" }} />
        <span className="terminal-title">sparklab.py</span>
      </div>
      <div className="terminal-body">
        {display.map((l, i) => (
          <div key={i} className="terminal-line">
            {i % 2 === 0 ? <span className="prompt">{l}</span> : <span className="out">{l}</span>}
          </div>
        ))}
        <span className={"cursor" + (cursorOn ? " on" : "")}>▍</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return status === "open" ? (
    <span className="badge badge-open">
      <Check size={12} strokeWidth={3} /> Open for enrollment
    </span>
  ) : (
    <span className="badge badge-soon">Coming soon</span>
  );
}

function CourseCard({ course, onExplore }) {
  return (
    <div className="course-card" style={{ "--accent": course.accent }}>
      <div className="course-card-top">
        <span className="course-icon" aria-hidden="true">{course.icon}</span>
        <StatusBadge status={course.status} />
      </div>
      <h3 className="course-title">{course.title}</h3>
      <p className="course-tagline">{course.tagline}</p>
      <div className="course-meta">
        <span className="age-chip">Ages {course.ages}</span>
      </div>
      <button className="explore-btn" onClick={() => onExplore(course)}>
        Explore this course <ArrowRight size={16} />
      </button>
    </div>
  );
}

function CourseDetail({ course, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="drawer"
        style={{ "--accent": course.accent }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={course.title}
      >
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="drawer-head">
          <span className="course-icon big" aria-hidden="true">{course.icon}</span>
          <div>
            <h2>{course.title}</h2>
            <div className="course-meta">
              <span className="age-chip">Ages {course.ages}</span>
              <StatusBadge status={course.status} />
            </div>
          </div>
        </div>

        <p className="drawer-tagline">{course.tagline}</p>

        {course.status === "open" ? (
          <>
            <div className="format-row">
              <div className="format-item">
                <Clock size={16} />
                <span>{course.format.length}</span>
              </div>
              <div className="format-item">
                <Users size={16} />
                <span>{course.format.cadence}</span>
              </div>
              <div className="format-item">
                <Wifi size={16} />
                <span>{course.format.mode}</span>
              </div>
            </div>

            <h4 className="section-label">Course levels</h4>
            <div className="levels">
              {course.levels.map((lvl, i) => (
                <div className="level-row" key={i}>
                  <div className="level-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="level-body">
                    <div className="level-name-row">
                      <span className="level-name">{lvl.name}</span>
                      <span className="level-sessions">{lvl.sessions}</span>
                    </div>
                    <ul className="level-points">
                      {lvl.points.map((p, j) => (
                        <li key={j}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <button className="cta-btn full">Enroll in this course</button>
          </>
        ) : (
          <>
            <h4 className="section-label">What's planned</h4>
            <ul className="preview-list">
              {course.preview.map((p, i) => (
                <li key={i}>
                  <span className="preview-dot" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="soon-note">
              This course is still in the works — curriculum details above are a sneak peek and may change before launch.
            </p>
            <button className="cta-btn full outline">Notify me when it opens</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(null);

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
          line-height: 1.5;
        }
        .app :focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
        }
        h1, h2, h3, h4 {
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
          color: var(--ink);
        }
        p { margin: 0; }
        button { font-family: inherit; cursor: pointer; }

        .wrap {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* NAV */
        .nav {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(243,246,244,0.88);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--line);
        }
        .nav-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 18px;
        }
        .logo-mark {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: var(--teal);
          color: white;
          display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 500;
        }
        .nav-links {
          display: flex;
          gap: 28px;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-soft);
        }
        .nav-links a { text-decoration: none; color: inherit; }
        .nav-links a:hover { color: var(--ink); }
        .nav-cta {
          background: var(--ink);
          color: var(--paper);
          border: none;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
        }
        @media (max-width: 720px) { .nav-links { display: none; } }

        /* HERO */
        .hero {
          padding: 72px 0 56px;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 56px;
          align-items: center;
        }
        @media (max-width: 860px) { .hero { grid-template-columns: 1fr; padding-top: 48px; } }

        .eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--teal-deep);
          background: rgba(14,110,102,0.09);
          display: inline-block;
          padding: 5px 10px;
          border-radius: 6px;
          margin-bottom: 18px;
        }
        .hero h1 {
          font-size: clamp(34px, 4.6vw, 52px);
          line-height: 1.08;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .hero h1 .hl { color: var(--teal); }
        .hero-sub {
          margin-top: 20px;
          font-size: 17px;
          color: var(--ink-soft);
          max-width: 46ch;
        }
        .hero-ctas {
          margin-top: 30px;
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .cta-btn {
          background: var(--teal);
          color: white;
          border: none;
          padding: 13px 22px;
          border-radius: 9px;
          font-weight: 600;
          font-size: 15px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(14,110,102,0.25); }
        .cta-btn.outline {
          background: transparent;
          color: var(--ink);
          border: 1.5px solid var(--line);
        }
        .cta-btn.outline:hover { border-color: var(--ink); box-shadow: none; }
        .cta-btn.full { width: 100%; justify-content: center; margin-top: 26px; }
        .cta-secondary {
          background: transparent;
          border: none;
          color: var(--ink-soft);
          font-weight: 600;
          font-size: 15px;
          padding: 13px 6px;
        }
        .cta-secondary:hover { color: var(--ink); }

        /* TERMINAL */
        .terminal {
          background: var(--teal-deep);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(10,79,73,0.28);
          min-height: 220px;
        }
        .terminal-bar {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 14px;
          background: rgba(0,0,0,0.15);
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .terminal-title {
          margin-left: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: rgba(255,255,255,0.55);
        }
        .terminal-body {
          padding: 22px 20px 26px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          min-height: 150px;
        }
        .terminal-line { margin-bottom: 8px; }
        .prompt { color: #7FE0C6; }
        .out { color: rgba(255,255,255,0.82); padding-left: 2px; }
        .cursor { color: #7FE0C6; opacity: 0; }
        .cursor.on { opacity: 1; }

        /* AGE STRIP */
        .age-strip {
          padding: 8px 0 60px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 720px) { .age-strip { grid-template-columns: 1fr; } }
        .age-tier {
          background: var(--paper-raised);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 18px 20px;
        }
        .age-tier .range {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: var(--teal);
          font-weight: 500;
        }
        .age-tier .label {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 17px;
          margin-top: 4px;
        }
        .age-tier .desc {
          font-size: 13.5px;
          color: var(--ink-soft);
          margin-top: 4px;
        }

        /* COURSES */
        .section-head {
          padding-top: 20px;
          margin-bottom: 34px;
        }
        .section-head h2 {
          font-size: clamp(26px, 3.2vw, 34px);
        }
        .section-head p {
          margin-top: 10px;
          color: var(--ink-soft);
          font-size: 15.5px;
          max-width: 56ch;
        }

        .course-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding-bottom: 70px;
        }
        @media (max-width: 920px) { .course-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 620px) { .course-grid { grid-template-columns: 1fr; } }

        .course-card {
          background: var(--paper-raised);
          border: 1px solid var(--line);
          border-top: 3px solid var(--accent);
          border-radius: 14px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .course-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 32px rgba(20,48,46,0.08);
        }
        .course-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .course-icon { font-size: 30px; }
        .course-icon.big { font-size: 40px; }

        .badge {
          font-size: 11.5px;
          font-weight: 600;
          padding: 4px 9px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }
        .badge-open { background: rgba(14,110,102,0.12); color: var(--teal-deep); }
        .badge-soon { background: rgba(20,48,46,0.07); color: var(--ink-soft); }

        .course-title {
          font-size: 18.5px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .course-tagline {
          font-size: 14px;
          color: var(--ink-soft);
          flex-grow: 1;
          margin-bottom: 16px;
        }
        .course-meta { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
        .age-chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11.5px;
          background: rgba(20,48,46,0.06);
          color: var(--ink-soft);
          padding: 4px 9px;
          border-radius: 6px;
        }

        .explore-btn {
          background: transparent;
          border: 1.5px solid var(--line);
          color: var(--ink);
          padding: 10px 14px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .explore-btn:hover { border-color: var(--accent); background: rgba(20,48,46,0.03); }

        /* WHY STRIP */
        .why-strip {
          border-top: 1px solid var(--line);
          padding: 46px 0 70px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 720px) { .why-strip { grid-template-columns: 1fr; } }
        .why-item .num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--teal);
        }
        .why-item h4 { font-size: 16px; margin-top: 8px; }
        .why-item p { margin-top: 6px; font-size: 14px; color: var(--ink-soft); }

        /* FOOTER */
        .footer {
          border-top: 1px solid var(--line);
          padding: 30px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13.5px;
          color: var(--ink-soft);
          flex-wrap: wrap;
          gap: 12px;
        }

        /* OVERLAY / DRAWER */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(10,20,19,0.45);
          display: flex;
          justify-content: flex-end;
          z-index: 50;
          animation: fadeIn 0.18s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .drawer {
          background: var(--paper);
          width: min(480px, 100%);
          height: 100%;
          overflow-y: auto;
          padding: 28px 26px 40px;
          position: relative;
          border-left: 3px solid var(--accent);
          animation: slideIn 0.22s ease;
        }
        @keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @media (max-width: 560px) { .drawer { width: 100%; } }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--paper-raised);
          border: 1px solid var(--line);
          border-radius: 8px;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
        }
        .close-btn:hover { border-color: var(--ink); }

        .drawer-head {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          margin-top: 6px;
          margin-bottom: 16px;
        }
        .drawer-head h2 { font-size: 22px; margin-bottom: 8px; }
        .drawer-tagline {
          font-size: 15px;
          color: var(--ink-soft);
          margin-bottom: 22px;
        }

        .format-row {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          padding: 14px 16px;
          background: var(--paper-raised);
          border: 1px solid var(--line);
          border-radius: 10px;
          margin-bottom: 26px;
        }
        .format-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--teal-deep);
        }

        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-soft);
          margin-bottom: 14px;
        }

        .levels { display: flex; flex-direction: column; gap: 4px; }
        .level-row {
          display: flex;
          gap: 14px;
          padding: 14px 0;
          border-top: 1px solid var(--line);
        }
        .level-row:first-child { border-top: none; }
        .level-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: var(--accent);
          font-weight: 600;
          padding-top: 2px;
        }
        .level-name-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 6px;
        }
        .level-name { font-weight: 700; font-size: 14.5px; }
        .level-sessions {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11.5px;
          color: var(--ink-soft);
          white-space: nowrap;
        }
        .level-points {
          margin: 0;
          padding-left: 18px;
          font-size: 13.5px;
          color: var(--ink-soft);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .preview-list {
          list-style: none;
          margin: 0 0 20px;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .preview-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14.5px;
          color: var(--ink);
        }
        .preview-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }
        .soon-note {
          font-size: 13px;
          color: var(--ink-soft);
          font-style: italic;
        }
      `}</style>

      <nav className="nav">
        <div className="nav-inner">
          <div className="logo">
            <span className="logo-mark">&lt;/&gt;</span>
            SparkLab Academy
          </div>
          <div className="nav-links">
            <a href="#courses">Courses</a>
            <a href="#why">Why us</a>
            <a href="#contact">Contact</a>
          </div>
          <button className="nav-cta">Enroll now</button>
        </div>
      </nav>

      <header className="wrap hero">
        <div>
          <span className="eyebrow">For ages 6 – 18</span>
          <h1>
            Where kids go from <span className="hl">curious</span> to <span className="hl">capable</span>.
          </h1>
          <p className="hero-sub">
            SparkLab Academy teaches programming, AI, design, English and game
            development to students aged 6 to 18 — through live online
            sessions, real projects, and small groups.
          </p>
          <div className="hero-ctas">
            <button className="cta-btn">
              Browse courses <ArrowRight size={16} />
            </button>
            <button className="cta-secondary">Talk to us</button>
          </div>
        </div>
        <Terminal />
      </header>

      <section className="wrap age-strip">
        {AGE_TIERS.map((t) => (
          <div className="age-tier" key={t.label}>
            <div className="range">Ages {t.range}</div>
            <div className="label">{t.label}</div>
            <div className="desc">{t.desc}</div>
          </div>
        ))}
      </section>

      <section className="wrap" id="courses">
        <div className="section-head">
          <h2>Courses for every age and interest</h2>
          <p>
            Five tracks spanning code, creativity and communication. Pick a
            course to see its levels and what your child will actually build.
          </p>
        </div>
        <div className="course-grid">
          {COURSES.map((c) => (
            <CourseCard key={c.id} course={c} onExplore={setActive} />
          ))}
        </div>
      </section>

      <section className="wrap why-strip" id="why">
        <div className="why-item">
          <div className="num">01</div>
          <h4>Live, online, small groups</h4>
          <p>Real instructors, real-time feedback — not pre-recorded videos.</p>
        </div>
        <div className="why-item">
          <div className="num">02</div>
          <h4>Built for the age group</h4>
          <p>Pace and projects tuned for Explorers, Builders and Creators alike.</p>
        </div>
        <div className="why-item">
          <div className="num">03</div>
          <h4>Something to show for it</h4>
          <p>Every course ends with a real project, not just a certificate.</p>
        </div>
      </section>

      <footer className="wrap footer" id="contact">
        <span>© {new Date().getFullYear()} SparkLab Academy</span>
        <span>Live online classes · Ages 6–18</span>
      </footer>

      {active && <CourseDetail course={active} onClose={() => setActive(null)} />}
    </div>
  );
}
