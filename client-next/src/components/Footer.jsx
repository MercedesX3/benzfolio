import { Briefcase, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <a href="#Work" className="footer-icon" aria-label="Work">
            <Briefcase size={20} />
          </a>
          <a 
            href="https://www.linkedin.com/in/mercedes-xiong" 
            className="footer-icon" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <span className="footer-text">Developed by Mercedes Xiong</span>
        </div>
        <div className="footer-right">
          <span className="footer-text">2025 @ Benzfolio</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

