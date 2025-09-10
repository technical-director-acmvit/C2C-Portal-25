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
      className={`w-full aspect-[4/3] rounded-[20px] border-[1.39px] border-green-400 ${selected ? 'bg-neutral-700' : 'bg-transparent'} overflow-hidden flex flex-col ${!onClick ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={onClick}
    >
      <h3 className="text-lg md:text-xl text-[#a6a3a3] font-bold text-center py-2 px-2">{text}</h3>
      <div className="flex-1 flex items-center justify-center p-2">
        <Image
          src={img}
          alt={title}
          width={120}
          height={120}
          className="object-contain max-w-full max-h-full"
        />
      </div>
    </div>
  );
}

