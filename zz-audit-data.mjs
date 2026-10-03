import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "AIzaSyCFS0oFiThCyjgoRxgoJ6nyO34fzgyW2IM",
  authDomain: "tarongatracka.firebaseapp.com",
  projectId: "tarongatracka",
});
const db = getFirestore(app);
const mean = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : null;

const classes = await getDocs(collection(db, 'classes'));
const beh = [], det = [], wri = [];
let students = 0, withQuiz = 0;
for (const c of classes.docs) {
  const v = c.data();
  if ((v.sessionType || 'standard') !== 'standard') continue;
  const st = await getDocs(collection(db, 'classes', c.id, 'students'));
  st.forEach(s => {
    students++;
    const d = s.data();
    const badges = d.badges || [];
    const qrs = badges.flatMap(b => (b.quizResults||[]).filter(q => !q.missionType || q.missionType==='knowledge'));
    if (qrs.length) withQuiz++;
    badges.forEach(b => { const o=b.observationScore; if(o){ beh.push(o.behaviour||0); det.push(o.detail||0); wri.push(o.writing||0);} });
  });
}
const f = n => `${n.toFixed(3)} /5  =  ${Math.round(n*20)}%`;
console.log('observations scored:', beh.length);
console.log('students total:', students, '| students with quiz data:', withQuiz);
console.log('Vocabulary  (behaviour):', f(mean(beh)));
console.log('Explanation (detail)   :', f(mean(det)));
console.log('Mechanics   (writing)  :', f(mean(wri)));
process.exit(0);
