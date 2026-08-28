import { ENABLE_BUDDY } from '@/config/site';
import { getAllCrafts } from '@/features/craft/data/posts';
import { addPathToBaseURL } from '@/lib/server-url';
import dayjs from 'dayjs';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '/',
    '/cal',
    '/craft',
    '/blog',
  ].concat(ENABLE_BUDDY ? ['/buddy'] : []);

  const routesArray = await routes.map(async (route) => ({
    url: await addPathToBaseURL(route),
    lastModified: dayjs().toISOString(),
  }));

  const allCrafts = await getAllCrafts();
  const crafts = allCrafts.map(async (post) => ({
    url: await addPathToBaseURL(`/craft/${post.slug}`),
    lastModified: dayjs(post.metadata.date).toISOString(),
  }));

  const craftsResolved = await Promise.all(crafts);
  const routesArrayResolved = await Promise.all(routesArray);

  return [
    ...routesArrayResolved,
    ...craftsResolved,
  ];
}
