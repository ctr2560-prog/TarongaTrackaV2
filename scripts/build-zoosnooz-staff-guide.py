#!/usr/bin/env python3
"""Builds the standalone ZooSnooz staff operations guide.

    python3 scripts/build-zoosnooz-staff-guide.py

Output is ONE self-contained HTML file at docs/staff-guide/zoosnooz-staff-guide.html.
Every screenshot, both logos and the Taronga display font are embedded as data URIs,
so it can be emailed, opened from a USB stick, or printed on a machine that has never
seen this repo. Nothing it needs is fetched over the network.

⚠️ It is NOT in public/ and is NOT served by the site. That is deliberate — Cameron
asked for a standalone document, not a page on tarongatracka.com.au. Putting it back
under public/ would publish it.

⚠️ The screenshots in docs/staff-guide/screenshots/ are REAL frames of the running app,
captured through the Chrome DevTools Protocol against the dev server with a geolocation
override standing at each enclosure, then cropped to the region worth reading. They are
NOT mockups. 🚫 Do not hand-edit them, and do not substitute a mockup — a staff guide
showing a screen the app does not have is worse than no screenshot.

⚠️ EVERY FACT HERE IS READ OUT OF THE CODE, not written from memory: the five animals and
their instruments from data/zoosnoozAnimals.js, which two are timed from INTER_DURATION,
the 20-second observation lock and the 120-point maximum from ZooSnoozScreen.jsx. If the
content changes, re-check this document against the data rather than trusting it.

⚠️ The page geometry is hand-fitted: each .page-body measures 260.5mm and A4 leaves
exactly that. Changing a font size, an image cap or a margin will push a page over and
silently produce a seventh page. Re-measure after any change — print to PDF and count.
"""
import base64, pathlib

REPO  = pathlib.Path(__file__).resolve().parent.parent
SHOTS = REPO / 'docs/staff-guide/screenshots'
OUT   = REPO / 'docs/staff-guide/zoosnooz-staff-guide.html'

def b64(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(pathlib.Path(path).read_bytes()).decode()

FONT  = b64(REPO / 'public/images/TarongaHeadline-Regular.ttf', 'font/ttf')
LOGO  = b64(REPO / 'public/images/logo.png', 'image/png')
WILD  = b64(REPO / 'public/images/taronga-zoo-white.png', 'image/png')
def shot(n): return b64(SHOTS / f'{n}.jpg', 'image/jpeg')

S = {n: shot(n) for n in [
    's1-map','s2-insight','s3-instrument','s4-question','s5-answer','s6-watch',
    's7-write','s8-film','s9-clipcard','s10-badge','s11-documentary']}

def fig(key, num, title, body):
    return f'''<figure class="shot">
      <img src="{S[key]}" alt="{title}">
      <figcaption><span class="shot-n">{num}</span><b>{title}</b>{body}</figcaption>
    </figure>'''

HTML = f'''<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ZooSnooz — Staff Operations Guide — Taronga Tracka</title>
<style>
@font-face {{
  font-family: 'Taronga Headline';
  src: url({FONT}) format('truetype');
  font-display: swap;
}}
:root {{
  --deep:#0A2F1F; --mid:#1A5238; --euc:#2E7D55; --sage:#4A9E6B;
  --foam:#E8F2EC; --stone:#E4DFD6; --cream:#FBF9F5; --slate:#5F6861;
  --ink:#16201A; --amber:#B45309; --amber-bg:#FDF6E8;
}}
* {{ box-sizing: border-box; }}
html {{ -webkit-text-size-adjust: 100%; }}
body {{
  margin:0; background:#5a5f5b; color:var(--ink);
  font-family:'Inter','Helvetica Neue',Helvetica,Arial,sans-serif;
  font-size:10.2pt; line-height:1.52; -webkit-font-smoothing:antialiased;
}}
.display {{ font-family:'Taronga Headline','Inter',sans-serif; font-weight:400; letter-spacing:.01em; }}

/* ── toolbar (screen only) ─────────────────────────────────────── */
.bar {{
  position:sticky; top:0; z-index:50; background:var(--deep); color:#fff;
  padding:.65rem 1.1rem; display:flex; gap:1rem; align-items:center;
  justify-content:space-between; flex-wrap:wrap; font-size:9.4pt;
}}
.bar span {{ opacity:.82; }}
.bar button {{
  font:inherit; font-weight:700; cursor:pointer; color:var(--deep); background:#fff;
  border:0; border-radius:999px; padding:.42rem 1.15rem;
}}
.bar button:hover {{ background:var(--foam); }}

/* ── page ──────────────────────────────────────────────────────── */
.page {{
  width:210mm; min-height:297mm; margin:14px auto; background:#fff;
  padding:15mm 15mm 10mm; position:relative;
  box-shadow:0 10px 34px rgba(0,0,0,.34); display:flex; flex-direction:column;
}}
.page-body {{ flex:1 1 auto; }}

/* ── masthead ──────────────────────────────────────────────────── */
.masthead {{
  background:linear-gradient(118deg,var(--deep) 0%,var(--mid) 58%,var(--euc) 100%);
  color:#fff; margin:-15mm -15mm 6mm; padding:7.5mm 15mm 6.5mm; position:relative; overflow:hidden;
}}
.masthead::after {{
  content:''; position:absolute; right:-40mm; top:-40mm; width:95mm; height:95mm;
  border-radius:50%; background:rgba(255,255,255,.055);
}}
.mast-top {{ display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; position:relative; }}
.eyebrow {{ font-size:7.6pt; letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.72); font-weight:700; }}
.masthead h1 {{ font-size:34pt; margin:.14em 0 0; line-height:1; }}
.masthead .sub {{ font-size:11pt; color:rgba(255,255,255,.88); margin:.5em 0 0; max-width:118mm; }}
.mast-logo {{ height:17mm; width:auto; opacity:.97; flex:none; }}
.facts {{ display:flex; gap:0; margin-top:5.5mm; border-top:1px solid rgba(255,255,255,.2); padding-top:4.5mm; position:relative; }}
.fact {{ flex:1; padding-right:4mm; }}
.fact + .fact {{ border-left:1px solid rgba(255,255,255,.18); padding-left:4mm; }}
.fact dt {{ font-size:7pt; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.62); font-weight:700; }}
.fact dd {{ margin:.28em 0 0; font-size:10pt; font-weight:600; }}

/* ── running head on later pages ───────────────────────────────── */
.runhead {{
  display:flex; justify-content:space-between; align-items:baseline;
  border-bottom:2.5px solid var(--deep); padding-bottom:2.6mm; margin-bottom:6.5mm;
}}
.runhead .l {{ font-size:8pt; letter-spacing:.24em; text-transform:uppercase; font-weight:700; color:var(--euc); }}
.runhead .r {{ font-size:13.5pt; color:var(--deep); }}

/* ── sections ──────────────────────────────────────────────────── */
section {{ margin-bottom:4.5mm; break-inside:avoid; }}
h2 {{
  font-size:13pt; margin:0 0 2.6mm; color:var(--deep);
  display:flex; align-items:center; gap:2.6mm; font-family:'Taronga Headline','Inter',sans-serif; font-weight:400;
}}
h2 .num {{
  flex:none; width:7.4mm; height:7.4mm; border-radius:50%; background:var(--deep); color:#fff;
  font-family:'Inter',sans-serif; font-size:8pt; font-weight:800;
  display:inline-flex; align-items:center; justify-content:center;
}}
h3 {{ font-size:9.4pt; margin:0 0 1.4mm; color:var(--mid); letter-spacing:.015em; }}
p {{ margin:0 0 2.4mm; }}
b, strong {{ color:var(--deep); font-weight:700; }}
.lede {{ font-size:10.5pt; }}

/* ── step strip ────────────────────────────────────────────────── */
.steps {{ display:grid; grid-template-columns:repeat(6,1fr); gap:2mm; margin:3.5mm 0 0; }}
.step {{ background:var(--foam); border-radius:3mm; padding:2.6mm 2.2mm; border-top:2.5px solid var(--euc); }}
.step .n {{ font-size:7pt; font-weight:800; letter-spacing:.14em; color:var(--euc); }}
.step .t {{ font-size:9pt; font-weight:800; color:var(--deep); margin:.6mm 0 1mm; line-height:1.2; }}
.step .d {{ font-size:7.7pt; color:var(--slate); line-height:1.38; }}

/* ── screenshots ───────────────────────────────────────────────── */
.shots {{ display:grid; gap:5mm; margin:4mm 0 0; }}
.shots-3 {{ grid-template-columns:repeat(3,1fr); }}
.shots-2 {{ grid-template-columns:repeat(2,1fr); }}
.shots-4 {{ grid-template-columns:repeat(4,1fr); }}
figure.shot {{ margin:0; }}
figure.shot img {{
  display:block; width:100%; height:auto; margin:0 auto; border-radius:3.6mm;
  border:1px solid var(--stone); background:#0A1410;
}}
.shots-3 figure.shot img {{ max-height:76mm; width:auto; }}
.shots-4 figure.shot img {{ max-height:92mm;  width:auto; }}
.shots-2 figure.shot img {{ max-height:74mm; width:auto; }}
.shots-2 figure.shot {{ width:fit-content; margin:0 auto; }}
figure.shot figcaption {{ text-align:left; font-size:7.8pt; color:var(--slate); line-height:1.38; margin-top:1.8mm; }}
figure.shot figcaption b {{ display:block; font-size:8.6pt; margin:.3mm 0 .7mm; }}
.split {{ display:grid; grid-template-columns:35mm 1fr; gap:6mm; align-items:start; margin-top:3mm; }}
.split figure.shot img {{ max-height:none; width:100%; }}
.shot-n {{
  display:inline-block; font-size:6.6pt; font-weight:800; letter-spacing:.14em;
  color:#fff; background:var(--euc); border-radius:999px; padding:.5mm 2mm;
}}

/* ── tables ────────────────────────────────────────────────────── */
table {{ width:100%; border-collapse:collapse; font-size:8.8pt; margin-top:2mm; }}
th {{
  text-align:left; font-size:7.1pt; letter-spacing:.17em; text-transform:uppercase;
  color:#fff; background:var(--deep); padding:1.9mm 2.6mm; font-weight:700;
}}
td {{ padding:2mm 2.6mm; border-bottom:1px solid var(--stone); vertical-align:top; }}
tbody tr:nth-child(even) td {{ background:#FAFBFA; }}
.sci {{ display:block; font-style:italic; font-size:7.6pt; color:var(--slate); }}
.tag {{
  display:inline-block; font-size:7pt; font-weight:800; letter-spacing:.08em; text-transform:uppercase;
  border-radius:999px; padding:.5mm 2mm; white-space:nowrap;
}}
.tag-timed {{ background:#FCECEC; color:#9B1C1C; }}
.tag-free {{ background:var(--foam); color:var(--mid); }}
.num-cell {{ text-align:center; font-weight:800; color:var(--deep); white-space:nowrap; }}

/* ── callouts ──────────────────────────────────────────────────── */
.note {{
  background:var(--foam); border-left:3.5px solid var(--euc);
  padding:2.6mm 4mm; border-radius:0 2.5mm 2.5mm 0; margin:3mm 0 0; font-size:9pt;
}}
.note.warn {{ background:var(--amber-bg); border-left-color:var(--amber); }}
.note.warn b {{ color:var(--amber); }}
.cols {{ display:grid; grid-template-columns:1fr 1fr; gap:5mm; }}
.card {{ background:var(--cream); border:1px solid var(--stone); border-radius:3mm; padding:3.6mm 4mm; }}
ul {{ margin:0; padding-left:4.4mm; }}
li {{ margin-bottom:1.5mm; }}
li::marker {{ color:var(--euc); }}

/* ── troubleshooting ───────────────────────────────────────────── */
.fix {{ margin-top:3.4mm; }}
.fix {{ background:var(--cream); border:1px solid var(--stone); border-left:3.5px solid var(--euc);
  border-radius:0 2.5mm 2.5mm 0; padding:3mm 4mm; }}
.fix p:last-child {{ margin-bottom:0; }}
.fix .q {{ font-weight:800; color:var(--deep); font-size:9.2pt; }}

/* ── footer ────────────────────────────────────────────────────── */
.foot {{
  margin:6mm -15mm -10mm; padding:4mm 15mm;
  background:var(--deep); color:rgba(255,255,255,.8); font-size:7.8pt;
  display:flex; justify-content:space-between; align-items:center; gap:1rem;
}}
.foot img {{ height:7.5mm; opacity:.92; }}
.foot .pg {{ font-weight:700; color:#fff; }}

/* ── print ─────────────────────────────────────────────────────── */
@page {{ size:A4; margin:0; }}
@media print {{
  body {{ background:#fff; }}
  .bar {{ display:none !important; }}
  .page {{ margin:0; box-shadow:none; break-after:page; width:auto; min-height:auto; height:297mm; }}
  .page:last-child {{ break-after:auto; }}
  * {{ -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }}
}}
@media screen and (max-width:230mm) {{
  .shots-3 figure.shot img, .shots-4 figure.shot img, .shots-2 figure.shot img {{ max-height:none; width:100%; }}
  .page {{ width:auto; max-width:100%; margin:0; padding:7mm 5mm 5mm; min-height:0; }}
  .masthead {{ margin:-7mm -5mm 6mm; padding:7mm 5mm 6mm; }}
  .masthead h1 {{ font-size:26pt; }}
  .foot {{ margin:6mm -5mm -5mm; padding:4mm 5mm; }}
  .steps {{ grid-template-columns:repeat(2,1fr); }}
  .shots-3, .shots-4 {{ grid-template-columns:repeat(2,1fr); }}
  .cols, .split {{ grid-template-columns:1fr; }}
  .shots-2 figure.shot {{ width:auto; }}
  .split figure.shot img {{ max-width:52mm; }}
}}
</style>
</head>
<body>

<div class="bar">
  <span>ZooSnooz staff operations guide &mdash; six pages. Print double-sided, or save as a PDF from your browser.</span>
  <button onclick="window.print()">Save as PDF / Print</button>
</div>

<!-- ══════════════════════════ PAGE 1 ══════════════════════════ -->
<div class="page">
 <div class="page-body">
  <div class="masthead">
    <div class="mast-top">
      <div>
        <div class="eyebrow">Staff Operations Guide</div>
        <h1 class="display">ZooSnooz</h1>
        <p class="sub">The night-time field study, delivered through Taronga Tracka.</p>
      </div>
      <img class="mast-logo" src="{LOGO}" alt="Taronga Tracka">
    </div>
    <dl class="facts">
      <div class="fact"><dt>Programme</dt><dd>Taronga Zoo Sydney sleepover</dd></div>
      <div class="fact"><dt>Animals</dt><dd>Five, in any order</dd></div>
      <div class="fact"><dt>Per animal</dt><dd>15&ndash;20 minutes</dd></div>
      <div class="fact"><dt>Device</dt><dd>One phone per student or pair</dd></div>
    </dl>
  </div>

  <section>
    <h2><span class="num">01</span>What ZooSnooz is</h2>
    <p class="lede">Students become night researchers. At each of five animals they read a keeper
    insight, use an on-screen instrument to gather their own data, answer one question about what they
    found, write an observation, and film a piece to camera. The clips become a documentary they keep.</p>
    <p>The app carries the structure, the timing and the marking. <b>Your job is movement, pacing and
    encouragement</b> &mdash; not running the technology.</p>
  </section>

  <section>
    <h2><span class="num">02</span>The six steps, every animal</h2>
    <div class="steps">
      <div class="step"><div class="n">STEP 1</div><div class="t">Keeper insight</div><div class="d">One card. What to watch for.</div></div>
      <div class="step"><div class="n">STEP 2</div><div class="t">Instrument</div><div class="d">They gather their own data.</div></div>
      <div class="step"><div class="n">STEP 3</div><div class="t">One question</div><div class="d">About what they just measured.</div></div>
      <div class="step"><div class="n">STEP 4</div><div class="t">Observation</div><div class="d">Watch, then write.</div></div>
      <div class="step"><div class="n">STEP 5</div><div class="t">Film</div><div class="d">A short piece to camera.</div></div>
      <div class="step"><div class="n">STEP 6</div><div class="t">Badge</div><div class="d">Points, then back to the map.</div></div>
    </div>
  </section>

  <section>
    <h2><span class="num">03</span>The map they come back to</h2>
    <div class="split">
      <figure class="shot tall">
        <img src="{S['s1-map']}" alt="The ZooSnooz map screen">
        <figcaption><span class="shot-n">A</span><b>Five animals, in any order</b>An animal only opens
        when the student is standing at it. The rest show the distance.</figcaption>
      </figure>
      <div>
        <p>The screen a student returns to after every animal, and the one you will be reading over
        shoulders all night.</p>
        <ul>
          <li><b>An animal unlocks on arrival.</b> Until then the card shows how far away it is, so a
          group can see that they are not there yet.</li>
          <li><b>Order does not matter, and walking away costs nothing.</b> A place is held
          mid-activity, so a group moved on early loses no work.</li>
          <li>Top right is animals finished out of five. <b>Submit Session</b> ends the night and
          starts the film.</li>
        </ul>
      </div>
    </div>
  </section>
 </div>
 <div class="foot">
   <span>Taronga Tracka &mdash; an education program by Taronga Zoo Sydney</span>
   <img src="{WILD}" alt="Taronga \u2014 For the Wild">
   <span class="pg">Page 1 of 6</span>
 </div>
</div>

<!-- ══════════════════════════ PAGE 2 ══════════════════════════ -->
<div class="page">
 <div class="page-body">
  <div class="runhead">
    <span class="l">ZooSnooz &middot; Staff Operations Guide</span>
    <span class="r display">The five animals</span>
  </div>

  <section>
    <h2><span class="num">04</span>What each animal asks for</h2>
    <table>
      <thead><tr><th style="width:27%">Animal</th><th style="width:17%">Instrument</th><th style="width:13%">Timing</th><th>What the student does</th></tr></thead>
      <tbody>
        <tr><td><b>Sumatran Tiger</b><span class="sci">Panthera tigris sumatrae</span></td>
            <td>Energy tracker</td><td><span class="tag tag-timed">30 sec</span></td>
            <td>Holds a button while the tiger moves and releases when it is still, building an activity timeline.</td></tr>
        <tr><td><b>African Lion</b><span class="sci">Panthera leo</span></td>
            <td>Sound monitor</td><td><span class="tag tag-timed">30 sec</span></td>
            <td>Holds the phone towards the enclosure. The microphone tracks volume over time.</td></tr>
        <tr><td><b>Greater One-Horned Rhino</b><span class="sci">Rhinoceros unicornis</span></td>
            <td>Movement pad</td><td><span class="tag tag-free">Untimed</span></td>
            <td>Drags a finger across a pad to feel weight and momentum. The app reads the gait: walk, trot or charge.</td></tr>
        <tr><td><b>Binturong</b><span class="sci">Arctictis binturong</span></td>
            <td>Light scanner</td><td><span class="tag tag-free">Untimed</span></td>
            <td>Points the camera around the animal. Reads how well dark fur hides it at that light level.</td></tr>
        <tr><td><b>Sun Bear</b><span class="sci">Helarctos malayanus</span></td>
            <td>Field sketch</td><td><span class="tag tag-free">Untimed</span></td>
            <td>Draws and labels what they can see &mdash; the claws, the tongue, the chest patch.</td></tr>
      </tbody>
    </table>
    <div class="note warn"><b>The lion and the tiger are the two on a timer</b>, and both need the
    group settled and quiet for thirty seconds. Send a restless group to the other three first.</div>
  </section>

  <section>
    <h2><span class="num">05</span>Reading the animal, then measuring it</h2>
    <div class="shots shots-3">
      {fig('s2-insight', 'B', 'Keeper insight', 'Three lines on what this animal is doing tonight and why, then the mission. Worth reading aloud before a group scatters.')}
      {fig('s3-instrument', 'C', 'The instrument', 'The tiger energy tracker, finished. The student held the button while it moved and released when it was still.')}
      {fig('s4-question', 'D', 'One question', 'Their own reading sits above the question, so it is about what they measured rather than what they remember.')}
    </div>
  </section>
 </div>
 <div class="foot">
   <span>Taronga Tracka &mdash; an education program by Taronga Zoo Sydney</span>
   <img src="{WILD}" alt="Taronga \u2014 For the Wild">
   <span class="pg">Page 2 of 6</span>
 </div>
</div>

<!-- ══════════════════════════ PAGE 3 ══════════════════════════ -->
<div class="page">
 <div class="page-body">
  <div class="runhead">
    <span class="l">ZooSnooz &middot; Staff Operations Guide</span>
    <span class="r display">Watching, writing and marks</span>
  </div>

  <section>
    <h2><span class="num">06</span>From the answer to the writing</h2>
    <div class="shots shots-3">
      {fig('s5-answer', 'E', 'The answer, then why', 'Right or wrong, they get the explanation. A wrong answer can be retried \u2014 it still teaches, it just does not score.')}
      {fig('s6-watch', 'F', 'Twenty seconds of watching', 'The writing box stays shut for twenty seconds so they look at the animal first. There is a quiet skip if you need to move a group on.')}
      {fig('s7-write', 'G', 'The observation', 'A keeper question to steer them, an optional hint, and a word count. This part carries most of the marks.')}
    </div>
  </section>

  <section>
    <h2><span class="num">07</span>How points work</h2>
    <p>Each animal is worth up to <b>120 points</b>. The written observation is marked out of 15 across
    three areas and scaled to 100; a question answered correctly first time adds 20.</p>
    <table>
      <thead><tr><th style="width:20%">Area</th><th>What earns marks</th><th style="width:12%">Out of</th></tr></thead>
      <tbody>
        <tr><td><b>Behaviour</b></td><td>Describing what the animal is actually doing &mdash; moving, resting, hiding, calling</td><td class="num-cell">5</td></tr>
        <tr><td><b>Detail</b></td><td>Naming what they can see &mdash; claws, horn, fur, shadow, sounds, surroundings</td><td class="num-cell">5</td></tr>
        <tr><td><b>Writing</b></td><td>Length and clarity, with expectations set by the class stage</td><td class="num-cell">5</td></tr>
        <tr><td><b>Question</b></td><td>Correct on the first attempt</td><td class="num-cell">20</td></tr>
      </tbody>
    </table>
    <div class="note">Marking adjusts to the class stage. A Year 3 answer is held to Year 3 expectations,
    not the same bar as a Year 11.</div>
  </section>
 </div>
 <div class="foot">
   <span>Taronga Tracka &mdash; an education program by Taronga Zoo Sydney</span>
   <img src="{WILD}" alt="Taronga \u2014 For the Wild">
   <span class="pg">Page 3 of 6</span>
 </div>
</div>

<!-- ══════════════════════════ PAGE 4 ══════════════════════════ -->
<div class="page">
 <div class="page-body">
  <div class="runhead">
    <span class="l">ZooSnooz &middot; Staff Operations Guide</span>
    <span class="r display">Filming</span>
  </div>

  <section>
    <h2><span class="num">08</span>The camera</h2>
    <div class="split">
      <figure class="shot">
        <img src="{S['s8-film']}" alt="The ZooSnooz filming screen">
        <figcaption><span class="shot-n">H</span><b>A camera app, deliberately</b>Zoom, a night mode,
        and a flip. Skip is always there.</figcaption>
      </figure>
      <div>
        <p>Each animal ends with a short piece to camera, and a line at the top says what to film.
        <b>It is optional</b> &mdash; the skip underneath costs no marks.</p>
        <ul>
          <li><b>Night</b> lifts a dark enclosure. Worth turning on before they complain the picture
          is black.</li>
          <li><b>Zoom</b> runs 1&times; to 3&times;. On a phone with an ultra-wide lens a 0.5&times;
          appears as well.</li>
          <li><b>Flip</b> swaps between the animal and the student. Most film the animal and talk
          over it.</li>
          <li>Recording stops itself. Nobody has to remember to press anything twice.</li>
          <li>If the picture is a black rectangle, the enclosure is too dark for the phone. Move them
          closer, turn Night on, and get the white torches off the glass.</li>
        </ul>
      </div>
    </div>
  </section>

  <section>
    <h2><span class="num">09</span>What they get back</h2>
    <div class="shots shots-2">
      {fig('s9-clipcard', 'I', 'Their clip, carded', 'The moment recording stops, the clip is wrapped in the Taronga card with their own writing beneath it \u2014 exactly as it appears in the finished film.')}
      {fig('s10-badge', 'J', 'The badge', 'Points, the quiz bonus, and the writing scored in three bars, with one thing done well and one to try next time.')}
    </div>
    <div class="note warn"><b>Red torches, not white.</b> Red preserves night vision, disturbs the
    animals far less, and is the difference between usable footage and a black rectangle.</div>
  </section>
 </div>
 <div class="foot">
   <span>Taronga Tracka &mdash; an education program by Taronga Zoo Sydney</span>
   <img src="{WILD}" alt="Taronga \u2014 For the Wild">
   <span class="pg">Page 4 of 6</span>
 </div>
</div>

<!-- ══════════════════════════ PAGE 5 ══════════════════════════ -->
<div class="page">
 <div class="page-body">
  <div class="runhead">
    <span class="l">ZooSnooz &middot; Staff Operations Guide</span>
    <span class="r display">The documentary, and the night itself</span>
  </div>

  <section>
    <h2><span class="num">10</span>The documentary</h2>
    <div class="split">
      <figure class="shot tall">
        <img src="{S['s11-documentary']}" alt="The finished documentary, ready to submit">
        <figcaption><span class="shot-n">K</span><b>The finished film</b>Preview, the night&rsquo;s
        totals, then Submit.</figcaption>
      </figure>
      <div>
        <p>Tapping <b>Submit Session</b> joins their clips into one short film &mdash; a title card, a
        card per animal, their own footage branded over the top, and a closing card. It takes
        <b>about 45 seconds</b> and is built on the phone itself, not on a server.</p>
        <h3>Tell students</h3>
        <ul>
          <li><b>Keep the screen on and the app in front.</b> If the phone locks, the build pauses and
          waits, so it simply takes longer. Do not reload or close the tab.</li>
        </ul>
        <h3>What is kept</h3>
        <ul>
          <li>Every clip uploads as it is filmed, so <b>nothing depends on the film succeeding</b>.</li>
          <li>Raw clips go after 12 months; the film is kept. Teachers see both in their portal.</li>
        </ul>
      </div>
    </div>
  </section>
  <section>
    <h2><span class="num">11</span>Before you start, and during</h2>
    <div class="cols">
      <div class="card">
        <h3>Before you start</h3>
        <ul>
          <li>The teacher gives every student the <b>class code</b>. Students then pick an animal alias
          &mdash; <b>no real names are ever entered</b>.</li>
          <li>Check phones are charged. A full run uses the camera for roughly ten minutes.</li>
          <li>Ask them to turn <b>auto-lock off</b>, or at least to its longest setting.</li>
          <li>Hand out red torches, and say what they are for.</li>
        </ul>
      </div>
      <div class="card">
        <h3>During</h3>
        <ul>
          <li>Split the group so not everyone is at the same animal. Any order works.</li>
          <li>Send restless groups to the <b>rhino, binturong or sun bear</b> first &mdash; those three
          are untimed.</li>
          <li>The <b>lion and tiger need quiet and stillness</b> for thirty seconds.</li>
          <li>A student who arrives at an animal late has lost nothing. Their place is held.</li>
        </ul>
      </div>
    </div>
  </section>

  <section>
    <h2><span class="num">12</span>Worth knowing</h2>
    <div class="note">
      <ul style="margin:0">
        <li><b>No student ever enters a real name.</b> They are a Quoll or a Bilby all night.</li>
        <li>Filming is <b>opt-out</b>, arranged by the school. A student who is not being filmed
        operates the camera for their group.</li>
        <li>Nothing a student does can delete another student&rsquo;s work.</li>
      </ul>
    </div>
  </section>
 </div>
 <div class="foot">
   <span>Taronga Tracka &mdash; an education program by Taronga Zoo Sydney</span>
   <img src="{WILD}" alt="Taronga \u2014 For the Wild">
   <span class="pg">Page 5 of 6</span>
 </div>
</div>

<!-- ══════════════════════════ PAGE 6 ══════════════════════════ -->
<div class="page">
 <div class="page-body">
  <div class="runhead">
    <span class="l">ZooSnooz &middot; Staff Operations Guide</span>
    <span class="r display">When something goes wrong</span>
  </div>

  <section>
    <h2><span class="num">13</span>If something goes wrong</h2>
    <p>None of these loses a student&rsquo;s work. Say that out loud first &mdash; it is the thing they
    are actually worried about.</p>

    <div class="fix">
      <p class="q">The film has the cards but none of the footage</p>
      <p>The screen will say why. <b>If it mentions opening in Safari, do that</b> &mdash; some
      browsers will not let the app read video back. Every clip is already saved either way, so
      <b>nothing is lost</b>, and the film can be rebuilt afterwards.</p>
    </div>

    <div class="fix">
      <p class="q">The camera will not start</p>
      <p>The browser is blocking it. Reload the page and allow camera access when asked. If it still
      refuses, they can skip the film and keep going &mdash; it costs no marks.</p>
    </div>

    <div class="fix">
      <p class="q">The microphone is unavailable on the lion</p>
      <p>Tap continue and watch quietly instead. It does not block progress or cost marks.</p>
    </div>

    <div class="fix">
      <p class="q">A student has lost their place, or swapped phones</p>
      <p>Their work is saved against their alias. Rejoining with the same class code and the same alias
      restores it. If the app will not let them back in on a different handset, the teacher can release
      the record from the class portal.</p>
    </div>

    <div class="fix">
      <p class="q">There is no reception at the enclosure</p>
      <p>Everything works except uploading, and the clips catch up when signal returns. Keep walking.</p>
    </div>

    <div class="fix">
      <p class="q">The phone is nearly flat</p>
      <p>Finish the animal they are on and <b>Submit Session</b> before the battery goes. The film is
      built on the phone, so it needs enough charge for about a minute of work.</p>
    </div>

    <div class="fix">
      <p class="q">The class code is not recognised</p>
      <p>Codes are six characters and are not case sensitive. Check it against the teacher&rsquo;s own
      screen rather than a handwritten copy &mdash; 0 and O are the usual culprits.</p>
    </div>
  </section>
 </div>
 <div class="foot">
   <span>Questions: cameron.rodgers3@det.nsw.edu.au &nbsp;|&nbsp; tarongatracka.com.au</span>
   <img src="{WILD}" alt="Taronga \u2014 For the Wild">
   <span class="pg">Page 6 of 6</span>
 </div>
</div>

</body>
</html>
'''

OUT.write_text(HTML)
print(f'{OUT}  {len(HTML)/1024:.0f} KB')
