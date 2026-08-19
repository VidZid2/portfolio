"use client";

import * as React from "react";
import { playReasoningSound } from "@/lib/synth-sounds";
import { createSmokeRenderer, hexToRgb, type SmokeRenderer } from "./smoky-button";

export const REASONING_EFFORT_LEVELS = [
  "Low",
  "Medium",
  "High",
  "Max",
] as const;

export type EffortLevel = (typeof REASONING_EFFORT_LEVELS)[number];

const LEVELS = REASONING_EFFORT_LEVELS;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
};

const mix = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

const mixColor = (from: number[], to: number[], amount: number) =>
  `rgb(${Math.round(mix(from[0], to[0], amount))} ${Math.round(
    mix(from[1], to[1], amount)
  )} ${Math.round(mix(from[2], to[2], amount))})`;

let instanceCount = 0;

class ClaudeModelSelectorElement extends HTMLElement {
  static get observedAttributes() {
    return ["value", "open", "disabled"];
  }

  private _uid!: string;
  private _value!: number;
  private _levelIndex!: number;
  private _dragging!: boolean;
  private _pointerSamples!: { time: number; value: number }[];
  private _springFrame!: number;
  private _canvasFrame!: number;
  private _labelFrame!: number;
  private _labelTimer!: number;
  private _closeTimer!: number;
  private _lastCanvasFrame!: number;
  private _ultraStartedAt!: number;
  private _ultraFadeTimer!: number;
  private _reveal!: number;
  private _isUltra!: boolean;
  private _reflectingValue!: boolean;
  private _reducedMotion!: MediaQueryList;
  private _events?: AbortController;
  private _resizeObserver?: ResizeObserver;
  private _smokeRenderer: SmokeRenderer | null = null;

  private _panel!: HTMLElement;
  private _input!: HTMLInputElement;
  private _track!: HTMLElement;
  private _canvas!: HTMLCanvasElement;
  private _currentLabel!: HTMLElement;
  private _outgoingLabel!: HTMLElement;
  private _trigger!: HTMLButtonElement;
  private _triggerValue!: HTMLElement;
  private _helpWrap!: HTMLElement;
  private _helpButton!: HTMLButtonElement;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._uid = `claude-effort-${++instanceCount}`;
    this._value = 0;
    this._levelIndex = 0;
    this._dragging = false;
    this._pointerSamples = [];
    this._springFrame = 0;
    this._canvasFrame = 0;
    this._labelFrame = 0;
    this._labelTimer = 0;
    this._closeTimer = 0;
    this._lastCanvasFrame = 0;
    this._ultraStartedAt = 0;
    this._ultraFadeTimer = 0;
    this._reveal = 0;
    this._isUltra = false;
    this._reflectingValue = false;
    this._reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          --effort-accent: #6495ed;
          --effort-accent-deep: #4169e1;
          --effort-text: #64748b;
          --effort-text-strong: #0f172a;
          --effort-muted: #94a3b8;
          --effort-track: #f1f5f9;
          --effort-track-fill: #e2e8f0;
          --effort-progress: 0;
          --effort-thumb-w: 1.375rem;
          --effort-thumb-h: 1.5rem;
          --effort-track-pad: 0px;
          --effort-track-radius: 0.5rem;
          --effort-surface: transparent;
          --effort-outline: transparent;
          --effort-width: 100%;
          --ease-decay: cubic-bezier(0.2, 0, 0, 1);
          display: block;
          width: 100%;
          max-width: 100%;
          color: var(--effort-text);
          font-family: inherit;
          font-size: 0.75rem;
          line-height: 1.4;
          box-sizing: border-box;
        }

        :host-context(.dark),
        :host([data-theme="dark"]) {
          --effort-text: #a3a3a3;
          --effort-text-strong: #f5f5f5;
          --effort-muted: #737373;
          --effort-track: #262626;
          --effort-track-fill: #383838;
        }

        *, *::before, *::after {
          box-sizing: border-box;
        }

        button, input {
          font: inherit;
        }

        .shell {
          position: relative;
          width: 100%;
        }

        .panel {
          position: relative;
          width: 100%;
          padding: 0;
          border: none;
          background: transparent;
          box-shadow: none;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 1.25rem;
          margin-bottom: 0.375rem;
          gap: 0.5rem;
        }

        .title {
          display: flex;
          align-items: baseline;
          min-width: 0;
          color: var(--effort-text);
          font-size: 0.75rem;
          font-weight: 500;
          line-height: 1;
          white-space: nowrap;
        }

        .level-stage {
          position: relative;
          display: inline-block;
          height: 1.2em;
          margin-left: 0.375rem;
          color: var(--effort-text-strong);
          font-weight: 600;
          line-height: inherit;
          vertical-align: baseline;
        }

        .level-stage::after {
          content: "Medium";
          visibility: hidden;
          white-space: nowrap;
        }

        .level-stage > span {
          position: absolute;
          top: 0;
          left: 0;
          line-height: inherit;
          white-space: nowrap;
          transform-origin: left center;
        }

        .level-current,
        .level-outgoing {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
          transition-property: opacity, transform, filter, color;
          transition-duration: 180ms;
          transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
        }

        .level-current {
          transition-delay: 24ms;
        }

        .level-current.is-preparing {
          opacity: 0;
          transform: translateY(var(--label-enter-y, 3px));
          filter: blur(2px);
          transition-duration: 0ms;
          transition-delay: 0ms;
        }

        .level-outgoing {
          pointer-events: none;
          transition-delay: 0ms;
        }

        .level-outgoing.is-exiting {
          opacity: 0;
          transform: translateY(var(--label-exit-y, -3px));
          filter: blur(2px);
        }

        :host([data-ultra]) .level-current {
          color: #6495ed !important;
          text-shadow: 0 0 10px rgba(100, 149, 237, 0.4);
        }

        .help-wrap {
          position: relative;
          flex: 0 0 auto;
        }

        .help-button {
          position: relative;
          display: grid;
          width: 1.25rem;
          height: 1.25rem;
          place-items: center;
          border: 0;
          border-radius: 0.25rem;
          background: transparent;
          color: var(--effort-muted);
          cursor: help;
          transition: color 150ms ease, background-color 150ms ease;
        }

        .help-button:hover {
          color: var(--effort-text-strong);
          background: rgba(128, 128, 128, 0.1);
        }

        .help-button svg {
          width: 0.75rem;
          height: 0.75rem;
        }

        .tooltip {
          position: absolute;
          z-index: 20;
          bottom: calc(100% + 0.375rem);
          right: 0;
          width: min(14rem, calc(100vw - 2rem));
          padding: 0.35rem 0.5rem;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 0.375rem;
          background: #171717;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          color: #fff;
          font-size: 0.6875rem;
          line-height: 1.35;
          opacity: 0;
          visibility: hidden;
          transform: translateY(2px);
          transition: opacity 120ms ease, transform 120ms ease, visibility 120ms ease;
          pointer-events: none;
        }

        .help-wrap:hover .tooltip,
        .help-button:focus-visible + .tooltip,
        .help-wrap[data-tip-open] .tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .track-shell {
          position: relative;
          height: 2rem;
          margin-top: 0.125rem;
        }

        .track {
          position: absolute;
          inset: 0.25rem 0;
          overflow: hidden;
          border-radius: var(--effort-track-radius);
          background-color: var(--effort-track);
          transform: translateZ(0);
          -webkit-mask-image: -webkit-radial-gradient(white, black);
          isolation: isolate;
        }

        :host([data-ultra]) .track {
          background-color: #eef4fc;
        }

        :host-context(.dark):host([data-ultra]) .track,
        :host([data-theme="dark"][data-ultra]) .track {
          background-color: #1e293b;
        }

        .track-fill {
          position: absolute;
          z-index: 0;
          top: 0;
          bottom: 0;
          left: 0;
          width: calc(
            (100% - var(--effort-thumb-w))
              * var(--effort-progress, 0)
            + (var(--effort-thumb-w) * 0.5)
          );
          border-radius: inherit;
          background: var(--effort-track-fill);
          pointer-events: none;
          transition: opacity 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        :host([data-ultra]) .track-fill {
          opacity: 0;
        }

        .track::before {
          content: "";
          position: absolute;
          z-index: 0;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #eef4fc 0%,
            #e6f0fa 18%,
            #d6e6f8 32%,
            #bed8f6 48%,
            #a1c7f4 68%,
            #80b3f0 82%,
            #6495ed 100%
          );
          opacity: 0;
          transition: opacity 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        :host([data-ultra]) .track::before {
          opacity: 1;
        }

        .ultra-fallback,
        .pixel-field {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0;
          transition: opacity 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ultra-fallback {
          background: linear-gradient(
            90deg,
            #eef4fc 0%,
            #e6f0fa 18%,
            #d6e6f8 32%,
            #bed8f6 48%,
            #a1c7f4 68%,
            #80b3f0 82%,
            #6495ed 100%
          );
        }

        :host([data-ultra]) .pixel-field {
          opacity: 1;
        }

        .ticks {
          position: absolute;
          z-index: 1;
          inset: 0 calc(var(--effort-thumb-w) * 0.5);
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }

        .tick {
          width: 0.25rem;
          height: 0.25rem;
          border-radius: 999px;
          background: #d4d4d4;
          opacity: 0.9;
          transition: opacity 180ms ease;
        }

        :host-context(.dark) .tick,
        :host([data-theme="dark"]) .tick {
          background: #525252;
        }

        .tick:last-child {
          background: var(--effort-accent);
          opacity: 1;
        }

        :host([data-ultra]) .tick {
          opacity: 0;
        }

        .range {
          position: absolute;
          z-index: 3;
          inset: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          appearance: none;
          -webkit-appearance: none;
          border: 0;
          outline: 0;
          background: transparent;
          cursor: ew-resize;
          touch-action: none;
        }

        .range::-webkit-slider-runnable-track {
          height: var(--effort-thumb-h);
          border: 0;
          background: transparent;
        }

        .range::-webkit-slider-thumb {
          width: var(--effort-thumb-w);
          height: var(--effort-thumb-h);
          margin-top: 0px;
          appearance: none;
          -webkit-appearance: none;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 0.375rem;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);
          cursor: grab;
        }

        :host-context(.dark) .range::-webkit-slider-thumb,
        :host([data-theme="dark"]) .range::-webkit-slider-thumb {
          background: #ffffff;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .range::-moz-range-thumb {
          width: var(--effort-thumb-w);
          height: var(--effort-thumb-h);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 0.375rem;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
          cursor: grab;
        }

        .range:active::-webkit-slider-thumb,
        .range:active::-moz-range-thumb {
          cursor: grabbing;
        }

        :host([disabled]) {
          opacity: 0.58;
        }

        :host([disabled]) .range,
        :host([disabled]) button {
          cursor: not-allowed;
        }
      </style>

      <div class="shell">
        <section class="panel" id="${this._uid}-panel" aria-label="Reasoning settings">
          <div class="header">
            <div class="title">
              <span>Reasoning</span>
              <span class="level-stage" aria-live="polite" aria-atomic="true">
                <span class="level-outgoing" aria-hidden="true"></span>
                <span class="level-current">Low</span>
              </span>
            </div>
            <div class="help-wrap">
              <button class="help-button" type="button" aria-label="About reasoning levels" aria-describedby="${this._uid}-tooltip">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                  <path d="M9.8 9.2a2.35 2.35 0 0 1 4.55.82c0 1.8-2.35 2.05-2.35 3.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M12 17.2h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </button>
              <div class="tooltip" id="${this._uid}-tooltip" role="tooltip">
                Higher effort spends more time reasoning. Max activates the deepest analysis.
              </div>
            </div>
          </div>

          <div class="track-shell">
            <div class="track" aria-hidden="true">
              <div class="track-fill"></div>
              <div class="ultra-fallback"></div>
              <canvas class="pixel-field"></canvas>
              <div class="ticks">
                ${LEVELS.map(() => '<span class="tick"></span>').join("")}
              </div>
            </div>
            <input
              class="range"
              type="range"
              min="0"
              max="${LEVELS.length - 1}"
              step="0.001"
              value="0"
              aria-label="Effort level"
              aria-valuemin="0"
              aria-valuemax="${LEVELS.length - 1}"
              aria-valuetext="Low"
            />
          </div>
        </section>
      </div>
    `;

    this._panel = this.shadowRoot!.querySelector(".panel")!;
    this._input = this.shadowRoot!.querySelector(".range")!;
    this._track = this.shadowRoot!.querySelector(".track")!;
    this._canvas = this.shadowRoot!.querySelector(".pixel-field")!;
    this._currentLabel = this.shadowRoot!.querySelector(".level-current")!;
    this._outgoingLabel = this.shadowRoot!.querySelector(".level-outgoing")!;
    this._helpWrap = this.shadowRoot!.querySelector(".help-wrap")!;
    this._helpButton = this.shadowRoot!.querySelector(".help-button")!;

    this._onReducedMotionChange = this._onReducedMotionChange.bind(this);
  }

  connectedCallback() {
    this._events?.abort();
    this._events = new AbortController();
    const { signal } = this._events;
    const initialValue = Number.parseFloat(this.getAttribute("value") ?? "0");
    this._setValue(Number.isFinite(initialValue) ? initialValue : 0, {
      animateLabel: false,
      reflect: false,
    });
    this._syncDisabledState();

    this._input.addEventListener(
      "pointerdown",
      () => this._onPointerDown(),
      { signal }
    );
    this._input.addEventListener(
      "pointerup",
      () => this._onPointerUp(),
      { signal }
    );
    this._input.addEventListener(
      "pointercancel",
      () => this._onPointerUp(),
      { signal }
    );
    this._input.addEventListener("input", () => this._onInput(), { signal });
    this._input.addEventListener(
      "keydown",
      (event) => this._onKeyDown(event),
      { signal }
    );
    this._helpButton.addEventListener(
      "click",
      () => {
        if (this.disabled) return;
        this._helpWrap.toggleAttribute("data-tip-open");
      },
      { signal }
    );

    this._reducedMotion.addEventListener("change", this._onReducedMotionChange);
    this._resizeObserver = new ResizeObserver(() => this._resizeCanvas());
    this._resizeObserver.observe(this._track);
    this._resizeCanvas();
    this._initSmokeRenderer();
    if (this._isUltra) this._ensureCanvasLoop();
  }

  _initSmokeRenderer() {
    if (this._smokeRenderer || !this._canvas) return;
    try {
      this._smokeRenderer = createSmokeRenderer(this._canvas, {
        colors: [
          hexToRgb("#6495ED"),
          hexToRgb("#4169E1"),
          hexToRgb("#0F172A"),
        ],
        speed: 1.2,
      });
    } catch (e) {
      console.warn("WebGL smoke renderer fallback for slider track.", e);
    }
  }

  disconnectedCallback() {
    this._smokeRenderer?.destroy();
    this._smokeRenderer = null;
    this._events?.abort();
    this._reducedMotion.removeEventListener(
      "change",
      this._onReducedMotionChange
    );
    this._resizeObserver?.disconnect();
    cancelAnimationFrame(this._springFrame);
    cancelAnimationFrame(this._canvasFrame);
    cancelAnimationFrame(this._labelFrame);
    clearTimeout(this._labelTimer);
    clearTimeout(this._closeTimer);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === "value" && !this._reflectingValue && this._input) {
      if (this._dragging || this._springFrame) return;
      const next = Number.parseFloat(newValue ?? "0");
      if (Number.isFinite(next) && Math.abs(next - this._value) > 0.001) {
        this._setValue(next, {
          animateLabel: this.isConnected,
          reflect: false,
        });
      }
    }
    if (name === "disabled" && this._input) this._syncDisabledState();
  }

  get value() {
    return this._value;
  }

  set value(nextValue: number) {
    this._setValue(Number(nextValue), { animateLabel: true, reflect: true });
  }

  get level() {
    return LEVELS[this._levelIndex];
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(nextDisabled: boolean) {
    this.toggleAttribute("disabled", Boolean(nextDisabled));
  }

  _syncDisabledState() {
    const isDisabled = this.disabled;
    this._input.disabled = isDisabled;
    this._helpButton.disabled = isDisabled;
  }

  _onPointerDown() {
    if (this.disabled) return;
    cancelAnimationFrame(this._springFrame);
    this._springFrame = 0;
    this._dragging = true;
    this._pointerSamples = [{ time: performance.now(), value: this._value }];
  }

  _onPointerUp() {
    if (!this._dragging) return;
    this._dragging = false;
    this._snapToNearest();
  }

  _onInput() {
    const nextValue = Number.parseFloat(this._input.value);
    const now = performance.now();
    this._pointerSamples.push({ time: now, value: nextValue });
    this._pointerSamples = this._pointerSamples
      .filter((sample) => now - sample.time < 90)
      .slice(-5);
    this._setValue(nextValue, { animateLabel: true, reflect: false });
  }

  _onKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;
    const keyTargets: Record<string, number> = {
      ArrowLeft: this._levelIndex - 1,
      ArrowDown: this._levelIndex - 1,
      ArrowRight: this._levelIndex + 1,
      ArrowUp: this._levelIndex + 1,
      Home: 0,
      End: LEVELS.length - 1,
      PageDown: this._levelIndex - 1,
      PageUp: this._levelIndex + 1,
    };
    if (!(event.key in keyTargets)) return;
    event.preventDefault();
    const target = clamp(keyTargets[event.key], 0, LEVELS.length - 1);
    this._setValue(target, { animateLabel: false, reflect: true });
    this._emit("input");
    this._emit("change");
  }

  _snapToNearest() {
    const target = Math.round(this._value);
    if (this._reducedMotion.matches || Math.abs(target - this._value) < 0.001) {
      this._setValue(target, { animateLabel: false, reflect: true });
      this._emit("input");
      this._emit("change");
      return;
    }

    this._springTo(target, 0);
  }

  _springTo(target: number, _initialVelocity: number = 0) {
    cancelAnimationFrame(this._springFrame);
    const start = this._value;
    const distance = target - start;
    if (Math.abs(distance) < 0.001) {
      this._setValue(target, { animateLabel: false, reflect: true });
      this._emit("input");
      this._emit("change");
      return;
    }

    const duration = Math.min(260, Math.max(140, Math.abs(distance) * 160));
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = (now - startTime) / duration;
      if (elapsed >= 1) {
        this._springFrame = 0;
        this._setValue(target, { animateLabel: false, reflect: true });
        this._emit("input");
        this._emit("change");
        return;
      }

      // Smooth quintic ease out for soft, jitter-free lock-on
      const t = elapsed - 1;
      const easeOut = t * t * t * t * t + 1;
      const current = start + distance * easeOut;
      this._setValue(current, { animateLabel: true, reflect: false });

      this._springFrame = requestAnimationFrame(step);
    };

    this._springFrame = requestAnimationFrame(step);
  }

  _setValue(
    nextValue: number,
    { animateLabel = true, reflect = false }: { animateLabel?: boolean; reflect?: boolean } = {}
  ) {
    const safeValue = clamp(
      Number.isFinite(nextValue) ? nextValue : 0,
      0,
      LEVELS.length - 1
    );
    const nextIndex = clamp(Math.round(safeValue), 0, LEVELS.length - 1);
    const previousIndex = this._levelIndex;
    this._value = safeValue;
    this._input.value = String(safeValue);
    this._input.setAttribute("aria-valuetext", LEVELS[nextIndex]);
    this.style.setProperty(
      "--effort-progress",
      String(safeValue / (LEVELS.length - 1))
    );

    if (nextIndex !== previousIndex) {
      this._levelIndex = nextIndex;
      playReasoningSound(LEVELS[nextIndex].toLowerCase());
      this._swapLabel(
        LEVELS[nextIndex],
        nextIndex > previousIndex,
        animateLabel
      );
      this._emit("input");
    } else if (!this._currentLabel.textContent) {
      this._currentLabel.textContent = LEVELS[nextIndex];
    }

    this._setUltra(nextIndex === LEVELS.length - 1);

    if (reflect) {
      this._reflectingValue = true;
      this.setAttribute("value", String(Number(safeValue.toFixed(3))));
      this._reflectingValue = false;
    }
  }

  _swapLabel(nextLabel: string, forward: boolean, animate: boolean) {
    cancelAnimationFrame(this._labelFrame);
    this._labelFrame = 0;
    clearTimeout(this._labelTimer);
    const shouldAnimate =
      animate && !this._reducedMotion.matches && this.isConnected;
    const previousLabel = this._currentLabel.textContent ?? "";
    this._currentLabel.classList.remove("is-preparing");
    this._outgoingLabel.classList.remove("is-exiting");

    if (!shouldAnimate) {
      this._outgoingLabel.textContent = "";
      this._currentLabel.textContent = nextLabel;
      return;
    }

    this._outgoingLabel.textContent = previousLabel;
    this._currentLabel.textContent = nextLabel;
    const enterY = forward ? "3px" : "-3px";
    const exitY = forward ? "-3px" : "3px";
    this._currentLabel.style.setProperty("--label-enter-y", enterY);
    this._outgoingLabel.style.setProperty("--label-exit-y", exitY);
    this._currentLabel.classList.add("is-preparing");

    this._currentLabel.getBoundingClientRect();

    this._labelFrame = requestAnimationFrame(() => {
      this._labelFrame = 0;
      this._currentLabel.classList.remove("is-preparing");
      this._outgoingLabel.classList.add("is-exiting");
    });

    this._labelTimer = window.setTimeout(() => {
      this._outgoingLabel.textContent = "";
      this._outgoingLabel.classList.remove("is-exiting");
    }, 200);
  }

  _setUltra(isUltra: boolean) {
    if (isUltra === this._isUltra) return;
    this._isUltra = isUltra;
    this.toggleAttribute("data-ultra", isUltra);
    clearTimeout(this._ultraFadeTimer);
    if (isUltra) {
      this._ultraStartedAt = performance.now();
      this._ensureCanvasLoop();
    } else {
      this._ultraFadeTimer = window.setTimeout(() => {
        cancelAnimationFrame(this._canvasFrame);
        this._canvasFrame = 0;
      }, 350);
    }
  }

  _cachedWidth = 0;
  _cachedHeight = 0;

  _onReducedMotionChange() {
    if (this._isUltra) {
      this._ultraStartedAt = performance.now();
      this._ensureCanvasLoop();
    }
  }

  _resizeCanvas() {
    const track = this._track;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const clientW = track.clientWidth || rect?.width || 0;
    const clientH = track.clientHeight || rect?.height || 0;
    if (!clientW || !clientH) return;
    this._cachedWidth = clientW;
    this._cachedHeight = clientH;

    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth <= 1024 ||
        (window.matchMedia &&
          window.matchMedia("(pointer: coarse)").matches));
    const ratio = isMobile
      ? 1.25
      : Math.min(window.devicePixelRatio || 1, 2);

    const width = Math.round(clientW * ratio);
    const height = Math.round(clientH * ratio);
    if (this._canvas.width !== width || this._canvas.height !== height) {
      this._canvas.width = width;
      this._canvas.height = height;
      this._canvas.style.width = "100%";
      this._canvas.style.height = "100%";
      this._drawPixelField(performance.now());
    }
  }

  _ensureCanvasLoop() {
    if (this._canvasFrame || this._reducedMotion.matches) {
      this._drawPixelField(performance.now());
      return;
    }

    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth <= 1024 ||
        (window.matchMedia &&
          window.matchMedia("(pointer: coarse)").matches));
    const frameInterval = isMobile ? 33 : 24;

    const frame = (time: number) => {
      if (!this.isConnected) {
        this._canvasFrame = 0;
        return;
      }
      if (time - this._lastCanvasFrame >= frameInterval) {
        this._lastCanvasFrame = time;
        this._reveal = smoothstep(0, 1, (time - this._ultraStartedAt) / 800);
        this._drawPixelField(time);
      }
      if (this._isUltra || performance.now() - this._lastCanvasFrame < 350) {
        this._canvasFrame = requestAnimationFrame(frame);
      } else {
        this._canvasFrame = 0;
      }
    };
    this._canvasFrame = requestAnimationFrame(frame);
  }

  _drawPixelField(time: number) {
    const track = this._track;
    const width = track?.clientWidth || track?.offsetWidth || this._cachedWidth || 280;
    const height = track?.clientHeight || track?.offsetHeight || this._cachedHeight || 24;
    if (!width || !height) return;

    this._cachedWidth = width;
    this._cachedHeight = height;

    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth <= 1024 ||
        (window.matchMedia &&
          window.matchMedia("(pointer: coarse)").matches));
    const ratio = isMobile
      ? 1.25
      : Math.min(window.devicePixelRatio || 1, 2);
    const targetWidth = Math.round(width * ratio);
    const targetHeight = Math.round(height * ratio);

    if (
      this._canvas.width !== targetWidth ||
      this._canvas.height !== targetHeight
    ) {
      this._canvas.width = targetWidth;
      this._canvas.height = targetHeight;
      this._canvas.style.width = "100%";
      this._canvas.style.height = "100%";
    }

    const context = this._canvas.getContext("2d");
    if (!context || !this._canvas.width || !this._canvas.height) return;

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const reveal = this._reducedMotion.matches ? 1 : this._reveal;
    const frontier = 1 - reveal;
    const cell = isMobile ? 7 : width < 280 ? 5 : 6;
    const gap = 1.1;
    const columns = Math.ceil(width / cell) + 3;
    const rows = Math.ceil(height / cell) + 1;
    const elapsed = Math.max(0, time - this._ultraStartedAt);

    const leftColor = [215, 230, 250];
    const deepCornflower = [70, 115, 230];
    const royalBlue = [60, 110, 235];
    const electricBlue = [85, 145, 250];
    const brightCornflower = [100, 155, 245];
    const azureBlue = [135, 185, 255];
    const skyGlow = [165, 210, 255];
    const paleIce = [200, 230, 255];
    const highlightColor = [225, 242, 255];
    const peakColor = [255, 255, 255];
    const tones = [
      deepCornflower,
      royalBlue,
      electricBlue,
      brightCornflower,
      azureBlue,
      skyGlow,
      paleIce,
      highlightColor,
      peakColor,
      electricBlue,
    ];

    const flowDuration = 3600;
    const rawFlow = elapsed / flowDuration;
    const flowCycle = Math.floor(rawFlow);
    const easedFlow = flowCycle + smoothstep(0, 1, rawFlow - flowCycle);

    context.save();

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x = column * cell;
        const y = row * cell;
        const normalizedX = clamp((x + cell * 0.5) / width, 0, 1.0);
        const revealAlpha = this._reducedMotion.matches
          ? 1
          : smoothstep(frontier - 0.15, frontier + 0.05, normalizedX);
        if (revealAlpha <= 0.002) continue;

        const blueAmount = smoothstep(0.0, 0.9, normalizedX);
        const fieldIntensity = 1;
        const depthBias = smoothstep(0.1, 0.95, normalizedX);
        const rightEdgeBoost = smoothstep(0.3, 1.0, normalizedX);

        const baseHash =
          Math.abs(Math.sin(column * 12.9898 + row * 78.233) * 43758.5453) % 1;
        const tempoHash =
          Math.abs(Math.sin(column * 7.13 + row * 19.41) * 19341.731) % 1;
        const phaseHash =
          Math.abs(Math.sin(column * 31.17 + row * 11.93) * 28437.123) % 1;
        const chromaHash =
          Math.abs(Math.sin(column * 9.47 + row * 67.13) * 15823.917) % 1;

        const period = 450 + tempoHash * 1350;
        const localTime = elapsed + phaseHash * period;
        const cycle = Math.floor(localTime / period);
        const cycleProgress = (localTime % period) / period;
        const cycleHash =
          Math.abs(
            Math.sin(column * 17.17 + row * 41.73 + cycle * 13.11) * 24634.6345
          ) % 1;
        const widthHash =
          Math.abs(
            Math.sin(column * 5.37 + row * 29.11 + cycle * 7.43) * 17391.443
          ) % 1;

        const pulseCenter = 0.15 + cycleHash * 0.7;
        const pulseWidth = 0.08 + widthHash * 0.09;
        const pulseDistance = (cycleProgress - pulseCenter) / pulseWidth;
        const pulseEnvelope = Math.exp(-pulseDistance * pulseDistance * 1.45);
        const activeCycle = cycleHash > 0.1 ? 1 : 0.32;
        const irregularFlicker = pulseEnvelope * activeCycle;

        const flowCoordinate = (normalizedX + easedFlow) * 9;
        const flowIndex = Math.floor(flowCoordinate);
        const flowProgress = smoothstep(0, 1, flowCoordinate - flowIndex);
        const flowHashA =
          Math.abs(
            Math.sin(flowIndex * 18.31 + row * 37.17) * 19283.173
          ) % 1;
        const flowHashB =
          Math.abs(
            Math.sin((flowIndex + 1) * 18.31 + row * 37.17) * 19283.173
          ) % 1;
        const clusterGate = smoothstep(
          0.42,
          0.82,
          mix(flowHashA, flowHashB, flowProgress)
        );
        const wavePhase =
          (normalizedX + easedFlow + row * 0.06 + baseHash * 0.02) * Math.PI * 2;
        const directionalWave = Math.pow(0.5 + 0.5 * Math.cos(wavePhase), 5);
        const directionalFlow = Math.max(clusterGate, directionalWave * 0.65);
        const flowingFlicker = Math.max(
          irregularFlicker * (0.52 + directionalFlow * 0.58),
          directionalFlow * (0.42 + baseHash * 0.28)
        );

        const revealGlow =
          reveal < 0.995
            ? Math.exp(-((normalizedX - frontier) ** 2) / 0.012) *
              (1 - smoothstep(0.7, 1, reveal))
            : 0;
        const lightAmount = Math.max(
          flowingFlicker,
          revealGlow * (0.4 + baseHash * 0.4)
        );

        const peakHighlight =
          (lightAmount > 0.35 &&
            irregularFlicker > 0.14 &&
            cycleHash > 0.22) ||
          (rightEdgeBoost > 0.35 && cycleHash > 0.48 && irregularFlicker > 0.08);
        const hottestHighlight =
          (lightAmount > 0.62 &&
            irregularFlicker > 0.26 &&
            cycleHash > 0.42) ||
          (rightEdgeBoost > 0.55 && cycleHash > 0.68 && irregularFlicker > 0.18);
        const highlightAmount = peakHighlight
          ? 0.98
          : clamp(lightAmount * (0.48 + cycleHash * 0.35) + rightEdgeBoost * 0.2, 0, 0.85);

        const toneDrift =
          baseHash * 0.28 +
          depthBias * 0.32 +
          cycleProgress * 0.38 +
          easedFlow * 0.2 +
          cycleHash * 0.2 +
          Math.sin(elapsed * 0.00135 + phaseHash * Math.PI * 2) * 0.14;
        const tonePosition = ((((toneDrift % 1) + 1) % 1) * tones.length);
        const toneIndex = Math.floor(tonePosition);
        const toneMix = tonePosition - toneIndex;
        const toneA = tones[toneIndex % tones.length];
        const toneB = tones[(toneIndex + 1) % tones.length];
        const cellTone = [
          mix(toneA[0], toneB[0], toneMix),
          mix(toneA[1], toneB[1], toneMix),
          mix(toneA[2], toneB[2], toneMix),
        ];

        const chromaNudge = (chromaHash - 0.5) * 12 + depthBias * 14;
        const variedBlue = [
          clamp(cellTone[0] - depthBias * 18 + (baseHash - 0.5) * 8, 45, 145),
          clamp(cellTone[1] + chromaNudge * 0.3 - depthBias * 8, 105, 215),
          clamp(cellTone[2] + depthBias * 6 + (cycleHash - 0.5) * 6, 210, 255),
        ];
        const baseColor = [
          mix(leftColor[0], variedBlue[0], blueAmount),
          mix(leftColor[1], variedBlue[1], blueAmount),
          mix(leftColor[2], variedBlue[2], blueAmount),
        ];
        const color = hottestHighlight
          ? mixColor(baseColor, peakColor, 0.98)
          : peakHighlight
          ? mixColor(baseColor, highlightColor, 0.88)
          : mixColor(
              baseColor,
              highlightColor,
              highlightAmount * (1 + rightEdgeBoost * 0.4)
            );

        const baseOpacity = 0.72 + baseHash * 0.22;
        context.globalAlpha =
          peakHighlight || hottestHighlight
            ? revealAlpha * fieldIntensity
            : revealAlpha *
              fieldIntensity *
              clamp(baseOpacity + flowingFlicker * 0.15 + rightEdgeBoost * 0.1, 0, 1);
        context.fillStyle = color;
        context.fillRect(x + gap * 0.5, y + gap * 0.5, cell - gap, cell - gap);
      }
    }

    context.restore();
    context.globalAlpha = 1;
  }

  _emit(type: string) {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        composed: true,
        detail: {
          index: this._levelIndex,
          level: LEVELS[this._levelIndex],
          value: this._value,
        },
      })
    );
  }
}

if (
  typeof window !== "undefined" &&
  typeof customElements !== "undefined" &&
  !customElements.get("claude-model-selector")
) {
  customElements.define("claude-model-selector", ClaudeModelSelectorElement);
}

export type ClaudeModelSelectorProps = {
  value?: number;
  open?: boolean;
  disabled?: boolean;
  className?: string;
  onLevelChange?: (level: EffortLevel, index: number) => void;
  onValueChange?: (value: number) => void;
};

const ClaudeModelSelector = React.forwardRef<
  HTMLElement,
  ClaudeModelSelectorProps
>(function ClaudeModelSelector(
  { value = 0, disabled = false, className, onLevelChange, onValueChange },
  ref
) {
  const innerRef = React.useRef<HTMLElement | null>(null);

  React.useImperativeHandle(ref, () => innerRef.current as HTMLElement);

  React.useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const handleInput = (e: Event) => {
      const customEvent = e as CustomEvent<{
        index: number;
        level: EffortLevel;
        value: number;
      }>;
      if (customEvent.detail) {
        onLevelChange?.(customEvent.detail.level, customEvent.detail.index);
        onValueChange?.(customEvent.detail.value);
      }
    };

    el.addEventListener("input", handleInput);
    el.addEventListener("change", handleInput);

    return () => {
      el.removeEventListener("input", handleInput);
      el.removeEventListener("change", handleInput);
    };
  }, [onLevelChange, onValueChange]);

  React.useEffect(() => {
    const el = innerRef.current;
    if (el && Number.isFinite(value)) {
      el.setAttribute("value", String(value));
    }
  }, [value]);

  return React.createElement("claude-model-selector", {
    ref: innerRef,
    className,
    value: String(value),
    disabled: disabled ? true : undefined,
  });
});

export { ClaudeModelSelectorElement };
export default ClaudeModelSelector;
