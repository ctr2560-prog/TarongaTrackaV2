# Taronga Tracka — CLAUDE.md

## What is this project?

Taronga Tracka is an educational field-study app for school excursions to Taronga Zoo Sydney. Students use the app to make animal observations, complete missions, earn badges, and participate in class challenges. Teachers manage classes and track progress through a portal. A staff portal (Taronga admin) manages codes, approves submissions, and oversees the whole program.

There is also **ZooSnooz** — a separate night-mode variant with NFC stations, keeper interactions, video recording, and a documentary stitching pipeline, sharing the same codebase.

There is also **ZooYard** — a self-attest, no-GPS "at school" program for classes that can't visit the zoo (built for NSW DoE devices, which block geolocation). Students work through three habitats in their own schoolyard, each one ending in a real citizen science build. See the ZooYard Deep Reference section below.

There is also **Evolve** — a Stage 6 (Year 11/12) twilight excursion supporting the Life Ready course. Five animals are five chapters of one story about leaving school; students write a reflection and film a piece to camera at each, which stitch into a single short film they keep. Deliberately has no points, badges or marks. See the Evolve Deep Reference section below.

There is also **Wildest Dreams** — a video-first mode for diverse learners, particularly school support units. Students watch an animal, choose what they want to show about it, and film a short piece; the clips stitch into one documentary, "My Wildest Dreams", that they keep. No quiz, no score, no marks, no badges, no leaderboard, and no required writing **or speech**. Lives entirely under `src/modes/wildest-dreams/`. See the Wildest Dreams Deep Reference section below.

Live URLs: **tarongatracka.com.au** (GitHub Pages, auto-deploys from `main`) and
**tarongatracka.web.app** (Firebase Hosting, manual deploy). Firebase project: `tarongatracka`,
region: `australia-southeast1`. ⚠️ See **Build & Deploy** — these two drift apart.

---

## Where we left off (2026-09-28)

### ⚠️ Do these first
1. ~~**`firebase deploy --only storage` has NOT been run.**~~ ✅ **DONE 2026-10-02** — deployed
   alongside the folder-listing fix, so the `wildestDreams/` rule is finally live and Wildest
   Dreams uploads should now work. **Untested with a real clip** — worth one upload to confirm.
2. **Decide whether Taronga actually wants a retention policy.** ⚠️ Until 2026-09-24 the ZooSnooz
   parent letter told families raw footage was "permanently deleted within 48 hours" and the
   documentary "hosted for up to 12 months, then deleted". **Neither was ever implemented** —
   there is no scheduled function and no `deleteObject` call anywhere in the codebase — and that
   letter had already gone home to families. The wording has been corrected to describe what the
   system really does: footage is retained, and deletion can be requested via the teacher. Both
   letters now say the same thing.
   **Nothing is promised that is not delivered, but there is still no automatic deletion.** If a
   retention policy is wanted, it is a scheduled Cloud Function, and it must be scoped carefully:
   it would be an automated deleter running against real student media. The paths make it
   feasible — clips are `zoosnooz/{code}/{sid}/{animalId}.{ext}` and the film is always
   `.../documentary.{ext}` — but get the filter wrong and you destroy the keepsakes.
   ⚠️ **Never restore a retention claim to a letter before the job exists and has been tested.**
3. **The Wildest Dreams voice clips are macOS "Karen"** and are live on the public domain.
   Apple's system voices are licensed for use on a Mac, not for redistribution inside a product.
   Replacing is a file drop into `public/voice/` with the same names — no code change.
   `scripts/generate-wd-voice.sh` lists all 22 keys and their exact lines.

4. **The ZooSnooz backgrounded-tab fix is LIVE BUT UNPROVEN.** Ported 2026-09-24 and pushed, but
   never validated by a real stitch. Automated testing cannot prove it — a driven tab reports
   itself hidden and manufactures the very bug under test. Needs a foreground run before the next
   ZooSnooz night: build a documentary from 2–3 clips, switch away ~10s mid-way, confirm every
   segment plays video and the console carries no `[zoosnooz] … drew only N frames` line.

### The first full Evolve run — Ingleburn HS, 2026-09-22 (class `LIF0AH`)
90 students, 30 groups of three, **one phone per group**, 2.5 hours, twilight. The numbers below
came out of Firestore afterwards and should shape every Evolve decision from here.

- **28 groups joined. 4 finished all five chapters (14%).**
- **13 groups never wrote a single word.** Not blocked, not stuck — never started. No mechanic
  explains that; it is facilitation, and it is the largest single number in the data.
- **A chapter genuinely takes 14–21 minutes.** Measured from the four who finished: 56–85 minutes
  for five chapters. So five chapters is 70–105 minutes of work, inside 2.5 hours that also has
  to cover briefing, walking and gathering. With three students sharing one device it does not
  fit at all — two thirds of each group are idle at any moment, which is where "reckless and
  silly" comes from. **The behaviour was structural, not disciplinary.**
- **19 of 37 chapter saves happened in the first 10 minutes** — everyone doing the kangaroo at
  once, from wherever they were standing, because it is the one chapter with no GPS. Then a cliff.
- ⚠️ **Do not read the kangaroo clustering as evidence of a GPS fault.** The sequence gate was on,
  which forces every partial walk to be a prefix starting at the kangaroo, so a drop-out from ANY
  cause looks identical. This was initially misread as a smoking gun; it is a confound. Seven
  groups did get past the koala, so GPS was working for plenty of them.

**What changed as a result:** the sequence gate was removed (see the Evolve reference). Still
open: group starting points so a cohort can be split into streams, the one-phone-per-three
question, red torches as standard kit, and whether the film should still require all five
chapters when 4 groups in 30 reached that point.

**Red torches were the night's best discovery.** Red light preserves night vision and is far less
disturbing to nocturnal animals, which is why it is standard in nocturnal houses. Red on the
animal gave good koala footage; red on the student made the piece to camera work. It is not yet
in the app's filming guidance or the teacher info sheet — it should be.

### Recently shipped (2026-09-28 → 10-01) — ZooYard: watch, build, explain
- **Habitat Hero was absorbed into every habitat.** The standalone end-of-session task is gone;
  each animal carries its own `citizenScience` block. See "Watch, build, explain".
- **Eight habitats** (was three): koala, tiger, giraffe, blue-mountains-bushwalk, sea-lion,
  chimpanzee, gorilla, rhino. The five new ones are **DRAFT content**, marked as such.
- **A two-minute watch that records nothing.** The measurement step was added 09-26 and removed
  10-01 as one step too many. ⚠️ Do not reinstate a counting activity — read the reasoning first.
- **`habitatObservations` was built and then removed** with the measurement that fed it. Never
  deployed, never written to.
- **MCQ answers scattered.** All eight sat at `correct: 0`; now two per position.
- **Stage 1 writing prompts** on all eight, closing the silent fallback-to-Stage-4 bug.
- ✅ **Walked in a browser 2026-10-01**: map with 8 markers → unlock → video placeholder → quiz →
  watch (timer counts down, skip works) → build screen. No app errors in the console. The timer
  was validated in a *driven* tab, which Chrome reports as hidden — a rAF-based countdown would
  have frozen there, and the timestamp one did not.
- #### ⚠️ The stitch screen now reports WHY it failed (2026-10-03)

Every failure path in ZooSnooz's stitch used to end on the same screen reading **"Video stitching
is not supported on this device"** — a guess presented as a diagnosis, which blamed the device
even when the real cause was an empty recording or a recorder that would not start. On a phone
there is no console, so that message made an iPhone fault impossible to investigate.

`zzStitchError` now carries a reason (recorder would not start, or the byte and chunk count when
the output was empty) and the screen shows it, with "Every clip you filmed is still saved."
beneath. Add a reason to any new failure path rather than letting it fall through to the generic
line.

**Evolve got the same treatment, and its contract changed:** `buildEvolveFilm` now resolves to
`{blob, url}` **or `{error}`** and 🚫 **never a bare null**. Its three failure paths (no clips, the
recorder refusing to start, an empty output) each carry a sentence, and the film screen shows it
above "Every chapter you filmed is still saved." The caller must test `result?.blob`, not
`result`. Evolve's screen used to say *"Your device could not stitch the film"* for every cause —
blaming a student's phone for faults that were ours, and leaving nothing to act on when Cameron
reported it failing on an iPhone.

⚠️ **The two camera steps remain unverified.** Automation cannot drive `getUserMedia`, so the
  habitat unlock photo and the build photo have never actually been captured and uploaded. That
  is the one path left to check by hand, and both are required to finish a habitat.

### Recently shipped (2026-09-27 → 09-28) — ZooYard, the 3D zoo
- **The habitat picker is a 3D model of Taronga**, full screen, with a marker welded to each
  habitat. See "The 3D zoo map" in the ZooYard reference — the compression recipe there is not
  optional and is the most expensive thing in this document to rediscover.
- **Habitats are locked** until a student photographs the real spot, and that unlock happens in
  a sheet **over the map** rather than on a screen of its own.
- **`@google/model-viewer` added** — the first new runtime dependency in a long while. ZooYard
  only, dynamically imported.
- **`blue-mountains-bushwalk.jpg` was 7.4MB** (a 3543x2362 original) and is now 419KB. It was
  being served to every student on that mission.

### Recently shipped (2026-09-25 → 09-26) — ZooYard pass
- **Field study per habitat** — the change that moves ZooYard from nature appreciation to
  science. See the ZooYard reference, and note the never-score-the-measurement rule.
- **Dr. Cam** — first-run instructions plus the helper bot on all eight ZooYard screens.
- **Written feedback** on the badge screen, ZooYard's own wording, tiered by stage.
- **Immersive write-up screen** — habitat video carried through, field-notebook card.
- **Home screen** — the orange "Let's Track!" button now joins a class instead of opening a
  Coming Soon placeholder, and the duplicate Join a Class button is gone. Public mode already
  had no route in from the home screen, which makes the eventual public/school split cleaner
  than expected.

### Recently shipped (2026-09-18 → 09-24)
- **ZooSnooz stitcher hardened** — see items 1 and 2 of the Video & media pipeline section, plus
  a wake lock and a low-framerate warning it never had.
- **Evolve is free-flowing** — chapters unlock on proximity alone, in any order.
- **Evolve trail animation** — the arrival now runs in sequence, and lit runs fade at loose ends.
- **Evolve writing is saved independently of the clip upload**, so a dead spot no longer costs a
  student their reflection as well as their film.
- **"Make it again"** on the Evolve film, so one backgrounded tab no longer ruins the keepsake.
- **`EVOLVE_MIN_WORDS` 12 → 10.**

### Recently shipped (2026-09-07 → 09-17)
- **Wildest Dreams**, a whole new mode — see its Deep Reference below.
- **Recorded voice** for everything a student taps in Wildest Dreams, replacing reliance on
  `speechSynthesis`. See "Audio & speech" in the Video & media pipeline section — that section
  is the single most expensive thing in this doc to rediscover.
- **NSW Science Life Skills outcomes** surfaced on Create Class and on Curriculum Alignment
  (new **Programs** group in the sidebar), plus a Wildest Dreams teacher information sheet.
- **Evolve filming opt-out notification** — `public/evolve-notification.html`, linked from Class
  Details for Evolve classes. Also the only place families are now told about the Advice Wall.

### Recently shipped (2026-08-25 → 08-31)
- **ZooYard photos use a real camera** (`components/PhotoCapture.jsx`) and the self-attest photo
  is now **required** before continuing. Teachers see them all in a **📍 Where students went**
  grid on class details. See the ZooYard reference.
- **PDHPE and Stage 3 Science content passes** — prompts, MCQs, instructions and four scoring
  fairness fixes. See "Content rewrites" below and the Scoring System section.
- **Class ladder** on the badge collection screen (`components/ClassLadder.jsx`).
- **Highlights Package** — printable class report, `utils/highlightsPackage.js`.
- **GitHub Pages 404 fix** — reloading any sub-path used to show GitHub's error page.
  See Build & Deploy.

### Deploy state
- Everything is **pushed to `main`**, so **tarongatracka.com.au is current**.
- **tarongatracka.web.app is behind** — last manual `firebase deploy --only hosting` was
  2026-08-13, so it is still serving the **broken stitcher**. Run
  `npm run build && firebase deploy --only hosting` to resync. See Build & Deploy.
- Firestore rules and Cloud Functions are deployed and current.
  **Storage rules are NOT** — see item 1 above.
- **The Storage bucket's CORS policy is now set** and lives in `cors.json`. See the CORS rule in
  Video & media pipeline. Reapply with:
  `gcloud storage buckets update gs://tarongatracka.firebasestorage.app --cors-file=cors.json`
  ⚠️ The `tarongatracka` project belongs to **thebiologybloke@gmail.com**, not ctr2560@gmail.com —
  the latter cannot see the bucket at all and the command fails with a permissions error.

### Evolve — what is built
Student flow is complete and verified end to end: opener → winding map → per chapter
(insight → 60s watch → write → film) → upload gate → stitch → film → keepsake doc in
`evolve_docs`. Teacher side has its own table plus landscape A4 pledge certificates.

**Staff portal Evolve views** (2026-08-23) live at **Programmes → ✦ Evolve**, with two sub-tabs:
**🎬 Films** (per student: watch, download and copy the film, plus every chapter clip, plus the
souvenir link) and **🖨 Pledges** (per class: read the koala pledges, print certificates for a
whole class or one student). Both are deliberate copies of `ZooSnoozAdminTab`'s shape rather than
shared components — see the comment on `EvolveFilmsTab`.

**Chapters are gated by PROXIMITY ONLY** (2026-09-23). A chapter unlocks when the student is near
the animal, in any order. `EvolveScreen.jsx`, in the `EVOLVE_STORY_ORDER` map.

⚠️ They were also gated **in sequence** from 2026-08-20 to 2026-09-23 — a chapter needed the
previous one finished. **Do not reinstate it.** It is fine for one class and does not survive a
cohort: at the first full run (Ingleburn HS, 90 students in 30 groups, 2026-09-22) it forced every
group to start at the kangaroo, produced a 90-student jam at stop one, and only 4–5 groups
finished all five chapters.

**Removing it does not affect the film.** `buildEvolveFilm` is handed `EVOLVE_STORY_ORDER`
filtered to whichever chapters have a clip, so the film always assembles in narrative order no
matter what order it was shot in. Verified by filming in reverse: the film still reads
kangaroo → koala → giraffe → lion → tiger. Capture order and story order were always independent
— that is what `order` on each chapter is for.

The trail graphic now lights each leg from **that stop's own** completion rather than the previous
chapter's, or a free-flowing student would see a dashed leg beside a chapter they had finished.

### Evolve — what is NOT built
1. **Advice Wall.** The giraffe chapter already writes to `evolveAdvice` with
   `status: 'pending'`, `cohortYear`, and no student name — but **nothing reads that collection**.
   ⚠️ **The consent notice was removed from the giraffe write screen on 2026-08-20** at Cameron's
   request. It was the only place a student was told their writing might be shown to others, so
   the wall now takes writing from students who were never asked.
   **Partly addressed 2026-09-17**: `public/evolve-notification.html` discloses it to families —
   shared writing is attributed by year group only, never by name or alias, and moderated before
   anything is shown. That is now the ONLY place anyone is told. There is deliberately **no
   checkbox** for it (Cameron's call), so declining is a verbal arrangement with the teacher: no
   record is kept and the staff moderation view has nothing to filter on. Moderation still gates what
   appears and it stays alias-attributed, but if consent is wanted back the cheap version is a
   checkbox setting `consented: true` on the `evolveAdvice` doc so moderation can filter on it.
   Needs: staff moderation UI, and a standalone wall. Cameron wants it as its own page, on the
   teacher side and possibly Wildly's homepage. Because Wildly points at the same Firestore
   project, one collection can serve both with no API between them. This is the agreed next piece.
2. **Teacher/staff analytics for Evolve** beyond the class table — nothing in `AdminDashboardScreen`
   knows about `sessionType: 'evolve'` yet (the Analytics tab's view filters and aggregations have
   no Evolve branch).
3. **Class export** of the writing, for a school's own reflection ceremony.
4. ~~**Souvenir URL route.**~~ **BUILT 2026-08-20** — see "Souvenir route" in the Evolve deep
   reference. `?doc=ev_{classCode}_{studentId}_{token}` resolves through `evolve_docs`.
5. **Kangaroo GPS.** `latitude`/`longitude` are still `null` in `evolveAnimals.js`, so that
   chapter unlocks with no proximity check at all — from anywhere in the zoo. Needs capturing on
   site at the Australian Walkabout. The photo exists.
   ⚠️ Now that the sequence gate is gone (2026-09-23) this is no longer a blocker, but it is a
   bigger hole: with proximity as the ONLY lock, the kangaroo has no lock whatsoever.

### Open decisions Cameron has parked
- **Portrait vs landscape film.** Kept portrait: capture matches the film, students hold phones
  vertically, and the film is a personal keepsake. If it ever needs projecting at a school
  ceremony, the agreed option is a landscape output with the portrait clip centred and a blurred
  copy filling the sides — a change in the stitcher only, nothing students do changes.
- **"Skip the timer"** on the 60-second watch screen exists so thirty students on a schedule
  aren't locked in place for five minutes. Deliberately quiet. Remove if it gets abused.
- **Student attribution is by animal alias** (Quoll, Bilby). Evolve stores no real names, which is
  why pledge certificates and the Advice Wall are alias/cohort-attributed.

### ⚠️ Security posture (assessed against the LIVE project, 2026-10-02)

**Root cause, and the thing to understand before touching any of this:** students have no logins
and the staff portal had no real login, so the browser talks straight to Firestore and Storage.
For the app to work, the database had to be left open. Nearly every finding below follows from
that one decision.

Measured, not theorised. A 15-line script using only the public config from the JS bundle, **with
no login at all**, returned: `classes` 10, `students` (collection group) 104, `zoosnooz_docs` 38,
`studentFeedback` 32, `evolveAdvice` 21, `accessCodes` 90, `adminAccess` 1 — in **1.4 seconds**.
`teachers` was correctly DENIED.

#### ✅ FIXED and verified 2026-10-02
- **Staff portal authentication bypass.** `adminAccess` was `allow read: if true` and the document
  ID *is* the access code, so listing the collection returned the staff password. Now
  `read, write: if false`, verified denied from an unauthenticated client. Verification moved to
  the **`verifyAdminCode`** Cloud Function (Admin SDK, bypasses rules), with per-IP lockout in
  `adminAuthAttempts` after 10 failures in 15 minutes — because moving the check server-side
  without throttling just converts "read the code" into "guess it fast".
  ⚠️ **Never reopen `read` on `adminAccess` to debug a login problem. That IS the vulnerability.**
- **Storage folder listing closed, uploads restricted to media, deletes denied.** See item 1.
- **Destructive writes now need a login.** See item 2.
- **App Check scaffolding** in `src/firebase.js`, inert until `VITE_APPCHECK_SITE_KEY` is set.
  Read the rollout notes in that file before enabling — **Wildly shares this project and will go
  down if enforcement is switched on before Wildly sends tokens too.**

#### 🔴 STILL OPEN — in rough priority order
#### ⚠️ Item 2 — signed URLs: STARTED 2026-10-03, BLOCKED ON AN IAM GRANT

`getMediaUrl` is built and deployed. It mints a **v4 signed URL valid for 60 minutes**, and takes
the storage path **out of the already-stored URL** rather than requiring a migration — so it can
be proven before anything in the database is rewritten.

Entitlement, two ways only:
- **souvenir** — verifies `souvenirToken` against the keepsake document. ⚠️ This is the point of
  the exercise: the token currently protects the *page*; this makes it protect the *file*.
- **staff** — a verified staff ID token.

✅ **UNBLOCKED and the souvenir path is live (2026-10-03).** The IAM grant was made and verified;
both souvenir viewers (Evolve and Wildest Dreams) now play from a signed URL. Proven end to end
on a real keepsake: `X-Goog-Expires=3600`, byte-range fetch returns **206**, and a wrong token
still returns "Code not found".

⚠️ **The viewers fall back to the stored permanent URL if minting fails.** A student opening their
keepsake must never meet a broken player because a function was cold. That is the pre-existing
behaviour, not a new hole — and it means the hole is not fully closed until the old download
tokens are revoked (see below).

**The blocker that was hit, for next time:**
🚫 **The Cloud Functions service account could not sign.** Confirmed by direct test:
`Permission 'iam.serviceAccounts.signBlob' denied`. This is **not a code bug** and no amount of
rewriting will fix it.

**The grant required** (Google Cloud Console → IAM & Admin → Service Accounts):
give `925190436532-compute@developer.gserviceaccount.com` the role
**Service Account Token Creator** *on itself*.

⚠️ Test signing FIRST on any future signed-URL work. Discovering this after rewiring every media
read path would mean unpicking the most fragile code in the repo. The guards were verified
working before this was found: missing token → 400, wrong token → 404, staff path unauthenticated
→ 403.

**Teacher and staff views converted too (2026-10-03).** `components/SignedMedia.jsx` provides
`SignedVideo` / `SignedImage` / `SignedLink`, backed by `utils/useSignedMedia.js`. Used in Class
Details (Evolve film modal, ZooYard habitat photos, citizen science thumbnails) and the staff
submissions list.

⚠️ **Teachers are scoped to classes they own.** `getMediaUrl`'s educator path checks
`classes/{code}.teacherEmail` against the caller; staff bypass that. Without the scoping any
signed-in teacher could mint a URL for any media in any school. Pass `classCode` or a teacher is
refused.

⚠️ **Every one of these falls back to the stored permanent URL** while minting and if minting
fails. Media must never blank out because a function was cold — a teacher staring at an empty
photo grid would reasonably conclude the app had lost their students' work. **This is also why
none of it closes the hole until the tokens are revoked.**

⚠️ `SignedVideo` re-keys the element on the signed URL. Swapping a `<video>` src after it has
started loading is unreliable — React reuses the node and the browser can keep the old stream.
Same class of trap as the recorder/playback issue in the Video & media pipeline section.

**Student minting path added (2026-10-03).** Students are anonymous, so they cannot use the
educator path; `kind: 'student'` matches the caller's uid against `deviceUid` on their own student
record, and additionally requires the requested object to sit under `/{classCode}/{studentId}/`.
Needed for RESUME: mid-session the stitchers use local blob URLs and never touch Storage, but on
resume they rehydrate from stored URLs.

⚠️ **A bug was caught here in testing and is worth remembering.** The first version also allowed
*unclaimed* records, mirroring the back-compat arm in `firestore.rules` — and it returned a signed
URL to a caller **with no authentication at all**. The rule's null arm permits *writes* to a
legacy record, which is a pre-existing state; copying it here would have handed out *read* access
to a legacy student's film, and the paths are guessable (class code + a short alias list + known
animal ids). **Do not mirror a permissive rule into a different context without asking what it
grants there.**

⚠️ **Precondition for revocation:** a legacy record with no `deviceUid` cannot mint. Those are
finished excursions; if one ever needs to resume, the teacher's "New device" flow re-claims it.

#### ✅ `revokeDownloadTokens` HAS BEEN RUN (2026-10-03). The permanent links are gone.

Cameron ran it. **Verified against the live bucket:** `evolve/LIF0AH/…` (the Ingleburn excursion)
has **no `firebaseStorageDownloadTokens`** and its old-style download URL returns **401**. The
media itself is untouched — this removes the key, not the file.

⚠️ **Objects uploaded SINCE still carry a fresh token**, because Firebase mints one on
`getDownloadURL()`. Revocation closed the legacy leak; it did not stop new permanent URLs
existing. Closing that properly means storing storage *paths* and never calling
`getDownloadURL()` — a change at every upload site, still not done.

#### ⚠️⚠️ THE FALLBACK INVERTED ITS MEANING THE MOMENT THIS RAN — fixed the same day

Every signed-URL helper was written to **fall back to the stored URL** if minting failed, on the
reasoning that "media must never blank out because a function was cold". That was right **while
the stored URL worked**. After revocation the stored URL is a guaranteed **401**, so the fallback
stopped being a graceful degradation and became a promise of a broken black player with no
message — the worst possible outcome, and indistinguishable from lost work.

Changed everywhere:
- `useSignedMedia` now returns **`{ url, failed }`**. `failed` means minting definitively failed.
- `SignedVideo` / `SignedImage` / `SignedLink` render a plain "the link needs renewing, the video
  itself is safe" note instead of a dead element.
- `mintMediaUrl` returns **null** rather than the stored URL, and the three staff handlers that
  used to `window.open(await mintMediaUrl(...))` now check it — otherwise they open a dead tab.
- Non-Storage URLs are passed through untouched and never treated as failures.

🚫 **Do not restore the silent fallback.** It now renders as data loss.

**The souvenir viewer got the same treatment, and it matters most** — it is the page a student or
family opens from an NFC tag, possibly years later. `mintSouvenirUrl` now **retries once** (a cold
Cloud Function is the common transient failure, and it stops retrying on a 400/404 where the token
is simply wrong), and returns **null** rather than a revoked Storage URL.
⚠️ The Evolve souvenir's failure message said **"This film is no longer available"**, which is
untrue and about the most alarming thing a keepsake page can say. The film is in Storage; the link
expired. Both viewers now say the film is safe and the link needs renewing. 🚫 Never word a media
failure as though the student's work is gone.

⚠️ **THIS IS ALSO THE LIKELY CAUSE OF THE CARDS-ONLY FILM**, which had been left as "cause
unknown". The failing run was a RESUME: clip URLs were rehydrated from Firestore, `mintStudentMedia`
failed (the `ensureStudentAuth` race meant the student's uid no longer matched `deviceUid`, so
`getMediaUrl` refused them), and the code then fell back to the stored URLs — which revocation had
just killed. Every clip 401s, so no audio and no picture, and both failures were swallowed. Films
built in-session worked throughout because they use local `blob:` URLs and never touch Storage.
**Two separate bugs plus a deliberate change, combining into one symptom with no error message.**

Converted: souvenir viewers, Class Details (Evolve film, ZooSnooz documentary + clips, ZooYard
photos, citizen science thumbnails), staff watch/download handlers, and the **resume paths** in
Evolve and Wildest Dreams. ZooSnooz needed none — it only ever uses local blob URLs in-session.

🚫 **DO NOT RUN `revokeDownloadTokens` UNTIL A HUMAN HAS WATCHED A FILM PLAY FROM A RESUMED
SESSION ON A REAL DEVICE.** It is irreversible: deleting the token kills every existing link for
that object permanently, and a replacement token is a *different* token, so links already handed
out stay dead. Automated testing cannot validate this — a driven tab reports itself hidden and
manufactures the very failure being tested for.

⚠️ **Scope excludes `challengeEvidence/`** — those photos feed the public Conservation Gallery,
which anonymous visitors view with no way to mint a URL.

⚠️ **WHAT REVOCATION DOES NOT FIX, and this matters for how it is described:** new uploads still
receive a fresh token from Firebase automatically. Revoking closes the **legacy** leak — links
that have already escaped. It does **not** stop new permanent URLs existing. Closing that
properly means never calling `getDownloadURL()` and storing storage paths instead, which is a
change to every upload site and a separate piece of work.

**Previously listed as remaining:**


**What is already closed:** enumeration, at both layers. The bucket cannot be browsed (Storage
`list` denied + App Check), and the URLs cannot be read out of Firestore (App Check enforced). So
the only way to hold a link now is to have been *given* one.

**What remains:** a download URL is permanent. A link that has leaked keeps working forever, and
⚠️ **the souvenir token protects the page, not the file** — anyone holding the raw file URL skips
the token entirely.

**Why it was deferred.** The fix touches every media read path: all three stitchers (ZooSnooz,
Evolve, Wildest Dreams), `DocumentaryViewer`, the staff film tabs, the Class Details photo grids,
the Conservation Gallery and the ZooYard write-up screen. That is the most fragile code in this
repo — see the Video & media pipeline section, which records three separate silent failures
(audio with no picture, canvas tainting, CORS mistaken for a stitcher bug). Rewriting it in a
hurry is how a fourth happens.

**The design, when it is built:**
1. A Cloud Function mints a **short-lived signed URL** (`getSignedUrl`, ~1 hour) on demand.
2. Callers prove entitlement one of three ways: a valid **souvenir token** (which finally makes
   the token protect the *file*), a **staff ID token**, or an authenticated **teacher** for their
   own class.
3. Stored `filmURL` / `clipURL` fields become storage *paths*, not URLs.
4. ⚠️ **Revoke the existing `firebaseStorageDownloadTokens`** on every object — otherwise every
   old permanent link keeps working and the change buys nothing. This is all-or-nothing: the
   moment tokens are revoked, anything still using a stored URL breaks, so it ships together.
5. ⚠️ Re-check CORS: signed URLs are served from a different host, and `cors.json` must cover it.
6. ⚠️ Verify the stitchers **in a foreground browser**. Automated checks cannot validate this
   pipeline — a driven tab reports itself hidden and manufactures the very bug under test.

**Honest risk assessment at the time of deferring:** the realistic worst case is a student sharing
their own souvenir link and the recipient keeping it. That is a very different order of problem
from the 211 harvestable URLs this started as.

1. **Student media is still downloadable by anyone who knows a filename** — but 🟡 **folder
   browsing was closed 2026-10-02**, which was the serious half. `read` was split into `get`
   (kept) and `list` (denied) on all five student paths plus the catch-all; verified
   `storage/unauthorized` on all five from an unauthenticated client, while a real stored clip
   still returns 206. Neither app ever calls `listAll()`, so this cost nothing.
   ⚠️ Still only security-by-unguessable-URL. Real fix is short-lived signed URLs; that touches
   every media read path (stitchers, DocumentaryViewer, admin tabs) so it is its own piece of
   work, not a quick one.
   **Also hardened the same day:** uploads to student paths are now limited to `image/*` and
   `video/*` under 300MB (`isStudentMedia()` in `storage.rules`), and **delete is denied
   outright**. Before this, anyone could upload an HTML phishing page or an executable onto
   Taronga's bucket, or delete a student's film. Verified live: html/pdf/octet-stream rejected,
   `video/webm;codecs=vp9,opus` and `image/jpeg` accepted, delete blocked, folder listing blocked.
   ⚠️ A mitigation, not a cure — an attacker can still declare `video/mp4` and upload bytes. What
   it buys is that the file is then *served* as video, so it cannot work as a phishing page.
   ⚠️ Any new student upload MUST set `contentType` or it will fail **silently**.
#### Student device identity (2026-10-03) — STAGE 1 SHIPPED, RULE NOT YET TIGHTENED

Students now get an **anonymous Firebase Auth identity** on join, stamped onto their record as
`deviceUid`. `utils/studentAuth.js` is the entry point.

✅ **STAGE 2 SHIPPED 2026-10-03** — the rule is now tightened (below), after `deviceUid` was
confirmed appearing on real records in Firestore.

#### 🔴 STAGE 2 WAS ROLLED BACK THE SAME DAY — the auth-restore race. Read this before re-tightening.

**Symptom as reported:** "the stitching on my phone didn't work and I tried separately on my
laptop and I did the reload after the two. None of the videos will save, the draft won't save."

**Cause:** `ensureStudentAuth()` checked `auth.currentUser` *immediately*. That value is **null for
the first moments of every page load** — Firebase restores a persisted session asynchronously — so
it looked like nobody was signed in and called `signInAnonymously()`, minting a **brand new
anonymous user with a new uid on every single reload**.

`deviceUid` is stamped at JOIN and only at join, so the record kept the uid from the original
join while the device moved on to a throwaway one. The tightened rule then refused **every student
write**. Drafts stopped saving, clips stopped saving, and **silently**, because student writes are
backgrounded and nothing surfaces a rejection. It also created an orphaned anonymous account per
reload (Firebase's 30-day auto-cleanup is on, so those age out).

⚠️ **This is the second time in one day that a correct-looking tightening produced a silent
failure** (the other: a permissive rule mirrored into `getMediaUrl`). **A denied student write has
no user-visible symptom.** Anything that narrows a student write must be tested across a RELOAD on
a real device, not just on a fresh join — a fresh join passed every time, because `allow create`
was never touched.

**Fixed:** `ensureStudentAuth()` now awaits `auth.authStateReady()` (falling back to a one-shot
`onAuthStateChanged`) before deciding whether to sign in.

**Also added, and it is the precondition for re-tightening:** `claimStudentRecord()` in
`utils/studentAuth.js`, called on resume from `AppContext`. It stamps the current uid onto a record
that has **no uid yet**, which is what finally lets an unclaimed record become claimed — before
this, the uid was written at join and nowhere else, so a released or legacy record stayed unclaimed
for life.
🚫 **It never overwrites an existing claim.** Doing so would let any device that knew a class code
and an alias steal a record off the device holding it, which is the whole thing the uid prevents.
Releasing a claim stays a teacher action (Class Details → "New device").

✅ **RE-TIGHTENED AND DEPLOYED 2026-10-03**, after Cameron verified a save across a reload on a
laptop. The rule is back to `unclaimedStudentRecord() || ownsStudentRecord() || isEducator()`.
The relaxation to `allow update: if true` lasted about an hour — service was restored first on
purpose, since a student losing their film is worse than a window of exposure no wider than it had
been that morning.

⚠️ **If a student who joined during that window cannot save**, their record holds a uid that
device no longer uses. Repair is Class Details → **"New device"**, after which the resume-time
claim re-stamps it. Only test records should be affected: the feature shipped and broke the same
day, so no class had run on it.

⚠️ **NOT YET VERIFIED END-TO-END BY A REAL STUDENT RUN.** Browser automation could not complete a
join (keystrokes stopped reaching the page), so a human needs to join a class and confirm progress
saves. What *is* established by inspection: **joining cannot break**, because `allow create: if
true` is unchanged and a join writes a new document. The risk is confined to *updates* by a
student whose `deviceUid` no longer matches.

**Rollback if it misbehaves:** set `allow update: if true;` on `students` and redeploy rules. One
line, no client change needed.

The rule:

```
allow update: if resource.data.deviceUid == null
              || request.auth.uid == resource.data.deviceUid;
```

The `== null` arm is required for back-compat: every record created before today has no
`deviceUid`, and those classes must keep working. Protection applies to new classes; old ones age
out.

**Why anonymous auth and NOT a Cloud Function proxy** (considered and rejected):
- ⚠️ The Firestore SDK **queues writes while offline** and sends them when signal returns. Most of
  Taronga has no reception. An HTTP call to a function does **not** queue — it fails. The "safer"
  option would have cost students their work on a real excursion.
- It was ~45 call sites across every mode, against ~4 files here.

⚠️ **Never sign in anonymously over an existing session.** A teacher demonstrating the student
flow on their own device is signed in as themselves; replacing that would silently sign them out
of the teacher portal. `ensureStudentAuth()` returns the existing user if there is one.

⚠️ **Anonymous sign-in failing must never block a student.** It is caught and ignored — a locked
down school network or a browser blocking storage would otherwise strand a whole class at the
gate. They write without a uid, exactly as before.

**The escape hatch is not optional.** A student's record is claimed by the device that joined on
it, so a swapped tablet, a shared iPad, or a class resumed after Firebase's 30-day anonymous
auto-cleanup leaves them unable to save. **Class Details → "New device"** clears the claim.
🚫 Do not tighten the rule without that button in place.

2. **`students` create/update is still open** — 104 student records readable and *alterable* by
   anyone with no login. 🟡 **Deletion was closed 2026-10-02**: `classes` create/update/delete
   and `students` delete now require Firebase Auth, so the one irreversible action is gone.
   Verified live, unauthenticated: delete class / delete student / create class / change a class
   setting all BLOCKED, while student join and progress saves still work.
   ⚠️ `students` create/update **must** stay open until student writes are routed through a
   Cloud Function — students have no auth at all and every mode saves progress as they go. That
   is the remaining big piece and it is weeks of work, not a rules tweak.
   The staff Control Room's wipe-all-data relied on the open deletes and now goes through the
   `adminWipeAllData` function (access code re-verified server-side, explicit confirm string,
   batched, logged).
   ⚠️ **The Control Room's own password is HARDCODED IN THE CLIENT BUNDLE in plain text.** It is
   a UI speed bump, not a security control. Never let it be the only gate on a destructive
   action — which is why the function re-checks the real access code regardless.
3. 🟡 **Retention: half built 2026-10-03.** `cleanupRawClips` removes the RAW PER-CHAPTER CLIPS
   once they have been stitched into a film. **Stitched films are kept indefinitely** — they are
   the keepsake, and the Year 7 → Year 12 comparison depends on them surviving six years.
   Control Room → Old footage cleanup. **Preview first; the delete button only appears after one.**

   ⚠️⚠️ **THIS IS AN AUTOMATED DELETER POINTED AT CHILDREN'S MEDIA.** Four safety rules, all
   load-bearing, all in the function:
   1. **Dry run is the default.** Deleting needs an explicit `dryRun: false`.
   2. **Nothing is deleted from a folder with no film in it** — if the stitch failed, the clips
      are all the student has.
   3. **The film is never a candidate** (`KEEP_PATTERNS` = `film.*`, `documentary.*`).
   4. **Age threshold**, floored at 30 days, so a class mid-excursion is never affected.
   🚫 Do not add a "force" or "delete everything" mode. There is no legitimate use for one.

   **Still missing:** nothing runs this on a schedule — it is manual, which is the safer place to
   start.

   ✅ **Run and verified by Cameron on real data (2026-10-03).** Only then were the parent letters
   updated — both now state that raw clips are deleted after 12 months and the finished film is
   kept. ⚠️ That order matters and must be repeated for any future retention claim: the ZooSnooz
   letter once promised 48-hour deletion that was never built, and it had already gone home to
   families. **Built is not the same as proven, and a letter may only state what is proven.**

4. ~~**No consent record.**~~ **CLOSED BY DECISION, not by code (2026-10-03).** Filming consent
   stays with the school, not with Tracka. Both parent letters already run an opt-out model and
   already state what an opted-out student does instead. Cameron's position: a student who may not
   be filmed becomes **the crew** — they operate the camera rather than appear on it — and
   arranging that is the teacher's job on the day.
   🚫 **Do not build a consent flag into the app.** It would duplicate a process the school already
   owns, and "what does an opted-out student do" is a teaching decision, not a database field.
   Wildest Dreams is entirely video and has no non-filming version, which is precisely why this
   belongs with the teacher.
4. **No consent record.** Filming opt-out is a verbal arrangement with the teacher; nothing in the
   data marks a student as not-to-be-filmed, so moderation has nothing to filter on.
5. Open writes on `accessCodes` (90 teacher invite codes), `settings`, `schools`, `prePostLinks`.
6. ~~**No real staff logins.**~~ ✅ **DONE 2026-10-03** — see "Staff portal sign-in" below.
   (was:) The portal is still one shared access code — now server-verified and
   rate-limited, but shared, so there is no accountability for who approved or deleted what, and
   no per-person revocation. 🟡 The groundwork landed 2026-10-03 (see the role-escalation fix
   below): `isWildlyStaff()` is now a trustworthy email allowlist. The remaining work is signing
   staff into the Tracka portal with Firebase Auth checked against that allowlist, then retiring
   the shared code and tightening the `if true` collections to `isWildlyStaff()`.

#### ⚠️ What App Check on Storage does and does NOT cover (verified 2026-10-03)

Enforcement was switched on for Cloud Storage. Measured against the live project:

| Unauthenticated, no App Check token | |
|---|---|
| Browse folders (`listAll`) | 🚫 blocked |
| Upload (`uploadBytes`) | 🚫 blocked — `storage/unauthenticated` |
| Read metadata / get a download URL via the SDK | 🚫 blocked |
| **Plain `fetch()` of an existing `?alt=media&token=…` download URL** | ✅ **still returns 200** |

⚠️ **App Check protects the Firebase Storage SDK, not the tokenised download URLs.** Those are
designed to be shareable — they are what goes in an `<img src>` and in every souvenir link — so
they keep working, which is exactly why nothing broke.

**The security consequence, and it matters:** harvesting is closed (you cannot browse the bucket,
and you cannot read the URLs out of Firestore any more because Firestore is enforced), but **a URL
that has already leaked still works forever.** Only short-lived signed URLs fix that, which is why
item 2 of the security list stays open even with App Check fully enforced.

⚠️ Enforcement took about **one minute to propagate**. A single test immediately after flipping the
switch will wrongly report that it did not work.

#### Staff portal sign-in (2026-10-03) — a real account, not a shared code
✅ **Verified in the field by Cameron**: real password set, sign-in works, portal functions.

The Taronga staff portal now signs in with **Firebase Auth email + password**, checked against an
email allowlist. The shared access code is gone from the portal entirely.

**Why.** The portal can approve submissions, read every class and school, and **wipe all data**.
With a shared code, "who did that?" had no answer, one person could not be revoked, and codes
spread quietly by email.

- `src/constants/tarongaStaff.js` — `TARONGA_STAFF_EMAILS`, used for the **UI only**.
- `isWildlyStaff()` in `firestore.rules` — the **real** control, enforced server-side.
- `TARONGA_STAFF_EMAILS` in `functions/index.js` — for the admin endpoints.

⚠️ **All three lists must agree.** Appointing a staff member means editing all three and
deploying rules + functions + client. `firestore.rules` is the one that actually protects data;
adding an email to the client alone grants nothing and just produces a dashboard where every
panel fails.

**The admin Cloud Functions verify an ID token**, not a code. `getAdminTeacherRoster` and
`adminWipeAllData` call `verifyStaff(req)`, which checks a `Bearer` token and the allowlist.
Verified live: both return 403 with no token, with a junk token, **and with the old access code**.
`adminWipeAllData` now logs the staff email that ran it, which is the entire point of the change.

🚫 **Never add "or a valid access code" back as a fallback** to those endpoints.

⚠️ The dashboard gate waits for `authLoading` before bouncing to the login screen — without that,
a page refresh throws a signed-in staff member out while Firebase is still restoring the session.
Sign Out now calls `auth.signOut()`; clearing local state alone would leave the account signed in
on a shared Taronga machine.

**No self-service password reset on the staff login, on purpose.** Self-service suits teachers
(many of them, and the account only reaches their own classes) and not staff (very few, and the
account reads every school and can wipe all data). A locked-out staff member contacts the
administrator, who issues a link from **Control Room → Staff accounts**.
🚫 Do not add a "Forgot password?" link back to `AdminLoginScreen`.

**`generateStaffPasswordReset`** does this, and makes **two** checks: the CALLER must be signed in
as staff, *and* the TARGET must itself be on the staff allowlist. ⚠️ Without the second check this
would be an account-takeover tool for every teacher account in the project. Verified live: 403
with no token, a junk token, the old access code, and for a non-staff target.

It **returns the link rather than emailing it**. Mail to DoE and zoo.nsw.gov.au addresses has been
silently dropped by their gateways before (see the mentor-report notes), and a reset that fails
silently is worse than one the administrator passes on through a channel they know works.

⚠️ **A rotatable code as a second gate on destructive actions is still open as an idea** — the
better version of "email + code", putting the second factor where the danger is rather than on the
front door. Firebase also supports proper TOTP MFA, which is what Taronga IT would recognise.

`verifyAdminCode` and the `adminAccess` collection still exist but are **no longer used by the
portal**. Safe to remove once the new sign-in has been exercised in the field.

#### ✅ The Control Room gate is a RE-AUTHENTICATION now (2026-10-03)

It was `if (input === 'Bowie')` — a literal string in the client bundle, readable by anyone who
opened the JavaScript, the same for every staff member, and impossible to revoke. It sat in front
of wipe-all-data.

Now the signed-in staff member re-enters **their own password** and Firebase verifies it
(`reauthenticateWithCredential`). That proves the person at the keyboard is the account holder
rather than someone who sat down at an unlocked laptop, it is per-person, it dies with the
account, and there is nothing in the bundle to read. **It re-locks after 15 minutes** — an unlock
that lasts as long as the tab defeats the point.

It also conveniently satisfies Firebase's "recent login" requirement, which is what lets the
two-step panel enrol a factor without prompting again.

🚫 **Never put a shared secret in front of a destructive action.**

#### ✅ Two-step sign-in for staff (TOTP) — SHIPPED 2026-10-03, NEEDS ONE CONSOLE SWITCH

**Control Room → Two-step sign-in** enrols an authenticator app against the staff member's own
account; `AdminLoginScreen` handles the `auth/multi-factor-auth-required` challenge on sign-in.

⚠️ **The CHALLENGE was shipped before anyone can enrol, deliberately.** Enrolling first, on a
build that could not answer the challenge, would lock that person out of the portal entirely.

**BOTH SMS and an authenticator app are offered. SMS is the default, and that was a deliberate
reversal (2026-10-03).**

The first version was TOTP only, on the reasoning that SIM-swap defeats SMS, SMS costs per
message, and it means holding a mobile number for every staff member in a project whose main
privacy claim is that it stores almost nothing personal. **All of that is still true.** It was
overruled by a better argument from Cameron: *"if it's confusing me it's gonna confuse my other
staff members."*

⚠️ **A control nobody turns on protects nothing.** The staff here are zoo educators, not security
engineers, and the realistic threat is a reused or phished password — which SMS stops just as well
as TOTP. SIM-swap is a targeted attack on a named individual; it is not what this portal faces.
🚫 Do not re-argue this back to TOTP-only on the strength of the theoretical ranking. The
authenticator app is still offered, one click away, for anyone who wants it.

**He asked for EMAIL codes first, and that is the one option that must never be built:**
Firebase supports only SMS and TOTP as second factors, so it would have to be hand-rolled — but
the decisive reason is that **mail to `@det.nsw.edu.au` and `@zoo.nsw.gov.au` is silently dropped
by their gateways**, confirmed on 2026-10-03 when a staff invite logged `emailed=true` and never
arrived. An email second factor would lock staff out of the portal with no error anywhere.
🚫 **Never put an authentication step on a mail path this project has already watched fail.**

**Implementation notes that cost time if rediscovered:**
- ⚠️⚠️ **`auth/invalid-app-credential` HAS TWO CAUSES AND BOTH BIT ON THE FIRST ATTEMPT.** The
  message sounds like a broken project and sends you into the console; it is not what it sounds
  like.
  1. **The phone provider was not enabled.** `signIn.phoneNumber` was `{}`. Enabling SMS as a
     second factor via `mfa.enabledProviders` is **not enough** — the phone sign-in provider has
     to be on as well, and it is in a different part of the config:
     `?updateMask=signIn.phoneNumber` with `{"signIn":{"phoneNumber":{"enabled":true}}}`.
  2. **A reCAPTCHA token is SINGLE USE.** Holding one `RecaptchaVerifier` in a ref and reusing it
     hands Firebase a spent token on the second attempt. 🚫 Never reuse a verifier — `clear()` the
     old widget and construct a fresh one for every send, on **both** screens.
- ⚠️⚠️ **A BARE "(error)" WITH NO CODE MEANS THE reCAPTCHA CONTAINER IS DIRTY.** `clear()`
  detaches the widget but **leaves its markup in the host element**, and constructing a second
  verifier on it throws a plain `Error` — "reCAPTCHA has already been rendered in this element" —
  with **no `.code`**. Every message in this flow was written as `err.code || 'error'`, so the
  only clue was the word "error". Empty the host (`host.innerHTML = ''`) before constructing, and
  🚫 **never format an auth error as `code || 'error'`** — fall through to `err.message`, or the
  person standing there has nothing to tell you.
- **App Check enforcement by service, checked 2026-10-03** (it is NOT the cause of phone failures,
  which was worth ruling out):
  `firebasestorage` ENFORCED · `firestore` ENFORCED · **`identitytoolkit` UNENFORCED**.
  Read it with:
  `curl -s -H "Authorization: Bearer $(gcloud auth print-access-token)" -H "x-goog-user-project: tarongatracka" https://firebaseappcheck.googleapis.com/v1/projects/tarongatracka/services`
  ⚠️ Enforcing App Check on `identitytoolkit` is a genuine hardening step still open — it would
  stop the sign-in API being hammered from outside the app. 🚫 Do not switch it on casually:
  **Wildly shares this project and this user pool**, and any client that does not send App Check
  tokens loses sign-in the moment it is enforced.
- ⚠️ **SMS is allow-listed to `AU` only** (`smsRegionConfig.allowlistOnly.allowedRegions: ["AU"]`).
  Enabling phone verification opens the door to **SMS pumping fraud** — an attacker triggers
  thousands of texts to premium numbers abroad and the project owner pays. 🚫 Do not widen this
  without a reason; every staff member is in Australia.
- ⚠️ Both screens need a host element for it (`#mfa-recaptcha`, `#login-recaptcha`). Invisible, so
  it only ever shows a challenge if the request looks automated.
- ⚠️ **Phone numbers are converted to E.164 for the user** (`0412…` → `+61412…`). Without it a
  staff member meets `auth/invalid-phone-number` with no idea why.
- ⚠️ **The sign-in challenge must branch on `hints[0].factorId`.** A phone factor needs the code
  SENT before the box is any use; a TOTP factor must not send anything. Assuming one shape breaks
  the other, and a text costs money so it is requested once, not per render.

✅ **BOTH FACTORS ARE ENABLED ON THE LIVE PROJECT (2026-10-03).** Verified:
`mfa: { state: ENABLED, enabledProviders: ["PHONE_SMS"], providerConfigs: [{ totpProviderConfig:
{ adjacentIntervals: 5 }, state: ENABLED }] }`.
⚠️ SMS and TOTP are configured in **two different fields** — `enabledProviders` for phone,
`providerConfigs` for TOTP. Setting one and expecting the other to appear is an easy half-hour.

⚠️⚠️ **DO NOT GO LOOKING FOR THIS IN THE FIREBASE CONSOLE. IT IS NOT THERE.** Authentication →
Sign-in method → Advanced offers **"SMS Multi-factor Authentication" ONLY**, and nothing on that
page mentions authenticator apps. TOTP exists on the same project but is reachable only through
the **Identity Platform admin API**. Cameron hit this and reasonably concluded SMS was the only
option.

Read the current state:
```bash
TOKEN=$(gcloud auth print-access-token)
curl -s -H "Authorization: Bearer $TOKEN" -H "x-goog-user-project: tarongatracka" \
  https://identitytoolkit.googleapis.com/admin/v2/projects/tarongatracka/config
```
Enable TOTP (this is the exact call that was run):
```bash
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -H "x-goog-user-project: tarongatracka" \
  -H "Content-Type: application/json" \
  "https://identitytoolkit.googleapis.com/admin/v2/projects/tarongatracka/config?updateMask=mfa" \
  -d '{"mfa":{"state":"ENABLED","providerConfigs":[{"state":"ENABLED","totpProviderConfig":{"adjacentIntervals":5}}]}}'
```
⚠️ **`x-goog-user-project` is required** or the call fails with a confusing `SERVICE_DISABLED` /
quota-project error that looks like the API is switched off. It is not; the header is missing.
⚠️ **`updateMask=mfa` is what keeps this safe** — without it the PATCH would replace the whole
auth config, including every sign-in provider.

**`state: ENABLED` only PERMITS enrolment. It does not force anyone to use it**, and no existing
sign-in changed. 🚫 Never set `MANDATORY` — teachers share this user pool, and it would lock out
every teacher account that has not enrolled.

**To undo:** the same PATCH with `{"mfa":{"state":"DISABLED"}}`.

⚠️⚠️ **RECOVERY, AND THIS MATTERS MOST FOR THE ROOT ADMIN.** There are **no backup codes**. A lost
authenticator cannot be fixed by the account holder, by another staff member, or through this app.
The only way back is the **Firebase Console → Authentication → Users → remove the second factor**,
as the project owner **thebiologybloke@gmail.com**. 🚫 Do not enrol the root admin until that
console access has been confirmed to work — it is the single point of recovery.

#### ⚠️ THE SETUP SCREEN NEEDS A QR CODE, AND SHIPPING WITHOUT ONE NEARLY COST THE FEATURE

The first version offered only a 32-character **setup key to copy by hand** — the reasoning being
that a QR needs a library and the `otpauth://` link covers phones. That reasoning ignored the
actual situation: the portal is open on a **laptop** and the authenticator is on a **phone**, so
the link is useless and the only path is retyping a long secret across devices. Cameron's response
was *"it's very confusing. I don't like it"* and a reasonable proposal to **switch to SMS instead**.

🚫 **Do not accept a weaker security control because the setup screen is unpleasant. Fix the
screen.** `qrcode` (1.5.x) is now a dependency, **dynamically imported** so the ~50KB encoder never
reaches a student's phone — same reasoning as model-viewer in ZooYard. The key is still there under
a "Can't scan it?" disclosure for anyone who needs it.

⚠️ **The QR is generated LOCALLY, in the browser.** 🚫 Never render an MFA secret through an
external QR service (api.qrserver.com, Google Charts and friends): that hands the second factor to
a third party and defeats the whole exercise. If the encoder ever fails to load, the panel falls
back to the manual key rather than showing a broken image.

**Why not SMS, when asked** — worth being able to answer this again: SIM-swap defeats it, it costs
per message forever, and it means holding a mobile number for every staff member, in a project
whose main privacy claim is that it stores almost nothing personal (students do not even give real
names). An authenticator app has none of those problems.

#### ⚠️ Privilege escalation via self-assigned staff role — FIXED 2026-10-03

`teachers/{email}.role` is what `isWildlyStaff()` reads to decide who is Taronga staff, and
**users write their own teacher document** (`allow write: if request.auth.token.email == email`).
Wildly's "About you" page offered **"Education Staff", "Curriculum Leader" and "School Leader" in
a self-select dropdown**, and saved it straight to that field.

So **any teacher who signed up could promote themselves to Taronga staff** and then `list` every
teacher's email, school and role; write `dashboardConfig`, `contentItems`, `professionalLearning`,
`tarongaTvVideos`, `upcomingEvents`; and **delete other teachers' accounts**.

The fix is in `firestore.rules`: a user may still write their own profile but may not *grant*
itself a staff role, and may not change one once set. Existing staff can set anyone's role.
⚠️ **Narrowing the dropdown is defence in depth, not the fix** — the rule is the control.

**Then the role check was removed entirely**, and replaced with a **root admin + a protected
collection**:

```
function isWildlyStaff() {
  return request.auth != null
    && (isRootAdmin() || exists(/databases/$(database)/documents/staffAdmins/$(request.auth.token.email)));
}
function isRootAdmin() {            // hard-coded, NOT removable through the app
  return request.auth != null && request.auth.token.email in ['thebiologybloke@gmail.com'];
}
```

**The difference that matters:** the old bug put staff status on `teachers/{email}.role` — a
field on a document **the subject could write**. `staffAdmins` can only be written by someone who
is *already* staff. The subject has no write access at all, so self-promotion is impossible by
construction.

⚠️ **The root admin cannot be removed through the app.** `manageStaffAdmins` refuses to delete it
and the UI shows no button. It is the guarantee that a mistake, or a compromised staff account
removing the others, can never lock Taronga out of its own project. Changing it means editing
`firestore.rules`, `functions/index.js` and `src/constants/tarongaStaff.js`, then deploying.

**Appointing a staff member** is now Control Room → Staff administrators → enter an email.
`manageStaffAdmins` creates the sign-in account if needed (with a long random password nobody
ever learns, so no weak interim credential sits on it), writes the `staffAdmins` doc, generates a
set-password link, and emails a branded invite via Resend.

**The invite email reuses the Friday mentor-report look** via `brandedEmailShell()` in
`functions/index.js`: deep green banner, white title, muted green subtitle, both product logos
right-aligned, and the "For the Wild" lockup in the footer banner. Rendered and eyeballed in a
browser before shipping.
⚠️ The techniques in there are not decoration — tables not flexbox (Outlook renders with Word),
inline styles (Gmail strips `<style>`), `bgcolor` attributes alongside `background-color` plus the
`color-scheme` meta so Outlook's dark mode does not invert the banners, and absolute image URLs
(a relative path is a broken image in every client).
⚠️ `buildMentorReportHtml` deliberately keeps its own copy of the shell. It is the one email
Cameron relies on weekly, and refactoring a working thing to remove duplication is not worth the
risk. **If the brand changes, change both.**
⚠️ **The link is always shown in the UI too, even on a successful send.** Mail to DoE and
zoo.nsw.gov.au addresses has been silently dropped by their gateways before, and an invite that
failed looks exactly like one that worked.

Verified live, unauthenticated: `list`, `invite`, and `remove` all 403; and a direct Firestore
write to `staffAdmins` is BLOCKED, as is listing it.

🚫 **`setTeacherRole` was built and then deleted the same day** (source removed, function deleted
from the project, endpoint now 404s). An always-on endpoint whose only job is handing out
privilege, gated by a shared secret, is the pattern being retired. **Do not reintroduce an
"appoint staff" endpoint or screen.**

⚠️ **`teachers/{email}.role` still exists as a profile field** and still drives some client-side
UI in Wildly. It now confers **no access whatsoever**. Never make it authoritative again. The
self-grant guard on it is kept as defence in depth.

#### Privacy — what is genuinely good, and worth defending
- **Students never enter real names**; they pick an animal alias. This is the single biggest
  protection in the system and it is deliberate. Do not let a future feature ask for real names.
- Evolve's Advice Wall stores cohort year only.
- Teacher enumeration was closed (2026-07-27) and still holds — `list` on `teachers` is denied.
- ⚠️ But **aliases do not survive video**. A clip of a child's face is identifiable regardless of
  what the document calls them, and class code → class doc → school name is public, so an alias is
  re-identifiable to anyone at that school.

### Test data sitting in Firebase (safe to delete)
- Class **`EVOLVE`** — students `Bilby`, `Quoll`, with webcam test clips under `evolve/EVOLVE/`.
- Class **`GAGA`** (`547DGJ`) — Cameron's own Evolve test class, stage 4.
- Class **`K8AH7Z`** ("ZYT") — ZooYard test class; several students hold keyboard-mash responses,
  which is why its writing scores read 1.0–1.5/5.
- `zz-*.mjs` in the repo root are untracked throwaway Firestore/Storage inspection scripts.
  They embed the public web API key, which is fine. Handy templates for reading live data.
  ⚠️ **They no longer work unauthenticated** — App Check is enforced on Firestore, so a plain Node
  script gets `permission-denied`. Use `gcloud storage` as the project owner
  (**thebiologybloke@gmail.com**) to inspect Storage instead; that is how the codec, token and
  frame checks of 2026-10-03 were done.
- ~~Two 1-byte probe files at `zoosnooz/_t/`.~~ **Deleted 2026-10-03.**

### Working practices that proved out
- **Build-check per change** (`npm run build`), and compare the lint count against
  `git stash` → lint → `git stash pop` rather than assuming a new error is yours — several files
  carry pre-existing lint errors.
- **Verify against live Firestore with a throwaway script** rather than trusting the UI, especially
  for anything write-shaped.
- **Never verify video in an automated browser session** — see Video & media pipeline §6.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite |
| State | React Context (no Redux/Zustand) |
| Backend | Firebase — Firestore, Auth (email + password), Storage, Functions v2 |
| Email | Resend API (via Cloud Functions) |
| 3D | `@google/model-viewer` — ZooYard only, dynamically imported. See the ZooYard reference. |
| Hosting | Firebase Hosting (`dist/` folder) |
| Runtime (Functions) | Node.js 22 |

No TypeScript. No router library — navigation is a custom `currentScreen` state string with Browser History API sync.

---

## Project Structure

```
taronga-tracka-vite/
├── src/
│   ├── firebase.js           # Firebase init — exports db, storage, auth, functions
│   ├── global.css            # Design tokens (CSS vars), LMS layout classes, animations
│   ├── App.jsx               # Root: AppProvider wrapping ScreenRouter
│   ├── context/
│   │   ├── AppContext.jsx    # All teacher/admin state + history routing
│   │   └── StudentContext.jsx
│   ├── modes/
│   │   └── wildest-dreams/   # Entire Wildest Dreams mode — see its Deep Reference
│   ├── screens/
│   │   ├── index.jsx         # Barrel export + screen router (switch on currentScreen)
│   │   ├── HomeScreen.jsx
│   │   ├── ZooSnoozScreen.jsx    # Entire ZooSnooz experience (~2500 lines)
│   │   ├── DocumentaryViewer.jsx # NFC souvenir card viewer
│   │   └── missions/             # Per-animal mission JSX files (daytime)
│   ├── components/
│   │   ├── DeviceBookingCalendar.jsx   # Shared calendar, mode='teacher'|'staff'
│   │   └── [other components...]
│   ├── data/
│   │   ├── zoosnoozAnimals.js    # All ZooSnooz animal configs (5 animals, stage-differentiated)
│   │   ├── animals.js            # Daytime animal configs
│   │   ├── animalsEnglish.js     # English subject animal configs
│   │   ├── animalsMaths.js       # Maths subject animal configs
│   │   ├── animalsPdhpe.js       # PDHPE subject animal configs
│   │   ├── tigerMCQ.js           # Tiger MCQ data
│   │   ├── subjectMeta.js        # SUBJ_META, STAGES, prePostDocId(), toCanvaEmbedUrl() — shared by admin Pre/Post tab + Resource Hub
│   │   └── nswPublicSchools.json # School name autocomplete list
│   └── utils/
│       ├── teacherInfoSheet.js         # EXHIBITS, SCORING, STAGE_EXPECTATIONS, NSW_OUTCOMES
│       ├── scoring.js                  # buildObservationScore + subject variants
│       ├── helpers.js                  # normaliseCode, safeStudentId, getMinWords, isLowQualityResponse
│       └── assessmentTaskNotification.js  # Generates unique printable AT Notification docs per task
├── functions/
│   └── index.js              # Cloud Functions: sendMagicLink, onDeviceBookingCreated, sendMentorReport
├── scripts/
│   ├── generate-wd-voice.sh  # rebuilds public/voice/*.m4a — lists every key and its line
│   └── generate-pptx.py      # Builds 32 downloadable PPTX lesson decks — legacy, not wired into the app anymore (see Pre/Post-Visit Lessons section)
├── public/                   # Static assets served as-is
│   ├── images/               # logo.png, taronga-zoo-white.png, animal photos, map, sound-*.mp3
│   ├── models/               # taronga-zoo.glb — the 3D zoo (6MB). See the ZooYard reference.
│   ├── draco/                # Self-hosted Draco decoder. Do not delete: model-viewer would
│   │                         # otherwise fetch it from a Google CDN, which schools block.
│   ├── voice/                # 22 Wildest Dreams recorded voice clips (see Audio & speech)
│   ├── zoosnooz-notification.html   # printable parent letter + opt-out slip
│   ├── evolve-notification.html     # ditto, for Evolve
│   ├── resources/pptx/       # 32 generated PPTX lesson decks (pre/post × subject × stage)
│   └── *.pdf                 # Venue safety, accessibility PDFs
├── firestore.rules
├── firebase.json             # Hosting, Functions, Firestore config
└── vite.config.js
```

---

## Navigation Architecture

There is **no React Router**. Navigation is a `currentScreen` string in `AppContext`.

- `setCurrentScreen('screenName')` navigates anywhere in the app.
- Browser History API is synced: each screen change calls `pushState` (or `replaceState` for transient screens).
- `DEEP_LINK_SCREENS` — screens that can be cold-loaded from a URL (e.g. `/teacherDashboard`).
- `TRANSIENT_SCREENS` — screens that auto-advance (`studentLoading`); use `replaceState` so back button skips them.
- Screen names map to URL paths via `screenToPath` / `pathToScreen` helpers in AppContext.
- All routes rewrite to `index.html` (Firebase Hosting SPA config).

**Screen name → component** mapping lives in `src/screens/index.jsx`.

### Staff portal tab structure (`AdminDashboardScreen.jsx`, restructured 2026-08-23)

| Tab | Contains |
|---|---|
| **Overview** | `OverviewTab` — all classes, filtered |
| **Analytics** | `AnalyticsTab` |
| **Programmes** | `🌙 ZooSnooz` · `✦ Evolve` · `🌳 ZooYard` |
| **Review** | `ReviewTab` — flagged observations, feedback |
| **Manage** | `Pre/Post Lessons` · `Challenges` · `Bookings` · `Users` |
| **🔒 Control Room** | `ControlRoomTab` — password-gated |

`✦ Evolve` nests one level further into `🎬 Films` / `🖨 Pledges`, the only place that nests
twice. If that ever feels buried, flatten it by promoting both to sit alongside ZooSnooz and
ZooYard.

It was **eleven** top-level tabs, scrolling sideways on a laptop, with configure-once screens at
the same level as daily ones. `ProgrammesTab` and `ManageTab` are **thin wrappers only** — they
hold a sub-tab value and render the existing components with the same props. No view's internals
changed, and the individual tab components are still the place to work.

**Left top-level on purpose:** Overview is the landing page; Analytics is a different job from
browsing classes; **Review is time-sensitive — burying flagged content is how it stops getting
checked**; Control Room is password-gated and dangerous, so being separate and slightly awkward is
a feature. Think hard before demoting any of those.

`SubTabs` is the shared segmented pill. It is deliberately **unlike** the underlined top-level bar
so the two levels never read as the same control. The Advice Wall belongs under `✦ Evolve` when
it is built, not as a new top-level tab.

---

## Design System

All tokens are CSS variables defined in `src/global.css`.

### Key colour variables
```css
--t-deep:        #0A2F1F   /* nav backgrounds */
--t-mid:         #1A5238   /* primary interactive */
--t-eucalyptus:  #2E7D55   /* lighter actions */
--t-foam:        #E8F2EC   /* hover states */
--t-stone:       #EDE9E2   /* borders */
--t-slate:       #6B6B62   /* meta text */
```

### Typography
- `font-family: var(--t-font)` — Inter (body)
- `font-family: 'Taronga Headline'` loaded from `/images/TarongaHeadline-Regular.ttf`
- Use the CSS class `taronga-title` for display headings in the Taronga brand font.

### LMS Layout Classes (for teacher portal screens)
Used on most teacher-facing pages to give a consistent LMS look:

| Class | Role |
|---|---|
| `lms-page` | Full-height flex container |
| `lms-topbar` | Fixed top bar with logo + brand |
| `lms-topbar-brand` | Inner flex row of topbar |
| `lms-two-col` | Sidebar + main two-column layout |
| `lms-sidebar` | Left nav column |
| `lms-main` | Scrollable main content area |
| `lms-main-inner` | Max-width wrapper inside main |
| `lms-nav` | Vertical nav list |
| `lms-nav-item` | Individual nav button |
| `lms-nav-active` | Active nav item state |
| `lms-nav-group-label` | Section label above nav groups |
| `lms-stat-card` | Metric card (used on dashboard) |

---

## Authentication Model

There are **three separate auth systems** — they do not share a Firebase Auth session.

| User type | Auth mechanism |
|---|---|
| **Teachers** | Firebase Auth — email + password (`TeacherLoginScreen.jsx`, client-side `signInWithEmailAndPassword`/`createUserWithEmailAndPassword`/`sendPasswordResetEmail`). Password-based on purpose — an earlier magic-link approach (`sendMagicLink` Cloud Function) was abandoned because NSW DoE email filtering breaks link-based sign-in; that function is still deployed but is dead code, not called from anywhere in `src/`. |
| **Students** | No auth — class code + chosen alias stored in `localStorage` |
| **Staff (Taronga admin)** | Code-based — access code checked against `adminAccess` Firestore collection; no Firebase Auth |

### Taronga Education ecosystem — shared login (live, deployed)
Tracka is the foundation of a wider "Taronga Education" ecosystem — one login (email + password, chosen over magic-link because NSW DoE email filtering breaks link-based sign-in) that grants access to Tracka, **Wildly by Taronga** (`/Users/cameronrodgers/wildly`, separate repo, separate GitHub Pages hosting at `wildlybytaronga.com.au`, has its own `CLAUDE.md` — read it before editing that repo), and future products. `TeacherLoginScreen.jsx` is branded accordingly (both product logos, "Multiple applications, one log-in") and every successful sign-in/registration merges `products: arrayUnion('tracka')` into the `teachers/{email}` doc — the collection is deliberately still called `teachers` (not `educators`), to avoid migrating live teacher data for a cosmetic rename.

**Current live state**: Wildly's `src/firebase.js` / `.firebaserc` point at this same `tarongatracka` Firebase project (no more `wildly-762f5`) — same Auth user pool, same Firestore. One email+password account works in both apps (though not true cross-domain SSO — each app still needs its own sign-in, just with the same credentials, since Tracka and Wildly live on different top-level domains). Wildly's identity model was reworked from `users/{uid}` to the shared `teachers/{email}`:
- `useSessionUser()` reads `teachers/{email}` instead of `users/{uid}`.
- Wildly's signup form was simplified to collect exactly what Tracka's does — email, password, confirm password, school — writing `email`/`schoolName`/`createdAt`/`products: arrayUnion('wildly')` to `teachers/{email}`. No name/country/role collection during signup.
- **No forced profile-completion gate.** Any authenticated user — whether their account originated on Tracka or Wildly — goes straight to Wildly's dashboard on login or session-restore. Wildly's `AboutYouPage` (optional name/country/role editor) still exists and is reachable via the profile pill in Wildly's header, but nothing routes there automatically anymore.
- `useUsers()` (Wildly's staff console user list) sorts client-side instead of via Firestore `orderBy("name")`, since Tracka-only teacher docs without a `name` field would otherwise be silently excluded from the query.
- No data migration was needed: Wildly's content collections (`contentItems`, `dashboardConfig`, etc.) all fall back to hardcoded JS defaults when Firestore is empty, and there were no real signed-up Wildly users at cutover.

**⚠️ Protections — read before touching anything ecosystem-related:**
1. **This repo's `firestore.rules` is the ONLY canonical rules file for the shared project.** Wildly's `firestore.rules`/`firebase.json` were deleted from its repo on purpose — it has no local rules file anymore. Deploying rules (`firebase deploy --only firestore:rules`) must only ever happen from *this* repo. If a `firestore.rules` file ever reappears in the Wildly repo, that's a sign someone tried to reintroduce standalone rules — delete it, don't deploy it.
2. **Never rename or remove the `teachers` collection**, or change what a document ID looks like there (must stay the lowercased email). Both apps' entire identity model depends on `teachers/{email}` being stable.
3. **Editing Wildly (content, UI, features) is completely safe and isolated** — Wildly's own collections (`contentItems`, `dashboardConfig`, `professionalLearning`, `tarongaTvVideos`, `upcomingEvents`, `liveSessions`, `liveResponses`) are separate from Tracka's and can't collide. The only shared surface is the `teachers/{email}` doc itself and the rules file describing who can touch what.
4. **Ordinary git pushes to Wildly's repo auto-deploy to production** (`wildlybytaronga.com.au`) via its own GitHub Actions workflow — there's no separate "deploy" step to pause on there, unlike Tracka's manual `firebase deploy`. Treat a Wildly push as a live release.
5. If Wildly's identity/auth code is ever changed again, re-verify against this repo's `firestore.rules` `isWildlyStaff()` function and the `teachers/{email}` shape described above — don't let the two repos' assumptions about the shared doc drift apart.

### Firestore rules gotcha
The staff portal uses code-based login (no Firebase Auth), so **any collection the staff portal reads or writes must have `allow ... if true`** — you cannot use `request.auth != null` for those paths. This is intentional; security comes from the access code being secret.

---

## Firestore Collections

| Collection | Purpose |
|---|---|
| `schools/{schoolId}` | School leaderboard points |
| `classes/{classCode}` | Class documents; subcollection `students/{studentId}` |
| `teachers/{email}` | Teacher profiles; subcollection `classes/{classCode}` |
| `accessCodes/{codeId}` | Daily teacher invite codes |
| `adminAccess/{docId}` | Staff portal access code verification |
| `settings/{settingId}` | App-wide toggles (GPS, etc.) |
| `studentFeedback/{docId}` | Student feedback submissions |
| `teacherFeedback/{docId}` | Teacher feedback |
| `challengeSubmissions/{submissionId}` | Class challenge photo + text submissions |
| `zoosnooz_docs/{docId}` | ZooSnooz portal/NFC summary records — doc ID: `{classCode}_{studentId}` |
| `wildestDreams_docs/{docId}` | Wildest Dreams keepsake records (film + souvenir token) — doc ID: `{classCode}_{studentId}` |
| `deviceBookings/{bookingId}` | Tracka device booking calendar entries |
| `resources/{docId}` | (Reserved for future resource library) |
| `prePostLinks/{subject}_{stage}_{timing}` | Admin-managed Canva pre/post-visit lesson links — see Pre/Post-Visit Lessons section |
| `citizenScienceSubmissions/{submissionId}` | ZooYard citizen science photo submissions, **one per habitat** — see ZooYard Deep Reference |
| `habitatObservations/{observationId}` | ZooYard field-study readings, **de-identified**, for cross-school aggregation — see ZooYard Deep Reference |

### ZooSnooz student data location
ZooSnooz per-animal data lives on the **student document** at `classes/{classCode}/students/{studentId}` under the `zoosnooz` field:
```js
zoosnooz: {
  tiger: { completed: true, videoURL: '...', videoCompleted: true, observation: '...', observationScore: {...}, quizResults: [...], points: 87, videoTitle: '...' },
  lion: { ... },
  // etc.
}
```
A summary is also written to `zoosnooz_docs/{classCode}_{studentId}` for the NFC souvenir/portal display.

---

## Cloud Functions (`functions/index.js`)

| Function | Trigger | What it does |
|---|---|---|
| `onDeviceBookingCreated` | Firestore `onDocumentCreated` on `deviceBookings/{id}` | Emails `ctr2560@gmail.com` with booking details |
| `sendMentorReport` | HTTPS (public, token-gated via `MENTOR_REPORT_TOKEN` env var) | Sends the weekly mentor report email to `ctr2560@gmail.com` — see Weekly Mentor Report Automation section |

**Note:** `sendMagicLink` is still deployed but is dead code — teacher auth moved to email+password (see Authentication Model section) and nothing in `src/` calls it anymore. Left in place rather than deleted; safe to remove in a future cleanup.

Deploy: `firebase deploy --only functions`

Resend API key stored in Firebase Functions config/environment.

**Note:** There are no Cloud Functions for ZooSnooz video/stitching — all processing is client-side in the browser.

---

## Video & media pipeline — READ THIS BEFORE TOUCHING ANY FILMING CODE

Two modes record video and stitch it into a film: **ZooSnooz** (inline in `ZooSnoozScreen.jsx`)
and **Evolve** (`src/utils/evolveFilm.js`). Evolve's is a **deliberate copy**, not a shared
abstraction, so changing Evolve can never regress live ZooSnooz. **They do not inherit from each
other — a fix in one needs applying to the other by hand.**

Every rule below was learned by shipping something broken. None of it is stylistic.

### 0aa. ⚠️⚠️ THE CARDS-ONLY FILM, AND THE FOURTH SILENT FAILURE (2026-10-03)

**Symptom:** the film builds, plays, and contains the title card and every chapter card — and
**none of the footage and none of the audio**. Reported on both an iPhone and a laptop.

**Measured, so this is not a guess.** The stored film (`evolve/547DGJ/Little Penguin/film.webm`,
2.4MB) holds **321 video frames ≈ 10 seconds** at 30fps. Five chapters of real footage would be
45s+. So the clips were not *played badly* — they were **skipped entirely**. The source clips are
fine: `kangaroo.webm` is genuine VP9/opus (magic `1a45dfa3`), 1920x1080, 144 frames, with audio.
The stored download URL returns **200** with `access-control-allow-origin` for the live domain,
and a CORS preflight on **both** `firebasestorage.googleapis.com` and `storage.googleapis.com`
(the signed-URL host) passes. **So it is not the iOS label trap, not CORS, and not a dead token.**

**Why neither of us could see the cause — and this is the real lesson.** Two failure paths were
swallowed, and they mask each other:

1. `videoEl.onerror = finish;` — a clip that cannot load went **straight to finish() with no
   record of it**. Worse, `started` stays false, so the low-fps warning (the one diagnostic this
   pipeline had) was skipped by its own `if (started && …)` guard.
2. The `decodeAudioData` catch was **empty** — `/* clip keeps its vision, loses its sound */`.

The picture and the sound fail for the **same** reasons (a 403, an expired signed URL, a CORS
miss, a container the browser will not decode), so one cause tripped both, and both were silent.
A whole film of cards, a clean console, and nothing to investigate.

⚠️ **And the screen called it a success.** The film rendered, so the student saw a finished film
and no warning. That is how this reached "I don't know why that is".

✅ **RESOLVED ON LAPTOP 2026-10-03** — Cameron: *"the laptop stitched film worked well"*, with a
**completely clean console** (no `[evolveFilm]` line at all, so no chapter failed to load).

⚠️ **WHICH CHANGE FIXED IT IS NOT KNOWN, and that is worth being honest about** rather than
claiming the instrumentation did it — instrumentation cannot fix anything. Several things moved
between the failing run and the working one, any of which could have been the cause:
- the `ensureStudentAuth` race (so the student's own writes, including `clipURL`, were being
  **denied** during the failing run — a chapter with no stored `clipURL` cannot contribute footage
  on a resume, and this is the leading candidate)
- the signed-URL minting on the resume path
- the Evolve film-upload label fix

🚫 **Do not record this as "the cards-only bug is fixed".** One successful run on one machine is
evidence it works, not evidence the cause is understood. If it recurs, the console now names the
chapter and the error code, which is what was missing the first time.

**✅ Verified by measurement, not by eye.** Two films made after the fixes:
`Orangutan/film.webm` **1112 frames** and `Wedge-tailed Eagle/film.webm` **1111 frames** (~37s at
30fps), against the broken one's **321 frames** (~10s, cards only).

⚠️ **FRAME COUNT IS THE RELIABLE TEST FOR THIS BUG, and it costs one command.** A cards-only film
still plays, still has audio cards, and still looks finished:
`ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 film.webm`
Under ~400 frames for a five-chapter film means the clips did not contribute. Do not judge this by
watching the first few seconds — the title card is the part that always works.

#### ⚠️ iOS CAPTURE: WORKS IN THE FIELD, AND THE STORED CODECS DO NOT MATCH THE THEORY

Cameron ran a dedicated iPhone test (Evolve, class `547DGJ`, alias **Orangutan**, 2026-10-03
~21:39–21:43 UTC) and reported the whole flow working: record, upload, stitch, play.

**What the stored files actually say.** All five clips and the film are **WebM, VP9 video, Opus
audio** (`magic 1a45dfa3`), four clips at 1920x1080 landscape, one at 1080x1920 portrait, the film
720x1280. There is **no `.mp4` anywhere in the bucket** in any mode.

**✅ EXPLAINED: it was CHROME on the iPhone, and Chrome on iOS is no longer WebKit.**

🚫 **The old rule "on iPhone, Safari and Chrome are the same engine, so trying both is ONE data
point" is WRONG and must not be used as evidence again.** It was true for years and is not now:
Chrome on Cameron's iPhone produced **VP9/Opus WebM**, which is a Chromium output. WebKit does not
encode VP9. So the two browsers on iOS can and do behave differently, and "it fails in both"
is genuine corroboration rather than a single observation.

⚠️⚠️ **THEREFORE SAFARI ON iOS IS STILL UNVERIFIED, and it is the one that matters most** — it is
the default browser on every iPhone, so it is what a class will use. Cameron's report was *"it
wasn't working yesterday"* in **both**, and today's successful test was **Chrome only**. A WebKit
run would record H.264/AAC in MP4, which is a code path no stored file has ever exercised.
**Treat iOS Safari capture as untested.** The tell is the stored file: an `.mp4` in the bucket is
the first proof WebKit has ever completed a recording.

#### ⚠️⚠️ THREE "iOS" RUNS, ONE SIGNATURE — iOS CAPTURE IS STILL NOT EVIDENCED (2026-10-03)

Cameron reported, in order: Chrome on iPhone works (alias **Orangutan**, 21:39 UTC), then Safari
on iPhone works (alias **Red Panda**, 21:51 UTC). Both films are genuinely good — **1096 and 1112
frames** (~36s), real footage, verified by frame count.

**But all three runs carry the identical signature:**

| Run | Reported device | Codecs | Resolution |
|---|---|---|---|
| laptop | laptop Chrome | VP9 / Opus WebM | 1920x1080 landscape |
| Orangutan | Chrome on iPhone | VP9 / Opus WebM | 1920x1080 landscape |
| Red Panda | **Safari** on iPhone | VP9 / Opus WebM | 1920x1080 landscape |

**WebKit cannot encode VP9**, so the Safari run cannot have been recorded by iOS Safari, and
**there is still no `.mp4` anywhere in the bucket** after three "iPhone" tests.

⚠️ **The signature that fits all three is a desktop webcam in a Chromium browser** — which is also
what Chrome DevTools device emulation ("iPhone" responsive mode) produces. That is a very easy
thing to believe is a phone test, and it exercises none of the code paths that actually differ on
a phone: WebKit's MediaRecorder, MP4 output, iOS memory limits during a ~45s stitch, and the
screen locking mid-capture.

🚫 **DO NOT mark iOS capture verified.** Nothing in the bucket has ever come from WebKit.

**The check that needs no tooling and settles it in five seconds:** open the clip in the staff
portal and look at its shape. **A phone held upright films PORTRAIT.** Four of five clips in every
run are **landscape 1920x1080**, which is a laptop webcam that cannot honour the portrait `ideal`
constraint. If a student's clip is landscape, it was not filmed on an upright phone.

**How to settle it with tooling, next time iOS is touched:** the stored file is the evidence. Film one
chapter, then check the newest object's codec:
`ffprobe -v error -show_entries stream=codec_name,width,height -of csv=p=0 <file>`
H.264/AAC means iOS captured it. VP9/Opus means a Chromium browser did, whatever device was in
your hand.

🚫 **Do not "fix" the label-derivation code on the strength of this.** Deriving the extension and
content type from `chunks[0].type` is correct regardless of which browser is recording — it is
right precisely because it makes no assumption about what the device produces. That is the whole
point of it.

**What changed:**
- Every swallowed per-clip failure appends to an `issues` array and logs with `videoEl.error`'s
  code/message and the URL's **host** (which is what distinguishes a signed URL from a permanent
  one at a glance).
- `buildEvolveFilm` now returns **`played`** — how many chapters actually contributed picture —
  alongside `total` and `issues`. 🚫 **A blob is not success.** `played === 0` is a cards-only
  film and the caller must treat it as a failure; `played < total` means chapters are missing.
- The film screen says so, above the film that did render.

🚫 **Do not add an empty catch anywhere in this file.** Four silent failures are now on record in
this one pipeline (audio-no-picture, canvas tainting, CORS-mistaken-for-a-stitcher-bug, and this).
Every one cost hours, and every one was a swallowed error in code that was *trying* to be
forgiving. Be forgiving AND loud.

✅ **ZooSnooz's inline stitcher got the same treatment 2026-10-03.** It carried both empty catches
and the same `videoEl.onerror = finish`. It now records `issues`, counts `played`, logs
`[zoosnooz] …` with the error code and the URL host, and the preview screen shows the reason above
a documentary that rendered without footage.

⚠️ **ZooSnooz still has the CROP half of the problem, and it was deliberately left alone.** Its
capture asks for `1280x720` **landscape** while its stitcher composes a **720x1280 portrait**
canvas, so it centre-crops exactly as Evolve did before 2026-10-03 — the "zoomed in" complaint
applies to ZooSnooz documentaries too. Fixing it means the same two changes made to Evolve (drop
the shape constraint at capture, contain-with-black in `drawFrame`) and it has not been done
because ZooSnooz is live and was not what was asked for. 🚫 Do not half-do it: changing the
capture without changing the crop makes the framing worse, not better.

### 0ab. ⚠️ NO iPHONE HAS EVER PRODUCED AN EVOLVE CLIP — measured 2026-10-03

Cameron reported the iPhone stitcher failing in **both Safari and Chrome**, while being able to
play the individual clips in the staff portal. Checked against the live bucket:

- **All 119 Evolve clips are VP9 video / Opus audio in WebM.** iOS Safari's MediaRecorder cannot
  produce either codec — it records **H.264/AAC in MP4**.
- **There is not a single `.mp4` in the bucket**, in `evolve/`, `zoosnooz/` or `wildestDreams/`.
  So the iOS label trap left no mislabelled file behind either.

⚠️ **Therefore the clips visible in the portal were filmed on a laptop, not the iPhone**, and no
iPhone recording has ever reached Storage. The iPhone fault is upstream of the stitcher, or the
iPhone run never got past recording. 🚫 Do not debug the iPhone stitcher against clips that a
laptop produced — the whole premise was wrong, and checking the codecs is what showed it.

**Useful identification trick:** the stored codec names tell you the device. VP9/Opus means
Chromium (desktop or Android). H.264/AAC in MP4 means Safari or iOS. Resolution helps too —
1920x1080 landscape is a laptop webcam ignoring the portrait `ideal` constraint.

### 0ac. ⚠️⚠️ A STITCH THAT THROWS USED TO SPIN FOREVER (fixed 2026-10-03)

`cvs.captureStream(30)` was called **bare, outside every `try`**, and the caller in
`EvolveScreen.jsx` had **no `try/catch`** around `buildEvolveFilm`. So anything thrown became an
unhandled rejection, `setFilmPhase('preview')` never ran, and the student was left on the building
screen with the dial spinning **indefinitely, with no message**. That is indistinguishable from a
slow stitch, which is exactly how it was reported: *"the stitcher for some reason in iPhone both
Safari and Chrome didn't work."*

Now: `MediaRecorder` and `captureStream` are **feature-checked up front** with a plain message
naming the laptop as the way through, the `captureStream` call is wrapped, and the caller catches
anything thrown and turns it into `{error}`.

⚠️ **Do NOT assume Safari and Chrome on iOS are the same engine.** That was true historically and
was used as a reasoning step here; it is wrong as of 2026 — Chrome on iOS recorded VP9/Opus WebM,
which WebKit cannot encode. See the iOS capture section above.

🚫 **Never leave the building screen reachable with no exit.** Any new failure must land on a
screen that says something.

### 0a. ⚠️ A RESUME THAT FAILS MUST SAY SO (2026-10-03)

Evolve raced its resume read against an **8 second** timeout and, on failure, logged to the
console and showed the student an **empty map**. A tester with two completed chapters — clips,
writing, `completed: true`, all present in Firestore — reloaded and saw nothing. The obvious
conclusion is "my work is gone", and the next thing a student does is film it all again.

**Cause:** App Check enforcement adds a mandatory reCAPTCHA round trip before the first Firestore
read (~700ms on a desktop, far more on mobile data). The read follows that. 8s was already tight
and enforcement pushed it over.

**Fixed:** timeout 8s → 20s, one automatic retry, and a **blocking screen** that says the work is
safe and offers Try again. Wildest Dreams had the same 8s race and was raised too.

🚫 **Never swallow a resume failure.** An empty screen where work should be is indistinguishable
from data loss, and it is worse than an error — it makes the student act on a false belief.
⚠️ ZooYard's resume has no timeout but still swallows its error (`console.warn` only); habitats
would silently re-lock. Worth the same treatment.

### 0. ⚠️⚠️ NEVER LABEL A RECORDING FROM A DEFAULT — the iOS trap (found 2026-10-03)

**Every film made on an iPhone was black and silent, and had been for as long as the code
existed.** It was found by accident while testing signed URLs.

`pickMimeType()` ended with `fileExt: isMP4 ? 'mp4' : 'webm'`. When `MediaRecorder.isTypeSupported`
returns false for **every** candidate — which is exactly what iOS does — `mimeType` is `''`, so it
fell through to **webm**. `MediaRecorder` was then constructed with no `mimeType`, so iOS recorded
**mp4**. The result: mp4 bytes stored and served as `video/webm`.

The file uploads fine. It downloads fine. It fetches 200. The browser simply refuses to decode it,
so every clip plays zero frames and contributes no audio, and the finished film is **black and
silent**.

⚠️ **That symptom is listed in this very document as pointing at CORS** ("no sound *and* no
picture points at CORS"). It can also mean this. Check the stored file's extension against the
recording device before chasing CORS: a `.webm` from an iPhone is impossible and is the tell.

**The rule:** derive the extension and content type from what the recorder ACTUALLY produced —
`chunks[0].type` first, then `MediaRecorder.mimeType` — never from a candidate you hoped for and
never from a default. `describeMime()` in `utils/evolveFilm.js` is the shared helper.

⚠️ **THE FIRST PASS AT THIS FIX MISSED TWO PLACES, found 2026-10-03 when Cameron reported the
iPhone still would not stitch.** It was recorded here as "fixed in all three recorders and both
stitcher outputs", and it was not:

1. **ZooSnooz's STITCHER OUTPUT** still did `const blobType = mimeType || 'video/webm'`. So the
   finished iPhone **documentary** was mp4 bytes labelled webm — and the upload a few hundred
   lines later derives its extension and `contentType` from `blob.type`, so the stored file was
   mislabelled too. The individual clips were fine by then; the film was not.
2. **Wildest Dreams keeps its OWN copy of the recorder** (`startChapterRecording` in
   `modes/wildest-dreams/film.js`), not the Evolve util. The note above claimed it imported it.
   It does not, so it never received the fix and every iPhone WD clip was mislabelled.

3. **Evolve's FILM UPLOAD** — `submitFilm` in `EvolveScreen.jsx` did
   `const { fileExt, contentType } = pickMimeType()`, i.e. it asked the browser what it *could*
   record instead of asking the blob in hand what it *was*. On iOS that returned webm for an mp4
   film. **This was the one that mattered**, because Evolve is the mode being tested. Now
   `describeMime(filmBlobRef.current.type)` — the blob is already labelled correctly by
   `buildEvolveFilm`, so read it from there.

🚫 **Do not trust "fixed everywhere" on this one. There are SIX places** that label a recording:
three clip recorders (ZooSnooz inline, Evolve util, **WD's own copy**), two stitcher outputs
(ZooSnooz inline, Evolve util), and **the Evolve film upload**. Grep for `|| 'video/webm'` **and
for `pickMimeType()` called anywhere near an upload** before believing it.

⚠️ **The tell that a label is being guessed: a capability probe used at UPLOAD time.**
`pickMimeType()` answers "what could this browser record?", which is a legitimate question when
constructing a MediaRecorder and the wrong question for anything holding a finished blob. If a
`Blob` is in scope, `blob.type` is the answer.

The rule in every one of them: `chunks[0]?.type || mr.mimeType` first, the candidate only as a
last resort.

🚫 Old `.webm` clips recorded on iOS are still mislabelled in Storage. They will stay broken
unless their content type is corrected — the bytes are fine, only the label is wrong.

### 0b. ⚠️⚠️ "THE CAMERA IS ZOOMED IN" — IT WAS THE CROP, NOT THE CAMERA (fixed 2026-10-03)

Students at the first Evolve run (Ingleburn HS, 2026-09-22) reported the camera being **zoomed
in**, and Cameron confirmed it on his own phone. **Nothing was wrong with the camera.** Two
separate crops were discarding most of the picture after the fact.

**The numbers, which are the whole story:**

| | aspect | of a 1920x1080 clip, width kept |
|---|---|---|
| Capture preview (`aspect-ratio: 9/16` + `object-fit: cover`) | 0.563 | **32%** |
| Film's video area (720 wide, 1280-80-180 = 1020 tall) | 0.706 | **40%** |

So a landscape clip lost ~60% of its width in the film, and the preview was **tighter still** —
the most zoomed-in view in the system was the one the student framed themselves in.

⚠️ **And the comments asserted the opposite.** Both the capture constraints and the preview CSS
carried a note saying `object-fit: cover` meant "the preview shows exactly the crop the stitcher
will take". It never did: 0.563 is not 0.706. 🚫 **Never state that two geometries match. Derive
one from the other.** `EVOLVE_VIDEO_ASPECT` is now exported from `utils/evolveFilm.js` and the
preview reads it through a CSS variable, so they cannot drift again.

**The fix to the film (Cameron's choice, 2026-10-03): a wide clip is no longer cropped.** When a
source is more than 5% wider than the window, the WHOLE frame is fitted to the full width and the
space above and below is filled with a **blurred, darkened enlargement of the same frame** — no
crop, and no black bars in a keepsake. Portrait and near-square sources keep the mild centre crop,
which loses almost nothing and fills the window properly.
⚠️ `ctx.filter` is not available in every engine. Where it is missing this degrades to an
unblurred enlargement, which still reads as a soft backdrop — **deliberately no feature branch**,
because the degraded form is acceptable and a branch would be a second thing to keep in step.

**The preview is now `object-fit: contain`** on the same aspect, which is what the stitcher does.

#### ⚠️⚠️ THE REAL CAUSE WAS THE CAPTURE CONSTRAINTS (found 2026-10-03 by looking at a frame)

The crop above made it worse, but it was not the cause. **A frame pulled out of a RAW stored clip
— before any stitching — was already an extreme close-up, forehead to mouth, in a 1920x1080
landscape frame.** The camera was handed `width 1080 / height 1920 / aspectRatio 9:16` to match the
portrait film; a phone sensor is natively landscape, so the browser satisfied that request by
**digitally cropping the sensor**. The zoom was baked in at capture.

🚫 **NEVER constrain the SHAPE of the camera.** Ask for a sensible `width` ideal and nothing else,
and let the camera give its natural field of view. Fixed in **both** `EvolveScreen.jsx` and
`modes/wildest-dreams/components/Recorder.jsx`, which carried an identical copy of the constraint.
🚫 And do not reach for `exact` instead — that fails the camera outright on a device that cannot
comply, which is worse than a bad shape.

⚠️ **THE LESSON ABOUT METHOD, which is the valuable part.** Three rounds of reasoning about crop
arithmetic were spent on this, all of it correct and all of it aimed at the wrong layer. **One
`ffmpeg` frame grab from the stored clip answered it immediately:**
`ffmpeg -ss 2 -i clip.webm -frames:v 1 out.png` — then look at it. When a complaint is about how
something LOOKS, extract the pixels before theorising about the code that produced them.

#### The card layout (2026-10-03, Cameron's direction)

Once the camera gave a proper wide shot, the blurred-video fill had to go: *"I don't like how the
bars for the background now are the actual video"*.

- The video is **contained, never cropped**, and the leftover space is **plain black**. Quiet,
  deliberate, and it never competes with the footage.
- **The strips grew to carry that space instead of the bars**: top 80 → **120**, bottom 180 →
  **320**. ⚠️ These drive `EVOLVE_VIDEO_ASPECT`, which the capture preview reads, so the preview
  follows automatically — that is exactly why it is derived rather than written twice.
- **The footer carries each chapter's OWN writing.** It was pledge-only for one round, on the
  reasoning that five reflections would turn a film into a document — wrong: it left the enlarged
  footer **empty under four of the five chapters**. The student wrote something at every stop, and
  the film is the only place all five are ever seen together.
  ⚠️ A stored reflection **already includes its sentence lead** ("I will ..."), so nothing prints a
  lead in front of it — the certificates shipped with exactly that bug and read "I will / I will
  plant something".
  ⚠️ **The text shrinks to fit before it truncates** (25 → 22 → 19 → 17px, then an ellipsis).
  `EVOLVE_MIN_WORDS` is only 10 but nothing caps the upper end and students write far more; cutting
  a student's own words off is the last resort, not the first.

### 1. Capture must match the film's aspect ratio

Evolve films are **720×1280 portrait**, so capture asks for portrait:

```js
video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1920 }, aspectRatio: { ideal: 9/16 } }
```

It originally asked for `1280×720` **landscape**, and the stitcher then cropped the sides off to
fit the portrait canvas — roughly half of every frame was thrown away, and students framed
themselves in a shape that was not what ended up in the film.

Constraints are `ideal`, never `exact`, so a desktop webcam that cannot do portrait still works.
The preview box is `aspect-ratio: 9/16` with `object-fit: cover`, which crops **the same way the
stitcher will** — so what a student frames is what lands in the film on any device.

### 2. The draw loop must be rAF *with a timer watchdog*

This one produced films with **perfect audio and no picture at all**, twice.

- `requestAnimationFrame` **stops dead** when the tab is hidden or the screen sleeps. Title and
  chapter cards survive that (they draw once *synchronously* and the canvas holds the image, and
  `captureStream` keeps sampling it) but video needs continuous redraws, so the footage silently
  vanishes while the audio — played from buffers decoded up front — carries on perfectly.
- Replacing rAF with a bare `setInterval` fixes the freezing but **drifts and bunches up** when
  the per-frame work overruns the interval, which reads as badly choppy footage.
- The current loop therefore uses **rAF while visible, a timer while hidden**, plus a **watchdog**
  that restarts the loop if no frame has been drawn for 400ms.

A **Screen Wake Lock** is held for the whole stitch for the same reason. It is best-effort — not
supported everywhere — so the watchdog still matters.

**BOTH pipelines now have this** (ZooSnooz ported 2026-09-24). ZooSnooz additionally had no wake
lock at all until then, so a phone dimming and locking by itself was enough to ruin a documentary
without the student touching anything.

⚠️ They remain **separate copies on purpose**. A fix in one still needs applying to the other by
hand. Do not merge them into a shared module to avoid that — the independence is what stops a
change to Evolve regressing live ZooSnooz.

### 3. Clips read back from Storage need CORS **and** `crossOrigin`

Learned 2026-08-20, and it cost an afternoon because it looks exactly like a stitcher bug.

The bucket had **no CORS policy at all**. Uploading worked, so nothing looked wrong until a
student resumed a session — in one sitting `clipURLs` holds local `blob:` object URLs, but on
resume they are rehydrated as `https://firebasestorage.googleapis.com/…` download URLs
(`EvolveScreen.jsx`, the resume effect vs. `onComplete` in `beginRecord`). That is when the two
independent failures appear:

- **Audio** — `fetch(clipURLs[c.id])` for the up-front `decodeAudioData` is blocked outright.
- **Picture** — the `<video>` element loads fine without CORS, but `drawImage`ing it **taints the
  canvas**, and `captureStream` then stops producing picture. **The `drawImage` is inside a
  `try/catch`, so this fails completely silently.**

The result is a film of chapter cards with nothing between them. It is not the rAF bug, and the
low-fps warning misattributes it to a sleeping screen.

Both halves are needed:

1. `cors.json` in the repo root is the live policy. Apply with
   `gcloud storage buckets update gs://tarongatracka.firebasestorage.app --cors-file=cors.json`
   (project is owned by **thebiologybloke@gmail.com**). It lists `GET`/`HEAD` for localhost:5173,
   localhost:4173 and the live domains, and exposes the range headers video seeking needs.
   **A new origin — e.g. Wildly on its own domain — must be added here and the command re-run.**
2. `videoEl.crossOrigin = 'anonymous'` **set before `src`**, in both `evolveFilm.js` and
   `ZooSnoozScreen.jsx`. Order matters; after `src` it does nothing.

⚠️ Setting `crossOrigin` **without** the bucket policy live is worse than the bug — clips then
fail to load entirely. Deploy the CORS policy first.

To check a URL directly:
`curl -I -H "Origin: http://localhost:5173" "<clip url>" | grep -i access-control`
No `access-control-allow-origin` in the response means the policy is not live.

### 4. Every path carries `pathLength="1"`… (Evolve map only, see the Evolve section)

### 5. Other details that cost time

- `mr.start(500)` then an **80ms settle** before the first frame, or the opening frames drop.
- Each clip's guard timer is **re-armed to the real duration** once playback actually starts
  (`isFinite(videoEl.duration)` — MediaRecorder webm often reports `Infinity` or `null`).
- The `<video>` element is **released after every clip** (`removeAttribute('src'); load()`) or the
  browser's decoder pool runs out partway through a five-clip stitch.
- MIME candidates are tried in order; **Safari only has mp4/h264**.
- Audio is decoded for *all* clips up front into `AudioBuffer`s and played via
  `AudioBufferSourceNode`, kept alive by a looping silent buffer on the destination. This is why
  audio survives when video fails — the two paths are completely independent.
- Evolve's stitch canvas is **720×1280 portrait at 2.5 Mbps**. It was 1 Mbps (inherited from
  ZooSnooz) which looked blocky for a keepsake.
- A stitch takes **~45 seconds for five clips** on a desktop. Slower on a phone, and the screen
  must stay awake.

### 6. How to debug it

`evolveFilm.js` logs a warning naming any chapter that **played but drew under ~5fps**:

```
[evolveFilm] "giraffe" drew only 4 frames in 3.0s (~1.3fps) - its footage will look frozen.
```

Before that existed, this class of failure was completely silent. If a student reports a film with
sound but no picture, that warning is the first thing to look for.

**But check the console for CORS errors first.** The warning blames a sleeping screen, which is
only one cause — a blocked clip produces the same low frame count. `Access to fetch at
'https://firebasestorage.googleapis.com/…' has been blocked by CORS policy` means it is section 3,
not the draw loop. **No sound *and* no picture points at CORS; sound but no picture points at the
draw loop.**

### 7. ⚠️ Automated browser testing cannot validate this

**A CDP/automation-driven tab reports `document.visibilityState === "hidden"`.** That means:

- CSS animation timelines are **paused** (`anim.currentTime` stays at 0)
- `requestAnimationFrame` **does not fire**
- Chrome actively suspends playback: *"video-only background media was paused to save power"*

So an automated pass will manufacture exactly the frozen-footage bug it is trying to test, and a
green automated result means nothing here. Frame counts observed in a hidden tab (79, 59, 4, 4, 3
across five clips) are Chrome's background throttling ramping up, not a real defect.

**Anything touching capture, playback or stitching must be verified by a human with the window in
the foreground.** You can still prove *structure* from automation — element wiring, computed
styles, `getAnimations()` state, and stepping an animation manually via `anim.currentTime = n`.
Just never conclude the pipeline works from it.

**This applies to `speechSynthesis` too** — Chrome suppresses it in a hidden tab, so a probe from
an automated tab reports "no event at all" on a perfectly healthy engine. Confirmed 2026-09-16.

### 8. ⚠️ React will reuse ONE `<video>` node, and `srcObject` beats `src` (2026-09-09)

A live camera preview and a playback player are usually the same element type in the same position
of the same tree. React reconciles by position, so it keeps **one DOM node** and swaps the
attributes. That node still has `srcObject` pointing at the (now stopped) MediaStream, and
**`srcObject` takes precedence over `src`** — so the newly recorded blob URL is set and ignored,
and playback shows a dead black frame.

This cost a full round trip in Wildest Dreams: "it records but there is no playback". Fix is
distinct `key`s on the two elements, plus nulling `srcObject` on the player via a ref callback.
See `modes/wildest-dreams/components/Recorder.jsx`. **Evolve has the same latent trap** if its
preview and playback videos ever end up adjacent in one tree; they are not today.

### 9. ⚠️ Never restart the camera on the phase change that begins recording

`Recorder.jsx` ran its camera effect for both `ready` and `recording`. `startCamera()` opens with
`stopCamera()`, so the moment `begin()` set the phase to `recording`, the effect re-ran and
**stopped the very tracks MediaRecorder was recording**. The recorder carried on against dead
tracks and produced a blob under 500 bytes, which `startChapterRecording` rejects as
`empty-recording` — so every attempt showed "That did not record" with no other symptom.

Guard the effect to the idle phase only, and check `track.readyState === 'live'` before starting.

---

## Audio & speech — READ BEFORE TOUCHING ANYTHING THAT MAKES A NOISE

Learned the hard way across 2026-09-11 → 09-16 in Wildest Dreams, over several failed attempts.
**Every fault below fails silently** — no exception, no error event, just no sound.

### The conclusion first: prefer recorded audio to `speechSynthesis`

Wildest Dreams now plays **pre-recorded `<audio>` clips** for everything a student taps, because
that vocabulary is fixed and small (8 soundboard words, 6 focus prompts, 8 animal names). A plain
audio file is identical on every device, has no engine to wedge, no missing voice, no gesture
rules, and can be a warm human voice. `speechSynthesis` is now only a fallback and for dynamic
screen narration. **If you are adding spoken UI anywhere else in Tracka, do the same.**

Files: `public/voice/{key}.m4a`, regenerated by `scripts/generate-wd-voice.sh`. A missing file
falls through to the synthesiser, so the mode works with none, some or all of them present.

### `speechSynthesis` faults, in the order they bit

1. **`cancel()` in the same tick as `speak()` wedges Chrome.** The first implementation did
   `cancel(); speak(u)` on every line, and every screen change ran it. That alone meant nothing
   ever spoke. Cancel only when something is genuinely playing.
2. **A deferred `speak()` is rejected by Safari and iOS.** They only accept `speak()` from inside
   the user gesture that triggered it, so a `setTimeout` — even 60ms, added to dodge fault 1 —
   puts it outside and the utterance is dropped. **Keep the common path synchronous**; defer only
   when you genuinely had to cancel.
3. **An unreferenced `SpeechSynthesisUtterance` can be garbage collected mid-sentence.** Hold it.
4. **Voices load asynchronously.** Speaking before Chrome has them does nothing at all. Wait
   briefly for `voiceschanged`, capped, so a device with no voices does not hang.
5. **Chrome's engine can WEDGE outright**: `speak()` queues, `speechSynthesis.speaking` reports
   `true`, and no `onstart`, no `onerror` and no sound ever follow. **Confirmed on a real machine
   with plain `speechSynthesis` and none of our code involved** — it is a browser fault, and
   `cancel()` alone does not clear it. Quitting Chrome fully (Cmd+Q) does. The mode now runs a
   watchdog: if an utterance has not started in 1.2s, reset with `cancel()`+`resume()` and retry
   **once**.
6. **`pause()` while a `play()` promise is unresolved rejects with `AbortError`.** Treating that
   as "the audio file is missing" and falling back to the synthesiser made two voices talk over
   each other. Ignore `AbortError` and ignore results from a superseded request.
7. **Two sound sources need one channel.** Recorded clips and synthesised narration overlapped
   constantly, because tapping a button both plays a clip and changes the screen that then
   narrates itself. Rule that works: **a tap always wins and plays now; narration waits for the
   channel, or is dropped if a newer tap replaces it.**
8. **Suppress repeats by WHOLE SENTENCE only.** Stripping a just-spoken phrase wherever it
   appeared turned "Watch the Tiger. Take your time." into "Watch the . Take your time."
9. **Match the synthesiser voice to your clips** (`en-AU` here). Left alone it picks the system
   default, so the app ends up with two different speakers — a real accessibility problem, not a
   polish one.

### How to debug it

`speech.js` logs `[wildestDreams] speech failed: <reason>` and
`[wildestDreams] speech did not start; resetting the synthesiser`. Before those existed this whole
class of failure was invisible.

**Trace the module rather than guessing.** Bundling `speech.js` with esbuild and running it in Node
against a stubbed engine found the real fault in minutes after several wrong guesses:

```bash
npx esbuild src/modes/wildest-dreams/speech.js --bundle --format=esm --outfile=/tmp/sp.mjs
# then stub window.speechSynthesis / Audio / localStorage and assert what reaches the engine
```

---

## ZooSnooz — Deep Reference

ZooSnooz is the entire night-mode experience. It lives almost entirely in `src/screens/ZooSnoozScreen.jsx` (~2500 lines). Understanding this file is critical before touching it.

### Animals (`src/data/zoosnoozAnimals.js`)

5 animals, each fully configured with stage-differentiated content (stages 2–5):

| Animal ID | Name | Interaction type |
|---|---|---|
| `tiger` | Sumatran Tiger | Energy tracking (hold button while moving) |
| `lion` | African Lion | Sound/volume tracking (mic) |
| `rhino` | Rhino | Motion path tracking (DeviceMotion gyroscope) |
| `binturong` | Binturong | Bioluminescence/light sensor (camera brightness) |
| `sun-bear` | Sun Bear | (no interactive instrument — observation only) |

Each animal has: `keeperInsight`, `interaction`, `question`, `options`, `correct`, `fact`, `conceptHeading`, `observationPrompt`, `conceptChips`, `keeperPrompts`, `filmingGuidance`, `behaviourWords`, `ideaWords`, and a `byStage` object overriding question/options/prompt/keeperQ per stage.

### ZooSnooz phases (per animal)
Each animal goes through 6 phases in order, tracked by `zzPhase` state:
1. `insight` — Keeper insight card (read only)
2. `interaction` — Sensor/instrument (tiger energy, lion sound, rhino motion, binturong light)
3. `mcq` — Multiple choice question (stage-differentiated)
4. `observation` — Free-text observation with keeper question prompt
5. `video` — 10-second video clip recording (optional)
6. `preview` — Summary + badge award

`INTER_DURATION` controls interaction timer: `{ tiger: 30, lion: 30, rhino: 0, binturong: 0, 'sun-bear': 0 }` (rhino/binturong/sun-bear are untimed sensor reads).

### Scoring formula
```
animalPoints = Math.round((obsScore.behaviour + obsScore.detail + obsScore.writing) / 15 * 100) + (quizCorrectOnFirstAttempt ? 20 : 0)
```
- Observation scores: `behaviour` /5, `detail` /5, `writing` /5 (max 15 → maps to 100 pts)
- MCQ bonus: +20 points if answered correctly on first attempt
- Max per animal: 120 points
- Scores computed by `buildObservationScore(text, animalId, classStage, 'science')` from `src/utils/scoring.js`

### Video recording pipeline

All video processing is **client-side only** — no server-side transcoding.

1. **Camera access**: `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: 1280, height: 720 }, audio: true })`
2. **Codec selection**: tries `video/webm;codecs=vp9,opus` → `vp8,opus` → `webm` → `mp4;codecs=h264,aac` → `mp4` in order; falls back to `video/webm`
3. **Recording**: `MediaRecorder` at `videoBitsPerSecond: 2_000_000`; chunks collected in `zzChunksRef`
4. **On stop**: assembles `Blob`, creates `objectURL` for local preview (`zzVideoURLs[animalId]`)
5. **Upload**: `uploadBytesResumable` to Firebase Storage path `zoosnooz/{classCode}/{studentId}/{animalId}.{ext}`
6. **After upload**: `getDownloadURL` and writes `videoURL` + `videoCompleted: true` back to the student Firestore doc via `setDoc` merge

Upload progress shown as percentage. If no bytes after 30s, logs warning about Storage rules.

### Canvas stitching pipeline

Triggered when student taps "Create Documentary" from the ZooSnooz collection screen. Runs client-side in the browser using Canvas + MediaRecorder.

1. **Transition to stitch screen**: `zzScreen` set to `'stitch'`, `zzStitchPhase` set to `'stitching'`
2. **Canvas setup**: offscreen `<canvas>` at **720×1280 (portrait)** — this doc previously said 1280×720, which was wrong. Draws at ~30fps via **rAF while visible, a timer while hidden, plus a 400ms watchdog**, and the whole stitch pauses while the tab is hidden. See the Video & media pipeline section; it was rAF-only until 2026-09-24, which produced documentaries with audio and no picture.
3. **Audio setup**: `AudioContext` + `createMediaStreamDestination` collects audio from all video clips
4. **Intro card**: ~2s animated title card drawn to canvas ("ZooSnooz Night Documentary" + student name)
5. **Per animal**: fetches the blob URL, plays it in a hidden `<video>` element, draws frames to canvas while the video plays; overlays animal name and counter
6. **Credits card**: ~2s outro with Taronga branding
7. **Output**: `MediaRecorder` on the combined canvas+audio stream; chunks assembled into final `Blob`
8. **Result**: `zzStitchedURL` (objectURL for preview), `zzStitchedBlobRef` (blob for upload)
9. **Phase → `'preview'`**: student sees the stitched video and can submit or go back
10. **On submit (`zzFinalSubmit`)**: uploads stitched blob to Storage, writes full session summary to `zoosnooz_docs`, stamps NFC doc

**Device fallback**: if `MediaRecorder` is not supported or stitching fails, shows "Video stitching is not supported on this device. Your individual clips have been saved."

### NFC souvenir system

- Each animal mission completion stamps a Firestore doc at `zoosnooz_docs/{classCode}_{studentId}`
- NFC tags at each enclosure contain a URL: `https://tarongatracka.web.app/zzv_{animalId}_{classCode}_{studentId}`
- That URL is caught by the SPA rewrite → `DocumentaryViewer.jsx` reads the `docViewCode` from AppContext, parses the `zzv_` prefix, fetches the student's Firestore doc, and renders a souvenir card (animal photo, observation, badge, scores, conservation fact)
- `docViewCode` is set in AppContext and triggers `DocumentaryViewer` to render in place of the normal screen

⚠️ **ZooSnooz tags hold a raw Storage URL, which Evolve deliberately moved away from** — see
"Souvenir route" in the Evolve reference for why (tag capacity, and the tag dying if the file is
ever re-uploaded). ZooSnooz has not been migrated. If its tags are ever rewritten, use the same
token-and-lookup approach.

### Firebase Storage rules

**`storage.rules` now exists in the repo** (added 2026-08-12) and is wired into `firebase.json` under the `"storage"` key. Deploy with `firebase deploy --only storage`.

⚠️ The file is only honoured *because* of that `firebase.json` key. A `storage.rules` file without it is silently ignored.

**Every upload path the ecosystem uses must be listed there**, or writes fail with `storage/unauthorized` and — because uploads are backgrounded — the failure is invisible unless you check the console log:

| Path | Written by | Auth |
|---|---|---|
| `zoosnooz/` | ZooSnooz clips + documentary | none (students) |
| `evolve/` | Evolve clips + film | none (students) |
| `wildestDreams/` | Wildest Dreams clips + film | none (students) — ⚠️ **NOT YET DEPLOYED** |
| `zooyardHabitats/` | ZooYard attest photos | none (students) |
| `citizenScienceEvidence/` | ZooYard citizen science photos (one per habitat) | none (students) |
| `challengeEvidence/` | Class challenge photos | teacher (Firebase Auth) |
| `resources/` | **Wildly** resource PDFs | Wildly staff (Firebase Auth) |

`resources/` belongs to **Wildly**, which shares this Firebase project. Removing it breaks Wildly's PDF uploads — check both repos before narrowing this file.

**Correction (2026-08-12):** an earlier note here claimed the ZooYard `citizenScienceEvidence/` path "worked immediately in production with no manual Console rule change" and that the live rules were "broadly permissive". **That was never verified and is wrong.** A direct probe of every path found only `zoosnooz/` was writable; `citizenScienceEvidence/`, `zooyardHabitats/` and `evolve/` were all denied, and `citizenScienceSubmissions` had zero documents — so no student had ever completed the task to prove it. Never assume a new Storage path works; probe it.

**Storage rules are only half of it (2026-08-20).** Rules govern *whether* a file can be read;
**CORS governs whether the browser will hand the bytes to your JavaScript.** The `evolve/` path
passed its rules probe and uploads worked, yet every clip was unreadable from every origin because
the bucket had no CORS policy. Probe the read path from the app, not just the rule. See CORS in
Video & media pipeline.

---

## ZooYard — Deep Reference

ZooYard is a self-attest, single-session, no-GPS program built for classes that can't visit the zoo (NSW DoE devices block geolocation, so the daytime GPS-proximity flow can't run in a classroom). It's a third `sessionType` alongside `standard`/`zoosnooz`, fully isolated — it shares zero mutable state with the other two flows, only pure helpers like `buildObservationScore`.

### How a class becomes ZooYard
`CreateClassScreen.jsx`: teacher selects location **"Your School — ZooYard"** (`value="school"` — this option already existed in the dropdown, previously disabled as a "Coming Soon" placeholder for exactly this feature). This sets `isZooYard` → `sessionType: 'zooyard'`, `subject: 'science'` (hardcoded, subject dropdown hidden — Science-only for v1, same treatment as ZooSnooz's hidden dropdown), `location: 'school'` → venue label `"School"`. `EXPEDITION_AWARDS['school']` already existed too (20 pts, one-time per school).

### Routing
`App.jsx` `Router()`: `if (sessionType === 'zooyard') return <ZooYardScreen />;`, mirroring the ZooSnooz short-circuit — this means `ZooYardScreen.jsx` is fully self-contained and the daytime `currentScreen` switch never runs for a ZooYard class.

### Content (`src/data/zooyardAnimals.js`)

**Eight habitats as of 2026-09-29** (was three). The five added — `blue-mountains-bushwalk`,
`sea-lion`, `chimpanzee`, `gorilla`, `rhino` — are marked **DRAFT** in the file: the structure is
final, the wording is a first pass awaiting Cameron's review. Three design rules hold across all
eight and should survive any content edit:

1. Each habitat names ONE environmental quality the animal depends on, and the watch is about
   noticing whether the schoolyard has it.
2. **Each action is different from every other habitat's.** Five schoolyards of identical bird
   baths would be a worksheet. Ground layer · litter pickup · missing forest layer · plant variety
   · insect waterer.
3. Every prompt carries `{n}` and every animal has stages **1–5**.

| Animal | Habitat area | Measures | Builds |
|---|---|---|---|
| koala | bushland | steps to next tree | plants into the canopy gap |
| tiger | rainforest | steps until concealed | a cover pile |
| giraffe | savannah | sightline blockers | open-sited bird water |
| blue-mountains-bushwalk | bushland | bare steps out of ten | rakes a ground layer back |
| sea-lion | coast | rubbish along 20 steps from a drain | clears that line |
| chimpanzee | forest | vertical plant layers | plants the missing middle layer |
| gorilla | forest | plant *kinds* within arm's reach | adds a kind that is missing |
| rhino | wetland | steps to drinkable water | insect waterer with landing stones |

⚠️ **`coast`, `forest` and `wetland` have `videoBg: null`** — no ambient clip exists for them.
The write-up screen checks for it and falls back to the theme gradient. A path to a file that
does not exist renders a broken `<video>`; null does not. Do not "fix" the null with a guess.

⚠️ **Eight habitats is a lot of session.** Each one is now video → MCQ → 2-min observation →
measurement → build → writing. Three was already a full lesson each. Nothing in the app lets a
teacher choose a subset, so a class currently sees all eight — that decision is open.

Ids are deliberately reused from `src/data/animals.js` (`koala`, `tiger`, `giraffe`) to get their existing photos/badge art for free, and because koala/giraffe already have hand-tuned keyword-scoring branches in `scoreObservation()` (tiger falls through to the generic fallback — fine, just less tailored feedback). Safe to reuse ids because a ZooYard class is a completely separate `classes/{code}` document — no student doc ever mixes ZooYard and daytime data.

Each entry: `habitatArea`/`habitatLabel` (bushland/rainforest/savannah), `selfAttestWhere` (the
short, very large "go and stand next to a tree" line) + `selfAttestPrompt` (supporting detail) +
`selfAttestQuestion`, **no GPS check at all**; `videoUrl` (still null — see Known gaps);
`activity` (single MCQ + fact); `observation` (`seconds`/`focus`/`title`/`instruction`/`lookFor`);
`citizenScience`; `writingPromptByStage` (**stages 1–5**, no `{n}` placeholders any more).

### ⚠️ Watch, build, explain (2026-10-01) — the current shape of a habitat

Five beats, each doing one job:

> photo unlock → video → quiz → **two-minute watch** → **build it** → write it up

**There is no measurement step and `fieldStudy` no longer exists.** One was added on 2026-09-26
(pace out the canopy gap, run a concealment test, count sightline blockers) and removed on
2026-10-01 as one step too many. It was the most fragile part of the mode: the tiger method
needed a partner, "blockers" needed interpreting, it was the one place a student could fake the
whole task with a plausible number, and it sat exactly between the watching and the building,
which is where a speed bump hurts most.

⚠️ **Do not reinstate a counting activity.** If quantitative data is ever wanted again, harvest it
from the watch itself ("how many birds landed?") so the counting *is* the watching, rather than
adding a sixth beat.

#### The organising rule — protect this when editing content

Each habitat names **one environmental quality the animal depends on**. The student spends two
minutes noticing where that quality exists in their schoolyard and where it does not, then builds
something that provides it. `observation.focus` names the quality, and `citizenScience` must
answer that same quality and nothing else (`primary`, `fallback`, `steps`, `photoPrompt`). **Watching and building have to be about the same
thing** or the habitat falls apart into two unrelated tasks.

| Animal | Quality (`observation.focus`) | Builds |
|---|---|---|
| koala | connected trees | plants into the canopy gap |
| tiger | cover to hide in | a cover pile |
| giraffe | long views and water | open-sited bird water |
| blue-mountains-bushwalk | a living ground layer | rakes a ground layer back |
| sea-lion | where the water goes | clears the stormwater path |
| chimpanzee | layers at different heights | plants the missing middle layer |
| gorilla | variety of plants | adds a kind that is missing |
| rhino | shade and cooling | makes a shaded, cooler refuge |

⚠️ **Every action is deliberately different.** Eight schoolyards of identical bird baths would be
a worksheet. Check the table before adding a ninth habitat.

**The rhino moved from water to shade** on 2026-10-01. Greater one-horned rhinos wallow to
thermoregulate, so shade *is* the need; it stops duplicating the giraffe's water dish; and it is
the action a school is least likely to ban, where standing water is the most likely.

#### The build screen (`zyPhase === 'action'`)

⚠️ **It is read standing outside, one-handed, by a kid about to pocket the phone and walk off.**
It is a memorise-and-go screen, not a reading screen, and that drives every decision:

- **One instruction**, `task.primary`, in the Taronga display face at display size. It previously
  competed with a task title, a recap sentence and a photo-prompt heading all saying the same
  thing four ways.
- **No card around it.** The habitat gradient IS the page, so each of the eight feels like a
  different place and the screen stops reading as a form. **Colour says what to do; the white
  panel is the tool.** Do not move instructions into the white panel.
- ⚠️ **Keep the scrim light.** Crush it for contrast and all six habitat gradients collapse into
  the same dark green, losing the only cue that says which place you are in. A radial pool of
  `theme.accent` behind the headline does the lifting instead.
- **Two disclosures, both shut by default**, in this order: **"How do I do it?"** (numbered
  `citizenScience.steps`, 5 per habitat) then **"Cannot do that here?"** (`citizenScience.
  fallback`). Steps come first because far more students need them than need the fallback.
  Neither may compete with the headline for a student who already knows what to do.
- **The step numerals carry information** — these are a real sequence worked through in order,
  which is the only thing that justifies numbering a list.
- 🚫 **No note field.** It used to carry an optional "tell us about it", which asked for the same
  thing the write-up screen asks for properly and scores. Two writing moments in one habitat
  means the first gets a shrug. Staff moderation therefore sees a photo with no words beside it;
  if that bites, copy the written response onto the submission afterwards rather than putting a
  box back here.

#### The watch (`zyPhase === 'observe'`)

Two minutes, per-animal `observation.seconds`, with `observation.focus` shown as a pill and the
`lookFor` prompts listed before it starts.

- 🚫 **Nothing is recorded, and there is no input on the screen at all.** A box to fill in means a
  student writes for two minutes instead of looking for two minutes, which is the opposite of the
  point. This is deliberate, not an omission.
- ⚠️ **Timestamp-based, never a tick counter.** A school tablet that locks, or a tab pushed to the
  background, stops firing intervals — a counter would freeze wherever it reached.
- **"Skip the timer" exists and is deliberately quiet**, same reasoning as Evolve's: thirty
  students outdoors on a bell cannot always be held still.

#### `habitatObservations` — built, then removed unused

A flat, de-identified collection for aggregating field-study readings across schools. It was
written on 2026-09-28 and removed on 2026-10-01 along with the measurement that fed it: with no
number there was nothing to aggregate. **Its Firestore rule was removed too, and it was never
deployed, so no document was ever written.** Nothing references it.

If a count ever returns on the watch screen, `ZooYardScreen.jsx` carries a comment at the old
write site. The design worth keeping if so: `schoolId`, `schoolName`, `stage`, `habitatId`,
`methodId`, `value`, `unit`, `visit` — and 🚫 **no student name, alias, studentId or photo**,
because that is the one ZooYard collection meant to be queried across schools.

#### What this changed elsewhere

- `citizenScienceSubmissions` now carries **`habitatId` and `habitatTitle`**, and there are
  **three per student** instead of one. `taskId` is the per-habitat task id, no longer always
  `'habitat-hero'`. The staff tab and the teacher panel on Class Details show the habitat as a
  pill; older submissions lack the field and simply show nothing. Both headings now read
  "Citizen Science Submissions".
- **`zooyard.sessionCompleted` moved.** It used to be written by the Habitat Hero submit; it is
  now written by `finishSession()` when all three habitats are done. The **+10 school
  leaderboard bonus moved with it**, so it stays once per student rather than firing three times.
- `zooyard.{animalId}.action` holds `{ taskId, status, photoUrl, note, submittedAt }`.
- The resume path no longer treats a legacy `zooyard.citizenScience` field as "session done".

### `ZooYardScreen.jsx` — self-contained sub-router
Mirrors `ZooSnoozScreen.jsx`'s pattern exactly: own local component state (no `StudentContext` badges/foundAnimals), cascading `if (phase === ...) return <JSX/>` blocks rather than a switch. Top-level phase (`zyScreen`/`setZyScreen`: `'habitats' | 'collection' | 'done'` — `'citizenScience'` was removed 2026-09-28) lives in `AppContext.jsx` next to `zzScreen` so it survives the screen's own re-renders; per-animal phase (`video → activity → observe → action → written → badge`) is local `useState`.

Flow: **first-run intro** (once) → **3D zoo map with a locked marker per habitat** → tap a
padlock → **unlock sheet over the map** (go and stand there, photograph it) → video/placeholder →
single MCQ → **two-minute watch, nothing recorded** → **build the thing and photograph it** →
**written analysis** (scored via `buildObservationScore(text,
animalId, classStage, 'science')`, points formula same as ZooSnooz:
`Math.round((behaviour+detail+writing)/15*100) + (quizCorrect?20:0)`) → badge reveal **with
feedback** → back to the map.

⚠️ There is **no `attest` phase any more**. `openAnimal()` always starts at `video`, because
proving where you are now happens on the map before you can enter at all. See "Locks" below. Each habitat's build collects a photo (client `uploadBytes` to `citizenScienceEvidence/{classCode}/{studentId}-{animalId}-{timestamp}.{ext}`) + optional note and writes to `citizenScienceSubmissions`. Once all 3 are done a banner offers **Finish**, which calls `finishSession()` to mark `zooyard.sessionCompleted`/`totalPoints` and award the one-off +10 school bonus, then a `ZzDoneScreen`-style completion screen with `StudentFeedbackModal`.

### Student doc shape
`classes/{code}/students/{id}`, field `zooyard`:
```js
zooyard: {
  koala: {
    habitatPhotoUrl, unlockedAt,          // written the moment the photo lands: this is the UNLOCK
    completed: true, points, behaviour, detail, writing, quizCorrect, observation, updatedAt,
  },
  tiger:  { ... }, giraffe: { ... },
  sessionCompleted: true, totalPoints,
  citizenScience: { status: 'pending'|'approved'|'denied', photoUrl, note, submittedAt },
}
```
**Gotcha:** the per-animal write uses `updateDoc(ref, { [\`zooyard.${animalId}\`]: {...} })`, **not** `setDoc(ref, {...}, {merge:true})`. This matters: Firestore's `setDoc(...,{merge:true})` treats a dotted string key like `'zooyard.koala'` as a **literal field name containing dots**, not a nested path — it does NOT nest under a `zooyard` map. Only `updateDoc()` parses dotted keys as nested field paths.

**This exact bug was confirmed in production for ZooSnooz too (2026-07-23) and fixed.** `ZooSnoozScreen.jsx`'s two per-animal writes (`zoosnooz.{animalId}` badge data, and the later `zoosnooz.{animalId}.videoURL`/`videoCompleted` upload-completion write) used the same flawed `setDoc(...,{merge:true})` pattern — verified against real student documents showing literal top-level fields like `"zoosnooz.tiger"` instead of a nested map. Both call sites were switched to `updateDoc()`, live-tested end-to-end (joined the real "6t" class, completed Sun Bear, confirmed the resulting doc has a genuine nested `zoosnooz: { 'sun-bear': {...} }` map, confirmed `ZooSnoozAdminTab`'s clips list picks it up via the "primary" path). Existing pre-fix student documents keep their old flat dotted fields (harmless, untouched) — the admin analytics already had fallbacks reading `zzBadges`/`quizPercentage`/`zzTotalPoints` (written correctly and independently by `zzFinalSubmit` from in-memory state) for exactly this reason, so nothing was ever visibly broken; this fix just makes the "primary" per-animal path real again instead of always silently failing over.

### Photos — camera, required, and where teachers see them (2026-08-27)

Both ZooYard photo steps use **`components/PhotoCapture.jsx`**, a live `getUserMedia` camera with
preview, flip and capture — the same as every other student photo step in the app.

They previously used `<input type="file" capture="environment">`. **`capture` is only a hint**:
desktop ignores it entirely and mobile browsers honour it inconsistently, so students were being
dropped into their photo library. PhotoCapture falls back to a file picker if the camera cannot
start, which matters more here than anywhere — ZooYard exists *because* DoE devices behave
differently.

⚠️ **A canvas photo is a `Blob` and has no `.name`.** Both uploads derived the file extension from
`file.name`, so the camera change made every upload throw a TypeError into its catch block and
show "Could not save that photo". `photoExt()` now derives it from the MIME type. Probed while
diagnosing: `zooyardHabitats/`, `citizenScienceEvidence/` and `evolve/` are all writable and a
POST upload from localhost returns 200 — neither Storage rules nor CORS were involved.

**The self-attest photo is now REQUIRED**, reversing the earlier note that it was optional. It
uploads the moment it is taken ("Saving photo…" overlay), shows "✓ Photo saved", and only then
does "Yes, I'm ready" appear. A failed upload sends them back to the camera. Deliberate, at
Cameron's request — the file-picker fallback and upload retry soften it, but a student with
neither can no longer finish a habitat.

**Teacher side:** a **📍 Where students went** grid on class details shows every spot photo in the
class with student and habitat, click to enlarge. ZooYard runs with no GPS check, so these photos
are the only evidence anyone went outside — and the panel names students who finished without one
rather than letting a teacher assume.

### Dr. Cam in ZooYard (2026-09-26)

**A first-run instruction screen** (`ZooYardIntro`, local to `ZooYardScreen.jsx`): Dr. Cam, four
big steps, then a visually separate gold card saying the building is real.

- Gated on **both** a `localStorage` flag *and* no completed habitats, so a mid-session reload
  does not drop a student back on the welcome screen.
- The flag is keyed **per student** (`zooyardIntroSeen_{code}_{sid}`), not per device, because
  school tablets get shared and the next student still needs the instructions.
- ⚠️ The teaser says what the building **is** and deliberately does **not** frame the habitats
  as leading up to anything. Since 2026-09-28 every habitat ends in a build, so there is no
  final task to tease. Do not reword it back to "finish all three and X unlocks" — telling
  students the first tasks exist to unlock something else is a fast way to get them done badly.

**The helper bot on all eight working screens**, via the shared `StudentGuide` component with
ZooYard keys in `utils/studentGuideContent.js`: `zooyard`, `-attest`, `-video`, `-activity`,
`-written`, `-badge`, `-citizen`.

⚠️ **None of the pre-existing guide content works here.** It is all about walking to animals,
distances and GPS unlocking, none of which ZooYard has. The ZooYard answers keep pointing students
back outside at the real thing instead. The `-written` set also covers the two things the field
watch will actually produce: *"What am I looking for?"* and *"I cannot see anything"* (an empty
result is a real result, and students read it as failure).

The habitat picker is the **default return at the bottom of the file**, not a named `if` block —
it was the one screen missed on the first pass. Check it explicitly when adding anything global.

### Written feedback on the badge screen (2026-09-26)

`buildObservationScore` had always returned `overallFeedback` and per-domain `rationale`; ZooYard
computed it and threw it away, keeping only the three numbers. The badge screen now shows the same
**"What you did well" / "Next time, try to..."** pair as the daily `BadgeScreen` — strongest
domain becomes the praise, weakest becomes the next step.

- **The wording is ZooYard's own, not reused.** The daily science messages say things like "write
  down exactly what the animal is doing", which is quietly wrong when the task is describing a
  *place*.
- **Two tiers by stage.** ZooYard runs Stage 2 to Stage 5; "finish with a full stop" is right for
  a Year 3 and mildly insulting to a Year 10.
- **A stretch message when even the weakest domain is 4+.** The daily version tells a 5/4/5
  student to fix their weakest area, which reads as not having noticed how well they did.
- Below 3 there is nothing honest to praise, so it encourages the attempt rather than inventing a
  strength the student did not show.
- **"Behaviour" is labelled "Observation" on screen.** Display only; the stored field is unchanged.

### The write-up screen (2026-09-26)

The habitat video carries through from the attest screen, **blurred and darkened**, with the
writing on an opaque field-notebook card. Atmosphere at the edges, nothing moving behind the text
while a student types. Their photo is framed as a polaroid, the textarea is ruled like paper, and
the word count is a filling bar rather than a bare fraction.

⚠️ The ruled paper ties **28px rules, 28px line-height and 14px top padding** together, with
`background-attachment: local` so the rules scroll with the text. Change one and the text stops
sitting on the lines. The video is skipped entirely under `prefers-reduced-motion`.

**On the attest card**, the instruction is now the largest thing on screen, in its own tinted
panel. It used to be 0.95rem sitting *under* a 1.5rem habitat title — the one line a student has
to act on was the smallest text on the card, and kids skim instructions. Hence the split into a
short `selfAttestWhere` ("Go and stand next to a tree") plus supporting detail.

All student-facing ZooYard copy is **free of em dashes** (colons or full stops instead), matching
the Evolve house style. Code comments are exempt.

### Citizen science moderation (`citizenScienceSubmissions` collection)
```js
{
  classCode, studentId, studentName, teacherEmail, schoolName,  // denormalized at submit time
  program: 'zooyard', taskId: 'habitat-hero',
  photoUrl, note,
  status: 'pending' | 'approved' | 'denied',
  submittedAt, reviewedAt, reviewedBy,  // reviewedBy: 'staff' | teacherEmail
}
```
Rules: `allow read, write, delete: if true` — same open pattern as `challengeSubmissions` (staff portal is code-based, no Firebase Auth). Moderation split by UI, not database rules (matches the app's existing trust model):
- **Staff** (`ZooYardAdminTab` in `AdminDashboardScreen.jsx`, now **Programmes → 🌳 ZooYard**) can approve or deny any submission. Approving awards **+30 pts to the school leaderboard** (`schools/{schoolId}.totalPoints`), same pattern as `challengeSubmissions` approval — not a retroactive rewrite of the student's own record.
- **Teachers** (new section in `ClassDetailsScreen.jsx`, gated on `isZY = cls.sessionType === 'zooyard'`) can view their own class's submissions (query scoped to `classCode`) and **deny or delete** — no approve button rendered. This is a genuinely new capability; `challengeSubmissions` has no teacher-moderation precedent to compare against.

### The 3D zoo map (`components/ZooYardZoo3D.jsx`, 2026-09-28)

The habitat picker is a **GLB model of Taronga Zoo**, full screen, with a marker welded to each
habitat. Three earlier attempts are recorded so nobody repeats them: an abstract green island
(looked like nothing), the printed map tilted in CSS (better, still flat), and full-size cards
anchored in 3D (overlapped each other and hid behind hills when rotated).

**Why `@google/model-viewer` and not three.js.** Hotspots. It anchors slotted DOM to a 3D point
and tracks it as the camera moves, which is the entire feature, and it keeps every marker a real
`<button>` with a real label — a canvas-only approach would leave keyboard and screen reader
users with nothing. Camera orbit, clamping, lighting and tone mapping come free. It is
**dynamically imported**, so its ~290KB only reaches ZooYard students.

#### ⚠️ Regenerating the model — the recipe is not optional

33MB as delivered, shipped at **6.0MB**. Textures FIRST, then geometry:

```bash
gltf-transform webp  <in> tmp.glb
gltf-transform draco tmp.glb <out> --quantize-position 16 --quantize-normal 12 \
                                   --quantize-color 12 --quantize-texcoord 10 \
                                   --quantize-generic 16
```

- **Order matters.** Running `webp` *after* `draco` decompresses the geometry and blows it back
  out to 35MB.
- **The quantise flags are not optional.** Draco's defaults (position 14, normal 10) mean
  0.044-unit steps across a 717-unit zoo — enough to visibly wobble fence posts and roof trim.
  16-bit costs 189KB and is four times finer.
- **Never run `gltf-transform optimize`.** Its `simplify` and `join` steps flattened 225 nodes to
  4 and destroyed every named anchor, to save 228KB.
- Meshopt was tried: 4.1MB against Draco's 1.1MB unlit. Draco wins by a distance.

**Baked lighting costs ~5MB and that is NOT recoverable by compressing harder.** It rides on
per-face atlas UVs which have no spatial coherence, so Draco's prediction fails on them; dropping
UV precision from 12 to 8 bits saved only 240KB, and `weld` could not merge a single vertex. The
escape hatch, if the size ever bites, is asking for the lighting baked to **vertex colours**
instead of textures: same look, no UV atlas, and 198 fewer draw calls.

⚠️ **`public/draco/` is self-hosted on purpose.** model-viewer otherwise fetches the decoder from
a Google CDN at runtime, which is exactly the sort of request a school network blocks.

#### Downloading it once per device, ever (`utils/zooyardModel.js`)

HTTP caching cannot do this: GitHub Pages serves `max-age=600`, so a student returning after
lunch would refetch 6MB. The model goes through the **Cache API**, which survives reloads and
sessions regardless of host headers. Verified: warm read of the full 6.01MB in 1–2ms, zero bytes
transferred.

The loader is a **module-level singleton promise**, because the intro screen and the map are
different components that must share ONE request. Verified in a harness that a second caller
joins the first: **1 fetch, not 2**.

**The intro screen starts the download** while the student reads Dr. Cam's four steps, turning
dead time into a head start. The map's loading screen still appears if it has not finished, and
is seeded from the shared progress so the bar does not flash back to 0.

Progress comes from a **stream reader**, not model-viewer's `progress` event, which conflates
download with decode.

⚠️ **The object URL is deliberately never revoked.** It is shared between the intro and the map
and survives a student moving between habitats, so revoking on any one unmount breaks the next.
~6MB held for the session; the browser reclaims it on unload.

#### Markers, and the locks

`SPOTS` in the component holds a **3D coordinate per habitat**, read out of the GLB's scene graph
and keyed by animal id (not array position, so reordering `ZOOYARD_ANIMALS` cannot move a marker
to the wrong enclosure).

⚠️ **The model contains no koala exhibit** — nothing koala-named exists in it. That position was
derived from the printed map by interpolating between two things present in both (Corroboree
Frogs and the Hive, which sit either side of it), then checked to land inside `terrain_bushland`
so the marker stands on ground rather than floating.

#### Reading a position out of the GLB (2026-09-29)

**Every node's translation is zero** — the geometry is baked into the mesh vertices, so walking
the scene graph for transforms returns `0 0 0` for all 225 nodes and tells you nothing. A
position comes from the **centre of that node's POSITION accessor `min`/`max`**, with the marker
placed at the bounding box's **top y + 9**. That offset is not arbitrary: it is what the original
three already used (`animals_giraffes` tops out at y 65, its marker sits at 74), so a new marker
floats exactly as far above its exhibit as the existing ones.

⚠️ **Some nodes are merged meshes spanning the whole zoo, and their centroid is meaningless.**
`aviary_frames` and `aviary_mesh` look like the obvious way to locate an aviary and are a trap:
both hold *every* aviary as a single primitive, span x −176..220, z −114..109, and their centre
lands at (22, −3) — not an aviary at all, and sitting on top of the gorillas. **Check the
bounding-box size before trusting a centre.** To split one: round-trip through
`npx @gltf-transform/cli cp <in> <out>` (that decodes Draco), read the POSITION floats out of the
`.bin`, and grid-cluster in xz. That yields the nine separate aviaries.

#### ⚠️ Use the printed map, not a screenshot — the Blue Mountains Bushwalk took three attempts

Wrong twice before it was right, so do it this way:

1. ❌ **`backyard_to_bush`** — placed on an assumption that the zoo has no such exhibit. It does.
2. ❌ **`moore_park_aviary`** — the only *individually named* aviary, so it looked obvious. Wrong
   aviary. Also reached by fitting the camera projection from the existing markers and reading
   off a screenshot: that fit is fine *near* the markers and extrapolates badly, landing on the
   Wildlife Retreat lodges ~90 units out.
3. ✅ **The printed zoo map.** Render `tz-map-online.pdf` with `pdftoppm -r 200 -png`, then fit an
   affine map from map pixels to GLB xz on landmarks named in **both**: `function_centre`,
   `nocturnal_country`, `nura_diya_australia`, `tree_shelter`, `floral_clock_border`,
   `forest_adventure`. Residuals come in at **1–4 world units**.

**Validate the fit on a landmark you did not fit on.** This one solved the Function Centre
rotunda to (−183, 32) against the model's actual `retreat_pavilion_canopy` at (−185, 30), which
is what made the answer trustworthy rather than merely plausible.

The Bushwalk is the walk-through aviary beside that rotunda: **x −160..−145, y 52..64, z −1..10**,
marker at `-153 73 5`.

Three states: **locked** (slate disc + padlock, no animal photo), **unlocked** (animal photo,
habitat colour), **complete** (gold ring + tick).

#### Locks: proving where you are is the gate

Tapping a padlock raises a **sheet over the map**, not a separate screen — the zoo stays visible
behind it so the act reads as opening that enclosure rather than navigating away. The sheet
carries the big "go and stand next to a tree" instruction and the camera. A photo unlocks it, and
only then do the video and everything after become reachable.

Two things had to change for this to work, both worth knowing:

1. **The unlock had to persist.** The attest photo used to live in React state and only reach
   Firestore at badge time, so a student who photographed their spot and reloaded found the
   padlock back on. `onAttestPhoto` now writes `habitatPhotoUrl` and `unlockedAt` immediately,
   and the resume path loads them for **all** habitats rather than only completed ones.
2. ⚠️ **The badge write was assigning a whole `zooyard.{id}` object**, which replaces the map.
   Harmless while the photo was decorative; now that the photo IS the unlock, it would re-lock a
   habitat the student had earned. Converted to individual dotted fields — the same rule recorded
   for Evolve and ZooSnooz.

#### Layout

The zoo **is** the screen: `position:fixed; inset:0`, with the header floating over a gradient
scrim rather than sitting in a band above it. The scrim is `pointer-events:none` so a drag
started up there still swings the zoo; the name pill and points chip re-enable events on
themselves.

⚠️ There is a **card-grid fallback** if the model or model-viewer fails to load. It is not a
nicety: a 6MB GLB plus a WASM decoder is a lot to ask of a locked-down school device, and a
student who cannot render it still has to be able to pick a habitat.

### ZooYard — known gaps

⚠️ **It has never been run.** As of 2026-09-26 Firestore holds **one** ZooYard class (`A3BKK5`,
"TEST09", one student), zero completed habitats, zero finished sessions, and one pending Habitat
Hero submission. Everything above is built and unverified in the field. The two-minute watch in
particular needs a real class before it is trusted: it records nothing, so it is the easiest step
in the mode for a student to stand through without actually looking.

1. **The videos are still `videoUrl: null`** on all three animals, so every student hits "Video
   coming soon", now on all eight habitats. They have a clear job: each must set up the one
   quality that habitat is about, so a student knows what they are walking out to look for.
   That is the single highest-value missing asset.
   ⚠️ Do not confuse this with `ZOOYARD_HABITAT_THEME[x].videoBg` — those three files in
   `public/videos/` exist and are the ambient habitat backgrounds, a different thing. They are
   also heavy (savannah 3.5MB, bushland 2.8MB) for a school network with a class on it at once.
   ⚠️ They are also now **only used on the write-up screen**, since the habitat picker is the 3D
   model rather than a video-backed card list.
2. **No curriculum outcomes anywhere.** ZooYard is the only mode with nothing to show a teacher:
   no info sheet, nothing on Curriculum Alignment. ⚠️ This got **harder** on 2026-10-01: the
   measurement was what would have supported a Working Scientifically *data* claim, and it is
   gone. The defensible claim now is observation and conservation action rather than data
   collection. Worth settling before the mode is sold to a school on its outcomes.
3. ~~**Stage 1 has no content.**~~ **CLOSED 2026-09-28** — all three animals now carry a stage 1
   writing prompt, so the silent fallback to Stage 4 wording is gone.
4. Three animals and **one MCQ each** is still thin next to Evolve's five chapters or Wildest
   Dreams' eight stops. The observe → measure → build → write flow lengthened each habitat
   considerably, so this is less pressing than it was.
5. **Nothing persists a half-finished habitat.** `zyPhase` is local state, so a student who
   reloads after building but before writing returns to the map and re-enters that habitat from
   the video. Harmless today because a habitat is one sitting; it would matter the moment
   anything spans lessons.
6. **Teachers cannot see the dataset.** `habitatObservations` is written and nothing reads it.
   A staff-side view of readings across schools is the whole reason it is de-identified and flat.
7. ⚠️ **The scorer marks the five new habitats harshly at Stage 5, and this is measured, not
   suspected.** Scoring a strong, on-topic answer for each (2026-09-29):

   | Animal | Stage 3 behaviour | Stage 5 behaviour |
   |---|---|---|
   | blue-mountains-bushwalk | 4 | **2** |
   | sea-lion | 5 | **2** |
   | chimpanzee | 3 | **2** |
   | gorilla | 3 | **2** |
   | rhino | 5 | 5 |

   This is fault #1 in the Scoring System section: the new prompts are about litter, drains,
   vertical layers and plant variety, and those animals' vocabulary lists do not contain those
   words. **It is not purely new content** — the pre-existing giraffe does the same thing (5 at
   Stage 4, **2** at Stage 5), so there is a Stage 5 behaviour path worth looking at on its own.
   Fixing it means widening the per-animal word lists and re-verifying across every stage and
   subject, which is its own piece of work. Do not tune thresholds; score real text first.
8. **No teacher control over which habitats run.** See the warning on eight habitats above.

### Class details / GPS panel
`ClassDetailsScreen.jsx` gates the GPS toggle panel and the old daytime "Class Insights" (badge-array-based analytics) with `!isZY` — both are meaningless for ZooYard (no GPS check ever happens; badges live under `zooyard`, not the shared `badges` array). Stat cards get a ZooYard-specific branch: Students / Avg Points / Habitat Badges / Completed, reading `student.zooyard?.totalPoints`/`sessionCompleted`/`{animalId}.completed`. Note **Avg Points only reflects fully-submitted sessions** — `zooyard.totalPoints` is written once, at citizen science submission, not incrementally per animal, so an in-progress student shows 0 there even after earning badges.

---

## Evolve — Deep Reference

Evolve is a **Stage 6 (Year 11/12) twilight excursion** at Taronga Sydney, built to support the
mandatory Life Ready course. It is a reflection on leaving school, not a quiz mode.

**It is deliberately unlike every other mode: no points, no badges, no marks, no leaderboard,
no quizzes.** The writing is a memento the student keeps. Don't "improve" it by adding scoring.

### How a class becomes Evolve
`CreateClassScreen.jsx`: teacher picks location **"Taronga Sydney — Evolve (Stage 6)"**
(`value="evolve-sydney"`) → `sessionType: 'evolve'`, `subject: 'life-ready'`, `stage: 6` forced.
**Both the stage and subject pickers are hidden for Evolve** — it is Stage 6 by definition, and the
stage dropdown only ever offered Stages 1–5, so an Evolve class could never have been given the
right stage. Classes created before 2026-08-17 may carry the wrong stage (the `GAGA` test class is
Stage 4). Nothing in Evolve reads stage — the chapters are not stage-differentiated — so it is
cosmetic, but it shows wrong in staff analytics.

### The five chapters (`src/data/evolveAnimals.js`)
Each animal is a chapter in one narrative, and the metaphor is earned by the animal's real
behaviour, not decoration. The arc is **directional, not chronological** — forward (what I carry
with me), outward (what I owe), back down the path (advice to those still on it), home (who raised
me), onward (where I go):

| # | Animal | Chapter | Why |
|---|---|---|---|
| 1 | Kangaroo | Forward only | Physically cannot hop backwards |
| 2 | Koala | What I owe | Survival depends on human choices — **the pledge chapter** |
| 3 | Giraffe | The long view | Other animals watch giraffes for early warning — **the Advice Wall chapter** |
| 4 | Lion | Who I looked to | Cubs are raised by the whole pride and learn by watching |
| 5 | Tiger | The territory ahead | Marks and re-walks its territory until the ground answers to it |

The order follows the **walking route** through the zoo (~100m between each), not a timeline —
a student cannot reorder a zoo. That makes the arc directional rather than chronological:
forward, outward, back down the path, home, onward. It also puts lion immediately before
tiger, so the last two chapters run "no lion is raised by one animal" into "at two, a tiger
walks out alone". Do not reorder without walking the route.

`order` fixes the story sequence. Students unlock chapters by GPS in whatever order the zoo
allows, but `EVOLVE_STORY_ORDER` means **the film is always assembled in narrative order
regardless of filming order.** Capture order and story order are deliberately independent.

⚠️ **Kangaroo still has no coordinates.** The photo now exists (`/images/kangaroo.jpg`,
added 2026-08-13), but `latitude`/`longitude` are still `null` and it has no real map pin —
both need capturing on site (Australian Walkabout). Null coords mean that chapter unlocks
*without* a proximity check rather than becoming permanently unreachable.

Lion/tiger/giraffe/koala coordinates are lifted from `src/data/animals.js` so Evolve matches the
daytime map exactly.

### The map screen — a winding trail, not a list
The chapter list is drawn as a **route on a map**: a gold path winding down its own gutter with
a waypoint at each bend, solid behind you and dashed ahead (the standard cartographic
convention). Non-obvious bits, all load-bearing:

- **Each stop draws its own leg of the path**, entering and leaving at the horizontal centre of
  the gutter, so consecutive legs always join no matter how tall a card is. No measuring, no
  fixed row heights, no JS watching layout.
- Every path carries **`pathLength="1"`**, which normalises dash lengths and offsets to
  fractions of the leg. That is what lets the flow pulse and the draw-on-complete work at any
  card height.
- Waypoints are positioned as a **percentage of the gutter**, so the trail rescales on a phone
  (gutter 104px → 62px) with nothing to recompute.
- Each stop lights the path **through its own row** — half a leg above, half below — so two
  finished neighbours meet exactly on the row boundary and read as one continuous line with no
  extra work. Since chapters can be done in any order a lit run can stop mid-trail, so loose ends
  fade into the dashes; an island then reads as "I have been here" rather than a broken path, and
  the fade vanishes the moment a neighbour joins it.
- **The arrival runs in sequence** (2026-09-24): a bright head travels the leg, the line draws in
  behind it, and only on landing does the node pop and the tick appear. It used to run backwards —
  the node went gold on a 0.3s transition while the line took 1.1s to reach it. One `--ev-walk`
  variable on `.ev-trail` drives all of it so the parts cannot drift. The `ev-land` keyframe for
  the pop had been written when this was first built and never wired to anything.
- `justLit` is cleared ~1.7s after an arrival. Without that the just-drawn leg kept the `draw`
  flag forever and `{lit && !draw && <flow>}` left it as the one leg missing the shimmer.
- Finishing a chapter sets `justLit` to **that chapter's own index** — or to
  `EVOLVE_CHAPTERS.length`, lighting the leg to the film, if it was the last one outstanding.
  It used to be the *next* index, which only made sense while the walk was forced into order.
- Cards are a **fixed 146px** with the title clamped to two lines, so the five read as one set.

The palette is a **cool sky over a warm horizon** — deep indigo at the top through violet to
amber at the bottom, with the film's destination sitting in the horizon glow. An all-orange
twilight was tried first and reads as sepia, and leaves the gold accent nothing to sit against.
`evolveFilm.js`'s `drawBg()` mirrors this gradient so the film matches the map.

### Flow
`sessionType: 'evolve'` short-circuits in `App.jsx` to `EvolveScreen.jsx`, which sub-routes on
`evScreen` (`map | chapter | film`) in AppContext. Per chapter: **insight → watch → write →
record → preview**.

- **insight** is one big photo and one short idea, nothing else. The "what to look for" line
  deliberately lives on the next screen, where it is actually needed.
- **watch** is a 60-second dial. It replaced a typed "what did you see" step, which was asking
  students to write about the same animal twice. A quiet "Skip the timer" exists because thirty
  students on a schedule cannot always stand still for five minutes.
- **write** takes `chapter.minWords` (default `EVOLVE_MIN_WORDS`, 40).
- **Every chapter opens its writing step with a short first-person `writeLead`** set in the
  Taronga face — *I'm leaving · I will · I wish I'd known · I learned · I want* — which the
  student completes. The saved value includes the lead, so downstream reads a whole sentence
  rather than a fragment.
- `isPledge` (koala only) additionally uses a much lower `minWords`, labels the button
  "Make this my pledge", and shows the finished sentence back on the record screen to read
  into the lens. Watch it, write it, say it. The other four film prompts ask a *different*
  question than the writing did, so they deliberately do not recite the text back.

Student data lives at `classes/{code}/students/{id}` under `evolve`:
```js
evolve: {
  lion: { completed, observation, reflection, chapter, order, clipURL, updatedAt },
  kangaroo: {...}, tiger: {...}, giraffe: {...}, koala: {...},
  filmURL, sessionCompleted, completedAt,
}
```
Per-chapter writes use `updateDoc` with dotted keys — **not** `setDoc(...,{merge:true})`, which
would create a literal field named `"evolve.lion"`. Same trap as ZooYard and ZooSnooz.

⚠️ **Write individual dotted fields, never a whole `evolve.{id}` object.** Assigning the object
replaces the map and destroys `clipURL`, which the upload has already written by the time the
student can leave the chapter. This regressed once: it was masked while students could tap past
a still-uploading clip (the URL landed after the save), and only appeared when the upload gate
forced the save to happen last. Every chapter completed with its clip silently unreferenced.

On submit a keepsake record is written to `evolve_docs/{classCode}_{studentId}` holding the film
URL and every reflection. Nothing reads it yet — that's the souvenir-link/export surface.

### `src/utils/evolveFilm.js` — the stitching pipeline
See **Video & media pipeline** above — that section governs both ZooSnooz and Evolve and contains
every rule worth knowing. In short: a deliberate copy of ZooSnooz's pipeline, portrait 720×1280 at
2.5 Mbps, rAF-with-timer-watchdog draw loop, Screen Wake Lock held for the duration, and a
low-framerate warning so silent picture loss can't happen unnoticed again.

### Writing and filming steps
- **Every chapter opens with a `writeLead`** in the Taronga face that the student completes —
  *I'm leaving · I will · I wish I'd known · I learned · I want*. The lead is **saved with the
  response**, so the film, exports and the Advice Wall read a whole sentence, not a fragment.
  All five share one gold `.ev-write` panel that lights up when the response is valid.
- **`reflectionPrompt` may be a string or an array.** As an array, the first item renders bold and
  centred as the idea, and the rest as quieter paragraphs beneath. All five are arrays; they were
  split only at existing sentence boundaries, which is why the counts vary (2 or 3 parts).
- **`EVOLVE_MIN_WORDS` is 10** (was 40, then 12) — these are reflections, not essays. The counter shows
  `n / 10 words` while short and just `n words` once met, so a low floor doesn't read as the target
  and invite everyone to stop at exactly twelve. `chapter.minWords` can override per chapter.
- **The camera step leads with the personal ask, then `filmLink`** — "Then link it back to the
  lions: no lion is raised by one animal." An earlier version put a scripted opening line *first*;
  it was dropped because five students reciting the same sentence would be repetitive in a class
  screening.
- **Filming is portrait** — see the Video & media pipeline section.
- **The insight text is centred**, and **all student-facing Evolve copy avoids em dashes**
  (2026-08-20, Cameron's house style). Colons, semicolons or full stops instead. This covers
  `evolveAnimals.js`, `EvolveScreen.jsx`, the pledge sheet titles and the film's outro card in
  `evolveFilm.js`. Code comments were left alone.

### Upload gating, and what survives no reception

A student **cannot leave a chapter until its clip is fully in Storage** — the button reads
"Waiting for your clip…" and is disabled until the upload reports `done`. On failure they get
"Try saving again", which re-uploads the blob held in memory (no re-filming); there is
deliberately no skip.

**The writing no longer rides on that gate** (2026-09-17). It used to: `saveChapter` ran after the
upload, so with no signal the reflection sat in React state beside a blob in a ref and *neither*
was persisted. A reload, or a phone evicting a backgrounded tab, lost the student's writing as
well as their film. Now the reflection is kept in `localStorage` as they type (debounced, keyed
`evolveDrafts_{code}_{studentId}`) and pushed to Firestore when they leave the write step, and
restored from either on resume. `completed` still sits behind the clip gate.

⚠️ **The early write uses individual dotted fields only**, and its `setDoc` fallback relies on
deep-merge. Writing a whole `evolve.{id}` object replaces the map and destroys `clipURL` — that
regression has happened here before. Restoring also runs `stripLead`, because a stored reflection
already carries its lead but the textarea holds only the body.

**What is still fragile: the clip itself.** It lives in page memory only — there is no IndexedDB
and no retry-on-reconnect. It survives exactly as long as the tab does, which is why the failure
message says "safe as long as you keep this screen open" rather than the older, shorter, and
misleading "your recording is still here". Practical workaround for an excursion: a teacher
hotspot at the enclosure beats walking a student to wifi, because the app must stay on screen the
whole way. The real fixes, unbuilt: store clips on the device, and upload automatically when the
connection returns.

### Teacher view — deliberately just a table
Evolve has no points, badges or scores, so `ClassDetailsScreen` hides the stat cards **and**
Class Insights when `sessionType === 'evolve'` (`isEV`). What is left is one table: student,
pledge, film, and the same Restore/Delete actions as every other mode. Do not add stat cards
back — there is nothing numeric to report.

- **Pledge → View** opens all five reflections with the pledge highlighted, not just the pledge.
  Showing only the pledge would leave the other four pieces of writing unreachable.
- **Film → Watch** plays the stitched film in a portrait player, with an open-in-new-tab link.

### The stitch screen (`BuildingFilm` in `EvolveScreen.jsx`)
The film takes ~45s to build. The screen is centred in the viewport and reuses the **same dial as
the 60-second watch screen** — by then a student has watched that circle fill five times and it
already means "wait here, this is part of it". `buildEvolveFilm` has always passed a chapter index
as `onProgress`'s second argument; it now lights the five chapter titles one at a time from it.
`filmChapters` must match the stitcher's internal `clips` filter or the checklist names the wrong
chapter. The glow breathes because the percentage sits still for seconds at a time while a clip
plays through in real time, and a frozen number reads as a crashed app.

### Certificates (`src/utils/evolveCertificates.js`)
`openEvolveCertificates(cls, students)` builds a self-contained HTML document, opens it in a new
tab from a blob URL, and lets the teacher print it or save it as a PDF — the same pattern as
`teacherInfoSheet.js`. **No PDF library.** One landscape A4 certificate per page, so a sheet can
be handed to a student or pinned up; pass a single-item array to print just one (that is what
the per-student buttons do).

`students` is `[{ name, reflections }]`, where `reflections` is `{ [chapterId]: 'full text
including its lead' }`.

**It carries all five chapters, each under its own sentence starter** (rewritten 2026-08-23). It
used to print only the koala pledge, so every certificate read "I will" and threw away four fifths
of what the student wrote. The starters differ per animal — "I'm taking with me", "I will", "I wish
I'd known", "I was shaped by", "I want" — and the certificate shows all of them in walking order.

⚠️ **A stored reflection already carries its lead.** `EvolveScreen` saves `${writeLead} ${body}`,
and the certificate prints the lead itself in gold — so printing the reflection raw said it twice
("I will / I will plant something…"). That shipped in every certificate ever printed before
2026-08-23. `stripLead` removes it, falls back to the original if stripping would leave nothing,
and is `\b`-anchored so "I willow trees matter" is not mangled. **Anything else that renders a
reflection next to its lead needs the same treatment.**

Two columns, because a single column across 262mm gives unreadable line lengths. The lead runs
**inline** with the writing so it reads as the student wrote it, not as a label above a quote.
Checked against deliberately long reflections: five chapters plus the signature block fit one
landscape A4 with room to spare.

Renamed from `evolvePledgeSheet.js` / `openEvolvePledgeSheet` when it stopped being pledge-only.

Printed on warm cream rather than Evolve's twilight palette on purpose: a dark page eats toner,
school printers make a mess of it, and browsers strip backgrounds by default. The one dark
element is the seal, because the Taronga logo is a white lockup that vanishes on cream.

Students are attributed by their **animal alias** — Evolve stores no real names.

### Souvenir route — the NFC link (built 2026-08-20)

`?doc=ev_{classCode}_{studentId}_{token}` → `DocumentaryViewer.jsx`, which reads
`evolve_docs/{classCode}_{studentId}` and renders the student's film plus all five reflections in
Evolve's twilight palette. About **58 characters**.

**Why not just put the Storage URL on the tag** (the way ZooSnooz tags do):

1. A Firebase download URL is **~200 characters and does not fit an NTAG213** (144 bytes), the
   cheap sticker most people buy. NTAG215/216 fit. This alone may explain past failed writes.
2. It is **frozen to one file and one access token**. Re-stitch the film, move it, or revoke the
   token and every tag already handed out is dead. The souvenir link resolves through Firestore,
   so the tag survives the file underneath changing.
3. It drops the visitor into a raw video file rather than a page Taronga controls.

**The token is what makes shortening safe.** Without it the URL is trivially guessable — six
character class codes and aliases from a short list — so anyone holding one tag could walk a whole
cohort's films and reflections. 8 base36 chars (~41 bits) from `crypto.getRandomValues`, generated
in `EvolveScreen.jsx`'s `submitFilm`. **Re-submitting reuses the existing token** so tags already
written stay valid, and the viewer **refuses a doc with no token at all**.

`parseDocCode` takes the class code from the **left** and the token from the **right**, because
`safeStudentId` only strips `\ / # . $ [ ]` — it leaves underscores and spaces, so a "Sugar_Glider"
alias would break a naive `split('_')`.

`SOUVENIR_HOST` in `EvolveFilmsTab` is **hard-coded to `https://tarongatracka.com.au`**, not
`window.location.origin`. Staff browsing the portal from localhost would otherwise copy a localhost
link onto a physical tag handed to a student — unfixable afterwards. If the domain ever moves, that
line moves with it, and tags already written keep pointing at the old address regardless.

Existing docs were backfilled by `zz-evolve-tokens.mjs` (untracked, repo root). It skips docs that
already have a token, so it is safe to re-run and never invalidates a written tag.

### ⚠️ The URL sync will strip `?doc=` if you let it

`AppContext.jsx`'s screen-sync effect writes `screenToPath(currentScreen)` — a **bare path with no
query string**. Without a guard it rewrites `/?doc=ev_…` to `/map` on first render. **The page still
renders**, because `docViewCode` is already in memory, so this looks completely fine and is not: a
reload, bookmark, back button or shared link then lands on "Code not found".

For an NFC tag that is the entire point lost — a student taps it, and taps it again a year later.
The effect now returns early while `docViewCode` is set, with `docViewCode` in its dependency array
so dismissing the souvenir hands the URL back to the normal sync.

**Any future work touching that effect must preserve this.** Test by opening a souvenir link and
**reloading the page**, not just by looking at it.

### Writing tags from the app — parked until devices are on hand (2026-08-20)

Today the workflow is: copy the souvenir link from the staff portal, paste into **NFC Tools**,
write the tag. Web NFC (`NDEFReader.write()`) could remove that middle step and write the tag
straight from the portal. **Parked, not rejected** — Cameron wants to test on the real devices
first. Now a small job, because the link is already short and stable.

**The devices will be Oppo phones**, i.e. Android, so this is possible in principle. iOS is a hard
no and always will be: Safari has no Web NFC, and Apple restricts tag writing to native apps via
Core NFC, which is why NFC Tools exists as an app at all.

Three things must be true, only one of which is genuinely unknown:

1. **The phone has NFC hardware.** The real unknown. Many budget Oppo **A-series** models omit NFC
   entirely; **Reno** and **Find** series generally have it, and it can vary by region for the same
   model number. **If those phones already write tags with NFC Tools, this is settled** — the
   hardware is there.
2. **Staff use Chrome.** Web NFC is Chrome-for-Android only. Oppo's built-in browser is
   Chromium-based but does not reliably ship the API; Firefox for Android does not support it.
3. **Android 8+.** Any Oppo in service passes this.

Do not assume a school-managed device will allow it — DoE devices already block geolocation, which
is the entire reason ZooYard exists.

**Start here when the devices arrive:** add a feature-detect line to the Evolve tab
(`'NDEFReader' in window`) reading "Tap-to-write available on this device" or "Not available — use
Copy link and NFC Tools". Opening the portal on one Oppo then answers the question in seconds, and
it is worth keeping permanently so staff are not hunting for a button that cannot appear on their
device.

Then: feature-detected write button, Copy link staying as the fallback. `makeReadOnly()` can lock a
tag so a student cannot overwrite their own — permanent, so it would need a confirm.

### Advice Wall (`evolveAdvice`) — data only, no UI yet
The giraffe chapter's reflection is also written to `evolveAdvice` with
`{ classCode, chapterId, advice, cohortYear, status:'pending', submittedAt }`.
**Attributed by cohort year, never by student name** — it is written by 17-year-olds and intended
for 12-year-olds. Staff moderation and the wall itself are not built yet. Because Wildly shares
this Firestore project, one collection can serve both products.

---

## Wildest Dreams — Deep Reference

A **video-first** mode for diverse learners, particularly school support units. Built 2026-09-07
onwards under a strict additive-only brief: nothing about any existing mode was to change.

**It is deliberately unlike every other mode: no quiz, no score, no marks, no badges, no
leaderboard, no timers, and no required writing OR speech.** The film is the whole output. Do not
"improve" it by adding scoring — that is the entire point of it.

### Where it lives
Everything is under `src/modes/wildest-dreams/` — the only mode not in `src/screens/`:

```
src/modes/wildest-dreams/
├── index.jsx              # sub-router: welcome | stops | watch | choose | film | building | done | leaving
├── content.js             # EVERY string, stop, prompt, soundboard item, outcome. Edit ONLY this for content.
├── film.js                # its own stitcher (a copy of evolveFilm.js, adapted)
├── speech.js              # recorded-clip + speechSynthesis layer — see "Audio & speech"
├── infoSheet.js           # teacher information sheet (house printable pattern)
├── wildestDreams.css      # every selector prefixed .wd-*, scoped under .wd-root
└── components/            # Shell, BigChoice, Soundboard, Recorder, OutcomesPanel
```

Plus `public/voice/*.m4a` (22 clips) and `scripts/generate-wd-voice.sh`.

### The four files outside the mode that were touched
Additive registration only. Every existing mode behaves identically.

| File | Change |
|---|---|
| `App.jsx` | `if (sessionType === 'wildest-dreams') return <WildestDreamsScreen />;` |
| `CreateClassScreen.jsx` | `isWildest` flag, a location option, `subject: null`, and its own outcomes panel |
| `CurriculumAlignmentScreen.jsx` | a **Programs** sidebar group rendering `OutcomesPanel` |
| `ClassDetailsScreen.jsx` | (Evolve notification button — unrelated, same session) |
| `storage.rules` | additive `wildestDreams/` block |

`CurriculumAlignmentScreen` keeps `subjectId` as a real subject always and tracks the program in a
separate `programId`, so every existing lookup on that screen is untouched.

### How a class becomes Wildest Dreams
`CreateClassScreen.jsx`: location **"Taronga Sydney — Wildest Dreams"**
(`value="wildest-dreams-sydney"`) → `sessionType: 'wildest-dreams'`, `subject: null`, subject
picker hidden. **The stage picker stays visible** (Stages 1–5) and drives the outcomes shown.

### The flow
Welcome → pick an animal → Watch → Choose → Film → Keep/Record again → next animal → Make my film.
Screen state is **local to `index.jsx`**, not AppContext — nothing outside the mode needs it, which
is why AppContext required no change.

Eight stops, all in `WD_STOPS`: koala, kangaroo, giraffe, chimpanzee, lion, gorilla, rhino, tiger.
**No GPS and no proximity check** — a support unit moves as a group and a student must never be
blocked from filming because a signal put them 30m away. Any order, any of them skippable.

**Animal sounds** are real recordings (`/images/sound-{id}.mp3`) played from the Watch screen.
Kangaroo and rhino have no file, so the button is **hidden** for them rather than shown doing
nothing. A button that plays nothing teaches a student the button is broken.

### Student data
`classes/{code}/students/{id}`, field `wildestDreams`:
```js
wildestDreams: {
  koala: { clipURL, caption, filmedAt },
  ...,
  filmURL, completedAt,
}
```
Per-stop writes use `updateDoc` with dotted keys, with a `setDoc` merge fallback for the first
write — same Firestore dotted-key trap as ZooSnooz/ZooYard/Evolve.
Storage: `wildestDreams/{code}/{sid}/{stopId}.{ext}` and `.../film.{ext}`.

### Accessibility decisions that are load-bearing
Every one of these is a fix for something real. Do not undo them casually.

- **72px minimum targets**, one idea per screen, no timers anywhere, everything skippable.
- **Focus moves to the heading on every screen change** (`tabIndex={-1}`, programmatic so
  `:focus-visible` does not fire). Without it a screen reader user is dumped to the top of the
  document and a switch user's scan restarts — the classic SPA accessibility bug.
- **Selection is never colour-only.** Soundboard toggles carry a tick (WCAG 1.4.1).
- **`aria-pressed` only on real toggles.** The focus prompts navigate immediately, so the state
  could never be observed; they are plain buttons.
- **Progress dots count animals FILMED, not list position.** They used to count position, so
  filming the last animal first lit every dot and announced "Stop 8 of 8" — telling a student they
  had finished after one. The animal in progress is a ring, so "doing" never reads as "done".
- **The soundboard sits directly under Start recording, at full strength.** It was a quiet link
  below the camera, flip control and skip — the students the mode exists for had to scroll past
  the speaking-student interface to reach the part built for them.
- **Up to `WD_MAX_SOUNDS` (3) soundboard words per clip**, combined with the focus choice rather
  than replacing it.
- **Errors are spoken**, and leaving uses an in-page screen rather than `window.confirm`.

### Outcomes (`WD_OUTCOMES` in content.js)
Two NESA facts, both checked against the syllabus rather than assumed, and both of which look like
bugs if you do not know them:

1. **NSW Science Life Skills outcomes exist for Years 7–10 ONLY.** There are none for K–6 —
   primary students in support units work towards the ordinary Science and Technology K–6 outcomes
   with adjustments. Stages 1–3 therefore carry the K–6 codes with a note saying so.
   **Do not "complete the set" by inventing ST\*LS codes; they do not exist.**
2. **The Years 7–10 Life Skills outcomes are ONE set spanning Stage 4 and Stage 5**, not two.
   Stage 5 is aliased off Stage 4 in code so they cannot drift, and the UI states it.

Surfaced on Create Class and on Curriculum Alignment → Programs → Wildest Dreams. Both use a
**separate panel**, not the four-subject layout, because that layout carries "minimum words",
"points per observation" and a marking rubric — none of which exist here.

### Known gaps / next pieces
- **Emoji are not a symbol system.** 🔎 for "What I notice" means *search* to most people and
  nothing to a student on PODD, PCS/Boardmaker, Compic or Widgit, and renders differently per OS.
  **This is the biggest remaining accessibility barrier.** Needs a decision on which symbol set
  the schools actually use before it can be built.
- **No first-then structure within a stop, and no transition warning.**
- **The film says "A film by Quoll"** — `studentName` is the join-screen alias. Evolve does that
  deliberately for privacy of reflections; here the student's face is already in every clip, so
  the anonymity buys nothing and costs the personalisation. Left as-is on privacy grounds
  (decision 2026-09-11).
- **The film has no captions of what the student says** — it captions the chosen prompt only, so a
  Deaf viewer at a class screening gets the label, not the content.
- ~~**No souvenir route.**~~ ✅ **BUILT 2026-10-02.** `?doc=wd_{classCode}_{studentId}_{token}`
  resolves through `wildestDreams_docs/{classCode}_{studentId}`, the same shape and trust model
  as Evolve's. The done screen now shows the link in plain text plus a copy button.
  ⚠️ **"Save my film" alone was never enough** — it downloads to a borrowed school tablet that
  gets wiped. The link is what a student, teacher or parent can actually keep.
  ⚠️ The token is reused if one already exists: re-making a film must never invalidate a link
  already handed out.
  **Still missing:** no teacher/staff view of the films — nothing in `ClassDetailsScreen` or the
  staff portal reads `wildestDreams`.
- **No still-photo alternative** for a student who will not tolerate video.
- **No recording length limit** — an eight-minute clip is a slow upload on zoo wifi.

---

## Assessment Ideas & AT Notifications

`AssessmentIdeasScreen.jsx` (screen: `assessmentIdeas`, launched from `teacherDashboard`) gives teachers two things per subject/stage: **in-app evidence** (what Tracka already captures — quiz + observation) and **post-visit tasks** — a curated bank of 20 hand-written tasks (5 per subject × 4 subjects: science, maths, english, pdhpe) defined in `POST_TASKS` inside the screen file.

Each task in `POST_TASKS` carries:
- `title`, `stages`, `format`, `desc`, `appLink` — the task card shown in the UI
- `steps` — 4–6 numbered "What You Need To Do" instructions, student-facing, unique per task
- `criteria` — 3 task-specific assessment criteria
- `marking` — 5 grade descriptors (A–E) unique to the task
- `resources` — a resources list unique to the task

**`assessmentTaskNotification.js`** (`openAssessmentTaskNotification(subject, stage, taskType, taskData)`) generates a printable, branded HTML document opened in a new tab (blob URL, same pattern as `teacherInfoSheet.js` and `TeacherGuideScreen.jsx`'s PDF export).

- `taskType: 'in-excursion'` → generic per-subject quiz+observation document (Part A quiz / Part B written, using `CRITERIA`/`MARKING_IN_EXCURSION`/`IN_EXCURSION_DESC` lookup tables).
- `taskType: 'post-visit'` → **unique document per task**, built entirely from `taskData` (the specific `POST_TASKS` entry): task description, "What You Need To Do" steps, task-specific criteria, and a single A–E marking table out of 25 marks — **no quiz/Part A structure at all**, since post-visit tasks aren't quiz-based.

**Gotcha:** these are two structurally different documents (excursion = two-part quiz+written; post-visit = single task, single mark scheme). Don't assume they share a template beyond the shared header/footer/declaration/feedback sections.

---

## Pre/Post-Visit Lessons — Canva Embed Links (replaced the old in-app slide decks, 2026-07-19)

The old 32 in-app slide decks (`src/data/slideDecks.js` + `SlidePlayer.jsx`) were **removed entirely**. Cameron builds the actual lesson content himself in Canva; the app now just stores and surfaces Canva share links.

- **Firestore collection**: `prePostLinks/{subject}_{stage}_{timing}` (e.g. `science_4_pre`) — fields: `subject`, `stage`, `timing` (`'pre'|'post'`), `title`, `description`, `canvaUrl`, `updatedAt`. Rules are open read/write (`firestore.rules`) since the staff portal is code-based with no Firebase Auth, same pattern as other staff-managed collections.
- **Admin side**: `PrePostLinksTab` in `AdminDashboardScreen.jsx` (now **Manage → Pre/Post Lessons**). One row per NSW stage (2–5) × subject tab, each row has Pre-Visit / Post-Visit mini-forms (title, description, Canva URL, Save). Saving with a blank URL deletes the Firestore doc — that's the mechanism that hides a subject/stage from teachers.
- **Teacher side**: `ResourceHubScreen.jsx` fetches `prePostLinks` on mount and only renders cards for docs that have a non-empty `canvaUrl` — teachers never see a subject/stage until Cameron has saved a link for it. Filter pills (When/KLA/Stage) are derived from whatever lessons actually exist, not a fixed list.
- **Presenting**: clicking a card opens `CanvaEmbedPlayer` (bottom of `ResourceHubScreen.jsx`), a full-screen overlay with an `<iframe>`. `toCanvaEmbedUrl()` in `src/data/subjectMeta.js` appends `?embed` (or `&embed`) to the saved Canva share link if not already present — Canva's iframe embed requires that param. There's also an "Open in Canva ↗" link in the overlay header as a fallback.
- **Shared metadata**: `src/data/subjectMeta.js` holds `SUBJ_META` (subject colors/labels), `STAGES`, `prePostDocId()`, `toCanvaEmbedUrl()`, and `IMAGE_LIBRARY` (curated list of existing `public/images/*` photos, grouped by category) — imported by both the admin tab and the Resource Hub so subject styling stays consistent.
- **Card image picker**: each Pre/Post entry in the admin tab has an optional `image` field (stored on the `prePostLinks` doc) chosen from `IMAGE_LIBRARY` via a thumbnail grid picker (no upload — just existing on-file assets). If set, `LessonCard` in `ResourceHubScreen.jsx` renders it as the card's background photo instead of the plain subject-color gradient. To add a new pickable image, just add an entry to `IMAGE_LIBRARY` in `subjectMeta.js` pointing at a file already in `public/images/`.
- **`IMAGE_LIBRARY` has 3 categories**: "Mission Animals" (the app's own `/images/{animalId}.jpg` assets, also used by missions elsewhere), "More Zoo Animals (stock)" (10 supplementary species not tied to any mission — elephant, meerkat, snow leopard, red panda, Tasmanian devil, echidna, wombat, platypus, Komodo dragon, Galápagos tortoise — sourced from Wikimedia Commons under CC licenses, files named `stock-*.jpg`, attribution in `public/images/STOCK_CREDITS.md`), and "Zoo & Habitat" (location/map shots). Real official Taronga Zoo photography wasn't used for the stock set since those are copyrighted zoo assets, not freely licensed — Wikimedia Commons CC-licensed wildlife photos were used instead as the closest safe substitute. If Cameron gets actual licensed Taronga photos later, they can just be dropped into `public/images/` and added to `IMAGE_LIBRARY` the same way.
- **`generate-pptx.py` / `public/resources/pptx/`** are untouched leftovers from the old deck system — not wired into anything in-app anymore, left as-is (out of scope for this change, ask before touching).

### PPTX export — `scripts/generate-pptx.py` — STALE, diverged from the in-app decks
This Python script builds the 32 downloadable PowerPoint files in `public/resources/pptx/`. It has its **own independent, older copy** of the content (`CONTENT` dict in the script, not sourced from `slideDecks.js`). It predates the discussion-slide/mini-overview/reflection-activity rework above — it still uses the old project-brief `action` field, has no `app-preview` or proper `discussion` slide, and its brain breaks/content are the earlier, less-refined versions. **Do not assume it matches the in-app experience.** Bringing it into parity is a full rewrite of comparable size to the in-app rework — this was deferred by explicit user decision (2026-07-19); ask before investing in it. To regenerate after any future edits: `python3 scripts/generate-pptx.py` (writes into `public/resources/pptx/`, needs a rebuild + deploy to go live).

---

## Weekly Mentor Report Automation

Cameron gets a weekly dot-point progress email summarising the week's Taronga Tracka work, for his own review and to copy-paste to his mentor.

- **Cloud Function**: `sendMentorReport` in `functions/index.js` — accepts `{ token, subject, report }`, sends via Resend to `ctr2560@gmail.com` only (no DET/mentor address — those were tried and abandoned, see below). `buildMentorReportHtml()` wraps the plain-text report in a branded template with the Taronga logo (right-aligned, 72px) in the header banner and a "For the Wild" lockup in the footer banner, opens with "Hi Paul,", and uses `bgcolor` attributes + `color-scheme`/`supported-color-schemes` meta tags to survive Outlook's dark-mode colour remapping when pasted. No automation-disclosure footer — the whole email is designed to be select-all-copied straight into a new email to his mentor.
- **Where it actually runs**: **locally on Cameron's Mac**, not in the cloud. `~/.taronga-mentor-report/generate-and-send.sh` does `git log --since="7 days ago"` on the repo, invokes `claude -p` (headless mode, `--allowedTools`, `--dangerously-skip-permissions`) to turn the commit log into non-technical dot points, then POSTs to the Cloud Function. Scheduled via a macOS `launchd` job at `~/Library/LaunchAgents/com.tarongatracka.mentorreport.plist`, firing **Friday 7:30am** local time. Logs to `~/.taronga-mentor-report/last-run.log`.
- **Why not a cloud routine**: the first attempt used a claude.ai scheduled routine (RemoteTrigger), but the cloud sandbox couldn't make any outbound network call at all (not even to the Firebase function directly) — every scheduled/manual test fired the agent but zero requests ever reached Resend. Moved to local `launchd` + headless `claude -p`, which has full network access since it runs on Cameron's own machine already trusted for `git push` etc. **Caveat**: only fires if the Mac is on and awake at 7:30am Friday — it does not queue/catch up if missed.
- **Manual run**: `bash ~/.taronga-mentor-report/generate-and-send.sh` — same script the scheduled job uses, so a manual run and the Friday run always produce identical results. Also runnable via the `/mentor-report` slash command (`~/.claude/commands/mentor-report.md`, installed at user level so it works regardless of launch directory).
- **DET email history**: originally sent to `cameron.rodgers3@det.nsw.edu.au` and CC'd `pmaguire@zoo.nsw.gov.au` directly. Resend reported "delivered" but nothing arrived — a strict education/government mail gateway silently accepting-then-dropping mail from an unfamiliar sending domain is the likely cause. Abandoned in favour of Gmail-only + manual copy-paste.

---

## Key Screens

### Student flow
`home` → `schoolEntry` (choose Student or Teacher) → `studentJoin` (enter code + pick alias) → `studentLoading` (transient, fetches class data) → `map` → `animal` → `observation` → `badge` → `collection` → `submissionComplete`

### ZooSnooz flow
`home` → `studentJoin` (same join screen, `sessionType='zoosnooz'`) → `studentLoading` → `zoosnooz` (internal sub-router via `zzScreen` state)

ZooSnooz internal screens (`zzScreen` values): `map` → `animal` (phases: insight → interaction → mcq → observation → video → preview) → `badge` → `collection` → `stitch`

### Teacher flow
`teacherLogin` → `teacherDashboard` → `createClass` / `classDetails` / `resourceHub` / `curriculumAlignment` / `teacherGuide` / `teacherMap` / `excursionPlan` / `deviceBooking` / `accessibility` / `conservationGallery`

### Staff (admin) flow
`adminLogin` → `adminDashboard` (tabs: Overview, Classes, Challenges, Feedback, Bookings)

### Public flow
`publicEntry` (enter alias, no class code) → `publicAnimal` / `publicMission` / `publicLeaderboard`

---

## All Screens Reference

| Screen | File | Purpose |
|---|---|---|
| `home` | `HomeScreen.jsx` | Video hero, role buttons, "For the Wild" lockup |
| `schoolEntry` | `SchoolEntryScreen.jsx` | Choice card: Student Join vs Teacher Portal |
| `studentJoin` | `StudentJoinScreen.jsx` | Enter class code + pick animal alias |
| `studentLoading` | `StudentLoadingScreen.jsx` | Transient — fetches class, auto-advances to map/zoosnooz |
| `map` | `MapScreen.jsx` | GPS animal map; animals unlock when nearby; exports `ANIMAL_MAP_POSITIONS` |
| `animal` | `AnimalScreen.jsx` | Dispatches to per-animal mission JSX or default quiz flow |
| `observation` | `ObservationScreen.jsx` | Free-text observation with stage scaffold, chips, bullets, min-word check |
| `badge` | `BadgeScreen.jsx` | Badge earned screen; shows obs score bars per subject domain |
| `collection` | `CollectionScreen.jsx` | All found animals + badges + total points + live class ladder; triggers `completeActivity` |
| `submissionComplete` | `SubmissionCompleteScreen.jsx` | Confetti screen; shows `StudentFeedbackModal` after 600ms |
| `zoosnooz` | `ZooSnoozScreen.jsx` | Entire ZooSnooz night experience (~2500 lines) |
| `zooyard` | `ZooYardScreen.jsx` | Entire ZooYard self-attest school experience — see ZooYard Deep Reference |
| `documentaryViewer` | `DocumentaryViewer.jsx` | NFC souvenir card; triggered by `docViewCode` in AppContext |
| `teacherLogin` | `TeacherLoginScreen.jsx` | Magic link email entry |
| `teacherDashboard` | `TeacherDashboardScreen.jsx` | Quick actions, class cards, resource cards, challenge tile |
| `createClass` | `CreateClassScreen.jsx` | Create class form; sets stage, subject, session type, access code |
| `classDetails` | `ClassDetailsScreen.jsx` | Per-class analytics, student list, RadarSVG, ZooSnooz data, ZooYard citizen science moderation, info sheet |
| `teacherGuide` | `TeacherGuideScreen.jsx` | Timeline checklist, 4 phases, tap-to-tick, localStorage progress |
| `assessmentIdeas` | `AssessmentIdeasScreen.jsx` | In-app evidence + 20 post-visit tasks per subject; generates unique printable AT Notification docs |
| `teacherMap` | `TeacherMapScreen.jsx` | Zoo map with student pins, zoom in/out, starts at 0.8 scale |
| `curriculumAlignment` | `CurriculumAlignmentScreen.jsx` | NSW outcomes, exhibit flip cards, by subject/stage |
| `resourceHub` | `ResourceHubScreen.jsx` | Canva-embedded pre/post-visit lessons (admin-managed via `prePostLinks`) + downloadable static resource list |
| `excursionPlan` | `ExcursionPlanScreen.jsx` | 9 flip-tile planning checklist with real links |
| `deviceBooking` | `DeviceBookingScreen.jsx` | Teacher-facing device calendar wrapper |
| `accessibility` | `AccessibilityScreen.jsx` | 6-need accessibility guide, pre-visit checklist, PDF downloads |
| `conservationGallery` | `ConservationGalleryScreen.jsx` | Polaroid masonry wall of approved submissions |
| `adminLogin` | `AdminLoginScreen.jsx` | Staff access code entry |
| `adminDashboard` | `AdminDashboardScreen.jsx` | Staff portal — six tabs, see Staff portal tab structure |
| `adminClassView` | `AdminClassViewScreen.jsx` | Staff view of a specific class's detail |
| `publicEntry` | `PublicEntryScreen.jsx` | Public mode entry — alias only, no class code; sets `appMode='public'` |
| `publicAnimal` | `PublicAnimalScreen.jsx` | Public animal info card |
| `publicMission` | `PublicMissionScreen.jsx` | Public observation mission |
| `publicLeaderboard` | `PublicLeaderboardScreen.jsx` | Leaderboard across all classes |
| `comingSoon` | `ComingSoonScreen.jsx` | Placeholder for upcoming features |

---

## All Components Reference

**Added 2026-08-27/31:** `PhotoCapture.jsx` (live camera with file-picker fallback — see ZooYard),
`ClassLadder.jsx` (live class ladder on the badge collection screen: top three plus the student's
own row, animal aliases only, localStorage-cached so it survives no reception).


| Component | File | Purpose |
|---|---|---|
| `DeviceBookingCalendar` | `DeviceBookingCalendar.jsx` | Shared device calendar; `mode='teacher'\|'staff'` |
| `LegalModal` | `LegalModal.jsx` | Privacy Policy + Terms modal with full Australian Privacy Act text |
| `MathsCalculator` | `MathsCalculator.jsx` | Accessible on-screen calculator shown during maths subject sessions |
| `StudentFeedbackModal` | `StudentFeedbackModal.jsx` | Post-session student feedback modal (shown after submit + after ZooSnooz) |
| `StudentGuide` | `StudentGuide.jsx` | Floating "Dr. Cam" character chat bubble shown on map and observation screens |
| `TeacherHelpBot` | `TeacherHelpBot.jsx` | Keyword-matched FAQ bot shown in teacher dashboard; ~20 pre-written answers |
| `TeacherTutorial` | `TeacherTutorial.jsx` | Step-by-step teacher onboarding overlay with screenshot highlights + portal highlights |
| `TutorialOverlay` | `TutorialOverlay.jsx` | Student-side "Dr. Cam" guided tour of the map screen (character image + callouts) |

---

## Per-Animal Missions (`src/screens/missions/`)

Each file provides a fully custom screen for one animal, overriding the default `AnimalScreen` quiz flow. `AnimalScreen.jsx` imports all of them and dispatches based on `currentAnimal.id`.

| File | Animal |
|---|---|
| `ChimpMission.jsx` | Chimpanzee |
| `GorillaMission.jsx` | Gorilla |
| `LionMission.jsx` | Lion (daytime) |
| `TigerMission.jsx` | Tiger (daytime) |
| `GiraffeMission.jsx` | Giraffe |
| `LemurMission.jsx` | Lemur |
| `DingoMission.jsx` | Dingo |
| `SeaLionMission.jsx` | Sea Lion |
| `BushwalkMission.jsx` | Bushwalk trail |
| `BuffaloMission.jsx` | Buffalo |
| `ConcertLawnMission.jsx` | Concert Lawn |

---

## App Context — Full State Reference (`src/context/AppContext.jsx`)

Key state exposed via `useApp()`:

| State | Type | Purpose |
|---|---|---|
| `currentScreen` | string | Active screen name |
| `setCurrentScreen` | fn | Navigate to a screen |
| `appMode` | `'school'\|'public'` | Determines which student flow runs; persisted in localStorage |
| `sessionType` | `'standard'\|'zoosnooz'\|'zooyard'\|'evolve'\|'wildest-dreams'` | Set at join time; `App.jsx` short-circuits on it BEFORE the `currentScreen` switch, so a mode owns the whole screen |
| `studentName` | string | Alias chosen at join; in localStorage |
| `classCode` | string | 6-char code; in localStorage |
| `classStage` | number (2–5) | NSW stage, read from class doc at join time |
| `classSubject` | string (`'science'\|'maths'\|'english'\|'pdhpe'`) | Subject, read from class doc at join time |
| `teacherEmail` | string | Signed-in teacher's email (Firebase Auth) |
| `teacherProfile` | object | Live-synced from `teachers/{email}` Firestore doc |
| `teacher` | object | Firebase Auth user object |
| `signOutTeacher` | fn | Signs out and navigates to `home` |
| `clearStudentSession` | fn | Clears student localStorage + resets student state |
| `adminAccessCode` | string | Staff portal code; in-memory only (not persisted) |
| `demoMode` | boolean | Demo flag; bypasses teacher-auth redirects (e.g. `demo@zoo` login) — does NOT affect student GPS requirement, despite the name |
| `docViewCode` | string\|null | Triggers `DocumentaryViewer` when set; format `zzv_{animalId}_{classCode}_{studentId}` |
| `zzScreen` | string | ZooSnooz internal sub-router screen |
| `setZzScreen` | fn | Navigate within ZooSnooz |
| `zyScreen` | string | ZooYard internal sub-router screen (`'habitats'\|'citizenScience'\|'done'`) |
| `setZyScreen` | fn | Navigate within ZooYard |

---

## Student Context — Key State (`src/context/StudentContext.jsx`)

Exposed via `useStudent()`:

| State/fn | Purpose |
|---|---|
| `animalsToRender` | Array of animal objects from `animals.js` to show on map |
| `foundAnimals` | `Set<string>` of unlocked animal IDs (GPS proximity or demo mode) |
| `badges` | Object of earned badge data keyed by animal ID |
| `totalPoints` | Running points total |
| `activityCompleted` | boolean — true after `completeActivity()` |
| `completeActivity()` | Submits session to Firestore, increments school points, navigates to `submissionComplete` |
| `userLocation` | `{ latitude, longitude }` from `watchPosition` |
| `locationEnabled` | boolean — whether GPS is actively enabled |
| `checkAnimalProximity(animal)` | Returns `{ nearby: bool, distance: number }` |
| `currentAnimal` | The animal currently being observed |
| `currentQuestionIndex` | Quiz progress |
| `handleQuizAnswer()` | Scores quiz attempt, updates `badges` |
| `handleNextQuestion()` | Advances quiz |

---

## GPS / Geolocation System

- GPS is controlled by two independent flags: a global admin toggle in Firestore `settings/gps` AND a per-class teacher toggle.
- **Both must be true** for GPS to be enforced. Either one disabling it turns off proximity checks.
- `demoMode` in AppContext also bypasses GPS — used for demos/testing.
- `getDistance(lat1, lon1, lat2, lon2)` in `helpers.js` uses the Haversine formula.
- Each animal in `animals.js` has `latitude`, `longitude`, and `radius` (metres, default 30).
- `watchPosition` runs continuously while the student is on the map screen.
- `ANIMAL_MAP_POSITIONS` is exported from `MapScreen.jsx` and re-used by `TeacherMapScreen.jsx`.

---

## App Modes

`appMode` in AppContext: `'school'` (default) or `'public'`.

- **School mode**: requires class code + alias; GPS optional; teacher analytics enabled.
- **Public mode**: alias only, no class code; separate public Firestore path; shows `publicLeaderboard`.
- Mode is persisted in `localStorage` key `tarongaAppMode`.
- `PublicEntryScreen` sets `appMode='public'` on entry; home screen resets it on return.

## Content rewrites — PDHPE and Stage 3 Science (2026-08-24 → 08-30)

Both subjects were measurably heavier than maths and english at every stage. Two patterns worth
knowing before editing content:

**Three missions hard-code their own MCQ and ignore the data file.** `GiraffeMission.jsx`,
`TigerMission.jsx` (via `data/tigerMCQ.js`) and `BushwalkMission.jsx` hold their PDHPE questions
inline. **Editing `animalsPdhpe.js` for those three does nothing** — it took a while to notice.
Where both copies exist they are now kept in step so they cannot contradict.

**The correct answer was at the same index in every stage** on giraffe, buffalo and tiger — a
class cracks that by the second animal. All now scattered. Check this when adding questions.

**PDHPE:** stems and prompts cut roughly in half; every stage-1 explanation with senior
terminology rewritten (`Fast-twitch (Type II) muscles…` was being read by six-year-olds); lion
moved off energy systems onto muscular power to match its own MCQ; giraffe's MCQ is now one
question — how far the heart pumps blood chest to head — with one realistic answer against three
out by a factor of ten; missing stage 1–2 hints added for chimpanzee, gorilla and lion, which had
been falling back to the stage 3 hints.

**Stage 3 Science:** eleven writing prompts moved from *describe* to *explain* to meet ST3-4LW-S,
each keeping the observable half then asking why it matters for survival. `OBS_CONFIG_S3` in
`ObservationScreen.jsx` holds stage 3 chip/bullet overrides for concert-lawn, gorilla and bushwalk
— **the bubbles are shared across stages 3–5, and only stage 3 was rewritten**, so those three
would otherwise contradict the question. Everything else falls through to the shared config.

Instruction screens (chimpanzee graph, River Run, Sea Lion Sanctuary, Concert Lawn countdown) were
cut down and set larger for stage 3 and below, with stages 4–5 keeping the fuller wording.

**Still open:** the lion's Stage 3 Science MCQ is a maths question about millimetres, and
`animals.js` chimpanzee still carries `options: ['A','B','C','D']` (harmless — the mission builds
its own — but it will mislead the next editor).

---

## Class Subjects

`classSubject` determines which animal data, scoring rubric, and observation prompts are used:

| Subject | Data file | Scoring |
|---|---|---|
| `science` | `animals.js` | behaviour / detail / writing |
| `english` | `animalsEnglish.js` | Language & Technique / Structure & Purpose / Written Expression |
| `maths` | `animalsMaths.js` | Method / Accuracy / Comms; shows `MathsCalculator` |
| `pdhpe` | `animalsPdhpe.js` | Comparison / Understanding / Communication |

`openTeacherInfoSheet(classSubject, classStage)` in `teacherInfoSheet.js` opens a new browser tab with a print-ready info sheet. Called from `ClassDetailsScreen`.

---

## Scoring System (`src/utils/scoring.js`)

`buildObservationScore(text, animalId, classStage, classSubject)` — entry point, dispatches by subject:
- `'science'` (default) → `scoreObservation()` → `normaliseScores()` → `generateScoreRationale()`
- `'maths'` → `buildMathsObservationScore()`
- `'pdhpe'` → `buildPdhpeObservationScore()`
- `'english'` → `buildEnglishObservationScore()`

Returns: `{ behaviour, detail, writing, rationale, overallFeedback, improvementTips, extractedEvidence, confidence, reviewRecommended }` — all /5.

`isLowQualityResponse(text)` — detects spam, gibberish, keyboard mashing — used as a pre-check before scoring.

`calculateWritingScore(text, stage)` — standalone writing scorer used in several places.

### ⚠️ How this scorer actually goes wrong (2026-08-30)

Four faults were found in one session, **all by scoring real student answers rather than reading
the code**. Every one of them made a correct answer score badly while producing no error. If
marking "feels harsh", score the actual text before touching thresholds.

**1. The vocabulary lists are the usual culprit, not the thresholds.** Each animal branch scores
against its own word list. If the prompt asks about something the list does not contain, a
perfect answer scores near zero:

- PDHPE lion asked about muscular power; the list had `cardiovascular`, `anaerobic` and `vo2`
  but not `run`, `legs`, `strong` or `fast`. *"I use my legs when I run fast"* → **1/5**.
- PDHPE buffalo asked about staying cool; the list had no `water`, `sweat`, `drink` or `hot`.
- Science gorilla ignored its OWN `observationWords`/`conceptWords` (which contain `together`,
  `group`, `family`, `protect`) and scored behaviour with the generic verb counter instead.
  *"The gorillas sat together as a family group"* matched nothing → **2/5**.

**Rewriting a prompt means re-checking that animal's word list.** Write a plausible answer to the
new prompt and score it before shipping.

**2. `calculateBehaviourScore` treated one behaviour word the same as none** — both returned 2,
so a student who described a real behaviour was marked as if they had not. One word is now 3.

**3. Stage 3 was structurally harsher than Stage 4 on identical text**, which was never intended:
- `stage3Score` hard-capped behaviour at 4, so Stage 3 could not reach 5 at all. Now reachable
  with three detail hits AND an explanation. Detail stays capped at 4 deliberately — lifting it
  made Stage 3 outscore Stage 4.
- All nine Stage 3 branches did `behaviourBonus = s3.b`, **overwriting** the topic-vocabulary
  score computed just above, while all nine Stage 4 branches did `Math.max(...)` and kept it.
  Now all use `Math.max`. The `|| 0` guard covers the dingo branch, the one place
  `behaviourBonus` is not pre-computed.

**4. Scoped fixes over global ones.** Lion and buffalo have their own PDHPE word lists layered on
top rather than widening the shared lists. Three animals needing this is a signal the base lists
were written for senior secondary — if a fourth comes up, give PDHPE one shared everyday-language
list instead of a fourth patch.

**How to verify a scoring change:** diff old vs new across 5 stages × 4 subjects × 12 animals with
a handful of real answers plus junk. Nothing should ever score *lower*, and junk (`dddd dddd`,
`asdf`, `good`, `I saw it`) must not move.

---

## Data Utilities (`src/utils/teacherInfoSheet.js`)

All curriculum data lives here and is imported by multiple screens:

- `EXHIBITS` — array of `{ name, emoji, stage2, stage3, stage4, stage5 }` objects (Science + English)
- `SCORING` — observation scoring domains per subject
- `STAGE_EXPECTATIONS` — performance descriptors by stage
- `NSW_OUTCOMES` — `{ Science: { 2: [...], 3: [...], ... }, English: { ... } }` — NSW curriculum codes

**Important:** Always `.slice(0, 3)` when rendering outcomes — only show max 3 per subject/stage.

### Printable sheets — the house pattern

`teacherInfoSheet.js`, `zoosnoozInfoSheet.js`, `evolveCertificates.js`,
**`highlightsPackage.js`** and `modes/wildest-dreams/infoSheet.js` all work the same way: build one self-contained HTML document, open it
in a new tab from a blob URL, let the browser print it or save it as a PDF. **No PDF library, no
server round trip.** Copy this pattern for any new printable.

- **`highlightsPackage.js`** — `openHighlightsPackage(cls, students)`, the class report behind the
  **Highlights Package** button above Export CSV. Cover, stat tiles, class averages, a summary
  table, then one block per student with every observation, its per-domain marks, the quiz result
  and their conservation statement. It renames the three score domains **by subject** to match the
  Analytics tab (Behaviour/Detail/Writing, Method/Accuracy/Communication,
  Comparison/Understanding/Communication, Vocabulary/Understanding/Expression) so the PDF reads as
  the screen the teacher just left. Uses the `students` array already in memory — no extra reads.
- Print rules that matter: `break-inside: avoid` on student blocks so responses do not split
  across pages, and `print-color-adjust: exact` because browsers strip backgrounds by default.
- **Parent notification letters are the exception**: `public/zoosnooz-notification.html` and
  `public/evolve-notification.html` are plain static pages, not generated, opened with
  `window.open` from `ClassDetailsScreen` and gated on `isZZ` / `isEV`. Their styling is a
  deliberate copy of each other rather than shared, so one can never break the other.
  ⚠️ Keep both letters truthful about what the system actually does. The ZooSnooz one promised
  48-hour deletion and 12-month hosting that were never built; corrected 2026-09-24. See
  "Do these first" before adding any retention claim back.

---

## Device Booking (`src/components/DeviceBookingCalendar.jsx`)

- `DEVICE_CAPACITY = 20` exported constant — 20 Tracka devices available per day.
- `mode='teacher'` — shows booking form for future dates with capacity check.
- `mode='staff'` — shows all bookings + can cancel any; used in admin dashboard Bookings tab.
- Props: `teacherEmail`, `schoolName`.
- On new booking: Cloud Function `onDeviceBookingCreated` fires and emails Cameron.

---

## Static Assets (`public/`)

⚠️ **Photos are routinely shipped at full camera resolution and nobody notices.**
`blue-mountains-bushwalk.jpg` was a 3543x2362 original at **7.4MB**, served to every student on
that mission, until 2026-09-28. The house norm is roughly **1000–1500px and ~200–400KB**
(`rhino.jpg` is 1500x1000 at 237KB). Resize with
`sips -Z 1500 in.jpg --out tmp.jpg && sips -s format jpeg -s formatOptions 80 tmp.jpg --out out.jpg`,
and **check the result by eye** rather than by filesize: the Blue Mountains photo is a Regent
Honeyeater, and fine feather detail is exactly what falls apart under aggressive JPEG.

Still oversized and worth the same treatment: `lemur.jpg` (975KB, 2880x1860) and
`asian-water-buffalo.jpg` (737KB, 2880x1357).


| File | Purpose |
|---|---|
| `images/logo.png` | Taronga platypus logo (primary) |
| `images/taronga-zoo-white.png` | "For the Wild" white lockup — HomeScreen top-left |
| `images/taronga-map.png` | Zoo map used in MapScreen + TeacherMapScreen |
| `images/TarongaHeadline-Regular.ttf` | Brand display font |
| `taronga-venue-safety-2026.pdf` | Linked from ExcursionPlanScreen tile 04 |
| `taronga-accessibility-toolkit.pdf` | Downloadable from AccessibilityScreen sidebar |
| `taronga-accessibility-map.pdf` | Downloadable from AccessibilityScreen sidebar |

Animal photos: `/images/{animalId}.jpg` (e.g. `tiger.jpg`, `lion.jpg`)
ZooSnooz badges: `/images/badge-{animalId}.png`

---

## Build & Deploy

⚠️ **There are TWO live sites and they deploy by different mechanisms.** Getting this wrong has
already caused a production bug that went unnoticed for two weeks.

| Site | Host | Deploys when |
|---|---|---|
| **tarongatracka.com.au** | GitHub Pages | **automatically on every push to `main`** |
| **tarongatracka.web.app** | Firebase Hosting | only when someone runs `firebase deploy --only hosting` |

`.github/workflows/deploy.yml` builds and publishes to the `gh-pages` branch on every push to
`main`; that branch carries a `CNAME` of `tarongatracka.com.au`. So **a push to main is a release**
for the custom domain — same as Wildly.

**The trap:** `.web.app` does not follow. The two drift apart, and code can be "pushed and live" on
one domain while the other serves a build from weeks ago. That is exactly what happened with the
staff portal Users tab — Firestore rules and the Cloud Function were deployed, the frontend fix was
pushed to main (so `.com.au` had it), but `.web.app` was never redeployed and stayed broken.

To tell which host a domain is actually on: `/__/firebase/init.js` returns **200 on Firebase
Hosting** and **404 on GitHub Pages**.

```bash
npm run dev                                    # dev server (usually :5173)
npm run build                                  # production build into dist/

npm run build && firebase deploy --only hosting # .web.app ONLY — .com.au updates itself from main
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage                 # storage.rules — see the Storage rules section
firebase deploy                                # everything
```

The `dist/` folder is the Firebase Hosting target. Always `npm run build` before
`firebase deploy --only hosting`.

**Verifying a deploy actually landed:** compare the asset hash in the served HTML against the local
build — `curl -s https://<host>/ | grep -o '/assets/[^"]*\.js'` should match `ls dist/assets/*.js`.
Grepping a 2.4MB bundle for a feature string only works from a file, not a shell variable.

### ⚠️ GitHub Pages has no SPA routing — `dist/404.html` is what fixes it (2026-08-31)

The app uses real URLs via `pushState` (`/map`, `/collection`, `/classDetails`). GitHub Pages
serves static files, so **any fresh document load of one asks GitHub for a file by that name** and
gets "File not found". Cameron hit this on `/classDetails` and noted it happening "more and more,
rather than just reloading" — mobile browsers discard and reload backgrounded tabs on their own,
so it is not only deliberate reloads.

Fix: a **`postbuild`** script copies `dist/index.html` to `dist/404.html`. Pages serves 404.html
for unknown paths, so the app boots and routes client-side. It runs after the asset hashes exist,
and the workflow already calls `npm run build`, so no workflow change was needed.

- **The response is still HTTP 404** — that is inherent to this workaround. Invisible to users,
  visible in analytics.
- **Never replace this with a static `public/404.html`** — it would reference stale asset hashes.
- `DEEP_LINK_FALLBACKS` in `AppContext.jsx` handles screens that cannot load cold: `classDetails`
  needs `selectedClass` in memory, so it lands on `teacherDashboard` rather than the public home
  screen. Students were already fine — a saved session sends them to the map.

### ⚠️ Testing straight after a push tests the OLD build (2026-08-20)

GitHub Pages serves `index.html` with **`cache-control: max-age=600`**, and that header cannot be
changed on Pages. For **ten minutes** after a push, a browser that has visited the site keeps
loading the previous app from disk — the deploy is live, `curl` proves the new hash is being
served, and the browser still runs the old bundle. This burned most of an hour: a fix was pushed,
verified as deployed, and still appeared broken.

Symptoms of stale HTML rather than a real bug:

- The behaviour matches the *previous* version exactly, not a random failure
- `curl -s https://tarongatracka.com.au/ | grep -oE 'index-[A-Za-z0-9_-]+\.js'` **matches** your
  local `dist/assets/`, yet the page misbehaves
- The page's own scripts disagree with the server. Check in the console:
  `[...document.querySelectorAll('script[src]')].map(s => s.src)`

Fixes: **Cmd+Shift+R**, or wait ten minutes, or append a throwaway query (`&cb=123`) to force a
fresh fetch. Incognito is **not** a reliable reset — an already-open incognito window keeps its own
cache; every incognito window must be closed first.

**This never affects students.** A student tapping an NFC tag or opening the app for the first time
has nothing cached. It only affects whoever is reloading the site repeatedly after deploys.

The site sits behind **Cloudflare**, which *can* override the Pages header — a Cache Rule on `/`
setting Browser TTL to 1 minute would shrink the window. Not done; dashboard change, not code.
The hashed `assets/*.js` files are safe to cache forever, since their names change every build.

`.firebase/` is the deploy cache and is gitignored — it used to be tracked and dirtied the tree
after every deploy.

---

## ⚠️ Offline behaviour — the zoo has no reception (2026-08-31)

**Firestore persistence is NOT enabled.** `firebase.js` calls plain `getFirestore(app)`, so the app
has no offline store. This has a consequence that costs hours if you do not know it:

> **When Firestore is offline with nothing cached, `onSnapshot` neither fires nor errors.** It
> queues and retries in silence.

So a component that renders only after its first snapshot shows **nothing, with a clean console,
no error and no warning**. That is exactly how the class ladder failed at the zoo while working
perfectly on wifi — and why every check came back green: the code was live, the data was fine,
the query worked from a desk.

**If a feature "just doesn't show" on site but works at home, suspect this first.**

Any component reading Firestore for display should:
1. Seed from a `localStorage` cache in the state initialiser, so something renders immediately.
2. Set a timeout (~6s) and say so, rather than sitting invisible. `ClassLadder.jsx` is the worked
   example.

**What already survives offline:** student progress is written to `localStorage` after every
action, so nobody loses work. Uploads catch up because each badge write sends the *complete*
badges array, so the next successful write carries everything earlier with it.

**The one real gap:** a student who finishes offline, taps Complete Activity, and closes the tab
before regaining signal. Firestore holds that write in memory only, and uploads fire only on badge
earned or activity completed — both already done. Their work is safe on the phone; it just never
reaches the teacher. Enabling persistence would fix this, and would help everything else on site,
but it changes every read and write in the app — do it as its own piece of work with a full
offline walkthrough, not as a quick toggle.

---

## Conventions & Gotchas

**`studentName` and `classCode` live on `AppContext`, not `StudentContext`.** StudentContext
consumes them but does not re-expose them, so destructuring them from `useStudent()` yields
`undefined` **silently** — no error, no warning. That is what made the class ladder render nothing
on first attempt: the value was undefined, the component's own `if (!classCode) return` swallowed
it, and there was nothing to see. Check which context a value actually comes from.


**A live `<video>` preview and a playback `<video>` in the same tree position share ONE DOM node,
and `srcObject` beats `src`.** Give them distinct `key`s. See Video & media pipeline §8 — this
presents as "it records but there is no playback" and looks nothing like a React problem.

**Wildest Dreams is the only mode under `src/modes/`, not `src/screens/`.** If you are adding a
mode, follow that layout: everything self-contained, CSS prefixed and scoped to a root class, its
own copy of any media pipeline, and the smallest possible additive change to register it.

1. **Inline styles over CSS files** — almost all component styling is inline `style={{}}` objects. The exception is the LMS layout classes and design tokens in `global.css`. Don't add new `.css` files; keep styling co-located.

2. **No comments unless the WHY is non-obvious.** Don't add explanatory "what" comments.

3. **Challenge tile status** — uses a `rank()` function (approved=2, pending=1, rejected=0) to pick the best status across multiple submissions. Most-recent-wins logic was a prior bug that masked approved submissions.

4. **`studentLoading` is transient** — it auto-advances to `map` after loading. It must stay in `TRANSIENT_SCREENS` so `replaceState` is used and the back button skips it.

5. **Conservation Gallery** — `challengeSubmissions` with `inGallery: true` and `galleryAt` timestamp. Staff toggle via `toggleGallery()` in AdminDashboardScreen.

6. **Back button on teacher screens** — prefer `window.history.back()` with a fallback (e.g. `setCurrentScreen('teacherDashboard')`) over hardcoded destinations. This preserves natural back-stack navigation.

7. **ZooSnooz sub-router** — `zzScreen` state in AppContext acts as a secondary router inside the ZooSnooz session (`map`, `animal`, `badge`, `collection`, `stitch`). Don't confuse it with the top-level `currentScreen`.

8. **School name on class creation** — teachers enter school name when creating an account (stored in `teacherProfile.schoolName`). Used in device bookings and leaderboard.

9. **Firebase region** — always `australia-southeast1`. The `functions` export in `firebase.js` specifies this region. Cloud Functions deployed to any other region will silently be unreachable from the client.

10. **`drawings accepted` is wrong** — the app only accepts text/dictation for literacy. Never reintroduce "drawings accepted" claims in AccessibilityScreen or elsewhere.

11. **Any new Storage upload path must be added to `storage.rules` and deployed** (`firebase deploy --only storage`), or writes fail silently with `storage/unauthorized` — students are unauthenticated, so student paths need `if true`. See the Firebase Storage rules section for the full path table.

12. **Canvas stitching is CPU-heavy** — it runs on the main thread using `requestAnimationFrame`. On low-end devices it may be slow or fail. The fallback message ("stitching not supported on this device") handles this gracefully — do not add server-side fallbacks without a significant architecture change.

13. **ZooSnooz data is duplicated** — animal scores live on the student doc under `zoosnooz.{animalId}` AND a summary is written to `zoosnooz_docs/{classCode}_{studentId}`. Keep both in sync when modifying the submission flow.

14. **`docViewCode` triggers DocumentaryViewer** — set `docViewCode` in AppContext to render the souvenir card screen. Clearing it (set to `null`) returns to the normal app. The NFC URL format is `zzv_{animalId}_{classCode}_{studentId}`.

15. **Post-visit AT Notification docs are per-task, not per-subject.** `openAssessmentTaskNotification(..., 'post-visit', taskData)` must always be called with the full `POST_TASKS` entry as `taskData` — it has no generic post-visit fallback content the way the in-excursion path does. If a task is added to `POST_TASKS` without `steps`/`criteria`/`marking`/`resources`, the generated document will silently render with missing sections.

16. **Pre/post-visit lesson content is now entirely Canva-based, built by Cameron.** The old class-agnostic-content constraint applied to the removed in-app slide decks; it no longer applies since the app just embeds whatever Canva design is linked.

17. **`generate-pptx.py` / `public/resources/pptx/` are legacy and disconnected.** They predate the Canva-embed Pre/Post-Visit Lessons system and aren't referenced anywhere in-app anymore. Don't assume editing one affects the other.

18. **The mentor report script (`~/.taronga-mentor-report/generate-and-send.sh`) lives outside the repo**, in the user's home directory, along with the `launchd` plist in `~/Library/LaunchAgents/`. Neither is version-controlled. If Cameron sets up a new machine, both need to be recreated — the script content and plist are documented in full in the Weekly Mentor Report Automation section above.
