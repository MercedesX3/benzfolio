'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo" onClick={closeMenu}>
          <h1>MX</h1>
        </Link>
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link href="/work" className="nav-link" onClick={closeMenu}>
            Work
          </Link>
          <Link href="/playground" className="nav-link" onClick={closeMenu}>
            Playground
          </Link>
          <Link href="/about" className="nav-link" onClick={closeMenu}>
            About
          </Link>
          <a
            href="/Mercedes_Xiong_Resume_Summer2026.pdf"
            className="nav-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            Resume
          </a>
        </nav>
        <div className="header-right">
          <button
            type="button"
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <a href="mailto:mercedesx935@gmail.com" className="nav-link" onClick={closeMenu}>
            Contact
          </a>
          <button
            type="button"
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
