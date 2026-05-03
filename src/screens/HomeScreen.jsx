import { useApp } from '../context/AppContext';

export default function HomeScreen() {
  const { setCurrentScreen, setAppMode } = useApp();

  return (
    <div style={{ position:'relative', width:'100%', height:'100vh', overflow:'hidden', background:'transparent' }}>
      {/* Cinematic gradient overlay */}
      <div style={{
        position:'absolute', inset:0,
        background:'linear-gradient(180deg, rgba(7,30,20,0.55) 0%, rgba(7,30,20,0.3) 40%, rgba(7,30,20,0.72) 100%)',
        zIndex:1, pointerEvents:'none',
      }} />

      <div style={{ position:'relative', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', padding:'2rem 1.5rem', textAlign:'center' }}>

        {/* Logo */}
        <div className="animate-fade-in-up" style={{ animationDelay:'0.15s', marginBottom:'clamp(1.2rem, 3.5vh, 2.2rem)' }}>
          <img
            src="/images/logo.png"
            alt="Taronga Tracka"
            style={{ width:'clamp(180px, 42vw, 260px)', height:'auto', display:'block', filter:'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Hero card */}
        <div className="animate-fade-in-up" style={{
          background:'rgba(7,30,20,0.55)', backdropFilter:'blur(18px) saturate(1.2)', WebkitBackdropFilter:'blur(18px) saturate(1.2)',
          borderRadius:'var(--t-r-xl)', padding:'clamp(1.2rem, 2.5vh, 1.8rem) clamp(1.5rem, 4vw, 2.2rem)',
          marginBottom:'clamp(1.2rem, 3vh, 2rem)', border:'1px solid rgba(255,255,255,0.12)',
          maxWidth:'460px', width:'90%', animationDelay:'0.35s',
        }}>
          <h3 className="taronga-title" style={{ fontSize:'clamp(1.6rem, 4vw, 2rem)', marginBottom:'0.75rem', color:'white', letterSpacing:'0.04em', textShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>
            Step Into the Wild
          </h3>
          <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'0.45rem' }}>
            {['Track animals across the zoo','Record meaningful observations','Earn badges for your discoveries'].map((line, i) => (
              <li key={i} style={{ fontSize:'clamp(0.9rem, 2vw, 1.05rem)', color:'rgba(255,255,255,0.88)', display:'flex', alignItems:'center', gap:'0.5rem', justifyContent:'center' }}>
                <span style={{ color:'var(--t-eucalyptus)', fontSize:'0.8em' }}>▸</span>{line}
              </li>
            ))}
          </ul>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => { setAppMode('public'); setCurrentScreen('publicEntry'); }}
          className="animate-scale-in"
          style={{
            background:'linear-gradient(135deg, var(--sunset-orange) 0%, var(--earth-clay) 100%)',
            color:'white', border:'none',
            padding:'clamp(0.85rem, 2vh, 1.05rem) clamp(2.5rem, 6vw, 3rem)',
            fontSize:'clamp(1rem, 2.2vw, 1.15rem)', fontWeight:700,
            borderRadius:'var(--t-r-pill)', cursor:'pointer',
            boxShadow:'0 8px 28px rgba(180,90,40,0.45)',
            animationDelay:'0.55s', textTransform:'uppercase', letterSpacing:'0.12em',
            width:'min(88vw, 380px)', marginBottom:'0.85rem', transition:'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(180,90,40,0.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(180,90,40,0.45)'; }}>
          Let's Track!
        </button>

        {/* Secondary CTA */}
        <button
          onClick={() => setCurrentScreen('schoolEntry')}
          style={{
            padding:'clamp(0.75rem, 1.8vh, 0.95rem) clamp(2rem, 5vw, 2.5rem)',
            borderRadius:'var(--t-r-pill)', border:'1.5px solid rgba(255,255,255,0.28)',
            background:'rgba(26,82,56,0.6)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
            color:'white', cursor:'pointer', fontWeight:600,
            width:'min(88vw, 380px)', boxShadow:'0 4px 16px rgba(0,0,0,0.2)',
            transition:'all 0.2s', textTransform:'uppercase', letterSpacing:'0.1em',
            fontSize:'clamp(0.9rem, 2vw, 1rem)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,82,56,0.85)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(26,82,56,0.6)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          Taronga Education
        </button>

        {/* Staff portal link */}
        <div
          onClick={() => setCurrentScreen('adminLogin')}
          style={{ position:'absolute', bottom:'1rem', left:'50%', transform:'translateX(-50%)', color:'white', fontSize:'0.7rem', opacity:0.7, cursor:'pointer', transition:'opacity 0.2s', whiteSpace:'nowrap' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}>
          Taronga Staff Portal
        </div>
      </div>
    </div>
  );
}
