'use client';

import { useEffect } from 'react';

/**
 * Scroll-reveal for anything carrying [data-reveal].
 *
 * Deliberately NOT built on IntersectionObserver, and deliberately not
 * dependent on scroll events.
 *
 * The previous site used per-section IntersectionObservers created inside a
 * setTimeout, and the one watching the About page's "My Communities" block
 * never fired — leaving the strongest section on the site permanently at
 * opacity: 0. Two things make that class of bug possible:
 *
 *   1. IntersectionObserver delivers *events*. Scroll fast enough (a flick,
 *      the End key, scroll restoration, an anchor jump) and an element can
 *      travel from below the fold to above it without a single callback ever
 *      reporting it as intersecting. It then stays hidden forever.
 *   2. Scroll events aren't guaranteed either — smooth-scroll libraries move
 *      the page in ways that don't always surface as a native scroll event.
 *
 * So this polls *position*: "is this element's top above the reveal line?"
 * A position test can't be missed, whatever route the page took to get there.
 *
 * Two clocks drive the poll, because neither alone is sufficient:
 *   • requestAnimationFrame — smooth and frame-accurate while visible, but
 *     suspended entirely in a hidden or background tab.
 *   • a slow interval — keeps running (throttled) when the tab is hidden, so
 *     content is never left invisible just because rAF was asleep.
 *
 * Both stop themselves the moment nothing is left to reveal, so the
 * steady-state cost is zero.
 */
const REVEAL_LINE = 0.88; // fraction of viewport height
const IDLE_POLL_MS = 400;

export default function useReveal() {
  useEffect(() => {
    let frame = 0;
    let timer = 0;
    let stopped = false;

    const reveal = (el) => el.classList.add('is-revealed');

    /** @returns {boolean} true if work remains */
    const check = () => {
      const pending = document.querySelectorAll('[data-reveal]:not(.is-revealed)');
      if (!pending.length) return false;

      const vh = window.innerHeight || document.documentElement.clientHeight;

      if (!vh) {
        // No viewport to speak of (headless capture, zero-height embed,
        // print). Nothing can ever cross a reveal line, so show everything —
        // a skipped animation is fine, silently hidden content is not.
        pending.forEach(reveal);
        return false;
      }

      const line = vh * REVEAL_LINE;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < line) reveal(el);
      });

      return document.querySelector('[data-reveal]:not(.is-revealed)') !== null;
    };

    const tick = () => {
      frame = 0;
      if (stopped) return;
      if (check()) frame = requestAnimationFrame(tick);
      else stopTimer();
    };

    const stopTimer = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = 0;
      }
    };

    const start = () => {
      if (stopped) return;
      if (!frame) frame = requestAnimationFrame(tick);
      if (!timer) {
        timer = window.setInterval(() => {
          if (!check()) stopTimer();
        }, IDLE_POLL_MS);
      }
    };

    // Run once synchronously so above-the-fold content never flashes hidden.
    check();
    start();

    window.addEventListener('scroll', start, { passive: true });
    window.addEventListener('resize', start);
    window.addEventListener('load', start);
    document.addEventListener('visibilitychange', start);

    // Newly mounted sections (route changes, expanding content) get picked up.
    const mo = new MutationObserver(start);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      stopped = true;
      if (frame) cancelAnimationFrame(frame);
      stopTimer();
      window.removeEventListener('scroll', start);
      window.removeEventListener('resize', start);
      window.removeEventListener('load', start);
      document.removeEventListener('visibilitychange', start);
      mo.disconnect();
    };
  }, []);
}
