"use client";
import Image from "next/image";

//todo align all social icons properly, the linkedin one is not and kinda ocding me
const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/CY2sygnhYk";

const Footer = () => {
  return (
    <footer className="relative w-full h-auto md:h-[1300px] overflow-hidden">
      {/* Foreground overlay of the same background (above base bg, below content) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/footer/footer-hills 1.png"
          alt="Footer Background Overlay"
          fill
          className="w-full h-full object-cover opacity-100 pt-84"
          priority
        />
      </div>

      {/* Divider line */}
      <div className="w-full md:w-[1438.01px] h-0 outline outline-1 outline-offset-[-0.5px] outline-white mx-auto" />

      {/* Logo row under divider */}
      <div className="w-full flex items-center justify-center py-4 sm:py-6 md:py-8 px-4">
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 flex-wrap">
          <Image
            src="/footer/c2c-logo-art.svg"
            alt="Code2Create with name"
            width={160}
            height={40}
            className="h-6 sm:h-7 md:h-10 w-auto"
            priority
          />
          <Image
            src="/footer/ACM-logo-green.svg"
            alt="ACM green logo"
            width={78}
            height={78}
            className="h-7 sm:h-8 md:h-10 w-auto"
            priority
          />
          <Image
            src="/footer/Hand.svg"
            alt="Hand icon"
            width={62}
            height={85}
            className="h-8 sm:h-9 md:h-10 w-auto"
            priority
          />
        </div>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 flex flex-col min-h-[60vh] pb-0">
        <div className="flex-grow flex flex-col md:flex-row items-start md:items-start justify-between px-4 sm:px-6 md:px-16 pt-4 sm:pt-6 gap-6 sm:gap-8">
          {/* Left Section */}
          <div className="flex-shrink-0 w-full md:w-auto">
            <div
              className="text-[#48ba86] text-base sm:text-lg md:text-xl font-bold leading-tight text-center md:text-left"
              style={{ fontFamily: "Trap" }}
            >
              Code2Create
            </div>

            {/* Status and Map - Hidden on mobile */}
            <div className="hidden md:flex md:flex-col items-start justify-start gap-0 mt-4 sm:mt-6">
              {/* Status pill */}
              <div className="w-fit p-1 relative flex items-center border border-zinc-100 rounded-full px-2 pr-3 sm:pr-4">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full shadow-[0_0_8px_2px_rgba(72,186,134,1)] animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                <div
                  className="ml-2 text-zinc-100 text-xs sm:text-sm font-thin whitespace-nowrap"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  All systems online
                </div>
              </div>

              {/* Map */}
              <div className="relative w-52 h-36 mt-4">
                <a
                  href="https://w3w.co/static.grips.limelight"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/footer/VIT-Map.png"
                    alt="VIT Map"
                    fill
                    className="object-cover rounded-lg shadow-lg border border-zinc-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 w-full h-full opacity-50 bg-gradient-to-b from-white to-green-400 rounded-lg pointer-events-none" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 md:flex md:flex-wrap md:justify-start w-full md:w-auto">
            {/* ABOUT */}
            <div className="w-full sm:w-40 md:w-24 flex flex-col gap-2 sm:gap-3 md:gap-4">
              <div
                className="text-[#48ba86] text-xs sm:text-sm md:text-base font-light uppercase"
                style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
              >
                ABOUT
              </div>
              <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
                <a
                  href="#about"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  C2C
                </a>
                <a
                  href="#about"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  ACM
                </a>
                <a
                  href="#tracks"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  TRACKS
                </a>
              </div>
            </div>

            {/* TRACKS */}
            <div className="w-full sm:w-48 md:w-44 flex flex-col gap-2 sm:gap-3 md:gap-4">
              <div
                className="text-[#48ba86] text-xs sm:text-sm md:text-base font-light uppercase"
                style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
              >
                TRACKS
              </div>
              <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
                <a
                  href="#tracks"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  AI SOLUTIONS
                </a>
                <a
                  href="#tracks"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  ART ATTACK
                </a>
                <a
                  href="#tracks"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  DIGITAL DAWN
                </a>
                <a
                  href="#tracks"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  I CAN DO IT BETTER
                </a>
                <a
                  href="#tracks"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  GAME OVER
                </a>
              </div>
            </div>

            {/* GUESTS */}
            {/* <div className="w-full sm:w-40 md:w-36 flex flex-col gap-3 md:gap-4">
              <div className="text-[#48ba86] text-sm md:text-base font-light font-['PolySans_Trial'] uppercase">GUESTS</div>
              <div className="flex flex-col gap-1.5 md:gap-2">
              {["DJ ISAAC", "H M EHRZAAD", "MEENAKSHI"].map((item) => (
                <span key={item} className="text-white text-sm md:text-base font-light font-['PolySans_Trial'] uppercase">
                {item}
                </span>
              ))}
              </div>
            </div> */}

            {/* OUR PRODUCTS */}
            <div className="w-full sm:w-40 md:w-28 flex flex-col gap-2 sm:gap-3 md:gap-4">
              <div
                className="text-[#48ba86] text-xs sm:text-sm md:text-base font-light uppercase"
                style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
              >
                OUR PROJECTS
              </div>
              <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
                <a
                  href="https://acmone.acmvit.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  ACMONE
                </a>
                <a
                  href="https://cli-rpg.acmvit.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  CLI-RPG
                </a>
                <a
                  href="https://examcooker.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  EXAMCOOKER
                </a>
                <a
                  href="https://cli-top.acmvit.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  CLITOP
                </a>
                <a
                  href="https://localhost.acmvit.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  LOCALHOST
                </a>
                <a
                  href="https://os.acmvit.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  OCS
                </a>
                <a
                  href="https://unipool.acmvit.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  UNIPOOL
                </a>
              </div>
            </div>

            {/* SPONSORS */}
            <div className="w-full sm:w-28 md:w-20 flex flex-col gap-2 sm:gap-3 md:gap-4">
              <div
                className="text-[#48ba86] text-xs sm:text-sm md:text-base font-light uppercase"
                style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
              >
                SPONSORS
              </div>
              <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
                <a
                  href="https://runpod.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors"
                  style={{ fontFamily: "PolySans Trial, Arial, sans-serif" }}
                >
                  RUNPOD
                </a>
                {/* <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-white text-xs sm:text-sm md:text-base font-light uppercase hover:text-yellow-50 transition-colors" style={{ fontFamily: 'PolySans Trial, Arial, sans-serif' }}>
                  ElevenLabs
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full flex flex-col items-center justify-center relative px-4">
        <div className="flex flex-col items-center justify-center mb-4 z-30 relative">
          <p className="text-white text-xs sm:text-sm md:text-xl mb-6 sm:mb-8 md:mb-12 text-center">
            © 2025 ACM-VIT. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex flex-row items-center gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12 flex-wrap justify-center">
            {[
              {
                href: "https://www.facebook.com/acmvitvellore",
                src: "/footer/Facebook.svg",
                alt: "Facebook",
              },
              { href: "https://x.com/acm_vit", src: "/footer/Twitter.svg", alt: "Twitter" },
              {
                href: "https://www.instagram.com/acmvit",
                src: "/footer/Instagram.svg",
                alt: "Instagram",
              },
              { href: DISCORD_URL, src: "/footer/discord.svg", alt: "Discord" },
              { href: "https://medium.com/acmvit", src: "/footer/Medium.svg", alt: "Medium" },
              {
                href: "https://www.linkedin.com/company/acmvit",
                src: "/footer/Linkedin.svg",
                alt: "Linkedin",
              },
              {
                href: "https://www.youtube.com/@acm_vit",
                src: "/footer/youtube icon.svg",
                alt: "YouTube",
              },
            ].map(({ href, src, alt }) => (
              <a key={alt} href={href} target="_blank" rel="noopener noreferrer" className="group">
                <div
                  className={`relative ${alt === "Twitter" || alt === "YouTube" || alt === "Discord" ? "w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" : "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"}`}
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className={`object-contain ${alt === "YouTube" ? "rounded" : ""} transition-transform group-hover:scale-110`}
                    sizes="(min-width:1024px) 56px, (min-width:640px) 48px, 40px"
                    loading="lazy"
                  />
                </div>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 pt-4 sm:pt-6 md:pt-8">
            <Image
              src="/footer/pixel-heart.svg"
              alt="pixel heart"
              width={36}
              height={36}
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-9 md:h-9"
              loading="lazy"
            />
            <span
              className="text-white text-sm sm:text-xl md:text-4xl text-center"
              style={{ fontFamily: "Trap-Bold" }}
            >
              crafted with love by ACM-VIT
            </span>
          </div>

          {/* C2C heading: mobile-optimized and desktop-original */}
          <h1
            className="text-center break-words hyphens-auto py-6 sm:py-8 md:hidden"
            style={{
              WebkitTextStroke: "2px #ffffffff",
              fontFamily: "Trap-Bold, Arial, sans-serif",
              fontSize: "clamp(60px, 18vw, 140px)",
              fontWeight: "200",
              lineHeight: "1",
              color: "transparent",
              letterSpacing: "0.05em",
              textShadow: "0 8px 32px rgba(0,0,0,0.25)",
            }}
          >
            C2C
          </h1>
          <h1
            className="hidden md:block text-center break-words hyphens-auto py-14"
            style={{
              WebkitTextStroke: "4px #ffffffff",
              fontFamily: "Trap-Bold, Arial, sans-serif",
              fontSize: "clamp(200px, 35vw, 600px)",
              fontWeight: "200",
              lineHeight: "clamp(110%, 8vw, 100%)",
              color: "transparent",
              letterSpacing: "0.05em",
              textShadow: "0 12px 48px rgba(0,0,0,0.25)",
            }}
          >
            C2C
          </h1>
        </div>

        {/* Big background text
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-20 md:-bottom-28 -z-10 text-neutral-400 text-[80px] sm:text-[120px] md:text-[160px] lg:text-[240px] xl:text-[568.78px] font-bold leading-none opacity-100 select-none pointer-events-none"
          style={{ lineHeight: "0.8", fontFamily: 'PolySans Trial, Arial, sans-serif' }}
        >
          acm
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
