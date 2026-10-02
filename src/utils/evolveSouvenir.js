// evolveSouvenir.js — the NFC souvenir link, and writing it to a tag.
//
// Shared by the student app (EvolveScreen, after the film is kept) and the staff portal
// (EvolveFilmsTab). Both must produce the SAME URL: a tag is a physical object handed to a
// student, and there is no fixing a wrong one after the fact.

// HARD-CODED, deliberately — not window.location.origin. Staff browsing the portal from
// localhost, or a student on a preview build, would otherwise write a dead link onto a real tag.
// If the site ever moves, this line moves with it. Tags already written keep pointing here.
export const EVOLVE_SOUVENIR_HOST = 'https://tarongatracka.com.au';

// ?doc=ev_{classCode}_{studentId}_{token} — about 58 characters, so it fits an NTAG213 (144
// bytes) with room to spare, and it resolves through evolve_docs rather than naming a file, so
// the tag survives the film being re-stitched or re-uploaded.
export const evolveSouvenirLink = (classCode, studentId, token) =>
  (classCode && studentId && token)
    ? `${EVOLVE_SOUVENIR_HOST}/?doc=ev_${classCode}_${studentId}_${token}`
    : null;

// Web NFC is Chrome-for-Android only. iOS has no Web NFC at all — Apple restricts tag writing to
// native apps via Core NFC, which is why NFC Tools exists as an app. Everything that calls this
// must have a fallback path, not just a disabled button.
export const canWriteNfcTag = () => typeof window !== 'undefined' && 'NDEFReader' in window;

/**
 * Write a URL record to whatever tag is presented.
 *
 * Must be called from a user gesture, and only works over HTTPS. `write()` waits indefinitely
 * for a tag, so the caller passes a signal — otherwise a student who wanders off leaves the
 * phone waiting forever with no way back.
 *
 * @returns {Promise<{ok: true} | {ok: false, reason: string, message: string}>} never throws
 */
export async function writeNfcTag(url, signal) {
  if (!canWriteNfcTag()) {
    return { ok: false, reason: 'unsupported', message: 'This phone cannot write tags.' };
  }
  try {
    const ndef = new window.NDEFReader();
    await ndef.write({ records: [{ recordType: 'url', data: url }] }, signal ? { signal } : undefined);
    return { ok: true };
  } catch (e) {
    const name = e?.name || '';
    // These are the ones that actually happen on a phone, each needing different advice.
    if (name === 'AbortError')      return { ok: false, reason: 'cancelled',  message: 'Cancelled.' };
    if (name === 'NotAllowedError') return { ok: false, reason: 'permission', message: 'Permission was refused, or NFC is switched off in your phone settings.' };
    if (name === 'NotSupportedError') return { ok: false, reason: 'unsupported', message: 'This phone cannot write tags.' };
    if (name === 'NotReadableError') return { ok: false, reason: 'unreadable', message: 'Could not read the tag. It may be locked, or held too far from the phone.' };
    if (name === 'NetworkError')    return { ok: false, reason: 'toobig', message: 'The tag moved away before it finished, or it is too small for the link.' };
    console.warn('[evolveSouvenir] NFC write failed:', e);
    return { ok: false, reason: 'failed', message: 'That did not work.' };
  }
}

// ── Shared souvenir plumbing (2026-10-02) ────────────────────────────────────────────────────
// Generalised out of Evolve so every mode produces a keepsake a student actually keeps. The
// goal is a longitudinal Year 7 → Year 12 comparison, which only works if the Year 7 artefact
// is still reachable six years later — so a souvenir link must NEVER name a Storage file
// directly. It resolves through Firestore, so the film underneath can be re-stitched, moved or
// re-uploaded without breaking a link already handed to a student (or printed on a tag).

// 8 lowercase base36 characters (~41 bits). Without a token these URLs are trivially guessable:
// class codes are six characters and aliases come from a short list, so anyone holding one link
// could walk a whole cohort's films. Short enough that the link still fits an NTAG213.
export function makeSouvenirToken() {
  const a = new Uint8Array(6);
  (window.crypto || window.msCrypto).getRandomValues(a);
  return Array.from(a).map(n => n.toString(36).padStart(2, '0')).join('').slice(0, 8);
}

// ?doc={prefix}_{classCode}_{studentId}_{token}
// ⚠️ The student id is taken from the MIDDLE on parse, because safeStudentId only strips
//    \ / # . $ [ ] — underscores survive, so an alias like "Sugar_Glider" breaks a naive split.
export const souvenirLink = (prefix, classCode, studentId, token) =>
  (classCode && studentId && token)
    ? `${EVOLVE_SOUVENIR_HOST}/?doc=${prefix}_${classCode}_${studentId}_${token}`
    : null;

// Wildest Dreams keepsake link. Its films had NO souvenir route at all until 2026-10-02: a
// student who did not download the film on the day was left with nothing, and nothing in the
// staff portal could reach it either.
export const wildestDreamsSouvenirLink = (classCode, studentId, token) =>
  souvenirLink('wd', classCode, studentId, token);
