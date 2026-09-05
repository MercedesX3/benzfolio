'use client';

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';
import { lockScroll } from '../lib/scroll';
import Duck from './Duck';
import './DuckIntro.css';

/**
 * The STOP → GO opener.
 *
 * A red panel holds the page while a duck waddles across it, then wipes up to
 * reveal green, which wipes away in turn. Four phases, driven by timers:
 *
 *   0  red panel, duck off-screen right
 *   1  duck walking left
 *   2  red slides up, green sits underneath
 *   3  green slides up
 *   4  done — the overlay unmounts
 *
 * It runs once per tab: a second visit within the session (a case study and
 * back, a refresh mid-read) skips straight to the page. Reduced-motion
 * visitors and anyone arriving on a deep link skip it too — an anchor should
 * land on its section, not behind a full-screen panel.
 */

const PHASES = [
  { at: 120, phase: 1 },
  { at: 2000, phase: 2 },
  { at: 2750, phase: 3 },
  { at: 3600, phase: 4 },
];

const SEEN_KEY = 'mx:intro-seen';

const readSeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    // Storage disabled — play the intro, it just won't be remembered.
    return false;
  }
};

const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* Nothing to do; the intro simply plays again next time. */
  }
};

/**
 * Whether the intro should play, as an external store.
 *
 * The answer depends on things the server cannot see (session storage, the
 * URL hash, a motion preference), so the server and the first client render
 * both say "no" and React swaps in the real answer — no hydration mismatch,
 * and no state assignment inside an effect. The result is memoised because
 * useSyncExternalStore requires a stable snapshot, and because the decision
 * should not change as the visitor moves around the site.
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

export default function DuckIntro() {
  const playing = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [phase, setPhase] = useState(0);
  const timers = useRef([]);

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase(4);
  }, []);

  useEffect(() => {
    // Recorded whether or not it plays, so the decision survives a reload.
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

  const isRunning = playing && phase < 4;

  // Hold the page still underneath, and let Escape out of it.
  useEffect(() => {
    if (!isRunning) return undefined;

    lockScroll(true);

    const onKey = (e) => e.key === 'Escape' && finish();
    document.addEventListener('keydown', onKey);

    return () => {
      lockScroll(false);
      document.removeEventListener('keydown', onKey);
    };
  }, [isRunning, finish]);

  if (!isRunning) return null;

  return (
    <div className="intro" role="presentation">
      <div className={`intro__panel intro__panel--stop ${phase >= 2 ? 'is-up' : ''}`}>
        <span className="intro__logo display">MX</span>
        <span className="intro__word sign">Stop</span>
        <div className={`intro__duck ${phase >= 1 ? 'is-walking' : ''}`}>
          <Duck size={78} />
        </div>
      </div>

      <div
        className={`intro__panel intro__panel--go ${phase >= 3 ? 'is-up' : ''} ${
          phase >= 2 ? 'is-in' : ''
        }`}
      >
        <span className="intro__logo display">MX</span>
        <span className="intro__word sign">Go</span>
      </div>

      {/* Once the panels start wiping away there is nothing left to skip. */}
      <button
        type="button"
        className="intro__skip"
        onClick={finish}
        hidden={phase >= 2}
      >
        Skip intro
      </button>
    </div>
  );
}
