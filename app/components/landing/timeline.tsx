"use client";

import React, { useState } from 'react';
import DotGrid from './dot-grid';
import Topper from './topper';

interface TimelineItem {
  id: string;
  label: string;
  title: string;
  day: string;
  time: string;
  venue: string;
  description?: string;
}

const timelineData: TimelineItem[] = [
  {
    id: "01",
    label: "Opening Ceremony",
    title: "Welcome to C2C",
    day: "Day 1 • 10th September 2025",
    time: "Time: 9:00 AM",
    venue: "Venue: Main Auditorium",
    description: "Join us for the grand opening ceremony where we'll kick off the event with keynote speakers and an overview of what's to come."
  },
  {
    id: "02", 
    label: "Ice Breaker",
    title: "Networking Session",
    day: "Day 1 • 10th September 2025",
    time: "Time: 10:30 AM",
    venue: "Venue: Conference Hall A",
    description: "Break the ice with fellow participants through fun activities and networking opportunities."
  },
  {
    id: "03",
    label: "Review 1",
    title: "Project Showcase",
    day: "Day 1 • 10th September 2025", 
    time: "Time: 2:00 PM",
    venue: "Venue: Tech Lab",
    description: "Present your initial project ideas and get valuable feedback from mentors and peers."
  },
  {
    id: "04",
    label: "Review 2", 
    title: "Progress Review",
    day: "Day 2 • 11th September 2025",
    time: "Time: 11:00 AM",
    venue: "Venue: Innovation Hub",
    description: "Showcase your progress and receive guidance for the next phase of development."
  },
  {
    id: "05",
    label: "Speaker Session",
    title: "Speaker Session",
    day: "Day • 10th September 2025",
    time: "Time: 10:00 AM",
    venue: "Venue: Auditorium",
    description: "Learn from industry experts about the latest trends and opportunities in technology."
  },
  {
    id: "06",
    label: "Final Pitches",
    title: "Grand Finale",
    day: "Day 3 • 12th September 2025",
    time: "Time: 4:00 PM",
    venue: "Venue: Main Stage",
    description: "Present your final projects to judges and compete for exciting prizes and recognition."
  }
];

const Timeline = () => {
  const [selectedItem, setSelectedItem] = useState<TimelineItem>(timelineData[4]); // Default to Speaker Session

  return (
    <div id="timeline" className="w-full min-h-screen relative overflow-hidden">
      {/* Gradient background that blends with the page background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]" />
      <Topper text="Timeline" />
      {/* DotGrid positioned behind the content */}
      <div className="absolute inset-0 z-0">
        <DotGrid dotSize={1.5} gap={25} baseColor="#a3a3a3" />
      </div>
      
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pointer-events-auto">
          {/* Header */}
          
          
          {/* Timeline Content */}
          <div className="flex flex-col xl:flex-row gap-8 sm:gap-10 lg:gap-12 items-start">
            {/* Timeline Buttons */}
            <div className="flex flex-col sm:flex-row xl:flex-col gap-3 sm:gap-4 w-full xl:w-auto overflow-x-auto sm:overflow-x-visible">
              {timelineData.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300 ease-in-out text-left min-w-[200px] sm:min-w-[250px] transform hover:scale-105 hover:shadow-lg hover:shadow-[#48BA86]/20 flex-shrink-0 ${
                    selectedItem.id === item.id ? 'scale-105 shadow-lg shadow-[#48BA86]/30' : ''
                  }`}
                  style={{
                    borderRadius: '72px',
                    background: 'rgba(255, 255, 255, 0.10)',
                    border: '2px solid #6B7280'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '2px solid #48BA86';
                    e.currentTarget.style.background = 'rgba(72, 186, 134, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedItem.id !== item.id) {
                      e.currentTarget.style.border = '2px solid #6B7280';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                    } else {
                      e.currentTarget.style.border = '2px solid #48BA86';
                      e.currentTarget.style.background = 'rgba(72, 186, 134, 0.15)';
                    }
                  }}
                >
                  <span 
                    className="font-bold transition-all duration-200 text-sm sm:text-base"
                    style={{ 
                      color: '#48BA86',
                      fontFamily: 'Pilat Extended',
                      fontSize: 'clamp(12px, 2.5vw, 15.6px)',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      lineHeight: 'normal'
                    }}
                  >
                    {item.id}
                  </span>
                  <span 
                    className="font-bold transition-all duration-200 text-lg sm:text-xl"
                    style={{ 
                      color: '#48BA86',
                      fontFamily: 'Pilat Extended',
                      fontSize: 'clamp(18px, 4vw, 24.6px)',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      lineHeight: 'normal'
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Selected Item Details */}
            <div className="flex-1 bg-transparent rounded-2xl border-none p-4 sm:p-6 lg:p-8">
              <h3 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
                style={{ 
                  color: '#4ade80',
                  fontFamily: 'Trap',
                  fontSize: 'clamp(28px, 6vw, 50px)',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: 'normal',
                  letterSpacing: '1.5px'
                }}
              >
                {selectedItem.title}
              </h3>
              
              <div className="space-y-8 sm:space-y-10 lg:space-y-13 mb-4 sm:mb-6">
                <p 
                  className="text-white text-lg sm:text-xl lg:text-2xl xl:text-3xl"
                  style={{ 
                    color: '#FFF',
                    fontFamily: 'DM Sans',
                    fontSize: 'clamp(18px, 4vw, 30px)',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                    letterSpacing: '0.48px'
                  }}
                >
                  {selectedItem.day}
                </p>
                <p 
                  className="text-white text-lg sm:text-xl lg:text-2xl xl:text-3xl"
                  style={{ 
                    color: '#FFF',
                    fontFamily: 'DM Sans',
                    fontSize: 'clamp(18px, 4vw, 30px)',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                    letterSpacing: '0.48px'
                  }}
                >
                  {selectedItem.time}
                </p>
                <p 
                  className="text-white text-lg sm:text-xl lg:text-2xl xl:text-3xl"
                  style={{ 
                    color: '#FFF',
                    fontFamily: 'DM Sans',
                    fontSize: 'clamp(18px, 4vw, 30px)',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                    letterSpacing: '0.48px'
                  }}
                >
                  {selectedItem.venue}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
