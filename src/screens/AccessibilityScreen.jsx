import { useApp } from '../context/AppContext';

const SECTIONS = [
  {
    id: 'app',
    label: 'Built into the app',
    intro: 'Taronga Tracka was designed so every student can take part - these supports are already there, no setup required.',
    items: [
      { title:'Animal nicknames',        body:'Students choose an animal identity rather than using their own name - a low-stakes way for shy or anxious students to participate on the leaderboard.' },
      { title:'Sentence starters',       body:'Every writing task includes stage-appropriate sentence starters and hints, so no student faces a blank page.' },
      { title:'Minimum words are a guide, not a gate', body:'Word counts set expectations but never block a submission. Accept drawings and dictated responses alongside written work for students who need it.' },
      { title:'Work in pairs or groups', body:'Students can share one device and one nickname - ideal for students who benefit from peer support or where devices are limited.' },
      { title:'Full teacher override',   body:'Every AI-assisted score can be reviewed and changed in your portal, so you can assess each student against their own goals.' },
      { title:'Nobody loses progress',   body:'If a student drops out, restore them from the Class Insights tab and they continue exactly where they left off.' },
    ],
  },
  {
    id: 'zoo',
    label: 'At the zoo',
    intro: 'Practical considerations for moving your class around Taronga Zoo Sydney.',
    items: [
      { title:'Accessible routes',       body:'The zoo is built on a hill - plan your route downhill where possible. The Sky Safari and internal paths provide accessible options; ask the Education team for the best route for wheelchairs or limited mobility.' },
      { title:'Quiet spaces',            body:'The Institute of Science and Learning makes a good base for students who need a break. Quieter exhibit areas work well for regulating between busy stops.' },
      { title:'Sensory considerations',  body:'Some exhibits are loud, dark or crowded at peak times. Preview the route with the Zoo Map and plan alternatives for students with sensory sensitivities.' },
      { title:'GPS-free participation',  body:'If GPS is unavailable or unsuitable for a student, animals can still be explored - students can work alongside a peer whose device unlocks the exhibits.' },
    ],
  },
  {
    id: 'eald',
    label: 'Supporting EAL/D learners',
    intro: 'Ways to make the language demands of the day manageable and meaningful.',
    items: [
      { title:'Preview the vocabulary',  body:'Use the Who\'s Who in the Zoo guide before your visit to pre-teach animal names and key terms students will meet on the day.' },
      { title:'Observation before writing', body:'Every task starts with looking, not reading - students build understanding from the real animal before any written response is asked for.' },
      { title:'Pair strategically',      body:'Partner EAL/D learners with supportive peers on a shared device - discussion in any language strengthens the written response.' },
      { title:'Value every response',    body:'Use your score override to recognise growth in English alongside content understanding.' },
    ],
  },
  {
    id: 'plan',
    label: 'Plan with us',
    intro: 'Every class is different - tell us what yours needs.',
    items: [
      { title:'Talk to us before your visit', body:'Contact the Education team about access requirements, medical plans or adjustments - the earlier we know, the more we can prepare.' },
      { title:'Bring your usual supports',    body:'Whatever works at school - visual schedules, communication devices, support staff - works at the zoo too. Taronga Tracka sits alongside them, not instead of them.' },
    ],
  },
];

export default function AccessibilityScreen() {
  const { setCurrentScreen } = useApp();

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
          </nav>

          <p className="lms-nav-group-label">Sections</p>
          <nav className="lms-nav">
            {SECTIONS.map(s => (
              <button key={s.id} className="lms-nav-item" onClick={() => document.getElementById(`acc-${s.id}`)?.scrollIntoView({ behavior:'smooth', block:'start' })}>
                <span className="lms-nav-icon"><span style={{ width:8, height:8, borderRadius:'50%', background:'#4ecb71', display:'block', opacity:0.8 }} /></span>
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main */}
        <div className="lms-main">
          <div className="lms-main-inner" style={{ maxWidth:'660px', margin:'0 auto' }}>

            <h2 className="taronga-title" style={{ margin:0, fontSize:'2rem', color:'var(--t-deep)', fontWeight:400, letterSpacing:'0.03em', lineHeight:1.1 }}>
              Every Student Tracks
            </h2>
            <p style={{ margin:'0.35rem 0 1.5rem', fontSize:'0.8rem', color:'var(--t-slate)', fontWeight:500 }}>
              Adjustments and supports so the whole class can take part - in the app, at the zoo and in the writing.
            </p>

            {SECTIONS.map(section => (
              <div key={section.id} id={`acc-${section.id}`} style={{ marginBottom:'1.5rem', scrollMarginTop:'1rem' }}>
                <div style={{ background:'white', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1.35rem 1.5rem' }}>
                  <h3 className="lms-section-heading" style={{ marginBottom:'0.2rem' }}>{section.label}</h3>
                  <p style={{ margin:'0 0 0.5rem', fontSize:'0.74rem', color:'var(--t-slate)', lineHeight:1.55 }}>{section.intro}</p>
                  {section.items.map((item, i) => (
                    <div key={item.title} style={{ display:'flex', gap:'0.8rem', padding:'0.75rem 0', borderTop: i === 0 ? '1px solid var(--t-stone)' : '1px solid var(--t-foam)', alignItems:'flex-start' }}>
                      <span style={{ flexShrink:0, marginTop:'5px', width:'7px', height:'7px', borderRadius:'50%', background:'var(--t-mid)' }} />
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:'0.83rem', fontWeight:700, color:'var(--t-deep)', lineHeight:1.3, marginBottom:'0.15rem' }}>{item.title}</div>
                        <div style={{ fontSize:'0.76rem', color:'var(--t-charcoal)', lineHeight:1.6 }}>{item.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ textAlign:'center', padding:'0.25rem 1rem 1.5rem' }}>
              <p style={{ margin:0, fontSize:'0.76rem', color:'var(--t-slate)' }}>
                Access requirements for your visit? <a href="mailto:education@taronga.org.au" style={{ color:'var(--t-mid)', fontWeight:700, textDecoration:'none' }}>education@taronga.org.au</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
