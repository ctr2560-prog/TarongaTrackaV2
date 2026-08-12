import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { EVOLVE_CHAPTERS, EVOLVE_STORY_ORDER, EVOLVE_THEME as T, EVOLVE_MIN_WORDS } from '../data/evolveAnimals';
import { buildEvolveFilm, startChapterRecording, pickMimeType } from '../utils/evolveFilm';
import { doc, getDoc, updateDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { normaliseCode, safeStudentId } from '../utils/helpers';

const CLIP_SECONDS = 30;
const wordCount = t => (t.trim().match(/\b[\w']+\b/g) || []).length;

function Shell({ children, onHome, scroll = true }) {
  return (
    <div style={{ position:'fixed', inset:0, background:T.bgGradient, overflowY: scroll ? 'auto' : 'hidden', fontFamily:'var(--t-font)' }}>
      {onHome && (
        <button onClick={onHome}
          style={{ position:'absolute', top:'1rem', right:'1rem', zIndex:60, background:'rgba(0,0,0,0.35)', border:`1px solid ${T.border}`, color:T.text, padding:'0.4rem 0.9rem', borderRadius:999, cursor:'pointer', fontSize:'0.8rem', fontWeight:600, backdropFilter:'blur(8px)' }}>
          Home
        </button>
      )}
      {children}
    </div>
  );
}

export default function EvolveScreen() {
  const { evScreen, setEvScreen, setSessionType, setCurrentScreen, studentName, classCode, clearStudentSession } = useApp();
  const { checkAnimalProximity, locationEnabled, enableLocation } = useStudent();

  const [hydrating, setHydrating] = useState(true);
  const [chapter, setChapter] = useState(null);
  const [phase, setPhase] = useState('insight');          // insight | observe | write | record | preview
  const [done, setDone] = useState({});                    // { [id]: { observation, reflection } }
  const [clipURLs, setClipURLs] = useState({});            // { [id]: objectURL | remote URL }

  const [observeText, setObserveText] = useState('');
  const [reflectText, setReflectText] = useState('');
  const [saving, setSaving] = useState(false);

  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(CLIP_SECONDS);
  const [camError, setCamError] = useState('');
  const [frontCam, setFrontCam] = useState(true);
  const [uploadPct, setUploadPct] = useState({});
  const pendingClipRef = useRef({});   // { [chapterId]: { blob, fileExt, contentType } } for retries

  const [filmPhase, setFilmPhase] = useState('idle');      // idle | building | preview | submitting | sent
  const [filmPct, setFilmPct] = useState(0);
  const [filmURL, setFilmURL] = useState(null);
  const filmBlobRef = useRef(null);

  const videoRef = useRef(null);
  const camRef = useRef(null);
  const recRef = useRef(null);
  const tickRef = useRef(null);

  const allDone = EVOLVE_CHAPTERS.every(c => done[c.id]);
  const filmedCount = EVOLVE_CHAPTERS.filter(c => clipURLs[c.id]).length;

  // ── Resume (learned the hard way on ZooYard: never trust in-memory progress) ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!studentName || !classCode) { setHydrating(false); return; }
      try {
        // getDoc never settles if the device is offline or Firestore is blocked, which would
        // leave the student on the loading screen forever. Losing resumed progress is far
        // better than a dead screen, so the read is raced against a timeout.
        const snap = await Promise.race([
          getDoc(doc(db, 'classes', normaliseCode(classCode), 'students', safeStudentId(studentName))),
          new Promise((_, rej) => setTimeout(() => rej(new Error('evolve-resume-timeout')), 8000)),
        ]);
        const ev = snap.exists() ? (snap.data().evolve || {}) : {};
        if (cancelled) return;
        const d = {}, urls = {};
        EVOLVE_CHAPTERS.forEach(c => {
          const e = ev[c.id];
          if (!e?.completed) return;
          d[c.id] = { observation: e.observation || '', reflection: e.reflection || '' };
          if (e.clipURL) urls[c.id] = e.clipURL;
        });
        setDone(d); setClipURLs(urls);
        if (ev.filmURL) { setFilmURL(ev.filmURL); setFilmPhase('sent'); }
      } catch (e) { console.warn('Evolve resume failed:', e); }
      finally { if (!cancelled) setHydrating(false); }
    })();
    return () => { cancelled = true; };
  }, [classCode, studentName]);

  // ── Camera lifecycle ──
  const stopCam = useCallback(() => {
    camRef.current?.getTracks().forEach(t => t.stop());
    camRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    if (phase !== 'record') { stopCam(); return; }
    let dead = false;
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: frontCam ? 'user' : 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: true,
    }).then(stream => {
      if (dead) { stream.getTracks().forEach(t => t.stop()); return; }
      camRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}); }
    }).catch(err => {
      console.warn('Evolve camera error:', err);
      setCamError('We could not reach your camera. Check permissions, then try again.');
    });
    return () => { dead = true; };
  }, [phase, frontCam, stopCam]);

  useEffect(() => () => { stopCam(); clearInterval(tickRef.current); }, [stopCam]);

  function openChapter(c) {
    if (done[c.id]) return;
    setChapter(c);
    setPhase('insight');
    setObserveText(''); setReflectText(''); setCamError('');
    setCountdown(CLIP_SECONDS);
    setEvScreen('chapter');
  }

  function backToMap() {
    clearInterval(tickRef.current);
    setRecording(false);
    stopCam();
    setChapter(null);
    setEvScreen('map');
  }

  function goHome() {
    if (!window.confirm('Leave Evolve? Anything you have not saved will be lost.')) return;
    stopCam();
    clearStudentSession();
    setCurrentScreen('home');
    setSessionType('standard');
  }

  // ── Recording ──
  function beginRecord() {
    const stream = camRef.current;
    if (!stream || recording) return;
    setCountdown(CLIP_SECONDS);
    const handle = startChapterRecording(stream, {
      onComplete: ({ blob, url, fileExt, contentType }) => {
        setClipURLs(prev => ({ ...prev, [chapter.id]: url }));
        setRecording(false);
        setPhase('preview');
        uploadClip(blob, fileExt, contentType, chapter.id);
      },
      onError: () => { setRecording(false); setCamError('That recording did not save. Please try again.'); },
    });
    if (!handle) { setCamError('Recording is not supported on this device.'); return; }
    recRef.current = handle;
    setRecording(true);
    tickRef.current = setInterval(() => {
      setCountdown(n => {
        if (n <= 1) { clearInterval(tickRef.current); handle.stop(); return 0; }
        return n - 1;
      });
    }, 1000);
  }

  function endRecord() {
    clearInterval(tickRef.current);
    recRef.current?.stop();
  }

  function uploadClip(blob, fileExt, contentType, chapterId) {
    if (!studentName || !classCode) return;
    pendingClipRef.current[chapterId] = { blob, fileExt, contentType };
    try {
      const code = normaliseCode(classCode);
      const sid = safeStudentId(studentName);
      const path = `evolve/${code}/${sid}/${chapterId}.${fileExt}`;
      const task = uploadBytesResumable(storageRef(storage, path), blob, { contentType });
      setUploadPct(p => ({ ...p, [chapterId]: 0 }));
      const stuck = setTimeout(() => {
        setUploadPct(p => (p[chapterId] === 0 ? { ...p, [chapterId]: 'error' } : p));
      }, 12000);
      task.on('state_changed',
        s => {
          const pct = s.totalBytes > 0 ? Math.round((s.bytesTransferred / s.totalBytes) * 100) : 0;
          if (pct > 0) clearTimeout(stuck);
          setUploadPct(p => ({ ...p, [chapterId]: pct }));
        },
        err => { clearTimeout(stuck); console.warn('Evolve clip upload:', err); setUploadPct(p => ({ ...p, [chapterId]: 'error' })); },
        async () => {
          clearTimeout(stuck);
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            await updateDoc(doc(db, 'classes', code, 'students', sid), { [`evolve.${chapterId}.clipURL`]: url });
            setUploadPct(p => ({ ...p, [chapterId]: 'done' }));
          } catch (e) { console.warn('Evolve clip URL:', e); setUploadPct(p => ({ ...p, [chapterId]: 'error' })); }
        });
    } catch (e) { console.warn('Evolve upload init:', e); }
  }

  function retryUpload(chapterId) {
    const p = pendingClipRef.current[chapterId];
    if (!p) return;
    setUploadPct(prev => ({ ...prev, [chapterId]: 0 }));
    uploadClip(p.blob, p.fileExt, p.contentType, chapterId);
  }

  // ── Save chapter ──
  async function saveChapter() {
    if (saving || !chapter) return;
    setSaving(true);
    try {
      const entry = { observation: observeText.trim(), reflection: reflectText.trim() };
      if (studentName && classCode) {
        const code = normaliseCode(classCode);
        const sid = safeStudentId(studentName);
        try {
          // updateDoc so the dotted key nests under evolve.{chapterId} rather than
          // becoming a literal field name containing dots.
          await updateDoc(doc(db, 'classes', code, 'students', sid), {
            [`evolve.${chapter.id}`]: { completed: true, ...entry, chapter: chapter.chapter, order: chapter.order, updatedAt: serverTimestamp() },
          });
        } catch (e) { console.warn('Evolve chapter write failed:', e); }

        // The giraffe chapter is the one that outlives the excursion. It goes to the
        // moderation queue attributed by cohort year, never by student name.
        if (chapter.isAdvice && entry.reflection) {
          try {
            await addDoc(collection(db, 'evolveAdvice'), {
              classCode: code, program: 'evolve', chapterId: chapter.id,
              advice: entry.reflection,
              cohortYear: new Date().getFullYear(),
              status: 'pending', submittedAt: serverTimestamp(),
            });
          } catch (e) { console.warn('Advice submit failed:', e); }
        }
      }
      setDone(prev => ({ ...prev, [chapter.id]: entry }));
      backToMap();
    } finally { setSaving(false); }
  }

  // ── Film ──
  const startFilm = useCallback(() => {
    setFilmPhase('building'); setFilmPct(0); setFilmURL(null);
    setEvScreen('film');
  }, [setEvScreen]);

  useEffect(() => {
    if (evScreen !== 'film' || filmPhase !== 'building') return;
    let cancelled = false;
    (async () => {
      const result = await buildEvolveFilm({
        chapters: EVOLVE_STORY_ORDER,
        clipURLs,
        studentName,
        theme: T,
        onProgress: pct => { if (!cancelled) setFilmPct(pct); },
        isCancelled: () => cancelled,
      });
      if (cancelled) return;
      if (result) { filmBlobRef.current = result.blob; setFilmURL(result.url); }
      setFilmPhase('preview');
    })();
    return () => { cancelled = true; };
  }, [evScreen, filmPhase, clipURLs, studentName]);

  async function submitFilm() {
    if (filmPhase === 'submitting') return;
    setFilmPhase('submitting');
    try {
      const code = normaliseCode(classCode);
      const sid = safeStudentId(studentName);
      let url = null;
      if (filmBlobRef.current) {
        const { fileExt, contentType } = pickMimeType();
        const path = `evolve/${code}/${sid}/film.${fileExt}`;
        const task = uploadBytesResumable(storageRef(storage, path), filmBlobRef.current, { contentType });
        await new Promise((res, rej) => task.on('state_changed', null, rej, res));
        url = await getDownloadURL(task.snapshot.ref);
      }
      const reflections = {};
      EVOLVE_CHAPTERS.forEach(c => { if (done[c.id]) reflections[c.id] = done[c.id]; });
      await setDoc(doc(db, 'evolve_docs', `${code}_${sid}`), {
        classCode: code, studentId: sid, studentName,
        cohortYear: new Date().getFullYear(),
        filmURL: url, reflections, completedAt: serverTimestamp(),
      }, { merge: true });
      await updateDoc(doc(db, 'classes', code, 'students', sid), {
        'evolve.filmURL': url, 'evolve.sessionCompleted': true, 'evolve.completedAt': serverTimestamp(),
      });
      setFilmURL(url || filmURL);
      setFilmPhase('sent');
    } catch (e) {
      console.warn('Evolve film submit failed:', e);
      setFilmPhase('preview');
      window.alert('We could not save your film. Please check your connection and try again.');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  if (hydrating) {
    return (
      <Shell scroll={false}>
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.2rem' }}>
          <img src="/images/logo.png" alt="" style={{ height:60, opacity:0.85 }} onError={e => e.target.style.display='none'} />
          <p style={{ color:T.textDim, fontSize:'0.72rem', letterSpacing:'0.16em', textTransform:'uppercase', fontWeight:700 }}>Loading Evolve</p>
        </div>
      </Shell>
    );
  }

  // ── Film screen ──
  if (evScreen === 'film') {
    return (
      <Shell onHome={goHome}>
        <div style={{ maxWidth:520, margin:'0 auto', padding:'3.5rem 1.25rem 3rem', textAlign:'center' }}>
          {filmPhase === 'building' && (
            <>
              <h2 className="taronga-title" style={{ color:T.text, fontSize:'1.8rem', marginBottom:'0.5rem' }}>Making your film</h2>
              <p style={{ color:T.textDim, fontSize:'0.9rem', lineHeight:1.6, marginBottom:'1.75rem' }}>
                Stitching your chapters together in order. Keep this screen open.
              </p>
              <div style={{ height:8, background:'rgba(0,0,0,0.3)', borderRadius:4, overflow:'hidden', marginBottom:'0.6rem' }}>
                <div style={{ height:'100%', width:`${filmPct}%`, background:T.accent, transition:'width 0.4s' }} />
              </div>
              <p style={{ color:T.accent, fontWeight:700 }}>{filmPct}%</p>
            </>
          )}

          {(filmPhase === 'preview' || filmPhase === 'submitting') && (
            <>
              <h2 className="taronga-title" style={{ color:T.text, fontSize:'1.8rem', marginBottom:'1rem' }}>Your film</h2>
              {filmURL ? (
                <video src={filmURL} controls playsInline style={{ width:'100%', borderRadius:14, marginBottom:'1.25rem', background:'#000' }} />
              ) : (
                <p style={{ color:T.textDim, marginBottom:'1.25rem' }}>
                  Your device could not stitch the film, but every chapter clip has been saved.
                </p>
              )}
              <button onClick={submitFilm} disabled={filmPhase === 'submitting'}
                style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none', background:T.accent, color:'#241503', fontWeight:800, fontSize:'0.95rem', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.7rem' }}>
                {filmPhase === 'submitting' ? 'Saving…' : 'Keep this film'}
              </button>
              <button onClick={() => setEvScreen('map')} style={{ background:'none', border:'none', color:T.textDim, cursor:'pointer', fontSize:'0.85rem' }}>
                ← Back to chapters
              </button>
            </>
          )}

          {filmPhase === 'sent' && (
            <>
              <div style={{ fontSize:'2.4rem', marginBottom:'0.5rem' }}>🌅</div>
              <h2 className="taronga-title" style={{ color:T.text, fontSize:'1.8rem', marginBottom:'0.6rem' }}>That's yours to keep</h2>
              <p style={{ color:T.textDim, fontSize:'0.92rem', lineHeight:1.7, marginBottom:'1.5rem' }}>
                Your film and everything you wrote have been saved. Your teacher can give you the link to keep.
              </p>
              {filmURL && <video src={filmURL} controls playsInline style={{ width:'100%', borderRadius:14, marginBottom:'1.25rem', background:'#000' }} />}
              <button onClick={goHome}
                style={{ width:'100%', padding:'0.9rem', borderRadius:999, border:`1px solid ${T.border}`, background:'rgba(0,0,0,0.25)', color:T.text, fontWeight:700, cursor:'pointer' }}>
                Finish
              </button>
            </>
          )}
        </div>
      </Shell>
    );
  }

  // ── Chapter flow ──
  if (chapter && evScreen === 'chapter') {
    const near = chapter.latitude == null ? { nearby: true } : checkAnimalProximity(chapter);

    return (
      <Shell onHome={backToMap}>
        <div style={{ maxWidth:560, margin:'0 auto', padding:'3.25rem 1.25rem 3rem' }}>
          <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
            <div style={{ fontSize:'0.66rem', fontWeight:800, letterSpacing:'0.22em', textTransform:'uppercase', color:T.accent, marginBottom:'0.4rem' }}>
              Chapter {chapter.order} · {chapter.animalName}
            </div>
            <h2 className="taronga-title" style={{ color:T.text, fontSize:'clamp(1.7rem,5vw,2.2rem)', margin:0 }}>{chapter.chapter}</h2>
          </div>

          {phase === 'insight' && (
            <>
              <img src={chapter.image} alt="" style={{ width:'100%', height:180, objectFit:'cover', borderRadius:14, marginBottom:'1.1rem' }} onError={e => e.target.style.display='none'} />
              <div style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:14, padding:'1.1rem 1.2rem', marginBottom:'1rem' }}>
                <p style={{ color:T.text, fontSize:'0.95rem', lineHeight:1.7, margin:0 }}>{chapter.insight}</p>
              </div>
              <div style={{ background:T.accentSoft, border:`1px solid ${T.border}`, borderRadius:14, padding:'1rem 1.2rem', marginBottom:'1.5rem' }}>
                <div style={{ fontSize:'0.62rem', fontWeight:800, letterSpacing:'0.16em', textTransform:'uppercase', color:T.accent, marginBottom:'0.35rem' }}>Watch for</div>
                <p style={{ color:T.text, fontSize:'0.9rem', lineHeight:1.6, margin:0 }}>{chapter.observePrompt}</p>
              </div>
              <button onClick={() => setPhase('observe')}
                style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none', background:T.accent, color:'#241503', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                I've watched
              </button>
            </>
          )}

          {phase === 'observe' && (
            <>
              <p style={{ color:T.text, fontSize:'1rem', lineHeight:1.6, marginBottom:'0.9rem', fontWeight:600 }}>{chapter.observePrompt}</p>
              <textarea value={observeText} onChange={e => setObserveText(e.target.value)} rows={4}
                placeholder="What did you actually see?"
                style={{ width:'100%', boxSizing:'border-box', background:'rgba(0,0,0,0.28)', border:`1px solid ${T.border}`, borderRadius:12, padding:'0.85rem 1rem', color:T.text, fontSize:'0.95rem', lineHeight:1.6, resize:'vertical', fontFamily:'inherit', outline:'none', marginBottom:'1.25rem' }} />
              <button onClick={() => setPhase('write')} disabled={wordCount(observeText) < 5}
                style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none', background: wordCount(observeText) < 5 ? 'rgba(255,255,255,0.15)' : T.accent, color: wordCount(observeText) < 5 ? T.textDim : '#241503', fontWeight:800, cursor: wordCount(observeText) < 5 ? 'not-allowed' : 'pointer', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                Next
              </button>
            </>
          )}

          {phase === 'write' && (() => {
            const wc = wordCount(reflectText);
            const ready = wc >= EVOLVE_MIN_WORDS;
            return (
              <>
                <p style={{ color:T.text, fontSize:'1rem', lineHeight:1.7, marginBottom:'1rem', fontWeight:600 }}>{chapter.reflectionPrompt}</p>
                {chapter.isAdvice && (
                  <p style={{ color:T.accent, fontSize:'0.8rem', lineHeight:1.6, marginBottom:'0.9rem', background:T.accentSoft, border:`1px solid ${T.border}`, borderRadius:10, padding:'0.7rem 0.9rem' }}>
                    If you're happy for it to be used, this one may be shown to younger students — as "Year 12", never with your name.
                  </p>
                )}
                <textarea value={reflectText} onChange={e => setReflectText(e.target.value)} rows={9}
                  placeholder={chapter.placeholder}
                  style={{ width:'100%', boxSizing:'border-box', background:'rgba(0,0,0,0.28)', border:`1px solid ${ready ? T.accent : T.border}`, borderRadius:12, padding:'0.9rem 1rem', color:T.text, fontSize:'0.98rem', lineHeight:1.75, resize:'vertical', fontFamily:'inherit', outline:'none' }} />
                <div style={{ textAlign:'right', fontSize:'0.78rem', color: ready ? T.accent : T.textDim, margin:'0.4rem 0 1.25rem', fontWeight:600 }}>
                  {wc} / {EVOLVE_MIN_WORDS} words
                </div>
                <button onClick={() => { setCamError(''); setPhase('record'); }} disabled={!ready}
                  style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none', background: ready ? T.accent : 'rgba(255,255,255,0.15)', color: ready ? '#241503' : T.textDim, fontWeight:800, cursor: ready ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                  {ready ? 'To camera' : 'Keep writing'}
                </button>
              </>
            );
          })()}

          {phase === 'record' && (
            <>
              <div style={{ background:T.accentSoft, border:`1px solid ${T.border}`, borderRadius:12, padding:'0.9rem 1.1rem', marginBottom:'1rem' }}>
                <p style={{ color:T.text, fontSize:'0.92rem', lineHeight:1.6, margin:0 }}>{chapter.filmPrompt}</p>
              </div>
              <div style={{ position:'relative', borderRadius:14, overflow:'hidden', background:'#000', marginBottom:'0.9rem' }}>
                <video ref={videoRef} playsInline muted autoPlay style={{ width:'100%', display:'block', transform: frontCam ? 'scaleX(-1)' : 'none' }} />
                {recording && (
                  <div style={{ position:'absolute', top:10, left:10, background:'rgba(200,30,30,0.9)', color:'white', padding:'0.25rem 0.7rem', borderRadius:999, fontSize:'0.78rem', fontWeight:800 }}>
                    ● {countdown}s
                  </div>
                )}
              </div>
              {camError && <p style={{ color:'#FCA5A5', fontSize:'0.85rem', marginBottom:'0.8rem' }}>{camError}</p>}
              <p style={{ color:T.textDim, fontSize:'0.78rem', lineHeight:1.5, marginBottom:'0.9rem' }}>
                It's twilight — hold your torch up near your face so the camera can see you.
              </p>
              <div style={{ display:'flex', gap:'0.6rem' }}>
                {!recording ? (
                  <>
                    <button onClick={() => setFrontCam(f => !f)}
                      style={{ padding:'0.9rem 1rem', borderRadius:999, border:`1px solid ${T.border}`, background:'rgba(0,0,0,0.25)', color:T.text, fontWeight:700, cursor:'pointer', fontSize:'0.85rem' }}>
                      Flip
                    </button>
                    <button onClick={beginRecord}
                      style={{ flex:1, padding:'0.95rem', borderRadius:999, border:'none', background:T.accent, color:'#241503', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                      Record {CLIP_SECONDS}s
                    </button>
                  </>
                ) : (
                  <button onClick={endRecord}
                    style={{ flex:1, padding:'0.95rem', borderRadius:999, border:'none', background:'#C1272D', color:'white', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                    Stop
                  </button>
                )}
              </div>
            </>
          )}

          {phase === 'preview' && (
            <>
              {clipURLs[chapter.id] && (
                <video src={clipURLs[chapter.id]} controls playsInline style={{ width:'100%', borderRadius:14, marginBottom:'0.9rem', background:'#000' }} />
              )}
              {(() => {
                // A clip only reaches the film once Storage has it. Until then the student
                // stays put — walking away mid-upload silently loses that chapter's footage,
                // and they would not find out until the film was made.
                const up = uploadPct[chapter.id];
                const uploading = typeof up === 'number';
                const failed    = up === 'error';
                const uploaded  = up === 'done';
                const pct = uploading ? up : 0;

                return (
                  <>
                    <div style={{ marginBottom:'1.1rem' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.8rem', color: failed ? '#FCA5A5' : uploaded ? T.accent : T.textDim, marginBottom:'0.35rem', fontWeight:600 }}>
                        <span>
                          {uploaded ? '✓ Clip saved'
                            : failed ? 'Your clip did not save'
                            : `Saving your clip… ${pct}%`}
                        </span>
                        {uploading && <span>{pct}%</span>}
                      </div>
                      {!failed && (
                        <div style={{ height:6, background:'rgba(0,0,0,0.3)', borderRadius:3, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${uploaded ? 100 : pct}%`, background:T.accent, transition:'width 0.3s' }} />
                        </div>
                      )}
                      {!uploaded && !failed && (
                        <p style={{ fontSize:'0.74rem', color:T.textDim, margin:'0.4rem 0 0', lineHeight:1.5 }}>
                          Keep this screen open until it finishes, or this chapter will be missing from your film.
                        </p>
                      )}
                      {failed && (
                        <p style={{ fontSize:'0.74rem', color:T.textDim, margin:'0.4rem 0 0', lineHeight:1.5 }}>
                          Check your connection and try again. Your recording is still here.
                        </p>
                      )}
                    </div>

                    {failed ? (
                      <button onClick={() => retryUpload(chapter.id)}
                        style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none', background:T.accent, color:'#241503', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.6rem' }}>
                        Try saving again
                      </button>
                    ) : (
                      <button onClick={saveChapter} disabled={saving || !uploaded}
                        style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none', background: uploaded && !saving ? T.accent : 'rgba(255,255,255,0.15)', color: uploaded && !saving ? '#241503' : T.textDim, fontWeight:800, cursor: uploaded && !saving ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.6rem' }}>
                        {saving ? 'Saving…' : uploaded ? 'Keep this chapter' : 'Waiting for your clip…'}
                      </button>
                    )}

                    <button onClick={() => { setCamError(''); setPhase('record'); setCountdown(CLIP_SECONDS); }} disabled={uploading}
                      style={{ width:'100%', padding:'0.8rem', borderRadius:999, border:`1px solid ${T.border}`, background:'none', color:T.textDim, fontWeight:600, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.45 : 1 }}>
                      Record it again
                    </button>
                  </>
                );
              })()}
            </>
          )}

          {phase !== 'insight' && chapter.latitude != null && !near.nearby && (
            <p style={{ color:T.textDim, fontSize:'0.78rem', textAlign:'center', marginTop:'1rem' }}>
              You've moved away from {chapter.animalName}.
            </p>
          )}
        </div>
      </Shell>
    );
  }

  // ── Map / chapter list ──
  return (
    <Shell onHome={goHome}>
      <div style={{ maxWidth:640, margin:'0 auto', padding:'2.5rem 1.25rem 3rem' }}>
        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <h1 className="taronga-title" style={{ color:T.text, fontSize:'clamp(2rem,7vw,2.8rem)', margin:'0 0 0.3rem', letterSpacing:'0.03em' }}>Evolve</h1>
          <p style={{ color:T.accent, fontSize:'0.92rem', margin:0 }}>Five chapters. One story. Yours.</p>
          {studentName && <p style={{ color:T.textDim, fontSize:'0.82rem', marginTop:'0.5rem' }}>{studentName} · {Object.keys(done).length}/{EVOLVE_CHAPTERS.length} chapters</p>}
        </div>

        {!locationEnabled && (
          <button onClick={() => enableLocation?.()}
            style={{ width:'100%', padding:'0.8rem', borderRadius:12, border:`1px solid ${T.border}`, background:T.accentSoft, color:T.text, fontWeight:700, cursor:'pointer', marginBottom:'1rem', fontSize:'0.85rem' }}>
            Turn on location to unlock chapters
          </button>
        )}

        {allDone && filmPhase !== 'sent' && (
          <div style={{ background:'rgba(255,255,255,0.95)', borderRadius:16, padding:'1.2rem 1.4rem', marginBottom:'1.25rem' }}>
            <p style={{ margin:0, fontWeight:800, color:'#241503', fontSize:'1rem' }}>All five chapters done.</p>
            <p style={{ margin:'0.25rem 0 0.9rem', color:'#6B5A44', fontSize:'0.86rem' }}>
              {filmedCount > 0
                ? `${filmedCount} clip${filmedCount === 1 ? '' : 's'} ready to become your film.`
                : 'Your writing is safe, but none of your clips reached us — so there is nothing to stitch yet. Tell your teacher.'}
            </p>
            <button onClick={startFilm} disabled={filmedCount === 0}
              style={{ width:'100%', padding:'0.85rem', borderRadius:999, border:'none', background: filmedCount === 0 ? '#D8CDBB' : 'linear-gradient(135deg,#C97B33,#8A4F1E)', color:'white', fontWeight:800, cursor: filmedCount === 0 ? 'not-allowed' : 'pointer', textTransform:'uppercase', letterSpacing:'0.06em' }}>
              Make my film
            </button>
          </div>
        )}

        {filmPhase === 'sent' && (
          <button onClick={() => setEvScreen('film')}
            style={{ width:'100%', padding:'0.85rem', borderRadius:12, border:`1px solid ${T.border}`, background:T.accentSoft, color:T.text, fontWeight:700, cursor:'pointer', marginBottom:'1.25rem' }}>
            Watch your film
          </button>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
          {EVOLVE_STORY_ORDER.map(c => {
            const complete = !!done[c.id];
            const near = c.latitude == null ? { nearby: true, distance: null } : checkAnimalProximity(c);
            const locked = !complete && !near.nearby;
            return (
              <button key={c.id} onClick={() => !locked && openChapter(c)} disabled={complete || locked}
                style={{ textAlign:'left', display:'flex', gap:'0.9rem', alignItems:'center', padding:'0.85rem', borderRadius:16, cursor: complete || locked ? 'default' : 'pointer',
                  background: complete ? 'rgba(232,179,60,0.13)' : 'rgba(0,0,0,0.25)',
                  border:`1px solid ${complete ? T.accent : T.border}`, opacity: locked ? 0.5 : 1 }}>
                <div style={{ width:60, height:60, borderRadius:12, flexShrink:0, backgroundImage:`url(${c.image})`, backgroundSize:'cover', backgroundPosition:'center', background: `rgba(0,0,0,0.3) url(${c.image}) center/cover` }} />
                <div style={{ minWidth:0, flex:1 }}>
                  <div style={{ fontSize:'0.62rem', fontWeight:800, letterSpacing:'0.16em', textTransform:'uppercase', color:T.accent }}>Chapter {c.order}</div>
                  <div style={{ fontSize:'1rem', fontWeight:700, color:T.text, lineHeight:1.3 }}>{c.chapter}</div>
                  <div style={{ fontSize:'0.78rem', color:T.textDim }}>
                    {complete ? '✓ Written and filmed'
                      : locked ? `Walk to the ${c.animalName.toLowerCase()}${near.distance != null ? ` · ${near.distance}m away` : ''}`
                      : c.animalName}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
