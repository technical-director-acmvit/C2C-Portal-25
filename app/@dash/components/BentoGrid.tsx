"use client";
import Image from "next/image";

export default function BentoGrid() {
  return (
    <>
      {/* Mobile grid - visible only on screens smaller than md */}
      <div className="grid grid-cols-10 grid-rows-28 h-[calc(100vh-12rem)] gap-2 min-h-[600px] md:hidden">
        <div className="bg-red-500 w-full h-full col-span-10 row-span-4">jj</div>
        <div className="bg-purple-500 w-full h-full col-span-6 row-span-9">jj</div>
        <div className="bg-blue-500 w-full h-full col-span-4 row-span-10">jj</div>
        <div className="bg-orange-500 w-full h-full col-span-4 row-span-10">jj</div>
        <div className="bg-pink-500 w-full h-full col-span-6 row-span-5">jj</div>
        <div className="bg-green-500 w-full h-full col-span-6 row-span-8">jj</div>
        <div className="bg-yellow-500 w-full h-full col-span-4 row-span-10">jj</div>
        <div className="bg-indigo-500 w-full h-full col-span-6 row-span-6">jj</div>
      </div>

      {/* Desktop grid - hidden on small screens, visible on md+ */}
      <div className="hidden md:grid md:grid-cols-16 md:grid-rows-24 md:h-[calc(100vh-8rem)] gap-5 min-h-[600px]">
        <div className="bg-red-500 w-full h-full col-span-11 row-span-5">jj</div>
        <div className="relative w-full h-full col-span-3 row-span-7">
          <Image
            src="/Group 1000007425.png"
            alt="Some Image"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="bg-orange-500 w-full h-full col-span-5 row-span-9">jj</div>
        <div className="relative w-full h-full col-span-4 row-span-9">
            <Image
            src="/image 42.png"
            alt="Some Image"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className=" border-emerald-500 bg-[#060f0b] border-2 h-full col-span-5 row-span-4 w-full p-6 flex flex-col items-center gap-4">
            <h2 className="text-white text-lg font-semibold text-center">
                Check out your team
            </h2>
            <button className="w-full px-4 py-2 pt-3 border border-emerald-500 text-white rounded-md hover:bg-emerald-500 hover:text-white transition">
                Profile
            </button>
        </div>
        <div className="bg-yellow-500 w-full h-full col-span-5 row-span-8">jj</div>
        <div className="bg-indigo-500 w-full h-full col-span-3 row-span-9">jj</div>
        <div className="bg-purple-500 w-full h-full col-span-6 row-span-9">jj</div>
        <div className=" border-emerald-500 bg-[#060f0b] border-2 h-full col-span-5 row-span-4 w-full p-6 flex flex-col items-center gap-4">
            <h2 className="text-white text-lg font-semibold text-center">
                Submit you ideas
            </h2>
            <button className="w-full px-4 py-2 pt-3 border border-emerald-500 text-white rounded-md hover:bg-emerald-500 hover:text-white transition">
                Form
            </button>
        </div>
      </div>
    </>
  );
}
