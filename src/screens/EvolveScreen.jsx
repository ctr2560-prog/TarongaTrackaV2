import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useStudent } from '../context/StudentContext';
import { EVOLVE_CHAPTERS, EVOLVE_STORY_ORDER, EVOLVE_CHAPTER_WORDS as WORDS, EVOLVE_THEME as T, EVOLVE_MIN_WORDS } from '../data/evolveAnimals';
import { buildEvolveFilm, startChapterRecording, pickMimeType } from '../utils/evolveFilm';
import { doc, getDoc, updateDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { normaliseCode, safeStudentId } from '../utils/helpers';
import { evolveSouvenirLink, canWriteNfcTag, writeNfcTag } from '../utils/evolveSouvenir';

const CLIP_SECONDS = 30;
const WATCH_SECONDS = 60;
const INTRO_KEY = 'evolveIntroSeen';

// Shown once, before the first chapter. Stage 6 students should know what they have walked
// into and why, without reading a briefing.
const INTRO_STEPS = [
  { n: '1', title: 'Walk',  body: 'Five animals, five chapters of one story. They open in order, as you reach each animal.' },
  { n: '2', title: 'Write', body: 'Watch for a minute, then write something honest. Nobody marks it.' },
  { n: '3', title: 'Film',  body: 'Say one line to camera. Thirty seconds, that is all.' },
];
const wordCount = t => (t.trim().match(/\b[\w']+\b/g) || []).length;

// 8 lowercase base36 characters (~41 bits). Enough that a souvenir URL cannot be guessed, short
// enough that the whole link still fits an NTAG213 tag with room to spare.
function makeSouvenirToken() {
  const a = new Uint8Array(6);
  (window.crypto || window.msCrypto).getRandomValues(a);
  return Array.from(a).map(n => n.toString(36).padStart(2, '0')).join('').slice(0, 8);
}

function Shell({ children, onHome, scroll = true }) {
  return (
    <div style={{ position:'fixed', inset:0, background:T.bgGradient, overflowY: scroll ? 'auto' : 'hidden', fontFamily:'var(--t-font)' }}>
      {onHome && (
        <button onClick={onHome}
          style={{ position:'absolute', top:'1rem', right:'1rem', zIndex:60, background:'rgba(0,0,0,0.35)', border:`1px solid ${T.border}`, color:T.text, padding:'0.4rem 0.9rem', borderRadius:999, cursor:'pointer', fontSize:'0.8rem', fontWeight:600, backdropFilter:'blur(8px)' }}>
          Home
        </button>
      )}
      {children}
      <style>{`
        .ev-horizon {
          position: fixed; left: 0; right: 0; bottom: 0; height: 55vh; pointer-events: none; z-index: 0;
          background: radial-gradient(135% 78% at 50% 100%, rgba(255,183,77,0.42) 0%, rgba(216,110,64,0.20) 34%, rgba(120,60,90,0.10) 58%, transparent 78%);
        }
        .ev-wrap { position: relative; z-index: 1; max-width: 660px; margin: 0 auto; padding: 3rem 1.15rem 4rem; }

        .ev-head { text-align: center; margin-bottom: 2.25rem; }
        .ev-eyebrow {
          font-size: 0.58rem; font-weight: 800; letter-spacing: 0.26em; text-transform: uppercase;
          color: rgba(232,179,60,0.75); margin-bottom: 0.9rem;
        }
        .ev-title { color: #F3EDE2; font-size: clamp(2.4rem, 9vw, 3.4rem); margin: 0 0 0.35rem; letter-spacing: 0.04em; }
        .ev-sub { color: rgba(243,237,226,0.6); font-size: 0.95rem; margin: 0; font-style: italic; }
        .ev-progress {
          display: flex; align-items: center; justify-content: center; gap: 0.7rem; margin-top: 1.1rem;
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(243,237,226,0.5);
        }
        .ev-rule { flex: 0 0 44px; height: 1px; background: rgba(232,179,60,0.35); }

        .ev-how {
          background: none; border: none; cursor: pointer; font-family: inherit;
          margin-top: 0.85rem; padding: 0; font-size: 0.72rem; font-weight: 600;
          color: rgba(232,179,60,0.72); letter-spacing: 0.04em;
          border-bottom: 1px solid rgba(232,179,60,0.32); padding-bottom: 1px;
        }
        .ev-how:hover { color: #E8B33C; }

        .ev-intro { max-width: 520px; padding-top: 3.5rem; text-align: left; }
        .ev-intro .ev-eyebrow, .ev-intro .ev-title { text-align: center; }
        .ev-intro .ev-title { margin-bottom: 1.4rem; }
        .ev-intro-lede {
          font-size: 1.02rem; line-height: 1.7; color: rgba(243,237,226,0.8);
          margin: 0 0 2.2rem; text-wrap: pretty;
        }
        .ev-steps { list-style: none; margin: 0 0 2rem; padding: 0; display: flex; flex-direction: column; gap: 1.25rem; }
        .ev-step { display: flex; gap: 1rem; align-items: flex-start; }
        .ev-step-n {
          flex: 0 0 30px; height: 30px; border-radius: 50%; background: rgba(232,179,60,0.12);
          border: 2px solid #E8B33C; color: #E8B33C;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.82rem; font-weight: 800;
        }
        .ev-step-t {
          display: block; font-size: 1.02rem; font-weight: 700; color: #F3EDE2; margin-bottom: 0.15rem;
        }
        .ev-step-b { display: block; font-size: 0.9rem; line-height: 1.55; color: rgba(243,237,226,0.62); }
        .ev-intro-foot {
          font-size: 0.9rem; line-height: 1.6; color: rgba(243,237,226,0.55);
          border-top: 1px solid rgba(232,179,60,0.2); padding-top: 1.2rem; margin: 0 0 1.8rem;
        }
        .ev-intro-cta { align-self: stretch; width: 100%; text-align: center; margin-top: 0; }

        .ev-hero {
          width: 100%; aspect-ratio: 3 / 2; max-height: 46vh; overflow: hidden;
          border-radius: 18px; margin-bottom: 1.6rem; background: rgba(9,13,28,0.5);
          box-shadow: 0 18px 50px rgba(0,0,0,0.45);
        }
        .ev-hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ev-insight {
          font-size: clamp(1.15rem, 4.2vw, 1.42rem); line-height: 1.55; color: #F3EDE2;
          margin: 0 0 2rem; text-wrap: pretty; letter-spacing: 0.005em; text-align: center;
        }
        .ev-insight-cta { width: 100%; text-align: center; margin-top: 0; }

        .ev-watch { text-align: center; padding-top: 0.5rem; }
        .ev-watch-prompt {
          font-size: clamp(1.05rem, 3.8vw, 1.28rem); line-height: 1.55; color: #F3EDE2;
          margin: 0 0 2.2rem; text-wrap: pretty;
        }
        .ev-dial { position: relative; width: 190px; height: 190px; margin: 0 auto 1.6rem; }
        .ev-dial svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .ev-dial circle { fill: none; stroke-width: 5; stroke-linecap: round; }
        .ev-dial-track { stroke: rgba(243,237,226,0.13); }
        .ev-dial-fill {
          stroke: #E8B33C; stroke-dasharray: 1;
          transition: stroke-dashoffset 1s linear;
          filter: drop-shadow(0 0 7px rgba(232,179,60,0.5));
        }
        .ev-dial-mid {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 0.15rem;
        }
        .ev-dial-num {
          font-size: 3.4rem; font-weight: 300; color: #F3EDE2; line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .ev-dial-lbl {
          font-size: 0.6rem; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(243,237,226,0.45);
        }
        .ev-watch-hint {
          font-size: 0.92rem; line-height: 1.55; color: rgba(243,237,226,0.6);
          margin: 0 0 1.8rem; text-wrap: pretty;
        }
        .ev-skip {
          display: block; margin: 0.9rem auto 0; background: none; border: none; cursor: pointer;
          font-family: inherit; font-size: 0.78rem; color: rgba(243,237,226,0.42);
          border-bottom: 1px solid rgba(243,237,226,0.2); padding-bottom: 1px;
        }
        .ev-skip:hover { color: rgba(243,237,226,0.7); }

        /* ── Making your film ──
           This screen is held for ~45s with nothing else to do, so it earns some care. The dial
           is deliberately the SAME component as the 60-second watch screen, so the gesture that
           meant "wait here, this is part of it" is already familiar by the time they reach it. */
        .ev-make {
          min-height: 100dvh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
          max-width: 440px; margin: 0 auto; padding: 2.5rem 1.25rem;
        }
        .ev-make-title { color: #F3EDE2; font-size: clamp(1.75rem, 7vw, 2.3rem); margin: 0 0 0.5rem; }
        .ev-make-sub {
          color: rgba(243,237,226,0.58); font-size: 0.92rem; line-height: 1.6;
          margin: 0 0 2.2rem; text-wrap: pretty;
        }
        .ev-make .ev-dial { margin-bottom: 0.4rem; }
        /* A slow breath behind the dial so a stalled percentage still feels alive. */
        .ev-make-glow {
          position: absolute; inset: -22%; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(232,179,60,0.20) 0%, rgba(232,179,60,0) 68%);
          animation: evBreathe 3.4s ease-in-out infinite;
        }
        @keyframes evBreathe {
          0%, 100% { opacity: 0.45; transform: scale(0.94); }
          50%      { opacity: 1;    transform: scale(1.06); }
        }
        .ev-make-stage {
          font-size: 0.6rem; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(232,179,60,0.8); margin: 0 0 1.9rem; min-height: 1em;
        }

        .ev-make-list { list-style: none; margin: 0; padding: 0; width: 100%; }
        .ev-make-row {
          display: flex; align-items: center; gap: 0.8rem; text-align: left;
          padding: 0.5rem 0.8rem; border-radius: 10px;
          transition: background 0.5s ease, opacity 0.5s ease;
          opacity: 0.45;
        }
        .ev-make-tick {
          flex: 0 0 19px; width: 19px; height: 19px; border-radius: 50%;
          border: 1.5px solid rgba(243,237,226,0.25); color: transparent;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.6rem; font-weight: 800;
          transition: border-color 0.4s, background 0.4s, color 0.4s;
        }
        .ev-make-name { font-size: 0.92rem; color: rgba(243,237,226,0.75); }
        .ev-make-row.is-done { opacity: 1; }
        .ev-make-row.is-done .ev-make-tick {
          border-color: rgba(232,179,60,0.55); background: rgba(232,179,60,0.16); color: #E8B33C;
        }
        .ev-make-row.is-now { opacity: 1; background: rgba(232,179,60,0.09); }
        .ev-make-row.is-now .ev-make-name { color: #F3EDE2; font-weight: 700; }
        .ev-make-row.is-now .ev-make-tick {
          border-color: #E8B33C; animation: evTickPulse 1.7s ease-in-out infinite;
        }
        @keyframes evTickPulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(232,179,60,0.16); }
          50%      { box-shadow: 0 0 0 8px rgba(232,179,60,0); }
        }
        .ev-make-foot {
          margin: 2.1rem 0 0; font-size: 0.8rem; line-height: 1.6;
          color: rgba(243,237,226,0.42); text-wrap: pretty;
        }
        @media (prefers-reduced-motion: reduce) {
          .ev-make-glow, .ev-make-row.is-now .ev-make-tick { animation: none; }
        }

        .ev-prompt { margin-bottom: 1.5rem; }
        .ev-prompt-lead {
          font-size: clamp(1.15rem, 4.2vw, 1.38rem); font-weight: 700; text-align: center;
          color: #F3EDE2; line-height: 1.45; margin: 0.4rem 0 1.4rem; text-wrap: pretty;
        }
        .ev-prompt-body {
          font-size: 1rem; line-height: 1.65; color: rgba(243,237,226,0.78);
          margin: 0 0 0.9rem; text-wrap: pretty;
        }
        .ev-prompt-body:last-child { margin-bottom: 0; }

        /* Portrait, because the finished film is 720x1280. object-fit: cover means the
           preview shows exactly the crop the stitcher will take. */
        .ev-say {
          background: rgba(232,179,60,0.08); border: 1px solid rgba(232,179,60,0.24);
          border-radius: 12px; padding: 0.9rem 1.1rem; margin-bottom: 1rem;
        }
        .ev-say-label {
          font-size: 0.56rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(232,179,60,0.8); margin-bottom: 0.4rem;
        }
        .ev-say-ask {
          font-size: clamp(1rem, 3.6vw, 1.15rem); line-height: 1.45; color: #F3EDE2; margin: 0 0 0.6rem;
        }
        .ev-say-link {
          font-size: 0.88rem; line-height: 1.5; color: rgba(243,237,226,0.62); margin: 0;
          padding-top: 0.6rem; border-top: 1px solid rgba(232,179,60,0.18);
        }

        .ev-cam {
          position: relative; aspect-ratio: 9 / 16; max-height: 58vh; width: auto; margin: 0 auto 0.9rem;
          border-radius: 16px; overflow: hidden; background: #000;
          box-shadow: 0 14px 40px rgba(0,0,0,0.45);
        }
        .ev-cam video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ev-cam-play { max-height: 62vh; }

        .ev-write {
          border: 1.5px solid rgba(232,179,60,0.35); border-radius: 14px;
          background: linear-gradient(180deg, rgba(232,179,60,0.09), rgba(9,13,28,0.4));
          padding: 1.1rem 1.15rem 0.9rem; transition: border-color 0.3s, box-shadow 0.3s;
        }
        .ev-write-on { border-color: #E8B33C; box-shadow: 0 0 26px rgba(232,179,60,0.18); }
        .ev-write-lead {
          display: block; font-size: clamp(1.5rem, 5.5vw, 1.95rem); color: #E8B33C;
          line-height: 1; margin-bottom: 0.5rem; letter-spacing: 0.02em;
        }
        .ev-write-input {
          width: 100%; box-sizing: border-box; background: none; border: none; outline: none;
          color: #F3EDE2; font-family: inherit; font-size: clamp(1.05rem, 4vw, 1.25rem);
          line-height: 1.6; resize: vertical; padding: 0;
        }
        .ev-write-input::placeholder { color: rgba(243,237,226,0.3); }
        .ev-count {
          text-align: right; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em;
          color: rgba(243,237,226,0.45); margin: 0.55rem 0 1.4rem; transition: color 0.3s;
        }
        .ev-count-on { color: #E8B33C; }

        .ev-gps {
          display: flex; align-items: center; gap: 0.6rem; width: 100%; text-align: left;
          background: rgba(232,179,60,0.08); border: 1px solid rgba(232,179,60,0.22);
          border-radius: 12px; padding: 0.75rem 0.95rem; margin-bottom: 2rem; cursor: pointer;
          color: rgba(243,237,226,0.85); font-size: 0.8rem; font-weight: 600; font-family: inherit;
        }
        .ev-gps-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #E8B33C; flex-shrink: 0;
          box-shadow: 0 0 0 4px rgba(232,179,60,0.18);
        }

        .ev-trail { list-style: none; margin: 0; padding: 0; }
        .ev-trail { --ev-gutter: 104px; }
        .ev-stop {
          position: relative; min-height: 146px; padding: 0 0 1.4rem calc(var(--ev-gutter) + 14px);
          display: flex; align-items: center;
          animation: ev-rise 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .ev-stop:last-child { padding-bottom: 0; }

        /* The winding trail lives in its own gutter, so nodes can be placed as a percentage
           of it and the whole thing rescales on a phone without recomputing anything. */
        .ev-gutter { position: absolute; left: 0; top: 0; bottom: 0; width: var(--ev-gutter); }
        .ev-seg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }

        /* Dash lengths are fractions of the leg because every path carries pathLength="1". */
        .ev-path { fill: none; stroke-linecap: round; }
        .ev-path-lit {
          stroke: #E8B33C; stroke-width: 2.5;
          filter: drop-shadow(0 0 5px rgba(232,179,60,0.45));
          animation: ev-breathe 3.8s ease-in-out infinite;
        }
        .ev-path-dim { stroke: rgba(243,237,226,0.26); stroke-width: 2; stroke-dasharray: 0.013 0.05; }

        /* The leg you have just walked draws itself from the last stop to the new one. */
        .ev-path-draw {
          stroke-dasharray: 1; stroke-dashoffset: 1;
          animation: ev-draw 1.1s cubic-bezier(0.4,0,0.2,1) forwards;
        }

        /* A brighter pulse runs down the walked route. Each leg is offset in time by its
           position so the light reads as one continuous current, not five separate blips. */
        .ev-flow {
          fill: none; stroke: #FFE6A8; stroke-width: 3.5; stroke-linecap: round;
          stroke-dasharray: 0.1 0.9;
          filter: drop-shadow(0 0 7px rgba(255,214,120,0.95));
          animation: ev-flow 3.4s linear infinite;
        }
        .ev-stop:last-child .ev-gutter { bottom: auto; height: 78px; }

        .ev-node {
          position: absolute; top: 50%; transform: translate(-50%, -50%);
          width: 22px; height: 22px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.66rem; font-weight: 800; color: #0B1024;
          background: #0B1024; border: 2px solid rgba(243,237,226,0.28); z-index: 1; transition: all 0.3s;
        }
        .ev-done   .ev-node { background: #E8B33C; border-color: #E8B33C; }
        .ev-open   .ev-node { border-color: #E8B33C; animation: ev-pulse 2.6s ease-out infinite; }
        .ev-locked .ev-node { border-color: rgba(243,237,226,0.2); }
        .ev-node-end { width: 26px; height: 26px; top: 78px; font-size: 0.8rem; color: #E8B33C; }
        .ev-end.ev-open .ev-node-end { color: #0B1024; background: #E8B33C; }

        /* Every card is the same height with the still bled flush to the right edge, so the
           five read as one set at a glance rather than five slightly different rectangles. */
        .ev-card {
          display: flex; align-items: stretch; gap: 0; width: 100%; height: 146px; text-align: left;
          background: rgba(9,13,28,0.52); border: 1px solid rgba(232,179,60,0.15);
          border-radius: 16px; padding: 0; overflow: hidden; font-family: inherit;
          cursor: pointer; transition: border-color 0.25s, background 0.25s, transform 0.25s;
          -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
        }
        .ev-open .ev-card:hover { border-color: rgba(232,179,60,0.55); background: rgba(9,13,28,0.72); transform: translateY(-2px); }
        .ev-open .ev-card:focus-visible { outline: 2px solid #E8B33C; outline-offset: 3px; }
        .ev-done   .ev-card { cursor: default; border-color: rgba(232,179,60,0.34); background: rgba(232,179,60,0.07); }
        .ev-locked .ev-card { cursor: default; border-color: rgba(243,237,226,0.08); background: rgba(9,13,28,0.35); }

        .ev-card-text {
          flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center;
          gap: 0.4rem; padding: 1rem 1.1rem 1rem 1.35rem;
        }
        .ev-chapter {
          font-size: 0.64rem; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(232,179,60,0.9);
        }
        .ev-locked .ev-chapter { color: rgba(243,237,226,0.3); }
        .ev-name {
          font-size: clamp(1.5rem, 5.4vw, 2.05rem); color: #F3EDE2; line-height: 1.1; letter-spacing: 0.015em;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .ev-locked .ev-name { color: rgba(243,237,226,0.4); }
        .ev-meta {
          font-size: 0.9rem; color: rgba(243,237,226,0.58); line-height: 1.35;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .ev-done .ev-meta { color: rgba(232,179,60,0.8); }

        /* Portrait stills, matching the shape of the film they end up in. Locked chapters sit
           in shadow and come into colour as the student reaches each animal. */
        /* Bled to the card edge and feathered on its inner side, so it reads as part of the
           card rather than a thumbnail dropped on top of it. */
        .ev-still {
          flex: 0 0 132px; align-self: stretch; position: relative;
          background-size: cover; background-position: center;
          filter: saturate(0.18) brightness(0.42) hue-rotate(-12deg); transition: filter 0.6s;
          box-shadow: inset 46px 0 34px -28px rgba(9,13,28,0.95);
        }
        .ev-open .ev-still { filter: saturate(1) brightness(0.95); }
        .ev-done .ev-still { filter: saturate(0.9) brightness(0.85); }

        .ev-dest { display: flex; flex-direction: column; gap: 0.35rem; padding: 0.3rem 0 0; }
        .ev-cta {
          align-self: flex-start; margin-top: 0.7rem; padding: 0.8rem 1.6rem; border: none; border-radius: 999px;
          background: linear-gradient(135deg, #FFC65A, #D86E40); color: #2A1206;
          font-weight: 800; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.1em;
          cursor: pointer; font-family: inherit; transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 6px 22px rgba(232,179,60,0.28);
        }
        .ev-cta:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(232,179,60,0.4); }
        .ev-cta:disabled { background: rgba(243,237,226,0.16); color: rgba(243,237,226,0.45); cursor: not-allowed; box-shadow: none; }

        @keyframes ev-rise  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ev-flow  { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes ev-draw  { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes ev-breathe {
          0%, 100% { opacity: 0.72; }
          50%      { opacity: 1; }
        }
        @keyframes ev-land {
          0%   { transform: translate(-50%,-50%) scale(1); box-shadow: 0 0 0 0 rgba(232,179,60,0.8); }
          45%  { transform: translate(-50%,-50%) scale(1.35); box-shadow: 0 0 0 14px rgba(232,179,60,0); }
          100% { transform: translate(-50%,-50%) scale(1); box-shadow: 0 0 0 0 rgba(232,179,60,0); }
        }
        @keyframes ev-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(232,179,60,0.45); }
          70%  { box-shadow: 0 0 0 11px rgba(232,179,60,0); }
          100% { box-shadow: 0 0 0 0 rgba(232,179,60,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ev-stop { animation: none; opacity: 1; }
          .ev-open .ev-node, .ev-path-lit, .ev-flow { animation: none; }
          .ev-flow { display: none; }
          .ev-path-draw { stroke-dasharray: none; stroke-dashoffset: 0; animation: none; }
          .ev-card, .ev-still, .ev-cta { transition: none; }
        }
        @media (max-width: 460px) {
          .ev-trail { --ev-gutter: 62px; }
          .ev-card  { height: 124px; }
          .ev-still { flex-basis: 98px; }
          .ev-card-text { padding: 0.85rem 0.9rem 0.85rem 1rem; gap: 0.3rem; }
          .ev-stop  { min-height: 110px; }
        }
      `}</style>
    </div>
  );
}


// One leg of the trail. Every segment enters at x=32 and leaves at x=32, bulging left or
// right in between, so consecutive legs always meet no matter how tall each card is — no
// measuring, no fixed row heights. `non-scaling-stroke` keeps the line an even 2px while the
// viewBox stretches vertically. Walked legs are solid gold; the way ahead is dashed, the way
// a route is drawn on a paper map.
// The tag step, shown once the film is kept. Web NFC is Chrome-for-Android only, so this is
// written fallback-first: the "ask a staff member" panel is not an error state, it is the normal
// path on an iPhone and on any Android browser that is not Chrome. Nothing here is required —
// the film is already saved either way, and a tag is a nice-to-have on top.
function TagWriter({ link }) {
  const [phase, setPhase] = useState('idle');   // idle | waiting | done | error | noHardware
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  // The tag write is abandoned if the student leaves, so a forgotten scan cannot sit open.
  useEffect(() => () => abortRef.current?.abort(), []);

  // ⚠️ Chrome for Android exposes NDEFReader based on BROWSER support, not on whether the phone
  // has an NFC aerial. A budget handset without the hardware passes this check and only fails at
  // write time, so `noHardware` below is the second half of the same test — and it must not
  // offer "try again", which cannot work.
  const supported = canWriteNfcTag() && phase !== 'noHardware';

  async function start() {
    setPhase('waiting'); setError('');
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    // write() waits forever for a tag. Ninety seconds is long enough to find the sticker and
    // work out where the aerial is, short enough that a student is not stuck staring at it.
    const timer = setTimeout(() => ctrl.abort(), 90000);
    const res = await writeNfcTag(link, ctrl.signal);
    clearTimeout(timer);
    if (res.ok) { setPhase('done'); return; }
    if (res.reason === 'cancelled') { setPhase('idle'); return; }
    // No aerial in this handset — stop offering a button that can never work and fall through
    // to the staff panel for good.
    if (res.reason === 'unsupported') { setPhase('noHardware'); return; }
    setError(res.message); setPhase('error');
  }

  const box = {
    border: `1px solid ${T.border}`, background: T.panel, borderRadius: 14,
    padding: '1.05rem 1.15rem', marginBottom: '1.1rem', textAlign: 'center',
  };
  const title = { fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.accent, marginBottom: '0.5rem' };
  const note  = { color: T.textDim, fontSize: '0.84rem', lineHeight: 1.6, margin: 0 };

  // No Web NFC: an iPhone, or Android on the wrong browser. Say what happens next, plainly.
  if (!supported) {
    return (
      <div style={box}>
        <div style={title}>Your Tracka tag</div>
        <p style={note}>
          This phone can&apos;t write tags. Ask a staff member and they&apos;ll put your film onto one for you.
        </p>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div style={{ ...box, borderColor: 'rgba(232,179,60,0.6)' }}>
        <div style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>✦</div>
        <div style={title}>On your tag</div>
        <p style={note}>Tap your tag with a phone any time to watch your film again. Keep it somewhere you&apos;ll find it.</p>
      </div>
    );
  }

  return (
    <div style={box}>
      <div style={title}>Your Tracka tag</div>
      {phase === 'waiting' ? (
        <>
          <p style={{ ...note, marginBottom: '0.8rem' }}>
            Hold your tag flat against the back of your phone, near the top, and keep it still.
          </p>
          <button onClick={() => abortRef.current?.abort()}
            style={{ background: 'none', border: 'none', color: T.textDim, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit', borderBottom: `1px solid ${T.border}`, paddingBottom: 1 }}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <p style={{ ...note, marginBottom: '0.85rem' }}>
            {phase === 'error'
              ? `${error} You can try again, or ask a staff member to do it for you.`
              : 'Put your film onto a tag you can keep, and tap it with a phone whenever you want to watch it.'}
          </p>
          <button onClick={start}
            style={{ width: '100%', padding: '0.85rem', borderRadius: 999, border: 'none', background: T.accent, color: '#241503', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {phase === 'error' ? 'Try again' : 'Transfer film to my tag'}
          </button>
        </>
      )}
    </div>
  );
}

// The ~45 seconds the film takes to stitch. Rather than a bare percentage, this names the chapter
// currently being written into the film, so the wait reads as the story being assembled in front
// of them. `stage` is buildEvolveFilm's chapter index: -1 titles, 0..n-1 a chapter, >= n the end.
function BuildingFilm({ pct, stage, chapters }) {
  const onTitles = stage < 0;
  const onOutro = stage >= chapters.length;
  const stageLabel = onTitles ? 'Opening titles'
    : onOutro ? 'Finishing your film'
    : `Chapter ${WORDS[stage] || stage + 1} of ${WORDS[chapters.length - 1]?.toLowerCase() || chapters.length}`;

  return (
    <div className="ev-make">
      <div className="ev-eyebrow">Taronga Zoo Sydney · Twilight</div>
      <h2 className="taronga-title ev-make-title">Making your film</h2>
      <p className="ev-make-sub">
        Your chapters are being written into one short film, in the order you walked them.
      </p>

      <div className="ev-dial">
        <span className="ev-make-glow" aria-hidden="true" />
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="54" className="ev-dial-track" />
          <circle cx="60" cy="60" r="54" className="ev-dial-fill" pathLength="1"
            style={{ strokeDashoffset: 1 - Math.min(Math.max(pct, 0), 100) / 100 }} />
        </svg>
        <div className="ev-dial-mid">
          <span className="ev-dial-num">{pct}</span>
          <span className="ev-dial-lbl">per cent</span>
        </div>
      </div>
      <p className="ev-make-stage" role="status">{stageLabel}</p>

      <ul className="ev-make-list">
        {chapters.map((c, i) => {
          const state = onOutro || i < stage ? 'is-done' : i === stage ? 'is-now' : '';
          return (
            <li key={c.id} className={`ev-make-row ${state}`}>
              <span className="ev-make-tick" aria-hidden="true">✓</span>
              <span className="ev-make-name">{c.chapter}</span>
            </li>
          );
        })}
      </ul>

      <p className="ev-make-foot">
        Keep this screen open and awake. It takes about a minute.
      </p>
    </div>
  );
}

function Segment({ lit, side, first, last, draw, index = 0 }) {
  const bx = side === 'l' ? 16 : 84;
  const d = last
    ? `M50 0 C50 22 ${bx} 26 ${bx} 52`
    : first
    ? `M${bx} 50 C${bx} 76 50 80 50 100`
    : `M50 0 C50 26 ${bx} 28 ${bx} 50 C${bx} 72 50 76 50 100`;
  // pathLength="1" normalises the curve so dash lengths and offsets are fractions of the leg,
  // independent of how tall the card happens to be.
  return (
    <svg className="ev-seg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path className={`ev-path ${lit ? 'ev-path-lit' : 'ev-path-dim'}${draw ? ' ev-path-draw' : ''}`}
        d={d} pathLength="1" vectorEffect="non-scaling-stroke" />
      {lit && !draw && (
        <path className="ev-flow" d={d} pathLength="1" vectorEffect="non-scaling-stroke"
          style={{ animationDelay: `${-index * 0.55}s` }} />
      )}
    </svg>
  );
}

export default function EvolveScreen() {
  const { evScreen, setEvScreen, setSessionType, setCurrentScreen, studentName, classCode, clearStudentSession } = useApp();
  const { checkAnimalProximity, locationEnabled, enableLocation } = useStudent();

  const [hydrating, setHydrating] = useState(true);
  const [chapter, setChapter] = useState(null);
  const [phase, setPhase] = useState('insight');          // insight | watch | write | record | preview
  const [done, setDone] = useState({});                    // { [id]: { reflection } }
  const [clipURLs, setClipURLs] = useState({});            // { [id]: objectURL | remote URL }

  const [watchLeft, setWatchLeft] = useState(WATCH_SECONDS);
  const [reflectText, setReflectText] = useState('');
  const [saving, setSaving] = useState(false);

  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(CLIP_SECONDS);
  const [camError, setCamError] = useState('');
  const [frontCam, setFrontCam] = useState(true);
  const [uploadPct, setUploadPct] = useState({});
  const [justLit, setJustLit] = useState(null);   // leg to animate after finishing a chapter
  const [showIntro, setShowIntro] = useState(false);
  const pendingClipRef = useRef({});   // { [chapterId]: { blob, fileExt, contentType } } for retries

  const [filmPhase, setFilmPhase] = useState('idle');      // idle | building | preview | submitting | sent
  const [filmPct, setFilmPct] = useState(0);
  // The souvenir token, so the student can write their own NFC tag after keeping the film.
  // Mirrored onto the student doc at submit purely so it survives a refresh — evolve_docs is the
  // source of truth, but a student has no reason to be reading that collection.
  const [souvenirToken, setSouvenirToken] = useState(null);
  // Which chapter the stitcher is on: -1 title card, 0..n-1 a chapter, >= n the outro.
  // buildEvolveFilm has always reported this as onProgress's second argument; nothing used it.
  const [filmStage, setFilmStage] = useState(-1);
  const [filmURL, setFilmURL] = useState(null);
  const filmBlobRef = useRef(null);

  const videoRef = useRef(null);
  const camRef = useRef(null);
  const recRef = useRef(null);
  const tickRef = useRef(null);

  const allDone = EVOLVE_CHAPTERS.every(c => done[c.id]);
  const filmedCount = EVOLVE_CHAPTERS.filter(c => clipURLs[c.id]).length;
  // Must match buildEvolveFilm's own `clips` filter, in the same order, or the checklist on the
  // stitch screen will point at the wrong chapter.
  const filmChapters = EVOLVE_STORY_ORDER.filter(c => clipURLs[c.id]);
  // Built from the shared helper so a tag written here is identical to one written by staff.
  const souvenirLink = evolveSouvenirLink(normaliseCode(classCode || ''), safeStudentId(studentName || ''), souvenirToken);

  // ── Resume (learned the hard way on ZooYard: never trust in-memory progress) ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!studentName || !classCode) { setHydrating(false); return; }
      try {
        // getDoc never settles if the device is offline or Firestore is blocked, which would
        // leave the student on the loading screen forever. Losing resumed progress is far
        // better than a dead screen, so the read is raced against a timeout.
        const snap = await Promise.race([
          getDoc(doc(db, 'classes', normaliseCode(classCode), 'students', safeStudentId(studentName))),
          new Promise((_, rej) => setTimeout(() => rej(new Error('evolve-resume-timeout')), 8000)),
        ]);
        const ev = snap.exists() ? (snap.data().evolve || {}) : {};
        if (cancelled) return;
        const d = {}, urls = {};
        EVOLVE_CHAPTERS.forEach(c => {
          const e = ev[c.id];
          if (!e?.completed) return;
          d[c.id] = { reflection: e.reflection || '' };
          if (e.clipURL) urls[c.id] = e.clipURL;
        });
        setDone(d); setClipURLs(urls);
        if (!Object.keys(d).length && !localStorage.getItem(INTRO_KEY)) setShowIntro(true);
        if (ev.filmURL) { setFilmURL(ev.filmURL); setFilmPhase('sent'); }
        if (ev.souvenirToken) setSouvenirToken(ev.souvenirToken);
      } catch (e) { console.warn('Evolve resume failed:', e); }
      finally { if (!cancelled) setHydrating(false); }
    })();
    return () => { cancelled = true; };
  }, [classCode, studentName]);

  // ── Camera lifecycle ──
  const stopCam = useCallback(() => {
    camRef.current?.getTracks().forEach(t => t.stop());
    camRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    if (phase !== 'record') { stopCam(); return; }
    let dead = false;
    navigator.mediaDevices.getUserMedia({
      // Portrait to match the 720x1280 film. Without this the clip is captured landscape and
      // the stitcher throws the sides away. `ideal` rather than `exact` so a desktop webcam
      // that cannot do portrait still works — the preview box crops it the same way the
      // stitcher will, so what the student frames is what ends up in the film either way.
      video: {
        facingMode: frontCam ? 'user' : 'environment',
        width: { ideal: 1080 }, height: { ideal: 1920 },
        aspectRatio: { ideal: 9 / 16 },
      },
      audio: true,
    }).then(stream => {
      if (dead) { stream.getTracks().forEach(t => t.stop()); return; }
      camRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}); }
    }).catch(err => {
      console.warn('Evolve camera error:', err);
      setCamError('We could not reach your camera. Check permissions, then try again.');
    });
    return () => { dead = true; };
  }, [phase, frontCam, stopCam]);

  useEffect(() => () => { stopCam(); clearInterval(tickRef.current); }, [stopCam]);

  // One minute of actually watching the animal, in place of asking them to type what they saw.
  useEffect(() => {
    if (phase !== 'watch') return;
    const h = setInterval(() => setWatchLeft(n => (n <= 1 ? 0 : n - 1)), 1000);
    return () => clearInterval(h);
  }, [phase]);

  function dismissIntro() {
    try { localStorage.setItem(INTRO_KEY, '1'); } catch { /* private mode */ }
    setShowIntro(false);
  }

  function openChapter(c) {
    if (done[c.id]) return;
    setChapter(c);
    setPhase('insight');
    setReflectText(''); setCamError(''); setWatchLeft(WATCH_SECONDS);
    setCountdown(CLIP_SECONDS);
    setEvScreen('chapter');
  }

  function backToMap() {
    clearInterval(tickRef.current);
    setRecording(false);
    stopCam();
    setChapter(null);
    setEvScreen('map');
  }

  function goHome() {
    if (!window.confirm('Leave Evolve? Anything you have not saved will be lost.')) return;
    stopCam();
    clearStudentSession();
    setCurrentScreen('home');
    setSessionType('standard');
  }

  // ── Recording ──
  function beginRecord() {
    const stream = camRef.current;
    if (!stream || recording) return;
    setCountdown(CLIP_SECONDS);
    const handle = startChapterRecording(stream, {
      onComplete: ({ blob, url, fileExt, contentType }) => {
        setClipURLs(prev => ({ ...prev, [chapter.id]: url }));
        setRecording(false);
        setPhase('preview');
        uploadClip(blob, fileExt, contentType, chapter.id);
      },
      onError: () => { setRecording(false); setCamError('That recording did not save. Please try again.'); },
    });
    if (!handle) { setCamError('Recording is not supported on this device.'); return; }
    recRef.current = handle;
    setRecording(true);
    tickRef.current = setInterval(() => {
      setCountdown(n => {
        if (n <= 1) { clearInterval(tickRef.current); handle.stop(); return 0; }
        return n - 1;
      });
    }, 1000);
  }

  function endRecord() {
    clearInterval(tickRef.current);
    recRef.current?.stop();
  }

  function uploadClip(blob, fileExt, contentType, chapterId) {
    if (!studentName || !classCode) return;
    pendingClipRef.current[chapterId] = { blob, fileExt, contentType };
    try {
      const code = normaliseCode(classCode);
      const sid = safeStudentId(studentName);
      const path = `evolve/${code}/${sid}/${chapterId}.${fileExt}`;
      const task = uploadBytesResumable(storageRef(storage, path), blob, { contentType });
      setUploadPct(p => ({ ...p, [chapterId]: 0 }));
      const stuck = setTimeout(() => {
        setUploadPct(p => (p[chapterId] === 0 ? { ...p, [chapterId]: 'error' } : p));
      }, 12000);
      task.on('state_changed',
        s => {
          const pct = s.totalBytes > 0 ? Math.round((s.bytesTransferred / s.totalBytes) * 100) : 0;
          if (pct > 0) clearTimeout(stuck);
          setUploadPct(p => ({ ...p, [chapterId]: pct }));
        },
        err => { clearTimeout(stuck); console.warn('Evolve clip upload:', err); setUploadPct(p => ({ ...p, [chapterId]: 'error' })); },
        async () => {
          clearTimeout(stuck);
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            await updateDoc(doc(db, 'classes', code, 'students', sid), { [`evolve.${chapterId}.clipURL`]: url });
            setUploadPct(p => ({ ...p, [chapterId]: 'done' }));
          } catch (e) { console.warn('Evolve clip URL:', e); setUploadPct(p => ({ ...p, [chapterId]: 'error' })); }
        });
    } catch (e) { console.warn('Evolve upload init:', e); }
  }

  function retryUpload(chapterId) {
    const p = pendingClipRef.current[chapterId];
    if (!p) return;
    setUploadPct(prev => ({ ...prev, [chapterId]: 0 }));
    uploadClip(p.blob, p.fileExt, p.contentType, chapterId);
  }

  // ── Save chapter ──
  async function saveChapter() {
    if (saving || !chapter) return;
    setSaving(true);
    try {
      // Saved as the finished sentence, so exports, the Advice Wall and any future teacher
      // view read "I will ..." rather than a fragment.
      const body = reflectText.trim();
      const entry = { reflection: chapter.writeLead ? `${chapter.writeLead} ${body}` : body };
      if (studentName && classCode) {
        const code = normaliseCode(classCode);
        const sid = safeStudentId(studentName);
        try {
          // Individual dotted fields, NOT a whole `evolve.{id}` object. Writing the object
          // replaces the map and destroys clipURL, which the upload has already written by
          // this point now that a student cannot leave the chapter until it finishes.
          await updateDoc(doc(db, 'classes', code, 'students', sid), {
            [`evolve.${chapter.id}.completed`]:   true,
            [`evolve.${chapter.id}.reflection`]:  entry.reflection,
            [`evolve.${chapter.id}.chapter`]:     chapter.chapter,
            [`evolve.${chapter.id}.order`]:       chapter.order,
            [`evolve.${chapter.id}.updatedAt`]:   serverTimestamp(),
          });
        } catch (e) { console.warn('Evolve chapter write failed:', e); }

        // The giraffe chapter is the one that outlives the excursion. It goes to the
        // moderation queue attributed by cohort year, never by student name.
        if (chapter.isAdvice && entry.reflection) {
          try {
            await addDoc(collection(db, 'evolveAdvice'), {
              classCode: code, program: 'evolve', chapterId: chapter.id,
              advice: entry.reflection,
              cohortYear: new Date().getFullYear(),
              status: 'pending', submittedAt: serverTimestamp(),
            });
          } catch (e) { console.warn('Advice submit failed:', e); }
        }
      }
      setDone(prev => ({ ...prev, [chapter.id]: entry }));
      // The leg arriving at the NEXT stop is the one that has just been walked.
      setJustLit(EVOLVE_STORY_ORDER.findIndex(c => c.id === chapter.id) + 1);
      backToMap();
    } finally { setSaving(false); }
  }

  // ── Film ──
  const startFilm = useCallback(() => {
    setFilmPhase('building'); setFilmPct(0); setFilmStage(-1); setFilmURL(null);
    setEvScreen('film');
  }, [setEvScreen]);

  useEffect(() => {
    if (evScreen !== 'film' || filmPhase !== 'building') return;
    let cancelled = false;
    (async () => {
      const result = await buildEvolveFilm({
        chapters: EVOLVE_STORY_ORDER,
        clipURLs,
        studentName,
        theme: T,
        onProgress: (pct, idx) => { if (!cancelled) { setFilmPct(pct); setFilmStage(idx); } },
        isCancelled: () => cancelled,
      });
      if (cancelled) return;
      if (result) { filmBlobRef.current = result.blob; setFilmURL(result.url); }
      setFilmPhase('preview');
    })();
    return () => { cancelled = true; };
  }, [evScreen, filmPhase, clipURLs, studentName]);

  async function submitFilm() {
    if (filmPhase === 'submitting') return;
    setFilmPhase('submitting');
    try {
      const code = normaliseCode(classCode);
      const sid = safeStudentId(studentName);
      let url = null;
      if (filmBlobRef.current) {
        const { fileExt, contentType } = pickMimeType();
        const path = `evolve/${code}/${sid}/film.${fileExt}`;
        const task = uploadBytesResumable(storageRef(storage, path), filmBlobRef.current, { contentType });
        await new Promise((res, rej) => task.on('state_changed', null, rej, res));
        url = await getDownloadURL(task.snapshot.ref);
      }
      const reflections = {};
      EVOLVE_CHAPTERS.forEach(c => { if (done[c.id]) reflections[c.id] = done[c.id]; });
      // Souvenir token. The keepsake URL (?doc=ev_{code}_{sid}_{token}) is what goes on an NFC
      // tag: short enough for an NTAG213, and it resolves through this doc, so the tag keeps
      // working if the film is ever re-stitched or re-uploaded. Without the token the URL would
      // be trivially guessable — six-character class codes and aliases from a short list.
      // Re-submitting keeps the existing token so tags already written stay valid.
      const docRef = doc(db, 'evolve_docs', `${code}_${sid}`);
      const existing = await getDoc(docRef).catch(() => null);
      const souvenirToken = existing?.data()?.souvenirToken || makeSouvenirToken();
      await setDoc(docRef, {
        classCode: code, studentId: sid, studentName,
        cohortYear: new Date().getFullYear(),
        filmURL: url, reflections, completedAt: serverTimestamp(), souvenirToken,
      }, { merge: true });
      await updateDoc(doc(db, 'classes', code, 'students', sid), {
        'evolve.filmURL': url, 'evolve.sessionCompleted': true, 'evolve.completedAt': serverTimestamp(),
        'evolve.souvenirToken': souvenirToken,
      });
      setSouvenirToken(souvenirToken);
      setFilmURL(url || filmURL);
      setFilmPhase('sent');
    } catch (e) {
      console.warn('Evolve film submit failed:', e);
      setFilmPhase('preview');
      window.alert('We could not save your film. Please check your connection and try again.');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  if (hydrating) {
    return (
      <Shell scroll={false}>
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.2rem' }}>
          <img src="/images/logo.png" alt="" style={{ height:60, opacity:0.85 }} onError={e => e.target.style.display='none'} />
          <p style={{ color:T.textDim, fontSize:'0.72rem', letterSpacing:'0.16em', textTransform:'uppercase', fontWeight:700 }}>Loading Evolve</p>
        </div>
      </Shell>
    );
  }

  // ── Opener ──
  if (showIntro) {
    return (
      <Shell scroll>
        <div className="ev-horizon" />
        <div className="ev-wrap ev-intro">
          <div className="ev-eyebrow">Taronga Zoo Sydney · Twilight</div>
          <h1 className="taronga-title ev-title">Evolve</h1>
          <p className="ev-intro-lede">
            You are about to leave school. Tonight is a chance to put some of that down: where
            you have come from, where you are going, and what you want to carry with you.
          </p>

          <ol className="ev-steps">
            {INTRO_STEPS.map(st => (
              <li key={st.n} className="ev-step">
                <span className="ev-step-n">{st.n}</span>
                <span>
                  <span className="ev-step-t">{st.title}</span>
                  <span className="ev-step-b">{st.body}</span>
                </span>
              </li>
            ))}
          </ol>

          <p className="ev-intro-foot">
            Your five clips become one short film. No marks, no points. It is yours to keep.
          </p>

          <button className="ev-cta ev-intro-cta" onClick={dismissIntro}>Start the walk</button>
        </div>
      </Shell>
    );
  }

  // ── Film screen ──
  if (evScreen === 'film') {
    // The stitch screen centres itself in the viewport, so it sits outside the padded column
    // the preview and sent states share.
    if (filmPhase === 'building') {
      return (
        <Shell onHome={goHome}>
          <BuildingFilm pct={filmPct} stage={filmStage} chapters={filmChapters} />
        </Shell>
      );
    }
    return (
      <Shell onHome={goHome}>
        <div style={{ maxWidth:520, margin:'0 auto', padding:'3.5rem 1.25rem 3rem', textAlign:'center' }}>
          {(filmPhase === 'preview' || filmPhase === 'submitting') && (
            <>
              <h2 className="taronga-title" style={{ color:T.text, fontSize:'1.8rem', marginBottom:'1rem' }}>Your film</h2>
              {filmURL ? (
                <video src={filmURL} controls playsInline style={{ width:'100%', borderRadius:14, marginBottom:'1.25rem', background:'#000' }} />
              ) : (
                <p style={{ color:T.textDim, marginBottom:'1.25rem' }}>
                  Your device could not stitch the film, but every chapter clip has been saved.
                </p>
              )}
              <button onClick={submitFilm} disabled={filmPhase === 'submitting'}
                style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none', background:T.accent, color:'#241503', fontWeight:800, fontSize:'0.95rem', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.7rem' }}>
                {filmPhase === 'submitting' ? 'Saving…' : 'Keep this film'}
              </button>
              <button onClick={() => setEvScreen('map')} style={{ background:'none', border:'none', color:T.textDim, cursor:'pointer', fontSize:'0.85rem' }}>
                ← Back to chapters
              </button>
            </>
          )}

          {filmPhase === 'sent' && (
            <>
              <div style={{ fontSize:'2.4rem', marginBottom:'0.5rem' }}>🌅</div>
              <h2 className="taronga-title" style={{ color:T.text, fontSize:'1.8rem', marginBottom:'0.6rem' }}>That's yours to keep</h2>
              <p style={{ color:T.textDim, fontSize:'0.92rem', lineHeight:1.7, marginBottom:'1.5rem' }}>
                Your film and everything you wrote have been saved. Your teacher can give you the link to keep.
              </p>
              {filmURL && <video src={filmURL} controls playsInline style={{ width:'100%', borderRadius:14, marginBottom:'1.25rem', background:'#000' }} />}
              {souvenirLink && <TagWriter link={souvenirLink} />}
              <button onClick={goHome}
                style={{ width:'100%', padding:'0.9rem', borderRadius:999, border:`1px solid ${T.border}`, background:'rgba(0,0,0,0.25)', color:T.text, fontWeight:700, cursor:'pointer' }}>
                Finish
              </button>
            </>
          )}
        </div>
      </Shell>
    );
  }

  // ── Chapter flow ──
  if (chapter && evScreen === 'chapter') {
    const near = chapter.latitude == null ? { nearby: true } : checkAnimalProximity(chapter);

    return (
      <Shell onHome={backToMap}>
        <div style={{ maxWidth:560, margin:'0 auto', padding:'3.25rem 1.25rem 3rem' }}>
          <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
            <div style={{ fontSize:'0.66rem', fontWeight:800, letterSpacing:'0.22em', textTransform:'uppercase', color:T.accent, marginBottom:'0.4rem' }}>
              Chapter {WORDS[chapter.order - 1] || chapter.order} · {chapter.animalName}
            </div>
            <h2 className="taronga-title" style={{ color:T.text, fontSize:'clamp(1.7rem,5vw,2.2rem)', margin:0 }}>{chapter.chapter}</h2>
          </div>

          {phase === 'insight' && (
            <>
              {/* One big picture and one short idea. The "watch for" line lives on the next
                  screen where it is actually needed, so nothing competes here. */}
              <div className="ev-hero">
                <img src={chapter.image} alt="" onError={e => e.target.style.display = 'none'} />
              </div>
              <p className="ev-insight">{chapter.insight}</p>
              <button className="ev-cta ev-insight-cta" onClick={() => { setWatchLeft(WATCH_SECONDS); setPhase('watch'); }}>
                Start
              </button>
            </>
          )}

          {phase === 'watch' && (() => {
            const done60 = watchLeft === 0;
            const frac = (WATCH_SECONDS - watchLeft) / WATCH_SECONDS;
            return (
              <div className="ev-watch">
                <p className="ev-watch-prompt">{chapter.observePrompt}</p>

                <div className="ev-dial">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle cx="60" cy="60" r="54" className="ev-dial-track" />
                    <circle cx="60" cy="60" r="54" className="ev-dial-fill" pathLength="1"
                      style={{ strokeDashoffset: 1 - frac }} />
                  </svg>
                  <div className="ev-dial-mid">
                    <span className="ev-dial-num">{done60 ? '✓' : watchLeft}</span>
                    <span className="ev-dial-lbl">{done60 ? 'time up' : 'seconds'}</span>
                  </div>
                </div>

                <p className="ev-watch-hint">
                  {done60 ? 'Now put what you saw into words.' : 'Put the phone down and watch. No need to write anything yet.'}
                </p>

                <button className="ev-cta ev-insight-cta" disabled={!done60} onClick={() => setPhase('write')}>
                  {done60 ? 'Now write' : 'Keep watching'}
                </button>
                {!done60 && (
                  <button className="ev-skip" onClick={() => setWatchLeft(0)}>Skip the timer</button>
                )}
              </div>
            );
          })()}

          {phase === 'write' && (() => {
            const wc = wordCount(reflectText);
            const minWords = chapter.minWords || EVOLVE_MIN_WORDS;
            const ready = wc >= minWords;
            return (
              <>
                {/* An array prompt renders as separate paragraphs, the first one lifted out
                    bold and centred so the idea lands before the instruction. */}
                {Array.isArray(chapter.reflectionPrompt) ? (
                  <div className="ev-prompt">
                    {chapter.reflectionPrompt.map((para, pi) => (
                      <p key={pi} className={pi === 0 ? 'ev-prompt-lead' : 'ev-prompt-body'}>{para}</p>
                    ))}
                  </div>
                ) : (
                  <p style={{ color:T.text, fontSize:'1rem', lineHeight:1.7, marginBottom:'1rem', fontWeight:600 }}>{chapter.reflectionPrompt}</p>
                )}
                {/* Every chapter writes into the same panel, opening with its own short
                    first-person lead in the Taronga face that the student completes. */}
                <div className={`ev-write${ready ? ' ev-write-on' : ''}`}>
                  {chapter.writeLead && (
                    <span className="taronga-title ev-write-lead">{chapter.writeLead}</span>
                  )}
                  <textarea value={reflectText} onChange={e => setReflectText(e.target.value)}
                    rows={chapter.isPledge ? 4 : 7}
                    placeholder={chapter.placeholder} className="ev-write-input" />
                </div>
                {/* Once they clear the floor the target disappears, so a low minimum does not
                    read as the goal and invite everyone to stop at exactly twelve words. */}
                <div className={`ev-count${ready ? ' ev-count-on' : ''}`}>
                  {ready ? `${wc} word${wc === 1 ? '' : 's'}` : `${wc} / ${minWords} words`}
                </div>
                <button onClick={() => { setCamError(''); setPhase('record'); }} disabled={!ready}
                  style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none', background: ready ? T.accent : 'rgba(255,255,255,0.15)', color: ready ? '#241503' : T.textDim, fontWeight:800, cursor: ready ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                  {ready ? (chapter.isPledge ? 'Make this my pledge' : 'To camera') : 'Keep writing'}
                </button>
              </>
            );
          })()}

          {phase === 'record' && (
            <>
              <div className="ev-say">
                <div className="ev-say-label">To camera</div>
                <p className="ev-say-ask">{chapter.filmPrompt}</p>
                <p className="ev-say-link">{chapter.filmLink}</p>
              </div>
              <div className="ev-cam">
                <video ref={videoRef} playsInline muted autoPlay style={{ transform: frontCam ? 'scaleX(-1)' : 'none' }} />
                {recording && (
                  <div style={{ position:'absolute', top:10, left:10, background:'rgba(200,30,30,0.9)', color:'white', padding:'0.25rem 0.7rem', borderRadius:999, fontSize:'0.78rem', fontWeight:800 }}>
                    ● {countdown}s
                  </div>
                )}
              </div>
              {camError && <p style={{ color:'#FCA5A5', fontSize:'0.85rem', marginBottom:'0.8rem' }}>{camError}</p>}
              <p style={{ color:T.textDim, fontSize:'0.78rem', lineHeight:1.5, marginBottom:'0.9rem' }}>
                It's twilight, so hold your torch up near your face so the camera can see you.
              </p>
              <div style={{ display:'flex', gap:'0.6rem' }}>
                {!recording ? (
                  <>
                    <button onClick={() => setFrontCam(f => !f)}
                      style={{ padding:'0.9rem 1rem', borderRadius:999, border:`1px solid ${T.border}`, background:'rgba(0,0,0,0.25)', color:T.text, fontWeight:700, cursor:'pointer', fontSize:'0.85rem' }}>
                      Flip
                    </button>
                    <button onClick={beginRecord}
                      style={{ flex:1, padding:'0.95rem', borderRadius:999, border:'none', background:T.accent, color:'#241503', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                      Record {CLIP_SECONDS}s
                    </button>
                  </>
                ) : (
                  <button onClick={endRecord}
                    style={{ flex:1, padding:'0.95rem', borderRadius:999, border:'none', background:'#C1272D', color:'white', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                    Stop
                  </button>
                )}
              </div>
            </>
          )}

          {phase === 'preview' && (
            <>
              {clipURLs[chapter.id] && (
                <div className="ev-cam ev-cam-play">
                  <video src={clipURLs[chapter.id]} controls playsInline />
                </div>
              )}
              {(() => {
                // A clip only reaches the film once Storage has it. Until then the student
                // stays put — walking away mid-upload silently loses that chapter's footage,
                // and they would not find out until the film was made.
                const up = uploadPct[chapter.id];
                const uploading = typeof up === 'number';
                const failed    = up === 'error';
                const uploaded  = up === 'done';
                const pct = uploading ? up : 0;

                return (
                  <>
                    <div style={{ marginBottom:'1.1rem' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.8rem', color: failed ? '#FCA5A5' : uploaded ? T.accent : T.textDim, marginBottom:'0.35rem', fontWeight:600 }}>
                        <span>
                          {uploaded ? '✓ Clip saved'
                            : failed ? 'Your clip did not save'
                            : `Saving your clip… ${pct}%`}
                        </span>
                        {uploading && <span>{pct}%</span>}
                      </div>
                      {!failed && (
                        <div style={{ height:6, background:'rgba(0,0,0,0.3)', borderRadius:3, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${uploaded ? 100 : pct}%`, background:T.accent, transition:'width 0.3s' }} />
                        </div>
                      )}
                      {!uploaded && !failed && (
                        <p style={{ fontSize:'0.74rem', color:T.textDim, margin:'0.4rem 0 0', lineHeight:1.5 }}>
                          Keep this screen open until it finishes, or this chapter will be missing from your film.
                        </p>
                      )}
                      {failed && (
                        <p style={{ fontSize:'0.74rem', color:T.textDim, margin:'0.4rem 0 0', lineHeight:1.5 }}>
                          Check your connection and try again. Your recording is still here.
                        </p>
                      )}
                    </div>

                    {failed ? (
                      <button onClick={() => retryUpload(chapter.id)}
                        style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none', background:T.accent, color:'#241503', fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.6rem' }}>
                        Try saving again
                      </button>
                    ) : (
                      <button onClick={saveChapter} disabled={saving || !uploaded}
                        style={{ width:'100%', padding:'0.95rem', borderRadius:999, border:'none', background: uploaded && !saving ? T.accent : 'rgba(255,255,255,0.15)', color: uploaded && !saving ? '#241503' : T.textDim, fontWeight:800, cursor: uploaded && !saving ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.6rem' }}>
                        {saving ? 'Saving…' : uploaded ? 'Keep this chapter' : 'Waiting for your clip…'}
                      </button>
                    )}

                    <button onClick={() => { setCamError(''); setPhase('record'); setCountdown(CLIP_SECONDS); }} disabled={uploading}
                      style={{ width:'100%', padding:'0.8rem', borderRadius:999, border:`1px solid ${T.border}`, background:'none', color:T.textDim, fontWeight:600, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.45 : 1 }}>
                      Record it again
                    </button>
                  </>
                );
              })()}
            </>
          )}

          {phase !== 'insight' && chapter.latitude != null && !near.nearby && (
            <p style={{ color:T.textDim, fontSize:'0.78rem', textAlign:'center', marginTop:'1rem' }}>
              You've moved away from {chapter.animalName}.
            </p>
          )}
        </div>
      </Shell>
    );
  }

  // ── Map / chapter list ──
  const doneCount = Object.keys(done).length;

  return (
    <Shell onHome={goHome}>
      {/* The page warms from deep dusk at the top to last light at the bottom, so moving down
          the trail is literally walking toward the horizon the film closes on. */}
      <div className="ev-horizon" />
      <div className="ev-wrap">

        <header className="ev-head">
          <div className="ev-eyebrow">Taronga Zoo Sydney · Twilight</div>
          <h1 className="taronga-title ev-title">Evolve</h1>
          <p className="ev-sub">Five chapters. One story. Yours.</p>
          <button className="ev-how" onClick={() => setShowIntro(true)}>How this works</button>
          {studentName && (
            <div className="ev-progress">
              <span className="ev-rule" />
              <span>{studentName} · {doneCount === 0 ? 'not started' : `${WORDS[doneCount - 1]} of five`}</span>
              <span className="ev-rule" />
            </div>
          )}
        </header>

        {!locationEnabled && (
          <button onClick={() => enableLocation?.()} className="ev-gps">
            <span className="ev-gps-dot" />
            Turn on location so chapters unlock as you reach each animal
          </button>
        )}

        <ol className="ev-trail">
          {EVOLVE_STORY_ORDER.map((c, i) => {
            const complete = !!done[c.id];
            const near = c.latitude == null ? { nearby: true, distance: null } : checkAnimalProximity(c);
            const prevDone = i === 0 || !!done[EVOLVE_STORY_ORDER[i - 1].id];
            // The story only reads in order, so a chapter needs the one before it finished as
            // well as the student standing at the animal. Sequence is checked first because
            // "walk to the lion" is useless advice to someone who hasn't done the koala yet.
            const locked = !complete && (!prevDone || !near.nearby);
            const state = complete ? 'done' : locked ? 'locked' : 'open';
            return (
              <li key={c.id} className={`ev-stop ev-${state}`} style={{ animationDelay: `${0.06 * i}s` }}>
                <span className="ev-gutter" aria-hidden="true">
                  <Segment lit={prevDone} side={i % 2 === 0 ? 'l' : 'r'} first={i === 0} index={i} draw={justLit === i} />
                  <span className="ev-node" style={{ left: i % 2 === 0 ? '16%' : '84%' }}>{complete ? '✓' : ''}</span>
                </span>

                <button className="ev-card" onClick={() => !locked && !complete && openChapter(c)} disabled={complete || locked}>
                  <span className="ev-card-text">
                    <span className="ev-chapter">Chapter {WORDS[i]}</span>
                    <span className="taronga-title ev-name">{c.chapter}</span>
                    <span className="ev-meta">
                      {complete ? 'Written and filmed'
                        : !prevDone ? `Finish Chapter ${WORDS[i - 1]} first`
                        : locked ? `Walk to the ${c.animalName.toLowerCase()}${near.distance != null ? ` · ${near.distance} m away` : ''}`
                        : c.animalName}
                    </span>
                  </span>
                  <span className="ev-still" style={{ backgroundImage: `url(${c.image})` }} />
                </button>
              </li>
            );
          })}

          {/* The destination sits in the horizon glow at the end of the trail. */}
          <li className={`ev-stop ev-end ${allDone ? 'ev-open' : 'ev-locked'}`}>
            <span className="ev-gutter" aria-hidden="true">
              <Segment lit={allDone} side="l" last index={EVOLVE_CHAPTERS.length} draw={justLit === EVOLVE_CHAPTERS.length} />
              <span className="ev-node ev-node-end" style={{ left: '16%' }}>✦</span>
            </span>
            <div className="ev-dest">
              <span className="ev-chapter">The end of the walk</span>
              <span className="taronga-title ev-name">Your film</span>
              {filmPhase === 'sent' ? (
                <>
                  <span className="ev-meta">Saved. Yours to keep.</span>
                  <button className="ev-cta" onClick={() => setEvScreen('film')}>Watch your film</button>
                </>
              ) : allDone ? (
                <>
                  <span className="ev-meta">
                    {filmedCount > 0
                      ? `${filmedCount} chapter${filmedCount === 1 ? '' : 's'} ready to become one film.`
                      : 'Your writing is safe, but none of your clips reached us. Tell your teacher.'}
                  </span>
                  <button className="ev-cta" onClick={startFilm} disabled={filmedCount === 0}>Make my film</button>
                </>
              ) : (
                <span className="ev-meta">Your five chapters become one short film, once the walk is done.</span>
              )}
            </div>
          </li>
        </ol>
      </div>


    </Shell>
  );
}
