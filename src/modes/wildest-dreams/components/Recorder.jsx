import { useState, useRef, useEffect, useCallback } from 'react';
import { startChapterRecording } from '../../../utils/evolveFilm';

// Recorder — camera, record, then Watch / Keep / Record again.
//
// Imports `startChapterRecording` from the Evolve util. That function is generic — it takes a
// stream and hands back a blob — and contains none of Evolve's content or flow, so sharing it
// carries no risk to Evolve. The stitching, which IS mode-specific, is a separate copy.
//
// Accessibility decisions that matter here:
//   • No countdown and no time limit. A student can take as long as they need, and a support
//     person can stop the recording for them.
//   • Recording is a single large button, not a press-and-hold — holding is hard with a stylus,
//     a tremor, or someone else's hand.
//   • Nothing is discarded automatically. "Record again" replaces only when they choose it.
export default function Recorder({ onKeep, onSkip, skipLabel }) {
  const [phase, setPhase]   = useState('ready');   // ready | recording | review
  const [clip,  setClip]    = useState(null);      // { blob, url, fileExt, contentType }
  const [error, setError]   = useState('');
  const [front, setFront]   = useState(true);      // selfie by default — most students film themselves

  const videoRef  = useRef(null);
  const streamRef = useRef(null);
  const recRef    = useRef(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async (facing) => {
    stopCamera();
    try {
      // Portrait capture, matching the 720x1280 film, so what the student frames is what lands
      // in the documentary. `ideal` not `exact`, so a device that cannot do portrait still works.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing ? 'user' : 'environment',
                 width: { ideal: 1080 }, height: { ideal: 1920 }, aspectRatio: { ideal: 9 / 16 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setError('');
    } catch {
      setError('The camera is not available. You can skip this one.');
    }
  }, [stopCamera]);

  // ⚠️ 'ready' ONLY. This used to run for 'recording' as well, which broke recording completely:
  // begin() hands the live stream to MediaRecorder and sets phase to 'recording', the effect then
  // re-ran, and startCamera's first act is stopCamera() — stopping the very tracks being recorded.
  // MediaRecorder kept running against dead tracks and produced a blob under 500 bytes, so
  // startChapterRecording reported 'empty-recording' and every attempt showed "That did not
  // record". The camera is already live by the time we reach 'recording'; leave it alone.
  //
  // The setTimeout keeps the effect body free of a synchronous setState (startCamera sets the
  // error string in its catch), which the react-hooks lint rule flags.
  useEffect(() => {
    if (phase !== 'ready') return undefined;
    const id = setTimeout(() => startCamera(front), 0);
    return () => clearTimeout(id);
  }, [phase, front, startCamera]);

  // Release the camera on unmount, or the light stays on after the student leaves.
  useEffect(() => () => { stopCamera(); recRef.current?.stop?.(); }, [stopCamera]);

  const begin = () => {
    // A stream whose tracks have ended records nothing and fails silently at the far end, so
    // check before starting rather than after. This is what the phase bug above looked like.
    const live = streamRef.current?.getTracks().some(t => t.readyState === 'live');
    if (!live) {
      setError('The camera is not ready. Give it a moment, then try again.');
      startCamera(front);
      return;
    }
    const handle = startChapterRecording(streamRef.current, {
      onComplete: (result) => { setClip(result); setPhase('review'); stopCamera(); },
      onError: (e) => {
        console.warn('[wildestDreams] recording failed:', e?.message || e);
        setError(e?.message === 'empty-recording'
          ? 'Nothing was recorded. Try again, or skip this one.'
          : 'That did not record. Try again, or skip this one.');
        setPhase('ready');
      },
    });
    if (!handle) { setError('Recording is not supported on this device.'); return; }
    setError('');
    recRef.current = handle;
    setPhase('recording');
  };

  const finish = () => recRef.current?.stop();

  const again = () => {
    if (clip?.url) URL.revokeObjectURL(clip.url);
    setClip(null);
    setPhase('ready');
  };

  // ⚠️ The `key` is load-bearing, not tidiness. The live preview and this playback element are
  // both a <video> in the same position of the same tree, so without distinct keys React reuses
  // ONE DOM node and merely swaps the attributes. That node still has `srcObject` pointing at the
  // now-stopped MediaStream, and srcObject BEATS src — so the clip recorded fine, the blob URL was
  // set, and the player showed a dead black frame. Clearing srcObject as well, because a browser
  // that reuses the node for any other reason would hit the same trap.
  if (phase === 'review' && clip) {
    return (
      <div>
        <div className="wd-cam">
          <video key="wd-playback" src={clip.url} controls playsInline
                 ref={el => { if (el) el.srcObject = null; }} />
        </div>
        <button className="wd-btn" onClick={() => onKeep(clip)} style={{ marginBottom:'0.75rem' }}>
          ✓ Keep it
        </button>
        <button className="wd-btn wd-btn-quiet" onClick={again}>
          ↻ Record again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="wd-cam">
        <video key="wd-live" ref={videoRef} autoPlay playsInline muted
               style={{ transform: front ? 'scaleX(-1)' : 'none' }} />
        {phase === 'recording' && (
          <span className="wd-rec-dot" role="status">● Recording</span>
        )}
      </div>

      {error && (
        <p className="wd-lead" style={{ color:'#B3261E', marginBottom:'0.75rem' }} role="alert">{error}</p>
      )}

      {phase === 'recording' ? (
        <button className="wd-btn" onClick={finish} style={{ background:'#B3261E' }}>
          ■ Stop
        </button>
      ) : (
        <>
          <button className="wd-btn" onClick={begin} style={{ marginBottom:'0.75rem' }}>
            ● Start recording
          </button>
          <button className="wd-btn wd-btn-quiet" onClick={() => setFront(f => !f)}>
            ⟲ {front ? 'Film the animal' : 'Film me'}
          </button>
        </>
      )}

      {onSkip && phase !== 'recording' && (
        <button className="wd-skip" onClick={onSkip} style={{ width:'100%', marginTop:'0.5rem' }}>
          {skipLabel || 'Skip this one'}
        </button>
      )}
    </div>
  );
}
