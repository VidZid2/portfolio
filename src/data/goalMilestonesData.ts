export interface GoalMilestoneData {
  title: string;
  role: string;
  dates: string;
  location: string;
  timeframe?: string;
  src: string;
  metrics?: { label: string; value: string }[];
  description: string;
  imageZoom?: number;
  imageFit?: "cover" | "contain";
  hidePlaceholder?: boolean;
  placeholderVideo?: string;
  placeholderImage?: string;
  isDisabled?: boolean;
}

export const goalMilestones: GoalMilestoneData[] = [
  {
    title: "PRIMA",
    role: "AI-Powered Landing Page",
    dates: "100% Complete",
    location: "B2B Client Project",
    timeframe: "2026 (Completed in 4 Days)",
    src: "/PRIMA.png",
    imageFit: "cover",
    placeholderImage: "/PRIMA Landing Page.png",
    metrics: [
      { label: "Core Architecture", value: "Next.js 16 (App Router), React 19, & TypeScript" },
      { label: "Build Engine", value: "Turbopack (~4s Build Time)" },
      { label: "Styling & Utility", value: "Tailwind CSS 4.0, clsx, tailwind-merge" },
      { label: "Iconography", value: "Lucide React" },
      { label: "Scale", value: "21,687 Lines of Code (100 Source Files)" },
      { label: "Physics & Motion", value: "Framer Motion 12" },
      { label: "Scroll Mechanics", value: "Lenis Smooth Scrolling" },
      { label: "AI Integration", value: "Google Gemini SDK" },
      { label: "Performance", value: "Custom Hook for RAM/CPU Detection" },
      { label: "Graphics", value: "Three.js & WebGL Shaders" },
    ],
    description: "**The Concept & Vision:** PRIMA started as a promise to my teacher, Sir David. I volunteered to build a landing page for his growing digital agency for free to help him establish an online presence. It ended up becoming my first real freelance project. My goal was to see if I could build a high-quality, professional site from scratch in just a 4-day sprint.\n**The Gemini AI Integration:** Instead of a standard contact form, I wanted to try something different, so I integrated the **Google Gemini SDK**. I built an \"Ask AI Helper\" that can answer client questions. I had to learn how to handle live token streaming and figure out how to manage API rate limits so the chat wouldn't break if a user spammed it. It was a huge learning curve but really fun to build!\n**Architecting the Codebase:** Building this in 4 days pushed my limits as a student developer. I used Next.js 16 and Turbopack to keep my code organized. The hardest part for me was learning the difference between React Server Components and Client Components, making sure my animations didn't slow down the initial page load. I used `clsx` and `tailwind-merge` to keep my styling code clean.\n**Design & UI Details:** I wanted the design to feel premium, so I built a dark-mode theme with custom typography and 3D-looking badges. I even experimented with `Three.js` and custom shaders to add some cool interactive graphics that follow the cursor. I also learned how to use React Portals to create booking popups that lock the background scrolling.\n**Mobile Performance:** The biggest challenge was making sure these animations didn't lag on mobile phones. I used Framer Motion for smooth transitions, but when I tested it on older Androids, it was struggling. I had to go back and replace heavy CSS blurs with lighter gradient masks. I even figured out how to write a custom React hook that detects the user's device performance and turns off heavy animations if they're on a weaker phone!",
  },
  {
    title: "eLMS 2.0 Overhaul",
    role: "Full-Stack Application",
    dates: "58% Complete",
    location: "Case Study Project",
    timeframe: "2025 - 2026",
    src: "/STI.png",
    imageFit: "cover",
    placeholderImage: "/STI Landing Page.png",
    metrics: [
      { label: "Core Architecture", value: "React 19, TypeScript & Vite 7 (SPA)" },
      { label: "State & Routing", value: "React Router v7 & Global Contexts" },
      { label: "Database & Auth", value: "Supabase (PostgreSQL) & Google reCAPTCHA" },
      { label: "Local Data Sync", value: "Dexie.js (IndexedDB)" },
      { label: "Security", value: "AES-256 Client-Side Encryption" },
      { label: "Styling & UI", value: "Tailwind CSS v3, Radix UI & HeroUI" },
      { label: "Physics & Motion", value: "Framer Motion v12 & Vaul Drawers" },
      { label: "Performance", value: "React Virtuoso Virtualization" },
      { label: "Graphics", value: "Three.js & React Three Fiber (R3F)" },
      { label: "Academic Utilities", value: "Tesseract.js OCR, Compromise.js & GenAI" },
      { label: "Development Status", value: "Active WIP (58% Complete)" },
      { label: "Future Roadmap", value: "Still learning & adding new features!" },
    ],
    description: "**The Legacy Problem:** Our school's original eLMS is a bit outdated—it breaks on mobile devices, navigation can be confusing, and it loads slowly. Important features like task submissions take too many clicks to find, and students often have to use external sites with ads just to scan or edit their documents.\n**The Modernized Solution:** For my case study, I wanted to see if I could build a better version of it from scratch as a Single Page Application (SPA). Using React 19 and Vite, I designed a responsive, glassmorphic UI. Since I wanted to include features like OCR text scanning and 3D graphics, I had to learn how to process all of that directly in the browser so it wouldn't crash the server.\n**Offline-First Approach:** One of my favorite features I added is offline support. I used Dexie.js to save data (like study streaks) locally in the browser so the app feels instantly responsive. Then, when the student connects back to the internet, it quietly syncs their progress to a Supabase PostgreSQL database in the background so they never lose their work.\n**Security & Performance:** To keep student data safe, I learned how to use crypto-js to encrypt sensitive information before it's sent to the database. I also set up Supabase Auth and reCAPTCHA to prevent spam. Since the dashboard needs to handle a lot of data, I learned how to use React Virtuoso to only render the items currently visible on the screen, keeping the app running fast without freezing the browser.",
  },
  {
    title: "Project SYNC",
    role: "Portfolio",
    dates: "89% Complete",
    location: "Personal Portfolio",
    src: "https://github.com/VidZid2.png?v=1",
    imageFit: "cover",
    metrics: [
      { label: "Core Architecture", value: "Next.js 16 & React 19" },
      { label: "Type Safety", value: "TypeScript" },
      { label: "Styling System", value: "Tailwind CSS & Shadcn UI" },
      { label: "AI Capabilities", value: "Vercel AI SDK & Custom Prompts" },
      { label: "Fluid Animations", value: "Framer Motion & GSAP" },
      { label: "3D & Graphics", value: "Three.js & WebGL Canvas" },
      { label: "Interactivity", value: "Drag & Drop (dnd-kit)" },
      { label: "Dark Mode", value: "Custom Theme Switching" },
      { label: "Code Parsing", value: "Shiki & Streamdown" },
      { label: "Command Palette", value: "CMDK Search & Navigation" },
      { label: "Visual FX", value: "Particles & Text Scramble" },
      { label: "Data Viz", value: "GitHub Graph API" },
      { label: "Accessible Primitives", value: "Radix UI Components" },
      { label: "Slider Components", value: "Embla Carousel" },
      { label: "Vector Icons", value: "Lucide & Phosphor" },
      { label: "Performance", value: "Vercel Analytics & Speed Insights" },
      { label: "Mathematical Text", value: "Streamdown Math/Mermaid" },
      { label: "Code Comparisons", value: "Pierre Diffs Integration" },
    ],
    placeholderVideo: "/Video's/PROJECT SYNC - Portfolio/SYNC.mp4",
    description: "**Building from Scratch:** Project SYNC is a complete, ground-up rebuild of my portfolio. As a student, I wanted to push my limits and see if I could build a site that feels just as premium as the tools I use every day. I built the entire foundation on Next.js 16 and React 19. I also forced myself to strictly use TypeScript—it was tough at first, but it completely changed how I write code by catching bugs before they even happen. I learned how to use Next.js's server-side rendering to make sure the site loads incredibly fast, even with all the heavy animations.\n**Customizing the Design:** I used Tailwind CSS and Shadcn UI as my starting point, but I didn't want it to look like a generic template. I spent a lot of time digging into the code to customize the components, aiming for a modern brutalist and glassmorphic vibe. I actually figured out how to write custom CSS variables that automatically recalculate colors and blur filters depending on whether the user is in light or dark mode, which was a huge breakthrough for me!\n**Fluid Animations:** I wanted the portfolio to feel alive. I integrated Framer Motion and GSAP to handle everything from page transitions to tiny micro-interactions (like hovering over buttons). Instead of just using basic fade-ins, I spent hours tweaking the spring physics and staggered delays. I even mapped out the timing mathematically so the animations feel organic and satisfying instead of stiff.\n**Advanced Visual Effects:** I really wanted to challenge myself visually, so I started experimenting with WebGL and Three.js. I built a custom canvas-based particle engine that reacts to the cursor, and I learned how to create text-scrambling effects for titles. To make sure these crazy effects didn't lag the site, I had to learn about rendering performance. I figured out how to move the heavy math calculations over to the GPU using custom shaders, keeping the main website running at a buttery smooth 60fps!\n**Integrating Artificial Intelligence:** One of the coolest parts of this project was integrating AI! I used the Vercel AI SDK to build a custom Command Menu (CMDK) that has a built-in 'Ask AI' tool. You can literally ask my portfolio questions, and it streams real-time answers right into the UI. I had to learn how to write secure backend edge functions so that my secret system prompts and API keys stay completely hidden from the browser.\n**Code & Data Presentation:** Since my AI sometimes outputs code, I learned how to use Streamdown and Shiki to make the code blocks look beautiful with syntax highlighting. I also wanted to show off my coding activity, so I built a feature that pulls my live GitHub contribution graph. I wrote custom API routes that safely fetch and cache my GitHub data, and then I wrote the logic to draw those little green contribution squares perfectly on the screen.\n**Interactive UI Elements:** Beyond just looks, I wanted the site to be fun to use. I built a custom Figma highlight section where you can actually drag and drop things around using `dnd-kit`. Learning how to manage all these different interactions without breaking the site was hard, so I had to learn how to write custom React hooks. This helped me keep my code clean and prevented the website from freezing up when too many things were happening at once.\n**Pixel-Perfect Layouts:** I engineered the layout grids entirely from scratch. A great example is the tech stack section where the borders have tiny intersection dots at the corners. I had to write a script that mathematically calculates the exact width and height of the boxes and perfectly places the dots on the corners, no matter if you're on a giant monitor or a tiny phone screen. Seeing it all line up perfectly was one of the most rewarding parts of the build!",
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
