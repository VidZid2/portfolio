"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Combobox } from "@base-ui/react/combobox";
import { PreviewCard } from "@base-ui/react/preview-card";
import {
  BrainIcon,
  CaretDownIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  PaperPlaneTiltIcon,
  InfoIcon,
} from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AsciiText } from "@/components/ui/ascii-text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { playKeyTick, playSoftClick, playHoverTick, playReasoningSound } from "@/lib/synth-sounds";
import { MobiusLoopIcon, MorphingSpinner } from "@/components/loading-ui/morphing-spinner";
import ClaudeModelSelector, { EffortLevel } from "@/components/ui/claude-model-selector";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/motion/popover";

export type LlmModel = {
  value: string;
  label: string;
  provider: string;
  description: string;
  contextWindow: string;
  inputPrice: string;
  outputPrice: string;
  hasSpeedConfiguration?: boolean;
  metrics: {
    intelligence: number;
    speed: number;
    context: number;
    cost: number;
  };
};

export const DEFAULT_LLM_MODELS: LlmModel[] = [
  {
    value: "sync-ai",
    label: "Sync AI",
    provider: "Sync Engine",
    description: "A custom AI assistant built by a 2nd-year CS student, trained with 128k context to explore my projects, architecture, and tech stack in real-time.",
    contextWindow: "128k",
    inputPrice: "Free",
    outputPrice: "Free",
    metrics: { intelligence: 9.9, speed: 9.6, context: 9.8, cost: 0 },
  },
];

const DEFAULT_MODEL = DEFAULT_LLM_MODELS[0];

export type ReasoningLevel = "low" | "medium" | "high" | "max";
export type SpeedLevel = "standard" | "fast";

export type ModelConfiguration = {
  reasoning: ReasoningLevel;
  speed: SpeedLevel;
};

export type ModelSelectorSubmitPayload = {
  configuration: ModelConfiguration;
  configurations: Record<string, ModelConfiguration>;
  model: LlmModel;
  prompt: string;
};

export type ModelSelectorPromptProps = {
  className?: string;
  configurations?: Record<string, ModelConfiguration>;
  defaultConfigurations?: Record<string, ModelConfiguration>;
  defaultPrompt?: string;
  defaultValue?: string;
  disabled?: boolean;
  models?: readonly LlmModel[];
  onConfigurationChange?: (
    modelValue: string,
    configuration: ModelConfiguration,
    configurations: Record<string, ModelConfiguration>,
  ) => void;
  onModelChange?: (model: LlmModel) => void;
  onPromptChange?: (prompt: string) => void;
  onSubmit?: (payload: ModelSelectorSubmitPayload) => void | Promise<void>;
  placeholder?: string;
  prompt?: string;
  value?: string;
};

const WAVE_WASH_GRADIENT =
  "linear-gradient(180deg, transparent, rgba(100,149,237,0.3), rgba(100,149,237,0.5), rgba(100,149,237,0.7), rgba(100,149,237,0.5), rgba(100,149,237,0.3), transparent)";

function SendWave() {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[10] overflow-hidden rounded-[inherit]"
      exit={{ opacity: 0 }}
      initial={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div
        animate={{ y: "-105%" }}
        className="absolute inset-x-0 top-0 h-[150%] blur-xl"
        initial={{ y: "55%" }}
        style={{ background: WAVE_WASH_GRADIENT }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </motion.div>
  );
}

const DEFAULT_MODEL_CONFIGURATION: ModelConfiguration = {
  reasoning: "medium",
  speed: "standard",
};

function getModelConfiguration(
  configurations: Record<string, ModelConfiguration>,
  modelValue: string,
): ModelConfiguration {
  return configurations[modelValue] ?? DEFAULT_MODEL_CONFIGURATION;
}

const REASONING_INTELLIGENCE_DELTA: Record<ReasoningLevel, number> = {
  low: -2,
  medium: 0,
  high: 2,
  max: 4,
};
const SPEED_METRIC_DELTA: Record<SpeedLevel, number> = {
  standard: 0,
  fast: 2,
};

function clampMetric(value: number) {
  return Math.min(10, Math.max(0, value));
}

function ProviderIcon({
  provider,
  className,
}: {
  provider: string;
  className?: string;
}) {
  const base = cn("size-3 shrink-0", className);
  if (provider === "Anthropic") {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="#D97757" aria-hidden="true">
        <path d="M13.6 3h3.1l6.3 18h-3.2l-1.3-3.8h-6.6L10.7 21H7.5L13.6 3Zm-1.6 3.9-2.3 6.9h4.7L12 6.9Z" />
      </svg>
    );
  }
  if (provider === "OpenAI") {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    );
  }
  if (provider === "Gemini") {
    return (
      <svg className={base} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2c.4 4.7 3.3 8.4 8 9-4.7.6-7.6 4.3-8 9-.4-4.7-3.3-8.4-8-9 4.7-.6 7.6-4.3 8-9Z"
          fill="#3B82F6"
        />
      </svg>
    );
  }
  if (
    provider === "Sync Engine" ||
    provider === "Sync Labs" ||
    provider === "Sync AI" ||
    provider === "Our AI"
  ) {
    return (
      <svg className={base} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
        <path d="M3.025,5.623c.068,.204,.26,.342,.475,.342s.406-.138,.475-.342l.421-1.263,1.263-.421c.204-.068,.342-.259,.342-.474s-.138-.406-.342-.474l-1.263-.421-.421-1.263c-.137-.408-.812-.408-.949,0l-.421,1.263-1.263,.421c-.204,.068-.342,.259-.342,.474s.138,.406,.342,.474l1.263,.421,.421,1.263Z" />
        <path d="M16.525,8.803l-4.535-1.793-1.793-4.535c-.227-.572-1.168-.572-1.395,0l-1.793,4.535-4.535,1.793c-.286,.113-.475,.39-.475,.697s.188,.584,.475,.697l4.535,1.793,1.793,4.535c.113,.286,.39,.474,.697,.474s.584-.188,.697-.474l1.793-4.535,4.535-1.793c.286-.113,.475-.39,.475-.697s-.188-.584-.475-.697Z" />
      </svg>
    );
  }
  return <BrainIcon className={base} />;
}

function ProviderLabel({
  provider,
  className,
}: {
  provider: string;
  className?: string;
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-1.5", className)}>
      <ProviderIcon provider={provider} />
      <span className="truncate">{provider}</span>
    </span>
  );
}

const REASONING_LABELS: Record<ReasoningLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  max: "Max",
};

const LEVEL_TO_INDEX: Record<ReasoningLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
  max: 3,
};

const INDEX_TO_LEVEL: ReasoningLevel[] = [
  "low",
  "medium",
  "high",
  "max",
];

function ModelConfigurationBadge({
  model,
  configuration,
}: {
  model: LlmModel;
  configuration: ModelConfiguration;
}) {
  const showReasoning = configuration.reasoning !== "medium";
  const showFast = model.hasSpeedConfiguration && configuration.speed === "fast";

  const badgeClassName =
    "inline-flex items-center gap-0.5 rounded-md bg-neutral-100 px-1 py-0.5 text-neutral-500 text-[10px] group-data-[selected]:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:group-data-[selected]:bg-neutral-700";
  return (
    <div className="flex shrink-0 items-center gap-1 overflow-hidden">
      <AnimatePresence>
        {showReasoning && (
          <motion.div
            layout
            key="reasoning"
            initial={{ opacity: 0, width: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, width: "auto", filter: "blur(0px)" }}
            exit={{ opacity: 0, width: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.3, type: "spring", stiffness: 350, damping: 25 }}
            className="flex shrink-0 overflow-hidden"
          >
            <div className={cn(
              badgeClassName, 
              "whitespace-nowrap transition-colors duration-500",
              configuration.reasoning === "max" && "bg-[#6495ED]/15 text-[#6495ED] group-data-[selected]:bg-[#6495ED]/25 dark:bg-[#6495ED]/25 dark:text-[#6495ED] dark:group-data-[selected]:bg-[#6495ED]/35",
              configuration.reasoning === "high" && "bg-[#6495ED]/15 text-[#6495ED] group-data-[selected]:bg-[#6495ED]/25 dark:bg-[#6495ED]/25 dark:text-[#6495ED] dark:group-data-[selected]:bg-[#6495ED]/35",
              configuration.reasoning === "low" && "bg-[#10b981]/15 text-[#10b981] group-data-[selected]:bg-[#10b981]/25 dark:bg-[#10b981]/25 dark:text-[#10b981] dark:group-data-[selected]:bg-[#10b981]/35"
            )}>
              <BrainIcon 
                className={cn(
                  "shrink-0 transition-colors duration-500", 
                  configuration.reasoning === "max" ? "text-[#6495ED]" :
                  configuration.reasoning === "high" ? "text-[#6495ED]" :
                  configuration.reasoning === "low" ? "text-[#10b981]" : "text-neutral-500 dark:text-neutral-400"
                )} 
                size={11} 
                weight="fill" 
              />
              <AsciiText key={configuration.reasoning} text={REASONING_LABELS[configuration.reasoning]} duration={800} />
            </div>
          </motion.div>
        )}
        {showFast && (
          <motion.div
            layout
            key="fast"
            initial={{ opacity: 0, width: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, width: "auto", filter: "blur(0px)" }}
            exit={{ opacity: 0, width: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.3, type: "spring", stiffness: 350, damping: 25 }}
            className="flex shrink-0 overflow-hidden"
          >
            <div className={cn(badgeClassName, "whitespace-nowrap")}>
              <LightningIcon className="text-amber-500 shrink-0" size={11} weight="fill" />
              Fast
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const getMetricColor = (
  label: string,
  value: number,
  invert?: boolean
): string => {
  const normLabel = label.toLowerCase();
  
  if (normLabel.includes("context")) {
    return "#10b981"; // Emerald Green
  }
  
  if (invert || normLabel.includes("cost")) {
    return "#f43f5e"; // Rose
  }

  // Speed and Intelligence (4 tiers applied to whole meter based on value):
  // 1 to 3 -> Red
  // 4 to 6 -> Yellow
  // 7 to 8 -> Sky Blue
  // 9 to 10 (Close to max / Max) -> Cornflower Blue
  if (value <= 3.5) return "#ef4444"; // Red (1 to 3)
  if (value <= 6.5) return "#eab308"; // Yellow (4 to 6)
  if (value <= 8.5) return "#38bdf8"; // Sky Blue (7 to 8)
  return "#6495ED";                   // Cornflower Blue (9 to 10)
};

const GrowSegment = memo(function GrowSegment({
  color,
  delay,
  fillFraction,
}: {
  color: string;
  delay: number;
  fillFraction: number;
}) {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScale(fillFraction);
    }, delay + 15);
    return () => clearTimeout(timer);
  }, [fillFraction, delay]);

  const active = fillFraction > 0;

  return (
    <div
      className="h-full w-full origin-bottom rounded-[1.5px]"
      style={{
        backgroundColor: color,
        opacity: active ? (fillFraction >= 0.95 ? 1 : 0.55 + fillFraction * 0.45) : 0,
        transform: `scaleY(${scale})`,
        transition: `transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease, background-color 250ms ease`,
        willChange: "transform, opacity, background-color",
      }}
    />
  );
});

const MetricBar = memo(function MetricBar({
  label,
  value,
  info,
  invert = false,
  animationKey,
  forceOpenTooltip,
}: {
  label: string;
  value: number;
  info?: string;
  invert?: boolean;
  animationKey: string;
  forceOpenTooltip?: boolean;
}) {
  const barColor = getMetricColor(label, value, invert);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-1">
        <span className="font-mono font-medium text-[10px] tracking-wider text-neutral-400 uppercase leading-none dark:text-neutral-500">
          {label}
        </span>
        {info ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip open={forceOpenTooltip ? true : undefined}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="cursor-help text-neutral-400 leading-none hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                >
                  <InfoIcon weight="fill" className="size-[11px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={6}
                hideArrow={true}
                inline={forceOpenTooltip}
                className="z-[9999] bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-none rounded-md px-2.5 py-1.5 text-xs font-medium shadow-md max-w-[200px]"
              >
                {info}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </div>
      <div
        aria-label={`${label}: ${value} out of 10`}
        className="grid grid-cols-10 gap-[2px]"
        key={animationKey}
        role="img"
      >
        {Array.from({ length: 10 }, (_, index) => {
          const fillFraction = Math.max(0, Math.min(1, value - index));
          return (
            <div
              className="h-3 overflow-hidden rounded-[2px] bg-neutral-100 dark:bg-neutral-800/90"
              key={index}
            >
              <GrowSegment
                color={barColor}
                delay={index * 20}
                fillFraction={fillFraction}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

const SegmentedRadio = memo(function SegmentedRadio<TValue extends string>({
  ariaLabel,
  onValueChange,
  options,
  value,
}: {
  ariaLabel: string;
  onValueChange: (value: TValue) => void;
  options: { label: string; value: TValue }[];
  value: TValue;
}) {
  return (
    <div aria-label={ariaLabel} className="flex gap-1" role="radiogroup">
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <button
            aria-checked={checked}
            className={cn(
              "flex-1 rounded-md px-2 py-1 text-xs transition-colors",
              checked
                ? option.value === "high"
                  ? "bg-[#6495ED] text-white shadow-sm"
                  : option.value === "low"
                    ? "bg-[#10b981] text-white shadow-sm"
                    : "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white",
            )}
            key={option.value}
            onPointerEnter={() => playHoverTick(0.02)}
            onClick={() => onValueChange(option.value)}
            role="radio"
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
) as <TValue extends string>(props: {
  ariaLabel: string;
  onValueChange: (value: TValue) => void;
  options: { label: string; value: TValue }[];
  value: TValue;
}) => ReactNode;

function Button({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-neutral-900 px-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const ModelPreviewPanel = memo(function ModelPreviewPanel({
  model,
  configuration,
  onConfigurationChange,
}: {
  model: LlmModel;
  configuration: ModelConfiguration;
  onConfigurationChange: (update: Partial<ModelConfiguration>) => void;
}) {
  const [animationCounter] = useState(() => Date.now());
  const { reasoning, speed } = configuration;
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    if (isMobile) {
      const timer0 = setTimeout(() => {
        setActiveTooltip("Context");
      }, 600);
      const timer1 = setTimeout(() => {
        setActiveTooltip("Cost");
      }, 2600);
      const timer2 = setTimeout(() => {
        setActiveTooltip(null);
      }, 4600);
      return () => {
        clearTimeout(timer0);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setActiveTooltip(null);
    }
  }, [isMobile]);

  const adjustedMetrics = useMemo(
    () => ({
      intelligence: clampMetric(
        model.metrics.intelligence + REASONING_INTELLIGENCE_DELTA[reasoning],
      ),
      speed: clampMetric(
        model.metrics.speed +
          (model.hasSpeedConfiguration ? SPEED_METRIC_DELTA[speed] : 0),
      ),
      context: model.metrics.context,
      cost: model.metrics.cost,
    }),
    [model.hasSpeedConfiguration, model.metrics, reasoning, speed],
  );
  const [isMetricsRevealed, setIsMetricsRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 3, filter: "blur(3px)" }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.97, y: 3, filter: "blur(3px)" }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="flex w-full flex-col divide-y divide-neutral-100 dark:divide-neutral-800"
    >
      <div className="flex flex-col gap-3 p-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <p className="font-medium text-neutral-900 text-sm dark:text-neutral-100">{model.label}</p>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-zinc-200/90 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 select-none">
              BETA 0.1
            </span>
          </div>
          <ProviderLabel
            className="text-neutral-500 text-xs dark:text-neutral-400"
            provider={model.provider}
          />
        </div>
        <p className="text-pretty text-neutral-500 text-xs leading-4 dark:text-neutral-400">
          {model.description}
        </p>
        {/* Benchmark metrics hidden safely but preserved */}
        {false && (
          <div className="relative mt-2 overflow-hidden rounded-lg p-1">
            <div
              className={cn(
                "grid grid-cols-2 gap-4 text-xs transition-all duration-300",
                !isMetricsRevealed && "blur-[6px] select-none opacity-25 pointer-events-none"
              )}
            >
              <MetricBar
                animationKey={`${model.value}-${animationCounter}`}
                label="Intelligence"
                value={adjustedMetrics.intelligence}
              />
              <MetricBar
                animationKey={`${model.value}-${animationCounter}`}
                label="Speed"
                value={adjustedMetrics.speed}
              />
              <MetricBar
                animationKey={`${model.value}-${animationCounter}`}
                info={`${model.contextWindow} context window`}
                label="Context"
                value={adjustedMetrics.context}
                forceOpenTooltip={activeTooltip === "Context"}
              />
              <MetricBar
                animationKey={`${model.value}-${animationCounter}`}
                info={model.inputPrice === "Free" && model.outputPrice === "Free" ? "Free" : `${model.inputPrice} input · ${model.outputPrice} output`}
                invert
                label="Cost"
                value={adjustedMetrics.cost}
                forceOpenTooltip={activeTooltip === "Cost"}
              />
            </div>

            {!isMetricsRevealed && (
              <div
                onClick={() => {
                  playSoftClick(0.04);
                  setIsMetricsRevealed(true);
                }}
                className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-10 cursor-pointer rounded-lg bg-white/40 dark:bg-neutral-900/40 backdrop-blur-[2px] transition-all hover:bg-white/60 dark:hover:bg-neutral-900/60"
              >
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900/90 dark:bg-neutral-100/90 text-white dark:text-neutral-900 shadow-md text-xs font-medium active:scale-95 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 18 18"
                    className="size-3 shrink-0"
                    fill="currentColor"
                  >
                    <path d="M3.025,5.623c.068,.204,.26,.342,.475,.342s.406-.138,.475-.342l.421-1.263,1.263-.421c.204-.068,.342-.259,.342-.474s-.138-.406-.342-.474l-1.263-.421-.421-1.263c-.137-.408-.812-.408-.949,0l-.421,1.263-1.263,.421c-.204,.068-.342,.259-.342,.474s.138,.406,.342,.474l1.263,.421,.421,1.263Z" />
                    <path d="M16.525,8.803l-4.535-1.793-1.793-4.535c-.227-.572-1.168-.572-1.395,0l-1.793,4.535-4.535,1.793c-.286,.113-.475,.39-.475,.697s.188,.584,.475,.697l4.535,1.793,1.793,4.535c.113,.286,.39,.474,.697,.474s.584-.188,.697-.474l1.793-4.535,4.535-1.793c.286-.113,.475-.39,.475-.697s-.188-.584-.475-.697Z" />
                  </svg>
                  <span>Telemetry Protected</span>
                </div>
                <p className="mt-1 text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                  Click to inspect benchmark metrics
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 p-3">
        <p className="font-mono font-medium text-[10px] text-neutral-500 uppercase leading-none dark:text-neutral-400">
          Configuration
        </p>
        <div className="flex flex-col gap-1">
          <ClaudeModelSelector
            value={LEVEL_TO_INDEX[reasoning] ?? 1}
            onLevelChange={(_level: EffortLevel, index: number) => {
              const nextReasoning = INDEX_TO_LEVEL[index] ?? "medium";
              onConfigurationChange({ reasoning: nextReasoning });
            }}
          />
        </div>
        {model.hasSpeedConfiguration ? (
          <div className="flex flex-col gap-2 pt-1">
            <p className="text-neutral-500 text-xs leading-none dark:text-neutral-400">Speed</p>
            <SegmentedRadio<SpeedLevel>
              ariaLabel="Speed"
              onValueChange={(speedValue) => {
                playSoftClick(0.04);
                onConfigurationChange({ speed: speedValue });
              }}
              options={[
                { label: "Standard", value: "standard" },
                { label: "Fast", value: "fast" },
              ]}
              value={speed}
            />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
});

function ModelListWithScrollFade({ children }: { children: ReactNode | ((item: any) => ReactNode) }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [showBottomFade, setShowBottomFade] = useState(false);
  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }
    let ticking = false;
    function updateBottomFade() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const el = listRef.current;
          if (el) {
            const { scrollTop, scrollHeight, clientHeight } = el;
            setShowBottomFade(scrollHeight - scrollTop - clientHeight > 4);
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    updateBottomFade();
    list.addEventListener("scroll", updateBottomFade, { passive: true });
    const resizeObserver = new ResizeObserver(updateBottomFade);
    resizeObserver.observe(list);
    return () => {
      list.removeEventListener("scroll", updateBottomFade);
      resizeObserver.disconnect();
    };
  }, []);
  return (
    <div className="relative">
      <Combobox.List
        className="max-h-64 overflow-y-auto overscroll-contain p-1"
        ref={listRef}
      >
        {children}
      </Combobox.List>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-white to-transparent transition-opacity duration-150 dark:from-neutral-900",
          showBottomFade ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

const ModelComboboxItem = memo(function ModelComboboxItem({
  model,
  configuration,
  previewHandle,
}: {
  model: LlmModel;
  configuration: ModelConfiguration;
  previewHandle: PreviewCard.Handle<string>;
}) {
  return (
    <Combobox.Item
      className="group w-full p-0 text-neutral-700 data-[selected]:text-neutral-900 dark:text-neutral-300 dark:data-[selected]:text-neutral-100"
      value={model}
    >
      <PreviewCard.Trigger
        id={model.value}
        className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/60 group-data-[selected]:bg-neutral-100 dark:group-data-[selected]:bg-neutral-800"
        closeDelay={180}
        delay={0}
        handle={previewHandle}
        payload={model.value}
        render={<div />}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-medium">{model.label}</span>
          <ProviderLabel
            className="text-neutral-500 text-xs dark:text-neutral-400"
            provider={model.provider}
          />
        </div>
        <ModelConfigurationBadge configuration={configuration} model={model} />
      </PreviewCard.Trigger>
    </Combobox.Item>
  );
});



export function ModelSelectorPrompt({
  className,
  configurations,
  defaultConfigurations = {},
  defaultPrompt = "",
  defaultValue,
  disabled = false,
  models = DEFAULT_LLM_MODELS,
  onConfigurationChange,
  onModelChange,
  onPromptChange,
  onSubmit,
  placeholder = "What do you want to do?",
  prompt,
  value,
}: ModelSelectorPromptProps = {}) {
  const fallbackModel = models[0] ?? DEFAULT_MODEL;
  const [uncontrolledModelValue, setUncontrolledModelValue] = useState(
    defaultValue ?? fallbackModel.value,
  );
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [uncontrolledConfigurations, setUncontrolledConfigurations] = useState<
    Record<string, ModelConfiguration>
  >(defaultConfigurations);
  const [uncontrolledPrompt, setUncontrolledPrompt] = useState(defaultPrompt);
  const selectedModelValue = value ?? uncontrolledModelValue;
  const selectedModel =
    models.find((model) => model.value === selectedModelValue) ?? fallbackModel;
  const modelConfigurations = configurations ?? uncontrolledConfigurations;
  const promptValue = prompt ?? uncontrolledPrompt;
  const previewHandle = useMemo(() => PreviewCard.createHandle<string>(), []);
  const [previewOpenCounter, setPreviewOpenCounter] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [internalSending, setInternalSending] = useState(false);
  const isSending = internalSending || Boolean(disabled);
  const isSendingRef = useRef(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  };

  const [textareaHeight, setTextareaHeight] = useState(64);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = ""; // Reset to let framer-motion animate it

    const minHeight = isExpanded ? 64 : 44;
    const maxHeight = 200;
    const nextHeight = Math.min(maxHeight, Math.max(minHeight, scrollHeight));

    setTextareaHeight(nextHeight);
  }, [promptValue, isExpanded]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Intentionally left blank so it never collapses
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Trigger a brief scrollbar visibility indicator when the text overflows (load/type)
  useEffect(() => {
    const timer = setTimeout(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const hasOverflow = textarea.scrollHeight > textarea.clientHeight;
      if (hasOverflow) {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 1500);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [promptValue]);

  const showToolbar = isExpanded || promptValue.length > 0;

  function updateModelConfiguration(
    modelValue: string,
    update: Partial<ModelConfiguration>,
  ) {
    const previous = modelConfigurations;
    const nextConfiguration = {
      ...getModelConfiguration(previous, modelValue),
      ...update,
    };
    const nextConfigurations = {
      ...previous,
      [modelValue]: nextConfiguration,
    };
    if (!configurations) {
      setUncontrolledConfigurations(nextConfigurations);
    }
    onConfigurationChange?.(modelValue, nextConfiguration, nextConfigurations);
  }
  function updateSelectedModel(model: LlmModel) {
    if (!value) {
      setUncontrolledModelValue(model.value);
    }
    onModelChange?.(model);
  }
  function updatePrompt(nextPrompt: string) {
    if (prompt === undefined) {
      setUncontrolledPrompt(nextPrompt);
    }
    onPromptChange?.(nextPrompt);
  }
  async function handleSubmit() {
    if (!promptValue.trim() || isSendingRef.current || disabled) return;
    isSendingRef.current = true;
    
    // Capture the prompt before clearing it
    const currentPrompt = promptValue;
    
    // Clear instantly from the UI and start wave animation
    updatePrompt("");
    setInternalSending(true);

    let nextCount = messageCount + 1;
    if (nextCount > 40) {
      // Simulate real-time decrease when reaching limit
      nextCount = 35;
    }
    setMessageCount(nextCount);

    try {
      await onSubmit?.({
        configuration: getModelConfiguration(
          modelConfigurations,
          selectedModel.value,
        ),
        configurations: modelConfigurations,
        model: selectedModel,
        prompt: currentPrompt,
      });
    } finally {
      setInternalSending(false);
      isSendingRef.current = false;
    }
  }
  function closeModelPreview() {
    previewHandle.close();
  }

  const contextWindowStr = selectedModel.contextWindow || "1M";
  const maxTokens = contextWindowStr.toUpperCase().includes("M")
    ? (parseFloat(contextWindowStr.replace(/[^\d.]/g, "")) || 1) * 1000000
    : (parseInt(contextWindowStr.replace(/\D/g, "")) || 128) * 1000;

  return (
    <div
      ref={containerRef}
      onClick={() => setIsExpanded(true)}
      className={cn(
        "relative mx-auto flex w-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 pointer-events-auto",
        className || "max-w-md",
      )}
    >
      <AnimatePresence>
        {isSending && <SendWave />}
      </AnimatePresence>

      {/* Morphing Expanded Loader Overlay */}
      <AnimatePresence>
        {isSending && (
          <motion.div
            key="send-morph-expansion"
            initial={{
              opacity: 0,
              scale: 0.85,
              clipPath: "inset(40% 5% 5% 65% round 12px)",
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 12px)",
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              scale: 0.85,
              clipPath: "inset(40% 5% 5% 65% round 12px)",
              filter: "blur(10px)",
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
              mass: 0.85,
            }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.6, opacity: 0, y: 8 }}
              transition={{ delay: 0.08, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center gap-2.5"
            >
              <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-0 outline-none shadow-none">
                <MobiusLoopIcon className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                <div className="absolute inset-0 rounded-2xl animate-pulse bg-neutral-200/50 dark:bg-neutral-700/50 pointer-events-none" />
              </div>
              <div className="flex flex-col items-center gap-0.5 text-center">
                <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">
                  Wait...
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                  Formulating response with Sync AI
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="relative z-20 w-full"
        animate={{
          filter: isSending ? "blur(8px)" : "blur(0px)",
          opacity: isSending ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.textarea
          rows={1}
          ref={textareaRef}
          onScroll={handleScroll}
          onFocus={() => setIsExpanded(true)}
          className={cn(
            "w-full resize-none bg-transparent pl-5 pr-14 py-4 font-medium text-sm outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-60 dark:placeholder:text-neutral-500 prompt-scrollbar overflow-auto",
            isScrolling && "is-scrolling",
            "text-neutral-900 dark:text-neutral-100"
          )}
          initial={false}
          animate={{ height: textareaHeight }}
          transition={{ duration: 0.3, type: "spring", stiffness: 350, damping: 25 }}
          disabled={disabled || isSending}
          onChange={(event) => {
            playKeyTick(0.015);
            updatePrompt(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder}
          value={promptValue}
        />
      </motion.div>
      <AnimatePresence initial={false}>
        {showToolbar && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 350, damping: 25 }}
            className="overflow-hidden"
          >
            <div className="flex w-full flex-row items-center justify-between gap-1 sm:gap-2 p-1 sm:p-2 pt-6">
              <motion.div 
                className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2"
                animate={{
                  opacity: isSending ? 0 : 1,
                  filter: isSending ? "blur(8px)" : "blur(0px)",
                  scale: isSending ? 0.95 : 1,
                  x: isSending ? -8 : 0,
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ pointerEvents: isSending ? "none" : "auto" }}
              >
                <PreviewCard.Root<string>
                  handle={previewHandle}
                  onOpenChange={(open) => {
                    if (open) {
                      setPreviewOpenCounter((c) => c + 1);
                    }
                  }}
                >
                  {({ payload }) => (
                    <>
                      <Popover
                        side="top"
                        align="start"
                        sideOffset={8}
                        panelRadius={14}
                        gooStrength={0}
                        blobClassName="bg-white dark:bg-neutral-900 border-0 outline-none"
                        open={modelDropdownOpen}
                        onOpenChange={(open) => {
                          setModelDropdownOpen(open);
                          if (!open) {
                            previewHandle.close();
                          }
                        }}
                      >
                        <PopoverTrigger>
                          <button
                            type="button"
                            aria-label="Select model"
                            className="group flex min-w-0 items-center gap-1.5 rounded-lg border-0 outline-none bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-2.5 py-1.5 text-neutral-900 text-xs sm:text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 dark:text-neutral-100 cursor-pointer shadow-none"
                            disabled={disabled}
                          >
                            <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                              <span className="flex min-w-0 items-center gap-1.5">
                                <ProviderIcon
                                  className="size-3.5 shrink-0"
                                  provider={selectedModel.provider}
                                />
                                <span className="truncate font-medium">{selectedModel.label}</span>
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-zinc-200/90 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 select-none">
                                  BETA 0.1
                                </span>
                              </span>
                              <ModelConfigurationBadge
                                configuration={getModelConfiguration(
                                  modelConfigurations,
                                  selectedModel.value,
                                )}
                                model={selectedModel}
                              />
                            </span>
                            <span className="text-neutral-500 dark:text-neutral-400">
                              <CaretDownIcon
                                size={14}
                                weight="bold"
                                className={cn(
                                  "transition-transform duration-200 ease-in-out",
                                  modelDropdownOpen && "rotate-180"
                                )}
                              />
                            </span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className={cn(
                          "p-0 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden text-neutral-900 dark:text-neutral-100",
                          isMobile ? "w-[min(20rem,calc(100vw-2rem))] max-h-[85vh] overflow-y-auto" : "w-64"
                        )}>
                          {(() => {
                            const activeModel =
                              models.find(
                                (m) =>
                                  m.value === (payload ?? selectedModel.value),
                              ) ?? selectedModel;
                            return (
                              <Combobox.Root<LlmModel>
                                autoHighlight
                                isItemEqualToValue={(item, nextValue) =>
                                  item.value === nextValue.value
                                }
                                items={models}
                                onInputValueChange={closeModelPreview}
                                onValueChange={(nextModel) => {
                                  if (nextModel) {
                                    playSoftClick(0.04);
                                    updateSelectedModel(nextModel);
                                    setModelDropdownOpen(false);
                                  }
                                }}
                                value={selectedModel}
                              >
                                {/* Mobile / Tablet: render model details on top inside the modal card */}
                                {isMobile && (
                                  <div className="overflow-hidden border-b border-neutral-100 dark:border-neutral-800">
                                    <ModelPreviewPanel
                                      key={`${activeModel.value}-${previewOpenCounter}`}
                                      configuration={getModelConfiguration(
                                        modelConfigurations,
                                        activeModel.value,
                                      )}
                                      model={activeModel}
                                      onConfigurationChange={(update) =>
                                        updateModelConfiguration(
                                          activeModel.value,
                                          update,
                                        )
                                      }
                                    />
                                  </div>
                                )}
                                <Combobox.InputGroup className="flex items-center gap-1.5 rounded-none border-0 border-b border-neutral-100 bg-transparent px-2.5 dark:border-neutral-800">
                                  <Combobox.Input
                                    className="w-full bg-transparent px-0 py-2 text-sm outline-none placeholder:text-neutral-400 dark:text-neutral-100"
                                    onFocus={closeModelPreview}
                                    placeholder="Search models..."
                                  />
                                  <MagnifyingGlassIcon
                                    aria-hidden="true"
                                    className="shrink-0 text-neutral-400"
                                    size={14}
                                    weight="bold"
                                  />
                                </Combobox.InputGroup>
                                <Combobox.Empty>
                                  <div className="flex flex-col gap-1 px-2 py-2 text-center font-medium text-neutral-500 text-xs">
                                    No models found
                                    <div className="text-pretty text-center text-neutral-400 text-xs">
                                      Maybe try a different search.
                                    </div>
                                  </div>
                                </Combobox.Empty>
                                <ModelListWithScrollFade>
                                  {(model: LlmModel) => (
                                    <ModelComboboxItem
                                      configuration={getModelConfiguration(
                                        modelConfigurations,
                                        model.value,
                                      )}
                                      key={model.value}
                                      model={model}
                                      previewHandle={previewHandle}
                                    />
                                  )}
                                </ModelListWithScrollFade>
                              </Combobox.Root>
                            );
                          })()}
                        </PopoverContent>
                      </Popover>

                      {/* Desktop: render details as floating portal to the right only when popover is open */}
                      {!isMobile && modelDropdownOpen ? (
                        <PreviewCard.Portal>
                          <PreviewCard.Positioner
                            align="center"
                            className="z-[9999]"
                            side="right"
                            sideOffset={10}
                          >
                            <PreviewCard.Popup
                              id="model-preview-popup"
                              className="w-64 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 origin-left transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] data-[starting-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:-translate-x-3 data-[starting-style]:blur-[4px] data-[ending-style]:opacity-0 data-[ending-style]:scale-90 data-[ending-style]:translate-x-1 data-[ending-style]:blur-[4px]"
                            >
                              {payload ? (
                                <ModelPreviewPanel
                                  key={`${payload}-${previewOpenCounter}`}
                                  configuration={getModelConfiguration(
                                    modelConfigurations,
                                    payload,
                                  )}
                                  model={
                                    models.find((m) => m.value === payload) ??
                                    fallbackModel
                                  }
                                  onConfigurationChange={(update) =>
                                    updateModelConfiguration(payload, update)
                                  }
                                />
                              ) : null}
                            </PreviewCard.Popup>
                          </PreviewCard.Positioner>
                        </PreviewCard.Portal>
                      ) : null}
                    </>
                  )}
                </PreviewCard.Root>
              </motion.div>
              <Button
                disabled={disabled || isSending}
                onClick={() => {
                  void handleSubmit();
                }}
                type="button"
                className={cn(
                  "shrink-0 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 relative overflow-hidden h-8 sm:h-9 text-xs sm:text-sm flex items-center justify-center px-2.5 sm:px-4 transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] border-0 outline-none shadow-none",
                  isSending
                    ? "w-24 sm:w-28 bg-neutral-100 dark:bg-neutral-800/90"
                    : "w-20 sm:w-24"
                )}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {!(isSending || disabled) ? (
                    <motion.div
                      key="send"
                      initial={{ y: -16, opacity: 0, filter: "blur(6px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: 16, opacity: 0, filter: "blur(6px)" }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-1.5 font-medium"
                    >
                      <PaperPlaneTiltIcon size={14} weight="fill" />
                      <span>Send</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="wait"
                      initial={{ y: -16, opacity: 0, filter: "blur(6px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: 16, opacity: 0, filter: "blur(6px)" }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-2 font-medium"
                    >
                      <MobiusLoopIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      <span className="text-neutral-600 dark:text-neutral-300 font-medium text-xs">
                        Wait...
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ModelSelectorPrompt;
