import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../assets/technoverse_logo.png';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <img src={logo} alt="Technoverse" className="logo" />
      </div>
      <div className="navbar-center">
      <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#technical">Technical</a></li>
          <li><a href="#non-technical">Non-Technical</a></li>
        </ul>
        </div>
      <div className="navbar-right">
        <button className="nav-btn">Register</button>
      </div>
    </nav>
  );
}

export default Navbar;
