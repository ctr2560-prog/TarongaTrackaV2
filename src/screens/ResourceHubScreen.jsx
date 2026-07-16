import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DECKS, SUBJ_META } from '../data/slideDecks';
import SlidePlayer from '../components/SlidePlayer';

// ─── Static resources ─────────────────────────────────────────────────────────

const STATIC_RESOURCES = [
  {
    category: 'Getting Started',
    color: '#2E7D55',
    items: [
      { title:'Teacher Setup Guide',       desc:'Step-by-step instructions for creating a class, generating codes, and running the activity.', type:'PDF' },
      { title:'Student Quick-Start Card',  desc:'One-page printable handout for students — how to join, observe, and earn badges.',            type:'PDF' },
      { title:'ZooSnooz Facilitation Guide', desc:'Night mode setup, managing NFC stations, and interaction instrument overview.',             type:'PDF' },
    ],
  },
  {
    category: 'Curriculum Links',
    color: '#0369A1',
    items: [
      { title:'NSW Science & Technology K-6',   desc:'Activity mapping to ST2-4LW-S and ST3-4LW-S outcomes.',                  type:'DOC' },
      { title:'Stage 4 Biology: Ecosystems',    desc:'NESA outcomes for ecosystem interactions, adaptations, and biodiversity.', type:'DOC' },
      { title:'Stage 5 Evolution & Adaptation', desc:'Extended tasks and ZooSnooz mission alignment for Stage 5.',              type:'DOC' },
      { title:'English Literacy Integration',   desc:'Observation writing scaffolds, sentence starters, and vocabulary lists.', type:'DOC' },
    ],
  },
  {
    category: 'Assessment',
    color: '#D97706',
    items: [
      { title:'Observation Rubric (Stage 2–3)', desc:'Behaviour, detail, and writing scoring criteria for younger students.', type:'PDF' },
      { title:'Observation Rubric (Stage 4–5)', desc:'Extended rubric for senior secondary with NESA alignment.',            type:'PDF' },
      { title:'Interpreting the Dashboard',     desc:'How to read quiz scores, sub-scores, and class progress data.',         type:'PDF' },
    ],
  },
  {
    category: 'Classroom Activities',
    color: '#7C3AED',
    items: [
      { title:'Pre-Visit Discussion Cards',    desc:'Stimulus questions and animal images to build prior knowledge.',             type:'PDF' },
      { title:'Post-Visit Reflection Booklet', desc:'Structured tasks linking observations back to curriculum content.',          type:'PDF' },
    ],
  },
];

// ─── SVG icons ────────────────────────────────────────────────────────────────

const IcoPlay = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
    <polygon points="4,2 14,8 4,14"/>
  </svg>
);
const IcoSlides = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="2" width="14" height="10" rx="1.5"/><path d="M5 15h6M8 12v3"/>
  </svg>
);
const IcoBack = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 3L5 8l5 5"/>
  </svg>
);
const IcoDownload = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v8M5 7l3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1"/>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResourceHubScreen() {
  const { setCurrentScreen } = useApp();
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStage,   setFilterStage]   = useState('all');
  const [filterTiming,  setFilterTiming]  = useState('all');
  const [activeDeck,    setActiveDeck]    = useState(null);

  function goBack() {
    if (window.history.state?.screen) window.history.back();
    else setCurrentScreen('teacherDashboard');
  }

  const visibleDecks = DECKS.filter(d => {
    if (filterSubject !== 'all' && d.subject !== filterSubject) return false;
    if (filterStage   !== 'all' && d.stage !== Number(filterStage)) return false;
    if (filterTiming  !== 'all' && d.timing !== filterTiming) return false;
    return true;
  });

  function pillBtn(active, onClick, label) {
    return (
      <button key={label} onClick={onClick} style={{
        padding:'0.38rem 0.9rem', borderRadius:999, border: active ? 'none' : '1.5px solid rgba(255,255,255,0.18)',
        background: active ? 'white' : 'transparent', color: active ? '#071E14' : 'rgba(255,255,255,0.75)',
        fontSize:'0.77rem', fontWeight: active ? 700 : 500, cursor:'pointer', whiteSpace:'nowrap',
        transition:'all 0.15s', fontFamily:'inherit',
      }}>{label}</button>
    );
  }

  return (
    <>
      {/* Slide player overlay */}
      {activeDeck && <SlidePlayer deck={activeDeck} onClose={() => setActiveDeck(null)} />}

      <div style={{ position:'fixed', inset:0, background:'#F0EDE6', display:'flex', flexDirection:'column', fontFamily:'var(--t-font)', overflowY:'auto' }}>

        {/* ── Sticky topbar ── */}
        <div style={{ position:'sticky', top:0, zIndex:90, background:'#071E14', display:'flex', alignItems:'center', gap:'0.9rem', padding:'0.65rem 1.2rem', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={goBack} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'white', width:32, height:32, borderRadius:999, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <IcoBack />
          </button>
          <img src="/images/logo.png" alt="Taronga" style={{ height:24, opacity:0.9 }} />
          <span style={{ fontWeight:800, color:'white', fontSize:'0.92rem', letterSpacing:'0.02em' }}>Resource Hub</span>
        </div>

        {/* ── Dark hero ── */}
        <div style={{ background:'linear-gradient(160deg, #071E14 0%, #0D3322 55%, #1A5238 100%)', padding:'2.25rem 1.5rem 2.75rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:60, background:'linear-gradient(to top, rgba(26,82,56,0.3), transparent)', pointerEvents:'none' }} />

          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.45rem', background:'rgba(46,125,85,0.2)', border:'1px solid rgba(46,125,85,0.4)', borderRadius:999, padding:'0.28rem 0.85rem', marginBottom:'1rem' }}>
            <IcoPlay />
            <span style={{ color:'#7EC89A', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.06em' }}>LIVE IN-APP PRESENTATIONS</span>
          </div>

          <h1 className="taronga-title" style={{ color:'white', fontSize:'clamp(1.8rem,5vw,2.8rem)', margin:'0 0 0.55rem', lineHeight:1.15 }}>
            Pre & Post-Visit Lessons
          </h1>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.9rem', maxWidth:500, margin:'0 auto 1.75rem', lineHeight:1.65 }}>
            32 interactive slide decks — tap any card to present live in the classroom. No downloads, no switching apps.
          </p>

          <div style={{ display:'flex', justifyContent:'center', gap:'1.75rem', flexWrap:'wrap' }}>
            {[['32','Slide Decks'],['4','KLA Subjects'],['4','NSW Stages'],['Pre+Post','Visit Timing']].map(([n,l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div className="taronga-title" style={{ color:'#7EC89A', fontSize:'1.5rem', lineHeight:1 }}>{n}</div>
                <div style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.68rem', marginTop:'0.2rem', letterSpacing:'0.04em', textTransform:'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sticky filter bar ── */}
        <div style={{ position:'sticky', top:49, zIndex:80, background:'#1A5238', padding:'0.6rem 1.2rem', display:'flex', flexDirection:'column', gap:'0.5rem', borderBottom:'2px solid rgba(255,255,255,0.08)' }}>

          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
            <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.08em', minWidth:38, textTransform:'uppercase' }}>When</span>
            <div style={{ display:'flex', gap:'0.28rem' }}>
              {pillBtn(filterTiming==='all',  () => setFilterTiming('all'),  'All')}
              {pillBtn(filterTiming==='pre',  () => setFilterTiming('pre'),  'Pre-Visit')}
              {pillBtn(filterTiming==='post', () => setFilterTiming('post'), 'Post-Visit')}
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
            <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.08em', minWidth:38, textTransform:'uppercase' }}>KLA</span>
            <div style={{ display:'flex', gap:'0.28rem', flexWrap:'wrap' }}>
              {pillBtn(filterSubject==='all', () => setFilterSubject('all'), 'All')}
              {Object.entries(SUBJ_META).map(([k, v]) => (
                <button key={k} onClick={() => setFilterSubject(filterSubject===k ? 'all' : k)} style={{
                  padding:'0.38rem 0.9rem', borderRadius:999,
                  border: filterSubject===k ? 'none' : '1.5px solid rgba(255,255,255,0.18)',
                  background: filterSubject===k ? v.color : 'transparent',
                  color:'rgba(255,255,255,0.85)', fontSize:'0.77rem',
                  fontWeight: filterSubject===k ? 700 : 500,
                  cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s', fontFamily:'inherit',
                }}>{v.label}</button>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
            <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.08em', minWidth:38, textTransform:'uppercase' }}>Stage</span>
            <div style={{ display:'flex', gap:'0.28rem', flexWrap:'wrap' }}>
              {pillBtn(filterStage==='all', () => setFilterStage('all'), 'All Stages')}
              {[2,3,4,5].map(s => pillBtn(filterStage===String(s), () => setFilterStage(filterStage===String(s)?'all':String(s)), `Stage ${s}`))}
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.7rem' }}>
              {visibleDecks.length} deck{visibleDecks.length!==1?'s':''} shown
            </span>
            {(filterSubject!=='all'||filterStage!=='all'||filterTiming!=='all') && (
              <button onClick={() => { setFilterSubject('all'); setFilterStage('all'); setFilterTiming('all'); }}
                style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'0.7rem', textDecoration:'underline', fontFamily:'inherit' }}>
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ── Deck grid ── */}
        <div style={{ padding:'1.4rem 1.2rem 0.75rem' }}>
          {visibleDecks.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem 1rem', color:'#6B6B62' }}>
              <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#A8B4AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:'0.75rem' }}>
                <circle cx="22" cy="22" r="16"/><path d="M34 34l8 8M16 22h12M22 16v12"/>
              </svg>
              <p style={{ margin:0, fontWeight:600 }}>No decks match your filters.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'0.9rem' }}>
              {visibleDecks.map(deck => <DeckCard key={deck.id} deck={deck} onOpen={() => setActiveDeck(deck)} />)}
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div style={{ margin:'1.75rem 1.2rem 0', display:'flex', alignItems:'center', gap:'0.7rem' }}>
          <div style={{ flex:1, height:1, background:'rgba(7,30,20,0.12)' }} />
          <span style={{ color:'#6B6B62', fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', whiteSpace:'nowrap' }}>Additional Resources</span>
          <div style={{ flex:1, height:1, background:'rgba(7,30,20,0.12)' }} />
        </div>

        {/* ── Static resources ── */}
        <div style={{ padding:'1.1rem 1.2rem 2rem', display:'flex', flexDirection:'column', gap:'1.3rem' }}>
          {STATIC_RESOURCES.map(cat => (
            <div key={cat.category}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.45rem', marginBottom:'0.55rem' }}>
                <div style={{ width:3, height:15, borderRadius:2, background:cat.color, flexShrink:0 }} />
                <span style={{ color:'#0A2F1F', fontSize:'0.75rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em' }}>{cat.category}</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                {cat.items.map(item => (
                  <div key={item.title}
                    onClick={() => alert(`"${item.title}" — available soon from the Taronga Education team.`)}
                    style={{ background:'white', borderRadius:9, border:'1px solid rgba(7,30,20,0.09)', padding:'0.7rem 0.9rem', display:'flex', alignItems:'center', gap:'0.8rem', cursor:'pointer', transition:'box-shadow 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.45rem', marginBottom:'0.1rem' }}>
                        <span style={{ fontWeight:700, color:'#0A2F1F', fontSize:'0.83rem' }}>{item.title}</span>
                        <span style={{ background:`${cat.color}18`, color:cat.color, border:`1px solid ${cat.color}40`, borderRadius:999, padding:'0.07rem 0.42rem', fontSize:'0.58rem', fontWeight:700, flexShrink:0 }}>{item.type}</span>
                      </div>
                      <p style={{ margin:0, fontSize:'0.74rem', color:'#6B6B62', lineHeight:1.5 }}>{item.desc}</p>
                    </div>
                    <div style={{ color:'#A8B4AC', flexShrink:0 }}><IcoDownload /></div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background:'linear-gradient(135deg,rgba(26,82,56,0.06),rgba(46,125,85,0.08))', border:'1px solid rgba(46,125,85,0.18)', borderRadius:12, padding:'1.1rem', textAlign:'center' }}>
            <div style={{ fontWeight:700, color:'#0A2F1F', marginBottom:'0.25rem', fontSize:'0.88rem' }}>Need something specific?</div>
            <p style={{ color:'#6B6B62', fontSize:'0.78rem', margin:'0 0 0.7rem', lineHeight:1.65 }}>Our Education team can provide additional resources, custom curriculum mapping, or support for your excursion.</p>
            <a href="mailto:education@taronga.org.au" style={{ display:'inline-block', background:'#1A5238', color:'white', padding:'0.48rem 1.1rem', borderRadius:999, fontSize:'0.78rem', fontWeight:700, textDecoration:'none' }}>
              education@taronga.org.au
            </a>
          </div>
        </div>

      </div>
    </>
  );
}

// ─── Deck card ────────────────────────────────────────────────────────────────

function DeckCard({ deck, onOpen }) {
  const sm = SUBJ_META[deck.subject];
  const [hovered, setHovered] = useState(false);
  const timingColor = deck.timing === 'pre' ? '#0369A1' : '#BE185D';
  const slideCount = deck.slides.length;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:'white', borderRadius:14,
        border:`1.5px solid ${hovered ? sm.color : 'rgba(7,30,20,0.1)'}`,
        overflow:'hidden', display:'flex', flexDirection:'column',
        transition:'all 0.18s',
        boxShadow: hovered ? `0 8px 28px ${sm.color}25` : '0 1px 4px rgba(0,0,0,0.06)',
        cursor:'pointer',
      }}
      onClick={onOpen}
    >
      {/* Animal image */}
      <div style={{ height:85, position:'relative', overflow:'hidden', background:'#0D2B1C' }}>
        <img src={`/images/${deck.img}`} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 30%', opacity:0.65, transition:'transform 0.4s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(7,30,20,0.2) 0%, rgba(7,30,20,0.6) 100%)' }} />

        {/* Play overlay on hover */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', opacity: hovered ? 1 : 0, transition:'opacity 0.2s' }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:sm.color, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 16px ${sm.color}80` }}>
            <IcoPlay />
          </div>
        </div>

        <div style={{ position:'absolute', top:7, left:7, background:'rgba(7,30,20,0.7)', backdropFilter:'blur(3px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:999, padding:'0.18rem 0.5rem', fontSize:'0.6rem', fontWeight:800, color:'white', letterSpacing:'0.04em' }}>
          STAGE {deck.stage}
        </div>
        <div style={{ position:'absolute', top:7, right:7, background:timingColor, borderRadius:999, padding:'0.18rem 0.5rem', fontSize:'0.6rem', fontWeight:800, color:'white', letterSpacing:'0.04em' }}>
          {deck.timing === 'pre' ? 'PRE-VISIT' : 'POST-VISIT'}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:'0.8rem 0.85rem', flex:1, display:'flex', flexDirection:'column', gap:'0.35rem' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'0.28rem', background:sm.light, border:`1px solid ${sm.border}`, borderRadius:999, padding:'0.16rem 0.55rem', alignSelf:'flex-start' }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:sm.color }} />
          <span style={{ fontSize:'0.62rem', fontWeight:800, color:sm.color, letterSpacing:'0.04em' }}>{sm.label.toUpperCase()}</span>
        </div>

        <div style={{ fontWeight:700, color:'#0A2F1F', fontSize:'0.85rem', lineHeight:1.35, flex:1 }}>{deck.title}</div>

        <div style={{ display:'flex', alignItems:'center', gap:'0.3rem', color:'#6B6B62' }}>
          <IcoSlides />
          <span style={{ fontSize:'0.7rem' }}>{slideCount} slides</span>
        </div>

        <button onClick={e => { e.stopPropagation(); onOpen(); }}
          style={{ marginTop:'0.25rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', background: hovered ? sm.color : '#0A2F1F', color:'white', border:'none', borderRadius:8, padding:'0.52rem 0', fontSize:'0.76rem', fontWeight:700, cursor:'pointer', width:'100%', transition:'background 0.18s', fontFamily:'inherit' }}>
          <IcoPlay /> Present Now
        </button>
      </div>
    </div>
  );
}
