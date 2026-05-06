import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ZOOSNOOZ_ANIMALS } from '../data/zoosnoozAnimals';
import { animals as DAY_ANIMALS } from '../data/animals';
import { normaliseCode, safeStudentId } from '../utils/helpers';

// doc param formats:
//   zzv_{animalId}_{classCode}_{studentId}  — personal ZooSnooz souvenir
//   {animalId}                              — generic animal info card

function parseDocCode(code) {
  if (!code) return { type: 'unknown' };
  if (code.startsWith('zzv_')) {
    const parts = code.slice(4).split('_');
    if (parts.length >= 3) {
      const [animalId, classCode, ...nameParts] = parts;
      return { type: 'zoosnooz', animalId, classCode, studentId: nameParts.join('_') };
    }
  }
  const allAnimals = [...ZOOSNOOZ_ANIMALS, ...DAY_ANIMALS];
  const match = allAnimals.find(a => a.id === code);
  if (match) return { type: 'animal', animalId: code };
  return { type: 'unknown' };
}

const CONSERVATION_STATUS = {
  tiger:     { label: 'Critically Endangered', color: '#DC2626' },
  lion:      { label: 'Vulnerable',            color: '#D97706' },
  rhino:     { label: 'Vulnerable',            color: '#D97706' },
  binturong: { label: 'Vulnerable',            color: '#D97706' },
  'sun-bear':{ label: 'Vulnerable',            color: '#D97706' },
};

export default function DocumentaryViewer() {
  const { docViewCode, setDocViewCode } = useApp();
  const parsed = parseDocCode(docViewCode);

  const [loading,     setLoading]     = useState(parsed.type === 'zoosnooz');
  const [zzData,      setZzData]      = useState(null);
  const [fetchError,  setFetchError]  = useState(false);

  // Resolve animal object
  const allAnimals = [...ZOOSNOOZ_ANIMALS, ...DAY_ANIMALS];
  const animal = parsed.animalId ? allAnimals.find(a => a.id === parsed.animalId) : null;

  // Fetch ZooSnooz souvenir data from Firestore
  useEffect(() => {
    if (parsed.type !== 'zoosnooz') return;
    (async () => {
      try {
        const code = normaliseCode(parsed.classCode);
        const sid  = parsed.studentId;
        const snap = await getDoc(doc(db, 'classes', code, 'students', sid));
        if (snap.exists()) {
          const data = snap.data();
          const zzAnimalData = data?.zoosnooz?.[parsed.animalId];
          setZzData({ studentName: data.name || sid, zzAnimal: zzAnimalData });
        } else {
          setFetchError(true);
        }
      } catch (e) {
        console.warn('DocViewer fetch:', e);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [parsed.type, parsed.classCode, parsed.studentId, parsed.animalId]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ position:'fixed', inset:0, background:'#0B0F14', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.9rem' }}>Loading souvenir…</div>
      </div>
    );
  }

  // ── Unknown / error ───────────────────────────────────────────────────────
  if (parsed.type === 'unknown' || (parsed.type === 'zoosnooz' && fetchError && !animal)) {
    return (
      <div style={{ position:'fixed', inset:0, background:'#0B0F14', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem', padding:'2rem' }}>
        <div style={{ fontSize:'3rem' }}>🔍</div>
        <h2 style={{ color:'rgba(255,255,255,0.85)', margin:0 }}>Code not found</h2>
        <p style={{ color:'rgba(255,255,255,0.45)', textAlign:'center', margin:0, fontSize:'0.88rem' }}>This link may have expired or the code is invalid.</p>
        <button onClick={() => setDocViewCode(null)} style={{ marginTop:'0.5rem', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'0.6rem 1.4rem', borderRadius:999, fontSize:'0.85rem', cursor:'pointer' }}>
          Back to App
        </button>
      </div>
    );
  }

  const status = animal ? CONSERVATION_STATUS[animal.id] : null;
  const obs    = zzData?.zzAnimal?.observation;
  const obsScore = zzData?.zzAnimal?.observationScore;
  const studentName = zzData?.studentName;
  const isPersonal  = parsed.type === 'zoosnooz' && zzData;

  // ─────────────────────────────────────────────────────────────────────────
  // SOUVENIR CARD
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, background:'#0B0F14', overflowY:'auto', display:'flex', flexDirection:'column' }}>
      {/* Star field */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        {[...Array(30)].map((_,i) => (
          <div key={i} style={{ position:'absolute', left:`${(i*9.7+3)%100}%`, top:`${(i*13.1+7)%100}%`, width:`${1+(i%2)}px`, height:`${1+(i%2)}px`, borderRadius:'50%', background:'white', opacity: 0.4+(i%3)*0.2 }} />
        ))}
      </div>

      <div style={{ position:'relative', zIndex:5, maxWidth:480, margin:'0 auto', width:'100%', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>

        {/* Taronga header */}
        <div style={{ textAlign:'center', paddingTop:'0.5rem' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(46,125,85,0.15)', border:'1px solid rgba(46,125,85,0.3)', borderRadius:999, padding:'0.3rem 1rem', marginBottom:'0.75rem' }}>
            <span style={{ fontSize:'0.65rem', fontWeight:700, color:'#4ADE80', textTransform:'uppercase', letterSpacing:'0.12em' }}>★ Taronga ZooSnooz</span>
          </div>
          {isPersonal && studentName && (
            <div style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.82rem' }}>{studentName}'s Night Discovery</div>
          )}
        </div>

        {/* Animal hero image */}
        <div style={{ borderRadius:20, overflow:'hidden', aspectRatio:'16/9', backgroundImage:`url(${animal?.image || `images/${parsed.animalId}.jpg`})`, backgroundSize:'cover', backgroundPosition:'center', boxShadow:'0 0 0 1px rgba(46,125,85,0.3), 0 20px 60px rgba(0,0,0,0.8)', position:'relative' }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 50%, rgba(11,15,20,0.95) 100%)' }} />
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'1rem' }}>
            <h1 style={{ color:'white', margin:'0 0 0.2rem', fontSize:'1.5rem', fontWeight:700, textShadow:'0 2px 12px rgba(0,0,0,0.8)' }}>
              {animal?.name || parsed.animalId}
            </h1>
            <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.78rem', fontStyle:'italic' }}>{animal?.scientificName}</div>
          </div>
          {status && (
            <div style={{ position:'absolute', top:12, right:12, background:'rgba(0,0,0,0.7)', border:`1px solid ${status.color}40`, borderRadius:999, padding:'0.2rem 0.7rem' }}>
              <span style={{ color:status.color, fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>{status.label}</span>
            </div>
          )}
        </div>

        {/* Badge earned pill */}
        {isPersonal && (
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.25)', borderRadius:16, padding:'0.85rem 1rem' }}>
            <div style={{ width:44, height:44, borderRadius:10, backgroundImage:`url(images/badge-${parsed.animalId}.png)`, backgroundSize:'cover', backgroundPosition:'center', flexShrink:0, boxShadow:'0 2px 12px rgba(74,222,128,0.3)' }} />
            <div>
              <div style={{ color:'#4ADE80', fontWeight:700, fontSize:'0.88rem' }}>ZooSnooz Badge Earned</div>
              {obsScore && (
                <div style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.72rem', marginTop:'0.1rem' }}>
                  Behaviour {obsScore.behaviour}/5 · Detail {obsScore.detail}/5 · Writing {obsScore.writing}/5
                </div>
              )}
            </div>
          </div>
        )}

        {/* Personal observation */}
        {isPersonal && obs && (
          <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:'1rem' }}>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.5rem' }}>Field Observation</div>
            <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'0.9rem', lineHeight:1.7, margin:0, fontStyle:'italic' }}>"{obs}"</p>
            {studentName && <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.72rem', marginTop:'0.5rem' }}>— {studentName}</div>}
          </div>
        )}

        {/* Animal fact */}
        {animal && (
          <div style={{ background:'rgba(46,125,85,0.12)', border:'1px solid rgba(46,125,85,0.25)', borderRadius:16, padding:'1rem' }}>
            <div style={{ color:'rgba(74,222,128,0.8)', fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.5rem' }}>
              {animal.conceptHeading || 'Conservation Fact'}
            </div>
            <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.85rem', lineHeight:1.7, margin:0 }}>
              {animal.fact || animal.keeperInsight?.split('\n')[0]}
            </p>
          </div>
        )}

        {/* Concept chips */}
        {animal?.conceptChips?.length > 0 && (
          <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
            {animal.conceptChips.map((chip, i) => (
              <span key={i} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, padding:'0.25rem 0.75rem', fontSize:'0.72rem', color:'rgba(255,255,255,0.75)', fontWeight:600 }}>
                {chip.label}
              </span>
            ))}
          </div>
        )}

        {/* Conservation CTA */}
        <div style={{ background:'linear-gradient(135deg, rgba(46,125,85,0.2), rgba(26,82,56,0.2))', border:'1px solid rgba(46,125,85,0.3)', borderRadius:16, padding:'1rem', textAlign:'center' }}>
          <div style={{ color:'rgba(255,255,255,0.9)', fontWeight:700, fontSize:'0.95rem', marginBottom:'0.3rem' }}>Support Taronga Conservation</div>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.8rem', lineHeight:1.6, margin:'0 0 0.75rem' }}>
            Every visit helps fund critical wildlife conservation programs protecting species like the {animal?.name?.split(' ').pop() || 'animals'} you discovered tonight.
          </p>
          <div style={{ color:'rgba(74,222,128,0.8)', fontSize:'0.75rem', fontWeight:600 }}>taronga.org.au/conservation</div>
        </div>

        {/* Footer */}
        <div style={{ textAlign:'center', paddingBottom:'1rem' }}>
          <img src="images/logo.png" alt="Taronga" style={{ height:28, opacity:0.5 }} onError={e => e.target.style.display='none'} />
          <div style={{ color:'rgba(255,255,255,0.2)', fontSize:'0.68rem', marginTop:'0.4rem' }}>taronga.org.au · ZooSnooz Night Experience</div>
        </div>

      </div>
    </div>
  );
}
