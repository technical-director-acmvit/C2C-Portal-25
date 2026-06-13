"use client";

import React, { type CSSProperties, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InteractiveHoverButton } from "@/app/components/landing/ui/cta-button";
import { REGISTRATIONS_OPEN } from "@/lib/env";

type TopBarProps = {
  onUpcomingEdition?: () => void;
};

export default function TopBar({ onUpcomingEdition }: TopBarProps = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // lock body scroll when mobile menu is open
    if (typeof window !== "undefined") {
      document.body.style.overflow = menuOpen ? "hidden" : "";
    }
    return () => {
      if (typeof window !== "undefined") document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    if (href === "#__upcoming") {
      if (onUpcomingEdition) {
        onUpcomingEdition();
      } else if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("c2c:open-upcoming"));
      }
      setMenuOpen(false);
      return;
    }
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        const topBarHeight = 56; // Approximate top bar height
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - topBarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    setMenuOpen(false);
  };

  const navLinks = [
    { href: "#about", label: "About", hasDropdown: false },
    { href: "#stats", label: "Stats", hasDropdown: false },
    { href: "#tracks", label: "Tracks", hasDropdown: false },
    { href: "#timeline", label: "Timeline", hasDropdown: false },
    { href: "#speakers", label: "Speakers", hasDropdown: false },
    { href: "#sponsors", label: "Sponsors", hasDropdown: false },
    { href: "#faqs", label: "FAQs", hasDropdown: false },
    { href: "#__upcoming", label: "See upcoming Edition", hasDropdown: false },
  ];

  return (
    <div className="c2c-topbar-shell">
      <div className="c2c-topbar w-full border-b border-white/30">
        <span aria-hidden className="c2c-topbar__effect" />
        <span aria-hidden className="c2c-topbar__tint" />
        <span aria-hidden className="c2c-topbar__shine" />
        <div className="w-full flex items-center justify-between px-0 py-2 min-[1120px]:py-0 min-[1120px]:h-14">
          <div className="flex-shrink-0 border-r border-white pr-4 min-[1120px]:pr-8 py-1 flex items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="cursor-pointer"
              aria-label="Scroll to top"
            >
              <Image
                src="/landing/c2c-logo-with-name.svg"
                alt="Code2Create Logo"
                width={150}
                height={40}
                className="h-8 md:h-10 w-auto"
                loading="eager"
                priority
                style={{ marginLeft: 20 }}
              />
            </button>
          </div>

          <nav className="hidden min-[1120px]:flex flex-1 justify-center items-center px-2 min-[1120px]:h-full">
            <ul className="flex gap-1 xl:gap-2 items-center h-full">
              {navLinks.map((link) => (
                <li key={link.href} className="min-w-0 flex items-center h-full">
                  {link.href.startsWith("#") ? (
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className="group inline-flex items-center justify-center h-full cursor-pointer"
                    >
                      <span
                        className="flex items-center justify-center space-x-2 px-2 xl:px-3 py-1 rounded-md transition-colors min-w-0"
                        style={{ fontFamily: "Trap, Arial, sans-serif" }}
                      >
                        <span className="text-white group-hover:text-gray-300 text-center leading-tight text-[13px] xl:text-sm whitespace-nowrap">
                          {link.label}
                        </span>
                        {link.hasDropdown && (
                          <Image
                            src="/landing/down-arrow.svg"
                            alt={`${link.label} dropdown`}
                            width={10}
                            height={10}
                            className="h-auto flex-none"
                            aria-hidden
                            loading="lazy"
                          />
                        )}
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="group inline-flex items-center justify-center h-full cursor-pointer"
                    >
                      <span
                        className="flex items-center justify-center space-x-2 px-2 xl:px-3 py-1 rounded-md transition-colors min-w-0"
                        style={{ fontFamily: "Trap, Arial, sans-serif" }}
                      >
                        <span className="text-white group-hover:text-gray-300 text-center leading-tight text-[13px] xl:text-sm whitespace-nowrap">
                          {link.label}
                        </span>
                        {link.hasDropdown && (
                          <Image
                            src="/landing/down-arrow.svg"
                            alt={`${link.label} dropdown`}
                            width={10}
                            height={10}
                            className="h-auto flex-none"
                            aria-hidden
                            loading="lazy"
                          />
                        )}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-[1120px]:hidden flex items-center gap-2">
            {REGISTRATIONS_OPEN && (
              <InteractiveHoverButton
                variant="simple"
                onClick={() => router.push("/portal")}
                className="w-auto text-[11px] px-3 py-1 min-h-[28px] rounded-full font-semibold bg-black/50 hover:bg-black/60 text-white border border-white/30 backdrop-blur-sm transition-colors cursor-pointer"
              >
                Register Now
              </InteractiveHoverButton>
            )}
            <button
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((s) => !s)}
              className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-white cursor-pointer"
            >
              {menuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>

          <div className="hidden min-[1120px]:flex flex-shrink-0 border-l border-white pl-4 min-[1120px]:pl-8 py-1 items-center mr-4">
            <a
              href="https://acmvit.in"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
              aria-label="Visit ACM VIT website"
            >
              <Image
                src="/landing/acm-logo-with-name.svg"
                alt="ACM Logo"
                width={110}
                height={40}
                className="h-8 md:h-10 w-auto"
                priority
              />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile dropdown: mounted outside the topbar so its hidden height cannot
       * stretch the glass bar. .is-open drives the push-down animation. */}
      <div
        className={`c2c-mobile-menu min-[1120px]:hidden ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="c2c-mobile-menu__panel">
          <ul className="flex flex-col gap-3 px-4 py-4 m-0 list-none">
            {navLinks.map((link, index) => (
              <li
                key={link.href}
                className="c2c-mobile-menu__item"
                style={{ "--menu-i": index } as CSSProperties}
              >
                {link.href.startsWith("#") ? (
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="block w-full px-3 py-2 rounded text-white hover:bg-white/10 text-center cursor-pointer"
                    style={{ fontFamily: "Trap, Arial, sans-serif" }}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block w-full px-3 py-2 rounded text-white hover:bg-white/10 text-center cursor-pointer"
                    style={{ fontFamily: "Trap, Arial, sans-serif" }}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
