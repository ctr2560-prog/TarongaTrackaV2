import { ref as storageRef, getMetadata } from 'firebase/storage';
import { storage } from '../firebase';

// findMediaPath — discovers which extension a recording was saved under, WITHOUT minting a link.
//
// ⚠️⚠️ WHY THIS EXISTS, AND WHY IT IS NOT `getDownloadURL`.
//
// Three staff screens needed to answer "does this student's film exist, and is it .webm or .mp4?"
// (Chrome records webm, Safari/iOS records mp4). They answered it by calling `getDownloadURL` in a
// try/catch and treating a throw as "not this extension".
//
// 🚫 That is the one call we must not make. **`getDownloadURL()` does not merely RETURN a
//    permanent link — it CREATES one**, by writing a download token onto the object. So using it
//    as an existence probe minted a fresh, never-expiring, public link to a child's video *every
//    time a staff member opened a panel*. `revokeDownloadTokens` cleared the historical ones on
//    2026-10-03; these screens were quietly manufacturing new ones afterwards.
//
// `getMetadata` answers the same question — it throws `storage/object-not-found` for a missing
// object — and writes nothing. It needs the same read permission, so nothing about the rules
// changes.
//
// ⚠️ This returns a storage PATH, not a URL. That is deliberate: a path is inert, and every reader
//    in the app already mints one on demand (`needsMinting` in utils/useSignedMedia.js treats a
//    slash-bearing value with no scheme as a path). Pass the result to `mintMediaUrl`,
//    `<SignedVideo>`, `<SignedImage>` or `<SignedLink>` — never to a bare `src` or the clipboard.
//
// Returns null when no extension matched, which callers must treat as "no file yet".
export async function findMediaPath(base, name, exts = ['webm', 'mp4']) {
  for (const ext of exts) {
    const path = `${base}/${name}.${ext}`;
    try {
      await getMetadata(storageRef(storage, path));
      return path;
    } catch { /* not this extension — try the next */ }
  }
  return null;
}
