'use client';

import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import useReveal from '../hooks/useReveal';
import Header from './Header';
import Footer from './Footer';
import SmoothScroll from './SmoothScroll';

export default function AppShell({ children }) {
  const pathname = usePathname();
  useReveal();

  return (
    <>
      <SmoothScroll />
      <div className="app-container">
        <Header />
        <main className="main-content" key={pathname}>
          {children}
        </main>
        <Footer />
      </div>
      <Analytics />
    </>
  );
}
