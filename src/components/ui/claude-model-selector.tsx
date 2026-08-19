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
  private _labelFrame!: number;
  private _labelTimer!: number;
  private _closeTimer!: number;
  private _isUltra!: boolean;
  private _reflectingValue!: boolean;
  private _reducedMotion!: MediaQueryList;
  private _events?: AbortController;
  private _smokeRenderer: SmokeRenderer | null = null;
  private _themeObserver?: MutationObserver;

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
    this._labelFrame = 0;
    this._labelTimer = 0;
    this._closeTimer = 0;
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
          transform: translateZ(0);
          -webkit-mask-image: -webkit-radial-gradient(white, black);
          isolation: isolate;
        }

        :host([data-ultra]) .track {
          background-color: #1e293b;
          box-shadow: 0 0 16px rgba(100, 149, 237, 0.2), inset 0 0 6px rgba(100, 149, 237, 0.15);
          transition: background-color 300ms ease, box-shadow 400ms ease;
        }

        :host-context(.dark):host([data-ultra]) .track,
        :host([data-theme="dark"][data-ultra]) .track {
          background-color: #0f172a;
          box-shadow: 0 0 16px rgba(100, 149, 237, 0.28), inset 0 0 8px rgba(100, 149, 237, 0.2);
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

        .smoke-container {
          position: absolute;
          inset: 0;
          width: 100%;
          overflow: hidden;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          -webkit-mask-image: linear-gradient(to left, #000 0%, #000 50%, rgba(0, 0, 0, 0.45) 75%, transparent 100%);
          mask-image: linear-gradient(to left, #000 0%, #000 50%, rgba(0, 0, 0, 0.45) 75%, transparent 100%);
          -webkit-mask-size: 260% 100%;
          mask-size: 260% 100%;
          -webkit-mask-position: 100% 0;
          mask-position: 100% 0;
          transition: 
            -webkit-mask-position 800ms cubic-bezier(0.16, 1, 0.3, 1),
            mask-position 800ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 350ms ease,
            visibility 800ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: -webkit-mask-position, mask-position, opacity;
        }

        :host([data-ultra]) .smoke-container {
          opacity: 1;
          visibility: visible;
          -webkit-mask-position: 0% 0;
          mask-position: 0% 0;
        }

        .smoke-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
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
          border-color: #6495ed !important;
          box-shadow: 0 0 0 2px rgba(100, 149, 237, 0.4), 0 0 12px rgba(100, 149, 237, 0.5), 0 2px 6px rgba(0, 0, 0, 0.2) !important;
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
          color: #facc15 !important;
        }

        .range:active::-webkit-slider-thumb,
        .range:active::-moz-range-thumb {
          cursor: grabbing;
        }

        .warning-banner {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
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
              <div class="smoke-container">
                <canvas class="smoke-canvas"></canvas>
              </div>
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
    this._canvas = this.shadowRoot!.querySelector(".smoke-canvas")!;
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

    this._initSmokeRenderer();
  }

  _getThemeSmokeColors() {
    const isDark =
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.body?.classList.contains("dark") ||
        this.getAttribute("data-theme") === "dark");

    if (isDark) {
      return {
        primary: hexToRgb("#6495ED"), // Cornflower Blue
        secondary: hexToRgb("#3B82F6"), // Electric Blue
        shadow: hexToRgb("#050814"), // Obsidian Shadow
      };
    } else {
      return {
        primary: hexToRgb("#3B82F6"), // Electric Blue
        secondary: hexToRgb("#60A5FA"), // Sky Blue
        shadow: hexToRgb("#0F172A"), // Deep Slate Shadow for crisp contrast in light mode
      };
    }
  }

  _syncThemeColors() {
    if (!this._smokeRenderer) return;
    const colors = this._getThemeSmokeColors();
    this._smokeRenderer.update({
      colors: [colors.primary, colors.secondary, colors.shadow],
      speed: 1.25,
    });
  }

  _initSmokeRenderer() {
    if (this._smokeRenderer || !this._canvas) return;
    try {
      const colors = this._getThemeSmokeColors();
      this._smokeRenderer = createSmokeRenderer(this._canvas, {
        colors: [colors.primary, colors.secondary, colors.shadow],
        speed: 1.25,
      });

      if (!this._isUltra) {
        this._smokeRenderer.pause();
      }

      if (typeof MutationObserver !== "undefined" && typeof document !== "undefined") {
        this._themeObserver?.disconnect();
        this._themeObserver = new MutationObserver(() => this._syncThemeColors());
        this._themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class", "data-theme"],
        });
      }
    } catch (e) {
      console.warn("WebGL smoke renderer fallback for slider track.", e);
    }
  }

  disconnectedCallback() {
    this._themeObserver?.disconnect();
    this._themeObserver = undefined;
    this._smokeRenderer?.destroy();
    this._smokeRenderer = null;
    this._events?.abort();
    cancelAnimationFrame(this._springFrame);
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

  _onPointerDown(e?: PointerEvent) {
    if (this.disabled) return;
    if (e && typeof e.pointerId === "number") {
      try {
        (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
      } catch {}
    }
    cancelAnimationFrame(this._springFrame);
    this._springFrame = 0;
    this._dragging = true;
    this._pointerSamples = [{ time: performance.now(), value: this._value }];
  }

  _onPointerUp(e?: PointerEvent) {
    if (e && typeof e.pointerId === "number") {
      try {
        (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
      } catch {}
    }
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
    if (Math.abs(target - this._value) < 0.001) {
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
    if (!this._dragging) {
      this._input.value = String(safeValue);
    }
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
    if (isUltra) {
      this._smokeRenderer?.resume();
    } else {
      this._smokeRenderer?.pause();
    }
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

  return React.createElement("claude-model-selector", {
    ref: innerRef,
    className,
    value: String(value),
    disabled: disabled ? true : undefined,
  });
});

export { ClaudeModelSelectorElement };
export default ClaudeModelSelector;
