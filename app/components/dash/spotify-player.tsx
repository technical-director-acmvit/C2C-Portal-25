import Image from "next/image";

interface SongCardProps {
  image: string; 
  title: string;  
  artist: string;  
}

const SongCard =({ image, title, artist }: SongCardProps) => {
  return (
    <div className="w-full h-full flex flex-col bg-black rounded-xl p-3 border-green-700 border-2">
      <div className="relative w-full aspect-square mb-3 bg-white rounded-xl h-5/8">
        <Image
          src={image}
          alt={title}
          fill
          sizes="98%"
        />
      </div>
      <h3 className="text-white font-bold sm:p-1">{title}</h3>
      <p className="text-white text-xs sm:p-1">{artist}</p>
    </div>
  );
}

export default SongCard;