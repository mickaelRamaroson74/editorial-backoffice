import { useState, useCallback } from 'react';
import { Upload, FileJson, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useArticleMutations, useCategoriesQuery, useNetworksQuery } from '@/hooks/useArticlesQuery';
import { toast } from 'sonner';

interface ImportResult {
  success: number;
  errors: string[];
}

export default function ImportPage() {
  const { data: categories = [] } = useCategoriesQuery();
  const { data: networks = [] } = useNetworksQuery();
  const mutations = useArticleMutations();
  
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragging, setDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!Array.isArray(data)) { toast.error('Le fichier doit contenir un tableau JSON'); return; }

        const preparedArticles = data.map((item: Record<string, unknown>, i: number) => {
           const cat = categories.find((c) => c.slug === item.category || c.name === item.category);
           const net = networks.find((n) => n.name === item.network || n.id === item.network);
           
           return {
             title: String(item.title || ''),
             content: String(item.content || ''),
             excerpt: String(item.excerpt || ''),
             author: String(item.author || 'Import'),
             categories: cat ? [cat.id] : [],
             network: net?.id || networks[0]?.id || '',
             status: 'draft' as const,
             featured: false,
           };
        });

        mutations.import.mutate(preparedArticles, {
          onSuccess: (res) => {
            setResult(res);
            if (res.success > 0) toast.success(`${res.success} article(s) importé(s)`);
            if (res.errors.length > 0) toast.warning(`${res.errors.length} erreur(s)`);
          },
          onError: (error) => {
            toast.error(`Erreur d'importation: ${error.message}`);
          }
        });
      } catch {
        toast.error('Fichier JSON invalide');
      }
    };
    reader.readAsText(file);
  }, [categories, networks, mutations.import]);



  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Import JSON</h1>
        <p className="text-sm text-muted-foreground mt-1">Importez des articles depuis un fichier JSON</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`glass-card rounded-xl border-2 border-dashed p-12 text-center transition-colors ${dragging ? 'border-primary bg-primary/5' : 'border-border'}`}
      >
        <FileJson className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm font-medium text-foreground mb-2">Glissez-déposez votre fichier JSON</p>
        <p className="text-xs text-muted-foreground mb-4">ou cliquez pour parcourir</p>
        <label>
          <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
          <Button variant="outline" asChild className="cursor-pointer">
            <span className="gap-2"><Upload className="h-4 w-4" /> Parcourir</span>
          </Button>
        </label>
      </div>

      <div className="glass-card rounded-xl p-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">Format attendu :</p>
        <pre className="text-xs text-foreground/70 bg-muted/30 rounded-lg p-3 overflow-x-auto">
{`[
  {
    "title": "Mon article",
    "content": "Contenu de l'article...",
    "excerpt": "Résumé",
    "author": "Jean Dupont",
    "category": "technologie",
    "network": "Principal"
  }
]`}
        </pre>
      </div>

      {result && (
        <div className="glass-card rounded-xl p-6 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Résultat de l'import</h3>
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">{result.success} article(s) importé(s) avec succès</span>
          </div>
          {result.errors.length > 0 && (
            <div className="space-y-1">
              {result.errors.map((err, i) => (
                <div key={i} className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-3.5 w-3.5" />
                  <span className="text-xs">{err}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
