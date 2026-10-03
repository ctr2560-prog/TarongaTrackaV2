import { useSignedMedia } from '../utils/useSignedMedia';

// Drop-in replacements for <video src={storedUrl}>, <img src={storedUrl}> and a download link,
// which swap the stored permanent URL for a short-lived signed one.
//
// ⚠️ Deliberately components rather than a hook at each call site: the media in Class Details and
// the staff tabs is rendered inside nested maps and modals where a hook cannot be called.
//
// ⚠️ All three render the STORED url until a signed one arrives, and keep it if minting fails.
// Media must never blank out because a function was cold — see utils/useSignedMedia.js.
//
// `classCode` matters: the server scopes a teacher to classes they own. Omit it and a teacher is
// refused and silently falls back to the permanent URL, which is safe but pointless.

export function SignedVideo({ url, classCode, ...props }) {
  const signed = useSignedMedia(url, classCode);
  // ⚠️ `key` on the signed url, not the stored one. Swapping a <video> element's src after it has
  //    begun loading is unreliable — React reuses the node and the browser may keep the old
  //    stream. Re-keying forces a fresh element. Same class of trap as the recorder/playback
  //    issue recorded in the Video & media pipeline section.
  return <video key={signed} src={signed || undefined} {...props} />;
}

export function SignedImage({ url, classCode, ...props }) {
  const signed = useSignedMedia(url, classCode);
  return <img src={signed || undefined} {...props} />;
}

export function SignedLink({ url, classCode, children, ...props }) {
  const signed = useSignedMedia(url, classCode);
  return <a href={signed || undefined} {...props}>{children}</a>;
}
