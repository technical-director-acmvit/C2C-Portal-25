"use client";

import React from "react";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Portal from "../../components/portal/portal";
import TeamUp from "../../components/portal/team-up";
import Dashboard from "../../components/portal/dashboard";
import { usePortalStore } from "../../stores/portal";
import PortalLoader from "@/app/components/portal/portal-loader";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import GithubView from "@/app/components/portal/github/github-view";
import { PORTAL_ENABLED, DISCORD_URL } from "@/lib/env";

export default function Home({ userEmail }: { userEmail?: string | null }) {
  const view = usePortalStore((s) => s.view);
  const initialize = usePortalStore((s) => s.initialize);
  const setView = usePortalStore((s) => s.setView);
  const dashboard = usePortalStore((s) => s.dashboard);

  console.log("Home userEmail:", userEmail);
  console.log("Home userEmail type:", typeof userEmail);

  useEffect(() => {
    void initialize();
  }, [initialize]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const iid = url.searchParams.get("installation_id");
    if (!iid) return;
    // Only allow GitHub view when the user is in a team
    if (dashboard?.team) setView("github");
  }, [dashboard, setView]);

  // Show Coming Soon when portal is disabled via env flag
  if (!PORTAL_ENABLED) {
    return (
      <div className="fixed inset-0 w-screen h-screen relative">
        <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />
        <div className="absolute top-6 left-6 z-100 sm:left-8">
          <Link href="/">
            <Image
              src="/landing/c2c-logo-with-name.svg"
              alt="Logo"
              width={200}
              height={200}
              className="bg-transparent block w-28 sm:w-40 h-auto"
              draggable={false}
            />
          </Link>
        </div>
        <div className="absolute inset-0 grid place-items-center p-4">
          <div className="text-center w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-6 sm:px-6 sm:py-7 md:px-8 md:py-8 lg:px-10 lg:py-10 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl backdrop-blur-md">
            <h1
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold leading-tight"
              style={{ fontFamily: "Trap, Arial, sans-serif" }}
            >
              Coming soon
            </h1>
            <p
              className="mt-3 sm:mt-4 text-white/80 text-sm sm:text-base md:text-lg max-w-prose mx-auto leading-relaxed"
              style={{ fontFamily: "Trap, Arial, sans-serif" }}
            >
              Hop into our Discord to get updates, timelines, and announcements.
            </p>
            <div className="mt-4 sm:mt-5">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-auto text-[12px] sm:text-sm px-4 py-2 min-h-[36px] rounded-full font-semibold bg-[#5865F2] hover:bg-[#4752C4] text-white border border-white/10 transition-colors"
                style={{ fontFamily: "Trap, Arial, sans-serif" }}
              >
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Background image for entire page */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />
      </div>
      
      <div className="absolute top-6 left-6 z-50 sm:left-8">
        <Link href="/">
          <Image
            src="/landing/c2c-logo-with-name.svg"
            alt="Logo"
            width={200}
            height={200}
            className="bg-transparent block w-28 sm:w-40 h-auto"
            draggable={false}
          />
        </Link>
      </div>
      <div className="absolute top-6 right-6 z-50 sm:right-8">
        <button
          type="button"
          aria-label="Log out"
          title="Log out"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="group inline-flex items-center justify-center rounded-full border border-white/10 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <LogOut className="h-5 w-5 sm:h-6 sm:w-6 opacity-90 group-hover:opacity-100" />
        </button>
      </div>
      <div className="relative z-10">
        {view === "loading" && <PortalLoader />}
        {view === "signup" && <Portal userEmail={userEmail} />}
        {view === "team" && <TeamUp />}
        {view === "dashboard" && <Dashboard />}
        {view === "github" && <GithubView />}
      </div>
      {view === "error" && (
        <div className="fixed inset-0 w-screen h-screen relative z-20">
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="text-red-300 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-center max-w-md">
              Something went wrong. Please retry.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

