import React, { useState } from 'react';
import Banner from './Banner';
import Highlights from './Highlights';
import CompetitionRow from './CompetitionRow';
import EventModal from './EventModal';
import { getEventsByCategory } from '../data/events';

function Home() {
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
    <>
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
      </div>
      <Highlights />
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default Home;