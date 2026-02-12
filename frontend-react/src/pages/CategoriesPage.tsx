import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useCategoriesQuery, useCategoryMutations, useArticlesQuery } from '@/hooks/useArticlesQuery';
import { toast } from 'sonner';
import type { Category } from '@/types';

const PRESET_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategoriesQuery();

  const { data: articlesData } = useArticlesQuery();
  const mutations = useCategoryMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', color: PRESET_COLORS[0] });

  const articles = articlesData?.data || [];

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', slug: '', description: '', color: PRESET_COLORS[0] });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, color: cat.color });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Le nom est requis'); return; }
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-');
    
    if (editing) {
      mutations.update.mutate({ id: editing.id, data: { ...form, slug } }, {
        onSuccess: () => {
          toast.success('Catégorie mise à jour');
          setDialogOpen(false);
        },
        onError: (error) => {
          toast.error(`Erreur: ${error.message}`);
        },
      });
    } else {
      mutations.create.mutate({ ...form, slug }, {
        onSuccess: () => {
          toast.success('Catégorie créée');
          setDialogOpen(false);
        },
        onError: (error) => {
          toast.error(`Erreur: ${error.message}`);
        },
      });
    }
  };

  const handleDelete = (cat: Category) => {
    const count = articles.filter((a) => 
      (a.categories || []).some(c => typeof c === 'string' ? c === cat.id : c.id === cat.id)
    ).length;
    if (count > 0) {
      toast.error(`Impossible de supprimer : ${count} article(s) associé(s)`);
      return;
    }
    mutations.delete.mutate(cat.id, {
      onSuccess: () => {
        toast.success('Catégorie supprimée');
      },
      onError: (error) => {
        toast.error(`Erreur: ${error.message}`);
      },
    });
  };

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
          <h1 className="text-2xl font-bold text-foreground">Catégories</h1>
          <p className="text-sm text-muted-foreground mt-1">{categories.length} catégorie{categories.length > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Nouvelle catégorie</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const count = articles.filter((a) => 
            (a.categories || []).some(c => typeof c === 'string' ? c === cat.id : c.id === cat.id)
          ).length;
          return (
            <div key={cat.id} className="glass-card rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full" style={{ background: cat.color }} />
                  <h3 className="font-semibold text-foreground">{cat.name}</h3>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(cat)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(cat)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{cat.description}</p>
              <p className="text-xs text-muted-foreground">{count} article{count > 1 ? 's' : ''}</p>
            </div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Modifier' : 'Nouvelle'} catégorie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-card" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-généré" className="bg-card" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-card" />
            </div>
            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="flex gap-2">
                {PRESET_COLORS.map((c) => (
                  <button key={c} onClick={() => setForm({ ...form, color: c })} className={`h-8 w-8 rounded-full transition-transform ${form.color === c ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : ''}`} style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
