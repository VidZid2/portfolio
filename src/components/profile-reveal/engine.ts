import { FULL_VERT, TRAIL_FRAG, LEGO_FRAG } from "./shaders";

export const ANIME_URL = "/anime-profile.png";
export const REAL_URL = "/REAL FACE.jpg";

export type LegoFrameState = {
  tiltX: number;
  tiltY: number;
  glowX: number;
  glowY: number;
  glowI: number;
  bg: string;
  glowColor: string;
};

const TRAIL_RES = 220;
const TRAIL_SIZE = 0.18;

const REAL_ZOOM = 1.0;
const REAL_SHIFT: [number, number] = [0.0, 0.0];

export class LegoReveal {
  private host: HTMLElement;
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private display: WebGLProgram | null = null;
  private trail: WebGLProgram | null = null;
  private dLoc: Record<string, WebGLUniformLocation | null> = {};
  private tLoc: Record<string, WebGLUniformLocation | null> = {};
  private quad: WebGLBuffer | null = null;

  private animeTex: WebGLTexture | null = null;
  private realTex: WebGLTexture | null = null;
  private blackTex: WebGLTexture | null = null;
  private styleAR = 1;

  private rtA: { fb: WebGLFramebuffer; tex: WebGLTexture } | null = null;
  private rtB: { fb: WebGLFramebuffer; tex: WebGLTexture } | null = null;
  private hasTrail = false;

  private raf = 0;
  private running = false;
  private visible = false;
  private painted = false;
  private destroyed = false;
  private last = 0;
  private time = 0;

  private w = 0;
  private h = 0;
  private dpr = 1;

  private px = 0.5;
  private py = 0.5;
  private tpx = 0.5;
  private tpy = 0.5;
  private active = 0;

  private parx = 0;
  private pary = 0;

  private tiltX = 0;
  private tiltY = 0;
  private onFrame?: (s: LegoFrameState) => void;

  onReady?: () => void;
  ok = false;

  constructor(
    host: HTMLElement,
    frontUrl: string = ANIME_URL,
    realUrl: string = REAL_URL,
    onFrame?: (s: LegoFrameState) => void
  ) {
    this.host = host;
    this.onFrame = onFrame;
    this.canvas = document.createElement("canvas");
    Object.assign(this.canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      opacity: "1",
      pointerEvents: "auto",
      borderRadius: "9999px",
      zIndex: "20",
    });
    host.appendChild(this.canvas);

    const gl = this.canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;
    this.gl = gl;
    gl.clearColor(0.06, 0.06, 0.07, 1);

    try {
      this.display = this.build(FULL_VERT, LEGO_FRAG);
      this.trail = this.build(FULL_VERT, TRAIL_FRAG);
    } catch {
      this.gl = null;
      return;
    }

    for (const u of [
      "uStyleA",
      "uZoomA",
      "uReal",
      "uTrail",
      "uCover",
      "uRealShift",
      "uRealZoom",
      "uParallax",
    ]) {
      this.dLoc[u] = gl.getUniformLocation(this.display, u);
    }
    for (const u of ["uResolution", "uMap", "uPointer", "uActive", "uDt", "uTime", "uSize"]) {
      this.tLoc[u] = gl.getUniformLocation(this.trail, u);
    }

    const aPosD = gl.getAttribLocation(this.display, "aPosition");
    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aPosD);
    gl.vertexAttribPointer(aPosD, 2, gl.FLOAT, false, 0, 0);

    this.setupTrail();

    const ph = this.placeholder([40, 40, 45, 255]);
    this.animeTex = ph;
    this.realTex = ph;
    this.blackTex = this.placeholder([0, 0, 0, 255]);

    // 1. Load Front Anime Profile Texture
    this.loadTexture(frontUrl, (t, ar) => {
      this.animeTex = t;
      this.styleAR = ar;
      this.onReady?.();
      this.onReady = undefined;
      this.painted = true;
      this.renderOnce();
    });

    // 2. Load Real Face Photo Texture
    this.loadTexture(realUrl, (t) => {
      this.realTex = t;
      this.renderOnce();
    });

    this.canvas.addEventListener("pointermove", this.onMove);
    this.canvas.addEventListener("pointerenter", this.onEnter);
    this.canvas.addEventListener("pointerleave", this.onLeave);

    this.resize();
    this.ok = true;
  }

  private build(vs: string, fs: string): WebGLProgram {
    const gl = this.gl!;
    const c = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(sh) || "compile failed");
      }
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, c(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, c(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) || "link failed");
    }
    return prog;
  }

  private placeholder(rgba: number[]): WebGLTexture | null {
    const gl = this.gl;
    if (!gl) return null;
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(rgba));
    return t;
  }

  private setupTrail() {
    const gl = this.gl!;
    const ext = gl.getExtension("OES_texture_half_float");
    gl.getExtension("OES_texture_half_float_linear");
    const type = ext ? ext.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;
    const make = () => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TRAIL_RES, TRAIL_RES, 0, gl.RGBA, type, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return ok ? { fb, tex } : null;
    };
    const a = make();
    const b = make();
    if (a && b) {
      this.rtA = a;
      this.rtB = b;
      this.hasTrail = true;

      for (const rt of [a, b]) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, rt.fb);
        gl.viewport(0, 0, TRAIL_RES, TRAIL_RES);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(0.06, 0.06, 0.07, 1);
    }
  }

  private loadTexture(url: string, done: (t: WebGLTexture, ar: number) => void) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const gl = this.gl;
      if (!gl || this.destroyed) return;
      try {
        const tex = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        done(tex, (img.naturalWidth || 1) / (img.naturalHeight || 1));
      } catch (err) {
        console.warn("WebGL texImage2D error:", err);
      }
    };
    img.src = encodeURI(url);
  }

  public onMove = (e: PointerEvent | MouseEvent) => {
    const r = this.canvas.getBoundingClientRect();
    this.tpx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    this.tpy = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height));
    this.active = 1;
    this.wake();
  };

  public onEnter = () => {
    this.active = 1;
    this.wake();
  };

  public onLeave = () => {
    this.active = 0;
  };

  private wake() {
    if (this.visible && !this.running) this.startLoop();
  }

  resize() {
    if (!this.host) return;
    const r = this.host.getBoundingClientRect();
    this.dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);
    this.w = r.width || 92;
    this.h = r.height || 92;
    const cw = Math.max(1, Math.round(this.w * this.dpr));
    const ch = Math.max(1, Math.round(this.h * this.dpr));
    if (this.canvas.width !== cw || this.canvas.height !== ch) {
      this.canvas.width = cw;
      this.canvas.height = ch;
      this.gl?.viewport(0, 0, cw, ch);
      if (!this.running) this.renderOnce();
    }
  }

  private coverScale(imgAR: number): [number, number] {
    const cardAR = this.w / Math.max(1, this.h);
    if (cardAR > imgAR) return [1, imgAR / cardAR];
    return [cardAR / imgAR, 1];
  }

  setVisible(v: boolean) {
    if (!this.ok) return;
    this.visible = v;
    if (v) {
      this.resize();
      this.startLoop();
    } else {
      this.pause();
    }
  }

  private startLoop() {
    if (!this.ok || this.running) return;
    this.running = true;
    this.resize();
    this.last = 0;
    const loop = (now: number) => {
      if (!this.running) return;
      this.frame(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private pause() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  renderStill() {
    this.resize();
    this.renderDisplay();
  }

  private renderOnce() {
    if (this.running) return;
    requestAnimationFrame(() => this.renderDisplay());
  }

  private frame(now: number) {
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0.016;
    this.last = now;
    this.time += dt;

    this.px += (this.tpx - this.px) * 0.4;
    this.py += (this.tpy - this.py) * 0.4;

    const P = 0.03;
    const targX = -(this.px - 0.5) * 2.0 * P * this.active;
    const targY = (this.py - 0.5) * 2.0 * P * this.active;
    this.parx += (targX - this.parx) * 0.05;
    this.pary += (targY - this.pary) * 0.05;

    const MAXDEG = 7.0;
    const targRY = (this.px - 0.5) * 2.0 * MAXDEG * this.active;
    const targRX = (this.py - 0.5) * 2.0 * MAXDEG * this.active;
    this.tiltY += (targRY - this.tiltY) * 0.06;
    this.tiltX += (targRX - this.tiltX) * 0.06;

    this.onFrame?.({
      tiltX: this.tiltX,
      tiltY: this.tiltY,
      glowX: this.px,
      glowY: 1.0 - this.py,
      glowI: this.active,
      bg: "rgb(24, 24, 27)",
      glowColor: "rgba(100, 149, 237, 0.4)",
    });

    if (this.hasTrail) this.stepTrail(dt);
    this.renderDisplay();
  }

  private stepTrail(dt: number) {
    const gl = this.gl!;
    if (!this.rtA || !this.rtB) return;
    gl.useProgram(this.trail);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.rtB.fb);
    gl.viewport(0, 0, TRAIL_RES, TRAIL_RES);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.rtA.tex);
    gl.uniform1i(this.tLoc.uMap, 0);
    gl.uniform2f(this.tLoc.uResolution, TRAIL_RES, TRAIL_RES);
    gl.uniform2f(this.tLoc.uPointer, this.px, this.py);
    gl.uniform1f(this.tLoc.uActive, this.active);
    gl.uniform1f(this.tLoc.uDt, dt);
    gl.uniform1f(this.tLoc.uTime, this.time);
    gl.uniform1f(this.tLoc.uSize, TRAIL_SIZE);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const t = this.rtA;
    this.rtA = this.rtB;
    this.rtB = t;
  }

  private renderDisplay() {
    const gl = this.gl;
    if (!gl || !this.display) return;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.display);

    const texA = this.animeTex ?? this.realTex ?? this.blackTex;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texA);
    gl.uniform1i(this.dLoc.uStyleA, 0);

    gl.uniform1f(this.dLoc.uZoomA, 1.0);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.realTex ?? this.blackTex);
    gl.uniform1i(this.dLoc.uReal, 2);

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.hasTrail && this.rtA ? this.rtA.tex : this.blackTex);
    gl.uniform1i(this.dLoc.uTrail, 3);

    const [cx, cy] = this.coverScale(this.styleAR);
    gl.uniform2f(this.dLoc.uCover, cx, cy);
    gl.uniform2f(this.dLoc.uRealShift, REAL_SHIFT[0], REAL_SHIFT[1]);
    gl.uniform1f(this.dLoc.uRealZoom, REAL_ZOOM);
    gl.uniform2f(this.dLoc.uParallax, this.parx, this.pary);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  destroy() {
    this.destroyed = true;
    this.visible = false;
    this.pause();
    this.canvas.removeEventListener("pointermove", this.onMove);
    this.canvas.removeEventListener("pointerenter", this.onEnter);
    this.canvas.removeEventListener("pointerleave", this.onLeave);
    const gl = this.gl;
    if (gl) {
      const uniq = new Set<WebGLTexture>();
      [this.animeTex, this.realTex, this.blackTex, this.rtA?.tex ?? null, this.rtB?.tex ?? null].forEach(
        (t) => t && uniq.add(t),
      );
      uniq.forEach((t) => gl.deleteTexture(t));
      [this.rtA?.fb, this.rtB?.fb].forEach((f) => f && gl.deleteFramebuffer(f));
      if (this.quad) gl.deleteBuffer(this.quad);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
    this.canvas.remove();
  }
}
