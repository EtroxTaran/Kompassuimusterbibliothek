import { useState, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Sheet, SheetContent } from './ui/sheet';
import { Calendar } from './ui/calendar';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import {
  Download,
  X,
  Calendar as CalendarIcon,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { format, differenceInDays, addDays, startOfMonth, endOfMonth } from 'date-fns';
import { de } from 'date-fns/locale';

// Types
type EventType = 'tasks' | 'project-tasks' | 'project-deadlines' | 'opportunities';
type EventStatus = 'open' | 'in-progress' | 'completed' | 'overdue';
type EventPriority = 'low' | 'medium' | 'high' | 'urgent';
type ExportScope = 'personal' | 'team';
type UserRole = 'ADM' | 'GF' | 'PLAN' | 'KALK' | 'BUCH' | 'INNEN';

interface EventTypeSetting {
  type: EventType;
  label: string;
  color: string;
  count: number;
}

interface CalendarExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: UserRole;
  isMobile?: boolean;
}

// Mock event counts
const mockEventCounts: Record<EventType, number> = {
  'tasks': 15,
  'project-tasks': 23,
  'project-deadlines': 8,
  'opportunities': 5,
};

// Event type configurations
const eventTypeSettings: EventTypeSetting[] = [
  { type: 'tasks', label: 'Aufgaben', color: '#3B82F6', count: mockEventCounts.tasks },
  { type: 'project-tasks', label: 'Projekt-Aufgaben', color: '#10B981', count: mockEventCounts['project-tasks'] },
  { type: 'project-deadlines', label: 'Projekt-Fristen', color: '#10B981', count: mockEventCounts['project-deadlines'] },
  { type: 'opportunities', label: 'Opportunities', color: '#A855F7', count: mockEventCounts.opportunities },
];

// Format date for display
function formatDateDisplay(date: Date): string {
  return format(date, 'dd.MM.yyyy', { locale: de });
}

// Calculate file size estimate
function estimateFileSize(eventCount: number): string {
  const bytesPerEvent = 250; // Approximate bytes per ICS event
  const totalBytes = eventCount * bytesPerEvent;
  return totalBytes < 1024 ? `${totalBytes} B` : `~${Math.round(totalBytes / 1024)} KB`;
}

export function CalendarExportDialog({
  isOpen,
  onClose,
  userRole = 'ADM',
  isMobile = false,
}: CalendarExportDialogProps) {
  // Date range state
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Filter state
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>(['tasks', 'project-tasks']);
  const [selectedStatuses, setSelectedStatuses] = useState<EventStatus[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<EventPriority[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [exportScope, setExportScope] = useState<ExportScope>('personal');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);

  // Check if user can access team export
  const canAccessTeamExport = userRole === 'GF' || userRole === 'PLAN';

  // Validate date range
  useEffect(() => {
    if (startDate && endDate) {
      const daysDiff = differenceInDays(endDate, startDate);
      if (daysDiff > 90) {
        setDateRangeError('Maximaler Zeitraum: 90 Tage');
      } else if (daysDiff < 0) {
        setDateRangeError('Enddatum muss nach Startdatum liegen');
      } else {
        setDateRangeError(null);
      }
    }
  }, [startDate, endDate]);

  // Calculate event count based on filters
  const calculateEventCount = useCallback(() => {
    let total = 0;
    selectedEventTypes.forEach((type) => {
      total += mockEventCounts[type] || 0;
    });
    // Simulate filter reduction (in real app, would filter actual events)
    if (selectedStatuses.length > 0) total = Math.round(total * 0.7);
    if (selectedPriorities.length > 0) total = Math.round(total * 0.8);
    if (exportScope === 'personal' && canAccessTeamExport) total = Math.round(total * 0.6);
    return total;
  }, [selectedEventTypes, selectedStatuses, selectedPriorities, exportScope, canAccessTeamExport]);

  const eventCount = calculateEventCount();
  const fileSize = estimateFileSize(eventCount);

  // Quick preset handlers
  const handleThisMonth = () => {
    const now = new Date();
    setStartDate(startOfMonth(now));
    setEndDate(endOfMonth(now));
  };

  const handleNext30Days = () => {
    const now = new Date();
    setStartDate(now);
    setEndDate(addDays(now, 30));
  };

  const handleNext90Days = () => {
    const now = new Date();
    setStartDate(now);
    setEndDate(addDays(now, 90));
  };

  // Toggle event type
  const toggleEventType = (type: EventType) => {
    setSelectedEventTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Select/deselect all event types
  const toggleAllEventTypes = () => {
    if (selectedEventTypes.length === eventTypeSettings.length) {
      setSelectedEventTypes([]);
    } else {
      setSelectedEventTypes(eventTypeSettings.map((et) => et.type));
    }
  };

  // Toggle status
  const toggleStatus = (status: EventStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // Toggle priority
  const togglePriority = (priority: EventPriority) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    );
  };

  // Handle export
  const handleExport = async () => {
    if (eventCount === 0) {
      toast.error('Keine Ereignisse', {
        description: 'Bitte passen Sie die Filter an.',
      });
      return;
    }

    if (dateRangeError) {
      toast.error('Ungültiger Zeitraum', {
        description: dateRangeError,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate export delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real app, would call API and download file
      // const response = await fetch('/api/v1/calendar/export/ics?...');
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `kompass-calendar-${format(new Date(), 'yyyy-MM-dd')}.ics`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

      toast.success('Export erfolgreich', {
        description: 'Kalender wurde als ICS-Datei heruntergeladen.',
        icon: <CheckCircle2 className="h-5 w-5" />,
        duration: 5000,
      });

      onClose();
    } catch (error) {
      toast.error('Export fehlgeschlagen', {
        description: 'Die Kalenderdatei konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
        icon: <XCircle className="h-5 w-5" />,
        action: {
          label: 'Erneut versuchen',
          onClick: handleExport,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // Render content
  const renderContent = () => (
    <>
      {/* Date Range Selection */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Label>Zeitraum auswählen</Label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="text-sm">
                Wählen Sie den Zeitraum für den Export (max. 90 Tage)
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Start Date */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Von</Label>
              <Popover open={showStartPicker} onOpenChange={setShowStartPicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {startDate ? formatDateDisplay(startDate) : 'TT.MM.JJJJ'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date);
                        setShowStartPicker(false);
                      }
                    }}
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Bis</Label>
              <Popover open={showEndPicker} onOpenChange={setShowEndPicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {endDate ? formatDateDisplay(endDate) : 'TT.MM.JJJJ'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      if (date) {
                        setEndDate(date);
                        setShowEndPicker(false);
                      }
                    }}
                    locale={de}
                    disabled={(date) => date < startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button variant="ghost" size="sm" onClick={handleThisMonth}>
              Dieser Monat
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNext30Days}>
              Nächste 30 Tage
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNext90Days}>
              Nächste 90 Tage
            </Button>
          </div>

          {/* Date Range Error */}
          {dateRangeError && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="text-amber-700">{dateRangeError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Event Type Filters */}
      <div className="space-y-4 pt-6">
        <div>
          <Label className="mb-1">Ereignistypen</Label>
          <p className="text-muted-foreground text-xs mb-3">
            Wählen Sie die Ereignistypen aus, die exportiert werden sollen
          </p>

          <div className="space-y-3">
            {eventTypeSettings.map((eventType) => (
              <div key={eventType.type} className="flex items-center gap-3">
                <Checkbox
                  id={eventType.type}
                  checked={selectedEventTypes.includes(eventType.type)}
                  onCheckedChange={() => toggleEventType(eventType.type)}
                />
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: eventType.color }}
                />
                <Label
                  htmlFor={eventType.type}
                  className="flex-1 cursor-pointer flex items-center gap-2"
                >
                  <span>{eventType.label}</span>
                  <span className="text-muted-foreground">({eventType.count})</span>
                </Label>
              </div>
            ))}
          </div>

          <button
            onClick={toggleAllEventTypes}
            className="text-primary text-xs mt-3 hover:underline"
          >
            {selectedEventTypes.length === eventTypeSettings.length
              ? 'Alle abwählen'
              : 'Alle auswählen'}
          </button>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="pt-6">
        <Accordion type="single" collapsible>
          <AccordionItem value="advanced-filters" className="border rounded-lg px-4">
            <AccordionTrigger>
              <span>Erweiterte Filter</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {/* Status Filter */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Status</Label>
                <div className="flex flex-wrap gap-3">
                  {(['open', 'in-progress', 'completed', 'overdue'] as EventStatus[]).map(
                    (status) => (
                      <div key={status} className="flex items-center gap-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={() => toggleStatus(status)}
                        />
                        <Label htmlFor={`status-${status}`} className="cursor-pointer text-sm">
                          {status === 'open' && 'Offen'}
                          {status === 'in-progress' && 'In Bearbeitung'}
                          {status === 'completed' && 'Abgeschlossen'}
                          {status === 'overdue' && 'Überfällig'}
                        </Label>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Priorität</Label>
                <div className="flex flex-wrap gap-3">
                  {(['low', 'medium', 'high', 'urgent'] as EventPriority[]).map((priority) => (
                    <div key={priority} className="flex items-center gap-2">
                      <Checkbox
                        id={`priority-${priority}`}
                        checked={selectedPriorities.includes(priority)}
                        onCheckedChange={() => togglePriority(priority)}
                      />
                      <Label htmlFor={`priority-${priority}`} className="cursor-pointer text-sm">
                        {priority === 'low' && 'Niedrig'}
                        {priority === 'medium' && 'Mittel'}
                        {priority === 'high' && 'Hoch'}
                        {priority === 'urgent' && 'Dringend'}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned To Filter */}
              {canAccessTeamExport && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Zugewiesen an
                  </Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      <SelectItem value="user1">Michael Schmidt</SelectItem>
                      <SelectItem value="user2">Anna Bauer</SelectItem>
                      <SelectItem value="user3">Thomas Wagner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Export Scope (GF/PLAN Only) */}
      {canAccessTeamExport && (
        <div className="pt-6 space-y-3">
          <Label>Export-Bereich</Label>
          <RadioGroup value={exportScope} onValueChange={(value) => setExportScope(value as ExportScope)}>
            <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
              <RadioGroupItem value="personal" id="personal" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="personal" className="cursor-pointer">
                  Mein Kalender
                </Label>
                <p className="text-muted-foreground text-xs mt-1">
                  Nur meine Aufgaben und zugewiesene Projekte
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
              <RadioGroupItem value="team" id="team" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="team" className="cursor-pointer flex items-center gap-2">
                  <span>Team-Kalender</span>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                    GF/PLAN
                  </Badge>
                </Label>
                <p className="text-muted-foreground text-xs mt-1">
                  Alle Ereignisse des gesamten Teams
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Export Preview */}
      <div className="pt-6">
        {eventCount === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-amber-800 mb-1">Keine Ereignisse im ausgewählten Zeitraum</p>
                <p className="text-amber-700 text-sm">
                  Bitte passen Sie die Filter an.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0" />
              <div className="flex-1 space-y-2">
                <p className="text-foreground">Export-Vorschau</p>
                <p className="text-foreground">
                  <span className="font-medium">{eventCount} Ereignisse</span> werden exportiert
                </p>
                <p className="text-muted-foreground text-sm">
                  Zeitraum: {formatDateDisplay(startDate)} - {formatDateDisplay(endDate)}
                </p>
                <p className="text-muted-foreground text-sm">
                  Geschätzte Dateigröße: {fileSize}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  // Desktop Dialog
  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-[560px] max-h-[80vh] p-0">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-border">
            <DialogTitle className="flex items-center gap-3">
              <Download className="h-6 w-6 text-primary" />
              <span>Kalender exportieren</span>
            </DialogTitle>
            <DialogDescription>
              Wählen Sie den Zeitraum und die Ereignistypen für den Export
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Body */}
          <div className="overflow-y-auto px-6 py-4 max-h-[calc(80vh-180px)]">
            {renderContent()}
          </div>

          {/* Footer */}
          <DialogFooter className="p-6 pt-4 border-t border-border flex-row justify-end gap-2">
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
              Abbrechen
            </Button>
            <Button
              onClick={handleExport}
              disabled={isLoading || eventCount === 0 || !!dateRangeError}
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exportiere...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  ICS-Datei herunterladen
                </>
              )}
            </Button>
          </DialogFooter>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center rounded-lg">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
              <p className="text-foreground mb-1">Exportiere Kalenderdaten...</p>
              <p className="text-muted-foreground text-sm">
                {eventCount} von {eventCount} Ereignissen verarbeitet
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile Bottom Sheet
  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-xl">
        {/* Handle Bar */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-muted-foreground/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pb-4 border-b border-border">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <Download className="h-6 w-6 text-primary" />
              <div>
                <h2 className="mb-1">Kalender exportieren</h2>
                <p className="text-muted-foreground text-sm">
                  Wählen Sie den Zeitraum und die Ereignistypen
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-5 py-6 h-[calc(90vh-200px)]">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-border bg-background space-y-2">
          <Button
            onClick={handleExport}
            disabled={isLoading || eventCount === 0 || !!dateRangeError}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Exportiere...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                ICS-Datei herunterladen
              </>
            )}
          </Button>
          <Button variant="ghost" className="w-full" onClick={handleClose} disabled={isLoading}>
            Abbrechen
          </Button>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center rounded-t-xl">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
            <p className="text-foreground mb-1">Exportiere Kalenderdaten...</p>
            <p className="text-muted-foreground text-sm">
              {eventCount} von {eventCount} Ereignissen verarbeitet
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Demo Component
export function CalendarExportDialogDemo() {
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADM');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <Label className="mb-2 block">Benutzerrolle für Demo</Label>
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADM">ADM (Außendienst)</SelectItem>
              <SelectItem value="GF">GF (Geschäftsführung)</SelectItem>
              <SelectItem value="PLAN">PLAN (Planung)</SelectItem>
              <SelectItem value="KALK">KALK (Kalkulation)</SelectItem>
              <SelectItem value="BUCH">BUCH (Buchhaltung)</SelectItem>
              <SelectItem value="INNEN">INNEN (Innendienst)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-sm mt-1">
            GF und PLAN sehen zusätzlich die Team-Kalender Option
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsDesktopOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Desktop Dialog öffnen
          </Button>
          <Button variant="outline" onClick={() => setIsMobileOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Mobile Sheet öffnen
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-lg p-6 bg-muted/50">
        <h3 className="mb-4">Features:</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Desktop: Zentrierter Dialog (560px Breite)</li>
          <li>• Mobile: Bottom Sheet (90vh Höhe, Swipe-Gesten)</li>
          <li>• Datumsbereich mit Quick-Presets (Dieser Monat, 30 Tage, 90 Tage)</li>
          <li>• Max. 90 Tage Validierung mit Fehleranzeige</li>
          <li>• 4 Ereignistypen mit Farbcodes und Zähler</li>
          <li>• Alle auswählen/abwählen Funktion</li>
          <li>• Erweiterte Filter (Status, Priorität, Benutzer)</li>
          <li>• Export-Bereich (Personal/Team) für GF/PLAN</li>
          <li>• Live Event-Zähler basierend auf Filtern</li>
          <li>• Dateigröße-Schätzung</li>
          <li>• Validierung: Mindestens 1 Ereignis erforderlich</li>
          <li>• Loading-State mit Overlay und Fortschritt</li>
          <li>• Success/Error Toasts mit Sonner</li>
          <li>• Deutsche Lokalisierung (date-fns)</li>
          <li>• Accessibility: Focus-Trap, Keyboard-Navigation</li>
          <li>• RBAC: Team-Export nur für GF/PLAN</li>
        </ul>
      </div>

      <CalendarExportDialog
        isOpen={isDesktopOpen}
        onClose={() => setIsDesktopOpen(false)}
        userRole={selectedRole}
        isMobile={false}
      />

      <CalendarExportDialog
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        userRole={selectedRole}
        isMobile={true}
      />
    </div>
  );
}
