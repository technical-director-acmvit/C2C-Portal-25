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
      className="flex-1 bg-[rgba(6,15,11,1)] border-2 border-emerald-500 h-[87px] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400"
    />
  );
}