import { useState, useEffect } from 'react';
import { doc, getDoc, serverTimestamp, setDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../context/AppContext';
import { openTeacherInfoSheet } from '../utils/teacherInfoSheet';

function generateClassCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const NSW_OUTCOMES = {
  science: {
    syllabus: { 1:'Science K–6 (2023)', 2:'Science K–6 (2023)', 3:'Science K–6 (2023)', 4:'Science 7–10 (2023)', 5:'Science 7–10 (2023)' },
    1: [{ code:'ST1-2DP-T', desc:'Identifies and uses materials for a variety of purposes.' }],
    2: [{ code:'ST2-4LW-S', desc:'Compares features and characteristics of living and non-living things.' }, { code:'ST2-5WT-T', desc:'Selects and uses materials, tools and equipment to design and create solutions' }],
    3: [{ code:'ST3-4LW-S', desc:'Examines how the environment affects the growth, survival and adaptation of living things.' }],
    4: [{ code:'SC4-CLS-01', desc:'Describes the unique features of cells in living things and how structural features can be used to classify organisms' }, { code:'SC4-LIV-01', desc:'Describes the role, structure and function of a range of living systems and their components' }],
    5: [{ code:'SC5-CLS-01', desc:'Analyses and evaluates the structural and functional relationships of living systems' }],
  },
  maths: {
    syllabus: { 1:'Mathematics K–6 (2023)', 2:'Mathematics K–6 (2023)', 3:'Mathematics K–6 (2023)', 4:'Mathematics 7–10 (2022)', 5:'Mathematics 7–10 (2022)' },
    1: [{ code:'MA1-RWN-01', desc:'Applies place value to read, represent and order numbers' }],
    2: [{ code:'MA2-RN-01',  desc:'Applies place value to order, read and represent numbers' }],
    3: [{ code:'MA3-RN-01',  desc:'Compares, orders and calculates with fractions, decimals and percentages' }],
    4: [{ code:'MA4-NUM-C-01', desc:'Represents and operates with integers, decimals and fractions in a variety of contexts' }, { code:'MA4-STA-C-01', desc:'Classifies and displays data using a variety of statistical representations and interprets results' }],
    5: [{ code:'MA5-NUM-C-01', desc:'Selects and applies appropriate operations with real numbers' }],
  },
  english: {
    syllabus: { 1:'English K–6 (2023)', 2:'English K–6 (2023)', 3:'English K–6 (2023)', 4:'English 7–10 (2022)', 5:'English 7–10 (2022)' },
    1: [{ code:'EN1-VOCAB-01', desc:'Uses Tier 1 and Tier 2 vocabulary to understand and create texts' }, { code:'EN1-CWT-01', desc:'Plans and creates written texts for different purposes using simple sentences' }],
    2: [{ code:'EN2-VOCAB-01', desc:'Builds and extends vocabulary to communicate meaning' }, { code:'EN2-CWT-01', desc:'Plans, creates and revises imaginative, informative and persuasive texts' }],
    3: [{ code:'EN3-VOCAB-01', desc:'Selects vocabulary to enhance meaning when creating texts' }, { code:'EN3-CWT-01', desc:'Plans, creates and revises written texts for multiple purposes and audiences' }],
    4: [{ code:'EN4-URA-01', desc:'Analyses how meaning is created through language forms, features and structures' }],
    5: [{ code:'EN5-URA-01', desc:'Examines how increasingly complex language forms create meaning and position readers' }],
  },
  pdhpe: {
    syllabus: { 1:'PDHPE K–6 (2018)', 2:'PDHPE K–6 (2018)', 3:'PDHPE K–6 (2018)', 4:'PDHPE 7–10 (2018)', 5:'PDHPE 7–10 (2018)' },
    1: [{ code:'PD1-2', desc:'Describes how personal identity is shaped and how physical activity contributes to health' }],
    2: [{ code:'PD2-7', desc:'Investigates strategies to make healthy, informed choices to promote health and wellbeing' }],
    3: [{ code:'PD3-7', desc:'Investigates how health choices and behaviours affect individual wellbeing' }],
    4: [{ code:'PD4-2', desc:'Examines and applies health and physical activity concepts to enhance personal development' }],
    5: [{ code:'PD5-2', desc:'Analyses the interrelationship between health, wellbeing, and movement' }],
  },
};

const inputStyle = { width:'100%', padding:'0.65rem 0.9rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-stone)', fontSize:'0.88rem', fontFamily:'DM Sans, sans-serif', marginBottom:'0.85rem', boxSizing:'border-box', background:'var(--t-parchment)', color:'var(--t-ink)', outline:'none', transition:'border-color 0.2s' };

export default function CreateClassScreen() {
  const { setCurrentScreen, teacherEmail, teacher, authLoading, demoMode, teacherProfile } = useApp();

  useEffect(() => {
    if (!authLoading && !teacher && !demoMode) setCurrentScreen('teacherLogin');
  }, [teacher, authLoading, demoMode, setCurrentScreen]);

  const [newClassName,    setNewClassName]    = useState('');
  const [newClassStage,   setNewClassStage]   = useState(4);
  const schoolName = teacherProfile?.schoolName || '';
  const [newLocation,     setNewLocation]     = useState('taronga-sydney');
  const [newSubject,      setNewSubject]      = useState('science');
  const [zzConsentChecked, setZzConsentChecked] = useState(false);
  const [creatingClass,   setCreatingClass]   = useState(false);
  const [classCreated,    setClassCreated]    = useState(false);
  const [createError,     setCreateError]     = useState('');
  const [showWwzModal,    setShowWwzModal]    = useState(false);

  const isZooSnooz = newLocation === 'zoosnooz-sydney';
  const isZooYard  = newLocation === 'school';
  const isEvolve   = newLocation === 'evolve-sydney';

  const createClass = async () => {
    if (!newClassName.trim() || !schoolName) return;
    if (isZooSnooz && !zzConsentChecked) { setCreateError('Please confirm student filming consent before creating a ZooSnooz class.'); return; }
    setCreateError('');
    setCreatingClass(true);
    try {
      const code        = generateClassCode();
      const sessionDate = new Date().toISOString().split('T')[0];
      const sessionType = isEvolve ? 'evolve' : isZooYard ? 'zooyard' : isZooSnooz ? 'zoosnooz' : 'standard';
      const VENUES = { 'taronga-sydney':'Taronga Sydney', 'zoosnooz-sydney':'Taronga Sydney', 'evolve-sydney':'Taronga Sydney', 'dubbo':'Taronga Dubbo', 'school':'School' };
      const venue = VENUES[newLocation] || 'Taronga Zoo';
      const subject = isEvolve ? 'life-ready' : isZooYard ? 'science' : isZooSnooz ? null : newSubject;
      const stage   = isEvolve ? 6 : newClassStage;

      await setDoc(doc(db, 'teachers', teacherEmail, 'classes', code), {
        classCode: code, className: newClassName.trim(), schoolName,
        stage, accessCodeUsed: null,
        venue, createdAt: serverTimestamp(), archived: false,
        sessionClosed: false, sessionDate, sessionType,
        location: newLocation, subject,
      });
      await setDoc(doc(db, 'classes', code), {
        classCode: code, className: newClassName.trim(), schoolName,
        stage, teacherEmail, accessCodeUsed: null,
        venue, createdAt: serverTimestamp(), sessionClosed: false, sessionDate, sessionType,
        location: newLocation, subject,
      });

      // Award location-specific expedition points once per school (non-blocking)
      try {
        const EXPEDITION_AWARDS = {
          'taronga-sydney':  { id:'expedition-sydney',   points:25 },
          'zoosnooz-sydney': { id:'expedition-zoosnooz', points:40 },
          'dubbo':           { id:'expedition-dubbo',    points:35 },
          'school':          { id:'expedition-school',   points:20 },
        };
        const award = EXPEDITION_AWARDS[newLocation] || EXPEDITION_AWARDS['taronga-sydney'];
        const schoolId = schoolName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        const schoolSnap = await getDoc(doc(db, 'schools', schoolId));
        const awarded = schoolSnap.exists() ? (schoolSnap.data().awardedChallenges || []) : [];
        if (!awarded.includes(award.id)) {
          await setDoc(doc(db, 'schools', schoolId), {
            name: schoolName,
            totalPoints: increment(award.points),
            awardedChallenges: arrayUnion(award.id),
            lastUpdated: serverTimestamp(),
          }, { merge: true });
        }
      } catch {}

      setNewClassName(''); setZzConsentChecked(false);
      setNewLocation('taronga-sydney'); setNewSubject('science');
      setClassCreated(true);
      setShowWwzModal(true);
      setTimeout(() => setClassCreated(false), 3000);
    } catch (err) {
      console.error('Create class error:', err);
      setCreateError(err.message || 'Failed to create class. Please try again.');
    } finally {
      setCreatingClass(false);
    }
  };

  const displaySubject = isEvolve ? 'life-ready' : (isZooSnooz || isZooYard) ? 'science' : newSubject;
  const subjectData  = NSW_OUTCOMES[displaySubject];
  const outcomes     = subjectData?.[newClassStage] || [];
  const syllabusName = subjectData?.syllabus?.[newClassStage] || '';
  const subjectColors = {
    science: { accent:'#2E7D55', bg:'#F0F7F0', border:'#C6E2C6' },
    maths:   { accent:'#0369a1', bg:'#EFF6FF', border:'#BFDBFE' },
    pdhpe:   { accent:'#7C3AED', bg:'#F5F3FF', border:'#DDD6FE' },
    english: { accent:'#B45309', bg:'#FFFBEB', border:'#FDE68A' },
  };
  const sc = subjectColors[displaySubject] || subjectColors.science;

  return (
    <>
    <div className="lms-page">
      {/* Topbar */}
      <div className="lms-topbar">
        <div className="lms-topbar-brand">
          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'var(--t-deep)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <img src="/images/logo.png" alt="Taronga" style={{ height:'32px', width:'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>TARONGA TRACKA</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · {teacherEmail}</p>
          </div>
        </div>
        <button onClick={() => setCurrentScreen('teacherDashboard')} style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.5rem 1rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-stone)', background:'white', color:'var(--t-slate)', fontSize:'0.82rem', fontWeight:600, cursor:'pointer' }}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Main — no sidebar, centred single column */}
      <div className="lms-main" style={{ flex:1, overflowY:'auto' }}>
          <div style={{ maxWidth:'720px', width:'100%', margin:'0 auto' }}>
            <div style={{ marginBottom:'1.75rem' }}>
              <h2 className="heading-display" style={{ fontSize:'clamp(1.4rem, 2.5vw, 1.8rem)', color:'var(--t-deep)', lineHeight:1.2, marginBottom:'0.25rem' }}>Create a New Class</h2>
              <p style={{ color:'var(--t-slate)', fontSize:'0.85rem' }}>Students will join using the generated class code.</p>
            </div>

            <div style={{ background:'white', borderRadius:'var(--t-r-lg)', padding:'1.75rem', boxShadow:'var(--t-shadow-sm)', border:'1px solid var(--t-stone)' }}>

              {/* Location */}
              <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Location</label>
              <select value={newLocation} onChange={e => setNewLocation(e.target.value)} style={{ ...inputStyle, appearance:'auto', cursor:'pointer' }}
                onFocus={e => e.target.style.borderColor='var(--t-mid)'} onBlur={e => e.target.style.borderColor='var(--t-stone)'}>
                <option value="taronga-sydney">Taronga Sydney — Zoo Visit</option>
                <option value="zoosnooz-sydney">ZooSnooz — Taronga Sydney</option>
                <option value="dubbo" disabled>Taronga Dubbo (Coming Soon)</option>
                <option value="school">Your School — ZooYard</option>
                <option value="evolve-sydney">Taronga Sydney — Evolve (Stage 6)</option>
              </select>

              {isZooYard && (
                <div style={{ background:'#f0f7f2', border:'1px solid #b6d9c3', borderRadius:'10px', padding:'0.9rem 1rem', marginBottom:'1rem' }}>
                  <p style={{ margin:0, fontSize:'0.8rem', color:'#1a4a2a', lineHeight:1.6 }}>
                    ZooYard runs entirely at school — no GPS, no zoo visit. Students explore three habitats (bushland, rainforest, savannah), then complete a Habitat Hero citizen science task. Science only for now.
                  </p>
                </div>
              )}

              {isEvolve && (
                <div style={{ background:'#fdf5e8', border:'1px solid #e6c88a', borderRadius:'10px', padding:'0.9rem 1rem', marginBottom:'1rem' }}>
                  <p style={{ margin:0, fontSize:'0.8rem', color:'#5b3d15', lineHeight:1.6 }}>
                    Evolve is a Stage 6 twilight excursion supporting Life Ready. Students walk five chapters — lion, kangaroo, tiger, giraffe, koala — writing a reflection and filming a piece to camera at each, which stitch into one short film they keep. No points, badges or marks. Filming consent applies, same as ZooSnooz.
                  </p>
                </div>
              )}

              {/* Subject */}
              {newLocation !== 'zoosnooz-sydney' && !isZooYard && !isEvolve && (
                <>
                  <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Subject</label>
                  <select value={newSubject} onChange={e => setNewSubject(e.target.value)} style={{ ...inputStyle, appearance:'auto', cursor:'pointer' }}
                    onFocus={e => e.target.style.borderColor='var(--t-mid)'} onBlur={e => e.target.style.borderColor='var(--t-stone)'}>
                    <option value="science">Science</option>
                    <option value="maths">Mathematics</option>
                    <option value="english">English</option>
                    <option value="pdhpe">PDHPE</option>
                    <option value="geography" disabled>Geography (Coming Soon)</option>
                    <option value="ngara-nura" disabled>Ngara Nura (Coming Soon)</option>
                    <option value="technology" disabled>Technology (Coming Soon)</option>
                    <option value="visual-arts" disabled>Visual Arts (Coming Soon)</option>
                  </select>
                </>
              )}

              <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>School Name</label>
              <div style={{ marginBottom:'0.85rem', padding:'0.65rem 0.9rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-mist)', background:'var(--t-chalk)', fontSize:'0.88rem', color:'var(--t-slate)' }}>
                {schoolName
                  ? <><span style={{ fontWeight:700, color:'var(--t-deep)' }}>{schoolName}</span><span style={{ color:'var(--t-ash)', fontSize:'0.78rem', marginLeft:'0.5rem' }}>· from your profile</span></>
                  : <span style={{ color:'#ef4444' }}>No school set on your profile — go to Dashboard to set it.</span>
                }
              </div>

              {/* Evolve is Stage 6 by definition, so it has no stage picker — and the list
                  below only runs to Stage 5, so it could never have been set correctly. */}
              {!isEvolve && (
                <>
                  <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>NSW Stage</label>
                  <select value={newClassStage} onChange={e => setNewClassStage(Number(e.target.value))} style={{ ...inputStyle, appearance:'auto', cursor:'pointer' }}
                    onFocus={e => e.target.style.borderColor='var(--t-mid)'} onBlur={e => e.target.style.borderColor='var(--t-stone)'}>
                    <option value={1}>Stage 1 (K–2)</option>
                    <option value={2}>Stage 2 (3–4)</option>
                    <option value={3}>Stage 3 (5–6)</option>
                    <option value={4}>Stage 4 (7–8)</option>
                    <option value={5}>Stage 5 (9–10)</option>
                  </select>
                </>
              )}

              <label style={{ display:'block', fontSize:'0.78rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.3rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Class Name</label>
              <input type="text" value={newClassName} onChange={e => setNewClassName(e.target.value)} placeholder="e.g. 7A, Biology, Koala Crew"
                style={inputStyle} onFocus={e => e.target.style.borderColor='var(--t-mid)'} onBlur={e => e.target.style.borderColor='var(--t-stone)'} />

              {isZooSnooz && (
                <div style={{ background:'#f0f7f2', border:'1px solid #b6d9c3', borderRadius:'10px', padding:'0.9rem 1rem', marginBottom:'1rem' }}>
                  <label style={{ display:'flex', gap:'0.65rem', alignItems:'flex-start', cursor:'pointer' }}>
                    <input type="checkbox" checked={zzConsentChecked} onChange={e => setZzConsentChecked(e.target.checked)}
                      style={{ marginTop:'3px', accentColor:'#1B6B3A', width:'15px', height:'15px', flexShrink:0 }} />
                    <span style={{ fontSize:'0.8rem', color:'#1a4a2a', lineHeight:1.6 }}>
                      I confirm that appropriate consent for video filming has been obtained for all participating students in accordance with my school's policies.
                    </span>
                  </label>
                </div>
              )}

              {createError && <p style={{ color:'var(--t-danger)', fontSize:'0.82rem', fontWeight:600, marginBottom:'0.75rem' }}>⚠ {createError}</p>}

              <button onClick={createClass} disabled={!newClassName.trim() || !schoolName || creatingClass}
                style={{ width:'100%', padding:'0.85rem', borderRadius:'var(--t-r-sm)', border:'none', background:(!newClassName.trim()||!schoolName||creatingClass)?'#CCC':'linear-gradient(135deg, var(--t-mid), var(--t-eucalyptus))', color:'white', fontSize:'0.95rem', fontWeight:700, cursor:(!newClassName.trim()||!schoolName||creatingClass)?'not-allowed':'pointer', letterSpacing:'0.04em', transition:'all 0.2s' }}>
                {creatingClass ? 'Creating…' : '+ Create Class'}
              </button>

              {classCreated && <p style={{ marginTop:'0.6rem', fontSize:'0.85rem', color:'#2e7d32', fontWeight:600, textAlign:'center' }}>✓ Class created successfully!</p>}

              {/* NSW Curriculum */}
              {(displaySubject === 'science' || displaySubject === 'maths' || displaySubject === 'pdhpe' || displaySubject === 'english') && (
                <div style={{ marginTop:'1.25rem', background:sc.bg, border:`1px solid ${sc.border}`, borderRadius:'var(--t-r-sm)', padding:'0.9rem 1rem' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.6rem' }}>
                    <p style={{ fontSize:'0.72rem', fontWeight:800, color:sc.accent, textTransform:'uppercase', letterSpacing:'0.07em', margin:0 }}>NSW Curriculum — Stage {newClassStage}</p>
                    <span style={{ fontSize:'0.65rem', color:'#888', fontStyle:'italic' }}>{syllabusName}</span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                    {outcomes.map(({ code, desc }) => (
                      <div key={code} style={{ display:'flex', gap:'0.6rem', alignItems:'flex-start' }}>
                        <span style={{ flexShrink:0, background:sc.accent, color:'white', fontSize:'0.63rem', fontWeight:800, padding:'0.15rem 0.45rem', borderRadius:'4px', letterSpacing:'0.03em', marginTop:'0.1rem', fontFamily:'monospace' }}>{code}</span>
                        <span style={{ fontSize:'0.78rem', color:'#444', lineHeight:1.45 }}>{desc}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => openTeacherInfoSheet(displaySubject, newClassStage, outcomes)}
                    style={{ marginTop:'0.75rem', display:'flex', alignItems:'center', gap:'0.5rem', background:'none', border:`1px solid ${sc.accent}`, color:sc.accent, fontSize:'0.75rem', fontWeight:700, padding:'0.4rem 0.85rem', borderRadius:'40px', cursor:'pointer', letterSpacing:'0.04em', width:'100%', justifyContent:'center' }}
                    onMouseEnter={e => { e.currentTarget.style.background=sc.accent; e.currentTarget.style.color='white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color=sc.accent; }}>
                    ↓ Teacher Information Sheet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    {/* Who's Who modal */}
    {showWwzModal && (
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }} onClick={() => setShowWwzModal(false)}>
        <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'20px', maxWidth:'480px', width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)', overflow:'hidden' }}>
          <div style={{ background:'#0A2F1F', padding:'22px 28px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <p style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)', marginBottom:'4px' }}>Class Created</p>
              <h3 style={{ fontFamily:'TarongaHeadline, DM Sans, sans-serif', fontSize:'1.3rem', fontWeight:'normal', color:'white', letterSpacing:'0.04em', margin:0 }}>Who's Who in the Zoo?</h3>
            </div>
            <button onClick={() => setShowWwzModal(false)} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'50%', width:'32px', height:'32px', color:'white', fontSize:'1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>
          <div style={{ padding:'24px 28px' }}>
            <div style={{ background:'#e8f5ed', border:'1px solid #b6d9c3', borderRadius:'10px', padding:'12px 14px', marginBottom:'16px', display:'flex', gap:'10px', alignItems:'flex-start' }}>
              <span style={{ fontSize:'18px', flexShrink:0, color:'#1B6B3A' }}>⊞</span>
              <p style={{ fontSize:'0.83rem', color:'#1a4a2a', lineHeight:1.65, margin:0 }}><strong>Students are de-identified for privacy.</strong> Each student picks an animal alias — their real name is never stored in the app.</p>
            </div>
            <p style={{ fontSize:'0.83rem', color:'#444', lineHeight:1.7, marginBottom:'14px' }}>Print the <strong>Who's Who in the Zoo</strong> document and fill it in during the excursion. Keep it secure.</p>
            <a href="/whos-who-in-the-zoo.pdf" target="_blank" rel="noopener noreferrer"
              style={{ display:'block', width:'100%', padding:'0.8rem', borderRadius:'40px', background:'linear-gradient(135deg, #1B6B3A, #0A2F1F)', color:'white', fontSize:'0.9rem', fontWeight:700, textDecoration:'none', textAlign:'center', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:'0.7rem', boxSizing:'border-box' }}>
              ⊞ Open Who's Who Document
            </a>
            <button onClick={() => { setShowWwzModal(false); setCurrentScreen('teacherDashboard'); }}
              style={{ width:'100%', padding:'0.7rem', borderRadius:'40px', border:'none', background:'#F5F3EE', color:'#555', fontSize:'0.85rem', fontWeight:600, cursor:'pointer' }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
