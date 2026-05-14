import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import { getStageQuestions } from '../../utils/helpers';
import MathsCalculator from '../../components/MathsCalculator';

export default function BushwalkMission() {
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const {
    currentAnimal,
    showResult, setShowResult,
    isCorrect, setIsCorrect,
    setIsProcessingAnswer,
    setFirstAttemptResults,
    handleNextQuestion,
  } = useStudent();

  const [clueIdx,      setClueIdx]      = useState(0);
  const [selected,     setSelected]     = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [results,      setResults]      = useState([]); // boolean per clue
  const [miniKeyOpen,  setMiniKeyOpen]  = useState(false);

  const CLUES = [
    {
      label: 'Clue 1 — Cipher',
      clue: 'I am a mammal, but I lay eggs.\nI swim and hide near moving water.\n\nUse the mini key to solve where to find me.\n\nSecret location code:\n23 – 1 – 20 – 5 – 18 – 6 – 1 – 12 – 12',
    },
    {
      label: 'Clue 2 — Ratio',
      clue: 'Find the 4:1 Animal\n\nNow find the cold-blooded animal that is about 4 times larger than the real thing.',
    },
    classSubject === 'maths'
      ? {
          label: 'Clue 3 — Sequence',
          clue: 'Find the Mimic Bird\n\nA bird starts with 20 sounds.\nIt learns 4 new sounds each month.\n\nAfter 5 months, how many sounds does it know?\n\n20 + (4 × 5) = ___\n\nNow find the forest bird famous for copying sounds.',
        }
      : {
          label: classStage <= 2 ? 'Clue 3' : 'Clue 3 — Riddle',
          clue: classStage <= 2
            ? 'Which bird copies sounds?'
            : 'I live in the forest, hidden from sight,\nMy voice can copy sounds day and night.\nChainsaws, cameras, even a call,\nI can mimic almost them all…',
        },
  ];

  const questions      = getStageQuestions(currentAnimal, classStage, classSubject);
  const clue           = CLUES[clueIdx];
  const q              = questions[clueIdx];
  const isClueCorrect  = selected !== null && selected === q?.correct;
  const correctCount   = results.filter(Boolean).length;

  const handleSelect = (idx) => {
    if (showFeedback) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = selected === q?.correct;
    if (!correct) {
      setShowFeedback(true);
      setTimeout(() => { setShowFeedback(false); setSelected(null); }, 1200);
      return;
    }
    setResults(prev => [...prev, true]);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    const nextIdx = clueIdx + 1;
    if (nextIdx >= CLUES.length) {
      const allResults = [...results, isClueCorrect];
      const newFAR = {};
      allResults.forEach((r, i) => { newFAR[i] = r; });
      setFirstAttemptResults(newFAR);
      setIsProcessingAnswer(true);
      const allCorrect = allResults.filter(Boolean).length === CLUES.length;
      setIsCorrect(allCorrect);
      setShowResult(true);
    } else {
      setClueIdx(nextIdx);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  return (
    <div style={{ position:'fixed', inset:0, background: showResult ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'var(--mist-light)', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'linear-gradient(135deg,var(--jungle-deep) 0%,var(--jungle-mid) 100%)', padding:'0.6rem 1rem', flex:'0 0 auto', zIndex:100 }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={() => setCurrentScreen('map')} style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'white', padding:'0.5rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>← Back</button>
          <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto' }} onError={e => e.target.style.display='none'} />
          <div style={{ width:'70px' }} />
        </div>
      </div>

      {showResult && (
        <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem,2vh,1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto', marginTop:'clamp(1rem,3vh,2rem)' }}>
          <div style={{ fontSize:'clamp(3rem,8vh,4rem)', marginBottom:'0.5rem' }}>🌿</div>
          <h2 className="heading-display" style={{ fontSize:'clamp(1.8rem,4.5vh,2.8rem)', color:'#10b981', marginBottom:'0.4rem', lineHeight:1.1 }}>
            Hunt Complete!
          </h2>
          <p style={{ fontSize:'clamp(0.85rem,2vh,1rem)', color:'#555', marginBottom:'1rem', lineHeight:1.6 }}>
            You solved {Math.min(correctCount + (isClueCorrect ? 1 : 0), CLUES.length)} of {CLUES.length} clues.
          </p>
          <button onClick={() => handleNextQuestion(1)}
            style={{ background:'linear-gradient(135deg,#5B8C5A,#3d6b3c)', color:'white', border:'none', padding:'1rem 2.5rem', fontSize:'1.1rem', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)' }}>
            Continue to Observation →
          </button>
        </div>
      )}

      {!showResult && (
        <div style={{ flex:'1 1 auto', overflowY:'auto', padding:'1rem', maxWidth:'560px', margin:'0 auto', width:'100%' }}>

          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1rem 1.2rem', boxShadow:'var(--t-shadow-md)', marginBottom:'1rem' }}>
            <h2 style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--jungle-deep)', margin:'0 0 0.15rem' }}>Bushwalk Scavenger Hunt</h2>
            <p style={{ fontSize:'0.82rem', color:'#666', margin:'0 0 0.6rem' }}>Solve each clue as you explore</p>
            <div style={{ display:'flex', gap:'0.4rem' }}>
              {CLUES.map((_, i) => (
                <div key={i} style={{ flex:1, height:'6px', borderRadius:'3px', transition:'background 0.3s', background: i < clueIdx ? '#5B8C5A' : i === clueIdx ? (showFeedback ? (isClueCorrect ? '#10b981' : '#ef4444') : '#C4873A') : '#E5E5E5' }} />
              ))}
            </div>
            <p style={{ fontSize:'0.72rem', color:'#888', margin:'0.4rem 0 0', textAlign:'right' }}>Clue {clueIdx + 1} of {CLUES.length}</p>
          </div>

          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1.4rem', boxShadow:'var(--t-shadow-md)', marginBottom:'1rem' }}>
            <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#5B8C5A', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.6rem' }}>{clue?.label}</p>
            <div style={{ background:'#F4F8F4', borderRadius:'var(--t-r-sm)', padding:'1rem', marginBottom:'1rem', borderLeft:'3px solid #5B8C5A' }}>
              {clue?.clue.split('\n').map((line, i) => (
                <p key={i} style={{ fontSize: clue.label.includes('Riddle') ? '0.95rem' : '1rem', color:'#333', margin: i === 0 ? 0 : '0.3rem 0 0', lineHeight:1.7, fontStyle: clue.label.includes('Riddle') ? 'italic' : 'normal', fontWeight: line.startsWith('Secret location') ? 700 : 'normal' }}>{line}</p>
              ))}
              {clueIdx === 0 && (
                <div style={{ marginTop:'0.85rem' }}>
                  <button onClick={() => setMiniKeyOpen(o => !o)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', background:'#E3EEE3', border:'1px solid #5B8C5A', borderRadius:miniKeyOpen ? 'var(--t-r-xs) var(--t-r-xs) 0 0' : 'var(--t-r-xs)', padding:'0.38rem 0.8rem', cursor:'pointer', fontSize:'0.78rem', fontWeight:700, color:'#3d5c3c' }}>
                    <span>Mini Key (A → Z)</span>
                    <span style={{ fontSize:'0.7rem' }}>{miniKeyOpen ? '▴' : '▾'}</span>
                  </button>
                  {miniKeyOpen && (
                    <div style={{ background:'white', border:'1px solid #5B8C5A', borderTop:'none', borderRadius:'0 0 var(--t-r-xs) var(--t-r-xs)', padding:'0.5rem 0.75rem' }}>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'0.25rem', textAlign:'center' }}>
                        {[['A','1'],['E','5'],['F','6'],['L','12'],['R','18'],['T','20'],['W','23']].map(([letter, num]) => (
                          <div key={letter} style={{ background:'#F4F8F4', borderRadius:'4px', padding:'0.3rem 0.1rem' }}>
                            <div style={{ fontSize:'0.82rem', fontWeight:800, color:'#3d5c3c' }}>{letter}</div>
                            <div style={{ fontSize:'0.75rem', color:'#555' }}>{num}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <p style={{ fontSize:'0.9rem', fontWeight:600, color:'var(--jungle-deep)', margin:'0 0 0.75rem', textAlign:'center' }}>{q?.q}</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
              {(q?.options || []).map((opt, oi) => (
                <button key={oi} onClick={() => handleSelect(oi)} disabled={showFeedback}
                  style={{ padding:'0.85rem 0.6rem', borderRadius:'var(--t-r-md)', border:`2px solid ${selected===oi?'#5B8C5A':'#E5E5E5'}`, background:selected===oi?'#F0F7F0':'#F8F8F8', color:'var(--jungle-deep)', fontSize:'0.88rem', fontWeight:600, cursor:showFeedback?'default':'pointer', textAlign:'left', transition:'all 0.15s', opacity:showFeedback&&selected!==oi?0.5:1 }}>
                  {String.fromCharCode(65 + oi)}. {opt}
                </button>
              ))}
            </div>
          </div>

          {showFeedback && (
            <div style={{ background:isClueCorrect?'#D1FAE5':'#FEE2E2', border:`1px solid ${isClueCorrect?'#6EE7B7':'#FCA5A5'}`, borderRadius:'var(--t-r-md)', padding:'0.85rem 1rem', marginBottom:'1rem', textAlign:'center' }}>
              <p style={{ fontSize:'0.9rem', fontWeight:700, color:isClueCorrect?'#065F46':'#991B1B', margin:0 }}>
                {isClueCorrect ? '✓ Great observation! Keep going.' : '✕ Look carefully and try the next clue.'}
              </p>
            </div>
          )}

          <MathsCalculator />

          {!showFeedback ? (
            <button onClick={handleSubmit} disabled={selected === null}
              style={{ width:'100%', padding:'1rem', borderRadius:'var(--t-r-pill)', border:'none', background:selected!==null?'linear-gradient(135deg,#5B8C5A,#3d6b3c)':'#CCC', color:'white', fontSize:'1rem', fontWeight:700, cursor:selected!==null?'pointer':'not-allowed', textTransform:'uppercase', letterSpacing:'0.08em', transition:'all 0.2s', boxShadow:selected!==null?'0 4px 12px rgba(91,140,90,0.4)':'none' }}>
              Submit Answer
            </button>
          ) : (
            <button onClick={handleContinue}
              style={{ width:'100%', padding:'1rem', borderRadius:'var(--t-r-pill)', border:'none', background:'linear-gradient(135deg,var(--sunset-orange),var(--earth-clay))', color:'white', fontSize:'1rem', fontWeight:700, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:'0 4px 12px rgba(232,106,51,0.4)' }}>
              {clueIdx < CLUES.length - 1 ? 'Next Clue →' : 'Complete Mission ✓'}
            </button>
          )}

        </div>
      )}
    </div>
  );
}
