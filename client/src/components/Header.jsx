import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.location.hash = '';
    closeMenu();
  };

  return (
    <header className="header">
      <div className="header-container">
        <a href="#" className="logo" onClick={handleLogoClick}>
          <h1>MX</h1>
        </a>
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <a href="#Work" className="nav-link" onClick={closeMenu}>Work</a>
          <a href="#Playground" className="nav-link" onClick={closeMenu}>Playground</a>
          <a href="#About" className="nav-link" onClick={closeMenu}>About</a>
          <a 
            href="/Mercedes_Xiong_Resume_Spring2026.pdf" 
            className="nav-link" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            Resume
          </a>
        </nav>
        <div className="header-right">
          <a href="mailto:mercedesx935@gmail.com" className="nav-link" onClick={closeMenu}>Contact</a>
          <button 
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


