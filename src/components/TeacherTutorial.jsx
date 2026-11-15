import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../context/AppContext';

/* A live walk around the real dashboard. It was five screenshots until 2026-11-15, and
   screenshots go stale the moment the layout moves: the ones it shipped with were of a
   dashboard that no longer existed. This spotlights the actual elements on the page, so
   it can only ever show what is really there.

   ⚠️ Every step anchors on a data-tour attribute, NOT a class name. Those attributes are
   load-bearing: removing one silently drops that step (the tour skips a target it cannot
   find rather than breaking, which is the right failure but an invisible one).
   🚫 Do not anchor a step on a .td-* class. Restyling the dashboard would then move the
   spotlight somewhere else with nothing to tell you. */

const STEPS = [
  {
    id: 'welcome',
    title: 'This is your dashboard',
    text: 'A quick look around, about thirty seconds. The page is held still while we do it, and you can skip at any time.',
    cta: 'Show me around',
  },
  {
    id: 'hero',
    target: '[data-tour="hero"]',
    title: 'Where everything is up to',
    text: 'Your classes, the students who have joined them and the points your school has earned. It fills in as students work. The button on the right is where a new class starts.',
  },
  {
    id: 'classes',
    target: '[data-tour="classes"]',
    title: 'Your classes live here',
    text: 'Each class carries the code students type in on the day. Tap the code to put it on the board full screen, or tap the card to open the class: progress, student writing and marking.',
  },
  {
    id: 'plan',
    target: '[data-tour="plan"]',
    title: 'Everything for planning the visit',
    text: 'Devices, pre and post visit lessons, the zoo map, syllabus outcomes, assessment ideas and the accessibility guide, all in one panel.',
  },
  {
    id: 'wildly',
    target: '[data-tour="wildly"]',
    title: 'And the teaching beyond the visit',
    text: 'Wildly by Taronga is the classroom side: lessons, units, assessments and professional learning. Your Tracka log in works there too.',
  },
  {
    id: 'points',
    target: '[data-tour="points"]',
    title: 'Points your school keeps',
    text: 'Classes earn points towards a free class zoo visit at 300. The monthly challenge is the quickest way there.',
  },
  {
    id: 'nav',
    target: '[data-tour="nav"]',
    title: 'Jump straight to a section',
    text: 'The sidebar moves you down the page, and holds the way out to Wildly and to excursion bookings.',
  },
  {
    id: 'help',
    target: '[data-tour="help"]',
    title: 'If you get stuck',
    text: 'This answers the questions that come up most: class codes, getting a student back in on a new device, and what the marks mean.',
  },
  {
    id: 'done',
    title: 'That is the tour',
    text: 'It will not open by itself again. If you want another look, it is the first thing in the help bubble down in the corner.',
    cta: 'Get started',
  },
];

/* The help bubble asks for the tour by firing this, so the two components need nothing
   from each other. 🚫 Do not rename it on one side only. */
export const TOUR_EVENT = 'tracka:start-tour';

const TOUR_KEY = email => `teacherTour_${email}`;
const OLD_KEY  = email => `teacherTutorial_${email}`;

const TT_CSS = `
.tt-block { position: fixed; inset: 0; z-index: 3000; }
.tt-hole {
  position: fixed; z-index: 3001; pointer-events: none; border-radius: 18px;
  box-shadow: 0 0 0 9999px rgba(8,34,22,0.72);
  outline: 2px solid #E0A526; outline-offset: 3px;
}
.tt-card {
  position: fixed; z-index: 3003; width: min(382px, calc(100vw - 2rem));
  background: #fff; border: 1px solid #E2E6DF; border-radius: 18px;
  padding: 1.35rem 1.4rem 1.2rem; box-shadow: 0 26px 64px rgba(0,0,0,0.32);
  animation: ttIn 0.22s ease both;
}
@keyframes ttIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.tt-step { font-size: 0.74rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #8A9490; }
.tt-title { margin: 0.4rem 0 0.45rem; font-size: 1.18rem; font-weight: 700; color: #0A2F1F; line-height: 1.3; letter-spacing: -0.01em; }
.tt-text { margin: 0; font-size: 0.9rem; line-height: 1.6; color: #5B645E; }
.tt-dots { display: flex; gap: 5px; margin: 1.1rem 0 0.95rem; }
.tt-dot { width: 6px; height: 6px; border-radius: 999px; background: #DCE3DD; transition: width 0.2s, background 0.2s; }
.tt-dot.is-on { width: 18px; background: #1A5238; }
.tt-dot.is-past { background: #A9C3B4; }
.tt-row { display: flex; gap: 0.55rem; align-items: center; }
.tt-btn { appearance: none; font: inherit; font-weight: 700; font-size: 0.9rem; cursor: pointer; border-radius: 11px; padding: 0.65rem 1.15rem; }
.tt-next { flex: 1; border: 0; background: #1A5238; color: #fff; }
.tt-next:hover { background: #14422D; }
.tt-back { border: 1px solid #DDE3DC; background: #fff; color: #5B645E; }
.tt-back:hover { background: #F1F5F1; color: #14231B; }
.tt-skip {
  position: fixed; top: 1rem; right: 1rem; z-index: 3004;
  appearance: none; font: inherit; font-size: 0.86rem; font-weight: 700; cursor: pointer;
  padding: 0.6rem 1.1rem; border-radius: 999px;
  background: #fff; color: #14231B; border: 1px solid #fff;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}
.tt-skip:hover { background: #F1F5F1; }
.tt-block:focus-visible, .tt-btn:focus-visible, .tt-skip:focus-visible { outline: 3px solid #E0A526; outline-offset: 2px; }
@media (max-width: 640px) {
  .tt-card { padding: 1.15rem 1.15rem 1.05rem; }
  .tt-skip { top: 0.6rem; right: 0.6rem; padding: 0.5rem 0.9rem; }
}
@media (prefers-reduced-motion: reduce) {
  .tt-card { animation: none; }
}
`;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, hi));

export default function TeacherTutorial() {
  const { teacherEmail, demoMode, teacherProfile } = useApp();
  const isDemo = demoMode || teacherEmail === 'demo@zoo';

  const [dismissed, setDismissed] = useState(false);
  const [waited, setWaited] = useState(false);
  const [asked, setAsked] = useState(false);     // replayed from the help bubble
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [hole, setHole] = useState(null);
  const [pos, setPos]   = useState(null);
  const cardRef = useRef(null);

  /* ---- should it run at all ----

     ⚠️ "The first time you ever log in" is a fact about the ACCOUNT, not the laptop, so
     the record lives on the teacher document and localStorage is only a fast local copy.
     The verdict waits for that document rather than guessing: showing the tour again to
     someone who did it last term on another machine is the one failure worth avoiding. */

  const seenHere = useMemo(() => {
    if (!teacherEmail) return false;
    try {
      return localStorage.getItem(TOUR_KEY(teacherEmail)) === 'true'
          || localStorage.getItem(OLD_KEY(teacherEmail)) === 'true';
    } catch { return false; }    // storage blocked: the profile below decides
  }, [teacherEmail]);

  const verdict = !teacherEmail        ? 'hide'
    : isDemo                           ? 'show'   // the demo account always gets it, and never records it
    : seenHere                         ? 'hide'
    : teacherProfile?.tourSeen         ? 'hide'
    : teacherProfile                   ? 'show'
    :                                    'wait';

  const running = !dismissed && (asked || verdict === 'show' || (verdict === 'wait' && waited));

  /* A step whose element is not on the page is dropped rather than shown against
     nothing. Settled once, a frame after the tour starts, so it cannot renumber mid-tour.
     ⚠️ The frame is not optional: this component mounts in the SAME commit as the
     dashboard it describes, so at its first render NONE of the targets are in the
     document yet and filtering there leaves only the two steps that have no target. */
  const steps = useMemo(
    () => (ready ? STEPS.filter(s => !s.target || document.querySelector(s.target)) : STEPS),
    [ready],
  );

  const current = steps[step];
  const total = steps.length;
  const isLast = step === total - 1;

  const markSeen = useCallback(() => {
    if (isDemo || !teacherEmail) return;
    if (teacherProfile?.tourSeen) return;        // a replay has nothing new to record
    try { localStorage.setItem(TOUR_KEY(teacherEmail), 'true'); } catch { /* storage blocked: the profile flag below is the real record */ }
    // The account is what "first time you ever log in" means, so it is stored on the
    // teacher, not the device. A failed write only costs one repeat on another machine.
    setDoc(doc(db, 'teachers', teacherEmail), { tourSeen: true, tourSeenAt: new Date().toISOString() }, { merge: true })
      .catch(err => console.warn('[tutorial] could not record the tour as seen:', err?.code || err));
  }, [isDemo, teacherEmail, teacherProfile]);

  useEffect(() => {
    const onAsk = () => { setStep(0); setDismissed(false); setAsked(true); };
    window.addEventListener(TOUR_EVENT, onAsk);
    return () => window.removeEventListener(TOUR_EVENT, onAsk);
  }, []);

  // Someone who finished the old screenshot tutorial on this device has their flag
  // carried up to their account, so a second machine does not start the tour again.
  useEffect(() => {
    if (seenHere && teacherProfile && !teacherProfile.tourSeen) markSeen();
  }, [seenHere, teacherProfile, markSeen]);

  useEffect(() => {
    if (!running) return;
    const r = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(r);
  }, [running]);

  // If the teacher document never arrives (it does not exist, or there is no reception)
  // run anyway after a moment. Never showing it at all is the worse of the two failures,
  // and localStorage still stops it repeating on this device.
  useEffect(() => {
    if (verdict !== 'wait') return;
    const t = setTimeout(() => setWaited(true), 4000);
    return () => clearTimeout(t);
  }, [verdict]);


  /* ---- bring the target into view when the step changes ---- */

  useEffect(() => {
    if (!running || !current?.target) return;
    const el = document.querySelector(current.target);
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Park a big target at the top rather than centring it, so the card has somewhere
    // to sit that is not on top of the thing it is describing.
    // Centring only works for something small: a centred target leaves half a screen
    // underneath, and the card needs most of that. Anything bigger goes to the top.
    const need = (cardRef.current?.offsetHeight || 280) + 45;
    el.scrollIntoView({ block: r.height + need * 2 <= window.innerHeight ? 'center' : 'start', behavior: 'smooth' });
  }, [running, step, current]);

  /* ---- keep the hole and the card glued to the element, every frame ----
     A frame-by-frame read is what lets the spotlight ride a smooth scroll and survive
     the leaderboard and class counts arriving late and shifting the layout under it. */

  useEffect(() => {
    if (!running) return;
    let raf;
    const tick = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const cardW = cardRef.current?.offsetWidth  || 360;
      const cardH = cardRef.current?.offsetHeight || 220;
      const el = current?.target ? document.querySelector(current.target) : null;

      if (!el) {
        setHole(null);
        setPos({ left: Math.round((vw - cardW) / 2), top: Math.round((vh - cardH) / 2) });
      } else {
        const r = el.getBoundingClientRect();
        const pad = 8, gap = 14, edge = 12;
        let h = { left: r.left - pad, top: r.top - pad, width: r.width + pad * 2, height: r.height + pad * 2 };
        if (h.height > vh - edge * 2) { h.top = edge; h.height = vh - edge * 2; }
        if (h.width  > vw - edge * 2) { h.left = edge; h.width  = vw - edge * 2; }
        h.left = clamp(h.left, -pad, vw - 40);
        h.top  = clamp(h.top, -pad, vh - 40);

        let left, top;
        const sideRoom = h.height > vh * 0.55;
        if (sideRoom && h.left + h.width + gap + cardW <= vw - edge) {
          left = h.left + h.width + gap;
          top  = clamp(h.top + h.height / 2 - cardH / 2, edge, vh - cardH - edge);
        } else if (sideRoom && h.left - gap - cardW >= edge) {
          left = h.left - gap - cardW;
          top  = clamp(h.top + h.height / 2 - cardH / 2, edge, vh - cardH - edge);
        } else {
          left = clamp(h.left + h.width / 2 - cardW / 2, edge, Math.max(edge, vw - cardW - edge));
          let below = h.top + h.height + gap;
          const above = h.top - gap - cardH;
          if (below + cardH <= vh - edge) {
            top = below;
          } else if (above >= edge) {
            top = above;
          } else {
            // Neither end has room, so the spotlight gives some up. 🚫 The card must never
            // sit on top of the element it is pointing at: that is the whole mechanism.
            h.height = Math.max(120, vh - edge - gap - cardH - h.top);
            below = h.top + h.height + gap;
            top = Math.min(below, Math.max(edge, vh - cardH - edge));
          }
        }
        setHole(prev => same(prev, h) ? prev : round(h));
        setPos(prev => (prev && prev.left === Math.round(left) && prev.top === Math.round(top))
          ? prev : { left: Math.round(left), top: Math.round(top) });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, step, current]);

  /* ---- controls ---- */

  const finish = useCallback(() => { markSeen(); setDismissed(true); setAsked(false); }, [markSeen]);
  const next = () => (isLast ? finish() : setStep(s => s + 1));
  const back = () => setStep(s => Math.max(0, s - 1));

  useEffect(() => {
    if (!running) return;
    const onKey = e => {
      if (e.key === 'Escape')     { e.preventDefault(); finish(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setStep(s => (s >= total - 1 ? s : s + 1)); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); setStep(s => Math.max(0, s - 1)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running, total, finish]);

  if (!running || !current) return null;

  return createPortal(
    <>
      <style>{TT_CSS}</style>

      {/* Nothing underneath is clickable while the tour runs. The spotlight shows a
          teacher where a thing IS; it is not an invitation to go off and use it. */}
      <div
        className="tt-block"
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.preventDefault()}
        aria-hidden="true"
      />

      {hole && <div className="tt-hole" style={{ left: hole.left, top: hole.top, width: hole.width, height: hole.height }} />}
      {!hole && <div className="tt-hole" style={{ left: '50%', top: '50%', width: 0, height: 0, outline: 'none' }} />}

      <button className="tt-skip" onClick={finish}>Skip tutorial</button>

      <div
        ref={cardRef}
        className="tt-card"
        key={current.id}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tt-title"
        style={pos ? { left: pos.left, top: pos.top } : { left: -9999, top: 0 }}
      >
        <p className="tt-step">{step + 1} of {steps.length}</p>
        <h2 className="tt-title" id="tt-title">{current.title}</h2>
        <p className="tt-text">{current.text}</p>

        <div className="tt-dots" aria-hidden="true">
          {steps.map((s, i) => (
            <span key={s.id} className={`tt-dot${i === step ? ' is-on' : i < step ? ' is-past' : ''}`} />
          ))}
        </div>

        <div className="tt-row">
          {step > 0 && <button className="tt-btn tt-back" onClick={back}>Back</button>}
          <button className="tt-btn tt-next" onClick={next}>{current.cta || (isLast ? 'Finish' : 'Next')}</button>
        </div>
      </div>
    </>,
    document.body
  );
}

function round(h) {
  return { left: Math.round(h.left), top: Math.round(h.top), width: Math.round(h.width), height: Math.round(h.height) };
}
function same(a, b) {
  return !!a && Math.abs(a.left - b.left) < 1 && Math.abs(a.top - b.top) < 1
      && Math.abs(a.width - b.width) < 1 && Math.abs(a.height - b.height) < 1;
}
