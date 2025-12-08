import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Briefcase,
  FileText,
  ClipboardList,
  Settings,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  CloudOff,
  LogOut
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  submenu?: { id: string; label: string }[];
  disabled?: boolean;
}

interface SidebarProps {
  userRole?: 'GF' | 'ADM' | 'PLAN' | 'KALK' | 'BUCH';
  isOffline?: boolean;
  pendingChanges?: number;
  className?: string;
  activeId?: string;
  onNavigate?: (id: string) => void;
}

export function Sidebar({
  userRole = 'ADM',
  isOffline = false,
  pendingChanges = 0,
  className,
  activeId = 'dashboard',
  onNavigate
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard', 'kunden', 'vertrieb', 'projekte', 'rechnungen', 'aktivitaeten']);

  // Update expanded items if activeId is in a submenu
  useEffect(() => {
    // Logic could be added here to auto-expand parent of activeId if needed
  }, [activeId]);

  // Menu configuration based on role
  const getMenuItems = (): MenuItem[] => {
    const allItems: MenuItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboards',
        icon: LayoutDashboard,
        submenu: [
          { id: 'dashboard-overview', label: 'Übersicht (INN)' },
          { id: 'dashboard-gf', label: 'Geschäftsführung' },
          { id: 'dashboard-adm', label: 'Außendienst' },
          { id: 'dashboard-plan', label: 'Planung' },
          { id: 'dashboard-kalk', label: 'Kalkulation' },
          { id: 'dashboard-buch', label: 'Buchhaltung' },
          { id: 'dashboard-tasks', label: 'Aufgaben' },
          { id: 'dashboard-projects', label: 'Projekte' },
        ],
      },
      {
        id: 'kunden',
        label: 'Kunden',
        icon: Users,
        submenu: [
          { id: 'kundenliste', label: 'Kundenliste' },
          { id: 'standorte', label: 'Standorte' },
          { id: 'kontakte', label: 'Kontakte' },
        ],
      },
      {
        id: 'vertrieb',
        label: 'Vertrieb',
        icon: TrendingUp,
        badge: 5,
        submenu: [
          { id: 'opportunities', label: 'Opportunities' },
          { id: 'angebote', label: 'Angebote' },
          { id: 'pipeline', label: 'Pipeline' },
          { id: 'touren', label: 'Tourenplanung' },
        ],
      },
      {
        id: 'projekte',
        label: 'Projekte',
        icon: Briefcase,
        submenu: [
          { id: 'projektuebersicht', label: 'Projektübersicht' },
          { id: 'zeiterfassung', label: 'Zeiterfassung' },
          { id: 'material', label: 'Material & Katalog' },
          { id: 'lieferanten', label: 'Lieferanten' },
        ],
      },
      {
        id: 'rechnungen',
        label: 'Rechnungen',
        icon: FileText,
        submenu: [
          { id: 'rechnungen-list', label: 'Rechnungen' },
          { id: 'zahlungen', label: 'Zahlungen' },
        ],
      },
      {
        id: 'aktivitaeten',
        label: 'Aktivitäten',
        icon: ClipboardList,
        submenu: [
          { id: 'kalender', label: 'Kalender' },
          { id: 'protokolle', label: 'Protokolle' },
          { id: 'aufgaben', label: 'Aufgaben' },
        ],
      },
    ];

    // Filter based on role
    switch (userRole) {
      case 'GF':
        return allItems;
      case 'ADM':
        return allItems.map((item) =>
          item.id === 'projekte' ? { ...item, disabled: true } : item
        ).filter((item) => item.id !== 'rechnungen');
      case 'PLAN':
        return allItems.filter((item) =>
          ['dashboard', 'kunden', 'projekte'].includes(item.id)
        );
      case 'KALK':
        return allItems.filter((item) =>
          ['dashboard', 'kunden', 'projekte', 'vertrieb'].includes(item.id)
        );
      case 'BUCH':
        return allItems.filter((item) =>
          ['dashboard', 'rechnungen'].includes(item.id)
        );
      default:
        return allItems;
    }
  };

  const menuItems = getMenuItems();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (id: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      toggleExpanded(id);
    } else {
      if (onNavigate) {
        onNavigate(id);
      }
    }
  };

  const roleBadgeConfig = {
    GF: { label: 'Geschäftsführung', color: 'bg-primary' },
    ADM: { label: 'Außendienst', color: 'bg-chart-1' },
    PLAN: { label: 'Planung', color: 'bg-chart-2' },
    KALK: { label: 'Kalkulation', color: 'bg-chart-3' },
    BUCH: { label: 'Buchhaltung', color: 'bg-chart-4' },
  };

  return (
    <aside className={cn("w-64 h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col", className)}>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold">K</span>
          </div>
          <h3>KOMPASS</h3>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5 text-sidebar-accent-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">
              {userRole === 'GF' ? 'Dr. Anna Weber' : 'Michael Schmidt'}
            </p>
            <Badge
              variant="outline"
              className={cn('mt-1 border-none text-white text-[10px] px-1.5 py-0 h-5', roleBadgeConfig[userRole].color)}
            >
              {roleBadgeConfig[userRole].label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Active state logic: item is active if it matches activeId OR if one of its submenu items matches activeId
            const isSubmenuActive = item.submenu?.some(sub => sub.id === activeId);
            const isActive = activeId === item.id || isSubmenuActive;
            const isExpanded = expandedItems.includes(item.id);
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id, !!hasSubmenu)}
                  disabled={item.disabled}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium',
                    isActive && !isSubmenuActive && 'bg-sidebar-primary text-sidebar-primary-foreground', // Highlight parent only if directly clicked (if it had no submenu, but here logic is mixed)
                     // Better logic: specific highlight for dashboard (no submenu)
                     (activeId === item.id) && 'bg-sidebar-primary text-sidebar-primary-foreground',
                    !isActive && !item.disabled && 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    item.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto bg-sidebar-accent text-sidebar-accent-foreground">
                      {item.badge}
                    </Badge>
                  )}
                  {hasSubmenu && (
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  )}
                </button>

                {/* Submenu */}
                {hasSubmenu && isExpanded && (
                  <ul className="mt-1 ml-4 border-l border-sidebar-border space-y-1">
                    {item.submenu!.map((subitem) => (
                      <li key={subitem.id}>
                        <button
                          onClick={() => onNavigate && onNavigate(subitem.id)}
                          className={cn(
                            'w-full text-left px-3 py-1.5 rounded-md transition-colors text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground',
                            activeId === subitem.id &&
                              'text-sidebar-primary font-medium bg-sidebar-accent/50'
                          )}
                        >
                          {subitem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        {/* Sync Status */}
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
          {isOffline ? (
            <>
              <CloudOff className="h-4 w-4 text-destructive flex-shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-destructive">Offline</p>
                <p className="text-xs text-muted-foreground">
                  {pendingChanges} ausstehend
                </p>
              </div>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="flex-1 text-left text-sm text-primary">Synchronisiert</span>
            </>
          )}
        </button>

        <button 
          onClick={() => onNavigate && onNavigate('einstellungen')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm font-medium",
            activeId === 'einstellungen' && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
          )}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left">Einstellungen</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm font-medium">
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left">Abmelden</span>
        </button>
      </div>
    </aside>
  );
}
