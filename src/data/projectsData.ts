import type { ComponentType } from "react";
import { Network, Search } from "lucide-react";
import {
  SiNextdotjs,
  SiTypescript,
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
  SiCss,
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
    description: "As an upcoming 2nd-year IT student, I knew I had to push beyond standard coursework. PRIMA Digital Agency wasn't a fictional sandbox—it was a real firm founded by an industry mentor. They needed a digital presence that converted, but standard templates felt too rigid. Combining my 2 years of AI-agentic development workflows with modern Next.js architecture, I engineered a premium, highly-interactive landing page. This wasn't just about writing React; it was my first true B2B challenge, balancing high-end UI animations with strict performance budgets to deliver a professional product.",
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
    github: "#",
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
    description: "School software is notoriously clunky—so I decided to prove it didn't have to be. For this eLMS overhaul, the challenge wasn't just making it look modern; it was building a system that felt instantly responsive. As a student myself, I knew exactly where the UI pain points were. I leveraged my AI-assisted coding experience to rapidly architect a clean React interface with fluid page transitions. But the real boss fight was the backend: I dove headfirst into Supabase, implementing Row Level Security (RLS) and AES encryption to ensure sensitive data remained locked down. It was a humbling dive into production security, resulting in a platform I'd actually want to use.",
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
    github: "#",
    live: "https://sti-ten.vercel.app/",
    backgroundImage: "/STI Background.png",
    darkBackgroundImage: "/STI Background DARK MODE.png",
    hasPin: false,
  }
];
