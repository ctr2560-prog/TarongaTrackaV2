import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../context/AppContext';

const ROTATIONS = [-2.2, 1.6, -1.1, 2.4, -1.8, 0.9, 2.0, -2.6];
const TAPES = [
  'rgba(78,203,113,0.38)',   // eucalyptus
  'rgba(251,191,36,0.42)',   // sun amber
  'rgba(56,189,248,0.35)',   // harbour blue
  'rgba(196,181,253,0.42)',  // jacaranda
];

function GalleryCard({ item, index }) {
  const rot  = ROTATIONS[index % ROTATIONS.length];
  const tape = TAPES[index % TAPES.length];
  const [hover, setHover] = useState(false);

  return (
    <div style={{ breakInside:'avoid', marginBottom:'1.75rem', animation:'gal-in 0.7s cubic-bezier(0.22,1,0.36,1) both', animationDelay:`${(index % 9) * 0.09}s` }}>
      <div style={{ animation:`gal-drift ${7 + (index % 4)}s ease-in-out infinite`, animationDelay:`${(index % 5) * 0.8}s` }}>
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            position:'relative',
            background:'#FFFEFB',
            borderRadius:'4px',
            padding:'0.85rem 0.85rem 1.05rem',
            boxShadow: hover
              ? '0 3px 6px rgba(7,30,20,0.12), 0 26px 52px rgba(7,30,20,0.3)'
              : '0 2px 4px rgba(7,30,20,0.1), 0 12px 28px rgba(7,30,20,0.16)',
            transform: hover ? 'rotate(0deg) translateY(-7px) scale(1.02)' : `rotate(${rot}deg)`,
            transition:'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s',
          }}>

          {/* Washi tape */}
          <div style={{ position:'absolute', top:'-11px', left:'50%', width:'86px', height:'24px', background:tape, transform:`translateX(-50%) rotate(${-rot * 1.4}deg)`, boxShadow:'0 1px 3px rgba(7,30,20,0.12)', backdropFilter:'blur(1px)', zIndex:2 }} />

          {item.evidenceUrl ? (
            <div style={{ overflow:'hidden', borderRadius:'2px', background:'var(--t-foam)' }}>
              <img src={item.evidenceUrl} alt={item.challengeName} loading="lazy"
                style={{ width:'100%', display:'block', transform: hover ? 'scale(1.06)' : 'scale(1)', transition:'transform 0.7s ease' }}
                onError={e => e.target.parentElement.style.display='none'} />
            </div>
          ) : (
            <div style={{ borderRadius:'2px', background:'linear-gradient(150deg, var(--t-deep) 0%, var(--t-mid) 110%)', padding:'2.2rem 1.5rem 2rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'130px', height:'130px', borderRadius:'50%', background:'radial-gradient(circle, rgba(78,203,113,0.25), transparent 70%)' }} />
              <span style={{ fontFamily:"'Instrument Serif', Georgia, serif", fontSize:'3rem', color:'rgba(255,255,255,0.28)', lineHeight:0.6, display:'block' }}>"</span>
              <p style={{ margin:'0.4rem 0 0', fontSize:'0.95rem', color:'white', lineHeight:1.65, fontFamily:"'Instrument Serif', Georgia, serif", fontStyle:'italic', position:'relative' }}>{item.note || item.challengeName}</p>
            </div>
          )}

          <div style={{ padding:'0.9rem 0.35rem 0' }}>
            {item.evidenceUrl && item.note && (
              <p style={{ margin:'0 0 0.7rem', fontSize:'0.9rem', color:'var(--t-charcoal)', lineHeight:1.6, fontFamily:"'Instrument Serif', Georgia, serif", fontStyle:'italic' }}>
                <span style={{ color:'var(--t-mid)', fontSize:'1.15em' }}>"</span>{item.note}<span style={{ color:'var(--t-mid)', fontSize:'1.15em' }}>"</span>
              </p>
            )}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.5rem', flexWrap:'wrap', borderTop:'1px solid #F2EEE6', paddingTop:'0.65rem' }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:'0.76rem', fontWeight:800, color:'var(--t-deep)', lineHeight:1.25 }}>{item.schoolName}</div>
                <div style={{ fontSize:'0.64rem', fontWeight:600, color:'var(--t-slate)', marginTop:'2px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{item.challengeName}</div>
              </div>
              <span style={{ flexShrink:0, fontSize:'0.62rem', fontWeight:800, color:'white', background:'linear-gradient(135deg, var(--t-mid), #2E7D55)', padding:'0.24rem 0.65rem', borderRadius:999, boxShadow:'0 2px 6px rgba(26,82,56,0.3)' }}>+{item.pointsValue} pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConservationGalleryScreen() {
  const { setCurrentScreen } = useApp();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'challengeSubmissions'), where('inGallery', '==', true)))
      .then(snap => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.galleryAt?.seconds || 0) - (a.galleryAt?.seconds || 0));
        setItems(list);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="lms-page" style={{ background:'#F1EDE4' }}>

      {/* Top bar */}
      <div className="lms-topbar">
        <div className="lms-topbar-brand">
          <button onClick={() => setCurrentScreen('teacherDashboard')} style={{ background:'var(--t-foam)', border:'1.5px solid var(--t-stone)', color:'var(--t-charcoal)', padding:'0.45rem 0.95rem', borderRadius:'var(--t-r-sm)', cursor:'pointer', fontSize:'0.8rem', fontWeight:600, flexShrink:0, fontFamily:'inherit' }}>
            ← Back
          </button>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>CONSERVATION IN ACTION</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Real actions from real schools</p>
          </div>
        </div>
      </div>

      {/* Scroll area */}
      <div style={{ flex:1, overflowY:'auto' }}>

        {/* Hero band */}
        <div style={{ background:'linear-gradient(165deg, var(--t-deep) 0%, #071E14 100%)', padding:'3rem 1.5rem 5.5rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-130px', left:'12%', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(78,203,113,0.18), transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-110px', right:'8%', width:'340px', height:'340px', borderRadius:'50%', background:'radial-gradient(circle, rgba(46,125,85,0.3), transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:'0.62rem', fontWeight:800, color:'#4ecb71', textTransform:'uppercase', letterSpacing:'0.28em', marginBottom:'0.8rem' }}>The Gallery Wall</div>
            <h2 className="taronga-title" style={{ margin:0, fontSize:'clamp(2.1rem,4.8vw,3.1rem)', color:'white', fontWeight:400, letterSpacing:'0.02em', lineHeight:1.1 }}>
              What Schools Are Doing<br/>for the Wild
            </h2>
            <p style={{ margin:'0.85rem auto 0', fontSize:'0.87rem', color:'rgba(168,196,178,0.9)', maxWidth:'480px', lineHeight:1.7 }}>
              Every card is a completed conservation challenge, hand-picked by the Taronga team. Your class could be up here next.
            </p>
            {!loading && items.length > 0 && (
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.45rem', marginTop:'1.2rem', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:999, padding:'0.4rem 1.1rem' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ecb71' }} />
                <span style={{ fontSize:'0.72rem', fontWeight:700, color:'rgba(255,255,255,0.85)', letterSpacing:'0.04em' }}>{items.length} action{items.length === 1 ? '' : 's'} on the wall — and counting</span>
              </div>
            )}
          </div>
        </div>

        {/* Wall — pulled up over the hero's bottom edge */}
        <div style={{ maxWidth:'1060px', margin:'-3.25rem auto 0', padding:'0 1.5rem 3.5rem', position:'relative' }}>

          {loading && (
            <p style={{ textAlign:'center', color:'var(--t-ash)', fontSize:'0.85rem', padding:'4.5rem 0' }}>Hanging the frames…</p>
          )}

          {!loading && items.length === 0 && (
            <div style={{ background:'#FFFEFB', borderRadius:'var(--t-r-lg)', boxShadow:'0 12px 32px rgba(7,30,20,0.14)', textAlign:'center', padding:'3.5rem 1.5rem', maxWidth:'560px', margin:'0 auto' }}>
              <p className="taronga-title" style={{ fontSize:'1.5rem', color:'var(--t-deep)', margin:'0 0 0.6rem', fontWeight:400 }}>The wall is waiting for its first story</p>
              <p style={{ fontSize:'0.82rem', color:'var(--t-slate)', margin:0, lineHeight:1.65, maxWidth:'400px', marginInline:'auto' }}>
                Complete a class challenge from your dashboard - approved submissions can be featured here by the Taronga team.
              </p>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="gal-masonry">
              {items.map((item, i) => <GalleryCard key={item.id} item={item} index={i} />)}
            </div>
          )}

        </div>
      </div>

      <style>{`
        .gal-masonry { column-count: 3; column-gap: 1.75rem; padding-top: 14px; }
        @media (max-width: 900px) { .gal-masonry { column-count: 2; } }
        @media (max-width: 560px) { .gal-masonry { column-count: 1; } }
        @keyframes gal-in {
          0%   { opacity: 0; transform: translateY(26px) scale(0.96); }
          100% { opacity: 1; }
        }
        @keyframes gal-drift {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
