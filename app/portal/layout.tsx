import type { Metadata } from "next";
import AuthProvider from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "Portal | c2c",
};

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthProvider>{children}</AuthProvider>;
}

