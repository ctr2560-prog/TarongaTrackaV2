import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';

// studentAuth.js — gives each student device an identity, so the security rules can tell
// "this student changing their own work" apart from "anyone changing anyone's work".
//
// ⚠️ WHY THIS EXISTS. Students have no logins by design, so `classes/{code}/students/{id}` had to
// be world-writable: there was nothing to check a write against. Anonymous auth closes that
// without asking a child for a credential — Firebase issues the device a random id, the student
// sees nothing, and the rules can then require that id to match.
//
// ⚠️ WHY NOT ROUTE WRITES THROUGH A CLOUD FUNCTION INSTEAD (considered and rejected 2026-10-03):
//    the Firestore SDK QUEUES writes while offline and sends them when signal returns. Most of
//    Taronga has no reception. An HTTP call to a function does not queue, it just fails — so the
//    "safer" option would have cost students their work on a real excursion, which is a worse
//    outcome than the attack it prevents. It was also ~45 call sites across every mode.
//
// ⚠️ NEVER sign in anonymously over an existing session. A teacher demonstrating the student flow
//    on their own device is signed in as themselves; replacing that with an anonymous user would
//    silently sign them out of the teacher portal. If someone is already signed in, their uid is
//    used and that is correct — they own what they create.
export async function ensureStudentAuth() {
  if (auth.currentUser) return auth.currentUser.uid;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user.uid;
  } catch (err) {
    // ⚠️ Deliberately non-fatal. If anonymous auth is unavailable — the provider switched off, a
    // locked-down school network, a browser blocking storage — the student must still be able to
    // take part. They simply write without a uid, exactly as before this existed, and the rules
    // keep allowing that for records with no uid on them. Failing the join instead would strand a
    // whole class at the gate.
    console.warn('[studentAuth] anonymous sign-in unavailable, continuing without:', err?.code || err);
    return null;
  }
}

// The field name is deliberately explicit rather than `uid`: a student document is read by
// teachers and staff screens, and `uid` alone reads like it might be a teacher's.
export const STUDENT_UID_FIELD = 'deviceUid';
