import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import { getStageQuestions } from '../../utils/helpers';

const CORRECT_SEQUENCE = [
  { id:'sun',        label:'☀️ Sun',       desc:'Energy source' },
  { id:'grass',      label:'🌿 Grass',      desc:'Producer' },
  { id:'kangaroo',   label:'🦘 Kangaroo',   desc:'Herbivore' },
  { id:'dingo',      label:'🐕 Dingo',      desc:'Apex predator' },
  { id:'decomposer', label:'🍄 Decomposer', desc:'Breaks down matter' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DingoMission() {
  const { setCurrentScreen, classStage } = useApp();
  const {
    currentAnimal, showResult, setShowResult, isCorrect,
    setIsProcessingAnswer, handleQuizAnswer, handleNextQuestion,
  } = useStudent();

  const [chainItems, setChainItems] = useState([]);
  const [wrongTap,   setWrongTap]   = useState(null);
  const shuffled = useMemo(() => shuffle(CORRECT_SEQUENCE), []);
  const currentQuestion = getStageQuestions(currentAnimal, classStage)[0];
  const correctAnswerIndex = currentQuestion?.correct ?? 0;
  const fact = currentQuestion?.stageFacts?.[classStage] || currentQuestion?.fact;

  const nextExpected   = CORRECT_SEQUENCE[chainItems.length];
  const isCompleteChain = chainItems.length === CORRECT_SEQUENCE.length;

  const tapItem = (id) => {
    if (isCompleteChain) return;
    if (!nextExpected || id !== nextExpected.id) {
      setWrongTap(id);
      setTimeout(() => setWrongTap(null), 700);
      return;
    }
    setChainItems(prev => [...prev, id]);
    setWrongTap(null);
  };

  const Header = () => (
    <div style={{ background:'linear-gradient(135deg,var(--jungle-deep) 0%,var(--jungle-mid) 100%)', padding:'0.6rem 1rem', flex:'0 0 auto', zIndex:100 }}>
      <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <button onClick={() => setCurrentScreen('map')} style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'white', padding:'0.5rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>← Back</button>
        <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto' }} onError={e => e.target.style.display='none'} />
        <div style={{ width:'70px' }} />
      </div>
    </div>
  );

  const ResultCard = ({ feedbackText, factFallback }) => (
    <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem,2vh,1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto', marginTop:'clamp(1rem,3vh,2rem)' }}>
      <div style={{ fontSize:'clamp(3rem,8vh,4.5rem)', marginBottom:'0.5rem' }}>{isCorrect ? '✓' : '✗'}</div>
      <h2 className="heading-display" style={{ fontSize:'clamp(2rem,5vh,3rem)', color:isCorrect?'#10b981':'#ef4444', marginBottom:'0.4rem', lineHeight:1.1 }}>{isCorrect ? 'Correct!' : 'Try Again'}</h2>
      {isCorrect && feedbackText && <p style={{ fontSize:'clamp(0.95rem,2.2vh,1.1rem)', color:'#555', marginBottom:'0.8rem', fontStyle:'italic' }}>{feedbackText}</p>}
      {isCorrect && (fact || factFallback) && (
        <div style={{ background:'linear-gradient(135deg,#FFF9E6 0%,#FFE6B3 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem,2vh,1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
          <p style={{ color:'#333', fontSize:'clamp(0.9rem,2vh,1.1rem)', lineHeight:1.5, fontWeight:500 }}>💡 {fact || factFallback}</p>
        </div>
      )}
      <button onClick={() => { if (isCorrect) { handleNextQuestion(1); } else { setIsProcessingAnswer(false); setShowResult(false); } }}
        style={{ background:isCorrect?'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))':'linear-gradient(135deg,#DC2626,#991B1B)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', marginTop:'0.5rem' }}>
        {isCorrect ? 'Continue to Observation →' : 'Try Again'}
      </button>
    </div>
  );

  // ── Stage 1-2: simple quiz ────────────────────────────────────────────────
  if (classStage <= 2) {
    return (
      <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)') : 'var(--mist-light)', display:'flex', flexDirection:'column' }}>
        <Header />
        {showResult && <ResultCard feedbackText={null} factFallback={currentQuestion?.fact} />}
        {!showResult && (
          <div style={{ flex:'1 1 auto', overflowY:'auto', padding:'1.5rem', maxWidth:'540px', margin:'0 auto', width:'100%' }}>
            <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1.4rem', boxShadow:'var(--t-shadow-md)', marginBottom:'1rem', textAlign:'center' }}>
              <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>🐕</div>
              <h2 style={{ fontSize:'1.3rem', fontWeight:700, color:'var(--jungle-deep)', marginBottom:'0.3rem' }}>Dingo Quiz</h2>
              <p style={{ fontSize:'1rem', fontWeight:600, color:'#444', margin:0 }}>{currentQuestion?.q || 'Which animal does the dingo eat?'}</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              {(currentQuestion?.options || ['A','B','C','D']).map((opt, i) => (
                <button key={i} onClick={() => handleQuizAnswer(0, i, correctAnswerIndex)}
                  style={{ padding:'1.1rem', borderRadius:'14px', border:'2px solid transparent', background:'white', color:'var(--jungle-deep)', fontSize:'1rem', fontWeight:700, cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', transition:'all 0.15s' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Stage 3+: food chain builder + quiz ───────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)') : 'var(--mist-light)', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>
      <Header />
      {showResult && <ResultCard feedbackText="You understand the dingo's place in the ecosystem!" factFallback={null} />}
      {!showResult && (
        <div style={{ flex:'1 1 auto', overflowY:'auto', padding:'1rem', maxWidth:'560px', margin:'0 auto', width:'100%' }}>

          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1rem 1.2rem', boxShadow:'var(--t-shadow-md)', marginBottom:'1rem' }}>
            <h2 style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--jungle-deep)', margin:'0 0 0.2rem' }}>Dingo Food Chain Builder</h2>
            <p style={{ fontSize:'0.82rem', color:'#666', margin:0 }}>Tap the organisms in the correct order to build the food chain, then answer the question.</p>
          </div>

          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1.2rem', boxShadow:'var(--t-shadow-md)', marginBottom:'1rem' }}>
            <div style={{ display:'flex', gap:'0.3rem', marginBottom:'1rem' }}>
              {CORRECT_SEQUENCE.map((item, i) => (
                <div key={item.id} style={{ flex:1, height:'6px', borderRadius:'3px', background: i < chainItems.length ? '#C4873A' : '#E5E5E5', transition:'background 0.3s' }} />
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem', marginBottom:'1rem' }}>
              {shuffled.map((opt) => {
                const placed   = chainItems.includes(opt.id);
                const isNext   = !placed && opt.id === nextExpected?.id && classStage < 5;
                const isWrong  = wrongTap === opt.id;
                return (
                  <button key={opt.id} onClick={() => tapItem(opt.id)} disabled={placed}
                    style={{ padding:'0.75rem 0.6rem', borderRadius:'var(--t-r-md)', border:`2px solid ${isWrong?'#ef4444':placed?'#C4873A':isNext?'#C4873AB0':'#E5E5E5'}`, background:isWrong?'#FEE2E2':placed?'#FDF3E8':isNext?'#FFF8F2':'#F8F8F8', cursor:placed?'default':'pointer', textAlign:'left', transition:'all 0.15s', display:'flex', alignItems:'center', gap:'0.5rem', opacity:placed?0.7:1 }}>
                    <span style={{ fontSize:'1.3rem', flexShrink:0 }}>{opt.label.split(' ')[0]}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'0.82rem', fontWeight:700, color:isWrong?'#ef4444':'var(--jungle-deep)' }}>{opt.label.split(' ').slice(1).join(' ')}</div>
                      <div style={{ fontSize:'0.68rem', color:'#888' }}>{opt.desc}</div>
                    </div>
                    {placed && <span style={{ fontSize:'0.8rem', color:'#C4873A', fontWeight:700, flexShrink:0 }}>✓</span>}
                    {isWrong && <span style={{ fontSize:'0.8rem', color:'#ef4444', fontWeight:700, flexShrink:0 }}>✗</span>}
                  </button>
                );
              })}
            </div>

            {wrongTap && (
              <div style={{ background:'#FEE2E2', border:'1px solid #FCA5A5', borderRadius:'var(--t-r-xs)', padding:'0.5rem 0.75rem', marginBottom:'0.75rem', textAlign:'center' }}>
                <p style={{ fontSize:'0.82rem', color:'#ef4444', fontWeight:600, margin:0 }}>Try again — tap the next correct organism</p>
              </div>
            )}

            {chainItems.length > 0 && (
              <div style={{ background:'#FDF3E8', borderRadius:'var(--t-r-sm)', padding:'0.6rem 0.8rem', border:'1px solid #E8C897' }}>
                <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#C4873A', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.3rem' }}>Your chain so far:</p>
                <p style={{ fontSize:'0.85rem', color:'var(--jungle-deep)', margin:0, lineHeight:1.6 }}>
                  {chainItems.map(id => CORRECT_SEQUENCE.find(o => o.id === id)?.label).join(' → ')}
                  {!isCompleteChain && nextExpected && <span style={{ color:'#aaa' }}> → ?</span>}
                </p>
              </div>
            )}
          </div>

          {!isCompleteChain ? (
            <div style={{ background:'#FFF8F0', border:'1.5px dashed #E8C897', borderRadius:'14px', padding:'1.1rem', textAlign:'center' }}>
              <p style={{ fontSize:'0.9rem', color:'#C4873A', fontWeight:600, margin:0 }}>Complete the food chain to unlock the question</p>
              <p style={{ fontSize:'0.78rem', color:'#888', marginTop:'0.3rem', marginBottom:0 }}>
                {chainItems.length === 0 ? 'Start with the energy source' : `${CORRECT_SEQUENCE.length - chainItems.length} more step${CORRECT_SEQUENCE.length - chainItems.length !== 1 ? 's' : ''} to go`}
              </p>
            </div>
          ) : (
            <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'1.2rem', boxShadow:'var(--t-shadow-md)' }}>
              <div style={{ background:'#D1FAE5', borderRadius:'var(--t-r-xs)', padding:'0.4rem 0.75rem', marginBottom:'0.8rem', textAlign:'center' }}>
                <p style={{ fontSize:'0.78rem', fontWeight:700, color:'#065F46', margin:0 }}>✓ Food chain complete!</p>
              </div>
              <p style={{ fontSize:'0.95rem', fontWeight:600, color:'var(--jungle-deep)', marginBottom:'0.75rem', textAlign:'center' }}>{currentQuestion?.q}</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
                {(currentQuestion?.options || []).map((opt, i) => (
                  <button key={i} onClick={() => handleQuizAnswer(0, i, correctAnswerIndex)}
                    style={{ padding:'0.85rem 0.6rem', borderRadius:'var(--t-r-md)', border:'2px solid transparent', background:'#F8F4EE', color:'var(--jungle-deep)', fontSize:'0.88rem', fontWeight:600, cursor:'pointer', textAlign:'left', transition:'all 0.15s', lineHeight:1.3 }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
