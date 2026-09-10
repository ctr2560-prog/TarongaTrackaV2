import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { normaliseCode, safeStudentId } from '../../utils/helpers';
import { pickMimeType } from '../../utils/evolveFilm';
import { buildWildestDreamsFilm } from './film';
import { WD_STOPS, WD_FOCUS, WD_COPY, WD_FILM_TITLE } from './content';
import { speak, armSpeech, playAnimalSound, stopAnimalSound } from './speech';
import Shell from './components/Shell';
import BigChoice from './components/BigChoice';
import Soundboard from './components/Soundboard';
import Recorder from './components/Recorder';

// WildestDreamsScreen — the mode's own sub-router.
//
// Mirrors how ZooSnoozScreen, ZooYardScreen and EvolveScreen work: App.jsx short-circuits on
// sessionType, so this component owns the whole screen and `currentScreen` never applies.
//
// Screen state is LOCAL rather than in AppContext. The other modes keep theirs in context, but
// they need it read from outside; nothing outside Wildest Dreams needs to know which step a
// student is on, and keeping it local means AppContext did not have to change.
//
// Deliberately absent: points, badges, scores, marks, timers, leaderboards and any required
// writing or speech. The film is the whole output.
export default function WildestDreamsScreen() {
  const { studentName, classCode, setCurrentScreen, setSessionType, clearStudentSession } = useApp();

  const [phase, setPhase]       = useState('welcome');   // welcome | stops | watch | choose | film | building | done | leaving
  const [stop, setStop]         = useState(null);        // the stop being worked on
  const [focus, setFocus]       = useState(null);        // chosen focus prompt
  const [sounds, setSounds]     = useState([]);          // optional soundboard picks (0..WD_MAX_SOUNDS)
  const [showBoard, setBoard]   = useState(false);
  const [clips, setClips]       = useState({});          // { [stopId]: objectURL }
  const [captions, setCaptions] = useState({});          // { [stopId]: caption text }
  const [filmPct, setFilmPct]   = useState(0);
  const [filmURL, setFilmURL]   = useState(null);
  const [saveNote, setSaveNote] = useState('');
  const filmBlobRef = useRef(null);

  const code = normaliseCode(classCode || '');
  const sid  = safeStudentId(studentName || '');

  // Unlocks speech synthesis on the student's first tap. Without it the engine refuses the very
  // first utterance (a screen narrating itself on mount, before any gesture) and then stays
  // refusing — see the long note in speech.js.
  useEffect(armSpeech, []);

  // Resume: a support unit may close the app between animals, and losing a morning's filming
  // would be unrecoverable. Clips live in Storage, so only the URLs need restoring.
  useEffect(() => {
    let cancelled = false;
    if (!code || !sid) return undefined;
    (async () => {
      try {
        const snap = await Promise.race([
          getDoc(doc(db, 'classes', code, 'students', sid)),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000)),
        ]);
        if (cancelled || !snap.exists()) return;
        const wd = snap.data().wildestDreams || {};
        const urls = {}, caps = {};
        WD_STOPS.forEach(s => {
          if (wd[s.id]?.clipURL) urls[s.id] = wd[s.id].clipURL;
          if (wd[s.id]?.caption) caps[s.id] = wd[s.id].caption;
        });
        setClips(urls); setCaptions(caps);
        if (wd.filmURL) setFilmURL(wd.filmURL);
      } catch { /* offline or blocked — start fresh rather than block the student */ }
    })();
    return () => { cancelled = true; };
  }, [code, sid]);

  const filmedCount = WD_STOPS.filter(s => clips[s.id]).length;

  // ── Saving a clip ────────────────────────────────────────────────────────
  const keepClip = useCallback(async (clip) => {
    // The focus and the soundboard words are different things a student said, so the film
    // carries both. It used to be one OR the other, which silently discarded whichever the
    // student picked first.
    const caption = [focus?.caption, ...sounds.map(s => s.caption)].filter(Boolean).join(' · ');
    // Show it immediately from the local object URL. The upload can take a while on zoo wifi,
    // and a student should never wait on a spinner to move to the next animal.
    setClips(prev => ({ ...prev, [stop.id]: clip.url }));
    setCaptions(prev => ({ ...prev, [stop.id]: caption }));
    setPhase('stops');
    setFocus(null); setSounds([]); setBoard(false);

    if (!code || !sid) return;
    try {
      const { fileExt, contentType } = pickMimeType();
      const path = `wildestDreams/${code}/${sid}/${stop.id}.${fileExt}`;
      const snap = await uploadBytes(storageRef(storage, path), clip.blob, { contentType });
      const url  = await getDownloadURL(snap.ref);
      setClips(prev => ({ ...prev, [stop.id]: url }));
      // ⚠️ updateDoc, not setDoc+merge: a dotted key in setDoc becomes a LITERAL field name
      // containing dots rather than a nested path. Same trap documented for ZooSnooz/ZooYard.
      await updateDoc(doc(db, 'classes', code, 'students', sid), {
        [`wildestDreams.${stop.id}.clipURL`]: url,
        [`wildestDreams.${stop.id}.caption`]: caption,
        [`wildestDreams.${stop.id}.filmedAt`]: new Date().toISOString(),
      }).catch(async () => {
        // First clip for this student — the nested map does not exist yet.
        await setDoc(doc(db, 'classes', code, 'students', sid),
          { name: studentName, classCode: code, wildestDreams: { [stop.id]: { clipURL: url, caption } } },
          { merge: true });
      });
    } catch (e) {
      console.warn('[wildestDreams] clip upload failed:', e);
      // Kept locally regardless — the student still sees it and it still reaches their film.
    }
  }, [stop, focus, sounds, code, sid, studentName]);

  // ── Building the film ────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'building') return undefined;
    let cancelled = false;
    (async () => {
      const stops = WD_STOPS.filter(s => clips[s.id]);
      const result = await buildWildestDreamsFilm({
        stops, clipURLs: clips, studentName, captions,
        onProgress: pct => { if (!cancelled) setFilmPct(pct); },
        isCancelled: () => cancelled,
      });
      if (cancelled) return;
      if (result) {
        filmBlobRef.current = result.blob;
        setFilmURL(result.url);
        try {
          const { fileExt, contentType } = pickMimeType();
          const path = `wildestDreams/${code}/${sid}/film.${fileExt}`;
          const snap = await uploadBytes(storageRef(storage, path), result.blob, { contentType });
          const url  = await getDownloadURL(snap.ref);
          await setDoc(doc(db, 'classes', code, 'students', sid),
            { name: studentName, classCode: code,
              wildestDreams: { filmURL: url, completedAt: serverTimestamp() } },
            { merge: true });
          if (!cancelled) setSaveNote('Saved. Yours to keep.');
        } catch {
          if (!cancelled) setSaveNote('Your film is ready. It will save when you are back online.');
        }
      }
      if (!cancelled) setPhase('done');
    })();
    return () => { cancelled = true; };
  }, [phase, clips, captions, studentName, code, sid]);

  // An in-page screen, not window.confirm. A native dialog is unstyled, sizes its buttons to the
  // OS rather than to this mode's targets, and behaves unpredictably with a screen reader — and
  // per the app's own rules a modal dialog blocks everything until it is dismissed.
  const goHome = () => setPhase('leaving');
  const leaveNow = () => {
    clearStudentSession();
    setSessionType('standard');
    setCurrentScreen('home');
  };

  if (phase === 'leaving') {
    return (
      <Shell title="Leave Wildest Dreams?" lead="Your films are saved.">
        <button className="wd-btn wd-btn-quiet" onClick={() => setPhase('stops')}
                style={{ marginBottom:'0.75rem' }}>
          ← No, keep filming
        </button>
        <button className="wd-btn" onClick={leaveNow} style={{ background:'#B3261E' }}>
          Yes, leave
        </button>
      </Shell>
    );
  }

  // ── Welcome ──────────────────────────────────────────────────────────────
  if (phase === 'welcome') {
    return (
      <Shell title={WD_COPY.welcomeTitle} lead={WD_COPY.welcomeLead}>
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem', margin:'0.5rem 0 1.75rem' }}>
          {WD_COPY.welcomeSteps.map((s, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <span aria-hidden="true" style={{ fontSize:'2.4rem', lineHeight:1 }}>{s.icon}</span>
              <span style={{ fontSize:'1.2rem', fontWeight:700 }}>{s.text}</span>
            </div>
          ))}
        </div>
        <button className="wd-btn" onClick={() => setPhase('stops')}>{WD_COPY.start}</button>
        <button className="wd-skip" onClick={goHome} style={{ width:'100%' }}>Leave</button>
      </Shell>
    );
  }

  // ── Stop picker ──────────────────────────────────────────────────────────
  if (phase === 'stops') {
    return (
      <Shell title={WD_COPY.pickStop} lead={filmedCount ? `You have filmed ${filmedCount}.` : null}>
        {WD_STOPS.map(s => {
          const done = !!clips[s.id];
          return (
            <button key={s.id} className={`wd-stop ${done ? 'wd-stop-done' : ''}`}
              onClick={() => { speak(s.name, { clip: s.voice }); setStop(s); setPhase('watch'); }}>
              <img src={s.image} alt="" />
              <span>
                <span className="wd-stop-name" style={{ display:'block' }}>{s.name}</span>
                <span className="wd-stop-sub">{done ? 'Filmed — tap to film again' : 'Tap to start'}</span>
              </span>
              {done && <span className="wd-tick" aria-hidden="true">✓</span>}
            </button>
          );
        })}

        {filmedCount > 0 && (
          <button className="wd-btn" style={{ marginTop:'1rem' }} onClick={() => { setFilmPct(0); setPhase('building'); }}>
            🎬 {WD_COPY.makeFilm}
          </button>
        )}
        <button className="wd-skip" onClick={goHome} style={{ width:'100%' }}>Leave</button>
      </Shell>
    );
  }

  // Counts what has been FILMED. The current animal is a ring, not a filled dot, so "doing" is
  // never read as "done" — see the note in Shell.
  const progress = {
    done:   filmedCount,
    total:  WD_STOPS.length,
    active: true,
    label:  `You have filmed ${filmedCount} of ${WD_STOPS.length} animals`,
  };

  // ── Watch ────────────────────────────────────────────────────────────────
  if (phase === 'watch' && stop) {
    return (
      <Shell title={`${WD_COPY.watchTitle} ${stop.name}`} lead={WD_COPY.watchLead}
             onBack={() => setPhase('stops')} backLabel="Animals" progress={progress}>
        <img src={stop.image} alt={stop.name}
             style={{ width:'100%', borderRadius:20, marginBottom:'1rem', display:'block' }} />

        {/* Real recorded audio, and only shown where a file actually exists. A button that plays
            nothing teaches a student the button is broken. */}
        {stop.sound && (
          <button className="wd-btn wd-btn-quiet" style={{ marginBottom:'0.75rem' }}
            onClick={() => playAnimalSound(stop.sound)}>
            🔊 Hear the {stop.name}
          </button>
        )}

        {/* No timer. A student decides when they have watched enough. */}
        <button className="wd-btn" onClick={() => { stopAnimalSound(); setPhase('choose'); }}>
          {WD_COPY.watchDone}
        </button>
      </Shell>
    );
  }

  // ── Choose ───────────────────────────────────────────────────────────────
  if (phase === 'choose' && stop) {
    return (
      <Shell title={WD_COPY.chooseTitle} onBack={() => setPhase('watch')} backLabel={stop.name}
             progress={progress}>
        <div className="wd-grid">
          {WD_FOCUS.map(f => (
            // No `selected`: tapping navigates straight to filming, so a selected state would
            // never be seen. See the note in BigChoice.
            <BigChoice key={f.id} icon={f.icon} label={f.label} voice={f.voice}
              onClick={() => { setFocus(f); setPhase('film'); }} />
          ))}
        </div>
        {/* Choosing is skippable: a student may just want to film. */}
        <button className="wd-skip" style={{ width:'100%', marginTop:'0.75rem' }}
          onClick={() => { setFocus(null); setPhase('film'); }}>
          Just film
        </button>
      </Shell>
    );
  }

  // ── Film ─────────────────────────────────────────────────────────────────
  if (phase === 'film' && stop) {
    return (
      <Shell title={WD_COPY.filmTitle} lead={focus ? focus.label : stop.name}
             onBack={() => setPhase('choose')} backLabel="Back" progress={progress}>
        <Recorder
          onKeep={keepClip}
          onSkip={() => { setFocus(null); setSounds([]); setBoard(false); setPhase('stops'); }}
          skipLabel={WD_COPY.skip}
          // Sits directly beneath Start recording, at full strength. For a student who does not
          // speak this is the equivalent of the record button, not an extra.
          extraAction={
            <button className="wd-btn" style={{ marginBottom:'0.75rem', background:'#0B57D0' }}
              aria-expanded={showBoard} onClick={() => setBoard(b => !b)}>
              🔊 {WD_COPY.soundboard}
            </button>
          }
        />

        {showBoard && (
          <Soundboard selected={sounds} onToggle={setSounds} onClose={() => setBoard(false)} />
        )}
        {sounds.length > 0 && (
          <p className="wd-lead" style={{ marginTop:'0.75rem' }} role="status">
            On your film: <strong>{sounds.map(s => s.caption).join(' · ')}</strong>
          </p>
        )}
      </Shell>
    );
  }

  // ── Building ─────────────────────────────────────────────────────────────
  if (phase === 'building') {
    return (
      <Shell title="Making your film" lead="This takes about a minute. Keep this screen open.">
        <div style={{ textAlign:'center', margin:'2rem 0' }}>
          <div style={{ fontSize:'4rem', fontWeight:800, color:'var(--wd-accent)' }} role="status"
               aria-live="polite">{filmPct}%</div>
        </div>
        <div style={{ height:16, background:'var(--wd-line)', borderRadius:8, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${filmPct}%`, background:'var(--wd-accent)', transition:'width 0.4s' }} />
        </div>
      </Shell>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  return (
    // The lead is what gets read aloud, so it must not say "Here is your film" when the stitch
    // failed and there is no film on screen.
    <Shell title={WD_FILM_TITLE}
           lead={filmURL ? (saveNote || 'Here is your film.')
                         : 'Your film could not be made on this device. Every clip is saved.'}>
      {filmURL
        ? <video src={filmURL} controls playsInline
                 style={{ width:'100%', borderRadius:20, background:'#000', marginBottom:'1rem' }} />
        : <p className="wd-lead">Your film could not be made on this device, but every clip is saved.</p>}
      {filmURL && (
        <a className="wd-btn" href={filmURL} download={`${WD_FILM_TITLE}.webm`}
           style={{ textDecoration:'none', marginBottom:'0.75rem' }}>
          ⬇ Save my film
        </a>
      )}
      <button className="wd-btn wd-btn-quiet" onClick={() => setPhase('stops')}>
        Film another animal
      </button>
      <button className="wd-skip" onClick={goHome} style={{ width:'100%' }}>Finish</button>
    </Shell>
  );
}
