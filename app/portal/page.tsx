"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Portal from '@/app/components/portal/portal';
import TeamUp from '../components/portal/team-up';
import Dashboard from '../components/portal/dashboard';
import { usePortalStore } from "@/app/stores/portal";
import AuthReauthGuard from '@/components/auth-reauth-guard';
import PortalLoader from "../components/portal/portal-loader";
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function Home() {
  const view = usePortalStore((s) => s.view);
  const initialize = usePortalStore((s) => s.initialize);
  useEffect(() => { void initialize(); }, [initialize]);

  return (
    <AuthReauthGuard>
      <div className="absolute top-6 left-6 z-100 sm:left-8">
        <Link href="/">
          <Image
            src="/portal/logo.svg"
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
          onClick={() => signOut({ callbackUrl: '/' })}
          className="group inline-flex items-center justify-center rounded-full border border-white/10 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <LogOut className="h-5 w-5 sm:h-6 sm:w-6 opacity-90 group-hover:opacity-100" />
        </button>
      </div>
      {view === 'loading' && (
        <PortalLoader />
      )}
      {view === 'signup' && <Portal />}
      {view === 'team' && <TeamUp />}
      {view === 'dashboard' && <Dashboard />}
      {view === 'error' && (
        <div className="min-h-screen grid place-items-center text-red-400">Something went wrong. Please retry.</div>
      )}
    </AuthReauthGuard>
  );
}
