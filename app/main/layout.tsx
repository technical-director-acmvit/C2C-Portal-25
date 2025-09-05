import type { Metadata } from "next";
import AuthProvider from "@/components/auth-provider";
import AuthReauthGuard from "@/components/auth-reauth-guard";
import SlotRouter from "@/components/slot-router";

export const metadata: Metadata = {
  title: "Portal | C2C",
};

export default function PortalLayout({ children, portal, dash }: Readonly<{ children: React.ReactNode, portal: React.ReactNode, dash: React.ReactNode }>) {
  return (
    <AuthProvider>
      <AuthReauthGuard>
        {children}
        <SlotRouter portal={portal} dash={dash} />
      </AuthReauthGuard>
    </AuthProvider>
  );
}
