"use client";

import { useEffect, useState } from 'react';
import Portal from '@/app/components/portal/portal';
import TeamUp from '../components/portal/team-up';
import Dashboard from '../components/portal/dashboard';
import { fetchDashboard } from '../actions/dashboard';
import AuthReauthGuard from '@/components/auth-reauth-guard';

type View = 'loading' | 'signup' | 'team' | 'dashboard' | 'error';

export default function Home() {
  const [view, setView] = useState<View>('loading');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchDashboard();
        if (!mounted) return;
        if (!res.ok) {
            
          if (res.status === 404) {
            setView('signup');
          } else if (res.status === 401) {
            setView('signup');
          } else {
            setView('error');
          }
          return;
        }
        const hasTeam = Boolean(res.data?.team);
        setView(hasTeam ? 'dashboard' : 'team');
      } catch {
        if (mounted) setView('signup');
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleTeamLeft = () => {
    setView('team');
  };

  return (
    <AuthReauthGuard>
      {view === 'loading' && (
        <div className="min-h-screen grid place-items-center text-white">Loading…</div>
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
