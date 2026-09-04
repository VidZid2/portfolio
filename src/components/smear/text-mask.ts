export const ANCHOR_Y = 0.40;

export function makeWordMask(
  word: string = "JD",
  w: number,
  h: number,
  fontFamily: string,
): HTMLCanvasElement {
  const W = Math.max(1, Math.round(w));
  const H = Math.max(1, Math.round(h));

  const out = document.createElement("canvas");
  out.width = W;
  out.height = H;
  const ctx = out.getContext("2d");
  if (!ctx) return out;
  ctx.clearRect(0, 0, W, H);

  const text = (word || "JD").trim();
  if (!text) return out;

  // Optimized sizing for 2-letter monogram "JD" vs longer words
  const isShort = text.length <= 3;
  let size = isShort ? H * 0.44 : H * 0.34;
  const weight = isShort ? "800" : "700";
  ctx.font = `${weight} ${size}px ${fontFamily}`;
  const maxW = W * 0.78;
  const measured = ctx.measureText(text).width;
  if (measured > maxW) {
    size *= maxW / measured;
    ctx.font = `${weight} ${size}px ${fontFamily}`;
  }

  const m = ctx.measureText(text);
  const asc = m.actualBoundingBoxAscent || size * 0.75;
  const desc = m.actualBoundingBoxDescent || size * 0.25;
  const inkMid = (asc - desc) / 2;

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, W / 2, H * ANCHOR_Y + inkMid);

  return out;
}

export function measureWord(word: string, fontFamily: string): number {
  if (typeof document === "undefined") return 0;
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return 0;
  probe.font = `800 100px ${fontFamily}`;
  return Math.round(probe.measureText(word).width);
}
