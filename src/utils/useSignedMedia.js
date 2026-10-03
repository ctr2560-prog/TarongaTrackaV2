import { useState, useEffect } from 'react';
import { auth } from '../firebase';

// useSignedMedia — swaps a stored permanent media URL for a short-lived signed one.
//
// ⚠️ WHY. A Firebase download URL never expires, so every stored `filmURL` / `photoUrl` is a key
// that works forever for anyone who ever obtains it. `getMediaUrl` re-checks who is asking and
// returns a URL valid for 60 minutes instead.
//
// ⚠️ IT RETURNS THE ORIGINAL URL WHILE MINTING, AND IF MINTING FAILS. Media must never blank out
// because a function was cold or the network blipped — a teacher staring at an empty photo grid
// would reasonably conclude the app had lost their students' work. The fallback is exactly the
// behaviour that exists today, so this can be rolled out everywhere without risk.
//
// ⚠️ THIS IS NOT THE THING THAT CLOSES THE HOLE ON ITS OWN. Old permanent URLs keep working until
// their `firebaseStorageDownloadTokens` metadata is revoked. That revocation is all-or-nothing
// and must come LAST, after every read path uses this.
//
// `classCode` is required for teachers: the function scopes a teacher to classes they own, so
// omitting it means a teacher gets refused and silently falls back to the permanent URL.
const MEDIA_FN = 'https://australia-southeast1-tarongatracka.cloudfunctions.net/getMediaUrl';

export function useSignedMedia(storedUrl, classCode) {
  // Keyed by the stored url so a changed prop resets the signed value without setting state
  // inside the effect body.
  const [signed, setSigned] = useState(null);
  const [forUrl, setForUrl] = useState(storedUrl || null);
  if (forUrl !== storedUrl) { setForUrl(storedUrl || null); setSigned(null); }
  const url = signed || storedUrl || null;

  useEffect(() => {
    let cancelled = false;
    if (!storedUrl) return;

    (async () => {
      try {
        const idToken = await auth.currentUser?.getIdToken();
        if (!idToken) return;                       // not signed in — keep the stored URL
        const res = await fetch(MEDIA_FN, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ kind: 'educator', url: storedUrl, classCode }),
        });
        const data = await res.json().catch(() => ({}));
        if (!cancelled && res.ok && data.ok && data.url) setSigned(data.url);
      } catch (err) {
        // Deliberately quiet: the stored URL is already rendering, so this is a downgrade in
        // protection, not a failure the user needs to see.
        console.warn('[useSignedMedia] falling back to the stored URL:', err);
      }
    })();

    return () => { cancelled = true; };
  }, [storedUrl, classCode]);

  return url;
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
