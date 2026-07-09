# Taronga Tracka — CLAUDE.md

## What is this project?

Taronga Tracka is an educational field-study app for school excursions to Taronga Zoo Sydney. Students use the app to make animal observations, complete missions, earn badges, and participate in class challenges. Teachers manage classes and track progress through a portal. A staff portal (Taronga admin) manages codes, approves submissions, and oversees the whole program.

There is also **ZooSnooz** — a separate night-mode variant with NFC stations, keeper interactions, video recording, and a documentary stitching pipeline, sharing the same codebase.

Live URL: deployed to Firebase Hosting (project: `tarongatracka`), region: `australia-southeast1`.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| State | React Context (no Redux/Zustand) |
| Backend | Firebase — Firestore, Auth (email magic link), Storage, Functions v2 |
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
│   │   └── nswPublicSchools.json # School name autocomplete list
│   └── utils/
│       ├── teacherInfoSheet.js   # EXHIBITS, SCORING, STAGE_EXPECTATIONS, NSW_OUTCOMES
│       ├── scoring.js            # buildObservationScore + subject variants
│       └── helpers.js            # normaliseCode, safeStudentId, getMinWords, isLowQualityResponse
├── functions/
│   └── index.js              # Cloud Functions: sendMagicLink, onDeviceBookingCreated
├── public/                   # Static assets served as-is
│   ├── images/               # logo.png, taronga-zoo-white.png, animal photos, map
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
| **Teachers** | Firebase Auth — passwordless magic link email (`sendMagicLink` Cloud Function + Resend) |
| **Students** | No auth — class code + chosen alias stored in `localStorage` |
| **Staff (Taronga admin)** | Code-based — access code checked against `adminAccess` Firestore collection; no Firebase Auth |

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
| `sendMagicLink` | HTTPS (public) | Generates Firebase email sign-in link, sends via Resend |
| `onDeviceBookingCreated` | Firestore `onDocumentCreated` on `deviceBookings/{id}` | Emails `ctr2560@gmail.com` with booking details |

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

### Firebase Storage rules — IMPORTANT WARNING

**There is no `storage.rules` file in the repo.** Storage rules are managed directly in the Firebase Console. The ZooSnooz video upload path `zoosnooz/` must be publicly writable (or at minimum writable by unauthenticated users, since students have no Firebase Auth). If uploads start failing, check the Firebase Console Storage rules — they likely need:
```
match /zoosnooz/{allPaths=**} {
  allow read, write: if true;
}
```
Do not create a `storage.rules` file locally without also wiring it into `firebase.json` under a `"storage"` key, otherwise it will be silently ignored.

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
| `documentaryViewer` | `DocumentaryViewer.jsx` | NFC souvenir card; triggered by `docViewCode` in AppContext |
| `teacherLogin` | `TeacherLoginScreen.jsx` | Magic link email entry |
| `teacherDashboard` | `TeacherDashboardScreen.jsx` | Quick actions, class cards, resource cards, challenge tile |
| `createClass` | `CreateClassScreen.jsx` | Create class form; sets stage, subject, session type, access code |
| `classDetails` | `ClassDetailsScreen.jsx` | Per-class analytics, student list, RadarSVG, ZooSnooz data, info sheet |
| `teacherGuide` | `TeacherGuideScreen.jsx` | Timeline checklist, 4 phases, tap-to-tick, localStorage progress |
| `teacherMap` | `TeacherMapScreen.jsx` | Zoo map with student pins, zoom in/out, starts at 0.8 scale |
| `curriculumAlignment` | `CurriculumAlignmentScreen.jsx` | NSW outcomes, exhibit flip cards, by subject/stage |
| `resourceHub` | `ResourceHubScreen.jsx` | Downloadable resource list with search + category filter |
| `excursionPlan` | `ExcursionPlanScreen.jsx` | 9 flip-tile planning checklist with real links |
| `deviceBooking` | `DeviceBookingScreen.jsx` | Teacher-facing device calendar wrapper |
| `accessibility` | `AccessibilityScreen.jsx` | 6-need accessibility guide, pre-visit checklist, PDF downloads |
| `conservationGallery` | `ConservationGalleryScreen.jsx` | Polaroid masonry wall of approved submissions |
| `adminLogin` | `AdminLoginScreen.jsx` | Staff access code entry |
| `adminDashboard` | `AdminDashboardScreen.jsx` | Staff portal: 5 tabs — Overview, Classes, Challenges, Feedback, Bookings |
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
| `demoMode` | boolean | Demo flag; disables GPS requirement |
| `docViewCode` | string\|null | Triggers `DocumentaryViewer` when set; format `zzv_{animalId}_{classCode}_{studentId}` |
| `zzScreen` | string | ZooSnooz internal sub-router screen |
| `setZzScreen` | fn | Navigate within ZooSnooz |

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

11. **ZooSnooz video upload requires open Storage rules** — students are unauthenticated (no Firebase Auth). Storage path `zoosnooz/` must allow unauthenticated writes. Rules are managed in Firebase Console only (no local `storage.rules` file). If video uploads fail silently, check Console Storage rules first.

12. **Canvas stitching is CPU-heavy** — it runs on the main thread using `requestAnimationFrame`. On low-end devices it may be slow or fail. The fallback message ("stitching not supported on this device") handles this gracefully — do not add server-side fallbacks without a significant architecture change.

13. **ZooSnooz data is duplicated** — animal scores live on the student doc under `zoosnooz.{animalId}` AND a summary is written to `zoosnooz_docs/{classCode}_{studentId}`. Keep both in sync when modifying the submission flow.

14. **`docViewCode` triggers DocumentaryViewer** — set `docViewCode` in AppContext to render the souvenir card screen. Clearing it (set to `null`) returns to the normal app. The NFC URL format is `zzv_{animalId}_{classCode}_{studentId}`.
