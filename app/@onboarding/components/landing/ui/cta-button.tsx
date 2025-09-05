import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type InteractiveHoverButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "simple" | "compact";
};

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, variant = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border border-white/10 bg-black/80 px-6 py-2 text-center font-semibold text-zinc-200 hover:bg-zinc-900 transition-colors whitespace-nowrap disabled:pointer-events-none",
        className,
      )}
      {...props}
    >
      {variant === "default" ? (
        <>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white/80 transition-all duration-300 group-hover:scale-[100.8]"></div>
            <span className="inline-block transition-opacity duration-300 group-hover:opacity-0">
              {children}
            </span>
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 flex h-full w-full items-center justify-center gap-2 text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span>{children}</span>
            <ArrowRight />
          </div>
        </>
      ) : variant === "compact" ? (
        <>
          <div className="flex items-center">
            <span className="inline-block transition-opacity duration-300 group-hover:opacity-0">
              {children}
            </span>
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 flex h-full w-full items-center justify-center gap-1.5 text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span>{children}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </>
      ) : (
        <span className="inline-flex items-center justify-center w-full">{children}</span>
      )}
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
