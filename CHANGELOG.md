# Changelog

All notable changes, architectural updates, and UI/UX refinements to the portfolio.

---

## [Unreleased] - 2026-08-18

### 🚀 Highlights & Major Features
- **Claude / AI Model & Effort Selector**:
  - Implemented the interactive Claude Model Selector with multi-tiered reasoning effort control (`Low`, `Medium`, `High`, `Max`).
  - Added fluid particle sparkle canvas spanning the full width of the slider track.
  - Engineered monotonic quintic-ease glide transitions to eliminate thumb fidgeting and track jitter.
  - Aligned slider thumb travel bounds flush with zero edge gaps (`--effort-track-pad: 0px`).
- **Seamless Motion Popover System**:
  - Built custom floating popover system with multi-viewport boundary collision detection (`popover-position.ts`).
  - Completely eliminated SVG goo slug / dark bridge artifacts by gating SVG color matrix filters and introducing clean opacity-scale transitions.
- **Audio & Sound Synthesis Architecture (`synth-sounds.ts`)**:
  - Upgraded theme toggle sound to a velvety, organic directional air swoosh (rising sunrise whoosh vs. calming twilight whoosh).
  - Added ASMR-grade tactile mechanical clicks, sound toggle transitions, and reasoning tier audio cues.
  - Built robust global audio context management with volume normalization and zero harsh clipping.
- **Ask AI & Prompt Box Polish**:
  - Neutral gray, borderless, shadowless design for suggested prompt pills and Mobius loading indicators.
  - Enhanced streaming markdown rendering, reasoning step indicators, and code block formatting.
- **Mobile & Cross-Browser Dark Mode Override**:
  - Configured explicit `<meta name="color-scheme" content="light dark">`, `<meta name="supported-color-schemes" content="light dark">`, and Next.js viewport metadata.
  - Enforced CSS `:root { color-scheme: only light; forced-color-adjust: none; }` and `.dark { color-scheme: only dark; forced-color-adjust: none; }` to permanently forbid forced algorithmic color inversion in Chromium on Android, Edge, Opera GX, and Samsung Internet.
- **Scrollbar & Layout System**:
  - Safely hid all native scrollbars across WebKit, Chromium, Firefox, and Edge while preserving 100% fluid touch, wheel, and keyboard scrolling.
- **Engineering-First Bio & Narrative Framing**:
  - Re-anchored the hero bio and project narratives around frontend systems architecture, component modularity, and micro-interaction engineering.
  - Replaced arbitrary line-count metrics with verified engineering benchmarks: `98+ Lighthouse`, `Sub-50ms Latency`, `0 CLS (Zero Layout Shift)`, and `RLS + AES-256 Encryption`.
  - Populated valid repository links across all project cards.
  - Distinctly separated commercial client engagements (PRIMA) from systems overhauls and academic capstones.

---

### 🎨 UI & Design Polish
- **Subpage Header & Blueprint Grid**:
  - Consistent layout architecture across `/experience`, `/milestones`, `/projects`, `/pull-requests`, `/resume`, and `/contact`.
  - Precision dot-matrix blueprint borders and intersection nodes in light and dark modes.
- **Socials & Interactive Elements**:
  - Polished morphing socials with magnetic hover states.
  - Cleaned up glass form aesthetics with dynamic auto-resizing textareas and autofill styling.

---

### 🛠️ Codebase & Cleanup
- Removed legacy unused components and temporary files.
- Verified 100% clean builds with 0 TypeScript/Turbopack errors across all 16 static and dynamic routes.
