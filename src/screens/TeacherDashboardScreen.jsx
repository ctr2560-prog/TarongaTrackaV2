import { useState, useEffect, useRef } from 'react';
import { collection, doc, onSnapshot, getDocs, getDoc, query, orderBy, limit, where, setDoc, addDoc, serverTimestamp, increment, arrayUnion } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useApp } from '../context/AppContext';
import LegalModal from '../components/LegalModal';
import TeacherHelpBot from '../components/TeacherHelpBot';
import TeacherTutorial from '../components/TeacherTutorial';

const WILDLY_PHRASES = ['Wildly by Taronga', 'Continue the learning', 'Resources', 'Programs', 'Assessments'];

function WildlyLabel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIdx(i => (i + 1) % WILDLY_PHRASES.length), 2200);
    return () => clearInterval(interval);
  }, []);
  return <span style={{ transition:'opacity 0.3s' }}>{WILDLY_PHRASES[idx]}</span>;
}

const MILESTONES = [
  { points: 300,  label: 'Free class zoo visit', reward: true },
  { points: 600,  label: 'Sponsor a habitat' },
  { points: 1000, label: 'Conservation Partner' },
];

const SvgPlus    = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const SvgLayers  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
const SvgHelpCircle = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5"/></svg>;
const SvgGlobe   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
const SvgZap    = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const SvgImage  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const SvgFeather = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>;
const SvgBridge  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18h20"/><path d="M5 18V12"/><path d="M19 18V12"/><path d="M5 12Q5 6 12 6Q19 6 19 12"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>;
const SvgNotebook = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 2v20"/><line x1="13" y1="7" x2="17" y2="7"/><line x1="13" y1="11" x2="17" y2="11"/><line x1="13" y1="15" x2="17" y2="15"/></svg>;
const SvgCheck  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const SvgTrash = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const SvgTree  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-6"/><path d="M8 16l4-4 4 4"/><path d="M6 12l6-6 6 6"/><path d="M4 8l8-6 8 6"/></svg>;
const SvgSearch = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>;
const SvgMoon   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
const SvgSchool = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const SvgStar  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const SvgBook  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const SvgCompass = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>;
const SvgPencil = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const SvgList  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="0.5" fill="currentColor"/><circle cx="3" cy="12" r="0.5" fill="currentColor"/><circle cx="3" cy="18" r="0.5" fill="currentColor"/></svg>;
const SvgChart = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
const SvgMail  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;

const CHALLENGES = [
  { id:'expedition-sydney',   name:'Taronga Sydney',       desc:'Run a Tracka session at Taronga Zoo Sydney.',                                                     points:25, icon:<SvgZap/>,      type:'auto', location:'taronga-sydney'  },
  { id:'expedition-zoosnooz', name:'ZooSnooz Night',       desc:'Lead your class through an after-dark ZooSnooz experience at Taronga Sydney.',                    points:40, icon:<SvgMoon/>,     type:'auto', location:'zoosnooz-sydney' },
  { id:'expedition-dubbo',    name:'Taronga Dubbo',        desc:'Run a Tracka session at Taronga Western Plains Zoo in Dubbo.',                                    points:35, icon:<SvgZap/>,      type:'auto', location:'dubbo'           },
  { id:'expedition-school',   name:'Your School',          desc:'Run a Tracka session on your school grounds.',                                                    points:20, icon:<SvgSchool/>,   type:'auto', location:'school'          },
  { id:'nature-journal',     name:'Nature Journal',            desc:'Students document local wildlife observations in illustrated journals over a week.',                                    points:35, icon:<SvgNotebook/>, type:'submit' },
  { id:'wildlife-poem',      name:'Wildlife Poem',             desc:'Write and illustrate a class poem about a local or endangered species.',                                               points:30, icon:<SvgFeather/>,  type:'submit' },
  { id:'wildlife-posters',   name:'Wildlife Posters',          desc:'Create wildlife awareness posters with your class and display them at school.',                                        points:40, icon:<SvgImage/>,    type:'submit' },
  { id:'clean-up-school',    name:'Clean Up School',           desc:'Organise a litter clean-up around your school grounds.',                                                              points:50, icon:<SvgTrash/>,    type:'submit' },
  { id:'biodiversity-audit', name:'Biodiversity Audit',        desc:'Count and photograph species found near your school and submit your findings.',                                       points:60, icon:<SvgSearch/>,   type:'submit' },
  { id:'plant-a-tree',       name:'Plant a Tree',              desc:'Plant a native tree or shrub in your school grounds.',                                                                points:75, icon:<SvgTree/>,     type:'submit' },
  { id:'wildlife-crossing',  name:'Wildlife Crossing Design',  desc:'Design and model a wildlife corridor or road crossing for a local species, then present it to the class.',           points:80, icon:<SvgBridge/>,   type:'submit' },
];

const MONTHLY_CHALLENGE = { id:'monthly-june-2026', name:'June Challenge — Habitat Heroes', desc:'Document three different animal habitats near your school with photos and a short description.', points:100, icon:<SvgStar/> };

const RESOURCE_CARDS = [
  { title:'Teacher Guide', desc:'How to run a Taronga Tracka session', icon:<SvgBook/>, tag:'Guide' },
  { title:'Pre-Visit Activities', desc:'Prepare your class before the zoo', icon:<SvgCompass/>, tag:'Lesson' },
  { title:'Post-Visit Activities', desc:'Extend learning back in the classroom', icon:<SvgPencil/>, tag:'Lesson' },
  { title:'Curriculum Alignment', desc:'NSW syllabus outcome mapping', icon:<SvgList/>, tag:'Document' },
  { title:'Assessment Ideas', desc:'Ideas to assess student learning', icon:<SvgChart/>, tag:'Assessment' },
  { title:'Parent Communication', desc:'Templates to inform families', icon:<SvgMail/>, tag:'Template' },
];

function normalizeSchoolId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export default function TeacherDashboardScreen() {
  const { setCurrentScreen, teacherEmail, setSelectedClass, teacher, authLoading, signOutTeacher, demoMode, teacherProfile } = useApp();

  useEffect(() => {
    if (!authLoading && !teacher && !demoMode) setCurrentScreen('teacherLogin');
  }, [teacher, authLoading, demoMode, setCurrentScreen]);

  const [teacherClasses,  setTeacherClasses]  = useState([]);
  const [studentCounts,   setStudentCounts]   = useState({});
  const [classesLoading,  setClassesLoading]  = useState(true);

  // Class code modal
  const [classCodeModal,      setClassCodeModal]      = useState(null);
  const [classCodeFullscreen, setClassCodeFullscreen] = useState(false);

  // Feedback
  const [showFeedback,       setShowFeedback]       = useState(false);
  const [feedbackRating,     setFeedbackRating]     = useState(0);
  const [feedbackComment,    setFeedbackComment]    = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [legalDoc,           setLegalDoc]           = useState(null);

  // School points + leaderboard
  const [schoolPoints,    setSchoolPoints]    = useState(null);
  const [schoolDocExists, setSchoolDocExists] = useState(null);
  const [leaderboard,     setLeaderboard]     = useState([]);

  // My challenge submissions (keyed by challengeId → latest submission)
  const [mySubmissions, setMySubmissions] = useState({});

  // Challenge scroll
  const challengeScrollRef = useRef(null);
  const [canScrollRight,   setCanScrollRight]   = useState(true);

  // Challenge upload modal
  const [uploadChallenge,   setUploadChallenge]   = useState(null);
  const [uploadFile,        setUploadFile]        = useState(null);
  const [uploadNote,        setUploadNote]        = useState('');
  const [uploadSubmitting,  setUploadSubmitting]  = useState(false);
  const [uploadSuccess,     setUploadSuccess]     = useState(false);
  const fileInputRef = useRef(null);

  // Set school nudge
  const [setSchoolInput,    setSetSchoolInput]    = useState('');
  const [setSchoolSugs,     setSetSchoolSugs]     = useState([]);
  const [showSetSchoolSugs, setShowSetSchoolSugs] = useState(false);
  const [allSchools,        setAllSchools]        = useState([]);
  const [savingSchool,      setSavingSchool]      = useState(false);

  // Classes listener
  useEffect(() => {
    if (!teacherEmail.trim()) return;
    const unsub = onSnapshot(collection(db, 'teachers', teacherEmail, 'classes'), snap => {
      setTeacherClasses(snap.docs.map(d => ({
        classCode:   d.data().classCode || d.id,
        className:   d.data().className || '',
        schoolName:  d.data().schoolName || '',
        stage:       d.data().stage || 4,
        teacherEmail:d.data().teacherEmail || teacherEmail,
        archived:    d.data().archived || false,
        sessionType: d.data().sessionType || 'standard',
        location:    d.data().location || null,
        subject:     d.data().subject || null,
      })));
      setClassesLoading(false);
    }, () => { setTeacherClasses([]); setClassesLoading(false); });
    return () => unsub();
  }, [teacherEmail]);

  // Student counts
  useEffect(() => {
    if (!teacherClasses.length) { setStudentCounts({}); return; }
    let cancelled = false;
    (async () => {
      const counts = {};
      for (const cls of teacherClasses) {
        try {
          const snap = await getDocs(collection(db, 'classes', cls.classCode, 'students'));
          counts[cls.classCode] = { total: snap.size, completed: snap.docs.filter(d => d.data().completed === true).length };
        } catch { counts[cls.classCode] = { total:0, completed:0 }; }
      }
      if (!cancelled) setStudentCounts(counts);
    })();
    return () => { cancelled = true; };
  }, [teacherClasses]);

  // School points
  const primarySchool = teacherProfile?.schoolName || teacherClasses.find(c => !c.archived)?.schoolName || '';
  useEffect(() => {
    if (!primarySchool) return;
    const sid = normalizeSchoolId(primarySchool);
    const unsub = onSnapshot(doc(db, 'schools', sid), snap => {
      setSchoolDocExists(snap.exists());
      setSchoolPoints(snap.exists() ? (snap.data().totalPoints || 0) : 0);
    });
    return () => unsub();
  }, [primarySchool]);

  // Seed/correct school doc for pre-existing schools (once, on mount)
  useEffect(() => {
    if (!primarySchool || classesLoading) return;
    const activeCount = teacherClasses.filter(c => !c.archived).length;
    if (activeCount === 0) return;
    let cancelled = false;
    const sid = normalizeSchoolId(primarySchool);
    getDoc(doc(db, 'schools', sid)).then(snap => {
      if (cancelled) return;
      // Doc missing → create fresh
      // Doc exists but no awardedChallenges → wrong old seed, correct it to 25
      if (!snap.exists() || !snap.data().awardedChallenges) {
        return setDoc(doc(db, 'schools', sid), {
          name: primarySchool,
          totalPoints: 25,
          awardedChallenges: ['expedition'],
          lastUpdated: serverTimestamp(),
        }, { merge: true });
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [primarySchool, classesLoading]);

  // Leaderboard
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'schools'), orderBy('totalPoints', 'desc'), limit(10)),
      snap => setLeaderboard(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  // My challenge submissions — keep latest per challengeId
  useEffect(() => {
    if (!teacherEmail) return;
    const q = query(collection(db, 'challengeSubmissions'), where('teacherEmail', '==', teacherEmail), orderBy('submittedAt', 'desc'));
    return onSnapshot(q, snap => {
      const map = {};
      snap.docs.forEach(d => {
        const data = d.data();
        if (!map[data.challengeId]) map[data.challengeId] = { id: d.id, ...data };
      });
      setMySubmissions(map);
    });
  }, [teacherEmail]);

  // Load schools for set-school nudge autocomplete
  useEffect(() => {
    if (teacherProfile?.schoolName) return;
    getDocs(collection(db, 'schools'))
      .then(snap => setAllSchools(snap.docs.map(d => (d.data().name || '').trim()).filter(Boolean)))
      .catch(() => {});
  }, [teacherProfile]);

  const activeClasses    = teacherClasses.filter(c => !c.archived);
  const totalStudentsAll = activeClasses.reduce((s, c) => s + (studentCounts[c.classCode]?.total || 0), 0);

  const nextMilestone = MILESTONES.find(m => m.points > (schoolPoints || 0)) || MILESTONES[MILESTONES.length - 1];
  const prevMilestone = MILESTONES[MILESTONES.indexOf(nextMilestone) - 1];
  const milestoneProgress = nextMilestone && prevMilestone
    ? Math.min(100, ((schoolPoints || 0) - prevMilestone.points) / (nextMilestone.points - prevMilestone.points) * 100)
    : Math.min(100, ((schoolPoints || 0) / MILESTONES[0].points) * 100);

  const submitFeedback = async () => {
    if (!feedbackRating) { alert('Please select a rating.'); return; }
    setFeedbackSubmitting(true);
    try {
      const { addDoc: ad, collection: col } = await import('firebase/firestore');
      await ad(col(db, 'teacherFeedback'), { type:'teacherFeedback', teacherName:teacherEmail, rating:feedbackRating, comment:feedbackComment.trim(), timestamp:new Date().toISOString() });
      setShowFeedback(false); setFeedbackRating(0); setFeedbackComment('');
    } catch {}
    setFeedbackSubmitting(false);
  };

  const saveSchoolToProfile = async () => {
    const name = setSchoolInput.trim();
    if (!name || !teacherEmail) return;
    setSavingSchool(true);
    try {
      await setDoc(doc(db, 'teachers', teacherEmail), { schoolName: name }, { merge: true });
      setSetSchoolInput('');
    } catch {}
    setSavingSchool(false);
  };

  const submitChallengeEvidence = async () => {
    if (!uploadFile || !uploadChallenge) return;
    setUploadSubmitting(true);
    try {
      const ext  = uploadFile.name.split('.').pop();
      const path = `challengeEvidence/${normalizeSchoolId(primarySchool)}/${uploadChallenge.id}-${Date.now()}.${ext}`;
      const snap = await uploadBytes(storageRef(storage, path), uploadFile);
      const url  = await getDownloadURL(snap.ref);
      await addDoc(collection(db, 'challengeSubmissions'), {
        schoolName:    primarySchool,
        teacherEmail,
        challengeId:   uploadChallenge.id,
        challengeName: uploadChallenge.name,
        evidenceUrl:   url,
        note:          uploadNote.trim(),
        pointsValue:   uploadChallenge.points,
        status:        'pending',
        submittedAt:   serverTimestamp(),
      });
      setUploadSuccess(true);
      setTimeout(() => { setUploadChallenge(null); setUploadFile(null); setUploadNote(''); setUploadSuccess(false); }, 2500);
    } catch (e) { console.error('Upload error:', e); alert('Upload failed. Please try again.'); }
    setUploadSubmitting(false);
  };

  if (!demoMode && (authLoading || classesLoading)) return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, var(--t-deep) 0%, var(--t-mid) 60%, var(--t-eucalyptus) 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.5rem' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
        <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <img src="/images/logo.png" alt="Taronga" style={{ width:'48px', height:'48px', objectFit:'contain' }} onError={e => e.target.style.display='none'} />
        </div>
        <h1 className="taronga-title" style={{ color:'white', fontSize:'1.5rem', letterSpacing:'0.06em', fontWeight:400, margin:0 }}>TARONGA TRACKA</h1>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.8rem', margin:0 }}>Teacher Portal</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.75rem' }}>
        <div style={{ width:'36px', height:'36px', border:'3px solid rgba(255,255,255,0.2)', borderTop:'3px solid white', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.85rem', margin:0, fontWeight:500 }}>Loading your classes…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
    <div className="lms-page">
      {/* Topbar */}
      <div className="lms-topbar">
        <div className="lms-topbar-brand">
          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'var(--t-deep)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 2px 8px rgba(0,0,0,0.12)' }}>
            <img src="/images/logo.png" alt="Taronga" style={{ height:'32px', width:'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>TARONGA TRACKA</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · {teacherEmail}</p>
          </div>
        </div>
        <button className="lms-signout-btn" onClick={signOutTeacher}>Sign Out</button>
      </div>

      <div className="lms-two-col">
        {/* Sidebar */}
        <div className="lms-sidebar">
          <div className="lms-sidebar-logo">
            <p style={{ fontSize:'0.63rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:'0.15rem' }}>Teacher Portal</p>
            <p style={{ fontSize:'0.82rem', fontWeight:600, color:'rgba(255,255,255,0.75)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{teacherEmail}</p>
          </div>
          <p className="lms-nav-group-label">Menu</p>
          <nav className="lms-nav">
            <button className="lms-nav-item lms-nav-active"><span className="lms-nav-icon">⊞</span> Dashboard</button>
            <button className="lms-nav-item" onClick={() => setCurrentScreen('createClass')}><span className="lms-nav-icon">+</span> Create Class</button>
            <button className="lms-nav-item" onClick={() => { const el = document.getElementById('t-classes-section'); el?.scrollIntoView({ behavior:'smooth' }); }}><span className="lms-nav-icon">○</span> My Classes</button>
            <button className="lms-nav-item" onClick={() => window.open('https://www.wildlybytaronga.com.au', '_blank')}><span className="lms-nav-icon">✦</span> <WildlyLabel /></button>
            <button className="lms-nav-item" onClick={() => window.open('https://www.taronga.org.au/learn', '_blank')}><span className="lms-nav-icon">◎</span> Book Excursion</button>
          </nav>
          <p className="lms-nav-group-label" style={{ marginTop:'1rem' }}>Account</p>
          <nav className="lms-nav">
            <button className="lms-nav-item" onClick={() => { setFeedbackRating(0); setFeedbackComment(''); setShowFeedback(true); }}><span className="lms-nav-icon">☺</span> Feedback</button>
            <button className="lms-nav-item" onClick={() => setCurrentScreen('home')}><span className="lms-nav-icon">←</span> Back to Home</button>
          </nav>
          <div style={{ marginTop:'auto', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,0.08)', padding:'1.5rem 1.25rem 0' }}>
            <button onClick={() => setLegalDoc('privacy')} style={{ display:'block', background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:'0.72rem', cursor:'pointer', padding:'0.2rem 0', textAlign:'left', width:'100%' }}>Privacy Policy</button>
            <button onClick={() => setLegalDoc('terms')}   style={{ display:'block', background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:'0.72rem', cursor:'pointer', padding:'0.2rem 0', textAlign:'left', width:'100%' }}>Terms of Use</button>
          </div>
        </div>

        {/* Main content */}
        <div className="lms-main">
          <div className="lms-main-inner">

            {/* Welcome header */}
            <div style={{ marginBottom:'1.5rem' }}>
              <h2 className="heading-display" style={{ fontSize:'clamp(1.3rem, 2.5vw, 1.65rem)', color:'var(--t-deep)', lineHeight:1.2, marginBottom:'0.2rem' }}>
                Welcome back{teacher?.displayName ? `, ${teacher.displayName.split(' ')[0]}` : ''}
              </h2>
              <p style={{ color:'var(--t-slate)', fontSize:'0.82rem' }}>
                {new Date().toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
                {primarySchool ? ` · ${primarySchool}` : ''}
              </p>
            </div>

            {/* Set school nudge */}
            {!teacherProfile?.schoolName && (
              <div style={{ background:'#FFF9C4', border:'1px solid #F59E0B', borderRadius:'var(--t-r-md)', padding:'1rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:'200px' }}>
                  <p style={{ margin:0, fontSize:'0.85rem', fontWeight:700, color:'#92400E' }}>Set your school to use points &amp; leaderboard</p>
                  <p style={{ margin:'0.2rem 0 0', fontSize:'0.75rem', color:'#B45309' }}>Your school wasn't saved when you created your account.</p>
                </div>
                <div style={{ position:'relative', display:'flex', gap:'0.5rem', alignItems:'center', flex:1, minWidth:'220px' }}>
                  <div style={{ position:'relative', flex:1 }}>
                    <input
                      type="text"
                      value={setSchoolInput}
                      onChange={e => { setSetSchoolInput(e.target.value); setShowSetSchoolSugs(true); }}
                      onFocus={() => setShowSetSchoolSugs(true)}
                      onBlur={() => setTimeout(() => setShowSetSchoolSugs(false), 150)}
                      placeholder="Your school name…"
                      style={{ width:'100%', padding:'0.55rem 0.85rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid #F59E0B', fontSize:'0.85rem', fontFamily:'DM Sans, sans-serif', boxSizing:'border-box', outline:'none', background:'white' }}
                    />
                    {showSetSchoolSugs && setSchoolInput.trim().length > 0 && (() => {
                      const q = setSchoolInput.trim().toLowerCase();
                      const sugs = allSchools.filter(s => s.toLowerCase().includes(q));
                      const exactMatch = sugs.some(s => s.toLowerCase() === q);
                      return (
                        <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:'white', border:'1.5px solid #E5E5E5', borderRadius:'var(--t-r-sm)', boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:20, maxHeight:'180px', overflowY:'auto' }}>
                          {sugs.map(s => (
                            <button key={s} onMouseDown={() => { setSetSchoolInput(s); setShowSetSchoolSugs(false); }}
                              style={{ display:'block', width:'100%', padding:'0.55rem 0.85rem', background:'none', border:'none', textAlign:'left', fontSize:'0.85rem', cursor:'pointer', color:'var(--t-deep)', fontFamily:'DM Sans, sans-serif' }}
                              onMouseEnter={e => e.currentTarget.style.background='#F5F5F5'}
                              onMouseLeave={e => e.currentTarget.style.background='none'}>
                              {s}
                            </button>
                          ))}
                          {!exactMatch && (
                            <button onMouseDown={() => setShowSetSchoolSugs(false)}
                              style={{ display:'block', width:'100%', padding:'0.55rem 0.85rem', background:'none', border:'none', borderTop: sugs.length ? '1px solid #F0F0F0' : 'none', textAlign:'left', fontSize:'0.85rem', cursor:'pointer', color:'var(--t-mid)', fontFamily:'DM Sans, sans-serif', fontWeight:600 }}
                              onMouseEnter={e => e.currentTarget.style.background='#F0FFF4'}
                              onMouseLeave={e => e.currentTarget.style.background='none'}>
                              + Add "{setSchoolInput.trim()}"
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  <button onClick={saveSchoolToProfile} disabled={setSchoolInput.trim().length < 2 || savingSchool}
                    style={{ padding:'0.55rem 1rem', borderRadius:'var(--t-r-sm)', border:'none', background: setSchoolInput.trim().length >= 2 ? '#D97706' : '#CCC', color:'white', fontSize:'0.82rem', fontWeight:700, cursor: setSchoolInput.trim().length >= 2 ? 'pointer' : 'not-allowed', whiteSpace:'nowrap', flexShrink:0 }}>
                    {savingSchool ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'0.75rem', marginBottom:'1.5rem' }}>
              {[
                { icon:<SvgPlus/>, label:'Create Class', sub:'New session', action: () => setCurrentScreen('createClass'), color:'var(--t-mid)' },
                { icon:<SvgLayers/>, label:'Pre/Post Visit', sub:'Learning resources', action: () => {}, color:'#0369A1' },
                { icon:<SvgHelpCircle/>, label:'How To', sub:'Guides & tutorials', action: () => {}, color:'#7C3AED' },
                { icon:<SvgGlobe/>, label:'Wildly', sub:'by Taronga', action: () => window.open('https://www.wildlybytaronga.com.au', '_blank'), color:'#D97706' },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.5rem', padding:'1.25rem 0.75rem', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-stone)', background:'white', cursor:'pointer', boxShadow:'var(--t-shadow-sm)', transition:'all 0.18s', textAlign:'center' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=btn.color; e.currentTarget.style.boxShadow=`0 4px 16px rgba(0,0,0,0.1)`; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--t-stone)'; e.currentTarget.style.boxShadow='var(--t-shadow-sm)'; e.currentTarget.style.transform='none'; }}>
                  <div style={{ width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', color:btn.color }}>{btn.icon}</div>
                  <div>
                    <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--t-deep)', lineHeight:1.2 }}>{btn.label}</div>
                    <div style={{ fontSize:'0.68rem', color:'var(--t-ash)', marginTop:'0.15rem' }}>{btn.sub}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Video / tour strip */}
            <div style={{ background:'white', borderRadius:'var(--t-r-lg)', border:'1px solid var(--t-stone)', boxShadow:'var(--t-shadow-sm)', padding:'1.5rem', marginBottom:'1.5rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', alignItems:'center' }}>
              <div>
                <div style={{ display:'inline-block', background:'var(--t-foam)', color:'var(--t-mid)', fontSize:'0.68rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em', padding:'0.2rem 0.65rem', borderRadius:'var(--t-r-pill)', marginBottom:'0.75rem' }}>Getting Started</div>
                <h3 style={{ fontSize:'1.15rem', fontWeight:700, color:'var(--t-deep)', margin:'0 0 0.5rem', lineHeight:1.3 }}>Welcome to Taronga Tracka</h3>
                <p style={{ fontSize:'0.83rem', color:'var(--t-slate)', lineHeight:1.65, margin:'0 0 1rem' }}>A quick walkthrough of how to set up your class, run a visit, and review student results — everything you need in under 5 minutes.</p>
                <button style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.6rem 1.2rem', borderRadius:'var(--t-r-pill)', border:'2px solid var(--t-mid)', background:'none', color:'var(--t-mid)', fontSize:'0.82rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.03em' }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--t-mid)'; e.currentTarget.style.color='white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--t-mid)'; }}>
                  ▶ Watch Tutorial
                </button>
              </div>
              <div style={{ background:'#0A2F1F', borderRadius:'var(--t-r-md)', aspectRatio:'16/9', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.75rem', cursor:'pointer' }}
                onMouseEnter={e => e.currentTarget.style.opacity='0.85'} onMouseLeave={e => e.currentTarget.style.opacity='1'}>
                <div style={{ width:'52px', height:'52px', borderRadius:'50%', background:'rgba(255,255,255,0.15)', border:'2px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:'1.4rem', marginLeft:'4px' }}>▶</span>
                </div>
                <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.72rem', margin:0, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase' }}>Video Coming Soon</p>
              </div>
            </div>

            {/* School Points & Challenges */}
            <div style={{ background:'white', borderRadius:'var(--t-r-lg)', border:'1px solid var(--t-stone)', boxShadow:'var(--t-shadow-sm)', padding:'1.5rem', marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
                <div>
                  <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--t-deep)', margin:'0 0 0.15rem' }}>School Points &amp; Challenges</h3>
                  <p style={{ fontSize:'0.78rem', color:'var(--t-ash)', margin:0 }}>Earn points through visits and conservation challenges</p>
                </div>
              </div>

              {/* Points card + milestone */}
              <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:'1.25rem', marginBottom:'1.25rem' }}>
                <div style={{ background:'linear-gradient(135deg, var(--t-deep) 0%, var(--t-mid) 100%)', borderRadius:'var(--t-r-md)', padding:'1.25rem', color:'white', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                  <div style={{ fontSize:'0.65rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.55)' }}>Your School</div>
                  <div style={{ fontSize:'0.82rem', fontWeight:600, color:'rgba(255,255,255,0.85)', lineHeight:1.2 }}>{primarySchool || '—'}</div>
                  <div style={{ fontSize:'2.5rem', fontWeight:800, lineHeight:1, marginTop:'0.25rem' }}>
                    {schoolPoints === null ? '—' : schoolPoints}
                  </div>
                  <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.6)' }}>total points</div>
                  {schoolPoints !== null && nextMilestone && (
                    <>
                      <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:'4px', height:'6px', overflow:'hidden', marginTop:'0.25rem' }}>
                        <div style={{ width:`${milestoneProgress}%`, height:'100%', background: nextMilestone.reward ? '#FCD34D' : 'rgba(255,255,255,0.8)', borderRadius:'4px', transition:'width 0.5s' }} />
                      </div>
                      {nextMilestone.reward ? (
                        <div style={{ fontSize:'0.67rem', color:'#FCD34D', lineHeight:1.4, fontWeight:700 }}>
                          {nextMilestone.points - (schoolPoints||0)} pts to a free zoo visit
                        </div>
                      ) : (
                        <div style={{ fontSize:'0.67rem', color:'rgba(255,255,255,0.55)', lineHeight:1.4 }}>Next: {nextMilestone.label} at {nextMilestone.points} pts</div>
                      )}
                    </>
                  )}
                  {schoolPoints !== null && (schoolPoints || 0) >= 300 && (
                    <div style={{ marginTop:'0.25rem', background:'#FCD34D', borderRadius:'var(--t-r-xs)', padding:'0.3rem 0.6rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                      <span style={{ fontSize:'0.7rem', fontWeight:800, color:'#78350F' }}>Free zoo visit unlocked!</span>
                    </div>
                  )}
                </div>

                {/* Monthly challenge — featured */}
                {(() => {
                  const monthlySub = mySubmissions[MONTHLY_CHALLENGE.id];
                  const monthlyPending  = monthlySub?.status === 'pending';
                  const monthlyApproved = monthlySub?.status === 'approved';
                  return (
                <div style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1.1rem 1.25rem', borderRadius:'var(--t-r-md)', border: monthlyApproved ? '2px solid #D97706' : '2px dashed #F59E0B', background:'linear-gradient(135deg, #FFFBEB, #FEF3C7)' }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'var(--t-r-sm)', background: monthlyApproved ? '#D97706' : '#FEF3C7', border:'1px solid #F59E0B', display:'flex', alignItems:'center', justifyContent:'center', color: monthlyApproved ? 'white' : '#D97706', flexShrink:0 }}>{MONTHLY_CHALLENGE.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.25rem', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'0.85rem', fontWeight:700, color:'#92400E' }}>{MONTHLY_CHALLENGE.name}</span>
                      <span style={{ fontSize:'0.62rem', fontWeight:700, color:'#B45309', background:'#FDE68A', padding:'0.1rem 0.45rem', borderRadius:'var(--t-r-pill)' }}>Monthly</span>
                      <span style={{ fontSize:'0.65rem', fontWeight:700, color:'#D97706', background:'white', border:'1px solid #F59E0B', padding:'0.1rem 0.4rem', borderRadius:'var(--t-r-pill)' }}>+{MONTHLY_CHALLENGE.points} pts</span>
                      {monthlyPending  && <span style={{ fontSize:'0.62rem', fontWeight:700, color:'#92400E', background:'#FEF3C7', border:'1px solid #F59E0B', padding:'0.1rem 0.45rem', borderRadius:'var(--t-r-pill)' }}>Pending review</span>}
                      {monthlyApproved && <span style={{ fontSize:'0.62rem', fontWeight:700, color:'#166534', background:'#DCFCE7', border:'1px solid #86EFAC', padding:'0.1rem 0.45rem', borderRadius:'var(--t-r-pill)' }}>Complete</span>}
                    </div>
                    <p style={{ fontSize:'0.75rem', color:'#92400E', margin: monthlySub ? '0' : '0 0 0.6rem', lineHeight:1.5 }}>{MONTHLY_CHALLENGE.desc}</p>
                    {!monthlySub && (
                    <button onClick={() => { setUploadChallenge(MONTHLY_CHALLENGE); setUploadFile(null); setUploadNote(''); setUploadSuccess(false); }}
                      style={{ marginTop:'0.6rem', padding:'0.4rem 1rem', borderRadius:'var(--t-r-pill)', border:'1.5px solid #D97706', background:'none', color:'#D97706', fontSize:'0.73rem', fontWeight:700, cursor:'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.background='#D97706'; e.currentTarget.style.color='white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='#D97706'; }}>
                      Submit Evidence
                    </button>
                    )}
                  </div>
                </div>
                    );
                  })()}
                </div>

              {/* Horizontal scroll of all challenges */}
              <div style={{ position:'relative' }}>
              <div
                ref={challengeScrollRef}
                onScroll={e => {
                  const el = e.currentTarget;
                  setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
                }}
                style={{ overflowX:'auto', marginBottom:'0.25rem', paddingBottom:'0.5rem' }}>
                <div style={{ display:'flex', gap:'0.75rem', width:'max-content' }}>
                  {CHALLENGES.map(ch => {
                    const isAutoComplete = ch.type === 'auto' && (
                      ch.location ? activeClasses.some(c => c.location === ch.location) : activeClasses.length > 0
                    );
                    const isSubmit = ch.type === 'submit';
                    const sub = mySubmissions[ch.id];
                    const isApproved = sub?.status === 'approved';
                    const isPending  = sub?.status === 'pending';
                    const isDone     = isAutoComplete || isApproved;
                    const borderCol  = isDone ? 'var(--t-mid)' : isPending ? '#F59E0B' : 'var(--t-stone)';
                    const bgCol      = isDone ? 'var(--t-foam)' : isPending ? '#FFFBEB' : 'white';
                    return (
                      <div key={ch.id} style={{ width:'180px', flexShrink:0, display:'flex', flexDirection:'column', borderRadius:'var(--t-r-md)', border:`1px solid ${borderCol}`, background:bgCol, padding:'1rem', position:'relative', overflow:'hidden' }}>
                        {isDone && (
                          <div style={{ position:'absolute', top:'0.5rem', right:'0.5rem', width:'20px', height:'20px', borderRadius:'50%', background:'var(--t-mid)', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <SvgCheck/>
                          </div>
                        )}
                        {isPending && !isDone && (
                          <div style={{ position:'absolute', top:'0.5rem', right:'0.5rem', fontSize:'0.6rem', fontWeight:800, color:'#92400E', background:'#FEF3C7', border:'1px solid #F59E0B', borderRadius:'3px', padding:'1px 5px' }}>Review</div>
                        )}
                        <div style={{ width:'40px', height:'40px', borderRadius:'var(--t-r-sm)', background: isDone ? 'var(--t-mid)' : 'var(--t-chalk)', border:`1px solid ${isDone ? 'var(--t-mid)' : 'var(--t-mist)'}`, display:'flex', alignItems:'center', justifyContent:'center', color: isDone ? 'white' : 'var(--t-slate)', marginBottom:'0.6rem' }}>
                          {ch.icon}
                        </div>
                        <div style={{ fontSize:'0.8rem', fontWeight:700, color: isDone ? 'var(--t-mid)' : 'var(--t-deep)', marginBottom:'0.2rem', lineHeight:1.2 }}>{ch.name}</div>
                        <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', margin:'0 0 auto', lineHeight:1.4, paddingBottom:'0.75rem' }}>{ch.desc}</p>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'0.6rem', paddingTop:'0.6rem', borderTop:`1px solid ${isDone ? 'rgba(46,125,85,0.15)' : 'var(--t-mist)'}` }}>
                          <span style={{ fontSize:'0.68rem', fontWeight:700, color: isDone ? 'var(--t-mid)' : 'var(--t-sage)', background: isDone ? 'rgba(46,125,85,0.1)' : 'var(--t-chalk)', padding:'0.15rem 0.4rem', borderRadius:'var(--t-r-pill)' }}>+{ch.points} pts</span>
                          {isAutoComplete && <span style={{ fontSize:'0.65rem', fontWeight:700, color:'var(--t-mid)' }}>Auto</span>}
                          {isApproved && <span style={{ fontSize:'0.65rem', fontWeight:700, color:'var(--t-mid)' }}>Complete</span>}
                          {isPending && !isApproved && <span style={{ fontSize:'0.65rem', fontWeight:600, color:'#92400E' }}>Pending</span>}
                          {isSubmit && !sub && (
                            <button onClick={() => { setUploadChallenge(ch); setUploadFile(null); setUploadNote(''); setUploadSuccess(false); }}
                              style={{ fontSize:'0.65rem', fontWeight:700, color:'var(--t-mid)', background:'none', border:'none', cursor:'pointer', padding:0, textDecoration:'underline' }}>
                              Submit
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {canScrollRight && (
                <div style={{ position:'absolute', top:0, right:0, bottom:'0.5rem', width:'64px', background:'linear-gradient(to right, transparent, white 70%)', display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:'0.5rem', pointerEvents:'none' }}>
                  <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'white', border:'1px solid var(--t-stone)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', color:'var(--t-slate)', fontSize:'1.1rem', lineHeight:1 }}>›</div>
                </div>
              )}
              </div>

              {/* Leaderboard */}
              <div style={{ borderTop:'1px solid var(--t-mist)', paddingTop:'1rem' }}>
                <h4 style={{ fontSize:'0.78rem', fontWeight:800, color:'var(--t-deep)', textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 0.75rem' }}>School Leaderboard</h4>
                {leaderboard.length === 0 ? (
                  <p style={{ fontSize:'0.78rem', color:'var(--t-ash)', fontStyle:'italic', margin:0 }}>No schools on the leaderboard yet. Be the first!</p>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
                    {leaderboard.map((school, i) => {
                      const isYours = primarySchool && normalizeSchoolId(primarySchool) === school.id;
                      const medal   = null;
                      const maxPts  = leaderboard[0]?.totalPoints || 1;
                      const barW    = Math.round((school.totalPoints / maxPts) * 100);
                      return (
                        <div key={school.id} style={{ display:'grid', gridTemplateColumns:'1.5rem 1fr auto', gap:'0.6rem', alignItems:'center', padding:'0.5rem 0.6rem', borderRadius:'var(--t-r-sm)', background: isYours ? 'var(--t-foam)' : 'transparent', border: isYours ? '1px solid var(--t-mist)' : '1px solid transparent' }}>
                          <span style={{ fontSize:'0.72rem', fontWeight:700, textAlign:'center', color: i===0 ? '#B45309' : i===1 ? '#6B7280' : i===2 ? '#92400E' : 'var(--t-ash)' }}>{i+1}</span>
                          <div>
                            <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.2rem' }}>
                              <span style={{ fontSize:'0.78rem', fontWeight: isYours ? 700 : 500, color: isYours ? 'var(--t-mid)' : 'var(--t-deep)' }}>{school.name || school.id}</span>
                              {isYours && <span style={{ fontSize:'0.6rem', fontWeight:700, color:'var(--t-mid)', background:'var(--t-foam)', border:'1px solid var(--t-mist)', padding:'0 0.35rem', borderRadius:'var(--t-r-pill)' }}>You</span>}
                            </div>
                            <div style={{ height:'4px', background:'var(--t-mist)', borderRadius:'2px', overflow:'hidden' }}>
                              <div style={{ width:`${barW}%`, height:'100%', background: isYours ? 'var(--t-mid)' : '#9CA3AF', borderRadius:'2px' }} />
                            </div>
                          </div>
                          <span style={{ fontSize:'0.78rem', fontWeight:700, color: isYours ? 'var(--t-mid)' : 'var(--t-slate)', whiteSpace:'nowrap' }}>{school.totalPoints} pts</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* My Classes */}
            <div id="t-classes-section" style={{ marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
                <h3 className="lms-section-heading" style={{ margin:0 }}>
                  My Classes
                  <span style={{ fontFamily:'DM Sans, sans-serif', fontWeight:600, fontSize:'0.75rem', color:'var(--t-sage)', letterSpacing:0, marginLeft:'0.5rem' }}>({activeClasses.length})</span>
                </h3>
                <button onClick={() => setCurrentScreen('createClass')}
                  style={{ display:'flex', alignItems:'center', gap:'0.35rem', padding:'0.45rem 0.9rem', borderRadius:'var(--t-r-pill)', border:'none', background:'var(--t-mid)', color:'white', fontSize:'0.78rem', fontWeight:700, cursor:'pointer' }}>
                  + New Class
                </button>
              </div>

              {activeClasses.length === 0 ? (
                <div style={{ background:'var(--t-foam)', borderRadius:'var(--t-r-md)', padding:'2rem', textAlign:'center', border:'1px solid var(--t-mist)' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem', color:'var(--t-mid)', fontWeight:300 }}>✦</div>
                  <p style={{ color:'var(--t-slate)', fontSize:'0.88rem', fontWeight:600, marginBottom:'0.4rem' }}>No classes yet</p>
                  <p style={{ color:'var(--t-ash)', fontSize:'0.78rem', marginBottom:'1rem' }}>Create your first class to get started with Taronga Tracka</p>
                  <button onClick={() => setCurrentScreen('createClass')} style={{ padding:'0.6rem 1.5rem', borderRadius:'var(--t-r-pill)', border:'none', background:'linear-gradient(135deg, var(--t-mid), var(--t-eucalyptus))', color:'white', fontSize:'0.85rem', fontWeight:700, cursor:'pointer' }}>
                    Create a Class
                  </button>
                </div>
              ) : (
                <div className="lms-card">
                  {activeClasses.map((cls, i) => {
                    const counts = studentCounts[cls.classCode] || { total:0, completed:0 };
                    const completionPct = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;
                    return (
                      <div key={cls.classCode}
                        onClick={() => { setSelectedClass(cls.classCode); setCurrentScreen('classDetails'); }}
                        className="animate-fade-in-up lms-class-row"
                        style={{ animationDelay:`${i*0.06}s` }}>
                        <div className="lms-class-avatar">{(cls.className||'?').charAt(0).toUpperCase()}</div>
                        <div className="lms-class-info" style={{ flex:1, minWidth:0 }}>
                          <p className="lms-class-name">{cls.className}</p>
                          <p className="lms-class-meta">
                            {cls.schoolName && <span style={{ color:'var(--t-mid)', fontWeight:600 }}>{cls.schoolName} · </span>}
                            {counts.total} student{counts.total !== 1 ? 's' : ''}
                            {cls.stage ? <span style={{ marginLeft:'0.4rem', background:'var(--t-foam)', color:'var(--t-mid)', fontWeight:700, borderRadius:'var(--t-r-xs)', padding:'0 0.35rem', fontSize:'0.6875rem' }}>Stage {cls.stage}</span> : null}
                          </p>
                          {(cls.location || cls.subject) && (
                            <p className="lms-class-meta" style={{ marginTop:'0.15rem', color:'var(--t-sage)' }}>
                              {cls.location && <span style={{ fontWeight:600 }}>{{ 'taronga-sydney':'Taronga Sydney', 'zoosnooz-sydney':'ZooSnooz · Sydney', 'dubbo':'Taronga Dubbo', 'school':'Your School' }[cls.location] || cls.location}</span>}
                              {cls.location && cls.subject && <span style={{ color:'var(--t-ash)' }}> · </span>}
                              {cls.subject && <span style={{ textTransform:'capitalize', color:'var(--t-slate)' }}>{cls.subject}</span>}
                            </p>
                          )}
                          {counts.total > 0 && (
                            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'0.3rem' }}>
                              <div style={{ flex:1, height:'3px', background:'var(--t-mist)', borderRadius:'2px', overflow:'hidden' }}>
                                <div style={{ width:`${completionPct}%`, height:'100%', background:'#22C55E' }} />
                              </div>
                              <span style={{ fontSize:'0.65rem', color:'var(--t-ash)', whiteSpace:'nowrap' }}>{counts.completed}/{counts.total} done</span>
                            </div>
                          )}
                        </div>
                        <div onClick={e => { e.stopPropagation(); setClassCodeModal(cls.classCode); }}
                          style={{ textAlign:'right', cursor:'pointer', padding:'0.25rem 0.4rem', borderRadius:'var(--t-r-xs)', transition:'background 0.16s', flexShrink:0 }}
                          onMouseEnter={e => e.currentTarget.style.background='var(--t-foam)'}
                          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                          <p style={{ fontFamily:'monospace', fontWeight:700, fontSize:'0.875rem', color:'var(--t-mid)', letterSpacing:'0.06em' }}>{cls.classCode}</p>
                          <p style={{ color:'var(--t-ash)', fontSize:'0.6875rem' }}>tap to display</p>
                        </div>
                        <span className="lms-chevron">›</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Resources */}
            <div style={{ marginBottom:'1.5rem' }}>
              <h3 className="lms-section-heading" style={{ marginBottom:'0.75rem' }}>Resources</h3>
              <div style={{ display:'flex', gap:'0.75rem', overflowX:'auto', paddingBottom:'0.5rem', scrollbarWidth:'none' }}>
                {RESOURCE_CARDS.map(r => (
                  <div key={r.title} style={{ flexShrink:0, width:'180px', background:'white', borderRadius:'var(--t-r-md)', border:'1px solid var(--t-stone)', padding:'1.1rem', cursor:'pointer', transition:'all 0.18s', boxShadow:'var(--t-shadow-sm)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='var(--t-mid)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--t-stone)'; e.currentTarget.style.transform='none'; }}>
                    <div style={{ fontSize:'1.75rem', marginBottom:'0.6rem' }}>{r.icon}</div>
                    <div style={{ fontSize:'0.62rem', fontWeight:700, color:'var(--t-ash)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.3rem' }}>{r.tag}</div>
                    <div style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', lineHeight:1.3 }}>{r.title}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--t-slate)', lineHeight:1.45 }}>{r.desc}</div>
                    <div style={{ marginTop:'0.75rem', fontSize:'0.7rem', color:'var(--t-ash)', fontStyle:'italic' }}>Coming soon</div>
                  </div>
                ))}
              </div>
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
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem' }}>
              {[1,2,3,4,5].map(n => <button key={n} onClick={() => setFeedbackRating(n)} style={{ fontSize:'1.6rem', background:'none', border:'none', cursor:'pointer', opacity: n <= feedbackRating ? 1 : 0.25 }}>⭐</button>)}
            </div>
            <textarea value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)} placeholder="Share your feedback…"
              style={{ width:'100%', minHeight:'90px', padding:'0.75rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid #E5E5E5', fontSize:'0.88rem', fontFamily:'DM Sans, sans-serif', resize:'vertical', boxSizing:'border-box', marginBottom:'1rem', outline:'none' }} />
            <div style={{ display:'flex', gap:'0.6rem' }}>
              <button onClick={submitFeedback} disabled={feedbackSubmitting || !feedbackRating}
                style={{ flex:1, padding:'0.75rem', borderRadius:'var(--t-r-sm)', border:'none', background: feedbackRating > 0 ? 'linear-gradient(135deg, var(--t-mid), var(--t-eucalyptus))' : '#CCC', color:'white', fontSize:'0.9rem', fontWeight:700, cursor: feedbackRating > 0 ? 'pointer' : 'not-allowed' }}>
                {feedbackSubmitting ? 'Submitting…' : 'Submit Feedback'}
              </button>
              <button onClick={() => setShowFeedback(false)} style={{ padding:'0.75rem 1.1rem', borderRadius:'var(--t-r-sm)', border:'1px solid #E5E5E5', background:'white', fontSize:'0.9rem', color:'#888', cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Class code modal */}
      {classCodeModal && !classCodeFullscreen && (
        <div onClick={() => setClassCodeModal(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'24px', padding:'2.5rem', textAlign:'center', boxShadow:'0 24px 60px rgba(0,0,0,0.3)', minWidth:'320px' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:600, color:'#888', marginBottom:'1rem', textTransform:'uppercase', letterSpacing:'0.1em' }}>Class Code</h3>
            <div style={{ fontFamily:'monospace', fontSize:'4rem', fontWeight:700, color:'var(--t-deep)', letterSpacing:'0.3em', marginBottom:'1.5rem', lineHeight:1.2 }}>{classCodeModal}</div>
            <button onClick={() => setClassCodeFullscreen(true)} style={{ width:'100%', background:'linear-gradient(135deg, var(--t-mid), var(--t-eucalyptus))', color:'white', border:'none', padding:'0.85rem', borderRadius:'var(--t-r-md)', fontSize:'0.95rem', fontWeight:700, cursor:'pointer', marginBottom:'0.7rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Full Screen Mode</button>
            <button onClick={() => setClassCodeModal(null)} style={{ width:'100%', background:'#F5F3EE', color:'#666', border:'none', padding:'0.75rem', borderRadius:'var(--t-r-md)', fontSize:'0.85rem', fontWeight:600, cursor:'pointer' }}>Close</button>
          </div>
        </div>
      )}

      {/* Fullscreen class code */}
      {classCodeFullscreen && (
        <div style={{ position:'fixed', inset:0, background:'#0A2F1F', zIndex:300, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontFamily:'monospace', fontSize:'clamp(5rem, 20vw, 12rem)', fontWeight:700, color:'white', letterSpacing:'0.3em', textAlign:'center' }}>{classCodeModal}</div>
          <button onClick={() => { setClassCodeFullscreen(false); setClassCodeModal(null); }}
            style={{ position:'absolute', top:'2rem', right:'2rem', background:'rgba(255,255,255,0.15)', color:'white', border:'2px solid rgba(255,255,255,0.3)', padding:'0.75rem 1.5rem', borderRadius:'var(--t-r-md)', fontSize:'0.9rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>
            Exit
          </button>
        </div>
      )}

      {/* Challenge upload modal */}
      {uploadChallenge && (
        <div onClick={() => setUploadChallenge(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'var(--t-r-lg)', padding:'2rem', width:'100%', maxWidth:'460px', boxShadow:'0 24px 60px rgba(0,0,0,0.3)' }}>
            {uploadSuccess ? (
              <div style={{ textAlign:'center', padding:'1rem 0' }}>
                <div style={{ fontSize:'3rem', marginBottom:'0.75rem', color:'#22C55E' }}>✓</div>
                <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.4rem' }}>Evidence Submitted!</h3>
                <p style={{ fontSize:'0.83rem', color:'var(--t-slate)' }}>Your submission is being reviewed by the Taronga team. Points will be awarded once approved.</p>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem' }}>
                  <span style={{ fontSize:'1.75rem' }}>{uploadChallenge.icon}</span>
                  <div>
                    <h3 style={{ fontSize:'1.05rem', fontWeight:700, color:'var(--t-deep)', margin:0 }}>{uploadChallenge.name}</h3>
                    <p style={{ fontSize:'0.75rem', color:'var(--t-ash)', margin:0 }}>+{uploadChallenge.points} points on approval</p>
                  </div>
                </div>
                <p style={{ fontSize:'0.83rem', color:'var(--t-slate)', marginBottom:'1.25rem', lineHeight:1.6 }}>{uploadChallenge.desc}</p>

                <div style={{ marginBottom:'1rem' }}>
                  <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Photo Evidence</label>
                  <div onClick={() => fileInputRef.current?.click()}
                    style={{ border:`2px dashed ${uploadFile ? 'var(--t-mid)' : 'var(--t-stone)'}`, borderRadius:'var(--t-r-md)', padding:'1.5rem', textAlign:'center', cursor:'pointer', background: uploadFile ? 'var(--t-foam)' : 'var(--t-chalk)', transition:'all 0.18s' }}>
                    {uploadFile ? (
                      <div>
                        <div style={{ fontSize:'1.5rem', marginBottom:'0.4rem', color:'var(--t-mid)' }}>○</div>
                        <p style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--t-mid)', margin:0 }}>{uploadFile.name}</p>
                        <p style={{ fontSize:'0.72rem', color:'var(--t-ash)', margin:'0.2rem 0 0' }}>Click to change</p>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize:'1.5rem', marginBottom:'0.4rem', color:'var(--t-ash)' }}>↑</div>
                        <p style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--t-slate)', margin:0 }}>Click to upload a photo</p>
                        <p style={{ fontSize:'0.72rem', color:'var(--t-ash)', margin:'0.2rem 0 0' }}>JPG, PNG or HEIC</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => setUploadFile(e.target.files[0] || null)} />
                </div>

                <div style={{ marginBottom:'1.25rem' }}>
                  <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Note <span style={{ color:'var(--t-ash)', fontWeight:400, textTransform:'none' }}>(optional)</span></label>
                  <textarea value={uploadNote} onChange={e => setUploadNote(e.target.value)} placeholder="Briefly describe what your class did…" rows={3}
                    style={{ width:'100%', padding:'0.65rem 0.9rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-stone)', fontSize:'0.85rem', fontFamily:'DM Sans, sans-serif', resize:'none', boxSizing:'border-box', outline:'none' }} />
                </div>

                <div style={{ display:'flex', gap:'0.6rem' }}>
                  <button onClick={submitChallengeEvidence} disabled={!uploadFile || uploadSubmitting}
                    style={{ flex:1, padding:'0.8rem', borderRadius:'var(--t-r-sm)', border:'none', background: uploadFile ? 'linear-gradient(135deg, var(--t-mid), var(--t-eucalyptus))' : '#CCC', color:'white', fontSize:'0.9rem', fontWeight:700, cursor: uploadFile ? 'pointer' : 'not-allowed' }}>
                    {uploadSubmitting ? 'Submitting…' : 'Submit Evidence'}
                  </button>
                  <button onClick={() => setUploadChallenge(null)} style={{ padding:'0.8rem 1.1rem', borderRadius:'var(--t-r-sm)', border:'1px solid #E5E5E5', background:'white', fontSize:'0.9rem', color:'#888', cursor:'pointer' }}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>

    {legalDoc && <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />}
    <TeacherHelpBot />
    <TeacherTutorial />
    </>
  );
}
