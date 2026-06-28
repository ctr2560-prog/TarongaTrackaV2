/**
 * One-time cleanup: removes phantom quizResults from tiger badges in science classes.
 * Science tiger only ever shows 1 question (from TigerMission), but a bug was saving
 * all 3 questions from animal.questions — with entries at index 1 & 2 always incorrect.
 * This script keeps only the first quizResult on each tiger badge in science classes.
 *
 * Run with:  node scripts/fix-tiger-quiz-results.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCFS0oFiThCyjgoRxgoJ6nyO34fzgyW2IM",
  authDomain: "tarongatracka.firebaseapp.com",
  projectId: "tarongatracka",
  storageBucket: "tarongatracka.firebasestorage.app",
  messagingSenderId: "925190436532",
  appId: "1:925190436532:web:47d2c5016dc1b28d7d09e1",
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);

const SCIENCE_SUBJECTS = [undefined, null, '', 'science'];

async function run() {
  const classesSnap = await getDocs(collection(db, 'classes'));
  let fixed = 0, skipped = 0;

  for (const classDoc of classesSnap.docs) {
    const cls = classDoc.data();
    if (!SCIENCE_SUBJECTS.includes(cls.subject ?? '')) {
      skipped++;
      continue;
    }

    const studentsSnap = await getDocs(collection(db, 'classes', classDoc.id, 'students'));
    for (const studentDoc of studentsSnap.docs) {
      const { badges } = studentDoc.data();
      if (!badges?.length) continue;

      let changed = false;
      const updatedBadges = badges.map(badge => {
        if (badge.animalId !== 'tiger') return badge;
        const qrs = badge.quizResults || [];
        // Keep only entries that were actually answered (have a defined correctOnFirstAttempt)
        // and trim to the 1 question TigerMission actually shows
        const cleaned = qrs.filter(qr => qr.correctOnFirstAttempt !== undefined).slice(0, 1);
        if (cleaned.length === qrs.length) return badge;
        changed = true;
        console.log(`  ${classDoc.id} / ${studentDoc.id}: tiger quizResults ${qrs.length} → ${cleaned.length}`);
        return { ...badge, quizResults: cleaned };
      });

      if (changed) {
        await updateDoc(doc(db, 'classes', classDoc.id, 'students', studentDoc.id), { badges: updatedBadges });
        fixed++;
      }
    }
  }

  console.log(`\nDone. Fixed ${fixed} student document(s), skipped ${skipped} non-science class(es).`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
