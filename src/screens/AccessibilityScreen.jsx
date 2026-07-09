import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const NEEDS = [
  {
    id: 'mobility', label: 'Mobility', accent:'#0369A1',
    blurb: 'Wheelchairs, walkers, prams and anyone who finds hills hard work.',
    app: [
      { t:'Unlocks work from the path', d:'students never need to enter a viewing area to unlock an animal' },
      { t:'Pair up', d:'a classmate\'s device can unlock anywhere they can\'t reach' },
      { t:'No time limits', d:'every activity waits' },
    ],
    zoo: [
      { t:'One no-go corner', d:'the Moore Park aviary corner and seal viewing area are stairs only - view the seals from the accessible side' },
      { t:'The big hill', d:'ISL past the giraffes to the buffalo - plan your route downhill' },
      { t:'Sky Safari is not running', d:'allow extra time between levels' },
      { t:'Free wheelchair hire', d:'Top Plaza Shop; mobility scooters with ID, weather dependent' },
      { t:'Facilities', d:'accessible toilets at both entrances, Food Market, Nura Diya and Mid Shop; MLAK Adult Change Room near First Aid' },
      { t:'After rain', d:'bitumen paths get slick - take care' },
    ],
    writing: [
      { t:'Write anywhere', d:'a bench, a lawn, or back at the ISL' },
      { t:'Group scribe', d:'one student types while the group composes' },
    ],
  },
  {
    id: 'sensory', label: 'Sensory', accent:'#7C3AED',
    blurb: 'Students who find noise, crowds or unpredictability overwhelming.',
    app: [
      { t:'No timers, no sudden sounds', d:'students can pause anytime' },
      { t:'Share a device', d:'working in pairs lowers the load' },
      { t:'Headphones are fine', d:'no activity needs audio' },
    ],
    zoo: [
      { t:'Quiet spaces', d:'Concert Lawn, the lawn near Free Flight Birds, and the Rainforest Trail' },
      { t:'Base camp', d:'the ISL is a reliable spot for regulation breaks' },
      { t:'Loud shows', d:'Seals for the Wild and Free Flight Birds get crowded - sit on the edge or plan around them' },
      { t:'Loud lunch', d:'pre-order Food Market food via the QR code and skip the queue' },
      { t:'Sunflower lanyards recognised', d:'headphones and fidget tools welcome zoo-wide' },
      { t:'Quietest days', d:'Monday to Wednesday' },
    ],
    writing: [
      { t:'Dictate it', d:'a peer or teacher can type the student\'s spoken observation' },
      { t:'Short is fine', d:'one strong sentence counts' },
    ],
  },
  {
    id: 'eald', label: 'EAL/D', accent:'#B45309',
    blurb: 'Students learning English as an additional language or dialect.',
    app: [
      { t:'Look first, write second', d:'understanding builds from the real animal before English is needed' },
      { t:'Sentence starters on every task', d:'plus hints matched to stage' },
      { t:'Word counts never block', d:'every submission goes through' },
    ],
    zoo: [
      { t:'Preview the vocabulary', d:'use Who\'s Who in the Zoo before the visit' },
      { t:'Pair strategically', d:'discussion in any language strengthens the English writing' },
      { t:'Visual signage', d:'exhibit signs are diagram-rich comprehension anchors' },
    ],
    writing: [
      { t:'Ideas over accuracy', d:'use your score override to reward growth' },
      { t:'Bilingual drafting', d:'think and talk in home language, write in English' },
    ],
  },
  {
    id: 'anxiety', label: 'Anxiety & confidence', accent:'#0F766E',
    blurb: 'Students who worry about getting it wrong or being seen to struggle.',
    app: [
      { t:'Nicknames, not names', d:'no student is identifiable on the leaderboard' },
      { t:'Private responses', d:'only you see individual writing and scores' },
      { t:'Nothing fails', d:'quizzes and observations always move forward' },
      { t:'Wobble-proof', d:'a logged-out student restores from Class Insights with nothing lost' },
    ],
    zoo: [
      { t:'Anchor buddy', d:'a consistent partner or small group all day' },
      { t:'Known safe point', d:'agree a meeting spot - the ISL works well' },
      { t:'Help is easy', d:'Information Desk staff and volunteers expect questions' },
    ],
    writing: [
      { t:'No blank page', d:'sentence starters begin every response' },
      { t:'No sharing required', d:'the app never asks students to read work aloud' },
    ],
  },
  {
    id: 'learning', label: 'Learning support', accent:'#1A5238',
    blurb: 'Students who benefit from smaller steps, more structure and more time.',
    app: [
      { t:'One task at a time', d:'no menus to navigate at the exhibit' },
      { t:'Set a lower stage', d:'simpler tasks, questions and hints for the class' },
      { t:'Group roles', d:'spotter, recorder and reader sharing one device' },
      { t:'Your marking wins', d:'every AI score is overridable' },
    ],
    zoo: [
      { t:'Fewer, done well', d:'a great day doesn\'t need every animal' },
      { t:'Visual schedule', d:'arrive, animals, lunch, animals, wrap up' },
      { t:'More adults per group', d:'keeps pace and focus manageable' },
    ],
    writing: [
      { t:'One sentence is a win', d:'word counts guide, never block' },
      { t:'Scribe it', d:'a peer or adult types while the student composes aloud' },
    ],
  },
  {
    id: 'medical', label: 'Medical', accent:'#BE185D',
    blurb: 'Health care plans, allergies, fatigue and everything in between.',
    app: [
      { t:'Leave and return', d:'restore from Class Insights with progress intact' },
      { t:'Nothing expires', d:'tasks can be finished later in the day' },
    ],
    zoo: [
      { t:'First Aid', d:'near the Taronga Food Market, with the MLAK Adult Change Room beside it' },
      { t:'Water', d:'nine refill stations across the zoo - pack bottles' },
      { t:'Companion Card', d:'the support person enters free' },
      { t:'Assistance dogs welcome', d:'accredited dogs with 48 hours notice - 02 9969 2777' },
      { t:'Cashless zoo', d:'bring a card for purchases' },
    ],
    writing: [
      { t:'Quality over coverage', d:'one or two strong observations beat a rushed lap' },
    ],
  },
];

const UNIVERSAL = [
  'Animal nicknames, not real names',
  'Sentence starters on every task',
  'Word counts guide, never gate',
  'Pairs and groups welcome',
  'Full teacher score override',
  'Progress is never lost',
];

const CHECKLIST = [
  { id:'tell',    label:'Tell Taronga about access needs ahead of your visit (02 9969 2777 · tz@zoo.nsw.gov.au) - assistance dogs need 48 hours notice' },
  { id:'route',   label:'Download the accessibility map and plan your route (downhill where possible, quiet spaces marked)' },
  { id:'hire',    label:'Reserve a wheelchair or mobility scooter if needed - free manual wheelchair hire at the Top Plaza Shop' },
  { id:'pack',    label:'Pack medical plans, medications, sensory tools and Sunflower lanyards' },
  { id:'brief',   label:'Brief your adult helpers on quiet spaces, meeting points and each student\'s plan' },
  { id:'lunch',   label:'Plan lunch - pre-order at the Food Market via QR code to skip the loud queue' },
];

const STORAGE_KEY = 'trackaAccessChecklist';

export default function AccessibilityScreen() {
  const { setCurrentScreen } = useApp();
  const [needId, setNeedId] = useState('mobility');
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch { /* ignore */ }
  }, [done]);

  const need = NEEDS.find(n => n.id === needId);

  const Column = ({ title, items, divider }) => (
    <div style={{ padding:'1.2rem 1.4rem', borderLeft: divider ? '1px solid var(--t-foam)' : 'none' }}>
      <div style={{ fontSize:'0.64rem', fontWeight:800, color:'var(--t-slate)', textTransform:'uppercase', letterSpacing:'0.14em', paddingBottom:'0.6rem', borderBottom:'1px solid var(--t-stone)', marginBottom:'0.2rem' }}>{title}</div>
      {items.map((item, i) => (
        <div key={item.t} style={{ padding:'0.65rem 0', borderTop: i === 0 ? 'none' : '1px solid var(--t-foam)' }}>
          <span style={{ fontSize:'0.77rem', color:'var(--t-deep)', fontWeight:700, lineHeight:1.6 }}>{item.t}.</span>{' '}
          <span style={{ fontSize:'0.76rem', color:'var(--t-slate)', lineHeight:1.6 }}>{item.d}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="lms-page">

      {/* Top bar */}
      <div className="lms-topbar">
        <div className="lms-topbar-brand">
          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'var(--t-deep)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <img src="/images/logo.png" alt="" style={{ height:'32px', width:'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>ACCESSIBILITY &amp; INCLUSION</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · Every student tracks</p>
          </div>
        </div>
      </div>

      <div className="lms-two-col">

        {/* Sidebar */}
        <div className="lms-sidebar">
          <p className="lms-nav-group-label">Navigation</p>
          <nav className="lms-nav">
            <button className="lms-nav-item" onClick={() => setCurrentScreen('teacherDashboard')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span> Dashboard
            </button>
            <button className="lms-nav-item" onClick={() => setCurrentScreen('excursionPlan')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 2h10v12H3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M6 5h4M6 8h4M6 11h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg></span> Excursion Pack
            </button>
            <button className="lms-nav-item" onClick={() => setCurrentScreen('teacherMap')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M6 2L2 4v10l4-2 4 2 4-2V2l-4 2-4-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg></span> Zoo Map
            </button>
          </nav>

          <p className="lms-nav-group-label">Who's in your class?</p>
          <nav className="lms-nav">
            {NEEDS.map(n => (
              <button key={n.id} className={`lms-nav-item ${n.id === needId ? 'lms-nav-active' : ''}`} onClick={() => setNeedId(n.id)}>
                <span className="lms-nav-icon"><span style={{ width:8, height:8, borderRadius:'50%', background: n.id === needId ? 'white' : n.accent, display:'block', opacity:0.85 }} /></span>
                {n.label}
              </button>
            ))}
          </nav>

          <p className="lms-nav-group-label">Taronga Resources</p>
          <nav className="lms-nav">
            <button className="lms-nav-item" onClick={() => window.open('/taronga-accessibility-toolkit.pdf', '_blank')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1v9m0 0L5 7m3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span> Accessibility Toolkit
            </button>
            <button className="lms-nav-item" onClick={() => window.open('/taronga-accessibility-map.pdf', '_blank')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1v9m0 0L5 7m3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span> Accessibility Map
            </button>
          </nav>
        </div>

        {/* Main */}
        <div className="lms-main">
          <div className="lms-main-inner" style={{ maxWidth:'940px', margin:'0 auto' }}>

            {/* Title */}
            <h2 className="taronga-title" style={{ margin:0, fontSize:'2rem', color:'var(--t-deep)', fontWeight:400, letterSpacing:'0.03em', lineHeight:1.1 }}>
              Every Student Tracks
            </h2>
            <p style={{ margin:'0.35rem 0 1.25rem', fontSize:'0.8rem', color:'var(--t-slate)', fontWeight:500, maxWidth:'620px', lineHeight:1.6 }}>
              Pick who's in your class and see the supports across the app, the zoo and the writing. Grounded in Taronga's Accessibility Toolkit, developed with Autism Spectrum Australia.
            </p>

            {/* Support map */}
            <div key={needId} className="animate-fade-in-up" style={{ marginBottom:'1.75rem' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:'0.85rem', flexWrap:'wrap', marginBottom:'0.9rem' }}>
                <h3 className="taronga-title" style={{ margin:0, fontSize:'1.5rem', color:need.accent, fontWeight:400, letterSpacing:'0.03em' }}>{need.label}</h3>
                <span style={{ fontSize:'0.78rem', color:'var(--t-slate)' }}>{need.blurb}</span>
              </div>
              <div className="acc-grid" style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', overflow:'hidden' }}>
                <Column title="In the app"     items={need.app} />
                <Column title="At the zoo"     items={need.zoo} divider />
                <Column title="In the writing" items={need.writing} divider />
              </div>
            </div>

            {/* Universal supports */}
            <div style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1rem 1.4rem', marginBottom:'1.75rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', flexWrap:'wrap' }}>
                <span style={{ fontSize:'0.72rem', fontWeight:800, color:'var(--t-deep)', whiteSpace:'nowrap' }}>Built in for everyone</span>
                {UNIVERSAL.map(u => (
                  <span key={u} style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.72rem', color:'var(--t-charcoal)' }}>
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="var(--t-mid)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {u}
                  </span>
                ))}
              </div>
            </div>

            <style>{`
              @media (max-width: 860px) {
                .acc-grid { grid-template-columns: 1fr !important; }
                .acc-grid > div { border-left: none !important; border-top: 1px solid var(--t-foam); }
              }
            `}</style>

            {/* Pre-visit checklist */}
            <h3 className="lms-section-heading" style={{ marginBottom:'0.6rem' }}>
              Pre-visit inclusion checklist
              {Object.values(done).filter(Boolean).length > 0 && (
                <button onClick={() => setDone({})} className="lms-signout-btn" style={{ fontSize:'0.7rem', padding:'0.25rem 0.7rem' }}>Reset</button>
              )}
            </h3>
            <div style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'0.6rem 1.2rem', marginBottom:'1.5rem' }}>
              {CHECKLIST.map((c, i) => {
                const checked = !!done[c.id];
                return (
                  <div key={c.id} style={{ display:'flex', gap:'0.8rem', alignItems:'flex-start', padding:'0.7rem 0', borderTop: i === 0 ? 'none' : '1px solid var(--t-foam)' }}>
                    <button onClick={() => setDone(d => ({ ...d, [c.id]: !d[c.id] }))} aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
                      style={{ flexShrink:0, width:'22px', height:'22px', borderRadius:'7px', border:`2px solid ${checked ? 'var(--t-mid)' : 'var(--t-stone)'}`, background: checked ? 'var(--t-mid)' : 'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0, marginTop:'1px', transition:'all 0.18s' }}>
                      {checked && <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                    <span style={{ fontSize:'0.78rem', color:'var(--t-charcoal)', lineHeight:1.6, opacity: checked ? 0.55 : 1, transition:'opacity 0.2s' }}>{c.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Contact footer */}
            <div style={{ textAlign:'center', padding:'0.25rem 1rem 1.5rem' }}>
              <p style={{ margin:'0 0 0.2rem', fontSize:'0.8rem', color:'var(--t-charcoal)', fontWeight:600 }}>Every class is different - tell us what yours needs.</p>
              <p style={{ margin:0, fontSize:'0.76rem', color:'var(--t-slate)' }}>
                Taronga access questions: <a href="mailto:tz@zoo.nsw.gov.au" style={{ color:'var(--t-mid)', fontWeight:700, textDecoration:'none' }}>tz@zoo.nsw.gov.au</a> · 02 9969 2777
                &nbsp;·&nbsp; Tracka questions: <a href="mailto:education@taronga.org.au" style={{ color:'var(--t-mid)', fontWeight:700, textDecoration:'none' }}>education@taronga.org.au</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
