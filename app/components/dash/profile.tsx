"use client";

import HKBox from "../portal/hk-box";
import Lanyard from "../portal/lanyard";
import { useDashStore } from "@/app/stores/dash";

export default function ProfileView() {
  const setView = useDashStore((s) => s.setView);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#18181B]">
      <div className="w-full max-w-5xl flex items-center justify-between px-4 pt-6">
        <button
          onClick={() => setView("home")}
          className="px-4 py-2 rounded-full border border-emerald-500 text-white hover:bg-emerald-600/20"
        >
          Back
        </button>
      </div>
      <h1
        className="mb-4 text-center text-white font-bold text-[70px] leading-none"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        Profile
      </h1>
      <div
        className="mb-8 text-center text-white font-bold text-[40px] leading-none"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        Hello Name
      </div>
      <div className="w-full flex justify-center mb-8">
        <Lanyard />
      </div>
      <div className="w-full max-w-2xl flex justify-center mt-50">
        <HKBox />
      </div>
    </div>
  );
}

