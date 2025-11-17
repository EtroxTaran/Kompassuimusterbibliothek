import { Home, Settings, Plus, MoreVertical } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from './ui/breadcrumb';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function BreadcrumbsInContext() {
  return (
    <div className="space-y-8">
      {/* Page Header with Breadcrumb */}
      <div>
        <h4 className="mb-3">Seitenkopf mit Breadcrumb</h4>
        <div className="border border-border rounded-lg p-6 bg-background space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/kunden">Kunden</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Hofladen Müller GmbH</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-1">Hofladen Müller GmbH</h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                  Aktiv
                </Badge>
                <Badge variant="outline">Großkunde</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Bearbeiten</Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Kontakt hinzufügen
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb beside Page Title */}
      <div>
        <h4 className="mb-3">Breadcrumb neben Seitentitel</h4>
        <div className="border border-border rounded-lg p-6 bg-background">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2>Projektdetails</h2>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                      <Home className="h-4 w-4" />
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/projekte">Projekte</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>P-2024-B023</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground">
            Bürorenovierung für Hofladen Müller GmbH
          </p>
        </div>
      </div>

      {/* Settings Page */}
      <div>
        <h4 className="mb-3">Einstellungsseite</h4>
        <div className="border border-border rounded-lg bg-background">
          <div className="border-b border-border p-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/einstellungen" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Einstellungen
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Profil</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="p-6">
            <h2 className="mb-4">Profilbearbeitung</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="Michael Schmidt"
                />
              </div>
              <div>
                <label className="block mb-2">E-Mail</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="m.schmidt@example.com"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Detail Page */}
      <div>
        <h4 className="mb-3">Rechnungsseite</h4>
        <div className="border border-border rounded-lg bg-background">
          <div className="border-b border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/rechnungen">Rechnungen</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>R-2024-00456</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                Bezahlt
              </Badge>
            </div>
            <h2>Rechnung R-2024-00456</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground mb-1">Kunde</p>
                <p>Hofladen Müller GmbH</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Betrag</p>
                <p>€ 4.500,00</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Datum</p>
                <p>15. März 2024</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Fällig</p>
                <p>14. April 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep nested location page */}
      <div>
        <h4 className="mb-3">Tief verschachtelte Standortseite</h4>
        <div className="border border-border rounded-lg p-6 bg-background space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/kunden">Kunden</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/kunden/hofladen-mueller">
                  Hofladen Müller GmbH
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/kunden/hofladen-mueller/standorte">
                  Standorte
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Standort München Süd</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div>
            <h2 className="mb-2">Standort München Süd</h2>
            <p className="text-muted-foreground">
              Hauptsitz für Vertrieb und Lagerung in Süddeutschland
            </p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Adresse</h4>
            <p className="text-muted-foreground">
              Musterstraße 123<br />
              81234 München<br />
              Deutschland
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
