import { useState, useRef, useEffect } from 'react';
import { TOUR_EVENT } from './TeacherTutorial';

const SUGGESTIONS = [
  'How do I run a session?',
  'How do I create a class?',
  'How do students join?',
  'Where do I see their work?',
  'A student needs to re-join',
  'How do school points work?',
];

/* ⚠️ These answers describe controls that exist. Checked against the code on 2026-11-15,
   when the previous set was still sending teachers to a Classes tab, an Analytics tab and
   a Taronga Access Code field, none of which the app has any more.
   🚫 Never describe a button from memory. Grep for it first, and when a control changes,
   grep for the places that describe it, this file included.

   ⚠️ First keyword match wins, so ORDER IS BEHAVIOUR. Specific entries sit above general
   ones: consent before ZooSnooz (a filming question contains the word video), school points
   before scores (it contains the word points), and the catch-all stays last. */
const RESPONSES = [
  {
    keywords: ['run a session', 'run the day', 'get started', 'getting started', 'begin', 'on the day', 'what do i do first'],
    answer: `Here is the whole run, start to finish:\n\n**1. Create the class**\nDashboard, then **Create a class**. Pick the programme, your school, the stage and a class name. There is no access code to type in any more.\n\n**2. Hand out the code**\nSix characters, on the class card. Tap the code itself to throw it up full screen for the room.\n\n**3. Students join**\nThey open **Taronga Education**, tap **Let's Track!**, type the code and pick an animal alias.\n\n**4. Note who is who**\n**Who's Who in the Zoo** in the class screen sidebar is a printable sheet for recording which student took which alias. Worth doing before they walk off.\n\n**5. Out they go**\nAnimals unlock as students reach them. Work saves as each one is finished, not at the end.\n\n**6. Watch it come in**\nOpen the class from the dashboard: **Overview** is the summary, **Students** is the table, **Responses** is their writing.\n\n**7. Wrap up**\nStudents tap **Complete Activity**, write a conservation statement and submit. **Submit Class** in the sidebar closes the whole class off.`,
  },
  {
    keywords: ['wifi', 'wi-fi', 'internet', 'network', 'signal', 'reception', 'offline'],
    answer: `Get every device onto **Taronga Guest WiFi** before you split into groups. It is much easier to fix at the gate than halfway up the hill.\n\nWhat actually needs the signal:\n• Saving written work and quiz answers\n• Uploading video in ZooSnooz, Evolve and Wildest Dreams\n• Your class screen updating while they work\n\nWhat does **not** need it: unlocking animals. That is GPS, so a student with no bars can still unlock and keep working. Their progress is held on the phone and catches up when the signal returns.`,
  },
  {
    keywords: ['create', 'new class', 'set up a class', 'make a class', 'access code'],
    answer: `Dashboard, then **Create a class** (the button in the green header, or the sidebar).\n\nYou fill in five things: **Location**, **Subject**, **School Name**, **NSW Stage** and **Class Name**.\n\n⚠️ There is **no Taronga Access Code** any more. If you are hunting for that field, it is gone, not hidden.\n\nSome of it fills itself in: Evolve is Stage 6 and Life Ready, ZooYard is Science, and ZooSnooz and Wildest Dreams have no subject, so those pickers disappear when you choose them. The three filming programmes add one tick box about consent before you can create.\n\nThe class and its six character code appear on your dashboard straight away.`,
  },
  {
    keywords: ['zooyard', 'zoo yard', 'at school', 'cannot visit', "can't visit", 'schoolyard'],
    answer: `**ZooYard** runs in your own schoolyard, for classes that cannot get to the zoo.\n\n• **Eight habitats**, each one about a quality an animal depends on\n• **No GPS at all**, which is why it works on locked down school devices. Students photograph the spot they are standing in to unlock it\n• Each habitat ends in something they actually build or do, photographed and sent to Taronga\n\nThose photos are reviewed by Taronga and earn your school points. You can see them, and remove any you do not want sent, from the class screen.`,
  },
  {
    keywords: ['evolve', 'stage 6', 'year 11', 'year 12', 'life ready', 'twilight'],
    answer: `**Evolve** is the Stage 6 twilight programme for Life Ready. Five animals, five chapters of one story about leaving school. At each stop students write a reflection and film a short piece to camera, and the clips stitch into one film they keep.\n\n⚠️ It has **no points, badges, quizzes or marks**, on purpose. So its class screen is one table rather than the usual charts: that is the design, not missing data.\n\nFrom that table you can read every student's writing and print **pledge certificates**, for one student or the whole class.`,
  },
  {
    keywords: ['wildest', 'dreams', 'support unit', 'diverse learners', 'life skills'],
    answer: `**Wildest Dreams** is the video first programme, built for support units and diverse learners.\n\nEight stops. At each one students watch an animal, choose what they want to show about it, and film a short piece. The clips become one documentary they keep.\n\nThere is **no quiz, no score, no marks and no required writing or speech**, and every stop can be skipped. A student who filmed three of eight has not failed at anything.\n\nFrom the class screen you can watch each clip with the caption the student chose, watch the finished film, and copy the keepsake link to send home.`,
  },
  {
    keywords: ['consent', 'permission', 'parent', 'letter', 'filming', 'opt out', 'opted out', 'privacy'],
    answer: `Three programmes record video: **ZooSnooz**, **Evolve** and **Wildest Dreams**. Creating one of those classes asks you to tick that you **will obtain** appropriate consent for filming.\n\nEach has its own printable parent letter, in the sidebar of the class screen, with a tear off opt out slip.\n\nConsent stays with the school rather than being a setting in the app, so a student who may not be filmed becomes the **camera operator** for their group. Arranging that on the day is yours, not the app's.\n\nStudents never enter their real names anywhere. They pick an animal alias.`,
  },
  {
    keywords: ['zoosnooz', 'zoo snooz', 'night', 'sleepover', 'documentary'],
    answer: `**ZooSnooz** is the night programme. Five animals, each with a keeper insight, an instrument to use, a question, an observation and a short film. The clips stitch into a documentary on the phone itself.\n\n• **⟳ Flip** switches between front and back cameras\n• Clips upload as they are filmed and the finished film uploads on submit, so the group wants signal at the **start and the end** of the night. The stitching itself needs none\n• Keep the phone awake and on the app while it builds, it takes about a minute\n\nYou can watch every clip and the finished documentary from the class screen.`,
  },
  {
    keywords: ['programme', 'program', 'modes', 'session type', 'which one', 'difference between'],
    answer: `Five, all chosen from **Location** when you create the class:\n\n• **Tracka Trek** (Taronga Sydney, Zoo Visit) the day excursion, with quizzes, observations, badges and points\n• **ZooSnooz** the night programme, filming into a documentary\n• **ZooYard** at your own school, no GPS, eight habitats\n• **Evolve** Stage 6 twilight, Life Ready, five chapters into one film\n• **Wildest Dreams** video first, built for support units\n\nThe class card on your dashboard is labelled with whichever one it is.`,
  },
  {
    keywords: ['restore', 'rejoin', 're-join', 'bring back', 'locked out', 'new device', 'different device', 'continue'],
    answer: `Open the class, go to the **Students** tab and find their row.\n\n• **Restore** sends them back to the animal list so they can carry on. They keep every badge and everything they wrote\n• **New device** lets a student continue on a different phone or tablet. Use this if they swapped devices, or a shared iPad has moved on to someone else\n• **Delete** is permanent, so only use it for a test entry or a duplicate\n\nAfter a restore their alias shows **↺ continue** in amber when they re-join.`,
  },
  {
    keywords: ['students join', 'join', 'joining', 'alias', 'log in', 'login', 'sign in'],
    answer: `Students join by:\n1. Opening **Taronga Education** on their device\n2. Tapping **Let's Track!**\n3. Typing the **six character class code** from your class card\n4. Choosing an **animal alias**\n\nNo account, no password and no real names, which is deliberate.\n\nIf they reload mid session the app puts them back where they were. If you have restored a student, their alias shows **↺ continue** in amber on the join screen.`,
  },
  {
    keywords: ['class code', 'code', 'share the code', 'qr'],
    answer: `The **class code** is the six characters on the class card, like A7K2Q9. Every class gets its own.\n\n**Tap the code on the card** and it fills the screen, which is the easy way to show it to a room. Students type it in on the join screen.`,
  },
  {
    keywords: ['delete', 'remove a student', 'wipe', 'duplicate'],
    answer: `**Students** tab, find the row, then **Delete**. It cannot be undone and it takes their work with it.\n\nIf you only want to give a student more time, use **Restore** instead. If their device has changed, use **New device**. Delete is for test entries and duplicates.`,
  },
  {
    keywords: ['mark', 'marking', 'override', 'wrong score', 'disagree', 'moderate', 'regrade'],
    answer: `The app marks observations automatically, and you can overrule it.\n\nOpen the class, go to the **Responses** tab and open a student's score breakdown. **Override** lets you set the three domain scores yourself with a reason and a note, which also flags it so there is a record of why.\n\nThe panel under the radar chart on **Overview** explains what the automatic marking is actually looking at, which is worth a read before you change anything.`,
  },
  {
    keywords: ['analytics', 'progress', 'results', 'scores', 'data', 'stats', 'quiz', 'badges', 'see their work', 'where do i see'],
    answer: `Open a class from the dashboard. It is in three tabs:\n\n• **Overview** class size, points, badges, quiz results, the most visited animals and the writing radar\n• **Students** every student with their points, badges and status, plus Restore, New device and Delete\n• **Responses** what they actually wrote, the common issues, and marking\n\nIt updates **live** as students finish each animal, so you do not have to wait for anyone to submit.\n\n⚠️ Evolve and Wildest Dreams have no tabs and no numbers, because they have no points or marks by design.`,
  },
  {
    keywords: ['report', 'pdf', 'print', 'download', 'highlights', 'csv', 'export', 'spreadsheet'],
    answer: `Two ways out of the app:\n\n• **Download class report** on the **Overview** tab, also called **Highlights Package** in the sidebar. It is the whole class written up: averages, every student's observations with their marks, and their conservation statements. It opens in a new tab ready to print, so use your browser's print dialog to save it as a PDF\n• **Export CSV** in the sidebar, for marks you want in a spreadsheet\n\nEvolve classes also print **pledge certificates**, one landscape page per student.`,
  },
  {
    keywords: ["who's who", 'whos who', 'who is who', 'record names', 'which alias'],
    answer: `**Who's Who in the Zoo** is a printable sheet for writing down which student took which animal alias. It is in the sidebar of the class screen.\n\nWorth filling in while they are joining. Students never give their real names to the app, so this sheet is the only link between an alias and a child, and it stays with you.`,
  },
  {
    keywords: ['gps', 'location', 'proximity', 'unlock', 'not unlocking', 'map'],
    answer: `On a zoo visit, animals unlock when students are **physically near** the enclosure, so location has to be on.\n\nThere are **two switches and both have to be on**: a Taronga wide setting, and a per class one. You control the second: open the class and look for the **GPS On / GPS Off** panel.\n\nTurn it off if location is not playing along, and animals unlock without the distance check. ZooYard never uses GPS at all, which is why it works on school devices that block it.`,
  },
  {
    keywords: ['school points', 'leaderboard', 'challenge', 'free visit', 'reward', 'points for'],
    answer: `Points sit with your **school**, not a class, and **300 earns a free class zoo visit**.\n\nThey come from running sessions, and from challenges. The **monthly challenge** on your dashboard is the quickest way up: do the thing, photograph it, tap Submit evidence, and Taronga reviews it before the points land. **See all challenges** lists the rest.\n\nThe leaderboard underneath shows where your school sits.\n\n⚠️ Points can only count if your school name is on your account. If the dashboard is asking you for it, that is why.`,
  },
  {
    keywords: ['plan', 'book', 'device', 'ipad', 'lesson', 'resource', 'pre visit', 'post visit', 'outcome', 'syllabus', 'curriculum', 'assessment', 'accessibility'],
    answer: `**Plan your visit** on the dashboard holds all of it:\n\n• **Book devices** Taronga has 20 Tracka phones a day, booked through the calendar\n• **Pre and post visit lessons** ready made, by subject and stage\n• **Excursion planning pack**, the **zoo map** and **How-to guides**\n• **Curriculum alignment** NSW outcomes, by subject and stage\n• **Assessment ideas** what the app evidences, plus post visit tasks with printable task notifications\n• **Accessibility and inclusion**\n\nEach class also has its own **Teacher Information Sheet** in the class screen sidebar, built for that class's programme and stage.`,
  },
  {
    keywords: ['wildly', 'back at school', 'after the visit', 'units'],
    answer: `**Wildly by Taronga** is the classroom side: lessons, units, assessments and professional learning.\n\nYour Tracka log in works there too, so it is the same email and password. The panel at the bottom of **Plan your visit** opens it, and so does the sidebar link.`,
  },
  {
    keywords: ['subject', 'science', 'maths', 'math', 'pdhpe', 'english'],
    answer: `A zoo visit can run as one of four subjects, chosen when you create the class:\n\n• **Science** behaviour, adaptation, classification\n• **Maths** measurement, estimation, data\n• **PDHPE** physiology, health and movement\n• **English** descriptive writing, imagery, vocabulary\n\nIt sets the questions, the writing prompts and what the marking looks for, so the three score domains are named differently in each.\n\nThe other programmes decide for themselves: ZooYard is Science, Evolve is Life Ready, and ZooSnooz and Wildest Dreams have no subject.`,
  },
  {
    keywords: ['feedback', 'rating', 'suggest', 'bug', 'problem', 'contact'],
    answer: `**Send feedback** at the bottom of the dashboard sidebar. Leave a star rating and tell us what happened, and it comes straight to the Tracka team.\n\nStudents are asked for theirs too, at the end of their session.`,
  },
  {
    keywords: ['tour', 'show me around', 'tutorial', 'walk me through', 'walkthrough'],
    answer: `**Show me around this page** at the top of this panel runs the tour of the dashboard again. It is about thirty seconds and you can skip it at any point.\n\nIt opens by itself the first time you ever sign in, and not after that.`,
  },
  {
    keywords: ['submit', 'finish', 'complete activity', 'conservation statement', 'wrap up', 'done', 'end the session'],
    answer: `Students finish by tapping **Complete Activity** on their collection screen, writing a **conservation statement**, confirming, and rating the day. The device is then clear for the next student.\n\nFrom your side, **Submit Class** in the class screen sidebar closes the class off once everyone is done. **Archive Class** takes an old class off your dashboard without deleting anything.`,
  },
  {
    keywords: ['help', 'how', 'what', 'guide', 'where', 'can i'],
    answer: `Ask me in your own words, or try one of these:\n\n• **Running a session**, start to finish\n• **Creating a class**, and where the access code went\n• **Students joining**, and the class code\n• **Restoring a student** or moving them to a new device\n• **Where their work is**, and the three tabs\n• **Marking**, and overriding a score\n• **Class report, CSV** and Who's Who\n• **School points** and the monthly challenge\n• **GPS** when animals will not unlock\n• **The five programmes**, and consent for the filming ones\n\nOr tap **Show me around this page** at the top for the tour.`,
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

  const canTour = open && typeof document !== 'undefined' && !!document.querySelector('[data-tour="hero"]');

  return (
    <>
      {/* Floating button */}
      <button
        data-tour="help"
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

          {/* The tour of this page, on request. It is only offered where the tour has
              something to point at: TeacherTutorial is mounted on the dashboard, and a
              button that silently did nothing anywhere else would be worse than none. */}
          {canTour && (
            <button
              onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent(TOUR_EVENT)); }}
              style={{
                display:'flex', alignItems:'center', gap:'0.7rem', width:'100%', textAlign:'left',
                padding:'0.8rem 1rem', background:'#F3F7F3', border:'0', borderBottom:'1px solid #E6EBE5',
                cursor:'pointer', font:'inherit', flexShrink:0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E9F1EA'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F3F7F3'; }}
            >
              <span style={{ width:'34px', height:'34px', borderRadius:'10px', background:'var(--t-mid)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /><path d="M11 8v6" /><path d="M8 11h6" />
                </svg>
              </span>
              <span style={{ flex:1, minWidth:0 }}>
                <span style={{ display:'block', fontSize:'0.86rem', fontWeight:700, color:'var(--t-deep)' }}>Show me around this page</span>
                <span style={{ display:'block', fontSize:'0.74rem', color:'#6B736D', marginTop:'0.1rem' }}>A guided tour of the dashboard, about thirty seconds</span>
              </span>
              <span style={{ color:'#A3ADA6', fontSize:'1.2rem', lineHeight:1 }} aria-hidden="true">›</span>
            </button>
          )}

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
