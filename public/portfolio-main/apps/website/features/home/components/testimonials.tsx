'use client';

import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
} from '@/components/testimonial';
import {
  TESTIMONIALS_ROW_1,
  TESTIMONIALS_ROW_2,
  type Testimonial as TestimonialType,
} from '@/config/testimonials';

function compareFn(a: TestimonialType, b: TestimonialType) {
  return a.date.localeCompare(b.date, undefined, { numeric: true });
}

function TestimonialCard({
  authorAvatar,
  authorName,
  authorTagline,
  quote,
}: TestimonialType) {
  return (
    <Testimonial>
      <TestimonialQuote className="min-h-14">
        <p>{quote}</p>
      </TestimonialQuote>
      <TestimonialAuthor>
        <TestimonialAvatar>
          <TestimonialAvatarImg src={authorAvatar} alt={authorName} />
          <TestimonialAvatarRing />
        </TestimonialAvatar>
        <TestimonialAuthorName>{authorName}</TestimonialAuthorName>
        <TestimonialAuthorTagline>{authorTagline}</TestimonialAuthorTagline>
      </TestimonialAuthor>
    </Testimonial>
  );
}

function TestimonialMarquee({
  data,
  reverse = false,
}: {
  data: TestimonialType[];
  reverse?: boolean;
}) {
  const items = [...data].sort(compareFn);
  // Duplicate items for seamless loop
  const allItems = [...items, ...items];

  return (
    <div className="group relative w-full overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-background to-transparent" />

      <div
        className="flex w-max gap-2 group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee-scroll ${items.length * 5}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {allItems.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="w-[16rem] shrink-0"
          >
            <div className="h-full rounded-xl ring-1 ring-foreground/10 transition-colors ease-out ring-inset hover:bg-accent/50">
              <TestimonialCard {...item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <div>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      {/* Marquee rows — constrained to content width */}
      <div className="overflow-hidden">
        <div className="space-y-2">
          {/* Marquee row 1 — long quotes, scroll left */}
          <TestimonialMarquee data={TESTIMONIALS_ROW_1} />

          {/* Marquee row 2 — short quotes, scroll right */}
          <TestimonialMarquee data={TESTIMONIALS_ROW_2} reverse />
        </div>
      </div>
    </div>
  );
}
