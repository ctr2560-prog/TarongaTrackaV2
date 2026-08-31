import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { normaliseCode } from '../utils/helpers';

// Live class ladder, shown on the badge screen. A student asked for it — they wanted to see
// where they sat against the rest of the class as they went.
//
// StudentContext already writes totalPoints to classes/{code}/students/{id} on every badge, so
// this needs no new data — just a listener on that collection.
//
// Students are animal aliases (Wombat, Quokka), never real names, so nobody is publicly ranked
// by name. The student's own row is always rendered, even when they are well down the list, so
// the panel never becomes a wall of other people's scores with no place for them in it.
// Cached so the ladder still shows something at the zoo, where the network is unreliable.
// Firestore persistence is NOT enabled app-wide (see firebase.js), so the SDK has no offline
// store of its own — without this the panel is simply blank whenever there is no signal.
const cacheKey = (code) => `tarongaLadder_${code}`;

const readCache = (code) => {
  try {
    const raw = localStorage.getItem(cacheKey(code));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const ago = (ts) => {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  return hrs === 1 ? 'an hour ago' : `${hrs} hours ago`;
};

export default function ClassLadder({ classCode, studentName, myPoints }) {
  // Seeded from cache in the initialiser rather than in the effect, so the last known ladder is
  // on screen from the very first render — and so we are not setting state during an effect.
  const initial = classCode ? readCache(normaliseCode(classCode)) : null;
  const [rows, setRows]   = useState(initial?.rows?.length ? initial.rows : null);
  const [stale, setStale] = useState(initial?.rows?.length ? initial.at : null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!classCode) return;
    const code = normaliseCode(classCode);

    // ⚠️ When Firestore is offline with nothing cached, onSnapshot neither fires nor errors —
    // it queues and retries in silence. Without this timer the panel would sit invisible with
    // no explanation, which is exactly what happened at the zoo.
    const timer = setTimeout(() => setOffline(true), 6000);

    const unsub = onSnapshot(
      collection(db, 'classes', code, 'students'),
      snap => {
        clearTimeout(timer);
        setOffline(false);
        const list = snap.docs
          .map(d => ({ id: d.id, name: d.data().name || d.id, points: d.data().totalPoints || 0 }))
          .filter(r => r.points > 0)
          .sort((a, b) => b.points - a.points);
        setRows(list);
        setStale(null);
        try { localStorage.setItem(cacheKey(code), JSON.stringify({ at: Date.now(), rows: list })); } catch { /* quota */ }
      },
      () => { clearTimeout(timer); setOffline(true); },
    );
    return () => { clearTimeout(timer); unsub(); };
  }, [classCode]);

  // Nothing live and nothing cached: say so rather than render an empty gap. A student who
  // taps through to this screen deserves to know the ladder exists and needs signal.
  if ((!rows || rows.length < 2) && offline) {
    return (
      <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'0.7rem 0.9rem', marginBottom:'0.75rem', border:'1px solid var(--t-mist)', textAlign:'center' }}>
        <div style={{ fontSize:'0.6rem', fontWeight:800, color:'var(--t-slate)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.2rem' }}>Class ladder</div>
        <div style={{ fontSize:'0.8rem', color:'var(--t-slate)', lineHeight:1.45 }}>
          📶 Needs internet. Your points are still being saved — the ladder will appear when you are back online.
        </div>
      </div>
    );
  }

  if (!rows || rows.length < 2) return null;   // pointless with nobody to compare against

  // The listener can lag a moment behind the badge that has just been awarded, so trust the
  // in-memory total for the student's own row rather than showing a stale number.
  const merged = rows.map(r =>
    r.name === studentName ? { ...r, points: Math.max(r.points, myPoints ?? 0) } : r
  ).sort((a, b) => b.points - a.points);

  const myIndex = merged.findIndex(r => r.name === studentName);
  const myRank  = myIndex >= 0 ? myIndex + 1 : null;

  // Top three, plus the student themselves if they are not already in it.
  const top = merged.slice(0, 3);
  const showMeSeparately = myIndex >= 3;

  const medal = ['🥇', '🥈', '🥉'];

  const row = (r, i, isMe) => (
    <div key={r.id} style={{
      display:'flex', alignItems:'center', gap:'0.55rem',
      padding:'0.4rem 0.6rem', borderRadius:'var(--t-r-sm)',
      background: isMe ? 'rgba(46,125,85,0.12)' : 'transparent',
      border: isMe ? '1px solid rgba(46,125,85,0.3)' : '1px solid transparent',
    }}>
      <span style={{ width:'1.6rem', flexShrink:0, fontSize: i < 3 ? '0.95rem' : '0.75rem', fontWeight:800, color:'var(--t-slate)', textAlign:'center' }}>
        {i < 3 ? medal[i] : i + 1}
      </span>
      <span style={{ flex:1, minWidth:0, textAlign:'left', fontSize:'0.85rem', fontWeight: isMe ? 800 : 600, color:'var(--t-deep)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
        {r.name}{isMe && ' (you)'}
      </span>
      <span style={{ flexShrink:0, fontSize:'0.85rem', fontWeight:800, color:'var(--earth-clay)' }}>{r.points}</span>
    </div>
  );

  return (
    <div style={{ background:'white', borderRadius:'var(--t-r-md)', padding:'0.7rem 0.6rem', marginBottom:'0.75rem', border:'1px solid var(--t-mist)' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'0 0.4rem', marginBottom:'0.35rem' }}>
        <span style={{ fontSize:'0.6rem', fontWeight:800, color:'var(--t-slate)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Class ladder</span>
        <span style={{ fontSize:'0.7rem', fontWeight:700, color: stale ? 'var(--t-ash)' : 'var(--t-mid)' }}>
          {stale
            ? `Last updated ${ago(stale)}`
            : myRank
              ? `You are ${myRank}${['st','nd','rd'][((myRank + 90) % 100 - 10) % 10 - 1] || 'th'} of ${merged.length}`
              : ''}
        </span>
      </div>
      {top.map((r, i) => row(r, i, r.name === studentName))}
      {showMeSeparately && (
        <>
          <div style={{ textAlign:'center', color:'var(--t-ash)', fontSize:'0.7rem', lineHeight:1 }}>⋯</div>
          {row(merged[myIndex], myIndex, true)}
        </>
      )}
    </div>
  );
}
