import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Lock,
  MoreVertical,
  FileText,
  Briefcase,
  DollarSign,
  MessageSquare,
  Edit,
  Ban,
  Trash2,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

// Types
export type SupplierStatus = 'active' | 'pending_approval' | 'inactive' | 'blacklisted';
export type SupplierType = 'material_supplier' | 'service_provider' | 'subcontractor' | 'craftsman' | 'logistics';
export type UserRole = 'INN' | 'PLAN' | 'BUCH' | 'GF' | 'KALK' | 'ADM';

export interface SupplierRating {
  overall: number;
  quality: number;
  reliability: number;
  communication: number;
  priceValue: number;
  projectCount: number;
  lastRated: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  type: SupplierType;
  serviceCategories: string[];
  location: string;
  phone: string;
  email: string;
  status: SupplierStatus;
  activeProjects: number;
  rating?: SupplierRating;
  lastActivity?: string;
  frameworkContract?: string;
  createdBy?: string;
  createdDate?: string;
  blacklistReason?: string;
}

// Mock Data
export const mockSuppliers: Supplier[] = [
  {
    id: 'sup1',
    companyName: 'Schreinerei Müller GmbH',
    type: 'subcontractor',
    serviceCategories: ['Tischlerei', 'Möbel', 'Montage', 'Holzverarbeitung'],
    location: 'München',
    phone: '+49 89 1234567',
    email: 'mueller@example.de',
    status: 'active',
    activeProjects: 5,
    rating: {
      overall: 4.8,
      quality: 4.9,
      reliability: 4.5,
      communication: 5.0,
      priceValue: 4.2,
      projectCount: 12,
      lastRated: 'Vor 1 Woche',
    },
    lastActivity: 'Vor 2 Wochen',
  },
  {
    id: 'sup2',
    companyName: 'Elektro Schmidt GmbH',
    type: 'service_provider',
    serviceCategories: ['Elektrik', 'Beleuchtung'],
    location: 'Augsburg',
    phone: '+49 821 987654',
    email: 'schmidt-elektro@example.de',
    status: 'active',
    activeProjects: 2,
    rating: {
      overall: 4.2,
      quality: 4.3,
      reliability: 4.0,
      communication: 4.5,
      priceValue: 4.0,
      projectCount: 8,
      lastRated: 'Vor 2 Wochen',
    },
    frameworkContract: '12/2025',
  },
  {
    id: 'sup3',
    companyName: 'Holzgroßhandel Weber KG',
    type: 'material_supplier',
    serviceCategories: ['Holzmaterialien'],
    location: 'München',
    phone: '+49 89 555666',
    email: 'weber@example.de',
    status: 'active',
    activeProjects: 0,
    rating: {
      overall: 4.0,
      quality: 4.2,
      reliability: 3.8,
      communication: 4.1,
      priceValue: 4.0,
      projectCount: 15,
      lastRated: 'Vor 3 Monate',
    },
    lastActivity: 'Vor 3 Monaten',
  },
  {
    id: 'sup4',
    companyName: 'Transport Neumann',
    type: 'logistics',
    serviceCategories: ['Transport', 'Lieferung'],
    location: 'München',
    phone: '+49 89 777888',
    email: 'neumann@example.de',
    status: 'pending_approval',
    activeProjects: 0,
    createdBy: 'Claudia Weber',
    createdDate: 'Vor 2 Tagen',
  },
  {
    id: 'sup5',
    companyName: 'Malerei Fischer',
    type: 'craftsman',
    serviceCategories: ['Malerei', 'Lackierung'],
    location: 'München',
    phone: '+49 89 333444',
    email: 'fischer-malerei@example.de',
    status: 'active',
    activeProjects: 3,
    rating: {
      overall: 4.6,
      quality: 4.7,
      reliability: 4.8,
      communication: 4.5,
      priceValue: 4.4,
      projectCount: 10,
      lastRated: 'Vor 5 Tage',
    },
    lastActivity: 'Vor 1 Woche',
  },
  {
    id: 'sup6',
    companyName: 'Sanitär Bauer GmbH',
    type: 'craftsman',
    serviceCategories: ['Sanitär', 'Heizung'],
    location: 'Frankfurt',
    phone: '+49 69 111222',
    email: 'bauer@example.de',
    status: 'inactive',
    activeProjects: 0,
    rating: {
      overall: 3.2,
      quality: 3.5,
      reliability: 2.8,
      communication: 3.3,
      priceValue: 3.2,
      projectCount: 4,
      lastRated: 'Vor 6 Monate',
    },
    lastActivity: 'Vor 8 Monaten',
  },
];

// Helper functions
export function getSupplierTypeLabel(type: SupplierType): string {
  const labels: Record<SupplierType, string> = {
    material_supplier: 'Materiallieferant',
    service_provider: 'Dienstleister',
    subcontractor: 'Subunternehmer',
    craftsman: 'Handwerker',
    logistics: 'Logistik',
  };
  return labels[type];
}

export function getStatusBadge(status: SupplierStatus) {
  const badges: Record<SupplierStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
    active: { label: 'Aktiv', variant: 'default', icon: CheckCircle },
    pending_approval: { label: 'Freigabe ausstehend', variant: 'secondary', icon: Clock },
    inactive: { label: 'Inaktiv', variant: 'outline', icon: XCircle },
    blacklisted: { label: 'Gesperrt', variant: 'destructive', icon: Lock },
  };
  return badges[status];
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 3.5) return 'text-blue-600';
  if (rating >= 2.5) return 'text-amber-600';
  return 'text-red-600';
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Sehr gut';
  if (rating >= 3.5) return 'Gut';
  if (rating >= 2.5) return 'Befriedigend';
  return 'Ungenügend';
}

export function getActiveProjectsColor(count: number): string {
  if (count === 0) return 'text-muted-foreground';
  if (count <= 2) return 'text-blue-600';
  if (count <= 5) return 'text-amber-600';
  return 'text-red-600';
}

export function getActiveProjectsLabel(count: number): string {
  if (count === 0) return 'Verfügbar';
  if (count <= 2) return 'Verfügbar';
  if (count <= 5) return 'Ausgelastet';
  return 'Überlastet';
}

// Star Rating Component
export interface StarRatingProps {
  rating: number;
  showNumeric?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, showNumeric = true, size = 'md' }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClass = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${sizeClass} fill-amber-400 text-amber-400`} />
      ))}
      {hasHalfStar && (
        <Star className={`${sizeClass} fill-amber-400 text-amber-400`} style={{ clipPath: 'inset(0 50% 0 0)' }} />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${sizeClass} text-gray-300`} />
      ))}
      {showNumeric && (
        <span className={`ml-1 ${getRatingColor(rating)}`} style={{ fontWeight: 'var(--font-weight-medium)' }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// Rating Tooltip Component
export interface RatingTooltipProps {
  rating: SupplierRating;
  children: React.ReactNode;
}

export function RatingTooltip({ rating, children }: RatingTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="w-64">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Qualität:</span>
              <StarRating rating={rating.quality} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Zuverlässigkeit:</span>
              <StarRating rating={rating.reliability} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Kommunikation:</span>
              <StarRating rating={rating.communication} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Preis/Leistung:</span>
              <StarRating rating={rating.priceValue} size="sm" />
            </div>
            <Separator className="my-2" />
            <p className="text-xs text-muted-foreground">
              Basierend auf {rating.projectCount} Projekten
            </p>
            <p className="text-xs text-muted-foreground">Letzte Bewertung: {rating.lastRated}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Supplier Card Component
export interface SupplierCardProps {
  supplier: Supplier;
  userRole: UserRole;
  onViewDetails: (id: string) => void;
  onCreateContract: (id: string) => void;
  onAssignProject: (id: string) => void;
  onCreateInvoice: (id: string) => void;
  onApprove: (id: string) => void;
}

export function SupplierCard({
  supplier,
  userRole,
  onViewDetails,
  onCreateContract,
  onAssignProject,
  onCreateInvoice,
  onApprove,
}: SupplierCardProps) {
  const statusBadge = getStatusBadge(supplier.status);
  const StatusIcon = statusBadge.icon;

  const canManage = ['INN', 'PLAN', 'GF'].includes(userRole);
  const canApprove = userRole === 'GF';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Top Row - Name & Rating */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
              <button
                onClick={() => onViewDetails(supplier.id)}
                className="text-blue-600 hover:underline text-left"
                style={{ fontWeight: 'var(--font-weight-semi-bold)' }}
              >
                {supplier.companyName}
              </button>
            </div>
            <div>
              {supplier.rating ? (
                <RatingTooltip rating={supplier.rating}>
                  <div>
                    <StarRating rating={supplier.rating.overall} />
                  </div>
                </RatingTooltip>
              ) : (
                <span className="text-sm text-muted-foreground">(Noch nicht bewertet)</span>
              )}
            </div>
          </div>

          {/* Second Row - Type & Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{getSupplierTypeLabel(supplier.type)}</Badge>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {supplier.serviceCategories.slice(0, 3).join(', ')}
              {supplier.serviceCategories.length > 3 && '...'}
            </span>
          </div>

          {/* Third Row - Contact Info */}
          <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{supplier.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <a href={`tel:${supplier.phone}`} className="hover:text-blue-600">
                {supplier.phone}
              </a>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <a href={`mailto:${supplier.email}`} className="hover:text-blue-600 truncate max-w-[200px]">
                {supplier.email}
              </a>
            </div>
          </div>

          {/* Fourth Row - Status Line */}
          <div className="flex items-center gap-3 flex-wrap text-sm">
            <Badge
              variant={statusBadge.variant}
              className={
                supplier.status === 'active'
                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                  : supplier.status === 'pending_approval'
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                  : supplier.status === 'blacklisted'
                  ? 'bg-red-100 text-red-800 hover:bg-red-100'
                  : ''
              }
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusBadge.label}
            </Badge>

            {supplier.status === 'active' && (
              <>
                {supplier.activeProjects > 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className={getActiveProjectsColor(supplier.activeProjects)}>
                      {supplier.activeProjects} aktive Projekte
                    </span>
                  </>
                )}
                {supplier.frameworkContract && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-green-600">Rahmenvertrag bis {supplier.frameworkContract}</span>
                  </>
                )}
                {supplier.lastActivity && !supplier.frameworkContract && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span>
                      {supplier.activeProjects > 0 ? 'Letzte Beauftragung' : 'Letzte Bestellung'}: {supplier.lastActivity}
                    </span>
                  </>
                )}
              </>
            )}

            {supplier.status === 'pending_approval' && (
              <>
                <span className="text-muted-foreground">•</span>
                <span>
                  Erstellt: {supplier.createdDate} ({supplier.createdBy})
                </span>
              </>
            )}
          </div>

          {/* Actions Row */}
          <div className="flex items-center gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(supplier.id)}>
              Details
            </Button>

            {supplier.status === 'pending_approval' && canApprove && (
              <Button size="sm" onClick={() => onApprove(supplier.id)} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-1" />
                Freigeben
              </Button>
            )}

            {supplier.status === 'active' && canManage && (
              <>
                {supplier.type !== 'material_supplier' && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => onCreateContract(supplier.id)}>
                      <FileText className="h-4 w-4 mr-1" />
                      Vertrag erstellen
                    </Button>
                    <Button size="sm" onClick={() => onAssignProject(supplier.id)}>
                      <Briefcase className="h-4 w-4 mr-1" />
                      Projekt zuweisen
                    </Button>
                  </>
                )}
                {supplier.type === 'material_supplier' && (
                  <Button size="sm" onClick={() => onCreateInvoice(supplier.id)}>
                    <DollarSign className="h-4 w-4 mr-1" />
                    Bestellung aufgeben
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Filter Sidebar Component
export interface FilterSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: any) => void;
}

export function FilterSidebar({ open, onOpenChange, onApplyFilters }: FilterSidebarProps) {
  const [statusFilters, setStatusFilters] = useState<SupplierStatus[]>(['active']);
  const [typeFilters, setTypeFilters] = useState<SupplierType[]>([]);
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState('');

  const handleApply = () => {
    onApplyFilters({
      status: statusFilters,
      types: typeFilters,
      rating: ratingFilter,
      location: locationFilter,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setStatusFilters(['active']);
    setTypeFilters([]);
    setRatingFilter('');
    setLocationFilter('');
    onApplyFilters({
      status: ['active'],
      types: [],
      rating: '',
      location: '',
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
          <SheetDescription>Lieferantenliste filtern</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-12rem)] mt-6">
          <div className="space-y-6 pr-4">
            {/* Status Filter */}
            <div className="space-y-3">
              <Label style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Status</Label>
              <div className="space-y-2">
                {(['active', 'pending_approval', 'inactive', 'blacklisted'] as SupplierStatus[]).map((status) => {
                  const badge = getStatusBadge(status);
                  const count =
                    status === 'active'
                      ? 24
                      : status === 'pending_approval'
                      ? 2
                      : status === 'inactive'
                      ? 3
                      : 0;
                  return (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={statusFilters.includes(status)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setStatusFilters([...statusFilters, status]);
                          } else {
                            setStatusFilters(statusFilters.filter((s) => s !== status));
                          }
                        }}
                      />
                      <Label htmlFor={`status-${status}`} className="cursor-pointer">
                        {badge.label} ({count})
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Type Filter */}
            <div className="space-y-3">
              <Label style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Lieferanten-Typ</Label>
              <div className="space-y-2">
                {(
                  [
                    'material_supplier',
                    'service_provider',
                    'subcontractor',
                    'craftsman',
                    'logistics',
                  ] as SupplierType[]
                ).map((type) => {
                  const counts = {
                    material_supplier: 8,
                    service_provider: 12,
                    subcontractor: 15,
                    craftsman: 7,
                    logistics: 3,
                  };
                  return (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={typeFilters.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTypeFilters([...typeFilters, type]);
                          } else {
                            setTypeFilters(typeFilters.filter((t) => t !== type));
                          }
                        }}
                      />
                      <Label htmlFor={`type-${type}`} className="cursor-pointer">
                        {getSupplierTypeLabel(type)} ({counts[type]})
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Rating Filter */}
            <div className="space-y-3">
              <Label style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Bewertung</Label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle Bewertungen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Alle Bewertungen</SelectItem>
                  <SelectItem value="5">5 Sterne (6)</SelectItem>
                  <SelectItem value="4-5">4-5 Sterne (18)</SelectItem>
                  <SelectItem value="3-4">3-4 Sterne (8)</SelectItem>
                  <SelectItem value="lt3">{'<'}3 Sterne (2)</SelectItem>
                  <SelectItem value="unrated">Noch nicht bewertet (11)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Location Filter */}
            <div className="space-y-3">
              <Label htmlFor="location" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Standort
              </Label>
              <Input
                id="location"
                placeholder="Stadt oder PLZ"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-background">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Zurücksetzen
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Anwenden
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Main Supplier List View
export interface SupplierListViewProps {
  userRole?: UserRole;
}

export function SupplierListView({ userRole = 'INN' }: SupplierListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<any>({ status: ['active'], types: [], rating: '', location: '' });
  const [suppliers, setSuppliers] = useState(mockSuppliers);

  const canCreate = ['INN', 'PLAN', 'GF'].includes(userRole);
  const canExport = userRole === 'GF';

  // Filter and search suppliers
  const filteredSuppliers = suppliers.filter((supplier) => {
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(supplier.status)) {
      return false;
    }

    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(supplier.type)) {
      return false;
    }

    // Rating filter
    if (filters.rating) {
      if (filters.rating === 'unrated' && supplier.rating) return false;
      if (filters.rating === 'unrated' && !supplier.rating) return true;
      if (filters.rating === '5' && (!supplier.rating || supplier.rating.overall < 5)) return false;
      if (filters.rating === '4-5' && (!supplier.rating || supplier.rating.overall < 4)) return false;
      if (filters.rating === '3-4' && (!supplier.rating || supplier.rating.overall < 3 || supplier.rating.overall >= 4))
        return false;
      if (filters.rating === 'lt3' && (!supplier.rating || supplier.rating.overall >= 3)) return false;
    }

    // Location filter
    if (filters.location && !supplier.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        supplier.companyName.toLowerCase().includes(query) ||
        supplier.location.toLowerCase().includes(query) ||
        supplier.email.toLowerCase().includes(query) ||
        supplier.phone.includes(query) ||
        supplier.serviceCategories.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Sort suppliers
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.companyName.localeCompare(b.companyName);
      case 'name-desc':
        return b.companyName.localeCompare(a.companyName);
      case 'rating-desc':
        return (b.rating?.overall || 0) - (a.rating?.overall || 0);
      case 'projects-desc':
        return b.activeProjects - a.activeProjects;
      default:
        return 0;
    }
  });

  const handleViewDetails = (id: string) => {
    toast.info(`Navigation zu Lieferant ${id} Details`);
  };

  const handleCreateContract = (id: string) => {
    const supplier = suppliers.find((s) => s.id === id);
    toast.success(`Vertrag erstellen für ${supplier?.companyName}`);
  };

  const handleAssignProject = (id: string) => {
    const supplier = suppliers.find((s) => s.id === id);
    toast.success(`Projekt zuweisen zu ${supplier?.companyName}`);
  };

  const handleCreateInvoice = (id: string) => {
    const supplier = suppliers.find((s) => s.id === id);
    toast.success(`Bestellung aufgeben bei ${supplier?.companyName}`);
  };

  const handleApprove = (id: string) => {
    const supplier = suppliers.find((s) => s.id === id);
    setSuppliers(suppliers.map((s) => (s.id === id ? { ...s, status: 'active' as SupplierStatus } : s)));
    toast.success(`${supplier?.companyName} wurde freigegeben`);
  };

  const handleCreateSupplier = () => {
    toast.success('Neuen Lieferant erstellen');
  };

  const handleExport = () => {
    toast.success('Export wird vorbereitet...');
  };

  const activeCount = suppliers.filter((s) => s.status === 'active').length;
  const pendingCount = suppliers.filter((s) => s.status === 'pending_approval').length;
  const inactiveCount = suppliers.filter((s) => s.status === 'inactive').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Lieferanten & Subunternehmer</h1>
          <p className="text-sm text-muted-foreground">
            Verwaltung Ihrer Lieferanten, Subunternehmer und Dienstleister
          </p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Lieferanten suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          {canExport && (
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          {canCreate && (
            <Button onClick={handleCreateSupplier}>
              <Plus className="h-4 w-4 mr-2" />
              Neuer Lieferant
            </Button>
          )}
        </div>
      </div>

      {/* Status Tabs & Sort */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => setFilters({ ...filters, status: ['active'] })}
                className={`text-sm ${
                  filters.status.includes('active') && filters.status.length === 1
                    ? 'text-blue-600'
                    : 'text-muted-foreground'
                } hover:text-blue-600`}
                style={{ fontWeight: 'var(--font-weight-medium)' }}
              >
                Aktiv <CheckCircle className="inline h-3 w-3 ml-1" /> ({activeCount})
              </button>
              <span className="text-muted-foreground">|</span>
              <button
                onClick={() => setFilters({ ...filters, status: ['inactive'] })}
                className={`text-sm ${
                  filters.status.includes('inactive') && filters.status.length === 1
                    ? 'text-blue-600'
                    : 'text-muted-foreground'
                } hover:text-blue-600`}
              >
                Inaktiv ({inactiveCount})
              </button>
              {userRole === 'GF' && (
                <>
                  <span className="text-muted-foreground">|</span>
                  <button
                    onClick={() => setFilters({ ...filters, status: ['pending_approval'] })}
                    className={`text-sm ${
                      filters.status.includes('pending_approval') && filters.status.length === 1
                        ? 'text-blue-600'
                        : 'text-muted-foreground'
                    } hover:text-blue-600`}
                  >
                    Freigabe ausstehend ({pendingCount})
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sortierung:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="rating-desc">Bewertung (Höchste)</SelectItem>
                  <SelectItem value="projects-desc">Aktive Projekte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier List */}
      {sortedSuppliers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {searchQuery || filters.status.length > 0 || filters.types.length > 0 ? (
              <>
                <h3 className="mb-2">Keine Ergebnisse</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Keine Lieferanten gefunden für: "{searchQuery}"
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setShowFilters(true)}>
                    Filter anpassen
                  </Button>
                  {canCreate && <Button onClick={handleCreateSupplier}>Neuen Lieferant erfassen</Button>}
                </div>
              </>
            ) : (
              <>
                <h3 className="mb-2">Noch keine Lieferanten erfasst</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Fügen Sie Ihre externen Partner hinzu, um sie Projekten zuzuweisen.
                </p>
                {canCreate && <Button onClick={handleCreateSupplier}>+ Ersten Lieferant erfassen</Button>}
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              userRole={userRole}
              onViewDetails={handleViewDetails}
              onCreateContract={handleCreateContract}
              onAssignProject={handleAssignProject}
              onCreateInvoice={handleCreateInvoice}
              onApprove={handleApprove}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {sortedSuppliers.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {sortedSuppliers.length} Lieferanten angezeigt von {suppliers.length} gesamt
          </p>
          {sortedSuppliers.length < suppliers.length && (
            <Button variant="outline" onClick={() => toast.info('Mehr Lieferanten laden...')}>
              Mehr laden...
            </Button>
          )}
        </div>
      )}

      {/* Filter Sidebar */}
      <FilterSidebar open={showFilters} onOpenChange={setShowFilters} onApplyFilters={setFilters} />
    </div>
  );
}

// Demo Component
export function SupplierListViewDemo() {
  const [userRole, setUserRole] = useState<UserRole>('INN');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Lieferantenliste</h2>
        <p className="text-sm text-muted-foreground">
          Durchsuchbare Lieferantendatenbank mit Filter, Performance-Bewertungen und rollenbasierten
          Schnellaktionen
        </p>
      </div>

      {/* Role Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Demo-Einstellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="role-select">Benutzerrolle:</Label>
            <Select value={userRole} onValueChange={(v: UserRole) => setUserRole(v)}>
              <SelectTrigger id="role-select" className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INN">INN (Außendienst)</SelectItem>
                <SelectItem value="PLAN">PLAN (Planung)</SelectItem>
                <SelectItem value="BUCH">BUCH (Buchhaltung)</SelectItem>
                <SelectItem value="GF">GF (Geschäftsführung)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main List View */}
      <SupplierListView userRole={userRole} />

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Funktionen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Suche:</strong> Durchsucht Firmennamen, Standorte, Kategorien, Kontakte
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Bewertungssystem:</strong> 5-Sterne mit 4 Dimensionen (Qualität, Zuverlässigkeit,
              Kommunikation, Preis/Leistung)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Status-Filter:</strong> Aktiv, Freigabe ausstehend, Inaktiv, Gesperrt
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Typ-Filter:</strong> 5 Kategorien (Materiallieferant, Dienstleister, Subunternehmer,
              Handwerker, Logistik)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Sortierung:</strong> Nach Name, Bewertung, aktive Projekte
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Schnellaktionen:</strong> Details, Vertrag erstellen, Projekt zuweisen, Bestellung aufgeben
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Performance-Indikatoren:</strong> Farbcodierte Bewertungen und Auslastung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Freigabe-Workflow:</strong> GF kann neue Lieferanten genehmigen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Rollenbasierte Aktionen:</strong> INN/PLAN/GF können erstellen, BUCH kann Rechnungen
              erfassen
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mock Data Info */}
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle className="text-sm">Mock-Daten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• 6 Lieferanten gesamt</p>
          <p>• 4 Aktiv (Schreinerei Müller, Elektro Schmidt, Holzgroßhandel Weber, Malerei Fischer)</p>
          <p>• 1 Freigabe ausstehend (Transport Neumann)</p>
          <p>• 1 Inaktiv (Sanitär Bauer)</p>
          <p>• Top-Bewertet: Schreinerei Müller (4.8 Sterne, 12 Projekte)</p>
          <p>• Meiste Projekte: Schreinerei Müller (5 aktive Projekte)</p>
          <p>• Rahmenvertrag: Elektro Schmidt (bis 12/2025)</p>
        </CardContent>
      </Card>
    </div>
  );
}