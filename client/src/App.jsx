import { useState, useEffect } from 'react'
import './App.css'
import BookLoader from './components/BookLoader'
import Header from './components/Header'
import Footer from './components/Footer'
import Playground from './components/Playground'
import HomePage from './components/HomePage'
import WorkPage from './components/WorkPage'
import AboutPage from './components/AboutPage'
import CursorFollower from './components/CursorFollower'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isImagesLoading, setIsImagesLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState('')

  const handleLoaderComplete = () => {
    setIsLoading(false)
  }

  const handleImagesLoading = (loading) => {
    setIsImagesLoading(loading)
  }

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash.slice(1) || 'Home')
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  if (isLoading) {
    return <BookLoader onComplete={handleLoaderComplete} />
  }

  if (isImagesLoading) {
    return <BookLoader />
  }

  const renderContent = () => {
    const isWorkPage = currentPage === 'Work';
    const isHomePage = currentPage === 'Home' || currentPage === '';
    
    return (
      <>
        {isHomePage && <HomePage isVisible={true} />}
        {currentPage === 'Playground' && <Playground onImagesLoading={handleImagesLoading} />}
        {isWorkPage && <WorkPage />}
        {currentPage === 'About' && <AboutPage />}
      </>
    );
  }

  const isWorkPage = currentPage === 'Work';
  const isHomePage = currentPage === 'Home' || currentPage === '';
  
  return (
    <div className="app-container">
      <CursorFollower />
      <Header />
      <main 
        className={`main-content ${currentPage === 'Playground' ? 'playground-scrollable' : ''} ${currentPage === 'About' ? 'about-scrollable' : ''}`}
        style={{ 
          paddingTop: isWorkPage || currentPage === 'Playground' || currentPage === 'About' ? '80px' : '0', 
          background: '#ffffff', 
          color: '#000000' 
        }}
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
  )
}

export default App
