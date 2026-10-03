// evolveFilm.js — Evolve's recording + canvas-stitching pipeline.
//
// This is a DELIBERATE COPY of the pipeline in ZooSnoozScreen.jsx, not a shared abstraction.
// ZooSnooz is live and its media path was hard-won; Evolve owns this copy outright so that
// changing Evolve can never regress ZooSnooz. If you fix a codec/timing bug here, check
// whether ZooSnoozScreen.jsx needs the same fix — they will not inherit from each other.
//
// The non-obvious details below are the ones that took the longest to get right. Preserve them:
//   * MIME candidates are tried in order; Safari only has mp4/h264.
//   * mr.start(500) then an 80ms settle before the first frame, or the opening frames drop.
//   * Static cards must be redrawn every rAF — captureStream emits nothing from a still canvas.
//   * Each clip's guard timer is re-armed to the real duration once playback starts.
//   * The <video> element is released after every clip or the browser's decoder pool runs out
//     partway through a five-clip stitch.

import { EVOLVE_CHAPTER_WORDS } from '../data/evolveAnimals';

const MIME_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
  'video/mp4;codecs=h264,aac',
  'video/mp4;codecs=h264',
  'video/mp4',
];

// ⚠️ `describeMime` exists because guessing is what broke iOS. Derive the labels from a REAL
//    mime string — either one the browser confirmed, or the one MediaRecorder reports after it
//    starts — never from a default.
export function describeMime(mimeType) {
  const isMP4 = String(mimeType || '').includes('mp4');
  return {
    mimeType: mimeType || '',
    blobType: mimeType || 'video/webm',
    fileExt: isMP4 ? 'mp4' : 'webm',
    contentType: isMP4 ? 'video/mp4' : 'video/webm',
  };
}

// ⚠️⚠️ THE iOS TRAP. This used to end `fileExt: isMP4 ? 'mp4' : 'webm'` with no supported
// candidate found — so when `isTypeSupported` returned false for EVERYTHING, which is exactly
// what iOS does, it fell through to **webm**. MediaRecorder was then constructed with no
// mimeType, so iOS recorded **mp4**. The result was mp4 bytes stored and served as
// `video/webm`: the file uploads fine, downloads fine, and the browser refuses to decode it.
// Every clip plays zero frames and contributes no audio, so the finished film is BLACK AND
// SILENT — which reads exactly like the CORS failure documented in CLAUDE.md, and is not.
//
// 🚫 NEVER derive the extension or content type from a default. Read what the recorder actually
//    produced — `MediaRecorder.mimeType` after construction is authoritative, and the blob's own
//    `type` is the final word.
export function pickMimeType(candidates = MIME_CANDIDATES) {
  const mimeType = candidates.find(t => {
    try { return MediaRecorder.isTypeSupported(t); } catch { return false; }
  }) || '';
  return describeMime(mimeType);
}

// Records the given live stream. Returns a stop() handle; the blob arrives via onComplete.
export function startChapterRecording(stream, { onComplete, onError }) {
  const { mimeType } = pickMimeType();
  const chunks = [];
  const opts = { videoBitsPerSecond: 2_000_000 };
  if (mimeType) opts.mimeType = mimeType;

  let mr;
  try {
    mr = new MediaRecorder(stream, opts);
  } catch (e) {
    onError?.(e);
    return null;
  }
  mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
  mr.onstop = () => {
    // ⚠️ Ask the RECORDER what it produced, then prefer the chunk's own type. On iOS neither
    //    `isTypeSupported` nor our candidate list knows the answer, and only these do. Labelling
    //    a file by guesswork is what made every iPhone film black and silent.
    const actual = chunks[0]?.type || mr.mimeType || mimeType;
    const { blobType, fileExt, contentType } = describeMime(actual);
    const blob = new Blob(chunks, { type: blobType });
    if (blob.size < 500) { onError?.(new Error('empty-recording')); return; }
    onComplete?.({ blob, url: URL.createObjectURL(blob), fileExt, contentType });
  };
  mr.start();
  return {
    stop: () => { try { if (mr.state !== 'inactive') mr.stop(); } catch { /* already stopped */ } },
    recorder: mr,
  };
}

const wait = ms => new Promise(res => setTimeout(res, ms));

/**
 * Stitches the recorded chapter clips into one portrait film with title, chapter and credit cards.
 *
 * @param {object[]} chapters  EVOLVE_STORY_ORDER entries that have a clip, already story-ordered.
 * @param {object}   clipURLs  { [chapterId]: objectURL }
 * @param {string}   studentName
 * @param {object}   theme     EVOLVE_THEME
 * @param {function} onProgress (pct, chapterIndex)
 * @param {function} isCancelled  () => boolean, checked throughout so unmount aborts cleanly
 * @returns {Promise<{blob, url, played, total, issues}|{error: string}>}
 *   `played` is how many chapters actually contributed PICTURE. ⚠️ It can be 0 with a perfectly
 *   valid film object — cards only — so a caller must check it rather than treating any blob as
 *   success.
 *   ⚠️ ALWAYS resolves to one or the other, never a bare null. A null told the caller only that
 *   something went wrong, and the screen then blamed the student's device for every cause. There
 *   is no console on a phone, so the reason has to travel to the screen or an iPhone fault cannot
 *   be investigated at all. Any new failure path must carry an `error` string.
 */
export async function buildEvolveFilm({ chapters, clipURLs, studentName, theme, onProgress, isCancelled }) {
  const cancelled = () => (isCancelled ? isCancelled() : false);
  const clips = chapters.filter(c => clipURLs[c.id]);
  if (!clips.length) return { error: 'None of your chapters have a clip saved against them yet.' };

  // Hold the screen awake for the duration. The stitch captures in real time, so if the
  // phone sleeps or the tab is backgrounded the draw loops get throttled to ~1fps and that
  // chapter's footage comes out frozen — audio is unaffected, which makes it look like the
  // video "didn't play". Wake Lock is unsupported on some browsers; it is a best-effort
  // guard, not a guarantee, so the low-framerate warning below still matters.
  let wakeLock = null;
  try { wakeLock = await navigator.wakeLock?.request('screen'); } catch { /* unsupported or denied */ }
  const releaseWakeLock = () => { try { wakeLock?.release(); } catch { /* already gone */ } wakeLock = null; };

  const W = 720, H = 1280;
  const cvs = document.createElement('canvas');
  cvs.width = W; cvs.height = H;
  const ctx = cvs.getContext('2d');
  ctx.fillStyle = theme.deep; ctx.fillRect(0, 0, W, H);
  const canvasStream = cvs.captureStream(30);

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
    bg.addColorStop(0, '#070B18'); bg.addColorStop(0.42, '#1B2138'); bg.addColorStop(0.78, '#3E2E3C'); bg.addColorStop(1, '#6B4232');
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

  // ⚠️ Every per-clip failure in this function is non-fatal by design — one bad clip must never
  //    cost a student the rest of their film. The cost of that is that the film can come out as
  //    CARDS ONLY while reporting success, which is exactly what happened on 2026-10-03. So every
  //    swallowed failure now appends a line here, and the caller is told when nothing played.
  const issues = [];
  const hostOf = u => { try { return new URL(u).host; } catch { return String(u).slice(0, 24); } };
  let played = 0;

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
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const ab = await resp.arrayBuffer();
          audioBuffers[c.id] = await audioCtx.decodeAudioData(ab);
        } catch (e) {
          // ⚠️ This used to be an empty catch. The clip then lost its sound silently, and because
          //    the picture fails for the SAME reasons (a 403, an expired signed URL, a CORS miss,
          //    a mislabelled container) a whole film could come out as cards only with a
          //    completely clean console. Two silent failures masking one cause.
          issues.push(`${c.id}: audio — ${e?.message || e?.name || 'decode failed'}`);
          console.warn(`[evolveFilm] "${c.id}" audio unavailable:`, e, 'from', hostOf(clipURLs[c.id]));
        }
      }));
    } catch { audioDest = null; }
  }

  const recordStream = audioDest
    ? new MediaStream([...canvasStream.getVideoTracks(), ...audioDest.stream.getAudioTracks()])
    : canvasStream;

  const { mimeType, blobType } = pickMimeType(['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4']);
  const chunks = [];
  let mr;
  try {
    const opts = { videoBitsPerSecond: 2_500_000 };
    if (mimeType) opts.mimeType = mimeType;
    mr = new MediaRecorder(recordStream, opts);
  } catch (e) {
    releaseWakeLock();
    // ⚠️ Carry the reason out. This used to return a bare null and the screen then told the
    //    student their DEVICE could not stitch, which is a guess — the recorder refusing to
    //    start is one of several causes and the only one that message actually describes.
    return { error: `This browser would not start the recorder (${e?.name || 'error'}).` };
  }

  const finished = new Promise(resolve => {
    mr.onstop = () => {
      // The finished film carries the same trap: label it from what the recorder actually
      // produced, not from the candidate we hoped for.
      const blob = new Blob(chunks, { type: chunks[0]?.type || mr?.mimeType || blobType });
      if (blob.size <= 1000) {
        resolve({ error: `The recorder produced almost nothing (${blob.size} bytes from ${chunks.length} chunks).` });
        return;
      }
      // ⚠️ A film with every card and no footage is NOT a success, and presenting it as one is how
      //    this went unexplained: the student sees a film, the screen says nothing is wrong, and
      //    the only evidence is gone. Report how many chapters actually contributed picture.
      if (issues.length) console.warn('[evolveFilm] finished with issues:', issues);
      resolve({ blob, url: URL.createObjectURL(blob), played, total: clips.length, issues });
    };
  });
  mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
  mr.start(500);
  await wait(80);

  // ── Pause the whole stitch while the tab is hidden ──────────────────────────────────────
  // The film is captured in REAL TIME, so whatever the tab is doing for those ~45 seconds is
  // baked in permanently. Chrome clamps a hidden tab's timers to 1/second and pauses its
  // media, so switching away used to record the remaining chapters at ~1fps — confirmed in
  // the wild on 2026-09-17 (giraffe 1.0fps, lion 1.1fps, tiger 1.2fps, while the first two
  // chapters, filmed while watching, were fine).
  //
  // The Wake Lock above only stops the SCREEN sleeping; it does nothing about switching tabs.
  // So instead of trying to keep drawing, stop the clock: pause the recorder, the clip and the
  // audio graph, and resume them together. The film then WAITS rather than degrading. It takes
  // longer in wall-clock time and loses nothing.
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
    try { audioCtx?.suspend(); } catch { /* no audio graph */ }
  }
  function resumeFromHidden() {
    if (!hiddenSince) return;
    hiddenTotal += performance.now() - hiddenSince;
    hiddenSince = 0;
    try { audioCtx?.resume(); } catch { /* no audio graph */ }
    try { active.video?.play(); } catch { /* nothing to resume */ }
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
    waitActive(ms).then(() => { if (settled) return; settled = true; clearInterval(h); resolve(); });
  });

  const TOTAL = clips.length + 2;
  const dateStr = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();
  const yearStr = new Date().getFullYear();

  // ── Title card ──
  onProgress?.(0, -1);
  if (!cancelled()) {
    const logoY = H * 0.30;
    await drawCardFor(() => {
      drawBg();
      const glow = ctx.createRadialGradient(W / 2, logoY, 0, W / 2, logoY, 340);
      glow.addColorStop(0, 'rgba(232,179,60,0.30)'); glow.addColorStop(1, 'rgba(232,179,60,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
      drawLogoCircle(W / 2, logoY, 260);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#F6E8D2'; ctx.font = 'bold 84px "Taronga Headline", sans-serif';
      ctx.fillText('EVOLVE', W / 2, H * 0.58);
      ctx.save(); ctx.strokeStyle = 'rgba(232,179,60,0.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(W / 2 - 190, H * 0.58 + 34); ctx.lineTo(W / 2 + 190, H * 0.58 + 34); ctx.stroke(); ctx.restore();
      let nm = studentName || 'A Student';
      ctx.font = 'bold 52px "Taronga Headline", sans-serif';
      while (ctx.measureText(nm).width > W - 90 && nm.length > 1) nm = nm.slice(0, -1);
      ctx.fillStyle = '#E8B33C';
      ctx.fillText(nm, W / 2, H * 0.58 + 100);
      ctx.fillStyle = 'rgba(246,232,210,0.66)'; ctx.font = '400 26px "DM Sans", sans-serif';
      ctx.fillText(`Class of ${yearStr}`, W / 2, H * 0.58 + 150);
      ctx.fillStyle = 'rgba(246,232,210,0.4)'; ctx.font = '400 20px "DM Sans", sans-serif';
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
    let titleSize = 64;
    ctx.font = `bold ${titleSize}px "Taronga Headline", sans-serif`;
    while (ctx.measureText(c.chapter).width > W - 80 && titleSize > 30) {
      titleSize -= 4; ctx.font = `bold ${titleSize}px "Taronga Headline", sans-serif`;
    }
    const finalTitleSize = titleSize;
    await drawCardFor(() => {
      drawBg();
      ctx.fillStyle = 'rgba(30,17,9,0.45)'; ctx.fillRect(0, bandY, W, bandH);
      ctx.save(); ctx.strokeStyle = 'rgba(232,179,60,0.6)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, bandY); ctx.lineTo(W, bandY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, bandY + bandH); ctx.lineTo(W, bandY + bandH); ctx.stroke(); ctx.restore();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#E8B33C'; ctx.font = '400 28px "DM Sans", sans-serif';
      ctx.fillText(`Chapter ${EVOLVE_CHAPTER_WORDS[c.order - 1] || c.order}`, W / 2, H / 2 - 118);
      ctx.fillStyle = '#F6E8D2'; ctx.font = `bold ${finalTitleSize}px "Taronga Headline", sans-serif`;
      ctx.fillText(c.chapter, W / 2, H / 2 + 6);
      ctx.fillStyle = 'rgba(246,232,210,0.6)'; ctx.font = 'italic 26px "DM Sans", sans-serif';
      ctx.fillText(c.animalName, W / 2, H / 2 + 74);
      ctx.textAlign = 'left';
    }, 2600);

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
      let rafId = null, nextId = null, watchdog = null, abSrc = null, started = false, done = false;
      let drawn = 0, startedAt = 0, lastDrawAt = 0;
      // Safety net for a clip that never fires `ended`. Counted in VISIBLE time, so being away
      // for two minutes no longer cuts the chapter short.
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
        // Fewer than ~5fps means the device throttled us and this chapter's footage will
        // look frozen in the finished film. Almost always the screen slept or the tab was
        // backgrounded mid-stitch.
        const __secs = (activeMs() - startedAt) / 1000;
        if (!started) {
          // Never reached `canplay`. Covers a 403, an expired signed URL, a CORS refusal and a
          // container the browser will not decode — all of which look identical from here, which
          // is precisely why the reason has to be carried out rather than guessed at.
          if (!issues.some(i => i.startsWith(`${c.id}:`) && i.includes('video'))) {
            issues.push(`${c.id}: video never became playable`);
            console.warn(`[evolveFilm] "${c.id}" never became playable; src host ${hostOf(src)}`);
          }
        } else if (drawn > 0) {
          played++;
        }
        if (started && __secs > 0.5 && drawn / __secs < 5) {
          console.warn(`[evolveFilm] "${c.id}" drew only ${drawn} frames in ${__secs.toFixed(1)}s (~${(drawn / __secs).toFixed(1)}fps) - its footage will look frozen. The screen most likely slept or the tab was backgrounded.`);
        }
        if (active.video === videoEl) active.video = null;
        // Release the element so the decoder pool frees up before the next chapter.
        try { videoEl.pause(); videoEl.removeAttribute('src'); videoEl.load(); } catch { /* noop */ }
        resolve();
      }
      function startAudio() {
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
        if (cancelled() || done || videoEl.ended) { finish(); return; }
        if (videoEl.paused) return;
        // Cap at ~30fps so a 60Hz rAF does not draw every frame twice.
        const nowMs = performance.now();
        if (nowMs - lastDrawAt < 30) return;
        lastDrawAt = nowMs;
        drawBg();
        try {
          const vW = videoEl.videoWidth || W, vH2 = videoEl.videoHeight || vidH;
          const tgtA = W / vidH, srcA = vW / vH2;
          let sx, sy, sw, sh;
          if (srcA > tgtA) { sh = vH2; sw = sh * tgtA; sx = (vW - sw) / 2; sy = 0; }
          else { sw = vW; sh = sw / tgtA; sx = 0; sy = (vH2 - sh) / 2; }
          ctx.drawImage(videoEl, sx, sy, sw, sh, 0, vidY, W, vidH);
          drawn++;
        } catch { /* frame not ready */ }

        ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, W, topH);
        ctx.fillStyle = 'rgba(246,232,210,0.88)'; ctx.font = '600 22px "DM Sans", sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('Taronga Zoo Sydney', 24, topH / 2 + 8);
        ctx.fillStyle = 'rgba(246,232,210,0.45)'; ctx.font = '400 20px "DM Sans", sans-serif'; ctx.textAlign = 'right';
        ctx.fillText(dStr, W - 24, topH / 2 + 8);

        ctx.fillStyle = 'rgba(20,11,6,0.97)'; ctx.fillRect(0, botY, W, botH);
        ctx.strokeStyle = 'rgba(232,179,60,0.35)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, botY); ctx.lineTo(W, botY); ctx.stroke();
        ctx.textAlign = 'left';
        ctx.fillStyle = '#E8B33C'; ctx.font = '600 20px "DM Sans", sans-serif';
        ctx.fillText(`CHAPTER ${(EVOLVE_CHAPTER_WORDS[c.order - 1] || c.order).toUpperCase()}`, 24, botY + 40);
        ctx.fillStyle = '#F6E8D2'; ctx.font = 'bold 40px "Taronga Headline", sans-serif';
        ctx.fillText(c.chapter, 24, botY + 88);
        ctx.fillStyle = 'rgba(246,232,210,0.5)'; ctx.font = 'italic 20px "DM Sans", sans-serif';
        ctx.fillText(c.animalName, 24, botY + 124);
        if (logoImg) {
          const lH = 46, lW = logoImg.naturalWidth ? Math.round(logoImg.naturalWidth * (lH / logoImg.naturalHeight)) : lH;
          ctx.save(); ctx.filter = 'brightness(0) invert(1)'; ctx.globalAlpha = 0.75;
          ctx.drawImage(logoImg, W - lW - 24, botY + 34, lW, lH); ctx.restore();
        }
      }

      videoEl.onended = finish;
      // ⚠️ A clip that cannot load used to go straight to finish() with no record of it at all.
      //    `started` stays false, so even the low-framerate warning below was skipped — the one
      //    diagnostic this pipeline had. A failed load is the single most likely cause of a
      //    cards-only film, and it was the one thing that produced no evidence whatsoever.
      videoEl.onerror = () => {
        const err = videoEl.error;
        const why = err ? `code ${err.code}${err.message ? ` (${err.message})` : ''}` : 'unknown';
        issues.push(`${c.id}: video would not load — ${why}`);
        console.warn(`[evolveFilm] "${c.id}" video failed to load: ${why}; src host ${hostOf(src)}`);
        finish();
      };
      videoEl.oncanplay = () => {
        if (started || done) return;
        started = true;
        videoEl.oncanplay = null;
        videoEl.play().then(() => {
          active.video = videoEl;
          if (document.hidden) pauseForHidden();   // went away during load
          const dur = (isFinite(videoEl.duration) && videoEl.duration > 0) ? videoEl.duration : 12;
          guardUntil = activeMs() + (dur + 5) * 1000;
          startedAt = activeMs();
          lastDrawAt = 0;
          startAudio();
          tick();
          watchdog = setInterval(() => {
            if (done) return;
            if (performance.now() - lastDrawAt > 400) {
              if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
              if (nextId) { clearTimeout(nextId); nextId = null; }
              tick();
            }
          }, 500);
        }).catch(finish);
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
      glow.addColorStop(0, 'rgba(232,179,60,0.26)'); glow.addColorStop(1, 'rgba(232,179,60,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
      drawLogoCircle(W / 2, outroLogoY, 240);
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(246,232,210,0.75)'; ctx.font = '400 32px "DM Sans", sans-serif';
      ctx.fillText('Wherever you go next,', W / 2, outroLogoY + 180);
      ctx.fillStyle = '#F6E8D2'; ctx.font = 'bold 60px "Taronga Headline", sans-serif';
      ctx.fillText('go forward.', W / 2, outroLogoY + 250);
      ctx.save(); ctx.strokeStyle = 'rgba(232,179,60,0.3)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(W / 2 - 190, outroLogoY + 296); ctx.lineTo(W / 2 + 190, outroLogoY + 296); ctx.stroke(); ctx.restore();
      ctx.fillStyle = '#E8B33C'; ctx.font = 'bold 46px "Taronga Headline", sans-serif';
      ctx.fillText('Evolve', W / 2, H * 0.74);
      ctx.fillStyle = 'rgba(246,232,210,0.55)'; ctx.font = '400 24px "DM Sans", sans-serif';
      ctx.fillText('Taronga Zoo Sydney', W / 2, H * 0.74 + 44);
      ctx.fillStyle = 'rgba(246,232,210,0.4)'; ctx.font = '400 22px "DM Sans", sans-serif';
      ctx.fillText('#Evolve  #TarongaTracka', W / 2, H * 0.88);
      ctx.textAlign = 'left';
    }, 2600);
  }

  onProgress?.(100, clips.length);
  document.removeEventListener('visibilitychange', onVisibility);
  releaseWakeLock();
  // A paused recorder ignores stop() on some builds, so make sure it is running first.
  try { if (mr.state === 'paused') mr.resume(); } catch { /* not supported */ }
  if (mr.state !== 'inactive') { try { mr.requestData(); mr.stop(); } catch { /* already stopped */ } }
  return finished;
}
