import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TopBar } from './TopBar';
import { Input } from './ui/input';

export function TopBarDemo() {
  const [notificationCount, setNotificationCount] = useState(3);
  const [breadcrumbPath, setBreadcrumbPath] = useState('kunden');

  const breadcrumbOptions = {
    kunden: [
      { label: 'Kunden', href: '/kunden' },
      { label: 'Hofladen Müller', href: '/kunden/hofladen-mueller' },
      { label: 'Standorte' },
    ],
    projekte: [
      { label: 'Projekte', href: '/projekte' },
      { label: 'Renovierung Büro', href: '/projekte/renovierung-buero' },
      { label: 'Zeiterfassung' },
    ],
    rechnungen: [
      { label: 'Rechnungen', href: '/rechnungen' },
      { label: 'Rechnung #2024-0015' },
    ],
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top-Bar Konfiguration</CardTitle>
          <CardDescription>
            Passen Sie die Top-Bar an, um verschiedene Szenarien zu sehen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="notifications">Benachrichtigungsanzahl</label>
            <Input
              id="notifications"
              type="number"
              value={notificationCount}
              onChange={(e) => setNotificationCount(parseInt(e.target.value) || 0)}
              min="0"
              max="99"
            />
          </div>

          <div className="space-y-2">
            <label>Breadcrumb-Pfad</label>
            <div className="flex gap-2">
              <Button
                onClick={() => setBreadcrumbPath('kunden')}
                variant={breadcrumbPath === 'kunden' ? 'default' : 'outline'}
                size="sm"
              >
                Kunden
              </Button>
              <Button
                onClick={() => setBreadcrumbPath('projekte')}
                variant={breadcrumbPath === 'projekte' ? 'default' : 'outline'}
                size="sm"
              >
                Projekte
              </Button>
              <Button
                onClick={() => setBreadcrumbPath('rechnungen')}
                variant={breadcrumbPath === 'rechnungen' ? 'default' : 'outline'}
                size="sm"
              >
                Rechnungen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top-Bar Vorschau</CardTitle>
          <CardDescription>
            Breadcrumbs, Suche, Benachrichtigungen und Benutzerprofil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg overflow-hidden">
            <TopBar
              userName="Michael Schmidt"
              unreadNotifications={notificationCount}
              breadcrumbs={
                breadcrumbOptions[breadcrumbPath as keyof typeof breadcrumbOptions]
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top-Bar Features</CardTitle>
          <CardDescription>Funktionen und Interaktionen der Top-Bar</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>
                <strong>Breadcrumbs:</strong> Zeigt den aktuellen Navigationspfad und
                ermöglicht schnelles Zurücknavigieren
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>
                <strong>Suche:</strong> Globale Suchfunktion für schnellen Zugriff auf
                Kunden, Projekte und Dokumente
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>
                <strong>Benachrichtigungen:</strong> Badge zeigt Anzahl ungelesener
                Benachrichtigungen
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>
                <strong>Benutzermenü:</strong> Dropdown mit Profil, Einstellungen und
                Abmelden
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
