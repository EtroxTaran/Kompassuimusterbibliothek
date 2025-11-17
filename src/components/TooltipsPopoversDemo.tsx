import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './ui/hover-card';
import {
  Pencil,
  Trash2,
  MoreVertical,
  Info,
  HelpCircle,
  Settings,
  User,
  Mail,
  MapPin,
  Copy,
  FileEdit,
  Filter,
  Calendar,
  X,
  LogOut,
  Eye,
  ChevronRight,
  Building2,
  TrendingUp,
} from 'lucide-react';

// Simple Tooltips
function SimpleTooltips() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Einfache Tooltips</h4>

      <TooltipProvider delayDuration={500}>
        <div className="flex flex-wrap gap-4">
          {/* Edit Button Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Bearbeiten</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Kunde bearbeiten</p>
            </TooltipContent>
          </Tooltip>

          {/* Delete Button Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Löschen</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Kunde löschen</p>
            </TooltipContent>
          </Tooltip>

          {/* More Options Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Mehr</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mehr Optionen</p>
            </TooltipContent>
          </Tooltip>

          {/* Settings Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Einstellungen</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Einstellungen öffnen</p>
            </TooltipContent>
          </Tooltip>

          {/* Info Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
                <span className="sr-only">Information</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Informationen anzeigen</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <p className="text-sm text-muted-foreground">
        Einfache Text-Tooltips, 500ms Verzögerung, dunkler Hintergrund
      </p>
    </div>
  );
}

// Multi-line Tooltips
function MultiLineTooltips() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Mehrzeilige Tooltips</h4>

      <TooltipProvider delayDuration={500}>
        <div className="flex flex-wrap gap-4">
          {/* Long Text Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="cursor-help">
                Aktiv
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px]">
              <p>Aktiv: Der Kunde ist aktuell aktiv und kann kontaktiert werden</p>
            </TooltipContent>
          </Tooltip>

          {/* Multiple Lines */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <TrendingUp className="mr-2 h-4 w-4" />
                Umsatz
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px]">
              <p>
                Dieser Kunde hat 3 offene Angebote im Wert von insgesamt € 125.000
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Help Text */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[220px]">
              <p>
                Die Umsatzsteuer-ID besteht aus DE gefolgt von 9 Ziffern
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <p className="text-sm text-muted-foreground">
        Max-Breite: 200px, Text umbrechen auf mehrere Zeilen
      </p>
    </div>
  );
}

// Tooltip with Keyboard Shortcut
function TooltipWithShortcut() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Tooltips mit Tastaturkürzel</h4>

      <TooltipProvider delayDuration={500}>
        <div className="flex flex-wrap gap-4">
          {/* Edit with Shortcut */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Bearbeiten
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p>Kunde bearbeiten</p>
                <div className="border-t border-white/30 pt-1">
                  <p className="text-xs text-white/70">Cmd+E</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Copy with Shortcut */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p>Kopieren</p>
                <div className="border-t border-white/30 pt-1">
                  <p className="text-xs text-white/70">Cmd+C</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Save with Shortcut */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>
                Speichern
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p>Änderungen speichern</p>
                <div className="border-t border-white/30 pt-1">
                  <p className="text-xs text-white/70">Cmd+S</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <p className="text-sm text-muted-foreground">
        Tastaturkürzel in separater Zeile, kleiner und gedämpft
      </p>
    </div>
  );
}

// Tooltip Positioning
function TooltipPositioning() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Tooltip-Positionierung</h4>

      <TooltipProvider delayDuration={500}>
        <div className="flex flex-wrap gap-8 items-center justify-center py-8">
          {/* Top */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Oben</Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Tooltip oben</p>
            </TooltipContent>
          </Tooltip>

          {/* Right */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Rechts</Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Tooltip rechts</p>
            </TooltipContent>
          </Tooltip>

          {/* Bottom */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Unten</Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Tooltip unten</p>
            </TooltipContent>
          </Tooltip>

          {/* Left */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Links</Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Tooltip links</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <p className="text-sm text-muted-foreground">
        Tooltips können oben, unten, links oder rechts positioniert werden
      </p>
    </div>
  );
}

// User Profile Popover
function UserProfilePopover() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Benutzerprofil-Popover</h4>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src="" alt="Michael Schmidt" />
              <AvatarFallback className="bg-primary text-primary-foreground">MS</AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" alt="Michael Schmidt" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  MS
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="truncate">Michael Schmidt</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">ADM</Badge>
                  <span className="text-sm text-muted-foreground">Außendienst</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>m.schmidt@kompass.de</span>
              </div>
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <User className="mr-2 h-4 w-4" />
                Profil anzeigen
              </Button>
              <Button variant="outline" className="flex-1">
                <LogOut className="mr-2 h-4 w-4" />
                Abmelden
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <p className="text-sm text-muted-foreground">
        Klick auf Avatar öffnet Profil-Popover mit Benutzerinfo und Aktionen
      </p>
    </div>
  );
}

// Filter Popover
function FilterPopover() {
  const [filters, setFilters] = useState({
    active: true,
    inactive: false,
    archived: false,
  });

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Filter-Popover</h4>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {(filters.active || filters.inactive || filters.archived) && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {Object.values(filters).filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div>
              <h4 className="mb-3">Kundenstatus</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    checked={filters.active}
                    onCheckedChange={(checked) =>
                      setFilters({ ...filters, active: checked as boolean })
                    }
                  />
                  <label
                    htmlFor="active"
                    className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aktiv
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inactive"
                    checked={filters.inactive}
                    onCheckedChange={(checked) =>
                      setFilters({ ...filters, inactive: checked as boolean })
                    }
                  />
                  <label
                    htmlFor="inactive"
                    className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Inaktiv
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="archived"
                    checked={filters.archived}
                    onCheckedChange={(checked) =>
                      setFilters({ ...filters, archived: checked as boolean })
                    }
                  />
                  <label
                    htmlFor="archived"
                    className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Archiviert
                  </label>
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setFilters({ active: false, inactive: false, archived: false })}
              >
                Zurücksetzen
              </Button>
              <Button className="flex-1">Anwenden</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <p className="text-sm text-muted-foreground">
        Filter-Popover mit mehreren Checkboxen und Aktionsbuttons
      </p>
    </div>
  );
}

// Quick Actions Popover
function QuickActionsPopover() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Schnellaktionen-Popover</h4>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Mehr Optionen</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="end">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => console.log('Bearbeiten')}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Bearbeiten
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => console.log('Duplizieren')}
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplizieren
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => console.log('Anzeigen')}
            >
              <Eye className="mr-2 h-4 w-4" />
              Anzeigen
            </Button>
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={() => console.log('Löschen')}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Löschen
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <p className="text-sm text-muted-foreground">
        Menü-Stil Popover mit Aktionsliste, Separator vor destruktiver Aktion
      </p>
    </div>
  );
}

// Help Popover
function HelpPopover() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Hilfe-Popover</h4>

      <div className="space-y-2">
        <Label htmlFor="vat-id" className="flex items-center gap-2">
          Umsatzsteuer-ID
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Hilfe</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="start">
              <div className="space-y-3">
                <div>
                  <h4 className="mb-2">Hilfe: Umsatzsteuer-ID</h4>
                  <p className="text-sm text-muted-foreground">
                    Die Umsatzsteuer-Identifikationsnummer (USt-IdNr.) ist eine eindeutige
                    Kennung für Unternehmen in der Europäischen Union.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Format für Deutschland:</p>
                  <p className="text-sm text-muted-foreground">
                    Die deutsche USt-IdNr. beginnt mit "DE" gefolgt von 9 Ziffern.
                  </p>
                  <div className="mt-2 p-2 bg-muted rounded text-sm font-mono">
                    DE123456789
                  </div>
                </div>
                <Separator />
                <Button variant="link" className="h-auto p-0 text-sm">
                  Mehr erfahren
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </Label>
        <Input id="vat-id" placeholder="DE123456789" />
      </div>

      <p className="text-sm text-muted-foreground">
        Hilfe-Icon neben Label öffnet Popover mit Erklärung und Beispiel
      </p>
    </div>
  );
}

// Hover Card (Customer Info)
function CustomerHoverCard() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Hover-Karte (Kundeninfo)</h4>

      <div className="text-sm">
        <p className="text-muted-foreground mb-2">Bewegen Sie die Maus über den Kundennamen:</p>
        <HoverCard openDelay={300}>
          <HoverCardTrigger asChild>
            <button className="text-primary hover:underline">
              Hofladen Müller GmbH
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-3">
              <div>
                <h4 className="mb-1">Hofladen Müller GmbH</h4>
                <div className="flex items-center gap-2">
                  <Badge>Aktiv</Badge>
                  <span className="text-sm text-muted-foreground">Seit 2018</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>DE123456789</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>München, Bayern</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>info@hofladen-mueller.de</span>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Projekte</p>
                  <p className="font-medium">3 aktiv</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Umsatz</p>
                  <p className="font-medium">€ 150.000</p>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <p className="text-sm text-muted-foreground">
        Hover über Link zeigt reichhaltige Karte mit Kundeninformationen
      </p>
    </div>
  );
}

// Visual Examples (Static)
function VisualExamples() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Visuelle Beispiele (Statisch)</h4>

      <div className="space-y-6">
        {/* Tooltip Example */}
        <div>
          <p className="text-sm mb-3 font-medium">Tooltip (Standard - Dunkel)</p>
          <div className="inline-flex flex-col gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Pencil className="h-4 w-4" />
            </Button>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2">
                <div className="bg-gray-900/95 text-white text-xs px-3 py-2 rounded-md shadow-lg">
                  Kunde bearbeiten
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1">
                  <div className="border-4 border-transparent border-t-gray-900/95"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tooltip with Shortcut */}
        <div>
          <p className="text-sm mb-3 font-medium">Tooltip mit Tastaturkürzel</p>
          <div className="inline-flex flex-col gap-2">
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Bearbeiten
            </Button>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2">
                <div className="bg-gray-900/95 text-white text-xs px-3 py-2 rounded-md shadow-lg">
                  <div>Kunde bearbeiten</div>
                  <div className="border-t border-white/30 mt-1 pt-1">
                    <span className="text-white/70 text-xs">Cmd+E</span>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1">
                  <div className="border-4 border-transparent border-t-gray-900/95"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popover Example */}
        <div>
          <p className="text-sm mb-3 font-medium">Popover (Schnellaktionen)</p>
          <div className="inline-block relative">
            <div className="border border-border rounded-lg shadow-lg bg-background p-2 w-56">
              <div className="space-y-1">
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-muted">
                  <Pencil className="h-4 w-4" />
                  <span>Bearbeiten</span>
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-muted">
                  <Copy className="h-4 w-4" />
                  <span>Duplizieren</span>
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-muted">
                  <Eye className="h-4 w-4" />
                  <span>Anzeigen</span>
                </button>
                <div className="border-t border-border my-2"></div>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-muted text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span>Löschen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Statische Darstellung zeigt visuelle Details von Tooltip und Popover
      </p>
    </div>
  );
}

export function TooltipsPopoversDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Einfache Tooltips</CardTitle>
          <CardDescription>
            Text-Tooltips für Icon-Buttons und UI-Elemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleTooltips />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mehrzeilige Tooltips</CardTitle>
          <CardDescription>
            Tooltips mit längeren Texten, die umbrechen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MultiLineTooltips />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tooltips mit Tastaturkürzeln</CardTitle>
          <CardDescription>
            Tooltips zeigen Keyboard-Shortcuts für Aktionen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipWithShortcut />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tooltip-Positionierung</CardTitle>
          <CardDescription>
            Tooltips können in verschiedenen Richtungen angezeigt werden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipPositioning />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Benutzerprofil-Popover</CardTitle>
          <CardDescription>
            Popover mit Avatar, Benutzerinformationen und Aktionen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserProfilePopover />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter-Popover</CardTitle>
          <CardDescription>
            Popover mit Formular-Elementen und Aktionsbuttons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FilterPopover />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schnellaktionen-Popover</CardTitle>
          <CardDescription>
            Menü-Stil Popover mit Aktionsliste
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuickActionsPopover />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hilfe-Popover</CardTitle>
          <CardDescription>
            Popover mit Hilfetext, Beispielen und Links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HelpPopover />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Hover-Karte (Kundeninfo)</CardTitle>
          <CardDescription>
            Reichhaltige Hover-Karte mit detaillierten Informationen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerHoverCard />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Visuelle Beispiele</CardTitle>
          <CardDescription>
            Statische Darstellung mit Design-Details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VisualExamples />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Tooltip-Struktur</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• BG: Dunkelgrau (#1f2937)</li>
              <li>• Text: Weiß, 12px</li>
              <li>• Padding: 8px 12px</li>
              <li>• Max-Breite: 200px</li>
              <li>• Verzögerung: 500ms</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Popover-Struktur</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• BG: Weiß</li>
              <li>• Border: 1px solid</li>
              <li>• Schatten: 0px 4px 12px</li>
              <li>• Breite: 200-400px</li>
              <li>• Max-Höhe: 400px</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Positionierung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Standard: Oben/Unten</li>
              <li>• Alternativ: Links/Rechts</li>
              <li>• Auto-Anpassung bei Platzmangel</li>
              <li>• Pfeil zeigt auf Anker</li>
              <li>• 8px Abstand zum Anker</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Tooltip-Verhalten</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Trigger: Hover/Focus</li>
              <li>• Verzögerung: 500ms</li>
              <li>• Fade-in: 200ms</li>
              <li>• Bleibt bei Hover</li>
              <li>• Auto-Dismiss bei Verlassen</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Popover-Verhalten</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Trigger: Click</li>
              <li>• Öffnet mit Animation</li>
              <li>• Click außerhalb schließt</li>
              <li>• Escape-Taste schließt</li>
              <li>• Focus-Management</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Barrierefreiheit</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• role="tooltip"</li>
              <li>• aria-describedby</li>
              <li>• Tastatur-Trigger</li>
              <li>• Focus-Trap bei Popover</li>
              <li>• Ausreichender Kontrast</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
