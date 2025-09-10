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
      className={`w-[757px] h-20 bg-neutral-600 rounded-2xl border border-green-400 mt-4 text-white px-4 ${readOnly ? 'cursor-not-allowed' : ''}`}
    />
  );
}