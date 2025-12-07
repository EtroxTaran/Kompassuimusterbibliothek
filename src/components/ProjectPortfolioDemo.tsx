import { useState, useMemo } from 'react';
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
  Activity,
  Check,
  Pause,
  Circle,
  Clock,
  Building2,
  Eye,
  Pencil,
  MoreVertical,
  ArrowUpDown,
  Filter,
  Download,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { useData, Project } from './providers/DataProvider';

// --- Helper Functions and Types (Keep existing helpers) ---

type ProjectStatus = 'new' | 'planning' | 'inProgress' | 'completed' | 'paused' | 'cancelled';

const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string; bgColor: string; icon: any }
> = {
  new: { label: 'Neu', color: 'text-primary', bgColor: 'bg-accent/50', icon: Circle },
  planning: { label: 'In Planung', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: Clock },
  inProgress: { label: 'In Bearbeitung', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Activity },
  completed: { label: 'Abgeschlossen', color: 'text-green-700', bgColor: 'bg-green-100', icon: Check },
  paused: { label: 'Pausiert', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: Pause },
  cancelled: { label: 'Storniert', color: 'text-red-700', bgColor: 'bg-red-100', icon: X },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function isOverdue(endDateString: string): boolean {
  const endDate = new Date(endDateString);
  const now = new Date();
  return endDate < now;
}

function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function calculateElapsedPercentage(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

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
        <div className="absolute top-0 h-full w-0.5 bg-gray-900" style={{ left: `${elapsed}%` }} />
      </div>
      <p className="text-xs text-muted-foreground">
        {calculateDays(startDate, endDate)} Tage
        {overdue && <span className="text-red-500 ml-1">(überfällig)</span>}
      </p>
    </div>
  );
}

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

function ProjectRow({
  project,
  isSelected,
  onToggleSelect,
  onClick
}: {
  project: Project;
  isSelected: boolean;
  onToggleSelect: () => void;
  onClick: () => void;
}) {
  return (
    <TableRow className={isSelected ? 'bg-accent/30' : ''}>
      <TableCell className="w-12">
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </TableCell>
      <TableCell className="font-mono text-sm">
        <button onClick={onClick} className="text-primary hover:underline text-left">
          {project.number}
        </button>
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
              <button onClick={onClick} className="font-medium truncate block max-w-[150px] text-left hover:underline">
                  {project.name}
              </button>
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
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClick}>
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
export function ProjectTableView({ projects, userRole = 'GF', onProjectClick }: { projects: Project[]; userRole?: string, onProjectClick?: (id: string) => void }) {
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
                onClick={() => onProjectClick && onProjectClick(project.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Filter sheet (kept same logic, just needs props if used inside portfolio view)
function FilterSheet() {
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
        {/* ... filter content (abbreviated for size) ... */}
        <div className="py-6 space-y-4">
             <Label>Filteroptionen (Demo)</Label>
             <div className="flex gap-2">
                 <Button className="w-full">Anwenden</Button>
             </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Full portfolio view
export function ProjectPortfolioView({ userRole = 'GF', onProjectClick }: { userRole?: string, onProjectClick?: (id: string) => void }) {
  const { projects } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate KPIs
  const activeProjects = projects.filter((p) => 
    p.status === 'inProgress' || p.status === 'planning'
  ).length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

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
      </div>

      {/* View Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Projekte durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <FilterSheet />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <ProjectTableView projects={filteredProjects} userRole={userRole} onProjectClick={onProjectClick} />
    </div>
  );
}

export function ProjectPortfolioDemo({ onProjectClick }: { onProjectClick?: (id: string) => void }) {
  return <ProjectPortfolioView onProjectClick={onProjectClick} />;
}
