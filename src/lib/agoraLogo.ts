import { BRAND, EVENT } from "../config/event";

export const AGORA_LABEL = "Conversational AI Engine";

export function drawAgoraBrand(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
): number {
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#22d3ee";
  ctx.font = '800 28px "DM Sans", system-ui, sans-serif';
  ctx.fillText("agora", x, y + 24);

  const wordW = ctx.measureText("agora").width;
  const iconX = x + wordW + 6;
  const bars = [
    [0, 15, 7],
    [5, 10, 17],
    [10, 5, 27],
    [15, 8, 21],
    [20, 13, 11],
  ] as const;

  ctx.fillStyle = "#22d3ee";
  ctx.font = '700 22px "DM Sans", system-ui, sans-serif';
  ctx.fillText("{", iconX, y + 24);

  bars.forEach(([dx, by, bh]) => {
    ctx.fillStyle = bh > 20 ? "#cbd5e1" : bh > 12 ? "#94a3b8" : "#64748b";
    roundBar(ctx, iconX + 14 + dx, y + by, 2.5, bh);
  });

  ctx.fillStyle = "#22d3ee";
  ctx.fillText("}", iconX + 40, y + 24);

  ctx.fillStyle = "#1e293b";
  ctx.font = '700 12px "DM Sans", system-ui, sans-serif';
  ctx.fillText(AGORA_LABEL, x, y + 44);

  return y + 52;
}

function roundBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = 1;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

// Kept for any future asset use; preview uses SVG mark instead.
export async function loadAgoraLogo(): Promise<HTMLImageElement> {
  const { loadImage } = await import("./image");
  return loadImage("/agora-logo.png");
}

export function drawAgoraBrandEcho(ctx: CanvasRenderingContext2D, w: number, y: number) {
  ctx.textAlign = "right";
  ctx.fillStyle = BRAND.ink;
  ctx.font = '800 32px "DM Sans", system-ui, sans-serif';
  ctx.fillText("EchoSphere", w - 48, y);
  ctx.fillStyle = BRAND.muted;
  ctx.font = '600 11px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.hackathonLabel, w - 48, y + 24);
}
