"use client"

interface TimerInfoProps {
  timer: string
  heading: string
  info: string
}

const TimerInfo = ({ timer, heading, info }: TimerInfoProps) => {
  return (
    <div className="bg-black w-full h-full flex p-4 rounded-xl border-green-700 border-2">
      <div className="border border-green-700 rounded-lg px-4 py-2 w-1/2 flex items-center justify-center">
        <span className="text-white md:text-4xl">{timer}</span>
      </div>
      <div className="w-1/2 flex flex-col justify-center pl-4">
        <h3 className="text-white font-bodl md:text-lg">{heading}</h3>
        <p className="text-white text-xs sm:text-sm">{info}</p>
      </div>
    </div>
  )
}

export default TimerInfo;