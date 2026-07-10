import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const PHASES = [
  {
    id: 'before',
    label: 'Before Your Visit',
    steps: [
      {
        id: 'create-account',
        title: 'Create a teacher account',
        body: 'Visit the Taronga Tracka teacher portal and sign in with your school email address. A magic link will be sent to your inbox — click it to verify and access your dashboard.',
      },
      {
        id: 'setup-class',
        title: 'Set up your class',
        body: 'Create your class in the teacher portal, selecting the stage and key learning area for your visit. Your class join code is generated instantly.',
      },
      {
        id: 'setup-devices',
        title: 'Set up devices',
        body: 'Decide whether students will use department devices or Taronga Tracka devices on the day. Taronga Tracka devices can be booked via the Devices tab in your teacher portal.',
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
        id: 'navigate-app',
        title: 'Open Taronga Tracka',
        body: 'Taronga Tracka devices: open the Taronga Tracka app. Department devices: open a browser and go to tarongatracka.com.au',
        url: 'tarongatracka.com.au',
      },
      {
        id: 'join-class',
        title: 'Join your class',
        body: 'Students tap Join a Class and enter the student code for your class. The code is shown on the right-hand side of your class card in My Classes on your teacher dashboard.',
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

function openTeacherGuidePdf() {
  const origin = window.location.origin;
  let stepNo = 0;

  const phasesHtml = PHASES.map(phase => {
    const stepsHtml = phase.steps.map(step => {
      stepNo += 1;
      const n = stepNo;
      return `
      <div class="step">
        <div class="step-num">${n}</div>
        <div class="step-body">
          <div class="step-title">${step.title}</div>
          <p class="step-text">${step.body}</p>
          ${step.url ? `<div class="step-url">${step.url}</div>` : ''}
          ${step.important ? `<p class="step-important">&#9888; ${step.important}</p>` : ''}
          ${step.tip ? `<p class="step-tip">&#10022; ${step.tip}</p>` : ''}
        </div>
      </div>`;
    }).join('');

    return `
    <div class="phase">
      <div class="phase-hd">
        <span class="phase-label">${phase.label}</span>
        <div class="phase-rule"></div>
      </div>
      ${stepsHtml}
    </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Taronga Tracka — Teacher Guide</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
@font-face {
  font-family:'TarongaHeadline';
  src:url('${origin}/images/TarongaHeadline-Regular.ttf') format('truetype');
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{margin:14mm}
body{font-family:'DM Sans',system-ui,sans-serif;font-size:10pt;line-height:1.65;color:#1A1A17;background:#EDEAE3;-webkit-font-smoothing:antialiased}
.page{max-width:760px;margin:28px auto;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 20px 70px rgba(7,30,20,0.15)}

.print-btn{position:fixed;top:18px;right:18px;background:#1A5238;color:#fff;border:none;padding:9px 20px;border-radius:40px;font-family:'DM Sans',sans-serif;font-size:8pt;font-weight:700;letter-spacing:0.06em;cursor:pointer;z-index:999;box-shadow:0 4px 16px rgba(0,0,0,0.18)}
.print-btn:hover{opacity:0.88}

/* Header */
.hdr{background:#071E14;padding:32px 44px 24px;position:relative;overflow:hidden}
.hdr-glow{position:absolute;top:-80px;right:-80px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(46,125,85,0.35) 0%,transparent 70%);pointer-events:none}
.hdr-inner{display:flex;align-items:center;justify-content:space-between;gap:20px;position:relative}
.hdr-left{display:flex;align-items:center;gap:14px}
.hdr-logo{height:44px;width:auto}
.hdr-brand-name{font-family:'TarongaHeadline','DM Sans',sans-serif;font-size:14pt;font-weight:normal;color:#fff;letter-spacing:0.07em;line-height:1.1}
.hdr-brand-sub{font-size:7.5pt;color:#A8C4B2;letter-spacing:0.1em;margin-top:3px;text-transform:uppercase}
.hdr-badge{display:inline-block;background:#1A5238;color:#fff;font-size:7pt;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;padding:5px 14px;border-radius:40px}

/* Body */
.body{padding:36px 44px 44px}
.intro{font-size:9.5pt;color:#4A4A42;line-height:1.7;background:#F0F7F3;border-left:3px solid #1A5238;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:28px}

/* Phase */
.phase{margin-bottom:28px}
.phase-hd{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.phase-label{font-size:6.5pt;font-weight:800;color:#1A5238;text-transform:uppercase;letter-spacing:0.2em;white-space:nowrap}
.phase-rule{flex:1;height:1px;background:#E8F2EC}

/* Step */
.step{display:flex;gap:14px;margin-bottom:16px}
.step:last-child{margin-bottom:0}
.step-num{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#1A5238,#2E7D55);color:#fff;font-size:9pt;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.step-body{flex:1;padding-top:3px}
.step-title{font-size:9.5pt;font-weight:700;color:#071E14;margin-bottom:3px}
.step-text{font-size:8.5pt;color:#4A4A42;line-height:1.6;margin:0}
.step-url{margin-top:6px;font-family:'TarongaHeadline','DM Sans',sans-serif;font-size:11pt;color:#1A5238;letter-spacing:0.03em}
.step-important{margin-top:5px;font-size:8pt;color:#B45309;font-weight:600;line-height:1.5}
.step-tip{margin-top:5px;font-size:8pt;color:#1A5238;font-weight:600;line-height:1.5}

/* Footer */
.ftr{background:#071E14;padding:18px 44px;display:flex;align-items:center;justify-content:space-between}
.ftr-left{display:flex;align-items:center;gap:12px}
.ftr-logo{height:26px;width:auto;opacity:0.9}
.ftr-div{width:1px;height:18px;background:rgba(168,196,178,0.3)}
.ftr-name{font-family:'TarongaHeadline','DM Sans',sans-serif;font-size:9.5pt;color:#fff;letter-spacing:0.05em}
.ftr-right{font-size:7.5pt;color:#4A7C61;text-align:right;line-height:1.6}

@media print{
  body{background:#fff}
  .page{max-width:none;margin:0;border-radius:0;box-shadow:none}
  .print-btn{display:none!important}
  .hdr,.step-num,.hdr-glow,.hdr-badge,.intro{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .step{page-break-inside:avoid}
  .phase{page-break-inside:avoid}
}
</style>
</head>
<body>
<button class="print-btn" onclick="window.print()">Print / Save PDF</button>
<div class="page">
  <div class="hdr">
    <div class="hdr-glow"></div>
    <div class="hdr-inner">
      <div class="hdr-left">
        <img src="${origin}/images/logo.png" alt="Taronga" class="hdr-logo" onerror="this.style.display='none'">
        <div>
          <div class="hdr-brand-name">TARONGA TRACKA</div>
          <div class="hdr-brand-sub">Teacher Guide · Running Your Session</div>
        </div>
      </div>
      <span class="hdr-badge">Taronga Zoo Sydney</span>
    </div>
  </div>

  <div class="body">
    <p class="intro">This guide walks you through every step of running a Taronga Tracka session — from setting up your class before the visit through to submitting your class at the end. Tick off each step as you go using the interactive checklist in the teacher portal.</p>
    ${phasesHtml}
  </div>

  <div class="ftr">
    <div class="ftr-left">
      <img src="${origin}/images/logo.png" alt="" class="ftr-logo" onerror="this.style.display='none'">
      <div class="ftr-div"></div>
      <span class="ftr-name">Taronga Tracka</span>
    </div>
    <div class="ftr-right">Teacher Guide · Taronga Zoo Sydney<br>taronga.org.au · Education Programs</div>
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (win) setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export default function TeacherGuideScreen() {
  const { setCurrentScreen } = useApp();
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  });
  const [showUrl, setShowUrl] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch { /* ignore */ }
  }, [done]);

  const toggle = (id) => setDone(d => ({ ...d, [id]: !d[id] }));
  const doneCount = ALL_STEPS.filter(s => done[s.id]).length;
  const allDone = doneCount === ALL_STEPS.length;

  let stepNo = 0;

  return (
    <div className="lms-page" style={{ position:'relative' }}>

      {/* Fullscreen URL overlay */}
      {showUrl && (
        <div onClick={() => setShowUrl(false)}
          style={{ position:'fixed', inset:0, background:'#071E14', zIndex:9999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          <p style={{ color:'rgba(168,196,178,0.7)', fontSize:'0.8rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:'1.5rem' }}>Open in browser</p>
          <div className="taronga-title" style={{ fontSize:'clamp(3.5rem, 10vw, 9rem)', color:'white', letterSpacing:'0.04em', fontWeight:400, textAlign:'center', padding:'0 1rem', lineHeight:1.1 }}>
            tarongatracka.com.au
          </div>
          <p style={{ color:'rgba(255,255,255,0.25)', fontSize:'0.8rem', marginTop:'2.5rem', letterSpacing:'0.06em' }}>Tap anywhere to close</p>
        </div>
      )}

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
              <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', flexShrink:0 }}>
                <button onClick={openTeacherGuidePdf}
                  style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'var(--t-deep)', color:'white', border:'none', borderRadius:8, padding:'0.42rem 0.9rem', fontSize:'0.73rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.02em' }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1v9m0 0L5 7m3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Save as PDF
                </button>
                <div style={{ fontSize:'0.74rem', fontWeight:800, color: allDone ? 'var(--t-mid)' : 'var(--t-slate)', background: allDone ? '#D6E9DD' : 'var(--t-foam)', padding:'0.35rem 0.85rem', borderRadius:999 }}>
                  {allDone ? 'Ready to track!' : `${doneCount} / ${ALL_STEPS.length}`}
                </div>
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
                          {step.url && (
                            <button onClick={e => { e.stopPropagation(); setShowUrl(true); }}
                              style={{ marginTop:'0.55rem', display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'var(--t-deep)', color:'white', border:'none', borderRadius:8, padding:'0.42rem 0.9rem', fontSize:'0.73rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.02em' }}>
                              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M5 5.5h6M5 8h6M5 10.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                              Show URL fullscreen
                            </button>
                          )}
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
