import type { ComponentType } from "react";
import { Network, Search } from "lucide-react";
import {
  SiNextdotjs,
  SiReact,
  SiThreedotjs,
  SiPrisma,
  SiCloudflare,
  SiLangchain,
  SiNodedotjs,
  SiFramer,
  SiTailwindcss,
  SiBun,
  SiEslint,
  SiRadixui,
  SiChartdotjs,
  SiGithub,
  SiFastapi,
  SiRedis,
  SiCelery,
  SiTldraw,
  SiPython,
  SiAnthropic,
  SiClaude,
  SiGooglegemini,
  SiMeta,
  SiVite,
  SiSupabase,
} from "react-icons/si";
import { BiLogoHtml5, BiLogoCss3, BiLogoJavascript, BiLogoTypescript } from "react-icons/bi";
export type TechIcon = ComponentType<{ className?: string }>;
export type TechKey =
  | "next" | "ts" | "react" | "three" | "prisma" | "cloud" | "langchain" | "langgraph" | "rag"
  | "node" | "motion" | "tailwind" | "bun" | "eslint" | "radixui" | "charts" | "github" | "fastapi"
  | "redis" | "celery" | "tldraw" | "css3" | "python" | "anthropic" | "claude" | "gemini" | "llama"
  | "html5" | "js" | "vite" | "supabase";

export type TechItem = TechKey | { label: string; tooltip?: string; };

export interface Project {
  slug: string;
  title: string;
  mobileTitle?: string;
  imageTitle: string;
  src: string;
  lightModeSrc?: string;
  video: string;
  tldr?: string;
  description: string;
  tech: TechItem[];
  github: string;
  live: string;
  isDown?: boolean;
  starsText?: string;
  backgroundImage?: string;
  darkBackgroundImage?: string;
  hasPin: boolean;
}

export const iconMap: Record<TechKey, TechIcon> = {
  next: SiNextdotjs, ts: BiLogoTypescript, react: SiReact, three: SiThreedotjs, prisma: SiPrisma,
  cloud: SiCloudflare, langchain: SiLangchain, langgraph: Network, rag: Search, node: SiNodedotjs,
  motion: SiFramer, tailwind: SiTailwindcss, bun: SiBun, eslint: SiEslint, radixui: SiRadixui,
  charts: SiChartdotjs, github: SiGithub, fastapi: SiFastapi, redis: SiRedis, celery: SiCelery,
  tldraw: SiTldraw, css3: BiLogoCss3, python: SiPython, anthropic: SiAnthropic, claude: SiClaude,
  gemini: SiGooglegemini, llama: SiMeta, html5: BiLogoHtml5, js: BiLogoJavascript, vite: SiVite, supabase: SiSupabase,
};

export const techNames: Record<TechKey, string> = {
  next: "Next.js", ts: "TypeScript", react: "React", three: "Three.js", prisma: "Prisma",
  cloud: "Cloudflare", langchain: "LangChain", langgraph: "LangGraph", rag: "RAG",
  node: "Node.js", motion: "Framer Motion", tailwind: "Tailwind CSS", bun: "Bun", eslint: "ESLint",
  radixui: "Radix UI", charts: "Charts", github: "GitHub API", fastapi: "FastAPI", redis: "Redis",
  celery: "Celery", tldraw: "tldraw", css3: "CSS3", python: "Python", anthropic: "Anthropic",
  claude: "Claude", gemini: "Gemini", llama: "LLaMA", html5: "HTML5", js: "JavaScript", vite: "Vite", supabase: "Supabase",
};

export const projectsData: Project[] = [
  {
    slug: "prima-digital-agency",
    title: "PRIMA | Digital Technology Solutions",
    mobileTitle: "PRIMA",
    imageTitle: "Landing Page",
    src: "/PRIMA Landing Page.png",
    lightModeSrc: "/PRIMA Landing Page.png",
    video: "",
    tldr: "Engineered a high-performance B2B agency platform with custom Framer Motion physics, Lenis smooth scrolling, and modular component architecture.",
    description: "PRIMA Digital Agency required a high-converting digital platform that showcased their enterprise services while adhering to strict performance budgets. Building with Next.js, TypeScript, and Tailwind CSS, I architected a modular UI system with custom GLSL/Framer Motion visual effects and Lenis inertial scrolling. The challenge was balancing complex micro-interactions and dynamic viewport canvas shaders without degrading mobile frame rates, achieving a 98+ Lighthouse rating with zero layout shift.",
    tech: [
      "html5", 
      "css3", 
      "js", 
      "ts", 
      "react", 
      "next", 
      "tailwind", 
      "motion", 
      { label: "Lenis" }, 
      { label: "Custom UI Components" }, 
      { label: "Dark/Light Mode" }, 
      { label: "Mobile Optimization" }
    ],
    github: "https://github.com/VidZid2/portfolio",
    live: "https://prima-ten.vercel.app/",
    backgroundImage: "/PRIMA Background.png",
    darkBackgroundImage: "/PRIMA Background DARK MODE.png",
    hasPin: false,
  },
  {
    slug: "sti-elms",
    title: "STI eLMS | Next-Gen LMS",
    mobileTitle: "eLMS Overhaul",
    imageTitle: "App Interface",
    src: "/STI Landing Page DARKMODE.png",
    lightModeSrc: "/STI Landing Page.png",
    video: "",
    tldr: "Architected a responsive learning management interface with React 19, Supabase Row Level Security (RLS), and AES-256 data encryption.",
    description: "Educational software is frequently hindered by clunky navigation and legacy latency. For this system overhaul, I engineered an instantaneous React 19 frontend paired with a hardened Supabase backend. Key technical milestones included designing optimistic UI state transitions for 0ms visual latency, enforcing granular Row Level Security (RLS) policies at the database layer, and implementing AES-256 encryption on sensitive student records.",
    tech: [
      "html5", 
      "css3", 
      "js", 
      "ts", 
      "react", 
      "tailwind", 
      "vite",
      "supabase",
      { label: "REST APIs" },
      { label: "Row Level Security (RLS)" },
      { label: "AES Encryption" },
      { label: "Dark/Light Mode" }
    ],
    github: "https://github.com/VidZid2/portfolio",
    live: "https://sti-ten.vercel.app/",
    backgroundImage: "/STI Background.png",
    darkBackgroundImage: "/STI Background DARK MODE.png",
    hasPin: false,
  }
];
