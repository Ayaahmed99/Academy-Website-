import React, { useState, useMemo, useRef } from "react";
import { Send, Copy, Check, RotateCcw, Mail, Loader2, AlertTriangle } from "lucide-react";

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
  name: "",
  email: "",
  phone: "",
  subject: "",
  subjectOther: "",
  experience: "",
  availability: "",
  message: "",
  cv: null,
  portfolio: null,
  agree: false,
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
      <span className="field-label">
        {label} {required && <span className="req">*</span>}
      </span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

export default function ApplyPage() {
  const formRef = useRef(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [showErrors, setShowErrors] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formKey, setFormKey] = useState(0); // bumped on reset to clear native file inputs

  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false); // true if delivered via email instead of Formspree

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Portfolio is optional — only CV is required alongside the other fields.
  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.subject &&
    (form.subject !== "other" || form.subjectOther.trim()) &&
    form.experience &&
    form.availability &&
    form.message.trim() &&
    form.cv &&
    form.agree;

  const subjectLabel =
    form.subject === "other" ? form.subjectOther || "General" : SUBJECTS.find((s) => s.id === form.subject)?.title || "General";

  const applicationText = useMemo(() => buildApplicationText(form, subjectLabel), [form, subjectLabel]);

  const mailtoHref = useMemo(() => {
    const subjectLine = `Instructor Application — ${subjectLabel} — ${form.name || "Applicant"}`;
    return `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(applicationText)}`;
  }, [applicationText, subjectLabel, form.name]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      setShowErrors(true);
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData(formRef.current);
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setUsedFallback(false);
        setSucceeded(true);
      } else {
        throw new Error(`Formspree responded with ${res.status}`);
      }
    } catch (err) {
      // Formspree unreachable, blocked, or erroring — fall back to opening a
      // pre-filled email so the application still reaches the inbox.
      // (Attachments can't travel through mailto, so mention that in the copy.)
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

        .form-card {
          background: var(--paper-raised); border: 1px solid var(--line); border-top: 3px solid var(--teal);
          border-radius: 16px; padding: 32px; margin: 36px 0 90px;
        }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 16px; }
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
        .form-grid.span-full, .field.full { grid-column: 1 / -1; }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-size: 13.5px; font-weight: 600; }
        .req { color: var(--coral); }
        .field-error { font-size: 12px; color: var(--coral); }

        input[type="text"], input[type="email"], input[type="tel"], input[type="url"], select, textarea {
          font-family: 'Inter', sans-serif;
          font-size: 14.5px;
          padding: 11px 13px;
          border: 1.5px solid var(--line);
          border-radius: 9px;
          background: var(--paper);
          color: var(--ink);
          width: 100%;
        }
        input:focus, select:focus, textarea:focus { border-color: var(--teal); outline: none; }
        input.err, select.err, textarea.err { border-color: var(--coral); }
        textarea { resize: vertical; min-height: 100px; font-family: inherit; }

        input[type="file"] {
          font-size: 13px; padding: 9px 10px; border: 1.5px dashed var(--line); border-radius: 9px;
          background: var(--paper); color: var(--ink-soft); width: 100%;
        }
        input[type="file"].err { border-color: var(--coral); }
        input[type="file"]::file-selector-button {
          font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 600; color: #fff;
          background: var(--teal); border: none; border-radius: 6px; padding: 7px 11px; margin-right: 10px; cursor: pointer;
        }
        .field-hint { font-size: 12px; color: var(--ink-soft); }

        .checkbox-row { display: flex; align-items: flex-start; gap: 10px; margin-top: 6px; }
        .checkbox-row input { width: 16px; height: 16px; margin-top: 2px; accent-color: var(--teal); }
        .checkbox-row label { font-size: 13.5px; color: var(--ink-soft); line-height: 1.4; }

        .divider { height: 1px; background: var(--line); margin: 26px 0; }

        .submit-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-top: 26px; }
        .cta-btn {
          background: var(--teal); color: white; border: none; padding: 13px 22px;
          border-radius: 9px; font-weight: 600; font-size: 15px;
          display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
        }
        .cta-btn:hover { background: var(--teal-deep); }
        .cta-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .cta-btn.outline { background: transparent; color: var(--ink); border: 1.5px solid var(--line); }
        .cta-btn.outline:hover { border-color: var(--ink); }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .direct-note { font-size: 12.5px; color: var(--ink-soft); margin-top: 14px; }
        .direct-note a { font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }

        .fallback-note {
          display: flex; gap: 8px; align-items: flex-start; font-size: 13px; color: var(--teal-deep);
          background: rgba(242,169,59,0.12); border: 1px solid rgba(242,169,59,0.35); border-radius: 9px;
          padding: 10px 12px; margin-top: 18px; text-align: left;
        }
        .fallback-note svg { flex-shrink: 0; margin-top: 1px; color: var(--amber); }

        .success-card {
          background: var(--paper-raised); border: 1px solid var(--line); border-top: 3px solid var(--teal);
          border-radius: 16px; padding: 36px 32px; margin: 36px 0 90px; text-align: center;
        }
        .success-icon {
          width: 52px; height: 52px; border-radius: 50%; background: rgba(14,110,102,0.1); color: var(--teal-deep);
          display: flex; align-items: center; justify-content: center; margin: 0 auto 18px;
        }
        .success-card h2 { font-size: 21px; margin-bottom: 10px; }
        .success-card p { color: var(--ink-soft); font-size: 14.5px; max-width: 44ch; margin: 0 auto; }
        .success-actions { display: flex; justify-content: center; gap: 12px; margin-top: 26px; flex-wrap: wrap; }
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
        <p>Tell us about yourself and what you'd like to teach. We'll get your application either way — no email app required, but it's there as a backup.</p>
      </section>

      <div className="wrap">
        {!succeeded ? (
          <form className="form-card" key={formKey} ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <Field label="Full name" required error={showErrors && !form.name.trim() ? "Please enter your name" : null}>
                <input
                  type="text"
                  name="name"
                  className={showErrors && !form.name.trim() ? "err" : ""}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                />
              </Field>

              <Field label="Email" required error={showErrors && !form.email.trim() ? "Please enter your email" : null}>
                <input
                  type="email"
                  name="email"
                  className={showErrors && !form.email.trim() ? "err" : ""}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>

              <Field label="Phone" required error={showErrors && !form.phone.trim() ? "Please enter your phone number" : null}>
                <input
                  type="tel"
                  name="phone"
                  className={showErrors && !form.phone.trim() ? "err" : ""}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+20 1xx xxx xxxx"
                />
              </Field>

              <Field
                label="Subject you'd like to teach"
                required
                error={showErrors && !form.subject ? "Please choose a subject" : null}
              >
                <select
                  className={showErrors && !form.subject ? "err" : ""}
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                >
                  <option value="">Select a subject</option>
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.title}
                    </option>
                  ))}
                </select>
                {/* Hidden field so Formspree/email receives the resolved label, not the internal id */}
                <input type="hidden" name="subject" value={subjectLabel} />
              </Field>

              {form.subject === "other" && (
                <Field
                  label="What subject?"
                  required
                  error={showErrors && !form.subjectOther.trim() ? "Please tell us what you'd like to teach" : null}
                >
                  <input
                    type="text"
                    name="subject_other"
                    className={showErrors && !form.subjectOther.trim() ? "err" : ""}
                    value={form.subjectOther}
                    onChange={(e) => update("subjectOther", e.target.value)}
                    placeholder="e.g. Robotics"
                  />
                </Field>
              )}

              <Field
                label="Years of relevant experience"
                required
                error={showErrors && !form.experience ? "Please select your experience" : null}
              >
                <select
                  name="experience"
                  className={showErrors && !form.experience ? "err" : ""}
                  value={form.experience}
                  onChange={(e) => update("experience", e.target.value)}
                >
                  <option value="">Select a range</option>
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Availability"
                required
                error={showErrors && !form.availability ? "Please select your availability" : null}
              >
                <select
                  name="availability"
                  className={showErrors && !form.availability ? "err" : ""}
                  value={form.availability}
                  onChange={(e) => update("availability", e.target.value)}
                >
                  <option value="">Select availability</option>
                  {AVAILABILITY_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="field full">
                <Field
                  label="Why do you want to join SparkLab Academy?"
                  required
                  error={showErrors && !form.message.trim() ? "Please tell us why you'd like to join" : null}
                >
                  <textarea
                    name="message"
                    className={showErrors && !form.message.trim() ? "err" : ""}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us about your teaching experience and why you'd be a good fit..."
                  />
                </Field>
              </div>

              <Field
                label="CV / resume"
                required
                error={showErrors && !form.cv ? "Please attach your CV" : null}
              >
                <input
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  className={showErrors && !form.cv ? "err" : ""}
                  onChange={(e) => update("cv", e.target.files?.[0] || null)}
                />
                <span className="field-hint">{form.cv ? form.cv.name : "PDF or Word"}</span>
              </Field>

              <Field label="Portfolio (optional)">
                <input
                  type="file"
                  name="portfolio"
                  accept=".pdf,.doc,.docx,.zip,.ppt,.pptx"
                  onChange={(e) => update("portfolio", e.target.files?.[0] || null)}
                />
                <span className="field-hint">{form.portfolio ? form.portfolio.name : "Samples of your work, e.g. slides, projects, videos"}</span>
              </Field>

              <input type="hidden" name="_subject" value={`Instructor Application — ${subjectLabel} — ${form.name || "Applicant"}`} />
            </div>

            <div className="divider" />

            <div className="checkbox-row">
              <input
                type="checkbox"
                id="agree"
                checked={form.agree}
                onChange={(e) => update("agree", e.target.checked)}
              />
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
              If sending doesn't go through, this automatically opens a pre-filled email to{" "}
              <a href={`mailto:${APPLY_EMAIL}`}>{APPLY_EMAIL}</a> instead — your application is never lost.
            </p>
          </form>
        ) : (
          <div className="success-card">
            <div className="success-icon">
              <Mail size={22} />
            </div>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
