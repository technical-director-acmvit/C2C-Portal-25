"use client";


import BackChevron from "./ui/back-chevron";
import Image from "next/image";
import IDCard from "@/app/components/portal/id-card";
import IDCardBack from "@/app/components/portal/id-card-Back";
import HKBox from "@/app/components/portal/hk-box";

interface ProfileProps {
  onBack?: () => void;
}

const Profile = ({ onBack }: ProfileProps) => {
  return (
    <div className="fixed inset-0 w-screen h-screen relative">
      {/* Background image via next/image */}
      <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />
      <div className="absolute top-6 left-6 z-10">
        <BackChevron onClick={onBack} />
      </div>
      <div className="w-full h-full relative z-10">
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
      </div>
    </div>
  );
};

export default Profile;
