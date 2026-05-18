import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Github, Globe } from 'lucide-react';
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

  const techStackItems = magazine.techStackItems || [];

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
            <div className="project-section context-section">
              <div className="context-header">
                <h2 className="context-title">
                  {magazine.contextTitle || magazine.title?.replace(' Cover', '') || 'Context of the Project'}
                </h2>
                <div className="context-content">
                  <p className="context-text">
                    {magazine.context || 'This project was developed to address a specific need in the market. The goal was to create a solution that would improve user experience and provide value to our target audience.'}
                  </p>
                  {techStackItems.length > 0 && (
                    <div className="tech-stack-buttons">
                      {techStackItems.map((tech, index) => (
                        <span key={index} className="tech-stack-button">{tech}</span>
                      ))}
                    </div>
                  )}
                  {(magazine.github || magazine.website) && (
                    <div className="project-links">
                      {magazine.github && (
                        <a
                          href={magazine.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link github-link"
                        >
                          <Github size={20} />
                          <span>GitHub</span>
                        </a>
                      )}
                      {magazine.website && (
                        <a
                          href={magazine.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link website-link"
                        >
                          <Globe size={20} />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {(magazine.title?.toLowerCase().includes('sage') || magazine.id === 1) && (
                <div className="sage-image-container">
                  <Image
                    src="/project-pictures/SAGE-TRIPLE-OFFICIAL.png"
                    alt="Sage Triple Official"
                    width={0}
                    height={0}
                    sizes="(max-width: 900px) 100vw, 900px"
                    style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                  />
                </div>
              )}
              {(magazine.title?.toLowerCase().includes('lumina') || magazine.id === 2) && (
                <div className="sage-image-container">
                  <Image
                    src="/project-pictures/LUMINA-EVENT-OFFICIAL.png"
                    alt="Lumina Event Official"
                    width={0}
                    height={0}
                    sizes="(max-width: 900px) 100vw, 900px"
                    style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                  />
                </div>
              )}
            </div>

            <div className="project-section">
              <h2 className="section-title">Tech Stack</h2>
              <p className="section-text">
                {magazine.techStack || 'The project was built using modern web technologies including React for the frontend, Node.js for the backend, and various other tools and libraries to ensure optimal performance and user experience.'}
              </p>
            </div>

            <div className="project-section">
              <h2 className="section-title">Solution Overview</h2>
              <p className="section-text">
                {magazine.solutionOverview || 'The solution provides a comprehensive approach to solving the identified problem. It includes key features and functionalities that address user needs while maintaining a clean and intuitive interface.'}
              </p>
            </div>

            <div className="project-section">
              <h2 className="section-title">Solution Impact</h2>
              <p className="section-text">
                {magazine.solutionImpact || 'The implementation of this solution has resulted in significant improvements in user engagement, efficiency, and overall satisfaction. The project has achieved its intended goals and continues to provide value to users.'}
              </p>
            </div>

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

