'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import './Header.css';

const LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/playground', label: 'Playground' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const pathname = usePathname();
  const closeMenu = () => setIsMenuOpen(false);

  // Back/forward while the drawer is open should dismiss it too.
  useEffect(() => {
    window.addEventListener('popstate', closeMenu);
    return () => window.removeEventListener('popstate', closeMenu);
  }, []);

  // Lock scroll (including Lenis) while the drawer is open.
  useEffect(() => {
    const lenis = window.__lenis;
    if (isMenuOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && closeMenu();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  return (
    <header className="header">
      {/* Bauhaus colour bar pinned to the top edge */}
      <div className="header__bar" aria-hidden="true">
        <i style={{ background: 'var(--red)' }} />
        <i style={{ background: 'var(--yellow)' }} />
        <i style={{ background: 'var(--blue)' }} />
      </div>

      <div className="header__inner">
        <Link href="/" className="logo" aria-label="Home">
          <span className="logo__mark" aria-hidden="true" />
          <span className="logo__text display">MX</span>
        </Link>

        <nav className="nav" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav__link ${pathname === link.href ? 'is-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/Mercedes_Xiong_Resume_Summer2026.pdf"
            className="nav__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
        </nav>

        <div className="header__right">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a href="mailto:mercedesx935@gmail.com" className="header__cta">
            Contact
          </a>

          <button
            type="button"
            className="icon-btn menu-toggle"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {/* data-lenis-prevent: Lenis blocks wheel events while stopped, which
          would stop the drawer scrolling on short screens. */}
      <div
        className={`drawer ${isMenuOpen ? 'is-open' : ''}`}
        hidden={!isMenuOpen}
        data-lenis-prevent
      >
        <nav className="drawer__nav" aria-label="Mobile">
          {LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="drawer__link display"
              style={{ '--i': i }}
              onClick={closeMenu}
            >
              <span className="drawer__num">0{i + 1}</span>
              {link.label}
            </Link>
          ))}
          <a
            href="/Mercedes_Xiong_Resume_Summer2026.pdf"
            className="drawer__link display"
            target="_blank"
            rel="noopener noreferrer"
            style={{ '--i': 3 }}
            onClick={closeMenu}
          >
            <span className="drawer__num">04</span>
            Resume
          </a>
          <a
            href="mailto:mercedesx935@gmail.com"
            className="drawer__link display"
            style={{ '--i': 4 }}
            onClick={closeMenu}
          >
            <span className="drawer__num">05</span>
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
