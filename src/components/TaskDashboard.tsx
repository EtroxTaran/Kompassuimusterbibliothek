import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import {
  Plus,
  Filter,
  Search,
  MoreVertical,
  Calendar,
  User,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ListTodo,
  Target,
  Menu,
  Home,
  Briefcase,
  UserCircle,
  ChevronDown,
  X,
} from 'lucide-react';

// Task types
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent' | 'critical';
type TaskStatus = 'open' | 'in_progress' | 'completed' | 'review' | 'blocked';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date | null;
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  project?: string;
  customer?: string;
  isOverdue: boolean;
}

// Mock task data
const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Hofladen Müller wegen Liefertermin anrufen',
    description: 'Kunde möchte Installationstermin für nächsten Monat bestätigen',
    priority: 'high',
    status: 'open',
    dueDate: new Date('2025-02-05'),
    assignee: { id: 'user-1', name: 'Ich', avatar: 'ME' },
    customer: 'Hofladen Müller GmbH',
    isOverdue: false,
  },
  {
    id: 'task-2',
    title: 'Technische Zeichnungen für REWE erstellen',
    description: 'CAD-Zeichnungen für Ladenlayout mit Möbelplatzierung',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: new Date('2025-01-30'),
    assignee: { id: 'user-2', name: 'Anna W.', avatar: 'AW' },
    project: 'P-2024-B023 - REWE München',
    isOverdue: true,
  },
  {
    id: 'task-3',
    title: 'Angebot für Bäckerei Schmidt finalisieren',
    description: 'Finale Preise abstimmen und Angebot versenden',
    priority: 'medium',
    status: 'review',
    dueDate: new Date('2025-02-10'),
    assignee: { id: 'user-1', name: 'Ich', avatar: 'ME' },
    customer: 'Bäckerei Schmidt',
    isOverdue: false,
  },
  {
    id: 'task-4',
    title: 'Materialbeschaffung für Projekt Hofladen',
    description: 'Bestellung bei Lieferanten aufgeben',
    priority: 'high',
    status: 'open',
    dueDate: new Date('2025-02-08'),
    assignee: { id: 'user-3', name: 'Thomas F.', avatar: 'TF' },
    project: 'P-2024-M012 - Hofladen Müller',
    isOverdue: false,
  },
  {
    id: 'task-5',
    title: 'Qualitätskontrolle Möbellieferung',
    description: 'Gelieferte Möbel auf Qualität und Vollständigkeit prüfen',
    priority: 'critical',
    status: 'blocked',
    dueDate: new Date('2025-01-29'),
    assignee: { id: 'user-1', name: 'Ich', avatar: 'ME' },
    project: 'P-2024-B023 - REWE München',
    isOverdue: true,
  },
];

// Get priority badge
function getPriorityBadge(priority: TaskPriority) {
  const styles = {
    low: 'bg-gray-100 text-gray-700 border border-gray-200',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-amber-100 text-amber-800',
    urgent: 'bg-red-100 text-red-800',
    critical: 'bg-red-600 text-white',
  };

  const labels = {
    low: 'Niedrig',
    medium: 'Mittel',
    high: 'Hoch',
    urgent: 'Dringend',
    critical: 'Kritisch',
  };

  return (
    <Badge className={styles[priority]} variant="outline">
      {labels[priority]}
    </Badge>
  );
}

// Get status badge
function getStatusBadge(status: TaskStatus) {
  const styles = {
    open: 'border border-gray-400 text-gray-700 bg-transparent',
    in_progress: 'bg-blue-500 text-white',
    completed: 'bg-green-500 text-white',
    review: 'bg-purple-500 text-white',
    blocked: 'bg-red-500 text-white',
  };

  const labels = {
    open: 'Offen',
    in_progress: 'In Bearbeitung',
    completed: 'Erledigt',
    review: 'Review',
    blocked: 'Blockiert',
  };

  const icons = {
    open: <Circle className="h-3 w-3" />,
    in_progress: <Clock className="h-3 w-3" />,
    completed: <CheckCircle2 className="h-3 w-3" />,
    review: <Target className="h-3 w-3" />,
    blocked: <AlertCircle className="h-3 w-3" />,
  };

  return (
    <Badge className={styles[status]}>
      {icons[status]}
      <span className="ml-1">{labels[status]}</span>
    </Badge>
  );
}

// Get status icon
function getStatusIcon(status: TaskStatus) {
  const icons = {
    open: <Circle className="h-4 w-4 text-gray-500" />,
    in_progress: <Clock className="h-4 w-4 text-blue-500" />,
    completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    review: <Target className="h-4 w-4 text-purple-500" />,
    blocked: <AlertCircle className="h-4 w-4 text-red-500" />,
  };
  return icons[status];
}

// Format date
function formatDate(date: Date | null): string {
  if (!date) return '-';
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Task Card Component
function TaskCard({ task, variant = 'compact' }: { task: Task; variant?: 'compact' | 'expanded' }) {
  return (
    <Card
      className={`hover:shadow-md transition-shadow cursor-pointer ${
        variant === 'compact' ? 'h-[120px]' : ''
      }`}
    >
      <CardContent className="p-3">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {getPriorityBadge(task.priority)}
            <h3 className="truncate flex-1 min-w-0">{task.title}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
              <DropdownMenuItem>Als erledigt markieren</DropdownMenuItem>
              <DropdownMenuItem>Löschen</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Context Row */}
        <div className="flex items-center gap-2 mb-3 text-muted-foreground">
          {task.project ? (
            <>
              <Briefcase className="h-4 w-4" />
              <span className="truncate">{task.project}</span>
            </>
          ) : task.customer ? (
            <>
              <Target className="h-4 w-4" />
              <span className="truncate">{task.customer}</span>
            </>
          ) : null}
        </div>

        {/* Footer Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">{task.assignee.avatar}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">{task.assignee.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div
                className={`flex items-center gap-1 ${
                  task.isOverdue ? 'text-red-600' : 'text-muted-foreground'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
            {getStatusBadge(task.status)}
          </div>
        </div>

        {/* Expanded Content */}
        {variant === 'expanded' && (
          <>
            <Separator className="my-3" />
            <div className="space-y-2">
              <div>
                <p className="text-muted-foreground">{task.description}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Overview Widget
function OverviewWidget({
  icon,
  label,
  count,
  subtitle,
  color = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  subtitle: string;
  color?: 'default' | 'blue' | 'red' | 'orange';
}) {
  const colorStyles = {
    default: 'text-gray-600',
    blue: 'text-blue-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-muted-foreground">{icon}</div>
          <p className="text-muted-foreground uppercase tracking-wide">{label}</p>
        </div>
        <div className={`mb-1 ${colorStyles[color]}`}>{count}</div>
        <p className="text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 text-muted-foreground">{icon}</div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// Desktop Task Dashboard
export function TaskDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>(['open', 'in_progress']);
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>(['high', 'urgent', 'critical']);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<('personal' | 'project')[]>(['personal', 'project']);
  const [selectedDueDateFilter, setSelectedDueDateFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'created' | 'title'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Calculate stats
  const stats = {
    open: mockTasks.filter((t) => t.status === 'open').length,
    inProgress: mockTasks.filter((t) => t.status === 'in_progress').length,
    overdue: mockTasks.filter((t) => t.isOverdue).length,
    thisWeek: mockTasks.filter((t) => {
      if (!t.dueDate) return false;
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return t.dueDate <= weekFromNow;
    }).length,
  };

  // Filter tasks
  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(task.status);
    const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(task.priority);
    
    // Task type filter (personal = no project, project = has project)
    const taskType = task.project ? 'project' : 'personal';
    const matchesTaskType = selectedTaskTypes.length === 0 || selectedTaskTypes.includes(taskType);
    
    // Due date filter
    let matchesDueDate = true;
    if (selectedDueDateFilter.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      const monthFromNow = new Date(today);
      monthFromNow.setMonth(monthFromNow.getMonth() + 1);
      
      matchesDueDate = selectedDueDateFilter.some(filter => {
        if (filter === 'overdue') return task.isOverdue;
        if (filter === 'today') return task.dueDate && task.dueDate >= today && task.dueDate < tomorrow;
        if (filter === 'thisWeek') return task.dueDate && task.dueDate >= today && task.dueDate <= weekFromNow;
        if (filter === 'thisMonth') return task.dueDate && task.dueDate >= today && task.dueDate <= monthFromNow;
        if (filter === 'noDueDate') return !task.dueDate;
        return true;
      });
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTaskType && matchesDueDate;
  });
  
  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = a.dueDate.getTime() - b.dueDate.getTime();
        break;
      case 'priority':
        const priorityOrder = { critical: 0, urgent: 1, high: 2, medium: 3, low: 4 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'created':
        comparison = a.id.localeCompare(b.id); // Using id as proxy for creation time
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Toggle status filter
  const toggleStatus = (status: TaskStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // Toggle priority filter
  const togglePriority = (priority: TaskPriority) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    );
  };
  
  // Toggle task type filter
  const toggleTaskType = (type: 'personal' | 'project') => {
    setSelectedTaskTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };
  
  // Toggle due date filter
  const toggleDueDateFilter = (filter: string) => {
    setSelectedDueDateFilter((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setSelectedTaskTypes([]);
    setSelectedDueDateFilter([]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Meine Aufgaben</h1>
          <p className="text-muted-foreground">Alle Ihre persönlichen und Projekt-Aufgaben</p>
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sortieren..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Fälligkeitsdatum</SelectItem>
              <SelectItem value="priority">Priorität</SelectItem>
              <SelectItem value="created">Erstelldatum</SelectItem>
              <SelectItem value="title">Titel</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Neue Aufgabe
          </Button>
        </div>
      </div>

      {/* Overview Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewWidget
          icon={<Circle className="h-5 w-5" />}
          label="Offen"
          count={stats.open}
          subtitle="Zu erledigende Aufgaben"
          color="default"
        />
        <OverviewWidget
          icon={<Clock className="h-5 w-5" />}
          label="In Bearbeitung"
          count={stats.inProgress}
          subtitle="Aktive Aufgaben"
          color="blue"
        />
        <OverviewWidget
          icon={<AlertCircle className="h-5 w-5" />}
          label="Überfällig"
          count={stats.overdue}
          subtitle={stats.overdue > 0 ? 'Benötigen Aufmerksamkeit' : 'Alles im Plan'}
          color={stats.overdue > 0 ? 'red' : 'default'}
        />
        <OverviewWidget
          icon={<Calendar className="h-5 w-5" />}
          label="Diese Woche"
          count={stats.thisWeek}
          subtitle="Fällig in 7 Tagen"
          color={stats.thisWeek > 10 ? 'orange' : 'default'}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Filter Sidebar */}
        <Card className="h-fit bg-muted/50">
          <CardContent className="p-4 space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <p className="text-muted-foreground uppercase tracking-wide">Suche</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Aufgaben suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Separator />

            {/* Status Filters */}
            <div className="space-y-3">
              <p className="text-muted-foreground uppercase tracking-wide">Status</p>
              <div className="space-y-2">
                {(['open', 'in_progress', 'review', 'blocked'] as TaskStatus[]).map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                    />
                    <label htmlFor={`status-${status}`} className="flex-1 flex items-center justify-between cursor-pointer">
                      <span className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span>
                          {status === 'open' && 'Offen'}
                          {status === 'in_progress' && 'In Bearbeitung'}
                          {status === 'review' && 'Review'}
                          {status === 'blocked' && 'Blockiert'}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        ({mockTasks.filter((t) => t.status === status).length})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Priority Filters */}
            <div className="space-y-3">
              <p className="text-muted-foreground uppercase tracking-wide">Priorität</p>
              <div className="space-y-2">
                {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map((priority) => (
                  <div key={priority} className="flex items-center gap-2">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={selectedPriorities.includes(priority)}
                      onCheckedChange={() => togglePriority(priority)}
                    />
                    <label htmlFor={`priority-${priority}`} className="flex-1 flex items-center justify-between cursor-pointer">
                      <span>
                        {priority === 'low' && 'Niedrig'}
                        {priority === 'medium' && 'Mittel'}
                        {priority === 'high' && 'Hoch'}
                        {priority === 'urgent' && 'Dringend'}
                      </span>
                      <span className="text-muted-foreground">
                        ({mockTasks.filter((t) => t.priority === priority).length})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Task Type Filters */}
            <div className="space-y-3">
              <p className="text-muted-foreground uppercase tracking-wide">Aufgabentyp</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="type-personal"
                    checked={selectedTaskTypes.includes('personal')}
                    onCheckedChange={() => toggleTaskType('personal')}
                  />
                  <label htmlFor="type-personal" className="flex-1 flex items-center justify-between cursor-pointer">
                    <span>Persönliche Aufgaben</span>
                    <span className="text-muted-foreground">
                      ({mockTasks.filter((t) => !t.project).length})
                    </span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="type-project"
                    checked={selectedTaskTypes.includes('project')}
                    onCheckedChange={() => toggleTaskType('project')}
                  />
                  <label htmlFor="type-project" className="flex-1 flex items-center justify-between cursor-pointer">
                    <span>Projekt-Aufgaben</span>
                    <span className="text-muted-foreground">
                      ({mockTasks.filter((t) => t.project).length})
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Due Date Filters */}
            <div className="space-y-3">
              <p className="text-muted-foreground uppercase tracking-wide">Fälligkeitsdatum</p>
              <div className="space-y-2">
                {[
                  { id: 'overdue', label: 'Überfällig' },
                  { id: 'today', label: 'Heute' },
                  { id: 'thisWeek', label: 'Diese Woche' },
                  { id: 'thisMonth', label: 'Dieser Monat' },
                  { id: 'noDueDate', label: 'Kein Fälligkeitsdatum' },
                ].map((filter) => (
                  <div key={filter.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`duedate-${filter.id}`}
                      checked={selectedDueDateFilter.includes(filter.id)}
                      onCheckedChange={() => toggleDueDateFilter(filter.id)}
                    />
                    <label htmlFor={`duedate-${filter.id}`} className="flex-1 cursor-pointer">
                      {filter.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <Button variant="outline" className="w-full" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Filter zurücksetzen
            </Button>
          </CardContent>
        </Card>

        {/* Task List */}
        <div className="space-y-4">
          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {sortedTasks.length} {sortedTasks.length === 1 ? 'Aufgabe' : 'Aufgaben'}
            </p>
            <Select value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Kompakt</SelectItem>
                <SelectItem value="expanded">Erweitert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Cards */}
          {sortedTasks.length === 0 ? (
            <EmptyState
              icon={<ListTodo className="h-16 w-16" />}
              title="Keine Aufgaben gefunden"
              description="Keine Aufgaben entsprechen Ihren aktuellen Filtereinstellungen. Versuchen Sie, Ihre Filter anzupassen."
              actionLabel="Filter zurücksetzen"
              onAction={clearFilters}
            />
          ) : (
            <div className="space-y-3">
              {sortedTasks.map((task) => (
                <TaskCard key={task.id} task={task} variant={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mobile Task Dashboard
export function MobileTaskDashboard() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate stats
  const stats = {
    open: mockTasks.filter((t) => t.status === 'open').length,
    inProgress: mockTasks.filter((t) => t.status === 'in_progress').length,
    overdue: mockTasks.filter((t) => t.isOverdue).length,
    thisWeek: mockTasks.filter((t) => {
      if (!t.dueDate) return false;
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return t.dueDate <= weekFromNow;
    }).length,
  };

  // Group tasks by due date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const tasksToday = mockTasks.filter(
    (t) => t.dueDate && t.dueDate >= today && t.dueDate < tomorrow
  );
  const tasksThisWeek = mockTasks.filter(
    (t) => t.dueDate && t.dueDate >= tomorrow && t.dueDate <= weekFromNow
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Mobile Header */}
      <div className="bg-background border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
          <h2>Meine Aufgaben</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Plus className="h-4 w-4" />
          </Button>
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Filter</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <p className="text-muted-foreground">Filter-Optionen hier...</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Overview Widgets (Horizontal Scroll) */}
      <div className="border-b border-border p-4 overflow-x-auto">
        <div className="flex gap-3 min-w-min">
          <Card className="min-w-[80px] shrink-0">
            <CardContent className="p-3 text-center">
              <div className="text-gray-600 mb-1">{stats.open}</div>
              <p className="text-muted-foreground text-xs">Offen</p>
            </CardContent>
          </Card>
          <Card className="min-w-[80px] shrink-0">
            <CardContent className="p-3 text-center">
              <div className="text-blue-600 mb-1">{stats.inProgress}</div>
              <p className="text-muted-foreground text-xs">Aktiv</p>
            </CardContent>
          </Card>
          <Card className="min-w-[80px] shrink-0">
            <CardContent className="p-3 text-center">
              <div className={`mb-1 ${stats.overdue > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {stats.overdue}
              </div>
              <p className="text-muted-foreground text-xs">Überfällig</p>
            </CardContent>
          </Card>
          <Card className="min-w-[80px] shrink-0">
            <CardContent className="p-3 text-center">
              <div className="text-orange-600 mb-1">{stats.thisWeek}</div>
              <p className="text-muted-foreground text-xs">Diese Woche</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Task List (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {/* Today Section */}
        {tasksToday.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3>Heute ({tasksToday.length})</h3>
            </div>
            <div className="space-y-2">
              {tasksToday.map((task) => (
                <TaskCard key={task.id} task={task} variant="compact" />
              ))}
            </div>
          </div>
        )}

        {/* This Week Section */}
        {tasksThisWeek.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3>Diese Woche ({tasksThisWeek.length})</h3>
            </div>
            <div className="space-y-2">
              {tasksThisWeek.slice(0, 3).map((task) => (
                <TaskCard key={task.id} task={task} variant="compact" />
              ))}
              {tasksThisWeek.length > 3 && (
                <Button variant="ghost" className="w-full">
                  Alle anzeigen
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {tasksToday.length === 0 && tasksThisWeek.length === 0 && (
          <EmptyState
            icon={<CheckCircle2 className="h-16 w-16 text-green-500" />}
            title="Alles erledigt!"
            description="Sie haben alle Ihre Aufgaben abgeschlossen. Großartige Arbeit!"
            actionLabel="Erledigte anzeigen"
            onAction={() => toast.info('Zeige erledigte Aufgaben')}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-border bg-background">
        <div className="flex items-center justify-around p-2">
          <Button
            variant="ghost"
            className={`flex-1 flex-col h-auto py-2 ${
              activeTab === 'tasks' ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('tasks')}
          >
            <ListTodo className="h-5 w-5 mb-1" />
            <span className="text-xs">Aufgaben</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 flex-col h-auto py-2 ${
              activeTab === 'dashboard' ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 flex-col h-auto py-2 ${
              activeTab === 'projects' ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            <Briefcase className="h-5 w-5 mb-1" />
            <span className="text-xs">Projekte</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 flex-col h-auto py-2 ${
              activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <UserCircle className="h-5 w-5 mb-1" />
            <span className="text-xs">Profil</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Demo Component
export function TaskDashboardDemo() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Aufgaben-Dashboard</CardTitle>
          <CardDescription>
            Vollständiges Dashboard für Aufgabenverwaltung mit Übersichts-Widgets, Filter-Sidebar
            und Aufgabenliste
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-3">Ansichtsmodus:</h3>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                onClick={() => setViewMode('desktop')}
              >
                Desktop
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                onClick={() => setViewMode('mobile')}
              >
                Mobile
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3">Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Übersichts-Widgets (Offen, In Bearbeitung, Überfällig, Diese Woche)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Filter-Sidebar mit Status- und Prioritätsfiltern</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Suchfunktion für Aufgaben</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Kompakte und erweiterte Aufgabenkarten-Ansicht</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Mobile Ansicht mit Bottom-Navigation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Gruppierung nach Fälligkeit (Heute, Diese Woche)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Leerzustände mit Call-to-Action</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard View */}
      <div className={viewMode === 'mobile' ? 'max-w-sm mx-auto border border-border rounded-lg overflow-hidden' : ''}>
        {viewMode === 'desktop' ? <TaskDashboard /> : <MobileTaskDashboard />}
      </div>
    </div>
  );
}