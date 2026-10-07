# benzfolio

My portfolio. It's built as a photograph of a desk: every project, book and
polaroid is an object lying on a cutting mat, and clicking one opens what it is.

**Live projects:** [SAGE](https://utdsage.com/) · [Semantica](https://semantica.mjxiong.com/)

## How it works

- **One fixed canvas, scaled.** The desktop composition is authored on the same
  1440 × 1024 canvas as the Figma file, and the whole stage scales to the
  window. Objects are positioned in design pixels (`--u`), never in viewport
  percentages, so nothing drifts relative to anything else at any size. Phones
  get their own 804 × 1748 composition instead of the desktop one reflowed.
- **Layout is data.** Each object's position, size, tilt and popup copy live
  in one entry in `client/src/data/flatlay.js` and `client/src/data/sections.js`,
  so moving something and rewriting its copy are the same edit.
- **A deck, not a scroll.** On desktop the sections sit on one rail that slides
  between them, one section per wheel gesture, arrow key or nav click. Each
  section is still a real URL (`/projects`, `/about`), so deep links and the
  back button work.
- **Case studies scroll.** `/projects/<slug>` is the long version of each
  project, written as chapters in `client/src/data/caseStudies.js`.

## Stack

Next.js (App Router) · React 19 · Motion · Lenis · Vercel

## Running it

```bash
npm install --prefix client
npm run dev
```
