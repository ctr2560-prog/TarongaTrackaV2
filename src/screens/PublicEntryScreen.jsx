import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { animals } from '../data/animals';

export default function PublicEntryScreen() {
  const { setCurrentScreen, setAppMode } = useApp();
  const [name, setName] = useState('');

  const featured = animals.slice(0, 3);

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg, var(--jungle-deep) 0%, var(--jungle-mid) 60%, var(--jungle-light) 100%)', display:'flex', flexDirection:'column', alignItems:'center', overflow:'hidden' }}>

      {/* Back */}
      <div style={{ width:'100%', padding:'1rem 1.25rem', flexShrink:0 }}>
        <button onClick={() => { setAppMode('school'); setCurrentScreen('home'); }} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'0.45rem 1rem', borderRadius:999, fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>
          ← Back
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex:1, overflowY:'auto', width:'100%', display:'flex', flexDirection:'column', alignItems:'center', padding:'0 1.25rem 2rem' }}>
        <div style={{ maxWidth:440, width:'100%', display:'flex', flexDirection:'column', gap:'1.5rem' }}>

          {/* Hero */}
          <div style={{ textAlign:'center' }}>
            <img src="images/logo.png" alt="Taronga Tracka" style={{ width:140, marginBottom:'1rem', filter:'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }} onError={e => e.target.style.display='none'} />
            <h1 style={{ color:'white', fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:800, margin:'0 0 0.4rem', letterSpacing:'0.02em', textShadow:'0 2px 12px rgba(0,0,0,0.4)' }}>Explore Taronga</h1>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.95rem', margin:0, lineHeight:1.6 }}>Discover animals, learn fascinating facts, and track what you find across the zoo.</p>
          </div>

          {/* Animal preview strip */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.5rem' }}>
            {featured.map(a => (
              <div key={a.id} style={{ borderRadius:14, overflow:'hidden', aspectRatio:'1', backgroundImage:`url(${a.image})`, backgroundSize:'cover', backgroundPosition:'center', boxShadow:'0 4px 16px rgba(0,0,0,0.35)', position:'relative' }}>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.72) 100%)' }} />
                <div style={{ position:'absolute', bottom:6, left:0, right:0, textAlign:'center', color:'white', fontSize:'0.62rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', textShadow:'0 1px 4px rgba(0,0,0,0.8)' }}>{a.name.split(' ').pop()}</div>
              </div>
            ))}
          </div>

          {/* Name entry card */}
          <div style={{ background:'rgba(255,255,255,0.1)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', borderRadius:20, padding:'1.5rem', border:'1px solid rgba(255,255,255,0.2)' }}>
            <h2 style={{ color:'white', margin:'0 0 0.3rem', fontSize:'1.1rem', fontWeight:700 }}>What's your name?</h2>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.82rem', margin:'0 0 1rem', lineHeight:1.5 }}>Optional - helps personalise your experience.</p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name…"
              onKeyDown={e => e.key === 'Enter' && setCurrentScreen('publicAnimal')}
              style={{ width:'100%', padding:'0.85rem 1rem', borderRadius:12, border:'1.5px solid rgba(255,255,255,0.25)', background:'rgba(255,255,255,0.12)', color:'white', fontSize:'1rem', fontFamily:'inherit', boxSizing:'border-box', outline:'none', marginBottom:'0.85rem' }}
            />
            <button
              onClick={() => setCurrentScreen('publicAnimal')}
              style={{ width:'100%', padding:'0.95rem', borderRadius:12, border:'none', background:'linear-gradient(135deg,var(--sunset-orange),var(--earth-clay))', color:'white', fontSize:'1rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.1em', boxShadow:'0 6px 20px rgba(180,90,40,0.4)' }}>
              Start Exploring →
            </button>
          </div>

          {/* What you'll do */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
            {[
              ['🔍','Discover animals across the zoo'],
              ['📖','Read keeper insights and fun facts'],
              ['🏆','Earn points as you explore'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display:'flex', alignItems:'center', gap:'0.85rem', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, padding:'0.7rem 1rem' }}>
                <span style={{ fontSize:'1.3rem', flexShrink:0 }}>{icon}</span>
                <span style={{ color:'rgba(255,255,255,0.85)', fontSize:'0.88rem', fontWeight:500 }}>{text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
