import { useState, useRef, useEffect } from 'react';
import {
  signInWithEmailAndPassword, getMultiFactorResolver, TotpMultiFactorGenerator,
  RecaptchaVerifier, PhoneAuthProvider, PhoneMultiFactorGenerator, PhoneAuthProvider as PAP,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useApp } from '../context/AppContext';
import { isTarongaStaff } from '../constants/tarongaStaff';

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
  // ⚠️ The second-step challenge. This is shipped BEFORE anyone enrols on purpose — enrolling
  //    first would lock that person out until this existed. See StaffMfaPanel in
  //    AdminDashboardScreen.jsx for the enrolment side and the recovery path.
  const [resolver, setResolver] = useState(null);     // Firebase MultiFactorResolver | null
  const [mfaCode,  setMfaCode]  = useState('');
  // ⚠️ A phone factor needs a code SENT before it can be entered, and a text costs money — so it
  //    is requested once, here, rather than on every keystroke or re-render.
  const [smsId,    setSmsId]    = useState('');
  const verifierRef = useRef(null);
  // ⚠️ The auto-submit fires from inside onChange, which closes over the state of that render.
  //    Calling through a ref means it always runs the latest version, with the code just typed.
  const submitMfaRef = useRef(null);

  const isValid = email.trim().includes('@') && password.length > 0;

  const handleLogin = async () => {
    if (!isValid || status === 'loading') return;
    setStatus('loading');
    setError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      // Root admin, or an entry in `staffAdmins` — the same test firestore.rules applies.
      if (!(await isTarongaStaff(cred.user.email))) {
        // A real account, just not a staff one. Sign straight back out so a teacher who
        // mistypes the portal URL is not left holding a half-privileged session.
        await auth.signOut();
        setError('That account does not have staff access.');
        setStatus('idle');
        return;
      }
      setCurrentScreen('adminDashboard');
    } catch (err) {
      const code = err?.code || '';
      // A correct password on an account with two-step sign-in lands here, not in the success
      // path. The resolver carries the half-finished sign-in; it is completed by the code below.
      if (code === 'auth/multi-factor-auth-required') {
        const r = getMultiFactorResolver(auth, err);
        setResolver(r);
        // A phone factor cannot show a box and wait — the text has to be sent first.
        if (r.hints[0]?.factorId === PAP.PROVIDER_ID) {
          try {
            // ⚠️ A reCAPTCHA token is single use — clear and rebuild, or a second sign-in attempt
            //    fails with `auth/invalid-app-credential`. See the same note in the Control Room.
            try { verifierRef.current?.clear(); } catch { /* nothing rendered yet */ }
            // ⚠️ clear() leaves the old markup behind; a second verifier on a dirty element throws
            //    a plain Error with no `.code`. Empty the host first. See the Control Room note.
            const host = document.getElementById('login-recaptcha');
            if (!host) {
              setError('This screen did not load correctly. Reload the page and sign in again.');
              setStatus('idle');
              return;
            }
            host.innerHTML = '';
            verifierRef.current = new RecaptchaVerifier(auth, 'login-recaptcha', { size: 'invisible' });
            const id = await new PhoneAuthProvider(auth).verifyPhoneNumber(
              { multiFactorHint: r.hints[0], session: r.session }, verifierRef.current);
            setSmsId(id);
          } catch (e) {
            setError(`We could not send your code: ${e?.code || e?.message || 'unknown error'}`);
            console.warn('[mfa] could not send the sign-in code:', e);
          }
        }
        setStatus('idle');
        return;
      }
      // Deliberately one message for both "no such account" and "wrong password": telling an
      // attacker which of the two they got right halves their work.
      setError(code === 'auth/too-many-requests'
        ? 'Too many attempts. Wait a few minutes and try again.'
        : 'Incorrect email or password.');
      setStatus('idle');
    }
  };

  const submitMfa = async () => {
    if (!resolver || mfaCode.trim().length < 6 || status === 'loading') return;
    setStatus('loading'); setError('');
    try {
      // The first enrolled factor. It may be a phone or an authenticator app — both are offered,
      // and the completion differs, so never assume which one this account used.
      const hint = resolver.hints[0];
      const assertion = hint.factorId === PAP.PROVIDER_ID
        ? PhoneMultiFactorGenerator.assertion(PhoneAuthProvider.credential(smsId, mfaCode.trim()))
        : TotpMultiFactorGenerator.assertionForSignIn(hint.uid, mfaCode.trim());
      const cred = await resolver.resolveSignIn(assertion);
      if (!(await isTarongaStaff(cred.user.email))) {
        await auth.signOut();
        setResolver(null); setMfaCode('');
        setError('That account does not have staff access.');
        setStatus('idle');
        return;
      }
      setCurrentScreen('adminDashboard');
    } catch (err) {
      setError(err?.code === 'auth/invalid-verification-code'
        ? 'That code was not accepted. Codes change every 30 seconds, so try the current one.'
        : 'Could not complete sign-in. Try again.');
      setStatus('idle');
    }
  };

  useEffect(() => { submitMfaRef.current = submitMfa; });

  const field = {
    width:'100%', padding:'0.75rem 1rem', borderRadius:'var(--t-r-md)', border:'2px solid #E5E5E5',
    fontSize:'1rem', fontFamily:'DM Sans, sans-serif', marginBottom:'1rem', boxSizing:'border-box',
    transition:'border-color 0.2s', outline:'none',
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, var(--t-deep) 0%, var(--t-mid) 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem, 5vw, 2rem)', overflow:'auto' }}>
      <div className="animate-scale-in" style={{ background:'white', borderRadius:'24px', padding:'clamp(1.5rem, 4vh, 2.5rem)', maxWidth:'420px', width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>

        {/* ⚠️⚠️ THIS MUST RENDER UNCONDITIONALLY, AND IT MUST EXIST BEFORE THE CODE IS REQUESTED.
            It was inside the `resolver ? …` branch, i.e. it only appeared AFTER React re-rendered
            with the resolver set — but the verifier is constructed synchronously in the catch
            block that sets it. So `getElementById` returned null and Firebase threw
            `auth/argument-error`, which says nothing about a missing element, on a screen a
            staff member cannot get past. 🚫 Never put a reCAPTCHA host behind a condition that
            the code requesting it has not yet triggered. */}
        <div id="login-recaptcha" />

        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <h2 className="taronga-title" style={{ fontSize:'clamp(1.6rem, 4vh, 2rem)', color:'var(--t-deep)', marginBottom:'0.3rem', letterSpacing:'0.04em' }}>Taronga Staff Portal</h2>
          <p style={{ color:'#666', fontSize:'0.9rem' }}>Sign in with your Taronga account</p>
        </div>

        {resolver ? (
          <>
            {/* ⚠️ NO QR CODE HERE, and it is not an oversight. The QR at ENROLMENT hands the phone
                a secret once; after that the app generates codes offline and never contacts us
                again, so at sign-in there is literally nothing to encode. 🚫 Do not "add a QR" by
                rendering the otpauth:// URI here — that URI means "add this account", so scanning
                it would enrol a duplicate and make the screen worse, not better. */}
            <p style={{ fontSize:'0.9rem', color:'var(--t-deep)', lineHeight:1.6, marginBottom:'0.35rem', fontWeight:600 }}>
              {resolver.hints[0]?.factorId === PAP.PROVIDER_ID
                ? `We sent a 6-digit code by text${resolver.hints[0]?.phoneNumber ? ` to ${resolver.hints[0].phoneNumber}` : ''}.`
                : 'Open your authenticator app'}
            </p>
            <p style={{ fontSize:'0.82rem', color:'#666', lineHeight:1.6, marginBottom:'1rem' }}>
              {resolver.hints[0]?.factorId === PAP.PROVIDER_ID
                ? 'Enter it below.'
                : 'Enter the 6-digit code shown next to Taronga Tracka. It changes every 30 seconds.'}
            </p>
            {/* ⚠️ `autoComplete="one-time-code"` is load-bearing: if the staff member scanned the
                setup QR with a password manager (Apple Passwords, 1Password) rather than a phone
                app, the code autofills here and there is no phone involved at all. It is the
                smoothest version of this whole flow — worth telling people. */}
            <input value={mfaCode} autoFocus inputMode="numeric" autoComplete="one-time-code"
              placeholder="000000"
              onChange={e => {
                const v = e.target.value.replace(/\D/g,'').slice(0,6);
                setMfaCode(v); setError('');
                // Six digits is always the whole code, so asking for a button press afterwards is
                // a pointless extra step - submit as soon as it can possibly be complete.
                if (v.length === 6) setTimeout(() => submitMfaRef.current?.(), 0);
              }}
              onKeyDown={e => e.key === 'Enter' && submitMfa()}
              style={{ ...field, textAlign:'center', letterSpacing:'0.3em', fontSize:'1.3rem' }} />
            {error && <p role="alert" style={{ color:'#DC2626', fontSize:'0.85rem', margin:'0 0 0.9rem' }}>{error}</p>}
            <button onClick={submitMfa} disabled={mfaCode.length < 6 || status === 'loading'}
              style={{ width:'100%', padding:'0.85rem', borderRadius:'var(--t-r-pill)', border:'none', background: mfaCode.length === 6 ? 'linear-gradient(135deg, var(--sunset-orange), var(--earth-clay))' : '#CCC', color:'white', fontSize:'1.05rem', fontWeight:700, cursor: mfaCode.length === 6 ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.08em' }}>
              {status === 'loading' ? 'Checking…' : 'Continue'}
            </button>
            <p style={{ textAlign:'center', color:'#999', fontSize:'0.78rem', marginTop:'0.9rem', lineHeight:1.5 }}>
              No code? Contact your Taronga administrator.
            </p>
          </>
        ) : (
        <>
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
        </>
        )}

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
