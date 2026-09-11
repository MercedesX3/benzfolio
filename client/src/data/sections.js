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

  /* Portrait placement (804 x 1748 mobile space). Body coordinates, like the
     desktop ones above — it runs off the left edge here rather than the
     right. */
  m: { x: -120, y: 745, w: 830 },
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
    m: { x: 40, y: 815, w: 310 },
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
    m: { x: 400, y: 800, w: 390 },
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
    m: { x: 20, y: 1290, w: 460 },
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
    m: { x: 520, y: 1185, w: 270 },
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
 * ── It bleeds off the right, but NOT off the bottom ────────────────────────
 * The mockup runs the board off both edges, and that is right for the right
 * edge: the board should reach past the window so you never see it end
 * sideways. The bottom is different, because About is the LAST section. On
 * home and Projects a mat that runs past the fold is a promise — slide down
 * and you see the rest of it. About has nothing below it, so a board with no
 * bottom edge is just a page that stops mid-object.
 *
 * So the board's bottom frame lands ~35px above the fold and the objects on it
 * were lifted 58px to clear it, while the right edge still runs 600px past the
 * canvas.
 *
 * ── Why the asset is 2110 x 893 and not 2110 x 1488 ────────────────────────
 * Those two rules fight each other. The board has to be ~1660 wide to clear
 * the window's right edge (the stage scales to the window's HEIGHT, so on a
 * 1512 x 850 laptop the stage is only 1195px wide and everything past it is
 * grey — the right edge has to reach design x ~2040 to cover windows up to
 * about 2:1, the same reach as the home mat). At the source file's own 1.42
 * aspect, 1660 wide is 1170 tall, which is 428px past the fold.
 *
 * The cork is uniform noise, so the fix is in the asset, not the layout: the
 * file is 9-sliced — the top and bottom 150px hold the wooden frame and are
 * untouched, and only the cork between them is squeezed (2x) — giving a
 * 2.36 aspect where 1660 wide is 702 tall. The frame keeps its proportions,
 * there is no seam to hide, and nothing is stretched. She scaled these assets
 * non-uniformly in the mockup herself; this is the same move done in a way
 * that survives being re-rendered at any size.
 */
export const ABOUT_MAT = {
  src: '/flatlay/cork.webp',
  iw: 2110,
  ih: 953,
  x: 430,
  y: 256,
  w: 1660,

  /* Height in design space, NOT left to the bitmap.
     Everything else on the site takes its height from the image's own aspect
     ratio, which is fine for an object lying on a mat — if it renders a few
     pixels taller nothing else moves. This board is different: it has to end
     just above the fold, so its height is a layout constraint, and leaving it
     to the file means the layout changes whenever the file does. That is
     exactly what happened once already — a stale optimiser cache served the
     pre-crop cork and the board ran 400px past the section, cut off by it.
     With this set, a wrong asset can only look wrong; it cannot re-lay-out
     the page. Keep it equal to w * ih / iw (1660 * 953 / 2110 = 750). */
  h: 750,

  /* Portrait placement. On a phone the board shows its left, top and bottom
     frame and runs off only the right edge, so `m.h` is its real height here
     rather than a crop of it. */
  m: { x: 130, y: 800, w: 1815, h: 820 },
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
    x: 490,
    y: 383,
    w: 178,
    rotate: -3,
    hoverRotate: 1,
    z: 5,
    m: { x: 185, y: 1000, w: 170 },
  },
  {
    id: 'a-piplup',
    label: 'Piplup sticker',
    src: '/flatlay/piplup.webp',
    iw: 304,
    ih: 294,
    x: 620,
    y: 400,
    w: 167,
    rotate: 0,
    hoverRotate: -4,
    z: 6,
    m: { x: 330, y: 1110, w: 105 },
  },
  {
    id: 'a-evelyn',
    label: 'The Seven Husbands of Evelyn Hugo',
    src: '/flatlay/book-evelyn.webp',
    iw: 397,
    ih: 540,
    x: 785,
    y: 325,
    w: 209,
    rotate: 0,
    hoverRotate: -2.5,
    z: 7,
    m: { x: 200, y: 1310, w: 145 },
  },
  {
    id: 'a-hamnet',
    label: 'Hamnet',
    src: '/flatlay/book-hamnet.webp',
    iw: 364,
    ih: 520,
    x: 990,
    y: 325,
    w: 198,
    rotate: 0,
    hoverRotate: 2,
    z: 8,
    m: { x: 355, y: 1310, w: 148 },
  },
  {
    id: 'a-atmosphere',
    label: 'Atmosphere',
    src: '/flatlay/book-atmosphere.webp',
    iw: 346,
    ih: 509,
    x: 1178,
    y: 325,
    w: 193,
    rotate: 0,
    hoverRotate: -2,
    z: 9,
    m: { x: 505, y: 1310, w: 142 },
  },
  {
    id: 'a-books-note',
    label: 'Books I loved',
    src: '/flatlay/sticky-books.webp',
    iw: 377,
    ih: 378,
    x: 1300,
    y: 368,
    w: 185,
    rotate: 0,
    hoverRotate: 3,
    z: 10,
    m: { x: 620, y: 1390, w: 160 },
  },
  {
    id: 'a-penguins',
    label: 'Me and the penguins',
    src: '/flatlay/photo-penguin.webp',
    iw: 199,
    ih: 278,
    x: 1085,
    y: 480,
    w: 97,
    rotate: 0,
    hoverRotate: -3,
    z: 11,
    m: { x: 305, y: 1440, w: 78 },
  },
  {
    id: 'a-strip',
    label: 'Sunsets, Catan and ACM',
    src: '/flatlay/photo-strip.webp',
    iw: 1682,
    ih: 562,
    x: 485,
    y: 600,
    w: 1020,
    rotate: 0,
    hoverRotate: 0.8,
    z: 12,
    m: { x: 420, y: 1010, w: 400 },
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
    y: 290,
    w: 224,
    rotate: 0,
    hoverRotate: 0,
    spin: true,
    z: 4,
    m: { x: 310, y: 568, w: 180 },
  },
  {
    id: 'a-acm',
    label: 'ACM recruitment poster',
    src: '/flatlay/acm-poster.webp',
    iw: 546,
    ih: 686,
    x: 59,
    y: 543,
    w: 290,
    rotate: -1,
    hoverRotate: 1.5,
    z: 4,
    m: { x: 523, y: 458, w: 227 },
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
 * Projects needs the same treatment for the same reason, just less of it. Its
 * deepest content is the violet mat's frame at design y 1142 (the body's edge
 * ends at 1012, the soft shadow runs 130px further) and Archer's iPad at 1053
 * — both past the 1024 fold, so at a span of 1 the iPad was sliced off
 * mid-screen and the mat had no bottom. 1.25 clears both with 138px of ground
 * below the mat before About begins, which is the same proportion of slack
 * home carries.
 *
 * Set a span from the DEEPEST OBJECT, not from the mat: an object's height
 * comes from its bitmap's aspect ratio, so it is never visible in this file
 * and is easy to forget. Archer is 486 wide and 1149x1039 in the file, which
 * is 439 tall, which is what pushed it past the fold.
 *
 * At rest the viewport sits at the TOP of each section, so home still opens on
 * the masthead and the mat's top edge exactly as before.
 */
export const SECTIONS = [
  { id: 'home', label: 'Home', span: 1.8 },
  { id: 'projects', label: 'Projects', span: 1.25 },
  { id: 'about', label: 'About', span: 1 },
  { id: 'contact', label: 'Contact', span: 1 },
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
