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

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  link?: string;
}

export interface TechnicalAuditItem {
  flaw: string;
  solution: string;
}

export interface Project {
  slug: string;
  title: string;
  mobileTitle?: string;
  imageTitle: string;
  categoryBadge?: string;
  clientName?: string;
  clientLink?: string;
  testimonial?: ProjectTestimonial;
  auditBreakdown?: TechnicalAuditItem[];
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
    categoryBadge: "Pro-Bono Client Deliverable",
    clientName: "PRIMA",
    clientLink: "https://www.facebook.com/primaofficial",
    testimonial: {
      quote: "We greatly acknowledge and appreciate Josiah's work. He built a standout platform for our agency and proved his technical skills under real-world demands. When expanding our engineering team, he is at the very top of our list.",
      author: "David Clarence Del Mundo",
      role: "Lead / Stakeholder",
      company: "PRIMA",
      link: "https://www.facebook.com/primaofficial",
    },
    src: "/PRIMA Landing Page.png",
    lightModeSrc: "/PRIMA Landing Page.png",
    video: "",
    tldr: "Delivered a complete, high-performance agency web platform pro-bono in a 4-day sprint to launch a new agency's digital footprint, adopted into their official portfolio.",
    description: "Volunteered high-velocity frontend engineering to give an emerging digital agency a high-converting, production-ready web presence. Engineered with Next.js 16, TypeScript, Tailwind CSS, custom Framer Motion spring physics, and Lenis inertial scrolling. The platform was officially adopted by PRIMA to showcase their client capabilities, earning an endorsement from agency lead David Clarence Del Mundo for delivering enterprise-grade quality under an intense 4-day turnaround.",
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
    categoryBadge: "UX Audit & Case Study",
    auditBreakdown: [
      {
        flaw: "Legacy multi-step course navigation causing user friction and misplaced submissions during peak hours.",
        solution: "Streamlined single-view modular dashboard with unified assignment tracking and instant client routing.",
      },
      {
        flaw: "Mobile interface breakdown on budget Android devices with excessive DOM depth and unoptimized layouts.",
        solution: "Hardware-aware responsive layouts using CSS container queries and sub-100ms first input latency.",
      },
      {
        flaw: "Unpredictable session drops and unencrypted client-side state caching in the legacy portal.",
        solution: "Supabase Row Level Security (RLS) policies paired with client-side AES-256 payload encryption.",
      },
    ],
    src: "/STI Landing Page DARKMODE.png",
    lightModeSrc: "/STI Landing Page.png",
    video: "",
    tldr: "System & UX overhaul case study resolving legacy navigational friction and mobile latency in higher-ed portals with React 19 and AES-256 security.",
    description: "A student-initiated UX and systems architecture case study tackling the usability shortcomings of the legacy STI eLMS platform. Analyzed real student workflows to eliminate navigation bottlenecks, unresponsiveness on budget mobile hardware, and unpredictable session drops. Re-engineered as a modern React 19 prototype with 0ms optimistic UI state updates, AES-256 encrypted payload handling, and strict Supabase Row Level Security (RLS).",
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
