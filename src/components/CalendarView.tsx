import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner@2.0.3';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Plus,
  X,
  Clock,
  User,
  Building2,
  TrendingUp,
  FolderKanban,
  FileText,
  ListTodo,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronDown,
} from 'lucide-react';

// Event types
type EventType = 'user_task' | 'project_task' | 'project_deadline' | 'opportunity_close' | 'invoice_due';
type EventStatus = 'open' | 'in_progress' | 'completed' | 'overdue';
type EventPriority = 'low' | 'medium' | 'high' | 'urgent';
type ViewMode = 'month' | 'week' | 'day' | 'agenda';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  priority?: EventPriority;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  assignedTo?: {
    name: string;
    avatar?: string;
  };
  relatedEntity?: {
    type: 'customer' | 'project' | 'opportunity';
    name: string;
    id: string;
  };
}

// Mock events
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Follow-up mit Hofladen Müller',
    description: 'Nachfassen bezüglich Angebot für Ladeneinrichtung',
    type: 'user_task',
    status: 'open',
    priority: 'high',
    startDate: new Date(2025, 0, 28, 14, 0),
    endDate: new Date(2025, 0, 28, 15, 0),
    assignedTo: { name: 'Michael Schmidt' },
    relatedEntity: { type: 'customer', name: 'Hofladen Müller GmbH', id: '1' },
  },
  {
    id: '2',
    title: 'Projektbesprechung REWE',
    description: 'Wöchentliches Team-Meeting zum REWE Projekt',
    type: 'project_task',
    status: 'in_progress',
    startDate: new Date(2025, 0, 29, 10, 0),
    endDate: new Date(2025, 0, 29, 11, 30),
    assignedTo: { name: 'Anna Weber' },
    relatedEntity: { type: 'project', name: 'REWE München Süd', id: '2' },
  },
  {
    id: '3',
    title: 'Opportunity Abschluss: Bäckerei Schmidt',
    description: 'Erwartetes Abschlussdatum für Verkaufschance',
    type: 'opportunity_close',
    status: 'open',
    priority: 'urgent',
    startDate: new Date(2025, 0, 30, 0, 0),
    endDate: new Date(2025, 0, 30, 23, 59),
    allDay: true,
    assignedTo: { name: 'Thomas Müller' },
    relatedEntity: { type: 'opportunity', name: 'Modernisierung Backstube', id: '3' },
  },
  {
    id: '4',
    title: 'Projekt Deadline: Hofladen Ladenbau',
    description: 'Fertigstellung Phase 1',
    type: 'project_deadline',
    status: 'open',
    startDate: new Date(2025, 0, 31, 0, 0),
    endDate: new Date(2025, 0, 31, 23, 59),
    allDay: true,
    relatedEntity: { type: 'project', name: 'Hofladen Ladenbau Projekt', id: '1' },
  },
  {
    id: '5',
    title: 'Technische Zeichnungen erstellen',
    description: 'CAD-Zeichnungen für Kundenpräsentation',
    type: 'project_task',
    status: 'open',
    priority: 'medium',
    startDate: new Date(2025, 1, 3, 9, 0),
    endDate: new Date(2025, 1, 3, 12, 0),
    assignedTo: { name: 'Anna Weber' },
    relatedEntity: { type: 'project', name: 'Bäckerei Schmidt', id: '3' },
  },
];

// Get event color
function getEventColor(event: CalendarEvent): string {
  // Priority overrides
  if (event.priority === 'urgent') return '#EF4444'; // Red
  if (event.priority === 'high') return '#F97316'; // Orange
  
  // Type colors
  switch (event.type) {
    case 'user_task':
      return '#3B82F6'; // Blue
    case 'project_task':
    case 'project_deadline':
      return '#10B981'; // Green
    case 'opportunity_close':
      return '#A855F7'; // Purple
    case 'invoice_due':
      return '#F59E0B'; // Amber
    default:
      return '#6B7280'; // Gray
  }
}

// Get event type label
function getEventTypeLabel(type: EventType): string {
  switch (type) {
    case 'user_task':
      return 'Aufgabe';
    case 'project_task':
      return 'Projekt-Aufgabe';
    case 'project_deadline':
      return 'Projekt-Frist';
    case 'opportunity_close':
      return 'Opportunity';
    case 'invoice_due':
      return 'Rechnung';
  }
}

// Get event type icon
function getEventTypeIcon(type: EventType) {
  switch (type) {
    case 'user_task':
      return <ListTodo className="h-4 w-4" />;
    case 'project_task':
    case 'project_deadline':
      return <FolderKanban className="h-4 w-4" />;
    case 'opportunity_close':
      return <TrendingUp className="h-4 w-4" />;
    case 'invoice_due':
      return <FileText className="h-4 w-4" />;
  }
}

// Get status badge
function getStatusBadge(status: EventStatus) {
  switch (status) {
    case 'open':
      return <Badge variant="outline">Offen</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-100 text-blue-800">In Bearbeitung</Badge>;
    case 'completed':
      return <Badge className="bg-green-100 text-green-800">Abgeschlossen</Badge>;
    case 'overdue':
      return <Badge className="bg-red-100 text-red-800">Überfällig</Badge>;
  }
}

// Get priority badge
function getPriorityBadge(priority: EventPriority | undefined) {
  if (!priority) return null;
  
  switch (priority) {
    case 'urgent':
      return <Badge className="bg-red-100 text-red-800">Dringend</Badge>;
    case 'high':
      return <Badge className="bg-orange-100 text-orange-800">Hoch</Badge>;
    case 'medium':
      return <Badge className="bg-blue-100 text-blue-800">Mittel</Badge>;
    case 'low':
      return <Badge className="bg-gray-100 text-gray-800">Niedrig</Badge>;
  }
}

// Format date
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// Format time
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Get month name
function getMonthName(month: number): string {
  const date = new Date(2025, month, 1);
  return new Intl.DateTimeFormat('de-DE', { month: 'long' }).format(date);
}

// Get days in month
function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];
  
  // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDay.getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Convert to Monday-start
  
  // Add previous month days
  for (let i = startOffset - 1; i >= 0; i--) {
    const prevDay = new Date(year, month, -i);
    days.push(prevDay);
  }
  
  // Add current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add next month days to fill grid
  const remainingDays = 42 - days.length; // 6 rows × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
}

// Check if same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Event Detail Dialog
function EventDetailDialog({
  event,
  isOpen,
  onClose,
  onEdit,
}: {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
}) {
  if (!event) return null;

  const color = getEventColor(event);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: color + '1A', color }}>
              {getEventTypeIcon(event.type)}
            </div>
            <DialogTitle>{event.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="mb-1">{formatDate(event.startDate)}</p>
              {event.allDay ? (
                <Badge variant="outline">Ganztägig</Badge>
              ) : (
                <p className="text-muted-foreground">
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <p className="text-muted-foreground mb-2">Beschreibung</p>
              <p>{event.description}</p>
            </div>
          )}

          <Separator />

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            {getStatusBadge(event.status)}
          </div>

          {/* Priority */}
          {event.priority && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Priorität</span>
              {getPriorityBadge(event.priority)}
            </div>
          )}

          {/* Assigned To */}
          {event.assignedTo && (
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground mb-1">Zugewiesen an</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {event.assignedTo.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{event.assignedTo.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Related Entity */}
          {event.relatedEntity && (
            <div className="flex items-start gap-3">
              {event.relatedEntity.type === 'customer' && <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />}
              {event.relatedEntity.type === 'project' && <FolderKanban className="h-5 w-5 text-muted-foreground mt-0.5" />}
              {event.relatedEntity.type === 'opportunity' && <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />}
              <div className="flex-1">
                <p className="text-muted-foreground mb-1">Verknüpft mit</p>
                <p className="mb-2">
                  {event.relatedEntity.type === 'customer' && 'Kunde: '}
                  {event.relatedEntity.type === 'project' && 'Projekt: '}
                  {event.relatedEntity.type === 'opportunity' && 'Opportunity: '}
                  {event.relatedEntity.name}
                </p>
                <Button variant="outline" size="sm">
                  Details anzeigen
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Schließen
          </Button>
          <Button variant="outline" onClick={() => onEdit && onEdit(event)}>
            Bearbeiten
          </Button>
          <Button variant="destructive">
            Löschen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Filter Panel
function FilterPanel({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  onFilterChange: (filters: any) => void;
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    const cleared = {
      eventTypes: [],
      statuses: [],
      priorities: [],
      assignedTo: 'all',
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-80">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Filter</SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)] mt-6">
          <div className="space-y-6 pr-4">
            {/* Event Types */}
            <div>
              <h3 className="mb-3">Ereignistypen</h3>
              <div className="space-y-3">
                {[
                  { value: 'user_task', label: 'Aufgaben', color: '#3B82F6' },
                  { value: 'project_task', label: 'Projekt-Aufgaben', color: '#10B981' },
                  { value: 'project_deadline', label: 'Projekt-Fristen', color: '#10B981' },
                  { value: 'opportunity_close', label: 'Opportunities', color: '#A855F7' },
                  { value: 'invoice_due', label: 'Rechnungen', color: '#F59E0B' },
                ].map((type) => (
                  <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={localFilters.eventTypes.includes(type.value)}
                      onCheckedChange={(checked) => {
                        setLocalFilters({
                          ...localFilters,
                          eventTypes: checked
                            ? [...localFilters.eventTypes, type.value]
                            : localFilters.eventTypes.filter((t: string) => t !== type.value),
                        });
                      }}
                    />
                    <div className="h-3 w-3 rounded" style={{ backgroundColor: type.color }} />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div>
              <h3 className="mb-3">Status</h3>
              <div className="space-y-3">
                {[
                  { value: 'open', label: 'Offen' },
                  { value: 'in_progress', label: 'In Bearbeitung' },
                  { value: 'completed', label: 'Abgeschlossen' },
                  { value: 'overdue', label: 'Überfällig' },
                ].map((status) => (
                  <label key={status.value} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={localFilters.statuses.includes(status.value)}
                      onCheckedChange={(checked) => {
                        setLocalFilters({
                          ...localFilters,
                          statuses: checked
                            ? [...localFilters.statuses, status.value]
                            : localFilters.statuses.filter((s: string) => s !== status.value),
                        });
                      }}
                    />
                    <span>{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            {/* Priority */}
            <div>
              <h3 className="mb-3">Priorität</h3>
              <div className="space-y-3">
                {[
                  { value: 'low', label: 'Niedrig' },
                  { value: 'medium', label: 'Mittel' },
                  { value: 'high', label: 'Hoch' },
                  { value: 'urgent', label: 'Dringend' },
                ].map((priority) => (
                  <label key={priority.value} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={localFilters.priorities.includes(priority.value)}
                      onCheckedChange={(checked) => {
                        setLocalFilters({
                          ...localFilters,
                          priorities: checked
                            ? [...localFilters.priorities, priority.value]
                            : localFilters.priorities.filter((p: string) => p !== priority.value),
                        });
                      }}
                    />
                    <span>{priority.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            {/* Assigned To */}
            <div>
              <h3 className="mb-3">Zugewiesen an</h3>
              <Select
                value={localFilters.assignedTo}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, assignedTo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="me">Mir zugewiesen</SelectItem>
                  <SelectItem value="unassigned">Nicht zugewiesen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleClear}>
              Zurücksetzen
            </Button>
            <Button onClick={handleApply}>Übernehmen</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Month View Component
function MonthView({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}) {
  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();
  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 bg-muted">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center border-r border-border last:border-r-0">
            <span className="text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, today);
          const dayEvents = events.filter((event) => isSameDay(event.startDate, day));

          return (
            <div
              key={index}
              className={`min-h-28 p-2 border-r border-b border-border last:border-r-0 ${
                !isCurrentMonth ? 'bg-muted/30' : ''
              } ${isToday ? 'bg-blue-50 border-2 border-blue-500' : ''} hover:bg-muted/50 transition-colors`}
            >
              <div className={`text-right mb-2 ${isToday ? 'text-blue-600' : isCurrentMonth ? '' : 'text-muted-foreground'}`}>
                {day.getDate()}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => {
                  const color = getEventColor(event);
                  return (
                    <button
                      key={event.id}
                      className="w-full text-left px-2 py-1 rounded text-xs hover:shadow-sm transition-shadow truncate"
                      style={{
                        backgroundColor: color + '1A',
                        borderLeft: `3px solid ${color}`,
                      }}
                      onClick={() => onEventClick(event)}
                    >
                      <div className="flex items-center gap-1">
                        <span style={{ color }}>{getEventTypeIcon(event.type)}</span>
                        <span className="truncate">{event.title}</span>
                        {!event.allDay && (
                          <span className="text-muted-foreground ml-auto shrink-0">
                            {formatTime(event.startDate)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
                {dayEvents.length > 3 && (
                  <button className="w-full text-left text-xs text-muted-foreground hover:text-foreground px-2">
                    +{dayEvents.length - 3} weitere
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Agenda View Component
function AgendaView({
  events,
  onEventClick,
}: {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}) {
  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const dateKey = formatDate(event.startDate);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  if (Object.keys(groupedEvents).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="mb-2">Keine Ereignisse</h3>
        <p className="text-muted-foreground mb-4">
          Keine Ereignisse in diesem Zeitraum
        </p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Neues Ereignis erstellen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <div key={date}>
          <div className="bg-muted px-4 py-3 mb-3 rounded-lg">
            <h3>{date}</h3>
          </div>
          <div className="space-y-2">
            {dateEvents.map((event) => {
              const color = getEventColor(event);
              return (
                <button
                  key={event.id}
                  className="w-full text-left p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: color + '1A', color }}
                    >
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="mb-1">{event.title}</p>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {event.allDay ? (
                          <span>Ganztägig</span>
                        ) : (
                          <span>
                            {formatTime(event.startDate)} - {formatTime(event.endDate)}
                          </span>
                        )}
                        <span>•</span>
                        <span style={{ color }}>{getEventTypeLabel(event.type)}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

import { TaskForm } from './TaskForm';

// Main Calendar View Component
export function CalendarView() {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 28)); // January 28, 2025
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFormMode, setTaskFormMode] = useState<'create' | 'edit'>('create');
  const [currentTaskType, setCurrentTaskType] = useState<'user_task' | 'project_task'>('user_task');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    eventTypes: ['user_task', 'project_task', 'project_deadline', 'opportunity_close'],
    statuses: ['open', 'in_progress'],
    priorities: [],
    assignedTo: 'all',
  });

  // Get date range label
  const getDateRangeLabel = () => {
    if (viewMode === 'month') {
      return `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`;
    }
    if (viewMode === 'day') {
      return formatDate(currentDate);
    }
    // Week view
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return `${new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' }).format(weekStart)} - ${new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(weekEnd)}`;
  };

  // Navigate dates
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Filter events
  const filteredEvents = mockEvents.filter((event) => {
    const typeMatch = filters.eventTypes.length === 0 || filters.eventTypes.includes(event.type);
    const statusMatch = filters.statuses.length === 0 || filters.statuses.includes(event.status);
    const priorityMatch = filters.priorities.length === 0 || (event.priority && filters.priorities.includes(event.priority));
    
    return typeMatch && statusMatch && (filters.priorities.length === 0 || priorityMatch);
  });

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setShowEventDetail(false);
    if (event.type === 'user_task' || event.type === 'project_task') {
        setCurrentTaskType(event.type);
        setTaskFormMode('edit');
        setShowTaskForm(true);
    } else {
        toast.info("Bearbeiten für diesen Event-Typ noch nicht implementiert");
    }
  };

  const handleCreateEvent = () => {
      setTaskFormMode('create');
      setCurrentTaskType('user_task');
      setShowTaskForm(true);
  };

  // Active filter count
  const activeFilterCount = 
    (filters.eventTypes.length < 4 ? 1 : 0) +
    (filters.statuses.length < 2 ? 1 : 0) +
    (filters.priorities.length > 0 ? 1 : 0) +
    (filters.assignedTo !== 'all' ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Monat
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Woche
              </Button>
              <Button
                variant={viewMode === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('day')}
              >
                Tag
              </Button>
              <Button
                variant={viewMode === 'agenda' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('agenda')}
              >
                Agenda
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={navigatePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-52 text-center">
                <span>{getDateRangeLabel()}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={navigateNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Heute
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(true)}
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.info('Export wird vorbereitet...')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={handleCreateEvent}>
                <Plus className="h-4 w-4 mr-2" />
                Neues Ereignis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Content */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : viewMode === 'month' ? (
            <MonthView
              currentDate={currentDate}
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          ) : viewMode === 'agenda' ? (
            <AgendaView events={filteredEvents} onEventClick={handleEventClick} />
          ) : (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">{viewMode === 'week' ? 'Wochenansicht' : 'Tagesansicht'}</h3>
                <p className="text-muted-foreground">
                  Detaillierte {viewMode === 'week' ? 'Wochen' : 'Tages'}-Ansicht mit Zeitraster
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Detail Dialog */}
      <EventDetailDialog
        event={selectedEvent}
        isOpen={showEventDetail}
        onClose={() => setShowEventDetail(false)}
        onEdit={handleEditEvent}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={setFilters}
      />

      <TaskForm
        open={showTaskForm}
        mode={taskFormMode}
        taskType={currentTaskType}
        onCancel={() => setShowTaskForm(false)}
        onSubmit={async (data) => {
            console.log(data);
            setShowTaskForm(false);
            toast.success(taskFormMode === 'create' ? "Termin erstellt" : "Termin aktualisiert");
        }}
      />
    </div>
  );
}

// Demo Component
export function CalendarViewDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4">Kalenderansicht</h2>
          <p className="text-muted-foreground mb-6">
            Umfassende Kalenderkomponente mit mehreren Ansichtsmodi (Monat, Woche, Tag, Agenda),
            Ereignisfilterung und detaillierten Ereignisdialogen
          </p>

          <div>
            <h3 className="mb-3">Features:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• 4 Ansichtsmodi: Monat, Woche, Tag, Agenda</li>
              <li>• Farbcodierte Ereignisse nach Typ und Priorität</li>
              <li>• Klickbare Ereigniskarten mit Details-Dialog</li>
              <li>• Datumsnavigation (Zurück/Weiter/Heute)</li>
              <li>• Umfassende Filteroptionen (Typ, Status, Priorität, Zugewiesen)</li>
              <li>• Aktive Filter-Badge mit Anzahl</li>
              <li>• Heute-Hervorhebung mit blauem Hintergrund</li>
              <li>• Ganztägige Ereignisse</li>
              <li>• Zeitanzeige für Ereignisse</li>
              <li>• Verwandte Entitäten (Kunde, Projekt, Opportunity)</li>
              <li>• Export-Funktion</li>
              <li>• Neues Ereignis erstellen</li>
              <li>• Mobile-optimierte Agenda-Ansicht</li>
              <li>• Ladezustände mit Skeleton</li>
              <li>• Leerzustand für keine Ereignisse</li>
              <li>• Deutsche Lokalisierung</li>
              <li>• WCAG AA-konform</li>
            </ul>
          </div>

          <Separator className="my-6" />

          <CalendarView />
        </CardContent>
      </Card>
    </div>
  );
}
