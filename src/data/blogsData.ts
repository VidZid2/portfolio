import { type TechKey } from "@/data/projectsData";

export interface Blog {
  title: string;
  description: string;
  date: string;
  claps: number;
  tags: string[];
  techIcons: TechKey[];
  link: string;
  isExternal: boolean;
}

export const blogsData: Blog[] = [];
