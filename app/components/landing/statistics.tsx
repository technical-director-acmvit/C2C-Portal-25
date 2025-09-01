"use client";

import Image from "next/image";
import DotGrid from "./dot-grid";
import GradientBG from "./gradient-bg";

const Statistics = () => {
  return (
    <GradientBG>
      <div id="stats" className="w-full min-h-screen relative overflow-hidden">
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
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-1 md:px-4">
          {/* Stats Image */}
          <div className="w-full flex justify-center items-center">
            <Image
              src="/landing/statistics.png"
              alt="ACM Stats"
              width={1800}
              height={1200}
              className="w-full max-w-8xl h-auto pointer-events-auto py-0 md:py-12"
              draggable={false}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
        </div>
      </div>
    </GradientBG>
  );
};

export default Statistics;