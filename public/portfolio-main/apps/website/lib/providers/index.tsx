'use client';

import { DesignSystemProvider } from '@repo/design-system';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Provider as JotaiProvider } from 'jotai';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { SoundProvider } from '@/lib/contexts/sound-context';

export function Providers({
  children,
  session,
  ...props
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <DesignSystemProvider>
      <SessionProvider session={session}>
        <JotaiProvider>
          <SoundProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </SoundProvider>
        </JotaiProvider>
      </SessionProvider>
    </DesignSystemProvider>
  );
}
