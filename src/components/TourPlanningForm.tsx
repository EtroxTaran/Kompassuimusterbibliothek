import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import {
  Calendar,
  MapPin,
  Clock,
  User,
  FileText,
  Plus,
  X,
  GripVertical,
  Navigation,
  Route,
  AlertTriangle,
  Car,
  Euro,
  Play,
  Save,
  Search,
  TrendingDown,
} from 'lucide-react';

// Types
export type TourStatus = 'planned' | 'active' | 'completed';

export interface TourStop {
  id: string;
  customerId: string;
  customerName: string;
  address: string;
  city: string;
  zipCode: string;
  plannedArrival: string;
  duration: number; // in minutes
  contactPerson: string;
  notes: string;
  latitude?: number;
  longitude?: number;
  isOverdue?: boolean;
  daysOverdue?: number;
  priority?: 'normal' | 'high' | 'urgent';
}

export interface TourData {
  id: string;
  tourName: string;
  description: string;
  date: string;
  responsibleAdmId: string;
  status: TourStatus;
  stops: TourStop[];
  totalDistance: number; // km
  totalDrivingTime: number; // minutes
  totalVisitTime: number; // minutes
  estimatedCost: number; // EUR
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  contactPerson: string;
  lastVisit?: string;
  daysOverdue?: number;
  visitFrequency?: number; // days
}

// Mock Data
export const mockCustomers: Customer[] = [
  {
    id: 'cust1',
    name: 'Hofladen Müller GmbH',
    address: 'Hauptstraße 15',
    city: 'München',
    zipCode: '80331',
    contactPerson: 'Hans Müller',
    lastVisit: '2025-01-06',
    visitFrequency: 30,
  },
  {
    id: 'cust2',
    name: 'Bio-Markt Schmidt',
    address: 'Dorfstraße 8',
    city: 'Unterföhring',
    zipCode: '85774',
    contactPerson: 'Maria Schmidt',
    lastVisit: '2024-12-22',
    daysOverdue: 45,
    visitFrequency: 30,
  },
  {
    id: 'cust3',
    name: 'Baumarkt Weber',
    address: 'Industriestraße 5',
    city: 'Garching',
    zipCode: '85748',
    contactPerson: 'Klaus Weber',
    lastVisit: '2024-12-08',
    daysOverdue: 15,
    visitFrequency: 45,
  },
  {
    id: 'cust4',
    name: 'Gartencenter Grün',
    address: 'Blumenweg 12',
    city: 'Ismaning',
    zipCode: '85737',
    contactPerson: 'Anna Grün',
    lastVisit: '2025-01-20',
    visitFrequency: 45,
  },
];

// Utility functions
export function calculateDaysOverdue(lastVisit: string, frequency: number): number {
  const lastVisitDate = new Date(lastVisit);
  const today = new Date();
  const daysSince = Math.floor((today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysSince - frequency);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} Min.`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

export function calculateDistance(from: TourStop | null, to: TourStop): number {
  // Mock calculation - in real app, use routing API
  return Math.floor(Math.random() * 20) + 5;
}

export function calculateDrivingTime(distance: number): number {
  // Average speed: 50 km/h in city, 80 km/h highway
  // Simplified: ~2 minutes per km
  return Math.floor(distance * 2);
}

// Status Badge
export function TourStatusBadge({ status }: { status: TourStatus }) {
  const config = {
    planned: { label: 'Geplant', variant: 'secondary' as const },
    active: { label: 'Aktiv', variant: 'default' as const },
    completed: { label: 'Abgeschlossen', variant: 'outline' as const },
  };

  const { label, variant } = config[status];

  return <Badge variant={variant}>{label}</Badge>;
}

// Stop Card Component
export interface StopCardProps {
  stop: TourStop;
  index: number;
  distanceToNext?: number;
  drivingTimeToNext?: number;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function StopCard({
  stop,
  index,
  distanceToNext,
  drivingTimeToNext,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: StopCardProps) {
  const endTime = new Date(`2025-01-01T${stop.plannedArrival}`);
  endTime.setMinutes(endTime.getMinutes() + stop.duration);
  const endTimeStr = endTime.toTimeString().slice(0, 5);

  return (
    <>
      <div className="border rounded-lg p-4 bg-card" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div className="flex flex-col gap-1 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 cursor-move"
              disabled={!canMoveUp}
              onClick={onMoveUp}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs"
                  style={{ fontWeight: 'var(--font-weight-semi-bold)' }}
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <p
                      className="truncate"
                      style={{ fontWeight: 'var(--font-weight-semi-bold)' }}
                    >
                      {stop.customerName}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {stop.address}, {stop.zipCode} {stop.city}
                  </p>
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>
                  {stop.plannedArrival}-{endTimeStr} ({stop.duration} Min.)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{stop.contactPerson}</span>
              </div>
            </div>

            {stop.notes && (
              <div className="flex items-start gap-1.5 text-sm">
                <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">{stop.notes}</p>
              </div>
            )}

            {stop.isOverdue && stop.daysOverdue && (
              <div className="flex items-center gap-1.5 text-sm text-orange-600">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Überfällig: {stop.daysOverdue} Tage</span>
              </div>
            )}
          </div>
        </div>

        {/* Move Buttons (Alternative to drag) */}
        <div className="flex gap-1 mt-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="text-xs"
          >
            ↑ Nach oben
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="text-xs"
          >
            ↓ Nach unten
          </Button>
        </div>
      </div>

      {/* Distance to next stop */}
      {distanceToNext !== undefined && drivingTimeToNext !== undefined && (
        <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <Car className="h-4 w-4" />
          <span>
            {distanceToNext} km, ~{drivingTimeToNext} Min.
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      )}
    </>
  );
}

// Add Stop Modal
export interface AddStopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStop: (stop: TourStop) => void;
  existingStopIds: string[];
}

export function AddStopModal({ open, onOpenChange, onAddStop, existingStopIds }: AddStopModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [plannedArrival, setPlannedArrival] = useState('09:00');
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState('');

  const availableCustomers = mockCustomers.filter(
    (c) => !existingStopIds.includes(c.id)
  );

  const filteredCustomers = searchQuery
    ? availableCustomers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableCustomers;

  // Sort by overdue first
  const suggestedCustomers = [...filteredCustomers].sort((a, b) => {
    const aDays = a.daysOverdue || 0;
    const bDays = b.daysOverdue || 0;
    return bDays - aDays;
  });

  const handleAdd = () => {
    if (!selectedCustomer) {
      toast.error('Bitte Kunde auswählen');
      return;
    }

    const daysOverdue = selectedCustomer.daysOverdue || 0;

    const stop: TourStop = {
      id: `stop-${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      address: selectedCustomer.address,
      city: selectedCustomer.city,
      zipCode: selectedCustomer.zipCode,
      plannedArrival,
      duration,
      contactPerson: selectedCustomer.contactPerson,
      notes,
      isOverdue: daysOverdue > 0,
      daysOverdue,
    };

    onAddStop(stop);
    onOpenChange(false);
    
    // Reset form
    setSelectedCustomer(null);
    setSearchQuery('');
    setNotes('');
    setPlannedArrival('09:00');
    setDuration(45);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Stopp hinzufügen</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="customer-search">
              <Search className="inline h-4 w-4 mr-1" />
              Kunde suchen
            </Label>
            <Input
              id="customer-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kundenname oder Ort..."
            />
          </div>

          {/* Suggested Customers */}
          {!selectedCustomer && suggestedCustomers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Vorschläge (basierend auf Besuchsfrequenz):
              </p>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {suggestedCustomers.slice(0, 5).map((customer) => {
                    const isOverdue = (customer.daysOverdue || 0) > 0;
                    const daysUntilDue = customer.lastVisit && customer.visitFrequency
                      ? customer.visitFrequency -
                        Math.floor(
                          (new Date().getTime() - new Date(customer.lastVisit).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : null;

                    return (
                      <button
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                        className="w-full text-left p-3 border rounded-lg hover:bg-muted transition-colors"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <div className="flex items-start gap-2">
                          {isOverdue ? (
                            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                          ) : (
                            <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p
                                className="truncate"
                                style={{ fontWeight: 'var(--font-weight-medium)' }}
                              >
                                {customer.name}
                              </p>
                              {isOverdue && (
                                <Badge variant="destructive" className="text-xs">
                                  Überfällig {customer.daysOverdue} Tage
                                </Badge>
                              )}
                              {!isOverdue && daysUntilDue !== null && daysUntilDue <= 7 && (
                                <Badge variant="outline" className="text-xs">
                                  Fällig in {daysUntilDue} T.
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {customer.address}, {customer.city}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Selected Customer */}
          {selectedCustomer && (
            <div className="p-4 border rounded-lg bg-muted" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                    {selectedCustomer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCustomer.address}, {selectedCustomer.zipCode} {selectedCustomer.city}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCustomer(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="arrival-time">Geplante Ankunft</Label>
                  <Input
                    id="arrival-time"
                    type="time"
                    value={plannedArrival}
                    onChange={(e) => setPlannedArrival(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Besuchsdauer</Label>
                  <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v))}>
                    <SelectTrigger id="duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 Min.</SelectItem>
                      <SelectItem value="30">30 Min.</SelectItem>
                      <SelectItem value="45">45 Min.</SelectItem>
                      <SelectItem value="60">60 Min.</SelectItem>
                      <SelectItem value="90">90 Min.</SelectItem>
                      <SelectItem value="120">120 Min.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="stop-notes">Notizen/Besuchsziel</Label>
                <Textarea
                  id="stop-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="z.B. Neue Produktlinie besprechen"
                  className="resize-none h-20"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {notes.length} / 200
                </p>
              </div>
            </div>
          )}

          {filteredCustomers.length === 0 && searchQuery && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Kunde nicht gefunden</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleAdd} disabled={!selectedCustomer}>
            Stopp hinzufügen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Route Summary Card
export interface RouteSummaryProps {
  totalDistance: number;
  totalDrivingTime: number;
  totalVisitTime: number;
  estimatedCost: number;
}

export function RouteSummary({
  totalDistance,
  totalDrivingTime,
  totalVisitTime,
  estimatedCost,
}: RouteSummaryProps) {
  const totalDuration = totalDrivingTime + totalVisitTime;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
          Routenübersicht
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Preview Placeholder */}
        <div
          className="w-full h-64 rounded-lg border flex items-center justify-center bg-muted"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="text-center">
            <Navigation className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Kartenvorschau mit nummerierten Stoppmarkierungen
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-3">
          <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Zusammenfassung:
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Gesamtstrecke:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {totalDistance} km
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Fahrzeit:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {formatDuration(totalDrivingTime)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Besuchszeit:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {formatDuration(totalVisitTime)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Gesamtdauer:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {formatDuration(totalDuration)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <span className="text-muted-foreground">Geschätzte Kosten:</span>
              <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                €{estimatedCost.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            (€0,50/km + Spesen)
          </p>
        </div>

        {totalDuration > 600 && (
          <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
            <div className="text-sm text-orange-800">
              <p style={{ fontWeight: 'var(--font-weight-medium)' }}>
                Tour über 10 Stunden
              </p>
              <p className="text-xs mt-1">
                Bitte Pausenzeiten berücksichtigen
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main Tour Planning Form
export interface TourPlanningFormProps {
  initialData?: Partial<TourData>;
  onSave: (data: Partial<TourData>) => void;
}

export function TourPlanningForm({ initialData, onSave }: TourPlanningFormProps) {
  const [tourName, setTourName] = useState(initialData?.tourName || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [responsibleAdmId, setResponsibleAdmId] = useState(
    initialData?.responsibleAdmId || 'adm1'
  );
  const [status, setStatus] = useState<TourStatus>(initialData?.status || 'planned');
  const [stops, setStops] = useState<TourStop[]>(initialData?.stops || []);
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [optimizationSavings, setOptimizationSavings] = useState<{
    distance: number;
    time: number;
  } | null>(null);

  // Calculate totals
  const totalVisitTime = stops.reduce((sum, stop) => sum + stop.duration, 0);
  const totalDistance = stops.reduce((sum, stop, index) => {
    if (index === stops.length - 1) return sum;
    return sum + calculateDistance(stop, stops[index + 1]);
  }, 0);
  const totalDrivingTime = stops.reduce((sum, stop, index) => {
    if (index === stops.length - 1) return sum;
    const distance = calculateDistance(stop, stops[index + 1]);
    return sum + calculateDrivingTime(distance);
  }, 0);
  const estimatedCost = totalDistance * 0.5 + (totalDrivingTime + totalVisitTime > 240 ? 25 : 0);

  const handleAddStop = (stop: TourStop) => {
    setStops((prev) => [...prev, stop]);
    toast.success(`${stop.customerName} zur Tour hinzugefügt`);
  };

  const handleDeleteStop = (id: string) => {
    const stop = stops.find((s) => s.id === id);
    setStops((prev) => prev.filter((s) => s.id !== id));
    toast.success(`${stop?.customerName} entfernt`);
  };

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= stops.length) return;

    const newStops = [...stops];
    [newStops[index], newStops[newIndex]] = [newStops[newIndex], newStops[index]];
    setStops(newStops);
  };

  const handleOptimizeRoute = () => {
    // Mock optimization - in real app, use optimization algorithm
    const beforeDistance = totalDistance;
    const beforeTime = totalDrivingTime;

    // Simulate optimization by randomly reordering
    const optimized = [...stops].sort(() => Math.random() - 0.5);
    setStops(optimized);

    // Calculate savings (mock)
    const savedDistance = Math.floor(beforeDistance * 0.15);
    const savedTime = Math.floor(beforeTime * 0.15);

    setOptimizationSavings({ distance: savedDistance, time: savedTime });
    toast.success(`Route optimiert! Sie sparen ${savedDistance} km und ${savedTime} Minuten`);

    // Clear after 5 seconds
    setTimeout(() => setOptimizationSavings(null), 5000);
  };

  const handleSave = () => {
    if (!tourName) {
      toast.error('Tourname ist erforderlich');
      return;
    }

    if (stops.length === 0) {
      toast.error('Tour kann nicht leer sein');
      return;
    }

    if (stops.length > 12) {
      toast.error('Maximal 12 Stopps pro Tag erlaubt');
      return;
    }

    const tourData: Partial<TourData> = {
      tourName,
      description,
      date,
      responsibleAdmId,
      status,
      stops,
      totalDistance,
      totalDrivingTime,
      totalVisitTime,
      estimatedCost,
    };

    onSave(tourData);
  };

  const handleStartTour = () => {
    if (status !== 'planned') return;
    setStatus('active');
    toast.success('Tour gestartet! Viel Erfolg!', {
      description: 'Wechseln Sie zur mobilen Ansicht für GPS-Navigation',
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const months = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    return `${days[d.getDay()]}., ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2>Tourenplanung</h2>
          <TourStatusBadge status={status} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleOptimizeRoute} disabled={stops.length < 2}>
            <Route className="h-4 w-4 mr-2" />
            Route optimieren
          </Button>
          <Button onClick={handleSave} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
          <Button onClick={handleStartTour} disabled={status !== 'planned' || stops.length === 0}>
            <Play className="h-4 w-4 mr-2" />
            Tour starten
          </Button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-card" style={{ borderColor: 'var(--border)' }}>
        <Calendar className="h-5 w-5 text-primary" />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 border-0 p-0 h-auto focus-visible:ring-0"
        />
        <span className="text-sm text-muted-foreground">{formatDate(date)}</span>
      </div>

      {/* Optimization Savings Banner */}
      {optimizationSavings && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <TrendingDown className="h-5 w-5 text-green-600 shrink-0" />
          <div className="flex-1">
            <p style={{ fontWeight: 'var(--font-weight-semi-bold)' }} className="text-green-800">
              Route optimiert!
            </p>
            <p className="text-sm text-green-700">
              Sie sparen {optimizationSavings.distance} km und{' '}
              {formatDuration(optimizationSavings.time)}
            </p>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Tour Info & Stops */}
        <div className="space-y-6">
          {/* Tour Information */}
          <Card>
            <CardHeader>
              <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Allgemeine Informationen
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tour-name">
                  Tourname <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tour-name"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  placeholder="z.B. München Nord - Hofläden"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Monatliche Besuchsrunde bei Hofläden..."
                  className="resize-none h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsible-adm">Verantwortlicher ADM</Label>
                <Select value={responsibleAdmId} onValueChange={setResponsibleAdmId}>
                  <SelectTrigger id="responsible-adm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adm1">
                      <User className="inline h-4 w-4 mr-2" />
                      Michael Schmidt
                    </SelectItem>
                    <SelectItem value="adm2">
                      <User className="inline h-4 w-4 mr-2" />
                      Anna Müller
                    </SelectItem>
                    <SelectItem value="adm3">
                      <User className="inline h-4 w-4 mr-2" />
                      Thomas Weber
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stops */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Stopps ({stops.length})
                </h3>
                <Button onClick={() => setShowAddStopModal(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Stopp
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {stops.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Noch keine Stopps hinzugefügt</p>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddStopModal(true)}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ersten Stopp hinzufügen
                  </Button>
                </div>
              ) : (
                <div className="space-y-0">
                  {stops.map((stop, index) => (
                    <StopCard
                      key={stop.id}
                      stop={stop}
                      index={index}
                      distanceToNext={
                        index < stops.length - 1
                          ? calculateDistance(stop, stops[index + 1])
                          : undefined
                      }
                      drivingTimeToNext={
                        index < stops.length - 1
                          ? calculateDrivingTime(calculateDistance(stop, stops[index + 1]))
                          : undefined
                      }
                      onDelete={() => handleDeleteStop(stop.id)}
                      onMoveUp={() => handleMoveStop(index, 'up')}
                      onMoveDown={() => handleMoveStop(index, 'down')}
                      canMoveUp={index > 0}
                      canMoveDown={index < stops.length - 1}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Route Summary */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <RouteSummary
            totalDistance={totalDistance}
            totalDrivingTime={totalDrivingTime}
            totalVisitTime={totalVisitTime}
            estimatedCost={estimatedCost}
          />
        </div>
      </div>

      {/* Add Stop Modal */}
      <AddStopModal
        open={showAddStopModal}
        onOpenChange={setShowAddStopModal}
        onAddStop={handleAddStop}
        existingStopIds={stops.map((s) => s.customerId)}
      />
    </div>
  );
}

// Demo Component
export function TourPlanningFormDemo() {
  const handleSave = (data: Partial<TourData>) => {
    toast.success('Tour gespeichert!', {
      description: `${data.tourName} - ${data.stops?.length} Stopps`,
    });
    console.log('Tour data:', data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Tourenplanung</h2>
        <p className="text-sm text-muted-foreground">
          Umfassendes Tourenplanungsformular für Außendienstmitarbeiter zur Planung effizienter
          Kundenbesuchsrouten mit Routenoptimierung, Zeitberechnung und Kostenschätzung
        </p>
      </div>

      {/* Main Form */}
      <TourPlanningForm onSave={handleSave} />

      {/* Features */}
      <Card>
        <CardHeader>
          <h3>Features & Funktionen</h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Multi-Stopp-Management:</strong> Unbegrenzte Stopps mit Drag-and-Drop-Neuanordnung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Intelligente Kundensuche:</strong> Vorschläge basierend auf überfälligen Besuchen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Routenoptimierung:</strong> Automatische Optimierung zur Minimierung von Distanz und Zeit
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Echtzeit-Berechnungen:</strong> Gesamtstrecke, Fahrzeit, Besuchszeit, Kosten
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Überfällige Warnungen:</strong> Visuelle Indikatoren für überfällige Kundenbesuche
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Flexible Zeitplanung:</strong> Ankunftszeit und Besuchsdauer pro Stopp
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Besuchsnotizen:</strong> Zielsetzung und Notizen für jeden Stopp
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Status-Tracking:</strong> Geplant → Aktiv → Abgeschlossen
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Rules */}
      <Card className="bg-muted">
        <CardHeader>
          <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Validierungsregeln & Limits
          </h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Tourname ist erforderlich</p>
          <p>• Mindestens 1 Stopp erforderlich</p>
          <p>• Maximum 12 Stopps pro Tag (konfigurierbar)</p>
          <p>• Warnung bei Gesamtdauer über 10 Stunden</p>
          <p>• Alert für überfällige Kundenbesuche</p>
          <p>• Kostenschätzung: €0,50/km + €25 Tagespauschale (bei &gt;4h)</p>
          <p>• Automatische Hotel-Vorschläge bei Tourenende &gt;200km vom Start</p>
        </CardContent>
      </Card>
    </div>
  );
}