import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { toast } from 'sonner@2.0.3';
import {
  Plus,
  Building2,
  Calendar,
  Circle,
  Search,
  FileText,
  Handshake,
  CheckCircle2,
  XCircle,
  MoreVertical,
  TrendingUp,
  Target,
  Percent,
  LayoutDashboard,
  List as ListIcon,
  AlertCircle,
  X,
  GripVertical,
} from 'lucide-react';

// Opportunity status
type OpportunityStatus = 'new' | 'qualifying' | 'proposal' | 'negotiation' | 'won' | 'lost';

interface Opportunity {
  id: string;
  title: string;
  customer: string;
  value: number;
  probability: number; // 0-100
  expectedCloseDate: string; // ISO date
  owner: {
    name: string;
    initials: string;
  };
  tags?: string[];
  lastActivity?: string;
  status: OpportunityStatus;
}

// Status config
const statusConfig: Record<
  OpportunityStatus,
  { label: string; color: string; bgColor: string; headerBg: string; icon: any }
> = {
  new: {
    label: 'Neu',
    color: 'text-primary',
    bgColor: 'bg-accent/30',
    headerBg: 'bg-accent/60',
    icon: Circle,
  },
  qualifying: {
    label: 'Qualifizierung',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    headerBg: 'bg-purple-100',
    icon: Search,
  },
  proposal: {
    label: 'Angebot erstellt',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    headerBg: 'bg-amber-100',
    icon: FileText,
  },
  negotiation: {
    label: 'Verhandlung',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    headerBg: 'bg-orange-100',
    icon: Handshake,
  },
  won: {
    label: 'Gewonnen',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    headerBg: 'bg-green-100',
    icon: CheckCircle2,
  },
  lost: {
    label: 'Verloren',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    headerBg: 'bg-red-100',
    icon: XCircle,
  },
};

// Sample opportunities
const sampleOpportunities: Opportunity[] = [
  // New
  {
    id: '1',
    title: 'Ladeneinrichtung Neueröffnung',
    customer: 'REWE München Süd',
    value: 125000,
    probability: 10,
    expectedCloseDate: '2025-02-15',
    owner: { name: 'Michael Schmidt', initials: 'MS' },
    tags: ['Großprojekt', 'Q1'],
    lastActivity: 'Vor 2 Tagen',
    status: 'new',
  },
  {
    id: '2',
    title: 'Kühlregale Modernisierung',
    customer: 'Edeka Hamburg',
    value: 85000,
    probability: 10,
    expectedCloseDate: '2025-03-01',
    owner: { name: 'Sarah Weber', initials: 'SW' },
    lastActivity: 'Vor 5 Tagen',
    status: 'new',
  },
  // Qualifying
  {
    id: '3',
    title: 'Bio-Abteilung Komplettausstattung',
    customer: 'Biomarkt Heidelberg',
    value: 95000,
    probability: 30,
    expectedCloseDate: '2025-01-20',
    owner: { name: 'Thomas Müller', initials: 'TM' },
    tags: ['Bio', 'Zeitkritisch'],
    lastActivity: 'Gestern',
    status: 'qualifying',
  },
  {
    id: '4',
    title: 'Regalsystem Erweiterung',
    customer: 'Kaisers Frankfurt',
    value: 42000,
    probability: 30,
    expectedCloseDate: '2025-02-28',
    owner: { name: 'Michael Schmidt', initials: 'MS' },
    lastActivity: 'Vor 3 Tagen',
    status: 'qualifying',
  },
  // Proposal
  {
    id: '5',
    title: 'Kassensystem Integration',
    customer: 'Alnatura Berlin',
    value: 78000,
    probability: 60,
    expectedCloseDate: '2025-01-10',
    owner: { name: 'Sarah Weber', initials: 'SW' },
    tags: ['Tech', 'Q4'],
    lastActivity: 'Heute',
    status: 'proposal',
  },
  {
    id: '6',
    title: 'Beleuchtung LED Umstellung',
    customer: 'Hofladen Müller',
    value: 35000,
    probability: 60,
    expectedCloseDate: '2025-01-15',
    owner: { name: 'Thomas Müller', initials: 'TM' },
    lastActivity: 'Vor 1 Tag',
    status: 'proposal',
  },
  // Negotiation
  {
    id: '7',
    title: 'Gesamtkonzept Filiale',
    customer: 'REWE Köln',
    value: 185000,
    probability: 80,
    expectedCloseDate: '2024-12-20',
    owner: { name: 'Michael Schmidt', initials: 'MS' },
    tags: ['Großprojekt', 'Zeitkritisch'],
    lastActivity: 'Heute',
    status: 'negotiation',
  },
  {
    id: '8',
    title: 'Möbel Café-Bereich',
    customer: 'Edeka Stuttgart',
    value: 52000,
    probability: 80,
    expectedCloseDate: '2024-12-28',
    owner: { name: 'Sarah Weber', initials: 'SW' },
    lastActivity: 'Vor 2 Stunden',
    status: 'negotiation',
  },
  // Won
  {
    id: '9',
    title: 'Obst & Gemüse Displays',
    customer: 'Biomarkt München',
    value: 68000,
    probability: 100,
    expectedCloseDate: '2024-11-30',
    owner: { name: 'Thomas Müller', initials: 'TM' },
    tags: ['Bio'],
    lastActivity: 'Abgeschlossen',
    status: 'won',
  },
  // Lost
  {
    id: '10',
    title: 'Bäckerei-Ausstattung',
    customer: 'Kaisers München',
    value: 45000,
    probability: 0,
    expectedCloseDate: '2024-11-15',
    owner: { name: 'Michael Schmidt', initials: 'MS' },
    lastActivity: 'Verloren: Preis',
    status: 'lost',
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
  return date.toLocaleDateString('de-DE');
}

// Check if overdue
function isOverdue(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
}

// Circular probability indicator
function ProbabilityCircle({ probability }: { probability: number }) {
  const color =
    probability >= 80
      ? 'text-green-600'
      : probability >= 60
        ? 'text-primary'
        : probability >= 30
          ? 'text-amber-600'
          : 'text-gray-500';

  return (
    <div className="relative h-12 w-12">
      <svg className="h-12 w-12 -rotate-90 transform">
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 20}`}
          strokeDashoffset={`${2 * Math.PI * 20 * (1 - probability / 100)}`}
          className={color}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-medium ${color}`}>{probability}%</span>
      </div>
    </div>
  );
}

// Opportunity card
function OpportunityCard({
  opportunity,
  isDragging = false,
  onDragStart,
  onDragEnd,
}: {
  opportunity: Opportunity;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  const overdue = isOverdue(opportunity.expectedCloseDate);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-white border border-border rounded-md p-4 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-primary/50 transition-all ${
        isDragging ? 'opacity-50 rotate-2' : ''
      }`}
    >
      {/* Drag handle */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm font-medium text-muted-foreground truncate">
                    {opportunity.customer}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{opportunity.customer}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Title */}
      <h4 className="mb-3 line-clamp-2 min-h-[2.5rem]">{opportunity.title}</h4>

      {/* Value & Probability */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-primary font-bold text-lg">{formatCurrency(opportunity.value)}</div>
        <ProbabilityCircle probability={opportunity.probability} />
      </div>

      {/* Expected close date */}
      <div className="flex items-center gap-2 mb-3 text-xs">
        <Calendar className="h-3 w-3 text-muted-foreground" />
        <span className={overdue ? 'text-red-700 flex items-center gap-1' : 'text-muted-foreground'}>
          {overdue && <AlertCircle className="h-3 w-3" />}
          Erwartet: {formatDate(opportunity.expectedCloseDate)}
        </span>
      </div>

      {/* Tags */}
      {opportunity.tags && opportunity.tags.length > 0 && (
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          {opportunity.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {opportunity.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{opportunity.tags.length - 2}
            </Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-primary/10">
                  {opportunity.owner.initials}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{opportunity.owner.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {opportunity.lastActivity && (
          <span className="text-xs text-muted-foreground">{opportunity.lastActivity}</span>
        )}
      </div>
    </div>
  );
}

// Kanban column
function KanbanColumn({
  status,
  opportunities,
  onDrop,
}: {
  status: OpportunityStatus;
  opportunities: Opportunity[];
  onDrop: (opportunityId: string, newStatus: OpportunityStatus) => void;
}) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = opportunities.reduce((sum, opp) => sum + opp.value * (opp.probability / 100), 0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const opportunityId = e.dataTransfer.getData('opportunityId');
    if (opportunityId) {
      onDrop(opportunityId, status);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border border-border shrink-0 transition-all ${
        isDragOver ? 'ring-2 ring-primary bg-accent/30' : ''
      }`}
      style={{ width: '320px', minHeight: '600px' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className={`${config.headerBg} rounded-t-lg p-4 border-b`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            <h4 className="font-medium">{config.label}</h4>
            <Badge variant="secondary">{opportunities.length}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Spalte minimieren</DropdownMenuItem>
                <DropdownMenuItem>Nur diese Spalte anzeigen</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Nach Datum sortieren</DropdownMenuItem>
                <DropdownMenuItem>Nach Wert sortieren</DropdownMenuItem>
                <DropdownMenuItem>Nach Wahrscheinlichkeit sortieren</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-1">
          <div className="font-semibold">{formatCurrency(totalValue)}</div>
          <div className="text-xs text-muted-foreground">
            Gewichtet: {formatCurrency(weightedValue)}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(600px - 120px)' }}>
        {opportunities.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
            <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Keine Opportunities in &quot;{config.label}&quot;
            </p>
            <Button variant="outline" size="sm">
              Opportunity hinzufügen
            </Button>
          </div>
        ) : (
          opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isDragging={draggingId === opp.id}
              onDragStart={() => {
                setDraggingId(opp.id);
                // Set data for drop
                const event = window.event as DragEvent;
                if (event.dataTransfer) {
                  event.dataTransfer.setData('opportunityId', opp.id);
                  event.dataTransfer.effectAllowed = 'move';
                }
              }}
              onDragEnd={() => setDraggingId(null)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Full pipeline view
function OpportunityPipelineView({ userRole = 'GF' }: { userRole?: 'GF' | 'PLAN' | 'ADM' | 'KALK' }) {
  const [opportunities, setOpportunities] = useState(sampleOpportunities);
  const [filterOwner, setFilterOwner] = useState<string>('all');

  const canEdit = userRole === 'GF' || userRole === 'PLAN';

  // Calculate pipeline KPIs
  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = opportunities.reduce((sum, opp) => sum + opp.value * (opp.probability / 100), 0);
  const avgProbability =
    opportunities.length > 0
      ? opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length
      : 0;

  // Filter opportunities
  const filteredOpportunities =
    filterOwner === 'all'
      ? opportunities
      : opportunities.filter((opp) => opp.owner.initials === filterOwner);

  // Group by status
  const opportunitiesByStatus = {
    new: filteredOpportunities.filter((opp) => opp.status === 'new'),
    qualifying: filteredOpportunities.filter((opp) => opp.status === 'qualifying'),
    proposal: filteredOpportunities.filter((opp) => opp.status === 'proposal'),
    negotiation: filteredOpportunities.filter((opp) => opp.status === 'negotiation'),
    won: filteredOpportunities.filter((opp) => opp.status === 'won'),
    lost: filteredOpportunities.filter((opp) => opp.status === 'lost'),
  };

  // Handle drop
  const handleDrop = (opportunityId: string, newStatus: OpportunityStatus) => {
    const opportunity = opportunities.find((opp) => opp.id === opportunityId);
    if (!opportunity) return;

    // Update opportunity status
    setOpportunities(
      opportunities.map((opp) => (opp.id === opportunityId ? { ...opp, status: newStatus } : opp))
    );

    const statusLabel = statusConfig[newStatus].label;
    toast.success(`Opportunity zu "${statusLabel}" verschoben`);
  };

  const statuses: OpportunityStatus[] = ['new', 'qualifying', 'proposal', 'negotiation', 'won', 'lost'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3>Opportunity Pipeline</h3>
          <p className="text-sm text-muted-foreground">
            {filteredOpportunities.length} Opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Kanban
          </Button>
          <Button variant="ghost">
            <ListIcon className="mr-2 h-4 w-4" />
            Liste
          </Button>
          <Button disabled={!canEdit}>
            <Plus className="mr-2 h-4 w-4" />
            Opportunity hinzufügen
          </Button>
        </div>
      </div>

      {/* Pipeline Summary KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                Gesamtwert Pipeline
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-primary">{formatCurrency(totalValue)}</h2>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Gewichteter Wert
              </div>
              <h2 className="text-green-700">{formatCurrency(weightedValue)}</h2>
              <p className="text-xs text-muted-foreground">Wahrscheinlichkeitsgewichtet</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Percent className="h-4 w-4" />
                Durchschn. Wahrscheinlichkeit
              </div>
              <div className="flex items-baseline gap-2">
                <h2>{avgProbability.toFixed(1)}%</h2>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                Opportunities gesamt
              </div>
              <h2>{opportunities.length}</h2>
              <p className="text-xs text-muted-foreground">Alle Phasen</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Inhaber:</label>
              <Select value={filterOwner} onValueChange={setFilterOwner}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="MS">M. Schmidt</SelectItem>
                  <SelectItem value="SW">S. Weber</SelectItem>
                  <SelectItem value="TM">T. Müller</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterOwner !== 'all' && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  Inhaber: {filterOwner}
                  <button onClick={() => setFilterOwner('all')} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="bg-gray-50 rounded-lg p-6 border">
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4" style={{ minWidth: 'fit-content' }}>
            {statuses.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                opportunities={opportunitiesByStatus[status]}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Single column demo
function SingleColumnDemo() {
  const opportunities = sampleOpportunities.filter((opp) => opp.status === 'negotiation');

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Einzelne Kanban-Spalte (Verhandlung)</h4>

      <div className="bg-gray-50 rounded-lg p-6 border inline-block">
        <KanbanColumn
          status="negotiation"
          opportunities={opportunities}
          onDrop={(id, status) => toast.info(`Opportunity ${id} zu ${status} verschoben`)}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Spalte mit Header (Icon, Titel, Count, Wert, gewichteter Wert), Dropdown-Menü und
        Opportunity-Karten
      </p>
    </div>
  );
}

// Single opportunity card demo
function SingleCardDemo() {
  const opportunity = sampleOpportunities[6]; // Negotiation card

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Einzelne Opportunity-Karte</h4>

      <div className="max-w-xs">
        <OpportunityCard opportunity={opportunity} />
      </div>

      <p className="text-sm text-muted-foreground">
        Karte zeigt: Kunde, Titel, Wert, kreisförmige Wahrscheinlichkeit, erwartetes Schlussdatum,
        Tags, Inhaber-Avatar
      </p>
    </div>
  );
}

// Probability circle examples
function ProbabilityExamples() {
  const probabilities = [10, 30, 60, 80, 100];

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Wahrscheinlichkeitsindikatoren</h4>

      <div className="flex items-center gap-6">
        {probabilities.map((prob) => (
          <div key={prob} className="flex flex-col items-center gap-2">
            <ProbabilityCircle probability={prob} />
            <span className="text-sm text-muted-foreground">{prob}%</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Kreisförmige Fortschrittsanzeige mit Farbkodierung: Grau (&lt;30%), Amber (30-59%), Blau
        (60-79%), Grün (≥80%)
      </p>
    </div>
  );
}

export function OpportunityPipelineDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Vollständige Opportunity Pipeline</CardTitle>
          <CardDescription>
            Kanban-Board mit 6 Phasen, Drag & Drop, gewichtetem Wert und Pipeline-KPIs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OpportunityPipelineView userRole="GF" />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Einzelne Kanban-Spalte</CardTitle>
          <CardDescription>
            Spalte mit Header-Statistiken, Dropdown-Menü und Opportunity-Karten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SingleColumnDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Opportunity-Karte</CardTitle>
          <CardDescription>
            Draggbare Karte mit allen Details: Wert, Wahrscheinlichkeit, Datum, Tags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SingleCardDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wahrscheinlichkeitsindikatoren</CardTitle>
          <CardDescription>
            Kreisförmige Fortschrittsanzeige mit Farbkodierung basierend auf Wahrscheinlichkeit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProbabilityExamples />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Pipeline-Phasen</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Neu (Blau, Circle)</li>
              <li>• Qualifizierung (Lila, Search)</li>
              <li>• Angebot (Amber, FileText)</li>
              <li>• Verhandlung (Orange, Handshake)</li>
              <li>• Gewonnen (Grün, CheckCircle2)</li>
              <li>• Verloren (Rot, XCircle)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Spalten-Header</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Icon + Status-Name</li>
              <li>• Count-Badge</li>
              <li>• Gesamtwert (groß)</li>
              <li>• Gewichteter Wert (klein)</li>
              <li>• + Button, ⋮ Dropdown</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Opportunity-Karte</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Drag-Handle (GripVertical)</li>
              <li>• Kunde (Building2 Icon)</li>
              <li>• Titel (16px, fett, 2 Zeilen)</li>
              <li>• Wert (18px, blau, fett)</li>
              <li>• Wahrscheinlichkeit (Kreis)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Wahrscheinlichkeit</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Kreisförmige SVG-Anzeige</li>
              <li>• 0-29%: Grau</li>
              <li>• 30-59%: Amber</li>
              <li>• 60-79%: Blau</li>
              <li>• 80-100%: Grün</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Drag & Drop</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Cursor: grab → grabbing</li>
              <li>• Dragging: opacity 0.5, rotate 2°</li>
              <li>• Drop target: Ring + Hintergrund</li>
              <li>• Toast bei Statusänderung</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Pipeline-KPIs</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Gesamtwert (alle)</li>
              <li>• Gewichteter Wert (prob.)</li>
              <li>• Ø Wahrscheinlichkeit</li>
              <li>• Anzahl Opportunities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}