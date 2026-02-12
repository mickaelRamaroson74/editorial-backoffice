import { FileText, TrendingUp, Archive, Star, BarChart3, Bell } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDashboardStats } from '@/hooks/useArticles';
import { useDashboardQuery } from '@/hooks/useArticlesQuery';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function DashboardPage() {
  const { data: dashData, isLoading } = useDashboardQuery();

  const articles = dashData?.articles || [];
  const categories = dashData?.categories || [];
  const networks = dashData?.networks || [];
  const notifications = dashData?.notifications || [];

  const stats = useDashboardStats(articles, categories, networks);

  const categoryData = Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }));
  const networkData = Object.entries(stats.byNetwork).map(([name, value]) => ({ name, value }));

  const recentPublished = articles
    .filter((a) => a.status === 'published' && a.publishedAt)
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt!).getTime();
      const dateB = new Date(b.publishedAt!).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  const recentNotifications = notifications.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble de votre plateforme éditoriale</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total articles" value={stats.totalArticles} icon={<FileText className="h-5 w-5" />} variant="primary" />
        <StatCard title="Publiés" value={stats.byStatus.published} icon={<TrendingUp className="h-5 w-5" />} variant="success" />
        <StatCard title="Brouillons" value={stats.byStatus.draft} icon={<Archive className="h-5 w-5" />} variant="warning" />
        <StatCard title="Mis en avant" value={articles.filter((a) => a.featured).length} icon={<Star className="h-5 w-5" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Répartition par catégorie
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} innerRadius={55} dataKey="value" stroke="none" paddingAngle={3}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'hsl(220, 18%, 13%)', border: '1px solid hsl(220, 13%, 18%)', borderRadius: 8, fontSize: 12, color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-3 justify-center">
            {categoryData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Articles par réseau
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={networkData}>
              <XAxis dataKey="name" tick={{ fill: 'hsl(215, 14%, 50%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(215, 14%, 50%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(220, 18%, 13%)', border: '1px solid hsl(220, 13%, 18%)', borderRadius: 8, fontSize: 12, color: '#fff' }} />
              <Bar dataKey="value" fill="hsl(210, 100%, 56%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Derniers articles publiés</h3>
          <div className="space-y-3">
            {recentPublished.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.author} · {a.publishedAt ? format(new Date(a.publishedAt), 'dd MMM yyyy', { locale: fr }) : ''}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Dernières notifications
          </h3>
          <div className="space-y-3">
            {recentNotifications.map((n) => {
              const article = articles.find((a) => a.id === n.articleId);
              return (
                <div key={n.id} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{n.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {n.recipients.length} destinataire{n.recipients.length > 1 ? 's' : ''} · {format(new Date(n.sentAt), 'dd MMM', { locale: fr })}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${n.status === 'sent' ? 'text-success' : 'text-destructive'}`}>
                    {n.status === 'sent' ? 'Envoyé' : 'Échoué'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
