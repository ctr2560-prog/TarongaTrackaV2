#!/usr/bin/env python3
"""Builds the standalone ZooSnooz staff operations guide.

    python3 scripts/build-zoosnooz-staff-guide.py

Output is ONE self-contained HTML file at docs/staff-guide/zoosnooz-staff-guide.html.
Every screenshot, both logos and the Taronga display font are embedded as data URIs, so it
can be emailed, opened from a USB stick, or printed on a machine that has never seen this
repo. Nothing it needs is fetched over the network.

⚠️ THREE PAGES, AND THE SPLIT IS THE POINT (Cameron, 2026-11-08): page 1 is what it is,
page 2 is what to do, page 3 is what to do when it breaks. On the night a staff member
holds ONE page, so nothing may spill across a page boundary. 🚫 Do not add a section
without taking one out, and 🚫 do not let a section straddle two pages.

⚠️ It was briefly 8 pages, fully illustrated. That version is in git history (c6dec10) if a
longer reference is ever wanted. What it cost to get here: the screenshots went from
readable figures to a labelled strip, and the per-screen captions went entirely.

⚠️ It is NOT in public/ and is NOT served by the site. Putting it back under public/
publishes it on tarongatracka.com.au, which is the opposite of what was asked for.

⚠️ The screenshots in docs/staff-guide/screenshots/ are REAL frames of the running app,
captured by scripts/capture-zoosnooz-screens.mjs and cropped. They are NOT mockups.
🚫 Do not hand-edit them and do not substitute a mockup: a staff guide showing a screen the
app does not have is worse than no screenshot.

⚠️ EVERY FACT HERE IS READ OUT OF THE CODE, not written from memory: the five animals and
their instruments from data/zoosnoozAnimals.js, which two are timed from INTER_DURATION,
the 20-second observation lock and the 120-point maximum from ZooSnoozScreen.jsx, and the
sign-up and class fields from TeacherLoginScreen.jsx and CreateClassScreen.jsx.

⚠️ No em dashes anywhere in the output (house style). 🚫 Do not reintroduce one, and do not
"fix" the absence by swapping a comma in: recast the clause.

⚠️ THE GEOMETRY IS HAND-FITTED, and at three pages it is tight: a .page-body has exactly
264.8mm to fill. A font size, an image aspect or a margin changed by a millimetre silently
produces a fourth page. Measuring the body in the browser is NOT enough, because a page
that overflows still reports its min-height. After ANY edit: print to PDF and count the
pages (Page.printToPDF over CDP, then count /Type /Page). Section numbers, page numbers and the page count
are derived in _renumber() below, so never hand-number them.
"""
import base64, pathlib, re

REPO  = pathlib.Path(__file__).resolve().parent.parent
SHOTS = REPO / 'docs/staff-guide/screenshots'
OUT   = REPO / 'docs/staff-guide/zoosnooz-staff-guide.html'

def b64(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(pathlib.Path(path).read_bytes()).decode()

FONT = b64(REPO / 'public/images/TarongaHeadline-Regular.ttf', 'font/ttf')
LOGO = b64(REPO / 'public/images/logo.png', 'image/png')
WILD = b64(REPO / 'public/images/taronga-zoo-white.png', 'image/png')

class Shots(dict):
    """Embeds a screenshot the first time the document asks for it.

    ⚠️ docs/staff-guide/screenshots/ holds more frames than the three-page guide uses: the
    8-page version (git c6dec10) showed the map, the answer, the watch dial, the clip card
    and the documentary preview as full figures. They are kept on disk because recapturing
    them means running the whole CDP harness again. Embedding one that nothing references
    would add ~50KB of base64 to every copy of this file for nothing, so they load on use.
    🚫 Do not turn this back into an eager dict.
    """
    def __missing__(self, name):
        self[name] = b64(SHOTS / f'{name}.jpg', 'image/jpeg')
        return self[name]

S = Shots()

def strip(key, n, label, sub, cls=''):
    """One frame of the six-step filmstrip on page 1."""
    return (f'<figure class="fs {cls}"><img src="{S[key]}" alt="{label}">'
            f'<figcaption><span class="fs-n">{n}</span><b>{label}</b></figcaption></figure>')

HTML = f'''<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ZooSnooz Staff Operations Guide | Taronga Tracka</title>
<style>
@font-face {{ font-family:'Taronga Headline'; src:url({FONT}) format('truetype'); font-display:swap; }}
:root {{
  --deep:#0A2F1F; --mid:#1A5238; --euc:#2E7D55;
  --foam:#E8F2EC; --stone:#E4DFD6; --cream:#FBF9F5; --slate:#5F6861;
  --ink:#16201A; --amber:#B45309; --amber-bg:#FDF6E8;
}}
* {{ box-sizing:border-box; }}
html {{ -webkit-text-size-adjust:100%; }}
body {{
  margin:0; background:#5a5f5b; color:var(--ink);
  font-family:'Inter','Helvetica Neue',Helvetica,Arial,sans-serif;
  font-size:9.1pt; line-height:1.42; -webkit-font-smoothing:antialiased;
}}
.display {{ font-family:'Taronga Headline','Inter',sans-serif; font-weight:400; letter-spacing:.01em; }}

.bar {{
  position:sticky; top:0; z-index:50; background:var(--deep); color:#fff;
  padding:.6rem 1.1rem; display:flex; gap:1rem; align-items:center;
  justify-content:space-between; flex-wrap:wrap; font-size:9pt;
}}
.bar span {{ opacity:.82; }}
.bar button {{
  font:inherit; font-weight:700; cursor:pointer; color:var(--deep); background:#fff;
  border:0; border-radius:999px; padding:.4rem 1.1rem;
}}
.bar button:hover {{ background:var(--foam); }}

.page {{
  width:210mm; min-height:297mm; margin:14px auto; background:#fff;
  padding:13mm 13mm 9mm; position:relative;
  box-shadow:0 10px 34px rgba(0,0,0,.34); display:flex; flex-direction:column;
}}
.page-body {{ flex:1 1 auto; }}

/* ── masthead ─────────────────────────────────────────────────── */
.masthead {{
  background:linear-gradient(118deg,var(--deep) 0%,var(--mid) 58%,var(--euc) 100%);
  color:#fff; margin:-13mm -13mm 4.5mm; padding:5mm 13mm 4.5mm; position:relative; overflow:hidden;
}}
.masthead::after {{
  content:''; position:absolute; right:-40mm; top:-42mm; width:92mm; height:92mm;
  border-radius:50%; background:rgba(255,255,255,.055);
}}
.mast-top {{ display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; position:relative; }}
.eyebrow {{ font-size:7pt; letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.72); font-weight:700; }}
.masthead h1 {{ font-size:24pt; margin:.1em 0 0; line-height:1; }}
.masthead .sub {{ font-size:9.6pt; color:rgba(255,255,255,.88); margin:.35em 0 0; max-width:118mm; }}
.mast-logo {{ height:14mm; width:auto; flex:none; }}
.facts {{ display:flex; margin-top:3mm; border-top:1px solid rgba(255,255,255,.2); padding-top:3.2mm; position:relative; }}
.fact {{ flex:1; padding-right:3mm; }}
.fact + .fact {{ border-left:1px solid rgba(255,255,255,.18); padding-left:3mm; }}
.fact dt {{ font-size:6.4pt; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.62); font-weight:700; }}
.fact dd {{ margin:.2em 0 0; font-size:8.8pt; font-weight:600; }}

.runhead {{
  display:flex; justify-content:space-between; align-items:baseline;
  border-bottom:2.5px solid var(--deep); padding-bottom:2.2mm; margin-bottom:5mm;
}}
.runhead .l {{ font-size:7.4pt; letter-spacing:.24em; text-transform:uppercase; font-weight:700; color:var(--euc); }}
.runhead .r {{ font-size:13pt; color:var(--deep); }}

/* ── sections ─────────────────────────────────────────────────── */
section {{ margin-bottom:3.6mm; break-inside:avoid; }}
h2 {{
  font-size:11.6pt; margin:0 0 2.2mm; color:var(--deep);
  display:flex; align-items:center; gap:2.4mm;
  font-family:'Taronga Headline','Inter',sans-serif; font-weight:400;
}}
h2 .num {{
  flex:none; width:6.6mm; height:6.6mm; border-radius:50%; background:var(--deep); color:#fff;
  font-family:'Inter',sans-serif; font-size:7.2pt; font-weight:800;
  display:inline-flex; align-items:center; justify-content:center;
}}
h3 {{ font-size:8.8pt; margin:0 0 1.2mm; color:var(--mid); }}
p {{ margin:0 0 2mm; }}
b, strong {{ color:var(--deep); font-weight:700; }}
.lede {{ font-size:9.8pt; }}
ul {{ margin:0; padding-left:4mm; }}
li {{ margin-bottom:.9mm; }}
li::marker {{ color:var(--euc); }}

/* ── the six-step filmstrip ───────────────────────────────────── */
.strip {{ display:grid; grid-template-columns:repeat(6,1fr); gap:2.6mm; margin-top:2.6mm; }}
figure.fs {{ margin:0; }}
figure.fs img {{
  width:100%; display:block; border-radius:2mm; border:1px solid var(--stone); background:#0A1410;
  aspect-ratio:3/4; object-fit:cover; object-position:50% 0;
}}
/* the camera frame is a whole phone, and its controls are at the bottom */
figure.fs.foot-crop img {{ object-position:50% 100%; }}
figure.fs figcaption {{ font-size:6.9pt; color:var(--slate); line-height:1.3; margin-top:1.4mm; }}
figure.fs figcaption b {{ display:block; font-size:7.6pt; margin:.6mm 0 .4mm; }}
.fs-n {{
  display:inline-block; font-size:6pt; font-weight:800; letter-spacing:.1em;
  color:#fff; background:var(--euc); border-radius:999px; padding:.3mm 1.6mm;
}}

/* ── a small inline screenshot beside text ────────────────────── */
.split {{ display:grid; grid-template-columns:33mm 1fr; gap:5mm; align-items:start; }}
.split img {{ width:100%; display:block; border-radius:2mm; border:1px solid var(--stone); background:#0A1410; }}
.split .cap {{ font-size:6.9pt; color:var(--slate); line-height:1.3; margin-top:1.4mm; }}

/* ── tables ───────────────────────────────────────────────────── */
table {{ width:100%; border-collapse:collapse; font-size:8.2pt; margin-top:1.6mm; }}
th {{
  text-align:left; font-size:6.6pt; letter-spacing:.16em; text-transform:uppercase;
  color:#fff; background:var(--deep); padding:1.6mm 2.2mm; font-weight:700;
}}
td {{ padding:1.5mm 2.2mm; border-bottom:1px solid var(--stone); vertical-align:top; }}
tbody tr:nth-child(even) td {{ background:#FAFBFA; }}
.sci {{ font-style:italic; font-size:7pt; color:var(--slate); white-space:nowrap; }}
.tag {{ display:inline-block; font-size:6.4pt; font-weight:800; letter-spacing:.06em; text-transform:uppercase; border-radius:999px; padding:.4mm 1.7mm; white-space:nowrap; }}
.tag-timed {{ background:#FCECEC; color:#9B1C1C; }}
.tag-free {{ background:var(--foam); color:var(--mid); }}
.num-cell {{ text-align:center; font-weight:800; color:var(--deep); white-space:nowrap; }}

/* ── callouts and columns ─────────────────────────────────────── */
.note {{ background:var(--foam); border-left:3px solid var(--euc); padding:2mm 3.2mm; border-radius:0 2mm 2mm 0; margin:2.4mm 0 0; font-size:8.4pt; }}
.note.warn {{ background:var(--amber-bg); border-left-color:var(--amber); }}
.note.warn b {{ color:var(--amber); }}
.cols {{ display:grid; grid-template-columns:1fr 1fr; gap:4.5mm; }}
.cols-3 {{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:4.5mm; }}
.card {{ background:var(--cream); border:1px solid var(--stone); border-radius:2.4mm; padding:2.3mm 3mm; }}

/* ── numbered steps ───────────────────────────────────────────── */
ol.run {{ counter-reset:run; list-style:none; margin:2.2mm 0 0; padding:0; }}
ol.run li {{ counter-increment:run; position:relative; padding:0 0 0 7.6mm; margin-bottom:1.4mm; min-height:5.6mm; }}
ol.run li::before {{
  content:counter(run); position:absolute; left:0; top:-0.2mm;
  width:5.6mm; height:5.6mm; border-radius:50%; background:var(--euc); color:#fff;
  font-size:7pt; font-weight:800; display:flex; align-items:center; justify-content:center;
}}
ol.run li:last-child {{ margin-bottom:0; }}
ol.run.alt li::before {{ background:var(--deep); }}

/* ── troubleshooting ──────────────────────────────────────────── */
.fixgrid {{ display:grid; grid-template-columns:1fr 1fr; gap:2.4mm 4mm; margin-top:2.2mm; }}
.fix {{ background:var(--cream); border:1px solid var(--stone); border-left:3px solid var(--euc); border-radius:0 2mm 2mm 0; padding:2mm 2.8mm; }}
.fix .q {{ font-weight:800; color:var(--deep); font-size:8.6pt; margin:0 0 1mm; }}
.fix p:last-child {{ margin-bottom:0; }}
.fix.wide {{ grid-column:1 / -1; border-left-color:var(--amber); background:var(--amber-bg); }}
.fix.wide .q {{ color:var(--amber); }}

/* ── footer ───────────────────────────────────────────────────── */
.foot {{
  margin:5mm -13mm -9mm; padding:3.6mm 13mm;
  background:var(--deep); color:rgba(255,255,255,.8); font-size:7.4pt;
  display:flex; justify-content:space-between; align-items:center; gap:1rem;
}}
.foot img {{ height:7mm; opacity:.92; }}
.foot .pg {{ font-weight:700; color:#fff; }}

@page {{ size:A4; margin:0; }}
@media print {{
  body {{ background:#fff; }}
  .bar {{ display:none !important; }}
  .page {{ margin:0; box-shadow:none; break-after:page; width:auto; min-height:auto; height:297mm; }}
  .page:last-child {{ break-after:auto; }}
  * {{ -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }}
}}
@media screen and (max-width:230mm) {{
  .page {{ width:auto; max-width:100%; margin:0; padding:7mm 5mm 5mm; min-height:0; }}
  .masthead {{ margin:-7mm -5mm 6mm; padding:7mm 5mm 6mm; }}
  .masthead h1 {{ font-size:24pt; }}
  .foot {{ margin:6mm -5mm -5mm; padding:4mm 5mm; }}
  .strip {{ grid-template-columns:repeat(2,1fr); }}
  .cols, .cols-3, .split, .fixgrid {{ grid-template-columns:1fr; }}
  .facts {{ flex-wrap:wrap; gap:3mm 0; }}
}}
</style>
</head>
<body>

<div class="bar">
  <span>ZooSnooz staff operations guide, {{PAGE_COUNT}} pages. Print double-sided, or save as a PDF from your browser.</span>
  <button onclick="window.print()">Save as PDF / Print</button>
</div>

<!-- ══════════════════════════ PAGE 1 ══════════════════════════ -->
<div class="page">
 <div class="page-body">
  <div class="masthead">
    <div class="mast-top">
      <div>
        <div class="eyebrow">Staff Operations Guide &middot; 1. What it is</div>
        <h1 class="display">ZooSnooz</h1>
        <p class="sub">The night-time field study, delivered through Taronga Tracka.</p>
      </div>
      <img class="mast-logo" src="{LOGO}" alt="Taronga Tracka">
    </div>
    <dl class="facts">
      <div class="fact"><dt>Programme</dt><dd>Taronga Zoo Sydney sleepover</dd></div>
      <div class="fact"><dt>Animals</dt><dd>Five, in any order</dd></div>
      <div class="fact"><dt>Per animal</dt><dd>15 to 20 minutes</dd></div>
      <div class="fact"><dt>Device</dt><dd>One phone per student or pair</dd></div>
    </dl>
  </div>

  <section>
    <h2><span class="num">01</span>What ZooSnooz is</h2>
    <p class="lede">Students become night researchers. At each of five animals they read a keeper
    insight, use an on-screen instrument to gather their own data, answer a question about what they
    found, write an observation and film a piece to camera. The clips become a documentary they keep.
    The app carries the structure, the timing and the marking, so <b>your job is movement, pacing and
    encouragement</b>, not running the technology.</p>
  </section>

  <section>
    <h2><span class="num">02</span>What a student does, at every animal</h2>
    <div class="strip">
      {strip('s2-insight',   '1', 'Keeper insight', 'One card. What to watch for tonight.')}
      {strip('s3-instrument','2', 'Instrument',     'They gather their own data.')}
      {strip('s4-question',  '3', 'One question',   'About what they just measured.')}
      {strip('s7-write',     '4', 'Observation',    'Watch for 20 seconds, then write.')}
      {strip('s8-film',      '5', 'Film',           'A short piece to camera. Optional.', 'foot-crop')}
      {strip('s10-badge',    '6', 'Badge',          'Points, feedback, back to the map.')}
    </div>
    <div class="note">Any order, and <b>walking away costs nothing</b>: a place is held
    mid-activity. An animal only opens once the student is standing at it; until then its card shows
    how far off they are.</div>
  </section>

  <section>
    <h2><span class="num">03</span>The five animals</h2>
    <table>
      <thead><tr><th style="width:25%">Animal</th><th style="width:16%">Instrument</th><th style="width:12%">Timing</th><th>What the student does</th></tr></thead>
      <tbody>
        <tr><td><b>Sumatran Tiger</b> <span class="sci">Panthera tigris sumatrae</span></td>
            <td>Energy tracker</td><td><span class="tag tag-timed">30 sec</span></td>
            <td>Holds a button while it moves, releases when it is still.</td></tr>
        <tr><td><b>African Lion</b> <span class="sci">Panthera leo</span></td>
            <td>Sound monitor</td><td><span class="tag tag-timed">30 sec</span></td>
            <td>Points the phone at the enclosure. The mic tracks volume.</td></tr>
        <tr><td><b>Greater One-Horned Rhino</b> <span class="sci">Rhinoceros unicornis</span></td>
            <td>Movement pad</td><td><span class="tag tag-free">Untimed</span></td>
            <td>Drags a finger across a pad. Reads the gait: walk, trot or charge.</td></tr>
        <tr><td><b>Binturong</b> <span class="sci">Arctictis binturong</span></td>
            <td>Light scanner</td><td><span class="tag tag-free">Untimed</span></td>
            <td>Points the camera around it. Reads how well dark fur hides it.</td></tr>
        <tr><td><b>Sun Bear</b> <span class="sci">Helarctos malayanus</span></td>
            <td>Field sketch</td><td><span class="tag tag-free">Untimed</span></td>
            <td>Draws and labels the claws, the tongue, the chest patch.</td></tr>
      </tbody>
    </table>
    <div class="note warn"><b>The lion and the tiger are the two on a timer</b>, and both need the
    group settled and quiet for thirty seconds. Send a restless group to the other three first.</div>
  </section>

  <section>
    <h2><span class="num">04</span>How points work</h2>
    <p><b>Each animal is worth up to 120 points.</b> The written observation is marked out of 15
    across <b>behaviour</b> (what the animal is doing), <b>detail</b> (claws, horn, fur, sounds) and
    <b>writing</b>, then scaled to 100. A question answered correctly first time adds 20; a wrong
    answer can be retried, which still teaches but does not score. Marking adjusts to the class
    stage, so a Year 3 answer is held to Year 3 expectations.</p>
  </section>
 </div>
 <div class="foot">
   <span>Taronga Tracka, an education program by Taronga Zoo Sydney</span>
   <img src="{WILD}" alt="Taronga, For the Wild">
   <span class="pg">Page 1 of 3</span>
 </div>
</div>

<!-- ══════════════════════════ PAGE 2 ══════════════════════════ -->
<div class="page">
 <div class="page-body">
  <div class="runhead">
    <span class="l">ZooSnooz &middot; Staff Operations Guide</span>
    <span class="r display">2. Instructions</span>
  </div>

  <section>
    <h2><span class="num">05</span>Setting the class up, beforehand</h2>
    <div class="split">
      <div>
        <img src="{S['s12-signup']}" alt="The Taronga Education sign-up form">
        <div class="cap">tarongatracka.com.au &rsaquo; Teacher Portal &rsaquo; Create one free.</div>
      </div>
      <div class="cols" style="gap:5mm">
        <div>
          <h3>The teacher makes an account</h3>
          <p>Four fields, no invite code and no approval step.</p>
          <ul>
            <li><b>Email address.</b> Their school one is fine.</li>
            <li><b>A password</b>, six characters or more, twice.</li>
            <li><b>Their school</b>, from the list. If it is not there, <b>+ Add</b> takes it as typed.</li>
          </ul>
          <p style="margin-top:1.6mm">The same login opens <b>Wildly by Taronga</b>, and
          <b>Forgot password?</b> emails a reset.</p>
        </div>
        <div>
          <h3>Then the class</h3>
          <p>Teacher Dashboard &rsaquo; <b>Create a New Class</b>.</p>
          <ul>
            <li><b>Location: ZooSnooz.</b> The subject menu disappears, which is correct.</li>
            <li><b>NSW Stage. This is the one that matters</b>, because it sets the reading level of
            every prompt and the bar the writing is marked against.</li>
            <li><b>Class name</b>, then <b>tick the filming consent box.</b> The class will not be
            created without it, and the parent letter is linked beside it.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="note warn"><b>The six-character class code is generated once the class is made</b>,
    and it is the only thing a student needs to join: no account, no email address, no password,
    and no real name.</div>
  </section>

  <section>
    <h2><span class="num">06</span>The running order on the night</h2>
    <ol class="run">
      <li><b>Start at the Institute or the Food Market.</b> Both have wifi. Get every phone onto it
      before anyone walks off, because each clip uploads as it is filmed.</li>
      <li><b>Join the class</b> with the code, and each student picks an animal alias.</li>
      <li><b>Check the phones.</b> Charged, <b>auto-lock off</b> or on its longest setting.</li>
      <li><b>Hand out the red torches, and say what they are for.</b> Red preserves night vision,
      disturbs the animals far less, and is the difference between usable footage and a black
      rectangle. White torches on the glass ruin both.</li>
      <li><b>Split the group.</b> Not everyone at the same animal. Send a restless group to the
      <b>rhino, binturong or sun bear</b> first, because those three are untimed.</li>
      <li><b>Work the five animals, in any order.</b> Fifteen to twenty minutes each. The
      <b>lion and tiger need quiet and stillness</b> for thirty seconds.</li>
      <li><b>Bring everyone back to the Institute or the Food Market.</b> The film is built on the
      phone, but the clips and the finished film still have to upload, and that is where the signal is.</li>
      <li><b>Submit Session, together.</b> About 45 seconds each. <b>Screens stay on and the app
      stays in front</b> while it builds. This is the moment worth standing over.</li>
    </ol>
  </section>

  <section>
    <h2><span class="num">07</span>Tell them they are the presenter</h2>
    <p>The single thing that most improves what comes back. A student asked to &ldquo;record
    something&rdquo; mumbles at the glass. <b>A student told they are presenting a wildlife
    documentary stands up straight and performs.</b> It is their film, with their name on it.</p>
    <div class="cols">
      <div class="card">
        <h3>What to say to them</h3>
        <ul>
          <li><b>&ldquo;Tell us what you can see, right now.&rdquo;</b> Present tense, out loud.</li>
          <li><b>&ldquo;Start with where you are.&rdquo;</b> <i>I&rsquo;m here at the Sumatran
          tigers&hellip;</i> It gives the clip an opening.</li>
          <li><b>&ldquo;One thing, not five.&rdquo;</b> One detail described properly beats a list.</li>
        </ul>
      </div>
      <div class="card">
        <h3>And what to hold them to</h3>
        <ul>
          <li><b>Ten seconds is plenty.</b> The clip stops itself.</li>
          <li><b>Quiet voice.</b> The microphone is nearer than they think.</li>
          <li><b>Not everyone has to be on camera.</b> Whoever would rather not is the camera
          operator.</li>
        </ul>
      </div>
    </div>
  </section>
 </div>
 <div class="foot">
   <span>Taronga Tracka, an education program by Taronga Zoo Sydney</span>
   <img src="{WILD}" alt="Taronga, For the Wild">
   <span class="pg">Page 2 of 3</span>
 </div>
</div>

<!-- ══════════════════════════ PAGE 3 ══════════════════════════ -->
<div class="page">
 <div class="page-body">
  <div class="runhead">
    <span class="l">ZooSnooz &middot; Staff Operations Guide</span>
    <span class="r display">3. If something goes wrong</span>
  </div>

  <section>
    <h2><span class="num">08</span>Start by saying this</h2>
    <p class="lede"><b>None of what follows loses a student&rsquo;s work.</b> Say that out loud
    first, because it is the thing they are actually worried about. Every clip is uploaded the
    moment it is filmed, so the film can always be rebuilt later from clips that are already safe.</p>
  </section>

  <section>
    <h2><span class="num">09</span>The seven that actually happen</h2>
    <div class="fixgrid">
      <div class="fix wide">
        <p class="q">The film has the cards but none of the footage</p>
        <p>The screen will say why. <b>If it mentions opening in Safari, do that.</b> Some browsers
        will not let the app read video back. Every clip is already saved either way, so nothing is
        lost, and the film can be rebuilt afterwards.</p>
      </div>
      <div class="fix">
        <p class="q">The camera will not start</p>
        <p>The browser is blocking it. Reload the page and allow camera access when asked. If it
        still refuses, they can skip the film and keep going. It costs no marks.</p>
      </div>
      <div class="fix">
        <p class="q">The microphone is unavailable on the lion</p>
        <p>Tap continue and watch quietly instead. It does not block progress or cost marks.</p>
      </div>
      <div class="fix">
        <p class="q">A student has lost their place, or swapped phones</p>
        <p>Rejoining with the same class code and alias restores it. If a different handset is
        refused, the teacher can release the record from the class page.</p>
      </div>
      <div class="fix">
        <p class="q">There is no reception at the enclosure</p>
        <p>Everything works except uploading, and the clips catch up when signal returns. Finish
        back at the Institute or the Food Market.</p>
      </div>
      <div class="fix">
        <p class="q">The phone is nearly flat</p>
        <p>Finish the animal they are on and <b>Submit Session</b> before the battery goes. The film
        is built on the phone, so it needs charge for about a minute of work.</p>
      </div>
      <div class="fix">
        <p class="q">The class code is not recognised</p>
        <p>Codes are six characters and are not case sensitive. Check against the teacher&rsquo;s own
        screen rather than a handwritten copy. 0 and O are the usual culprits.</p>
      </div>
    </div>
  </section>

  <section>
    <h2><span class="num">10</span>Afterwards, and worth knowing</h2>
    <div class="cols">
      <div>
        <h3>Nothing is left to collect</h3>
        <ul>
          <li><b>Every clip, film and piece of writing is on the class page</b>, under the
          student&rsquo;s alias, ready to play or download.</li>
          <li><b>The marking is already done</b>, so a teacher reads results rather than marks a set.</li>
          <li><b>Taronga staff can pull any film</b> from the staff portal if a school needs a copy.</li>
          <li>Raw clips go after 12 months. The finished film is kept.</li>
        </ul>
      </div>
      <div>
        <h3>Worth knowing</h3>
        <ul>
          <li><b>No student ever enters a real name.</b> They are a Quoll or a Bilby all night.</li>
          <li>Filming is <b>opt-out</b>, arranged by the school. A student who is not being filmed
          operates the camera for their group.</li>
          <li>Nothing a student does can delete another student&rsquo;s work.</li>
        </ul>
      </div>
    </div>
  </section>
 </div>
 <div class="foot">
   <span>Questions: cameron.rodgers3@det.nsw.edu.au &nbsp;|&nbsp; tarongatracka.com.au</span>
   <img src="{WILD}" alt="Taronga, For the Wild">
   <span class="pg">Page 3 of 3</span>
 </div>
</div>

</body>
</html>
'''

def _renumber(html):
    """Section numbers, page numbers and the page count come from document order.
    ⚠️ They were hand-written once and went out of step the first time a page was inserted."""
    n = [0]
    def sec(m):
        n[0] += 1
        return f'<span class="num">{n[0]:02d}</span>'
    html = re.sub(r'<span class="num">\d+</span>', sec, html)

    total = html.count('<div class="page">')
    pg = [0]
    def page(m):
        pg[0] += 1
        return f'<span class="pg">Page {pg[0]} of {total}</span>'
    html = re.sub(r'<span class="pg">Page \d+ of \d+</span>', page, html)
    return html.replace('{PAGE_COUNT}', str(total))

HTML = _renumber(HTML)
OUT.write_text(HTML)
print(f'{OUT}  {len(HTML)/1024:.0f} KB')
