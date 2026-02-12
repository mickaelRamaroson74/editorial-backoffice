import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  subtitle?: string;
}

const variantClasses = {
  default: 'glass-card',
  primary: 'stat-gradient border border-primary/20',
  success: 'success-gradient border border-success/20',
  warning: 'warning-gradient border border-warning/20',
};

export function StatCard({ title, value, icon, variant = 'default', subtitle }: StatCardProps) {
  return (
    <div className={cn('rounded-xl p-5', variantClasses[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="rounded-lg bg-muted/50 p-2.5 text-muted-foreground">{icon}</div>
      </div>
    </div>
  );
}
