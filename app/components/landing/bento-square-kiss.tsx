import React from "react";

interface BentoSquareKissProps {
  dim: number;
  className?: string;
}

const BentoSquareKiss: React.FC<BentoSquareKissProps> = ({ dim, className = "" }) => {
  const maskId = `lumi-mask-${Math.random().toString(36).substr(2, 9)}`; // Unique ID

  return (
    <>
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute" }}
      >
        <defs>
          <mask id={maskId} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <rect x="0" y="0" width="1" height="1" fill="white" rx="0.064" ry="0.064" />
            <rect
              x="-0.064"
              y="-0.064"
              width="0.54"
              height="0.54"
              fill="black"
              rx="0.064"
              ry="0.064"
            />
            <rect x="0.52" y="0.52" width="0.54" height="0.54" fill="black" rx="0.064" ry="0.064" />
          </mask>
        </defs>
      </svg>

      <div
        className={`subtract ${className}`}
        style={{
          width: `${dim}px`,
          height: `${dim}px`,
          backgroundColor: "#ffffff",
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
        }}
      />
    </>
  );
};

export default BentoSquareKiss;
