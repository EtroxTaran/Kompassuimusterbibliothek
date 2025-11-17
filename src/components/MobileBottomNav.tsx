import { useState } from 'react';
import { Home, Users, PlusCircle, Briefcase, Menu } from 'lucide-react';
import { cn } from './ui/utils';

interface MobileBottomNavProps {
  onMenuClick?: () => void;
}

export function MobileBottomNav({ onMenuClick }: MobileBottomNavProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'kunden', label: 'Kunden', icon: Users },
    { id: 'add', label: 'Hinzufügen', icon: PlusCircle, isAction: true },
    { id: 'projekte', label: 'Projekte', icon: Briefcase },
    { id: 'mehr', label: 'Mehr', icon: Menu },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'mehr') {
      onMenuClick?.();
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-2 md:hidden z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.isAction) {
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="flex flex-col items-center justify-center relative -mt-6"
              aria-label={tab.label}
            >
              <div className="h-14 w-14 rounded-full bg-primary shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
            aria-label={tab.label}
          >
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
            )}
            <Icon className="h-6 w-6" />
            <span className="text-[11px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}