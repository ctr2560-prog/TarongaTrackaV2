import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ANIMAL_MAP_POSITIONS } from './MapScreen';

export default function TeacherMapScreen() {
  const { setCurrentScreen } = useApp();
  const [scale, setScale] = useState(0.8);

  return (
    <div className="lms-page">

      {/* Top bar */}
      <div className="lms-topbar">
        <div className="lms-topbar-brand">
          <button onClick={() => setCurrentScreen('teacherDashboard')} style={{ background:'var(--t-foam)', border:'1.5px solid var(--t-stone)', color:'var(--t-charcoal)', padding:'0.45rem 0.95rem', borderRadius:'var(--t-r-sm)', cursor:'pointer', fontSize:'0.8rem', fontWeight:600, flexShrink:0, fontFamily:'inherit' }}>
            ← Back
          </button>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h1 className="taronga-title" style={{ fontSize:'1.35rem', letterSpacing:'0.06em', lineHeight:1, color:'var(--t-deep)', fontWeight:400 }}>ZOO MAP</h1>
            <p style={{ fontSize:'0.7rem', color:'var(--t-slate)', fontWeight:500, marginTop:'0.1rem' }}>Taronga Zoo Sydney · Tracka animal locations</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.4rem' }}>
          {[['−', -0.3], ['+', 0.3]].map(([label, delta]) => (
            <button key={label} onClick={() => setScale(s => Math.min(3, Math.max(0.5, s + delta)))}
              style={{ width:'34px', height:'34px', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-stone)', background:'white', color:'var(--t-deep)', fontSize:'1.05rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit', lineHeight:1 }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ flex:1, overflow:'auto', WebkitOverflowScrolling:'touch', background:'#0a1a0a', textAlign:'center' }}>
        <div style={{ position:'relative', display:'inline-block', width:`${Math.round(scale * 100)}%` }}>
          <img src="/images/taronga-map.png" alt="Taronga Zoo Map" style={{ width:'100%', display:'block' }} />

          {Object.entries(ANIMAL_MAP_POSITIONS).map(([id, pos]) => (
            <div key={id} style={{ position:'absolute', left:`${pos.x}%`, top:`${pos.y}%`, transform:'translate(-50%,-100%)', zIndex:5, display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', background:'linear-gradient(135deg,#166534,#15803d)', border:'2px solid #22C55E', borderRadius:'999px', padding:'4px 10px 4px 4px', boxShadow:'0 4px 16px rgba(0,0,0,0.6)' }}>
                <div style={{ width:'34px', height:'34px', borderRadius:'50%', backgroundImage:`url(/images/${id}.jpg)`, backgroundSize:'cover', backgroundPosition:'center', flexShrink:0, border:'1.5px solid #22C55E' }} />
                <div style={{ fontSize:'0.66rem', fontWeight:800, color:'white', lineHeight:1.2, whiteSpace:'nowrap' }}>{pos.label}</div>
              </div>
              <div style={{ width:0, height:0, borderLeft:'6px solid transparent', borderRight:'6px solid transparent', borderTop:'8px solid #22C55E' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
