import type { Metadata } from "next";
import AuthProvider from "@/components/auth-provider";
import ConditionalAuthGuard from "@/components/conditional-auth-guard";
import SlotRouter from "@/components/slot-router";
import React from "react";
import DevViewSwitcher from "@/app/components/portal/dev-view-switcher";


export const metadata: Metadata = {
  title: "Portal | C2C",
};

export default async function PortalLayout({ children, portal, dash, reject, no_active_round }: Readonly<{ children: React.ReactNode, portal: React.ReactNode, dash: React.ReactNode, reject: React.ReactNode, no_active_round: React.ReactNode }>) {
  return (
    <AuthProvider>
      <ConditionalAuthGuard>
        {children}
        <SlotRouter portal={portal} dash={dash} reject={reject} no_active_round={no_active_round} />
        {/* Render dev switcher globally for all /portal views (dev-only inside component) */}
        <DevViewSwitcher />
      </ConditionalAuthGuard>
    </AuthProvider>
  );
}
