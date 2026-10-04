import { useState, useEffect } from 'react';
import { auth } from '../firebase';

// useSignedMedia — swaps a stored permanent media URL for a short-lived signed one.
//
// ⚠️ WHY. A Firebase download URL never expires, so every stored `filmURL` / `photoUrl` is a key
// that works forever for anyone who ever obtains it. `getMediaUrl` re-checks who is asking and
// returns a URL valid for 60 minutes instead.
//
// ⚠️⚠️ THE FALLBACK CHANGED MEANING ON 2026-10-03, WHEN THE TOKENS WERE REVOKED. READ THIS.
//
// This used to return the stored URL while minting and if minting failed, on the reasoning that
// media must never blank out because a function was cold. That was correct **while the stored URL
// still worked**. It does not any more: `revokeDownloadTokens` has been run, and a stored
// permanent URL now returns **401**. Verified against a real object.
//
// So the old fallback no longer degrades gracefully — it guarantees a broken player with no
// message, which is the worst of both worlds. The hook therefore reports `failed` once minting
// has definitively failed, and callers show something honest instead of a dead URL.
//
// ⚠️ The stored URL is still used WHILE minting is in flight, and for anything not on Firebase
//    Storage. Only a confirmed mint failure is treated as fatal.
// 🚫 Do not "restore" the silent fallback. It is now indistinguishable from data loss.
//
// `classCode` is required for teachers: the function scopes a teacher to classes they own, so
// omitting it means a teacher gets refused and silently falls back to the permanent URL.
const MEDIA_FN = 'https://australia-southeast1-tarongatracka.cloudfunctions.net/getMediaUrl';

// ⚠️ A stored media reference is now EITHER a legacy download URL or a bare storage path
//    (`evolve/ABC123/Quokka/film.webm`). Both must be minted; neither can be rendered raw.
//
// 🚫 Do NOT go back to testing for `firebasestorage.googleapis.com` alone. That was the old test,
//    and once uploads store paths it answers false for exactly the values that MOST need minting —
//    so the path would be handed to a <video src> and render as a broken element.
//
// Anything with a scheme that is not a Firebase Storage URL (an http link, a blob: URL mid-session,
// a data: URI) is left completely alone.
export function needsMinting(value) {
  const v = String(value || '');
  if (!v) return false;
  if (/firebasestorage\.googleapis\.com/.test(v)) return true;   // legacy stored URL
  if (/^[a-z][a-z0-9+.-]*:/i.test(v) || v.startsWith('//')) return false;  // blob:, data:, http…
  return v.includes('/');                                          // a storage path
}

// Imperative version, for click handlers that open or download media rather than render it.
// ⚠️ Same fallback contract: returns the stored URL if minting fails, so a staff member clicking
//    "Watch" never gets a dead tab.
// ⚠️ Returns null when a link cannot be minted — NOT the stored URL. Since the tokens were
//    revoked the stored URL is a 401, so handing it back would open a dead tab. Callers must
//    check. (It still returns a non-Storage URL untouched.)
export async function mintMediaUrl(storedUrl, classCode) {
  if (!storedUrl) return storedUrl;
  if (!needsMinting(storedUrl)) return storedUrl;
  try {
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) return storedUrl;
    const res = await fetch(MEDIA_FN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ kind: 'educator', url: storedUrl, classCode }),
    });
    const d = await res.json().catch(() => ({}));
    if (res.ok && d.ok && d.url) return d.url;
    console.warn('[mintMediaUrl] could not mint a link:', res.status, d?.error || '');
    return null;
  } catch (err) {
    console.warn('[mintMediaUrl] could not mint a link:', err);
    return null;
  }
}

// Mints a whole map of a STUDENT's own media in one go, for the stitcher resume paths.
// ⚠️ Returns null on any failure rather than a partial map — the caller keeps the stored URLs,
//    which is today's behaviour. Half-minting would be worse than not minting.
export async function mintStudentMedia(classCode, studentId, urlMap) {
  const entries = Object.entries(urlMap || {}).filter(([, u]) => needsMinting(u));
  if (!entries.length) return null;
  try {
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) return null;
    const out = {};
    await Promise.all(entries.map(async ([k, u]) => {
      const res = await fetch(MEDIA_FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ kind: 'student', classCode, studentId, url: u }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok && d.url) out[k] = d.url;
    }));
    return Object.keys(out).length ? out : null;
  } catch (err) {
    console.warn('[mintStudentMedia] keeping the stored URLs:', err);
    return null;
  }
}

// Returns { url, failed }. `failed` means minting definitively did not work, so `url` - if it is
// a Firebase Storage URL - is now a dead link and must not be rendered as though it were fine.
export function useSignedMedia(storedUrl, classCode) {
  // Keyed by the stored url so a changed prop resets the signed value without setting state
  // inside the effect body.
  const [signed, setSigned] = useState(null);
  const [failed, setFailed] = useState(false);
  const [forUrl, setForUrl] = useState(storedUrl || null);
  if (forUrl !== storedUrl) { setForUrl(storedUrl || null); setSigned(null); setFailed(false); }
  // ⚠️ While minting is in flight, show the stored value only if it is something a browser can
  //    actually load. A bare storage path is not — rendering it would produce a broken element
  //    pointing at a relative path on our own domain.
  const url = signed || (needsMinting(storedUrl) && !/^https?:/i.test(storedUrl || '') ? null : storedUrl) || null;

  useEffect(() => {
    let cancelled = false;
    if (!storedUrl) return;
    // Anything that is already a usable URL (blob:, data:, an external link) needs no minting.
    if (!needsMinting(storedUrl)) return;

    (async () => {
      try {
        const idToken = await auth.currentUser?.getIdToken();
        if (!idToken) { if (!cancelled) setFailed(true); return; }
        const res = await fetch(MEDIA_FN, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ kind: 'educator', url: storedUrl, classCode }),
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && data.ok && data.url) setSigned(data.url);
        else { setFailed(true); console.warn('[useSignedMedia] could not mint a link:', res.status, data?.error || ''); }
      } catch (err) {
        if (!cancelled) setFailed(true);
        console.warn('[useSignedMedia] could not mint a link:', err);
      }
    })();

    return () => { cancelled = true; };
  }, [storedUrl, classCode]);

  return { url, failed: failed && !signed };
}

// For lists, where calling a hook per item is not possible. Same contract: returns a map of
// original URL → signed URL, and anything that fails is simply absent so the caller keeps using
// the original.
export function useSignedMediaMap(storedUrls, classCode) {
  const key = (storedUrls || []).filter(Boolean).join('|');
  const [map, setMap] = useState({});

  useEffect(() => {
    let cancelled = false;
    const list = key ? key.split('|') : [];
    if (!list.length) return;

    (async () => {
      try {
        const idToken = await auth.currentUser?.getIdToken();
        if (!idToken) return;
        const entries = await Promise.all(list.map(async (u) => {
          try {
            const res = await fetch(MEDIA_FN, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
              body: JSON.stringify({ kind: 'educator', url: u, classCode }),
            });
            const d = await res.json().catch(() => ({}));
            return (res.ok && d.ok && d.url) ? [u, d.url] : null;
          } catch { return null; }
        }));
        if (!cancelled) setMap(Object.fromEntries(entries.filter(Boolean)));
      } catch (err) {
        console.warn('[useSignedMediaMap] falling back to stored URLs:', err);
      }
    })();

    return () => { cancelled = true; };
  }, [key, classCode]);

  return map;
}
