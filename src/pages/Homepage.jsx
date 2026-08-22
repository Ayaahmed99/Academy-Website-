import React, { useState, useEffect } from "react";
import { X, ArrowRight, Clock, Users, Wifi, Check, Home as HomeIcon } from "lucide-react";

// The other pages were already built as their own self-contained
// components (each ships its own <nav>, styles, and design tokens) — we
// just import and route to them here instead of re-writing their logic.
import ApplyPage from "./Application_Form";
import InstructorsPage from "./Instructors";
import LevelTestPage from "./Level_Test";
import SessionsPage from "./Sessions";
import BookingPage from "./Booking";

/* ============================================================================
   BRAND LOGO
   ============================================================================ */

// Inline data URI so the logo works with zero extra asset setup.
// Swap this for an import (e.g. `import logo from "./assets/bright-path-logo.png"`)
// once the real image file lives in your project's asset folder.
const LOGO_SRC =
  "data:image/webp;base64,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";

/* ============================================================================
   HOME PAGE DATA
   ============================================================================ */

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

/* ============================================================================
   GLOBAL STYLES (home page + shared shell only — the other pages carry
   their own copy of these tokens inside their own files)
   ============================================================================ */

function GlobalStyles() {
  return (
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
      .app { background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; min-height: 100vh; line-height: 1.5; }
      .app :focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
      h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; margin: 0; color: var(--ink); }
      p { margin: 0; }
      button, a.btn { font-family: inherit; cursor: pointer; }
      a { color: inherit; }

      .wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px; }

      /* ---------- NAV (shared shell for the home page) ---------- */
      .nav {
        position: sticky; top: 0; z-index: 30;
        background: rgba(243,246,244,0.88); backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--line);
      }
      .nav-inner {
        max-width: 1120px; margin: 0 auto; padding: 16px 24px;
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
      }
      .logo {
        display: flex; align-items: center; gap: 10px;
        font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px;
        background: none; border: none; padding: 0; color: var(--ink);
      }
      .logo-img {
        height: 34px; width: auto; display: block;
      }
      .nav-links { display: flex; gap: 6px; font-size: 14px; font-weight: 600; color: var(--ink-soft); }
      .nav-links button {
        background: none; border: none; padding: 8px 12px; border-radius: 7px; color: inherit;
        transition: background 0.15s ease, color 0.15s ease;
      }
      .nav-links button:hover { color: var(--ink); background: rgba(20,48,46,0.05); }
      .nav-links button.active { color: var(--teal-deep); background: rgba(14,110,102,0.1); }
      .nav-cta {
        background: var(--ink); color: var(--paper); border: none; padding: 9px 18px;
        border-radius: 8px; font-size: 14px; font-weight: 600; white-space: nowrap;
      }
      .nav-cta:hover { background: var(--teal-deep); }
      @media (max-width: 760px) { .nav-links { display: none; } }

      /* ---------- shared buttons ---------- */
      .eyebrow {
        font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;
        color: var(--teal-deep); background: rgba(14,110,102,0.09); display: inline-block; padding: 5px 10px;
        border-radius: 6px; margin-bottom: 18px;
      }
      .cta-btn {
        background: var(--teal); color: white; border: none; padding: 13px 22px; border-radius: 9px;
        font-weight: 600; font-size: 15px; display: inline-flex; align-items: center; gap: 8px;
        transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease; text-decoration: none;
      }
      .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(14,110,102,0.25); background: var(--teal-deep); }
      .cta-btn.outline { background: transparent; color: var(--ink); border: 1.5px solid var(--line); }
      .cta-btn.outline:hover { border-color: var(--ink); box-shadow: none; background: rgba(20,48,46,0.03); transform: none; }
      .cta-btn.full { width: 100%; justify-content: center; margin-top: 26px; }
      .cta-secondary { background: transparent; border: none; color: var(--ink-soft); font-weight: 600; font-size: 15px; padding: 13px 6px; }
      .cta-secondary:hover { color: var(--ink); }

      /* ---------- footer ---------- */
      .footer {
        border-top: 1px solid var(--line); padding: 30px 0; display: flex; justify-content: space-between;
        align-items: center; font-size: 13.5px; color: var(--ink-soft); flex-wrap: wrap; gap: 14px;
      }
      .footer-links { display: flex; gap: 18px; }
      .footer-links button { background: none; border: none; color: var(--ink-soft); font-weight: 600; font-size: 13.5px; padding: 0; }
      .footer-links button:hover { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }

      /* ---------- HOME: hero / terminal ---------- */
      .hero { padding: 72px 0 56px; display: grid; grid-template-columns: 1.1fr 1fr; gap: 56px; align-items: center; }
      @media (max-width: 860px) { .hero { grid-template-columns: 1fr; padding-top: 48px; } }
      .hero h1 { font-size: clamp(34px, 4.6vw, 52px); line-height: 1.08; font-weight: 700; letter-spacing: -0.01em; }
      .hero h1 .hl { color: var(--teal); }
      .hero-sub { margin-top: 20px; font-size: 17px; color: var(--ink-soft); max-width: 46ch; }
      .hero-ctas { margin-top: 30px; display: flex; gap: 14px; flex-wrap: wrap; }

      .terminal { background: var(--teal-deep); border-radius: 14px; overflow: hidden; box-shadow: 0 20px 50px rgba(10,79,73,0.28); min-height: 220px; }
      .terminal-bar { display: flex; align-items: center; gap: 7px; padding: 11px 14px; background: rgba(0,0,0,0.15); }
      .dot { width: 10px; height: 10px; border-radius: 50%; }
      .terminal-title { margin-left: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgba(255,255,255,0.55); }
      .terminal-body { padding: 22px 20px 26px; font-family: 'JetBrains Mono', monospace; font-size: 14px; min-height: 150px; }
      .terminal-line { margin-bottom: 8px; }
      .prompt { color: #7FE0C6; }
      .out { color: rgba(255,255,255,0.82); padding-left: 2px; }
      .cursor { color: #7FE0C6; opacity: 0; }
      .cursor.on { opacity: 1; }

      .age-strip { padding: 8px 0 60px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
      @media (max-width: 720px) { .age-strip { grid-template-columns: 1fr; } }
      .age-tier { background: var(--paper-raised); border: 1px solid var(--line); border-radius: 12px; padding: 18px 20px; }
      .age-tier .range { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--teal); font-weight: 500; }
      .age-tier .label { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; margin-top: 4px; }
      .age-tier .desc { font-size: 13.5px; color: var(--ink-soft); margin-top: 4px; }

      .section-head { padding-top: 20px; margin-bottom: 34px; }
      .section-head h2 { font-size: clamp(26px, 3.2vw, 34px); }
      .section-head p { margin-top: 10px; color: var(--ink-soft); font-size: 15.5px; max-width: 56ch; }

      .course-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding-bottom: 70px; }
      @media (max-width: 920px) { .course-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 620px) { .course-grid { grid-template-columns: 1fr; } }

      .course-card {
        background: var(--paper-raised); border: 1px solid var(--line); border-top: 3px solid var(--accent);
        border-radius: 14px; padding: 22px; display: flex; flex-direction: column;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .course-card:hover { transform: translateY(-3px); box-shadow: 0 16px 32px rgba(20,48,46,0.08); }
      .course-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
      .course-icon { font-size: 30px; }
      .course-icon.big { font-size: 40px; }

      .badge { font-size: 11.5px; font-weight: 600; padding: 4px 9px; border-radius: 100px; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
      .badge-open { background: rgba(14,110,102,0.12); color: var(--teal-deep); }
      .badge-soon { background: rgba(20,48,46,0.07); color: var(--ink-soft); }

      .course-title { font-size: 18.5px; font-weight: 700; margin-bottom: 8px; }
      .course-tagline { font-size: 14px; color: var(--ink-soft); flex-grow: 1; margin-bottom: 16px; }
      .course-meta { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
      .age-chip { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; background: rgba(20,48,46,0.06); color: var(--ink-soft); padding: 4px 9px; border-radius: 6px; }

      .explore-btn {
        background: transparent; border: 1.5px solid var(--line); color: var(--ink); padding: 10px 14px; border-radius: 8px;
        font-weight: 600; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px;
        transition: border-color 0.15s ease, background 0.15s ease;
      }
      .explore-btn:hover { border-color: var(--accent); background: rgba(20,48,46,0.03); }

      .why-strip { border-top: 1px solid var(--line); padding: 46px 0 70px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
      @media (max-width: 720px) { .why-strip { grid-template-columns: 1fr; } }
      .why-item .num { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--teal); }
      .why-item h4 { font-size: 16px; margin-top: 8px; }
      .why-item p { margin-top: 6px; font-size: 14px; color: var(--ink-soft); }

      /* Promo band linking to Instructors / Apply / Level-test / Booking pages */
      .promo-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding-bottom: 70px; }
      @media (max-width: 1040px) { .promo-strip { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 620px) { .promo-strip { grid-template-columns: 1fr; } }
      .promo-card {
        background: var(--paper-raised); border: 1px solid var(--line); border-radius: 14px; padding: 26px;
        display: flex; flex-direction: column; gap: 12px; border-top: 3px solid var(--accent);
      }
      .promo-card h3 { font-size: 19px; }
      .promo-card p { font-size: 14px; color: var(--ink-soft); flex-grow: 1; }

      /* ---------- OVERLAY / DRAWER (course detail) ---------- */
      .overlay { position: fixed; inset: 0; background: rgba(10,20,19,0.45); display: flex; justify-content: flex-end; z-index: 50; animation: fadeIn 0.18s ease; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .drawer {
        background: var(--paper); width: min(480px, 100%); height: 100%; overflow-y: auto; padding: 28px 26px 40px;
        position: relative; border-left: 3px solid var(--accent); animation: slideIn 0.22s ease;
      }
      @keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @media (max-width: 560px) { .drawer { width: 100%; } }
      .close-btn {
        position: absolute; top: 20px; right: 20px; background: var(--paper-raised); border: 1px solid var(--line);
        border-radius: 8px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; color: var(--ink);
      }
      .close-btn:hover { border-color: var(--ink); }
      .drawer-head { display: flex; gap: 14px; align-items: flex-start; margin-top: 6px; margin-bottom: 16px; }
      .drawer-head h2 { font-size: 22px; margin-bottom: 8px; }
      .drawer-tagline { font-size: 15px; color: var(--ink-soft); margin-bottom: 22px; }
      .format-row { display: flex; gap: 18px; flex-wrap: wrap; padding: 14px 16px; background: var(--paper-raised); border: 1px solid var(--line); border-radius: 10px; margin-bottom: 26px; }
      .format-item { display: flex; align-items: center; gap: 7px; font-size: 13.5px; font-weight: 600; color: var(--teal-deep); }
      .section-label { font-family: 'JetBrains Mono', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-soft); margin-bottom: 14px; }
      .levels { display: flex; flex-direction: column; gap: 4px; }
      .level-row { display: flex; gap: 14px; padding: 14px 0; border-top: 1px solid var(--line); }
      .level-row:first-child { border-top: none; }
      .level-num { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--accent); font-weight: 600; padding-top: 2px; }
      .level-name-row { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 6px; }
      .level-name { font-weight: 700; font-size: 14.5px; }
      .level-sessions { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--ink-soft); white-space: nowrap; }
      .level-points { margin: 0; padding-left: 18px; font-size: 13.5px; color: var(--ink-soft); display: flex; flex-direction: column; gap: 4px; }
      .preview-list { list-style: none; margin: 0 0 20px; padding: 0; display: flex; flex-direction: column; gap: 11px; }
      .preview-list li { display: flex; align-items: center; gap: 10px; font-size: 14.5px; color: var(--ink); }
      .preview-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
      .soon-note { font-size: 13px; color: var(--ink-soft); font-style: italic; }

      /* ---------- floating "back to home" pill shown on other pages ---------- */
      .back-home-bar {
        position: sticky; top: 0; z-index: 40;
        background: rgba(243,246,244,0.92); backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--line); padding: 10px 24px;
      }
      .back-home-pill {
        display: inline-flex; align-items: center; gap: 7px; background: var(--paper-raised);
        border: 1px solid var(--line); border-radius: 100px; padding: 7px 14px 7px 10px;
        font-size: 13.5px; font-weight: 600; color: var(--ink);
      }
      .back-home-pill:hover { border-color: var(--teal); color: var(--teal-deep); }
    `}</style>
  );
}

/* ============================================================================
   SHARED NAV (home page only — the other pages carry their own)
   ============================================================================ */

const PAGES = [
  { id: "home", label: "Home" },
  { id: "instructors", label: "Instructors" },
  { id: "level-test", label: "Find your level" },
  { id: "sessions", label: "Sessions" },
  { id: "booking", label: "Book a course" },
  { id: "apply", label: "Apply to teach" },
];

function SiteNav({ page, onNavigate }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="logo" onClick={() => onNavigate("home")}>
          <img src={LOGO_SRC} alt="Bright Path" className="logo-img" />
        </button>
        <div className="nav-links">
          {PAGES.map((p) => (
            <button
              key={p.id}
              className={page === p.id ? "active" : ""}
              onClick={() => onNavigate(p.id)}
              aria-current={page === p.id ? "page" : undefined}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button className="nav-cta" onClick={() => onNavigate("booking")}>
          Book a course
        </button>
      </div>
    </nav>
  );
}

function SiteFooter({ onNavigate }) {
  return (
    <footer className="wrap footer">
      <span>© {new Date().getFullYear()} Bright Path</span>
      <div className="footer-links">
        <button onClick={() => onNavigate("home")}>Home</button>
        <button onClick={() => onNavigate("instructors")}>Instructors</button>
        <button onClick={() => onNavigate("level-test")}>Find your level</button>
        <button onClick={() => onNavigate("sessions")}>Sessions</button>
        <button onClick={() => onNavigate("booking")}>Book a course</button>
        <button onClick={() => onNavigate("apply")}>Apply to teach</button>
      </div>
    </footer>
  );
}

/* ============================================================================
   HOME PAGE
   ============================================================================ */

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

function CourseDetail({ course, onClose, onNavigate }) {
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
              <div className="format-item"><Clock size={16} /><span>{course.format.length}</span></div>
              <div className="format-item"><Users size={16} /><span>{course.format.cadence}</span></div>
              <div className="format-item"><Wifi size={16} /><span>{course.format.mode}</span></div>
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
                      {lvl.points.map((p, j) => <li key={j}>{p}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <button className="cta-btn full" onClick={() => onNavigate("booking")}>
              Enroll in this course
            </button>
          </>
        ) : (
          <>
            <h4 className="section-label">What's planned</h4>
            <ul className="preview-list">
              {course.preview.map((p, i) => (
                <li key={i}><span className="preview-dot" />{p}</li>
              ))}
            </ul>
            <p className="soon-note">
              This course is still in the works — curriculum details above are a sneak peek and may change before launch.
            </p>
            <button className="cta-btn full outline" onClick={() => onNavigate("booking")}>
              Join the waitlist
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function HomePage({ onNavigate }) {
  const [active, setActive] = useState(null);

  return (
    <>
      <header className="wrap hero">
        <div>
          <span className="eyebrow">For ages 6 – 18</span>
          <h1>
            Where kids go from <span className="hl">curious</span> to <span className="hl">capable</span>.
          </h1>
          <p className="hero-sub">
            Bright Path teaches programming, AI, design, English and game
            development to students aged 6 to 18 — through live online
            sessions, real projects, and small groups.
          </p>
          <div className="hero-ctas">
            <button className="cta-btn" onClick={() => onNavigate("booking")}>
              Book a course <ArrowRight size={16} />
            </button>
            <button className="cta-secondary" onClick={() => onNavigate("level-test")}>Find your level</button>
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

      <section className="wrap">
        <div className="section-head">
          <h2>A few more things to check out</h2>
        </div>
        <div className="promo-strip">
          <div className="promo-card" style={{ "--accent": "var(--teal)" }}>
            <h3>Ready to enroll?</h3>
            <p>Book a spot for your child in a couple of minutes — no payment needed, we'll contact you to confirm.</p>
            <button className="cta-btn outline" onClick={() => onNavigate("booking")}>
              Book a course <ArrowRight size={16} />
            </button>
          </div>
          <div className="promo-card" style={{ "--accent": "var(--amber)" }}>
            <h3>Not sure where to start?</h3>
            <p>Take a 2-minute level check for any course and we'll tell you exactly where to begin.</p>
            <button className="cta-btn outline" onClick={() => onNavigate("level-test")}>
              Find your level <ArrowRight size={16} />
            </button>
          </div>
          <div className="promo-card" style={{ "--accent": "var(--periwinkle)" }}>
            <h3>Meet the instructors</h3>
            <p>See who's teaching each course, their ratings, and how parents describe working with them.</p>
            <button className="cta-btn outline" onClick={() => onNavigate("instructors")}>
              View instructors <ArrowRight size={16} />
            </button>
          </div>
          <div className="promo-card" style={{ "--accent": "var(--coral)" }}>
            <h3>Want to teach here?</h3>
            <p>We're hiring instructors across every track. Tell us about yourself and what you'd like to teach.</p>
            <button className="cta-btn outline" onClick={() => onNavigate("apply")}>
              Apply to teach <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {active && <CourseDetail course={active} onClose={() => setActive(null)} onNavigate={onNavigate} />}
    </>
  );
}

/* ============================================================================
   ROOT APP — owns the current page and passes navigation down.
   Instructors, Level test, Sessions, Apply, and Booking are rendered from
   the separately-built files; only Home lives here.
   ============================================================================ */

export default function App() {
  const [page, setPage] = useState("home");

  function navigate(next) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app">
      <GlobalStyles />

      {page === "home" ? (
        <>
          <SiteNav page={page} onNavigate={navigate} />
          <HomePage onNavigate={navigate} />
          <SiteFooter onNavigate={navigate} />
        </>
      ) : (
        // The other pages are self-contained (own nav + styles already built
        // in their own files) — just add a slim way back to Home above them.
        <>
          <div className="back-home-bar">
            <button className="back-home-pill" onClick={() => navigate("home")}>
              <HomeIcon size={14} /> Back to home
            </button>
          </div>
          {page === "instructors" && <InstructorsPage />}
          {page === "level-test" && <LevelTestPage />}
          {page === "sessions" && <SessionsPage />}
          {page === "booking" && <BookingPage />}
          {page === "apply" && <ApplyPage />}
        </>
      )}
    </div>
  );
}
