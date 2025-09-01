'use client';
import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

type Props = { children: React.ReactNode };

export default function ScrollSmootherProvider({ children }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
      wrapper: '.smooth-wrapper',
      content: '.smooth-content',
      smooth: 1, 
      effects: true,
    });

    ScrollTrigger.refresh();

    return () => {
      try {
        if (smoother) {
          smoother.kill();
        }
        ScrollTrigger.getAll().forEach(t => t.kill());
      } catch {
        // ignore errors during cleanup
      }
    };
  }, []);

  return (
    <div className="smooth-wrapper">
      <div className="smooth-content">{children}</div>
    </div>
  );
}