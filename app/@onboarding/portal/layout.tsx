import type { Metadata } from "next";
import AuthProvider from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "Portal | C2C",
};

export default function PortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AuthProvider>{children}</AuthProvider>;
}
