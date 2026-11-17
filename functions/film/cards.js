/* cards.js — the ZooSnooz film's title cards and its header/footer, drawn without a browser.
 *
 * ⚠️⚠️ THIS IS A PORT, NOT A NEW DESIGN. Every number here comes from the stitcher in
 *    src/screens/ZooSnoozScreen.jsx, which is what a student's own phone draws. A film built
 *    here must be indistinguishable from one built there.
 * 🚫 Do not "improve" a colour, a size or an offset on this side alone — the two would drift
 *    and nobody would notice until a class had one of each.
 */
const path = require('path');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');

const W = 720, H = 1280, TOP = 80, BOT = 260;
const BOTY = H - BOT, RCX = W - 80, TEXTMAXW = RCX - 40 - 26;
const ASSETS = path.join(__dirname, 'assets');

let fontsReady = false;
function registerFonts() {
  if (fontsReady) return;
  const f = p => path.join(ASSETS, 'fonts', p);
  GlobalFonts.registerFromPath(f('TarongaHeadline-Regular.ttf'), 'Taronga Headline');
  GlobalFonts.registerFromPath(f('DMSans-Regular.ttf'),  'DM Sans');
  GlobalFonts.registerFromPath(f('DMSans-SemiBold.ttf'), 'DM Sans SemiBold');
  GlobalFonts.registerFromPath(f('DMSans-Bold.ttf'),     'DM Sans Bold');
  GlobalFonts.registerFromPath(f('DMSans-Italic.ttf'),   'DM Sans Italic');
  fontsReady = true;
}

// ⚠️ Skia picks a face by FAMILY, and will not synthesise DM Sans's 600 from its 400 the way a
//    browser does. Each weight is registered as its own family and named here instead, so the
//    canvas font strings stay one-for-one with the app's.
const DM  = (size, weight) =>
  `${size}px "${weight >= 700 ? 'DM Sans Bold' : weight >= 600 ? 'DM Sans SemiBold' : 'DM Sans'}"`;
const DMI = size => `${size}px "DM Sans Italic"`;
const TH  = size => `${size}px "Taronga Headline"`;

const ANIMALS = {
  tiger:      { name: 'Sumatran Tiger',               sci: 'Panthera tigris sumatrae' },
  lion:       { name: 'African Lion',                 sci: 'Panthera leo' },
  rhino:      { name: 'Greater One-Horned Rhinoceros', sci: 'Rhinoceros unicornis' },
  binturong:  { name: 'Binturong',                    sci: 'Arctictis binturong' },
  'sun-bear': { name: 'Sun Bear',                     sci: 'Helarctos malayanus' },
};
const ORDER = Object.keys(ANIMALS);

const img = (f) => loadImage(path.join(ASSETS, 'img', f)).catch(() => null);

async function artwork(ids) {
  const art = {};
  for (const id of ids) {
    art[id] = { photo: await img(`${id}.jpg`), badge: await img(`badge-${id}.webp`) };
  }
  return { ...art, logo: await img('logo.png') };
}

function newCanvas() {
  registerFonts();
  const c = createCanvas(W, H);
  return { c, ctx: c.getContext('2d') };
}

function drawBg(ctx) {
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#020D06'); bg.addColorStop(0.5, '#040F08'); bg.addColorStop(1, '#071E14');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
}

function drawLogoCircle(ctx, logo, cx, cy, size) {
  if (!logo) return;
  const r = size / 2;
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(logo, cx - r, cy - r, size, size);
  ctx.restore();
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(46,125,85,0.85)'; ctx.lineWidth = 6;
  ctx.stroke();
  ctx.restore();
}

function intro(art, dateStr) {
  const { c, ctx } = newCanvas();
  const logoY = H * 0.32;
  drawBg(ctx);
  [[0.12,0.08],[0.88,0.06],[0.35,0.14],[0.65,0.11],[0.78,0.19],[0.22,0.22]].forEach(([sx, sy]) => {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(sx * W, sy * H, 1.5, 0, Math.PI * 2); ctx.fill();
  });
  const glow = ctx.createRadialGradient(W/2, logoY, 0, W/2, logoY, 340);
  glow.addColorStop(0, 'rgba(46,125,85,0.32)'); glow.addColorStop(1, 'rgba(46,125,85,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  drawLogoCircle(ctx, art.logo, W/2, logoY, 280);
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white'; ctx.font = TH(80);
  ctx.fillText('ZOOSNOOZ', W/2, H * 0.62);
  ctx.fillStyle = '#4A9E6B'; ctx.font = TH(48);
  ctx.fillText('DOCUMENTARY', W/2, H * 0.62 + 70);
  ctx.save(); ctx.strokeStyle = 'rgba(46,125,85,0.45)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W/2-180, H*0.62+104); ctx.lineTo(W/2+180, H*0.62+104); ctx.stroke(); ctx.restore();
  ctx.fillStyle = 'rgba(168,196,178,0.7)'; ctx.font = DM(26, 400);
  ctx.fillText('Taronga Zoo Sydney', W/2, H * 0.62 + 144);
  ctx.fillStyle = 'rgba(168,196,178,0.45)'; ctx.font = DM(20, 400);
  ctx.fillText(dateStr, W/2, H * 0.88);
  return c.toBuffer('image/png');
}

function animalCard(art, a, i, n) {
  const { c, ctx } = newCanvas();
  const meta = ANIMALS[a.id];
  let nameSize = 78;
  ctx.font = TH(nameSize);
  while (ctx.measureText(meta.name).width > W - 110 && nameSize > 34) { nameSize -= 3; ctx.font = TH(nameSize); }
  const finalNameSize = nameSize;
  drawBg(ctx);
  const photo = art[a.id]?.photo;
  if (photo) {
    const pa = photo.width / photo.height, fa = W / H;
    let dw, dh;
    if (pa > fa) { dh = H; dw = dh * pa; } else { dw = W; dh = dw / pa; }
    // ⚠️ The app applies `filter: brightness(0.46) saturate(0.85)` here. Skia has no CSS filter,
    //    so the same darkening is done with a flat black veil at the matching opacity over the
    //    photo only — the vignette and ramps below are unchanged and do the rest.
    ctx.drawImage(photo, (W - dw) / 2, (H - dh) / 2, dw, dh);
    ctx.fillStyle = 'rgba(0,0,0,0.54)'; ctx.fillRect(0, 0, W, H);
    const vig = ctx.createRadialGradient(W/2, H*0.42, 80, W/2, H*0.42, H*0.72);
    vig.addColorStop(0, 'rgba(2,13,6,0)'); vig.addColorStop(1, 'rgba(2,13,6,0.85)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
  }
  const ramp = ctx.createLinearGradient(0, H*0.40, 0, H);
  ramp.addColorStop(0, 'rgba(2,13,6,0)'); ramp.addColorStop(0.55, 'rgba(2,13,6,0.82)'); ramp.addColorStop(1, 'rgba(2,13,6,0.97)');
  ctx.fillStyle = ramp; ctx.fillRect(0, H*0.40, W, H*0.60);
  const topRamp = ctx.createLinearGradient(0, 0, 0, 220);
  topRamp.addColorStop(0, 'rgba(0,0,0,0.70)'); topRamp.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = topRamp; ctx.fillRect(0, 0, W, 220);

  ctx.textAlign = 'left';
  // The app letter-spaces this label by 6px. Skia has no letterSpacing, so it is drawn a
  // character at a time at the same advance.
  ctx.fillStyle = 'rgba(168,196,178,0.75)'; ctx.font = DM(22, 700);
  let x = 54;
  for (const ch of `ANIMAL ${i + 1} OF ${n}`) { ctx.fillText(ch, x, 74); x += ctx.measureText(ch).width + 6; }
  ctx.fillStyle = 'rgba(168,196,178,0.4)'; ctx.font = DM(20, 400);
  ctx.fillText('\u{1F319} ZooSnooz', 54, 108);

  const by = H * 0.54;
  const badge = art[a.id]?.badge;
  if (badge) {
    const bs = 168;
    ctx.save();
    const halo = ctx.createRadialGradient(W/2, by, 0, W/2, by, bs*0.78);
    halo.addColorStop(0, 'rgba(46,125,85,0.42)'); halo.addColorStop(1, 'rgba(46,125,85,0)');
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(W/2, by, bs*0.78, 0, Math.PI*2); ctx.fill();
    ctx.drawImage(badge, W/2 - bs/2, by - bs/2, bs, bs);
    ctx.restore();
  }
  ctx.textAlign = 'center';
  const nameY = by + 150 + finalNameSize * 0.34;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.75)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 3;
  ctx.fillStyle = 'white'; ctx.font = TH(finalNameSize);
  ctx.fillText(meta.name, W/2, nameY);
  ctx.restore();
  const ruleY = nameY + 34;
  ctx.save(); ctx.strokeStyle = 'rgba(168,196,178,0.45)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W/2 - 44, ruleY); ctx.lineTo(W/2 + 44, ruleY); ctx.stroke(); ctx.restore();
  ctx.fillStyle = 'rgba(168,196,178,0.92)'; ctx.font = DMI(30);
  ctx.fillText(meta.sci || '', W/2, ruleY + 46);

  const pr = 7, gap = 26, py = H - 82, spread = (n - 1) * gap;
  for (let k = 0; k < n; k++) {
    const dx = W/2 - spread/2 + k*gap;
    ctx.beginPath();
    if (k === i) {
      ctx.fillStyle = '#4ADE80'; ctx.arc(dx, py, pr, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.strokeStyle = 'rgba(74,222,128,0.45)'; ctx.lineWidth = 2;
      ctx.arc(dx, py, pr + 7, 0, Math.PI*2); ctx.stroke();
    } else {
      ctx.fillStyle = k < i ? 'rgba(74,222,128,0.45)' : 'rgba(168,196,178,0.22)';
      ctx.arc(dx, py, pr - 2, 0, Math.PI*2); ctx.fill();
    }
  }
  return c.toBuffer('image/png');
}

// The header and footer that sit OVER the footage. Transparent everywhere else.
function overlay(art, a, dStr) {
  const { c, ctx } = newCanvas();
  const title = a.title || ANIMALS[a.id].name;
  {
    const topScrim = ctx.createLinearGradient(0, 0, 0, TOP + 70);
    topScrim.addColorStop(0, 'rgba(0,0,0,0.72)'); topScrim.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topScrim; ctx.fillRect(0, 0, W, TOP + 70);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.font = DM(22, 600); ctx.textAlign = 'left';
  ctx.fillText('Taronga Zoo Sydney', 24, TOP/2 + 8);
  ctx.fillStyle = 'rgba(255,255,255,0.48)'; ctx.font = DM(20, 400); ctx.textAlign = 'right';
  ctx.fillText(dStr, W - 24, TOP/2 + 8);
  {
    const capScrim = ctx.createLinearGradient(0, BOTY - 90, 0, H);
    capScrim.addColorStop(0, 'rgba(2,8,5,0)');
    capScrim.addColorStop(0.42, 'rgba(2,8,5,0.80)');
    capScrim.addColorStop(1, 'rgba(2,8,5,0.95)');
    ctx.fillStyle = capScrim; ctx.fillRect(0, BOTY - 90, W, H - BOTY + 90);
  }
  if (art.logo) {
    // ⚠️ The app draws the logo through `brightness(0) invert(1)` — a white silhouette. With no
    //    CSS filters here it is punched out of a white rectangle instead, which is the same
    //    result: every opaque pixel of the logo becomes white.
    const lH = 55, lW = Math.round(art.logo.width * (lH / art.logo.height));
    const { c: mc, ctx: mctx } = newCanvas();
    mctx.drawImage(art.logo, 0, 0, lW, lH);
    mctx.globalCompositeOperation = 'source-in';
    mctx.fillStyle = '#fff'; mctx.fillRect(0, 0, lW, lH);
    ctx.save(); ctx.globalAlpha = 0.8;
    ctx.drawImage(mc, 0, 0, lW, lH, RCX - lW/2, BOTY + 18, lW, lH);
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(168,196,178,0.6)'; ctx.font = DM(15, 400); ctx.textAlign = 'center';
  ctx.fillText('#ZooSnooz', RCX, BOTY + 90); ctx.fillText('#TarongaTracka', RCX, BOTY + 110);
  ctx.textAlign = 'left';
  ctx.fillStyle = 'white'; ctx.font = TH(44);
  ctx.fillText('I WENT TO ZOOSNOOZ!', 24, BOTY + 55);
  ctx.fillStyle = '#A8C4B2'; ctx.font = DM(22, 600);
  let t = title;
  while (ctx.measureText(t).width > TEXTMAXW && t.length > 1) t = t.slice(0, -1);
  if (t !== title) t += '…';
  ctx.fillText(t, 24, BOTY + 88);
  if (a.obs) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = DMI(17);
    const MAX_LINES = 6;
    const words = ('"' + a.obs + '"').split(' ');
    const lines = []; let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > TEXTMAXW && line) { lines.push(line); line = w; } else { line = test; }
    }
    if (line) lines.push(line);
    const shown = lines.slice(0, MAX_LINES);
    if (lines.length > MAX_LINES) {
      let last = shown[MAX_LINES - 1].replace(/"$/, '');
      while (last.length > 1 && ctx.measureText(last + '…"').width > TEXTMAXW) last = last.slice(0, -1);
      shown[MAX_LINES - 1] = last.trimEnd() + '…"';
    }
    shown.forEach((ln, idx) => ctx.fillText(ln, 24, BOTY + 118 + idx * 22));
  }
  return c.toBuffer('image/png');
}

function outro(art) {
  const { c, ctx } = newCanvas();
  const outroLogoY = H * 0.24;
  drawBg(ctx);
  const outroGlow = ctx.createRadialGradient(W/2, outroLogoY, 0, W/2, outroLogoY, 320);
  outroGlow.addColorStop(0, 'rgba(46,125,85,0.28)'); outroGlow.addColorStop(1, 'rgba(46,125,85,0)');
  ctx.fillStyle = outroGlow; ctx.fillRect(0, 0, W, H);
  drawLogoCircle(ctx, art.logo, W/2, outroLogoY, 260);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#A8C4B2'; ctx.font = DM(36, 400);
  ctx.fillText('Thank you for exploring', W/2, outroLogoY + 185);
  ctx.save(); ctx.strokeStyle = 'rgba(168,196,178,0.3)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W/2-200, outroLogoY+232); ctx.lineTo(W/2+200, outroLogoY+232); ctx.stroke(); ctx.restore();
  ctx.fillStyle = 'white'; ctx.font = TH(66);
  ctx.fillText('Taronga Zoo', W/2, H * 0.65); ctx.fillText('Sydney', W/2, H * 0.65 + 90);
  ctx.fillStyle = 'rgba(168,196,178,0.50)'; ctx.font = DM(26, 400);
  ctx.fillText('#ZooSnooz  #TarongaTracka', W/2, H * 0.88);
  return c.toBuffer('image/png');
}

module.exports = { W, H, ANIMALS, ORDER, artwork, intro, animalCard, overlay, outro };
