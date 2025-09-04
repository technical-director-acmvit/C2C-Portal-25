"use client";

import React, { useEffect, useRef, useState } from "react";
import DotGrid from "./dot-grid";
import GradientBG from "./gradient-bg";

type DayEntry = { time: string; text: string };
type DaySchedule = { id: string; label: string; date: string; entries: DayEntry[] };

const days: DaySchedule[] = [
  {
    id: "D1",
    label: "Day 1",
    date: "10th September 2025",
    entries: [
      { time: "01:30 PM", text: "Repo init - Reporting Time" },
      {
        time: "03:00 PM",
        text: "Create Release: v0.1.0 (Inauguration & Keynote session by Dr. Meenakshi D'Souza, President, ACM India Council, Hackathon officially starts)",
      },
      { time: "10:30 PM", text: "A session by RunPod" },
    ],
  },
  {
    id: "D2",
    label: "Day 2",
    date: "11th September 2025",
    entries: [
      { time: "12:00 AM", text: "Run Workflow (Review 1 - no eliminations)" },
      { time: "09:00 AM", text: "Sync with origin (Reporting back at the venue)" },
      { time: "04:00 PM", text: "Merge Conflicts (Review 2 - no eliminations)" },
    ],
  },
  {
    id: "D3",
    label: "Day 3",
    date: "12th September 2025",
    entries: [
      { time: "12:00 AM", text: "Push to dev (Review 3 - eliminations)" },
      { time: "10:00 AM", text: "Push to main (Final Pitches)" },
      { time: "03:00 PM", text: "Deploying (closing ceremony)" },
    ],
  },
];

const TIMELINE_COMING_SOON = false as const;

const Timeline = () => {
  const [selectedDay, setSelectedDay] = useState<DaySchedule>(days[0]);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightContentRef = useRef<HTMLDivElement | null>(null);
  const [leftHeight, setLeftHeight] = useState<number>(0);
  const [bottomPad, setBottomPad] = useState<number>(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const set = () => setIsMobile(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const changeDay = (direction: 1 | -1) => {
    const idx = days.findIndex((d) => d.id === selectedDay.id);
    const nextIdx = Math.min(days.length - 1, Math.max(0, idx + direction));
    if (nextIdx !== idx) setSelectedDay(days[nextIdx]);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || !isMobile) return;
    const start = touchStart.current;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absX > 40 && absX > absY) {
      // swipe left = next day, right = previous day
      changeDay(dx < 0 ? 1 : -1);
    }
    touchStart.current = null;
  };

  useEffect(() => {
    if (!leftColRef.current) return;

    const el = leftColRef.current;
    const measure = () => setLeftHeight(el.getBoundingClientRect().height);
    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const measureRight = () => {
      if (!rightContentRef.current) return;
      const rightH = rightContentRef.current.getBoundingClientRect().height;
      const diff = Math.max(0, leftHeight - rightH);
      setBottomPad(diff);
    };

    const raf = requestAnimationFrame(measureRight);
    window.addEventListener("resize", measureRight);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measureRight);
    };
  }, [selectedDay, leftHeight]);

  if (TIMELINE_COMING_SOON) {
    return (
      <GradientBG>
        <div className="w-full min-h-screen relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            <h1
              className="text-center text-4xl md:text-6xl lg:text-8xl font-bold mb-8 text-transparent"
              style={{
                WebkitTextStroke: "2px #ffffff",
                fontFamily: "Trap-Bold, Trap, Arial, sans-serif",
              }}
            >
              Timeline
            </h1>
            <h3
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-center"
              style={{
                color: "#48ba86",
                fontFamily: "Trap-Bold, Trap, Arial, sans-serif",
              }}
            >
              Coming soon...
            </h3>
          </div>
        </div>
      </GradientBG>
    );
  }

  return (
    <GradientBG>
      <div className="w-full min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" />
        </div>

        <div className="relative z-10 min-h-screen">
          {/* Header */}
          <div className="pt-8 pb-4 md:pt-16 md:pb-8">
            <h1
              className="text-center text-4xl md:text-6xl lg:text-8xl font-bold px-4 text-transparent"
              style={{
                WebkitTextStroke: "2px #ffffff",
                fontFamily: "Trap-Bold, Arial, sans-serif",
              }}
            >
              Timeline
            </h1>
          </div>

          {/* Main Content */}
          <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
              {/* Day Selection - Mobile: Horizontal scroll, Desktop: Vertical */}
              <div className="lg:col-span-1">
                {/* Mobile: Horizontal scroll */}
                <div className="lg:hidden">
                  <div
                    className="flex gap-3 overflow-x-auto pb-4 scroll-smooth"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                  >
                    {days.map((day, i) => {
                      const active = selectedDay.id === day.id;
                      return (
                        <button
                          key={day.id}
                          onClick={() => setSelectedDay(day)}
                          className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 rounded-full border-2 transition-all duration-300 flex-shrink-0 min-w-[96px] sm:min-w-[140px] ${
                            active ? "scale-105" : "hover:scale-105"
                          }`}
                          style={{
                            background: active
                              ? "rgba(72, 186, 134, 0.15)"
                              : "rgba(255, 255, 255, 0.10)",
                            border: active ? "2px solid #48BA86" : "2px solid #6B7280",
                          }}
                          aria-label={`Select day ${i + 1}`}
                        >
                          <span
                            className="font-bold text-sm sm:text-base whitespace-nowrap"
                            style={{
                              color: "#48BA86",
                              fontFamily: "Trap-Bold, Trap, Arial, sans-serif",
                            }}
                          >
                            Day {i + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop: Vertical layout */}
                <div ref={leftColRef} className="hidden lg:flex flex-col gap-6">
                  {days.map((day, idx) => {
                    const active = selectedDay.id === day.id;
                    return (
                      <div key={day.id} className="flex flex-col">
                        <button
                          onClick={() => setSelectedDay(day)}
                          className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-300 text-left w-full ${
                            active ? "scale-105" : "hover:scale-105"
                          }`}
                          style={{
                            background: active
                              ? "rgba(72, 186, 134, 0.15)"
                              : "rgba(255, 255, 255, 0.10)",
                            border: active ? "2px solid #48BA86" : "2px solid #6B7280",
                          }}
                        >
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <svg
                              viewBox="0 0 100 100"
                              className="absolute inset-0 animate-spin"
                              style={{ animationDuration: "12s" }}
                            >
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
                                className="font-bold text-sm"
                                style={{
                                  color: "#48BA86",
                                  fontFamily: "Trap-Bold, Trap, Arial, sans-serif",
                                }}
                              >
                                {day.id}
                              </span>
                            </div>
                          </div>
                          <span
                            className="font-bold text-lg"
                            style={{
                              color: "#48BA86",
                              fontFamily: "Trap-Bold, Trap, Arial, sans-serif",
                            }}
                          >
                            {day.label}
                          </span>
                        </button>

                        {/* Connector */}
                        {idx < days.length - 1 && (
                          <div className="relative flex justify-center items-start py-2">
                            <div className="w-px h-8 bg-gradient-to-b from-green-400/50 to-transparent"></div>
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-green-400"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Day Details */}
              <div className="lg:col-span-3 lg:self-start">
                <div className="p-0 lg:pr-2" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                  {/* Day Title */}
                  <div className="mb-6 pb-4">
                    <h2
                      className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
                      style={{
                        color: "#4ade80",
                        fontFamily: "Trap-Bold, Trap, Arial, sans-serif",
                        fontSize: "clamp(28px, 6vw, 50px)",
                        letterSpacing: "1.5px",
                      }}
                    >
                      {selectedDay.label}
                    </h2>
                    <p
                      className="text-lg md:text-xl lg:text-2xl font-semibold"
                      style={{
                        color: "#FFF",
                        fontFamily: "Trap-Bold, Trap, Arial, sans-serif",
                        fontSize: "clamp(18px, 4vw, 30px)",
                        letterSpacing: "0.48px",
                      }}
                    >
                      {selectedDay.date}
                    </p>
                  </div>

                  {/* Schedule Entries */}
                  <div
                    ref={rightContentRef}
                    className="space-y-4 md:space-y-6"
                    style={{ paddingBottom: bottomPad }}
                  >
                    {selectedDay.entries.map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-6 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
                      >
                        {/* Time Badge */}
                        <div className="flex-shrink-0">
                          <span
                            className="inline-block px-3 py-2 rounded-lg border text-sm md:text-base font-bold"
                            style={{
                              background: "rgba(72, 186, 134, 0.20)",
                              color: "#48BA86",
                              borderColor: "rgba(72, 186, 134, 0.30)",
                              fontFamily: "Trap-Bold, Trap, Arial, sans-serif",
                            }}
                          >
                            {entry.time}
                          </span>
                        </div>

                        {/* Event Description */}
                        <div className="flex-1">
                          <p
                            className="text-sm md:text-base lg:text-lg leading-relaxed"
                            style={{
                              color: "rgba(255, 255, 255, 0.90)",
                              fontFamily: "DM Sans, Arial, sans-serif",
                              lineHeight: 1.5,
                            }}
                          >
                            {entry.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom spacing */}
          <div className="h-16"></div>
        </div>
      </div>
    </GradientBG>
  );
};

export default Timeline;
