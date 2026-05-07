import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, getDocs, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../context/AppContext';
import LegalModal from '../components/LegalModal';

const WILDLY_PHRASES = ['Wildly by Taronga', 'Continue the learning', 'Resources', 'Programs', 'Assessments'];

function WildlyLabel() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % WILDLY_PHRASES.length);
        setVisible(true);
      }, 380);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{ transition:'opacity 0.35s ease', opacity: visible ? 1 : 0, display:'inline-block' }}>
      {WILDLY_PHRASES[idx]}
    </span>
  );
}

function generateClassCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

export default function TeacherDashboardScreen() {
  const { setCurrentScreen, teacherEmail, setTeacherEmail, setSelectedClass, teacher, authLoading, signOutTeacher, demoMode } = useApp();

  // Auth guard — redirect if not signed in once Firebase has resolved
  useEffect(() => {
    if (!authLoading && !teacher && !demoMode) setCurrentScreen('teacherLogin');
  }, [teacher, authLoading, demoMode]);

  // Classes + student counts
  const [teacherClasses,  setTeacherClasses]  = useState([]);
  const [studentCounts,   setStudentCounts]   = useState({});
  const [classesLoading,  setClassesLoading]  = useState(true);

  // Create class form
  const [newClassName,    setNewClassName]    = useState('');
  const [newSchoolName,   setNewSchoolName]   = useState('');
  const [newClassStage,   setNewClassStage]   = useState(4);
  const [newLocation,     setNewLocation]     = useState('taronga-sydney');
  const [newSubject,      setNewSubject]      = useState('science');
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [zzConsentChecked, setZzConsentChecked] = useState(false);
  const [codeSessionType,  setCodeSessionType]  = useState(null); // null | 'standard' | 'zoosnooz'
  const [creatingClass,   setCreatingClass]   = useState(false);
  const [classCreated,    setClassCreated]    = useState(false);
  const [createError,     setCreateError]     = useState('');
  const [showWwzModal,    setShowWwzModal]    = useState(false);

  // Class code modal
  const [classCodeModal,      setClassCodeModal]      = useState(null);
  const [classCodeFullscreen, setClassCodeFullscreen] = useState(false);

  // Feedback modal
  const [showFeedback,       setShowFeedback]       = useState(false);
  const [feedbackRating,     setFeedbackRating]     = useState(0);
  const [feedbackComment,    setFeedbackComment]    = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [legalDoc,           setLegalDoc]           = useState(null); // 'privacy' | 'terms' | null

  // Real-time classes listener
  useEffect(() => {
    if (!teacherEmail.trim()) return;
    const ref = collection(db, 'teachers', teacherEmail, 'classes');
    const unsub = onSnapshot(ref, snap => {
      setTeacherClasses(snap.docs.map(d => ({
        classCode:    d.data().classCode || d.id,
        className:    d.data().className || '',
        yearGroup:    d.data().yearGroup || '',
        schoolName:   d.data().schoolName || '',
        stage:        d.data().stage || 4,
        teacherEmail: d.data().teacherEmail || teacherEmail,
        archived:     d.data().archived || false,
        sessionType:  d.data().sessionType || 'standard',
        location:     d.data().location || null,
        subject:      d.data().subject || null,
      })));
      setClassesLoading(false);
    }, err => { console.error('Classes listener error:', err); setTeacherClasses([]); setClassesLoading(false); });
    return () => unsub();
  }, [teacherEmail]);

  // Fetch student counts whenever classes change
  useEffect(() => {
    if (teacherClasses.length === 0) { setStudentCounts({}); return; }
    let cancelled = false;
    (async () => {
      const counts = {};
      for (const cls of teacherClasses) {
        try {
          const snap = await getDocs(collection(db, 'classes', cls.classCode, 'students'));
          counts[cls.classCode] = {
            total:     snap.size,
            completed: snap.docs.filter(d => d.data().completed === true).length,
          };
        } catch { counts[cls.classCode] = { total: 0, completed: 0 }; }
      }
      if (!cancelled) setStudentCounts(counts);
    })();
    return () => { cancelled = true; };
  }, [teacherClasses]);

  // Look up session type of the entered access code so we only show the ZooSnooz consent box when needed
  useEffect(() => {
    if (!accessCodeInput.trim()) { setCodeSessionType(null); return; }
    let cancelled = false;
    setZzConsentChecked(false);
    getDoc(doc(db, 'accessCodes', accessCodeInput.trim()))
      .then(snap => {
        if (cancelled) return;
        setCodeSessionType(snap.exists() ? (snap.data().sessionType || 'standard') : null);
      })
      .catch(() => { if (!cancelled) setCodeSessionType(null); });
    return () => { cancelled = true; };
  }, [accessCodeInput]);

  const activeClasses    = teacherClasses.filter(c => !c.archived);
  const totalStudentsAll = activeClasses.reduce((sum, c) => sum + (studentCounts[c.classCode]?.total || 0), 0);

  const createClass = async () => {
    if (!newClassName.trim() || !newSchoolName.trim()) return;
    if (!accessCodeInput.trim()) { setCreateError('Please enter a Taronga Access Code.'); return; }
    setCreateError('');
    setCreatingClass(true);
    try {
      const codeRef  = doc(db, 'accessCodes', accessCodeInput.trim());
      const codeSnap = await getDoc(codeRef);
      if (!codeSnap.exists()) { setCreateError('Invalid access code.'); setCreatingClass(false); return; }

      const codeData = codeSnap.data();
      const now = new Date();
      if (!codeData.active)                          { setCreateError('This access code is no longer active.'); setCreatingClass(false); return; }
      if (codeData.expiresAt.toDate() < now)         { setCreateError('This access code has expired.'); setCreatingClass(false); return; }
      if (codeData.uses >= codeData.maxUses)         { setCreateError('This access code has reached its usage limit.'); setCreatingClass(false); return; }
      if ((codeData.sessionType || 'standard') === 'zoosnooz' && !zzConsentChecked) { setCreateError('Please confirm student filming consent before creating a ZooSnooz class.'); setCreatingClass(false); return; }

      let code = generateClassCode();
      while (teacherClasses.some(c => c.classCode === code)) code = generateClassCode();

      await runTransaction(db, async tx => {
        const fresh = await tx.get(codeRef);
        if (fresh.data().uses >= fresh.data().maxUses) throw new Error('Code usage limit reached.');
        tx.update(codeRef, { uses: fresh.data().uses + 1 });

        const sessionDate = new Date().toISOString().split('T')[0];
        const venue       = codeData.venue || 'Taronga Zoo';
        const sessionType = codeData.sessionType || 'standard';

        tx.set(doc(db, 'teachers', teacherEmail, 'classes', code), {
          classCode: code, className: newClassName.trim(), schoolName: newSchoolName.trim(),
          stage: newClassStage, accessCodeUsed: accessCodeInput.trim(),
          venue, createdAt: serverTimestamp(), archived: false,
          sessionClosed: false, sessionDate, sessionType,
          location: newLocation, subject: newLocation === 'zoosnooz-sydney' ? null : newSubject,
        });
        tx.set(doc(db, 'classes', code), {
          classCode: code, className: newClassName.trim(), schoolName: newSchoolName.trim(),
          stage: newClassStage, teacherEmail, accessCodeUsed: accessCodeInput.trim(),
          venue, createdAt: serverTimestamp(), sessionClosed: false, sessionDate, sessionType,
          location: newLocation, subject: newLocation === 'zoosnooz-sydney' ? null : newSubject,
        });
      });

      setNewClassName(''); setNewSchoolName(''); setAccessCodeInput(''); setZzConsentChecked(false);
      setNewLocation('taronga-sydney'); setNewSubject('science');
      setClassCreated(true);
      setShowWwzModal(true);
      setTimeout(() => setClassCreated(false), 2500);
    } catch (err) {
      console.error('Create class error:', err);
      setCreateError(err.message || 'Failed to create class. Please try again.');
    } finally {
      setCreatingClass(false);
    }
  };

  const submitFeedback = async () => {
    if (feedbackRating === 0) { alert('Please select a rating.'); return; }
    setFeedbackSubmitting(true);
    try {
      const { addDoc, collection: col } = await import('firebase/firestore');
      await addDoc(col(db, 'teacherFeedback'), {
        type: 'teacherFeedback',
        classCode: activeClasses[0]?.classCode || '',
        teacherName: teacherEmail,
        rating: feedbackRating,
        comment: feedbackComment.trim(),
        timestamp: new Date().toISOString(),
      });
      setShowFeedback(false);
      setFeedbackRating(0);
      setFeedbackComment('');
    } catch (e) { console.error('Feedback error:', e); }
    setFeedbackSubmitting(false);
  };

  const inputStyle = { width:'100%', padding:'0.65rem 0.9rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-stone)', fontSize:'0.88rem', fontFamily:'DM Sans, sans-serif', marginBottom:'0.85rem', boxSizing:'border-box', background:'var(--t-parchment)', color:'var(--t-ink)', outline:'none', transition:'border-color 0.2s' };

  if (authLoading || classesLoading) return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, var(--t-deep) 0%, var(--t-mid) 60%, var(--t-eucalyptus) 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.5rem' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
        <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 32px rgba(0,0,0,0.2)' }}>
          <img src="/images/logo.png" alt="Taronga" style={{ width:'48px', height:'48px', objectFit:'contain' }} onError={e => e.target.style.display='none'} />
        </div>
        <h1 className="taronga-title" style={{ color:'white', fontSize:'1.5rem', letterSpacing:'0.06em', fontWeight:400, margin:0 }}>TARONGA TRACKA</h1>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.8rem', margin:0 }}>Teacher Portal</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.75rem' }}>
        <div style={{ width:'36px', height:'36px', border:'3px solid rgba(255,255,255,0.2)', borderTop:'3px solid white', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.85rem', margin:0, fontWeight:500 }}>Loading your classes…</p>
      </div>
      {teacherEmail && (
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.72rem', margin:0 }}>{teacherEmail}</p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
    <div className="lms-page">
      {/* Top bar */}
      <div className="lms-topbar">
        <div className="lms-topbar-brand">
          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'var(--t-deep)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 2px 8px rgba(0,0,0,0.12)' }}>
            <img src="/images/logo.png" alt="Taronga" style={{ height:'32px', width:'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>TARONGA TRACKA</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · {teacherEmail}</p>
          </div>
        </div>
        <button className="lms-signout-btn" onClick={signOutTeacher}>Sign Out</button>
      </div>

      {/* Two-col layout */}
      <div className="lms-two-col">
        {/* Sidebar */}
        <div className="lms-sidebar">
          <div className="lms-sidebar-logo">
            <p style={{ fontSize:'0.63rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:'0.15rem' }}>Teacher Portal</p>
            <p style={{ fontSize:'0.82rem', fontWeight:600, color:'rgba(255,255,255,0.75)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{teacherEmail}</p>
          </div>
          <p className="lms-nav-group-label">Menu</p>
          <nav className="lms-nav">
            <button className="lms-nav-item lms-nav-active">
              <span className="lms-nav-icon">&#9632;</span> Dashboard
            </button>
            <button className="lms-nav-item" onClick={() => { const el = document.getElementById('lms-classes-section'); el && el.scrollIntoView({ behavior:'smooth' }); }}>
              <span className="lms-nav-icon">&#9675;</span> My Classes
            </button>
            <button className="lms-nav-item" onClick={() => window.open('https://www.wildlybytaronga.com.au', '_blank')}>
              <span className="lms-nav-icon">&#10022;</span> <WildlyLabel />
            </button>
            <button className="lms-nav-item" onClick={() => window.open('https://www.taronga.org.au/learn', '_blank')}>
              <span className="lms-nav-icon">&#9678;</span> Taronga Programs
            </button>
          </nav>
          <p className="lms-nav-group-label" style={{ marginTop:'1rem' }}>Account</p>
          <nav className="lms-nav">
            <button className="lms-nav-item" onClick={() => { setFeedbackRating(0); setFeedbackComment(''); setShowFeedback(true); }}>
              <span className="lms-nav-icon">&#9786;</span> Feedback
            </button>
            <button className="lms-nav-item" onClick={() => setCurrentScreen('home')}>
              <span className="lms-nav-icon">&#8592;</span> Back to Home
            </button>
          </nav>

          <div style={{ marginTop:'auto', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,0.08)', padding:'1.5rem 1.25rem 0' }}>
            <button onClick={() => setLegalDoc('privacy')} style={{ display:'block', background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:'0.72rem', cursor:'pointer', padding:'0.2rem 0', textAlign:'left', width:'100%', transition:'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.7)'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.35)'}>Privacy Policy</button>
            <button onClick={() => setLegalDoc('terms')} style={{ display:'block', background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:'0.72rem', cursor:'pointer', padding:'0.2rem 0', textAlign:'left', width:'100%', transition:'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.7)'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.35)'}>Terms of Use</button>
          </div>
        </div>

        {/* Main */}
        <div className="lms-main">
          <div className="lms-main-inner">

            <div style={{ marginBottom:'1.5rem' }}>
              <h2 className="heading-display" style={{ fontSize:'clamp(1.3rem, 2.5vw, 1.65rem)', color:'var(--t-deep)', lineHeight:1.2, marginBottom:'0.25rem' }}>Dashboard</h2>
              <p style={{ color:'var(--t-slate)', fontSize:'0.82rem' }}>Welcome back. Here's an overview of your classes.</p>
            </div>

            {/* Stat cards */}
            <div className="lms-stat-grid">
              <div className="lms-stat-card animate-fade-in-up" style={{ borderTopColor:'#3B82F6' }}>
                <div className="lms-stat-icon" style={{ color:'#3B82F6' }}>&#9632;</div>
                <div className="lms-stat-val">{totalStudentsAll}</div>
                <div className="lms-stat-label">Total Students</div>
              </div>
              <div className="lms-stat-card animate-fade-in-up" style={{ borderTopColor:'var(--t-mid)', animationDelay:'0.06s' }}>
                <div className="lms-stat-icon" style={{ color:'var(--t-mid)' }}>&#9675;</div>
                <div className="lms-stat-val">{activeClasses.length}</div>
                <div className="lms-stat-label">Active Classes</div>
              </div>
            </div>

            {/* Create a Class */}
            <div className="animate-scale-in" style={{ background:'white', borderRadius:'var(--t-r-lg)', padding:'1.5rem', boxShadow:'var(--t-shadow-sm)', marginBottom:'1.5rem', border:'1px solid var(--t-stone)' }}>
              <h3 className="lms-section-heading">Create a New Class</h3>
              <p style={{ color:'var(--t-slate)', fontSize:'0.8rem', marginBottom:'1.1rem', marginTop:'-0.5rem' }}>Students join using the generated class code.</p>

              {/* Location */}
              <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Location</label>
              <select value={newLocation} onChange={e => setNewLocation(e.target.value)}
                style={{ ...inputStyle, appearance:'auto', cursor:'pointer' }}
                onFocus={e => e.target.style.borderColor='var(--t-mid)'} onBlur={e => e.target.style.borderColor='var(--t-stone)'}>
                <option value="taronga-sydney">Taronga Sydney — Zoo Visit</option>
                <option value="zoosnooz-sydney">ZooSnooz — Taronga Sydney</option>
                <option value="dubbo" disabled>Taronga Dubbo (Coming Soon)</option>
                <option value="school" disabled>Your School (Coming Soon)</option>
              </select>

              {/* Subject — hidden for ZooSnooz */}
              {newLocation !== 'zoosnooz-sydney' && (
                <>
                  <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Subject</label>
                  <select value={newSubject} onChange={e => setNewSubject(e.target.value)}
                    style={{ ...inputStyle, appearance:'auto', cursor:'pointer' }}
                    onFocus={e => e.target.style.borderColor='var(--t-mid)'} onBlur={e => e.target.style.borderColor='var(--t-stone)'}>
                    <option value="science">Science</option>
                    <option value="maths" disabled>Mathematics (Coming Soon)</option>
                    <option value="english" disabled>English (Coming Soon)</option>
                    <option value="geography" disabled>Geography (Coming Soon)</option>
                  </select>
                </>
              )}

              <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>School Name</label>
              <input type="text" value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} placeholder="e.g. Campbelltown Public School"
                style={inputStyle} onFocus={e => e.target.style.borderColor='var(--t-mid)'} onBlur={e => e.target.style.borderColor='var(--t-stone)'} />

              <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>NSW Stage</label>
              <select value={newClassStage} onChange={e => setNewClassStage(Number(e.target.value))}
                style={{ ...inputStyle, appearance:'auto', cursor:'pointer' }}
                onFocus={e => e.target.style.borderColor='var(--t-mid)'} onBlur={e => e.target.style.borderColor='var(--t-stone)'}>
                <option value={1}>Stage 1 (K–2)</option>
                <option value={2}>Stage 2 (3–4)</option>
                <option value={3}>Stage 3 (5–6)</option>
                <option value={4}>Stage 4 (7–8)</option>
                <option value={5}>Stage 5 (9–10)</option>
              </select>

              <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Class Name</label>
              <input type="text" value={newClassName} onChange={e => setNewClassName(e.target.value)} placeholder="e.g. 7A, Biology, Koala Crew"
                style={inputStyle} onFocus={e => e.target.style.borderColor='var(--t-mid)'} onBlur={e => e.target.style.borderColor='var(--t-stone)'} />

              <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Taronga Access Code</label>
              <input type="password" value={accessCodeInput} onChange={e => setAccessCodeInput(e.target.value)} placeholder="Enter access code" autoComplete="off"
                style={{ ...inputStyle, marginBottom:'1rem' }} onFocus={e => e.target.style.borderColor='var(--t-mid)'} onBlur={e => e.target.style.borderColor='var(--t-stone)'} />

              {(codeSessionType === 'zoosnooz' || newLocation === 'zoosnooz-sydney') && (
                <div style={{ background:'#f0f7f2', border:'1px solid #b6d9c3', borderRadius:'10px', padding:'0.9rem 1rem', marginBottom:'1rem' }}>
                  <label style={{ display:'flex', gap:'0.65rem', alignItems:'flex-start', cursor:'pointer' }}>
                    <input
                      type="checkbox"
                      checked={zzConsentChecked}
                      onChange={e => setZzConsentChecked(e.target.checked)}
                      style={{ marginTop:'3px', accentColor:'#1B6B3A', width:'15px', height:'15px', flexShrink:0 }}
                    />
                    <span style={{ fontSize:'0.8rem', color:'#1a4a2a', lineHeight:1.6 }}>
                      I confirm that appropriate consent for video filming has been obtained for all participating students in accordance with my school's policies.
                      <br/>
                      <span style={{ color:'#555', fontSize:'0.76rem' }}>
                        If your school requires a specific form, please use your school's version. A Taronga Tracka ZooSnooz notification template is available{' '}
                        <a href="/zoosnooz-notification.html" target="_blank" rel="noopener noreferrer" style={{ color:'#1B6B3A', fontWeight:700, textDecoration:'underline' }}>here</a>
                        {' '}if your school does not have one. Sample documentation can also be found within the class once created.
                      </span>
                    </span>
                  </label>
                </div>
              )}

              {createError && (
                <p style={{ color:'var(--t-danger)', fontSize:'0.82rem', fontWeight:600, marginBottom:'0.75rem' }}>⚠ {createError}</p>
              )}

              <button onClick={createClass} disabled={!newClassName.trim() || !newSchoolName.trim() || creatingClass}
                style={{ width:'100%', padding:'0.7rem', borderRadius:'var(--t-r-sm)', border:'none', background:(newClassName.trim()&&newSchoolName.trim()&&!creatingClass)?'linear-gradient(135deg, var(--t-mid), var(--t-eucalyptus))':'#CCC', color:'white', fontSize:'0.9rem', fontWeight:700, cursor:(newClassName.trim()&&newSchoolName.trim()&&!creatingClass)?'pointer':'not-allowed', letterSpacing:'0.04em', transition:'all 0.2s' }}>
                {creatingClass ? 'Creating…' : '+ Create Class'}
              </button>
              {classCreated && (
                <p style={{ marginTop:'0.6rem', fontSize:'0.8rem', color:'#2e7d32', fontWeight:600 }}>✓ Class created successfully.</p>
              )}
            </div>

            {/* My Classes */}
            <div id="lms-classes-section">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
                <h3 className="lms-section-heading" style={{ margin:0 }}>
                  My Classes
                  <span style={{ fontFamily:'DM Sans, sans-serif', fontWeight:600, fontSize:'0.75rem', color:'var(--t-sage)', letterSpacing:0, marginLeft:'0.5rem' }}>({activeClasses.length})</span>
                </h3>
              </div>

              {activeClasses.length === 0 ? (
                <div style={{ background:'var(--t-foam)', borderRadius:'var(--t-r-md)', padding:'1.5rem', textAlign:'center', border:'1px solid var(--t-mist)' }}>
                  <p style={{ color:'var(--t-slate)', fontSize:'0.85rem', fontStyle:'italic' }}>No classes yet. Create one above to get started.</p>
                </div>
              ) : (
                <div className="lms-card">
                  {activeClasses.map((cls, i) => (
                    <div key={cls.classCode}
                      onClick={() => { setSelectedClass(cls.classCode); setCurrentScreen('classDetails'); }}
                      className="animate-fade-in-up lms-class-row"
                      style={{ animationDelay:`${i*0.06}s` }}>
                      <div className="lms-class-avatar">{(cls.className||'?').charAt(0).toUpperCase()}</div>
                      <div className="lms-class-info">
                        <p className="lms-class-name">{cls.className}</p>
                        <p className="lms-class-meta">
                          {cls.schoolName && <span style={{ color:'var(--t-mid)', fontWeight:600 }}>{cls.schoolName} · </span>}
                          {studentCounts[cls.classCode]?.total || 0} student{(studentCounts[cls.classCode]?.total || 0) !== 1 ? 's' : ''}
                          {cls.stage ? <span style={{ marginLeft:'0.4rem', background:'var(--t-foam)', color:'var(--t-mid)', fontWeight:700, borderRadius:'var(--t-r-xs)', padding:'0 0.35rem', fontSize:'0.6875rem' }}>Stage {cls.stage}</span> : null}
                        </p>
                        {(cls.location || cls.subject) && (
                          <p className="lms-class-meta" style={{ marginTop:'0.15rem', color:'var(--t-sage)' }}>
                            {cls.location && <span style={{ fontWeight:600 }}>{{ 'taronga-sydney':'Taronga Sydney', 'zoosnooz-sydney':'ZooSnooz · Sydney', 'dubbo':'Taronga Dubbo', 'school':'Your School' }[cls.location] || cls.location}</span>}
                            {cls.location && cls.subject && <span style={{ color:'var(--t-ash)' }}> · </span>}
                            {cls.subject && <span style={{ textTransform:'capitalize', color:'var(--t-slate)' }}>{cls.subject}</span>}
                          </p>
                        )}
                      </div>
                      <div onClick={e => { e.stopPropagation(); setClassCodeModal(cls.classCode); }}
                        style={{ textAlign:'right', cursor:'pointer', padding:'0.25rem 0.4rem', borderRadius:'var(--t-r-xs)', transition:'background 0.16s' }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--t-foam)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <p style={{ fontFamily:'monospace', fontWeight:700, fontSize:'0.875rem', color:'var(--t-mid)', letterSpacing:'0.06em' }}>{cls.classCode}</p>
                        <p style={{ color:'var(--t-ash)', fontSize:'0.6875rem' }}>tap to display</p>
                      </div>
                      <span className="lms-chevron">›</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Feedback modal */}
      {showFeedback && (
        <div onClick={() => setShowFeedback(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'var(--t-r-lg)', padding:'2rem', width:'100%', maxWidth:'420px', boxShadow:'0 24px 60px rgba(0,0,0,0.25)' }}>
            <h3 style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.25rem' }}>Class Feedback</h3>
            <p style={{ fontSize:'0.82rem', color:'#888', marginBottom:'1.25rem' }}>Share your experience with the Taronga Tracka team.</p>
            <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.5rem' }}>Rating</p>
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem' }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setFeedbackRating(n)}
                  style={{ fontSize:'1.6rem', background:'none', border:'none', cursor:'pointer', opacity: n <= feedbackRating ? 1 : 0.25, transition:'opacity 0.15s' }}>⭐</button>
              ))}
            </div>
            <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.4rem' }}>Written Feedback <span style={{ color:'#aaa', fontWeight:400 }}>(optional)</span></p>
            <textarea value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)}
              placeholder="Share your feedback — what worked well, what could improve..."
              style={{ width:'100%', minHeight:'90px', padding:'0.75rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid #E5E5E5', fontSize:'0.88rem', fontFamily:'DM Sans, sans-serif', resize:'vertical', boxSizing:'border-box', marginBottom:'1rem', outline:'none' }}
              onFocus={e => e.target.style.borderColor='var(--t-mid)'}
              onBlur={e  => e.target.style.borderColor='#E5E5E5'} />
            <div style={{ display:'flex', gap:'0.6rem' }}>
              <button onClick={submitFeedback} disabled={feedbackSubmitting || feedbackRating === 0}
                style={{ flex:1, padding:'0.75rem', borderRadius:'var(--t-r-sm)', border:'none', background: feedbackRating > 0 ? 'linear-gradient(135deg, var(--t-mid), var(--t-eucalyptus))' : '#CCC', color:'white', fontSize:'0.9rem', fontWeight:700, cursor: feedbackRating > 0 ? 'pointer' : 'not-allowed' }}>
                {feedbackSubmitting ? 'Submitting…' : 'Submit Feedback'}
              </button>
              <button onClick={() => setShowFeedback(false)}
                style={{ padding:'0.75rem 1.1rem', borderRadius:'var(--t-r-sm)', border:'1px solid #E5E5E5', background:'white', fontSize:'0.9rem', color:'#888', cursor:'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Class code modal */}
      {classCodeModal && !classCodeFullscreen && (
        <div onClick={() => setClassCodeModal(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'24px', padding:'2.5rem', textAlign:'center', boxShadow:'0 24px 60px rgba(0,0,0,0.3)', minWidth:'320px' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:600, color:'#888', marginBottom:'1rem', textTransform:'uppercase', letterSpacing:'0.1em' }}>Class Code</h3>
            <div style={{ fontFamily:'monospace', fontSize:'4rem', fontWeight:700, color:'var(--t-deep)', letterSpacing:'0.3em', marginBottom:'1.5rem', lineHeight:1.2 }}>
              {classCodeModal}
            </div>
            <button onClick={() => setClassCodeFullscreen(true)} style={{ width:'100%', background:'linear-gradient(135deg, var(--t-mid), var(--t-eucalyptus))', color:'white', border:'none', padding:'0.85rem', borderRadius:'var(--t-r-md)', fontSize:'0.95rem', fontWeight:700, cursor:'pointer', marginBottom:'0.7rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>
              Full Screen Mode
            </button>
            <button onClick={() => setClassCodeModal(null)} style={{ width:'100%', background:'#F5F3EE', color:'#666', border:'none', padding:'0.75rem', borderRadius:'var(--t-r-md)', fontSize:'0.85rem', fontWeight:600, cursor:'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen class code */}
      {classCodeFullscreen && (
        <div style={{ position:'fixed', inset:0, background:'#0A2F1F', zIndex:300, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontFamily:'monospace', fontSize:'clamp(5rem, 20vw, 12rem)', fontWeight:700, color:'white', letterSpacing:'0.3em', textAlign:'center' }}>
            {classCodeModal}
          </div>
          <button onClick={() => { setClassCodeFullscreen(false); setClassCodeModal(null); }}
            style={{ position:'absolute', top:'2rem', right:'2rem', background:'rgba(255,255,255,0.15)', color:'white', border:'2px solid rgba(255,255,255,0.3)', padding:'0.75rem 1.5rem', borderRadius:'var(--t-r-md)', fontSize:'0.9rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>
            Exit
          </button>
        </div>
      )}
    </div>
      {legalDoc && <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />}

      {/* Who's Who in the Zoo modal */}
      {showWwzModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }} onClick={() => setShowWwzModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'20px', maxWidth:'480px', width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)', overflow:'hidden' }}>
            {/* Modal header */}
            <div style={{ background:'#0A2F1F', padding:'22px 28px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <p style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', marginBottom:'4px' }}>Class Created</p>
                <h3 style={{ fontFamily:'TarongaHeadline, DM Sans, sans-serif', fontSize:'1.3rem', fontWeight:'normal', color:'white', letterSpacing:'0.04em', margin:0 }}>Who's Who in the Zoo?</h3>
              </div>
              <button onClick={() => setShowWwzModal(false)} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'50%', width:'32px', height:'32px', color:'white', fontSize:'1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>
            </div>
            {/* Modal body */}
            <div style={{ padding:'24px 28px' }}>
              <div style={{ background:'#e8f5ed', border:'1px solid #b6d9c3', borderRadius:'10px', padding:'12px 14px', marginBottom:'16px', display:'flex', gap:'10px', alignItems:'flex-start' }}>
                <span style={{ fontSize:'18px', flexShrink:0, marginTop:'1px' }}>&#128274;</span>
                <p style={{ fontSize:'0.83rem', color:'#1a4a2a', lineHeight:1.65, margin:0 }}>
                  <strong>Students are de-identified for privacy.</strong> Instead of entering their real name, each student picks an animal alias — their name is never stored in the app.
                </p>
              </div>
              <p style={{ fontSize:'0.83rem', color:'#444', lineHeight:1.7, marginBottom:'14px' }}>
                To record which student chose which alias, print the <strong>Who's Who in the Zoo</strong> document and fill it in during the excursion. Keep it secure and do not share it publicly.
              </p>
              <p style={{ fontSize:'0.83rem', color:'#444', lineHeight:1.7, marginBottom:'20px' }}>
                The document is also accessible in the <strong>class navigation panel</strong> once you open any class. On-site at Taronga, staff can also assist — just see a team member for details.
              </p>
              <a
                href="/whos-who-in-the-zoo.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display:'block', width:'100%', padding:'0.8rem', borderRadius:'40px', background:'linear-gradient(135deg, #1B6B3A, #0A2F1F)', color:'white', fontSize:'0.9rem', fontWeight:700, textDecoration:'none', textAlign:'center', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:'0.7rem', boxSizing:'border-box' }}>
                &#9112; Open Who's Who Document
              </a>
              <button
                onClick={() => setShowWwzModal(false)}
                style={{ width:'100%', padding:'0.7rem', borderRadius:'40px', border:'none', background:'#F5F3EE', color:'#555', fontSize:'0.85rem', fontWeight:600, cursor:'pointer' }}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
