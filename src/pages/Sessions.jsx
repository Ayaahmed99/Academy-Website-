import React from "react";
import { Video, PlayCircle, ExternalLink, Users2, Info } from "lucide-react";

// Replace these with your real links before publishing.
// - TEAMS_LINK: the recurring Microsoft Teams meeting link students join live.
// - Each session's `recordingUrl`: a Google Drive link to that session's recording.
//   Leave `recordingUrl` as null for a session that hasn't happened / been uploaded yet —
//   its button will show as disabled with "Not available yet".
const TEAMS_LINK = "https://teams.microsoft.com/l/meetup-join/YOUR_TEAMS_MEETING_LINK";

const SESSIONS = [
  {
    n: 1,
    level: "Level 1 — Foundations",
    title: "How programs think",
    blurb: "Logic, sequence, and your very first lines of Python.",
    recordingUrl: "https://drive.google.com/drive/folders/SESSION_1_RECORDING_ID",
  },
  {
    n: 2,
    level: "Level 1 — Foundations",
    title: "Variables & output",
    blurb: "Storing data in variables, data types, getting input and printing output.",
    recordingUrl: "https://drive.google.com/file/d/1v2ACkjzqxQP1M5JzBHgyUuORaO9VknMm/view?usp=drive_link",
  },
  {
    n: 3,
    level: "Level 2 — Control Flow",
    title: "Making decisions",
    blurb: "If / else logic — teaching a program to choose between outcomes.",
    recordingUrl: "https://drive.google.com/drive/folders/SESSION_3_RECORDING_ID",
  },
  {
    n: 4,
    level: "Level 2 — Control Flow",
    title: "Loops & debugging",
    blurb: "For and while loops, plus how to read an error message without panicking.",
    recordingUrl: "https://drive.google.com/drive/folders/SESSION_4_RECORDING_ID",
  },
  {
    n: 5,
    level: "Level 3 — Data Structures",
    title: "Lists & indexing",
    blurb: "Storing many values at once and reaching into them by position.",
    recordingUrl: "https://drive.google.com/drive/folders/SESSION_5_RECORDING_ID",
  },
  {
    n: 6,
    level: "Level 3 — Data Structures",
    title: "Dictionaries",
    blurb: "Combining data to model real things — names, keys, and values.",
    recordingUrl: null,
  },
  {
    n: 7,
    level: "Level 4 — Build a Project",
    title: "Writing functions",
    blurb: "Packaging logic into reusable functions and planning a mini project.",
    recordingUrl: null,
  },
  {
    n: 8,
    level: "Level 4 — Build a Project",
    title: "Ship it",
    blurb: "Finishing and presenting a quiz game or calculator built from scratch.",
    recordingUrl: null,
  },
];

function SessionRow({ session }) {
  const available = Boolean(session.recordingUrl);
  return (
    <div className="session-row">
      <div className="session-num">{String(session.n).padStart(2, "0")}</div>
      <div className="session-body">
        <span className="session-level">{session.level}</span>
        <h3 className="session-title">
          Session {session.n}: {session.title}
        </h3>
        <p className="session-blurb">{session.blurb}</p>
      </div>
      {available ? (
        <a className="watch-btn" href={session.recordingUrl} target="_blank" rel="noopener noreferrer">
          <PlayCircle size={16} />
          Watch recording
          <ExternalLink size={13} className="ext-icon" />
        </a>
      ) : (
        <button className="watch-btn disabled" disabled>
          <PlayCircle size={16} />
          Not available yet
        </button>
      )}
    </div>
  );
}

export default function SessionsPage() {
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
        .app { background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; min-height: 100vh; }
        .app :focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
        h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; margin: 0; color: var(--ink); }
        p { margin: 0; }
        button, a { font-family: inherit; cursor: pointer; }
        a { color: inherit; text-decoration: none; }

        .wrap { max-width: 820px; margin: 0 auto; padding: 0 24px; }

        .nav { border-bottom: 1px solid var(--line); padding: 18px 0; }
        .nav-inner { max-width: 820px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; gap: 10px; }
        .logo { display: flex; align-items: center; gap: 10px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; }
        .logo-mark {
          width: 28px; height: 28px; border-radius: 8px; background: var(--teal); color: #fff;
          display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 13px;
        }

        .intro { padding: 52px 0 8px; text-align: center; }
        .eyebrow {
          font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--teal-deep); background: rgba(14,110,102,0.09); display: inline-block; padding: 5px 10px;
          border-radius: 6px; margin-bottom: 16px;
        }
        .intro h1 { font-size: clamp(26px, 4vw, 36px); line-height: 1.15; }
        .intro p { margin-top: 14px; color: var(--ink-soft); font-size: 15px; max-width: 54ch; margin-left: auto; margin-right: auto; }

        /* Teams live-session card */
        .teams-card {
          display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
          background: var(--paper-raised); border: 1px solid var(--line); border-top: 3px solid var(--periwinkle);
          border-radius: 16px; padding: 24px 26px; margin: 34px 0;
        }
        .teams-icon {
          width: 46px; height: 46px; border-radius: 12px; background: rgba(108,123,209,0.12); color: var(--periwinkle);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .teams-text { flex: 1; min-width: 200px; }
        .teams-text h3 { font-size: 16.5px; margin-bottom: 4px; }
        .teams-text p { font-size: 13.5px; color: var(--ink-soft); }
        .teams-btn {
          background: var(--periwinkle); color: white; border: none; padding: 12px 20px; border-radius: 9px;
          font-weight: 600; font-size: 14.5px; display: inline-flex; align-items: center; gap: 8px;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .teams-btn:hover { background: #5768c0; transform: translateY(-1px); }

        .note {
          display: flex; gap: 8px; align-items: flex-start; font-size: 12.5px; color: var(--ink-soft);
          background: rgba(20,48,46,0.04); border: 1px solid var(--line); border-radius: 9px;
          padding: 10px 12px; margin-bottom: 34px;
        }
        .note svg { flex-shrink: 0; margin-top: 1px; color: var(--ink-soft); }

        .section-label {
          font-family: 'JetBrains Mono', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--ink-soft); margin-bottom: 14px;
        }

        .sessions-list {
          background: var(--paper-raised); border: 1px solid var(--line); border-radius: 16px;
          margin-bottom: 90px; overflow: hidden;
        }
        .session-row {
          display: flex; align-items: center; gap: 18px; padding: 20px 24px; border-top: 1px solid var(--line);
          flex-wrap: wrap;
        }
        .session-row:first-child { border-top: none; }
        .session-num {
          font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; color: var(--teal);
          width: 30px; flex-shrink: 0;
        }
        .session-body { flex: 1; min-width: 220px; }
        .session-level {
          font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em;
          color: var(--ink-soft);
        }
        .session-title { font-size: 15.5px; margin-top: 4px; }
        .session-blurb { font-size: 13.5px; color: var(--ink-soft); margin-top: 4px; }

        .watch-btn {
          background: var(--teal); color: white; border: none; padding: 10px 16px; border-radius: 8px;
          font-weight: 600; font-size: 13.5px; display: inline-flex; align-items: center; gap: 7px;
          white-space: nowrap; flex-shrink: 0; transition: background 0.15s ease, transform 0.15s ease;
        }
        .watch-btn:hover { background: var(--teal-deep); transform: translateY(-1px); }
        .watch-btn .ext-icon { opacity: 0.7; }
        .watch-btn.disabled {
          background: transparent; color: var(--ink-soft); border: 1.5px solid var(--line); cursor: not-allowed;
        }
        .watch-btn.disabled:hover { transform: none; }

        @media (max-width: 560px) {
          .session-row { padding: 18px 18px; }
          .watch-btn { width: 100%; justify-content: center; }
        }
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
        <span className="eyebrow">Programming & Python</span>
        <h1>Sessions & recordings</h1>
        <p>Join the live class on Microsoft Teams, or catch up on any session you missed below.</p>
      </section>

      <div className="wrap">
        <div className="teams-card">
          <div className="teams-icon">
            <Users2 size={22} />
          </div>
          <div className="teams-text">
            <h3>Join this week's live session</h3>
            <p>Same link every session — bookmark it and join a few minutes early.</p>
          </div>
          <a className="teams-btn" href={TEAMS_LINK} target="_blank" rel="noopener noreferrer">
            <Video size={16} />
            Open in Microsoft Teams
          </a>
        </div>

        <div className="note">
          <Info size={14} />
          <span>Sample links for demonstration — replace the Teams link and each session's Google Drive link with your real ones before publishing.</span>
        </div>

        <h4 className="section-label">All sessions</h4>
        <div className="sessions-list">
          {SESSIONS.map((s) => (
            <SessionRow key={s.n} session={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
