import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// tarongaStaff.js — who may open the Taronga staff portal.
//
// ⚠️ THIS IS FOR THE UI ONLY. The real control is `isWildlyStaff()` in firestore.rules, enforced
//    server-side on every read and write, and `verifyStaff()` in functions/index.js for the admin
//    endpoints. This exists so the login screen can say "that account does not have staff access"
//    instead of letting someone into a dashboard where every panel silently fails.
//
// Staff access is one of two things:
//   1. the ROOT ADMIN below — hard-coded, and deliberately NOT removable through the app. It is
//      the guarantee that a mistake, or a compromised staff account removing the others, can
//      never lock Taronga out of its own project. Changing it means editing firestore.rules,
//      functions/index.js and this file, then deploying all three.
//   2. an entry in the `staffAdmins` collection, which ONLY EXISTING STAFF can write.
//
// 🚫 Do NOT move staff status onto a document the subject can write. That was the
//    privilege-escalation bug fixed on 2026-10-03: it lived in `teachers/{email}.role`, users
//    write their own teacher document, so anyone who signed up could make themselves staff.
export const ROOT_ADMIN_EMAILS = [
  'thebiologybloke@gmail.com',
];

export const isRootAdminEmail = (email) =>
  !!email && ROOT_ADMIN_EMAILS.includes(email.trim().toLowerCase());

// Rules allow a signed-in user to read ONLY THEIR OWN staffAdmins entry, so this check never
// publishes the list of administrators. A denied read means "not staff", which is the same
// outcome as a missing document.
export async function isTarongaStaff(email) {
  const key = (email || '').trim().toLowerCase();
  if (!key) return false;
  if (isRootAdminEmail(key)) return true;
  try {
    const snap = await getDoc(doc(db, 'staffAdmins', key));
    return snap.exists();
  } catch {
    return false;
  }
}
