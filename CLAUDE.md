# Taronga Tracka — CLAUDE.md

## What is this project?

Taronga Tracka is an educational field-study app for school excursions to Taronga Zoo Sydney. Students use the app to make animal observations, complete missions, earn badges, and participate in class challenges. Teachers manage classes and track progress through a portal. A staff portal (Taronga admin) manages codes, approves submissions, and oversees the whole program.

There is also **ZooSnooz** — a separate night-mode variant with NFC stations, keeper interactions, video recording, and a documentary stitching pipeline, sharing the same codebase.

There is also **ZooYard** — a self-attest, no-GPS "at school" program for classes that can't visit the zoo (built for NSW DoE devices, which block geolocation). Students work through three habitats in their own schoolyard, then complete a citizen science task. See the ZooYard Deep Reference section below.

There is also **Evolve** — a Stage 6 (Year 11/12) twilight excursion supporting the Life Ready course. Five animals are five chapters of one story about leaving school; students write a reflection and film a piece to camera at each, which stitch into a single short film they keep. Deliberately has no points, badges or marks. See the Evolve Deep Reference section below.

Live URLs: **tarongatracka.com.au** (GitHub Pages, auto-deploys from `main`) and
**tarongatracka.web.app** (Firebase Hosting, manual deploy). Firebase project: `tarongatracka`,
region: `australia-southeast1`. ⚠️ See **Build & Deploy** — these two drift apart.

---

## Where we left off (2026-08-20)

### Deploy state
- Everything is **pushed to `main`**, so **tarongatracka.com.au is current**.
- **tarongatracka.web.app is behind** — last manual `firebase deploy --only hosting` was
  2026-08-13, so it is still serving the **broken stitcher**. Run
  `npm run build && firebase deploy --only hosting` to resync. See Build & Deploy.
- Firestore rules, Storage rules and Cloud Functions are all deployed and current.
- **The Storage bucket's CORS policy is now set** and lives in `cors.json`. See the CORS rule in
  Video & media pipeline. Reapply with:
  `gcloud storage buckets update gs://tarongatracka.firebasestorage.app --cors-file=cors.json`
  ⚠️ The `tarongatracka` project belongs to **thebiologybloke@gmail.com**, not ctr2560@gmail.com —
  the latter cannot see the bucket at all and the command fails with a permissions error.

### Evolve — what is built
Student flow is complete and verified end to end: opener → winding map → per chapter
(insight → 60s watch → write → film) → upload gate → stitch → film → keepsake doc in
`evolve_docs`. Teacher side has its own table plus landscape A4 pledge certificates.

**Staff portal has two Evolve tabs** (2026-08-20): **✦ Evolve** (per student: watch, download and
copy the film, plus every chapter clip, plus the souvenir link) and **🖨 Pledges** (per class:
read the koala pledges, print all certificates or just one). Both are deliberate copies of
`ZooSnoozAdminTab`'s shape rather than shared components — see the comment on `EvolveAdminTab`.

**Chapters are gated in order** (2026-08-20). A chapter needs the previous one completed *and*
the student near the animal. Sequence is tested first, so a locked card reads
"Finish Chapter Two first" rather than a distance to an animal they have no reason to walk to yet.
Chapter one is exempt from the sequence half. `EvolveScreen.jsx`, in the `EVOLVE_STORY_ORDER` map.

### Evolve — what is NOT built
1. **Advice Wall.** The giraffe chapter already writes to `evolveAdvice` with
   `status: 'pending'`, `cohortYear`, and no student name — but **nothing reads that collection**.
   ⚠️ **The consent notice was removed from the giraffe write screen on 2026-08-20** at Cameron's
   request. It was the only place a student was told their writing might be shown to others, so
   the wall now takes writing from students who were never asked. Moderation still gates what
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
5. **Kangaroo GPS.** `latitude`/`longitude` are still `null` in `evolveAnimals.js`. It is now
   **chapter one**, so it is the first thing students hit, and it currently unlocks with no
   proximity check. Needs capturing on site at the Australian Walkabout. The photo exists.
   ⚠️ This got worse when chapters became sequential — the one chapter with no GPS is now the
   gate holding the entire walk open.

### Open decisions Cameron has parked
- **Portrait vs landscape film.** Kept portrait: capture matches the film, students hold phones
  vertically, and the film is a personal keepsake. If it ever needs projecting at a school
  ceremony, the agreed option is a landscape output with the portrait clip centred and a blurred
  copy filling the sides — a change in the stitcher only, nothing students do changes.
- **"Skip the timer"** on the 60-second watch screen exists so thirty students on a schedule
  aren't locked in place for five minutes. Deliberately quiet. Remove if it gets abused.
- **Student attribution is by animal alias** (Quoll, Bilby). Evolve stores no real names, which is
  why pledge certificates and the Advice Wall are alias/cohort-attributed.

### Known live issues elsewhere
- **ZooSnooz stitching has the rAF-only bug** (audio, no picture, if backgrounded mid-stitch).
  Left unfixed deliberately to keep Evolve and ZooSnooz independent — but it is a real defect.
- **`classes/{code}` and its `students` subcollection are `allow read, write: if true`** in
  `firestore.rules` — unauthenticated write access to every student record in every class. This is
  pre-existing and a bigger hole than the teacher-enumeration one that was closed on 2026-07-27.
  Fixing it needs the Cloud Function pattern, since students have no Firebase Auth. Not started.

### Test data sitting in Firebase (safe to delete)
- Class **`EVOLVE`** — students `Bilby`, `Quoll`, with webcam test clips under `evolve/EVOLVE/`.
- Class **`GAGA`** (`547DGJ`) — Cameron's own Evolve test class, stage 4.
- Class **`K8AH7Z`** ("ZYT") — ZooYard test class; several students hold keyboard-mash responses,
  which is why its writing scores read 1.0–1.5/5.
- `zz-*.mjs` in the repo root are untracked throwaway Firestore/Storage inspection scripts.
  They embed the public web API key, which is fine. Handy templates for reading live data.

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

## Video & media pipeline — READ THIS BEFORE TOUCHING ANY FILMING CODE

Two modes record video and stitch it into a film: **ZooSnooz** (inline in `ZooSnoozScreen.jsx`)
and **Evolve** (`src/utils/evolveFilm.js`). Evolve's is a **deliberate copy**, not a shared
abstraction, so changing Evolve can never regress live ZooSnooz. **They do not inherit from each
other — a fix in one needs applying to the other by hand.**

Every rule below was learned by shipping something broken. None of it is stylistic.

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

⚠️ **ZooSnooz still has the original rAF-only loop.** It has the same latent bug: a student who
backgrounds the app mid-stitch gets a documentary with sound and no picture. Not yet fixed, on
purpose, to keep the two independent.

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
2. **Canvas setup**: offscreen `<canvas>` at **720×1280 (portrait)** — this doc previously said 1280×720, which was wrong. Draws frames at ~30fps via `requestAnimationFrame` ⚠️ see the Video & media pipeline section: rAF-only means a backgrounded stitch produces audio with no picture. Still unfixed here on purpose.
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
| `zooyardHabitats/` | ZooYard attest photos | none (students) |
| `citizenScienceEvidence/` | ZooYard Habitat Hero photos | none (students) |
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
- Finishing a chapter sets `justLit` to the *next* index, and that leg draws itself from the
  last waypoint to the new one.
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
- **`EVOLVE_MIN_WORDS` is 12**, down from 40 — these are reflections, not essays. The counter shows
  `n / 12 words` while short and just `n words` once met, so a low floor doesn't read as the target
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

### Upload gating
A student **cannot leave a chapter until its clip is fully in Storage** — the button reads
"Waiting for your clip…" and is disabled until the upload reports `done`. Walking away mid-upload
silently loses that chapter from the film. On failure they get "Try saving again", which re-uploads
the blob held in memory (no re-filming); there is deliberately no skip.

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

### Pledge certificates (`src/utils/evolvePledgeSheet.js`)
`openEvolvePledgeSheet(cls, pledges)` builds a self-contained HTML document, opens it in a new
tab from a blob URL, and lets the teacher print it or save it as a PDF — the same pattern as
`teacherInfoSheet.js`. **No PDF library.** One landscape A4 certificate per page, so a sheet can
be handed to a student or pinned up; pass a single-item array to print just one (that is what
the per-student button in the Pledge modal does).

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

`SOUVENIR_HOST` in `EvolveAdminTab` is **hard-coded to `https://tarongatracka.com.au`**, not
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
