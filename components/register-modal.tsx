"use client";

import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { InteractiveHoverButton } from "@/app/components/landing/ui/cta-button";
import { DISCORD_URL } from "@/lib/env";

const ModalContext = React.createContext<{
  isAnyModalOpen: boolean;
  setIsAnyModalOpen: (open: boolean) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
} | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAnyModalOpen, setIsAnyModalOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => {
    // console.log("[OPENING MODAL]");
    setIsModalOpen(true);
    setIsAnyModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAnyModalOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isAnyModalOpen,
        setIsAnyModalOpen,
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    return {
      isAnyModalOpen: false,
      setIsAnyModalOpen: () => {},
      isModalOpen: false,
      openModal: () => {},
      closeModal: () => {},
    };
  }
  return context;
};

export const useIsAnyModalOpen = () => {
  const { isAnyModalOpen } = useModalContext();
  return isAnyModalOpen;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  url?: string;
  redirectUrl?: string;
  className?: string;
}

export const RegisterModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title = "Register for Code2Create",
  // redirectUrl  = "https://gravitas.vit.ac.in/events/a6be23db-1fd8-4a5f-825c-4a2d00a85dba",
  redirectUrl = "https://gravitas.vit.ac.in/events/a6be23db-1fd8-4a5f-825c-4a2d00a85dba",
  className,
}) => {
  // Keep track of scroll position to prevent page jump on mobile when locking body scroll
  const scrollYRef = React.useRef(0);
  const prevScrollBehaviorRef = React.useRef<string | undefined>(undefined);
  const restoredOnceRef = React.useRef(false);
  // Reusable pill styled like timeline.tsx (static, non-interactive)
  const StepPill: React.FC<{
    id: string;
    label: React.ReactNode;
    href?: string;
    compact?: boolean;
    className?: string;
  }> = ({ id, label, href, compact = false, className }) => {
    const pillContent = (
      <div
        className={cn(
          "relative flex items-center gap-3 sm:gap-3.5 px-4 sm:px-5 py-1.5 sm:py-2 min-w-[220px] max-w-full",
          compact && "px-3 py-1 min-w-0 min-h-[52px]",
          className,
        )}
        style={{
          borderRadius: "72px",
          background: "rgba(255, 255, 255, 0.10)",
          border: "2px solid #6B7280",
        }}
      >
        <div className={cn("relative shrink-0", compact ? "w-7 h-7" : "w-8 h-8 sm:w-10 sm:h-10")}>
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 pointer-events-none animate-spin [animation-duration:12s] [transform-origin:50%_50%] motion-reduce:animate-none"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#48BA86"
              strokeWidth="2.4"
              strokeDasharray="14 10"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn("font-bold transition-all duration-200")}
              style={{
                color: "#48BA86",
                fontFamily: "Trap-Bold, Trap, Arial, sans-serif",
                fontSize: compact ? "clamp(10px,3.2vw,12px)" : "clamp(10px,2.2vw,14px)",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "1",
              }}
            >
              {id}
            </span>
          </div>
        </div>
        <span
          className={cn(
            "font-bold text-white/95 pr-1",
            compact ? "leading-[1.15] text-[clamp(12px,3.6vw,15px)]" : "text-sm sm:text-base",
          )}
          style={{ fontFamily: "Trap-Bold, Trap, Arial, sans-serif" }}
        >
          {label}
        </span>
      </div>
    );

    if (href) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block hover:scale-[1.01] active:scale-95 transition-transform"
        >
          {pillContent}
        </a>
      );
    }
    return pillContent;
  };

  const handleGoNow = () => {
    if (redirectUrl) {
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Lock body scroll (mobile-safe). Save current scroll and fix the body.
      try {
        scrollYRef.current = window.scrollY || window.pageYOffset || 0;
      } catch {}
      // Disable smooth scroll temporarily to avoid animated jumps on restore
      const htmlEl = document.documentElement as HTMLElement;
      prevScrollBehaviorRef.current = htmlEl.style.scrollBehavior;
      htmlEl.style.scrollBehavior = "auto";
      const bodyStyle = document.body.style as CSSStyleDeclaration;
      bodyStyle.overflow = "hidden"; // Fallback
      bodyStyle.position = "fixed";
      bodyStyle.top = `-${scrollYRef.current}px`;
      bodyStyle.left = "0";
      bodyStyle.right = "0";
      bodyStyle.width = "100%";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restore body scroll and scroll position
      const bodyStyle = document.body.style as CSSStyleDeclaration;
      const top = bodyStyle.top;
      bodyStyle.overflow = "";
      bodyStyle.position = "";
      bodyStyle.top = "";
      bodyStyle.left = "";
      bodyStyle.right = "";
      bodyStyle.width = "";
      // Restore scroll behavior
      const htmlEl = document.documentElement as HTMLElement;
      if (prevScrollBehaviorRef.current !== undefined) {
        htmlEl.style.scrollBehavior = prevScrollBehaviorRef.current;
      }
      // Only restore scroll position if the browser jumped to the top due to unlock
      if (top && !restoredOnceRef.current) {
        const y = -parseInt(top || "0", 10) || 0;
        // If we are already at the top after unlock (0), bring back to previous Y; otherwise respect user's position
        const currentY = (() => {
          try {
            return window.scrollY || window.pageYOffset || 0;
          } catch {
            return 0;
          }
        })();
        if (currentY === 0 && y > 0) {
          try {
            window.scrollTo(0, y);
          } catch {}
        }
        restoredOnceRef.current = true;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[999999] bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      style={{
        zIndex: 999999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        paddingTop: "4rem", // Add top padding to avoid covering header
      }}
    >
      <div
        className={cn(
          // Container with teal gradient background and subtle pattern overlay
          "relative rounded-3xl shadow-2xl overflow-hidden",
          // Gradient background approximating the screenshot
          "bg-[linear-gradient(135deg,#0F3A39_0%,#0B2C2B_100%)]",
          "transform transition-all duration-300 ease-out",
          "animate-in fade-in-0 zoom-in-95 duration-300",
          "z-[999999]",
          // Responsive width constraints - increased for more content
          "w-[95vw] max-w-[440px] sm:max-w-[680px] md:max-w-[960px] lg:max-w-[1200px] xl:max-w-[1280px]",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        style={{
          zIndex: 999999,
          maxHeight: "calc(100vh - 8rem)", // Respect top padding
          overflow: "auto", // Allow scrolling if content is too tall
        }}
      >
        {/* Subtle dotted pattern overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "20px 20px, 36px 36px",
            backgroundPosition: "0 0, 10px 10px",
          }}
        />
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[999999] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white hover:text-gray-100"
          aria-label="Close modal"
          style={{ zIndex: 999999 }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          {/* Title */}
          <h2
            className="font-extrabold text-white leading-tight mb-2 sm:mb-3 text-center tracking-wide drop-shadow"
            style={{ fontSize: "clamp(20px, 6vw, 34px)" }}
          >
            {title}
          </h2>

          {/* Short intro */}
          <p className="text-center text-white/85 text-xs sm:text-sm md:text-base mb-4 sm:mb-6">
            Follow these quick steps on the graVITas portal to register.
          </p>

          {/* Desktop layout: images in a row, then step pills with arrows between them */}
          {/* Images row */}
          <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8 place-items-center">
            <div className="w-full flex items-end justify-center h-[120px] sm:h-[130px] md:h-[140px] lg:h-[150px] xl:h-[160px]">
              <img
                src="/register/1.svg"
                alt="Step 1"
                className="h-full w-auto select-none"
                draggable={false}
              />
            </div>
            <div className="w-full flex items-end justify-center h-[120px] sm:h-[130px] md:h-[140px] lg:h-[150px] xl:h-[160px]">
              <img
                src="/register/2.svg"
                alt="Step 2"
                className="h-full w-auto select-none"
                draggable={false}
              />
            </div>
            <div className="w-full flex items-end justify-center h-[120px] sm:h-[130px] md:h-[140px] lg:h-[150px] xl:h-[160px]">
              <img
                src="/register/3.svg"
                alt="Step 3"
                className="h-full w-auto select-none"
                draggable={false}
              />
            </div>
          </div>

          {/* Pills row with arrows between (stable grid) */}
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center justify-items-center gap-3 lg:gap-4 mt-3">
            <StepPill
              id="01"
              label={
                <>
                  Head on to <span className="text-emerald-300">graVITas portal</span>
                  <span className="hidden 2xl:inline"> (individual registration required)</span>
                </>
              }
              href={redirectUrl}
              className="w-full max-w-[300px] min-h-[56px]"
            />
            <span
              aria-hidden
              className="text-emerald-300 drop-shadow-[0_0_6px_rgba(72,186,134,0.6)] place-self-center"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M13 8l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <StepPill
              id="02"
              label={
                <>
                  Portal opens for team formation{" "}
                  <span className="hidden 2xl:inline">(after few days)</span>
                </>
              }
              className="w-full max-w-[300px] min-h-[56px]"
            />
            <span
              aria-hidden
              className="text-emerald-300 drop-shadow-[0_0_6px_rgba(72,186,134,0.6)] place-self-center"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M13 8l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <StepPill
              id="03"
              label={<>Form teams and submit your ideas on the portal</>}
              className="w-full max-w-[300px] min-h-[56px]"
            />
          </div>

          {/* Mobile layout: different UI - vertical spine with 3 steps (same as desktop) */}
          <div className="md:hidden mt-4">
            <div className="relative pl-9">
              {/* Vertical spine */}
              <div
                className="absolute left-3.5 top-2 bottom-2 border-l-2 border-emerald-400/60"
                aria-hidden
              />

              <div className="space-y-4">
                {/* Step 01 */}
                <div className="relative min-h-[42px]">
                  {/* Connector from spine to pill */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -left-[18px] w-[50px] h-[2px] bg-emerald-400/70"
                    aria-hidden
                  />
                  <div className="pl-8">
                    <StepPill
                      id="01"
                      compact
                      className="min-h-[52px]"
                      label={
                        <span className="block max-w-[260px]">
                          Head on to <span className="text-emerald-300">graVITas portal</span>
                          <span
                            className="block text-white/70 font-normal leading-tight"
                            style={{ fontSize: "clamp(10px,3.1vw,12px)" }}
                          >
                            (individual registration required)
                          </span>
                        </span>
                      }
                      href={redirectUrl}
                    />
                  </div>
                </div>

                {/* Step 03 */}
                <div className="relative min-h-[42px]">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -left-[18px] w-[50px] h-[2px] bg-emerald-400/70"
                    aria-hidden
                  />
                  <div className="pl-8">
                    <StepPill
                      id="02"
                      compact
                      className="min-h-[52px]"
                      label={
                        <span className="block max-w-[260px]">
                          Portal Opens for Team Formation
                          <span
                            className="block text-white/70 font-normal leading-tight"
                            style={{ fontSize: "clamp(10px,3.1vw,12px)" }}
                          >
                            (after few days)
                          </span>
                        </span>
                      }
                    />
                  </div>
                </div>

                {/* Step 03 */}
                <div className="relative min-h-[42px]">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -left-[18px] w-[50px] h-[2px] bg-emerald-400/70"
                    aria-hidden
                  />
                  <div className="pl-8">
                    <StepPill
                      id="03"
                      compact
                      className="min-h-[52px]"
                      label={
                        <span className="block max-w-[260px]">
                          Form teams → Submit ideas on the portal
                        </span>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info paragraphs (left-aligned on desktop) */}
          <div className="mt-6 md:mt-8 text-white/90 text-xs sm:text-sm leading-relaxed">
            <div className="mx-auto md:mx-0 md:max-w-[70%]">
              <p className="mb-3">
                The Code2Create organising committee would recommend that individuals follow our
                Instagram handle{" "}
                <a
                  href="https://instagram.com/acmvit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-200 hover:text-emerald-100 underline decoration-emerald-300 underline-offset-4"
                >
                  @acmvit
                </a>{" "}
                and join our <span className="whitespace-nowrap">Discord server</span>{" "}
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-200 hover:text-emerald-100 underline decoration-emerald-300 underline-offset-4"
                >
                  here
                </a>{" "}
                to stay updated on information specific to our event.
              </p>
              <p>
                For any queries, feel free to reach out to us on our Instagram or mail us at{" "}
                <a
                  href="mailto:outreach.acmvit@gmail.com"
                  className="text-emerald-200 hover:text-emerald-100 underline decoration-emerald-300 underline-offset-4"
                >
                  outreach.acmvit@gmail.com
                </a>
                .
              </p>
            </div>
          </div>

          {/* Go Now Button */}
          <div className="flex justify-center mt-6 sm:mt-8">
            <InteractiveHoverButton
              onClick={handleGoNow}
              variant="default"
              className="text-sm sm:text-base px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-emerald-500 text-white hover:bg-emerald-400"
            >
              Go to graVITas Portal
            </InteractiveHoverButton>
          </div>
          {/* Optional tiny footnote spacing */}
          <div className="mt-4" />
        </div>
      </div>
    </div>,
    document.body,
  );
};

export const useModal = () => {
  const { isModalOpen, openModal, closeModal } = useModalContext();

  return {
    isOpen: isModalOpen,
    openModal,
    closeModal,
  };
};

export const GlobalModal = () => {
  const { isModalOpen, closeModal } = useModalContext();

  if (!isModalOpen) return null;

  return <RegisterModal isOpen={isModalOpen} onClose={closeModal} />;
};
