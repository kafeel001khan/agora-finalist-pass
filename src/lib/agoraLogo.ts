import { BRAND, EVENT } from "../config/event";
import { loadImage } from "./image";

export const LOCKUP_SRC = "/agora-lockup-light.png";
export const AGORA_LABEL = "Conversational AI Engine";
export const AGORA_CYAN = "#00aeef";

export const LOCKUP_NATURAL_WIDTH = 760;
export const LOCKUP_NATURAL_HEIGHT = 193;
export const LOCKUP_DISPLAY_HEIGHT = 36;
export const LOCKUP_DISPLAY_WIDTH = Math.round(
  LOCKUP_DISPLAY_HEIGHT * (LOCKUP_NATURAL_WIDTH / LOCKUP_NATURAL_HEIGHT),
);

const LABEL_GAP = 8;

let cachedLockup: HTMLImageElement | null = null;

async function waitForImage(img: HTMLImageElement): Promise<void> {
  if (img.complete) return;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("agora_logo_failed"));
  });
}

export async function loadAgoraLockup(): Promise<HTMLImageElement> {
  if (cachedLockup) return cachedLockup;

  const lockup = await loadImage(LOCKUP_SRC);
  await waitForImage(lockup);
  cachedLockup = lockup;
  return lockup;
}

function drawAgoraLabel(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = BRAND.ink;
  ctx.font = '800 8px "DM Sans", system-ui, sans-serif';
  ctx.fillText(AGORA_LABEL, x, y);
}

export async function drawAgoraBrand(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  lockupHeight = LOCKUP_DISPLAY_HEIGHT,
): Promise<void> {
  const lockup = await loadAgoraLockup();
  const aspect = lockup.naturalWidth / lockup.naturalHeight;
  const h = lockupHeight;
  const w = h * aspect;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(lockup, x, y, w, h);
  drawAgoraLabel(ctx, x, y + h + LABEL_GAP);
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
