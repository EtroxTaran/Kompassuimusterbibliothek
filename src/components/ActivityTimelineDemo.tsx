import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
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
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import {
  Phone,
  Mail,
  Calendar as CalendarIcon,
  FileText,
  CheckSquare,
  MapPin,
  MoreVertical,
  Building2,
  User,
  Clock,
  ArrowRight,
  Lock,
  Search,
  Plus,
  Download,
  ClipboardList,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Activity type
type ActivityType = 'phone' | 'email' | 'meeting' | 'note' | 'task' | 'visit';

// Activity interface
interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  customerId: string;
  customerName: string;
  contactName?: string;
  contactRole?: string;
  description: string;
  userId: string;
  userName: string;
  duration?: number; // minutes
  followUp?: string; // ISO date
  isPrivate?: boolean;
  timestamp: string; // ISO date
}

// Activity type config
const activityTypeConfig: Record<
  ActivityType,
  { label: string; icon: any; color: string; bgColor: string; borderColor: string }
> = {
  phone: {
    label: 'Anruf',
    icon: Phone,
    color: 'text-primary',
    bgColor: 'bg-primary',
    borderColor: 'border-l-primary',
  },
  email: {
    label: 'E-Mail',
    icon: Mail,
    color: 'text-green-600',
    bgColor: 'bg-green-600',
    borderColor: 'border-l-green-600',
  },
  meeting: {
    label: 'Meeting',
    icon: CalendarIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-600',
    borderColor: 'border-l-purple-600',
  },
  note: {
    label: 'Notiz',
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-600',
    borderColor: 'border-l-gray-600',
  },
  task: {
    label: 'Aufgabe',
    icon: CheckSquare,
    color: 'text-amber-600',
    bgColor: 'bg-amber-600',
    borderColor: 'border-l-amber-600',
  },
  visit: {
    label: 'Besuch',
    icon: MapPin,
    color: 'text-teal-600',
    bgColor: 'bg-teal-600',
    borderColor: 'border-l-teal-600',
  },
};

// Sample activities
const sampleActivities: Activity[] = [
  {
    id: '1',
    type: 'phone',
    title: 'Telefonat mit Hr. Müller',
    customerId: '1',
    customerName: 'Hofladen Müller GmbH',
    contactName: 'Hans Müller',
    contactRole: 'Geschäftsführer',
    description:
      'Besprochen: Neue Filiale in München Süd geplant für Q1 2025. Interesse an Ladeneinrichtung im Wert von ca. 120.000 €. Wünscht detailliertes Angebot bis Ende des Monats.',
    userId: '1',
    userName: 'Michael Schmidt',
    duration: 15,
    followUp: '2024-11-22',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'email',
    title: 'Angebot versendet',
    customerId: '2',
    customerName: 'REWE Köln Süd',
    description:
      'Angebot für Ladeneinrichtung versendet (Angebotsnummer: ANG-2024-087). Umfang: Regale, Kühltheken, Kassenbereich. Gesamtwert: 85.000 €.',
    userId: '2',
    userName: 'Anna Weber',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Besichtigungstermin',
    customerId: '2',
    customerName: 'REWE Köln Süd',
    contactName: 'Maria Weber',
    contactRole: 'Filialleitung',
    description:
      'Vor-Ort-Besichtigung der neuen Filiale. Besprechung der Ladengestaltung und Raumaufteilung. Kunde sehr zufrieden mit Konzeptentwurf.',
    userId: '3',
    userName: 'Thomas Fischer',
    duration: 120,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'note',
    title: 'Kundennotiz',
    customerId: '1',
    customerName: 'Hofladen Müller GmbH',
    description: 'Kunde bevorzugt natürliche Materialien (Holz, keine Kunststoffe). Budget flexibel.',
    userId: '1',
    userName: 'Michael Schmidt',
    isPrivate: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'task',
    title: 'Angebot nachfassen',
    customerId: '3',
    customerName: 'Edeka Hamburg Nord',
    description: 'Follow-up zum versendeten Angebot vom 10.11. Entscheidung soll diese Woche fallen.',
    userId: '2',
    userName: 'Anna Weber',
    followUp: '2024-11-18',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    type: 'visit',
    title: 'Vor-Ort-Termin',
    customerId: '1',
    customerName: 'Hofladen Müller GmbH',
    contactName: 'Hans Müller',
    description: 'Standortbesichtigung für neue Filiale. Räumlichkeiten geprüft, Maße aufgenommen.',
    userId: '3',
    userName: 'Thomas Fischer',
    duration: 90,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Format relative time
function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `Vor ${minutes} Minute${minutes !== 1 ? 'n' : ''}`;
  if (hours < 24) return `Vor ${hours} Stunde${hours !== 1 ? 'n' : ''}`;
  if (days === 1) return 'Gestern';
  if (days < 7) return `Vor ${days} Tagen`;
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Format absolute time
function formatAbsoluteTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Group activities by date
function groupActivitiesByDate(activities: Activity[]): { date: string; activities: Activity[] }[] {
  const groups = new Map<string, Activity[]>();

  activities.forEach((activity) => {
    const date = new Date(activity.timestamp);
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    let groupKey: string;
    if (date.toDateString() === now.toDateString()) {
      groupKey = 'Heute';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Gestern';
    } else {
      groupKey = date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(activity);
  });

  return Array.from(groups.entries()).map(([date, activities]) => ({
    date,
    activities,
  }));
}

// Activity Card Component
function ActivityCard({ activity, onEdit, onDelete }: { activity: Activity; onEdit: () => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const config = activityTypeConfig[activity.type];
  const Icon = config.icon;
  const shouldTruncate = activity.description.length > 150;

  return (
    <Card className={`border-l-4 ${config.borderColor} hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`h-8 w-8 rounded-full ${config.bgColor} flex items-center justify-center`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h4>{activity.title}</h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground" title={formatAbsoluteTime(activity.timestamp)}>
                {formatRelativeTime(activity.timestamp)}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>Bearbeiten</DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    Löschen
                  </DropdownMenuItem>
                  <DropdownMenuItem>Teilen</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Customer & Contact */}
          {(activity.customerName || activity.contactName) && (
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {activity.customerName && (
                <div className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  <span>{activity.customerName}</span>
                </div>
              )}
              {activity.contactName && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>
                    {activity.contactName}
                    {activity.contactRole && ` (${activity.contactRole})`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="text-sm">
            {expanded || !shouldTruncate
              ? activity.description
              : `${activity.description.substring(0, 150)}...`}
            {shouldTruncate && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-2 text-primary hover:underline inline-flex items-center gap-1"
              >
                {expanded ? (
                  <>
                    weniger anzeigen <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    mehr anzeigen <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* User */}
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">
                  {activity.userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">{activity.userName}</span>
            </div>

            {/* Duration */}
            {activity.duration && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{activity.duration} Minuten</span>
              </div>
            )}

            {/* Follow-up */}
            {activity.followUp && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <ArrowRight className="h-3 w-3" />
                <span>Follow-up: {new Date(activity.followUp).toLocaleDateString('de-DE')}</span>
              </div>
            )}

            {/* Private */}
            {activity.isPrivate && (
              <Badge variant="secondary" className="gap-1">
                <Lock className="h-3 w-3" />
                Privat
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Full Activity Timeline
function ActivityTimeline() {
  const [activities, setActivities] = useState(sampleActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);
  const [dateFilter, setDateFilter] = useState('7');
  const [showFilters, setShowFilters] = useState(false);

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    // Search filter
    if (
      searchQuery &&
      !activity.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Type filter
    if (selectedTypes.length > 0 && !selectedTypes.includes(activity.type)) {
      return false;
    }

    // Date filter
    const activityDate = new Date(activity.timestamp);
    const now = new Date();
    const daysAgo = parseInt(dateFilter);
    const filterDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    if (activityDate < filterDate) {
      return false;
    }

    return true;
  });

  const groupedActivities = groupActivitiesByDate(filteredActivities);

  const toggleType = (type: ActivityType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSearchQuery('');
    setDateFilter('7');
  };

  const hasActiveFilters = selectedTypes.length > 0 || searchQuery !== '' || dateFilter !== '7';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Aktivitäten</h2>
          <p className="text-muted-foreground">Kundenkontakte und Interaktionen</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Aktivität hinzufügen
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Aktivitäten durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filter {showFilters ? 'ausblenden' : 'anzeigen'}
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="space-y-4 pt-4 border-t">
                {/* Type Filter */}
                <div className="space-y-2">
                  <Label>Aktivitätstypen</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(activityTypeConfig).map(([type, config]) => {
                      const Icon = config.icon;
                      return (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={selectedTypes.includes(type as ActivityType)}
                            onCheckedChange={() => toggleType(type as ActivityType)}
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="text-sm flex items-center gap-2 cursor-pointer"
                          >
                            <div className={`h-4 w-4 rounded ${config.bgColor} flex items-center justify-center`}>
                              <Icon className="h-3 w-3 text-white" />
                            </div>
                            {config.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <Label htmlFor="date-filter">Zeitraum</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger id="date-filter" className="max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Heute</SelectItem>
                      <SelectItem value="2">Letzte 2 Tage</SelectItem>
                      <SelectItem value="7">Letzte 7 Tage</SelectItem>
                      <SelectItem value="30">Letzte 30 Tage</SelectItem>
                      <SelectItem value="365">Dieses Jahr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Aktive Filter:</span>
          {selectedTypes.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              {activityTypeConfig[type].label}
              <button onClick={() => toggleType(type)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Suche: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Alle Filter löschen
          </Button>
        </div>
      )}

      {/* Timeline */}
      <div className="max-w-3xl">
        {filteredActivities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="mb-2">
                {hasActiveFilters ? 'Keine Aktivitäten gefunden' : 'Noch keine Aktivitäten protokolliert'}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {hasActiveFilters
                  ? 'Keine Aktivitäten entsprechen den gewählten Filtern'
                  : 'Beginnen Sie mit der Erfassung von Kundenkontakten'}
              </p>
              <Button onClick={hasActiveFilters ? clearFilters : undefined}>
                {hasActiveFilters ? 'Filter zurücksetzen' : 'Erste Aktivität hinzufügen'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {groupedActivities.map((group) => (
              <div key={group.date} className="space-y-3">
                {/* Date Header */}
                <div className="sticky top-0 bg-background z-10 py-2 border-b">
                  <h4 className="text-muted-foreground">{group.date}</h4>
                </div>

                {/* Activities */}
                <div className="space-y-3 relative">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                  {group.activities.map((activity) => (
                    <div key={activity.id} className="relative pl-12">
                      <ActivityCard
                        activity={activity}
                        onEdit={() => toast.info('Bearbeiten-Funktion')}
                        onDelete={() => {
                          setActivities(activities.filter((a) => a.id !== activity.id));
                          toast.success('Aktivität gelöscht');
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline">Weitere Aktivitäten laden</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Activity Type Legend
function ActivityTypeLegend() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Aktivitätstypen</h4>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(activityTypeConfig).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <Card key={type}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{config.label}</h4>
                    <div className={`h-1 w-12 rounded ${config.bgColor} mt-1`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground">
        Jeder Aktivitätstyp hat eine eigene Farbe für schnelle visuelle Identifikation
      </p>
    </div>
  );
}

// Activity Statistics
function ActivityStatistics() {
  const stats = [
    { type: 'phone', count: 45, label: 'Anrufe' },
    { type: 'email', count: 32, label: 'E-Mails' },
    { type: 'meeting', count: 18, label: 'Meetings' },
    { type: 'note', count: 50, label: 'Notizen' },
    { type: 'task', count: 23, label: 'Aufgaben' },
    { type: 'visit', count: 12, label: 'Besuche' },
  ];

  const total = stats.reduce((sum, stat) => sum + stat.count, 0);

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Aktivitätsstatistik</h4>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Diese Woche</CardTitle>
          <CardDescription>Gesamt: {total} Aktivitäten</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.map((stat) => {
            const config = activityTypeConfig[stat.type as ActivityType];
            const Icon = config.icon;
            const percentage = ((stat.count / total) * 100).toFixed(1);

            return (
              <div key={stat.type} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded ${config.bgColor} flex items-center justify-center`}>
                      <Icon className="h-3 w-3 text-white" />
                    </div>
                    <span>{stat.label}</span>
                  </div>
                  <span className="font-medium">
                    {stat.count} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${config.bgColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Aktivitätsverteilung der aktuellen Woche
      </p>
    </div>
  );
}

// Compact Timeline (for customer detail page)
function CompactTimeline() {
  const recentActivities = sampleActivities.slice(0, 3);

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Kompakte Timeline-Ansicht</h4>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Letzte Aktivitäten</CardTitle>
              <CardDescription>3 neueste Einträge</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Alle anzeigen
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivities.map((activity) => {
            const config = activityTypeConfig[activity.type];
            const Icon = config.icon;

            return (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                <div className={`h-8 w-8 rounded-full ${config.bgColor} flex items-center justify-center shrink-0`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium truncate">{activity.title}</h4>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-xs">
                        {activity.userName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{activity.userName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Kompakte Ansicht für Kundendetailseiten oder Dashboard-Widget
      </p>
    </div>
  );
}

export function ActivityTimelineDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Vollständige Aktivitäts-Timeline</CardTitle>
          <CardDescription>
            Chronologische Übersicht aller Kundenkontakte mit Filterung und Suche
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityTimeline />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Aktivitätstypen</CardTitle>
          <CardDescription>
            6 verschiedene Aktivitätstypen mit Farb- und Icon-Kodierung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityTypeLegend />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aktivitätsstatistik</CardTitle>
          <CardDescription>
            Übersicht der Aktivitätsverteilung mit Prozentangaben
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityStatistics />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kompakte Timeline</CardTitle>
          <CardDescription>
            Platzsparende Ansicht für Widgets und Kundendetails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompactTimeline />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Timeline-Layout</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Vertikale Linie links</li>
              <li>• Max. 800px Breite</li>
              <li>• Gruppierung nach Datum</li>
              <li>• Sticky Date-Header</li>
              <li>• Infinite Scroll / Pagination</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Aktivitätskarten</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 4px farbiger linker Rand</li>
              <li>• Icon im farbigen Kreis</li>
              <li>• Titel + Beschreibung</li>
              <li>• Expandierbar (&gt;150 Zeichen)</li>
              <li>• Hover: Mehr-Menü</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Aktivitätstypen</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Anruf (Blau)</li>
              <li>• E-Mail (Grün)</li>
              <li>• Meeting (Lila)</li>
              <li>• Notiz (Grau)</li>
              <li>• Aufgabe (Amber)</li>
              <li>• Besuch (Teal)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Zeitstempel</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Relativ: "Vor 2 Stunden"</li>
              <li>• Absolut: Tooltip</li>
              <li>• Gestern, Heute</li>
              <li>• Deutsche Formatierung</li>
              <li>• &lt;time&gt; Element</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Filter & Suche</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Volltextsuche</li>
              <li>• Typ-Filter (Checkboxen)</li>
              <li>• Datumsbereich</li>
              <li>• Benutzer-Filter</li>
              <li>• Aktive Filter als Chips</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Metadaten</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Benutzer (Avatar + Name)</li>
              <li>• Dauer (Clock Icon)</li>
              <li>• Follow-up (Arrow Icon)</li>
              <li>• Privat (Lock Icon)</li>
              <li>• Kunde & Kontakt</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}