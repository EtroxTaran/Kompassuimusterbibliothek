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

// User role type
type UserRole = 'GF' | 'BUCH' | 'PLAN' | 'ADM' | 'KALK';

// Project status type
type ProjectStatus = 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'archived';

// Team member type
interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isProjectLead: boolean;
  avatarUrl?: string;
}

// Milestone type
interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'pending' | 'overdue';
  description: string;
}

// Budget item type
interface BudgetItem {
  category: string;
  planned: number;
  actual: number;
}

// Time entry type
interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  date: string;
  hours: number;
  description: string;
}

// Document type
interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Project type
interface Project {
  id: string;
  number: string;
  name: string;
  customerId: string;
  customerName: string;
  status: ProjectStatus;
  description: string;
  opportunityId?: string;
  opportunityTitle?: string;
  startDate: string;
  endDate: string;
  progress: number;
  contractValue: number;
  budget: number;
  margin: number;
  projectLeadId: string;
  team: TeamMember[];
  milestones: Milestone[];
  budgetBreakdown: BudgetItem[];
  timeEntries: TimeEntry[];
  documents: Document[];
  createdAt: string;
}

// Mock project data
const mockProject: Project = {
  id: '1',
  number: 'P-2024-B023',
  name: 'REWE München Süd - Ladeneinrichtung',
  customerId: '1',
  customerName: 'REWE München Süd',
  status: 'in-progress',
  description:
    'Komplette Ladeneinrichtung für neue REWE Filiale in München Süd. Umfasst Kühlsysteme, Regale, Beleuchtung, Kassensysteme und alle notwendigen Montagearbeiten. Projekt muss bis Ende Februar 2025 abgeschlossen sein für geplante Eröffnung im März.',
  opportunityId: '1',
  opportunityTitle: 'Ladeneinrichtung Neueröffnung',
  startDate: '2024-12-01',
  endDate: '2025-02-28',
  progress: 65,
  contractValue: 450000,
  budget: 380000,
  margin: 70000,
  projectLeadId: '1',
  team: [
    {
      id: '1',
      name: 'Thomas Fischer',
      role: 'Projektleiter',
      email: 't.fischer@kompass.de',
      phone: '+49 89 1234 5601',
      isProjectLead: true,
    },
    {
      id: '2',
      name: 'Anna Weber',
      role: 'Kalkulation',
      email: 'a.weber@kompass.de',
      phone: '+49 89 1234 5602',
      isProjectLead: false,
    },
    {
      id: '3',
      name: 'Michael Schmidt',
      role: 'Montage',
      email: 'm.schmidt@kompass.de',
      phone: '+49 89 1234 5603',
      isProjectLead: false,
    },
    {
      id: '4',
      name: 'Sarah Müller',
      role: 'Administration',
      email: 's.mueller@kompass.de',
      phone: '+49 89 1234 5604',
      isProjectLead: false,
    },
  ],
  milestones: [
    {
      id: '1',
      name: 'Vertragsunterzeichnung',
      date: '2024-12-01',
      status: 'completed',
      description: 'Vertrag mit Kunde unterzeichnet',
    },
    {
      id: '2',
      name: 'Planung abgeschlossen',
      date: '2024-12-15',
      status: 'completed',
      description: 'Detailplanung und technische Zeichnungen fertiggestellt',
    },
    {
      id: '3',
      name: 'Material bestellt',
      date: '2024-12-20',
      status: 'completed',
      description: 'Alle Materialien bei Lieferanten bestellt',
    },
    {
      id: '4',
      name: 'Montage begonnen',
      date: '2025-01-08',
      status: 'completed',
      description: 'Beginn der Montagearbeiten vor Ort',
    },
    {
      id: '5',
      name: 'Kühlsysteme installiert',
      date: '2025-01-22',
      status: 'pending',
      description: 'Installation aller Kühlsysteme',
    },
    {
      id: '6',
      name: 'Endabnahme',
      date: '2025-02-25',
      status: 'pending',
      description: 'Finale Abnahme durch Kunden',
    },
  ],
  budgetBreakdown: [
    { category: 'Material', planned: 200000, actual: 185000 },
    { category: 'Personal', planned: 120000, actual: 95000 },
    { category: 'Fremdleistungen', planned: 50000, actual: 48000 },
    { category: 'Sonstiges', planned: 10000, actual: 7500 },
  ],
  timeEntries: [
    {
      id: '1',
      userId: '1',
      userName: 'Thomas Fischer',
      date: '2025-01-10',
      hours: 8,
      description: 'Projektleitung, Baustellenbegehung',
    },
    {
      id: '2',
      userId: '3',
      userName: 'Michael Schmidt',
      date: '2025-01-10',
      hours: 9,
      description: 'Montagearbeiten Regalaufbau',
    },
    {
      id: '3',
      userId: '1',
      userName: 'Thomas Fischer',
      date: '2025-01-11',
      hours: 6,
      description: 'Abstimmung mit Kunde, Materialprüfung',
    },
  ],
  documents: [
    {
      id: '1',
      name: 'Vertrag_REWE_München_Süd.pdf',
      type: 'Vertrag',
      size: '1.2 MB',
      uploadedAt: '2024-12-01',
      uploadedBy: 'Thomas Fischer',
    },
    {
      id: '2',
      name: 'Technische_Planung.dwg',
      type: 'Plan',
      size: '8.5 MB',
      uploadedAt: '2024-12-15',
      uploadedBy: 'Anna Weber',
    },
    {
      id: '3',
      name: 'Fortschrittsbericht_KW02.pdf',
      type: 'Bericht',
      size: '450 KB',
      uploadedAt: '2025-01-12',
      uploadedBy: 'Thomas Fischer',
    },
  ],
  createdAt: '2024-12-01',
};

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
function ProjectDetailView({
  project = mockProject,
  currentUserRole = 'PLAN',
  currentUserId = '1',
}: {
  project?: Project;
  currentUserRole?: UserRole;
  currentUserId?: string;
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTimeDialog, setShowTimeDialog] = useState(false);

  const isTeamMember = project.team.some((member) => member.id === currentUserId);
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

  const completedMilestones = project.milestones.filter((m) => m.status === 'completed').length;
  const totalMilestones = project.milestones.length;
  const marginPercentage = ((project.margin / project.contractValue) * 100).toFixed(1);
  const timelineElapsed = elapsedPercentage(project.startDate, project.endDate);
  const remainingDays = daysRemaining(project.endDate);

  const totalBudgetPlanned = project.budgetBreakdown.reduce((sum, item) => sum + item.planned, 0);
  const totalBudgetActual = project.budgetBreakdown.reduce((sum, item) => sum + item.actual, 0);
  const budgetRemaining = totalBudgetPlanned - totalBudgetActual;
  const budgetHealth =
    totalBudgetActual / totalBudgetPlanned < 0.8
      ? 'good'
      : totalBudgetActual / totalBudgetPlanned < 0.95
      ? 'warning'
      : 'critical';

  const totalHours = project.timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

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
      case 'in-progress':
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
            In Bearbeitung
          </Badge>
        );
      case 'on-hold':
        return <Badge variant="outline">Pausiert</Badge>;
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
            Abgeschlossen
          </Badge>
        );
      case 'archived':
        return <Badge variant="secondary">Archiviert</Badge>;
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
                {project.customerName}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {canEdit && (
                <>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Bearbeiten
                  </Button>
                  <Button variant="outline" onClick={() => setShowTimeDialog(true)}>
                    <Clock className="mr-2 h-4 w-4" />
                    Zeiterfassung
                  </Button>
                </>
              )}
              <Button variant="outline">
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
                    {formatCurrency(project.contractValue)}
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
                      {formatCurrency(project.margin)}
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
                    <p className="text-muted-foreground">{project.description}</p>
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
                    {project.team
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
                      ))}
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
                        <CardDescription>{project.team.length} Mitglieder</CardDescription>
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
                      {project.team.map((member) => (
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
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Milestones Tab */}
              <TabsContent value="milestones" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Meilensteine</CardTitle>
                        <CardDescription>
                          {completedMilestones} von {totalMilestones} abgeschlossen
                        </CardDescription>
                      </div>
                      {canEdit && (
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Meilenstein hinzufügen
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.milestones.map((milestone, index) => {
                        const isLast = index === project.milestones.length - 1;
                        return (
                          <div key={milestone.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                                  milestone.status === 'completed'
                                    ? 'bg-green-600 border-green-600 text-white'
                                    : milestone.status === 'overdue'
                                    ? 'bg-red-600 border-red-600 text-white'
                                    : 'bg-background border-muted-foreground/30 text-muted-foreground'
                                }`}
                              >
                                {milestone.status === 'completed' ? (
                                  <CheckCircle className="h-5 w-5" />
                                ) : (
                                  <Circle className="h-5 w-5" />
                                )}
                              </div>
                              {!isLast && (
                                <div
                                  className={`w-0.5 flex-1 mt-2 min-h-[40px] ${
                                    milestone.status === 'completed'
                                      ? 'bg-green-600'
                                      : 'bg-border'
                                  }`}
                                />
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <div className="flex items-center justify-between mb-1">
                                <h4>{milestone.name}</h4>
                                {milestone.status === 'completed' && (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
                                    Abgeschlossen
                                  </Badge>
                                )}
                                {milestone.status === 'pending' && (
                                  <Badge variant="outline">Ausstehend</Badge>
                                )}
                                {milestone.status === 'overdue' && (
                                  <Badge variant="destructive">Überfällig</Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground mb-1">
                                {formatDate(milestone.date)}
                              </p>
                              <p className="text-muted-foreground">{milestone.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Budget Tab */}
              {canViewFinancials && (
                <TabsContent value="budget" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Budget-Übersicht</CardTitle>
                      <CardDescription>
                        Geplant: {formatCurrency(totalBudgetPlanned)} • Ist:{' '}
                        {formatCurrency(totalBudgetActual)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div
                        className={`p-4 rounded-lg border ${
                          budgetHealth === 'good'
                            ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                            : budgetHealth === 'warning'
                            ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
                            : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle
                            className={`h-5 w-5 ${
                              budgetHealth === 'good'
                                ? 'text-green-600'
                                : budgetHealth === 'warning'
                                ? 'text-amber-600'
                                : 'text-red-600'
                            }`}
                          />
                          <p className="font-semibold">
                            {budgetHealth === 'good'
                              ? 'Budget in gutem Zustand'
                              : budgetHealth === 'warning'
                              ? 'Budget-Warnung'
                              : 'Budget kritisch'}
                          </p>
                        </div>
                        <p className="text-muted-foreground">
                          {((totalBudgetActual / totalBudgetPlanned) * 100).toFixed(1)}% des Budgets
                          verbraucht
                        </p>
                      </div>

                      <Separator />

                      {project.budgetBreakdown.map((item) => {
                        const percentage = (item.actual / item.planned) * 100;
                        return (
                          <div key={item.category}>
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{item.category}</span>
                              <span className="text-muted-foreground">
                                {formatCurrency(item.actual)} / {formatCurrency(item.planned)}
                              </span>
                            </div>
                            <Progress value={percentage} className="h-3" />
                            <div className="flex justify-between mt-1 text-muted-foreground">
                              <span>{percentage.toFixed(1)}%</span>
                              <span>
                                {formatCurrency(item.planned - item.actual)} verbleibend
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Time Tracking Tab */}
              <TabsContent value="time" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Zeiterfassung</CardTitle>
                        <CardDescription>
                          Gesamt: {totalHours} Stunden erfasst
                        </CardDescription>
                      </div>
                      {canEdit && (
                        <Button size="sm" onClick={() => setShowTimeDialog(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Zeit erfassen
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-border bg-muted/50">
                          <tr>
                            <th className="px-4 py-3 text-left">Benutzer</th>
                            <th className="px-4 py-3 text-left">Datum</th>
                            <th className="px-4 py-3 text-right">Stunden</th>
                            <th className="px-4 py-3 text-left">Beschreibung</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.timeEntries.map((entry) => (
                            <tr key={entry.id} className="border-b border-border">
                              <td className="px-4 py-3">{entry.userName}</td>
                              <td className="px-4 py-3">{formatDate(entry.date)}</td>
                              <td className="px-4 py-3 text-right">{entry.hours}</td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {entry.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="border-t-2 border-border bg-muted/30">
                          <tr>
                            <td className="px-4 py-3 font-semibold" colSpan={2}>
                              Gesamt
                            </td>
                            <td className="px-4 py-3 text-right font-semibold">{totalHours}</td>
                            <td className="px-4 py-3"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Dokumente</CardTitle>
                        <CardDescription>
                          {project.documents.length}{' '}
                          {project.documents.length === 1 ? 'Dokument' : 'Dokumente'}
                        </CardDescription>
                      </div>
                      {canEdit && (
                        <Button size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Hochladen
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="h-10 w-10 rounded bg-accent/60 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-muted-foreground">
                                {doc.type} • {doc.size} • {formatDate(doc.uploadedAt)} • von{' '}
                                {doc.uploadedBy}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Schnellinfo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    {getStatusBadge()}
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fortschritt</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Verbleibend</span>
                    <span className="font-semibold">{remainingDays} Tage</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Team</span>
                    <span className="font-semibold">{project.team.length} Mitarbeiter</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Schnellaktionen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {canEdit && (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => setShowTimeDialog(true)}
                    >
                      <Timer className="mr-2 h-4 w-4" />
                      Zeit erfassen
                    </Button>
                  )}
                  <Button className="w-full" variant="outline">
                    <FileBarChart className="mr-2 h-4 w-4" />
                    Bericht erstellen
                  </Button>
                  {canViewFinancials && (
                    <Button className="w-full" variant="outline">
                      <Receipt className="mr-2 h-4 w-4" />
                      Rechnung erstellen
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Time Tracking Dialog */}
      <Dialog open={showTimeDialog} onOpenChange={setShowTimeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zeit erfassen</DialogTitle>
            <DialogDescription>
              Erfassen Sie Ihre Arbeitszeit für dieses Projekt
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="time-date">Datum</Label>
              <Input id="time-date" type="date" />
            </div>
            <div>
              <Label htmlFor="time-hours">Stunden</Label>
              <Input id="time-hours" type="number" step="0.5" placeholder="8.0" />
            </div>
            <div>
              <Label htmlFor="time-description">Beschreibung</Label>
              <Textarea
                id="time-description"
                placeholder="Was haben Sie gemacht?"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTimeDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleTimeTracking}>
              <Clock className="mr-2 h-4 w-4" />
              Zeit erfassen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Demo wrapper
export function ProjectDetailViewDemo() {
  const [currentRole, setCurrentRole] = useState<UserRole>('PLAN');

  return (
    <div className="space-y-6">
      {/* Role Switcher for Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Projektdetails - Rollenansicht</CardTitle>
          <CardDescription>
            Wechseln Sie zwischen Rollen, um unterschiedliche Berechtigungen zu sehen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={currentRole === 'GF' ? 'default' : 'outline'}
              onClick={() => setCurrentRole('GF')}
            >
              GF (Voller Zugriff)
            </Button>
            <Button
              variant={currentRole === 'PLAN' ? 'default' : 'outline'}
              onClick={() => setCurrentRole('PLAN')}
            >
              PLAN (Voller Zugriff)
            </Button>
            <Button
              variant={currentRole === 'BUCH' ? 'default' : 'outline'}
              onClick={() => setCurrentRole('BUCH')}
            >
              BUCH (Finanzen)
            </Button>
            <Button
              variant={currentRole === 'ADM' ? 'default' : 'outline'}
              onClick={() => setCurrentRole('ADM')}
            >
              ADM (Zugewiesen)
            </Button>
            <Button
              variant={currentRole === 'KALK' ? 'default' : 'outline'}
              onClick={() => setCurrentRole('KALK')}
            >
              KALK (Zugewiesen)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Project Detail View */}
      <ProjectDetailView currentUserRole={currentRole} />
    </div>
  );
}