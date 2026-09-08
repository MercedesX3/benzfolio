'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Github, Linkedin, Menu, X } from 'lucide-react';

import HomeSection from './sections/HomeSection';
import ProjectsSection from './sections/ProjectsSection';
import ItemCard from './lay/ItemCard';
import { SECTIONS, getItem } from '../data/sections';
import { NAV, PILL_NAV } from '../data/flatlay';
import { EMAIL, RESUME, SOCIALS } from '../data/site';
import './flatlay/FlatLay.css';
import './Deck.css';

/**
 * The deck: full-viewport sections the nav slides between.
 *
 * ── Why a translated rail rather than scrolling ────────────────────────────
 * The brief is that the reader cannot scroll — movement happens only through
 * the nav. So the page is pinned to the viewport and a rail of equal-height
 * sections is translated behind it. That also makes the transition something
 * we control: one animation with a known duration, rather than whatever the
 * browser's smooth-scroll happens to do.
 *
 * ── Why `active` and not `whileInView` ─────────────────────────────────────
 * Every section is technically on screen the whole time — the rail moves, the
 * viewport doesn't — so IntersectionObserver reports all of them as visible
 * from the first paint. Scroll-triggered entrances would all fire on load and
 * be long finished by the time the reader arrived. Sections therefore take an
 * `active` prop and animate off that.
 *
 * ── Mobile ─────────────────────────────────────────────────────────────────
 * Below the layout breakpoint the deck turns itself off entirely: sections
 * return to normal flow, all of them count as active, and the page scrolls.
 * Pinning a viewport and disabling scroll on a phone would make any content
 * taller than the screen unreachable, which is a far worse outcome than losing
 * the transition.
 */

const DESKTOP = '(min-width: 861px)';

export default function Deck() {
  const [index, setIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isDeck, setIsDeck] = useState(false);
  const reduced = useReducedMotion();

  /* Deck mode is desktop-only, and is decided on the client — the server has
     no viewport. Starting false means the first paint is the scrollable
     layout, which is the safe one to be wrong about. */
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const apply = () => setIsDeck(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  /* Scroll lock lives on <html> so the fixed rail has nothing to scroll
     behind it. Off in mobile mode, where scrolling is the layout. */
  useEffect(() => {
    document.documentElement.classList.toggle('is-deck', isDeck);
    return () => document.documentElement.classList.remove('is-deck');
  }, [isDeck]);

  const goTo = useCallback(
    (id) => {
      const next = SECTIONS.findIndex((s) => s.id === id);
      if (next < 0) return false;

      setMenuOpen(false);
      setSelected(null);

      if (isDeck) {
        setIndex(next);
        /* Keep the hash in step so a section is linkable and the back button
           works, without triggering the browser's own jump. */
        window.history.replaceState(null, '', next === 0 ? '#' : `#${id}`);
      } else {
        document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth' });
      }

      return true;
    },
    [isDeck]
  );

  /* Deep links: /#projects should open on that section. */
  useEffect(() => {
    const id = window.location.hash.replace('#', '');
    const at = SECTIONS.findIndex((s) => s.id === id);
    if (at > 0) setIndex(at);
  }, []);

  /* With scrolling disabled, the arrow keys are the only keyboard way through
     the deck — without them a keyboard user could reach a section's links but
     never move the view to them. */
  useEffect(() => {
    if (!isDeck) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (selected) setSelected(null);
        else if (menuOpen) setMenuOpen(false);
        return;
      }
      if (selected || menuOpen) return;

      const forward = e.key === 'ArrowDown' || e.key === 'PageDown';
      const back = e.key === 'ArrowUp' || e.key === 'PageUp';
      if (!forward && !back) return;

      e.preventDefault();
      setIndex((i) => Math.min(SECTIONS.length - 1, Math.max(0, i + (forward ? 1 : -1))));
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isDeck, selected, menuOpen]);

  const onNavClick = (e, id) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (goTo(id)) e.preventDefault();
  };

  const activeId = SECTIONS[index]?.id;
  const item = getItem(selected);

  const sections = [
    { id: 'home', Component: HomeSection },
    { id: 'projects', Component: ProjectsSection },
  ];

  return (
    <div className={`deck ${isDeck ? 'is-deck' : ''}`}>
      <motion.div
        className="deck__rail"
        animate={isDeck ? { y: `-${index * 100}%` } : { y: 0 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 0.92, ease: [0.16, 1, 0.3, 1] }
        }
      >
        {sections.map(({ id, Component }) => {
          /* In mobile mode nothing slides, so every section is live. */
          const isActive = !isDeck || id === activeId;
          return (
            <section
              key={id}
              id={`section-${id}`}
              className="deck__section"
              aria-hidden={isDeck && !isActive}
              inert={isDeck && !isActive}
            >
              <Component active={isActive} selected={selected} onSelect={setSelected} />
            </section>
          );
        })}
      </motion.div>

      {/* ── Persistent chrome ──────────────────────────────────────────── */}

      <button
        type="button"
        className="fl__menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        {menuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
        <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
      </button>

      {menuOpen && (
        <div className="fl__panel-scrim" onClick={() => setMenuOpen(false)} role="presentation" />
      )}

      <nav
        className={`fl__panel ${menuOpen ? 'is-open' : ''}`}
        aria-label="Menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <ul className="fl__panel-list">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                aria-current={n.id === activeId ? 'page' : undefined}
                onClick={(e) => onNavClick(e, n.id)}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <ul className="fl__panel-socials">
          <li>
            <a href={RESUME} target="_blank" rel="noreferrer">
              Résumé
            </a>
          </li>
          {SOCIALS.map((soc) => (
            <li key={soc.label}>
              <a href={soc.href} target="_blank" rel="noreferrer">
                {soc.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="fl__pill" aria-label="Primary">
        <a
          href={SOCIALS.find((s) => s.label === 'GitHub')?.href}
          target="_blank"
          rel="noreferrer"
          className="fl__pill-icon"
          aria-label="GitHub"
        >
          <Github size={22} />
        </a>
        {PILL_NAV.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className={`fl__pill-link ${n.id === activeId ? 'is-current' : ''}`}
            aria-current={n.id === activeId ? 'page' : undefined}
            onClick={(e) => onNavClick(e, n.id)}
          >
            {n.label}
          </a>
        ))}
        <a
          href={SOCIALS.find((s) => s.label === 'LinkedIn')?.href}
          target="_blank"
          rel="noreferrer"
          className="fl__pill-icon"
          aria-label="LinkedIn"
        >
          <Linkedin size={22} />
        </a>
      </nav>

      <ItemCard item={item} onClose={() => setSelected(null)} />

      {/* Real content for search engines and screen readers, since the
          composition itself is images. */}
      <div className="sr-only">
        <h2>Projects</h2>
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.id}>{s.label}</li>
          ))}
        </ul>
        <p>
          Contact: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </div>
    </div>
  );
}
