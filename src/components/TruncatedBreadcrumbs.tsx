import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbEllipsis,
} from './ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function TruncatedBreadcrumbs() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3">Langer Pfad mit Ellipsis</h4>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <a href="/kunden" className="w-full">Kunden</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="/kunden/hofladen-mueller" className="w-full">Hofladen Müller GmbH</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="/kunden/hofladen-mueller/kontakte" className="w-full">Kontakte</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/kunden/hofladen-mueller/kontakte/hans-mueller">
                Hans Müller
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Aktivitäten</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-muted-foreground mt-2">
          Klicken Sie auf "..." um versteckte Elemente anzuzeigen
        </p>
      </div>

      <div>
        <h4 className="mb-3">Tiefer Standortpfad</h4>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <a href="/kunden" className="w-full">Kunden</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="/kunden/weingut-fischer" className="w-full">Weingut Fischer</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/kunden/weingut-fischer/standorte">
                Standorte
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Weinkeller Rheingau</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <h4 className="mb-3">Projektstruktur mit Ellipsis</h4>
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
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <a href="/projekte/p-2024-b023" className="w-full">P-2024-B023: Bürorenovierung</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="/projekte/p-2024-b023/aufgaben" className="w-full">Aufgaben</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="/projekte/p-2024-b023/aufgaben/a-234" className="w-full">A-234: Malerarbeiten</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Fortschrittsbericht</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-3">Vollständiger Pfad (Referenz)</h4>
        <p className="text-muted-foreground mb-3">
          So würde der vollständige Pfad ohne Ellipsis aussehen:
        </p>
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
              <BreadcrumbLink href="/kunden/hofladen-mueller">
                Hofladen Müller GmbH
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/kunden/hofladen-mueller/kontakte">
                Kontakte
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/kunden/hofladen-mueller/kontakte/hans-mueller">
                Hans Müller
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Aktivitäten</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
