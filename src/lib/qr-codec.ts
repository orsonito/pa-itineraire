type BarcodeDetectorLike = {
  detect: (source: ImageBitmap) => Promise<{ rawValue?: string }[]>;
};

function barcodeDetector(): BarcodeDetectorLike | null {
  const Ctor = (window as unknown as { BarcodeDetector?: new (opts: { formats: string[] }) => BarcodeDetectorLike }).BarcodeDetector;
  if (!Ctor) return null;
  try {
    return new Ctor({ formats: ["qr_code"] });
  } catch {
    return null;
  }
}

function drawScaled(bitmap: ImageBitmap, width: number) {
  const scale = width / bitmap.width;
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = width < bitmap.width;
  ctx.drawImage(bitmap, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

export async function decodeQrFromFile(file: File): Promise<string | null> {
  const bitmap = await createImageBitmap(file);
  try {
    const detector = barcodeDetector();
    if (detector) {
      const codes = await detector.detect(bitmap);
      const raw = codes.find((c) => c.rawValue)?.rawValue;
      if (raw) return raw;
    }

    const jsQR = (await import("jsqr")).default;
    const widths = [...new Set([
      bitmap.width,
      Math.min(1600, bitmap.width),
      Math.min(1024, bitmap.width),
      Math.min(720, bitmap.width),
    ])].filter((w) => w >= 80);

    for (const width of widths) {
      const image = drawScaled(bitmap, width);
      if (!image) continue;
      const result = jsQR(image.data, image.width, image.height, {
        inversionAttempts: "attemptBoth",
      });
      if (result?.data) return result.data;
    }
    return null;
  } finally {
    bitmap.close();
  }
}

export async function qrDataUrl(payload: string): Promise<string> {
  const QRCode = await import("qrcode");
  return QRCode.toDataURL(payload, {
    width: 640,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#ffffff" },
  });
}
