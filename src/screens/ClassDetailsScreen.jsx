import { useState, useEffect } from 'react';
import {
  collection, doc, getDoc, getDocs, onSnapshot,
  writeBatch, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp,
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';
import { normaliseCode, safeStudentId } from '../utils/helpers';
import { useApp } from '../context/AppContext';
import { ZOOSNOOZ_ANIMALS } from '../data/zoosnoozAnimals';
import { openTeacherInfoSheet } from '../utils/teacherInfoSheet';

// ─── Helpers ────────────────────────────────────────────────────────────────

function RadarSVG({ avgB, avgD, avgW, dark, labels }) {
  const [labelB, labelD, labelW] = labels || ['Behaviour', 'Detail', 'Writing'];
  const cx = 80, cy = 80, r = 58;
  const axes = [
    { label: labelB, val: avgB/5, angle: -90 },
    { label: labelD, val: avgD/5, angle: 30  },
    { label: labelW, val: avgW/5, angle: 150 },
  ];
  const pt = (ratio, angle) => {
    const a = (angle * Math.PI) / 180;
    return [cx + ratio * r * Math.cos(a), cy + ratio * r * Math.sin(a)];
  };
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = axes.map(ax => pt(ax.val, ax.angle));
  const dataPath = dataPoints.map((p,i) => `${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + 'Z';
  const gridColor = dark ? 'rgba(46,125,85,0.25)' : '#E5E5E5';
  const dotColor  = dark ? '#4A9E6B' : 'var(--t-mid)';
  const textColor = dark ? 'rgba(184,212,192,0.75)' : '#555';
  const valColor  = dark ? '#D4EDE0' : 'var(--t-deep)';
  return (
    <svg viewBox="0 0 160 160" style={{ width:'100%', maxWidth:'220px' }}>
      {gridLevels.map(lvl => {
        const pts = axes.map(ax => pt(lvl, ax.angle));
        return <polygon key={lvl} points={pts.map(p=>p.join(',')).join(' ')} fill="none" stroke={gridColor} strokeWidth="0.8" />;
      })}
      {axes.map(ax => { const [x,y] = pt(1, ax.angle); return <line key={ax.label} x1={cx} y1={cy} x2={x} y2={y} stroke={gridColor} strokeWidth="0.8" />; })}
      <path d={dataPath} fill={dark ? 'rgba(46,125,85,0.25)' : 'rgba(46,125,85,0.2)'} stroke={dotColor} strokeWidth="1.5" />
      {dataPoints.map((p,i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={dotColor} />)}
      {axes.map(ax => { const [lx,ly] = pt(1.28, ax.angle); return <text key={ax.label} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="8.5" fill={textColor} fontFamily="DM Sans, sans-serif">{ax.label}</text>; })}
      {axes.map((ax,i) => <text key={`v${i}`} x={dataPoints[i][0]} y={dataPoints[i][1]-5} textAnchor="middle" fontSize="7.5" fill={valColor} fontWeight="bold" fontFamily="DM Sans, sans-serif">{[avgB,avgD,avgW][i]}</text>)}
    </svg>
  );
}

// Merge per-animal zoosnooz map (from zzCompleteMission) with zzBadges array
// (from zzFinalSubmit) so analytics work regardless of which path wrote the data.
function resolveZzData(s) {
  const map = {};
  ZOOSNOOZ_ANIMALS.forEach(a => {
    const d = (s.zoosnooz || {})[a.id];
    if (d?.completed) map[a.id] = d;
  });
  (s.zzBadges || []).forEach(b => {
    if (b.animalId && !map[b.animalId]) map[b.animalId] = { ...b, completed: true };
  });
  return map;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ClassDetailsScreen() {
  const { setCurrentScreen, teacherEmail, setTeacherEmail, selectedClass, teacher, authLoading, signOutTeacher, demoMode } = useApp();

  // Auth guard
  useEffect(() => {
    if (!authLoading && !teacher && !demoMode) setCurrentScreen('teacherLogin');
  }, [teacher, authLoading, demoMode]);

  // Class metadata
  const [cls,            setCls]            = useState(null);

  // Live students
  const [students,       setStudents]       = useState([]);
  const [loading,        setLoading]        = useState(true);

  // Actions
  const [submittingAll,  setSubmittingAll]  = useState(false);
  const [submitSuccess,  setSubmitSuccess]  = useState(false);

  // UI state
  const [expandedGroup,     setExpandedGroup]     = useState(null);
  const [markingCardOpen,   setMarkingCardOpen]   = useState(false);
  const [classCodeModal,    setClassCodeModal]    = useState(null);
  const [classCodeFS,       setClassCodeFS]       = useState(false);

  const [studentActionBusy, setStudentActionBusy] = useState({});

  const deleteStudent = async (s) => {
    if (!window.confirm(`Delete ${s.name}'s session? This cannot be undone.`)) return;
    setStudentActionBusy(p => ({ ...p, [s.id]: 'deleting' }));
    try {
      await deleteDoc(doc(db, 'classes', normaliseCode(selectedClass), 'students', s.id));
    } catch (e) { alert('Delete failed: ' + e.message); }
    setStudentActionBusy(p => ({ ...p, [s.id]: null }));
  };

  const resetStudent = async (s) => {
    if (!window.confirm(`Restore ${s.name} to the animal list? Their existing badges and progress will be kept.`)) return;
    setStudentActionBusy(p => ({ ...p, [s.id]: 'resetting' }));
    try {
      await setDoc(doc(db, 'classes', normaliseCode(selectedClass), 'students', s.id), {
        completed: false,
        status: 'incomplete',
        completedAt: null,
        conservationStatement: '',
        restored: true,
      }, { merge: true });
    } catch (e) { alert('Restore failed: ' + e.message); }
    setStudentActionBusy(p => ({ ...p, [s.id]: null }));
  };

  // Modals
  const [obsModal,          setObsModal]          = useState(null);
  const [conservationModal, setConservationModal] = useState(null);
  const [expandedBreakdown, setExpandedBreakdown] = useState(null);
  const [overrideForms,     setOverrideForms]     = useState({});
  const [overrideSaving,    setOverrideSaving]    = useState(null);
  const [zzModalClipUrls,   setZzModalClipUrls]   = useState({});

  // Fetch per-animal clip URLs when a ZooSnooz modal opens
  useEffect(() => {
    if (!obsModal?.isZZ || !obsModal.classCode || !obsModal.name) { setZzModalClipUrls({}); return; }
    const code = normaliseCode(obsModal.classCode);
    const sid  = safeStudentId(obsModal.name);
    const base = `zoosnooz/${code}/${sid}`;
    let cancelled = false;
    (async () => {
      const urls = {};
      await Promise.all(ZOOSNOOZ_ANIMALS.map(async a => {
        for (const ext of ['webm','mp4']) {
          try {
            urls[a.id] = await getDownloadURL(storageRef(storage, `${base}/${a.id}.${ext}`));
            break;
          } catch {}
        }
      }));
      if (!cancelled) setZzModalClipUrls(urls);
    })();
    return () => { cancelled = true; };
  }, [obsModal]);

  // Load class metadata
  useEffect(() => {
    if (!selectedClass || !teacherEmail) return;
    getDoc(doc(db, 'teachers', teacherEmail, 'classes', selectedClass))
      .then(snap => {
        if (snap.exists()) {
          const d = snap.data();
          setCls({ classCode: d.classCode || selectedClass, className: d.className || '', schoolName: d.schoolName || '', stage: d.stage || 4, yearGroup: d.yearGroup || '', sessionType: d.sessionType || 'standard', sessionClosed: d.sessionClosed || false, location: d.location || null, subject: d.subject || null, gpsEnabled: d.gpsEnabled !== false });
        } else {
          setCurrentScreen('teacherDashboard');
        }
      })
      .catch(() => setCurrentScreen('teacherDashboard'));
  }, [selectedClass, teacherEmail]);

  // Real-time student listener
  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    const ref = collection(db, 'classes', selectedClass, 'students');
    const unsub = onSnapshot(ref, snap => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => { setStudents([]); setLoading(false); });
    return () => unsub();
  }, [selectedClass]);

  if (!cls) return (
    <div style={{
      position:'fixed', inset:0,
      background:'#0A2F1F',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      gap:'1.5rem', zIndex:10,
    }}>
      <img src="/images/logo.png" alt="Taronga" style={{ height:64, width:'auto', opacity:0.9 }} />
      <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:8, height:8, borderRadius:'50%',
            background:'rgba(168,196,178,0.7)',
            animation:'tpulse 1.2s ease-in-out infinite',
            animationDelay:`${i * 0.2}s`,
          }} />
        ))}
      </div>
      <p style={{ color:'rgba(168,196,178,0.5)', fontSize:'0.75rem', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:600, margin:0 }}>
        Loading class
      </p>
      <style>{`
        @keyframes tpulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
          40%            { opacity: 1;   transform: scale(1.15); }
        }
      `}</style>
    </div>
  );

  const isZZ = cls.sessionType === 'zoosnooz';
  const totalStudents  = students.length;
  const avgPoints      = totalStudents > 0 ? Math.round(students.reduce((s,st)=>s+(st.totalPoints||0),0)/totalStudents) : 0;
  const totalBadges    = students.reduce((s,st)=>s+(st.badges?.length||0),0);
  const completedCount = students.filter(s=>s.completed).length;
  const completedStuds = students.filter(s=>s.completed);
  const avgQuizPct     = (() => {
    const withData = students.filter(s => (s.badges||[]).some(b => (b.quizResults||[]).length > 0));
    if (!withData.length) return 0;
    return Math.round(withData.reduce((sum, s) => {
      const allQR = (s.badges||[]).flatMap(b => b.quizResults||[]);
      return sum + Math.round(allQR.filter(r => r.correctOnFirstAttempt === true).length / allQR.length * 100);
    }, 0) / withData.length);
  })();

  // ── CSV Export ──────────────────────────────────────────────────────────────
  const downloadCSV = () => {
    const header = ['Name','Points','Badges Earned','Quiz Score','Completed','Last Active','Observations'];
    const rows = students.map(s => {
      const lastBadge = s.badges?.length > 0 ? s.badges[s.badges.length - 1] : null;
      let totalQ = 0, correctQ = 0;
      (s.badges||[]).forEach(b => { (b.quizResults||[]).forEach(r => { totalQ++; if(r.correctOnFirstAttempt) correctQ++; }); });
      const quizStr = totalQ > 0 ? `${Math.round((correctQ/totalQ)*100)}%` : ' - ';
      const obsStr  = (s.badges||[]).filter(b=>b.observation).map(b=>`${b.animal}: ${b.observation}`).join(' | ');
      return [s.name, s.totalPoints||0, s.badges?.length||0, quizStr, s.completed?'Yes':'No',
        s.completedAt ? new Date(s.completedAt.toDate?.() || s.completedAt).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'}) : (lastBadge?.timestamp ? new Date(lastBadge.timestamp).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'}) : ' - '),
        obsStr || ' - '];
    });
    const csv = [header,...rows].map(row=>row.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
    a.download = `${cls.className}-${cls.classCode}-results.csv`;
    a.click();
  };

  // ── Reset ───────────────────────────────────────────────────────────────────
  const resetClass = async () => {
    if (!window.confirm(`Reset all student data for ${cls.className}? This cannot be undone.`)) return;
    try {
      const snap = await getDocs(collection(db, 'classes', selectedClass, 'students'));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
    } catch { alert('Failed to reset class data. Please check your connection.'); }
  };

  // ── Archive ─────────────────────────────────────────────────────────────────
  const archiveClass = async () => {
    if (!window.confirm(`Archive ${cls.className}? It will be hidden from your active classes.`)) return;
    try {
      await updateDoc(doc(db, 'teachers', teacherEmail, 'classes', selectedClass), { archived: true });
      setCurrentScreen('teacherDashboard');
    } catch { alert('Failed to archive class. Please try again.'); }
  };

  // ── Mark All Complete ────────────────────────────────────────────────────────
  const handleMarkAllComplete = async () => {
    const incomplete = students.filter(s => s.status !== 'complete');
    if (!incomplete.length) return;
    if (!window.confirm(`Mark ${incomplete.length} incomplete student${incomplete.length!==1?'s':''} as complete?`)) return;
    setSubmittingAll(true);
    try {
      const snap = await getDocs(collection(db, 'classes', selectedClass, 'students'));
      const batch = writeBatch(db);
      snap.docs.forEach(d => {
        if ((d.data().status||'incomplete') !== 'complete')
          batch.update(d.ref, { status:'complete', completed:true, completedAt: serverTimestamp() });
      });
      await batch.commit();
    } catch { alert('Failed. Please try again.'); }
    finally { setSubmittingAll(false); }
  };

  // ── Submit Class ─────────────────────────────────────────────────────────────
  const handleSubmitAll = async () => {
    if (!window.confirm('Submit this class? This will finalise results and cannot be undone.')) return;
    setSubmittingAll(true);
    try {
      const snap = await getDocs(collection(db, 'classes', selectedClass, 'students'));
      const batch = writeBatch(db);
      let studentCount=0, quizSum=0, behaviourSum=0, detailSum=0, literacySum=0, badgeCount=0;
      snap.forEach(d => {
        const data = d.data(); studentCount++;
        if (typeof data.quizPercentage === 'number') quizSum += data.quizPercentage;
        (data.badges||[]).forEach(b => {
          const obs = b.observationScore;
          if (obs && typeof obs === 'object') {
            behaviourSum += ((obs.behaviour||0)/5)*100;
            detailSum    += ((obs.detail   ||0)/5)*100;
            literacySum  += ((obs.writing  ||0)/5)*100;
          }
          badgeCount++;
        });
      });
      const quizAverage      = studentCount > 0 ? Math.round(quizSum/studentCount)     : 0;
      const behaviourAverage = badgeCount   > 0 ? Math.round(behaviourSum/badgeCount)  : 0;
      const detailAverage    = badgeCount   > 0 ? Math.round(detailSum/badgeCount)     : 0;
      const literacyAverage  = badgeCount   > 0 ? Math.round(literacySum/badgeCount)   : 0;
      let weakestFocusArea = 'Behaviour', lowestValue = behaviourAverage;
      if (detailAverage   < lowestValue) { lowestValue = detailAverage;   weakestFocusArea = 'Use of Evidence'; }
      if (literacyAverage < lowestValue) { lowestValue = literacyAverage; weakestFocusArea = 'Literacy'; }
      if (quizAverage < 60) weakestFocusArea = 'Knowledge & understanding';
      const difficultyBand = quizAverage >= 80 ? 'extension' : quizAverage >= 60 ? 'consolidation' : 'intervention';

      snap.docs.forEach(d => {
        if ((d.data().status||'incomplete') !== 'complete')
          batch.update(d.ref, { status:'complete', completed:true, completedAt: serverTimestamp() });
      });
      batch.set(doc(db,'classes',selectedClass), {
        sessionClosed: true, quizAverage, stage: cls.stage,
        teacherEmail, className: cls.className, yearGroup: cls.yearGroup,
        focusAverages: { behaviour: behaviourAverage, scientificLanguage: detailAverage, dataEvidence: literacyAverage },
        weakestFocusArea, difficultyBand, submittedAt: serverTimestamp()
      }, { merge: true });
      await batch.commit();
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 2500);
    } catch (err) {
      console.error('Submit failed:', err);
      alert('Failed to submit. Please check your connection and try again.');
    } finally { setSubmittingAll(false); }
  };

  // ── Teacher Override ─────────────────────────────────────────────────────────
  const saveOverride = async (studentName, badgeAnimalId, form) => {
    try {
      const snap = await getDocs(query(collection(db,'classes',selectedClass,'students'), where('name','==',studentName)));
      if (snap.empty) return { ok: false };
      const docRef = snap.docs[0].ref;
      const badges = (snap.docs[0].data().badges||[]).map(b => {
        if (b.animalId !== badgeAnimalId) return b;
        return { ...b, observationScore: { ...(b.observationScore||{}), teacherOverride: { applied:true, behaviourScore: form.b!==''?Number(form.b):null, detailScore: form.d!==''?Number(form.d):null, writingScore: form.w!==''?Number(form.w):null, note:form.note||'', reasonType:form.reason||'', savedAt:new Date().toISOString() }, reviewFlag: { flagged:true, note:form.note||'', reason:form.reason||'', timestamp:new Date().toISOString() } } };
      });
      await updateDoc(docRef, { badges });
      return { ok: true };
    } catch (e) { return { ok: false }; }
  };

  // ── Insight helpers ──────────────────────────────────────────────────────────
  const computeObsAverages = (stList) => {
    let totB=0, totD=0, totW=0, cnt=0;
    stList.forEach(s => {
      (s.badges||[]).forEach(b => {
        const obs = b.observationScore;
        if (!obs || typeof obs !== 'object') return;
        totB+=obs.behaviour||0; totD+=obs.detail||0; totW+=obs.writing||0; cnt++;
      });
    });
    return { avgB: cnt ? +(totB/cnt).toFixed(1):0, avgD: cnt ? +(totD/cnt).toFixed(1):0, avgW: cnt ? +(totW/cnt).toFixed(1):0, cnt };
  };

  const { avgB, avgD, avgW, cnt: obsCnt } = computeObsAverages(students);
  const stage = cls.stage || 4;
  const isMaths = cls.subject === 'maths';
  const isPdhpe = cls.subject === 'pdhpe';

  // ─────────────────────────────────────────────────────────────────────────────
  // Sidebar state helpers
  const allComplete     = students.length > 0 && students.every(s => s.status === 'complete');
  const hasIncomplete   = students.some(s => s.status !== 'complete');
  const alreadySubmitted= cls.sessionClosed;

  // Style helpers
  const nightStyle = (s={}) => isZZ ? { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(46,125,85,0.2)', borderRadius:'var(--t-r-md)', padding:'1rem 1.15rem', marginBottom:'0.7rem', ...s } : { background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', padding:'1rem 1.15rem', boxShadow:'var(--t-shadow-xs)', marginBottom:'0.7rem', border:'1px solid var(--t-stone)', ...s };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="lms-page" style={ isZZ ? { background:'#020D06' } : {}}>

      {/* Top bar */}
      <div className="lms-topbar" style={ isZZ ? { background:'linear-gradient(135deg,#071E14 0%,#0A2F1F 60%,#071E14 100%)', borderBottom:'1px solid rgba(168,196,178,0.2)' } : {}}>
        <div className="lms-topbar-brand">
          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background: isZZ ? 'rgba(46,125,85,0.3)' : 'var(--t-deep)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <img src="/images/logo.png" alt="" style={{ height:'32px', width:'auto', filter: isZZ ? 'brightness(0) invert(1)' : 'none' }} onError={e=>e.target.style.display='none'} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color: isZZ ? '#D4EDE0' : 'var(--t-deep)', fontWeight:400 }}>{isZZ ? '🌙 ZOOSNOOZ' : 'TARONGA TRACKA'}</h1>
            <p style={{ fontSize:'0.7rem', color: isZZ ? 'rgba(184,212,192,0.65)' : 'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · {cls.className}</p>
          </div>
        </div>
        <button className="lms-signout-btn" onClick={signOutTeacher} style={ isZZ ? { background:'rgba(46,125,85,0.25)', borderColor:'rgba(168,196,178,0.4)', color:'#A8C4B2' } : {}}>Sign Out</button>
      </div>

      <div className="lms-two-col">
        {/* Sidebar */}
        <div className="lms-sidebar" style={ isZZ ? { background:'linear-gradient(180deg,#071E14 0%,#040F08 100%)', borderRight:'1px solid rgba(46,125,85,0.2)' } : {}}>
          <div className="lms-sidebar-logo" style={ isZZ ? { borderBottom:'1px solid rgba(46,125,85,0.2)' } : {}}>
            <p style={{ fontSize:'0.63rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:'0.2rem' }}>Class Details</p>
            <p style={{ fontSize:'0.9rem', fontWeight:700, color:'white', lineHeight:1.25 }}>{cls.className}</p>
            {cls.schoolName && <p style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.5)', marginTop:'0.1rem' }}>{cls.schoolName}</p>}
          </div>

          <p className="lms-nav-group-label">Navigation</p>
          <nav className="lms-nav">
            <button className="lms-nav-item" onClick={() => setCurrentScreen('teacherDashboard')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span> All Classes
            </button>
            <button className="lms-nav-item" onClick={() => window.open('/whos-who-in-the-zoo.pdf', '_blank')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></span> Who's Who in the Zoo
            </button>
            <button className="lms-nav-item" onClick={() => window.open('https://www.wildlybytaronga.com.au', '_blank')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span> Wildly by Taronga
            </button>
            {(cls.subject === 'science' || cls.subject === 'maths') && (
              <button className="lms-nav-item" onClick={() => openTeacherInfoSheet(cls.subject, cls.stage)}>
                <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="3" y="1" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M6 5h4M6 8h4M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></span> Teacher Info Sheet
              </button>
            )}
            {isZZ && (
              <button className="lms-nav-item" onClick={() => window.open('/zoosnooz-notification.html', '_blank')}>
                <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5l2 2-7.5 7.5H4v-2l7.5-7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg></span> Notification Template
              </button>
            )}
          </nav>

          <p className="lms-nav-group-label" style={{ marginTop:'1rem' }}>Class Info</p>
          <div style={{ padding:'0 1.25rem', display:'flex', flexDirection:'column', gap:'0.55rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>Code</span>
              <span style={{ fontFamily:'monospace', fontWeight:700, fontSize:'0.85rem', color:'rgba(255,255,255,0.9)', letterSpacing:'0.1em', cursor:'pointer' }} onClick={() => setClassCodeModal(cls.classCode)}>{cls.classCode}</span>
            </div>
            {cls.stage && (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>Stage</span>
                <span style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.8)', fontWeight:600 }}>Stage {cls.stage}</span>
              </div>
            )}
            {cls.location && (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>Location</span>
                <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.8)', fontWeight:600, textAlign:'right', maxWidth:'120px' }}>
                  {{ 'taronga-sydney':'Taronga Sydney', 'zoosnooz-sydney':'ZooSnooz · Sydney', 'dubbo':'Taronga Dubbo', 'school':'Your School' }[cls.location] || cls.location}
                </span>
              </div>
            )}
            {cls.subject && (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>Subject</span>
                <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.8)', fontWeight:600, textTransform:'capitalize' }}>{cls.subject}</span>
              </div>
            )}
            {!loading && (
              <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginTop:'0.1rem' }}>
                <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#34d399', boxShadow:'0 0 6px rgba(52,211,153,0.6)' }} />
                <span style={{ color:'#34d399', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.08em' }}>LIVE</span>
              </div>
            )}
          </div>

          <p className="lms-nav-group-label" style={{ marginTop:'1.25rem' }}>Settings</p>
          <div style={{ padding:'0 0.75rem 0.5rem' }}>
            <div style={{
              borderRadius:'var(--t-r-md)',
              border: cls.gpsEnabled ? '1.5px solid rgba(34,197,94,0.3)' : '1.5px solid #F59E0B',
              background: cls.gpsEnabled ? 'rgba(34,197,94,0.07)' : 'rgba(245,158,11,0.1)',
              padding:'0.75rem',
            }}>
              {/* Header row */}
              <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.5rem' }}>
                <span style={{ fontSize:'1rem' }}>{cls.gpsEnabled ? '📍' : '🔓'}</span>
                <span style={{ fontSize:'0.75rem', fontWeight:800, color: cls.gpsEnabled ? '#16A34A' : '#B45309', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  {cls.gpsEnabled ? 'GPS On' : 'GPS Off'}
                </span>
              </div>

              {/* Description */}
              <p style={{ margin:'0 0 0.35rem', fontSize:'0.78rem', fontWeight:700, color: isZZ ? 'rgba(212,237,224,0.9)' : 'rgba(255,255,255,0.85)', lineHeight:1.45 }}>
                {cls.gpsEnabled
                  ? 'Students must be near an exhibit to discover it.'
                  : 'Students can discover animals without being nearby.'}
              </p>
              <p style={{ margin:'0 0 0.65rem', fontSize:'0.72rem', color: isZZ ? 'rgba(184,212,192,0.6)' : 'rgba(255,255,255,0.5)', lineHeight:1.5 }}>
                {cls.gpsEnabled
                  ? 'For GPS-enabled devices, e.g. Taronga hire phones.'
                  : 'Use this for NSW Department devices — GPS is blocked.'}
              </p>

              {/* Toggle button */}
              <button
                onClick={async () => {
                  const next = !cls.gpsEnabled;
                  setCls(c => ({ ...c, gpsEnabled: next }));
                  try {
                    await Promise.all([
                      updateDoc(doc(db, 'classes', selectedClass), { gpsEnabled: next }),
                      updateDoc(doc(db, 'teachers', teacherEmail, 'classes', selectedClass), { gpsEnabled: next }),
                    ]);
                  } catch {
                    setCls(c => ({ ...c, gpsEnabled: !next }));
                  }
                }}
                style={{
                  width:'100%', padding:'0.5rem 0.6rem',
                  borderRadius:'var(--t-r-md)', border:'none',
                  cursor:'pointer', fontWeight:700, fontSize:'0.75rem',
                  background: cls.gpsEnabled ? '#DC2626' : '#16A34A',
                  color:'white', transition:'background 0.2s',
                }}
              >
                {cls.gpsEnabled ? '🔓 Disable GPS (Dept Devices)' : '📍 Enable GPS (GPS Devices)'}
              </button>
            </div>
          </div>

          <p className="lms-nav-group-label" style={{ marginTop:'1rem' }}>Actions</p>
          <nav className="lms-nav">
            <button className="lms-nav-item" onClick={downloadCSV} disabled={loading} style={{ opacity: loading ? 0.5 : 1 }}><span className="lms-nav-icon">&#8615;</span> Export CSV</button>
            {!loading && (
              alreadySubmitted
                ? <button className="lms-nav-item" disabled style={{ color:'#34d399', opacity:1, cursor:'default' }}><span className="lms-nav-icon">&#10003;</span> Submitted</button>
                : hasIncomplete
                  ? <button className="lms-nav-item" onClick={handleMarkAllComplete} disabled={submittingAll}><span className="lms-nav-icon">&#10003;</span> {submittingAll ? 'Marking…' : 'Mark All Complete'}</button>
                  : <button className="lms-nav-item" onClick={handleSubmitAll} disabled={submittingAll} style={{ color:'#34d399' }}><span className="lms-nav-icon">&#8679;</span> {submittingAll ? 'Submitting…' : 'Submit Class'}</button>
            )}
            <button className="lms-nav-item" onClick={archiveClass} style={{ color:'rgba(255,255,255,0.5)' }}><span className="lms-nav-icon">&#9900;</span> Archive Class</button>
            <button className="lms-nav-item" onClick={resetClass} style={{ color:'#FCA5A5' }}><span className="lms-nav-icon">&#9888;</span> Reset Data</button>
          </nav>
          {submitSuccess && <div style={{ margin:'0.75rem 1.25rem 0', fontSize:'0.75rem', color:'#34d399', fontWeight:700 }}>✓ Submitted successfully.</div>}
        </div>

        {/* Main */}
        <div className="lms-main">
          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem', minHeight:'300px' }}>
              <div style={{ width:'40px', height:'40px', border:'3px solid rgba(26,82,56,0.15)', borderTop:'3px solid var(--t-mid)', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
              <p style={{ color:'#888', fontSize:'0.85rem' }}>Fetching student data...</p>
            </div>
          ) : (
            <div className="lms-main-inner">

              {/* Page heading */}
              <div style={{ marginBottom:'1.5rem' }}>
                <h2 className="heading-display" style={{ fontSize:'clamp(1.2rem, 2.5vw, 1.5rem)', color: isZZ ? '#D4EDE0' : 'var(--t-deep)', lineHeight:1.2, marginBottom:'0.2rem' }}>{cls.className}</h2>
                <p style={{ color: isZZ ? 'rgba(184,212,192,0.65)' : 'var(--t-slate)', fontSize:'0.8rem' }}>{cls.schoolName}{cls.stage ? ` · Stage ${cls.stage}` : ''} · Code: <span style={{ fontFamily:'monospace', fontWeight:700, color: isZZ ? '#4A9E6B' : 'var(--t-mid)' }}>{cls.classCode}</span></p>
              </div>

              {/* Stat cards */}
              {isZZ ? (() => {
                const zzCompleted  = students.filter(s=>s.zzSessionComplete).length;
                const totalAnimals = students.reduce((sum,s) => sum + ZOOSNOOZ_ANIMALS.filter(a=>(s.zoosnooz||{})[a.id]?.completed).length, 0);
                const avgPts       = students.length > 0 ? Math.round(students.reduce((s,st)=>s+(st.zzTotalPoints||0),0)/students.length) : 0;
                const films        = students.filter(s=>s.zzDocumentaryURL).length;
                return (
                  <div className="lms-stat-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'1.75rem' }}>
                    {[{l:'Students',v:totalStudents,c:'#4A9E6B'},{l:'Submitted',v:zzCompleted,c:'#34D399'},{l:'Avg Pts',v:avgPts,c:'#F59E0B'},{l:'Films',v:films,c:'#2E7D55'}].map(s=>(
                      <div key={s.l} className="lms-stat-card animate-fade-in-up" style={{ borderTopColor:s.c, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(46,125,85,0.2)' }}>
                        <div className="lms-stat-val" style={{ color:s.c, fontSize:'1.6rem' }}>{s.v}</div>
                        <div className="lms-stat-label" style={{ color:'rgba(184,212,192,0.6)' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                );
              })() : (
                <div className="lms-stat-grid" style={{ gridTemplateColumns:'repeat(5,1fr)', marginBottom:'1.75rem' }}>
                  {[{l:'Students',v:totalStudents,c:'#3B82F6'},{l:'Avg Points',v:avgPoints,c:'#F59E0B'},{l:'Badges',v:totalBadges,c:'var(--t-mid)'},{l:'Completed',v:completedCount,c:'#10B981'},{l:'Avg Quiz %',v:`${avgQuizPct}%`,c:'#2E7D55'}].map(s=>(
                    <div key={s.l} className="lms-stat-card animate-fade-in-up" style={{ borderTopColor:s.c }}>
                      <div className="lms-stat-val" style={{ color:s.c, fontSize:'1.6rem' }}>{s.v}</div>
                      <div className="lms-stat-label">{s.l}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── ZooSnooz Class Insights ── */}
              {isZZ && students.length > 0 && (() => {
                let zzTotB=0,zzTotD=0,zzTotW=0,zzObsCnt=0,zzLowB=0,zzLowD=0,zzLowW=0;
                students.forEach(s => {
                  const zzMap = resolveZzData(s);
                  ZOOSNOOZ_ANIMALS.forEach(a => {
                    const ad = zzMap[a.id];
                    if (!ad?.observationScore) return;
                    const obs = ad.observationScore;
                    zzTotB+=obs.behaviour||0; zzTotD+=obs.detail||0; zzTotW+=obs.writing||0; zzObsCnt++;
                    if((obs.behaviour||0)<3) zzLowB++; if((obs.detail||0)<3) zzLowD++; if((obs.writing||0)<3) zzLowW++;
                  });
                });
                const zzAvgB=zzObsCnt?+(zzTotB/zzObsCnt).toFixed(1):0;
                const zzAvgD=zzObsCnt?+(zzTotD/zzObsCnt).toFixed(1):0;
                const zzAvgW=zzObsCnt?+(zzTotW/zzObsCnt).toFixed(1):0;
                const zzLowBPct=zzObsCnt?Math.round(zzLowB/zzObsCnt*100):0;
                const zzLowDPct=zzObsCnt?Math.round(zzLowD/zzObsCnt*100):0;
                const zzLowWPct=zzObsCnt?Math.round(zzLowW/zzObsCnt*100):0;

                const encounterCounts=ZOOSNOOZ_ANIMALS.map(a=>({ name:a.name, count:students.filter(s=>resolveZzData(s)[a.id]).length }));
                const maxEncounter=Math.max(...encounterCounts.map(e=>e.count),1);

                const quizBuckets={'0–25':0,'26–50':0,'51–75':0,'76–100':0};
                students.forEach(s => {
                  const zzMap = resolveZzData(s);
                  const compl = ZOOSNOOZ_ANIMALS.filter(a => zzMap[a.id]);
                  if (!compl.length) return;
                  const correct = compl.filter(a => {
                    const d = zzMap[a.id];
                    return d.quizCorrect === true || d.quizResults?.[0]?.correctOnFirstAttempt === true;
                  }).length;
                  const pct = Math.round((correct/compl.length)*100);
                  if(pct<=25) quizBuckets['0–25']++;
                  else if(pct<=50) quizBuckets['26–50']++;
                  else if(pct<=75) quizBuckets['51–75']++;
                  else quizBuckets['76–100']++;
                });
                const maxQBucket=Math.max(...Object.values(quizBuckets),1);

                const zzDomainList=[
                  {key:'behaviour',label:'Behaviour',icon:'B',avg:zzAvgB,color:'#4A9E6B'},
                  {key:'detail',label:'Detail',icon:'D',avg:zzAvgD,color:'#60A5FA'},
                  {key:'writing',label:'Writing',icon:'W',avg:zzAvgW,color:'#34D399'},
                ];
                const zzSorted=[...zzDomainList].sort((a,b)=>b.avg-a.avg);
                const zzStrongest=zzSorted[0], zzWeakest=zzSorted[zzSorted.length-1];

                const zzStudentStats=students.map(s=>{
                  const zzMap = resolveZzData(s);
                  let tb=0,td=0,tw=0,n=0;
                  ZOOSNOOZ_ANIMALS.forEach(a=>{
                    const ad = zzMap[a.id];
                    if (!ad?.observationScore) return;
                    const obs=ad.observationScore;
                    tb+=obs.behaviour||0; td+=obs.detail||0; tw+=obs.writing||0; n++;
                  });
                  if(!n) return null;
                  return {name:s.name, avg:(tb+td+tw)/(3*n)};
                }).filter(Boolean);
                const zzSupport=zzStudentStats.filter(s=>s.avg<2.5);
                const zzDeveloping=zzStudentStats.filter(s=>s.avg>=2.5&&s.avg<=3.5);
                const zzProficient=zzStudentStats.filter(s=>s.avg>3.5);

                const ns=(sx={})=>({background:'rgba(255,255,255,0.04)',border:'1px solid rgba(46,125,85,0.2)',borderRadius:'var(--t-r-md)',padding:'1rem 1.15rem',marginBottom:'0.7rem',...sx});

                return (
                  <div style={{marginBottom:'1rem'}}>
                    <h3 style={{fontSize:'0.95rem',marginBottom:'0.75rem',color:'#D4EDE0',letterSpacing:'-0.01em',fontWeight:700}}>Class Insights</h3>

                    <div style={ns()}>
                      <p style={{fontSize:'0.68rem',fontWeight:700,color:'rgba(184,212,192,0.65)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.7rem'}}>Animals Encountered</p>
                      {encounterCounts.map(({name,count})=>(
                        <div key={name} style={{marginBottom:'0.5rem'}}>
                          <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.78rem',color:'#A8C4B2',marginBottom:'0.2rem'}}><span>{name}</span><span style={{fontWeight:700,color:'#4A9E6B'}}>{count}</span></div>
                          <div style={{height:'7px',borderRadius:'4px',background:'rgba(46,125,85,0.15)',overflow:'hidden'}}><div style={{height:'100%',width:`${(count/maxEncounter)*100}%`,background:'linear-gradient(90deg,#2E7D55,#4A9E6B)',borderRadius:'4px',transition:'width 0.4s'}}/></div>
                        </div>
                      ))}
                    </div>

                    <div style={ns()}>
                      <p style={{fontSize:'0.68rem',fontWeight:700,color:'rgba(184,212,192,0.65)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.7rem'}}>Quiz Distribution</p>
                      <div style={{display:'flex',alignItems:'flex-end',gap:'0.6rem',height:'110px',paddingBottom:'0.2rem'}}>
                        {Object.entries(quizBuckets).map(([label,val])=>(
                          <div key={label} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'0.25rem'}}>
                            <span style={{fontSize:'0.72rem',fontWeight:700,color:'#4A9E6B'}}>{val}</span>
                            <div style={{width:'100%',height:`${Math.max((val/maxQBucket)*80,val>0?6:0)}px`,background:'linear-gradient(180deg,#4A9E6B,#2E7D55)',borderRadius:'4px 4px 0 0',transition:'height 0.4s'}}/>
                            <span style={{fontSize:'0.65rem',color:'rgba(184,212,192,0.5)',textAlign:'center',lineHeight:1.2}}>{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {zzObsCnt>0&&(
                      <div style={{...ns(),display:'flex',flexDirection:'column',alignItems:'center'}}>
                        <p style={{fontSize:'0.72rem',fontWeight:700,color:'rgba(184,212,192,0.65)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.5rem',alignSelf:'flex-start'}}>Observation Scores</p>
                        <RadarSVG avgB={zzAvgB} avgD={zzAvgD} avgW={zzAvgW} dark={true}/>
                      </div>
                    )}

                    {zzObsCnt>0&&(
                      <>
                        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.75rem',paddingTop:'0.25rem'}}>
                          <div style={{flex:1,height:'2px',background:'linear-gradient(90deg,#2E7D55,transparent)',borderRadius:'2px'}}/>
                          <p style={{fontSize:'0.65rem',fontWeight:800,color:'#4A9E6B',textTransform:'uppercase',letterSpacing:'0.1em',margin:0,whiteSpace:'nowrap'}}>Teaching Takeaways</p>
                          <div style={{flex:1,height:'2px',background:'linear-gradient(270deg,#2E7D55,transparent)',borderRadius:'2px'}}/>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.6rem',marginBottom:'0.75rem'}}>
                          <div style={{background:'rgba(46,125,85,0.12)',border:'1px solid rgba(46,125,85,0.35)',borderRadius:'var(--t-r-md)',padding:'0.9rem 1rem'}}>
                            <p style={{fontSize:'0.65rem',fontWeight:700,color:'#4A9E6B',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'0.3rem'}}>Strength</p>
                            <p style={{fontSize:'0.8rem',fontWeight:700,color:'#D4EDE0',margin:'0 0 0.2rem'}}>{zzStrongest.icon} {zzStrongest.label} ({zzStrongest.avg}/5)</p>
                            <p style={{fontSize:'0.72rem',color:'#A8C4B2',margin:0,lineHeight:1.4}}>Students perform well at {zzStrongest.key==='behaviour'?'identifying what animals do':zzStrongest.key==='detail'?'using supporting ideas and evidence':'constructing clear sentences'}.</p>
                          </div>
                          <div style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.25)',borderRadius:'var(--t-r-md)',padding:'0.9rem 1rem'}}>
                            <p style={{fontSize:'0.65rem',fontWeight:700,color:'#F59E0B',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'0.3rem'}}>Focus Area</p>
                            <p style={{fontSize:'0.8rem',fontWeight:700,color:'#D4EDE0',margin:'0 0 0.2rem'}}>{zzWeakest.icon} {zzWeakest.label} ({zzWeakest.avg}/5)</p>
                            <p style={{fontSize:'0.72rem',color:'#A8C4B2',margin:0,lineHeight:1.4}}>Students need to improve {zzWeakest.key==='behaviour'?'identifying what animals do':zzWeakest.key==='detail'?'using supporting ideas and evidence':'constructing clear sentences'}.</p>
                          </div>
                        </div>
                        <div style={{background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:'var(--t-r-md)',padding:'0.95rem 1.15rem',marginBottom:'0.75rem'}}>
                          <p style={{fontSize:'0.65rem',fontWeight:700,color:'#60A5FA',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'0.3rem'}}>Suggested Next Step</p>
                          <p style={{fontSize:'0.78rem',color:'#A8C4B2',fontWeight:600,margin:0,lineHeight:1.5}}>
                            {zzWeakest.key==='behaviour'?'Help students identify and describe specific animal behaviours at each night exhibit.':zzWeakest.key==='detail'?'Encourage students to include specific details and link observations to the nocturnal environment.':'Support students to write complete sentences with clear scientific language.'}
                          </p>
                        </div>

                        <div style={ns()}>
                          <p style={{fontSize:'0.68rem',fontWeight:700,color:'rgba(184,212,192,0.65)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.75rem'}}>Domain Averages</p>
                          {zzDomainList.map(d=>(
                            <div key={d.key} style={{marginBottom:'0.6rem'}}>
                              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:'0.82rem',marginBottom:'0.22rem'}}>
                                <span style={{color:'#D4EDE0',fontWeight:500}}>{d.icon} {d.label}</span>
                                <span style={{fontWeight:700,color:d.color}}>{d.avg}/5</span>
                              </div>
                              <div style={{height:'6px',background:'rgba(46,125,85,0.15)',borderRadius:'3px',overflow:'hidden'}}>
                                <div style={{height:'100%',width:`${(d.avg/5)*100}%`,background:d.color,borderRadius:'3px',transition:'width 0.5s ease'}}/>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={ns()}>
                          <p style={{fontSize:'0.68rem',fontWeight:700,color:'rgba(184,212,192,0.65)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.65rem'}}>Common Issues</p>
                          {[[zzLowBPct,'of responses showed low behaviour identification'],[zzLowDPct,'of responses showed low supporting detail'],[zzLowWPct,'of responses contained no explanation language']].map(([pct,label])=>(
                            <div key={label} style={{display:'flex',alignItems:'baseline',gap:'0.65rem',marginBottom:'0.45rem'}}>
                              <span style={{fontSize:'0.88rem',fontWeight:700,color:'#F87171',minWidth:'2.8rem'}}>{pct}%</span>
                              <span style={{fontSize:'0.78rem',color:'#A8C4B2',lineHeight:1.4}}>{label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {zzStudentStats.length>0&&(
                      <div style={{marginBottom:'0.5rem'}}>
                        <h3 style={{fontSize:'1rem',fontWeight:700,color:'#D4EDE0',marginBottom:'0.75rem'}}>Student Groups</h3>
                        <div style={ns()}>
                          <p style={{fontSize:'0.72rem',fontWeight:700,color:'rgba(184,212,192,0.5)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.65rem'}}>Overall Performance</p>
                          {[
                            {key:'support',label:'Support',students:zzSupport,bg:'rgba(239,68,68,0.08)',border:'rgba(239,68,68,0.3)',labelColor:'#FCA5A5',tip:'Work with these students on identifying behaviour and adding simple night-observation detail.'},
                            {key:'developing',label:'Developing',students:zzDeveloping,bg:'rgba(245,158,11,0.08)',border:'rgba(245,158,11,0.3)',labelColor:'#FCD34D',tip:'Encourage adding more specific nocturnal detail and clearer explanations.'},
                            {key:'proficient',label:'Proficient',students:zzProficient,bg:'rgba(46,125,85,0.12)',border:'rgba(46,125,85,0.35)',labelColor:'#4A9E6B',tip:'Extend by asking students to explain significance and use scientific reasoning about night adaptation.'},
                          ].map(g=>(
                            <div key={g.key} style={{marginBottom:'0.5rem'}}>
                              <button onClick={()=>setExpandedGroup(expandedGroup===g.key?null:g.key)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',background:g.bg,border:`1px solid ${g.border}`,borderRadius:'var(--t-r-xs)',padding:'0.55rem 0.75rem',cursor:g.students.length>0?'pointer':'default',textAlign:'left'}}>
                                <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                                  <span style={{fontSize:'0.78rem',fontWeight:700,color:g.labelColor}}>{g.label}</span>
                                  <span style={{fontSize:'0.72rem',background:'rgba(255,255,255,0.07)',color:g.labelColor,borderRadius:'var(--t-r-sm)',padding:'0.05rem 0.4rem',fontWeight:700}}>{g.students.length}</span>
                                </div>
                                {g.students.length>0&&<span style={{fontSize:'0.75rem',color:g.labelColor,opacity:0.7}}>{expandedGroup===g.key?'▴':'▾'}</span>}
                              </button>
                              {expandedGroup===g.key&&g.students.length>0&&(
                                <div style={{background:g.bg,borderLeft:`3px solid ${g.border}`,borderRadius:'0 0 8px 8px',padding:'0.6rem 0.75rem',marginTop:'-2px'}}>
                                  <p style={{fontSize:'0.72rem',color:g.labelColor,fontStyle:'italic',margin:'0 0 0.4rem',lineHeight:1.4}}>{g.tip}</p>
                                  <div style={{display:'flex',flexWrap:'wrap',gap:'0.3rem'}}>
                                    {g.students.map((s,i)=><span key={i} style={{fontSize:'0.72rem',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'var(--t-r-pill)',padding:'0.15rem 0.55rem',color:'#D4EDE0',fontWeight:600}}>{s.name}</span>)}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ── Class Insights (day mode) ── */}
              {!isZZ && students.length > 0 && (() => {
                const animalCounts = {};
                students.forEach(s => (s.badges||[]).forEach(b => { if(b.animal) animalCounts[b.animal]=(animalCounts[b.animal]||0)+1; }));
                const topAnimals = Object.entries(animalCounts).sort((a,b)=>b[1]-a[1]).slice(0,6);
                const maxAnimal  = topAnimals[0]?.[1] || 1;
                const quizBuckets = {'0–25':0,'26–50':0,'51–75':0,'76–100':0};
                students.forEach(s => {
                  const allQR = (s.badges||[]).flatMap(b => b.quizResults||[]);
                  if (!allQR.length) return;
                  const q = Math.round(allQR.filter(r => r.correctOnFirstAttempt === true).length / allQR.length * 100);
                  if(q<=25) quizBuckets['0–25']++; else if(q<=50) quizBuckets['26–50']++; else if(q<=75) quizBuckets['51–75']++; else quizBuckets['76–100']++;
                });
                const maxBucket = Math.max(...Object.values(quizBuckets),1);
                const domainList = isMaths ? [
                  { key:'behaviour', label:'Method',        icon:'M', avg:avgB, color:'#059669' },
                  { key:'detail',    label:'Accuracy',      icon:'A', avg:avgD, color:'#0284C7' },
                  { key:'writing',   label:'Communication', icon:'C', avg:avgW, color:'#2E7D55' },
                ] : isPdhpe ? [
                  { key:'behaviour', label:'Comparison',    icon:'C', avg:avgB, color:'#DC2626' },
                  { key:'detail',    label:'Understanding', icon:'U', avg:avgD, color:'#7C3AED' },
                  { key:'writing',   label:'Communication', icon:'W', avg:avgW, color:'#059669' },
                ] : [
                  { key:'behaviour', label:'Behaviour', icon:'B', avg:avgB, color:'#059669' },
                  { key:'detail',    label:'Detail',    icon:'D', avg:avgD, color:'#0284C7' },
                  { key:'writing',   label:'Writing',   icon:'W', avg:avgW, color:'#2E7D55' },
                ];
                const sorted   = [...domainList].sort((a,b)=>b.avg-a.avg);
                const strongest = sorted[0], weakest = sorted[sorted.length-1];

                // Common Issues thresholds (score < 3 = low)
                let lowB=0, lowD=0, lowW=0, obsTotal=0;
                students.forEach(s => (s.badges||[]).forEach(b => {
                  const obs = b.observationScore;
                  if (!obs || typeof obs !== 'object') return;
                  obsTotal++;
                  if ((obs.behaviour||0) < 3) lowB++;
                  if ((obs.detail||0)    < 3) lowD++;
                  if ((obs.writing||0)   < 3) lowW++;
                }));
                const lowBPct = obsTotal > 0 ? Math.round(lowB/obsTotal*100) : 0;
                const lowDPct = obsTotal > 0 ? Math.round(lowD/obsTotal*100) : 0;
                const lowWPct = obsTotal > 0 ? Math.round(lowW/obsTotal*100) : 0;
                const stagePrefix = isMaths
                  ? (stage<=2 ? 'Students are building number sense and early maths reasoning.' : stage===3 ? 'Students are developing written maths communication skills.' : stage===5 ? 'Students should construct and explain mathematical arguments clearly.' : 'Students should show their working and explain their mathematical thinking.')
                  : isPdhpe
                  ? (stage<=2 ? 'Students are building awareness of their own body and physical activity.' : stage===3 ? 'Students are developing PDHPE vocabulary to describe physiological and wellbeing concepts.' : stage===5 ? 'Students should evaluate physiological responses and wellbeing frameworks using evidence.' : 'Students should apply PDHPE concepts to explain what they observe.')
                  : (stage<=2 ? 'Students are building observation skills.' : stage===3 ? 'Students are developing observation and explanation skills.' : stage===5 ? 'Students should explain their observations using clear reasoning.' : 'Students should describe observations and begin to explain them.');
                const actions = isMaths ? {
                  behaviour: stage<=2 ? 'Encourage students to write at least one number or calculation they found.' : stage===5 ? 'Help students present working in a clear, logical sequence using correct notation.' : 'Encourage students to show each step of their working clearly.',
                  detail:    stage<=2 ? 'Ask students to include a number with a unit (e.g. 3 steps, 2 kg).' : stage===5 ? 'Prompt students to verify their answer and include appropriate units or notation.' : 'Encourage students to check numbers match the question and include units in all answers.',
                  writing:   stage<=2 ? 'Support students to label their working (e.g. "My answer is…").' : stage===5 ? 'Model structured maths communication: method → calculation → conclusion.' : 'Encourage students to use mathematical vocabulary and write in complete sentences.',
                } : isPdhpe ? {
                  behaviour: stage<=2 ? 'Ask students to describe one physical or social behaviour they noticed in the animal.' : stage===5 ? 'Prompt students to connect observations to specific physiological systems (cardiovascular, musculoskeletal, endocrine).' : 'Help students name and describe specific physical or health-related behaviours they observed.',
                  detail:    stage<=2 ? 'Ask students to name one body part or feeling connected to their observation.' : stage===5 ? 'Encourage students to apply PDHPE frameworks (biopsychosocial model, energy systems, SDT) with evidence.' : 'Prompt students to link observations to a named PDHPE concept (heart rate, cortisol, muscle fibre type).',
                  writing:   stage<=2 ? 'Help students write a full sentence starting with "I noticed…".' : stage===5 ? 'Model extended PDHPE response: observation → physiological explanation → health implication.' : 'Encourage full sentences with PDHPE vocabulary and an explanatory connector (because, therefore, which means).',
                } : {
                  behaviour: stage<=2 ? 'Encourage students to say what the animal is doing.' : stage===5 ? 'Help students link observations to scientific concepts.' : 'Help students identify and name specific behaviours at each exhibit.',
                  detail:    stage<=2 ? 'Ask students to add one more thing they noticed.' : stage===5 ? 'Prompt students to include specific evidence and explain significance.' : 'Encourage students to include specific features, sounds, or environmental details.',
                  writing:   stage<=2 ? 'Support students to write a full sentence.' : stage===5 ? 'Model extended response structure: observation → explanation → ecosystem link.' : 'Encourage full sentences with capital letters, punctuation, and at least one clear idea.',
                };
                return (
                  <div style={{ marginBottom:'1rem' }}>
                    <h3 style={{ fontSize:'0.95rem', marginBottom:'0.75rem', color:'var(--t-deep)', letterSpacing:'-0.01em', fontWeight:700 }}>Class Insights</h3>
                    {/* Most Visited */}
                    <div style={nightStyle()}>
                      <p style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--t-slate)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.7rem' }}>Most Visited Animals</p>
                      {topAnimals.length === 0 ? <p style={{ fontSize:'0.78rem', color:'#bbb' }}>No data yet</p> :
                        topAnimals.map(([name,count]) => (
                          <div key={name} style={{ marginBottom:'0.5rem' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', color:'#555', marginBottom:'0.2rem' }}><span>{name}</span><span style={{ fontWeight:700, color:'var(--t-mid)' }}>{count}</span></div>
                            <div style={{ height:'7px', borderRadius:'4px', background:'#EEE', overflow:'hidden' }}><div style={{ height:'100%', width:`${(count/maxAnimal)*100}%`, background:'linear-gradient(90deg,var(--t-mid),var(--t-eucalyptus))', borderRadius:'4px', transition:'width 0.4s' }} /></div>
                          </div>
                        ))
                      }
                    </div>
                    {/* Quiz Distribution */}
                    <div style={nightStyle()}>
                      <p style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--t-slate)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.7rem' }}>Quiz Distribution</p>
                      <div style={{ display:'flex', alignItems:'flex-end', gap:'0.6rem', height:'110px', paddingBottom:'0.2rem' }}>
                        {Object.entries(quizBuckets).map(([label,val]) => (
                          <div key={label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.25rem' }}>
                            <span style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--t-mid)' }}>{val}</span>
                            <div style={{ width:'100%', height:`${Math.max((val/maxBucket)*80,val>0?6:0)}px`, background:'linear-gradient(180deg,var(--t-eucalyptus),var(--t-mid))', borderRadius:'4px 4px 0 0', transition:'height 0.4s' }} />
                            <span style={{ fontSize:'0.65rem', color:'#999', textAlign:'center', lineHeight:1.2 }}>{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Observation/Maths Radar */}
                    {obsCnt > 0 && (
                      <div style={{ ...nightStyle(), display:'flex', flexDirection:'column', alignItems:'center' }}>
                        <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.5rem', alignSelf:'flex-start' }}>{isMaths ? 'Maths Scores' : isPdhpe ? 'PDHPE Scores' : 'Writing Scores'}</p>
                        <RadarSVG avgB={avgB} avgD={avgD} avgW={avgW} dark={false} labels={isMaths ? ['Method','Accuracy','Comms'] : isPdhpe ? ['Compare','Understand','Comms'] : undefined} />
                      </div>
                    )}
                    {/* ── Student table ── */}
                    {isZZ ? (
                      <div style={{ background:'linear-gradient(160deg,#020D06 0%,#040F08 100%)', borderRadius:'var(--t-r-lg)', border:'1px solid rgba(46,125,85,0.3)', overflow:'hidden', marginBottom:'1.5rem' }}>
                        <div style={{ padding:'0.75rem 1rem', background:'linear-gradient(135deg,#071E14,#0A2F1F)', borderBottom:'1px solid rgba(46,125,85,0.25)', display:'flex', alignItems:'center', gap:'0.65rem' }}>
                          <span>🌙</span>
                          <span style={{ fontSize:'0.85rem', fontWeight:700, color:'white' }}>ZooSnooz Night Program</span>
                          <span style={{ fontSize:'0.72rem', color:'rgba(184,212,192,0.65)', marginLeft:'auto' }}>{students.length} students · {ZOOSNOOZ_ANIMALS.length} animals</span>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.88rem' }}>
                            <thead>
                              <tr style={{ borderBottom:'1px solid rgba(46,125,85,0.25)' }}>
                                {['Student','Points','Quiz %','Animals','Submitted','Actions'].map(h => (
                                  <th key={h} style={{ textAlign:h==='Student'?'left':'center', padding:'0.65rem 0.75rem', fontWeight:600, color:'#4A9E6B', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {students.length === 0 ? (
                                <tr><td colSpan={6} style={{ textAlign:'center', padding:'2rem', color:'rgba(184,212,192,0.4)', fontSize:'0.85rem' }}>No students yet.</td></tr>
                              ) : students.map((s,i) => {
                                const zzMap = resolveZzData(s);
                                const completedIds = ZOOSNOOZ_ANIMALS.filter(a => zzMap[a.id]).map(a => a.id);
                                const completedCount = completedIds.length;
                                const allDone = completedCount === ZOOSNOOZ_ANIMALS.length;
                                const zzPts   = s.zzTotalPoints ?? 0;
                                const correct = completedIds.filter(id => {
                                  const d = zzMap[id];
                                  return d.quizCorrect === true || d.quizResults?.[0]?.correctOnFirstAttempt === true;
                                }).length;
                                const quizPct = completedCount > 0
                                  ? Math.round((correct / completedCount) * 100)
                                  : (s.quizPercentage != null ? s.quizPercentage : null);
                                return (
                                  <tr key={i} style={{ borderBottom:'1px solid rgba(46,125,85,0.1)', background: allDone?'rgba(46,125,85,0.08)':i%2===0?'rgba(255,255,255,0.02)':'transparent' }}>
                                    <td style={{ padding:'0.8rem 0.75rem', color:'#D4EDE0', fontWeight:600 }}>{s.name}{allDone&&<span style={{ marginLeft:'0.4rem', fontSize:'0.6rem', background:'#2E7D55', color:'white', borderRadius:'4px', padding:'0.1rem 0.35rem', fontWeight:700, verticalAlign:'middle' }}>Done</span>}</td>
                                    <td style={{ padding:'0.8rem 0.75rem', textAlign:'center', fontWeight:700, color:'#A8C4B2' }}>{completedCount>0?zzPts:<span style={{ color:'rgba(255,255,255,0.2)' }}> - </span>}</td>
                                    <td style={{ padding:'0.8rem 0.75rem', textAlign:'center', fontWeight:600, color:'#4A9E6B' }}>{quizPct!==null?`${quizPct}%`:<span style={{ color:'rgba(255,255,255,0.2)' }}> - </span>}</td>
                                    <td style={{ padding:'0.8rem 0.75rem', textAlign:'center' }}>
                                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.2rem' }}>
                                        <div style={{ width:'48px', height:'4px', background:'rgba(46,125,85,0.2)', borderRadius:'3px', overflow:'hidden' }}><div style={{ height:'100%', width:`${(completedCount/ZOOSNOOZ_ANIMALS.length)*100}%`, background:'#2E7D55', borderRadius:'3px' }}/></div>
                                        <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#4A9E6B' }}>{completedCount}/{ZOOSNOOZ_ANIMALS.length}</span>
                                      </div>
                                    </td>
                                    <td style={{ padding:'0.8rem 0.75rem', textAlign:'center', color:'rgba(184,212,192,0.5)', fontSize:'0.82rem' }}>
                                      {s.completedAt ? new Date(s.completedAt.toDate?.() || s.completedAt).toLocaleDateString('en-AU',{day:'numeric',month:'short'}) : ' - '}
                                    </td>
                                    <td style={{ padding:'0.8rem 0.75rem', textAlign:'center' }}>
                                      {completedCount>0 ? <button onClick={() => setObsModal({...s, isZZ:true})} style={{ background:'rgba(46,125,85,0.18)', color:'#A8C4B2', border:'1px solid rgba(46,125,85,0.35)', padding:'0.25rem 0.55rem', borderRadius:'var(--t-r-xs)', fontSize:'0.75rem', fontWeight:600, cursor:'pointer' }}>View</button> : <span style={{ color:'rgba(255,255,255,0.2)', fontSize:'0.72rem' }}> - </span>}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', overflow:'hidden', border:'1px solid var(--t-stone)', marginBottom:'1rem' }}>
                        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 0.6fr 0.6fr 0.6fr 0.85fr 1.4fr 0.75fr 1.1fr', background:'var(--t-forest)', padding:'0.6rem 1rem' }}>
                          {['Student','Points','Badges','Quiz %','Observations','Conservation Statement','Status','Actions'].map(h => (
                            <div key={h} style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</div>
                          ))}
                        </div>
                        {students.length === 0 ? (
                          <div style={{ padding:'2rem 1rem', textAlign:'center' }}><p style={{ color:'#999', fontSize:'0.85rem', fontStyle:'italic' }}>No students have submitted yet.</p></div>
                        ) : students.map((s,i) => {
                          const badgeCount   = Array.isArray(s.badges) ? new Set(s.badges.map(b=>b.animalId).filter(Boolean)).size : 0;
                          const hasObs       = (s.badges||[]).some(b=>b.observation);
                          const busy = studentActionBusy[s.id];
                          return (
                            <div key={s.name} style={{ display:'grid', gridTemplateColumns:'1.4fr 0.6fr 0.6fr 0.6fr 0.85fr 1.4fr 0.75fr 1.1fr', padding:'0.7rem 1rem', borderTop:'1px solid var(--t-stone)', alignItems:'center', background: i%2===0 ? 'var(--t-chalk)' : 'var(--t-parchment)' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:'0.55rem' }}>
                                <div style={{ width:'28px', height:'28px', borderRadius:'50%', background: s.completed ? 'linear-gradient(135deg,var(--t-mid),var(--t-eucalyptus))' : 'linear-gradient(135deg,#aaa,#ccc)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'0.72rem', fontWeight:700, flexShrink:0 }}>{s.name.charAt(0).toUpperCase()}</div>
                                <span style={{ fontWeight:600, color:'var(--t-deep)', fontSize:'0.88rem' }}>{s.name}</span>
                              </div>
                              <div style={{ fontWeight:700, color:'var(--sunset-orange)', fontSize:'0.9rem' }}>{s.totalPoints||0}</div>
                              <div style={{ fontWeight:600, color:'var(--t-mid)', fontSize:'0.9rem' }}>{badgeCount}</div>
                              <div style={{ fontWeight:600, color:'var(--t-mid)', fontSize:'0.85rem' }}>{s.quizPercentage!==undefined ? `${s.quizPercentage}%` : ' - '}</div>
                              <div>{hasObs ? <button onClick={()=>setObsModal(s)} style={{ background:'var(--t-deep)', color:'white', border:'none', padding:'0.25rem 0.6rem', borderRadius:'6px', fontSize:'0.72rem', fontWeight:600, cursor:'pointer' }}>View</button> : <span style={{ color:'#bbb', fontSize:'0.75rem' }}> - </span>}</div>
                              <div>{s.conservationStatement ? <button onClick={()=>setConservationModal({name:s.name,text:s.conservationStatement})} style={{ background:'var(--t-deep)', color:'white', border:'none', padding:'0.25rem 0.6rem', borderRadius:'6px', fontSize:'0.72rem', fontWeight:600, cursor:'pointer' }}>View</button> : <span style={{ color:'#bbb', fontSize:'0.75rem' }}> - </span>}</div>
                              <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                                <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: s.status==='complete'?'#16A34A':'#CA8A04' }} />
                                <span style={{ fontSize:'0.72rem', fontWeight:700, color: s.status==='complete'?'#16A34A':'#CA8A04' }}>{s.status==='complete'?'Complete':'Incomplete'}</span>
                              </div>
                              <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                                <button
                                  onClick={() => resetStudent(s)}
                                  disabled={!!busy}
                                  title="Restore to animal list (keeps badges)"
                                  style={{ display:'flex', alignItems:'center', gap:'0.25rem', background:'none', color:'#D97706', border:'1.5px solid #FCD34D', padding:'0.28rem 0.55rem', borderRadius:'7px', fontSize:'0.72rem', fontWeight:700, cursor:busy?'not-allowed':'pointer', opacity:busy?0.4:1, transition:'background 0.15s, color 0.15s', whiteSpace:'nowrap' }}
                                  onMouseEnter={e=>{ if(!busy){e.currentTarget.style.background='#FFFBEB';e.currentTarget.style.color='#B45309';} }}
                                  onMouseLeave={e=>{ e.currentTarget.style.background='none';e.currentTarget.style.color='#D97706'; }}>
                                  {busy==='resetting' ? <span style={{ fontSize:'0.85rem' }}>…</span> : <><span style={{ fontSize:'0.9rem', lineHeight:1 }}>↺</span> <span>Restore</span></>}
                                </button>
                                <button
                                  onClick={() => deleteStudent(s)}
                                  disabled={!!busy}
                                  title="Delete student"
                                  style={{ display:'flex', alignItems:'center', gap:'0.25rem', background:'none', color:'#DC2626', border:'1.5px solid #FECACA', padding:'0.28rem 0.55rem', borderRadius:'7px', fontSize:'0.72rem', fontWeight:700, cursor:busy?'not-allowed':'pointer', opacity:busy?0.4:1, transition:'background 0.15s, color 0.15s', whiteSpace:'nowrap' }}
                                  onMouseEnter={e=>{ if(!busy){e.currentTarget.style.background='#FEF2F2';e.currentTarget.style.color='#B91C1C';} }}
                                  onMouseLeave={e=>{ e.currentTarget.style.background='none';e.currentTarget.style.color='#DC2626'; }}>
                                  {busy==='deleting' ? <span style={{ fontSize:'0.85rem' }}>…</span> : <><span style={{ fontSize:'0.85rem', lineHeight:1 }}>🗑</span> <span>Delete</span></>}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* ── How It's Marked (day mode) ── */}
                    {!isZZ && (
                      <div style={{ marginBottom:'1rem', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-mist)', background:'var(--t-chalk)', overflow:'hidden' }}>
                        <button onClick={() => setMarkingCardOpen(o=>!o)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.55rem 1.2rem', background:'linear-gradient(135deg,var(--t-foam) 0%,#E4EFE8 100%)', border:'none', cursor:'pointer', textAlign:'left' }}>
                          <span style={{ fontWeight:700, fontSize:'0.9rem', color:'var(--t-deep)' }}>How Student Responses Are Marked</span>
                          <span style={{ fontSize:'1.1rem', color:'var(--t-mid)', transition:'transform 0.2s', display:'inline-block', transform:markingCardOpen?'rotate(180deg)':'rotate(0deg)' }}>▾</span>
                        </button>
                        {markingCardOpen && (
                          <div style={{ padding:'1rem', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0.75rem' }}>
                            {(isMaths ? [
                              {title:'Method',color:'#34A85A',bg:'#F4FBF7',desc:'Assesses whether students show their mathematical working.',items:['Numbers, operators, and equations used','Step-by-step working visible in response'],note:'Higher: clear, logical working chain'},
                              {title:'Accuracy',color:'#4A90D9',bg:'#F4F7FB',desc:'Assesses correctness of numbers, units, and answers.',items:['Numbers and measurements present','Correct answer included with appropriate units'],note:'Correct key answer detected = score boost'},
                              {title:'Communication',color:'#E8894A',bg:'#FDF8F4',desc:'Assesses clarity of mathematical expression.',items:['Structured response with labels or steps','Mathematical vocabulary used appropriately'],note:'Higher: well-structured, precise maths language'},
                            ] : isPdhpe ? [
                              {title:'Physical Obs',color:'#DC2626',bg:'#FEF2F2',desc:'Assesses whether students identified a relevant physical or health-related behaviour.',items:['Named a physical action or social behaviour','Connected observation to the body or health'],note:'Higher: specific PDHPE-relevant observation with correct terminology'},
                              {title:'Health Concepts',color:'#7C3AED',bg:'#F5F3FF',desc:'Assesses application of PDHPE knowledge to what they observed.',items:['Named a body system, hormone, or health concept','Explained a physiological or mental health connection'],note:'Higher: accurate, in-depth application of PDHPE frameworks'},
                              {title:'Communication',color:'#059669',bg:'#F0FDF4',desc:'Assesses clarity and use of PDHPE language.',items:['Full sentences with PDHPE vocabulary','Explanatory language: because, therefore, which means'],note:'Higher: structured, precise PDHPE language throughout'},
                            ] : [
                              {title:'Behaviour',color:'#34A85A',bg:'#F4FBF7',desc:'Assesses what students observe at the exhibit.',items:['Identifying what the animal is doing','Recognising behaviours (feeding, resting, interacting)'],note:'Higher: clear, accurate observations'},
                              {title:'Detail',color:'#4A90D9',bg:'#F4F7FB',desc:'Assesses level of understanding shown.',items:['A clear observation or relevant concept','A simple explanation or link to behaviour'],note:'Students do NOT need all elements for marks'},
                              {title:'Writing',color:'#E8894A',bg:'#FDF8F4',desc:'Assesses clarity of communication.',items:['Full sentences, appropriate terminology','Clear expression of ideas'],note:'Higher: well-structured, scientific language'},
                            ]).map(d => (
                              <div key={d.title} style={{ background:d.bg, borderRadius:'var(--t-r-sm)', padding:'0.85rem 1rem', borderLeft:`4px solid ${d.color}` }}>
                                <p style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--t-deep)', marginBottom:'0.4rem' }}>{d.title}</p>
                                <p style={{ fontSize:'0.78rem', color:'#555', marginBottom:'0.4rem', lineHeight:1.6 }}>{d.desc}</p>
                                <ul style={{ margin:'0 0 0.4rem', paddingLeft:'1rem', fontSize:'0.76rem', color:'#555', lineHeight:1.8 }}>{d.items.map(i=><li key={i}>{i}</li>)}</ul>
                                <p style={{ fontSize:'0.74rem', fontWeight:600, color:d.color, margin:0 }}>{d.note}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Teaching Takeaways */}
                    {obsCnt > 0 && (
                      <>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem', paddingTop:'0.25rem' }}>
                          <div style={{ flex:1, height:'2px', background:'linear-gradient(90deg,var(--t-eucalyptus),transparent)', borderRadius:'2px' }} />
                          <p style={{ fontSize:'0.65rem', fontWeight:800, color:'var(--t-mid)', textTransform:'uppercase', letterSpacing:'0.1em', margin:0, whiteSpace:'nowrap' }}>Teaching Takeaways</p>
                          <div style={{ flex:1, height:'2px', background:'linear-gradient(270deg,var(--t-eucalyptus),transparent)', borderRadius:'2px' }} />
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem', marginBottom:'0.75rem' }}>
                          <div style={{ background:'var(--t-success-bg)', border:'1px solid #BBF7D0', borderRadius:'var(--t-r-md)', padding:'0.9rem 1rem' }}>
                            <p style={{ fontSize:'0.65rem', fontWeight:700, color:'#15803D', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.3rem' }}>Strength</p>
                            <p style={{ fontSize:'0.8rem', fontWeight:700, color:'#14532D', margin:'0 0 0.2rem' }}>{strongest.icon} {strongest.label} ({strongest.avg}/5)</p>
                            <p style={{ fontSize:'0.72rem', color:'#166534', margin:0, lineHeight:1.4 }}>Students perform well at {isMaths ? (strongest.key === 'behaviour' ? 'showing clear working steps' : strongest.key === 'detail' ? 'including correct numbers and units' : 'structuring responses with maths vocabulary') : isPdhpe ? (strongest.key === 'behaviour' ? 'identifying physical and health-related behaviours' : strongest.key === 'detail' ? 'applying PDHPE concepts and terminology' : 'communicating ideas clearly using PDHPE language') : (strongest.key === 'behaviour' ? 'identifying what animals do' : strongest.key === 'detail' ? 'using supporting ideas and evidence' : 'constructing clear sentences')}.</p>
                          </div>
                          <div style={{ background:'var(--t-warning-bg)', border:'1px solid #FED7AA', borderRadius:'var(--t-r-md)', padding:'0.9rem 1rem' }}>
                            <p style={{ fontSize:'0.65rem', fontWeight:700, color:'#C2410C', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.3rem' }}>Focus Area</p>
                            <p style={{ fontSize:'0.8rem', fontWeight:700, color:'#7C2D12', margin:'0 0 0.2rem' }}>{weakest.icon} {weakest.label} ({weakest.avg}/5)</p>
                            <p style={{ fontSize:'0.72rem', color:'#9A3412', margin:0, lineHeight:1.4 }}>Students need to improve {isMaths ? (weakest.key === 'behaviour' ? 'showing clear working steps' : weakest.key === 'detail' ? 'including correct numbers and units' : 'structuring responses with maths vocabulary') : isPdhpe ? (weakest.key === 'behaviour' ? 'identifying physical and health-related behaviours' : weakest.key === 'detail' ? 'applying PDHPE concepts and terminology' : 'communicating ideas using PDHPE language') : (weakest.key === 'behaviour' ? 'identifying what animals do' : weakest.key === 'detail' ? 'using supporting ideas and evidence' : 'constructing clear sentences')}.</p>
                          </div>
                        </div>
                        <div style={{ background:'var(--t-info-bg)', border:'1px solid #BFDBFE', borderRadius:'var(--t-r-md)', padding:'0.95rem 1.15rem', marginBottom:'0.75rem' }}>
                          <p style={{ fontSize:'0.65rem', fontWeight:700, color:'#1D4ED8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.3rem' }}>Suggested Next Step</p>
                          <p style={{ fontSize:'0.75rem', color:'#1E3A5F', margin:'0 0 0.3rem', lineHeight:1.5, fontStyle:'italic' }}>{stagePrefix}</p>
                          <p style={{ fontSize:'0.78rem', color:'#1E40AF', fontWeight:600, margin:0, lineHeight:1.5 }}>{actions[weakest.key]}</p>
                        </div>

                        {/* Domain Averages */}
                        <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', padding:'1rem 1.15rem', boxShadow:'var(--t-shadow-xs)', marginBottom:'0.7rem', border:'1px solid var(--t-stone)' }}>
                          <p style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--t-slate)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.75rem' }}>Domain Averages</p>
                          {domainList.map(d => (
                            <div key={d.key} style={{ marginBottom:'0.6rem' }}>
                              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.82rem', marginBottom:'0.22rem' }}>
                                <span style={{ color:'var(--t-deep)', fontWeight:500 }}>{d.icon} {d.label}</span>
                                <span style={{ fontWeight:700, color:d.color }}>{d.avg}/5</span>
                              </div>
                              <div style={{ height:'6px', background:'#EAEAEA', borderRadius:'3px', overflow:'hidden' }}>
                                <div style={{ height:'100%', width:`${(d.avg/5)*100}%`, background:d.color, borderRadius:'3px', transition:'width 0.5s ease' }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Common Issues */}
                        <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', padding:'1rem 1.15rem', boxShadow:'var(--t-shadow-xs)', marginBottom:'0.7rem', border:'1px solid var(--t-stone)' }}>
                          <p style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--t-slate)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.65rem' }}>Common Issues</p>
                          {(isMaths ? [
                            [lowBPct, 'of responses showed insufficient working or method'],
                            [lowDPct, 'of responses showed low accuracy (numbers, units or answer)'],
                            [lowWPct, 'of responses lacked clear mathematical communication'],
                          ] : isPdhpe ? [
                            [lowBPct, 'of responses lacked specific physical or health-related observation'],
                            [lowDPct, 'of responses did not apply PDHPE concepts or terminology'],
                            [lowWPct, 'of responses lacked structured PDHPE communication'],
                          ] : [
                            [lowBPct, 'of responses showed low behaviour identification'],
                            [lowDPct, 'of responses showed low supporting detail'],
                            [lowWPct, 'of responses contained no explanation language'],
                          ]).map(([pct, label]) => (
                            <div key={label} style={{ display:'flex', alignItems:'baseline', gap:'0.65rem', marginBottom:'0.45rem' }}>
                              <span style={{ fontSize:'0.88rem', fontWeight:700, color:'#DC2626', minWidth:'2.8rem' }}>{pct}%</span>
                              <span style={{ fontSize:'0.78rem', color:'#555', lineHeight:1.4 }}>{label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* ── Student Groups (day mode) ── */}
              {!isZZ && students.length > 0 && obsCnt > 0 && (() => {
                const studentStats = students.map(s => {
                  let tb=0,td=0,tw=0,n=0;
                  (s.badges||[]).forEach(b => { const obs=b.observationScore; if(!obs||typeof obs!=='object') return; tb+=obs.behaviour||0; td+=obs.detail||0; tw+=obs.writing||0; n++; });
                  if (!n) return null;
                  const avg=(tb+td+tw)/(3*n);
                  return { name:s.name, avg, avgB:tb/n, avgD:td/n, avgW:tw/n };
                }).filter(Boolean);
                if (!studentStats.length) return null;
                const support    = studentStats.filter(s=>s.avg<2.5);
                const developing = studentStats.filter(s=>s.avg>=2.5&&s.avg<=3.5);
                const proficient = studentStats.filter(s=>s.avg>3.5);
                const groups = [
                  { key:'support',    label:'Support',    students:support,    bg:'#FEF2F2', border:'#FECACA', labelColor:'#991B1B', tip: isMaths ? 'Work with these students on writing numbers and showing at least one step of working.' : isPdhpe ? 'Ask these students to name one body part or health concept connected to what they observed.' : 'Work with these students on identifying behaviour and adding simple detail.' },
                  { key:'developing', label:'Developing', students:developing, bg:'#FFFBEB', border:'#FDE68A', labelColor:'#92400E', tip: isMaths ? 'Encourage more complete working, correct units, and mathematical vocabulary.' : isPdhpe ? 'Prompt students to name a specific PDHPE concept (heart rate, cortisol, muscle type) and explain how it connects to their observation.' : 'Encourage adding more specific detail and clearer explanations.' },
                  { key:'proficient', label:'Proficient', students:proficient, bg:'#F0FDF4', border:'#BBF7D0', labelColor:'#14532D', tip: isMaths ? 'Extend by asking students to verify answers, explain their method, and apply maths to new contexts.' : isPdhpe ? 'Challenge these students to apply a PDHPE framework (biopsychosocial model, energy systems, SDT) and evaluate evidence.' : 'Extend by asking students to explain significance and use scientific reasoning.' },
                ];
                return (
                  <div style={{ marginBottom:'1rem' }}>
                    <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.75rem' }}>Student Groups</h3>
                    <div style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', padding:'1rem 1.15rem', boxShadow:'var(--t-shadow-xs)', marginBottom:'0.7rem', border:'1px solid var(--t-stone)' }}>
                      <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.65rem' }}>Overall Performance</p>
                      {groups.map(g => (
                        <div key={g.key} style={{ marginBottom:'0.5rem' }}>
                          <button onClick={() => setExpandedGroup(expandedGroup===g.key?null:g.key)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', background:g.bg, border:`1px solid ${g.border}`, borderRadius:'var(--t-r-xs)', padding:'0.55rem 0.75rem', cursor:g.students.length>0?'pointer':'default', textAlign:'left' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                              <span style={{ fontSize:'0.78rem', fontWeight:700, color:g.labelColor }}>{g.label}</span>
                              <span style={{ fontSize:'0.72rem', background:'rgba(0,0,0,0.07)', color:g.labelColor, borderRadius:'var(--t-r-sm)', padding:'0.05rem 0.4rem', fontWeight:700 }}>{g.students.length}</span>
                            </div>
                            {g.students.length>0 && <span style={{ fontSize:'0.75rem', color:g.labelColor, opacity:0.7 }}>{expandedGroup===g.key?'▴':'▾'}</span>}
                          </button>
                          {expandedGroup===g.key && g.students.length>0 && (
                            <div style={{ background:g.bg, borderLeft:`3px solid ${g.border}`, borderRadius:'0 0 8px 8px', padding:'0.6rem 0.75rem', marginTop:'-2px' }}>
                              <p style={{ fontSize:'0.72rem', color:g.labelColor, fontStyle:'italic', margin:'0 0 0.4rem', lineHeight:1.4 }}>{g.tip}</p>
                              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.3rem' }}>
                                {g.students.map((s,i) => <span key={i} style={{ fontSize:'0.72rem', background:'white', border:'1px solid #E5E7EB', borderRadius:'var(--t-r-pill)', padding:'0.15rem 0.55rem', color:'#374151', fontWeight:600 }}>{s.name}</span>)}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ── Student Documentaries ── */}
              {isZZ && students.some(s=>s.zzDocumentaryURL) && (
                <div style={{marginBottom:'1.5rem'}}>
                  <h3 style={{fontSize:'0.95rem',fontWeight:700,color:'#D4EDE0',marginBottom:'0.75rem'}}>🎬 Student Documentaries</h3>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'0.75rem'}}>
                    {students.filter(s=>s.zzDocumentaryURL).map((s,i)=>(
                      <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(46,125,85,0.2)',borderRadius:'var(--t-r-md)',overflow:'hidden'}}>
                        <video src={s.zzDocumentaryURL} style={{width:'100%',aspectRatio:'9/16',objectFit:'cover',display:'block'}} preload="none" playsInline controls />
                        <div style={{padding:'0.55rem 0.65rem'}}>
                          <p style={{fontSize:'0.78rem',fontWeight:700,color:'#D4EDE0',margin:'0 0 0.15rem'}}>{s.name}</p>
                          <p style={{fontSize:'0.68rem',color:'rgba(184,212,192,0.55)',margin:0}}>{Object.keys(resolveZzData(s)).length} animals</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── MCQ Question Analysis (day mode) ── */}
              {!isZZ && (() => {
                const mcqByAnimal = {};
                students.forEach(student => {
                  const seenAnimals = new Set();
                  (student.badges || []).forEach(badge => {
                    const aid = badge.animalId;
                    if (!aid || seenAnimals.has(aid)) return;
                    seenAnimals.add(aid);
                    const qrs = (badge.quizResults || []).filter(qr => !qr.missionType || qr.missionType === 'knowledge');
                    if (!qrs.length) return;
                    if (!mcqByAnimal[aid]) mcqByAnimal[aid] = { questions: [], studentCount: 0 };
                    mcqByAnimal[aid].studentCount++;
                    qrs.forEach((qr, qi) => {
                      if (!mcqByAnimal[aid].questions[qi]) {
                        mcqByAnimal[aid].questions[qi] = { text: qr.question || `Question ${qi + 1}`, correct: 0, incorrect: 0 };
                      }
                      if (qr.question) mcqByAnimal[aid].questions[qi].text = qr.question;
                      if (qr.correctOnFirstAttempt) mcqByAnimal[aid].questions[qi].correct++;
                      else mcqByAnimal[aid].questions[qi].incorrect++;
                    });
                  });
                });
                const totalStu = students.length;
                const entries = Object.entries(mcqByAnimal).sort(([a],[b]) => a.localeCompare(b));
                if (!entries.length || !totalStu) return null;
                const fmtAnimal = id => id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                return (
                  <div style={{ marginBottom:'1rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem', paddingTop:'0.25rem' }}>
                      <div style={{ flex:1, height:'2px', background:'linear-gradient(90deg,var(--t-eucalyptus),transparent)', borderRadius:'2px' }} />
                      <p style={{ fontSize:'0.65rem', fontWeight:800, color:'var(--t-mid)', textTransform:'uppercase', letterSpacing:'0.1em', margin:0, whiteSpace:'nowrap' }}>MCQ Question Analysis</p>
                      <div style={{ flex:1, height:'2px', background:'linear-gradient(270deg,var(--t-eucalyptus),transparent)', borderRadius:'2px' }} />
                    </div>
                    <div style={{ display:'flex', gap:'1rem', marginBottom:'0.75rem', justifyContent:'flex-end' }}>
                      {[['#34A85A','Correct'],['#E8454A','Incorrect'],['#CCC','Not attempted']].map(([col,label]) => (
                        <div key={label} style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}>
                          <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:col }} />
                          <span style={{ fontSize:'0.72rem', color:'#666' }}>{label}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', padding:'0.4rem 1rem', marginBottom:'0.25rem' }}>
                      <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'0.06em' }}>Question</span>
                      <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'0.06em' }}>Results</span>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                      {entries.map(([animalId, data]) => {
                        const notAttempted = totalStu - data.studentCount;
                        return (
                          <div key={animalId} style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-stone)', overflow:'hidden' }}>
                            <div style={{ padding:'0.55rem 1rem', background:'linear-gradient(135deg,var(--t-foam) 0%,#E4EFE8 100%)', borderBottom:'1px solid var(--t-stone)', display:'flex', alignItems:'baseline', gap:'0.5rem' }}>
                              <span style={{ fontSize:'0.85rem', fontWeight:700, color:'var(--t-deep)' }}>{fmtAnimal(animalId)}</span>
                              <span style={{ fontSize:'0.72rem', color:'var(--t-slate)' }}>{data.studentCount} of {totalStu} students attempted</span>
                            </div>
                            <div style={{ padding:'0.5rem 0' }}>
                              {data.questions.map((q, qi) => {
                                const correctPct   = totalStu > 0 ? Math.round(q.correct / totalStu * 100) : 0;
                                const incorrectPct = totalStu > 0 ? Math.round(q.incorrect / totalStu * 100) : 0;
                                const notPct       = totalStu > 0 ? Math.round(notAttempted / totalStu * 100) : 0;
                                return (
                                  <div key={qi} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', padding:'0.55rem 1rem', borderTop: qi > 0 ? '1px solid var(--t-stone)' : 'none', alignItems:'center', gap:'0.75rem' }}>
                                    <p style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--t-deep)', margin:0, lineHeight:1.4 }}>{q.text}</p>
                                    <div>
                                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.3rem' }}>
                                        <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#34A85A', minWidth:'2.2rem' }}>{correctPct}%</span>
                                        <div style={{ flex:1, height:'8px', borderRadius:'4px', overflow:'hidden', background:'#EEE', display:'flex' }}>
                                          <div style={{ width:`${correctPct}%`, background:'#34A85A', transition:'width 0.4s' }} />
                                          <div style={{ width:`${incorrectPct}%`, background:'#E8454A', transition:'width 0.4s' }} />
                                          <div style={{ width:`${notPct}%`, background:'#D0D0D0', transition:'width 0.4s' }} />
                                        </div>
                                      </div>
                                      <div style={{ display:'flex', gap:'0.65rem', fontSize:'0.68rem' }}>
                                        <span style={{ color:'#34A85A', fontWeight:600 }}>{q.correct} correct</span>
                                        <span style={{ color:'#E8454A', fontWeight:600 }}>{q.incorrect} incorrect</span>
                                        <span style={{ color:'#999', fontWeight:600 }}>{notAttempted} not attempted</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

            </div>
          )}
        </div>
      </div>

      {/* ── Class code modal ── */}
      {classCodeModal && !classCodeFS && (
        <div onClick={()=>setClassCodeModal(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'white', borderRadius:'24px', padding:'2.5rem', textAlign:'center', boxShadow:'0 24px 60px rgba(0,0,0,0.3)', minWidth:'320px' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:600, color:'#888', marginBottom:'1rem', textTransform:'uppercase', letterSpacing:'0.1em' }}>Class Code</h3>
            <div style={{ fontFamily:'monospace', fontSize:'4rem', fontWeight:700, color:'var(--t-deep)', letterSpacing:'0.3em', marginBottom:'1.5rem', lineHeight:1.2 }}>{classCodeModal}</div>
            <button onClick={()=>setClassCodeFS(true)} style={{ width:'100%', background:'linear-gradient(135deg,var(--t-mid),var(--t-eucalyptus))', color:'white', border:'none', padding:'0.85rem', borderRadius:'var(--t-r-md)', fontSize:'0.95rem', fontWeight:700, cursor:'pointer', marginBottom:'0.7rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Full Screen Mode</button>
            <button onClick={()=>setClassCodeModal(null)} style={{ width:'100%', background:'#F5F3EE', color:'#666', border:'none', padding:'0.75rem', borderRadius:'var(--t-r-md)', fontSize:'0.85rem', fontWeight:600, cursor:'pointer' }}>Close</button>
          </div>
        </div>
      )}
      {classCodeFS && (
        <div style={{ position:'fixed', inset:0, background:'#0A2F1F', zIndex:300, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontFamily:'monospace', fontSize:'clamp(5rem,20vw,12rem)', fontWeight:700, color:'white', letterSpacing:'0.3em', textAlign:'center' }}>{classCodeModal}</div>
          <button onClick={()=>{setClassCodeFS(false);setClassCodeModal(null);}} style={{ position:'absolute', top:'2rem', right:'2rem', background:'rgba(255,255,255,0.15)', color:'white', border:'2px solid rgba(255,255,255,0.3)', padding:'0.75rem 1.5rem', borderRadius:'var(--t-r-md)', fontSize:'0.9rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>Exit</button>
        </div>
      )}

      {/* ── Observations modal ── */}
      {obsModal && (
        <div onClick={()=>{setObsModal(null);setExpandedBreakdown(null);}} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
          <div onClick={e=>e.stopPropagation()} style={{ background: obsModal.isZZ ? '#071E14' : 'white', borderRadius:'18px', width:'100%', maxWidth:'480px', maxHeight:'80vh', overflowY:'auto', boxShadow:'0 24px 60px rgba(0,0,0,0.25)' }}>
            {obsModal.isZZ ? (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.2rem 1.4rem 0.9rem', borderBottom:'1px solid rgba(168,196,178,0.25)', position:'sticky', top:0, background:'#071E14', zIndex:1 }}>
                  <div>
                    <h3 style={{ fontSize:'1.05rem', fontWeight:700, color:'#D4EDE0', margin:0 }}>🌙 ZooSnooz Detail</h3>
                    <p style={{ fontSize:'0.78rem', color:'rgba(184,212,192,0.75)', margin:'0.15rem 0 0' }}>{obsModal.name}</p>
                  </div>
                  <button onClick={()=>setObsModal(null)} style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'#A8C4B2', width:'30px', height:'30px', borderRadius:'50%', cursor:'pointer', fontSize:'1rem', fontWeight:700 }}>×</button>
                </div>
                <div style={{ padding:'1rem 1.4rem 1.4rem', display:'flex', flexDirection:'column', gap:'0.85rem' }}>
                  {ZOOSNOOZ_ANIMALS.map(animal => {
                    const ad = resolveZzData(obsModal)[animal.id];
                    const done = !!ad;
                    return (
                      <div key={animal.id} style={{ background: done?'rgba(46,125,85,0.18)':'rgba(255,255,255,0.05)', border:`1px solid ${done?'rgba(168,196,178,0.45)':'rgba(255,255,255,0.1)'}`, borderRadius:'12px', padding:'0.85rem 1rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom: done?'0.6rem':0 }}>
                          {done ? <span style={{ width:'20px', height:'20px', borderRadius:'50%', background:'#2E7D55', color:'white', fontSize:'0.7rem', fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>✓</span> : <span style={{ width:'20px', height:'20px', borderRadius:'50%', background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.35)', fontSize:'0.7rem', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>–</span>}
                          <span style={{ fontSize:'0.88rem', fontWeight:700, color: done?'#D4EDE0':'rgba(255,255,255,0.4)' }}>{animal.name}</span>
                        </div>
                        {done && ad?.observationScore && (
                          <div style={{ paddingLeft:'1.6rem', display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.5rem' }}>
                            {[['B','behaviour','#4A9E6B'],['D','detail','#60A5FA'],['W','writing','#34D399']].map(([lbl,key,col]) => (
                              <span key={key} style={{ fontSize:'0.7rem', background:'rgba(255,255,255,0.08)', borderRadius:'6px', padding:'0.2rem 0.55rem', color:col, fontWeight:700 }}>{lbl}: {ad.observationScore[key]??0}/5</span>
                            ))}
                          </div>
                        )}
                        {done && (ad?.observationNotes||ad?.observationText) && (
                          <div style={{ paddingLeft:'1.6rem', marginTop:'0.25rem', marginBottom:'0.5rem' }}>
                            <div style={{ fontSize:'0.6rem', fontWeight:700, color:'rgba(184,212,192,0.65)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.2rem' }}>Observations</div>
                            <p style={{ fontSize:'0.82rem', color:'#C0DCC8', lineHeight:1.5, margin:0, fontStyle:'italic' }}>"{ad.observationNotes||ad.observationText}"</p>
                          </div>
                        )}
                        {done && (() => {
                          const quizOk = ad.quizCorrect === true || ad.quizResults?.[0]?.correctOnFirstAttempt === true;
                          const quizAnswered = ad.quizCorrect !== undefined || ad.quizResults?.length > 0;
                          if (!quizAnswered) return null;
                          const stageData = animal.byStage?.[cls.stage] || {};
                          const opts = stageData.options || animal.options || [];
                          const correctIdx = stageData.correct ?? animal.correct ?? -1;
                          const correctText = opts[correctIdx] || '';
                          return (
                            <div style={{ paddingLeft:'1.6rem', marginBottom:'0.5rem' }}>
                              <div style={{ fontSize:'0.6rem', fontWeight:700, color:'rgba(184,212,192,0.65)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.3rem' }}>MCQ Answer</div>
                              <p style={{ fontSize:'0.82rem', fontWeight:600, color: quizOk ? '#34D399' : '#FCA5A5', margin:0, lineHeight:1.5 }}>
                                {correctText} {quizOk ? '✓' : '✗'}
                              </p>
                            </div>
                          );
                        })()}
                        {done && zzModalClipUrls[animal.id] && (
                          <div style={{ paddingLeft:'1.6rem', marginTop:'0.25rem' }}>
                            <div style={{ fontSize:'0.6rem', fontWeight:700, color:'rgba(184,212,192,0.65)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.35rem' }}>Video</div>
                            <video src={zzModalClipUrls[animal.id]} controls playsInline preload="none"
                              style={{ width:'100%', borderRadius:'8px', background:'#000', display:'block', aspectRatio:'16/9', objectFit:'contain' }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.2rem 1.4rem 0.8rem', borderBottom:'1px solid #F0EDE8', position:'sticky', top:0, background:'white', zIndex:1 }}>
                  <div>
                    <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:'var(--t-deep)', margin:0 }}>Observations</h3>
                    <p style={{ fontSize:'0.78rem', color:'#888', margin:'0.15rem 0 0' }}>{obsModal.name}</p>
                  </div>
                  <button onClick={()=>{setObsModal(null);setExpandedBreakdown(null);}} style={{ background:'none', border:'none', fontSize:'1.4rem', color:'#aaa', cursor:'pointer', lineHeight:1, padding:'0.2rem 0.4rem' }}>×</button>
                </div>
                <div style={{ padding:'1rem 1.4rem 1.4rem' }}>
                  {(obsModal.badges||[]).filter(b=>b.observationScore||(b.observation&&b.observation.trim())).map((b,idx,arr) => {
                    const obs = b.observationScore;
                    const bKey = `${b.animalId||idx}-${idx}`;
                    const isExpanded = expandedBreakdown === bKey;
                    const override = obs?.teacherOverride || {};
                    const activeScores = override.applied
                      ? { bv: override.behaviourScore??obs?.behaviour??0, dv: override.detailScore??obs?.detail??0, wv: override.writingScore??obs?.writing??0 }
                      : { bv: obs?.behaviour??0, dv: obs?.detail??0, wv: obs?.writing??0 };
                    const form = overrideForms[bKey] || {};
                    return (
                      <div key={idx} style={{ borderLeft:'3px solid var(--t-mid)', background:'#F7FAF8', borderRadius:'0 10px 10px 0', padding:'0.75rem 1rem', marginBottom: idx<arr.length-1 ? '0.75rem' : 0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.35rem' }}>
                          <span style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--t-mid)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{b.animal} – Observation</span>
                          {b.timestamp && <span style={{ fontSize:'0.65rem', color:'#aaa' }}>· {new Date(b.timestamp).toLocaleDateString('en-AU',{day:'numeric',month:'short'})}</span>}
                        </div>
                        {b.observation?.trim() && <p style={{ fontSize:'0.85rem', color:'#444', lineHeight:1.55, margin:'0 0 0.4rem' }}>{b.observation}</p>}
                        {(b.quizResults||[]).length > 0 && (
                          <div style={{ marginBottom:'0.6rem', background:'white', borderRadius:'8px', padding:'0.6rem 0.75rem', border:'1px solid #E8EDF0' }}>
                            <div style={{ fontSize:'0.62rem', fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.4rem' }}>MCQ Results</div>
                            {(b.quizResults||[]).map((qr, qi) => (
                              <div key={qi} style={{ marginBottom: qi < b.quizResults.length-1 ? '0.5rem' : 0, paddingBottom: qi < b.quizResults.length-1 ? '0.5rem' : 0, borderBottom: qi < b.quizResults.length-1 ? '1px solid #F0F0F0' : 'none' }}>
                                <p style={{ fontSize:'0.75rem', color:'#555', margin:'0 0 0.2rem', fontWeight:600 }}>{qr.question}</p>
                                <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                                  <span style={{ fontSize:'0.65rem', fontWeight:800, color: qr.correctOnFirstAttempt ? '#059669' : '#DC2626' }}>{qr.correctOnFirstAttempt ? '✓ Correct' : '✗ Incorrect'}</span>
                                  {qr.selectedAnswer && <span style={{ fontSize:'0.72rem', color:'#666', fontStyle:'italic' }}>— "{qr.selectedAnswer}"</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {obs && (
                          <div>
                            <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', alignItems:'center', marginBottom:'0.3rem' }}>
                              {(isMaths
                                ? [{l:'Method',v:activeScores.bv,c:'#059669'},{l:'Accuracy',v:activeScores.dv,c:'#0284C7'},{l:'Comms',v:activeScores.wv,c:'#2E7D55'}]
                                : isPdhpe
                                ? [{l:'Comparison',v:activeScores.bv,c:'#DC2626'},{l:'Understanding',v:activeScores.dv,c:'#7C3AED'},{l:'Comms',v:activeScores.wv,c:'#059669'}]
                                : [{l:'Behaviour',v:activeScores.bv,c:'#059669'},{l:'Detail',v:activeScores.dv,c:'#0284C7'},{l:'Writing',v:activeScores.wv,c:'#2E7D55'}]
                              ).map(d => (
                                <span key={d.l} style={{ fontSize:'0.7rem', color:'#666' }}>{d.l}: <strong style={{ color:d.c }}>{d.v}/5</strong></span>
                              ))}
                              {obs.reviewRecommended && <span style={{ fontSize:'0.65rem', background:'#FEF3C7', color:'#92400E', padding:'0.1rem 0.4rem', borderRadius:'4px', fontWeight:700 }}>⚠ Review</span>}
                              <button onClick={()=>setExpandedBreakdown(isExpanded?null:bKey)} style={{ fontSize:'0.65rem', color:'var(--t-mid)', background:'none', border:'1px solid var(--t-mid)', borderRadius:'4px', padding:'0.1rem 0.4rem', cursor:'pointer', fontWeight:600, marginLeft:'auto' }}>{isExpanded?'Hide ▴':'Marking ▾'}</button>
                            </div>
                            {isExpanded && (
                              <div style={{ marginTop:'0.5rem', background:'white', borderRadius:'var(--t-r-xs)', padding:'0.7rem 0.85rem', border:'1px solid #E8EDF0' }}>
                                {(isMaths
                                  ? [{l:'Method',v:activeScores.bv,c:'#059669',rat:obs.rationale?.behaviour,tip:obs.improvementTips?.behaviour},{l:'Accuracy',v:activeScores.dv,c:'#0284C7',rat:obs.rationale?.detail,tip:obs.improvementTips?.detail},{l:'Communication',v:activeScores.wv,c:'#2E7D55',rat:obs.rationale?.writing,tip:obs.improvementTips?.writing}]
                                  : isPdhpe
                                  ? [{l:'Comparison',v:activeScores.bv,c:'#DC2626',rat:obs.rationale?.behaviour,tip:obs.improvementTips?.behaviour},{l:'Understanding',v:activeScores.dv,c:'#7C3AED',rat:obs.rationale?.detail,tip:obs.improvementTips?.detail},{l:'Communication',v:activeScores.wv,c:'#059669',rat:obs.rationale?.writing,tip:obs.improvementTips?.writing}]
                                  : [{l:'Behaviour',v:activeScores.bv,c:'#059669',rat:obs.rationale?.behaviour,tip:obs.improvementTips?.behaviour},{l:'Detail',v:activeScores.dv,c:'#0284C7',rat:obs.rationale?.detail,tip:obs.improvementTips?.detail},{l:'Writing',v:activeScores.wv,c:'#2E7D55',rat:obs.rationale?.writing,tip:obs.improvementTips?.writing}]
                                ).map(d => (
                                  <div key={d.l} style={{ marginBottom:'0.5rem', paddingBottom:'0.5rem', borderBottom:'1px solid #F0F0F0' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.15rem' }}>
                                      <span style={{ fontSize:'0.72rem', fontWeight:700, color:d.c }}>{d.l}: {d.v}/5</span>
                                      <div style={{ flex:1, height:'4px', background:'#F0F0F0', borderRadius:'2px', overflow:'hidden' }}><div style={{ width:`${(d.v/5)*100}%`, height:'100%', background:d.c, borderRadius:'2px' }}/></div>
                                    </div>
                                    {d.rat && <p style={{ fontSize:'0.72rem', color:'#555', margin:'0 0 0.15rem', lineHeight:1.4 }}>{d.rat}</p>}
                                    {d.tip && <p style={{ fontSize:'0.7rem', color:'#888', margin:0, fontStyle:'italic', lineHeight:1.4 }}>Next step: {d.tip}</p>}
                                  </div>
                                ))}
                                {/* Override form */}
                                <div style={{ borderTop:'1px solid #EEF0F2', paddingTop:'0.5rem' }}>
                                  {!form.open ? (
                                    <button onClick={()=>setOverrideForms(p=>({...p,[bKey]:{open:true,b:override.behaviourScore??obs.behaviour??'',d:override.detailScore??obs.detail??'',w:override.writingScore??obs.writing??'',note:override.note||'',reason:override.reasonType||''}}))} style={{ fontSize:'0.65rem', padding:'0.2rem 0.55rem', borderRadius:'4px', border:'1px solid #D1D5DB', background:'#F9FAFB', cursor:'pointer', fontWeight:600, color:'#374151' }}>
                                      {override.applied ? 'Edit Override' : 'Override Scores'}
                                    </button>
                                  ) : (
                                    <div style={{ background:'#F9FAFB', borderRadius:'var(--t-r-xs)', padding:'0.65rem 0.75rem', border:'1px solid #E5E7EB' }}>
                                      <p style={{ fontSize:'0.7rem', fontWeight:700, color:'#374151', margin:'0 0 0.4rem' }}>Override Scores</p>
                                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.4rem', marginBottom:'0.4rem' }}>
                                        {(isMaths ? [['b','Met'],['d','Acc'],['w','Com']] : isPdhpe ? [['b','Cmp'],['d','Und'],['w','Com']] : [['b','Beh'],['d','Det'],['w','Wri']]).map(([key,lbl]) => (
                                          <div key={key}>
                                            <label style={{ fontSize:'0.62rem', color:'#6B7280', display:'block', marginBottom:'0.1rem' }}>{lbl}</label>
                                            <select value={form[key]??''} onChange={e=>setOverrideForms(p=>({...p,[bKey]:{...p[bKey],[key]:e.target.value}}))} style={{ width:'100%', padding:'0.22rem 0.3rem', borderRadius:'4px', border:'1px solid #D1D5DB', fontSize:'0.75rem', background:'white' }}>
                                              <option value="">–</option>
                                              {[1,2,3,4,5].map(n=><option key={n} value={n}>{n}/5</option>)}
                                            </select>
                                          </div>
                                        ))}
                                      </div>
                                      <select value={form.reason||''} onChange={e=>setOverrideForms(p=>({...p,[bKey]:{...p[bKey],reason:e.target.value}}))} style={{ width:'100%', marginBottom:'0.35rem', padding:'0.22rem 0.3rem', borderRadius:'4px', border:'1px solid #D1D5DB', fontSize:'0.73rem', background:'white' }}>
                                        <option value="">Select reason…</option>
                                        <option value="adjusted for fairness">Adjusted for fairness</option>
                                        <option value="misinterpreted response">Misinterpreted response</option>
                                        <option value="other">Other</option>
                                      </select>
                                      <input type="text" value={form.note||''} onChange={e=>setOverrideForms(p=>({...p,[bKey]:{...p[bKey],note:e.target.value}}))} placeholder="Feedback for Taronga Staff" style={{ width:'100%', marginBottom:'0.35rem', padding:'0.25rem 0.35rem', borderRadius:'4px', border:'1px solid #D1D5DB', fontSize:'0.73rem', boxSizing:'border-box' }}/>
                                      <div style={{ display:'flex', gap:'0.35rem' }}>
                                        <button onClick={async()=>{
                                          setOverrideSaving(bKey);
                                          const result = await saveOverride(obsModal.name, b.animalId, form);
                                          setOverrideSaving(null);
                                          if(result.ok) setOverrideForms(p=>({...p,[bKey]:{...p[bKey],open:false}}));
                                        }} disabled={overrideSaving===bKey} style={{ flex:1, padding:'0.28rem', borderRadius:'4px', border:'none', background:'var(--t-mid)', color:'white', fontSize:'0.72rem', fontWeight:700, cursor:'pointer' }}>
                                          {overrideSaving===bKey?'Saving…':'Submit to Review'}
                                        </button>
                                        <button onClick={()=>setOverrideForms(p=>({...p,[bKey]:{...p[bKey],open:false}}))} style={{ padding:'0.28rem 0.5rem', borderRadius:'4px', border:'1px solid #D1D5DB', background:'white', fontSize:'0.72rem', color:'#6B7280', cursor:'pointer' }}>Cancel</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {(obsModal.badges||[]).filter(b=>b.observationScore||(b.observation?.trim())).length===0 && (
                    <p style={{ fontSize:'0.85rem', color:'#aaa', textAlign:'center', padding:'1rem 0' }}>No observations recorded yet.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Conservation modal ── */}
      {conservationModal && (
        <div onClick={()=>setConservationModal(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'white', borderRadius:'18px', width:'100%', maxWidth:'480px', boxShadow:'0 24px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.2rem 1.4rem 0.8rem', borderBottom:'1px solid #F0EDE8' }}>
              <div>
                <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:'var(--t-deep)', margin:0 }}>Conservation Statement</h3>
                <p style={{ fontSize:'0.78rem', color:'#888', margin:'0.15rem 0 0' }}>{conservationModal.name}</p>
              </div>
              <button onClick={()=>setConservationModal(null)} style={{ background:'none', border:'none', fontSize:'1.4rem', color:'#aaa', cursor:'pointer', lineHeight:1, padding:'0.2rem 0.4rem' }}>×</button>
            </div>
            <div style={{ padding:'1.25rem 1.4rem 1.5rem' }}>
              <p style={{ fontSize:'0.92rem', color:'#333', lineHeight:1.65, margin:0 }}>{conservationModal.text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
