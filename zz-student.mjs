import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyCFS0oFiThCyjgoRxgoJ6nyO34fzgyW2IM", authDomain: "tarongatracka.firebaseapp.com", projectId: "tarongatracka" });
const db = getFirestore(app);
const sd = await getDoc(doc(db, 'classes', 'WDMZ31', 'students', 'Quokka'));
const s = sd.data() || {};
console.log('top-level keys:', Object.keys(s).join(', '));
for (const [k, v] of Object.entries(s.zoosnooz || {})) {
  console.log(k, JSON.stringify({ videoTitle: v.videoTitle, nightVisionUsed: v.nightVisionUsed, conservationMsg: v.conservationMsg, videoCompleted: v.videoCompleted }));
}
process.exit(0);
