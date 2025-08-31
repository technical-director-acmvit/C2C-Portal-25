"use client";

import { useEffect, useState } from 'react';
import Portal from '@/app/components/portal/portal';
import TeamUp from '../components/portal/team-up';
import Dashboard from '../components/portal/dashboard';
import { fetchDashboard } from '../actions/dashboard';

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

  if (view === 'loading') return <div className="min-h-screen grid place-items-center text-white">Loading…</div>;
  if (view === 'signup') return <Portal />; // Student info (internal/external)
  if (view === 'team') return <TeamUp />;   // Create/join team
  if (view === 'dashboard') return <Dashboard />; // Team dashboard
  return <div className="min-h-screen grid place-items-center text-red-400">Something went wrong. Please retry.</div>;
}
