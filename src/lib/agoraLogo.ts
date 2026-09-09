import { BRAND, EVENT } from "../config/event";
import { loadImage } from "./image";

const BRAND_SRC = "/agora-brand-raw.png";

export const AGORA_LABEL = "Conversational AI Engine";
export const AGORA_CYAN = "#00aeef";

const BRAND_HEIGHT = 46;

let cachedBrand: HTMLImageElement | null = null;

function processBrandForLightBg(img: HTMLImageElement): HTMLImageElement {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return img;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const isCyan = b > 120 && g > 80 && b >= g - 12 && r < 110;

    if (max < 42 && sat < 0.35) {
      data[i + 3] = 0;
      continue;
    }

    if (isCyan) continue;

    if (min > 175 && sat < 0.22) {
      data[i] = 15;
      data[i + 1] = 23;
      data[i + 2] = 42;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const processed = new Image();
  processed.src = canvas.toDataURL("image/png");
  return processed;
}

async function waitForImage(img: HTMLImageElement): Promise<void> {
  if (img.complete) return;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("agora_logo_failed"));
  });
}

export async function loadAgoraBrand(): Promise<HTMLImageElement> {
  if (cachedBrand) return cachedBrand;

  const source = await loadImage(BRAND_SRC);
  const processed = processBrandForLightBg(source);
  await waitForImage(processed);
  cachedBrand = processed;
  return processed;
}

export async function getAgoraBrandDataUrl(): Promise<string> {
  const logo = await loadAgoraBrand();
  return logo.src;
}

export async function drawAgoraBrand(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  brandHeight = BRAND_HEIGHT,
): Promise<void> {
  const brand = await loadAgoraBrand();
  const aspect = brand.naturalWidth / brand.naturalHeight;
  const h = brandHeight;
  const w = h * aspect;
  ctx.drawImage(brand, x, y, w, h);
}

export function drawEchoSphereBrand(ctx: CanvasRenderingContext2D, rightX: number, y: number) {
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = BRAND.ink;
  ctx.font = '800 20px "DM Sans", system-ui, sans-serif';
  ctx.fillText("EchoSphere", rightX, y + 20);
  ctx.fillStyle = BRAND.muted;
  ctx.font = '600 9px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.hackathonLabel, rightX, y + 36);
}
