"use client";

import HKBox from "./hk-box";
import Lanyard from "../portal/lanyard";
import IDCard from "@/app/components/dash/id-card";
import IDCardBack from "@/app/components/dash/id-card-behind";
import BackChevron from "@/app/components/portal/ui/back-chevron";
import { useDashStore } from "@/app/stores/dash";
import { useEffect, useState, useMemo } from "react";
import { cleanName } from "@/app/components/portal/nameUtils";

export default function ProfileView() {
  const setView = useDashStore((s) => s.setView);
  const dashboard = useDashStore((s) => s.dashboard);

  const userName = cleanName(dashboard?.user?.name) || "User";
  const email = dashboard?.user?.email || "";
  const contact = dashboard?.user?.contact_number || "";
  const teamName = cleanName(dashboard?.team?.name) || "";
  const teammates = useMemo(
    () => (dashboard?.teammates || [])
      .map((t) => cleanName(t.name || t.email || ""))
      .filter(Boolean),
    [dashboard]
  );

  const textProps: [string, string, string, string, [string, string, string, string]] = [
    userName,
    email,
    contact,
    teamName,
    [teammates[0] || "", teammates[1] || "", teammates[2] || "", teammates[3] || ""]
  ];

  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const update = () => setIsSmall(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <div className="w-full flex items-center justify-start px-3 sm:px-4 pt-4">
        <div className="md:hidden">
          <BackChevron onClick={() => setView("home")} />
        </div>
        <button
          onClick={() => setView("home")}
          className="hidden md:inline-flex px-4 py-2 rounded-full border border-emerald-500 text-white hover:bg-emerald-600/20"
        >
          Back
        </button>
      </div>

      <h1
        className="mb-2 text-center text-white font-bold px-4"
        style={{ fontFamily: "Pilat Extended, DM Sans, sans-serif", fontSize: "clamp(24px, 6vw, 52px)" }}
      >
        Profile
      </h1>
      <div
        className="mb-6 text-center text-white font-bold px-4"
        style={{ fontFamily: "Pilat Extended, DM Sans, sans-serif", fontSize: "clamp(16px, 4.5vw, 26px)" }}
      >
        Hello {userName}
      </div>

      <div className="w-full flex justify-center mb-8">
        {isSmall ? (
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <IDCard name={userName} mailId={email} phone={contact} />
            <IDCardBack name={teamName || "Team"} members={[teammates[0] || "", teammates[1] || "", teammates[2] || "", teammates[3] || ""] as [string,string,string,string]} />
          </div>
        ) : (
          <div className="w-full" style={{ minHeight: "70vh" }}>
            <Lanyard text={textProps} />
          </div>
        )}
      </div>

      {HK_ENABLED && (
        <div className="w-full flex justify-center mt-8 md:mt-10 px-3 sm:px-4">
          <HKBox />
        </div>
      )}
    </div>
  );
}
