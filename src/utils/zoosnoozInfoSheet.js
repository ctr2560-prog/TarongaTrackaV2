import { ZOOSNOOZ_ANIMALS } from '../data/zoosnoozAnimals.js';

const BRAND = {
  night:      '#040D08',
  forest:     '#071E14',
  deep:       '#0A2F1F',
  mid:        '#1A5238',
  teal:       '#0D9488',
  tealLight:  '#CCFBF1',
  tealBorder: '#99F6E4',
  lime:       '#B6F61A',
  limeDark:   '#7DAD0E',
  orange:     '#FF8C42',
  mist:       '#A8C4B2',
  foam:       '#E8F2EC',
  parchment:  '#FAF8F4',
  ink:        '#1A1A17',
  charcoal:   '#3D3D38',
  slate:      '#6B6B62',
};

// ── NSW Science outcomes — Biological Sciences / Working Scientifically ──────
// Source: Science and Technology K–6 Syllabus (2017) + Science 7–10 Syllabus (2023)
// ZooSnooz focus: structural and behavioural adaptations, organism-environment
// interactions, and Working Scientifically observation skills.
const ZZ_OUTCOMES = {
  2: [
    { code: 'ST2-1WS-S', desc: 'Conducts investigations by observing, questioning, planning, predicting, testing and communicating' },
    { code: 'ST2-4LW-S', desc: 'Compares features of living things and examines how environments affect living things and their survival' },
  ],
  3: [
    { code: 'ST3-1WS-S', desc: 'Plans and conducts scientific investigations to answer questions or solve problems' },
    { code: 'ST3-4LW-S', desc: 'Examines the role of living things in the environment and the effect of environmental change on living things' },
  ],
  4: [
    { code: 'SC4-WS-01',  desc: 'Uses scientific tools and instruments to make and record observations, and represents and analyses data to identify patterns and draw conclusions' },
    { code: 'SC4-LIV-01', desc: 'Describes the role, structure and function of a range of living systems and their components, and explains how structural features relate to function' },
  ],
  5: [
    { code: 'SC5-WS-01',  desc: 'Selects and uses scientific tools and instruments for accurate observations; collects, represents and analyses data to justify conclusions' },
    { code: 'SC5-WS-08',  desc: 'Communicates scientific arguments with evidence, using scientific language and terminology in a range of communication forms' },
    { code: 'SC5-GEV-01', desc: 'Describes how the diversity of living things relates to the theory of evolution by natural selection, including structural and behavioural adaptations' },
  ],
};

const STAGE_EXPECTATIONS = {
  2: { label: 'Stage 2 · Years 3–4', minWords: 20,  expectation: 'Students provide a basic description of what they observed, including at least one specific detail about the animal\'s body or behaviour. Simple sentences with some attempt at scientific vocabulary are appropriate at this stage.', starters: ['"I saw the…"', '"Its body looks like…"', '"I think this helps it…"', '"Something interesting was…"'] },
  3: { label: 'Stage 3 · Years 5–6', minWords: 35,  expectation: 'Students connect what they observed to a survival or adaptation concept. Responses should include at least two specific observations and a clear attempt to explain why, using vocabulary introduced during the session.', starters: ['"I observed that…"', '"This adaptation helps the animal by…"', '"A key feature I noticed was…"', '"This behaviour suggests that…"'] },
  4: { label: 'Stage 4 · Years 7–8', minWords: 50,  expectation: 'Students describe specific behaviours and physical features, and explain how these connect to the animal\'s survival strategy or ecological role. Responses should use subject-specific terminology and show analytical reasoning.', starters: ['"The evidence suggests…"', '"This adaptation is advantageous because…"', '"I observed that the animal…, which indicates…"', '"One key behaviour I noted was…"'] },
  5: { label: 'Stage 5 · Years 9–10', minWords: 65, expectation: 'Students analyse observed behaviour and physical features at a conceptual level, connecting to broader scientific ideas (evolution, ecology, conservation). Responses should be structured, precise, and demonstrate understanding of the concept heading for the animal.', starters: ['"The observed data supports the hypothesis that…"', '"This structural adaptation provides a selective advantage by…"', '"In terms of ecological function…"', '"The relationship between the organism and its environment is demonstrated by…"'] },
};

// ── SVG icon helpers ─────────────────────────────────────────────────────────

function svgDownloadIcon() {
  return `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1v9m0 0L5 7m3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function svgMoon(color = 'currentColor', size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 9.5A6.5 6.5 0 016 2a6.5 6.5 0 100 12 6.5 6.5 0 007.5-4.5z" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function svgLightbulb(color = 'currentColor', size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 13h4M8 13v2M8 1a4 4 0 014 4c0 1.5-.8 2.8-2 3.5V11H6V8.5A4 4 0 018 1z" stroke="${color}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function svgSignal(color = 'currentColor', size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12a9 9 0 0114 0M4 9a5 5 0 018 0M7 12a1 1 0 012 0" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/></svg>`;
}

function svgQuestionMark(color = 'currentColor', size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6a2 2 0 114 0c0 1.5-2 2-2 3.5M8 12.5v.5" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/></svg>`;
}

function svgPencil(color = 'currentColor', size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 2.5l2 2-7.5 7.5H4v-2l7.5-7.5z" stroke="${color}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function svgVideo(color = 'currentColor', size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="9" height="8" rx="1.5" stroke="${color}" stroke-width="1.4"/><path d="M10 6.5l5-2v7l-5-2V6.5z" stroke="${color}" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
}

function svgBadge(color = 'currentColor', size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="7" r="4.5" stroke="${color}" stroke-width="1.4"/><path d="M5.5 11.5L4 15l4-2 4 2-1.5-3.5" stroke="${color}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function svgEye(color = 'currentColor', size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 8C1 8 3.5 3 8 3s7 5 7 5-2.5 5-7 5S1 8 1 8z" stroke="${color}" stroke-width="1.5"/><circle cx="8" cy="8" r="2" stroke="${color}" stroke-width="1.5"/></svg>`;
}

function svgMicroscope(color = 'currentColor', size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3l2 2-3 3-2-2 3-3z" stroke="${color}" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 5l1 1" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/><path d="M5 9a3 3 0 106 0" stroke="${color}" stroke-width="1.4"/><path d="M3 14h10M8 12v2" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/></svg>`;
}

function svgLightning(color = 'currentColor', size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 2L5 9h4L6.5 14 12 7H8L9.5 2z" stroke="${color}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function svgMic(color = 'currentColor', size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5.5" y="1" width="5" height="8" rx="2.5" stroke="${color}" stroke-width="1.4"/><path d="M3 8a5 5 0 0010 0M8 13v2M6 15h4" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/></svg>`;
}

function svgHand(color = 'currentColor', size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v7M6 3v6M4 5v4M10 3v6M12 7c0-1-.5-2-2-2V7l1 6H7L5 9" stroke="${color}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function svgFlashlight(color = 'currentColor', size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2h8l-1 5H5L4 2z" stroke="${color}" stroke-width="1.4" stroke-linejoin="round"/><path d="M5 7l-1 7h8l-1-7" stroke="${color}" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 9v3" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/></svg>`;
}

function svgDoc(color = 'currentColor', size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="1" width="10" height="14" rx="1.5" stroke="${color}" stroke-width="1.4"/><path d="M6 5h4M6 8h4M6 11h2" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/></svg>`;
}

const INTERACTION_ICONS = {
  energy:  { svgFn: svgLightning, label: 'Energy Tracker',    description: 'Students hold a button while the animal moves and release when it is still, generating a live energy/stillness graph over 30 seconds.' },
  sound:   { svgFn: svgMic,       label: 'Sound Monitor',     description: 'Students hold their device near the enclosure; the microphone captures ambient volume levels around the lion over 30 seconds.' },
  haptic:  { svgFn: svgHand,      label: 'Motion Simulator',  description: 'Students drag their finger across a haptic pad to simulate the rhino\'s movement, experiencing the weight and momentum of a 2,700 kg animal.' },
  light:   { svgFn: svgFlashlight, label: 'Light Scanner',    description: 'Students activate the night scanner and point their camera at the binturong\'s enclosure; the tool measures ambient light levels to assess how well the camouflage works in real time.' },
  sketch:  { svgFn: svgPencil,    label: 'Feature Sketch',    description: 'Students sketch the sun bear\'s physical features directly in the app and label the adaptations they observe — claws, tongue, chest patch, body shape.' },
};

const SCORING_DOMAINS = [
  {
    svgFn: svgEye,
    label: 'Behavioural Observation',
    what: 'Did the student describe specific, accurate behaviours they actually observed?',
    criteria: [
      'Describes at least one specific behaviour or action',
      'Uses accurate, observable language (not guessing or imagining)',
      'Distinguishes between what they saw vs. what they inferred',
    ],
    full:    '5 pts — Two or more specific, accurate behaviours described with correct terminology',
    partial: '3 pts — At least one accurate behaviour described; may lack specificity or use imprecise language',
    minimal: '1 pt  — Vague or general description; no clear reference to observed behaviour',
  },
  {
    svgFn: svgMicroscope,
    label: 'Scientific Detail',
    what: 'Did the student include specific physical details, measurements, or structural features?',
    criteria: [
      'References a physical feature (e.g. horn, fur, claw, size)',
      'Connects a feature to a function or survival advantage',
      'Uses vocabulary introduced in the session (concept chips, keeper insight)',
    ],
    full:    '5 pts — Accurate feature description clearly linked to a function or adaptation concept',
    partial: '3 pts — Feature mentioned but connection to function is unclear or partially correct',
    minimal: '1 pt  — Only general description; no reference to specific physical features',
  },
  {
    svgFn: svgPencil,
    label: 'Written Expression',
    what: 'Is the response clearly written with enough detail to communicate the observation?',
    criteria: [
      'Meets minimum word count for the stage',
      'Uses complete sentences (Stage 3+: includes explanation, not just description)',
      'Vocabulary is appropriate to the stage and subject',
    ],
    full:    '5 pts — Clearly written response meeting or exceeding word count; well-structured explanation',
    partial: '3 pts — Sufficient length but expression is unclear or ideas are underdeveloped',
    minimal: '1 pt  — Below minimum length or response is difficult to interpret',
  },
];

const VIDEO_GUIDE = [
  { num: '01', heading: 'Camera Access',       body: 'Students tap "Start Recording" at the video phase of each animal mission. The app requests rear-camera access. Ensure students understand they need to grant camera and microphone permissions when prompted — this only happens once per session.' },
  { num: '02', heading: '10-Second Clips',     body: 'Each clip is exactly 10 seconds. A progress arc shows the recording countdown. Students cannot restart a clip once recording begins, so encourage them to think briefly about their framing before tapping the record button.' },
  { num: '03', heading: 'Filming Guidance',    body: 'Each animal has specific filming guidance built into the app, shown before the student records. These cues help students capture the most visually compelling moment — for example, the stillness of the tiger or the scale of the rhino. Share these cues with students before they reach each enclosure.' },
  { num: '04', heading: 'Upload and Storage',  body: 'Clips upload automatically to Firebase Storage at path zoosnooz/{classCode}/{studentId}/{animalId}. Upload progress is shown as a percentage. If a student\'s upload fails (check for network issues or Storage rules), their clip is still saved locally for the remainder of the session.' },
];

const STITCH_GUIDE = [
  { num: '01', heading: 'When It Runs',         body: 'After completing all five animals, students reach the Collection screen showing their full badge set. Tapping "Create Documentary" triggers the stitching pipeline. This runs entirely in the browser — no server processing is required.' },
  { num: '02', heading: 'What Gets Created',    body: 'The pipeline assembles: (1) an animated title card with the student\'s name, (2) each 10-second clip in sequence with an animal name overlay and clip counter, and (3) a Taronga-branded credits card. Output is a single 1280×720 video file.' },
  { num: '03', heading: 'Device Compatibility', body: 'The stitching pipeline uses MediaRecorder and Canvas APIs, supported on all modern iOS, Android, and desktop browsers. If a student\'s device cannot run the pipeline, they receive a fallback message and their individual clips remain saved.' },
  { num: '04', heading: 'Processing Time',      body: 'Stitching typically takes 30–90 seconds depending on the device. Students see a live progress animation while it runs. Remind students not to lock their screen or leave the app during this phase, as doing so will interrupt the pipeline.' },
  { num: '05', heading: 'Final Submit',         body: 'After previewing their documentary, students tap Submit. This uploads the stitched video to Firebase Storage and writes a full session summary to the zoosnooz_docs Firestore collection.' },
];

const NFC_GUIDE = [
  { num: '01', heading: 'Physical NFC Tags',  body: 'Each enclosure has a physical NFC sticker. Students can tap any NFC-capable device to the tag at any time — during the excursion or on a future visit. The tag links directly to that student\'s ZooSnooz record for that animal.' },
  { num: '02', heading: 'Post-Excursion Use', body: 'Students can tap NFC tags on subsequent visits. The data persists indefinitely unless the class is manually deleted from the staff portal. Consider using the tags as a prompt for classroom discussion or a display activity after the excursion.' },
];

const PORTAL_GUIDE = [
  { num: '01', heading: 'Accessing ZooSnooz Data', body: 'In the Teacher Portal, navigate to your class and open the Class Details screen. ZooSnooz data appears in a dedicated tab below the standard Tracka analytics. You will see each student\'s per-animal score breakdown alongside their daytime activity scores.' },
  { num: '02', heading: 'Score Breakdown',         body: 'For each animal, you can see: (1) the observation score across 3 domains, (2) whether the MCQ was answered correctly on the first attempt, (3) total points for that animal (max 120), and (4) whether a video was recorded and uploaded.' },
  { num: '03', heading: 'Viewing Observations',    body: 'Tap any student row to expand their full written response for each animal, including the AI-generated score rationale, improvement tips, and extracted evidence. You can override any domain score if you disagree with the automated assessment.' },
  { num: '04', heading: 'Documentary Access',      body: 'If a student completed the documentary stitching step, a "View Documentary" link appears on their student row. This plays the stitched video directly in the portal. Individual animal clips are also accessible from this view.' },
  { num: '05', heading: 'Total Points',            body: 'ZooSnooz total points (max 600 across 5 animals) are shown on the student row. These do not combine with daytime Tracka points — they are tracked separately to reflect the distinct nature of the night-mode experience.' },
];

export function openZooSnoozInfoSheet(stage) {
  const stageNum  = parseInt(stage, 10);
  const stageMeta = STAGE_EXPECTATIONS[stageNum] || STAGE_EXPECTATIONS[4];
  const outcomes  = ZZ_OUTCOMES[stageNum] || ZZ_OUTCOMES[4];
  const syllabusLabel = stageNum <= 3
    ? 'Science and Technology K–6 Syllabus (2017)'
    : 'Science 7–10 Syllabus (2023)';
  const origin    = window.location.origin;
  const today     = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

  // ── Animal rows ──────────────────────────────────────────────────────────
  const animalRows = ZOOSNOOZ_ANIMALS.map((animal, i) => {
    const stageData    = animal.byStage?.[stageNum] || {};
    const obsPrompt    = stageData.observationPrompt || animal.observationPrompt;
    const keeperQ      = stageData.keeperQ           || animal.keeperPrompts?.[0] || '';
    const question     = stageData.question          || animal.question;
    const options      = stageData.options           || animal.options;
    const correct      = stageData.correct           !== undefined ? stageData.correct : animal.correct;
    const interact     = INTERACTION_ICONS[animal.interaction?.type] || { svgFn: svgSignal, label: animal.interaction?.type, description: '' };
    const interactSvg  = interact.svgFn('#0D9488', 13);

    const optionHtml = (options || []).map((opt, j) => `
      <div class="mcq-opt ${j === correct ? 'mcq-correct' : ''}">
        <span class="mcq-letter">${String.fromCharCode(65 + j)}</span>
        <span>${opt}${j === correct ? ' <span class="mcq-tick">&#10003;</span>' : ''}</span>
      </div>`).join('');

    return `
    <div class="animal-card">
      <div class="animal-header">
        <div class="animal-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="animal-header-main">
          <div class="animal-name">${animal.name}</div>
          <div class="animal-sci">${animal.scientificName}</div>
        </div>
        <div class="animal-interact-chip">
          <span class="interact-icon">${interactSvg}</span>
          ${interact.label}
        </div>
      </div>

      <div class="animal-concept">${animal.conceptHeading}</div>

      <div class="animal-grid">
        <div class="animal-col">
          <div class="col-label">Sensor Interaction</div>
          <p class="col-body">${interact.description}</p>
        </div>
        <div class="animal-col">
          <div class="col-label">Keeper Question (prompt students to ask)</div>
          <p class="col-body col-italic">"${keeperQ}"</p>
        </div>
        <div class="animal-col animal-col-wide">
          <div class="col-label">Observation Prompt — Stage ${stageNum}</div>
          <p class="col-body">${obsPrompt}</p>
        </div>
      </div>

      <div class="mcq-section">
        <div class="col-label">Multiple Choice Question — Stage ${stageNum}</div>
        <p class="mcq-q">${question}</p>
        <div class="mcq-opts">${optionHtml}</div>
      </div>

      <div class="filming-note">
        <span class="filming-label">Filming guidance: </span>${(animal.filmingGuidance || '').replace(/\n/g, ' ')}
      </div>
    </div>`;
  }).join('');

  // ── Scoring domain cards ─────────────────────────────────────────────────
  const domainCards = SCORING_DOMAINS.map(d => `
    <div class="domain-card">
      <div class="domain-hd">
        <span class="domain-icon">${d.svgFn('#0D9488', 14)}</span>
        <div>
          <div class="domain-name">${d.label}</div>
          <div class="domain-pts">5 points</div>
        </div>
      </div>
      <p class="domain-q">${d.what}</p>
      <ul class="domain-ul">
        ${d.criteria.map(c => `<li>${c}</li>`).join('')}
      </ul>
      <div class="bands">
        <div class="band"><span class="dot" style="background:#059669"></span><span>${d.full}</span></div>
        <div class="band"><span class="dot" style="background:#D97706"></span><span>${d.partial}</span></div>
        <div class="band"><span class="dot" style="background:#DC2626"></span><span>${d.minimal}</span></div>
      </div>
    </div>`).join('');

  // ── Outcome rows ─────────────────────────────────────────────────────────
  const outcomeRows = outcomes.map(o => `
    <div class="outcome-row">
      <span class="outcome-code">${o.code}</span>
      <span class="outcome-desc">${o.desc}</span>
    </div>`).join('');

  // ── Guide row helper ─────────────────────────────────────────────────────
  function guideRows(items) {
    return items.map(g => `
      <div class="portal-row">
        <div class="portal-num">${g.num}</div>
        <div class="portal-content">
          <div class="portal-title">${g.heading}</div>
          <div class="portal-body">${g.body}</div>
        </div>
      </div>`).join('');
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ZooSnooz Teacher Information Sheet — Stage ${stageNum}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>
@font-face {
  font-family:'TarongaHeadline';
  src:url('${origin}/images/TarongaHeadline-Regular.ttf') format('truetype');
  font-weight:normal; font-style:normal;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

body{
  font-family:'DM Sans',system-ui,sans-serif;
  font-size:10pt;
  line-height:1.65;
  color:${BRAND.ink};
  background:#DCEAE4;
  -webkit-font-smoothing:antialiased;
}

.page{
  max-width:840px;
  margin:32px auto;
  background:#fff;
  border-radius:20px;
  overflow:hidden;
  box-shadow:0 24px 80px rgba(7,30,20,0.18);
}

/* ── HEADER ── */
.hdr{
  background:${BRAND.forest};
  padding:44px 52px 0;
  position:relative;
  overflow:hidden;
}
.hdr-dot-grid{
  position:absolute;
  inset:0;
  background-image:radial-gradient(circle, rgba(168,196,178,0.25) 1px, transparent 1px);
  background-size:22px 22px;
  pointer-events:none;
}
.hdr-glow{
  position:absolute;
  top:-100px; right:-80px;
  width:360px; height:360px;
  border-radius:50%;
  background:radial-gradient(circle, rgba(13,148,136,0.3) 0%, transparent 68%);
  pointer-events:none;
}
.hdr-glow2{
  position:absolute;
  bottom:-60px; left:60px;
  width:200px; height:200px;
  border-radius:50%;
  background:radial-gradient(circle, rgba(182,246,26,0.12) 0%, transparent 70%);
  pointer-events:none;
}
.hdr-top{
  display:flex; align-items:flex-start;
  justify-content:space-between; gap:24px;
  margin-bottom:30px; position:relative;
}
.hdr-logo{ height:68px; width:auto; display:block; }
.hdr-right{ text-align:right; flex-shrink:0; padding-top:6px; }
.hdr-badge{
  display:inline-flex; align-items:center; gap:8px;
  background:rgba(13,148,136,0.2);
  border:1px solid rgba(13,148,136,0.48);
  color:${BRAND.tealLight};
  font-size:7.5pt; font-weight:800;
  letter-spacing:0.14em; text-transform:uppercase;
  padding:7px 18px; border-radius:40px;
}
.hdr-stage{
  display:block; font-size:8pt; color:${BRAND.mist};
  letter-spacing:0.06em; margin-top:9px; font-weight:500;
}
.hdr-title{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:26pt; font-weight:normal; color:#fff;
  letter-spacing:0.03em; line-height:1.08; position:relative;
}
.hdr-title-accent{ color:${BRAND.lime}; }
.hdr-sub{
  font-size:9.5pt; color:${BRAND.mist};
  margin-top:8px; letter-spacing:0.03em; position:relative;
}
.hdr-meta{
  display:flex; flex-wrap:wrap; gap:8px 26px;
  margin-top:28px; padding:16px 0 20px;
  border-top:1px solid rgba(168,196,178,0.22); position:relative;
}
.meta-item{
  display:flex; align-items:center; gap:7px;
  font-size:7.5pt; color:${BRAND.mist}; letter-spacing:0.05em;
}
.meta-dot{ width:4px; height:4px; border-radius:50%; background:${BRAND.teal}; flex-shrink:0; }

/* ── PHASES STRIP ── */
.phases-strip{
  background:${BRAND.deep};
  padding:18px 36px;
  display:flex; align-items:center;
  border-bottom:1px solid rgba(168,196,178,0.1);
}
.phase-item{ display:flex; align-items:center; flex:1; }
.phase-pill{ display:flex; flex-direction:column; align-items:center; flex:1; }
.phase-icon-wrap{
  width:28px; height:28px; border-radius:50%;
  background:rgba(13,148,136,0.15);
  border:1.5px solid rgba(13,148,136,0.4);
  display:flex; align-items:center; justify-content:center;
  margin-bottom:5px;
}
.phase-label{
  font-size:6.5pt; font-weight:800;
  text-transform:uppercase; letter-spacing:0.1em;
  color:${BRAND.tealLight}; text-align:center; line-height:1.3;
}
.phase-arrow{
  font-size:8pt; color:rgba(13,148,136,0.35);
  padding:0 2px; flex-shrink:0; margin-bottom:18px;
}

/* ── PRINT BAR ── */
.print-bar{
  background:${BRAND.parchment}; border-bottom:1px solid #ECE7DD;
  padding:13px 52px; display:flex; align-items:center;
  justify-content:space-between; gap:12px;
}
.print-hint{ font-size:8pt; color:${BRAND.slate}; }
.print-btn{
  display:flex; align-items:center; gap:8px;
  background:${BRAND.teal}; color:#fff;
  border:none; padding:9px 24px; border-radius:40px;
  font-size:8.5pt; font-weight:700; letter-spacing:0.06em;
  cursor:pointer; font-family:'DM Sans',sans-serif;
}
.print-btn:hover{ opacity:0.88; }

/* ── BODY ── */
.body{ padding:52px 52px 56px; }

/* ── SECTION ── */
.section{ margin-bottom:48px; }
.section:last-child{ margin-bottom:0; }
.sec-kicker{
  font-size:7pt; font-weight:800; color:${BRAND.teal};
  text-transform:uppercase; letter-spacing:0.24em; margin-bottom:7px;
}
.sec-title{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:16pt; font-weight:normal;
  color:${BRAND.forest}; letter-spacing:0.02em; line-height:1.15;
}
.sec-rule{
  width:44px; height:3px; background:${BRAND.teal};
  border-radius:2px; margin:12px 0 22px;
}

/* ── OVERVIEW ── */
.overview-grid{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.ov-card{ background:${BRAND.parchment}; border-radius:14px; padding:20px 22px; }
.ov-label{
  font-size:7pt; font-weight:800; color:${BRAND.teal};
  text-transform:uppercase; letter-spacing:0.16em; margin-bottom:8px;
}
.ov-val{ font-size:9pt; color:${BRAND.charcoal}; line-height:1.65; }
.ov-val strong{ color:${BRAND.forest}; }

/* ── POINTS BOX ── */
.points-box{
  background:${BRAND.deep}; border-radius:16px; padding:22px 28px;
  display:grid; grid-template-columns:repeat(3,1fr);
}
.points-item{
  text-align:center; padding:4px 16px;
  border-right:1px solid rgba(168,196,178,0.15);
}
.points-item:last-child{ border-right:none; }
.points-num{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:22pt; color:${BRAND.lime}; line-height:1;
}
.points-label{
  font-size:7pt; font-weight:800; color:${BRAND.mist};
  text-transform:uppercase; letter-spacing:0.12em; margin-top:6px;
}

/* ── STAGE BOX ── */
.stage-box{
  background:${BRAND.tealLight}; border-radius:16px; padding:24px 28px;
  display:grid; grid-template-columns:auto 1fr; gap:26px; align-items:start;
}
.stage-stat{ text-align:center; padding:4px 26px 4px 2px; border-right:1px solid ${BRAND.tealBorder}; }
.stage-stat-num{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:23pt; color:${BRAND.teal}; line-height:1; white-space:nowrap;
}
.stage-stat-label{
  font-size:6.5pt; font-weight:800; color:${BRAND.slate};
  text-transform:uppercase; letter-spacing:0.14em; margin-top:7px;
}
.stage-text{ font-size:9.5pt; color:${BRAND.charcoal}; line-height:1.65; margin-bottom:14px; }
.stage-kicker{
  font-size:7pt; font-weight:800; color:${BRAND.teal};
  text-transform:uppercase; letter-spacing:0.14em; margin-bottom:8px;
}
.starters{ display:flex; flex-wrap:wrap; gap:7px; }
.starter{
  background:#fff; color:${BRAND.teal};
  border:1px solid ${BRAND.tealBorder};
  font-size:8pt; font-style:italic; padding:4px 14px; border-radius:40px;
}

/* ── OUTCOMES ── */
.outcomes-list{ display:flex; flex-direction:column; gap:10px; }
.outcome-row{ display:flex; align-items:flex-start; gap:13px; }
.outcome-code{
  flex-shrink:0;
  background:${BRAND.tealLight}; color:${BRAND.teal};
  border:1px solid ${BRAND.tealBorder};
  font-size:7.5pt; font-weight:800;
  padding:3px 11px; border-radius:6px;
  letter-spacing:0.04em; margin-top:2px;
  font-variant-numeric:tabular-nums;
}
.outcome-desc{ font-size:9pt; color:${BRAND.charcoal}; line-height:1.6; }
.outcome-syllabus{
  font-size:7.5pt; color:${BRAND.slate}; margin-top:12px;
  font-style:italic;
}

/* ── ANIMAL CARDS ── */
.animals-list{ display:flex; flex-direction:column; gap:28px; }
.animal-card{ border:1px solid #ECE8E0; border-radius:18px; overflow:hidden; }
.animal-header{
  background:${BRAND.deep}; padding:16px 22px;
  display:flex; align-items:center; gap:16px;
}
.animal-num{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:14pt; color:${BRAND.lime};
  letter-spacing:0.04em; flex-shrink:0; min-width:36px;
}
.animal-header-main{ flex:1; }
.animal-name{ font-size:11pt; font-weight:800; color:#fff; line-height:1.2; }
.animal-sci{ font-size:7.5pt; color:${BRAND.mist}; font-style:italic; margin-top:2px; }
.animal-interact-chip{
  display:flex; align-items:center; gap:7px;
  background:rgba(13,148,136,0.18);
  border:1px solid rgba(13,148,136,0.4);
  color:${BRAND.tealLight};
  font-size:7pt; font-weight:800;
  text-transform:uppercase; letter-spacing:0.1em;
  padding:5px 13px; border-radius:40px; flex-shrink:0;
}
.interact-icon{ display:flex; align-items:center; }
.animal-concept{
  background:${BRAND.mid}; padding:8px 22px;
  font-size:7.5pt; font-weight:800;
  text-transform:uppercase; letter-spacing:0.14em;
  color:${BRAND.lime};
}
.animal-grid{
  padding:18px 22px 0;
  display:grid; grid-template-columns:1fr 1fr; gap:14px;
}
.animal-col-wide{ grid-column:1 / -1; }
.col-label{
  font-size:6.5pt; font-weight:800; color:${BRAND.teal};
  text-transform:uppercase; letter-spacing:0.14em; margin-bottom:6px;
}
.col-body{ font-size:8.5pt; color:${BRAND.charcoal}; line-height:1.6; }
.col-italic{ font-style:italic; }

/* ── MCQ ── */
.mcq-section{ padding:14px 22px 0; }
.mcq-q{ font-size:8.5pt; color:${BRAND.charcoal}; font-style:italic; margin:6px 0 10px; line-height:1.6; }
.mcq-opts{ display:flex; flex-direction:column; gap:5px; }
.mcq-opt{
  display:flex; align-items:flex-start; gap:9px;
  padding:7px 11px; border-radius:8px;
  font-size:8pt; color:${BRAND.charcoal};
  background:#F9F8F5; border:1px solid #ECE8E0; line-height:1.45;
}
.mcq-opt.mcq-correct{
  background:${BRAND.tealLight}; border-color:${BRAND.tealBorder};
  color:${BRAND.forest}; font-weight:600;
}
.mcq-letter{
  flex-shrink:0; font-weight:800; font-size:7.5pt;
  color:${BRAND.slate}; padding-top:1px; min-width:12px;
}
.mcq-opt.mcq-correct .mcq-letter{ color:${BRAND.teal}; }
.mcq-tick{ color:${BRAND.teal}; font-weight:800; margin-left:4px; }

/* ── FILMING NOTE ── */
.filming-note{
  margin:14px 22px 18px; padding:10px 14px;
  background:#F9F8F5; border-radius:9px;
  border-left:3px solid ${BRAND.limeDark};
  font-size:8pt; color:${BRAND.slate}; line-height:1.55;
}
.filming-label{ font-weight:800; color:${BRAND.mid}; letter-spacing:0.02em; }

/* ── SCORING ── */
.scoring-intro{
  font-size:9.5pt; color:${BRAND.charcoal};
  line-height:1.65; max-width:680px; margin-bottom:20px;
}
.scoring-intro strong{ color:${BRAND.forest}; }
.domain-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.domain-card{ background:#fff; border:1px solid #ECE8E0; border-radius:16px; padding:18px; }
.domain-hd{ display:flex; align-items:center; gap:11px; margin-bottom:13px; }
.domain-icon{
  width:34px; height:34px; border-radius:11px;
  background:${BRAND.tealLight}; color:${BRAND.teal};
  border:1px solid ${BRAND.tealBorder};
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0;
}
.domain-name{ font-size:9.5pt; font-weight:800; color:${BRAND.forest}; line-height:1.2; }
.domain-pts{ font-size:6.5pt; font-weight:700; color:${BRAND.slate}; text-transform:uppercase; letter-spacing:0.1em; margin-top:2px; }
.domain-q{ font-size:8pt; color:${BRAND.slate}; font-style:italic; margin-bottom:10px; line-height:1.5; }
.domain-ul{ padding-left:15px; margin-bottom:12px; }
.domain-ul li{ font-size:8.5pt; color:${BRAND.charcoal}; margin-bottom:4px; line-height:1.5; }
.bands{ display:flex; flex-direction:column; gap:6px; border-top:1px solid #F0EDE6; padding-top:11px; }
.band{ display:flex; align-items:flex-start; gap:8px; font-size:8pt; color:${BRAND.charcoal}; line-height:1.4; }
.dot{ width:7px; height:7px; border-radius:50%; flex-shrink:0; margin-top:3px; }

/* ── GUIDE LISTS ── */
.portal-list{ display:flex; flex-direction:column; }
.portal-row{
  display:flex; align-items:flex-start; gap:20px;
  padding:16px 0; border-bottom:1px solid #F0EDE6;
}
.portal-row:first-child{ padding-top:2px; }
.portal-row:last-child{ border-bottom:none; padding-bottom:0; }
.portal-num{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:15pt; font-weight:normal; color:${BRAND.teal};
  letter-spacing:0.04em; flex-shrink:0; line-height:1; padding-top:3px; min-width:34px;
}
.portal-title{ font-size:10pt; font-weight:700; color:${BRAND.forest}; margin-bottom:4px; }
.portal-body{ font-size:8.5pt; color:${BRAND.charcoal}; line-height:1.65; }

/* ── FOOTER ── */
.ftr{
  background:${BRAND.forest}; padding:24px 52px;
  display:flex; align-items:center; justify-content:space-between;
}
.ftr-left{ display:flex; align-items:center; gap:16px; }
.ftr-logo{ height:34px; width:auto; opacity:0.9; }
.ftr-divider{ width:1px; height:24px; background:rgba(168,196,178,0.3); }
.ftr-name{
  font-family:'TarongaHeadline','DM Sans',sans-serif;
  font-size:10.5pt; font-weight:normal; color:#fff; letter-spacing:0.05em;
}
.ftr-right{ text-align:right; font-size:7.5pt; color:${BRAND.mist}; line-height:1.6; }

/* ── PRINT ── */
@media print{
  body{ background:#fff; }
  .page{ max-width:none; margin:0; border-radius:0; box-shadow:none; }
  .print-bar{ display:none!important; }
  .hdr,.ftr,.hdr-badge,.hdr-glow,.hdr-glow2,.hdr-dot-grid,
  .sec-rule,.ov-card,.stage-box,.phases-strip,
  .starter,.domain-icon,.dot,.meta-dot,.outcome-code,
  .animal-header,.animal-concept,.mcq-opt.mcq-correct,.points-box{
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }
  .section{ page-break-inside:avoid; }
  .domain-card{ page-break-inside:avoid; }
  .portal-row{ page-break-inside:avoid; }
  .animal-card{ page-break-inside:avoid; }
}
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="hdr">
    <div class="hdr-dot-grid"></div>
    <div class="hdr-glow"></div>
    <div class="hdr-glow2"></div>
    <div class="hdr-top">
      <img src="${origin}/images/logo.png" alt="Taronga Tracka" class="hdr-logo">
      <div class="hdr-right">
        <div class="hdr-badge">
          ${svgMoon(BRAND.tealLight, 13)}
          ZooSnooz
        </div>
        <span class="hdr-stage">${stageMeta.label}</span>
      </div>
    </div>
    <div class="hdr-title"><span class="hdr-title-accent">ZooSnooz</span> Teacher Information Sheet</div>
    <div class="hdr-sub">Everything you need to run your night-mode excursion — animals, scoring, video, and NFC tags.</div>
    <div class="hdr-meta">
      <div class="meta-item"><span class="meta-dot"></span> Night Mode · 5 Animals · 5 Sensor Interactions</div>
      <div class="meta-item"><span class="meta-dot"></span> ${stageMeta.label}</div>
      <div class="meta-item"><span class="meta-dot"></span> Science — Biological Sciences</div>
      <div class="meta-item"><span class="meta-dot"></span> Prepared ${today}</div>
    </div>
  </div>

  <!-- Phases strip -->
  <div class="phases-strip">
    <div class="phase-item">
      <div class="phase-pill">
        <div class="phase-icon-wrap">${svgLightbulb(BRAND.teal, 14)}</div>
        <div class="phase-label">Keeper<br>Insight</div>
      </div>
      <div class="phase-arrow">&#8250;</div>
    </div>
    <div class="phase-item">
      <div class="phase-pill">
        <div class="phase-icon-wrap">${svgSignal(BRAND.teal, 14)}</div>
        <div class="phase-label">Sensor<br>Interaction</div>
      </div>
      <div class="phase-arrow">&#8250;</div>
    </div>
    <div class="phase-item">
      <div class="phase-pill">
        <div class="phase-icon-wrap">${svgQuestionMark(BRAND.teal, 14)}</div>
        <div class="phase-label">Multiple<br>Choice</div>
      </div>
      <div class="phase-arrow">&#8250;</div>
    </div>
    <div class="phase-item">
      <div class="phase-pill">
        <div class="phase-icon-wrap">${svgPencil(BRAND.teal, 14)}</div>
        <div class="phase-label">Written<br>Observation</div>
      </div>
      <div class="phase-arrow">&#8250;</div>
    </div>
    <div class="phase-item">
      <div class="phase-pill">
        <div class="phase-icon-wrap">${svgVideo(BRAND.teal, 14)}</div>
        <div class="phase-label">10-Second<br>Video</div>
      </div>
      <div class="phase-arrow">&#8250;</div>
    </div>
    <div class="phase-pill">
      <div class="phase-icon-wrap">${svgBadge(BRAND.teal, 14)}</div>
      <div class="phase-label">Badge<br>Earned</div>
    </div>
  </div>

  <!-- Print bar -->
  <div class="print-bar">
    <span class="print-hint">Share with your teaching team or File &rsaquo; Print to save as PDF.</span>
    <button class="print-btn" onclick="window.print()">
      ${svgDownloadIcon()}
      Print / Save as PDF
    </button>
  </div>

  <div class="body">

    <!-- 01 About -->
    <div class="section">
      <div class="sec-kicker">Section 01</div>
      <div class="sec-title">About ZooSnooz</div>
      <div class="sec-rule"></div>
      <div class="overview-grid">
        <div class="ov-card">
          <div class="ov-label">What Is ZooSnooz?</div>
          <div class="ov-val">ZooSnooz is the night-mode variant of Taronga Tracka. Students visit five animal enclosures after dark, using device sensors to interact with each animal's environment, completing a written observation and recording a 10-second video documentary clip at each stop.</div>
        </div>
        <div class="ov-card">
          <div class="ov-label">How It Differs From Daytime Tracka</div>
          <div class="ov-val">Daytime Tracka is observation-led. ZooSnooz adds <strong>active sensor interactions</strong> (energy, sound, haptic, light, sketch), a <strong>video recording</strong> at every animal, and a <strong>documentary stitching pipeline</strong> that creates a personal nature film at the end of the session.</div>
        </div>
        <div class="ov-card">
          <div class="ov-label">Session Structure</div>
          <div class="ov-val">Students complete all five animals in sequence. Each animal takes approximately <strong>8–12 minutes</strong>. Total session time: <strong>50–65 minutes</strong> depending on stage and group pace. Factor in travel time between enclosures.</div>
        </div>
        <div class="ov-card">
          <div class="ov-label">Assessment and Scoring</div>
          <div class="ov-val">AI-assisted scoring with full teacher override. <strong>Observation: up to 100 pts</strong> (15 pts across 3 domains, scaled to 100). <strong>MCQ bonus: +20 pts</strong> for a correct first-attempt answer. Max <strong>120 pts per animal · 600 pts total</strong>.</div>
        </div>
      </div>
    </div>

    <!-- 02 Points -->
    <div class="section">
      <div class="sec-kicker">Section 02</div>
      <div class="sec-title">Points at a Glance</div>
      <div class="sec-rule"></div>
      <div class="points-box">
        <div class="points-item">
          <div class="points-num">5</div>
          <div class="points-label">Animals</div>
        </div>
        <div class="points-item">
          <div class="points-num">120</div>
          <div class="points-label">Max pts per animal</div>
        </div>
        <div class="points-item">
          <div class="points-num">600</div>
          <div class="points-label">Max total pts</div>
        </div>
      </div>
      <p style="font-size:8.5pt;color:${BRAND.slate};margin-top:14px;line-height:1.6">
        Observation scoring: (behaviour /5 + detail /5 + writing /5) &divide; 15 &times; 100. MCQ bonus: +20 pts for a correct first attempt. ZooSnooz points are tracked separately from daytime Tracka points in the Teacher Portal.
      </p>
    </div>

    <!-- 03 Stage expectations -->
    <div class="section">
      <div class="sec-kicker">Section 03</div>
      <div class="sec-title">Observation Writing: Stage ${stageNum} Expectations</div>
      <div class="sec-rule"></div>
      <div class="stage-box">
        <div class="stage-stat">
          <div class="stage-stat-num">&ge; ${stageMeta.minWords}</div>
          <div class="stage-stat-label">Minimum<br>Words</div>
        </div>
        <div>
          <p class="stage-text">${stageMeta.expectation}</p>
          <div class="stage-kicker">Suggested sentence starters (display or read before students write)</div>
          <div class="starters">
            ${stageMeta.starters.map(s => `<span class="starter">${s}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- 04 NSW Outcomes -->
    <div class="section">
      <div class="sec-kicker">Section 04</div>
      <div class="sec-title">NSW Curriculum Outcomes</div>
      <div class="sec-rule"></div>
      <div class="outcomes-list">
        ${outcomeRows}
      </div>
      <p class="outcome-syllabus">Source: ${syllabusLabel}. These outcomes reflect the Biological Sciences focus of ZooSnooz — structural and behavioural adaptations, organism&ndash;environment interactions, and Working Scientifically observation skills.</p>
    </div>

    <!-- 05 Animals -->
    <div class="section">
      <div class="sec-kicker">Section 05</div>
      <div class="sec-title">Animals, Interactions and Stage ${stageNum} Content</div>
      <div class="sec-rule"></div>
      <div class="animals-list">
        ${animalRows}
      </div>
    </div>

    <!-- 06 Scoring -->
    <div class="section">
      <div class="sec-kicker">Section 06</div>
      <div class="sec-title">How Observations Are Scored</div>
      <div class="sec-rule"></div>
      <div class="scoring-intro">
        Each written observation is scored across <strong>three domains</strong> (5 points each = 15 points total per animal, then scaled to 100). Scores are generated automatically and can be reviewed and overridden by the teacher in the portal at any time.
      </div>
      <div class="domain-grid">${domainCards}</div>
    </div>

    <!-- 07 Video -->
    <div class="section">
      <div class="sec-kicker">Section 07</div>
      <div class="sec-title">Video Recording</div>
      <div class="sec-rule"></div>
      <div class="portal-list">${guideRows(VIDEO_GUIDE)}</div>
    </div>

    <!-- 08 Stitching -->
    <div class="section">
      <div class="sec-kicker">Section 08</div>
      <div class="sec-title">Documentary Stitching Pipeline</div>
      <div class="sec-rule"></div>
      <div class="portal-list">${guideRows(STITCH_GUIDE)}</div>
    </div>

    <!-- 09 NFC -->
    <div class="section">
      <div class="sec-kicker">Section 09</div>
      <div class="sec-title">NFC Tags</div>
      <div class="sec-rule"></div>
      <div class="portal-list">${guideRows(NFC_GUIDE)}</div>
    </div>

    <!-- 10 Portal -->
    <div class="section">
      <div class="sec-kicker">Section 10</div>
      <div class="sec-title">Analysing ZooSnooz Data in the Teacher Portal</div>
      <div class="sec-rule"></div>
      <div class="portal-list">${guideRows(PORTAL_GUIDE)}</div>
    </div>

  </div><!-- /body -->

  <!-- Footer -->
  <div class="ftr">
    <div class="ftr-left">
      <img src="${origin}/images/logo.png" alt="Taronga Tracka" class="ftr-logo">
      <div class="ftr-divider"></div>
      <span class="ftr-name">ZooSnooz &middot; Night Experience</span>
    </div>
    <div class="ftr-right">
      Stage ${stageNum} &middot; Science &mdash; Biological Sciences<br>
      taronga.org.au &middot; Education Programs
    </div>
  </div>

</div><!-- /page -->
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (win) setTimeout(() => URL.revokeObjectURL(url), 60000);
}
