import { useEffect, useRef, useState } from 'react';
import { speak, readAloudOn, setReadAloud, cancelSpeech } from '../speech';
import '../wildestDreams.css';

// Shell — the frame every Wildest Dreams screen sits in.
//
// Deliberately plain: one column, one idea, a big heading and an optional progress row. There is
// no persistent chrome, no points counter and no timer, because none of those help a student
// decide what to do next and all of them add something to ignore.
//
// `onBack` renders a large back control rather than a small chevron, since it is a real
// destination for a student who taps the wrong thing.
//
// Two things here are accessibility machinery rather than layout:
//
//   1. FOCUS. Changing phase swaps the whole screen but leaves the DOM node that had focus
//      unmounted, which drops a screen reader user back to the top of the document and restarts
//      a switch user's scan. The heading takes focus on every screen change so both land where
//      the new screen begins. `tabIndex={-1}` makes it focusable without adding a tab stop, and
//      because the focus is programmatic `:focus-visible` does not fire, so nobody sees a ring
//      appear on a heading they did not click.
//   2. READ ALOUD. The title and lead are spoken on arrival when the toggle is on.
export default function Shell({ title, lead, children, onBack, backLabel = 'Back', progress }) {
  const headingRef = useRef(null);
  const [aloud, setAloud] = useState(readAloudOn);

  useEffect(() => {
    headingRef.current?.focus();
    speak([title, lead].filter(Boolean).join('. '));
    return cancelSpeech;                  // leaving a screen stops it mid-sentence
  }, [title, lead]);

  const toggleAloud = () => {
    const next = !aloud;
    setAloud(next);
    setReadAloud(next);
    if (next) speak([title, lead].filter(Boolean).join('. '));
  };

  return (
    <div className="wd-root">
      <div className="wd-page">
        <div className="wd-topline">
          {onBack ? (
            <button className="wd-skip" onClick={onBack} style={{ paddingLeft:0 }}>
              ← {backLabel}
            </button>
          ) : <span />}

          {/* Not hidden behind a settings screen: a student or aide needs it in one tap. */}
          <button className="wd-aloud" onClick={toggleAloud} aria-pressed={aloud}
                  aria-label={aloud ? 'Reading aloud is on. Turn it off.' : 'Reading aloud is off. Turn it on.'}>
            <span aria-hidden="true">{aloud ? '🔊' : '🔇'}</span>
          </button>
        </div>

        {/* Progress is shown as dots rather than "3 of 6" — a count invites a student to feel
            behind. Labelled for screen readers, where the number genuinely helps. */}
        {progress && (
          <div className="wd-dots" role="img"
               aria-label={`Stop ${progress.current} of ${progress.total}`}>
            {Array.from({ length: progress.total }).map((_, i) => (
              <span key={i} className={`wd-dot ${i < progress.current ? 'wd-dot-on' : ''}`} />
            ))}
          </div>
        )}

        {title && <h1 className="wd-h1" ref={headingRef} tabIndex={-1}>{title}</h1>}
        {lead && <p className="wd-lead">{lead}</p>}
        {children}
      </div>
    </div>
  );
}
