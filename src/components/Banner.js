import React from 'react';
import './Banner.css';

function Banner({ onRegister }) {
  return (
    <div className="banner">
      <div className="banner-content">
        <h1 className="banner-title">Technoverse 1.0</h1>
        <h2 className="banner-subtitle">SGIs biggest Techfest</h2>
        <p className="banner-description">
          Unleash your creativity in this ultimate web design challenge. Create stunning, responsive 
          websites that push the boundaries of modern design. Join 80+ participants in this 5-hour 
          marathon of innovation and artistry.
        </p>
        <div className="banner-info">
          <span className="banner-info-item">📅 Day 1</span>
          <span className="banner-info-item">🕐 11:00 AM - 4:00 PM</span>
          <span className="banner-info-item">📍 CC Lab</span>
        </div>
        <div className="banner-buttons">
          <button className="btn btn-primary" onClick={onRegister}>
            <span>▶</span> Register Now
          </button>
          <button className="btn btn-secondary" onClick={onRegister}>
            <span>ℹ</span> More Info
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
