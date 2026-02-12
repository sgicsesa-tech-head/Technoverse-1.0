import React, { useState } from 'react';
import './App.css';
import NetflixIntro from './components/NetflixIntro';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import CompetitionRow from './components/CompetitionRow';
import EventModal from './components/EventModal';
import { getEventsByCategory } from './data/events';

function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = getEventsByCategory();

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleFeaturedEventClick = () => {
    // Show the Web Design event (first technical event)
    setSelectedEvent(events.technical[0]);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="App">
      {!introComplete && <NetflixIntro onComplete={() => setIntroComplete(true)} />}
      {introComplete && (
        <>
          <Navbar />
          <Banner onRegister={handleFeaturedEventClick} />
          <div id='events' className="competitions-container">
            <CompetitionRow
              id='technical' 
              title="Technical Competitions" 
              competitions={events.technical} 
              onEventClick={handleEventClick}
            />
            <CompetitionRow 
              id='non-technical'
              title="Non-Technical Competitions" 
              competitions={events.nonTechnical}
              onEventClick={handleEventClick}
            />
            <CompetitionRow 
              id='esports'
              title="E-Sports Competitions" 
              competitions={events.esports}
              onEventClick={handleEventClick}
            />
            {/* <CompetitionRow 
              id='funGames'
              title="Fun & Games" 
              competitions={events.funGames}
              onEventClick={handleEventClick}
            /> */}
          </div>
          {selectedEvent && (
            <EventModal event={selectedEvent} onClose={handleCloseModal} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
