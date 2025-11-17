import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Euro,
  AlertTriangle,
  Clock,
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Bell,
  Database,
  LayoutTemplate,
  Filter,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';

// Opportunity needing estimate
interface OpportunityEstimate {
  id: string;
  name: string;
  customerName: string;
  value: number;
  dueDate: string;
  priority: 'high' | 'medium' | 'normal';
  status: 'new' | 'in_progress' | 'offer_created' | 'approved';
}

// Active project cost tracking
interface ProjectCost {
  id: string;
  projectNumber: string;
  orderValue: number;
  budget: number;
  actualCosts: number;
  remainingBudget: number;
  margin: number;
  status: 'on_track' | 'at_risk' | 'over_budget';
}

// Template
interface CalculationTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Approval needed
interface ApprovalNeeded {
  id: string;
  opportunityName: string;
  value: number;
  margin: number;
  reason: string;
}

// Mock data
const mockOpportunities: OpportunityEstimate[] = [
  {
    id: '1',
    name: 'REWE München - Ladeneinrichtung',
    customerName: 'REWE München Süd',
    value: 125000,
    dueDate: '2024-11-20',
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: '2',
    name: 'Hofladen Müller - Kühlsysteme',
    customerName: 'Hofladen Müller GmbH',
    value: 45000,
    dueDate: '2024-11-18',
    priority: 'high',
    status: 'new',
  },
  {
    id: '3',
    name: 'Bäckerei Schmidt - Komplettausstattung',
    customerName: 'Bäckerei Schmidt',
    value: 85000,
    dueDate: '2024-11-22',
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: '4',
    name: 'Café Müller - Renovierung',
    customerName: 'Café Müller',
    value: 32000,
    dueDate: '2024-11-25',
    priority: 'medium',
    status: 'new',
  },
  {
    id: '5',
    name: 'Restaurant Da Vinci - Einrichtung',
    customerName: 'Restaurant Da Vinci',
    value: 68000,
    dueDate: '2024-11-28',
    priority: 'medium',
    status: 'offer_created',
  },
];

const mockProjects: ProjectCost[] = [
  {
    id: '1',
    projectNumber: 'P-2024-B023',
    orderValue: 450000,
    budget: 380000,
    actualCosts: 285000,
    remainingBudget: 95000,
    margin: 15.6,
    status: 'on_track',
  },
  {
    id: '2',
    projectNumber: 'P-2024-M012',
    orderValue: 280000,
    budget: 240000,
    actualCosts: 238000,
    remainingBudget: 2000,
    margin: 14.3,
    status: 'at_risk',
  },
  {
    id: '3',
    projectNumber: 'P-2024-K008',
    orderValue: 185000,
    budget: 165000,
    actualCosts: 172000,
    remainingBudget: -7000,
    margin: 7.0,
    status: 'over_budget',
  },
  {
    id: '4',
    projectNumber: 'P-2024-H045',
    orderValue: 320000,
    budget: 270000,
    actualCosts: 195000,
    remainingBudget: 75000,
    margin: 18.8,
    status: 'on_track',
  },
];

const mockTemplates: CalculationTemplate[] = [
  {
    id: '1',
    name: 'Ladeneinrichtung Standard',
    description: 'Standardkalkulation für Einzelhandel',
    icon: 'shop',
  },
  {
    id: '2',
    name: 'Büroeinrichtung',
    description: 'Büromöbel und Ausstattung',
    icon: 'office',
  },
  {
    id: '3',
    name: 'Gastronomie',
    description: 'Restaurant & Café Ausstattung',
    icon: 'restaurant',
  },
  {
    id: '4',
    name: 'Custom',
    description: 'Individuelle Kalkulation',
    icon: 'custom',
  },
];

const mockApprovals: ApprovalNeeded[] = [
  {
    id: '1',
    opportunityName: 'Supermarkt Edeka - Komplettumbau',
    value: 285000,
    margin: 8.5,
    reason: 'Marge unter 10%',
  },
  {
    id: '2',
    opportunityName: 'Shopping Center München',
    value: 520000,
    margin: 12.0,
    reason: 'Wert über € 200.000',
  },
];

// Margin by project chart data
const marginByProjectData = [
  { project: 'P-2024-B023', margin: 15.6 },
  { project: 'P-2024-M012', margin: 14.3 },
  { project: 'P-2024-K008', margin: 7.0 },
  { project: 'P-2024-H045', margin: 18.8 },
  { project: 'P-2024-R019', margin: 22.5 },
  { project: 'P-2024-S031', margin: 11.2 },
];

// Cost distribution pie chart
const costDistributionData = [
  { name: 'Material', value: 45, color: '#3b82f6' },
  { name: 'Personal', value: 35, color: '#60a5fa' },
  { name: 'Fremdleistungen', value: 15, color: '#93c5fd' },
  { name: 'Sonstiges', value: 5, color: '#bfdbfe' },
];

// Margin trend line chart (last 6 months)
const marginTrendData = [
  { month: 'Mai 24', margin: 16.2 },
  { month: 'Jun 24', margin: 15.8 },
  { month: 'Jul 24', margin: 17.1 },
  { month: 'Aug 24', margin: 16.5 },
  { month: 'Sep 24', margin: 17.8 },
  { month: 'Okt 24', margin: 18.5 },
];

// Recent searches
const recentSearches = ['Ladenregal', 'Montage pro Stunde', 'LED-Beleuchtung', 'Kühlschrank'];

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE');
}

// Get priority badge
function getPriorityBadge(priority: OpportunityEstimate['priority']) {
  switch (priority) {
    case 'high':
      return <Badge variant="destructive">Hoch</Badge>;
    case 'medium':
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
          Mittel
        </Badge>
      );
    case 'normal':
      return <Badge variant="outline">Normal</Badge>;
  }
}

// Get status badge
function getStatusBadge(status: OpportunityEstimate['status']) {
  switch (status) {
    case 'new':
      return <Badge variant="secondary">Neu</Badge>;
    case 'in_progress':
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400">
          In Bearbeitung
        </Badge>
      );
    case 'offer_created':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
          Angebot erstellt
        </Badge>
      );
    case 'approved':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
          Genehmigt
        </Badge>
      );
  }
}

// Get project status badge
function getProjectStatusBadge(status: ProjectCost['status']) {
  switch (status) {
    case 'on_track':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
          Im Rahmen
        </Badge>
      );
    case 'at_risk':
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
          Risiko
        </Badge>
      );
    case 'over_budget':
      return <Badge variant="destructive">Über Budget</Badge>;
  }
}

// Get margin color
function getMarginColor(margin: number): string {
  if (margin >= 15) return '#10b981'; // Green
  if (margin >= 10) return '#f59e0b'; // Amber
  return '#ef4444'; // Red
}

// KALK Dashboard
export function KALKDashboard() {
  const [view, setView] = useState('offers');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const userName = 'Stefan Bauer';
  const userRole = 'KALK';

  // KPI values
  const openCalculations = 8;
  const urgentCalculations = 3;
  const avgProcessingTime = 2;
  const averageMargin = 18.5;
  const marginTrend = 2;
  const targetMargin = 15;
  const totalVolume = 3200000;
  const openEstimates = 24;
  const wonValue = 1450000;
  const rejectionRate = 15;
  const rejectionReasonPrice = 60;

  const handleStartCalculation = (opportunity: OpportunityEstimate) => {
    toast.success('Kalkulation starten', {
      description: opportunity.name,
    });
  };

  const handleCreateOffer = (opportunity: OpportunityEstimate) => {
    toast.success('Angebot erstellen', {
      description: opportunity.name,
    });
  };

  const handleViewProject = (project: ProjectCost) => {
    toast.info('Projekt öffnen', {
      description: project.projectNumber,
    });
  };

  const handleUseTemplate = (template: CalculationTemplate) => {
    toast.success('Vorlage verwenden', {
      description: template.name,
    });
  };

  const handleNotifyGF = (approval: ApprovalNeeded) => {
    toast.success('GF benachrichtigt', {
      description: approval.opportunityName,
    });
  };

  const handleNewCalculation = () => {
    toast.success('Neue Kalkulation', {
      description: 'Kalkulationsformular wird geöffnet...',
    });
  };

  const handleCreateTemplate = () => {
    toast.success('Neue Vorlage', {
      description: 'Vorlagenformular wird geöffnet...',
    });
  };

  const handleUpdatePriceDB = () => {
    toast.success('Preis-Datenbank aktualisieren', {
      description: 'Aktualisierung wird gestartet...',
    });
  };

  const handleExportAnalysis = () => {
    toast.success('Margenanalyse exportieren', {
      description: 'PDF wird erstellt...',
    });
  };

  const filteredOpportunities = mockOpportunities.filter((opp) => {
    const matchesPriority = priorityFilter === 'all' || opp.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || opp.status === statusFilter;
    const matchesSearch =
      opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPriority && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="mb-4">Kalkulation</h1>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={view === 'offers' ? 'default' : 'outline'}
                  onClick={() => setView('offers')}
                >
                  Angebote
                </Button>
                <Button
                  variant={view === 'projects' ? 'default' : 'outline'}
                  onClick={() => setView('projects')}
                >
                  Projekte
                </Button>
                <Button
                  variant={view === 'analysis' ? 'default' : 'outline'}
                  onClick={() => setView('analysis')}
                >
                  Analysen
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>SB</AvatarFallback>
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
            {/* Open Calculations */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Offene Kalkulationen</p>
                <p className="text-4xl font-bold text-amber-600 mb-2">{openCalculations}</p>
                <div className="space-y-1">
                  <Badge variant="destructive" className="text-xs">
                    {urgentCalculations} fällig diese Woche
                  </Badge>
                  <p className="text-muted-foreground">Ø {avgProcessingTime} Tage</p>
                </div>
              </CardContent>
            </Card>

            {/* Average Margin */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">+{marginTrend}%</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Durchschnittliche Marge</p>
                <p className="text-4xl font-bold text-green-600 mb-2">{averageMargin}%</p>
                <p className="text-muted-foreground">{targetMargin}% Ziel</p>
              </CardContent>
            </Card>

            {/* Total Volume */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                    <Euro className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Gesamtvolumen (aktuell)</p>
                <p className="text-4xl font-bold text-primary mb-2">
                  {formatCurrency(totalVolume)}
                </p>
                <div className="space-y-1 text-muted-foreground">
                  <p>{openEstimates} offene Angebote</p>
                  <p>Gewonnen: {formatCurrency(wonValue)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Rejection Rate */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Ablehnungsrate</p>
                <p className="text-4xl font-bold text-amber-600 mb-2">{rejectionRate}%</p>
                <div className="space-y-1 text-muted-foreground">
                  <p>Preis zu hoch: {rejectionReasonPrice}%</p>
                  <p className="text-xs">Kalkulation optimieren</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Calculations */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Anstehende Kalkulationen
                  </CardTitle>
                  <CardDescription>
                    {filteredOpportunities.length} Opportunities benötigen Kalkulation
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Suche..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      <SelectItem value="high">Hoch</SelectItem>
                      <SelectItem value="medium">Mittel</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="new">Neu</SelectItem>
                      <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                      <SelectItem value="offer_created">Angebot erstellt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left">Opportunity</th>
                      <th className="px-4 py-3 text-left">Kunde</th>
                      <th className="px-4 py-3 text-right">Wert</th>
                      <th className="px-4 py-3 text-left">Fälligkeit</th>
                      <th className="px-4 py-3 text-center">Priorität</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOpportunities.map((opp) => (
                      <tr key={opp.id} className="border-b border-border hover:bg-accent">
                        <td className="px-4 py-3 font-medium">{opp.name}</td>
                        <td className="px-4 py-3">{opp.customerName}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {formatCurrency(opp.value)}
                        </td>
                        <td className="px-4 py-3">{formatDate(opp.dueDate)}</td>
                        <td className="px-4 py-3 text-center">{getPriorityBadge(opp.priority)}</td>
                        <td className="px-4 py-3 text-center">{getStatusBadge(opp.status)}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            {opp.status === 'new' || opp.status === 'in_progress' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartCalculation(opp)}
                              >
                                <Calculator className="mr-2 h-4 w-4" />
                                Kalkulation
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCreateOffer(opp)}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Angebot
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
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

          {/* Active Projects - Cost Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Aktive Projekte - Kostenüberwachung</CardTitle>
              <CardDescription>{mockProjects.length} Projekte aktiv</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left">Projekt</th>
                      <th className="px-4 py-3 text-right">Auftragswert</th>
                      <th className="px-4 py-3 text-right">Budget</th>
                      <th className="px-4 py-3 text-right">Ist-Kosten</th>
                      <th className="px-4 py-3 text-right">Restbudget</th>
                      <th className="px-4 py-3 text-center">Marge (%)</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Auslastung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProjects.map((project) => {
                      const utilization = (project.actualCosts / project.budget) * 100;
                      const utilizationColor =
                        utilization > 100 ? 'red' : utilization >= 80 ? 'amber' : 'green';

                      return (
                        <tr
                          key={project.id}
                          className="border-b border-border hover:bg-accent cursor-pointer"
                          onClick={() => handleViewProject(project)}
                        >
                          <td className="px-4 py-3 font-mono font-semibold">
                            {project.projectNumber}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatCurrency(project.orderValue)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatCurrency(project.budget)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatCurrency(project.actualCosts)}
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-semibold ${
                              project.remainingBudget < 0 ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {formatCurrency(project.remainingBudget)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className="font-semibold"
                              style={{ color: getMarginColor(project.margin) }}
                            >
                              {project.margin.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {getProjectStatusBadge(project.status)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-full">
                              <Progress
                                value={Math.min(utilization, 100)}
                                className="h-2"
                                indicatorClassName={
                                  utilizationColor === 'red'
                                    ? 'bg-red-600'
                                    : utilizationColor === 'amber'
                                    ? 'bg-amber-600'
                                    : 'bg-green-600'
                                }
                              />
                              <p className="text-xs text-muted-foreground mt-1 text-center">
                                {utilization.toFixed(0)}%
                              </p>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Margin Analysis Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Margin by Project */}
            <Card>
              <CardHeader>
                <CardTitle>Marge nach Projekten</CardTitle>
                <CardDescription>Aktuelle Projekte im Vergleich</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marginByProjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="project" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <ReferenceLine y={15} stroke="#94a3b8" strokeDasharray="3 3" label="Ziel" />
                    <Bar dataKey="margin" name="Marge">
                      {marginByProjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getMarginColor(entry.margin)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Kostenverteilung</CardTitle>
                <CardDescription>Durchschnittliche Aufteilung</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={costDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {costDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Margin Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Marge Trend</CardTitle>
              <CardDescription>Entwicklung der letzten 6 Monate</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={marginTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <ReferenceLine y={15} stroke="#94a3b8" strokeDasharray="3 3" label="Ziel 15%" />
                  <Line
                    type="monotone"
                    dataKey="margin"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Durchschn. Marge"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Calculation Templates & Price Database */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Templates */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <LayoutTemplate className="h-5 w-5" />
                      Kalkulationsvorlagen
                    </CardTitle>
                    <CardDescription>Schnellzugriff auf Vorlagen</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleCreateTemplate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Neu
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {mockTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <p className="font-medium mb-1">{template.name}</p>
                      <p className="text-muted-foreground text-xs">{template.description}</p>
                      <Button size="sm" variant="outline" className="w-full mt-3">
                        Verwenden
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Database */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Preis-Datenbank
                    </CardTitle>
                    <CardDescription>Material- und Leistungspreise</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleUpdatePriceDB}>
                    Aktualisieren
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Material oder Dienstleistung suchen..."
                    className="pl-10"
                  />
                </div>

                <div>
                  <p className="font-medium mb-2">Letzte Suchen</p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer">
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Letzte Aktualisierung: Vor 2 Tagen</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Approvals Needed */}
          {mockApprovals.length > 0 && (
            <Card className="border-2 border-amber-200 dark:border-amber-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Benötigte Genehmigungen
                </CardTitle>
                <CardDescription>
                  {mockApprovals.length} Angebote benötigen GF-Genehmigung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockApprovals.map((approval) => (
                    <Alert key={approval.id}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        <span>{approval.opportunityName}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{formatCurrency(approval.value)}</span>
                          <Badge
                            className={
                              approval.margin < 10
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400'
                                : ''
                            }
                          >
                            {approval.margin}% Marge
                          </Badge>
                        </div>
                      </AlertTitle>
                      <AlertDescription>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-muted-foreground">
                            Grund: {approval.reason}
                          </span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleNotifyGF(approval)}
                            >
                              <Bell className="mr-2 h-4 w-4" />
                              GF benachrichtigen
                            </Button>
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
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={handleNewCalculation}
        >
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
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleNewCalculation}
            >
              <Plus className="mr-2 h-4 w-4" />
              Neue Kalkulation
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleCreateTemplate}
            >
              <LayoutTemplate className="mr-2 h-4 w-4" />
              Vorlage erstellen
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleUpdatePriceDB}
            >
              <Database className="mr-2 h-4 w-4" />
              Preis-DB aktualisieren
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportAnalysis}
            >
              <Download className="mr-2 h-4 w-4" />
              Analyse exportieren
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Demo wrapper
export function KALKDashboardDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KALK Dashboard (Kalkulation)</CardTitle>
          <CardDescription>
            Kalkulationsdashboard mit Angebotsübersicht, Kostenüberwachung, Margenanalyse und
            Preisdatenbank
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator />

      <KALKDashboard />
    </div>
  );
}