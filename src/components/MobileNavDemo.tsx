import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileDrawer } from './MobileDrawer';
import { TopBar } from './TopBar';

export function MobileNavDemo() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mobile Navigation</CardTitle>
          <CardDescription>
            Bottom-Tab-Leiste mit zentraler Aktionsschaltfläche und Drawer-Menü
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg overflow-hidden bg-background">
            {/* Mobile viewport simulation */}
            <div className="max-w-md mx-auto bg-muted/20 relative" style={{ height: '667px' }}>
              {/* Top Bar */}
              <TopBar
                userName="Michael Schmidt"
                unreadNotifications={3}
                breadcrumbs={[
                  { label: 'Kunden', href: '/kunden' },
                  { label: 'Hofladen Müller' },
                ]}
              />

              {/* Content Area */}
              <div className="p-6 pb-20">
                <h3 className="mb-4">Mobile Ansicht</h3>
                <p className="text-muted-foreground mb-4">
                  Die mobile Navigation verwendet eine Bottom-Tab-Leiste für schnellen
                  Zugriff auf Hauptbereiche. Tippen Sie auf "Mehr", um das vollständige
                  Navigationsmenü zu öffnen.
                </p>
                <div className="space-y-3">
                  <div className="h-20 bg-card border border-border rounded-lg" />
                  <div className="h-20 bg-card border border-border rounded-lg" />
                  <div className="h-20 bg-card border border-border rounded-lg" />
                </div>
              </div>

              {/* Bottom Navigation */}
              <MobileBottomNav onMenuClick={() => setDrawerOpen(true)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        userRole="ADM"
        isOffline={false}
        pendingChanges={3}
      />
    </div>
  );
}
