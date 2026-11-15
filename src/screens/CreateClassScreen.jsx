import { science2024, pdhpe2024, pdhpeK6_2024 } from '../data/syllabusTransition';
import { useState, useEffect } from 'react';
import { doc, getDoc, serverTimestamp, setDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../context/AppContext';
import { openTeacherInfoSheet } from '../utils/teacherInfoSheet';
import { WD_OUTCOMES, WD_OUTCOMES_NOTE } from '../modes/wildest-dreams/content';
import { openWildestDreamsInfoSheet } from '../modes/wildest-dreams/infoSheet';

// ⚠️ Scoped stylesheet pattern, same as the dashboard and the class screen.
// 🚫 NO BACKTICKS ANYWHERE INSIDE THIS STRING. It is a template literal and one backtick in a
//    comment ends it; the build has failed on exactly that before.
const CC_CSS = `
.cc-root { background: #F4F6F2; }
.cc-wrap { max-width: 760px; margin: 0 auto; padding-bottom: 3rem; }
.cc-head { margin-bottom: 1.75rem; }
.cc-title { margin: 0 0 0.35rem; font-size: clamp(1.6rem, 3vw, 2.1rem); line-height: 1.1; color: #0A2F1F; letter-spacing: -0.01em; }
.cc-lede { margin: 0; font-size: 0.92rem; color: #6B736D; line-height: 1.55; }

.cc-step { background: #fff; border: 1px solid #E2E6DF; border-radius: 20px; padding: 1.5rem 1.6rem; margin-bottom: 1rem; }
.cc-step-n { margin: 0 0 0.15rem; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #8A9490; }
.cc-h3 { margin: 0 0 1.1rem; font-size: 1.18rem; font-weight: 700; color: #0A2F1F; letter-spacing: -0.015em; }

/* The programme decides everything downstream, so it is five cards rather than one line of a
   dropdown. It used to be the smallest control on the screen. */
.cc-progs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
.cc-prog {
  position: relative; appearance: none; font: inherit; cursor: pointer; text-align: left;
  display: flex; flex-direction: column; gap: 0.3rem;
  padding: 1rem 1.1rem 1.05rem; border-radius: 16px;
  background: #fff; border: 1.5px solid #E2E6DF;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.cc-prog:hover:not(:disabled) { border-color: #BFCDC4; }
.cc-prog.is-on { border-color: #1A5238; box-shadow: inset 0 0 0 1px #1A5238; }
.cc-prog:disabled { opacity: 0.55; cursor: not-allowed; }
.cc-prog:focus-visible { outline: 3px solid #E0A526; outline-offset: 2px; }
.cc-prog-name { display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; font-weight: 700; color: #14231B; }
.cc-prog-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--p, #2E7D55); flex-shrink: 0; }
.cc-prog-desc { font-size: 0.84rem; color: #5B645E; line-height: 1.5; }
.cc-prog-meta { font-size: 0.76rem; color: #8A9490; margin-top: 0.1rem; }
.cc-prog-tick { position: absolute; top: 0.85rem; right: 0.95rem; width: 18px; height: 18px; color: #1A5238; }
.cc-soon { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #8A9490; background: #F1F4F0; border-radius: 999px; padding: 0.1rem 0.45rem; }

.cc-field { margin-bottom: 1.2rem; }
.cc-field:last-child { margin-bottom: 0; }
.cc-label { display: block; font-size: 0.86rem; font-weight: 700; color: #14231B; margin-bottom: 0.45rem; }
.cc-hint { margin: 0.4rem 0 0; font-size: 0.8rem; color: #8A9490; line-height: 1.5; }
.cc-input {
  width: 100%; font: inherit; font-size: 0.95rem; color: #14231B;
  padding: 0.75rem 0.9rem; border-radius: 12px; border: 1.5px solid #DDE3DC; background: #fff;
  transition: border-color 0.15s;
}
.cc-input::placeholder { color: #A3ADA6; }
.cc-input:focus { outline: none; border-color: #1A5238; }

/* Stage and subject are short, closed lists. A segmented row shows every option at once, which
   a select cannot: it asks the teacher to open it, read it and pick blind. */
.cc-seg { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.cc-seg button {
  appearance: none; font: inherit; cursor: pointer;
  font-size: 0.88rem; font-weight: 600; color: #5B645E;
  padding: 0.55rem 0.9rem; border-radius: 999px;
  background: #fff; border: 1.5px solid #DDE3DC;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.cc-seg button:hover { background: #F1F5F1; color: #14231B; }
.cc-seg button.is-on { background: #1A5238; border-color: #1A5238; color: #fff; }
.cc-seg button:focus-visible { outline: 3px solid #E0A526; outline-offset: 2px; }
.cc-seg small { display: block; font-size: 0.72rem; font-weight: 500; opacity: 0.75; }

.cc-school { display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap; font-size: 0.95rem; color: #14231B; font-weight: 600; }
.cc-school span { font-size: 0.8rem; color: #8A9490; font-weight: 500; }
.cc-school.is-missing { color: #B91C1C; font-weight: 600; font-size: 0.9rem; }

.cc-consent { border-color: #DDE3DC; }
.cc-check { display: flex; gap: 0.75rem; align-items: flex-start; cursor: pointer; }
.cc-check input { margin-top: 3px; width: 17px; height: 17px; accent-color: #1A5238; flex-shrink: 0; }
.cc-check span { font-size: 0.9rem; color: #3C4A41; line-height: 1.6; }
.cc-letter { display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 0.9rem; font-size: 0.86rem; font-weight: 700; color: #1A5238; }
.cc-letter:hover { text-decoration: underline; }

/* The create row stays with the form rather than floating: the summary is the last check. */
.cc-create { display: flex; align-items: center; justify-content: space-between; gap: 1.25rem; flex-wrap: wrap; background: #fff; border: 1px solid #E2E6DF; border-radius: 20px; padding: 1.25rem 1.6rem; }
.cc-summary { font-size: 0.88rem; color: #5B645E; line-height: 1.5; }
.cc-summary strong { color: #14231B; font-weight: 700; }
.cc-go {
  appearance: none; font: inherit; font-size: 0.95rem; font-weight: 700; cursor: pointer;
  padding: 0.85rem 1.6rem; border-radius: 12px; border: 0;
  background: #1A5238; color: #fff; white-space: nowrap;
  transition: background 0.15s;
}
.cc-go:hover:not(:disabled) { background: #14422D; }
.cc-go:disabled { background: #C7D0C9; cursor: not-allowed; }
.cc-go:focus-visible { outline: 3px solid #E0A526; outline-offset: 2px; }
.cc-err { margin: 0 0 0.9rem; font-size: 0.86rem; font-weight: 600; color: #B91C1C; }

.cc-out { background: #fff; border: 1px solid #E2E6DF; border-radius: 20px; padding: 1.4rem 1.6rem; margin-top: 1rem; }
.cc-out-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.9rem; }
.cc-out-title { margin: 0; font-size: 1.05rem; font-weight: 700; color: #0A2F1F; }
.cc-out-syl { font-size: 0.78rem; color: #8A9490; }
.cc-out-row { display: flex; gap: 0.7rem; align-items: flex-start; padding: 0.6rem 0; border-top: 1px solid #EEF1EC; }
.cc-out-row:first-of-type { border-top: 0; padding-top: 0; }
.cc-out-code { flex-shrink: 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.72rem; font-weight: 700; color: #1A5238; background: #EAF2EC; border-radius: 6px; padding: 0.2rem 0.45rem; }
.cc-out-desc { font-size: 0.86rem; color: #5B645E; line-height: 1.5; }
.cc-out-note { margin: 0.9rem 0 0; padding-top: 0.8rem; border-top: 1px solid #EEF1EC; font-size: 0.82rem; color: #6B736D; line-height: 1.55; }
.cc-sheet {
  appearance: none; font: inherit; font-size: 0.86rem; font-weight: 700; cursor: pointer;
  display: inline-flex; align-items: center; gap: 0.45rem; margin-top: 1rem;
  padding: 0.6rem 1.1rem; border-radius: 999px; background: #fff; color: #1A5238; border: 1px solid #DDE3DC;
}
.cc-sheet:hover { background: #F1F5F1; border-color: #1A5238; }

.cc-back { appearance: none; font: inherit; font-size: 0.86rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.55rem 1.05rem; border-radius: 999px; background: #fff; color: #1A5238; border: 1px solid #DDE3DC; }
.cc-back:hover { background: #F1F5F1; border-color: #1A5238; }

@media (max-width: 720px) {
  .cc-progs { grid-template-columns: 1fr; }
  .cc-step, .cc-create, .cc-out { padding: 1.2rem 1.1rem; border-radius: 16px; }
  .cc-create { flex-direction: column; align-items: stretch; }
  .cc-go { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .cc-prog, .cc-seg button, .cc-go, .cc-input { transition: none; }
}
`;

/* ⚠️ Every line of copy here is read out of what the mode actually does. The old screen told
   teachers ZooYard was "three habitats" ending in "one real measurement": it has had EIGHT
   since 2026-09-29 and the measurement step was removed on 2026-10-01. A screen that sells a
   programme is as much a description of the product as a parent letter is. */
const PROGRAMMES = [
  { value:'taronga-sydney', name:'Tracka Trek', color:'#2E7D55',
    desc:'The day excursion. Students walk the zoo, observe animals, answer questions and earn badges for their school.',
    meta:'Taronga Sydney · pick a subject below' },
  { value:'zoosnooz-sydney', name:'ZooSnooz', color:'#7FA7E0',
    desc:'The night programme. Five animals, and the clips students film stitch into a documentary they keep.',
    meta:'Taronga Sydney · evening · filming' },
  { value:'school', name:'ZooYard', color:'#6E8B2A',
    desc:'Runs in your own schoolyard. Eight habitats, each ending in something the class builds or does for local wildlife.',
    meta:'At your school · no GPS needed · Science' },
  { value:'evolve-sydney', name:'Evolve', color:'#C08A1E',
    desc:'Stage 6 twilight. Five chapters of one story about leaving school, written and filmed into a short film they keep.',
    meta:'Taronga Sydney · Stage 6 · Life Ready · filming' },
  { value:'wildest-dreams-sydney', name:'Wildest Dreams', color:'#B4536E',
    desc:'Video first, built for support units. Students choose what they want to show about each animal and film it.',
    meta:'Taronga Sydney · no marks or scores · filming' },
  { value:'dubbo', name:'Taronga Dubbo', color:'#9AA398', soon:true,
    desc:'Not bookable through Tracka yet.', meta:'' },
];

const STAGES = [
  { v:1, label:'Stage 1', years:'K–2' },
  { v:2, label:'Stage 2', years:'3–4' },
  { v:3, label:'Stage 3', years:'5–6' },
  { v:4, label:'Stage 4', years:'7–8' },
  { v:5, label:'Stage 5', years:'9–10' },
];

const SUBJECTS = [
  { v:'science', label:'Science' },
  { v:'maths',   label:'Mathematics' },
  { v:'english', label:'English' },
  { v:'pdhpe',   label:'PDHPE' },
];

function generateClassCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ⚠️⚠️ TWO SYLLABUSES, SELECTED BY YEAR. Audited 2026-10-26 — run
//    `npx vite-node scripts/audit-outcomes.mjs` after touching anything here.
//
// Three things were wrong in this block before that audit:
//   1. The syllabus NAMES were invented. There is no "Science K–6 (2023)", no
//      "Mathematics K–6 (2023)" and no "English K–6 (2023)". The real names are below.
//   2. `ST2-5WT-T` is not a real outcome — no source could be found for it.
//   3. PDHPE used the 2018 codes (PD1-2, PD4-2) while `teacherInfoSheet.js` used the 2024 ones
//      (PH1-IHW-01). The app contradicted itself about the same class.
//
// NSW replaces TWO of the four areas from 2027, both withdrawn after December 2028:
//   Science and Technology K–6 (2017) -> (2024)
//   PDHPE K–10 (2018)                 -> PDHPE K–6 (2024) / PDHPE 7–10 (2024)
// English K–10 (2022), Mathematics K–10 (2022) and Science 7–10 (2023) are unaffected, so they
// are defined once and shared by both sets.
//
// 🚫 Do not delete the pre-2027 set before 2029 — a school still teaching it must see it.
// ⚠️ PDHPE 7–10 (2024) is staggered: Years 7 and 9 from 2027, Years 8 and 10 from 2028, so a
//    Stage 4/5 PDHPE class in 2027 may be on either syllabus. The label says so.
const SYLLABUS_2027_FROM = 2027;

const UNCHANGED = {
  maths: {
    syllabus: { 1:'Mathematics K–10 (2022)', 2:'Mathematics K–10 (2022)', 3:'Mathematics K–10 (2022)', 4:'Mathematics K–10 (2022)', 5:'Mathematics K–10 (2022)' },
    1: [{ code:'MA1-RWN-01', desc:'Applies place value to read, represent and order numbers' }],
    2: [{ code:'MA2-RN-01',  desc:'Applies place value to order, read and represent numbers' }],
    3: [{ code:'MA3-RN-01',  desc:'Compares, orders and calculates with fractions, decimals and percentages' }],
    4: [{ code:'MA4-NUM-C-01', desc:'Represents and operates with integers, decimals and fractions in a variety of contexts' }, { code:'MA4-STA-C-01', desc:'Classifies and displays data using a variety of statistical representations and interprets results' }],
    5: [{ code:'MA5-NUM-C-01', desc:'Selects and applies appropriate operations with real numbers' }],
  },
  english: {
    syllabus: { 1:'English K–10 (2022)', 2:'English K–10 (2022)', 3:'English K–10 (2022)', 4:'English K–10 (2022)', 5:'English K–10 (2022)' },
    1: [{ code:'EN1-VOCAB-01', desc:'Uses Tier 1 and Tier 2 vocabulary to understand and create texts' }, { code:'EN1-CWT-01', desc:'Plans and creates written texts for different purposes using simple sentences' }],
    2: [{ code:'EN2-VOCAB-01', desc:'Builds and extends vocabulary to communicate meaning' }, { code:'EN2-CWT-01', desc:'Plans, creates and revises imaginative, informative and persuasive texts' }],
    3: [{ code:'EN3-VOCAB-01', desc:'Selects vocabulary to enhance meaning when creating texts' }, { code:'EN3-CWT-01', desc:'Plans, creates and revises written texts for multiple purposes and audiences' }],
    4: [{ code:'EN4-URA-01', desc:'Analyses how meaning is created through language forms, features and structures' }],
    5: [{ code:'EN5-URA-01', desc:'Examines how increasingly complex language forms create meaning and position readers' }],
  },
};

// Stage 4-5 science is Science 7–10 (2023), unaffected by the K–6 change.
const SCIENCE_SECONDARY = {
  4: [{ code:'SC4-CLS-01', desc:'Describes the unique features of cells in living things and how structural features can be used to classify organisms' }, { code:'SC4-LIV-01', desc:'Describes the role, structure and function of a range of living systems and their components' }],
  5: [{ code:'SC5-CLS-01', desc:'Analyses and evaluates the structural and functional relationships of living systems' }],
};

const OUTCOMES_PRE_2027 = {
  science: {
    syllabus: { 1:'Science and Technology K–6 (2017)', 2:'Science and Technology K–6 (2017)', 3:'Science and Technology K–6 (2017)', 4:'Science 7–10 (2023)', 5:'Science 7–10 (2023)' },
    1: [{ code:'ST1-2DP-T', desc:'Identifies and uses materials for a variety of purposes.' }],
    // ⚠️ `ST2-5WT-T` used to sit here with a Design and Production description. It is not a real
    //    code. Replaced with the Living World outcome this stage genuinely has.
    2: [{ code:'ST2-4LW-S', desc:'Compares features and characteristics of living and non-living things.' }],
    3: [{ code:'ST3-4LW-S', desc:'Examines how the environment affects the growth, survival and adaptation of living things.' }],
    ...SCIENCE_SECONDARY,
  },
  pdhpe: {
    syllabus: { 1:'PDHPE K–10 (2018)', 2:'PDHPE K–10 (2018)', 3:'PDHPE K–10 (2018)', 4:'PDHPE K–10 (2018)', 5:'PDHPE K–10 (2018)' },
    1: [{ code:'PD1-2', desc:'Recognises and describes strategies people can use to feel comfortable, resilient and safe in situations' }],
    2: [{ code:'PD2-7', desc:'Describes strategies to make home and school healthy, safe and physically active spaces' }],
    3: [{ code:'PD3-7', desc:'Proposes and implements actions and protective strategies that promote health, safety, wellbeing and physically active spaces' }],
    4: [{ code:'PD4-2', desc:'Examines and demonstrates the role help-seeking strategies and behaviours play in supporting themselves and others' }],
    5: [{ code:'PD5-2', desc:'Researches and appraises the effectiveness of health information and support services available in the community' }],
  },
  ...UNCHANGED,
};

// ⚠️ Science Stage 1 and Stage 2 wordings are VERBATIM from curriculum.nsw.edu.au. PDHPE Stage 1
//    and Stage 2 likewise. 🚫 Everything marked below as unverified is a pattern-match on the
//    codes already used elsewhere in this app, NOT a transcription. See data/syllabusTransition.js.
const OUTCOMES_2027 = {
  science: {
    syllabus: { 1:'Science and Technology K–6 (2024)', 2:'Science and Technology K–6 (2024)', 3:'Science and Technology K–6 (2024)', 4:'Science 7–10 (2023)', 5:'Science 7–10 (2023)' },
    1: [{ code:'ST1-DDT-01', desc:science2024('ST1-DDT-01').desc }],
    // ⚠️⚠️ STAGE 2 LOSES ITS LIVING WORLD CONTENT. ST2-SCI-01 (2024) is the solar system and the
    //    effects of energy, so the old ST2-4LW-S has no Stage 2 equivalent. The design outcome is
    //    the honest one. 🚫 Do not substitute ST2-SCI-01 to keep the list looking full.
    2: [{ code:'ST2-DDT-01', desc:science2024('ST2-DDT-01').desc }],
    3: [{ code:'ST3-SCI-01', desc:science2024('ST3-SCI-01').desc }],
    ...SCIENCE_SECONDARY,
  },
  pdhpe: {
    syllabus: { 1:'PDHPE K–6 (2024)', 2:'PDHPE K–6 (2024)', 3:'PDHPE K–6 (2024)', 4:'PDHPE 7–10 (2024, Years 7 and 9 from 2027)', 5:'PDHPE 7–10 (2024, Years 7 and 9 from 2027)' },
    1: [{ code:'PH1-IHW-01', desc:'Describes factors that contribute to identity, health and wellbeing' }],
    2: [{ code:'PH2-IHW-01', desc:'Explains how related factors influence identity, health and wellbeing' }],
    // ⚠️ CORROBORATED, NOT PRIMARY — the NSW K-6 outcomes page truncates before Stage 3. Two
    //    independent sources agree on this wording and it fits the stage progression. Pulled from
    //    the single source so it cannot drift from teacherInfoSheet.js.
    3: [{ code:'PH3-IHW-01', desc:pdhpeK6_2024('PH3-IHW-01').desc }],
    // ✅ Stage 4 and Stage 5 are VERBATIM, pulled from the single source so they cannot drift.
    4: [{ code:'PH4-IBC-01', desc:pdhpe2024('PH4-IBC-01').desc }],
    5: [{ code:'PH5-IBC-01', desc:pdhpe2024('PH5-IBC-01').desc }],
  },
  ...UNCHANGED,
};

const NSW_OUTCOMES = new Date().getFullYear() >= SYLLABUS_2027_FROM ? OUTCOMES_2027 : OUTCOMES_PRE_2027;


export default function CreateClassScreen() {
  const { setCurrentScreen, teacherEmail, teacher, authLoading, demoMode, teacherProfile } = useApp();

  useEffect(() => {
    if (!authLoading && !teacher && !demoMode) setCurrentScreen('teacherLogin');
  }, [teacher, authLoading, demoMode, setCurrentScreen]);

  const [newClassName,    setNewClassName]    = useState('');
  const [newClassStage,   setNewClassStage]   = useState(4);
  const schoolName = teacherProfile?.schoolName || '';
  const [newLocation,     setNewLocation]     = useState('taronga-sydney');
  const [newSubject,      setNewSubject]      = useState('science');
  const [zzConsentChecked, setZzConsentChecked] = useState(false);
  const [creatingClass,   setCreatingClass]   = useState(false);
  const [createError,     setCreateError]     = useState('');
  const [showWwzModal,    setShowWwzModal]    = useState(false);

  const isZooSnooz = newLocation === 'zoosnooz-sydney';
  const isZooYard  = newLocation === 'school';
  const isEvolve   = newLocation === 'evolve-sydney';
  const isWildest  = newLocation === 'wildest-dreams-sydney';
  // ⚠️ THE THREE MODES THAT FILM STUDENTS, each with its own parent letter. 🚫 Adding a mode
  //    that records video means adding it here, or it creates classes with no consent step —
  //    which is exactly how Evolve and Wildest Dreams went without one.
  // ⚠️ ZooYard photographs the schoolyard and the student's build, not the student, so it is
  //    deliberately absent.
  const FILMING_MODES = {
    zoosnooz: { label: 'ZooSnooz', letter: '/zoosnooz-notification.html' },
    evolve:   { label: 'Evolve',   letter: '/evolve-notification.html' },
    wildest:  { label: 'Wildest Dreams', letter: '/wildest-dreams-notification.html' },
  };
  const filmingMode = isZooSnooz ? FILMING_MODES.zoosnooz
    : isEvolve ? FILMING_MODES.evolve
    : isWildest ? FILMING_MODES.wildest
    : null;

  const createClass = async () => {
    if (!newClassName.trim() || !schoolName) return;
    // ⚠️ Wording tracks the checkbox above — it is a commitment to obtain consent, not a claim
    //    that it already exists.
    // ⚠️ ALL THREE FILMING MODES, not just ZooSnooz. Evolve films a piece to camera at every
    //    chapter and Wildest Dreams is video from end to end; both were creating classes with no
    //    consent step at all until 2026-11-07.
    if (filmingMode && !zzConsentChecked) { setCreateError(`Please confirm you will obtain filming consent before creating a ${filmingMode.label} class.`); return; }
    setCreateError('');
    setCreatingClass(true);
    try {
      const code        = generateClassCode();
      const sessionDate = new Date().toISOString().split('T')[0];
      const sessionType = isWildest ? 'wildest-dreams' : isEvolve ? 'evolve' : isZooYard ? 'zooyard' : isZooSnooz ? 'zoosnooz' : 'standard';
      const VENUES = { 'taronga-sydney':'Taronga Sydney', 'zoosnooz-sydney':'Taronga Sydney', 'evolve-sydney':'Taronga Sydney', 'wildest-dreams-sydney':'Taronga Sydney', 'dubbo':'Taronga Dubbo', 'school':'School' };
      const venue = VENUES[newLocation] || 'Taronga Zoo';
      const subject = isWildest ? null : isEvolve ? 'life-ready' : isZooYard ? 'science' : isZooSnooz ? null : newSubject;
      const stage   = isEvolve ? 6 : newClassStage;

      await setDoc(doc(db, 'teachers', teacherEmail, 'classes', code), {
        classCode: code, className: newClassName.trim(), schoolName,
        stage, accessCodeUsed: null,
        venue, createdAt: serverTimestamp(), archived: false,
        sessionClosed: false, sessionDate, sessionType,
        location: newLocation, subject,
      });
      await setDoc(doc(db, 'classes', code), {
        classCode: code, className: newClassName.trim(), schoolName,
        stage, teacherEmail, accessCodeUsed: null,
        venue, createdAt: serverTimestamp(), sessionClosed: false, sessionDate, sessionType,
        location: newLocation, subject,
      });

      // Award location-specific expedition points once per school (non-blocking)
      try {
        const EXPEDITION_AWARDS = {
          'taronga-sydney':  { id:'expedition-sydney',   points:25 },
          'zoosnooz-sydney': { id:'expedition-zoosnooz', points:40 },
          'dubbo':           { id:'expedition-dubbo',    points:35 },
          'school':          { id:'expedition-school',   points:20 },
        };
        const award = EXPEDITION_AWARDS[newLocation] || EXPEDITION_AWARDS['taronga-sydney'];
        const schoolId = schoolName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        const schoolSnap = await getDoc(doc(db, 'schools', schoolId));
        const awarded = schoolSnap.exists() ? (schoolSnap.data().awardedChallenges || []) : [];
        if (!awarded.includes(award.id)) {
          await setDoc(doc(db, 'schools', schoolId), {
            name: schoolName,
            totalPoints: increment(award.points),
            awardedChallenges: arrayUnion(award.id),
            lastUpdated: serverTimestamp(),
          }, { merge: true });
        }
      } catch {}

      setNewClassName(''); setZzConsentChecked(false);
      setNewLocation('taronga-sydney'); setNewSubject('science');
      setShowWwzModal(true);
    } catch (err) {
      console.error('Create class error:', err);
      setCreateError(err.message || 'Failed to create class. Please try again.');
    } finally {
      setCreatingClass(false);
    }
  };

  // 'wildest-dreams' is not one of the four subjects, so it falls out of the NSW_OUTCOMES lookup
  // below and out of the subject panel's condition. It gets its own panel instead.
  const displaySubject = isWildest ? 'wildest-dreams' : isEvolve ? 'life-ready' : (isZooSnooz || isZooYard) ? 'science' : newSubject;
  const wdOutcomes = isWildest ? (WD_OUTCOMES[newClassStage] || WD_OUTCOMES[4]) : null;
  const subjectData  = NSW_OUTCOMES[displaySubject];
  const outcomes     = subjectData?.[newClassStage] || [];
  const syllabusName = subjectData?.syllabus?.[newClassStage] || '';

  const prog = PROGRAMMES.find(p => p.value === newLocation) || PROGRAMMES[0];
  const showSubject = !isZooSnooz && !isZooYard && !isEvolve && !isWildest;
  const canCreate = !!newClassName.trim() && !!schoolName && !creatingClass && (!filmingMode || zzConsentChecked);
  const stageLabel = isEvolve ? 'Stage 6' : `Stage ${newClassStage}`;
  const subjectLabel = showSubject ? (SUBJECTS.find(x => x.v === newSubject)?.label || '') : '';

  return (
    <>
    <div className="lms-page cc-root">
      <style>{CC_CSS}</style>

      {/* Topbar */}
      <div className="lms-topbar">
        <div className="lms-topbar-brand">
          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'var(--t-deep)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <img src="/images/logo.png" alt="Taronga" style={{ height:'32px', width:'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>TARONGA TRACKA</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · {teacherEmail}</p>
          </div>
        </div>
        <button className="cc-back" onClick={() => setCurrentScreen('teacherDashboard')}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 8H3m0 0 4-4M3 8l4 4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Dashboard
        </button>
      </div>

      <div className="lms-main" style={{ flex:1, overflowY:'auto' }}>
        <div className="cc-wrap">

          <header className="cc-head">
            <h2 className="heading-display cc-title">Create a class</h2>
            <p className="cc-lede">It takes about a minute, and ends with a six character code your students type in on the day.</p>
          </header>

          {/* ── 1. Programme ── */}
          <section className="cc-step">
            <p className="cc-step-n">Step 1</p>
            <h3 className="cc-h3">Which programme is this class doing?</h3>
            <div className="cc-progs">
              {PROGRAMMES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  className={newLocation === p.value ? 'cc-prog is-on' : 'cc-prog'}
                  style={{ '--p': p.color }}
                  disabled={!!p.soon}
                  aria-pressed={newLocation === p.value}
                  onClick={() => setNewLocation(p.value)}
                >
                  {newLocation === p.value && (
                    <svg className="cc-prog-tick" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="currentColor"/><path d="m6 10.2 2.6 2.6L14 7.4" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                  <span className="cc-prog-name">
                    <span className="cc-prog-dot" />
                    {p.name}
                    {p.soon && <span className="cc-soon">Coming soon</span>}
                  </span>
                  <span className="cc-prog-desc">{p.desc}</span>
                  {p.meta && <span className="cc-prog-meta">{p.meta}</span>}
                </button>
              ))}
            </div>
          </section>

          {/* ── 2. The class ── */}
          <section className="cc-step">
            <p className="cc-step-n">Step 2</p>
            <h3 className="cc-h3">Tell us about the class</h3>

            <div className="cc-field">
              <label className="cc-label" htmlFor="cc-name">Class name</label>
              <input id="cc-name" className="cc-input" type="text" value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
                placeholder="7A, Biology, Koala Crew" />
              <p className="cc-hint">Only you and your students see this. It is what the class is called on your dashboard.</p>
            </div>

            {/* Evolve is Stage 6 by definition, and the list only runs to Stage 5, so it could
                never have been set correctly from here. */}
            {!isEvolve && (
              <div className="cc-field">
                <label className="cc-label">NSW stage</label>
                <div className="cc-seg">
                  {STAGES.map(st => (
                    <button key={st.v} type="button" aria-pressed={newClassStage === st.v}
                      className={newClassStage === st.v ? 'is-on' : undefined}
                      onClick={() => setNewClassStage(st.v)}>
                      {st.label}<small>{st.years}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showSubject && (
              <div className="cc-field">
                <label className="cc-label">Subject</label>
                <div className="cc-seg">
                  {SUBJECTS.map(sub => (
                    <button key={sub.v} type="button" aria-pressed={newSubject === sub.v}
                      className={newSubject === sub.v ? 'is-on' : undefined}
                      onClick={() => setNewSubject(sub.v)}>
                      {sub.label}
                    </button>
                  ))}
                </div>
                <p className="cc-hint">Sets the questions, the writing prompts and what the marking looks for. Geography, Ngara Nura, Technology and Visual Arts are still being written.</p>
              </div>
            )}

            {!showSubject && (
              <div className="cc-field">
                <label className="cc-label">Subject</label>
                <p className="cc-hint" style={{ margin:0 }}>
                  {isEvolve ? 'Evolve is Life Ready, Stage 6. Both are set for you.'
                    : isZooYard ? 'ZooYard is Science. It is set for you.'
                    : isWildest ? 'Wildest Dreams has no subject. The outcomes below follow the stage you picked.'
                    : 'ZooSnooz has no subject. The night missions are the same for every class.'}
                </p>
              </div>
            )}

            <div className="cc-field">
              <label className="cc-label">School</label>
              {schoolName
                ? <p className="cc-school">{schoolName} <span>from your profile</span></p>
                : <p className="cc-school is-missing">No school on your profile yet. Add it on the dashboard first, or your classes cannot earn points.</p>}
            </div>
          </section>

          {/* ── 3. Consent, for the three programmes that record video ── */}
          {filmingMode && (
            <section className="cc-step cc-consent">
              <p className="cc-step-n">Step 3</p>
              <h3 className="cc-h3">Filming consent</h3>
              <label className="cc-check">
                <input type="checkbox" checked={zzConsentChecked} onChange={e => setZzConsentChecked(e.target.checked)} />
                {/* ⚠️ FUTURE TENSE, DELIBERATELY. This read "consent ... has been obtained",
                    which asks a teacher to attest to something they have usually not done
                    yet at the point of creating the class. Cameron, 2026-11-07: "putting it
                    back on teacher".
                    🚫 Do not turn this into a per-student consent flag. CLAUDE.md records that
                       as a closed decision: consent lives with the school, both parent letters
                       run an opt-out model, and a student who may not be filmed becomes crew. */}
                <span>
                  I confirm that I will obtain appropriate consent for video filming from the
                  families of all participating students, in accordance with my school&rsquo;s policies.
                </span>
              </label>
              {/* ⚠️ The letter is HTML, not a PDF, and that is the house pattern: every printable
                  in this app is a self-contained page the browser prints or saves as a PDF.
                  🚫 Do not add a separate PDF copy. It would be a second version of the same
                     letter to keep in step, and this one already went home to families with a
                     claim that had to be corrected once. */}
              <a className="cc-letter" href={filmingMode.letter} target="_blank" rel="noopener noreferrer">
                {filmingMode.label} parent letter and opt-out slip ↗
              </a>
              <p className="cc-hint">Print it or save it as a PDF from your browser, and send it home before the excursion.</p>
            </section>
          )}

          {/* ── Create ── */}
          {createError && <p className="cc-err">{createError}</p>}
          <div className="cc-create">
            <p className="cc-summary">
              Creating <strong>{newClassName.trim() || 'an unnamed class'}</strong>
              {': '}<strong>{prog.name}</strong>
              {' · '}<strong>{stageLabel}</strong>
              {subjectLabel ? <> · <strong>{subjectLabel}</strong></> : null}
              {schoolName ? <> · {schoolName}</> : null}
            </p>
            <button className="cc-go" onClick={createClass} disabled={!canCreate}>
              {creatingClass ? 'Creating…' : 'Create class'}
            </button>
          </div>

          {/* ── Outcomes ── */}
          {(displaySubject === 'science' || displaySubject === 'maths' || displaySubject === 'pdhpe' || displaySubject === 'english') && (
            <div className="cc-out">
              <div className="cc-out-head">
                <h3 className="cc-out-title">What this covers, {stageLabel.toLowerCase()}</h3>
                <span className="cc-out-syl">{syllabusName}</span>
              </div>
              {outcomes.map(({ code, desc }) => (
                <div key={code} className="cc-out-row">
                  <span className="cc-out-code">{code}</span>
                  <span className="cc-out-desc">{desc}</span>
                </div>
              ))}
              <button className="cc-sheet" onClick={() => openTeacherInfoSheet(displaySubject, newClassStage, outcomes)}>
                Teacher information sheet ↗
              </button>
            </div>
          )}

          {/* Wildest Dreams: its own panel, because the outcomes differ by pathway and the mode
              has no scoring, so there is no marking rubric to offer alongside them. */}
          {isWildest && wdOutcomes && (
            <div className="cc-out">
              <div className="cc-out-head">
                <h3 className="cc-out-title">{wdOutcomes.lifeSkills ? 'Life Skills outcomes' : 'What this covers'}, {stageLabel.toLowerCase()}</h3>
                <span className="cc-out-syl">{wdOutcomes.syllabus}</span>
              </div>
              {wdOutcomes.outcomes.map(({ code, desc }) => (
                <div key={code} className="cc-out-row">
                  <span className="cc-out-code">{code}</span>
                  <span className="cc-out-desc">{desc}</span>
                </div>
              ))}
              <p className="cc-out-note">{wdOutcomes.lifeSkills ? WD_OUTCOMES_NOTE.secondary : WD_OUTCOMES_NOTE.primary}</p>
              <button className="cc-sheet" onClick={() => openWildestDreamsInfoSheet(newClassStage)}>
                Teacher information sheet ↗
              </button>
            </div>
          )}

        </div>
      </div>
    </div>

    {/* Who's Who modal */}
    {showWwzModal && (
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }} onClick={() => setShowWwzModal(false)}>
        <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'20px', maxWidth:'480px', width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)', overflow:'hidden' }}>
          <div style={{ background:'#0A2F1F', padding:'22px 28px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <p style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', marginBottom:'4px' }}>Class Created</p>
              <h3 style={{ fontFamily:'TarongaHeadline, DM Sans, sans-serif', fontSize:'1.3rem', fontWeight:'normal', color:'white', letterSpacing:'0.04em', margin:0 }}>Who's Who in the Zoo?</h3>
            </div>
            <button onClick={() => setShowWwzModal(false)} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'50%', width:'32px', height:'32px', color:'white', fontSize:'1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>
          <div style={{ padding:'24px 28px' }}>
            <div style={{ background:'#e8f5ed', border:'1px solid #b6d9c3', borderRadius:'10px', padding:'12px 14px', marginBottom:'16px', display:'flex', gap:'10px', alignItems:'flex-start' }}>
              <span style={{ fontSize:'18px', flexShrink:0, color:'#1B6B3A' }}>⊞</span>
              <p style={{ fontSize:'0.83rem', color:'#1a4a2a', lineHeight:1.65, margin:0 }}><strong>Students are de-identified for privacy.</strong> Each student picks an animal alias — their real name is never stored in the app.</p>
            </div>
            <p style={{ fontSize:'0.83rem', color:'#444', lineHeight:1.7, marginBottom:'14px' }}>Print the <strong>Who's Who in the Zoo</strong> document and fill it in during the excursion. Keep it secure.</p>
            <a href="/whos-who-in-the-zoo.pdf" target="_blank" rel="noopener noreferrer"
              style={{ display:'block', width:'100%', padding:'0.85rem', borderRadius:'12px', background:'#1A5238', color:'white', fontSize:'0.9rem', fontWeight:700, textDecoration:'none', textAlign:'center', marginBottom:'0.6rem', boxSizing:'border-box' }}>
              Open Who's Who in the Zoo
            </a>
            <button onClick={() => { setShowWwzModal(false); setCurrentScreen('teacherDashboard'); }}
              style={{ width:'100%', padding:'0.8rem', borderRadius:'12px', border:'1px solid #DDE3DC', background:'#fff', color:'#5B645E', fontSize:'0.88rem', fontWeight:700, cursor:'pointer' }}>
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
