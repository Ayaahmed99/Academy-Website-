import React from "react";
import { ShieldCheck, CalendarClock, MessageCircle } from "lucide-react";

const GOOGLE_FORM_SRC =
  "https://docs.google.com/forms/d/e/1FAIpQLSeVSOtfFgYyhwiU9TWJFm31fcda3xC7dvQ9NNYFZZ-o8gsxzw/viewform?embedded=true";

function BookingStyles() {
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
      .bk-app { background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; min-height: 100vh; line-height: 1.5; }
      .bk-app :focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
      .bk-app h1, .bk-app h2, .bk-app h3, .bk-app h4 { font-family: 'Space Grotesk', sans-serif; margin: 0; color: var(--ink); }
      .bk-app p { margin: 0; }
      .bk-app button { font-family: inherit; cursor: pointer; }

      .bk-wrap { max-width: 900px; margin: 0 auto; padding: 0 24px; }

      .bk-hero { padding: 56px 0 8px; }
      .bk-eyebrow {
        font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;
        color: var(--teal-deep); background: rgba(14,110,102,0.09); display: inline-block; padding: 5px 10px;
        border-radius: 6px; margin-bottom: 18px;
      }
      .bk-hero h1 { font-size: clamp(28px, 3.8vw, 40px); line-height: 1.12; letter-spacing: -0.01em; }
      .bk-hero p { margin-top: 14px; font-size: 15.5px; color: var(--ink-soft); max-width: 58ch; }

      .bk-trust-row { display: flex; gap: 20px; flex-wrap: wrap; margin: 26px 0 0; padding-top: 18px; border-top: 1px solid var(--line); }
      .bk-trust-item { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--ink-soft); }

      .bk-gform-card {
        background: var(--paper-raised); border: 1px solid var(--line); border-top: 3px solid var(--teal);
        border-radius: 16px; padding: 8px; margin: 30px 0 90px; overflow: hidden;
      }
      .bk-gform-frame-wrap { position: relative; width: 100%; }
      .bk-gform-frame-wrap iframe {
        display: block; width: 100%; height: 1200px; border: none; border-radius: 10px;
      }
      @media (max-width: 600px) { .bk-gform-frame-wrap iframe { height: 1400px; } }

      .bk-footer-space { height: 60px; }
    `}</style>
  );
}

export default function BookingPage() {
  return (
    <div className="bk-app">
      <BookingStyles />
      <div className="bk-wrap">
        <div className="bk-hero">
          <span className="bk-eyebrow">Book a course</span>
          <h1>Reserve a spot for your child</h1>
          <p>
            Fill out the form below — there's nothing to pay right now. Our team reviews every request and
            contacts you directly to confirm the schedule.
          </p>
          <div className="bk-trust-row">
            <span className="bk-trust-item"><ShieldCheck size={15} /> No payment required to submit</span>
            <span className="bk-trust-item"><CalendarClock size={15} /> We confirm scheduling before anything is final</span>
            <span className="bk-trust-item"><MessageCircle size={15} /> You'll hear back within 1–2 days</span>
          </div>
        </div>

        <div className="bk-gform-card">
          <div className="bk-gform-frame-wrap">
            <iframe
              src={GOOGLE_FORM_SRC}
              title="Course booking form"
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
