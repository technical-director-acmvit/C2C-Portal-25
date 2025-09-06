"use client";
import SongCard from "./spotify-player";
import TimerInfo from "./timer";
import ButtonBox from "./ButtonBox";
import ImageBox from "./ImageBox";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function BentoGrid() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        {/* Mobile grid - visible only on screens smaller than md */}
        <div className="flex justify-center h-[calc(100vh)] overflow-y-auto px-2 md:hidden">
          <div className="grid grid-cols-14 grid-rows-20 gap-2 w-full mx-auto max-w-[90%] min-h-[150vh] py-2">
            {/* Timer info - spans full width at top */}
            <div className="bg-red-500 w-full h-full col-span-14 row-span-6">
              <TimerInfo
                timer="12 : 21 : 12"
                heading="Review 0"
                info="lorem something something info here"
              />
            </div>

            {/* Notice card - left side */}
            <div className="w-full h-full col-span-8 row-span-8 mb-8">
              <div className="relative w-full h-full p-4">
                {/* Background card layers */}
                <div className="absolute inset-4 bg-black border border-green-700 rounded-lg transform rotate-3"></div>
                <div className="absolute inset-4 bg-black border border-green-700 rounded-lg transform -rotate-2"></div>

                {/* Main content card */}
                <div className="relative bg-black border border-green-700 rounded-lg p-4 text-center text-white h-full w-full flex flex-col justify-center">
                  <h2 className="text-lg font-bold underline mb-4">NOTICE</h2>
                  <div className="text-sm">
                    <ul className="list-disc text-left mx-auto w-fit space-y-1">
                      <li>This is to inform the design people that you all slay</li>
                      <li>Keep up the amazing work!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500 w-full h-full col-span-6 row-span-9 col-start-9">
              <ImageBox image="/Group 1000007425.png" title="cool looking dude" />
            </div>

            <div className="bg-orange-500 w-full h-full col-span-6 row-span-9 row-start-16 col-start-1">
              <ImageBox image="/image 41.png" title="cool looking dude" />
            </div>

            {/* First button box - left side */}
            <div className="border-emerald-500 mb-2 bg-[#060f0b] rounded-md border-2 h-full col-span-8 row-span-4 w-full p-4 flex flex-col items-center row-start-16 col-start-7">
              <ButtonBox text="Check out your team" btnText="Profile" />
            </div>

            {/* Calendar - left side */}
            <div className="bg-black border-green-700 border w-full h-full col-span-8 row-span-5 flex items-center justify-center rounded-lg overflow-hidden row-start-21 col-start-7">
              <div className="w-full h-full flex items-center justify-center p-2">
                <DateCalendar
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  sx={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    transform: "scale(0.65)",
                    transformOrigin: "center",
                    "& .MuiPickersCalendarHeader-root": {
                      color: "white",
                      paddingLeft: "4px",
                      paddingRight: "4px",
                    },
                    "& .MuiPickersCalendarHeader-label": {
                      color: "white",
                      fontSize: "0.85rem",
                    },
                    "& .MuiDayCalendar-weekDayLabel": {
                      color: "white",
                      fontSize: "0.7rem",
                    },
                    "& .MuiPickersDay-root": {
                      color: "white",
                      fontSize: "0.75rem",
                    },
                    "& .MuiPickersDay-root.Mui-selected": {
                      backgroundColor: "green",
                      color: "white",
                    },
                    "& .MuiPickersDay-root:hover": {
                      backgroundColor: "rgba(0, 128, 0, 0.3)",
                    },
                    "& .MuiPickersArrowSwitcher-button": {
                      color: "white",
                    },
                  }}
                />
              </div>
            </div>

            {/* Song card - right side */}
            <div className="w-full h-full col-span-6 row-span-5 col-start-1">
              <SongCard title="My song" artist="My name" image="/landing/C2C Logo.svg" />
            </div>

            {/* Second button box - left side */}
            <div className="border-emerald-500 mb-2 bg-[#060f0b] rounded-md border-2 h-full col-span-8 row-span-4 w-full p-4 flex flex-col items-center col-start-7">
              <ButtonBox text="Submit your idea" btnText="Form" />
            </div>
          </div>
        </div>

        {/* Desktop grid - hidden on small screens, visible on md+ */}
        <div className="hidden md:flex md:justify-center md:h-[calc(100vh)] md:overflow-y-auto md:px-4">
          <div className="grid grid-cols-14 grid-rows-24 gap-5 w-full mx-auto max-w-[80%] min-h-[150vh] py-8">
            {/* your grid items */}

            <div className="w-full h-full col-span-11 row-span-5">
              <TimerInfo timer="12 : 21 : 12" heading="Review 0" info="lorem iajnfewjnfljenflqwn" />
            </div>
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center col-span-3 row-span-7">
              <ImageBox image="/Group 1000007425.png" title="cool looking dude" />
            </div>
            <div className="bg-orange-500 w-full h-full col-span-5 row-span-9">
              <SongCard title="My song" artist="My name" image="/landing/C2C Logo.svg" />
            </div>
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center col-span-4 row-span-9">
              <ImageBox image="/image 42.png" title="c" />
            </div>
            <div className="border-emerald-500 rounded-md bg-[#060f0b] border-2 col-span-5 row-span-4 w-full p-8 flex flex-col items-center gap-4">
              <ButtonBox text="Check out your team" btnText="Profile" />
            </div>
            {/* Calendar with proper overflow handling for desktop */}
            <div className="bg-black border-green-700 border w-full h-full col-span-5 row-span-8 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center p-2">
                <DateCalendar
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  sx={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    transform: "scale(0.85)",
                    transformOrigin: "center",
                    "& .MuiPickersCalendarHeader-root": {
                      color: "white",
                      paddingLeft: "8px",
                      paddingRight: "8px",
                    },
                    "& .MuiPickersCalendarHeader-label": {
                      color: "white",
                      fontSize: "1rem",
                      "@media (max-width: 1024px)": {
                        fontSize: "0.9rem",
                      },
                      "@media (max-width: 768px)": {
                        fontSize: "0.8rem",
                      },
                    },
                    "& .MuiDayCalendar-weekDayLabel": {
                      color: "white",
                      fontSize: "0.8rem",
                      "@media (max-width: 1024px)": {
                        fontSize: "0.75rem",
                      },
                      "@media (max-width: 768px)": {
                        fontSize: "0.7rem",
                      },
                    },
                    "& .MuiPickersDay-root": {
                      color: "white",
                      fontSize: "0.85rem",
                      "@media (max-width: 1024px)": {
                        fontSize: "0.8rem",
                      },
                      "@media (max-width: 768px)": {
                        fontSize: "0.75rem",
                      },
                    },
                    "& .MuiPickersDay-root.Mui-selected": {
                      backgroundColor: "green",
                      color: "white",
                    },
                    "& .MuiPickersDay-root:hover": {
                      backgroundColor: "rgba(0, 128, 0, 0.3)",
                    },
                    "& .MuiPickersArrowSwitcher-button": {
                      color: "white",
                    },
                  }}
                />
              </div>
            </div>
            <div className="relative w-full h-full border-emerald-500 border-1 overflow-hidden flex col-span-3 row-span-9 items-center justify-center">
              <ImageBox image="/image 41.png" title="c" />
            </div>

            {/* Notice card - changed to match purple div position */}
            <div className="w-full h-full col-span-6 row-span-9 mb-8">
              <div className="relative w-full h-full p-4">
                {/* Background card layers */}
                <div className="absolute inset-4 bg-black border border-green-700 rounded-lg transform rotate-3"></div>
                <div className="absolute inset-4 bg-black border border-green-700 rounded-lg transform -rotate-2"></div>

                {/* Main content card */}
                <div className="relative bg-black border border-green-700 rounded-lg p-4 text-center text-white h-full w-full flex flex-col justify-center">
                  <h2 className="text-lg font-bold underline mb-4">NOTICE</h2>
                  <div className="text-sm">
                    <ul className="list-disc text-left mx-auto w-fit space-y-1">
                      <li>This is to inform the design people that you all slay</li>
                      <li>Keep up the amazing work!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-emerald-500 bg-[#060f0b] rounded-md border-2 h-full col-span-5 row-span-4 w-full p-8 flex flex-col items-center gap-4">
              <ButtonBox text="Submit your ideas" btnText="Form" />
            </div>
          </div>
        </div>
      </>
    </LocalizationProvider>
  );
}
