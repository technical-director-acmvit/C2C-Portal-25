"use client"
import SongCard from "./spotify-player"
import TimerInfo from "./timer"

export default function BentoGrid() {
    return (
        <>
            {/* Mobile grid - visible only on screens smaller than md */}
            <div className="grid grid-cols-10 grid-rows-28 h-[calc(100vh-12rem)] gap-2 min-h-[600px] md:hidden">
                <div className="bg-red-500 w-full h-full col-span-10 row-span-4">
                    <TimerInfo 
                    timer="12 : 21 : 12"
                    heading="Review 0"
                    info="lorem something something info here"
                    />
                </div>
                <div className="bg-purple-500 w-full h-full col-span-6 row-span-9">jj</div>
                <div className="bg-blue-500 w-full h-full col-span-4 row-span-10">jjjjjjjjjj</div>
                <div className="bg-orange-500 w-full h-full col-span-4 row-span-10">
                    <SongCard
                    title="My song"
                    artist="My name"
                    image="/landing/C2C Logo.svg"
                    />
                </div>
                <div className="bg-pink-500 w-full h-full col-span-6 row-span-5">jj</div>
                <div className="bg-green-500 w-full h-full col-span-6 row-span-8">jj</div>
                <div className="bg-yellow-500 w-full h-full col-span-4 row-span-10">jj</div>
                <div className="bg-indigo-500 w-full h-full col-span-6 row-span-6">jj</div>
         
            </div>

            {/* Desktop grid - hidden on small screens, visible on md+ */}
            <div className="hidden md:grid md:grid-cols-16 md:grid-rows-24 md:h-[calc(100vh-8rem)] gap-5 min-h-[600px]">
                <div className="bg-red-500 w-full h-full col-span-11 row-span-5">
                    <TimerInfo 
                    timer="12 : 21 : 12"
                    heading="Review 0"
                    info="lorem iajnfewjnfljenflqwn"
                    />
                </div>
                <div className="bg-blue-500 w-full h-full col-span-3 row-span-7">jj</div>
                <div className="bg-orange-500 w-full h-full col-span-5 row-span-9">
                    <SongCard
                    title="My song"
                    artist="My name"
                    image="/landing/C2C Logo.svg"
                    />
                </div>
                <div className="bg-pink-500 w-full h-full col-span-4 row-span-9">jj</div>
                <div className="bg-green-500 w-full h-full col-span-5 row-span-4">jj</div>
                <div className="bg-yellow-500 w-full h-full col-span-5 row-span-8">jj</div>
                <div className="bg-indigo-500 w-full h-full col-span-3 row-span-9">jj</div>
                <div className="bg-purple-500 w-full h-full col-span-6 row-span-9">jj</div>
                <div className="bg-violet-500 w-full h-full col-span-5 row-span-4">jj</div>
            </div>
        </>
    )
}