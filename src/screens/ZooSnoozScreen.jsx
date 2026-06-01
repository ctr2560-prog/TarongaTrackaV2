import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { ZOOSNOOZ_ANIMALS } from '../data/zoosnoozAnimals';
import StudentFeedbackModal from '../components/StudentFeedbackModal';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { normaliseCode, safeStudentId, getMinWords } from '../utils/helpers';
import { buildObservationScore } from '../utils/scoring';

const INTER_DURATION = { tiger: 30, lion: 30, rhino: 0, binturong: 0, 'sun-bear': 0 };

function ZzDoneScreen({ classCode, studentName, onDone }) {
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowFeedback(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#020D06,#071E14)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div className="animate-scale-in" style={{ textAlign:'center', maxWidth:'400px', width:'100%' }}>
        <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🌙</div>
        <h2 className="taronga-title" style={{ fontSize:'2rem', color:'white', marginBottom:'0.5rem', letterSpacing:'0.06em' }}>Documentary Submitted!</h2>
        <p style={{ color:'#4A9E6B', marginBottom:'2rem', fontSize:'0.9rem', lineHeight:1.6 }}>Your night documentary has been sent to the Taronga team. Tap the NFC tag to watch it anytime.</p>
        <button onClick={onDone}
          style={{ width:'100%', padding:'0.9rem', background:'linear-gradient(135deg,#2E7D55,#4C1D95)', border:'none', borderRadius:'var(--t-r-pill)', color:'white', fontSize:'1rem', fontWeight:800, cursor:'pointer', letterSpacing:'0.06em', textTransform:'uppercase', boxShadow:'0 6px 20px rgba(46,125,85,0.5)' }}>
          Back to Home
        </button>
      </div>
      {showFeedback && (
        <StudentFeedbackModal
          classCode={classCode}
          studentName={studentName}
          sessionType="zoosnooz"
          onDone={onDone}
        />
      )}
    </div>
  );
}

export default function ZooSnoozScreen() {
  const { zzScreen, setZzScreen, setSessionType, setCurrentScreen, studentName, classCode, classStage, clearStudentSession } = useApp();
  const { userLocation, locationEnabled, enableLocation, gpsRequired, checkAnimalProximity, setCompletionCardDismissed } = useStudent();

  // ── Session state ─────────────────────────────────────────────────────────
  const [zzAnimal,     setZzAnimal]     = useState(null);
  const [zzPhase,      setZzPhase]      = useState('insight');
  const [zzCompleted,  setZzCompleted]  = useState({});
  const [zzSessionDone, setZzSessionDone] = useState(false);
  const [zzBadgeAnimal, setZzBadgeAnimal] = useState(null); // { animal, points, quizCorrect, totalDone, runningTotal }

  // ── Interaction ───────────────────────────────────────────────────────────
  const [interTimer,   setInterTimer]   = useState(30);
  const [interDone,    setInterDone]    = useState(false);
  // Tiger energy
  const [energyHeld,   setEnergyHeld]   = useState(false);
  const [tigerTimeline, setTigerTimeline] = useState([]);
  const [tigerStarted,  setTigerStarted]  = useState(false);
  const heldRef           = useRef(false);
  const tigerStartedRef   = useRef(false);
  // Lion sound
  const [soundLevel,   setSoundLevel]   = useState(0);
  const audioCtxRef   = useRef(null);
  const analyserRef   = useRef(null);
  const micStreamRef  = useRef(null);
  const soundRafRef   = useRef(null);
  const soundSampRef  = useRef([]);
  // Binturong light
  const lightVidRef   = useRef(null);
  const lightCanvRef  = useRef(null);
  const lightStreamRef = useRef(null);
  const [lightPct,     setLightPct]     = useState(null);
  // Rhino haptic
  const [hapticPos,    setHapticPos]    = useState({ x: 50, y: 50 });
  const [hapticDist,   setHapticDist]   = useState(0);
  const hapticDragRef = useRef(false);
  // Sketch
  const sketchRef  = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn,  setHasDrawn]  = useState(false);
  const sketchLastRef = useRef(null);

  // ── Lion extended ─────────────────────────────────────────────────────────
  const [lionMonitoring, setLionMonitoring] = useState(false);
  const [lionPeak,       setLionPeak]       = useState(0);
  const [lionHistory,    setLionHistory]    = useState([]);
  const [lionError,      setLionError]      = useState(false);
  const lionPeakRef         = useRef(0);
  const lionSampIntervalRef = useRef(null);
  // ── Binturong extended ────────────────────────────────────────────────────
  const [bintuScanning,   setBintuScanning]   = useState(false);
  const [bintuDone,       setBintuDone]       = useState(false);
  const [bintuBrightness, setBintuBrightness] = useState(0);
  const [bintuCamIdx,     setBintuCamIdx]     = useState(100);
  const [bintuReadings,   setBintuReadings]   = useState([]);
  const [bintuPeak,       setBintuPeak]       = useState(0);
  const [bintuMin,        setBintuMin]        = useState(255);
  const [bintuError,      setBintuError]      = useState(false);
  const bintuIntervalRef = useRef(null);
  // ── Rhino canvas ──────────────────────────────────────────────────────────
  const rhinoStateRef = useRef(null);
  const [rhinoTick,   setRhinoTick]  = useState(0);
  // ── Sun Bear label / color ────────────────────────────────────────────────
  const [sbLabel, setSbLabel] = useState(null);
  const [sbColor, setSbColor] = useState('#4A9E6B');
  const [sbSize,  setSbSize]  = useState(3);
  const sbLabelRef = useRef(null);
  const sbColorRef = useRef('#4A9E6B');
  const sbSizeRef  = useRef(3);

  // ── MCQ ───────────────────────────────────────────────────────────────────
  const [mcqAnswer,      setMcqAnswer]      = useState(null);
  const [mcqFirstOk,     setMcqFirstOk]     = useState(null);
  const [mcqRevealed,    setMcqRevealed]    = useState(false);
  const [mcqShowResult,  setMcqShowResult]  = useState(false);

  // ── Observation ───────────────────────────────────────────────────────────
  const [obsText,    setObsText]    = useState('');
  const [obsLock,    setObsLock]    = useState(20);
  const [obsOpen,    setObsOpen]    = useState(false);

  // ── Video ─────────────────────────────────────────────────────────────────
  const [vidReady,      setVidReady]      = useState(false);
  const [zzRecording,   setZzRecording]   = useState(false);
  const [zzCountdown,   setZzCountdown]   = useState(10);
  const [zzVideoTitle,  setZzVideoTitle]  = useState('');
  const [zzConservationMsg, setZzConservationMsg] = useState('');
  const [zzUploadProgress, setZzUploadProgress] = useState({});
  const [zzVideoURLs,   setZzVideoURLs]   = useState({});    // { [animalId]: blobURL }
  const [nightVision,   setNightVision]   = useState(false);
  const [zzFrontCam,    setZzFrontCam]    = useState(false);
  const zzVideoRef    = useRef(null);  // camera <video> element
  const zzCamRef      = useRef(null);  // camera stream
  const zzMediaRef    = useRef(null);  // MediaRecorder
  const zzChunksRef   = useRef([]);
  const zzCountdownRef = useRef(null);
  const zzFacingModeRef = useRef('environment');

  // ── Documentary stitching ─────────────────────────────────────────────────
  const [zzStitchPhase,    setZzStitchPhase]    = useState(null); // 'stitching'|'preview'|'submitting'|'done'
  const [zzStitchProgress, setZzStitchProgress] = useState(0);
  const [zzStitchAnimalIdx,setZzStitchAnimalIdx]= useState(-1);
  const [zzStitchedURL,    setZzStitchedURL]    = useState(null);
  const zzStitchedBlobRef = useRef(null);
  const zzAudioCtxRef     = useRef(null);
  const zzStitchDataRef   = useRef({ videoURLs: {}, completed: {} });

  // ── Night-mode ────────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.classList.add('night-mode');
    return () => document.body.classList.remove('night-mode');
  }, []);

  // ── Auto-enable GPS on map view (like daily MapScreen) ────────────────────
  useEffect(() => {
    if (zzScreen === 'map' && !locationEnabled) enableLocation();
  }, [zzScreen]);

  // ── Observation lock countdown ────────────────────────────────────────────
  useEffect(() => {
    if (zzPhase !== 'observation' || obsOpen) return;
    if (obsLock <= 0) { setObsOpen(true); return; }
    const t = setTimeout(() => setObsLock(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [zzPhase, obsLock, obsOpen]);

  // ── Interaction timer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (zzPhase !== 'interaction' || interDone) return;
    if (zzAnimal?.id === 'lion' && !lionMonitoring) return;
    const dur = INTER_DURATION[zzAnimal?.id] || 0;
    if (dur === 0) return;
    if (interTimer <= 0) { setInterDone(true); return; }
    const t = setTimeout(() => setInterTimer(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [zzPhase, interTimer, interDone, zzAnimal, lionMonitoring]);

  // ── Tiger: timeline sampling at 500ms intervals ───────────────────────────
  useEffect(() => {
    if (zzPhase !== 'interaction' || zzAnimal?.id !== 'tiger' || interDone) return;
    setTigerTimeline([]);
    tigerStartedRef.current = false;
    setTigerStarted(false);
    const interval = setInterval(() => {
      const active = heldRef.current;
      if (active && !tigerStartedRef.current) {
        tigerStartedRef.current = true;
        setTigerStarted(true);
      }
      setTigerTimeline(t => [...t, active]);
    }, 500);
    return () => clearInterval(interval);
  }, [zzPhase, zzAnimal, interDone]);

  // ── Lion: mic analyser ────────────────────────────────────────────────────
  useEffect(() => {
    if (zzPhase !== 'interaction' || zzAnimal?.id !== 'lion' || interDone) return;
    let stopped = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (stopped) { stream.getTracks().forEach(t => t.stop()); return; }
        micStreamRef.current = stream;
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ctx;
        const src = ctx.createMediaStreamSource(stream);
        const gain = ctx.createGain();
        gain.gain.value = 2.5;
        const an = ctx.createAnalyser();
        an.fftSize = 256;
        src.connect(gain);
        gain.connect(an);
        analyserRef.current = an;
        const data = new Uint8Array(an.frequencyBinCount);
        const tick = () => {
          if (stopped) return;
          an.getByteTimeDomainData(data);
          let s = 0; for (let i = 0; i < data.length; i++) s += Math.abs(data[i] - 128);
          const lv = Math.min(100, Math.round((s / data.length) * 8));
          setSoundLevel(lv);
          soundSampRef.current.push(lv);
          soundRafRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch (e) { console.warn('Mic:', e); }
    })();
    return () => {
      stopped = true;
      clearInterval(lionSampIntervalRef.current);
      if (soundRafRef.current) cancelAnimationFrame(soundRafRef.current);
      micStreamRef.current?.getTracks().forEach(t => t.stop());
      audioCtxRef.current?.close().catch(() => {});
    };
  }, [zzPhase, zzAnimal, interDone]);

  // ── Binturong: camera light sensor ───────────────────────────────────────
  useEffect(() => {
    if (zzPhase !== 'interaction' || zzAnimal?.id !== 'binturong' || bintuDone) return;
    let stopped = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (stopped) { stream.getTracks().forEach(t => t.stop()); return; }
        lightStreamRef.current = stream;
        if (lightVidRef.current) {
          lightVidRef.current.srcObject = stream;
          lightVidRef.current.play().catch(() => {});
        }
      } catch (e) { console.warn('Camera:', e); }
    })();
    return () => {
      stopped = true;
      lightStreamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [zzPhase, zzAnimal, bintuDone]);

  // ── Video phase: camera stream ─────────────────────────────────────────────
  useEffect(() => {
    if (zzPhase !== 'video') return;
    let stopped = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: zzFacingModeRef.current, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: true });
        if (stopped) { stream.getTracks().forEach(t => t.stop()); return; }
        zzCamRef.current = stream;
        if (zzVideoRef.current) {
          zzVideoRef.current.srcObject = stream;
          zzVideoRef.current.play().catch(() => {});
        }
        setVidReady(true);
      } catch (e) { setVidReady(true); }
    })();
    return () => {
      stopped = true;
      clearInterval(zzCountdownRef.current);
      if (zzMediaRef.current && zzMediaRef.current.state !== 'inactive') {
        try { zzMediaRef.current.stop(); } catch(e) {}
      }
      zzCamRef.current?.getTracks().forEach(t => t.stop());
      zzCamRef.current = null;
    };
  }, [zzPhase]);

  // ── Video phase: flip camera ──────────────────────────────────────────────
  const flipZzCamera = () => {
    if (zzRecording) return;
    const newFront = !zzFrontCam;
    zzFacingModeRef.current = newFront ? 'user' : 'environment';
    setZzFrontCam(newFront);
    zzCamRef.current?.getTracks().forEach(t => t.stop());
    zzCamRef.current = null;
    if (zzVideoRef.current) zzVideoRef.current.srcObject = null;
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: newFront ? 'user' : 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: true,
    }).then(stream => {
      zzCamRef.current = stream;
      if (zzVideoRef.current) { zzVideoRef.current.srcObject = stream; zzVideoRef.current.play().catch(() => {}); }
    }).catch(() => {});
  };

  // ── Start mission ─────────────────────────────────────────────────────────
  const startMission = useCallback((animal) => {
    setZzAnimal(animal);
    setZzPhase('insight');
    setInterTimer(INTER_DURATION[animal.id] || 30);
    setInterDone(false);
    setEnergyHeld(false);
    setTigerTimeline([]);
    setTigerStarted(false);
    heldRef.current = false;
    tigerStartedRef.current = false;
    setSoundLevel(0);
    soundSampRef.current = [];
    setHapticPos({ x: 50, y: 50 });
    setHapticDist(0);
    setLightPct(null);
    setHasDrawn(false);
    setMcqAnswer(null);
    setMcqFirstOk(null);
    setMcqRevealed(false);
    setMcqShowResult(false);
    setObsText('');
    setObsLock(20);
    setObsOpen(false);
    setVidReady(false);
    setZzRecording(false);
    setZzCountdown(10);
    setZzVideoTitle('');
    setZzConservationMsg('');
    setNightVision(false);
    setIsDrawing(false);
    setLionMonitoring(false);
    setLionPeak(0);
    setLionHistory([]);
    setLionError(false);
    lionPeakRef.current = 0;
    clearInterval(lionSampIntervalRef.current);
    setBintuScanning(false);
    setBintuDone(false);
    setBintuBrightness(0);
    setBintuCamIdx(100);
    setBintuReadings([]);
    setBintuPeak(0);
    setBintuMin(255);
    setBintuError(false);
    clearInterval(bintuIntervalRef.current);
    rhinoStateRef.current = null;
    setRhinoTick(0);
    setSbLabel(null);
    setSbColor('#4A9E6B');
    setSbSize(3);
    sbLabelRef.current = null;
    sbColorRef.current = '#4A9E6B';
    sbSizeRef.current = 3;
    setZzScreen('mission');
  }, [setZzScreen]);

  // ── Complete mission (claim badge + save video metadata) ──────────────────
  const zzCompleteMission = useCallback(async () => {
    if (!zzAnimal) return;
    const obsScore = buildObservationScore(obsText, zzAnimal.id, classStage);
    const stageQ = zzAnimal.byStage?.[classStage] || zzAnimal.byStage?.[5] || {};
    const videoTitle     = zzVideoTitle.trim();
    const conservationMsg = zzConservationMsg.trim();
    const videoURL       = zzVideoURLs[zzAnimal.id] || null;
    const badgeData = {
      animalId: zzAnimal.id,
      animal: zzAnimal.name,
      quizResults: [{ question: stageQ.question || zzAnimal.question, correctOnFirstAttempt: mcqFirstOk === true, missionType: 'zoosnooz' }],
      quizCorrect: mcqFirstOk === true,
      observation: obsText,
      observationNotes: obsText,
      observationScore: { behaviour: obsScore.behaviour, detail: obsScore.detail, writing: obsScore.writing, rationale: obsScore.rationale, overallFeedback: obsScore.overallFeedback },
      videoTitle,
      conservationMsg,
      nightVisionUsed: nightVision,
      completed: true,
      timestamp: new Date().toISOString(),
    };
    setZzCompleted(prev => {
      const next = { ...prev, [zzAnimal.id]: badgeData };
      // Compute badge popup data
      const obsSum = (obsScore.behaviour||0) + (obsScore.detail||0) + (obsScore.writing||0);
      const animalPoints = Math.round((obsSum / 15) * 100) + (mcqFirstOk ? 20 : 0);
      const newTotalDone = ZOOSNOOZ_ANIMALS.filter(a => a.id === zzAnimal.id || prev[a.id]).length;
      const prevTotal = Object.entries(prev).reduce((s, [id, b]) => {
        if (id === zzAnimal.id) return s;
        const o = b.observationScore || {};
        return s + Math.round(((o.behaviour||0)+(o.detail||0)+(o.writing||0))/15*100) + (b.quizResults?.[0]?.correctOnFirstAttempt ? 20 : 0);
      }, 0);
      setZzBadgeAnimal({ animal: zzAnimal, points: animalPoints, quizCorrect: mcqFirstOk === true, totalDone: newTotalDone, runningTotal: prevTotal + animalPoints, observationScore: { behaviour: obsScore.behaviour, detail: obsScore.detail, writing: obsScore.writing, rationale: obsScore.rationale, overallFeedback: obsScore.overallFeedback } });
      return next;
    });
    setZzVideoTitle('');
    setZzConservationMsg('');
    setNightVision(false);
    if (studentName && classCode) {
      const code = normaliseCode(classCode);
      const sid  = safeStudentId(studentName);
      try {
        await setDoc(doc(db, 'classes', code, 'students', sid),
          { [`zoosnooz.${zzAnimal.id}`]: { completed: true, ...badgeData, videoCompleted: !!videoURL, updatedAt: serverTimestamp() } },
          { merge: true }
        );
      } catch (e) { console.warn('Badge write:', e); }
    }
    setZzScreen('map');
  }, [zzAnimal, classStage, obsText, mcqFirstOk, zzVideoTitle, zzConservationMsg, zzVideoURLs, studentName, classCode, setZzScreen]);

  // ── Start recording ────────────────────────────────────────────────────────
  const zzStartRecording = useCallback(() => {
    const videoEl = zzVideoRef.current;
    if (!videoEl || !videoEl.srcObject) return;
    zzChunksRef.current = [];

    const MIME_CANDIDATES = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4;codecs=h264,aac',
      'video/mp4;codecs=h264',
      'video/mp4',
    ];
    const mimeType    = MIME_CANDIDATES.find(t => { try { return MediaRecorder.isTypeSupported(t); } catch(e) { return false; } }) || '';
    const isMP4       = mimeType.includes('mp4');
    const blobType    = mimeType || 'video/webm';
    const fileExt     = isMP4 ? 'mp4' : 'webm';
    const contentType = isMP4 ? 'video/mp4' : 'video/webm';

    const recordStream = videoEl.srcObject;
    const mrOptions = { videoBitsPerSecond: 2000000 };
    if (mimeType) mrOptions.mimeType = mimeType;

    let mr;
    try {
      mr = new MediaRecorder(recordStream, mrOptions);
    } catch(e) {
      console.warn('MediaRecorder init failed:', e);
      return;
    }
    mr.ondataavailable = e => { if (e.data.size > 0) zzChunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(zzChunksRef.current, { type: blobType });
      if (blob.size < 500) {
        alert('Recording failed - no video was captured. Please try again.');
        setZzRecording(false);
        return;
      }
      const localUrl = URL.createObjectURL(blob);
      const animalId = zzAnimal?.id;
      if (animalId) setZzVideoURLs(prev => ({ ...prev, [animalId]: localUrl }));
      setZzRecording(false);
      setZzPhase('preview');

      // Upload to Firebase Storage in background
      if (!studentName || !classCode || !animalId) return;
      try {
        const safeStudent = studentName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
        const safeCode    = normaliseCode(classCode);
        const path        = `zoosnooz/${safeCode}/${safeStudent}/${animalId}.${fileExt}`;
        const sRef        = storageRef(storage, path);
        const uploadTask  = uploadBytesResumable(sRef, blob, { contentType });
        setZzUploadProgress(prev => ({ ...prev, [animalId]: 0 }));

        const stuckTimer = setTimeout(() => {
          setZzUploadProgress(prev => {
            if (prev[animalId] === 0) {
              console.warn('ZZ upload stuck - check Firebase Storage rules for zoosnooz/ path');
              return { ...prev, [animalId]: 'error' };
            }
            return prev;
          });
        }, 12000);

        uploadTask.on('state_changed',
          snap => {
            const pct = snap.totalBytes > 0 ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100) : 0;
            if (pct > 0) clearTimeout(stuckTimer);
            setZzUploadProgress(prev => ({ ...prev, [animalId]: pct }));
          },
          err => {
            clearTimeout(stuckTimer);
            console.warn('ZZ video upload error:', err.code, err.message);
            setZzUploadProgress(prev => ({ ...prev, [animalId]: 'error' }));
          },
          async () => {
            clearTimeout(stuckTimer);
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const code = normaliseCode(classCode);
              const sid  = safeStudentId(studentName);
              await setDoc(doc(db, 'classes', code, 'students', sid),
                { [`zoosnooz.${animalId}.videoURL`]: downloadURL, [`zoosnooz.${animalId}.videoCompleted`]: true },
                { merge: true }
              );
              setZzUploadProgress(prev => ({ ...prev, [animalId]: 'done' }));
            } catch(e) {
              console.warn('ZZ getDownloadURL error:', e);
              setZzUploadProgress(prev => ({ ...prev, [animalId]: 'error' }));
            }
          }
        );
      } catch(e) {
        console.warn('ZZ upload init error:', e);
        setZzUploadProgress(prev => ({ ...prev, [zzAnimal?.id]: 'error' }));
      }
    };

    mr.start(500);
    zzMediaRef.current = mr;
    setZzRecording(true);
    setZzCountdown(10);
    zzCountdownRef.current = setInterval(() => {
      setZzCountdown(c => {
        if (c <= 1) {
          clearInterval(zzCountdownRef.current);
          if (zzMediaRef.current && zzMediaRef.current.state !== 'inactive') zzMediaRef.current.stop();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, [zzAnimal, studentName, classCode]);

  // ── Stop recording ─────────────────────────────────────────────────────────
  const zzStopRecording = useCallback(() => {
    clearInterval(zzCountdownRef.current);
    if (zzMediaRef.current && zzMediaRef.current.state !== 'inactive') zzMediaRef.current.stop();
    setZzRecording(false);
  }, []);

  // ── Start lion mic recording ───────────────────────────────────────────────
  const zzStartMic = useCallback(() => {
    if (lionMonitoring || interDone) return;
    setLionMonitoring(true);
    soundSampRef.current = [];
    setLionHistory([]);
    setLionPeak(0);
    lionPeakRef.current = 0;
    clearInterval(lionSampIntervalRef.current);
    lionSampIntervalRef.current = setInterval(() => {
      const lv = soundSampRef.current.length > 0
        ? soundSampRef.current[soundSampRef.current.length - 1] : 0;
      if (lv > lionPeakRef.current) { lionPeakRef.current = lv; setLionPeak(lv); }
      setLionHistory(h => [...h, lv].slice(0, 60));
    }, 500);
  }, [lionMonitoring, interDone]);

  // ── Start binturong night scanner ──────────────────────────────────────────
  const zzBintuStart = useCallback(() => {
    if (bintuScanning || bintuDone) return;
    const vid = lightVidRef.current;
    if (!vid?.srcObject) { setBintuError(true); return; }
    setBintuScanning(true);
    setBintuReadings([]);
    const readings = [];
    let peak = 0, min = 255;
    const startAt = Date.now();
    const DURATION_MS = 20000;
    const sc = document.createElement('canvas');
    sc.width = 64; sc.height = 48;
    const sctx = sc.getContext('2d');
    clearInterval(bintuIntervalRef.current);
    bintuIntervalRef.current = setInterval(() => {
      try {
        sctx.drawImage(vid, 0, 0, 64, 48);
        const px = sctx.getImageData(0, 0, 64, 48).data;
        let sum = 0;
        for (let i = 0; i < px.length; i += 4) sum += 0.299*px[i] + 0.587*px[i+1] + 0.114*px[i+2];
        const b = Math.round(sum / (64*48));
        readings.push(b);
        if (b > peak) peak = b;
        if (b < min) min = b;
        const ci = Math.max(0, 100 - Math.round((b/255)*100));
        const elapsed = Date.now() - startAt;
        const secsLeft = Math.max(0, 20 - Math.floor(elapsed/1000));
        setBintuBrightness(b); setBintuCamIdx(ci);
        setBintuPeak(peak); setBintuMin(min);
        setBintuReadings([...readings]);
        setInterTimer(secsLeft);
        if (elapsed >= DURATION_MS) {
          clearInterval(bintuIntervalRef.current);
          lightStreamRef.current?.getTracks().forEach(t => t.stop());
          setBintuScanning(false);
          setBintuDone(true);
          setInterDone(true);
        }
      } catch(ex) {}
    }, 400);
  }, [bintuScanning, bintuDone]);

  // ── Complete session ───────────────────────────────────────────────────────
  const completeSession = useCallback(() => {
    if (Object.keys(zzCompleted).length === 0) { alert('Complete at least one animal mission first.'); return; }
    const hasVideos = ZOOSNOOZ_ANIMALS.some(a => zzVideoURLs[a.id]);
    const msg = hasVideos
      ? 'Create your ZooSnooz documentary?\n\nYour clips will be stitched together. You can preview before submitting.'
      : 'Submit your ZooSnooz session?\n\nYour scores will be locked in.';
    if (!window.confirm(msg)) return;
    // Create AudioContext synchronously inside the gesture so iOS unlocks audio
    try {
      const actx = new (window.AudioContext || window.webkitAudioContext)();
      actx.resume();
      zzAudioCtxRef.current = actx;
    } catch(e) { zzAudioCtxRef.current = null; }
    zzStitchDataRef.current = { videoURLs: { ...zzVideoURLs }, completed: { ...zzCompleted } };
    setZzStitchPhase('stitching');
    setZzStitchProgress(0);
    setZzStitchAnimalIdx(-1);
    setZzStitchedURL(null);
    zzStitchedBlobRef.current = null;
    setZzScreen('stitch');
  }, [zzCompleted, zzVideoURLs, setZzScreen]);

  // ── Canvas stitching effect ────────────────────────────────────────────────
  useEffect(() => {
    if (zzScreen !== 'stitch' || zzStitchPhase !== 'stitching') return;
    let cancelled = false;
    const { videoURLs, completed } = zzStitchDataRef.current;
    const videosToStitch = ZOOSNOOZ_ANIMALS.filter(a => videoURLs[a.id]);

    (async () => {
      const W = 720, H = 1280;
      const cvs = document.createElement('canvas');
      cvs.width = W; cvs.height = H;
      const ctx = cvs.getContext('2d');
      ctx.fillStyle = '#020D06'; ctx.fillRect(0, 0, W, H);
      const canvasStream = cvs.captureStream(30);

      const logoImg = await new Promise(res => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = () => res(null);
        img.src = 'images/logo.png';
      });

      // Load custom fonts into canvas context
      try {
        const hf = new FontFace('Taronga Headline', 'url(images/TarongaHeadline-Regular.ttf)');
        await hf.load();
        document.fonts.add(hf);
      } catch(e) {}
      await document.fonts.load('400 28px "DM Sans"').catch(() => {});

      function drawLogoCircle(cx, cy, size) {
        if (!logoImg) return;
        const r = size / 2;
        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(logoImg, cx - r, cy - r, size, size);
        ctx.restore();
        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(46,125,85,0.85)'; ctx.lineWidth = 6;
        ctx.stroke();
        ctx.restore();
      }
      function drawBg() {
        const bg = ctx.createLinearGradient(0,0,W,H);
        bg.addColorStop(0,'#020D06'); bg.addColorStop(0.5,'#040F08'); bg.addColorStop(1,'#071E14');
        ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
      }

      // Audio
      let audioCtx = zzAudioCtxRef.current;
      let audioDest = null;
      const audioDecodedBuffers = {};
      try {
        if (!audioCtx || audioCtx.state === 'closed') audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        await audioCtx.resume().catch(() => {});
      } catch(e) { audioCtx = null; }
      if (audioCtx && audioCtx.state === 'running') {
        try {
          audioDest = audioCtx.createMediaStreamDestination();
          const silBuf = audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
          const silNode = audioCtx.createBufferSource();
          silNode.buffer = silBuf; silNode.loop = true;
          silNode.connect(audioDest); silNode.start();
          await Promise.all(videosToStitch.map(async a => {
            try {
              const resp = await fetch(videoURLs[a.id]);
              const ab = await resp.arrayBuffer();
              audioDecodedBuffers[a.id] = await audioCtx.decodeAudioData(ab);
            } catch(e) {}
          }));
        } catch(e) { audioDest = null; }
      }

      const recordStream = audioDest
        ? new MediaStream([...canvasStream.getVideoTracks(), ...audioDest.stream.getAudioTracks()])
        : canvasStream;

      const MIME_CANDIDATES = ['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm','video/mp4'];
      const mimeType = MIME_CANDIDATES.find(t => { try { return MediaRecorder.isTypeSupported(t); } catch(e) { return false; } }) || '';
      const blobType = mimeType || 'video/webm';

      const chunks = [];
      let mr;
      try {
        const opts = { videoBitsPerSecond: 1_000_000 };
        if (mimeType) opts.mimeType = mimeType;
        mr = new MediaRecorder(recordStream, opts);
      } catch(e) {
        if (!cancelled) setZzStitchPhase('preview');
        return;
      }
      mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      mr.onstop = () => {
        if (cancelled) return;
        const blob = new Blob(chunks, { type: blobType });
        zzStitchedBlobRef.current = blob;
        if (blob.size > 1000) setZzStitchedURL(URL.createObjectURL(blob));
        setZzStitchProgress(100);
        setZzStitchPhase('preview');
      };
      mr.start(500);
      await new Promise(res => setTimeout(res, 80)); // let MediaRecorder settle before first frame

      const wait = ms => new Promise(res => setTimeout(res, ms));
      // Redraws drawFn at rAF rate for ms milliseconds - ensures captureStream gets frames for static cards
      const drawCardFor = (drawFn, ms) => new Promise(resolve => {
        if (cancelled) { resolve(); return; }
        const end = performance.now() + ms;
        let raf, settled = false;
        function finish() { if (!settled) { settled = true; resolve(); } }
        function tick() {
          if (cancelled) { finish(); return; }
          drawFn();
          if (performance.now() < end) { raf = requestAnimationFrame(tick); } else { finish(); }
        }
        tick();
        setTimeout(finish, ms + 200);
      });
      const TOTAL = videosToStitch.length + 2;

      // Intro card (3s)
      setZzStitchProgress(0);
      if (!cancelled) {
        const logoY = H * 0.32;
        const dateStr = new Date().toLocaleDateString('en-AU',{day:'2-digit',month:'long',year:'numeric'}).toUpperCase();
        await drawCardFor(() => {
          drawBg();
          [[0.12,0.08],[0.88,0.06],[0.35,0.14],[0.65,0.11],[0.78,0.19],[0.22,0.22]].forEach(([sx,sy]) => {
            ctx.fillStyle = 'rgba(255,255,255,0.55)';
            ctx.beginPath(); ctx.arc(sx*W, sy*H, 1.5, 0, Math.PI*2); ctx.fill();
          });
          const glow = ctx.createRadialGradient(W/2, logoY, 0, W/2, logoY, 340);
          glow.addColorStop(0,'rgba(46,125,85,0.32)'); glow.addColorStop(1,'rgba(46,125,85,0)');
          ctx.fillStyle = glow; ctx.fillRect(0,0,W,H);
          drawLogoCircle(W/2, logoY, 280);
          ctx.textAlign = 'center';
          ctx.fillStyle = 'white'; ctx.font = 'bold 80px "Taronga Headline", sans-serif';
          ctx.fillText('ZOOSNOOZ', W/2, H * 0.62);
          ctx.fillStyle = '#4A9E6B'; ctx.font = 'bold 48px "Taronga Headline", sans-serif';
          ctx.fillText('DOCUMENTARY', W/2, H * 0.62 + 70);
          ctx.save(); ctx.strokeStyle = 'rgba(46,125,85,0.45)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(W/2-180, H*0.62+104); ctx.lineTo(W/2+180, H*0.62+104); ctx.stroke(); ctx.restore();
          ctx.fillStyle = 'rgba(168,196,178,0.7)'; ctx.font = '400 26px "DM Sans", sans-serif';
          ctx.fillText('Taronga Zoo Sydney', W/2, H * 0.62 + 144);
          ctx.fillStyle = 'rgba(168,196,178,0.45)'; ctx.font = '400 20px "DM Sans", sans-serif';
          ctx.fillText(dateStr, W/2, H * 0.88);
          ctx.textAlign = 'left';
        }, 3000);
      }

      // Per-animal
      for (let i = 0; i < videosToStitch.length; i++) {
        if (cancelled) break;
        const animal = videosToStitch[i];
        setZzStitchAnimalIdx(i);
        setZzStitchProgress(Math.round(((i + 1) / TOTAL) * 100));

        // Entry card (3s) - measure name size once before the rAF loop
        const bandY = H/2 - 190, bandH = 380;
        let nameSize = 72;
        ctx.font = `bold ${nameSize}px "Taronga Headline", sans-serif`;
        while (ctx.measureText(animal.name).width > W - 80 && nameSize > 36) { nameSize -= 4; ctx.font = `bold ${nameSize}px "Taronga Headline", sans-serif`; }
        const finalNameSize = nameSize;
        await drawCardFor(() => {
          drawBg();
          ctx.fillStyle = 'rgba(26,82,56,0.40)'; ctx.fillRect(0, bandY, W, bandH);
          ctx.save(); ctx.strokeStyle = 'rgba(46,125,85,0.65)'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(0,bandY); ctx.lineTo(W,bandY); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0,bandY+bandH); ctx.lineTo(W,bandY+bandH); ctx.stroke(); ctx.restore();
          const entryGlow = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,260);
          entryGlow.addColorStop(0,'rgba(46,125,85,0.18)'); entryGlow.addColorStop(1,'rgba(46,125,85,0)');
          ctx.fillStyle = entryGlow; ctx.fillRect(0,bandY,W,bandH);
          ctx.textAlign = 'center';
          ctx.fillStyle = '#A8C4B2'; ctx.font = '400 30px "DM Sans", sans-serif';
          ctx.fillText(`Animal ${i+1} of ${videosToStitch.length}`, W/2, H/2 - 115);
          ctx.fillStyle = 'white'; ctx.font = `bold ${finalNameSize}px "Taronga Headline", sans-serif`;
          ctx.fillText(animal.name, W/2, H/2 + 10);
          ctx.fillStyle = '#A8C4B2'; ctx.font = 'italic 28px "DM Sans", sans-serif';
          ctx.fillText(animal.scientificName || '', W/2, H/2 + 80);
          ctx.fillStyle = 'rgba(168,196,178,0.35)'; ctx.font = '400 24px "DM Sans", sans-serif';
          ctx.fillText('🌙 ZooSnooz', W/2, bandY + bandH - 22);
          ctx.textAlign = 'left';
        }, 3000);

        // Video playback to canvas
        if (cancelled) break;
        const videoSrc = videoURLs[animal.id];
        if (videoSrc) {
          const badge = completed[animal.id];
          const nvUsed = badge?.nightVisionUsed || false;
          const videoTitle = badge?.videoTitle || animal.name;
          const conservMsg = badge?.conservationMsg || '';
          const topH = 80, botH = 260, vidY = topH, vidH = H - topH - botH, botY = topH + vidH;
          const rCX = W - 80, textMaxW = rCX - 40 - 26;
          const dStr = new Date().toLocaleDateString('en-AU',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase();

          await new Promise(resolve => {
            const videoEl = document.createElement('video');
            videoEl.src = videoSrc; videoEl.playsInline = true; videoEl.muted = true; videoEl.preload = 'auto';
            let rafId = null, abSrc = null, lastFrameTime = 0;
            const guard = setTimeout(() => { cleanup(); resolve(); }, 15000);
            function cleanup() {
              clearTimeout(guard);
              if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
              if (abSrc) { try { abSrc.stop(); abSrc.disconnect(); } catch(e) {} abSrc = null; }
            }
            if (audioDest && audioDecodedBuffers[animal.id]) {
              try { abSrc = audioCtx.createBufferSource(); abSrc.buffer = audioDecodedBuffers[animal.id]; abSrc.connect(audioDest); abSrc.start(); } catch(e) { abSrc = null; }
            }
            function drawFrame() {
              if (cancelled || videoEl.ended) { cleanup(); resolve(); return; }
              if (videoEl.paused) { rafId = requestAnimationFrame(drawFrame); return; }
              const now = performance.now();
              if (now - lastFrameTime < 33) { rafId = requestAnimationFrame(drawFrame); return; } // ~30fps cap
              lastFrameTime = now;
              drawBg();
              try {
                const vW = videoEl.videoWidth || W, vH2 = videoEl.videoHeight || vidH;
                const tgtA = W / vidH, srcA = vW / vH2;
                let sx, sy, sw, sh;
                if (srcA > tgtA) { sh = vH2; sw = sh*tgtA; sx = (vW-sw)/2; sy = 0; }
                else { sw = vW; sh = sw/tgtA; sx = 0; sy = (vH2-sh)/2; }
                if (nvUsed) {
                  ctx.filter = 'grayscale(1) brightness(1.6) contrast(1.9) sepia(1) hue-rotate(80deg) saturate(3)';
                  ctx.drawImage(videoEl, sx, sy, sw, sh, 0, vidY, W, vidH); ctx.filter = 'none';
                  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.08;
                  ctx.fillStyle = '#00E63C'; ctx.fillRect(0, vidY, W, vidH); ctx.restore();
                } else {
                  ctx.drawImage(videoEl, sx, sy, sw, sh, 0, vidY, W, vidH);
                }
              } catch(e) {}
              ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0,0,W,topH);
              ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(0,topH); ctx.lineTo(W,topH); ctx.stroke();
              ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.font = '600 22px "DM Sans", sans-serif'; ctx.textAlign = 'left';
              ctx.fillText('Taronga Zoo Sydney', 24, topH/2 + 8);
              ctx.fillStyle = 'rgba(255,255,255,0.48)'; ctx.font = '400 20px "DM Sans", sans-serif'; ctx.textAlign = 'right';
              ctx.fillText(dStr, W-24, topH/2 + 8);
              ctx.fillStyle = 'rgba(6,8,6,0.98)'; ctx.fillRect(0, botY, W, botH);
              ctx.strokeStyle = 'rgba(46,125,85,0.3)'; ctx.lineWidth = 2;
              ctx.beginPath(); ctx.moveTo(0,botY); ctx.lineTo(W,botY); ctx.stroke();
              if (logoImg) {
                const lH = 55, lW = logoImg.naturalWidth ? Math.round(logoImg.naturalWidth*(lH/logoImg.naturalHeight)) : lH;
                ctx.save(); ctx.filter = 'brightness(0) invert(1)'; ctx.globalAlpha = 0.8;
                ctx.drawImage(logoImg, rCX-lW/2, botY+18, lW, lH); ctx.restore();
              }
              ctx.fillStyle = 'rgba(168,196,178,0.6)'; ctx.font = '400 15px "DM Sans", sans-serif'; ctx.textAlign = 'center';
              ctx.fillText('#ZooSnooz', rCX, botY + 90); ctx.fillText('#TarongaTracka', rCX, botY + 110);
              ctx.textAlign = 'left';
              ctx.fillStyle = 'white'; ctx.font = 'bold 44px "Taronga Headline", sans-serif';
              ctx.fillText('I WENT TO ZOOSNOOZ!', 24, botY + 55);
              ctx.fillStyle = '#A8C4B2'; ctx.font = '600 22px "DM Sans", sans-serif';
              let t = videoTitle;
              while (ctx.measureText(t).width > textMaxW && t.length > 1) t = t.slice(0,-1);
              if (t !== videoTitle) t += '…';
              ctx.fillText(t, 24, botY + 88);
              if (conservMsg) {
                ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = 'italic 17px "DM Sans", sans-serif';
                const words = ('"' + conservMsg + '"').split(' ');
                let line = '', lineY = botY + 118;
                for (const w of words) {
                  const test = line ? line + ' ' + w : w;
                  if (ctx.measureText(test).width > textMaxW && line) { ctx.fillText(line, 24, lineY); line = w; lineY += 22; }
                  else { line = test; }
                }
                if (line) ctx.fillText(line, 24, lineY);
              }
              rafId = requestAnimationFrame(drawFrame);
            }
            videoEl.onended = () => { cleanup(); resolve(); };
            videoEl.onerror = () => { cleanup(); resolve(); };
            videoEl.oncanplay = () => {
              videoEl.play().then(() => { rafId = requestAnimationFrame(drawFrame); }).catch(() => { cleanup(); resolve(); });
            };
            videoEl.load();
          });
        }
        setZzStitchProgress(Math.round(((i + 2) / TOTAL) * 100));
      }

      // Outro card (2s)
      if (!cancelled) {
        setZzStitchAnimalIdx(videosToStitch.length);
        const outroLogoY = H * 0.24;
        await drawCardFor(() => {
          drawBg();
          const outroGlow = ctx.createRadialGradient(W/2, outroLogoY, 0, W/2, outroLogoY, 320);
          outroGlow.addColorStop(0,'rgba(46,125,85,0.28)'); outroGlow.addColorStop(1,'rgba(46,125,85,0)');
          ctx.fillStyle = outroGlow; ctx.fillRect(0,0,W,H);
          drawLogoCircle(W/2, outroLogoY, 260);
          ctx.textAlign = 'center';
          ctx.fillStyle = '#A8C4B2'; ctx.font = '400 36px "DM Sans", sans-serif';
          ctx.fillText('Thank you for exploring', W/2, outroLogoY + 185);
          ctx.save(); ctx.strokeStyle = 'rgba(168,196,178,0.3)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(W/2-200, outroLogoY+232); ctx.lineTo(W/2+200, outroLogoY+232); ctx.stroke(); ctx.restore();
          ctx.fillStyle = 'white'; ctx.font = 'bold 66px "Taronga Headline", sans-serif';
          ctx.fillText('Taronga Zoo', W/2, H * 0.65); ctx.fillText('Sydney', W/2, H * 0.65 + 90);
          ctx.fillStyle = 'rgba(168,196,178,0.50)'; ctx.font = '400 26px "DM Sans", sans-serif';
          ctx.fillText('#ZooSnooz  #TarongaTracka', W/2, H * 0.88);
          ctx.textAlign = 'left';
        }, 2000);
      }

      if (mr.state !== 'inactive') { try { mr.requestData(); mr.stop(); } catch(e) {} }
    })();

    return () => { cancelled = true; };
  }, [zzScreen, zzStitchPhase]);

  // ── Final submit ──────────────────────────────────────────────────────────
  const zzFinalSubmit = useCallback(async () => {
    if (zzSessionDone) return;
    setZzStitchPhase('submitting');
    const { completed: completedSnap, videoURLs: videoURLsSnap } = zzStitchDataRef.current;
    try {
      const code = normaliseCode(classCode);
      const sid  = safeStudentId(studentName);
      let docURL = null;

      if (zzStitchedBlobRef.current) {
        try {
          const blob = zzStitchedBlobRef.current;
          const blobType = blob.type || 'video/webm';
          const ext = blobType.includes('mp4') ? 'mp4' : 'webm';
          const sRef = storageRef(storage, `zoosnooz/${code}/${sid}/documentary.${ext}`);
          const task = uploadBytesResumable(sRef, blob, { contentType: blobType });
          await new Promise((res, rej) => task.on('state_changed', null, rej, res));
          docURL = await getDownloadURL(task.snapshot.ref);
        } catch(e) { console.warn('ZZ documentary upload error:', e); }
      }

      const allBadges = Object.values(completedSnap);
      const totalPts  = allBadges.reduce((s, b) => {
        const o = b.observationScore || {};
        return s + Math.round(((o.behaviour||0)+(o.detail||0)+(o.writing||0))/15*100) + (b.quizResults||[]).filter(q=>q.correctOnFirstAttempt).length * 20;
      }, 0);
      const quizCorrect = allBadges.filter(b => b.quizResults?.[0]?.correctOnFirstAttempt === true).length;
      const quizPercentage = allBadges.length ? Math.round((quizCorrect / allBadges.length) * 100) : 0;
      const animalSummary = ZOOSNOOZ_ANIMALS.map(a => {
        const b = completedSnap[a.id]; const obs = b?.observationScore || {};
        const obsSum = (obs.behaviour||0)+(obs.detail||0)+(obs.writing||0);
        return { id: a.id, name: a.name, points: b ? Math.round((obsSum/15)*100)+(b.quizResults?.[0]?.correctOnFirstAttempt?20:0) : 0, completed:!!b, videoCompleted:!!(videoURLsSnap[a.id]) };
      });

      const studentPayload = {
        name: studentName, classCode: code, sessionType: 'zoosnooz',
        zzSessionComplete: true, completed: true,
        zzTotalPoints: totalPts, zzBadges: allBadges, zzAnimalSummary: animalSummary,
        quizPercentage, status: 'complete', completedAt: serverTimestamp(),
      };
      if (docURL) studentPayload.zzDocumentaryURL = docURL;
      await setDoc(doc(db, 'classes', code, 'students', sid), studentPayload, { merge: true });

      const portalEntry = {
        studentName: studentName.trim(), classCode: code, createdAt: serverTimestamp(),
        zzTotalPoints: totalPts,
        animals: ZOOSNOOZ_ANIMALS.map(a => {
          const b = completedSnap[a.id];
          return { id:a.id, name:a.name, image:a.image, completed:!!b, videoURL: videoURLsSnap[a.id]||null, obsNotes: b?.observation||'' };
        }),
      };
      if (docURL) portalEntry.documentaryURL = docURL;
      await setDoc(doc(db, 'zoosnooz_docs', `${code}_${sid}`), portalEntry, { merge: true });

      if (docURL) {
        try {
          const q = query(collection(db, 'zoosnooz_docs'), where('classCode','==',code), where('studentName','==',studentName.trim()));
          const snap = await getDocs(q);
          snap.forEach(d => { setDoc(d.ref, { documentaryURL: docURL }, { merge: true }).catch(()=>{}); });
        } catch(e) { console.warn('ZZ NFC stamp error:', e); }
      }

      setZzSessionDone(true);
      setZzStitchPhase('done');
    } catch(e) {
      console.warn('ZZ final submit error:', e);
      setZzStitchPhase('preview');
      alert('Submission failed: ' + e.message + '\n\nCheck your connection and try again.');
    }
  }, [zzSessionDone, classCode, studentName]);

  // ── Sketch handlers ────────────────────────────────────────────────────────
  const sketchPointerDown = (e) => {
    setIsDrawing(true);
    const rect = sketchRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    sketchLastRef.current = { x, y };
    e.preventDefault();
  };
  const sketchPointerMove = (e) => {
    if (!isDrawing || !sketchRef.current) return;
    const rect = sketchRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const ctx = sketchRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(sketchLastRef.current.x, sketchLastRef.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#4ADE80'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.stroke();
    sketchLastRef.current = { x, y };
    setHasDrawn(true);
    e.preventDefault();
  };
  const sketchPointerUp = () => setIsDrawing(false);

  // ── Haptic handlers ────────────────────────────────────────────────────────
  const hapticPointerMove = useCallback((e) => {
    if (!hapticDragRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));
    setHapticPos(prev => {
      const dx = x - prev.x, dy = y - prev.y;
      setHapticDist(d => d + Math.sqrt(dx*dx + dy*dy));
      return { x, y };
    });
    setHasDrawn(true);
    e.preventDefault();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // STITCH / DOCUMENTARY VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (zzScreen === 'stitch') {
    const { videoURLs: vURLs, completed: comp } = zzStitchDataRef.current;
    const vidsToStitch = ZOOSNOOZ_ANIMALS.filter(a => vURLs[a.id]);
    const zzPts = Object.values(comp).reduce((s, b) => {
      const o = b.observationScore||{}; return s + Math.round(((o.behaviour||0)+(o.detail||0)+(o.writing||0))/15*100) + (b.quizResults?.[0]?.correctOnFirstAttempt?20:0);
    }, 0);

    if (zzStitchPhase === 'done') {
      return (
        <ZzDoneScreen
          classCode={classCode}
          studentName={studentName}
          onDone={() => { clearStudentSession(); setCompletionCardDismissed(true); setCurrentScreen('home'); setSessionType('standard'); }}
        />
      );
    }

    if (zzStitchPhase === 'stitching') {
      return (
        <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#020D06,#040F08,#071E14)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', color:'white' }}>
          <div style={{ maxWidth:'400px', width:'100%', textAlign:'center' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'1.25rem' }}>🎬</div>
            <h2 className="taronga-title" style={{ fontSize:'1.6rem', letterSpacing:'0.06em', marginBottom:'0.4rem' }}>Creating Documentary</h2>
            <p style={{ color:'#4A9E6B', fontSize:'0.82rem', marginBottom:'2rem' }}>
              {zzStitchAnimalIdx >= 0 && zzStitchAnimalIdx < vidsToStitch.length
                ? `Processing: ${vidsToStitch[zzStitchAnimalIdx].name}…`
                : 'Preparing…'}
            </p>
            <div style={{ background:'rgba(46,125,85,0.15)', borderRadius:'999px', height:'8px', overflow:'hidden', marginBottom:'1.5rem', border:'1px solid rgba(46,125,85,0.2)' }}>
              <div style={{ height:'100%', width:`${zzStitchProgress}%`, background:'linear-gradient(90deg,#2E7D55,#4A9E6B)', borderRadius:'999px', transition:'width 0.4s ease' }} />
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:'0.65rem', flexWrap:'wrap' }}>
              {vidsToStitch.map((animal, i) => {
                const done   = i < zzStitchAnimalIdx;
                const active = i === zzStitchAnimalIdx;
                return (
                  <div key={animal.id} style={{ opacity: done||active ? 1 : 0.35, transition:'opacity 0.3s' }}>
                    <div style={{ width:'52px', height:'52px', borderRadius:'12px', overflow:'hidden', border:`2px solid ${done?'#2E7D55':active?'#4A9E6B':'rgba(255,255,255,0.1)'}`, boxShadow:active?'0 0 12px rgba(168,196,178,0.7)':'none', transition:'all 0.3s', position:'relative' }}>
                      <img src={animal.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      {done && <div style={{ position:'absolute', inset:0, background:'rgba(46,125,85,0.55)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>✓</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ marginTop:'2rem', fontSize:'0.72rem', color:'rgba(168,196,178,0.45)' }}>Keep this screen open while your documentary is being created</p>
          </div>
        </div>
      );
    }

    // preview (and submitting)
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#020D06,#040F08,#071E14)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <div style={{ maxWidth:'500px', margin:'0 auto', width:'100%', padding:'1.5rem 1.25rem 3rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div>
            <div style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(168,196,178,0.6)', textTransform:'uppercase', letterSpacing:'0.16em', marginBottom:'0.3rem' }}>Your ZooSnooz Documentary</div>
            <h2 className="taronga-title" style={{ fontSize:'1.7rem', color:'white', letterSpacing:'0.05em', margin:0 }}>Preview</h2>
          </div>
          {zzStitchedURL ? (
            <div style={{ borderRadius:'18px', overflow:'hidden', background:'#000', boxShadow:'0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(46,125,85,0.3)', aspectRatio:'9/16', maxHeight:'55vh' }}>
              <video src={zzStitchedURL} controls playsInline autoPlay
                style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
            </div>
          ) : (
            <div style={{ borderRadius:'18px', background:'rgba(46,125,85,0.08)', border:'1px solid rgba(46,125,85,0.25)', padding:'2rem', textAlign:'center' }}>
              <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>🎬</div>
              <p style={{ color:'#4A9E6B', fontSize:'0.88rem', margin:0, lineHeight:1.5 }}>
                {vidsToStitch.length === 0 ? 'No videos were recorded this session.' : 'Video stitching is not supported on this device. Your individual clips have been saved.'}
              </p>
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.6rem' }}>
            {[
              { label:'Animals', value:`${Object.keys(comp).length}/${ZOOSNOOZ_ANIMALS.length}` },
              { label:'Videos',  value:`${vidsToStitch.length}/${ZOOSNOOZ_ANIMALS.length}` },
              { label:'Points',  value: zzPts },
            ].map(s => (
              <div key={s.label} style={{ background:'rgba(46,125,85,0.1)', border:'1px solid rgba(46,125,85,0.2)', borderRadius:'12px', padding:'0.75rem 0.5rem', textAlign:'center' }}>
                <div style={{ fontSize:'1.2rem', fontWeight:800, color:'#A8C4B2' }}>{s.value}</div>
                <div style={{ fontSize:'0.6rem', color:'rgba(168,196,178,0.55)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:'0.15rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <button onClick={zzFinalSubmit} disabled={zzStitchPhase === 'submitting'}
            style={{ width:'100%', padding:'1rem', background: zzStitchPhase==='submitting' ? 'rgba(46,125,85,0.4)' : 'linear-gradient(135deg,#2E7D55,#4C1D95)', border:'none', borderRadius:'var(--t-r-pill)', color:'white', fontSize:'1rem', fontWeight:800, cursor: zzStitchPhase==='submitting' ? 'wait' : 'pointer', textTransform:'uppercase', letterSpacing:'0.09em', boxShadow:'0 6px 20px rgba(46,125,85,0.5)', opacity: zzStitchPhase==='submitting' ? 0.7 : 1, transition:'all 0.2s' }}>
            {zzStitchPhase === 'submitting' ? 'Submitting…' : '✓ Submit Documentary'}
          </button>
          <button onClick={() => setZzScreen('map')}
            style={{ width:'100%', padding:'0.7rem', background:'transparent', border:'1px solid rgba(46,125,85,0.3)', borderRadius:'var(--t-r-pill)', color:'rgba(184,212,192,0.6)', fontSize:'0.85rem', cursor:'pointer' }}>
            ← Back to map (submit later)
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // COLLECTION VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (zzScreen === 'collection') {
    const zzTotalPointsColl = Object.values(zzCompleted).reduce((sum, b) => {
      const o = b.observationScore || {};
      return sum + Math.round(((o.behaviour||0)+(o.detail||0)+(o.writing||0))/15*100) + (b.quizResults?.[0]?.correctOnFirstAttempt ? 20 : 0);
    }, 0);
    const totalDoneColl = Object.keys(zzCompleted).length;

    return (
      <div style={{ minHeight:'100vh', background:'#020D06', color:'white', paddingBottom:'2rem' }}>
        {/* Header */}
        <div style={{ background:'linear-gradient(to bottom,rgba(0,20,8,0.98),rgba(2,13,6,0.95))', borderBottom:'1px solid rgba(74,158,107,0.2)', padding:'0.75rem 1rem', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(12px)' }}>
          <button onClick={() => setZzScreen('map')}
            style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(168,196,178,0.25)', color:'white', padding:'0.45rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>
            ← Back
          </button>
          <h1 className="taronga-title" style={{ fontSize:'1.4rem', color:'white', letterSpacing:'0.06em', margin:0, textShadow:'0 0 20px rgba(74,158,107,0.5)' }}>
            Night Badges
          </h1>
          <div style={{ width:'70px' }} />
        </div>

        {/* Animal grid */}
        <div style={{ padding:'1.25rem 1rem', maxWidth:'600px', margin:'0 auto' }}>
          {ZOOSNOOZ_ANIMALS.map(animal => {
            const badge = zzCompleted[animal.id];
            const earned = !!badge;
            const obs = badge?.observationScore || {};
            const b = obs.behaviour || 0;
            const d = obs.detail    || 0;
            const w = obs.writing   || 0;
            const obsSum = b + d + w;
            const pts = earned ? Math.round((obsSum / 15) * 100) + (badge.quizResults?.[0]?.correctOnFirstAttempt ? 20 : 0) : 0;
            const quizOk = badge?.quizResults?.[0]?.correctOnFirstAttempt === true;

            return (
              <div key={animal.id} style={{ background: earned ? 'linear-gradient(135deg,rgba(20,40,28,0.95),rgba(10,25,18,0.98))' : 'rgba(10,20,14,0.6)', border: earned ? '1px solid rgba(74,158,107,0.4)' : '1px solid rgba(74,158,107,0.12)', borderRadius:'16px', marginBottom:'0.85rem', overflow:'hidden', display:'flex', gap:'1rem', padding:'1rem', alignItems:'flex-start' }}>
                {/* Badge image */}
                <div style={{ flexShrink:0, width:'72px', height:'72px', borderRadius:'50%', backgroundImage: earned ? `url(/images/badge-${animal.id}.png)` : 'none', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition:'center', backgroundColor: earned ? 'transparent' : 'rgba(255,255,255,0.04)', border: earned ? '2px solid rgba(74,158,107,0.5)' : '2px solid rgba(255,255,255,0.08)', boxShadow: earned ? '0 0 18px rgba(74,158,107,0.35)' : 'none', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', filter: earned ? 'drop-shadow(0 0 8px rgba(74,158,107,0.5))' : 'grayscale(1) opacity(0.3)' }}>
                  {!earned && <span style={{ fontSize:'1.4rem', opacity:0.4 }}>🔒</span>}
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.35rem' }}>
                    <div>
                      <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color: earned ? 'white' : 'rgba(255,255,255,0.35)' }}>{animal.name}</h3>
                      <p style={{ margin:0, fontSize:'0.72rem', color:'rgba(74,158,107,0.7)', fontStyle:'italic' }}>{animal.scientificName}</p>
                    </div>
                    {earned && (
                      <div style={{ background:'linear-gradient(135deg,rgba(74,158,107,0.3),rgba(46,125,85,0.4))', border:'1px solid rgba(74,158,107,0.4)', borderRadius:'20px', padding:'0.2rem 0.65rem', fontSize:'0.85rem', fontWeight:800, color:'#4A9E6B', whiteSpace:'nowrap' }}>
                        {pts} pts
                      </div>
                    )}
                  </div>

                  {earned ? (
                    <>
                      {/* Obs score bars */}
                      <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.5rem' }}>
                        {[['Behaviour', b, '#4A9E6B'], ['Detail', d, '#38BDF8'], ['Writing', w, '#F472B6']].map(([label, val, color]) => (
                          <div key={label} style={{ flex:1 }}>
                            <div style={{ fontSize:'0.58rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'2px' }}>{label}</div>
                            <div style={{ height:'5px', background:'rgba(255,255,255,0.08)', borderRadius:'3px', overflow:'hidden' }}>
                              <div style={{ height:'100%', width:`${(val/5)*100}%`, background:color, borderRadius:'3px', transition:'width 0.5s ease' }} />
                            </div>
                            <div style={{ fontSize:'0.65rem', color, fontWeight:700, marginTop:'2px' }}>{val}/5</div>
                          </div>
                        ))}
                      </div>
                      {/* Quiz chip */}
                      <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', flexWrap:'wrap' }}>
                        <div style={{ background: quizOk ? 'rgba(74,158,107,0.2)' : 'rgba(239,68,68,0.15)', border: `1px solid ${quizOk ? 'rgba(74,158,107,0.4)' : 'rgba(239,68,68,0.3)'}`, borderRadius:'20px', padding:'0.15rem 0.6rem', fontSize:'0.68rem', fontWeight:700, color: quizOk ? '#4A9E6B' : '#FCA5A5' }}>
                          {quizOk ? '✓ Quiz +20' : '✗ Quiz +0'}
                        </div>
                        <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.3)' }}>Obs {Math.round((obsSum/15)*100)} pts</div>
                      </div>
                    </>
                  ) : (
                    <p style={{ margin:'0.25rem 0 0', fontSize:'0.8rem', color:'rgba(255,255,255,0.25)', fontStyle:'italic' }}>Not yet explored</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals strip */}
        <div style={{ maxWidth:'600px', margin:'0 auto', padding:'0 1rem' }}>
          <div style={{ background:'linear-gradient(135deg,rgba(46,125,85,0.2),rgba(79,36,170,0.15))', border:'1px solid rgba(74,158,107,0.3)', borderRadius:'16px', padding:'1.25rem 1.5rem', display:'flex', justifyContent:'space-around', alignItems:'center' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.8rem', fontWeight:800, color:'#FFD700' }}>{zzTotalPointsColl}</div>
              <div style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Total Points</div>
            </div>
            <div style={{ width:'1px', height:'40px', background:'rgba(74,158,107,0.3)' }} />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.8rem', fontWeight:800, color:'white' }}>
                {totalDoneColl}<span style={{ fontSize:'1.1rem', opacity:0.4 }}>/{ZOOSNOOZ_ANIMALS.length}</span>
              </div>
              <div style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Badges</div>
            </div>
            <div style={{ width:'1px', height:'40px', background:'rgba(74,158,107,0.3)' }} />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.8rem', fontWeight:800, color:'#4A9E6B' }}>
                {Object.values(zzCompleted).filter(b => b.quizResults?.[0]?.correctOnFirstAttempt).length}
                <span style={{ fontSize:'1.1rem', opacity:0.4 }}>/{totalDoneColl}</span>
              </div>
              <div style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Quiz First Try</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAP VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (zzScreen === 'map' || !zzAnimal) {
    const completedIds  = new Set(Object.keys(zzCompleted));
    const totalDone     = completedIds.size;
    const allDone       = totalDone === ZOOSNOOZ_ANIMALS.length;
    const zzTotalPoints = Object.values(zzCompleted).reduce((sum, b) => {
      const o = b.observationScore || {};
      return sum + Math.round(((o.behaviour||0)+(o.detail||0)+(o.writing||0))/15*100) + (b.quizResults?.[0]?.correctOnFirstAttempt ? 20 : 0);
    }, 0);

    if (zzSessionDone) {
      return (
        <div style={{ position:'fixed', inset:0, background:'var(--zz-bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', gap:'1.5rem' }}>
          <div style={{ fontSize:'3rem' }}>🌿</div>
          <h2 style={{ color:'var(--zz-text)', fontSize:'1.8rem', fontWeight:700, margin:0 }}>Session Complete!</h2>
          <p style={{ color:'var(--zz-muted)', textAlign:'center' }}>{totalDone} animal{totalDone !== 1 ? 's' : ''} investigated. Your results have been saved.</p>
          <button onClick={() => setSessionType('standard')} className="zz-btn" style={{ maxWidth:280, width:'100%' }}>Back to Day Mode</button>
        </div>
      );
    }

    return (
      <div style={{ minHeight:'100vh', background:'#020D06' }}>
        {/* Star field */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
          {[...Array(90)].map((_,i) => (
            <div key={i} className="zz-star" style={{ position:'absolute', left:`${(i*7.31+13)%100}%`, top:`${(i*11.73+5)%100}%`, width: i%9===0?'3.5px': i%4===0?'2.5px':'1.5px', height: i%9===0?'3.5px': i%4===0?'2.5px':'1.5px', borderRadius:'50%', background: i%13===0 ? '#4A9E6B' : i%7===0 ? '#93C5FD' : 'white', opacity: 0.4+(i%5)*0.1, animationDelay:`${(i*0.23)%3}s`, animationDuration:`${1.8+(i%4)*0.6}s` }} />
          ))}
        </div>

        {/* Header - matches daily MapScreen style */}
        <div className="student-header" style={{ position:'sticky', top:0, zIndex:100 }}>
          <div className="student-banner-mobile student-header-inner">
            <div className="logo-title-block" style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <img src="images/logo.png" alt="Taronga Tracka"
                style={{ height:'72px', width:'auto', filter:'drop-shadow(0 0 14px rgba(46,125,85,0.7))' }}
                onError={e=>e.target.style.display='none'} />
              <div>
                <h1 className="taronga-title" style={{ fontSize:'clamp(1.5rem,3vw,2rem)', color:'white', marginBottom:'0.15rem', letterSpacing:'0.06em', textShadow:'0 2px 16px rgba(46,125,85,0.6)' }}>
                  ZOOSNOOZ
                </h1>
                <p style={{ color:'#4A9E6B', fontSize:'0.88rem', fontWeight:600, margin:0 }}>Nocturnal Wildlife Explorer</p>
              </div>
            </div>

            {studentName && (
              <div className="student-name-pill" style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.22)', borderRadius:'var(--t-r-pill)', padding:'0.4rem 0.9rem', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)' }}>
                <span style={{ color:'white', fontSize:'0.82rem', fontWeight:600 }}>👤 {studentName}</span>
              </div>
            )}

            <button className="student-points-chip" onClick={() => setZzScreen('collection')}>
              <div className="pts-value">{zzTotalPoints}</div>
              <div className="pts-label">{totalDone}/{ZOOSNOOZ_ANIMALS.length} Badges</div>
            </button>

            <button
              onClick={() => { setSessionType('standard'); }}
              style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(168,196,178,0.2)', color:'rgba(168,196,178,0.6)', padding:'0.4rem 0.75rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.75rem', fontWeight:600, whiteSpace:'nowrap' }}>
              🏠 Home
            </button>

            <button
              onClick={completeSession}
              disabled={zzSessionDone}
              style={{ background: zzSessionDone ? 'rgba(46,125,85,0.45)' : 'linear-gradient(135deg,#2E7D55,#4C1D95)', border: zzSessionDone ? '1px solid rgba(255,255,255,0.25)' : '1.5px solid rgba(168,196,178,0.5)', color:'white', padding:'0.4rem 0.9rem', borderRadius:'var(--t-r-pill)', cursor: zzSessionDone ? 'not-allowed' : 'pointer', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.04em', opacity: zzSessionDone ? 0.65 : 1, textTransform:'uppercase', boxShadow: zzSessionDone ? 'none' : '0 4px 14px rgba(46,125,85,0.45)', backdropFilter:'blur(8px)', whiteSpace:'nowrap' }}>
              {zzSessionDone ? '✓ Submitted' : '✓ Submit Session'}
            </button>
          </div>
        </div>

        {/* Discovery grid */}
        <div style={{ position:'relative', zIndex:1 }}>
          <div className="discovery-grid">
            {ZOOSNOOZ_ANIMALS
              .map(animal => {
                const done    = completedIds.has(animal.id);
                const { nearby, distance: dist } = checkAnimalProximity(animal);
                return { ...animal, done, dist, nearby };
              })
              .sort((a, b) => {
                if (a.done && !b.done) return 1;
                if (!a.done && b.done) return -1;
                if (a.dist === null) return 1;
                if (b.dist === null) return -1;
                return a.dist - b.dist;
              })
              .map((animal, index) => (
                <div
                  key={animal.id}
                  className={`animate-fade-in-up discovery-card${animal.done ? ' dc-found' : ''}${animal.nearby && !animal.done ? ' dc-nearby' : ''}`}
                  onClick={() => { if (!animal.done && animal.nearby) startMission(animal); }}
                  style={{ animationDelay:`${index*0.08}s`, cursor: animal.done ? 'default' : animal.nearby ? 'pointer' : 'default' }}
                >
                  <div className="discovery-card-img" style={{ backgroundImage:`url(${animal.image})` }} />
                  <div className="discovery-card-overlay" />
                  <div className="discovery-card-body">
                    <h3 className="dc-name">{animal.name}</h3>
                    <p className="dc-scientific">{animal.scientificName}</p>
                    {animal.done ? (
                      <div className="dc-pill dc-pill-found">✓ Discovered</div>
                    ) : animal.nearby ? (
                      <div className="dc-pill dc-pill-nearby">▶ Begin Mission</div>
                    ) : animal.dist !== null ? (
                      <div className="dc-pill dc-pill-dist">⟳ {animal.dist}m away</div>
                    ) : (
                      <div className="dc-pill dc-pill-far">Get closer</div>
                    )}
                  </div>
                  {animal.nearby && !animal.done && <div className="dc-nearby-ring" />}
                </div>
              ))
            }
          </div>

          {totalDone > 0 && (
            <div style={{ padding:'0 1rem 3rem', maxWidth:'600px', margin:'0 auto' }}>
              <button className="zz-btn" onClick={completeSession}>
                {allDone ? 'View Your Night Journey' : `Finish Session (${totalDone}/${ZOOSNOOZ_ANIMALS.length} done)`}
              </button>
            </div>
          )}
        </div>

        {/* Badge popup overlay */}
        {zzBadgeAnimal && (() => {
          const { animal: ba, points: baPoints, quizCorrect: baQuiz, totalDone: baDone, runningTotal: baRunningTotal } = zzBadgeAnimal;
          const CONFETTI_COLOURS = ['#4A9E6B','#2E7D55','#A8C4B2','#00E63C','#FFD700','#F472B6','#38BDF8'];
          return (
            <div style={{ position:'absolute', inset:0, zIndex:500, background:'linear-gradient(160deg,#020D06 0%,#040F08 55%,#071E14 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem', overflow:'hidden' }}>
              {/* Confetti */}
              <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
                {[...Array(55)].map((_,i) => (
                  <div key={i} style={{ position:'absolute', left:`${(i*7.3+3)%100}%`, top:'-16px', width: i%4===0 ? `${5+i%4}px` : `${3+i%3}px`, height: i%4===0 ? `${5+i%4}px` : `${3+i%3}px`, borderRadius: i%3===0 ? '50%' : '2px', background: CONFETTI_COLOURS[i % CONFETTI_COLOURS.length], opacity: 0.75+(i%3)*0.08, animation:`fall ${2.2+i%3*0.7}s linear forwards`, animationDelay:`${(i*0.07)%1.4}s` }} />
                ))}
              </div>

              <div className="animate-scale-in" style={{ position:'relative', zIndex:10, background:'linear-gradient(160deg,rgba(20,10,50,0.98),rgba(10,5,30,0.99))', border:'1px solid rgba(46,125,85,0.45)', borderRadius:'28px', padding:'2rem 1.75rem', maxWidth:'420px', width:'100%', textAlign:'center', boxShadow:'0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(168,196,178,0.12)' }}>
                {/* Badge with glow */}
                <div style={{ position:'relative', width:'180px', height:'180px', margin:'0 auto 1.25rem' }}>
                  <div style={{ position:'absolute', inset:'-12px', borderRadius:'50%', background:'radial-gradient(circle, rgba(46,125,85,0.35) 0%, transparent 70%)' }} />
                  <div style={{ width:'100%', height:'100%', borderRadius:'50%', backgroundImage:`url(images/badge-${ba.id}.png)`, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition:'center', filter:'drop-shadow(0 0 20px rgba(46,125,85,0.6))' }} />
                </div>

                <div style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(168,196,178,0.7)', textTransform:'uppercase', letterSpacing:'0.18em', marginBottom:'0.3rem' }}>Mission Complete</div>
                <h2 className="taronga-title" style={{ fontSize:'clamp(1.6rem,4vh,2.1rem)', color:'white', marginBottom:'0.2rem', letterSpacing:'0.05em' }}>{ba.name}</h2>
                <p style={{ color:'#4A9E6B', fontSize:'0.85rem', fontWeight:600, margin:'0 0 1.25rem' }}>{ba.scientificName}</p>

                {/* Points earned */}
                <div style={{ background:'linear-gradient(135deg,rgba(46,125,85,0.25),rgba(79,36,170,0.3))', border:'1px solid rgba(46,125,85,0.4)', borderRadius:'16px', padding:'1rem', marginBottom:'0.85rem' }}>
                  <div style={{ fontSize:'clamp(2.2rem,5vh,3rem)', fontWeight:900, color:'#A8C4B2', letterSpacing:'-0.02em', lineHeight:1 }}>+{baPoints}</div>
                  <div style={{ fontSize:'0.65rem', fontWeight:800, color:'rgba(168,196,178,0.6)', textTransform:'uppercase', letterSpacing:'0.12em', marginTop:'0.2rem' }}>Points Earned</div>
                  {baQuiz && <div style={{ fontSize:'0.72rem', color:'#4A9E6B', marginTop:'0.4rem' }}>+20 quiz bonus included</div>}
                </div>

                {/* Feedback */}
                {zzBadgeAnimal.observationScore && (() => {
                  const baObs = zzBadgeAnimal.observationScore;
                  const zzDomains = [{ key:'behaviour' }, { key:'detail' }, { key:'writing' }];
                  const zzMsgs = {
                    behaviour: { well:"You described exactly what the animal was doing, great watching!", next:"Watch closely and write down exactly what the animal is doing." },
                    detail:    { well:"You used great details and science words to back up your ideas!",   next:"Try explaining WHY the animal does that. What's the reason?" },
                    writing:   { well:"Your sentences were clear and easy to read!",                       next:"Start with a capital letter and finish with a full stop." },
                  };
                  const zzSorted    = [...zzDomains].sort((a, b) => (baObs[b.key] ?? 0) - (baObs[a.key] ?? 0));
                  const zzBestKey   = zzSorted[0]?.key;
                  const zzWorstKey  = zzSorted[zzSorted.length - 1]?.key;
                  const zzWellMsg   = zzBestKey
                    ? ((baObs[zzBestKey] ?? 0) >= 3 ? zzMsgs[zzBestKey]?.well : "You gave it a go! Try again with the next animal.")
                    : null;
                  const zzNextMsg   = zzWorstKey ? zzMsgs[zzWorstKey]?.next : null;
                  if (!zzWellMsg || !zzNextMsg) return null;
                  return (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.4rem', marginBottom:'0.85rem' }}>
                      <div style={{ background:'rgba(74,222,128,0.07)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:'12px', padding:'0.6rem 0.65rem', textAlign:'left' }}>
                        <div style={{ fontSize:'0.58rem', fontWeight:800, color:'#4ADE80', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.35rem' }}>What you did well</div>
                        <p style={{ margin:0, fontSize:'0.7rem', color:'rgba(74,222,128,0.85)', lineHeight:1.4 }}>{zzWellMsg}</p>
                      </div>
                      <div style={{ background:'rgba(251,191,36,0.07)', border:'1px solid rgba(251,191,36,0.25)', borderRadius:'12px', padding:'0.6rem 0.65rem', textAlign:'left' }}>
                        <div style={{ fontSize:'0.58rem', fontWeight:800, color:'#FCD34D', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.35rem' }}>Next time, try to...</div>
                        <p style={{ margin:0, fontSize:'0.7rem', color:'rgba(253,224,71,0.8)', lineHeight:1.4 }}>{zzNextMsg}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Progress */}
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'14px', padding:'0.85rem', marginBottom:'1.25rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                  <div>
                    <div style={{ fontSize:'1.3rem', fontWeight:800, color:'white' }}>{baDone}/{ZOOSNOOZ_ANIMALS.length}</div>
                    <div style={{ fontSize:'0.62rem', color:'rgba(168,196,178,0.6)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Animals Done</div>
                  </div>
                  <div>
                    <div style={{ fontSize:'1.3rem', fontWeight:800, color:'#A8C4B2' }}>{baRunningTotal}</div>
                    <div style={{ fontSize:'0.62rem', color:'rgba(168,196,178,0.6)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Total Points</div>
                  </div>
                </div>

                <button
                  onClick={() => setZzBadgeAnimal(null)}
                  style={{ width:'100%', padding:'0.9rem', background:'linear-gradient(135deg,#2E7D55,#4C1D95)', border:'none', borderRadius:'var(--t-r-pill)', color:'white', fontSize:'1rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.09em', boxShadow:'0 6px 20px rgba(46,125,85,0.5)', marginBottom:'0.65rem' }}>
                  {baDone === ZOOSNOOZ_ANIMALS.length ? '🌙 View Your Night Journey' : 'Continue Exploring →'}
                </button>
                <button
                  onClick={() => { setZzBadgeAnimal(null); setSessionType('standard'); }}
                  style={{ width:'100%', padding:'0.6rem', background:'transparent', border:'1px solid rgba(168,196,178,0.2)', borderRadius:'var(--t-r-pill)', color:'rgba(168,196,178,0.55)', fontSize:'0.78rem', fontWeight:600, cursor:'pointer', letterSpacing:'0.05em' }}>
                  ← Go Home
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MISSION VIEW
  // ─────────────────────────────────────────────────────────────────────────
  const stageData = zzAnimal.byStage?.[classStage] || zzAnimal.byStage?.[5] || {};
  const minWords  = getMinWords(classStage);
  const wordCount = obsText.trim().match(/\b\w+\b/g)?.length || 0;

  return (
    <div style={{ position:'fixed', inset:0, background:'var(--zz-bg)', display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Mission header */}
      <div style={{ borderBottom:'1px solid var(--zz-border)', flexShrink:0, background:'rgba(0,0,0,0.3)' }}>
      <div style={{ maxWidth:680, margin:'0 auto', padding:'0.65rem 1rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
        <button onClick={() => {
          if (zzPhase !== 'insight' && !window.confirm('Leave this mission? Your progress will be lost.')) return;
          setZzScreen('map');
        }} className="zz-btn-ghost" style={{ padding:'0.4rem 0.85rem', fontSize:'0.8rem' }}>← Map</button>
        <div style={{ flex:1, textAlign:'center' }}>
          <div style={{ color:'var(--zz-text)', fontWeight:700, fontSize:'0.95rem' }}>{zzAnimal.name}</div>
          <div style={{ color:'var(--zz-muted)', fontSize:'0.68rem', textTransform:'uppercase', letterSpacing:'0.1em' }}>
            {zzPhase === 'insight' ? 'Keeper Insight' : zzPhase === 'interaction' ? 'Sense & Observe' : zzPhase === 'mcq' ? 'Make Your Call' : zzPhase === 'observation' ? 'Record & Ask' : zzPhase === 'video' ? 'Night Vision' : 'Summary'}
          </div>
        </div>
        <div style={{ width:72, textAlign:'right', color:'var(--zz-muted)', fontSize:'0.75rem' }}>
          {['insight','interaction','mcq','observation','video','preview'].indexOf(zzPhase)+1}/6
        </div>
      </div>
      </div>

      {/* Phase content */}
      <div style={{ flex:1, overflowY:'auto', padding:'1.25rem' }}>
      <div style={{ maxWidth:'680px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'1rem' }}>

        {/* ── INSIGHT ─────────────────────────────────────────────────────── */}
        {zzPhase === 'insight' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem', flex:1 }}>
            <div style={{ height:'200px', borderRadius:16, overflow:'hidden', position:'relative', border:'1px solid var(--zz-border)' }}>
              <img src={zzAnimal.image} alt={zzAnimal.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', filter:'brightness(0.55)', display:'block' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg,rgba(4,8,15,0.9) 0%,rgba(4,8,15,0.3) 100%)' }} />
              <div style={{ position:'absolute', bottom:'1rem', left:'1.25rem', right:'1.25rem' }}>
                <div style={{ fontSize:'0.6rem', color:'rgba(168,196,178,0.8)', textTransform:'uppercase', letterSpacing:'0.14em', fontWeight:800, marginBottom:'0.25rem' }}>Keeper Insight</div>
                <div style={{ fontSize:'1.05rem', fontWeight:700, color:'white', lineHeight:1.3 }}>{zzAnimal.name}</div>
                <div style={{ fontSize:'0.75rem', color:'rgba(168,196,178,0.7)', fontStyle:'italic' }}>{zzAnimal.scientificName}</div>
              </div>
            </div>
            <div className="zz-card">
              <p style={{ color:'var(--zz-text)', fontSize:'0.95rem', lineHeight:1.65, margin:0, whiteSpace:'pre-line' }}>
                {stageData.keeperInsight || zzAnimal.keeperInsight}
              </p>
            </div>
            <div className="zz-card">
              <div style={{ color:'var(--zz-muted)', fontSize:'0.78rem', marginBottom:'0.5rem' }}>Your mission</div>
              <p style={{ color:'var(--zz-text)', fontSize:'0.88rem', lineHeight:1.6, margin:0 }}>{zzAnimal.interaction.instruction}</p>
            </div>
            <button onClick={() => setZzPhase('interaction')} className="zz-btn">Begin Mission →</button>
          </div>
        )}

        {/* ── INTERACTION ──────────────────────────────────────────────────── */}
        {zzPhase === 'interaction' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem', flex:1 }}>

            {/* Tiger: Behaviour Analysis Tool */}
            {zzAnimal.id === 'tiger' && (() => {
              const activeSamples = tigerTimeline.filter(Boolean).length;
              const stillSamples  = tigerTimeline.filter(v => !v).length;
              const total         = activeSamples + stillSamples;
              const activePct     = total > 0 ? Math.round((activeSamples / total) * 100) : 0;
              const stillPct      = 100 - activePct;
              const activeSecs    = Math.round(activeSamples * 0.5);
              const stillSecs     = Math.round(stillSamples * 0.5);
              const done          = interDone;
              return (
                <div>
                  {/* Instrument panel */}
                  <div style={{ background:'rgba(0,0,0,0.6)', border:`1.5px solid ${done ? 'rgba(74,222,128,0.5)' : tigerStarted ? 'rgba(46,125,85,0.6)' : 'rgba(255,255,255,0.12)'}`, borderRadius:'16px', padding:'1.25rem', marginBottom:'1rem', fontFamily:'monospace', boxShadow: tigerStarted && !done ? '0 0 24px rgba(46,125,85,0.15)' : done ? '0 0 24px rgba(74,222,128,0.12)' : 'none' }}>
                    {/* Header row */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                        <div style={{ width:'10px', height:'10px', borderRadius:'50%', flexShrink:0, background: done ? '#4ADE80' : tigerStarted ? '#4A9E6B' : 'rgba(255,255,255,0.2)', boxShadow: tigerStarted && !done ? '0 0 10px rgba(74,158,107,0.9)' : done ? '0 0 10px rgba(74,222,128,0.9)' : 'none', animation: tigerStarted && !done ? 'bflDot 1s ease-in-out infinite' : 'none' }} />
                        <div>
                          <div style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(168,196,178,0.8)', textTransform:'uppercase', letterSpacing:'0.16em', fontFamily:'DM Sans, sans-serif' }}>
                            {done ? 'Analysis Complete' : tigerStarted ? 'Recording…' : 'Behaviour Analysis Tool'}
                          </div>
                          <div style={{ fontSize:'0.55rem', color:'rgba(255,255,255,0.25)', fontFamily:'DM Sans, sans-serif', marginTop:'0.1rem' }}>Sumatran Tiger · Movement Tracker</div>
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:'2.6rem', fontWeight:700, color: done ? '#4ADE80' : interTimer <= 10 ? '#FBBF24' : 'white', lineHeight:1, letterSpacing:'-0.04em', fontVariantNumeric:'tabular-nums' }}>
                          {done ? '✓' : String(interTimer).padStart(2,'0')}
                        </div>
                        {!done && <div style={{ fontSize:'0.5rem', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.12em', fontFamily:'DM Sans, sans-serif' }}>seconds left</div>}
                      </div>
                    </div>
                    {/* Timeline grid - 60 cells */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(30,1fr)', gap:'3px', marginBottom:'0.8rem' }}>
                      {[...Array(60)].map((_,i) => {
                        const recorded = i < tigerTimeline.length;
                        const active   = tigerTimeline[i] === true;
                        return (
                          <div key={i} style={{ height:'22px', borderRadius:'3px', transition:'background 0.15s',
                            background: recorded ? (active ? 'linear-gradient(180deg,#5DBF7F,#2E7D55)' : 'rgba(255,255,255,0.06)') : 'rgba(255,255,255,0.025)',
                            boxShadow: recorded && active ? '0 0 6px rgba(74,158,107,0.6)' : 'none'
                          }} />
                        );
                      })}
                    </div>
                    {/* Legend + axis */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                      <div style={{ display:'flex', gap:'0.85rem', fontSize:'0.6rem', color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans, sans-serif' }}>
                        <span style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}><span style={{ display:'inline-block', width:'10px', height:'10px', borderRadius:'2px', background:'linear-gradient(180deg,#5DBF7F,#2E7D55)' }} />Active</span>
                        <span style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}><span style={{ display:'inline-block', width:'10px', height:'10px', borderRadius:'2px', background:'rgba(255,255,255,0.06)' }} />Still</span>
                      </div>
                      <span style={{ fontSize:'0.55rem', color:'rgba(255,255,255,0.2)', fontFamily:'DM Sans, sans-serif' }}>0s ← -  -  -  -  -  - → 30s</span>
                    </div>
                    {/* Stat cards */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.65rem' }}>
                      <div style={{ background:'rgba(74,158,107,0.12)', border:'1px solid rgba(74,158,107,0.3)', borderRadius:'10px', padding:'0.7rem 0.85rem', textAlign:'center' }}>
                        <div style={{ fontSize:'1.9rem', fontWeight:700, color:'#4A9E6B', lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{activePct}<span style={{ fontSize:'1rem' }}>%</span></div>
                        <div style={{ fontSize:'0.58rem', color:'rgba(168,196,178,0.65)', marginTop:'0.2rem', fontFamily:'DM Sans, sans-serif', textTransform:'uppercase', letterSpacing:'0.1em' }}>Active · {activeSecs}s</div>
                      </div>
                      <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:'10px', padding:'0.7rem 0.85rem', textAlign:'center' }}>
                        <div style={{ fontSize:'1.9rem', fontWeight:700, color:'rgba(255,255,255,0.65)', lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{stillPct}<span style={{ fontSize:'1rem' }}>%</span></div>
                        <div style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.3)', marginTop:'0.2rem', fontFamily:'DM Sans, sans-serif', textTransform:'uppercase', letterSpacing:'0.1em' }}>Still · {stillSecs}s</div>
                      </div>
                    </div>
                  </div>
                  {/* Hold button */}
                  {!done && (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem' }}>
                      <div style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.35)', fontFamily:'DM Sans, sans-serif', textTransform:'uppercase', letterSpacing:'0.12em' }}>
                        {!tigerStarted ? 'Hold the button while the tiger moves' : energyHeld ? 'Tracking movement…' : 'Release = still'}
                      </div>
                      <button
                        onPointerDown={() => { setEnergyHeld(true); heldRef.current = true; }}
                        onPointerUp={() => { setEnergyHeld(false); heldRef.current = false; }}
                        onPointerLeave={() => { setEnergyHeld(false); heldRef.current = false; }}
                        style={{
                          width:'140px', height:'140px', borderRadius:'50%',
                          border:'none', outline:'none', cursor:'pointer',
                          userSelect:'none', WebkitUserSelect:'none', position:'relative',
                          background: energyHeld
                            ? 'radial-gradient(circle at 40% 35%, #6FCF97, #2E7D55 60%, #1A5238)'
                            : 'radial-gradient(circle at 40% 35%, #3A6B4A, #1A3D28 60%, #0D2118)',
                          boxShadow: energyHeld
                            ? '0 2px 0 #0D2118, 0 0 0 6px rgba(74,158,107,0.25), 0 0 40px rgba(74,158,107,0.5), inset 0 1px 2px rgba(255,255,255,0.2)'
                            : '0 8px 0 #061009, 0 0 0 4px rgba(46,125,85,0.2), 0 16px 40px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.08)',
                          transform: energyHeld ? 'translateY(6px)' : 'translateY(0)',
                          transition:'all 0.1s ease',
                        }}>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:'0.3rem', pointerEvents:'none' }}>
                          <div style={{ fontSize: energyHeld ? '1.6rem' : '1.4rem', lineHeight:1, transition:'font-size 0.1s' }}>{energyHeld ? '⬤' : '○'}</div>
                          <div style={{ fontSize:'0.6rem', fontWeight:800, color: energyHeld ? '#D4EDE0' : 'rgba(168,196,178,0.6)', textTransform:'uppercase', letterSpacing:'0.12em', fontFamily:'DM Sans, sans-serif', lineHeight:1.3 }}>
                            {energyHeld ? 'Active' : !tigerStarted ? 'Hold' : 'Still'}
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                  {/* Done banner */}
                  {done && (
                    <div style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.3)', borderRadius:'12px', padding:'0.9rem 1rem', marginBottom:'0.75rem', textAlign:'center' }}>
                      <p style={{ fontSize:'0.88rem', color:'#4ADE80', fontWeight:700, margin:'0 0 0.25rem' }}>✓ 30-second analysis complete</p>
                      <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.45)', margin:0 }}>Tiger was active {activePct}% of the time. Now interpret the data.</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Lion: Vocalisation Monitor */}
            {zzAnimal.id === 'lion' && (() => {
              const BARS = 20, maxVol = 100;
              const vol   = soundLevel;
              const peak  = lionPeak;
              const avg   = lionHistory.length > 0 ? Math.round(lionHistory.reduce((a,b)=>a+b,0)/lionHistory.length) : 0;
              const timer = interTimer;
              const done  = interDone;
              const filled = Math.round((vol/maxVol)*BARS);
              const volPct  = Math.min(100, vol);
              const peakPct = Math.min(100, peak);
              const avgPct  = Math.min(100, avg);
              const actLabel = volPct < 15 ? 'Silent' : volPct < 35 ? 'Low' : volPct < 60 ? 'Moderate' : 'High';
              const actColor = volPct < 15 ? 'rgba(255,255,255,0.3)' : volPct < 35 ? '#A8C4B2' : volPct < 60 ? '#4A9E6B' : '#4ADE80';
              return (
                <div>
                  <div style={{ background:'rgba(0,0,0,0.6)', border:`1.5px solid ${done?'rgba(74,222,128,0.5)':lionMonitoring?'rgba(46,125,85,0.6)':'rgba(255,255,255,0.12)'}`, borderRadius:'16px', padding:'1.25rem', marginBottom:'1rem', boxShadow: lionMonitoring&&!done?'0 0 24px rgba(46,125,85,0.12)':done?'0 0 24px rgba(74,222,128,0.1)':'none' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                        <div style={{ width:'10px', height:'10px', borderRadius:'50%', flexShrink:0, background:done?'#4ADE80':lionMonitoring?'#4A9E6B':'rgba(255,255,255,0.2)', boxShadow:lionMonitoring&&!done?'0 0 10px rgba(74,158,107,0.9)':done?'0 0 10px rgba(74,222,128,0.9)':'none', animation:lionMonitoring&&!done?'bflDot 1s ease-in-out infinite':'none' }} />
                        <div>
                          <div style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(168,196,178,0.8)', textTransform:'uppercase', letterSpacing:'0.16em', fontFamily:'DM Sans, sans-serif' }}>{done?'Recording Complete':lionMonitoring?'Listening…':'Lion Vocalisation Monitor'}</div>
                          <div style={{ fontSize:'0.55rem', color:'rgba(255,255,255,0.25)', fontFamily:'DM Sans, sans-serif', marginTop:'0.1rem' }}>African Lion · Audio Analysis</div>
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:'2.6rem', fontWeight:700, color:done?'#4ADE80':timer<=10?'#FBBF24':'white', lineHeight:1, letterSpacing:'-0.04em', fontVariantNumeric:'tabular-nums', fontFamily:'monospace' }}>{done?'✓':String(timer).padStart(2,'0')}</div>
                        {!done && <div style={{ fontSize:'0.5rem', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.12em', fontFamily:'DM Sans, sans-serif' }}>seconds left</div>}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:'4px', alignItems:'flex-end', height:'64px', marginBottom:'0.75rem' }}>
                      {[...Array(BARS)].map((_,i) => {
                        const active = i < filled;
                        const maxH = 20 + Math.round(Math.sin((i/BARS)*Math.PI)*36);
                        const h = active ? Math.max(8,maxH) : 6;
                        const color = active ? (i/BARS>0.8?'#F87171':i/BARS>0.55?'#FBBF24':'#4A9E6B') : 'rgba(255,255,255,0.06)';
                        return <div key={i} style={{ flex:1, borderRadius:'3px 3px 0 0', transition:'height 0.12s ease,background 0.12s ease', height:`${h}px`, background:color, boxShadow:active&&i/BARS>0.55?`0 0 6px ${color}88`:'none' }} />;
                      })}
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.85rem' }}>
                      <span style={{ fontSize:'0.72rem', fontWeight:700, color:actColor, fontFamily:'DM Sans, sans-serif', transition:'color 0.3s' }}>{lionMonitoring||done?actLabel:' - '}</span>
                      <span style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.25)', fontFamily:'DM Sans, sans-serif' }}>0 ·········· 30s</span>
                    </div>
                    <div style={{ display:'flex', gap:'2px', alignItems:'flex-end', height:'36px', marginBottom:'0.85rem', background:'rgba(0,0,0,0.3)', borderRadius:'6px', padding:'4px 6px', overflow:'hidden' }}>
                      {[...Array(60)].map((_,i) => {
                        const v = lionHistory[i];
                        const h = v!=null ? Math.max(3,Math.round((v/maxVol)*28)) : 2;
                        return <div key={i} style={{ flex:1, borderRadius:'1px', transition:'height 0.2s', height:`${h}px`, alignSelf:'flex-end', background:v!=null?(v/maxVol>0.6?'#FBBF24':'#4A9E6B'):'rgba(255,255,255,0.04)' }} />;
                      })}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.5rem' }}>
                      {[['Live',`${volPct}%`,actColor],['Peak',`${peakPct}%`,'#FBBF24'],['Avg',`${avgPct}%`,'#A8C4B2']].map(([lbl,val,col]) => (
                        <div key={lbl} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'8px', padding:'0.5rem 0.4rem', textAlign:'center' }}>
                          <div style={{ fontSize:'1.3rem', fontWeight:700, color:col, lineHeight:1, fontFamily:'monospace', fontVariantNumeric:'tabular-nums' }}>{val}</div>
                          <div style={{ fontSize:'0.55rem', color:'rgba(255,255,255,0.3)', marginTop:'0.15rem', fontFamily:'DM Sans, sans-serif', textTransform:'uppercase', letterSpacing:'0.1em' }}>{lbl}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {lionError && <div style={{ fontSize:'0.78rem', color:'#F87171', marginBottom:'0.75rem', textAlign:'center' }}>Microphone unavailable - tap continue and observe quietly.</div>}
                  {!lionMonitoring && !done && !lionError && (
                    <button className="zz-btn" style={{ marginBottom:'0.5rem', fontSize:'1rem', padding:'0.9rem' }} onClick={zzStartMic}>▶ Start 30-Second Recording</button>
                  )}
                  {done && (
                    <div style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.3)', borderRadius:'12px', padding:'0.9rem 1rem', marginBottom:'0.75rem', textAlign:'center' }}>
                      <p style={{ fontSize:'0.88rem', color:'#4ADE80', fontWeight:700, margin:'0 0 0.25rem' }}>✓ 30-second recording complete</p>
                      <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.45)', margin:0 }}>Peak audio: {peakPct}% · Average: {avgPct}%. Now interpret what you heard.</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Rhino: Structural Movement Tracker */}
            {zzAnimal.id === 'rhino' && (() => {
              const rs = rhinoStateRef.current;
              void rhinoTick;
              const rStarted   = rs?.started   || false;
              const rDone      = rs?.done      || false;
              const rTimer     = rs?.timerSecs ?? 20;
              const rDist      = rs?.totalDist || 0;
              const rMaxSpeed  = rs?.maxSpeed  || 0;
              const rFootfalls = rs?.footfalls || 0;
              const speedLabel = rMaxSpeed>=0.55?'CHARGE':rMaxSpeed>=0.28?'TROT':rStarted?'WALK':' - ';
              const speedColor = rMaxSpeed>=0.55?'#FBBF24':rMaxSpeed>=0.28?'#A8C4B2':'#4A9E6B';

              function drawFootprint(ctx, x, y, angle, sn) {
                ctx.save(); ctx.globalAlpha = 0.42+sn*0.25; ctx.fillStyle = '#1A5238';
                ctx.translate(x,y); ctx.rotate(angle);
                ctx.beginPath(); ctx.ellipse(0,0,10,14,0,0,Math.PI*2); ctx.fill();
                [[-7,-16],[0,-19],[7,-16]].forEach(([tx,ty]) => { ctx.beginPath(); ctx.ellipse(tx,ty,4,6,0,0,Math.PI*2); ctx.fill(); });
                ctx.restore();
              }

              function zzRhinoInitCanvas(canvas) {
                if (!canvas || canvas._zzRhinoInited) return;
                canvas._zzRhinoInited = true;
                const ctx = canvas.getContext('2d');
                function drawBg(withPrompt) {
                  ctx.fillStyle='#050D07'; ctx.fillRect(0,0,canvas.width,canvas.height);
                  ctx.strokeStyle='rgba(46,125,85,0.06)'; ctx.lineWidth=1;
                  for (let i=1;i<10;i++){const py=(i/10)*canvas.height;ctx.beginPath();ctx.moveTo(0,py);ctx.lineTo(canvas.width,py);ctx.stroke();}
                  for (let i=1;i<14;i++){const px=(i/14)*canvas.width;ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(px,canvas.height);ctx.stroke();}
                  if (withPrompt) {
                    ctx.fillStyle='rgba(168,196,178,0.32)'; ctx.font='bold 13px DM Sans,sans-serif'; ctx.textAlign='center';
                    ctx.fillText('Press and drag to simulate movement',canvas.width/2,canvas.height/2-10);
                    ctx.font='11px DM Sans,sans-serif'; ctx.fillStyle='rgba(168,196,178,0.18)';
                    ctx.fillText('Slow · Heavy · Powerful',canvas.width/2,canvas.height/2+12); ctx.textAlign='left';
                  }
                }
                drawBg(true);
                rhinoStateRef.current = { canvas, ctx, drawBg, started:false, done:false, lastX:null, lastY:null, lastAngle:0, totalDist:0, maxSpeed:0, footfalls:0, footfallAccum:0, lastMoveAt:0, lastVibrateAt:0, pathPoints:[], timerSecs:20, timerInterval:null };

                function getPos(e) { const r=canvas.getBoundingClientRect(),src=e.touches?e.touches[0]:e; return {x:(src.clientX-r.left)*(canvas.width/r.width),y:(src.clientY-r.top)*(canvas.height/r.height)}; }
                function startRhinoTimer() {
                  let elapsed=0;
                  const iv = setInterval(()=>{
                    elapsed+=250;
                    const r=rhinoStateRef.current; if(!r){clearInterval(iv);return;}
                    r.ctx.fillStyle='rgba(5,13,7,0.01)'; r.ctx.fillRect(0,0,canvas.width,canvas.height);
                    const secsLeft=Math.max(0,20-Math.floor(elapsed/1000));
                    r.timerSecs=secsLeft;
                    if(elapsed>=20000){clearInterval(iv);r.done=true;r.timerSecs=0;setInterDone(true);}
                    setRhinoTick(t=>t+1);
                  },250);
                  rhinoStateRef.current.timerInterval=iv;
                }
                function onMove(e) {
                  e.preventDefault();
                  const r=rhinoStateRef.current; if(!r||r.done)return;
                  const {x,y}=getPos(e); const now=Date.now();
                  if(!r.started){r.started=true;r.drawBg(false);startRhinoTimer();}
                  if(r.lastX!==null){
                    const dx=x-r.lastX,dy=y-r.lastY,dist=Math.sqrt(dx*dx+dy*dy);
                    if(dist<1)return;
                    const dt=Math.max(16,now-r.lastMoveAt),speed=dist/dt;
                    r.totalDist+=dist; if(speed>r.maxSpeed)r.maxSpeed=speed;
                    r.lastAngle=Math.atan2(dy,dx);
                    const sn=Math.min(1,speed/0.65);
                    const colR=Math.round(46+sn*(251-46)),colG=Math.round(158+sn*(191-158)),colB=Math.round(107+sn*(36-107));
                    const col=`rgb(${colR},${colG},${colB})`;
                    r.ctx.save(); r.ctx.strokeStyle=col; r.ctx.lineWidth=11+sn*9; r.ctx.lineCap='round';
                    r.ctx.shadowColor=col; r.ctx.shadowBlur=8+sn*28; r.ctx.globalAlpha=0.6+sn*0.4;
                    r.ctx.beginPath(); r.ctx.moveTo(r.lastX,r.lastY); r.ctx.lineTo(x,y); r.ctx.stroke(); r.ctx.restore();
                    r.ctx.save(); r.ctx.strokeStyle=`rgba(255,255,255,${0.05+sn*0.2})`; r.ctx.lineWidth=1.5; r.ctx.lineCap='round';
                    r.ctx.beginPath(); r.ctx.moveTo(r.lastX,r.lastY); r.ctx.lineTo(x,y); r.ctx.stroke(); r.ctx.restore();
                    r.footfallAccum+=dist;
                    if(r.footfallAccum>=55){
                      r.footfallAccum-=55; r.footfalls++;
                      drawFootprint(r.ctx,x,y,r.lastAngle+Math.PI/2,sn);
                      r.ctx.save(); r.ctx.strokeStyle=`rgba(${colR},${colG},${colB},0.28)`; r.ctx.lineWidth=1;
                      r.ctx.beginPath(); r.ctx.arc(x,y,22,0,Math.PI*2); r.ctx.stroke(); r.ctx.restore();
                      if(now-r.lastVibrateAt>220){r.lastVibrateAt=now;try{navigator.vibrate(sn>0.55?[10,5,10,5,10]:sn>0.28?[25]:[55]);}catch(ex){}}
                    }
                    if(r.pathPoints.length<180)r.pathPoints.push([Math.round(x),Math.round(y)]);
                  }
                  r.lastX=x; r.lastY=y; r.lastMoveAt=now;
                }
                function onStart(e){e.preventDefault();const r=rhinoStateRef.current;if(!r||r.done)return;r.lastX=null;r.lastY=null;onMove(e);}
                function onEnd(){const r=rhinoStateRef.current;if(r){r.lastX=null;r.lastY=null;}}
                canvas.addEventListener('touchstart',onStart,{passive:false});
                canvas.addEventListener('touchmove',onMove,{passive:false});
                canvas.addEventListener('touchend',onEnd);
                canvas.addEventListener('mousedown',onStart);
                canvas.addEventListener('mousemove',e=>{if(e.buttons===0)return;onMove(e);});
                canvas.addEventListener('mouseup',onEnd);
              }

              return (
                <div style={{ background:'rgba(0,0,0,0.5)', border:'1px solid rgba(46,125,85,0.35)', borderRadius:'16px', padding:'1rem', marginBottom:'1rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.7rem' }}>
                    <div>
                      <p style={{ fontSize:'0.58rem', fontWeight:700, color:'rgba(168,196,178,0.7)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.1rem', fontFamily:'DM Sans, sans-serif' }}>Structural Movement Tracker</p>
                      <p style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', margin:0, fontFamily:'DM Sans, sans-serif' }}>Greater One-Horned Rhino · Mass &amp; Momentum Analysis</p>
                    </div>
                    {rStarted && !rDone && (
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontSize:'1.8rem', fontWeight:800, color:rTimer<=5?'#F87171':'#4A9E6B', lineHeight:1, fontFamily:'monospace' }}>{rTimer}</div>
                        <div style={{ fontSize:'0.55rem', color:'rgba(255,255,255,0.28)', fontFamily:'DM Sans, sans-serif', letterSpacing:'0.08em' }}>SECONDS</div>
                      </div>
                    )}
                    {rDone && <div style={{ fontSize:'0.65rem', color:'#4ADE80', fontFamily:'DM Sans, sans-serif', fontWeight:700, flexShrink:0 }}>✓ Recorded</div>}
                  </div>
                  {rStarted && (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.35rem', marginBottom:'0.65rem' }}>
                      {[{label:'FOOTFALLS',val:rFootfalls,col:'#4A9E6B'},{label:'DISTANCE',val:`${Math.round(rDist/8)}m`,col:'#A8C4B2'},{label:'GAIT',val:speedLabel,col:speedColor}].map(s=>(
                        <div key={s.label} style={{ background:'rgba(0,0,0,0.45)', borderRadius:'8px', padding:'0.38rem 0.4rem', textAlign:'center' }}>
                          <div style={{ fontSize:'0.52rem', color:'rgba(168,196,178,0.45)', fontFamily:'DM Sans, sans-serif', letterSpacing:'0.1em', marginBottom:'0.1rem' }}>{s.label}</div>
                          <div style={{ fontSize:'0.9rem', fontWeight:800, color:s.col, fontFamily:'monospace', lineHeight:1.1 }}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <canvas ref={el => zzRhinoInitCanvas(el)} width={560} height={300}
                    style={{ borderRadius:'10px', width:'100%', display:'block', touchAction:'none', cursor:rDone?'default':'crosshair' }} />
                  {!rStarted && <p style={{ fontSize:'0.63rem', color:'rgba(168,196,178,0.35)', textAlign:'center', margin:'0.45rem 0 0', fontFamily:'DM Sans, sans-serif', fontStyle:'italic' }}>Drag your finger across the pad - slow and heavy, like a 2,700 kg rhino</p>}
                  {rDone && <p style={{ fontSize:'0.63rem', color:'rgba(74,158,107,0.65)', textAlign:'center', margin:'0.45rem 0 0', fontFamily:'DM Sans, sans-serif' }}>{rFootfalls} footfall{rFootfalls!==1?'s':''} recorded · Use your data to answer the next question</p>}
                </div>
              );
            })()}

            {/* Binturong: Canopy Night Vision Scanner */}
            {zzAnimal.id === 'binturong' && (() => {
              const habClass = bintuBrightness<40?'DEEP CANOPY':bintuBrightness<85?'FOREST EDGE':bintuBrightness<130?'UNDERSTORY':bintuBrightness<190?'CLEARING':'OPEN TERRAIN';
              const habColor = bintuBrightness<40?'#4ADE80':bintuBrightness<85?'#4A9E6B':bintuBrightness<130?'#FBBF24':bintuBrightness<190?'#FB923C':'#F87171';
              const camColor = bintuCamIdx>70?'#4ADE80':bintuCamIdx>40?'#FBBF24':'#F87171';
              const camLabel = bintuCamIdx>70?'Well hidden':bintuCamIdx>40?'Partially visible':'Exposed';
              return (
                <div style={{ background:'rgba(0,0,0,0.55)', border:'1px solid rgba(46,125,85,0.35)', borderRadius:'16px', overflow:'hidden', marginBottom:'1rem' }}>
                  <div style={{ background:'rgba(5,18,10,0.95)', padding:'0.6rem 0.85rem', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(46,125,85,0.18)' }}>
                    <div>
                      <p style={{ fontSize:'0.56rem', fontWeight:700, color:'rgba(168,196,178,0.65)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.04rem', fontFamily:'DM Sans, sans-serif' }}>Canopy Night Vision Scanner</p>
                      <p style={{ fontSize:'0.67rem', color:'rgba(255,255,255,0.32)', margin:0, fontFamily:'DM Sans, sans-serif' }}>Binturong · Habitat Light &amp; Camouflage Analysis</p>
                    </div>
                    {bintuScanning && <div style={{ textAlign:'right', flexShrink:0 }}><div style={{ fontSize:'1.7rem', fontWeight:800, color:interTimer<=5?'#F87171':'#4A9E6B', lineHeight:1, fontFamily:'monospace' }}>{interTimer}</div><div style={{ fontSize:'0.5rem', color:'rgba(255,255,255,0.25)', fontFamily:'DM Sans, sans-serif', letterSpacing:'0.1em' }}>SCANNING</div></div>}
                    {bintuDone && <div style={{ fontSize:'0.65rem', color:'#4ADE80', fontWeight:700, fontFamily:'DM Sans, sans-serif' }}>✓ Scan Complete</div>}
                    {!bintuScanning && !bintuDone && !bintuError && <div style={{ fontSize:'0.6rem', color:'rgba(74,158,107,0.5)', fontFamily:'DM Sans, sans-serif', animation:'zzNvPulse 2s ease-in-out infinite' }}>READY</div>}
                  </div>
                  <div style={{ position:'relative', background:'#020806', aspectRatio:'16/9', overflow:'hidden' }}>
                    <video ref={lightVidRef} autoPlay playsInline muted style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', filter:(bintuScanning||bintuDone)?'grayscale(100%) sepia(100%) hue-rotate(85deg) saturate(2.8) brightness(0.72)':'none', opacity:(bintuScanning||bintuDone)?1:0, transition:'opacity 0.6s' }} />
                    {!bintuScanning && !bintuDone && (
                      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background:'radial-gradient(ellipse at 50% 40%,#0A2F1F 0%,#040C06 65%,#020806 100%)' }}>
                        <svg viewBox="0 0 260 140" style={{ width:'100%', maxWidth:'320px', opacity:0.9 }}>
                          <line x1="0" y1="50" x2="120" y2="65" stroke="rgba(46,125,85,0.15)" strokeWidth="6" strokeLinecap="round"/>
                          <line x1="260" y1="40" x2="130" y2="70" stroke="rgba(46,125,85,0.15)" strokeWidth="5" strokeLinecap="round"/>
                          <line x1="60" y1="0" x2="80" y2="55" stroke="rgba(46,125,85,0.1)" strokeWidth="8" strokeLinecap="round"/>
                          <line x1="190" y1="0" x2="170" y2="60" stroke="rgba(46,125,85,0.1)" strokeWidth="7" strokeLinecap="round"/>
                          <ellipse cx="40" cy="30" rx="30" ry="18" fill="rgba(26,82,56,0.25)"/>
                          <ellipse cx="220" cy="25" rx="28" ry="16" fill="rgba(26,82,56,0.2)"/>
                          <ellipse cx="130" cy="15" rx="35" ry="20" fill="rgba(26,82,56,0.18)"/>
                          <line x1="100" y1="60" x2="175" y2="60" stroke="rgba(46,125,85,0.3)" strokeWidth="5" strokeLinecap="round"/>
                          <path d="M168 60 Q185 55 185 70 Q185 82 172 82 Q162 82 162 72" fill="none" stroke="#0C2818" strokeWidth="7" strokeLinecap="round"/>
                          <ellipse cx="135" cy="78" rx="32" ry="13" fill="#0C2818"/>
                          <circle cx="105" cy="74" r="13" fill="#0C2818"/>
                          <ellipse cx="99" cy="63" rx="4" ry="5.5" fill="#0C2818"/>
                          <ellipse cx="111" cy="62" rx="4" ry="5.5" fill="#0C2818"/>
                          <circle cx="101" cy="74" r="2.8" fill="#4A9E6B" opacity="0.9"/>
                          <circle cx="110" cy="74" r="2.8" fill="#4A9E6B" opacity="0.9"/>
                          <circle cx="101" cy="74" r="1.2" fill="#A8C4B2"/>
                          <circle cx="110" cy="74" r="1.2" fill="#A8C4B2"/>
                          {[108,118,128,138,148].map(x=><line key={x} x1={x} y1="61" x2={x-2} y2="56" stroke="#0C2818" strokeWidth="2.5" strokeLinecap="round"/>)}
                          <circle cx="130" cy="78" r="38" fill="none" stroke="rgba(74,158,107,0.22)" strokeWidth="1" strokeDasharray="4 3"/>
                          <line x1="130" y1="35" x2="130" y2="48" stroke="rgba(74,158,107,0.3)" strokeWidth="1"/>
                          <line x1="130" y1="108" x2="130" y2="121" stroke="rgba(74,158,107,0.3)" strokeWidth="1"/>
                          <line x1="87" y1="78" x2="100" y2="78" stroke="rgba(74,158,107,0.3)" strokeWidth="1"/>
                          <line x1="160" y1="78" x2="173" y2="78" stroke="rgba(74,158,107,0.3)" strokeWidth="1"/>
                          <text x="130" y="132" textAnchor="middle" fill="rgba(168,196,178,0.35)" fontSize="9" fontFamily="DM Sans, sans-serif">scanning environment</text>
                        </svg>
                        {bintuError && <p style={{ fontSize:'0.72rem', color:'#F87171', margin:'-0.5rem 0 0', fontFamily:'DM Sans, sans-serif', textAlign:'center' }}>Camera access denied - check permissions</p>}
                      </div>
                    )}
                    {(bintuScanning||bintuDone) && <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(74,158,107,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(74,158,107,0.07) 1px,transparent 1px)', backgroundSize:'28px 28px' }} />}
                    {bintuScanning && <div style={{ position:'absolute', left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent 0%,rgba(74,158,107,0.9) 30%,rgba(168,196,178,0.95) 50%,rgba(74,158,107,0.9) 70%,transparent 100%)', animation:'zzScanLine 2.4s linear infinite', boxShadow:'0 0 8px rgba(74,158,107,0.6)' }} />}
                    {(bintuScanning||bintuDone) && (
                      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
                        {[['8px','8px',null,null],['8px',null,'8px',null],[null,'8px',null,'8px'],[null,null,'8px','8px']].map(([t,l,b,r],i)=>(
                          <div key={i} style={{ position:'absolute', top:t,left:l,bottom:b,right:r, width:'18px', height:'18px', borderTop:t==='8px'?'1.5px solid rgba(74,158,107,0.7)':undefined, borderBottom:b==='8px'?'1.5px solid rgba(74,158,107,0.7)':undefined, borderLeft:l==='8px'?'1.5px solid rgba(74,158,107,0.7)':undefined, borderRight:r==='8px'?'1.5px solid rgba(74,158,107,0.7)':undefined }} />
                        ))}
                        <div style={{ position:'absolute', inset:0, display:'flex', justifyContent:'center', alignItems:'center' }}>
                          <div style={{ position:'relative', width:'44px', height:'44px' }}>
                            <div style={{ position:'absolute', inset:0, border:'1px solid rgba(74,158,107,0.35)', borderRadius:'50%' }} />
                            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'1px', height:'24px', background:'rgba(74,158,107,0.35)' }} />
                            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'24px', height:'1px', background:'rgba(74,158,107,0.35)' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    {bintuScanning && (
                      <div style={{ position:'absolute', bottom:'8px', left:'8px', right:'8px', display:'flex', gap:'5px', pointerEvents:'none' }}>
                        <div style={{ flex:1, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', borderRadius:'7px', padding:'0.28rem 0.5rem', border:'1px solid rgba(74,158,107,0.2)' }}>
                          <div style={{ fontSize:'0.45rem', color:'rgba(168,196,178,0.45)', letterSpacing:'0.12em', fontFamily:'DM Sans, sans-serif' }}>HABITAT ZONE</div>
                          <div style={{ fontSize:'0.68rem', fontWeight:800, color:habColor, fontFamily:'monospace', lineHeight:1.25 }}>{habClass}</div>
                        </div>
                        <div style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', borderRadius:'7px', padding:'0.28rem 0.55rem', border:'1px solid rgba(74,158,107,0.2)' }}>
                          <div style={{ fontSize:'0.45rem', color:'rgba(168,196,178,0.45)', letterSpacing:'0.12em', fontFamily:'DM Sans, sans-serif' }}>CAMOUFLAGE</div>
                          <div style={{ fontSize:'0.68rem', fontWeight:800, color:camColor, fontFamily:'monospace', lineHeight:1.25 }}>{bintuCamIdx}%</div>
                        </div>
                        <div style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', borderRadius:'7px', padding:'0.28rem 0.55rem', border:'1px solid rgba(74,158,107,0.2)', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                          <svg viewBox="0 0 30 18" width="30" height="18">
                            <ellipse cx="15" cy="11" rx="11" ry="5" fill={`rgba(12,40,24,${0.15+(bintuCamIdx/100)*0.85})`}/>
                            <circle cx="8" cy="10" r="5" fill={`rgba(12,40,24,${0.15+(bintuCamIdx/100)*0.85})`}/>
                            <circle cx="7" cy="9.5" r="1.4" fill={`rgba(74,158,107,${0.4+(bintuCamIdx/100)*0.6})`}/>
                            <circle cx="11" cy="9.5" r="1.4" fill={`rgba(74,158,107,${0.4+(bintuCamIdx/100)*0.6})`}/>
                          </svg>
                          <div style={{ fontSize:'0.45rem', color:camColor, fontFamily:'DM Sans, sans-serif', lineHeight:1.2 }}>{camLabel}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding:'0.75rem 0.9rem' }}>
                    {!bintuScanning && !bintuDone && <button className="zz-btn" style={{ width:'100%' }} onClick={zzBintuStart}>Activate Night Scanner →</button>}
                    {bintuScanning && (
                      <div>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.35rem' }}>
                          <span style={{ fontSize:'0.58rem', color:'rgba(168,196,178,0.5)', fontFamily:'DM Sans, sans-serif', letterSpacing:'0.1em' }}>CAMOUFLAGE EFFECTIVENESS</span>
                          <span style={{ fontSize:'0.62rem', color:camColor, fontFamily:'monospace', fontWeight:700 }}>{bintuCamIdx}%</span>
                        </div>
                        <div style={{ height:'7px', borderRadius:'999px', background:'rgba(255,255,255,0.07)', overflow:'hidden', marginBottom:'0.45rem' }}>
                          <div style={{ height:'100%', width:`${bintuCamIdx}%`, background:bintuCamIdx>70?'linear-gradient(90deg,#2E7D55,#4ADE80)':bintuCamIdx>40?'linear-gradient(90deg,#B45309,#FBBF24)':'linear-gradient(90deg,#991B1B,#F87171)', borderRadius:'999px', transition:'width 0.4s ease' }} />
                        </div>
                        <p style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.28)', margin:0, fontFamily:'DM Sans, sans-serif', fontStyle:'italic' }}>{bintuCamIdx>70?'Binturong well-camouflaged - dark fur matches this environment':bintuCamIdx>40?'Partial camouflage - binturong detectable at close range':'Binturong exposed - dark fur stands out against bright light'}</p>
                      </div>
                    )}
                    {bintuDone && <p style={{ fontSize:'0.63rem', color:'rgba(74,158,107,0.65)', fontFamily:'DM Sans, sans-serif', textAlign:'center', margin:0 }}>Habitat scan complete · {bintuReadings.length} light readings captured · Analyse your results below</p>}
                  </div>
                </div>
              );
            })()}

            {/* Sun Bear: Foraging Adaptation Field Sketch */}
            {zzAnimal.id === 'sun-bear' && (() => {
              const COLORS = [{id:'green',hex:'#4A9E6B',label:'Body / Claws'},{id:'amber',hex:'#FBBF24',label:'Tongue / Food'},{id:'white',hex:'rgba(255,255,255,0.85)',label:'Notes'}];
              const LABELS = ['CLAWS','TONGUE','CHEST PATCH','FOOD SOURCE','BODY','ARMS','LEGS','HEAD'];

              function zzInitSunCanvas(canvas) {
                if (!canvas || canvas._zzSunInited) return;
                canvas._zzSunInited = true;
                const ctx = canvas.getContext('2d');
                function drawGrid() {
                  ctx.strokeStyle='rgba(74,158,107,0.08)'; ctx.lineWidth=0.5;
                  for(let x=40;x<canvas.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
                  for(let y=40;y<canvas.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
                  ctx.font='10px DM Sans, sans-serif'; ctx.fillStyle='rgba(74,158,107,0.18)';
                  ctx.fillText('SUN BEAR · FORAGING ANALYSIS',10,canvas.height-10);
                }
                drawGrid();
                let drawing=false;
                function getPos(e){const r=canvas.getBoundingClientRect(),src=e.touches?e.touches[0]:e;return{x:(src.clientX-r.left)*(canvas.width/r.width),y:(src.clientY-r.top)*(canvas.height/r.height)};}
                function start(e){
                  e.preventDefault();
                  if(!sbLabelRef.current){canvas.style.outline='2px solid rgba(251,191,36,0.7)';setTimeout(()=>{canvas.style.outline='';},600);return;}
                  drawing=true;
                  const p=getPos(e);
                  ctx.strokeStyle=sbColorRef.current; ctx.lineWidth=sbSizeRef.current; ctx.lineCap='round'; ctx.lineJoin='round';
                  ctx.beginPath(); ctx.moveTo(p.x,p.y);
                  ctx.save(); ctx.font='bold 9px DM Sans, sans-serif'; ctx.fillStyle=sbColorRef.current;
                  ctx.fillText('▶ '+sbLabelRef.current,p.x+6,p.y-6); ctx.restore();
                  setHasDrawn(true);
                }
                function move(e){e.preventDefault();if(!drawing)return;const p=getPos(e);ctx.strokeStyle=sbColorRef.current;ctx.lineWidth=sbSizeRef.current;ctx.lineTo(p.x,p.y);ctx.stroke();}
                function end(){drawing=false;}
                canvas.addEventListener('mousedown',start); canvas.addEventListener('mousemove',move); canvas.addEventListener('mouseup',end);
                canvas.addEventListener('touchstart',start,{passive:false}); canvas.addEventListener('touchmove',move,{passive:false}); canvas.addEventListener('touchend',end);
              }

              function zzSunClear() {
                if(!sketchRef.current)return;
                const ctx=sketchRef.current.getContext('2d');
                ctx.clearRect(0,0,sketchRef.current.width,sketchRef.current.height);
                ctx.strokeStyle='rgba(74,158,107,0.08)'; ctx.lineWidth=0.5;
                for(let x=40;x<sketchRef.current.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,sketchRef.current.height);ctx.stroke();}
                for(let y=40;y<sketchRef.current.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(sketchRef.current.width,y);ctx.stroke();}
                ctx.font='10px DM Sans, sans-serif'; ctx.fillStyle='rgba(74,158,107,0.18)';
                ctx.fillText('SUN BEAR · FORAGING ANALYSIS',10,sketchRef.current.height-10);
                sketchRef.current._zzSunInited=true;
                setHasDrawn(false);
              }

              return (
                <div style={{ background:'rgba(0,0,0,0.45)', border:'1px solid rgba(46,125,85,0.35)', borderRadius:'16px', padding:'1rem', marginBottom:'1rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
                    <div>
                      <p style={{ fontSize:'0.58rem', fontWeight:700, color:'rgba(168,196,178,0.7)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.1rem', fontFamily:'DM Sans, sans-serif' }}>Foraging Adaptation Field Sketch</p>
                      <p style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.45)', margin:0, fontFamily:'DM Sans, sans-serif' }}>Sketch claws, tongue, body shape, or food sources</p>
                    </div>
                    {hasDrawn && <button onClick={zzSunClear} style={{ fontSize:'0.65rem', color:'rgba(168,196,178,0.55)', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'6px', padding:'0.25rem 0.55rem', cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Clear</button>}
                  </div>
                  <p style={{ fontSize:'0.68rem', color:sbLabel?'rgba(74,158,107,0.7)':'rgba(251,191,36,0.85)', fontFamily:'DM Sans, sans-serif', margin:'0 0 0.5rem', fontWeight:600 }}>
                    {sbLabel?'✓ Label selected - draw on the canvas':'↓ Select a label below, then draw on the canvas'}
                  </p>
                  <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginBottom:'0.65rem' }}>
                    {LABELS.map(lbl=>(
                      <button key={lbl} onClick={()=>{const next=sbLabel===lbl?null:lbl;sbLabelRef.current=next;setSbLabel(next);}}
                        style={{ fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.08em', padding:'0.22rem 0.5rem', borderRadius:'999px', cursor:'pointer', fontFamily:'DM Sans, sans-serif', border:sbLabel===lbl?'1px solid #4A9E6B':'1px solid rgba(255,255,255,0.12)', background:sbLabel===lbl?'rgba(74,158,107,0.2)':'rgba(255,255,255,0.04)', color:sbLabel===lbl?'#4A9E6B':'rgba(255,255,255,0.45)' }}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                  <canvas ref={el=>{sketchRef.current=el;if(el){el._sbColor=sbColor;el._sbSize=sbSize;el._sbLabel=sbLabel;}zzInitSunCanvas(el);}}
                    width={560} height={340}
                    style={{ borderRadius:'10px', background:'rgba(4,10,7,0.85)', touchAction:'none', width:'100%', cursor:sbLabel?'crosshair':'not-allowed', display:'block', transition:'outline 0.2s' }} />
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'0.65rem', flexWrap:'wrap' }}>
                    <span style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.35)', fontFamily:'DM Sans, sans-serif' }}>COLOUR</span>
                    {COLORS.map(c=>(
                      <button key={c.id} title={c.label} onClick={()=>{sbColorRef.current=c.hex;setSbColor(c.hex);}}
                        style={{ width:'22px', height:'22px', borderRadius:'50%', border:sbColor===c.hex?'2px solid white':'2px solid transparent', background:c.hex, cursor:'pointer', flexShrink:0 }} />
                    ))}
                    <span style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.35)', fontFamily:'DM Sans, sans-serif', marginLeft:'0.25rem' }}>SIZE</span>
                    {[2,4,7].map(s=>(
                      <button key={s} onClick={()=>{sbSizeRef.current=s;setSbSize(s);}}
                        style={{ width:`${s*3+10}px`, height:`${s*3+10}px`, borderRadius:'50%', border:sbSize===s?'2px solid white':'1.5px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.15)', cursor:'pointer', flexShrink:0 }} />
                    ))}
                    <span style={{ marginLeft:'auto', fontSize:'0.65rem', color:hasDrawn?'#4A9E6B':'rgba(255,255,255,0.25)', fontFamily:'DM Sans, sans-serif' }}>{hasDrawn?'Sketch recorded ✓':'Draw on the canvas above'}</span>
                  </div>
                </div>
              );
            })()}

            {/* Next button - locked until timed analysis done for tiger/lion/rhino/binturong */}
            {(['tiger','lion','rhino','binturong'].includes(zzAnimal.id) ? interDone : true) && (
              <button
                onClick={() => setZzPhase('mcq')}
                disabled={zzAnimal.id === 'sun-bear' ? !hasDrawn : false}
                className="zz-btn"
                style={{ opacity: zzAnimal.id === 'sun-bear' && !hasDrawn ? 0.4 : 1 }}
              >
                {zzAnimal.id === 'tiger'     ? 'Interpret the Data →'
                  : zzAnimal.id === 'lion'      ? 'Analyse the Recording →'
                  : zzAnimal.id === 'rhino'     ? 'Analyse Structure →'
                  : zzAnimal.id === 'binturong' ? 'Analyse Environment →'
                  : zzAnimal.id === 'sun-bear'  ? (hasDrawn ? 'Analyse Adaptations →' : 'Draw something to continue')
                  : 'Continue →'}
              </button>
            )}
          </div>
        )}

        {/* ── MCQ ─────────────────────────────────────────────────────────── */}
        {zzPhase === 'mcq' && (() => {
          const q       = stageData.question || zzAnimal.question;
          const opts    = stageData.options   || zzAnimal.options;
          const correct = stageData.correct   ?? zzAnimal.correct;
          const activeSamples = tigerTimeline.filter(Boolean).length;
          const stillSamples  = tigerTimeline.filter(v => !v).length;
          const tlTotal       = activeSamples + stillSamples;
          const activePct     = tlTotal > 0 ? Math.round((activeSamples / tlTotal) * 100) : 0;
          const stillPct      = 100 - activePct;
          return (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem', flex:1 }}>

              {/* Tiger - recording data summary */}
              {zzAnimal.id === 'tiger' && (
                <div style={{ background:'rgba(0,0,0,0.45)', border:'1px solid rgba(46,125,85,0.35)', borderRadius:'14px', padding:'1rem', fontFamily:'monospace' }}>
                  <p style={{ fontSize:'0.6rem', fontWeight:700, color:'rgba(168,196,178,0.7)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.6rem', fontFamily:'DM Sans, sans-serif' }}>Your 30-second recording</p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(30,1fr)', gap:'2px', marginBottom:'0.6rem' }}>
                    {[...Array(60)].map((_,i) => (
                      <div key={i} style={{ height:'16px', borderRadius:'2px',
                        background: i < tigerTimeline.length ? (tigerTimeline[i] ? '#4A9E6B' : 'rgba(255,255,255,0.07)') : 'rgba(255,255,255,0.03)',
                        boxShadow: i < tigerTimeline.length && tigerTimeline[i] ? '0 0 3px rgba(74,158,107,0.4)' : 'none'
                      }} />
                    ))}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.4rem' }}>
                    <div>
                      <div style={{ fontSize:'0.6rem', color:'#4A9E6B', fontFamily:'DM Sans, sans-serif', marginBottom:'0.2rem' }}>Active {activePct}%</div>
                      <div style={{ height:'8px', borderRadius:'999px', background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${activePct}%`, background:'linear-gradient(90deg,#2E7D55,#4A9E6B)', borderRadius:'999px' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans, sans-serif', marginBottom:'0.2rem' }}>Still {stillPct}%</div>
                      <div style={{ height:'8px', borderRadius:'999px', background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${stillPct}%`, background:'rgba(255,255,255,0.18)', borderRadius:'999px' }} />
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.35)', margin:0, fontFamily:'DM Sans, sans-serif', fontStyle:'italic' }}>Use this data to answer the question below.</p>
                </div>
              )}

              {/* Lion - audio recording summary */}
              {zzAnimal.id === 'lion' && (() => {
                const maxVol = 100;
                const peakPct = Math.min(100, lionPeak);
                const avgPct  = lionHistory.length > 0 ? Math.min(100, Math.round(lionHistory.reduce((a,b)=>a+b,0)/lionHistory.length)) : 0;
                return (
                  <div style={{ background:'rgba(0,0,0,0.45)', border:'1px solid rgba(46,125,85,0.35)', borderRadius:'14px', padding:'1rem', marginBottom:'0' }}>
                    <p style={{ fontSize:'0.6rem', fontWeight:700, color:'rgba(168,196,178,0.7)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.6rem', fontFamily:'DM Sans, sans-serif' }}>Your 30-second recording</p>
                    <div style={{ display:'flex', gap:'2px', alignItems:'flex-end', height:'48px', background:'rgba(0,0,0,0.35)', borderRadius:'6px', padding:'4px 6px', marginBottom:'0.75rem' }}>
                      {[...Array(60)].map((_,i) => {
                        const v = lionHistory[i];
                        const h = v!=null ? Math.max(3,Math.round((v/maxVol)*40)) : 2;
                        return <div key={i} style={{ flex:1, borderRadius:'1px', alignSelf:'flex-end', height:`${h}px`, background:v!=null?(v/maxVol>0.6?'#FBBF24':'#4A9E6B'):'rgba(255,255,255,0.04)' }} />;
                      })}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.4rem' }}>
                      <div><div style={{ fontSize:'0.6rem', color:'#FBBF24', fontFamily:'DM Sans, sans-serif', marginBottom:'0.2rem' }}>Peak {peakPct}%</div><div style={{ height:'8px', borderRadius:'999px', background:'rgba(255,255,255,0.06)', overflow:'hidden' }}><div style={{ height:'100%', width:`${peakPct}%`, background:'linear-gradient(90deg,#4A9E6B,#FBBF24)', borderRadius:'999px' }} /></div></div>
                      <div><div style={{ fontSize:'0.6rem', color:'#A8C4B2', fontFamily:'DM Sans, sans-serif', marginBottom:'0.2rem' }}>Average {avgPct}%</div><div style={{ height:'8px', borderRadius:'999px', background:'rgba(255,255,255,0.06)', overflow:'hidden' }}><div style={{ height:'100%', width:`${avgPct}%`, background:'rgba(168,196,178,0.5)', borderRadius:'999px' }} /></div></div>
                    </div>
                    <p style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.35)', margin:0, fontFamily:'DM Sans, sans-serif', fontStyle:'italic' }}>Use this sound data to answer the question below.</p>
                  </div>
                );
              })()}

              {/* Binturong - habitat scan results */}
              {zzAnimal.id === 'binturong' && bintuDone && (() => {
                const avgB     = bintuReadings.length > 0 ? Math.round(bintuReadings.reduce((a,b)=>a+b,0)/bintuReadings.length) : bintuBrightness;
                const avgCamIdx = Math.max(0, 100 - Math.round((avgB/255)*100));
                const camColor  = avgCamIdx>70?'#4ADE80':avgCamIdx>40?'#FBBF24':'#F87171';
                const habLabel  = avgB<40?'DEEP CANOPY':avgB<85?'FOREST EDGE':avgB<130?'UNDERSTORY':avgB<190?'CLEARING':'OPEN TERRAIN';
                const habColor  = avgB<40?'#4ADE80':avgB<85?'#4A9E6B':avgB<130?'#FBBF24':avgB<190?'#FB923C':'#F87171';
                const maxH = 36;
                return (
                  <div style={{ background:'rgba(0,0,0,0.45)', border:'1px solid rgba(46,125,85,0.35)', borderRadius:'14px', padding:'1rem', marginBottom:'0' }}>
                    <p style={{ fontSize:'0.6rem', fontWeight:700, color:'rgba(168,196,178,0.7)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.65rem', fontFamily:'DM Sans, sans-serif' }}>Your Habitat Scan Results</p>
                    {bintuReadings.length > 1 && (
                      <div style={{ background:'rgba(5,13,7,0.9)', borderRadius:'8px', padding:'6px 8px', marginBottom:'0.65rem' }}>
                        <div style={{ fontSize:'0.48rem', color:'rgba(168,196,178,0.4)', letterSpacing:'0.1em', fontFamily:'DM Sans, sans-serif', marginBottom:'4px' }}>LIGHT LEVEL OVER 20 SECONDS</div>
                        <div style={{ display:'flex', gap:'2px', alignItems:'flex-end', height:`${maxH}px` }}>
                          {bintuReadings.map((v,i)=>{const h=Math.max(2,Math.round((v/255)*maxH));const bPct=v/255;const col=bPct<0.16?'#4ADE80':bPct<0.33?'#4A9E6B':bPct<0.51?'#FBBF24':bPct<0.75?'#FB923C':'#F87171';return <div key={i} style={{ flex:1, borderRadius:'1px 1px 0 0', height:`${h}px`, background:col, alignSelf:'flex-end', opacity:0.8 }} />;} )}
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'3px' }}>
                          <span style={{ fontSize:'0.42rem', color:'rgba(168,196,178,0.3)', fontFamily:'DM Sans, sans-serif' }}>0s</span>
                          <span style={{ fontSize:'0.42rem', color:'rgba(168,196,178,0.3)', fontFamily:'DM Sans, sans-serif' }}>20s</span>
                        </div>
                      </div>
                    )}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.4rem', marginBottom:'0.5rem' }}>
                      {[{label:'HABITAT ZONE',val:habLabel,col:habColor,small:true},{label:'AVG CAMOUFLAGE',val:`${avgCamIdx}%`,col:camColor},{label:'LIGHT RANGE',val:`${Math.round((bintuMin/255)*100)}–${Math.round((bintuPeak/255)*100)}%`,col:'#A8C4B2'}].map(s=>(
                        <div key={s.label} style={{ background:'rgba(0,0,0,0.4)', borderRadius:'7px', padding:'0.35rem 0.4rem', textAlign:'center' }}>
                          <div style={{ fontSize:'0.48rem', color:'rgba(168,196,178,0.45)', fontFamily:'DM Sans, sans-serif', letterSpacing:'0.08em' }}>{s.label}</div>
                          <div style={{ fontSize:s.small?'0.62rem':'0.88rem', fontWeight:800, color:s.col, fontFamily:'monospace', lineHeight:1.2 }}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ position:'relative', height:'14px', borderRadius:'999px', overflow:'hidden', marginBottom:'0.35rem', background:'linear-gradient(90deg,#4ADE80 0%,#FBBF24 50%,#F87171 100%)' }}>
                      <div style={{ position:'absolute', top:0, bottom:0, left:`${Math.round((avgB/255)*100)}%`, width:'3px', background:'white', borderRadius:'2px', boxShadow:'0 0 6px rgba(255,255,255,0.8)', transform:'translateX(-50%)' }} />
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.45rem' }}>
                      <span style={{ fontSize:'0.48rem', color:'rgba(168,196,178,0.35)', fontFamily:'DM Sans, sans-serif' }}>Deep Canopy (ideal)</span>
                      <span style={{ fontSize:'0.48rem', color:'rgba(168,196,178,0.35)', fontFamily:'DM Sans, sans-serif' }}>Open Terrain (exposed)</span>
                    </div>
                    <p style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.28)', margin:0, fontFamily:'DM Sans, sans-serif', fontStyle:'italic' }}>Use your scan data to answer the question below.</p>
                  </div>
                );
              })()}

              {/* Rhino - movement path + stats */}
              {zzAnimal.id === 'rhino' && (() => {
                const rs = rhinoStateRef.current;
                const pts = rs?.pathPoints || [];
                const rFootfalls = rs?.footfalls || 0;
                const rMaxSpeed  = rs?.maxSpeed  || 0;
                const rDist      = rs?.totalDist || 0;
                const speedLabel = rMaxSpeed>=0.55?'CHARGE':rMaxSpeed>=0.28?'TROT':'WALK';
                const speedColor = rMaxSpeed>=0.55?'#FBBF24':rMaxSpeed>=0.28?'#A8C4B2':'#4A9E6B';
                let svgPath=''; let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
                pts.forEach(([px,py])=>{if(px<minX)minX=px;if(px>maxX)maxX=px;if(py<minY)minY=py;if(py>maxY)maxY=py;});
                const SW=240,SH=72;
                if(pts.length>1){const rangeX=Math.max(1,maxX-minX),rangeY=Math.max(1,maxY-minY);const scale=Math.min((SW-16)/rangeX,(SH-12)/rangeY);const ox=(SW-rangeX*scale)/2-minX*scale,oy=(SH-rangeY*scale)/2-minY*scale;svgPath=pts.map(([px,py],i)=>`${i===0?'M':'L'}${(px*scale+ox).toFixed(1)},${(py*scale+oy).toFixed(1)}`).join(' ');}
                return (
                  <div style={{ background:'rgba(0,0,0,0.45)', border:'1px solid rgba(46,125,85,0.35)', borderRadius:'14px', padding:'1rem', marginBottom:'0' }}>
                    <p style={{ fontSize:'0.6rem', fontWeight:700, color:'rgba(168,196,178,0.7)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.65rem', fontFamily:'DM Sans, sans-serif' }}>Your Movement Recording</p>
                    {svgPath && (
                      <div style={{ background:'rgba(5,13,7,0.9)', borderRadius:'8px', marginBottom:'0.65rem', overflow:'hidden' }}>
                        <svg width="100%" viewBox={`0 0 ${SW} ${SH}`} style={{ display:'block' }}>
                          <path d={svgPath} fill="none" stroke="#4A9E6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"/>
                          <path d={svgPath} fill="none" stroke="rgba(74,158,107,0.25)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.4rem', marginBottom:'0.5rem' }}>
                      {[{label:'FOOTFALLS',val:rFootfalls,col:'#4A9E6B'},{label:'DISTANCE',val:`${Math.round(rDist/8)}m`,col:'#A8C4B2'},{label:'PEAK GAIT',val:speedLabel,col:speedColor}].map(s=>(
                        <div key={s.label} style={{ background:'rgba(0,0,0,0.4)', borderRadius:'7px', padding:'0.35rem 0.4rem', textAlign:'center' }}>
                          <div style={{ fontSize:'0.52rem', color:'rgba(168,196,178,0.45)', fontFamily:'DM Sans, sans-serif', letterSpacing:'0.1em' }}>{s.label}</div>
                          <div style={{ fontSize:'0.9rem', fontWeight:800, color:s.col, fontFamily:'monospace' }}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.3)', margin:0, fontFamily:'DM Sans, sans-serif', fontStyle:'italic' }}>Use your movement data to answer the question below.</p>
                  </div>
                );
              })()}

              {/* Sun Bear - field sketch preview */}
              {zzAnimal.id === 'sun-bear' && hasDrawn && (() => {
                let dataUrl = null;
                try { dataUrl = sketchRef.current?.toDataURL('image/png'); } catch(e) {}
                return (
                  <div style={{ background:'rgba(0,0,0,0.45)', border:'1px solid rgba(46,125,85,0.35)', borderRadius:'14px', padding:'1rem', marginBottom:'0' }}>
                    <p style={{ fontSize:'0.6rem', fontWeight:700, color:'rgba(168,196,178,0.7)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.6rem', fontFamily:'DM Sans, sans-serif' }}>Your Foraging Adaptation Sketch</p>
                    {dataUrl && <img src={dataUrl} alt="Your sketch" style={{ width:'100%', borderRadius:'8px', background:'rgba(4,10,7,0.85)', display:'block', marginBottom:'0.5rem' }} />}
                    <p style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.35)', margin:0, fontFamily:'DM Sans, sans-serif', fontStyle:'italic' }}>Use what you sketched to answer the question below.</p>
                  </div>
                );
              })()}

              {/* Animal image */}
              <div style={{ height:'140px', borderRadius:12, overflow:'hidden' }}>
                <img src={zzAnimal.image} alt={zzAnimal.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', display:'block' }} />
              </div>

              {/* Question + options */}
              <div className="zz-card">
                <div style={{ color:'var(--zz-gold)', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.75rem' }}>Make Your Call</div>
                <p style={{ color:'var(--zz-text)', fontSize:'0.95rem', lineHeight:1.6, margin:'0 0 1rem', fontWeight:600 }}>{q}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                  {opts.map((opt, i) => {
                    let bg = 'rgba(255,255,255,0.06)', border = 'rgba(255,255,255,0.14)';
                    if (mcqRevealed) {
                      if (i === correct) { bg = 'rgba(74,222,128,0.15)'; border = '#4ADE80'; }
                      else if (i === mcqAnswer && i !== correct) { bg = 'rgba(239,68,68,0.15)'; border = '#EF4444'; }
                    } else if (i === mcqAnswer) { bg = 'rgba(255,255,255,0.12)'; border = 'rgba(255,255,255,0.4)'; }
                    return (
                      <button key={i} onClick={() => {
                        if (mcqRevealed) return;
                        if (mcqAnswer === null) setMcqFirstOk(i === correct);
                        setMcqAnswer(i);
                      }}
                      style={{ background:bg, border:`1.5px solid ${border}`, borderRadius:10, padding:'0.85rem 1rem', color:'var(--zz-text)', fontSize:'0.88rem', textAlign:'left', cursor: mcqRevealed ? 'default' : 'pointer', transition:'all 0.15s', lineHeight:1.5, width:'100%' }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {mcqAnswer !== null && !mcqRevealed && (
                <button onClick={() => setMcqShowResult(true)} className="zz-btn">Check Answer</button>
              )}
              {mcqRevealed && (
                <button onClick={() => setZzPhase('observation')} className="zz-btn">Continue →</button>
              )}

              {/* Full-screen result overlay */}
              {mcqShowResult && mcqAnswer !== null && (() => {
                const isRight = mcqAnswer === correct;
                return (
                  <div style={{ position:'fixed', inset:0, zIndex:500, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', textAlign:'center', background: isRight ? 'linear-gradient(135deg,#053318 0%,#0A2E1A 100%)' : 'linear-gradient(135deg,#3B0A0A 0%,#1F0505 100%)' }}>
                    <div style={{ fontSize:'4.5rem', marginBottom:'0.6rem' }}>{isRight ? '✓' : '✗'}</div>
                    <h2 style={{ fontSize:'2.4rem', fontWeight:800, color: isRight ? '#4ADE80' : '#F87171', marginBottom:'0.5rem', lineHeight:1.1 }}>
                      {isRight ? 'Correct!' : 'Not Quite'}
                    </h2>
                    {isRight ? (
                      <p style={{ color:'rgba(168,196,178,0.85)', fontSize:'0.95rem', lineHeight:1.7, maxWidth:'340px', marginBottom:'2rem' }}>
                        {zzAnimal.fact}
                      </p>
                    ) : (
                      <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.92rem', lineHeight:1.7, maxWidth:'320px', marginBottom:'2rem' }}>
                        Review your observations and give it another go.
                      </p>
                    )}
                    {isRight ? (
                      <button
                        onClick={() => { setMcqShowResult(false); setMcqRevealed(true); setZzPhase('observation'); }}
                        className="zz-btn">
                        Continue →
                      </button>
                    ) : (
                      <button
                        onClick={() => { setMcqShowResult(false); setMcqAnswer(null); }}
                        style={{ background:'rgba(248,113,113,0.12)', border:'1.5px solid rgba(248,113,113,0.4)', color:'#F87171', borderRadius:'var(--t-r-pill)', padding:'0.85rem 2.5rem', fontSize:'1rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.04em' }}>
                        Try Again
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* ── OBSERVATION ──────────────────────────────────────────────────── */}
        {zzPhase === 'observation' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem', flex:1 }}>
            {!obsOpen ? (
              /* Countdown - full-width centred, matches live site */
              <div style={{ textAlign:'center', padding:'3rem 1rem 2rem' }}>
                <div style={{ fontSize:'4.5rem', fontWeight:800, color:'#4A9E6B', lineHeight:1, marginBottom:'0.65rem', fontVariantNumeric:'tabular-nums' }}>{obsLock}</div>
                <div style={{ fontSize:'0.85rem', color:'var(--zz-muted)', lineHeight:1.7, marginBottom:'1.75rem' }}>
                  Observe carefully before recording your thoughts.<br/>Watch the {zzAnimal.name} - don't write yet.
                </div>
                <div style={{ height:'4px', borderRadius:'999px', background:'rgba(255,255,255,0.08)', overflow:'hidden', marginBottom:'1.5rem' }}>
                  <div style={{ height:'100%', width:`${((20 - obsLock) / 20) * 100}%`, background:'linear-gradient(90deg,#2E7D55,#4A9E6B)', transition:'width 1s linear', borderRadius:'999px' }} />
                </div>
                <button
                  onClick={() => setObsOpen(true)}
                  className="zz-btn-ghost"
                  style={{ fontSize:'0.78rem', padding:'0.5rem 1.25rem' }}>
                  Skip timer
                </button>
              </div>
            ) : (() => {
                const keeperQ  = stageData.keeperQ || zzAnimal.keeperPrompts?.[0] || 'What does this animal need to survive at night?';
                const obsPrompt = stageData.observationPrompt || zzAnimal.observationPrompt;
                const tip = classStage <= 2
                  ? { header:'Start with:', points:[], starters:['I saw…','I can see…'] }
                  : classStage === 3
                  ? { header:'A good response includes:', points:['What you can observe','One feature or behaviour','Why you think it does that'], starters:['I noticed…','I think this is because…'] }
                  : classStage === 5
                  ? { header:'✓ Stage 5 - Explain and reason:', points:['What did you observe?','Why does this happen?','How does this help the animal or environment?'], starters:['Based on my observation…','This is significant because…','This adaptation allows the animal to…'] }
                  : { header:'✓ A strong response includes:', points:['A clear observation (what + where/what doing)','A relevant concept or feature','A simple explanation or link to survival'], starters:['I observed that…','This may help the animal because…'] };
                const lastName = zzAnimal.name.split(' ').pop().toLowerCase();
                const placeholder = classStage <= 2
                  ? `I can see the ${lastName}… The keeper told me…`
                  : classStage === 5
                  ? `Describe the ${lastName}'s adaptations and behaviour. Then include what the keeper told you about "${keeperQ}"`
                  : `Describe what you observe - what is the ${lastName} doing? What do you notice? Then write what the keeper said when you asked them your question.`;
                return (
                  <>
                    {/* Prompt + keeper question card */}
                    <div className="zz-card">
                      <p style={{ color:'var(--zz-text)', fontSize:'0.95rem', lineHeight:1.6, margin:'0 0 0.85rem', fontWeight:600 }}>{obsPrompt}</p>
                      <div style={{ background:'rgba(46,125,85,0.12)', borderRadius:'10px', padding:'0.7rem 0.85rem', borderLeft:'3px solid rgba(46,125,85,0.55)' }}>
                        <p style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(168,196,178,0.9)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.3rem' }}>Then ask a Taronga keeper:</p>
                        <p style={{ fontSize:'0.84rem', fontStyle:'italic', color:'rgba(255,255,255,0.8)', lineHeight:1.45, margin:'0 0 0.3rem' }}>"{keeperQ}"</p>
                        <p style={{ fontSize:'0.68rem', color:'rgba(168,196,178,0.6)', margin:0 }}>Include what they tell you in your response below.</p>
                      </div>
                    </div>

                    {/* Textarea */}
                    <textarea
                      value={obsText}
                      onChange={e => setObsText(e.target.value)}
                      placeholder={placeholder}
                      rows={8}
                      style={{ width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.05)', border:`1.5px solid ${wordCount >= minWords ? 'rgba(46,125,85,0.55)' : 'rgba(255,255,255,0.1)'}`, borderRadius:12, padding:'0.85rem 1rem', color:'var(--zz-text)', fontSize:'0.92rem', lineHeight:1.65, resize:'vertical', fontFamily:'DM Sans, sans-serif', outline:'none', transition:'border-color 0.2s' }}
                    />
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'-0.5rem' }}>
                      <span style={{ color: wordCount >= minWords ? '#4A9E6B' : 'rgba(255,255,255,0.35)', fontSize:'0.75rem', fontWeight:600 }}>{wordCount}/{minWords} words {wordCount >= minWords ? '✓' : ''}</span>
                      <span style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.3)' }}>Use scientific language to score higher</span>
                    </div>

                    {/* Scaffold tip */}
                    <div style={{ background:'rgba(46,125,85,0.08)', border:'1px solid rgba(46,125,85,0.25)', borderRadius:'10px', padding:'0.75rem 0.9rem' }}>
                      <p style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(168,196,178,0.85)', textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 0.35rem' }}>{tip.header}</p>
                      {tip.points.length > 0 && (
                        <ul style={{ margin:'0 0 0.4rem', paddingLeft:'1rem', fontSize:'0.78rem', color:'rgba(255,255,255,0.6)', lineHeight:1.75 }}>
                          {tip.points.map((pt, i) => <li key={i}>{pt}</li>)}
                        </ul>
                      )}
                      <p style={{ fontSize:'0.68rem', fontWeight:600, color:'rgba(168,196,178,0.7)', margin:'0 0 0.2rem' }}>Sentence starters:</p>
                      {tip.starters.map((s, i) => (
                        <p key={i} style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.5)', margin:'0.1rem 0', paddingLeft:'0.5rem', fontStyle:'italic' }}>"{s}"</p>
                      ))}
                    </div>

                    <button
                      onClick={() => setZzPhase('video')}
                      disabled={wordCount < minWords}
                      className="zz-btn"
                      style={{ opacity: wordCount < minWords ? 0.4 : 1 }}>
                      Next: Capture Video →
                    </button>
                  </>
                );
              })()}
          </div>
        )}

        {/* ── VIDEO ────────────────────────────────────────────────────────── */}
        {/* ── VIDEO ────────────────────────────────────────────────────────── */}
        {zzPhase === 'video' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

            {/* Filming guidance - compact */}
            <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(46,125,85,0.2)', borderRadius:'10px', padding:'0.6rem 0.85rem' }}>
              <p style={{ fontSize:'0.58rem', fontWeight:800, color:'rgba(46,125,85,0.7)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 0.25rem' }}>🎬 What to Capture</p>
              <p style={{ fontSize:'0.78rem', color:'var(--zz-muted)', lineHeight:1.5, margin:0 }}>{(zzAnimal.filmingGuidance||'').split('\n')[0]}</p>
            </div>

            {/* Social Media Night Frame Card */}
            <div style={{ position:'relative' }}>
              <div style={{ borderRadius:'22px', overflow:'hidden', background:'linear-gradient(160deg,#020D06 0%,#040F08 55%,#071E14 100%)', boxShadow:'0 16px 48px rgba(0,0,0,0.75), 0 0 0 1px rgba(46,125,85,0.3)', position:'relative' }}>

                {/* Top bar */}
                <div style={{ padding:'0.85rem 1.1rem', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(0,0,0,0.55)', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize:'0.88rem', fontWeight:700, color:'rgba(255,255,255,0.88)', letterSpacing:'0.03em' }}>Taronga Zoo Sydney</span>
                  <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.48)', letterSpacing:'0.05em' }}>
                    {new Date().toLocaleDateString('en-AU',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}
                  </span>
                </div>

                {/* Camera feed */}
                <div style={{ position:'relative', width:'100%', aspectRatio:'3/4', maxHeight:'28vh', overflow:'hidden', background:'#000' }}>
                  <video ref={zzVideoRef} muted playsInline style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'filter 0.35s ease',
                    filter: nightVision ? 'grayscale(1) brightness(1.6) contrast(1.9) sepia(1) hue-rotate(80deg) saturate(3)' : 'none',
                    transform: zzFrontCam ? 'scaleX(-1)' : 'none',
                  }} />
                  {nightVision && (
                    <div style={{ position:'absolute', inset:0, background:'rgba(0,230,60,0.08)', mixBlendMode:'screen', pointerEvents:'none', transition:'opacity 0.3s' }} />
                  )}
                  {/* Subtle star field overlay */}
                  {[...Array(10)].map((_,i) => (
                    <div key={i} style={{ position:'absolute', left:`${(i*9.3+5)%100}%`, top:`${(i*14.1+8)%100}%`, width:i%3===0?'2px':'1.5px', height:i%3===0?'2px':'1.5px', borderRadius:'50%', background:i%4===0?'#4A9E6B':'rgba(255,255,255,0.6)', opacity:0.35+(i%3)*0.1, pointerEvents:'none' }} />
                  ))}
                  {!vidReady && (
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.4)', fontSize:'0.85rem' }}>Starting camera…</div>
                  )}
                  {zzRecording && (
                    <div style={{ position:'absolute', top:'0.65rem', right:'0.65rem', background:'rgba(220,38,38,0.92)', color:'white', borderRadius:'999px', padding:'0.3rem 0.7rem', fontSize:'0.78rem', fontWeight:700, display:'flex', alignItems:'center', gap:'0.35rem', backdropFilter:'blur(4px)' }}>
                      <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'white', animation:'bflDot 0.8s ease-in-out infinite' }} />
                      REC {zzCountdown}s
                    </div>
                  )}
                  {/* Night vision toggle + flip button */}
                  <div style={{ position:'absolute', bottom:'0.6rem', left:'0.65rem', right:'0.65rem', display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:5 }}>
                    <button
                      onClick={() => setNightVision(v => !v)}
                      style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.28rem 0.7rem 0.28rem 0.4rem', borderRadius:'999px', border: nightVision ? '1.5px solid rgba(0,230,60,0.6)' : '1.5px solid rgba(255,255,255,0.25)', background: nightVision ? 'rgba(0,230,60,0.18)' : 'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)', cursor:'pointer', transition:'all 0.25s' }}
                    >
                      <div style={{ position:'relative', width:'28px', height:'16px', borderRadius:'999px', background: nightVision ? 'rgba(0,230,60,0.5)' : 'rgba(255,255,255,0.18)', transition:'background 0.25s', flexShrink:0 }}>
                        <div style={{ position:'absolute', top:'2px', left: nightVision ? '14px' : '2px', width:'12px', height:'12px', borderRadius:'50%', background: nightVision ? '#00E63C' : 'rgba(255,255,255,0.7)', boxShadow: nightVision ? '0 0 6px rgba(0,230,60,0.9)' : 'none', transition:'left 0.25s, background 0.25s, box-shadow 0.25s' }} />
                      </div>
                      <span style={{ fontSize:'0.62rem', fontWeight:700, color: nightVision ? '#00E63C' : 'rgba(255,255,255,0.65)', textTransform:'uppercase', letterSpacing:'0.1em', whiteSpace:'nowrap', transition:'color 0.25s' }}>
                        {nightVision ? '🟢 Night Vision' : 'Night Vision'}
                      </span>
                    </button>
                    {!zzRecording && (
                      <button onClick={flipZzCamera} style={{ display:'flex', alignItems:'center', gap:'0.3rem', padding:'0.28rem 0.65rem', borderRadius:'999px', border:'1.5px solid rgba(255,255,255,0.3)', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)', cursor:'pointer' }}>
                        <span style={{ fontSize:'0.95rem', color:'rgba(255,255,255,0.85)' }}>⟳</span>
                        <span style={{ fontSize:'0.62rem', fontWeight:700, color:'rgba(255,255,255,0.75)', textTransform:'uppercase', letterSpacing:'0.1em', whiteSpace:'nowrap' }}>Flip</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom panel - inline editable, two-column */}
                <div style={{ padding:'1.1rem 1rem 1.25rem', background:'rgba(6,8,6,0.98)', borderTop:'2px solid rgba(46,125,85,0.3)', position:'relative', overflow:'hidden', display:'flex', alignItems:'flex-start', gap:'0.85rem' }}>
                  {[...Array(8)].map((_,i) => (
                    <div key={i} style={{ position:'absolute', left:`${(i*13+4)%96}%`, top:`${(i*19+6)%80}%`, width:'1.5px', height:'1.5px', borderRadius:'50%', background:'rgba(168,196,178,0.2)', pointerEvents:'none' }} />
                  ))}
                  {/* Left: text content */}
                  <div style={{ flex:1, minWidth:0, position:'relative' }}>
                    <div className="taronga-title" style={{ fontSize:'clamp(1.5rem,5vw,2rem)', color:'white', letterSpacing:'0.1em', marginBottom:'0.35rem', lineHeight:1.05 }}>
                      I WENT TO ZOOSNOOZ!
                    </div>
                    <input
                      value={zzVideoTitle}
                      onChange={e => { if (e.target.value.length <= 40) setZzVideoTitle(e.target.value); }}
                      placeholder={`✏ ${zzAnimal.name} After Dark…`}
                      maxLength={40}
                      style={{ display:'block', width:'100%', boxSizing:'border-box', background:'transparent', border:'none', borderBottom:'2px dashed rgba(46,125,85,0.5)', outline:'none', fontSize:'1.05rem', fontWeight:700, color:'#A8C4B2', fontFamily:'DM Sans, sans-serif', padding:'0.05rem 0 0.25rem', marginBottom:'0.4rem', cursor:'text' }}
                    />
                    <textarea
                      value={zzConservationMsg}
                      onChange={e => { if (e.target.value.length <= 200) setZzConservationMsg(e.target.value); }}
                      placeholder={'✏ Conservation message or information…'}
                      maxLength={200}
                      rows={3}
                      style={{ display:'block', width:'100%', boxSizing:'border-box', background:'transparent', border:'none', outline:'none', fontSize:'0.9rem', fontStyle:'italic', color:'rgba(255,255,255,0.75)', fontFamily:'DM Sans, sans-serif', padding:0, resize:'none', lineHeight:1.6, cursor:'text' }}
                    />
                  </div>
                  {/* Right: logo + hashtags */}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.4rem', flexShrink:0, paddingTop:'0.15rem' }}>
                    <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'68px', filter:'brightness(0) invert(1)', opacity:0.88 }} onError={e=>e.target.style.display='none'} />
                    <span style={{ fontSize:'0.62rem', color:'rgba(168,196,178,0.6)', textTransform:'uppercase', letterSpacing:'0.08em', textAlign:'center', lineHeight:1.6, whiteSpace:'pre-line' }}>{`#ZooSnooz\n#TarongaTracka`}</span>
                  </div>
                </div>
              </div>

              {/* ✏ Tap to fill in callout - hidden during recording */}
              {!zzRecording && (
                <div style={{ position:'absolute', right:0, bottom:'130px', transform:'translateX(calc(100% + 10px))', width:'118px', zIndex:20, pointerEvents:'none' }}>
                  <svg width="44" height="70" viewBox="0 0 44 70" style={{ position:'absolute', left:'-44px', bottom:'18px', overflow:'visible' }}>
                    <path d="M 38 8 C 20 8, 6 28, 6 62" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeDasharray="5,3" strokeLinecap="round"/>
                    <polyline points="0,58 6,68 12,58" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div style={{ background:'rgba(46,125,85,0.25)', border:'1.5px dashed rgba(168,196,178,0.7)', borderRadius:'12px', padding:'0.65rem 0.7rem', backdropFilter:'blur(10px)' }}>
                    <p style={{ fontSize:'0.7rem', color:'white', fontWeight:700, margin:'0 0 0.25rem', lineHeight:1.35 }}>✏ Tap to fill in</p>
                    <p style={{ fontSize:'0.65rem', color:'rgba(184,212,192,0.9)', margin:'0 0 0.2rem', lineHeight:1.35 }}>your title &amp; conservation info!</p>
                    <p style={{ fontSize:'0.55rem', color:'rgba(255,255,255,0.4)', margin:0, fontStyle:'italic' }}>Not recorded</p>
                  </div>
                </div>
              )}
            </div>

            {!zzRecording
              ? <button className="zz-btn" onClick={zzStartRecording}>⏺ Start Recording</button>
              : <button className="zz-btn" style={{ background:'linear-gradient(135deg,#DC2626,#991B1B)' }} onClick={zzStopRecording}>⏹ Stop Recording</button>
            }
            <button className="zz-btn-ghost" style={{ width:'100%', textAlign:'center' }} onClick={zzCompleteMission}>
              Skip video &amp; complete →
            </button>
          </div>
        )}

        {/* ── PREVIEW ──────────────────────────────────────────────────────── */}
        {zzPhase === 'preview' && (() => {
          const animalId = zzAnimal.id;
          const up       = zzUploadProgress[animalId];
          const uploading = up !== undefined && up !== 'done' && up !== 'error';
          return (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

              {/* Social Media Night Frame - Preview */}
              <div style={{ borderRadius:'22px', overflow:'hidden', background:'linear-gradient(160deg,#020D06 0%,#040F08 55%,#071E14 100%)', boxShadow:'0 16px 48px rgba(0,0,0,0.75), 0 0 0 1px rgba(46,125,85,0.3)', position:'relative' }}>

                {/* Top bar */}
                <div style={{ padding:'0.5rem 0.9rem', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(0,0,0,0.55)', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(255,255,255,0.85)', letterSpacing:'0.03em' }}>Taronga Zoo Sydney</span>
                  <span style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.45)', letterSpacing:'0.05em' }}>
                    {new Date().toLocaleDateString('en-AU',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}
                  </span>
                </div>

                {/* Video */}
                <div style={{ position:'relative', aspectRatio:'3/4', maxHeight:'38vh', overflow:'hidden', background:'#000', width:'100%' }}>
                  {zzVideoURLs[animalId]
                    ? <video src={zzVideoURLs[animalId]} controls playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                    : <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--zz-muted)', fontSize:'0.85rem' }}>No video recorded</div>
                  }
                  {[...Array(10)].map((_,i) => (
                    <div key={i} style={{ position:'absolute', left:`${(i*9.3+5)%100}%`, top:`${(i*14.1+8)%100}%`, width:i%3===0?'2px':'1.5px', height:i%3===0?'2px':'1.5px', borderRadius:'50%', background:i%4===0?'#4A9E6B':'rgba(255,255,255,0.6)', opacity:0.3+(i%3)*0.1, pointerEvents:'none' }} />
                  ))}
                </div>

                {/* Bottom panel */}
                <div style={{ padding:'0.75rem 1rem 0.9rem', background:'rgba(6,8,6,0.98)', borderTop:'2px solid rgba(46,125,85,0.3)', position:'relative', overflow:'hidden', display:'flex', alignItems:'flex-start', gap:'0.75rem' }}>
                  {[...Array(6)].map((_,i) => (
                    <div key={i} style={{ position:'absolute', left:`${(i*17+4)%96}%`, top:`${(i*23+6)%80}%`, width:'1.5px', height:'1.5px', borderRadius:'50%', background:'rgba(168,196,178,0.2)', pointerEvents:'none' }} />
                  ))}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="taronga-title" style={{ fontSize:'clamp(1.1rem,4vw,1.5rem)', color:'white', letterSpacing:'0.1em', marginBottom:'0.25rem', lineHeight:1.1 }}>
                      I WENT TO ZOOSNOOZ!
                    </div>
                    <div style={{ fontSize:'0.9rem', fontWeight:700, color:'#A8C4B2', marginBottom:'0.2rem' }}>
                      {zzVideoTitle || zzAnimal.name}
                    </div>
                    {zzConservationMsg && (
                      <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.65)', fontStyle:'italic', lineHeight:1.5, wordBreak:'break-word' }}>
                        &ldquo;{zzConservationMsg}&rdquo;
                      </div>
                    )}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem', flexShrink:0, paddingTop:'0.2rem' }}>
                    <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'40px', filter:'brightness(0) invert(1)', opacity:0.88 }} onError={e=>e.target.style.display='none'} />
                    <span style={{ fontSize:'0.5rem', color:'rgba(168,196,178,0.6)', textTransform:'uppercase', letterSpacing:'0.08em', textAlign:'center', lineHeight:1.5, whiteSpace:'pre-line' }}>{`#ZooSnooz\n#TarongaTracka`}</span>
                  </div>
                </div>
              </div>

              {/* Upload status */}
              {up === 'done' && (
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.6rem 0.85rem', borderRadius:'10px', background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.25)' }}>
                  <span style={{ color:'#4ADE80', fontSize:'0.82rem', fontWeight:600 }}>✓ Saved for your teacher</span>
                </div>
              )}
              {up === 'error' && (
                <div style={{ padding:'0.6rem 0.85rem', borderRadius:'10px', background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.25)' }}>
                  <span style={{ color:'#F87171', fontSize:'0.82rem' }}>Upload failed - video saved locally</span>
                </div>
              )}
              {up !== undefined && up !== 'done' && up !== 'error' && (
                <div style={{ padding:'0.6rem 0.85rem', borderRadius:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem' }}>
                    <span style={{ fontSize:'0.75rem', color:'var(--zz-muted)' }}>Saving video…</span>
                    <span style={{ fontSize:'0.75rem', color:'#4A9E6B', fontWeight:600 }}>{up}%</span>
                  </div>
                  <div style={{ height:'4px', borderRadius:'999px', background:'rgba(255,255,255,0.08)' }}>
                    <div style={{ height:'100%', width:`${up}%`, background:'linear-gradient(90deg,#2E7D55,#4A9E6B)', borderRadius:'999px', transition:'width 0.3s' }} />
                  </div>
                </div>
              )}

              <button
                className="zz-btn"
                onClick={zzCompleteMission}
                disabled={uploading}
                style={{ opacity: uploading ? 0.45 : 1, cursor: uploading ? 'not-allowed' : 'pointer', transition:'opacity 0.3s' }}
              >
                {uploading ? `Saving for teacher… ${up}%` : '✓ Complete Mission'}
              </button>
            </div>
          );
        })()}

      </div>
      </div>
    </div>
  );
}
