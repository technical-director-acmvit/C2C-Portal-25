"use client";

import type { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import AuthReauthGuard from "@/components/auth-reauth-guard";

export default function ConditionalAuthGuard({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isIntegration = pathname?.startsWith("/portal/integrations");
  if (isIntegration) {
    return <>{children}</>;
  }
  return <AuthReauthGuard>{children}</AuthReauthGuard>;
}

