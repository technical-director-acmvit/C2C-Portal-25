"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Portal from '@/app/components/portal/portal';
import TeamUp from '../components/portal/team-up';
import Dashboard from '../components/portal/dashboard';
import { fetchDashboard } from '../actions/dashboard';
import AuthReauthGuard from '@/components/auth-reauth-guard';
import PortalLoader from "../components/portal/portal-loader";
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

type View = 'loading' | 'signup' | 'team' | 'dashboard' | 'error';

export default function Home() {
  const [view, setView] = useState<View>('loading');

  useEffect(() => {
    let mounted = true;
    const failover = setTimeout(() => {
      if (mounted) setView('signup');
    }, 8000);

    const commit = (v: View) => {
      if (!mounted) return;
      clearTimeout(failover);
      setView(v);
    };
    (async () => {
      try {
        const res = await fetchDashboard();
        if (!mounted) return;
        if (!res.ok) {
          if (res.status === 404 || res.status === 401) {
            commit('signup');
          } else {
            commit('error');
          }
          return;
        }

        // Decide view based on profile completeness first, then team membership
        const u = res.data?.user;
        const isInternal = typeof u?.internal === 'boolean' ? u.internal : undefined;
        const hasCoreFields = Boolean(u?.contact_number) && Boolean(u?.gender);
        const hasInternalFields = Boolean(u?.reg_no);
        const hasExternalFields = Boolean(u?.college_name);
        const profileComplete =
          hasCoreFields &&
          (isInternal === true ? hasInternalFields : isInternal === false ? hasExternalFields : false);

        if (!profileComplete) {
          commit('signup');
          return;
        }

        const hasTeam = Boolean(res.data?.team);
        commit(hasTeam ? 'dashboard' : 'team');
      } catch {
        if (mounted) commit('signup');
      }
    })();
    return () => { mounted = false; clearTimeout(failover); };
  }, []);

  const handleTeamLeft = () => {
    setView('team');
  };

  return (
    <AuthReauthGuard>
      <div className="absolute top-6 left-6 z-100 sm:left-8">
        <Image
          src="/portal/logo.svg"
          alt="Logo"
          width={200}
          height={200}
          className="bg-transparent block w-28 sm:w-40 h-auto"
          draggable={false}
        />
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
      {view === 'dashboard' && <Dashboard onTeamLeft={handleTeamLeft} />}
      {view === 'error' && (
        <div className="min-h-screen grid place-items-center text-red-400">Something went wrong. Please retry.</div>
      )}
    </AuthReauthGuard>
  );
}
