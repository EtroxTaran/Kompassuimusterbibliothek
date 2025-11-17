import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Sheet, SheetContent } from './ui/sheet';
import { toast } from 'sonner@2.0.3';
import {
  MapPin,
  Navigation,
  Phone,
  Plus,
  X,
  Search,
  Layers,
  Compass,
  ZoomIn,
  ZoomOut,
  Route,
  Clock,
  Calendar,
  TrendingUp,
  Share2,
  Bookmark,
  List,
  Map,
  Building2,
  ChevronRight,
  GripVertical,
  Check,
  AlertCircle,
  Settings,
  ExternalLink,
  MoreVertical,
} from 'lucide-react';

// Customer location type
interface CustomerLocation {
  id: string;
  companyName: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  lastVisit: string;
  nextAppointment?: string;
  status: 'not-visited' | 'visited' | 'overdue';
  hasOpportunity?: boolean;
}

// Route stop type
interface RouteStop {
  id: string;
  type: 'current' | 'customer';
  location: CustomerLocation | null;
  order: number;
  time?: string;
}

// Mock customer data
const mockCustomers: CustomerLocation[] = [
  {
    id: '1',
    companyName: 'Hofladen Müller GmbH',
    address: 'Industriestraße 42, 81379 München',
    lat: 48.1351,
    lng: 11.582,
    distance: 8,
    lastVisit: 'Vor 7 Tagen',
    nextAppointment: 'Heute 10:00',
    status: 'not-visited',
    hasOpportunity: true,
  },
  {
    id: '2',
    companyName: 'REWE München Süd',
    address: 'Hauptstraße 123, 80331 München',
    lat: 48.1371,
    lng: 11.575,
    distance: 12,
    lastVisit: 'Vor 2 Tagen',
    nextAppointment: 'Heute 14:00',
    status: 'not-visited',
  },
  {
    id: '3',
    companyName: 'Bäckerei Schmidt',
    address: 'Marktplatz 5, 80333 München',
    lat: 48.1391,
    lng: 11.578,
    distance: 5,
    lastVisit: 'Vor 14 Tagen',
    status: 'overdue',
  },
  {
    id: '4',
    companyName: 'Möbelhaus Weber',
    address: 'Leopoldstraße 88, 80802 München',
    lat: 48.1411,
    lng: 11.580,
    distance: 15,
    lastVisit: 'Heute 09:30',
    status: 'visited',
  },
  {
    id: '5',
    companyName: 'Baumarkt Fischer',
    address: 'Nymphenburger Str. 10, 80335 München',
    lat: 48.1331,
    lng: 11.565,
    distance: 20,
    lastVisit: 'Vor 5 Tagen',
    status: 'not-visited',
  },
];

// Get marker color based on status
function getMarkerColor(status: CustomerLocation['status']) {
  switch (status) {
    case 'visited':
      return 'text-green-600 bg-green-100';
    case 'overdue':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-blue-600 bg-blue-100';
  }
}

// Customer Info Bottom Sheet
function CustomerInfoSheet({
  customer,
  isOpen,
  onClose,
  onPlanRoute,
}: {
  customer: CustomerLocation | null;
  isOpen: boolean;
  onClose: () => void;
  onPlanRoute: (customer: CustomerLocation) => void;
}) {
  if (!customer) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-auto max-h-[60vh] p-0 border-0 rounded-t-xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Handle Bar */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-muted-foreground/20 rounded-full" />
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="mb-2">{customer.companyName}</h3>
              <p className="text-muted-foreground mb-2">{customer.address}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {customer.distance} km entfernt
                </Badge>
                <Badge variant="outline">Letzter Besuch: {customer.lastVisit}</Badge>
                {customer.nextAppointment && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Clock className="h-3 w-3 mr-1" />
                    {customer.nextAppointment}
                  </Badge>
                )}
                {customer.hasOpportunity && (
                  <Badge className="bg-amber-100 text-amber-800">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Opportunity
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                onPlanRoute(customer);
                onClose();
              }}
            >
              <Navigation className="mr-2 h-5 w-5" />
              Route planen
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  toast.success(`Rufe ${customer.companyName} an...`);
                }}
              >
                <Phone className="mr-2 h-4 w-4" />
                Anrufen
              </Button>
              <Button variant="outline" onClick={() => toast.info('Details werden geöffnet...')}>
                Details anzeigen
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Route Stop Item
function RouteStopItem({
  stop,
  index,
  onRemove,
  isFirst,
  isLast,
}: {
  stop: RouteStop;
  index: number;
  onRemove?: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const isCurrentLocation = stop.type === 'current';

  return (
    <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg">
      {/* Drag Handle */}
      {!isCurrentLocation && (
        <GripVertical className="h-5 w-5 text-muted-foreground shrink-0" />
      )}

      {/* Stop Number/Icon */}
      <div
        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
          isCurrentLocation
            ? 'bg-blue-600 text-white'
            : isLast
            ? 'bg-green-600 text-white'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {isCurrentLocation ? <MapPin className="h-4 w-4" /> : index}
      </div>

      {/* Stop Info */}
      <div className="flex-1 min-w-0">
        {isCurrentLocation ? (
          <p>Aktueller Standort</p>
        ) : (
          <>
            <p className="truncate mb-1">{stop.location?.companyName}</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{stop.location?.distance} km</span>
              {stop.time && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {stop.time}
                  </span>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Remove Button */}
      {!isCurrentLocation && onRemove && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// Route Planning Sheet
function RoutePlanningSheet({
  stops,
  isOpen,
  onClose,
  onAddStop,
  onRemoveStop,
  onOptimizeRoute,
  onStartNavigation,
}: {
  stops: RouteStop[];
  isOpen: boolean;
  onClose: () => void;
  onAddStop: () => void;
  onRemoveStop: (index: number) => void;
  onOptimizeRoute: () => void;
  onStartNavigation: () => void;
}) {
  // Calculate route stats
  const totalDistance = stops.reduce(
    (sum, stop) => sum + (stop.location?.distance || 0),
    0
  );
  const totalTime = Math.round(totalDistance / 40 * 60); // Rough estimate: 40 km/h average
  const customerCount = stops.filter((s) => s.type === 'customer').length;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[80vh] p-0 border-0 rounded-t-xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Handle Bar */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-muted-foreground/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h3>Routenplanung</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Route Stats */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-muted-foreground mb-1">Gesamtstrecke</p>
                  <p>{totalDistance} km</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Fahrzeit</p>
                  <p>
                    {Math.floor(totalTime / 60)} Std {totalTime % 60} Min
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Stopps</p>
                  <p>{customerCount} Kunden</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scrollable Stops List */}
        <div className="px-6 overflow-y-auto h-[calc(80vh-300px)] space-y-3 pb-4">
          {stops.map((stop, index) => (
            <RouteStopItem
              key={stop.id}
              stop={stop}
              index={index}
              onRemove={
                stop.type === 'customer' ? () => onRemoveStop(index) : undefined
              }
              isFirst={index === 0}
              isLast={index === stops.length - 1}
            />
          ))}

          <Button variant="outline" className="w-full" onClick={onAddStop}>
            <Plus className="mr-2 h-4 w-4" />
            Stopp hinzufügen
          </Button>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-border bg-background">
          <div className="space-y-3">
            <Button className="w-full" size="lg" onClick={onStartNavigation}>
              <Navigation className="mr-2 h-5 w-5" />
              Navigation starten
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={onOptimizeRoute}>
                <Route className="mr-2 h-4 w-4" />
                Optimieren
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success('Route wird geteilt...')}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Teilen
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Main Map View Component
export function MapRoutePlanner() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showTodayRoute, setShowTodayRoute] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerLocation | null>(null);
  const [showCustomerSheet, setShowCustomerSheet] = useState(false);
  const [showRouteSheet, setShowRouteSheet] = useState(false);
  const [routeStops, setRouteStops] = useState<RouteStop[]>([
    {
      id: 'current',
      type: 'current',
      location: null,
      order: 0,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'today' | 'overdue' | 'opportunities'>('all');
  const [showLayers, setShowLayers] = useState(false);

  // Filter customers
  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      searchQuery === '' ||
      customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'today' && customer.nextAppointment) ||
      (filter === 'overdue' && customer.status === 'overdue') ||
      (filter === 'opportunities' && customer.hasOpportunity);

    return matchesSearch && matchesFilter;
  });

  // Get today's appointments
  const todayAppointments = mockCustomers.filter((c) => c.nextAppointment);

  // Handle customer marker click
  const handleMarkerClick = (customer: CustomerLocation) => {
    setSelectedCustomer(customer);
    setShowCustomerSheet(true);
  };

  // Handle plan route
  const handlePlanRoute = (customer: CustomerLocation) => {
    // Add customer to route stops
    const newStop: RouteStop = {
      id: `stop-${customer.id}`,
      type: 'customer',
      location: customer,
      order: routeStops.length,
      time: customer.nextAppointment,
    };
    setRouteStops([...routeStops, newStop]);
    setShowRouteSheet(true);
    toast.success(`${customer.companyName} zur Route hinzugefügt`);
  };

  // Handle add stop
  const handleAddStop = () => {
    toast.info('Wählen Sie einen Kunden auf der Karte aus');
    setShowRouteSheet(false);
  };

  // Handle remove stop
  const handleRemoveStop = (index: number) => {
    const newStops = routeStops.filter((_, i) => i !== index);
    setRouteStops(newStops);
    toast.success('Stopp entfernt');
  };

  // Handle optimize route
  const handleOptimizeRoute = () => {
    toast.success('Route wird optimiert...', {
      description: 'Stopps werden nach kürzester Strecke sortiert',
    });
    // In real implementation, call routing API
  };

  // Handle start navigation
  const handleStartNavigation = () => {
    const firstCustomerStop = routeStops.find((s) => s.type === 'customer');
    if (firstCustomerStop) {
      toast.success(`Navigation zu ${firstCustomerStop.location?.companyName} wird gestartet...`, {
        description: 'Google Maps wird geöffnet',
        action: {
          label: 'Abbrechen',
          onClick: () => {},
        },
      });
      // In real implementation, open native maps app
    }
  };

  // Handle check-in
  const handleCheckIn = (customer: CustomerLocation) => {
    toast.success(`Check-in bei ${customer.companyName}`, {
      description: 'Besuch wird protokolliert',
      action: {
        label: 'Details',
        onClick: () => toast.info('Aktivitäts-Details öffnen...'),
      },
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="bg-background border-b border-border p-4 space-y-3">
        {/* Search & Filter Row */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Kunde oder Adresse suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          {/* View Toggle */}
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
            className="shrink-0"
          >
            <Map className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="shrink-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Alle Kunden
          </Button>
          <Button
            variant={filter === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('today')}
          >
            Heute geplant
            <Badge className="ml-2 bg-blue-600 text-white">
              {mockCustomers.filter((c) => c.nextAppointment).length}
            </Badge>
          </Button>
          <Button
            variant={filter === 'overdue' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('overdue')}
          >
            Überfällig
            <Badge className="ml-2 bg-red-600 text-white">
              {mockCustomers.filter((c) => c.status === 'overdue').length}
            </Badge>
          </Button>
          <Button
            variant={filter === 'opportunities' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('opportunities')}
          >
            Opportunities
            <Badge className="ml-2 bg-amber-600 text-white">
              {mockCustomers.filter((c) => c.hasOpportunity).length}
            </Badge>
          </Button>
        </div>
      </div>

      {/* Map/List View */}
      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'map' ? (
          // Map View
          <div className="h-full w-full bg-muted/30 relative">
            {/* Mock Map Container */}
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center">
                <Map className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="mb-2">Kartenansicht</p>
                <p className="text-muted-foreground">
                  Interaktive Karte mit {filteredCustomers.length} Kundenmarkierungen
                </p>
              </div>
            </div>

            {/* Current Location Indicator */}
            <div className="absolute top-4 left-4 bg-blue-600 text-white h-4 w-4 rounded-full animate-pulse" />

            {/* Compass */}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 h-10 w-10 p-0 bg-background"
            >
              <Compass className="h-5 w-5" />
            </Button>

            {/* Zoom Controls */}
            <div className="absolute right-4 top-20 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 bg-background"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 bg-background"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
            </div>

            {/* Layers Button */}
            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-24 right-4 h-10 w-10 p-0 bg-background"
              onClick={() => setShowLayers(!showLayers)}
            >
              <Layers className="h-5 w-5" />
            </Button>

            {/* Layers Menu */}
            {showLayers && (
              <Card className="absolute bottom-36 right-4 w-56">
                <CardContent className="p-3 space-y-2">
                  <p className="text-muted-foreground mb-2">Ebenen</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked />
                    <span>Kunden</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked />
                    <span>Standorte</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={showTodayRoute} />
                    <span>Heutige Route</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span>Verkehr</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span>Satellit</span>
                  </label>
                </CardContent>
              </Card>
            )}

            {/* Customer Markers Preview */}
            {filteredCustomers.slice(0, 3).map((customer, index) => (
              <Button
                key={customer.id}
                variant="outline"
                size="sm"
                className={`absolute h-8 w-8 p-0 rounded-full ${getMarkerColor(
                  customer.status
                )}`}
                style={{
                  left: `${30 + index * 15}%`,
                  top: `${40 + index * 10}%`,
                }}
                onClick={() => handleMarkerClick(customer)}
              >
                <Building2 className="h-4 w-4" />
              </Button>
            ))}
          </div>
        ) : (
          // List View
          <div className="h-full overflow-y-auto p-4 space-y-3">
            <p className="text-muted-foreground mb-4">
              {filteredCustomers.length}{' '}
              {filteredCustomers.length === 1 ? 'Kunde' : 'Kunden'} gefunden
            </p>
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} onClick={() => handleMarkerClick(customer)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getMarkerColor(
                        customer.status
                      )}`}
                    >
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="mb-1">{customer.companyName}</p>
                      <p className="text-muted-foreground mb-2">{customer.address}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{customer.distance} km</Badge>
                        {customer.nextAppointment && (
                          <Badge className="bg-blue-100 text-blue-800">
                            {customer.nextAppointment}
                          </Badge>
                        )}
                        {customer.status === 'overdue' && (
                          <Badge className="bg-red-100 text-red-800">Überfällig</Badge>
                        )}
                        {customer.hasOpportunity && (
                          <Badge className="bg-amber-100 text-amber-800">
                            Opportunity
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="bg-background border-t border-border p-4 space-y-3">
        {/* Today's Route Toggle */}
        {todayAppointments.length > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowTodayRoute(!showTodayRoute)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Heutige Route ({todayAppointments.length} Termine)
            {showTodayRoute && <Check className="ml-auto h-4 w-4" />}
          </Button>
        )}

        {/* Route Planning Button */}
        <Button className="w-full" size="lg" onClick={() => setShowRouteSheet(true)}>
          <Route className="mr-2 h-5 w-5" />
          Routenplanung ({routeStops.length - 1} Stopps)
        </Button>
      </div>

      {/* Customer Info Sheet */}
      <CustomerInfoSheet
        customer={selectedCustomer}
        isOpen={showCustomerSheet}
        onClose={() => setShowCustomerSheet(false)}
        onPlanRoute={handlePlanRoute}
      />

      {/* Route Planning Sheet */}
      <RoutePlanningSheet
        stops={routeStops}
        isOpen={showRouteSheet}
        onClose={() => setShowRouteSheet(false)}
        onAddStop={handleAddStop}
        onRemoveStop={handleRemoveStop}
        onOptimizeRoute={handleOptimizeRoute}
        onStartNavigation={handleStartNavigation}
      />
    </div>
  );
}

// Demo Component
export function MapRoutePlannerDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4">Karten & Routenplaner (Mobile)</h2>
          <p className="text-muted-foreground mb-6">
            Mobile PWA-Komponente für GPS-gestützte Routenplanung mit Multi-Stopp-Navigation
            und Kunden-Check-in
          </p>

          <div>
            <h3 className="mb-3">Features:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Vollbild-Kartenansicht (Google Maps/Leaflet Integration)</li>
              <li>• GPS-Tracking mit aktuellem Standort (blauer Punkt)</li>
              <li>• Kundenmarkierungen mit Farbcodierung (Blau/Grün/Rot)</li>
              <li>• Bottom Sheet für Kundeninformationen</li>
              <li>• Multi-Stopp-Routenplanung mit Drag & Drop</li>
              <li>• Routenoptimierung (kürzeste Strecke)</li>
              <li>• Navigation zu Google Maps/Apple Maps</li>
              <li>• Heutige Route mit Terminen</li>
              <li>• Check-in-Feature bei Kundenbesuchen</li>
              <li>• Filter: Alle / Heute / Überfällig / Opportunities</li>
              <li>• Such-Funktion nach Kunde oder Adresse</li>
              <li>• Karten-/Listenansicht Toggle</li>
              <li>• Ebenen-Steuerung (Kunden, Standorte, Route, Verkehr, Satellit)</li>
              <li>• Zoom-Steuerung & Kompass</li>
              <li>• Entfernungsberechnung</li>
              <li>• Route teilen & speichern</li>
              <li>• Offline-Unterstützung Hinweis</li>
            </ul>
          </div>

          <Separator className="my-6" />

          <div className="max-w-sm mx-auto border border-border rounded-lg overflow-hidden">
            <MapRoutePlanner />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
