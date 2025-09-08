type Props = {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  invalid?: boolean;
};

export default function InputBox({ placeholder, value, onChange, onBlur, className = "", invalid = false }: Props) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`w-full h-20 bg-neutral-950 rounded-2xl border px-4 text-white placeholder:text-gray-400 
             text-lg text-left flex items-center focus:outline-none transition-colors ${invalid ? "border-red-500 focus:border-red-400" : "border-green-400"} ${className}`}
    />
  );
}