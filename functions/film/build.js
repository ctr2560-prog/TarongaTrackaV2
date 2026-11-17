/* build.js — assembles one student's ZooSnooz documentary from the clips in Storage.
 *
 * This is the same film the student's phone makes, built the other way round: the phone
 * captures a canvas in REAL TIME, which is why a screen that dims mid-stitch produces a film
 * of title cards. Here nothing is captured — every frame is composed by ffmpeg as fast as the
 * machine allows — so there is no window in which it can go wrong.
 *
 * ⚠️ Output is MP4/H.264, not the WebM a phone produces. A WebM will not open in QuickTime,
 *    Safari, PowerPoint or iMovie, which is why the trial films had to be converted by hand
 *    before anyone could watch them.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const cards = require('./cards');

const { W, H, ANIMALS, ORDER } = cards;
const CARD_SECONDS  = 3;
const OUTRO_SECONDS = 2;

const run = (args, timeoutMs = 240000) => new Promise((resolve) => {
  execFile(ffmpegPath, args, { timeout: timeoutMs, maxBuffer: 1 << 26 }, (err, stdout, stderr) =>
    resolve({ ok: !err, stderr: stderr || '', err }));
});

// ⚠️ No ffprobe here on purpose — ffmpeg-static ships ffmpeg alone, and adding a second
//    binary to the deployment to read one number is not worth it. Decoding to null and
//    reading the frame counter is what ffmpeg's own stats line is for.
async function frameCount(file) {
  const r = await run(['-i', file, '-map', '0:v:0', '-f', 'null', '-'], 120000);
  const hits = [...r.stderr.matchAll(/frame=\s*(\d+)/g)];
  return hits.length ? Number(hits[hits.length - 1][1]) : 0;
}

const VIDEO = ['-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast', '-pix_fmt', 'yuv420p',
               '-r', '30', '-video_track_timescale', '30000'];
const AUDIO = ['-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2'];

async function stillSegment(png, seconds, out) {
  return run(['-y', '-loop', '1', '-framerate', '30', '-i', png,
              '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
              '-t', String(seconds), '-vf', 'format=yuv420p', ...VIDEO, ...AUDIO, '-shortest', out]);
}

async function clipSegment(clip, overlayPng, zoom, out) {
  // The app's geometry, as one filter chain and with no need to know the source size:
  // contain inside the frame, re-apply the student's zoom about the centre, let the frame
  // clip it, black behind. Then the header and footer go over the top.
  const z = Math.min(Math.max(Number(zoom) || 1, 1), 4);
  const chain =
    `[0:v]scale=${W}:${H}:force_original_aspect_ratio=decrease,` +
    (z !== 1 ? `scale=iw*${z}:ih*${z},` : '') +
    `pad=max(${W}\\,iw):max(${H}\\,ih):(ow-iw)/2:(oh-ih)/2:black,` +
    `crop=${W}:${H},fps=30,setsar=1[base];[base][1:v]overlay=0:0,format=yuv420p[v]`;
  // ⚠️ `0:a:0?` — the ? matters. A clip recorded with the microphone refused still has to
  //    appear in the film, silently, rather than failing the whole build.
  const r = await run(['-y', '-err_detect', 'ignore_err', '-i', clip, '-i', overlayPng,
                       '-filter_complex', chain, '-map', '[v]', '-map', '0:a:0?',
                       ...VIDEO, ...AUDIO, out]);
  if (r.ok) return r;
  // No audio track at all: give it silence so every segment has the same streams and concat
  // does not refuse the lot.
  return run(['-y', '-err_detect', 'ignore_err', '-i', clip, '-i', overlayPng,
              '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
              '-filter_complex', chain, '-map', '[v]', '-map', '2:a', '-shortest',
              ...VIDEO, ...AUDIO, out]);
}

/* Finds a student's clips. Returns [{ id, file, title, obs, zoom }] in the night's order. */
async function collectClips({ bucket, classCode, studentId, legacyId, zz, dir, log }) {
  const found = [];
  for (const id of ORDER) {
    const record = zz[id] || {};
    let got = null;
    for (const folder of [studentId, legacyId]) {
      if (!folder || got) continue;
      for (const ext of ['webm', 'mp4']) {
        const name = `zoosnooz/${classCode}/${folder}/${id}.${ext}`;
        const file = bucket.file(name);
        const [exists] = await file.exists();
        if (!exists) continue;
        const local = path.join(dir, `${id}.${ext}`);
        await file.download({ destination: local });
        got = { id, file: local, remote: name };
        break;
      }
    }
    if (!got) continue;
    const frames = await frameCount(got.file);
    // ⚠️ A clip that decodes to almost nothing is a recording that was cut off, not footage.
    //    One in the trial held 7 frames. Dropping it is better than a quarter-second flash.
    if (frames < 10) { log(`skipped ${id}: only ${frames} frames`); continue; }
    found.push({
      ...got, frames,
      title: record.videoTitle || ANIMALS[id].name,
      obs:   record.conservationMsg || record.observation || record.observationNotes || '',
      zoom:  record.videoZoom || 1,
    });
  }
  return found;
}

/**
 * Builds the film and uploads it. Returns { path, animals, skipped, bytes }.
 * `db` and `bucket` are firebase-admin handles; `log` takes one string.
 */
async function buildFilm({ db, bucket, classCode, studentId, legacyId, log = () => {} }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'zzfilm-'));
  try {
    const snap = await db.collection('classes').doc(classCode)
      .collection('students').doc(studentId).get();
    if (!snap.exists) throw new Error('No student record.');
    const zz = snap.data().zoosnooz || {};

    const clips = await collectClips({ bucket, classCode, studentId, legacyId, zz, dir, log });
    if (!clips.length) throw new Error('No usable clips in Storage for that student.');
    log(`${clips.length} clips: ${clips.map(c => c.id).join(', ')}`);

    const art = await cards.artwork(clips.map(c => c.id));
    const dateStr = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();
    const dStr    = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short',  year: 'numeric' }).toUpperCase();

    const parts = [];
    const png = (name, buf) => { const p = path.join(dir, name); fs.writeFileSync(p, buf); return p; };

    const introSeg = path.join(dir, 'seg00.mp4');
    await stillSegment(png('intro.png', cards.intro(art, dateStr)), CARD_SECONDS, introSeg);
    parts.push(introSeg);

    for (let i = 0; i < clips.length; i++) {
      const c = clips[i];
      const cardSeg = path.join(dir, `seg${i + 1}a.mp4`);
      const clipSeg = path.join(dir, `seg${i + 1}b.mp4`);
      await stillSegment(png(`card${i}.png`, cards.animalCard(art, c, i, clips.length)), CARD_SECONDS, cardSeg);
      const r = await clipSegment(c.file, png(`over${i}.png`, cards.overlay(art, c, dStr)), c.zoom, clipSeg);
      if (!r.ok || !fs.existsSync(clipSeg)) { log(`skipped ${c.id}: would not re-encode`); continue; }
      parts.push(cardSeg, clipSeg);
    }

    const outroSeg = path.join(dir, 'seg99.mp4');
    await stillSegment(png('outro.png', cards.outro(art)), OUTRO_SECONDS, outroSeg);
    parts.push(outroSeg);

    const listFile = path.join(dir, 'list.txt');
    fs.writeFileSync(listFile, parts.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join('\n') + '\n');
    const film = path.join(dir, 'documentary.mp4');
    const cat = await run(['-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy',
                           '-movflags', '+faststart', film]);
    if (!cat.ok || !fs.existsSync(film)) throw new Error('Could not join the film: ' + cat.stderr.split('\n').slice(-3).join(' '));

    const dest = `zoosnooz/${classCode}/${studentId}/documentary.mp4`;
    await bucket.upload(film, { destination: dest, metadata: { contentType: 'video/mp4' } });
    const bytes = fs.statSync(film).size;
    log(`uploaded ${dest} (${Math.round(bytes / 1024)} KB)`);
    return { path: dest, animals: clips.map(c => c.id), bytes };
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* nothing to clean */ }
  }
}

module.exports = { buildFilm };
