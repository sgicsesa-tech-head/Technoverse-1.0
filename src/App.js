import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NetflixIntro from './components/NetflixIntro';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Timeline from './components/Timeline';

function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div className="App">
      {!introComplete && <NetflixIntro onComplete={() => setIntroComplete(true)} />}
      {introComplete && (
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/timeline" element={<Timeline />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
