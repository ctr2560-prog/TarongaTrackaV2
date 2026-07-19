// subjectMeta.js — shared subject metadata for pre/post lesson links (admin + teacher Resource Hub)

export const SUBJ_META = {
  science: { label: 'Science & Technology', color: '#1A5238', light: 'rgba(26,82,56,0.15)',   border: 'rgba(26,82,56,0.35)' },
  maths:   { label: 'Mathematics',          color: '#0369A1', light: 'rgba(3,105,161,0.15)',  border: 'rgba(3,105,161,0.35)' },
  english: { label: 'English',              color: '#7C3AED', light: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.35)' },
  pdhpe:   { label: 'PDHPE',                color: '#BE185D', light: 'rgba(190,24,93,0.15)',  border: 'rgba(190,24,93,0.35)' },
};

export const STAGES = [2, 3, 4, 5];

export function prePostDocId(subject, stage, timing) {
  return `${subject}_${stage}_${timing}`;
}

export function toCanvaEmbedUrl(url) {
  if (!url) return url;
  const trimmed = url.trim();
  if (/[?&]embed(=|&|$)/.test(trimmed)) return trimmed;
  return trimmed + (trimmed.includes('?') ? '&embed' : '?embed');
}

// Images already on file in public/images — offered as a picker for lesson cards.
export const IMAGE_LIBRARY = [
  {
    category: 'Mission Animals',
    items: [
      { src: '/images/tiger.jpg',                label: 'Sumatran Tiger' },
      { src: '/images/lion.jpg',                  label: 'African Lion' },
      { src: '/images/giraffe.jpg',               label: 'Giraffe' },
      { src: '/images/koala.jpg',                 label: 'Koala' },
      { src: '/images/gorilla.jpg',                label: 'Gorilla' },
      { src: '/images/chimpanzee.jpg',             label: 'Chimpanzee' },
      { src: '/images/lemur.jpg',                  label: 'Lemur' },
      { src: '/images/dingo.jpg',                  label: 'Dingo' },
      { src: '/images/sea-lion.jpg',                label: 'Sea Lion' },
      { src: '/images/rhino.jpg',                  label: 'Rhino' },
      { src: '/images/binturong.jpg',               label: 'Binturong' },
      { src: '/images/sun-bear.jpg',                label: 'Sun Bear' },
      { src: '/images/asian-water-buffalo.jpg',     label: 'Asian Water Buffalo' },
    ],
  },
  {
    // Supplementary stock photos (Wikimedia Commons, CC-licensed) for species not covered
    // by an in-app mission. Attribution: see public/images/STOCK_CREDITS.md.
    category: 'More Zoo Animals (stock)',
    items: [
      { src: '/images/stock-elephant.jpg',           label: 'Asian Elephant' },
      { src: '/images/stock-meerkat.jpg',            label: 'Meerkat' },
      { src: '/images/stock-snow-leopard.jpg',       label: 'Snow Leopard' },
      { src: '/images/stock-red-panda.jpg',          label: 'Red Panda' },
      { src: '/images/stock-tasmanian-devil.jpg',    label: 'Tasmanian Devil' },
      { src: '/images/stock-echidna.jpg',            label: 'Short-Beaked Echidna' },
      { src: '/images/stock-wombat.jpg',             label: 'Common Wombat' },
      { src: '/images/stock-platypus.jpg',           label: 'Platypus' },
      { src: '/images/stock-komodo-dragon.jpg',      label: 'Komodo Dragon' },
      { src: '/images/stock-galapagos-tortoise.jpg', label: 'Galápagos Tortoise' },
    ],
  },
  {
    category: 'Zoo & Habitat',
    items: [
      { src: '/images/blue-mountains-bushwalk.jpg', label: 'Blue Mountains Bushwalk' },
      { src: '/images/concert-lawn.jpg',            label: 'Concert Lawn' },
      { src: '/images/taronga-map.png',             label: 'Zoo Map' },
      { src: '/images/africa-map.png',              label: 'Africa Map' },
    ],
  },
];
