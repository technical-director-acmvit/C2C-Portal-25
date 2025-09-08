type Props = {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputBox({ placeholder, value, onChange }: Props) {
  return (
    <input
  type="text"
  placeholder={placeholder}
  value={value}
  onChange={onChange}
  className="w-[652px] h-20 bg-neutral-950 rounded-2xl border border-green-400 
             px-4 text-white placeholder:text-gray-400 
             text-lg text-left flex items-center"
/>
  );
}