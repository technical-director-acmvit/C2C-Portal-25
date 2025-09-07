import Image from "next/image";

interface ImageBoxProps {
  image: string; 
  title: string;
  flag: number;
}

const ImageBox = ({ image, title, flag }: ImageBoxProps) => {
  return (
    flag ? 
    (
      <div className="relative w-full aspect-square mb-3 h-full rounded-xl border-2 border-emerald-500 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="rounded-xl"
        />
      </div>
    ) : 
    (
      <div className="relative w-full aspect-square mb-3 h-full rounded-xl border-emerald-500 border-t-8 border-2 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="rounded-xl"
        />
      </div>
    )
  );
}

export default ImageBox;