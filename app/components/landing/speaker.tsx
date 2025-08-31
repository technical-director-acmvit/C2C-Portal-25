import Topper from './topper';
import DotGrid from './dot-grid';

const Speaker = ({ children }: { children?: React.ReactNode }) => (
    <div id="speakers" className="relative w-full min-h-screen overflow-hidden">
        {/* Gradient background that blends with the page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] z-0" />
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            <DotGrid dotSize={3} gap={25} baseColor="#a3a3a3" className="w-full h-full" />
        </div>
        <div className="relative z-20">
            <Topper text="speaker" />
            {children}
        </div>

        <div className="flex justify-center w-full">
        <div className="inline-flex justify-start items-center gap-14">
            <div className="w-[400px] h-[370px] relative bg-white/10 rounded-2xl overflow-hidden">
                <div className="w-[360px] h-[260px] left-[20px] top-[18px] absolute bg-neutral-900" />
                <div className="left-[20px] top-[290px] absolute justify-start">
                    <span className="text-white text-3xl font-bold font-['Pilat_Extended']">Speaker<br/></span>
                    <span className="text-white text-xl font-bold font-['Pilat_Extended']">Designation</span>
                </div>
            </div>
            <div className="w-86 justify-start text-white text-2xl font-bold font-['DM_Sans'] tracking-wide z-10">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</div>
        </div>
        </div>
    </div>
);

export default Speaker;
