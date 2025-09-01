"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { InteractiveHoverButton } from "@/app/components/landing/ui/cta-button";
import { signIn } from "next-auth/react";

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // lock body scroll when mobile menu is open
    if (typeof window !== "undefined") {
      document.body.style.overflow = menuOpen ? "hidden" : "";
    }
    return () => {
      if (typeof window !== "undefined") document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "#about", label: "About", hasDropdown: false },
    { href: "#stats", label: "Stats", hasDropdown: false },
    { href: "#tracks", label: "Tracks", hasDropdown: false },
    { href: "#sponsors", label: "Sponsors", hasDropdown: false },
  ];

  return (
    <div className="w-full bg-transparent border-b border-white">
      <div className="w-full flex items-center justify-between px-0 sm:px-0 lg:px-0 py-2 md:py-0 md:h-14">
        <div className="flex-shrink-0 border-r border-white pr-4 md:pr-8 py-1 flex items-center">
          <Image
            src="/landing/c2c-logo-with-name.svg"
            alt="Code2Create Logo"
            width={150}
            height={40}
            className="h-8 md:h-10 w-auto"
            loading="eager"
            style={{ marginLeft: 20 }}
          />
        </div>

        <nav className="hidden md:flex flex-1 justify-center items-center px-4 md:h-full">
          <ul className="flex gap-4 items-center h-full">
            {navLinks.map((link) => (
              <li key={link.href} className="min-w-0 flex items-center h-full">
                {link.href.startsWith("#") ? (
                  <a
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
                  </a>
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
          </ul>
        </nav>

        <div className="md:hidden flex items-center">
          <button
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((s) => !s)}
            className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-white"
          >
            {menuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M3 6h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M3 12h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M3 18h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="hidden md:flex flex-shrink-0 border-l border-white pl-4 md:pl-8 py-1 items-center mr-4">
          <Image
            src="/landing/acm-logo-with-name.svg"
            alt="ACM Logo"
            width={110}
            height={40}
            className="h-8 md:h-10 w-auto"
          />
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute inset-x-0 top-full bg-black/95 border-t border-white z-50">
          <div className="px-4 py-4">
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("#") ? (
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-3 py-2 rounded text-white hover:bg-white/10 text-center"
                      style={{ fontFamily: "Trap, Arial, sans-serif" }}
                    >
                      {link.label}
                    </a>
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
  );
}
