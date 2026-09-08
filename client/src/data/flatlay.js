/**
 * The flat-lay — everything on the cutting mat.
 *
 * The page is a photograph of a desk: each project is an object lying on a
 * cutting mat, and clicking one opens what it is. This file is the layout and
 * the content in one place, so moving something and rewriting its copy are the
 * same edit.
 *
 * ── Coordinates ────────────────────────────────────────────────────────────
 * Everything is authored in a fixed 1440 × 1024 design space — the same canvas
 * the Figma mockup uses — and the whole stage is scaled to fit the viewport at
 * render time. That is why these are round pixel numbers rather than
 * percentages: a percentage of a differently-shaped viewport moves objects
 * relative to each other and the composition falls apart. Scaling a fixed
 * canvas keeps every relationship exactly as designed at any screen size.
 *
 * `x` and `y` are the object's TOP-LEFT corner. `w` is its width; height comes
 * from the image's own aspect ratio. `rotate` is the resting angle in degrees —
 * most cut-outs already have a tilt baked into the PNG, so these are small
 * adjustments, not the whole angle.
 *
 * `hoverRotate` is what the object rotates TO on hover. It is deliberately a
 * target rather than a delta so the motion reads the same regardless of resting
 * angle, and so nothing ever spins far enough to look broken.
 */

export const STAGE = { w: 1440, h: 1024 };

/** The mat itself. Not interactive — it is the surface, not an object. */
export const MAT = {
  src: '/flatlay/mat.png',
  /* Sized and placed to run off the bottom and right edges of the canvas.
     The mat should never show its own bottom corner — the composition reads
     as a crop of a bigger desk, not as a photograph of a mat. */
  x: 78,
  y: 212,
  w: 1560,
};

export const ITEMS = [
  {
    id: 'sage',
    label: 'SAGE',
    src: '/flatlay/sage.png',
    x: 1168,
    y: 268,
    w: 168,
    rotate: 0,
    hoverRotate: -3.5,
    z: 4,
    content: {
      kicker: 'AI advising platform',
      title: 'SAGE',
      body: 'An AI advising platform for UT Dallas. It parses your transcript, evaluates it against your degree plan, and answers course-planning questions in plain language through a RAG chatbot — so the answer comes with its source in view rather than as a guess.',
      meta: ['AWS Lambda', 'Pinecone', 'LangChain', 'Gemini', 'React'],
      stat: '2,000+ students served',
      links: [{ label: 'Visit utdsage.com', href: 'https://utdsage.com/' }],
    },
  },
  {
    id: 'semantica',
    label: 'Semantica',
    src: '/flatlay/semantica.png',
    x: 548,
    y: 712,
    w: 520,
    rotate: 0,
    hoverRotate: 2.5,
    z: 5,
    content: {
      kicker: 'Book discovery, by feeling',
      title: 'Semantica',
      body: 'A reading platform that matches you to books by emotional resonance instead of genre. Zero-shot theme classification turns each book into a weighted trait fingerprint, and the interface shows that fingerprint — the sentiment arc, the pacing, the themes — rather than asking you to trust a ranked list.',
      meta: ['Next.js', 'HuggingFace', 'BART-MNLI', 'Figma'],
      stat: '14 screens, drawn twice',
    },
  },
  {
    id: 'lumina',
    label: 'Lumina',
    src: '/flatlay/lumina.png',
    x: 72,
    y: 636,
    w: 350,
    rotate: 0,
    hoverRotate: -3,
    z: 4,
    content: {
      kicker: 'Stargazing forecaster',
      title: 'Lumina',
      body: 'Every stargazing app hands you five separate charts and lets you do the maths. Lumina folds cloud cover, moon phase, light pollution and celestial events into one score that answers the only question that matters: is tonight worth the drive?',
      meta: ['React Native', 'Data pipelines', 'Mobile'],
      stat: 'Four feeds, one number',
    },
  },
  {
    id: 'sketchbook',
    label: 'Sketchbook',
    src: '/flatlay/sketchbook.png',
    x: 1176,
    y: 688,
    w: 264,
    rotate: 0,
    hoverRotate: 3,
    z: 3,
    content: {
      kicker: 'Off the clock',
      title: 'The sketchbook',
      body: 'I sketch buildings for fun, and kept hitting details I had no name for. That became Archer — a living dictionary of architectural vocabulary, where every term carries a definition, a period, and a visual collection, so an entry teaches by example instead of by paragraph.',
      meta: ['Next.js', 'styled-components', 'Redis'],
    },
  },
  {
    id: 'acm',
    label: 'ACM @ UTD',
    src: '/flatlay/polaroid-acm.png',
    x: 388,
    y: 392,
    w: 278,
    rotate: 0,
    hoverRotate: -4,
    z: 6,
    content: {
      kicker: 'Community',
      title: 'VP of ACM @ UTD',
      body: 'The largest tech community on campus. I support 180+ officers across 9 divisions and 200+ active members, keeping useful programming shipping every semester — workshops, socials, and a lot of logistics nobody sees.',
      stat: '180+ officers · 9 divisions',
    },
  },
  {
    id: 'jpmc',
    label: 'JPMorgan Chase',
    src: '/flatlay/polaroid-jpmc.png',
    x: 722,
    y: 378,
    w: 306,
    rotate: 0,
    hoverRotate: 4,
    z: 6,
    content: {
      kicker: 'Internship',
      title: 'SWE Intern @ JPMorgan Chase',
      body: 'A summer inside a codebase far larger than anything I had worked in before — and the clearest lesson I have had in how much of engineering is reading, not writing.',
    },
  },
];

/** The floating nav pill at the bottom of the mat. */
export const NAV = [
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];
