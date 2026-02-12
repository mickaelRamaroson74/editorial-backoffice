export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  categories: string[] | Category[];
  categoryIds?: string[]; // Used for API updates
  network: string;
  status: ArticleStatus;
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface Network {
  id: string;
  name: string;
  description: string;
}

export interface EmailNotification {
  id: string;
  articleId: string;
  recipients: string[];
  subject: string;
  sentAt: Date;
  status: 'sent' | 'failed';
}

export interface ArticleFilters {
  search: string;
  status: ArticleStatus | 'all';
  categories: string[];
  network: string;
  featured: boolean | null;
  page: number;
  perPage: number;
}

export interface DashboardStats {
  totalArticles: number;
  byStatus: Record<ArticleStatus, number>;
  byNetwork: Record<string, number>;
  byCategory: Record<string, number>;
}
