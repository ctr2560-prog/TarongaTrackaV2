// zzClipStore — a durable copy of each ZooSnooz clip, on the device.
//
// ⚠️⚠️ WHY THIS EXISTS. A recorded clip lived in exactly one place: a `blob:` URL in page memory.
// Cameron, 2026-11-02: his phone locked after filming, he carried on, the preview screen counted
// 5 of 5 clips, and the finished documentary contained none of them. The URLs all survived in the
// map; the memory they pointed at had been reclaimed by the OS. Nothing could tell that apart
// from a playback failure, so the app told a student his clips "would not play" while every one
// of them sat safely in Storage.
//
// A reload does the same thing by a different route: `zzVideoURLs` is written only by the upload
// handler, never rehydrated, so refreshing the page empties it.
//
// 🚫 THE OBVIOUS FIX — read the clips back from Firebase Storage — IS BLOCKED, and the reason is
//    worth recording so nobody spends a day rediscovering it. `getMediaUrl`'s student branch uses
//    ONE `studentId` for two incompatible things:
//        classes/{code}/students/{studentId}      ← the Firestore doc id, `safeStudentId(name)`,
//                                                   which strips only \ / # . $ [ ]
//        path must contain /{code}/{studentId}/   ← the Storage folder, which ZooSnooz writes as
//                                                   name.replace(/[^a-zA-Z0-9_-]/g, '_')
//    For "Quoll" those agree. For "Sumatran Tiger" they do not, so the Firestore lookup 404s or
//    the path check 403s whichever value you send. 15 of the 30 aliases in constants/animals.js
//    contain a space, so student-side minting is unavailable to HALF of all students. Evolve is
//    unaffected only because it stores the alias unsanitised. Fixing that means changing and
//    redeploying a security-sensitive Cloud Function; this module needs none of it.
//
// ⚠️ This is a CACHE, never the system of record. The upload to Firebase Storage is unchanged and
//    remains the real copy. If IndexedDB is unavailable, full, or wiped, every function here
//    fails soft and the app behaves exactly as it did before.
// 🚫 Never make the stitch depend on a read from here succeeding.

const DB_NAME  = 'zoosnooz-clips';
const DB_VER   = 1;
const STORE    = 'clips';

// ⚠️ Safari in private browsing, and a locked-down school device, can throw on `indexedDB.open`
//    or simply never fire an event. Everything below resolves to null rather than rejecting, so
//    a caller can always `await` it without a try/catch and carry on.
function openDb() {
  return new Promise(resolve => {
    let settled = false;
    const done = v => { if (!settled) { settled = true; resolve(v); } };
    // A request that never fires is the failure mode that would hang the stitch.
    const bail = setTimeout(() => done(null), 3000);
    try {
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = () => { clearTimeout(bail); done(req.result); };
      req.onerror   = () => { clearTimeout(bail); done(null); };
      req.onblocked = () => { clearTimeout(bail); done(null); };
    } catch {
      clearTimeout(bail);
      done(null);
    }
  });
}

function tx(db, mode, fn) {
  return new Promise(resolve => {
    let settled = false;
    const done = v => { if (!settled) { settled = true; resolve(v); } };
    try {
      const t = db.transaction(STORE, mode);
      const store = t.objectStore(STORE);
      const req = fn(store);
      t.onabort = t.onerror = () => done(null);
      if (req) {
        req.onsuccess = () => done(req.result ?? true);
        req.onerror   = () => done(null);
      } else {
        t.oncomplete = () => done(true);
      }
    } catch {
      done(null);
    }
  });
}

// The key is scoped to the class AND the student, so a shared school tablet passed to the next
// child never serves them someone else's footage.
export const clipKey = (classCode, studentKey, animalId) =>
  `${String(classCode).toUpperCase()}/${studentKey}/${animalId}`;

// Save a clip. Called the moment recording stops, alongside the object URL and the upload.
// ⚠️ Stores the Blob itself, not an object URL — a URL is the thing that dies.
export async function saveClip(key, blob) {
  if (!key || !blob || !blob.size) return false;
  const db = await openDb();
  if (!db) return false;
  const ok = await tx(db, 'readwrite', s => s.put(blob, key));
  try { db.close(); } catch { /* already closed */ }
  return ok !== null;
}

// Read a clip back. Returns a Blob, or null if it is not there.
export async function loadClip(key) {
  if (!key) return null;
  const db = await openDb();
  if (!db) return null;
  const blob = await tx(db, 'readonly', s => s.get(key));
  try { db.close(); } catch { /* already closed */ }
  return blob instanceof Blob && blob.size > 0 ? blob : null;
}

// Drop this student's clips once the documentary is submitted, so a shared device does not
// accumulate everybody's footage.
// ⚠️ Prefix-scoped on purpose. 🚫 Never clear the whole store: on a shared tablet that would
//    delete another student's clips mid-session.
export async function clearClips(prefix) {
  if (!prefix) return false;
  const db = await openDb();
  if (!db) return false;
  const keys = await tx(db, 'readonly', s => s.getAllKeys());
  if (Array.isArray(keys)) {
    const mine = keys.filter(k => typeof k === 'string' && k.startsWith(prefix));
    for (const k of mine) await tx(db, 'readwrite', s => s.delete(k));
  }
  try { db.close(); } catch { /* already closed */ }
  return true;
}
