import { useState } from 'react';
import { useApp } from '../context/AppContext';

const SEND_MAGIC_LINK_URL = 'https://sendmagiclink-oy2a6fdxha-ts.a.run.app';

export default function TeacherLoginScreen() {
  const { setCurrentScreen, teacherEmail, setTeacherEmail } = useApp();

  const [status,   setStatus]   = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const isValid = teacherEmail.trim().includes('@') && teacherEmail.trim().includes('.');

  const handleSendLink = async () => {
    if (!isValid) return;
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(SEND_MAGIC_LINK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: teacherEmail.trim(),
          redirectUrl: window.location.origin + window.location.pathname,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      localStorage.setItem('taronga_magic_email', teacherEmail.trim());
      setStatus('sent');
    } catch (err) {
      console.error('Send magic link error:', err);
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  // ── Sent confirmation ──────────────────────────────────────────────────────
  if (status === 'sent') {
    return (
      <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, var(--t-deep) 0%, var(--t-mid) 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem, 5vw, 2rem)', overflowY:'auto' }}>
        <div className="animate-scale-in" style={{ background:'white', borderRadius:'24px', padding:'clamp(1.5rem, 4vh, 2.5rem)', maxWidth:'420px', width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)', textAlign:'center' }}>

          {/* Icon */}
          <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'linear-gradient(135deg,#1B6B3A,#0A2F1F)', margin:'0 auto 1rem', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(10,47,31,0.3)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>

          <h2 className="taronga-title" style={{ fontSize:'1.7rem', color:'var(--t-deep)', marginBottom:'0.3rem' }}>Check your inbox</h2>
          <p style={{ color:'#666', fontSize:'0.88rem', marginBottom:'1rem', lineHeight:1.5 }}>
            We sent a sign-in link to
          </p>
          <p style={{ color:'var(--t-deep)', fontWeight:700, fontSize:'1rem', marginBottom:'1.4rem', wordBreak:'break-all', padding:'0.6rem 1rem', background:'#f5f9f6', borderRadius:'10px' }}>
            {teacherEmail}
          </p>
          <p style={{ color:'#555', fontSize:'0.85rem', lineHeight:1.6, marginBottom:'1.2rem' }}>
            Click the link in the email to access your dashboard. It expires in <strong>1 hour</strong> and can only be used once.
          </p>

          {/* Spam callout */}
          <div style={{ background:'#fff8e6', border:'1px solid #f5d97a', borderRadius:'12px', padding:'0.85rem 1rem', marginBottom:'1.4rem', textAlign:'left' }}>
            <p style={{ margin:'0 0 0.3rem', fontSize:'0.78rem', fontWeight:700, color:'#7a5500', textTransform:'uppercase', letterSpacing:'0.08em' }}>
              📬 Can't find it?
            </p>
            <p style={{ margin:0, fontSize:'0.82rem', color:'#7a5500', lineHeight:1.55 }}>
              Check your <strong>Junk</strong> or <strong>Spam</strong> folder — NSW DET mail filters sometimes catch it. Mark it as <strong>"Not Junk"</strong> once and future links will arrive in your inbox.
            </p>
          </div>

          <button
            onClick={() => setStatus('idle')}
            style={{ background:'none', border:'1px solid #DDD', color:'#666', fontSize:'0.85rem', padding:'0.55rem 1.2rem', borderRadius:'40px', cursor:'pointer', fontWeight:600 }}>
            ← Use a different email
          </button>
        </div>
      </div>
    );
  }

  // ── Email entry ────────────────────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg, var(--t-deep) 0%, var(--t-mid) 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem, 5vw, 2rem)', overflow:'auto' }}>
      <div className="animate-scale-in" style={{ background:'white', borderRadius:'24px', padding:'clamp(1.5rem, 4vh, 2.5rem)', maxWidth:'420px', width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>

        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'linear-gradient(135deg, var(--t-mid), var(--t-deep))', margin:'0 auto 0.75rem', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(10,47,31,0.32)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h2 className="taronga-title" style={{ fontSize:'clamp(1.6rem, 4vh, 2rem)', color:'var(--t-deep)', marginBottom:'0.3rem', letterSpacing:'0.04em' }}>Teacher Access</h2>
          <p style={{ color:'#666', fontSize:'0.9rem' }}>We'll send a secure sign-in link to your email</p>
        </div>

        <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'var(--t-deep)', marginBottom:'0.35rem' }}>Email Address</label>
        <input
          type="email"
          value={teacherEmail}
          onChange={e => { setTeacherEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
          placeholder="you@school.edu.au"
          style={{ width:'100%', padding:'0.75rem 1rem', borderRadius:'var(--t-r-md)', border:`2px solid ${status === 'error' ? '#ef4444' : '#E5E5E5'}`, fontSize:'1rem', fontFamily:'DM Sans, sans-serif', marginBottom: status === 'error' ? '0.4rem' : '1.5rem', boxSizing:'border-box', transition:'border-color 0.2s', outline:'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--t-mid)'}
          onBlur={e  => e.target.style.borderColor = status === 'error' ? '#ef4444' : '#E5E5E5'}
          onKeyDown={e => e.key === 'Enter' && isValid && handleSendLink()}
          disabled={status === 'sending'}
        />

        {status === 'error' && (
          <p style={{ color:'#ef4444', fontSize:'0.8rem', marginBottom:'1rem', marginTop:0 }}>{errorMsg}</p>
        )}

        <button
          onClick={handleSendLink}
          disabled={!isValid || status === 'sending'}
          style={{ width:'100%', padding:'0.85rem', borderRadius:'var(--t-r-pill)', border:'none', background: isValid && status !== 'sending' ? 'linear-gradient(135deg, var(--t-mid), var(--t-deep))' : '#CCC', color:'white', fontSize:'1.05rem', fontWeight:700, cursor: isValid && status !== 'sending' ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.08em', transition:'all 0.3s ease', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
          {status === 'sending' ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation:'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Sending…
            </>
          ) : 'Send Sign-In Link'}
        </button>

        <button
          onClick={() => setCurrentScreen('schoolEntry')}
          style={{ display:'block', width:'100%', background:'none', border:'none', color:'#999', fontSize:'0.82rem', cursor:'pointer', marginTop:'1rem', padding:'0.4rem', transition:'color 0.18s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#666'}
          onMouseLeave={e => e.currentTarget.style.color = '#999'}>
          ← Back
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
