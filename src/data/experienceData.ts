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
    title: "STI eLMS 2.0",
    role: "Passionate Front-End Developer",
    dates: "2025 – 2026 (1st Year)",
    location: "STI College Meycauayan",
    src: "/STI.png",
    imageFit: "cover",
    imageZoom: 1,
    tldr: "Self-taught modern web development (React, Next.js, Supabase) and re-architected a static site into a 21k+ line scalable LMS application.",
    description: `
      **During my first year as a BSIT student**, I realized that to truly stand out, I needed to go beyond the standard classroom curriculum. I started my self-taught journey with basic HTML, CSS, and JavaScript, building simple layouts to understand the fundamentals of the web.
      **However, my curiosity quickly pushed me toward modern frameworks.** I dedicated countless hours after classes to learning **React, TypeScript, and version control using Git**. To accelerate my learning, I started integrating AI coding assistants into my workflow—not to write the code for me, but to act as a mentor. It explained complex concepts and helped me debug faster, allowing me to focus on software architecture instead of just syntax.
      **One of my biggest milestones was revisiting my very first project, PRIMA.** What started as a basic HTML/CSS site became my ultimate testing ground. Over time, I completely re-architected the platform into a full Next.js application. Through trial and error, I taught myself how to implement complex animations using **Framer Motion**, build clean UI components, and optimize performance for lower-end mobile devices. Seeing PRIMA evolve from a simple static page to a robust, 21,000+ line web app was a massive validation of my hard work.
      **Alongside PRIMA, I also poured my energy into eLMS 2.0**—a complete, modernized overhaul of the STI eLMS system. I wanted to prove that school software doesn't have to be clunky. I focused on building a highly interactive interface with fluid page transitions, dark mode support, and a clean, component-driven architecture.
      **On the backend, I challenged myself to learn Supabase** for database management and user authentication. Recognizing the importance of security, I researched and implemented **Row Level Security (RLS)** and **AES encryption** to protect sensitive student data.
      **Overall, my first year wasn't just about writing code**—it was a journey of constant learning, breaking things, and building them back better.
    `,
    tech: [
      "HTML",
      "CSS",
      "TypeScript",
      "React 19",
      "Next.js",
      "Tailwind CSS",
      "Vite",
      "Framer Motion",
      "Supabase",
      "Git"
    ],
    metrics: [
      { label: "Lines of Code", value: "21k+" },
      { label: "Security", value: "RLS & AES" },
      { label: "Focus", value: "Architecture" },
    ],
  },
  {
    title: "JILCF Uniform Management System (Capstone)",
    role: "Lead Developer (Grade 12 TVL - ICT Major)",
    dates: "2025",
    location: "Academic",
    src: "/JILCF Logo.jpg",
    screenshot: "/JILCF Uniform System 2025.png",
    darkScreenshot: "/JILCF Uniform System 2025 DARKMODE.png",
    imageFit: "contain",
    imageZoom: 1.1,
    tldr: "Built a full-stack real-time Uniform Inventory System in under 3 weeks using Python, Flask, and WebSockets for my final capstone.",
    description: `
      **Successfully concluded** my Senior High School journey by building a complete **Uniform Inventory System** for my final ICT Capstone project.
      **Remarkably**, I architected and developed this entire full-stack platform from scratch in **less than 3 weeks**!
      **On the frontend**, I utilized **HTML, CSS, and JavaScript** to create an intuitive interface with organized data tables and smooth navigation flows.
      **Behind the scenes**, I engineered a robust backend using **Python and Flask**, securely storing and managing school inventory data in a local **SQLite** database.
      **Most importantly**, I integrated **Flask-SocketIO (WebSockets)** to broadcast **real-time live updates**, ensuring any inventory changes instantly reflected across all screens without reloading.
      **Additionally**, I built a secure **role-based authentication** system to protect administrative access, marking a massive leap in my coding skills.
    `,
    tech: [
      "HTML",
      "CSS",
      "JavaScript",
      "Python",
      "Flask",
      "SQLite",
      "WebSockets"
    ],
    metrics: [
      { label: "Development Speed", value: "Under 21 Days" },
      { label: "Data Sync", value: "Live WebSockets" },
    ],
  },
  {
    title: "Startlink (Entrepreneurship Project)",
    role: "Lead Developer (Grade 11 TVL - Drafting)",
    dates: "2024 - 2025",
    location: "Academic",
    src: "/JILCF Logo.jpg",
    screenshot: "/STARTLINK 2024-2025.png",
    darkScreenshot: "/STARTLINK 2024-2025 DARKMODE.png",
    imageFit: "contain",
    imageZoom: 1.1,
    tldr: "Launched my first web deployment for an entrepreneurship class, learning HTML and JS to build a custom password strength indicator and business plan site.",
    description: `
      **Ignited my coding journey** by choosing to build a fully functional website for my Entrepreneurship class instead of a standard application.
      **Consequently**, I designed and launched **"Startlink"**—a complete business plan platform that became my **very first successful website deployment**.
      **To enhance security**, I engineered a custom **password strength indicator** that instantly evaluated user input to show real-time visual feedback (Weak, Good, Excellent).
      **Furthermore**, I implemented **secure user authentication** and account-saving functionality using Wix's built-in coding features.
      **Ultimately**, this project helped me master the fundamentals of web development, where I independently learned **HTML** and **JavaScript** to bring custom logic to life.
    `,
    tech: [
      "HTML",
      "JavaScript",
      "Wix Velo",
      "Web Design"
    ],
    metrics: [
      { label: "1st Deployment", value: "Wix Velo" },
      { label: "Custom Logic", value: "HTML & JS" },
    ],
  }
];
