"use client";

import Image from "next/image";
import DotGrid from "./dot-grid";
import GradientBG from "./gradient-bg";
import HeadingText from "./HeadingText";

const About = ({ children }: { children?: React.ReactNode }) => (
  <div className="w-screen h-auto">
    <GradientBG>
      <div className="w-full h-auto relative overflow-hidden">
        <HeadingText text="About ACM" />

        {/* Background grid */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <DotGrid
            dotSize={2.5}
            gap={25}
            baseColor="#a3a3a3"
            className="h-full w-full"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-4 space-y-16 sm:space-y-20">
          {/* Logo */}
          <Image
            src="/landing/acm-nature-logo.svg"
            alt="ACM Logo With Name"
            width={200}
            height={80}
            className="pointer-events-auto"
            draggable={false}
            loading="lazy"
          />

          {/* Intro paragraph */}
          <div
            className="w-full max-w-[794px] text-justify text-zinc-100 text-lg sm:text-xl md:text-2xl leading-7 sm:leading-8 md:leading-9 font-thin"
          >
            As the official student chapter of the Association for Computing
            Machinery at VIT Vellore, we&apos;ve been pushing boundaries and
            challenging conventions since 2009. From research and development to
            open-source contributions and unorthodox events, we turn ideas into
            real-world impact. We don&apos;t just write code; we ask questions,
            build with purpose, and learn together. With a culture built on
            trust and innovation, we&apos;re here to build tools, solve
            problems, and grow as a community: because technology, at its best,
            brings people together.
          </div>

          {/* First Hero Line */}
          <h1
            className="text-center break-words hyphens-auto text-hollow"
            style={{
              WebkitTextStroke: "1.5px #48ba86",
              fontFamily: "Trap-Bold, Arial, sans-serif",
              fontSize: "clamp(24px, 5.2vw, 77px)",
              fontWeight: "700",
              lineHeight: "clamp(110%, 6vw, 130%)",
              color: "transparent",
            }}
          >
        Break things, fix things,
        <br />
         and build things
          </h1>

          {/* Secondary Paragraph */}
          <div className="w-full max-w-[900px] text-justify text-zinc-100 text-lg sm:text-xl md:text-2xl leading-7 sm:leading-8 md:leading-9 font-normal font-['DM_Sans']">
            Bring your ideas, your laptop, and maybe some snacks. Code2Create is an adventure to experiment, learn from others, and see what you can make when you just try.
          </div>

          {/* Decorative SVG */}
          {/* <div className="absolute left-0 bottom-0 z-10 pointer-events-none select-none hidden md:block">
          </div> */}

          {/* Second Hero Line */}
          <h1
            className="text-center break-words hyphens-auto pt-0 sm:pt-8 md:pt-16 mt-1 sm:mt-8 md:mt-16"
            style={{
              WebkitTextStroke: "1.5px #48ba86",
              fontFamily: "Trap-Bold, Arial, sans-serif",
              fontSize: "clamp(24px, 5.2vw, 77px)",
              fontWeight: "700",
              lineHeight: "clamp(110%, 6vw, 130%)",
              color: "transparent",
            }}
          >
            A look at Code2Create&apos;s 
            <br />
            notable legacy
          </h1>

          {/* Children (Tracks) */}
          {children}
        </div>
      </div>
    </GradientBG>
  </div>
);

export default About;
