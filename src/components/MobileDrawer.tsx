import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Briefcase,
  FileText,
  ClipboardList,
  Settings,
  HelpCircle,
  CheckCircle2,
  CloudOff,
  ChevronDown,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole?: 'GF' | 'ADM' | 'PLAN' | 'KALK' | 'BUCH';
  isOffline?: boolean;
  pendingChanges?: number;
}

export function MobileDrawer({
  open,
  onOpenChange,
  userRole = 'ADM',
  isOffline = false,
  pendingChanges = 3,
}: MobileDrawerProps) {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
        { id: 'protokolle', label: 'Protokolle' },
        { id: 'aufgaben', label: 'Aufgaben' },
      ],
    },
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const roleBadgeConfig = {
    GF: { label: 'Geschäftsführung', color: 'bg-primary' },
    ADM: { label: 'Außendienst', color: 'bg-chart-1' },
    PLAN: { label: 'Planung', color: 'bg-chart-2' },
    KALK: { label: 'Kalkulation', color: 'bg-chart-3' },
    BUCH: { label: 'Buchhaltung', color: 'bg-chart-4' },
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-left mb-1">
                {userRole === 'GF' ? 'Dr. Anna Weber' : 'Michael Schmidt'}
              </SheetTitle>
              <Badge
                variant="secondary"
                className={cn('mt-1', roleBadgeConfig[userRole].color, 'text-white')}
              >
                {roleBadgeConfig[userRole].label}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              const isExpanded = expandedItems.includes(item.id);
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (hasSubmenu) {
                        toggleExpanded(item.id);
                      }
                      setActiveItem(item.id);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
                      isActive && 'bg-primary text-primary-foreground',
                      !isActive && 'hover:bg-accent'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
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
                    <ul className="mt-1 ml-8 space-y-1">
                      {item.submenu!.map((subitem) => (
                        <li key={subitem.id}>
                          <button
                            onClick={() => setActiveItem(subitem.id)}
                            className={cn(
                              'w-full text-left px-4 py-2 rounded-md transition-colors text-muted-foreground hover:text-foreground',
                              activeItem === subitem.id &&
                                'bg-primary/10 text-primary'
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
        <div className="border-t border-border p-4 space-y-1">
          {/* Sync Status */}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-accent transition-colors">
            {isOffline ? (
              <>
                <CloudOff className="h-5 w-5 text-chart-3 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-chart-3">Offline</p>
                  <p className="text-muted-foreground">
                    {pendingChanges} ausstehend
                  </p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-chart-2 flex-shrink-0" />
                <span className="flex-1 text-left text-chart-2">Synchronisiert</span>
              </>
            )}
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-accent transition-colors">
            <Settings className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left">Einstellungen</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-accent transition-colors">
            <HelpCircle className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left">Hilfe</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}