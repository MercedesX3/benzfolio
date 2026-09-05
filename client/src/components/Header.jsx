'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { lockScroll, scrollToHash } from '../lib/scroll';
import { EMAIL, RESUME, SECTIONS } from '../data/site';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Back/forward while the drawer is open should dismiss it too.
  useEffect(() => {
    window.addEventListener('popstate', closeMenu);
    return () => window.removeEventListener('popstate', closeMenu);
  }, [closeMenu]);

  useEffect(() => {
    lockScroll(isMenuOpen);
    return () => lockScroll(false);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && closeMenu();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMenuOpen, closeMenu]);

  // On the home page these are anchors, so scroll through Lenis rather than
  // letting the browser jump. Anywhere else, fall through to the router.
  const onSectionClick = (e, hash) => {
    closeMenu();
    if (scrollToHash(hash)) e.preventDefault();
  };

  return (
    <>
      <header className="header">
        <div className="header__inner page-shell">
          <Link href="/" className="header__logo display" aria-label="Home">
            MX
          </Link>

          <nav className="header__nav" aria-label="Primary">
            {SECTIONS.map((section) => (
              <Link
                key={section.id}
                href={`/#${section.id}`}
                className="header__link"
                onClick={(e) => onSectionClick(e, `#${section.id}`)}
              >
                {section.label}
              </Link>
            ))}
            <a
              href={RESUME}
              className="header__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
          </nav>

          <div className="header__right">
            <a href={`mailto:${EMAIL}`} className="header__cta">
              Contact
            </a>

            <button
              type="button"
              className="header__toggle"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer.
          Rendered outside <header>: the header's backdrop-filter makes it a
          containing block, which would pin this fixed layer to the header
          instead of the viewport.
          data-lenis-prevent: Lenis blocks wheel events while stopped, which
          would stop the drawer scrolling on short screens. */}
      <div
        className={`drawer ${isMenuOpen ? 'is-open' : ''}`}
        hidden={!isMenuOpen}
        data-lenis-prevent
      >
        <nav className="drawer__nav" aria-label="Mobile">
          {SECTIONS.map((section, i) => (
            <Link
              key={section.id}
              href={`/#${section.id}`}
              className="drawer__link display"
              style={{ '--i': i }}
              onClick={(e) => onSectionClick(e, `#${section.id}`)}
            >
              <span className="drawer__num sign">0{i + 1}</span>
              {section.label}
            </Link>
          ))}
          <a
            href={RESUME}
            className="drawer__link display"
            target="_blank"
            rel="noopener noreferrer"
            style={{ '--i': SECTIONS.length }}
            onClick={closeMenu}
          >
            <span className="drawer__num sign">0{SECTIONS.length + 1}</span>
            Resume
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="drawer__link display"
            style={{ '--i': SECTIONS.length + 1 }}
            onClick={closeMenu}
          >
            <span className="drawer__num sign">0{SECTIONS.length + 2}</span>
            Contact
          </a>
        </nav>
      </div>
    </>
  );
}
