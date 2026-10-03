import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "AIzaSyCFS0oFiThCyjgoRxgoJ6nyO34fzgyW2IM",
  authDomain: "tarongatracka.firebaseapp.com",
  projectId: "tarongatracka",
});
const db = getFirestore(app);

const zd = await getDoc(doc(db, 'zoosnooz_docs', 'WDMZ31_Quokka'));
console.log('=== zoosnooz_docs/WDMZ31_Quokka ===');
console.log(JSON.stringify(zd.data(), null, 2).slice(0, 4000));

const sd = await getDoc(doc(db, 'classes', 'WDMZ31', 'students', 'Quokka'));
console.log('\n=== student doc zoosnooz field ===');
const s = sd.data();
if (s?.zoosnooz) {
  for (const [k, v] of Object.entries(s.zoosnooz)) {
    console.log(k, '-> videoURL:', v.videoURL ? 'yes' : 'no', '| videoTitle:', v.videoTitle, '| nightVision:', v.nightVisionUsed, '| conservationMsg:', (v.conservationMsg||'').slice(0,60));
  }
}
console.log('zzDocumentaryURL:', s?.zzDocumentaryURL ? s.zzDocumentaryURL.slice(0, 120) : 'none');
process.exit(0);
