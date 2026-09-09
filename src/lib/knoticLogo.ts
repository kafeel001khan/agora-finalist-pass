import { loadImage } from "./image";

const LOGO_SRC = "/knotic-logo.png";
let cachedLogo: HTMLImageElement | null = null;

function stripWhiteBackground(img: HTMLImageElement): HTMLImageElement {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return img;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 245 && g > 245 && b > 245) {
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const processed = new Image();
  processed.src = canvas.toDataURL("image/png");
  return processed;
}

export async function loadKnoticLogo(): Promise<HTMLImageElement> {
  if (cachedLogo) return cachedLogo;

  const source = await loadImage(LOGO_SRC);
  const processed = stripWhiteBackground(source);

  await new Promise<void>((resolve, reject) => {
    if (processed.complete) {
      resolve();
      return;
    }
    processed.onload = () => resolve();
    processed.onerror = () => reject(new Error("knotic_logo_failed"));
  });

  cachedLogo = processed;
  return processed;
}

export async function getKnoticLogoDataUrl(): Promise<string> {
  const logo = await loadKnoticLogo();
  return logo.src;
}
