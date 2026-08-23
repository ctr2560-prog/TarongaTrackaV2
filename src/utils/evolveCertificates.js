// evolveCertificates.js — printable keepsake certificates for an Evolve class.
//
// Same approach as teacherInfoSheet.js: build a self-contained HTML document, open it in a new
// tab from a blob URL, and let the teacher print it or save it as a PDF. No PDF library, no
// server round trip.
//
// One certificate per LANDSCAPE A4 page, so each sheet can be handed to a student or pinned up
// on its own. Pass a single-item array to print just one.
//
// It carries ALL FIVE statements, each under its own sentence starter — the starters differ per
// animal ("I'm taking with me", "I will", "I wish I'd known", "I was shaped by", "I want") and a
// certificate showing only the koala pledge threw four of them away. Chapters appear in walking
// order, the same order the film is assembled in.
//
// Printed on a warm light ground rather than Evolve's twilight palette: a dark page eats toner,
// school printers make a mess of it, and browsers strip backgrounds by default. The one dark
// element is the seal — the Taronga logo is a white lockup and would vanish on cream.

import { EVOLVE_STORY_ORDER, EVOLVE_CHAPTER_WORDS as WORDS } from '../data/evolveAnimals';

const INK   = '#1A2E22';
const GOLD  = '#B8862B';
const CREAM = '#FBF8F1';

// A stored reflection already CARRIES its lead — EvolveScreen saves `${writeLead} ${body}`. The
// certificate prints the lead itself, in gold, so printing the reflection raw said it twice
// ("I will / I will plant something…"). Strip it, but fall back to the original if stripping
// would leave nothing — a student whose whole answer was the lead still gets their words.
const stripLead = (text = '', lead = '') => {
  const t = String(text).trim();
  if (!lead) return t;
  const pattern = new RegExp('^\\s*' + lead.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b[\\s,:-]*', 'i');
  return t.replace(pattern, '').trim() || t;
};

const esc = (t = '') => String(t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/**
 * @param {object}   cls       class doc ({ className, schoolName })
 * @param {object[]} students  [{ name, reflections }] — one A4 landscape certificate each.
 *                             `reflections` is { [chapterId]: 'full text including its lead' }.
 */
export function openEvolveCertificates(cls = {}, students = []) {
  const origin = window.location.origin;
  const year   = new Date().getFullYear();
  const school = esc(cls.schoolName || 'Taronga Tracka');
  const klass  = esc(cls.className || '');
  const single = students.length === 1;

  const statements = (reflections = {}) => EVOLVE_STORY_ORDER
    .map((c, i) => {
      const raw = reflections[c.id];
      if (!raw) return '';
      const body = stripLead(raw, c.writeLead);
      return `
          <div class="stmt">
            <div class="stmt-ch">Chapter ${WORDS[i] || i + 1} &middot; ${esc(c.animalName)}</div>
            <p class="stmt-body"><span class="stmt-lead">${esc(c.writeLead || '')}</span> ${esc(body)}</p>
          </div>`;
    })
    .join('');

  const certs = students.length
    ? students.map(p => `
      <section class="cert">
        <div class="frame"></div>
        <div class="inner">
          <div class="seal"><img src="${origin}/images/logo.png" alt=""></div>
          <div class="eyebrow">Taronga Zoo Sydney &middot; Evolve</div>
          <h1>My Five Chapters</h1>
          <div class="rule"><span></span>&#10022;<span></span></div>

          <div class="grid">${statements(p.reflections)}</div>

          <div class="sign">
            <div class="who">${esc(p.name)}</div>
            <div class="where">${klass ? klass + ' &middot; ' : ''}${school}</div>
            <div class="when">Class of ${year} &middot; Written at Taronga Zoo Sydney</div>
          </div>
        </div>
      </section>`).join('')
    : `<section class="cert"><div class="frame"></div><div class="inner">
         <h1>Nothing written yet</h1>
         <div class="when">Certificates appear here once students write their chapters at the zoo.</div>
       </div></section>`;

  return openSheet({
    origin,
    title: single ? 'Evolve Certificate: ' + students[0].name : 'Evolve Certificates: ' + (cls.className || cls.schoolName || 'Taronga Tracka'),
    note: `${students.length} certificate${students.length === 1 ? '' : 's'} \u00b7 one per page. Choose \u201cSave as PDF\u201d as the destination to download.`,
    pages: certs,
  });
}

/**
 * The giraffe chapter's writing, printed for the students it was actually addressed to.
 *
 * The prompt asks a Year 12 to write "advice for a student just starting high school" — so if
 * nothing is ever done with it, the chapter asks them to write to somebody who does not exist.
 * This is the cheap, honest way to keep that promise: a teacher prints the sheets and the school
 * puts them up where Year 7s will read them.
 *
 * @param {object}   cls      class doc ({ className, schoolName })
 * @param {object[]} entries  [{ name, advice }] — one A4 landscape card each
 * @param {number}   [cohort] year to attribute, defaults to now
 */
export function openEvolveAdviceSheet(cls = {}, entries = [], cohort) {
  const origin = window.location.origin;
  const year   = cohort || new Date().getFullYear();
  const school = esc(cls.schoolName || 'Taronga Tracka');
  const klass  = esc(cls.className || '');
  const lead   = (EVOLVE_STORY_ORDER.find(c => c.isAdvice) || {}).writeLead || '';

  const cards = entries.length
    ? entries.map(e => {
        const body = stripLead(e.advice, lead);
        return `
      <section class="cert">
        <div class="frame"></div>
        <div class="inner">
          <div class="seal"><img src="${origin}/images/logo.png" alt=""></div>
          <div class="eyebrow">Taronga Zoo Sydney &middot; Evolve</div>
          <h1>Advice from the Class of ${year}</h1>
          <div class="rule"><span></span>&#10022;<span></span></div>

          <p class="advice"><span class="advice-lead">${esc(lead)}</span> ${esc(body)}</p>

          <div class="sign">
            <div class="who">${esc(e.name)}</div>
            <div class="where">${klass ? klass + ' &middot; ' : ''}${school}</div>
            <div class="when">Written at Taronga Zoo Sydney &middot; For someone just starting</div>
          </div>
        </div>
      </section>`;
      }).join('')
    : `<section class="cert"><div class="frame"></div><div class="inner">
         <h1>No advice yet</h1>
         <div class="when">It appears here once students write the giraffe chapter at the zoo.</div>
       </div></section>`;

  return openSheet({
    origin,
    title: `Advice from the Class of ${year}` + (klass ? ': ' + cls.className : ''),
    note: `${entries.length} card${entries.length === 1 ? '' : 's'} \u00b7 one per page. Choose \u201cSave as PDF\u201d as the destination to download.`,
    pages: cards,
  });
}

function renderSheet({ origin, title, note, pages }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>
@font-face {
  font-family:'TarongaHeadline';
  src:url('${origin}/images/TarongaHeadline-Regular.ttf') format('truetype');
  font-weight:normal; font-style:normal;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

@page { size:A4 landscape; margin:0; }

body{
  font-family:'DM Sans',system-ui,sans-serif; color:${INK}; background:#6B6B62;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}

/* ── One certificate, one landscape A4 sheet ──────────────────────── */
.cert{
  position:relative; width:297mm; height:210mm; background:${CREAM};
  display:flex; align-items:center; justify-content:center; overflow:hidden;
  page-break-after:always; break-after:page;
  margin:0 auto;
}
.cert:last-of-type{ page-break-after:auto; break-after:auto; }

/* Double-rule frame, drawn with one element so it never splits across pages. */
.frame{
  position:absolute; inset:11mm; border:1.6pt solid ${GOLD}; border-radius:1.5mm;
  pointer-events:none;
}
.frame::after{
  content:''; position:absolute; inset:2.6mm; border:0.5pt solid ${GOLD};
  border-radius:1mm; opacity:.55;
}

.inner{ text-align:center; padding:0 20mm; max-width:262mm; }

/* The seal doubles as the fix for a white logo on a cream page. */
.seal{
  width:17mm; height:17mm; border-radius:50%; background:${INK};
  display:flex; align-items:center; justify-content:center;
  margin:0 auto 4mm; box-shadow:0 0 0 1.2mm ${CREAM}, 0 0 0 1.6mm ${GOLD};
}
.seal img{ height:9.5mm; width:auto; display:block; }

.eyebrow{
  font-size:8pt; font-weight:700; letter-spacing:.36em; text-transform:uppercase;
  color:${GOLD}; margin-bottom:4mm;
}
h1{
  font-family:'TarongaHeadline',Georgia,serif; font-weight:400;
  font-size:26pt; line-height:1; letter-spacing:.04em;
}
.rule{
  display:flex; align-items:center; justify-content:center; gap:4mm;
  margin:3.5mm 0 6mm; color:${GOLD}; font-size:9pt;
}
.rule span{ display:block; width:22mm; height:1px; background:${GOLD}; opacity:.7; }

/* Five statements on one landscape sheet. Two columns, because a single column across 262mm
   gives lines far too long to read comfortably. Chapter five sits alone on the last row. */
.grid{
  display:grid; grid-template-columns:1fr 1fr; gap:5.5mm 14mm;
  text-align:left; margin:0 auto;
}
.stmt{ break-inside:avoid; }
.stmt-ch{
  font-size:7pt; font-weight:700; letter-spacing:.2em; text-transform:uppercase;
  color:#8A9990; margin-bottom:1.2mm;
}
/* The lead runs INLINE with the writing so it reads as one sentence, the way the student wrote
   it — "I was shaped by my Year 10 English teacher, who…" — rather than a label above a quote. */
.stmt-body{ font-size:11.5pt; line-height:1.45; color:${INK}; font-weight:300; }
.stmt-lead{
  font-family:'TarongaHeadline',Georgia,serif; color:${GOLD};
  font-size:12.5pt; letter-spacing:.02em;
}

/* Advice cards hold ONE piece of writing, so it can be set large — this is meant to be read
   from a corridor wall, not held in the hand like the five-chapter certificate. */
.advice{
  font-size:19pt; line-height:1.45; color:${INK}; font-weight:300;
  max-width:215mm; margin:0 auto; text-wrap:pretty;
}
.advice-lead{
  font-family:'TarongaHeadline',Georgia,serif; color:${GOLD};
  font-size:20pt; letter-spacing:.02em;
}

.sign{ margin-top:8mm; }
.who{
  font-family:'TarongaHeadline',Georgia,serif; font-size:19pt; line-height:1;
  letter-spacing:.03em; padding-bottom:3mm; margin-bottom:3mm;
  border-bottom:1px solid ${GOLD}; display:inline-block; min-width:70mm;
}
.where{ font-size:9.5pt; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#5E6F65; }
.when{ margin-top:2mm; font-size:8pt; letter-spacing:.08em; color:#8A9990; }

/* ── On screen only ───────────────────────────────────────────────── */
.toolbar{
  position:sticky; top:0; z-index:10; background:${INK}; color:${CREAM};
  padding:10px 18px; display:flex; align-items:center; justify-content:space-between;
  gap:16px; font-size:13px;
}
.toolbar .actions{ display:flex; gap:10px; align-items:center; }
.toolbar button{
  font:inherit; font-weight:700; border:none; border-radius:99px; cursor:pointer;
  padding:8px 20px;
}
.btn-print{ background:${GOLD}; color:#241503; }
.btn-back{ background:rgba(255,255,255,.1); color:${CREAM}; border:1px solid rgba(255,255,255,.25) !important; }
.screen-pad{ padding:18px 0; display:flex; flex-direction:column; gap:18px; align-items:center; }
.cert{ box-shadow:0 10px 40px rgba(0,0,0,.35); }

@media print {
  .toolbar{ display:none }
  body{ background:#fff }
  .screen-pad{ padding:0; gap:0 }
  .cert{ box-shadow:none }
}
</style>
</head>
<body>
<div class="toolbar">
  <span>${esc(note)}</span>
  <span class="actions">
    <button class="btn-back" onclick="goBack()">← Back to class details</button>
    <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
  </span>
</div>

<div class="screen-pad">${pages}</div>

<script>
  // Opened with window.open, so closing returns the teacher to the class details tab
  // still sitting underneath. If the browser blocks close (tab wasn't script-opened),
  // fall back to history, then to the portal itself.
  function goBack() {
    window.close();
    setTimeout(function () {
      if (history.length > 1) history.back();
      else window.location.href = ${JSON.stringify(origin + '/classDetails')};
    }, 120);
  }
</script>
</body>
</html>`;

}

// Build the document, hand it to a new tab as a blob, and let the browser print or save it.
function openSheet(spec) {
  const blob = new Blob([renderSheet(spec)], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (win) setTimeout(() => URL.revokeObjectURL(url), 60000);
  return !!win;
}

