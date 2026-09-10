// content.js — everything Wildest Dreams says, shows and offers, in one place.
//
// Wildest Dreams is a video-first mode for diverse learners, particularly school support units.
// There is no quiz, no score and no writing. The student watches an animal, picks what they want
// to talk about, films a short clip, and the clips become a documentary they keep.
//
// Design rules that this file exists to protect:
//   • Every label is short and plain. If a sentence needs a comma, it is probably too long.
//   • Every choice has an icon, so the words are support rather than the only route in.
//   • Nothing here describes a student's ability. Stops and prompts are the same for everyone.
//   • Adding a stop, a prompt or a soundboard button should mean editing THIS FILE ONLY.

// ── Theme ──────────────────────────────────────────────────────────────────────
// Light ground with very dark text, rather than the dark palettes used elsewhere in Tracka.
// High luminance contrast is easier for low vision, and a bright screen is easier to see
// outdoors at the zoo. Colours below are all >= 4.5:1 against the canvas.
export const WD_THEME = {
  canvas:    '#FFFDF8',
  card:      '#FFFFFF',
  ink:       '#141712',
  inkSoft:   '#4A4F45',
  line:      '#D9D5C9',
  accent:    '#1A5238',   // Taronga mid green
  accentInk: '#FFFFFF',
  focus:     '#0B57D0',   // focus ring, deliberately not green so it reads as "system"
};

// ── The stops ──────────────────────────────────────────────────────────────────
// No GPS and no proximity check: a support unit moves as a group, at its own pace, and a
// student should never be blocked from filming because a signal put them 30 m away. Animals can
// be filmed in any order and any of them skipped.
//
// `sound` is a real recording of the animal, played from the Watch screen. It is `null` where no
// file exists yet — the button is then hidden rather than shown doing nothing. Dropping
// `public/images/sound-{id}.mp3` in and setting the path here is all that is needed to enable it.
export const WD_STOPS = [
  { id: 'koala',      name: 'Koala',      image: '/images/koala.jpg',      colour: '#7A8B6F', sound: '/images/sound-koala.mp3' , voice: 'animal-koala'},
  { id: 'kangaroo',   name: 'Kangaroo',   image: '/images/kangaroo.jpg',   colour: '#A9713B', sound: null , voice: 'animal-kangaroo'},
  { id: 'giraffe',    name: 'Giraffe',    image: '/images/giraffe.jpg',    colour: '#D97706', sound: '/images/sound-giraffe.mp3' , voice: 'animal-giraffe'},
  { id: 'chimpanzee', name: 'Chimpanzee', image: '/images/chimpanzee.jpg', colour: '#8B5A3C', sound: '/images/sound-chimpanzee.mp3' , voice: 'animal-chimpanzee'},
  { id: 'lion',       name: 'Lion',       image: '/images/lion.jpg',       colour: '#B8862B', sound: '/images/sound-lion.mp3' , voice: 'animal-lion'},
  { id: 'gorilla',    name: 'Gorilla',    image: '/images/gorilla.jpg',    colour: '#5C5750', sound: '/images/sound-gorilla.mp3' , voice: 'animal-gorilla'},
  { id: 'rhino',      name: 'Rhino',      image: '/images/rhino.jpg',      colour: '#6B7280', sound: null , voice: 'animal-rhino'},
  { id: 'tiger',      name: 'Tiger',      image: '/images/tiger.jpg',      colour: '#E86A33', sound: '/images/sound-tiger.mp3' , voice: 'animal-tiger'},
];

// ── What the student chooses to talk about ─────────────────────────────────────
// `caption` is what appears on the finished film. It is written in the student's voice, first
// person, because the film is theirs — not a label describing what they did.
export const WD_FOCUS = [
  { id: 'like',   icon: '💚', label: 'What I like',    caption: 'What I like', voice: 'focus-like' },
  { id: 'see',    icon: '👀', label: 'What I see',     caption: 'What I see', voice: 'focus-see' },
  { id: 'hear',   icon: '👂', label: 'What I hear',    caption: 'What I hear', voice: 'focus-hear' },
  { id: 'notice', icon: '🔎', label: 'What I notice',  caption: 'What I notice', voice: 'focus-notice' },
  { id: 'feel',   icon: '🙂', label: 'How I feel',     caption: 'How I feel', voice: 'focus-feel' },
  { id: 'other',  icon: '✨', label: 'Something else', caption: 'My film', voice: 'focus-other' },
];

// ── Soundboard ─────────────────────────────────────────────────────────────────
// OPTIONAL, never a required step. A student who cannot or does not want to speak can still
// put something of their own on the film.
//
// `say` is spoken aloud via speech synthesis when tapped, so a student using the board hears it
// too. `caption` is what lands on the film. Add entries here and they appear automatically.
//
// ⚠️ There used to be an "Animal sound" button here that spoke the sentence "Listen to the
// animal". A student taps a speaker icon expecting a lion and gets a synthesised voice reading a
// sentence, so it was a broken promise and got tapped-then-abandoned. Real animal audio now lives
// on the Watch screen, where you are actually looking at the animal — see `sound` on WD_STOPS.
export const WD_SOUNDBOARD = [
  { id: 'happy',    icon: '😊', label: 'Happy',        say: 'Happy',          caption: 'Happy', voice: 'word-happy' },
  { id: 'excited',  icon: '🤩', label: 'Excited',      say: 'Excited',        caption: 'Excited!', voice: 'word-excited' },
  { id: 'wow',      icon: '😮', label: 'Wow!',         say: 'Wow',            caption: 'Wow!', voice: 'word-wow' },
  { id: 'look',     icon: '👉', label: 'Look at that', say: 'Look at that',   caption: 'Look at that!', voice: 'word-look' },
  { id: 'fav',      icon: '⭐', label: 'My favourite', say: 'My favourite',   caption: 'My favourite', voice: 'word-fav' },
  { id: 'amazing',  icon: '🌟', label: 'Amazing',      say: 'Amazing',        caption: 'Amazing!', voice: 'word-amazing' },
  { id: 'calm',     icon: '🌿', label: 'Calm',         say: 'Calm',           caption: 'Calm', voice: 'word-calm' },
  { id: 'funny',    icon: '😄', label: 'Funny',        say: 'Funny',          caption: 'Funny!', voice: 'word-funny' },
];

// How many soundboard words can ride on one clip. More than one, because "Look at that" AND "My
// favourite" is a normal thing to want to say and the board used to allow only one. Capped so the
// caption stays readable on the film.
export const WD_MAX_SOUNDS = 3;

// ── Copy ───────────────────────────────────────────────────────────────────────
// One idea per screen. Short enough to be read aloud by a support person in one breath.
export const WD_COPY = {
  welcomeTitle: 'Wildest Dreams',
  welcomeLead:  'Make your own animal film.',
  welcomeSteps: [
    { icon: '👀', text: 'Watch the animal' },
    { icon: '👆', text: 'Pick what to talk about' },
    { icon: '🎥', text: 'Film it' },
  ],
  start:        'Start',
  pickStop:     'Pick an animal',
  watchTitle:   'Watch the',
  watchLead:    'Take your time.',
  watchDone:    "I'm ready",
  chooseTitle:  'What do you want to show?',
  filmTitle:    'Your turn',
  soundboard:   'Sounds & words',
  keep:         'Keep it',
  again:        'Record again',
  watchBack:    'Watch it',
  skip:         'Skip this one',
  finalTitle:   'My Wildest Dreams',
  makeFilm:     'Make my film',
};

export const WD_FILM_TITLE = 'My Wildest Dreams';

// ── Outcomes ───────────────────────────────────────────────────────────────────
// Wildest Dreams only. Nothing else in Tracka reads this, and this reads nothing from
// `NSW_OUTCOMES` in teacherInfoSheet.js, so the two cannot drift into each other.
//
// ⚠️ Two facts about NSW Science Life Skills that shape everything below. Both were checked
// against NESA rather than assumed, and both look like bugs if you do not know them:
//
//   1. Life Skills outcomes exist for Years 7-10 ONLY. NESA publishes none for K-6 — primary
//      students in support units work towards the ordinary Science and Technology K-6 outcomes
//      with adjustments. Stages 1-3 below therefore carry the K-6 outcomes, matching the codes
//      the rest of Tracka already shows, with `lifeSkills: false` so the panel can say so.
//      Do not "complete the set" by inventing ST*LS codes; they do not exist.
//   2. The Years 7-10 Life Skills outcomes are ONE set spanning Stage 4 and Stage 5, not two.
//      Stages 4 and 5 below are identical on purpose, and the panel states this.
//
// `evidence` is the part a teacher actually needs: what in Wildest Dreams shows the outcome.
// It is not a mark and must never become one. This mode has no scoring.
export const WD_OUTCOMES = {
  1: {
    lifeSkills: false,
    syllabus: 'Science and Technology K-6 (2017)',
    outcomes: [
      { code: 'ST1-1WS-S', desc: 'Observes, questions and collects data to communicate and compare ideas',
        evidence: 'Watches the animal, then chooses what to show and records it.' },
      { code: 'ST1-4LW-S', desc: 'Describes the behaviours and needs of living things and the features of their environment that help them survive',
        evidence: 'Talks about what the animal is doing and where it lives.' },
    ],
  },
  2: {
    lifeSkills: false,
    syllabus: 'Science and Technology K-6 (2017)',
    outcomes: [
      { code: 'ST2-1WS-S', desc: 'Conducts investigations by observing, questioning, planning, predicting, testing and communicating',
        evidence: 'Observes each animal and communicates the observation on camera.' },
      { code: 'ST2-4LW-S', desc: 'Compares features of living things and examines how environments affect living things',
        evidence: 'Films several animals across the route, comparing what each one does.' },
    ],
  },
  3: {
    lifeSkills: false,
    syllabus: 'Science and Technology K-6 (2017)',
    outcomes: [
      { code: 'ST3-1WS-S', desc: 'Plans and conducts scientific investigations to answer questions or solve problems',
        evidence: 'Chooses a focus before filming, then gathers the footage that answers it.' },
      { code: 'ST3-4LW-S', desc: 'Examines the role of living things in the environment and the effect of environmental change',
        evidence: 'Records what the animal does and why its habitat matters.' },
    ],
  },
  4: {
    lifeSkills: true,
    syllabus: 'Science 7-10 (2023) Life Skills',
    outcomes: [
      { code: 'SCLS-WS-01', desc: 'uses senses and scientific tools to make observations',
        evidence: 'Watches the animal with no timer, then uses the camera as the recording tool.' },
      { code: 'SCLS-WS-02', desc: 'asks questions or makes predictions using observations',
        evidence: 'Picks a focus — What I see, What I hear, What I notice — before filming.' },
      { code: 'SCLS-WS-05', desc: 'records data and information',
        evidence: 'The clip is the record. No writing is required for it to count.' },
      { code: 'SCLS-WS-08', desc: 'communicates scientific information',
        evidence: 'Speech, signing, the soundboard or filming the animal itself all count.' },
      { code: 'SCLS-FNS-01', desc: 'identifies features of living and non-living things',
        evidence: 'Names or points to what the animal has and does at each stop.' },
      { code: 'SCLS-FNS-02', desc: 'describes ways to sustain a variety of living things',
        evidence: 'Talks about what the animal needs, prompted by the zoo setting.' },
    ],
  },
};

// Stage 5 shares Stage 4's list because NESA publishes one Years 7-10 Life Skills set.
// Aliased rather than copied so the two can never fall out of step.
WD_OUTCOMES[5] = { ...WD_OUTCOMES[4] };

export const WD_OUTCOMES_NOTE = {
  primary: 'NESA publishes no Science Life Skills outcomes for K-6. Primary students in support units work towards these Science and Technology K-6 outcomes with adjustments, which is what Wildest Dreams is designed to allow.',
  secondary: 'The Years 7-10 Life Skills outcomes are one set across Stage 4 and Stage 5, so this list is the same for both.',
};
