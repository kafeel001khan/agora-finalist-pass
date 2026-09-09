import { BRAND, EVENT, LIMITS } from "../config/event";
import type { PassRecord } from "../types/pass";
import { drawAgoraBrand, drawEchoSphereBrand } from "./agoraLogo";
import { loadImage } from "./image";
import { loadKnoticLogo } from "./knoticLogo";
import { passUrl } from "./passStorage";
import { drawQr } from "./qr";

export const CARD_EXPORT_WIDTH = 640;
export const CARD_EXPORT_SCALE = LIMITS.passExportScale;

const CARD_PAD = 24;
const PHOTO_RADIUS = 50;
const FINALE_PHOTO_GAP = 16;

function getPassCardLayout() {
  const brandTop = CARD_PAD;
  const contentTop = brandTop + 60;
  const finaleTextY = contentTop + 72;
  const photoY = finaleTextY + FINALE_PHOTO_GAP + PHOTO_RADIUS;
  const metaY = photoY + 128;
  const qrY = metaY + 48;
  const footerTop = qrY + 88;
  const height = footerTop + 50 + CARD_PAD;
  return { brandTop, contentTop, finaleTextY, photoY, metaY, qrY, footerTop, height };
}

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

async function drawPassCard(
  ctx: CanvasRenderingContext2D,
  pass: PassRecord,
  photo: HTMLImageElement,
  w: number,
  h: number,
  exportScale = 1,
): Promise<void> {
  const x = 0;
  const y = 0;
  const cx = w / 2;
  const pad = CARD_PAD;
  const layout = getPassCardLayout();

  roundRect(ctx, x, y, w, h, 24);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "rgba(15,23,42,0.1)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const { brandTop, contentTop, finaleTextY, photoY, metaY, qrY, footerTop } = layout;
  drawAgoraBrand(ctx, x + pad, brandTop);
  drawEchoSphereBrand(ctx, x + w - pad, brandTop);

  ctx.strokeStyle = "rgba(15,23,42,0.08)";
  ctx.beginPath();
  ctx.moveTo(x + pad, brandTop + 46);
  ctx.lineTo(x + w - pad, brandTop + 46);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#334155";
  ctx.font = '700 13px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.name, cx, contentTop);

  fillGradientTextCentered(ctx, EVENT.passTitle, cx, contentTop + 38, 44, "900");

  const finaleLineY = finaleTextY - 4;
  ctx.strokeStyle = "rgba(15,23,42,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + pad + 36, finaleLineY);
  ctx.lineTo(x + pad + 92, finaleLineY);
  ctx.stroke();
  ctx.font = '700 11px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.passSubtitle, cx, finaleTextY);
  ctx.beginPath();
  ctx.moveTo(x + w - pad - 92, finaleLineY);
  ctx.lineTo(x + w - pad - 36, finaleLineY);
  ctx.stroke();

  const photoR = PHOTO_RADIUS;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, photoY, photoR, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(photo, cx - photoR, photoY - photoR, photoR * 2, photoR * 2);
  ctx.restore();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, photoY, photoR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = BRAND.ink;
  ctx.font = '800 24px "DM Sans", system-ui, sans-serif';
  ctx.fillText(pass.name, cx, photoY + 78, w - pad * 2);

  ctx.fillStyle = "#334155";
  ctx.font = '700 11px "DM Sans", system-ui, sans-serif';
  ctx.fillText(pass.teamName.toUpperCase(), cx, photoY + 102, w - pad * 2);

  ctx.strokeStyle = "rgba(15,23,42,0.08)";
  ctx.beginPath();
  ctx.moveTo(x + pad, metaY);
  ctx.lineTo(x + w - pad, metaY);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = BRAND.blue;
  ctx.font = '700 13px "DM Sans", system-ui, sans-serif';
  ctx.fillText("▣", x + pad + 6, metaY + 28);
  ctx.fillStyle = BRAND.ink;
  ctx.font = '800 10px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.date, x + pad + 24, metaY + 20);
  ctx.fillStyle = BRAND.muted;
  ctx.font = '600 9px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.day, x + pad + 24, metaY + 32);

  ctx.textAlign = "right";
  ctx.fillStyle = BRAND.blue;
  ctx.font = '700 13px "DM Sans", system-ui, sans-serif';
  ctx.fillText("◎", x + w - pad - 6, metaY + 28);
  ctx.fillStyle = BRAND.ink;
  ctx.font = '800 10px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.venueLine1, x + w - pad - 24, metaY + 20);
  ctx.fillStyle = BRAND.muted;
  ctx.font = '600 9px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.venueLine2, x + w - pad - 24, metaY + 32);

  ctx.strokeStyle = "rgba(15,23,42,0.12)";
  ctx.beginPath();
  ctx.moveTo(cx, metaY + 4);
  ctx.lineTo(cx, metaY + 38);
  ctx.stroke();

  await drawQr(ctx, passUrl(pass), cx - 28, qrY, 56, exportScale);

  ctx.textAlign = "center";
  ctx.fillStyle = BRAND.muted;
  ctx.font = '600 9px ui-monospace, monospace';
  ctx.fillText(`PASS ID ${pass.passId}`, cx, qrY + 72);

  ctx.strokeStyle = "rgba(15,23,42,0.08)";
  ctx.beginPath();
  ctx.moveTo(x + pad, footerTop);
  ctx.lineTo(x + w - pad, footerTop);
  ctx.stroke();

  const logo = await loadKnoticLogo();
  ctx.fillStyle = BRAND.muted;
  ctx.font = '500 9px "DM Sans", system-ui, sans-serif';
  ctx.fillText("POWERED BY", cx, footerTop + 18);
  const lh = 20;
  const lw = (logo.naturalWidth / logo.naturalHeight) * lh;
  ctx.drawImage(logo, cx - lw / 2, footerTop + 22, lw, lh);

  ctx.fillStyle = BRAND.blue;
  ctx.font = '700 10px "DM Sans", system-ui, sans-serif';
  ctx.fillText("#EchoSphere2026", cx, footerTop + 50);
}

function measurePassCardHeight(): number {
  return getPassCardLayout().height;
}

export async function renderPassCanvas(pass: PassRecord): Promise<HTMLCanvasElement> {
  const cardW = CARD_EXPORT_WIDTH;
  const cardH = measurePassCardHeight();
  const scale = CARD_EXPORT_SCALE;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cardW * scale);
  canvas.height = Math.round(cardH * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const photo = await loadImage(pass.photoDataUrl);
  await drawPassCard(ctx, pass, photo, cardW, cardH, scale);

  return canvas;
}

export async function getPassPngBlob(pass: PassRecord): Promise<Blob> {
  const canvas = await renderPassCanvas(pass);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
  if (!blob) throw new Error("fail");
  return blob;
}

export async function downloadPassPng(pass: PassRecord): Promise<void> {
  const blob = await getPassPngBlob(pass);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${pass.passId}-grand-finalist-pass.png`;
  a.click();
  URL.revokeObjectURL(url);
}
