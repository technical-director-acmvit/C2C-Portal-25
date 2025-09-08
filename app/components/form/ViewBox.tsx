type Props = {
  readOnly?: boolean;
  data: string;
};

export default function ViewBox({ data, readOnly = false }: Props) {
  return (
    <input
      type="text"
      value={data}
      readOnly={readOnly}
      className="w-full h-[87px] px-4 py-2 mt-4 rounded-lg border border-emerald-500 bg-[rgba(73,77,75,1)] text-white text-lg focus:outline-none focus:border-emerald-400 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
    />
  );
}