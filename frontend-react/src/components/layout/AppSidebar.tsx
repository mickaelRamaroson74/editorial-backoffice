import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Bell,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/articles', label: 'Articles', icon: FileText },
  { to: '/categories', label: 'Catégories', icon: FolderOpen },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/import', label: 'Import', icon: Upload },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <FileText className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold text-foreground tracking-tight">
          Editorial Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <RouterNavLink
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </RouterNavLink>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
            A
          </div>
          <div className="text-xs">
            <p className="font-medium text-foreground">Admin</p>
            <p className="text-muted-foreground">admin@editorial.fr</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
