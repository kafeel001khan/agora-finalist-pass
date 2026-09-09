import { LIMITS } from "../config/event";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export type CropRect = { x: number; y: number; size: number };

export function validatePhotoFile(file: File): "ok" | "type" | "size" {
  if (!ALLOWED.has(file.type)) return "type";
  if (file.size > LIMITS.maxPhotoBytes) return "size";
  return "ok";
}

function readFileAsImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("invalid"));
    };
    img.src = url;
  });
}

export function centerSquareCrop(w: number, h: number): CropRect {
  const size = Math.min(w, h);
  return { x: (w - size) / 2, y: (h - size) / 2, size };
}

export async function processPhotoFile(file: File, crop?: CropRect): Promise<string> {
  const img = await readFileAsImage(file);
  const source = crop ?? centerSquareCrop(img.width, img.height);
  const size = LIMITS.passPhotoSize;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("fail");
  ctx.fillStyle = "#0b1227";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, source.x, source.y, source.size, source.size, 0, 0, size, size);
  const mime = canvas.toDataURL("image/webp").startsWith("data:image/webp") ? "image/webp" : "image/jpeg";
  return canvas.toDataURL(mime, 0.92);
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function getDisplayedImageRect(cw: number, ch: number, iw: number, ih: number) {
  const scale = Math.min(cw / iw, ch / ih);
  const renderedW = iw * scale;
  const renderedH = ih * scale;
  return {
    offsetX: (cw - renderedW) / 2,
    offsetY: (ch - renderedH) / 2,
    renderedW,
    renderedH,
    scale,
  };
}

export function displayBoxToCrop(
  box: { x: number; y: number; size: number },
  display: ReturnType<typeof getDisplayedImageRect>,
  iw: number,
  ih: number,
): CropRect {
  const size = Math.min(box.size / display.scale, iw, ih);
  return {
    x: Math.max(0, Math.min(iw - size, (box.x - display.offsetX) / display.scale)),
    y: Math.max(0, Math.min(ih - size, (box.y - display.offsetY) / display.scale)),
    size,
  };
}
