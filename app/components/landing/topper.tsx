import Image from "next/image";

interface TopperProps {
  text: string;
  className?: string;
}

const Topper: React.FC<TopperProps> = ({ text, className = "" }) => (
  <div className={`relative flex justify-left pb-12 ${className} z-20 pt-6`}>
    {/* Responsive width: full on mobile, wider on desktop to increase spacing between bulbs */}
    <div className="relative w-fit overflow-hidden">
      <Image
        src="/landing/footer-dock 1.svg"
        alt="Footer Dock"
        width={1920}
        height={200}
        className="w-full h-auto scale-x-110 sm:scale-x-125 sm:scale-y-125 origin-left"
      />
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ animation: "blink 1.5s infinite", opacity: 0.5 }}
      >
        <Image
          src="/landing/footer-dock 1.svg"
          alt="Footer Dock"
          width={1920}
          height={200}
          className="w-full h-auto scale-x-110 sm:scale-x-125 sm:scale-y-125 origin-left"
          style={{ filter: "brightness(0.8)" }}
        />
      </div>
    <span className="absolute inset-0 z-10 flex items-center justify-center md:justify-start text-center whitespace-normal md:whitespace-nowrap px-4 sm:px-6 lg:pl-10 xl:pl-12 pr-4 md:pr-6 font-trap font-bold leading-none text-transparent topper-text transform -translate-x-4 sm:translate-x-2 md:translate-x-0 text-hollow-text text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl mb-4">
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
