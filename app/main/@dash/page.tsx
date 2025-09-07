"use client";

import { useLayoutEffect } from "react";
import TopBar from "@/app/components/dash/top-bar";
import Image from "next/image";
import BentoGrid from "@/app/components/dash/bento-grid";
import ProfileView from "@/app/components/dash/profile";
import { useDashStore } from "@/app/stores/dash";
import DashGradientBG from "@/app/components/dash/gradient-bg";

export default function DashPage() {
  useLayoutEffect(() => {
    // Your layout effects here
  }, []);
  const view = useDashStore((s) => s.view);

  return (
    <div className="relative w-full min-h-screen">
      <DashGradientBG />

      <TopBar />

      <main className="relative z-10 container mx-auto px-4 py-6 max-w-6xl">
            {/* Header Section */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 relative flex-shrink-0 pt-2">
                    <Image
                        src="/landing/C2C Logo.svg"
                        alt="Code2Create Main Logo"
                        width={400}
                        height={400}
                        className=""
                        priority
                    />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl text-white">
                    Code2Create
                </h1>
                </div>
            </div>
            {view === "home" && <BentoGrid />}
            {view === "profile" && <ProfileView />}

      </main>

      <footer className="relative z-10 mt-12 border-t border-gray-800/50">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="flex items-center justify-center gap-4 text-gray-500">
              <span className="text-sm">Powered by</span>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-700 rounded"></div>
                <span className="text-xs">runpod</span>
                <div className="w-6 h-6 bg-gray-700 rounded"></div>
                <span className="text-xs">IIElevenLabs</span>
              </div>
            </div>
          </div>
      </footer>
    </div>
  );
}
