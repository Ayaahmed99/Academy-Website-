import React, { useState, useMemo } from "react";
import { Mail, Phone, Star, X, ArrowLeft } from "lucide-react";

// Sample data — replace names, subjects, contact details and reviews with
// your real team's information before publishing.
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

// Deterministic hash + seeded RNG so each instructor's avatar is stable
// across renders but unique to their name — no photos, no two alike.
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
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

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)];
}

// Bust-portrait avatar in the style of the reference image: rounded head,
// hair, optional beard, shirt collar and tie. Every trait — skin tone, hair
// color/style, suit color, beard — is chosen deterministically from the
// instructor's name, so it's generated, not hand-picked, but always the
// same result for the same name. The tie always takes the instructor's
// subject color, tying the illustration back to what they teach.
const SKIN_TONES = ["#F4C89B", "#E3AC7C", "#C68863", "#8D5A34", "#FFDCB2"];
const HAIR_COLORS = ["#2B1B12", "#4A2E1E", "#1C1C1C", "#6B3F23", "#5C4033"];
const SUIT_COLORS = ["#2B3A55", "#33424F", "#3B3B3B", "#41474D", "#2E3D3B"];
const HAIR_STYLES_BY_GENDER = {
  male: ["short"],
  female: ["long", "bun", "short"],
};

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
  if (style === "long") {
    return <path d="M16,15 Q22,7 30,8.5 Q37,9.5 40,16 Q34,11 28,11.5 Q21,12 16,15 Z" fill={color} />;
  }
  if (style === "bun") {
    return <path d="M17,15 Q23,8.5 30,9 Q36,9.5 39,15.5 Q33,11.5 28,11.5 Q22,11.5 17,15 Z" fill={color} />;
  }
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

        {/* background */}
        <circle cx="28" cy="28" r="28" fill="#EEF2F0" />

        {/* suit shoulders */}
        <path d="M3,56 C3,41 14,35 28,35 C42,35 53,41 53,56 Z" fill={p.suit} />

        {/* collar */}
        <path d="M22,37 L28,45 L25,35 Z" fill="#F7F7F5" />
        <path d="M34,37 L28,45 L31,35 Z" fill="#F7F7F5" />

        {/* tie — colored to the instructor's subject */}
        <path d="M26.5,38 L29.5,38 L31,49 L28,53 L25,49 Z" fill={accent} />

        {/* long hair strands sit behind the neck/shoulders */}
        {p.style === "long" && <HairBack style={p.style} color={p.hair} />}

        {/* neck */}
        <rect x="24" y="28" width="8" height="10" rx="3" fill={p.skin} />

        {/* hair back (rim behind head) for short/bun styles, drawn above neck */}
        {p.style !== "long" && <HairBack style={p.style} color={p.hair} />}
        {p.style === "long" && <ellipse cx="28" cy="19" rx="14" ry="15" fill={p.hair} />}

        {/* head */}
        <circle cx="28" cy="23.5" r="11.5" fill={p.skin} />
        <circle cx="28" cy="23.5" r="11.5" fill={`url(#${gid})`} />

        {/* hair front / fringe */}
        <HairFront style={p.style} color={p.hair} />

        {/* eyebrows */}
        <path d="M20,21.5 Q23,20 26,21.3" stroke={p.hair} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M30,21.3 Q33,20 36,21.5" stroke={p.hair} strokeWidth="1.3" fill="none" strokeLinecap="round" />

        {/* eyes */}
        <ellipse cx="23.5" cy="24.5" rx="1.5" ry="1.9" fill="#2A2118" />
        <ellipse cx="32.5" cy="24.5" rx="1.5" ry="1.9" fill="#2A2118" />
        <circle cx="24" cy="23.9" r="0.5" fill="#fff" />
        <circle cx="33" cy="23.9" r="0.5" fill="#fff" />

        {/* beard, or a plain smile if clean-shaven */}
        {p.beard ? (
          <path
            d="M17,24 Q17,33 28,34 Q39,33 39,24 Q39,30 34,32 Q31,33 28,33 Q25,33 22,32 Q17,30 17,24 Z"
            fill={p.hair}
            opacity="0.92"
          />
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
          <Star
            key={i}
            size={size}
            fill={filled ? "var(--amber)" : "none"}
            stroke={filled ? "var(--amber)" : "var(--line)"}
            strokeWidth={1.5}
          />
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
        <a className="contact-row" href={`mailto:${instructor.email}`}>
          <Mail size={15} />
          {instructor.email}
        </a>
        <a className="contact-row" href={`tel:${instructor.phone.replace(/\s/g, "")}`}>
          <Phone size={15} />
          {instructor.phone}
        </a>
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
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

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

export default function InstructorsPage() {
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
        .app { background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; min-height: 100vh; }
        .app :focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
        h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; margin: 0; color: var(--ink); }
        p { margin: 0; }
        button { font-family: inherit; cursor: pointer; background: none; border: none; }
        a { color: inherit; text-decoration: none; }

        .wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; }

        .nav { border-bottom: 1px solid var(--line); padding: 18px 0; }
        .nav-inner { max-width: 1080px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; gap: 10px; }
        .logo { display: flex; align-items: center; gap: 10px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; }
        .logo-mark {
          width: 28px; height: 28px; border-radius: 8px; background: var(--teal); color: #fff;
          display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 13px;
        }

        .intro { padding: 56px 0 8px; text-align: center; }
        .eyebrow {
          font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--teal-deep); background: rgba(14,110,102,0.09); display: inline-block; padding: 5px 10px;
          border-radius: 6px; margin-bottom: 16px;
        }
        .intro h1 { font-size: clamp(28px, 4vw, 38px); line-height: 1.15; }
        .intro p { margin-top: 14px; color: var(--ink-soft); font-size: 15.5px; max-width: 54ch; margin-left: auto; margin-right: auto; }

        .sample-note {
          text-align: center; font-size: 12.5px; color: var(--ink-soft); font-style: italic;
          margin: 18px auto 46px; max-width: 60ch;
        }

        .instructor-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding-bottom: 80px;
        }
        @media (max-width: 920px) { .instructor-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 620px) { .instructor-grid { grid-template-columns: 1fr; } }

        .instructor-card {
          background: var(--paper-raised); border: 1px solid var(--line); border-top: 3px solid var(--accent);
          border-radius: 14px; padding: 22px; transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .instructor-card:hover { transform: translateY(-3px); box-shadow: 0 16px 32px rgba(20,48,46,0.08); }

        .card-top { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .avatar {
          border-radius: 50%; flex-shrink: 0; overflow: hidden;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
          background: #EEF2F0;
        }
        .avatar svg { display: block; }
        .i-name { font-size: 16.5px; font-weight: 700; }
        .i-subject { font-size: 13px; color: var(--ink-soft); margin-top: 2px; }

        .rating-row { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
        .stars { display: flex; gap: 2px; }
        .rating-num { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 500; }
        .rating-count { font-size: 12.5px; color: var(--ink-soft); }
        .review-link {
          font-size: 12.5px; font-weight: 600; color: var(--teal-deep); text-decoration: underline;
          text-underline-offset: 2px;
        }

        .contact-block { display: flex; flex-direction: column; gap: 8px; padding-top: 14px; border-top: 1px solid var(--line); }
        .contact-row { display: flex; align-items: center; gap: 9px; font-size: 13.5px; color: var(--ink-soft); }
        .contact-row:hover { color: var(--ink); }

        /* Drawer (reviews) */
        .overlay { position: fixed; inset: 0; background: rgba(10,20,19,0.45); display: flex; justify-content: flex-end; z-index: 50; animation: fadeIn 0.18s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .drawer {
          background: var(--paper); width: min(460px, 100%); height: 100%; overflow-y: auto;
          padding: 28px 26px 40px; position: relative; border-left: 3px solid var(--accent);
          animation: slideIn 0.22s ease;
        }
        @keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @media (max-width: 560px) { .drawer { width: 100%; } }

        .close-btn {
          position: absolute; top: 20px; right: 20px; background: var(--paper-raised); border: 1px solid var(--line);
          border-radius: 8px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; color: var(--ink);
        }
        .close-btn:hover { border-color: var(--ink); }

        .drawer-head { display: flex; gap: 14px; align-items: center; margin-top: 6px; margin-bottom: 18px; }
        .drawer-head h2 { font-size: 20px; }

        .section-label {
          font-family: 'JetBrains Mono', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--ink-soft); margin-bottom: 14px;
        }

        .reviews-list { display: flex; flex-direction: column; gap: 4px; }
        .review-item { padding: 16px 0; border-top: 1px solid var(--line); }
        .review-item:first-child { border-top: none; }
        .review-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
        .review-name { font-weight: 600; font-size: 13.5px; }
        .review-text { font-size: 14px; color: var(--ink-soft); line-height: 1.5; }
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
        <span className="eyebrow">Meet the team</span>
        <h1>Instructors who make it click</h1>
        <p>Every course is led by a real instructor — here's who's teaching, how they're rated, and how to reach them.</p>
      </section>
      <p className="wrap sample-note">
        Sample profiles for demonstration — replace names, contact details and reviews with your real instructors' information before publishing.
      </p>

      <div className="wrap instructor-grid">
        {INSTRUCTORS.map((inst) => (
          <InstructorCard key={inst.id} instructor={inst} onOpenReviews={setActive} />
        ))}
      </div>

      {active && <ReviewsDrawer instructor={active} onClose={() => setActive(null)} />}
    </div>
  );
}
