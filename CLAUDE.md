# Taronga Tracka — CLAUDE.md

## What is this project?

Taronga Tracka is an educational field-study app for school excursions to Taronga Zoo Sydney. Students use the app to make animal observations, complete missions, earn badges, and participate in class challenges. Teachers manage classes and track progress through a portal. A staff portal (Taronga admin) manages codes, approves submissions, and oversees the whole program.

There is also **ZooSnooz** — a separate night-mode variant with NFC stations, keeper interactions, video recording, and a documentary stitching pipeline, sharing the same codebase.

There is also **ZooYard** — a self-attest, no-GPS "at school" program for classes that can't visit the zoo (built for NSW DoE devices, which block geolocation). Students work through three habitats in their own schoolyard, then complete a citizen science task. See the ZooYard Deep Reference section below.

There is also **Evolve** — a Stage 6 (Year 11/12) twilight excursion supporting the Life Ready course. Five animals are five chapters of one story about leaving school; students write a reflection and film a piece to camera at each, which stitch into a single short film they keep. Deliberately has no points, badges or marks. See the Evolve Deep Reference section below.

Live URL: deployed to Firebase Hosting (project: `tarongatracka`), region: `australia-southeast1`.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| State | React Context (no Redux/Zustand) |
| Backend | Firebase — Firestore, Auth (email + password), Storage, Functions v2 |
| Email | Resend API (via Cloud Functions) |
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
│   └── generate-pptx.py      # Builds 32 downloadable PPTX lesson decks — legacy, not wired into the app anymore (see Pre/Post-Visit Lessons section)
├── public/                   # Static assets served as-is
│   ├── images/               # logo.png, taronga-zoo-white.png, animal photos, map
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
| `deviceBookings/{bookingId}` | Tracka device booking calendar entries |
| `resources/{docId}` | (Reserved for future resource library) |
| `prePostLinks/{subject}_{stage}_{timing}` | Admin-managed Canva pre/post-visit lesson links — see Pre/Post-Visit Lessons section |
| `citizenScienceSubmissions/{submissionId}` | ZooYard "Habitat Hero" photo submissions — see ZooYard Deep Reference section |

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
2. **Canvas setup**: offscreen `<canvas>` at 1280×720, draws frames at ~30fps via `requestAnimationFrame`
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

### Firebase Storage rules

**`storage.rules` now exists in the repo** (added 2026-08-12) and is wired into `firebase.json` under the `"storage"` key. Deploy with `firebase deploy --only storage`.

⚠️ The file is only honoured *because* of that `firebase.json` key. A `storage.rules` file without it is silently ignored.

**Every upload path the ecosystem uses must be listed there**, or writes fail with `storage/unauthorized` and — because uploads are backgrounded — the failure is invisible unless you check the console log:

| Path | Written by | Auth |
|---|---|---|
| `zoosnooz/` | ZooSnooz clips + documentary | none (students) |
| `evolve/` | Evolve clips + film | none (students) |
| `zooyardHabitats/` | ZooYard attest photos | none (students) |
| `citizenScienceEvidence/` | ZooYard Habitat Hero photos | none (students) |
| `challengeEvidence/` | Class challenge photos | teacher (Firebase Auth) |
| `resources/` | **Wildly** resource PDFs | Wildly staff (Firebase Auth) |

`resources/` belongs to **Wildly**, which shares this Firebase project. Removing it breaks Wildly's PDF uploads — check both repos before narrowing this file.

**Correction (2026-08-12):** an earlier note here claimed the ZooYard `citizenScienceEvidence/` path "worked immediately in production with no manual Console rule change" and that the live rules were "broadly permissive". **That was never verified and is wrong.** A direct probe of every path found only `zoosnooz/` was writable; `citizenScienceEvidence/`, `zooyardHabitats/` and `evolve/` were all denied, and `citizenScienceSubmissions` had zero documents — so no student had ever completed the task to prove it. Never assume a new Storage path works; probe it.

---

## ZooYard — Deep Reference

ZooYard is a self-attest, single-session, no-GPS program built for classes that can't visit the zoo (NSW DoE devices block geolocation, so the daytime GPS-proximity flow can't run in a classroom). It's a third `sessionType` alongside `standard`/`zoosnooz`, fully isolated — it shares zero mutable state with the other two flows, only pure helpers like `buildObservationScore`.

### How a class becomes ZooYard
`CreateClassScreen.jsx`: teacher selects location **"Your School — ZooYard"** (`value="school"` — this option already existed in the dropdown, previously disabled as a "Coming Soon" placeholder for exactly this feature). This sets `isZooYard` → `sessionType: 'zooyard'`, `subject: 'science'` (hardcoded, subject dropdown hidden — Science-only for v1, same treatment as ZooSnooz's hidden dropdown), `location: 'school'` → venue label `"School"`. `EXPEDITION_AWARDS['school']` already existed too (20 pts, one-time per school).

### Routing
`App.jsx` `Router()`: `if (sessionType === 'zooyard') return <ZooYardScreen />;`, mirroring the ZooSnooz short-circuit — this means `ZooYardScreen.jsx` is fully self-contained and the daytime `currentScreen` switch never runs for a ZooYard class.

### Content (`src/data/zooyardAnimals.js`)
Three animals, deliberately reusing the **same ids** as `src/data/animals.js` (`koala`, `tiger`, `giraffe`) to get their existing photos/badge art for free, and because koala/giraffe already have hand-tuned keyword-scoring branches in `scoreObservation()` (tiger falls through to the generic fallback — fine, just less tailored feedback). Safe to reuse ids because a ZooYard class is a completely separate `classes/{code}` document — no student doc ever mixes ZooYard and daytime data.

Each entry: `habitatArea`/`habitatLabel` (bushland/rainforest/savannah), `selfAttestPrompt` + `selfAttestQuestion` (the "find a tree, are you ready?" self-report — no GPS check at all), `videoUrl` (null until Cameron records real footage — `ZooYardScreen` shows a "Video coming soon" placeholder card when unset), `activity` (single MCQ + fact), `writingPromptByStage` (stages 2–5, conservation-flavoured).

`ZOOYARD_CITIZEN_SCIENCE_TASK` — the single "Habitat Hero" task (build one small wildlife feature at school: leaf pile, native plant, bug hotel, water dish, no-mow patch) that unlocks once all three habitats are complete.

### `ZooYardScreen.jsx` — self-contained sub-router
Mirrors `ZooSnoozScreen.jsx`'s pattern exactly: own local component state (no `StudentContext` badges/foundAnimals), cascading `if (phase === ...) return <JSX/>` blocks rather than a switch. Top-level phase (`zyScreen`/`setZyScreen`: `'habitats' | 'citizenScience' | 'done'`) lives in `AppContext.jsx` next to `zzScreen` so it survives the screen's own re-renders; per-animal phase (`attest → video → activity → written → badge`) is local `useState`.

Flow: habitat picker (3 cards, any order) → self-attest confirm → video/placeholder → single MCQ → written response (scored via `buildObservationScore(text, animalId, classStage, 'science')`, points formula same as ZooSnooz: `Math.round((behaviour+detail+writing)/15*100) + (quizCorrect?20:0)`) → badge reveal → back to picker. Once all 3 done, a "Habitat Hero unlocked!" banner appears; the citizen science task collects a photo (client `uploadBytes` to `citizenScienceEvidence/{classCode}/{studentId}-{timestamp}.{ext}`) + optional note, writes to `citizenScienceSubmissions` (see below) and marks `zooyard.sessionCompleted`/`totalPoints` on the student doc, then a `ZzDoneScreen`-style completion screen with `StudentFeedbackModal`.

### Student doc shape
`classes/{code}/students/{id}`, field `zooyard`:
```js
zooyard: {
  koala:  { completed: true, points, behaviour, detail, writing, quizCorrect, observation, updatedAt },
  tiger:  { ... }, giraffe: { ... },
  sessionCompleted: true, totalPoints,
  citizenScience: { status: 'pending'|'approved'|'denied', photoUrl, note, submittedAt },
}
```
**Gotcha:** the per-animal write uses `updateDoc(ref, { [\`zooyard.${animalId}\`]: {...} })`, **not** `setDoc(ref, {...}, {merge:true})`. This matters: Firestore's `setDoc(...,{merge:true})` treats a dotted string key like `'zooyard.koala'` as a **literal field name containing dots**, not a nested path — it does NOT nest under a `zooyard` map. Only `updateDoc()` parses dotted keys as nested field paths.

**This exact bug was confirmed in production for ZooSnooz too (2026-07-23) and fixed.** `ZooSnoozScreen.jsx`'s two per-animal writes (`zoosnooz.{animalId}` badge data, and the later `zoosnooz.{animalId}.videoURL`/`videoCompleted` upload-completion write) used the same flawed `setDoc(...,{merge:true})` pattern — verified against real student documents showing literal top-level fields like `"zoosnooz.tiger"` instead of a nested map. Both call sites were switched to `updateDoc()`, live-tested end-to-end (joined the real "6t" class, completed Sun Bear, confirmed the resulting doc has a genuine nested `zoosnooz: { 'sun-bear': {...} }` map, confirmed `ZooSnoozAdminTab`'s clips list picks it up via the "primary" path). Existing pre-fix student documents keep their old flat dotted fields (harmless, untouched) — the admin analytics already had fallbacks reading `zzBadges`/`quizPercentage`/`zzTotalPoints` (written correctly and independently by `zzFinalSubmit` from in-memory state) for exactly this reason, so nothing was ever visibly broken; this fix just makes the "primary" per-animal path real again instead of always silently failing over.

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
- **Staff** (`ZooYardAdminTab` in `AdminDashboardScreen.jsx`, tab `'zooyard'`) can approve or deny any submission. Approving awards **+30 pts to the school leaderboard** (`schools/{schoolId}.totalPoints`), same pattern as `challengeSubmissions` approval — not a retroactive rewrite of the student's own record.
- **Teachers** (new section in `ClassDetailsScreen.jsx`, gated on `isZY = cls.sessionType === 'zooyard'`) can view their own class's submissions (query scoped to `classCode`) and **deny or delete** — no approve button rendered. This is a genuinely new capability; `challengeSubmissions` has no teacher-moderation precedent to compare against.

### Class details / GPS panel
`ClassDetailsScreen.jsx` gates the GPS toggle panel and the old daytime "Class Insights" (badge-array-based analytics) with `!isZY` — both are meaningless for ZooYard (no GPS check ever happens; badges live under `zooyard`, not the shared `badges` array). Stat cards get a ZooYard-specific branch: Students / Avg Points / Habitat Badges / Completed, reading `student.zooyard?.totalPoints`/`sessionCompleted`/`{animalId}.completed`. Note **Avg Points only reflects fully-submitted sessions** — `zooyard.totalPoints` is written once, at citizen science submission, not incrementally per animal, so an in-progress student shows 0 there even after earning badges.

---

## Evolve — Deep Reference

Evolve is a **Stage 6 (Year 11/12) twilight excursion** at Taronga Sydney, built to support the
mandatory Life Ready course. It is a reflection on leaving school, not a quiz mode.

**It is deliberately unlike every other mode: no points, no badges, no marks, no leaderboard,
no quizzes.** The writing is a memento the student keeps. Don't "improve" it by adding scoring.

### The five chapters (`src/data/evolveAnimals.js`)
Each animal is a chapter in one narrative — past → threshold → future → legacy → responsibility —
and the metaphor is earned by the animal's real behaviour, not decoration:

| # | Animal | Chapter | Why |
|---|---|---|---|
| 1 | Lion | Where I come from | Cubs are raised by the whole pride and learn by watching |
| 2 | Kangaroo | Forward only | Physically cannot hop backwards |
| 3 | Tiger | The territory ahead | Leaves its mother at ~2 to claim its own ground |
| 4 | Giraffe | The long view | Other animals watch giraffes for early warning — **the Advice Wall chapter** |
| 5 | Koala | What I owe | Survival depends on human choices — **the pledge chapter** |

`order` fixes the story sequence. Students unlock chapters by GPS in whatever order the zoo
allows, but `EVOLVE_STORY_ORDER` means **the film is always assembled in narrative order
regardless of filming order.** Capture order and story order are deliberately independent.

⚠️ **Kangaroo has never existed in this app.** `latitude`/`longitude` are `null` and
`/images/kangaroo.jpg` does not exist — coordinates, a map pin and a photo still need capturing
on site (Australian Walkabout). Null coords mean that chapter unlocks *without* a proximity
check rather than becoming permanently unreachable.

Lion/tiger/giraffe/koala coordinates are lifted from `src/data/animals.js` so Evolve matches the
daytime map exactly.

### Flow
`sessionType: 'evolve'` short-circuits in `App.jsx` to `EvolveScreen.jsx`, which sub-routes on
`evScreen` (`map | chapter | film`) in AppContext. Per chapter: **insight → observe → write
(40-word minimum) → record (30s piece to camera) → preview**.

Student data lives at `classes/{code}/students/{id}` under `evolve`:
```js
evolve: {
  lion: { completed, observation, reflection, chapter, order, clipURL, updatedAt },
  kangaroo: {...}, tiger: {...}, giraffe: {...}, koala: {...},
  filmURL, sessionCompleted, completedAt,
}
```
Per-chapter writes use `updateDoc` with a dotted key — **not** `setDoc(...,{merge:true})`, which
would create a literal field named `"evolve.lion"`. Same trap as ZooYard and ZooSnooz.

On submit a keepsake record is written to `evolve_docs/{classCode}_{studentId}` holding the film
URL and every reflection. Nothing reads it yet — that's the souvenir-link/export surface.

### `src/utils/evolveFilm.js` — the stitching pipeline
A **deliberate copy** of the ZooSnooz pipeline, not a shared abstraction, so changing Evolve can
never regress live ZooSnooz. **They do not inherit from each other — a fix here needs applying
there separately.** Hard-won details, all of which cost real debugging time:

- **The draw loop must be rAF, with a timer watchdog.** rAF alone stops dead in a hidden tab or
  when the screen sleeps, producing films with perfect audio and *no picture* — the cards survive
  because they draw once synchronously and the canvas holds the image, but video needs continuous
  redraws. A bare `setInterval` "fixes" that but drifts and bunches up, which looks choppy. The
  current loop uses rAF when visible, a timer when hidden, plus a watchdog that restarts the loop
  if no frame has been drawn in 400ms.
- **A Screen Wake Lock is held for the whole stitch** for the same reason.
- Any chapter drawing under ~5fps logs a warning naming the chapter — this used to fail silently.
- `mr.start(500)` then an 80ms settle before the first frame, or the opening frames drop.
- Each clip's guard timer is re-armed to the real duration once playback starts.
- The `<video>` element is released after every clip (`removeAttribute('src'); load()`).
- Canvas is **720×1280 portrait** at 2.5 Mbps.

### Upload gating
A student **cannot leave a chapter until its clip is fully in Storage** — the button reads
"Waiting for your clip…" and is disabled until the upload reports `done`. Walking away mid-upload
silently loses that chapter from the film. On failure they get "Try saving again", which re-uploads
the blob held in memory (no re-filming); there is deliberately no skip.

### Advice Wall (`evolveAdvice`) — data only, no UI yet
The giraffe chapter's reflection is also written to `evolveAdvice` with
`{ classCode, chapterId, advice, cohortYear, status:'pending', submittedAt }`.
**Attributed by cohort year, never by student name** — it is written by 17-year-olds and intended
for 12-year-olds. Staff moderation and the wall itself are not built yet. Because Wildly shares
this Firestore project, one collection can serve both products.

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
- **Admin side**: `PrePostLinksTab` in `AdminDashboardScreen.jsx` (tab id `prePost`, label "Pre/Post Lessons"). One row per NSW stage (2–5) × subject tab, each row has Pre-Visit / Post-Visit mini-forms (title, description, Canva URL, Save). Saving with a blank URL deletes the Firestore doc — that's the mechanism that hides a subject/stage from teachers.
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
| `collection` | `CollectionScreen.jsx` | All found animals + badges + total points; triggers `completeActivity` |
| `submissionComplete` | `SubmissionCompleteScreen.jsx` | Confetti screen; shows `StudentFeedbackModal` after 600ms |
| `zoosnooz` | `ZooSnoozScreen.jsx` | Entire ZooSnooz night experience (~2500 lines) |
| `zooyard` | `ZooYardScreen.jsx` | Entire ZooYard self-attest school experience — see ZooYard Deep Reference |
| `documentaryViewer` | `DocumentaryViewer.jsx` | NFC souvenir card; triggered by `docViewCode` in AppContext |
| `teacherLogin` | `TeacherLoginScreen.jsx` | Magic link email entry |
| `teacherDashboard` | `TeacherDashboardScreen.jsx` | Quick actions, class cards, resource cards, challenge tile |
| `createClass` | `CreateClassScreen.jsx` | Create class form; sets stage, subject, session type, access code |
| `classDetails` | `ClassDetailsScreen.jsx` | Per-class analytics, student list, RadarSVG, ZooSnooz data, ZooYard Habitat Hero moderation, info sheet |
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
| `adminDashboard` | `AdminDashboardScreen.jsx` | Staff portal: Overview, Analytics, ZooSnooz, ZooYard, Review, Pre/Post Lessons, Challenges, Bookings, Users, Control Room tabs |
| `adminClassView` | `AdminClassViewScreen.jsx` | Staff view of a specific class's detail |
| `publicEntry` | `PublicEntryScreen.jsx` | Public mode entry — alias only, no class code; sets `appMode='public'` |
| `publicAnimal` | `PublicAnimalScreen.jsx` | Public animal info card |
| `publicMission` | `PublicMissionScreen.jsx` | Public observation mission |
| `publicLeaderboard` | `PublicLeaderboardScreen.jsx` | Leaderboard across all classes |
| `comingSoon` | `ComingSoonScreen.jsx` | Placeholder for upcoming features |

---

## All Components Reference

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
| `sessionType` | `'standard'\|'zoosnooz'` | Set at join time; determines which map the student enters |
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

---

## Data Utilities (`src/utils/teacherInfoSheet.js`)

All curriculum data lives here and is imported by multiple screens:

- `EXHIBITS` — array of `{ name, emoji, stage2, stage3, stage4, stage5 }` objects (Science + English)
- `SCORING` — observation scoring domains per subject
- `STAGE_EXPECTATIONS` — performance descriptors by stage
- `NSW_OUTCOMES` — `{ Science: { 2: [...], 3: [...], ... }, English: { ... } }` — NSW curriculum codes

**Important:** Always `.slice(0, 3)` when rendering outcomes — only show max 3 per subject/stage.

---

## Device Booking (`src/components/DeviceBookingCalendar.jsx`)

- `DEVICE_CAPACITY = 20` exported constant — 20 Tracka devices available per day.
- `mode='teacher'` — shows booking form for future dates with capacity check.
- `mode='staff'` — shows all bookings + can cancel any; used in admin dashboard Bookings tab.
- Props: `teacherEmail`, `schoolName`.
- On new booking: Cloud Function `onDeviceBookingCreated` fires and emails Cameron.

---

## Static Assets (`public/`)

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

```bash
# Dev server
npm run dev

# Production build
npm run build

# Deploy everything
firebase deploy

# Deploy only hosting (after build)
npm run build && firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

The `dist/` folder is the hosting target. Always run `npm run build` before `firebase deploy --only hosting`.

---

## Conventions & Gotchas

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
