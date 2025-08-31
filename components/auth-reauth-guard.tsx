"use client";

import { PropsWithChildren, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

export default function AuthReauthGuard({ children }: PropsWithChildren) {
  const { data, status } = useSession();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (status !== 'authenticated') return;
    const error = (data as any)?.error as string | undefined;
    if (error === 'RefreshAccessTokenError') {
      const callbackUrl = window.location.href;
      void signIn('google', { callbackUrl });
    }
  }, [status, data]);

  return <>{children}</>;
}

