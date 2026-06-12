"use client";

import { useEffect, useRef, useState } from "react";

type PreRegSuccessProps = {
  active: boolean;
  onDone: () => void;
};

/**
 * Full-screen confirmation that plays once the form is submitted.
 *
 * Sequence (driven by the timers below, animated in globals.css):
 *   1. The dark scrim fades up slowly (~2.4s) over the still-visible
 *      pre-registration page, dissolving it into darkness. The page itself is
 *      swapped out by page.tsx only once it's fully covered.
 *   2. At ~1.5s the C2C logo rises from the bottom, small -> large, linear.
 *   3. The light-green facet flies in from the right edge and decelerates into
 *      the logo's empty (black) wedge so the mark reads complete.
 *   4. "Pre-registered successfully" fades in beneath it.
 *   5. The whole stage fades out and the scrim lifts, revealing the site with
 *      the CTA now reading "Pre-registered".
 */
export default function PreRegSuccess({ active, onDone }: PreRegSuccessProps) {
  const [mounted, setMounted] = useState(false);
  const [enter, setEnter] = useState(false);
  const [showText, setShowText] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!active) {
      setMounted(false);
      setEnter(false);
      setShowText(false);
      setLeaving(false);
      return;
    }

    setMounted(true);
    // Flip on the entrance only after the hidden initial state has been
    // committed (double rAF) — a single rAF fires before the first style
    // commit, which makes the scrim background snap instead of fading.
    let raf2 = 0;
    const raf = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEnter(true));
    });
    const tText = window.setTimeout(() => setShowText(true), 3450);
    const tLeave = window.setTimeout(() => setLeaving(true), 5200);
    const tDone = window.setTimeout(() => onDoneRef.current(), 6100);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf2);
      window.clearTimeout(tText);
      window.clearTimeout(tLeave);
      window.clearTimeout(tDone);
    };
  }, [active]);

  if (!mounted) return null;

  const className = [
    "c2c-prereg-success",
    enter ? "is-active" : "",
    showText ? "show-text" : "",
    leaving ? "is-leaving" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} role="status" aria-live="polite">
      <div className="c2c-prereg-success__stage">
        <div className="c2c-prereg-success__logo-box">
          {/* The C2C mark, redrawn inline from the brand geometry without the
           * grain filter baked into /landing/C2C Logo.svg. The right-hand
           * wedge is intentionally left dark — the flying facet completes it. */}
          <svg
            className="c2c-prereg-success__logo"
            viewBox="0 0 265 299"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M119.777 3.38686L12.6146 65.3811C4.8009 69.8969 0 78.2413 0 87.2729V211.261C0 220.293 4.8009 228.637 12.6146 233.153L119.777 295.147C127.591 299.663 137.193 299.663 145.007 295.147L252.17 233.153C259.983 228.637 264.784 220.293 264.784 211.261V87.2729C264.784 78.2413 259.983 69.8969 252.17 65.3811L145.031 3.38686C137.217 -1.12895 127.591 -1.12895 119.777 3.38686Z"
              fill="#FAFBFB"
            />
            <path
              d="M247.344 215.777V82.7815L132.392 16.2715L17.4399 82.7815V215.777L132.392 282.262L247.344 215.777Z"
              fill="#2C2C2C"
              stroke="#48BA86"
              strokeWidth="1.28848"
              strokeMiterlimit="10"
            />
            <path
              d="M132.539 54.2144L50.4336 101.704V102.121L132.539 149.243V54.2144Z"
              fill="#D3EBE0"
            />
            <path
              d="M132.539 149.242V244.271L132.612 244.295L214.767 196.756V196.413L132.539 149.242Z"
              fill="#5EBF94"
            />
            <path
              d="M132.539 149.243L50.4336 102.121V196.708L132.539 149.243Z"
              fill="#48BA86"
            />
            <path
              d="M50.4336 196.707V196.756L132.539 244.271V149.242L50.4336 196.707Z"
              fill="#ADDBC8"
            />
            <path
              d="M214.816 101.679L132.539 149.292V54.165L214.816 101.679Z"
              fill="#86CCAC"
            />
          </svg>
          {/* The light-green facet that fills the logo's black wedge. Same
           * viewBox as the logo so the triangle lands exactly in the cutout
           * once its fly-in transform settles to translateX(0). */}
          <svg
            className="c2c-prereg-success__triangle"
            viewBox="0 0 265 299"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M132.539 149.27 L214.816 101.679 L214.767 196.756 Z"
              fill="#D3EBE0"
            />
          </svg>
        </div>
        <p className="c2c-prereg-success__text">Pre-registered successfully</p>
      </div>
    </div>
  );
}
