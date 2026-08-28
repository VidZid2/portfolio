"use client";

import React from "react";
import Image from "next/image";
import {
  ShieldCheck,
  KeyRound,
  Webhook,
  Layers,
  Palette,
  Sparkles,
  Code2,
  type LucideIcon,
} from "lucide-react";

interface TechMeta {
  iconSlug?: string;
  customSrc?: string;
  lucideIcon?: LucideIcon;
}

export function getTechBadgeMeta(name: string): TechMeta {
  const lower = name.toLowerCase().trim();

  if (lower === "typescript") return { iconSlug: "typescript" };
  if (lower === "javascript")
    return {
      customSrc: "/SVG's/Stack SVG's/JavaScript.png",
      iconSlug: "javascript",
    };
  if (lower === "python") return { iconSlug: "python" };
  if (lower === "html5" || lower === "html")
    return { customSrc: "/SVG's/Stack SVG's/HTML.svg", iconSlug: "html5" };
  if (lower === "css3" || lower === "css")
    return { customSrc: "/SVG's/Stack SVG's/CSS3.svg", iconSlug: "css3" };
  if (lower.startsWith("react")) return { iconSlug: "react" };
  if (lower === "next.js" || lower === "nextjs")
    return { iconSlug: "nextdotjs" };
  if (lower === "tailwind css" || lower === "tailwindcss")
    return { iconSlug: "tailwindcss" };
  if (lower === "framer motion" || lower === "motion")
    return { iconSlug: "framer" };
  if (lower === "three.js" || lower === "threejs")
    return { iconSlug: "threedotjs" };
  if (lower === "vite") return { iconSlug: "vite" };
  if (lower === "node.js" || lower === "nodejs")
    return { iconSlug: "nodedotjs" };
  if (lower === "supabase") return { iconSlug: "supabase" };
  if (lower === "postgresql" || lower === "postgres")
    return { iconSlug: "postgresql" };
  if (lower === "redis") return { iconSlug: "redis" };
  if (lower === "flask") return { iconSlug: "flask" };
  if (lower === "sqlite") return { iconSlug: "sqlite" };
  if (lower === "git") return { iconSlug: "git" };
  if (lower === "github") return { iconSlug: "github" };
  if (lower === "vercel") return { iconSlug: "vercel" };
  if (lower === "websockets" || lower === "websocket")
    return { iconSlug: "socketdotio" };
  if (lower.includes("wix")) return { iconSlug: "wix" };
  if (lower.includes("security") || lower.includes("rls"))
    return { lucideIcon: ShieldCheck };
  if (lower.includes("encryption") || lower.includes("aes"))
    return { lucideIcon: KeyRound };
  if (lower.includes("rest") || lower.includes("api"))
    return { lucideIcon: Webhook };
  if (lower.includes("component") || lower.includes("architecture"))
    return { lucideIcon: Layers };
  if (lower.includes("design") || lower.includes("ui"))
    return { lucideIcon: Palette };
  if (lower.includes("lenis")) return { lucideIcon: Sparkles };

  return { lucideIcon: Code2 };
}

export function TechBadge({ name }: { name: string }) {
  const meta = getTechBadgeMeta(name);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] bg-zinc-100/90 dark:bg-zinc-800/70 hover:bg-zinc-200/90 dark:hover:bg-zinc-700/90 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 text-[12px] sm:text-[13px] font-medium transition-all duration-150 select-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {meta.customSrc ? (
        <Image
          src={meta.customSrc}
          alt={name}
          width={14}
          height={14}
          unoptimized
          loading="lazy"
          decoding="async"
          className="h-3.5 w-3.5 object-contain shrink-0 grayscale opacity-80"
        />
      ) : meta.iconSlug ? (
        <Image
          src={`https://cdn.simpleicons.org/${meta.iconSlug}/71717a`}
          alt={name}
          width={14}
          height={14}
          unoptimized
          loading="lazy"
          decoding="async"
          className="h-3.5 w-3.5 opacity-80 shrink-0"
        />
      ) : meta.lucideIcon ? (
        <meta.lucideIcon className="h-3.5 w-3.5 text-zinc-500 opacity-80 shrink-0" />
      ) : null}
      <span className="text-inherit font-medium leading-none">{name}</span>
    </div>
  );
}
