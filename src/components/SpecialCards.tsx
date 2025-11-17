import { useState } from 'react';
import { AlertCircle, Info, CheckCircle2, Phone, Mail, Calendar, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Skeleton } from './ui/skeleton';

export function SpecialCards() {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Warnungs-/Info-Karten</h4>
        <div className="space-y-3">
          {showWarning && (
            <Card className="bg-destructive/10 border-destructive/30">
              <CardContent>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-destructive mb-1">Achtung: Zahlung überfällig</h4>
                    <p className="text-muted-foreground">
                      Die Rechnung #2024-456 ist seit 15 Tagen überfällig. Bitte veranlassen Sie eine Mahnung.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="destructive">Mahnung senden</Button>
                      <Button size="sm" variant="outline">Details anzeigen</Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => setShowWarning(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-primary/10 border-primary/30">
            <CardContent>
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-primary mb-1">Neue Funktion verfügbar</h4>
                  <p className="text-muted-foreground">
                    Sie können jetzt Angebote direkt in Projekte umwandeln. Probieren Sie es aus!
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm">Jetzt testen</Button>
                    <Button size="sm" variant="outline">Mehr erfahren</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-chart-2/10 border-chart-2/30">
            <CardContent>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-chart-2 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-chart-2 mb-1">Aktion erfolgreich</h4>
                  <p className="text-muted-foreground">
                    Die Rechnung #2024-789 wurde erfolgreich versendet und dem Kunden zugestellt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground mt-3">
          Kontextbezogene Hinweise mit farbigem Hintergrund und Icon
        </p>
      </div>

      <div>
        <h4 className="mb-4">Aktivitäts-Timeline-Karten</h4>
        <div className="space-y-3">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4>Telefonat mit Hr. Müller</h4>
                    <span className="text-muted-foreground">Heute, 14:30</span>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    Besprechung der neuen Produktlinie für Q1 2025. Kunde sehr interessiert an erweiterten Optionen.
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="bg-muted">MS</AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground">M. Schmidt</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-2">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-chart-2/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-chart-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4>E-Mail an Biomarkt Heidelberg</h4>
                    <span className="text-muted-foreground">Gestern, 16:45</span>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    Angebot #2024-089 versendet mit allen angeforderten Spezifikationen und Preisoptionen.
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="bg-muted">AW</AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground">A. Weber</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-3">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-chart-3/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-chart-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4>Meeting mit Weingut Fischer</h4>
                    <span className="text-muted-foreground">15.11.2024, 10:00</span>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    Projektabschluss-Besprechung. Alle Meilensteine erfolgreich abgeschlossen.
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="bg-muted">TK</AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground">T. Klein</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground mt-3">
          Timeline-Karten mit farbigem linkem Rand und Aktivitäts-Icon
        </p>
      </div>

      <div>
        <h4 className="mb-4">Erweiterbare Karte (Collapsible)</h4>
        <Card>
          <CardHeader
            className="cursor-pointer border-b hover:bg-muted/30 transition-colors"
            onClick={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Erweiterte Filteroptionen</CardTitle>
                <CardDescription>Zusätzliche Filter für präzisere Suche</CardDescription>
              </div>
              {isCollapsibleOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          {isCollapsibleOpen && (
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="block mb-2">Zeitraum</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-background"
                    />
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-background"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Status</label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg bg-background">
                    <option>Alle Status</option>
                    <option>Aktiv</option>
                    <option>Inaktiv</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-3">
                  <Button size="sm">Filter anwenden</Button>
                  <Button size="sm" variant="outline">Zurücksetzen</Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
        <p className="text-muted-foreground mt-3">
          Klick auf Header zum Ein-/Ausklappen der Inhalte
        </p>
      </div>

      <div>
        <h4 className="mb-4">Lade-Skelette</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="border-b">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground mt-3">
          Skelett-Platzhalter während des Ladens von Daten
        </p>
      </div>

      <div>
        <h4 className="mb-4">Leere Zustands-Karte</h4>
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="mb-2">Keine Aktivitäten</h4>
              <p className="text-muted-foreground mb-4">
                Es wurden noch keine Aktivitäten für diesen Kunden protokolliert.
              </p>
              <Button size="sm">Erste Aktivität erstellen</Button>
            </div>
          </CardContent>
        </Card>
        <p className="text-muted-foreground mt-3">
          Leerer Zustand mit gestricheltem Rahmen und Call-to-Action
        </p>
      </div>

      <div>
        <h4 className="mb-4">Ausgewählte Karte</h4>
        <div className="space-y-3">
          <Card className="border-2 border-primary shadow-lg">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-primary rounded flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4>Hofladen Müller GmbH</h4>
                  <p className="text-muted-foreground">Ausgewählter Kunde</p>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Ausgewählt
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 border-2 border-border rounded" />
                <div className="flex-1">
                  <h4>Weingut Fischer</h4>
                  <p className="text-muted-foreground">Nicht ausgewählt</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground mt-3">
          Visuell hervorgehobene Auswahl mit primärem Rahmen
        </p>
      </div>

      <div>
        <h4 className="mb-4">Deaktivierte Karte</h4>
        <Card className="opacity-60 cursor-not-allowed">
          <CardHeader className="border-b">
            <CardTitle>Deaktivierte Funktion</CardTitle>
            <CardDescription>Diese Funktion ist für Ihre Rolle nicht verfügbar</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Kontaktieren Sie Ihren Administrator, um Zugriff auf diese Funktion zu erhalten.
            </p>
          </CardContent>
          <CardFooter className="border-t">
            <Button disabled>Nicht verfügbar</Button>
          </CardFooter>
        </Card>
        <p className="text-muted-foreground mt-3">
          Reduzierte Opacity für deaktivierte Inhalte
        </p>
      </div>
    </div>
  );
}
