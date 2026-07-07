import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { openTeacherInfoSheet, EXHIBITS, SCORING, STAGE_EXPECTATIONS, NSW_OUTCOMES } from '../utils/teacherInfoSheet';

const SUBJECTS = [
  { id:'science', label:'Science',     accent:'#1A5238', light:'#E8F2EC', border:'#A8C4B2', syllabus:'Science 7-10 (2023) / Science & Technology K-6 (2017)' },
  { id:'maths',   label:'Mathematics', accent:'#0369A1', light:'#EFF6FF', border:'#BFDBFE', syllabus:'Mathematics K-10 (2022)' },
  { id:'pdhpe',   label:'PDHPE',       accent:'#7C3AED', light:'#F5F3FF', border:'#DDD6FE', syllabus:'PDHPE K-6 (2024) / PDHPE 7-10 (2024)' },
  { id:'english', label:'English',     accent:'#B45309', light:'#FFFBEB', border:'#FDE68A', syllabus:'English K-10 (2022)' },
];

const STAGES = [
  { n:1, years:'Years 1-2' },
  { n:2, years:'Years 3-4' },
  { n:3, years:'Years 5-6' },
  { n:4, years:'Years 7-8' },
  { n:5, years:'Years 9-10' },
];

const EXHIBIT_IMAGES = {
  'Chimpanzee':              '/images/chimpanzee.jpg',
  'Western Lowland Gorilla': '/images/gorilla.jpg',
  'African Lion':            '/images/lion.jpg',
  'Giraffe':                 '/images/giraffe.jpg',
  'Sumatran Tiger':          '/images/tiger.jpg',
  'Koala':                   '/images/koala.jpg',
  'Dingo':                   '/images/dingo.jpg',
  'Ring-tailed Lemur':       '/images/lemur.jpg',
  'Sea Lion':                '/images/sea-lion.jpg',
  'Asian Water Buffalo':     '/images/asian-water-buffalo.jpg',
  'Blue Mountains Bushwalk': '/images/blue-mountains-bushwalk.jpg',
  'Concert Lawn':            '/images/concert-lawn.jpg',
};

function FlipCard({ exhibit, index, stage, subject }) {
  const [flipped, setFlipped] = useState(false);
  const focus = exhibit.focusByStage?.[stage] || exhibit.focusByStage?.[4] || '';
  const tags  = exhibit.tagsByStage?.[stage]  || exhibit.tagsByStage?.[4]  || [];
  const img   = EXHIBIT_IMAGES[exhibit.name];

  return (
    <div onClick={() => setFlipped(f => !f)} style={{ perspective:'1200px', cursor:'pointer', height:'210px' }}>
      <div style={{ position:'relative', width:'100%', height:'100%', transformStyle:'preserve-3d', transition:'transform 0.55s cubic-bezier(0.35,0,0.25,1)', transform: flipped ? 'rotateY(180deg)' : 'none' }}>

        {/* Front: photo */}
        <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', borderRadius:'var(--t-r-lg)', overflow:'hidden', background:'var(--t-deep)', border:'1px solid var(--t-stone)', boxShadow:'var(--t-shadow-sm)' }}>
          {img && <img src={img} alt={exhibit.name} loading="lazy" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} onError={e => e.target.style.display='none'} />}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(7,30,20,0.02) 45%, rgba(7,30,20,0.82) 100%)' }} />
          <div style={{ position:'absolute', top:'0.5rem', right:'0.5rem', width:'22px', height:'22px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M13 5a6 6 0 00-10.5-1M3 11a6 6 0 0010.5 1M2.5 1v3h3M13.5 15v-3h-3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ position:'absolute', left:'0.75rem', right:'0.75rem', bottom:'0.65rem' }}>
            <div style={{ fontSize:'0.84rem', fontWeight:800, color:'white', lineHeight:1.2, textShadow:'0 2px 6px rgba(0,0,0,0.4)' }}>{exhibit.name}</div>
          </div>
        </div>

        {/* Back: focus + tags */}
        <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', transform:'rotateY(180deg)', borderRadius:'var(--t-r-lg)', background:'white', border:'1px solid var(--t-stone)', boxShadow:'var(--t-shadow-sm)', padding:'0.85rem 0.95rem', display:'flex', flexDirection:'column', overflow:'hidden', borderTop:`3px solid ${subject.accent}` }}>
          <div style={{ fontSize:'0.76rem', fontWeight:800, color:'var(--t-deep)', lineHeight:1.2, marginBottom:'0.4rem' }}>{exhibit.name}</div>
          <div style={{ fontSize:'0.68rem', color:'var(--t-charcoal)', lineHeight:1.5, flex:1, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:6, WebkitBoxOrient:'vertical' }}>{focus}</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.25rem', marginTop:'0.5rem' }}>
            {tags.slice(0, 3).map(t => (
              <span key={t} style={{ background:subject.light, color:subject.accent, fontSize:'0.52rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.04em', padding:'0.12rem 0.5rem', borderRadius:999 }}>{t}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CurriculumAlignmentScreen() {
  const { setCurrentScreen } = useApp();
  const [subjectId, setSubjectId] = useState('science');
  const [stage, setStage]         = useState(3);

  const subject   = SUBJECTS.find(s => s.id === subjectId);
  const accent    = subject.accent;
  const exhibits  = EXHIBITS[subjectId] || [];
  const outcomes  = (NSW_OUTCOMES[subjectId]?.[stage] || []).slice(0, 3);
  const stageMeta = STAGE_EXPECTATIONS[subjectId]?.[stage];
  const domains   = SCORING[subjectId]?.domains || [];
  const stageInfo = STAGES.find(s => s.n === stage);

  return (
    <div className="lms-page">

      {/* Top bar */}
      <div className="lms-topbar">
        <div className="lms-topbar-brand">
          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'var(--t-deep)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <img src="/images/logo.png" alt="" style={{ height:'32px', width:'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>CURRICULUM ALIGNMENT</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Teacher Portal · NSW syllabus outcome mapping</p>
          </div>
        </div>
        <button onClick={() => openTeacherInfoSheet(subjectId, String(stage))}
          style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:accent, color:'white', border:'none', padding:'0.5rem 1.1rem', borderRadius:'var(--t-r-sm)', cursor:'pointer', fontSize:'0.8rem', fontWeight:700, fontFamily:'inherit', transition:'opacity 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1v9m0 0L5 7m3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Download Info Sheet (PDF)
        </button>
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

          <p className="lms-nav-group-label">Subject</p>
          <nav className="lms-nav">
            {SUBJECTS.map(s => (
              <button key={s.id} className={`lms-nav-item ${s.id === subjectId ? 'lms-nav-active' : ''}`} onClick={() => setSubjectId(s.id)}>
                <span className="lms-nav-icon"><span style={{ width:8, height:8, borderRadius:'50%', background: s.id === subjectId ? 'white' : s.accent, display:'block', opacity: s.id === subjectId ? 1 : 0.8 }} /></span>
                {s.label}
              </button>
            ))}
          </nav>

          <p className="lms-nav-group-label">Stage</p>
          <nav className="lms-nav">
            {STAGES.map(s => (
              <button key={s.n} className={`lms-nav-item ${s.n === stage ? 'lms-nav-active' : ''}`} onClick={() => setStage(s.n)}>
                <span className="lms-nav-icon" style={{ fontSize:'0.72rem', fontWeight:800 }}>{s.n}</span>
                Stage {s.n} <span style={{ fontSize:'0.66rem', opacity:0.55, marginLeft:'auto' }}>{s.years}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main */}
        <div className="lms-main">
          <div className="lms-main-inner" key={`${subjectId}-${stage}`} style={{ maxWidth:'980px', margin:'0 auto' }}>

            {/* Page title */}
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
              <div>
                <h2 className="taronga-title" style={{ margin:0, fontSize:'2rem', color:'var(--t-deep)', fontWeight:400, letterSpacing:'0.03em', lineHeight:1.1 }}>
                  {subject.label} · Stage {stage}
                </h2>
                <p style={{ margin:'0.3rem 0 0', fontSize:'0.78rem', color:'var(--t-slate)', fontWeight:500 }}>{stageInfo?.years} · {subject.syllabus}</p>
              </div>
            </div>

            {/* Outcomes: primary focus */}
            <h3 className="lms-section-heading" style={{ marginBottom:'0.6rem' }}>Outcomes Analysed</h3>
            <div style={{ display:'grid', gridTemplateColumns:`repeat(auto-fit, minmax(240px, 1fr))`, gap:'0.9rem', marginBottom:'1.75rem' }}>
              {outcomes.map(o => (
                <div key={o.code} style={{ background:'white', border:'1px solid var(--t-stone)', borderTop:`3px solid ${accent}`, borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1.05rem 1.15rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' }}>
                    <span style={{ fontSize:'0.86rem', fontWeight:800, color:accent, letterSpacing:'0.02em', fontVariantNumeric:'tabular-nums' }}>{o.code}</span>
                    <span style={{ fontSize:'0.58rem', fontWeight:700, color:'var(--t-ash)', textTransform:'uppercase', letterSpacing:'0.08em', background:'var(--t-foam)', padding:'0.12rem 0.5rem', borderRadius:999 }}>NSW Outcome</span>
                  </div>
                  <p style={{ margin:0, fontSize:'0.78rem', color:'var(--t-charcoal)', lineHeight:1.6 }}>{o.desc}</p>
                </div>
              ))}
              {outcomes.length === 0 && (
                <p style={{ fontSize:'0.78rem', color:'var(--t-ash)' }}>No outcomes available for this selection.</p>
              )}
            </div>

            {/* Stat tiles */}
            <div className="lms-stat-grid">
              <div className="lms-stat-card" style={{ borderTopColor:accent }}>
                <div className="lms-stat-val">≥ {stageMeta?.minWords ?? 10}</div>
                <div className="lms-stat-label">Minimum words per response</div>
              </div>
              <div className="lms-stat-card" style={{ borderTopColor:accent }}>
                <div className="lms-stat-val">{exhibits.length}</div>
                <div className="lms-stat-label">Exhibits mapped</div>
              </div>
              <div className="lms-stat-card" style={{ borderTopColor:accent }}>
                <div className="lms-stat-val">{outcomes.length}</div>
                <div className="lms-stat-label">Outcomes analysed</div>
              </div>
              <div className="lms-stat-card" style={{ borderTopColor:accent }}>
                <div className="lms-stat-val">15</div>
                <div className="lms-stat-label">Points per observation</div>
              </div>
            </div>

            {/* Exhibits */}
            <h3 className="lms-section-heading">
              Exhibits &amp; Learning Focus
              <span style={{ fontSize:'0.7rem', fontWeight:600, color:'var(--t-ash)' }}>Tap a card to flip</span>
            </h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(155px, 1fr))', gap:'0.7rem', marginBottom:'1.75rem' }}>
              {exhibits.map((e, i) => (
                <FlipCard key={`${e.name}-${subjectId}-${stage}`} exhibit={e} index={i} stage={stage} subject={subject} />
              ))}
            </div>

            {/* Assessment */}
            <div className="lms-form-section" style={{ marginBottom:'1.5rem' }}>
              <h3 className="lms-section-heading" style={{ marginBottom:'0.2rem' }}>How Responses Are Scored</h3>
              <p style={{ fontSize:'0.72rem', color:'var(--t-slate)', margin:'0 0 0.9rem' }}>Three domains, 5 points each. AI-assisted with full teacher override.</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'0.5rem 1.5rem' }}>
                {domains.map(d => (
                  <div key={d.label} style={{ display:'flex', gap:'0.85rem', padding:'0.75rem 0', borderTop:'1px solid var(--t-foam)', alignItems:'flex-start' }}>
                    <span style={{ flexShrink:0, width:28, height:28, borderRadius:'8px', background:subject.light, color:accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.78rem', fontWeight:800 }}>{d.icon}</span>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--t-deep)', lineHeight:1.3 }}>{d.label} <span style={{ fontSize:'0.66rem', fontWeight:600, color:'var(--t-ash)' }}>· 5 pts</span></div>
                      <div style={{ fontSize:'0.72rem', color:'var(--t-slate)', lineHeight:1.5, marginTop:'0.1rem' }}>{d.what}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
