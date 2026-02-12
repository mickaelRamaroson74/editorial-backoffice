import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi, categoriesApi, networksApi, notificationsApi, dashboardApi } from '@/services/api';
import { useStore } from '@/store/useStore';
import type { Article, ArticleFilters, Category } from '@/types';

// Query keys
export const queryKeys = {
  articles: (filters?: Partial<ArticleFilters>) => ['articles', filters] as const,
  article: (id: string) => ['article', id] as const,
  categories: ['categories'] as const,
  networks: ['networks'] as const,
  notifications: ['notifications'] as const,
  dashboard: ['dashboard'] as const,
};

// ─── Articles ─────────────────────────────────────────────────────────────────

export function useArticlesQuery() {
  const filters = useStore((state) => state.filters);
  
  return useQuery({
    queryKey: queryKeys.articles(filters),
    queryFn: () => articlesApi.getAll({
      search: filters.search,
      status: filters.status,
      categories: filters.categories,
      network: filters.network,
      featured: filters.featured,
      page: filters.page,
      perPage: filters.perPage,
    }),
    staleTime: 30000, // 30 seconds
  });
}

export function useArticleQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.article(id),
    queryFn: () => articlesApi.getById(id),
    enabled: !!id,
  });
}

export function useArticleMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Partial<Article>) => articlesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Article> }) =>
      articlesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => articlesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  const bulkUpdateStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: Article['status'] }) =>
      articlesApi.bulkUpdateStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  const importMutation = useMutation({
    mutationFn: (articles: Partial<Article>[]) => articlesApi.importJson(articles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    bulkUpdateStatus: bulkUpdateStatusMutation,
    import: importMutation,
  };
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => categoriesApi.getAll(),
    staleTime: 60000, // 1 minute
  });
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
  };
}

// ─── Networks ─────────────────────────────────────────────────────────────────

export function useNetworksQuery() {
  return useQuery({
    queryKey: queryKeys.networks,
    queryFn: () => networksApi.getAll(),
    staleTime: 60000, // 1 minute
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function useNotificationsQuery() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => notificationsApi.getAll(),
    staleTime: 30000, // 30 seconds
  });
}

export function useDashboardQuery() {
  const setDashboardData = useStore((s) => s.setDashboardData);
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
      return res.data;
    },
    staleTime: 60000, // 1 minute
  });
}

export function useNotificationMutations() {
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: (data: { articleId: string; recipients: string[]; subject: string }) =>
      notificationsApi.send(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });

  return {
    send: sendMutation,
  };
}
