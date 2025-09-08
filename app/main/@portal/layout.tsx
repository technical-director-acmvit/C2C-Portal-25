import React from "react";
import type { Metadata } from "next";
import AuthProvider from "@/components/auth-provider";
import { PORTAL_ENABLED } from "@/lib/env";
// import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Portal | C2C",
};

export default async function PortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return PORTAL_ENABLED ? <AuthProvider>{children}</AuthProvider> : <>{children}</>;
}

