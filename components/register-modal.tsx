"use client";

import React from "react";
import ReactDOM from "react-dom";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { InteractiveHoverButton } from "@/app/components/landing/ui/cta-button";
import { DISCORD_URL } from "@/lib/env";

type ParticipantType = "internal" | "external";

type Step = {
  id: string;
  label: React.ReactNode;
  href?: string;
};

type RegisterFlowConfig = {
  title: string;
  subtitle?: string;
  ctaText?: string;
  redirectUrl?: string;
  images?: string[];
  steps: Step[];
  info: React.ReactNode[];
};

const DEFAULT_REDIRECT_URL =
  "https://gravitas.vit.ac.in/events/a6be23db-1fd8-4a5f-825c-4a2d00a85dba";

const buildCurrentFlow = (redirectUrl: string): RegisterFlowConfig => ({
  title: "Register for Code2Create",
  subtitle: "Follow these quick steps on the graVITas portal to register.",
  ctaText: "Go to graVITas Portal",
  redirectUrl,
  images: ["/register/1.svg","/register/external2.svg",   "/register/2.svg", "/register/3.svg"],
  steps: [
    {
      id: "01",
      href: redirectUrl,
      label: (
        <>
          Head over to <span className="text-emerald-300">graVITas portal</span>
        </>
      ),
    },
    {
      id: "02",
      label: (
        <>
          Select &quot;Get Started&quot; → &quot;VIT Vellore Student&quot; → Login
        </>
      ),
    },
    {
      id: "03",
      label: (
        <>Once the C2C portal opens, create/join a team & submit idea</>
      ),
    },
    {
      id: "04",
      label: (
        <>Submitted ideas will undergo shortlisting before the hackathon</>
      ),
    },
  ],
  info: [
    <>
      For updates on when the C2C portal goes live, follow our official Instagram handle{" "}
      <a
        href="https://instagram.com/acmvit"
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-200 hover:text-emerald-100 underline decoration-emerald-300 underline-offset-4"
      >
        @acmvit
      </a>{" "}
      and join our Discord server at{" "}
      <a
        href={DISCORD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-200 hover:text-emerald-100 underline decoration-emerald-300 underline-offset-4"
      >
        {DISCORD_URL}
      </a>
      .
    </>,
    <>
      For any queries or concerns, you may contact us via Instagram or reach us through email at{" "}
      <a
        href="mailto:acm@vit.ac.in"
        className="text-emerald-200 hover:text-emerald-100 underline decoration-emerald-300 underline-offset-4"
      >
        acm@vit.ac.in
      </a>
      .
    </>,
  ],
});

const INTERNAL_FLOW: RegisterFlowConfig = buildCurrentFlow(DEFAULT_REDIRECT_URL);

const EXTERNAL_FLOW: RegisterFlowConfig = {
  ...buildCurrentFlow(DEFAULT_REDIRECT_URL),
  images: ["/register/1.svg", "/register/external2.svg", "/register/2.svg", "/register/3.svg"],
  steps: [
    {
      id: "01",
      href: DEFAULT_REDIRECT_URL,
      label: (
        <>
          Head over to <span className="text-emerald-300">graVITas portal</span>
        </>
      ),
    },
    {
      id: "02",
      label: (
        <>
          Select &quot;Get Started&quot; → &quot;External Participants&quot; → &quot;Pick Participant Type&quot;
        </>
      ),
    },
    {
      id: "03",
      label: <>Once the C2C portal opens, create or join a team</>,
    },
    {
      id: "04",
      label: <>Submit your idea with your team once submissions go live</>,
    },
  ],
};

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
  defaultType?: ParticipantType;
}

export const RegisterModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  redirectUrl,
  className,
  defaultType,
}) => {
  const scrollYRef = React.useRef(0);
  const prevScrollBehaviorRef = React.useRef<string | undefined>(undefined);
  const restoredOnceRef = React.useRef(false);

  const [selectedType, setSelectedType] = React.useState<ParticipantType | null>(null);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!isOpen) return;
    setSelectedType(defaultType ?? null);
  }, [isOpen, defaultType]);

  const getDesktopGridTemplate = React.useCallback((count: number, isExternal: boolean = false) => {
    if (count <= 1) return "1fr";
    const parts: string[] = [];
    for (let i = 0; i < count; i++) {
      // Only use compact column sizing for external flow, use normal 1fr for internal
      const colSize = isExternal ? "minmax(200px, 1fr)" : "1fr";
      parts.push(colSize);
      if (i < count - 1) parts.push("auto");
    }
    return parts.join(" ");
  }, []);

  const StepPill: React.FC<{
    id: string;
    label: React.ReactNode;
    href?: string;
    onClick?: () => void;
    compact?: boolean;
    className?: string;
    isExternal?: boolean;
  }> = ({ id, label, href, onClick, compact = false, className, isExternal = false }) => {
    const pillContent = (
      <div
        className={cn(
          "group relative flex items-center gap-2 sm:gap-2.5 md:gap-3 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 min-w-[180px] sm:min-w-[200px] max-w-full",
          compact && "px-2 py-1 min-w-0 min-h-[48px] sm:min-h-[50px]",
          isExternal && !compact && "min-w-[160px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2",
          isExternal && compact && "min-w-[140px] sm:min-w-[160px] px-1.5 sm:px-2 py-1 sm:py-1.5 min-h-[52px] sm:min-h-[56px]",
          className,
        )}
        style={{
          borderRadius: "72px",
          background: "rgba(255, 255, 255, 0.10)",
          border: "2px solid #6B7280",
        }}
      >
        <div className={cn("relative shrink-0", compact ? "w-7 h-7" : "w-8 h-8 sm:w-9 sm:h-9")}>
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
              className={cn(
                "font-bold transition-all duration-200 group-hover:opacity-0 group-hover:scale-90",
              )}
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
            <Check
              aria-hidden
              className="absolute text-emerald-400 w-4 h-4 sm:w-5 sm:h-5 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200"
            />
          </div>
        </div>
        <span
          className={cn(
            "font-bold text-white/95 pr-1 leading-tight",
            compact
              ? "leading-[1.15] text-[clamp(9px,2.8vw,12px)] sm:text-[clamp(10px,3vw,13px)]"
              : "text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px]",
            isExternal && !compact && "text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] leading-[1.1] max-w-none",
            isExternal && compact && "text-[clamp(7px,2.2vw,10px)] sm:text-[clamp(8px,2.5vw,11px)] leading-[1.05] break-words hyphens-auto",
          )}
          style={{ 
            fontFamily: "Trap-Bold, Trap, Arial, sans-serif",
            wordWrap: isExternal ? "break-word" : "normal",
            overflowWrap: isExternal ? "break-word" : "normal",
          }}
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
    if (onClick) {
      return (
        <button
          type="button"
          onClick={onClick}
          className="inline-block hover:scale-[1.01] active:scale-95 transition-transform"
        >
          {pillContent}
        </button>
      );
    }
    return pillContent;
  };

  const ArrowIcon = () => (
    <span
      aria-hidden
      className="text-emerald-300 drop-shadow-[0_0_6px_rgba(72,186,134,0.6)] place-self-center"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
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
  );

  const handleGoNow = (url?: string) => {
    const target = url || DEFAULT_REDIRECT_URL;
    if (target) {
      window.open(target, "_blank", "noopener,noreferrer");
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Lock body scroll (mobile-safe).
      try {
        scrollYRef.current = window.scrollY || window.pageYOffset || 0;
      } catch {}
      const htmlEl = document.documentElement as HTMLElement;
      prevScrollBehaviorRef.current = htmlEl.style.scrollBehavior;
      htmlEl.style.scrollBehavior = "auto";
      const bodyStyle = document.body.style as CSSStyleDeclaration;
      bodyStyle.overflow = "hidden";
      bodyStyle.position = "fixed";
      bodyStyle.top = `-${scrollYRef.current}px`;
      bodyStyle.left = "0";
      bodyStyle.right = "0";
      bodyStyle.width = "100%";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restore body scroll
      const bodyStyle = document.body.style as CSSStyleDeclaration;
      const top = bodyStyle.top;
      bodyStyle.overflow = "";
      bodyStyle.position = "";
      bodyStyle.top = "";
      bodyStyle.left = "";
      bodyStyle.right = "";
      bodyStyle.width = "";
      const htmlEl = document.documentElement as HTMLElement;
      if (prevScrollBehaviorRef.current !== undefined) {
        htmlEl.style.scrollBehavior = prevScrollBehaviorRef.current;
      }
      // Restore scroll position if needed
      if (top && !restoredOnceRef.current) {
        const y = -parseInt(top || "0", 10) || 0;
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
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !mounted) return null;

  const activeConfig: RegisterFlowConfig | null =
    selectedType === "internal"
      ? {
          ...INTERNAL_FLOW,
          title: title ?? INTERNAL_FLOW.title,
          redirectUrl: redirectUrl ?? INTERNAL_FLOW.redirectUrl,
        }
      : selectedType === "external"
        ? {
            ...EXTERNAL_FLOW,
            title: title ?? EXTERNAL_FLOW.title,
            redirectUrl: redirectUrl ?? EXTERNAL_FLOW.redirectUrl,
          }
        : null;

  const isPickerView = activeConfig === null;

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
        paddingTop: "3rem",
      }}
    >
      <div
        className={cn(
          "relative rounded-3xl shadow-2xl overflow-hidden",
          "bg-[linear-gradient(135deg,#0F3A39_0%,#0B2C2B_100%)]",
          "transform transition-all duration-300 ease-out",
          "animate-in fade-in-0 zoom-in-95 duration-300",
          "z-[999999]",
          "w-[92vw] sm:w-[95vw] max-w-[420px] sm:max-w-[440px] md:max-w-[680px]",
          isPickerView
            ? "md:max-w-[720px] lg:max-w-[760px] xl:max-w-[800px]"
            : "md:max-w-[960px] lg:max-w-[1200px] xl:max-w-[1280px]",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        style={{
          zIndex: 999999,
          maxHeight: "calc(100vh - 6rem)",
          overflow: "auto",
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
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[999999] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white hover:text-gray-100"
          aria-label="Close modal"
          style={{ zIndex: 999999 }}
        >
          <X className="w-5 h-5" />
        </button> */}

        {/* Modal Content */}
        <div className="px-4 py-5 sm:px-5 sm:py-6 md:px-8 md:py-8">
          {activeConfig === null && (
            <div>
              <h2
                className="font-extrabold text-white leading-tight mb-2 sm:mb-3 text-center tracking-wide drop-shadow"
                style={{ fontSize: "clamp(20px, 6vw, 34px)" }}
              >
                Tell us who you are
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 place-items-center">
                {/* Internal */}
                <StepPill
                  id=""
                  label={
                    <>
                      I am a <span className="text-emerald-300">VIT Vellore</span> student
                    </>
                  }
                  onClick={() => setSelectedType("internal")}
                  className="w-[280px] sm:w-[300px] lg:w-[360px] min-h-[56px] sm:min-h-[60px]"
                />

                {/* External */}
                <StepPill
                  id=""
                  label={
                    <>
                      I am an <span className="text-emerald-300">external</span> participant
                    </>
                  }
                  onClick={() => setSelectedType("external")}
                  className="w-[280px] sm:w-[300px] lg:w-[360px] min-h-[56px] sm:min-h-[60px]"
                />
              </div>
            </div>
          )}

          {/* =========================
              VIEW 2: Selected Flow (internal/external)
             ========================= */}
          {activeConfig !== null && (
            <>
              {/* Back to chooser */}
              {/* <div className="flex justify-center md:justify-end mb-3">
                <button
                  onClick={() => setSelectedType(null)}
                  className="rounded-full px-3 py-1.5 text-xs sm:text-sm bg-white/10 text-white hover:bg-white/20 transition"
                >
                  ← change participant type
                </button>
              </div> */}

              {/* Title */}
              <h2
                className="font-extrabold text-white leading-tight mb-2 sm:mb-3 text-center tracking-wide drop-shadow"
                style={{ fontSize: "clamp(20px, 6vw, 34px)" }}
              >
                {title ?? activeConfig.title}
              </h2>

              {/* Short intro */}
              {activeConfig.subtitle && (
                <p className="text-center text-white/85 text-xs sm:text-sm md:text-base mb-4 sm:mb-6">
                  {activeConfig.subtitle}
                </p>
              )}

              {/* Desktop: images row aligned above pills */}
              <div
                className="hidden md:grid items-end justify-center justify-items-center w-full mx-auto gap-2 lg:gap-3"
                style={{ gridTemplateColumns: getDesktopGridTemplate(activeConfig.steps.length, selectedType === "external") }}
              >
                {activeConfig.steps.map((_, idx) => {
                  const src = activeConfig.images?.[idx];
                  return (
                    <div
                      key={`img-${idx}`}
                      style={{ gridColumn: `${idx * 2 + 1} / span 1` }}
                      className="flex items-end justify-center h-[110px] sm:h-[120px] md:h-[130px] lg:h-[140px] xl:h-[150px]"
                    >
                      {src ? (
                        <img
                          src={src}
                          alt={`Step ${idx + 1}`}
                          className="h-full w-auto select-none"
                          draggable={false}
                        />
                      ) : (
                        <span className="sr-only">Step {idx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop: steps with arrows (dynamic) */}
              <div
                className="hidden md:grid items-stretch justify-items-center mt-3 w-full mx-auto gap-2 lg:gap-3"
                style={{ gridTemplateColumns: getDesktopGridTemplate(activeConfig.steps.length, selectedType === "external") }}
              >
                {activeConfig.steps.map((s, idx) => (
                  <React.Fragment key={s.id}>
                    <div style={{ gridColumn: `${idx * 2 + 1} / span 1` }}>
                      <StepPill
                        id={s.id}
                        label={s.label}
                        href={s.href}
                        isExternal={selectedType === "external"}
                        className={cn(
                          "w-full h-full min-h-[64px] md:min-h-[72px]",
                          selectedType === "external" && "md:min-h-[70px] lg:min-h-[75px]"
                        )}
                      />
                    </div>
                    {idx < activeConfig.steps.length - 1 && (
                      <div
                        style={{ gridColumn: `${idx * 2 + 2} / span 1` }}
                        className="flex items-center justify-center"
                      >
                        <ArrowIcon />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Mobile: vertical spine with dynamic steps */}
              <div className="md:hidden mt-4">
                <div className="relative pl-5 sm:pl-6">
                  {/* Vertical spine */}
                  <div
                    className="absolute left-2 sm:left-2.5 top-2 bottom-2 border-l-2 border-emerald-400/60"
                    aria-hidden
                  />
                  <div className="space-y-3 sm:space-y-4">
                    {activeConfig.steps.map((s) => (
                      <div key={s.id} className="relative min-h-[40px] sm:min-h-[42px]">
                        {/* Connector from spine to pill */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 -left-[12px] sm:-left-[14px] w-[36px] sm:w-[40px] h-[2px] bg-emerald-400/70"
                          aria-hidden
                        />
                        <div className="pl-4 sm:pl-5">
                          <StepPill
                            id={s.id}
                            compact
                            isExternal={selectedType === "external"}
                            className={cn(
                              "min-h-[52px] sm:min-h-[56px]",
                              selectedType === "external" && "min-h-[56px] sm:min-h-[60px]"
                            )}
                            label={s.label}
                            href={s.href}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info paragraphs */}
              <div className="mt-6 md:mt-8 text-white/90 text-xs sm:text-sm leading-relaxed">
                <div className="mx-auto md:mx-0 md:max-w-[70%]">
                  {activeConfig.info.map((node, i) => (
                    <p key={i} className={cn(i < activeConfig.info.length - 1 && "mb-3")}>
                      {node}
                    </p>
                  ))}
                </div>
              </div>

              {/* CTA */}
              {activeConfig.redirectUrl && (
                <div className="flex justify-center mt-6 sm:mt-8">
                  <InteractiveHoverButton
                    onClick={() => handleGoNow(activeConfig.redirectUrl)}
                    variant="default"
                    className="text-sm sm:text-base px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-emerald-500 text-white hover:bg-emerald-400"
                  >
                    {activeConfig.ctaText ?? "Open link"}
                  </InteractiveHoverButton>
                </div>
              )}

              <div className="mt-4" />
            </>
          )}
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
