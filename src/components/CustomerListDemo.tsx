import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from './ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import {
  Building2,
  MapPin,
  Star,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Pencil,
  MoreVertical,
  X,
  ChevronUp,
  ChevronDown,
  Users,
  Mail,
  Trash2,
  FileDown,
  Lock,
  Copy,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  LayoutGrid,
  List,
} from 'lucide-react';

// Customer type
type CustomerStatus = 'active' | 'inactive';
type CustomerRating = 'A' | 'B' | 'C';

interface Customer {
  id: string;
  companyName: string;
  vatId: string;
  city: string;
  additionalLocations?: number;
  status: CustomerStatus;
  rating: CustomerRating;
  createdAt: string; // ISO date
  owner: {
    id: string;
    name: string;
    initials: string;
  };
}

// Sample customers
const sampleCustomers: Customer[] = [
  {
    id: '1',
    companyName: 'Hofladen Müller GmbH',
    vatId: 'DE123456789',
    city: 'München',
    additionalLocations: 2,
    status: 'active',
    rating: 'A',
    createdAt: '2024-10-12',
    owner: { id: '1', name: 'Michael Schmidt', initials: 'MS' },
  },
  {
    id: '2',
    companyName: 'REWE Köln Süd',
    vatId: 'DE987654321',
    city: 'Köln',
    status: 'active',
    rating: 'A',
    createdAt: '2024-11-08',
    owner: { id: '2', name: 'Anna Weber', initials: 'AW' },
  },
  {
    id: '3',
    companyName: 'Biomarkt Heidelberg',
    vatId: 'DE555666777',
    city: 'Heidelberg',
    status: 'inactive',
    rating: 'B',
    createdAt: '2024-09-01',
    owner: { id: '3', name: 'Thomas Fischer', initials: 'TF' },
  },
  {
    id: '4',
    companyName: 'Edeka Hamburg Nord',
    vatId: 'DE111222333',
    city: 'Hamburg',
    additionalLocations: 1,
    status: 'active',
    rating: 'A',
    createdAt: '2024-11-15',
    owner: { id: '1', name: 'Michael Schmidt', initials: 'MS' },
  },
  {
    id: '5',
    companyName: 'Alnatura Berlin Mitte',
    vatId: 'DE444555666',
    city: 'Berlin',
    status: 'active',
    rating: 'B',
    createdAt: '2024-10-20',
    owner: { id: '2', name: 'Anna Weber', initials: 'AW' },
  },
  {
    id: '6',
    companyName: 'Kaisers Frankfurt',
    vatId: 'DE777888999',
    city: 'Frankfurt',
    status: 'inactive',
    rating: 'C',
    createdAt: '2024-08-15',
    owner: { id: '3', name: 'Thomas Fischer', initials: 'TF' },
  },
  {
    id: '7',
    companyName: 'Tegut Stuttgart',
    vatId: 'DE222333444',
    city: 'Stuttgart',
    status: 'active',
    rating: 'A',
    createdAt: '2024-11-01',
    owner: { id: '1', name: 'Michael Schmidt', initials: 'MS' },
  },
  {
    id: '8',
    companyName: 'Denn\'s Biomarkt Nürnberg',
    vatId: 'DE666777888',
    city: 'Nürnberg',
    additionalLocations: 3,
    status: 'active',
    rating: 'A',
    createdAt: '2024-10-05',
    owner: { id: '2', name: 'Anna Weber', initials: 'AW' },
  },
];

// Status badge config
const statusConfig: Record<CustomerStatus, { label: string; variant: 'default' | 'destructive' }> = {
  active: { label: 'Aktiv', variant: 'default' },
  inactive: { label: 'Inaktiv', variant: 'destructive' },
};

// Rating config
const ratingConfig: Record<CustomerRating, { stars: number; color: string }> = {
  A: { stars: 5, color: 'text-green-600' },
  B: { stars: 3, color: 'text-amber-600' },
  C: { stars: 1, color: 'text-gray-600' },
};

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE');
}

// Get relative time
function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Heute';
  if (days === 1) return 'Gestern';
  if (days < 7) return `Vor ${days} Tagen`;
  if (days < 30) return `Vor ${Math.floor(days / 7)} Wochen`;
  if (days < 365) return `Vor ${Math.floor(days / 30)} Monaten`;
  return `Vor ${Math.floor(days / 365)} Jahren`;
}

// Rating display component
function RatingDisplay({ rating }: { rating: CustomerRating }) {
  const config = ratingConfig[rating];

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={rating === 'A' ? 'default' : rating === 'B' ? 'secondary' : 'outline'}
        className={rating === 'A' ? 'bg-green-600' : rating === 'B' ? 'bg-amber-600 text-white' : ''}
      >
        {rating}
      </Badge>
      <div className="flex items-center">
        {Array.from({ length: config.stars }).map((_, i) => (
          <Star key={i} className={`h-3 w-3 fill-current ${config.color}`} />
        ))}
      </div>
    </div>
  );
}

// Customer row component
function CustomerRow({
  customer,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
}: {
  customer: Customer;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statusCfg = statusConfig[customer.status];

  return (
    <TableRow className={isSelected ? 'bg-accent/30' : ''}>
      {/* Checkbox */}
      <TableCell className="w-12">
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </TableCell>

      {/* Company Name */}
      <TableCell>
        <button
          onClick={onView}
          className="flex items-center gap-2 hover:text-primary transition-colors group"
        >
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium group-hover:underline">{customer.companyName}</span>
        </button>
      </TableCell>

      {/* VAT ID */}
      <TableCell>
        <span className="font-mono text-sm">{customer.vatId}</span>
      </TableCell>

      {/* Location */}
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{customer.city}</span>
                {customer.additionalLocations && (
                  <span className="text-xs text-muted-foreground">
                    +{customer.additionalLocations} weitere
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{customer.city} und {customer.additionalLocations || 0} weitere Standorte</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
      </TableCell>

      {/* Rating */}
      <TableCell>
        <RatingDisplay rating={customer.rating} />
      </TableCell>

      {/* Created At */}
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{formatDate(customer.createdAt)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getRelativeTime(customer.createdAt)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>

      {/* Owner */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">{customer.owner.initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{customer.owner.name.split(' ').map((n) => n[0] + '.').join(' ')}</span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onView}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Details anzeigen</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bearbeiten</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplizieren
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                E-Mail senden
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Lock className="mr-2 h-4 w-4" />
                Deaktivieren
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Full customer list view
function CustomerListView({ userRole = 'PLAN' }: { userRole?: 'GF' | 'PLAN' | 'ADM' }) {
  const [customers] = useState(sampleCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<string>('companyName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<CustomerStatus[]>(['active']);
  const [filterRating, setFilterRating] = useState<CustomerRating[]>([]);
  const [filterOwner, setFilterOwner] = useState<string[]>([]);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter by RBAC
  const rbacFilteredCustomers = useMemo(() => {
    if (userRole === 'ADM') {
      // ADM sees only own customers (assume owner ID '1' is current ADM user)
      return customers.filter((c) => c.owner.id === '1');
    }
    return customers;
  }, [customers, userRole]);

  // Filter and search
  const filteredCustomers = useMemo(() => {
    let result = rbacFilteredCustomers;

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.companyName.toLowerCase().includes(query) ||
          c.vatId.toLowerCase().includes(query) ||
          c.city.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (filterStatus.length > 0) {
      result = result.filter((c) => filterStatus.includes(c.status));
    }

    // Filter by rating
    if (filterRating.length > 0) {
      result = result.filter((c) => filterRating.includes(c.rating));
    }

    // Filter by owner
    if (filterOwner.length > 0) {
      result = result.filter((c) => filterOwner.includes(c.owner.id));
    }

    return result;
  }, [rbacFilteredCustomers, searchQuery, filterStatus, filterRating, filterOwner]);

  // Sort
  const sortedCustomers = useMemo(() => {
    const sorted = [...filteredCustomers];
    sorted.sort((a, b) => {
      let aVal: any = a[sortColumn as keyof Customer];
      let bVal: any = b[sortColumn as keyof Customer];

      // Special handling for nested values
      if (sortColumn === 'owner') {
        aVal = a.owner.name;
        bVal = b.owner.name;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredCustomers, sortColumn, sortDirection]);

  // Paginate
  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sortedCustomers.slice(start, end);
  }, [sortedCustomers, page, pageSize]);

  const totalPages = Math.ceil(sortedCustomers.length / pageSize);

  // Toggle sort
  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Select all
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedCustomers.map((c) => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Toggle select
  const toggleSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  // Clear filters
  const clearFilters = () => {
    setFilterStatus(['active']);
    setFilterRating([]);
    setFilterOwner([]);
  };

  const activeFiltersCount =
    (filterStatus.length > 0 && filterStatus.length < 2 ? 1 : 0) +
    filterRating.length +
    filterOwner.length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Kunden</h2>
          <p className="text-sm text-muted-foreground">
            {sortedCustomers.length} von {rbacFilteredCustomers.length} Kunden
            {userRole === 'ADM' && ' (Ihre eigenen)'}
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left: Search, Filter, View Toggle */}
            <div className="flex items-center gap-2 flex-1">
              {/* Search */}
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Kunden durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter */}
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    {hasActiveFilters && (
                      <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter</SheetTitle>
                    <SheetDescription>Kunden nach Kriterien filtern</SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 py-6">
                    {/* Status Filter */}
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="status-active"
                            checked={filterStatus.includes('active')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilterStatus([...filterStatus, 'active']);
                              } else {
                                setFilterStatus(filterStatus.filter((s) => s !== 'active'));
                              }
                            }}
                          />
                          <label htmlFor="status-active" className="text-sm cursor-pointer">
                            Aktiv
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="status-inactive"
                            checked={filterStatus.includes('inactive')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilterStatus([...filterStatus, 'inactive']);
                              } else {
                                setFilterStatus(filterStatus.filter((s) => s !== 'inactive'));
                              }
                            }}
                          />
                          <label htmlFor="status-inactive" className="text-sm cursor-pointer">
                            Inaktiv
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="space-y-2">
                      <Label>Bewertung</Label>
                      <div className="space-y-2">
                        {(['A', 'B', 'C'] as CustomerRating[]).map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <Checkbox
                              id={`rating-${rating}`}
                              checked={filterRating.includes(rating)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilterRating([...filterRating, rating]);
                                } else {
                                  setFilterRating(filterRating.filter((r) => r !== rating));
                                }
                              }}
                            />
                            <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-2">
                              <Badge
                                variant={rating === 'A' ? 'default' : rating === 'B' ? 'secondary' : 'outline'}
                                className={rating === 'A' ? 'bg-green-600' : rating === 'B' ? 'bg-amber-600 text-white' : ''}
                              >
                                {rating}
                              </Badge>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Owner Filter (disabled for ADM) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label>Inhaber</Label>
                        {userRole === 'ADM' && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Lock className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Sie sehen nur Ihre eigenen Kunden</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <div className="space-y-2 opacity-50 pointer-events-none">
                        <p className="text-xs text-muted-foreground">
                          {userRole === 'ADM'
                            ? 'Als ADM sehen Sie nur Ihre eigenen Kunden'
                            : 'Wählen Sie Inhaber zum Filtern'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <SheetFooter>
                    <div className="w-full space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {filteredCustomers.length} Kunden entsprechen Filtern
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={clearFilters} className="flex-1">
                          Zurücksetzen
                        </Button>
                        <Button onClick={() => setFilterSheetOpen(false)} className="flex-1">
                          Anwenden
                        </Button>
                      </div>
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {/* View Toggle */}
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-9 w-9 rounded-r-none"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-9 w-9 rounded-l-none"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right: Export, New Customer */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exportieren
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <FileDown className="mr-2 h-4 w-4" />
                    CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileDown className="mr-2 h-4 w-4" />
                    Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileDown className="mr-2 h-4 w-4" />
                    PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Neuer Kunde
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="bg-accent/50 border border-accent rounded-lg p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Aktive Filter:</span>
            {filterStatus.includes('active') && filterStatus.length === 1 && (
              <Badge variant="secondary" className="gap-1">
                Status: Aktiv
                <button
                  onClick={() => setFilterStatus([])}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filterRating.map((rating) => (
              <Badge key={rating} variant="secondary" className="gap-1">
                Bewertung: {rating}
                <button
                  onClick={() => setFilterRating(filterRating.filter((r) => r !== rating))}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Alle Filter entfernen
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Selection Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-accent/50 border-2 border-primary rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {selectedIds.size} Kunde{selectedIds.size !== 1 ? 'n' : ''} ausgewählt
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                E-Mail senden
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Status ändern
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Aktivieren</DropdownMenuItem>
                  <DropdownMenuItem>Deaktivieren</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportieren
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Löschen
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSelectedIds(new Set())}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {sortedCustomers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {searchQuery || hasActiveFilters ? (
              <>
                <Search className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="mb-2">Keine Kunden gefunden</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Keine Ergebnisse für &quot;{searchQuery}&quot; mit aktiven Filtern
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearFilters}>
                    Filter zurücksetzen
                  </Button>
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Neue Suche starten
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="mb-2">Noch keine Kunden vorhanden</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Beginnen Sie mit dem Hinzufügen Ihres ersten Kunden
                </p>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Ersten Kunden anlegen
                  </Button>
                  <Button variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Aus CSV importieren
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.size === paginatedCustomers.length && paginatedCustomers.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort('companyName')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Firmenname
                      {sortColumn === 'companyName' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort('vatId')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      USt-ID
                      {sortColumn === 'vatId' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort('city')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Standort
                      {sortColumn === 'city' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort('status')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Status
                      {sortColumn === 'status' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort('rating')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Bewertung
                      {sortColumn === 'rating' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort('createdAt')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Erstellt am
                      {sortColumn === 'createdAt' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort('owner')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Inhaber
                      {sortColumn === 'owner' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.map((customer) => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    isSelected={selectedIds.has(customer.id)}
                    onSelect={(checked) => toggleSelect(customer.id, checked)}
                    onView={() => toast.info(`Details für ${customer.companyName}`)}
                    onEdit={() => toast.info(`Bearbeiten: ${customer.companyName}`)}
                    onDelete={() => {
                      toast.success(`${customer.companyName} gelöscht`);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Zeige {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, sortedCustomers.length)} von{' '}
                  {sortedCustomers.length} Kunden
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          className="w-9"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Zeilen pro Seite:</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(v) => {
                      setPageSize(parseInt(v));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20">
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
          )}
        </Card>
      )}
    </div>
  );
}

export function CustomerListDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Kundenliste (PLAN/GF-Ansicht)</CardTitle>
          <CardDescription>
            Vollständige Kundenliste mit Suche, Filter, Sortierung, Multi-Select und Pagination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerListView userRole="PLAN" />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Kundenliste (ADM-Ansicht)</CardTitle>
          <CardDescription>
            ADM-Benutzer sehen nur ihre eigenen Kunden mit eingeschränktem Filter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerListView userRole="ADM" />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Suchleiste</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 400px Breite</li>
              <li>• Search-Icon links</li>
              <li>• Clear "×" rechts</li>
              <li>• Echtzeit-Suche</li>
              <li>• 300ms Debounce</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Tabelle</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Sticky Header</li>
              <li>• Sortierbare Spalten</li>
              <li>• Hover: Aktionen sichtbar</li>
              <li>• Auswahl: Blaue BG</li>
              <li>• 56px Zeilenhöhe</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Filter</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Sheet von rechts</li>
              <li>• Status, Bewertung</li>
              <li>• Badge mit Anzahl</li>
              <li>• RBAC: ADM eingeschränkt</li>
              <li>• Live-Vorschau: "X Kunden"</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Multi-Select</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Checkbox pro Zeile</li>
              <li>• "Alle auswählen" Header</li>
              <li>• Bulk-Aktionsleiste</li>
              <li>• E-Mail, Export, Löschen</li>
              <li>• Auswahlzähler</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Pagination</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• "Zeige X-Y von Z"</li>
              <li>• Seitenzahlen 1-5</li>
              <li>• Vor/Zurück Buttons</li>
              <li>• Zeilen pro Seite: 10-100</li>
              <li>• Sticky am Tabellenende</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">RBAC</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• GF/PLAN: Alle Kunden</li>
              <li>• ADM: Nur eigene</li>
              <li>• Lock-Icon bei Filter</li>
              <li>• Tooltip: Erklärung</li>
              <li>• Auto-Filter: Inhaber</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}