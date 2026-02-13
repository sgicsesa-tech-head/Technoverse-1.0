import React from 'react';
import './CompetitionRow.css';

function CompetitionRow({ title, competitions, onEventClick }) {
  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-posters">
        {competitions.map((comp) => (
          <div key={comp.id} className="competition-card" onClick={() => onEventClick(comp)}>
            <img src={comp.image} alt={comp.title} className="poster" />
            <div className="card-banner">
                <img src={comp.image} alt={comp.title} />
            </div>
            <div className="card-info">
              <h3>{comp.title}</h3>
              <p>{comp.category}</p>
              <div className="card-actions">
                <button className="card-action-btn">Register ▶</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompetitionRow;
