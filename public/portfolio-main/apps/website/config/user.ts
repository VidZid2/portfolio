import { type Experience, experiences } from './experience';

export type User = {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  location: string;
  domain: string;
  website?: string;
  description: string;
  jobTitle: string;
  twitterHandle: string;
  namePronunciationUrl: string;
  username: string;
  tagline: string;
  social: {
    twitter: string;
    github: string;
    linkedin: string;
    bluesky: string;
  };
  image: {
    profile: string;
  };
  flipSentences: string[];
  experiences?: Experience[];
};

const USER: User = {
  firstName: 'Ruixen',
  lastName: '',
  name: 'Ruixen',
  email: 'support@ruixen.com',
  domain: 'portfolio-ruixens-projects.vercel.app',
  jobTitle: 'UI Engineering Studio',
  username: 'SriSomanaath',
  tagline: 'Ruixen — Crafting tools people actually want to use',
  twitterHandle: '@ruixen_ui',
  location: 'Vancouver, Canada',
  description:
    'Notes on building thoughtful products, navigating frontend architecture, and figuring out what good software really looks like.',
  namePronunciationUrl: '',
  social: {
    twitter: 'https://x.com/ruixen_ui',
    github: 'https://github.com/SriSomanaath',
    linkedin: '',
    bluesky: '',
  },
  flipSentences: [
    'Crafting tools people actually want to use.',
    'Frontend architecture & design systems.',
    'Developer tooling, done thoughtfully.',
    'Building with intention.',
    'A UI engineering studio.',
  ],
  image: {
    profile: 'https://github.com/SriSomanaath.png',
  },
  experiences: experiences,
};

USER.website = `https://${USER.domain}`;

export { USER };
