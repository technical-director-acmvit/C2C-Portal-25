import * as THREE from "three";

interface TextTextureOptions {
  width?: number;
  height?: number;
  font?: string;
  background?: string;
  color?: string;
}


// Simple cache to avoid recreating texture on every hover
const textureCache = new Map<string, THREE.CanvasTexture>();

export function createTextTexture(
  text: [string, string, string, string, [string, string, string, string]],
  front: boolean,
  options: TextTextureOptions = {}
): THREE.CanvasTexture {
  const {
    width = 1678,
    height = 1677,
    font = "160px DM Sans",
    background = "black",
    color = "#48BA86",
  } = options;

  // Create a cache key based on text, front, and options
  const cacheKey = JSON.stringify({ text, front, options });
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas 2D context");

  // Background
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  // Image below text
  const img = new window.Image();
  img.src = '/portal/c2clogo.svg';
  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false; // Fix flipped/upside-down text

  

  // Helpers to fit and elide text within a bounding width
  const measure = (text: string) => ctx.measureText(text).width;
  const elideToWidth = (value: string, max: number) => {
    if (measure(value) <= max) return value;
    const ellipsis = "…";
    let low = 0, high = value.length;
    // binary search the cut point
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      const candidate = value.slice(0, mid) + ellipsis;
      if (measure(candidate) <= max) low = mid + 1; else high = mid;
    }
    const finalText = value.slice(0, Math.max(0, low - 1)) + ellipsis;
    return finalText;
  };
  const drawFittedText = (
    value: string,
    opts: { x: number; y: number; maxWidth: number; maxSize: number; minSize: number; color: string; align?: CanvasTextAlign }
  ) => {
    const { x, y, maxWidth, maxSize, minSize, color, align = "center" } = opts;
    ctx.textAlign = align;
    ctx.textBaseline = "top";
    let size = maxSize;
    ctx.fillStyle = color;
    while (size >= minSize) {
      ctx.font = `${size}px DM Sans`;
      if (measure(value) <= maxWidth) break;
      size -= 4;
    }
    if (size < minSize) {
      // at minimum, elide to fit
      size = minSize;
      ctx.font = `${size}px DM Sans`;
      value = elideToWidth(value, maxWidth);
    }
    ctx.fillText(value, x, y);
  };

  const drawText = () => {
    if (front) {
      // Name (fit and elide if too long)
      drawFittedText(text[0], { x: 420, y: 600, maxWidth: 700, maxSize: 160, minSize: 80, color: "#48BA86" });

      //Phone
      drawFittedText(text[2], { x: 420, y: 800, maxWidth: 720, maxSize: 100, minSize: 70, color: "#ADDBC8" });
    }
    else {
      // Team Name
      drawFittedText(text[3], { x: 420, y: 250, maxWidth: 700, maxSize: 160, minSize: 80, color: "#48BA86" });

      // Team Members (each line fitted)
      const lines = [text[4][0] || "", text[4][1] || "", text[4][2] || "", text[4][3] || ""];
      const baseY = 500;
      const step = 150; // spacing between lines
      lines.forEach((line, i) => {
        drawFittedText(line, { x: 420, y: baseY + i * step, maxWidth: 720, maxSize: 100, minSize: 70, color: "#ADDBC8" });
      });
    };

    ctx.fillStyle = "#FFF";
    ctx.font = "40px DM Sans";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText("ACM-VIT", 200, 50);

  };

  
  // Only cache after image is loaded and texture is updated
  img.onload = () => {
    if(front) {ctx.drawImage(img, 310, 200, 240, 250)};
    drawText();
    texture.needsUpdate = true;
    textureCache.set(cacheKey, texture);
  };
  
  const img2 = new window.Image();
  img2.src = '/portal/c2cacmgreen.svg';
  img2.onload = () => {
    {ctx.drawImage(img2, 190+1678/2, 500, 500, 300)};
    texture.needsUpdate = true;
    textureCache.set(cacheKey, texture);
  };
  

  return texture;
}
