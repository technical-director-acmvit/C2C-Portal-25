"use client";
import External from "./external";
import Internal from "./internal";
import { useState, useEffect } from "react";
import PortalButton from "./ui/button";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const Portal = ({ userEmail }: { userEmail?: string | null }) => {
  const [selected, setSelected] = useState<"internal" | "external" | null>(null);
  const [showVitModal, setShowVitModal] = useState(false);
  const { data: session } = useSession();
  const emailToCheck = session?.user?.email ?? userEmail ?? null;
  const isVitStudentEmail = emailToCheck ? /@vitstudent\.ac\.in$/i.test(emailToCheck.trim()) : false;
  const whitelist_enabled = process.env.NEXT_PUBLIC_WHITELIST_ENABLED === "true";

  console.log("Portal userEmail:", userEmail);

    if (selected === null && userEmail) {
      const isVitStudent = /@vitstudent\.ac\.in$/i.test(userEmail.trim());
      if (isVitStudent) {
        setSelected("internal");
      }
    }

    console.log("Portal selected:", selected);
    console.log("Portal isVitStudentEmail:", isVitStudentEmail);
  if (selected === "internal") {
    return <Internal onBack={() => setSelected(null)} mail={emailToCheck} />;
  }
  if (selected === "external") {
    return <External onBack={() => setSelected(null)} />;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen relative">
      {/* Background image via next/image */}
      <Image
        src="/portal/bg1.svg"
        alt=""
        aria-hidden
        fill
        className="object-cover"
        priority={false}
      />
      <div className="flex flex-col items-center justify-center h-full px-4 text-center relative z-10">
        <div className="flex items-center gap-3 mb-6">
          {/* <BackChevron /> */}
          <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl">
            Are you a VIT student?
          </h1>
        </div>
        <div className="flex flex-row flex-wrap gap-3 sm:gap-6 w-full items-center justify-center">
          <PortalButton
            className="px-4 py-2 text-[16px] sm:text-[18px]"
            onClick={() => setShowVitModal(true)}
          >
            Yes
          </PortalButton>
          <PortalButton
            className="px-4 py-2 text-[16px] sm:text-[18px]"
            onClick={() => setSelected("external")}
          >
            No
          </PortalButton>
        </div>
      </div>

      {showVitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowVitModal(false)}
          />

          {/* Modal card */}
          <div className="flex items-center justify-center h-full px-4">
            <div
              className="w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 md:p-8 rounded-2xl"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
                backdropFilter: "blur(10px) saturate(120%)",
                boxShadow:
                  "0 12px 40px rgba(0,0,0,0.55), 0 6px 24px rgba(72,186,134,0.06) inset, 0 1px 0 rgba(255,255,255,0.02) inset",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <h2
                className="text-white text-center mb-4 text-lg sm:text-xl"
                style={{
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontWeight: "700",
                  letterSpacing: "1px",
                }}
              >
                Please log in through your VIT email id
              </h2>

              <p className="text-gray-300 text-center mb-6 text-sm sm:text-base">
                {emailToCheck ? (
                  <>
                    Logged in as{" "}<span className="text-white font-semibold">{emailToCheck}</span>.
                  </>
                ) : (
                  "You must use your VIT email to proceed."
                )}
              </p>

              <div className="flex items-center justify-center gap-3">
                {!isVitStudentEmail && (
                    <PortalButton
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-4 py-2"
                    >
                    Log out
                    </PortalButton>
                )}

                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Portal;
