import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const PHASES = [
  {
    id: 'six-weeks',
    label: '6+ Weeks Before',
    steps: [
      { id:'book',     title:'Book your excursion with Taronga Education',
        body:'Confirm your date, group size and use of the Institute of Science and Learning with the Taronga Education team.' },
      { id:'approvals', title:'Complete school approvals and risk assessment',
        body:'Follow your school\'s excursion policy for approvals, risk assessment and supervision planning. Taronga can provide venue information to support your paperwork.' },
      { id:'consent',  title:'Send parent notes and collect consent',
        body:'Include travel details, cost, what students should bring, and how Taronga Tracka will be used on the day.' },
    ],
  },
  {
    id: 'two-weeks',
    label: '2 Weeks Before',
    steps: [
      { id:'numbers',  title:'Confirm numbers and adult helpers',
        body:'Lock in final student numbers and adult supervisors in line with your school\'s supervision ratios.' },
      { id:'class',    title:'Create your class in Taronga Tracka',
        body:'Set up your class with the right stage and key learning area. Your class code is generated instantly - the Teacher Guide walks you through the rest.' },
      { id:'devices',  title:'Lock in your device plan',
        body:'Decide between department devices and Taronga Tracka devices, and plan whether students work individually or in groups.' },
    ],
  },
  {
    id: 'day-before',
    label: 'The Day Before',
    steps: [
      { id:'charge',   title:'Charge devices and note your class code',
        body:'Fully charge all devices. Write your class code somewhere handy - laminated card or the front of your folder.',
        important:'Department devices: students should log in at school on the morning of the visit.' },
      { id:'brief',    title:'Brief your adult helpers',
        body:'Share student groups, meeting points, rough timings and the best WiFi spots (Institute of Science and Learning, Taronga Food Market, Lower Zoo Entrance).' },
      { id:'weather',  title:'Check the weather and pack accordingly',
        body:'The session runs rain or shine - see the wet weather notes below.' },
    ],
  },
  {
    id: 'on-day',
    label: 'On the Day',
    steps: [
      { id:'roll',     title:'Roll, medications and travel',
        body:'Complete your usual departure checks and travel to the zoo.' },
      { id:'arrive',   title:'Start at the Institute of Science and Learning',
        body:'Connect to Taronga WiFi, set nicknames and check GPS settings. From here, follow the Teacher Guide step by step.' },
    ],
  },
];

const ALL_STEPS = PHASES.flatMap(p => p.steps);
const STORAGE_KEY = 'trackaExcursionPlanProgress';

const BRING = ['Charged devices', 'Class code (printed)', 'Hats & sunscreen', 'Water bottles', 'Medical kit & plans', 'Zip-lock bags for rain', 'Student groups list'];

export default function ExcursionPlanScreen() {
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
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>EXCURSION PLANNING PACK</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · From booking to boarding the bus</p>
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
            <button className="lms-nav-item" onClick={() => setCurrentScreen('teacherGuide')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 3h5a2 2 0 012 2v9a1.5 1.5 0 00-1.5-1.5H2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M14 3H9a2 2 0 00-2 2v9a1.5 1.5 0 011.5-1.5H14z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg></span> Teacher Guide
            </button>
            <button className="lms-nav-item" onClick={() => setCurrentScreen('teacherMap')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M6 2L2 4v10l4-2 4 2 4-2V2l-4 2-4-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg></span> Zoo Map
            </button>
          </nav>
        </div>

        {/* Main */}
        <div className="lms-main">
          <div className="lms-main-inner" style={{ maxWidth:'660px', margin:'0 auto' }}>

            {/* Page title */}
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
              <div>
                <h2 className="taronga-title" style={{ margin:0, fontSize:'2rem', color:'var(--t-deep)', fontWeight:400, letterSpacing:'0.03em', lineHeight:1.1 }}>
                  Planning Your Excursion
                </h2>
                <p style={{ margin:'0.35rem 0 0', fontSize:'0.8rem', color:'var(--t-slate)', fontWeight:500 }}>
                  Taronga Zoo Sydney · Tick each step off as you organise your visit
                </p>
              </div>
              <div style={{ fontSize:'0.74rem', fontWeight:800, color: allDone ? 'var(--t-mid)' : 'var(--t-slate)', background: allDone ? '#D6E9DD' : 'var(--t-foam)', padding:'0.35rem 0.85rem', borderRadius:999, flexShrink:0 }}>
                {allDone ? 'All organised!' : `${doneCount} / ${ALL_STEPS.length}`}
              </div>
            </div>

            {/* Timeline card */}
            <div style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1.75rem 1.9rem 1.5rem', marginBottom:'1.25rem' }}>
              {PHASES.map(phase => (
                <div key={phase.id}>
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
                        <div style={{ flex:1, minWidth:0, paddingBottom: isLastOverall ? 0 : '1.35rem', paddingTop:'0.35rem', opacity: checked ? 0.55 : 1, transition:'opacity 0.25s' }}>
                          <div style={{ fontSize:'0.92rem', fontWeight:700, color:'var(--t-deep)', marginBottom:'0.2rem' }}>{step.title}</div>
                          <p style={{ margin:0, fontSize:'0.79rem', color:'var(--t-charcoal)', lineHeight:1.6 }}>{step.body}</p>
                          {step.important && (
                            <p style={{ margin:'0.4rem 0 0', fontSize:'0.74rem', color:'#B45309', lineHeight:1.55, fontWeight:600 }}>⚠ {step.important}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Info panels */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'1rem', marginBottom:'1.25rem' }}>
              <div style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1.2rem 1.35rem' }}>
                <h3 className="lms-section-heading" style={{ marginBottom:'0.5rem' }}>Supervision</h3>
                <p style={{ margin:0, fontSize:'0.78rem', color:'var(--t-charcoal)', lineHeight:1.65 }}>
                  Follow your school's excursion policy and supervision ratios. Teachers and accompanying adults remain responsible for supervision throughout the visit - Taronga staff support the learning, not the supervision.
                </p>
              </div>
              <div style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1.2rem 1.35rem' }}>
                <h3 className="lms-section-heading" style={{ marginBottom:'0.5rem' }}>Suggested timings</h3>
                <div style={{ fontSize:'0.78rem', color:'var(--t-charcoal)', lineHeight:1.9 }}>
                  <strong>9:30</strong> Arrive, WiFi and setup at the ISL<br/>
                  <strong>10:00</strong> Explore and track as a cohort<br/>
                  <strong>12:00</strong> Lunch break<br/>
                  <strong>12:45</strong> Continue tracking<br/>
                  <strong>2:00</strong> Conservation statements and feedback
                </div>
              </div>
              <div style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1.2rem 1.35rem' }}>
                <h3 className="lms-section-heading" style={{ marginBottom:'0.5rem' }}>Wet weather</h3>
                <p style={{ margin:0, fontSize:'0.78rem', color:'var(--t-charcoal)', lineHeight:1.65 }}>
                  The session runs rain or shine. The Institute of Science and Learning is indoors, many exhibits are covered, and the app works fine in light rain - pop devices in zip-lock bags and keep tracking.
                </p>
              </div>
              <div style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1.2rem 1.35rem' }}>
                <h3 className="lms-section-heading" style={{ marginBottom:'0.6rem' }}>What to bring</h3>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                  {BRING.map(b => (
                    <span key={b} style={{ background:'var(--t-foam)', color:'var(--t-deep)', fontSize:'0.72rem', fontWeight:600, padding:'0.3rem 0.75rem', borderRadius:999 }}>{b}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Support footer */}
            <div style={{ textAlign:'center', padding:'0.5rem 1rem 1.5rem' }}>
              <p style={{ margin:0, fontSize:'0.76rem', color:'var(--t-slate)' }}>
                Booking questions or special requirements? <a href="mailto:education@taronga.org.au" style={{ color:'var(--t-mid)', fontWeight:700, textDecoration:'none' }}>education@taronga.org.au</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
