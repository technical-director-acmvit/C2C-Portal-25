"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ViewportPortalProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export default function ViewportPortal({ children, className = "", id = "viewport-portal-root" }: ViewportPortalProps) {
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    let container = document.getElementById(id);
    if (!container) {
      container = document.createElement("div");
      container.id = id;
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%";
      container.style.zIndex = "2147483647"; // ensure above GSAP layers
      container.style.pointerEvents = "auto";
      document.body.appendChild(container);
    }
    setEl(container);
    return () => {
      // Keep container for potential re-use; remove if empty
      if (container && container.childElementCount === 0) {
        container.remove();
      }
    };
  }, [id]);

  if (!el) return null;
  return createPortal(
    <div className={className}>{children}</div>,
    el
  );
}

