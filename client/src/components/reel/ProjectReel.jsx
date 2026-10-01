'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import ReelFrame from './scenes';
import { REEL_DURATION, getReel } from '../../data/reels';
import './ProjectReel.css';

/**
 * The 15-second clip at the top of a project popup.
 *
 * ── Why this is code and not an mp4 ────────────────────────────────────────
 * A video of this at a size worth looking at is a few megabytes per project,
 * goes soft the moment it scales past its encode, needs a poster frame to
 * avoid a black box on load, and cannot take its colours from the design
 * tokens. This is an SVG driven by one number, so it is a few KB, stays sharp
 * on any display, starts instantly, and can freeze to a composed still frame
 * when the viewer has asked for less motion.
 *
 * ── The clock ──────────────────────────────────────────────────────────────
 * One rAF loop advances `t` in seconds and wraps at 15. Scenes are pure
 * functions of `t` (see scenes.jsx), so the loop is seamless and a paused clip
 * is just a frame.
 *
 * It is throttled to ~30fps on purpose. These are diagrams, not camera moves;
 * 30 is indistinguishable here and halves the React renders, which matters
 * because the popup animates in over the top of it.
 *
 * The clock only runs while the clip is actually on screen — an
 * IntersectionObserver stops it otherwise, so a popup scrolled out of view or
 * left open behind another is not burning frames.
 */

const FPS = 30;

export default function ProjectReel({ slug, label }) {
  const reel = getReel(slug);
  const reduced = useReducedMotion();

  const hostRef = useRef(null);
  const [t, setT] = useState(0);
  const [visible, setVisible] = useState(true);
  /* Paused by the viewer, as opposed to paused because it is off screen. */
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => setVisible(entries[0].isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playing = Boolean(reel) && visible && !held && !reduced;

  /* The clock reads the latest t when it restarts, without making t a
     dependency of the effect — which would tear down and rebuild the loop on
     every frame. */
  const tRef = useRef(0);
  tRef.current = t;

  useEffect(() => {
    if (!playing) return;

    let raf;
    let start = null;
    let lastDrawn = -1;
    /* Resume from where the clip was rather than restarting: pausing and
       playing should not rewind. */
    const offset = tRef.current;

    const tick = (now) => {
      if (start === null) start = now;
      const elapsed = (now - start) / 1000 + offset;
      const frame = Math.floor(elapsed * FPS);
      if (frame !== lastDrawn) {
        lastDrawn = frame;
        setT(elapsed % REEL_DURATION);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  if (!reel) return null;

  /* Reduced motion gets the outcome frame — the one that carries the fact the
     clip exists to deliver — rather than a blank box or a frozen first frame. */
  const frameT = reduced ? 12.4 : t;
  const progress = (frameT / REEL_DURATION) * 100;

  return (
    <figure className="reel" ref={hostRef}>
      {/* The ground colour is the product's own, sampled from the live site —
          a clip in the portfolio's palette tells you nothing about what the
          thing actually looks like. */}
      <div
        className={`reel__stage${reel.dark ? ' reel__stage--dark' : ''}`}
        style={reel.bg ? { background: reel.bg } : undefined}
      >
        <svg viewBox="0 0 640 360" role="img" aria-label={`${label} — a short motion summary of the project`}>
          <ReelFrame t={frameT} reel={reel} />
        </svg>

        {!reduced && (
          <button
            type="button"
            className="reel__hold"
            onClick={() => setHeld((h) => !h)}
            aria-pressed={held}
          >
            <span className="sr-only">{held ? 'Play the clip' : 'Pause the clip'}</span>
          </button>
        )}
      </div>

      <div className="reel__track" aria-hidden="true">
        <span className="reel__bar" style={{ width: `${progress}%` }} />
      </div>
    </figure>
  );
}
