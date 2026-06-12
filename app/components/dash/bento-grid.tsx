"use client";
import SongCard from "./spotify-player";
import ButtonBox from "./button-box";
import ImageBox from "./image-box";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDashStore } from "@/app/stores/dash";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { getNotices } from "@/app/actions/notice";
import { getInstallUrlAction } from "@/app/actions/github";

export default function BentoGrid() {
    const [value, setValue] = React.useState<Dayjs | null>(dayjs());
    const setView = useDashStore((s) => s.setView);
    const data = useDashStore((s) => s.dashboard);
    const [notices, setNotices] = React.useState<{ ID: string; information: string; created_at: string }[]>([]);
    const [installUrl, setInstallUrl] = useState<string | null>(null);
    const connected = Boolean(data?.team?.github_installation_id || data?.team?.github_url);

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getNotices();
                if (mounted && data) setNotices(data);
            } catch (err) {
                console.error("Failed to load notices", err);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        (async () => {
            if (typeof window === "undefined") return;
            try {
                const link = await getInstallUrlAction(window.location.origin);
                setInstallUrl(link);
            } catch {
                setInstallUrl(null);
            }
        })();
    }, []);

        const displayNotices = Array.isArray(notices) && notices.length > 0 ? notices : [{ ID: "0", information: "No notices available", created_at: new Date().toISOString() }];
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <div className="px-4 md:hidden">
          <div className="flex flex-col gap-5 w-full mx-auto py-4">
            {/* Final Pitch Guidelines - full width */}
            <div className="w-full">
              <div className="bg-black w-full h-full flex p-4 rounded-xl border-green-700 border-2 items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-white font-bold md:text-lg">Guidelines for final pitches</h3>
                  <p className="text-white/80 text-xs sm:text-sm">Download the PDF and prepare accordingly.</p>
                </div>
                <a
                  href="/FinalPitch.pdf"
                  download
                  className="px-4 py-2 rounded-md border border-green-700 text-white hover:bg-green-700/20"
                >
                  Download
                </a>
              </div>
            </div>

            {/* Notice card - full width */}
            <div className="w-full">
              <div className="relative w-full h-44 overflow-hidden">
                {/* Background card layers - positioned relative to the container */}
                <div className="absolute top-1 left-1 right-1 bottom-1 bg-black border border-green-700 rounded-lg transform rotate-1"></div>
                <div className="absolute top-1 left-1 right-1 bottom-1 bg-black border border-green-700 rounded-lg transform -rotate-1"></div>

                {/* Main content card - exactly same positioning */}
                <div className="absolute top-1 left-1 right-1 bottom-1 bg-black border border-green-700 rounded-lg p-4 text-center text-white flex flex-col justify-center">
                  <h2 className="text-lg font-bold underline mb-3">NOTICE</h2>
                  <div className="text-sm">
                    <div className="text-sm">
                      <ul className="list-disc text-left mx-auto w-fit space-y-1 pl-6">
                        {displayNotices.map((notice: { ID: string; information: string }) => (
                          <li key={notice.ID}>{notice.information}</li>
                        ))}
                    </ul>
                  </div>
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

            <div className="border-emerald-500 bg-[#060f0b] rounded-lg border-2 w-full h-24 p-5 flex flex-col items-center justify-center">
              <ButtonBox
                text={connected ? "GitHub connected" : "Connect your GitHub"}
                btnText={connected ? "Manage" : "GitHub"}
                onClick={() => {
                  if (connected) return setView("github");
                  if (installUrl) {
                    window.location.href = installUrl;
                  } else {
                    setView("github");
                  }
                }}
              />
            </div>

            {/* Two-column layout for song and image */}
            <div className="grid grid-cols-2 gap-4">
              {/* Song card */}
              <div className="col-span-1 h-36 border-emerald-500 border rounded-lg overflow-hidden">
                <SongCard title="Octave...coming soon!" artist="" image="/dash/c2cplace.svg" />
              </div>

              {/* Building image card */}
              <div className="col-span-1 h-36 rounded-lg overflow-hidden">
                <ImageBox image="/image 41.png" title="some building" flag={1} />
              </div>
            </div>

            {/* Calendar - optimized for mobile */}
            <div className="bg-black border-green-700 border w-full h-80 flex items-center justify-center rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center p-2">
                <DateCalendar
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  sx={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    transform: "scale(0.9)",
                    transformOrigin: "center",
                    transition: "none",
                    willChange: "auto",
                    "& .MuiPickersCalendarHeader-root": {
                      color: "white",
                      paddingLeft: "8px",
                      paddingRight: "8px",
                      marginBottom: "8px",
                    },
                    "& .MuiPickersCalendarHeader-label": {
                      color: "white",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                    },
                    "& .MuiDayCalendar-weekDayLabel": {
                      color: "white",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    },
                    "& .MuiPickersDay-root": {
                      color: "white",
                      fontSize: "0.95rem",
                      minHeight: "40px",
                      minWidth: "40px",
                      margin: "2px",
                      transition: "background-color 0.15s ease",
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
                      transition: "background-color 0.15s ease",
                    },
                    "& .MuiDayCalendar-weekContainer": {
                      margin: "4px 0",
                    },
                    "& .MuiPickersSlideTransition-root": {
                      minHeight: "200px",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop grid - hidden on small screens, visible on md+ */}
        <div className="hidden md:block md:px-4">
          <div className="grid grid-cols-14 grid-rows-24 gap-4 w-full mx-auto max-w-none py-8">
            <div className="col-span-11 row-span-5">
              <div className="bg-black w-full h-full flex p-6 rounded-xl border-green-700 border-2 items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-white font-bold text-xl">Guidelines for final pitches</h3>
                  <p className="text-white/80 text-sm">Download the PDF and prepare accordingly.</p>
                </div>
                <a
                  href="/FinalPitch.pdf"
                  download
                  className="px-5 py-2 rounded-md border border-green-700 text-white hover:bg-green-700/20"
                >
                  Download
                </a>
              </div>
            </div>

            <div className="col-span-3 row-span-7 rounded-lg overflow-hidden flex items-center justify-center">
              <ImageBox image="/dash/shirt-mascot.svg" title="cool looking dude" flag={0} />
            </div>

            <div className="col-span-5 row-span-9 rounded-lg">
              <SongCard title="Octave...coming soon!" artist="" image="/dash/c2cplace.svg" />
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
                    height: "120%",
                    maxWidth: "100%",
                    paddingTop: "5%",
                    maxHeight: "100%",
                    transform: "scale(1)",
                    transformOrigin: "center",
                    transition: "none",
                    willChange: "auto",
                    "& .MuiPickersCalendarHeader-root": {
                      color: "white",
                      paddingLeft: "8px",
                      paddingRight: "8px",
                    },
                    "& .MuiPickersCalendarHeader-label": {
                      color: "white",
                      fontSize: "1.1rem",
                    },
                    "& .MuiDayCalendar-weekDayLabel": {
                      color: "white",
                      fontSize: "0.85rem",
                    },
                    "& .MuiPickersDay-root": {
                      color: "white",
                      fontSize: "0.9rem",
                      minHeight: "32px",
                      minWidth: "32px",
                      transition: "background-color 0.15s ease",
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
                      transition: "background-color 0.15s ease",
                    },
                    "& .MuiPickersSlideTransition-root": {
                      minHeight: "180px",
                    },
                  }}
                />
              </div>
            </div>

            <div className="border-emerald-500 bg-[#060f0b] border-2 col-span-3 row-span-9 p-6 flex flex-col items-center justify-center gap-4 rounded-lg">
              <div className="text-center">
                <div className="text-white text-lg font-semibold">{connected ? "GitHub connected" : "Connect your GitHub"}</div>
                {!connected && (
                  <div className="text-white/70 text-sm mt-1">Grant repository access via the GitHub App</div>
                )}
              </div>
              <button
                onClick={() => {
                  if (connected) return setView("github");
                  if (installUrl) {
                    window.location.href = installUrl;
                  } else {
                    setView("github");
                  }
                }}
                className="px-4 py-2 rounded-full border border-emerald-500 text-white hover:bg-emerald-600/20"
              >
                {connected ? "Manage" : "Connect"}
              </button>
            </div>

            {/* Notice card */}
            <div className="col-span-6 row-span-9 mb-6 rounded-lg">
              <div className="relative w-full h-full p-3 overflow-hidden">
                {/* Background card layers */}
                <div className="absolute inset-3 bg-black border border-green-700 rounded-lg transform rotate-3"></div>
                <div className="absolute inset-3 bg-black border border-green-700 rounded-lg transform -rotate-2"></div>

                {/* Main content card */}
                <div className="relative bg-black border border-green-700 rounded-lg p-3 text-center text-white h-full flex flex-col justify-center">
                  <h2 className="text-lg font-bold underline mb-2">NOTICE</h2>
                  <div className="text-sm">
                      <ul className="list-disc text-left mx-auto w-fit space-y-1 pl-6">
                        {displayNotices.map((notice: { ID: string; information: string }) => (
                          <li key={notice.ID}>{notice.information}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-emerald-500 bg-[#060f0b] border-2 col-span-5 row-span-4 p-8 flex flex-col items-center gap-4 rounded-lg">
              <ButtonBox text="View your idea" btnText="Form" onClick={() => setView("form")} />
            </div>
          </div>
        </div>
      </>
    </LocalizationProvider>
  );
}
