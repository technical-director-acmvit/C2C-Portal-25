"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { InteractiveHoverButton } from "@/app/components/landing/ui/cta-button";
import { useRouter } from "next/navigation";
import { REGISTRATIONS_OPEN } from "@/lib/env";
import { RegisterModal, useModal, useIsAnyModalOpen } from "@/components/RegisterModal";

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  // const router = useRouter();
  const {closeModal, openModal, isOpen } = useModal();
  const isAnyModalOpen = useIsAnyModalOpen();

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
    { href: "#sponsors", label: "Sponsors", hasDropdown: false },
  ];

  return (
    <>
    <div className="w-full bg-transparent border-b border-white backdrop-blur-sm">
      <div className="w-full flex items-center justify-between px-0 sm:px-0 lg:px-0 py-2 md:py-0 md:h-14">
        <div className="flex-shrink-0 border-r border-white pr-4 md:pr-8 py-1 flex items-center">
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

        <nav className="hidden md:flex flex-1 justify-center items-center px-4 md:h-full">
          <ul className="flex gap-4 items-center h-full">
            {navLinks.map((link) => (
              <li key={link.href} className="min-w-0 flex items-center h-full">
                {link.href.startsWith("#") ? (
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="group inline-flex items-center justify-center h-full"
                  >
                    <span
                      className="flex items-center justify-center space-x-2 px-3 py-1 rounded-md transition-colors min-w-0"
                      style={{ fontFamily: "Trap, Arial, sans-serif" }}
                    >
                      <span className="text-white group-hover:text-gray-300 text-center leading-tight break-words">
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
                    className="group inline-flex items-center justify-center h-full"
                  >
                    <span
                      className="flex items-center justify-center space-x-2 px-3 py-1 rounded-md transition-colors min-w-0"
                      style={{ fontFamily: "Trap, Arial, sans-serif" }}
                    >
                      <span className="text-white group-hover:text-gray-300 text-center leading-tight break-words">
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
            {!isAnyModalOpen && (
              <li className="flex items-center h-full ml-4">
                {REGISTRATIONS_OPEN ? (
                  <InteractiveHoverButton
                    variant="compact"
                    onClick={openModal}
                    className="w-auto text-[12px] px-6 py-1.5 min-h-[32px] rounded-full font-semibold flex items-center justify-center bg-[#48BA86] text-black border !border-[#48BA86] transition-colors hover:!bg-white hover:!border-white"
                  >
                    Register Now
                  </InteractiveHoverButton>
                ) : (
                  <span
                    className="inline-block w-auto text-[12px] px-6 py-1.5 min-h-[32px] rounded-full font-semibold text-white border border-white/30 bg-black/30 backdrop-blur-sm"
                    aria-live="polite"
                  >
                    Registrations opening soon
                  </span>
                )}
              </li>
            )}
          </ul>
        </nav>

        <div className="md:hidden flex items-center gap-2">
          {!isAnyModalOpen && (
            REGISTRATIONS_OPEN ? (
              <InteractiveHoverButton
                variant="simple"
                onClick={openModal}
                className="w-auto text-[11px] px-3 py-1 min-h-[28px] rounded-full font-semibold bg-black/50 hover:bg-black/60 text-white border border-white/30 backdrop-blur-sm transition-colors"
              >
                Register Now
              </InteractiveHoverButton>
            ) : (
              <span
                className="inline-block w-auto text-[11px] px-3 py-1 min-h-[28px] rounded-full font-semibold text-white border border-white/30 bg-black/30 backdrop-blur-sm"
                aria-live="polite"
              >
                Registrations opening soon
              </span>
            )
          )}
          <button
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((s) => !s)}
            className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-white"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

        <div className="hidden md:flex flex-shrink-0 border-l border-white pl-4 md:pl-8 py-1 items-center mr-4">
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

      {menuOpen && (
        <div className="md:hidden absolute inset-x-0 top-full bg-black/95 border-t border-white z-50">
          <div className="px-4 py-4">
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("#") ? (
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className="block w-full px-3 py-2 rounded text-white hover:bg-white/10 text-center"
                      style={{ fontFamily: "Trap, Arial, sans-serif" }}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-3 py-2 rounded text-white hover:bg-white/10 text-center"
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
      )}
    </div>

    </>
  );
}
