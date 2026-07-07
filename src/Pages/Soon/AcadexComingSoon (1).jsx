import { useState, useEffect, useRef } from "react";

export default function AcadexComingSoon() {
  const [email, setEmail] = useState("");
  const [filed, setFiled] = useState(false);
  const [stamped, setStamped] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setStamped(true), 650);
    return () => clearTimeout(t);
  }, []);

  const handleTilt = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${y * -4}deg`);
    el.style.setProperty("--ry", `${x * 6}deg`);
  };
  const resetTilt = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setFiled(true);
  };

  const entries = [
    {
      no: "001.4",
      title: "Structured Notes",
      body: "Every lecture, reading, and thought filed under a subject that already knows where it belongs.",
    },
    {
      no: "370.1",
      title: "Course Index",
      body: "A living table of contents for whatever you're studying, cross-referenced as you go.",
    },
    {
      no: "501.9",
      title: "Study Exchange",
      body: "Trade summaries and solved problems with people cataloging the same subject as you.",
    },
  ];

  return (
    <div className="acadex-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .acadex-root {
          --ink: #1B2E28;
          --panel: #14211D;
          --chalk: #EDEAE0;
          --gold: #C9A227;
          --crimson: #A63D40;
          --sage: #8CA98F;
          min-height: 100vh;
          width: 100%;
          background:
            repeating-linear-gradient(
              180deg,
              rgba(237,234,224,0.035) 0px,
              rgba(237,234,224,0.035) 1px,
              transparent 1px,
              transparent 34px
            ),
            var(--ink);
          color: var(--chalk);
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 64px 20px 40px;
          box-sizing: border-box;
        }

        .acadex-drawers {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.5;
        }
        .acadex-drawer-row {
          position: absolute;
          left: -5%;
          width: 110%;
          height: 46px;
          border-bottom: 1px solid rgba(201,162,39,0.08);
        }

        .acadex-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 18px;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .acadex-eyebrow::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--crimson);
          box-shadow: 0 0 0 3px rgba(166,61,64,0.2);
        }

        .acadex-card {
          --rx: 0deg;
          --ry: 0deg;
          z-index: 2;
          width: min(560px, 92vw);
          background: #F4F1E6;
          color: var(--ink);
          border-radius: 3px;
          padding: 38px 36px 44px;
          position: relative;
          transform: rotate(-1.4deg) perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
          transition: transform 0.15s ease-out;
          box-shadow:
            0 2px 0 rgba(0,0,0,0.06),
            0 24px 48px rgba(0,0,0,0.35),
            0 6px 16px rgba(0,0,0,0.25);
          border: 1px solid rgba(27,46,40,0.12);
        }
        .acadex-card::before {
          content: "";
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: 34px;
          height: 8px;
          border-radius: 4px;
          background: rgba(27,46,40,0.15);
        }
        .acadex-card::after {
          content: "";
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(27,46,40,0.14);
          pointer-events: none;
        }

        .acadex-callno {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          letter-spacing: 0.05em;
          color: rgba(27,46,40,0.55);
          margin: 16px 0 22px;
          border-bottom: 1px dashed rgba(27,46,40,0.25);
          padding-bottom: 14px;
        }

        .acadex-wordmark {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(44px, 8vw, 68px);
          letter-spacing: -0.01em;
          line-height: 0.95;
          margin: 0 0 14px;
        }

        .acadex-tagline {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 500;
          font-size: 19px;
          color: rgba(27,46,40,0.78);
          margin: 0 0 22px;
          max-width: 40ch;
        }

        .acadex-desc {
          font-size: 14.5px;
          line-height: 1.65;
          color: rgba(27,46,40,0.68);
          max-width: 44ch;
          margin: 0;
        }

        .acadex-stamp {
          position: absolute;
          right: 26px;
          bottom: 30px;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--crimson);
          border: 2.5px solid var(--crimson);
          padding: 7px 14px;
          border-radius: 4px;
          transform: rotate(-9deg) scale(2.4);
          opacity: 0;
          mix-blend-mode: multiply;
          transition: transform 0.42s cubic-bezier(.2,1.4,.4,1), opacity 0.25s ease;
        }
        .acadex-stamp.is-stamped {
          opacity: 0.88;
          transform: rotate(-9deg) scale(1);
        }
        .acadex-stamp::before {
          content: "";
          position: absolute;
          inset: 3px;
          border: 1px solid var(--crimson);
          border-radius: 2px;
        }

        .acadex-form-wrap {
          z-index: 2;
          margin-top: 40px;
          width: min(480px, 92vw);
          text-align: center;
        }
        .acadex-form-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--sage);
          margin-bottom: 12px;
        }
        .acadex-form {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .acadex-input {
          flex: 1 1 240px;
          background: rgba(237,234,224,0.06);
          border: 1px solid rgba(237,234,224,0.28);
          color: var(--chalk);
          font-family: 'Inter', sans-serif;
          font-size: 14.5px;
          padding: 13px 16px;
          border-radius: 3px;
          outline: none;
          transition: border-color 0.2s;
        }
        .acadex-input::placeholder { color: rgba(237,234,224,0.4); }
        .acadex-input:focus {
          border-color: var(--gold);
        }
        .acadex-submit {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--gold);
          color: var(--ink);
          border: none;
          padding: 13px 20px;
          border-radius: 3px;
          cursor: pointer;
          font-weight: 500;
          transition: filter 0.15s, transform 0.15s;
        }
        .acadex-submit:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .acadex-submit:focus-visible, .acadex-input:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 2px;
        }
        .acadex-filed {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: var(--sage);
          letter-spacing: 0.05em;
        }

        .acadex-entries {
          z-index: 2;
          margin-top: 72px;
          width: min(920px, 94vw);
        }
        .acadex-entries-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--sage);
          text-align: center;
          margin-bottom: 26px;
        }
        .acadex-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        @media (max-width: 760px) {
          .acadex-grid { grid-template-columns: 1fr; }
        }
        .acadex-entry {
          background: var(--panel);
          border: 1px solid rgba(201,162,39,0.16);
          border-radius: 3px;
          padding: 22px 20px 24px;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .acadex-entry:hover {
          transform: translateY(-3px);
          border-color: rgba(201,162,39,0.4);
        }
        .acadex-entry-no {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: var(--gold);
          letter-spacing: 0.05em;
          margin-bottom: 10px;
        }
        .acadex-entry-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 19px;
          margin: 0 0 8px;
        }
        .acadex-entry-body {
          font-size: 13.5px;
          line-height: 1.6;
          color: rgba(237,234,224,0.62);
          margin: 0;
        }

        .acadex-footer {
          z-index: 2;
          margin-top: 64px;
          width: min(920px, 94vw);
          border-top: 1px solid rgba(237,234,224,0.14);
          padding-top: 18px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: rgba(237,234,224,0.4);
          text-transform: uppercase;
        }

        @media (prefers-reduced-motion: reduce) {
          .acadex-card, .acadex-stamp, .acadex-entry, .acadex-submit { transition: none !important; }
        }
      `}</style>

      <div className="acadex-drawers" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <div className="acadex-drawer-row" key={i} style={{ top: `${i * 46}px` }} />
        ))}
      </div>

      <div className="acadex-eyebrow">Now Cataloging</div>

      <div
        className="acadex-card"
        ref={cardRef}
        onMouseMove={handleTilt}
        onMouseLeave={resetTilt}
      >
        <div className="acadex-callno">LC 428.6 .A24 2026 &nbsp;·&nbsp; ACC. NO. 000001</div>
        <h1 className="acadex-wordmark">Acadex</h1>
        <p className="acadex-tagline">On the way</p>
        <p className="acadex-desc">
          Filling gap between school and parents
        </p>
        <div className={`acadex-stamp ${stamped ? "is-stamped" : ""}`}>
          Coming Soon
        </div>
      </div>

      

      <div className="acadex-footer">
        <span>Acadex — Est. 2026</span>
        <span>All Entries Pending Classification</span>
      </div>
    </div>
  );
}
