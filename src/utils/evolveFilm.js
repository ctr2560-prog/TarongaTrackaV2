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

const MIME_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
  'video/mp4;codecs=h264,aac',
  'video/mp4;codecs=h264',
  'video/mp4',
];

export function pickMimeType(candidates = MIME_CANDIDATES) {
  const mimeType = candidates.find(t => {
    try { return MediaRecorder.isTypeSupported(t); } catch { return false; }
  }) || '';
  const isMP4 = mimeType.includes('mp4');
  return {
    mimeType,
    blobType: mimeType || 'video/webm',
    fileExt: isMP4 ? 'mp4' : 'webm',
    contentType: isMP4 ? 'video/mp4' : 'video/webm',
  };
}

// Records the given live stream. Returns a stop() handle; the blob arrives via onComplete.
export function startChapterRecording(stream, { onComplete, onError }) {
  const { mimeType, blobType, fileExt, contentType } = pickMimeType();
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
 * @returns {Promise<{blob: Blob, url: string}|null>}
 */
export async function buildEvolveFilm({ chapters, clipURLs, studentName, theme, onProgress, isCancelled }) {
  const cancelled = () => (isCancelled ? isCancelled() : false);
  const clips = chapters.filter(c => clipURLs[c.id]);
  if (!clips.length) return null;

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
        } catch { /* clip keeps its vision, loses its sound */ }
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
  } catch {
    releaseWakeLock();
    return null;
  }

  const finished = new Promise(resolve => {
    mr.onstop = () => {
      const blob = new Blob(chunks, { type: blobType });
      resolve(blob.size > 1000 ? { blob, url: URL.createObjectURL(blob) } : null);
    };
  });
  mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
  mr.start(500);
  await wait(80);

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
    setTimeout(() => { if (settled) return; settled = true; clearInterval(h); resolve(); }, ms);
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
      ctx.fillText(`Chapter ${c.order} of ${clips.length}`, W / 2, H / 2 - 118);
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
      videoEl.src = src; videoEl.playsInline = true; videoEl.muted = true; videoEl.preload = 'auto';
      let rafId = null, nextId = null, watchdog = null, abSrc = null, started = false, done = false;
      let drawn = 0, startedAt = 0, lastDrawAt = 0;
      let guard = setTimeout(finish, 20000);

      function finish() {
        if (done) return;
        done = true;
        clearTimeout(guard);
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        if (nextId) { clearTimeout(nextId); nextId = null; }
        if (watchdog) { clearInterval(watchdog); watchdog = null; }
        if (abSrc) { try { abSrc.stop(); abSrc.disconnect(); } catch { /* already stopped */ } abSrc = null; }
        // Fewer than ~5fps means the device throttled us and this chapter's footage will
        // look frozen in the finished film. Almost always the screen slept or the tab was
        // backgrounded mid-stitch.
        const __secs = (performance.now() - startedAt) / 1000;
        if (started && __secs > 0.5 && drawn / __secs < 5) {
          console.warn(`[evolveFilm] "${c.id}" drew only ${drawn} frames in ${__secs.toFixed(1)}s (~${(drawn / __secs).toFixed(1)}fps) - its footage will look frozen. The screen most likely slept or the tab was backgrounded.`);
        }
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
        ctx.fillText(`CHAPTER ${c.order}`, 24, botY + 40);
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
      videoEl.onerror = finish;
      videoEl.oncanplay = () => {
        if (started || done) return;
        started = true;
        videoEl.oncanplay = null;
        videoEl.play().then(() => {
          clearTimeout(guard);
          const dur = (isFinite(videoEl.duration) && videoEl.duration > 0) ? videoEl.duration : 12;
          guard = setTimeout(finish, (dur + 5) * 1000);
          startedAt = performance.now();
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
      ctx.fillText('Wherever you go next —', W / 2, outroLogoY + 180);
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
  releaseWakeLock();
  if (mr.state !== 'inactive') { try { mr.requestData(); mr.stop(); } catch { /* already stopped */ } }
  return finished;
}
