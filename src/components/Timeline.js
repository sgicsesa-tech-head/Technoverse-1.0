import React, { useState } from 'react';
import './Timeline.css';
import { eventsData } from '../data/events';
import EventModal from './EventModal';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const days = eventsData.techfest_2026.days;

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Technical':
        return '#E50914';
      case 'Non-Technical':
        return '#00D9FF';
      case 'E-Sports':
        return '#FFD700';
      default:
        return '#b3b3b3';
    }
  };

  const parseTime = (timeStr) => {
    if (timeStr === 'TBD') return null;
    if (timeStr.includes('Late')) return '14:00'; // Default evening time
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (!match) return '12:00';
    
    let [, hours, minutes, period] = match;
    hours = parseInt(hours);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h1 className="timeline-title">Event Timeline</h1>
        <p className="timeline-subtitle">Techfest 2026 - Full Schedule</p>
      </div>

      {days.map((day, dayIndex) => (
        <div key={dayIndex} className="day-section">
          <div className="day-header">
            <h2 className="day-title">Day {day.day}</h2>
            <span className="day-date">
              {day.day === 1 ? 'February 13, 2026' : 'February 14, 2026'}
            </span>
          </div>

          <div className="timeline-track">
            {day.events.map((event, eventIndex) => {
              const startTime = parseTime(event.time);
              
              return (
                <div
                  key={event.id}
                  className="timeline-event"
                  onClick={() => handleEventClick(event)}
                  style={{
                    animationDelay: `${eventIndex * 0.1}s`
                  }}
                >
                  <div className="timeline-line">
                    <div 
                      className="timeline-dot"
                      style={{ background: getCategoryColor(event.category) }}
                    >
                      <div className="dot-pulse" style={{ background: getCategoryColor(event.category) }}></div>
                    </div>
                  </div>
                  
                  <div className="timeline-content">
                    <div 
                      className="event-card"
                      style={{ borderLeftColor: getCategoryColor(event.category) }}
                    >
                      <div className="event-time">
                        <AccessTimeIcon className="time-icon" />
                        <span>{event.time}</span>
                      </div>
                      
                      <h3 className="event-title">{event.title}</h3>
                      
                      <div className="event-meta">
                        <span 
                          className="event-category"
                          style={{ background: getCategoryColor(event.category) }}
                        >
                          {event.category}
                        </span>
                        {Array.isArray(event.venue) ? (
                          <span className="event-venue">
                            <LocationOnIcon style={{ fontSize: '0.875rem' }} />
                            {event.venue[0]} +{event.venue.length - 1}
                          </span>
                        ) : (
                          <span className="event-venue">
                            <LocationOnIcon style={{ fontSize: '0.875rem' }} />
                            {event.venue}
                          </span>
                        )}
                      </div>

                      <p className="event-description">{event.description}</p>

                      <div className="event-details">
                        <span className="event-detail">
                          <strong>Coordinators:</strong> {event.coordinators.join(', ')}
                        </span>
                        {event.capacity && (
                          <span className="event-detail">
                            <strong>Capacity:</strong> {event.capacity} participants
                          </span>
                        )}
                      </div>

                      <div className="event-tags">
                        {event.tags.map((tag, i) => (
                          <span key={i} className="tag">{tag}</span>
                        ))}
                      </div>

                      <button className="view-details-btn">
                        View Full Details →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default Timeline;
