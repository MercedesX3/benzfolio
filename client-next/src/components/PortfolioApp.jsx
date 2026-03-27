'use client';

import { useEffect, useState } from 'react';
import './App.css';
import { DarkModeProvider } from '../contexts/DarkModeContext';
import { Analytics } from '@vercel/analytics/react';
import Header from './Header';
import Footer from './Footer';
import Playground from './Playground';
import HomePage from './HomePage';
import WorkPage from './WorkPage';
import AboutPage from './AboutPage';
import CursorFollower from './CursorFollower';

export default function PortfolioApp() {
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash.slice(1) || 'Home');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderContent = () => {
    const isWorkPage = currentPage === 'Work';
    const isHomePage = currentPage === 'Home' || currentPage === '';

    return (
      <>
        {isHomePage && <HomePage isVisible={true} />}
        {currentPage === 'Playground' && <Playground />}
        {isWorkPage && <WorkPage />}
        {currentPage === 'About' && <AboutPage />}
      </>
    );
  };

  const isHomePage = currentPage === 'Home' || currentPage === '';

  return (
    <DarkModeProvider>
      <div id="root">
        <div className="app-container">
          <CursorFollower />
          <Header />
          <main
            className={`main-content ${currentPage === 'Playground' ? 'playground-scrollable' : ''} ${currentPage === 'About' ? 'about-scrollable' : ''}`}
          >
            {renderContent()}
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
