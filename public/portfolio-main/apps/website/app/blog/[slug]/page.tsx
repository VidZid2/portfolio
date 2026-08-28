import { MDX } from '@/components/mdx';
import { FloatingHeader } from '@/components/navigation/floating-header';
import { ScrollArea } from '@/components/scroll-area';
import { USER } from '@/config/user';
import { getAllBlogPosts, getBlogPostBySlug } from '@/features/blog/data/posts';
import { createOgImage } from '@/lib/createOgImage';
import { BlogPosting, JsonLd, WithContext } from '@/lib/seo/json-ld';
import { createMetadata } from '@/lib/seo/metadata';
import { Prose } from '@repo/design-system/components/ui/typography';
import dayjs from 'dayjs';
import { ArrowLeftIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';
export const dynamicParams = false;

export const generateStaticParams = async () => {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { title, date, description } = post.metadata;

  const ogImage = createOgImage({
    title,
    meta: `${USER.domain} · ${date}`,
  });

  return createMetadata({ title, description, image: ogImage });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { title, date, description, category, readTime } = post.metadata;

  const jsonLd: WithContext<BlogPosting> = {
    '@type': 'BlogPosting',
    '@context': 'https://schema.org',
    datePublished: dayjs(date).toISOString(),
    description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': new URL(`/blog/${post.slug}`, USER.website).toString(),
    },
    headline: title,
    image: post.metadata.image,
    dateModified: dayjs(date).toISOString(),
    author: USER.name,
    isAccessibleForFree: true,
  };

  return (
    <>
      <JsonLd code={jsonLd} />
      <ScrollArea useScrollAreaId>
        <FloatingHeader scrollTitle={title} />
        <div className="layout relative z-10 content-wrapper">
          <div className="mx-auto w-full">
            <Link
              href="/blog"
              className="mb-6 hidden items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground lg:inline-flex"
            >
              <ArrowLeftIcon size={14} />
              <span>All posts</span>
            </Link>
            <div className="mb-8">
              <h1 className="scroll-m-20 font-bold text-xl tracking-tight">
                {title}
              </h1>
              <div className="mt-2 flex items-center gap-3 text-muted-foreground text-sm">
                <span className="rounded-full border px-2 py-0.5 text-xs">
                  {category}
                </span>
                <span>{readTime}</span>
                <span>
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <Prose className="pb-12">
              <p className="lead mt-6 mb-6">{description}</p>
              <MDX code={post.content} />
            </Prose>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
