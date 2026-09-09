import { BRAND, EVENT } from "../config/event";

export const AGORA_LABEL = "Conversational AI Engine";

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

export function drawAgoraBrand(ctx: CanvasRenderingContext2D, x: number, y: number): number {
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#22d3ee";
  ctx.font = '800 22px "DM Sans", system-ui, sans-serif';
  ctx.fillText("agora", x, y + 20);

  const wordW = ctx.measureText("agora").width;
  const iconX = x + wordW + 4;
  const bars = [
    [0, 12, 6],
    [4, 8, 14],
    [8, 4, 22],
    [12, 7, 17],
    [16, 11, 9],
  ] as const;

  ctx.fillStyle = "#22d3ee";
  ctx.font = '700 18px "DM Sans", system-ui, sans-serif';
  ctx.fillText("{", iconX, y + 20);

  bars.forEach(([dx, by, bh]) => {
    ctx.fillStyle = bh > 18 ? "#cbd5e1" : bh > 10 ? "#94a3b8" : "#64748b";
    roundBar(ctx, iconX + 11 + dx, y + by, 2, bh);
  });

  ctx.fillStyle = "#22d3ee";
  ctx.fillText("}", iconX + 32, y + 20);

  ctx.fillStyle = "#1e293b";
  ctx.font = '700 10px "DM Sans", system-ui, sans-serif';
  ctx.fillText(AGORA_LABEL, x, y + 36);

  return y + 42;
}

export function drawEchoSphereBrand(ctx: CanvasRenderingContext2D, rightX: number, y: number) {
  ctx.textAlign = "right";
  ctx.fillStyle = BRAND.ink;
  ctx.font = '800 20px "DM Sans", system-ui, sans-serif';
  ctx.fillText("EchoSphere", rightX, y + 18);
  ctx.fillStyle = BRAND.muted;
  ctx.font = '600 9px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.hackathonLabel, rightX, y + 32);
}

export async function loadAgoraLogo(): Promise<HTMLImageElement> {
  const { loadImage } = await import("./image");
  return loadImage("/agora-logo.png");
}
