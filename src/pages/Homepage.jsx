import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X, ArrowRight, ArrowLeft, Check, Clock, Users, Wifi,
  Send, Copy, RotateCcw, Mail, Loader2, AlertTriangle, Phone, Star,
} from "lucide-react";

/* ============================================================================
   SHARED DATA
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

const INSTRUCTORS = [
  {
    id: "mona",
    name: "Mona Youssef",
    gender: "female",
    subject: "Programming & Python",
    accent: "var(--teal)",
    email: "mona@sparklabacademy.com",
    phone: "+20 100 000 0001",
    rating: 4.9,
    reviews: [
      { name: "Laila's parent", rating: 5, text: "My daughter looked forward to every session. She built her first quiz game in the third week." },
      { name: "Omar's parent", rating: 5, text: "Explains things at exactly the right pace for a 10-year-old. Very patient." },
      { name: "Yusuf's parent", rating: 4, text: "Great teacher — would love slightly more challenging homework for advanced kids." },
    ],
  },
  {
    id: "karim",
    name: "Karim Adel",
    gender: "male",
    subject: "AI & Smart Technology",
    accent: "var(--periwinkle)",
    email: "karim@sparklabacademy.com",
    phone: "+20 100 000 0002",
    rating: 4.8,
    reviews: [
      { name: "Nour's parent", rating: 5, text: "Makes AI concepts easy to grasp without dumbing them down. My teenager is genuinely curious now." },
      { name: "Hassan's parent", rating: 5, text: "Great at connecting AI examples to things kids actually use, like games and apps." },
    ],
  },
  {
    id: "salma",
    name: "Salma Ibrahim",
    gender: "female",
    subject: "Canva & Creative Design",
    accent: "var(--coral)",
    email: "salma@sparklabacademy.com",
    phone: "+20 100 000 0003",
    rating: 4.7,
    reviews: [
      { name: "Farida's parent", rating: 5, text: "My daughter designed a poster for her school project and got so much praise for it." },
      { name: "Adam's parent", rating: 4, text: "Good structure, clear examples. Sessions sometimes ran a little long." },
      { name: "Malak's parent", rating: 5, text: "Very encouraging with younger kids who are shy about their work." },
    ],
  },
  {
    id: "heba",
    name: "Heba Fathy",
    gender: "female",
    subject: "English Communication & Conversation",
    accent: "var(--amber)",
    email: "heba@sparklabacademy.com",
    phone: "+20 100 000 0004",
    rating: 4.9,
    reviews: [
      { name: "Zeina's parent", rating: 5, text: "Zeina used to freeze up speaking English in front of others. Now she volunteers to present first." },
      { name: "Tarek's parent", rating: 5, text: "Warm, funny, and genuinely invested in each kid's confidence, not just vocabulary." },
    ],
  },
  {
    id: "ziad",
    name: "Ziad Mansour",
    gender: "male",
    subject: "Scratch & Game Development",
    accent: "var(--teal)",
    email: "ziad@sparklabacademy.com",
    phone: "+20 100 000 0005",
    rating: 4.8,
    reviews: [
      { name: "Sara's parent", rating: 5, text: "My 8-year-old finished a full animated story and was so proud to show us." },
      { name: "Ali's parent", rating: 4, text: "Good energy, keeps kids engaged. Would like a bit more 1-on-1 time in group sessions." },
      { name: "Jana's parent", rating: 5, text: "Turns 'coding' into something that feels like play. Exactly what we wanted." },
    ],
  },
];

/* ============================================================================
   GLOBAL STYLES (shared design tokens across every page)
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
      .wrap.narrow { max-width: 720px; }
      .wrap.mid { max-width: 1080px; }

      /* ---------- NAV (shared shell) ---------- */
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
      .logo-mark {
        width: 30px; height: 30px; border-radius: 8px; background: var(--teal); color: white;
        display: flex; align-items: center; justify-content: center;
        font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 500; flex-shrink: 0;
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
      .cta-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; box-shadow: none; }
      .cta-btn.outline { background: transparent; color: var(--ink); border: 1.5px solid var(--line); }
      .cta-btn.outline:hover { border-color: var(--ink); box-shadow: none; background: rgba(20,48,46,0.03); transform: none; }
      .cta-btn.full { width: 100%; justify-content: center; margin-top: 26px; }
      .cta-secondary { background: transparent; border: none; color: var(--ink-soft); font-weight: 600; font-size: 15px; padding: 13px 6px; }
      .cta-secondary:hover { color: var(--ink); }
      .spin { animation: spin 0.8s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }

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

      /* Promo band linking to Instructors / Apply pages */
      .promo-strip { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding-bottom: 70px; }
      @media (max-width: 720px) { .promo-strip { grid-template-columns: 1fr; } }
      .promo-card {
        background: var(--paper-raised); border: 1px solid var(--line); border-radius: 14px; padding: 26px;
        display: flex; flex-direction: column; gap: 12px; border-top: 3px solid var(--accent);
      }
      .promo-card h3 { font-size: 19px; }
      .promo-card p { font-size: 14px; color: var(--ink-soft); flex-grow: 1; }

      /* ---------- OVERLAY / DRAWER (course detail + reviews) ---------- */
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

      /* ---------- BACK LINK (Apply / Instructors pages) ---------- */
      .back-link {
        display: inline-flex; align-items: center; gap: 6px; background: none; border: none;
        font-size: 13.5px; font-weight: 600; color: var(--ink-soft); padding: 0;
      }
      .back-link:hover { color: var(--teal-deep); }

      /* ---------- APPLY PAGE ---------- */
      .intro { padding: 52px 0 8px; text-align: center; }
      .intro h1 { font-size: clamp(26px, 4vw, 36px); line-height: 1.15; }
      .intro p { margin-top: 14px; color: var(--ink-soft); font-size: 15px; max-width: 54ch; margin-left: auto; margin-right: auto; }

      .form-card { background: var(--paper-raised); border: 1px solid var(--line); border-top: 3px solid var(--teal); border-radius: 16px; padding: 32px; margin: 36px 0 90px; }
      .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 16px; }
      @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
      .field.full { grid-column: 1 / -1; }
      .field { display: flex; flex-direction: column; gap: 6px; }
      .field-label { font-size: 13.5px; font-weight: 600; }
      .req { color: var(--coral); }
      .field-error { font-size: 12px; color: var(--coral); }

      input[type="text"], input[type="email"], input[type="tel"], input[type="url"], select, textarea {
        font-family: 'Inter', sans-serif; font-size: 14.5px; padding: 11px 13px; border: 1.5px solid var(--line);
        border-radius: 9px; background: var(--paper); color: var(--ink); width: 100%;
      }
      input:focus, select:focus, textarea:focus { border-color: var(--teal); outline: none; }
      input.err, select.err, textarea.err { border-color: var(--coral); }
      textarea { resize: vertical; min-height: 100px; font-family: inherit; }

      input[type="file"] { font-size: 13px; padding: 9px 10px; border: 1.5px dashed var(--line); border-radius: 9px; background: var(--paper); color: var(--ink-soft); width: 100%; }
      input[type="file"].err { border-color: var(--coral); }
      input[type="file"]::file-selector-button {
        font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 600; color: #fff; background: var(--teal);
        border: none; border-radius: 6px; padding: 7px 11px; margin-right: 10px; cursor: pointer;
      }
      .field-hint { font-size: 12px; color: var(--ink-soft); }

      .checkbox-row { display: flex; align-items: flex-start; gap: 10px; margin-top: 6px; }
      .checkbox-row input { width: 16px; height: 16px; margin-top: 2px; accent-color: var(--teal); }
      .checkbox-row label { font-size: 13.5px; color: var(--ink-soft); line-height: 1.4; }

      .divider { height: 1px; background: var(--line); margin: 26px 0; }

      .submit-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-top: 26px; }
      .direct-note { font-size: 12.5px; color: var(--ink-soft); margin-top: 14px; }
      .direct-note a { font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }

      .fallback-note {
        display: flex; gap: 8px; align-items: flex-start; font-size: 13px; color: var(--teal-deep);
        background: rgba(242,169,59,0.12); border: 1px solid rgba(242,169,59,0.35); border-radius: 9px;
        padding: 10px 12px; margin-top: 18px; text-align: left;
      }
      .fallback-note svg { flex-shrink: 0; margin-top: 1px; color: var(--amber); }

      .success-card { background: var(--paper-raised); border: 1px solid var(--line); border-top: 3px solid var(--teal); border-radius: 16px; padding: 36px 32px; margin: 36px 0 90px; text-align: center; }
      .success-icon { width: 52px; height: 52px; border-radius: 50%; background: rgba(14,110,102,0.1); color: var(--teal-deep); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; }
      .success-card h2 { font-size: 21px; margin-bottom: 10px; }
      .success-card p { color: var(--ink-soft); font-size: 14.5px; max-width: 44ch; margin: 0 auto; }
      .success-actions { display: flex; justify-content: center; gap: 12px; margin-top: 26px; flex-wrap: wrap; }

      /* ---------- INSTRUCTORS PAGE ---------- */
      .sample-note { text-align: center; font-size: 12.5px; color: var(--ink-soft); font-style: italic; margin: 18px auto 46px; max-width: 60ch; }
      .instructor-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding-bottom: 80px; }
      @media (max-width: 920px) { .instructor-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 620px) { .instructor-grid { grid-template-columns: 1fr; } }
      .instructor-card {
        background: var(--paper-raised); border: 1px solid var(--line); border-top: 3px solid var(--accent);
        border-radius: 14px; padding: 22px; transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .instructor-card:hover { transform: translateY(-3px); box-shadow: 0 16px 32px rgba(20,48,46,0.08); }
      .card-top { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
      .avatar { border-radius: 50%; flex-shrink: 0; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); background: #EEF2F0; }
      .avatar svg { display: block; }
      .i-name { font-size: 16.5px; font-weight: 700; }
      .i-subject { font-size: 13px; color: var(--ink-soft); margin-top: 2px; }
      .rating-row { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
      .stars { display: flex; gap: 2px; }
      .rating-num { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 500; }
      .rating-count { font-size: 12.5px; color: var(--ink-soft); }
      .review-link { font-size: 12.5px; font-weight: 600; color: var(--teal-deep); text-decoration: underline; text-underline-offset: 2px; background: none; border: none; padding: 0; }
      .contact-block { display: flex; flex-direction: column; gap: 8px; padding-top: 14px; border-top: 1px solid var(--line); }
      .contact-row { display: flex; align-items: center; gap: 9px; font-size: 13.5px; color: var(--ink-soft); text-decoration: none; }
      .contact-row:hover { color: var(--ink); }
      .reviews-list { display: flex; flex-direction: column; gap: 4px; }
      .review-item { padding: 16px 0; border-top: 1px solid var(--line); }
      .review-item:first-child { border-top: none; }
      .review-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
      .review-name { font-weight: 600; font-size: 13.5px; }
      .review-text { font-size: 14px; color: var(--ink-soft); line-height: 1.5; }
    `}</style>
  );
}

/* ============================================================================
   SHARED NAV — every page routes through this, so the buttons requested
   for navigation live in exactly one place.
   ============================================================================ */

const PAGES = [
  { id: "home", label: "Home" },
  { id: "instructors", label: "Instructors" },
  { id: "apply", label: "Apply to teach" },
];

function SiteNav({ page, onNavigate }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="logo" onClick={() => onNavigate("home")}>
          <span className="logo-mark">&lt;/&gt;</span>
          SparkLab Academy
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
        <button className="nav-cta" onClick={() => onNavigate("apply")}>
          Apply to teach
        </button>
      </div>
    </nav>
  );
}

function SiteFooter({ onNavigate }) {
  return (
    <footer className="wrap footer">
      <span>© {new Date().getFullYear()} SparkLab Academy</span>
      <div className="footer-links">
        <button onClick={() => onNavigate("home")}>Home</button>
        <button onClick={() => onNavigate("instructors")}>Instructors</button>
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

            <button className="cta-btn full">Enroll in this course</button>
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
            <button className="cta-btn full outline">Notify me when it opens</button>
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
            SparkLab Academy teaches programming, AI, design, English and game
            development to students aged 6 to 18 — through live online
            sessions, real projects, and small groups.
          </p>
          <div className="hero-ctas">
            <button className="cta-btn" onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}>
              Browse courses <ArrowRight size={16} />
            </button>
            <button className="cta-secondary" onClick={() => onNavigate("instructors")}>Meet the instructors</button>
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
          <h2>Two more things to check out</h2>
        </div>
        <div className="promo-strip">
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

      {active && <CourseDetail course={active} onClose={() => setActive(null)} />}
    </>
  );
}

/* ============================================================================
   INSTRUCTORS PAGE
   ============================================================================ */

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rand, arr) { return arr[Math.floor(rand() * arr.length)]; }

const SKIN_TONES = ["#F4C89B", "#E3AC7C", "#C68863", "#8D5A34", "#FFDCB2"];
const HAIR_COLORS = ["#2B1B12", "#4A2E1E", "#1C1C1C", "#6B3F23", "#5C4033"];
const SUIT_COLORS = ["#2B3A55", "#33424F", "#3B3B3B", "#41474D", "#2E3D3B"];
const HAIR_STYLES_BY_GENDER = { male: ["short"], female: ["long", "bun", "short"] };

function generatePerson(name, gender = "female") {
  const rand = mulberry32(hashString(name));
  const styles = HAIR_STYLES_BY_GENDER[gender] || HAIR_STYLES_BY_GENDER.female;
  return {
    skin: pick(rand, SKIN_TONES),
    hair: pick(rand, HAIR_COLORS),
    suit: pick(rand, SUIT_COLORS),
    style: pick(rand, styles),
    beard: gender === "male" && rand() > 0.45,
  };
}

function HairBack({ style, color }) {
  if (style === "long") {
    return (
      <>
        <ellipse cx="28" cy="19" rx="14" ry="15" fill={color} />
        <path d="M15,17 Q13,29 16,41 Q18,43 20,41 Q17,29 19,18 Z" fill={color} />
        <path d="M41,17 Q43,29 40,41 Q38,43 36,41 Q39,29 37,18 Z" fill={color} />
      </>
    );
  }
  if (style === "bun") {
    return (
      <>
        <ellipse cx="28" cy="18" rx="12.5" ry="11.5" fill={color} />
        <circle cx="28" cy="8.5" r="4" fill={color} />
      </>
    );
  }
  return <ellipse cx="28" cy="18.5" rx="12.5" ry="11.5" fill={color} />;
}

function HairFront({ style, color }) {
  if (style === "long") return <path d="M16,15 Q22,7 30,8.5 Q37,9.5 40,16 Q34,11 28,11.5 Q21,12 16,15 Z" fill={color} />;
  if (style === "bun") return <path d="M17,15 Q23,8.5 30,9 Q36,9.5 39,15.5 Q33,11.5 28,11.5 Q22,11.5 17,15 Z" fill={color} />;
  return <path d="M17,14.5 Q23,7.5 31,8.5 Q37,9.5 39,15 Q33,10.5 28,10.5 Q22,10.5 17,14.5 Z" fill={color} />;
}

function Avatar({ name, accent, gender, size = 56 }) {
  const p = useMemo(() => generatePerson(name, gender), [name, gender]);
  const gid = useMemo(() => `skin-${name.replace(/\s+/g, "-").toLowerCase()}`, [name]);

  return (
    <div className="avatar" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 56 56" width={size} height={size}>
        <defs>
          <radialGradient id={gid} cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="35%" stopColor={p.skin} stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.08" />
          </radialGradient>
        </defs>
        <circle cx="28" cy="28" r="28" fill="#EEF2F0" />
        <path d="M3,56 C3,41 14,35 28,35 C42,35 53,41 53,56 Z" fill={p.suit} />
        <path d="M22,37 L28,45 L25,35 Z" fill="#F7F7F5" />
        <path d="M34,37 L28,45 L31,35 Z" fill="#F7F7F5" />
        <path d="M26.5,38 L29.5,38 L31,49 L28,53 L25,49 Z" fill={accent} />
        {p.style === "long" && <HairBack style={p.style} color={p.hair} />}
        <rect x="24" y="28" width="8" height="10" rx="3" fill={p.skin} />
        {p.style !== "long" && <HairBack style={p.style} color={p.hair} />}
        {p.style === "long" && <ellipse cx="28" cy="19" rx="14" ry="15" fill={p.hair} />}
        <circle cx="28" cy="23.5" r="11.5" fill={p.skin} />
        <circle cx="28" cy="23.5" r="11.5" fill={`url(#${gid})`} />
        <HairFront style={p.style} color={p.hair} />
        <path d="M20,21.5 Q23,20 26,21.3" stroke={p.hair} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M30,21.3 Q33,20 36,21.5" stroke={p.hair} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <ellipse cx="23.5" cy="24.5" rx="1.5" ry="1.9" fill="#2A2118" />
        <ellipse cx="32.5" cy="24.5" rx="1.5" ry="1.9" fill="#2A2118" />
        <circle cx="24" cy="23.9" r="0.5" fill="#fff" />
        <circle cx="33" cy="23.9" r="0.5" fill="#fff" />
        {p.beard ? (
          <path d="M17,24 Q17,33 28,34 Q39,33 39,24 Q39,30 34,32 Q31,33 28,33 Q25,33 22,32 Q17,30 17,24 Z" fill={p.hair} opacity="0.92" />
        ) : (
          <path d="M24.5,29 Q28,31.5 31.5,29" stroke="#8A5A3E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
}

function Stars({ value, size = 14 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star key={i} size={size} fill={filled ? "var(--amber)" : "none"} stroke={filled ? "var(--amber)" : "var(--line)"} strokeWidth={1.5} />
        );
      })}
    </span>
  );
}

function InstructorCard({ instructor, onOpenReviews }) {
  return (
    <div className="instructor-card" style={{ "--accent": instructor.accent }}>
      <div className="card-top">
        <Avatar name={instructor.name} accent={instructor.accent} gender={instructor.gender} />
        <div>
          <h3 className="i-name">{instructor.name}</h3>
          <p className="i-subject">{instructor.subject}</p>
        </div>
      </div>

      <div className="rating-row">
        <Stars value={instructor.rating} />
        <span className="rating-num">{instructor.rating.toFixed(1)}</span>
        <button className="review-link" onClick={() => onOpenReviews(instructor)}>
          {instructor.reviews.length} reviews
        </button>
      </div>

      <div className="contact-block">
        <a className="contact-row" href={`mailto:${instructor.email}`}><Mail size={15} />{instructor.email}</a>
        <a className="contact-row" href={`tel:${instructor.phone.replace(/\s/g, "")}`}><Phone size={15} />{instructor.phone}</a>
      </div>
    </div>
  );
}

function ReviewsDrawer({ instructor, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="drawer"
        style={{ "--accent": instructor.accent }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Reviews for ${instructor.name}`}
      >
        <button className="close-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>

        <div className="drawer-head">
          <Avatar name={instructor.name} accent={instructor.accent} gender={instructor.gender} size={52} />
          <div>
            <h2>{instructor.name}</h2>
            <p className="i-subject">{instructor.subject}</p>
          </div>
        </div>

        <div className="rating-row" style={{ marginBottom: 26 }}>
          <Stars value={instructor.rating} size={16} />
          <span className="rating-num">{instructor.rating.toFixed(1)}</span>
          <span className="rating-count">({instructor.reviews.length} reviews)</span>
        </div>

        <h4 className="section-label">What parents say</h4>
        <div className="reviews-list">
          {instructor.reviews.map((r, i) => (
            <div className="review-item" key={i}>
              <div className="review-top">
                <span className="review-name">{r.name}</span>
                <Stars value={r.rating} size={13} />
              </div>
              <p className="review-text">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InstructorsPage({ onNavigate }) {
  const [active, setActive] = useState(null);

  return (
    <>
      <section className="wrap mid intro">
        <button className="back-link" onClick={() => onNavigate("home")}>
          <ArrowLeft size={14} /> Back to home
        </button>
        <div style={{ marginTop: 22 }}>
          <span className="eyebrow">Meet the team</span>
          <h1>Instructors who make it click</h1>
          <p>Every course is led by a real instructor — here's who's teaching, how they're rated, and how to reach them.</p>
        </div>
      </section>
      <p className="wrap mid sample-note">
        Sample profiles for demonstration — replace names, contact details and reviews with your real instructors' information before publishing.
      </p>

      <div className="wrap mid instructor-grid">
        {INSTRUCTORS.map((inst) => (
          <InstructorCard key={inst.id} instructor={inst} onOpenReviews={setActive} />
        ))}
      </div>

      <div className="wrap mid" style={{ paddingBottom: 70, textAlign: "center" }}>
        <button className="cta-btn" onClick={() => onNavigate("apply")}>
          Want to join them? Apply to teach <ArrowRight size={16} />
        </button>
      </div>

      {active && <ReviewsDrawer instructor={active} onClose={() => setActive(null)} />}
    </>
  );
}

/* ============================================================================
   APPLY PAGE
   ============================================================================ */

// Formspree endpoint — submissions post here first. If that request fails
// for any reason (offline, blocked, endpoint issue), the form automatically
// falls back to opening a pre-filled email instead, so the application is
// never lost either way.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqpzdkjz";
const APPLY_EMAIL = "ayaahmedd777@gmail.com";

const SUBJECTS = [
  { id: "ai", icon: "🤖", title: "AI & Smart Technology" },
  { id: "python", icon: "🐍", title: "Programming & Python" },
  { id: "canva", icon: "🎨", title: "Canva & Creative Design" },
  { id: "english", icon: "🇬🇧", title: "English Communication & Conversation" },
  { id: "scratch", icon: "🎮", title: "Scratch & Game Development" },
  { id: "other", icon: "✨", title: "Something else" },
];

const EXPERIENCE_OPTIONS = ["Less than 1 year", "1–3 years", "3–5 years", "5+ years"];
const AVAILABILITY_OPTIONS = ["Weekday mornings", "Weekday evenings", "Weekends", "Flexible"];

const EMPTY_FORM = {
  name: "", email: "", phone: "", subject: "", subjectOther: "",
  experience: "", availability: "", message: "", cv: null, portfolio: null, agree: false,
};

function buildApplicationText(form, subjectLabel) {
  return [
    "New Instructor Application — SparkLab Academy",
    "",
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    `Subject to teach: ${subjectLabel}`,
    `Experience: ${form.experience}`,
    `Availability: ${form.availability}`,
    "",
    "Why they want to join:",
    form.message,
    "",
    `CV file: ${form.cv ? form.cv.name : "Not attached"}`,
    `Portfolio file: ${form.portfolio ? form.portfolio.name : "Not attached"}`,
  ].join("\n");
}

function Field({ label, required, children, error }) {
  return (
    <label className="field">
      <span className="field-label">{label} {required && <span className="req">*</span>}</span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

function ApplyPage({ onNavigate }) {
  const formRef = useRef(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [showErrors, setShowErrors] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  function update(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  const isValid =
    form.name.trim() && form.email.trim() && form.phone.trim() && form.subject &&
    (form.subject !== "other" || form.subjectOther.trim()) &&
    form.experience && form.availability && form.message.trim() && form.cv && form.agree;

  const subjectLabel =
    form.subject === "other" ? form.subjectOther || "General" : SUBJECTS.find((s) => s.id === form.subject)?.title || "General";

  const applicationText = useMemo(() => buildApplicationText(form, subjectLabel), [form, subjectLabel]);

  const mailtoHref = useMemo(() => {
    const subjectLine = `Instructor Application — ${subjectLabel} — ${form.name || "Applicant"}`;
    return `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(applicationText)}`;
  }, [applicationText, subjectLabel, form.name]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) { setShowErrors(true); return; }

    setSubmitting(true);
    try {
      const fd = new FormData(formRef.current);
      const res = await fetch(FORMSPREE_ENDPOINT, { method: "POST", body: fd, headers: { Accept: "application/json" } });
      if (res.ok) { setUsedFallback(false); setSucceeded(true); }
      else throw new Error(`Formspree responded with ${res.status}`);
    } catch (err) {
      window.location.href = mailtoHref;
      setUsedFallback(true);
      setSucceeded(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function copyApplication() {
    try {
      await navigator.clipboard.writeText(applicationText);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = applicationText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function startOver() {
    setForm(EMPTY_FORM);
    setShowErrors(false);
    setSucceeded(false);
    setUsedFallback(false);
    setFormKey((k) => k + 1);
  }

  return (
    <>
      <section className="wrap narrow intro">
        <button className="back-link" onClick={() => onNavigate("home")}>
          <ArrowLeft size={14} /> Back to home
        </button>
        <div style={{ marginTop: 22 }}>
          <span className="eyebrow">Join the team</span>
          <h1>Apply to teach at SparkLab Academy</h1>
          <p>Tell us about yourself and what you'd like to teach. We'll get your application either way — no email app required, but it's there as a backup.</p>
        </div>
      </section>

      <div className="wrap narrow">
        {!succeeded ? (
          <form className="form-card" key={formKey} ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <Field label="Full name" required error={showErrors && !form.name.trim() ? "Please enter your name" : null}>
                <input type="text" name="name" className={showErrors && !form.name.trim() ? "err" : ""} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
              </Field>

              <Field label="Email" required error={showErrors && !form.email.trim() ? "Please enter your email" : null}>
                <input type="email" name="email" className={showErrors && !form.email.trim() ? "err" : ""} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
              </Field>

              <Field label="Phone" required error={showErrors && !form.phone.trim() ? "Please enter your phone number" : null}>
                <input type="tel" name="phone" className={showErrors && !form.phone.trim() ? "err" : ""} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+20 1xx xxx xxxx" />
              </Field>

              <Field label="Subject you'd like to teach" required error={showErrors && !form.subject ? "Please choose a subject" : null}>
                <select className={showErrors && !form.subject ? "err" : ""} value={form.subject} onChange={(e) => update("subject", e.target.value)}>
                  <option value="">Select a subject</option>
                  {SUBJECTS.map((s) => (<option key={s.id} value={s.id}>{s.icon} {s.title}</option>))}
                </select>
                <input type="hidden" name="subject" value={subjectLabel} />
              </Field>

              {form.subject === "other" && (
                <Field label="What subject?" required error={showErrors && !form.subjectOther.trim() ? "Please tell us what you'd like to teach" : null}>
                  <input type="text" name="subject_other" className={showErrors && !form.subjectOther.trim() ? "err" : ""} value={form.subjectOther} onChange={(e) => update("subjectOther", e.target.value)} placeholder="e.g. Robotics" />
                </Field>
              )}

              <Field label="Years of relevant experience" required error={showErrors && !form.experience ? "Please select your experience" : null}>
                <select name="experience" className={showErrors && !form.experience ? "err" : ""} value={form.experience} onChange={(e) => update("experience", e.target.value)}>
                  <option value="">Select a range</option>
                  {EXPERIENCE_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                </select>
              </Field>

              <Field label="Availability" required error={showErrors && !form.availability ? "Please select your availability" : null}>
                <select name="availability" className={showErrors && !form.availability ? "err" : ""} value={form.availability} onChange={(e) => update("availability", e.target.value)}>
                  <option value="">Select availability</option>
                  {AVAILABILITY_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                </select>
              </Field>

              <div className="field full">
                <Field label="Why do you want to join SparkLab Academy?" required error={showErrors && !form.message.trim() ? "Please tell us why you'd like to join" : null}>
                  <textarea name="message" className={showErrors && !form.message.trim() ? "err" : ""} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us about your teaching experience and why you'd be a good fit..." />
                </Field>
              </div>

              <Field label="CV / resume" required error={showErrors && !form.cv ? "Please attach your CV" : null}>
                <input type="file" name="cv" accept=".pdf,.doc,.docx" className={showErrors && !form.cv ? "err" : ""} onChange={(e) => update("cv", e.target.files?.[0] || null)} />
                <span className="field-hint">{form.cv ? form.cv.name : "PDF or Word"}</span>
              </Field>

              <Field label="Portfolio (optional)">
                <input type="file" name="portfolio" accept=".pdf,.doc,.docx,.zip,.ppt,.pptx" onChange={(e) => update("portfolio", e.target.files?.[0] || null)} />
                <span className="field-hint">{form.portfolio ? form.portfolio.name : "Samples of your work, e.g. slides, projects, videos"}</span>
              </Field>

              <input type="hidden" name="_subject" value={`Instructor Application — ${subjectLabel} — ${form.name || "Applicant"}`} />
            </div>

            <div className="divider" />

            <div className="checkbox-row">
              <input type="checkbox" id="agree" checked={form.agree} onChange={(e) => update("agree", e.target.checked)} />
              <label htmlFor="agree">
                I agree to be contacted by SparkLab Academy about this application.
                {showErrors && !form.agree && <span className="field-error"> — please confirm to continue</span>}
              </label>
            </div>

            <div className="submit-row">
              <button type="submit" className="cta-btn" disabled={submitting}>
                {submitting ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                {submitting ? "Sending…" : "Send application"}
              </button>
              <button type="button" className="cta-btn outline" onClick={copyApplication}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy instead"}
              </button>
            </div>

            <p className="direct-note">
              If sending doesn't go through, this automatically opens a pre-filled email to <a href={`mailto:${APPLY_EMAIL}`}>{APPLY_EMAIL}</a> instead — your application is never lost.
            </p>
          </form>
        ) : (
          <div className="success-card">
            <div className="success-icon"><Mail size={22} /></div>
            <h2>{usedFallback ? "Your email app should be opening now" : "Application received"}</h2>
            <p>
              {usedFallback
                ? `We couldn't reach our form service, so we've filled a new email to ${APPLY_EMAIL} with your details — just review it and hit send.`
                : `Thanks for applying — your details${form.cv ? " and CV" : ""}${form.portfolio ? " and portfolio" : ""} have been sent to our team. We'll be in touch.`}
            </p>
            {usedFallback && (
              <div className="fallback-note">
                <AlertTriangle size={16} />
                <span>Files can't travel through email links automatically — please attach your CV{form.portfolio ? " and portfolio" : ""} to the email yourself before sending.</span>
              </div>
            )}
            <div className="success-actions">
              <button type="button" className="cta-btn outline" onClick={copyApplication}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy application text"}
              </button>
              <button type="button" className="cta-btn outline" onClick={startOver}>
                <RotateCcw size={15} /> Start a new application
              </button>
              <button type="button" className="cta-btn outline" onClick={() => onNavigate("home")}>
                Back to home
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ============================================================================
   ROOT APP — owns the current page and passes navigation down
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
      <SiteNav page={page} onNavigate={navigate} />

      {page === "home" && <HomePage onNavigate={navigate} />}
      {page === "instructors" && <InstructorsPage onNavigate={navigate} />}
      {page === "apply" && <ApplyPage onNavigate={navigate} />}

      <SiteFooter onNavigate={navigate} />
    </div>
  );
}
