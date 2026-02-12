import { z } from 'zod';

// ─── Article Schemas ──────────────────────────────────────────────────────────

export const CreateArticleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  author: z.string().min(1, 'Author is required'),
  network: z.string().min(1, 'Network ID is required'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  categoryIds: z.array(z.string()).optional(), // For connecting categories
});

export const UpdateArticleSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  author: z.string().optional(),
  network: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.boolean().optional(),
  publishedAt: z.string().datetime().nullable().optional(), // Expect ISO string
  categoryIds: z.array(z.string()).optional(),
});

export const ArticleQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  categories: z.string().optional(), // Comma-separated category IDs
  network: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  page: z.string().optional().default('1'),
  perPage: z.string().optional().default('20'),
});

// ─── Category Schemas ─────────────────────────────────────────────────────────

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  color: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, 'Invalid hex color'),
});

export const UpdateCategorySchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  color: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).optional(),
});

// ─── Network Schemas ──────────────────────────────────────────────────────────

export const CreateNetworkSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export const UpdateNetworkSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

// ─── EmailNotification Schemas ────────────────────────────────────────────────

export const CreateEmailNotificationSchema = z.object({
  articleId: z.string().uuid(),
  recipients: z.array(z.string().email()).min(1),
  subject: z.string().min(1),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type CreateArticleInput = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;
export type ArticleQueryInput = z.infer<typeof ArticleQuerySchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type CreateNetworkInput = z.infer<typeof CreateNetworkSchema>;
export type UpdateNetworkInput = z.infer<typeof UpdateNetworkSchema>;
export type CreateEmailNotificationInput = z.infer<typeof CreateEmailNotificationSchema>;

// ─── API Response Helpers ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message };
}

export function errorResponse(message: string, errors?: string[]): ApiResponse {
  return { success: false, message, errors };
}
