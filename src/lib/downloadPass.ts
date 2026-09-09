import { BRAND, EVENT } from "../config/event";
import type { PassRecord } from "../types/pass";
import { drawAgoraBrand, drawEchoSphereBrand } from "./agoraLogo";
import { loadImage } from "./image";
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

async function drawPassCard(
  ctx: CanvasRenderingContext2D,
  pass: PassRecord,
  photo: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const cx = x + w / 2;
  const pad = 28;

  roundRect(ctx, x, y, w, h, 28);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "rgba(15,23,42,0.08)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const brandTop = y + pad;
  drawAgoraBrand(ctx, x + pad, brandTop);
  drawEchoSphereBrand(ctx, x + w - pad, brandTop);

  ctx.strokeStyle = "rgba(15,23,42,0.08)";
  ctx.beginPath();
  ctx.moveTo(x + pad, y + pad + 52);
  ctx.lineTo(x + w - pad, y + pad + 52);
  ctx.stroke();

  const contentTop = y + pad + 68;
  ctx.textAlign = "center";
  ctx.fillStyle = "#334155";
  ctx.font = '700 14px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.name, cx, contentTop);

  fillGradientTextCentered(ctx, EVENT.passTitleGradient, cx, contentTop + 44, 46, "900");
  ctx.fillStyle = BRAND.ink;
  ctx.font = '900 54px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.passTitleBold, cx, contentTop + 96);

  ctx.strokeStyle = "rgba(15,23,42,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + pad + 40, contentTop + 112);
  ctx.lineTo(x + pad + 100, contentTop + 112);
  ctx.stroke();
  ctx.font = '700 12px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.passSubtitle, cx, contentTop + 116);
  ctx.beginPath();
  ctx.moveTo(x + w - pad - 100, contentTop + 112);
  ctx.lineTo(x + w - pad - 40, contentTop + 112);
  ctx.stroke();

  const photoR = 54;
  const photoY = contentTop + 168;
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
  ctx.font = '800 26px "DM Sans", system-ui, sans-serif';
  ctx.fillText(pass.name, cx, photoY + 88, w - pad * 2);

  ctx.fillStyle = "#334155";
  ctx.font = '700 12px "DM Sans", system-ui, sans-serif';
  ctx.fillText(pass.teamName.toUpperCase(), cx, photoY + 116, w - pad * 2);

  const metaY = photoY + 148;
  ctx.strokeStyle = "rgba(15,23,42,0.08)";
  ctx.beginPath();
  ctx.moveTo(x + pad, metaY);
  ctx.lineTo(x + w - pad, metaY);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = BRAND.blue;
  ctx.font = '700 14px "DM Sans", system-ui, sans-serif';
  ctx.fillText("▣", x + pad + 8, metaY + 30);
  ctx.fillStyle = BRAND.ink;
  ctx.font = '800 11px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.date, x + pad + 28, metaY + 22);
  ctx.fillStyle = BRAND.muted;
  ctx.font = '600 9px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.day, x + pad + 28, metaY + 36);

  ctx.textAlign = "right";
  ctx.fillStyle = BRAND.blue;
  ctx.font = '700 14px "DM Sans", system-ui, sans-serif';
  ctx.fillText("◎", x + w - pad - 8, metaY + 30);
  ctx.fillStyle = BRAND.ink;
  ctx.font = '800 11px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.venueLine1, x + w - pad - 28, metaY + 22);
  ctx.fillStyle = BRAND.muted;
  ctx.font = '600 9px "DM Sans", system-ui, sans-serif';
  ctx.fillText(EVENT.venueLine2, x + w - pad - 28, metaY + 36);

  ctx.strokeStyle = "rgba(15,23,42,0.12)";
  ctx.beginPath();
  ctx.moveTo(cx, metaY + 6);
  ctx.lineTo(cx, metaY + 44);
  ctx.stroke();

  const qrY = metaY + 58;
  await drawQr(ctx, passUrl(pass), cx - 30, qrY, 60);

  ctx.textAlign = "center";
  ctx.fillStyle = BRAND.muted;
  ctx.font = '600 10px ui-monospace, monospace';
  ctx.fillText(`PASS ID ${pass.passId}`, cx, qrY + 84);

  const footerY = y + h - pad - 36;
  ctx.strokeStyle = "rgba(15,23,42,0.08)";
  ctx.beginPath();
  ctx.moveTo(x + pad, footerY - 12);
  ctx.lineTo(x + w - pad, footerY - 12);
  ctx.stroke();

  const logo = await loadKnoticLogo();
  ctx.fillStyle = BRAND.muted;
  ctx.font = '500 10px "DM Sans", system-ui, sans-serif';
  ctx.fillText("POWERED BY", cx, footerY);
  const lh = 22;
  const lw = (logo.naturalWidth / logo.naturalHeight) * lh;
  ctx.drawImage(logo, cx - lw / 2, footerY + 6, lw, lh);

  ctx.fillStyle = BRAND.blue;
  ctx.font = '700 11px "DM Sans", system-ui, sans-serif';
  ctx.fillText("#EchoSphere2026", cx, footerY + 38);
}

export async function renderPassCanvas(pass: PassRecord): Promise<HTMLCanvasElement> {
  const cardW = 640;
  const cardH = 980;
  const margin = 32;
  const canvas = document.createElement("canvas");
  canvas.width = cardW + margin * 2;
  canvas.height = cardH + margin * 2;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0, "#eef6ff");
  bg.addColorStop(1, "#e8f0ff");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.shadowColor = "rgba(37, 99, 235, 0.18)";
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 12;
  const photo = await loadImage(pass.photoDataUrl);
  await drawPassCard(ctx, pass, photo, margin, margin, cardW, cardH);
  ctx.restore();

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
