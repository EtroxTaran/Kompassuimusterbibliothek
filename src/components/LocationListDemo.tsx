import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { toast } from 'sonner@2.0.3';
import {
  MapPin,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Star,
  User,
  Truck,
  Phone,
  Building2,
  Store,
  Package,
  HardHat,
  ChevronDown,
  ChevronUp,
  Lock,
  LayoutGrid,
  List,
  MoreVertical,
  X,
  ExternalLink,
  Navigation,
} from 'lucide-react';

// Location types
export type LocationType = 'headquarter' | 'branch' | 'warehouse' | 'project' | 'other';
export type LocationStatus = 'active' | 'inactive';

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  status: LocationStatus;
  isPrimary: boolean;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  primaryContact?: {
    name: string;
    phone: string;
  };
  additionalContacts?: number;
  deliveryNotes?: string;
  openingHours?: string;
  parkingInfo?: string;
}

// Location type config
export const locationTypeConfig: Record<
  LocationType,
  { label: string; color: string; bgColor: string; icon: any }
> = {
  headquarter: {
    label: 'Hauptsitz',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: Building2,
  },
  branch: {
    label: 'Filiale',
    color: 'text-primary',
    bgColor: 'bg-accent/50',
    icon: Store,
  },
  warehouse: {
    label: 'Lager',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    icon: Package,
  },
  project: {
    label: 'Projektstandort',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: HardHat,
  },
  other: {
    label: 'Sonstige',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: MapPin,
  },
};

// Sample locations
const sampleLocations: Location[] = [
  {
    id: '1',
    name: 'Filiale München Süd',
    type: 'branch',
    status: 'active',
    isPrimary: true,
    address: {
      street: 'Industriestraße 42',
      postalCode: '81379',
      city: 'München',
      country: 'Deutschland',
    },
    primaryContact: {
      name: 'Hans Müller',
      phone: '+49-89-1234567',
    },
    additionalContacts: 2,
    deliveryNotes:
      'Hintereingang nutzen. Parkplätze vorhanden. Anlieferung Mo-Fr 8-16 Uhr.',
    openingHours: 'Mo-Fr: 8:00-18:00, Sa: 9:00-14:00',
    parkingInfo: '5 Parkplätze hinter dem Gebäude',
  },
  {
    id: '2',
    name: 'Hauptsitz',
    type: 'headquarter',
    status: 'active',
    isPrimary: false,
    address: {
      street: 'Hauptstraße 1',
      postalCode: '80331',
      city: 'München',
      country: 'Deutschland',
    },
    primaryContact: {
      name: 'Maria Schmidt',
      phone: '+49-89-9876543',
    },
    deliveryNotes: 'Empfang im Erdgeschoss. Zufahrt über Seitenstraße.',
  },
  {
    id: '3',
    name: 'Lager Augsburg',
    type: 'warehouse',
    status: 'inactive',
    isPrimary: false,
    address: {
      street: 'Lagerstraße 10',
      postalCode: '86150',
      city: 'Augsburg',
      country: 'Deutschland',
    },
    deliveryNotes: 'Geschlossen seit 01.10.2024. Keine Anlieferung möglich.',
  },
  {
    id: '4',
    name: 'Baustelle Regensburg',
    type: 'project',
    status: 'active',
    isPrimary: false,
    address: {
      street: 'Bahnhofstraße 55',
      postalCode: '93047',
      city: 'Regensburg',
      country: 'Deutschland',
    },
    primaryContact: {
      name: 'Thomas Weber',
      phone: '+49-941-555666',
    },
    deliveryNotes: 'Temporärer Standort bis 31.12.2024. Baustellenzufahrt nutzen.',
    parkingInfo: 'Nur für Lieferfahrzeuge',
  },
];

// Location card component
export function LocationCard({
  location,
  isSelected,
  onSelect,
  onSetPrimary,
  onEdit,
  onDelete,
  canEdit = true,
}: {
  location: Location;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onSetPrimary: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit?: boolean;
}) {
  const [notesExpanded, setNotesExpanded] = useState(false);
  const typeConfig = locationTypeConfig[location.type];
  const TypeIcon = typeConfig.icon;

  const fullAddress = `${location.address.street}, ${location.address.postalCode} ${location.address.city}, ${location.address.country}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;

  return (
    <Card
      className={`hover:shadow-lg transition-all hover:border-primary/50 relative ${
        isSelected ? 'border-primary bg-accent/30' : ''
      }`}
    >
      {/* Checkbox for selection */}
      <div className="absolute top-4 left-4">
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </div>

      <CardContent className="pt-6 pl-12">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4>{location.name}</h4>
                {location.isPrimary && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Standard-Lieferstandort</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`${typeConfig.bgColor} ${typeConfig.color} gap-1`}>
                  <TypeIcon className="h-3 w-3" />
                  {typeConfig.label}
                </Badge>
                <Badge variant={location.status === 'active' ? 'default' : 'secondary'}>
                  {location.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </div>
            </div>

            {/* Primary star toggle */}
            {!location.isPrimary && location.status === 'active' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onSetPrimary}
                      className="text-muted-foreground hover:text-yellow-500 transition-colors"
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Als Standard-Lieferstandort festlegen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <Separator />

          {/* Address & Map */}
          <div className="flex gap-4">
            <div className="flex items-start gap-3 flex-1">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p>{location.address.street}</p>
                <p>
                  {location.address.postalCode} {location.address.city}
                </p>
                <p>{location.address.country}</p>
                <div className="flex flex-col gap-1 mt-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                  >
                    Auf Karte anzeigen
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href={googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                  >
                    Navigation starten
                    <Navigation className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Mini Map Preview */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-24 h-24 bg-muted/30 rounded-md border border-border overflow-hidden shrink-0 group hover:ring-2 hover:ring-primary/20 transition-all"
              title="Auf Google Maps öffnen"
            >
              {/* Abstract Map Pattern */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:8px_8px]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="h-4 w-4 text-primary fill-primary/20" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-[1px] py-1 px-2 border-t border-border flex items-center justify-center">
                <span className="text-[10px] font-medium text-foreground truncate">
                  Karte
                </span>
              </div>
            </a>
          </div>

          {/* Primary Contact */}
          {location.primaryContact && (
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-1">Ansprechpartner</p>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{location.primaryContact.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {location.primaryContact.phone}
                  </div>
                </div>
                {location.additionalContacts && location.additionalContacts > 0 && (
                  <button className="text-xs text-primary hover:underline mt-1">
                    +{location.additionalContacts} weitere Kontakte
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Delivery Information */}
          {location.deliveryNotes && (
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <button
                  onClick={() => setNotesExpanded(!notesExpanded)}
                  className="flex items-center gap-2 text-xs uppercase text-muted-foreground mb-1 hover:text-foreground"
                >
                  Lieferhinweise
                  {notesExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
                {notesExpanded ? (
                  <div className="bg-gray-50 rounded-md p-3 space-y-2">
                    <p className="text-sm text-muted-foreground">{location.deliveryNotes}</p>
                    {location.openingHours && (
                      <div>
                        <p className="text-xs font-medium mb-1">Öffnungszeiten:</p>
                        <p className="text-sm text-muted-foreground">{location.openingHours}</p>
                      </div>
                    )}
                    {location.parkingInfo && (
                      <div>
                        <p className="text-xs font-medium mb-1">Parken:</p>
                        <p className="text-sm text-muted-foreground">{location.parkingInfo}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {location.deliveryNotes}
                    {location.deliveryNotes.length > 50 && (
                      <button
                        onClick={() => setNotesExpanded(true)}
                        className="text-primary hover:underline ml-1"
                      >
                        mehr
                      </button>
                    )}
                  </p>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-end gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Details anzeigen</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onEdit}
                    disabled={!canEdit}
                  >
                    <Pencil className="h-4 w-4" />
                    {!canEdit && <Lock className="h-2 w-2 absolute top-1 right-1" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {canEdit ? 'Bearbeiten' : 'Keine Berechtigung zum Bearbeiten'}
                </TooltipContent>
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
                  <Eye className="mr-2 h-4 w-4" />
                  Details anzeigen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit} disabled={!canEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Bearbeiten
                </DropdownMenuItem>
                {!location.isPrimary && location.status === 'active' && (
                  <DropdownMenuItem onClick={onSetPrimary}>
                    <Star className="mr-2 h-4 w-4" />
                    Als Standard festlegen
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  disabled={!canEdit || location.isPrimary}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Löschen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Full location list view
export function LocationListView({ userRole = 'GF', initialLocations }: { userRole?: 'GF' | 'PLAN' | 'ADM', initialLocations?: Location[] }) {
  const [locations, setLocations] = useState(initialLocations || sampleLocations);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<'all' | 'active'>('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);

  const canEdit = userRole === 'GF' || userRole === 'PLAN';

  // Filter locations
  const filteredLocations = locations.filter((loc) => {
    if (filterStatus === 'active') {
      return loc.status === 'active';
    }
    return true;
  });

  // Sort locations
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'type') {
      return a.type.localeCompare(b.type);
    }
    return 0;
  });

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

  // Set primary location
  const handleSetPrimary = (locationId: string) => {
    setLocations(
      locations.map((loc) => ({
        ...loc,
        isPrimary: loc.id === locationId,
      }))
    );
    toast.success('Standard-Lieferstandort aktualisiert');
  };

  // Delete location
  const handleDelete = (location: Location) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      setLocations(locations.filter((loc) => loc.id !== locationToDelete.id));
      toast.success(`Standort "${locationToDelete.name}" gelöscht`);
      setDeleteDialogOpen(false);
      setLocationToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3>Standorte</h3>
            <Badge variant="secondary">{locations.length}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Hofladen Müller GmbH</p>
        </div>
        <Button disabled={!canEdit}>
          <Plus className="mr-2 h-4 w-4" />
          Standort hinzufügen
        </Button>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left: Filter */}
            <div className="flex items-center gap-2">
              <Select
                value={filterStatus}
                onValueChange={(v) => setFilterStatus(v as 'all' | 'active')}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle anzeigen</SelectItem>
                  <SelectItem value="active">Nur aktive</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-9 w-9 rounded-r-none"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-9 w-9 rounded-l-none"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right: Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sortiert nach:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="type">Typ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Selection Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-accent/50 border-2 border-primary rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {selectedIds.size} Standort{selectedIds.size !== 1 ? 'e' : ''} ausgewählt
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Status ändern
              </Button>
              <Button variant="outline" size="sm">
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

      {/* Location Cards Grid */}
      {sortedLocations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="mb-2">Noch keine Standorte angelegt</h3>
            <p className="text-muted-foreground text-center mb-4">
              Fügen Sie Standorte hinzu, um verschiedene Lieferadressen zu verwalten
            </p>
            <Button disabled={!canEdit}>
              <Plus className="mr-2 h-4 w-4" />
              Ersten Standort hinzufügen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              isSelected={selectedIds.has(location.id)}
              onSelect={(checked) => toggleSelect(location.id, checked)}
              onSetPrimary={() => handleSetPrimary(location.id)}
              onEdit={() => toast.info(`Bearbeiten: ${location.name}`)}
              onDelete={() => handleDelete(location)}
              canEdit={canEdit}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Standort löschen</DialogTitle>
            <DialogDescription>
              Möchten Sie den Standort &quot;{locationToDelete?.name}&quot; wirklich löschen?
              {locationToDelete?.isPrimary && (
                <span className="text-destructive block mt-2">
                  Dies ist der Standard-Lieferstandort. Sie müssen einen anderen Standort als
                  Standard festlegen.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={locationToDelete?.isPrimary}
            >
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Location type examples
function LocationTypeExamples() {
  const types: LocationType[] = ['headquarter', 'branch', 'warehouse', 'project', 'other'];

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Standort-Typen</h4>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {types.map((type) => {
          const config = locationTypeConfig[type];
          const Icon = config.icon;
          return (
            <Card key={type}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-10 w-10 rounded-full ${config.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <h4 className="text-sm font-medium">{config.label}</h4>
                  </div>
                  <Badge className={`${config.bgColor} ${config.color} gap-1`}>
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground">
        5 verschiedene Standort-Typen mit eindeutigen Icons und Farben
      </p>
    </div>
  );
}

// Single location card demo
function SingleLocationDemo() {
  const location = sampleLocations[0]; // Primary location

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Einzelne Standortkarte (Standard-Lieferstandort)</h4>

      <div className="max-w-md">
        <LocationCard
          location={location}
          isSelected={false}
          onSelect={() => {}}
          onSetPrimary={() => toast.success('Standard-Lieferstandort aktualisiert')}
          onEdit={() => toast.info('Bearbeiten')}
          onDelete={() => toast.error('Standard-Standort kann nicht gelöscht werden')}
          canEdit={true}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Vollständige Standortkarte mit Adresse, Kontakt, erweiterbaren Lieferhinweisen und goldenem
        Stern für Standard-Lieferstandort
      </p>
    </div>
  );
}

// RBAC restricted demo
function RestrictedLocationDemo() {
  const location = sampleLocations[1];

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Eingeschränkte Ansicht (ADM-Rolle)</h4>

      <div className="max-w-md">
        <LocationCard
          location={location}
          isSelected={false}
          onSelect={() => {}}
          onSetPrimary={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
          canEdit={false}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        ADM-Benutzer sehen Lock-Icon bei Bearbeiten-Button und können keine Änderungen vornehmen
      </p>
    </div>
  );
}

export function LocationListDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Vollständige Standortliste</CardTitle>
          <CardDescription>
            Standorte mit Adressen, Kontakten, Lieferhinweisen und Standard-Standort-Indikator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LocationListView userRole="GF" />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Einzelne Standortkarte</CardTitle>
          <CardDescription>
            Karte mit allen Details: Adresse, Kontakt, Lieferhinweise, Standard-Indikator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SingleLocationDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Standort-Typen</CardTitle>
          <CardDescription>5 verschiedene Typen mit Icons und Farbkodierung</CardDescription>
        </CardHeader>
        <CardContent>
          <LocationTypeExamples />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RBAC-Einschränkung</CardTitle>
          <CardDescription>
            ADM-Benutzer können Standorte nicht bearbeiten (nur eigene Kunden)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RestrictedLocationDemo />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Standortkarte</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Grid: 2-3 Karten pro Zeile</li>
              <li>• Checkbox für Auswahl</li>
              <li>• Standortname (18px, fett)</li>
              <li>• Typ- und Status-Badges</li>
              <li>• Goldener Stern (Standard)</li>
              <li>• Hover: Shadow + Border</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Standort-Typen</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Hauptsitz (Lila, Building2)</li>
              <li>• Filiale (Blau, Store)</li>
              <li>• Lager (Amber, Package)</li>
              <li>• Projektstandort (Grün, HardHat)</li>
              <li>• Sonstige (Grau, MapPin)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Adresse</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• MapPin Icon</li>
              <li>• Straße, PLZ, Stadt</li>
              <li>• Land</li>
              <li>• 14px, Zeilenhöhe 1.6</li>
              <li>• Grauer Text</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Kontakt</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• User Icon</li>
              <li>• &quot;Ansprechpartner&quot; Label</li>
              <li>• Name (14px, semibold)</li>
              <li>• Telefon mit Phone Icon</li>
              <li>• &quot;+X weitere Kontakte&quot;</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Lieferhinweise</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Truck Icon</li>
              <li>• Erweiterbar (Chevron)</li>
              <li>• Grauer Hintergrund erweitert</li>
              <li>• Öffnungszeiten</li>
              <li>• Parkinfo</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Aktionen</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Eye: Details anzeigen</li>
              <li>• Pencil: Bearbeiten</li>
              <li>• Star: Als Standard festlegen</li>
              <li>• Trash: Löschen</li>
              <li>• Lock: RBAC-Einschränkung</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}