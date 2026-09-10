import { speak } from '../speech';

// BigChoice — one large icon-and-label target, used for the focus prompts.
//
// ⚠️ These NAVIGATE, they do not toggle: tapping one moves straight to filming. It used to carry
// `aria-pressed`, which told a screen reader it was a two-state control that was never on — the
// state could not survive the screen change that the same tap caused. A plain button is the
// honest element. `toggle` opts a caller in to real toggle semantics (the soundboard does that
// itself, with a visible tick as well as the state, so the selection is never colour-only).
//
// Tapping speaks the label, so exploring the choices does not require reading them.
export default function BigChoice({ icon, label, selected, onClick, toggle = false, voice = null }) {
  return (
    <button
      className="wd-choice"
      {...(toggle ? { 'aria-pressed': !!selected } : {})}
      onClick={() => { speak(label, { clip: voice }); onClick?.(); }}
    >
      {/* The emoji is decorative — the label already says it, so announcing both is noise. */}
      <span className="wd-ico" aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
