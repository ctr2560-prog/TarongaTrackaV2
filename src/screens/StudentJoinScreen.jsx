import { useState, useEffect } from 'react';
import { doc, collection, getDoc, getDocs, query, where, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { normaliseCode, safeStudentId } from '../utils/helpers';
import { ANIMAL_ALIASES } from '../constants/animals';

export default function StudentJoinScreen() {
  const {
    setCurrentScreen,
    studentName, setStudentName,
    classCode, setClassCode,
    setClassStage,
    setClassSubject,
    setSessionType,
    setZzScreen,
  } = useApp();

  const { resetProgress } = useStudent();

  const [step,         setStep]         = useState('code');   // 'code' | 'animal'
  const [joinError,    setJoinError]    = useState('');
  const [lookedUpClass, setLookedUpClass] = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [takenAnimals, setTakenAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState('');

  // Live class-code preview as student types
  useEffect(() => {
    const code = normaliseCode(classCode);
    if (code.length !== 6) { setLookedUpClass(null); return; }
    let cancelled = false;
    getDoc(doc(db, 'classes', code))
      .then(snap => {
        if (cancelled) return;
        if (snap.exists()) {
          const d = snap.data();
          setLookedUpClass({ className: d.className, yearGroup: d.yearGroup });
        } else {
          setLookedUpClass(null);
        }
      })
      .catch(() => { if (!cancelled) setLookedUpClass(null); });
    return () => { cancelled = true; };
  }, [classCode]);

  const handleCodeContinue = async () => {
    const code = normaliseCode(classCode);
    if (code.length !== 6) { setJoinError('Code not found — check with your teacher.'); return; }
    if (!lookedUpClass) { setJoinError('Code not found — check with your teacher.'); return; }

    setLoading(true);
    setJoinError('');
    try {
      const studentsSnap = await getDocs(collection(db, 'classes', code, 'students'));
      const taken = studentsSnap.docs.map(d => d.data().name).filter(Boolean);
      setTakenAnimals(taken);
      setSelectedAnimal('');
      setStep('animal');
    } catch {
      setJoinError('Could not verify code — check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!selectedAnimal) return;
    const code = normaliseCode(classCode);

    setLoading(true);
    setJoinError('');

    try {
      const classSnap = await getDoc(doc(db, 'classes', code));
      if (!classSnap.exists()) {
        setJoinError('Code not found — check with your teacher.');
        setLoading(false);
        return;
      }

      const classData    = classSnap.data();
      const joinedStage   = classData.stage || 4;
      const joinedSession = classData.sessionType || 'standard';
      const joinedSubject = classData.subject || 'science';

      setClassStage(joinedStage);
      setClassSubject(joinedSubject);
      setSessionType(joinedSession);
      setZzScreen('map');
      localStorage.setItem('tarongaClassStage',   JSON.stringify(joinedStage));
      localStorage.setItem('tarongaClassSubject', JSON.stringify(joinedSubject));

      // Check again whether animal is still available (race condition guard)
      const studentsRef  = collection(db, 'classes', code, 'students');
      const existingQ    = query(studentsRef, where('name', '==', selectedAnimal));
      const existingSnap = await getDocs(existingQ);

      if (!existingSnap.empty) {
        // Someone else grabbed it — refresh taken list and stay on animal screen
        const allSnap = await getDocs(studentsRef);
        setTakenAnimals(allSnap.docs.map(d => d.data().name).filter(Boolean));
        setSelectedAnimal('');
        setJoinError(`${selectedAnimal} was just taken by a classmate — please choose another.`);
        setLoading(false);
        return;
      }

      const safeId = safeStudentId(selectedAnimal);
      await setDoc(doc(db, 'classes', code, 'students', safeId), {
        name:        selectedAnimal,
        classCode:   code,
        totalPoints: 0,
        badges:      [],
        completed:   false,
        status:      'incomplete',
        createdAt:   serverTimestamp(),
      });

      setStudentName(selectedAnimal);
      localStorage.setItem('tarongaStudentName', JSON.stringify(selectedAnimal));
      localStorage.setItem('tarongaClassCode',   JSON.stringify(code));
      try {
        localStorage.setItem('studentEssentialCache', JSON.stringify({
          studentName:  selectedAnimal,
          classCode:    code,
          classStage:   joinedStage,
          classSubject: joinedSubject,
          badges:       [],
          foundAnimals: [],
          cachedAt:     Date.now(),
        }));
      } catch(e) {}

      setJoinError('');
      localStorage.removeItem('tarongaTrackaProgress');
      resetProgress();
      setCurrentScreen(joinedSession === 'zoosnooz' ? 'zoosnooz' : 'studentLoading');

    } catch (err) {
      console.error('Join failed:', err);
      setJoinError('Could not join — check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const codeBorder = joinError && step === 'code' ? '#ef4444' : lookedUpClass ? '#22c55e' : 'var(--t-stone)';
  const codeReady  = normaliseCode(classCode).length === 6 && !!lookedUpClass;

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg, var(--t-forest) 0%, var(--t-deep) 55%, var(--t-mid) 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem, 5vw, 2rem)', overflow:'auto' }}>

      {/* ── STEP 1: Class Code ── */}
      {step === 'code' && (
        <div className="animate-scale-in" style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-xl)', padding:'clamp(1.75rem, 4vh, 2.5rem)', maxWidth:'420px', width:'100%', boxShadow:'var(--t-shadow-xl)', border:'1px solid rgba(255,255,255,0.8)' }}>
          <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'linear-gradient(135deg, var(--t-eucalyptus), var(--t-mid))', margin:'0 auto 0.75rem', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(46,125,85,0.32)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h2 className="taronga-title" style={{ fontSize:'clamp(1.5rem, 3.5vh, 1.9rem)', color:'var(--t-deep)', marginBottom:'0.3rem', letterSpacing:'0.04em' }}>Join the Expedition</h2>
            <p style={{ color:'var(--t-slate)', fontSize:'0.88rem', lineHeight:1.5 }}>Enter your class code to get started</p>
          </div>

          <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-charcoal)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.4rem' }}>Class Code</label>
          <input
            type="text"
            value={classCode}
            onChange={e => { setClassCode(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6)); setJoinError(''); }}
            placeholder="e.g. A7K2Q9"
            style={{ width:'100%', padding:'0.8rem 1rem', borderRadius:'var(--t-r-sm)', border:`2px solid ${codeBorder}`, fontSize:'1.2rem', fontFamily:'monospace', fontWeight:700, marginBottom: lookedUpClass || joinError ? '0.4rem' : '1rem', boxSizing:'border-box', transition:'border-color 0.2s', letterSpacing:'0.25em', textAlign:'center', outline:'none', color:'var(--t-ink)', background:'var(--t-parchment)' }}
            onFocus={e => { if (!joinError && !lookedUpClass) e.target.style.borderColor = 'var(--t-mid)'; }}
            onBlur={e  => { if (!joinError && !lookedUpClass) e.target.style.borderColor = 'var(--t-stone)'; }}
            onKeyDown={e => e.key === 'Enter' && codeReady && !loading && handleCodeContinue()}
          />

          {joinError && step === 'code' && (
            <div style={{ background:'var(--t-danger-bg)', border:'1px solid #FECACA', borderRadius:'var(--t-r-xs)', padding:'0.55rem 0.85rem', marginBottom:'0.85rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
              <p style={{ color:'var(--t-danger)', fontSize:'0.8rem', fontWeight:600, margin:0 }}>⚠ {joinError}</p>
            </div>
          )}

          {lookedUpClass && !joinError && (
            <div style={{ background:'var(--t-success-bg)', border:'1px solid #BBF7D0', borderRadius:'var(--t-r-xs)', padding:'0.55rem 0.85rem', marginBottom:'0.85rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
              <p style={{ color:'var(--t-success)', fontSize:'0.8rem', fontWeight:600, margin:0 }}>✓ {lookedUpClass.className}{lookedUpClass.yearGroup ? ` — ${lookedUpClass.yearGroup}` : ''}</p>
            </div>
          )}

          <button
            onClick={handleCodeContinue}
            disabled={!codeReady || loading}
            style={{ width:'100%', padding:'0.9rem', borderRadius:'var(--t-r-pill)', border:'none', background: codeReady ? 'linear-gradient(135deg, var(--t-eucalyptus), var(--t-mid))' : 'rgba(0,0,0,0.1)', color:'white', fontSize:'1rem', fontWeight:700, cursor: codeReady && !loading ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.09em', transition:'all 0.22s ease', boxShadow: codeReady ? '0 4px 16px rgba(26,82,56,0.35)' : 'none', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Checking…' : 'Continue →'}
          </button>

          <button
            onClick={() => { setJoinError(''); setCurrentScreen('schoolEntry'); }}
            style={{ display:'block', width:'100%', background:'none', border:'none', color:'var(--t-ash)', fontSize:'0.82rem', cursor:'pointer', marginTop:'0.85rem', padding:'0.4rem', transition:'color 0.18s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--t-slate)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--t-ash)'}>
            ← Back
          </button>
        </div>
      )}

      {/* ── STEP 2: Animal Alias Picker ── */}
      {step === 'animal' && (
        <div className="animate-scale-in" style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-xl)', padding:'clamp(1.5rem, 4vh, 2rem)', maxWidth:'680px', width:'100%', boxShadow:'var(--t-shadow-xl)', border:'1px solid rgba(255,255,255,0.8)' }}>
          <div style={{ textAlign:'center', marginBottom:'1.25rem' }}>
            <h2 className="taronga-title" style={{ fontSize:'clamp(1.3rem, 3vh, 1.75rem)', color:'var(--t-deep)', marginBottom:'0.3rem', letterSpacing:'0.04em' }}>Choose Your Animal Alias</h2>
            <p style={{ color:'var(--t-slate)', fontSize:'0.85rem', lineHeight:1.5 }}>
              Pick an animal — this is how your teacher will see you. Each alias can only be used once per class.
            </p>
            {lookedUpClass && (
              <div style={{ display:'inline-block', marginTop:'0.5rem', background:'var(--t-success-bg)', border:'1px solid #BBF7D0', borderRadius:'var(--t-r-pill)', padding:'0.3rem 0.9rem' }}>
                <span style={{ color:'var(--t-success)', fontSize:'0.78rem', fontWeight:700 }}>✓ {lookedUpClass.className}</span>
              </div>
            )}
          </div>

          {joinError && (
            <div style={{ background:'var(--t-danger-bg)', border:'1px solid #FECACA', borderRadius:'var(--t-r-xs)', padding:'0.55rem 0.85rem', marginBottom:'0.85rem' }}>
              <p style={{ color:'var(--t-danger)', fontSize:'0.8rem', fontWeight:600, margin:0 }}>⚠ {joinError}</p>
            </div>
          )}

          {/* Animal grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px, 1fr))', gap:'0.5rem', marginBottom:'1.25rem', maxHeight:'52vh', overflowY:'auto', padding:'0.25rem' }}>
            {ANIMAL_ALIASES.map(animal => {
              const taken    = takenAnimals.includes(animal);
              const selected = selectedAnimal === animal;
              return (
                <button
                  key={animal}
                  onClick={() => { if (!taken) { setSelectedAnimal(animal); setJoinError(''); } }}
                  disabled={taken}
                  style={{
                    padding:'0.6rem 0.5rem',
                    borderRadius:'var(--t-r-sm)',
                    border: selected ? '2.5px solid var(--t-mid)' : taken ? '1.5px solid #e5e7eb' : '1.5px solid var(--t-stone)',
                    background: selected ? 'linear-gradient(135deg, #e8f5ed, #d0edd9)' : taken ? '#f3f4f6' : 'var(--t-parchment)',
                    color: selected ? 'var(--t-deep)' : taken ? '#bbb' : 'var(--t-ink)',
                    fontSize:'0.8rem',
                    fontWeight: selected ? 700 : taken ? 400 : 600,
                    fontFamily:'DM Sans, sans-serif',
                    cursor: taken ? 'not-allowed' : 'pointer',
                    textDecoration: taken ? 'line-through' : 'none',
                    transition:'all 0.15s ease',
                    textAlign:'center',
                    lineHeight:1.3,
                    boxShadow: selected ? '0 0 0 3px rgba(27,107,58,0.18)' : 'none',
                    position:'relative',
                  }}>
                  {animal}
                  {taken && <span style={{ display:'block', fontSize:'0.65rem', color:'#ccc', fontWeight:400, textDecoration:'none', marginTop:'0.1rem' }}>taken</span>}
                  {selected && <span style={{ display:'block', fontSize:'0.65rem', color:'var(--t-mid)', fontWeight:700, marginTop:'0.1rem' }}>selected ✓</span>}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleJoin}
            disabled={!selectedAnimal || loading}
            style={{ width:'100%', padding:'0.9rem', borderRadius:'var(--t-r-pill)', border:'none', background: selectedAnimal ? 'linear-gradient(135deg, var(--t-eucalyptus), var(--t-mid))' : 'rgba(0,0,0,0.1)', color:'white', fontSize:'1rem', fontWeight:700, cursor: selectedAnimal && !loading ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.09em', transition:'all 0.22s ease', boxShadow: selectedAnimal ? '0 4px 16px rgba(26,82,56,0.35)' : 'none', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Joining…' : selectedAnimal ? `Join as ${selectedAnimal}` : 'Select an Animal to Continue'}
          </button>

          <button
            onClick={() => { setStep('code'); setSelectedAnimal(''); setJoinError(''); }}
            style={{ display:'block', width:'100%', background:'none', border:'none', color:'var(--t-ash)', fontSize:'0.82rem', cursor:'pointer', marginTop:'0.85rem', padding:'0.4rem', transition:'color 0.18s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--t-slate)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--t-ash)'}>
            ← Change Class Code
          </button>
        </div>
      )}
    </div>
  );
}
