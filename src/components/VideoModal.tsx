"use client";

import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

/**
 * Project video lightbox (YouTube embed or native <video>).
 *
 * Currently dormant — no project data sets a video URL yet — but wired and
 * ready: pass a URL to open, null to keep it closed. Radix owns focus
 * trapping, Escape, aria-modal and scroll lock.
 */
export function VideoModal({
  videoUrl,
  onClose,
}: {
  videoUrl: string | null;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={videoUrl !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        aria-label="Project video"
        showCloseButton={false}
        className="top-[50%] left-[50%] w-[90%] max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-0 rounded-xl border-0 bg-black p-0 shadow-2xl sm:max-w-3xl"
      >
        <DialogClose
          className="absolute top-3 right-3 z-50 rounded-full bg-neutral-800/80 p-2 text-neutral-200 transition-colors cursor-pointer hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label="Close video"
        >
          <X size={20} />
        </DialogClose>

        {videoUrl?.includes("youtube") ? (
          <iframe
            src={videoUrl}
            className="w-full aspect-video border-0"
            allowFullScreen
            title="Project video"
          />
        ) : (
          videoUrl && (
            <video
              src={videoUrl}
              className="w-full h-auto"
              controls
              autoPlay
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
