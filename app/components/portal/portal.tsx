"use client";
import External from "./external";
import Internal from "./internal";
import { useState } from "react";
import PortalButton from "./ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePortalStore } from "@/app/stores/portal";
import { SIGNUPS_OVER } from "@/lib/env";

const Portal = ({ userEmail }: { userEmail?: string | null }) => {
  const [selected, setSelected] = useState<"internal" | "external" | null>(null);
  const { data: session } = useSession();
  const emailToCheck = session?.user?.email ?? userEmail ?? null;
  const whitelistChecked = usePortalStore((s) => s.whitelistChecked);
  const whitelistOk = usePortalStore((s) => s.whitelistOk);
  const isInternal = usePortalStore((s) => s.isInternal);

  const handleProceed = () => {
    if (SIGNUPS_OVER) return; // block proceeding when signups are over
    if (!whitelistChecked || !whitelistOk || isInternal === null) return;
    setSelected(isInternal ? "internal" : "external");
  };

  if (selected === "internal") {
    return <Internal onBack={() => setSelected(null)} mail={emailToCheck} />;
  }
  if (selected === "external") {
    return <External onBack={() => setSelected(null)} />;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen relative">
      <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" priority={false} />
      <div className="flex flex-col items-center justify-center h-full px-4 text-center relative z-10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-white font-bold" style={{ fontSize: "clamp(20px, 5.5vw, 36px)" }}>
            Welcome to Code2Create
          </h1>
        </div>
        <div className="flex flex-row flex-wrap gap-3 sm:gap-6 w-full items-center justify-center">
          <PortalButton
            onClick={handleProceed}
            disabled={SIGNUPS_OVER || !whitelistChecked || !whitelistOk || isInternal === null}
          >
            {SIGNUPS_OVER
              ? "Registrations closed"
              : (!whitelistChecked || isInternal === null) ? "Checking access..." : "Proceed"}
          </PortalButton>
        </div>
      </div>
    </div>
  );
};
export default Portal;
