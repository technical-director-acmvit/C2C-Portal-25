"use client";
import Image from "next/image";

export default function BentoGrid() {
  return (
    <div>
      {/* Mobile grid - visible only on screens smaller than md */}
      {/* Mobile grid - visible only on screens smaller than md */}
      <div className="grid grid-cols-10 grid-rows-28 h-[calc(100vh-12rem)] gap-2 min-h-[600px] md:hidden">
        <div className="bg-red-500 w-full h-full col-span-10 row-span-4">jj</div>

        <div className="bg-purple-500 w-full h-full col-span-6 row-span-9">jj</div>

        <div className="relative w-full h-full overflow-hidden flex items-center justify-center col-span-4 row-span-10">
          <Image
            src="/Group 1000007425.png"
            alt="Some Image"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>

        <div className="bg-orange-500 w-full h-full col-span-4 row-span-10">jj</div>

        <div className="border-emerald-500 rounded-md bg-[#060f0b] border-2 col-span-6 row-span-5 w-full p-2 flex flex-col items-center gap-2 min-h-[120px]">
          <h2 className="text-white text-xs font-weight-500 text-center leading-tight">
            Check out your team
          </h2>
          <button className="w-full px-2 py-1.5 pt-2 text-xs border border-emerald-500 bg-[#0f0f0d] text-white rounded-full hover:bg-emerald-500 hover:text-white transition-colors duration-200 touch-manipulation">
            Profile
          </button>
        </div>

        <div className="bg-green-500 w-full h-full col-span-6 row-span-8">jj</div>

        <div className="bg-yellow-500 w-full h-full col-span-4 row-span-10">jj</div>

        <div className="border-emerald-500 rounded-md bg-[#060f0b] border-2 w-full p-2 flex flex-col items-center gap-2 min-h-[120px] col-span-6 row-span-6">
          <h2 className="text-white text-xs font-weight-500 text-center leading-tight">
            Submit your ideas
          </h2>
          <button className="w-full px-2 py-1.5 pt-2 text-xs border border-emerald-500 bg-[#0f0f0d] text-white rounded-full hover:bg-emerald-500 hover:text-white transition-colors duration-200">
            Form
          </button>
        </div>
      </div>

      {/* Desktop and Tablet grid - hidden on mobile, visible on md+ */}
      <div
        className="hidden md:grid 
                md:grid-cols-12 md:grid-rows-20 md:gap-3 md:h-[calc(100vh-8rem)]
                lg:grid-cols-16 lg:grid-rows-24 lg:gap-4
                xl:gap-5
                min-h-[600px]"
      >
        <div
          className="bg-red-500 w-full h-full 
                  md:col-span-8 md:row-span-4
                  lg:col-span-11 lg:row-span-5"
        >
          jj
        </div>

        <div
          className="relative w-full h-full overflow-hidden flex items-center justify-center
                  md:col-span-4 md:row-span-6
                  lg:col-span-3 lg:row-span-7"
        >
          <Image
            src="/Group 1000007425.png"
            alt="Some Image"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>

        <div className="bg-orange-500 w-full h-full md:col-span-4 md:row-span-7 lg:col-span-5 lg:row-span-9">
          jj
        </div>

        <div className="relative w-full h-full overflow-hidden flex items-center justify-center md:col-span-3 md:row-span-7 lg:col-span-4 lg:row-span-9">
          <Image src="/image 42.png" alt="Some Image" fill style={{ objectFit: "contain" }} />
        </div>
        <div className="border-emerald-500 rounded-md bg-[#060f0b] border-2  md:col-span-4 md:row-span-3 lg:col-span-5 lg:row-span-4 w-full  p-3 md:p-4 lg:p-5 xl:p-6 flex flex-col items-center  gap-2 md:gap-3 lg:gap-4 min-h-[140px] lg:min-h-[180px]">
          <h2 className="text-white text-sm md:text-sm lg:text-lg font-weight-500 text-center leading-tight">
            Check out your team
          </h2>
          <button className="w-full px-3 md:px-4 py-2 pt-2.5 lg:pt-3 text-xs md:text-sm lg:text-base border border-emerald-500 bg-[#0f0f0d] text-white  rounded-full hover:bg-emerald-500 hover:text-white  transition-colors duration-200 touch-manipulation">
            Profile
          </button>
        </div>

        <div className="bg-yellow-500 w-full h-full md:col-span-4 md:row-span-6 lg:col-span-5 lg:row-span-8">
          jj
        </div>

        <div className="bg-indigo-500 w-full h-full md:col-span-3 md:row-span-7 lg:col-span-3 lg:row-span-9">
          jj
        </div>

        <div className="bg-purple-500 w-full h-full md:col-span-3 md:row-span-5 lg:col-span-6 lg:row-span-9">
          jj
        </div>

        <div
          className="border-emerald-500 bg-[#060f0b] rounded-md border-2 h-full 
                  md:col-span-4 md:row-span-3
                  lg:col-span-5 lg:row-span-4
                  w-full 
                  p-3 md:p-4 lg:p-5 xl:p-6
                  flex flex-col items-center 
                  gap-2 md:gap-3 lg:gap-4"
        >
          <h2 className="text-white text-sm md:text-sm lg:text-lg font-weight-500 text-center leading-tight">
            Submit your ideas
          </h2>
          <button
            className="w-full 
                       px-3 md:px-4
                       py-2 
                       pt-2.5 lg:pt-3
                       text-xs md:text-sm lg:text-base
                       border border-emerald-500 bg-[#0f0f0d] text-white 
                       rounded-full hover:bg-emerald-500 hover:text-white 
                       transition-colors duration-200"
          >
            Form
          </button>
        </div>
      </div>
    </div>
  );
}
