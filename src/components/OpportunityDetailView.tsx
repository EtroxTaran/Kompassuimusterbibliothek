import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
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
  Trash2,
  Building2,
  Euro,
  TrendingUp,
  Info,
  Calendar,
  Bell,
  Plus,
  CheckCircle,
  Circle,
  Clock,
  Phone,
  Mail,
  Video,
  FileText,
  Upload,
  Download,
  ExternalLink,
  User,
  FolderOpen,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

// User role type
type UserRole = 'GF' | 'BUCH' | 'PLAN' | 'ADM' | 'KALK';

// Opportunity status type
type OpportunityStatus = 'new' | 'qualification' | 'proposal' | 'negotiation' | 'won' | 'lost';

// Contact type
interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  isDecisionMaker: boolean;
}

// Activity type
interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  subject: string;
  date: string;
  time: string;
  notes?: string;
  createdBy: string;
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

// Opportunity type
interface Opportunity {
  id: string;
  title: string;
  customerId: string;
  customerName: string;
  status: OpportunityStatus;
  estimatedValue: number;
  probability: number;
  ownerId: string;
  ownerName: string;
  description: string;
  tags: string[];
  expectedCloseDate: string;
  nextStep: string;
  followUpDate: string;
  createdAt: string;
  lastActivityDate: string;
  projectId?: string;
  projectCode?: string;
  contacts: Contact[];
  activities: Activity[];
  documents: Document[];
}

// Mock opportunity data
const mockOpportunity: Opportunity = {
  id: '1',
  title: 'Ladeneinrichtung Neueröffnung',
  customerId: '1',
  customerName: 'REWE München Süd',
  status: 'negotiation',
  estimatedValue: 125000,
  probability: 75,
  ownerId: '1',
  ownerName: 'Michael Schmidt',
  description:
    'Kunde plant neue Filiale in München Süd und benötigt komplette Ladeneinrichtung inkl. Kühlsysteme, Regale, Beleuchtung und Kassensysteme. Zeitplan ist sehr ambitioniert - Eröffnung geplant für Ende Q4 2024. Großes Interesse an nachhaltigen Lösungen und energieeffizienten Kühlsystemen.',
  tags: ['Großprojekt', 'Q4', 'Zeitkritisch'],
  expectedCloseDate: '2024-12-15',
  nextStep: 'Angebot präsentieren, Entscheidung Q4',
  followUpDate: '2024-11-20',
  createdAt: '2024-11-01',
  lastActivityDate: '2024-11-10',
  contacts: [
    {
      id: '1',
      name: 'Dr. Anna Meier',
      position: 'Geschäftsführerin',
      email: 'a.meier@rewe-muenchen-sued.de',
      isDecisionMaker: true,
    },
    {
      id: '2',
      name: 'Thomas Weber',
      position: 'Einkaufsleiter',
      email: 't.weber@rewe-muenchen-sued.de',
      isDecisionMaker: false,
    },
  ],
  activities: [
    {
      id: '1',
      type: 'meeting',
      subject: 'Erstes Kennenlernen und Bedarfsanalyse',
      date: '2024-11-05',
      time: '14:00',
      notes: 'Sehr positive Stimmung, Budget vorhanden',
      createdBy: 'Michael Schmidt',
    },
    {
      id: '2',
      type: 'call',
      subject: 'Nachfrage zu technischen Details',
      date: '2024-11-08',
      time: '10:30',
      notes: 'Besonderes Interesse an Kühlsystemen',
      createdBy: 'Michael Schmidt',
    },
  ],
  documents: [
    {
      id: '1',
      name: 'Angebot_Ladeneinrichtung_REWE.pdf',
      type: 'Angebot',
      size: '2.4 MB',
      uploadedAt: '2024-11-10',
      uploadedBy: 'Michael Schmidt',
    },
    {
      id: '2',
      name: 'Präsentation_Kühlsysteme.pptx',
      type: 'Präsentation',
      size: '8.2 MB',
      uploadedAt: '2024-11-08',
      uploadedBy: 'Michael Schmidt',
    },
  ],
};

// Status flow configuration
const statusFlow: { status: OpportunityStatus; label: string }[] = [
  { status: 'new', label: 'Neu' },
  { status: 'qualification', label: 'Qualifizierung' },
  { status: 'proposal', label: 'Angebot' },
  { status: 'negotiation', label: 'Verhandlung' },
  { status: 'won', label: 'Gewonnen' },
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

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE');
}

// Calculate days ago
function daysAgo(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Opportunity Detail View
function OpportunityDetailView({
  opportunity = mockOpportunity,
  currentUserRole = 'PLAN',
  currentUserId = '1',
}: {
  opportunity?: Opportunity;
  currentUserRole?: UserRole;
  currentUserId?: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<OpportunityStatus>(opportunity.status);

  const isOwner = opportunity.ownerId === currentUserId;
  const canEdit =
    currentUserRole === 'GF' ||
    currentUserRole === 'PLAN' ||
    (currentUserRole === 'ADM' && isOwner);
  const canDelete = currentUserRole === 'GF' || currentUserRole === 'PLAN';
  const isReadOnly = currentUserRole === 'KALK';

  const weightedValue = (opportunity.estimatedValue * opportunity.probability) / 100;
  const currentStatusIndex = statusFlow.findIndex((s) => s.status === opportunity.status);

  const handleDelete = () => {
    toast.success('Opportunity gelöscht', {
      description: `${opportunity.title} wurde erfolgreich gelöscht`,
    });
    setShowDeleteDialog(false);
  };

  const handleStatusChange = () => {
    toast.success('Status aktualisiert', {
      description: `Status geändert zu: ${statusFlow.find((s) => s.status === newStatus)?.label}`,
    });
    setShowStatusDialog(false);
  };

  const handleConvertToProject = () => {
    toast.success('Projekt erstellt', {
      description: 'Opportunity wurde erfolgreich in Projekt umgewandelt',
    });
  };

  const getStatusBadgeVariant = (status: OpportunityStatus) => {
    switch (status) {
      case 'new':
        return 'secondary';
      case 'qualification':
        return 'outline';
      case 'proposal':
        return 'outline';
      case 'negotiation':
        return 'default';
      case 'won':
        return 'default';
      case 'lost':
        return 'destructive';
      default:
        return 'secondary';
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
              Opportunities
            </a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{opportunity.title}</span>
          </div>

          {/* Opportunity Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="mb-3">{opportunity.title}</h1>

              <div className="flex flex-wrap items-center gap-3">
                {/* Customer */}
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <Building2 className="h-4 w-4" />
                  {opportunity.customerName}
                  <ExternalLink className="h-3 w-3" />
                </a>

                {/* Status Badge */}
                <Badge
                  variant={getStatusBadgeVariant(opportunity.status)}
                  className="px-3 py-1"
                >
                  {statusFlow.find((s) => s.status === opportunity.status)?.label ||
                    opportunity.status}
                </Badge>

                {/* Owner */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {opportunity.ownerName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">{opportunity.ownerName}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {canEdit && (
                <>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Bearbeiten
                  </Button>
                  <Button onClick={() => setShowStatusDialog(true)}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Status ändern
                  </Button>
                </>
              )}
              {canDelete && (
                <Button variant="outline" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Estimated Value */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                    <Euro className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Geschätzter Wert</p>
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(opportunity.estimatedValue)}
                </p>
              </CardContent>
            </Card>

            {/* Probability */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Wahrscheinlichkeit</p>
                <div className="flex items-center gap-4">
                  <p className="text-4xl font-bold">{opportunity.probability}%</p>
                  <div className="flex-1">
                    <Progress value={opportunity.probability} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weighted Value */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                    <Info className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Gewichteter Wert</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(weightedValue)}</p>
                <p className="text-muted-foreground">
                  {formatCurrency(opportunity.estimatedValue)} × {opportunity.probability}%
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Flow */}
            <Card>
              <CardHeader>
                <CardTitle>Status-Flow</CardTitle>
                <CardDescription>Aktueller Stand im Verkaufsprozess</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Desktop: Horizontal Flow */}
                  <div className="hidden md:flex items-center justify-between">
                    {statusFlow.map((step, index) => {
                      const isPast = index < currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const isFuture = index > currentStatusIndex;
                      const isLast = index === statusFlow.length - 1;

                      return (
                        <div key={step.status} className="flex items-center flex-1">
                          <div className="flex flex-col items-center flex-1">
                            {/* Circle */}
                            <div
                              className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all ${
                                isPast
                                  ? 'bg-primary border-primary text-primary-foreground'
                                  : isCurrent
                                  ? 'bg-amber-500 border-amber-500 text-white'
                                  : 'bg-background border-muted-foreground/30 text-muted-foreground'
                              }`}
                            >
                              {isPast ? (
                                <CheckCircle className="h-6 w-6" />
                              ) : (
                                <Circle className="h-6 w-6" />
                              )}
                            </div>
                            {/* Label */}
                            <p
                              className={`mt-2 text-center ${
                                isCurrent ? 'font-semibold' : 'text-muted-foreground'
                              }`}
                            >
                              {step.label}
                            </p>
                          </div>

                          {/* Connector Line */}
                          {!isLast && (
                            <div
                              className={`h-0.5 flex-1 mx-2 ${
                                isPast ? 'bg-primary' : 'bg-muted-foreground/30'
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile: Vertical Flow */}
                  <div className="md:hidden space-y-4">
                    {statusFlow.map((step, index) => {
                      const isPast = index < currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;

                      return (
                        <div key={step.status} className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                              isPast
                                ? 'bg-primary border-primary text-primary-foreground'
                                : isCurrent
                                ? 'bg-amber-500 border-amber-500 text-white'
                                : 'bg-background border-muted-foreground/30 text-muted-foreground'
                            }`}
                          >
                            {isPast ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <Circle className="h-5 w-5" />
                            )}
                          </div>
                          <p className={isCurrent ? 'font-semibold' : 'text-muted-foreground'}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opportunity Details */}
            <Card>
              <CardHeader>
                <CardTitle>Opportunity-Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description */}
                <div>
                  <h4 className="mb-2">Beschreibung</h4>
                  <p className="text-muted-foreground">{opportunity.description}</p>
                </div>

                <Separator />

                {/* Tags */}
                <div>
                  <h4 className="mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Dates and Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h4>Erwarteter Abschluss</h4>
                    </div>
                    <p>{formatDate(opportunity.expectedCloseDate)}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <h4>Follow-up</h4>
                    </div>
                    <p>{formatDate(opportunity.followUpDate)}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2">Nächster Schritt</h4>
                  <p className="text-muted-foreground">{opportunity.nextStep}</p>
                </div>
              </CardContent>
            </Card>

            {/* Related Project */}
            {opportunity.projectCode && (
              <Card className="border-2 border-green-200 dark:border-green-900">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <CardTitle>Zugehöriges Projekt</CardTitle>
                  </div>
                  <CardDescription>
                    Diese Opportunity wurde in ein Projekt umgewandelt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="#"
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{opportunity.projectCode}</p>
                        <p className="text-muted-foreground">Aktiv</p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            )}

            {/* Contact Persons */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Kontaktpersonen</CardTitle>
                    <CardDescription>
                      {opportunity.contacts.length}{' '}
                      {opportunity.contacts.length === 1 ? 'Kontakt' : 'Kontakte'}
                    </CardDescription>
                  </div>
                  {canEdit && (
                    <Button size="sm" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Kontakt hinzufügen
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {opportunity.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {contact.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{contact.name}</p>
                            {contact.isDecisionMaker && (
                              <Badge variant="default" className="text-xs">
                                Entscheider
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">{contact.position}</p>
                        </div>
                      </div>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Aktivitätsverlauf</CardTitle>
                    <CardDescription>
                      {opportunity.activities.length} Aktivitäten
                    </CardDescription>
                  </div>
                  {canEdit && (
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Aktivität hinzufügen
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunity.activities.map((activity, index) => {
                    const isLast = index === opportunity.activities.length - 1;
                    const iconMap = {
                      call: Phone,
                      email: Mail,
                      meeting: Video,
                      note: FileText,
                    };
                    const Icon = iconMap[activity.type];

                    return (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-10 w-10 rounded-full bg-accent/60 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          {!isLast && (
                            <div className="w-0.5 flex-1 bg-border mt-2 min-h-[40px]" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <h4 className="mb-1">{activity.subject}</h4>
                          <p className="text-muted-foreground mb-1">
                            {formatDate(activity.date)} • {activity.time}
                          </p>
                          {activity.notes && (
                            <p className="text-muted-foreground">{activity.notes}</p>
                          )}
                          <p className="text-muted-foreground">von {activity.createdBy}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Dokumente</CardTitle>
                    <CardDescription>
                      {opportunity.documents.length}{' '}
                      {opportunity.documents.length === 1 ? 'Dokument' : 'Dokumente'}
                    </CardDescription>
                  </div>
                  {canEdit && (
                    <Button size="sm" variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Hochladen
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {opportunity.documents.map((doc) => (
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
                            {doc.type} • {doc.size} • {formatDate(doc.uploadedAt)}
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
                    <span className="text-muted-foreground">Erstellt</span>
                    <span>{formatDate(opportunity.createdAt)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Alter</span>
                    <span>{daysAgo(opportunity.createdAt)} Tage</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Letzte Aktivität</span>
                    <span>Vor {daysAgo(opportunity.lastActivityDate)} Tagen</span>
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
                    <>
                      <Button className="w-full" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Aktivität hinzufügen
                      </Button>
                      <Button className="w-full" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Angebot erstellen
                      </Button>
                      {opportunity.status === 'won' && !opportunity.projectCode && (
                        <Button className="w-full" onClick={handleConvertToProject}>
                          <FolderOpen className="mr-2 h-4 w-4" />
                          In Projekt umwandeln
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Warning for Read-Only */}
              {isReadOnly && (
                <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/10">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-800 dark:text-amber-400">
                          Nur-Lesen-Modus
                        </p>
                        <p className="text-muted-foreground">
                          Sie haben keine Berechtigung, diese Opportunity zu bearbeiten.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opportunity löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie {opportunity.title} wirklich löschen? Diese Aktion kann nicht
              rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Status ändern</DialogTitle>
            <DialogDescription>
              Wählen Sie den neuen Status für diese Opportunity
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OpportunityStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusFlow.map((status) => (
                  <SelectItem key={status.status} value={status.status}>
                    {status.label}
                  </SelectItem>
                ))}
                <SelectItem value="lost">Verloren</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleStatusChange}>Status aktualisieren</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Demo wrapper
export function OpportunityDetailViewDemo() {
  const [currentRole, setCurrentRole] = useState<UserRole>('PLAN');

  return (
    <div className="space-y-6">
      {/* Role Switcher for Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Opportunity Details - Rollenansicht</CardTitle>
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
              variant={currentRole === 'ADM' ? 'default' : 'outline'}
              onClick={() => setCurrentRole('ADM')}
            >
              ADM (Eigene)
            </Button>
            <Button
              variant={currentRole === 'KALK' ? 'default' : 'outline'}
              onClick={() => setCurrentRole('KALK')}
            >
              KALK (Nur-Lesen)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Opportunity Detail View */}
      <OpportunityDetailView currentUserRole={currentRole} />
    </div>
  );
}