"use client";
//rishit commit farm krta hai or agar ye commit dekh rha hai to fuck you
import Image from "next/image";
import GradientBG from "./gradient-bg";
import DotGrid from "./dot-grid";
import HeadingText from "./HeadingText";
const TRACKS = [
  {
    number: 1,
    title: "I Can Do It Better",
    desc: "Reimagine and improve widely used software by enhancing usability, adding desired features, or optimizing performance.",
    svgPath: "/tracks/CanDoBetter.svg",
  },
  {
    number: 2,
    title: "Art Attack",
    desc: "Build tools that reimagine creative expression through technologies that help create music, art, or media in new and exciting ways.",
    svgPath: "/tracks/Art_Attack.svg",
  },
  {
    number: 3,
    title: "Game Over",
    desc: "Create experiences that redefine gaming through original games and technologies that improve gameplay, performance, or game development.",
    svgPath: "/tracks/Game_Over.svg",
  },
  {
    number: 4,
    title: "Digital Dawn",
    desc: "Create solutions that uniquely solve Indian challenges at scale, focusing on affordable and inclusive technology for the next billion users.",
    svgPath: "/tracks/Digital_Dawn.svg",
  },
  {
    number: 5,
    title: "AI Solutions",
    desc: "Build intelligent systems using RunPod's compute services to create practical and scalable AI solutions for real-world problems.",
    svgPath: "/tracks/ai_solutions.svg",
  },
];

const Tracks = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative w-full overflow-hidden">
      <GradientBG>
        <div className="relative z-10">
          <HeadingText text="Tracks" />
          {children}
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10">
          <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" className="h-full w-full" />
        </div>
        <div className="w-full max-w-[1080px] mx-auto mt-6 sm:mt-8 px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:gap-6 pb-16">
            {TRACKS.map((card) => (
              <article
                key={card.number}
                className="
                bg-white/10 border border-green-900/40 rounded-[16px] sm:rounded-[20px]
                overflow-hidden
                flex flex-col md:flex-row items-stretch justify-between
                p-4 sm:p-6 md:p-8 gap-4 sm:gap-6 md:gap-8
              "
              >
                {/* Left: text */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                    <h3 className="text-[#efefef] font-bold font-['Trap'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-[#efefef] font-['DM_Sans'] text-base sm:text-lg md:text-xl">
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
                    src={card.svgPath}
                    alt={`${card.title} illustration`}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 45vw, (min-width: 768px) 40vw, 100vw"
                    priority={card.number === 1}
                    loading={card.number === 1 ? "eager" : "lazy"}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </GradientBG>
    </div>
  );
};

export default Tracks;
