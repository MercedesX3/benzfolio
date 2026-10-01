'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { Github, Linkedin, Menu, X } from 'lucide-react';

import HomeSection from './sections/HomeSection';
import ProjectsSection from './sections/ProjectsSection';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';
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

  /* Deep links: /projects should open ON that section, not travel to it.
     The slide is a transition between sections the reader asked for; on a
     cold load there is nothing to transition from, so animating it meant
     someone opening /contact watched an empty rail move past four screens of
     not-yet-loaded sections before anything arrived. `placed` stays false
     until the rail has been put in position once, and the rail uses it to
     skip that first animation.

     State rather than a ref: the rail reads it while rendering, and a ref
     flipping does not re-render, so the transition stayed pinned at zero and
     every later nav click jumped instead of sliding. */
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    const at = SECTIONS.findIndex((s) => s.id === idFromPath());
    if (at > 0) setIndex(at);
  }, []);

  /* The same deep link on a phone.
     Below the breakpoint the deck is off and the page is an ordinary scrolling
     document, so moving the rail does nothing — /about opened at the top of
     the home section and the reader had to find it themselves. Nav clicks were
     fine, because those scroll; only the cold load was stranded. */
  const jumped = useRef(false);

  useEffect(() => {
    if (isDeck || jumped.current) return;
    const id = idFromPath();
    if (id === 'home') {
      jumped.current = true;
      return;
    }
    const el = document.getElementById(`section-${id}`);
    if (!el) return;
    /* Instant, not smooth: this is where the page opens, not a journey the
       reader asked to watch. */
    el.scrollIntoView({ block: 'start', behavior: 'auto' });
    jumped.current = true;
  }, [isDeck]);

  /* Flipped after the first positioned frame, so only the opening placement
     is instant. It waits for offsets, because before they are measured the
     rail's target is still 0 and that frame is not the real placement. */
  useEffect(() => {
    if (placed || (isDeck && !offsets.length)) return undefined;
    const id = requestAnimationFrame(() => setPlaced(true));
    return () => cancelAnimationFrame(id);
  }, [placed, isDeck, offsets.length]);

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

  /* Move one section, clamped at both ends. Everything that navigates goes
     through goTo, so the URL, the panel and the open card all stay in step —
     the arrow keys used to setIndex directly and left the address bar behind. */
  const step = useCallback(
    (dir) => {
      const next = Math.min(SECTIONS.length - 1, Math.max(0, index + dir));
      if (next === index) return false;
      return goTo(SECTIONS[next].id);
    },
    [index, goTo]
  );

  /**
   * The wheel moves the deck one section at a time.
   *
   * ── Why not scroll-snap ───────────────────────────────────────────────
   * CSS snapping relaxes itself for any snap area taller than the viewport,
   * and home is 1.8 screens and Projects 1.25 — exactly so their mats can run
   * past the fold. Under `mandatory` those two would become freely scrollable
   * and the composition would come to rest halfway through a mat. Driving the
   * existing rail from the wheel keeps one gesture equal to one section, and
   * keeps the long sections as something you travel through rather than stop
   * inside.
   *
   * ── One gesture, one section ──────────────────────────────────────────
   * A trackpad flick is dozens of events over half a second, so a naive
   * handler would fly to the end of the deck. The handler arms once and
   * disarms on firing; it re-arms only when BOTH the wheel has been quiet for
   * a moment and the slide has finished. Keep flicking and nothing more
   * happens — which is the "sticky" part.
   */
  /* Gesture bookkeeping, and a mirror of the values the handler needs.
     The handler reads from `latest` rather than closing over state, so the
     listener attaches once and survives every navigation.

     That indirection is not tidiness — it was the bug. With `step` and
     `slide.duration` in the dependency array the effect re-ran on every
     navigation, and its cleanup cleared the pending re-arm timer, so the deck
     stayed disarmed until the next wheel event happened to schedule a new
     one. Every other scroll did nothing, and a flick did nothing at all. */
  const gesture = useRef({ accum: 0, lastAt: 0, fired: false, busyUntil: 0 });
  const latest = useRef(null);
  latest.current = {
    selected,
    menuOpen,
    step,
    duration: reduced ? 0 : slide.duration,
  };

  useEffect(() => {
    if (!isDeck) return undefined;

    const g = gesture.current;
    /* Long enough to outlast the inertial tail macOS keeps sending after the
       fingers lift — those arrive continuously, so a gap this size reliably
       means a NEW gesture rather than a pause inside one. */
    const QUIET = 400;

    const blocked = () => latest.current.selected || latest.current.menuOpen;

    const advance = (dir) => {
      g.fired = true;
      /* Floor of 750ms because `slide.duration` is the duration of the slide
         that just ENDED — the next one is not set until step() runs. */
      g.busyUntil = Date.now() + Math.max(750, latest.current.duration * 1000) + 150;
      latest.current.step(dir);
    };

    /* No timers. "Has the gesture ended?" is answered by the gap since the
       last event, measured when the next one arrives — a timer scheduled to
       answer it can fire during a stall in the middle of a flick, which is
       what made a 25-event flick jump two sections instead of one. */
    const onWheel = (e) => {
      if (blocked()) return;

      const now = Date.now();
      const gap = now - g.lastAt;
      g.lastAt = now;

      if (gap > QUIET) {
        g.fired = false;
        g.accum = 0;
      }

      if (g.fired) return; // one section per gesture — this is the sticky part
      if (now < g.busyUntil) return; // the rail is still moving

      g.accum += e.deltaY;
      if (Math.abs(g.accum) < 40) return;
      advance(g.accum > 0 ? 1 : -1);
    };

    /* Tablets in landscape are wide enough for the deck, and a swipe there
       should do what the wheel does. touchend is an unambiguous end of
       gesture, so this needs none of the above. */
    let startY = null;
    const onTouchStart = (e) => {
      startY = blocked() ? null : e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      if (startY === null) return;
      const dy = startY - (e.changedTouches[0]?.clientY ?? startY);
      startY = null;
      if (Math.abs(dy) > 48 && Date.now() >= g.busyUntil) {
        advance(dy > 0 ? 1 : -1);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDeck]);

  /* The arrow keys do the same thing, for anyone not using a pointer. */
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
      step(forward ? 1 : -1);
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isDeck, selected, menuOpen, step]);

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
    { id: 'contact', Component: ContactSection },
  ];

  return (
    <div className={`deck ${isDeck ? 'is-deck' : ''}`}>
      <motion.div
        ref={railRef}
        className="deck__rail"
        animate={isDeck ? { y: -(offsets[index] ?? 0) } : { y: 0 }}
        transition={reduced || !placed ? { duration: 0 } : slide}
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
              <Component
                selected={selected}
                onSelect={setSelected}
                onNavigate={goTo}
              />
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
