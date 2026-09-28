// zooyardModel.js — one download of the zoo, shared by whoever asks for it.
//
// Extracted from ZooYardZoo3D so the INTRO screen can start the download while a student is
// still reading Dr. Cam's four steps. That is ten or twenty seconds of dead time which otherwise
// becomes thirty students all staring at a loading bar the moment they reach the map, which is
// the worst case and also exactly when it happens.
//
// The state is module-level on purpose: the intro and the map are different components that must
// share ONE in-flight request. A second caller joins the existing promise rather than starting a
// second 6MB download.
//
// ── Caching ──────────────────────────────────────────────────────────────────────────────────
// 6MB must download ONCE PER DEVICE, EVER, not once per session. HTTP caching will not do it:
// GitHub Pages serves with max-age=600, so a student returning after lunch would fetch the whole
// zoo again. The Cache API persists across sessions and reloads and ignores whatever cache
// headers the host sends.
//
// Fetching it ourselves also gives an honest loading bar: model-viewer's own progress event
// conflates download with decode, whereas a stream reader reports real bytes received.
//
// ⚠️ Bump MODEL_CACHE whenever the .glb changes, or devices keep serving the old zoo forever.
export const MODEL_URL = '/models/taronga-zoo.glb';
const MODEL_CACHE = 'zooyard-model-v2-baked';

let pending = null;          // in-flight promise, shared by every caller
let resolvedUrl = null;      // the object URL once it exists
let lastPct = 0;
let lastFromCache = false;
const listeners = new Set();

function emit(pct, cached) {
  lastPct = pct;
  if (cached) lastFromCache = true;
  listeners.forEach(fn => { try { fn(pct, lastFromCache); } catch { /* a bad listener is not fatal */ } });
}

// Current state, for a component mounting midway through a download that is already running.
export function zooModelState() {
  return { pct: lastPct, fromCache: lastFromCache, url: resolvedUrl };
}

export function onZooModelProgress(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

async function download() {
  // Every branch falls back to the plain URL rather than failing. The Cache API is missing in
  // some private-browsing modes, and a locked-down school device is exactly where that bites.
  let cache = null;
  try {
    if (typeof caches !== 'undefined') {
      cache = await caches.open(MODEL_CACHE);
      // Drop older versions so a stale zoo is not left sitting in storage.
      const keys = await caches.keys();
      await Promise.all(keys
        .filter(k => k.startsWith('zooyard-model-') && k !== MODEL_CACHE)
        .map(k => caches.delete(k)));
      const hit = await cache.match(MODEL_URL);
      if (hit) {
        emit(100, true);                              // cached: no bar, no wait
        return URL.createObjectURL(await hit.blob());
      }
    }
  } catch { /* fall through and just download it */ }

  try {
    const res = await fetch(MODEL_URL);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const total = Number(res.headers.get('content-length')) || 0;

    // Tee the stream so the cache gets an untouched copy while we read bytes for the progress
    // bar. Without this, reading the body consumes it and leaves nothing to store.
    let forCache = null, forRead = res;
    if (cache && res.body) {
      const [a, b] = res.body.tee();
      forCache = new Response(a, { headers: res.headers });
      forRead = new Response(b, { headers: res.headers });
    }

    let blob;
    if (forRead.body && total) {
      const reader = forRead.body.getReader();
      const chunks = [];
      let got = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        got += value.length;
        emit(Math.min(99, Math.round((got / total) * 100)), false);
      }
      blob = new Blob(chunks);
    } else {
      blob = await forRead.blob();                    // no content-length: indeterminate
    }

    if (cache && forCache) {
      try { await cache.put(MODEL_URL, forCache); } catch { /* quota */ }
    }
    emit(100, false);
    return URL.createObjectURL(blob);
  } catch (e) {
    console.warn('[zooyard] model prefetch failed, letting model-viewer fetch it:', e);
    return MODEL_URL;
  }
}

// Safe to call from anywhere, any number of times. The first call starts the download; every
// later one joins it, or returns the finished URL straight away.
export function preloadZooModel() {
  if (resolvedUrl) return Promise.resolve(resolvedUrl);
  if (!pending) {
    pending = download().then(url => { resolvedUrl = url; return url; });
  }
  return pending;
}

// ⚠️ The object URL is deliberately NEVER revoked. It is shared between the intro and the map,
// and survives a student going back and forth between habitats, so revoking on any one
// component's unmount would break the next mount. It costs ~6MB held for the session and the
// browser reclaims it on page unload; refcounting consumers to save that is not worth the bugs.
