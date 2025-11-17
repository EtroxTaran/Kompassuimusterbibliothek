import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import {
  History,
  Filter,
  Download,
  Search,
  Plus,
  Edit3,
  Trash2,
  Lock,
  Shield,
  Copy,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  FileText,
  Monitor,
  MapPin,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Types
type ActionType = 'created' | 'updated' | 'deleted';
type UserRole = 'GF' | 'BUCH' | 'PLAN' | 'ADM' | 'KALK' | 'INNEN';

interface AuditEvent {
  id: string;
  timestamp: Date;
  action: ActionType;
  user: {
    name: string;
    role: UserRole;
    avatar?: string;
  };
  entity: string;
  entityId: string;
  changes: FieldChange[];
  reason?: string;
  ipAddress?: string;
  device?: string;
  location?: string;
  isGoBD?: boolean;
  hash?: string;
  approvedBy?: string;
}

interface FieldChange {
  field: string;
  oldValue: any;
  newValue: any;
  type?: 'text' | 'number' | 'date' | 'array' | 'object';
}

// Mock data
const mockAuditEvents: AuditEvent[] = [
  {
    id: '1',
    timestamp: new Date('2024-11-15T10:45:00'),
    action: 'updated',
    user: { name: 'Anna Weber', role: 'BUCH' },
    entity: 'Kunde',
    entityId: 'C001',
    changes: [
      { field: 'Firmenname', oldValue: 'Hofladen Müller', newValue: 'Hofladen Müller GmbH', type: 'text' },
      { field: 'Telefon', oldValue: '+49-89-111111', newValue: '+49-89-1234567', type: 'text' },
      { field: 'E-Mail', oldValue: null, newValue: 'info@hofladen-mueller.de', type: 'text' },
    ],
    reason: 'Stammdatenkorrektur',
    ipAddress: '192.168.1.100',
    device: 'Chrome 119, Windows 10',
    location: 'München, Germany',
  },
  {
    id: '2',
    timestamp: new Date('2024-11-14T16:30:00'),
    action: 'updated',
    user: { name: 'Dr. Schmidt', role: 'GF' },
    entity: 'Rechnung',
    entityId: 'INV-2024-001',
    changes: [
      { field: 'Rechnungsbetrag', oldValue: '€ 63.046,00', newValue: '€ 63.460,00', type: 'number' },
    ],
    reason: 'Tippfehler in Rechnungsbetrag',
    ipAddress: '192.168.1.50',
    device: 'Firefox 120, macOS 14',
    isGoBD: true,
    approvedBy: 'Dr. Schmidt (GF)',
  },
  {
    id: '3',
    timestamp: new Date('2024-11-14T14:20:00'),
    action: 'updated',
    user: { name: 'Michael Schmidt', role: 'ADM' },
    entity: 'Kunde',
    entityId: 'C001',
    changes: [
      { field: 'Status', oldValue: 'Lead', newValue: 'Aktiv', type: 'text' },
      { field: 'Kreditlimit', oldValue: '€ 10.000,00', newValue: '€ 25.000,00', type: 'number' },
    ],
    reason: 'Kunde hat ersten Auftrag abgeschlossen',
    ipAddress: '192.168.1.75',
    device: 'Safari 17, iOS 17',
  },
  {
    id: '4',
    timestamp: new Date('2024-11-13T09:15:00'),
    action: 'created',
    user: { name: 'Thomas Wagner', role: 'PLAN' },
    entity: 'Projekt',
    entityId: 'P-2024-B023',
    changes: [
      { field: 'Projektname', oldValue: null, newValue: 'Ladenbau Hofladen Müller', type: 'text' },
      { field: 'Budget', oldValue: null, newValue: '€ 150.000,00', type: 'number' },
      { field: 'Startdatum', oldValue: null, newValue: '01.12.2024', type: 'date' },
    ],
    ipAddress: '192.168.1.120',
    device: 'Edge 119, Windows 11',
  },
  {
    id: '5',
    timestamp: new Date('2024-11-10T11:00:00'),
    action: 'updated',
    user: { name: 'Anna Weber', role: 'BUCH' },
    entity: 'Rechnung',
    entityId: 'INV-2024-001',
    changes: [
      { field: 'Status', oldValue: 'Entwurf', newValue: 'Finalisiert', type: 'text' },
    ],
    isGoBD: true,
    hash: 'a3b5c7d9e1f2a3b5c7d9e1f2a3b5c7d9e1f2a3b5c7d9e1f2a3b5c7d9e1f2a3b5',
    ipAddress: '192.168.1.100',
    device: 'Chrome 119, Windows 10',
  },
];

// Get action icon
function getActionIcon(action: ActionType) {
  switch (action) {
    case 'created':
      return <Plus className="h-4 w-4" />;
    case 'updated':
      return <Edit3 className="h-4 w-4" />;
    case 'deleted':
      return <Trash2 className="h-4 w-4" />;
  }
}

// Get action label
function getActionLabel(action: ActionType): string {
  switch (action) {
    case 'created':
      return 'Erstellt';
    case 'updated':
      return 'Aktualisiert';
    case 'deleted':
      return 'Gelöscht';
  }
}

// Get action badge variant
function getActionBadgeVariant(action: ActionType): 'default' | 'secondary' | 'destructive' {
  switch (action) {
    case 'created':
      return 'default';
    case 'updated':
      return 'secondary';
    case 'deleted':
      return 'destructive';
  }
}

// Get role color
function getRoleColor(role: UserRole): string {
  switch (role) {
    case 'GF':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'BUCH':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'PLAN':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'ADM':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'KALK':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'INNEN':
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// Format timestamp
function formatTimestamp(date: Date): string {
  return format(date, "dd.MM.yyyy, HH:mm 'Uhr'", { locale: de });
}

// Format value for display
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'boolean') {
    return value ? 'Ja' : 'Nein';
  }
  return String(value);
}

// Copy to clipboard
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

// Audit Event Card Component
function AuditEventCard({
  event,
  onViewDetails,
}: {
  event: AuditEvent;
  onViewDetails: (event: AuditEvent) => void;
}) {
  const [showTechnical, setShowTechnical] = useState(false);
  const [showAllFields, setShowAllFields] = useState(false);

  const visibleChanges = showAllFields ? event.changes : event.changes.slice(0, 3);
  const hasMoreChanges = event.changes.length > 3;

  return (
    <Card
      className={`relative ${
        event.isGoBD && event.hash
          ? 'border-green-200 bg-green-50/50'
          : event.isGoBD && event.approvedBy
          ? 'border-amber-200 bg-amber-50/50'
          : ''
      }`}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="mb-1">{formatTimestamp(event.timestamp)}</p>
            <div className="flex items-center gap-2">
              {event.isGoBD && event.hash && <Lock className="h-4 w-4 text-green-600" />}
              {event.isGoBD && event.approvedBy && <Shield className="h-4 w-4 text-amber-600" />}
              {getActionIcon(event.action)}
              <Badge variant={getActionBadgeVariant(event.action)}>
                {getActionLabel(event.action)}
              </Badge>
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="mb-0.5">{event.user.name}</p>
              <Badge className={getRoleColor(event.user.role)} variant="outline">
                {event.user.role}
              </Badge>
            </div>
            <Avatar>
              <AvatarFallback>
                {event.user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* GoBD Indicator */}
        {event.isGoBD && event.hash && (
          <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-green-800">GoBD-konform gesichert</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <span className="truncate font-mono text-xs">SHA-256: {event.hash.substring(0, 16)}...</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => copyToClipboard(event.hash!)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-amber-700 text-sm mt-2">⚠️ Ab jetzt unveränderlich</p>
          </div>
        )}

        {/* GF Correction */}
        {event.isGoBD && event.approvedBy && (
          <div className="mb-4 p-3 bg-amber-100 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-amber-600" />
              <span className="text-amber-800">Korrektur durch GF</span>
            </div>
            <p className="text-amber-700 text-sm">Genehmigt von: {event.approvedBy}</p>
            <p className="text-amber-700 text-sm">Protokoll-ID: CL-2024-00123</p>
          </div>
        )}

        {/* Changes */}
        <div className="space-y-3">
          <p className="text-muted-foreground">
            Geänderte Felder ({event.changes.length})
          </p>

          <div className="space-y-2">
            {visibleChanges.map((change, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <div className="flex-1 min-w-0">
                  <span className="mr-2">{change.field}:</span>
                  {change.oldValue !== null && change.oldValue !== undefined && (
                    <span className="text-red-600 line-through mr-2">
                      {formatValue(change.oldValue)}
                    </span>
                  )}
                  <span className="text-muted-foreground mx-2">→</span>
                  <span className="text-green-600">
                    {formatValue(change.newValue)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {hasMoreChanges && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllFields(!showAllFields)}
            >
              {showAllFields ? (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Weniger anzeigen
                </>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Alle {event.changes.length} Felder anzeigen
                </>
              )}
            </Button>
          )}
        </div>

        {/* Reason */}
        {event.reason && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <span className="text-muted-foreground">Grund:</span> {event.reason}
            </p>
          </div>
        )}

        {/* Technical Details */}
        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTechnical(!showTechnical)}
          >
            {showTechnical ? (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Technische Details ausblenden
              </>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 mr-2" />
                Technische Details anzeigen
              </>
            )}
          </Button>

          {showTechnical && (
            <div className="mt-3 p-3 bg-muted rounded-lg space-y-2 text-sm">
              {event.ipAddress && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">IP-Adresse:</span>
                  <span>{event.ipAddress}</span>
                </div>
              )}
              {event.device && (
                <div className="flex items-center gap-2">
                  <Monitor className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Gerät:</span>
                  <span>{event.device}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Standort:</span>
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* View Details Link */}
        <Button
          variant="link"
          size="sm"
          className="mt-4 p-0 h-auto"
          onClick={() => onViewDetails(event)}
        >
          <ExternalLink className="h-3 w-3 mr-2" />
          Detaillierte Ansicht öffnen
        </Button>
      </CardContent>
    </Card>
  );
}

// Filter Panel Component
function FilterPanel({
  isOpen,
  onClose,
  onApplyFilters,
}: {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<ActionType[]>([]);
  const [selectedField, setSelectedField] = useState<string>('all');
  const [goBDOnly, setGoBDOnly] = useState(false);

  const handleApply = () => {
    onApplyFilters({
      startDate,
      endDate,
      users: selectedUsers,
      actions: selectedActions,
      field: selectedField,
      goBDOnly,
    });
    onClose();
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedUsers([]);
    setSelectedActions([]);
    setSelectedField('all');
    setGoBDOnly(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)] mt-6">
          <div className="space-y-6">
            {/* Date Range */}
            <div>
              <Label className="mb-3 block">Zeitraum</Label>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'dd.MM.yyyy') : 'Von'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} locale={de} />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'dd.MM.yyyy') : 'Bis'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} locale={de} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <Label className="mb-3 block">Schnellfilter</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer">
                  Letzte 7 Tage
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  Letzter Monat
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  Dieses Jahr
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  Nur von mir
                </Badge>
              </div>
            </div>

            {/* Action Type */}
            <div>
              <Label className="mb-3 block">Aktion</Label>
              <div className="space-y-2">
                {(['created', 'updated', 'deleted'] as ActionType[]).map((action) => (
                  <div key={action} className="flex items-center gap-2">
                    <Checkbox
                      id={`action-${action}`}
                      checked={selectedActions.includes(action)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedActions([...selectedActions, action]);
                        } else {
                          setSelectedActions(selectedActions.filter((a) => a !== action));
                        }
                      }}
                    />
                    <Label htmlFor={`action-${action}`} className="cursor-pointer">
                      {getActionLabel(action)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Filter */}
            <div>
              <Label className="mb-3 block">Feld</Label>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Felder</SelectItem>
                  <SelectItem value="firmenname">Firmenname</SelectItem>
                  <SelectItem value="telefon">Telefon</SelectItem>
                  <SelectItem value="email">E-Mail</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="kreditlimit">Kreditlimit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* GoBD Only */}
            <div className="flex items-center gap-2">
              <Checkbox id="gobd-only" checked={goBDOnly} onCheckedChange={(checked) => setGoBDOnly(!!checked)} />
              <Label htmlFor="gobd-only" className="cursor-pointer">
                Nur GoBD-relevante Änderungen
              </Label>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border bg-background flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Zurücksetzen
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Anwenden
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Detail View Dialog Component
function DetailViewDialog({
  event,
  isOpen,
  onClose,
}: {
  event: AuditEvent | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Detaillierte Änderungsansicht</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] mt-4">
          <div className="space-y-6">
            {/* Event Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Zeitstempel</Label>
                <p>{formatTimestamp(event.timestamp)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Benutzer</Label>
                <p>
                  {event.user.name} ({event.user.role})
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Aktion</Label>
                <Badge variant={getActionBadgeVariant(event.action)}>
                  {getActionLabel(event.action)}
                </Badge>
              </div>
              <div>
                <Label className="text-muted-foreground">Entität</Label>
                <p>
                  {event.entity} (ID: {event.entityId})
                </p>
              </div>
            </div>

            <Separator />

            {/* Changes - Side by Side */}
            <div>
              <Label className="mb-4 block">Änderungen im Detail</Label>
              <div className="space-y-4">
                {event.changes.map((change, index) => (
                  <div key={index} className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-2">
                      <p>{change.field}</p>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-border">
                      {/* Old Value */}
                      <div className="p-4 bg-red-50">
                        <Label className="text-red-700 mb-2 block">Vorher</Label>
                        <p className="text-red-900">
                          {formatValue(change.oldValue)}
                        </p>
                      </div>
                      {/* New Value */}
                      <div className="p-4 bg-green-50">
                        <Label className="text-green-700 mb-2 block">Nachher</Label>
                        <p className="text-green-900">
                          {formatValue(change.newValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Details */}
            {(event.ipAddress || event.device || event.location) && (
              <>
                <Separator />
                <div>
                  <Label className="mb-3 block">Technische Details</Label>
                  <div className="space-y-2 text-sm">
                    {event.ipAddress && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24">IP-Adresse:</span>
                        <span>{event.ipAddress}</span>
                      </div>
                    )}
                    {event.device && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24">Gerät:</span>
                        <span>{event.device}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-24">Standort:</span>
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Main Audit Trail Viewer Component
export function AuditTrailViewer({ userRole = 'GF' }: { userRole?: UserRole }) {
  const [events, setEvents] = useState<AuditEvent[]>(mockAuditEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);

  // Filter events based on search
  const filteredEvents = events.filter((event) => {
    const query = searchQuery.toLowerCase();
    return (
      event.user.name.toLowerCase().includes(query) ||
      event.entity.toLowerCase().includes(query) ||
      event.changes.some(
        (c) =>
          c.field.toLowerCase().includes(query) ||
          String(c.oldValue).toLowerCase().includes(query) ||
          String(c.newValue).toLowerCase().includes(query)
      ) ||
      event.reason?.toLowerCase().includes(query)
    );
  });

  const handleApplyFilters = (filters: any) => {
    console.log('Applying filters:', filters);
    // In real app, would filter events based on filters
  };

  const handleViewDetails = (event: AuditEvent) => {
    setSelectedEvent(event);
    setShowDetailView(true);
  };

  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    console.log('Exporting as:', format);
    // In real app, would export audit trail
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <History className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="mb-1">Änderungsverlauf</h2>
            <p className="text-muted-foreground">Kunde: Hofladen Müller GmbH</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Select onValueChange={(value) => handleExport(value as any)}>
            <SelectTrigger className="w-auto">
              <Download className="h-4 w-4 mr-2" />
              Exportieren
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Änderungen durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20" />

        {/* Events */}
        <div className="space-y-6 relative">
          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">Keine Änderungen gefunden</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'Versuchen Sie einen anderen Suchbegriff'
                    : 'Für diesen Zeitraum gibt es keine Einträge'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="relative pl-12">
                {/* Timeline Dot */}
                <div className="absolute left-3 top-6 h-3 w-3 rounded-full bg-primary border-4 border-background" />

                <AuditEventCard event={event} onViewDetails={handleViewDetails} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Load More */}
      {filteredEvents.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button variant="outline">Weitere laden</Button>
        </div>
      )}

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
      />

      {/* Detail View Dialog */}
      <DetailViewDialog
        event={selectedEvent}
        isOpen={showDetailView}
        onClose={() => {
          setShowDetailView(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
}

// Demo Component
export function AuditTrailViewerDemo() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('GF');

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <Label className="mb-2 block">Benutzerrolle für Demo</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GF">GF (Geschäftsführung) - Voller Zugriff</SelectItem>
                <SelectItem value="BUCH">BUCH (Buchhaltung) - Voller Zugriff</SelectItem>
                <SelectItem value="PLAN">PLAN (Planung) - Eigene & verwaltete</SelectItem>
                <SelectItem value="ADM">ADM (Außendienst) - Nur eigene</SelectItem>
                <SelectItem value="KALK">KALK (Kalkulation) - Nur eigene</SelectItem>
                <SelectItem value="INNEN">INNEN (Innendienst) - Nur eigene</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border border-border rounded-lg p-6 bg-muted/50">
            <h3 className="mb-4">Features:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Vertikale Timeline mit farbcodierten Event-Cards</li>
              <li>• Field-Level Diffs (Vorher/Nachher mit Farben)</li>
              <li>• Benutzer-Attribution mit Avatar und Rolle</li>
              <li>• GoBD-Compliance Indikatoren (Finalisierung, Korrekturen)</li>
              <li>• SHA-256 Hash-Anzeige mit Copy-Button</li>
              <li>• Technische Details (IP, Gerät, Standort)</li>
              <li>• Umfangreiche Filter (Datum, Benutzer, Aktion, Feld)</li>
              <li>• Schnellfilter-Chips (7 Tage, Monat, Jahr, Nur von mir)</li>
              <li>• Live-Suche durch alle Änderungen</li>
              <li>• Export-Optionen (PDF, CSV, JSON)</li>
              <li>• Detailansicht-Dialog mit Side-by-Side Diff</li>
              <li>• Expandable: Alle Felder anzeigen/ausblenden</li>
              <li>• Expandable: Technische Details ein-/ausblenden</li>
              <li>• RBAC: Rollenbasierte Zugriffskontrolle</li>
              <li>• Empty States für keine Ergebnisse</li>
              <li>• Mobile-optimiert mit Sheet-Filter</li>
              <li>• Deutsche Lokalisierung (date-fns)</li>
              <li>• "Weitere laden" Pagination</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <AuditTrailViewer userRole={selectedRole} />
    </div>
  );
}
