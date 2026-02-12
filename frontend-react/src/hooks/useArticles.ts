import { useMemo } from 'react';
import type { Article, Category, Network } from '@/types';

// This hook is now deprecated - filtering is done on the backend
// Kept for backward compatibility but data comes from React Query
export function useFilteredArticles(articles: Article[], totalPages: number, total: number) {
  return {
    filtered: articles,
    paginated: articles,
    totalPages,
    total,
  };
}

export function useDashboardStats(
  articles: Article[],
  categories: Category[],
  networks: Network[]
) {
  return useMemo(() => {
    const byStatus = { draft: 0, published: 0, archived: 0 };
    const byNetwork: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    networks.forEach((n) => { byNetwork[n.name] = 0; });
    categories.forEach((c) => { byCategory[c.name] = 0; });

    articles.forEach((a) => {
      byStatus[a.status]++;
      const net = networks.find((n) => n.id === a.network);
      if (net) byNetwork[net.name] = (byNetwork[net.name] || 0) + 1;
      
      const articleCategories = a.categories || [];
      articleCategories.forEach((catOrId) => {
        if (typeof catOrId === 'string') {
          const cat = categories.find((c) => c.id === catOrId);
          if (cat) byCategory[cat.name] = (byCategory[cat.name] || 0) + 1;
        } else if (catOrId && typeof catOrId === 'object' && catOrId.name) {
          byCategory[catOrId.name] = (byCategory[catOrId.name] || 0) + 1;
        }
      });
    });

    return { totalArticles: articles.length, byStatus, byNetwork, byCategory };
  }, [articles, categories, networks]);
}
