'use client';

import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import useReveal from '../hooks/useReveal';
import { SECTIONS } from '../data/sections';
import Header from './Header';
import Footer from './Footer';
import SmoothScroll from './SmoothScroll';

/**
 * App frame.
 *
 * The flat-lay is one fixed composition that fills the viewport and does not
 * scroll. Header, footer and smooth-scroll all belong to documents, so it opts
 * out of every one of them. Project pages keep the normal frame.
 *
 * It is not just '/' any more: each deck section is its own URL (/projects,
 * /about), and all of them are the same composition. Miss one here and it
 * renders with a document header stacked on top of a fixed, unscrollable
 * page.
 */
const DECK_PATHS = new Set([
  '/',
  ...SECTIONS.filter((s) => s.id !== 'home').map((s) => `/${s.id}`),
]);

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isFlatLay = DECK_PATHS.has(pathname);

  useReveal();

  return (
    <>
      {!isFlatLay && <SmoothScroll />}
      <div className="app-container">
        {!isFlatLay && <Header />}
        {/* One key for the whole deck, not the pathname. The nav moves
            between sections with history.pushState, which App Router reflects
            in usePathname — so keying on the pathname would change the key
            mid-slide, remount <main>, and take the Deck's state and its
            in-flight animation with it. */}
        <main className="main-content" key={isFlatLay ? 'deck' : pathname}>
          {children}
        </main>
        {!isFlatLay && <Footer />}
      </div>
      <Analytics />
    </>
  );
}
