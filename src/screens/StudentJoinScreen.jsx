import { useState, useEffect } from 'react';
import { doc, collection, getDoc, getDocs, query, where, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../context/AppContext';
import { normaliseCode, safeStudentId } from '../utils/helpers';

export default function StudentJoinScreen() {
  const {
    setCurrentScreen,
    studentName, setStudentName,
    classCode, setClassCode,
    setClassStage,
    setSessionType,
    setZzScreen,
  } = useApp();

  const [joinError, setJoinError]       = useState('');
  const [lookedUpClass, setLookedUpClass] = useState(null);
  const [loading, setLoading]           = useState(false);

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

  const handleJoin = async () => {
    if (!classCode.trim() || !studentName.trim()) return;
    const code = normaliseCode(classCode);
    if (code.length !== 6) { setJoinError('Code not found — check with your teacher.'); return; }

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
      const joinedStage  = classData.stage || 4;
      const joinedSession = classData.sessionType || 'standard';

      setClassStage(joinedStage);
      setSessionType(joinedSession);
      setZzScreen('map');
      localStorage.setItem('tarongaClassStage', JSON.stringify(joinedStage));

      // Check for existing student session
      const studentsRef = collection(db, 'classes', code, 'students');
      const existingQ   = query(studentsRef, where('name', '==', studentName.trim()));
      const existingSnap = await getDocs(existingQ);

      const restoredBadges = existingSnap.empty ? [] : (existingSnap.docs[0].data().badges || []);

      if (existingSnap.empty) {
        const safeId = safeStudentId(studentName.trim());
        await setDoc(doc(db, 'classes', code, 'students', safeId), {
          name:        studentName.trim(),
          classCode:   code,
          totalPoints: 0,
          badges:      [],
          completed:   false,
          status:      'incomplete',
          createdAt:   serverTimestamp(),
        });
      }

      localStorage.setItem('tarongaStudentName', JSON.stringify(studentName.trim()));
      localStorage.setItem('tarongaClassCode',   JSON.stringify(code));
      try {
        localStorage.setItem('studentEssentialCache', JSON.stringify({
          studentName:  studentName.trim(),
          classCode:    code,
          classStage:   joinedStage,
          badges:       restoredBadges,
          foundAnimals: restoredBadges.map(b => b.animalId).filter(Boolean),
          cachedAt:     Date.now(),
        }));
      } catch(e) {}

      setJoinError('');
      localStorage.removeItem('tarongaTrackaProgress');
      setCurrentScreen(joinedSession === 'zoosnooz' ? 'zoosnooz' : 'studentLoading');

    } catch (err) {
      console.error('Join failed:', err);
      // Offline fallback
      try {
        const cached = JSON.parse(localStorage.getItem('studentEssentialCache') || 'null');
        if (cached && cached.studentName === studentName.trim() && cached.classCode === code) {
          setClassStage(cached.classStage || 4);
          localStorage.setItem('tarongaClassStage', JSON.stringify(cached.classStage || 4));
          localStorage.setItem('tarongaStudentName', JSON.stringify(studentName.trim()));
          localStorage.setItem('tarongaClassCode',   JSON.stringify(code));
          setJoinError('');
          setCurrentScreen('studentLoading');
          return;
        }
      } catch(e2) {}
      setJoinError('Could not verify code — check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const isReady = classCode.trim().length > 0 && studentName.trim().length > 0;
  const codeBorder = joinError ? '#ef4444' : lookedUpClass ? '#22c55e' : 'var(--t-stone)';

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg, var(--t-forest) 0%, var(--t-deep) 55%, var(--t-mid) 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem, 5vw, 2rem)', overflow:'auto' }}>
      <div className="animate-scale-in" style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-xl)', padding:'clamp(1.75rem, 4vh, 2.5rem)', maxWidth:'420px', width:'100%', boxShadow:'var(--t-shadow-xl)', border:'1px solid rgba(255,255,255,0.8)' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'linear-gradient(135deg, var(--t-eucalyptus), var(--t-mid))', margin:'0 auto 0.75rem', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(46,125,85,0.32)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h2 className="taronga-title" style={{ fontSize:'clamp(1.5rem, 3.5vh, 1.9rem)', color:'var(--t-deep)', marginBottom:'0.3rem', letterSpacing:'0.04em' }}>Student Join</h2>
          <p style={{ color:'var(--t-slate)', fontSize:'0.88rem', lineHeight:1.5 }}>Enter your class code and first name to join</p>
        </div>

        {/* Class Code */}
        <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-charcoal)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.4rem' }}>Class Code</label>
        <input
          type="text"
          value={classCode}
          onChange={e => { setClassCode(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6)); setJoinError(''); }}
          placeholder="e.g. A7K2Q9"
          style={{ width:'100%', padding:'0.8rem 1rem', borderRadius:'var(--t-r-sm)', border:`2px solid ${codeBorder}`, fontSize:'1.2rem', fontFamily:'monospace', fontWeight:700, marginBottom: lookedUpClass || joinError ? '0.4rem' : '1rem', boxSizing:'border-box', transition:'border-color 0.2s', letterSpacing:'0.25em', textAlign:'center', outline:'none', color:'var(--t-ink)', background:'var(--t-parchment)' }}
          onFocus={e => { if (!joinError && !lookedUpClass) e.target.style.borderColor = 'var(--t-mid)'; }}
          onBlur={e  => { if (!joinError && !lookedUpClass) e.target.style.borderColor = 'var(--t-stone)'; }}
        />

        {joinError && (
          <div style={{ background:'var(--t-danger-bg)', border:'1px solid #FECACA', borderRadius:'var(--t-r-xs)', padding:'0.55rem 0.85rem', marginBottom:'0.85rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
            <p style={{ color:'var(--t-danger)', fontSize:'0.8rem', fontWeight:600, margin:0 }}>⚠ {joinError}</p>
          </div>
        )}

        {lookedUpClass && !joinError && (
          <div style={{ background:'var(--t-success-bg)', border:'1px solid #BBF7D0', borderRadius:'var(--t-r-xs)', padding:'0.55rem 0.85rem', marginBottom:'0.85rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
            <p style={{ color:'var(--t-success)', fontSize:'0.8rem', fontWeight:600, margin:0 }}>✓ {lookedUpClass.className} — {lookedUpClass.yearGroup}</p>
          </div>
        )}

        {/* Student Name */}
        <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-charcoal)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.4rem' }}>First Name</label>
        <input
          type="text"
          value={studentName}
          onChange={e => setStudentName(e.target.value)}
          placeholder="e.g. Alex"
          style={{ width:'100%', padding:'0.8rem 1rem', borderRadius:'var(--t-r-sm)', border:'2px solid var(--t-stone)', fontSize:'1rem', fontFamily:'DM Sans, sans-serif', marginBottom:'1.5rem', boxSizing:'border-box', transition:'border-color 0.2s', outline:'none', color:'var(--t-ink)', background:'var(--t-parchment)' }}
          onFocus={e => e.target.style.borderColor = 'var(--t-mid)'}
          onBlur={e  => e.target.style.borderColor = 'var(--t-stone)'}
          onKeyDown={e => e.key === 'Enter' && isReady && !loading && handleJoin()}
        />

        {/* Join Button */}
        <button
          onClick={handleJoin}
          disabled={!isReady || loading}
          style={{ width:'100%', padding:'0.9rem', borderRadius:'var(--t-r-pill)', border:'none', background: isReady ? 'linear-gradient(135deg, var(--t-eucalyptus), var(--t-mid))' : 'rgba(0,0,0,0.1)', color:'white', fontSize:'1rem', fontWeight:700, cursor: isReady && !loading ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.09em', transition:'all 0.22s ease', boxShadow: isReady ? '0 4px 16px rgba(26,82,56,0.35)' : 'none', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Joining…' : 'Join the Expedition'}
        </button>

        <button
          onClick={() => { setJoinError(''); setCurrentScreen('schoolEntry'); }}
          style={{ display:'block', width:'100%', background:'none', border:'none', color:'var(--t-ash)', fontSize:'0.82rem', cursor:'pointer', marginTop:'0.85rem', padding:'0.4rem', transition:'color 0.18s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--t-slate)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--t-ash)'}>
          ← Back
        </button>
      </div>
    </div>
  );
}
