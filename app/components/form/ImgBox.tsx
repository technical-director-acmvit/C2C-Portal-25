import { div } from "motion/react-client";
import Image from "next/image";

type Props = {
  text: string;
  img: string;
  title: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function ImgBox({ text, img, title, selected = false, onClick }: Props) {
  return (
    <div
      className={`h-[250px] flex-1 min-w-0 border-2 rounded-4xl m-2 border-emerald-500 flex flex-col justify-around col-span-2 row-span-2 cursor-pointer transition-colors duration-200 ${selected ? 'bg-gray-700' : 'bg-transparent'}`}
      onClick={onClick}
    >
      <h3 className="text-[22px] font-bold text-center my-2">{text}</h3>
      <Image
        src={img}
        alt={title}
        width={150}
        height={150}
        className="mx-auto"
      />
    </div>
  );
}
