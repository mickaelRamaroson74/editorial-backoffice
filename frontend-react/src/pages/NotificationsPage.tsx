import { useState } from 'react';
import { Send, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useArticlesQuery, useNotificationsQuery, useNotificationMutations } from '@/hooks/useArticlesQuery';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NotificationsPage() {
  const { data: articlesData, isLoading: articlesLoading } = useArticlesQuery();
  const { data: notifications = [], isLoading: notificationsLoading } = useNotificationsQuery();
  const mutations = useNotificationMutations();

  const articles = articlesData?.data || [];
  const publishedArticles = articles.filter((a) => a.status === 'published');

  const [articleId, setArticleId] = useState('');
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');

  const selectedArticle = articles.find((a) => a.id === articleId);

  const handleSend = () => {
    if (!articleId) { toast.error('Sélectionnez un article'); return; }
    const emails = recipients.split(',').map((e) => e.trim()).filter(Boolean);
    if (emails.length === 0) { toast.error('Au moins un email requis'); return; }
    if (!subject.trim()) { toast.error('Le sujet est requis'); return; }

    mutations.send.mutate({
      articleId,
      recipients: emails,
      subject,
    }, {
      onSuccess: () => {
        toast.success(`Notification envoyée à ${emails.length} destinataire(s)`);
        setArticleId('');
        setRecipients('');
        setSubject('');
      },
      onError: (error) => {
        toast.error(`Erreur: ${error.message}`);
      }
    });
  };

  const isLoading = articlesLoading || notificationsLoading;

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
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Envoyer des notifications par email</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Send form */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" /> Envoyer une notification
          </h3>
          <div className="space-y-2">
            <Label>Article</Label>
            <Select value={articleId} onValueChange={(v) => {
              setArticleId(v);
              const a = articles.find((x) => x.id === v);
              if (a && !subject) setSubject(`Nouvel article : ${a.title}`);
            }}>
              <SelectTrigger className="bg-card"><SelectValue placeholder="Sélectionner un article" /></SelectTrigger>
              <SelectContent>
                {publishedArticles.map((a) => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Destinataires (séparés par des virgules)</Label>
            <Textarea rows={3} value={recipients} onChange={(e) => setRecipients(e.target.value)} placeholder="email1@example.com, email2@example.com" className="bg-card resize-none" />
          </div>
          <div className="space-y-2">
            <Label>Sujet</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-card" />
          </div>

          {selectedArticle && (
            <div className="rounded-lg bg-muted/30 p-4 space-y-2">
              <p className="text-xs font-medium uppercase text-muted-foreground">Aperçu</p>
              <p className="text-sm font-semibold text-foreground">{subject}</p>
              <p className="text-xs text-muted-foreground">{selectedArticle.excerpt}</p>
            </div>
          )}

          <Button onClick={handleSend} className="w-full gap-2">
            <Mail className="h-4 w-4" /> Envoyer
          </Button>
        </div>

        {/* History */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Historique</h3>
          <div className="space-y-3">
            {notifications.map((n) => {
              const article = articles.find((a) => a.id === n.articleId);
              return (
                <div key={n.id} className="rounded-lg bg-muted/30 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{n.subject}</p>
                    <span className={`text-xs font-medium ${n.status === 'sent' ? 'text-success' : 'text-destructive'}`}>
                      {n.status === 'sent' ? 'Envoyé' : 'Échoué'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Article : {article?.title ?? '—'} · {n.recipients.length} destinataire{n.recipients.length > 1 ? 's' : ''} · {format(new Date(n.sentAt), 'dd MMM yyyy HH:mm', { locale: fr })}
                  </p>
                </div>
              );
            })}
            {notifications.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Aucune notification</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
