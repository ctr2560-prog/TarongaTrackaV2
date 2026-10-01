// zooyardAnimals.js — ZooYard (self-attest, no-GPS school program) content, Science v1
// Reuses the same animal ids as src/data/animals.js on purpose: same photos (/images/{id}.jpg),
// same badge art (/images/badge-{id}.png), and koala/giraffe already have hand-tuned keyword
// scoring branches in scoring.js's scoreObservation(). Safe because ZooYard classes are entirely
// separate class documents from any daytime class.
//
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// THE SHAPE OF A HABITAT (settled 2026-10-01). Five beats, each doing one job:
//
//   photo unlock → video → quiz → two-minute watch → build it → write it up
//
// ⚠️ There is NO measurement step, and `fieldStudy` no longer exists. One was added on
// 2026-09-26 (pace out the canopy gap, run a concealment test, count sightline blockers) and
// removed on 2026-10-01 as one step too many. It was the most fragile part of the mode: the
// tiger method needed a partner, "blockers" needed interpreting, and it sat exactly between the
// watching and the building, which is where a speed bump hurts most. **Do not reinstate a
// counting activity.** If quantitative data is ever wanted again, harvest it from the watch
// itself ("how many birds landed?") rather than as a step of its own.
//
// ⚠️ THE ORGANISING RULE, and the thing to protect when editing content: each habitat names ONE
// environmental quality the animal depends on. The student spends two minutes noticing where
// that quality exists in their schoolyard and where it does not, and then builds something that
// provides it. `observation.focus` names the quality; `citizenScience` must answer that same
// quality and nothing else. Watching and building have to be about the same thing or the habitat
// falls apart into two unrelated tasks.
//
//   koala        connected trees      tiger      cover to hide in
//   giraffe      long views, water    bushwalk   a living ground layer
//   sea-lion     where water goes     chimpanzee layers at different heights
//   gorilla      variety of plants    rhino      shade and cooling
//
// ⚠️ Every action is deliberately DIFFERENT. Eight schoolyards of identical bird baths would be
// a worksheet. Check the list above before adding a ninth.
// ═══════════════════════════════════════════════════════════════════════════════════════════════

// ⚠️ KEEP THE CORRECT ANSWERS SCATTERED. All eight sat at `correct: 0` until 2026-10-01, which
// is the same fault that was found and fixed on giraffe, buffalo and tiger in the daytime
// content: a class works out "always the first one" by the second habitat and stops reading the
// options. They are now spread two per position (0,1,2,3) with no two consecutive habitats
// sharing an index. When adding or rewording an MCQ, check the spread again rather than
// appending the right answer wherever it is convenient.
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
      options: ['Too much rain', 'Other koalas', 'Habitat loss from land clearing', 'Being too friendly'],
      correct: 2,
      fact: 'Land clearing for housing, farming and roads is the single biggest driver of koala decline. Without enough trees, koalas lose their food, shelter and safe pathways between habitats.',
    },
    observation: {
      seconds: 120,
      focus: 'Connected trees',
      title: 'Two minutes under the tree',
      instruction: 'Stand still and look. Put the screen down. There is nothing to write yet.',
      lookFor: [
        'Where is the next tree, and what would an animal have to cross to reach it?',
        'Could something travel from this tree to that one without touching the ground?',
        'What lives up there? Look for movement, not just animals.',
      ],
    },
    citizenScience: {
      id: 'koala-close-the-gap',
      title: 'Close the Gap',
      icon: '🌱',
      brief: 'You just looked at what separates one tree from the next. Make that gap smaller.',
      primary: 'Plant a native tree or shrub in the gap between your two trees.',
      fallback: 'If your school cannot plant into the ground, use a large pot and place it in the gap.',
      steps: [
        'Ask your teacher where you are allowed to plant.',
        'Pick a spot roughly halfway between the two trees.',
        'Dig a hole twice as wide as the pot, and just as deep.',
        'Tip the plant out, sit it in, and firm the soil around it.',
        'Water it well, then tell your teacher who waters it next.',
      ],
      photoPrompt: 'Photograph what you planted, with the gap behind it.',
    },
    writingPromptByStage: {
      1: 'You looked at the space between the trees, and then you planted something in it. How does your plant help a koala?',
      2: 'You looked at what a koala would have to cross to reach the next tree, then planted into that gap. Koalas are not safe on the ground. How will your plant help?',
      3: 'You looked at the gap between the trees, then added a new plant to it. Explain how your plant makes that crossing safer for a koala.',
      4: 'You looked at what separates the trees in your schoolyard, then planted into the gap. Explain what gaps like that mean for a koala moving through, and how much difference one plant really makes.',
      5: 'You looked at what separates the trees in your schoolyard, then planted into the gap. Explain how fragmented canopy affects a koala population over time, not just one animal, and what it would take to reconnect it properly.',
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
      options: ['Rainforest cleared for palm oil and paper plantations', 'Rising sea levels', 'Tigers moving to cities', 'Too many tigers competing for space'],
      correct: 0,
      fact: 'Sumatra\'s rainforest is being cleared at a rapid rate for palm oil and paper plantations, fragmenting the last wild spaces tigers need to hunt and roam.',
    },
    observation: {
      seconds: 120,
      focus: 'Cover to hide in',
      title: 'Two minutes in the cover',
      instruction: 'Crouch down and stay still. Put the screen down. There is nothing to write yet.',
      lookFor: [
        'Where could something the size of your hand hide, right now?',
        'How much of the ground here has nowhere to hide at all?',
        'What is living down at this level, under the leaves?',
      ],
    },
    citizenScience: {
      id: 'tiger-build-cover',
      title: 'Build the Cover',
      icon: '🪵',
      brief: 'You just looked for the places something could hide. Make another one.',
      primary: 'Build a cover pile in a quiet corner: logs, sticks, bark and rocks, loosely stacked so there are gaps to get into.',
      fallback: 'If you cannot find logs or rocks, a deep pile of leaf litter raked into a corner does the same job.',
      steps: [
        'Find a quiet corner nobody walks through.',
        'Collect fallen logs, sticks, bark and a few rocks. Nothing still growing.',
        'Stack them loosely so there are gaps to crawl into.',
        'Build it up to about knee high if you have enough.',
        'Now leave it alone. Cover only works if nothing disturbs it.',
      ],
      photoPrompt: 'Photograph your pile, close enough to see the gaps in it.',
    },
    writingPromptByStage: {
      1: 'You looked for hiding places, and then you built one. What kind of animal might use it?',
      2: 'You looked for places something could hide, then built a pile of cover. Which small animals could use it, and what are they hiding from?',
      3: 'You looked at how much cover your spot had, then built your own. Explain why cover matters to a tiger, and to the animals that will use your pile.',
      4: 'You looked at how much cover your spot had, then built more. Explain why cover is a survival tool rather than decoration, and what your pile provides that the bare ground around it does not.',
      5: 'You looked at how much cover your spot had, then built more. Explain what happens to an ambush predator as plantations thin out cover, and what your pile demonstrates at a schoolyard scale.',
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
      options: ['They\'ve doubled', 'They\'ve stayed exactly the same', 'They\'ve moved entirely into forests', 'They\'ve declined sharply as savannah is fragmented by farms and fences'],
      correct: 3,
      fact: 'Giraffe numbers have dropped sharply in recent decades as open savannah is fragmented by farms, fences and settlements, cutting off the long routes giraffes travel to find food and water.',
    },
    observation: {
      seconds: 120,
      focus: 'Long views and water',
      title: 'Two minutes in the open',
      instruction: 'Stand still and look out, not down. Put the screen down. There is nothing to write yet.',
      lookFor: [
        'What is the furthest thing you can clearly see from here?',
        'What cuts your view short: fences, buildings, hedges?',
        'If you were an animal out here, where would you go for a drink?',
      ],
    },
    citizenScience: {
      id: 'giraffe-open-water',
      title: 'Water in the Open',
      icon: '💧',
      brief: 'Animals in open country trade cover for the ability to see danger coming, and they travel a long way to drink. Give them both.',
      primary: 'Set out a shallow dish of water where a drinking bird has a clear view all around it, off the ground and away from anywhere a cat could hide.',
      fallback: 'If water is not allowed at your school, leave a no-mow patch instead and mark its edges so nobody cuts it.',
      steps: [
        'Choose an open spot with a clear view all the way around.',
        'Keep it away from bushes or fences a cat could hide behind.',
        'Raise it off the ground if you can: a stump, a brick, a table.',
        'Fill it shallow, no deeper than your finger.',
        'Agree with your class who refills it each week.',
      ],
      photoPrompt: 'Photograph your dish and the open view around it.',
    },
    writingPromptByStage: {
      1: 'You looked at how far you could see, and then you put out water. Why did you choose that spot for it?',
      2: 'You looked at what blocked your view, then set out water in the open. Why does a bird need to see all around it while it drinks?',
      3: 'You looked at what blocked your view, then chose a spot for water with a clear line of sight. Explain why seeing danger early matters to an animal in open country.',
      4: 'You looked at what cuts the views short in your schoolyard, then sited water where the view is clear. Explain what long sightlines mean to an animal like a giraffe, and how fences change open country.',
      5: 'You looked at what cuts the views short in your schoolyard, then sited water for a clear line of sight. Explain how fragmentation of open savannah affects both a giraffe\'s safety and its ability to reach water, and what your choice of spot shows about that trade-off.',
    },
  },
  {
    id: 'blue-mountains-bushwalk',
    name: 'Blue Mountains Bushwalk',
    scientificName: 'Blue Mountains National Park',
    image: '/images/blue-mountains-bushwalk.jpg',
    habitatArea: 'bushland',
    habitatLabel: 'Australian Bushland',
    habitatColor: '#7A8B6F',
    selfAttestWhere: 'Go and find some messy ground.',
    selfAttestPrompt: 'Leaf litter, a garden bed, a scruffy edge. Anywhere nobody has tidied.',
    selfAttestQuestion: 'Are you standing on ground that is not mown grass or concrete?',
    videoUrl: null,
    activity: {
      question: 'Most of the small animals in Australian bushland live in one place. Where?',
      options: ['In the tops of the tallest trees', 'In the leaf litter and fallen wood on the ground', 'In the open on bare soil', 'In the sky'],
      correct: 1,
      fact: 'The ground layer does most of the work. Fallen leaves, bark and dead wood shelter the insects, spiders, skinks and fungi that everything larger feeds on. A tidy schoolyard has trees but almost no ground layer, so the food chain starts with a gap in it.',
    },
    observation: {
      seconds: 120,
      focus: 'A living ground layer',
      title: 'Two minutes on the ground',
      instruction: 'Crouch down and look at the ground, not the view. Put the screen down.',
      lookFor: [
        'Is anything moving down there? Wait. It takes a while.',
        'How much of the ground around you is bare, mown or paved?',
        'Where would something the size of your thumb be able to shelter?',
      ],
    },
    citizenScience: {
      id: 'bushwalk-ground-layer',
      title: 'Put the Ground Layer Back',
      icon: '🍂',
      brief: 'You just looked at how much of your schoolyard has no ground layer at all. Build some back.',
      primary: 'Rake fallen leaves, bark and small sticks into a deep patch in a corner nobody walks through, and leave it there.',
      fallback: 'If there are no leaves to gather, lay a few pieces of untreated wood or bark on the soil instead and leave a gap underneath.',
      steps: [
        'Find a corner out of the way of feet and mowers.',
        'Rake up fallen leaves, bark and small sticks from nearby.',
        'Pile them at least as deep as your hand is wide.',
        'Lay a few sticks on top so the wind cannot take it.',
        'Mark the edge so nobody tidies it away.',
      ],
      photoPrompt: 'Photograph your patch, close enough to see how deep it is.',
    },
    writingPromptByStage: {
      1: 'You looked at the ground, and then you made a leaf patch. What might come and live in it?',
      2: 'You looked at how bare the ground was, then built a patch of leaf litter. What kinds of animals need it, and why?',
      3: 'You looked at how much bare ground there was, then put some ground layer back. Explain why leaf litter matters to the small animals that live in it.',
      4: 'You looked at how much of your schoolyard is bare or mown, then rebuilt a patch of ground layer. Explain what a place loses when its ground layer is cleared away, and what your patch gives back.',
      5: 'You looked at how much of your schoolyard is bare or mown, then rebuilt a patch of ground layer. Explain how removing the ground layer affects a food web from the decomposers upward, and why one patch is both worth doing and not enough.',
    },
  },
  {
    id: 'sea-lion',
    name: 'Australian Sea Lion',
    scientificName: 'Neophoca cinerea',
    image: '/images/sea-lion.jpg',
    habitatArea: 'coast',
    habitatLabel: 'Australian Coast',
    habitatColor: '#2A7C9B',
    selfAttestWhere: 'Go and stand next to a drain.',
    selfAttestPrompt: 'A stormwater grate, a gutter, a downpipe. Anywhere water leaves your school.',
    selfAttestQuestion: 'Are you standing next to somewhere water runs away?',
    videoUrl: null,
    activity: {
      question: 'How does rubbish dropped in a schoolyard kilometres from the sea end up in the ocean?',
      options: ['It is carried there by birds', 'It does not, rubbish stays where it falls', 'It evaporates and falls as rain at sea', 'Rain washes it into drains, and drains run to creeks and then the sea'],
      correct: 3,
      fact: 'Stormwater is not treated. Anything on hard ground when it rains goes down a grate and comes out in a creek, a river and then the sea, usually within a day. Australian sea lions are one of the rarest sea lions in the world and entanglement in marine debris is a documented cause of death, particularly for pups.',
    },
    observation: {
      seconds: 120,
      focus: 'Where the water goes',
      title: 'Two minutes at the drain',
      instruction: 'Stand still and look at the ground around you. Put the screen down, and do not pick anything up yet.',
      lookFor: [
        'Which way does the ground slope? Where would water run?',
        'What is lying around that would travel with it?',
        'What is the smallest piece of rubbish you can find?',
      ],
    },
    citizenScience: {
      id: 'sea-lion-clear-the-line',
      title: 'Clear the Line',
      icon: '🧤',
      brief: 'Everything you just looked at is one rainfall away from a creek. Take it out of the system.',
      primary: 'With gloves or a pickup tool, collect the rubbish between you and that drain and put it in a bin.',
      fallback: 'If you cannot safely pick it up, photograph the worst spot and report it to your teacher or the office so it can be cleared properly.',
      steps: [
        'Put gloves on, or use a pickup tool. Never bare hands.',
        'Start at the drain and work back along your line.',
        'Leave anything sharp or broken. Tell a teacher instead.',
        'Check under edges and in corners, where wind collects it.',
        'Bin it, then wash your hands.',
      ],
      photoPrompt: 'Photograph what you collected before it goes in the bin.',
    },
    writingPromptByStage: {
      1: 'You looked at the rubbish near the drain, and then you picked it up. Where would it have gone if you had left it?',
      2: 'You looked at what was lying near a drain and cleared it. Explain how rubbish gets from your school all the way to the sea.',
      3: 'You looked at what would wash into the drain, then removed it. Explain the path that rubbish would have taken, and why it is dangerous to a sea lion.',
      4: 'You looked at what was sitting in the stormwater path, then removed it. Explain how schoolyard litter becomes marine debris, and why small pieces are more dangerous than large ones.',
      5: 'You looked at what was sitting upstream of a drain, then removed it. Explain why cleaning up is a treatment rather than a fix, and what would actually stop it arriving there.',
    },
  },
  {
    id: 'chimpanzee',
    name: 'Chimpanzee',
    scientificName: 'Pan troglodytes',
    image: '/images/chimpanzee.jpg',
    habitatArea: 'forest',
    habitatLabel: 'African Forest',
    habitatColor: '#8C5A2B',
    selfAttestWhere: 'Go and stand under a big tree.',
    selfAttestPrompt: 'The biggest one you can get to, with branches above your head.',
    selfAttestQuestion: 'Are you standing under branches?',
    videoUrl: null,
    activity: {
      question: 'Chimpanzees spend their day moving between different heights of the forest. Why does that matter?',
      options: ['Food, sleep and safety are found at different heights, so they need all the layers', 'They can only climb in one direction', 'Only young chimpanzees climb', 'They are trying to stay cool'],
      correct: 0,
      fact: 'A chimpanzee feeds on the ground and in the canopy, and builds a fresh nest in the middle branches almost every night. Selective logging can leave a forest that still looks green from above while the layer they sleep in has gone.',
    },
    observation: {
      seconds: 120,
      focus: 'Layers at different heights',
      title: 'Two minutes looking up',
      instruction: 'Stand under the branches and look from your feet all the way up. Put the screen down.',
      lookFor: [
        'How many different heights can you see something living at?',
        'Is anything growing between the grass and the branches, or is that space empty?',
        'Could something climb from the ground to the top without coming down?',
      ],
    },
    citizenScience: {
      id: 'chimp-missing-layer',
      title: 'Add the Missing Layer',
      icon: '🌿',
      brief: 'You just looked at which layers your schoolyard has. Add one it is missing.',
      primary: 'Plant a shrub, or a group of tall grasses, in the empty space between the ground and the branches.',
      fallback: 'If you cannot plant, build the missing layer another way: a stack of logs, a brush pile, or a climbing frame of sticks against a fence.',
      steps: [
        'Find the empty space between the grass and the branches.',
        'Choose a shrub or tall grass that will grow to about your height.',
        'Plant it somewhere it will still get some light.',
        'Cannot plant? Lean sticks against a fence to make a climbing frame.',
        'Water it in, and check how tall it is in a month.',
      ],
      photoPrompt: 'Photograph the new layer with the ground and the branches both in shot.',
    },
    writingPromptByStage: {
      1: 'You looked at the different heights things grow at, and then you added one. What might use the new layer?',
      2: 'You looked at which layers were there and which were missing, then added one. Why does an animal need more than one layer to live in?',
      3: 'You looked at the layers above you, then added one that was missing. Explain why a chimpanzee needs several layers of forest rather than just tall trees.',
      4: 'You looked at which layers your schoolyard has, then added a missing one. Explain what a forest loses when its middle layers are removed, even if the tall trees are left standing.',
      5: 'You looked at which layers your schoolyard has, then added a missing one. Explain why a forest can look intact from above while no longer supporting the species that depend on its structure.',
    },
  },
  {
    id: 'gorilla',
    name: 'Western Lowland Gorilla',
    scientificName: 'Gorilla gorilla gorilla',
    image: '/images/gorilla.jpg',
    habitatArea: 'forest',
    habitatLabel: 'African Forest',
    habitatColor: '#4B5F4A',
    selfAttestWhere: 'Go and stand in a garden bed.',
    selfAttestPrompt: 'Any planted area. The messier and more mixed up, the better.',
    selfAttestQuestion: 'Are you standing somewhere with plants growing in it?',
    videoUrl: null,
    activity: {
      question: 'A wild gorilla eats from over a hundred different plant species. What does that tell you about the forest it needs?',
      options: ['It has to be quiet', 'It only needs one kind of tree if there is enough of it', 'It has to be varied, not just large', 'It has to be near a city'],
      correct: 2,
      fact: 'Gorillas are bulk feeders on leaves, stems, pith and fruit, and what is available changes through the year. A plantation can be enormous and still starve them, because it is the same plant over and over. Variety is the habitat, not just area.',
    },
    observation: {
      seconds: 120,
      focus: 'Variety of plants',
      title: 'Two minutes in the bed',
      instruction: 'Stand still and look closely at the plants around you. Put the screen down.',
      lookFor: [
        'How many different leaf shapes can you find without moving your feet?',
        'Is it mostly the same plant repeated, or a real mixture?',
        'Is anything flowering, seeding or being eaten right now?',
      ],
    },
    citizenScience: {
      id: 'gorilla-add-variety',
      title: 'Add a Kind That Is Missing',
      icon: '🌼',
      brief: 'You just looked at how many kinds of plant your schoolyard offers. Add one it does not have.',
      primary: 'Plant something DIFFERENT from everything already growing there, ideally a local native that flowers.',
      fallback: 'If you cannot plant, sow seeds of a local native in a pot and put the pot in the bed, or leave a patch unmown so whatever is already in the soil can come up.',
      steps: [
        'Look at what is already growing. Name two of them.',
        'Choose something different: a different leaf, a different flower.',
        'Pick a local native if you can. Ask your teacher which.',
        'Plant it in a gap so it does not get crowded out.',
        'Water it in and label it with its name.',
      ],
      photoPrompt: 'Photograph what you added, next to what was already there.',
    },
    writingPromptByStage: {
      1: 'You looked at the plants around you, and then you added a new kind. Why is it good to have lots of different plants?',
      2: 'You looked at how many kinds of plant were there, then added another kind. Why does an animal need lots of different plants and not just lots of plants?',
      3: 'You looked at how mixed the planting was, then added a kind that was missing. Explain why variety matters more to a gorilla than the size of the forest.',
      4: 'You looked at how much variety the planting had, then added a new kind. Explain why a large area of a single plant species cannot support a gorilla, and what your addition changes.',
      5: 'You looked at how much variety the planting had, then added a new kind. Explain the difference between habitat area and habitat quality, and what that means for how conservation land is chosen.',
    },
  },
  {
    id: 'rhino',
    name: 'Greater One-Horned Rhino',
    scientificName: 'Rhinoceros unicornis',
    image: '/images/rhino.jpg',
    habitatArea: 'wetland',
    habitatLabel: 'Floodplain Grassland',
    habitatColor: '#5C7A8A',
    selfAttestWhere: 'Go and stand somewhere with no shade at all.',
    selfAttestPrompt: 'The middle of a playground, an open path, anywhere the sun hits hard.',
    selfAttestQuestion: 'Are you standing somewhere out in the open sun?',
    videoUrl: null,
    activity: {
      question: 'Greater one-horned rhinos spend hours a day in water and mud. What is that mostly for?',
      options: ['Hunting fish', 'Cooling down and getting rid of biting insects', 'Hiding from other rhinos', 'Drinking, and nothing else'],
      correct: 1,
      fact: 'They are strong swimmers and wallow for hours to regulate their temperature and shed parasites. An animal that cannot cool down cannot survive a hot day, no matter how much food is around it, and a surface with no shade is unusable for most of summer.',
    },
    observation: {
      seconds: 120,
      focus: 'Shade and cooling',
      title: 'Two minutes in the sun',
      instruction: 'Stand still out in the open and look around you. Put the screen down.',
      lookFor: [
        'Where is the shade in your schoolyard, and how far away is the nearest patch?',
        'How hot is the ground where you are standing compared with under a tree?',
        'If you had to get out of the sun for the whole lunch break, where would you go?',
      ],
    },
    citizenScience: {
      id: 'rhino-make-shade',
      title: 'Make Some Shade',
      icon: '⛱️',
      brief: 'You just looked at how little of your schoolyard is out of the sun. Make somewhere cooler.',
      primary: 'Create a shaded, cooler refuge: a board or tile raised on stones over bare soil, a shadecloth corner, or a pot plant placed to throw shade on hot ground.',
      fallback: 'If you cannot build anything, plant a tree or shrub where there is no shade now. It is shade for later rather than today, which is how most shade gets made.',
      steps: [
        'Stand where there is no shade at all. That is your spot.',
        'Raise a board, tile or piece of bark on stones over bare soil.',
        'Leave a gap underneath about as thick as your finger.',
        'Angle it so it blocks the afternoon sun.',
        'Look underneath in a week. Something will have moved in.',
      ],
      photoPrompt: 'Photograph your shade, with the sunny ground around it in shot.',
    },
    writingPromptByStage: {
      1: 'You stood in the sun and looked for shade, and then you made some. Who might use it on a hot day?',
      2: 'You looked at how much of your schoolyard has no shade, then made somewhere cooler. Why do animals need to get out of the sun?',
      3: 'You looked at where the shade was and was not, then made some. Explain why being able to cool down matters as much to an animal as food does.',
      4: 'You looked at how little shade your schoolyard has, then made somewhere cooler. Explain why a rhino wallows, and why a place with no shade is unusable to most animals in summer.',
      5: 'You looked at how little shade your schoolyard has, then made somewhere cooler. Explain how temperature limits which animals can live in a place, and why heat is a habitat problem as much as food or space is.',
    },
  },
];

export const ZOOYARD_HABITAT_META = {
  bushland:  { label: 'Australian Bushland', color: '#7A8B6F' },
  rainforest: { label: 'Sumatran Rainforest', color: '#E86A33' },
  savannah:  { label: 'African Savannah',    color: '#D97706' },
  coast:     { label: 'Australian Coast',    color: '#2A7C9B' },
  forest:    { label: 'African Forest',      color: '#6B7F5A' },
  wetland:   { label: 'Floodplain Grassland', color: '#5C7A8A' },
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

  // ⚠️ These three have `videoBg: null` — there is no ambient habitat video for coast, African
  // forest or floodplain yet. The write-up screen checks for it and falls back to the gradient,
  // so a null is safe; a path to a file that does not exist is NOT, it renders a broken <video>.
  // The three existing clips are also heavy (savannah 3.5MB, bushland 2.8MB) for a whole class
  // on a school network, so think before commissioning three more.
  coast: {
    icon: '🌊',
    videoBg: null,
    bgGradient: 'linear-gradient(160deg, #04161F 0%, #0B2F42 45%, #14566E 85%, #2A7C9B 100%)',
    cardGradient: 'linear-gradient(160deg, #DDE8ED, #FFFFFF)',
    accent: '#2A7C9B',
    accentSoft: '#DFEAF0',
    accentBorder: 'rgba(42,124,155,0.4)',
  },
  forest: {
    icon: '🌳',
    videoBg: null,
    bgGradient: 'linear-gradient(160deg, #101A0C 0%, #26361C 45%, #435A30 85%, #6B7F5A 100%)',
    cardGradient: 'linear-gradient(160deg, #E4E8DD, #FFFFFF)',
    accent: '#4F6B39',
    accentSoft: '#E7EBE0',
    accentBorder: 'rgba(79,107,57,0.4)',
  },
  wetland: {
    icon: '💧',
    videoBg: null,
    bgGradient: 'linear-gradient(160deg, #0D1A1F 0%, #1F3A44 45%, #3D6070 85%, #5C7A8A 100%)',
    cardGradient: 'linear-gradient(160deg, #E0E7EA, #FFFFFF)',
    accent: '#456A7C',
    accentSoft: '#E2EAEE',
    accentBorder: 'rgba(69,106,124,0.4)',
  },
};

// ⚠️ `ZOOYARD_CITIZEN_SCIENCE_TASK` (the standalone "Habitat Hero" task that used to unlock
// after all three habitats) was removed on 2026-09-28. It was absorbed: every animal now carries
// its own `citizenScience` block, run immediately after that habitat's measurement so the thing
// built is a response to the number just taken. Do not reintroduce a single end-of-session task
// alongside these — it would ask students to build a fourth thing for no measured reason.
