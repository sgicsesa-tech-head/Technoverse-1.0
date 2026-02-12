import React, { useState, useEffect, useRef } from 'react';
import './NetflixIntro.css';
import introSound from '../assets/introAudio.mp3';
import logo from '../assets/logo.jpeg';

function NetflixIntro({ onComplete }) {
  const [showIntro, setShowIntro] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef(null);

  const handleStart = () => {
    if (hasStarted) return;
    
    setHasStarted(true);
    
    // Play audio immediately
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
    
    // Start animation immediately
    setStartAnimation(true);
    
    // Complete intro after animation time
    setTimeout(() => {
      setShowIntro(false);
      onComplete();
    }, 6500); // 6.5s animation duration
  };

  if (!showIntro) return null;

  return (
    <div 
      className={`netflix-intro ${startAnimation ? 'animating' : ''}`}
      onClick={handleStart}
    >
      <div className="intro-background"></div>
      <div className="intro-logo">
        <img src={logo} alt="Technoverse" className="logo-image" />
      </div>
      {!hasStarted && (
        <div className="click-prompt">Click to begin</div>
      )}
      <audio ref={audioRef} preload="auto">
        <source src={introSound} type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default NetflixIntro;
