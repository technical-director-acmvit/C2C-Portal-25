"use client";

import React, { useState } from "react";
import DotGrid from "./dot-grid";
import GradientBG from "./gradient-bg";
import HeadingText from "./HeadingText";

type DayEntry = { time: string; text: string };
type DaySchedule = { id: string; label: string; date: string; entries: DayEntry[] };

const days: DaySchedule[] = [
  {
    id: "D1",
    label: "Day 1",
    date: "10th September 2025",
    entries: [
      { time: "1:30 PM", text: "Reporting" },
      { time: "3:00 PM", text: "Opening ceremony, hack begins, followed by a speaker session by ACM India Council Member Meenakshi D'Souza" },
  { time: "10:30 PM", text: "Runpod session" },
    ],
  },
  {
    id: "D2",
    label: "Day 2",
    date: "11th September 2025",
    entries: [
      { time: "12:00 AM", text: "Review 1 (no elimination)" },
      { time: "9:00 AM", text: "Report back to the venue" },
      { time: "4:00 PM", text: "Review 2 (no elimination)" },
    ],
  },
  {
    id: "D3",
    label: "Day 3",
    date: "12th September 2025",
    entries: [
      { time: "12:00 AM", text: "Review 3 (elimination round)" },
  { time: "9:00 AM", text: "Report at venue" },
      { time: "10:00 AM", text: "Final pitches begin" },
    ],
  },
];

//todo change later when timeline out
const TIMELINE_COMING_SOON = false as const;

const Timeline = () => {
  const [selectedDay, setSelectedDay] = useState<DaySchedule>(days[0]);

  if (TIMELINE_COMING_SOON) {
    return (
      <GradientBG>
        <div className="w-full min-h-screen relative overflow-hidden">
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
                  color: "#48ba86",
                  fontFamily: "Trap-Bold, Trap, Arial, sans-serif",
                  fontSize: "clamp(28px, 6vw, 50px)",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                  letterSpacing: "1.5px",
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
      <div className="w-full min-h-screen relative overflow-hidden">
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
              {/* Day buttons */}
        <div className="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-stretch gap-5 sm:gap-6 xl:gap-8 w-full xl:w-auto overflow-x-auto sm:overflow-x-visible">
                {days.map((day, idx) => {
                  const active = selectedDay.id === day.id;
                  return (
                    <React.Fragment key={day.id}>
                      <button
                        onClick={() => setSelectedDay(day)}
                        className={`relative flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-1.5 sm:py-2 transition-all duration-300 ease-in-out text-left min-w-[160px] sm:min-w-[200px] transform hover:scale-105 flex-shrink-0 ${active ? "scale-105" : ""}`}
                        style={{
                          borderRadius: "72px",
                          background: active ? "rgba(72, 186, 134, 0.15)" : "rgba(255, 255, 255, 0.10)",
                          border: active ? "2px solid #48BA86" : "2px solid #6B7280",
                        }}
                      >
                        <div className="relative w-8 h-8 sm:w-12 sm:h-12 shrink-0">
                          <svg viewBox="0 0 100 100" className="absolute inset-0 pointer-events-none animate-spin [animation-duration:12s] [transform-origin:50%_50%] motion-reduce:animate-none">
                            <circle cx="50" cy="50" r="46" fill="none" stroke="#48BA86" strokeWidth="2.4" strokeDasharray="14 10" strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span
                              className="font-bold transition-all duration-200 text-xs sm:text-sm"
                              style={{ color: "#48BA86", fontFamily: "Trap-Bold, Trap, Arial, sans-serif", fontSize: "clamp(10px, 2.2vw, 14px)", fontStyle: "normal", fontWeight: 700, lineHeight: "1" }}
                            >
                              {day.id}
                            </span>
                          </div>
                        </div>
                        <span
                          className="font-bold transition-all duration-200 text-base sm:text-lg"
                          style={{ color: "#48BA86", fontFamily: "Trap-Bold, Trap, Arial, sans-serif", fontSize: "clamp(16px, 3.5vw, 22px)", fontStyle: "normal", fontWeight: 700, lineHeight: "normal" }}
                        >
                          {day.label}
                        </span>
                      </button>

                      {/* Tight connectors touching button edges */}
                      {idx < days.length - 1 && (
                        <>
                          {/* Horizontal connector (sm–lg) */}
                          <div className="hidden sm:flex xl:hidden items-center -ml-2 -mr-2" aria-hidden>
                            <div className="h-px w-6 bg-white/30" />
                            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-[#48BA86]" />
                          </div>
                          {/* Vertical connector (xl) */}
                          <div className="hidden xl:flex flex-col items-center self-stretch -mt-2 -mb-2" aria-hidden>
                            <div className="w-px h-6 bg-white/30" />
                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#48BA86]" />
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Selected day details */}
              <div className="flex-1 bg-transparent rounded-2xl border-none p-4 sm:p-6 lg:p-8">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3" style={{ color: "#4ade80", fontFamily: "Trap-Bold, Trap, Arial, sans-serif", fontSize: "clamp(28px, 6vw, 50px)", fontStyle: "normal", fontWeight: 700, lineHeight: "normal", letterSpacing: "1.5px" }}>
                  {selectedDay.label}
                </h3>
                <p className="text-white text-lg sm:text-xl lg:text-2xl xl:text-3xl mb-6" style={{ color: "#FFF", fontFamily: "Trap-Bold, Trap, Arial, sans-serif", fontSize: "clamp(18px, 4vw, 30px)", fontStyle: "normal", fontWeight: 700, lineHeight: "normal", letterSpacing: "0.48px" }}>
                  {selectedDay.date}
                </p>

                <ul className="space-y-4 sm:space-y-5 lg:space-y-6">
                  {selectedDay.entries.map((e, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span className="shrink-0 text-[#48BA86] font-bold" style={{ fontFamily: "Trap-Bold, Trap, Arial, sans-serif", fontSize: "clamp(14px, 3.2vw, 18px)" }}>
                        {e.time}
                      </span>
                      <span className="text-white" style={{ fontFamily: "DM Sans, Arial, sans-serif", fontSize: "clamp(14px, 3.6vw, 18px)", lineHeight: 1.5 }}>
                        {e.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
  {/* Removed styled-jsx block; handled by Tailwind utilities */}
      </div>
    </GradientBG>
  );
};

export default Timeline;
