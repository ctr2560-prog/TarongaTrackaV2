import { ZOOYARD_ANIMALS } from '../data/zooyardAnimals';
import { ZOOYARD_OUTCOMES, ZOOYARD_OUTCOMES_NOTE } from '../data/zooyardOutcomes';

// zooyardInfoSheet.js — the ZooYard Teacher Information Sheet.
//
// House pattern (teacherInfoSheet.js, zoosnoozInfoSheet.js, evolveCertificates.js,
// highlightsPackage.js, modes/wildest-dreams/infoSheet.js): build one self-contained HTML
// document, open it in a new tab from a blob URL, let the browser print it or save it as a PDF.
// No PDF library, no server round trip.
//
// ⚠️ A deliberate copy rather than a call into `openTeacherInfoSheet`. That sheet is built around
//    a zoo visit — exhibits, a map, GPS, a route — and ZooYard has none of those: it happens in a
//    schoolyard. The two sheets share a look, not a code path.
//
// ⚠️ The habitat table is GENERATED from ZOOYARD_ANIMALS, so adding or editing a habitat updates
//    this sheet with no edit here. Keep it that way — a hand-maintained copy of the habitat list
//    is exactly the thing that goes stale and then gets handed to a school.

const BRAND = {
  forest:    '#071E14',
  deep:      '#0A2F1F',
  mid:       '#1A5238',
  eucalyptus:'#2E7D55',
  mist:      '#A8C4B2',
  foam:      '#E8F2EC',
  ink:       '#1A1A17',
  charcoal:  '#3D3D38',
  slate:     '#6B6B62',
};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

// The five beats of a habitat. Written for a teacher planning a lesson, not for a student.
// ⚠️ Mirrors "Watch, build, explain" in CLAUDE.md. If the flow changes there, change it here.
const FLOW = [
  { n:'01', t:'Unlock the spot',  b:'The student photographs the real place in the schoolyard the habitat is about. A habitat stays locked until they do, so the mode cannot be completed from a desk.' },
  { n:'02', t:'Watch the keeper', b:'A short video sets up the one quality this habitat is about, so the student knows what they are walking out to look for. ⚠️ These videos are not filmed yet — students currently see "Video coming soon" and go straight on.' },
  { n:'03', t:'Answer one question', b:'A single multiple-choice question on that quality. It is scored on the first attempt.' },
  { n:'04', t:'Two minutes of watching', b:'A timer runs while the student looks for the quality in their own schoolyard — where it is, and where it is missing. Nothing is recorded in this step, which is deliberate: it is looking, not data collection.' },
  { n:'05', t:'Build it',        b:'The student builds something that provides the missing quality, then photographs it. Every habitat has a different build, and each has a fallback for schools that cannot plant into the ground.' },
  { n:'06', t:'Write it up',     b:'A stage-appropriate prompt asks why the change matters to that animal. Marked on three domains — what you saw, detail and reasons, and writing.' },
];

const ON_THE_DAY = [
  { n:'01', t:'No zoo visit and no GPS', b:'ZooYard was built for classes that cannot travel, and for NSW DoE devices, which block geolocation. No location check ever happens.' },
  { n:'02', t:'Two photographs are required', b:'One to unlock the spot and one of the finished build. A habitat cannot be completed without both, so a device with no working camera cannot finish.' },
  { n:'03', t:'Outdoors, in the schoolyard', b:'Every habitat refers to a real place students can stand in. Pick the spots before the lesson — it is the single biggest time saver.' },
  { n:'04', t:'Eight habitats is a lot',  b:'⚠️ There is currently no way for a teacher to choose which habitats run. Plan which ones the class will attempt and tell them, or expect a very long lesson.' },
  { n:'05', t:'Builds need materials',    b:'Mulch, leaf litter, a pot plant, a container of water, loose branches. Each habitat lists a primary build and a fallback. Check them before the lesson.' },
  { n:'06', t:'One sitting per habitat',  b:'⚠️ Progress within a habitat is not saved. A student who reloads after building but before writing returns to the map and starts that habitat again.' },
];

function habitatRows() {
  return ZOOYARD_ANIMALS.map(a => `
    <tr>
      <td class="hab"><strong>${esc(a.name)}</strong></td>
      <td>${esc(a.observation?.focus || '—')}</td>
      <td>${esc(a.citizenScience?.title || '—')}: ${esc(a.citizenScience?.primary || '')}</td>
    </tr>`).join('');
}

function outcomeBlock(stageNum) {
  const entry = ZOOYARD_OUTCOMES[stageNum] || ZOOYARD_OUTCOMES[4];
  const rows = entry.outcomes.map(o => `
    <tr>
      <td class="code">${esc(o.code)}</td>
      <td>${esc(o.desc)}</td>
      <td class="ev">${esc(o.evidence)}</td>
    </tr>`).join('');
  return `
    <p class="syl">${esc(entry.syllabus)}</p>
    <table class="outcomes">
      <thead><tr><th>Outcome</th><th>Description</th><th>Where ZooYard addresses it</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="note">${esc(ZOOYARD_OUTCOMES_NOTE)}</p>`;
}

/**
 * Opens the ZooYard Teacher Information Sheet in a new tab.
 * @param {object} cls  the class record — uses `className`, `stage`, `classCode` when present.
 */
export function openZooYardInfoSheet(cls = {}) {
  const stageNum = Number(cls.stage) || 4;
  const className = cls.className || cls.name || '';
  const classCode = cls.classCode || cls.code || '';

  const html = `<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8">
<title>ZooYard — Teacher Information Sheet</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
         color:${BRAND.ink}; font-size:11px; line-height:1.55; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .cover { background:linear-gradient(150deg, ${BRAND.forest}, ${BRAND.mid}); color:white; padding:26px 28px; border-radius:14px; margin-bottom:18px; }
  .cover h1 { margin:0 0 4px; font-size:26px; letter-spacing:0.01em; }
  .cover .sub { color:${BRAND.mist}; font-size:12px; margin:0 0 14px; }
  .meta { display:flex; gap:26px; flex-wrap:wrap; font-size:11px; color:${BRAND.foam}; }
  .meta b { display:block; color:${BRAND.mist}; font-size:9px; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:2px; font-weight:700; }
  h2 { font-size:14px; color:${BRAND.deep}; margin:20px 0 8px; padding-bottom:5px; border-bottom:2px solid ${BRAND.eucalyptus}; }
  .flow { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
  .step { background:${BRAND.foam}; border-left:3px solid ${BRAND.eucalyptus}; border-radius:0 8px 8px 0; padding:8px 11px; break-inside:avoid; }
  .step .n { font-size:9px; font-weight:800; color:${BRAND.eucalyptus}; letter-spacing:0.1em; }
  .step .t { font-weight:700; font-size:11.5px; color:${BRAND.deep}; margin:1px 0 3px; }
  .step .b { color:${BRAND.charcoal}; font-size:10px; }
  table { width:100%; border-collapse:collapse; margin-top:4px; }
  th { background:${BRAND.deep}; color:white; text-align:left; font-size:9px; text-transform:uppercase; letter-spacing:0.08em; padding:6px 8px; }
  td { border-bottom:1px solid #DDE6E0; padding:6px 8px; vertical-align:top; font-size:10px; }
  tr { break-inside:avoid; }
  .hab { width:19%; color:${BRAND.deep}; }
  .code { width:14%; font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-weight:700; color:${BRAND.eucalyptus}; }
  .ev { width:40%; color:${BRAND.charcoal}; }
  .syl { font-size:10px; color:${BRAND.slate}; margin:0 0 6px; font-style:italic; }
  .note { font-size:9.5px; color:${BRAND.slate}; background:${BRAND.foam}; border-radius:7px; padding:7px 10px; margin-top:8px; }
  .warn { font-size:10px; background:#FFF6E0; border:1px solid #E8C97A; border-radius:7px; padding:8px 11px; margin-top:9px; color:#6B5214; }
  .foot { margin-top:18px; padding-top:9px; border-top:1px solid #DDE6E0; font-size:9px; color:${BRAND.slate}; display:flex; justify-content:space-between; }
</style></head><body>

<div class="cover">
  <h1>ZooYard</h1>
  <p class="sub">Teacher Information Sheet — habitat science in your own schoolyard</p>
  <div class="meta">
    ${className ? `<div><b>Class</b>${esc(className)}</div>` : ''}
    ${classCode ? `<div><b>Class code</b>${esc(classCode)}</div>` : ''}
    <div><b>Stage</b>Stage ${esc(stageNum)}</div>
    <div><b>Habitats</b>${ZOOYARD_ANIMALS.length}</div>
    <div><b>Location</b>Your schoolyard — no zoo visit</div>
  </div>
</div>

<h2>What ZooYard is</h2>
<p style="margin:0 0 4px; color:${BRAND.charcoal};">
  Each habitat names <strong>one environmental quality an animal depends on</strong> — connected
  trees, cover to hide in, a living ground layer, shade. The student spends two minutes finding
  where that quality exists in their own schoolyard and where it does not, then builds something
  that provides it and explains why it matters. Watching and building are always about the same
  thing.
</p>

<h2>How one habitat runs</h2>
<div class="flow">
  ${FLOW.map(f => `<div class="step"><div class="n">${f.n}</div><div class="t">${esc(f.t)}</div><div class="b">${esc(f.b)}</div></div>`).join('')}
</div>

<h2>The ${ZOOYARD_ANIMALS.length} habitats</h2>
<table>
  <thead><tr><th>Habitat</th><th>Quality it is about</th><th>What the student builds</th></tr></thead>
  <tbody>${habitatRows()}</tbody>
</table>

<h2>Syllabus outcomes — Stage ${esc(stageNum)}</h2>
${outcomeBlock(stageNum)}
<div class="warn">
  <strong>Before you report against these:</strong> the outcome codes are current, but the
  descriptions here are working paraphrases and should be checked against the NESA syllabus.
  The K–6 codes are from Science and Technology K–6 (2017); NSW schools move to the 2024 syllabus
  from 2027, and the 2017 version is withdrawn after December 2028.
</div>

<h2>Running it with a class</h2>
<div class="flow">
  ${ON_THE_DAY.map(f => `<div class="step"><div class="n">${f.n}</div><div class="t">${esc(f.t)}</div><div class="b">${esc(f.b)}</div></div>`).join('')}
</div>

<h2>How the writing is marked</h2>
<p style="margin:0; color:${BRAND.charcoal};">
  Each write-up is scored on three domains out of 5 — <strong>what you saw</strong>,
  <strong>detail and reasons</strong>, and <strong>writing</strong> — which combine into the
  habitat's points. The prompt and the mark scheme both change by stage: Stages 1–2 ask the
  student to describe, Stage 3 to give a reason, and Stages 4–5 to explain a mechanism. Students
  see written feedback on what they did well and what to try next, not a raw mark.
</p>

<div class="foot">
  <span>Taronga Tracka — ZooYard</span>
  <span>Generated ${new Date().toLocaleDateString('en-AU', { day:'numeric', month:'long', year:'numeric' })}</span>
</div>

</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
