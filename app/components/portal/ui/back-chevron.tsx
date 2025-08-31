"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

type BackChevronProps = {
  onClick?: () => void;
  className?: string;
  label?: string;
};

export default function BackChevron({ onClick, className = "", label = "Back" }: BackChevronProps) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // If an explicit onClick is provided, always render the button
    if (onClick) {
      setCanGoBack(true);
      return;
    }

    // Browser environment checks
    if (typeof window !== 'undefined') {
      // window.history.length > 1 generally indicates there's a previous entry
      if (window.history.length > 1) {
        setCanGoBack(true);
        return;
      }

      // As a fallback, if there's a document.referrer (user navigated from another page), allow
      if (document.referrer) {
        setCanGoBack(true);
        return;
      }
    }

    setCanGoBack(false);
  }, [onClick]);

  // Do not render the chevron if there's nothing to go back to and no onClick provided
  if (!canGoBack) return null;

  const handle = () => {
    if (onClick) onClick();
    else router.back();
  };

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handle}
      className={`inline-flex items-center gap-2 text-white/90 hover:text-white bg-black/30 hover:bg-black/40 border border-white/20 rounded-full px-3 py-2 transition-colors ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

