import { useState } from 'react';
import { useApp } from '../context/AppContext';

const TILES = [
  {
    id: 'booking',
    step: '01',
    title: 'Book your experience',
    front: 'Taronga Tracka devices, or self-guided with your own',
    body: 'Book Tracka devices on our live calendar (20 available each day). A self-guided visit booking with Taronga is also required for every excursion, whether you borrow devices or bring your own.',
    actions: [
      { label:'Book Tracka devices', screen:'deviceBooking' },
      { label:'Self-guided booking (own devices)', href:'https://selfguided.taronga.org.au/School/sydney', external:true },
    ],
  },
  {
    id: 'transport',
    step: '02',
    title: 'Organise transport',
    front: 'Bus, ferry or public transport to the zoo',
    body: 'Book coach or bus transport through your usual provider, or plan a public transport route - the ferry from Circular Quay lands right at the zoo. Parking and drop-off details are on Taronga\'s planning page.',
    actions: [
      { label:'Plan your visit (Taronga)', href:'https://www.taronga.org.au/learn/sydney/plan', external:true },
    ],
  },
  {
    id: 'risk',
    step: '03',
    title: 'Risk assessment',
    front: 'Venue safety information for your paperwork',
    body: 'Taronga publishes education venue safety information to support your school\'s risk assessment. Download it and attach it to your excursion paperwork.',
    actions: [
      { label:'Venue safety information (PDF)', href:'/taronga-venue-safety-2026.pdf', external:true },
    ],
  },
  {
    id: 'variation',
    step: '04',
    title: 'Variation of routine',
    front: 'Approval from your principal or delegate',
    body: 'Lodge a variation of routine with your principal or principal\'s delegate in line with the NSW Department of Education excursion policy.',
    actions: [
      { label:'DoE excursion policy', href:'https://education.nsw.gov.au/policy-library/policies/pd-2005-0290-04', external:true },
    ],
  },
  {
    id: 'consent',
    step: '05',
    title: 'Consent and medical',
    front: 'Parent notes, permissions and medical plans',
    body: 'Send parent notes covering travel, cost and how Taronga Tracka is used on the day. Collect consent and updated medical information, and pack individual health care plans for the visit.',
    actions: [],
  },
  {
    id: 'curriculum',
    step: '06',
    title: 'Align your teaching',
    front: 'Outcomes, exhibits and the teacher info sheet',
    body: 'Explore the NSW outcome mapping for your stage and subject, and download the print-ready teacher information sheet to share with your team.',
    actions: [
      { label:'Curriculum alignment', screen:'curriculumAlignment' },
    ],
  },
  {
    id: 'prepare',
    step: '07',
    title: 'Prepare for the day',
    front: 'Devices, groups and your session plan',
    body: 'Create your class, lock in your device plan and walk through the session flow. On the morning of the visit, department devices should be logged in at school.',
    actions: [
      { label:'Teacher guide', screen:'teacherGuide' },
      { label:'Zoo map', screen:'teacherMap' },
    ],
  },
  {
    id: 'weather',
    step: '08',
    title: 'Check the forecast',
    front: 'The session runs rain or shine',
    body: 'The Institute of Science and Learning is indoors and many exhibits are covered. In light rain the app keeps working - pack zip-lock bags for devices, hats and sunscreen for sunshine.',
    actions: [],
  },
];

function PlanTile({ tile, setCurrentScreen }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div onClick={() => setFlipped(f => !f)} style={{ perspective:'1200px', cursor:'pointer', height:'235px' }}>
      <div style={{ position:'relative', width:'100%', height:'100%', transformStyle:'preserve-3d', transition:'transform 0.55s cubic-bezier(0.35,0,0.25,1)', transform: flipped ? 'rotateY(180deg)' : 'none' }}>

        {/* Front */}
        <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', borderRadius:'var(--t-r-lg)', background:'white', border:'1px solid var(--t-stone)', boxShadow:'var(--t-shadow-sm)', padding:'1.2rem 1.25rem', display:'flex', flexDirection:'column' }}>
          <div className="taronga-title" style={{ fontSize:'1.9rem', color:'var(--t-mid)', lineHeight:1, marginBottom:'0.7rem' }}>{tile.step}</div>
          <div style={{ fontSize:'0.98rem', fontWeight:800, color:'var(--t-deep)', lineHeight:1.25, marginBottom:'0.35rem' }}>{tile.title}</div>
          <div style={{ fontSize:'0.76rem', color:'var(--t-slate)', lineHeight:1.55, flex:1 }}>{tile.front}</div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.66rem', fontWeight:700, color:'var(--t-mid)' }}>
            Tap for details
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M13 5a6 6 0 00-10.5-1M3 11a6 6 0 0010.5 1M2.5 1v3h3M13.5 15v-3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        {/* Back */}
        <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', transform:'rotateY(180deg)', borderRadius:'var(--t-r-lg)', background:'white', border:'1px solid var(--t-stone)', borderTop:'3px solid var(--t-mid)', boxShadow:'var(--t-shadow-sm)', padding:'1.05rem 1.15rem', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ fontSize:'0.82rem', fontWeight:800, color:'var(--t-deep)', marginBottom:'0.4rem' }}>{tile.title}</div>
          <p style={{ margin:0, fontSize:'0.72rem', color:'var(--t-charcoal)', lineHeight:1.55, flex:1, overflow:'hidden' }}>{tile.body}</p>
          {tile.actions.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginTop:'0.65rem' }}>
              {tile.actions.map(a => (
                <button key={a.label}
                  onClick={e => {
                    e.stopPropagation();
                    if (a.screen) setCurrentScreen(a.screen);
                    else if (a.external) window.open(a.href, '_blank', 'noopener');
                    else window.location.href = a.href;
                  }}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', width:'100%', padding:'0.5rem 0.7rem', borderRadius:999, border:'none', background:'var(--t-mid)', color:'white', fontSize:'0.7rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'opacity 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  {a.label}
                  {a.external && <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function ExcursionPlanScreen() {
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
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>EXCURSION PLANNING PACK</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · From booking to boarding the bus</p>
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
            <button className="lms-nav-item" onClick={() => setCurrentScreen('teacherGuide')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 3h5a2 2 0 012 2v9a1.5 1.5 0 00-1.5-1.5H2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M14 3H9a2 2 0 00-2 2v9a1.5 1.5 0 011.5-1.5H14z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg></span> Teacher Guide
            </button>
            <button className="lms-nav-item" onClick={() => setCurrentScreen('curriculumAlignment')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 3h10M3 8h10M3 13h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></span> Curriculum
            </button>
            <button className="lms-nav-item" onClick={() => setCurrentScreen('teacherMap')}>
              <span className="lms-nav-icon"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M6 2L2 4v10l4-2 4 2 4-2V2l-4 2-4-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg></span> Zoo Map
            </button>
          </nav>
        </div>

        {/* Main */}
        <div className="lms-main">
          <div className="lms-main-inner" style={{ maxWidth:'900px', margin:'0 auto' }}>

            <h2 className="taronga-title" style={{ margin:0, fontSize:'2rem', color:'var(--t-deep)', fontWeight:400, letterSpacing:'0.03em', lineHeight:1.1 }}>
              Planning Your Excursion
            </h2>
            <p style={{ margin:'0.35rem 0 1.5rem', fontSize:'0.8rem', color:'var(--t-slate)', fontWeight:500 }}>
              Taronga Zoo Sydney · Eight steps from first booking to the day itself. Tap a tile for details and links.
            </p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(215px, 1fr))', gap:'0.9rem', marginBottom:'1.75rem' }}>
              {TILES.map(tile => <PlanTile key={tile.id} tile={tile} setCurrentScreen={setCurrentScreen} />)}
            </div>

            <div style={{ textAlign:'center', padding:'0.25rem 1rem 1.5rem' }}>
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
