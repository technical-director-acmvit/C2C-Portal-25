"use client";
import External from "./external";
import Internal from "./internal";
import { useState } from "react";
import PortalButton from "./ui/button";
import Image from "next/image";

const Portal = ({ userEmail }: { userEmail?: string | null }) => {
  const [selected, setSelected] = useState<"internal" | "external" | null>(null);

  console.log("Portal userEmail:", userEmail);

  if (selected === "internal") {
    return <Internal onBack={() => setSelected(null)} />;
  }
  if (selected === "external") {
    return <External onBack={() => setSelected(null)} />;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen relative">
      {/* Background image via next/image */}
      <Image
        src="/portal/bg1.svg"
        alt=""
        aria-hidden
        fill
        className="object-cover"
        priority={false}
      />
      <div className="flex flex-col items-center justify-center h-full px-4 text-center relative z-10">
        <div className="flex items-center gap-3 mb-6">
          {/* <BackChevron /> */}
          <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl">
            Are you a VIT student?
          </h1>
        </div>
        <div className="flex flex-row flex-wrap gap-3 sm:gap-6 w-full items-center justify-center">
          <PortalButton
            className="px-4 py-2 text-[16px] sm:text-[18px]"
            onClick={() => setSelected("internal")}
          >
            Yes
          </PortalButton>
          <PortalButton
            className="px-4 py-2 text-[16px] sm:text-[18px]"
            onClick={() => setSelected("external")}
          >
            No
          </PortalButton>
        </div>
      </div>
    </div>
  );
};
export default Portal;
