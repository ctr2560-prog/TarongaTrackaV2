// One-off: give existing evolve_docs a souvenirToken so their NFC links work.
// New submits generate their own token in EvolveScreen. Safe to re-run — it skips docs
// that already have one, so tags already written never change.
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { randomBytes } from 'node:crypto';

const app = initializeApp({
  apiKey: "AIzaSyCFS0oFiThCyjgoRxgoJ6nyO34fzgyW2IM",
  authDomain: "tarongatracka.firebaseapp.com",
  projectId: "tarongatracka",
});
const db = getFirestore(app);
const token = () => Array.from(randomBytes(6)).map(n => n.toString(36).padStart(2,'0')).join('').slice(0,8);

const snap = await getDocs(collection(db, 'evolve_docs'));
for (const d of snap.docs) {
  const v = d.data();
  if (v.souvenirToken) { console.log('skip (has token):', d.id); continue; }
  const t = token();
  await updateDoc(doc(db, 'evolve_docs', d.id), { souvenirToken: t });
  console.log('set:', d.id, '->', `/?doc=ev_${v.classCode}_${v.studentId}_${t}`);
}
console.log('done');
process.exit(0);
