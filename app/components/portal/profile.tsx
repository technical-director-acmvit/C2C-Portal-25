"use client";

import BackChevron from "./ui/back-chevron";
// import Lanyard from "./lanyard";
import Image from "next/image";

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
      <div className="w-full h-full relative z-10">{/* <Lanyard /> */}</div>
    </div>
  );
};

export default Profile;
