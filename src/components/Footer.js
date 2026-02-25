import React from 'react';
import './Footer.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import SGI from '../assets/sgi.png';
import CSESA from '../assets/csesa.svg';

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
            <a href="https://www.instagram.com/csesa_sgi/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://www.youtube.com/@SGICSESA/shorts" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <YouTubeIcon />
            </a>
            <a href="https://github.com/sgicsesa-tech-head" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <a href="https://www.linkedin.com/company/csesa-sgi/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href="https://x.com/CsesaSgi" target="_blank" rel="noopener noreferrer" aria-label="X">
              <XIcon />
            </a>
          </div>
        </div>
        <div className="footer-section footer-contact">
          <h4>Contact</h4>
          <p>Email:</p>
              <span>
             <a className='mail-link' href="mailto:sgi.csesa@sginstitute.in">sgi.csesa@sginstitute.in</a>
             </span>
              <p>or</p>
             <span>
            <a className='mail-link' href="mailto:technoverse.csesa@gmail.com">technoverse.csesa@gmail.com</a>
            </span>
          <p>Computer Science & Engineering Department, 'D' Block 3rd Floor</p>
          <p>Sanjay Ghodawat Institute</p>
          <p>Atigre, Maharashtra</p>
        </div>
        <div className="footer-section footer-organizers">
          <h4>Organizers</h4>
          <div className='social-links'>
            <img src={CSESA} alt="CSESA" className="organizer-logo" />
            <img src={SGI} alt="SGI" className="organizer-logo" />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Developed by Atharv Tambekar and the CSESA</p>
        <p>&copy; 2026 CSESA-SGI. All rights reserved. | Technoverse 1.0</p>
      </div>
    </footer>
  );
}

export default Footer;
