import Link from 'next/link';
import { Linkedin, Github, Mail } from 'lucide-react';
import './Footer.css';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__bar" aria-hidden="true">
        <i style={{ background: 'var(--blue)' }} />
        <i style={{ background: 'var(--yellow)' }} />
        <i style={{ background: 'var(--red)' }} />
      </div>

      <div className="footer__inner">
        <div className="footer__col">
          <p className="footer__name display">Mercedes Xiong</p>
          <p className="footer__note">Full-stack developer · Dallas, TX</p>
        </div>

        <nav className="footer__links" aria-label="Footer">
          <Link href="/work" className="footer__link">
            Work
          </Link>
          <Link href="/playground" className="footer__link">
            Playground
          </Link>
          <Link href="/about" className="footer__link">
            About
          </Link>
        </nav>

        <div className="footer__social">
          <a
            href="mailto:mercedesx935@gmail.com"
            className="footer__icon"
            aria-label="Email Mercedes"
          >
            <Mail size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/mercedes-xiong"
            className="footer__icon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://github.com/MercedesX3"
            className="footer__icon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
        </div>
      </div>

      <div className="footer__base">
        <span>© {YEAR} Mercedes Xiong</span>
        <span>Built with Next.js &amp; Three.js</span>
      </div>
    </footer>
  );
}
