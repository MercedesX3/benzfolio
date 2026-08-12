'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { X, Github, Globe } from 'lucide-react';
import './MagazineViewer.css';

const SECTIONS = [
  { key: 'techStack', title: 'Tech stack', accent: 'blue' },
  { key: 'solutionOverview', title: 'Solution overview', accent: 'red' },
  { key: 'solutionImpact', title: 'Impact', accent: 'yellow' },
  { key: 'designOutcome', title: 'Design outcome', accent: 'blue' },
];

// Projects with a hero shot to show under the intro.
const HERO_SHOTS = {
  sage: '/project-pictures/SAGE-TRIPLE-OFFICIAL.png',
  lumina: '/project-pictures/LUMINA-EVENT-OFFICIAL.png',
};

export default function MagazineViewer({ magazine, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const panelRef = useRef(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    window.setTimeout(onClose, 320);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);

    // Lock both native scroll and Lenis while the overlay is up.
    const lenis = window.__lenis;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      lenis?.start();
      document.body.style.overflow = prevOverflow;
    };
  }, [handleClose]);

  if (!magazine) return null;

  const techStackItems = magazine.techStackItems || [];
  const heroShot = HERO_SHOTS[magazine.slug];
  const title =
    magazine.contextTitle || magazine.name || magazine.title?.replace(' Cover', '');

  return (
    <div
      className={`viewer ${isClosing ? 'is-closing' : ''}`}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className={`viewer__panel ${isClosing ? 'is-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${magazine.name} case study`}
        tabIndex={-1}
        ref={panelRef}
      >
        <div className="viewer__bar" aria-hidden="true">
          <i style={{ background: 'var(--red)' }} />
          <i style={{ background: 'var(--yellow)' }} />
          <i style={{ background: 'var(--blue)' }} />
        </div>

        <button
          type="button"
          className="viewer__close"
          onClick={handleClose}
          aria-label="Close case study"
        >
          <X size={22} />
        </button>

        {/* Lenis calls preventDefault() on every wheel event while stopped,
            which would kill native scrolling in here too. This attribute makes
            it ignore gestures inside the panel, so the case study scrolls
            while the page behind it stays frozen. */}
        <div className="viewer__scroll" data-lenis-prevent>
          <header className="viewer__head">
            <p className="eyebrow" style={{ '--mark': 'var(--red)' }}>
              {magazine.kicker || 'Case study'}
            </p>
            <h2 className="viewer__title display">{title}</h2>
            <p className="viewer__intro">{magazine.context}</p>

            {techStackItems.length > 0 && (
              <ul className="chips viewer__chips">
                {techStackItems.map((tech) => (
                  <li className="chip" key={tech}>
                    {tech}
                  </li>
                ))}
              </ul>
            )}

            {(magazine.github || magazine.website) && (
              <div className="viewer__links">
                {magazine.github && (
                  <a
                    href={magazine.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary"
                  >
                    <Github size={18} /> GitHub
                  </a>
                )}
                {magazine.website && (
                  <a
                    href={magazine.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--ghost"
                  >
                    <Globe size={18} /> Live site
                  </a>
                )}
              </div>
            )}
          </header>

          {heroShot && (
            <div className="viewer__shot">
              <Image
                src={heroShot}
                alt={`${magazine.name} interface`}
                width={1200}
                height={800}
                sizes="(max-width: 900px) 92vw, 880px"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          )}

          <div className="viewer__sections">
            {SECTIONS.filter((s) => magazine[s.key]).map((section) => (
              <section className="viewer__section" key={section.key}>
                <h3
                  className="viewer__section-title"
                  style={{ '--accent': `var(--${section.accent})` }}
                >
                  {section.title}
                </h3>
                <p className="viewer__section-text">{magazine[section.key]}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
