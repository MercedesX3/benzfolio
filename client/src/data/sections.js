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
    x: 557,
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
    x: 601,
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
 * Section order is nav order is slide order. `id` doubles as the URL hash, so
 * /#projects deep-links straight to a section.
 */
export const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
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
export const ALL_ITEMS = [...HOME_ITEMS, ...PROJECT_ITEMS];

export const getItem = (id) => ALL_ITEMS.find((i) => i.id === id) ?? null;
