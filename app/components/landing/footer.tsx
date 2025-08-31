"use client";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="relative w-full h-[1300px] overflow-hidden">
      {/* Background image behind all content */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/footer/footer-background.svg"
          alt="Footer Background"
          fill
          className="w-full h-full object-cover"
          priority
        />
      </div>

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
      <div className="w-[1438.01px] h-0 outline outline-1 outline-offset-[-0.5px] outline-white mx-auto"></div>

      {/* Logo row under divider */}
      <div className="w-full flex items-center justify-center py-8">
        <div className="flex items-center justify-center gap-6 sm:gap-8">
          <Image
            src="/footer/c2c-logo-art.svg"
            alt="Code2Create with name"
            width={160}
            height={40}
            className="h-8 sm:h-10 w-auto"
            priority
          />
          <Image
            src="/footer/ACM-logo-green.svg"
            alt="ACM green logo"
            width={78}
            height={78}
            className="h-9 sm:h-10 w-auto"
            priority
          />
          <Image
            src="/footer/Hand.svg"
            alt="Hand icon"
            width={62}
            height={85}
            className="h-10 sm:h-12 w-auto"
            priority
          />
        </div>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 flex flex-col min-h-[60vh] pb-0">
        <div className="flex-grow flex items-start justify-between px-6 sm:px-10 md:px-16 pt-6">
          {/* Left Section */}
          <div className="flex-shrink-0">
            <div className="text-[#48ba86] text-xl font-bold leading-tight" style={{ fontFamily: "Trap" }}>
              Code2Create
            </div>

            {/* Status pill */}
            <div className="w-fit my-4 relative flex items-center border border-zinc-100 rounded-full px-2 pr-4">
              <div className="w-4 h-4 bg-green-400 rounded-full shadow-[0_0_8px_2px_rgba(72,186,134,1)] animate-[pulse_1.5s_ease-in-out_infinite]"></div>
              <div className="ml-2 text-zinc-100 text-sm font-thin font-['PolySans_Trial'] whitespace-nowrap">
                All systems online
              </div>
            </div>

            {/* Map */}
            <div className="mt-6 relative w-52 h-36">
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
              />
              <div className="absolute inset-0 w-52 h-36 opacity-50 bg-gradient-to-b from-white to-green-400 rounded-lg pointer-events-none" />
              </a>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="flex justify-start items-start gap-8 flex-wrap">
            {/* ABOUT */}
            <div className="w-24 flex flex-col gap-4">
              <div className="text-[#48ba86] text-base font-light font-['PolySans_Trial'] uppercase">ABOUT</div>
              <div className="flex flex-col gap-2">
                {["C2C", "ACM", "TRACKS"].map((item) => (
                  <a key={item} href="#" className="text-white text-base font-light font-['PolySans_Trial'] uppercase hover:text-yellow-50 transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* TRACKS */}
            <div className="w-44 flex flex-col gap-4">
              <div className="text-[#48ba86] text-base font-light font-['PolySans_Trial'] uppercase">TRACKS</div>
              <div className="flex flex-col gap-2">
              {["Al SOLUTONS", "ART ATTACK", "DIGITAL DAWN", "I CAN DO IT BETTER", "GAME OVER"].map((item) => (
                <span key={item} className="text-white text-base font-light font-['PolySans_Trial'] uppercase">
                {item}
                </span>
              ))}
              </div>
            </div>

            {/* GUESTS */}
            <div className="w-36 flex flex-col gap-4">
              <div className="text-[#48ba86] text-base font-light font-['PolySans_Trial'] uppercase">GUESTS</div>
              <div className="flex flex-col gap-2">
              {["DJ ISAAC", "H M EHRZAAD", "MEENAKSHI"].map((item) => (
                <span key={item} className="text-white text-base font-light font-['PolySans_Trial'] uppercase">
                {item}
                </span>
              ))}
              </div>
            </div>

            {/* OUR PRODUCTS */}
            <div className="w-28 flex flex-col gap-4">
              <div className="text-[#48ba86] text-base font-light font-['PolySans_Trial'] uppercase">OUR PRODUCTS</div>
              <div className="flex flex-col gap-2">
                {["ACMONE", "CLI-RPG", "EXAMCOOKER", "CLITOP", "LOCALHOST", "os", "UNIPOOL"].map((item) => (
                  <a key={item} href="#" className="text-white text-base font-light font-['PolySans_Trial'] uppercase hover:text-yellow-50 transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* TIMELINE */}
            {/* <div className="w-28 flex flex-col gap-4">
              <div className="text-[#48ba86] text-base font-light font-['PolySans_Trial'] uppercase">TIMELINE</div>
              <div className="flex flex-col gap-2">
                {["ACMONE", "CLI-RPG", "EXAMCOOKER", "CLITOP", "LOCALHOST", "os", "UNIPOOL"].map((item) => (
                  <a key={item} href="#" className="text-white text-base font-light font-['PolySans_Trial'] uppercase hover:text-yellow-50 transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div> */}

            {/* SPONSORS */}
            <div className="w-20 flex flex-col gap-4">
              <div className="text-[#48ba86] text-base font-light font-['PolySans_Trial'] uppercase">SPONSORS</div>
              <div className="flex flex-col gap-2">
                {["ABOUT W", "EVENTS"].map((item) => (
                  <a key={item} href="#" className="text-white text-base font-light font-['PolySans_Trial'] uppercase hover:text-yellow-50 transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full flex flex-col items-center justify-center relative">
        <div className="flex flex-col items-center justify-center mb-4 z-30 relative">
          <p className="text-white text-xl mb-12">
            © 2025 ACM-VIT. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex flex-row items-center gap-4 mb-12">
            {[
              {
                href: "https://www.facebook.com/acmvitvellore",
                src: "/footer/Facebook.svg",
                alt: "Facebook",
                w: 56,
                h: 48,
              },
              {
                href: "https://x.com/acm_vit",
                src: "/footer/Twitter.svg",
                alt: "Twitter",
                w: 40,
                h: 32,
              },
              {
                href: "https://www.instagram.com/acmvit",
                src: "/footer/Instagram.svg",
                alt: "Instagram",
                w: 56,
                h: 48,
              },
              {
                href: "https://medium.com/acmvit",
                src: "/footer/Medium.svg",
                alt: "Medium",
                w: 56,
                h: 48,
              },
              {
                href: "https://www.linkedin.com/company/acmvit",
                src: "/footer/Linkedin.svg",
                alt: "Linkedin",
                w: 56,
                h: 48,
              },
              {
                href: "https://www.youtube.com/@acm_vit",
                src: "/footer/youtube icon.png",
                alt: "YouTube",
                w: 28,
                h: 28,
              },
            ].map(({ href, src, alt, w, h }) => (
              <a
                key={alt}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={src}
                  alt={alt}
                  width={w}
                  height={h}
                  className={`${
                    alt === "YouTube" ? "rounded" : ""
                  } hover:scale-110 transition-transform`}
                />
              </a>
            ))}
          </div>

            <div className="flex items-center gap-3 pt-8">
              <Image
              src="/footer/pixel-heart.svg"
              alt="pixel heart"
              width={36}
              height={36}
              className="w-9 h-9"
              />
              <span
              className="text-white text-4xl"
              style={{ fontFamily: "Trap-Bold" }}
              >
              crafted with love by ACM-VIT
              </span>
            </div>

            <h1
              className="text-center break-words hyphens-auto py-16"
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

        {/* Big background text */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-28 -z-10 text-neutral-400 text-[568.78px] font-bold font-['PolySans_Trial'] leading-none opacity-100 select-none pointer-events-none"
          style={{ lineHeight: "0.8" }}
        >
          acm
        </div>
      </div>
    </footer>
  );
};

export default Footer;
