// evolveAnimals.js — Evolve (Stage 6 twilight excursion) content.
//
// Evolve is deliberately NOT a quiz-and-badge mode. There are no points, no marks and no
// leaderboard: the writing is a memento the student keeps, and the five clips stitch into
// one short film about leaving school.
//
// Each animal is a CHAPTER in a single narrative — past, threshold, future, legacy,
// responsibility — and the metaphor is earned by the animal's real behaviour, not decoration.
// `order` fixes the story sequence: students unlock chapters by GPS in whatever order the zoo
// allows, but the film is always assembled in this order (see buildEvolveFilm).
//
// GPS coordinates for lion/tiger/giraffe/koala are lifted from src/data/animals.js so Evolve
// matches the daytime map exactly. Kangaroo has never existed in this app — its coordinates,
// map pin and photo still need capturing on site at Taronga.

export const EVOLVE_CHAPTERS = [
  {
    id: 'lion',
    order: 1,
    chapter: 'Where I come from',
    animalName: 'African Lion',
    scientificName: 'Panthera leo',
    image: '/images/lion.jpg',
    accent: '#D4A574',
    latitude: -33.8427, longitude: 151.2393, radius: 30,
    mapPos: { x: 94.2, y: 71.3 },
    insight:
      'A lion cub is raised by the whole pride, not just its mother. It learns to hunt by watching, ' +
      'failing, and being covered for by adults who have already made those mistakes. No lion teaches ' +
      'itself.',
    observePrompt:
      'Watch the pride for a few minutes. Who is watching whom? Who is at the centre, and who is on the edge?',
    reflectionPrompt:
      'School has been your pride. Who taught you something you still carry — a teacher, a friend, a family ' +
      'member, someone who covered for you while you were learning? Write about them, and about what they gave you.',
    filmPrompt:
      'To camera: name one person from your schooling you want to thank, and say what they did.',
    placeholder: 'The person who shaped my schooling was…',
  },
  {
    id: 'kangaroo',
    order: 2,
    chapter: 'Forward only',
    animalName: 'Kangaroo',
    scientificName: 'Macropus rufus',
    image: '/images/kangaroo.jpg',
    accent: '#C1783C',
    // TODO: capture on site at Taronga (Australian Walkabout). Null coords make this chapter
    // unlock without a proximity check rather than becoming permanently unreachable.
    latitude: null, longitude: null, radius: 30,
    mapPos: { x: 40.0, y: 55.0 },
    insight:
      'A kangaroo cannot hop backwards. Its tail and the shape of its legs make the movement physically ' +
      'impossible. It is the reason usually given for putting one on the coat of arms — a country that ' +
      'only moves forward.',
    observePrompt:
      'Watch how they move. Notice that every correction, every change of direction, still happens going forward.',
    reflectionPrompt:
      'You are standing at the point where school stops. Write honestly about where you are right now — what ' +
      'you are ready to leave behind, and what you are afraid of losing.',
    filmPrompt:
      'To camera: finish this sentence — "The thing I am leaving behind is…"',
    placeholder: 'Right now I am…',
  },
  {
    id: 'tiger',
    order: 3,
    chapter: 'The territory ahead',
    animalName: 'Sumatran Tiger',
    scientificName: 'Panthera tigris sumatrae',
    image: '/images/tiger.jpg',
    accent: '#E86A33',
    latitude: -33.8433, longitude: 151.2394, radius: 35,
    mapPos: { x: 91.3, y: 57.8 },
    insight:
      'At around two years old a young tiger leaves its mother and walks out to find ground of its own. ' +
      'It has never held territory before. It goes anyway.',
    observePrompt:
      'Watch how the tiger uses its space — the paths it repeats, the edges it checks. This is what holding ' +
      'territory looks like.',
    reflectionPrompt:
      'Next year is your territory and you have never held it before. Write about what you want it to look ' +
      'like — not the job title, but the kind of life and the kind of person.',
    filmPrompt:
      'To camera: say what you want to be true about your life in five years.',
    placeholder: 'The ground I want to claim is…',
  },
  {
    id: 'giraffe',
    order: 4,
    chapter: 'The long view',
    animalName: 'Giraffe',
    scientificName: 'Giraffa camelopardalis',
    image: '/images/giraffe.jpg',
    accent: '#E8B33C',
    latitude: -33.8431, longitude: 151.2404, radius: 30,
    mapPos: { x: 75.5, y: 63.4 },
    insight:
      'A giraffe sees danger long before anything else on the savannah does. Zebra, wildebeest and antelope ' +
      'all watch the giraffes and move when they move. Height is not the point — being looked to is.',
    observePrompt:
      'Watch where the giraffes are looking. They are almost always watching something further away than you can see.',
    // This is the chapter that outlives the excursion: approved responses go to the Advice Wall.
    reflectionPrompt:
      'You can see further down this road than a Year 7 can. Write advice for a student just starting high ' +
      'school — something true, that you actually wish someone had told you.',
    filmPrompt:
      'To camera: give one piece of advice to a student starting Year 7.',
    placeholder: 'What I wish someone had told me is…',
    isAdvice: true,
  },
  {
    id: 'koala',
    order: 5,
    chapter: 'What I owe',
    animalName: 'Koala',
    scientificName: 'Phascolarctos cinereus',
    image: '/images/koala.jpg',
    accent: '#7A8B6F',
    latitude: -33.842639, longitude: 151.241361, radius: 30,
    mapPos: { x: 60.2, y: 72.1 },
    insight:
      'Whether koalas are still here in fifty years is not up to koalas. It depends almost entirely on ' +
      'choices made by people who will be adults by then. That is you, from about next year.',
    observePrompt:
      'Look at how narrow this animal\'s requirements are — particular trees, particular leaves, particular country.',
    reflectionPrompt:
      'You are about to become one of the adults whose choices decide this. Write a pledge: one thing you ' +
      'commit to doing for the world around you once you leave school.',
    filmPrompt:
      'To camera: say your pledge out loud, starting with "I will…"',
    placeholder: 'I will…',
    isPledge: true,
  },
];

// Ordered as the story is told, regardless of the order chapters were actually filmed in.
export const EVOLVE_STORY_ORDER = [...EVOLVE_CHAPTERS].sort((a, b) => a.order - b.order);

export const EVOLVE_THEME = {
  // Real twilight is a COOL sky over a WARM horizon — the blue hour and the golden hour in
  // one frame. An all-orange field reads as sepia, not dusk, and leaves the gold accent with
  // nothing to sit against. So the sky runs indigo to violet, and the warmth is held back for
  // the horizon glow at the very bottom, where the film's destination sits.
  bgGradient: 'linear-gradient(180deg, #070B18 0%, #121A33 34%, #23203F 62%, #3E2E3C 84%, #5A3A31 100%)',
  deep: '#070B18',
  panel: 'rgba(255,255,255,0.06)',
  border: 'rgba(232,179,60,0.28)',
  accent: '#E8B33C',
  accentSoft: 'rgba(232,179,60,0.14)',
  text: '#F3EDE2',
  textDim: 'rgba(243,237,226,0.62)',
};

export const EVOLVE_MIN_WORDS = 40;
