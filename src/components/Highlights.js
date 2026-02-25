import React from 'react';
import './Highlights.css';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function Highlights() {
  return (
    <section className="highlights">
      <div className="highlights-container">
        <div className="highlight-card">
          <EmojiEventsIcon style={{ fontSize: 50, color: '#ff0000' }} />
          <h3>50k Prize Pool</h3>
        </div>
        <div className="highlight-card">
          <FastfoodIcon style={{ fontSize: 50, color: '#ff0000' }} />
          <h3>Refreshments (Snacks) Provided</h3>
        </div>
        <div className="highlight-card">
          <WorkspacePremiumIcon style={{ fontSize: 50, color: '#ff0000' }} />
          <h3>Participation Certificates For Everyone</h3>
        </div>
      </div>
    </section>
  );
}

export default Highlights;
