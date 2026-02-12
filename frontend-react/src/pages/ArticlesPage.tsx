import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Trash2, Archive, Star, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useStore } from '@/store/useStore';
import { useArticlesQuery, useArticleMutations, useCategoriesQuery, useNetworksQuery } from '@/hooks/useArticlesQuery';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import type { ArticleStatus } from '@/types';

export default function ArticlesPage() {
  const navigate = useNavigate();
  const { filters, selectedArticles, setFilters, resetFilters, setSelectedArticles, toggleArticleSelection } = useStore();
  const { data: articlesData, isLoading } = useArticlesQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const { data: networks = [] } = useNetworksQuery();
  const mutations = useArticleMutations();
  const [showFilters, setShowFilters] = useState(false);

  const articles = articlesData?.data || [];
  const meta = articlesData?.meta;
  const totalPages = meta?.totalPages || 1;
  const total = meta?.total || 0;

  const handleDelete = useCallback((id: string) => {
    mutations.delete.mutate(id, {
      onSuccess: () => {
        toast.success('Article supprimé');
      },
      onError: (error) => {
        toast.error(`Erreur: ${error.message}`);
      },
    });
  }, [mutations.delete]);

  const handleBulkStatus = useCallback((status: ArticleStatus) => {
    mutations.bulkUpdateStatus.mutate({ ids: selectedArticles, status }, {
      onSuccess: () => {
        toast.success(`${selectedArticles.length} article(s) mis à jour`);
        setSelectedArticles([]);
      },
      onError: (error) => {
        toast.error(`Erreur: ${error.message}`);
      },
    });
  }, [selectedArticles, mutations.bulkUpdateStatus, setSelectedArticles]);

  const handleToggleFeatured = useCallback((id: string, featured: boolean) => {
    mutations.update.mutate({ id, data: { featured: !featured } }, {
      onSuccess: () => {
        toast.success(featured ? 'Article retiré des favoris' : 'Article mis en avant');
      },
    });
  }, [mutations.update]);

  const handleArchive = useCallback((id: string) => {
    mutations.update.mutate({ id, data: { status: 'archived' } }, {
      onSuccess: () => {
        toast.success('Article archivé');
      },
    });
  }, [mutations.update]);

  const allSelected = articles.length > 0 && articles.every((a) => selectedArticles.includes(a.id));

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Articles</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} article{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => navigate('/articles/new')} className="gap-2">
          <Plus className="h-4 w-4" /> Nouvel article
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher par titre ou contenu…" className="pl-9 bg-card border-border" value={filters.search} onChange={(e) => setFilters({ search: e.target.value })} />
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className={showFilters ? 'bg-primary/10 text-primary border-primary/30' : ''}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="glass-card rounded-xl p-4 flex flex-wrap gap-3 items-end">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Statut</label>
              <Select value={filters.status} onValueChange={(v) => setFilters({ status: v as ArticleStatus | 'all' })}>
                <SelectTrigger className="w-36 bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Réseau</label>
              <Select value={filters.network || 'all'} onValueChange={(v) => setFilters({ network: v === 'all' ? '' : v })}>
                <SelectTrigger className="w-40 bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {networks.map((n) => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Mis en avant</label>
              <Select value={filters.featured === null ? 'all' : filters.featured ? 'yes' : 'no'} onValueChange={(v) => setFilters({ featured: v === 'all' ? null : v === 'yes' })}>
                <SelectTrigger className="w-32 bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground gap-1">
              <X className="h-3 w-3" /> Réinitialiser
            </Button>
          </div>
        )}
      </div>

      {/* Bulk actions */}
      {selectedArticles.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-primary/10 border border-primary/20 p-3">
          <span className="text-sm font-medium text-primary">{selectedArticles.length} sélectionné(s)</span>
          <Button size="sm" variant="outline" onClick={() => handleBulkStatus('published')} className="text-xs">Publier</Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkStatus('archived')} className="text-xs">Archiver</Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkStatus('draft')} className="text-xs">Brouillon</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedArticles([])} className="ml-auto text-xs">Annuler</Button>
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-3 w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => {
                    if (checked) setSelectedArticles(articles.map((a) => a.id));
                    else setSelectedArticles([]);
                  }}
                />
              </th>
              <th className="p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Titre</th>
              <th className="p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Auteur</th>
              <th className="p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
              <th className="p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Date</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="p-3">
                  <Checkbox checked={selectedArticles.includes(article.id)} onCheckedChange={() => toggleArticleSelection(article.id)} />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {article.featured && <Star className="h-3.5 w-3.5 text-warning fill-warning" />}
                    <div>
                      <p className="font-medium text-foreground truncate max-w-xs">{article.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">{article.excerpt}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{article.author}</td>
                <td className="p-3"><StatusBadge status={article.status} /></td>
                <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs">
                  {format(new Date(article.updatedAt), 'dd MMM yyyy', { locale: fr })}
                </td>
                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/articles/${article.id}/edit`)}>
                        <Pencil className="h-3.5 w-3.5 mr-2" /> Éditer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleFeatured(article.id, article.featured)}>
                        <Star className="h-3.5 w-3.5 mr-2" /> {article.featured ? 'Retirer' : 'Mettre en avant'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchive(article.id)}>
                        <Archive className="h-3.5 w-3.5 mr-2" /> Archiver
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(article.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Aucun article trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {filters.page} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={filters.page <= 1} onClick={() => setFilters({ page: filters.page - 1 })}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={filters.page >= totalPages} onClick={() => setFilters({ page: filters.page + 1 })}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
