"use client";

import Image from "next/image";
import React from "react";

type BannerItem = {
  text: string;
  icon?: string;
  iconAlt?: string;
};

interface QuotesBannerProps {
  items?: BannerItem[];
  className?: string;
}

const QuotesBanner: React.FC<QuotesBannerProps> = ({
  items,
  className = "",
}) => {
  const content: BannerItem[] = items ?? [
    {
      text: "Year-in and year-out, Code2Create has received praise and applause - it is all thanks to the student body that works tirelessly for the smooth sailing of the event.",
      icon: "/landing/google.svg",
      iconAlt: "Google icon",
    },
    {
      text: "Heart-felt Congratulations to your successful event",
      icon: "/landing/github.svg",
      iconAlt: "GitHub icon",
    },
    {
      text: "Celebrating the dedication you've shown on the way to this achievement. You've earned every bit of the success you're enjoying.",
      icon: "/landing/coding-blocks.svg",
      iconAlt: "Coding Blocks logo",
    },
  ];

  return (
    <div
      className={`relative w-full overflow-hidden ${className} shrink-0 flex items-center justify-center min-h-12 sm:min-h-14 py-2`}
      aria-label="Community praise and sponsor banner"
    >
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundColor: "#3F8F68",
          backgroundImage: "url(/landing/bg.svg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          maskImage: "radial-gradient(black, black)",
        }}
      />

      <div className="w-full z-10 relative">
        <div className="hidden md:grid grid-cols-3 items-center gap-x-10 py-2 px-6 lg:px-12">
          <div className="flex items-center gap-2 min-w-0">
            {content[0]?.icon && (
              <Image
                src={content[0].icon!}
                alt={content[0].iconAlt ?? "icon"}
                width={22}
                height={22}
                className="w-5 h-5 shrink-0"
              />
            )}
            <p
              className="m-0 text-sm text-black/90 italic leading-tight"
              style={{ fontFamily: "DM Sans, Arial, sans-serif" }}
            >
              “{content[0]?.text}”
            </p>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            {content[1]?.icon && (
              <Image
                src={content[1].icon!}
                alt={content[1].iconAlt ?? "icon"}
                width={22}
                height={22}
                className="w-5 h-5 shrink-0"
              />
            )}
            <p
              className="m-0 text-sm text-black/90 italic leading-tight"
              style={{ fontFamily: "DM Sans, Arial, sans-serif" }}
            >
              “{content[1]?.text}”
            </p>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            {content[2]?.icon && (
              <Image
                src={content[2].icon!}
                alt={content[2].iconAlt ?? "icon"}
                width={34}
                height={34}
                className="w-8 h-8 lg:w-10 lg:h-10 shrink-0"
              />
            )}
            <p
              className="m-0 text-sm text-black/90 italic leading-tight"
              style={{ fontFamily: "DM Sans, Arial, sans-serif" }}
            >
              “{content[2]?.text}”
            </p>
          </div>
        </div>

        <div className="md:hidden flex flex-col gap-2 py-2 px-4">
          {content.slice(0, 3).map((q, i) => (
            <div key={i} className="flex items-center gap-2">
              {q?.icon && (
                <Image
                  src={q.icon}
                  alt={q.iconAlt ?? "icon"}
                  width={
                    q && q.icon && q.icon.includes("coding-blocks") ? 28 : 18
                  }
                  height={
                    q && q.icon && q.icon.includes("coding-blocks") ? 28 : 18
                  }
                  className={
                    q && q.icon && q.icon.includes("coding-blocks")
                      ? "w-4 h-7 shrink-0"
                      : "w-5 h-5 shrink-0"
                  }
                />
              )}
              <p
                className="m-0 text-[11px] text-black/90 italic leading-tight flex-1"
                style={{ fontFamily: "DM Sans, Arial, sans-serif" }}
              >
                “{q?.text}”
              </p>
            </div>
          ))}
          {/* <div className="flex justify-end pt-1">
            <Image src="/landing/coding-blocks.svg" alt="Coding Blocks" width={100} height={24} className="h-6 w-auto" />
          </div> */}
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 h-px bg-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/20" />
    </div>
  );
};

export default QuotesBanner;
