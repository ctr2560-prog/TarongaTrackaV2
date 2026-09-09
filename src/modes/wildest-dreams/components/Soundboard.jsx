import { WD_SOUNDBOARD } from '../content';
import { speak } from '../speech';

// Soundboard — OPTIONAL. Never a required step, never blocks finishing a stop.
//
// Two jobs at once:
//   1. Speaks the word aloud, so a student who is not speaking still puts a voice in the room.
//   2. Returns a caption, which the stitcher burns onto that stop's card and lower third — so
//      a non-speaking student's choice reaches the finished film exactly as a spoken one does.
//
// Speech is best-effort: if the device has no speechSynthesis, the caption still works. Adding a
// button is a one-line edit to WD_SOUNDBOARD in content.js.
export default function Soundboard({ selected, onToggle, onClose }) {
  // `force`: tapping a soundboard button is an explicit request to hear that word, so it speaks
  // even when the interface read-aloud toggle is off.
  const say = (item) => speak(item.say, { force: true });

  return (
    <div style={{ marginTop:'0.25rem' }}>
      <div className="wd-grid" role="group" aria-label="Sounds and words">
        {WD_SOUNDBOARD.map(item => {
          const on = selected === item.id;
          return (
            // A real toggle, unlike the focus choices — so it keeps `aria-pressed`, and the CSS
            // adds a tick so the selection is never signalled by colour alone.
            <button key={item.id} className="wd-choice" aria-pressed={on}
              onClick={() => { say(item); onToggle(on ? null : item); }}>
              <span className="wd-ico" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      {onClose && (
        <button className="wd-skip" onClick={onClose} style={{ width:'100%', marginTop:'0.5rem' }}>
          Close
        </button>
      )}
    </div>
  );
}
