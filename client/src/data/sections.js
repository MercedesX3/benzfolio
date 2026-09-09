/**
 * The deck — what sections exist and what lies on each one.
 *
 * The site is a stack of full-viewport sections that the nav slides between.
 * There is no scrolling: the only way to move is a nav link, so this file is
 * both the site map and the layout.
 *
 * Coordinates follow the same convention as data/flatlay.js — authored in the
 * mockup's 1440 x 1024 space and scaled as a unit, so `x`/`y` are the object's
 * top-left corner and `w` its width, with height coming from the image's own
 * aspect ratio. See the note in flatlay.js for why a fixed canvas rather than
 * percentages of the viewport.
 */

import { ITEMS as HOME_ITEMS } from './flatlay';

/**
 * The violet mat the project work sits on.
 *
 * A supplied asset rather than a CSS rectangle: it carries a felt texture, a
 * thin dark edge and a soft shadow that flat CSS cannot reproduce. Shipped as
 * WebP because the texture is fine-grained noise — the same image is 2.2MB as
 * PNG and 401KB as WebP, indistinguishable at the size it renders.
 *
 * ── Placing it by its visible edge, not its bounding box ───────────────────
 * The PNG frame is mostly shadow: the violet body sits 7.3% in from the left,
 * 12.6% down from the top, 7.4% from the right and 13.5% up from the bottom.
 * So `x`/`y`/`w` below describe the BODY — where the mat visibly starts and
 * how wide the violet is — and the component converts that to the image's own
 * box using those insets. Positioning the raw image instead would put the mat
 * roughly a hundred pixels off in both axes, and the error would change with
 * every resize.
 */
export const PROJECT_MAT = {
  src: '/flatlay/projects-mat.webp',
  iw: 1800,
  ih: 1088,

  /* Where the violet body sits, in design-space units.
     The whole mat is inside the canvas so all four corners show — it reads as
     a mat lying on a surface rather than as a full-bleed background. The
     trade-off is a grey margin on the right: the stage is left-anchored and
     narrower than a wide window, so anything that ends inside the canvas
     cannot reach the screen edge. That margin is the point here, not a bug. */
  x: 95,
  y: 300,
  w: 1360,

  /* Measured from the file: where the violet body sits inside the frame, as
     fractions of the frame. `bodyW` is how much of the frame's width the body
     spans (1 - left - right inset). */
  inset: { left: 0.0728, top: 0.1259 },
  bodyW: 0.8533,
};

export const PROJECT_ITEMS = [
  {
    id: 'p-sage',
    label: 'SAGE',
    src: '/flatlay/sage-poster.png',
    iw: 629,
    ih: 838,
    x: 117,
    y: 430,
    w: 398,
    rotate: -2,
    hoverRotate: 1.5,
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
    id: 'p-semantica',
    label: 'Semantica',
    src: '/flatlay/semantica-ipad.png',
    iw: 1114,
    ih: 827,
    x: 609,
    y: 230,
    w: 524,
    rotate: 0,
    hoverRotate: 2,
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
    id: 'p-archer',
    label: 'Archer',
    src: '/flatlay/archer-ipad.png',
    iw: 1149,
    ih: 1039,
    x: 653,
    y: 614,
    w: 486,
    rotate: 0,
    hoverRotate: -2,
    z: 6,
    content: {
      kicker: 'A dictionary for architects',
      title: 'Archer',
      body: 'I sketch buildings for fun and kept hitting details I had no name for. Archer is the reference I wanted: every term carries a definition, a period, and a visual collection, so an entry teaches by example instead of by paragraph.',
      meta: ['Next.js', 'React', 'styled-components', 'Redis'],
      stat: 'Built from my own sketchbook',
    },
  },
  {
    id: 'p-lumina',
    label: 'Lumina',
    src: '/flatlay/lumina-poster.png',
    iw: 629,
    ih: 838,
    x: 1236,
    y: 346,
    w: 438,
    rotate: 2,
    hoverRotate: -1.5,
    z: 4,
    content: {
      kicker: 'Stargazing forecaster',
      title: 'Lumina',
      body: 'Every stargazing app hands you five separate charts and lets you do the maths. Lumina folds cloud cover, moon phase, light pollution and celestial events into one score that answers the only question that matters: is tonight worth the drive?',
      meta: ['React Native', 'Data pipelines', 'Mobile'],
      stat: 'ACM Projects Design Winner, F2024',
    },
  },
];

/**
 * The cork board the About section is pinned to.
 *
 * Unlike PROJECT_MAT this needs no inset conversion: the cork asset's frame IS
 * its bounding box — the wooden edge runs to the pixel, with no transparent
 * shadow margin around it — so x/y/w describe the image directly.
 *
 * ── Why it bleeds off two edges, not four ──────────────────────────────────
 * The mockup shows the board's top-left corner and frame sitting inside the
 * canvas with grey margin above and to the left, and the board running off the
 * right edge and the bottom. That asymmetry is what makes it read as a board
 * on a wall rather than a background texture: you can see where it starts.
 *
 * ── Why it is wider than the mockup drew it ────────────────────────────────
 * The mockup is 1440 x 1024, the design ratio exactly, and at that ratio a
 * board 1150 wide clears the right edge. Real windows are wider than they are
 * tall: the stage scales to the window's HEIGHT, so on a 1512 x 850 laptop the
 * stage is only 1195px wide and everything past it is grey — a 1150-wide board
 * stopped short and showed its right-hand frame, with a grey strip beside it.
 * 1700 puts the right edge at design x 2080, the same reach as the home mat,
 * which covers every window up to about 2:1. The cost is a chunkier frame
 * (~44 design px rather than the mockup's 29); the board is meant to run off
 * the edge, so that is the cheaper of the two errors.
 */
export const ABOUT_MAT = {
  src: '/flatlay/cork.webp',
  iw: 2110,
  ih: 1488,
  x: 380,
  y: 342,
  w: 1700,
};

/**
 * What's pinned to the board.
 *
 * These carry no `content`, and that is the discriminator LayItem uses: an
 * object with a card behind it renders as a button with the white halo on
 * hover, and an object without one renders as a plain image that only tilts.
 * A halo on something that cannot be clicked is a false affordance — it is
 * the site's own signal for "this opens a card".
 *
 * Several assets already have their tilt baked into the bitmap (the books, the
 * photo strip), so their `rotate` is 0 and only `hoverRotate` moves them.
 */
export const ABOUT_ITEMS = [
  {
    id: 'a-swim',
    label: 'I love swimming',
    src: '/flatlay/sticky-swim.webp',
    iw: 360,
    ih: 361,
    x: 454,
    y: 476,
    w: 162,
    rotate: -3,
    hoverRotate: 1,
    z: 5,
  },
  {
    id: 'a-piplup',
    label: 'Piplup sticker',
    src: '/flatlay/piplup.webp',
    iw: 304,
    ih: 294,
    x: 612,
    y: 492,
    w: 152,
    rotate: 0,
    hoverRotate: -4,
    z: 6,
  },
  {
    id: 'a-evelyn',
    label: 'The Seven Husbands of Evelyn Hugo',
    src: '/flatlay/book-evelyn.webp',
    iw: 397,
    ih: 540,
    x: 743,
    y: 427,
    w: 190,
    rotate: 0,
    hoverRotate: -2.5,
    z: 7,
  },
  {
    id: 'a-hamnet',
    label: 'Hamnet',
    src: '/flatlay/book-hamnet.webp',
    iw: 364,
    ih: 520,
    x: 928,
    y: 415,
    w: 180,
    rotate: 0,
    hoverRotate: 2,
    z: 8,
  },
  {
    id: 'a-atmosphere',
    label: 'Atmosphere',
    src: '/flatlay/book-atmosphere.webp',
    iw: 346,
    ih: 509,
    x: 1100,
    y: 415,
    w: 175,
    rotate: 0,
    hoverRotate: -2,
    z: 9,
  },
  {
    id: 'a-books-note',
    label: 'Books I loved',
    src: '/flatlay/sticky-books.webp',
    iw: 377,
    ih: 378,
    x: 1252,
    y: 459,
    w: 168,
    rotate: 0,
    hoverRotate: 3,
    z: 10,
  },
  {
    id: 'a-penguins',
    label: 'Me and the penguins',
    src: '/flatlay/photo-penguin.webp',
    iw: 199,
    ih: 278,
    x: 1056,
    y: 575,
    w: 88,
    rotate: 0,
    hoverRotate: -3,
    z: 11,
  },
  {
    id: 'a-strip',
    label: 'Sunsets, Catan and ACM',
    src: '/flatlay/photo-strip.webp',
    iw: 1682,
    ih: 562,
    x: 520,
    y: 674,
    w: 875,
    rotate: 0,
    hoverRotate: 0.8,
    z: 12,
  },
];

/** The two objects that sit on the grey, to the left of the board. */
export const ABOUT_SHELF = [
  {
    id: 'a-vinyl',
    label: 'On repeat',
    src: '/flatlay/vinyl.webp',
    iw: 448,
    ih: 448,
    x: 88,
    y: 368,
    w: 224,
    rotate: 0,
    hoverRotate: 0,
    spin: true,
    z: 4,
  },
  {
    id: 'a-acm',
    label: 'ACM recruitment poster',
    src: '/flatlay/acm-poster.webp',
    iw: 546,
    ih: 686,
    x: 59,
    y: 621,
    w: 290,
    rotate: -1,
    hoverRotate: 1.5,
    z: 4,
  },
];

/**
 * Section order is nav order is slide order. `id` doubles as the URL hash, so
 * /#projects deep-links straight to a section.
 *
 * `span` is the section's height in multiples of the stage height. A section
 * taller than one screen is the point, not an accident: the home mat is 0.76x
 * as tall as it is wide, so a mat wide enough to reach the screen edges runs
 * well below the fold. Giving home a span of 1.8 means the slide down to
 * Projects travels through the rest of the mat — its bottom edge and corners
 * pass by on the way — instead of the mat simply being cut off forever.
 *
 * At rest the viewport sits at the TOP of each section, so home still opens on
 * the masthead and the mat's top edge exactly as before.
 */
export const SECTIONS = [
  { id: 'home', label: 'Home', span: 1.8 },
  { id: 'projects', label: 'Projects', span: 1 },
  { id: 'about', label: 'About', span: 1 },
];

/**
 * One registry for every object on the site.
 *
 * The popup is owned by the deck, not by a section, so it can sit above the
 * sliding rail. That means the lookup has to reach objects on any section —
 * hence a single flat list, and hence the `p-` prefixes on the project ids:
 * two objects sharing an id would make the lookup ambiguous and open the wrong
 * card.
 */
export const ALL_ITEMS = [
  ...HOME_ITEMS,
  ...PROJECT_ITEMS,
  ...ABOUT_ITEMS,
  ...ABOUT_SHELF,
];

export const getItem = (id) => ALL_ITEMS.find((i) => i.id === id) ?? null;
