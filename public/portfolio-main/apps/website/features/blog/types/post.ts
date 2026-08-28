export type BlogMetadata = {
  title: string;
  description: string;
  date: string;
  author: string;
  published: boolean;
  category: string;
  readTime: string;
  image: string;
};

export type BlogPost = {
  metadata: BlogMetadata;
  slug: string;
  content: string;
};
