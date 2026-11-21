import { useState, useEffect, useMemo } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../context/AppContext';
import { normaliseCode, safeStudentId } from '../utils/helpers';
import { getPreTest } from '../data/preTest';

// PreTestScreen — five concept questions, before the zoo.
//
// ⚠️ TRACKA TREK ONLY, AND IT GETS THAT FOR FREE. App.jsx short-circuits every other programme
//    by sessionType BEFORE the screen switch, so a case in that switch can only ever be reached
//    by a Tracka Trek student. 🚫 Do not "also" gate this inside ZooSnooz or Evolve — they have
//    their own shape and five abstract questions would be the wrong way to start either.
//
// ⚠️ No timer, and no skip — both Cameron's call. A clock measures who panics, and a baseline
//    with holes in it cannot be compared to anything afterwards.

const PT_CSS = `
.pt-root {
  --pt-bg: #0A2F1F;
  --pt-card: #fff;
  --pt-ink: #0A2F1F;
  position: fixed; inset: 0; background: var(--pt-bg); color: #fff;
  display: flex; flex-direction: column;
  padding: calc(1rem + env(safe-area-inset-top, 0px)) 1rem calc(1rem + env(safe-area-inset-bottom, 0px));
  font-family: inherit; overflow-y: auto;
}
.pt-top { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
.pt-count { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.6); }
.pt-dots { display: flex; gap: 0.3rem; }
.pt-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(255,255,255,0.22); }
.pt-dot.is-done { background: #4ADE80; }
.pt-dot.is-now { background: #fff; }

.pt-q {
  flex-shrink: 0; background: var(--pt-card); color: var(--pt-ink); border-radius: 16px;
  padding: 1.4rem 1.2rem; margin: 1.1rem 0; text-align: center;
  font-size: clamp(1.05rem, 4.6vw, 1.5rem); font-weight: 700; line-height: 1.3;
}
.pt-concept { font-size: 0.62rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #6B736D; display: block; margin-bottom: 0.5rem; }

/* ⚠️ Four tiles, two columns, ALWAYS — including on the narrowest phone. A single column
   turns a glanceable grid into a scrolling list and loses the whole point of the shape. */
/* ⚠️ flex: 1 0 auto, not flex: 1. At the question's own type size a set of four sentence
   answers is taller than the screen, and a plain flex:1 clipped the bottom row off. The root
   already scrolls; the grid has to be allowed to ask for the height. */
.pt-grid { flex: 1 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
.pt-tile {
  display: flex; align-items: center; gap: 0.6rem; text-align: left;
  padding: 0.9rem; border: none; border-radius: 14px; cursor: pointer;
  /* ⚠️ THE SAME CLAMP AS .pt-q, deliberately — Cameron asked for the answers to match the
     question. An answer a student has to squint at is the one they do not pick. */
  font-family: inherit; font-size: clamp(1.05rem, 4.6vw, 1.5rem); font-weight: 700; color: #fff;
  line-height: 1.2; min-height: 92px; transition: opacity 0.18s, transform 0.12s;
}
.pt-tile:active { transform: scale(0.985); }
.pt-tile span.sh { font-size: 1.15rem; flex-shrink: 0; opacity: 0.9; }
.pt-a { background: #D7263D; }
.pt-b { background: #1368CE; }
.pt-c { background: #D89E00; }
.pt-d { background: #26890C; }
/* Answered: the right one stays lit, everything else recedes. 🚫 Never hide the wrong answer —
   a student has to see what they picked next to what was right, or the question taught nothing. */
.pt-tile.is-dim { opacity: 0.25; }
.pt-tile.is-right { outline: 4px solid #fff; outline-offset: -4px; }
.pt-tile.is-wrong { outline: 4px solid rgba(255,255,255,0.45); outline-offset: -4px; }
.pt-mark { margin-left: auto; font-size: 1.1rem; }

.pt-foot { flex-shrink: 0; min-height: 2.2rem; display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem; font-weight: 700; margin-top: 0.9rem; }

.pt-done { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; text-align: center; }
.pt-score { font-size: clamp(3rem, 16vw, 5rem); font-weight: 800; line-height: 1; }
.pt-done p { color: rgba(255,255,255,0.72); font-size: 0.95rem; line-height: 1.6; margin: 0; max-width: 20rem; }
.pt-go {
  margin-top: 1.4rem; background: #4ADE80; color: #06281A; border: none; border-radius: 999px;
  padding: 0.95rem 2.2rem; font-family: inherit; font-size: 1rem; font-weight: 800; cursor: pointer;
}
@media (min-height: 760px) { .pt-tile { min-height: 116px; } }
`;

const TILES = [
  { cls: 'pt-a', sh: '▲' },
  { cls: 'pt-b', sh: '◆' },
  { cls: 'pt-c', sh: '●' },
  { cls: 'pt-d', sh: '■' },
];

export default function PreTestScreen() {
  const { setCurrentScreen, studentName, classCode, classStage, classSubject } = useApp();
  const questions = useMemo(() => getPreTest(classSubject, classStage), [classSubject, classStage]);

  const [i, setI]           = useState(0);
  const [picked, setPicked] = useState(null);   // index of the tapped tile, or null
  const [answers, setAnswers] = useState([]);
  const [done, setDone]     = useState(false);
  const [checked, setChecked] = useState(false); // has the "already sat it" lookup finished

  // ⚠️ Sat once. A student who reloads, or whose phone drops the tab, must not be handed the
  //    same five questions again — the second attempt is not a baseline.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 🚫 getPreTest never returns an empty set, but if a subject were ever removed from the
      //    data without its classes being migrated, a student must still reach the zoo.
      if (!questions.length) { setCurrentScreen('map'); return; }
      if (!studentName || !classCode) { if (!cancelled) setChecked(true); return; }
      try {
        const snap = await getDoc(doc(db, 'classes', normaliseCode(classCode), 'students', safeStudentId(studentName)));
        if (!cancelled && snap.exists() && snap.data().preTest) { setCurrentScreen('map'); return; }
      } catch { /* offline: let them sit it, the write below is a merge */ }
      if (!cancelled) setChecked(true);
    })();
    return () => { cancelled = true; };
  }, [studentName, classCode, setCurrentScreen, questions.length]);

  const q = questions[i];
  const score = answers.filter(Boolean).length;

  const answer = (choice) => {
    if (picked !== null) return;
    const right = choice === q.correct;
    setPicked(choice);
    const next = [...answers, right];
    setAnswers(next);
    setTimeout(() => {
      setPicked(null);
      if (i + 1 < questions.length) { setI(i + 1); return; }
      setDone(true);
      save(next);
    }, 1500);
  };

  const save = async (results) => {
    if (!studentName || !classCode) return;
    try {
      // ⚠️ setDoc+merge, not updateDoc: a student whose record is missing for any reason still
      //    gets their baseline stored rather than throwing on the last question of five.
      await setDoc(doc(db, 'classes', normaliseCode(classCode), 'students', safeStudentId(studentName)), {
        preTest: {
          score: results.filter(Boolean).length,
          total: results.length,
          answers: results,
          subject: classSubject || 'science',
          stage: classStage || null,
          concepts: questions.map((x, n) => ({ concept: x.concept, correct: !!results[n] })),
          completedAt: new Date().toISOString(),
        },
      }, { merge: true });
    } catch (e) {
      // 🚫 Never block the excursion on this write. The student has answered; the zoo is waiting.
      console.warn('[preTest] could not save the baseline:', e);
    }
  };

  if (!checked) return <div className="pt-root"><style>{PT_CSS}</style></div>;

  if (done) return (
    <div className="pt-root">
      <style>{PT_CSS}</style>
      <div className="pt-done">
        <div className="pt-score">{score}<span style={{ fontSize: '0.3em', opacity: 0.6 }}> / {questions.length}</span></div>
        <p>
          {score <= 2
            ? 'You will meet the same ideas at the animals today — see how many you can work out there.'
            : score === questions.length
              ? 'Every one. See whether the animals can catch you out today.'
              : 'Good start. You will meet these same ideas at the animals today.'}
        </p>
        <button className="pt-go" onClick={() => setCurrentScreen('map')}>Start exploring</button>
      </div>
    </div>
  );

  return (
    <div className="pt-root">
      <style>{PT_CSS}</style>
      <div className="pt-top">
        <span className="pt-count">Question {i + 1} of {questions.length}</span>
        <span className="pt-dots">
          {questions.map((_, n) => (
            <span key={n} className={'pt-dot' + (n < i ? ' is-done' : n === i ? ' is-now' : '')} />
          ))}
        </span>
      </div>

      <div className="pt-q">
        <span className="pt-concept">{q.concept}</span>
        {q.q}
      </div>

      <div className="pt-grid">
        {q.options.map((opt, n) => {
          const t = TILES[n];
          const state = picked === null ? ''
            : n === q.correct ? ' is-right'
            : n === picked    ? ' is-wrong is-dim'
            :                   ' is-dim';
          return (
            <button key={n} className={'pt-tile ' + t.cls + state} onClick={() => answer(n)} disabled={picked !== null}>
              <span className="sh">{t.sh}</span>
              <span>{opt}</span>
              {picked !== null && n === q.correct && <span className="pt-mark">&#10003;</span>}
              {picked !== null && n === picked && n !== q.correct && <span className="pt-mark">&#10007;</span>}
            </button>
          );
        })}
      </div>

      <div className="pt-foot">
        {picked !== null && (picked === q.correct
          ? <span style={{ color: '#4ADE80' }}>Correct</span>
          : <span style={{ color: 'rgba(255,255,255,0.75)' }}>The answer is highlighted</span>)}
      </div>
    </div>
  );
}
