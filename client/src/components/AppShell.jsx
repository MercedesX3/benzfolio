'use client';

import { usePathname } from 'next/navigation';
import './App.css';
import { DarkModeProvider } from '../contexts/DarkModeContext';
import { Analytics } from '@vercel/analytics/react';
import Header from './Header';
import Footer from './Footer';
import CursorFollower from './CursorFollower';

function pageFromPath(pathname) {
  if (pathname === '/work') return 'Work';
  if (pathname === '/playground') return 'Playground';
  if (pathname === '/about') return 'About';
  return 'Home';
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const currentPage = pageFromPath(pathname);
  const isHomePage = currentPage === 'Home';

  return (
    <DarkModeProvider>
      <div id="root">
        <div className="app-container">
          <CursorFollower />
          <Header />
          <main
            className={`main-content ${isHomePage ? 'main-content--home' : ''} ${currentPage === 'Playground' ? 'playground-scrollable' : ''} ${currentPage === 'About' ? 'about-scrollable' : ''}`}
          >
            {children}
          </main>
          {!isHomePage && <Footer />}
          {isHomePage && (
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 3 }}>
              <Footer />
            </div>
          )}
        </div>
      </div>
      <Analytics />
    </DarkModeProvider>
  );
}
