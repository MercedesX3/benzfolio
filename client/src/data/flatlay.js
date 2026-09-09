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
 * `anchor` opts an object OUT of the stage and pins it to a corner of the
 * viewport instead. The stage is anchored left and is narrower than a wide
 * window, so its right edge stops short of the screen — anything that has to
 * touch the actual corner (as opposed to sitting at a spot in the
 * composition) cannot live inside it. Such an object gives up its x/y and is
 * positioned by the CSS offsets in `anchor` instead.
 *
 * `hoverRotate` is what the object rotates TO on hover. It is deliberately a
 * target rather than a delta so the motion reads the same regardless of resting
 * angle, and so nothing ever spins far enough to look broken.
 */

export const STAGE = { w: 1440, h: 1024 };

/** The mat itself. Not interactive — it is the surface, not an object. */
export const MAT = {
  src: '/flatlay/mat.png',
  iw: 1588,
  ih: 1201,
  /* The mat sits in the bottom-right corner with its top-left corner visible —
     it should read as a mat on a desk, not as a full-bleed background.
     
     Placing it precisely needs the geometry of the PNG, because the mat is
     rotated inside its own bounding box: the visible corner is at (1.4%, 19.8%)
     of the box, and the box is 0.756 as tall as it is wide. So the corner lands
     at (x + 0.014w, y + 0.150w) — which is how these numbers were chosen rather
     than nudged. At this size the corner sits around 10% in and halfway down,
     and the mat's sloping right edge still clears the viewport at the bottom of
     a 16:9 window, which is the case that leaves a grey wedge if the mat is any
     smaller. */
  x: 180,
  y: 250,
  w: 1900,
};

export const ITEMS = [
  {
    id: 'sage',
    label: 'SAGE',
    src: '/flatlay/sage.png',
    iw: 274,
    ih: 429,
    x: 1330,
    y: 275,
    w: 300,
    rotate: 0,
    hoverRotate: -3.5,
    z: 14,
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
    iw: 585,
    ih: 437,
    x: 602,
    y: 610,
    w: 820,
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
    iw: 537,
    ih: 512,
    x: 20,
    y: 540,
    w: 520,
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
    iw: 353,
    ih: 502,
    /* Pinned to the bottom-right of the window, not to a point on the mat, so
       it always tucks into the corner however wide the screen is. The negative
       offsets let it run off both edges the way it does in the mockup. */
    anchor: { right: '-4vw', bottom: '-9vh', width: 'clamp(210px, 23vw, 450px)' },
    rotate: 0,
    hoverRotate: 3,
    z: 12,
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
    iw: 365,
    ih: 331,
    x: 360,
    y: 262,
    w: 420,
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
    iw: 421,
    ih: 396,
    x: 805,
    y: 218,
    w: 460,
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
  { id: 'playground', label: 'Playground' },
  { id: 'contact', label: 'Contact' },
];

/* The pill has room for three; the side panel carries the full set. */
export const PILL_NAV = NAV.filter((n) => n.id !== 'playground');
