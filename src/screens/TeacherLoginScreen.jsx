import { useApp } from '../context/AppContext';

export default function TeacherLoginScreen() {
  const { setCurrentScreen, teacherEmail, setTeacherEmail } = useApp();

  const isValid = teacherEmail.trim().includes('@');

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, var(--t-deep) 0%, var(--t-mid) 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem, 5vw, 2rem)', overflow:'auto' }}>
      <div className="animate-scale-in" style={{ background:'white', borderRadius:'24px', padding:'clamp(1.5rem, 4vh, 2.5rem)', maxWidth:'420px', width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>

        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'linear-gradient(135deg, var(--t-mid), var(--t-deep))', margin:'0 auto 0.75rem', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(10,47,31,0.32)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          </div>
          <h2 className="taronga-title" style={{ fontSize:'clamp(1.6rem, 4vh, 2rem)', color:'var(--t-deep)', marginBottom:'0.3rem', letterSpacing:'0.04em' }}>Teacher Access</h2>
          <p style={{ color:'#666', fontSize:'0.9rem' }}>Enter your email to continue</p>
        </div>

        <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'var(--t-deep)', marginBottom:'0.35rem' }}>Email Address</label>
        <input
          type="email"
          value={teacherEmail}
          onChange={e => setTeacherEmail(e.target.value)}
          placeholder="you@school.edu.au"
          style={{ width:'100%', padding:'0.75rem 1rem', borderRadius:'var(--t-r-md)', border:'2px solid #E5E5E5', fontSize:'1rem', fontFamily:'DM Sans, sans-serif', marginBottom:'1.5rem', boxSizing:'border-box', transition:'border-color 0.2s', outline:'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--t-mid)'}
          onBlur={e  => e.target.style.borderColor = '#E5E5E5'}
          onKeyDown={e => e.key === 'Enter' && isValid && setCurrentScreen('teacherDashboard')}
        />

        <button
          onClick={() => setCurrentScreen('teacherDashboard')}
          disabled={!isValid}
          style={{ width:'100%', padding:'0.85rem', borderRadius:'var(--t-r-pill)', border:'none', background: isValid ? 'linear-gradient(135deg, var(--sunset-orange), var(--earth-clay))' : '#CCC', color:'white', fontSize:'1.05rem', fontWeight:700, cursor: isValid ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.08em', transition:'all 0.3s ease' }}>
          Continue
        </button>

        <button
          onClick={() => setCurrentScreen('schoolEntry')}
          style={{ display:'block', width:'100%', background:'none', border:'none', color:'#999', fontSize:'0.82rem', cursor:'pointer', marginTop:'1rem', padding:'0.4rem', transition:'color 0.18s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#666'}
          onMouseLeave={e => e.currentTarget.style.color = '#999'}>
          ← Back
        </button>
      </div>
    </div>
  );
}
