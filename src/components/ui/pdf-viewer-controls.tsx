"use client"

import * as React from "react"
import {
  Download01Icon,
  MoreHorizontalIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Popover as MotionPopover,
  PopoverContent as MotionPopoverContent,
  PopoverTrigger as MotionPopoverTrigger,
} from "@/components/motion/popover"
import { SharedLayoutBg } from "@/components/motion/shared-layout-bg"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { playSoftClick } from "@/lib/synth-sounds"

/**
 * Self-contained PDF viewer toolbar controls, extracted from pdf-viewer.tsx
 * (zero logic changes). `ZOOM_OPTIONS` is shared with the zoom plugin wiring
 * inside pdf-viewer.tsx.
 */

export const ZOOM_OPTIONS = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]

export function PDFViewerFileActionsMenu({
  downloadDisabled,
  isPreparingDownload = false,
  onDownload,
  onUploadFile,
  showDownload = false,
  showUpload = false,
}: {
  downloadDisabled?: boolean
  isPreparingDownload?: boolean
  onDownload?: () => void
  onUploadFile?: (file: File) => void
  showDownload?: boolean
  showUpload?: boolean
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  if (!showDownload && !showUpload) return null

  return (
    <>
      {showUpload && onUploadFile ? (
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            const nextFile = event.target.files?.[0]

            if (nextFile) {
              onUploadFile(nextFile)
              event.currentTarget.value = ""
            }
          }}
        />
      ) : null}
      <MotionPopover
        align="end"
        side="bottom"
        sideOffset={14}
        panelRadius={8}
        gooStrength={5}
        blobClassName="bg-neutral-200/80 dark:bg-neutral-800/90 border-0 outline-none shadow-lg dark:shadow-2xl"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <MotionPopoverTrigger>
              <button
                type="button"
                aria-label="More options"
                onClick={() => playSoftClick(0.04)}
                className="relative flex items-center justify-center size-7 rounded-[8px] bg-neutral-200/80 dark:bg-neutral-800/90 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-150 border-0 outline-none select-none cursor-pointer shadow-none p-0"
              >
                <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4 pointer-events-none" />
              </button>
            </MotionPopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="hidden md:flex z-[99999]">
            More options
          </TooltipContent>
        </Tooltip>
        <MotionPopoverContent className="p-0 min-w-[110px] bg-transparent text-neutral-900 dark:text-neutral-100 border-0 outline-none shadow-none">
          {showDownload && onDownload ? (
            <button
              type="button"
              disabled={downloadDisabled}
              onClick={() => {
                playSoftClick(0.04)
                onDownload()
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors duration-150 select-none cursor-pointer outline-none border-0 bg-transparent rounded-[8px]"
            >
              {isPreparingDownload ? (
                <Spinner className="size-4" />
              ) : (
                <HugeiconsIcon icon={Download01Icon} className="size-4" />
              )}
              <span>Download</span>
            </button>
          ) : null}
          {showUpload && onUploadFile ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors duration-150 select-none cursor-pointer outline-none border-0 bg-transparent rounded-[8px]"
            >
              <HugeiconsIcon icon={Upload01Icon} className="size-4" />
              <span>Upload</span>
            </button>
          ) : null}
        </MotionPopoverContent>
      </MotionPopover>
    </>
  )
}

export function PDFViewerZoomDropdownControl({
  currentZoomLevel,
  controlsDisabled,
  onZoomChange,
}: {
  currentZoomLevel: number
  controlsDisabled?: boolean
  onZoomChange?: (zoom: number) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <MotionPopover
      open={open}
      onOpenChange={setOpen}
      align="center"
      side="bottom"
      sideOffset={14}
      panelRadius={8}
      gooStrength={5}
      blobClassName="bg-neutral-200/80 dark:bg-neutral-800/90 border-0 outline-none shadow-lg dark:shadow-2xl"
    >
      <MotionPopoverTrigger>
        <button
          type="button"
          disabled={controlsDisabled}
          onClick={() => playSoftClick(0.04)}
          className="relative flex items-center justify-between gap-1.5 h-7 px-2.5 rounded-[8px] bg-neutral-200/80 dark:bg-neutral-800/90 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors duration-150 border-0 outline-none select-none cursor-pointer shadow-none w-[78px]"
        >
          <span>{Math.round(currentZoomLevel * 100)}%</span>
          <ChevronDown className="size-3.5 opacity-60 pointer-events-none" />
        </button>
      </MotionPopoverTrigger>
      <MotionPopoverContent className="p-1 min-w-[96px] flex flex-col gap-0.5 bg-transparent text-neutral-900 dark:text-neutral-100 border-0 outline-none shadow-none">
        <SharedLayoutBg
          pillClassName="bg-black/10 dark:bg-white/15 rounded-[6px]"
          inset={0}
          className="gap-0.5"
        >
          {ZOOM_OPTIONS.map((option) => {
            const isSelected = Math.abs(option - currentZoomLevel) < 0.01
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  playSoftClick(0.04)
                  onZoomChange?.(option)
                  setOpen(false)
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-colors duration-150 select-none cursor-pointer outline-none border-0 bg-transparent",
                  isSelected
                    ? "text-neutral-950 dark:text-white font-semibold"
                    : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white"
                )}
              >
                <span>{Math.round(option * 100)}%</span>
                {isSelected && <Check className="size-3.5 text-neutral-900 dark:text-white shrink-0 ml-2" />}
              </button>
            )
          })}
        </SharedLayoutBg>
      </MotionPopoverContent>
    </MotionPopover>
  )
}

export function PDFViewerPageNumberControl({
  activePage,
  controlsDisabled,
  numPages,
  onPageChange,
}: {
  activePage: number
  controlsDisabled: boolean
  numPages: number
  onPageChange: (pageNumber: number) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const displayPage = numPages ? activePage : 1
  const [isEditing, setIsEditing] = React.useState(false)
  const [draftPage, setDraftPage] = React.useState(() => String(displayPage))

  React.useEffect(() => {
    if (!isEditing) return

    inputRef.current?.focus()
    inputRef.current?.select()
  }, [isEditing])

  const applyPageDraft = React.useCallback(
    (value: string) => {
      const trimmedValue = value.trim()

      if (!trimmedValue) return

      const parsedPage = Number(trimmedValue)

      if (!Number.isInteger(parsedPage)) return

      onPageChange(Math.min(Math.max(parsedPage, 1), Math.max(numPages, 1)))
    },
    [numPages, onPageChange]
  )

  return (
    <div className="flex items-center gap-1 text-sm whitespace-nowrap text-primary">
      <span>Page</span>
      {isEditing ? (
        <Input
          ref={inputRef}
          aria-label="Page number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={draftPage}
          className="w-10 h-7 px-1 text-center rounded-md [&_[data-slot=input]]:text-center"
          onBlur={() => setIsEditing(false)}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const nextValue = event.target.value

            setDraftPage(nextValue)
            applyPageDraft(nextValue)
          }}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter" || event.key === "Escape") {
              event.currentTarget.blur()
            }
          }}
        />
      ) : (
        <button
          type="button"
          className="font-medium hover:underline focus:outline-none"
          aria-label={`Current page ${displayPage}. Edit page number`}
          disabled={controlsDisabled || !numPages}
          onClick={() => {
            setDraftPage(String(displayPage))
            setIsEditing(true)
          }}
        >
          {displayPage}
        </button>
      )}
      <span>of {numPages || "–"}</span>
    </div>
  )
}
