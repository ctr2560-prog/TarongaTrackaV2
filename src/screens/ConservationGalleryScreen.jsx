import { useState } from 'react';
import { useApp } from '../context/AppContext';

const ACTIONS = [
  { cat:'school', title:'Plant a native tree or shrub',
    body:'Add native habitat to your school grounds - food and shelter for local birds, insects and lizards.',
    challenge:'Plant a Tree', points:75 },
  { cat:'school', title:'Design a wildlife crossing',
    body:'Research a local species, then design and model a corridor or road crossing that would help it move safely.',
    challenge:'Wildlife Crossing Design', points:80 },
  { cat:'school', title:'Run a biodiversity audit',
    body:'Count and photograph the species living around your school - then compare again next term to see what changes.',
    challenge:'Biodiversity Audit', points:60 },
  { cat:'school', title:'Organise a clean-up day',
    body:'A litter clean-up around the school grounds keeps rubbish out of waterways - and out of sea lion habitat.',
    challenge:'Clean Up School', points:50 },
  { cat:'school', title:'Create wildlife awareness posters',
    body:'Turn what students learned at the zoo into posters that teach the rest of the school.',
    challenge:'Wildlife Posters', points:40 },
  { cat:'school', title:'Keep a nature journal',
    body:'A week of illustrated observations of local wildlife - the same skills students used at the zoo, applied at home base.',
    challenge:'Nature Journal', points:35 },
  { cat:'home', title:'Build a bird bath or water station',
    body:'A shallow dish of water in the garden supports birds and pollinators through hot weather.' },
  { cat:'home', title:'Keep cats safe and wildlife safer',
    body:'A night-time cat curfew or a cat run protects native birds, reptiles and small mammals.' },
  { cat:'home', title:'Go plastic-free at lunch',
    body:'Swap cling wrap and single-use packaging for reusable containers - less plastic reaching marine life like our sea lions.' },
  { cat:'home', title:'Plant a pollinator patch',
    body:'A pot or garden bed of native flowering plants feeds bees, butterflies and honeyeaters all year round.' },
  { cat:'home', title:'Switch off for wildlife',
    body:'An energy switch-off hour each week - less energy use means healthier habitats for every animal students met.' },
  { cat:'home', title:'Teach your family one thing',
    body:'Students share their favourite fact or their conservation statement at home - learning that travels is learning that lasts.' },
];

const FILTERS = [
  { id:'all',    label:'All ideas' },
  { id:'school', label:'At school' },
  { id:'home',   label:'At home' },
];

export default function ConservationGalleryScreen() {
  const { setCurrentScreen } = useApp();
  const [filter, setFilter] = useState('all');

  const visible = ACTIONS.filter(a => filter === 'all' || a.cat === filter);

  return (
    <div className="lms-page">

      {/* Top bar */}
      <div className="lms-topbar">
        <div className="lms-topbar-brand">
          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'var(--t-deep)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <img src="/images/logo.png" alt="" style={{ height:'32px', width:'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>CONSERVATION ACTIONS</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · Ideas to inspire real impact</p>
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

          <p className="lms-nav-group-label">Filter</p>
          <nav className="lms-nav">
            {FILTERS.map(f => (
              <button key={f.id} className={`lms-nav-item ${f.id === filter ? 'lms-nav-active' : ''}`} onClick={() => setFilter(f.id)}>
                <span className="lms-nav-icon"><span style={{ width:8, height:8, borderRadius:'50%', background: f.id === filter ? 'white' : '#4ecb71', display:'block', opacity:0.85 }} /></span>
                {f.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main */}
        <div className="lms-main">
          <div className="lms-main-inner" style={{ maxWidth:'860px', margin:'0 auto' }}>

            <h2 className="taronga-title" style={{ margin:0, fontSize:'2rem', color:'var(--t-deep)', fontWeight:400, letterSpacing:'0.03em', lineHeight:1.1 }}>
              From Statement to Action
            </h2>
            <p style={{ margin:'0.35rem 0 1.5rem', fontSize:'0.8rem', color:'var(--t-slate)', fontWeight:500, maxWidth:'620px', lineHeight:1.6 }}>
              At the end of every session, students write a conservation statement - a real action they will take at home or school.
              Share these ideas to inspire them. School actions link to class challenges, earning points for your school on the leaderboard.
            </p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'0.9rem', marginBottom:'1.5rem' }}>
              {visible.map(a => (
                <div key={a.title} style={{ background:'white', border:'1px solid var(--t-stone)', borderTop:`3px solid ${a.cat === 'school' ? 'var(--t-mid)' : '#B45309'}`, borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1.1rem 1.2rem', display:'flex', flexDirection:'column', transition:'transform 0.18s, box-shadow 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--t-shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--t-shadow-sm)'; }}>
                  <span style={{ alignSelf:'flex-start', fontSize:'0.56rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', padding:'0.16rem 0.6rem', borderRadius:999, marginBottom:'0.55rem',
                    background: a.cat === 'school' ? 'var(--t-foam)' : '#FFFBEB',
                    color: a.cat === 'school' ? 'var(--t-mid)' : '#B45309' }}>
                    {a.cat === 'school' ? 'At school' : 'At home'}
                  </span>
                  <div style={{ fontSize:'0.88rem', fontWeight:700, color:'var(--t-deep)', lineHeight:1.3, marginBottom:'0.3rem' }}>{a.title}</div>
                  <p style={{ margin:0, fontSize:'0.75rem', color:'var(--t-charcoal)', lineHeight:1.6, flex:1 }}>{a.body}</p>
                  {a.challenge && (
                    <div style={{ marginTop:'0.7rem', paddingTop:'0.6rem', borderTop:'1px solid var(--t-foam)', fontSize:'0.68rem', fontWeight:700, color:'var(--t-mid)' }}>
                      Class challenge: {a.challenge} · {a.points} pts
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ textAlign:'center', padding:'0.25rem 1rem 1.5rem' }}>
              <p style={{ margin:0, fontSize:'0.76rem', color:'var(--t-slate)' }}>
                Submit completed school actions through Class Challenges on your dashboard to earn points for your school.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
