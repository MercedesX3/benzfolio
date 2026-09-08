'use client';

import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import useReveal from '../hooks/useReveal';
import Header from './Header';
import Footer from './Footer';
import SmoothScroll from './SmoothScroll';

/**
 * App frame.
 *
 * The home page is the flat-lay: one fixed composition that fills the viewport
 * and does not scroll. Header, footer and smooth-scroll all belong to
 * documents, so '/' opts out of every one of them. Project pages keep the
 * normal frame.
 */
export default function AppShell({ children }) {
  const pathname = usePathname();
  const isFlatLay = pathname === '/';

  useReveal();

  return (
    <>
      {!isFlatLay && <SmoothScroll />}
      <div className="app-container">
        {!isFlatLay && <Header />}
        <main className="main-content" key={pathname}>
          {children}
        </main>
        {!isFlatLay && <Footer />}
      </div>
      <Analytics />
    </>
  );
}
