import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { animals } from '../data/animals';

const CONSERVATION = {
  chimpanzee: { label:'Endangered',           color:'#DC2626' },
  gorilla:    { label:'Critically Endangered', color:'#DC2626' },
  giraffe:    { label:'Vulnerable',            color:'#D97706' },
  lion:       { label:'Vulnerable',            color:'#D97706' },
  tiger:      { label:'Critically Endangered', color:'#DC2626' },
  seal:       { label:'Least Concern',         color:'#059669' },
  dingo:      { label:'Vulnerable',            color:'#D97706' },
  buffalo:    { label:'Near Threatened',       color:'#D97706' },
};

export default function PublicAnimalScreen() {
  const { setCurrentScreen } = useApp();
  const [selectedId, setSelectedId] = useState(null);
  const [found,      setFound]      = useState(new Set());
  const [pts,        setPts]        = useState(0);

  const selected = animals.find(a => a.id === selectedId);

  const discover = (animal) => {
    setSelectedId(animal.id);
    if (!found.has(animal.id)) {
      setFound(prev => new Set([...prev, animal.id]));
      setPts(p => p + 20);
    }
  };

  // ── Animal detail view ─────────────────────────────────────────────────────
  if (selected) {
    const status = CONSERVATION[selected.id];
    const stageQ = selected.questions?.[0];
    const fact   = stageQ?.fact || stageQ?.stageVariants?.[4];

    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,var(--jungle-deep),var(--jungle-mid))', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'0.85rem 1.25rem', display:'flex', alignItems:'center', gap:'0.75rem', flexShrink:0 }}>
          <button onClick={() => setSelectedId(null)} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'0.45rem 1rem', borderRadius:999, fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>
            ← All animals
          </button>
          {found.has(selected.id) && (
            <span style={{ background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.3)', color:'#4ADE80', borderRadius:999, padding:'0.25rem 0.75rem', fontSize:'0.72rem', fontWeight:700 }}>✓ Discovered</span>
          )}
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'0 1.25rem 2rem' }}>
          <div style={{ maxWidth:480, margin:'0 auto', display:'flex', flexDirection:'column', gap:'1.25rem' }}>

            {/* Hero */}
            <div style={{ borderRadius:20, overflow:'hidden', aspectRatio:'16/9', backgroundImage:`url(${selected.image})`, backgroundSize:'cover', backgroundPosition:'center', position:'relative', boxShadow:'0 12px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 45%,rgba(7,30,20,0.92) 100%)' }} />
              {status && (
                <div style={{ position:'absolute', top:12, right:12, background:'rgba(0,0,0,0.65)', border:`1px solid ${status.color}50`, borderRadius:999, padding:'0.2rem 0.7rem' }}>
                  <span style={{ color:status.color, fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>{status.label}</span>
                </div>
              )}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'1.25rem' }}>
                <h1 style={{ color:'white', margin:'0 0 0.2rem', fontSize:'1.5rem', fontWeight:800, textShadow:'0 2px 12px rgba(0,0,0,0.8)' }}>{selected.name}</h1>
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.78rem', fontStyle:'italic' }}>{selected.scientificName}</div>
              </div>
            </div>

            {/* Discovery badge */}
            {!found.has(selected.id) && (
              <button onClick={() => discover(selected)} style={{ background:'linear-gradient(135deg,var(--sunset-orange),var(--earth-clay))', color:'white', border:'none', padding:'1rem', borderRadius:16, fontSize:'1rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.1em', boxShadow:'0 6px 20px rgba(180,90,40,0.45)' }}>
                + Discover This Animal
              </button>
            )}
            {found.has(selected.id) && (
              <div style={{ background:'rgba(74,222,128,0.12)', border:'1px solid rgba(74,222,128,0.3)', borderRadius:16, padding:'0.85rem 1rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <div style={{ width:42, height:42, borderRadius:10, backgroundImage:`url(images/badge-${selected.id}.png)`, backgroundSize:'cover', backgroundPosition:'center', flexShrink:0 }} />
                <div>
                  <div style={{ color:'#4ADE80', fontWeight:700 }}>{selected.name} discovered!</div>
                  <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.75rem' }}>+20 exploration points</div>
                </div>
              </div>
            )}

            {/* Observation prompt */}
            <div style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:16, padding:'1rem 1.25rem' }}>
              <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>Look &amp; Notice</div>
              <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'0.9rem', lineHeight:1.65, margin:0 }}>{selected.observationPrompt || `Watch the ${selected.name} carefully. What do you notice?`}</p>
            </div>

            {/* Fact card */}
            {fact && (
              <div style={{ background:'rgba(46,125,85,0.15)', border:'1px solid rgba(46,125,85,0.3)', borderRadius:16, padding:'1rem 1.25rem' }}>
                <div style={{ color:'#4ADE80', fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>Did you know?</div>
                <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'0.88rem', lineHeight:1.65, margin:0 }}>{fact}</p>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  // ── Animal grid ────────────────────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,var(--jungle-deep) 0%,var(--jungle-mid) 100%)', display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Header */}
      <div style={{ padding:'0.85rem 1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => setCurrentScreen('publicEntry')} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'0.45rem 1rem', borderRadius:999, fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>
          ← Back
        </button>
        <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
          {pts > 0 && <span style={{ background:'rgba(245,158,11,0.2)', border:'1px solid rgba(245,158,11,0.4)', color:'#F59E0B', borderRadius:999, padding:'0.25rem 0.75rem', fontSize:'0.78rem', fontWeight:700 }}>⭐ {pts} pts</span>}
          <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.8rem' }}>{found.size}/{animals.length} found</span>
        </div>
      </div>

      <div style={{ padding:'1rem 1.25rem 0.5rem', flexShrink:0 }}>
        <h2 style={{ color:'white', margin:0, fontSize:'1.2rem', fontWeight:800 }}>Animals at Taronga</h2>
        <p style={{ color:'rgba(255,255,255,0.55)', margin:'0.2rem 0 0', fontSize:'0.82rem' }}>Tap an animal to discover it</p>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'0.75rem 1.25rem 2rem' }}>
        <div className="discovery-grid">
          {animals.map(animal => {
            const isFound = found.has(animal.id);
            return (
              <div key={animal.id} className={`discovery-card${isFound ? ' dc-found' : ''}`} onClick={() => discover(animal)} style={{ cursor:'pointer' }}>
                <div className="discovery-card-img" style={{ backgroundImage:`url(${animal.image})` }} />
                <div className="discovery-card-overlay" />
                <div className="discovery-card-body">
                  <div className="dc-name">{animal.name}</div>
                  <div className="dc-scientific">{animal.scientificName}</div>
                  <div style={{ marginTop:'0.4rem' }}>
                    {isFound
                      ? <span className="dc-pill dc-pill-found">✓ Discovered</span>
                      : <span className="dc-pill dc-pill-far">Tap to discover</span>
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
