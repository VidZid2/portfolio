"use client";

import { Button } from "@/components/motion/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/motion/popover";

export function PopoverPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Popover side="bottom" align="start">
        <PopoverTrigger>
          <Button variant="secondary">Edit profile</Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Dimensions</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Set the width and height for the layer.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <label className="flex items-center justify-between gap-3 text-sm">
              <span className="text-neutral-500 dark:text-neutral-400">Width</span>
              <input
                defaultValue="100%"
                className="h-8 w-32 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span className="text-neutral-500 dark:text-neutral-400">Height</span>
              <input
                defaultValue="auto"
                className="h-8 w-32 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              />
            </label>
          </div>
        </PopoverContent>
      </Popover>

      <Popover trigger="hover" side="top">
        <PopoverTrigger>
          <Button variant="outline">Hover me</Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <p className="text-sm text-neutral-900 dark:text-neutral-100">
            Opens on hover, with a grace window so you can move into the panel.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
