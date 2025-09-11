import type { Metadata } from "next";
import AuthProvider from "@/components/auth-provider";
import React from "react";
import DashGradientBG from "@/app/components/dash/gradient-bg";

export const metadata: Metadata = {
  title: "GitHub Integration | C2C",
};

export default function IntegrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {/* Use the same background treatment as @dash; do NOT enforce auth here to avoid loops after GitHub redirects */}
      <div className="fixed inset-0 -z-10">
        <DashGradientBG />
      </div>
      {children}
    </AuthProvider>
  );
}
