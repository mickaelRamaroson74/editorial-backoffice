import { Badge } from '@/components/ui/badge';
import type { ArticleStatus } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<ArticleStatus, { label: string; className: string }> = {
  draft: { label: 'Brouillon', className: 'bg-warning/15 text-warning border-warning/30' },
  published: { label: 'Publié', className: 'bg-success/15 text-success border-success/30' },
  archived: { label: 'Archivé', className: 'bg-muted text-muted-foreground border-border' },
};

export function StatusBadge({ status }: { status: ArticleStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}
