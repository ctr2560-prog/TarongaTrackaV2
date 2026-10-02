// tarongaStaff.js — who may open the Taronga staff portal.
//
// ⚠️ THIS LIST IS FOR THE UI ONLY. The real control is `isWildlyStaff()` in firestore.rules,
//    which is checked on the server for every read and write. This copy exists so the login
//    screen can say "that account is not a staff account" instead of letting someone in to a
//    dashboard where every panel silently fails.
//
// ⚠️ KEEP IT IN STEP WITH firestore.rules. Adding an email here alone grants NOTHING — they
//    would reach the dashboard and every query would be denied. Appointing a staff member is:
//      1. add the email to `isWildlyStaff()` in firestore.rules
//      2. add it here
//      3. `firebase deploy --only firestore:rules`, then push
//    Deliberately slow, and step 1 requires access to the Firebase project itself.
//
// 🚫 Do NOT replace this with a role field read from Firestore. That is exactly what was removed
//    on 2026-10-03: `teachers/{email}.role` was writable by the user it described, so anyone who
//    signed up could set role: "Education Staff" and become Taronga staff.
export const TARONGA_STAFF_EMAILS = [
  'thebiologybloke@gmail.com',
];

export const isTarongaStaffEmail = (email) =>
  !!email && TARONGA_STAFF_EMAILS.includes(email.trim().toLowerCase());
