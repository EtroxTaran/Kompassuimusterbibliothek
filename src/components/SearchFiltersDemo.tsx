import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  Search,
  X,
  Filter,
  ChevronDown,
  Building2,
  FileText,
  FolderKanban,
  Star,
  Calendar,
  Bookmark,
  ChevronRight,
} from 'lucide-react';
import { cn } from './ui/utils';

// Mock data for autocomplete
const mockSearchResults = {
  kunden: [
    { id: 1, name: 'Hofladen Müller GmbH', location: 'München' },
    { id: 2, name: 'REWE Köln Süd', location: 'Köln' },
    { id: 3, name: 'Edeka Hannover', location: 'Hannover' },
  ],
  projekte: [
    { id: 1, name: 'P-2024-B023 - REWE München', status: 'In Arbeit' },
    { id: 2, name: 'P-2024-B015 - Edeka Umbau', status: 'Planung' },
  ],
  rechnungen: [
    { id: 1, name: 'R-2024-00456 - Hofladen Müller', amount: '12.450 €' },
    { id: 2, name: 'R-2024-00389 - REWE Köln', amount: '8.200 €' },
  ],
};

// Global Search Bar with Autocomplete
function GlobalSearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState(mockSearchResults);

  useEffect(() => {
    if (query.length > 0) {
      setIsOpen(true);
      // Filter results based on query
      const filtered = {
        kunden: mockSearchResults.kunden.filter(k => 
          k.name.toLowerCase().includes(query.toLowerCase())
        ),
        projekte: mockSearchResults.projekte.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase())
        ),
        rechnungen: mockSearchResults.rechnungen.filter(r => 
          r.name.toLowerCase().includes(query.toLowerCase())
        ),
      };
      setFilteredResults(filtered);
    } else {
      setIsOpen(false);
    }
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  const hasResults = filteredResults.kunden.length > 0 || 
                     filteredResults.projekte.length > 0 || 
                     filteredResults.rechnungen.length > 0;

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Globale Suchleiste mit Autocomplete</h4>

      <div className="relative max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Kunden, Projekte, Rechnungen durchsuchen..."
            className="pl-10 pr-10 h-10 rounded-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Suche"
            role="searchbox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Suche löschen"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-auto">
            {hasResults ? (
              <>
                {filteredResults.kunden.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1.5 text-xs uppercase text-muted-foreground">
                      Kunden
                    </div>
                    {filteredResults.kunden.map((kunde) => (
                      <button
                        key={kunde.id}
                        className="w-full flex items-center gap-3 px-2 py-3 rounded-md hover:bg-accent transition-colors"
                        onClick={() => {
                          setQuery(kunde.name);
                          setIsOpen(false);
                        }}
                      >
                        <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
                        <div className="flex-1 text-left">
                          <p className="text-sm">{kunde.name}</p>
                          <p className="text-xs text-muted-foreground">{kunde.location}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {filteredResults.projekte.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1.5 text-xs uppercase text-muted-foreground">
                      Projekte
                    </div>
                    {filteredResults.projekte.map((projekt) => (
                      <button
                        key={projekt.id}
                        className="w-full flex items-center gap-3 px-2 py-3 rounded-md hover:bg-accent transition-colors"
                        onClick={() => {
                          setQuery(projekt.name);
                          setIsOpen(false);
                        }}
                      >
                        <FolderKanban className="h-5 w-5 text-muted-foreground shrink-0" />
                        <div className="flex-1 text-left">
                          <p className="text-sm">{projekt.name}</p>
                          <p className="text-xs text-muted-foreground">{projekt.status}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {filteredResults.rechnungen.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1.5 text-xs uppercase text-muted-foreground">
                      Rechnungen
                    </div>
                    {filteredResults.rechnungen.map((rechnung) => (
                      <button
                        key={rechnung.id}
                        className="w-full flex items-center gap-3 px-2 py-3 rounded-md hover:bg-accent transition-colors"
                        onClick={() => {
                          setQuery(rechnung.name);
                          setIsOpen(false);
                        }}
                      >
                        <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                        <div className="flex-1 text-left">
                          <p className="text-sm">{rechnung.name}</p>
                          <p className="text-xs text-muted-foreground">{rechnung.amount}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <Separator />
                <div className="p-2">
                  <button className="w-full px-2 py-2 text-sm text-primary hover:bg-accent rounded-md transition-colors">
                    Alle Ergebnisse anzeigen
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">Keine Ergebnisse für "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Pill-Form, gruppierte Ergebnisse, Echtzeit-Filterung
      </p>
    </div>
  );
}

// List Search Bar (Scoped)
function ListSearchBar() {
  const [query, setQuery] = useState('');
  const [resultCount, setResultCount] = useState(147);

  useEffect(() => {
    // Simulate debounced search
    const timer = setTimeout(() => {
      if (query) {
        setResultCount(Math.floor(Math.random() * 50) + 10);
      } else {
        setResultCount(147);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Listen-Suchleiste (Bereichsbezogen)</h4>

      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Kunden durchsuchen..."
            className="pl-9 pr-9 h-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="text-sm">
          <span className="font-medium">{resultCount} Kunden gefunden</span>
        </p>

        {/* Mock list */}
        <div className="border border-border rounded-lg divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1">
                <p className="text-sm">Kunde {i + 1}</p>
                <p className="text-xs text-muted-foreground">kunde{i + 1}@beispiel.de</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Standardform, 300ms Debounce, Echtzeit-Ergebnisse
      </p>
    </div>
  );
}

// Filter Panel with Multiple Criteria
function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    bundesland: '',
    dateRange: { von: '', bis: '' },
    inhaber: [] as string[],
    umsatzMin: '',
    umsatzMax: '',
    bewertung: '',
  });
  const [activeFilters, setActiveFilters] = useState<Array<{ key: string; label: string; value: string }>>([]);

  const applyFilters = () => {
    const active: Array<{ key: string; label: string; value: string }> = [];
    
    if (filters.status.length > 0) {
      filters.status.forEach(status => {
        active.push({ key: 'status', label: 'Status', value: status });
      });
    }
    if (filters.bundesland) {
      active.push({ key: 'bundesland', label: 'Bundesland', value: filters.bundesland });
    }
    if (filters.dateRange.von && filters.dateRange.bis) {
      active.push({ 
        key: 'dateRange', 
        label: 'Erstellt', 
        value: `${filters.dateRange.von} - ${filters.dateRange.bis}` 
      });
    }
    if (filters.inhaber.length > 0) {
      filters.inhaber.forEach(inhaber => {
        active.push({ key: 'inhaber', label: 'Inhaber', value: inhaber });
      });
    }
    if (filters.bewertung) {
      active.push({ key: 'bewertung', label: 'Bewertung', value: filters.bewertung });
    }
    
    setActiveFilters(active);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      status: [],
      bundesland: '',
      dateRange: { von: '', bis: '' },
      inhaber: [],
      umsatzMin: '',
      umsatzMax: '',
      bewertung: '',
    });
    setActiveFilters([]);
  };

  const removeFilter = (key: string, value: string) => {
    setActiveFilters(activeFilters.filter(f => !(f.key === key && f.value === value)));
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setFilters({ ...filters, status: [...filters.status, status] });
    } else {
      setFilters({ ...filters, status: filters.status.filter(s => s !== status) });
    }
  };

  const filterCount = activeFilters.length;

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Filter-Panel mit Mehreren Kriterien</h4>

      <div className="space-y-4">
        {/* Search + Filter Button */}
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Kunden durchsuchen..."
              className="pl-9 h-10"
            />
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant={filterCount > 0 ? 'default' : 'outline'} className="relative h-10">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
                {filterCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {filterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter</SheetTitle>
                <SheetDescription>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Filter zurücksetzen
                  </button>
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 py-6">
                {/* Status Filter */}
                <div className="space-y-3">
                  <Label>Status</Label>
                  <div className="space-y-2">
                    {['Aktiv', 'Inaktiv', 'Ausstehend'].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={status}
                          checked={filters.status.includes(status)}
                          onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                        />
                        <label
                          htmlFor={status}
                          className="text-sm cursor-pointer"
                        >
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Date Range Filter */}
                <div className="space-y-3">
                  <Label>Erstellt</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="von" className="text-xs text-muted-foreground">Von</Label>
                      <div className="relative mt-1">
                        <Input
                          id="von"
                          type="date"
                          value={filters.dateRange.von}
                          onChange={(e) => setFilters({
                            ...filters,
                            dateRange: { ...filters.dateRange, von: e.target.value }
                          })}
                          className="h-9"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="bis" className="text-xs text-muted-foreground">Bis</Label>
                      <div className="relative mt-1">
                        <Input
                          id="bis"
                          type="date"
                          value={filters.dateRange.bis}
                          onChange={(e) => setFilters({
                            ...filters,
                            dateRange: { ...filters.dateRange, bis: e.target.value }
                          })}
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Heute', 'Letzte 7 Tage', 'Letzte 30 Tage', 'Dieser Monat'].map((preset) => (
                      <Button key={preset} variant="outline" size="sm" className="text-xs h-7">
                        {preset}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Bundesland Filter */}
                <div className="space-y-3">
                  <Label htmlFor="bundesland">Bundesland</Label>
                  <Select
                    value={filters.bundesland}
                    onValueChange={(value) => setFilters({ ...filters, bundesland: value })}
                  >
                    <SelectTrigger id="bundesland" className="h-9">
                      <SelectValue placeholder="Bundesland auswählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bayern">Bayern</SelectItem>
                      <SelectItem value="nrw">Nordrhein-Westfalen</SelectItem>
                      <SelectItem value="bw">Baden-Württemberg</SelectItem>
                      <SelectItem value="hessen">Hessen</SelectItem>
                      <SelectItem value="berlin">Berlin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Umsatz Range */}
                <div className="space-y-3">
                  <Label>Umsatz (€)</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.umsatzMin}
                        onChange={(e) => setFilters({ ...filters, umsatzMin: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.umsatzMax}
                        onChange={(e) => setFilters({ ...filters, umsatzMax: e.target.value })}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Bewertung Filter */}
                <div className="space-y-3">
                  <Label>Bewertung</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'A', label: 'A (5 Sterne)', stars: 5 },
                      { value: 'B', label: 'B (3-4 Sterne)', stars: 4 },
                      { value: 'C', label: 'C (1-2 Sterne)', stars: 2 },
                    ].map((rating) => (
                      <div key={rating.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={rating.value}
                          checked={filters.bewertung === rating.value}
                          onCheckedChange={(checked) => 
                            setFilters({ ...filters, bewertung: checked ? rating.value : '' })
                          }
                        />
                        <label
                          htmlFor={rating.value}
                          className="text-sm cursor-pointer flex items-center gap-2"
                        >
                          {rating.label}
                          <div className="flex">
                            {Array.from({ length: rating.stars }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <SheetFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={applyFilters}>
                  Anwenden
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 pr-1"
              >
                {filter.label}: {filter.value}
                <button
                  onClick={() => removeFilter(filter.key, filter.value)}
                  className="ml-2 hover:bg-primary/30 rounded-full p-0.5"
                  aria-label={`Filter ${filter.label} entfernen`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <button
              onClick={resetFilters}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Alle Filter entfernen
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm">
            <span className="font-medium">42 Kunden gefunden</span>
          </p>
          <Select defaultValue="name">
            <SelectTrigger className="w-48 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sortiert nach: Name</SelectItem>
              <SelectItem value="date">Sortiert nach: Datum</SelectItem>
              <SelectItem value="revenue">Sortiert nach: Umsatz</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Slide-in Sheet, mehrere Filtertypen, aktive Filter als Chips
      </p>
    </div>
  );
}

// Command Palette (Cmd+K)
function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Befehlspalette (Cmd+K / Strg+K)</h4>

      <div className="space-y-4">
        <Button onClick={() => setOpen(true)} variant="outline">
          Befehlspalette öffnen
          <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Suche oder Befehl eingeben..." />
          <CommandList>
            <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
            
            <CommandGroup heading="Kunden">
              <CommandItem>
                <Building2 className="mr-2 h-4 w-4" />
                <span>Hofladen Müller GmbH</span>
              </CommandItem>
              <CommandItem>
                <Building2 className="mr-2 h-4 w-4" />
                <span>REWE Köln Süd</span>
              </CommandItem>
              <CommandItem>
                <Building2 className="mr-2 h-4 w-4" />
                <span>Edeka Hannover</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Projekte">
              <CommandItem>
                <FolderKanban className="mr-2 h-4 w-4" />
                <span>P-2024-B023 - REWE München</span>
              </CommandItem>
              <CommandItem>
                <FolderKanban className="mr-2 h-4 w-4" />
                <span>P-2024-B015 - Edeka Umbau</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Befehle">
              <CommandItem>
                <span>Neuen Kunden erstellen</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs">
                  ⌘N
                </kbd>
              </CommandItem>
              <CommandItem>
                <span>Neues Projekt erstellen</span>
              </CommandItem>
              <CommandItem>
                <span>Einstellungen öffnen</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      <p className="text-sm text-muted-foreground">
        Tastenkombination Cmd+K / Strg+K, gruppierte Ergebnisse, Tastaturnavigation
      </p>
    </div>
  );
}

// Saved Searches
function SavedSearchesDemo() {
  const [selectedSearch, setSelectedSearch] = useState('');
  
  const savedSearches = [
    { id: '1', name: 'Aktive Münchner Kunden', filters: 3 },
    { id: '2', name: 'Überfällige Rechnungen', filters: 2 },
    { id: '3', name: 'Projekte Q4 2024', filters: 4 },
  ];

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Gespeicherte Suchen</h4>

      <div className="space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-64 justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                <span>Gespeicherte Suchen</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-2">
              <div className="px-2 py-1.5 text-xs uppercase text-muted-foreground">
                Meine Suchen
              </div>
              {savedSearches.map((search) => (
                <button
                  key={search.id}
                  className="w-full flex items-center justify-between px-2 py-2.5 rounded-md hover:bg-accent transition-colors group"
                  onClick={() => setSelectedSearch(search.id)}
                >
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{search.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {search.filters} Filter
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </div>
                </button>
              ))}
            </div>
            <Separator />
            <div className="p-2">
              <button className="w-full px-2 py-2 text-sm text-primary hover:bg-accent rounded-md transition-colors">
                + Neue Suche speichern
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {selectedSearch && (
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <p className="text-sm">
              Geladene Suche: <span className="font-medium">
                {savedSearches.find(s => s.id === selectedSearch)?.name}
              </span>
            </p>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Dropdown mit gespeicherten Suchkriterien, schneller Zugriff auf häufige Suchen
      </p>
    </div>
  );
}

// Advanced Search
function AdvancedSearchDemo() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Erweiterte Suche</h4>

      <div className="border border-border rounded-lg p-6 space-y-6">
        {/* Large Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Erweiterte Suche..."
            className="pl-12 h-12 text-base"
          />
        </div>

        {/* Recent Searches */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Letzte Suchen</p>
          <div className="flex flex-wrap gap-2">
            {['Hofladen München', 'REWE Projekte', 'Überfällige Rechnungen'].map((search) => (
              <Button key={search} variant="outline" size="sm" className="text-xs h-7">
                <Search className="mr-1 h-3 w-3" />
                {search}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Filter Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Entitätstyp</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="customers">Kunden</SelectItem>
                  <SelectItem value="projects">Projekte</SelectItem>
                  <SelectItem value="invoices">Rechnungen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="space-y-2">
                {['Aktiv', 'Inaktiv', 'Archiviert'].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox id={`adv-${status}`} />
                    <label htmlFor={`adv-${status}`} className="text-sm cursor-pointer">
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Zeitraum</Label>
              <Select defaultValue="all-time">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">Gesamter Zeitraum</SelectItem>
                  <SelectItem value="today">Heute</SelectItem>
                  <SelectItem value="week">Diese Woche</SelectItem>
                  <SelectItem value="month">Dieser Monat</SelectItem>
                  <SelectItem value="year">Dieses Jahr</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ort</Label>
              <Input placeholder="Stadt oder PLZ..." className="h-9" />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline">
            Zurücksetzen
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Bookmark className="mr-2 h-4 w-4" />
              Suche speichern
            </Button>
            <Button>
              Suchen
            </Button>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Vollseitige erweiterte Suche mit mehreren Filteroptionen und Speicherfunktion
      </p>
    </div>
  );
}

// Mobile Search
function MobileSearchDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Mobile Suche</h4>

      <div className="max-w-md border border-border rounded-lg p-4 bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm">Mobile Ansicht</h4>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Search Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-background">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Suchen..."
                      className="pl-9 h-12"
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {mockSearchResults.kunden.map((kunde) => (
                    <button
                      key={kunde.id}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div className="flex-1 text-left">
                        <p className="text-sm">{kunde.name}</p>
                        <p className="text-xs text-muted-foreground">{kunde.location}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Button */}
              <div className="p-4 border-t border-border">
                <Button variant="outline" className="w-full h-12">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Vollbild-Overlay, große Touch-Ziele (48px), Bottom-Sheet für Filter
      </p>
    </div>
  );
}

export function SearchFiltersDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Globale Suchleiste</CardTitle>
          <CardDescription>
            Pill-Form mit Autocomplete, gruppierte Ergebnisse nach Entitätstyp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GlobalSearchBar />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listen-Suchleiste</CardTitle>
          <CardDescription>
            Bereichsbezogene Suche mit Echtzeit-Ergebnissen und Debounce
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ListSearchBar />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter-Panel</CardTitle>
          <CardDescription>
            Umfassendes Filter-System mit mehreren Kriterien und aktiven Filter-Chips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FilterPanel />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Befehlspalette</CardTitle>
          <CardDescription>
            Tastatur-gesteuerte Suche mit Cmd+K / Strg+K
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CommandPaletteDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gespeicherte Suchen</CardTitle>
          <CardDescription>
            Schnellzugriff auf häufig verwendete Suchkriterien
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SavedSearchesDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Erweiterte Suche</CardTitle>
          <CardDescription>
            Vollseitige Suche mit umfangreichen Filteroptionen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdvancedSearchDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mobile Suche</CardTitle>
          <CardDescription>
            Vollbild-Overlay optimiert für Touch-Geräte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MobileSearchDemo />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Suchleiste</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Höhe: 40px (Desktop), 48px (Mobil)</li>
              <li>• Icon: Links, 20px, grau</li>
              <li>• Clear-Button: Rechts, bei Eingabe</li>
              <li>• Debounce: 300ms für API-Suche</li>
              <li>• Focus: Blauer Rahmen + Glow</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Autocomplete</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Dropdown: Unterhalb Input</li>
              <li>• Max-Höhe: 400px, scrollbar</li>
              <li>• Gruppierung: Nach Entitätstyp</li>
              <li>• Ergebnis: 48px, Icon + Text</li>
              <li>• Hover: Hellblauer Hintergrund</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Filter-Panel</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Breite: 400px (Desktop)</li>
              <li>• Slide-in: Von rechts</li>
              <li>• Scrollbar: Bei vielen Filtern</li>
              <li>• Footer: Abbrechen + Anwenden</li>
              <li>• Badge: Anzahl aktiver Filter</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Aktive Filter</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Chips: Hellblauer Hintergrund</li>
              <li>• Text: Blau, 12px</li>
              <li>• Remove: "×" Icon rechts</li>
              <li>• Position: Unter Suchleiste</li>
              <li>• Link: "Alle entfernen"</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Befehlspalette</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Shortcut: Cmd+K / Strg+K</li>
              <li>• Modal: Zentriert, 600px</li>
              <li>• Navigation: Pfeiltasten</li>
              <li>• Auswahl: Enter-Taste</li>
              <li>• Schließen: Escape</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Barrierefreiheit</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• role="searchbox"</li>
              <li>• aria-autocomplete="list"</li>
              <li>• aria-expanded für Dropdown</li>
              <li>• aria-label für Filter</li>
              <li>• Tastaturnavigation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}