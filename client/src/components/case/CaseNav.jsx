'use client';

import { Github, Linkedin } from 'lucide-react';
import { PILL_NAV } from '../../data/flatlay';
import { SOCIALS } from '../../data/site';

/**
 * The case study's nav.
 *
 * The same floating pill the deck uses — same links, same shape, same
 * translucent ground — rather than the older document header, which carried a
 * different set of links entirely (WORK, PLAYGROUND, RÉSUMÉ) and made a case
 * study feel like a different website from the one it opened out of.
 *
 * It sits at the top here instead of the bottom. On the deck the pill is a
 * control you reach for while looking at a fixed composition; on a page you
 * scroll, a floating bar over the bottom of the text is in the way of the
 * thing you are reading.
 */
const sectionPath = (id) => (id === 'home' ? '/' : `/${id}`);
const social = (label) => SOCIALS.find((s) => s.label === label)?.href;

export default function CaseNav() {
  return (
    <nav className="fl__pill cs__pill" aria-label="Primary">
      <a href={social('GitHub')} target="_blank" rel="noreferrer" className="fl__pill-icon" aria-label="GitHub">
        <Github size={22} />
      </a>

      {PILL_NAV.map((n) => (
        <a key={n.id} href={sectionPath(n.id)} className="fl__pill-link">
          {n.label}
        </a>
      ))}

      <a href={social('LinkedIn')} target="_blank" rel="noreferrer" className="fl__pill-icon" aria-label="LinkedIn">
        <Linkedin size={22} />
      </a>
    </nav>
  );
}
