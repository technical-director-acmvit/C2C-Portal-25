import Image from "next/image";

interface TopperProps {
  text: string;
  className?: string;
}

const Topper: React.FC<TopperProps> = ({ text, className = "" }) => (
  <div className={`relative flex justify-left pb-12 ${className}`}>
    {/* Responsive width: full on mobile, wider on desktop to increase spacing between bulbs */}
    <div className="relative w-fit overflow-hidden">
      <Image
        src="/landing/footer-dock 1.svg"
        alt="Footer Dock"
        width={1920}
        height={200}
        className="w-full h-auto scale-x-110 sm:scale-x-100 origin-left"
      />
      <span className=" absolute inset-0 z-10 flex items-center justify-center md:justify-start text-center whitespace-normal md:whitespace-nowrap px-6 sm:px-8 lg:pl-36 xl:pl-48 pr-6 md:pr-8 font-trap font-bold leading-none text-transparent topper-text transform translate-x-[-23%] sm:translate-x-4 md:translate-x-0 text-hollow-text text-2xl sm:text-6xl lg:text-6xl md:text-3xl mb-4 xl:text-7xl">
        {text}
      </span>
    </div>
  </div>
);

export default Topper;
