import Image from "next/image";
import DotGrid from "./dot-grid";
import GradientBG from "./gradient-bg";
import Topper from "./topper";
import QuotesBanner from "./quotes-banner";
import HeadingText from "./HeadingText";
const About = ({ children }: { children?: React.ReactNode }) => (
  <div className="h-full w-full pt-3">
    <GradientBG>
      {/* Use <section> for semantics + anchor target */}
      <section
        id="about"
        className="relative w-full overflow-hidden min-h-[100svh] flex flex-col justify-between"
      >
        <HeadingText text="About Code2Create" />
        <div className="pointer-events-none absolute inset-0 -z-10 h-full">
          <DotGrid
            dotSize={2.5}
            gap={25}
            baseColor="#a3a3a3"
            className="h-full w-full"
          />
        </div>
        {/* Content container */}
        <div
          className="
          relative z-20
          mx-auto
          px-4 sm:px-6 lg:px-8
          pb-16 sm:pb-20 lg:pb-28
          flex flex-col items-center justify-center
          min-h-[60svh] lg:min-h-0
        "
        >
          <div
            className="
            w-full
            max-w-prose md:max-w-[880px] lg:max-w-[994px]
            text-zinc-100
            text-pretty break-words hyphens-auto
            text-base sm:text-lg md:text-xl lg:text-2xl
            leading-[1.6] sm:leading-8 md:leading-9
            flex items-start justify-center flex-col
          "
            style={{ fontFamily: "DM Sans, Arial, sans-serif" }}
          >
            <p className="mb-4">
              Code2Create is ACM-VIT&apos;s flagship 48-hour national hackathon open
              to participants from colleges across India. C2C is all about
              pushing boundaries and building innovative projects.
            </p>
            <p className="mb-4">
              With multiple tracks to suit diverse interests, the event brings
              together participants to take on real-world challenges, team up
              with peers and learn from industry mentors.
            </p>
            <p className="mb-4">
              It&apos;s a space where creativity meets skill and young developers get
              to showcase their talent.
            </p>
            <p className="mb-4">
              Whether you&apos;re someone who&apos;s just beginning to build your skill
              set or aiming to claim your next hackathon prize, C2C is the right
              event for you.
            </p>
            <p className="">
              Be part of a culture where we don&apos;t just code for the vibes, we
              code to create.
            </p>
          </div>

          {/* Optional extra content passed in */}
          {children && (
            <div className="mt-6 sm:mt-8 md:mt-10 w-full max-w-prose md:max-w-[880px] lg:max-w-[994px]">
              {children}
            </div>
          )}
        </div>
        {/* Decorative HDMI image — responsive sizing via wrapper + fill */}
        <div className="hidden sm:block absolute right-2 sm:right-4 bottom-2 sm:bottom-4 z-30 pointer-events-none select-none w-40 sm:w-56 md:w-72 lg:w-80 aspect-[450/355]">
          <Image
            src="/landing/hdmi.svg"
            alt="HDMI Decorative"
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 224px, 160px"
            className="object-contain"
            priority={false}
            draggable={false}
          />
        </div>
        <QuotesBanner className="shrink-0" />
      </section>
    </GradientBG>
  </div>
);

export default About;
