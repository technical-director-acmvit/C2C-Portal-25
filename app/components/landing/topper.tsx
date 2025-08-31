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
      <span
        className=" absolute inset-0 z-10 flex items-center justify-center md:justify-start text-center whitespace-normal 
                        md:whitespace-nowrap px-4 pl-10 sm:pr-72 md:pl-40 lg:pl-44 xl:pl-52 font-trap font-bold leading-none text-transparent 
                        topper-text transform translate-x-[-23%] sm:translate-x-4 md:translate-x-0 text-hollow-text text-2xl sm:text-4xl lg:text-7xl 
                        md:text-5xl mb-4 xl:text-8xl pb-4"
      >
        {text}
      </span>
    </div>
  </div>
);

export default Topper;
