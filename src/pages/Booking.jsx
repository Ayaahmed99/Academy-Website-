import React, { useState, useRef } from "react";
import { Check, ArrowRight, Loader2, CalendarClock, ShieldCheck, MessageCircle } from "lucide-react";

/* ============================================================================
   HOW THIS TALKS TO GOOGLE SHEETS
   ----------------------------------------------------------------------------
   No payment gateway here — a booking submission is just a row written to
   this shared Google Sheet. The academy team then follows up manually:
   https://docs.google.com/spreadsheets/d/1CuCZfT2gwUE-UOq3IGHYnWYk85VG4ZikpIi9B-E5Q38/edit

   This can't be wired up from outside your Google account — an AI assistant
   should not have standing write access to a sheet holding parents' contact
   info. Instead, do this once (~5 minutes), from inside the sheet itself:

   1. Open the sheet above. In row 1, add these column headers (skip any
      that already exist):
      Timestamp | Course | Student Name | Student Age | Parent Name |
      Phone | Email | Preferred Start | Notes | Status

   2. Extensions → Apps Script. Delete any placeholder code and paste:

      function doPost(e) {
        try {
          const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
          // Submitted via a real HTML form post (see below), so Apps Script
          // decodes fields into e.parameter rather than e.postData.
          const data = JSON.parse(e.parameter.payload);
          sheet.appendRow([
            new Date(),
            data.course,
            data.studentName,
            data.studentAge,
            data.parentName,
            data.phone,
            data.email,
            data.preferredStart,
            data.notes,
            "New"
          ]);
          return ContentService.createTextOutput(
            JSON.stringify({ result: "success" })
          ).setMimeType(ContentService.MimeType.JSON);
        } catch (err) {
          return ContentService.createTextOutput(
            JSON.stringify({ result: "error", message: err.message })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }

      Because this script is bound to the sheet (opened via Extensions →
      Apps Script from inside it), SpreadsheetApp.getActiveSpreadsheet()
      already points at this exact sheet — no ID needs to be pasted in.

   3. Deploy → New deployment → gear icon → type "Web app" → Execute as
      "Me" → Who has access "Anyone". Click Deploy, authorize it with your
      Google account when prompted, then copy the generated
      https://script.google.com/macros/s/.../exec URL.

   4. Paste that URL as GOOGLE_SHEET_WEB_APP_URL below and this form will
      write straight into that sheet.

   A note on the request itself: fetch()-ing an Apps Script Web App from the
   browser is unreliable — Google issues a redirect from script.google.com
   to script.googleusercontent.com, and depending on the browser that can
   leave the fetch promise hanging forever (no resolve, no reject, no error
   — the button just silently does nothing). To avoid that entirely, this
   form submits via a real, hidden <form target="..."> pointed at a hidden
   <iframe>, exactly like classic no-JS form submissions. That's a genuine
   browser navigation, not a fetch, so it isn't subject to CORS or the
   redirect-hang problem — we just can't read the iframe's cross-origin
   response body, so success/failure is inferred from whether the iframe's
   onLoad event fires within a timeout (see SUBMIT_TIMEOUT_MS below).
   ============================================================================ */

const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
// How long to wait for the hidden iframe to finish loading before treating
// the submission as failed (e.g. offline, wrong URL, deployment not public).
const SUBMIT_TIMEOUT_MS = 12000;

const BOOKABLE_COURSES = [
  { id: "python", icon: "🐍", title: "Programming & Python", ages: "8–18", accent: "var(--teal)", open: true, note: "Starts as soon as a small group is ready" },
  { id: "ai", icon: "🤖", title: "AI & Smart Technology", ages: "10–18", accent: "var(--periwinkle)", open: false, note: "Join the waitlist — we'll contact you when it opens" },
  { id: "canva", icon: "🎨", title: "Canva & Creative Design", ages: "8–16", accent: "var(--coral)", open: false, note: "Join the waitlist — we'll contact you when it opens" },
  { id: "english", icon: "🇬🇧", title: "English Communication & Conversation", ages: "6–14", accent: "var(--amber)", open: false, note: "Join the waitlist — we'll contact you when it opens" },
  { id: "scratch", icon: "🎮", title: "Scratch & Game Development", ages: "6–12", accent: "var(--teal)", open: false, note: "Join the waitlist — we'll contact you when it opens" },
];

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

      .bk-steps { display: flex; gap: 18px; margin: 30px 0 8px; }
      .bk-step { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--ink-soft); }
      .bk-step.active { color: var(--teal-deep); }
      .bk-step-dot {
        width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-family: 'JetBrains Mono', monospace; font-size: 11.5px; border: 1.5px solid var(--line); background: var(--paper-raised); flex-shrink: 0;
      }
      .bk-step.active .bk-step-dot { border-color: var(--teal); color: var(--teal-deep); background: rgba(14,110,102,0.09); }
      .bk-step.done .bk-step-dot { border-color: var(--teal); background: var(--teal); color: white; }

      /* ---- course picker ---- */
      .bk-course-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; padding: 28px 0 8px; }
      @media (max-width: 620px) { .bk-course-grid { grid-template-columns: 1fr; } }
      .bk-course-card {
        text-align: left; background: var(--paper-raised); border: 1.5px solid var(--line); border-top: 3px solid var(--accent);
        border-radius: 12px; padding: 16px 18px; display: flex; flex-direction: column; gap: 6px;
        transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
      }
      .bk-course-card:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(20,48,46,0.08); }
      .bk-course-card.selected { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent) inset; }
      .bk-course-top { display: flex; align-items: center; justify-content: space-between; }
      .bk-course-icon { font-size: 24px; }
      .bk-course-title { font-size: 15.5px; font-weight: 700; }
      .bk-course-sub { font-size: 12.5px; color: var(--ink-soft); }
      .bk-course-badge { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 100px; white-space: nowrap; }
      .bk-course-badge.open { background: rgba(14,110,102,0.12); color: var(--teal-deep); }
      .bk-course-badge.waitlist { background: rgba(20,48,46,0.07); color: var(--ink-soft); }
      .bk-course-check { width: 20px; height: 20px; border-radius: 50%; background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

      /* ---- form ---- */
      .bk-form { padding: 8px 0 10px; display: flex; flex-direction: column; gap: 18px; }
      .bk-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      @media (max-width: 620px) { .bk-field-row { grid-template-columns: 1fr; } }
      .bk-field { display: flex; flex-direction: column; gap: 7px; }
      .bk-field label { font-size: 13px; font-weight: 600; color: var(--ink); }
      .bk-field .hint { font-size: 12px; font-weight: 400; color: var(--ink-soft); }
      .bk-field input, .bk-field textarea, .bk-field select {
        font-family: inherit; font-size: 14.5px; color: var(--ink); background: var(--paper-raised);
        border: 1.5px solid var(--line); border-radius: 9px; padding: 11px 13px; width: 100%;
        transition: border-color 0.15s ease;
      }
      .bk-field input:focus, .bk-field textarea:focus, .bk-field select:focus { border-color: var(--teal); outline: none; }
      .bk-field textarea { resize: vertical; min-height: 84px; }
      .bk-error { font-size: 12.5px; color: var(--coral); font-weight: 600; }

      .bk-selected-strip {
        display: flex; align-items: center; gap: 10px; background: var(--paper-raised); border: 1px solid var(--line);
        border-radius: 10px; padding: 12px 14px; font-size: 13.5px; color: var(--ink-soft);
      }
      .bk-selected-strip strong { color: var(--ink); }
      .bk-change-link { margin-left: auto; background: none; border: none; color: var(--teal-deep); font-weight: 600; font-size: 13px; padding: 0; }
      .bk-change-link:hover { text-decoration: underline; }

      .bk-actions { display: flex; align-items: center; gap: 14px; margin-top: 4px; }
      .bk-btn {
        background: var(--teal); color: white; border: none; padding: 13px 22px; border-radius: 9px;
        font-weight: 600; font-size: 15px; display: inline-flex; align-items: center; gap: 8px;
        transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, opacity 0.15s ease;
      }
      .bk-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(14,110,102,0.25); background: var(--teal-deep); }
      .bk-btn:disabled { opacity: 0.6; transform: none; box-shadow: none; cursor: not-allowed; }
      .bk-btn-ghost { background: transparent; border: 1.5px solid var(--line); color: var(--ink); padding: 13px 22px; border-radius: 9px; font-weight: 600; font-size: 15px; }
      .bk-btn-ghost:hover { border-color: var(--ink); }
      .bk-spin { animation: bk-spin 0.8s linear infinite; }
      @keyframes bk-spin { to { transform: rotate(360deg); } }

      .bk-trust-row { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 6px; padding-top: 18px; border-top: 1px solid var(--line); }
      .bk-trust-item { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--ink-soft); }

      /* ---- success state ---- */
      .bk-success { padding: 60px 0 80px; display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
      .bk-success-icon { width: 52px; height: 52px; border-radius: 50%; background: var(--teal); color: white; display: flex; align-items: center; justify-content: center; }
      .bk-success h2 { font-size: 24px; }
      .bk-success p { font-size: 15px; color: var(--ink-soft); max-width: 54ch; }
      .bk-success-card { background: var(--paper-raised); border: 1px solid var(--line); border-radius: 12px; padding: 18px 20px; font-size: 13.5px; color: var(--ink-soft); width: 100%; max-width: 460px; }
      .bk-success-card strong { color: var(--ink); }

      .bk-footer-space { height: 60px; }
    `}</style>
  );
}

function StepIndicator({ step }) {
  const steps = [
    { n: 1, label: "Choose course" },
    { n: 2, label: "Your details" },
  ];
  return (
    <div className="bk-steps">
      {steps.map((s) => (
        <div key={s.n} className={"bk-step" + (step === s.n ? " active" : "") + (step > s.n ? " done" : "")}>
          <span className="bk-step-dot">{step > s.n ? <Check size={12} strokeWidth={3} /> : s.n}</span>
          {s.label}
        </div>
      ))}
    </div>
  );
}

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({
    studentName: "",
    studentAge: "",
    parentName: "",
    phone: "",
    email: "",
    preferredStart: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const iframeRef = useRef(null);
  const hiddenFormRef = useRef(null);
  const payloadInputRef = useRef(null);
  const timeoutRef = useRef(null);

  const selectedCourse = BOOKABLE_COURSES.find((c) => c.id === selectedId) || null;

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.studentName.trim()) next.studentName = "Enter the student's name";
    if (!form.studentAge.trim()) next.studentAge = "Enter the student's age";
    if (!form.parentName.trim()) next.parentName = "Enter a parent or guardian name";
    if (!form.phone.trim()) next.phone = "Enter a phone number we can reach you on";
    if (!form.email.trim()) next.email = "Enter an email address";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "That email doesn't look right";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // Fires when the hidden iframe finishes loading — our best signal that
  // the browser actually completed the navigation to the Apps Script URL.
  // We can't read the cross-origin response body, so this can't prove the
  // row saved, but it does prove the request didn't just vanish.
  function handleIframeLoad() {
    if (status !== "submitting") return; // ignore the iframe's initial blank load
    clearTimeout(timeoutRef.current);
    console.log("[BookingPage] Hidden iframe finished loading — treating as delivered.");
    setStatus("success");
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("[BookingPage] Send booking request clicked");
    if (!validate()) {
      console.log("[BookingPage] Validation failed, not submitting:", errors);
      return;
    }
    if (GOOGLE_SHEET_WEB_APP_URL.includes("YOUR_DEPLOYMENT_ID")) {
      console.error(
        "[BookingPage] GOOGLE_SHEET_WEB_APP_URL is still the placeholder — set it to your Apps Script deployment URL."
      );
      setErrorMessage("This form isn't connected to a sheet yet (missing deployment URL).");
      setStatus("error");
      return;
    }

    const payload = { course: selectedCourse.title, ...form };
    console.log("[BookingPage] Submitting payload via hidden iframe:", payload);

    payloadInputRef.current.value = JSON.stringify(payload);
    setStatus("submitting");
    setErrorMessage("");

    // Real browser form navigation — not fetch — so it can't hang the way
    // a fetch() to an Apps Script redirect can, and isn't subject to CORS.
    hiddenFormRef.current.submit();

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      console.error("[BookingPage] Timed out waiting for the iframe to load — request likely failed.");
      setErrorMessage("This is taking too long — check your connection or that the sheet URL is correct.");
      setStatus("error");
    }, SUBMIT_TIMEOUT_MS);
  }

  if (status === "success") {
    return (
      <div className="bk-app">
        <BookingStyles />
        <div className="bk-wrap bk-success">
          <div className="bk-success-icon"><Check size={26} strokeWidth={3} /></div>
          <h2>Booking request sent</h2>
          <p>
            Thanks, {form.parentName.split(" ")[0] || "there"} — we've got {form.studentName || "your child"}'s
            request for <strong>{selectedCourse?.title}</strong>. The academy team will reach out at{" "}
            {form.phone || form.email} within 1–2 days to confirm the schedule and next steps.
          </p>
          <div className="bk-success-card">
            <strong>What happens next:</strong> we review the request, match it to an available group and instructor,
            then contact you to confirm a start date. No payment is needed until that's confirmed.
          </div>
          <button
            className="bk-btn-ghost"
            onClick={() => {
              setStatus("idle");
              setStep(1);
              setSelectedId(null);
              setForm({ studentName: "", studentAge: "", parentName: "", phone: "", email: "", preferredStart: "", notes: "" });
            }}
          >
            Book another course
          </button>
        </div>
        <div className="bk-footer-space" />
      </div>
    );
  }

  return (
    <div className="bk-app">
      <BookingStyles />
      <div className="bk-wrap">
        <div className="bk-hero">
          <span className="bk-eyebrow">Book a course</span>
          <h1>Reserve a spot for your child</h1>
          <p>
            Pick a course and share a few details — there's nothing to pay right now. Our team reviews every
            request and contacts you directly to confirm the schedule.
          </p>
          <StepIndicator step={step} />
        </div>

        {step === 1 && (
          <>
            <div className="bk-course-grid">
              {BOOKABLE_COURSES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={"bk-course-card" + (selectedId === c.id ? " selected" : "")}
                  style={{ "--accent": c.accent }}
                  onClick={() => setSelectedId(c.id)}
                >
                  <div className="bk-course-top">
                    <span className="bk-course-icon" aria-hidden="true">{c.icon}</span>
                    {selectedId === c.id ? (
                      <span className="bk-course-check"><Check size={13} strokeWidth={3} /></span>
                    ) : (
                      <span className={"bk-course-badge " + (c.open ? "open" : "waitlist")}>
                        {c.open ? "Open now" : "Waitlist"}
                      </span>
                    )}
                  </div>
                  <span className="bk-course-title">{c.title}</span>
                  <span className="bk-course-sub">Ages {c.ages} · {c.note}</span>
                </button>
              ))}
            </div>
            <div className="bk-actions">
              <button className="bk-btn" disabled={!selectedId} onClick={() => setStep(2)}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
            <div className="bk-footer-space" />
          </>
        )}

        {step === 2 && selectedCourse && (
          <form className="bk-form" onSubmit={handleSubmit}>
            <div className="bk-selected-strip">
              <span aria-hidden="true">{selectedCourse.icon}</span>
              Booking <strong>{selectedCourse.title}</strong> · Ages {selectedCourse.ages}
              <button type="button" className="bk-change-link" onClick={() => setStep(1)}>Change</button>
            </div>

            <div className="bk-field-row">
              <div className="bk-field">
                <label htmlFor="studentName">Student's name</label>
                <input id="studentName" value={form.studentName} onChange={(e) => updateField("studentName", e.target.value)} />
                {errors.studentName && <span className="bk-error">{errors.studentName}</span>}
              </div>
              <div className="bk-field">
                <label htmlFor="studentAge">Student's age</label>
                <input id="studentAge" type="number" min="6" max="19" value={form.studentAge} onChange={(e) => updateField("studentAge", e.target.value)} />
                {errors.studentAge && <span className="bk-error">{errors.studentAge}</span>}
              </div>
            </div>

            <div className="bk-field-row">
              <div className="bk-field">
                <label htmlFor="parentName">Parent / guardian name</label>
                <input id="parentName" value={form.parentName} onChange={(e) => updateField("parentName", e.target.value)} />
                {errors.parentName && <span className="bk-error">{errors.parentName}</span>}
              </div>
              <div className="bk-field">
                <label htmlFor="phone">Phone number</label>
                <input id="phone" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
                {errors.phone && <span className="bk-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="bk-field-row">
              <div className="bk-field">
                <label htmlFor="email">Email address</label>
                <input id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
                {errors.email && <span className="bk-error">{errors.email}</span>}
              </div>
              <div className="bk-field">
                <label htmlFor="preferredStart">Preferred start <span className="hint">(optional)</span></label>
                <input id="preferredStart" type="date" value={form.preferredStart} onChange={(e) => updateField("preferredStart", e.target.value)} />
              </div>
            </div>

            <div className="bk-field">
              <label htmlFor="notes">Anything we should know? <span className="hint">(optional)</span></label>
              <textarea id="notes" placeholder="Scheduling constraints, prior experience, questions…" value={form.notes} onChange={(e) => updateField("notes", e.target.value)} />
            </div>

            {status === "error" && (
              <span className="bk-error">
                {errorMessage || "Something went wrong sending your request — please try again, or reach us directly if it keeps happening."}
              </span>
            )}

            <div className="bk-actions">
              <button type="submit" className="bk-btn" disabled={status === "submitting"}>
                {status === "submitting" ? (
                  <>
                    <Loader2 size={16} className="bk-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Send booking request <ArrowRight size={16} />
                  </>
                )}
              </button>
              <button type="button" className="bk-btn-ghost" onClick={() => setStep(1)} disabled={status === "submitting"}>
                Back
              </button>
            </div>

            <div className="bk-trust-row">
              <span className="bk-trust-item"><ShieldCheck size={15} /> No payment required to submit</span>
              <span className="bk-trust-item"><CalendarClock size={15} /> We confirm scheduling before anything is final</span>
              <span className="bk-trust-item"><MessageCircle size={15} /> You'll hear back within 1–2 days</span>
            </div>

            {/* Hidden iframe + form: the actual delivery mechanism. A real
                browser form POST targeting a hidden iframe, not fetch — see
                the setup comment at the top of this file for why. */}
            <iframe
              ref={iframeRef}
              name="bk-submit-target"
              title="booking-submit-target"
              style={{ display: "none" }}
              onLoad={handleIframeLoad}
            />
            <form
              ref={hiddenFormRef}
              action={GOOGLE_SHEET_WEB_APP_URL}
              method="POST"
              target="bk-submit-target"
              style={{ display: "none" }}
            >
              <input ref={payloadInputRef} type="hidden" name="payload" defaultValue="" />
            </form>

            <div className="bk-footer-space" />
          </form>
        )}
      </div>
    </div>
  );
}
