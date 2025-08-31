import Image from 'next/image';
import DotGrid from './dot-grid';
import GradientBG from './gradient-bg';
import Topper from './topper';

const About = ({ children }: { children?: React.ReactNode }) => (
    <GradientBG>
        <div id="about" className="w-full h-[600px] relative overflow-hidden">
            <Topper text="About C2C" />
            <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" className='z-0' />
            {/* Absolutely center the text and ensure it's above the canvas */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4 transform translate-y-20">
                <div className="w-full max-w-[994px] text-justify justify-start text-zinc-100 text-xl sm:text-2xl md:text-3xl font-normal leading-8 md:leading-10 pointer-events-auto" style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
                    Code2Create (C2C) is ACM-VIT’s 48-hour national hackathon, open to participants from colleges across India. With multiple tracks, C2C challenges innovators of all levels, from beginners to pros, to tackle real-world problems, collaborate with peers, and learn from industry mentors. It’s a platform to showcase talent, build prototypes, and turn ideas into impact.
                </div>
                {children}
            </div>
            <Image
                src="/landing/hdmi.svg"
                alt="HDMI Decorative"
                width={450}
                height={355}
                className="absolute right-0 bottom-0 z-30 pointer-events-none select-none"
                draggable={false}
            />
        </div>
    </GradientBG>
);

export default About;
