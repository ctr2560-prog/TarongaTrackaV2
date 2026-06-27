import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useApp } from '../context/AppContext';
import LegalModal from '../components/LegalModal';

export default function TeacherLoginScreen() {
  const { setCurrentScreen, setTeacherEmail, setDemoMode } = useApp();

  const [mode,      setMode]      = useState('login'); // 'login' | 'register'
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [commsOptIn, setCommsOptIn] = useState(false);
  const [status,    setStatus]    = useState('idle'); // 'idle' | 'loading' | 'error' | 'reset-sent'
  const [errorMsg,  setErrorMsg]  = useState('');
  const [legalDoc,  setLegalDoc]  = useState(null); // 'privacy' | 'terms' | null

  const switchMode = (next) => {
    setMode(next);
    setStatus('idle');
    setErrorMsg('');
    setPassword('');
    setConfirm('');
  };

  const isLoginValid    = email.trim().includes('@') && password.length > 0;
  const isRegisterValid = email.trim().includes('@') && password.length >= 6 && password === confirm;

  const handleSignIn = async () => {
    if (email.trim().toLowerCase() === 'demo@zoo') {
      setDemoMode(true);
      setTeacherEmail('demo@zoo');
      setCurrentScreen('teacherDashboard');
      return;
    }
    if (!isLoginValid) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setCurrentScreen('teacherDashboard');
    } catch (err) {
      const msg =
        err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'
          ? 'Incorrect email or password.'
          : 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  const handleRegister = async () => {
    if (!isRegisterValid) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(doc(db, 'teachers', email.trim().toLowerCase()), {
        email: email.trim().toLowerCase(),
        commsOptIn,
        createdAt: serverTimestamp(),
      }, { merge: true });
      setCurrentScreen('teacherDashboard');
    } catch (err) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists.'
          : err.code === 'auth/weak-password'
          ? 'Password must be at least 6 characters.'
          : 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim().includes('@')) {
      setErrorMsg('Enter your email address above first.');
      setStatus('error');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setStatus('reset-sent');
    } catch {
      setErrorMsg('Could not send reset email. Check the address and try again.');
      setStatus('error');
    }
  };

  const isLogin = mode === 'login';

  return (
    <>
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, var(--t-deep) 0%, var(--t-mid) 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem, 5vw, 2rem)', overflow:'auto' }}>
      <div className="animate-scale-in" style={{ background:'white', borderRadius:'24px', padding:'clamp(1.5rem, 4vh, 2.5rem)', maxWidth:'420px', width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>

        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'linear-gradient(135deg, var(--t-mid), var(--t-deep))', margin:'0 auto 0.75rem', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(10,47,31,0.32)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 className="taronga-title" style={{ fontSize:'clamp(1.6rem, 4vh, 2rem)', color:'var(--t-deep)', marginBottom:'0.3rem', letterSpacing:'0.04em' }}>Teacher Access</h2>
          <p style={{ color:'#666', fontSize:'0.9rem' }}>{isLogin ? 'Sign in to your Taronga Tracka account' : 'Create your Taronga Tracka account'}</p>
        </div>

        <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'var(--t-deep)', marginBottom:'0.35rem' }}>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setStatus('idle'); }}
          placeholder="you@school.edu.au"
          style={{ width:'100%', padding:'0.75rem 1rem', borderRadius:'var(--t-r-md)', border:`2px solid ${status === 'error' ? '#ef4444' : '#E5E5E5'}`, fontSize:'1rem', fontFamily:'DM Sans, sans-serif', marginBottom:'0.75rem', boxSizing:'border-box', outline:'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--t-mid)'}
          onBlur={e  => e.target.style.borderColor = status === 'error' ? '#ef4444' : '#E5E5E5'}
          onKeyDown={e => e.key === 'Enter' && isLogin && isLoginValid && handleSignIn()}
          disabled={status === 'loading'}
        />

        <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'var(--t-deep)', marginBottom:'0.35rem' }}>Password{!isLogin && <span style={{ color:'#999', fontWeight:400 }}> (min. 6 characters)</span>}</label>
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setStatus('idle'); }}
          placeholder="••••••••"
          style={{ width:'100%', padding:'0.75rem 1rem', borderRadius:'var(--t-r-md)', border:`2px solid ${status === 'error' ? '#ef4444' : '#E5E5E5'}`, fontSize:'1rem', fontFamily:'DM Sans, sans-serif', marginBottom:'0.75rem', boxSizing:'border-box', outline:'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--t-mid)'}
          onBlur={e  => e.target.style.borderColor = status === 'error' ? '#ef4444' : '#E5E5E5'}
          onKeyDown={e => e.key === 'Enter' && isLogin && isLoginValid && handleSignIn()}
          disabled={status === 'loading'}
        />

        {!isLogin && (
          <>
            <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'var(--t-deep)', marginBottom:'0.35rem' }}>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setStatus('idle'); }}
              placeholder="••••••••"
              style={{ width:'100%', padding:'0.75rem 1rem', borderRadius:'var(--t-r-md)', border:`2px solid ${status === 'error' ? '#ef4444' : confirm && confirm !== password ? '#ef4444' : '#E5E5E5'}`, fontSize:'1rem', fontFamily:'DM Sans, sans-serif', marginBottom: confirm && confirm !== password ? '0.4rem' : '0.75rem', boxSizing:'border-box', outline:'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--t-mid)'}
              onBlur={e  => e.target.style.borderColor = confirm && confirm !== password ? '#ef4444' : '#E5E5E5'}
              onKeyDown={e => e.key === 'Enter' && isRegisterValid && handleRegister()}
              disabled={status === 'loading'}
            />
            {confirm && confirm !== password && (
              <p style={{ color:'#ef4444', fontSize:'0.8rem', marginBottom:'0.75rem', marginTop:0 }}>Passwords do not match.</p>
            )}
          </>
        )}

        {status === 'error' && (
          <p style={{ color:'#ef4444', fontSize:'0.8rem', marginBottom:'0.75rem', marginTop:0 }}>{errorMsg}</p>
        )}
        {status === 'reset-sent' && (
          <p style={{ color:'#1B6B3A', fontSize:'0.8rem', marginBottom:'0.75rem', marginTop:0 }}>Password reset email sent - check your inbox.</p>
        )}

        {isLogin && (
          <button
            onClick={handleForgotPassword}
            style={{ display:'block', background:'none', border:'none', color:'var(--t-mid)', fontSize:'0.82rem', cursor:'pointer', padding:'0 0 1rem', fontWeight:600 }}>
            Forgot password?
          </button>
        )}

        {!isLogin && (
          <>
            <label style={{ display:'flex', gap:'0.65rem', alignItems:'flex-start', marginBottom:'0.85rem', cursor:'pointer' }}>
              <input
                type="checkbox"
                checked={commsOptIn}
                onChange={e => setCommsOptIn(e.target.checked)}
                style={{ marginTop:'3px', accentColor:'var(--t-mid)', width:'15px', height:'15px', flexShrink:0, cursor:'pointer' }}
              />
              <span style={{ fontSize:'0.78rem', color:'#555', lineHeight:1.6 }}>
                I'm happy to receive education updates, news, and resources from Taronga. <span style={{ color:'#999' }}>(Optional)</span>
              </span>
            </label>
            <p style={{ fontSize:'0.75rem', color:'#888', lineHeight:1.55, marginBottom:'0.9rem', marginTop:0 }}>
              By creating an account you agree to our{' '}
              <button onClick={() => setLegalDoc('terms')} style={{ background:'none', border:'none', color:'var(--t-mid)', fontWeight:700, fontSize:'0.75rem', cursor:'pointer', padding:0 }}>Terms of Use</button>
              {' '}and{' '}
              <button onClick={() => setLegalDoc('privacy')} style={{ background:'none', border:'none', color:'var(--t-mid)', fontWeight:700, fontSize:'0.75rem', cursor:'pointer', padding:0 }}>Privacy Policy</button>.
            </p>
          </>
        )}

        <button
          onClick={isLogin ? handleSignIn : handleRegister}
          disabled={isLogin ? (!isLoginValid || status === 'loading') : (!isRegisterValid || status === 'loading')}
          style={{ width:'100%', padding:'0.85rem', borderRadius:'var(--t-r-pill)', border:'none', background: (isLogin ? isLoginValid : isRegisterValid) && status !== 'loading' ? 'linear-gradient(135deg, var(--t-mid), var(--t-deep))' : '#CCC', color:'white', fontSize:'1.05rem', fontWeight:700, cursor: (isLogin ? isLoginValid : isRegisterValid) && status !== 'loading' ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.08em', transition:'all 0.3s ease', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
          {status === 'loading' ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation:'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              {isLogin ? 'Signing in…' : 'Creating account…'}
            </>
          ) : isLogin ? 'Sign In' : 'Create Account'}
        </button>

        {isLogin ? (
          <button
            onClick={() => switchMode('register')}
            style={{ display:'block', width:'100%', marginTop:'1rem', padding:'0.75rem', borderRadius:'var(--t-r-pill)', border:'2px solid var(--t-mid)', background:'transparent', color:'var(--t-mid)', fontSize:'0.95rem', fontWeight:700, cursor:'pointer', textAlign:'center', transition:'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-mid)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--t-mid)'; }}>
            No account yet? Create one free →
          </button>
        ) : (
          <p style={{ textAlign:'center', marginTop:'1rem', marginBottom:0, fontSize:'0.85rem', color:'#666' }}>
            Already have an account?{' '}
            <button onClick={() => switchMode('login')} style={{ background:'none', border:'none', color:'var(--t-mid)', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', padding:0 }}>
              Sign in
            </button>
          </p>
        )}

        <button
          onClick={() => setCurrentScreen('home')}
          style={{ display:'block', width:'100%', background:'none', border:'none', color:'#999', fontSize:'0.82rem', cursor:'pointer', marginTop:'0.75rem', padding:'0.4rem', transition:'color 0.18s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#666'}
          onMouseLeave={e => e.currentTarget.style.color = '#999'}>
          ← Back
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
    {legalDoc && <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />}
    </>
  );
}
