import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useApp } from '../context/AppContext';
import { isTarongaStaffEmail } from '../constants/tarongaStaff';

// ⚠️ The staff portal signs in with a REAL ACCOUNT (Firebase Auth), not a shared code.
//
// It used to be a single access code shared between everyone. That gave no accountability (the
// portal can approve submissions, read every class and school, and WIPE ALL DATA — "who did
// that?" had no answer), no way to revoke one person, and codes spread quietly by email.
//
// ⚠️ The email allowlist checked here is for the UI only. The real control is `isWildlyStaff()`
//    in firestore.rules, enforced server-side on every read and write. Without this check a
//    non-staff account would reach the dashboard and watch every panel fail silently, which is
//    a worse experience and a worse security signal than being told plainly.
//
// 🚫 Do not reintroduce a role-based check read from Firestore. `teachers/{email}.role` was
//    writable by the user it described, so anyone who signed up could make themselves staff.
//    Removed 2026-10-03.
export default function AdminLoginScreen() {
  const { setCurrentScreen } = useApp();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus]     = useState('idle');   // idle | loading
  const [error, setError]       = useState('');

  const isValid = email.trim().includes('@') && password.length > 0;

  const handleLogin = async () => {
    if (!isValid || status === 'loading') return;
    setStatus('loading');
    setError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (!isTarongaStaffEmail(cred.user.email)) {
        // A real account, just not a staff one. Sign straight back out so a teacher who
        // mistypes the portal URL is not left holding a half-privileged session.
        await auth.signOut();
        setError('That account does not have staff access.');
        setStatus('idle');
        return;
      }
      setCurrentScreen('adminDashboard');
    } catch (err) {
      // Deliberately one message for both "no such account" and "wrong password": telling an
      // attacker which of the two they got right halves their work.
      const code = err?.code || '';
      setError(code === 'auth/too-many-requests'
        ? 'Too many attempts. Wait a few minutes and try again.'
        : 'Incorrect email or password.');
      setStatus('idle');
    }
  };

  const field = {
    width:'100%', padding:'0.75rem 1rem', borderRadius:'var(--t-r-md)', border:'2px solid #E5E5E5',
    fontSize:'1rem', fontFamily:'DM Sans, sans-serif', marginBottom:'1rem', boxSizing:'border-box',
    transition:'border-color 0.2s', outline:'none',
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, var(--t-deep) 0%, var(--t-mid) 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem, 5vw, 2rem)', overflow:'auto' }}>
      <div className="animate-scale-in" style={{ background:'white', borderRadius:'24px', padding:'clamp(1.5rem, 4vh, 2.5rem)', maxWidth:'420px', width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>

        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <h2 className="taronga-title" style={{ fontSize:'clamp(1.6rem, 4vh, 2rem)', color:'var(--t-deep)', marginBottom:'0.3rem', letterSpacing:'0.04em' }}>Taronga Staff Portal</h2>
          <p style={{ color:'#666', fontSize:'0.9rem' }}>Sign in with your Taronga account</p>
        </div>

        <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'var(--t-deep)', marginBottom:'0.35rem' }}>Email</label>
        <input type="email" autoComplete="username" value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          placeholder="you@example.com" style={field}
          onFocus={e => e.target.style.borderColor = 'var(--t-mid)'}
          onBlur={e  => e.target.style.borderColor = '#E5E5E5'} />

        <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'var(--t-deep)', marginBottom:'0.35rem' }}>Password</label>
        <input type="password" autoComplete="current-password" value={password}
          onChange={e => { setPassword(e.target.value); setError(''); }}
          placeholder="Your password" style={{ ...field, marginBottom:'1.2rem' }}
          onFocus={e => e.target.style.borderColor = 'var(--t-mid)'}
          onBlur={e  => e.target.style.borderColor = '#E5E5E5'}
          onKeyDown={e => e.key === 'Enter' && handleLogin()} />

        {error && (
          <p role="alert" style={{ color:'#DC2626', fontSize:'0.85rem', margin:'0 0 0.9rem' }}>{error}</p>
        )}
        <button onClick={handleLogin} disabled={!isValid || status === 'loading'}
          style={{ width:'100%', padding:'0.85rem', borderRadius:'var(--t-r-pill)', border:'none', background: isValid ? 'linear-gradient(135deg, var(--sunset-orange), var(--earth-clay))' : '#CCC', color:'white', fontSize:'1.05rem', fontWeight:700, cursor: isValid && status !== 'loading' ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.08em', transition:'all 0.3s ease', opacity: status === 'loading' ? 0.7 : 1 }}>
          {status === 'loading' ? 'Signing in…' : 'Enter Portal'}
        </button>

        {/* ⚠️ NO self-service password reset here, on purpose. Self-service is right for teachers
            (many of them, and the account only reaches their own classes) and wrong for staff
            (very few, and the account reads every school and can wipe all data). A locked-out
            staff member contacts the administrator, who issues a link from Control Room →
            Staff accounts. Do not add a "Forgot password?" link back to this screen. */}
        <p style={{ textAlign:'center', color:'#999', fontSize:'0.78rem', marginTop:'0.9rem', lineHeight:1.5 }}>
          Locked out? Contact your Taronga administrator to have your password reset.
        </p>

        <button onClick={() => setCurrentScreen('home')}
          style={{ display:'block', width:'100%', background:'none', border:'none', color:'#999', fontSize:'0.82rem', cursor:'pointer', marginTop:'0.5rem', padding:'0.4rem', transition:'color 0.18s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#666'}
          onMouseLeave={e => e.currentTarget.style.color = '#999'}>
          ← Back
        </button>
      </div>
    </div>
  );
}
