import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
  userRole?: 'GF' | 'ADM' | 'PLAN' | 'KALK' | 'BUCH';
  userName?: string;
  breadcrumbs?: { label: string; href?: string }[];
  isOffline?: boolean;
  pendingChanges?: number;
  activeId?: string;
  onNavigate?: (id: string) => void;
}

export function MainLayout({
  children,
  userRole = 'ADM',
  userName,
  breadcrumbs,
  isOffline,
  pendingChanges,
  activeId,
  onNavigate
}: MainLayoutProps) {
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Map short role to full role name for header
  const roleNames = {
    GF: 'Geschäftsführung',
    ADM: 'Außendienst',
    PLAN: 'Planung',
    KALK: 'Kalkulation',
    BUCH: 'Buchhaltung',
  };

  const handleMobileNavigate = (id: string) => {
      setMobileMenuOpen(false);
      if (onNavigate) onNavigate(id);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <Sidebar 
        userRole={userRole} 
        isOffline={isOffline} 
        pendingChanges={pendingChanges}
        className="hidden md:flex flex-shrink-0"
        activeId={activeId}
        onNavigate={onNavigate}
      />

      {/* Mobile Drawer (Sidebar) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
           <Sidebar 
                userRole={userRole}
                isOffline={isOffline}
                pendingChanges={pendingChanges}
                activeId={activeId}
                onNavigate={handleMobileNavigate}
                className="w-full h-full border-none"
           />
        </SheetContent>
      </Sheet>
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          userName={userName}
          userRole={roleNames[userRole]}
          breadcrumbs={breadcrumbs}
          unreadNotifications={3}
          onMobileMenuClick={() => setMobileMenuOpen(true)}
        />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-muted/10 h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto w-full pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
