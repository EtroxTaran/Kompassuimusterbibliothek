import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  Percent,
  AlertCircle,
  Search,
  Filter,
  LayoutGrid,
  LayoutList,
  Calendar,
  Download,
  Plus,
  Eye,
  Pencil,
  MoreVertical,
  Building2,
  Circle,
  Clock,
  Activity,
  Check,
  Pause,
  X,
  ArrowUpDown,
  ChevronDown,
} from 'lucide-react';

// Project status type
type ProjectStatus = 'new' | 'planning' | 'inProgress' | 'completed' | 'paused' | 'cancelled';

// Project interface
interface Project {
  id: string;
  number: string;
  customer: string;
  customerLocation: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  milestones: { completed: number; total: number };
  startDate: string;
  endDate: string;
  budget: number;
  actualCost?: number;
  margin?: number;
  manager: {
    name: string;
    initials: string;
  };
  teamSize: number;
}

// Status configuration
const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string; bgColor: string; icon: any }
> = {
  new: {
    label: 'Neu',
    color: 'text-primary',
    bgColor: 'bg-accent/50',
    icon: Circle,
  },
  planning: {
    label: 'In Planung',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: Clock,
  },
  inProgress: {
    label: 'In Bearbeitung',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    icon: Activity,
  },
  completed: {
    label: 'Abgeschlossen',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: Check,
  },
  paused: {
    label: 'Pausiert',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: Pause,
  },
  cancelled: {
    label: 'Storniert',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: X,
  },
};

// Sample projects
const sampleProjects: Project[] = [
  {
    id: '1',
    number: 'P-2024-B023',
    customer: 'REWE München Süd',
    customerLocation: 'München',
    name: 'Ladeneinrichtung Neueröffnung',
    status: 'inProgress',
    progress: 65,
    milestones: { completed: 12, total: 18 },
    startDate: '2024-12-01',
    endDate: '2025-02-28',
    budget: 450000,
    actualCost: 290000,
    margin: 15.6,
    manager: { name: 'Thomas Fischer', initials: 'TF' },
    teamSize: 5,
  },
  {
    id: '2',
    number: 'P-2024-A015',
    customer: 'Hofladen Müller GmbH',
    customerLocation: 'Augsburg',
    name: 'Renovierung Verkaufsfläche',
    status: 'completed',
    progress: 100,
    milestones: { completed: 8, total: 8 },
    startDate: '2024-09-01',
    endDate: '2024-10-30',
    budget: 85000,
    actualCost: 82000,
    margin: 18.2,
    manager: { name: 'Michael Schmidt', initials: 'MS' },
    teamSize: 3,
  },
  {
    id: '3',
    number: 'P-2024-C042',
    customer: 'Biomarkt Heidelberg',
    customerLocation: 'Heidelberg',
    name: 'Neubau Filiale',
    status: 'planning',
    progress: 15,
    milestones: { completed: 3, total: 20 },
    startDate: '2025-02-01',
    endDate: '2025-06-30',
    budget: 680000,
    margin: 12.5,
    manager: { name: 'Anna Weber', initials: 'AW' },
    teamSize: 8,
  },
  {
    id: '4',
    number: 'P-2024-D008',
    customer: 'Edeka Stuttgart',
    customerLocation: 'Stuttgart',
    name: 'Kühlregale Modernisierung',
    status: 'inProgress',
    progress: 42,
    milestones: { completed: 5, total: 12 },
    startDate: '2024-11-15',
    endDate: '2025-01-31',
    budget: 220000,
    actualCost: 95000,
    margin: 14.8,
    manager: { name: 'Thomas Fischer', initials: 'TF' },
    teamSize: 4,
  },
  {
    id: '5',
    number: 'P-2024-E019',
    customer: 'Kaisers Frankfurt',
    customerLocation: 'Frankfurt',
    name: 'Beleuchtung LED Umstellung',
    status: 'new',
    progress: 5,
    milestones: { completed: 0, total: 6 },
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    budget: 125000,
    manager: { name: 'Sarah Weber', initials: 'SW' },
    teamSize: 2,
  },
  {
    id: '6',
    number: 'P-2023-Z042',
    customer: 'Alnatura Berlin',
    customerLocation: 'Berlin',
    name: 'Gesamtkonzept Bio-Abteilung',
    status: 'cancelled',
    progress: 28,
    milestones: { completed: 4, total: 15 },
    startDate: '2024-08-01',
    endDate: '2024-11-30',
    budget: 180000,
    actualCost: 52000,
    margin: -8.5,
    manager: { name: 'Michael Schmidt', initials: 'MS' },
    teamSize: 3,
  },
];

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

// Check if overdue
function isOverdue(endDateString: string): boolean {
  const endDate = new Date(endDateString);
  const now = new Date();
  return endDate < now;
}

// Calculate days
function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

// Calculate elapsed percentage
function calculateElapsedPercentage(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

// Project status badge
function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={`${config.bgColor} ${config.color} gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

// Progress bar with milestones
function ProjectProgress({ progress, milestones }: { progress: number; milestones: { completed: number; total: number } }) {
  const color = progress >= 70 ? 'bg-green-600' : progress >= 30 ? 'bg-primary' : 'bg-gray-400';

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-10">{progress}%</span>
        <div className="flex-1">
          <Progress value={progress} className="h-2" indicatorClassName={color} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {milestones.completed} / {milestones.total} Meilensteine
      </p>
    </div>
  );
}

// Timeline visualization
function TimelineBar({ startDate, endDate }: { startDate: string; endDate: string }) {
  const elapsed = calculateElapsedPercentage(startDate, endDate);
  const overdue = isOverdue(endDate);

  return (
    <div className="space-y-1">
      <p className="text-sm">
        {formatDate(startDate)} - {formatDate(endDate)}
      </p>
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full ${overdue ? 'bg-red-500' : 'bg-primary'}`}
          style={{ width: `${elapsed}%` }}
        />
        {/* Today marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-gray-900"
          style={{ left: `${elapsed}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {calculateDays(startDate, endDate)} Tage
        {overdue && <span className="text-red-500 ml-1">(überfällig)</span>}
      </p>
    </div>
  );
}

// Budget cell with margin indicator
function BudgetCell({ budget, margin }: { budget: number; margin?: number }) {
  const hasMargin = margin !== undefined;
  const isPositive = margin && margin > 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <span className="font-medium">{formatCurrency(budget)}</span>
        {hasMargin && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>Marge: {margin && margin > 0 ? '+' : ''}{margin?.toFixed(1)}%</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

// Manager cell
function ManagerCell({ manager, teamSize }: { manager: { name: string; initials: string }; teamSize: number }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-7 w-7">
        <AvatarFallback className="text-xs bg-primary/10">{manager.initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">{manager.name}</p>
        <p className="text-xs text-muted-foreground">{teamSize} Mitarbeiter</p>
      </div>
    </div>
  );
}

// Project row
function ProjectRow({
  project,
  isSelected,
  onToggleSelect,
}: {
  project: Project;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  return (
    <TableRow className={isSelected ? 'bg-accent/30' : ''}>
      <TableCell className="w-12">
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </TableCell>
      <TableCell className="font-mono text-sm">
        <a href="#" className="text-primary hover:underline">
          {project.number}
        </a>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{project.customer}</span>
          </div>
          <p className="text-xs text-muted-foreground">{project.customerLocation}</p>
        </div>
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-medium truncate block max-w-[150px]">{project.name}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{project.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <ProjectStatusBadge status={project.status} />
      </TableCell>
      <TableCell className="min-w-[150px]">
        <ProjectProgress progress={project.progress} milestones={project.milestones} />
      </TableCell>
      <TableCell className="min-w-[180px]">
        <TimelineBar startDate={project.startDate} endDate={project.endDate} />
      </TableCell>
      <TableCell>
        <BudgetCell budget={project.budget} margin={project.margin} />
      </TableCell>
      <TableCell>
        <ManagerCell manager={project.manager} teamSize={project.teamSize} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Zeiterfassung</DropdownMenuItem>
              <DropdownMenuItem>Bericht erstellen</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Archivieren</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Löschen</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Table view
function ProjectTableView({ projects, userRole = 'GF' }: { projects: Project[]; userRole?: string }) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedProjects.includes(id)) {
      setSelectedProjects(selectedProjects.filter((pId) => pId !== id));
    } else {
      setSelectedProjects([...selectedProjects, id]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Bulk actions */}
      {selectedProjects.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-accent/50 border-2 border-primary rounded-lg">
          <p className="text-sm font-medium">{selectedProjects.length} ausgewählt</p>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" size="sm">
            Status ändern
          </Button>
          <Button variant="outline" size="sm">
            Projektleiter zuweisen
          </Button>
          <Button variant="outline" size="sm">
            Berichte erstellen
          </Button>
          <Button variant="outline" size="sm">
            Exportieren
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProjects.length === projects.length && projects.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[120px]">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  Projektnr.
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[200px]">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  Kunde
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">Projektname</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[150px]">Fortschritt</TableHead>
              <TableHead className="w-[180px]">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  Zeitplan
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  Budget
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">Projektleiter</TableHead>
              <TableHead className="w-[80px]">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                isSelected={selectedProjects.includes(project.id)}
                onToggleSelect={() => toggleSelect(project.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Board view (Kanban style)
function ProjectBoardView({ projects }: { projects: Project[] }) {
  const statuses: ProjectStatus[] = ['new', 'planning', 'inProgress', 'completed', 'paused', 'cancelled'];

  const projectsByStatus = statuses.reduce(
    (acc, status) => {
      acc[status] = projects.filter((p) => p.status === status);
      return acc;
    },
    {} as Record<ProjectStatus, Project[]>
  );

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4" style={{ minWidth: 'fit-content' }}>
        {statuses.map((status) => {
          const config = statusConfig[status];
          const Icon = config.icon;
          const statusProjects = projectsByStatus[status];

          return (
            <div key={status} className="bg-white rounded-lg border shrink-0" style={{ width: '320px' }}>
              {/* Column header */}
              <div className={`${config.bgColor} rounded-t-lg p-4 border-b`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <h4 className="font-medium">{config.label}</h4>
                  <Badge variant="secondary">{statusProjects.length}</Badge>
                </div>
              </div>

              {/* Cards */}
              <div className="p-4 space-y-3" style={{ minHeight: '400px' }}>
                {statusProjects.map((project) => (
                  <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-1">
                        <p className="font-mono text-xs text-muted-foreground">{project.number}</p>
                        <h4 className="line-clamp-2">{project.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{project.customer}</span>
                        </div>
                      </div>

                      <ProjectProgress progress={project.progress} milestones={project.milestones} />

                      <div className="text-xs text-muted-foreground">
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="font-medium text-sm">{formatCurrency(project.budget)}</span>
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary/10">
                            {project.manager.initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {statusProjects.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    Keine Projekte
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Filter sheet
function FilterSheet({ projects }: { projects: Project[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
          <SheetDescription>Projekte nach Kriterien filtern</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Status */}
          <div className="space-y-3">
            <Label>Status</Label>
            <div className="space-y-2">
              {Object.entries(statusConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox id={`status-${key}`} />
                  <label htmlFor={`status-${key}`} className="text-sm cursor-pointer">
                    {config.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Project manager */}
          <div className="space-y-2">
            <Label htmlFor="manager">Projektleiter</Label>
            <Select>
              <SelectTrigger id="manager">
                <SelectValue placeholder="Alle Projektleiter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="tf">Thomas Fischer</SelectItem>
                <SelectItem value="ms">Michael Schmidt</SelectItem>
                <SelectItem value="aw">Anna Weber</SelectItem>
                <SelectItem value="sw">Sarah Weber</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Date range */}
          <div className="space-y-2">
            <Label>Zeitraum</Label>
            <div className="grid gap-2">
              <Input type="date" placeholder="Von" />
              <Input type="date" placeholder="Bis" />
            </div>
          </div>

          <Separator />

          {/* Budget range */}
          <div className="space-y-2">
            <Label>Budget</Label>
            <div className="grid gap-2">
              <Input type="number" placeholder="Min. €" />
              <Input type="number" placeholder="Max. €" />
            </div>
          </div>

          <Separator />

          {/* Team size */}
          <div className="space-y-2">
            <Label>Team-Größe</Label>
            <div className="grid gap-2">
              <Input type="number" placeholder="Min. Mitarbeiter" />
              <Input type="number" placeholder="Max. Mitarbeiter" />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1">
              Zurücksetzen
            </Button>
            <Button className="flex-1">Anwenden</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Empty state
function EmptyState() {
  return (
    <div className="border rounded-lg p-12 text-center">
      <Briefcase className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
      <h3 className="mb-2">Noch keine Projekte vorhanden</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Projekte werden aus gewonnenen Opportunities erstellt
      </p>
      <div className="flex items-center gap-2 justify-center">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Projekt erstellen
        </Button>
        <Button variant="outline">Offene Opportunities anzeigen</Button>
      </div>
    </div>
  );
}

// Full portfolio view
function ProjectPortfolioView({ userRole = 'GF' }: { userRole?: string }) {
  const [viewMode, setViewMode] = useState<'table' | 'board' | 'timeline'>('table');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = sampleProjects;

  // Calculate KPIs
  const activeProjects = projects.filter((p) => 
    p.status === 'inProgress' || p.status === 'planning'
  ).length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const avgMargin = projects
    .filter((p) => p.margin !== undefined)
    .reduce((sum, p, _, arr) => sum + (p.margin || 0) / arr.length, 0);
  const overdueProjects = projects.filter((p) => 
    isOverdue(p.endDate) && p.status !== 'completed' && p.status !== 'cancelled'
  ).length;

  // Filter projects
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Dashboard &gt; Projekte</p>
          <div className="flex items-center gap-2">
            <h2>Projekte</h2>
            <Badge variant="secondary">{projects.length}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Neues Projekt
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                Aktive Projekte
              </div>
              <h2>{activeProjects}</h2>
              <p className="text-xs text-muted-foreground">In Planung + In Bearbeitung</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Gesamtbudget
              </div>
              <h2>{formatCurrency(totalBudget)}</h2>
              <p className="text-xs text-muted-foreground">Alle Projekte</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Percent className="h-4 w-4" />
                Durchschn. Marge
              </div>
              <h2 className="text-green-700">+{avgMargin.toFixed(1)}%</h2>
              <p className="text-xs text-muted-foreground">Abgeschlossene Projekte</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                Überfällige
              </div>
              <h2 className="text-red-700">{overdueProjects}</h2>
              <p className="text-xs text-muted-foreground">Nach Enddatum</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Projekte durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <FilterSheet projects={projects} />
        </div>

        <div className="flex items-center gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="gap-2"
          >
            <LayoutList className="h-4 w-4" />
            Tabelle
          </Button>
          <Button
            variant={viewMode === 'board' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('board')}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Board
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('timeline')}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Timeline
          </Button>
        </div>
      </div>

      {/* Content */}
      {filteredProjects.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {viewMode === 'table' && <ProjectTableView projects={filteredProjects} userRole={userRole} />}
          {viewMode === 'board' && <ProjectBoardView projects={filteredProjects} />}
          {viewMode === 'timeline' && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-12">
                  Timeline-Ansicht (Gantt-Chart) würde hier implementiert werden
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// Demo component
export function ProjectPortfolioDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Vollständiges Projektportfolio</CardTitle>
          <CardDescription>
            Übersicht aller Projekte mit KPIs, Status, Fortschritt, Timeline, Budget und Team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectPortfolioView userRole="GF" />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Ansichten</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Tabelle (Standard, 10 Spalten)</li>
              <li>• Board (Kanban, nach Status)</li>
              <li>• Timeline (Gantt-Chart)</li>
              <li>• Toggle-Buttons oben rechts</li>
              <li>• Präferenz wird gespeichert</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Tabellenspalten</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Checkbox (Mehrfachauswahl)</li>
              <li>• Projektnr. (Monospace, Link)</li>
              <li>• Kunde (Icon, Name, Ort)</li>
              <li>• Projektname (Truncate)</li>
              <li>• Status (Farbiges Badge)</li>
              <li>• Fortschritt (%, Bar, Meilensteine)</li>
              <li>• Zeitplan (Daten, Visualisierung)</li>
              <li>• Budget (€, Marge-Indikator)</li>
              <li>• Projektleiter (Avatar, Team)</li>
              <li>• Aktionen (Eye, Edit, Menu)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Status-Badges</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Neu (Blau, Circle)</li>
              <li>• In Planung (Lila, Clock)</li>
              <li>• In Bearbeitung (Amber, Activity)</li>
              <li>• Abgeschlossen (Grün, Check)</li>
              <li>• Pausiert (Grau, Pause)</li>
              <li>• Storniert (Rot, X)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Fortschrittsanzeige</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Prozent links (fett)</li>
              <li>• Progress Bar horizontal</li>
              <li>• Farbe: Grau/Blau/Grün</li>
              <li>• Meilensteine darunter</li>
              <li>• Tooltip bei Hover</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Timeline-Visualisierung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Datumbereich oben</li>
              <li>• Horizontale Bar (grau)</li>
              <li>• Elapsed Time (blau)</li>
              <li>• Heute-Marker (schwarz)</li>
              <li>• Überfällig: Rot</li>
              <li>• Tage-Anzahl unten</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">KPI-Karten</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Aktive Projekte (Briefcase)</li>
              <li>• Gesamtbudget (TrendingUp)</li>
              <li>• Durchschn. Marge (Percent)</li>
              <li>• Überfällige (AlertCircle, rot)</li>
              <li>• Icon + Label + Wert + Kontext</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}