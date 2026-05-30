import { useApp } from '../context/AppContext';

export default function ComingSoonScreen() {
  const { setCurrentScreen } = useApp();

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: '#050e08',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(78,203,113,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Back arrow */}
      <button
        onClick={() => setCurrentScreen('home')}
        style={{
          position: 'absolute', top: '1.1rem', left: '1.1rem',
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.6)', width: '38px', height: '38px',
          borderRadius: '50%', cursor: 'pointer', fontSize: '1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)', zIndex: 10,
        }}
      >
        ←
      </button>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '360px', width: '100%' }}>
        {/* Logo */}
        <img
          src="/images/logo.png"
          alt="Taronga Tracka"
          style={{ width: 'clamp(140px,36vw,200px)', height: 'auto', display: 'block', margin: '0 auto 2.2rem', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))' }}
          onError={e => e.target.style.display = 'none'}
        />

        {/* Pill badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(78,203,113,0.1)', border: '1px solid rgba(78,203,113,0.22)',
          borderRadius: '99px', padding: '0.28rem 0.85rem', marginBottom: '1.4rem',
        }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ecb71', flexShrink: 0, animation: 'cs-pulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '0.57rem', fontWeight: 800, color: '#4ecb71', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Coming Soon</span>
        </div>

        <h1
          className="taronga-title"
          style={{ fontSize: 'clamp(2.4rem,9vw,3.4rem)', color: 'white', margin: '0 0 1rem', letterSpacing: '-0.02em', lineHeight: 1.05 }}
        >
          Something wild<br />is coming.
        </h1>

        <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.75, margin: '0 auto 2.4rem', maxWidth: '300px' }}>
          The public version of Taronga Tracka is in development. Check back soon to start exploring the zoo.
        </p>

        {/* Decorative divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.4rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ display: 'flex', gap: '4px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(78,203,113,0.35)' }} />
            ))}
          </div>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Taronga Education link */}
        <button
          onClick={() => setCurrentScreen('schoolEntry')}
          style={{
            width: '100%', padding: '0.85rem 1.5rem',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px',
            background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.62)',
            cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
            letterSpacing: '0.04em', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.62)'; }}
        >
          Taronga Education →
        </button>
      </div>

      {/* Developer login - bottom of screen */}
      <div
        onClick={() => setCurrentScreen('adminLogin')}
        style={{
          position: 'absolute', bottom: '1.6rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, cursor: 'pointer',
          color: 'rgba(255,255,255,0.2)', fontSize: '0.62rem',
          fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
          borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2px',
          transition: 'color 0.2s, border-color 0.2s', whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.2)'; e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)'; }}
      >
        Developer Login
      </div>

      <style>{`
        @keyframes cs-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;  transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
