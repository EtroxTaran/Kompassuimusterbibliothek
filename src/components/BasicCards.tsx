import { Edit, MoreVertical, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from './ui/card';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function BasicCards() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Einfache Karte</h4>
        <Card>
          <CardContent>
            <p>
              Dies ist eine einfache Karte mit nur Inhalt. Ideal für grundlegende Informationsdarstellung
              ohne komplexe Struktur.
            </p>
          </CardContent>
        </Card>
        <p className="text-muted-foreground mt-3">
          Minimale Struktur - nur CardContent ohne Header oder Footer
        </p>
      </div>

      <div>
        <h4 className="mb-4">Karte mit Header</h4>
        <Card>
          <CardHeader>
            <CardTitle>Kundendaten</CardTitle>
            <CardDescription>Grundlegende Informationen zum Kunden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-muted-foreground">Firmenname</label>
                <p>Hofladen Müller GmbH</p>
              </div>
              <div>
                <label className="text-muted-foreground">USt-IdNr.</label>
                <p>DE123456789</p>
              </div>
              <div>
                <label className="text-muted-foreground">Standort</label>
                <p>München, Bayern</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="text-muted-foreground mt-3">
          Header mit Titel und Beschreibung - Standard-Layout für Detailansichten
        </p>
      </div>

      <div>
        <h4 className="mb-4">Karte mit Header und Footer</h4>
        <Card>
          <CardHeader>
            <CardTitle>Projektdetails</CardTitle>
            <CardDescription>Informationen zum laufenden Projekt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-muted-foreground">Projektnummer</label>
                <p>P-2024-B023</p>
              </div>
              <div>
                <label className="text-muted-foreground">Kunde</label>
                <p>REWE München Süd</p>
              </div>
              <div>
                <label className="text-muted-foreground">Zeitraum</label>
                <p>15.10.2024 - 15.12.2024</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t justify-between">
            <p className="text-muted-foreground">Zuletzt aktualisiert: 15.11.2024</p>
            <Button>Details anzeigen</Button>
          </CardFooter>
        </Card>
        <p className="text-muted-foreground mt-3">
          Footer mit Metainformationen und Aktionsbuttons
        </p>
      </div>

      <div>
        <h4 className="mb-4">Karte mit Header-Aktionen</h4>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Kundendaten</CardTitle>
            <CardDescription>Grundlegende Informationen</CardDescription>
            <CardAction>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Duplizieren</DropdownMenuItem>
                    <DropdownMenuItem>Exportieren</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Löschen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-muted-foreground">Firmenname</label>
                <p>Hofladen Müller GmbH</p>
              </div>
              <div>
                <label className="text-muted-foreground">E-Mail</label>
                <p>info@hofladen-mueller.de</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="text-muted-foreground mt-3">
          CardAction im Header für Bearbeiten- und Mehr-Menü
        </p>
      </div>

      <div>
        <h4 className="mb-4">Klickbare Karte (Hover-Effekt)</h4>
        <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
          <CardHeader>
            <CardTitle>Angebot #2024-089</CardTitle>
            <CardDescription>Klicken für Details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kunde</span>
                <span>Biomarkt Heidelberg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wert</span>
                <span className="font-semibold">€ 125.000</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="text-muted-foreground mt-3">
          Hover-Effekt: Schatten vergrößert sich, Rahmen hebt sich hervor
        </p>
      </div>

      <div>
        <h4 className="mb-4">Karte mit mehreren Footern</h4>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Rechnung #2024-456</CardTitle>
            <CardDescription>Detaillierte Rechnungsinformationen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nettobetrag</span>
                <span>€ 8.500,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">MwSt. (19%)</span>
                <span>€ 1.615,00</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Gesamtbetrag</span>
                <span>€ 10.115,00</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t justify-between">
            <p className="text-muted-foreground">Fällig am: 30.11.2024</p>
            <div className="flex gap-2">
              <Button variant="outline">PDF herunterladen</Button>
              <Button>Zahlung buchen</Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h4 className="mb-4">Kompakte Karte (weniger Padding)</h4>
        <Card className="gap-3">
          <CardHeader className="px-4 pt-4">
            <CardTitle>Schnellinfo</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p>Kompakte Darstellung für Listen oder Sidebar-Widgets mit reduziertem Abstand.</p>
          </CardContent>
        </Card>
        <p className="text-muted-foreground mt-3">
          Reduzierter gap und padding für dichte Layouts
        </p>
      </div>

      <div>
        <h4 className="mb-4">Karten-Grid</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Karte 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Inhalt der ersten Karte</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Karte 2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Inhalt der zweiten Karte</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Karte 3</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Inhalt der dritten Karte</p>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground mt-3">
          Responsives Grid - 1 Spalte auf Mobil, 2 auf Tablet, 3 auf Desktop
        </p>
      </div>
    </div>
  );
}
