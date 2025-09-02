"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stickyImageRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const isMobileRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    isMobileRef.current = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobileRef.current) return;

    const triggers: ScrollTrigger[] = [];

    if (containerRef.current && stageRef.current) {
      const endAdd = () => window.innerHeight * 0.7 * Math.max(1, content.length - 1);

      const t = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top center",
        end: () => "+=" + endAdd(),
        pin: stageRef.current,
        scrub: 0.2,
        snap: {
          snapTo: (value) => {
            // value is 0..1 progress; snap to item steps
            const steps = content.length - 1;
            if (steps <= 0) return 0;
            return Math.round(value * steps) / steps;
          },
          duration: 0.2,
          ease: "power1.inOut",
        },
        onUpdate: (self) => {
          const steps = content.length - 1;
          const idx = steps > 0 ? Math.round(self.progress * steps) : 0;
          if (idx !== activeCard) setActiveCard(idx);
        },
        // markers: true,
      });
      triggers.push(t);
    }

    return () => {
      triggers.forEach((tr) => tr.kill());
    };
  }, [content.length]);

  useEffect(() => {
    if (stickyImageRef.current) {
      gsap.fromTo(
        stickyImageRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" },
      );
    }
    if (textWrapRef.current) {
      gsap.fromTo(
        textWrapRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      );
    }
  }, [activeCard]);

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={stageRef}
        className="relative grid lg:grid-cols-[minmax(0,1fr)_360px] gap-10 items-center"
      >
        <article className="bg-white/10 border border-green-900/40 rounded-[16px] sm:rounded-[20px] overflow-hidden p-4 sm:p-5 md:p-6 w-full">
          <div ref={textWrapRef}>
            <h3 className="text-[#efefef] font-bold font-['Trap'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              {content[activeCard]?.title}
            </h3>
            <p className="text-[#efefef] font-['DM_Sans'] text-base sm:text-lg md:text-xl mt-4">
              {content[activeCard]?.description}
            </p>
          </div>
        </article>

        <div className={cn("hidden lg:block w-full h-[360px]", contentClassName)}>
          <div ref={stickyImageRef} className="relative w-full h-full">
            {content[activeCard]?.content || content[0]?.content}
          </div>
        </div>
      </div>
    </div>
  );
};
