// film.js — Wildest Dreams' recording + canvas-stitching pipeline.
//
// A DELIBERATE COPY of utils/evolveFilm.js, which is itself a copy of the ZooSnooz pipeline.
// The codebase keeps one copy per mode on purpose: ZooSnooz and Evolve are live, their media
// paths were hard-won, and a shared abstraction would let a change here break them. If you fix a
// codec or timing bug in this file, check whether the other two need the same fix — they do not
// inherit from each other.
//
// Preserve these — each one cost real debugging:
//   * MIME candidates are tried in order; Safari only has mp4/h264.
//   * mr.start(500) then an 80ms settle before the first frame, or the opening frames drop.
//   * Static cards must be redrawn every rAF — captureStream emits nothing from a still canvas.
//   * The draw loop is rAF while visible and a timer while hidden, with a 400ms watchdog. rAF
//     stops dead in a background tab, which produced films with audio and no picture.
//   * crossOrigin='anonymous' is set BEFORE src, or drawing a remote clip taints the canvas and
//     captureStream silently stops producing picture. Needs the bucket CORS policy (cors.json).
//   * Each clip's guard timer is re-armed to the real duration once playback starts.
//   * The <video> element is released after every clip or the decoder pool runs out.
//
// What differs from Evolve: the cards. Wildest Dreams has no chapters and no narrative order —
// it has stops the student chose to film, each with a caption in their own words.

import { WD_FILM_TITLE } from './content';
import { labelRecording } from '../../utils/containerSniff';

const MIME_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
  'video/mp4;codecs=h264,aac',
  'video/mp4;codecs=h264',
  'video/mp4',
];

// Picks a mimeType to CONSTRUCT a MediaRecorder with. That is the only question
// `isTypeSupported` can answer, and it is the only thing this returns.
//
// ⚠️⚠️ IT DELIBERATELY NO LONGER RETURNS A LABEL. It used to also hand back `blobType`,
//    `fileExt` and `contentType`, which made it look like a safe way to label a finished
//    recording. It never was: on iOS `isTypeSupported` says false to EVERY candidate, so
//    `mimeType` comes back empty, the old `|| 'video/webm'` defaults fired, and MediaRecorder
//    given no mimeType records **mp4**. mp4 bytes stored and served as `video/webm` upload
//    fine, download fine, fetch 200, and no browser will decode them — so every clip plays
//    zero frames and the film is a stack of cards. See utils/containerSniff.js.
// 🚫 Never label a recording from a default, and never from a capability probe. If a Blob is
//    in scope, `labelRecording(blob, claimed)` is the answer; a probe is not.
export function pickMimeType(candidates = MIME_CANDIDATES) {
  const mimeType = candidates.find(t => {
    try { return MediaRecorder.isTypeSupported(t); } catch { return false; }
  }) || '';
  return { mimeType };
}

// ⚠️⚠️ THIS MODE HAS NO RECORDER OF ITS OWN, AND THAT IS NOT AN OVERSIGHT.
//
// `startChapterRecording` used to be duplicated here, and it was DEAD CODE: nothing ever
// imported it. `components/Recorder.jsx` imports the real one from `utils/evolveFilm.js`, so
// every Wildest Dreams clip has always been recorded and labelled by Evolve's copy.
//
// 🚫 Do not re-add a copy here. It cost a round of work on 2026-11-12: CLAUDE.md recorded that
//    "Wildest Dreams keeps its OWN copy of the recorder", the iOS label trap was duly fixed in
//    the copy here, and that fix reached no student because the copy was never live. The one
//    place to fix a clip-recording fault for BOTH Evolve and Wildest Dreams is
//    `startChapterRecording` in `utils/evolveFilm.js`.
//
// What this file does own is the STITCHER below, which is genuinely its own: Wildest Dreams has
// no chapters and no narrative order, just stops the student chose, each with their own caption.

const wait = ms => new Promise(res => setTimeout(res, ms));

/**
 * Stitches the student's clips into one portrait film with a title card, a caption card per stop,
 * and a closing card.
 *
 * @param {object[]} stops     WD_STOPS entries that have a clip, in the order the student filmed.
 * @param {object}   clipURLs  { [stopId]: objectURL }
 * @param {string}   studentName
 * @param {object}   captions  { [stopId]: string } — the student's chosen focus / soundboard words
 * @param {function} onProgress (pct, stopIndex)
 * @param {function} isCancelled  () => boolean, checked throughout so unmount aborts cleanly
 * @returns {Promise<{blob, url, played, total, issues}|{error: string}>}
 *
 * ⚠️⚠️ IT NEVER RESOLVES TO A BARE null ANY MORE. Every failure carries a sentence the student
 *    can be shown, because this screen used to end on one generic line for every cause and a
 *    student with a real problem had nothing to act on. The caller must test `result.blob`,
 *    not `result`, and must treat `played === 0` as a failure — see the note on `played`.
 */
export async function buildWildestDreamsFilm({ stops, clipURLs, studentName, captions = {}, onProgress, isCancelled }) {
  const cancelled = () => (isCancelled ? isCancelled() : false);
  const clips = stops.filter(c => clipURLs[c.id]);
  if (!clips.length) return { error: 'None of your animals have a clip saved against them yet.' };

  // Feature-check up front rather than letting a bare call throw into an unhandled rejection,
  // which left the building screen spinning forever with no message.
  if (typeof MediaRecorder === 'undefined') {
    return { error: 'This device cannot record video, so it cannot make the film.' };
  }
  if (typeof HTMLCanvasElement === 'undefined' || !HTMLCanvasElement.prototype.captureStream) {
    return { error: 'This device cannot record from a canvas, which is how the film is put together. Try making the film on a laptop.' };
  }

  // Hold the screen awake for the duration. The stitch captures in real time, so if the
  // phone sleeps or the tab is backgrounded the draw loops get throttled to ~1fps and that
  // chapter's footage comes out frozen — audio is unaffected, which makes it look like the
  // video "didn't play". Wake Lock is unsupported on some browsers; it is a best-effort
  // guard, not a guarantee, so the low-framerate warning below still matters.
  let wakeLock = null;
  try { wakeLock = await navigator.wakeLock?.request('screen'); } catch { /* unsupported or denied */ }
  const releaseWakeLock = () => { try { wakeLock?.release(); } catch { /* already gone */ } wakeLock = null; };

  // ⚠️⚠️ WHY THIS MODE COUNTS WHAT IT CAPTURED. A film containing every card and none of the
  //    footage still plays, still has a title and a name on it, and still looks finished. That
  //    is how the same failure went unexplained for two days in ZooSnooz: the student sees a
  //    film, the screen says nothing is wrong, and the evidence is gone.
  // 🚫 A blob is NOT success. `played` is how many stops actually contributed picture, and
  //    every swallowed failure appends a sentence to `issues` instead of vanishing.
  const issues = [];
  let played = 0;
  const hostOf = (u) => { try { return new URL(u).host; } catch { return u?.slice(0, 12) || 'unknown'; } };

  const W = 720, H = 1280;
  const cvs = document.createElement('canvas');
  cvs.width = W; cvs.height = H;
  const ctx = cvs.getContext('2d');
  ctx.fillStyle = '#0E2A1C'; ctx.fillRect(0, 0, W, H);
  // ⚠️ Wrapped. This was a bare call outside every try, so anything it threw became an
  //    unhandled rejection and the building screen span indefinitely with no message —
  //    indistinguishable from a slow stitch. 🚫 Never leave the building screen with no exit.
  let canvasStream;
  try {
    canvasStream = cvs.captureStream(30);
  } catch (e) {
    releaseWakeLock();
    return { error: `This device refused to record from a canvas (${e?.name || 'error'}). Try making the film on a laptop.` };
  }

  const logoImg = await new Promise(res => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = 'images/logo.png';
  });

  try {
    const hf = new FontFace('Taronga Headline', 'url(images/TarongaHeadline-Regular.ttf)');
    await hf.load();
    document.fonts.add(hf);
  } catch { /* fall back to sans-serif */ }
  await document.fonts.load('400 28px "DM Sans"').catch(() => {});

  function drawBg() {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0A2F1F'); bg.addColorStop(0.45, '#1A5238'); bg.addColorStop(0.8, '#2E7D55'); bg.addColorStop(1, '#4A7C61');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  }
  function drawLogoCircle(cx, cy, size) {
    if (!logoImg) return;
    const r = size / 2;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(logoImg, cx - r, cy - r, size, size);
    ctx.restore();
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(232,179,60,0.85)'; ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();
  }

  // ── Audio: decode every clip up front, keep the destination alive with a silent loop ──
  let audioCtx = null, audioDest = null;
  const audioBuffers = {};
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    await audioCtx.resume().catch(() => {});
  } catch { audioCtx = null; }
  if (audioCtx && audioCtx.state === 'running') {
    try {
      audioDest = audioCtx.createMediaStreamDestination();
      const silBuf = audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
      const silNode = audioCtx.createBufferSource();
      silNode.buffer = silBuf; silNode.loop = true;
      silNode.connect(audioDest); silNode.start();
      await Promise.all(clips.map(async c => {
        try {
          const resp = await fetch(clipURLs[c.id]);
          const ab = await resp.arrayBuffer();
          audioBuffers[c.id] = await audioCtx.decodeAudioData(ab);
        } catch (e) {
          // ⚠️ BE FORGIVING AND LOUD. This was an empty catch commented "clip keeps its vision,
          //    loses its sound". The picture and the sound fail for the SAME reasons (a 403, an
          //    expired URL, a CORS miss, an undecodable container), so one cause trips both and
          //    both used to be silent — a whole film of cards with a clean console.
          issues.push(`${c.id}: no sound (${e?.name || 'decode failed'})`);
          console.warn(`[wildestDreamsFilm] "${c.id}" audio did not decode:`, e?.name || e);
        }
      }));
    } catch { audioDest = null; }
  }

  const recordStream = audioDest
    ? new MediaStream([...canvasStream.getVideoTracks(), ...audioDest.stream.getAudioTracks()])
    : canvasStream;

  const { mimeType } = pickMimeType(['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4']);
  const chunks = [];
  let mr;
  try {
    const opts = { videoBitsPerSecond: 2_500_000 };
    if (mimeType) opts.mimeType = mimeType;
    mr = new MediaRecorder(recordStream, opts);
  } catch (e) {
    releaseWakeLock();
    return { error: `This browser would not start the recorder (${e?.name || 'error'}).` };
  }

  const finished = new Promise(resolve => {
    // ⚠️ async for the 12-byte container read. The finished film carries the same trap as a
    //    clip, and it is worse here: the film is the thing the student keeps.
    mr.onstop = async () => {
      const claimed = chunks[0]?.type || mr?.mimeType || '';
      const probe = new Blob(chunks, { type: claimed || 'video/webm' });
      if (probe.size <= 1000) {
        resolve({ error: `The recorder produced almost nothing (${probe.size} bytes from ${chunks.length} chunks).` });
        return;
      }
      const { contentType, source } = await labelRecording(probe, claimed);
      if (source === 'default') {
        console.warn('[wildestDreamsFilm] film container could not be identified; see containerSniff');
      }
      const blob = new Blob(chunks, { type: contentType });
      if (issues.length) console.warn('[wildestDreamsFilm] finished with issues:', issues);
      resolve({ blob, url: URL.createObjectURL(blob), played, total: clips.length, issues });
    };
  });
  mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
  mr.start(500);
  await wait(80);

  // ── Pause the whole stitch while the tab is hidden ──────────────────────────────────────
  // The film is captured in REAL TIME, so whatever the tab is doing for those ~45 seconds is
  // baked in permanently. Chrome clamps a hidden tab's timers to 1/second and pauses its
  // media, so switching away recorded the remaining stops at ~1fps.
  //
  // The Wake Lock above only stops the SCREEN sleeping; it does nothing about switching tabs.
  // So instead of trying to keep drawing, stop the clock: pause the recorder, the clip and the
  // audio graph, and resume them together. The film then WAITS rather than degrading. It takes
  // longer in wall-clock time and loses nothing. Ported from Evolve/ZooSnooz 2026-11-12 —
  // ⚠️ this mode had the draw-loop half (the hidden-tab timer and the watchdog below) but none
  // of the pause-and-resume half, so a locked phone still baked a frozen stop into the film.
  const active = { video: null };
  let hiddenSince = 0, hiddenTotal = 0;

  // A monotonic "visible milliseconds" clock. Everything timed by the stitch uses this, so a
  // card still gets its full on-screen duration and the low-fps warning does not cry wolf
  // about seconds when nothing was being recorded anyway.
  const activeMs = () =>
    performance.now() - hiddenTotal - (hiddenSince ? performance.now() - hiddenSince : 0);

  function pauseForHidden() {
    if (hiddenSince) return;
    hiddenSince = performance.now();
    try { if (mr.state === 'recording') mr.pause(); } catch { /* not supported — degrades to old behaviour */ }
    try { active.video?.pause(); } catch { /* nothing playing */ }
    Promise.resolve(audioCtx?.suspend()).catch(() => { /* no audio graph */ });
  }
  // ⚠️⚠️ `play()` RETURNS A PROMISE AND try/catch DOES NOT CATCH IT. A rejection escapes as an
  //    unhandled rejection and the video stays PAUSED, while `drawFrame` opens with
  //    `if (videoEl.paused) return;` — so from that point the stop contributes no frames while
  //    still counting as "started". iOS rejects play() with NotAllowedError routinely once a
  //    page has been backgrounded, so a phone locking mid-stitch triggers it every time.
  // 🚫 Never call play(), resume() or suspend() without handling the promise.
  let resumeFailed = false;
  const tryPlay = (el) => {
    const pr = el?.play();
    if (pr && typeof pr.catch === 'function') {
      pr.then(() => { resumeFailed = false; }).catch(err => {
        resumeFailed = true;
        console.warn('[wildestDreamsFilm] playback would not resume:', err?.name || err);
      });
    }
  };
  function resumeFromHidden() {
    if (!hiddenSince) return;
    hiddenTotal += performance.now() - hiddenSince;
    hiddenSince = 0;
    Promise.resolve(audioCtx?.resume()).catch(() => { /* no audio graph */ });
    try { tryPlay(active.video); } catch { /* nothing to resume */ }
    try { if (mr.state === 'paused') mr.resume(); } catch { /* not supported */ }
  }
  const onVisibility = () => (document.hidden ? pauseForHidden() : resumeFromHidden());
  document.addEventListener('visibilitychange', onVisibility);
  if (document.hidden) pauseForHidden();          // started hidden

  // Resolves after `ms` of VISIBLE time. Hidden time does not count, because the recorder is
  // paused then and nothing is being captured.
  const waitActive = ms => new Promise(resolve => {
    const target = activeMs() + ms;
    const h = setInterval(() => {
      if (activeMs() >= target) { clearInterval(h); resolve(); }
    }, 50);
  });

  // Both draw loops are TIMER driven, not requestAnimationFrame.
  //
  // rAF stops dead the moment the tab is backgrounded or the phone screen locks. That
  // produced films with perfect audio and no footage at all: the cards survived (they draw
  // once synchronously and the canvas holds the image) but video needs continuous redraws,
  // so captureStream got nothing. Timers keep firing when backgrounded — throttled to about
  // 1fps rather than stopping — so the film degrades instead of silently losing its picture.
  // We already cap at ~30fps, so nothing is lost while the screen is on.
  const FRAME_MS = 33;

  // A still canvas emits no frames, so static cards are redrawn for their whole duration.
  const drawCardFor = (drawFn, ms) => new Promise(resolve => {
    if (cancelled()) { resolve(); return; }
    let settled = false;
    drawFn();
    const h = setInterval(() => { if (!cancelled() && !settled) drawFn(); }, FRAME_MS);
    // ⚠️ VISIBLE time, not wall-clock. A card timed with setTimeout burns its whole duration
    //    while the tab is hidden and the recorder is paused, so it would land in the film as a
    //    flash or not at all.
    waitActive(ms).then(() => { if (settled) return; settled = true; clearInterval(h); resolve(); });
  });

  const TOTAL = clips.length + 2;
  const dateStr = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();

  // ── Title card ──
  onProgress?.(0, -1);
  if (!cancelled()) {
    const logoY = H * 0.30;
    await drawCardFor(() => {
      drawBg();
      const glow = ctx.createRadialGradient(W / 2, logoY, 0, W / 2, logoY, 340);
      glow.addColorStop(0, 'rgba(255,217,138,0.28)'); glow.addColorStop(1, 'rgba(255,217,138,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
      drawLogoCircle(W / 2, logoY, 260);
      ctx.textAlign = 'center';
      // "My Wildest Dreams" is two words too long for one line at this size, so it is set as
      // two lines rather than shrunk to fit — the title is the point of the card.
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 62px "Taronga Headline", sans-serif';
      ctx.fillText('MY WILDEST', W / 2, H * 0.55);
      ctx.fillText('DREAMS', W / 2, H * 0.55 + 68);
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(W / 2 - 190, H * 0.55 + 108); ctx.lineTo(W / 2 + 190, H * 0.55 + 108); ctx.stroke(); ctx.restore();
      let nm = studentName || 'A Student';
      ctx.font = 'bold 52px "Taronga Headline", sans-serif';
      while (ctx.measureText(nm).width > W - 90 && nm.length > 1) nm = nm.slice(0, -1);
      ctx.fillStyle = '#FFD98A';
      ctx.fillText(nm, W / 2, H * 0.55 + 172);
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '400 24px "DM Sans", sans-serif';
      ctx.fillText('Taronga Zoo Sydney', W / 2, H * 0.55 + 218);
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '400 20px "DM Sans", sans-serif';
      ctx.fillText(dateStr, W / 2, H * 0.88);
      ctx.textAlign = 'left';
    }, 3000);
  }

  // ── Chapters ──
  for (let i = 0; i < clips.length; i++) {
    if (cancelled()) break;
    const c = clips[i];
    onProgress?.(Math.round(((i + 1) / TOTAL) * 100), i);

    const bandY = H / 2 - 190, bandH = 380;
    // The caption is the student's chosen focus ("What I like") or a soundboard word they
    // tapped. It is their voice on the film, so it gets the large type; the animal name is
    // secondary. Shrink-to-fit rather than wrap, because a caption is always short.
    const capText = captions[c.id] || '';
    let titleSize = 60;
    ctx.font = `bold ${titleSize}px "Taronga Headline", sans-serif`;
    while (capText && ctx.measureText(capText).width > W - 80 && titleSize > 28) {
      titleSize -= 4; ctx.font = `bold ${titleSize}px "Taronga Headline", sans-serif`;
    }
    const finalTitleSize = titleSize;
    await drawCardFor(() => {
      drawBg();
      ctx.fillStyle = 'rgba(6,26,16,0.42)'; ctx.fillRect(0, bandY, W, bandH);
      ctx.save(); ctx.strokeStyle = 'rgba(255,217,138,0.6)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, bandY); ctx.lineTo(W, bandY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, bandY + bandH); ctx.lineTo(W, bandY + bandH); ctx.stroke(); ctx.restore();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFD98A'; ctx.font = '400 30px "DM Sans", sans-serif';
      ctx.fillText((c.name || '').toUpperCase(), W / 2, H / 2 - 110);
      if (capText) {
        ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${finalTitleSize}px "Taronga Headline", sans-serif`;
        ctx.fillText(capText, W / 2, H / 2 + 20);
      }
      ctx.textAlign = 'left';
    }, 2400);

    if (cancelled()) break;
    const src = clipURLs[c.id];
    if (!src) continue;

    const topH = 80, botH = 180, vidY = topH, vidH = H - topH - botH, botY = topH + vidH;
    const dStr = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

    await new Promise(resolve => {
      const videoEl = document.createElement('video');
      // crossOrigin MUST be set before src. Without it, drawing a remote clip into the canvas
      // taints it and captureStream stops producing picture — the film comes out as cards only.
      // Requires the CORS policy in cors.json to be live on the bucket; see Build & Deploy.
      videoEl.crossOrigin = 'anonymous';
      videoEl.src = src; videoEl.playsInline = true; videoEl.muted = true; videoEl.preload = 'auto';
      // ⚠️⚠️⚠️ THE ELEMENT MUST BE IN THE DOCUMENT, AND MUST BE RENDERED. Created detached and
      //    never attached, which Safari tolerates — it decodes anyway — and which WKWebView
      //    does NOT: there a detached video gets no drawable surface, so playback reports
      //    perfectly healthy while drawImage receives nothing. CHROME ON iOS IS WKWebView.
      //    This exact fault produced two days of empty ZooSnooz documentaries (2026-11-01 → 03);
      //    Evolve was fixed 11-03 and this mode was the last copy still carrying it (11-12).
      //    The tell: every clip reaches `started` and draws 0 frames, all identically, with no
      //    screen lock involved and the clips playing fine on the preview card.
      // 🚫 Never hide it with display:none, visibility:hidden or zero width/height — each stops
      //    the decode on iOS as surely as being detached. It has to be laid out and painted.
      videoEl.setAttribute('playsinline', '');
      videoEl.setAttribute('webkit-playsinline', '');
      videoEl.style.cssText = 'position:fixed;left:0;bottom:0;width:2px;height:2px;opacity:0.01;pointer-events:none;z-index:-1;';
      try { document.body.appendChild(videoEl); } catch { /* can still try detached */ }
      let rafId = null, nextId = null, watchdog = null, abSrc = null, started = false, done = false;
      // ⚠️ First draw failure for this stop, so the reason reaches the console instead of being
      //    discarded. One per stop, not per frame — drawFrame runs 30 times a second.
      let drawError = null;
      let drawn = 0, startedAt = 0, lastDrawAt = 0;
      // ⚠️ See the same block in utils/evolveFilm.js. These separate "it never drew" into
      //    causes needing different fixes, and there is no console on a phone to ask.
      let drawCalls = 0, pausedSkips = 0, endedEarly = false;
      let playRefused = null, playAttempts = 0;
      // Safety net for a clip that never fires `ended`. Counted in VISIBLE time, so being away
      // for two minutes no longer cuts the stop short.
      let guardUntil = activeMs() + 20000;
      const guard = setInterval(() => { if (activeMs() >= guardUntil) finish(); }, 250);

      function finish() {
        if (done) return;
        done = true;
        clearInterval(guard);
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        if (nextId) { clearTimeout(nextId); nextId = null; }
        if (watchdog) { clearInterval(watchdog); watchdog = null; }
        if (abSrc) { try { abSrc.stop(); abSrc.disconnect(); } catch { /* already stopped */ } abSrc = null; }
        // ── Say what happened, every time ──────────────────────────────────────────────
        const __secs = (activeMs() - startedAt) / 1000;
        if (!started) {
          // Never reached `canplay`. Covers a 403, an expired signed URL, a CORS refusal and a
          // container the browser will not decode — all of which look identical from here,
          // which is precisely why the reason has to be carried out rather than guessed at.
          issues.push(`${c.id}: the clip never became playable`);
          console.warn(`[wildestDreamsFilm] "${c.id}" never became playable; src host ${hostOf(src)}`);
        } else if (drawn > 0) {
          played++;
        } else {
          // ⚠️ Started and drew nothing — the most confusing outcome this pipeline can produce,
          //    and the signature of the detached-element bug fixed above.
          const state = `drawCalls=${drawCalls} pausedSkips=${pausedSkips}`
            + ` paused=${videoEl.paused} readyState=${videoEl.readyState}`
            + ` size=${videoEl.videoWidth}x${videoEl.videoHeight}`
            + ` playAttempts=${playAttempts} playRefused=${playRefused || 'no'}`;
          const why = playRefused ? ' — your phone would not let the video play.'
              + ' On an iPhone this is almost always Low Power Mode: turn it off and try again.'
            : drawError ? ` — ${drawError}`
            : resumeFailed ? ' (playback would not restart after the screen went off)'
            : endedEarly ? ' — the clip said it had finished before a single frame was drawn'
            : drawCalls === 0 ? ' — the draw loop never ran'
            : '';
          issues.push(`${c.id}: the clip played but no picture was captured${why} [${state}]`);
          console.warn(`[wildestDreamsFilm] "${c.id}" started but drew 0 frames; resumeFailed=${resumeFailed}; drawError=${drawError || 'none'}`);
        }
        // Fewer than ~5fps means the device throttled us and this stop's footage will
        // look frozen in the finished film.
        if (started && __secs > 0.5 && drawn / __secs < 5) {
          console.warn(`[wildestDreamsFilm] "${c.id}" drew only ${drawn} frames in ${__secs.toFixed(1)}s (~${(drawn / __secs).toFixed(1)}fps) - its footage will look frozen. The screen most likely slept or the tab was backgrounded.`);
        }
        if (active.video === videoEl) active.video = null;
        // Release the element so the decoder pool frees up before the next stop.
        try { videoEl.pause(); videoEl.removeAttribute('src'); videoEl.load(); } catch { /* noop */ }
        // ⚠️ Take it back out, or one accumulates in the body per stop and stays for the session.
        try { videoEl.remove(); } catch { /* never attached */ }
        resolve();
      }
      function startAudio() {
        // ⚠️ Idempotent: the watchdog retries play(), and each success would otherwise start
        //    a second overlapping copy of this stop's audio.
        if (abSrc) return;
        if (audioDest && audioBuffers[c.id]) {
          try {
            abSrc = audioCtx.createBufferSource();
            abSrc.buffer = audioBuffers[c.id];
            abSrc.connect(audioDest);
            abSrc.start();
          } catch { abSrc = null; }
        }
      }
      // rAF is display-synced and gives smooth, evenly-spaced frames; a bare setInterval
      // drifts and bunches up when the draw work overruns, which shows up as choppy footage.
      // But rAF stops dead in a hidden tab, so a watchdog restarts the loop on a timer if no
      // frame has been drawn recently. Smooth when visible, degraded but alive when not.
      function schedule() {
        if (done) return;
        if (document.hidden) nextId = setTimeout(tick, FRAME_MS);
        else rafId = requestAnimationFrame(tick);
      }
      function tick() {
        rafId = null; nextId = null;
        if (done) return;
        drawFrame();
        schedule();
      }
      function drawFrame() {
        drawCalls++;
        if (cancelled() || done || videoEl.ended) {
          if (videoEl.ended && drawn === 0) endedEarly = true;
          finish();
          return;
        }
        if (videoEl.paused) { pausedSkips++; return; }
        // Cap at ~30fps so a 60Hz rAF does not draw every frame twice.
        const nowMs = performance.now();
        if (nowMs - lastDrawAt < 30) return;
        lastDrawAt = nowMs;
        drawBg();
        try {
          // ⚠️⚠️ `|| W` WAS A TRAP. If the element reports 0x0 — no decodable video track, or
          //    metadata not in yet — the fallback made the SOURCE rectangle 720x1020 over a 0x0
          //    image, and drawImage throws IndexSizeError on EVERY frame into the catch below.
          //    A stop with no dimensions cannot be drawn at all; say so once and stop trying.
          if (!videoEl.videoWidth || !videoEl.videoHeight) {
            if (!drawError) {
              drawError = `the video has no picture track (reports ${videoEl.videoWidth}x${videoEl.videoHeight}, readyState ${videoEl.readyState})`;
              console.warn(`[wildestDreamsFilm] "${c.id}" ${drawError}`);
            }
            return;
          }
          const vW = videoEl.videoWidth, vH2 = videoEl.videoHeight;
          const tgtA = W / vidH, srcA = vW / vH2;
          let sx, sy, sw, sh;
          if (srcA > tgtA) { sh = vH2; sw = sh * tgtA; sx = (vW - sw) / 2; sy = 0; }
          else { sw = vW; sh = sw / tgtA; sx = 0; sy = (vH2 - sh) / 2; }
          ctx.drawImage(videoEl, sx, sy, sw, sh, 0, vidY, W, vidH);
          drawn++;
        } catch (e) {
          // 🚫 NEVER DEBUG THIS PIPELINE THROUGH AN EMPTY CATCH. This read
          //    `catch { /* frame not ready */ }` and hid the real exception through three
          //    investigations in ZooSnooz. Record the first one per stop.
          if (!drawError) {
            drawError = `drawImage failed (${e?.name || e})`;
            console.warn(`[wildestDreamsFilm] "${c.id}" ${drawError}`);
          }
        }

        ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, W, topH);
        ctx.fillStyle = 'rgba(246,232,210,0.88)'; ctx.font = '600 22px "DM Sans", sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('Taronga Zoo Sydney', 24, topH / 2 + 8);
        ctx.fillStyle = 'rgba(246,232,210,0.45)'; ctx.font = '400 20px "DM Sans", sans-serif'; ctx.textAlign = 'right';
        ctx.fillText(dStr, W - 24, topH / 2 + 8);

        ctx.fillStyle = 'rgba(8,30,20,0.97)'; ctx.fillRect(0, botY, W, botH);
        ctx.strokeStyle = 'rgba(255,217,138,0.35)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, botY); ctx.lineTo(W, botY); ctx.stroke();
        ctx.textAlign = 'left';
        // Lower third: the animal, then the student's caption as an open caption. Shrunk to fit
        // rather than wrapped — the band is a fixed height and a wrapped line would overflow it.
        ctx.fillStyle = '#FFD98A'; ctx.font = '600 20px "DM Sans", sans-serif';
        ctx.fillText((c.name || '').toUpperCase(), 24, botY + 40);
        const lowerCap = captions[c.id] || '';
        if (lowerCap) {
          let ls = 40;
          ctx.font = `bold ${ls}px "Taronga Headline", sans-serif`;
          while (ctx.measureText(lowerCap).width > W - 140 && ls > 22) {
            ls -= 2; ctx.font = `bold ${ls}px "Taronga Headline", sans-serif`;
          }
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(lowerCap, 24, botY + 90);
        }
        if (logoImg) {
          const lH = 46, lW = logoImg.naturalWidth ? Math.round(logoImg.naturalWidth * (lH / logoImg.naturalHeight)) : lH;
          ctx.save(); ctx.filter = 'brightness(0) invert(1)'; ctx.globalAlpha = 0.75;
          ctx.drawImage(logoImg, W - lW - 24, botY + 34, lW, lH); ctx.restore();
        }
      }

      videoEl.onended = finish;
      videoEl.onerror = finish;
      videoEl.oncanplay = () => {
        if (started || done) return;
        started = true;
        videoEl.oncanplay = null;
        // ⚠️ Register it BEFORE play(), so a visibilitychange arriving during the play()
        //    round trip can still pause the right element.
        active.video = videoEl;
        // ⚠️⚠️⚠️ NOTHING HERE MAY WAIT ON play() RESOLVING. This used to sit inside
        //    `videoEl.play().then(...)` with `.catch(finish)`, so a refused play() meant the
        //    draw loop never started and the watchdog was never created — and this mode's
        //    watchdog did not even retry play(), so a refusal was final.
        //    Found on Evolve on an iPhone, 2026-11-12: a fully loaded, correctly sized clip
        //    that never played a millisecond. iOS refuses video autoplay in LOW POWER MODE.
        const dur = (isFinite(videoEl.duration) && videoEl.duration > 0) ? videoEl.duration : 12;
        guardUntil = activeMs() + (dur + 5) * 1000;
        startedAt = activeMs();
        lastDrawAt = 0;

        const askToPlay = () => {
          playAttempts++;
          try {
            const pr = videoEl.play();
            if (pr && typeof pr.catch === 'function') {
              pr.then(() => { playRefused = null; startAudio(); })
                .catch(err => { playRefused = err?.name || String(err || 'refused'); });
            } else {
              startAudio();
            }
          } catch (e) {
            playRefused = e?.name || String(e || 'refused');
          }
        };
        askToPlay();
        tick();
        watchdog = setInterval(() => {
          if (done) return;
          // SELF-HEAL, now reachable even when the first play() was refused.
          if (!document.hidden && !hiddenSince && videoEl.paused && !videoEl.ended) {
            askToPlay();
          }
          if (performance.now() - lastDrawAt > 400) {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            if (nextId) { clearTimeout(nextId); nextId = null; }
            tick();
          }
        }, 500);
      };
      videoEl.load();
    });

    onProgress?.(Math.round(((i + 2) / TOTAL) * 100), i);
  }

  // ── Credits card ──
  if (!cancelled()) {
    const outroLogoY = H * 0.26;
    await drawCardFor(() => {
      drawBg();
      const glow = ctx.createRadialGradient(W / 2, outroLogoY, 0, W / 2, outroLogoY, 320);
      glow.addColorStop(0, 'rgba(255,217,138,0.26)'); glow.addColorStop(1, 'rgba(255,217,138,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
      drawLogoCircle(W / 2, outroLogoY, 240);
      ctx.textAlign = 'center';
      // The closing card names the student, because the film is a souvenir rather than a
      // submission. "A film by ___" is the whole point of the mode.
      ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = '400 32px "DM Sans", sans-serif';
      ctx.fillText('A film by', W / 2, outroLogoY + 180);
      let onm = studentName || 'A Student';
      ctx.font = 'bold 60px "Taronga Headline", sans-serif';
      while (ctx.measureText(onm).width > W - 90 && onm.length > 1) onm = onm.slice(0, -1);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(onm, W / 2, outroLogoY + 252);
      ctx.save(); ctx.strokeStyle = 'rgba(255,217,138,0.3)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(W / 2 - 190, outroLogoY + 298); ctx.lineTo(W / 2 + 190, outroLogoY + 298); ctx.stroke(); ctx.restore();
      ctx.fillStyle = '#FFD98A'; ctx.font = 'bold 44px "Taronga Headline", sans-serif';
      ctx.fillText(WD_FILM_TITLE, W / 2, H * 0.74);
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '400 24px "DM Sans", sans-serif';
      ctx.fillText('Taronga Zoo Sydney', W / 2, H * 0.74 + 44);
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '400 22px "DM Sans", sans-serif';
      ctx.fillText('#TarongaTracka', W / 2, H * 0.88);
      ctx.textAlign = 'left';
    }, 2600);
  }

  onProgress?.(100, clips.length);
  document.removeEventListener('visibilitychange', onVisibility);
  releaseWakeLock();
  // ⚠️ A paused recorder ignores stop() on some builds, so make sure it is running first —
  //    otherwise a student who finished with the tab hidden never gets an onstop at all.
  try { if (mr.state === 'paused') mr.resume(); } catch { /* not supported */ }
  if (mr.state !== 'inactive') { try { mr.requestData(); mr.stop(); } catch { /* already stopped */ } }
  return finished;
}
