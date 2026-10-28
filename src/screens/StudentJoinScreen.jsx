import { useState, useEffect } from 'react';
import { doc, collection, getDoc, getDocs, query, where, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { normaliseCode, safeStudentId } from '../utils/helpers';
import { ANIMAL_ALIASES } from '../constants/animals';
import { ensureStudentAuth, loginAsStudent, STUDENT_UID_FIELD } from '../utils/studentAuth';
import { ZOOYARD_ANIMALS } from '../data/zooyardAnimals';

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

  const [step,           setStep]           = useState('code');   // 'code' | 'animal'
  const [joinError,      setJoinError]      = useState('');
  const [lookedUpClass,  setLookedUpClass]  = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [takenAnimals,   setTakenAnimals]   = useState([]);
  const [restoredAnimals,setRestoredAnimals]= useState([]);
  // ⚠️ ZooYard only. In every other mode an animal is a one-off claim; in ZooYard it is "who is
  //    logged in", because the mode runs across several lessons on whatever tablet is free.
  //    `zyProgress` is { [animal]: habitatsDone } and drives the resume labels below.
  const [isZooYardClass, setIsZooYardClass] = useState(false);
  const [zyProgress,     setZyProgress]     = useState({});
  // ⚠️ Holds the animal a student tapped that SOMEONE ALREADY USES. Picking an in-use animal is
  //    a log-in, so the cost of a mis-tap is landing in a classmate's record and adding habitats
  //    to it. 🚫 Never let a resume selection happen on a single tap — there is no password
  //    behind it, and this confirmation is the only thing between a wrong tap and a wrong record.
  const [confirmResume,  setConfirmResume]  = useState(null);
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
          // Known before the picker renders, which is what lets the picker change behaviour.
          setIsZooYardClass(d.sessionType === 'zooyard');
        } else {
          setLookedUpClass(null);
        }
      })
      .catch(() => { if (!cancelled) setLookedUpClass(null); });
    return () => { cancelled = true; };
  }, [classCode]);

  const handleCodeContinue = async () => {
    const code = normaliseCode(classCode);
    if (code.length !== 6) { setJoinError('Code not found - check with your teacher.'); return; }
    if (!lookedUpClass) { setJoinError('Code not found - check with your teacher.'); return; }

    setLoading(true);
    setJoinError('');
    try {
      const studentsSnap = await getDocs(collection(db, 'classes', code, 'students'));
      const taken = [], restored = [], progress = {};
      studentsSnap.docs.forEach(d => {
        const data = d.data();
        if (!data.name) return;
        if (data.restored) restored.push(data.name);
        else taken.push(data.name);
        // ⚠️ Counted from the student's own record, not a stored tally — `zooyard.totalPoints`
        //    exists but says nothing about how many habitats are finished.
        const zy = data.zooyard || {};
        const done = ZOOYARD_ANIMALS.filter(a => zy[a.id]?.completed).length;
        if (done > 0) progress[data.name] = done;
      });
      setTakenAnimals(taken);
      setRestoredAnimals(restored);
      setZyProgress(progress);
      setSelectedAnimal('');
      setStep('animal');
    } catch {
      setJoinError('Could not verify code - check your connection and try again.');
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
        setJoinError('Code not found - check with your teacher.');
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
      localStorage.setItem('tarongaSessionType',  JSON.stringify(joinedSession));

      // Check again whether animal is still available (race condition guard)
      const studentsRef  = collection(db, 'classes', code, 'students');
      const existingQ    = query(studentsRef, where('name', '==', selectedAnimal));
      const existingSnap = await getDocs(existingQ);

      const existingDoc  = existingSnap.empty ? null : existingSnap.docs[0].data();
      const isRestored   = existingDoc?.restored === true;
      // ⚠️ Declared HERE, not below. The ZooYard log-in branch needs it, and a `const` used
      //    before its declaration is a runtime ReferenceError that no build or lint catches.
      const safeId       = safeStudentId(selectedAnimal);

      // ⚠️ ZooYard: an existing record is a LOG-IN, not a collision. Takes over the device claim
      //    so this tablet can save, then falls through with progress untouched.
      // 🚫 Never write anything but the claim here — see loginAsStudent() and the matching
      //    `isClaimOnlyWrite` rule. Resetting state from this path would be refused.
      if (!existingSnap.empty && !isRestored && isZooYardClass) {
        const ok = await loginAsStudent(code, safeId);
        if (!ok) {
          setJoinError(`Could not log in as ${selectedAnimal} on this device. Check the tablet is online and try again.`);
          setLoading(false);
          return;
        }
      } else if (!existingSnap.empty && !isRestored) {
        // Someone else grabbed it - refresh taken list and stay on animal screen
        const allSnap = await getDocs(studentsRef);
        const taken = [], restored = [];
        allSnap.docs.forEach(d => {
          const data = d.data();
          if (!data.name) return;
          if (data.restored) restored.push(data.name);
          else taken.push(data.name);
        });
        setTakenAnimals(taken);
        setRestoredAnimals(restored);
        setSelectedAnimal('');
        setJoinError(`${selectedAnimal} was just taken by a classmate - please choose another.`);
        setLoading(false);
        return;
      }

      // Claim this record for this device. See utils/studentAuth.js — the rules use it to tell
      // this student's own writes apart from anyone else's. Non-fatal if it cannot be obtained.
      const deviceUid = await ensureStudentAuth();

      if (isRestored) {
        // Rejoin — preserve all badges/progress, just clear the restored flag.
        // ⚠️ Re-stamps the uid, because a restored student is often on a different device from
        // the one that first joined.
        await setDoc(doc(db, 'classes', code, 'students', safeId), {
          completed:   false,
          status:      'incomplete',
          restored:    false,
          completedAt: null,
          ...(deviceUid ? { [STUDENT_UID_FIELD]: deviceUid } : {}),
        }, { merge: true });
      } else if (!existingSnap.empty && isZooYardClass) {
        // ⚠️ Already logged in above. 🚫 Do NOT fall into the fresh-join setDoc below — it has no
        //    merge, so it would wipe every habitat this student has finished.
      } else {
        // Fresh join
        await setDoc(doc(db, 'classes', code, 'students', safeId), {
          name:        selectedAnimal,
          classCode:   code,
          totalPoints: 0,
          badges:      [],
          completed:   false,
          status:      'incomplete',
          createdAt:   serverTimestamp(),
          ...(deviceUid ? { [STUDENT_UID_FIELD]: deviceUid } : {}),
        });
      }

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
      setJoinError('Could not join - check your connection and try again.');
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
              <p style={{ color:'var(--t-success)', fontSize:'0.8rem', fontWeight:600, margin:0 }}>✓ {lookedUpClass.className}{lookedUpClass.yearGroup ? ` - ${lookedUpClass.yearGroup}` : ''}</p>
            </div>
          )}

          <button
            onClick={handleCodeContinue}
            disabled={!codeReady || loading}
            style={{ width:'100%', padding:'0.9rem', borderRadius:'var(--t-r-pill)', border:'none', background: codeReady ? 'linear-gradient(135deg, var(--t-eucalyptus), var(--t-mid))' : 'rgba(0,0,0,0.1)', color:'white', fontSize:'1rem', fontWeight:700, cursor: codeReady && !loading ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.09em', transition:'all 0.22s ease', boxShadow: codeReady ? '0 4px 16px rgba(26,82,56,0.35)' : 'none', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Checking…' : 'Continue →'}
          </button>

          <button
            onClick={() => { setJoinError(''); setCurrentScreen('home'); }}
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
              Pick an animal - this is how your teacher will see you. Each alias can only be used once per class.
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

          {/* ── "Is this your animal?" ─────────────────────────────────────────
              ⚠️ ZooYard only, and only for an animal someone is already using. Picking one is a
                 LOG-IN with no password, so a mis-tap puts a child inside a classmate's record.
              ⚠️ Shows how far that animal has got — a child recognises "5 of 8" far more reliably
                 than they recognise a name they chose a week ago.
              ⚠️ Deliberately an in-app sheet, not window.confirm: a native dialog on a school
                 tablet shows the site URL and reads nothing like the rest of the app.
              🚫 Do not add a "don't ask again" option. It is one tap, once per lesson. */}
          {confirmResume && (
            <div style={{ position:'fixed', inset:0, zIndex:900, background:'rgba(8,20,14,0.6)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.25rem' }}>
              <div style={{ background:'white', borderRadius:20, padding:'1.5rem 1.4rem', maxWidth:380, width:'100%', boxShadow:'0 24px 60px rgba(0,0,0,0.4)', textAlign:'center' }}>
                <div style={{ fontSize:'2.4rem', lineHeight:1, marginBottom:'0.6rem' }}>🐾</div>
                <h3 className="taronga-title" style={{ fontSize:'1.5rem', color:'var(--t-deep)', margin:'0 0 0.5rem', letterSpacing:'0.02em', lineHeight:1.2 }}>
                  Is {confirmResume} your animal?
                </h3>
                <p style={{ fontSize:'0.95rem', color:'var(--t-charcoal)', lineHeight:1.55, margin:'0 0 0.75rem' }}>
                  Someone has already used {confirmResume}. Only choose it if it was <strong>your</strong> animal last time.
                </p>
                {zyProgress[confirmResume] > 0 && (
                  <div style={{ background:'#FFFBEB', border:'1.5px solid #FCD34D', borderRadius:12, padding:'0.6rem 0.8rem', margin:'0 0 0.85rem' }}>
                    <p style={{ margin:0, fontSize:'0.88rem', color:'#92650E', fontWeight:700 }}>
                      {confirmResume} has finished {zyProgress[confirmResume]} of {ZOOYARD_ANIMALS.length} habitats.
                    </p>
                    <p style={{ margin:'0.15rem 0 0', fontSize:'0.78rem', color:'#92650E' }}>Does that sound like you?</p>
                  </div>
                )}
                <p style={{ fontSize:'0.85rem', color:'var(--t-slate)', lineHeight:1.5, margin:'0 0 1.1rem' }}>
                  If you are not sure, ask your teacher before you tap yes.
                </p>
                <div style={{ display:'flex', gap:'0.6rem' }}>
                  <button
                    onClick={() => setConfirmResume(null)}
                    style={{ flex:1, padding:'0.85rem 0.6rem', borderRadius:999, border:'1.5px solid var(--t-stone)', background:'white', color:'var(--t-slate)', fontSize:'0.9rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                    Not mine
                  </button>
                  <button
                    onClick={() => { setSelectedAnimal(confirmResume); setConfirmResume(null); }}
                    style={{ flex:1, padding:'0.85rem 0.6rem', borderRadius:999, border:'none', background:'linear-gradient(135deg,#2E7D55,#1A5238)', color:'white', fontSize:'0.9rem', fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>
                    Yes, that’s me
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Animal grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px, 1fr))', gap:'0.5rem', marginBottom:'1.25rem', maxHeight:'52vh', overflowY:'auto', padding:'0.25rem' }}>
            {ANIMAL_ALIASES.map(animal => {
              const claimed  = takenAnimals.includes(animal);
              // ⚠️ In ZooYard an already-used animal is NOT blocked — it is a log-in. Everywhere
              //    else it stays a one-off claim. This single line is the whole behaviour change.
              const taken    = claimed && !isZooYardClass;
              const resume   = claimed && isZooYardClass;
              const doneCount = zyProgress[animal] || 0;
              const restored = restoredAnimals.includes(animal);
              const selected = selectedAnimal === animal;
              return (
                <button
                  key={animal}
                  onClick={() => {
                    if (taken) return;
                    setJoinError('');
                    // A fresh animal selects straight away; an in-use one asks first.
                    if (resume) setConfirmResume(animal);
                    else setSelectedAnimal(animal);
                  }}
                  disabled={taken}
                  style={{
                    padding:'0.6rem 0.5rem',
                    borderRadius:'var(--t-r-sm)',
                    border: selected ? '2.5px solid var(--t-mid)' : taken ? '1.5px solid #e5e7eb' : (restored || resume) ? '1.5px solid #FCD34D' : '1.5px solid var(--t-stone)',
                    background: selected ? 'linear-gradient(135deg, #e8f5ed, #d0edd9)' : taken ? '#f3f4f6' : (restored || resume) ? '#FFFBEB' : 'var(--t-parchment)',
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
                  {taken    && <span style={{ display:'block', fontSize:'0.65rem', color:'#ccc', fontWeight:400, textDecoration:'none', marginTop:'0.1rem' }}>taken</span>}
                  {/* ⚠️ Says how far they got, so a returning student can find themselves. A bare
                      "continue" is no help when 28 animals are in use. */}
                  {resume && !selected && (
                    <span style={{ display:'block', fontSize:'0.65rem', color:'#D97706', fontWeight:700, marginTop:'0.1rem' }}>
                      {doneCount ? `↺ ${doneCount} of ${ZOOYARD_ANIMALS.length} done` : '↺ continue'}
                    </span>
                  )}
                  {restored && !resume && !selected && <span style={{ display:'block', fontSize:'0.65rem', color:'#D97706', fontWeight:700, marginTop:'0.1rem' }}>↺ continue</span>}
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
