import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useApp } from '../context/AppContext';
import LegalModal from '../components/LegalModal';
import nswSchools from '../data/nswPublicSchools.json';

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
  const [schoolInput,  setSchoolInput]  = useState('');
  const [allSchools,   setAllSchools]   = useState([]); // [{name, suburb, postcode}]
  const [schoolSugs,   setSchoolSugs]   = useState([]);
  const [showSugs,     setShowSugs]     = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setStatus('idle');
    setErrorMsg('');
    setPassword('');
    setConfirm('');
    setSchoolInput('');
  };

  // Seed NSW DoE schools + any already-in-Firestore schools when register form opens
  useEffect(() => {
    if (mode !== 'register') return;
    const base = nswSchools.map(s => ({ name: s.name, suburb: s.suburb, postcode: s.postcode }));
    getDocs(collection(db, 'schools'))
      .then(snap => {
        const firestoreNames = new Set(base.map(s => s.name.toLowerCase()));
        const extras = snap.docs
          .map(d => ({ name: (d.data().name || '').trim(), suburb: '', postcode: '' }))
          .filter(s => s.name && !firestoreNames.has(s.name.toLowerCase()));
        setAllSchools([...base, ...extras]);
      })
      .catch(() => setAllSchools(base));
  }, [mode]);

  useEffect(() => {
    const q = schoolInput.trim().toLowerCase();
    if (!q || q.length < 2) { setSchoolSugs([]); return; }
    setSchoolSugs(
      allSchools
        .filter(s => s.name.toLowerCase().includes(q) || s.suburb.toLowerCase().includes(q))
        .slice(0, 12)
    );
  }, [schoolInput, allSchools]);

  const isLoginValid    = email.trim().includes('@') && password.length > 0;
  const isRegisterValid = email.trim().includes('@') && password.length >= 6 && password === confirm && schoolInput.trim().length > 1;

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
      setDoc(doc(db, 'teachers', email.trim().toLowerCase()), { products: arrayUnion('tracka') }, { merge: true }).catch(() => {});
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
        schoolName: schoolInput.trim(),
        commsOptIn,
        createdAt: serverTimestamp(),
        products: arrayUnion('tracka'),
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

  // Neutral "Taronga Education" umbrella palette — deliberately not Tracka green
  // or Wildly's colours, since this screen sits above both products.
  const ink      = '#18181B';
  const inkSoft  = '#3F3F46';
  const border   = '#E4E4E7';
  const muted    = '#71717A';

  return (
    <>
    <div style={{ position:'fixed', inset:0, background:'#F4F4F5', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem, 5vw, 2rem)', overflow:'auto' }}>
      <div className="animate-scale-in" style={{ background:'white', borderRadius:'24px', border:`1px solid ${border}`, padding:'clamp(2rem, 5vh, 3rem)', maxWidth:'480px', width:'100%', boxShadow:'0 24px 70px rgba(24,24,27,0.12), 0 4px 16px rgba(24,24,27,0.06)' }}>

        <div style={{ textAlign:'center', marginBottom:'1.75rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'1.25rem', marginBottom:'1.5rem' }}>
            <img src="/images/tracka-logo-full.png" alt="Taronga Tracka" style={{ height:'96px', width:'auto' }} onError={e => e.target.style.display='none'} />
            <span style={{ color:'#D4D4D8', fontSize:'1.6rem', fontWeight:200 }}>+</span>
            <img src="/images/wildly-logo.png" alt="Wildly by Taronga" style={{ height:'112px', width:'auto' }} onError={e => e.target.style.display='none'} />
          </div>
          <h2 className="taronga-title" style={{ fontSize:'clamp(1.9rem, 4.6vh, 2.3rem)', color:ink, marginBottom:'0.35rem' }}>Taronga Education</h2>
          <p style={{ color:muted, fontSize:'0.78rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'0.65rem' }}>Multiple applications, one log-in</p>
          <p style={{ color:muted, fontSize:'0.92rem', lineHeight:1.5 }}>{isLogin ? 'Sign in to access Taronga Tracka, Wildly by Taronga, and more' : 'Create one account for Taronga Tracka, Wildly by Taronga, and more'}</p>
        </div>

        <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:ink, marginBottom:'0.35rem' }}>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setStatus('idle'); }}
          placeholder="you@school.edu.au"
          style={{ width:'100%', padding:'0.75rem 1rem', borderRadius:'12px', border:`2px solid ${status === 'error' ? '#ef4444' : border}`, fontSize:'1rem', fontFamily:'DM Sans, sans-serif', marginBottom:'0.75rem', boxSizing:'border-box', outline:'none' }}
          onFocus={e => e.target.style.borderColor = ink}
          onBlur={e  => e.target.style.borderColor = status === 'error' ? '#ef4444' : border}
          onKeyDown={e => e.key === 'Enter' && isLogin && isLoginValid && handleSignIn()}
          disabled={status === 'loading'}
        />

        <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:ink, marginBottom:'0.35rem' }}>Password{!isLogin && <span style={{ color:muted, fontWeight:400 }}> (min. 6 characters)</span>}</label>
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setStatus('idle'); }}
          placeholder="••••••••"
          style={{ width:'100%', padding:'0.75rem 1rem', borderRadius:'12px', border:`2px solid ${status === 'error' ? '#ef4444' : border}`, fontSize:'1rem', fontFamily:'DM Sans, sans-serif', marginBottom:'0.75rem', boxSizing:'border-box', outline:'none' }}
          onFocus={e => e.target.style.borderColor = ink}
          onBlur={e  => e.target.style.borderColor = status === 'error' ? '#ef4444' : border}
          onKeyDown={e => e.key === 'Enter' && isLogin && isLoginValid && handleSignIn()}
          disabled={status === 'loading'}
        />

        {!isLogin && (
          <>
            <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:ink, marginBottom:'0.35rem' }}>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setStatus('idle'); }}
              placeholder="••••••••"
              style={{ width:'100%', padding:'0.75rem 1rem', borderRadius:'12px', border:`2px solid ${status === 'error' ? '#ef4444' : confirm && confirm !== password ? '#ef4444' : border}`, fontSize:'1rem', fontFamily:'DM Sans, sans-serif', marginBottom: confirm && confirm !== password ? '0.4rem' : '0.75rem', boxSizing:'border-box', outline:'none' }}
              onFocus={e => e.target.style.borderColor = ink}
              onBlur={e  => e.target.style.borderColor = confirm && confirm !== password ? '#ef4444' : border}
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
          <p style={{ color:inkSoft, fontSize:'0.8rem', marginBottom:'0.75rem', marginTop:0 }}>Password reset email sent - check your inbox.</p>
        )}

        {isLogin && (
          <button
            onClick={handleForgotPassword}
            style={{ display:'block', background:'none', border:'none', color:inkSoft, fontSize:'0.82rem', cursor:'pointer', padding:'0 0 1rem', fontWeight:600 }}>
            Forgot password?
          </button>
        )}

        {!isLogin && (
          <>
            <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:ink, marginBottom:'0.35rem' }}>Your School</label>
            <div style={{ position:'relative', marginBottom:'0.75rem' }}>
              <input
                type="text"
                value={schoolInput}
                onChange={e => { setSchoolInput(e.target.value); setShowSugs(true); setStatus('idle'); }}
                onFocus={() => setShowSugs(true)}
                onBlur={() => setTimeout(() => setShowSugs(false), 150)}
                placeholder="Start typing your school name…"
                style={{ width:'100%', padding:'0.75rem 1rem', borderRadius:'12px', border:`2px solid ${border}`, fontSize:'1rem', fontFamily:'DM Sans, sans-serif', boxSizing:'border-box', outline:'none' }}
                onFocusCapture={e => e.target.style.borderColor = ink}
                onBlurCapture={e  => e.target.style.borderColor = border}
                disabled={status === 'loading'}
              />
              {showSugs && schoolInput.trim().length >= 2 && (
                <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:'white', border:`1.5px solid ${border}`, borderRadius:'12px', boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:20, maxHeight:'220px', overflowY:'auto' }}>
                  {schoolSugs.map(s => (
                    <button key={s.name + s.suburb} onMouseDown={() => { setSchoolInput(s.name); setShowSugs(false); }}
                      style={{ display:'block', width:'100%', padding:'0.55rem 1rem', background:'none', border:'none', textAlign:'left', cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}
                      onMouseEnter={e => e.currentTarget.style.background='#F5F5F5'}
                      onMouseLeave={e => e.currentTarget.style.background='none'}>
                      <div style={{ fontSize:'0.9rem', color:ink, lineHeight:1.3 }}>{s.name}</div>
                      {s.suburb && <div style={{ fontSize:'0.73rem', color:muted, marginTop:'1px' }}>{s.suburb}{s.postcode ? ` ${s.postcode}` : ''}</div>}
                    </button>
                  ))}
                  {!schoolSugs.some(s => s.name.toLowerCase() === schoolInput.trim().toLowerCase()) && (
                    <button onMouseDown={() => { setShowSugs(false); }}
                      style={{ display:'block', width:'100%', padding:'0.65rem 1rem', background:'none', border:'none', borderTop: schoolSugs.length ? '1px solid #F0F0F0' : 'none', textAlign:'left', fontSize:'0.9rem', cursor:'pointer', color:ink, fontFamily:'DM Sans, sans-serif', fontWeight:600 }}
                      onMouseEnter={e => e.currentTarget.style.background='#F4F4F5'}
                      onMouseLeave={e => e.currentTarget.style.background='none'}>
                      + Add "{schoolInput.trim()}"
                    </button>
                  )}
                </div>
              )}
            </div>
            <label style={{ display:'flex', gap:'0.65rem', alignItems:'flex-start', marginBottom:'0.85rem', cursor:'pointer' }}>
              <input
                type="checkbox"
                checked={commsOptIn}
                onChange={e => setCommsOptIn(e.target.checked)}
                style={{ marginTop:'3px', accentColor:ink, width:'15px', height:'15px', flexShrink:0, cursor:'pointer' }}
              />
              <span style={{ fontSize:'0.78rem', color:'#555', lineHeight:1.6 }}>
                I'm happy to receive education updates, news, and resources from Taronga. <span style={{ color:muted }}>(Optional)</span>
              </span>
            </label>
            <p style={{ fontSize:'0.75rem', color:muted, lineHeight:1.55, marginBottom:'0.9rem', marginTop:0 }}>
              By creating an account you agree to our{' '}
              <button onClick={() => setLegalDoc('terms')} style={{ background:'none', border:'none', color:ink, fontWeight:700, fontSize:'0.75rem', cursor:'pointer', padding:0 }}>Terms of Use</button>
              {' '}and{' '}
              <button onClick={() => setLegalDoc('privacy')} style={{ background:'none', border:'none', color:ink, fontWeight:700, fontSize:'0.75rem', cursor:'pointer', padding:0 }}>Privacy Policy</button>.
            </p>
          </>
        )}

        <button
          onClick={isLogin ? handleSignIn : handleRegister}
          disabled={isLogin ? (!isLoginValid || status === 'loading') : (!isRegisterValid || status === 'loading')}
          style={{ width:'100%', padding:'0.85rem', borderRadius:'999px', border:'none', background: (isLogin ? isLoginValid : isRegisterValid) && status !== 'loading' ? ink : '#D4D4D8', color:'white', fontSize:'1.05rem', fontWeight:700, cursor: (isLogin ? isLoginValid : isRegisterValid) && status !== 'loading' ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.08em', transition:'all 0.2s ease', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
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
            style={{ display:'block', width:'100%', marginTop:'1rem', padding:'0.75rem', borderRadius:'999px', border:`2px solid ${ink}`, background:'transparent', color:ink, fontSize:'0.95rem', fontWeight:700, cursor:'pointer', textAlign:'center', transition:'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.background = ink; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ink; }}>
            No account yet? Create one free →
          </button>
        ) : (
          <p style={{ textAlign:'center', marginTop:'1rem', marginBottom:0, fontSize:'0.85rem', color:muted }}>
            Already have an account?{' '}
            <button onClick={() => switchMode('login')} style={{ background:'none', border:'none', color:ink, fontWeight:700, fontSize:'0.85rem', cursor:'pointer', padding:0 }}>
              Sign in
            </button>
          </p>
        )}

        <button
          onClick={() => setCurrentScreen('home')}
          style={{ display:'block', width:'100%', background:'none', border:'none', color:'#A1A1AA', fontSize:'0.82rem', cursor:'pointer', marginTop:'0.75rem', padding:'0.4rem', transition:'color 0.18s' }}
          onMouseEnter={e => e.currentTarget.style.color = muted}
          onMouseLeave={e => e.currentTarget.style.color = '#A1A1AA'}>
          ← Back
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
    {legalDoc && <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />}
    </>
  );
}
