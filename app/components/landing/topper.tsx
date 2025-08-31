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
        <div className="relative w-2/3">
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
                    className="w-full h-auto"
                    style={{ filter: 'brightness(0.8)' }}
                    loading="lazy"
                />
            </div>
            <Image
                src="/landing/footer-dock 1.svg"
                alt="Footer Dock"
                width={1920}
                height={200}
                className="w-full h-auto"
                loading="lazy"
            />
            <span
                className="absolute pl-36 inset-0 z-10 flex items-center text-center whitespace-nowrap font-trap font-bold leading-none text-transparent"
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
            `}</style>
        </div>
    </div>

);

export default Topper;