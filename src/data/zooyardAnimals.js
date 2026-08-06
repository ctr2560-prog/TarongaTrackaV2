// zooyardAnimals.js — ZooYard (self-attest, no-GPS school program) content, Science v1
// Reuses the same animal ids as src/data/animals.js on purpose: same photos (/images/{id}.jpg),
// same badge art (/images/badge-{id}.png), and koala/giraffe already have hand-tuned keyword
// scoring branches in scoring.js's scoreObservation(). Safe because ZooYard classes are entirely
// separate class documents from any daytime class.

export const ZOOYARD_ANIMALS = [
  {
    id: 'koala',
    name: 'Koala',
    scientificName: 'Phascolarctos cinereus',
    image: '/images/koala.jpg',
    habitatArea: 'bushland',
    habitatLabel: 'Australian Bushland',
    habitatColor: '#7A8B6F',
    selfAttestPrompt: 'Find a tree in your schoolyard or nearby.',
    selfAttestQuestion: 'Are you standing near a tree?',
    videoUrl: null,
    activity: {
      question: 'What is the single biggest threat to koalas surviving in the wild today?',
      options: ['Habitat loss from land clearing', 'Too much rain', 'Other koalas', 'Being too friendly'],
      correct: 0,
      fact: 'Land clearing for housing, farming and roads is the single biggest driver of koala decline — without enough trees, koalas lose their food, shelter and safe pathways between habitats.',
    },
    writingPromptByStage: {
      2: 'Look at your tree. What does it give a koala — food, a place to sleep, or somewhere to hide?',
      3: 'Describe your tree. What would a koala need from a tree like this to survive?',
      4: 'Describe your tree and explain what it would give a koala living there — food, shelter, or safety.',
      5: 'Explain why a single tree matters to a koala\'s survival, and what happens when trees like it are cleared.',
    },
  },
  {
    id: 'tiger',
    name: 'Sumatran Tiger',
    scientificName: 'Panthera tigris sumatrae',
    image: '/images/tiger.jpg',
    habitatArea: 'rainforest',
    habitatLabel: 'Sumatran Rainforest',
    habitatColor: '#E86A33',
    selfAttestPrompt: 'Find a shady, leafy spot — under a tree, a garden bed, anywhere green and covered.',
    selfAttestQuestion: 'Are you standing somewhere shady and green?',
    videoUrl: null,
    activity: {
      question: 'What is the main reason Sumatran tiger habitat is disappearing?',
      options: ['Rainforest cleared for palm oil and paper plantations', 'Too many tigers competing for space', 'Rising sea levels', 'Tigers moving to cities'],
      correct: 0,
      fact: 'Sumatra\'s rainforest is being cleared at a rapid rate for palm oil and paper plantations, fragmenting the last wild spaces tigers need to hunt and roam.',
    },
    writingPromptByStage: {
      2: 'Look at your shady, green spot. Why might a tiger need cover like this to hide and hunt?',
      3: 'Describe your shady spot. How is it similar to the cover a tiger needs in the rainforest?',
      4: 'Describe your spot and explain why dense, connected cover matters for a hunting animal like a tiger.',
      5: 'Explain how clearing rainforest for plantations breaks up the cover tigers rely on to hunt and survive.',
    },
  },
  {
    id: 'giraffe',
    name: 'Giraffe',
    scientificName: 'Giraffa camelopardalis',
    image: '/images/giraffe.jpg',
    habitatArea: 'savannah',
    habitatLabel: 'African Savannah',
    habitatColor: '#D97706',
    selfAttestPrompt: 'Find an open, grassy space — an oval, a field, anywhere wide open.',
    selfAttestQuestion: 'Are you standing somewhere open and grassy?',
    videoUrl: null,
    activity: {
      question: 'What has happened to giraffe populations across Africa over the last 30 years?',
      options: ['They\'ve declined sharply as savannah is fragmented by farms and fences', 'They\'ve doubled', 'They\'ve stayed exactly the same', 'They\'ve moved entirely into forests'],
      correct: 0,
      fact: 'Giraffe numbers have dropped sharply in recent decades as open savannah is fragmented by farms, fences and settlements, cutting off the long routes giraffes travel to find food and water.',
    },
    writingPromptByStage: {
      2: 'Look at your open space. Why would a tall animal like a giraffe need lots of open room?',
      3: 'Describe your open space. How does it compare to the wide savannah a giraffe roams?',
      4: 'Describe your space and explain why giraffes need large, connected areas of open land.',
      5: 'Explain what happens to a giraffe\'s ability to find food and water when open savannah gets fragmented.',
    },
  },
];

export const ZOOYARD_HABITAT_META = {
  bushland:  { label: 'Australian Bushland', color: '#7A8B6F' },
  rainforest: { label: 'Sumatran Rainforest', color: '#E86A33' },
  savannah:  { label: 'African Savannah',    color: '#D97706' },
};

// Richer per-habitat visual theme — used for the more immersive activity/quiz screens.
// Distinct from habitatColor (a single accent used for badges etc.) — this carries a full
// gradient + texture + iconography so each habitat feels like a different place, not just
// a different accent colour.
export const ZOOYARD_HABITAT_THEME = {
  bushland: {
    icon: '🌳',
    videoBg: '/videos/habitat-bushland.mp4',
    bgGradient: 'linear-gradient(160deg, #1B2410 0%, #33461F 45%, #5C7233 85%, #8AA354 100%)',
    cardGradient: 'linear-gradient(160deg, #E5E8DE, #FFFFFF)',
    accent: '#5C7233',
    accentSoft: '#E8EBE2',
    accentBorder: 'rgba(92,114,51,0.4)',
  },
  rainforest: {
    icon: '🌴',
    videoBg: '/videos/habitat-rainforest.mp4',
    bgGradient: 'linear-gradient(160deg, #061512 0%, #0D2E24 45%, #164A38 85%, #226B4D 100%)',
    cardGradient: 'linear-gradient(160deg, #DCE7E3, #FFFFFF)',
    accent: '#226B4D',
    accentSoft: '#E0EAE6',
    accentBorder: 'rgba(34,107,77,0.4)',
  },
  savannah: {
    icon: '🌾',
    videoBg: '/videos/habitat-savannah.mp4',
    bgGradient: 'linear-gradient(160deg, #3A2510 0%, #6B4A1E 45%, #B37F2C 85%, #E3A83B 100%)',
    cardGradient: 'linear-gradient(160deg, #F3EBDD, #FFFFFF)',
    accent: '#B37F2C',
    accentSoft: '#F3EBDD',
    accentBorder: 'rgba(179,127,44,0.4)',
  },
};

export const ZOOYARD_CITIZEN_SCIENCE_TASK = {
  id: 'habitat-hero',
  title: 'Habitat Hero',
  intro: 'Koalas, tigers and giraffes all need the same basics to survive — shelter, food and water. Human activity is stripping all three away in the wild. Now it\'s your turn to give something back.',
  instructions: 'Build or improve ONE small wildlife-friendly feature at your school:',
  options: [
    'A leaf-litter pile',
    'A native plant',
    'A bug hotel',
    'A water dish for birds',
    'A small no-mow patch',
  ],
  callToAction: 'Once it\'s done, snap a photo as your evidence.',
};
