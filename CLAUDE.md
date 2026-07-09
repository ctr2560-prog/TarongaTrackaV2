# Taronga Tracka — CLAUDE.md

## What is this project?

Taronga Tracka is an educational field-study app for school excursions to Taronga Zoo Sydney. Students use the app to make animal observations, complete missions, earn badges, and participate in class challenges. Teachers manage classes and track progress through a portal. A staff portal (Taronga admin) manages codes, approves submissions, and oversees the whole program.

There is also **ZooSnooz** — a separate night-mode variant with NFC stations, keeper interactions, and bonus scoring, sharing the same codebase.

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
│   │   ├── [all screens...]
│   │   └── missions/         # Per-animal mission JSX files
│   ├── components/
│   │   ├── DeviceBookingCalendar.jsx   # Shared calendar, mode='teacher'|'staff'
│   │   └── [other components...]
│   └── utils/
│       ├── teacherInfoSheet.js   # EXHIBITS, SCORING, STAGE_EXPECTATIONS, NSW_OUTCOMES
│       ├── scoring.js
│       └── helpers.js
├── functions/
│   └── index.js              # Cloud Functions: sendMagicLink, onDeviceBookingCreated
├── public/                   # Static assets served as-is
│   ├── images/               # logo.png, taronga-zoo-white.png, animal photos, map
│   └── *.pdf                 # Venue safety, accessibility PDFs
├── firestore.rules
├── firebase.json
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
| `zoosnooz_docs/{docId}` | ZooSnooz session data |
| `deviceBookings/{bookingId}` | Tracka device booking calendar entries |
| `resources/{docId}` | (Reserved for future resource library) |

---

## Cloud Functions (`functions/index.js`)

| Function | Trigger | What it does |
|---|---|---|
| `sendMagicLink` | HTTPS (public) | Generates Firebase email sign-in link, sends via Resend |
| `onDeviceBookingCreated` | Firestore `onDocumentCreated` on `deviceBookings/{id}` | Emails `ctr2560@gmail.com` with booking details |

Deploy: `firebase deploy --only functions`

Resend API key stored in Firebase Functions config/environment.

---

## Key Screens

### Student flow
`home` → `studentJoin` / `schoolEntry` → `studentLoading` (transient) → `map` → `animal` → `observation` → `submissionComplete` → `badge` / `collection`

### ZooSnooz flow
`home` → `studentJoin` → `studentLoading` → `zoosnooz` (internal sub-router via `zzScreen` state)

### Teacher flow
`teacherLogin` → `teacherDashboard` → `createClass` / `classDetails` / `resourceHub` / `curriculumAlignment` / `teacherGuide` / `teacherMap` / `excursionPlan` / `deviceBooking` / `accessibility` / `conservationGallery`

### Staff (admin) flow
`adminLogin` → `adminDashboard` (tabs: Overview, Classes, Challenges, Feedback, Bookings)

### Public flow
`publicEntry` → `publicAnimal` / `publicMission` / `publicLeaderboard`

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

Animal photos are served from `/images/` with filenames matching animal keys (e.g. `giraffe.jpg`).

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
firebase deploy --only hosting

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

3. **Challenge tile status** — uses a `rank()` function (approved=2, pending=1, rejected=0) to pick the best status across multiple submissions. Most-recent-wins logic was a bug that masked approved submissions.

4. **`studentLoading` is transient** — it auto-advances to `map` after loading. It must stay in `TRANSIENT_SCREENS` so `replaceState` is used and the back button skips it.

5. **Conservation Gallery** — `challengeSubmissions` with `inGallery: true` and `galleryAt` timestamp. Staff toggle via `toggleGallery()` in AdminDashboardScreen.

6. **Back button on teacher screens** — prefer `window.history.back()` with a fallback (e.g. `setCurrentScreen('teacherDashboard')`) over hardcoded destinations. This preserves natural back-stack navigation.

7. **ZooSnooz sub-router** — `zzScreen` state in AppContext acts as a secondary router inside the ZooSnooz session. Don't confuse it with `currentScreen`.

8. **School name on class creation** — teachers enter school name when creating an account (stored in `teacherProfile.schoolName`). Used in device bookings and leaderboard.

9. **Firebase region** — always `australia-southeast1`. The `functions` export in `firebase.js` specifies this region.

10. **`drawings accepted` is wrong** — the app only accepts text/dictation for literacy. Never reintroduce "drawings accepted" claims in AccessibilityScreen or elsewhere.
