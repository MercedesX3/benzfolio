/**
 * Anchor scrolling that goes through Lenis when it is driving the page.
 *
 * A bare `href="#work"` jumps instantly, because globals.css sets
 * `scroll-behavior: auto` so Lenis can own smooth scrolling. Routing the
 * click through Lenis keeps in-page nav consistent with wheel scrolling.
 *
 * Returns true when it handled the scroll, so callers know whether to let
 * the browser (or the router) take over instead.
 */
export const HEADER_OFFSET = -80;

export function scrollToHash(hash) {
  const target = hash && document.querySelector(hash);
  if (!target) return false;

  const lenis = window.__lenis;
  if (lenis) lenis.scrollTo(target, { offset: HEADER_OFFSET });
  else target.scrollIntoView({ behavior: 'smooth' });

  return true;
}

/**
 * Freeze the page behind a full-screen layer (the intro, the drawer, the
 * project sheet).
 *
 * The lock goes on <html>, not <body>: giving <body> `overflow: hidden` turns
 * it into a scroll container, which silently un-sticks the sticky header.
 * Lenis is paused alongside it, since it drives scrolling when it is running.
 */
export function lockScroll(locked) {
  document.documentElement.classList.toggle('is-locked', locked);
  if (locked) window.__lenis?.stop();
  else window.__lenis?.start();
}
