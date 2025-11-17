import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { DesktopSidebar } from './DesktopSidebar';

type UserRole = 'GF' | 'ADM' | 'PLAN' | 'KALK' | 'BUCH';

export function RoleBasedNavDemo() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADM');
  const [isOffline, setIsOffline] = useState(false);

  const roleDescriptions = {
    GF: 'Geschäftsführung - Vollzugriff auf alle Module',
    ADM: 'Außendienst - Zugriff auf Kunden, Vertrieb, Aktivitäten',
    PLAN: 'Planung - Zugriff auf Projekte und Kunden',
    KALK: 'Kalkulation - Zugriff auf Projekte, Kunden, Angebote',
    BUCH: 'Buchhaltung - Zugriff auf Rechnungen und Finanzen',
  };

  return (
    <div className="space-y-6">
      {/* Role Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Benutzerrolle auswählen</CardTitle>
          <CardDescription>
            Sehen Sie, wie sich die Navigation basierend auf der Benutzerrolle ändert
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(roleDescriptions) as UserRole[]).map((role) => (
              <Button
                key={role}
                onClick={() => setSelectedRole(role)}
                variant={selectedRole === role ? 'default' : 'outline'}
              >
                {role}
              </Button>
            ))}
          </div>
          <p className="text-muted-foreground">{roleDescriptions[selectedRole]}</p>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsOffline(!isOffline)}
              variant="outline"
              size="sm"
            >
              {isOffline ? 'Online gehen' : 'Offline gehen'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Sidebar Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Desktop-Navigation (Sidebar)</CardTitle>
          <CardDescription>
            Rollenbasierte Menüpunkte und Synchronisationsstatus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg overflow-hidden bg-background">
            <div className="flex">
              <DesktopSidebar
                userRole={selectedRole}
                isOffline={isOffline}
                pendingChanges={3}
              />
              <div className="flex-1 p-8 bg-muted/20 min-h-[600px]">
                <div className="space-y-4">
                  <h2>Hauptinhaltsbereich</h2>
                  <p className="text-muted-foreground">
                    Der Hauptinhalt würde hier angezeigt. Die Seitenleiste passt sich
                    automatisch an die Berechtigungen des aktuellen Benutzers an.
                  </p>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      <strong>Aktuelle Rolle:</strong> {selectedRole} -{' '}
                      {roleDescriptions[selectedRole]}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Status:</strong> {isOffline ? 'Offline (3 Änderungen ausstehend)' : 'Online & Synchronisiert'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
