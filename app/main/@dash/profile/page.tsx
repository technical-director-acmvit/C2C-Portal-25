  "use client";

  

import HKBox from "@/app/components/portal/hk-box";
import IDCard from "@/app/components/portal/id-card";
import IDCardBack from "@/app/components/portal/id-card-Back";
import Lanyard from "@/app/components/portal/lanyard";
import SlotRouter from "@/components/slot-router";

export default function Page() {
  return (
        <div className="flex flex-col items-center w-full bg-[#18181B] overflow-scroll">
          {/* Header */}
          <h1 className="mb-4 text-center text-white font-bold text-[70px] leading-none" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Profile
          </h1>
          {/* Greeting */}
          <div
            className="mb-0 text-center text-white font-bold text-[40px] leading-none"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Hello Name
          </div>
          {/* IDCards side by side, stack on mobile */}
          <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-8 mt-8 z-[9999]">
            <IDCard />
            <IDCardBack />
          </div>
          {/* HKBox below */}
          <div className="w-full max-w-2xl flex justify-center">
            <HKBox />
          </div>
        </div>
  );
}
