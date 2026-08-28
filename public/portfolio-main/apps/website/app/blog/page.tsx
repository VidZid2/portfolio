import { FloatingHeader } from '@/components/navigation/floating-header';
import { ScrollArea } from '@/components/scroll-area';
import { getAllBlogPosts } from '@/features/blog/data/posts';
import { createOgImage } from '@/lib/createOgImage';
import { Blog, JsonLd, WithContext } from '@/lib/seo/json-ld';
import { createMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Blog';
  const description =
    'Thoughts on software engineering, UI architecture, and building things that work.';

  const image = createOgImage({ title, meta: description });

  return createMetadata({ title, description, image });
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  const jsonLd: WithContext<Blog> = {
    '@type': 'Blog',
    '@context': 'https://schema.org',
  };

  return (
    <>
      <JsonLd code={jsonLd} />
      <ScrollArea useScrollAreaId>
        <FloatingHeader scrollTitle="Blog" />
        <div className="layout relative z-10 content-wrapper">
          <div className="mt-6 mb-12">
            <h1 className="mb-1 font-bold text-2xl tracking-tight">Blog</h1>
            <p className="mb-8 text-muted-foreground text-sm">
              Thoughts on software engineering, UI architecture, and building
              things that work.
            </p>
            <div className="flex flex-col gap-0">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-1 border-b border-dashed py-5 transition-colors hover:bg-accent/50 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <div className="flex-1">
                    <h2 className="font-medium text-sm leading-snug group-hover:underline">
                      {post.metadata.title}
                    </h2>
                    <p className="mt-1 line-clamp-1 text-muted-foreground text-xs">
                      {post.metadata.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-muted-foreground text-xs">
                    <span className="rounded-full border px-2 py-0.5">
                      {post.metadata.category}
                    </span>
                    <span>{post.metadata.readTime}</span>
                    <span>
                      {new Date(post.metadata.date).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
