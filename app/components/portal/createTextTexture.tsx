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

  

  const drawText = () => {
    if (front) {
      //Name
      ctx.fillStyle = "#48BA86";
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(text[0], 420, 600);

      //Phone
      ctx.fillStyle = "#ADDBC8";
      ctx.font = "100px DM Sans";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(text[2], 420, 800);
    }
    else {
      //TeamName
      ctx.fillStyle = "#48BA86";
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(text[3], 420, 250);

      //TeamMembers
      ctx.fillStyle = "#ADDBC8";
      ctx.font = "100px DM Sans";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(text[4][0], 420, 500);
      ctx.fillText(text[4][1], 420, 650);
      ctx.fillText(text[4][2], 420, 800);
      ctx.fillText(text[4][3], 420, 950);
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
  

  return texture;
}
