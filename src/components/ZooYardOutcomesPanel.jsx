import { zooyardOutcomesFor, using2024Syllabus, ZOOYARD_OUTCOMES_NOTE, ZOOYARD_STAGE2_2024_NOTE, SYLLABUS_2024_FROM } from '../data/zooyardOutcomes';
import { ZOOYARD_ANIMALS } from '../data/zooyardAnimals';

// ZooYardOutcomesPanel — the ZooYard view inside Curriculum Alignment.
//
// Modelled on modes/wildest-dreams/components/OutcomesPanel.jsx. Deliberately NOT the
// four-subject layout the rest of that screen uses: that layout is built around exhibits, a zoo
// map and a route, and ZooYard happens in a schoolyard with none of those.
//
// ⚠️ Unlike Wildest Dreams, ZooYard IS marked, so this panel does show the mark scheme. What it
//    must NOT do is imply a data-collection claim — see the warning block below and the long
//    explanation at the top of data/zooyardOutcomes.js.
const ACCENT = '#4ecbcb';

export default function ZooYardOutcomesPanel({ stage }) {
  // ⚠️ Year-aware. NSW teaches Science and Technology K–6 (2024) from 2027, so this flips
  //    itself on 1 January 2027 and nobody has to remember.
  const entry = zooyardOutcomesFor(stage);
  const { outcomes, syllabus } = entry;
  const is2024 = using2024Syllabus();
  const thinStage2 = is2024 && Number(stage) === 2;

  return (
    <>
      <div style={{ marginBottom:'1.25rem' }}>
        <h2 className="taronga-title" style={{ margin:0, fontSize:'2rem', color:'var(--t-deep)', fontWeight:400, letterSpacing:'0.03em', lineHeight:1.1 }}>
          ZooYard · Stage {stage}
        </h2>
        <p style={{ margin:'0.3rem 0 0', fontSize:'0.78rem', color:'var(--t-slate)', fontWeight:500 }}>
          Habitat science in your own schoolyard · {syllabus}
        </p>
      </div>

      {/* ⚠️ Stated BEFORE the outcome list, so nobody skims the codes and assumes a data claim. */}
      <div style={{ background:'var(--t-foam)', border:'1px solid var(--t-stone)', borderRadius:'var(--t-r-lg)', padding:'0.9rem 1.1rem', marginBottom:'1rem' }}>
        <p style={{ margin:0, fontSize:'0.78rem', color:'var(--t-charcoal)', lineHeight:1.6 }}>
          {ZOOYARD_OUTCOMES_NOTE}
        </p>
      </div>

      {/* The honesty block. Two real caveats a head teacher will ask about. */}
      <div style={{ background:'#FFF8E8', border:'1px solid #E8C97A', borderRadius:'var(--t-r-lg)', padding:'0.9rem 1.1rem', marginBottom:'1.5rem' }}>
        <p style={{ margin:'0 0 0.5rem', fontSize:'0.72rem', fontWeight:800, color:'#6B5214', textTransform:'uppercase', letterSpacing:'0.08em' }}>
          About these outcomes
        </p>
        <p style={{ margin:0, fontSize:'0.76rem', color:'#6B5214', lineHeight:1.6 }}>
          The outcome codes and descriptions shown here have been checked against the NSW
          syllabus.
          {is2024
            ? <> These are the <strong>{syllabus}</strong> outcomes, which NSW schools teach from{' '}
              {SYLLABUS_2024_FROM}. A school still teaching the 2017 syllabus should report against
              that instead — it remains available until December 2028.</>
            : <> These are the <strong>{syllabus}</strong> outcomes. NSW schools begin teaching
              Science and Technology K–6 (2024) from {SYLLABUS_2024_FROM}, and this page switches
              to it automatically then.</>}
        </p>
      </div>

      {/* ⚠️ Stage 2 of the 2024 syllabus genuinely yields ONE claimable outcome. Say so rather
          than letting a short list look like an oversight. */}
      {thinStage2 && (
        <div style={{ background:'#FDECEC', border:'1px solid #E8A9A9', borderRadius:'var(--t-r-lg)', padding:'0.9rem 1.1rem', marginBottom:'1.5rem' }}>
          <p style={{ margin:'0 0 0.5rem', fontSize:'0.72rem', fontWeight:800, color:'#8B2F2F', textTransform:'uppercase', letterSpacing:'0.08em' }}>
            Stage 2 is thin under this syllabus
          </p>
          <p style={{ margin:0, fontSize:'0.76rem', color:'#8B2F2F', lineHeight:1.6 }}>{ZOOYARD_STAGE2_2024_NOTE}</p>
        </div>
      )}

      <h3 className="lms-section-heading" style={{ marginBottom:'0.2rem' }}>Outcomes Addressed</h3>
      <p style={{ fontSize:'0.72rem', color:'var(--t-slate)', margin:'0 0 0.9rem', lineHeight:1.6, maxWidth:'62ch' }}>
        Every habitat follows the same five beats, so these outcomes are addressed once per
        habitat rather than once across the mode.
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'0.9rem', marginBottom:'1.75rem' }}>
        {outcomes.map(o => (
          <div key={o.code} style={{ background:'white', border:'1px solid var(--t-stone)', borderTop:`3px solid ${ACCENT}`, borderRadius:'var(--t-r-lg)', boxShadow:'var(--t-shadow-sm)', padding:'1.05rem 1.15rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
              <span style={{ fontSize:'0.86rem', fontWeight:800, color:'var(--t-deep)', letterSpacing:'0.02em', fontVariantNumeric:'tabular-nums' }}>{o.code}</span>
              <span style={{ fontSize:'0.58rem', fontWeight:700, color:'var(--t-ash)', textTransform:'uppercase', letterSpacing:'0.08em', background:'var(--t-foam)', padding:'0.12rem 0.5rem', borderRadius:999 }}>
                NSW Outcome
              </span>
            </div>
            <p style={{ margin:0, fontSize:'0.78rem', color:'var(--t-charcoal)', lineHeight:1.6 }}>{o.desc}</p>
            <p style={{ margin:'0.65rem 0 0', paddingTop:'0.65rem', borderTop:'1px solid var(--t-foam)', fontSize:'0.72rem', color:'var(--t-slate)', lineHeight:1.6 }}>
              <strong style={{ color:'var(--t-deep)' }}>In the mode: </strong>{o.evidence}
            </p>
          </div>
        ))}
      </div>

      <h3 className="lms-section-heading" style={{ marginBottom:'0.6rem' }}>How the writing is marked</h3>
      <p style={{ fontSize:'0.76rem', color:'var(--t-charcoal)', margin:'0 0 1.25rem', lineHeight:1.6, maxWidth:'70ch' }}>
        Each write-up is scored on three domains out of 5 — <strong>what you saw</strong>,{' '}
        <strong>detail and reasons</strong> and <strong>writing</strong> — which combine into the
        habitat's points. The prompt and the mark scheme both change by stage: Stages 1–2 describe,
        Stage 3 gives a reason, Stages 4–5 explain a mechanism.
      </p>

      <div className="lms-stat-grid">
        <div className="lms-stat-card" style={{ borderTopColor:ACCENT }}>
          <div className="lms-stat-val">{outcomes.length}</div>
          <div className="lms-stat-label">Outcomes addressed</div>
        </div>
        <div className="lms-stat-card" style={{ borderTopColor:ACCENT }}>
          <div className="lms-stat-val">{ZOOYARD_ANIMALS.length}</div>
          <div className="lms-stat-label">Habitats in the schoolyard</div>
        </div>
        <div className="lms-stat-card" style={{ borderTopColor:ACCENT }}>
          <div className="lms-stat-val">{ZOOYARD_ANIMALS.length}</div>
          <div className="lms-stat-label">Conservation builds</div>
        </div>
        <div className="lms-stat-card" style={{ borderTopColor:ACCENT }}>
          <div className="lms-stat-val">0</div>
          <div className="lms-stat-label">Zoo visits required</div>
        </div>
      </div>
    </>
  );
}
