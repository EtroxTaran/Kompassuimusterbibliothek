import { useState } from 'react';
import { Plus, ChevronDown, Bell, MoreVertical, Copy, Trash2, Edit, Download } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

export function SpecialButtons() {
  const [notificationCount, setNotificationCount] = useState(3);

  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Dropdown-Button</h4>
        <div className="flex flex-wrap gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Aktionen
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Bearbeiten
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplizieren
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Exportieren
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Optionen
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Als Entwurf speichern</DropdownMenuItem>
              <DropdownMenuItem>Speichern und schließen</DropdownMenuItem>
              <DropdownMenuItem>Speichern und neu anlegen</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-muted-foreground mt-3">
          Button öffnet Dropdown-Menü mit mehreren Optionen
        </p>
      </div>

      <div>
        <h4 className="mb-4">Icon-Dropdown (Mehr-Menü)</h4>
        <div className="flex flex-wrap gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Anzeigen</DropdownMenuItem>
              <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
              <DropdownMenuItem>Duplizieren</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-muted-foreground mt-3">
          Kompaktes Mehr-Menü für Tabellenzeilen
        </p>
      </div>

      <div>
        <h4 className="mb-4">Button mit Badge (Benachrichtigungen)</h4>
        <div className="flex flex-wrap gap-3">
          <div className="relative inline-flex">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            {notificationCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1.5 bg-destructive text-white border-2 border-background"
              >
                {notificationCount}
              </Badge>
            )}
          </div>

          <div className="relative inline-flex">
            <Button variant="outline">
              <Bell className="h-4 w-4" />
              Benachrichtigungen
            </Button>
            {notificationCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1.5 bg-destructive text-white border-2 border-background"
              >
                {notificationCount}
              </Badge>
            )}
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setNotificationCount(0)}
          >
            Alle als gelesen markieren
          </Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Roter Badge zeigt Anzahl ungelesener Benachrichtigungen
        </p>
      </div>

      <div>
        <h4 className="mb-4">Floating Action Button (FAB)</h4>
        <div className="border border-border rounded-lg p-8 bg-muted/30 relative h-64 overflow-hidden">
          <p className="text-muted-foreground">Kundenliste (Mobile-Ansicht)</p>
          <div className="mt-4 space-y-2">
            <div className="border border-border rounded-lg p-3 bg-background">
              Hofladen Müller GmbH
            </div>
            <div className="border border-border rounded-lg p-3 bg-background">
              Weingut Fischer
            </div>
            <div className="border border-border rounded-lg p-3 bg-background">
              Café am Markt GmbH
            </div>
          </div>
          
          <Button 
            size="icon"
            className="absolute bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Schwebendes rundes Button für Hauptaktion auf mobilen Ansichten
        </p>
      </div>

      <div>
        <h4 className="mb-4">Split-Button</h4>
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          <Button className="rounded-none border-r">
            <Plus className="h-4 w-4" />
            Neu anlegen
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-none px-2">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Leerer Kunde</DropdownMenuItem>
              <DropdownMenuItem>Aus Vorlage</DropdownMenuItem>
              <DropdownMenuItem>Importieren</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-muted-foreground mt-3">
          Primäre Aktion + Dropdown für verwandte Aktionen
        </p>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-4">Button-Gruppe in Tabellenkopf</h4>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="p-4 bg-muted/30 flex items-center justify-between border-b border-border">
            <h4>Kundenliste</h4>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Aktionen
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Alle exportieren</DropdownMenuItem>
                  <DropdownMenuItem>Importieren</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Massenbearbeitung</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                Neu
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between p-2 hover:bg-muted/30 rounded">
              <span>Hofladen Müller GmbH</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                  <DropdownMenuItem>Duplizieren</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Löschen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-muted/30 rounded">
              <span>Weingut Fischer</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                  <DropdownMenuItem>Duplizieren</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Löschen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-4">Vollbreite Buttons (Mobile Formulare)</h4>
        <div className="max-w-sm border border-border rounded-lg p-4 bg-background space-y-3">
          <Button className="w-full">
            <Plus className="h-4 w-4" />
            Neuer Kunde
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                Schnellaktionen
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>E-Mail senden</DropdownMenuItem>
              <DropdownMenuItem>Termin erstellen</DropdownMenuItem>
              <DropdownMenuItem>Rechnung erstellen</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary" className="w-full">
            <Download className="h-4 w-4" />
            Daten exportieren
          </Button>
        </div>
      </div>
    </div>
  );
}
