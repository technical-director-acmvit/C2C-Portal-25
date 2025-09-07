type Props = {
  placeholder: string;
};

export default function InputBox({ placeholder }: Props) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-full h-[87px] px-4 py-2 mt-4 rounded-lg border border-emerald-500 bg-[rgba(73,77,75,1)] text-white text-lg focus:outline-none focus:border-emerald-400 transition-colors duration-200"
    />
  );
}
