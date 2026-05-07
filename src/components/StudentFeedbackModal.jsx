import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function StudentFeedbackModal({ classCode, studentName, sessionType, onDone }) {
  const [rating,      setRating]      = useState(0);
  const [hovered,     setHovered]     = useState(0);
  const [comment,     setComment]     = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  const submit = async (skip = false) => {
    if (submitting) return;
    setSubmitting(true);
    if (!skip && rating > 0) {
      try {
        await addDoc(collection(db, 'studentFeedback'), {
          rating,
          comment:     comment.trim(),
          classCode:   classCode || '',
          studentName: studentName || '',
          sessionType: sessionType || 'standard',
          timestamp:   new Date().toISOString(),
        });
      } catch (e) { console.warn('Feedback save failed:', e); }
    }
    setSubmitted(true);
    setTimeout(onDone, 480);
  };

  const activeRating = hovered || rating;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }}>
      <div className="animate-scale-in" style={{ background:'white', borderRadius:'24px', padding:'clamp(1.5rem,4vh,2.2rem)', maxWidth:'400px', width:'100%', boxShadow:'0 24px 64px rgba(0,0,0,0.35)', textAlign:'center' }}>

        {submitted ? (
          <>
            <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🐾</div>
            <h3 className="taronga-title" style={{ fontSize:'1.4rem', color:'var(--t-deep)', marginBottom:'0.4rem', letterSpacing:'0.04em' }}>Thanks!</h3>
            <p style={{ color:'var(--t-slate)', fontSize:'0.88rem' }}>Your feedback helps us improve.</p>
          </>
        ) : (
          <>
            <div style={{ fontSize:'2.2rem', marginBottom:'0.65rem' }}>🌿</div>
            <h3 className="taronga-title" style={{ fontSize:'1.35rem', color:'var(--t-deep)', marginBottom:'0.3rem', letterSpacing:'0.04em' }}>How was your time at Taronga?</h3>
            <p style={{ color:'var(--t-slate)', fontSize:'0.83rem', marginBottom:'1.4rem', lineHeight:1.5 }}>Rate your experience today</p>

            {/* Star rating */}
            <div style={{ display:'flex', justifyContent:'center', gap:'0.5rem', marginBottom:'1.25rem' }}>
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  style={{ background:'none', border:'none', cursor:'pointer', padding:'0.1rem', fontSize:'clamp(2rem,7vw,2.4rem)', lineHeight:1, transition:'transform 0.12s ease', transform: activeRating >= star ? 'scale(1.18)' : 'scale(1)', filter: activeRating >= star ? 'none' : 'grayscale(1) opacity(0.35)' }}>
                  ⭐
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="How can we make it better? (optional)"
              rows={3}
              style={{ width:'100%', padding:'0.75rem', borderRadius:'var(--t-r-sm)', border:'1.5px solid var(--t-stone)', fontSize:'0.85rem', fontFamily:'DM Sans, sans-serif', resize:'none', boxSizing:'border-box', outline:'none', color:'var(--t-ink)', background:'var(--t-parchment)', marginBottom:'1.1rem', transition:'border-color 0.2s', lineHeight:1.55 }}
              onFocus={e => e.target.style.borderColor = 'var(--t-mid)'}
              onBlur={e  => e.target.style.borderColor = 'var(--t-stone)'}
            />

            <button
              onClick={() => submit(false)}
              disabled={rating === 0 || submitting}
              style={{ width:'100%', padding:'0.82rem', borderRadius:'var(--t-r-pill)', border:'none', background: rating > 0 ? 'linear-gradient(135deg, var(--t-mid), var(--t-eucalyptus))' : '#DDD', color:'white', fontSize:'0.95rem', fontWeight:700, cursor: rating > 0 ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.6rem', transition:'all 0.2s', boxShadow: rating > 0 ? '0 4px 14px rgba(26,82,56,0.3)' : 'none' }}>
              {submitting ? 'Saving…' : 'Submit Feedback'}
            </button>
            <button
              onClick={() => submit(true)}
              disabled={submitting}
              style={{ background:'none', border:'none', color:'var(--t-ash)', fontSize:'0.8rem', cursor:'pointer', padding:'0.3rem', fontFamily:'DM Sans, sans-serif' }}>
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
}
