import thumbnail from '../assets/thumbnail.png';
import gpc from '../assets/Thumbnails/gpc.png';
import dbc from '../assets/Thumbnails/dbc.png';
import pf from '../assets/Thumbnails/pf.jpeg';
import fc from '../assets/Thumbnails/fc.png';
import tsh from '../assets/Thumbnails/tsh.png';
import is from '../assets/Thumbnails/is.jpeg';
import bgmi from '../assets/Thumbnails/bgmi.jpeg';
import ff from '../assets/Thumbnails/ff.png';
import valorant from '../assets/Thumbnails/valorant.jpg';
import rawEventData from './event_data.json';

// Event thumbnail mapping
const eventThumbnails = {
  "The Grand Prix of Code": gpc,
  "Daredevil – The Blind Coding Arena": dbc,
  "Pixel Fix": pf,
  "Flix Carnival (Cultural Dance)": fc,
  "The Squid Hunt (Treasure Hunt)": tsh,
  "The Hiring Room": is,
  "E - Sports BGMI": bgmi,
  "E-sports (Free Fire)": ff,
  "The Radiant Spike (Valorant)": valorant
  // Add more thumbnails as they become available
};

// Event venue and timing mapping
const eventDetails = {
  "The Grand Prix of Code": {
    day: 1,
    time: "1:00 PM - 3:30 PM",
    venue: "Web Technologies Lab, Machine Learning Lab, Software Testing Lab",
    coordinators: ["Atharv Mayur Tambekar", "Nipun Shah"],
    coordinatorPhones: ["9730898106", "8208320893"],
    entryFee: "₹100",
    entryType: "Solo"
  },
  "Flix Carnival (Cultural Dance)": {
    day: 2,
    time: "1:30 PM onwards",
    venue: "Open Auditorium",
    coordinators: ["Sharayu Arankar", "Samreen Jun"],
    coordinatorPhones: ["8793419327", "7773931377"],
    entryFee: "Solo: ₹100, Duo: ₹150, Group: ₹400",
    entryType: "Solo/Duo/Group"
  },
  "Daredevil – The Blind Coding Arena": {
    day: 2,
    time: "10:30 AM - 1:00 PM",
    venue: "Web Lab, ML Lab, DS Lab",
    coordinators: ["Nipun Prashant Shah", "Shreya Gurav"],
    coordinatorPhones: ["8208320893", "6361790149"],
    entryFee: "₹100",
    entryType: "Solo"
  },
  "The Hiring Room": {
    day: 1,
    time: "11:00 AM - 4:00 PM",
    venue: "HOD Cabin 3rd Floor",
    coordinators: ["Mrunal Gadavi", "Onkar Jadhavar"],
    coordinatorPhones: ["7058952429", "7972961313"],
    entryFee: "₹100",
    entryType: "Solo"
  },
  "E-sports (Free Fire)": {
    day: 2,
    time: "10:30 AM - 1:00 PM",
    venue: "D Block Seminar Hall + 1 Classroom",
    coordinators: ["Rutuja Madhav Pinate", "Rajveer Chandaliya"],
    coordinatorPhones: ["8446176586", "9730612415"],
    entryFee: "₹400 per team",
    entryType: "Team (5 members)"
  },
  "Pixel Fix": {
    day: 1,
    time: "11:00 AM - 4:00 PM",
    venue: "CC Lab",
    coordinators: ["Amol Khot", "Shreya Gurav"],
    coordinatorPhones: ["7666028044", "6361790149"],
    entryFee: "₹100 per person",
    entryType: "Solo/Duo"
  },
  "The Squid Hunt (Treasure Hunt)": {
    day: 1,
    time: "11:00 AM - 4:00 PM",
    venue: "Campus-wide",
    coordinators: ["Shreya Tambekar", "Rohan Patil"],
    coordinatorPhones: ["7499193352", "7666040924"],
    entryFee: "₹400 per team",
    entryType: "Team (max 5 members)"
  },
  "The Radiant Spike (Valorant)": {
    day: 2,
    time: "10:30 AM - 1:30 PM",
    venue: "PL Lab",
    coordinators: ["Atharv Tambekar", "Rasik Samudre"],
    coordinatorPhones: ["9730898106", "9021211916"],
    entryFee: "₹200 per team",
    entryType: "Duo"
  },
  "E - Sports BGMI": {
    day: 1,
    time: "11:00 AM - 4:00 PM",
    venue: "Seminar Hall - C Block",
    coordinators: ["Rasik", "Sanket Sutar", "Prachi Jadhav"],
    coordinatorPhones: ["9021211916", "7219643252", "7038289705"],
    entryFee: "₹200-400 per team",
    entryType: "Squad (4 members)"
  }
};

// Transform the imported event data to match the application structure
const transformEventData = (rawData) => {
  const day1Events = [];
  const day2Events = [];
  let idCounter = 1;

  if (!rawData || !Array.isArray(rawData)) {
    console.error('Invalid event data:', rawData);
    return { day1Events, day2Events };
  }

  rawData.forEach(event => {
    const details = eventDetails[event.event_name] || {};
    
    // Convert comma-separated venues to array
    let venue = details.venue || "TBD";
    if (venue !== "TBD" && venue.includes(',')) {
      venue = venue.split(',').map(v => v.trim());
    }
    
    const transformedEvent = {
      id: idCounter++,
      category: determineCategory(event.event_name),
      title: event.event_name,
      netflixTheme: event.netflix_theme !== "No" && event.netflix_theme !== "None" && event.netflix_theme !== "NA" ? event.netflix_theme : null,
      time: details.time || "TBD",
      venue: venue,
      coordinators: details.coordinators || [],
      coordinatorPhones: details.coordinatorPhones || [],
      entryFee: details.entryFee || "TBD",
      entryType: details.entryType || "TBD",
      rounds: event.rounds || [],
      rules: event.rules || [],
      categories: event.categories || null,
      team_specs: event.team_specs || null,
      format: event.format || null,
      structure: event.structure || null,
      description: generateDescription(event.event_name, event.netflix_theme),
      image: eventThumbnails[event.event_name] || thumbnail,
      tags: event.tags || []
    };

    // Sort events by day
    const day = details.day || 1;
    if (day === 1) {
      day1Events.push(transformedEvent);
    } else {
      day2Events.push(transformedEvent);
    }
  });

  return { day1Events, day2Events };
};

// Determine event category based on event name
const determineCategory = (eventName) => {
  const nameLower = eventName.toLowerCase();
  
  // E-Sports detection
  if (nameLower.includes('e-sport') || nameLower.includes('esport') || 
      nameLower.includes('bgmi') || nameLower.includes('free fire') || 
      nameLower.includes('valorant') || nameLower.includes('radiant spike')) {
    return "E-Sports";
  }
  
  // Technical events detection
  if (nameLower.includes('code') || nameLower.includes('coding') || 
      nameLower.includes('pixel') || nameLower.includes('daredevil') ||
      nameLower.includes('prix')) {
    return "Technical";
  }
  
  // Non-technical events
  return "Non-Technical";
};

// Generate a brief description based on event name and theme
const generateDescription = (eventName, theme) => {
  const descriptions = {
    "The Grand Prix of Code": "Test your algorithmic prowess and data structure knowledge in this intense coding competition inspired by Drive to Survive. Race through searching, sorting, arrays, and linked lists to claim victory!",
    "Flix Carnival (Cultural Dance)": "An evening of culture, creativity, and celebration inspired by Wednesday. Dance, music, drama, and more - showcase your talents in solo, duet, or group performances!",
    "Daredevil – The Blind Coding Arena": "Code in complete darkness - literally. No screen visibility, just your keyboard and syntax knowledge. The ultimate test of programming muscle memory inspired by Daredevil.",
    "The Hiring Room": "Step into a professional setting and experience real-world interview scenarios inspired by Suits. From resume screening to panel interviews - dress sharp, think sharper.",
    "E-sports (Free Fire)": "10 minutes of pure adrenaline! Fast-paced battle royale action where every decision counts. Can your squad be the last one standing?",
    "Pixel Fix": "Unleash your creativity in this ultimate UI/UX design challenge inspired by Abstract. Transform and modernize web interfaces using HTML, CSS, and JavaScript.",
    "The Squid Hunt (Treasure Hunt)": "Navigate through a thrilling campus-wide adventure inspired by Squid Game. Collect cards, hunt for clues, and complete challenges. Survival of the smartest!",
    "The Radiant Spike (Valorant)": "Duo team deathmatch where precise gunplay meets tactical strategy. Coordinate with your partner, execute plays, and dominate the competition!",
    "E - Sports BGMI": "Drop into the battleground with 80 squads competing for glory. Strategy, skill, and survival - only the best will claim the chicken dinner!"
  };
  
  return descriptions[eventName] || `Join us for ${eventName}${theme ? ` - inspired by ${theme}` : ''}. An exciting event you won't want to miss!`;
};

const { day1Events, day2Events } = transformEventData(rawEventData);

export const eventsData = {
  techfest_2026: {
    organization: "CSESA",
    technical_head: "User",
    days: [
      {
        day: 1,
        events: day1Events
      },
      {
        day: 2,
        events: day2Events
      }
    ]
  }
};

// Organize events by category for easy display
export const getEventsByCategory = () => {
  const allEvents = [
    ...eventsData.techfest_2026.days[0].events,
    ...eventsData.techfest_2026.days[1].events
  ];

  return {
    technical: allEvents.filter(e => e.category === "Technical"),
    nonTechnical: allEvents.filter(e => e.category === "Non-Technical"),
    esports: allEvents.filter(e => e.category === "E-Sports")
  };
};
