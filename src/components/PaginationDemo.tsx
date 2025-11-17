import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from 'lucide-react';
import { cn } from './ui/utils';

// Helper function to generate page numbers with ellipsis
function generatePageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];

  // Always show first page
  pages.push(1);

  if (currentPage <= 3) {
    // Near start: 1 2 3 4 5 ... 10
    for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
      pages.push(i);
    }
    if (totalPages > 6) pages.push('ellipsis');
  } else if (currentPage >= totalPages - 2) {
    // Near end: 1 ... 6 7 8 9 10
    if (totalPages > 6) pages.push('ellipsis');
    for (let i = Math.max(totalPages - 4, 2); i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Middle: 1 ... 4 5 6 ... 10
    pages.push('ellipsis');
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(i);
    }
    pages.push('ellipsis');
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

// Standard Pagination Bar
function StandardPagination() {
  const [currentPage, setCurrentPage] = useState(3);
  const [pageSize, setPageSize] = useState('20');
  const totalItems = 147;
  const totalPages = Math.ceil(totalItems / parseInt(pageSize));
  const startItem = (currentPage - 1) * parseInt(pageSize) + 1;
  const endItem = Math.min(currentPage * parseInt(pageSize), totalItems);

  const pages = generatePageNumbers(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Standard-Pagination</h4>
      
      {/* Table Context */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="p-4 bg-muted/20">
          <p className="text-sm text-muted-foreground">Kundenliste (Tabellenansicht)</p>
        </div>
        <div className="min-h-[200px] p-4 bg-background">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1">
                  <p>Kunde {startItem + i}</p>
                  <p className="text-sm text-muted-foreground">kunde{startItem + i}@beispiel.de</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination Footer */}
        <div className="border-t border-border bg-muted/30 px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Results Info */}
            <div className="text-sm text-muted-foreground">
              Zeige {startItem}-{endItem} von {totalItems} Kunden
            </div>

            {/* Center: Page Navigation */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={cn(
                      'cursor-pointer',
                      currentPage === 1 && 'pointer-events-none opacity-50'
                    )}
                    aria-label="Vorherige Seite"
                  />
                </PaginationItem>

                {pages.map((page, index) => (
                  <PaginationItem key={index}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                        aria-label={`Gehe zu Seite ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={cn(
                      'cursor-pointer',
                      currentPage === totalPages && 'pointer-events-none opacity-50'
                    )}
                    aria-label="Nächste Seite"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            {/* Right: Page Size Selector */}
            <div className="flex items-center gap-2">
              <Label htmlFor="page-size" className="text-sm text-muted-foreground whitespace-nowrap">
                Zeilen pro Seite:
              </Label>
              <Select value={pageSize} onValueChange={handlePageSizeChange}>
                <SelectTrigger id="page-size" className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground">
        3-Spalten-Layout: Ergebnisinfo (links), Seitennavigation (Mitte), Seitengröße (rechts)
      </p>
    </div>
  );
}

// Pagination with First/Last Buttons
function PaginationWithFirstLast() {
  const [currentPage, setCurrentPage] = useState(15);
  const totalItems = 982;
  const pageSize = 20;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages = generatePageNumbers(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Pagination mit Erste/Letzte-Buttons</h4>
      
      <div className="border border-border rounded-lg p-6 bg-background">
        <div className="mb-4 text-sm text-muted-foreground">
          Zeige {startItem}-{endItem} von {totalItems} Projekte
        </div>

        <Pagination>
          <PaginationContent>
            {/* First Page Button */}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="h-10 w-10"
                aria-label="Erste Seite"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </PaginationItem>

            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={cn(
                  'cursor-pointer',
                  currentPage === 1 && 'pointer-events-none opacity-50'
                )}
              />
            </PaginationItem>

            {pages.map((page, index) => (
              <PaginationItem key={index}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={cn(
                  'cursor-pointer',
                  currentPage === totalPages && 'pointer-events-none opacity-50'
                )}
              />
            </PaginationItem>

            {/* Last Page Button */}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="h-10 w-10"
                aria-label="Letzte Seite"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <p className="text-muted-foreground">
        Für sehr große Datensätze (100+ Seiten) mit Erste/Letzte-Schnellnavigation
      </p>
    </div>
  );
}

// Compact Pagination (Mobile)
function CompactPagination() {
  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 10;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Kompakte Pagination (Mobil)</h4>
      
      <div className="max-w-md border border-border rounded-lg p-4 bg-background">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-12 px-6"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Zurück
          </Button>

          <span className="text-sm">
            Seite {currentPage} von {totalPages}
          </span>

          <Button
            variant="outline"
            size="lg"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-12 px-6"
          >
            Weiter
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground">
        Nur Vor/Zurück-Buttons ohne Seitenzahlen, größere Touch-Ziele (48px)
      </p>
    </div>
  );
}

// Load More Pagination
function LoadMorePagination() {
  const [loadedItems, setLoadedItems] = useState(20);
  const totalItems = 147;
  const itemsPerLoad = 20;
  const hasMore = loadedItems < totalItems;

  const handleLoadMore = () => {
    setLoadedItems(Math.min(loadedItems + itemsPerLoad, totalItems));
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Einfache Pagination (Mehr laden)</h4>
      
      <div className="border border-border rounded-lg p-6 bg-background">
        <div className="min-h-[200px] mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            {loadedItems} von {totalItems} Kunden angezeigt
          </p>
          <div className="space-y-2">
            {Array.from({ length: Math.min(5, loadedItems) }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1">
                  <p>Kunde {i + 1}</p>
                  <p className="text-sm text-muted-foreground">kunde{i + 1}@beispiel.de</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          {hasMore ? (
            <Button onClick={handleLoadMore} size="lg">
              Mehr laden
            </Button>
          ) : (
            <Button disabled size="lg">
              Alle angezeigt
            </Button>
          )}
        </div>
      </div>

      <p className="text-muted-foreground">
        Einzelner "Mehr laden"-Button, ideal für mobile oder unendliches Scrollen
      </p>
    </div>
  );
}

// Jump to Page
function JumpToPagePagination() {
  const [currentPage, setCurrentPage] = useState(3);
  const [jumpInput, setJumpInput] = useState('');
  const totalPages = 50;

  const pages = generatePageNumbers(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleJump = () => {
    const page = parseInt(jumpInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setJumpInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJump();
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Pagination mit "Zu Seite springen"</h4>
      
      <div className="border border-border rounded-lg p-6 bg-background">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={cn(
                    'cursor-pointer',
                    currentPage === 1 && 'pointer-events-none opacity-50'
                  )}
                />
              </PaginationItem>

              {pages.map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={cn(
                    'cursor-pointer',
                    currentPage === totalPages && 'pointer-events-none opacity-50'
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <Separator orientation="vertical" className="h-10" />

          <div className="flex items-center gap-2">
            <Label htmlFor="jump-input" className="text-sm text-muted-foreground whitespace-nowrap">
              Gehe zu Seite:
            </Label>
            <Input
              id="jump-input"
              type="number"
              min="1"
              max={totalPages}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentPage.toString()}
              className="w-20 h-10"
            />
            <Button onClick={handleJump} size="sm">
              Los
            </Button>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground">
        Direkteingabe für Springen zu spezifischer Seite bei großen Datensätzen
      </p>
    </div>
  );
}

// Loading State
function LoadingPagination() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Ladezustand</h4>
      
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="min-h-[200px] p-4 bg-background">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-border bg-muted/30 px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-40" />
            
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground">
        Skelett-Animation während Daten geladen werden
      </p>
    </div>
  );
}

// Empty State
function EmptyPagination() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Leerzustand</h4>
      
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="min-h-[200px] p-4 bg-background flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Keine Ergebnisse gefunden</p>
          </div>
        </div>
        
        <div className="border-t border-border bg-muted/30 px-6 py-3">
          <div className="flex items-center justify-between gap-4 opacity-50">
            <div className="text-sm text-muted-foreground">
              Zeige 0 von 0 Kunden
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious className="pointer-events-none" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext className="pointer-events-none" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground whitespace-nowrap">
                Zeilen pro Seite:
              </Label>
              <Select disabled value="20">
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground">
        Pagination deaktiviert bei 0 Ergebnissen
      </p>
    </div>
  );
}

// Single Page (No Pagination Needed)
function SinglePageState() {
  const totalItems = 5;
  const pageSize = 20;

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Einzelne Seite</h4>
      
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="p-4 bg-background">
          <div className="space-y-2">
            {Array.from({ length: totalItems }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1">
                  <p>Kunde {i + 1}</p>
                  <p className="text-sm text-muted-foreground">kunde{i + 1}@beispiel.de</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-border bg-muted/30 px-6 py-3">
          <div className="text-sm text-muted-foreground text-center">
            Zeige 1-{totalItems} von {totalItems} Ergebnisse
          </div>
        </div>
      </div>

      <p className="text-muted-foreground">
        Nur Ergebnisanzahl ohne Seitennavigation bei wenigen Ergebnissen
      </p>
    </div>
  );
}

// Different Page Positions
function PaginationContexts() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const pages = generatePageNumbers(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-4">Unter Liste (zentriert)</h4>
        
        <div className="border border-border rounded-lg p-6 bg-background">
          <div className="min-h-[150px] mb-6 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1">
                  <p>Projekt {i + 1}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={cn(
                      'cursor-pointer',
                      currentPage === 1 && 'pointer-events-none opacity-50'
                    )}
                  />
                </PaginationItem>

                {pages.map((page, index) => (
                  <PaginationItem key={index}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={cn(
                      'cursor-pointer',
                      currentPage === totalPages && 'pointer-events-none opacity-50'
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        <p className="text-muted-foreground mt-3">
          Zentrierte Navigation unter der Liste
        </p>
      </div>

      <Separator />

      <div>
        <h4 className="mb-4">In Kartenansicht</h4>
        
        <div className="rounded-lg border border-border bg-background p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <div className="w-full h-24 bg-muted rounded mb-3" />
                <p>Kunde {i + 1}</p>
                <p className="text-sm text-muted-foreground">Details</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4 border-t border-border">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={cn(
                      'cursor-pointer',
                      currentPage === 1 && 'pointer-events-none opacity-50'
                    )}
                  />
                </PaginationItem>

                {pages.map((page, index) => (
                  <PaginationItem key={index}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={cn(
                      'cursor-pointer',
                      currentPage === totalPages && 'pointer-events-none opacity-50'
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        <p className="text-muted-foreground mt-3">
          Unter Kartenraster mit oberer Trennlinie
        </p>
      </div>
    </div>
  );
}

export function PaginationDemo() {
  return (
    <div className="space-y-8">
      <StandardPagination />
      <Separator />
      <PaginationWithFirstLast />
      <Separator />
      <CompactPagination />
      <Separator />
      <LoadMorePagination />
      <Separator />
      <JumpToPagePagination />
      <Separator />
      <LoadingPagination />
      <Separator />
      <EmptyPagination />
      <Separator />
      <SinglePageState />
      <Separator />
      <PaginationContexts />
      <Separator />
      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Seitenzahlen-Logik</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Immer erste & letzte Seite zeigen</li>
              <li>• 2 Seiten vor/nach aktueller Seite</li>
              <li>• "..." für Lücken verwenden</li>
              <li>• Max. 7 Buttons bei vielen Seiten</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Größen</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Button: 40x40px (Desktop)</li>
              <li>• Button: 48x48px (Mobil)</li>
              <li>• Abstand: 4px zwischen Buttons</li>
              <li>• Höhe: 56px (Pagination-Bar)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Zustände</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Aktiv: Blauer Hintergrund</li>
              <li>• Hover: Hellgrauer Hintergrund</li>
              <li>• Deaktiviert: 50% Deckkraft</li>
              <li>• Laden: Skelett-Animation</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Seitengröße</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Optionen: 10, 20, 50, 100</li>
              <li>• Standard: 20 Zeilen</li>
              <li>• Änderung → Seite 1 zurück</li>
              <li>• Label: "Zeilen pro Seite"</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Tastatursteuerung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">←</kbd> Vorherige Seite</li>
              <li>• <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">→</kbd> Nächste Seite</li>
              <li>• <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Home</kbd> Erste Seite</li>
              <li>• <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">End</kbd> Letzte Seite</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Barrierefreiheit</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• role="navigation"</li>
              <li>• aria-current="page"</li>
              <li>• aria-label für Buttons</li>
              <li>• Fokus sichtbar (2px blau)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
