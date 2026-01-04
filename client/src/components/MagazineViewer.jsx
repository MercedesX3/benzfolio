import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import './MagazineViewer.css';

const MagazineViewer = ({ magazine, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 400); // Match animation duration
  };

  if (!magazine) return null;

  return (
    <div 
      className={`magazine-viewer-overlay ${isClosing ? 'closing' : ''}`} 
      onClick={handleClose}
    >
      <div 
        className={`magazine-viewer-container ${isClosing ? 'slide-down' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="magazine-viewer-close" 
          onClick={handleClose}
          aria-label="Close project details"
        >
          <X size={32} />
        </button>
        
        <div className="magazine-viewer-content">
          <div className="project-details">
            <div className="project-section">
              <h2 className="section-title">Context of the Project</h2>
              <p className="section-text">
                {magazine.context || 'This project was developed to address a specific need in the market. The goal was to create a solution that would improve user experience and provide value to our target audience.'}
              </p>
            </div>

            <div className="section-divider"></div>

            <div className="project-section">
              <h2 className="section-title">Tech Stack</h2>
              <p className="section-text">
                {magazine.techStack || 'The project was built using modern web technologies including React for the frontend, Node.js for the backend, and various other tools and libraries to ensure optimal performance and user experience.'}
              </p>
            </div>

            <div className="section-divider"></div>

            <div className="project-section">
              <h2 className="section-title">Solution Overview</h2>
              <p className="section-text">
                {magazine.solutionOverview || 'The solution provides a comprehensive approach to solving the identified problem. It includes key features and functionalities that address user needs while maintaining a clean and intuitive interface.'}
              </p>
            </div>

            <div className="section-divider"></div>

            <div className="project-section">
              <h2 className="section-title">Solution Impact</h2>
              <p className="section-text">
                {magazine.solutionImpact || 'The implementation of this solution has resulted in significant improvements in user engagement, efficiency, and overall satisfaction. The project has achieved its intended goals and continues to provide value to users.'}
              </p>
            </div>

            <div className="section-divider"></div>

            <div className="project-section">
              <h2 className="section-title">Design Outcome</h2>
              <p className="section-text">
                {magazine.designOutcome || 'The design focuses on creating a visually appealing and user-friendly experience. Through careful consideration of user needs and modern design principles, we achieved a clean and professional aesthetic that enhances usability.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineViewer;

