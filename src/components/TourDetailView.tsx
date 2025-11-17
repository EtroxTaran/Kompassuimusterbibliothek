import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Navigation,
  Clock,
  Camera,
  Image as ImageIcon,
  Check,
  X,
  Pause,
  Play,
  SkipForward,
  Plus,
  MessageSquare,
  AlertTriangle,
  Route,
  MoreVertical,
  CheckCircle,
  Calendar,
  TrendingUp,
  FileText,
  DollarSign,
} from 'lucide-react';

// Types
export type TourStatus = 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';
export type StopStatus = 'pending' | 'en_route' | 'arrived' | 'checked_in' | 'completed' | 'skipped';
export type UserRole = 'ADM' | 'INNEN' | 'GF';

export interface TourStop {
  id: string;
  sequence: number;
  customerId: string;
  customerName: string;
  address: string;
  city: string;
  contactPerson?: string;
  contactPhone?: string;
  plannedArrival: string;
  plannedDeparture: string;
  plannedDuration: number;
  actualArrival?: string;
  actualDeparture?: string;
  status: StopStatus;
  notes?: string;
  lastVisitNotes?: string;
  lastVisitDays?: number;
  checkInLocation?: { lat: number; lng: number };
  photos?: string[];
  distance?: number;
  estimatedDuration?: number;
}

export interface TourDetail {
  id: string;
  name: string;
  date: string;
  status: TourStatus;
  assignedTo: string;
  plannedStops: number;
  completedStops: number;
  plannedDistance: number;
  actualDistance: number;
  plannedDuration: string;
  actualDuration?: string;
  stops: TourStop[];
  startTime?: string;
  endTime?: string;
}

// Mock Data
export const mockTour: TourDetail = {
  id: 'tour1',
  name: 'München Nord Tour',
  date: '06.02.2025',
  status: 'active',
  assignedTo: 'Thomas Fischer',
  plannedStops: 4,
  completedStops: 2,
  plannedDistance: 67,
  actualDistance: 31,
  plannedDuration: '5h 15min',
  actualDuration: '2h 15min',
  startTime: '08:00',
  stops: [
    {
      id: 'stop1',
      sequence: 1,
      customerId: 'cust1',
      customerName: 'REWE München Ost',
      address: 'Hauptstraße 12',
      city: '80331 München',
      contactPerson: 'Hans Weber',
      contactPhone: '+49 89 1111111',
      plannedArrival: '08:15',
      plannedDeparture: '09:00',
      plannedDuration: 45,
      actualArrival: '08:18',
      actualDeparture: '09:05',
      status: 'completed',
      notes: 'Neues Angebot für Kühlregale besprochen. Folgt nächste Woche.',
      photos: ['photo1.jpg'],
    },
    {
      id: 'stop2',
      sequence: 2,
      customerId: 'cust2',
      customerName: 'Bio-Markt Schmidt',
      address: 'Dorfstraße 8',
      city: '85774 Unterföhring',
      contactPerson: 'Maria Schmidt',
      contactPhone: '+49 89 12345678',
      plannedArrival: '10:15',
      plannedDeparture: '11:00',
      plannedDuration: 45,
      actualArrival: '10:22',
      status: 'arrived',
      lastVisitNotes: 'Interesse an Bio-Fleisch Sortiment. Proben mitgebracht.',
      lastVisitDays: 45,
    },
    {
      id: 'stop3',
      sequence: 3,
      customerId: 'cust3',
      customerName: 'Gartencenter Grün',
      address: 'Gartenweg 5',
      city: '85716 Unterschleißheim',
      contactPerson: 'Peter Grün',
      contactPhone: '+49 89 9876543',
      plannedArrival: '11:45',
      plannedDeparture: '12:30',
      plannedDuration: 45,
      status: 'pending',
      distance: 12,
      estimatedDuration: 18,
    },
    {
      id: 'stop4',
      sequence: 4,
      customerId: 'cust4',
      customerName: 'EDEKA Garching',
      address: 'Münchner Straße 88',
      city: '85748 Garching',
      contactPerson: 'Anna Bauer',
      contactPhone: '+49 89 5555555',
      plannedArrival: '13:15',
      plannedDeparture: '14:00',
      plannedDuration: 45,
      status: 'pending',
      distance: 8,
      estimatedDuration: 12,
    },
  ],
};

// Helper Functions
export function getStopStatusBadge(status: StopStatus) {
  const badges: Record<StopStatus, { label: string; variant: string; icon: any }> = {
    pending: { label: 'Ausstehend', variant: 'bg-gray-100 text-gray-800', icon: Clock },
    en_route: { label: 'Unterwegs', variant: 'bg-blue-100 text-blue-800', icon: Navigation },
    arrived: { label: 'Angekommen', variant: 'bg-amber-100 text-amber-800', icon: MapPin },
    checked_in: { label: 'Eingecheckt', variant: 'bg-green-100 text-green-800', icon: CheckCircle },
    completed: { label: 'Abgeschlossen', variant: 'bg-green-100 text-green-800', icon: Check },
    skipped: { label: 'Übersprungen', variant: 'bg-gray-100 text-gray-800', icon: SkipForward },
  };
  return badges[status];
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins} Min`;
}

// Map Placeholder Component
export function MapPlaceholder({ stops, currentStop }: { stops: TourStop[]; currentStop?: TourStop }) {
  return (
    <div className="relative h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="absolute inset-0 p-4">
        <div className="text-center text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-2 text-blue-600" />
          <p className="text-sm">GPS Kartenansicht</p>
          <p className="text-xs mt-2">
            {currentStop
              ? `Aktueller Standort: ${currentStop.customerName}`
              : 'Tour wird geladen...'}
          </p>
        </div>
        
        {/* Simulated markers */}
        <div className="absolute top-20 left-20 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse" />
          <span className="text-xs bg-white px-2 py-1 rounded shadow">Ihr Standort</span>
        </div>
        
        {stops.map((stop, index) => (
          <div
            key={stop.id}
            className="absolute"
            style={{
              top: `${30 + index * 15}%`,
              left: `${40 + index * 10}%`,
            }}
          >
            <div className="flex items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                  stop.status === 'completed'
                    ? 'bg-green-600'
                    : stop.status === 'arrived'
                    ? 'bg-amber-600'
                    : 'bg-blue-600'
                }`}
              >
                {stop.sequence}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow text-xs">
        Maßstab: 1:25000
      </div>
    </div>
  );
}

// Check-In Dialog Component
export interface CheckInDialogProps {
  stop: TourStop | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckIn: (data: any) => void;
}

export function CheckInDialog({ stop, open, onOpenChange, onCheckIn }: CheckInDialogProps) {
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [otherContact, setOtherContact] = useState('');
  const [notes, setNotes] = useState('');

  const handleCheckIn = () => {
    onCheckIn({
      stopId: stop?.id,
      contact: selectedContact === 'other' ? otherContact : selectedContact,
      notes,
      timestamp: new Date().toISOString(),
    });
    setNotes('');
    setSelectedContact('');
    setOtherContact('');
    onOpenChange(false);
  };

  if (!stop) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Check-In: {stop.customerName}</DialogTitle>
          <DialogDescription>Bestätigen Sie Ihren Besuch vor Ort</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* GPS Confirmation */}
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                Standort bestätigt ✓
              </p>
              <p className="text-xs text-muted-foreground">10m Entfernung zum Ziel</p>
            </div>
          </div>

          {/* Contact Person */}
          <div className="space-y-2">
            <Label>Ansprechpartner getroffen?</Label>
            <div className="space-y-2">
              {stop.contactPerson && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`contact-${stop.contactPerson}`}
                    checked={selectedContact === stop.contactPerson}
                    onCheckedChange={(checked) =>
                      setSelectedContact(checked ? stop.contactPerson! : '')
                    }
                  />
                  <Label htmlFor={`contact-${stop.contactPerson}`} className="cursor-pointer">
                    {stop.contactPerson}
                  </Label>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contact-other"
                  checked={selectedContact === 'other'}
                  onCheckedChange={(checked) => setSelectedContact(checked ? 'other' : '')}
                />
                <Label htmlFor="contact-other" className="cursor-pointer flex items-center gap-2">
                  Andere:
                  {selectedContact === 'other' && (
                    <input
                      type="text"
                      value={otherContact}
                      onChange={(e) => setOtherContact(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Name eingeben"
                    />
                  )}
                </Label>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Kurze Notiz zum Besuch:</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm min-h-[80px]"
              placeholder="Was wurde besprochen? Nächste Schritte?"
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>📷 Foto hinzufügen (optional)</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Kamera öffnen
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <ImageIcon className="h-4 w-4 mr-2" />
                Aus Galerie
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleCheckIn} disabled={!notes.trim()}>
            Check-In bestätigen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Tour Summary Dialog
export interface TourSummaryDialogProps {
  tour: TourDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TourSummaryDialog({ tour, open, onOpenChange }: TourSummaryDialogProps) {
  const completedStops = tour.stops.filter((s) => s.status === 'completed').length;
  const totalPhotos = tour.stops.reduce((sum, s) => sum + (s.photos?.length || 0), 0);
  const totalNotes = tour.stops.filter((s) => s.notes).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Tour abgeschlossen!
          </DialogTitle>
          <DialogDescription>
            {tour.name} - {tour.date}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="space-y-2">
            <h4 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Zusammenfassung:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>
                  {completedStops} von {tour.plannedStops} Stopps besucht
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gefahren:</span>
                <span>
                  {tour.actualDistance} km (geplant: {tour.plannedDistance} km)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dauer:</span>
                <span>
                  {tour.actualDuration} (geplant: {tour.plannedDuration})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kosten:</span>
                <span>€45,80</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Deviations */}
          <div className="space-y-2">
            <h4 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Abweichungen:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span>+5 km Umweg (Baustelle)</span>
              </div>
              <div className="flex items-center gap-2 text-amber-600">
                <Clock className="h-4 w-4" />
                <span>+17 min Verspätung</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activities */}
          <div className="space-y-2">
            <h4 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Erfasste Aktivitäten:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                  {completedStops}
                </p>
                <p className="text-xs text-muted-foreground">Check-ins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                  {totalPhotos}
                </p>
                <p className="text-xs text-muted-foreground">Fotos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                  {totalNotes}
                </p>
                <p className="text-xs text-muted-foreground">Notizen</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Zur Übersicht
          </Button>
          <Button className="w-full sm:w-auto">
            <DollarSign className="h-4 w-4 mr-2" />
            Ausgaben erfassen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Tour Detail View
export interface TourDetailViewProps {
  tourId?: string;
  userRole?: UserRole;
}

export function TourDetailView({ tourId = 'tour1', userRole = 'ADM' }: TourDetailViewProps) {
  const [tour, setTour] = useState(mockTour);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedStop, setSelectedStop] = useState<TourStop | null>(null);

  const currentStop = tour.stops.find((s) => s.status === 'arrived') || tour.stops.find((s) => s.status === 'pending');
  const currentStopIndex = currentStop ? tour.stops.findIndex((s) => s.id === currentStop.id) : -1;
  const nextStop = currentStopIndex >= 0 ? tour.stops[currentStopIndex + 1] : null;
  const progressPercentage = (tour.completedStops / tour.plannedStops) * 100;

  const canExecute = userRole === 'ADM';

  const handleCheckIn = (data: any) => {
    if (!currentStop) return;

    setTour({
      ...tour,
      completedStops: tour.completedStops + 1,
      stops: tour.stops.map((s) =>
        s.id === currentStop.id
          ? {
              ...s,
              status: 'completed',
              actualDeparture: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
              notes: data.notes,
            }
          : s
      ),
    });

    toast.success(`Check-In erfolgreich: ${currentStop.customerName}`);
  };

  const handlePauseTour = () => {
    setTour({ ...tour, status: 'paused' });
    toast.info('Tour pausiert');
  };

  const handleResumeTour = () => {
    setTour({ ...tour, status: 'active' });
    toast.success('Tour fortgesetzt');
  };

  const handleCompleteTour = () => {
    setTour({ ...tour, status: 'completed', endTime: new Date().toLocaleTimeString('de-DE') });
    setShowSummary(true);
  };

  const handleSkipStop = () => {
    if (!currentStop) return;

    setTour({
      ...tour,
      stops: tour.stops.map((s) => (s.id === currentStop.id ? { ...s, status: 'skipped' } : s)),
    });

    toast.info(`Stopp übersprungen: ${currentStop.customerName}`);
  };

  const handleAddUnplannedStop = () => {
    toast.info('Ungeplanten Stopp hinzufügen');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header Bar */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-lg" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                {tour.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {tour.completedStops} von {tour.plannedStops} Stopps • {tour.actualDistance}km gefahren •{' '}
                {tour.actualDuration} vergangen
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canExecute && tour.status === 'active' && (
              <>
                <Button variant="outline" size="sm" onClick={handlePauseTour}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button variant="outline" size="sm">
                  <Route className="h-4 w-4 mr-2" />
                  Route
                </Button>
                <Button variant="outline" size="sm" onClick={handleCompleteTour}>
                  Beenden
                </Button>
              </>
            )}
            {canExecute && tour.status === 'paused' && (
              <Button variant="outline" size="sm" onClick={handleResumeTour}>
                <Play className="h-4 w-4 mr-2" />
                Fortsetzen
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            Tour-Fortschritt: {progressPercentage.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Split View: Map + Details */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Map View */}
        <div className="w-full lg:w-1/2 p-4 h-[40vh] lg:h-auto">
          <MapPlaceholder stops={tour.stops} currentStop={currentStop} />
        </div>

        {/* Stop Details */}
        <div className="w-full lg:w-1/2 p-4 overflow-y-auto space-y-4">
          {currentStop && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    Aktueller Stopp ({currentStop.sequence}/{tour.plannedStops})
                  </CardTitle>
                  <Badge className={getStopStatusBadge(currentStop.status).variant}>
                    {getStopStatusBadge(currentStop.status).label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h3 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                      {currentStop.customerName}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentStop.address}, {currentStop.city}
                  </p>
                </div>

                <Separator />

                {/* Timing */}
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Geplant:</span>
                    <span>
                      {currentStop.plannedArrival} - {currentStop.plannedDeparture} (
                      {formatDuration(currentStop.plannedDuration)})
                    </span>
                  </div>
                  {currentStop.actualArrival && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>Ankunft:</span>
                      <div className="flex items-center gap-1">
                        <span>{currentStop.actualArrival}</span>
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Contact */}
                {currentStop.contactPerson && (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Kontakt:</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{currentStop.contactPerson}</span>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`tel:${currentStop.contactPhone}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            Anrufen
                          </a>
                        </Button>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Last Visit Notes */}
                {currentStop.lastVisitNotes && (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Letzter Besuch: vor {currentStop.lastVisitDays} Tagen
                      </p>
                      <p className="text-sm bg-muted p-3 rounded-lg">{currentStop.lastVisitNotes}</p>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Check-In Button */}
                {canExecute && currentStop.status === 'arrived' && (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      setSelectedStop(currentStop);
                      setShowCheckIn(true);
                    }}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Check-In vor Ort
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Next Stop Card */}
          {nextStop && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Nächster Stopp:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)' }}>{nextStop.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {nextStop.distance}km • ~{nextStop.estimatedDuration} Minuten
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Navigation className="h-4 w-4 mr-2" />
                    Route anzeigen
                  </Button>
                  {canExecute && (
                    <Button variant="outline" size="sm" onClick={handleSkipStop}>
                      <SkipForward className="h-4 w-4 mr-2" />
                      Überspringen
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          {canExecute && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Schnellaktionen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleAddUnplannedStop}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ungeplanten Stopp hinzufügen
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Notiz hinzufügen
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Camera className="h-4 w-4 mr-2" />
                  Foto aufnehmen
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Problem melden
                </Button>
              </CardContent>
            </Card>
          )}

          {/* All Stops List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Alle Stopps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tour.stops.map((stop) => {
                const statusBadge = getStopStatusBadge(stop.status);
                const StatusIcon = statusBadge.icon;
                return (
                  <div
                    key={stop.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                        {stop.sequence}
                      </div>
                      <div>
                        <p className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                          {stop.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">{stop.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{stop.plannedArrival}</span>
                      <Badge className={statusBadge.variant} variant="secondary">
                        <StatusIcon className="h-3 w-3" />
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Check-In Dialog */}
      <CheckInDialog
        stop={selectedStop}
        open={showCheckIn}
        onOpenChange={setShowCheckIn}
        onCheckIn={handleCheckIn}
      />

      {/* Tour Summary Dialog */}
      <TourSummaryDialog tour={tour} open={showSummary} onOpenChange={setShowSummary} />
    </div>
  );
}

// Demo Component
export function TourDetailViewDemo() {
  const [userRole, setUserRole] = useState<UserRole>('ADM');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Tour Detail & Execution View</h2>
        <p className="text-sm text-muted-foreground">
          Echtzeit-Tourverfolgung mit GPS-Check-In, Stoppverwaltung und Besuchsdokumentation
        </p>
      </div>

      {/* Role Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Demo-Einstellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="role">Benutzerrolle:</Label>
            <select
              id="role"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="border rounded px-3 py-2"
            >
              <option value="ADM">ADM (Außendienst - kann ausführen)</option>
              <option value="INNEN">INNEN (kann überwachen)</option>
              <option value="GF">GF (Geschäftsführung - kann überwachen)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Main Tour View */}
      <div className="border rounded-lg overflow-hidden" style={{ height: '800px' }}>
        <TourDetailView userRole={userRole} />
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Funktionen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Split-View Layout:</strong> GPS-Kartenansicht (links) + Stopp-Details (rechts)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Echtzeit-Fortschritt:</strong> Progress Bar mit Prozentanzeige, Distanz, Dauer
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Check-In Dialog:</strong> GPS-Bestätigung, Kontaktauswahl, Notizen, Fotos
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>6 Stopp-Status:</strong> Ausstehend, Unterwegs, Angekommen, Eingecheckt, Abgeschlossen, Übersprungen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Schnellaktionen:</strong> Ungeplanten Stopp hinzufügen, Notiz, Foto, Problem melden
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Nächster Stopp:</strong> Vorschau mit Entfernung, Fahrtzeit, Navigation
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Tour-Zusammenfassung:</strong> Statistiken, Abweichungen, erfasste Aktivitäten
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Pausieren/Fortsetzen:</strong> Tour-Steuerung mit Status-Management
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Rollenbasierte Aktionen:</strong> ADM kann ausführen, INNEN/GF können überwachen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Letzte Besuchsnotizen:</strong> Zeigt Notizen vom vorherigen Besuch an
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
          <p>• Tour: München Nord Tour (06.02.2025)</p>
          <p>• Status: Aktiv (2 von 4 Stopps abgeschlossen)</p>
          <p>• Distanz: 31km gefahren (geplant: 67km)</p>
          <p>• Dauer: 2h 15min vergangen (geplant: 5h 15min)</p>
          <p>• Aktueller Stopp: Bio-Markt Schmidt (Angekommen 10:22)</p>
          <p>• Nächster Stopp: Gartencenter Grün (12km, ~18 Min)</p>
          <p>• 4 Stopps: REWE München Ost (✓), Bio-Markt Schmidt (📍), Gartencenter Grün, EDEKA Garching</p>
        </CardContent>
      </Card>

      {/* GPS Features Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm">GPS & Location Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• <strong>Auto Check-In:</strong> Innerhalb 50m Radius des Stopps</p>
          <p>• <strong>Breadcrumb Trail:</strong> Aufzeichnung der tatsächlich gefahrenen Route</p>
          <p>• <strong>Geschwindigkeitserkennung:</strong> Unterscheidung zwischen Fahren und Stopp</p>
          <p>• <strong>Offline-Karten:</strong> Download der Tourregion vor Start</p>
          <p>• <strong>Batterieoptimierung:</strong> Reduzierte GPS-Frequenz beim Stillstand</p>
        </CardContent>
      </Card>
    </div>
  );
}
