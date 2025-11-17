import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from './ui/breadcrumb';

export function BreadcrumbSizeVariants() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-3">Kompakt (Klein)</h4>
        <Breadcrumb>
          <BreadcrumbList className="text-xs gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-3 w-3" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="[&>svg]:size-2.5" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/kunden">Kunden</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="[&>svg]:size-2.5" />
            <BreadcrumbItem>
              <BreadcrumbPage>Hofladen Müller GmbH</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-muted-foreground mt-2">
          Schriftgröße: 12px | Trennzeichen: 10px | Verwendung: Kompakte Layouts, Dashboards
        </p>
      </div>

      <div>
        <h4 className="mb-3">Standard (Normal)</h4>
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
              <BreadcrumbPage>Hofladen Müller GmbH</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-muted-foreground mt-2">
          Schriftgröße: 14px | Trennzeichen: 14px | Verwendung: Die meisten Seiten
        </p>
      </div>

      <div>
        <h4 className="mb-3">Groß</h4>
        <Breadcrumb>
          <BreadcrumbList className="text-base gap-3">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-5 w-5" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="[&>svg]:size-5" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/kunden">Kunden</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="[&>svg]:size-5" />
            <BreadcrumbItem>
              <BreadcrumbPage>Hofladen Müller GmbH</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-muted-foreground mt-2">
          Schriftgröße: 16px | Trennzeichen: 20px | Verwendung: Wichtige Seiten, Header
        </p>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-3">Größenvergleich</h4>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground">Klein:</span>
            <Breadcrumb>
              <BreadcrumbList className="text-xs gap-1">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="[&>svg]:size-2.5" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/projekte">Projekte</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="[&>svg]:size-2.5" />
                <BreadcrumbItem>
                  <BreadcrumbPage>P-2024-B023</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground">Standard:</span>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
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

          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground">Groß:</span>
            <Breadcrumb>
              <BreadcrumbList className="text-base gap-3">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="[&>svg]:size-5" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/projekte">Projekte</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="[&>svg]:size-5" />
                <BreadcrumbItem>
                  <BreadcrumbPage>P-2024-B023</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>
    </div>
  );
}
