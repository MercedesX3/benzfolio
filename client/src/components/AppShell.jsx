'use client';

import { usePathname } from 'next/navigation';
import './App.css';
import { DarkModeProvider } from '../contexts/DarkModeContext';
import { Analytics } from '@vercel/analytics/react';
import useReveal from '../hooks/useReveal';
import Header from './Header';
import Footer from './Footer';
import CursorFollower from './CursorFollower';
import SmoothScroll from './SmoothScroll';

export default function AppShell({ children }) {
  const pathname = usePathname();
  useReveal();

  return (
    <DarkModeProvider>
      <SmoothScroll />
      <div className="app-container">
        <CursorFollower />
        <Header />
        <main className="main-content" key={pathname}>
          {children}
        </main>
        <Footer />
      </div>
      <Analytics />
    </DarkModeProvider>
  );
}
