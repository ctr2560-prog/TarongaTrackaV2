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
  if (!on) { cancelSpeech(); stopVoiceClip(); }
}

// Real animal audio, not speech synthesis. Always plays when asked: tapping "Hear the Koala" is
// an explicit request, so it ignores the interface read-aloud toggle. One element reused, so a
// second tap restarts rather than layering two lions over each other.
let audio = null;

export function playAnimalSound(src, { onEnd } = {}) {
  if (!src) return;
  try {
    cancelSpeech(); stopVoiceClip();      // do not talk over the animal
    if (!audio) audio = new Audio();
    audio.pause();
    audio.src = src;
    audio.currentTime = 0;
    if (onEnd) audio.onended = onEnd;
    const p = audio.play();
    // Autoplay policy rejects until the page has had a gesture. This is inside a tap, so it
    // normally resolves, but a rejection must never surface as an unhandled rejection.
    if (p?.catch) p.catch(() => onEnd?.());
  } catch { onEnd?.(); }
}

export function stopAnimalSound() {
  try { audio?.pause(); } catch { /* nothing playing */ }
}

function synth() {
  try { return window.speechSynthesis || null; } catch { return null; }
}

export function cancelSpeech() {
  try { synth()?.cancel(); } catch { /* nothing to cancel */ }
}

// ── Why this is more complicated than `synth.speak(new Utterance(text))` ──────────────────────
// That is what it was, and nothing ever spoke. Every fault below fails SILENTLY — no exception,
// no error event, just no sound — which is why this took several passes to pin down:
//
//   1. cancel() IN THE SAME TICK AS speak() WEDGES CHROME. The original spoke every line as
//      `cancel(); speak(u)`, and every screen change ran it. That alone was enough to mean the
//      soundboard never made a sound. Now it cancels only when something is genuinely playing,
//      and speaks a tick later.
//   2. AN UNREFERENCED UTTERANCE CAN BE GARBAGE COLLECTED MID-SENTENCE. `pending` holds it.
//   3. VOICES LOAD ASYNCHRONOUSLY. Speaking before Chrome has them does nothing at all, so the
//      first utterance waits (briefly) for `voiceschanged`.
//   4. THE FIRST UTTERANCE SHOULD FOLLOW A GESTURE. Screens narrate on arrival, so the very first
//      speak() was the Welcome screen on mount with no tap yet, which iOS refuses.
//
// ⚠️ The fix for (4) caused its own outage twice, and the shape of it is the lesson. First it
// queued a silent whitespace utterance to "unlock" the engine — a blank utterance is exactly what
// Chrome can fail to ever finish, so it sat at the head of the queue and everything jammed behind
// it. Then it gated EVERY call on having seen a gesture, so when that single listener did not
// fire, explicit soundboard taps went silent too. One listener must never be able to mute the
// whole feature. The gesture check now applies ONLY to automatic narration (`auto: true`);
// anything triggered by a tap is already a gesture and always attempts.

// A Set rather than a single variable so it is genuinely read, and so overlapping utterances
// are all held. Entries are removed when they finish, so it never grows.
const pending = new Set();
let gestureSeen = false;

export function primeSpeech() {
  gestureSeen = true;
}

// Call once when the mode mounts. Returns a cleanup, so the listener lives exactly as long as
// Wildest Dreams does and no global listener is left behind for the rest of Tracka.
export function armSpeech() {
  const once = () => primeSpeech();
  window.addEventListener('pointerdown', once, { once: true });
  window.addEventListener('keydown', once, { once: true });
  return () => {
    window.removeEventListener('pointerdown', once);
    window.removeEventListener('keydown', once);
  };
}

// Never waits longer than a moment: a device with no voices at all must not leave a student
// sitting in silence waiting for an event that will never arrive.
function whenReady(s, run) {
  let done = false;
  const go = () => { if (done) return; done = true; run(); };
  try {
    if (s.getVoices().length > 0) { go(); return; }   // synchronous — see the note on gestures
    s.addEventListener?.('voiceschanged', go, { once: true });
  } catch { /* older engine — fall through to the timer */ }
  setTimeout(go, 250);
}

// The recorded clips are an Australian voice, so the synthesiser must be one too. Left to itself
// it picks the system default — often a different accent and a different gender — and the mode
// then has TWO speakers: one for the words a student taps, another for the screen around them.
// For students who rely on the voice to know what a button is, that inconsistency is the problem,
// not a polish issue. Falls back through en-AU, then any local English, then whatever exists.
const VOICE_LANG = 'en-AU';
let chosenVoice;                            // undefined = not looked up yet, null = none available

function pickVoice(s) {
  if (chosenVoice !== undefined) return chosenVoice;
  let v = [];
  try { v = s.getVoices() || []; } catch { /* engine not ready */ }
  if (!v.length) return undefined;          // try again on the next utterance
  chosenVoice =
    v.find(x => x.localService && x.lang?.replace('_', '-') === VOICE_LANG) ||
    v.find(x => x.lang?.replace('_', '-') === VOICE_LANG) ||
    v.find(x => x.localService && x.lang?.startsWith('en')) ||
    v.find(x => x.lang?.startsWith('en')) ||
    null;
  return chosenVoice;
}

// ⚠️ Chrome's synthesiser can WEDGE: speak() queues the utterance, `speechSynthesis.speaking`
// reports true, and then nothing happens — no onstart, no onerror, no sound, forever. Confirmed
// on a real machine with plain speechSynthesis and none of this module involved, so it is a
// browser fault rather than an app one, and it will happen on student devices too.
//
// cancel() alone does not reliably clear it; cancel-then-resume-then-speak usually does. So if an
// utterance has not STARTED within 1.2s, try exactly once more. Once only: a retry loop against a
// genuinely dead engine would talk over itself the moment it recovered.
function utter(s, text, isRetry = false) {
  try {
    const u = new SpeechSynthesisUtterance(String(text));
    u.rate = 0.9;                         // a touch slower than default, easier to follow
    const v = pickVoice(s);
    if (v) u.voice = v;
    u.lang = v?.lang || VOICE_LANG;
    let started = false;
    u.onstart = () => { started = true; };
    u.onend   = () => { pending.delete(u); flush(); };
    u.onerror = e => { pending.delete(u); flush(); console.warn('[wildestDreams] speech failed:', e?.error || e); };
    pending.add(u);
    s.resume();                           // Chrome can leave the engine paused after a cancel
    s.speak(u);

    if (!isRetry) {
      setTimeout(() => {
        if (started || !pending.has(u)) return;
        console.warn('[wildestDreams] speech did not start; resetting the synthesiser');
        pending.delete(u);
        try { s.cancel(); s.resume(); } catch { /* nothing to reset */ }
        utter(s, text, true);
      }, 1200);
    }
  } catch (e) { console.warn('[wildestDreams] speech failed:', e); }
}

// ── Recorded voice ─────────────────────────────────────────────────────────────────────────────
// Everything a student TAPS is a fixed, small vocabulary — 8 soundboard words, 6 focus prompts,
// 8 animal names — so it does not need a synthesiser at all. A recorded clip is a plain <audio>
// file: identical on every device, no engine to wedge, no voice to be missing, and a warm human
// voice instead of a robotic one. `speechSynthesis` stays only as the fallback and for the
// dynamic screen narration, which cannot be pre-recorded.
//
// Files live at public/voice/{key}.m4a. A missing file falls through to the synthesiser, so the
// mode works with none, some or all of them present.
let voiceEl = null;
let voiceToken = 0;
let clipPlaying = false;

export function stopVoiceClip() {
  voiceToken++;                             // anything already in flight is now superseded
  clipPlaying = false;
  try { voiceEl?.pause(); } catch { /* nothing playing */ }
}

// ⚠️ THE FALLBACK MUST ONLY FIRE ON A GENUINELY MISSING FILE. Calling pause() (or replacing src)
// while a previous play() is still resolving makes that promise reject with an AbortError — our
// own doing, not a broken clip. The first version treated every rejection as "no clip here" and
// spoke the word through the synthesiser as well, so a student tapping two buttons in a row heard
// the recorded voice AND a synthesised one talking over each other.
function playVoiceClip(name, onFail) {
  try {
    if (!voiceEl) voiceEl = new Audio();
    const token = ++voiceToken;
    const done = () => { if (token === voiceToken) { clipPlaying = false; flush(); } };
    const fail = (e) => {
      if (token !== voiceToken) return;     // superseded by a later tap
      clipPlaying = false;
      if (e?.name === 'AbortError') return; // we interrupted it ourselves
      onFail?.();
      flush();
    };
    voiceEl.pause();
    voiceEl.onerror = () => fail();         // no argument: a real load/decode failure
    voiceEl.onended = done;
    voiceEl.src = `/voice/${name}.m4a`;
    voiceEl.currentTime = 0;
    clipPlaying = true;
    const p = voiceEl.play();
    if (p?.catch) p.catch(fail);
    return true;
  } catch { clipPlaying = false; return false; }
}

// ⚠️ THE COMMON PATH MUST STAY SYNCHRONOUS. Safari and iOS only accept speak() when the call
// happens INSIDE the user gesture that triggered it — a setTimeout, however short, puts it
// outside and the utterance is silently dropped. An earlier version deferred EVERY call by 60ms
// to dodge a Chrome bug, which fixed Chrome and broke every iPad.
//
// So: defer only when there is genuinely something to cancel, because cancel-then-speak in the
// same tick is what wedges Chrome. Nothing playing means nothing to cancel, which is the
// overwhelmingly common case — a student tapping a button in a quiet interface.
function ttsSpeak(s, text) {
  try {
    if (s.speaking || s.pending) {
      s.cancel();
      setTimeout(() => whenReady(s, () => utter(s, text)), 60);
    } else {
      whenReady(s, () => utter(s, text));
    }
  } catch { /* no speech on this device — every screen still reads on its own */ }
}

// ── One voice at a time ────────────────────────────────────────────────────────────────────────
// Recorded clips and synthesised narration are two independent channels, and left alone they
// talk over each other constantly: tapping "What I like" plays that clip AND changes the screen,
// whose heading is narrated the same instant. Two voices at once is worse than none for a student
// who is using the audio to work out what a button does.
//
// The rule is simple and matches what a tap means:
//   • A TAP is a direct request and always wins. It stops whatever is sounding and plays now.
//   • NARRATION is incidental. If something is already sounding it WAITS, then speaks when the
//     channel is free — or is dropped if a newer tap has replaced it in the meantime.
let queuedAuto = null;

function busy() {
  if (clipPlaying) return true;
  const s = synth();
  return !!(s && (s.speaking || s.pending));
}

function flush() {
  const next = queuedAuto;
  if (!next || busy()) return;
  queuedAuto = null;
  speak(next, { auto: true, queued: true });
}

// A tap has just said "What I like"; the screen it opened is titled "Your turn. What I like".
// Saying the phrase again immediately is repetitive, so drop the part that was just spoken and
// keep the rest. If nothing new is left, stay quiet.
// ⚠️ WHOLE SENTENCES ONLY. Removing the phrase wherever it appeared mangled the sentence around
// it: after tapping "Tiger", the screen "Watch the Tiger. Take your time." was read out as
// "Watch the . Take your time." A student relying on the voice is then worse off than if it had
// simply repeated itself. So a sentence is dropped only when the whole sentence is what was just
// said; anything else is left exactly as written.
function dropRepeat(text) {
  if (!lastSpoken.text || Date.now() - lastSpoken.at > 4000) return text;
  const last = lastSpoken.text.replace(/[.!?]+$/, '').trim().toLowerCase();
  if (!last) return text;
  const parts = text.match(/[^.!?]+[.!?]*/g) || [text];   // keeps the punctuation, no lookbehind
  const kept = parts.filter(p => p.replace(/[.!?]+$/, '').trim().toLowerCase() !== last);
  const out = kept.join(' ').trim();
  return out.length >= 3 ? out : '';
}

let lastSpoken = { text: '', at: 0 };

// `force`  — speak even when the read-aloud toggle is off (the soundboard: an explicit request).
// `auto`   — incidental narration of a screen; skipped until the student has tapped something.
// `clip`   — key of a recorded clip to use instead of the synthesiser, when one exists.
export function speak(text, { force = false, auto = false, clip = null, queued = false } = {}) {
  if (!text) return;
  if (!force && !readAloudOn()) return;
  const s = synth();
  if (!s && !clip) return;
  if (auto && !gestureSeen) return;
  gestureSeen = true;                     // a non-auto call is itself a gesture

  if (auto) {
    if (!queued) {
      text = dropRepeat(text);
      if (!text) return;                  // nothing left that was not just said
    }
    if (busy()) { queuedAuto = text; return; }   // wait for the channel rather than talk over it
  } else {
    queuedAuto = null;                    // a tap replaces any narration that was still waiting
    stopVoiceClip();
    cancelSpeech();
  }

  lastSpoken = { text, at: Date.now() };

  // Recorded voice first. It only falls through to the synthesiser if the file is missing.
  if (clip && playVoiceClip(clip, () => { if (s) ttsSpeak(s, text); })) return;
  if (!s) return;

  ttsSpeak(s, text);
}
