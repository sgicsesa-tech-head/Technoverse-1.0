import React from 'react';
import './Footer.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-about">
          <h4>About Technoverse 1.0</h4>
          <p>A Netflix-themed technical and cultural festival by CSESA-SGI</p>
          <p>Join us for an exciting blend of technology, creativity, and entertainment!</p>
        </div>
        <div className="footer-section footer-links">
          <h4>Connect With Us</h4>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <YouTubeIcon />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X">
              <XIcon />
            </a>
          </div>
        </div>
        <div className="footer-section footer-contact">
          <h4>Contact</h4>
          <p>Computer Science & Engineering Students Association</p>
          <p>Sanjay Ghodawat Institute</p>
          <p>Atigre, Maharashtra</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 CSESA-SGI. All rights reserved. | Technoverse 1.0</p>
      </div>
    </footer>
  );
}

export default Footer;
