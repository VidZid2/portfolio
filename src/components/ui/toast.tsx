"use client";

import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";
import React from "react";

export type ToastOptions = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  duration?: number;
  icon?: React.ReactNode;
};

export type ToastPromiseCallbacks<T> = {
  loading: ToastOptions | string;
  success: ((data: T) => ToastOptions | string) | ToastOptions | string;
  error: ((err: any) => ToastOptions | string) | ToastOptions | string;
  finally?: () => void;
};

import { playToastIn, playToastSuccess, playToastError, playToastOut } from "@/lib/synth-sounds";

export const toastManager = {
  promise<T>(promise: Promise<T> | (() => Promise<T>), callbacks: ToastPromiseCallbacks<T>) {
    playToastIn(0.04);
    return sonnerToast.promise(promise, {
      loading: typeof callbacks.loading === "object" ? (
        <div className="flex flex-col gap-0.5 text-left">
          {callbacks.loading.title && <div className="font-semibold text-[13px] text-zinc-900 dark:text-zinc-100">{callbacks.loading.title}</div>}
          {callbacks.loading.description && <div className="text-[12px] text-zinc-600 dark:text-zinc-400 leading-snug">{callbacks.loading.description}</div>}
        </div>
      ) : callbacks.loading,
      success: (data: T) => {
        playToastSuccess(0.045);
        const resolved = typeof callbacks.success === "function" ? callbacks.success(data) : callbacks.success;
        if (typeof resolved === "object" && resolved !== null) {
          return (
            <div className="flex flex-col gap-0.5 text-left">
              {resolved.title && <div className="font-semibold text-[13px] text-zinc-900 dark:text-zinc-100">{resolved.title}</div>}
              {resolved.description && <div className="text-[12px] text-zinc-600 dark:text-zinc-400 leading-snug">{resolved.description}</div>}
            </div>
          );
        }
        return resolved;
      },
      error: (err: any) => {
        playToastError(0.04);
        const resolved = typeof callbacks.error === "function" ? callbacks.error(err) : callbacks.error;
        if (typeof resolved === "object" && resolved !== null) {
          return (
            <div className="flex flex-col gap-0.5 text-left">
              {resolved.title && <div className="font-semibold text-[13px] text-red-600 dark:text-red-400">{resolved.title}</div>}
              {resolved.description && <div className="text-[12px] text-zinc-600 dark:text-zinc-400 leading-snug">{resolved.description}</div>}
            </div>
          );
        }
        return resolved;
      },
      finally: callbacks.finally,
    });
  },

  message(title: React.ReactNode, options?: { description?: React.ReactNode }) {
    playToastIn(0.04);
    return sonnerToast(title, {
      ...options,
      onAutoClose: () => playToastOut(0.03),
      onDismiss: () => playToastOut(0.03),
    });
  },

  success(title: React.ReactNode, options?: { description?: React.ReactNode }) {
    playToastSuccess(0.045);
    return sonnerToast.success(title, {
      ...options,
      onAutoClose: () => playToastOut(0.03),
      onDismiss: () => playToastOut(0.03),
    });
  },

  error(title: React.ReactNode, options?: { description?: React.ReactNode }) {
    playToastError(0.04);
    return sonnerToast.error(title, {
      ...options,
      onAutoClose: () => playToastOut(0.03),
      onDismiss: () => playToastOut(0.03),
    });
  },

  info(title: React.ReactNode, options?: { description?: React.ReactNode }) {
    playToastIn(0.04);
    return sonnerToast.info(title, {
      ...options,
      onAutoClose: () => playToastOut(0.03),
      onDismiss: () => playToastOut(0.03),
    });
  },

  warning(title: React.ReactNode, options?: { description?: React.ReactNode }) {
    playToastIn(0.04);
    return sonnerToast.warning(title, {
      ...options,
      onAutoClose: () => playToastOut(0.03),
      onDismiss: () => playToastOut(0.03),
    });
  },

  dismiss(toastId?: string | number) {
    playToastOut(0.03);
    return sonnerToast.dismiss(toastId);
  },
};

import { Swirling } from "@/components/loading-ui/swirling";
import { motion } from "framer-motion";

function SuccessCheckmarkMorph() {
  return (
    <motion.div 
      className="relative size-[24px] shrink-0 flex items-center justify-center text-emerald-500"
      initial={{ scale: 0.82, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
    >
      <svg
        viewBox="0 0 800 800"
        className="size-[24px] overflow-visible"
        fill="none"
      >
        {/* Full smooth ring matching swirling loader */}
        <circle
          cx="400"
          cy="400"
          r="200"
          stroke="currentColor"
          strokeWidth="50"
          strokeLinecap="round"
        />

        {/* Checkmark that draws smoothly from left to right */}
        <motion.path
          d="M290 415 L370 495 L525 330"
          stroke="currentColor"
          strokeWidth="50"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.08 },
          }}
        />
      </svg>
    </motion.div>
  );
}

function ErrorCrossMorph() {
  return (
    <motion.div 
      className="relative size-[24px] shrink-0 flex items-center justify-center text-rose-500"
      initial={{ scale: 0.82, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
    >
      <svg
        viewBox="0 0 800 800"
        className="size-[24px] overflow-visible"
        fill="none"
      >
        <circle
          cx="400"
          cy="400"
          r="200"
          stroke="currentColor"
          strokeWidth="50"
          strokeLinecap="round"
        />
        <motion.path
          d="M320 320 L480 480 M480 320 L320 480"
          stroke="currentColor"
          strokeWidth="50"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.08 },
          }}
        />
      </svg>
    </motion.div>
  );
}

export function Toaster() {
  const { resolvedTheme } = useTheme();
  const [mounted, ReactSetMounted] = React.useState(false);

  React.useEffect(() => {
    ReactSetMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    let lastOutSoundTime = 0;
    const playOutDebounced = () => {
      const now = Date.now();
      if (now - lastOutSoundTime > 80) {
        lastOutSoundTime = now;
        playToastOut(0.028);
      }
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && (m.attributeName === "data-removed" || m.attributeName === "data-mounted")) {
          const el = m.target as HTMLElement;
          if (el.getAttribute("data-removed") === "true" || el.getAttribute("data-mounted") === "false") {
            playOutDebounced();
          }
        }
        if (m.type === "childList") {
          for (const node of Array.from(m.removedNodes)) {
            if (
              node instanceof HTMLElement &&
              (node.hasAttribute("data-sonner-toast") || node.querySelector?.("[data-sonner-toast]"))
            ) {
              playOutDebounced();
            }
          }
        }
      }
    });

    const target = document.querySelector("[data-sonner-toaster]") || document.body;
    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-removed", "data-mounted"],
    });

    return () => observer.disconnect();
  }, [mounted]);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <SonnerToaster
      theme={isDark ? "dark" : "light"}
      className="toaster group"
      position="bottom-right"
      icons={{
        loading: (
          <div className="flex items-center justify-center size-[24px] shrink-0 text-zinc-900 dark:text-zinc-100">
            <Swirling className="size-[24px] text-current" />
          </div>
        ),
        success: <SuccessCheckmarkMorph />,
        error: <ErrorCrossMorph />,
      }}
      toastOptions={{
        style: isDark
          ? {
              background: "#09090b",
              color: "#f4f4f5",
              borderColor: "rgba(255, 255, 255, 0.14)",
              boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.8)",
            }
          : {
              background: "#ffffff",
              color: "#18181b",
              borderColor: "rgba(0, 0, 0, 0.12)",
              boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.15)",
            },
      }}
    />
  );
}

export { sonnerToast as toast };
export default toastManager;
