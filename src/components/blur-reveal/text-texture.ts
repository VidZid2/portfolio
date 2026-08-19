export interface TextTexture {
  canvas: HTMLCanvasElement;
  cssW: number;
  cssH: number;
}

export interface TextOpts {
  line: string;
  font: string;
  fill: string;
  cardW: number;
  cardH: number;
  dpr?: number;
  align?: "left" | "center";
}

export function renderText(o: TextOpts): TextTexture {
  const dpr = o.dpr ?? Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
  const cssW = Math.max(1, Math.round(o.cardW));
  const cssH = Math.max(1, Math.round(o.cardH));

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return { canvas, cssW, cssH };

  ctx.scale(dpr, dpr);
  ctx.fillStyle = o.fill;
  ctx.textAlign = o.align ?? "left";
  ctx.textBaseline = "middle";

  const fontSize = cssH <= 38 ? 12 : Math.min(14, cssW * 0.035);
  ctx.font = `500 ${fontSize}px ${o.font}`;

  const xPos = (o.align ?? "left") === "left" ? 0 : cssW / 2;
  ctx.fillText(o.line, xPos, cssH / 2);

  return { canvas, cssW, cssH };
}
