"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Portal from "../../components/portal/portal";
import TeamUp from "../../components/portal/team-up";
import Dashboard from "../../components/portal/dashboard";
import { usePortalStore } from "../../stores/portal";
import PortalLoader from "@/app/components/portal/portal-loader";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import GithubView from "@/app/components/portal/github/github-view";
import { PORTAL_ENABLED, DISCORD_URL } from "@/lib/env";
import DevViewSwitcher from "@/app/components/portal/dev-view-switcher";
import PortalButton from "@/app/components/portal/ui/button";


export default function Home() {
  const { data: session } = useSession()

  const view = usePortalStore((s) => s.view);
  const initialize = usePortalStore((s) => s.initialize);
  const setView = usePortalStore((s) => s.setView);
  const dashboard = usePortalStore((s) => s.dashboard);
  const whitelistChecked = usePortalStore((s) => s.whitelistChecked);
  const isWhitelisted = usePortalStore((s) => s.isWhitelisted);
  const emailToCheck = session?.user?.email ?? null;
    


    const userEmail = typeof session?.user?.email === "string" ? session?.user?.email : undefined;

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

  // No explicit whitelist effect here — store.initialize triggers verifyWhitelist.

  // If whitelist modal should be shown, return the whitelist modal instead
  const shouldShowWhitelistModal = whitelistChecked && !isWhitelisted;
  if (shouldShowWhitelistModal) {
    return (
      <div className="fixed inset-0 w-screen h-screen relative">
        {/* Background image via next/image */}
        <Image
          src="/portal/bg1.svg"
          alt=""
          aria-hidden
          fill
          className="object-cover"
          priority={false}
        />
        
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal card */}
          <div className="flex items-center justify-center h-full px-4">
            <div
              className="w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 md:p-8 rounded-2xl animate-pop-in"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
                backdropFilter: "blur(10px) saturate(120%)",
                boxShadow:
                  "0 12px 40px rgba(0,0,0,0.55), 0 6px 24px rgba(72,186,134,0.06) inset, 0 1px 0 rgba(255,255,255,0.02) inset",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <h2
                className="text-white text-center mb-4"
                style={{
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  fontSize: "clamp(16px, 4.5vw, 20px)",
                }}
              >
                Access Restricted
              </h2>

              <p className="text-gray-300 text-center mb-6" style={{ fontSize: "clamp(12px, 4vw, 16px)" }}>
                Please log in with the email ID you used during registration to access this portal.
              </p>

              {emailToCheck && (
                <p className="text-gray-300 text-center mb-6" style={{ fontSize: "clamp(12px, 4vw, 16px)" }}>
                  Currently logged in as{" "}
                  <span className="text-white font-semibold">{emailToCheck}</span>
                </p>
              )}

              <div className="flex items-center justify-center gap-3">
                <PortalButton onClick={() => signOut({ callbackUrl: "/" })}>
                  Log out & Login Again
                </PortalButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      
      {/* Dev Controls */}
      <DevViewSwitcher />
    </>
  );
}

