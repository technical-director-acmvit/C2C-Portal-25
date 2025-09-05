"use client";

import React from "react";
import Image from "next/image";

export default function TopBar() {

  return (
    <>
      <div className="w-full bg-transparent border-b border-white backdrop-blur-sm">
        <div className="w-full flex items-center justify-between px-0 sm:px-0 lg:px-0 py-2 md:py-0 md:h-14">
          <div className="flex-shrink-0 border-r border-white pr-4 md:pr-8 py-1 flex items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              onPointerDown={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
              
            </ul>
          </nav>

          <div className="flex flex-shrink-0 border-l border-white pl-4 md:pl-8 py-1 items-center mr-4">
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
    </>
  );
}
