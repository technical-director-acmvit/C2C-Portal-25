import { Viewport } from "next";
import "../../globals.css";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function DashLayout({ children }: { children: React.ReactNode }) {
    
  return (
    <>
      <div lang="en" className="h-full overflow-x-hidden">
            <div
              className={`overflow-x-hidden min-h-[100svh] overscroll-y-none touch-pan-y`}
            >
              {children}
            </div>
      </div>
    </>
  );
}
