import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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
  // ⚠️⚠️ WAIT FOR FIREBASE TO RESTORE THE PERSISTED SESSION FIRST. This is not optional.
  //
  // `auth.currentUser` is NULL for the first moments of every page load — Firebase restores the
  // saved session asynchronously. Checking it immediately therefore looks like "nobody is signed
  // in", and the code below would mint a BRAND NEW anonymous user on EVERY RELOAD.
  //
  // That is exactly what happened on 2026-10-03, and the damage was not obvious: the student's
  // record still carried the uid stamped at join, the new uid did not match it, and the security
  // rule then refused every write. Drafts stopped saving. Clips stopped saving. Silently, because
  // writes are backgrounded. It also quietly created a new anonymous account per reload.
  //
  // 🚫 Never call signInAnonymously() without awaiting the auth state first.
  try {
    if (typeof auth.authStateReady === 'function') {
      await auth.authStateReady();
    } else {
      await new Promise(resolve => {
        const un = onAuthStateChanged(auth, () => { un(); resolve(); });
      });
    }
  } catch { /* fall through and sign in below */ }

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

// claimStudentRecord — stamps THIS device's uid onto a student record that has no uid yet.
//
// ⚠️ WHY THIS IS NEEDED AT ALL. `deviceUid` is written at JOIN, and only at join. That is fine
// until a record exists with no uid on it, which happens three ways: it predates this mechanism,
// a teacher pressed "New device" to release it, or the 2026-10-03 auth race left a stale uid that
// had to be cleared. Without a resume-time claim those records stay unclaimed forever and the
// tightened rule protects nothing on them.
//
// ⚠️ IT ONLY EVER CLAIMS AN UNCLAIMED RECORD. If a uid is already there it is left completely
// alone — overwriting would mean any device that knew a class code and an alias could steal a
// record off the device holding it, which is the exact thing the uid exists to prevent. Releasing
// a claim is a teacher action ("New device"), never something the client decides for itself.
//
// Returns true only if it actually wrote a claim. Failure is silent and harmless: the record
// stays unclaimed, which is a state the rules already permit.
export async function claimStudentRecord(classCode, studentId) {
  if (!classCode || !studentId) return false;
  const uid = await ensureStudentAuth();
  if (!uid) return false;
  try {
    const ref = doc(db, 'classes', classCode, 'students', studentId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;
    if (snap.data()?.[STUDENT_UID_FIELD]) return false;     // already claimed — never touch it
    await updateDoc(ref, { [STUDENT_UID_FIELD]: uid });
    return true;
  } catch (err) {
    console.warn('[studentAuth] could not claim this record, continuing:', err?.code || err);
    return false;
  }
}

// The field name is deliberately explicit rather than `uid`: a student document is read by
// teachers and staff screens, and `uid` alone reads like it might be a teacher's.
export const STUDENT_UID_FIELD = 'deviceUid';
