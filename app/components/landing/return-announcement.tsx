"use client";

import { useEffect, useId, useRef, useState } from "react";

function toDomId(value: string) {
  return value.replace(/[^A-Za-z0-9_-]/g, "_");
}

type LiquidGlassMeasurements = {
  width: number;
  height: number;
  radius: string;
};

const APPEAR_DELAY_MS = 2500;
const CLOSE_FADE_MS = 320;

function svgDataUrl(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function LiquidGlassFilter({
  id,
  measurements,
}: {
  id: string;
  measurements: LiquidGlassMeasurements;
}) {
  const width = Math.max(1, Math.round(measurements.width));
  const height = Math.max(1, Math.round(measurements.height));
  const radius = measurements.radius || "28px";

  const box = svgDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}px" height="${height}px"><rect width="${width}px" height="${height}px" rx="${radius}" ry="${radius}" fill="black" /></svg>`
  );

  const borderTexture = svgDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}px" height="${height}px"><rect x="0" y="0" width="50%" height="50%" fill="black" /><rect x="50%" y="50%" width="50%" height="50%" fill="yellow" /><rect x="0" y="50%" width="50%" height="50%" fill="green" /><rect x="50%" y="0" width="50%" height="50%" fill="red" /></svg>`
  );

  return (
    <svg
      className="c2c-lg-filter"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
    >
      <defs>
        <filter id={id}>
          <feImage href={box} x="0" y="0" width={width} height={height} result="box" />
          <feImage
            href={borderTexture}
            x={width * -0.5}
            y={height * -0.5}
            width={width * 2}
            height={height * 2}
            result="border-tex"
          />
          <feGaussianBlur stdDeviation="50" />
          <feComponentTransfer result="dispMap">
            <feFuncA type="discrete" tableValues="0 1 1 1 1 1 1 1 1" />
          </feComponentTransfer>
          <feDisplacementMap
            in="SourceGraphic"
            in2="dispMap"
            scale="40"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
    </svg>
  );
}

export default function ReturnAnnouncement() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [measurements, setMeasurements] = useState<LiquidGlassMeasurements>({
    width: 1,
    height: 1,
    radius: "28px",
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const filterId = `c2c-lg-filter-${toDomId(rawId)}`;

  useEffect(() => {
    const t = window.setTimeout(() => {
      setMounted(true);
      window.requestAnimationFrame(() => setOpen(true));
    }, APPEAR_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!mounted || open) return;
    const t = window.setTimeout(() => setMounted(false), CLOSE_FADE_MS);
    return () => window.clearTimeout(t);
  }, [mounted, open]);

  useEffect(() => {
    if (!mounted || !cardRef.current) return;

    const card = cardRef.current;
    const updateMeasurements = () => {
      const { width, height } = card.getBoundingClientRect();
      const radius = getComputedStyle(card).borderRadius;

      setMeasurements((current) => {
        const nextWidth = Math.round(width);
        const nextHeight = Math.round(height);

        if (
          current.width === nextWidth &&
          current.height === nextHeight &&
          current.radius === radius
        ) {
          return current;
        }

        return {
          width: nextWidth,
          height: nextHeight,
          radius,
        };
      });
    };

    updateMeasurements();

    const resizeObserver = new ResizeObserver(updateMeasurements);
    resizeObserver.observe(card);

    return () => resizeObserver.disconnect();
  }, [mounted]);

  if (!mounted) return null;

  const backdropFilter = `url(#${filterId})`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="C2C announcement"
      className={`c2c-lg-overlay ${open ? "is-open" : ""}`}
      onClick={() => setOpen(false)}
    >
      <LiquidGlassFilter id={filterId} measurements={measurements} />

      <div
        ref={cardRef}
        className="c2c-lg c2c-lg-card"
        style={{
          WebkitBackdropFilter: backdropFilter,
          backdropFilter,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div aria-hidden="true" className="c2c-lg__tint" />
        <div aria-hidden="true" className="c2c-lg__shine" />
        <div className="c2c-lg__content">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="c2c-lg-close"
          >
            &times;
          </button>
          <h2 className="c2c-lg-title">
            C2C will
            <br />
            be back
          </h2>
          <p className="c2c-lg-copy">September 2026</p>
        </div>
      </div>
    </div>
  );
}
