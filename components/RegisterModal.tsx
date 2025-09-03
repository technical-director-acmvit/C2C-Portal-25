import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { InteractiveHoverButton } from "@/app/components/landing/ui/cta-button";

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
  redirectUrl='https://gravitas.vit.ac.in/events',
  className,
}) => {
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
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-[999999] bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      style={{ 
        zIndex: 999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        className={cn(
          "relative bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl shadow-2xl overflow-hidden",
          "transform transition-all duration-300 ease-out",
          "animate-in fade-in-0 zoom-in-95 duration-300",
          "z-[999999]",
          // Responsive width constraints - increased for more content
          "w-[95vw] max-w-[420px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[600px]",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        style={{ 
          zIndex: 999999,
          maxHeight: '90vh',
          overflow: 'auto' // Allow scrolling if content is too tall
        }}
      >
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
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-4 sm:mb-6 text-center">
            {title}
          </h2>

          {/* Main Content */}
          <div className="text-left space-y-4 sm:space-y-5">
            {/* Introduction */}
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Official registration for Code2Create is done through VIT&apos;s graVITas portal. You can follow these steps to participate in Code2Create.
            </p>

            {/* Steps List */}
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-white/90">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-2 h-2 bg-purple-300 rounded-full mt-2"></span>
                <span className="leading-relaxed">
                  Head to the official{" "}
                  <a
                    href={redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-200 hover:text-purple-100 underline decoration-purple-300 hover:decoration-purple-200 underline-offset-2 transition-colors"
                  >
                    graVITas portal link
                  </a>
                  . Participants must register individually on the graVITas portal.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-2 h-2 bg-purple-300 rounded-full mt-2"></span>
                <span className="leading-relaxed">
                  On the Events page, we are the 9th event from the top. Feel free to search for Code2Create under Hackathons (in Filters &gt;&gt; Event Type)
                </span>
              </li>
           
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-2 h-2 bg-purple-300 rounded-full mt-2"></span>
                <span className="leading-relaxed">
                  Following the process at the graVITas portal, in a few days our portal (at{" "}
                  <span className="text-purple-200 font-medium">this link</span>
                  ) will allow individuals to form teams.
                </span>
              </li>
              
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-2 h-2 bg-purple-300 rounded-full mt-2"></span>
                <span className="leading-relaxed">
                  After team formation, participants would be able to begin work on their ideas and teams would submit their ideas on this portal as well.
                </span>
              </li>
            </ul>

            {/* Additional Information */}
            <div className="pt-2 sm:pt-3 border-t border-white/20">
              <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-3">
                The Code2Create organising committee would recommend that individuals follow our Instagram handle{" "}
                <a
                  href="https://instagram.com/acmvit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-200 hover:text-purple-100 underline decoration-purple-300 hover:decoration-purple-200 underline-offset-2 transition-colors font-medium"
                >
                  @acmvit
                </a>
                {" "}to stay updated on information specific to our event.
              </p>
              
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                For any queries, feel free to reach out to us on our Instagram or mail us at{" "}
                <a
                  href="mailto:outreach.acmvit@gmail.com"
                  className="text-purple-200 hover:text-purple-100 underline decoration-purple-300 hover:decoration-purple-200 underline-offset-2 transition-colors"
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
              className="text-sm sm:text-base px-6 py-2.5 sm:px-8 sm:py-3"
            >
              Go to graVITas Portal
            </InteractiveHoverButton>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const useModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = () => {
    console.log("[OPENING MODAL]");
    setIsOpen(true);
  }
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal,
  };
};
