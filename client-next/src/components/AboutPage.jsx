import { useEffect, useState, useRef } from 'react';
import { Instagram } from 'lucide-react';
import './AboutPage.css';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const shelfRef = useRef(null);
  const communitiesRef = useRef(null);
  const [shelfVisible, setShelfVisible] = useState(false);
  const [communitiesVisible, setCommunitiesVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observers = [];

    // Set initial visibility after a short delay to ensure DOM is ready
    setTimeout(() => {
      if (shelfRef.current) {
        const shelfObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setShelfVisible(true);
              }
            });
          },
          { threshold: 0.1, rootMargin: '100px' }
        );
        shelfObserver.observe(shelfRef.current);
        observers.push(shelfObserver);
      }

      if (communitiesRef.current) {
        const communitiesObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setCommunitiesVisible(true);
              }
            });
          },
          { threshold: 0.1, rootMargin: '100px' }
        );
        communitiesObserver.observe(communitiesRef.current);
        observers.push(communitiesObserver);
      }
    }, 100);

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const books = [
    { title: "Animal Farm", cover: "/book-covers/AnimalFarm.jpeg" },
    { title: "Atmosphere", cover: "/book-covers/Atmosphere.jpg" },
    { title: "Hamnet", cover: "/book-covers/Hamnet.jpg" },
    { title: "House Cerulean Sea", cover: "/book-covers/HouseCeruleanSea.jpg" },
    { title: "Lovely War", cover: "/book-covers/LovelyWar.jpg" },
    { title: "Seven Husbands", cover: "/book-covers/SevenHusbands.jpg" },
    { title: "This Is How You Lose The Time War", cover: "/book-covers/ThisIsHowYouLoseTheTimeWar.jpg" },
  ];

  const music = [
    { title: "Ariana Grande", cover: "/Album-covers/ArianaGrande.jpg" },
    { title: "Have You Ever Seen The Rain", cover: "/Album-covers/HaveYouEverSeenTheRain.jpeg" },
    { title: "Novo Amor", cover: "/Album-covers/NovoAmor.jpg" },
    { title: "Stick Season", cover: "/Album-covers/StickSeason.jpg" },
    { title: "The Night We Met", cover: "/Album-covers/TheNightWeMet.jpg" },
  ];

  const communityPhotos = [
    { src: "/Community/Community Photos/100_0173.jpeg", caption: "ACM Peechi Night" },
    { src: "/Community/Community Photos/DSC09356.JPG", caption: "Spring 2026 Kickoff" },
    { src: "/Community/Community Photos/DSC09698.JPG", caption: "Spring 2026 Board" },
    { src: "/Community/Community Photos/f25 eos-34.JPG", caption: "ACM Campus @ EOS" },
  ];

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-image-wrapper">
          <img
            src="/about_pic.JPG"
            alt="Mercedes Xiong"
            className={`about-image ${isVisible ? 'fade-in' : ''}`}
          />
        </div>
        <div className="about-content">
          <p className={`about-text ${isVisible ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
            Hi! Thank's so much for coming to check me out! My name is Mercedes Xiong, a current CS major @UTD and an aspiring full stack developer!
          </p>
          <p className={`about-text ${isVisible ? 'fade-in' : ''}`} style={{ animationDelay: '0.4s' }}>
            I love trying to understand how companies compartmentalize their information on websites and apps and believe that life is greater with hash tables (most of the time)
          </p>
          <p className={`about-text ${isVisible ? 'fade-in' : ''}`} style={{ animationDelay: '0.6s' }}>
            In my free time, you can find me reading, sketching buildings, or listening to indie music or the 80s or 70s or 60s (the list goes on and on).
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="about-divider"></div>

      {/* Shelf Section */}
      <div className="about-sections-container">
        <div ref={shelfRef} className={`shelf-section ${shelfVisible ? 'fade-in-section' : ''}`}>
          <div className="shelf-content">
            {/* Books Section */}
            <div className="shelf-category">
              <div className="shelf-header">
                <h2 className="shelf-title">Books <span className="shelf-count">(7)</span></h2>
                <a href="https://www.goodreads.com/user/show/124363498-mjx-xjm" target="_blank" rel="noopener noreferrer" className="external-link">
                  Goodreads <span className="external-icon">↗</span>
                </a>
              </div>
              <div className="shelf-grid">
                {books.map((book, index) => (
                  <div key={index} className={`shelf-item shelf-item-book ${shelfVisible ? 'fade-in-item' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                    <img src={book.cover} alt={book.title} className="shelf-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Music Section */}
            <div className="shelf-category">
              <div className="shelf-header">
                <h2 className="shelf-title">Music <span className="shelf-count">(5)</span></h2>
                <a href="https://open.spotify.com/user/qx3ln2174vntd3mrddj604qxx?si=dd63669d32f747ea" target="_blank" rel="noopener noreferrer" className="external-link">
                  Spotify <span className="external-icon">↗</span>
                </a>
              </div>
              <div className="shelf-grid">
                {music.map((album, index) => (
                  <div key={index} className={`shelf-item shelf-item-music ${shelfVisible ? 'fade-in-item' : ''}`} style={{ animationDelay: `${(books.length + index) * 0.1}s` }}>
                    <img src={album.cover} alt={album.title} className="shelf-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Communities Section */}
        <div ref={communitiesRef} className={`communities-section ${communitiesVisible ? 'fade-in-section' : ''}`}>
          <h2 className="communities-title">My Communities</h2>
          <p className="communities-subtitle">All people at root are time optimists. We always think there's enough time to do things with other people. Time to say things to them. And then something happens and then we stand there holding on to words like 'if'. ♥</p>

          <div className="communities-content">
            <div className="community-info">
              <div className="community-header">
                <img src="/Community/Peechi LOgo.png" alt="Pechi Logo" className="community-icon" />
                <h3 className="community-name">ACM @ UTD</h3>
                <a href="https://www.instagram.com/acmutd/?hl=en" target="_blank" rel="noopener noreferrer" className="community-social">
                  <Instagram size={20} className="social-icon" />
                </a>
              </div>
              <p className="community-description">
                I'm the vice president of ACM @ UTD, helping to build a supportive community for students to learn and grow in tech. We have over 180+ officers, 9 divisions, and 200+ members, all dedicated to creating fun workshops and events for the community.
              </p>
            </div>
          </div>

          <div className="community-photos">
            {communityPhotos.map((photo, index) => (
              <div key={index} className={`community-photo-wrapper ${communitiesVisible ? 'fade-in-item' : ''}`} style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="community-photo-frame">
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className={`community-photo ${photo.caption === 'Community Gathering' ? 'community-gathering-photo' : ''}`}
                  />
                </div>
                <p className="community-photo-caption">{photo.caption}</p>
              </div>
            ))}
          </div>

          <p className="community-footer-text">
            Interested in joining <span className="community-link-text">ACM @ UTD</span> or want to learn more? Email <span className="community-link-text">contact@acmutd.co</span> or head to our website <a href="https://acmutd.co/" target="_blank" rel="noopener noreferrer" className="community-link-text community-link">acmutd.co</a>!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

