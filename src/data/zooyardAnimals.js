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
      id: 'koala-canopy',
      title: 'Canopy Connection',
      icon: '🌳',
      steps: [
        'Stand at your tree and look around for the nearest other tree.',
        'Walk straight to it, counting your normal steps as you go.',
        'Write down how many steps it took.',
      ],
      question: 'How many steps to the nearest other tree?',
      unit: 'steps',
      max: 200,
      benchmark: 'Koalas are built for climbing, not walking. On the ground they are exposed to dogs and cars, and it is where most koala deaths happen. A gap of more than about 20 steps is a crossing many koalas will not risk.',
    },
    observation: {
      seconds: 120,
      title: 'Two minutes under the tree',
      instruction: 'Stand still and just watch. Do not write anything yet.',
      lookFor: [
        'What lives in this tree? Look for movement, not just animals.',
        'Where does the shade fall, and what is growing in it?',
        'What would an animal up there have to cross to reach the next tree?',
      ],
    },
    citizenScience: {
      id: 'koala-close-the-gap',
      title: 'Close the Gap',
      icon: '🌱',
      brief: 'You just measured the gap a koala cannot safely cross. Now make it smaller.',
      primary: 'Plant a native tree or shrub in the gap between your two trees.',
      fallback: 'If your school cannot plant into the ground, use a large pot and place it in the gap.',
      photoPrompt: 'Photograph what you planted, with the gap behind it.',
    },
    writingPromptByStage: {
      1: 'You counted {n} steps to the next tree, and then you planted something in between. How does your plant help a koala?',
      2: 'You counted {n} steps to the next tree, and then you planted into that gap. Koalas are not safe on the ground. How will your plant help?',
      3: 'You counted {n} steps between trees, then added a new plant to that gap. Explain how your plant makes the crossing safer for a koala.',
      4: 'You measured a {n} step gap and planted into it. Explain what that gap means for a koala moving through your schoolyard, and how much difference one plant really makes.',
      5: 'You measured a {n} step gap and planted into it. Explain how gaps like this affect a koala population over time, not just one animal, and what it would take to reconnect them properly.',
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
      id: 'tiger-concealment',
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
    observation: {
      seconds: 120,
      title: 'Two minutes in the cover',
      instruction: 'Stay crouched and still. Do not write anything yet.',
      lookFor: [
        'How much of you can still be seen from where you are?',
        'What is living down here, at ground level?',
        'Where could something small hide if it had to, right now?',
      ],
    },
    citizenScience: {
      id: 'tiger-build-cover',
      title: 'Build the Cover',
      icon: '🪵',
      brief: 'You just measured how quickly cover hides something. Now build some.',
      primary: 'Build a cover pile in a quiet corner: logs, sticks, bark and rocks, loosely stacked so there are gaps to get into.',
      fallback: 'If you cannot find logs or rocks, a deep pile of leaf litter raked into a corner does the same job.',
      photoPrompt: 'Photograph your pile, close enough to see the gaps in it.',
    },
    writingPromptByStage: {
      1: 'You disappeared at {n} steps, and then you built a cover pile. What kind of animal might hide in it?',
      2: 'You disappeared at {n} steps, and then you built a pile of cover. Which small animals could hide in it, and what are they hiding from?',
      3: 'You disappeared at {n} steps, then built your own cover. A tiger needs to get within about 25 steps unseen. Explain why cover matters to both a tiger and the animals that will use your pile.',
      4: 'You disappeared at {n} steps, and a tiger needs to close to about 25 steps unseen. Explain what your result says about cover as a survival tool, and what your pile now provides that the ground around it does not.',
      5: 'You disappeared at {n} steps against a tiger\'s roughly 25 step requirement. Explain what happens to a tiger\'s hunting success as plantations thin out cover like this, and what your pile demonstrates at a schoolyard scale.',
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
      id: 'giraffe-sightline',
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
    observation: {
      seconds: 120,
      title: 'Two minutes in the open',
      instruction: 'Stand still and look out, not down. Do not write anything yet.',
      lookFor: [
        'How far away is the furthest thing you can clearly see?',
        'Where would an animal out here go for water?',
        'If something startled you, where is the nearest cover?',
      ],
    },
    citizenScience: {
      id: 'giraffe-open-water',
      title: 'Water in the Open',
      icon: '💧',
      brief: 'Animals in open country trade cover for the ability to see danger coming, and they travel a long way to drink. Give them both.',
      primary: 'Set out a shallow dish of water where a drinking bird has a clear view all around it, off the ground and away from anywhere a cat could hide.',
      fallback: 'If water is not allowed at your school, leave a no-mow patch instead and mark its edges so nobody cuts it.',
      photoPrompt: 'Photograph your dish and the open view around it.',
    },
    writingPromptByStage: {
      1: 'You counted {n} things blocking your view, and then you put out water. Why did you choose that spot for it?',
      2: 'You counted {n} things blocking your view, then set out water in the open. Why does a bird need to see all around it while it drinks?',
      3: 'You counted {n} things blocking your view, then chose a spot for water with a clear view. Explain why seeing danger early matters to an animal in open country.',
      4: 'You counted {n} blockers in your view and then sited water where the view is clear. Explain what long sightlines mean to an animal like a giraffe, and how fences change open country.',
      5: 'You counted {n} blockers in a single turn and then sited water for a clear line of sight. Explain how fragmentation of open savannah affects both a giraffe\'s safety and its ability to reach water, and what your choice of spot shows about that trade-off.',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // ⚠️ DRAFT CONTENT — added 2026-09-29, not yet reviewed by Cameron.
  // The five below follow the same measure → act → explain loop as koala/tiger/giraffe, and the
  // structure is final, but every MCQ, method, benchmark and prompt below is a first pass and is
  // expected to change. What is deliberate and should survive editing:
  //   · each field study tests the ONE thing that species actually depends on, needs no
  //     equipment, and takes about two minutes;
  //   · each `citizenScience` action is a direct response to the number just measured, and is
  //     DIFFERENT from every other habitat's action (five schoolyards full of identical bird
  //     baths would be a worksheet, not a project);
  //   · every prompt carries {n}, and stages 1–5 are all present.
  // Badge art and photos already existed for all five (`/images/{id}.jpg`,
  // `/images/badge-{id}.png`), which is why these ids were reused from `animals.js`.
  // ═══════════════════════════════════════════════════════════════════════════════════════════

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
      options: ['In the leaf litter and fallen wood on the ground', 'In the tops of the tallest trees', 'In the open on bare soil', 'In the sky'],
      correct: 0,
      fact: 'The ground layer does most of the work. Fallen leaves, bark and dead wood shelter the insects, spiders, skinks and fungi that everything larger feeds on. A tidy schoolyard has trees but almost no ground layer, so the food chain starts with a gap in it.',
    },
    fieldStudy: {
      id: 'bushwalk-ground-cover',
      title: 'The Ten Step Survey',
      icon: '🍂',
      steps: [
        'Pick a direction and take ten normal steps, looking down.',
        'After each step, check what is directly under your front foot.',
        'Count how many of the ten landed on bare dirt, concrete or mown grass.',
      ],
      question: 'How many of your ten steps landed on bare or mown ground?',
      unit: 'of 10 steps',
      max: 10,
      benchmark: 'In healthy bushland almost every step lands on litter, logs or low plants, so a score of 0 to 2 is what the bush does. Most schoolyards score 8 or more. That is not untidiness being removed, it is habitat being removed.',
    },
    observation: {
      seconds: 120,
      title: 'Two minutes on the ground',
      instruction: 'Crouch down and look at the ground, not the view. Do not write anything yet.',
      lookFor: [
        'Is anything moving down there? Wait. It takes a while.',
        'How deep is the leaf litter, if there is any?',
        'Where would something the size of your thumb hide?',
      ],
    },
    citizenScience: {
      id: 'bushwalk-ground-layer',
      title: 'Put the Ground Layer Back',
      icon: '🍂',
      brief: 'You just counted how much of your schoolyard has no ground layer at all. Build some back.',
      primary: 'Rake fallen leaves, bark and small sticks into a deep patch in a corner nobody walks through, and leave it there.',
      fallback: 'If there are no leaves to gather, lay a few pieces of untreated wood or bark on the soil instead and leave a gap underneath.',
      photoPrompt: 'Photograph your patch, close enough to see how deep it is.',
    },
    writingPromptByStage: {
      1: 'You counted {n} bare steps out of ten, and then you made a leaf patch. What might come and live in it?',
      2: 'You counted {n} bare steps out of ten, then built a patch of ground layer. What kinds of animals need leaf litter, and why?',
      3: 'You counted {n} bare steps out of ten, then put some ground layer back. Explain why the leaf litter matters to the small animals that live in it.',
      4: 'You counted {n} bare steps out of ten, then rebuilt a patch of ground layer. Explain what a schoolyard loses when the ground layer is cleared away, and what your patch gives back.',
      5: 'You counted {n} bare steps out of ten, then rebuilt a patch of ground layer. Explain how removing the ground layer affects a food web from the decomposers upward, and why one patch is both worth doing and not enough.',
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
      options: ['Rain washes it into drains, and drains run to creeks and then the sea', 'It is carried there by birds', 'It does not, rubbish stays where it falls', 'It evaporates and falls as rain at sea'],
      correct: 0,
      fact: 'Stormwater is not treated. Anything on hard ground when it rains goes down a grate and comes out in a creek, a river and then the sea, usually within a day. Australian sea lions are one of the rarest sea lions in the world and entanglement in marine debris is a documented cause of death, particularly for pups.',
    },
    fieldStudy: {
      id: 'sea-lion-debris',
      title: 'The Drain Line',
      icon: '🌊',
      steps: [
        'Stand at your drain and walk twenty steps in a straight line away from it.',
        'Look at the ground the whole way, including under things.',
        'Count every piece of rubbish you pass, however small.',
      ],
      question: 'How many pieces of rubbish did you count?',
      unit: 'pieces',
      max: 200,
      benchmark: 'Every piece you counted is upstream of that drain. It is not litter that will be picked up eventually: it is litter that is waiting for rain. The smallest pieces matter most, because the small ones are the ones that get swallowed.',
    },
    observation: {
      seconds: 120,
      title: 'Two minutes at the drain',
      instruction: 'Stand still and look at the ground around you. Do not pick anything up yet.',
      lookFor: [
        'What is the smallest piece of rubbish you can find?',
        'Which way does the ground slope? Where would water go?',
        'What blows around here, and what stays put?',
      ],
    },
    citizenScience: {
      id: 'sea-lion-clear-the-line',
      title: 'Clear the Line',
      icon: '🧤',
      brief: 'Everything you counted is one rainfall away from a creek. Take it out of the system.',
      primary: 'With gloves or a pickup tool, collect the rubbish you counted along your twenty steps and put it in a bin.',
      fallback: 'If you cannot safely pick it up, photograph the worst spot and report it to your teacher or the office so it can be cleared properly.',
      photoPrompt: 'Photograph what you collected before it goes in the bin.',
    },
    writingPromptByStage: {
      1: 'You found {n} pieces of rubbish and then you picked them up. Where would they have gone if you had left them?',
      2: 'You found {n} pieces of rubbish near a drain and cleared them. Explain how rubbish gets from your school to the sea.',
      3: 'You counted {n} pieces of rubbish along your line and removed them. Explain the path that rubbish would have taken, and why it is dangerous to a sea lion.',
      4: 'You counted {n} pieces of rubbish and removed them from the stormwater path. Explain how schoolyard litter becomes marine debris, and why small pieces are more dangerous than large ones.',
      5: 'You counted {n} pieces of rubbish upstream of a drain and removed them. Explain why cleaning up is a treatment rather than a fix, and what would actually reduce the number you counted.',
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
      options: ['Food, sleep and safety are found at different heights, so they need all the layers', 'They are trying to stay cool', 'They can only climb in one direction', 'Only young chimpanzees climb'],
      correct: 0,
      fact: 'A chimpanzee feeds on the ground and in the canopy, and builds a fresh nest in the middle branches almost every night. Selective logging can leave a forest that still looks green from above while the layer they sleep in has gone.',
    },
    fieldStudy: {
      id: 'chimp-layers',
      title: 'Counting the Layers',
      icon: '🌴',
      steps: [
        'Stand under your tree and look from your feet all the way up.',
        'Count the separate layers of living plant you can see: ground plants, low shrubs, middle branches, high canopy.',
        'Only count a layer if something is actually growing there.',
      ],
      question: 'How many layers of plant life can you count?',
      unit: 'layers',
      max: 6,
      benchmark: 'A tropical forest a chimpanzee can live in has four or more layers stacked on top of each other. Mown grass under a single tall tree is two, and a chimpanzee could not feed, travel or sleep in it. Most schoolyards score 2.',
    },
    observation: {
      seconds: 120,
      title: 'Two minutes looking up',
      instruction: 'Stand under the branches and look up. Do not write anything yet.',
      lookFor: [
        'How many different heights can you see something living at?',
        'Is there anything growing between the grass and the branches?',
        'Could something climb from the ground to the top without coming down?',
      ],
    },
    citizenScience: {
      id: 'chimp-missing-layer',
      title: 'Add the Missing Layer',
      icon: '🌿',
      brief: 'You just counted the layers in your schoolyard. Now add one that is not there.',
      primary: 'Plant a shrub, or a group of tall grasses, in the empty space between the ground and the branches.',
      fallback: 'If you cannot plant, build the missing layer another way: a stack of logs, a brush pile, or a climbing frame of sticks against a fence.',
      photoPrompt: 'Photograph the new layer with the ground and the branches both in shot.',
    },
    writingPromptByStage: {
      1: 'You counted {n} layers and then added one more. What might use the new layer?',
      2: 'You counted {n} layers of plants, then added another one. Why does an animal need more than one layer to live in?',
      3: 'You counted {n} layers, then added one that was missing. Explain why a chimpanzee needs several layers of forest rather than just tall trees.',
      4: 'You counted {n} layers and added a missing one. Explain what a forest loses when its middle layers are removed, even if the tall trees are left standing.',
      5: 'You counted {n} layers and added a missing one. Explain why a forest can look intact from above while no longer supporting the species that depend on its structure, and what your added layer demonstrates.',
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
      options: ['It has to be varied, not just large', 'It has to be quiet', 'It only needs one kind of tree if there is enough of it', 'It has to be near a city'],
      correct: 0,
      fact: 'Gorillas are bulk feeders on leaves, stems, pith and fruit, and what is available changes through the year. A plantation can be enormous and still starve them, because it is the same plant over and over. Variety is the habitat, not just area.',
    },
    fieldStudy: {
      id: 'gorilla-variety',
      title: 'The Arm\'s Reach Count',
      icon: '🌱',
      steps: [
        'Stand still in your garden bed and put both arms out.',
        'Look only at what you could touch without moving your feet.',
        'Count how many DIFFERENT kinds of plant you can see. Do not count the same kind twice.',
      ],
      question: 'How many different kinds of plant are within reach?',
      unit: 'kinds',
      max: 40,
      benchmark: 'A gorilla feeding patch in the wild would give you well over ten different plants within arm\'s reach, and the mix changes with the season. A bed of one hedge plant scores 1. It can be green, healthy and enormous and still feed almost nothing.',
    },
    observation: {
      seconds: 120,
      title: 'Two minutes in the bed',
      instruction: 'Stand still and look closely at the plants around you. Do not write anything yet.',
      lookFor: [
        'How many different leaf shapes can you find?',
        'Is anything flowering, seeding or fruiting right now?',
        'Is anything feeding on these plants while you watch?',
      ],
    },
    citizenScience: {
      id: 'gorilla-add-variety',
      title: 'Add a Kind That Is Missing',
      icon: '🌼',
      brief: 'You just counted how few kinds of plant your schoolyard offers. Add one it does not have.',
      primary: 'Plant something DIFFERENT from everything already growing there, ideally a local native that flowers.',
      fallback: 'If you cannot plant, sow seeds of a local native in a pot and put the pot in the bed, or leave a patch unmown so whatever is already in the soil can come up.',
      photoPrompt: 'Photograph what you added, next to what was already there.',
    },
    writingPromptByStage: {
      1: 'You found {n} kinds of plant and then added a new one. Why is it good to have lots of different plants?',
      2: 'You counted {n} kinds of plant within reach, then added another kind. Why does an animal need lots of different plants and not just lots of plants?',
      3: 'You counted {n} kinds of plant, then added one that was missing. Explain why variety matters more to a gorilla than the size of the forest.',
      4: 'You counted {n} kinds of plant within arm\'s reach and added a new one. Explain why a large area of a single plant species cannot support a gorilla, and what your addition changes.',
      5: 'You counted {n} kinds of plant within arm\'s reach and added a new one. Explain the difference between habitat area and habitat quality, using your count as evidence, and what that means for how conservation land is chosen.',
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
    selfAttestWhere: 'Go and stand somewhere damp or shaded.',
    selfAttestPrompt: 'Under a tap, beside a downpipe, in deep shade. Anywhere that stays cooler.',
    selfAttestQuestion: 'Are you standing somewhere damp or shaded?',
    videoUrl: null,
    activity: {
      question: 'Greater one-horned rhinos spend hours a day in water. What is that mostly for?',
      options: ['Cooling down and getting rid of biting insects', 'Hunting fish', 'Hiding from other rhinos', 'Drinking, and nothing else'],
      correct: 0,
      fact: 'They are strong swimmers and wallow for hours to regulate temperature and shed parasites. Their floodplain grassland is one of the most reduced habitats in Asia, drained and converted for agriculture, and losing the water takes the habitat with it.',
    },
    fieldStudy: {
      id: 'rhino-water-search',
      title: 'The Water Search',
      icon: '💧',
      steps: [
        'Stand where you are and think like an animal that cannot use a tap.',
        'Walk to the nearest water something could actually drink from, counting your steps.',
        'If there is none you can reach, walk one hundred steps and write down 100.',
      ],
      question: 'How many steps to water an animal could drink?',
      unit: 'steps',
      max: 100,
      benchmark: 'Most schoolyards have water in pipes, in bubblers and in locked taps, and none an animal can reach. A result of 100 usually means the honest answer is none. In hot weather, water is the thing small animals run out of first.',
    },
    observation: {
      seconds: 120,
      title: 'Two minutes in the shade',
      instruction: 'Stand still where it is cooler and look around. Do not write anything yet.',
      lookFor: [
        'Is this spot cooler than where you just came from? How can you tell?',
        'Is there any water at all: a puddle, a drip, a damp patch?',
        'What is using the shade already?',
      ],
    },
    citizenScience: {
      id: 'rhino-insect-water',
      title: 'Water They Can Land On',
      icon: '🐝',
      brief: 'You just measured how far an animal would walk for a drink. Make that distance shorter for the smallest ones.',
      primary: 'Fill a shallow dish with water and fill it with stones and sticks so insects can land, drink and climb out without drowning. Put it in the shade.',
      fallback: 'If water is not allowed, make a damp refuge instead: a board or tile laid flat on soil in the shade, which holds moisture underneath.',
      photoPrompt: 'Photograph your dish from above so the stones are visible.',
    },
    writingPromptByStage: {
      1: 'You walked {n} steps to find water, and then you made some. Who might come and drink from it?',
      2: 'You walked {n} steps to find water an animal could drink. Why did you fill your dish with stones?',
      3: 'You walked {n} steps to reach drinkable water, then made a safer one. Explain why an insect needs somewhere to land and why a deep dish is dangerous.',
      4: 'You walked {n} steps to reach drinkable water and then provided some. Explain why water is a limiting factor in a schoolyard, and how your design suits the animals most likely to use it.',
      5: 'You walked {n} steps to reach drinkable water and then provided some. Explain what happens to a floodplain species when water is drained out of its habitat, and why a small water source changes which animals can persist in a hot, hard-surfaced site.',
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
