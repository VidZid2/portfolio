import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

import type { BlogMetadata, BlogPost } from '@/features/blog/types/post';

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent);
  return {
    metadata: file.data as BlogMetadata,
    content: file.content,
  };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map<BlogPost>((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));
    return { metadata, slug, content };
  });
}

export async function getAllBlogPosts() {
  const posts = getMDXData(
    path.join(process.cwd(), 'features/blog/content')
  ).sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );

  return posts.filter((post) => post.metadata.published);
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug);
}
