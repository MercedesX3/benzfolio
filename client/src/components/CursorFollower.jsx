'use client';

import { useEffect, useRef } from 'react';
import './CursorFollower.css';

/**
 * Bauhaus cursor: a solid dot that tracks exactly, plus a ring that lags
 * behind it and snaps to a square over interactive targets.
 *
 * Positions are written straight to the DOM inside rAF — the old version
 * called setState on every frame, which re-rendered React ~60x/second.
 */
export default function CursorFollower() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Touch devices keep their native behaviour; CSS hides the elements there,
    // and we skip wiring any listeners at all.
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const lagged = { ...target };
    let visible = false;
    let frame;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;

      if (!visible) {
        visible = true;
        lagged.x = target.x;
        lagged.y = target.y;
        dot.classList.add('is-visible');
        ring.classList.add('is-visible');
      }

      // Square up over anything clickable.
      const interactive = e.target?.closest?.(
        'a, button, [role="button"], input, textarea, select, summary'
      );
      ring.classList.toggle('is-active', Boolean(interactive));
    };

    const onLeave = () => {
      visible = false;
      dot.classList.remove('is-visible');
      ring.classList.remove('is-visible');
    };

    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');

    const tick = () => {
      lagged.x += (target.x - lagged.x) * 0.16;
      lagged.y += (target.y - lagged.y) * 0.16;

      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${lagged.x}px, ${lagged.y}px, 0) translate(-50%, -50%)`;

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
