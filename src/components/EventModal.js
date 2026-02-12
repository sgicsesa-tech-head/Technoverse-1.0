import React, { useEffect } from 'react';
import './EventModal.css';

function EventModal({ event, onClose }) {
  useEffect(() => {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-hero" style={{ backgroundImage: `url(${event.image})` }}>
          <div className="modal-hero-gradient"></div>
          <div className="modal-hero-content">
            <h1 className="modal-title">{event.title}</h1>
            <div className="modal-meta">
              {event.tags && event.tags.map((tag, index) => (
                <span key={index} className="modal-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-info">
            <div className="modal-actions">
              <button className="modal-btn modal-btn-play">
                <span>▶</span> Register Now
              </button>
              <button className="modal-btn modal-btn-secondary">
                <span>+</span> Add to Watchlist
              </button>
            </div>

            <div className="modal-details">
              <div className="modal-detail-row">
                <span className="modal-label">Category:</span>
                <span className="modal-value">{event.category}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-label">Time:</span>
                <span className="modal-value">{event.time}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-label">Venue:</span>
                <span className="modal-value">
                  {Array.isArray(event.venue) ? event.venue.join(', ') : event.venue}
                </span>
              </div>
              {event.capacity && (
                <div className="modal-detail-row">
                  <span className="modal-label">Capacity:</span>
                  <span className="modal-value">{event.capacity} participants</span>
                </div>
              )}
            </div>

            <p className="modal-description">{event.description}</p>

            <div className="modal-section">
              <h3 className="modal-section-title">Cast</h3>
              <div className="modal-cast">
                <span className="modal-label">Event Coordinators: </span>
                <span className="modal-cast-list">
                  {event.coordinators.join(', ')}
                </span>
              </div>
            </div>

            {event.rounds && event.rounds.length > 0 && (
              <div className="modal-section">
                <h3 className="modal-section-title">Episodes</h3>
                <div className="modal-episodes">
                  {event.rounds.map((round, index) => (
                    <div key={index} className="modal-episode">
                      <div className="episode-number">{index + 1}</div>
                      <div className="episode-info">
                        <h4 className="episode-title">{round}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.rules && event.rules.length > 0 && (
              <div className="modal-section">
                <h3 className="modal-section-title">Rules & Regulations</h3>
                <ul className="modal-rules">
                  {event.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventModal;
