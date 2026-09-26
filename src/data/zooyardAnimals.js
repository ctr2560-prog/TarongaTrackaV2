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
    selfAttestWhere: 'Go and stand next to a tree.',
    selfAttestPrompt: 'Anywhere in your schoolyard, or just outside it.',
    selfAttestQuestion: 'Are you standing near a tree?',
    videoUrl: null,
    activity: {
      question: 'What is the single biggest threat to koalas surviving in the wild today?',
      options: ['Habitat loss from land clearing', 'Too much rain', 'Other koalas', 'Being too friendly'],
      correct: 0,
      fact: 'Land clearing for housing, farming and roads is the single biggest driver of koala decline. Without enough trees, koalas lose their food, shelter and safe pathways between habitats.',
    },
    fieldStudy: {
      title: 'Canopy Connection',
      icon: '🌳',
      steps: [
        'Stand at your tree and look around for the nearest other tree.',
        'Walk straight to it, counting big steps as you go.',
        'Write down how many steps it took.',
      ],
      question: 'How many big steps to the nearest other tree?',
      unit: 'steps',
      max: 200,
      benchmark: 'Koalas are built for climbing, not walking. On the ground they are exposed to dogs and cars, and it is where most koala deaths happen. A gap of more than about 20 steps is a crossing many koalas will not risk.',
    },
    writingPromptByStage: {
      2: 'You counted {n} steps to the next tree. Could a koala get there safely? What might happen to it on the ground?',
      3: 'You counted {n} steps between trees. Explain whether a koala could safely cross that gap, and what the risk would be.',
      4: 'You counted {n} steps between trees. Explain what that gap means for a koala moving through your schoolyard, and what would make it safer.',
      5: 'You counted {n} steps between trees. Explain how gaps like this affect a koala population over time, not just one animal, and what would reconnect them.',
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
    selfAttestWhere: 'Go and stand somewhere shady and green.',
    selfAttestPrompt: 'Under a tree, beside a garden bed, anywhere leafy and covered.',
    selfAttestQuestion: 'Are you standing somewhere shady and green?',
    videoUrl: null,
    activity: {
      question: 'What is the main reason Sumatran tiger habitat is disappearing?',
      options: ['Rainforest cleared for palm oil and paper plantations', 'Too many tigers competing for space', 'Rising sea levels', 'Tigers moving to cities'],
      correct: 0,
      fact: 'Sumatra\'s rainforest is being cleared at a rapid rate for palm oil and paper plantations, fragmenting the last wild spaces tigers need to hunt and roam.',
    },
    fieldStudy: {
      title: 'The Concealment Test',
      icon: '👁️',
      steps: [
        'Crouch down in your shady spot and stay still.',
        'A partner walks slowly away, counting their steps.',
        'They stop the moment they can no longer see you. Write down that number.',
      ],
      question: 'At how many steps did you disappear?',
      unit: 'steps',
      max: 200,
      benchmark: 'A tiger is an ambush hunter. It has to get within about 20 metres, roughly 25 steps, before it is seen, or the hunt is over. Cover is not decoration for a tiger. It is the whole strategy.',
    },
    writingPromptByStage: {
      2: 'You disappeared at {n} steps. Would a tiger be able to hide in a spot like this? Why or why not?',
      3: 'You disappeared at {n} steps. A tiger needs to get within about 25 steps unseen. Explain whether your spot would work for hunting.',
      4: 'You disappeared at {n} steps, and a tiger needs to close to about 25 steps unseen. Explain what your result says about this spot as hunting cover, and what would improve it.',
      5: 'You disappeared at {n} steps against a tiger\'s roughly 25 step requirement. Explain what happens to a tiger\'s hunting success as plantations thin out cover like this.',
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
    selfAttestWhere: 'Go and stand in an open, grassy space.',
    selfAttestPrompt: 'An oval, a field, anywhere wide and open with sky above you.',
    selfAttestQuestion: 'Are you standing somewhere open and grassy?',
    videoUrl: null,
    activity: {
      question: 'What has happened to giraffe populations across Africa over the last 30 years?',
      options: ['They\'ve declined sharply as savannah is fragmented by farms and fences', 'They\'ve doubled', 'They\'ve stayed exactly the same', 'They\'ve moved entirely into forests'],
      correct: 0,
      fact: 'Giraffe numbers have dropped sharply in recent decades as open savannah is fragmented by farms, fences and settlements, cutting off the long routes giraffes travel to find food and water.',
    },
    fieldStudy: {
      title: 'Sightline Survey',
      icon: '🔭',
      steps: [
        'Stand still in your open space.',
        'Turn slowly all the way around, one full circle.',
        'Count everything that blocks your view: fences, buildings, hedges, sheds.',
      ],
      question: 'How many things blocked your view?',
      unit: 'blockers',
      max: 50,
      benchmark: 'A giraffe trades cover for vision. Standing up to 5.5 metres tall, it can spot a lion well over a kilometre away, and that early warning is its main defence. Every fence and building cuts a line of sight that a giraffe would rely on.',
    },
    writingPromptByStage: {
      2: 'You counted {n} things blocking your view. Could a giraffe see danger coming here? Why does seeing far away help a giraffe?',
      3: 'You counted {n} things blocking your view. Explain how that would affect a giraffe trying to spot a predator early.',
      4: 'You counted {n} blockers in your view. Explain what that means for an animal that depends on long sightlines, and how fences change open country.',
      5: 'You counted {n} blockers in a single turn. Explain how fragmentation of open savannah affects both a giraffe\'s safety and its ability to reach food and water.',
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
  intro: 'Koalas, tigers and giraffes all need the same basics to survive: shelter, food and water. Human activity is stripping all three away in the wild. Now it\'s your turn to give something back.',
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
