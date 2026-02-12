import axios from 'axios';
import type { Article, Category, Network, EmailNotification } from '@/types';

// Backend response wrapper type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface DashboardData {
  articles: Article[];
  categories: Category[];
  networks: Network[];
  notifications: EmailNotification[];
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Erreur inconnue';
    return Promise.reject(new Error(message));
  }
);

export const articlesApi = {
  getAll: (params?: {
    search?: string;
    status?: string;
    categories?: string[];
    network?: string;
    featured?: boolean | null;
    page?: number;
    perPage?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params?.categories && params.categories.length > 0) {
      queryParams.append('categories', params.categories.join(','));
    }
    if (params?.network) queryParams.append('network', params.network);
    if (params?.featured !== null && params?.featured !== undefined) {
      queryParams.append('featured', String(params.featured));
    }
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.perPage) queryParams.append('perPage', String(params.perPage));
    
    const url = `/articles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ApiResponse<Article[]>>(url).then(r => r.data);
  },
  getById: (id: string) => api.get<ApiResponse<Article>>(`/articles/${id}`).then(r => r.data.data),
  create: (data: Partial<Article>) => api.post<ApiResponse<Article>>('/articles', data).then(r => r.data.data),
  update: (id: string, data: Partial<Article>) => api.put<ApiResponse<Article>>(`/articles/${id}`, data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/articles/${id}`),
  bulkUpdateStatus: (ids: string[], status: Article['status']) =>
    api.patch<ApiResponse<void>>('/articles/bulk-status', { ids, status }).then(r => r.data),
  importJson: (articles: Partial<Article>[]) =>
    api.post<ApiResponse<{ success: number; errors: string[] }>>('/articles/import', { articles }).then(r => r.data.data),
};

export const categoriesApi = {
  getAll: () => api.get<ApiResponse<Category[]>>('/categories').then(r => r.data.data),
  create: (data: Partial<Category>) => api.post<ApiResponse<Category>>('/categories', data).then(r => r.data.data),
  update: (id: string, data: Partial<Category>) => api.put<ApiResponse<Category>>(`/categories/${id}`, data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const networksApi = {
  getAll: () => api.get<ApiResponse<Network[]>>('/networks').then(r => r.data.data),
};

export const notificationsApi = {
  getAll: () => api.get<ApiResponse<EmailNotification[]>>('/notifications').then(r => r.data.data),
  send: (data: { articleId: string; recipients: string[]; subject: string }) =>
    api.post<ApiResponse<EmailNotification>>('/notifications', data).then(r => r.data.data),
};

export const dashboardApi = {
  getStats: () => api.get<ApiResponse<DashboardData>>('/dashboard/stats').then(r => r.data),
};

export default api;
