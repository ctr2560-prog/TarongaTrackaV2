import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { getGuideContent } from '../utils/studentGuideContent';

const AVATAR = (
  <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid #4A9E6B', flexShrink: 0, background: '#e8f5e9', alignSelf: 'flex-end' }}>
    <img src="images/guide-character.png" alt="Dr. Cam" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 12%' }}
      onError={e => { e.target.style.display = 'none'; }} />
  </div>
);

export default function StudentGuide({ screen = 'map', animal = null }) {
  const { classStage, classSubject } = useApp();
  const content = useMemo(
    () => getGuideContent(screen, classStage, classSubject, animal),
    [screen, classStage, classSubject, animal]
  );

  const [open, setOpen]           = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [messages, setMessages]   = useState(() => [
    { from: 'bot', text: content.greeting },
  ]);
  const [options, setOptions]     = useState(() => content.options);
  const [typing, setTyping]       = useState(false);
  const bottomRef  = useRef(null);
  const replyTimer = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => clearTimeout(replyTimer.current);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleOption = (opt) => {
    if (opt.key === 'back') {
      setOptions(content.options);
      return;
    }
    setMessages(m => [...m, { from: 'user', text: opt.label }]);
    setOptions([]);
    setTyping(true);
    clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { from: 'bot', text: content.responses[opt.key] }]);
      setOptions([{ label: '← Ask something else', key: 'back' }]);
    }, 700);
  };

  return createPortal(
    <>
      {/* Speech bubble */}
      {showBubble && !open && (
        <div
          onClick={() => { setOpen(true); setShowBubble(false); }}
          style={{
            position: 'fixed', bottom: '5.4rem', right: '1.2rem', zIndex: 1101,
            background: 'white', borderRadius: '12px', padding: '0.5rem 0.9rem',
            boxShadow: '0 4px 18px rgba(0,0,0,0.18)', border: '1.5px solid rgba(46,125,50,0.25)',
            whiteSpace: 'nowrap', cursor: 'pointer',
            animation: 'sgPopIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            transformOrigin: 'bottom right',
          }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1A5238' }}>Need a hand? 👋</span>
          <div style={{
            position: 'absolute', bottom: '-7px', right: '22px',
            width: '13px', height: '13px', background: 'white',
            border: '1.5px solid rgba(46,125,50,0.25)',
            borderTop: 'none', borderLeft: 'none',
            transform: 'rotate(45deg)',
          }} />
        </div>
      )}

      {/* Floating button */}
      <button
        id="t-guide-btn"
        onClick={() => { setOpen(o => !o); setShowBubble(false); }}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1100,
          width: '62px', height: '62px', borderRadius: '50%', padding: 0,
          background: 'linear-gradient(135deg, #2E7D32, #4A9E6B)',
          border: '3px solid white', cursor: 'pointer', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(26,82,56,0.5)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(26,82,56,0.65)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,82,56,0.5)'; }}
        title="Dr. Cam — Zoo Guide"
      >
        {open ? (
          <span style={{ fontSize: '1.4rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>✕</span>
        ) : imgFailed ? (
          <span style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>🦁</span>
        ) : (
          <img src="images/guide-character.png" alt="Dr. Cam"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 12%' }}
            onError={() => setImgFailed(true)} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 1099,
          width: 'min(340px, calc(100vw - 2rem))',
          height: 'min(480px, calc(100vh - 8rem))',
          background: 'white', borderRadius: '20px',
          boxShadow: '0 12px 48px rgba(0,0,0,0.22)',
          border: '1px solid rgba(46,125,50,0.15)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'sgSlideUp 0.22s ease',
        }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #2E7D32, #4A9E6B)', padding: '0.9rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.6)', flexShrink: 0, background: 'rgba(255,255,255,0.15)' }}>
              {imgFailed ? (
                <span style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>🦁</span>
              ) : (
                <img src="images/guide-character.png" alt="Dr. Cam"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 12%' }}
                  onError={() => setImgFailed(true)} />
              )}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2 }}>Dr. Cam</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', fontWeight: 500 }}>Your Taronga Zoo Guide</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '0.5rem' }}>
                {m.from === 'bot' && AVATAR}
                <div style={{
                  maxWidth: '78%',
                  background: m.from === 'user' ? 'linear-gradient(135deg, #2E7D32, #4A9E6B)' : '#F1F8F2',
                  color: m.from === 'user' ? 'white' : '#1A1A17',
                  padding: '0.6rem 0.9rem',
                  borderRadius: m.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize: '0.84rem', lineHeight: 1.55, fontWeight: 500,
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                {AVATAR}
                <div style={{ background: '#F1F8F2', padding: '0.65rem 1rem', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4A9E6B', animation: `sgBounce 1s ease-in-out ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Options */}
          {options.length > 0 && (
            <div style={{ padding: '0.6rem 0.75rem 0.85rem', borderTop: '1px solid #eef5ee', display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
              {options.map(opt => (
                <button key={opt.key} onClick={() => handleOption(opt)}
                  style={{
                    textAlign: 'left', padding: '0.55rem 0.9rem',
                    borderRadius: '999px', border: '1.5px solid #C8E6C9',
                    background: 'white', color: '#1A5238',
                    fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#2E7D32'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#2E7D32'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'white';   e.currentTarget.style.color = '#1A5238'; e.currentTarget.style.borderColor = '#C8E6C9'; }}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes sgSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sgPopIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes sgBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%           { transform: translateY(-5px); }
        }
      `}</style>
    </>,
    document.body
  );
}
