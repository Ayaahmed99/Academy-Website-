import React from "react";

const GOOGLE_FORM_SRC =
  "https://docs.google.com/forms/d/e/1FAIpQLSefBjqC8jlZvBJaVb2YQ86X25OkbzaISW4XO-lQwXa3Fv8Xnw/viewform?embedded=true";

export default function ApplyPage() {
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
        button, a.btn { font-family: inherit; cursor: pointer; }
        a { color: inherit; }

        .wrap { max-width: 720px; margin: 0 auto; padding: 0 24px; }

        .nav { border-bottom: 1px solid var(--line); padding: 18px 0; }
        .nav-inner { max-width: 720px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; gap: 10px; }
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

        .gform-card {
          background: var(--paper-raised); border: 1px solid var(--line); border-top: 3px solid var(--teal);
          border-radius: 16px; padding: 8px; margin: 36px 0 90px; overflow: hidden;
        }
        .gform-frame-wrap { position: relative; width: 100%; }
        .gform-frame-wrap iframe {
          display: block; width: 100%; height: 1200px; border: none; border-radius: 10px;
        }
        @media (max-width: 600px) { .gform-frame-wrap iframe { height: 1400px; } }
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
        <span className="eyebrow">Join the team</span>
        <h1>Apply to teach at SparkLab Academy</h1>
        <p>Tell us about yourself and what you'd like to teach. Fill out the form below — we'll be in touch.</p>
      </section>

      <div className="wrap">
        <div className="gform-card">
          <div className="gform-frame-wrap">
            <iframe
              src={GOOGLE_FORM_SRC}
              title="Instructor application form"
              marginHeight={0}
              marginWidth={0}
            >
              Loading…
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
