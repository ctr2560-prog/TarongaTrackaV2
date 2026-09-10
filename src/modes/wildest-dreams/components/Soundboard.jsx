import { WD_SOUNDBOARD, WD_MAX_SOUNDS } from '../content';
import { speak } from '../speech';

// Soundboard — OPTIONAL. Never a required step, never blocks finishing a stop.
//
// For a student who does not speak, this IS their voice, so it is reached from a full-strength
// button next to Record rather than a quiet link underneath the camera. That ordering was a
// priority inversion: the cohort the mode exists for had to scroll past the speaking-student
// interface to find the part built for them.
//
// Two jobs at once:
//   1. Speaks the word aloud, so a student who is not speaking still puts a voice in the room.
//   2. Returns a caption, which the stitcher burns onto that stop's card and lower third — so
//      a non-speaking student's choice reaches the finished film exactly as a spoken one does.
//
// `selected` is an ARRAY. It used to be a single item, which meant "Look at that" and "My
// favourite" could not both be said. Capped at WD_MAX_SOUNDS so the film caption stays readable;
// at the cap a further tap still speaks the word, it just does not add it, because silently doing
// nothing when a student presses a button is worse than the limit itself.
export default function Soundboard({ selected = [], onToggle, onClose }) {
  const isOn  = id => selected.some(s => s.id === id);
  const full  = selected.length >= WD_MAX_SOUNDS;

  const tap = (item) => {
    speak(item.say, { force: true, clip: item.voice });   // an explicit request to hear the word
    if (isOn(item.id))      onToggle(selected.filter(s => s.id !== item.id));
    else if (!full)         onToggle([...selected, item]);
  };

  return (
    <div style={{ marginTop:'0.25rem' }}>
      <div className="wd-grid" role="group" aria-label="Sounds and words">
        {WD_SOUNDBOARD.map(item => {
          const on = isOn(item.id);
          return (
            // A real toggle, unlike the focus choices — so it keeps `aria-pressed`, and the CSS
            // adds a tick so the selection is never signalled by colour alone.
            <button key={item.id} className="wd-choice" aria-pressed={on}
              onClick={() => tap(item)}>
              <span className="wd-ico" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {full && (
        <p className="wd-lead" style={{ margin:'0.75rem 0 0', fontSize:'1rem' }} role="status">
          That is {WD_MAX_SOUNDS} words. Tap one again to take it off.
        </p>
      )}

      {onClose && (
        <button className="wd-skip" onClick={onClose} style={{ width:'100%', marginTop:'0.5rem' }}>
          Close
        </button>
      )}
    </div>
  );
}
