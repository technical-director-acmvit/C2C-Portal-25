"use client";

import { PropsWithChildren, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import PortalLoader from "@/app/components/portal/portal-loader";

export default function AuthReauthGuard({ children }: PropsWithChildren) {
  const { data, status } = useSession();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (status === 'unauthenticated') {
      const callbackUrl = window.location.href;
      void signIn('google', { callbackUrl });
      return;
    }
    if (status === 'authenticated') {
      const error = (data as any)?.error as string | undefined;
      if (error === 'RefreshAccessTokenError') {
        const callbackUrl = window.location.href;
        void signIn('google', { callbackUrl });
      }
    }
  }, [status, data]);

  if (status === 'loading' || status === 'unauthenticated') {
    return <PortalLoader />;
  }
  return <>{children}</>;
}
