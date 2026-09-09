import { WD_OUTCOMES, WD_OUTCOMES_NOTE, WD_STOPS } from '../content';

// OutcomesPanel — the Wildest Dreams view inside Curriculum Alignment.
//
// Deliberately NOT the four-subject layout the rest of that screen uses. That layout carries
// "Minimum words per response", "Points per observation" and a "How Responses Are Scored"
// rubric, and Wildest Dreams has none of those. Rendering it here would put a mark scheme on a
// mode whose entire premise is that there isn't one.
//
// It sits inside the existing LMS shell and reuses its classes, so it matches the surrounding
// portal without touching any shared component.
const ACCENT = '#1A5238';

export default function OutcomesPanel({ stage }) {
  const entry = WD_OUTCOMES[stage] || WD_OUTCOMES[4];
  const { outcomes, syllabus, lifeSkills } = entry;
  const note = lifeSkills ? WD_OUTCOMES_NOTE.secondary : WD_OUTCOMES_NOTE.primary;

  return (
    <>
      <div style={{ marginBottom:'1.25rem' }}>
        <h2 className="taronga-title" style={{ margin:0, fontSize:'2rem', color:'var(--t-deep)', fontWeight:400, letterSpacing:'0.03em', lineHeight:1.1 }}>
          Wildest Dreams · Stage {stage}
        </h2>
        <p style={{ margin:'0.3rem 0 0', fontSize:'0.78rem', color:'var(--t-slate)', fontWeight:500 }}>
          Video-first documentary mode · {syllabus}
        </p>
      </div>

      {/* The mode's premise, stated before any outcome, so nobody reads the list as a rubric. */}
      <div style={{ background:'var(--t-foam)', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', padding:'0.9rem 1.1rem', marginBottom:'1.5rem' }}>
        <p style={{ margin:0, fontSize:'0.78rem', color:'var(--t-charcoal)', lineHeight:1.6 }}>
          Wildest Dreams is not marked. There is no quiz, no score and no required writing or
          speech. Evidence is the student's own film. These outcomes are for programming and
          reporting, not for grading a student's footage.
        </p>
      </div>

      <h3 className="lms-section-heading" style={{ marginBottom:'0.2rem' }}>
        {lifeSkills ? 'Life Skills Outcomes Addressed' : 'Outcomes Addressed'}
      </h3>
      <p style={{ fontSize:'0.72rem', color:'var(--t-slate)', margin:'0 0 0.9rem', lineHeight:1.6, maxWidth:'62ch' }}>{note}</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'0.9rem', marginBottom:'1.75rem' }}>
        {outcomes.map(o => (
          <div key={o.code} style={{ background:'white', border:'1px solid var(--t-stone)', borderTop:`3px solid ${ACCENT}`, borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1.05rem 1.15rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
              <span style={{ fontSize:'0.86rem', fontWeight:800, color:ACCENT, letterSpacing:'0.02em', fontVariantNumeric:'tabular-nums' }}>{o.code}</span>
              <span style={{ fontSize:'0.58rem', fontWeight:700, color:'var(--t-ash)', textTransform:'uppercase', letterSpacing:'0.08em', background:'var(--t-foam)', padding:'0.12rem 0.5rem', borderRadius:999 }}>
                {lifeSkills ? 'Life Skills' : 'NSW Outcome'}
              </span>
            </div>
            <p style={{ margin:0, fontSize:'0.78rem', color:'var(--t-charcoal)', lineHeight:1.6 }}>{o.desc}</p>
            <p style={{ margin:'0.65rem 0 0', paddingTop:'0.65rem', borderTop:'1px solid var(--t-foam)', fontSize:'0.72rem', color:'var(--t-slate)', lineHeight:1.6 }}>
              <strong style={{ color:'var(--t-deep)' }}>In the mode: </strong>{o.evidence}
            </p>
          </div>
        ))}
      </div>

      <div className="lms-stat-grid">
        <div className="lms-stat-card" style={{ borderTopColor:ACCENT }}>
          <div className="lms-stat-val">{outcomes.length}</div>
          <div className="lms-stat-label">Outcomes addressed</div>
        </div>
        <div className="lms-stat-card" style={{ borderTopColor:ACCENT }}>
          <div className="lms-stat-val">{WD_STOPS.length}</div>
          <div className="lms-stat-label">Animal stops on the route</div>
        </div>
        <div className="lms-stat-card" style={{ borderTopColor:ACCENT }}>
          <div className="lms-stat-val">0</div>
          <div className="lms-stat-label">Written words required</div>
        </div>
        <div className="lms-stat-card" style={{ borderTopColor:ACCENT }}>
          <div className="lms-stat-val">1</div>
          <div className="lms-stat-label">Film each student keeps</div>
        </div>
      </div>
    </>
  );
}
