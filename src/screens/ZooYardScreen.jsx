import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { ZOOYARD_ANIMALS, ZOOYARD_HABITAT_THEME } from '../data/zooyardAnimals';
import StudentFeedbackModal from '../components/StudentFeedbackModal';
import { doc, getDoc, setDoc, updateDoc, addDoc, collection, serverTimestamp, increment } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { normaliseCode, safeStudentId, getMinWords, getStageScaffoldTip } from '../utils/helpers';
import PhotoCapture from '../components/PhotoCapture';
import StudentGuide from '../components/StudentGuide';
import ZooYardZoo3D from '../components/ZooYardZoo3D';
import { preloadZooModel } from '../utils/zooyardModel';
import { buildObservationScore, isLowQualityResponse } from '../utils/scoring';

// PhotoCapture hands back a canvas Blob, which has no `.name` — only a File from the fallback
// picker does. Derive the extension from the MIME type instead, or every upload throws.
function photoExt(fileOrBlob) {
  const type = fileOrBlob?.type || '';
  if (type.includes('png'))  return 'png';
  if (type.includes('webp')) return 'webp';
  if (type.includes('heic')) return 'heic';
  if (fileOrBlob?.name) {
    const fromName = fileOrBlob.name.split('.').pop()?.toLowerCase();
    if (fromName && fromName.length <= 5) return fromName;
  }
  return 'jpg';
}

function HomeButton({ dark, onHome }) {
  return (
    <button onClick={onHome}
      style={{
        position:'fixed', top:'0.9rem', right:'0.9rem', zIndex:50,
        background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(7,30,20,0.08)',
        border: dark ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(7,30,20,0.15)',
        color: dark ? 'white' : '#0A2F1F',
        padding:'0.4rem 0.85rem', borderRadius:999, cursor:'pointer',
        fontSize:'0.78rem', fontWeight:700, backdropFilter:'blur(6px)',
      }}>
      🏠 Home
    </button>
  );
}

function ZyDoneScreen({ classCode, studentName, totalPoints, onDone }) {
  const [showFeedback, setShowFeedback] = useState(false);
  useState(() => { setTimeout(() => setShowFeedback(true), 1400); });
  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#071E14,#0D3322,#1A5238)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div className="animate-scale-in" style={{ textAlign:'center', maxWidth:'420px', width:'100%' }}>
        <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🌳</div>
        <h2 className="taronga-title" style={{ fontSize:'2rem', color:'white', marginBottom:'0.5rem', letterSpacing:'0.06em' }}>Your ZooYard is built.</h2>
        <p style={{ color:'#7EC89A', marginBottom:'0.5rem', fontSize:'0.95rem', fontWeight:700 }}>{totalPoints} points earned</p>
        <p style={{ color:'rgba(255,255,255,0.65)', marginBottom:'2rem', fontSize:'0.9rem', lineHeight:1.6 }}>Every habitat watched, and something built at every one. Your photos have gone to the Taronga team for approval.</p>
        <button onClick={onDone}
          style={{ width:'100%', padding:'0.9rem', background:'linear-gradient(135deg,#2E7D55,#1A5238)', border:'none', borderRadius:'var(--t-r-pill)', color:'white', fontSize:'1rem', fontWeight:800, cursor:'pointer', letterSpacing:'0.06em', textTransform:'uppercase', boxShadow:'0 6px 20px rgba(46,125,85,0.5)' }}>
          Back to Home
        </button>
      </div>
      {showFeedback && (
        <StudentFeedbackModal classCode={classCode} studentName={studentName} sessionType="zooyard" onDone={onDone} />
      )}
    </div>
  );
}

// A looping video behind a writing task is lovely for most students and genuinely unpleasant for
// some. Respect the device setting rather than assuming.
const reduceMotion = typeof window !== 'undefined'
  && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// ── First-run instructions, delivered by Dr. Cam ──────────────────────────────────────────────
// ZooYard asks something genuinely unusual: go outside, stand in your own playground, and treat
// it as habitat. Without being told that up front, a student sits at a desk waiting for the app
// to do something. So this runs ONCE, before the habitat picker, and its whole job is to get
// them out the door knowing what the loop is.
//
// Deliberately four steps and no more. Large type, one idea per line, no paragraph a Year 3
// has to decode, and nothing so simplified that a Year 10 feels talked down to.
const ZY_STEPS = [
  { icon: '🚶', title: 'Go outside',    body: 'I will send you to a real spot in your schoolyard. Photograph it to unlock the habitat.' },
  { icon: '👀', title: 'Watch, then measure', body: 'Two minutes of just looking, then you take one real measurement.' },
  { icon: '🌱', title: 'Build something', body: 'Fix a bit of what your measurement just showed you.' },
  { icon: '🏅', title: 'Write it up',   body: 'Explain the link, earn the badge. Three habitats to collect.' },
];

// ⚠️ Worded to build anticipation, NOT to reframe the habitats as a warm-up for something
// later. Every habitat now ends in building something, so there is no final task to tease:
// this says what the building IS and what it feels like, and leaves the rest to land in the
// moment. Do not turn it back into "finish all three and X unlocks" — that framing is a quick
// way to get three habitats done badly.
const ZY_TEASER = {
  icon: '🌱',
  title: 'This one is real',
  body: 'You will not just be writing about wildlife. At every habitat you build something for it, right here at your school, and photograph what you made.',
};

function ZooYardIntro({ onStart }) {
  // ⚠️ The whole point of this effect. A student spends ten or twenty seconds reading the four
  // steps below; starting the 6MB zoo download now means it is usually cached by the time they
  // reach the map. Without it, thirty students hit the download simultaneously at the exact
  // moment the lesson starts. Fire and forget: the map joins this same request rather than
  // starting a second one, and shows its loading screen only if this has not finished.
  useEffect(() => { preloadZooModel(); }, []);

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(165deg,#0B2415,#14472C,#1F6B42)', overflowY:'auto', fontFamily:'var(--t-font)' }}>
      <div style={{ maxWidth:560, margin:'0 auto', padding:'2rem 1.25rem 2.5rem', minHeight:'100%', display:'flex', flexDirection:'column', justifyContent:'center' }}>

        <div className="animate-scale-in" style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <img src="/images/guide-character.png" alt="Dr. Cam"
            style={{ width:120, height:120, borderRadius:'50%', objectFit:'cover', objectPosition:'50% 12%', border:'4px solid rgba(255,255,255,0.85)', boxShadow:'0 10px 30px rgba(0,0,0,0.4)' }}
            onError={e => { e.target.style.display = 'none'; }} />
          <h1 className="taronga-title" style={{ color:'white', fontSize:'clamp(1.9rem,7vw,2.6rem)', margin:'0.9rem 0 0.4rem', lineHeight:1.1 }}>
            Welcome to ZooYard
          </h1>
          <p style={{ color:'rgba(255,255,255,0.88)', fontSize:'clamp(1.05rem,3.4vw,1.2rem)', lineHeight:1.5, margin:0, textWrap:'balance' }}>
            I am Dr. Cam. Your schoolyard is about to become three animal habitats.
          </p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'0.7rem', marginBottom:'1rem' }}>
          {ZY_STEPS.map((st, i) => (
            <div key={st.title} className="animate-fade-in-up"
              style={{ display:'flex', alignItems:'center', gap:'1rem', background:'rgba(255,255,255,0.97)', borderRadius:16, padding:'1rem 1.1rem', animationDelay:`${0.12 * i}s`, boxShadow:'0 6px 20px rgba(0,0,0,0.2)' }}>
              <span style={{ fontSize:'2.1rem', lineHeight:1, flexShrink:0 }} aria-hidden="true">{st.icon}</span>
              <div style={{ minWidth:0 }}>
                <div style={{ fontWeight:800, color:'#0A2F1F', fontSize:'clamp(1.05rem,3.4vw,1.2rem)', lineHeight:1.25 }}>{st.title}</div>
                <div style={{ color:'#3A4A3F', fontSize:'clamp(0.92rem,2.8vw,1rem)', lineHeight:1.45, marginTop:'0.15rem' }}>{st.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Visually set apart from the four steps: this is not another instruction, it is what
            the day is actually for. */}
        <div className="animate-fade-in-up" style={{ display:'flex', alignItems:'flex-start', gap:'1rem', background:'linear-gradient(135deg, rgba(232,179,60,0.18), rgba(232,179,60,0.08))', border:'1.5px solid rgba(232,179,60,0.5)', borderRadius:16, padding:'1rem 1.1rem', marginBottom:'1.6rem', animationDelay:'0.55s' }}>
          <span style={{ fontSize:'2.1rem', lineHeight:1, flexShrink:0 }} aria-hidden="true">{ZY_TEASER.icon}</span>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:800, color:'#FFD98A', fontSize:'clamp(1.05rem,3.4vw,1.2rem)', lineHeight:1.25 }}>{ZY_TEASER.title}</div>
            <div style={{ color:'rgba(255,255,255,0.92)', fontSize:'clamp(0.92rem,2.8vw,1rem)', lineHeight:1.5, marginTop:'0.2rem' }}>{ZY_TEASER.body}</div>
          </div>
        </div>

        <button onClick={onStart}
          style={{ width:'100%', padding:'1.1rem', borderRadius:999, border:'none', background:'linear-gradient(135deg,#4A9E6B,#2E7D55)', color:'white', fontSize:'1.1rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 10px 28px rgba(46,125,85,0.55)' }}>
          Let us go
        </button>
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.65)', fontSize:'0.82rem', marginTop:'0.9rem', lineHeight:1.5 }}>
          Stuck at any point? Tap me in the corner and I will help.
        </p>
      </div>
    </div>
  );
}

// ── Feedback on the written response ──────────────────────────────────────────────────────────
// Same shape as the daily BadgeScreen: pick the student's strongest domain for "what you did
// well" and their weakest for "next time". The wording is ZooYard's own rather than reused,
// because the daily messages are about watching an animal behave ("write down exactly what the
// animal is doing") and here the student is describing a PLACE and arguing what an animal would
// need from it. The generic set would have been quietly wrong on every habitat.
//
// Two tiers rather than one. ZooYard runs Stage 2 to Stage 5, and "finish with a full stop" is
// the right nudge for a Year 3 and slightly insulting to a Year 10.
const ZY_FEEDBACK = {
  junior: {
    behaviour: {
      well: 'You described your spot really clearly. Great looking!',
      next: 'Go back and look at your spot again. Write down more of what you can see.',
    },
    detail: {
      well: 'You worked out what the animal would need from a place like yours!',
      next: 'Try saying WHY it matters. What would the animal use it for?',
    },
    writing: {
      well: 'Your sentences were clear and easy to read!',
      next: 'Start with a capital letter and finish with a full stop.',
    },
  },
  senior: {
    behaviour: {
      well: 'Precise description of the spot you actually observed.',
      next: 'Add more specific detail about what is really there: size, cover, what surrounds it.',
    },
    detail: {
      well: 'You connected your spot to what the animal needs to survive.',
      next: 'Explain the link. What does this spot provide, and why does the animal depend on it?',
    },
    writing: {
      well: 'Clearly structured and easy to follow.',
      next: 'Tighten your sentences so each one carries one clear idea.',
    },
  },
};

// Shown instead of a correction when even the weakest domain is already strong. Telling a
// student who scored 5/4/5 to fix their weakest area reads as though the app did not notice
// how well they did, which is a quick way to lose the ones who are trying hardest.
const ZY_STRETCH = {
  junior: 'You are doing really well. At your next habitat, see if you can spot one thing most people would miss.',
  senior: 'Strong across all three. At your next habitat, push for the detail most people would walk straight past.',
};

// Display labels only. The stored field is still `behaviour`, but a student here is describing a
// place, not an animal's behaviour, so calling the column Behaviour on screen made no sense.
const ZY_DOMAINS = [
  { key: 'behaviour', label: 'Observation' },
  { key: 'detail',    label: 'Detail' },
  { key: 'writing',   label: 'Writing' },
];

function zyFeedback(scores, stage) {
  const set = (stage || 4) <= 3 ? ZY_FEEDBACK.junior : ZY_FEEDBACK.senior;
  const ranked = [...ZY_DOMAINS].sort((a, b) => (scores[b.key] ?? 0) - (scores[a.key] ?? 0));
  const best = ranked[0], worst = ranked[ranked.length - 1];
  const junior = (stage || 4) <= 3;
  return {
    // Below 3 there is nothing honest to praise about that domain, so encourage the attempt
    // instead of inventing a strength they did not show.
    well: (scores[best.key] ?? 0) >= 3 ? set[best.key].well : 'You gave it a go. Have another look at your spot and try the next habitat.',
    next: (scores[worst.key] ?? 0) >= 4 ? (junior ? ZY_STRETCH.junior : ZY_STRETCH.senior) : set[worst.key].next,
  };
}

const zyIntroKey = (code, sid) => `zooyardIntroSeen_${code}_${sid}`;

export default function ZooYardScreen() {
  const { zyScreen, setZyScreen, setSessionType, setCurrentScreen, studentName, classCode, classStage, clearStudentSession } = useApp();
  const { setCompletionCardDismissed } = useStudent();

  const [zyAnimal, setZyAnimal] = useState(null);       // currently open animal object
  const [zyPhase,  setZyPhase]  = useState('attest');    // video | activity | observe | action | written | badge
  const [zyCompleted, setZyCompleted] = useState({});    // { [animalId]: { points, quizCorrect } }
  const [badgeReveal, setBadgeReveal] = useState(null);  // { animal, points, quizCorrect, behaviour, detail, writing }

  const [mcqAnswer,   setMcqAnswer]   = useState(null);
  const [mcqCorrect,  setMcqCorrect]  = useState(null);
  const [mcqRevealed, setMcqRevealed] = useState(false);

  const [obsText, setObsText] = useState('');
  const [obsError, setObsError] = useState('');
  const [hintsOpen, setHintsOpen] = useState(false);
  const [savingObs, setSavingObs] = useState(false);

  const [hydrating, setHydrating] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [habitatPhotos, setHabitatPhotos] = useState({});  // { [animalId]: downloadURL }
  const [attestPreview, setAttestPreview] = useState(null);
  const [attestUploading, setAttestUploading] = useState(false);
  const [attestError, setAttestError] = useState('');
  const [unlockAnimal, setUnlockAnimal] = useState(null);   // habitat being unlocked on the map

  const [csFile, setCsFile] = useState(null);
  const [csPreview, setCsPreview] = useState(null);
  const [csUploading, setCsUploading] = useState(false);
  const [csError, setCsError] = useState('');
  const [actionPhotoUrl, setActionPhotoUrl] = useState(null);  // uploaded evidence for THIS habitat
  const [fallbackOpen, setFallbackOpen] = useState(false);     // "Cannot do that here?" disclosure
  const [stepsOpen, setStepsOpen] = useState(false);           // "How do I do it?" disclosure

  // The quiet observation window. Timestamp-based, never a tick counter: a school tablet that
  // locks or a tab pushed to the background stops firing intervals, and a counter would sit
  // frozen at whatever it reached, either finishing early or never finishing at all.
  const [observeEndsAt, setObserveEndsAt] = useState(null);
  const [observeNow, setObserveNow] = useState(0);
  const observeDone = observeEndsAt !== null && observeNow >= observeEndsAt;
  const observeLeft = observeEndsAt === null ? 0 : Math.max(0, Math.ceil((observeEndsAt - observeNow) / 1000));

  useEffect(() => {
    if (observeEndsAt === null) return;
    const t = setInterval(() => setObserveNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [observeEndsAt]);

  const allDone = ZOOYARD_ANIMALS.every(a => zyCompleted[a.id]);
  const totalPoints = Object.values(zyCompleted).reduce((s, c) => s + (c.points || 0), 0);

  // Rehydrate from Firestore on mount. Without this a refresh, a locked iPad or a lesson
  // split across periods resets the picker to "Tap to begin", re-locks Habitat Hero, and
  // lets a student overwrite a habitat they had already finished.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!studentName || !classCode) { setHydrating(false); return; }
      try {
        const snap = await getDoc(doc(db, 'classes', normaliseCode(classCode), 'students', safeStudentId(studentName)));
        const zy = snap.exists() ? (snap.data().zooyard || {}) : {};
        if (cancelled) return;
        const done = {}, photos = {};
        ZOOYARD_ANIMALS.forEach(a => {
          const d = zy[a.id];
          if (!d) return;
          // Outside the completed check on purpose: the photo is the unlock, so a student who
          // attested but has not finished the habitat must still come back to an open padlock.
          if (d.habitatPhotoUrl) photos[a.id] = d.habitatPhotoUrl;
          if (!d.completed) return;
          done[a.id] = {
            points: d.points || 0, quizCorrect: !!d.quizCorrect,
            behaviour: d.behaviour ?? 0, detail: d.detail ?? 0, writing: d.writing ?? 0,
          };
        });
        setZyCompleted(done);
        setHabitatPhotos(photos);
        if (zy.sessionCompleted) setZyScreen('done');
        // Gated on BOTH: never shown twice, and never shown to someone already part way
        // through, so a mid-session reload does not drop them back on the welcome screen.
        else if (!Object.keys(done).length) {
          let seen = false;
          try { seen = !!localStorage.getItem(zyIntroKey(normaliseCode(classCode), safeStudentId(studentName))); } catch { /* private mode */ }
          if (!seen) setShowIntro(true);
        }
      } catch (e) {
        console.warn('ZooYard resume failed:', e);
      } finally {
        if (!cancelled) setHydrating(false);
      }
    })();
    return () => { cancelled = true; };
  }, [classCode, studentName, setZyScreen]);

  // Entering a habitat always starts at the video now. Proving where you are happens on the
  // map, in the unlock sheet, so by the time this runs the padlock is already open.
  function openAnimal(animal) {
    if (zyCompleted[animal.id]) return;
    setZyAnimal(animal);
    setZyPhase('video');
    setMcqAnswer(null); setMcqCorrect(null); setMcqRevealed(false);
    setObsText(''); setObsError('');
    setHintsOpen(false);
    setObserveEndsAt(null); setObserveNow(0);
    setCsFile(null); setCsPreview(null); setCsError(''); setActionPhotoUrl(null); setFallbackOpen(false); setStepsOpen(false);
  }

  // What tapping a marker does, which depends entirely on whether it is locked.
  function tapMarker(animal) {
    if (zyCompleted[animal.id]) return;
    if (habitatPhotos[animal.id]) { openAnimal(animal); return; }   // already proved it
    setAttestPreview(null); setAttestError('');
    setUnlockAnimal(animal);                                        // stay on the map
  }

  function closeUnlock() {
    setUnlockAnimal(null);
    setAttestPreview(null); setAttestError('');
  }

  function backToHabitats() {
    setZyAnimal(null);
    setZyPhase('attest');
  }

  function goHome() {
    if (!window.confirm('Leave ZooYard and go home? Anything not yet submitted will be lost.')) return;
    clearStudentSession();
    setCurrentScreen('home');
    setSessionType('standard');
  }

  function selectMcq(idx) {
    if (mcqRevealed) return;
    setMcqAnswer(idx);
    setMcqCorrect(idx === zyAnimal.activity.correct);
    setMcqRevealed(true);
  }

  async function submitWritten() {
    if (!zyAnimal || savingObs) return;

    // The scorers already floor gibberish to 1/1/1, but silently — a student could submit
    // keyboard mash and still collect a badge plus the 20-point quiz bonus with no feedback.
    if (isLowQualityResponse(obsText)) {
      setObsError('That does not look like a full answer yet. Write a sentence about what you can actually see - tap "Need a hint?" for sentence starters.');
      setHintsOpen(true);
      return;
    }
    setObsError('');
    setSavingObs(true);
    try {
      const scoreResult = buildObservationScore(obsText, zyAnimal.id, classStage, 'science');
      const observationPoints = Math.round(((scoreResult.behaviour + scoreResult.detail + scoreResult.writing) / 15) * 100);
      const quizPoints = mcqCorrect ? 20 : 0;
      const points = observationPoints + quizPoints;

      const badgeData = {
        points, quizCorrect: !!mcqCorrect,
        behaviour: scoreResult.behaviour, detail: scoreResult.detail, writing: scoreResult.writing,
        observation: obsText,
      };
      const photoUrl = habitatPhotos[zyAnimal.id];
      if (photoUrl) badgeData.habitatPhotoUrl = photoUrl;
      if (actionPhotoUrl) badgeData.actionPhotoUrl = actionPhotoUrl;

      if (studentName && classCode) {
        const code = normaliseCode(classCode);
        const sid  = safeStudentId(studentName);
        try {
          // updateDoc (not setDoc+merge) so the dotted key nests under zooyard.{animalId}
          // rather than becoming a literal field name containing dots.
          // totalPoints is written on every habitat (not just at Habitat Hero submit) so the
          // field is trustworthy for a student who never finishes the citizen science task.
          const runningTotal = ZOOYARD_ANIMALS.reduce((sum, a) => (
            sum + (a.id === zyAnimal.id ? points : (zyCompleted[a.id]?.points || 0))
          ), 0);
          // ⚠️ Individual dotted fields, NOT a whole zooyard.{id} object. Assigning the object
          // replaces the map, which would delete habitatPhotoUrl any time the local copy had
          // been lost. That used to be cosmetic; now the photo IS the unlock, so wiping it
          // would re-lock a habitat the student had already earned their way into.
          await updateDoc(doc(db, 'classes', code, 'students', sid), {
            ...Object.fromEntries(Object.entries({ completed: true, ...badgeData })
              .map(([k, v]) => [`zooyard.${zyAnimal.id}.${k}`, v])),
            [`zooyard.${zyAnimal.id}.updatedAt`]: serverTimestamp(),
            'zooyard.totalPoints': runningTotal,
          });
        } catch (e) { console.warn('ZooYard badge write failed:', e); }

        // ⚠️ `habitatObservations` used to be written here — a de-identified, flat, cross-school
        // copy of the measurement. It went when the measurement did (2026-10-01): there is no
        // longer a number to aggregate. The Firestore rule was removed with it. If a count ever
        // comes back on the watch screen, this is where it would be written again.
      }

      setZyCompleted(prev => ({ ...prev, [zyAnimal.id]: { points, quizCorrect: !!mcqCorrect, behaviour: scoreResult.behaviour, detail: scoreResult.detail, writing: scoreResult.writing } }));
      setBadgeReveal({ animal: zyAnimal, ...badgeData, overall: scoreResult.overallFeedback });
      setZyPhase('badge');
    } finally {
      setSavingObs(false);
    }
  }

  // Upload the moment the photo is taken, rather than waiting for "Yes, I'm ready". The student
  // watches it save and only then gets the button, so nobody discovers a failed upload at the
  // point they thought they were moving on.
  async function onAttestPhoto(blob, dataUrl, animal) {
    setAttestPreview(dataUrl);
    setAttestError('');
    setAttestUploading(true);
    try {
      const code = normaliseCode(classCode);
      const sid  = safeStudentId(studentName);
      const ext  = photoExt(blob);
      const path = `zooyardHabitats/${code}/${sid}-${animal.id}-${Date.now()}.${ext}`;
      const snap = await uploadBytes(storageRef(storage, path), blob, { contentType: blob.type || 'image/jpeg' });
      const url  = await getDownloadURL(snap.ref);
      setHabitatPhotos(prev => ({ ...prev, [animal.id]: url }));

      // ⚠️ This used to live only in React state, written to Firestore at badge time. Now the
      // photo is what UNLOCKS the habitat on the map, so it has to persist the moment it is
      // taken: a student who photographs their spot and then reloads must not find the padlock
      // back on. Individual dotted fields, never a whole zooyard.{id} object, or this would
      // wipe anything written alongside it.
      try {
        await updateDoc(doc(db, 'classes', code, 'students', sid), {
          [`zooyard.${animal.id}.habitatPhotoUrl`]: url,
          [`zooyard.${animal.id}.unlockedAt`]: new Date().toISOString(),
        });
      } catch {
        // First write for this student: the nested map does not exist yet.
        try {
          await setDoc(doc(db, 'classes', code, 'students', sid),
            { name: studentName, classCode: code,
              zooyard: { [animal.id]: { habitatPhotoUrl: url, unlockedAt: new Date().toISOString() } } },
            { merge: true });
        } catch (e2) { console.warn('ZooYard unlock write failed:', e2); }
      }
    } catch (err) {
      console.warn('ZooYard habitat photo upload failed:', err);
      setAttestError('That photo did not save. Check your connection and take it again.');
      setAttestPreview(null);
    } finally {
      setAttestUploading(false);
    }
  }

  function retakeAttestPhoto(animal) {
    setAttestPreview(null);
    setAttestError('');
    setHabitatPhotos(prev => {
      const next = { ...prev };
      delete next[animal.id];
      return next;
    });
  }


  function onCsPhoto(blob, dataUrl) {
    setCsFile(blob);
    setCsPreview(dataUrl);
    setCsError('');
  }

  // One submission PER HABITAT, not one at the end of the session. The standalone Habitat Hero
  // task was absorbed into every animal: the student measures a deficit, then builds something
  // that addresses that specific deficit, then writes about the link. The moderation plumbing
  // (citizenScienceSubmissions, the staff approve/deny tab, the teacher panel on class details)
  // is unchanged and simply carries three times the traffic — `taskId` now identifies which
  // habitat's task it was rather than always being 'habitat-hero'.
  async function submitHabitatAction() {
    if (!csFile || csUploading || !zyAnimal) return;
    const task = zyAnimal.citizenScience;
    setCsUploading(true);
    setCsError('');
    try {
      const code = normaliseCode(classCode);
      const sid  = safeStudentId(studentName);

      const classSnap = await getDoc(doc(db, 'classes', code));
      const classData = classSnap.exists() ? classSnap.data() : {};
      const teacherEmail = classData.teacherEmail || '';
      const schoolName   = classData.schoolName || '';

      const ext  = photoExt(csFile);
      const path = `citizenScienceEvidence/${code}/${sid}-${zyAnimal.id}-${Date.now()}.${ext}`;
      const snap = await uploadBytes(storageRef(storage, path), csFile, { contentType: csFile.type || 'image/jpeg' });
      const photoUrl = await getDownloadURL(snap.ref);

      await addDoc(collection(db, 'citizenScienceSubmissions'), {
        classCode: code, studentId: sid, studentName, teacherEmail, schoolName,
        program: 'zooyard', taskId: task.id, habitatId: zyAnimal.id, habitatTitle: task.title,
        photoUrl,
        status: 'pending',
        submittedAt: serverTimestamp(),
      });

      try {
        await updateDoc(doc(db, 'classes', code, 'students', sid), {
          [`zooyard.${zyAnimal.id}.action`]: { taskId: task.id, status: 'pending', photoUrl, submittedAt: new Date().toISOString() },
        });
      } catch (e) { console.warn('ZooYard action write failed:', e); }

      setActionPhotoUrl(photoUrl);
      setZyPhase('written');
    } catch (e) {
      console.error('Habitat action submit failed:', e);
      setCsError('Something went wrong uploading your photo. Please try again.');
    } finally {
      setCsUploading(false);
    }
  }

  // Ends the session once all three habitats are done. The +10 school leaderboard bonus that
  // used to ride on the single Habitat Hero submit moves here, so it stays once per student
  // rather than becoming three times as generous.
  async function finishSession() {
    if (!studentName || !classCode) { setZyScreen('done'); return; }
    const code = normaliseCode(classCode);
    const sid  = safeStudentId(studentName);
    try {
      await updateDoc(doc(db, 'classes', code, 'students', sid), {
        'zooyard.sessionCompleted': true,
        'zooyard.totalPoints': totalPoints,
        'zooyard.completedAt': serverTimestamp(),
      });
      const classSnap = await getDoc(doc(db, 'classes', code));
      const schoolName = classSnap.exists() ? (classSnap.data().schoolName || '') : '';
      if (schoolName) {
        const schoolId = schoolName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        setDoc(doc(db, 'schools', schoolId), { name: schoolName, totalPoints: increment(10), lastUpdated: serverTimestamp() }, { merge: true }).catch(() => {});
      }
    } catch (e) { console.warn('ZooYard session completion write failed:', e); }
    setZyScreen('done');
  }

  // Held until the resume read finishes so the picker never flashes "Tap to begin" for a
  // habitat the student has already completed.
  const dismissIntro = () => {
    try { localStorage.setItem(zyIntroKey(normaliseCode(classCode || ''), safeStudentId(studentName || '')), '1'); }
    catch { /* private mode — they will see it once more, which is harmless */ }
    setShowIntro(false);
  };

  if (showIntro) return <ZooYardIntro onStart={dismissIntro} />;

  if (hydrating) {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, var(--jungle-deep) 0%, var(--jungle-mid) 50%, var(--jungle-light) 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.25rem' }}>
        <img src="/images/logo.png" alt="" style={{ height:64, width:'auto', opacity:0.9 }} onError={e => e.target.style.display='none'} />
        <div style={{ display:'flex', gap:8 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:'rgba(255,255,255,0.7)', animation:'zy-pulse 1.2s ease-in-out infinite', animationDelay:`${i*0.2}s` }} />
          ))}
        </div>
        <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.75rem', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:600, margin:0 }}>Loading your ZooYard</p>
        <style>{`@keyframes zy-pulse { 0%,80%,100% { opacity:0.3; transform:scale(0.85); } 40% { opacity:1; transform:scale(1.15); } }`}</style>
      </div>
    );
  }

  // ── Done screen ──────────────────────────────────────────────────────────
  if (zyScreen === 'done') {
    return (
      <ZyDoneScreen
        classCode={classCode} studentName={studentName} totalPoints={totalPoints}
        onDone={() => { clearStudentSession(); setCompletionCardDismissed(true); setCurrentScreen('home'); setSessionType('standard'); }}
      />
    );
  }


  // ── Per-animal phases ────────────────────────────────────────────────────
  if (zyAnimal && zyPhase === 'video') {
    return (
      <div style={{ position:'fixed', inset:0, background:'#071E14', display:'flex', flexDirection:'column' }}>
        <HomeButton dark onHome={backToHabitats} />
        <div style={{ padding:'0.9rem 1.2rem', color:'white', fontWeight:700 }}>{zyAnimal.name} · {zyAnimal.habitatLabel}</div>
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          {zyAnimal.videoUrl ? (
            <video src={zyAnimal.videoUrl} controls autoPlay style={{ maxWidth:'100%', maxHeight:'100%', borderRadius:12 }} />
          ) : (
            <div style={{ background:'rgba(255,255,255,0.06)', border:'1px dashed rgba(255,255,255,0.25)', borderRadius:16, padding:'2.5rem 2rem', textAlign:'center', maxWidth:420 }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🎬</div>
              <p style={{ color:'white', fontWeight:700, marginBottom:'0.5rem' }}>Video coming soon</p>
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.85rem', lineHeight:1.6 }}>Your teacher will add a video here about the {zyAnimal.name.toLowerCase()}'s habitat.</p>
            </div>
          )}
        </div>
        <div style={{ padding:'1rem 1.2rem 1.5rem' }}>
          <button onClick={() => setZyPhase('activity')}
            style={{ width:'100%', padding:'0.9rem', borderRadius:999, border:'none', background:'linear-gradient(135deg,#2E7D55,#1A5238)', color:'white', fontSize:'0.95rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>
            Continue
          </button>
        </div>
        <StudentGuide screen="zooyard-video" />
      </div>
    );
  }

  if (zyAnimal && zyPhase === 'activity') {
    const a = zyAnimal.activity;
    const theme = ZOOYARD_HABITAT_THEME[zyAnimal.habitatArea] || ZOOYARD_HABITAT_THEME.bushland;
    return (
      <div style={{ position:'fixed', inset:0, background:theme.bgGradient, display:'flex', flexDirection:'column', fontFamily:'var(--t-font)', overflow:'hidden' }}>
        <HomeButton dark onHome={backToHabitats} />

        <video
          key={theme.videoBg}
          autoPlay loop muted playsInline
          src={theme.videoBg}
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.65) 100%)' }} />

        <div style={{ position:'relative', flex:1, overflowY:'auto', padding:'3.5rem 1.2rem 1.5rem', display:'flex', flexDirection:'column', alignItems:'center' }}>
          {/* Hero */}
          <div style={{ textAlign:'center', marginBottom:'1.25rem' }}>
            <div style={{ position:'relative', width:96, height:96, margin:'0 auto 0.75rem' }}>
              <img src={zyAnimal.image} alt="" style={{ width:96, height:96, objectFit:'cover', borderRadius:'50%', border:`4px solid ${theme.accent}`, boxShadow:`0 8px 28px ${theme.accent}66` }} />
              <div style={{ position:'absolute', bottom:-4, right:-4, width:34, height:34, borderRadius:'50%', background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.25)' }}>{theme.icon}</div>
            </div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:999, padding:'0.25rem 0.75rem', backdropFilter:'blur(6px)' }}>
              <span style={{ color:'white', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.04em' }}>{zyAnimal.habitatLabel.toUpperCase()} · {zyAnimal.name.toUpperCase()}</span>
            </div>
          </div>

          {/* Question card */}
          <div style={{ width:'100%', maxWidth:480, background:theme.cardGradient, borderRadius:20, padding:'1.5rem 1.4rem', boxShadow:'0 16px 40px rgba(0,0,0,0.28)' }}>
            <h2 style={{ fontSize:'1.1rem', color:'#0A2F1F', marginBottom:'1.15rem', lineHeight:1.45, fontWeight:700 }}>{a.question}</h2>
            {a.options.map((opt, idx) => {
              const isSelected = mcqAnswer === idx;
              const isCorrectOpt = idx === a.correct;
              let bg = 'white', border = `1.5px solid ${theme.accentBorder}`, color = '#0A2F1F';
              if (mcqRevealed && isCorrectOpt) { bg = 'rgba(46,125,85,0.12)'; border = '2px solid #2E7D55'; }
              else if (mcqRevealed && isSelected && !isCorrectOpt) { bg = 'rgba(220,38,38,0.08)'; border = '2px solid #DC2626'; }
              else if (!mcqRevealed) { bg = theme.accentSoft; }
              return (
                <button key={idx} onClick={() => selectMcq(idx)} disabled={mcqRevealed}
                  style={{ display:'block', width:'100%', textAlign:'left', padding:'0.85rem 1rem', marginBottom:'0.6rem', borderRadius:12, background:bg, border, color, fontSize:'0.92rem', cursor: mcqRevealed ? 'default' : 'pointer', fontFamily:'inherit', transition:'background 0.15s, border-color 0.15s' }}>
                  {opt}
                </button>
              );
            })}
            {mcqRevealed && (
              <div style={{ background:'white', borderRadius:12, padding:'1rem 1.1rem', marginTop:'0.9rem', boxShadow:'0 2px 10px rgba(7,30,20,0.08)', borderLeft:`4px solid ${mcqCorrect ? '#2E7D55' : '#DC2626'}` }}>
                <p style={{ margin:0, fontWeight:700, color: mcqCorrect ? '#2E7D55' : '#DC2626', marginBottom:'0.4rem' }}>{mcqCorrect ? 'Correct!' : 'Not quite'}</p>
                <p style={{ margin:0, color:'#3A4A3F', fontSize:'0.88rem', lineHeight:1.6 }}>{a.fact}</p>
              </div>
            )}
          </div>
        </div>

        {mcqRevealed && (
          <div style={{ position:'relative', padding:'1rem 1.2rem 1.5rem', maxWidth:480, margin:'0 auto', width:'100%', boxSizing:'border-box' }}>
            <button onClick={() => setZyPhase('observe')}
              style={{ width:'100%', padding:'0.9rem', borderRadius:999, border:'none', background:`linear-gradient(135deg, ${theme.accent}, #0A2F1F)`, color:'white', fontSize:'0.95rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:`0 8px 22px ${theme.accent}55` }}>
              Go outside and observe
            </button>
          </div>
        )}
        <StudentGuide screen="zooyard-activity" />
      </div>
    );
  }

  // ── Observe, then measure ────────────────────────────────────────────────
  // The countdown is the whole point of this screen. Without a forced quiet window students
  // read the method, type a plausible number and move on, which is exactly the "just type a
  // number" risk the field study was always exposed to. There is deliberately NOTHING to type
  // while the timer runs: a text box on screen means they write for two minutes instead of
  // looking for two minutes.  // ── The watch ────────────────────────────────────────────────────────────
  // Two minutes, device down, and NOTHING is recorded. There is deliberately no input on this
  // screen at all: a box to fill in means a student writes for two minutes instead of looking
  // for two minutes, which is the opposite of the point.
  //
  // ⚠️ A measurement step used to sit here (pace the gap, count the blockers). It was removed on
  // 2026-10-01 as one step too many. Do NOT add a number back as its own step. If quantitative
  // data is ever wanted, harvest it from the watch itself ("how many birds landed?") so the
  // counting IS the watching.
  if (zyAnimal && zyPhase === 'observe') {
    const ob = zyAnimal.observation;
    const theme = ZOOYARD_HABITAT_THEME[zyAnimal.habitatArea] || ZOOYARD_HABITAT_THEME.bushland;
    const started = observeEndsAt !== null;
    const mm = String(Math.floor(observeLeft / 60)).padStart(1, '0');
    const ss = String(observeLeft % 60).padStart(2, '0');

    return (
      <div style={{ position:'fixed', inset:0, background:theme.bgGradient, overflowY:'auto', fontFamily:'var(--t-font)' }}>
        <HomeButton dark onHome={backToHabitats} />
        <div style={{ padding:'0.9rem 1.2rem', color:'white', fontWeight:700 }}>{zyAnimal.name} · Observe</div>

        <div style={{ maxWidth:520, margin:'0 auto', padding:'0.5rem 1.1rem 2.5rem', boxSizing:'border-box' }}>
          <div style={{ background:'rgba(255,255,255,0.96)', borderRadius:18, padding:'1.4rem 1.2rem', boxShadow:'0 14px 38px rgba(0,0,0,0.3)', textAlign:'center' }}>
            {/* The one quality this habitat is about. It names what to look for before they
                start and stays on screen after, so the build does not arrive out of nowhere. */}
            {ob.focus && (
              <div style={{ display:'inline-block', padding:'0.25rem 0.8rem', borderRadius:999, background:theme.accentSoft, color:theme.accent, fontSize:'0.66rem', fontWeight:800, letterSpacing:'0.13em', textTransform:'uppercase', marginBottom:'0.7rem' }}>
                {ob.focus}
              </div>
            )}
            <div style={{ fontSize:'2.2rem', marginBottom:'0.3rem' }} aria-hidden="true">{theme.icon}</div>
            <h2 className="taronga-title" style={{ fontSize:'clamp(1.3rem,4.5vw,1.6rem)', color:'#0A2F1F', margin:'0 0 0.5rem' }}>{ob.title}</h2>
            <p style={{ margin:'0 0 1.1rem', color:'#3A4A3F', fontSize:'0.95rem', lineHeight:1.6 }}>{ob.instruction}</p>

            {!started && (
              <>
                <ul style={{ textAlign:'left', margin:'0 0 1.2rem', paddingLeft:'1.2rem', color:'#3A4A3F', fontSize:'0.92rem', lineHeight:1.75 }}>
                  {ob.lookFor.map((l, i) => <li key={i}>{l}</li>)}
                </ul>
                <button onClick={() => { const now = Date.now(); setObserveNow(now); setObserveEndsAt(now + ob.seconds * 1000); }}
                  style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none', background:`linear-gradient(135deg, ${theme.accent}, #0A2F1F)`, color:'white', fontSize:'0.95rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  Start the {Math.round(ob.seconds / 60)} minutes
                </button>
              </>
            )}

            {started && !observeDone && (
              <>
                <div aria-live="polite" style={{ fontSize:'3.4rem', fontWeight:800, color:theme.accent, fontVariantNumeric:'tabular-nums', lineHeight:1.1, margin:'0.5rem 0 0.3rem' }}>
                  {mm}:{ss}
                </div>
                <p style={{ margin:'0 0 1.1rem', color:'#6B6B62', fontSize:'0.85rem' }}>Eyes up. Put the screen down.</p>
                {/* A class outdoors runs on a bell, and a stuck timer with thirty students
                    waiting is worse than a short observation. Deliberately quiet, same as
                    Evolve's "Skip the timer". */}
                <button onClick={() => { const now = Date.now(); setObserveNow(now); setObserveEndsAt(now - 1); }}
                  style={{ background:'none', border:'none', color:'#6B6B62', fontSize:'0.78rem', textDecoration:'underline', cursor:'pointer', fontFamily:'inherit' }}>
                  Skip the timer
                </button>
              </>
            )}

            {observeDone && (
              <>
                <p style={{ margin:'0.2rem 0 1.1rem', color:'#3A4A3F', fontSize:'0.95rem', lineHeight:1.6, fontWeight:600 }}>
                  Time is up. Hold on to what you saw: you are about to do something about it.
                </p>
                <button onClick={() => setZyPhase('action')}
                  style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none', background:`linear-gradient(135deg, ${theme.accent}, #0A2F1F)`, color:'white', fontSize:'0.95rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  Now do something about it
                </button>
              </>
            )}
          </div>
        </div>
        <StudentGuide screen="zooyard-observe" />
      </div>
    );
  }

  // ── The build ────────────────────────────────────────────────────────────
  // This is the absorbed Habitat Hero task, once per habitat. It sits AFTER the watch on
  // purpose: the student has just spent two minutes noticing where one quality (shade, cover,
  // a ground layer) is missing from their schoolyard, and this is them providing it. Watch,
  // build, then explain the link. Building before looking would make it a craft activity.
  if (zyAnimal && zyPhase === 'action') {
    const task = zyAnimal.citizenScience;
    const theme = ZOOYARD_HABITAT_THEME[zyAnimal.habitatArea] || ZOOYARD_HABITAT_THEME.bushland;
    return (
      // ⚠️ This screen is read STANDING OUTSIDE, one-handed, by a kid about to put the phone in
      // a pocket and walk off. It is a memorise-and-go screen, not a reading screen, which is
      // what drives every decision here:
      //   · ONE instruction, in the Taronga display face, at display size. It used to compete
      //     with a task title, a recap sentence and a photo prompt all saying the same thing.
      //   · NO card around it. The habitat gradient IS the page, so each of the eight feels like
      //     a different place and the screen stops reading as a form.
      //   · The white panel is the tool, not the message. Colour says what to do; white is where
      //     you do it. Do not put instructions back into the white panel.
      <div style={{ position:'fixed', inset:0, background:theme.bgGradient, overflowY:'auto', fontFamily:'var(--t-font)' }}>
        {/* The signature: the instruction reads as LIT, like a sign standing in that habitat.
            A soft pool of the habitat's own accent sits behind the headline, over a scrim that
            is only as heavy as it needs to be to hold white text. Keep the scrim light — crush
            it and all six habitats collapse into the same dark green and the mode loses the one
            cue that says which place you are in. */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none',
                      background:`radial-gradient(110% 70% at 18% 22%, ${theme.accent}66 0%, transparent 62%)` }} />
        <div style={{ position:'absolute', inset:0, pointerEvents:'none',
                      background:'linear-gradient(180deg, rgba(4,12,8,0.18) 0%, rgba(4,12,8,0.42) 55%, rgba(4,12,8,0.62) 100%)' }} />

        <HomeButton dark onHome={backToHabitats} />

        <div style={{ position:'relative', zIndex:1, minHeight:'100%', display:'flex', flexDirection:'column', justifyContent:'center',
                      maxWidth:560, margin:'0 auto', padding:'clamp(4rem,9vh,5rem) 1.3rem 2.5rem', boxSizing:'border-box' }}>

          <div className={reduceMotion ? undefined : 'animate-fade-in-up'} style={{ marginBottom:'1.8rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.55rem', marginBottom:'1rem' }}>
              <span style={{ fontSize:'1.5rem', lineHeight:1 }} aria-hidden="true">{task.icon}</span>
              <span style={{ fontSize:'0.66rem', fontWeight:800, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.72)' }}>{task.title}</span>
            </div>

            <h1 className="taronga-title" style={{ color:'white', fontSize:'clamp(2rem,8vw,3.1rem)', lineHeight:1.08, margin:0, textWrap:'balance', textShadow:'0 2px 24px rgba(0,0,0,0.35)' }}>
              {task.primary}
            </h1>

            {/* Both disclosures are TUCKED BEHIND A TAP, not deleted, and both stay shut by
                default. A student who already knows what to do should see one instruction and
                leave; detail is for the ones who need it, and it must not compete with the
                headline for the ones who do not.
                ⚠️ Order matters: "How do I do it?" sits FIRST because far more students need
                the steps than need the fallback. The fallback is not a nicety either — planting
                into the ground needs permission, a season and somebody to water it in the
                holidays, and a task half the schools cannot start is a task that does not run. */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginTop:'1.3rem' }}>
              {task.steps?.length > 0 && (
                <button onClick={() => setStepsOpen(o => !o)} aria-expanded={stepsOpen}
                  style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.45)', borderRadius:999, padding:'0.5rem 1.05rem', color:'white', fontSize:'0.85rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                  How do I do it? {stepsOpen ? '▲' : '▼'}
                </button>
              )}
              <button onClick={() => setFallbackOpen(o => !o)} aria-expanded={fallbackOpen}
                style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.28)', borderRadius:999, padding:'0.5rem 1.05rem', color:'rgba(255,255,255,0.92)', fontSize:'0.85rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                Cannot do that here? {fallbackOpen ? '▲' : '▼'}
              </button>
            </div>

            {stepsOpen && task.steps?.length > 0 && (
              <ol style={{ margin:'0.8rem 0 0', padding:'1rem 1.1rem 1rem 2.4rem', background:'rgba(255,255,255,0.14)', borderRadius:14, color:'white', fontSize:'0.95rem', lineHeight:1.55, listStyle:'none', counterReset:'zy-step' }}>
                {task.steps.map((st, i) => (
                  <li key={i} style={{ counterIncrement:'zy-step', position:'relative', marginBottom: i === task.steps.length - 1 ? 0 : '0.7rem' }}>
                    {/* The numerals are the structure here: these ARE a sequence a student works
                        through in order, so numbering carries real information rather than
                        decorating a list. */}
                    <span aria-hidden="true" style={{ position:'absolute', left:'-1.75rem', top:'0.05rem', width:'1.35rem', height:'1.35rem', borderRadius:'50%', background:'rgba(255,255,255,0.9)', color:'#0A2F1F', fontSize:'0.72rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {i + 1}
                    </span>
                    {st}
                  </li>
                ))}
              </ol>
            )}

            {fallbackOpen && (
              <p style={{ margin:'0.8rem 0 0', padding:'0.9rem 1rem', background:'rgba(255,255,255,0.12)', borderRadius:12, color:'rgba(255,255,255,0.92)', fontSize:'0.95rem', lineHeight:1.6 }}>
                {task.fallback}
              </p>
            )}
          </div>

          <div style={{ background:'white', borderRadius:20, padding:'1.3rem', boxShadow:'0 18px 44px rgba(0,0,0,0.35)' }}>
            {csPreview ? (
              <>
                <img src={csPreview} alt="" style={{ width:'100%', maxHeight:280, objectFit:'cover', borderRadius:14, marginBottom:'0.5rem' }} />
                <button onClick={() => { setCsFile(null); setCsPreview(null); }} disabled={csUploading}
                  style={{ background:'none', border:'none', color:'#6B6B62', fontSize:'0.82rem', cursor:'pointer', marginBottom:'0.9rem', fontFamily:'inherit', textDecoration:'underline' }}>
                  Retake photo
                </button>
              </>
            ) : (
              // The photo instruction rides on the camera control as its hint rather than being
              // a heading of its own. It carries real information (what to get in frame), so it
              // earns one quiet line; it does not earn a second title.
              <PhotoCapture onCapture={onCsPhoto} accentColor={theme.accent}
                label="Take the photo" hint={task.photoPrompt} />
            )}

            {/* ⚠️ There is deliberately NO note field here. It used to carry an optional "tell us
                about it", which asked for the same thing the write-up screen asks for properly
                and scores. Two writing moments in one habitat means the first gets a shrug.
                Removed 2026-10-01. Staff moderation therefore sees a photo with no words beside
                it; if that bites, copy the written response onto the submission afterwards
                rather than putting a box back here. */}

            {csError && <p style={{ color:'#DC2626', fontSize:'0.9rem', margin:'0 0 0.8rem' }}>{csError}</p>}

            <button onClick={submitHabitatAction} disabled={!csFile || csUploading}
              style={{ width:'100%', padding:'1rem', borderRadius:999, border:'none', background: !csFile || csUploading ? '#D8D4C8' : `linear-gradient(135deg, ${theme.accent}, #0A2F1F)`, color:'white', fontSize:'1rem', fontWeight:800, cursor: !csFile || csUploading ? 'not-allowed' : 'pointer', textTransform:'uppercase', letterSpacing:'0.06em' }}>
              {csUploading ? 'Saving…' : 'Save and write it up'}
            </button>
          </div>
        </div>
        <StudentGuide screen="zooyard-citizen" />
      </div>
    );
  }

  if (zyAnimal && zyPhase === 'written') {
    const minWords = getMinWords(classStage);
    const wordCount = obsText.trim().match(/\b\w+\b/g)?.length || 0;
    // Stage 1 to 5 are all present on every animal, so the || 4 is a guard against a class with
    // no stage set rather than a real fallback.
    const prompt = zyAnimal.writingPromptByStage[classStage] || zyAnimal.writingPromptByStage[4];
    const tip = getStageScaffoldTip(classStage);
    const writtenTheme = ZOOYARD_HABITAT_THEME[zyAnimal.habitatArea] || ZOOYARD_HABITAT_THEME.bushland;
    return (
      // ⚠️ The habitat video carries through from the attest screen on purpose. A student walks
      // outside, stands in the real spot, and then used to drop onto a flat beige form: the
      // immersion died exactly where the thinking was supposed to start. The video is heavily
      // blurred and darkened here, NOT played clean. It is atmosphere at the edges; the writing
      // itself sits on an opaque card so nothing moves behind the text while they type.
      <div style={{ position:'fixed', inset:0, background: writtenTheme.videoBg ? '#0A1410' : writtenTheme.bgGradient, display:'flex', flexDirection:'column', fontFamily:'var(--t-font)', overflow:'hidden' }}>
        {/* ⚠️ videoBg is null for coast/forest/wetland — there is no ambient clip for those yet,
            and rendering a <video> with a null src shows a broken element rather than nothing.
            The gradient behind it carries the screen on its own. */}
        {!reduceMotion && writtenTheme.videoBg && (
          <video key={writtenTheme.videoBg} autoPlay loop muted playsInline src={writtenTheme.videoBg}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', filter:'blur(14px) saturate(1.15)', transform:'scale(1.12)' }} />
        )}
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(180deg, rgba(4,12,8,0.62) 0%, rgba(4,12,8,0.5) 45%, rgba(4,12,8,0.78) 100%)` }} />

        <HomeButton dark onHome={backToHabitats} />
        <div style={{ position:'relative', zIndex:1, background:`${zyAnimal.habitatColor}D9`, backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', padding:'0.9rem 1.2rem', color:'white', fontWeight:700, boxShadow:'0 2px 14px rgba(0,0,0,0.3)' }}>
          {zyAnimal.name} · Write it up
        </div>

        <div style={{ position:'relative', zIndex:1, flex:1, overflowY:'auto', padding:'1.25rem 1.1rem 1.5rem', maxWidth:560, margin:'0 auto', width:'100%', boxSizing:'border-box' }}>
          {/* The field notebook. A naturalist writing up what they just went and looked at is
              exactly what this task is, so the page says so rather than reading as a form. */}
          <div style={{ background:'linear-gradient(170deg,#FDFBF5,#F3EFE3)', borderRadius:18, padding:'1.15rem 1.15rem 1.3rem', boxShadow:'0 18px 44px rgba(0,0,0,0.42)', border:'1px solid rgba(255,255,255,0.5)' }}>

            <div style={{ display:'flex', alignItems:'center', gap:'0.55rem', marginBottom:'0.85rem' }}>
              <span style={{ fontSize:'1.1rem' }} aria-hidden="true">{writtenTheme.icon}</span>
              <span style={{ fontSize:'0.66rem', fontWeight:800, letterSpacing:'0.16em', textTransform:'uppercase', color:writtenTheme.accent }}>Field notes</span>
              <span style={{ flex:1, height:1, background:writtenTheme.accentBorder }} />
            </div>

            {habitatPhotos[zyAnimal.id] && (
              <div style={{ background:'white', padding:'7px 7px 9px', borderRadius:6, boxShadow:'0 6px 18px rgba(0,0,0,0.22)', marginBottom:'1rem', transform:'rotate(-0.8deg)' }}>
                <img src={habitatPhotos[zyAnimal.id]} alt="The spot you photographed"
                  style={{ width:'100%', maxHeight:150, objectFit:'cover', borderRadius:3, display:'block' }} />
                <div style={{ fontSize:'0.66rem', fontWeight:700, color:'#6B6B62', textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'6px', textAlign:'center' }}>Your spot</div>
              </div>
            )}


            {actionPhotoUrl && (
              <div style={{ background:'white', padding:'7px 7px 9px', borderRadius:6, boxShadow:'0 6px 18px rgba(0,0,0,0.22)', marginBottom:'1rem', transform:'rotate(0.7deg)' }}>
                <img src={actionPhotoUrl} alt="What you built" style={{ width:'100%', maxHeight:150, objectFit:'cover', borderRadius:3, display:'block' }} />
                <div style={{ fontSize:'0.66rem', fontWeight:700, color:'#6B6B62', textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'6px', textAlign:'center' }}>What you built{zyAnimal.observation?.focus ? ` · ${zyAnimal.observation.focus}` : ''}</div>
              </div>
            )}

            <p className="taronga-title" style={{ fontSize:'clamp(1.15rem,4.2vw,1.4rem)', color:'#0A2F1F', margin:'0 0 1rem', lineHeight:1.3, textWrap:'pretty' }}>{prompt}</p>

            <div style={{ marginBottom:'1rem' }}>
              <button onClick={() => setHintsOpen(o => !o)}
                style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', background:writtenTheme.accentSoft, border:`1px solid ${writtenTheme.accentBorder}`, borderRadius: hintsOpen ? '10px 10px 0 0' : '10px', padding:'0.7rem 1rem', cursor:'pointer', color:writtenTheme.accent, fontWeight:700, fontSize:'0.85rem', textAlign:'left', fontFamily:'inherit' }}>
                <span>💡 Need a hint?</span>
                <span style={{ fontSize:'0.7rem' }}>{hintsOpen ? '▲' : '▼'}</span>
              </button>
              {hintsOpen && (
                <div style={{ background:writtenTheme.accentSoft, border:`1px solid ${writtenTheme.accentBorder}`, borderTop:'none', borderRadius:'0 0 10px 10px', padding:'0.8rem 1rem' }}>
                  {tip.points.length > 0 && (
                    <>
                      <p style={{ fontSize:'0.72rem', fontWeight:700, color:writtenTheme.accent, textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 0.35rem' }}>{tip.header}</p>
                      <ul style={{ margin:'0 0 0.7rem', paddingLeft:'1.1rem', fontSize:'0.82rem', color:'#3A4A3F', lineHeight:1.8 }}>
                        {tip.points.map((pt, i) => <li key={i}>{pt}</li>)}
                      </ul>
                    </>
                  )}
                  <p style={{ fontSize:'0.72rem', fontWeight:700, color:writtenTheme.accent, textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 0.25rem' }}>Sentence starters:</p>
                  {tip.starters.map((s, i) => (
                    <p key={i} style={{ fontSize:'0.82rem', color:'#3A4A3F', margin:'0.15rem 0', paddingLeft:'0.5rem', fontStyle:'italic' }}>"{s}"</p>
                  ))}
                </div>
              )}
            </div>

            {obsError && (
              <p style={{ background:'#FEF2F2', border:'1px solid #FCA5A5', color:'#B91C1C', fontSize:'0.82rem', lineHeight:1.5, borderRadius:10, padding:'0.7rem 0.9rem', margin:'0 0 0.85rem' }}>{obsError}</p>
            )}

            {/* Ruled like a notebook page. The line spacing, the line-height and the top padding are
                tied together (28px rules, 28px line-height, 14px top padding, background offset to
                match) — change one and the text stops sitting on the lines. `background-attachment:
                local` keeps the rules moving with the text as it scrolls. */}
            <textarea value={obsText} onChange={e => { setObsText(e.target.value); if (obsError) setObsError(''); }} rows={7}
              placeholder="Write your response here..."
              style={{
                width:'100%', padding:'14px 14px 16px', borderRadius:12,
                border:`1.5px solid ${writtenTheme.accentBorder}`, background:'#FFFDF7',
                backgroundImage:'repeating-linear-gradient(to bottom, transparent 0px, transparent 27px, rgba(10,47,31,0.11) 27px, rgba(10,47,31,0.11) 28px)',
                backgroundPosition:'0 14px', backgroundAttachment:'local',
                fontSize:'1rem', lineHeight:'28px', fontFamily:'inherit', resize:'vertical',
                boxSizing:'border-box', color:'#16241C', outline:'none',
              }} />

            {/* A bar fills as they write, instead of a bare "12 / 40". Seeing it move is a much
                better nudge for a reluctant writer than a number that just sits there. */}
            <div style={{ display:'flex', alignItems:'center', gap:'0.7rem', marginTop:'0.65rem' }}>
              <div style={{ flex:1, height:7, borderRadius:999, background:'rgba(10,47,31,0.1)', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${Math.min(100, Math.round((wordCount / Math.max(minWords,1)) * 100))}%`,
                  background: wordCount >= minWords ? 'linear-gradient(90deg,#2E7D55,#4A9E6B)' : writtenTheme.accent,
                  borderRadius:999, transition:'width 0.3s ease' }} />
              </div>
              <span style={{ fontSize:'0.78rem', fontWeight:800, color: wordCount >= minWords ? '#2E7D55' : '#7C8A80', whiteSpace:'nowrap' }}>
                {wordCount >= minWords ? '✓ Ready' : `${wordCount} / ${minWords} words`}
              </span>
            </div>
          </div>
        </div>
        <div style={{ position:'relative', zIndex:1, padding:'0.9rem 1.1rem 1.4rem', maxWidth:560, margin:'0 auto', width:'100%', boxSizing:'border-box', background:'linear-gradient(180deg, rgba(4,12,8,0) 0%, rgba(4,12,8,0.55) 45%)' }}>
          <button onClick={submitWritten} disabled={wordCount < minWords || savingObs}
            style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none',
              background: wordCount < minWords || savingObs ? 'rgba(255,255,255,0.18)' : 'linear-gradient(135deg,#2E7D55,#1A5238)',
              color: wordCount < minWords || savingObs ? 'rgba(255,255,255,0.65)' : 'white',
              fontSize:'0.95rem', fontWeight:800, cursor: wordCount < minWords || savingObs ? 'not-allowed' : 'pointer',
              textTransform:'uppercase', letterSpacing:'0.05em',
              boxShadow: wordCount < minWords || savingObs ? 'none' : '0 8px 24px rgba(46,125,85,0.5)',
              backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', transition:'all 0.25s' }}>
            {savingObs ? 'Saving…' : wordCount < minWords ? 'Write more to continue' : 'Submit & Earn Badge'}
          </button>
        </div>
        <StudentGuide screen="zooyard-written" />
      </div>
    );
  }

  if (zyAnimal && zyPhase === 'badge' && badgeReveal) {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#071E14,#0D3322,#1A5238)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'1.25rem', overflowY:'auto' }}>
        <HomeButton dark onHome={backToHabitats} />
        <div className="animate-scale-in" style={{ background:'white', borderRadius:20, padding:'1.75rem 1.5rem', maxWidth:440, width:'100%', textAlign:'center', margin:'auto' }}>
          <img src={badgeReveal.animal.image} alt="" style={{ width:88, height:88, objectFit:'cover', borderRadius:'50%', margin:'0 auto 1rem', display:'block', border:`4px solid ${badgeReveal.animal.habitatColor}` }} />
          <h2 className="taronga-title" style={{ fontSize:'1.5rem', color:'#0A2F1F', marginBottom:'0.3rem' }}>{badgeReveal.animal.name} Badge Earned!</h2>
          <p style={{ fontSize:'1.8rem', fontWeight:800, color:'#2E7D55', margin:'0.5rem 0 1rem' }}>+{badgeReveal.points} pts</p>

          {badgeReveal.overall && (
            <p style={{ fontSize:'0.95rem', color:'#0A2F1F', fontWeight:600, lineHeight:1.5, margin:'0 0 1.1rem', textWrap:'pretty' }}>
              {badgeReveal.overall}
            </p>
          )}

          <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1rem' }}>
            {ZY_DOMAINS.map(({ key, label }) => {
              const val = badgeReveal[key] ?? 0;
              return (
                <div key={key} style={{ flex:1, background:'#F0EDE6', borderRadius:10, padding:'0.6rem 0.4rem' }}>
                  <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#0A2F1F' }}>{val}/5</div>
                  <div style={{ width:'100%', height:3, background:'#D8D4C8', borderRadius:2, margin:'0.3rem 0' }}>
                    <div style={{ width:`${Math.round((val / 5) * 100)}%`, height:'100%', background: badgeReveal.animal.habitatColor, borderRadius:2 }} />
                  </div>
                  <div style={{ fontSize:'0.64rem', color:'#6B6B62', textTransform:'uppercase', fontWeight:700, letterSpacing:'0.04em' }}>{label}</div>
                </div>
              );
            })}
          </div>

          {/* One strength and one thing to work on. Any more than that and a student stops
              reading, which is the whole reason the daily version settled on two panels. */}
          {(() => {
            const fb = zyFeedback(badgeReveal, classStage);
            return (
              <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'0.5rem', marginBottom:'1.25rem', textAlign:'left' }}>
                <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:12, padding:'0.7rem 0.85rem' }}>
                  <div style={{ fontSize:'0.6rem', fontWeight:800, color:'#15803D', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.3rem' }}>What you did well</div>
                  <p style={{ margin:0, fontSize:'0.82rem', color:'#166534', lineHeight:1.5 }}>{fb.well}</p>
                </div>
                <div style={{ background:'#FFF7ED', border:'1px solid #FED7AA', borderRadius:12, padding:'0.7rem 0.85rem' }}>
                  <div style={{ fontSize:'0.6rem', fontWeight:800, color:'#C2410C', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.3rem' }}>Next time, try to...</div>
                  <p style={{ margin:0, fontSize:'0.82rem', color:'#9A3412', lineHeight:1.5 }}>{fb.next}</p>
                </div>
              </div>
            );
          })()}
          <button onClick={backToHabitats}
            style={{ width:'100%', padding:'0.85rem', borderRadius:999, border:'none', background:'linear-gradient(135deg,#2E7D55,#1A5238)', color:'white', fontSize:'0.95rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>
            Continue
          </button>
        </div>
        <StudentGuide screen="zooyard-badge" />
      </div>
    );
  }

  if (zyScreen === 'collection') {
    const totalDoneColl = Object.keys(zyCompleted).length;
    const quizFirstTryColl = Object.values(zyCompleted).filter(c => c.quizCorrect).length;
    return (
      <div style={{ minHeight:'100vh', background:'#0A2F1F', color:'white', paddingBottom:'2rem' }}>
        <div style={{ background:'linear-gradient(to bottom,rgba(10,47,31,0.98),rgba(7,30,20,0.95))', borderBottom:'1px solid rgba(46,125,85,0.25)', padding:'0.75rem 1rem', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(12px)' }}>
          <button onClick={() => setZyScreen('habitats')}
            style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.22)', color:'white', padding:'0.45rem 1rem', borderRadius:999, cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>
            ← Back
          </button>
          <h1 className="taronga-title" style={{ fontSize:'1.4rem', color:'white', letterSpacing:'0.05em', margin:0 }}>
            Habitat Badges
          </h1>
          <div style={{ width:'70px' }} />
        </div>

        <div style={{ padding:'1.25rem 1rem', maxWidth:600, margin:'0 auto' }}>
          {ZOOYARD_ANIMALS.map(animal => {
            const badge = zyCompleted[animal.id];
            const earned = !!badge;
            const b = badge?.behaviour || 0;
            const d = badge?.detail    || 0;
            const w = badge?.writing   || 0;
            return (
              <div key={animal.id} style={{ background: earned ? 'linear-gradient(135deg,rgba(46,125,85,0.22),rgba(10,47,31,0.9))' : 'rgba(255,255,255,0.04)', border: earned ? '1px solid rgba(46,125,85,0.4)' : '1px solid rgba(255,255,255,0.1)', borderRadius:16, marginBottom:'0.85rem', overflow:'hidden', display:'flex', gap:'1rem', padding:'1rem', alignItems:'flex-start' }}>
                <div style={{ flexShrink:0, width:72, height:72, borderRadius:'50%', backgroundImage: earned ? `url(/images/badge-${animal.id}.png)` : 'none', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition:'center', backgroundColor: earned ? 'transparent' : 'rgba(255,255,255,0.04)', border: earned ? '2px solid rgba(46,125,85,0.5)' : '2px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>
                  {!earned && <span style={{ opacity:0.4 }}>🔒</span>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.35rem' }}>
                    <div>
                      <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color: earned ? 'white' : 'rgba(255,255,255,0.35)' }}>{animal.name}</h3>
                      <p style={{ margin:0, fontSize:'0.72rem', color:'rgba(255,255,255,0.5)', fontStyle:'italic' }}>{animal.habitatLabel}</p>
                    </div>
                    {earned && (
                      <div style={{ background:'rgba(46,125,85,0.3)', border:'1px solid rgba(46,125,85,0.4)', borderRadius:20, padding:'0.2rem 0.65rem', fontSize:'0.85rem', fontWeight:800, color:'#7EC89A', whiteSpace:'nowrap' }}>
                        {badge.points} pts
                      </div>
                    )}
                  </div>
                  {earned ? (
                    <>
                      <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.5rem' }}>
                        {[['Behaviour', b, '#4A9E6B'], ['Detail', d, '#38BDF8'], ['Writing', w, '#F472B6']].map(([label, val, color]) => (
                          <div key={label} style={{ flex:1 }}>
                            <div style={{ fontSize:'0.58rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>{label}</div>
                            <div style={{ height:5, background:'rgba(255,255,255,0.08)', borderRadius:3, overflow:'hidden' }}>
                              <div style={{ height:'100%', width:`${(val/5)*100}%`, background:color, borderRadius:3 }} />
                            </div>
                            <div style={{ fontSize:'0.65rem', color, fontWeight:700, marginTop:2 }}>{val}/5</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: badge.quizCorrect ? 'rgba(74,158,107,0.2)' : 'rgba(239,68,68,0.15)', border: `1px solid ${badge.quizCorrect ? 'rgba(74,158,107,0.4)' : 'rgba(239,68,68,0.3)'}`, borderRadius:20, padding:'0.15rem 0.6rem', fontSize:'0.68rem', fontWeight:700, color: badge.quizCorrect ? '#4A9E6B' : '#FCA5A5', display:'inline-block' }}>
                        {badge.quizCorrect ? '✓ Quiz +20' : '✗ Quiz +0'}
                      </div>
                    </>
                  ) : (
                    <p style={{ margin:'0.25rem 0 0', fontSize:'0.8rem', color:'rgba(255,255,255,0.3)', fontStyle:'italic' }}>Not yet explored</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ maxWidth:600, margin:'0 auto', padding:'0 1rem' }}>
          <div style={{ background:'linear-gradient(135deg,rgba(46,125,85,0.2),rgba(10,47,31,0.5))', border:'1px solid rgba(46,125,85,0.3)', borderRadius:16, padding:'1.25rem 1.5rem', display:'flex', justifyContent:'space-around', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.8rem', fontWeight:800, color:'#F4C542' }}>{totalPoints}</div>
              <div style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Total Points</div>
            </div>
            <div style={{ width:1, height:40, background:'rgba(46,125,85,0.3)' }} />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.8rem', fontWeight:800, color:'white' }}>
                {totalDoneColl}<span style={{ fontSize:'1.1rem', opacity:0.4 }}>/{ZOOYARD_ANIMALS.length}</span>
              </div>
              <div style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Habitats</div>
            </div>
            <div style={{ width:1, height:40, background:'rgba(46,125,85,0.3)' }} />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.8rem', fontWeight:800, color:'#4A9E6B' }}>
                {quizFirstTryColl}<span style={{ fontSize:'1.1rem', opacity:0.4 }}>/{totalDoneColl}</span>
              </div>
              <div style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Quiz First Try</div>
            </div>
          </div>

          <button onClick={goHome}
            style={{ width:'100%', marginTop:'1rem', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.22)', color:'white', padding:'0.75rem 1rem', borderRadius:999, cursor:'pointer', fontSize:'0.85rem', fontWeight:700 }}>
            🚪 Log Out
          </button>
        </div>
        <StudentGuide screen="zooyard" />
      </div>
    );
  }

  // Locals for the unlock sheet. Plain consts rather than an inline IIFE in the JSX: an arrow
  // invoked during render drags its whole call graph into render analysis, which had the linter
  // flagging Date.now() inside the photo upload as an impure render call.
  const ua = unlockAnimal;
  const unlockTheme = ua ? (ZOOYARD_HABITAT_THEME[ua.habitatArea] || {}) : {};
  const unlockSaved = !!ua && !!habitatPhotos[ua.id] && !attestUploading;

  // ── Habitat picker (default) ─────────────────────────────────────────────
  // The zoo IS the screen. The header floats over it on a scrim rather than sitting in a band
  // above it, because a 540px viewport strip with a green gradient filling the rest looked like
  // the 3D had been dropped into a page it did not belong to.
  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden', background:'#0B2415' }}>

      <div style={{ position:'absolute', inset:0 }}>
        <ZooYardZoo3D
          animals={ZOOYARD_ANIMALS}
          completed={zyCompleted}
          unlocked={habitatPhotos}
          themes={ZOOYARD_HABITAT_THEME}
          onSelect={tapMarker}
        />
      </div>

      {/* Scrim only, no solid bar: enough contrast for white text without walling off the sky.
          pointerEvents none so a drag that starts up here still swings the zoo. */}
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:2, pointerEvents:'none',
                    background:'linear-gradient(180deg, rgba(4,16,10,0.72) 0%, rgba(4,16,10,0.42) 55%, rgba(4,16,10,0) 100%)',
                    padding:'0.9rem 1.1rem 2.2rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.9rem', maxWidth:1100, margin:'0 auto' }}>
          <img src="/images/logo.png" alt="" style={{ height:'clamp(38px,7vw,52px)', width:'auto', flexShrink:0, filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}
               onError={e => e.target.style.display='none'} />
          <div style={{ minWidth:0, flex:1 }}>
            <h1 className="taronga-title" style={{ fontSize:'clamp(1.25rem,4.4vw,1.85rem)', color:'white', margin:0, letterSpacing:'0.04em', lineHeight:1.1, textShadow:'0 2px 10px rgba(0,0,0,0.6)' }}>ZooYard</h1>
            <p style={{ color:'var(--safari-gold,#E8B33C)', fontSize:'clamp(0.7rem,2.4vw,0.86rem)', margin:'0.1rem 0 0', fontWeight:600, textShadow:'0 1px 6px rgba(0,0,0,0.6)' }}>
              Build your habitat, right here at school
            </p>
          </div>

          {/* Re-enabled individually, since the scrim itself must stay transparent to drags. */}
          {studentName && (
            <div style={{ pointerEvents:'auto', background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:999, padding:'0.35rem 0.8rem', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', whiteSpace:'nowrap', flexShrink:0 }}>
              <span style={{ color:'white', fontSize:'0.78rem', fontWeight:600 }}>👤 {studentName}</span>
            </div>
          )}
          <button onClick={() => setZyScreen('collection')}
            style={{ pointerEvents:'auto', flexShrink:0, background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:14, padding:'0.35rem 0.75rem', cursor:'pointer', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', textAlign:'center', fontFamily:'inherit' }}>
            <div style={{ color:'white', fontWeight:800, fontSize:'1rem', lineHeight:1 }}>{totalPoints}</div>
            <div style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginTop:'0.15rem' }}>
              {Object.keys(zyCompleted).length}/{ZOOYARD_ANIMALS.length} Habitats
            </div>
          </button>
        </div>
      </div>

      {/* Floats at the foot of the zoo rather than pushing it up the page. */}
      {allDone && (
        <div style={{ position:'absolute', left:'50%', bottom:'1.1rem', transform:'translateX(-50%)', zIndex:2,
                      width:'min(560px, calc(100vw - 2rem))', background:'rgba(255,255,255,0.96)', borderRadius:16,
                      padding:'0.9rem 1.1rem', display:'flex', alignItems:'center', justifyContent:'space-between',
                      gap:'0.9rem', flexWrap:'wrap', boxShadow:'0 14px 40px rgba(0,0,0,0.45)', backdropFilter:'blur(8px)' }}>
          <div style={{ minWidth:0 }}>
            <p style={{ margin:0, fontWeight:800, color:'#0A2F1F', fontSize:'0.98rem' }}>🌱 Every habitat done, and something built at each one.</p>
            <p style={{ margin:'0.15rem 0 0', color:'#6B6B62', fontSize:'0.82rem' }}>Your schoolyard is measurably better than it was. Finish up.</p>
          </div>
          <button onClick={finishSession}
            style={{ padding:'0.65rem 1.3rem', borderRadius:999, border:'none', background:'linear-gradient(135deg,#2E7D55,#1A5238)', color:'white', fontSize:'0.85rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>
            Finish
          </button>
        </div>
      )}

      {/* ── Unlock sheet ────────────────────────────────────────────────────────────────
          Proving where you are happens HERE, over the map, not on a screen of its own. The zoo
          stays visible behind it, so the padlock the student just tapped is still in view and
          the act reads as opening that specific enclosure rather than navigating away.
          Getting through to the video and everything after it requires this. */}
      {unlockAnimal && (
          <div style={{ position:'absolute', inset:0, zIndex:5, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
            <button onClick={closeUnlock} aria-label="Close"
              style={{ position:'absolute', inset:0, border:'none', background:'rgba(4,14,9,0.62)', backdropFilter:'blur(3px)', cursor:'pointer' }} />

            <div className="animate-scale-in" style={{ position:'relative', width:'min(460px, 100%)', maxHeight:'88%', overflowY:'auto',
                          background:'white', borderRadius:'22px 22px 0 0', padding:'1.1rem 1.25rem 1.5rem',
                          boxShadow:'0 -14px 44px rgba(0,0,0,0.5)', textAlign:'center' }}>
              <div style={{ width:44, height:4, borderRadius:999, background:'#D8D4C8', margin:'0 auto 0.9rem' }} aria-hidden="true" />

              <p style={{ fontSize:'0.66rem', fontWeight:800, letterSpacing:'0.14em', textTransform:'uppercase', color:ua.habitatColor, margin:'0 0 0.6rem' }}>
                {unlockTheme.icon} {ua.habitatLabel}
              </p>

              {/* Biggest thing in the sheet: the one line they have to act on. */}
              <div style={{ background:unlockTheme.accentSoft, border:`2px solid ${unlockTheme.accentBorder}`, borderRadius:16, padding:'1rem', marginBottom:'0.9rem' }}>
                <p className="taronga-title" style={{ fontSize:'clamp(1.35rem,5.4vw,1.75rem)', lineHeight:1.15, color:'#0A2F1F', margin:0, textWrap:'balance' }}>
                  {ua.selfAttestWhere}
                </p>
                <p style={{ color:'#3A4A3F', fontSize:'clamp(0.92rem,2.6vw,1rem)', lineHeight:1.5, margin:'0.55rem 0 0' }}>
                  {ua.selfAttestPrompt}
                </p>
              </div>

              {attestPreview ? (
                <div style={{ marginBottom:'0.8rem' }}>
                  <div style={{ position:'relative' }}>
                    <img src={attestPreview} alt="" style={{ width:'100%', maxHeight:170, objectFit:'cover', borderRadius:12, display:'block' }} />
                    {attestUploading && (
                      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700 }}>
                        Saving photo…
                      </div>
                    )}
                  </div>
                  {unlockSaved && <div style={{ fontSize:'0.8rem', fontWeight:800, color:'#166534', marginTop:'0.45rem' }}>🔓 Unlocked</div>}
                  <button onClick={() => retakeAttestPhoto(ua)} disabled={attestUploading}
                    style={{ background:'none', border:'none', color:'#6B6B62', fontSize:'0.8rem', cursor: attestUploading ? 'default' : 'pointer', marginTop:'0.25rem', fontFamily:'inherit', textDecoration:'underline' }}>
                    Retake photo
                  </button>
                </div>
              ) : (
                <PhotoCapture onCapture={(b, d) => onAttestPhoto(b, d, ua)} accentColor={ua.habitatColor}
                  label="Take a photo of your spot" hint="This unlocks the habitat" />
              )}

              {attestError && <p style={{ color:'#DC2626', fontSize:'0.82rem', margin:'0 0 0.7rem' }}>{attestError}</p>}

              {unlockSaved ? (
                <button onClick={() => { const a = ua; setUnlockAnimal(null); openAnimal(a); }}
                  style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none', background:ua.habitatColor, color:'white', fontSize:'1rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  Enter the habitat →
                </button>
              ) : (
                <p style={{ fontSize:'0.84rem', color:'#6B6B62', margin:'0 0 0.6rem', lineHeight:1.5 }}>
                  {attestUploading ? 'Saving your photo…' : 'Take a photo of your spot to unlock it.'}
                </p>
              )}

              <button onClick={closeUnlock} disabled={attestUploading}
                style={{ background:'none', border:'none', color:'#6B6B62', fontSize:'0.85rem', cursor:'pointer', marginTop:'0.6rem', fontFamily:'inherit' }}>
                ← Not yet, back to the map
              </button>
            </div>
          </div>
      )}

      <StudentGuide screen="zooyard" />
    </div>
  );
}
