import Image from 'next/image';

interface TopperProps {
    text: string;
    className?: string;
}

const Topper: React.FC<TopperProps> = ({ text, className = '' }) => (
    <div className={`relative w-full flex items-center justify-center ${className}`}>
        <Image src="/Landing/footer-dock 1.svg" alt="Footer Dock" width={1920} height={200} className="w-full h-auto" />
        <span className="text-center whitespace-nowrap"
            style={{
              WebkitTextStroke: '2.41px #EFEFEF',
              fontFamily: 'Trap, Arial, sans-serif',
              fontSize: 'clamp(40px, 6vw, 77px)',
              fontWeight: '100',
              lineHeight: '100%',
              color: 'transparent',
              textAlign: 'center'
            }}>
            {text}
        </span>
    </div>
);

export default Topper;