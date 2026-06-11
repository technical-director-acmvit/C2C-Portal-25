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

    const mq = window.matchMedia("(min-width: 1024px)");
    const triggers: ScrollTrigger[] = [];

    const setup = () => {
      if (!containerRef.current || !stageRef.current) return;
      const endAdd = () => window.innerHeight * 0.7 * Math.max(1, content.length - 1);
      const t = ScrollTrigger.create({
        trigger: containerRef.current,
        // Pin when the (100vh) stage reaches the top of the viewport. We must
        // NOT use "center center" here: once ScrollTrigger inserts the pin
        // spacer, the trigger's measured height balloons to the full pin
        // distance, so "center" resolves to a scroll position long after the
        // stage has already scrolled off-screen. The result was the stage
        // never visibly pinning — it stayed stuck on the first track while a
        // tall empty band (the unused spacer) scrolled past underneath.
        start: "top top",
        end: () => "+=" + endAdd(),
        pin: stageRef.current,
        scrub: 0.2,
        invalidateOnRefresh: true,
        // No snap — the snap step was producing an irritating mid-scroll jerk
        // when the viewport sat near the breakpoint. The scrubbed pin alone
        // already drives the activeCard updates smoothly.
        onUpdate: (self) => {
          const steps = content.length - 1;
          const idx = steps > 0 ? Math.round(self.progress * steps) : 0;
          setActiveCard(idx);
        },
      });
      triggers.push(t);
      // Recompute start/end once layout has settled. The sections above (hero,
      // images, fonts) change height after mount, which would otherwise leave
      // the pin range anchored to a stale scroll position.
      ScrollTrigger.refresh();
    };

    const teardown = () => {
      while (triggers.length) triggers.pop()?.kill();
    };

    const apply = () => {
      isMobileRef.current = !mq.matches;
      teardown();
      if (mq.matches) setup();
    };

    apply();
    mq.addEventListener("change", apply);

    return () => {
      mq.removeEventListener("change", apply);
      teardown();
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
      <div ref={stageRef} className="relative h-screen">
        <div className="absolute inset-0 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-10 items-center place-items-center px-4">
          <article className="bg-white/10 border border-green-900/40 rounded-[16px] sm:rounded-[20px] overflow-hidden p-4 sm:p-5 md:p-6 w-full max-w-[900px]">
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
    </div>
  );
};
