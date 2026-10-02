import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyCFS0oFiThCyjgoRxgoJ6nyO34fzgyW2IM",
  authDomain: "tarongatracka.firebaseapp.com",
  projectId: "tarongatracka",
  storageBucket: "tarongatracka.firebasestorage.app",
  messagingSenderId: "925190436532",
  appId: "1:925190436532:web:47d2c5016dc1b28d7d09e1"
};

// The apiKey above is NOT a secret and never has been. It identifies the project; it does
// not authorise anything. Firebase keys are meant to ship in the browser. What actually
// guards the data is firestore.rules, storage.rules and App Check below.

const app = initializeApp(firebaseConfig);

// ─────────────────────────────────────────────────────────────────────────────────────────
// App Check — proves a request came from the real app, not a script.
//
// ⚠️ WHY. Students have no logins, so large parts of Firestore and Storage must accept
// unauthenticated requests for the app to work at all. That means anyone who copies the
// config above (it is in the public bundle) can read and write the same data from a script.
// Demonstrated against the live project on 2026-10-02: an unauthenticated script read 104
// student records in 1.4s and listed every student video in Storage.
//
// App Check does not replace the rules. It narrows WHO can reach them: a request without a
// valid attestation token is rejected before the rules are evaluated.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// ⚠️⚠️ ROLLOUT — READ BEFORE ENABLING ENFORCEMENT IN THE FIREBASE CONSOLE ⚠️⚠️
//
// This code is deliberately INERT until VITE_APPCHECK_SITE_KEY is set, so it is safe to
// ship today and turn on later. Enabling it is a three-step job, in this order:
//
//   1. Firebase Console → App Check → register the web app with reCAPTCHA v3. Copy the
//      SITE key (public, belongs in .env; the SECRET key stays in the Console).
//   2. Put `VITE_APPCHECK_SITE_KEY=<site key>` in `.env` and in the GitHub Actions build
//      env, then deploy. Tokens now flow but NOTHING is blocked yet — watch the Console's
//      "unverified requests" metric until it reads close to zero for real traffic.
//   3. ONLY THEN turn on Enforcement, per service (Firestore, then Storage).
//
// 🚫 DO NOT skip to step 3. The moment enforcement is on, anything not sending a token is
//    cut off instantly, and that includes:
//      · WILDLY BY TARONGA — a separate repo on a different domain sharing THIS Firebase
//        project. If Wildly is not also sending App Check tokens, enforcing here takes
//        Wildly down. Do that repo first or at the same time, never after.
//      · the `zz-*.mjs` inspection scripts in this repo (expected — that is the point).
//      · any half-finished student session on a device that has not reloaded.
//
// For local development, set a debug token: run with VITE_APPCHECK_DEBUG=true, copy the
// token the browser console prints, and register it under App Check → Manage debug tokens.
const appCheckSiteKey = import.meta.env.VITE_APPCHECK_SITE_KEY;
if (appCheckSiteKey) {
  if (import.meta.env.VITE_APPCHECK_DEBUG === 'true') {
    // Firebase reads this global; it must be set before initializeAppCheck runs.
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (err) {
    // Never let an App Check failure take the whole app down for a class mid-excursion.
    // With enforcement ON the requests will fail anyway and that is the correct outcome;
    // with enforcement OFF the app carries on exactly as before.
    console.warn('[appCheck] could not initialise:', err);
  }
}

export const db        = getFirestore(app);
export const storage   = getStorage(app);
export const auth      = getAuth(app);
export const functions = getFunctions(app, 'australia-southeast1');
export default app;
