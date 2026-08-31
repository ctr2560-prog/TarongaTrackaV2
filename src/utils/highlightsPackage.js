// highlightsPackage.js — the printable class report ("Highlights Package").
//
// Same approach as teacherInfoSheet.js and evolveCertificates.js: build one self-contained HTML
// document, open it in a new tab from a blob URL, and let the teacher print it or save it as a
// PDF. No PDF library, no server round trip.
//
// It carries the same vocabulary as the Analytics tab on screen — the three score domains are
// renamed per subject (Method/Accuracy/Communication for maths, Comparison/Understanding/
// Communication for PDHPE) and use the same colours, so a teacher reading the PDF recognises it
// as the thing they were just looking at.

const BRAND = {
  forest:    '#071E14',
  deep:      '#0A2F1F',
  mid:       '#1A5238',
  eucalyptus:'#2E7D55',
  sage:      '#4A7C61',
  mist:      '#A8C4B2',
  foam:      '#E8F2EC',
  parchment: '#FAF8F4',
  ink:       '#1A1A17',
  slate:     '#6B6B62',
  ash:       '#A8A8A0',
  stone:     '#EDE9E2',
  gold:      '#C9A96E',
};

const esc = (t = '') => String(t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Matches the on-screen Analytics tab exactly — same labels, same colours.
const DOMAINS = {
  maths:   [['behaviour','Method','#059669'], ['detail','Accuracy','#0284C7'], ['writing','Communication','#2E7D55']],
  pdhpe:   [['behaviour','Comparison','#DC2626'], ['detail','Understanding','#7C3AED'], ['writing','Communication','#059669']],
  english: [['behaviour','Vocabulary','#B45309'], ['detail','Understanding','#0284C7'], ['writing','Expression','#2E7D55']],
  science: [['behaviour','Behaviour','#059669'], ['detail','Detail','#0284C7'], ['writing','Writing','#2E7D55']],
};

const fmtDate = (v) => {
  if (!v) return '—';
  const d = v?.toDate?.() || (v instanceof Date ? v : new Date(v));
  return isNaN(d) ? '—' : d.toLocaleDateString('en-AU', { day:'numeric', month:'short', year:'numeric' });
};

// A horizontal bar, drawn with a div rather than a chart library so it survives printing.
const bar = (value, colour) => {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return `<div class="bar"><span style="width:${pct}%;background:${colour}"></span></div>`;
};

/**
 * @param {object}   cls       class doc ({ className, classCode, schoolName, stage, subject, teacherEmail })
 * @param {object[]} students  raw student docs, each with badges[] and observationScore
 */
export function openHighlightsPackage(cls = {}, students = []) {
  const origin  = window.location.origin;
  const subject = (cls.subject || 'science').toLowerCase();
  const domains = DOMAINS[subject] || DOMAINS.science;
  const printed = new Date().toLocaleDateString('en-AU', { day:'numeric', month:'long', year:'numeric' });

  // ── Per-student roll-up ──────────────────────────────────────────────────
  const rows = students.map(s => {
    const badges = s.badges || [];
    const scored = badges.filter(b => b.observationScore && typeof b.observationScore.behaviour === 'number');
    const avg = (key) => scored.length
      ? scored.reduce((sum, b) => sum + (b.observationScore[key] || 0), 0) / scored.length
      : null;
    const qr = badges.flatMap(b => (b.quizResults || []).filter(q => !q.missionType || q.missionType === 'knowledge'));
    const quizPct = qr.length ? Math.round(qr.filter(q => q.correctOnFirstAttempt === true).length / qr.length * 100) : null;
    return {
      name: s.name || s.id,
      points: s.totalPoints || 0,
      badgeCount: badges.length,
      quizPct,
      completed: !!s.completed,
      lastActive: s.completedAt || badges[badges.length - 1]?.timestamp || null,
      scores: { behaviour: avg('behaviour'), detail: avg('detail'), writing: avg('writing') },
      conservation: (s.conservationStatement || '').trim(),
      badges,
    };
  }).sort((a, b) => b.points - a.points);

  // ── Class averages ───────────────────────────────────────────────────────
  const withScores = rows.filter(r => r.scores.behaviour !== null);
  const classAvg = (key) => withScores.length
    ? withScores.reduce((s, r) => s + r.scores[key], 0) / withScores.length
    : null;
  const quizzed = rows.filter(r => r.quizPct !== null);
  const classQuiz = quizzed.length ? Math.round(quizzed.reduce((s, r) => s + r.quizPct, 0) / quizzed.length) : null;
  const completedCount = rows.filter(r => r.completed).length;
  const totalBadges = rows.reduce((s, r) => s + r.badgeCount, 0);

  const domainCards = domains.map(([key, label, colour]) => {
    const v = classAvg(key);
    return `
      <div class="dcard">
        <div class="dlabel" style="color:${colour}">${label}</div>
        <div class="dval">${v === null ? '—' : v.toFixed(1)}<span class="dof">/5</span></div>
        ${v === null ? '' : bar(v, colour)}
      </div>`;
  }).join('');

  // ── Per-student detail, one block each ───────────────────────────────────
  const detail = rows.map(r => {
    const written = r.badges.filter(b => (b.observation || '').trim());
    const chips = domains.map(([key, label, colour]) => {
      const v = r.scores[key];
      return `<span class="chip" style="color:${colour};border-color:${colour}40;background:${colour}10">${label} ${v === null ? '—' : v.toFixed(1)}</span>`;
    }).join('');

    const entries = written.length ? written.map(b => {
      const o = b.observationScore || {};
      const perDomain = typeof o.behaviour === 'number'
        ? domains.map(([key, label, colour]) => `<span class="mini" style="color:${colour}">${label[0]} ${o[key] ?? 0}/5</span>`).join('')
        : '<span class="mini muted">Not scored</span>';
      const quiz = (b.quizResults || []).filter(q => !q.missionType || q.missionType === 'knowledge');
      const quizMark = quiz.length
        ? `<span class="mini ${quiz[0].correctOnFirstAttempt ? 'ok' : 'no'}">${quiz[0].correctOnFirstAttempt ? '✓ Quiz correct' : '✗ Quiz incorrect'}</span>`
        : '';
      return `
        <div class="entry">
          <div class="entry-head">
            <span class="animal">${esc(b.animal || b.animalId || 'Observation')}</span>
            <span class="marks">${perDomain}${quizMark}</span>
          </div>
          <p class="obs">${esc(b.observation)}</p>
        </div>`;
    }).join('') : '<p class="none">No written responses recorded.</p>';

    // The conservation statement is written once at the end of the whole activity, not per
    // animal, so it closes the student's block rather than sitting among the observations.
    const conservation = r.conservation
      ? `<div class="conservation">
           <div class="clabel">Conservation statement</div>
           <p class="cbody">${esc(r.conservation)}</p>
         </div>`
      : '';

    return `
      <section class="student">
        <div class="student-head">
          <div>
            <h3>${esc(r.name)}</h3>
            <div class="meta">${r.badgeCount} badge${r.badgeCount === 1 ? '' : 's'} · ${r.points} points${r.quizPct !== null ? ` · Quiz ${r.quizPct}%` : ''} · ${r.completed ? 'Completed' : 'In progress'} · Last active ${fmtDate(r.lastActive)}</div>
          </div>
          <div class="chips">${chips}</div>
        </div>
        ${entries}
        ${conservation}
      </section>`;
  }).join('');

  const summaryRows = rows.map(r => `
    <tr>
      <td class="nm">${esc(r.name)}</td>
      <td class="num">${r.points}</td>
      <td class="num">${r.badgeCount}</td>
      <td class="num">${r.quizPct === null ? '—' : r.quizPct + '%'}</td>
      ${domains.map(([key]) => `<td class="num">${r.scores[key] === null ? '—' : r.scores[key].toFixed(1)}</td>`).join('')}
      <td class="num">${r.completed ? '✓' : '—'}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Highlights Package: ${esc(cls.className || cls.classCode || 'Class')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800&display=swap" rel="stylesheet">
<style>
@font-face{font-family:'TarongaHeadline';src:url('${origin}/images/TarongaHeadline-Regular.ttf') format('truetype');font-weight:normal}
@page{size:A4;margin:14mm}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',system-ui,sans-serif;color:${BRAND.ink};background:${BRAND.parchment};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{max-width:190mm;margin:0 auto;padding:0 0 14mm}

/* ── Cover band ─────────────────────────────────────────── */
.cover{background:linear-gradient(135deg,${BRAND.forest},${BRAND.mid} 60%,${BRAND.eucalyptus});color:white;padding:9mm 10mm;border-radius:3mm;margin-bottom:7mm}
.eyebrow{font-size:7.5pt;font-weight:800;letter-spacing:.24em;text-transform:uppercase;color:${BRAND.mist};margin-bottom:2mm}
.cover h1{font-family:'TarongaHeadline',Georgia,serif;font-size:26pt;line-height:1.05;letter-spacing:.02em;font-weight:400}
.cover .sub{margin-top:2mm;font-size:10pt;color:rgba(255,255,255,.82)}
.cover .when{margin-top:4mm;font-size:8pt;color:rgba(255,255,255,.6)}

/* ── Stat strip ─────────────────────────────────────────── */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin-bottom:6mm}
.stat{background:white;border:1px solid ${BRAND.stone};border-radius:2.5mm;padding:4mm 3mm;text-align:center}
.stat .v{font-size:19pt;font-weight:800;color:${BRAND.mid};line-height:1}
.stat .l{font-size:7pt;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${BRAND.slate};margin-top:1.5mm}

h2{font-family:'TarongaHeadline',Georgia,serif;font-weight:400;font-size:15pt;color:${BRAND.deep};margin:0 0 3mm;letter-spacing:.02em}
.rule{height:1px;background:${BRAND.stone};margin:0 0 4mm}

/* ── Domain cards ───────────────────────────────────────── */
.domains{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin-bottom:7mm}
.dcard{background:white;border:1px solid ${BRAND.stone};border-radius:2.5mm;padding:4mm}
.dlabel{font-size:8pt;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.dval{font-size:20pt;font-weight:800;color:${BRAND.ink};line-height:1.1;margin-top:1mm}
.dof{font-size:9pt;color:${BRAND.ash};font-weight:600}
.bar{height:2mm;background:${BRAND.stone};border-radius:1mm;overflow:hidden;margin-top:2.5mm}
.bar span{display:block;height:100%;border-radius:1mm}

/* ── Summary table ──────────────────────────────────────── */
table{width:100%;border-collapse:collapse;font-size:8.5pt;margin-bottom:7mm}
th{background:${BRAND.foam};color:${BRAND.deep};font-size:7pt;font-weight:800;letter-spacing:.07em;text-transform:uppercase;padding:2.5mm 2mm;text-align:left;border-bottom:1px solid ${BRAND.mist}}
th.num,td.num{text-align:center}
td{padding:2.2mm 2mm;border-bottom:1px solid ${BRAND.stone}}
td.nm{font-weight:700;color:${BRAND.deep}}
tbody tr:nth-child(even){background:rgba(232,242,236,.35)}

/* ── Student blocks ─────────────────────────────────────── */
.student{background:white;border:1px solid ${BRAND.stone};border-radius:2.5mm;padding:5mm;margin-bottom:4mm;break-inside:avoid}
.student-head{display:flex;justify-content:space-between;align-items:flex-start;gap:4mm;border-bottom:1px solid ${BRAND.stone};padding-bottom:3mm;margin-bottom:3mm}
.student h3{font-family:'TarongaHeadline',Georgia,serif;font-weight:400;font-size:13pt;color:${BRAND.deep};letter-spacing:.02em}
.meta{font-size:7.5pt;color:${BRAND.slate};margin-top:1mm}
.chips{display:flex;gap:1.5mm;flex-wrap:wrap;justify-content:flex-end}
.chip{font-size:7pt;font-weight:700;border:1px solid;border-radius:99px;padding:.8mm 2.2mm;white-space:nowrap}
.entry{padding:2.5mm 0;border-bottom:1px dashed ${BRAND.stone}}
.entry:last-child{border-bottom:none;padding-bottom:0}
.entry-head{display:flex;justify-content:space-between;align-items:baseline;gap:3mm;margin-bottom:1.2mm}
.animal{font-size:8.5pt;font-weight:800;color:${BRAND.eucalyptus}}
.marks{display:flex;gap:2.5mm;flex-wrap:wrap}
.mini{font-size:7pt;font-weight:700}
.mini.muted{color:${BRAND.ash}}
.mini.ok{color:#166534}
.mini.no{color:#B91C1C}
.obs{font-size:9pt;line-height:1.55;color:${BRAND.ink};white-space:pre-wrap}
.none{font-size:8.5pt;color:${BRAND.ash};font-style:italic}

.conservation{margin-top:3mm;padding:3mm 3.5mm;background:${BRAND.foam};border-left:2.5pt solid ${BRAND.eucalyptus};border-radius:0 2mm 2mm 0}
.clabel{font-size:6.5pt;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:${BRAND.eucalyptus};margin-bottom:1mm}
.cbody{font-size:9pt;line-height:1.55;color:${BRAND.deep};font-style:italic;white-space:pre-wrap}

.foot{margin-top:6mm;padding-top:3mm;border-top:1px solid ${BRAND.stone};font-size:7.5pt;color:${BRAND.ash};text-align:center}

/* ── Screen-only toolbar ────────────────────────────────── */
.toolbar{position:sticky;top:0;z-index:10;background:${BRAND.deep};color:white;padding:10px 18px;display:flex;align-items:center;justify-content:space-between;gap:16px;font-size:13px;margin-bottom:8mm}
.toolbar button{font:inherit;font-weight:700;border:none;border-radius:99px;cursor:pointer;padding:8px 20px}
.btn-print{background:${BRAND.gold};color:#241503}
.btn-back{background:rgba(255,255,255,.1);color:white;border:1px solid rgba(255,255,255,.25)!important}
@media print{.toolbar{display:none}body{background:white}.page{max-width:none}}
</style>
</head>
<body>
<div class="toolbar">
  <span>Highlights package for ${esc(cls.className || cls.classCode || 'this class')} · choose “Save as PDF” as the destination to download.</span>
  <span>
    <button class="btn-back" onclick="window.close()">← Back</button>
    <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
  </span>
</div>

<div class="page">
  <div class="cover">
    <div class="eyebrow">Taronga Tracka &middot; Class Highlights Package</div>
    <h1>${esc(cls.className || 'Class')}</h1>
    <div class="sub">${esc(cls.schoolName || '')}${cls.schoolName ? ' &middot; ' : ''}Class code ${esc(cls.classCode || '')}${cls.stage ? ` &middot; Stage ${esc(String(cls.stage))}` : ''} &middot; ${esc(subject.charAt(0).toUpperCase() + subject.slice(1))}</div>
    <div class="when">Generated ${printed}${cls.teacherEmail ? ` &middot; ${esc(cls.teacherEmail)}` : ''}</div>
  </div>

  <div class="stats">
    <div class="stat"><div class="v">${rows.length}</div><div class="l">Students</div></div>
    <div class="stat"><div class="v">${completedCount}</div><div class="l">Completed</div></div>
    <div class="stat"><div class="v">${totalBadges}</div><div class="l">Badges</div></div>
    <div class="stat"><div class="v">${classQuiz === null ? '—' : classQuiz + '%'}</div><div class="l">Avg Quiz</div></div>
  </div>

  <h2>Class averages</h2>
  <div class="rule"></div>
  <div class="domains">${domainCards}</div>

  <h2>Results summary</h2>
  <div class="rule"></div>
  <table>
    <thead>
      <tr>
        <th>Student</th><th class="num">Points</th><th class="num">Badges</th><th class="num">Quiz</th>
        ${domains.map(([, label]) => `<th class="num">${label}</th>`).join('')}
        <th class="num">Done</th>
      </tr>
    </thead>
    <tbody>${summaryRows || '<tr><td colspan="8" class="none">No students yet.</td></tr>'}</tbody>
  </table>

  <h2>Student responses</h2>
  <div class="rule"></div>
  ${detail || '<p class="none">No responses recorded yet.</p>'}

  <div class="foot">Taronga Tracka &middot; ${esc(cls.classCode || '')} &middot; Generated ${printed}</div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (win) setTimeout(() => URL.revokeObjectURL(url), 60000);
  return !!win;
}
