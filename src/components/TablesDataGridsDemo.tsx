import { useState } from 'react';
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Mail,
  X,
  Building2,
  FolderKanban,
  ChevronDown,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { cn } from './ui/utils';

// Mock customer data
const mockCustomers = [
  {
    id: 1,
    companyName: 'Hofladen Müller GmbH',
    vatId: 'DE123456789',
    location: 'München',
    status: 'Aktiv',
    createdAt: '12.10.2024',
    owner: 'M. Schmidt',
    ownerInitials: 'MS',
  },
  {
    id: 2,
    companyName: 'REWE Köln Süd',
    vatId: 'DE987654321',
    location: 'Köln',
    status: 'Aktiv',
    createdAt: '08.11.2024',
    owner: 'A. Weber',
    ownerInitials: 'AW',
  },
  {
    id: 3,
    companyName: 'Biomarkt Heidelberg',
    vatId: 'DE555666777',
    location: 'Heidelberg',
    status: 'Inaktiv',
    createdAt: '01.09.2024',
    owner: 'T. Fischer',
    ownerInitials: 'TF',
  },
  {
    id: 4,
    companyName: 'Edeka Hamburg Nord',
    vatId: 'DE111222333',
    location: 'Hamburg',
    status: 'Aktiv',
    createdAt: '15.10.2024',
    owner: 'M. Schmidt',
    ownerInitials: 'MS',
  },
  {
    id: 5,
    companyName: 'Kaufland Stuttgart',
    vatId: 'DE444555666',
    location: 'Stuttgart',
    status: 'Ausstehend',
    createdAt: '20.11.2024',
    owner: 'A. Weber',
    ownerInitials: 'AW',
  },
];

// Mock project data
const mockProjects = [
  {
    id: 1,
    projectNumber: 'P-2024-B023',
    customer: 'REWE München',
    status: 'In Bearbeitung',
    budget: '€ 450.000',
    progress: 65,
    projectManager: 'M. Schmidt',
    pmInitials: 'MS',
  },
  {
    id: 2,
    projectNumber: 'P-2024-B015',
    customer: 'Edeka Umbau',
    status: 'Planung',
    budget: '€ 280.000',
    progress: 25,
    projectManager: 'A. Weber',
    pmInitials: 'AW',
  },
  {
    id: 3,
    projectNumber: 'P-2024-B008',
    customer: 'Biomarkt Sanierung',
    status: 'Abgeschlossen',
    budget: '€ 120.000',
    progress: 100,
    projectManager: 'T. Fischer',
    pmInitials: 'TF',
  },
];

type SortDirection = 'asc' | 'desc' | null;

// Standard Customer Table
function StandardCustomerTable() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const allSelected = selectedRows.length === mockCustomers.length && mockCustomers.length > 0;
  const someSelected = selectedRows.length > 0 && selectedRows.length < mockCustomers.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(mockCustomers.map(c => c.id));
    }
  };

  const toggleRow = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4 text-primary" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4 text-primary" />;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Aktiv':
        return 'default';
      case 'Inaktiv':
        return 'secondary';
      case 'Ausstehend':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Standard-Kundentabelle</h4>

      {/* Table Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Kunden durchsuchen..."
              className="pl-9 h-10"
            />
          </div>
          <Button variant="outline" className="h-10">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10">
            <Download className="mr-2 h-4 w-4" />
            Exportieren
          </Button>
          <Button className="h-10">
            <Plus className="mr-2 h-4 w-4" />
            Neuer Kunde
          </Button>
        </div>
      </div>

      {/* Bulk Selection Bar */}
      {selectedRows.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 flex items-center justify-between">
          <span className="text-sm">
            {selectedRows.length} Kunden ausgewählt
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              E-Mail senden
            </Button>
            <Button variant="outline" size="sm">
              Status ändern
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Löschen
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRows([])}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected ? true : undefined}
                  onCheckedChange={toggleAll}
                  aria-label="Alle auswählen"
                />
              </TableHead>
              <TableHead className="w-64">
                <button
                  onClick={() => handleSort('companyName')}
                  className="flex items-center hover:text-foreground"
                >
                  Firmenname
                  {getSortIcon('companyName')}
                </button>
              </TableHead>
              <TableHead className="w-40">Umsatzsteuer-ID</TableHead>
              <TableHead className="w-40">
                <button
                  onClick={() => handleSort('location')}
                  className="flex items-center hover:text-foreground"
                >
                  Standort
                  {getSortIcon('location')}
                </button>
              </TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-32">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center hover:text-foreground"
                >
                  Erstellt am
                  {getSortIcon('createdAt')}
                </button>
              </TableHead>
              <TableHead className="w-32">Inhaber</TableHead>
              <TableHead className="w-20 text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCustomers.map((customer) => (
              <TableRow
                key={customer.id}
                className={cn(
                  'group',
                  selectedRows.includes(customer.id) && 'bg-accent'
                )}
                onMouseEnter={() => setHoveredRow(customer.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(customer.id)}
                    onCheckedChange={() => toggleRow(customer.id)}
                    aria-label={`${customer.companyName} auswählen`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{customer.companyName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {customer.vatId}
                </TableCell>
                <TableCell>{customer.location}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(customer.status)}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {customer.createdAt}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {customer.ownerInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{customer.owner}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      'flex items-center justify-end gap-1 transition-opacity',
                      hoveredRow === customer.id ? 'opacity-100' : 'opacity-0'
                    )}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Bearbeiten</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Weitere Aktionen</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          E-Mail senden
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="bg-muted/50 border border-border rounded-lg px-4 py-3 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Zeige 1-{mockCustomers.length} von 147 Kunden
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Vorherige
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="default" size="sm" className="w-8 h-8 p-0">
                1
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                2
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                3
              </Button>
              <span className="px-2">...</span>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                8
              </Button>
            </div>
            <Button variant="outline" size="sm">
              Nächste
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Zeilen pro Seite:</span>
            <Select defaultValue="20">
              <SelectTrigger className="w-20 h-8">
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

      <p className="text-sm text-muted-foreground">
        Sortierbare Spalten, Checkbox-Auswahl, Hover-Aktionen, Pagination
      </p>
    </div>
  );
}

// Project Table with Progress
function ProjectTable() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'In Bearbeitung':
        return 'default';
      case 'Planung':
        return 'outline';
      case 'Abgeschlossen':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Projekttabelle mit Fortschritt</h4>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox aria-label="Alle auswählen" />
              </TableHead>
              <TableHead className="w-40">Projektnummer</TableHead>
              <TableHead className="w-48">Kunde</TableHead>
              <TableHead className="w-40">Status</TableHead>
              <TableHead className="w-32 text-right">Budget</TableHead>
              <TableHead className="w-40">Fortschritt</TableHead>
              <TableHead className="w-40">Projektleiter</TableHead>
              <TableHead className="w-20 text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProjects.map((project) => (
              <TableRow
                key={project.id}
                className={cn(
                  selectedRows.includes(project.id) && 'bg-accent'
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(project.id)}
                    onCheckedChange={() => toggleRow(project.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-mono text-sm">{project.projectNumber}</span>
                  </div>
                </TableCell>
                <TableCell>{project.customer}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(project.status)}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{project.budget}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-10 text-right">
                      {project.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {project.pmInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{project.projectManager}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Aktionen</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                      <DropdownMenuItem>Details anzeigen</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Fortschrittsbalken in Zellen, Nummernausrichtung rechts
      </p>
    </div>
  );
}

// Empty Table State
function EmptyTableState() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Leere Tabelle</h4>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox disabled />
              </TableHead>
              <TableHead>Firmenname</TableHead>
              <TableHead>Standort</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Erstellt am</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="h-96">
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <Building2 className="h-24 w-24 text-muted-foreground/30 mb-4" />
                  <h4 className="mb-2">Keine Kunden gefunden</h4>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    Beginnen Sie mit dem Hinzufügen Ihres ersten Kunden
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Neuer Kunde
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Zentrierte Nachricht mit Icon, Überschrift und Aktionsbutton
      </p>
    </div>
  );
}

// Loading Table State
function LoadingTableState() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Lade-Tabelle (Skelett)</h4>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox disabled />
              </TableHead>
              <TableHead>Firmenname</TableHead>
              <TableHead>Standort</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Erstellt am</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted rounded animate-pulse w-48" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted rounded animate-pulse w-24" />
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-muted rounded-full animate-pulse w-20" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-muted rounded animate-pulse w-24" />
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-muted rounded animate-pulse w-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Skelett-Zeilen mit Pulse-Animation
      </p>
    </div>
  );
}

// Table Density Options
function TableDensityOptions() {
  const [density, setDensity] = useState<'compact' | 'default' | 'comfortable'>('default');

  const getRowClass = () => {
    switch (density) {
      case 'compact':
        return 'h-10';
      case 'comfortable':
        return 'h-18';
      default:
        return 'h-14';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4>Tabellendichte-Optionen</h4>
        <Select value={density} onValueChange={(value: any) => setDensity(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Kompakt</SelectItem>
            <SelectItem value="default">Standard</SelectItem>
            <SelectItem value="comfortable">Bequem</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className={getRowClass()}>
              <TableHead>Firmenname</TableHead>
              <TableHead>Standort</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCustomers.slice(0, 3).map((customer) => (
              <TableRow key={customer.id} className={getRowClass()}>
                <TableCell>{customer.companyName}</TableCell>
                <TableCell>{customer.location}</TableCell>
                <TableCell>
                  <Badge>{customer.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Kompakt: 40px, Standard: 56px, Bequem: 72px Zeilenhöhe
      </p>
    </div>
  );
}

// Expandable Rows
function ExpandableRowsTable() {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Erweiterbare Zeilen</h4>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Firmenname</TableHead>
              <TableHead>Standort</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCustomers.slice(0, 3).map((customer) => (
              <React.Fragment key={customer.id}>
                <TableRow className="group">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleRow(customer.id)}
                    >
                      {expandedRows.includes(customer.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{customer.companyName}</TableCell>
                  <TableCell>{customer.location}</TableCell>
                  <TableCell>
                    <Badge>{customer.status}</Badge>
                  </TableCell>
                </TableRow>
                {expandedRows.includes(customer.id) && (
                  <TableRow>
                    <TableCell colSpan={4} className="bg-muted/30">
                      <div className="py-4 px-6 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Umsatzsteuer-ID</p>
                            <p className="text-sm">{customer.vatId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Inhaber</p>
                            <p className="text-sm">{customer.owner}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Erstellt am</p>
                            <p className="text-sm">{customer.createdAt}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">E-Mail</p>
                            <p className="text-sm">info@{customer.companyName.toLowerCase().replace(/\s+/g, '')}.de</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Kontakte anzeigen
                          </Button>
                          <Button variant="outline" size="sm">
                            Projekte anzeigen
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Chevron-Icon zum Erweitern, zusätzliche Details in eingeklappter Zeile
      </p>
    </div>
  );
}

// Mobile Card View
function MobileCardView() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Mobile Kartenansicht</h4>

      <div className="space-y-3 max-w-md">
        {mockCustomers.slice(0, 3).map((customer) => (
          <Card key={customer.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{customer.companyName}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{customer.location}</p>
                </div>
                <Badge>{customer.status}</Badge>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {customer.ownerInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground">Inhaber</p>
                    <p className="text-sm">{customer.owner}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                    <DropdownMenuItem>E-Mail senden</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Löschen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Kartenbasiertes Layout für mobile Geräte (&lt;768px)
      </p>
    </div>
  );
}

export function TablesDataGridsDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Standard-Kundentabelle</CardTitle>
          <CardDescription>
            Vollständige Tabelle mit Sortierung, Auswahl, Hover-Aktionen und Pagination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StandardCustomerTable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projekttabelle mit Fortschritt</CardTitle>
          <CardDescription>
            Fortschrittsbalken, rechtsbündige Zahlen, Avatare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectTable />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Leere Tabelle</CardTitle>
          <CardDescription>
            Angezeigt, wenn keine Daten vorhanden sind
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyTableState />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lade-Tabelle</CardTitle>
          <CardDescription>
            Skelett-Zeilen während des Datenladens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingTableState />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Tabellendichte</CardTitle>
          <CardDescription>
            Kompakt, Standard und Bequem-Modi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableDensityOptions />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Erweiterbare Zeilen</CardTitle>
          <CardDescription>
            Klicken Sie auf Chevron, um zusätzliche Details anzuzeigen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpandableRowsTable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mobile Kartenansicht</CardTitle>
          <CardDescription>
            Alternative Layout für kleine Bildschirme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MobileCardView />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Tabellenstruktur</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Kopfzeile: Hellgrau, klebt beim Scrollen</li>
              <li>• Zeilenhöhe: 56px (Standard)</li>
              <li>• Rahmen: 1px durchgehend</li>
              <li>• Zebra-Streifen: Optional</li>
              <li>• Hover: Hellblauer Hintergrund</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Spaltentypen</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Auswahl: 48px, Checkbox</li>
              <li>• Text: Links ausgerichtet</li>
              <li>• Zahlen: Rechts ausgerichtet</li>
              <li>• Datum: TT.MM.JJJJ Format</li>
              <li>• Aktionen: Rechts, Icon-Buttons</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Sortierung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Icon: Pfeil neben Überschrift</li>
              <li>• Unsortiert: Graue Pfeile</li>
              <li>• Aufsteigend: Blauer Pfeil ↑</li>
              <li>• Absteigend: Blauer Pfeil ↓</li>
              <li>• Klick-Zyklus: Keine → Auf → Ab</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Zeilenauswahl</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Checkbox: Erste Spalte</li>
              <li>• Kopf-Checkbox: Alle auswählen</li>
              <li>• Ausgewählt: Hellblauer Hintergrund</li>
              <li>• Bulk-Leiste: Erscheint bei Auswahl</li>
              <li>• Aktionen: E-Mail, Status, Löschen</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Pagination</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Position: Unten in Fußzeile</li>
              <li>• Info: "Zeige X-Y von Z"</li>
              <li>• Seiten: Nummeriert mit Vor/Zurück</li>
              <li>• Seitengröße: 10, 20, 50, 100</li>
              <li>• Aktuelle Seite: Blau hervorgehoben</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Barrierefreiheit</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Semantisches Table-Markup</li>
              <li>• aria-sort auf Spalten</li>
              <li>• aria-selected auf Zeilen</li>
              <li>• Tastaturnavigation: Tab</li>
              <li>• Screen Reader Ankündigungen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}