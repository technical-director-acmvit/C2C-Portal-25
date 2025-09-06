import Image from "next/image";

interface ImageBoxProps {
  image: string; 
  title: string;
}

const ImageBox =({ image, title}: ImageBoxProps) => {
  return (
    
    <div className="relative w-full aspect-square mb-3 h-full bg-white rounded-xl">
        <Image
          src={image}
          alt={title}
          fill
        />
      </div>
  );
}

export default ImageBox;