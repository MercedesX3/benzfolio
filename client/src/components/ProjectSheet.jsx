'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { lockScroll } from '../lib/scroll';
import './ProjectSheet.css';

/**
 * The case study, as a sheet that slides up over the page.
 *
 * The sheet stays mounted so it can animate both ways; `item` going null
 * starts the exit. The last item is held in state for the length of that
 * transition, otherwise the content would blank out before the sheet has
 * finished sliding down.
 */
export default function ProjectSheet({ item, onClose }) {
  const [shown, setShown] = useState(item);
  const closeRef = useRef(null);
  const bodyRef = useRef(null);
  const isOpen = Boolean(item);

  // Adjusting state during render rather than in an effect: React re-renders
  // immediately with the new item, without the extra committed frame an
  // effect would cost.
  if (item && item !== shown) setShown(item);

  useEffect(() => {
    if (!isOpen) return undefined;

    lockScroll(true);
    // Reopening should start at the top of the case study, not wherever the
    // last one was left scrolled to.
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    closeRef.current?.focus();

    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);

    return () => {
      lockScroll(false);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`sheet ${isOpen ? 'is-open' : ''}`}>
      <div className="sheet__scrim" onClick={onClose} aria-hidden="true" />

      <div
        className="sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-label={shown ? `${shown.name} — case study` : undefined}
        aria-hidden={!isOpen}
      >
        <header className="sheet__bar">
          <div className="sheet__id">
            <span className="sheet__num sign">{shown?.n}</span>
            <span className="sheet__name display">{shown?.name}</span>
            <span className="sheet__kind">{shown?.kind}</span>
          </div>

          <button
            type="button"
            className="sheet__close"
            onClick={onClose}
            ref={closeRef}
            tabIndex={isOpen ? 0 : -1}
          >
            Close ✕
          </button>
        </header>

        {/* data-lenis-prevent: Lenis is stopped while the sheet is open, and
            would otherwise swallow the wheel events this panel needs. */}
        <div className="sheet__body" ref={bodyRef} data-lenis-prevent>
          {shown && (
            <>
              <div className="sheet__cover">
                {shown.image && (
                  <Image
                    src={shown.image}
                    alt={`${shown.name} cover`}
                    width={1200}
                    height={514}
                    sizes="100vw"
                    className="sheet__cover-img"
                  />
                )}
              </div>

              <div className="sheet__content">
                <p className="sheet__blurb">{shown.blurb}</p>

                <ul className="chips">
                  {shown.stack.map((tech) => (
                    <li className="chip" key={tech}>
                      {tech}
                    </li>
                  ))}
                </ul>

                <p className="eyebrow sheet__steps-label">Build process</p>

                <ol className="sheet__steps">
                  {shown.steps.map((step, i) => (
                    <li className="sheet-step" key={step.title}>
                      <span className="sheet-step__num sign" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="sheet-step__title display">{step.title}</h3>
                        <p className="sheet-step__body">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="sheet__actions">
                  {shown.href &&
                    (shown.internal ? (
                      <Link
                        href={shown.href}
                        className="btn btn--primary"
                        tabIndex={isOpen ? 0 : -1}
                      >
                        {shown.linkLabel} →
                      </Link>
                    ) : (
                      <a
                        href={shown.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--primary"
                        tabIndex={isOpen ? 0 : -1}
                      >
                        {shown.linkLabel} →
                      </a>
                    ))}

                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={onClose}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    Back to work
                  </button>
                </div>

                <p className="sheet__hint">
                  Press Esc or click outside to close
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
