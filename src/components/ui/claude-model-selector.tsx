"use client";

import * as React from "react";
import { playReasoningSound } from "@/lib/synth-sounds";

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

const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const mixColor = (from: number[], to: number[], amount: number) =>
  `rgb(${Math.round(mix(from[0], to[0], amount))} ${Math.round(
    mix(from[1], to[1], amount),
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
  private _reveal!: number;
  private _isUltra!: boolean;
  private _reflectingValue!: boolean;
  private _reducedMotion!: MediaQueryList;
  private _events?: AbortController;
  private _resizeObserver?: ResizeObserver;

  private _panel!: HTMLElement;
  private _input!: HTMLInputElement;
  private _track!: HTMLElement;
  private _canvas!: HTMLCanvasElement;
  private _currentLabel!: HTMLElement;
  private _outgoingLabel!: HTMLElement;
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
    this._reveal = 0;
    this._isUltra = false;
    this._reflectingValue = false;
    this._reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          --effort-accent: #8c73c9;
          --effort-accent-deep: #a17ec2;
          --effort-text: #64748b;
          --effort-text-strong: #0f172a;
          --effort-muted: #94a3b8;
          --effort-track: #edeae8;
          --effort-track-fill: #e0dbd6;
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
          --effort-accent: #a78bfa;
          --effort-accent-deep: #c084fc;
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
          padding: 0 0 2px 0;
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
          color: var(--effort-accent) !important;
          text-shadow: 0 0 10px rgba(140, 115, 201, 0.35);
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
          padding: 0.4rem 0.55rem;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.15), 0 2px 6px -1px rgba(0, 0, 0, 0.08);
          color: #0f172a;
          font-size: 0.6875rem;
          line-height: 1.4;
          opacity: 0;
          visibility: hidden;
          transform: translateY(4px) scale(0.98);
          transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms cubic-bezier(0.16, 1, 0.3, 1), visibility 220ms cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        :host-context(.dark) .tooltip,
        :host([data-theme="dark"]) .tooltip {
          background: rgba(23, 23, 23, 0.88);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3);
          color: #f5f5f5;
        }

        .help-wrap:hover .tooltip,
        .help-button:focus-visible + .tooltip,
        .help-wrap[data-tip-open] .tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
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
          box-shadow: inset 0 1px 1px rgba(70, 64, 59, 0.035);
          transform: translateZ(0);
          -webkit-mask-image: -webkit-radial-gradient(white, black);
          isolation: isolate;
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
            #eeebe9 0%,
            #ece9e7 18%,
            #e2dce3 32%,
            #d9d0df 48%,
            #d0c1da 68%,
            #cdbcd9 82%,
            #cbbad8 100%
          );
          opacity: 0;
          transition: opacity 340ms ease-in;
        }

        :host-context(.dark) .track::before,
        :host([data-theme="dark"]) .track::before {
          background: linear-gradient(
            90deg,
            #1e1b4b 0%,
            #2e1065 18%,
            #3b0764 32%,
            #4c1d95 48%,
            #581c87 68%,
            #6b21a8 82%,
            #7e22ce 100%
          );
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
          transition: opacity 200ms cubic-bezier(0.2, 0, 0, 1);
        }

        .ultra-fallback {
          background: linear-gradient(
            90deg,
            #eeebe9 0%,
            #ece9e7 18%,
            #e2dce3 32%,
            #d5cadc 48%,
            #c8b5d4 68%,
            #bda6cc 82%,
            #b59bc6 100%
          );
        }

        :host-context(.dark) .ultra-fallback,
        :host([data-theme="dark"]) .ultra-fallback {
          background: linear-gradient(
            90deg,
            #1e1b4b 0%,
            #2e1065 18%,
            #3b0764 32%,
            #4c1d95 48%,
            #581c87 68%,
            #6b21a8 82%,
            #7e22ce 100%
          );
        }

        :host([data-ultra][data-pixels-ready]) .pixel-field {
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
          transition: opacity 250ms ease;
        }

        :host([data-ultra]) .ticks {
          opacity: 0;
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

        :host([data-ultra]) .range::-webkit-slider-thumb {
          border: none !important;
          outline: none !important;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18), 0 0 1px rgba(0, 0, 0, 0.12) !important;
        }

        :host([data-low]) .range::-webkit-slider-thumb {
          background: #facc15 !important;
          border-color: #eab308 !important;
          box-shadow: 0 0 0 2.5px rgba(250, 204, 21, 0.45), 0 2px 5px rgba(0, 0, 0, 0.15) !important;
        }

        :host-context(.dark):host([data-low]) .range::-webkit-slider-thumb,
        :host([data-theme="dark"][data-low]) .range::-webkit-slider-thumb {
          background: #eab308 !important;
          border-color: #facc15 !important;
          box-shadow: 0 0 0 2.5px rgba(234, 179, 8, 0.5), 0 2px 6px rgba(0, 0, 0, 0.35) !important;
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

        :host([data-ultra]) .range::-moz-range-thumb {
          border: none !important;
          outline: none !important;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18), 0 0 1px rgba(0, 0, 0, 0.12) !important;
        }

        :host([data-low]) .range::-moz-range-thumb {
          background: #facc15 !important;
          border-color: #eab308 !important;
          box-shadow: 0 0 0 2.5px rgba(250, 204, 21, 0.45), 0 2px 5px rgba(0, 0, 0, 0.15) !important;
        }

        :host-context(.dark):host([data-low]) .range::-moz-range-thumb,
        :host([data-theme="dark"][data-low]) .range::-moz-range-thumb {
          background: #eab308 !important;
          border-color: #facc15 !important;
          box-shadow: 0 0 0 2.5px rgba(234, 179, 8, 0.5), 0 2px 6px rgba(0, 0, 0, 0.35) !important;
        }

        :host([data-low]) .level-current {
          color: #d97706 !important;
        }

        :host-context(.dark):host([data-low]) .level-current,
        :host([data-theme="dark"][data-low]) .level-current {
          color: #fbbf24 !important;
        }

        .warning-banner {
          display: flex;
          align-items: flex-start;
          gap: 0.375rem;
          margin-top: 0;
          padding: 0;
          max-height: 0;
          border-radius: 0.375rem;
          background: rgba(254, 243, 199, 0.75);
          border: 0 solid rgba(245, 158, 11, 0.35);
          color: #92400e;
          font-size: 0.6875rem;
          line-height: 1.35;
          opacity: 0;
          overflow: hidden;
          pointer-events: none;
          transition: opacity 220ms ease, max-height 260ms ease, margin 220ms ease, padding 220ms ease, border-width 220ms ease;
        }

        :host-context(.dark) .warning-banner,
        :host([data-theme="dark"]) .warning-banner {
          background: rgba(120, 53, 15, 0.28);
          border-color: rgba(245, 158, 11, 0.4);
          color: #fde68a;
        }

        :host([data-low]) .warning-banner {
          opacity: 1;
          max-height: 5.5rem;
          margin-top: 0.45rem;
          padding: 0.35rem 0.5rem;
          border-width: 1px;
          pointer-events: auto;
        }

        .warning-icon {
          flex: 0 0 auto;
          width: 0.8125rem;
          height: 0.8125rem;
          margin-top: 0.08rem;
          color: #d97706;
        }

        :host-context(.dark) .warning-icon,
        :host([data-theme="dark"]) .warning-icon {
          color: #fbbf24;
        }

        .warning-text {
          flex: 1 1 auto;
        }

        .warning-lead {
          font-weight: 600;
          color: #b45309;
        }

        :host-context(.dark) .warning-lead,
        :host([data-theme="dark"]) .warning-lead {
          color: #fbbf24;
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
                Higher effort spends more time reasoning. Low is fast but may be inaccurate. Max activates deepest analysis.
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

          <div class="warning-banner" role="status" aria-live="polite">
            <svg class="warning-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="warning-text">
              <span class="warning-lead">Notice:</span> Responses at Low reasoning may be less accurate or lack depth. <strong>Recommended:</strong> Set to <em>Medium</em>, <em>High</em>, or <em>Max</em> for detailed portfolio exploration.
            </div>
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
      (e) => this._onPointerDown(e as PointerEvent),
      { signal }
    );
    this._input.addEventListener(
      "pointerup",
      (e) => this._onPointerUp(e as PointerEvent),
      { signal }
    );
    this._input.addEventListener(
      "pointercancel",
      (e) => this._onPointerUp(e as PointerEvent),
      { signal }
    );
    this._input.addEventListener("input", () => this._onInput(), { signal });
    this._input.addEventListener(
      "keydown",
      (event) => this._onKeyDown(event),
      { signal }
    );
    this._helpButton.addEventListener(
      "mouseenter",
      () => this._emitTooltipState(true),
      { signal }
    );
    this._helpButton.addEventListener(
      "mouseleave",
      () => {
        if (!this._helpWrap.hasAttribute("data-tip-open")) {
          this._emitTooltipState(false);
        }
      },
      { signal }
    );
    this._helpButton.addEventListener(
      "click",
      () => {
        if (this.disabled) return;
        this._helpWrap.toggleAttribute("data-tip-open");
        this._emitTooltipState(this._helpWrap.hasAttribute("data-tip-open"));
      },
      { signal }
    );

    this._reducedMotion.addEventListener("change", () => {
      if (this._isUltra) {
        this.setAttribute("data-pixels-ready", "");
        this._reveal = this._reducedMotion.matches ? 1 : 0;
        this._ultraStartedAt = performance.now();
        this._ensureCanvasLoop();
      }
    });

    this._resizeObserver = new ResizeObserver(() => this._resizeCanvas());
    this._resizeObserver.observe(this._track);
    this._resizeCanvas();
    if (this._isUltra) this._ensureCanvasLoop();
  }

  disconnectedCallback() {
    this._resizeObserver?.disconnect();
    this._events?.abort();
    cancelAnimationFrame(this._springFrame);
    cancelAnimationFrame(this._canvasFrame);
    cancelAnimationFrame(this._labelFrame);
    clearTimeout(this._labelTimer);
    clearTimeout(this._closeTimer);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === "value" && !this._reflectingValue && this._input) {
      const next = Number.parseFloat(newValue ?? "0");
      this._setValue(Number.isFinite(next) ? next : 0, {
        animateLabel: this.isConnected,
        reflect: false,
      });
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

  _onPointerDown(e?: PointerEvent) {
    if (this.disabled) return;
    if (e && this._input.setPointerCapture) {
      try {
        this._input.setPointerCapture(e.pointerId);
      } catch {}
    }
    cancelAnimationFrame(this._springFrame);
    this._dragging = true;
    this._pointerSamples = [{ time: performance.now(), value: this._value }];
  }

  _onPointerUp(e?: PointerEvent) {
    if (!this._dragging) return;
    if (e && this._input.releasePointerCapture) {
      try {
        this._input.releasePointerCapture(e.pointerId);
      } catch {}
    }
    this._dragging = false;
    this._snapToNearest();
  }

  _onInput() {
    let nextValue = Number.parseFloat(this._input.value);
    if (this._dragging) {
      nextValue = this._applyMagnet(nextValue);
      this._input.value = String(nextValue);
      const now = performance.now();
      this._pointerSamples.push({ time: now, value: nextValue });
      this._pointerSamples = this._pointerSamples
        .filter((sample) => now - sample.time < 90)
        .slice(-5);
    }
    this._setValue(nextValue, { animateLabel: true, reflect: false });
    this._emit("input");
  }

  _applyMagnet(value: number) {
    const nearest = Math.round(value);
    const delta = value - nearest;
    const distance = Math.abs(delta);
    const radius = 0.5;
    if (distance < 0.001 || distance > radius) return value;
    const t = 1 - distance / radius;
    const strength = 0.68 + 0.42 * t;
    return value - delta * strength * t * t;
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
      this._emit("change");
      return;
    }

    let initialVelocity = 0;
    if (this._pointerSamples.length >= 2) {
      const first = this._pointerSamples[0];
      const last = this._pointerSamples.at(-1)!;
      const elapsed = Math.max((last.time - first.time) / 1000, 0.016);
      initialVelocity = clamp((last.value - first.value) / elapsed, -8, 8);
    }
    this._springTo(target, initialVelocity);
  }

  _springTo(target: number, initialVelocity: number) {
    cancelAnimationFrame(this._springFrame);
    let position = this._value;
    let velocity = initialVelocity;
    let previousTime = performance.now();
    const stiffness = 920;
    const damping = 40;

    const step = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.032);
      previousTime = time;
      const acceleration =
        -stiffness * (position - target) - damping * velocity;
      velocity += acceleration * delta;
      position = clamp(position + velocity * delta, 0, LEVELS.length - 1);
      this._setValue(position, { animateLabel: true, reflect: false });

      if (Math.abs(position - target) < 0.001 && Math.abs(velocity) < 0.01) {
        this._springFrame = 0;
        this._setValue(target, { animateLabel: false, reflect: true });
        this._emit("change");
        return;
      }
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
    if (!this._dragging) {
      this._input.value = String(safeValue);
    }
    this._input.setAttribute("aria-valuetext", LEVELS[nextIndex]);
    this.style.setProperty(
      "--effort-progress",
      String(safeValue / (LEVELS.length - 1))
    );

    if (nextIndex !== previousIndex) {
      playReasoningSound(LEVELS[nextIndex].toLowerCase());
      this._levelIndex = nextIndex;
      this._swapLabel(
        LEVELS[nextIndex],
        nextIndex > previousIndex,
        animateLabel
      );
    } else if (!this._currentLabel.textContent) {
      this._currentLabel.textContent = LEVELS[nextIndex];
    }

    this._setUltra(nextIndex === LEVELS.length - 1);
    this.toggleAttribute("data-low", nextIndex === 0);

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
    const previousLabel = this._currentLabel.textContent;
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
    if (isUltra) {
      this.setAttribute("data-pixels-ready", "");
      this._reveal = this._reducedMotion.matches ? 1 : 0;
      this._ultraStartedAt = performance.now();
      this._ensureCanvasLoop();
    } else {
      this.removeAttribute("data-pixels-ready");
      this._reveal = 0;
      this._drawPixelField(performance.now());
    }
  }

  _resizeCanvas() {
    const rect = this._track.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(rect.width * ratio);
    const height = Math.round(rect.height * ratio);
    if (this._canvas.width !== width || this._canvas.height !== height) {
      this._canvas.width = width;
      this._canvas.height = height;
      this._canvas.style.width = `${rect.width}px`;
      this._canvas.style.height = `${rect.height}px`;
      this._drawPixelField(performance.now());
    }
  }

  _ensureCanvasLoop() {
    if (this._canvasFrame || !this._isUltra || this._reducedMotion.matches) {
      this._drawPixelField(performance.now());
      return;
    }

    const frame = (time: number) => {
      if (!this._isUltra || !this.isConnected) {
        this._canvasFrame = 0;
        return;
      }
      if (time - this._lastCanvasFrame >= 33) {
        this._lastCanvasFrame = time;
        this._reveal = smoothstep(0, 1, (time - this._ultraStartedAt) / 1000);
        this._drawPixelField(time);
      }
      this._canvasFrame = requestAnimationFrame(frame);
    };
    this._canvasFrame = requestAnimationFrame(frame);
  }

  _drawPixelField(time: number) {
    const context = this._canvas.getContext("2d");
    if (!context || !this._canvas.width || !this._canvas.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = this._canvas.width / ratio;
    const height = this._canvas.height / ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    if (!this._isUltra) return;

    const reveal = this._reducedMotion.matches ? 1 : this._reveal;
    const frontier = 1 - reveal;
    const cell = width < 280 ? 5 : 6;
    const gap = 1.1;
    const columns = Math.ceil(width / cell);
    const rows = Math.ceil(height / cell);
    const elapsed = Math.max(0, time - this._ultraStartedAt);

    const isDark =
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.body?.classList.contains("dark") ||
        this.getAttribute("data-theme") === "dark");

    // Ultracode track palette (share-weighted).
    const leftColor = isDark ? [30, 41, 59] : [210, 206, 214];
    const deepViolet = isDark ? [139, 92, 246] : [156, 120, 192];
    const deepMid = isDark ? [147, 51, 234] : [156, 132, 192];
    const midPurple = isDark ? [168, 85, 247] : [168, 144, 204];
    const softMid = isDark ? [192, 132, 252] : [168, 156, 204];
    const softLilac = isDark ? [216, 180, 254] : [180, 168, 204];
    const paleCool = isDark ? [233, 213, 255] : [192, 180, 204];
    const highlightColor = isDark ? [243, 232, 255] : [216, 204, 228];
    const peakColor = [255, 255, 255];
    const tones = [
      deepViolet,
      deepViolet,
      deepMid,
      deepMid,
      midPurple,
      midPurple,
      midPurple,
      softMid,
      softMid,
      softLilac,
      paleCool,
    ];

    const flowDuration = 4000;
    const rawFlow = elapsed / flowDuration;
    const flowCycle = Math.floor(rawFlow);
    const easedFlow = flowCycle + smoothstep(0, 1, rawFlow - flowCycle);

    context.save();
    context.beginPath();
    context.roundRect(0, 0, width, height, 8);
    context.clip();

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x = column * cell;
        const y = row * cell;
        const normalizedX = (x + cell * 0.5) / width;
        const revealAlpha = smoothstep(frontier - 0.1, frontier + 0.07, normalizedX);
        if (revealAlpha <= 0.002) continue;

        const purpleAmount = smoothstep(0.1, 0.88, normalizedX);
        const fieldIntensity = smoothstep(0.04, 0.38, normalizedX);
        const depthBias = smoothstep(0.35, 0.95, normalizedX);

        const baseHash = Math.abs(Math.sin(column * 12.9898 + row * 78.233) * 43758.5453) % 1;
        const tempoHash = Math.abs(Math.sin(column * 7.13 + row * 19.41) * 19341.731) % 1;
        const phaseHash = Math.abs(Math.sin(column * 31.17 + row * 11.93) * 28437.123) % 1;
        const chromaHash = Math.abs(Math.sin(column * 9.47 + row * 67.13) * 15823.917) % 1;

        const period = 500 + tempoHash * 1500;
        const localTime = elapsed + phaseHash * period;
        const cycle = Math.floor(localTime / period);
        const cycleProgress = (localTime % period) / period;
        const cycleHash = Math.abs(
          Math.sin(column * 17.17 + row * 41.73 + cycle * 13.11) * 24634.6345
        ) % 1;
        const widthHash = Math.abs(
          Math.sin(column * 5.37 + row * 29.11 + cycle * 7.43) * 17391.443
        ) % 1;

        const pulseCenter = 0.2 + cycleHash * 0.55;
        const pulseWidth = 0.09 + widthHash * 0.08;
        const pulseDistance = (cycleProgress - pulseCenter) / pulseWidth;
        const pulseEnvelope = Math.exp(-pulseDistance * pulseDistance * 1.45);
        const activeCycle = cycleHash > 0.12 ? 1 : 0.26;
        const irregularFlicker = pulseEnvelope * activeCycle;

        const flowCoordinate = (normalizedX + easedFlow) * 9;
        const flowIndex = Math.floor(flowCoordinate);
        const flowProgress = smoothstep(0, 1, flowCoordinate - flowIndex);
        const flowHashA = Math.abs(
          Math.sin(flowIndex * 18.31 + row * 37.17) * 19283.173
        ) % 1;
        const flowHashB = Math.abs(
          Math.sin((flowIndex + 1) * 18.31 + row * 37.17) * 19283.173
        ) % 1;
        const clusterGate = smoothstep(
          0.46,
          0.84,
          mix(flowHashA, flowHashB, flowProgress)
        );
        const wavePhase =
          (normalizedX + easedFlow + row * 0.06 + baseHash * 0.02) * Math.PI * 2;
        const directionalWave = Math.pow(0.5 + 0.5 * Math.cos(wavePhase), 5);
        const directionalFlow = Math.max(clusterGate, directionalWave * 0.62);
        const flowingFlicker = Math.max(
          irregularFlicker * (0.48 + directionalFlow * 0.58),
          directionalFlow * (0.38 + baseHash * 0.28)
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
          lightAmount > 0.4 &&
          irregularFlicker > 0.16 &&
          cycleHash > 0.26 &&
          clusterGate > 0.04;
        const hottestHighlight =
          lightAmount > 0.68 &&
          irregularFlicker > 0.3 &&
          cycleHash > 0.48 &&
          clusterGate > 0.12;
        const highlightAmount = peakHighlight
          ? 0.97
          : clamp(lightAmount * (0.44 + cycleHash * 0.3), 0, 0.64);

        const toneDrift =
          baseHash * 0.28 +
          depthBias * 0.28 +
          cycleProgress * 0.38 +
          easedFlow * 0.18 +
          cycleHash * 0.2 +
          Math.sin(elapsed * 0.00135 + phaseHash * Math.PI * 2) * 0.14;
        const tonePosition = (((toneDrift % 1) + 1) % 1) * tones.length;
        const toneIndex = Math.floor(tonePosition);
        const toneMix = tonePosition - toneIndex;
        const toneA = tones[toneIndex];
        const toneB = tones[(toneIndex + 1) % tones.length];
        const cellTone = [
          mix(toneA[0], toneB[0], toneMix),
          mix(toneA[1], toneB[1], toneMix),
          mix(toneA[2], toneB[2], toneMix),
        ];

        const chromaNudge = (chromaHash - 0.5) * 10 + depthBias * 12;
        const variedPurple = [
          clamp(cellTone[0] + chromaNudge * 0.35 - depthBias * 8, 140, 196),
          clamp(cellTone[1] - depthBias * 16 + (baseHash - 0.5) * 8, 104, 168),
          clamp(cellTone[2] + depthBias * 6 + (cycleHash - 0.5) * 6, 182, 216),
        ];
        const baseColor = [
          mix(leftColor[0], variedPurple[0], purpleAmount),
          mix(leftColor[1], variedPurple[1], purpleAmount),
          mix(leftColor[2], variedPurple[2], purpleAmount),
        ];
        const color = hottestHighlight
          ? mixColor(baseColor, peakColor, 0.95)
          : mixColor(baseColor, highlightColor, highlightAmount);

        const baseOpacity = 0.7 + baseHash * 0.2;
        context.globalAlpha =
          peakHighlight || hottestHighlight
            ? revealAlpha * fieldIntensity
            : revealAlpha *
              fieldIntensity *
              clamp(baseOpacity + flowingFlicker * 0.12, 0, 1);
        context.fillStyle = color;
        context.fillRect(
          x + gap * 0.5,
          y + gap * 0.5,
          cell - gap,
          cell - gap
        );
      }
    }

    context.restore();
    context.globalAlpha = 1;
  }

  _emitTooltipState(isOpen: boolean) {
    this.dispatchEvent(
      new CustomEvent("tooltiptoggle", {
        bubbles: true,
        composed: true,
        detail: { open: isOpen },
      })
    );
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
  onTooltipToggle?: (open: boolean) => void;
};

const ClaudeModelSelector = React.forwardRef<
  HTMLElement,
  ClaudeModelSelectorProps
>(function ClaudeModelSelector(
  { value = 0, disabled = false, className, onLevelChange, onValueChange, onTooltipToggle },
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

    const handleTooltip = (e: Event) => {
      const customEvent = e as CustomEvent<{ open: boolean }>;
      if (customEvent.detail) {
        onTooltipToggle?.(customEvent.detail.open);
      }
    };

    el.addEventListener("input", handleInput);
    el.addEventListener("change", handleInput);
    el.addEventListener("tooltiptoggle", handleTooltip);

    return () => {
      el.removeEventListener("input", handleInput);
      el.removeEventListener("change", handleInput);
      el.removeEventListener("tooltiptoggle", handleTooltip);
    };
  }, [onLevelChange, onValueChange, onTooltipToggle]);

  React.useEffect(() => {
    const el = innerRef.current;
    if (el && Number.isFinite(value)) {
      el.setAttribute("value", String(value));
    }
  }, [value]);

  React.useEffect(() => {
    const el = innerRef.current;
    if (el) {
      el.toggleAttribute("disabled", disabled);
    }
  }, [disabled]);

  return React.createElement("claude-model-selector", {
    ref: innerRef,
    class: className,
  });
});

export { ClaudeModelSelector, ClaudeModelSelectorElement };
export default ClaudeModelSelector;
