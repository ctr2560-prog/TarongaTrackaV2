import { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  'How do I get started?',
  'How do students connect to WiFi?',
  'How do I create a class?',
  'How do I restore a student?',
  'What do the analytics show?',
  'What subjects are available?',
];

const RESPONSES = [
  {
    keywords: ['start', 'begin', 'get going', 'run a session', 'run the', 'first', 'overview', 'run', 'session'],
    answer: `Here's how to run a Taronga Tracka session:\n\n**1. Connect to WiFi**\nAsk all students to connect to **Taronga Guest WiFi** before you start — this keeps everything running smoothly.\n\n**2. Create a class**\nGo to the Classes tab → Create New Class. Enter your class details and Taronga Access Code.\n\n**3. Share your class code**\nYour 6-character code appears on the class card. Display it on a screen or read it out.\n\n**4. Students join**\nStudents open **Taronga Education** on their device → tap **"Let's Track!"** → **Student** → enter your class code → choose an animal alias.\n\n**5. Record who's who**\nUse the **Who's Who in the Zoo** document (available in your analytics) to note which student chose which animal alias.\n\n**6. Students explore the zoo**\nStudents walk to animal enclosures — each one unlocks on their map when they're nearby. They complete observations, quizzes and activities at each stop.\n\n**7. Wrap up**\nWhen finished, students tap **Complete Activity** → write a conservation statement → submit. You'll see their results live in Analytics.`,
  },
  {
    keywords: ['wifi', 'wi-fi', 'internet', 'connection', 'network', 'connect', 'online', 'signal'],
    answer: `Before heading out, make sure all student devices are connected to **Taronga Guest WiFi**.\n\n**How to connect:**\n1. Open **Settings → Wi-Fi** on each device\n2. Select **Taronga Guest** from the network list\n3. Follow any on-screen prompts to accept the guest terms\n\nA stable WiFi connection is important for:\n• Unlocking animal enclosures on the map\n• Saving quiz answers and observations\n• Live progress appearing in your Analytics tab\n\nTip: do a quick WiFi check before students split into groups — it's much easier to fix at the start than mid-session.`,
  },
  {
    keywords: ['student', 'join', 'log in', 'login', 'sign in', 'enter'],
    answer: `Students join by:\n1. Opening **Taronga Education** on their device\n2. Tapping **"Let's Track!"** → **Student**\n3. Entering the **6-letter class code** from your class card\n4. Choosing their **animal alias** from the list\n\nIf a student reloads mid-session, the app automatically brings them back to the map. If you've restored a student after submission, their alias will show **↺ continue** in amber on the join screen.`,
  },
  {
    keywords: ['create', 'new class', 'set up', 'start class', 'access code'],
    answer: `To create a class:\n1. Go to the **Classes** tab\n2. Click **Create New Class**\n3. Enter class name, school, year group, subject and session type\n4. Enter your **Taronga Access Code** (provided by Taronga Zoo)\n\nOnce created, your class code appears on the class card — share this with students to join.`,
  },
  {
    keywords: ['who\'s who', 'whos who', 'document', 'record', 'note down', 'write down'],
    answer: `The **Who's Who in the Zoo** document lets you record which student chose which animal alias.\n\nYou can find it in your **Analytics** tab — look for the Who's Who button. Print it or fill it in digitally during the joining phase before students head out into the zoo.`,
  },
  {
    keywords: ['restore', 'reset', 'bring back', 'rejoin', 'redo', 'continue'],
    answer: `To restore a student so they can continue:\n1. Open the class in **Analytics**\n2. Find the student row\n3. Click the **↺ Restore** button\n\nThis keeps all their existing badges and progress — it just unlocks their animal alias so they can re-join. Their name will show **↺ continue** in amber on the join screen.\n\nUse **🗑 Delete** only if you want to permanently remove a student and all their data.`,
  },
  {
    keywords: ['analytics', 'progress', 'data', 'stats', 'score', 'quiz', 'points', 'badges'],
    answer: `The **Analytics** tab shows per-class data:\n\n• **Points & badges** earned by each student\n• **Quiz mastery** histogram (% correct on first attempt)\n• **Observation scores** — behaviour, detail, writing quality\n• **Conservation statements** written by students\n• **Student status** — incomplete or complete\n\nAll data updates **live** as students complete animals — you don't need to wait for them to submit.`,
  },
  {
    keywords: ['live', 'real time', 'realtime', 'update', 'see', 'watch'],
    answer: `Progress is saved to Firestore **after each animal** is completed, not just at the end. You can watch the Analytics tab and see badges, points and quiz scores appear in real time as students work through the zoo — no need for them to hit Submit first.`,
  },
  {
    keywords: ['subject', 'science', 'maths', 'math', 'pdhpe', 'english', 'curriculum'],
    answer: `Taronga Tracka supports four subjects:\n\n• **Science** — observation, adaptation, classification\n• **Maths** — measurement, estimation, data\n• **PDHPE** — animal physiology, health and movement links\n• **English** — descriptive writing, imagery, vocabulary\n\nThe subject is set when you create the class and determines the quiz questions and observation prompts students see.`,
  },
  {
    keywords: ['zoosnooz', 'zoo snooz', 'night', 'video', 'documentary'],
    answer: `**ZooSnooz** is the night-session mode. Students film short video clips of each animal and stitch them into a documentary. Select it as the session type when creating a class — it's designed for evening events at Taronga Zoo.\n\nStudents can flip between front and back cameras using the **⟳ Flip** button on the camera view.`,
  },
  {
    keywords: ['delete', 'remove', 'wipe'],
    answer: `To permanently delete a student:\n1. Open the class in **Analytics**\n2. Find the student row\n3. Click **🗑 Delete**\n\nThis cannot be undone. If you just want to give a student more time, use **↺ Restore** instead — it keeps all their progress.`,
  },
  {
    keywords: ['class code', 'code', 'share', 'qr'],
    answer: `Your **class code** is the 6-character code on the class card (e.g. A7K2Q9). Share it verbally or display it on a screen — students type it in on the join screen.\n\nEach class gets a unique code when created.`,
  },
  {
    keywords: ['gps', 'location', 'proximity', 'map', 'unlock', 'near'],
    answer: `By default, students need to be **physically near** an animal enclosure for it to unlock on their map. GPS must be enabled on their device.\n\nIf GPS isn't working (e.g. indoors or poor signal), an admin can turn off the GPS requirement in the **Control Room** of the Taronga Staff Portal.`,
  },
  {
    keywords: ['feedback', 'rating', 'star', 'review'],
    answer: `Student and teacher feedback (star ratings + comments) appears in the **Analytics** tab. You'll see average scores and a rating distribution chart.\n\nYou can submit your own rating at the bottom of the Analytics screen. Feedback can be cleared in the Taronga Staff Portal → Control Room.`,
  },
  {
    keywords: ['submit', 'finish', 'complete activity', 'complete', 'conservation', 'statement', 'done', 'end'],
    answer: `When students are ready to wrap up:\n1. They tap **Complete Activity** on their collection screen\n2. Write a **Conservation Statement**\n3. Confirm submission\n4. Rate their experience\n5. Tap **Done** — the device is then ready for the next student to log in fresh.`,
  },
  {
    keywords: ['help', 'how', 'what', 'guide', 'instruction', 'use'],
    answer: `Here are some things I can help with — just ask or tap a quick question below:\n\n• **Getting started** — running a full session\n• **WiFi** — connecting students to Taronga Guest WiFi\n• **Creating a class**\n• **Students joining**\n• **Who's Who document**\n• **Restoring or deleting students**\n• **Analytics and live progress**\n• **Subjects and curriculum**\n• **ZooSnooz night mode**\n• **GPS and location**`,
  },
];

function findResponse(input) {
  const lower = input.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keywords.some(k => lower.includes(k))) return r.answer;
  }
  return `I'm not sure about that one — try rephrasing or tap one of the suggested questions. You can also email Taronga for support.`;
}

function renderText(text) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    );
  });
}

export default function TeacherHelpBot() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    { from:'bot', text:'Hi! I\'m your Taronga Tracka helper 👋\n\nAsk me anything about the teacher portal, or tap a question below to get started.' },
  ]);
  const [input,    setInput]    = useState('');
  const [typing,   setTyping]   = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    setMessages(m => [...m, { from:'user', text: trimmed }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { from:'bot', text: findResponse(trimmed) }]);
    }, 600);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:1000,
          width:'56px', height:'56px', borderRadius:'50%',
          background:'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))',
          border:'none', cursor:'pointer',
          boxShadow:'0 4px 20px rgba(26,82,56,0.5)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1.5rem', color:'white', transition:'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform='scale(1.08)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(26,82,56,0.6)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform='scale(1)';    e.currentTarget.style.boxShadow='0 4px 20px rgba(26,82,56,0.5)'; }}
        title="Help"
      >
        {open ? '✕' : '?'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position:'fixed', bottom:'5rem', right:'1.5rem', zIndex:999,
          width:'min(360px, calc(100vw - 2rem))',
          height:'min(520px, calc(100vh - 8rem))',
          background:'white', borderRadius:'20px',
          boxShadow:'0 12px 48px rgba(0,0,0,0.22)',
          display:'flex', flexDirection:'column', overflow:'hidden',
          border:'1px solid rgba(26,82,56,0.12)',
          animation:'slideUp 0.22s ease',
        }}>

          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))', padding:'1rem 1.2rem', display:'flex', alignItems:'center', gap:'0.75rem', flexShrink:0 }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 }}>🦁</div>
            <div>
              <div style={{ color:'white', fontWeight:700, fontSize:'0.95rem', lineHeight:1.2 }}>Taronga Helper</div>
              <div style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.72rem' }}>Ask me anything about the portal</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'1rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent: m.from==='user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth:'82%',
                  background: m.from==='user' ? 'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))' : '#F5F3EE',
                  color: m.from==='user' ? 'white' : 'var(--t-ink)',
                  padding:'0.65rem 0.9rem',
                  borderRadius: m.from==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize:'0.82rem', lineHeight:1.55, fontWeight:500,
                }}>
                  {renderText(m.text)}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display:'flex', justifyContent:'flex-start' }}>
                <div style={{ background:'#F5F3EE', padding:'0.65rem 1rem', borderRadius:'16px 16px 16px 4px', display:'flex', gap:'4px', alignItems:'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#aaa', animation:`bounce 1s ease-in-out ${i*0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div style={{ padding:'0.5rem 0.75rem', borderTop:'1px solid #eee', display:'flex', gap:'0.4rem', overflowX:'auto', flexShrink:0 }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)}
                style={{ whiteSpace:'nowrap', padding:'0.3rem 0.7rem', borderRadius:'999px', border:'1.5px solid var(--t-stone)', background:'white', color:'var(--t-deep)', fontSize:'0.72rem', fontWeight:600, cursor:'pointer', flexShrink:0, transition:'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background='var(--t-eucalyptus)'; e.currentTarget.style.color='white'; e.currentTarget.style.borderColor='var(--t-eucalyptus)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='white'; e.currentTarget.style.color='var(--t-deep)'; e.currentTarget.style.borderColor='var(--t-stone)'; }}>
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding:'0.75rem', borderTop:'1px solid #eee', display:'flex', gap:'0.5rem', flexShrink:0 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask a question…"
              style={{ flex:1, padding:'0.6rem 0.85rem', borderRadius:'999px', border:'1.5px solid var(--t-stone)', fontSize:'0.82rem', outline:'none', color:'var(--t-ink)', background:'var(--t-parchment)' }}
              onFocus={e => e.target.style.borderColor='var(--t-mid)'}
              onBlur={e => e.target.style.borderColor='var(--t-stone)'}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim()}
              style={{ width:'36px', height:'36px', borderRadius:'50%', border:'none', background: input.trim() ? 'linear-gradient(135deg,var(--t-eucalyptus),var(--t-mid))' : '#eee', color: input.trim() ? 'white' : '#bbb', fontSize:'1rem', cursor: input.trim() ? 'pointer' : 'default', flexShrink:0, transition:'all 0.15s' }}>
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes bounce {
          0%,80%,100% { transform:translateY(0); }
          40%          { transform:translateY(-5px); }
        }
      `}</style>
    </>
  );
}
