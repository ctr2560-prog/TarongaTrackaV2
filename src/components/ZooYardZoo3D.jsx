import { useEffect, useRef, useState } from 'react';
import { preloadZooModel, onZooModelProgress, zooModelState } from '../utils/zooyardModel';

// ZooYardZoo3D — the habitat picker as the real Taronga Zoo, in 3D.
//
// Renders a GLB model of the zoo with a marker welded to each of the three ZooYard habitats.
// This replaced, in order: a flat grid of cards, an abstract green island that looked like
// nothing at all, and the printed map tilted in CSS.
//
// ── Why @google/model-viewer rather than raw three.js ────────────────────────────────────────
//   1. HOTSPOTS. It anchors slotted DOM to a 3D point and keeps it tracking as the camera moves.
//      That is the whole feature: a marker that stays over Koala Country however you spin the
//      zoo. Hand-rolling it on three.js means projecting world points to screen space every
//      frame and fighting z-order.
//   2. The hotspots are ordinary DOM, so each marker stays a real <button> with a real label. A
//      canvas-only approach would leave keyboard and screen reader users with nothing at all.
//   3. Camera orbit and clamping, lighting, shadows and tone mapping all come free.
//
// ── Why the model is ~12.7MB and not 60MB ─────────────────────────────────────────────────────
// The final map as delivered from the exporter (THREE.GLTFExporter r184) is 60MB. Regenerate in
// THIS ORDER, which took 60MB → 12.7MB with nothing lost at all:
//
//   gltf-transform dedup <in> a.glb     # 866 textures → 436; 521 materials → 461
//   gltf-transform prune a.glb b.glb    # ⚠️ 346 unused accessors = 18MB of dead weight
//   gltf-transform weld  b.glb c.glb    # export is NON-INDEXED; Draco needs indices
//   gltf-transform webp  c.glb d.glb --lossless
//   gltf-transform draco d.glb <out> --quantize-position 16 --quantize-normal 16
//                                    --quantize-texcoord 16
//
// ⚠️ TEXTURES ARE LOSSLESS ON PURPOSE, and this is the one setting not to "optimise" later.
//    Every material here is KHR_materials_unlit: there is no runtime lighting, the lighting is
//    PAINTED INTO THE TEXTURES. So texture quality is not texture quality, it is lighting
//    quality, and a webp artefact lands as a smudge on a baked shadow. Lossless costs 1.2MB
//    against --quality 92 and removes the question entirely.
// ⚠️ Draco is at its 16-bit maximum on all three attributes. Dropping normals and UVs to the
//    usual 12/14 saves only 230KB, and UV precision in particular is what keeps the baked
//    lighting atlas aligned to the geometry it was baked against.
//
// ⚠️ ORDER MATTERS. Running `webp` after `draco` decompresses the geometry and blows it back
//    out. `weld` and `prune` must both precede `draco` or it has nothing to predict against.
// ⚠️ `weld` makes the INTERMEDIATE file bigger (42MB → 48MB) because it adds an index buffer.
//    That is correct and not a mistake — Draco then compresses the indexed mesh 4x better.
// ⚠️ Bump MODEL_CACHE in utils/zooyardModel.js every time this is rebuilt, or every device that
//    has already loaded ZooYard keeps serving the old zoo out of the Cache API forever.
// ⚠️ The quantisation flags are not optional. Draco's DEFAULTS (position 14, normal 10) visibly
//    soften the model: across a 717-unit zoo, 14 bits means 0.044-unit steps, enough to make
//    fence posts and roof trim wobble. gltf-transform's `draco` default IS 14/10/12, so running
//    it bare is not "the safe option" — measured, it produced a byte-identical file to passing
//    14/10/12 by hand.
// ⚠️ Do NOT run `gltf-transform optimize`. Its pipeline includes `simplify` and `join`, which
//    flattened the old map's 225 nodes down to 4 and destroyed every named anchor, to save
//    228KB. This map's 1184 named nodes are what the habitat markers below are placed from,
//    so losing them is far more expensive here than it was then.
//
// Baked lighting costs ~5MB over the unlit model and it is NOT recoverable by compressing
// harder: the lighting rides on per-face atlas UVs, which have no spatial coherence, so Draco's
// prediction fails on them. Dropping UV precision from 12 to 8 bits saved only 240KB. If the
// size ever becomes a problem, the fix is to ask for the lighting baked to VERTEX COLOURS
// instead of textures: same look, no UV atlas, and 198 fewer draw calls.
//
// The Draco decoder is SELF-HOSTED in public/draco/. model-viewer otherwise fetches it from a
// Google CDN at runtime, which is exactly the sort of request a school network blocks.
//
// The download itself lives in utils/zooyardModel.js, because the INTRO screen kicks it off
// while the student is still reading the instructions. By the time they reach the map it is
// usually already cached, and the loading screen below only appears if it is not.
//
// model-viewer itself is imported dynamically, so its ~290KB only reaches ZooYard students.

// Where each habitat sits IN THE MODEL, read out of the GLB's scene graph. These are 3D
// coordinates: model-viewer anchors a hotspot to each, so a marker stays welded to its
// enclosure as the zoo turns. Spin the map and the koala marker stays over Koala Country.
//
// ⚠️ These were briefly full-size cards anchored here, which overlapped badly and hid behind
// hills when the zoo rotated; then briefly fixed to the screen, which stopped the overlap but
// broke the link to the enclosure. Compact markers attached to the model does both: small
// enough not to collide, still welded to the right paddock.
//
// Keyed by animal id, not array position, so reordering ZOOYARD_ANIMALS cannot move a marker to
// the wrong enclosure. Y sits just above each anchor's top so the marker clears the buildings.
// ⚠️ HOW TO PLACE A MARKER, learned the expensive way on the Blue Mountains Bushwalk (three
// wrong positions before the right one). Read this before adding one.
//
// 1. Node translations are ALL ZERO — the geometry is baked into the mesh vertices. Walking the
//    scene graph for transforms returns 0 0 0 for all 225 nodes and tells you nothing.
// 2. For a node that IS one structure, the position is the centre of its POSITION accessor
//    min/max, with the marker at the bounding box top y + 9. That +9 matches the original three
//    (animals_giraffes tops out at 65, its marker sits at 74).
// 3. ⚠️ SOME NODES ARE MERGED MESHES SPANNING THE WHOLE ZOO, and their centroid is meaningless.
//    `aviary_frames` and `aviary_mesh` hold EVERY aviary as a single primitive: both span
//    x -176..220, z -114..109, and their centre lands at (22, -3), which is not an aviary at all
//    and happens to sit on the gorillas. Always check the box size first — hundreds of units
//    across means merged. To split one, round-trip the GLB through
//    `npx @gltf-transform/cli cp <in> <out>` (this decodes Draco), read the POSITION floats out
//    of the .bin, and grid-cluster them in xz. That yields the nine separate aviaries.
// 4. ⚠️ DO NOT eyeball a position from a screenshot of the map. Fitting the projection from the
//    existing markers works near them and extrapolates badly: it put the Bushwalk on the
//    Wildlife Retreat lodges, ~90 units from the truth.
//    Use the PRINTED ZOO MAP instead (`tz-map-online.pdf`). Render it with
//    `pdftoppm -r 200 -png`, then fit an affine map from map pixels to GLB xz using landmarks
//    named in BOTH — function_centre, nocturnal_country, nura_diya_australia, tree_shelter,
//    floral_clock_border, forest_adventure all work. That fit lands inside 1-4 world units, and
//    it is how this one was finally resolved. Sanity-check it by solving for a landmark you did
//    NOT fit on: it put the Function Centre rotunda at (-183, 32) against the model's actual
//    `retreat_pavilion_canopy` at (-185, 30).
const SPOTS = {
  // ⚠️ ALL EIGHT WERE RE-DERIVED against the final map (2026-10-16, bushwalk added 2026-10-17),
  // which is a different export covering the whole harbour. Do not trust a position in git
  // history: the map these were measured from is not the map those were measured from.
  //
  // Method: node transforms are all zero (geometry is baked into the mesh vertices), so a
  // position is the CENTRE of that node's POSITION accessor bounds in xz, with the marker at
  // y + 9 above the top of EVERYTHING standing on that xz point — not just the animals node.
  //
  // ⚠️ That last part is new and it was measured, not guessed. Using the animals node's own top
  // buried two markers in foliage: the giraffe marker sat inside `savannah_eucalypt_canopy`
  // (top 74, marker was 73) and the chimpanzee marker inside `chimp_palm_fronds` (top 80,
  // marker was 75). Giraffe, tiger, chimpanzee and rhino are all raised for this reason, which
  // is why their clearances differ. To re-derive: for each marker xz, take the max top y of
  // every node whose xz box contains it, EXCLUDING `trees_canopy_eucalypt` and
  // `trees_canopy_dark` — those two are merged canopies spanning the whole 717x564 map, so they
  // contain every point and tell you nothing.
  //
  // ⚠️ Those same two merged canopies mean a scattered tree can still occlude a marker at some
  // rotations. Splitting them would need the 1.6M-vertex POSITION data grid-clustered in xz,
  // which has not been done. If a marker plays hide-and-seek as the zoo turns, that is why.
  //
  // ✅ Good news about this export: 1141 nodes carry real per-structure names, so seven of the
  // eight anchor onto an `animals_*` node that holds ONLY that species. No clustering needed,
  // unlike the old map where `aviary_mesh` spanned the entire zoo as one primitive.

  // The koala interpolated from the printed map at (41, 160) turned out to be RIGHT: this export
  // has a real `koala_walkabout` building centred (41, 162). Position kept, y raised 80 → 81 to
  // sit on its actual roof top of 72.
  // ⚠️ There is a SECOND koala in this map — `animals_koala_tree_canopy` at (-198, 117), in the
  // Australian precinct beside Nocturnal Country and the dingoes. The marker points at the
  // Walkabout building because that is the named koala-viewing structure and it matches the
  // `where` text below. Move it only if the zoo says the koalas students watch are the western
  // ones.
  koala:   { pos: '41 81 162',   where: 'the koala exhibit, by the Institute of Science and Learning' },

  giraffe: { pos: '157 83 81',   where: 'African Savannah' },                // animals_giraffes
  tiger:   { pos: '249 74 56',   where: 'Tiger Trek' },                      // animals_tigers
  chimpanzee: { pos: '170 89 160',  where: 'the chimpanzee exhibit' },       // animals_chimpanzees
  gorilla:    { pos: '21 55 -9',    where: 'the gorilla exhibit' },          // animals_gorillas
  rhino:      { pos: '121 54 -66',  where: 'the rhino exhibit' },            // animals_rhinos
  'sea-lion': { pos: '21 45 -93',   where: 'the seal and sea lion pools' },  // animals_seals

  // The aviary was MISSING from the first cut of this map, which briefly sent this marker to
  // Backyard to Bush. It was added to the export on 2026-10-17 and now anchors properly onto
  // `blue_mountains_aviary_steel`, centred (-157, 6).
  // Worth noting for anyone who doubts the old method: the original position, interpolated off
  // the printed zoo map back when no aviary existed in the model at all, was (-153, 5) — four
  // units from where the real geometry turned out to be. Same story as the koala above.
  'blue-mountains-bushwalk': { pos: '-157 82 6', where: 'the Blue Mountains Bushwalk aviary' },
};

// theta (spin) phi (height) radius (distance).
// ⚠️ Re-framed 2026-10-16 for the final map, and the reason is worth knowing: 687 of its 1141
// nodes are Sydney — the CBD skyline, the harbour, the Opera House, the ferries. The full model
// is 717 x 787 units, but THE ZOO IS NOT IN THE MIDDLE OF IT. Framing on the model's own centre
// points the camera at open water.
//
// So CAM_TARGET is the centre of the eight habitat anchors above, (24, 23) in xz, not the
// model's centre of (0, -59). y 40 is ground level across the exhibits rather than the mean of
// a bbox that includes 95-unit towers and a -20 harbour floor.
//
// START is deliberately pulled right back so the opening shot includes the harbour and the city
// — that is the whole point of having them — and then settles onto the zoo at REST.
const CAM_START  = '-78deg 76deg 2600m';
const CAM_REST   = '8deg 58deg 1000m';
const CAM_TARGET = '24m 40m 23m';

export default function ZooYardZoo3D({ animals, completed, unlocked = {}, themes, onSelect }) {
  const mvRef = useRef(null);
  const [ready, setReady]         = useState(false);   // custom element registered
  const [loaded, setLoaded]       = useState(false);   // model geometry decoded
  const [failed, setFailed]       = useState(false);
  const [progress, setProgress]   = useState(() => zooModelState().pct);
  const [modelSrc, setModelSrc]   = useState(null);
  const [fromCache, setFromCache] = useState(() => zooModelState().fromCache);

  const reduce = typeof window !== 'undefined'
    && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    let cancelled = false;

    // Initial values were seeded from zooModelState() above; this just keeps following it.
    const unsubscribe = onZooModelProgress((p, c) => {
      if (cancelled) return;
      setProgress(p);
      if (c) setFromCache(true);
    });

    (async () => {
      try {
        // Both at once: the library and the model do not depend on each other. preloadZooModel
        // joins the intro's in-flight request rather than starting a second 12.7MB download.
        const [mod, src] = await Promise.all([
          import('@google/model-viewer'),
          preloadZooModel(),
        ]);
        // Must be set before the element loads anything, or it reaches for the CDN.
        if (mod.ModelViewerElement) mod.ModelViewerElement.dracoDecoderLocation = '/draco/';
        if (cancelled) return;
        setModelSrc(src);
        setReady(true);
      } catch (e) {
        console.warn('[zooyard] 3D zoo unavailable, falling back to cards:', e);
        if (!cancelled) setFailed(true);
      }
    })();

    // ⚠️ No revoking here. The object URL is shared with the intro screen and survives a student
    // moving between habitats, so revoking on unmount would break the next mount. See the note
    // at the bottom of utils/zooyardModel.js.
    return () => { cancelled = true; unsubscribe(); };
  }, []);

  // ⚠️ Listeners attached to the element itself rather than React's onLoad prop. model-viewer
  // dispatches CustomEvents, and how a framework maps on* props onto custom elements is exactly
  // the sort of thing that varies between versions. A direct listener cannot be wrong.
  useEffect(() => {
    if (!ready) return undefined;
    const mv = mvRef.current;
    if (!mv) return undefined;
    const onLoad = () => {
      setLoaded(true);
      if (reduce) return;
      // A beat, so the first painted frame is the starting angle and not the destination.
      setTimeout(() => { mv.cameraOrbit = CAM_REST; }, 60);
    };
    const onError = (e) => { console.warn('[zooyard] model failed to load:', e); setFailed(true); };
    if (mv.loaded) onLoad();                          // already decoded (cached, fast device)
    mv.addEventListener('load', onLoad);
    mv.addEventListener('error', onError);
    return () => {
      mv.removeEventListener('load', onLoad);
      mv.removeEventListener('error', onError);
    };
  }, [ready, reduce]);

  // ⚠️ The fallback is not a nicety. A 12.7MB GLB plus a WASM decoder is a lot to ask of a
  // locked-down school device, and a student who cannot render it still has to pick a habitat.
  if (failed) {
    return (
      <div className="zy3d-fallback">
        {animals.map(a => {
          const done = !!completed[a.id];
          return (
            <button key={a.id} type="button" className={`zy3d-card${done ? ' zy3d-done' : ''}`}
              style={{ '--hab': a.habitatColor }}
              onClick={() => onSelect(a)}
              aria-label={`${a.habitatLabel}. ${a.name}. ${done ? 'Complete.' : 'Not started.'}`}>
              <span className="zy3d-photo" style={{ backgroundImage: `url(${a.image})` }} />
              <span className="zy3d-body">
                <span className="zy3d-hab">
                  <span aria-hidden="true">{themes[a.habitatArea]?.icon}</span> {a.habitatLabel}
                </span>
                <span className="zy3d-name">{a.name}</span>
                <span className="zy3d-state">
                  {done ? `✓ Complete · +${completed[a.id].points} pts` : 'Tap to begin'}
                </span>
              </span>
            </button>
          );
        })}
        <style>{SHARED_CSS}</style>
      </div>
    );
  }

  return (
    <div className="zy3d-wrap">
      {ready && modelSrc && (
        <model-viewer
          ref={mvRef}
          src={modelSrc}
          alt="A three dimensional model of Taronga Zoo Sydney"
          camera-controls=""
          disable-pan=""
          interaction-prompt="none"
          camera-orbit={reduce ? CAM_REST : CAM_START}
          camera-target={CAM_TARGET}
          min-camera-orbit="auto 32deg 560m"
          max-camera-orbit="auto 80deg 2800m"
          environment-image="neutral"
          exposure="1.05"
          shadow-intensity="1.1"
          shadow-softness="0.85"
          interpolation-decay="170"
          loading="eager"
          className="zy3d-mv">

          {/* Each one is anchored to a 3D point, so it stays over its enclosure as the zoo
              turns. Small on purpose: three full cards collided constantly when spinning. */}
          {/* Three states, and the middle one is the point: a habitat stays LOCKED until the
              student has physically gone and photographed the spot. The padlock is what sends
              them outside, so the map itself carries the "go and stand there" instruction
              rather than it being buried a screen deep. */}
          {animals.filter(a => SPOTS[a.id]).map(animal => {
            const done   = !!completed[animal.id];
            const isOpen = done || !!unlocked[animal.id];
            const spot   = SPOTS[animal.id];
            const state  = done ? 'Complete.' : isOpen ? 'Unlocked. Tap to continue.'
                                : 'Locked. Go and photograph your spot to unlock it.';
            return (
              <button key={animal.id} type="button"
                slot={`hotspot-${animal.id}`}
                data-position={spot.pos}
                data-normal="0 1 0"
                className={`zy3d-marker${done ? ' zy3d-done' : ''}${isOpen ? '' : ' zy3d-locked'}`}
                style={{ '--hab': animal.habitatColor }}
                onClick={() => onSelect(animal)}
                aria-label={[
                  animal.habitatLabel,
                  // Skip the location when it merely repeats the habitat name, as for the savannah.
                  spot.where !== animal.habitatLabel ? `at ${spot.where}` : '',
                  `. ${animal.name}. ${state}`,
                ].filter(Boolean).join(' ').replace(' .', '.')}>
                <span className="zy3d-disc"
                  style={isOpen ? { backgroundImage: `url(${animal.image})` } : undefined}>
                  {!isOpen && <span className="zy3d-lock" aria-hidden="true">🔒</span>}
                  {done && <span className="zy3d-tick" aria-hidden="true">✓</span>}
                </span>
                <span className="zy3d-tag">{animal.name}</span>
              </button>
            );
          })}

          <div slot="progress-bar" />
        </model-viewer>
      )}

      {/* A real loading screen, not a spinner. 12.7MB plus a WASM decoder on a school connection
          is long enough that a bare spinner reads as broken. */}
      {!loaded && (
        <div className="zy3d-loading" role="status" aria-live="polite">
          <img src="/images/logo.png" alt="" className="zy3d-load-logo"
            onError={e => { e.target.style.display = 'none'; }} />
          <p className="taronga-title zy3d-load-title">Building your zoo</p>
          <div className="zy3d-bar">
            <div className="zy3d-bar-fill" style={{ width: `${Math.max(4, progress)}%` }} />
          </div>
          <p className="zy3d-load-sub">
            {fromCache || progress >= 100 ? 'Unpacking…' : `${progress}%`}
          </p>
        </div>
      )}

      {loaded && <p className="zy3d-hint">Drag to explore</p>}

      <style>{`
        .zy3d-wrap {
          position: relative;
          width: 100%; height: 100%;
          background: linear-gradient(180deg, #8FD4EE 0%, #B9E3F2 34%, #DDEFE2 66%, #A9C98B 100%);
          overflow: hidden;
        }
        .zy3d-mv {
          width: 100%; height: 100%;
          background: transparent;
          --progress-bar-color: transparent;
        }

        .zy3d-loading {
          position: absolute; inset: 0; z-index: 3;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 0.55rem; padding: 1.5rem;
          background: linear-gradient(165deg, #0B2415, #14472C 55%, #1F6B42);
        }
        .zy3d-load-logo {
          width: 76px; height: 76px; object-fit: contain;
          animation: zy3dBreathe 2.6s ease-in-out infinite;
        }
        .zy3d-load-title {
          margin: 0.4rem 0 0.1rem; color: white;
          font-size: clamp(1.35rem, 5vw, 1.8rem); letter-spacing: 0.03em;
        }
        .zy3d-bar {
          width: min(260px, 70vw); height: 7px; border-radius: 999px;
          background: rgba(255,255,255,0.18); overflow: hidden; margin-top: 0.5rem;
        }
        .zy3d-bar-fill {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, #4A9E6B, #E8B33C);
          transition: width 0.35s ease;
        }
        .zy3d-load-sub {
          margin: 0.15rem 0 0; color: rgba(255,255,255,0.7);
          font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em;
        }
        @keyframes zy3dBreathe {
          0%, 100% { transform: scale(1);    opacity: 0.85; }
          50%      { transform: scale(1.07); opacity: 1; }
        }

        .zy3d-hint {
          position: absolute; bottom: 0.7rem; left: 50%; transform: translateX(-50%); margin: 0;
          padding: 0.3rem 0.7rem; border-radius: 999px;
          background: rgba(7,30,20,0.38); backdrop-filter: blur(6px);
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255,255,255,0.85); pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .zy3d-load-logo { animation: none; }
        }

        ${SHARED_CSS}
      `}</style>
    </div>
  );
}

// Markers for the 3D scene, plus the card shape the fallback grid uses.
const SHARED_CSS = `
  /* ── Map markers ──────────────────────────────────────────────────────────────────────
     Welded to the model, so three of them swing around each other as the zoo turns. A photo
     disc reads as an enclosure marker at a glance, with the name under it so nothing has to
     be guessed. */
  .zy3d-marker {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 0; border: none; background: none; cursor: pointer;
    font-family: inherit;
    transition: transform 0.2s ease;
    animation: zy3dFloat 5.5s ease-in-out infinite;
  }
  .zy3d-marker:hover  { transform: scale(1.12); }
  .zy3d-marker:active { transform: scale(1.04); }
  .zy3d-marker:focus-visible { outline: 4px solid #FFD98A; outline-offset: 4px; border-radius: 16px; }

  .zy3d-disc {
    position: relative;
    width: 56px; height: 56px; border-radius: 50%;
    background-size: cover; background-position: center;
    border: 3px solid var(--hab);
    box-shadow: 0 6px 18px rgba(0,0,0,0.55), 0 0 0 3px rgba(255,255,255,0.85);
  }
  .zy3d-done .zy3d-disc {
    border-color: #E8B33C;
    box-shadow: 0 6px 18px rgba(0,0,0,0.55), 0 0 0 3px #FFF1CC;
  }
  /* Locked: no animal photo at all. Showing a dimmed one would say "here is your koala, but
     no" — a slate disc reads as a thing to open rather than a thing withheld. */
  .zy3d-locked .zy3d-disc {
    background: linear-gradient(160deg, #46504A, #2B332E);
    border-color: rgba(255,255,255,0.55);
    display: flex; align-items: center; justify-content: center;
  }
  .zy3d-lock { font-size: 1.4rem; filter: drop-shadow(0 1px 3px rgba(0,0,0,0.6)); }
  .zy3d-locked .zy3d-tag { background: rgba(7,22,14,0.62); color: rgba(255,255,255,0.82); }
  .zy3d-tick {
    position: absolute; right: -5px; bottom: -5px;
    width: 22px; height: 22px; border-radius: 50%;
    background: #E8B33C; color: #241503;
    font-size: 0.75rem; font-weight: 900; line-height: 22px; text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.45);
  }
  .zy3d-tag {
    padding: 2px 9px; border-radius: 999px;
    background: rgba(7,22,14,0.82);
    color: white; font-size: 0.62rem; font-weight: 800;
    letter-spacing: 0.03em; white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }
  .zy3d-done .zy3d-tag { background: rgba(232,179,60,0.95); color: #241503; }

  /* A gentle bob, so a marker reads as hovering over its enclosure rather than stuck to it. */
  @keyframes zy3dFloat {
    0%, 100% { margin-bottom: 0; }
    50%      { margin-bottom: 7px; }
  }

  /* ── Fallback cards ───────────────────────────────────────────────────────────────── */
  .zy3d-card {
    width: 100%;
    display: flex; flex-direction: column;
    padding: 0; border: none; border-radius: 14px; overflow: hidden;
    background: linear-gradient(170deg, #FFFDF8, #F0EADC);
    box-shadow: 0 14px 32px rgba(0,0,0,0.25), 0 0 0 2.5px var(--hab);
    cursor: pointer; font-family: inherit; text-align: left;
    transition: transform 0.2s ease;
  }
  .zy3d-card:hover { transform: translateY(-4px); }
  .zy3d-card:focus-visible { outline: 4px solid #FFD98A; outline-offset: 4px; }
  .zy3d-card.zy3d-done { box-shadow: 0 14px 32px rgba(0,0,0,0.25), 0 0 0 2.5px #E8B33C; }

  .zy3d-photo { display: block; height: 90px; background-size: cover; background-position: center; }
  .zy3d-body  { display: block; padding: 0.6rem 0.75rem 0.7rem; }
  .zy3d-hab   { display: block; font-size: 0.55rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--hab); }
  .zy3d-name  { display: block; font-size: 1rem; font-weight: 800; color: #0A2F1F; line-height: 1.2; margin-top: 0.1rem; }
  .zy3d-state { display: block; font-size: 0.72rem; font-weight: 700; color: #5A6B5A; margin-top: 0.2rem; }
  .zy3d-card.zy3d-done .zy3d-state { color: #1A5238; }

  .zy3d-fallback {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.9rem; padding: 1.2rem;
  }

  @media (max-width: 560px) {
    .zy3d-disc { width: 46px; height: 46px; border-width: 2.5px; }
    .zy3d-lock { font-size: 1.15rem; }
    .zy3d-tag  { font-size: 0.56rem; padding: 2px 7px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .zy3d-marker, .zy3d-card { animation: none; transition: none; }
  }
`;
