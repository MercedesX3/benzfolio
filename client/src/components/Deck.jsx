'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { Github, Linkedin, Menu, X } from 'lucide-react';

import HomeSection from './sections/HomeSection';
import ProjectsSection from './sections/ProjectsSection';
import AboutSection from './sections/AboutSection';
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
 * ── Sections can be taller than the window ─────────────────────────────────
 * Each section declares a `span` in stage-heights, so home is 1.8 screens
 * tall and the slide down to Projects travels through the bottom of its mat on
 * the way. Because sections differ in height, the rail cannot move in 100%
 * steps — it animates to each section's measured `offsetTop`, re-measured on
 * resize.
 *
 * ── One continuous slide ───────────────────────────────────────────────────
 * Section content animates in once, on mount, and never again. The rail's
 * translation is the entire transition, so the sections read as one surface
 * moving past the viewport rather than two screens being swapped. `isActive`
 * is still computed, but only to drive `inert`/`aria-hidden` — it no longer
 * gates animation.
 *
 * ── Mobile ─────────────────────────────────────────────────────────────────
 * Below the layout breakpoint the deck turns itself off entirely: sections
 * return to normal flow, all of them count as active, and the page scrolls.
 * Pinning a viewport and disabling scroll on a phone would make any content
 * taller than the screen unreachable, which is a far worse outcome than losing
 * the transition.
 */

const DESKTOP = '(min-width: 861px)';

/**
 * Section URLs are real paths, not hashes: /about, never /#about.
 *
 * Each section has its own route (app/[section]/page.js) rendering this same
 * page, so a deep link works on a cold load and the nav can pushState between
 * them without the address bar growing a '#'.
 *
 * A nav entry with no section of its own is a different thing entirely.
 * Contact has no section yet, so there is no path to push and /contact would
 * be a 404 — it gets a mailto, which is a link that actually works rather
 * than one that looks broken. Give Contact a section and it becomes a path
 * with no change here.
 */
const sectionPath = (id) => (id === 'home' ? '/' : `/${id}`);
const hasSection = (id) => SECTIONS.some((sec) => sec.id === id);
const navHref = (id) => (hasSection(id) ? sectionPath(id) : `mailto:${EMAIL}`);

/* '/'-> home, '/about' -> about. Trailing slashes are stripped because Next
   can serve either form. */
const idFromPath = () => {
  const seg = window.location.pathname.replace(/^\/+|\/+$/g, '');
  return seg === '' ? 'home' : seg;
};

export default function Deck() {
  const [index, setIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isDeck, setIsDeck] = useState(false);
  const [offsets, setOffsets] = useState([]);
  /* Measured on the client; the server has no viewport. */
  const [vh, setVh] = useState(0);
  const railRef = useRef(null);

  /**
   * The slide's duration and curve, fixed at the moment the index changes.
   *
   * This is state, not a value derived during render, and that matters: any
   * re-render while the rail is moving (the ResizeObserver firing, an image
   * settling) produced a fresh transition object, and motion treated that as a
   * new instruction and restarted the animation from wherever it had got to.
   * The rail visibly jumped — measured going from -244px to -1433px in a
   * single frame instead of easing through.
   *
   * Duration scales with the distance actually travelled, because sections are
   * not all one screen tall: home is 1.8 screens, and at a fixed 0.9s the
   * bottom of its mat went past too fast to register.
   *
   * The curve is ease-in-out, not the strong ease-out used elsewhere. An
   * ease-out spends ~85% of its distance in the first 30% of its time, which
   * is right for a control snapping into place and wrong for a journey meant
   * to be watched — everything between the sections would blur past.
   */
  const [slide, setSlide] = useState({ duration: 0.9, ease: [0.65, 0, 0.35, 1] });

  const startSlide = useCallback(
    (from, to) => {
      const dist = Math.abs((offsets[to] ?? 0) - (offsets[from] ?? 0));
      const screens = dist / (vh || 800);
      setSlide({
        duration: Math.min(1.7, Math.max(0.75, 0.62 + screens * 0.5)),
        ease: [0.65, 0, 0.35, 1],
      });
    },
    [offsets, vh]
  );
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

  /* Section tops, in pixels, measured from the DOM. Sections have different
     heights, so their offsets cannot be derived from the index. */
  useEffect(() => {
    if (!isDeck) return undefined;

    const measure = () => {
      const rail = railRef.current;
      if (!rail) return;
      const next = Array.from(rail.querySelectorAll('.deck__section')).map(
        (el) => el.offsetTop
      );
      /* Bail out unless something really moved — a fresh array every time
         would re-render the deck for no reason. */
      setOffsets((cur) =>
        cur.length === next.length && cur.every((v, i) => v === next[i]) ? cur : next
      );
      setVh((cur) => (cur === window.innerHeight ? cur : window.innerHeight));
    };

    measure();
    window.addEventListener('resize', measure);
    /* Fonts and images landing can change layout height; observing the rail
       catches that without polling. */
    const ro = new ResizeObserver(measure);
    if (railRef.current) ro.observe(railRef.current);

    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [isDeck]);

  const goTo = useCallback(
    (id) => {
      const next = SECTIONS.findIndex((s) => s.id === id);
      if (next < 0) return false;

      setMenuOpen(false);
      setSelected(null);

      if (isDeck) {
        startSlide(index, next);
        setIndex(next);
        /* pushState, not replaceState: this adds a history entry, so the
           browser's back button walks back through the sections. The popstate
           listener below is what actually moves the rail when it does. */
        window.history.pushState(null, '', sectionPath(id));
      } else {
        document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth' });
      }

      return true;
    },
    [isDeck, index, startSlide]
  );

  /* Deep links: /projects should open on that section. */
  useEffect(() => {
    const at = SECTIONS.findIndex((s) => s.id === idFromPath());
    if (at > 0) setIndex(at);
  }, []);

  /* Back and forward move the rail. Without this, pushState would change the
     URL while leaving the deck where it was. */
  useEffect(() => {
    const onPop = () => {
      const at = SECTIONS.findIndex((sec) => sec.id === idFromPath());
      const next = at < 0 ? 0 : at;
      setIndex((cur) => {
        if (cur !== next) startSlide(cur, next);
        return next;
      });
      setSelected(null);
      setMenuOpen(false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [startSlide]);

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
      const next = Math.min(SECTIONS.length - 1, Math.max(0, index + (forward ? 1 : -1)));
      if (next === index) return;
      startSlide(index, next);
      setIndex(next);
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isDeck, selected, menuOpen, index, startSlide]);

  const onNavClick = (e, id) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (goTo(id)) e.preventDefault();
  };

  const activeId = SECTIONS[index]?.id;
  const item = getItem(selected);

  const sections = [
    { id: 'home', Component: HomeSection },
    { id: 'projects', Component: ProjectsSection },
    { id: 'about', Component: AboutSection },
  ];

  return (
    <div className={`deck ${isDeck ? 'is-deck' : ''}`}>
      <motion.div
        ref={railRef}
        className="deck__rail"
        animate={isDeck ? { y: -(offsets[index] ?? 0) } : { y: 0 }}
        transition={reduced ? { duration: 0 } : slide}
      >
        {sections.map(({ id, Component }) => {
          /* In mobile mode nothing slides, so every section is live. */
          const isActive = !isDeck || id === activeId;
          return (
            <section
              key={id}
              id={`section-${id}`}
              className={`deck__section deck__section--${id}`}
              style={{ '--span': SECTIONS.find((sec) => sec.id === id)?.span ?? 1 }}
              aria-hidden={isDeck && !isActive}
              inert={isDeck && !isActive}
            >
              <Component selected={selected} onSelect={setSelected} />
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
                href={navHref(n.id)}
                aria-current={n.id === activeId ? 'page' : undefined}
                onClick={(e) => onNavClick(e, n.id)}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        {/* The paper plane, again.
            It is the motif the opening splash draws in white on blue; here it
            is the same drawing in blue on the panel's grey, filling the empty
            column beside the right-aligned links. It is decoration, so it is
            aria-hidden and takes no pointer events — the links have to stay
            clickable across the whole panel.

            `priority` is wrong for it (it is behind a closed panel on first
            paint) but lazy is wrong too: the panel opens in one click and a
            plane that fades in three frames late would read as a glitch. It
            is 4KB, so eager costs nothing worth measuring.

            Lossless WebP, not PNG. Saving this line drawing as an optimised
            PNG quantised it to an indexed palette, and the image optimiser
            then stalled converting that to AVIF for the browser — the plane
            simply never loaded, with no error anywhere. */}
        <Image
          src="/flatlay/panel-plane.webp"
          alt=""
          width={434}
          height={583}
          loading="eager"
          aria-hidden="true"
          className="fl__panel-plane"
        />

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
            href={navHref(n.id)}
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
