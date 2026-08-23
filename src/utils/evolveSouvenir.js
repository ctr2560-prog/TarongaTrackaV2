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
