import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (token !== process.env.REVALIDATION_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get('ref');

  if (!slug) {
    return NextResponse.json({ error: 'Ref is required' }, { status: 400 });
  }

  if (!slug.startsWith('/')) {
    return NextResponse.json(
      { error: 'Invalid path: must start with /' },
      { status: 400 }
    );
  }

  await revalidatePath(slug);

  return NextResponse.json({ revalidated: true });
}
