import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CompetitionRow.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function CompetitionRow({ title, competitions, onEventClick }) {
  const navigate = useNavigate();

  const handleRegisterClick = (e, comp) => {
    e.stopPropagation();
    navigate('/register', { state: { event: comp } });
  };

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
                <button 
                  className="card-action-btn"
                  onClick={(e) => handleRegisterClick(e, comp)}
                >
                  <PlayArrowIcon fontSize="small" />Register
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompetitionRow;
