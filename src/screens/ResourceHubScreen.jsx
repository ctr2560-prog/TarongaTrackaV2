import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../context/AppContext';
import { SUBJ_META, toCanvaEmbedUrl } from '../data/subjectMeta';

// ─── SVG icons ────────────────────────────────────────────────────────────────

const IcoPlay = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
    <polygon points="4,2 14,8 4,14"/>
  </svg>
);
const IcoBack = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 3L5 8l5 5"/>
  </svg>
);
const IcoClose = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l10 10M13 3L3 13"/>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResourceHubScreen() {
  const { setCurrentScreen } = useApp();
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStage,   setFilterStage]   = useState('all');
  const [filterTiming,  setFilterTiming]  = useState('all');
  const [activeLesson,  setActiveLesson]  = useState(null);
  const [lessons,       setLessons]       = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'prePostLinks'));
        const items = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(l => l.canvaUrl);
        if (!cancelled) setLessons(items);
      } catch (e) { console.error('Failed to load pre/post lessons:', e); }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  function goBack() {
    if (window.history.state?.screen) window.history.back();
    else setCurrentScreen('teacherDashboard');
  }

  const stagesPresent = [...new Set(lessons.map(l => l.stage))].sort((a, b) => a - b);
  const subjectsPresent = [...new Set(lessons.map(l => l.subject))];

  const visibleLessons = lessons.filter(l => {
    if (filterSubject !== 'all' && l.subject !== filterSubject) return false;
    if (filterStage   !== 'all' && l.stage !== Number(filterStage)) return false;
    if (filterTiming  !== 'all' && l.timing !== filterTiming) return false;
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
      {/* Canva embed overlay */}
      {activeLesson && <CanvaEmbedPlayer lesson={activeLesson} onClose={() => setActiveLesson(null)} />}

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
            Tap any card to present the lesson live in the classroom. No downloads, no switching apps.
          </p>

          <div style={{ display:'flex', justifyContent:'center', gap:'1.75rem', flexWrap:'wrap' }}>
            {[[String(lessons.length),'Lessons'],[String(subjectsPresent.length),'KLA Subjects'],[String(stagesPresent.length),'NSW Stages'],['Pre+Post','Visit Timing']].map(([n,l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div className="taronga-title" style={{ color:'#7EC89A', fontSize:'1.5rem', lineHeight:1 }}>{n}</div>
                <div style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.68rem', marginTop:'0.2rem', letterSpacing:'0.04em', textTransform:'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sticky filter bar ── */}
        {lessons.length > 0 && (
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
                {subjectsPresent.map(k => {
                  const v = SUBJ_META[k];
                  if (!v) return null;
                  return (
                    <button key={k} onClick={() => setFilterSubject(filterSubject===k ? 'all' : k)} style={{
                      padding:'0.38rem 0.9rem', borderRadius:999,
                      border: filterSubject===k ? 'none' : '1.5px solid rgba(255,255,255,0.18)',
                      background: filterSubject===k ? v.color : 'transparent',
                      color:'rgba(255,255,255,0.85)', fontSize:'0.77rem',
                      fontWeight: filterSubject===k ? 700 : 500,
                      cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s', fontFamily:'inherit',
                    }}>{v.label}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
              <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.08em', minWidth:38, textTransform:'uppercase' }}>Stage</span>
              <div style={{ display:'flex', gap:'0.28rem', flexWrap:'wrap' }}>
                {pillBtn(filterStage==='all', () => setFilterStage('all'), 'All Stages')}
                {stagesPresent.map(s => pillBtn(filterStage===String(s), () => setFilterStage(filterStage===String(s)?'all':String(s)), `Stage ${s}`))}
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.7rem' }}>
                {visibleLessons.length} lesson{visibleLessons.length!==1?'s':''} shown
              </span>
              {(filterSubject!=='all'||filterStage!=='all'||filterTiming!=='all') && (
                <button onClick={() => { setFilterSubject('all'); setFilterStage('all'); setFilterTiming('all'); }}
                  style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'0.7rem', textDecoration:'underline', fontFamily:'inherit' }}>
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Lesson grid ── */}
        <div style={{ padding:'1.4rem 1.2rem 0.75rem' }}>
          {loading ? (
            <div style={{ textAlign:'center', padding:'3rem 1rem', color:'#6B6B62' }}>Loading lessons…</div>
          ) : lessons.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem 1rem', color:'#6B6B62' }}>
              <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#A8B4AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:'0.75rem' }}>
                <circle cx="22" cy="22" r="16"/><path d="M34 34l8 8M16 22h12M22 16v12"/>
              </svg>
              <p style={{ margin:0, fontWeight:600 }}>No pre/post lessons have been published yet.</p>
              <p style={{ margin:'0.3rem 0 0', fontSize:'0.78rem' }}>Check back soon — the Taronga Education team is adding these.</p>
            </div>
          ) : visibleLessons.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem 1rem', color:'#6B6B62' }}>
              <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#A8B4AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:'0.75rem' }}>
                <circle cx="22" cy="22" r="16"/><path d="M34 34l8 8M16 22h12M22 16v12"/>
              </svg>
              <p style={{ margin:0, fontWeight:600 }}>No lessons match your filters.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'0.9rem' }}>
              {visibleLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} onOpen={() => setActiveLesson(lesson)} />)}
            </div>
          )}
        </div>

        {/* ── Contact card ── */}
        <div style={{ padding:'1.1rem 1.2rem 2rem' }}>
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

// ─── Lesson card ──────────────────────────────────────────────────────────────

function LessonCard({ lesson, onOpen }) {
  const sm = SUBJ_META[lesson.subject] || SUBJ_META.science;
  const [hovered, setHovered] = useState(false);
  const timingColor = lesson.timing === 'pre' ? '#0369A1' : '#BE185D';

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
      {/* Header band */}
      <div style={{ height:85, position:'relative', overflow:'hidden', background:`linear-gradient(160deg, #0D2B1C 0%, ${sm.color} 140%)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {lesson.image && (
          <>
            <img src={lesson.image} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 30%', opacity:0.65, transition:'transform 0.4s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(7,30,20,0.2) 0%, rgba(7,30,20,0.6) 100%)' }} />
          </>
        )}
        <div style={{ opacity: hovered ? 1 : 0.55, transition:'opacity 0.2s', position:'relative' }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.95)', display:'flex', alignItems:'center', justifyContent:'center', color:sm.color, boxShadow:'0 4px 16px rgba(0,0,0,0.25)' }}>
            <IcoPlay />
          </div>
        </div>

        <div style={{ position:'absolute', top:7, left:7, background:'rgba(7,30,20,0.7)', backdropFilter:'blur(3px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:999, padding:'0.18rem 0.5rem', fontSize:'0.6rem', fontWeight:800, color:'white', letterSpacing:'0.04em' }}>
          STAGE {lesson.stage}
        </div>
        <div style={{ position:'absolute', top:7, right:7, background:timingColor, borderRadius:999, padding:'0.18rem 0.5rem', fontSize:'0.6rem', fontWeight:800, color:'white', letterSpacing:'0.04em' }}>
          {lesson.timing === 'pre' ? 'PRE-VISIT' : 'POST-VISIT'}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:'0.8rem 0.85rem', flex:1, display:'flex', flexDirection:'column', gap:'0.35rem' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'0.28rem', background:sm.light, border:`1px solid ${sm.border}`, borderRadius:999, padding:'0.16rem 0.55rem', alignSelf:'flex-start' }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:sm.color }} />
          <span style={{ fontSize:'0.62rem', fontWeight:800, color:sm.color, letterSpacing:'0.04em' }}>{sm.label.toUpperCase()}</span>
        </div>

        <div style={{ fontWeight:700, color:'#0A2F1F', fontSize:'0.85rem', lineHeight:1.35 }}>{lesson.title || `${sm.label} — ${lesson.timing === 'pre' ? 'Pre' : 'Post'}-Visit Lesson`}</div>

        {lesson.description && (
          <div style={{ display:'flex', alignItems:'flex-start', gap:'0.3rem', color:'#6B6B62', flex:1 }}>
            <span style={{ fontSize:'0.72rem', lineHeight:1.5 }}>{lesson.description}</span>
          </div>
        )}

        <button onClick={e => { e.stopPropagation(); onOpen(); }}
          style={{ marginTop:'0.25rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', background: hovered ? sm.color : '#0A2F1F', color:'white', border:'none', borderRadius:8, padding:'0.52rem 0', fontSize:'0.76rem', fontWeight:700, cursor:'pointer', width:'100%', transition:'background 0.18s', fontFamily:'inherit' }}>
          <IcoPlay /> Present Now
        </button>
      </div>
    </div>
  );
}

// ─── Canva embed overlay ────────────────────────────────────────────────────────

function CanvaEmbedPlayer({ lesson, onClose }) {
  const sm = SUBJ_META[lesson.subject] || SUBJ_META.science;
  const embedUrl = toCanvaEmbedUrl(lesson.canvaUrl);

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'#071E14', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.9rem', padding:'0.65rem 1.2rem', background:'#0A2F1F', borderBottom:'1px solid rgba(255,255,255,0.08)', flexShrink:0 }}>
        <button onClick={onClose} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'white', width:32, height:32, borderRadius:999, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <IcoClose />
        </button>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'0.28rem', background:sm.light, border:`1px solid ${sm.border}`, borderRadius:999, padding:'0.16rem 0.55rem' }}>
          <span style={{ fontSize:'0.62rem', fontWeight:800, color:sm.color, letterSpacing:'0.04em' }}>{sm.label.toUpperCase()} · STAGE {lesson.stage} · {lesson.timing === 'pre' ? 'PRE-VISIT' : 'POST-VISIT'}</span>
        </div>
        <span style={{ color:'white', fontWeight:700, fontSize:'0.85rem', flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lesson.title}</span>
        <a href={lesson.canvaUrl} target="_blank" rel="noreferrer"
          style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.72rem', fontWeight:600, textDecoration:'none', flexShrink:0 }}>
          Open in Canva ↗
        </a>
      </div>
      <div style={{ flex:1, minHeight:0, position:'relative' }}>
        <iframe
          src={embedUrl}
          title={lesson.title || 'Canva lesson'}
          allow="fullscreen"
          allowFullScreen
          style={{ width:'100%', height:'100%', border:'none' }}
        />
      </div>
    </div>
  );
}
