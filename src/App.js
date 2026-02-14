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

function App() {
  // Set to true to skip intro during development
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div className="App">
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
