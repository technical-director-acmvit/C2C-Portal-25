"use client";
import SongCard from "./spotify-player";
import TimerInfo from "./timer";
import ButtonBox from "./button-box";
import ImageBox from "./image-box";
import * as React from "react";
import { useDashStore } from "@/app/stores/dash";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function BentoGrid() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const setView = useDashStore((s) => s.setView);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <div className="px-6 md:hidden">
          <div className="flex flex-col gap-6 w-full mx-auto py-6">
            {/* Timer info - full width, prominent */}
            <div className="w-full">
              <TimerInfo
                timer="12 : 21 : 12"
                heading="Review 0"
                info="lorem something something info here"
              />
            </div>

            {/* Notice card - full width */}
            <div className="w-full">
              <div className="relative w-full h-44">
                {/* Background card layers */}
                <div className="absolute inset-0 bg-black border border-green-700 rounded-lg transform rotate-1"></div>
                <div className="absolute inset-0 bg-black border border-green-700 rounded-lg transform -rotate-1"></div>

                {/* Main content card */}
                <div className="relative bg-black border border-green-700 rounded-lg p-5 text-center text-white h-full flex flex-col justify-center">
                  <h2 className="text-xl font-bold underline mb-4">NOTICE</h2>
                  <div className="text-base">
                    <ul className="list-disc text-left mx-auto w-fit space-y-2">
                      <li>This is to inform the design people that you all slay</li>
                      <li>Keep up the amazing work!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Button boxes - stacked vertically, touch-friendly */}
            <div className="border-emerald-500 bg-[#060f0b] rounded-lg border-2 w-full h-24 p-5 flex flex-col items-center justify-center">
              <ButtonBox text="Check out your team" btnText="Profile" onClick={() => setView("profile")} />
            </div>

            <div className="border-emerald-500 bg-[#060f0b] rounded-lg border-2 w-full h-24 p-5 flex flex-col items-center justify-center">
              <ButtonBox text="Submit your idea" btnText="Form" onClick={() => setView("form")} />
            </div>

            {/* Two-column layout for song and image */}
            <div className="grid grid-cols-2 gap-5">
              {/* Song card */}
              <div className="col-span-1 h-36 border-emerald-500 border rounded-lg overflow-hidden">
                <SongCard title="My song" artist="My name" image="/landing/C2C Logo.svg" />
              </div>

              {/* Building image card */}
              <div className="col-span-1 h-36 rounded-lg overflow-hidden">
                <ImageBox image="/image 41.png" title="some building" flag={1} />
              </div>
            </div>

            {/* Calendar - optimized for mobile */}
            <div className="bg-black border-green-700 border w-full h-96 flex items-center justify-center rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center p-4">
                <DateCalendar
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  sx={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    transform: "scale(1)",
                    transformOrigin: "center",
                    "& .MuiPickersCalendarHeader-root": {
                      color: "white",
                      paddingLeft: "12px",
                      paddingRight: "12px",
                      marginBottom: "12px",
                    },
                    "& .MuiPickersCalendarHeader-label": {
                      color: "white",
                      fontSize: "1.25rem",
                      fontWeight: "600",
                    },
                    "& .MuiDayCalendar-weekDayLabel": {
                      color: "white",
                      fontSize: "1rem",
                      fontWeight: "500",
                    },
                    "& .MuiPickersDay-root": {
                      color: "white",
                      fontSize: "1rem",
                      minHeight: "40px",
                      minWidth: "40px",
                      margin: "3px",
                    },
                    "& .MuiPickersDay-root.Mui-selected": {
                      backgroundColor: "green",
                      color: "white",
                      fontWeight: "bold",
                    },
                    "& .MuiPickersDay-root:hover": {
                      backgroundColor: "rgba(0, 128, 0, 0.3)",
                    },
                    "& .MuiPickersArrowSwitcher-button": {
                      color: "white",
                      minHeight: "48px",
                      minWidth: "48px",
                    },
                    "& .MuiDayCalendar-weekContainer": {
                      margin: "4px 0",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop grid - hidden on small screens, visible on md+ */}
        <div className="hidden md:block md:px-4">
          <div className="grid grid-cols-14 grid-rows-24 gap-5 w-full mx-auto max-w-none py-8">
            <div className="col-span-11 row-span-5">
              <TimerInfo timer="12 : 21 : 12" heading="Review 0" info="lorem iajnfewjnfljenflqwn" />
            </div>

            <div className="col-span-3 row-span-7 rounded-lg overflow-hidden flex items-center justify-center">
              <ImageBox image="/dash/shirt-mascot.svg" title="cool looking dude" flag={0} />
            </div>

            <div className="col-span-5 row-span-9 rounded-lg">
              <SongCard title="My song" artist="My name" image="/landing/C2C Logo.svg" />
            </div>

            <div className="col-span-4 row-span-9 rounded-lg overflow-hidden flex items-center justify-center">
              <ImageBox image="/image 42.png" title="c" flag={0} />
            </div>

            <div className="border-emerald-500 bg-[#060f0b] border-2 col-span-5 row-span-4 p-8 flex flex-col items-center gap-4 rounded-lg">
              <ButtonBox text="Check out your team" btnText="Profile" onClick={() => setView("profile")} />
            </div>

            {/* Calendar with proper overflow handling for desktop */}
            <div className="bg-black border-green-700 border col-span-5 row-span-8 rounded-lg overflow-hidden">
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

            <div className="col-span-3 row-span-9 rounded-lg overflow-hidden flex items-center justify-center">
              <ImageBox image="/image 41.png" title="c" flag={0} />
            </div>

            {/* Notice card */}
            <div className="col-span-6 row-span-9 mb-8 rounded-lg">
              <div className="relative w-full h-full p-4">
                {/* Background card layers */}
                <div className="absolute inset-4 bg-black border border-green-700 rounded-lg transform rotate-3"></div>
                <div className="absolute inset-4 bg-black border border-green-700 rounded-lg transform -rotate-2"></div>

                {/* Main content card */}
                <div className="relative bg-black border border-green-700 rounded-lg p-4 text-center text-white h-full flex flex-col justify-center">
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

            <div className="border-emerald-500 bg-[#060f0b] border-2 col-span-5 row-span-4 p-8 flex flex-col items-center gap-4 rounded-lg">
              <ButtonBox text="Submit your ideas" btnText="Form" onClick={() => setView("form")} />
            </div>
          </div>
        </div>
      </>
    </LocalizationProvider>
  );
}
