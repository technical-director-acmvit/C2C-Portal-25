"use client";
import React, { useRef, useEffect, useCallback, useMemo, useState } from "react";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(InertiaPlugin);

function throttleEvent<T extends Event>(
  fn: (ev: T) => void,
  limit: number,
): (this: Window, ev: T) => void {
  let lastCall = 0;
  return function (this: Window, ev: T) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.call(this, ev);
    }
  };
}

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  _inertiaApplied: boolean;
}

export interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
  // Performance controls
  maxDots?: number; // soft cap for total dots; grid sampling reduces density when exceeded
  fps?: number; // target redraw rate; defaults to 45
  maxDevicePixelRatio?: number; // clamp canvas DPR (e.g., 1.5) to reduce pixel workload
  disableOnMobile?: boolean; // do not render on small screens
}

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 16,
  gap = 32,
  baseColor = "#48BA86",
  activeColor = "#48BA86",
  proximity = 150,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = "",
  style,
  maxDots = 1200,
  fps = 45,
  maxDevicePixelRatio = 1.5,
  // Render on mobile by default; can be disabled by prop
  disableOnMobile = false,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastDrawRef = useRef<number>(0);
  const visibleRef = useRef<boolean>(false);
  const circlePathRef = useRef<Path2D | null>(null);
  const startDrawRef = useRef<(() => void) | null>(null);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setIsMobile(mq.matches);
    set();
    if (mq.addEventListener) {
      mq.addEventListener("change", set);
    } else {
      mq.addListener(set);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", set);
      } else {
        mq.removeListener(set);
      }
    };
  }, []);

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  // Update circle path when effective dot size changes
  const setCirclePath = useCallback((size: number) => {
    const hasPath2D = typeof window !== "undefined" && "Path2D" in window;
    if (!hasPath2D) {
      circlePathRef.current = null;
      return;
    }
    const p = new Path2D();
    p.arc(0, 0, size / 2, 0, Math.PI * 2);
    circlePathRef.current = p;
  }, []);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = Math.min(maxDevicePixelRatio, window.devicePixelRatio || 1);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    const baseCell = dotSize + gap;
    let cols = Math.floor((width + gap) / baseCell);
    let rows = Math.floor((height + gap) / baseCell);
    let sample = 1;
    const estimatedDots = rows * cols;
    if (estimatedDots > maxDots) {
      sample = Math.ceil(Math.sqrt(estimatedDots / maxDots));
    }
    const cell = baseCell * sample; // effectively spaces dots out when sampling
    // recompute columns/rows with the sampled cell size
    cols = Math.max(1, Math.floor((width + gap) / cell));
    rows = Math.max(1, Math.floor((height + gap) / cell));
    // Keep dot size consistent; do not scale up with sampling
    setCirclePath(dotSize);

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap, maxDots, maxDevicePixelRatio, setCirclePath]);

  useEffect(() => {
    const proxSq = proximity * proximity;

    const draw = (time: number) => {
      // visibility gating
      if (!visibleRef.current || (disableOnMobile && isMobile)) {
        rafRef.current = null;
        return;
      }
      const minDelta = 1000 / Math.max(15, Math.min(120, fps));
      const last = lastDrawRef.current || 0;
      if (time - last < minDelta) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastDrawRef.current = time;

      const canvas = canvasRef.current;
      const path = circlePathRef.current;
      if (!canvas || !path) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: px, y: py } = pointerRef.current;

      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        let style = baseColor;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          style = `rgb(${r},${g},${b})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = style;
        ctx.fill(path);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    // start/stop based on visibility
    const start = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    const stop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    if (visibleRef.current && !(disableOnMobile && isMobile)) start();
    startDrawRef.current = start;
    return () => stop();
  }, [proximity, baseColor, activeRgb, baseRgb, fps, disableOnMobile, isMobile]);

  useEffect(() => {
    if (disableOnMobile && isMobile) return;
    buildGrid();

    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;

    if (typeof window !== "undefined") {
      // Resize observer for responsive grid
      if ("ResizeObserver" in window && window.ResizeObserver) {
        const RO = window.ResizeObserver as typeof ResizeObserver;
        ro = new RO(buildGrid);
        const el = wrapperRef.current;
        if (el) ro.observe(el);
      } else {
        window.addEventListener("resize", buildGrid);
      }

      // Intersection observer to pause rendering when offscreen
      const el = wrapperRef.current;
      if (el && "IntersectionObserver" in window) {
        io = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            visibleRef.current = entry.isIntersecting && entry.intersectionRatio > 0.01;
            if (visibleRef.current) {
              // kick the draw loop
              if (!rafRef.current) startDrawRef.current?.();
            }
          },
          { threshold: [0, 0.01, 0.1, 0.25, 0.5, 1] },
        );
        io.observe(el);
      } else {
        visibleRef.current = true;
        startDrawRef.current?.();
      }
    }

    return () => {
      if (ro) ro.disconnect();
      else if (typeof window !== "undefined") window.removeEventListener("resize", buildGrid);
      if (io) io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [buildGrid, disableOnMobile, isMobile]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (disableOnMobile && isMobile) return;
      const canvasEl = canvasRef.current;
      if (!canvasEl) return; // canvas not ready or already unmounted
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = canvasEl.getBoundingClientRect();
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const pushX = dot.cx - pr.x + vx * 0.005;
          const pushY = dot.cy - pr.y + vy * 0.005;
          gsap.to(dot as unknown as object, {
            // InertiaPlugin accepts this shape at runtime.
            // No 'any' and no ts-ignore needed.
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
              });
              dot._inertiaApplied = false;
            },
          });
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      if (disableOnMobile && isMobile) return;
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      const rect = canvasEl.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = (dot.cx - cx) * shockStrength * falloff;
          const pushY = (dot.cy - cy) * shockStrength * falloff;
          gsap.to(dot as unknown as object, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
              });
              dot._inertiaApplied = false;
            },
          });
        }
      }
    };

    const throttledMove = throttleEvent<MouseEvent>(onMove, 50);

    // Only attach global listeners when canvas is visible
    if (!(disableOnMobile && isMobile)) {
      window.addEventListener("mousemove", throttledMove, { passive: true });
      window.addEventListener("click", onClick);
    }

    return () => {
      if (!(disableOnMobile && isMobile)) {
        window.removeEventListener("mousemove", throttledMove);
        window.removeEventListener("click", onClick);
      }
    };
  }, [
    maxSpeed,
    speedTrigger,
    proximity,
    resistance,
    returnDuration,
    shockRadius,
    shockStrength,
    disableOnMobile,
    isMobile,
  ]);

  return (
    <section
      className={`py-1 flex items-center justify-center h-full w-full relative ${className}`}
      style={style}
    >
      <div ref={wrapperRef} className="w-full h-full relative">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      </div>
    </section>
  );
};

DotGrid.displayName = "DotGrid";
export default React.memo(DotGrid);
