import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { getStageQuestions } from '../utils/helpers';
import MathsCalculator from '../components/MathsCalculator';

// Special mission dispatch - each returns a screen component if it applies
import ChimpMission    from './missions/ChimpMission';
import GorillaMission  from './missions/GorillaMission';
import LionMission     from './missions/LionMission';
import TigerMission    from './missions/TigerMission';
import GiraffeMission  from './missions/GiraffeMission';
import LemurMission    from './missions/LemurMission';
import DingoMission    from './missions/DingoMission';
import SeaLionMission  from './missions/SeaLionMission';
import BushwalkMission     from './missions/BushwalkMission';
import BuffaloMission       from './missions/BuffaloMission';
import ConcertLawnMission   from './missions/ConcertLawnMission';

export default function AnimalScreen() {
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const {
    currentAnimal,
    currentQuestionIndex,
    showResult, setShowResult, isCorrect, isProcessingAnswer, setIsProcessingAnswer,
    handleQuizAnswer: ctxHandleQuizAnswer,
    handleNextQuestion: ctxHandleNextQuestion,
  } = useStudent();

  if (!currentAnimal) {
    setCurrentScreen('map');
    return null;
  }

  // Dispatch to special missions
  if (currentAnimal.id === 'chimpanzee')              return <ChimpMission />;
  if (currentAnimal.id === 'gorilla')                 return <GorillaMission />;
  if (currentAnimal.id === 'lion')                    return <LionMission />;
  if (currentAnimal.id === 'tiger')                   return <TigerMission />;
  if (currentAnimal.id === 'giraffe')                 return <GiraffeMission />;
  if (currentAnimal.id === 'lemur')                   return <LemurMission />;
  if (currentAnimal.id === 'dingo')                   return <DingoMission />;
  if (currentAnimal.id === 'sea-lion')                return <SeaLionMission />;
  if (currentAnimal.id === 'blue-mountains-bushwalk') return <BushwalkMission />;
  if (currentAnimal.id === 'asian-water-buffalo')     return <BuffaloMission />;
  if (currentAnimal.id === 'concert-lawn' && classSubject === 'pdhpe') return <ConcertLawnMission />;

  // Standard quiz path (koala + concert-lawn)
  const questions = getStageQuestions(currentAnimal, classStage, classSubject);
  const currentQuestion = questions[currentQuestionIndex];

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    ctxHandleQuizAnswer(questionIndex, answerIndex, currentQuestion?.correct ?? 0);
  };

  const handleNextQuestion = () => ctxHandleNextQuestion(questions.length);

  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden', background: showResult ? (isCorrect ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)') : 'var(--mist-light)', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>
      {showResult && isCorrect && (
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:1000 }}>
          {[...Array(50)].map((_,i) => (
            <div key={i} style={{ position:'absolute', left:`${Math.random()*100}%`, top:'-20px', width:'10px', height:'10px', background:['#FFD700','#FF6B6B','#4ECDC4','#45B7D1','#FFA07A'][Math.floor(Math.random()*5)], animation:`fall ${2+Math.random()*2}s linear forwards`, animationDelay:`${Math.random()*0.5}s` }} />
          ))}
        </div>
      )}

      {/* Topbar */}
      <div style={{ background:'linear-gradient(135deg, var(--jungle-deep) 0%, var(--jungle-mid) 100%)', padding:'0.6rem 1rem', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', flex:'0 0 auto', zIndex:100 }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); if (showResult) return; if (window.confirm('Leave this question and go back to the map?')) setCurrentScreen('map'); }}
            disabled={showResult}
            style={{ background: showResult ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)', border:'none', color:'white', padding:'0.5rem 1rem', borderRadius:'var(--t-r-pill)', cursor: showResult ? 'not-allowed' : 'pointer', fontSize:'0.85rem', fontWeight:600, opacity: showResult ? 0.5 : 1 }}>
            ← Back
          </button>
          <img src="images/logo.png" alt="Taronga Tracka" style={{ height:'45px', width:'auto' }} onError={e => e.target.style.display='none'} />
          <div style={{ width:'70px' }} />
        </div>
      </div>

      {/* Animal banner */}
      <div style={{ width:'100%', height:'15vh', minHeight:'100px', maxHeight:'140px', backgroundImage:`url(${currentAnimal.image})`, backgroundSize:'cover', backgroundPosition:'center', position:'relative', flex:'0 0 auto' }}>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(180deg, transparent 0%, rgba(10,47,31,0.95) 100%)', padding:'0.8rem 1rem 0.5rem' }}>
          <div style={{ maxWidth:'900px', margin:'0 auto', textAlign:'center' }}>
            <h1 className="heading-display" style={{ fontSize:'clamp(1.3rem, 3.5vh, 1.8rem)', color:'white', marginBottom:'0.2rem', lineHeight:1.1 }}>{currentAnimal.name}</h1>
            <p className="serif-accent" style={{ fontSize:'clamp(0.8rem, 2vh, 1rem)', color:'var(--safari-gold)' }}>{currentAnimal.scientificName}</p>
          </div>
        </div>
      </div>

      {/* Quiz body */}
      <div style={{ flex:'1 1 auto', overflowY:'auto', overflowX:'hidden', display:'flex', flexDirection:'column', padding:'clamp(0.5rem, 2vw, 1rem)', maxWidth:'900px', margin:'0 auto', width:'100%', WebkitOverflowScrolling:'touch' }}>
        <div style={{ textAlign:'center', marginBottom:'clamp(0.5rem, 1.5vh, 0.8rem)' }}>
          {currentAnimal.missionTitle && (
            <p style={{ fontSize:'clamp(0.9rem, 2vh, 1.1rem)', color: showResult ? 'white' : 'var(--jungle-deep)', fontWeight:700, marginBottom:'0.3rem' }}>{currentAnimal.missionTitle}</p>
          )}
          <p style={{ fontSize:'clamp(0.75rem, 1.8vh, 0.9rem)', color: showResult ? 'white' : 'var(--jungle-mid)', fontWeight:600 }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          {!showResult && currentAnimal.missionTask && (
            <div style={{ background:'rgba(91,140,90,0.1)', border:'1px solid rgba(91,140,90,0.3)', borderRadius:'var(--t-r-sm)', padding:'0.6rem 0.9rem', marginTop:'0.5rem', textAlign:'left' }}>
              {currentAnimal.missionTask.split('\n').map((line, i) => (
                <p key={i} style={{ fontSize:'clamp(0.75rem, 1.7vh, 0.85rem)', color:'var(--jungle-deep)', margin: i === 0 ? 0 : '0.3rem 0 0', lineHeight:1.5 }}>{line}</p>
              ))}
            </div>
          )}
          {!showResult && !currentAnimal.missionTask && (
            <p style={{ fontSize:'clamp(0.7rem, 1.6vh, 0.85rem)', color:'var(--sunset-orange)', fontWeight:600, marginTop:'0.3rem', fontStyle:'italic' }}>📖 Read the signs for clues!</p>
          )}
        </div>

        {showResult && (
          <div className="animate-scale-in" style={{ textAlign:'center', padding:'clamp(1.5rem, 3vh, 2rem)', background:'rgba(255,255,255,0.95)', borderRadius:'var(--t-r-xl)', boxShadow:'var(--t-shadow-lg)', margin:'clamp(1rem, 2vh, 1.5rem)', maxWidth:'90%', marginLeft:'auto', marginRight:'auto' }}>
            <div style={{ fontSize:'clamp(3rem, 8vh, 4.5rem)', marginBottom:'0.5rem' }}>{isCorrect ? '✓' : '✗'}</div>
            <h2 className="heading-display" style={{ fontSize:'clamp(2rem, 5vh, 3rem)', color: isCorrect ? '#10b981' : '#ef4444', marginBottom:'0.4rem', lineHeight:1.1 }}>
              {isCorrect ? 'Correct!' : 'Try Again'}
            </h2>
            {isCorrect && currentAnimal.correctFeedback && (
              <p style={{ fontSize:'clamp(0.95rem, 2.2vh, 1.1rem)', color:'#555', marginBottom:'0.8rem', fontStyle:'italic' }}>{currentAnimal.correctFeedback}</p>
            )}
            {isCorrect && (currentQuestion.stageFacts?.[classStage] || currentQuestion.fact) && (
              <div style={{ background:'linear-gradient(135deg, #FFF9E6 0%, #FFE6B3 100%)', borderRadius:'var(--t-r-md)', padding:'clamp(1rem, 2vh, 1.5rem)', marginTop:'0.8rem', marginBottom:'1rem' }}>
                <p style={{ color:'#333', fontSize:'clamp(0.9rem, 2vh, 1.1rem)', lineHeight:1.5, fontWeight:500 }}>
                  💡 {currentQuestion.stageFacts?.[classStage] || currentQuestion.fact}
                </p>
              </div>
            )}
            <button
              onClick={() => { if (isCorrect) { handleNextQuestion(); } else { setIsProcessingAnswer(false); setShowResult(false); } }}
              style={{ background: isCorrect ? 'linear-gradient(135deg, var(--t-eucalyptus), var(--t-mid))' : 'linear-gradient(135deg, #DC2626, #991B1B)', color:'white', border:'none', padding:'clamp(0.8rem, 2vh, 1.2rem) clamp(2rem, 5vw, 3rem)', fontSize:'clamp(1rem, 2.5vh, 1.3rem)', fontWeight:700, borderRadius:'var(--t-r-pill)', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', marginTop:'0.5rem' }}>
              {isCorrect ? (currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Continue to Observation →') : 'Try Again'}
            </button>
          </div>
        )}

        {!showResult && currentQuestion && (
          <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'clamp(0.8rem, 2vh, 1.2rem)', boxShadow:'0 8px 32px rgba(0,0,0,0.1)', marginBottom:'1rem' }}>
            <p style={{ fontSize:'clamp(0.9rem, 2vh, 1.1rem)', fontWeight:600, color:'var(--jungle-deep)', marginBottom:'clamp(0.8rem, 1.5vh, 1rem)', lineHeight:1.3, textAlign:'center' }}>
              {currentQuestion.q}
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(0.5rem, 1vh, 0.8rem)', marginTop:'clamp(0.8rem, 1.5vh, 1rem)' }}>
              {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option, oIndex) => (
                <button key={oIndex}
                  onClick={() => handleQuizAnswer(currentQuestionIndex, oIndex)}
                  style={{ textAlign:'center', padding:'clamp(1rem, 2.5vh, 1.5rem) clamp(0.5rem, 1vh, 0.8rem)', borderRadius:'var(--t-r-md)', border:'3px solid var(--jungle-light)', background:'white', cursor:'pointer', transition:'all 0.2s ease', fontSize:'clamp(0.85rem, 1.8vh, 1rem)', fontWeight:600, color:'var(--jungle-deep)', lineHeight:1.2, minHeight:'clamp(70px, 12vh, 90px)', display:'flex', alignItems:'center', justifyContent:'center', touchAction:'manipulation', WebkitTapHighlightColor:'transparent' }}>
                  {option}
                </button>
              ))}
            </div>
            <MathsCalculator />
          </div>
        )}
      </div>
    </div>
  );
}
