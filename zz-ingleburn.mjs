import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyCFS0oFiThCyjgoRxgoJ6nyO34fzgyW2IM", authDomain: "tarongatracka.firebaseapp.com", projectId: "tarongatracka" });
const db = getFirestore(app);
const ORDER = ['kangaroo','koala','giraffe','lion','tiger'];
const students = await getDocs(collection(db, 'classes', 'LIF0AH', 'students'));

console.log('Students who did SOME but not all — exactly which chapters:\n');
students.forEach(d => {
  const ev = d.data().evolve || {};
  const done = ORDER.filter(id => ev[id]?.completed);
  const wrote = ORDER.filter(id => ev[id]?.reflection);
  if (!wrote.length || done.length === 5) return;
  console.log(`${d.id.padEnd(22)} completed [${done.join(', ') || '—'}]`);
  const extra = wrote.filter(w => !done.includes(w));
  if (extra.length) console.log(`${' '.repeat(22)} wrote but never finished: [${extra.join(', ')}]`);
});

console.log('\n── Of everyone who completed ONLY ONE chapter, which was it? ──');
const single = {};
students.forEach(d => {
  const ev = d.data().evolve || {};
  const done = ORDER.filter(id => ev[id]?.completed);
  if (done.length === 1) single[done[0]] = (single[done[0]] || 0) + 1;
});
console.log(single);

console.log('\n── kangaroo is the ONLY chapter with no GPS coordinates ──');
console.log('So it unlocks from anywhere. Every other chapter needs a location fix.');
process.exit(0);
