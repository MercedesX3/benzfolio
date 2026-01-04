import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MagazineViewer from './MagazineViewer';
import './MagazineCarousel.css';

const MagazineCarousel = ({ magazines = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const isProcessingRef = useRef(false);

  // Default magazines if none provided
  const defaultMagazines = [
    { 
      id: 1, 
      title: 'Sage Cover', 
      image: '/magazine-covers/sage-cover.png',
      context: 'Sage is a project management platform designed to help teams collaborate more effectively. The project was initiated to address the growing need for streamlined communication and task management in remote work environments.',
      techStack: 'Built with React for the frontend, Node.js and Express for the backend API, MongoDB for data storage, and Socket.io for real-time collaboration features. Styled with Tailwind CSS and deployed on AWS.',
      solutionOverview: 'Sage provides a comprehensive solution with features including real-time task tracking, team chat, file sharing, and project analytics. The platform integrates seamlessly with popular tools like Slack and GitHub.',
      solutionImpact: 'Since launch, Sage has helped over 500 teams improve their project completion rates by 40%. User feedback indicates a 60% reduction in time spent on project coordination and a significant increase in team satisfaction.',
      designOutcome: 'The design emphasizes clarity and efficiency with a clean, modern interface. The color scheme uses calming greens and blues to create a focused work environment, while intuitive navigation ensures users can quickly access the features they need.'
    },
    { 
      id: 2, 
      title: 'Lumina Cover', 
      image: '/magazine-covers/lumina-cover.png',
      context: 'Lumina is a data visualization tool that transforms complex datasets into interactive, easy-to-understand visualizations. The project was created to help businesses make data-driven decisions more effectively.',
      techStack: 'Developed using D3.js for advanced data visualization, React for the user interface, Python Flask for backend processing, and PostgreSQL for data storage. The application uses WebGL for rendering large datasets efficiently.',
      solutionOverview: 'Lumina offers drag-and-drop functionality for creating custom dashboards, real-time data updates, and export capabilities to various formats. The platform supports multiple data sources including CSV, JSON, and database connections.',
      solutionImpact: 'Lumina has been adopted by 200+ companies, resulting in a 50% reduction in time spent analyzing data. Users report making faster, more informed decisions with the visual insights provided by the platform.',
      designOutcome: 'The design focuses on data clarity with a dark theme that reduces eye strain during long analysis sessions. Interactive elements are clearly highlighted, and the layout prioritizes the visualization space while keeping controls easily accessible.'
    },
    { 
      id: 3, 
      title: 'Archer Cover', 
      image: '/magazine-covers/archer-cover.png',
      context: 'The pocket spellbook of architecture - a living dictionary where blueprints meets vocabulary. Archer is built to allow users to browse terms based on category, era, or style. The visual collections that are built on archer are here to inspire useers with architectural examples, sketches, or reference images.',
      techStack: 'Built with Next.js for server-side rendering and SEO optimization, Stripe for payment processing, Shopify API for inventory management, and Redis for caching. The frontend uses React with styled-components for a cohesive design system.',
      solutionOverview: 'Archer features a comprehensive product catalog with advanced filtering, user reviews and ratings, wishlist functionality, and personalized recommendations. The platform includes a mobile-responsive design and fast checkout process.',
      solutionImpact: 'The platform has processed over $2M in sales in its first year, with a 35% increase in conversion rates compared to the previous system. Customer satisfaction scores have improved significantly, with 4.8/5 average rating.',
      designOutcome: 'The design captures the adventurous spirit of the brand with bold imagery and an earthy color palette. Product pages are designed to showcase gear effectively, with high-quality images and detailed specifications that help customers make informed decisions.'
    },
    { 
      id: 4, 
      title: 'Finterest Cover', 
      image: '/magazine-covers/finterest-cover.png',
      context: 'Finterest is a social finance app that helps users discover and share investment opportunities. The platform was created to democratize financial information and make investing more accessible to younger generations.',
      techStack: 'Developed using React Native for cross-platform mobile apps, Firebase for real-time data synchronization, Plaid API for secure financial data integration, and Node.js for backend services. Charts are rendered using Recharts library.',
      solutionOverview: 'Finterest provides users with investment insights, portfolio tracking, social features for sharing strategies, and educational content. The app includes real-time market data and personalized investment recommendations based on user preferences.',
      solutionImpact: 'Finterest has gained 10,000+ active users within 6 months of launch. Users report feeling more confident about investing, with 70% of users making their first investment through the platform. The app has helped users collectively invest over $5M.',
      designOutcome: 'The design uses a modern, clean aesthetic with a focus on financial data visualization. The color scheme incorporates trust-building blues and greens, while the interface prioritizes clarity and ease of use to make complex financial information approachable.'
    },
    { 
      id: 5, 
      title: 'Windle Cover', 
      image: '/magazine-covers/windle-cover.png',
      context: 'Windle is a weather forecasting application that provides hyperlocal weather predictions and alerts. The project was developed to give users more accurate, location-specific weather information than traditional weather apps.',
      techStack: 'Built with Vue.js for the frontend, Python with FastAPI for the backend, integration with multiple weather APIs for data aggregation, and machine learning models for prediction accuracy. The app uses Progressive Web App (PWA) technology for offline functionality.',
      solutionOverview: 'Windle offers minute-by-minute weather forecasts, severe weather alerts, customizable notifications, and detailed weather maps. The app learns from user preferences to provide personalized weather insights and recommendations.',
      solutionImpact: 'Windle has been downloaded over 50,000 times and maintains a 4.7/5 rating. Users report that the hyperlocal forecasts are 30% more accurate than other apps, helping them better plan outdoor activities and avoid weather-related disruptions.',
      designOutcome: 'The design emphasizes weather visualization with beautiful, dynamic backgrounds that reflect current conditions. The interface is intuitive and information-dense without feeling cluttered, using color coding and icons to quickly communicate weather status at a glance.'
    },
  ];

  const items = magazines.length > 0 ? magazines : defaultMagazines;

  const handlePrevious = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000); // Auto-rotate every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isProcessingRef.current) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        isProcessingRef.current = true;
        handlePrevious();
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 300);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        isProcessingRef.current = true;
        handleNext();
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [handlePrevious, handleNext]);

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <div className="magazine-carousel-container">
      <div className="magazine-carousel">
        <button 
          className="carousel-button carousel-button-prev" 
          onClick={handlePrevious}
          aria-label="Previous magazine"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="carousel-track">
          {items.map((magazine, index) => {
            const position = (index - currentIndex + items.length) % items.length;
            let transformClass = '';
            
            if (position === 0) {
              transformClass = 'center';
            } else if (position === 1 || (position === items.length - 1 && items.length > 2)) {
              transformClass = position === 1 ? 'right' : 'left';
            } else if (position === 2 || (position === items.length - 2 && items.length > 3)) {
              transformClass = position === 2 ? 'far-right' : 'far-left';
            } else {
              transformClass = 'hidden';
            }

            return (
              <div
                key={magazine.id || index}
                className={`carousel-item ${transformClass}`}
                style={{
                  '--index': index,
                  '--current': currentIndex,
                  '--total': items.length,
                }}
                onClick={() => setSelectedMagazine(magazine)}
              >
                <div className="magazine-card">
                  <img 
                    src={magazine.image} 
                    alt={magazine.title || `Magazine ${index + 1}`}
                    loading="lazy"
                  />
                  {magazine.title && (
                    <div className="magazine-title">{magazine.title}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button 
          className="carousel-button carousel-button-next" 
          onClick={handleNext}
          aria-label="Next magazine"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      <div className="carousel-dots">
        {items.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to magazine ${index + 1}`}
          />
        ))}
      </div>

      {selectedMagazine && (
        <MagazineViewer 
          magazine={selectedMagazine} 
          onClose={() => setSelectedMagazine(null)} 
        />
      )}
    </div>
  );
};

export default MagazineCarousel;

