import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../context/AppContext';

export default function AdminLoginScreen() {
  const { setCurrentScreen, adminAccessCode, setAdminAccessCode } = useApp();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const code = adminAccessCode.trim().toLowerCase();
    if (!code) return;
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, 'adminAccess', code));
      if (snap.exists() && snap.data().active === true) {
        setCurrentScreen('adminDashboard');
      } else {
        alert('Invalid or inactive access code');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      alert('Failed to verify access code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValid = adminAccessCode.trim().length > 0;

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, var(--t-deep) 0%, var(--t-mid) 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem, 5vw, 2rem)', overflow:'auto' }}>
      <div className="animate-scale-in" style={{ background:'white', borderRadius:'24px', padding:'clamp(1.5rem, 4vh, 2.5rem)', maxWidth:'420px', width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>

        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <h2 className="taronga-title" style={{ fontSize:'clamp(1.6rem, 4vh, 2rem)', color:'var(--t-deep)', marginBottom:'0.3rem', letterSpacing:'0.04em' }}>Taronga Staff Portal</h2>
          <p style={{ color:'#666', fontSize:'0.9rem' }}>Enter your access code to continue</p>
        </div>

        <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'var(--t-deep)', marginBottom:'0.35rem' }}>Staff Access Code</label>
        <input
          type="text"
          value={adminAccessCode}
          onChange={e => setAdminAccessCode(e.target.value)}
          placeholder="Enter staff access code"
          style={{ width:'100%', padding:'0.75rem 1rem', borderRadius:'var(--t-r-md)', border:'2px solid #E5E5E5', fontSize:'1rem', fontFamily:'DM Sans, sans-serif', marginBottom:'1.5rem', boxSizing:'border-box', transition:'border-color 0.2s', outline:'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--t-mid)'}
          onBlur={e  => e.target.style.borderColor = '#E5E5E5'}
          onKeyDown={e => e.key === 'Enter' && isValid && !loading && handleLogin()}
        />

        <button
          onClick={handleLogin}
          disabled={!isValid || loading}
          style={{ width:'100%', padding:'0.85rem', borderRadius:'var(--t-r-pill)', border:'none', background: isValid ? 'linear-gradient(135deg, var(--sunset-orange), var(--earth-clay))' : '#CCC', color:'white', fontSize:'1.05rem', fontWeight:700, cursor: isValid && !loading ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.08em', transition:'all 0.3s ease', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Verifying…' : 'Enter Portal'}
        </button>

        <button
          onClick={() => { setAdminAccessCode(''); setCurrentScreen('home'); }}
          style={{ display:'block', width:'100%', background:'none', border:'none', color:'#999', fontSize:'0.82rem', cursor:'pointer', marginTop:'1rem', padding:'0.4rem', transition:'color 0.18s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#666'}
          onMouseLeave={e => e.currentTarget.style.color = '#999'}>
          ← Back
        </button>
      </div>
    </div>
  );
}
