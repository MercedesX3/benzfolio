'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

/**
 * Page-level smooth scrolling.
 *
 * Publishes two things the rest of the site reads without re-rendering React:
 *   --scroll-progress  (0 → 1 over the whole document) on <html>
 *   window.__lenisScroll = { y, progress, velocity }  (for the 3D scene's rAF loop)
 *
 * Disabled entirely under prefers-reduced-motion, where native scrolling is used.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.__lenisScroll = { y: 0, progress: 0, velocity: 0 };

    if (reduced) return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch feels better than an emulated one.
      syncTouch: false,
    });

    window.__lenis = lenis;

    const root = document.documentElement;

    const onScroll = ({ scroll, limit, velocity }) => {
      const progress = limit > 0 ? scroll / limit : 0;
      window.__lenisScroll = { y: scroll, progress, velocity };
      root.style.setProperty('--scroll-progress', progress.toFixed(4));
    };

    lenis.on('scroll', onScroll);

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Route changes land at the top and Lenis re-measures — unless the URL
  // carries a hash, in which case honour the anchor instead.
  useEffect(() => {
    const lenis = window.__lenis;
    lenis?.resize();

    // Deferred a frame: the router does its own scroll adjustment once the
    // route commits, and landing on the anchor before that just gets undone.
    const frame = requestAnimationFrame(() => {
      const hash = window.location.hash;
      const target = hash ? document.querySelector(hash) : null;

      if (target) {
        // force: Lenis refuses scrollTo while stopped, and it can still be
        // stopped here — the overlay open on the previous route (a drawer,
        // the sheet) has not necessarily run its cleanup yet.
        if (lenis) lenis.scrollTo(target, { immediate: true, offset: -80, force: true });
        else target.scrollIntoView();
        return;
      }

      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
