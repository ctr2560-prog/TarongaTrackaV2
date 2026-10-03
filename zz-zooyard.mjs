import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyCFS0oFiThCyjgoRxgoJ6nyO34fzgyW2IM", authDomain: "tarongatracka.firebaseapp.com", projectId: "tarongatracka" });
const db = getFirestore(app);
const ANIMALS = ['koala','tiger','giraffe'];

const snap = await getDocs(query(collection(db,'classes'), where('sessionType','==','zooyard')));
console.log('ZooYard classes:', snap.size, '\n');
let totalStudents = 0, finished = 0, anyWork = 0;
const perAnimal = { koala:0, tiger:0, giraffe:0 };
for (const d of snap.docs) {
  const c = d.data();
  const st = await getDocs(collection(db,'classes',d.id,'students'));
  let done = 0;
  st.forEach(s => {
    const zy = s.data().zooyard || {};
    const n = ANIMALS.filter(a => zy[a]?.completed).length;
    ANIMALS.forEach(a => { if (zy[a]?.completed) perAnimal[a]++; });
    if (n) anyWork++;
    if (zy.sessionCompleted) { done++; finished++; }
  });
  totalStudents += st.size;
  console.log(`${d.id.padEnd(8)} "${(c.className||'?').slice(0,26).padEnd(26)}" ${String(c.schoolName||'?').slice(0,24).padEnd(24)} stage=${c.stage||'?'} students=${String(st.size).padStart(3)} finished=${done}`);
}
console.log(`\nTOTAL students ${totalStudents} | did some work ${anyWork} | completed the session ${finished}`);
console.log('completed per habitat:', perAnimal);

const cs = await getDocs(collection(db,'citizenScienceSubmissions'));
console.log('\nHabitat Hero submissions:', cs.size);
const byStatus = {};
cs.forEach(d => { const s = d.data().status || '?'; byStatus[s] = (byStatus[s]||0)+1; });
console.log('by status:', byStatus);
process.exit(0);
