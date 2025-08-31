"use client";
import Image from "next/image";
import Topper from "./topper";

const TRACKS = [
  {
    number: 1,
    title: "Web Development",
    desc: "Learn modern web technologies",
  },
  { number: 2, title: "App Development", desc: "Create mobile applications" },
  { number: 3, title: "Cloud Computing", desc: "Master cloud infrastructure" },
  { number: 4, title: "AI & ML", desc: "Explore artificial intelligence" },
  { number: 5, title: "Cybersecurity", desc: "Secure digital systems" },
];

const Tracks = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative z-10">
        <Topper text="Tracks" />
        {children}
      </div>

      <div className="w-full max-w-[1080px] mx-auto mt-6 sm:mt-8 px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:gap-6">
          {TRACKS.map((card) => (
            <article
              key={card.number}
              className="
                bg-[#efefef] border border-green-900/40 rounded-[16px] sm:rounded-[20px]
                overflow-hidden
                flex flex-col md:flex-row items-stretch justify-between
                p-4 sm:p-6 md:p-8 gap-4 sm:gap-6 md:gap-8
              "
            >
              {/* Left: text */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#48BA86]">
                    #{card.number}
                  </span>
                  <h3 className="text-[#1e1e1e] font-bold font-['Trap'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                    {card.title}
                  </h3>
                </div>
                <p className="text-[#1e1e1e] font-['DM_Sans'] text-base sm:text-lg md:text-xl">
                  {card.desc}
                </p>
              </div>

              {/* Right: image */}
              <div
                className="
                  relative
                  w-full md:w-[42%]
                  aspect-[5/3] sm:aspect-[4/3] md:aspect-[1/1]
                  self-center md:self-auto
                "
              >
                <Image
                  src="/landing/track.svg"
                  alt={`${card.title} illustration`}
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 45vw, (min-width: 768px) 40vw, 100vw"
                  priority={card.number === 1}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracks;
