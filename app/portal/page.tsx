"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Portal from "@/app/components/portal/portal";
import TeamUp from "../components/portal/team-up";
import Dashboard from "../components/portal/dashboard";
import { usePortalStore } from "@/app/stores/portal";
import AuthReauthGuard from "@/components/auth-reauth-guard";
import PortalLoader from "../components/portal/portal-loader";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import GithubView from "@/app/components/portal/github/github-view";

export default function Home() {
  const view = usePortalStore((s) => s.view);
  const initialize = usePortalStore((s) => s.initialize);
  const setView = usePortalStore((s) => s.setView);
  const dashboard = usePortalStore((s) => s.dashboard);
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

  return (
    <AuthReauthGuard>
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
      <div className="absolute top-6 right-6 z-100 sm:right-8">
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
      {view === "loading" && <PortalLoader />}
      {view === "signup" && <Portal />}
      {view === "team" && <TeamUp />}
      {view === "dashboard" && <Dashboard />}
      {view === "github" && <GithubView />}
      {view === "error" && (
        <div className="fixed inset-0 w-screen h-screen relative">
          <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="text-red-300 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-center max-w-md">
              Something went wrong. Please retry.
            </div>
          </div>
        </div>
      )}
    </AuthReauthGuard>
  );
}
