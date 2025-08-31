
"use client";
import { useState } from 'react';
import Topper from './topper';
import RevolvingCards, { cardsData } from './RevolvingCards';



const Tracks = ({ children }: { children?: React.ReactNode }) => {
    const [currentTrack, setCurrentTrack] = useState(0);

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            <div className="relative z-10">
                <Topper text="Tracks" />
                {children}
            </div>

            <div className="w-full max-w-[1080px] min-h-[500px] bg-white/10 rounded-[20px] overflow-hidden flex flex-col md:flex-row items-stretch justify-between mx-auto mt-8 px-6 md:px-8 py-8 gap-8 border border-green-900/40">
                {/* Left Side */}
                <div className="flex flex-col justify-between md:w-[55%]">
                    <div>
                        <div className="justify-start">
                            <span className="text-white text-5xl md:text-7xl lg:text-8xl font-bold font-['Trap'] leading-tight md:leading-[90px]">{cardsData[currentTrack].title.split(' ')[0]} </span>
                            <span className="text-[#48BA86] text-5xl md:text-7xl lg:text-8xl font-bold font-['Trap'] leading-tight md:leading-[90px]">{cardsData[currentTrack].title.split(' ')[1] ?? ''}</span>
                        </div>
                        <div className="mt-4 max-w-[600px] text-white text-xl md:text-2xl font-normal font-['DM_Sans']">{cardsData[currentTrack].desc}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-8">
                        {cardsData.map((c, idx) => (
                            <button
                                key={c.title}
                                onClick={() => setCurrentTrack(idx)}
                                className={`pb-1 border-b-2 transition-colors ${idx === currentTrack ? 'text-green-400 border-green-400' : 'text-white/90 border-transparent hover:border-green-400'}`}
                            >
                                {c.title}
                            </button>
                        ))}
                    </div>
                </div>
                <RevolvingCards currentTrack={currentTrack} />
            </div>
        </div>
    );
};

export default Tracks;