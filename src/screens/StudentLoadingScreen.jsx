import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const MESSAGES = [
  'Preparing your adventure…',
  'Loading animal missions',
  'Saving questions for offline use',
  'Getting your zoo map ready',
  'Almost ready…',
];

const PRELOAD_IMAGES = [
  '/gorilla-game/Customer1_neutral.png',
  '/gorilla-game/Customer1_happy.png',
  '/gorilla-game/Customer1_angry.png',
  '/gorilla-game/Customer2_neutral.png',
  '/gorilla-game/Customer2_happy.png',
  '/gorilla-game/Customer2_angry.png',
  '/gorilla-game/Customer3-neutral.png',
  '/gorilla-game/Customer3-happy.png',
  '/gorilla-game/Customer3-angry.png',
  '/gorilla-game/icon-leaves.png',
  '/gorilla-game/icon-bamboo.png',
  '/gorilla-game/icon-fruit.png',
  '/gorilla-game/icon-termite.png',
  '/gorilla-game/server_body_idle.png',
  '/gorilla-game/server_arm_left_idle.png',
  '/gorilla-game/server_arm_left_reach.png',
  '/gorilla-game/server_arm_right_idle.png',
  '/gorilla-game/server_arm_right_reach.png',
  '/gorilla-game/background.png',
];

export default function StudentLoadingScreen() {
  const { setCurrentScreen, studentName, studentPreloadError } = useApp();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Preload gorilla game images so they're cached before students reach that station
    PRELOAD_IMAGES.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 2400),
      setTimeout(() => setCurrentScreen('map'), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [setCurrentScreen]);

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg,#071A0C 0%,#0D3320 50%,#0A2010 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.75rem', padding:'2rem' }}>
      <img src="images/tracka-logo-white.png" alt="Taronga Tracka"
        style={{ width:'clamp(150px,38vw,210px)', height:'auto', filter:'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }}
        onError={e => e.target.style.display='none'} />
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'clamp(1rem,3vw,1.2rem)', color:'rgba(255,255,255,0.92)', fontWeight:600, marginBottom:'0.4rem' }}>
          {MESSAGES[Math.min(phase, MESSAGES.length - 1)]}
        </div>
        <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.4)' }}>
          Hi {studentName}!
        </div>
      </div>
      <div style={{ display:'flex', gap:'0.5rem' }}>
        {MESSAGES.map((_, i) => (
          <div key={i} style={{ width:'8px', height:'8px', borderRadius:'50%', background: i <= phase ? '#4ade80' : 'rgba(255,255,255,0.18)', transition:'background 0.3s' }} />
        ))}
      </div>
      {studentPreloadError && (
        <div style={{ background:'rgba(250,200,0,0.12)', border:'1px solid rgba(250,200,0,0.35)', borderRadius:'8px', padding:'0.65rem 1.1rem', color:'rgba(255,220,80,0.92)', fontSize:'0.8rem', maxWidth:'300px', textAlign:'center' }}>
          {studentPreloadError}
        </div>
      )}
    </div>
  );
}
