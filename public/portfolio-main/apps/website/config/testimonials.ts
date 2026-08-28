export type Testimonial = {
  id: string;
  quote: string;
  authorName: string;
  authorTagline: string;
  authorAvatar?: string;
  url?: string;
  date: string;
  isFeatured?: boolean;
};

/**
 * TESTIMONIALS_ROW_1: Long quotes (more than 50 characters)
 * TESTIMONIALS_ROW_2: Short quotes (50 characters or fewer)
 */

export const TESTIMONIALS_ROW_1: Testimonial[] = [];

export const TESTIMONIALS_ROW_2: Testimonial[] = [];
