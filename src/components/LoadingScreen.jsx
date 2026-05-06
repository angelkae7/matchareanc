import { useEffect, useState } from 'react';

export default function LoadingScreen({ onLoadingComplete }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Attendre un peu puis afficher le contenu avec animation
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // Complèter le chargement après 2.5 secondes
    const completeTimer = setTimeout(() => {
      onLoadingComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div className="screen screen-loading">
      <div className={`loading-container ${showContent ? 'show' : ''}`}>
        
        <div className="loading-logo">
          <img src="/kagu-logo.svg" alt="logo MatchAreaNC" />
          <div className="loading-title">
            <span className="black">Match</span><span className="orange">AreaNC</span>
          </div>
          <span className="loading-author" >Kagu by angelkael © 2026</span>
        </div>
      </div>
    </div>
  );
}
