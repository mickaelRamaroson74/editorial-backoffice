import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useArticlesQuery, useArticleMutations, useCategoriesQuery, useNetworksQuery } from '@/hooks/useArticlesQuery';
import { toast } from 'sonner';
import { z } from 'zod';

const articleSchema = z.object({
  title: z.string().min(5, 'Le titre doit faire au moins 5 caractères'),
  content: z.string().min(50, 'Le contenu doit faire au moins 50 caractères'),
  excerpt: z.string().min(1, 'Le résumé est requis'),
  author: z.string().min(1, "L'auteur est requis"),
  categories: z.array(z.string()).min(1, 'Au moins une catégorie requise'),
  network: z.string().min(1, 'Le réseau est obligatoire'),
});

type FormData = {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  categories: string[];
  network: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
};

const defaultForm: FormData = {
  title: '', content: '', excerpt: '', author: '', categories: [], network: '', featured: false, status: 'draft',
};

export default function ArticleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: articlesData, isLoading: articlesLoading } = useArticlesQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const { data: networks = [] } = useNetworksQuery();
  const mutations = useArticleMutations();
  
  const isEdit = !!id;
  const articles = articlesData?.data || [];
  const existing = isEdit ? articles.find((a) => a.id === id) : null;

  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const autoSaveRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        content: existing.content,
        excerpt: existing.excerpt,
        author: existing.author,
        categories: (existing.categories || []).map(c => typeof c === 'string' ? c : c.id),
        network: existing.network,
        featured: existing.featured,
        status: existing.status
      });
    }
  }, [existing]);

  const update = useCallback((key: keyof FormData, value: unknown) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }, []);

  const toggleCategory = useCallback((catId: string) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(catId) ? f.categories.filter((c) => c !== catId) : [...f.categories, catId],
    }));
    setDirty(true);
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (!dirty || form.status !== 'draft') return;
    autoSaveRef.current = setInterval(() => {
      toast.info('Brouillon auto-sauvegardé', { duration: 1500 });
    }, 30000);
    return () => clearInterval(autoSaveRef.current);
  }, [dirty, form.status]);

  const handleSubmit = () => {
    const result = articleSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => { fieldErrors[e.path[0] as string] = e.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const onSuccess = () => {
      setDirty(false);
      navigate('/articles');
    };

    const onError = (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    };

    if (isEdit && id) {
      const { categories, ...formData } = form;
      mutations.update.mutate({ 
        id, 
        data: { 
          ...formData, 
          categoryIds: categories,
          publishedAt: form.status === 'published' ? new Date() : null 
        } 
      }, { onSuccess, onError });
      toast.success('Article mis à jour');
    } else {
      const { categories, ...formData } = form;
      mutations.create.mutate({
        ...formData,
        categoryIds: categories,
        publishedAt: form.status === 'published' ? new Date() : null,
      }, { onSuccess, onError });
      toast.success('Article créé');
    }
  };

  if (articlesLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/articles')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isEdit ? 'Modifier' : 'Nouvel'} article</h1>
            {dirty && <p className="text-xs text-warning flex items-center gap-1 mt-0.5"><AlertCircle className="h-3 w-3" />Modifications non sauvegardées</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="gap-2">
            <Eye className="h-4 w-4" /> {showPreview ? 'Masquer' : 'Aperçu'}
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Save className="h-4 w-4" /> Sauvegarder
          </Button>
        </div>
      </div>

      <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-3xl'}`}>
        {/* Form */}
        <div className="space-y-5">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Titre de l'article" className="bg-card" />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label>Résumé</Label>
              <Input value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} placeholder="Résumé court" className="bg-card" />
              {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt}</p>}
            </div>
            <div className="space-y-2">
              <Label>Contenu</Label>
              <Textarea rows={10} value={form.content} onChange={(e) => update('content', e.target.value)} placeholder="Contenu de l'article…" className="bg-card resize-none" />
              {errors.content && <p className="text-xs text-destructive">{errors.content}</p>}
            </div>
            <div className="space-y-2">
              <Label>Auteur</Label>
              <Input value={form.author} onChange={(e) => update('author', e.target.value)} placeholder="Nom de l'auteur" className="bg-card" />
              {errors.author && <p className="text-xs text-destructive">{errors.author}</p>}
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <Label>Catégories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={form.categories.includes(cat.id) ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    style={form.categories.includes(cat.id) ? { background: cat.color, borderColor: cat.color } : {}}
                    onClick={() => toggleCategory(cat.id)}
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
              {errors.categories && <p className="text-xs text-destructive">{errors.categories}</p>}
            </div>

            <div className="space-y-2">
              <Label>Réseau</Label>
              <Select value={form.network} onValueChange={(v) => update('network', v)}>
                <SelectTrigger className="bg-card"><SelectValue placeholder="Sélectionner un réseau" /></SelectTrigger>
                <SelectContent>
                  {networks.map((n) => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.network && <p className="text-xs text-destructive">{errors.network}</p>}
            </div>

            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={form.status} onValueChange={(v) => update('status', v)}>
                <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Mettre en avant</Label>
              <Switch checked={form.featured} onCheckedChange={(v) => update('featured', v)} />
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="glass-card rounded-xl p-6 space-y-4 sticky top-6 self-start">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Aperçu</h3>
            <h2 className="text-xl font-bold text-foreground">{form.title || 'Sans titre'}</h2>
            <p className="text-sm text-muted-foreground italic">{form.excerpt || 'Aucun résumé'}</p>
            <div className="flex gap-2 flex-wrap">
              {form.categories.map((cId) => {
                const cat = categories.find((c) => c.id === cId);
                return cat ? <Badge key={cId} style={{ background: cat.color }}>{cat.name}</Badge> : null;
              })}
            </div>
            <div className="prose prose-sm prose-invert max-w-none">
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{form.content || 'Aucun contenu'}</p>
            </div>
            <p className="text-xs text-muted-foreground">Par {form.author || '—'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
