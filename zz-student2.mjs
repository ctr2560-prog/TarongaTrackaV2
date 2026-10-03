import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyCFS0oFiThCyjgoRxgoJ6nyO34fzgyW2IM", authDomain: "tarongatracka.firebaseapp.com", projectId: "tarongatracka" });
const db = getFirestore(app);
const sd = await getDoc(doc(db, 'classes', 'WDMZ31', 'students', 'Quokka'));
const s = sd.data() || {};
for (const id of ['tiger','lion','rhino','binturong','sun-bear']) {
  const m = s[`zoosnooz.${id}`];
  console.log(id, m ? JSON.stringify({ videoTitle: m.videoTitle, nightVisionUsed: m.nightVisionUsed, conservationMsg: m.conservationMsg }) : 'no map');
}
console.log('\nzzBadges sample:', JSON.stringify((s.zzBadges||[])[0] || null).slice(0, 400));
process.exit(0);
