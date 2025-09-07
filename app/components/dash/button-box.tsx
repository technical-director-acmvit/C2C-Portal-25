interface ButtonBoxProps {
  text: string;
  btnText: string;
  onClick?: () => void;
}

const BtnBox = ({ text, btnText, onClick }: ButtonBoxProps) => {
  return (
    <div>
      <h2 className="text-white text-sm lg:text-sm xl:text-lg font-weight-500 text-center leading-tight">
        {text}
      </h2>
      <button onClick={onClick} className="w-full px-3 py-2 mt-5 text-xs lg:text-sm xl:text-base border border-emerald-500 bg-[#0f0f0d] text-white rounded-full hover:bg-emerald-500 hover:text-white  transition-colors duration-200 touch-manipulation">
        {btnText}
      </button>
    </div>
  );
};

export default BtnBox;
