import React from "react";
import DotGrid from "./dot-grid";
import BentoSquareKiss from "./bento-square-kiss";
import BentoRect from "./bento-rectangle";

const Bento = () => {
  const dim = typeof window !== "undefined" ? Math.round(window.innerHeight * 0.3) : 500;
  const rectDim = dim; // keep same size (adjust if you want different)

  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" className="w-full" />
      </div>

      <div className="min-h-screen relative" style={{ background: "transparent" }}>
        {/* Square (left) */}
        <div
          style={{
            position: "absolute",
            left: "10vw",
            top: "50vh",
            transform: "translateY(-50%)",
          }}
        >
          <BentoSquareKiss dim={dim} />
        </div>

        <div
          style={{
            position: "absolute",
            left: `calc(9.4vw + ${dim}px )`,
            top: "64.5vh",
            transform: "translateY(-50%)",
          }}
        >
          <BentoRect dim={rectDim - 65} />
        </div>
      </div>
    </>
  );
};

export default Bento;
