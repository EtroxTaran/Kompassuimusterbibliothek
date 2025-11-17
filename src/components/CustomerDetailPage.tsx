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
} from 'lucide-react';

// User role type
type UserRole = 'GF' | 'BUCH' | 'PLAN' | 'ADM' | 'KALK';

// Customer type
interface Customer {
  id: string;
  companyName: string;
  status: 'active' | 'inactive';
  rating: 'A' | 'B' | 'C' | 'D';
  customerType: string;
  industry: string;
  vatId: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  billingAddress: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  email: string;
  phone: string;
  website?: string;
  creditLimit: number;
  paymentTerms: string;
  outstandingBalance: number;
  notes?: string;
}

// Mock customer data
const mockCustomer: Customer = {
  id: '1',
  companyName: 'Hofladen Müller GmbH',
  status: 'active',
  rating: 'A',
  customerType: 'Direktvermarkter',
  industry: 'Landwirtschaft',
  vatId: 'DE123456789',
  ownerId: '1',
  ownerName: 'Michael Schmidt',
  createdAt: '2024-10-12',
  billingAddress: {
    street: 'Hauptstraße 15',
    postalCode: '80331',
    city: 'München',
    country: 'Deutschland',
  },
  email: 'info@hofladen-mueller.de',
  phone: '+49-89-1234567',
  website: 'https://www.hofladen-mueller.de',
  creditLimit: 50000,
  paymentTerms: '30 Tage',
  outstandingBalance: 12500,
  notes:
    'VIP-Kunde, bevorzugte Behandlung. Jährliches Treffen mit GF im Q4. Sehr zufrieden mit Produktqualität.',
};

// Mock metrics
const mockMetrics = {
  opportunities: { active: 5, totalValue: 625000 },
  projects: { active: 3, totalVolume: 1200000 },
  revenue: { thisYear: 450000 },
  lastActivity: { daysAgo: 3, type: 'Telefonat' },
};

// Mock locations
const mockLocations = [
  { id: '1', name: 'Filiale München Süd', type: 'Filiale', isPrimary: true },
  { id: '2', name: 'Lager München Nord', type: 'Lager' },
  { id: '3', name: 'Verkaufsstelle Starnberg', type: 'Verkaufsstelle' },
];

// Mock contacts
const mockContacts = [
  {
    id: '1',
    name: 'Dr. Hans Müller',
    position: 'Geschäftsführer',
    email: 'h.mueller@hofladen-mueller.de',
    role: 'decision-maker',
  },
  {
    id: '2',
    name: 'Anna Weber',
    position: 'Einkaufsleiterin',
    email: 'a.weber@hofladen-mueller.de',
    role: 'influencer',
  },
  {
    id: '3',
    name: 'Thomas Schmidt',
    position: 'Vertriebsleiter',
    email: 't.schmidt@hofladen-mueller.de',
    role: 'user',
  },
];

// Mock opportunities
const mockOpportunities = [
  {
    id: '1',
    title: 'Ladeneinrichtung Erweiterung',
    value: 120000,
    probability: 75,
    status: 'Verhandlung',
    expectedDate: '2024-12-15',
    responsible: 'Thomas Schmidt',
  },
  {
    id: '2',
    title: 'Kühlsysteme Upgrade',
    value: 85000,
    probability: 60,
    status: 'Angebot',
    expectedDate: '2024-12-30',
    responsible: 'Anna Weber',
  },
  {
    id: '3',
    title: 'Außenbereich Gestaltung',
    value: 45000,
    probability: 40,
    status: 'Qualifizierung',
    expectedDate: '2025-01-20',
    responsible: 'Thomas Schmidt',
  },
];

// Mock projects
const mockProjects = [
  {
    id: '1',
    code: 'P-2024-B023',
    name: 'Ladeneinrichtung München',
    status: 'In Bearbeitung',
    progress: 65,
    budget: 450000,
    schedule: 'Im Zeitplan',
    manager: 'Thomas Schmidt',
  },
  {
    id: '2',
    code: 'P-2024-B015',
    name: 'Kühlraumausbau',
    status: 'Abgeschlossen',
    progress: 100,
    budget: 280000,
    schedule: 'Abgeschlossen',
    manager: 'Anna Weber',
  },
  {
    id: '3',
    code: 'P-2024-B031',
    name: 'Beleuchtungssystem',
    status: 'In Bearbeitung',
    progress: 30,
    budget: 120000,
    schedule: 'Im Zeitplan',
    manager: 'Michael Schmidt',
  },
];

// Mock invoices
const mockInvoices = [
  {
    id: '1',
    number: 'R-2024-00456',
    date: '2024-11-01',
    dueDate: '2024-12-01',
    amount: 45000,
    status: 'Offen',
    paid: 0,
  },
  {
    id: '2',
    number: 'R-2024-00423',
    date: '2024-10-15',
    dueDate: '2024-11-14',
    amount: 32000,
    status: 'Bezahlt',
    paid: 32000,
  },
  {
    id: '3',
    number: 'R-2024-00401',
    date: '2024-10-01',
    dueDate: '2024-10-31',
    amount: 28500,
    status: 'Überfällig',
    paid: 15000,
  },
];

// Mock documents
const mockDocuments = [
  {
    id: '1',
    name: 'Rahmenvertrag_2024.pdf',
    type: 'Vertrag',
    size: '2.4 MB',
    uploadedAt: '2024-01-15',
    uploadedBy: 'Michael Schmidt',
  },
  {
    id: '2',
    name: 'Angebot_Ladeneinrichtung.pdf',
    type: 'Angebot',
    size: '1.8 MB',
    uploadedAt: '2024-10-20',
    uploadedBy: 'Thomas Schmidt',
  },
  {
    id: '3',
    name: 'Rechnung_R-2024-00456.pdf',
    type: 'Rechnung',
    size: '0.5 MB',
    uploadedAt: '2024-11-01',
    uploadedBy: 'System',
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
function CustomerDetailPage({
  customer = mockCustomer,
  currentUserRole = 'PLAN',
  currentUserId = '1',
}: {
  customer?: Customer;
  currentUserRole?: UserRole;
  currentUserId?: string;
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isOwner = customer.ownerId === currentUserId;
  const canEdit = currentUserRole === 'GF' || currentUserRole === 'PLAN' || (currentUserRole === 'ADM' && isOwner);
  const canDelete = currentUserRole === 'GF';
  const canViewFinancials = currentUserRole === 'GF' || currentUserRole === 'BUCH';

  const ratingStars = { A: 5, B: 4, C: 3, D: 2 }[customer.rating] || 0;
  const weightedOpportunityValue =
    mockOpportunities.reduce((sum, opp) => sum + (opp.value * opp.probability) / 100, 0);

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
              Kunden
            </a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{customer.companyName}</span>
          </div>

          {/* Customer Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1>{customer.companyName}</h1>
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

                {/* Owner (if not owner and ADM) */}
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
            <TabsTrigger value="locations">Standorte ({mockLocations.length})</TabsTrigger>
            <TabsTrigger value="contacts">Kontakte ({mockContacts.length + 9})</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities ({mockOpportunities.length})</TabsTrigger>
            <TabsTrigger value="projects">Projekte ({mockProjects.length})</TabsTrigger>
            <TabsTrigger value="invoices">Rechnungen ({mockInvoices.length + 20})</TabsTrigger>
            <TabsTrigger value="activities">Aktivitäten (145)</TabsTrigger>
            <TabsTrigger value="documents">Dokumente</TabsTrigger>
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
                          <AvatarFallback className="text-xs">MS</AvatarFallback>
                        </Avatar>
                        <span>
                          {customer.ownerName} <Badge variant="outline">ADM</Badge>
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

              {/* Business Data */}
              {canViewFinancials && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Geschäftsdaten
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label>Kreditlimit</Label>
                        <span>{formatCurrency(customer.creditLimit)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <Label>Zahlungsziel</Label>
                        <span>{customer.paymentTerms}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <Label>Offene Forderungen</Label>
                        <span
                          className={
                            customer.outstandingBalance > 0
                              ? 'text-destructive font-semibold'
                              : 'text-green-600 font-semibold'
                          }
                        >
                          {formatCurrency(customer.outstandingBalance)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

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
          </TabsContent>

          {/* Tab 2: Locations */}
          <TabsContent value="locations" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3>Standorte</h3>
                <p className="text-muted-foreground">
                  {mockLocations.length}{' '}
                  {mockLocations.length === 1 ? 'Standort' : 'Standorte'}
                </p>
              </div>
              {canEdit && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Standort hinzufügen
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockLocations.map((location) => (
                <Card key={location.id} className="hover:bg-accent transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-lg">{location.name}</CardTitle>
                      </div>
                      {location.isPrimary && (
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      )}
                    </div>
                    <CardDescription>
                      <Badge variant="outline">{location.type}</Badge>
                      {location.isPrimary && (
                        <Badge variant="secondary" className="ml-2">
                          Hauptstandort
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      Details anzeigen
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab 3: Contacts */}
          <TabsContent value="contacts" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3>Kontakte</h3>
                <p className="text-muted-foreground">{mockContacts.length + 9} Kontakte</p>
              </div>
              {canEdit && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Kontakt hinzufügen
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockContacts.map((contact) => (
                <Card key={contact.id} className="hover:bg-accent transition-colors">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {contact.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-base">{contact.name}</CardTitle>
                        <CardDescription>{contact.position}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-primary hover:underline truncate"
                      >
                        {contact.email}
                      </a>
                    </div>
                    <Badge variant="outline">
                      {contact.role === 'decision-maker'
                        ? 'Entscheidungsträger'
                        : contact.role === 'influencer'
                        ? 'Beeinflusser'
                        : 'Nutzer'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab 4: Opportunities */}
          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3>Opportunities</h3>
                <p className="text-muted-foreground">
                  {formatCurrency(mockMetrics.opportunities.totalValue)} gesamt •{' '}
                  {formatCurrency(weightedOpportunityValue)} gewichtet
                </p>
              </div>
              {canEdit && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Opportunity hinzufügen
                </Button>
              )}
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left">Titel</th>
                        <th className="px-4 py-3 text-right">Wert</th>
                        <th className="px-4 py-3 text-center">Wahrscheinlichkeit</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Erwartet am</th>
                        <th className="px-4 py-3 text-left">Verantwortlich</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOpportunities.map((opp) => (
                        <tr key={opp.id} className="border-b border-border hover:bg-accent">
                          <td className="px-4 py-3">{opp.title}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(opp.value)}</td>
                          <td className="px-4 py-3 text-center">{opp.probability}%</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{opp.status}</Badge>
                          </td>
                          <td className="px-4 py-3">{formatDate(opp.expectedDate)}</td>
                          <td className="px-4 py-3">{opp.responsible}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 5: Projects */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3>Projekte</h3>
                <p className="text-muted-foreground">
                  {mockProjects.length} {mockProjects.length === 1 ? 'Projekt' : 'Projekte'}
                </p>
              </div>
              {canEdit && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Projekt erstellen
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {mockProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardDescription>{project.code}</CardDescription>
                        <CardTitle>{project.name}</CardTitle>
                      </div>
                      <Badge
                        variant={
                          project.status === 'In Bearbeitung' ? 'default' : 'secondary'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Fortschritt</Label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span>{project.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <Label>Budget</Label>
                        <p>{formatCurrency(project.budget)}</p>
                      </div>
                      <div>
                        <Label>Zeitplan</Label>
                        <p>{project.schedule}</p>
                      </div>
                      <div>
                        <Label>Projektleiter</Label>
                        <p>{project.manager}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab 6: Invoices */}
          <TabsContent value="invoices" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3>Rechnungen</h3>
                <p className="text-muted-foreground">
                  {mockInvoices.length + 20} Rechnungen •{' '}
                  {formatCurrency(mockMetrics.revenue.thisYear)} Umsatz (Jahr)
                </p>
              </div>
              {canEdit && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Rechnung erstellen
                </Button>
              )}
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left">Rechnungsnr.</th>
                        <th className="px-4 py-3 text-left">Datum</th>
                        <th className="px-4 py-3 text-left">Fällig</th>
                        <th className="px-4 py-3 text-right">Betrag</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-right">Bezahlt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-border hover:bg-accent">
                          <td className="px-4 py-3">{invoice.number}</td>
                          <td className="px-4 py-3">{formatDate(invoice.date)}</td>
                          <td className="px-4 py-3">{formatDate(invoice.dueDate)}</td>
                          <td className="px-4 py-3 text-right">
                            {formatCurrency(invoice.amount)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                invoice.status === 'Bezahlt'
                                  ? 'default'
                                  : invoice.status === 'Überfällig'
                                  ? 'destructive'
                                  : 'outline'
                              }
                              className="flex items-center gap-1 w-fit"
                            >
                              {invoice.status === 'Bezahlt' && (
                                <CheckCircle className="h-3 w-3" />
                              )}
                              {invoice.status === 'Überfällig' && (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              {invoice.status === 'Offen' && <Clock className="h-3 w-3" />}
                              {invoice.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatCurrency(invoice.paid)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 7: Activities */}
          <TabsContent value="activities" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3>Aktivitätsverlauf</h3>
                <p className="text-muted-foreground">145 Aktivitäten</p>
              </div>
              {canEdit && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Aktivität hinzufügen
                </Button>
              )}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="mb-2">Aktivitäts-Timeline</h4>
                  <p className="text-muted-foreground mb-4">
                    Chronologische Übersicht aller Kundeninteraktionen
                  </p>
                  <p className="text-muted-foreground">
                    (Integriert mit ActivityTimelineDemo Komponente)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 8: Documents */}
          <TabsContent value="documents" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3>Dokumente</h3>
                <p className="text-muted-foreground">
                  {mockDocuments.length} {mockDocuments.length === 1 ? 'Dokument' : 'Dokumente'}
                </p>
              </div>
              {canEdit && (
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Dokument hochladen
                </Button>
              )}
            </div>

            {/* Upload Area */}
            {canEdit && (
              <Card className="border-2 border-dashed">
                <CardContent className="p-12">
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="mb-2">Dateien hochladen</h4>
                    <p className="text-muted-foreground mb-4">
                      Ziehen Sie Dateien hierher oder klicken Sie zum Auswählen
                    </p>
                    <Button variant="outline">Dateien auswählen</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documents List */}
            <div className="space-y-3">
              {mockDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded bg-accent/60 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-muted-foreground">
                            {doc.type} • {doc.size} • Hochgeladen am {formatDate(doc.uploadedAt)}{' '}
                            von {doc.uploadedBy}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        {canEdit && (
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kunde löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie {customer.companyName} wirklich löschen? Diese Aktion kann nicht
              rückgängig gemacht werden. Alle zugehörigen Daten (Standorte, Kontakte, Opportunities,
              Projekte) werden ebenfalls gelöscht.
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
    </div>
  );
}

// Demo wrapper
export function CustomerDetailPageDemo() {
  const [currentRole, setCurrentRole] = useState<UserRole>('PLAN');

  return (
    <div className="space-y-6">
      {/* Role Switcher for Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Kundendetails - Rollenansicht</CardTitle>
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
              BUCH (Finanzdaten)
            </Button>
            <Button
              variant={currentRole === 'ADM' ? 'default' : 'outline'}
              onClick={() => setCurrentRole('ADM')}
            >
              ADM (Eigene Kunden)
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

      {/* Customer Detail Page */}
      <CustomerDetailPage currentUserRole={currentRole} />
    </div>
  );
}