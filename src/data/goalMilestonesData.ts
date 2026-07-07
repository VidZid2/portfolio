export interface GoalMilestoneData {
  title: string;
  role: string;
  dates: string;
  location: string;
  src: string;
  metrics?: { label: string; value: string }[];
  description: string;
  imageZoom?: number;
  imageFit?: "cover" | "contain";
  hidePlaceholder?: boolean;
  placeholderVideo?: string;
  isDisabled?: boolean;
}

export const goalMilestones: GoalMilestoneData[] = [
  {
    title: "PRIMA",
    role: "Full-Stack Application",
    dates: "100% Complete",
    location: "Project Goal",
    src: "/PRIMA.png",
    imageFit: "cover",
    isDisabled: true,
    metrics: [
      { label: "Status", value: "Completed" },
      { label: "Scale", value: "21k+ Lines of Code" },
    ],
    description: "**The Ultimate Testing Ground**\nSuccessfully launched my flagship web application. Built entirely from scratch, it served as my proving ground for mastering Next.js, implementing complex Framer Motion animations, and understanding scalable UI component architecture.",
  },
  {
    title: "eLMS 2.0 Overhaul",
    role: "Modernized Platform",
    dates: "58% Complete",
    location: "Project Goal",
    src: "/STI.png",
    imageFit: "cover",
    isDisabled: true,
    metrics: [
      { label: "Status", value: "In Progress" },
      { label: "Focus", value: "Security (RLS & AES)" },
    ],
    description: "**Re-imagining EdTech**\nA complete, modernized overhaul of the STI eLMS system. My goal here is to prove that school software doesn't have to be clunky, integrating fluid page transitions while actively learning advanced database security and data encryption.",
  },
  {
    title: "Project SYNC",
    role: "Portfolio",
    dates: "89% Complete",
    location: "Project Goal",
    src: "https://github.com/VidZid2.png?v=1",
    imageFit: "cover",
    metrics: [
      { label: "Core Architecture", value: "Next.js 16 & React 19" },
      { label: "Type Safety", value: "Strict TypeScript" },
      { label: "Styling System", value: "Tailwind CSS & Shadcn UI" },
      { label: "AI Capabilities", value: "Vercel AI SDK & Prompts" },
      { label: "Fluid Animations", value: "Framer Motion & GSAP" },
      { label: "3D & Graphics", value: "Three.js / WebGL Canvas" },
      { label: "Interactivity", value: "Drag & Drop (dnd-kit)" },
      { label: "Dark Mode", value: "Advanced Theme Switching" },
      { label: "Code Parsing", value: "Shiki & Streamdown" },
      { label: "Command Palette", value: "CMDK Search & Navigation" },
      { label: "Visual FX", value: "Particle Engines & Scramble" },
      { label: "Data Viz", value: "GitHub Graph Integration" },
      { label: "Accessible Primitives", value: "Radix UI & Base UI" },
      { label: "Slider Architecture", value: "Embla Carousel React" },
      { label: "Vector Iconography", value: "Lucide & Phosphor Icons" },
      { label: "Performance Insights", value: "Vercel Analytics & Speed" },
      { label: "Mathematical Markdown", value: "Streamdown Math/Mermaid" },
      { label: "Code Difference Viz", value: "Pierre Diffs Integration" },
    ],
    placeholderVideo: "/Video's/PROJECT SYNC - Portfolio/SYNC.mp4",
    description: "**Building from Scratch:** Project SYNC represents a complete, ground-up rebuild of my portfolio. As a student, I wanted to push my limits and understand exactly how modern web applications work under the hood. To achieve this, I built the entire foundation on Next.js 16 and React 19, focusing heavily on strict type safety with TypeScript and ensuring lightning-fast load times. The core architecture relies on custom server-side rendering strategies and optimized static generation to keep the initial payload extremely lightweight while maintaining a robust interactive state.\n**Customizing the Design:** The overall aesthetic is driven by a bespoke, utility-first design system. I leveraged Tailwind CSS and integrated Shadcn UI, but I didn't just use the components out of the box. Instead, I carefully customized and tweaked them to perfectly align with my own personal style, aiming for a premium glassmorphism and modern brutalist look. I achieved this by overriding default theme tokens and constructing a proprietary layer of CSS variables that dynamically compute colors, opacities, and blur filters based on the user's active theme.\n**Fluid Animations:** I wanted the experience to feel alive and provide continuous tactile feedback. Therefore, I integrated Framer Motion and GSAP to orchestrate everything from fluid page transitions to dynamic layout morphing and complex micro-interactions. The underlying animation engine utilizes advanced spring physics and staggered delay coordinates, which I carefully tuned mathematically to ensure transitions feel entirely organic without relying on heavy, generic preset libraries.\n**Advanced Visual Effects:** Pushing the visual boundaries further, the site features custom WebGL and Three.js elements. For instance, I implemented advanced Canvas-based particle engines for both the cursor and the top banner, alongside highly technical text displacement and profile scrambling effects that react to user interactions. To maintain strict performance, these effects run on isolated animation frames and utilize custom shader logic that offloads rendering calculations directly to the GPU, keeping the main thread free.\n**Integrating Artificial Intelligence:** A major milestone for this project was deeply integrating AI directly into the user experience. By leveraging the Vercel AI SDK, I built a custom Command Menu (CMDK) that features a dedicated 'Ask AI' tool. Furthermore, this allows users to seamlessly switch between AI models, input prompts, and receive real-time, context-aware responses right in the UI. The architecture isolates the prompt processing pipeline through secure serverless edge functions, ensuring that my proprietary system prompts and core logic remain strictly confidential and completely inaccessible from the client side.\n**Code & Data Presentation:** To make sure the AI's code snippets are perfectly readable, I utilized Streamdown and Shiki highlighting. Additionally, data visualization is handled through a custom GitHub Graph integration that tracks my open-source contributions. I built a custom data fetching layer that securely aggregates and caches this information via private API endpoints, parsing the raw syntax structures before rendering them into the stylized DOM elements you see.\n**Interactive UI Elements:** Beyond just animations, the UI features complex, highly interactive layers. For example, I built an advanced Dark/Light Mode theme switching system, a highly customized Figma highlight component to seamlessly integrate and showcase my design videos, and intuitive drag-and-drop components using dnd-kit. The state management for these interactions is completely decoupled from the view layer, utilizing custom React hooks that track interaction states efficiently without triggering unnecessary re-renders across the application tree.\n**Pixel-Perfect Layouts:** Finally, I engineered complex data presentations entirely from scratch. A great example is the responsive, fully-bordered tech stack grids, where I precisely calculated and placed intersection dots to ensure perfect alignment across all devices and screen sizes. This was accomplished by developing a highly dynamic layout framework that programmatically computes bounds and DOM positions, ensuring absolute pixel accuracy regardless of the viewport dimensions or device scaling ratios.",
  },
  {
    title: "System Admin Dashboards",
    role: "Enterprise Tools",
    dates: "0% Complete",
    location: "Career Goal",
    src: "https://github.com/VidZid2.png?v=1",
    imageFit: "cover",
    hidePlaceholder: true,
    isDisabled: true,
    metrics: [
      { label: "Focus", value: "Complex Data Viz" },
      { label: "Target", value: "Enterprise UX" },
    ],
    description: "**Scaling for B2B Tech Roles**\nTo maximize my hireability and stand out to top-tier tech companies, my next major milestone is building complex system administrator dashboards. This will force me to master complex state management, data-heavy visualizations (charts, tables), and enterprise-grade UI patterns.",
  }
];
