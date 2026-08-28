export type Project = {
  /** Stable unique identifier (used as list key/anchor). */
  id: string;
  title: string;
  /**
   * Project period for display and sorting.
   * Use "MM.YYYY" format. Omit `end` for ongoing projects.
   */
  period: {
    /** Start date (e.g., "05.2025"). */
    start: string;
    /** End date; leave undefined for "Present". */
    end?: string;
  };
  /** Public URL (site, repository, demo, or video). */
  link: string;
  /** Github repository URL. */
  github?: string;
  /** Tags/technologies for chips or filtering. */
  skills: string[];
  /** Short one-line description for list view. */
  shortDescription?: string;
  /** Optional rich description; Markdown and line breaks supported. */
  description?: string;
  /** Logo image URL (absolute or path under /public). */
  logo?: string;
  /** Whether the project card is expanded by default in the UI. */
  isExpanded?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: 'palettebox',
    title: 'PaletteBox',
    period: {
      start: '03.2025',
    },
    link: 'https://palettebox.design/',
    logo: '/project_images/ruixen_ui_logo.jpeg',
    skills: [
      'Next.js',
      'TypeScript',
      'React',
      'Tailwind CSS',
      'Figma API',
    ],
    shortDescription:
      'A design token manager that syncs Figma variables to code in real time.',
    description: `A bridge between design and engineering workflows.

Features include:
- Two-way sync between Figma variables and CSS/Tailwind tokens
- Visual diff viewer for design changes
- CLI for CI/CD integration
- Team collaboration with role-based access`,
    isExpanded: true,
  },
  {
    id: 'hookshelf',
    title: 'HookShelf',
    period: {
      start: '09.2024',
    },
    link: 'https://hookshelf.dev/',
    logo: '/project_images/shadcnagents.png',
    skills: ['React', 'TypeScript', 'Storybook', 'Vitest', 'npm'],
    shortDescription:
      'A curated collection of production-ready React hooks with interactive docs.',
  },
  {
    id: 'tablewise',
    title: 'Tablewise',
    period: {
      start: '01.2024',
      end: '08.2024',
    },
    link: 'https://tablewise.app/',
    logo: '/project_images/source_of_truth.png',
    skills: [
      'Next.js',
      'PostgreSQL',
      'Prisma',
      'tRPC',
      'Stripe',
    ],
    shortDescription:
      'A lightweight database explorer and query builder for non-technical teams.',
  },
];
