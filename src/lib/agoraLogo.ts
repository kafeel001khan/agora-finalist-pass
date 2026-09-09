import { BRAND, EVENT } from "../config/event";
import { loadImage } from "./image";

const LOCKUP_SRC = "/agora-lockup-raw.jpg";

export const AGORA_LABEL = "Conversational AI Engine";
export const AGORA_CYAN = "#00aeef";

const LOCKUP_HEIGHT = 26;
const LABEL_GAP = 10;

let cachedLockup: HTMLImageElement | null = null;

function processLockupForLightBg(img: HTMLImageElement): HTMLImageElement {
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

    if (r < 28 && g < 28 && b < 28) {
      data[i + 3] = 0;
      continue;
    }

    if (r > 210 && g > 210 && b > 210) {
      data[i] = 100;
      data[i + 1] = 116;
      data[i + 2] = 139;
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

export async function loadAgoraLockup(): Promise<HTMLImageElement> {
  if (cachedLockup) return cachedLockup;

  const source = await loadImage(LOCKUP_SRC);
  const processed = processLockupForLightBg(source);
  await waitForImage(processed);
  cachedLockup = processed;
  return processed;
}

export async function getAgoraLockupDataUrl(): Promise<string> {
  const logo = await loadAgoraLockup();
  return logo.src;
}

export async function drawAgoraBrand(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  lockupHeight = LOCKUP_HEIGHT,
): Promise<void> {
  const lockup = await loadAgoraLockup();
  const aspect = lockup.naturalWidth / lockup.naturalHeight;
  const h = lockupHeight;
  const w = h * aspect;
  ctx.drawImage(lockup, x, y, w, h);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#334155";
  ctx.font = '700 8px "DM Sans", system-ui, sans-serif';
  ctx.fillText(AGORA_LABEL, x, y + h + LABEL_GAP);
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
