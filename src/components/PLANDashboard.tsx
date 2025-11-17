import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import {
  Calendar as CalendarIcon,
  List,
  GanttChart,
  Briefcase,
  Users,
  Target,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  Plus,
  Download,
  Eye,
  Edit,
  UserPlus,
  Bell,
  Filter,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

// Project type
interface Project {
  id: string;
  number: string;
  name: string;
  customerName: string;
  status: 'planning' | 'in_progress' | 'delayed' | 'completed';
  progress: number;
  dueDate: string;
  teamSize: number;
  budgetStatus: 'on_track' | 'warning' | 'over_budget';
  startDate: string;
}

// Team member type
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  thisWeekBooked: number;
  thisWeekTotal: number;
  nextWeekBooked: number;
  nextWeekTotal: number;
}

// Milestone type
interface Milestone {
  id: string;
  date: string;
  projectNumber: string;
  projectName: string;
  name: string;
  owner: string;
  isOverdue: boolean;
}

// Critical delay type
interface CriticalDelay {
  id: string;
  projectNumber: string;
  projectName: string;
  daysDelayed: number;
  impact: string;
  recommendation: string;
  isCritical: boolean;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    number: 'P-2024-B023',
    name: 'REWE München - Ladeneinrichtung',
    customerName: 'REWE München Süd',
    status: 'in_progress',
    progress: 65,
    dueDate: '2025-02-28',
    teamSize: 5,
    budgetStatus: 'on_track',
    startDate: '2024-10-01',
  },
  {
    id: '2',
    number: 'P-2024-M012',
    name: 'Hofladen Müller - Kühlsysteme',
    customerName: 'Hofladen Müller GmbH',
    status: 'in_progress',
    progress: 45,
    dueDate: '2025-01-15',
    teamSize: 3,
    budgetStatus: 'warning',
    startDate: '2024-11-01',
  },
  {
    id: '3',
    number: 'P-2024-K008',
    name: 'Bäckerei Schmidt - Ausstattung',
    customerName: 'Bäckerei Schmidt',
    status: 'delayed',
    progress: 30,
    dueDate: '2024-12-20',
    teamSize: 4,
    budgetStatus: 'over_budget',
    startDate: '2024-10-15',
  },
  {
    id: '4',
    number: 'P-2024-H045',
    name: 'Café Müller - Renovierung',
    customerName: 'Café Müller',
    status: 'in_progress',
    progress: 80,
    dueDate: '2024-12-10',
    teamSize: 2,
    budgetStatus: 'on_track',
    startDate: '2024-09-15',
  },
  {
    id: '5',
    number: 'P-2024-R019',
    name: 'Restaurant Da Vinci - Einrichtung',
    customerName: 'Restaurant Da Vinci',
    status: 'planning',
    progress: 15,
    dueDate: '2025-03-15',
    teamSize: 4,
    budgetStatus: 'on_track',
    startDate: '2024-11-20',
  },
];

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Anna Weber',
    role: 'Planung',
    avatar: 'AW',
    thisWeekBooked: 32,
    thisWeekTotal: 40,
    nextWeekBooked: 24,
    nextWeekTotal: 40,
  },
  {
    id: '2',
    name: 'Michael Schmidt',
    role: 'Montage',
    avatar: 'MS',
    thisWeekBooked: 38,
    thisWeekTotal: 40,
    nextWeekBooked: 40,
    nextWeekTotal: 40,
  },
  {
    id: '3',
    name: 'Sarah Müller',
    role: 'Montage',
    avatar: 'SM',
    thisWeekBooked: 28,
    thisWeekTotal: 40,
    nextWeekBooked: 32,
    nextWeekTotal: 40,
  },
  {
    id: '4',
    name: 'Thomas Fischer',
    role: 'Planung',
    avatar: 'TF',
    thisWeekBooked: 36,
    thisWeekTotal: 40,
    nextWeekBooked: 28,
    nextWeekTotal: 40,
  },
  {
    id: '5',
    name: 'Lisa Wagner',
    role: 'Montage',
    avatar: 'LW',
    thisWeekBooked: 40,
    thisWeekTotal: 40,
    nextWeekBooked: 36,
    nextWeekTotal: 40,
  },
];

const mockMilestones: Milestone[] = [
  {
    id: '1',
    date: '2024-11-18',
    projectNumber: 'P-2024-B023',
    projectName: 'REWE München',
    name: 'Montageabschluss Hauptbereich',
    owner: 'M. Schmidt',
    isOverdue: false,
  },
  {
    id: '2',
    date: '2024-11-15',
    projectNumber: 'P-2024-M012',
    projectName: 'Hofladen Müller',
    name: 'Kühlsysteme Installation',
    owner: 'T. Fischer',
    isOverdue: true,
  },
  {
    id: '3',
    date: '2024-11-20',
    projectNumber: 'P-2024-K008',
    projectName: 'Bäckerei Schmidt',
    name: 'Elektrik fertigstellen',
    owner: 'A. Weber',
    isOverdue: false,
  },
  {
    id: '4',
    date: '2024-11-22',
    projectNumber: 'P-2024-H045',
    projectName: 'Café Müller',
    name: 'Abnahme vorbereiten',
    owner: 'S. Müller',
    isOverdue: false,
  },
  {
    id: '5',
    date: '2024-11-14',
    projectNumber: 'P-2024-R019',
    projectName: 'Restaurant Da Vinci',
    name: 'Planung abschließen',
    owner: 'T. Fischer',
    isOverdue: true,
  },
];

const mockDelays: CriticalDelay[] = [
  {
    id: '1',
    projectNumber: 'P-2024-K008',
    projectName: 'Bäckerei Schmidt - Ausstattung',
    daysDelayed: 12,
    impact: 'Verzögerung bei 3 Folgemeilensteinen',
    recommendation: 'Zusätzliche Ressourcen aus P-2024-H045 umverteilen',
    isCritical: true,
  },
  {
    id: '2',
    projectNumber: 'P-2024-M012',
    projectName: 'Hofladen Müller - Kühlsysteme',
    daysDelayed: 5,
    impact: 'Gefährdet Hauptmeilenstein am 20.11.24',
    recommendation: 'Lieferant kontaktieren für beschleunigte Lieferung',
    isCritical: false,
  },
];

// Team utilization chart data
const teamUtilizationData = mockTeamMembers.map((member) => ({
  name: member.name.split(' ')[0],
  available: member.thisWeekTotal,
  booked: member.thisWeekBooked,
  overbooked: Math.max(0, member.thisWeekBooked - member.thisWeekTotal),
}));

// Capacity forecast (next 4 weeks)
const capacityForecastData = [
  { week: 'KW 46', available: 200, booked: 174, remaining: 26 },
  { week: 'KW 47', available: 200, booked: 160, remaining: 40 },
  { week: 'KW 48', available: 200, booked: 185, remaining: 15 },
  { week: 'KW 49', available: 200, booked: 192, remaining: 8 },
];

// Gantt chart data (simplified timeline view)
const ganttData = mockProjects.map((project) => {
  const start = new Date(project.startDate);
  const end = new Date(project.dueDate);
  const today = new Date();
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const elapsed = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return {
    project: project.number,
    name: project.name,
    start: project.startDate,
    end: project.dueDate,
    duration,
    elapsed: Math.max(0, Math.min(elapsed, duration)),
    status: project.status,
  };
});

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Format short date
function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
  });
}

// Get status badge
function getStatusBadge(status: Project['status']) {
  switch (status) {
    case 'planning':
      return <Badge variant="secondary">Planung</Badge>;
    case 'in_progress':
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400">
          In Arbeit
        </Badge>
      );
    case 'delayed':
      return <Badge variant="destructive">Verzögert</Badge>;
    case 'completed':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
          Abgeschlossen
        </Badge>
      );
  }
}

// Get budget status badge
function getBudgetStatusBadge(status: Project['budgetStatus']) {
  switch (status) {
    case 'on_track':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
          Im Budget
        </Badge>
      );
    case 'warning':
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
          Warnung
        </Badge>
      );
    case 'over_budget':
      return <Badge variant="destructive">Überzogen</Badge>;
  }
}

// Get status color for Gantt
function getStatusColor(status: Project['status']): string {
  switch (status) {
    case 'planning':
      return '#94a3b8';
    case 'in_progress':
      return '#3b82f6';
    case 'delayed':
      return '#ef4444';
    case 'completed':
      return '#10b981';
    default:
      return '#94a3b8';
  }
}

// PLAN Dashboard
export function PLANDashboard() {
  const [view, setView] = useState<'gantt' | 'calendar' | 'list'>('gantt');
  const [dateRange, setDateRange] = useState('week');
  const [statusFilter, setStatusFilter] = useState('all');

  const userName = 'Thomas Fischer';
  const userRole = 'PLAN';

  // KPI calculations
  const activeProjects = mockProjects.length;
  const onScheduleProjects = mockProjects.filter(
    (p) => p.status === 'in_progress' || p.status === 'planning'
  ).length;
  const delayedProjects = mockProjects.filter((p) => p.status === 'delayed').length;
  const onSchedulePercent = Math.round((onScheduleProjects / activeProjects) * 100);

  const totalTeamMembers = mockTeamMembers.length;
  const totalAvailableHours = mockTeamMembers.reduce((sum, m) => sum + m.thisWeekTotal, 0);
  const totalBookedHours = mockTeamMembers.reduce((sum, m) => sum + m.thisWeekBooked, 0);
  const capacityPercent = Math.round((totalBookedHours / totalAvailableHours) * 100);

  const upcomingMilestones = mockMilestones.filter((m) => !m.isOverdue).length;
  const overdueMilestones = mockMilestones.filter((m) => m.isOverdue).length;
  const completedMilestonesWeek = 15;

  const onBudgetProjects = mockProjects.filter((p) => p.budgetStatus === 'on_track').length;
  const warningProjects = mockProjects.filter((p) => p.budgetStatus === 'warning').length;
  const overBudgetProjects = mockProjects.filter((p) => p.budgetStatus === 'over_budget').length;

  const handleNewProject = () => {
    toast.success('Neues Projekt', {
      description: 'Projektformular wird geöffnet...',
    });
  };

  const handleAddMilestone = () => {
    toast.success('Meilenstein hinzufügen', {
      description: 'Meilenstein-Formular wird geöffnet...',
    });
  };

  const handleAssignTeam = (projectNumber: string) => {
    toast.success('Team zuweisen', {
      description: `Team für ${projectNumber} zuweisen...`,
    });
  };

  const handleViewProject = (projectNumber: string) => {
    toast.info('Projekt öffnen', {
      description: projectNumber,
    });
  };

  const handleEditSchedule = (projectNumber: string) => {
    toast.info('Zeitplan bearbeiten', {
      description: projectNumber,
    });
  };

  const handleAssignTask = (memberName: string) => {
    toast.success('Aufgabe zuweisen', {
      description: `Aufgabe an ${memberName} zuweisen...`,
    });
  };

  const handleNotifyGF = (delay: CriticalDelay) => {
    toast.warning('GF benachrichtigt', {
      description: `Kritische Verzögerung bei ${delay.projectNumber}`,
    });
  };

  const handleExportGantt = () => {
    toast.success('Gantt exportieren', {
      description: 'PDF wird erstellt...',
    });
  };

  const handleCapacityReport = () => {
    toast.success('Kapazitätsbericht', {
      description: 'Bericht wird erstellt...',
    });
  };

  const getUtilizationColor = (member: TeamMember): string => {
    const percent = (member.thisWeekBooked / member.thisWeekTotal) * 100;
    if (percent > 100) return 'text-red-600';
    if (percent >= 80) return 'text-amber-600';
    return 'text-green-600';
  };

  const filteredProjects =
    statusFilter === 'all'
      ? mockProjects
      : mockProjects.filter((p) => p.status === statusFilter);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="mb-4">Projektplanung</h1>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 border border-border rounded-lg p-1">
                  <Button
                    variant={view === 'gantt' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setView('gantt')}
                  >
                    <GanttChart className="mr-2 h-4 w-4" />
                    Gantt
                  </Button>
                  <Button
                    variant={view === 'calendar' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setView('calendar')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Kalender
                  </Button>
                  <Button
                    variant={view === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setView('list')}
                  >
                    <List className="mr-2 h-4 w-4" />
                    Liste
                  </Button>
                </div>

                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Diese Woche</SelectItem>
                    <SelectItem value="month">Dieser Monat</SelectItem>
                    <SelectItem value="quarter">Quartal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>TF</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userName}</p>
                <p className="text-muted-foreground">({userRole})</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Projects */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Aktive Projekte</p>
                <p className="text-4xl font-bold text-primary mb-2">{activeProjects}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                    <span className="text-green-600">
                      {onScheduleProjects} ({onSchedulePercent}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-600" />
                    <span className="text-red-600">{delayedProjects}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capacity */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Kapazität (diese Woche)</p>
                <p className="text-muted-foreground mb-2">{totalTeamMembers} Mitarbeiter</p>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Verfügbar: {totalAvailableHours} Std</p>
                  <p className="text-amber-600 font-semibold">
                    Gebucht: {totalBookedHours} Std ({capacityPercent}%)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Meilensteine (diese Woche)</p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{upcomingMilestones}</p>
                    <p className="text-muted-foreground text-xs">Anstehend</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{overdueMilestones}</p>
                    <p className="text-muted-foreground text-xs">Überfällig</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {completedMilestonesWeek}
                    </p>
                    <p className="text-muted-foreground text-xs">Erledigt</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Status */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Budget-Status</p>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-green-600">Im Rahmen:</span>
                    <span className="font-bold">{onBudgetProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-600">Warnung:</span>
                    <span className="font-bold">{warningProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-600">Überzogen:</span>
                    <span className="font-bold">{overBudgetProjects}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gantt Chart View */}
          {view === 'gantt' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GanttChart className="h-5 w-5" />
                      Projektzeitplan
                    </CardTitle>
                    <CardDescription>Gantt-Ansicht aller aktiven Projekte</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExportGantt}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportieren
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ganttData.map((item) => (
                    <div key={item.project}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium font-mono">{item.project}</p>
                          <p className="text-muted-foreground">{item.name}</p>
                        </div>
                        <div className="text-muted-foreground">
                          {formatShortDate(item.start)} - {formatShortDate(item.end)}
                        </div>
                      </div>
                      <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 rounded-lg flex items-center justify-center transition-all"
                          style={{
                            width: `${(item.elapsed / item.duration) * 100}%`,
                            backgroundColor: getStatusColor(item.status),
                          }}
                        >
                          <span className="text-white text-xs font-semibold">
                            {Math.round((item.elapsed / item.duration) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resource Planning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Utilization */}
            <Card>
              <CardHeader>
                <CardTitle>Team-Auslastung</CardTitle>
                <CardDescription>Aktuelle Woche</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={teamUtilizationData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine x={40} stroke="#94a3b8" strokeDasharray="3 3" label="100%" />
                    <Bar dataKey="booked" stackId="a" fill="#3b82f6" name="Gebucht" />
                    <Bar dataKey="overbooked" stackId="a" fill="#ef4444" name="Überlastet" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Capacity Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>Kapazitätsvorhersage</CardTitle>
                <CardDescription>Nächste 4 Wochen</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={capacityForecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="available"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      name="Verfügbar"
                    />
                    <Area
                      type="monotone"
                      dataKey="booked"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                      name="Gebucht"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Project Priorities Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Projekt-Prioritäten</CardTitle>
                  <CardDescription>{filteredProjects.length} Projekte</CardDescription>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="planning">Planung</SelectItem>
                    <SelectItem value="in_progress">In Arbeit</SelectItem>
                    <SelectItem value="delayed">Verzögert</SelectItem>
                    <SelectItem value="completed">Abgeschlossen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left">Projekt</th>
                      <th className="px-4 py-3 text-left">Kunde</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Fortschritt</th>
                      <th className="px-4 py-3 text-left">Fälligkeit</th>
                      <th className="px-4 py-3 text-center">Team</th>
                      <th className="px-4 py-3 text-center">Budget</th>
                      <th className="px-4 py-3 text-right">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        className="border-b border-border hover:bg-accent cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <p className="font-mono font-semibold">{project.number}</p>
                          <p className="text-muted-foreground">{project.name}</p>
                        </td>
                        <td className="px-4 py-3">{project.customerName}</td>
                        <td className="px-4 py-3 text-center">{getStatusBadge(project.status)}</td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <Progress value={project.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground text-center">
                              {project.progress}%
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">{formatDate(project.dueDate)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="outline">{project.teamSize} Pers.</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {getBudgetStatusBadge(project.budgetStatus)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewProject(project.number)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditSchedule(project.number)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAssignTeam(project.number)}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Milestones & Team Availability */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Anstehende Meilensteine
                </CardTitle>
                <CardDescription>Nächste 14 Tage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMilestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className={`p-3 border border-border rounded-lg hover:bg-accent transition-colors ${
                        milestone.isOverdue
                          ? 'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-900'
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-semibold">
                              {milestone.projectNumber}
                            </span>
                            {milestone.isOverdue && <Badge variant="destructive">Überfällig</Badge>}
                          </div>
                          <p className="font-medium">{milestone.name}</p>
                          <p className="text-muted-foreground">{milestone.projectName}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatShortDate(milestone.date)}</span>
                        </div>
                        <span className="text-muted-foreground">{milestone.owner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Team-Verfügbarkeit</CardTitle>
                <CardDescription>Übersicht für aktuelle und nächste Woche</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-muted-foreground">{member.role}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAssignTask(member.name)}
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Zuweisen
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-muted-foreground">Diese Woche:</span>
                                <span className={getUtilizationColor(member)}>
                                  {member.thisWeekBooked}/{member.thisWeekTotal} Std (
                                  {Math.round(
                                    (member.thisWeekBooked / member.thisWeekTotal) * 100
                                  )}
                                  %)
                                </span>
                              </div>
                              <Progress
                                value={(member.thisWeekBooked / member.thisWeekTotal) * 100}
                                className="h-2"
                              />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-muted-foreground">Nächste Woche:</span>
                                <span className="text-muted-foreground">
                                  {member.nextWeekBooked}/{member.nextWeekTotal} Std (
                                  {Math.round(
                                    (member.nextWeekBooked / member.nextWeekTotal) * 100
                                  )}
                                  %)
                                </span>
                              </div>
                              <Progress
                                value={(member.nextWeekBooked / member.nextWeekTotal) * 100}
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Delays */}
          {mockDelays.length > 0 && (
            <Card className="border-2 border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Kritische Pfade & Verzögerungen
                </CardTitle>
                <CardDescription>
                  {mockDelays.length} Projekte mit Verzögerungen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDelays.map((delay) => (
                    <Alert
                      key={delay.id}
                      variant={delay.isCritical ? 'destructive' : 'default'}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        <span>
                          {delay.projectNumber} - {delay.projectName}
                        </span>
                        <Badge variant={delay.isCritical ? 'destructive' : 'default'}>
                          {delay.daysDelayed} Tage verzögert
                        </Badge>
                      </AlertTitle>
                      <AlertDescription>
                        <div className="space-y-2 mt-2">
                          <div>
                            <p className="font-medium">Impact:</p>
                            <p className="text-muted-foreground">{delay.impact}</p>
                          </div>
                          <div>
                            <p className="font-medium">Empfehlung:</p>
                            <p className="text-muted-foreground">{delay.recommendation}</p>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProject(delay.projectNumber)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Details
                            </Button>
                            {delay.isCritical && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleNotifyGF(delay)}
                              >
                                <Bell className="mr-2 h-4 w-4" />
                                GF benachrichtigen
                              </Button>
                            )}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="lg" className="h-14 w-14 rounded-full shadow-lg" onClick={handleNewProject}>
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Quick Actions Sidebar (Desktop) */}
      <div className="hidden lg:block fixed left-6 bottom-6 z-40">
        <Card className="w-64">
          <CardHeader>
            <CardTitle>Schnellaktionen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={handleNewProject}>
              <Plus className="mr-2 h-4 w-4" />
              Neues Projekt
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleAddMilestone}
            >
              <Target className="mr-2 h-4 w-4" />
              Meilenstein hinzufügen
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAssignTeam('Projekt')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Team zuweisen
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleCapacityReport}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Kapazitätsbericht
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportGantt}
            >
              <Download className="mr-2 h-4 w-4" />
              Gantt exportieren
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Demo wrapper
export function PLANDashboardDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>PLAN Dashboard (Projektplanung)</CardTitle>
          <CardDescription>
            Planungsdashboard mit Projektzeitplan, Ressourcenallokation, Kapazitätsplanung und
            Meilenstein-Tracking
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator />

      <PLANDashboard />
    </div>
  );
}