export type EducationBullet = {
  text: string;
  subBullets?: string[];
};

export type EducationBadge = {
  name: string;
  icon?: string;
  customSrc?: string;
  lucideIcon?: "award" | "binary" | "layers" | "shield" | "sparkles" | "code";
};

export type EducationData = {
  title: string;
  degree: string;
  dates: string;
  location: string;
  src: string;
  type?: string;
  href?: string;
  pdfUrl?: string;
  imageUrl?: string;
  imageFit?: "contain" | "cover";
  imageZoom?: number;
  bullets: EducationBullet[];
  badges: EducationBadge[];
};

export type CertificationData = {
  title: string;
  issuer: string;
  dates: string;
  type: string;
  iconName: "award" | "grad" | "code" | "shield" | "zap";
  href?: string;
  pdfUrl?: string;
  imageUrl?: string;
  bullets: EducationBullet[];
  badges: EducationBadge[];
};

export const educationList: EducationData[] = [
  {
    title: "STI College Meycauayan",
    degree: "Bachelor of Science in Information Technology (BSIT)",
    dates: "2025 – Present",
    location: "Meycauayan, Bulacan",
    type: "Undergraduate Degree",
    href: "https://www.sti.edu",
    src: "/STI.png",
    imageFit: "cover",
    imageZoom: 1,
    bullets: [
      { text: "Currently studying for a Bachelor's degree in Information Technology (BSIT), 1st Year." },
      { text: "Specializing in full-stack systems architecture, client-server engineering, and database security." },
      {
        text: "Key technical builds and project initiatives:",
        subBullets: [
          "STI eLMS 2.0 Overhaul — Modernized learning portal with React 19, Supabase RLS, and optimistic UI.",
          "Project SYNC — Custom WebGL shaders, zero-CLS UI component architecture, and responsive micro-interactions.",
        ],
      },
    ],
    badges: [
      { name: "React 19", icon: "react" },
      { name: "Next.js 16", icon: "nextdotjs" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Supabase", icon: "supabase" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Vercel", icon: "vercel" },
    ],
  },
  {
    title: "Jesus Is Lord Colleges Foundation (JILCF)",
    degree: "Senior High School — TVL (Information & Communications Technology)",
    dates: "2023 – 2025",
    location: "Bocaue, Bulacan",
    type: "With Honors",
    href: "https://jilcf.edu.ph",
    pdfUrl: "/certificates/senior-high/senior-high-honors-all.pdf",
    imageUrl: "/certificates/senior-high/g12-honors.jpg",
    src: "/JILCF Logo.jpg",
    imageFit: "contain",
    imageZoom: 1.1,
    bullets: [
      { text: "Graduated with Honors in the Technical-Vocational-Livelihood (TVL) Information & Communications Technology track." },
      { text: "Served as Lead Full-Stack Developer for Senior High School Capstone Project." },
      {
        text: "Achieved academic honors and leadership distinctions:",
        subBullets: [
          "Best in ICT Capstone Project 2025 — JILCF Uniform Inventory Management System.",
          "Lead Web Developer — Headed school exhibits and mentored peers in responsive CSS and backend APIs.",
        ],
      },
    ],
    badges: [
      { name: "Python", icon: "python" },
      { name: "Flask", icon: "flask" },
      { name: "SQLite", icon: "sqlite" },
      { name: "JavaScript", customSrc: "/SVG's/Stack SVG's/JavaScript.png" },
      { name: "HTML5", customSrc: "/SVG's/Stack SVG's/HTML.svg" },
      { name: "CSS3", customSrc: "/SVG's/Stack SVG's/CSS3.svg" },
      { name: "System Design", lucideIcon: "layers" },
      { name: "With Honors", lucideIcon: "award" },
    ],
  },
  {
    title: "Jesus Is Lord Colleges Foundation (JILCF)",
    degree: "Junior High School (High School Diploma)",
    dates: "2019 – 2023",
    location: "Bocaue, Bulacan",
    type: "With Honors",
    href: "https://jilcf.edu.ph",
    src: "/JILCF Logo.jpg",
    imageFit: "contain",
    imageZoom: 1.1,
    bullets: [
      { text: "Completed Junior High School education, graduating With Honors across Grade 8, Grade 9, and Grade 10." },
      { text: "Established early foundations in computer science, programming logic, and algorithm design." },
      { text: "Developed first web engineering projects using HTML5, CSS3, and JavaScript." },
      {
        text: "Key academic and technical milestones:",
        subBullets: [
          "Consistently awarded Academic Honors distinction for high performance across all quarters.",
          "Engineered first algorithmic utility — Interactive password entropy and validation tool.",
          "Participated in science and technology exhibits, demonstrating early web layouts and multimedia scripts.",
        ],
      },
    ],
    badges: [
      { name: "HTML5", customSrc: "/SVG's/Stack SVG's/HTML.svg" },
      { name: "CSS3", customSrc: "/SVG's/Stack SVG's/CSS3.svg" },
      { name: "JavaScript", customSrc: "/SVG's/Stack SVG's/JavaScript.png" },
      { name: "Algorithms", lucideIcon: "binary" },
      { name: "Web Fundamentals", lucideIcon: "layers" },
      { name: "With Honors", lucideIcon: "award" },
    ],
  },
];

export const certificationsList: CertificationData[] = [
  {
    title: "Tagisan ng Talino 2025–2026 — CodeFest Champion",
    issuer: "STI College Meycauayan",
    dates: "2025 – 2026",
    type: "Champion Award",
    iconName: "code",
    href: "/certificates/codefest/tagisan-ng-talino-2025.pdf",
    pdfUrl: "/certificates/codefest/tagisan-ng-talino-2025.pdf",
    imageUrl: "/certificates/codefest/tagisan-ng-talino-2025.jpg",
    bullets: [
      { text: "Awarded Champion in the annual STI Tagisan ng Talino CodeFest competition." },
      { text: "Achieved 1st Place victory in rapid algorithmic problem solving, software engineering, and live coding challenges." },
    ],
    badges: [
      { name: "Champion", lucideIcon: "award" },
      { name: "CodeFest", lucideIcon: "code" },
      { name: "Algorithms", lucideIcon: "binary" },
      { name: "STI Competition", lucideIcon: "sparkles" },
    ],
  },
  {
    title: "Consistent Academic Honors — Senior High School",
    issuer: "Jesus Is Lord Colleges Foundation (JILCF)",
    dates: "2023 – 2025",
    type: "Academic Distinction",
    iconName: "award",
    href: "/certificates/senior-high/senior-high-honors-all.pdf",
    pdfUrl: "/certificates/senior-high/senior-high-honors-all.pdf",
    imageUrl: "/certificates/senior-high/g12-honors.jpg",
    bullets: [
      { text: "Consistently awarded Academic Excellence With Honors standing across Senior High School (11 TVL-C & 12 TVL-C)." },
      {
        text: "Senior High School Academic Honors Breakdown:",
        subBullets: [
          "Grade 11 (S.Y. 2023 – 2024): Awarded With Honors for 1st Quarter (Nov 21, 2023) and 2nd Quarter (Jan 26, 2024).",
          "Grade 12 (S.Y. 2024 – 2025): Awarded With Honors for 1st Quarter (Nov 21, 2024).",
        ],
      },
    ],
    badges: [
      { name: "With Honors", lucideIcon: "award" },
      { name: "Grade 11 Honors (x2)", lucideIcon: "sparkles" },
      { name: "Grade 12 Honors", lucideIcon: "award" },
      { name: "TVL-ICT", lucideIcon: "layers" },
    ],
  },
  {
    title: "Consistent Academic Honors — Grade 8 to Grade 10",
    issuer: "Jesus Is Lord Colleges Foundation (JILCF)",
    dates: "2022 – 2024",
    type: "Academic Distinction",
    iconName: "award",
    href: "#",
    bullets: [
      { text: "Consistently awarded With Honors distinction from Grade 8 through Grade 10 completion." },
      { text: "Maintained high academic standing across all quarters with commendations in Science and Technology." },
    ],
    badges: [
      { name: "With Honors", lucideIcon: "award" },
      { name: "Grade 8–10 Honors", lucideIcon: "sparkles" },
      { name: "Junior High School", lucideIcon: "layers" },
    ],
  },
];
