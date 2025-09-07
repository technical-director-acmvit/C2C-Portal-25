  "use client";

  
  import HKBox from "../../../components/portal/hk-box";
  import { Canvas } from "@react-three/fiber";

  import Lanyard from '../../../components/portal/lanyard'

  export default function Page() {
    
    return (
      <div className="flex flex-col items-center w-full min-h-screen bg-[#18181B]">
        {/* Header */}
        <h1 className="mb-4 text-center text-white font-bold text-[70px] leading-none" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Profile
        </h1>
        {/* Greeting */}
        <div
          className="mb-8 text-center text-white font-bold text-[40px] leading-none"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Hello Name
        </div>
        {/* IDCard full width, below Hello Name, above HKBox */}
        <div className="w-full flex justify-center mb-8">
          <Lanyard />
        </div>
        {/* HKBox below */}
        <div className="w-full max-w-2xl flex justify-center mt-50">
          <HKBox />
        </div>
      </div>
    );
  }
