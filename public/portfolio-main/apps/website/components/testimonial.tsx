import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Testimonial({ className, ...props }: ComponentProps<'figure'>) {
  return (
    <figure
      className={cn('flex h-full flex-col', className)}
      {...props}
    />
  );
}

export function TestimonialQuote({
  className,
  ...props
}: ComponentProps<'blockquote'>) {
  return (
    <blockquote
      className={cn(
        'grow px-4 py-3 text-base text-pretty text-foreground',
        className
      )}
      {...props}
    />
  );
}

export function TestimonialAuthor({
  className,
  ...props
}: ComponentProps<'figcaption'>) {
  return (
    <figcaption
      className={cn(
        'grid grid-cols-[auto_1fr] grid-rows-2 items-center gap-x-3.5 px-4 pt-1 pb-3',
        className
      )}
      {...props}
    />
  );
}

export function TestimonialAvatar({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn('relative row-span-2 size-8 shrink-0', className)}
      {...props}
    />
  );
}

export function TestimonialAvatarImg({
  className,
  src,
  alt,
  ...props
}: ComponentProps<'img'>) {
  return (
    <img
      className={cn('size-8 rounded-full select-none', className)}
      src={src}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
}

export function TestimonialAvatarRing({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/10 ring-inset dark:ring-white/15',
        className
      )}
      {...props}
    />
  );
}

export function TestimonialAuthorName({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-sm leading-4 font-semibold text-foreground',
        className
      )}
      {...props}
    />
  );
}

export function TestimonialAuthorTagline({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'text-xs leading-4 text-balance text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}
