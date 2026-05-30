import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import { getStageQuestions } from '../../utils/helpers';
import MathsCalculator from '../../components/MathsCalculator';

const BAR_DATA = [
  { key:'resting', label:'Resting', emoji:'😴', colour:'#2E7D55' },
  { key:'feeding', label:'Feeding', emoji:'🍌', colour:'#D97706' },
  { key:'moving',  label:'Moving',  emoji:'🌿', colour:'#0284C7' },
];

export default function ChimpMission() {
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const {
    currentAnimal, showResult, setShowResult, isCorrect,
    setIsProcessingAnswer, handleQuizAnswer, handleNextQuestion,
    setMissionContext,
  } = useStudent();

  const [graph, setGraph] = useState({ resting: 30, feeding: 30, moving: 40 });

  const total  = graph.resting + graph.feeding + graph.moving;
  const isValid = total === 100;
  const barMax  = Math.max(graph.resting, graph.feeding, graph.moving, 1);

  const setBar = (key, val) => {
    setGraph(prev => ({ ...prev, [key]: Math.max(0, Math.min(100, Number(val))) }));
  };

  const submitAnswer = (answerIndex) => {
    if (!isValid) return;
    const { resting, feeding, moving } = graph;
    const max = Math.max(resting, feeding, moving);
    const tops = [resting, feeding, moving].filter(v => v === max);
    let correctIndex;
    if (tops.length > 1) correctIndex = 3; // All equal
    else if (resting === max) correctIndex = 0;
    else if (feeding === max) correctIndex = 1;
    else correctIndex = 2;
    handleQuizAnswer(0, answerIndex, correctIndex);
  };

  const stageQ = getStageQuestions(currentAnimal, classStage, classSubject)[0];
  const fact = stageQ?.stageFacts?.[classStage] || stageQ?.fact;

  return (
    <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)') : 'linear-gradient(160deg,#071A0C 0%,#0D3320 55%,#0A1F0E 100%)', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>

      {!showResult && <img src="images/chimpanzee.jpg" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', opacity:0.1, pointerEvents:'none' }} />}

      <div style={{ background:'rgba(0,0,0,0.3)', backdropFilter:'blur(4px)', padding:'0.6rem 1rem', flex:'0 0 auto', zIndex:100, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth:'600px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={() => setCurrentScreen('map')} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'0.45rem 1rem', borderRadius:'var(--t-r-pill)', cursor:'pointer', fontSize:'0.82rem', fontWeight:600 }}>← Back</button>
          <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'40px', width:'auto', opacity:0.85 }} onError={e => e.target.style.display='none'} />
          <div style={{ width:'70px' }} />
        </div>
      </div>

      {showResult && (
        <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem,3vh,2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem,2vh,1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto', marginTop:'clamp(1rem,3vh,2rem)', position:'relative', zIndex:1 }}>
          <div style={{ fontSize:'clamp(3rem,8vh,4.5rem)', marginBottom:'0.5rem' }}>{isCorrect ? '✓' : '✗'}</div>
          <h2 className="heading-display" style={{ fontSize:'clamp(2rem,5vh,3rem)', color: isCorrect ? '#10b981' : '#ef4444', marginBottom:'0.4rem', lineHeight:1.1 }}>{isCorrect ? 'Correct!' : 'Try Again'}</h2>
          {isCorrect && <p style={{ fontSize:'clamp(0.95rem,2.2vh,1.1rem)', color:'#555', marginBottom:'0.8rem', fontStyle:'italic' }}>Great data interpretation!</p>}
          {isCorrect && fact && classSubject !== 'maths' && (
            <div style={{ background:'linear-gradient(135deg,#FFF9E6 0%,#FFE6B3 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem,2vh,1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
              <p style={{ color:'#333', fontSize:'clamp(0.9rem,2vh,1.1rem)', lineHeight:1.5, fontWeight:500 }}>💡 {fact}</p>
            </div>
          )}
          <button onClick={() => { if (isCorrect) { setMissionContext({ type: 'chimp-behaviour', resting: graph.resting, feeding: graph.feeding, moving: graph.moving }); handleNextQuestion(1); } else { setIsProcessingAnswer(false); setShowResult(false); } }}
            style={{ background: isCorrect ? 'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))' : 'linear-gradient(135deg,#DC2626,#991B1B)', color:'white', border:'none', padding:'clamp(0.8rem,2vh,1.2rem) clamp(2rem,5vw,3rem)', fontSize:'clamp(1rem,2.5vh,1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', marginTop:'0.5rem' }}>
            {isCorrect ? 'Continue to Observation →' : 'Try Again'}
          </button>
        </div>
      )}

      {!showResult && (
        <div style={{ flex:'1 1 auto', overflowY:'auto', padding:'1rem 1rem 2rem', maxWidth:'600px', margin:'0 auto', width:'100%', position:'relative', zIndex:1 }}>

          <div style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.13)', borderRadius:'16px', padding:'1.25rem 1.3rem', marginBottom:'1rem', backdropFilter:'blur(8px)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
              <span style={{ fontSize:'1.8rem' }}>🐒</span>
              <div>
                <p style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(100,220,140,0.85)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.2rem' }}>Data Collection Activity</p>
                <h2 style={{ fontSize:'1.15rem', fontWeight:700, color:'white', margin:0, lineHeight:1.2 }}>Chimpanzee Behaviour Graph</h2>
              </div>
            </div>
            {classStage <= 2 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem' }}>
                {[['1','Watch the chimpanzees 🔍'],['2','Adjust the sliders to match what you see 📊'],['3','Pick which behaviour is most common ✅']].map(([n,s]) => (
                  <div key={n} style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start' }}>
                    <span style={{ background:'rgba(100,220,140,0.25)', color:'rgba(100,220,140,0.9)', borderRadius:'50%', width:'18px', height:'18px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:800, flexShrink:0 }}>{n}</span>
                    <span style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.75)', lineHeight:1.4 }}>{s}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.65)', margin:0, lineHeight:1.55 }}>
                Scientists collect <strong style={{ color:'rgba(255,255,255,0.9)' }}>ethogram data</strong> to understand how animals spend their time. Observe the chimps and build a graph that reflects their behaviour.
              </p>
            )}
          </div>

          <div style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.13)', borderRadius:'16px', padding:'1.25rem', marginBottom:'1rem', backdropFilter:'blur(8px)' }}>
            <p style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(100,220,140,0.85)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 1rem' }}>Adjust Behaviour Percentages</p>
            {BAR_DATA.map(({ key, label, emoji, colour }) => (
              <div key={key} style={{ marginBottom:'1.1rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem' }}>
                  <span style={{ fontSize:'0.9rem', fontWeight:700, color:'white', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                    <span style={{ fontSize:'1.1rem' }}>{emoji}</span> {label}
                  </span>
                  <span style={{ fontSize:'1rem', fontWeight:800, color:colour, background:`${colour}22`, border:`1px solid ${colour}44`, borderRadius:'8px', padding:'0.15rem 0.55rem', minWidth:'48px', textAlign:'center' }}>{graph[key]}%</span>
                </div>
                <input type="range" min="0" max="100" value={graph[key]}
                  onChange={e => setBar(key, e.target.value)}
                  style={{ width:'100%', accentColor: colour, height:'6px', cursor:'pointer' }} />
              </div>
            ))}
            <div style={{ marginTop:'0.25rem', textAlign:'center', padding:'0.55rem 0.8rem', borderRadius:'10px', background: isValid ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', border:`1px solid ${isValid ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}` }}>
              <span style={{ fontSize:'0.88rem', fontWeight:700, color: isValid ? '#4ADE80' : '#F87171' }}>
                Total: {total}% {isValid ? '✓ Ready!' : ' - must equal 100%'}
              </span>
            </div>
          </div>

          <div style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.13)', borderRadius:'16px', padding:'1.25rem', marginBottom:'1rem', backdropFilter:'blur(8px)' }}>
            <p style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(100,220,140,0.85)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 1rem' }}>Your Graph</p>
            <div style={{ display:'flex', gap:'1rem', alignItems:'flex-end', height:'150px', padding:'0 0.5rem' }}>
              {BAR_DATA.map(({ key, label, emoji, colour }) => {
                const pct = Math.round((graph[key] / barMax) * 100);
                return (
                  <div key={key} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', height:'100%', justifyContent:'flex-end' }}>
                    <span style={{ fontSize:'0.8rem', fontWeight:800, color:colour, marginBottom:'0.3rem' }}>{graph[key]}%</span>
                    <div style={{ width:'100%', position:'relative', height:`${pct}%`, minHeight:'6px', borderRadius:'8px 8px 0 0', background:`linear-gradient(to top, ${colour}cc, ${colour})`, transition:'height 0.3s ease' }}>
                      <div style={{ position:'absolute', top:'6px', left:'50%', transform:'translateX(-50%)', fontSize:'1.1rem' }}>{emoji}</div>
                    </div>
                    <div style={{ width:'100%', height:'3px', background:'rgba(255,255,255,0.15)', borderRadius:'0 0 2px 2px' }} />
                    <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.65)', marginTop:'0.35rem', textAlign:'center', fontWeight:600 }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.13)', borderRadius:'16px', padding:'1.25rem', backdropFilter:'blur(8px)' }}>
            <p style={{ fontSize:'0.9rem', fontWeight:700, color:'white', marginBottom:'0.75rem', textAlign:'center', lineHeight:1.4 }}>
              Based on your graph, which behaviour did the chimpanzees spend the <span style={{ color:'rgba(100,220,140,0.9)' }}>MOST</span> time doing?
            </p>
            {!isValid && <p style={{ fontSize:'0.8rem', color:'#FBBF24', textAlign:'center', marginBottom:'0.75rem', fontStyle:'italic' }}>Adjust sliders until total equals 100% to answer.</p>}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              {[
                { label:'Resting',   emoji:'😴', colour:'#2E7D55' },
                { label:'Feeding',   emoji:'🍌', colour:'#D97706' },
                { label:'Moving',    emoji:'🌿', colour:'#0284C7' },
                { label:'All equal', emoji:'⚖️', colour:'#2E7D55' },
              ].map((ans, i) => (
                <button key={i} onClick={() => submitAnswer(i)} disabled={!isValid}
                  style={{ padding:'0.9rem 0.75rem', borderRadius:'12px', border:`2px solid ${isValid ? `${ans.colour}55` : 'rgba(255,255,255,0.08)'}`, background: isValid ? `${ans.colour}18` : 'rgba(255,255,255,0.04)', color: isValid ? 'white' : 'rgba(255,255,255,0.3)', fontSize:'0.88rem', fontWeight:700, cursor: isValid ? 'pointer' : 'not-allowed', textAlign:'center', transition:'all 0.2s', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem' }}>
                  <span style={{ fontSize:'1.4rem' }}>{ans.emoji}</span>
                  <span>{ans.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
