"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    FileText,
    Moon,
    Sun,
    Laptop,
    Code,
    ArrowUp,
    ArrowDown,
    CornerDownLeft,
    Copy,
    Briefcase,
    GraduationCap,
    BookOpen,
    Search
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { createPortal } from "react-dom"
import dynamic from "next/dynamic"
import { Swirling } from "@/components/loading-ui/swirling"
import { HandwritingText } from "@/components/ui/handwriting-text"

function AiLoadingFallback() {
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/40 dark:bg-zinc-950/60 backdrop-blur-md pointer-events-auto">
      <Swirling className="size-8 text-zinc-900 dark:text-zinc-100" />
    </div>,
    document.body
  );
}

const PromptBoxPreview = dynamic(
  () => import("@/components/prompt-box-preview").then((mod) => mod.PromptBoxPreview),
  { 
    ssr: false,
    loading: () => <AiLoadingFallback />
  }
)

const preloadPromptBox = () => {
    import("@/components/prompt-box-preview");
};
import { useArcReveal } from "@/components/ruixen/arc-reveal-hero"
import { JapaneseAsciiText } from "@/components/ui/japanese-ascii-text"
import { playCommandMenuOpen, playListSelect } from "@/lib/synth-sounds"

declare global {
  interface WindowEventMap {
    "open-ai": CustomEvent<{ initialQuery?: string }>;
  }
}

/** One command-palette row: everything that varies between entries. */
interface PaletteCommandConfig {
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    shortcut: string;
    action: () => unknown;
}

/** Shared row skeleton for every palette entry (hover pill, icon, label, shortcut). */
function PaletteCommandItem({
    command,
    runCommand,
    selected,
}: {
    command: PaletteCommandConfig;
    runCommand: (command: () => unknown) => void;
    selected: string;
}) {
    const Icon = command.icon;
    return (
        <CommandItem value={command.value} onSelect={() => runCommand(command.action)} className="relative rounded-lg py-3 cursor-pointer">
            {selected === command.value && <motion.div layoutId="cmdk-hover" className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg z-0" transition={{ type: "spring", bounce: 0.2, duration: 0.3 }} />}
            <div className="relative z-10 flex items-center w-full">
                <Icon className="mr-2 h-4 w-4 text-zinc-500" />
                <span>{command.label}</span>
                <CommandShortcut className="font-mono text-[10px] bg-white/50 dark:bg-black/50 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">{command.shortcut}</CommandShortcut>
            </div>
        </CommandItem>
    );
}

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        if (open) {
            playCommandMenuOpen(0.035);
        }
    }, [open]);
    const [aiOpen, setAiOpen] = React.useState(false)
    const [initialAiQuery, setInitialAiQuery] = React.useState("")
    const [showTooltip, setShowTooltip] = React.useState(false)
    const phase = useArcReveal()
    const router = useRouter()
    const pathname = usePathname()

    const navigateToSection = (hash: string) => {
        if (pathname === "/") {
            window.location.hash = hash;
        } else {
            router.push(`/${hash}`);
        }
    };

    // Eagerly prefetch Ask AI bundle on mount so opening is 0ms instant
    React.useEffect(() => {
        if (typeof window === "undefined") return;
        const prefetch = () => {
            import("@/components/prompt-box-preview");
        };
        const timer = setTimeout(prefetch, 250);
        return () => clearTimeout(timer);
    }, []);

    React.useEffect(() => {
        const handleOpenAi = (e: CustomEvent<{ initialQuery?: string }>) => {
            if (e.detail?.initialQuery) {
                setInitialAiQuery(e.detail.initialQuery);
            } else {
                setInitialAiQuery("");
            }
            setAiOpen(true);
        };
        window.addEventListener("open-ai", handleOpenAi);
        return () => window.removeEventListener("open-ai", handleOpenAi);
    }, []);

    React.useEffect(() => {
        if (phase !== "done") return
        const timer1 = setTimeout(() => setShowTooltip(true), 500)
        const timer2 = setTimeout(() => setShowTooltip(false), 5500)
        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
        }
    }, [phase])

    const dismissTooltip = () => {
        if (showTooltip) {
            setShowTooltip(false)
        }
    }
    const [value, setValue] = React.useState("experience")
    const { setTheme } = useTheme()

    const openExternal = React.useCallback((url: string) => {
        const opened = window.open(url, "_blank", "noopener,noreferrer")
        if (!opened) window.location.assign(url)
    }, [])

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        playListSelect(0.04)
        setOpen(false)
        command()
    }, [])

    // Palette entries — one config object per row. The render skeleton lives in
    // <PaletteCommandItem>; only value/icon/label/shortcut/action vary.
    // To re-enable the Open Source row, uncomment it below (its shift+O
    // keydown handler is already wired in the shortcut effect).
    const SECTION_COMMANDS: PaletteCommandConfig[] = [
        { value: "experience", icon: Briefcase, label: "Experience", shortcut: "shift + E", action: () => navigateToSection("#experience") },
        { value: "education", icon: GraduationCap, label: "Education", shortcut: "shift + U", action: () => navigateToSection("#education") },
        { value: "projects", icon: Code, label: "Projects", shortcut: "shift + P", action: () => navigateToSection("#projects") },
        { value: "blogs", icon: FileText, label: "Blogs", shortcut: "shift + B", action: () => navigateToSection("#blogs") },
        // { value: "opensource", icon: SiGithub, label: "Open Source", shortcut: "shift + O", action: () => navigateToSection("#opensource") },
        { value: "skills", icon: BookOpen, label: "Skills", shortcut: "shift + S", action: () => navigateToSection("#skills") },
    ]

    const GENERAL_COMMANDS: PaletteCommandConfig[] = [
        { value: "copylink", icon: Copy, label: "Copy Link", shortcut: "shift + C", action: () => navigator.clipboard.writeText(window.location.href) },
    ]

    const THEME_COMMANDS: PaletteCommandConfig[] = [
        { value: "lightmode", icon: Sun, label: "Light Mode", shortcut: "shift + T", action: () => setTheme("light") },
        { value: "darkmode", icon: Moon, label: "Dark Mode", shortcut: "shift + D", action: () => setTheme("dark") },
        { value: "system", icon: Laptop, label: "System", shortcut: "shift + Y", action: () => setTheme("system") },
    ]

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isTypingField =
                target.isContentEditable ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'SELECT'

            if (!open) {
                return
            }

            // When the command palette is open, we still want shortcuts to work
            // even if the search input is focused.
            if (e.shiftKey) {
                const key = e.key.toLowerCase()

                // Navigation
                if (key === 'e') {
                    e.preventDefault()
                    runCommand(() => window.location.hash = "#experience")
                } else if (key === 'p') {
                    e.preventDefault()
                    runCommand(() => window.location.hash = "#projects")
                } else if (key === 'b') {
                    e.preventDefault()
                    runCommand(() => window.location.hash = "#blogs")
                } else if (key === 'o') {
                    e.preventDefault()
                    runCommand(() => window.location.hash = "#opensource")
                } else if (key === 's') {
                    e.preventDefault()
                    runCommand(() => window.location.hash = "#skills")
                }

                // General
                else if (key === 'c') {
                    e.preventDefault()
                    runCommand(() => navigator.clipboard.writeText(window.location.href))
                }

                // Theme
                else if (key === 't') {
                    e.preventDefault()
                    runCommand(() => setTheme("light"))
                } else if (key === 'd') {
                    e.preventDefault()
                    runCommand(() => setTheme("dark"))
                } else if (key === 'y') {
                    e.preventDefault()
                    runCommand(() => setTheme("system"))
                }
            } else if (isTypingField) {
                // Allow normal typing when no shortcut is being used
                return
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [open, openExternal, runCommand, setTheme])

    return (
        <div 
            className="relative flex items-center gap-2.5 sm:gap-3 mx-1 sm:mx-0"
            onMouseEnter={dismissTooltip}
            onClick={dismissTooltip}
            onTouchStart={dismissTooltip}
        >
            <button 
                onClick={() => setOpen(true)}
                className="relative group cursor-pointer transition-all duration-300 active:scale-95 shrink-0"
                aria-label="Search portfolio"
            >
                {/* Outer border wrapper matching View All style */}
                <div className="absolute -inset-[4.5px] border border-black/5 dark:border-white/5 rounded-[9px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
                
                <div className="relative flex items-center justify-center gap-1.5 w-[34px] sm:w-auto px-0 sm:px-3 h-[21px] bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[5px] text-[11px] font-medium transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80 font-mono whitespace-nowrap shrink-0">
                    <Search className="w-3.5 h-3.5 sm:hidden" />
                    <span className="hidden sm:inline leading-none mt-[0.5px]">⌘</span>
                    <span className="hidden sm:inline leading-none mt-[0.5px]">K</span>
                </div>
            </button>

            <div className="relative group/ai inline-flex items-center">
                {/* Handwritten Annotation: talk to my AI / ask me anything pointing to Ask AI - PC only */}
                <div className="absolute left-full ml-4 sm:ml-6 -top-16 sm:-top-18 hidden xl:flex flex-col items-start pointer-events-none select-none z-30 min-w-max">
                    <div className="flex flex-col items-start text-left font-medium text-zinc-600 dark:text-zinc-400 select-none -rotate-[6deg] tracking-wide ml-2 gap-0.5">
                        <HandwritingText text="talk to my AI" delay={0.2} duration={1.2} height="19px" />
                        <HandwritingText text="ask me anything" delay={0.9} duration={1.3} height="19px" />
                    </div>
                    <svg
                        width="54"
                        height="38"
                        viewBox="0 0 54 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-zinc-400 dark:text-zinc-500 overflow-visible mt-2"
                    >
                        {/* Deep organic J/U-curve starting on right under anything and sweeping left into Ask AI button */}
                        <motion.path
                            d="M 48 2 C 50 18, 22 32, -14 30"
                            stroke="currentColor"
                            strokeWidth="1.35"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 1.6, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M -5 24 L -14 30 L -6 36"
                            stroke="currentColor"
                            strokeWidth="1.35"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: 2.2, ease: "easeOut" }}
                        />
                    </svg>
                </div>

                <button 
                    onClick={() => setAiOpen(true)}
                    onMouseEnter={preloadPromptBox}
                    onTouchStart={preloadPromptBox}
                    className="relative group cursor-pointer transition-all duration-300 active:scale-95 shrink-0"
                    aria-label="Ask AI Assistant"
                >
                    {/* Outer border wrapper matching View All style */}
                    <div className="absolute -inset-[4.5px] border border-black/5 dark:border-white/5 rounded-[9px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
                    
                    <div className="relative flex items-center justify-center w-[34px] sm:w-[72px] h-[21px] bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-[#6495ED] dark:text-[#6495ED] hover:text-[#4b7deb] dark:hover:text-[#87afff] rounded-[5px] text-[11px] font-bold transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80 font-mono whitespace-nowrap shrink-0">
                        <span className="leading-none mt-[0.5px] whitespace-nowrap hidden sm:inline-flex">
                            <JapaneseAsciiText text="Ask AI" duration={3000} idleScramble={true} />
                        </span>
                        <span className="leading-none mt-[0.5px] whitespace-nowrap inline-flex sm:hidden">
                            <JapaneseAsciiText text="AI" duration={3000} idleScramble={true} />
                        </span>
                    </div>
                </button>
            </div>

            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-full mb-3 sm:bottom-auto sm:top-full sm:mb-0 sm:mt-3 right-0 sm:-right-12 z-50 flex flex-col items-end pointer-events-none"
                    >
                        <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium px-3.5 py-2.5 rounded-[10px] shadow-xl whitespace-nowrap">
                            <span className="hidden sm:inline">Press ⌘K <b>(CTRL + K)</b> or Click Ask AI to explore</span>
                            <span className="inline sm:hidden">Tap to explore or Ask AI</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CommandDialog open={open} onOpenChange={setOpen} value={value} onValueChange={setValue}>
                {/* Header Section */}
                <div className="flex items-center gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
                        <LayoutDashboard className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Navigation Menu</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Quickly jump to sections or actions</p>
                    </div>
                </div>

                <CommandInput placeholder="Search for actions..." className="border-none focus:ring-0" />

                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Sections">
                        {SECTION_COMMANDS.map((command) => (
                            <PaletteCommandItem key={command.value} command={command} runCommand={runCommand} selected={value} />
                        ))}
                    </CommandGroup>

                    <CommandSeparator className="my-2" />

                    <CommandGroup heading="General">
                        {GENERAL_COMMANDS.map((command) => (
                            <PaletteCommandItem key={command.value} command={command} runCommand={runCommand} selected={value} />
                        ))}
                    </CommandGroup>

                    <CommandSeparator className="my-2" />

                    <CommandGroup heading="Theme">
                        {THEME_COMMANDS.map((command) => (
                            <PaletteCommandItem key={command.value} command={command} runCommand={runCommand} selected={value} />
                        ))}
                    </CommandGroup>
                </CommandList>

                {/* Footer */}
                <div className="hidden sm:flex items-center justify-between px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                        <div className="flex items-center gap-1">
                            <ArrowUp className="w-3 h-3" />
                            <ArrowDown className="w-3 h-3" />
                            <span>to navigate</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CornerDownLeft className="w-3 h-3" />
                            <span>to select</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <span className="font-mono">esc</span>
                        <span>to close</span>
                    </div>
                </div>
            </CommandDialog>

            <AnimatePresence>
                {aiOpen && <PromptBoxPreview onClose={() => setAiOpen(false)} initialQuery={initialAiQuery} />}
            </AnimatePresence>
        </div>
    )
}
