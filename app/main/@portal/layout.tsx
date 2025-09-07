import React from "react";
import type { Metadata } from "next";
import AuthProvider from "@/components/auth-provider";
import { PORTAL_ENABLED } from "@/lib/env";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Portal | C2C",
};

export default async function PortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || null;

  console.log("PortalLayout user email:", email);
  
  const childWithEmail = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<{ userEmail?: string | null }>, { 
        userEmail: email 
      })
    : children;

  return PORTAL_ENABLED ? <AuthProvider>{childWithEmail}</AuthProvider> : <>{childWithEmail}</>;
}

