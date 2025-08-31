"use client";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden">
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

      {/* Divider line */}
      <div className="w-[1438.01px] h-0 outline outline-1 outline-offset-[-0.5px] outline-white mx-auto"></div>

      {/* Footer Content */}
      <div className="relative z-10 flex flex-col min-h-[60vh] pb-0">
        <div className="flex-grow flex items-start justify-between px-6 sm:px-10 md:px-16 pt-6">
          {/* Left Section */}
          <div className="flex-shrink-0">
            <div className="text-yellow-50 text-xl font-bold font-['PolySans_Trial'] leading-tight">
              association for
              <br />
              computing machinery
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
              </a>
              <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-white to-red-500 rounded-lg pointer-events-none"></div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="flex justify-start items-start gap-8 flex-wrap">
            {/* About */}
            <div className="w-16 flex flex-col gap-4">
              <div className="text-yellow-50 text-base font-light font-['PolySans_Trial'] uppercase">
                About
              </div>
              <div className="flex flex-col gap-2">
                {["ACM-VIT", "VIT", "ACM"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-white text-base font-light font-['PolySans_Trial'] uppercase hover:text-yellow-50 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Domains */}
            <div className="w-44 flex flex-col gap-4">
              <div className="text-yellow-50 text-base font-light font-['PolySans_Trial'] uppercase">
                Domains
              </div>
              <div className="flex flex-col gap-2">
                {[
                  "App",
                  "competitive coding",
                  "design",
                  "management",
                  "research",
                  "web",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-white text-base font-light font-['PolySans_Trial'] uppercase hover:text-yellow-50 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Events */}
            <div className="w-36 flex flex-col gap-4">
              <div className="text-yellow-50 text-base font-light font-['PolySans_Trial'] uppercase">
                Events
              </div>
              <div className="flex flex-col gap-2">
                {[
                  "Code2CREATE",
                  "CRYPTIC HUNT",
                  "REVERSE CODING",
                  "CODEX CRYPTUM",
                  "FORKTOBER",
                  "THE TINY HACK",
                  "APPTITUDE",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-white text-base font-light font-['PolySans_Trial'] uppercase hover:text-yellow-50 transition-colors"
                  >
                    {item}
                  </a>
                ))}
                <a
                  href="#"
                  className="text-red-500 text-base font-light font-['PolySans_Trial'] uppercase hover:text-red-400 transition-colors"
                >
                  MORE
                </a>
              </div>
            </div>

            {/* Projects */}
            <div className="w-24 flex flex-col gap-4">
              <div className="text-yellow-50 text-base font-light font-['PolySans_Trial'] uppercase">
                Projects
              </div>
              <div className="flex flex-col gap-2">
                {[
                  "ACMONE",
                  "CLI-RPG",
                  "EXAMCOOKER",
                  "CLITOP",
                  "LOCALHOST",
                  "OS",
                  "UNIPOOL",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-white text-base font-light font-['PolySans_Trial'] uppercase hover:text-yellow-50 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* ACM-W */}
            <div className="w-16 flex flex-col gap-4">
              <div className="text-yellow-50 text-base font-light font-['PolySans_Trial'] uppercase">
                ACM-W
              </div>
              <div className="flex flex-col gap-2">
                {["about w", "events"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-white text-base font-light font-['PolySans_Trial'] uppercase hover:text-yellow-50 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* More */}
            <div className="w-24 flex flex-col gap-4">
              <div className="text-red-500 text-base font-light font-['PolySans_Trial'] uppercase">
                More
              </div>
              <div className="flex flex-col gap-2">
                {["team", "blogs", "partners", "gallery", "contact us"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-white text-base font-light font-['PolySans_Trial'] uppercase hover:text-yellow-50 transition-colors"
                    >
                      {item}
                    </a>
                  )
                )}
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

          <div className="flex items-center gap-2">
            <Image
              src="/footer/pixel-heart.svg"
              alt="pixel heart"
              width={24}
              height={24}
            />
            <span className="text-white text-base font-['PolySans_Trial']">
              crafted with love by ACM-VIT
            </span>
          </div>
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
