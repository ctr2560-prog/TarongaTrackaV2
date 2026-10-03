import { useSignedMedia } from '../utils/useSignedMedia';

// Drop-in replacements for <video src={storedUrl}>, <img src={storedUrl}> and a download link,
// which swap the stored permanent URL for a short-lived signed one.
//
// ⚠️ Deliberately components rather than a hook at each call site: the media in Class Details and
// the staff tabs is rendered inside nested maps and modals where a hook cannot be called.
//
// ⚠️ They render the STORED url while a signed one is being minted, and show a plain message if
// minting definitively fails. They must NOT silently fall back to the stored url: since
// `revokeDownloadTokens` was run on 2026-10-03 a stored Storage url returns 401, so falling back
// renders a broken black player and tells the teacher nothing. See utils/useSignedMedia.js.
//
// `classCode` matters: the server scopes a teacher to classes they own. Omit it and a teacher is
// refused and silently falls back to the permanent URL, which is safe but pointless.

const noteStyle = {
  display: 'block', padding: '0.7rem 0.8rem', borderRadius: 10, fontSize: '0.8rem', lineHeight: 1.45,
  background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', color: '#B91C1C',
};
const UNAVAILABLE = 'This file could not be opened. The video itself is safe; the link to it needs renewing. Try reloading, or sign in again.';

export function SignedVideo({ url, classCode, style, ...props }) {
  const { url: signed, failed } = useSignedMedia(url, classCode);
  if (failed) return <span style={{ ...noteStyle, ...style }}>{UNAVAILABLE}</span>;
  // ⚠️ `key` on the signed url, not the stored one. Swapping a <video> element's src after it has
  //    begun loading is unreliable — React reuses the node and the browser may keep the old
  //    stream. Re-keying forces a fresh element. Same class of trap as the recorder/playback
  //    issue recorded in the Video & media pipeline section.
  return <video key={signed} src={signed || undefined} style={style} {...props} />;
}

export function SignedImage({ url, classCode, style, ...props }) {
  const { url: signed, failed } = useSignedMedia(url, classCode);
  if (failed) return <span style={{ ...noteStyle, ...style }} title={UNAVAILABLE}>Link needs renewing</span>;
  return <img src={signed || undefined} style={style} {...props} />;
}

export function SignedLink({ url, classCode, children, ...props }) {
  const { url: signed, failed } = useSignedMedia(url, classCode);
  if (failed) return <span title={UNAVAILABLE} style={{ color:'#B91C1C', cursor:'help' }}>{children}</span>;
  return <a href={signed || undefined} {...props}>{children}</a>;
}
