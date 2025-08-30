import Image from 'next/image';

interface TopperProps {
    text: string;
    className?: string;
}

const Topper: React.FC<TopperProps> = ({ text, className = '' }) => (
    <div className={`relative w-full flex items-center justify-left ${className}`}>
        <Image src="/Landing/footer-dock 1.svg" alt="Footer Dock" width={1920} height={200} className="w-full h-auto" />
        <span
            className="absolute inset-0 flex items-center justify-left text-center whitespace-nowrap font-trap font-bold leading-none text-transparent pl-55"
            style={{
                WebkitTextStroke: '2.41px #EFEFEF',
                fontSize: 'clamp(40px, 6vw, 77px)',
            }}
        >
            {text}
        </span>
    </div>
);

export default Topper;