import Link from 'next/link';
import { DISCLAIMER, EMAIL, RESUME, SECTIONS, SOCIALS } from '../data/site';
import './Footer.css';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="checker-wipe" style={{ '--h': '44px' }} aria-hidden="true" />

      <div className="footer__inner page-shell">
        <div>
          <p className="footer__logo display">MX</p>
          <p className="footer__note">Full-stack developer · Dallas, TX</p>
          <div className="footer__socials">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          {SECTIONS.map((section) => (
            <Link key={section.id} href={`/#${section.id}`} className="footer__link">
              {section.label}
            </Link>
          ))}
          <a
            href={RESUME}
            className="footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <a href={`mailto:${EMAIL}`} className="footer__link">
            Contact
          </a>
        </nav>

        <div className="footer__disclaimer">
          <p className="eyebrow">Disclaimer</p>
          <p className="footer__text">{DISCLAIMER}</p>
          <p className="footer__copy">© {YEAR} Mercedes Xiong</p>
        </div>
      </div>
    </footer>
  );
}
