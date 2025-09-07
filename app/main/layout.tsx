import type { Metadata } from "next";
import AuthProvider from "@/components/auth-provider";
import AuthReauthGuard from "@/components/auth-reauth-guard";
import SlotRouter from "@/components/slot-router";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import React from "react";


export const metadata: Metadata = {
  title: "Portal | C2C",
};

export default async function PortalLayout({ children, portal, dash }: Readonly<{ children: React.ReactNode, portal: React.ReactNode, dash: React.ReactNode }>) {
      const session = await getServerSession(authOptions);
      const email = session?.user?.email || null;
    
      console.log("Mainlayout user email:", email);

        const childWithEmail = React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<{ userEmail?: string | null }>, { 
              userEmail: email 
            })
          : children;
      
    
  return (
    <AuthProvider>
      <AuthReauthGuard>
        {childWithEmail}
        <SlotRouter portal={portal} dash={dash} />
      </AuthReauthGuard>
    </AuthProvider>
  );
}
