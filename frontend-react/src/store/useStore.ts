import { create } from 'zustand';
import type { Article, Category, Network, EmailNotification, ArticleFilters } from '@/types';
import type { DashboardData } from '@/services/api';

interface AppState {
  // Data (now managed by React Query, but kept in store for compatibility)
  articles: Article[];
  categories: Category[];
  networks: Network[];
  notifications: EmailNotification[];

  // UI State
  loading: boolean;
  error: string | null;

  // Consolidated Data
  dashboardData: DashboardData | null;

  // Filters
  filters: ArticleFilters;
  selectedArticles: string[];

  // Actions
  setArticles: (articles: Article[]) => void;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, data: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  bulkUpdateStatus: (ids: string[], status: Article['status']) => void;

  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addNotification: (notification: EmailNotification) => void;

  setFilters: (filters: Partial<ArticleFilters>) => void;
  resetFilters: () => void;
  setSelectedArticles: (ids: string[]) => void;
  toggleArticleSelection: (id: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDashboardData: (data: DashboardData | null) => void;
}

const defaultFilters: ArticleFilters = {
  search: '',
  status: 'all',
  categories: [],
  network: '',
  featured: null,
  page: 1,
  perPage: 20,
};

export const useStore = create<AppState>((set) => ({
  // Initialize with empty arrays - data will come from React Query
  articles: [],
  categories: [],
  networks: [],
  notifications: [],
  loading: false,
  error: null,
  filters: defaultFilters,
  selectedArticles: [],
  dashboardData: null,

  setArticles: (articles) => set({ articles }),
  addArticle: (article) => set((s) => ({ articles: [article, ...s.articles] })),
  updateArticle: (id, data) => set((s) => ({
    articles: s.articles.map((a) => (a.id === id ? { ...a, ...data, updatedAt: new Date() } : a)),
  })),
  deleteArticle: (id) => set((s) => ({
    articles: s.articles.filter((a) => a.id !== id),
    selectedArticles: s.selectedArticles.filter((sid) => sid !== id),
  })),
  bulkUpdateStatus: (ids, status) => set((s) => ({
    articles: s.articles.map((a) => (ids.includes(a.id) ? { ...a, status, updatedAt: new Date() } : a)),
    selectedArticles: [],
  })),

  setCategories: (categories) => set({ categories }),
  addCategory: (category) => set((s) => ({ categories: [...s.categories, category] })),
  updateCategory: (id, data) => set((s) => ({
    categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
  })),
  deleteCategory: (id) => set((s) => ({
    categories: s.categories.filter((c) => c.id !== id),
  })),

  addNotification: (notification) => set((s) => ({ notifications: [notification, ...s.notifications] })),

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters, page: filters.page ?? 1 } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setSelectedArticles: (ids) => set({ selectedArticles: ids }),
  toggleArticleSelection: (id) => set((s) => ({
    selectedArticles: s.selectedArticles.includes(id)
      ? s.selectedArticles.filter((sid) => sid !== id)
      : [...s.selectedArticles, id],
  })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setDashboardData: (dashboardData) => set({ dashboardData, articles: dashboardData?.articles || [], categories: dashboardData?.categories || [], networks: dashboardData?.networks || [], notifications: dashboardData?.notifications || [] }),
}));
