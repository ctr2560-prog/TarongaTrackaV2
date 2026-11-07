// containerSniff — ask the BYTES what a recording is, instead of guessing.
//
// ⚠️⚠️ WHY THIS EXISTS. Every recorder in this app derived its file extension and content type
// from what the browser SAID it could record:
//
//     const actual   = chunks[0]?.type || mr.mimeType || mimeType;
//     const blobType = actual || 'video/webm';          // 🚫 a guessed default
//     const fileExt  = isMP4 ? 'mp4' : 'webm';
//
// On iOS, `MediaRecorder.isTypeSupported` returns false for EVERY candidate, so `mimeType` is
// empty; `chunks[0].type` and `mr.mimeType` can be empty too. All three being empty falls
// through to **webm** — while MediaRecorder, given no mimeType, records **MP4**.
//
// The result is mp4 bytes stored and served as `video/webm`. It uploads fine. It downloads
// fine. It fetches 200. No browser will decode it. Cameron, 2026-11-07, on Chrome for iOS:
// the documentary came out as cards with no footage AND the teacher could not play the
// individual clips either — which is the tell that separates this from a stitcher fault.
//
// 🚫 NEVER LABEL A RECORDING FROM A DEFAULT, and never from a capability probe.
//    `isTypeSupported` answers "what could this browser record?", which is the right question
//    when constructing a MediaRecorder and the wrong one when you are holding a finished blob.
//
// The bytes are unambiguous and cost one 12-byte read:
//   WebM / Matroska  starts with the EBML magic  1A 45 DF A3
//   MP4 / QuickTime  has 'ftyp' at offset 4
//
// ⚠️ Returns null when it cannot tell, so a caller keeps whatever it already believed rather
//    than being handed another guess dressed up as a fact.

export async function sniffContainer(blob) {
  try {
    if (!blob || blob.size < 12) return null;
    const head = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
    if (head[0] === 0x1A && head[1] === 0x45 && head[2] === 0xDF && head[3] === 0xA3) {
      return { ext: 'webm', contentType: 'video/webm' };
    }
    const box = String.fromCharCode(head[4], head[5], head[6], head[7]);
    if (box === 'ftyp') {
      return { ext: 'mp4', contentType: 'video/mp4' };
    }
    return null;
  } catch {
    return null;                                  // never let labelling break a recording
  }
}

// Decide the label for a finished recording: the bytes first, the recorder's own claim second,
// and a default only when both are silent.
// ⚠️ `claimed` should be chunks[0]?.type || mr.mimeType — what the recorder actually produced,
//    never a value from isTypeSupported.
export async function labelRecording(blob, claimed) {
  const sniffed = await sniffContainer(blob);
  if (sniffed) return { ...sniffed, source: 'bytes' };
  const c = String(claimed || '');
  if (c.includes('mp4'))  return { ext: 'mp4',  contentType: 'video/mp4',  source: 'recorder' };
  if (c.includes('webm')) return { ext: 'webm', contentType: 'video/webm', source: 'recorder' };
  // ⚠️ Nothing knew. Say so in the console rather than silently picking one — a wrong label
  //    here is an unplayable keepsake, and it is invisible until someone tries to watch it.
  console.warn('[containerSniff] could not identify the container; defaulting to webm. claimed:', JSON.stringify(c));
  return { ext: 'webm', contentType: 'video/webm', source: 'default' };
}
