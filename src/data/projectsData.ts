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
    description: "As I entered my second year as an IT student, the project took on a completely new meaning. PRIMA isn't just a fictional sandbox; it is a real, growing digital agency founded by an industry mentor. I decided to take the initiative and build this premium landing page to help elevate their professional portfolio. This collaboration evolved into my first true B2B (Business-to-Business) project, establishing a professional partnership where I am trusted to develop full-stack applications for the agency's future clients.",
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
    description: "A complete, modernized overhaul of the STI eLMS system to prove that school software doesn't have to be clunky. I focused on building a highly interactive interface with fluid page transitions, dark mode support, and a clean, component-driven architecture. On the backend, I challenged myself to learn Supabase for database management and user authentication, and implemented Row Level Security (RLS) and AES encryption to protect sensitive student data.",
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
