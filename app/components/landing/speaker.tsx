"use client";

import DotGrid from "./dot-grid";
import GradientBG from "./gradient-bg";
import HeadingText from "./HeadingText";
import Image from "next/image";
import React from "react";
import { createPortal } from "react-dom";

const Speaker = ({ children }: { children?: React.ReactNode }) => (
  <GradientBG>
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full -z-1 pointer-events-none">
        <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <HeadingText text="Speaker" />
        {children}
      </div>
      <div className="flex flex-col gap-16 mb-20 mt-10">
        <div className="flex justify-center w-full px-4">
          <div className="flex flex-col md:flex-row justify-start items-center md:items-start gap-8 md:gap-14 max-w-6xl w-full">
            <div className="w-full max-w-[420px] relative flex-shrink-0">
              <div
                className="relative rounded-2xl bg-white/10 border border-white/15 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.35)] pt-4 sm:pt-6"
                style={{ backdropFilter: "blur(2px)" }}
              >
                <PopoutStage />

                <div className="px-5 sm:px-6 pt-14 pb-5 bg-[linear-gradient(180deg,rgba(72,186,134,0.08)_0%,rgba(255,255,255,0.06)_100%)] border-t border-white/10">
                  <div className="text-white text-2xl md:text-2xl font-bold font-['Pilat_Extended'] leading-tight tracking-wide">
                    Dr. Meenakshi D&apos;Souza
                  </div>
                  <div className="text-emerald-300 text-lg md:text-xl font-bold font-['Pilat_Extended']">
                    President, ACM India
                  </div>
                </div>
              </div>
            </div>
            <div className="text-white text-base sm:text-lg md:text-2xl tracking-wide z-10 max-w-3xl">
              Dr. Meenakshi D&apos;Souza, President of ACM India Council, is a Professor and Head of
              the Department of Computer Science at IIIT-Bangalore. Over the years, she has taught
              everything from Automata Theory and Algorithms to Software Testing and Graph Theory,
              with her NPTEL course on Software Testing alone reaching more than 57,000 learners.
              With a PhD from the Institute of Mathematical Sciences, Chennai, and prior industry
              experience at Honeywell, she brings a rare blend of academic depth and practical
              perspective, along with a strong commitment to building the computing community in
              India.
            </div>
          </div>
        </div>
      </div>
    </div>
  </GradientBG>
);

export default Speaker;

const PopoutStage: React.FC = () => {
  const anchorRef = React.useRef<HTMLDivElement | null>(null);
  return (
    <>
      <div className="px-5 sm:px-6">
        <div
          ref={anchorRef}
          className="relative h-[240px] sm:h-[260px] md:h-[260px] bg-[#102e2d]/80 rounded-lg"
        />
      </div>
      <PopoutImage anchorRef={anchorRef} />
    </>
  );
};

const PopoutImage: React.FC<{ anchorRef: React.RefObject<HTMLDivElement | null> }> = ({
  anchorRef,
}) => {
  const [mounted, setMounted] = React.useState(false);
  const [rect, setRect] = React.useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const tickingRef = React.useRef(false);

  const measure = React.useCallback(() => {
    const el = anchorRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const snap = (n: number) => Math.round(n * dpr) / dpr;
    return {
      top: snap(r.top),
      left: snap(r.left),
      width: snap(r.width),
      height: snap(r.height),
    };
  }, [anchorRef]);

  const scheduleUpdate = React.useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;
    requestAnimationFrame(() => {
      const next = measure();
      if (next) {
        setRect((prev) => {
          if (
            prev &&
            prev.top === next.top &&
            prev.left === next.left &&
            prev.width === next.width &&
            prev.height === next.height
          ) {
            return prev;
          }
          return next;
        });
      }
      tickingRef.current = false;
    });
  }, [measure]);

  React.useLayoutEffect(() => {
    setMounted(true);
    scheduleUpdate();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const id = requestAnimationFrame(scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      cancelAnimationFrame(id);
    };
  }, [scheduleUpdate]);

  if (!mounted || !rect) return null;

  const style: React.CSSProperties = {
    position: "fixed",
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    pointerEvents: "none",
    zIndex: 20,
  };

  return createPortal(
    <div style={style} aria-hidden>
      <Image
        src="/landing/meenakshimaam.png"
        alt=""
        width={720}
        height={900}
        priority
        className="transform-gpu will-change-transform absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-[10%] sm:-translate-y-[12%] md:-translate-y-[14%] w-[90%] sm:w-[88%] h-auto object-contain drop-shadow-[0_22px_44px_rgba(0,0,0,0.6)] select-none"
      />
    </div>,
    document.body,
  );
};
