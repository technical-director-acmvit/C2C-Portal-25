import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal | C2C",
};

export default function PortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

