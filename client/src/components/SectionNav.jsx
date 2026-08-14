'use client';

import { useEffect, useRef, useState } from 'react';
import './SectionNav.css';

/**
 * Fixed chapter rail on the right edge: one mark per section, the current one
 * highlighted, click to jump.
 *
 * Position is polled on an animation frame rather than driven by scroll events
 * or IntersectionObserver. Lenis moves the page in ways that don't reliably
 * surface as native scroll events — the same thing that broke an earlier
 * version of the reveal system — and a position check can't be missed.
 * The loop is a handful of getBoundingClientRect calls and rAF suspends it
 * automatically in a background tab.
 */

const HEADER_OFFSET = 90;

export default function SectionNav({ sections }) {
  const [active, setActive] = useState(sections[0]?.id ?? null);
  const activeRef = useRef(active);

  useEffect(() => {
    let frame = 0;
    let stopped = false;

    const tick = () => {
      if (stopped) return;

      const line = window.innerHeight * 0.35;
      let current = sections[0]?.id ?? null;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        // The last section whose top has crossed the line is the one you're in.
        if (el.getBoundingClientRect().top <= line) current = section.id;
      }

      // At the very bottom the final section may never cross the line, so
      // claim it explicitly — otherwise the last chapter never highlights.
      const doc = document.documentElement;
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
        const last = sections[sections.length - 1];
        if (last && document.getElementById(last.id)) current = last.id;
      }

      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      stopped = true;
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  const go = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(el, { offset: -HEADER_OFFSET });
    } else {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    }

    // Reflect position in the URL without stacking history entries.
    if (window.history?.replaceState) {
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  if (!sections?.length) return null;

  return (
    <nav className="secnav" aria-label="Sections on this page">
      <ul className="secnav__list">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <li className="secnav__item" key={section.id}>
              <button
                type="button"
                className={`secnav__btn ${isActive ? 'is-active' : ''}`}
                onClick={() => go(section.id)}
                aria-current={isActive ? 'true' : undefined}
                title={section.label}
              >
                <span className="secnav__label">{section.label}</span>
                <span className="secnav__mark" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
