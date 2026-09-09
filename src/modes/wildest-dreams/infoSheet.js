import { WD_STOPS, WD_FOCUS, WD_SOUNDBOARD, WD_OUTCOMES, WD_OUTCOMES_NOTE, WD_FILM_TITLE } from './content';

// infoSheet.js — the Wildest Dreams Teacher Information Sheet.
//
// House pattern (teacherInfoSheet.js, zoosnoozInfoSheet.js, evolveCertificates.js,
// highlightsPackage.js): build one self-contained HTML document, open it in a new tab from a
// blob URL, let the browser print it or save it as a PDF. No PDF library, no server.
//
// A deliberate copy rather than a call into `openTeacherInfoSheet`. That sheet is built around a
// mark scheme — three scored domains, achievement bands, radar charts, "how it's marked" — and
// Wildest Dreams has none of that. Reusing it would put a rubric on a mode whose premise is that
// there isn't one. The two sheets share a look, not a code path.
//
// Everything below is generated from content.js, so adding a stop, a focus prompt or a
// soundboard button updates the sheet with no edit here.

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

// Written for a support-unit teacher planning the day, not for a student.
const FLOW = [
  { n:'01', t:'Watch',        b:'The animal fills the screen and there is no timer. A student stays as long as they want. Nothing counts down and nothing is missed by waiting.' },
  { n:'02', t:'Choose',       b:'Six picture buttons: what I like, see, hear, notice, how I feel, or something else. Choosing is optional. "Just film" skips straight past it.' },
  { n:'03', t:'Film',         b:'One large button starts recording and one stops it. There is no press-and-hold, no countdown and no time limit, so an adult can start or stop it for a student.' },
  { n:'04', t:'Watch it back',b:'The clip plays back with Keep it or Record again. Nothing is thrown away automatically and a student can re-record as many times as they like.' },
  { n:'05', t:'Next animal',  b:'Back to the picture list of animals. Filmed ones are ticked. Animals can be done in any order and any can be skipped.' },
  { n:'06', t:'Final film',   b:`Clips are stitched into one short documentary titled "${WD_FILM_TITLE}", with the student's name, captions and Taronga branding.` },
];

const ACCESS = [
  ['No compulsory writing',   'Not one screen requires typed text. The clip is the record.'],
  ['No compulsory speech',    'A student can film the animal instead of themselves, or use the soundboard, and still finish with a full film.'],
  ['No timed responses',      'Nothing counts down anywhere in the mode.'],
  ['Everything is skippable', 'Every screen has a skip. A student can never be stuck.'],
  ['One idea per screen',     'Single-purpose screens, large text and no persistent counters, timers or scores to ignore.'],
  ['Very large targets',      'Buttons are at least 72px tall, well past the WCAG enhanced target size, for a stylus, a switch or a hand-over-hand prompt.'],
  ['Strong contrast',         'A light ground with very dark text, chosen for low vision and for reading a screen outdoors.'],
  ['Screen reader labels',    'Every control is labelled, icons are hidden from the reader so labels are not read twice, and progress is announced as a count.'],
  ['Visible focus',           'A 4px focus ring for switch and keyboard users.'],
  ['Reduced motion',          'Animation is disabled for anyone whose device asks for it.'],
];

const ON_THE_DAY = [
  { n:'01', t:'One device per student where possible', b:'The camera, the clips and the final film all live on the device the student filmed on. Sharing a device works, but each student needs their own alias so their clips are kept apart.' },
  { n:'02', t:'Allow the camera when asked',           b:'The browser asks once for camera and microphone. If it is declined the mode still runs and every screen still works, but nothing can be filmed. Re-allow it in the browser settings for the site.' },
  { n:'03', t:'Front camera is the default',           b:'It opens on the selfie camera because most students film themselves. "Film the animal" flips it, and flipping back is one tap.' },
  { n:'04', t:'Filming is portrait',                   b:'What a student frames on screen is exactly what lands in the film. Hold the device upright.' },
  { n:'05', t:'Keep the screen on while the film builds', b:'The final film is assembled on the device and takes around a minute. Leave the app open and the screen awake until it finishes.' },
  { n:'06', t:'Reception is patchy at the zoo',        b:'Clips are kept on the device and upload when there is signal, so filming never stops. A film made offline saves once the device is back online.' },
];

const NOT_THIS = [
  'No quiz and no multiple choice.',
  'No score, no marks and no points.',
  'No badges and no leaderboard.',
  'No minimum word count. No writing at all.',
  'No ranking of students against each other.',
];

export function openWildestDreamsInfoSheet(stage) {
  const stageNum = parseInt(stage, 10) || 4;
  const entry    = WD_OUTCOMES[stageNum] || WD_OUTCOMES[4];
  const note     = entry.lifeSkills ? WD_OUTCOMES_NOTE.secondary : WD_OUTCOMES_NOTE.primary;
  const origin   = window.location.origin;
  const today    = new Date().toLocaleDateString('en-AU', { day:'numeric', month:'long', year:'numeric' });

  const outcomeRows = entry.outcomes.map(o => `
    <div class="out-row">
      <div class="out-hd">
        <span class="out-code">${o.code}</span>
        <span class="out-tag">${entry.lifeSkills ? 'Life Skills' : 'NSW Outcome'}</span>
      </div>
      <p class="out-desc">${o.desc}</p>
      <p class="out-ev"><strong>In the mode:</strong> ${o.evidence}</p>
    </div>`).join('');

  const flowRows = FLOW.map(f => `
    <div class="flow-row">
      <div class="flow-num">${f.n}</div>
      <div>
        <div class="flow-title">${f.t}</div>
        <div class="flow-body">${f.b}</div>
      </div>
    </div>`).join('');

  const dayRows = ON_THE_DAY.map(f => `
    <div class="flow-row">
      <div class="flow-num">${f.n}</div>
      <div>
        <div class="flow-title">${f.t}</div>
        <div class="flow-body">${f.b}</div>
      </div>
    </div>`).join('');

  const accessRows = ACCESS.map(([t, b]) => `
    <div class="acc-row">
      <span class="acc-tick">✓</span>
      <div><span class="acc-title">${t}</span><span class="acc-body">${b}</span></div>
    </div>`).join('');

  const stopRows = WD_STOPS.map((s, i) => `
    <div class="stop"><span class="stop-num">${String(i + 1).padStart(2, '0')}</span>${s.name}</div>`).join('');

  const focusRows = WD_FOCUS.map(f => `<span class="chip">${f.label}</span>`).join('');
  const soundRows = WD_SOUNDBOARD.map(s => `<span class="chip chip-quiet">${s.label}</span>`).join('');
  const notRows   = NOT_THIS.map(n => `<li>${n}</li>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wildest Dreams Teacher Information Sheet: Stage ${stageNum}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap" rel="stylesheet">
<style>
@font-face{font-family:'TarongaHeadline';src:url('${origin}/images/TarongaHeadline-Regular.ttf') format('truetype');font-weight:normal;font-style:normal}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',system-ui,sans-serif;font-size:10pt;line-height:1.65;color:${BRAND.ink};background:#EDEAE3;-webkit-font-smoothing:antialiased}
.page{max-width:820px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 24px 80px rgba(7,30,20,0.16)}

.hdr{background:${BRAND.forest};padding:44px 52px 36px;position:relative;overflow:hidden}
.hdr-glow{position:absolute;top:-120px;right:-100px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(46,125,85,0.4) 0%,transparent 70%);pointer-events:none}
.hdr-top{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;position:relative}
.hdr-logo{height:40px;width:auto}
.hdr-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
.hdr-mode{background:${BRAND.eucalyptus};color:#fff;font-size:8pt;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:4px 12px;border-radius:999px}
.hdr-stage{color:${BRAND.mist};font-size:9pt;font-weight:600}
.hdr-title{font-family:'TarongaHeadline',Georgia,serif;color:#fff;font-size:30pt;line-height:1.05;letter-spacing:0.02em;margin-top:26px;position:relative}
.hdr-sub{color:${BRAND.mist};font-size:10.5pt;margin-top:8px;max-width:60ch;position:relative}
.hdr-meta{display:flex;flex-wrap:wrap;gap:8px 22px;margin-top:22px;position:relative}
.meta-item{display:flex;align-items:center;gap:7px;color:#CFE0D6;font-size:8.5pt;font-weight:500}
.meta-dot{width:5px;height:5px;border-radius:50%;background:${BRAND.eucalyptus};flex-shrink:0}

.print-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 52px;background:${BRAND.foam};border-bottom:1px solid ${BRAND.mist}}
.print-hint{font-size:8.5pt;color:${BRAND.slate}}
.print-btn{display:flex;align-items:center;gap:8px;background:${BRAND.mid};color:#fff;border:none;padding:9px 18px;border-radius:8px;font-family:inherit;font-size:9pt;font-weight:700;cursor:pointer}

.body{padding:38px 52px 44px}
.section{margin-bottom:34px}
.sec-kicker{font-size:7.5pt;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.eucalyptus}}
.sec-title{font-family:'TarongaHeadline',Georgia,serif;font-size:17pt;color:${BRAND.deep};letter-spacing:0.02em;margin-top:3px}
.sec-rule{height:3px;width:52px;background:${BRAND.eucalyptus};border-radius:2px;margin:10px 0 16px}
p.lead{font-size:10pt;color:${BRAND.charcoal};max-width:70ch}

.callout{background:${BRAND.foam};border:1px solid ${BRAND.mist};border-radius:12px;padding:16px 20px;margin-top:14px}
.callout h4{font-size:9pt;color:${BRAND.deep};margin-bottom:6px;letter-spacing:0.02em}
.callout ul{margin:0;padding-left:18px}
.callout li{font-size:9.5pt;color:${BRAND.charcoal};margin-bottom:3px}

.out-row{border:1px solid #E4E0D8;border-top:3px solid ${BRAND.mid};border-radius:12px;padding:14px 18px;margin-bottom:10px}
.out-hd{display:flex;align-items:center;gap:9px;margin-bottom:6px;flex-wrap:wrap}
.out-code{font-family:ui-monospace,Menlo,monospace;font-size:9pt;font-weight:700;color:#fff;background:${BRAND.mid};padding:2px 9px;border-radius:5px;letter-spacing:0.02em}
.out-tag{font-size:7pt;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${BRAND.slate};background:${BRAND.foam};padding:2px 8px;border-radius:999px}
.out-desc{font-size:9.5pt;color:${BRAND.charcoal}}
.out-ev{font-size:9pt;color:${BRAND.slate};margin-top:8px;padding-top:8px;border-top:1px solid ${BRAND.foam}}
.out-ev strong{color:${BRAND.deep}}
.note{font-size:9pt;color:${BRAND.slate};font-style:italic;margin-bottom:14px;max-width:72ch}

.flow-row{display:flex;gap:16px;padding:12px 0;border-top:1px solid ${BRAND.foam}}
.flow-num{flex-shrink:0;width:30px;font-family:'TarongaHeadline',Georgia,serif;font-size:15pt;color:${BRAND.mist};line-height:1.1}
.flow-title{font-size:10pt;font-weight:700;color:${BRAND.deep}}
.flow-body{font-size:9.5pt;color:${BRAND.charcoal};margin-top:2px}

.acc-row{display:flex;gap:11px;padding:8px 0;border-top:1px solid ${BRAND.foam};align-items:flex-start}
.acc-tick{flex-shrink:0;width:17px;height:17px;border-radius:50%;background:${BRAND.mid};color:#fff;font-size:8pt;display:flex;align-items:center;justify-content:center;margin-top:2px}
.acc-title{font-size:9.5pt;font-weight:700;color:${BRAND.deep};display:block}
.acc-body{font-size:9.5pt;color:${BRAND.charcoal}}

.stops{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.stop{display:flex;align-items:center;gap:8px;border:1px solid ${BRAND.mist};background:${BRAND.foam};border-radius:10px;padding:7px 14px;font-size:9.5pt;font-weight:600;color:${BRAND.deep}}
.stop-num{font-family:ui-monospace,Menlo,monospace;font-size:8pt;color:${BRAND.eucalyptus}}

.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.chip{background:${BRAND.mid};color:#fff;font-size:8.5pt;font-weight:600;padding:4px 11px;border-radius:999px}
.chip-quiet{background:${BRAND.foam};color:${BRAND.deep};border:1px solid ${BRAND.mist}}

.ftr{display:flex;align-items:center;justify-content:space-between;gap:20px;background:${BRAND.forest};padding:22px 52px}
.ftr-left{display:flex;align-items:center;gap:14px}
.ftr-logo{height:26px;width:auto}
.ftr-divider{width:1px;height:22px;background:rgba(255,255,255,0.22)}
.ftr-name{font-family:'TarongaHeadline',Georgia,serif;color:#fff;font-size:11pt;letter-spacing:0.05em}
.ftr-right{color:${BRAND.mist};font-size:8pt;text-align:right;line-height:1.5}

@media print{
  body{background:#fff}
  .page{max-width:none;margin:0;border-radius:0;box-shadow:none}
  .print-bar{display:none!important}
  .hdr,.ftr,.hdr-glow,.hdr-mode,.sec-rule,.callout,.out-code,.out-tag,
  .acc-tick,.stop,.chip,.meta-dot{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .section{page-break-inside:avoid}
  .out-row{page-break-inside:avoid}
  .flow-row{page-break-inside:avoid}
}
</style>
</head>
<body>
<div class="page">

  <div class="hdr">
    <div class="hdr-glow"></div>
    <div class="hdr-top">
      <img src="${origin}/images/logo.png" alt="Taronga Tracka" class="hdr-logo">
      <div class="hdr-right">
        <span class="hdr-mode">Wildest Dreams</span>
        <span class="hdr-stage">Stage ${stageNum}</span>
      </div>
    </div>
    <div class="hdr-title">Teacher Information Sheet</div>
    <div class="hdr-sub">A video-first day at Taronga where every student makes their own wildlife documentary. Nothing is marked.</div>
    <div class="hdr-meta">
      <div class="meta-item"><span class="meta-dot"></span> Stage ${stageNum} · ${entry.syllabus}</div>
      <div class="meta-item"><span class="meta-dot"></span> ${WD_STOPS.length} animal stops · no GPS required</div>
      <div class="meta-item"><span class="meta-dot"></span> Prepared ${today}</div>
    </div>
  </div>

  <div class="print-bar">
    <span class="print-hint">Share with your teaching team and support staff, or File › Print to save as PDF.</span>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="body">

    <div class="section">
      <div class="sec-kicker">Section 01</div>
      <div class="sec-title">What Wildest Dreams is</div>
      <div class="sec-rule"></div>
      <p class="lead">Students watch an animal, choose what they want to show about it, and film a short piece. Their clips are stitched into one documentary called &ldquo;${WD_FILM_TITLE}&rdquo; that they keep. It is built for diverse learners and school support units, and it is designed so that a student who does not write and does not speak still finishes with a complete film of their own.</p>
      <div class="callout">
        <h4>What this mode deliberately does not have</h4>
        <ul>${notRows}</ul>
      </div>
    </div>

    <div class="section">
      <div class="sec-kicker">Section 02</div>
      <div class="sec-title">${entry.lifeSkills ? 'Life Skills outcomes addressed' : 'Outcomes addressed'}</div>
      <div class="sec-rule"></div>
      <p class="note">${note}</p>
      ${outcomeRows}
      <p class="note" style="margin-top:12px">Evidence is the student's own film. These outcomes are for programming and reporting; the footage is not graded.</p>
    </div>

    <div class="section">
      <div class="sec-kicker">Section 03</div>
      <div class="sec-title">What a student does at each animal</div>
      <div class="sec-rule"></div>
      ${flowRows}
    </div>

    <div class="section">
      <div class="sec-kicker">Section 04</div>
      <div class="sec-title">Ways to take part</div>
      <div class="sec-rule"></div>
      <p class="lead">Communication is the point of the mode, not a barrier to it. Any of these produces a full film.</p>
      <p class="lead" style="margin-top:14px"><strong>Speaking to camera</strong> · <strong>Signing or gesture</strong> · <strong>Pointing at the animal while an adult films</strong> · <strong>Filming the animal instead of themselves</strong> · <strong>Tapping the soundboard</strong></p>
      <p class="lead" style="margin-top:14px;font-size:9.5pt;color:${BRAND.slate}">The soundboard speaks the word aloud and adds it to the film as a caption, so a student who uses it still has their voice on their documentary.</p>
      <div style="margin-top:16px">
        <div class="sec-kicker" style="color:${BRAND.slate}">Focus choices</div>
        <div class="chips">${focusRows}</div>
      </div>
      <div style="margin-top:14px">
        <div class="sec-kicker" style="color:${BRAND.slate}">Soundboard</div>
        <div class="chips">${soundRows}</div>
      </div>
    </div>

    <div class="section">
      <div class="sec-kicker">Section 05</div>
      <div class="sec-title">Accessibility built in</div>
      <div class="sec-rule"></div>
      ${accessRows}
    </div>

    <div class="section">
      <div class="sec-kicker">Section 06</div>
      <div class="sec-title">On the day</div>
      <div class="sec-rule"></div>
      ${dayRows}
    </div>

    <div class="section">
      <div class="sec-kicker">Section 07</div>
      <div class="sec-title">Animals on the route</div>
      <div class="sec-rule"></div>
      <p class="lead">Animals can be filmed in any order, and any of them can be skipped. There is no proximity check, so a group moves at its own pace and nothing locks.</p>
      <div class="stops">${stopRows}</div>
      <p class="note" style="margin-top:14px">Confirm the route with Taronga Education before your visit; stops can be adjusted to suit your group.</p>
    </div>

    <div class="section" style="margin-bottom:0">
      <div class="sec-kicker">Section 08</div>
      <div class="sec-title">The film they take home</div>
      <div class="sec-rule"></div>
      <p class="lead">&ldquo;${WD_FILM_TITLE}&rdquo; opens on a title card with the student's name, runs each animal clip with its caption, and closes on &ldquo;A film by&hellip;&rdquo; with Taronga branding. Students can save it to the device from the last screen. It is a souvenir, not an assessment artefact, and it is worth screening back at school.</p>
    </div>

  </div>

  <div class="ftr">
    <div class="ftr-left">
      <img src="${origin}/images/logo.png" alt="Taronga Tracka" class="ftr-logo">
      <div class="ftr-divider"></div>
      <span class="ftr-name">Taronga Tracka</span>
    </div>
    <div class="ftr-right">
      Wildest Dreams · Stage ${stageNum}<br>
      taronga.org.au · Education Programs
    </div>
  </div>

</div>
</body>
</html>`;

  const blob = new Blob([html], { type:'text/html' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (win) setTimeout(() => URL.revokeObjectURL(url), 60000);
}
