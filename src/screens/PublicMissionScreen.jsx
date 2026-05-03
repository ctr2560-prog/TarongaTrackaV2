import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { animals } from '../data/animals';

export default function PublicMissionScreen() {
  const { setCurrentScreen } = useApp();
  const [selected, setSelected] = useState(null);
  const [phase,    setPhase]    = useState('pick'); // pick | quiz | done
  const [answer,   setAnswer]   = useState(null);
  const [revealed, setRevealed] = useState(false);

  const animal = animals.find(a => a.id === selected);
  const q = animal?.questions?.[0];
  const opts = q?.options || [];
  const correct = q?.correct ?? 0;

  const reset = () => { setSelected(null); setPhase('pick'); setAnswer(null); setRevealed(false); };

  // ── Pick screen ──────────────────────────────────────────────────────────
  if (phase === 'pick') {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,var(--jungle-deep),var(--jungle-mid))', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'0.85rem 1.25rem', flexShrink:0 }}>
          <button onClick={() => setCurrentScreen('publicAnimal')} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'0.45rem 1rem', borderRadius:999, fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>
            ← Back
          </button>
        </div>
        <div style={{ padding:'0 1.25rem 0.75rem', flexShrink:0 }}>
          <h2 style={{ color:'white', margin:0, fontSize:'1.3rem', fontWeight:800 }}>Quick Mission</h2>
          <p style={{ color:'rgba(255,255,255,0.55)', margin:'0.25rem 0 0', fontSize:'0.82rem' }}>Pick an animal and test your knowledge</p>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'0.5rem 1.25rem 2rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'0.65rem' }}>
            {animals.filter(a => a.questions?.length > 0).map(a => (
              <div key={a.id} onClick={() => { setSelected(a.id); setPhase('quiz'); }}
                style={{ borderRadius:14, overflow:'hidden', aspectRatio:'1', backgroundImage:`url(${a.image})`, backgroundSize:'cover', backgroundPosition:'center', cursor:'pointer', position:'relative', boxShadow:'0 4px 16px rgba(0,0,0,0.35)' }}>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 45%,rgba(0,0,0,0.78) 100%)' }} />
                <div style={{ position:'absolute', bottom:8, left:0, right:0, textAlign:'center', color:'white', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', padding:'0 4px' }}>{a.name.split(' ').slice(-1)[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz screen ──────────────────────────────────────────────────────────
  if (phase === 'quiz' && animal && q) {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,var(--jungle-deep),var(--jungle-mid))', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'0.85rem 1.25rem', flexShrink:0 }}>
          <button onClick={reset} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'0.45rem 1rem', borderRadius:999, fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>
            ← Animals
          </button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'0 1.25rem 2rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div style={{ maxWidth:480, margin:'0 auto', width:'100%', display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ borderRadius:16, overflow:'hidden', height:160, backgroundImage:`url(${animal.image})`, backgroundSize:'cover', backgroundPosition:'center', position:'relative', boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 40%,rgba(7,30,20,0.9) 100%)' }} />
              <div style={{ position:'absolute', bottom:12, left:14, color:'white' }}>
                <div style={{ fontWeight:800, fontSize:'1.1rem' }}>{animal.name}</div>
                <div style={{ fontSize:'0.72rem', opacity:0.65, fontStyle:'italic' }}>{animal.scientificName}</div>
              </div>
            </div>

            <div style={{ background:'rgba(255,255,255,0.1)', backdropFilter:'blur(12px)', borderRadius:16, padding:'1rem', border:'1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>Knowledge Check</div>
              <p style={{ color:'white', fontSize:'0.95rem', lineHeight:1.6, margin:0 }}>
                {q.stageVariants?.[4] || q.q || 'What do you know about this animal?'}
              </p>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {opts.map((opt, i) => {
                let bg = 'rgba(255,255,255,0.07)', border = 'rgba(255,255,255,0.15)', color = 'rgba(255,255,255,0.9)';
                if (revealed) {
                  if (i === correct)              { bg = 'rgba(74,222,128,0.2)'; border = '#4ADE80'; color = '#4ADE80'; }
                  else if (i === answer)          { bg = 'rgba(239,68,68,0.2)';  border = '#EF4444'; color = '#FCA5A5'; }
                } else if (i === answer) {
                  bg = 'rgba(255,255,255,0.14)'; border = 'rgba(255,255,255,0.5)';
                }
                return (
                  <button key={i} onClick={() => { if (!revealed) setAnswer(i); }}
                    style={{ background:bg, border:`1.5px solid ${border}`, borderRadius:12, padding:'0.85rem 1rem', color, fontSize:'0.88rem', textAlign:'left', cursor: revealed ? 'default' : 'pointer', transition:'all 0.15s', lineHeight:1.5, fontFamily:'inherit' }}>
                    <span style={{ opacity:0.5, marginRight:'0.5em' }}>{['A','B','C','D'][i]}.</span>{opt}
                  </button>
                );
              })}
            </div>

            {answer !== null && !revealed && (
              <button onClick={() => setRevealed(true)}
                style={{ background:'linear-gradient(135deg,var(--t-mid),var(--t-eucalyptus))', color:'white', border:'none', padding:'0.9rem', borderRadius:12, fontWeight:700, fontSize:'0.95rem', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                Check Answer
              </button>
            )}

            {revealed && (
              <>
                <div style={{ background: answer === correct ? 'rgba(74,222,128,0.12)' : 'rgba(239,68,68,0.1)', border:`1px solid ${answer===correct?'rgba(74,222,128,0.3)':'rgba(239,68,68,0.25)'}`, borderRadius:14, padding:'1rem' }}>
                  <div style={{ color: answer===correct?'#4ADE80':'#FCA5A5', fontWeight:700, fontSize:'0.85rem', marginBottom:'0.4rem' }}>
                    {answer === correct ? '✓ Correct!' : '✗ Not quite'}
                  </div>
                  {q.fact && <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.85rem', lineHeight:1.65, margin:0 }}>{q.fact}</p>}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.65rem' }}>
                  <button onClick={reset}
                    style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'0.85rem', borderRadius:12, fontWeight:700, fontSize:'0.88rem', cursor:'pointer' }}>
                    Try Another
                  </button>
                  <button onClick={() => setCurrentScreen('publicAnimal')}
                    style={{ background:'linear-gradient(135deg,var(--sunset-orange),var(--earth-clay))', border:'none', color:'white', padding:'0.85rem', borderRadius:12, fontWeight:700, fontSize:'0.88rem', cursor:'pointer' }}>
                    Explore Animals
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
