import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Briefcase,
  DollarSign,
  Users,
  AlertCircle,
  Clock,
  CheckCircle,
  ExternalLink,
  Plus,
  FileBarChart,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  AlertTriangle,
  Calendar,
  Filter,
} from 'lucide-react';

// Team member performance
interface TeamMember {
  id: string;
  name: string;
  role: string;
  opportunities: number;
  revenue: number;
  conversionRate: number;
  avatar: string;
}

// Alert type
interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  icon: 'alert' | 'error' | 'clock';
  message: string;
  timestamp: string;
  actionLabel?: string;
}

// Mock data
const topPerformers: TeamMember[] = [
  {
    id: '1',
    name: 'Michael Schmidt',
    role: 'ADM',
    opportunities: 8,
    revenue: 450000,
    conversionRate: 62,
    avatar: 'MS',
  },
  {
    id: '2',
    name: 'Sarah Müller',
    role: 'ADM',
    opportunities: 12,
    revenue: 380000,
    conversionRate: 58,
    avatar: 'SM',
  },
  {
    id: '3',
    name: 'Thomas Fischer',
    role: 'IV',
    opportunities: 6,
    revenue: 320000,
    conversionRate: 75,
    avatar: 'TF',
  },
  {
    id: '4',
    name: 'Lisa Wagner',
    role: 'ADM',
    opportunities: 9,
    revenue: 295000,
    conversionRate: 55,
    avatar: 'LW',
  },
  {
    id: '5',
    name: 'Anna Weber',
    role: 'BUCH',
    opportunities: 4,
    revenue: 180000,
    conversionRate: 50,
    avatar: 'AW',
  },
];

const alerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    icon: 'alert',
    message: 'Projekt P-2025-M003: Budget um 15% überschritten (€ 12.500)',
    timestamp: 'Vor 2 Stunden',
    actionLabel: 'Details anzeigen',
  },
  {
    id: '2',
    type: 'error',
    icon: 'error',
    message: 'Angebot A-2025-00089 läuft morgen ab (€ 45.000)',
    timestamp: 'Vor 4 Stunden',
    actionLabel: 'Angebot öffnen',
  },
  {
    id: '3',
    type: 'warning',
    icon: 'alert',
    message: 'Projekt Hofladen Müller: Marge nur 8% (unter Ziel 20%)',
    timestamp: 'Vor 6 Stunden',
    actionLabel: 'Projekt prüfen',
  },
  {
    id: '4',
    type: 'info',
    icon: 'clock',
    message: 'Projekt REWE München: Verzögerung von 5 Tagen',
    timestamp: 'Gestern',
    actionLabel: 'Timeline anzeigen',
  },
];

// Revenue trend data (last 12 months)
const revenueTrendData = [
  { month: 'Jan 24', contracts: 180000, completed: 165000, margin: 28 },
  { month: 'Feb 24', contracts: 220000, completed: 190000, margin: 26 },
  { month: 'Mär 24', contracts: 195000, completed: 210000, margin: 29 },
  { month: 'Apr 24', contracts: 240000, completed: 225000, margin: 27 },
  { month: 'Mai 24', contracts: 210000, completed: 195000, margin: 30 },
  { month: 'Jun 24', contracts: 265000, completed: 240000, margin: 28 },
  { month: 'Jul 24', contracts: 280000, completed: 255000, margin: 29 },
  { month: 'Aug 24', contracts: 245000, completed: 270000, margin: 27 },
  { month: 'Sep 24', contracts: 230000, completed: 245000, margin: 28 },
  { month: 'Okt 24', contracts: 275000, completed: 260000, margin: 30 },
  { month: 'Nov 24', contracts: 290000, completed: 280000, margin: 29 },
  { month: 'Dez 24', contracts: 310000, completed: 295000, margin: 28 },
];

// Sparkline data for revenue KPI
const sparklineData = [
  { value: 2100000 },
  { value: 2250000 },
  { value: 2180000 },
  { value: 2300000 },
  { value: 2450000 },
];

// Opportunity pipeline funnel
const pipelineFunnelData = [
  { stage: 'Neu', value: 800000, count: 15, color: '#3b82f6' },
  { stage: 'Qualifizierung', value: 1200000, count: 22, color: '#60a5fa' },
  { stage: 'Angebot', value: 850000, count: 18, color: '#93c5fd' },
  { stage: 'Verhandlung', value: 350000, count: 8, color: '#10b981' },
  { stage: 'Gewonnen', value: 450000, count: 12, color: '#34d399' },
];

// Win rate donut chart
const winRateData = [
  { name: 'Gewonnen', value: 52, color: '#10b981' },
  { name: 'Verloren', value: 32, color: '#ef4444' },
  { name: 'Offen', value: 40, color: '#94a3b8' },
];

// Project status distribution
const projectStatusData = [
  { status: 'Planung', count: 4, color: '#3b82f6' },
  { status: 'In Arbeit', count: 12, color: '#f59e0b' },
  { status: 'Verzögert', count: 2, color: '#ef4444' },
  { status: 'Abgeschlossen', count: 8, color: '#10b981' },
];

// Budget vs Actual (Top 5 projects)
const budgetActualData = [
  { project: 'REWE München', budget: 125000, actual: 118000, margin: 28 },
  { project: 'Hofladen Müller', budget: 85000, actual: 92000, margin: 8 },
  { project: 'Bäckerei Schmidt', budget: 65000, actual: 58000, margin: 32 },
  { project: 'Café Münchner F.', budget: 48000, actual: 45000, margin: 25 },
  { project: 'Restaurant DaVinci', budget: 92000, actual: 88000, margin: 30 },
];

// Team utilization heatmap data
const utilizationData = [
  { name: 'M. Schmidt', w1: 85, w2: 92, w3: 78, w4: 95 },
  { name: 'S. Müller', w1: 105, w2: 98, w3: 102, w4: 88 },
  { name: 'T. Fischer', w1: 72, w2: 88, w3: 85, w4: 90 },
  { name: 'L. Wagner', w1: 95, w2: 110, w3: 98, w4: 92 },
  { name: 'A. Weber', w1: 65, w2: 70, w3: 75, w4: 68 },
];

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format currency short (K/M)
function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000) {
    return `€ ${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `€ ${(amount / 1000).toFixed(0)}k`;
  }
  return formatCurrency(amount);
}

// Get utilization color
function getUtilizationColor(value: number): string {
  if (value > 100) return '#ef4444'; // Red
  if (value >= 80) return '#f59e0b'; // Amber
  return '#10b981'; // Green
}

// GF Dashboard
export function GFDashboard() {
  const [period, setPeriod] = useState('quarter');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');

  const userName = 'Dr. Schmidt';
  const userRole = 'GF';
  const currentPeriod = 'Q4 2024';
  const dateRange = '01.10.2024 - 31.12.2024';

  // KPI values
  const revenue = 2450000;
  const revenueTrend = 15;
  const opportunityValue = 3200000;
  const opportunityCount = 24;
  const conversionRate = 42;
  const activeProjects = 18;
  const projectsOnTime = 16;
  const projectsDelayed = 2;
  const liquidity = 850000;
  const outstanding = 420000;
  const runway = 6;

  // Financial metrics
  const pipelineOffers = 350000;
  const openOffers = 15;
  const activeContracts = 1250000;
  const contractCount = 12;
  const averageMargin = 28.5;

  const totalOpportunities = 124;
  const wonOpportunities = 52;
  const lostOpportunities = 32;
  const openOpportunities = 40;
  const winRate = 42;

  const handleNewCustomer = () => {
    toast.success('Neuer Kunde', {
      description: 'Kundenformular öffnen...',
    });
  };

  const handleNewOpportunity = () => {
    toast.success('Neue Opportunity', {
      description: 'Opportunity-Formular öffnen...',
    });
  };

  const handleViewReports = () => {
    toast.info('Berichte', {
      description: 'Berichtsübersicht wird geladen...',
    });
  };

  const handleSettings = () => {
    toast.info('Einstellungen', {
      description: 'Systemeinstellungen öffnen...',
    });
  };

  const handleAlertAction = (alert: Alert) => {
    toast.info(alert.actionLabel || 'Aktion', {
      description: alert.message,
    });
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 25) return 'text-green-600';
    if (margin >= 15) return 'text-amber-600';
    return 'text-red-600';
  };

  const getMarginBadge = (margin: number) => {
    if (margin >= 25)
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
          Gut
        </Badge>
      );
    if (margin >= 15)
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
          Mittel
        </Badge>
      );
    return <Badge variant="destructive">Niedrig</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="mb-2">Dashboard</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Dieser Monat</SelectItem>
                    <SelectItem value="quarter">Dieses Quartal ({currentPeriod})</SelectItem>
                    <SelectItem value="year">Dieses Jahr</SelectItem>
                    <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">{dateRange}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={customerFilter} onValueChange={setCustomerFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Kunden</SelectItem>
                    <SelectItem value="active">Aktive Kunden</SelectItem>
                    <SelectItem value="inactive">Inaktive Kunden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Projekte</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="delayed">Verzögert</SelectItem>
                </SelectContent>
              </Select>

              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Mitarbeiter</SelectItem>
                  <SelectItem value="adm">ADM</SelectItem>
                  <SelectItem value="iv">IV</SelectItem>
                </SelectContent>
              </Select>

              <Separator orientation="vertical" className="h-8" />

              <Avatar className="h-10 w-10">
                <AvatarFallback>DS</AvatarFallback>
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
            {/* Revenue */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">+{revenueTrend}%</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Umsatz (Q4)</p>
                <p className="text-4xl font-bold text-primary mb-2">{formatCurrency(revenue)}</p>
                <div className="h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData}>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Offene Opportunities</p>
                <p className="text-4xl font-bold text-amber-600 mb-2">
                  {formatCurrency(opportunityValue)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{opportunityCount} Opportunities</span>
                  <span className="font-semibold">Conv.: {conversionRate}%</span>
                </div>
              </CardContent>
            </Card>

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
                    <span className="text-green-600">{projectsOnTime} pünktlich</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-600" />
                    <span className="text-red-600">{projectsDelayed} verzögert</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liquidity */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Liquidität</p>
                <p className="text-4xl font-bold text-green-600 mb-2">
                  {formatCurrency(liquidity)}
                </p>
                <div className="space-y-1 text-muted-foreground">
                  <p>Ausstehend: {formatCurrency(outstanding)}</p>
                  <p>Runway: {runway} Monate</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Opportunity Pipeline Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Vertriebsübersicht - Pipeline</CardTitle>
                <CardDescription>Opportunity-Funnel nach Phasen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pipelineFunnelData.map((stage, index) => {
                    const nextStage = pipelineFunnelData[index + 1];
                    const conversionRate = nextStage
                      ? Math.round((nextStage.value / stage.value) * 100)
                      : 0;

                    return (
                      <div key={stage.stage}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{stage.stage}</span>
                            <Badge variant="outline">{stage.count}</Badge>
                          </div>
                          <span className="font-semibold">{formatCurrencyShort(stage.value)}</span>
                        </div>
                        <div className="relative h-12 rounded overflow-hidden bg-muted">
                          <div
                            className="absolute inset-y-0 left-0 flex items-center justify-center transition-all"
                            style={{
                              width: `${(stage.value / pipelineFunnelData[0].value) * 100}%`,
                              backgroundColor: stage.color,
                            }}
                          >
                            <span className="text-white font-semibold">
                              {Math.round((stage.value / pipelineFunnelData[0].value) * 100)}%
                            </span>
                          </div>
                        </div>
                        {nextStage && (
                          <div className="flex items-center justify-center mt-1">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <ArrowDownRight className="h-3 w-3" />
                              <span>{conversionRate}% Conversion</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Win Rate Donut */}
            <Card>
              <CardHeader>
                <CardTitle>Gewinnrate</CardTitle>
                <CardDescription>Opportunities ({totalOpportunities} gesamt)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={winRateData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {winRateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-3 w-3 rounded-full bg-green-600" />
                        <span className="font-medium">Gewonnen</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{wonOpportunities}</p>
                      <p className="text-muted-foreground">{winRate}%</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-3 w-3 rounded-full bg-red-600" />
                        <span className="font-medium">Verloren</span>
                      </div>
                      <p className="text-2xl font-bold text-red-600">{lostOpportunities}</p>
                      <p className="text-muted-foreground">
                        {Math.round((lostOpportunities / totalOpportunities) * 100)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-3 w-3 rounded-full bg-slate-400" />
                        <span className="font-medium">Offen</span>
                      </div>
                      <p className="text-2xl font-bold">{openOpportunities}</p>
                      <p className="text-muted-foreground">
                        {Math.round((openOpportunities / totalOpportunities) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Portfolio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Projektportfolio - Status</CardTitle>
                <CardDescription>Verteilung nach Projektstatus</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6">
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Budget vs Actual */}
            <Card>
              <CardHeader>
                <CardTitle>Budget vs. Ist</CardTitle>
                <CardDescription>Top 5 Projekte nach Wert</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetActualData.map((project, index) => {
                    const variance = project.actual - project.budget;
                    const variancePercent = Math.round((variance / project.budget) * 100);
                    const isOverBudget = variance > 0;

                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{project.project}</span>
                          <div className="flex items-center gap-2">
                            <span className={isOverBudget ? 'text-red-600' : 'text-green-600'}>
                              {isOverBudget ? '+' : ''}
                              {variancePercent}%
                            </span>
                            {getMarginBadge(project.margin)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground w-16">Budget:</span>
                            <div className="flex-1 h-6 rounded overflow-hidden bg-muted relative">
                              <div
                                className="absolute inset-y-0 left-0 bg-blue-500 flex items-center justify-end pr-2"
                                style={{ width: '100%' }}
                              >
                                <span className="text-white text-xs">
                                  {formatCurrency(project.budget)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground w-16">Ist:</span>
                            <div className="flex-1 h-6 rounded overflow-hidden bg-muted relative">
                              <div
                                className={`absolute inset-y-0 left-0 flex items-center justify-end pr-2 ${
                                  isOverBudget ? 'bg-red-500' : 'bg-green-500'
                                }`}
                                style={{
                                  width: `${(project.actual / project.budget) * 100}%`,
                                }}
                              >
                                <span className="text-white text-xs">
                                  {formatCurrency(project.actual)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Finanzübersicht</CardTitle>
              <CardDescription>Vertrags- und Projektumsatz (letzte 12 Monate)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Revenue Trend Chart */}
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(value) => formatCurrencyShort(value)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'margin') return [`${value}%`, 'Marge'];
                      return [formatCurrency(Number(value)), name];
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="contracts"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Vertragswerte"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Abgeschlossene Projekte"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="margin"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Durchschn. Marge (%)"
                  />
                </ComposedChart>
              </ResponsiveContainer>

              <Separator />

              {/* Financial Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileBarChart className="h-5 w-5 text-amber-600" />
                    <p className="font-medium">Pipeline-Value (Angebote)</p>
                  </div>
                  <p className="text-3xl font-bold text-amber-600">
                    {formatCurrency(pipelineOffers)}
                  </p>
                  <p className="text-muted-foreground mt-1">{openOffers} offene Angebote</p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <p className="font-medium">Aktive Verträge</p>
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(activeContracts)}
                  </p>
                  <p className="text-muted-foreground mt-1">{contractCount} Verträge</p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <p className="font-medium">Durchschnittliche Marge</p>
                  </div>
                  <p className={`text-3xl font-bold ${getMarginColor(averageMargin)}`}>
                    {averageMargin}%
                  </p>
                  {getMarginBadge(averageMargin)}
                </div>
              </div>

              <Separator />

              {/* Lexware Integration Status */}
              <div className="p-4 border-2 border-dashed border-border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-muted-foreground/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Lexware-Integration</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Nicht verbunden</Badge>
                        <span className="text-muted-foreground">Phase 1</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" disabled>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Lexware öffnen
                  </Button>
                </div>
                <p className="text-muted-foreground mt-3">
                  Die Integration mit Lexware-Buchhaltung ist für Phase 2+ geplant.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Team-Performance</CardTitle>
                <CardDescription>Top 5 Mitarbeiter nach Umsatz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/30">
                      <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-center">Rolle</th>
                        <th className="px-4 py-3 text-center">Opp.</th>
                        <th className="px-4 py-3 text-right">Umsatz</th>
                        <th className="px-4 py-3 text-center">Conv.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPerformers.map((member, index) => (
                        <tr
                          key={member.id}
                          className="border-b border-border hover:bg-accent cursor-pointer"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{member.avatar}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{member.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline">{member.role}</Badge>
                          </td>
                          <td className="px-4 py-3 text-center">{member.opportunities}</td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {formatCurrency(member.revenue)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-semibold text-green-600">
                              {member.conversionRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Team Utilization Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>Auslastung</CardTitle>
                <CardDescription>Wochenübersicht (letzte 4 Wochen)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {utilizationData.map((member, index) => (
                    <div key={index}>
                      <p className="font-medium mb-2">{member.name}</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[member.w1, member.w2, member.w3, member.w4].map((value, weekIndex) => (
                          <div
                            key={weekIndex}
                            className="h-16 rounded flex items-center justify-center border border-border"
                            style={{ backgroundColor: `${getUtilizationColor(value)}30` }}
                          >
                            <span
                              className="font-semibold"
                              style={{ color: getUtilizationColor(value) }}
                            >
                              {value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: getUtilizationColor(75) }}
                      />
                      <span className="text-muted-foreground">&lt; 80%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: getUtilizationColor(90) }}
                      />
                      <span className="text-muted-foreground">80-100%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: getUtilizationColor(105) }}
                      />
                      <span className="text-muted-foreground">&gt; 100%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activities & Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Aktivitäten & Alerts
              </CardTitle>
              <CardDescription>Wichtige Benachrichtigungen und Warnungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => {
                  const alertIcon =
                    alert.icon === 'error' ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : alert.icon === 'clock' ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5" />
                    );

                  const alertVariant =
                    alert.type === 'error'
                      ? 'destructive'
                      : alert.type === 'warning'
                      ? 'default'
                      : 'default';

                  return (
                    <Alert key={alert.id} variant={alertVariant}>
                      {alertIcon}
                      <AlertTitle className="flex items-center justify-between">
                        <span>{alert.message}</span>
                        <span className="text-muted-foreground">{alert.timestamp}</span>
                      </AlertTitle>
                      {alert.actionLabel && (
                        <AlertDescription>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleAlertAction(alert)}
                          >
                            {alert.actionLabel}
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </Button>
                        </AlertDescription>
                      )}
                    </Alert>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={handleNewCustomer}
            title="Neuer Kunde"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Quick Actions Sidebar (Desktop) */}
      <div className="hidden lg:block fixed left-6 bottom-6 z-40">
        <Card className="w-64">
          <CardHeader>
            <CardTitle>Schnellaktionen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={handleNewCustomer}>
              <Plus className="mr-2 h-4 w-4" />
              Neuer Kunde
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleNewOpportunity}
            >
              <Target className="mr-2 h-4 w-4" />
              Neue Opportunity
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleViewReports}>
              <FileBarChart className="mr-2 h-4 w-4" />
              Berichte anzeigen
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Einstellungen
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Demo wrapper
export function GFDashboardDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>GF Dashboard (Geschäftsführung)</CardTitle>
          <CardDescription>
            Executive Dashboard mit strategischen KPIs, Finanzübersicht, Vertriebspipeline und
            Team-Performance
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator />

      <GFDashboard />
    </div>
  );
}