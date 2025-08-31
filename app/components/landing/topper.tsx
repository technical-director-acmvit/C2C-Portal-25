import Image from 'next/image';

interface TopperProps {
    text: string;
    className?: string;
}


function getFontSize(text: string) {
    if (text.length > 40) return 'clamp(18px, 3vw, 36px)';
    if (text.length > 25) return 'clamp(20px, 3.5vw, 48px)';
    return 'clamp(24px, 4vw, 60px)';
}

const Topper: React.FC<TopperProps> = ({ text, className = '' }) => (
    <div className={`relative flex justify-left pb-12 ${className}`}>
        {/* Responsive width: full on mobile, wider on desktop to increase spacing between bulbs */}
        <div className="relative w-full sm:w-11/12 md:w-5/6 lg:w-4/5 xl:w-[88%] 2xl:w-[90%] overflow-hidden">
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    animation: 'blink 1.5s infinite',
                    opacity: 0.5,
                }}
            >
                <Image
                    src="/landing/footer-dock 1.svg"
                    alt="Footer Dock"
                    width={1920}
                    height={200}
                    className="w-full h-auto scale-x-110 sm:scale-x-100 origin-left"
                    style={{ filter: 'brightness(0.8)' }}
                />
            </div>
            <Image
                src="/landing/footer-dock 1.svg"
                alt="Footer Dock"
                width={1920}
                height={200}
                className="w-full h-auto scale-x-110 sm:scale-x-100 origin-left"
            />
            <span
                className="absolute inset-0 z-10 flex items-center justify-center md:justify-start text-center whitespace-normal md:whitespace-nowrap px-6 sm:px-8 md:pl-30 lg:pl-48 xl:pl-72 2xl:pl-50 pr-6 md:pr-8 font-trap font-bold leading-none text-transparent topper-text transform translate-x-[-23%] sm:translate-x-4 md:translate-x-0"
                style={{
                    WebkitTextStroke: '2.41px #EFEFEF',
                    fontSize: getFontSize(text),
                }}
            >
                {text}
            </span>
            <style jsx>{`
                @keyframes blink {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 1; }
                }
                @media (max-width: 640px) {
                  /* Slightly reduce stroke on small screens for readability */
                  .topper-text { -webkit-text-stroke-width: 1.7px; }
                }
            `}</style>
        </div>
    </div>

);

export default Topper;
