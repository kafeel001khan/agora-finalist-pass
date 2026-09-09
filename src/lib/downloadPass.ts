import { BRAND, EVENT, LIMITS } from "../config/event";
import type { PassRecord } from "../types/pass";
import { loadImage } from "./image";
import { drawAgoraBrand, drawAgoraBrandEcho } from "./agoraLogo";
import { loadKnoticLogo } from "./knoticLogo";
import { passUrl } from "./passStorage";
import { drawQr } from "./qr";

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fillGradientTextCentered(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  size: number,
  weight: string,
) {
  ctx.textAlign = "center";
  const grad = ctx.createLinearGradient(cx - 120, y - size, cx + 120, y);
  grad.addColorStop(0, BRAND.blue);
  grad.addColorStop(1, BRAND.violet);
  ctx.font = `${weight} ${size}px "DM Sans", system-ui, sans-serif`;
  ctx.fillStyle = grad;
  ctx.fillText(text, cx, y);
}

function drawRibbon(ctx: CanvasRenderingContext2D, w: number) {
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = "rgba(0,188,212,0.35)";
  roundRect(ctx, -40, 130, 240, 52, 26);
  ctx.fill();
  ctx.fillStyle = "rgba(139,92,246,0.28)";
  roundRect(ctx, w - 170, 190, 190, 42, 21);
  ctx.fill();
  ctx.restore();
}

function drawOrbs(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const orbs: [number, number, number, string][] = [
    [w * 0.84, h * 0.12, 42, BRAND.cyan],
    [w * 0.1, h * 0.24, 28, BRAND.indigo],
    [w * 0.88, h * 0.62, 22, BRAND.violet],
  ];
  orbs.forEach(([cx, cy, r, color]) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, `${color}88`);
    g.addColorStop(1, `${color}00`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawLanyard(ctx: CanvasRenderingContext2D, cx: number, top: number) {
  const strapW = 20;
  const strapH = 72;
  const strapX = cx - strapW / 2;

  const fabric = ctx.createLinearGradient(strapX, top, strapX + strapW, top);
  fabric.addColorStop(0, "#67e8f9");
  fabric.addColorStop(0.5, "#22d3ee");
  fabric.addColorStop(1, "#67e8f9");
  roundRect(ctx, strapX, top, strapW, strapH, 6);
  ctx.fillStyle = fabric;
  ctx.fill();

  [10, 26, 42, 58].forEach((offset) => {
    roundRect(ctx, strapX + 2, top + offset, strapW - 4, 2, 1);
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.fill();
  });

  roundRect(ctx, cx - 14, top + strapH, 28, 10, 3);
  const clip = ctx.createLinearGradient(cx - 14, top + strapH, cx - 14, top + strapH + 10);
  clip.addColorStop(0, "#e2e8f0");
  clip.addColorStop(1, "#94a3b8");
  ctx.fillStyle = clip;
  ctx.fill();

  roundRect(ctx, cx - 6, top + strapH + 10, 12, 6, 2);
  ctx.fillStyle = "#64748b";
  ctx.fill();
}

async function drawBadge(
  ctx: CanvasRenderingContext2D,
  pass: PassRecord,
  photo: HTMLImageElement,
  cx: number,
  top: number,
) {
  const bw = 320;
  const bh = 520;
  const x = cx - bw / 2;

  roundRect(ctx, x, top, bw, bh, 24);
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.fill();
  ctx.strokeStyle = "rgba(15,23,42,0.06)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#334155";
  ctx.font = '700 14px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.name, cx, top + 34);

  fillGradientTextCentered(ctx, EVENT.passTitleGradient, cx, top + 78, 48, "900");
  ctx.fillStyle = BRAND.ink;
  ctx.font = '900 58px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.passTitleBold, cx, top + 132);

  ctx.strokeStyle = "rgba(15,23,42,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 48, top + 152);
  ctx.lineTo(x + 112, top + 152);
  ctx.stroke();
  ctx.font = '700 13px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.passSubtitle, cx, top + 156);
  ctx.beginPath();
  ctx.moveTo(x + bw - 112, top + 152);
  ctx.lineTo(x + bw - 48, top + 152);
  ctx.stroke();

  const photoR = 56;
  const photoY = top + 188;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, photoY, photoR, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(photo, cx - photoR, photoY - photoR, photoR * 2, photoR * 2);
  ctx.restore();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, photoY, photoR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = BRAND.ink;
  ctx.font = '800 28px "DM Sans", system-ui, sans-serif';
  ctx.fillText(pass.name, cx, photoY + 92, bw - 40);

  ctx.fillStyle = "#334155";
  ctx.font = '700 13px "DM Sans", system-ui, sans-serif';
  ctx.fillText(pass.teamName.toUpperCase(), cx, photoY + 122, bw - 40);

  const metaY = top + 360;
  ctx.strokeStyle = "rgba(15,23,42,0.08)";
  ctx.beginPath();
  ctx.moveTo(x + 24, metaY);
  ctx.lineTo(x + bw - 24, metaY);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = BRAND.blue;
  ctx.font = '700 16px "DM Sans", system-ui, sans-serif';
  ctx.fillText("▣", x + 34, metaY + 34);
  ctx.fillStyle = BRAND.ink;
  ctx.font = '800 12px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.date, x + 56, metaY + 24);
  ctx.fillStyle = BRAND.muted;
  ctx.font = '600 10px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.day, x + 56, metaY + 40);

  ctx.textAlign = "right";
  ctx.fillStyle = BRAND.blue;
  ctx.font = '700 16px "DM Sans", system-ui, sans-serif';
  ctx.fillText("◎", x + bw - 34, metaY + 34);
  ctx.fillStyle = BRAND.ink;
  ctx.font = '800 12px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.venueLine1, x + bw - 56, metaY + 24);
  ctx.fillStyle = BRAND.muted;
  ctx.font = '600 10px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.venueLine2, x + bw - 56, metaY + 40);

  ctx.strokeStyle = "rgba(15,23,42,0.12)";
  ctx.beginPath();
  ctx.moveTo(cx, metaY + 8);
  ctx.lineTo(cx, metaY + 52);
  ctx.stroke();

  await drawQr(ctx, passUrl(pass), cx - 28, top + bh - 92, 56);

  ctx.textAlign = "center";
  ctx.fillStyle = BRAND.muted;
  ctx.font = '600 10px ui-monospace, monospace';
  ctx.fillText(`PASS ID ${pass.passId}`, cx, top + bh - 18);
}

export async function renderPassCanvas(pass: PassRecord): Promise<HTMLCanvasElement> {
  const w = LIMITS.passExportWidth;
  const h = LIMITS.passExportHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#f8fbff");
  bg.addColorStop(0.45, "#eef6ff");
  bg.addColorStop(1, "#e8f0ff");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  drawRibbon(ctx, w);
  drawOrbs(ctx, w, h);

  const headerY = 36;
  const agoraBottom = drawAgoraBrand(ctx, 48, headerY);
  drawAgoraBrandEcho(ctx, w, headerY + 8);

  const cx = w / 2;
  drawLanyard(ctx, cx, agoraBottom + 20);
  const photo = await loadImage(pass.photoDataUrl);
  await drawBadge(ctx, pass, photo, cx, agoraBottom + 120);

  ctx.textAlign = "left";
  ctx.fillStyle = BRAND.blue;
  ctx.font = '600 34px "Pacifico", cursive';
  ctx.fillText(EVENT.signoff, 48, h - 110);
  ctx.font = '700 14px "DM Sans", system-ui, sans-serif';
  ctx.fillText("#EchoSphere2026", 48, h - 68);

  const logo = await loadKnoticLogo();
  ctx.textAlign = "right";
  ctx.fillStyle = BRAND.muted;
  ctx.font = '500 11px "DM Sans", system-ui, sans-serif';
  ctx.fillText("POWERED BY", w - 48, h - 92);
  const lh = 26;
  const lw = (logo.naturalWidth / logo.naturalHeight) * lh;
  ctx.drawImage(logo, w - 48 - lw, h - 82, lw, lh);

  return canvas;
}

export async function getPassPngBlob(pass: PassRecord): Promise<Blob> {
  const canvas = await renderPassCanvas(pass);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png", 0.92));
  if (!blob) throw new Error("fail");
  return blob;
}

export async function downloadPassPng(pass: PassRecord): Promise<void> {
  const blob = await getPassPngBlob(pass);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${pass.passId}-finalist-pass.png`;
  a.click();
  URL.revokeObjectURL(url);
}
