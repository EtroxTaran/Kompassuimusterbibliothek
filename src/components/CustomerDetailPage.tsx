import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { toast } from 'sonner@2.0.3';
import {
  ChevronRight,
  Edit,
  Plus,
  MoreVertical,
  Copy,
  UserX,
  Trash2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Star,
  TrendingUp,
  Euro,
  Calendar,
  Building2,
  Users,
  FileText,
  Clock,
  Target,
  FolderOpen,
  Upload,
  Download,
  Share2,
  Lock,
  ExternalLink,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Briefcase,
  Clock as ClockIcon,
} from 'lucide-react';
import { Customer, Project } from './providers/DataProvider';
import { LocationListView, Location } from './LocationListDemo';
import { ContactListView, Contact } from './ContactListDemo';
import { OpportunityPipelineView, Opportunity } from './OpportunityPipelineDemo';
import { ProjectTableView } from './ProjectPortfolioDemo';
import { ActivityTimeline, Activity } from './ActivityTimelineDemo';

// User role type
type UserRole = 'GF' | 'BUCH' | 'PLAN' | 'ADM' | 'KALK';

// Mock metrics
const mockMetrics = {
  opportunities: { active: 2, totalValue: 160000 },
  projects: { active: 1, totalVolume: 450000 },
  revenue: { thisYear: 450000 },
  lastActivity: { daysAgo: 1, type: 'Telefonat' },
};

// Mock projects specific to this customer
const customerProjects: Project[] = [
  {
    id: '1',
    number: 'P-2024-B023',
    customer: 'Hofladen Müller GmbH',
    customerId: '1',
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
    customerId: '1',
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
];

// Mock locations for this customer
const customerLocations: Location[] = [
  {
    id: '1',
    name: 'Filiale München Süd',
    type: 'branch',
    status: 'active',
    isPrimary: true,
    address: {
      street: 'Industriestraße 42',
      postalCode: '81379',
      city: 'München',
      country: 'Deutschland',
    },
    primaryContact: {
      name: 'Hans Müller',
      phone: '+49-89-1234567',
    },
    additionalContacts: 2,
    deliveryNotes: 'Hintereingang nutzen. Parkplätze vorhanden.',
  },
  {
    id: '2',
    name: 'Hauptsitz',
    type: 'headquarter',
    status: 'active',
    isPrimary: false,
    address: {
      street: 'Hauptstraße 1',
      postalCode: '80331',
      city: 'München',
      country: 'Deutschland',
    },
    primaryContact: {
      name: 'Maria Schmidt',
      phone: '+49-89-9876543',
    },
  },
];

// Mock contacts for this customer
const customerContacts: Contact[] = [
    {
    id: '1',
    firstName: 'Hans',
    lastName: 'Müller',
    title: 'Dr.',
    position: 'Geschäftsführer',
    decisionRole: 'decision-maker',
    authorityLevel: 'final',
    approvalLimit: 50000,
    mobile: '+49-170-1234567',
    phone: '+49-89-1234567',
    email: 'h.mueller@hofladen-mueller.de',
    preferredContact: 'email',
    assignedLocations: ['Filiale München Süd', 'Hauptsitz'],
    isPrimaryContact: true,
    primaryForLocations: ['Filiale München Süd', 'Hauptsitz'],
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    canApprove: true,
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Schmidt',
    position: 'Einkaufsleiterin',
    decisionRole: 'key-influencer',
    authorityLevel: 'high',
    approvalLimit: 20000,
    phone: '+49-89-9876543',
    email: 'm.schmidt@hofladen-mueller.de',
    preferredContact: 'phone',
    functions: ['Einkaufsleiterin'],
    assignedLocations: ['Hauptsitz'],
    isPrimaryContact: true,
    primaryForLocations: ['Hauptsitz'],
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    canApprove: true,
  },
];

// Mock opportunities
const customerOpportunities: Opportunity[] = [
    {
    id: '1',
    title: 'Ladeneinrichtung Neueröffnung',
    customer: 'Hofladen Müller GmbH',
    value: 125000,
    probability: 60,
    expectedCloseDate: '2025-02-15',
    owner: { name: 'Michael Schmidt', initials: 'MS' },
    tags: ['Großprojekt', 'Q1'],
    lastActivity: 'Vor 2 Tagen',
    status: 'proposal',
  },
  {
    id: '2',
    title: 'Beleuchtung LED Umstellung',
    customer: 'Hofladen Müller GmbH',
    value: 35000,
    probability: 90,
    expectedCloseDate: '2025-01-15',
    owner: { name: 'Thomas Müller', initials: 'TM' },
    lastActivity: 'Vor 1 Tag',
    status: 'negotiation',
  },
];

// Mock activities
const customerActivities: Activity[] = [
    {
    id: '1',
    type: 'phone',
    title: 'Telefonat mit Hr. Müller',
    customerId: '1',
    customerName: 'Hofladen Müller GmbH',
    contactName: 'Hans Müller',
    contactRole: 'Geschäftsführer',
    description:
      'Besprochen: Neue Filiale in München Süd geplant für Q1 2025. Interesse an Ladeneinrichtung im Wert von ca. 120.000 €. Wünscht detailliertes Angebot bis Ende des Monats.',
    userId: '1',
    userName: 'Michael Schmidt',
    duration: 15,
    followUp: '2024-11-22',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'note',
    title: 'Kundennotiz',
    customerId: '1',
    customerName: 'Hofladen Müller GmbH',
    description: 'Kunde bevorzugt natürliche Materialien (Holz, keine Kunststoffe). Budget flexibel.',
    userId: '1',
    userName: 'Michael Schmidt',
    isPrivate: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    type: 'visit',
    title: 'Vor-Ort-Termin',
    customerId: '1',
    customerName: 'Hofladen Müller GmbH',
    contactName: 'Hans Müller',
    description: 'Standortbesichtigung für neue Filiale. Räumlichkeiten geprüft, Maße aufgenommen.',
    userId: '3',
    userName: 'Thomas Fischer',
    duration: 90,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
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

// Customer Detail Page
export function CustomerDetailPage({
  customer,
  currentUserRole = 'PLAN',
  currentUserId = '1',
  onBack,
}: {
  customer: Customer;
  currentUserRole?: UserRole;
  currentUserId?: string;
  onBack?: () => void;
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Assuming ownerId is consistent with customer object
  const isOwner = customer.ownerId === currentUserId;
  const canEdit = currentUserRole === 'GF' || currentUserRole === 'PLAN' || (currentUserRole === 'ADM' && isOwner);
  const canDelete = currentUserRole === 'GF';
  const canViewFinancials = currentUserRole === 'GF' || currentUserRole === 'BUCH';

  const ratingStars = { A: 5, B: 4, C: 3, D: 2 }[customer.rating] || 0;

  const handleEdit = () => {
    toast.success('Bearbeiten-Modus aktiviert');
  };

  const handleDelete = () => {
    toast.success('Kunde gelöscht', {
      description: `${customer.companyName} wurde erfolgreich gelöscht`,
    });
    setShowDeleteDialog(false);
  };

  const handleDuplicate = () => {
    toast.success('Kunde dupliziert');
  };

  const handleDeactivate = () => {
    toast.success('Kunde deaktiviert');
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb / Back */}
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="pl-0 gap-1 hover:pl-1 transition-all">
                <ArrowLeft className="h-4 w-4" />
                Zurück zur Liste
            </Button>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            <span className="text-foreground font-medium">{customer.companyName}</span>
          </div>

          {/* Customer Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{customer.companyName}</h1>
                <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                  {customer.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: ratingStars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
                    {customer.rating}
                  </Badge>
                </div>

                {/* Customer Type */}
                <Badge variant="outline">{customer.customerType}</Badge>

                {/* Owner */}
                {currentUserRole === 'ADM' && !isOwner && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Nur-Lesen
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {canEdit && (
                <Button onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Kunde bearbeiten
                </Button>
              )}
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Neue Opportunity
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplizieren
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeactivate}>
                    <UserX className="mr-2 h-4 w-4" />
                    Deaktivieren
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {canDelete && (
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Löschen
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Opportunities */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Opportunities</p>
                    <p className="text-2xl font-bold">{mockMetrics.opportunities.active} aktive</p>
                    <p className="text-muted-foreground">
                      {formatCurrency(mockMetrics.opportunities.totalValue)} gesamt
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                    <FolderOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Projekte</p>
                    <p className="text-2xl font-bold">{mockMetrics.projects.active} laufend</p>
                    <p className="text-muted-foreground">
                      {formatCurrency(mockMetrics.projects.totalVolume)} Volumen
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue */}
            {canViewFinancials && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                      <Euro className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Umsatz</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(mockMetrics.revenue.thisYear)}
                      </p>
                      <p className="text-muted-foreground">Dieses Jahr</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Last Activity */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950/20 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Letzte Aktivität</p>
                    <p className="text-2xl font-bold">Vor {mockMetrics.lastActivity.daysAgo} Tagen</p>
                    <p className="text-muted-foreground">{mockMetrics.lastActivity.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="locations">Standorte ({customerLocations.length})</TabsTrigger>
            <TabsTrigger value="contacts">Kontakte ({customerContacts.length})</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities ({customerOpportunities.length})</TabsTrigger>
            <TabsTrigger value="projects">Projekte ({customerProjects.length})</TabsTrigger>
            <TabsTrigger value="protocols">Kontaktprotokoll</TabsTrigger>
          </TabsList>

          {/* Tab 1: Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Master Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Stammdaten
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Firmenname</Label>
                      <p>{customer.companyName}</p>
                    </div>
                    <div>
                      <Label>Umsatzsteuer-ID</Label>
                      <p>{customer.vatId}</p>
                    </div>
                    <div>
                      <Label>Kundentyp</Label>
                      <p>{customer.customerType}</p>
                    </div>
                    <div>
                      <Label>Branche</Label>
                      <p>{customer.industry}</p>
                    </div>
                    <div>
                      <Label>Bewertung</Label>
                      <div className="flex items-center gap-2">
                        <span>{customer.rating}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: ratingStars }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Inhaber</Label>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{customer.owner.initials}</AvatarFallback>
                        </Avatar>
                        <span>
                          {customer.owner.name} <Badge variant="outline">ADM</Badge>
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label>Erstellt</Label>
                      <p>{formatDate(customer.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Rechnungsadresse
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p>{customer.billingAddress.street}</p>
                    <p>
                      {customer.billingAddress.postalCode} {customer.billingAddress.city}
                    </p>
                    <p>{customer.billingAddress.country}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    Auf Karte anzeigen
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Kontaktdaten
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                        {customer.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${customer.phone}`} className="hover:underline">
                        {customer.phone}
                      </a>
                    </div>
                    {customer.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={customer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {customer.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Notizen
                    </CardTitle>
                    {canEdit && (
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{customer.notes}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="locations">
            <LocationListView userRole={currentUserRole === 'ADM' ? 'ADM' : 'GF'} initialLocations={customerLocations} />
          </TabsContent>
          
           <TabsContent value="contacts">
             <ContactListView initialContacts={customerContacts} />
          </TabsContent>

          <TabsContent value="opportunities">
             <OpportunityPipelineView userRole={currentUserRole === 'ADM' ? 'ADM' : 'GF'} initialOpportunities={customerOpportunities} />
          </TabsContent>

          <TabsContent value="projects">
             <ProjectTableView projects={customerProjects} userRole={currentUserRole === 'ADM' ? 'ADM' : 'GF'} />
          </TabsContent>

          <TabsContent value="protocols">
             <ActivityTimeline initialActivities={customerActivities} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kunden wirklich löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Alle Daten zu {customer.companyName},
              einschließlich Kontakte, Dokumente und Historie, werden dauerhaft entfernt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function CustomerDetailPageDemo() {
  const [currentRole, setCurrentRole] = useState<UserRole>('PLAN');

  const mockCustomer: Customer = {
    id: '1',
    companyName: 'Hofladen Müller GmbH',
    vatId: 'DE123456789',
    customerType: 'Bestandskunde',
    industry: 'Lebensmitteleinzelhandel',
    rating: 'A',
    status: 'active',
    ownerId: '1',
    owner: {
      name: 'Michael Schmidt',
      initials: 'MS',
    },
    email: 'info@hofladen-mueller.de',
    phone: '+49 89 12345678',
    website: 'https://www.hofladen-mueller.de',
    billingAddress: {
      street: 'Marktplatz 1',
      postalCode: '80331',
      city: 'München',
      country: 'Deutschland',
    },
    notes: 'Kunde legt großen Wert auf regionale Produkte und nachhaltige Ladeneinrichtung.',
    createdAt: '2023-05-15T10:00:00Z',
    updatedAt: '2024-11-10T14:30:00Z',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Detail Page - Rollenansicht</CardTitle>
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
              PLAN (Bearbeiten)
            </Button>
            <Button
              variant={currentRole === 'ADM' ? 'default' : 'outline'}
              onClick={() => setCurrentRole('ADM')}
            >
              ADM (Eigene Kunden)
            </Button>
            <Button
              variant={currentRole === 'BUCH' ? 'default' : 'outline'}
              onClick={() => setCurrentRole('BUCH')}
            >
              BUCH (Finanzdaten)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="border rounded-lg overflow-hidden">
        <CustomerDetailPage
          customer={mockCustomer}
          currentUserRole={currentRole}
          currentUserId="1"
        />
      </div>
    </div>
  );
}
