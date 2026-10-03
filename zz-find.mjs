import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "AIzaSyCFS0oFiThCyjgoRxgoJ6nyO34fzgyW2IM",
  authDomain: "tarongatracka.firebaseapp.com",
  projectId: "tarongatracka",
});
const db = getFirestore(app);

const snap = await getDocs(collection(db, 'zoosnooz_docs'));
snap.forEach(d => {
  const v = d.data();
  const ts = v.submittedAt?.toDate?.() || v.createdAt?.toDate?.() || v.updatedAt?.toDate?.();
  console.log(d.id, '|', ts ? ts.toLocaleString('en-AU') : 'no-timestamp', '| documentaryURL:', v.documentaryURL ? 'yes' : (v.videoURL ? 'videoURL' : 'none'), '| keys:', Object.keys(v).join(','));
});
process.exit(0);
