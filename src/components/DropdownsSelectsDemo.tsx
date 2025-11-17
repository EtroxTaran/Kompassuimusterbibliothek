import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
} from './ui/dropdown-menu';
import {
  Command,
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
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  ChevronDown,
  Check,
  Search,
  MoreVertical,
  Eye,
  Pencil,
  Copy,
  Mail,
  Trash2,
  FileDown,
  Download,
  Upload,
  Settings,
  User,
  Building2,
  AlertCircle,
  AlertTriangle,
  Circle,
  Plus,
  Filter,
  X,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { cn } from './ui/utils';

// Standard Select (Form Field)
function StandardSelects() {
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-4">Standard-Selects</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="grid gap-2">
            <Label htmlFor="country">Land *</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country" className="h-10">
                <SelectValue placeholder="Land auswählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">Deutschland</SelectItem>
                <SelectItem value="at">Österreich</SelectItem>
                <SelectItem value="ch">Schweiz</SelectItem>
                <SelectItem value="nl">Niederlande</SelectItem>
                <SelectItem value="fr">Frankreich</SelectItem>
                <SelectItem value="be">Belgien</SelectItem>
                <SelectItem value="lu">Luxemburg</SelectItem>
                <SelectItem value="it">Italien</SelectItem>
                <SelectItem value="es">Spanien</SelectItem>
                <SelectItem value="pl">Polen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="h-10">
                <SelectValue placeholder="Status auswählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Neu</SelectItem>
                <SelectItem value="in-progress">In Bearbeitung</SelectItem>
                <SelectItem value="completed">Abgeschlossen</SelectItem>
                <SelectItem value="cancelled">Storniert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Standard-Formularauswahl mit Placeholder und Optionen
        </p>
      </div>
    </div>
  );
}

// Grouped Select
function GroupedSelect() {
  const [status, setStatus] = useState('');

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Gruppierte Auswahl</h4>
      <div className="max-w-xs">
        <Label htmlFor="grouped-status">Projektstatus</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="grouped-status" className="h-10">
            <SelectValue placeholder="Status auswählen..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>AKTIV</SelectLabel>
              <SelectItem value="new">Neu</SelectItem>
              <SelectItem value="in-progress">In Bearbeitung</SelectItem>
              <SelectItem value="review">In Prüfung</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>ABGESCHLOSSEN</SelectLabel>
              <SelectItem value="completed">Erledigt</SelectItem>
              <SelectItem value="cancelled">Storniert</SelectItem>
              <SelectItem value="archived">Archiviert</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <p className="text-muted-foreground">
        Optionen in logische Gruppen unterteilt
      </p>
    </div>
  );
}

// Searchable Select (Combobox)
function SearchableSelect() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const customers = [
    { value: 'hofladen-mueller', label: 'Hofladen Müller GmbH' },
    { value: 'rewe-koeln', label: 'REWE Köln' },
    { value: 'bau-schmidt', label: 'Bau AG Schmidt' },
    { value: 'zimmerei-weber', label: 'Zimmerei Weber' },
    { value: 'elektro-fischer', label: 'Elektro Fischer GmbH' },
    { value: 'malerbetrieb-hoffmann', label: 'Malerbetrieb Hoffmann' },
  ];

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Durchsuchbare Auswahl (Combobox)</h4>
      <div className="max-w-md">
        <Label>Kunde auswählen</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-10"
            >
              {value
                ? customers.find((customer) => customer.value === value)?.label
                : 'Kunde suchen...'}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Kunde suchen..." />
              <CommandList>
                <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
                <CommandGroup>
                  {customers.map((customer) => (
                    <CommandItem
                      key={customer.value}
                      value={customer.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === customer.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {customer.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-muted-foreground">
        Suche in Echtzeit filtert Optionen
      </p>
    </div>
  );
}

// Multi-Select
function MultiSelect() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['high', 'medium']);

  const priorities = [
    { value: 'high', label: 'Hoch' },
    { value: 'medium', label: 'Mittel' },
    { value: 'low', label: 'Niedrig' },
  ];

  const togglePriority = (value: string) => {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const clearAll = () => setSelected([]);
  const selectAll = () => setSelected(priorities.map((p) => p.value));

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Mehrfachauswahl</h4>
      <div className="max-w-md">
        <Label>Priorität (Mehrfachauswahl)</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between h-10"
            >
              {selected.length > 0
                ? `${selected.length} ausgewählt`
                : 'Prioritäten auswählen...'}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="p-3 space-y-2">
              {priorities.map((priority) => (
                <div key={priority.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={priority.value}
                    checked={selected.includes(priority.value)}
                    onCheckedChange={() => togglePriority(priority.value)}
                  />
                  <label
                    htmlFor={priority.value}
                    className="flex-1 cursor-pointer"
                  >
                    {priority.label}
                  </label>
                </div>
              ))}
            </div>
            <Separator />
            <div className="p-3 flex justify-between items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Alle abwählen
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Alle auswählen
                </Button>
                <Button size="sm" onClick={() => setOpen(false)}>
                  Anwenden
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selected.map((value) => {
              const priority = priorities.find((p) => p.value === value);
              return (
                <Badge key={value} variant="secondary">
                  {priority?.label}
                  <button
                    onClick={() => togglePriority(value)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
      <p className="text-muted-foreground">
        Mehrere Optionen mit Checkboxen auswählen
      </p>
    </div>
  );
}

// Select with Icons
function SelectWithIcons() {
  const [priority, setPriority] = useState('');

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Auswahl mit Icons</h4>
      <div className="max-w-xs">
        <Label htmlFor="priority">Priorität</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger id="priority" className="h-10">
            <SelectValue placeholder="Priorität wählen..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span>Hoch</span>
              </div>
            </SelectItem>
            <SelectItem value="medium">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-chart-3" />
                <span>Mittel</span>
              </div>
            </SelectItem>
            <SelectItem value="low">
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-muted-foreground" />
                <span>Niedrig</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-muted-foreground">
        Icons visualisieren die Bedeutung jeder Option
      </p>
    </div>
  );
}

// Dropdown Menu (Actions)
function ActionDropdownMenu() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Aktionsmenü (Dropdown)</h4>
      <div className="flex gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Aktionen
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              <span>Details anzeigen</span>
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Bearbeiten</span>
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              <span>Duplizieren</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              <span>E-Mail senden</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Löschen</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              <span>Anzeigen</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Bearbeiten</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Löschen</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-muted-foreground">
        Button mit Text oder Icon-only (drei Punkte)
      </p>
    </div>
  );
}

// Nested Dropdown Menu
function NestedDropdownMenu() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Verschachteltes Dropdown</h4>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Mehr Optionen
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Einstellungen</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FileDown className="mr-2 h-4 w-4" />
              <span>Exportieren</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>Excel</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>PDF</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Upload className="mr-2 h-4 w-4" />
            <span>Importieren</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-muted-foreground">
        Untermenü erscheint beim Hover über "Exportieren"
      </p>
    </div>
  );
}

// Filter Dropdown
function FilterDropdown() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    active: true,
    inactive: false,
    archived: false,
  });

  const activeCount = Object.values(filters).filter(Boolean).length;

  const resetFilters = () => {
    setFilters({ active: false, inactive: false, archived: false });
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Filter-Dropdown</h4>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 min-w-5 text-xs">
                {activeCount}
              </Badge>
            )}
            <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-3">
            <div className="relative mb-3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Suchen..." className="pl-8 h-9" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-active"
                  checked={filters.active}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, active: checked as boolean })
                  }
                />
                <label htmlFor="filter-active" className="flex-1 cursor-pointer">
                  Aktiv
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-inactive"
                  checked={filters.inactive}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, inactive: checked as boolean })
                  }
                />
                <label htmlFor="filter-inactive" className="flex-1 cursor-pointer">
                  Inaktiv
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-archived"
                  checked={filters.archived}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, archived: checked as boolean })
                  }
                />
                <label htmlFor="filter-archived" className="flex-1 cursor-pointer">
                  Archiviert
                </label>
              </div>
            </div>
          </div>
          <Separator />
          <div className="p-3 flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Filter zurücksetzen
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Anwenden
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <p className="text-muted-foreground">
        Badge zeigt Anzahl aktiver Filter
      </p>
    </div>
  );
}

// Select with Create Option
function SelectWithCreate() {
  const [status, setStatus] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Auswahl mit "Neu hinzufügen"</h4>
      <div className="max-w-xs">
        <Label htmlFor="status-create">Status</Label>
        <Select value={status} onValueChange={(value) => {
          if (value === 'create-new') {
            setShowCreateDialog(true);
          } else {
            setStatus(value);
          }
        }}>
          <SelectTrigger id="status-create" className="h-10">
            <SelectValue placeholder="Status auswählen..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Neu</SelectItem>
            <SelectItem value="in-progress">In Bearbeitung</SelectItem>
            <SelectItem value="completed">Abgeschlossen</SelectItem>
            <SelectItem value="cancelled">Storniert</SelectItem>
            <Separator className="my-1" />
            <SelectItem value="create-new" className="text-primary">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Neuer Status</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {showCreateDialog && (
        <div className="border border-border rounded-lg p-4 bg-muted/20">
          <p className="text-sm">
            Dialog würde hier geöffnet: "Neuen Status erstellen"
          </p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowCreateDialog(false)}>
            Schließen
          </Button>
        </div>
      )}
      <p className="text-muted-foreground">
        Letzter Eintrag öffnet Dialog zum Erstellen einer neuen Option
      </p>
    </div>
  );
}

// Cascading Select
function CascadingSelect() {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const statesByCountry: Record<string, { value: string; label: string }[]> = {
    de: [
      { value: 'nrw', label: 'Nordrhein-Westfalen' },
      { value: 'by', label: 'Bayern' },
      { value: 'bw', label: 'Baden-Württemberg' },
    ],
    at: [
      { value: 'w', label: 'Wien' },
      { value: 't', label: 'Tirol' },
      { value: 's', label: 'Salzburg' },
    ],
    ch: [
      { value: 'zh', label: 'Zürich' },
      { value: 'be', label: 'Bern' },
      { value: 'ge', label: 'Genf' },
    ],
  };

  const citiesByState: Record<string, { value: string; label: string }[]> = {
    nrw: [
      { value: 'koeln', label: 'Köln' },
      { value: 'duesseldorf', label: 'Düsseldorf' },
      { value: 'dortmund', label: 'Dortmund' },
    ],
    by: [
      { value: 'muenchen', label: 'München' },
      { value: 'nuernberg', label: 'Nürnberg' },
      { value: 'augsburg', label: 'Augsburg' },
    ],
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setState('');
    setCity('');
  };

  const handleStateChange = (value: string) => {
    setState(value);
    setCity('');
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Kaskadierende Auswahl</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
        <div className="grid gap-2">
          <Label htmlFor="cascade-country">Land</Label>
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger id="cascade-country" className="h-10">
              <SelectValue placeholder="Land wählen..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de">Deutschland</SelectItem>
              <SelectItem value="at">Österreich</SelectItem>
              <SelectItem value="ch">Schweiz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cascade-state">Bundesland</Label>
          <Select value={state} onValueChange={handleStateChange} disabled={!country}>
            <SelectTrigger id="cascade-state" className="h-10">
              <SelectValue placeholder="Bundesland wählen..." />
            </SelectTrigger>
            <SelectContent>
              {country && statesByCountry[country]?.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cascade-city">Stadt</Label>
          <Select value={city} onValueChange={setCity} disabled={!state}>
            <SelectTrigger id="cascade-city" className="h-10">
              <SelectValue placeholder="Stadt wählen..." />
            </SelectTrigger>
            <SelectContent>
              {state && citiesByState[state]?.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-muted-foreground">
        Zweite und dritte Auswahl hängen von vorherigen Auswahlen ab
      </p>
    </div>
  );
}

// Select States (Loading, Error, Disabled)
function SelectStates() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-4">Ladezustand</h4>
        <div className="max-w-xs space-y-3">
          <div className="grid gap-2">
            <Label>Daten werden geladen...</Label>
            <Button
              variant="outline"
              disabled
              className="w-full justify-between h-10"
            >
              <span className="text-muted-foreground">Option auswählen...</span>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
          >
            Laden simulieren
          </Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Spinner ersetzt Chevron während des Ladens
        </p>
      </div>

      <Separator />

      <div>
        <h4 className="mb-4">Fehlerzustand</h4>
        <div className="max-w-xs">
          <Label htmlFor="error-select" className="text-destructive">
            Land *
          </Label>
          <Select>
            <SelectTrigger 
              id="error-select" 
              className="h-10 border-destructive focus:ring-destructive"
            >
              <SelectValue placeholder="Land auswählen..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de">Deutschland</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Bitte wählen Sie eine Option
          </p>
        </div>
        <p className="text-muted-foreground mt-3">
          Rote Umrandung und Fehlermeldung bei Validierungsfehlern
        </p>
      </div>

      <Separator />

      <div>
        <h4 className="mb-4">Deaktivierter Zustand</h4>
        <div className="max-w-xs">
          <Label htmlFor="disabled-select">Land</Label>
          <Select disabled>
            <SelectTrigger id="disabled-select" className="h-10">
              <SelectValue placeholder="Nicht verfügbar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de">Deutschland</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-muted-foreground mt-3">
          Ausgegraut und nicht interaktiv
        </p>
      </div>
    </div>
  );
}

// In Context Example
function InContextExample() {
  const [customer, setCustomer] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4>Neues Projekt erstellen</h4>
          <p className="text-sm text-muted-foreground">
            Füllen Sie die Projektdetails aus
          </p>
        </div>
        <FilterDropdown />
      </div>

      <div className="grid gap-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="context-project">Projektname *</Label>
            <Input id="context-project" placeholder="z.B. Umbau Bürogebäude" className="h-10" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="context-number">Projektnummer</Label>
            <Input id="context-number" placeholder="PRJ-2024-001" className="h-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="context-customer">Kunde *</Label>
            <Select value={customer} onValueChange={setCustomer}>
              <SelectTrigger id="context-customer" className="h-10">
                <SelectValue placeholder="Kunde auswählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hofladen">Hofladen Müller GmbH</SelectItem>
                <SelectItem value="rewe">REWE Köln</SelectItem>
                <SelectItem value="bau">Bau AG Schmidt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="context-status">Status *</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="context-status" className="h-10">
                <SelectValue placeholder="Status auswählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>AKTIV</SelectLabel>
                  <SelectItem value="new">Neu</SelectItem>
                  <SelectItem value="in-progress">In Bearbeitung</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>ABGESCHLOSSEN</SelectLabel>
                  <SelectItem value="completed">Erledigt</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="context-priority">Priorität</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="context-priority" className="h-10">
                <SelectValue placeholder="Priorität wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span>Hoch</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-chart-3" />
                    <span>Mittel</span>
                  </div>
                </SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-muted-foreground" />
                    <span>Niedrig</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="context-budget">Budget (€)</Label>
            <Input id="context-budget" type="number" placeholder="50000" className="h-10" />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button className="flex-1">Projekt erstellen</Button>
          <Button variant="outline">Abbrechen</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                <span>Als Vorlage speichern</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="mr-2 h-4 w-4" />
                <span>Importieren</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export function DropdownsSelectsDemo() {
  return (
    <div className="space-y-8">
      <StandardSelects />
      <Separator />
      <GroupedSelect />
      <Separator />
      <SearchableSelect />
      <Separator />
      <MultiSelect />
      <Separator />
      <SelectWithIcons />
      <Separator />
      <ActionDropdownMenu />
      <Separator />
      <NestedDropdownMenu />
      <Separator />
      <FilterDropdown />
      <Separator />
      <SelectWithCreate />
      <Separator />
      <CascadingSelect />
      <Separator />
      <SelectStates />
      <Separator />
      <div>
        <h4 className="mb-4">Auswahl-Komponenten im Kontext</h4>
        <InContextExample />
        <p className="text-muted-foreground mt-3">
          Kombination verschiedener Select- und Dropdown-Typen in einem Formular
        </p>
      </div>
      <Separator />
      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Verwendung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Select: Formularfelder mit festen Optionen</li>
              <li>• Combobox: Durchsuchbare lange Listen</li>
              <li>• Multi-Select: Mehrere Auswahloptionen</li>
              <li>• Dropdown Menu: Aktionen und Befehle</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Größen</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Standard: 40px Höhe (h-10)</li>
              <li>• Optionen: 40px Höhe je Option</li>
              <li>• Max-Höhe Menü: 300px (scrollbar)</li>
              <li>• Icons: 16px (h-4 w-4)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Tastatursteuerung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↓</kbd> - Menü öffnen / Nächste Option</li>
              <li>• <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↑</kbd> - Vorherige Option</li>
              <li>• <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> - Auswählen</li>
              <li>• <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd> - Schließen</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Zustände</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Default: Grauer Rahmen</li>
              <li>• Focus: Blauer Rahmen (2px)</li>
              <li>• Error: Roter Rahmen + Meldung</li>
              <li>• Disabled: Ausgegraut, nicht klickbar</li>
              <li>• Loading: Spinner statt Chevron</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
