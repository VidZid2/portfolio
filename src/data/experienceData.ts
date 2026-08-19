export type ExperienceData = {
  title: string;
  role: string;
  dates: string;
  location: string;
  src: string;
  type?: string;
  imageFit?: "contain" | "cover";
  imageZoom?: number;
  tldr?: string;
  description: string;
  tech: string[];
  metrics?: { label: string; value: string }[];
  screenshot?: string;
  darkScreenshot?: string;
};

export const experiences: ExperienceData[] = [
  {
    title: "PRIMA Digital Technology Solutions",
    role: "Front-End Engineer & UI Architect",
    dates: "2025 – Present",
    location: "Client Engagement (Remote)",
    type: "Commercial Project",
    src: "/PRIMA.png",
    screenshot: "/PRIMA Landing Page.png",
    darkScreenshot: "/PRIMA Landing Page.png",
    imageFit: "cover",
    imageZoom: 1.15,
    tldr: "Architected a high-conversion, performance-optimized digital agency platform with custom Framer Motion transitions and strict mobile budgets.",
    description: `
      **Partnered with an industry mentor** to engineer the complete digital presence for PRIMA Digital Agency—a real B2B firm requiring an ultra-polished, high-conversion web platform.
      **Engineered modular component architecture** using **Next.js, TypeScript, and Tailwind CSS**, replacing rigid templates with bespoke, reusable UI systems.
      **Designed and implemented custom motion physics** using **Framer Motion and Lenis smooth scrolling**, balancing high-fidelity interactive visual flair with strict 60fps rendering budgets on mobile devices.
      **Optimized performance & accessibility**, achieving near-perfect Lighthouse scores, zero cumulative layout shift (0 CLS), and sub-50ms interaction response times.
    `,
    tech: [
      "Next.js",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "Lenis",
      "Component Architecture",
      "Git"
    ],
    metrics: [
      { label: "Performance", value: "98+ Lighthouse" },
      { label: "Interaction", value: "Sub-50ms Latency" },
      { label: "Stability", value: "0 CLS (Zero Shift)" },
    ],
  },
  {
    title: "STI eLMS 2.0",
    role: "Full-Stack Systems Developer",
    dates: "2025 – 2026",
    location: "STI College Meycauayan",
    type: "Systems Architecture",
    src: "/STI.png",
    imageFit: "cover",
    imageZoom: 1,
    tldr: "Architected a next-gen learning management platform with React 19, Supabase Row Level Security (RLS), and AES-256 encrypted storage.",
    description: `
      **Initiated and engineered a comprehensive overhaul** of the institutional STI eLMS system to demonstrate modern, high-speed UX for educational platforms.
      **Architected a modular client-side state machine** with **React 19, Vite, and Tailwind CSS**, delivering instantaneous page transitions, persistent dark mode, and optimistic UI updates.
      **Engineered backend security and authorization** in **Supabase**, configuring fine-grained **Row Level Security (RLS) policies** and **AES-256 data encryption** to protect student data against unauthorized access.
      **Benchmarked and optimized rendering pipelines**, eliminating redundant re-renders and reducing initial bundle footprint for seamless performance across low-end mobile hardware.
    `,
    tech: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Supabase",
      "Row Level Security (RLS)",
      "AES-256 Encryption",
      "REST APIs",
      "Git"
    ],
    metrics: [
      { label: "Security", value: "RLS & AES-256" },
      { label: "Data Flow", value: "Optimistic UI" },
      { label: "Focus", value: "Zero Re-Render Lag" },
    ],
  },
  {
    title: "JILCF Uniform Management System",
    role: "Lead Full-Stack Developer",
    dates: "2025",
    location: "Academic Capstone (ICT Major)",
    type: "Academic Capstone",
    src: "/JILCF Logo.jpg",
    screenshot: "/JILCF Uniform System 2025.png",
    darkScreenshot: "/JILCF Uniform System 2025 DARKMODE.png",
    imageFit: "contain",
    imageZoom: 1.1,
    tldr: "Built a full-stack real-time Uniform Inventory System in under 3 weeks using Python, Flask, SQLite, and WebSockets.",
    description: `
      **Successfully concluded** Senior High School ICT Capstone by architecting a production-ready **Uniform Inventory Management System** from scratch in under 3 weeks.
      **Engineered a Python/Flask backend** with SQLite relational database indexing, secure session handling, and role-based access control (RBAC).
      **Integrated Flask-SocketIO (WebSockets)** to broadcast **instant multi-client state updates**, ensuring inventory stock counts sync live across all staff screens without manual refresh.
      **Designed a clean, responsive data dashboard** using vanilla JavaScript and CSS Grid/Flexbox for rapid administrative workflow.
    `,
    tech: [
      "Python",
      "Flask",
      "WebSockets",
      "SQLite",
      "JavaScript",
      "HTML5",
      "CSS3"
    ],
    metrics: [
      { label: "Data Sync", value: "Live WebSockets" },
      { label: "Architecture", value: "Role-Based Auth" },
      { label: "Delivery", value: "Under 21 Days" },
    ],
  },
  {
    title: "Startlink (Entrepreneurship Project)",
    role: "Lead Web Developer",
    dates: "2024 – 2025",
    location: "Senior High (JILCF)",
    type: "Entrepreneurship Project",
    src: "/JILCF Logo.jpg",
    screenshot: "/STARTLINK 2024-2025.png",
    darkScreenshot: "/STARTLINK 2024-2025 DARKMODE.png",
    imageFit: "contain",
    imageZoom: 1.1,
    tldr: "Designed and launched my first web project during Senior High School for an Entrepreneurship class, learning HTML, CSS, and JS to build a custom password entropy validator.",
    description: `
      **Ignited my coding journey** during Senior High School by creating a complete interactive website for my Entrepreneurship class instead of a standard slide deck.
      **Launched my first real web deployment** with **"Startlink"**, mastering HTML, CSS, and JavaScript fundamentals to bring custom interactive logic to life.
      **Engineered a custom real-time password entropy calculation algorithm** in JavaScript, providing immediate visual security feedback (Weak, Good, Strong) to users.
      **Implemented user authentication and dynamic form flows**, setting the foundation for my passion for frontend systems and user experience design.
    `,
    tech: [
      "JavaScript",
      "HTML5",
      "CSS3",
      "Wix Velo",
      "UI Design"
    ],
    metrics: [
      { label: "1st Web Project", value: "Senior High" },
      { label: "Algorithm", value: "Entropy Validator" },
    ],
  }
];
