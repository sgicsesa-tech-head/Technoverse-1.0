export const eventsData = {
  techfest_2026: {
    organization: "CSESA",
    technical_head: "User",
    days: [
      {
        day: 1,
        events: [
          {
            id: 1,
            category: "Technical",
            title: "Web Design (Canvas)",
            time: "11:00 AM - 4:00 PM",
            venue: "CC Lab",
            capacity: 80,
            coordinators: ["Amol", "Shreya G."],
            tags: ["UI/UX", "Frontend"],
            description: "Unleash your creativity in this ultimate web design challenge. Create stunning, responsive websites that push the boundaries of modern design.",
            rounds: ["Round 1: Concept & Wireframe", "Round 2: Design Implementation", "Round 3: Final Presentation"],
            rules: [
              "All designs must be original work",
              "Responsive design is mandatory",
              "Use of CSS frameworks is allowed",
              "Time limit: 5 hours total",
              "Internet access permitted for resources"
            ],
            image: "../assets/thumb.png"
          },
          {
            id: 2,
            category: "Technical",
            title: "DSA / DTS",
            time: "1:00 PM - 3:30 PM",
            venue: ["Web Lab", "ML Lab", "ST Lab"],
            capacity: 60,
            coordinators: ["Atharv T.", "Nipun"],
            tags: ["Logic", "Coding"],
            description: "Test your algorithmic prowess and data structure knowledge in this intense coding competition. Solve complex problems under time pressure.",
            rounds: ["Round 1: MCQ Screening", "Round 2: Coding Challenge"],
            rules: [
              "No external help or resources allowed",
              "Code must compile and run successfully",
              "Optimized solutions score higher",
              "Time limit: 2.5 hours",
              "Choice of C++, Java, or Python"
            ],
            image: "../assets/thumb.png"
          },
          {
            id: 3,
            category: "Non-Technical",
            title: "Interview Simulation (Suits)",
            time: "11:00 AM - 4:00 PM",
            venue: "TBD",
            capacity: 50,
            coordinators: ["Mrunal", "OJ"],
            tags: ["Career", "Soft Skills"],
            description: "Step into a professional setting and experience real-world interview scenarios. Dress sharp, think sharper.",
            rounds: ["Round 1: Group Discussion", "Round 2: HR Interview", "Round 3: Technical/Domain Interview"],
            rules: [
              "Formal attire mandatory",
              "Resume submission required",
              "Punctuality is crucial",
              "Professional conduct expected",
              "Feedback provided to all participants"
            ],
            image: "../assets/thumb.png"
          },
          {
            id: 4,
            category: "Non-Technical",
            title: "Treasure Hunt (Squid Game)",
            time: "11:00 AM - 4:00 PM",
            venue: "Campus-wide",
            coordinators: ["Shreya T.", "Anushka", "Rohan"],
            tags: ["Adventure", "Strategy"],
            description: "Navigate through a thrilling campus-wide adventure filled with cryptic clues, challenging puzzles, and exciting tasks. Survival of the smartest!",
            rounds: ["Multiple stages with progressive difficulty"],
            rules: [
              "Teams of 3-4 members",
              "No use of vehicles",
              "Mobile phones allowed only for clues",
              "Respect campus property",
              "First team to finish wins"
            ],
            image: "../assets/thumb.png"
          },
          {
            id: 5,
            category: "E-Sports",
            title: "BGMI",
            time: "11:00 AM - 4:00 PM",
            venue: "Seminar (C)",
            capacity: 150,
            coordinators: ["Rasik", "Prachi"],
            tags: ["Battle Royale", "Team Play"],
            description: "Drop into the battleground and prove your squad's dominance. Strategy, skill, and survival - only the best will claim the chicken dinner!",
            rounds: ["Round 1: Qualifying Matches", "Round 2: Quarter Finals", "Round 3: Semi Finals", "Round 4: Grand Finals"],
            rules: [
              "Squad mode (4 players per team)",
              "No emulators allowed - mobile devices only",
              "Standard tournament settings",
              "Fair play policy strictly enforced",
              "Points based on kills and placement"
            ],
            image: "../assets/thumb.png"
          },
          {
            id: 6,
            category: "E-Sports",
            title: "Clash Royale (CR)",
            time: "1:00 PM - 3:00 PM",
            venue: "Seminar (D)",
            coordinators: ["Rajveer", "Siddhi"],
            tags: ["Strategy", "1v1"],
            description: "Build your ultimate deck and deploy your troops in this real-time strategy battle. Outthink, outplay, and outlast your opponents.",
            rounds: ["Round 1: Swiss System", "Round 2: Knockout Bracket"],
            rules: [
              "1v1 format",
              "Tournament standard card levels",
              "Best of 3 matches",
              "Pre-registered accounts only",
              "Time limit per match: 5 minutes"
            ],
            image: "../assets/thumb.png"
          }
        ]
      },
      {
        day: 2,
        events: [
          {
            id: 7,
            category: "Technical",
            title: "Blind Coding (Devils)",
            time: "10:30 AM - 1:00 PM",
            venue: ["Web Lab", "ML Lab", "DS Lab"],
            coordinators: ["Nipun", "Shreya G."],
            tags: ["Expert", "Syntax"],
            description: "Code in complete darkness - literally. No screen, no IDE, just your keyboard and syntax knowledge. The ultimate test of programming muscle memory.",
            rounds: ["Round 1: Basic Syntax", "Round 2: Logic Implementation"],
            rules: [
              "Monitors will be turned off",
              "No peeking allowed",
              "Syntax errors heavily penalized",
              "Time limit: 2.5 hours",
              "Code will be tested after submission"
            ],
            image: "../assets/thumb.png"
          },
          {
            id: 8,
            category: "Technical",
            title: "Vibe Coding",
            time: "TBD",
            venue: "TBD",
            coordinators: ["Shrutika", "Bhumika"],
            tags: ["AI-Assisted", "Modern"],
            description: "The future of coding is here! Leverage AI tools, collaborate with intelligent assistants, and create amazing projects in this modern coding experience.",
            rounds: ["Single Round: AI-Assisted Development"],
            rules: [
              "AI tools and Copilot encouraged",
              "Focus on creativity and problem-solving",
              "Final product quality matters most",
              "Time limit: TBD",
              "Collaboration with AI is the goal"
            ],
            image: "../assets/thumb.png"
          },
          {
            id: 9,
            category: "Non-Technical",
            title: "Cultural Event",
            time: "2:00 PM - Late",
            venue: "Open Area (OA)",
            coordinators: ["Sharayu", "Samreen"],
            tags: ["Performance", "Entertainment"],
            description: "An evening of culture, creativity, and celebration. Dance, music, drama, and more - showcase your talents and enjoy the performances!",
            rounds: ["Open Stage Performances"],
            rules: [
              "Pre-registration required for performances",
              "Time limit per act: 5-7 minutes",
              "Appropriate content only",
              "Sound system provided",
              "Audience participation encouraged"
            ],
            image: "../assets/thumb.png"
          },
          {
            id: 10,
            category: "E-Sports",
            title: "Free Fire (FF)",
            time: "10:30 AM - 1:00 PM",
            venue: ["Seminar (D)", "Class 1"],
            coordinators: ["Rutuja", "Rajveer"],
            tags: ["Battle Royale", "Fast-Paced"],
            description: "10 minutes of pure adrenaline! Fast-paced battle royale action where every decision counts. Can your squad be the last one standing?",
            rounds: ["Round 1: Group Stage", "Round 2: Finals"],
            rules: [
              "Squad mode (4 players)",
              "Mobile devices only",
              "Standard BR mode",
              "No hacks or cheats",
              "Kill points + placement points"
            ],
            image: "../assets/thumb.png"
          },
          {
            id: 11,
            category: "E-Sports",
            title: "Valorant",
            time: "10:30 AM - 1:00 PM",
            venue: "PL Lab",
            coordinators: ["Atharv T.", "Rasik"],
            tags: ["FPS", "Tactical"],
            description: "5v5 tactical shooter where precise gunplay meets unique agent abilities. Coordinate with your team, execute strategies, and claim victory!",
            rounds: ["Round 1: Best of 1", "Round 2: Best of 3 Finals"],
            rules: [
              "5v5 team format",
              "PC setup provided",
              "Competitive mode rules",
              "No custom skins/cheats",
              "Spike Rush warmup allowed"
            ],
            image: "../assets/thumb.png"
          }
        ]
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
