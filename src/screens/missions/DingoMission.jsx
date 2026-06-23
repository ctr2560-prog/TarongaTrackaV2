import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useStudent } from '../../context/StudentContext';
import { getStageQuestions } from '../../utils/helpers';
import MathsCalculator from '../../components/MathsCalculator';
import StudentGuide from '../../components/StudentGuide';

const DREAMING_PASSAGE = [
  'Warrigal, the old dingo, was hungry. He had been stalking a wallaby through the scrub when an old mundurra, a hunter, scared it away. The mundurra spotted Warrigal and raised his spear (his tura), so Warrigal ran. But both were old and tired, and when Warrigal could run no further, he turned and faced the hunter. "Why do you chase me, old brother?" he panted. The mundurra was also relieved to stop. "We are both lonely hunters," said Warrigal, "and our old age unites us." The mundurra lowered his spear and sat down. Together they worked out that they might both eat better if they hunted as a team. And so they did, sharing food and campfires, and becoming close friends. So did all their descendants. Men and dogs have hunted together ever since.',
];

const DINGO_ENGLISH_MCQ = {
  stageQ: {
    1: 'Why does Warrigal stop running away from the hunter?',
    2: 'Why does the old mundurra lower his spear and sit down?',
    3: 'Warrigal calls the hunter "old brother." How does this change the situation?',
    4: 'What does the writer suggest is more powerful than the urge to survive alone?',
    5: 'The story ends: "So did all their descendants - men and dogs." What kind of story is this, and what does that ending do?',
  },
  stageOptions: {
    1: [
      'He is too fast for the hunter and stops to rest',
      'He cannot run any further - he is too old and tired',
      'He decides he wants to fight',
      'He wants to make friends straight away',
    ],
    2: [
      'He has caught Warrigal and is resting before eating him',
      'He thinks Warrigal is too skinny to bother with',
      'He is also exhausted from the chase, and Warrigal\'s words give him a reason to stop',
      'He has spotted another animal to hunt',
    ],
    3: [
      'It insults the hunter and makes him more angry',
      'It reminds the hunter they are enemies',
      'It reframes their relationship - instead of predator and prey, they share something in common',
      'It confuses the hunter who does not understand dingoes',
    ],
    4: [
      'Youth and physical strength',
      'The hunter\'s skill with the spear',
      'Recognising a shared struggle and choosing to cooperate',
      'The dingo\'s speed and cunning',
    ],
    5: [
      'It is an adventure story - the ending shows what happened to the main characters',
      'It is an informative text - the ending summarises facts about dingoes',
      'It is a Dreaming story - the ending extends meaning beyond two characters to explain the origin of the bond between humans and dogs across all time',
      'It is a persuasive text trying to convince readers to respect dingoes',
    ],
  },
  stageCorrect: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 2 },
  stageFacts: {
    1: 'Age and exhaustion level the playing field. When neither hunter can keep going, both must find another way. Warrigal uses words instead of speed - that is how the story turns.',
    2: 'Warrigal uses words as tools. By naming a shared identity - "old brother" - he gives the hunter a reason to stop. This is the story\'s turning point: language, not strength, changes everything.',
    3: 'In this story, shared vulnerability is stronger than rivalry. The moment Warrigal names what they have in common, the hunter stops thinking of him as prey. Connection comes from recognising what we share.',
    4: 'The story suggests that cooperation, born from recognising a shared struggle, is more powerful than competing alone. Both hunter and dingo eat better together than separately.',
    5: 'This is a Dreaming story - a form of Aboriginal storytelling that carries cultural knowledge and explains how the world came to be. The ending moves from a single event to a universal truth: the bond between humans and dogs began with one act of choosing partnership over predation.',
  },
};

const STORY_SEQUENCE = [
  { id:'hunt',    emoji:'🦘', label:'Warrigal stalks the bunderra',           desc:'Both are hungry hunters' },
  { id:'scare',   emoji:'🏹', label:'The mundurra scares the wallaby away',   desc:'Both miss out on food' },
  { id:'chase',   emoji:'🏃', label:'The mundurra chases Warrigal',           desc:'Both exhausted, neither fast' },
  { id:'brother', emoji:'💬', label:'"Why do you chase me, old brother?"',    desc:'Warrigal uses words, not speed' },
  { id:'agree',   emoji:'🤝', label:'They agree to hunt together',            desc:'Shared struggle becomes partnership' },
  { id:'friends', emoji:'🔥', label:'They share food and campfires for life', desc:'The beginning of all their kind' },
];

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
  const { setCurrentScreen, classStage, classSubject } = useApp();
  const {
    currentAnimal, showResult, setShowResult, isCorrect,
    setIsProcessingAnswer, handleQuizAnswer, handleNextQuestion,
  } = useStudent();

  const isEnglish = classSubject === 'english';

  const [chainItems,    setChainItems]    = useState([]);
  const [wrongTap,      setWrongTap]      = useState(null);
  const [storyItems,    setStoryItems]    = useState([]);
  const [storyWrong,    setStoryWrong]    = useState(null);
  const [englishPhase,  setEnglishPhase]  = useState(0);
  const shuffled      = useMemo(() => shuffle(CORRECT_SEQUENCE), []);
  const storyShuffled = useMemo(() => shuffle(STORY_SEQUENCE), []);
  const currentQuestion = getStageQuestions(currentAnimal, classStage, classSubject)[0];
  const correctAnswerIndex = isEnglish
    ? (DINGO_ENGLISH_MCQ.stageCorrect[classStage] ?? 1)
    : (currentQuestion?.correct ?? 0);
  const fact = isEnglish
    ? DINGO_ENGLISH_MCQ.stageFacts[classStage]
    : (currentQuestion?.stageFacts?.[classStage] || currentQuestion?.fact);

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

  // ── English phase 0: Dreaming story ─────────────────────────────────────
  if (isEnglish && englishPhase === 0) {
    return (
      <div style={{ position:'fixed', inset:0, background:'#2C1A0E', display:'flex', flexDirection:'column' }}>
        <Header />
        <div style={{ flex:'1 1 0', minHeight:0, overflowY:'auto', padding:'1rem', maxWidth:'560px', margin:'0 auto', width:'100%' }}>

          <div style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,220,150,0.2)', borderRadius:'14px', padding:'1rem 1.2rem', marginBottom:'0.85rem' }}>
            <p style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(255,200,100,0.8)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.35rem' }}>Aboriginal Dreaming Story</p>
            <h2 style={{ fontSize:'1.15rem', fontWeight:700, color:'white', margin:'0 0 0.15rem', lineHeight:1.3 }}>Warrigal and the Mundurra</h2>
            <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', margin:0 }}>Read the full story before moving on.</p>
          </div>

          <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,220,150,0.15)', borderRadius:'14px', padding:'1rem 1.2rem', marginBottom:'0.85rem' }}>
            {DREAMING_PASSAGE.map((para, i) => (
              <p key={i} style={{ fontSize:'0.9rem', color:'rgba(255,255,255,0.88)', lineHeight:1.8, margin: i === 0 ? '0' : '0.7rem 0 0', fontStyle: para.startsWith('"') || para.startsWith("'") ? 'italic' : 'normal' }}>{para}</p>
            ))}
            <p style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.3)', marginTop:'1.1rem', marginBottom:0 }}>Source: dingoden.net</p>
          </div>

          <button onClick={() => setEnglishPhase(1)}
            style={{ width:'100%', background:'linear-gradient(135deg,#C4873A,#9B5E1E)', color:'white', border:'none', padding:'1rem', borderRadius:'14px', fontSize:'1rem', fontWeight:700, cursor:'pointer', marginBottom:'1.5rem' }}>
            Put the events in order →
          </button>

        </div>
        <StudentGuide screen="dingo-reading" />
      </div>
    );
  }

  // ── English phase 1: story sequencing ────────────────────────────────────
  if (isEnglish && englishPhase === 1) {
    const nextStoryExpected = STORY_SEQUENCE[storyItems.length];
    const isCompleteStory   = storyItems.length === STORY_SEQUENCE.length;

    const tapStoryItem = (id) => {
      if (isCompleteStory) return;
      if (!nextStoryExpected || id !== nextStoryExpected.id) {
        setStoryWrong(id);
        setTimeout(() => setStoryWrong(null), 700);
        return;
      }
      setStoryItems(prev => [...prev, id]);
      setStoryWrong(null);
    };

    if (showResult) {
      return (
        <div style={{ position:'fixed', inset:0, background:'linear-gradient(135deg,#10b981 0%,#059669 100%)', display:'flex', flexDirection:'column' }}>
          <Header />
          <ResultCard feedbackText="You know this story." factFallback={null} />
          <StudentGuide screen="mission-dingo" />
        </div>
      );
    }

    return (
      <div style={{ position:'fixed', inset:0, background:'#2C1A0E', display:'flex', flexDirection:'column' }}>
        <Header />
        <div style={{ flex:'1 1 0', minHeight:0, overflowY:'auto', padding:'1rem', maxWidth:'560px', margin:'0 auto', width:'100%' }}>

          <div style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,220,150,0.2)', borderRadius:'14px', padding:'0.85rem 1.1rem', marginBottom:'0.85rem' }}>
            <p style={{ fontSize:'0.6rem', fontWeight:800, color:'rgba(255,200,100,0.8)', textTransform:'uppercase', letterSpacing:'0.14em', margin:'0 0 0.25rem' }}>Reading comprehension</p>
            <h2 style={{ fontSize:'1.1rem', fontWeight:700, color:'white', margin:'0 0 0.15rem', lineHeight:1.3 }}>Put the events in order</h2>
            <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', margin:0 }}>Tap the events in the order they happen in the story.</p>
          </div>

          <div style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,220,150,0.15)', borderRadius:'14px', padding:'1rem 1.1rem', marginBottom:'0.85rem' }}>

            <div style={{ display:'flex', gap:'0.3rem', marginBottom:'1rem' }}>
              {STORY_SEQUENCE.map((item, i) => (
                <div key={item.id} style={{ flex:1, height:'6px', borderRadius:'3px', background: i < storyItems.length ? 'rgba(255,200,100,0.85)' : 'rgba(255,255,255,0.15)', transition:'background 0.3s' }} />
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.55rem', marginBottom:'0.75rem' }}>
              {storyShuffled.map((item) => {
                const placed  = storyItems.includes(item.id);
                const isNext  = !placed && item.id === nextStoryExpected?.id && classStage < 5;
                const isWrong = storyWrong === item.id;
                return (
                  <button key={item.id} onClick={() => tapStoryItem(item.id)} disabled={placed}
                    style={{ padding:'0.7rem 0.6rem', borderRadius:'12px', border:`2px solid ${isWrong?'#ef4444':placed?'rgba(255,200,100,0.7)':isNext?'rgba(255,200,100,0.4)':'rgba(255,255,255,0.12)'}`, background:isWrong?'rgba(239,68,68,0.15)':placed?'rgba(255,200,100,0.1)':isNext?'rgba(255,200,100,0.06)':'rgba(255,255,255,0.04)', cursor:placed?'default':'pointer', textAlign:'left', transition:'all 0.15s', display:'flex', alignItems:'center', gap:'0.5rem', opacity:placed?0.7:1 }}>
                    <span style={{ fontSize:'1.3rem', flexShrink:0 }}>{item.emoji}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'0.78rem', fontWeight:700, color:isWrong?'#ef4444':'rgba(255,255,255,0.9)', lineHeight:1.3 }}>{item.label}</div>
                      <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.45)' }}>{item.desc}</div>
                    </div>
                    {placed  && <span style={{ fontSize:'0.8rem', color:'rgba(255,200,100,0.8)', fontWeight:700, flexShrink:0 }}>✓</span>}
                    {isWrong && <span style={{ fontSize:'0.8rem', color:'#ef4444', fontWeight:700, flexShrink:0 }}>✗</span>}
                  </button>
                );
              })}
            </div>

            {storyWrong && (
              <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.4)', borderRadius:'8px', padding:'0.45rem 0.75rem', marginBottom:'0.5rem', textAlign:'center' }}>
                <p style={{ fontSize:'0.78rem', color:'#f87171', fontWeight:600, margin:0 }}>Try again - what happens next in the story?</p>
              </div>
            )}

            {storyItems.length > 0 && !isCompleteStory && (
              <div style={{ background:'rgba(255,200,100,0.07)', borderRadius:'8px', padding:'0.5rem 0.75rem', border:'1px solid rgba(255,200,100,0.2)' }}>
                <p style={{ fontSize:'0.68rem', fontWeight:700, color:'rgba(255,200,100,0.8)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.25rem' }}>Story so far:</p>
                <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.75)', margin:0, lineHeight:1.5 }}>
                  {storyItems.map(id => STORY_SEQUENCE.find(o => o.id === id)?.label).join(' → ')}
                  <span style={{ color:'rgba(255,255,255,0.3)' }}> → ?</span>
                </p>
              </div>
            )}
          </div>

          {!isCompleteStory ? (
            <div style={{ background:'rgba(255,200,100,0.06)', border:'1.5px dashed rgba(255,200,100,0.3)', borderRadius:'14px', padding:'1rem', textAlign:'center', marginBottom:'1rem' }}>
              <p style={{ fontSize:'0.88rem', color:'rgba(255,200,100,0.8)', fontWeight:600, margin:0 }}>
                {storyItems.length === 0 ? 'Start with the first event in the story' : `${STORY_SEQUENCE.length - storyItems.length} more event${STORY_SEQUENCE.length - storyItems.length !== 1 ? 's' : ''} to go`}
              </p>
            </div>
          ) : (
            <button onClick={() => handleQuizAnswer(0, correctAnswerIndex, correctAnswerIndex)}
              style={{ width:'100%', background:'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))', color:'white', border:'none', padding:'1rem', borderRadius:'14px', fontSize:'1rem', fontWeight:700, cursor:'pointer', marginBottom:'1.5rem' }}>
              Continue to Writing →
            </button>
          )}

        </div>
        <StudentGuide screen="mission-dingo" />
      </div>
    );
  }

  // ── Stage 1-2: simple quiz ────────────────────────────────────────────────
  if (classStage <= 2) {
    return (
      <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)') : 'var(--mist-light)', display:'flex', flexDirection:'column' }}>
        <Header />
        {showResult && <ResultCard feedbackText={null} factFallback={currentQuestion?.fact} />}
        {!showResult && (
          <div style={{ flex:'1 1 0', minHeight:0, overflowY:'auto', padding:'1.5rem', maxWidth:'540px', margin:'0 auto', width:'100%' }}>
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
            <MathsCalculator />
          </div>
        )}
        <StudentGuide screen="mission-dingo" />
      </div>
    );
  }

  // ── Stage 3+: food chain builder + quiz ───────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, background: showResult ? (isCorrect ? 'linear-gradient(135deg,#10b981 0%,#059669 100%)' : 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)') : 'var(--mist-light)', transition:'background 0.5s ease', display:'flex', flexDirection:'column' }}>
      <Header />
      {showResult && <ResultCard feedbackText="You understand the dingo's place in the ecosystem!" factFallback={null} />}
      {!showResult && (
        <div style={{ flex:'1 1 0', minHeight:0, overflowY:'auto', padding:'1rem', maxWidth:'560px', margin:'0 auto', width:'100%' }}>

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
                <p style={{ fontSize:'0.82rem', color:'#ef4444', fontWeight:600, margin:0 }}>Try again - tap the next correct organism</p>
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
              <MathsCalculator />
            </div>
          )}

        </div>
      )}
      <StudentGuide screen="mission-dingo" />
    </div>
  );
}
