'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { lockScroll } from '../lib/scroll';
import './Welcome.css';

/**
 * The opener.
 *
 * A blue field; the paper plane draws its loop across it; "Welcome" appears;
 * the panel lifts away. Four phases on timers, then it unmounts entirely.
 *
 * The path is a raster PNG, not an SVG, so it cannot be stroke-dash animated.
 * It is drawn with an animated `clip-path` inset sweeping in from the right
 * instead — which produces the same left-to-right reveal, and because the plane
 * is baked into the end of the path image, the plane arrives exactly when the
 * line reaches it. No second element to keep in sync.
 *
 * It plays once per tab. A second visit inside the same session — a project
 * page and back, a refresh mid-read — goes straight to the desk, because an
 * intro you cannot skip past on every navigation stops being charming on the
 * third viewing. Deep links and reduced-motion visitors skip it too.
 */

const PHASES = [
  { at: 60, phase: 1 }, // path starts drawing
  { at: 1500, phase: 2 }, // "Welcome" fades up
  { at: 2600, phase: 3 }, // panel lifts
  { at: 3350, phase: 4 }, // unmount
];

const SEEN_KEY = 'mx:welcome-seen';

const readSeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* Storage disabled — it simply plays again next time. */
  }
};

/**
 * Whether the intro should play, as an external store.
 *
 * The answer depends on things the server cannot know (session storage, the
 * URL hash, a motion preference), so the server and the first client render
 * both answer "no" and React swaps in the real value — no hydration mismatch,
 * and no state assignment inside an effect.
 */
let shouldPlay = null;

const subscribe = () => () => {};
const getSnapshot = () => {
  if (shouldPlay === null) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    shouldPlay = !reduced && !window.location.hash && !readSeen();
  }
  return shouldPlay;
};
const getServerSnapshot = () => false;

export default function Welcome() {
  const playing = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [phase, setPhase] = useState(0);
  const timers = useRef([]);

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase(4);
  }, []);

  useEffect(() => {
    markSeen();
    if (!playing) return undefined;

    timers.current = PHASES.map(({ at, phase: next }) =>
      setTimeout(() => setPhase(next), at)
    );

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [playing]);

  const running = playing && phase < 4;

  useEffect(() => {
    if (!running) return undefined;
    lockScroll(true);
    const onKey = (e) => e.key === 'Escape' && finish();
    document.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      document.removeEventListener('keydown', onKey);
    };
  }, [running, finish]);

  if (!running) return null;

  return (
    <div className={`welcome ${phase >= 3 ? 'is-out' : ''}`} role="presentation">
      <div className="welcome__inner">
        <p className={`welcome__word hand ${phase >= 2 ? 'is-in' : ''}`}>Welcome</p>

        <div className={`welcome__path ${phase >= 1 ? 'is-drawn' : ''}`}>
          <Image
            src="/flatlay/plane-path.png"
            alt=""
            width={1335}
            height={514}
            priority
          />
        </div>
      </div>

      <button type="button" className="welcome__skip" onClick={finish} hidden={phase >= 3}>
        Skip
      </button>
    </div>
  );
}
