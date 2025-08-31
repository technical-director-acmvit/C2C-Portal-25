import Topper from './topper';
import DotGrid from './dot-grid';

const Speaker = ({ children }: { children?: React.ReactNode }) => (
    <div id="speakers" className="relative w-full min-h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full -z-1 pointer-events-none" style={{ background: '#1e1e1e' }}>
            <DotGrid dotSize={3} gap={25} baseColor="#a3a3a3" className="w-full h-full" />
        </div>
        <div className="relative z-10">
            <Topper text="speaker" />
            {children}
        </div>

        <div className="flex justify-center w-full px-4">
          <div className="flex flex-col md:flex-row justify-start items-center md:items-start gap-8 md:gap-14 max-w-6xl w-full">
            <div className="w-full max-w-[400px] h-[370px] relative bg-white/10 rounded-2xl overflow-hidden flex-shrink-0">
              <div className="w-[90%] h-[260px] left-[5%] top-[18px] absolute bg-neutral-900" />
              <div className="left-[5%] top-[290px] absolute justify-start">
                <span className="text-white text-2xl md:text-3xl font-bold font-['Pilat_Extended']">Speaker<br/></span>
                <span className="text-white text-lg md:text-xl font-bold font-['Pilat_Extended']">Designation</span>
              </div>
            </div>
            <div className="text-white text-base sm:text-lg md:text-2xl font-bold font-['DM_Sans'] tracking-wide z-10 max-w-3xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
            </div>
          </div>
        </div>
    </div>
);

export default Speaker;
