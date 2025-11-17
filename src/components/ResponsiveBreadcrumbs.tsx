import { ChevronLeft, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from './ui/breadcrumb';
import { Button } from './ui/button';

export function ResponsiveBreadcrumbs() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3">Desktop-Ansicht (Standard)</h4>
        <div className="border border-border rounded-lg p-4 bg-background">
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
        </div>
      </div>

      <div>
        <h4 className="mb-3">Mobile-Ansicht: Zurück-Button</h4>
        <div className="border border-border rounded-lg p-4 bg-background max-w-sm">
          <Button variant="ghost" className="h-8 px-2 -ml-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Zurück
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Einfacher Zurück-Button für kleine Bildschirme
        </p>
      </div>

      <div>
        <h4 className="mb-3">Mobile-Ansicht: Zurück zur übergeordneten Seite</h4>
        <div className="border border-border rounded-lg p-4 bg-background max-w-sm">
          <Button variant="ghost" className="h-8 px-2 -ml-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Kunden
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Zeigt den Namen der übergeordneten Seite an
        </p>
      </div>

      <div>
        <h4 className="mb-3">Mobile-Ansicht: Letzte zwei Elemente</h4>
        <div className="border border-border rounded-lg p-4 bg-background max-w-sm">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/kunden" className="flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Kunden
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Hofladen Müller GmbH</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <p className="text-muted-foreground mt-2">
          Zeigt nur die letzten beiden Breadcrumb-Elemente
        </p>
      </div>

      <div>
        <h4 className="mb-3">Responsive mit Tailwind-Klassen</h4>
        <div className="border border-border rounded-lg p-4 bg-background">
          {/* Mobile: Back button */}
          <div className="sm:hidden">
            <Button variant="ghost" className="h-8 px-2 -ml-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Kunden
            </Button>
          </div>
          
          {/* Desktop: Full breadcrumb */}
          <div className="hidden sm:block">
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
          </div>
        </div>
        <p className="text-muted-foreground mt-2">
          Wechselt automatisch zwischen Zurück-Button (mobil) und vollständigem Breadcrumb (Desktop)
        </p>
      </div>

      <div>
        <h4 className="mb-3">Horizontales Scrollen auf Mobile</h4>
        <div className="border border-border rounded-lg p-4 bg-background max-w-sm overflow-x-auto">
          <Breadcrumb>
            <BreadcrumbList className="flex-nowrap">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
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
                <BreadcrumbPage>Standort München Süd</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <p className="text-muted-foreground mt-2">
          Vollständiger Breadcrumb mit horizontalem Scrollen bei Überlauf
        </p>
      </div>
    </div>
  );
}
