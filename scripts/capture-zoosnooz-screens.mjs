// capture-zoosnooz-screens — REAL screenshots of the running ZooSnooz student flow.
//
// Feeds docs/staff-guide/screenshots/, which feeds scripts/build-zoosnooz-staff-guide.py.
//
//   npm run dev                                   # note the port it picks
//   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
//     --headless=new --remote-debugging-port=9333 --user-data-dir=/tmp/zzshots \
//     --hide-scrollbars --use-fake-device-for-media-stream --use-fake-ui-for-media-stream \
//     --use-file-for-fake-video-capture=/tmp/tiger.y4m --enable-unsafe-swiftshader about:blank
//   SHOTS=/tmp/zzshots-out BASE=http://localhost:5174 node scripts/capture-zoosnooz-screens.mjs
//
// ⚠️ THE FOUR FLAGS ARE NOT OPTIONAL, and each one was learned by it failing:
//   --enable-unsafe-swiftshader        without it MediaRecorder produces a zero-byte blob and the
//                                      app correctly reports "Recording failed - no video was
//                                      captured". It is the software rasteriser the encoder needs.
//   --use-file-for-fake-video-capture  the built-in fake camera is a lurid green test pattern. A
//                                      y4m made from an animal photo gives a viewfinder worth
//                                      printing: ffmpeg -loop 1 -i public/images/tiger.jpg -t 25
//                                      -r 12 -vf scale=854:480 -pix_fmt yuv420p /tmp/tiger.y4m
//   --use-fake-ui-for-media-stream     auto-grants the camera, which has no UI to click here.
//   --hide-scrollbars                  a scrollbar down the side of every screenshot.
//
// ⚠️ GPS is how an animal unlocks, so each one is reached with Emulation.setGeolocationOverride
//    at its own coordinates out of data/zoosnoozAnimals.js. There is no demo bypass in ZooSnooz.
//
// ⚠️ The session is seeded straight into localStorage rather than joining a real class, so no
//    Firestore document is created and nothing reaches a real class. Uploads fail, which is
//    expected and harmless — the screens still render. 🚫 Never point this at a live class code.
//
// 🚫 THIS PROVES NOTHING ABOUT THE PIPELINE. It drives a stitch end to end, which is useful for
//    pictures and is NOT evidence the stitcher works: headless Chrome is not WKWebView, the fake
//    camera is not a phone sensor, and the rule in CLAUDE.md stands — capture, playback and
//    stitching are only verified by a human holding a real device.

import { writeFileSync, mkdirSync } from 'node:fs';

const PORT  = process.env.CDP_PORT || 9333;
const BASE  = process.env.BASE  || 'http://localhost:5173';
const SHOTS = process.env.SHOTS || '/tmp/zzshots-out';
mkdirSync(SHOTS, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── a minimal CDP client on Node's global WebSocket (Node 22+) ──────────────
class Cdp {
  constructor(ws) { this.ws = ws; this.id = 0; this.waiters = new Map(); }
  static async open(url) {
    const ws = new WebSocket(url);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    const c = new Cdp(ws);
    ws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && c.waiters.has(msg.id)) {
        const { res, rej } = c.waiters.get(msg.id);
        c.waiters.delete(msg.id);
        msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
      } else if (msg.method === 'Page.javascriptDialogOpening') {
        // ⚠️ ZooSnooz guards leaving a mission with a confirm(), and an unanswered dialog
        //    wedges the whole renderer — Page.navigate and Runtime.evaluate then time out and
        //    it looks like the harness has crashed. Always answer them.
        c.ws.send(JSON.stringify({ id: ++c.id, method: 'Page.handleJavaScriptDialog', params: { accept: true } }));
      }
    };
    return c;
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.waiters.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => { if (this.waiters.delete(id)) rej(new Error('timeout ' + method)); }, 30000);
    });
  }
  async evaluate(expression) {
    const r = await this.send('Runtime.evaluate', {
      expression: `(async () => { ${expression} })()`, awaitPromise: true, returnByValue: true,
    });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval threw');
    return r.result.value;
  }
  async shot(name) {
    const r = await this.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`${SHOTS}/${name}.png`, Buffer.from(r.data, 'base64'));
    console.log('  shot', name);
  }
}

const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const page = list.find(t => t.type === 'page');
if (!page) throw new Error('no page target — is Chrome running with --remote-debugging-port?');
const c = await Cdp.open(page.webSocketDebuggerUrl);

await c.send('Page.enable');
await c.send('Runtime.enable');
// A phone, because every one of these screens is designed for one.
await c.send('Emulation.setDeviceMetricsOverride', { width: 402, height: 874, deviceScaleFactor: 3, mobile: true });
await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await c.send('Browser.grantPermissions', { permissions: ['geolocation', 'videoCapture', 'audioCapture'] });

async function goto(url) {
  // ⚠️ The load event can never fire (App Check's reCAPTCHA iframe), so a timeout here is normal.
  try { await c.send('Page.navigate', { url }); } catch { /* see above */ }
  await sleep(7000);
}
async function geo(latitude, longitude) {
  await c.send('Emulation.setGeolocationOverride', { latitude, longitude, accuracy: 5 });
}
async function buttons() {
  return c.evaluate(`return [...document.querySelectorAll('button')].map(b => (b.innerText||'').replace(/\\s+/g,' ').trim());`);
}
async function click(text) {
  const ok = await c.evaluate(`
    const t = ${JSON.stringify(text)}.toLowerCase();
    const el = [...document.querySelectorAll('button,.discovery-card')]
      .find(e => (e.innerText||'').replace(/\\s+/g,' ').toLowerCase().includes(t));
    if (!el) return false;
    el.scrollIntoView({ block: 'center' }); el.click(); return true;
  `);
  await sleep(1400);
  return ok;
}
async function type(selector, value) {
  await c.evaluate(`
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return false;
    Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value').set.call(el, ${JSON.stringify(value)});
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  `);
  await sleep(600);
}
// ⚠️ Hold the tracker by position, captured ONCE. The button relabels itself while held, so
//    re-finding it by its text works the first time and fails every time after.
async function boxOf(minPx, maxPx) {
  return c.evaluate(`
    const b = [...document.querySelectorAll('button')].find(x => { const r = x.getBoundingClientRect();
      return r.width > ${minPx} && r.width < ${maxPx} && r.height > ${minPx} && r.height < ${maxPx}; });
    if (!b) return null; const r = b.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  `);
}
async function press(box, ms) {
  await c.send('Input.dispatchMouseEvent', { type: 'mousePressed',  x: box.x, y: box.y, button: 'left', clickCount: 1 });
  await sleep(ms);
  await c.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x, y: box.y, button: 'left', clickCount: 1 });
}

const TIGER = { lat: -33.8433, lon: 151.2394 };   // data/zoosnoozAnimals.js
const OBSERVATION =
  'The tiger stayed very still with its head low and its ears pointing forward. It was watching one ' +
  'spot near the fence. Then it stood up and walked slowly along the edge of the grass without making a sound.';

await geo(TIGER.lat, TIGER.lon);
await goto(BASE);
await c.evaluate(`
  localStorage.setItem('tarongaStudentName', JSON.stringify('Quoll'));
  localStorage.setItem('tarongaClassCode',   JSON.stringify('ZZDEMO'));
  localStorage.setItem('tarongaSessionType', JSON.stringify('zoosnooz'));
  localStorage.setItem('tarongaClassStage',  JSON.stringify(2));
  localStorage.setItem('tarongaClassSubject',JSON.stringify('science'));
  return 1;
`);
await goto(BASE);

await c.shot('01-map');
await click('Begin Mission');
await c.shot('02-insight');

await click('BEGIN MISSION →');
await sleep(3000);
const pad = await boxOf(60, 200);
for (const ms of [4500, 3000, 5000, 2500]) { await press(pad, ms); await sleep(2000); }
await sleep(14000);                                   // let the 30s tracker finish
await c.shot('03-interaction');

await click('INTERPRET THE DATA');
await sleep(2000);
await c.shot('04-mcq');
const opts = (await buttons()).filter(b => b.length > 18 && !/MAP|CONTINUE|HINT|SKIP/i.test(b));
await click(opts[1]);
await sleep(2000);
await c.shot('05-mcq-result');

await click('CONTINUE');
await sleep(2000);
await c.shot('06-observation-timer');                 // the 20-second watch dial
await click('Skip timer');
await sleep(2000);
await type('textarea', OBSERVATION);
await c.shot('07-observation');

await click('CAPTURE VIDEO');
await sleep(6000);
await c.shot('08-camera');
const shutter = await boxOf(68, 112);
await press(shutter, 150);
await sleep(13000);                                   // the clip is 10s and stops itself
// ⚠️ The upload fails here because ZZDEMO is not a real class, and the banner saying so would
//    be the one untrue thing in the guide. Remove it from the DOM before the frame is taken.
await c.evaluate(`
  [...document.querySelectorAll('*')]
    .filter(e => e.children.length === 0 && /Upload failed/i.test(e.textContent || ''))
    .forEach(e => { let n = e;
      for (let i = 0; i < 3 && n.parentElement; i++) {
        const r = n.getBoundingClientRect();
        if (r.height > 20 && r.width > 200) break;
        n = n.parentElement;
      }
      n.remove(); });
  return 1;
`);
await c.shot('09-clip-card');

await click('COMPLETE MISSION');
await sleep(3500);
await c.shot('10-badge');

await click('BACK TO MAP');
await sleep(3000);
await click('SUBMIT SESSION');                        // goes straight into the stitch
await sleep(35000);
await c.shot('11-documentary');

console.log('\ndone —', SHOTS);
console.log('crop them for the guide, then: python3 scripts/build-zoosnooz-staff-guide.py');
process.exit(0);
