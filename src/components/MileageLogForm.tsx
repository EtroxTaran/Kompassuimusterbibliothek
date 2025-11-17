import { useState, useEffect, useRef } from 'react';
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
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import {
  Navigation,
  Play,
  Pause,
  Square,
  Clock,
  MapPin,
  ArrowRight,
  Save,
  X,
  Search,
  Calendar,
  Building,
  Home,
  Store,
  Construction,
  Plus,
  Gauge,
} from 'lucide-react';

// Types
export type TrackingState = 'idle' | 'active' | 'paused' | 'stopped';
export type TripType = 'business' | 'private';
export type TripPurpose =
  | 'customer-visit'
  | 'project-site'
  | 'trade-fair'
  | 'training'
  | 'authority'
  | 'other';

export interface Location {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  isFavorite?: boolean;
}

export interface MileageTrip {
  id: string;
  date: string;
  startLocation: Location;
  endLocation: Location;
  startTime: string;
  endTime: string;
  startOdometer?: number;
  endOdometer?: number;
  distance: number; // in km
  purpose: TripPurpose;
  tripType: TripType;
  tourId?: string;
  customerId?: string;
  customerName?: string;
  note?: string;
  isGPSTracked: boolean;
  averageSpeed?: number;
}

// Purpose Categories
export const tripPurposes = [
  { id: 'customer-visit' as TripPurpose, label: 'Kundenbesuch' },
  { id: 'project-site' as TripPurpose, label: 'Projektbesichtigung' },
  { id: 'trade-fair' as TripPurpose, label: 'Messe/Event' },
  { id: 'training' as TripPurpose, label: 'Schulung' },
  { id: 'authority' as TripPurpose, label: 'Behördengang' },
  { id: 'other' as TripPurpose, label: 'Sonstiges' },
];

// Location Favorites
export const locationFavorites: Location[] = [
  {
    id: 'office',
    name: 'Büro (Firmensitz)',
    address: 'Leopoldstr. 15, München',
    isFavorite: true,
  },
  {
    id: 'home',
    name: 'Home Office',
    address: 'Musterstraße 42, München',
    isFavorite: true,
  },
  {
    id: 'customer1',
    name: 'Hofladen Müller',
    address: 'Hauptstr. 15, Freising',
    isFavorite: true,
  },
  {
    id: 'project1',
    name: 'Baustelle Projekt X',
    address: 'Industriestr. 8, Dachau',
    isFavorite: true,
  },
];

// Utility Functions
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export function getPurposeLabel(purpose: TripPurpose): string {
  return tripPurposes.find((p) => p.id === purpose)?.label || 'Unbekannt';
}

// GPS Tracking Card (Mobile - Active)
export interface GPSTrackingCardProps {
  distance: number;
  duration: number;
  currentSpeed: number;
  currentLocation: string;
  startLocation: string;
  startTime: string;
  onPause: () => void;
  onStop: () => void;
  isPaused: boolean;
}

export function GPSTrackingCard({
  distance,
  duration,
  currentSpeed,
  currentLocation,
  startLocation,
  startTime,
  onPause,
  onStop,
  isPaused,
}: GPSTrackingCardProps) {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-sm text-muted-foreground mb-4">AKTUELLE FAHRT</h3>

          {/* GPS Status Card */}
          <Card className="border-2" style={{ borderColor: isPaused ? 'rgb(245, 158, 11)' : 'var(--primary)' }}>
            <CardContent className="p-8 space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <Navigation className="h-16 w-16 text-primary" />
                  {!isPaused && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: 'var(--primary)', opacity: 0.4 }}
                    />
                  )}
                </div>
              </div>

              <div>
                <Badge
                  variant={isPaused ? 'secondary' : 'default'}
                  className="px-4 py-1"
                  style={isPaused ? { color: 'rgb(245, 158, 11)', borderColor: 'rgb(245, 158, 11)' } : {}}
                >
                  {isPaused ? 'PAUSIERT' : 'LÄUFT'}
                </Badge>
              </div>

              <div className="space-y-2">
                <div
                  className="text-4xl tabular-nums"
                  style={{ fontWeight: 'var(--font-weight-bold)' }}
                >
                  {distance.toFixed(1)} km
                </div>
                <div className="text-xl text-muted-foreground tabular-nums">
                  {formatDuration(duration)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onPause}
            className="flex-1 h-12"
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Fortfahren
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onStop}
            className="flex-1 h-12"
          >
            <Square className="h-4 w-4 mr-2" />
            Beenden
          </Button>
        </div>

        {/* Route Info */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-block border-t border-b px-4 py-1" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs text-muted-foreground">Route</span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
              <div>
                <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Start: {startLocation}</p>
                <p className="text-xs text-muted-foreground">{startTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Navigation className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <p style={{ fontWeight: 'var(--font-weight-medium)' }}>Aktuell: {currentLocation}</p>
                <p className="text-xs text-muted-foreground">
                  Geschwindigkeit: {currentSpeed} km/h
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Purpose Selection */}
        <div className="space-y-2">
          <div className="text-center">
            <div className="inline-block border-t border-b px-4 py-1" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs text-muted-foreground">Zweck</span>
            </div>
          </div>

          <Select defaultValue="tour1">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tour1">Tour: München Nord</SelectItem>
              <SelectItem value="tour2">Tour: Stuttgart Messe</SelectItem>
              <SelectItem value="customer">Kundenbesuch direkt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// Trip Summary Form (After Stop)
export interface TripSummaryFormProps {
  distance: number;
  duration: number;
  averageSpeed: number;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
  onSave: (data: Partial<MileageTrip>) => void;
  onDiscard: () => void;
}

export function TripSummaryForm({
  distance,
  duration,
  averageSpeed,
  startLocation,
  endLocation,
  startTime,
  endTime,
  onSave,
  onDiscard,
}: TripSummaryFormProps) {
  const [purpose, setPurpose] = useState<TripPurpose>('customer-visit');
  const [tripType, setTripType] = useState<TripType>('business');
  const [customerId, setCustomerId] = useState('');

  const handleSave = () => {
    const data: Partial<MileageTrip> = {
      distance,
      purpose,
      tripType,
      customerId: customerId || undefined,
      isGPSTracked: true,
      averageSpeed,
    };
    onSave(data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-card" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <Button variant="ghost" size="sm" onClick={onDiscard} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
          <h2 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Fahrt abgeschlossen
          </h2>
          <div className="w-8" />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="p-4 space-y-6">
          {/* Map Preview */}
          <div
            className="border rounded-lg overflow-hidden"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="h-48 bg-muted flex items-center justify-center">
              <div className="text-center space-y-2">
                <Navigation className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Routenkarte</p>
                <div className="flex items-center gap-2 justify-center text-xs">
                  <MapPin className="h-3 w-3 text-green-500" />
                  <span className="text-muted-foreground">Start</span>
                  <div className="w-8 border-t border-dashed" style={{ borderColor: 'var(--border)' }} />
                  <MapPin className="h-3 w-3 text-red-500" />
                  <span className="text-muted-foreground">Ende</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
              Zusammenfassung
            </h4>
            <Card>
              <CardContent className="p-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Strecke</p>
                  <p className="text-lg" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                    {distance.toFixed(1)} km
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Dauer</p>
                  <p className="text-lg" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                    {Math.floor(duration / 3600)}:{String(Math.floor((duration % 3600) / 60)).padStart(2, '0')} Std.
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">⌀ Geschw.</p>
                  <p className="text-lg" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                    {averageSpeed} km/h
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Von: {startLocation}</Label>
              <Input type="time" value={startTime} readOnly className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label>Nach: {endLocation}</Label>
              <Input type="time" value={endTime} readOnly className="bg-muted" />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose-summary">
              Zweck der Fahrt <span className="text-destructive">*</span>
            </Label>
            <Select value={purpose} onValueChange={(v: TripPurpose) => setPurpose(v)}>
              <SelectTrigger id="purpose-summary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tripPurposes.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trip Type */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="business-trip"
                checked={tripType === 'business'}
                onCheckedChange={(checked) => setTripType(checked ? 'business' : 'private')}
              />
              <Label htmlFor="business-trip">Geschäftlich</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="private-trip"
                checked={tripType === 'private'}
                onCheckedChange={(checked) => setTripType(checked ? 'private' : 'business')}
              />
              <Label htmlFor="private-trip">Privat</Label>
            </div>
          </div>

          {/* Customer */}
          {tripType === 'business' && (
            <div className="space-y-2">
              <Label htmlFor="customer-summary">Kunde (optional)</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger id="customer-summary">
                  <SelectValue placeholder="Kunde wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer1">Hofladen Müller</SelectItem>
                  <SelectItem value="customer2">Bäckerei Schmidt</SelectItem>
                  <SelectItem value="customer3">Metzgerei Weber</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pb-6">
            <Button variant="outline" onClick={onDiscard} className="flex-1">
              Verwerfen
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Manual Mileage Form (Mobile)
export interface ManualMileageFormProps {
  onSave: (data: Partial<MileageTrip>) => void;
  onCancel: () => void;
}

export function ManualMileageForm({ onSave, onCancel }: ManualMileageFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startLocationId, setStartLocationId] = useState('');
  const [endLocationId, setEndLocationId] = useState('');
  const [distance, setDistance] = useState('');
  const [purpose, setPurpose] = useState<TripPurpose>('customer-visit');
  const [customerId, setCustomerId] = useState('');

  const handleSave = () => {
    const distanceNum = parseFloat(distance);

    if (!startLocationId || !endLocationId) {
      toast.error('Bitte Start und Ziel angeben');
      return;
    }

    if (!distanceNum || distanceNum <= 0) {
      toast.error('Bitte gültige Kilometerzahl eingeben');
      return;
    }

    const startLoc = locationFavorites.find((l) => l.id === startLocationId);
    const endLoc = locationFavorites.find((l) => l.id === endLocationId);

    const data: Partial<MileageTrip> = {
      date,
      startLocation: startLoc!,
      endLocation: endLoc!,
      distance: distanceNum,
      purpose,
      tripType: 'business',
      customerId: customerId || undefined,
      isGPSTracked: false,
    };

    onSave(data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-card" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
          <h2 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Manuelle Fahrt
          </h2>
          <div className="w-8" />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="p-4 space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date-manual">
              Datum <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="date-manual"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Start Location */}
          <div className="space-y-2">
            <Label htmlFor="start-manual">Start</Label>
            <Select value={startLocationId} onValueChange={setStartLocationId}>
              <SelectTrigger id="start-manual">
                <SelectValue placeholder="Ort wählen" />
              </SelectTrigger>
              <SelectContent>
                {locationFavorites.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground text-center">oder</p>
            <Input placeholder="Adresse eingeben..." />
          </div>

          {/* End Location */}
          <div className="space-y-2">
            <Label htmlFor="end-manual">Ziel</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="end-manual"
                placeholder="Kunde suchen..."
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">oder</p>
            <Select value={endLocationId} onValueChange={setEndLocationId}>
              <SelectTrigger>
                <SelectValue placeholder="Ort wählen" />
              </SelectTrigger>
              <SelectContent>
                {locationFavorites.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Distance */}
          <div className="space-y-2">
            <Label htmlFor="distance-manual">
              Kilometer <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="distance-manual"
                type="number"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="0,0"
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                km
              </span>
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose-manual">
              Zweck der Fahrt <span className="text-destructive">*</span>
            </Label>
            <Select value={purpose} onValueChange={(v: TripPurpose) => setPurpose(v)}>
              <SelectTrigger id="purpose-manual">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tripPurposes.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <Label htmlFor="customer-manual">Kunde/Projekt</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger id="customer-manual">
                <SelectValue placeholder="Kunde wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer1">Hofladen Müller</SelectItem>
                <SelectItem value="customer2">Bäckerei Schmidt</SelectItem>
                <SelectItem value="customer3">Metzgerei Weber</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trip Type */}
          <div className="flex items-center space-x-2">
            <Checkbox id="business-manual" defaultChecked />
            <Label htmlFor="business-manual">Geschäftlich</Label>
          </div>

          {/* Submit */}
          <div className="pb-6">
            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Desktop Mileage Form
export interface DesktopMileageFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<MileageTrip>) => void;
}

export function DesktopMileageForm({
  open,
  onOpenChange,
  onSave,
}: DesktopMileageFormProps) {
  const [mode, setMode] = useState<'gps' | 'manual'>('manual');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [driver, setDriver] = useState('driver1');
  const [startLocationId, setStartLocationId] = useState('office');
  const [endLocationId, setEndLocationId] = useState('customer1');
  const [startTime, setStartTime] = useState('08:45');
  const [endTime, setEndTime] = useState('09:57');
  const [startOdometer, setStartOdometer] = useState('15234');
  const [endOdometer, setEndOdometer] = useState('15301');
  const [purpose, setPurpose] = useState<TripPurpose>('customer-visit');
  const [tripType, setTripType] = useState<TripType>('business');
  const [tourId, setTourId] = useState('');
  const [customerId, setCustomerId] = useState('customer1');
  const [note, setNote] = useState('');

  const calculatedDistance =
    parseInt(endOdometer || '0') - parseInt(startOdometer || '0');

  const handleSave = () => {
    if (!startLocationId || !endLocationId) {
      toast.error('Bitte Start und Ziel angeben');
      return;
    }

    if (calculatedDistance <= 0) {
      toast.error('End-Kilometerstand muss größer als Start sein');
      return;
    }

    const startLoc = locationFavorites.find((l) => l.id === startLocationId);
    const endLoc = locationFavorites.find((l) => l.id === endLocationId);

    const data: Partial<MileageTrip> = {
      date,
      startLocation: startLoc!,
      endLocation: endLoc!,
      startTime,
      endTime,
      startOdometer: parseInt(startOdometer),
      endOdometer: parseInt(endOdometer),
      distance: calculatedDistance,
      purpose,
      tripType,
      tourId: tourId || undefined,
      customerId: customerId || undefined,
      note: note || undefined,
      isGPSTracked: mode === 'gps',
    };

    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Neue Fahrt erfassen</DialogTitle>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v: any) => setMode(v)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gps">GPS-Tracking</TabsTrigger>
            <TabsTrigger value="manual">Manuelle Eingabe</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6 mt-6">
            <ScrollArea className="max-h-[calc(90vh-12rem)] pr-4">
              <div className="space-y-6">
                {/* Trip Details */}
                <div className="space-y-4">
                  <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                    Fahrtdetails
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date-desktop">
                        Datum <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="date-desktop"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="driver-desktop">Fahrer</Label>
                      <Select value={driver} onValueChange={setDriver}>
                        <SelectTrigger id="driver-desktop">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="driver1">Michael Schmidt</SelectItem>
                          <SelectItem value="driver2">Anna Müller</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Start */}
                  <div className="border rounded-lg p-4 space-y-3" style={{ borderColor: 'var(--border)' }}>
                    <Label>Start</Label>
                    <Select value={startLocationId} onValueChange={setStartLocationId}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locationFavorites.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name} - {loc.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Abfahrt</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="start-km">KM-Stand</Label>
                        <Input
                          id="start-km"
                          type="number"
                          value={startOdometer}
                          onChange={(e) => setStartOdometer(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* End */}
                  <div className="border rounded-lg p-4 space-y-3" style={{ borderColor: 'var(--border)' }}>
                    <Label>Ziel</Label>
                    <Select value={endLocationId} onValueChange={setEndLocationId}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locationFavorites.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name} - {loc.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="end-time">Ankunft</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-km">KM-Stand</Label>
                        <Input
                          id="end-km"
                          type="number"
                          value={endOdometer}
                          onChange={(e) => setEndOdometer(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calculated Distance */}
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Berechnete Strecke:</span>
                    <span
                      className="text-lg"
                      style={{ fontWeight: 'var(--font-weight-semi-bold)' }}
                    >
                      {calculatedDistance} km
                    </span>
                  </div>
                </div>

                {/* Assignment */}
                <div className="space-y-4">
                  <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                    Zuordnung
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purpose-desktop">
                        Zweck <span className="text-destructive">*</span>
                      </Label>
                      <Select value={purpose} onValueChange={(v: TripPurpose) => setPurpose(v)}>
                        <SelectTrigger id="purpose-desktop">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tripPurposes.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Fahrttyp <span className="text-destructive">*</span>
                      </Label>
                      <RadioGroup value={tripType} onValueChange={(v: TripType) => setTripType(v)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="business" id="business-desktop" />
                          <Label htmlFor="business-desktop">Geschäftlich</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private-desktop" />
                          <Label htmlFor="private-desktop">Privat</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tour-desktop">Tour/Projekt</Label>
                      <Select value={tourId} onValueChange={setTourId}>
                        <SelectTrigger id="tour-desktop">
                          <SelectValue placeholder="Tour wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tour1">München Nord</SelectItem>
                          <SelectItem value="tour2">Stuttgart Messe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customer-desktop">Kunde</Label>
                      <Select value={customerId} onValueChange={setCustomerId}>
                        <SelectTrigger id="customer-desktop">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer1">Hofladen Müller</SelectItem>
                          <SelectItem value="customer2">Bäckerei Schmidt</SelectItem>
                          <SelectItem value="customer3">Metzgerei Weber</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <Label htmlFor="note-desktop">Notiz</Label>
                  <Textarea
                    id="note-desktop"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="z.B. Rückweg über A9 wegen Baustelle"
                    className="resize-none h-20"
                  />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="gps" className="space-y-4 mt-6">
            <div className="text-center py-12">
              <Navigation className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h4 className="mb-2" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                GPS-Tracking
              </h4>
              <p className="text-sm text-muted-foreground">
                GPS-Tracking ist nur in der mobilen App verfügbar
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Location Favorites Component
export function LocationFavoritesCard() {
  const getLocationIcon = (id: string) => {
    switch (id) {
      case 'office':
        return <Building className="h-4 w-4" />;
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'customer1':
        return <Store className="h-4 w-4" />;
      case 'project1':
        return <Construction className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
          Häufige Orte
        </h4>
      </CardHeader>
      <CardContent className="space-y-2">
        {locationFavorites.map((loc) => (
          <button
            key={loc.id}
            className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors text-left"
            style={{ borderColor: 'var(--border)' }}
          >
            {getLocationIcon(loc.id)}
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {loc.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">{loc.address}</p>
            </div>
          </button>
        ))}

        <button
          className="w-full flex items-center justify-center gap-2 p-3 border border-dashed rounded-lg hover:bg-muted transition-colors"
          style={{ borderColor: 'var(--border)' }}
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Neuer Ort speichern</span>
        </button>
      </CardContent>
    </Card>
  );
}

// Demo Component
export function MileageLogFormDemo() {
  const [trackingState, setTrackingState] = useState<TrackingState>('idle');
  const [showSummary, setShowSummary] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showDesktopForm, setShowDesktopForm] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate GPS tracking
  useEffect(() => {
    if (trackingState === 'active' && !isPaused) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
        setDistance((prev) => prev + 0.02); // ~72 km/h average
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [trackingState, isPaused]);

  const handleStartTracking = () => {
    setTrackingState('active');
    setDistance(0);
    setDuration(0);
    setIsPaused(false);
    toast.success('GPS-Tracking gestartet');
  };

  const handlePauseTracking = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Tracking fortgesetzt' : 'Tracking pausiert');
  };

  const handleStopTracking = () => {
    setTrackingState('stopped');
    setShowSummary(true);
  };

  const handleSaveTrip = (data: Partial<MileageTrip>) => {
    toast.success('Fahrt gespeichert', {
      description: `${data.distance?.toFixed(1)} km - ${getPurposeLabel(data.purpose!)}`,
    });
    setShowSummary(false);
    setShowManualForm(false);
    setShowDesktopForm(false);
    setTrackingState('idle');
    setDistance(0);
    setDuration(0);
  };

  const handleDiscardTrip = () => {
    setShowSummary(false);
    setTrackingState('idle');
    setDistance(0);
    setDuration(0);
    toast.info('Fahrt verworfen');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Fahrtenbuch-Formular</h2>
        <p className="text-sm text-muted-foreground">
          Automatische GPS-Tracking mit manuellen Eingabeoptionen für steuerkonformes
          Fahrtenbuch mit Routenvisualisierung und Favoriten-Verwaltung
        </p>
      </div>

      {/* Mode Selector */}
      <Card>
        <CardHeader>
          <h3>Demo-Modus</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleStartTracking}
              disabled={trackingState === 'active'}
            >
              <Navigation className="h-4 w-4 mr-2" />
              GPS-Tracking starten
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowManualForm(true)}
            >
              Manuelle Eingabe (Mobil)
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDesktopForm(true)}
            >
              Desktop-Formular öffnen
            </Button>
          </div>

          {trackingState === 'active' && (
            <div className="p-4 border rounded-lg bg-primary/5" style={{ borderColor: 'var(--primary)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  GPS-Tracking aktiv
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {distance.toFixed(1)} km • {formatDuration(duration)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GPS Tracking View */}
      {trackingState === 'active' && !showSummary && (
        <Card>
          <CardHeader>
            <h3>GPS-Tracking (Mobil)</h3>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto">
              <GPSTrackingCard
                distance={distance}
                duration={duration}
                currentSpeed={82}
                currentLocation="A9 Richtung Nord"
                startLocation="Büro"
                startTime="08:45"
                onPause={handlePauseTracking}
                onStop={handleStopTracking}
                isPaused={isPaused}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trip Summary */}
      {showSummary && (
        <Dialog open={showSummary} onOpenChange={setShowSummary}>
          <DialogContent className="sm:max-w-[375px] h-[90vh] p-0">
            <TripSummaryForm
              distance={distance}
              duration={duration}
              averageSpeed={Math.round((distance / (duration / 3600)) || 0)}
              startLocation="Büro, München"
              endLocation="Hofladen Müller"
              startTime="08:45"
              endTime={formatTime(new Date())}
              onSave={handleSaveTrip}
              onDiscard={handleDiscardTrip}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Manual Form */}
      {showManualForm && (
        <Dialog open={showManualForm} onOpenChange={setShowManualForm}>
          <DialogContent className="sm:max-w-[375px] h-[90vh] p-0">
            <ManualMileageForm
              onSave={handleSaveTrip}
              onCancel={() => setShowManualForm(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Desktop Form */}
      <DesktopMileageForm
        open={showDesktopForm}
        onOpenChange={setShowDesktopForm}
        onSave={handleSaveTrip}
      />

      {/* Location Favorites */}
      <LocationFavoritesCard />

      {/* Purpose Categories */}
      <Card>
        <CardHeader>
          <h3>Zweck-Kategorien</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Vordefinierte Kategorien für Fahrtenzwecke
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tripPurposes.map((purpose) => (
              <div
                key={purpose.id}
                className="flex items-center gap-2 p-3 border rounded-lg"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm">{purpose.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <h3>Features & Funktionen</h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Gauge className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>GPS-Tracking:</strong> Automatische Streckenerkennung mit Pause-Erkennung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Favoriten-Orte:</strong> Schnellauswahl für häufige Ziele
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Kilometerstand:</strong> Start/End-Tracking für Abrechnungsgenauigkeit
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Navigation className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Routenkarte:</strong> Visualisierung der gefahrenen Strecke
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Manuelle Eingabe:</strong> Option für nachträgliche Erfassung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Save className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Geschäftlich/Privat:</strong> Unterscheidung für Steuer
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Rules */}
      <Card className="bg-muted">
        <CardHeader>
          <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Validierungsregeln & Steuer-Compliance
          </h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Start- und Ziel-Ort sind Pflichtfelder</p>
          <p>• Distanz muss {'>'} 0 km sein</p>
          <p>• Geschäftsfahrten erfordern Zweckangabe</p>
          <p>• End-Kilometerstand muss größer als Start sein</p>
          <p>• Keine zukünftigen Daten erlaubt</p>
          <p>• Automatische Auto-Pause nach 5 Min. Stillstand</p>
          <p>• Export-Formate: DATEV, Excel, PDF</p>
          <p>• Audit-Trail: Keine nachträgliche Bearbeitung</p>
        </CardContent>
      </Card>
    </div>
  );
}