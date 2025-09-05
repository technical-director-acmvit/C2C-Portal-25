"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export const cardsData = [
  {
    title: "Track 1",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Track 2",
    desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "Track 3",
    desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    title: "Track 4",
    desc: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    title: "Track 5",
    desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  },
];

interface RevolvingCardsProps {
  currentTrack: number;
}

export default function RevolvingCards({ currentTrack }: RevolvingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = Array.from(containerRef.current.children) as HTMLElement[];
    const total = cards.length;
    const radius = 180; // px, distance from center
    const centerY = 200; // px, vertical center

    cards.forEach((card, i) => {
      const angle = (i - currentTrack) * (360 / total) * (Math.PI / 180);
      const x = Math.sin(angle) * radius;
      const y = Math.cos(angle) * radius;

      // Calculate depth for 3D effect
      const z = Math.cos(angle) * -100;

      gsap.to(card, {
        x,
        y: y - centerY + 200,
        z,
        scale: i === currentTrack ? 1 : 0.8,
        opacity: i === currentTrack ? 1 : 0.4,
        zIndex: i === currentTrack ? 10 : 1,
        rotationY: angle * (180 / Math.PI) * 0.3, // Subtle 3D rotation
        duration: 0.8,
        ease: "power3.out",
      });
    });
  }, [currentTrack]);

  return (
    <div
      className="relative w-[370px] h-full flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      <div ref={containerRef} className="absolute w-full h-full">
        {cardsData.map((card, i) => (
          <div
            key={i}
            className="absolute w-[340px] h-[420px] bg-gradient-to-br from-black/90 via-green-900/80 to-[#48BA86] rounded-3xl p-8 flex flex-col items-center justify-start shadow-2xl backdrop-blur-sm border border-green-500/20"
            style={{
              willChange: "transform, opacity",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="w-full h-16 bg-green-500/20 rounded-xl mb-6 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-green-400"></div>
            </div>
            <h3 className="text-white text-2xl font-bold mb-4 text-center">{card.title}</h3>
            <p className="text-white/90 text-sm leading-relaxed text-center px-2">{card.desc}</p>

            {/* Decorative elements */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2">
                {[...Array(3)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${idx === 1 ? "bg-green-400" : "bg-white/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
