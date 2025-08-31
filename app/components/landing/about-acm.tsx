import Image from 'next/image';
import DotGrid from './dot-grid';
import GradientBG from './gradient-bg';
import Topper from './topper';

const About = ({ children }: { children?: React.ReactNode }) => (
    <GradientBG>
        <div className="w-full h-[400vh] relative overflow-hidden">
            <Topper text="About ACM" />
            <DotGrid dotSize={1.5} gap={25} baseColor="#a3a3a3" className='z-50' />
            {/* Absolutely center the text and ensure it's above the canvas */}
            <div className="absolute inset-0 z-20 flex flex-col items-center pointer-events-none px-4">
                <Image
                    src="/landing/acm-nature-logo.svg"
                    alt="ACM Logo With Name"
                    width={200}
                    height={80}
                    className="mb-6 pointer-events-auto z-100 pt-64"
                    draggable={false}
                    loading="lazy"
                />
                <div
                    className="w-full max-w-[794px] text-justify justify-start text-zinc-100 text-xl sm:text-2xl font-thin leading-8 md:leading-10 pointer-events-auto pt-8"
                    style={{ fontFamily: "DMSans-Regular, sans-serif" }}
                >
                    Id qui cupidatat dolor veniam incididunt. Sint sit officia eu deserunt dolore officia anim labore deserunt incididunt consectetur do. Magna incididunt aliqua nisi Lorem. Pariatur sit non ex tempor est excepteur occaecat reprehenderit ex velit laboris esse cillum incididunt ullamco.
                </div>
                <div className="h-[320px]" />
                <h1 
                    className="text-center break-words hyphens-auto mb-2 sm:mb-4"
                    style={{
                    WebkitTextStroke: '2.41px #48ba86',
                    fontFamily: 'Trap-Bold, Arial, sans-serif',
                    fontSize: 'clamp(24px, 5.2vw, 77px)',
                    fontWeight: '700',
                    lineHeight: 'clamp(110%, 6vw, 130%)',
                    color: 'transparent',
                    textAlign: 'center',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                    }}
                >
                    We can be heroes everywhere we go,<br/>We can have all that we ever want.
                </h1>

                <div className="w-full max-w-[900px] px-0 md:px-0 text-justify justify-start text-zinc-100 text-xl sm:text-2xl md:text-3xl font-normal font-['DM_Sans'] leading-8 md:leading-10 pt-24">We can be heroes everywhere we go, not through capes or crowns, but through ideas that inspire change. At hackathons, and especially at Code2Create, this has always been the spirit: that we can have all that we ever want - the freedom to imagine, the courage to build, and the legacy of creating something larger than ourselves.”</div>
                <div className="absolute left-0 bottom-0 z-10 pointer-events-none select-none my-200  ">
                    <svg width="361" height="810" viewBox="0 0 361 810" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_2996_62753" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="-270" y="13" width="617" height="732">
                            <rect x="-57.2065" y="13.7432" width="429.556" height="621.214" transform="rotate(20 -57.2065 13.7432)" fill="#C4C4C4"/>
                        </mask>
                        <g mask="url(#mask0_2996_62753)">
                            <path d="M24.4682 269.449L95.8939 262.285L103.49 325.667L-126.775 651.033L-186.283 636.23L-225.995 628.362L24.4682 269.449Z" fill="#535353"/>
                            <path d="M99.5308 300.691L193.422 372.844L-44.9969 713.342L-141.84 647.293L99.5308 300.691Z" fill="#535353"/>
                            <path d="M185.122 281.327C185.319 281.279 185.513 281.415 185.535 281.617L194.879 367.827L192.545 371.053L188.233 367.324L187.781 366.933L187.183 366.917L178.709 366.685L178.701 366.685L178.694 366.684L168.498 366.5L162.575 350.649L162.203 349.654L161.145 349.566L139.424 347.762L133.812 329.913L133.476 328.846L132.363 328.746L111.278 326.855L102.106 304.521L101.749 301.827L185.122 281.327Z" fill="#C4C4C4" stroke="#535353" strokeWidth="3.35067"/>
                            <path d="M153.292 289.414L184.561 279.882C185.789 279.508 187.049 280.365 187.151 281.646L189.81 314.984L175.103 314.982L164.147 311.723L157.337 302.543L153.292 289.414Z" fill="#535353"/>
                            <path d="M158.227 292.87L182.115 286.062L168.492 297.115L165.727 301.063L165.529 309.75L159.706 301.26L158.227 292.87Z" fill="#0665A7"/>
                            <path d="M105.575 306.871L114.194 325.422L134.574 327.176L-112.688 681.583L-133.72 650.592L105.575 306.871Z" fill="#86CCAC"/>
                            <path d="M163.573 347.482L170.259 364.679L188.705 365.08L-60.4591 723.032L-84.6636 700.759L163.573 347.482Z" fill="#FAF2F0"/>
                            <path d="M134.574 327.177L143.193 345.728L163.573 347.482L-78.4189 693.135L-107.418 672.83L134.574 327.177Z" fill="#48BA86"/>
                        </g>
                    </svg>
                </div>
                
                {children}
            </div>
        </div>
    </GradientBG>
);

export default About;
