import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const PHASES = [
  {
    id: 'before',
    label: 'Before Your Visit',
    steps: [
      {
        id: 'setup-class',
        title: 'Set up your class',
        body: 'Create your class in the teacher portal, selecting the stage and key learning area for your visit. Your class join code is generated instantly.',
      },
      {
        id: 'setup-devices',
        title: 'Set up devices',
        body: 'Decide whether students will use department devices or Taronga Tracka devices on the day.',
        important: 'Department devices: have students log in at school on the morning of your visit.',
      },
    ],
  },
  {
    id: 'arriving',
    label: 'Arriving at the Zoo',
    steps: [
      {
        id: 'wifi',
        title: 'Connect to Taronga WiFi',
        body: 'Students connect their devices to the Taronga WiFi in the Institute of Science and Learning at the start of your session.',
      },
      {
        id: 'nicknames',
        title: 'Choose animal nicknames',
        body: 'Students, individually or in groups, select an animal as their nickname. This is how they appear on your dashboard and the leaderboard.',
      },
      {
        id: 'gps',
        title: 'Check GPS settings',
        body: 'Location services power the animal unlocks around the zoo.',
        important: 'Department devices: use the Turn Off GPS button (location services are blocked). Taronga Tracka devices: skip this step.',
      },
    ],
  },
  {
    id: 'exploring',
    label: 'Exploring the Zoo',
    steps: [
      {
        id: 'track',
        title: 'Track animals as a class cohort',
        body: 'Move around the zoo together. Arriving at an exhibit unlocks that animal - students complete the knowledge and skills activity, then the literacy activity, earning badges and points as they go.',
      },
      {
        id: 'restore',
        title: 'Restore any dropped students',
        body: 'If a student logs out or drops out for whatever reason, their progress is safe.',
        tip: 'Restore them from the Class Insights tab - they pick up right where they left off.',
      },
    ],
  },
  {
    id: 'wrapup',
    label: 'Wrapping Up',
    steps: [
      {
        id: 'complete',
        title: 'Complete the activity',
        body: 'Students tap Complete Activity at the top of their page, write a conservation statement planning a real impact back at home or school, then finish with a short feedback form.',
        tip: 'Best WiFi for this: Institute of Science and Learning, Taronga Food Market, or the Lower Zoo Entrance.',
      },
      {
        id: 'submit',
        title: 'Submit your class',
        body: 'Once all students have finished, click Submit Class in the class sidebar to unlock recommended post-learning activities.',
      },
    ],
  },
];

const ALL_STEPS = PHASES.flatMap(p => p.steps);
const STORAGE_KEY = 'trackaTeacherGuideProgress';

const LOCATIONS = [
  { id:'sydney',   label:'Taronga Zoo Sydney', available:true },
  { id:'zoosnooz', label:'ZooSnooz Sydney',    available:false },
  { id:'dubbo',    label:'Taronga Dubbo',      available:false },
  { id:'school',   label:'Your School',        available:false },
];

export default function TeacherGuideScreen() {
  const { setCurrentScreen } = useApp();
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch { /* ignore */ }
  }, [done]);

  const toggle = (id) => setDone(d => ({ ...d, [id]: !d[id] }));
  const doneCount = ALL_STEPS.filter(s => done[s.id]).length;
  const allDone = doneCount === ALL_STEPS.length;

  let stepNo = 0;

  return (
    <div className="lms-page">

      {/* Top bar */}
      <div className="lms-topbar">
        <div className="lms-topbar-brand">
          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'var(--t-deep)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <img src="/images/logo.png" alt="" style={{ height:'32px', width:'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>TEACHER GUIDE</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · Running a Taronga Tracka session</p>
          </div>
        </div>
        {doneCount > 0 && (
          <button onClick={() => setDone({})} className="lms-signout-btn">Reset</button>
        )}
      </div>

      <div className="lms-two-col">

        {/* Sidebar */}
        <div className="lms-sidebar">
          <p className="lms-nav-group-label">Navigation</p>
          <nav className="lms-nav">
            <button className="lms-nav-item" onClick={() => setCurrentScreen('teacherDashboard')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span> Dashboard
            </button>
          </nav>

          <p className="lms-nav-group-label">Location</p>
          <nav className="lms-nav">
            {LOCATIONS.map(l => (
              <button key={l.id} className={`lms-nav-item ${l.id === 'sydney' ? 'lms-nav-active' : ''}`} disabled={!l.available}
                style={ l.available ? {} : { opacity:0.45, cursor:'default' }}>
                <span className="lms-nav-icon"><span style={{ width:8, height:8, borderRadius:'50%', background: l.available ? '#4ecb71' : 'rgba(255,255,255,0.3)', display:'block' }} /></span>
                {l.label}
                {!l.available && <span style={{ fontSize:'0.56rem', opacity:0.7, marginLeft:'auto', textTransform:'uppercase', letterSpacing:'0.06em' }}>Soon</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Main */}
        <div className="lms-main">
          <div className="lms-main-inner" style={{ maxWidth:'660px', margin:'0 auto' }}>

            {/* Page title */}
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
              <div>
                <h2 className="taronga-title" style={{ margin:0, fontSize:'2rem', color:'var(--t-deep)', fontWeight:400, letterSpacing:'0.03em', lineHeight:1.1 }}>
                  Running Your Session
                </h2>
                <p style={{ margin:'0.35rem 0 0', fontSize:'0.8rem', color:'var(--t-slate)', fontWeight:500 }}>
                  Taronga Zoo Sydney · Tap each step number as you complete it
                </p>
              </div>
              <div style={{ fontSize:'0.74rem', fontWeight:800, color: allDone ? 'var(--t-mid)' : 'var(--t-slate)', background: allDone ? '#D6E9DD' : 'var(--t-foam)', padding:'0.35rem 0.85rem', borderRadius:999, flexShrink:0 }}>
                {allDone ? 'Ready to track!' : `${doneCount} / ${ALL_STEPS.length}`}
              </div>
            </div>

            {/* Timeline card */}
            <div style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1.75rem 1.9rem 1.5rem', marginBottom:'1.25rem' }}>
              {PHASES.map(phase => (
                <div key={phase.id}>
                  {/* Phase divider */}
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', margin:'0 0 1.1rem' }}>
                    <span style={{ fontSize:'0.64rem', fontWeight:800, color:'var(--t-mid)', textTransform:'uppercase', letterSpacing:'0.18em', whiteSpace:'nowrap' }}>{phase.label}</span>
                    <div style={{ flex:1, height:'1px', background:'var(--t-foam)' }} />
                  </div>

                  {phase.steps.map(step => {
                    stepNo += 1;
                    const n = stepNo;
                    const checked = !!done[step.id];
                    const isLastOverall = n === ALL_STEPS.length;
                    return (
                      <div key={step.id} style={{ display:'flex', gap:'1.1rem' }}>
                        {/* Bubble + connector */}
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                          <button onClick={() => toggle(step.id)} aria-label={checked ? 'Mark step incomplete' : 'Mark step complete'}
                            style={{ width:'36px', height:'36px', borderRadius:'50%', cursor:'pointer', padding:0, flexShrink:0,
                              border:`2px solid ${checked ? 'var(--t-mid)' : 'var(--t-stone)'}`,
                              background: checked ? 'linear-gradient(135deg, var(--t-mid), #2E7D55)' : 'white',
                              color: checked ? 'white' : 'var(--t-slate)',
                              fontSize:'0.82rem', fontWeight:800, fontFamily:'inherit',
                              display:'flex', alignItems:'center', justifyContent:'center',
                              boxShadow: checked ? '0 3px 10px rgba(26,82,56,0.3)' : 'none',
                              transition:'all 0.2s' }}>
                            {checked
                              ? <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              : n}
                          </button>
                          {!isLastOverall && (
                            <div style={{ width:'2px', flex:1, minHeight:'18px', background: checked ? 'var(--t-mid)' : 'var(--t-foam)', transition:'background 0.3s', margin:'4px 0' }} />
                          )}
                        </div>

                        {/* Content */}
                        <div style={{ flex:1, minWidth:0, paddingBottom: isLastOverall ? 0 : '1.35rem', paddingTop:'0.35rem', opacity: checked ? 0.55 : 1, transition:'opacity 0.25s' }}>
                          <div style={{ fontSize:'0.92rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.2rem' }}>{step.title}</div>
                          <p style={{ margin:0, fontSize:'0.79rem', color:'var(--t-charcoal)', lineHeight:1.6 }}>{step.body}</p>
                          {step.important && (
                            <p style={{ margin:'0.4rem 0 0', fontSize:'0.74rem', color:'#B45309', lineHeight:1.55, fontWeight:600 }}>
                              ⚠ {step.important}
                            </p>
                          )}
                          {step.tip && (
                            <p style={{ margin:'0.4rem 0 0', fontSize:'0.74rem', color:'var(--t-mid)', lineHeight:1.55, fontWeight:600 }}>
                              ✦ {step.tip}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Support footer */}
            <div style={{ textAlign:'center', padding:'0.5rem 1rem 1.5rem' }}>
              <p style={{ margin:'0 0 0.2rem', fontSize:'0.8rem', color:'var(--t-charcoal)', fontWeight:600 }}>We are with you on the day.</p>
              <p style={{ margin:0, fontSize:'0.76rem', color:'var(--t-slate)' }}>
                Questions before or during your visit? <a href="mailto:education@taronga.org.au" style={{ color:'var(--t-mid)', fontWeight:700, textDecoration:'none' }}>education@taronga.org.au</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
