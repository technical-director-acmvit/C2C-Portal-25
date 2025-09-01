"use client";

import React, { useState } from 'react';
import DotGrid from './dot-grid';
import GradientBG from './gradient-bg';
import HeadingText from './HeadingText';

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
    id: "R0",
    label: "Round 0",
    title: "Online Screening",
    day: "Pre-Event • 10th September 2025",
    time: "Time: Before hack starts",
    venue: "Venue: Anna Auditorium",
    description: "Online screening before hack starts at Anna on 10th."
  },
  {
    id: "R1",
    label: "Review 1",
    title: "Review 1",
    day: "Day • 11th September 2025",
    time: "Time: 12:00 AM",
    venue: "Venue: —",
  },
  {
    id: "R2",
    label: "Review 2",
    title: "Review 2",
    day: "Day • 11th September 2025",
    time: "Time: ~4:00 PM",
    venue: "Venue: —",
  },
  {
    id: "R3",
    label: "Review 3",
    title: "Review 3",
    day: "Day • 12th September 2025",
    time: "Time: ~2:00 AM",
    venue: "Venue: —",
  },
];

//todo change later when timeline out
const TIMELINE_COMING_SOON = true as const;

const Timeline = () => {
  const defaultItem = timelineData.find(t => t.id === "05") || timelineData[0];
  const [selectedItem, setSelectedItem] = useState<TimelineItem>(defaultItem);

  if (TIMELINE_COMING_SOON) {
    return (
      <GradientBG>
        <div id="timeline" className="w-full min-h-screen relative overflow-hidden">
          <div className="absolute inset-0 z-10">
            <HeadingText text="Timeline" />
          </div>
          <div className="absolute inset-0 z-0">
            <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" />
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pointer-events-auto transform translate-y-16 sm:translate-y-20 lg:translate-y-24 text-center">
              <h3
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
                style={{
                  color: '#48ba86',
                  fontFamily: 'Trap-Bold, Trap, Arial, sans-serif',
                  fontSize: 'clamp(28px, 6vw, 50px)',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: 'normal',
                  letterSpacing: '1.5px'
                }}
              >
                Coming soon...
              </h3>
            </div>
          </div>
        </div>
      </GradientBG>
    );
  }

  return (
    <GradientBG>
    <div id="timeline" className="w-full min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-10">
        {/* <Topper text="Timeline" /> */}
        <h1
          className="
            text-center 
            break-words 
            hyphens-auto 
            text-hollow 
            py-8 sm:py-16 md:py-24 lg:py-32
            px-4
          "
          style={{
            WebkitTextStroke: "2px #ffffff",
            fontFamily: "Trap-Bold, Arial, sans-serif",
            fontSize: "clamp(2rem, 8vw, 6rem)", // 24px → ~77px
            fontWeight: 700,
            lineHeight: "clamp(110%, 6vw, 130%)",
            color: "transparent",
          }}
        >
          Timeline
        </h1>
      </div>
      {/* DotGrid positioned behind the content */}
      <div className="absolute inset-0 z-0">
        <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" />
      </div>
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pointer-events-auto transform translate-y-16 sm:translate-y-20 lg:translate-y-24">
          {/* Header */}
          
          
          {/* Timeline Content */}
          <div className="flex flex-col xl:flex-row gap-8 sm:gap-10 lg:gap-12 items-start">
            {/* Timeline Buttons */}
            <div className="flex flex-col sm:flex-row xl:flex-col gap-3 sm:gap-4 w-full xl:w-auto overflow-x-auto sm:overflow-x-visible">
              {timelineData.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`flex items-center gap-2 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 ease-in-out text-left min-w-[160px] sm:min-w-[200px] transform hover:scale-105 flex-shrink-0 ${
                    selectedItem.id === item.id ? 'scale-105' : ''
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
                  <div className="relative w-8 h-8 sm:w-12 sm:h-12 shrink-0">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 dash-rotate pointer-events-none">
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="#48BA86"
                        strokeWidth="2.4"
                        strokeDasharray="14 10"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span 
                        className="font-bold transition-all duration-200 text-xs sm:text-sm"
                        style={{ 
                          color: '#48BA86',
                          fontFamily: 'Trap-Bold, Trap, Arial, sans-serif',
                          fontSize: 'clamp(10px, 2.2vw, 14px)',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          lineHeight: '1'
                        }}
                      >
                        {item.id}
                      </span>
                    </div>
                  </div>
                  <span 
                    className="font-bold transition-all duration-200 text-base sm:text-lg"
                    style={{ 
                      color: '#48BA86',
                      fontFamily: 'Trap-Bold, Trap, Arial, sans-serif',
                      fontSize: 'clamp(16px, 3.5vw, 22px)',
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
          fontFamily: 'Trap-Bold, Trap, Arial, sans-serif',
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
                    fontFamily: 'Trap-Bold, Trap, Arial, sans-serif',
                    fontSize: 'clamp(18px, 4vw, 30px)',
                    fontStyle: 'normal',
                    fontWeight: 700,
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
                    fontFamily: 'Trap-Bold, Trap, Arial, sans-serif',
                    fontSize: 'clamp(18px, 4vw, 30px)',
                    fontStyle: 'normal',
                    fontWeight: 700,
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
                    fontFamily: 'Trap-Bold, Trap, Arial, sans-serif',
                    fontSize: 'clamp(18px, 4vw, 30px)',
                    fontStyle: 'normal',
                    fontWeight: 700,
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
        <style jsx>{`
          @keyframes dash-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .dash-rotate { 
            animation: dash-rotate 12s linear infinite; 
            transform-origin: 50% 50%;
            will-change: transform;
          }
          @media (prefers-reduced-motion: reduce) {
            .dash-rotate { animation: none; }
          }
        `}</style>
    </div>
    </GradientBG>
  );
};

export default Timeline;
