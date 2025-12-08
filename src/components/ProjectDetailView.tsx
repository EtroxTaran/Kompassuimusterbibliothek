import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner@2.0.3';
import {
  ChevronRight,
  Edit,
  Clock,
  FileText,
  Archive,
  Building2,
  ExternalLink,
  Euro,
  Calendar,
  TrendingUp,
  Users,
  Target,
  Plus,
  CheckCircle,
  Circle,
  Mail,
  Phone,
  Download,
  Upload,
  Timer,
  Receipt,
  AlertCircle,
  Briefcase,
  User,
  Clock3,
  FileBarChart,
  FolderOpen,
} from 'lucide-react';

import { ProjectForm } from './ProjectFormDemo';
import { InvoiceForm } from './InvoiceFormDemo';
import { Project, TeamMember, Milestone, BudgetItem, TimeEntry, Document } from './providers/DataProvider';

// User role type
type UserRole = 'GF' | 'BUCH' | 'PLAN' | 'ADM' | 'KALK';

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

// Calculate days remaining
function daysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Calculate elapsed percentage
function elapsedPercentage(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

// Project Detail View
export function ProjectDetailView({
  project,
  currentUserRole = 'PLAN',
  currentUserId = '1',
}: {
  project: Project;
  currentUserRole?: UserRole;
  currentUserId?: string;
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

  // Normalize data for view
  const team = project.team || [];
  const milestones = Array.isArray(project.milestones) ? project.milestones : [];
  const budgetBreakdown = project.budgetBreakdown || [];
  const timeEntries = project.timeEntries || [];
  const documents = project.documents || [];

  const isTeamMember = team.some((member) => member.id === currentUserId);
  const canEdit =
    currentUserRole === 'GF' ||
    currentUserRole === 'PLAN' ||
    (currentUserRole === 'ADM' && isTeamMember) ||
    (currentUserRole === 'KALK' && isTeamMember);
  const canViewFinancials =
    currentUserRole === 'GF' ||
    currentUserRole === 'BUCH' ||
    currentUserRole === 'PLAN' ||
    currentUserRole === 'KALK';

  const completedMilestones = milestones.filter((m) => m.status === 'completed').length;
  const totalMilestones = milestones.length > 0 ? milestones.length : (project.milestones as any).total || 0;
  
  const margin = project.margin || 0;
  const contractValue = project.contractValue || project.budget * 1.2; // Fallback
  const marginPercentage = contractValue > 0 ? ((margin / contractValue) * 100).toFixed(1) : '0.0';
  
  const timelineElapsed = elapsedPercentage(project.startDate, project.endDate);
  const remainingDays = daysRemaining(project.endDate);

  const totalBudgetPlanned = budgetBreakdown.reduce((sum, item) => sum + item.planned, 0) || project.budget;
  const totalBudgetActual = budgetBreakdown.reduce((sum, item) => sum + item.actual, 0) || project.actualCost || 0;
  const budgetRemaining = totalBudgetPlanned - totalBudgetActual;
  const budgetHealth =
    totalBudgetActual / totalBudgetPlanned < 0.8
      ? 'good'
      : totalBudgetActual / totalBudgetPlanned < 0.95
      ? 'warning'
      : 'critical';

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

  const handleTimeTracking = () => {
    toast.success('Zeit erfasst', {
      description: 'Ihre Zeiterfassung wurde gespeichert',
    });
    setShowTimeDialog(false);
  };

  const getStatusBadge = () => {
    switch (project.status) {
      case 'planning':
        return <Badge variant="secondary">Planung</Badge>;
      case 'inProgress':
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
            In Bearbeitung
          </Badge>
        );
      case 'paused':
        return <Badge variant="outline">Pausiert</Badge>;
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
            Abgeschlossen
          </Badge>
        );
      case 'cancelled':
        return <Badge variant="destructive">Storniert</Badge>;
      case 'new':
        return <Badge variant="outline">Neu</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Dashboard
            </a>
            <ChevronRight className="h-4 w-4" />
            <a href="#" className="hover:text-foreground transition-colors">
              Projekte
            </a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{project.number}</span>
          </div>

          {/* Project Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-mono">{project.number}</h1>
                {getStatusBadge()}
              </div>
              <h2 className="mb-2">{project.name}</h2>

              <a
                href="#"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <Building2 className="h-4 w-4" />
                {project.customer}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {canEdit && (
                <>
                  <ProjectForm 
                    isEdit={true}
                    customTrigger={
                      <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Bearbeiten
                      </Button>
                    }
                  />
                  <Button variant="outline" onClick={() => setShowTimeDialog(true)}>
                    <Clock className="mr-2 h-4 w-4" />
                    Zeiterfassung
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => toast.info('Bericht wird generiert...')}>
                <FileText className="mr-2 h-4 w-4" />
                Bericht
              </Button>
              {currentUserRole === 'GF' && (
                <Button variant="outline">
                  <Archive className="mr-2 h-4 w-4" />
                  Archivieren
                </Button>
              )}
            </div>
          </div>

          {/* Progress and KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Large Progress Circle */}
            <Card className="border-2 border-primary/20 md:col-span-1">
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col items-center">
                  {/* Circular Progress */}
                  <div className="relative w-32 h-32 mb-4">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - project.progress / 100)}`}
                        className="text-primary transition-all duration-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">{project.progress}%</span>
                    </div>
                  </div>
                  <p className="text-center font-medium mb-1">Projektfortschritt</p>
                  <p className="text-muted-foreground text-center">
                    {completedMilestones} von {totalMilestones} Meilensteine
                  </p>

                  {/* Timeline Bar */}
                  <div className="w-full mt-4">
                    <div className="flex justify-between text-muted-foreground mb-1">
                      <span>Verstrichene Zeit</span>
                      <span>{Math.round(timelineElapsed)}%</span>
                    </div>
                    <Progress value={timelineElapsed} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Contract Value */}
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                      <Euro className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-1">Auftragswert</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(contractValue)}
                  </p>
                </CardContent>
              </Card>

              {/* Budget */}
              {canViewFinancials && (
                <Card className="border-2 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950/20 flex items-center justify-center">
                        <Receipt className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-1">Budget</p>
                    <p className="text-3xl font-bold">{formatCurrency(project.budget)}</p>
                    <p className="text-muted-foreground">
                      {formatCurrency(budgetRemaining)} verbleibend
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Margin */}
              {canViewFinancials && (
                <Card className="border-2 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-1">Marge</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(margin)}
                    </p>
                    <p className="text-green-600">+{marginPercentage}%</p>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-1">Zeitplan</p>
                  <p className="font-bold">
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </p>
                  <p className="text-muted-foreground">{remainingDays} Tage verbleibend</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full flex-wrap h-auto">
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="milestones">Meilensteine</TabsTrigger>
                {canViewFinancials && <TabsTrigger value="budget">Budget</TabsTrigger>}
                <TabsTrigger value="time">Zeiterfassung</TabsTrigger>
                <TabsTrigger value="documents">Dokumente</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Projektbeschreibung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{project.description || 'Keine Beschreibung verfügbar.'}</p>
                  </CardContent>
                </Card>

                {project.opportunityTitle && (
                  <Card className="border-2 border-blue-200 dark:border-blue-900">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 text-primary">
                        <CheckCircle className="h-5 w-5" />
                        <p>
                          Erstellt aus Opportunity:{' '}
                          <a href="#" className="hover:underline font-medium">
                            {project.opportunityTitle}
                          </a>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Zeitplan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Startdatum</Label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(project.startDate)}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Enddatum</Label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(project.endDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Zeitfortschritt</span>
                        <span className="text-muted-foreground">
                          {Math.round(timelineElapsed)}%
                        </span>
                      </div>
                      <Progress value={timelineElapsed} className="h-3" />
                      <div className="flex justify-between mt-2 text-muted-foreground">
                        <span>Start</span>
                        <span>{remainingDays} Tage verbleibend</span>
                        <span>Ende</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Projektleiter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {team.length > 0 ? team
                      .filter((member) => member.isProjectLead)
                      .map((lead) => (
                        <div key={lead.id} className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-xl">
                              {lead.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold">{lead.name}</p>
                            <p className="text-muted-foreground">{lead.role}</p>
                            <div className="flex gap-4 mt-2">
                              <a
                                href={`mailto:${lead.email}`}
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <Mail className="h-4 w-4" />
                                <span>{lead.email}</span>
                              </a>
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <Phone className="h-4 w-4" />
                                <span>{lead.phone}</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="text-xl">{project.manager.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold">{project.manager.name}</p>
                                <p className="text-muted-foreground">Projektleiter</p>
                            </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Team-Mitglieder</CardTitle>
                        <CardDescription>{team.length} Mitglieder</CardDescription>
                      </div>
                      {canEdit && (
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Team-Mitglied hinzufügen
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {team.length > 0 ? team.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-4 p-4 border border-border rounded-lg"
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {member.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{member.name}</p>
                              {member.isProjectLead && (
                                <Badge variant="default">Projektleiter</Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground">{member.role}</p>
                            <div className="flex gap-3 mt-1">
                              <a
                                href={`mailto:${member.email}`}
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <Mail className="h-3 w-3" />
                                <span>{member.email}</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <p className="text-muted-foreground text-center py-4">Keine detaillierten Teamdaten verfügbar.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Milestones Tab */}
              <TabsContent value="milestones" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Meilensteine</CardTitle>
                      {canEdit && (
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Meilenstein hinzufügen
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative border-l border-border ml-3 space-y-8 pl-8 py-2">
                      {milestones.length > 0 ? milestones.map((milestone) => (
                        <div key={milestone.id} className="relative">
                          <span
                            className={`absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border ring-4 ring-background ${
                              milestone.status === 'completed'
                                ? 'bg-green-500 border-green-500 text-white'
                                : milestone.status === 'overdue'
                                ? 'bg-red-500 border-red-500 text-white'
                                : 'bg-background border-muted-foreground'
                            }`}
                          >
                            {milestone.status === 'completed' && <CheckCircle className="h-4 w-4" />}
                          </span>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <h3 className="font-semibold leading-none">{milestone.name}</h3>
                            <time className="text-sm text-muted-foreground">{formatDate(milestone.date)}</time>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {milestone.description}
                          </p>
                          {milestone.status === 'overdue' && (
                            <Badge variant="destructive">Überfällig</Badge>
                          )}
                        </div>
                      )) : (
                          <div className="text-muted-foreground">
                              {project.milestones && 'total' in project.milestones ? 
                                `${project.milestones.completed} von ${project.milestones.total} Meilensteinen abgeschlossen (keine Details verfügbar)` 
                                : 'Keine Meilensteine'}
                          </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Budget Tab */}
              {canViewFinancials && (
                <TabsContent value="budget" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle>Budget Übersicht</CardTitle></CardHeader>
                        <CardContent>
                             <div className="space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b">
                                    <span className="font-medium">Budget Gesamt</span>
                                    <span>{formatCurrency(totalBudgetPlanned)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b">
                                    <span className="font-medium">Kosten Aktuell</span>
                                    <span>{formatCurrency(totalBudgetActual)}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-lg">
                                    <span>Verbleibend</span>
                                    <span className={budgetRemaining < 0 ? 'text-red-500' : 'text-green-500'}>{formatCurrency(budgetRemaining)}</span>
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Kostenaufstellung</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {budgetBreakdown.map((item, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{item.category}</span>
                                <span className="text-muted-foreground">
                                  {formatCurrency(item.actual)} / {formatCurrency(item.planned)}
                                </span>
                              </div>
                              <Progress
                                value={(item.actual / item.planned) * 100}
                                className={`h-2 ${
                                  item.actual > item.planned ? 'text-red-500' : ''
                                }`}
                              />
                            </div>
                          ))}
                          {budgetBreakdown.length === 0 && <p className="text-muted-foreground">Keine Details verfügbar</p>}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}

              {/* Time Tracking Tab */}
              <TabsContent value="time" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Zeiterfassung</CardTitle>
                        <CardDescription>{totalHours} Stunden gesamt</CardDescription>
                      </div>
                      <Button onClick={() => setShowTimeDialog(true)}>
                        <Clock className="mr-2 h-4 w-4" />
                        Zeit erfassen
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {timeEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{entry.userName}</p>
                              <p className="text-sm text-muted-foreground">{entry.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{entry.hours} Std.</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(entry.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                       {timeEntries.length === 0 && <p className="text-muted-foreground text-center py-4">Keine Zeiteinträge verfügbar.</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Dokumente</CardTitle>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Hochladen
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium truncate max-w-[200px]">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.type} • {doc.size}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {documents.length === 0 && <p className="text-muted-foreground text-center py-4 col-span-2">Keine Dokumente verfügbar.</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Activity & Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schnellzugriff</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" className="justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  E-Mail an Team
                </Button>
                <Button variant="outline" className="justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  Projektleiter anrufen
                </Button>
                <Button variant="outline" className="justify-start">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Projektordner öffnen
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aktivitäten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">Status geändert</p>
                      <p className="text-xs text-muted-foreground">
                        Von "Planung" zu "In Bearbeitung"
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Vor 2 Tagen</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">Dokument hochgeladen</p>
                      <p className="text-xs text-muted-foreground">Vertrag_Signed.pdf</p>
                      <p className="text-xs text-muted-foreground mt-1">Vor 5 Tagen</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">Neuer Meilenstein</p>
                      <p className="text-xs text-muted-foreground">Material bestellt</p>
                      <p className="text-xs text-muted-foreground mt-1">Vor 1 Woche</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
