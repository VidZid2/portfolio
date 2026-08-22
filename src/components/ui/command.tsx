"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
} from "@/components/ui/dialog"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-50 flex h-full w-full flex-col overflow-hidden rounded-md focus:outline-none focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
}

import { AnimatePresence, motion } from "framer-motion"
import { createPortal } from "react-dom"
import { useMediaQuery } from "@/hooks/use-media-query"
import { BottomSheet } from "@/components/ui/bottom-sheet"

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  value,
  onValueChange,
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  value?: string
  onValueChange?: (value: string) => void
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [mounted, setMounted] = React.useState(false)
  const enterY = 20;
  const enterScale = 0.97;
  const SPRING_PANEL = { type: "spring", stiffness: 350, damping: 25 } as any;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Radix used to own Escape-to-close; the custom portal must handle it.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onOpenChange?.(false);
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open, onOpenChange]);

  if (!mounted) return null;

  if (!isDesktop) {
    return (
      <BottomSheet open={!!open} onOpenChange={onOpenChange!} snapPoints={["auto"]}>
        <Command value={value} onValueChange={onValueChange} className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </BottomSheet>
    )
  }

  return createPortal(
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[9999]",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      <AnimatePresence initial={false}>
        {open && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0, transition: { duration: 0.2 } }}
             onClick={() => onOpenChange?.(false)}
             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
           />
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: enterY, scale: enterScale }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: enterY,
                scale: 0.98,
                transition: { duration: 0.18 },
              }}
              transition={SPRING_PANEL}
              className={cn(
                "pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] shadow-2xl will-change-transform focus:outline-none focus-visible:outline-none z-10",
                className
              )}
            >
              <Command value={value} onValueChange={onValueChange} className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                {children}
              </Command>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>,
    document.body
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-zinc-500 dark:placeholder:text-zinc-400 flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto transition-[height] duration-300 ease-out will-change-[height] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        className
      )}
      style={{ height: "var(--cmdk-list-height)" }}
      {...props}
    />
  )
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-zinc-900 dark:text-zinc-50 [&_[cmdk-group-heading]]:text-zinc-500 dark:[&_[cmdk-group-heading]]:text-zinc-400 overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-4 w-[calc(100%+2rem)] h-0 border-b border-zinc-200 dark:border-zinc-800", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "data-[selected=true]:text-zinc-900 dark:data-[selected=true]:text-zinc-50 [&_svg:not([class*='text-'])]:text-zinc-500 dark:[&_svg:not([class*='text-'])]:text-zinc-400 relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-zinc-500 dark:text-zinc-400 ml-auto text-xs tracking-widest hidden sm:inline-block",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
