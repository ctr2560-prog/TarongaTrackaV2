import { useApp } from '../context/AppContext';

export default function SchoolEntryScreen() {
  const { setCurrentScreen } = useApp();

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(160deg, var(--t-forest) 0%, var(--t-deep) 55%, var(--t-mid) 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem, 3vw, 2rem)', overflow:'auto' }}>
      <div style={{ maxWidth:'860px', width:'100%', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'1.25rem' }}>

        {/* Student Join Card */}
        <div className="animate-scale-in"
          onClick={() => setCurrentScreen('studentJoin')}
          style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-xl)', padding:'clamp(2rem, 4vh, 2.5rem)', boxShadow:'var(--t-shadow-xl)', cursor:'pointer', transition:'transform 0.22s ease, box-shadow 0.22s ease', animationDelay:'0.1s', border:'1px solid rgba(255,255,255,0.8)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 28px 72px rgba(7,30,20,0.28)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--t-shadow-xl)'; }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'linear-gradient(135deg, var(--t-eucalyptus), var(--t-mid))', margin:'0 auto 1rem', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(46,125,85,0.35)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h2 className="taronga-title" style={{ fontSize:'clamp(1.6rem, 3.5vh, 2rem)', color:'var(--t-deep)', marginBottom:'0.5rem', letterSpacing:'0.04em' }}>Student Join</h2>
            <p style={{ color:'var(--t-slate)', fontSize:'0.92rem', lineHeight:1.6, marginBottom:'1.5rem' }}>Have a class code from your teacher? Join your class adventure here.</p>
            <div style={{ padding:'0.75rem 1rem', background:'linear-gradient(135deg, var(--sunset-orange), var(--earth-clay))', color:'white', borderRadius:'var(--t-r-pill)', fontWeight:700, fontSize:'0.88rem', textTransform:'uppercase', letterSpacing:'0.09em', boxShadow:'0 4px 14px rgba(180,90,40,0.35)' }}>Tap to Join →</div>
          </div>
        </div>

        {/* Teacher Access Card */}
        <div className="animate-scale-in"
          onClick={() => setCurrentScreen('teacherLogin')}
          style={{ background:'var(--t-chalk)', borderRadius:'var(--t-r-xl)', padding:'clamp(2rem, 4vh, 2.5rem)', boxShadow:'var(--t-shadow-xl)', cursor:'pointer', transition:'transform 0.22s ease, box-shadow 0.22s ease', animationDelay:'0.18s', border:'1px solid rgba(255,255,255,0.8)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 28px 72px rgba(7,30,20,0.28)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--t-shadow-xl)'; }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'linear-gradient(135deg, var(--t-mid), var(--t-deep))', margin:'0 auto 1rem', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(10,47,31,0.35)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            </div>
            <h2 className="taronga-title" style={{ fontSize:'clamp(1.6rem, 3.5vh, 2rem)', color:'var(--t-deep)', marginBottom:'0.5rem', letterSpacing:'0.04em' }}>Teacher Access</h2>
            <p style={{ color:'var(--t-slate)', fontSize:'0.92rem', lineHeight:1.6, marginBottom:'1.5rem' }}>Create and manage classes, track student progress, and view analytics.</p>
            <div style={{ padding:'0.75rem 1rem', background:'linear-gradient(135deg, var(--t-mid), var(--t-deep))', color:'white', borderRadius:'var(--t-r-pill)', fontWeight:700, fontSize:'0.88rem', textTransform:'uppercase', letterSpacing:'0.09em', boxShadow:'0 4px 14px rgba(10,47,31,0.3)' }}>Tap to Access →</div>
          </div>
        </div>
      </div>

      <button onClick={() => setCurrentScreen('home')}
        style={{ position:'absolute', top:'1.25rem', left:'1.25rem', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.22)', color:'white', padding:'0.45rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.82rem', fontWeight:600, backdropFilter:'blur(10px)', transition:'background 0.18s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
        ← Back
      </button>
    </div>
  );
}
