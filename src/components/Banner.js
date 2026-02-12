import React from 'react';
import './Banner.css';

function Banner({ onRegister }) {
  return (
    <div className="banner">
      <div className="banner-content">
        <h1 className="banner-title">Technoverse 1.0</h1>
        <h2 className="banner-subtitle">Streaming the Future of Technology</h2>
        <p className="banner-description">
          Technoverse is designed as a Holistic Engagement Model. By integrating technical rigor with cultural and recreational events, we ensure maximum student participation while maintaining the high academic standards of the CSESA.
        </p>
        <div className="banner-info">
          <span className="banner-info-item">📅 13/02/2026 to 14/02/2026</span>
          <span className="banner-info-item">🕐 10:15 AM - 5:00 PM</span>
          <span className="banner-info-item">📍 SGI Campus</span>
        </div>
        <div className="banner-buttons">
          <button className="btn btn-primary" onClick={onRegister}>
            <span>▶</span> Register Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
