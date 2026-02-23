import React from 'react';
import './Banner.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
          <span className="banner-info-item"><CalendarMonthIcon fontSize="small" /> 02/03/2026 to 03/03/2026</span>
          <span className="banner-info-item"><AccessTimeIcon fontSize="small" /> 10:15 AM - 5:00 PM</span>
          <span className="banner-info-item"><LocationOnIcon fontSize="small" /> SGI Campus</span>
        </div>
        <div className="banner-buttons">
          <button className="btn" onClick={onRegister}>
            <PlayArrowIcon /> Register Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
