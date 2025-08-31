"use client";

import BackChevron from "./ui/back-chevron";
import Lanyard from "./lanyard";

interface ProfileProps {
  onBack?: () => void;
}

const Profile = ({ onBack }: ProfileProps) => {
  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/portal/bg1.svg)" }}
    >
      <div className="absolute top-6 left-6 z-10">
        <BackChevron onClick={onBack} />
      </div>
      <div className="w-full h-full">
        <Lanyard />
      </div>
    </div>
  );
};

export default Profile;
