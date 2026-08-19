// evolvePledgeSheet.js — printable pledge certificates for an Evolve class.
//
// Same approach as teacherInfoSheet.js: build a self-contained HTML document, open it in a new
// tab from a blob URL, and let the teacher print it or save it as a PDF. No PDF library, no
// server round trip.
//
// One certificate per LANDSCAPE A4 page, so each sheet can be handed to a student, given to a
// Year 7 or pinned up on its own. Pass a single-item array to print just one.
//
// Printed on a warm light ground rather than Evolve's twilight palette: a dark page eats toner,
// school printers make a mess of it, and browsers strip backgrounds by default. The one dark
// element is the seal — the Taronga logo is a white lockup and would vanish on cream.

const INK   = '#1A2E22';
const GOLD  = '#B8862B';
const CREAM = '#FBF8F1';

const esc = (t = '') => String(t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/**
 * @param {object}   cls      class doc ({ className, schoolName })
 * @param {object[]} pledges  [{ name, pledge }] — one A4 landscape certificate each
 */
export function openEvolvePledgeSheet(cls = {}, pledges = []) {
  const origin = window.location.origin;
  const year   = new Date().getFullYear();
  const school = esc(cls.schoolName || 'Taronga Tracka');
  const klass  = esc(cls.className || '');
  const single = pledges.length === 1;

  const certs = pledges.length
    ? pledges.map(p => `
      <section class="cert">
        <div class="frame"></div>
        <div class="inner">
          <div class="seal"><img src="${origin}/images/logo.png" alt=""></div>
          <div class="eyebrow">Taronga Zoo Sydney &middot; Evolve</div>
          <h1>My Pledge</h1>
          <div class="rule"><span></span>&#10022;<span></span></div>

          <p class="lead">I will</p>
          <p class="body">${esc(p.pledge)}</p>

          <div class="sign">
            <div class="who">${esc(p.name)}</div>
            <div class="where">${klass ? klass + ' &middot; ' : ''}${school}</div>
            <div class="when">Class of ${year} &middot; Written at Taronga Zoo Sydney</div>
          </div>
        </div>
      </section>`).join('')
    : `<section class="cert"><div class="frame"></div><div class="inner">
         <p class="body">No pledges have been written yet.</p>
         <div class="when">They appear here once students finish the koala chapter at the zoo.</div>
       </div></section>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${single ? 'Evolve Pledge: ' + esc(pledges[0].name) : 'Evolve Pledges: ' + (klass || school)}</title>
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

.inner{ text-align:center; padding:0 30mm; max-width:230mm; }

/* The seal doubles as the fix for a white logo on a cream page. */
.seal{
  width:22mm; height:22mm; border-radius:50%; background:${INK};
  display:flex; align-items:center; justify-content:center;
  margin:0 auto 6mm; box-shadow:0 0 0 1.2mm ${CREAM}, 0 0 0 1.6mm ${GOLD};
}
.seal img{ height:12mm; width:auto; display:block; }

.eyebrow{
  font-size:8pt; font-weight:700; letter-spacing:.36em; text-transform:uppercase;
  color:${GOLD}; margin-bottom:4mm;
}
h1{
  font-family:'TarongaHeadline',Georgia,serif; font-weight:400;
  font-size:32pt; line-height:1; letter-spacing:.04em;
}
.rule{
  display:flex; align-items:center; justify-content:center; gap:4mm;
  margin:5mm 0 9mm; color:${GOLD}; font-size:9pt;
}
.rule span{ display:block; width:26mm; height:1px; background:${GOLD}; opacity:.7; }

.lead{
  font-family:'TarongaHeadline',Georgia,serif; font-size:26pt; line-height:1;
  color:${GOLD}; letter-spacing:.03em; margin-bottom:4mm;
}
.body{
  font-size:21pt; line-height:1.42; color:${INK}; font-weight:300;
  max-width:200mm; margin:0 auto;
}

.sign{ margin-top:11mm; }
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
  <span>${pledges.length} certificate${pledges.length === 1 ? '' : 's'} &middot; one per page. Choose “Save as PDF” as the destination to download.</span>
  <span class="actions">
    <button class="btn-back" onclick="goBack()">← Back to class details</button>
    <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
  </span>
</div>

<div class="screen-pad">${certs}</div>

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

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (win) setTimeout(() => URL.revokeObjectURL(url), 60000);
  return !!win;
}
