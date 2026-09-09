// speech.js — read-aloud for Wildest Dreams.
//
// The mode is for students who may not read. Before this existed the ONLY thing that spoke was
// the soundboard, which meant a student could hear "Excited" but could not hear "What I like" —
// backwards, since the choices are where reading actually matters.
//
// Best-effort throughout. `speechSynthesis` is missing or muted on plenty of devices, and nothing
// in the mode may ever depend on a word being heard: every screen still works in silence.
//
// The preference is remembered in localStorage so a student who turns it off does not have to
// turn it off again at the next animal.

const KEY = 'wdReadAloud';

export function readAloudOn() {
  try { return localStorage.getItem(KEY) !== 'off'; } catch { return true; }
}

export function setReadAloud(on) {
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* private mode — session only */ }
  if (!on) cancelSpeech();
}

export function cancelSpeech() {
  try { window.speechSynthesis?.cancel(); } catch { /* nothing to cancel */ }
}

// `force` speaks even when read-aloud is off. The soundboard uses it: tapping a soundboard button
// is an explicit request to hear that word, not incidental narration of the interface.
export function speak(text, { force = false } = {}) {
  if (!text) return;
  if (!force && !readAloudOn()) return;
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();                       // stop the previous phrase before starting
    const u = new SpeechSynthesisUtterance(String(text));
    u.rate = 0.9;                         // a touch slower than default, easier to follow
    synth.speak(u);
  } catch { /* no speech on this device — every screen still reads on its own */ }
}
