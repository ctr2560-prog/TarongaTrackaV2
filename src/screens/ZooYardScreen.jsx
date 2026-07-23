import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { ZOOYARD_ANIMALS, ZOOYARD_CITIZEN_SCIENCE_TASK, ZOOYARD_HABITAT_THEME } from '../data/zooyardAnimals';
import StudentFeedbackModal from '../components/StudentFeedbackModal';
import { doc, getDoc, setDoc, updateDoc, addDoc, collection, serverTimestamp, increment } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { normaliseCode, safeStudentId, getMinWords } from '../utils/helpers';
import { buildObservationScore } from '../utils/scoring';

function HomeButton({ dark, onHome }) {
  return (
    <button onClick={onHome}
      style={{
        position:'fixed', top:'0.9rem', right:'0.9rem', zIndex:50,
        background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(7,30,20,0.08)',
        border: dark ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(7,30,20,0.15)',
        color: dark ? 'white' : '#0A2F1F',
        padding:'0.4rem 0.85rem', borderRadius:999, cursor:'pointer',
        fontSize:'0.78rem', fontWeight:700, backdropFilter:'blur(6px)',
      }}>
      🏠 Home
    </button>
  );
}

function ZyDoneScreen({ classCode, studentName, totalPoints, onDone }) {
  const [showFeedback, setShowFeedback] = useState(false);
  useState(() => { setTimeout(() => setShowFeedback(true), 1400); });
  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#071E14,#0D3322,#1A5238)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div className="animate-scale-in" style={{ textAlign:'center', maxWidth:'420px', width:'100%' }}>
        <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🌳</div>
        <h2 className="taronga-title" style={{ fontSize:'2rem', color:'white', marginBottom:'0.5rem', letterSpacing:'0.06em' }}>Habitat Hero Submitted!</h2>
        <p style={{ color:'#7EC89A', marginBottom:'0.5rem', fontSize:'0.95rem', fontWeight:700 }}>{totalPoints} points earned</p>
        <p style={{ color:'rgba(255,255,255,0.65)', marginBottom:'2rem', fontSize:'0.9rem', lineHeight:1.6 }}>Your photo has been sent to the Taronga team for approval. Great work building your ZooYard.</p>
        <button onClick={onDone}
          style={{ width:'100%', padding:'0.9rem', background:'linear-gradient(135deg,#2E7D55,#1A5238)', border:'none', borderRadius:'var(--t-r-pill)', color:'white', fontSize:'1rem', fontWeight:800, cursor:'pointer', letterSpacing:'0.06em', textTransform:'uppercase', boxShadow:'0 6px 20px rgba(46,125,85,0.5)' }}>
          Back to Home
        </button>
      </div>
      {showFeedback && (
        <StudentFeedbackModal classCode={classCode} studentName={studentName} sessionType="zooyard" onDone={onDone} />
      )}
    </div>
  );
}

export default function ZooYardScreen() {
  const { zyScreen, setZyScreen, setSessionType, setCurrentScreen, studentName, classCode, classStage, clearStudentSession } = useApp();
  const { setCompletionCardDismissed } = useStudent();

  const [zyAnimal, setZyAnimal] = useState(null);       // currently open animal object
  const [zyPhase,  setZyPhase]  = useState('attest');    // attest | video | activity | written | badge
  const [zyCompleted, setZyCompleted] = useState({});    // { [animalId]: { points, quizCorrect } }
  const [badgeReveal, setBadgeReveal] = useState(null);  // { animal, points, quizCorrect, behaviour, detail, writing }

  const [mcqAnswer,   setMcqAnswer]   = useState(null);
  const [mcqCorrect,  setMcqCorrect]  = useState(null);
  const [mcqRevealed, setMcqRevealed] = useState(false);

  const [obsText, setObsText] = useState('');
  const [savingObs, setSavingObs] = useState(false);

  const [csFile, setCsFile] = useState(null);
  const [csPreview, setCsPreview] = useState(null);
  const [csNote, setCsNote] = useState('');
  const [csUploading, setCsUploading] = useState(false);
  const [csError, setCsError] = useState('');

  const allDone = ZOOYARD_ANIMALS.every(a => zyCompleted[a.id]);
  const totalPoints = Object.values(zyCompleted).reduce((s, c) => s + (c.points || 0), 0);

  function openAnimal(animal) {
    if (zyCompleted[animal.id]) return;
    setZyAnimal(animal);
    setZyPhase('attest');
    setMcqAnswer(null); setMcqCorrect(null); setMcqRevealed(false);
    setObsText('');
  }

  function backToHabitats() {
    setZyAnimal(null);
    setZyPhase('attest');
  }

  function goHome() {
    if (!window.confirm('Leave ZooYard and go home? Anything not yet submitted will be lost.')) return;
    clearStudentSession();
    setCurrentScreen('home');
    setSessionType('standard');
  }

  function selectMcq(idx) {
    if (mcqRevealed) return;
    setMcqAnswer(idx);
    setMcqCorrect(idx === zyAnimal.activity.correct);
    setMcqRevealed(true);
  }

  async function submitWritten() {
    if (!zyAnimal || savingObs) return;
    setSavingObs(true);
    try {
      const scoreResult = buildObservationScore(obsText, zyAnimal.id, classStage, 'science');
      const observationPoints = Math.round(((scoreResult.behaviour + scoreResult.detail + scoreResult.writing) / 15) * 100);
      const quizPoints = mcqCorrect ? 20 : 0;
      const points = observationPoints + quizPoints;

      const badgeData = {
        points, quizCorrect: !!mcqCorrect,
        behaviour: scoreResult.behaviour, detail: scoreResult.detail, writing: scoreResult.writing,
        observation: obsText,
      };

      if (studentName && classCode) {
        const code = normaliseCode(classCode);
        const sid  = safeStudentId(studentName);
        try {
          // updateDoc (not setDoc+merge) so the dotted key nests under zooyard.{animalId}
          // rather than becoming a literal field name containing dots.
          await updateDoc(doc(db, 'classes', code, 'students', sid),
            { [`zooyard.${zyAnimal.id}`]: { completed: true, ...badgeData, updatedAt: serverTimestamp() } }
          );
        } catch (e) { console.warn('ZooYard badge write failed:', e); }
      }

      setZyCompleted(prev => ({ ...prev, [zyAnimal.id]: { points, quizCorrect: !!mcqCorrect, behaviour: scoreResult.behaviour, detail: scoreResult.detail, writing: scoreResult.writing } }));
      setBadgeReveal({ animal: zyAnimal, ...badgeData });
      setZyPhase('badge');
    } finally {
      setSavingObs(false);
    }
  }

  function onCsFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsFile(file);
    setCsPreview(URL.createObjectURL(file));
    setCsError('');
  }

  async function submitCitizenScience() {
    if (!csFile || csUploading) return;
    setCsUploading(true);
    setCsError('');
    try {
      const code = normaliseCode(classCode);
      const sid  = safeStudentId(studentName);

      const classSnap = await getDoc(doc(db, 'classes', code));
      const classData = classSnap.exists() ? classSnap.data() : {};
      const teacherEmail = classData.teacherEmail || '';
      const schoolName   = classData.schoolName || '';

      const ext  = (csFile.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `citizenScienceEvidence/${code}/${sid}-${Date.now()}.${ext}`;
      const snap = await uploadBytes(storageRef(storage, path), csFile);
      const photoUrl = await getDownloadURL(snap.ref);

      await addDoc(collection(db, 'citizenScienceSubmissions'), {
        classCode: code, studentId: sid, studentName, teacherEmail, schoolName,
        program: 'zooyard', taskId: ZOOYARD_CITIZEN_SCIENCE_TASK.id,
        photoUrl, note: csNote.trim(),
        status: 'pending',
        submittedAt: serverTimestamp(),
      });

      await setDoc(doc(db, 'classes', code, 'students', sid), {
        zooyard: {
          citizenScience: { status: 'pending', photoUrl, note: csNote.trim(), submittedAt: serverTimestamp() },
          sessionCompleted: true, totalPoints,
        },
      }, { merge: true });

      // Non-blocking school leaderboard bonus, mirrors completeActivity()'s +10 pattern
      if (schoolName) {
        try {
          const schoolId = schoolName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          setDoc(doc(db, 'schools', schoolId), { name: schoolName, totalPoints: increment(10), lastUpdated: serverTimestamp() }, { merge: true }).catch(() => {});
        } catch {}
      }

      setZyScreen('done');
    } catch (e) {
      console.error('Citizen science submit failed:', e);
      setCsError('Something went wrong uploading your photo. Please try again.');
    } finally {
      setCsUploading(false);
    }
  }

  // ── Done screen ──────────────────────────────────────────────────────────
  if (zyScreen === 'done') {
    return (
      <ZyDoneScreen
        classCode={classCode} studentName={studentName} totalPoints={totalPoints}
        onDone={() => { clearStudentSession(); setCompletionCardDismissed(true); setCurrentScreen('home'); setSessionType('standard'); }}
      />
    );
  }

  // ── Citizen science task ─────────────────────────────────────────────────
  if (zyScreen === 'citizenScience') {
    const task = ZOOYARD_CITIZEN_SCIENCE_TASK;
    return (
      <div style={{ position:'fixed', inset:0, background:'#F0EDE6', overflowY:'auto', fontFamily:'var(--t-font)' }}>
        <HomeButton dark onHome={goHome} />
        <div style={{ background:'linear-gradient(160deg,#071E14,#0D3322,#1A5238)', padding:'2rem 1.5rem 2.5rem', textAlign:'center' }}>
          <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>🌱</div>
          <h1 className="taronga-title" style={{ color:'white', fontSize:'clamp(1.6rem,4vw,2.2rem)', margin:'0 0 0.5rem' }}>{task.title}</h1>
          <p style={{ color:'rgba(255,255,255,0.7)', maxWidth:480, margin:'0 auto', fontSize:'0.92rem', lineHeight:1.6 }}>{task.intro}</p>
        </div>

        <div style={{ maxWidth:520, margin:'0 auto', padding:'1.5rem 1.2rem 3rem' }}>
          <div style={{ background:'white', borderRadius:16, padding:'1.5rem', boxShadow:'0 4px 20px rgba(7,30,20,0.08)', marginBottom:'1.25rem' }}>
            <p style={{ fontWeight:700, color:'#0A2F1F', marginBottom:'0.7rem' }}>{task.instructions}</p>
            <ul style={{ margin:'0 0 1rem', paddingLeft:'1.2rem', color:'#3A4A3F', lineHeight:1.8, fontSize:'0.92rem' }}>
              {task.options.map(o => <li key={o}>{o}</li>)}
            </ul>
            <p style={{ margin:0, color:'#6B6B62', fontSize:'0.88rem', fontWeight:600 }}>{task.callToAction}</p>
          </div>

          <div style={{ background:'white', borderRadius:16, padding:'1.5rem', boxShadow:'0 4px 20px rgba(7,30,20,0.08)' }}>
            <label style={{ display:'block', fontWeight:700, color:'#0A2F1F', marginBottom:'0.6rem' }}>Photo evidence</label>
            {csPreview ? (
              <img src={csPreview} alt="" style={{ width:'100%', maxHeight:280, objectFit:'cover', borderRadius:12, marginBottom:'0.8rem' }} />
            ) : (
              <div style={{ border:'2px dashed #D8D4C8', borderRadius:12, padding:'2rem 1rem', textAlign:'center', color:'#A8B4AC', marginBottom:'0.8rem' }}>
                No photo selected yet
              </div>
            )}
            <input type="file" accept="image/*" capture="environment" onChange={onCsFileChange}
              style={{ width:'100%', marginBottom:'1rem', fontSize:'0.85rem' }} />

            <label style={{ display:'block', fontWeight:700, color:'#0A2F1F', marginBottom:'0.4rem' }}>Tell us about it (optional)</label>
            <textarea value={csNote} onChange={e => setCsNote(e.target.value)} rows={3}
              placeholder="What did you build or improve, and why does it help wildlife?"
              style={{ width:'100%', padding:'0.7rem', borderRadius:10, border:'1px solid #D8D4C8', fontSize:'0.9rem', fontFamily:'inherit', resize:'vertical', boxSizing:'border-box', marginBottom:'1rem' }} />

            {csError && <p style={{ color:'#DC2626', fontSize:'0.85rem', marginBottom:'0.8rem' }}>{csError}</p>}

            <button onClick={submitCitizenScience} disabled={!csFile || csUploading}
              style={{ width:'100%', padding:'0.9rem', borderRadius:999, border:'none', background: !csFile || csUploading ? '#CCC' : 'linear-gradient(135deg,#2E7D55,#1A5238)', color:'white', fontSize:'0.95rem', fontWeight:800, cursor: !csFile || csUploading ? 'not-allowed' : 'pointer', textTransform:'uppercase', letterSpacing:'0.06em' }}>
              {csUploading ? 'Submitting…' : 'Submit Habitat Hero'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Per-animal phases ────────────────────────────────────────────────────
  if (zyAnimal && zyPhase === 'attest') {
    const attestTheme = ZOOYARD_HABITAT_THEME[zyAnimal.habitatArea] || ZOOYARD_HABITAT_THEME.bushland;
    return (
      <div style={{ position:'fixed', inset:0, background:attestTheme.bgGradient, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem', overflow:'hidden' }}>
        <HomeButton dark onHome={backToHabitats} />
        <video
          key={attestTheme.videoBg}
          autoPlay loop muted playsInline
          src={attestTheme.videoBg}
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.6) 100%)' }} />
        <div className="animate-scale-in" style={{ position:'relative', background:'white', borderRadius:20, padding:'2rem 1.75rem', maxWidth:420, width:'100%', textAlign:'center' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>📍</div>
          <h2 className="taronga-title" style={{ fontSize:'1.5rem', color:'#0A2F1F', marginBottom:'0.5rem' }}>{zyAnimal.habitatLabel}</h2>
          <p style={{ color:'#3A4A3F', fontSize:'0.95rem', lineHeight:1.6, marginBottom:'1.5rem' }}>{zyAnimal.selfAttestPrompt}</p>
          <p style={{ fontWeight:700, color:'#0A2F1F', marginBottom:'1.25rem' }}>{zyAnimal.selfAttestQuestion}</p>
          <button onClick={() => setZyPhase('video')}
            style={{ width:'100%', padding:'0.85rem', borderRadius:999, border:'none', background:zyAnimal.habitatColor, color:'white', fontSize:'0.95rem', fontWeight:800, cursor:'pointer', marginBottom:'0.6rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>
            Yes, I'm ready
          </button>
          <button onClick={backToHabitats} style={{ background:'none', border:'none', color:'#6B6B62', fontSize:'0.85rem', cursor:'pointer' }}>
            ← Not yet, go back
          </button>
        </div>
      </div>
    );
  }

  if (zyAnimal && zyPhase === 'video') {
    return (
      <div style={{ position:'fixed', inset:0, background:'#071E14', display:'flex', flexDirection:'column' }}>
        <HomeButton dark onHome={backToHabitats} />
        <div style={{ padding:'0.9rem 1.2rem', color:'white', fontWeight:700 }}>{zyAnimal.name} · {zyAnimal.habitatLabel}</div>
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          {zyAnimal.videoUrl ? (
            <video src={zyAnimal.videoUrl} controls autoPlay style={{ maxWidth:'100%', maxHeight:'100%', borderRadius:12 }} />
          ) : (
            <div style={{ background:'rgba(255,255,255,0.06)', border:'1px dashed rgba(255,255,255,0.25)', borderRadius:16, padding:'2.5rem 2rem', textAlign:'center', maxWidth:420 }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🎬</div>
              <p style={{ color:'white', fontWeight:700, marginBottom:'0.5rem' }}>Video coming soon</p>
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.85rem', lineHeight:1.6 }}>Your teacher will add a video here about the {zyAnimal.name.toLowerCase()}'s habitat.</p>
            </div>
          )}
        </div>
        <div style={{ padding:'1rem 1.2rem 1.5rem' }}>
          <button onClick={() => setZyPhase('activity')}
            style={{ width:'100%', padding:'0.9rem', borderRadius:999, border:'none', background:'linear-gradient(135deg,#2E7D55,#1A5238)', color:'white', fontSize:'0.95rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (zyAnimal && zyPhase === 'activity') {
    const a = zyAnimal.activity;
    const theme = ZOOYARD_HABITAT_THEME[zyAnimal.habitatArea] || ZOOYARD_HABITAT_THEME.bushland;
    return (
      <div style={{ position:'fixed', inset:0, background:theme.bgGradient, display:'flex', flexDirection:'column', fontFamily:'var(--t-font)', overflow:'hidden' }}>
        <HomeButton dark onHome={backToHabitats} />

        <video
          key={theme.videoBg}
          autoPlay loop muted playsInline
          src={theme.videoBg}
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.65) 100%)' }} />

        <div style={{ position:'relative', flex:1, overflowY:'auto', padding:'3.5rem 1.2rem 1.5rem', display:'flex', flexDirection:'column', alignItems:'center' }}>
          {/* Hero */}
          <div style={{ textAlign:'center', marginBottom:'1.25rem' }}>
            <div style={{ position:'relative', width:96, height:96, margin:'0 auto 0.75rem' }}>
              <img src={zyAnimal.image} alt="" style={{ width:96, height:96, objectFit:'cover', borderRadius:'50%', border:`4px solid ${theme.accent}`, boxShadow:`0 8px 28px ${theme.accent}66` }} />
              <div style={{ position:'absolute', bottom:-4, right:-4, width:34, height:34, borderRadius:'50%', background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.25)' }}>{theme.icon}</div>
            </div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:999, padding:'0.25rem 0.75rem', backdropFilter:'blur(6px)' }}>
              <span style={{ color:'white', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.04em' }}>{zyAnimal.habitatLabel.toUpperCase()} · {zyAnimal.name.toUpperCase()}</span>
            </div>
          </div>

          {/* Question card */}
          <div style={{ width:'100%', maxWidth:480, background:theme.cardGradient, backdropFilter:'blur(4px)', borderRadius:20, padding:'1.5rem 1.4rem', boxShadow:'0 16px 40px rgba(0,0,0,0.28)' }}>
            <h2 style={{ fontSize:'1.1rem', color:'#0A2F1F', marginBottom:'1.15rem', lineHeight:1.45, fontWeight:700 }}>{a.question}</h2>
            {a.options.map((opt, idx) => {
              const isSelected = mcqAnswer === idx;
              const isCorrectOpt = idx === a.correct;
              let bg = 'white', border = `1.5px solid ${theme.accentBorder}`, color = '#0A2F1F';
              if (mcqRevealed && isCorrectOpt) { bg = 'rgba(46,125,85,0.12)'; border = '2px solid #2E7D55'; }
              else if (mcqRevealed && isSelected && !isCorrectOpt) { bg = 'rgba(220,38,38,0.08)'; border = '2px solid #DC2626'; }
              else if (!mcqRevealed) { bg = theme.accentSoft; }
              return (
                <button key={idx} onClick={() => selectMcq(idx)} disabled={mcqRevealed}
                  style={{ display:'block', width:'100%', textAlign:'left', padding:'0.85rem 1rem', marginBottom:'0.6rem', borderRadius:12, background:bg, border, color, fontSize:'0.92rem', cursor: mcqRevealed ? 'default' : 'pointer', fontFamily:'inherit', transition:'background 0.15s, border-color 0.15s' }}>
                  {opt}
                </button>
              );
            })}
            {mcqRevealed && (
              <div style={{ background:'white', borderRadius:12, padding:'1rem 1.1rem', marginTop:'0.9rem', boxShadow:'0 2px 10px rgba(7,30,20,0.08)', borderLeft:`4px solid ${mcqCorrect ? '#2E7D55' : '#DC2626'}` }}>
                <p style={{ margin:0, fontWeight:700, color: mcqCorrect ? '#2E7D55' : '#DC2626', marginBottom:'0.4rem' }}>{mcqCorrect ? 'Correct!' : 'Not quite'}</p>
                <p style={{ margin:0, color:'#3A4A3F', fontSize:'0.88rem', lineHeight:1.6 }}>{a.fact}</p>
              </div>
            )}
          </div>
        </div>

        {mcqRevealed && (
          <div style={{ position:'relative', padding:'1rem 1.2rem 1.5rem', maxWidth:480, margin:'0 auto', width:'100%', boxSizing:'border-box' }}>
            <button onClick={() => setZyPhase('written')}
              style={{ width:'100%', padding:'0.9rem', borderRadius:999, border:'none', background:`linear-gradient(135deg, ${theme.accent}, #0A2F1F)`, color:'white', fontSize:'0.95rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:`0 8px 22px ${theme.accent}55` }}>
              Continue
            </button>
          </div>
        )}
      </div>
    );
  }

  if (zyAnimal && zyPhase === 'written') {
    const minWords = getMinWords(classStage);
    const wordCount = obsText.trim().match(/\b\w+\b/g)?.length || 0;
    const prompt = zyAnimal.writingPromptByStage[classStage] || zyAnimal.writingPromptByStage[4];
    return (
      <div style={{ position:'fixed', inset:0, background:'#F0EDE6', display:'flex', flexDirection:'column', fontFamily:'var(--t-font)' }}>
        <HomeButton dark onHome={backToHabitats} />
        <div style={{ background:zyAnimal.habitatColor, padding:'0.9rem 1.2rem', color:'white', fontWeight:700 }}>{zyAnimal.name} · Write it up</div>
        <div style={{ flex:1, overflowY:'auto', padding:'1.5rem 1.2rem', maxWidth:520, margin:'0 auto', width:'100%', boxSizing:'border-box' }}>
          <p style={{ fontSize:'1.05rem', color:'#0A2F1F', marginBottom:'1rem', lineHeight:1.5, fontWeight:600 }}>{prompt}</p>
          <textarea value={obsText} onChange={e => setObsText(e.target.value)} rows={7}
            placeholder="Write your response here..."
            style={{ width:'100%', padding:'0.9rem', borderRadius:12, border:'1px solid #D8D4C8', fontSize:'0.95rem', fontFamily:'inherit', resize:'vertical', boxSizing:'border-box', lineHeight:1.6 }} />
          <div style={{ textAlign:'right', fontSize:'0.78rem', color: wordCount >= minWords ? '#2E7D55' : '#A8B4AC', marginTop:'0.4rem', fontWeight:600 }}>
            {wordCount} / {minWords} words minimum
          </div>
        </div>
        <div style={{ padding:'1rem 1.2rem 1.5rem', maxWidth:520, margin:'0 auto', width:'100%', boxSizing:'border-box' }}>
          <button onClick={submitWritten} disabled={wordCount < minWords || savingObs}
            style={{ width:'100%', padding:'0.9rem', borderRadius:999, border:'none', background: wordCount < minWords || savingObs ? '#CCC' : 'linear-gradient(135deg,#2E7D55,#1A5238)', color:'white', fontSize:'0.95rem', fontWeight:800, cursor: wordCount < minWords || savingObs ? 'not-allowed' : 'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>
            {savingObs ? 'Saving…' : wordCount < minWords ? 'Write more to continue' : 'Submit & Earn Badge'}
          </button>
        </div>
      </div>
    );
  }

  if (zyAnimal && zyPhase === 'badge' && badgeReveal) {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#071E14,#0D3322,#1A5238)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
        <HomeButton dark onHome={backToHabitats} />
        <div className="animate-scale-in" style={{ background:'white', borderRadius:20, padding:'2rem 1.75rem', maxWidth:420, width:'100%', textAlign:'center' }}>
          <img src={badgeReveal.animal.image} alt="" style={{ width:88, height:88, objectFit:'cover', borderRadius:'50%', margin:'0 auto 1rem', display:'block', border:`4px solid ${badgeReveal.animal.habitatColor}` }} />
          <h2 className="taronga-title" style={{ fontSize:'1.5rem', color:'#0A2F1F', marginBottom:'0.3rem' }}>{badgeReveal.animal.name} Badge Earned!</h2>
          <p style={{ fontSize:'1.8rem', fontWeight:800, color:'#2E7D55', margin:'0.5rem 0 1.25rem' }}>+{badgeReveal.points} pts</p>
          <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1.5rem' }}>
            {[['Behaviour', badgeReveal.behaviour], ['Detail', badgeReveal.detail], ['Writing', badgeReveal.writing]].map(([label, val]) => (
              <div key={label} style={{ flex:1, background:'#F0EDE6', borderRadius:10, padding:'0.6rem 0.4rem' }}>
                <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#0A2F1F' }}>{val}/5</div>
                <div style={{ fontSize:'0.66rem', color:'#6B6B62', textTransform:'uppercase', fontWeight:700 }}>{label}</div>
              </div>
            ))}
          </div>
          <button onClick={backToHabitats}
            style={{ width:'100%', padding:'0.85rem', borderRadius:999, border:'none', background:'linear-gradient(135deg,#2E7D55,#1A5238)', color:'white', fontSize:'0.95rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (zyScreen === 'collection') {
    const totalDoneColl = Object.keys(zyCompleted).length;
    const quizFirstTryColl = Object.values(zyCompleted).filter(c => c.quizCorrect).length;
    return (
      <div style={{ minHeight:'100vh', background:'#0A2F1F', color:'white', paddingBottom:'2rem' }}>
        <div style={{ background:'linear-gradient(to bottom,rgba(10,47,31,0.98),rgba(7,30,20,0.95))', borderBottom:'1px solid rgba(46,125,85,0.25)', padding:'0.75rem 1rem', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(12px)' }}>
          <button onClick={() => setZyScreen('habitats')}
            style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.22)', color:'white', padding:'0.45rem 1rem', borderRadius:999, cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>
            ← Back
          </button>
          <h1 className="taronga-title" style={{ fontSize:'1.4rem', color:'white', letterSpacing:'0.05em', margin:0 }}>
            Habitat Badges
          </h1>
          <div style={{ width:'70px' }} />
        </div>

        <div style={{ padding:'1.25rem 1rem', maxWidth:600, margin:'0 auto' }}>
          {ZOOYARD_ANIMALS.map(animal => {
            const badge = zyCompleted[animal.id];
            const earned = !!badge;
            const b = badge?.behaviour || 0;
            const d = badge?.detail    || 0;
            const w = badge?.writing   || 0;
            return (
              <div key={animal.id} style={{ background: earned ? 'linear-gradient(135deg,rgba(46,125,85,0.22),rgba(10,47,31,0.9))' : 'rgba(255,255,255,0.04)', border: earned ? '1px solid rgba(46,125,85,0.4)' : '1px solid rgba(255,255,255,0.1)', borderRadius:16, marginBottom:'0.85rem', overflow:'hidden', display:'flex', gap:'1rem', padding:'1rem', alignItems:'flex-start' }}>
                <div style={{ flexShrink:0, width:72, height:72, borderRadius:'50%', backgroundImage: earned ? `url(/images/badge-${animal.id}.png)` : 'none', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition:'center', backgroundColor: earned ? 'transparent' : 'rgba(255,255,255,0.04)', border: earned ? '2px solid rgba(46,125,85,0.5)' : '2px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>
                  {!earned && <span style={{ opacity:0.4 }}>🔒</span>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.35rem' }}>
                    <div>
                      <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color: earned ? 'white' : 'rgba(255,255,255,0.35)' }}>{animal.name}</h3>
                      <p style={{ margin:0, fontSize:'0.72rem', color:'rgba(255,255,255,0.5)', fontStyle:'italic' }}>{animal.habitatLabel}</p>
                    </div>
                    {earned && (
                      <div style={{ background:'rgba(46,125,85,0.3)', border:'1px solid rgba(46,125,85,0.4)', borderRadius:20, padding:'0.2rem 0.65rem', fontSize:'0.85rem', fontWeight:800, color:'#7EC89A', whiteSpace:'nowrap' }}>
                        {badge.points} pts
                      </div>
                    )}
                  </div>
                  {earned ? (
                    <>
                      <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.5rem' }}>
                        {[['Behaviour', b, '#4A9E6B'], ['Detail', d, '#38BDF8'], ['Writing', w, '#F472B6']].map(([label, val, color]) => (
                          <div key={label} style={{ flex:1 }}>
                            <div style={{ fontSize:'0.58rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>{label}</div>
                            <div style={{ height:5, background:'rgba(255,255,255,0.08)', borderRadius:3, overflow:'hidden' }}>
                              <div style={{ height:'100%', width:`${(val/5)*100}%`, background:color, borderRadius:3 }} />
                            </div>
                            <div style={{ fontSize:'0.65rem', color, fontWeight:700, marginTop:2 }}>{val}/5</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: badge.quizCorrect ? 'rgba(74,158,107,0.2)' : 'rgba(239,68,68,0.15)', border: `1px solid ${badge.quizCorrect ? 'rgba(74,158,107,0.4)' : 'rgba(239,68,68,0.3)'}`, borderRadius:20, padding:'0.15rem 0.6rem', fontSize:'0.68rem', fontWeight:700, color: badge.quizCorrect ? '#4A9E6B' : '#FCA5A5', display:'inline-block' }}>
                        {badge.quizCorrect ? '✓ Quiz +20' : '✗ Quiz +0'}
                      </div>
                    </>
                  ) : (
                    <p style={{ margin:'0.25rem 0 0', fontSize:'0.8rem', color:'rgba(255,255,255,0.3)', fontStyle:'italic' }}>Not yet explored</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ maxWidth:600, margin:'0 auto', padding:'0 1rem' }}>
          <div style={{ background:'linear-gradient(135deg,rgba(46,125,85,0.2),rgba(10,47,31,0.5))', border:'1px solid rgba(46,125,85,0.3)', borderRadius:16, padding:'1.25rem 1.5rem', display:'flex', justifyContent:'space-around', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.8rem', fontWeight:800, color:'#F4C542' }}>{totalPoints}</div>
              <div style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Total Points</div>
            </div>
            <div style={{ width:1, height:40, background:'rgba(46,125,85,0.3)' }} />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.8rem', fontWeight:800, color:'white' }}>
                {totalDoneColl}<span style={{ fontSize:'1.1rem', opacity:0.4 }}>/{ZOOYARD_ANIMALS.length}</span>
              </div>
              <div style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Habitats</div>
            </div>
            <div style={{ width:1, height:40, background:'rgba(46,125,85,0.3)' }} />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.8rem', fontWeight:800, color:'#4A9E6B' }}>
                {quizFirstTryColl}<span style={{ fontSize:'1.1rem', opacity:0.4 }}>/{totalDoneColl}</span>
              </div>
              <div style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Quiz First Try</div>
            </div>
          </div>

          <button onClick={goHome}
            style={{ width:'100%', marginTop:'1rem', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.22)', color:'white', padding:'0.75rem 1rem', borderRadius:999, cursor:'pointer', fontSize:'0.85rem', fontWeight:700 }}>
            🚪 Log Out
          </button>
        </div>
      </div>
    );
  }

  // ── Habitat picker (default) ─────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, var(--jungle-deep) 0%, var(--jungle-mid) 50%, var(--jungle-light) 100%)', overflowY:'auto' }}>
      <div className="student-header">
        <div className="student-banner-mobile student-header-inner">
          <div className="logo-title-block" style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <img src="/images/logo.png" alt="Taronga Tracka" style={{ height:'90px', width:'auto' }} onError={e => e.target.style.display='none'} />
            <div>
              <h1 className="taronga-title" style={{ fontSize:'clamp(1.6rem, 3.5vw, 2.2rem)', color:'white', marginBottom:'0.2rem', letterSpacing:'0.04em', textShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>ZooYard</h1>
              <p className="serif-accent" style={{ color:'var(--safari-gold)', fontSize:'1rem' }}>Build your habitat, right here at school</p>
            </div>
          </div>
          {studentName && (
            <div className="student-name-pill" style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.22)', borderRadius:'var(--t-r-pill)', padding:'0.4rem 0.9rem', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)' }}>
              <span style={{ color:'white', fontSize:'0.82rem', fontWeight:600 }}>👤 {studentName}</span>
            </div>
          )}
          <button className="student-points-chip" onClick={() => setZyScreen('collection')}>
            <div className="pts-value">{totalPoints}</div>
            <div className="pts-label">{Object.keys(zyCompleted).length}/{ZOOYARD_ANIMALS.length} Habitats</div>
          </button>
        </div>
      </div>

      {allDone && (
        <div style={{ margin:'1.25rem 1.2rem 0', background:'rgba(255,255,255,0.95)', borderRadius:16, padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap', boxShadow:'0 8px 28px rgba(7,30,20,0.2)' }}>
          <div>
            <p style={{ margin:0, fontWeight:800, color:'#0A2F1F', fontSize:'1rem' }}>🌱 Habitat Hero unlocked!</p>
            <p style={{ margin:'0.2rem 0 0', color:'#6B6B62', fontSize:'0.85rem' }}>All three habitats complete — time for your citizen science task.</p>
          </div>
          <button onClick={() => setZyScreen('citizenScience')}
            style={{ padding:'0.7rem 1.4rem', borderRadius:999, border:'none', background:'linear-gradient(135deg,#2E7D55,#1A5238)', color:'white', fontSize:'0.88rem', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>
            Start Habitat Hero
          </button>
        </div>
      )}

      <div className="discovery-grid">
        {ZOOYARD_ANIMALS.map(animal => {
          const done = !!zyCompleted[animal.id];
          return (
            <div key={animal.id} className={`discovery-card${done ? ' dc-found' : ''}`} onClick={() => openAnimal(animal)}>
              <div className="discovery-card-img" style={{ backgroundImage:`url(${animal.image})` }} />
              <div className="discovery-card-overlay" />
              <div className="discovery-card-body">
                <div className="dc-pill" style={{ background: done ? 'rgba(46,125,85,0.85)' : 'rgba(255,255,255,0.18)', marginBottom:'0.5rem' }}>{animal.habitatLabel}</div>
                <div className="dc-name">{animal.name}</div>
                <div className="dc-scientific">{animal.scientificName}</div>
                <p style={{ margin:0, color:'rgba(255,255,255,0.85)', fontSize:'0.85rem', fontWeight:700 }}>
                  {done ? `✓ Complete · +${zyCompleted[animal.id].points} pts` : 'Tap to begin'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
