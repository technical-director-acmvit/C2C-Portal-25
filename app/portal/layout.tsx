import type { Metadata } from "next";
import AuthProvider from "@/components/auth-provider";
import { PORTAL_ENABLED } from "@/lib/env";

export const metadata: Metadata = {
  title: "Portal | C2C",
};

export default function PortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return PORTAL_ENABLED ? <AuthProvider>{children}</AuthProvider> : <>{children}</>;
}
