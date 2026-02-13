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
              <span className="modal-tag">{event.category}</span>
              {event.netflixTheme && <span className="modal-tag">🎬 {event.netflixTheme}</span>}
              {event.entryType && <span className="modal-tag">{event.entryType}</span>}
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-info">
            <div className="modal-actions">
              <button className="modal-btn modal-btn-play">
                <span>▶</span> Register Now
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
              {event.entryFee && (
                <div className="modal-detail-row">
                  <span className="modal-label">Entry Fee:</span>
                  <span className="modal-value">{event.entryFee}</span>
                </div>
              )}
              {event.team_specs && (
                <div className="modal-detail-row">
                  <span className="modal-label">Team Specs:</span>
                  <span className="modal-value">{event.team_specs}</span>
                </div>
              )}
              {event.format && (
                <div className="modal-detail-row">
                  <span className="modal-label">Format:</span>
                  <span className="modal-value">{event.format}</span>
                </div>
              )}
            </div>

            <p className="modal-description">{event.description}</p>

            <div className="modal-section">
              <h3 className="modal-section-title">Cast</h3>
              <div className="modal-cast">
                <span className="modal-label">Event Coordinators:</span>
                <div className="modal-cast-list">
                  {event.coordinators.map((coordinator, index) => (
                    <div key={index} className="coordinator-item">
                      <div className="coordinator-name">{coordinator}</div>
                      {event.coordinatorPhones && event.coordinatorPhones[index] && (
                        <div className="coordinator-phone">📞 {event.coordinatorPhones[index]}</div>
                      )}
                    </div>
                  ))}
                </div>
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
                        <h4 className="episode-title">{round.name || `Round ${index + 1}`}</h4>
                        {round.focus && <p className="episode-desc">Focus: {round.focus}</p>}
                        {round.task && <p className="episode-desc">Task: {round.task}</p>}
                        {round.format && <p className="episode-desc">Format: {round.format}</p>}
                        {round.duration && <p className="episode-desc">Duration: {round.duration}</p>}
                        {round.goal && <p className="episode-desc">Goal: {round.goal}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.categories && event.categories.length > 0 && (
              <div className="modal-section">
                <h3 className="modal-section-title">Categories</h3>
                <div className="modal-episodes">
                  {event.categories.map((cat, index) => (
                    <div key={index} className="modal-episode">
                      <div className="episode-number">{index + 1}</div>
                      <div className="episode-info">
                        <h4 className="episode-title">{cat.type}</h4>
                        {cat.time_limit && <p className="episode-desc">Time Limit: {cat.time_limit}</p>}
                        {cat.fee && <p className="episode-desc">Fee: ₹{cat.fee}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.rules && event.rules.length > 0 && (
              <div className="modal-section">
                <h3 className="modal-section-title">Disclaimer</h3>
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
