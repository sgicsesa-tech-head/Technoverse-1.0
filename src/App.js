import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NetflixIntro from './components/NetflixIntro';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Timeline from './components/Timeline';
import RegistrationForm from './components/RegistrationForm';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// ── Maintenance Banner ────────────────────────────────────────────────────────
// Set MAINTENANCE_MODE to false to remove the popup when the site is back up.
const MAINTENANCE_MODE = false;

function MaintenancePopup() {
  if (!MAINTENANCE_MODE) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.85)',
      zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#1a1a2e',
        border: '2px solid #e50914',
        borderRadius: '12px',
        padding: '48px 40px',
        maxWidth: '460px', width: '90%',
        textAlign: 'center',
        boxShadow: '0 0 40px rgba(229,9,20,0.4)',
        color: '#fff',
        fontFamily: 'inherit',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
        <h2 style={{ color: '#e50914', fontSize: '1.6rem', marginBottom: '16px', letterSpacing: '1px' }}>
          Website is Down
        </h2>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#ccc', marginBottom: '24px' }}>
          We'll be back up within <strong style={{ color: '#fff' }}>30 minutes</strong>.
          <br />
          Sorry for the inconvenience!
          <br />Thank you for your cooperation! 😊
        </p>
        <div style={{
          display: 'inline-block',
          background: '#e50914',
          color: '#fff',
          borderRadius: '6px',
          padding: '8px 20px',
          fontSize: '0.85rem',
          letterSpacing: '1px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}>
          — Team Technoverse
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  // Set to true to skip intro during development
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div className="App">
      <MaintenancePopup />
      <Router>
        <ScrollToTop />
        {!introComplete && <NetflixIntro onComplete={() => setIntroComplete(true)} />}
        {introComplete && (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/register" element={<RegistrationForm />} />
            </Routes>
            <Footer />
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
