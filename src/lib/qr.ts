let qr: typeof import("qrcode") | null = null;

async function getQr() {
  if (!qr) qr = await import("qrcode");
  return qr;
}

export async function renderQrCanvas(text: string, size: number): Promise<HTMLCanvasElement> {
  const lib = await getQr();
  const canvas = document.createElement("canvas");
  await lib.toCanvas(canvas, text, {
    width: size,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#ffffff" },
  });
  return canvas;
}

export async function drawQr(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  pixelRatio = 1,
): Promise<void> {
  const canvas = await renderQrCanvas(text, Math.round(size * pixelRatio));
  ctx.drawImage(canvas, x, y, size, size);
}
