import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
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
  Mail,
  Phone,
  Smartphone,
  Edit,
  Trash2,
  Plus,
  MapPin,
  Star,
  Building2,
  Crown,
  Shield,
  Calendar,
  Clock,
  TrendingUp,
  Euro,
  MessageSquare,
  PhoneCall,
  Video,
  FileText,
  AlertCircle,
} from 'lucide-react';

// User role type
type UserRole = 'GF' | 'BUCH' | 'PLAN' | 'ADM';

// Contact type
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  position: string;
  customerId: string;
  customerName: string;
  email: string;
  phone?: string;
  mobile?: string;
  preferredContact: 'email' | 'phone' | 'mobile';
  language: string;
  role: 'decision-maker' | 'influencer' | 'user';
  authorityLevel: 'final' | 'high' | 'medium' | 'low';
  approvalLimit?: number;
  functionalRoles: string[];
  departments: string[];
  locationIds: string[];
  avatarUrl?: string;
}

// Location type
interface Location {
  id: string;
  name: string;
  type: string;
  isPrimary?: boolean;
}

// Opportunity type
interface Opportunity {
  id: string;
  title: string;
  value: number;
  status: 'open' | 'won' | 'lost';
  probability: number;
}

// Project type
interface Project {
  id: string;
  code: string;
  name: string;
  status: 'planning' | 'active' | 'completed';
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

// Mock data
const mockContact: Contact = {
  id: '1',
  firstName: 'Hans',
  lastName: 'Müller',
  title: 'Dr.',
  position: 'Geschäftsführer',
  customerId: '1',
  customerName: 'Hofladen Müller GmbH',
  email: 'h.mueller@hofladen-mueller.de',
  phone: '+49-89-1234567',
  mobile: '+49-170-1234567',
  preferredContact: 'email',
  language: 'Deutsch',
  role: 'decision-maker',
  authorityLevel: 'final',
  approvalLimit: 50000,
  functionalRoles: ['Geschäftsführer', 'Einkaufsleiter'],
  departments: ['Einkauf', 'Finanzen', 'Geschäftsleitung'],
  locationIds: ['1', '2'],
};

const mockLocations: Location[] = [
  { id: '1', name: 'Filiale München Süd', type: 'Filiale', isPrimary: true },
  { id: '2', name: 'Lager München Nord', type: 'Lager', isPrimary: false },
];

const mockOpportunities: Opportunity[] = [
  { id: '1', title: 'Ladeneinrichtung Erweiterung', value: 120000, status: 'open', probability: 75 },
  { id: '2', title: 'Kühlsysteme Upgrade', value: 85000, status: 'open', probability: 60 },
  { id: '3', title: 'Außenbereich Gestaltung', value: 45000, status: 'open', probability: 40 },
];

const mockProjects: Project[] = [
  { id: '1', code: 'P-2024-B023', name: 'Ladeneinrichtung München', status: 'active' },
  { id: '2', code: 'P-2024-B015', name: 'Kühlraumausbau', status: 'completed' },
];

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'meeting',
    subject: 'Projektkickoff Ladeneinrichtung',
    date: '2024-11-08',
    time: '14:00',
    notes: 'Sehr produktives Meeting, Budget besprochen',
    createdBy: 'Thomas Schmidt',
  },
  {
    id: '2',
    type: 'call',
    subject: 'Nachfrage zu Angebot',
    date: '2024-11-05',
    time: '10:30',
    notes: 'Preisverhandlungen, wartet auf GF-Freigabe',
    createdBy: 'Anna Weber',
  },
  {
    id: '3',
    type: 'email',
    subject: 'Angebot gesendet',
    date: '2024-11-02',
    time: '16:45',
    createdBy: 'Thomas Schmidt',
  },
];

// Authority level config
const authorityLevels = {
  final: { label: 'Finale Autorität', icon: '👑', color: 'text-amber-600', stars: 4 },
  high: { label: 'Hohe Autorität', icon: '⭐', color: 'text-primary', stars: 3 },
  medium: { label: 'Mittlere Autorität', icon: '✓', color: 'text-green-600', stars: 2 },
  low: { label: 'Geringe Autorität', icon: '○', color: 'text-gray-600', stars: 1 },
};

// Role labels
const roleLabels = {
  'decision-maker': 'Entscheidungsträger',
  influencer: 'Beeinflusser',
  user: 'Nutzer',
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

// Contact Detail View
function ContactDetailView({ 
  contact = mockContact, 
  currentUserRole = 'PLAN' 
}: { 
  contact?: Contact; 
  currentUserRole?: UserRole 
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('opportunities');

  const canEdit = currentUserRole === 'GF' || currentUserRole === 'PLAN';
  const canEditDecisionRoles = currentUserRole === 'GF' || currentUserRole === 'PLAN';
  const canDelete = currentUserRole === 'GF' || currentUserRole === 'PLAN';

  const fullName = `${contact.title ? contact.title + ' ' : ''}${contact.firstName} ${contact.lastName}`;
  const initials = `${contact.firstName[0]}${contact.lastName[0]}`;

  const authorityConfig = authorityLevels[contact.authorityLevel];
  const totalOpportunityValue = mockOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const activeOpportunities = mockOpportunities.filter((o) => o.status === 'open').length;

  const handleDelete = () => {
    toast.success('Kontakt gelöscht', {
      description: `${fullName} wurde erfolgreich gelöscht`,
    });
    setShowDeleteDialog(false);
  };

  const handleAddActivity = () => {
    toast.success('Aktivität hinzugefügt');
  };

  const handleCall = () => {
    toast.success('Anruf wird gestartet', {
      description: contact.mobile || contact.phone,
    });
  };

  const handleEmail = () => {
    toast.success('E-Mail-Client wird geöffnet', {
      description: contact.email,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-muted-foreground mb-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Kunden
            </a>
            <ChevronRight className="h-4 w-4" />
            <a href="#" className="hover:text-foreground transition-colors">
              {contact.customerName}
            </a>
            <ChevronRight className="h-4 w-4" />
            <a href="#" className="hover:text-foreground transition-colors">
              Kontakte
            </a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{fullName}</span>
          </div>

          {/* Contact Header */}
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar & Info */}
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-20 w-20">
                <AvatarImage src={contact.avatarUrl} alt={fullName} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="mb-1">{fullName}</h1>
                <p className="text-muted-foreground mb-2">{contact.position}</p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <Building2 className="h-4 w-4" />
                  {contact.customerName}
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {canEdit && (
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Bearbeiten
                </Button>
              )}
              {canDelete && (
                <Button variant="outline" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Löschen
                </Button>
              )}
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Aktivität hinzufügen
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Data */}
            <Card>
              <CardHeader>
                <CardTitle>Kontaktdaten</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/60 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-muted-foreground">E-Mail</p>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-primary hover:underline break-all"
                      >
                        {contact.email}
                      </a>
                    </div>
                    {contact.preferredContact === 'email' && (
                      <Badge variant="secondary">Bevorzugt</Badge>
                    )}
                  </div>

                  {/* Phone */}
                  {contact.phone && (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/60 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-muted-foreground">Telefon</p>
                        <p>{contact.phone}</p>
                      </div>
                      {contact.preferredContact === 'phone' && (
                        <Badge variant="secondary">Bevorzugt</Badge>
                      )}
                    </div>
                  )}

                  {/* Mobile */}
                  {contact.mobile && (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/60 flex items-center justify-center flex-shrink-0">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-muted-foreground">Mobil</p>
                        <p>{contact.mobile}</p>
                      </div>
                      {contact.preferredContact === 'mobile' && (
                        <Badge variant="secondary">Bevorzugt</Badge>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Language */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sprache</span>
                    <span>{contact.language}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Decision Authority - Prominent */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-600" />
                  <CardTitle>Entscheidungsbefugnis</CardTitle>
                </div>
                {!canEditDecisionRoles && (
                  <CardDescription className="flex items-center gap-1 text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    Nur PLAN/GF können Entscheidungsrollen bearbeiten
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Role */}
                <div>
                  <p className="text-muted-foreground mb-2">Rolle</p>
                  <Badge className="gap-2 py-2 px-4">
                    <Crown className="h-4 w-4" />
                    <span className="text-base">{roleLabels[contact.role]}</span>
                  </Badge>
                </div>

                {/* Authority Level */}
                <div>
                  <p className="text-muted-foreground mb-2">Autoritätslevel</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{authorityConfig.icon}</span>
                    <div>
                      <p className={`font-semibold ${authorityConfig.color}`}>
                        {authorityConfig.label}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: authorityConfig.stars }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approval Limit */}
                {contact.approvalLimit && (
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Genehmigungslimit</p>
                        <p className="text-muted-foreground">
                          Kann Bestellungen bis {formatCurrency(contact.approvalLimit)} genehmigen
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Functional Roles */}
                <div>
                  <p className="text-muted-foreground mb-2">Funktionale Rollen</p>
                  <div className="flex flex-wrap gap-2">
                    {contact.functionalRoles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Department Influence */}
                <div>
                  <p className="text-muted-foreground mb-2">Abteilungseinfluss</p>
                  <div className="flex flex-wrap gap-2">
                    {contact.departments.map((dept) => (
                      <Badge key={dept} variant="outline">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Locations */}
            <Card>
              <CardHeader>
                <CardTitle>Zugewiesene Standorte</CardTitle>
                <CardDescription>
                  {mockLocations.length} {mockLocations.length === 1 ? 'Standort' : 'Standorte'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLocations.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{location.name}</span>
                            {location.isPrimary && (
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            )}
                          </div>
                          <p className="text-muted-foreground">
                            {location.type}
                            {location.isPrimary && ' • Hauptansprechpartner'}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Opportunities & Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Opportunities & Projekte</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="opportunities">
                      Opportunities ({activeOpportunities})
                    </TabsTrigger>
                    <TabsTrigger value="projects">Projekte ({mockProjects.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="opportunities" className="space-y-4">
                    <div className="bg-accent/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground">Aktive Opportunities</p>
                          <p className="text-2xl font-bold text-primary">
                            {activeOpportunities}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">Gesamtwert</p>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(totalOpportunityValue)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {mockOpportunities.map((opp) => (
                        <div
                          key={opp.id}
                          className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4>{opp.title}</h4>
                            <Badge
                              variant={
                                opp.status === 'open'
                                  ? 'default'
                                  : opp.status === 'won'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {opp.status === 'open'
                                ? 'Offen'
                                : opp.status === 'won'
                                ? 'Gewonnen'
                                : 'Verloren'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Euro className="h-4 w-4" />
                              {formatCurrency(opp.value)}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              {opp.probability}% Wahrscheinlichkeit
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="projects" className="space-y-3">
                    {mockProjects.map((project) => (
                      <div
                        key={project.id}
                        className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-muted-foreground">{project.code}</p>
                            <h4>{project.name}</h4>
                          </div>
                          <Badge
                            variant={
                              project.status === 'active'
                                ? 'default'
                                : project.status === 'completed'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {project.status === 'active'
                              ? 'Aktiv'
                              : project.status === 'completed'
                              ? 'Abgeschlossen'
                              : 'Planung'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Aktivitätsverlauf</CardTitle>
                    <CardDescription>{mockActivities.length} Aktivitäten</CardDescription>
                  </div>
                  <Button size="sm" onClick={handleAddActivity}>
                    <Plus className="mr-2 h-4 w-4" />
                    Aktivität hinzufügen
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivities.map((activity, index) => {
                    const isLast = index === mockActivities.length - 1;
                    const iconMap = {
                      call: PhoneCall,
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
                          <div className="flex items-start justify-between mb-1">
                            <h4>{activity.subject}</h4>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(activity.date).toLocaleDateString('de-DE')}
                              </span>
                              <Clock className="h-4 w-4 ml-2" />
                              <span>{activity.time}</span>
                            </div>
                          </div>
                          {activity.notes && (
                            <p className="text-muted-foreground mb-2">{activity.notes}</p>
                          )}
                          <p className="text-muted-foreground">von {activity.createdBy}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Schnellaktionen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline" onClick={handleCall}>
                    <Phone className="mr-2 h-4 w-4" />
                    Anrufen
                  </Button>
                  <Button className="w-full" variant="outline" onClick={handleEmail}>
                    <Mail className="mr-2 h-4 w-4" />
                    E-Mail senden
                  </Button>
                  <Button className="w-full" onClick={handleAddActivity}>
                    <Plus className="mr-2 h-4 w-4" />
                    Aktivität hinzufügen
                  </Button>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiken</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Letzter Kontakt</span>
                    <span className="font-medium">Vor 3 Tagen</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Aktivitäten gesamt</span>
                    <span className="font-medium">{mockActivities.length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Opportunities</span>
                    <span className="font-medium">{mockOpportunities.length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Projekte</span>
                    <span className="font-medium">{mockProjects.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kontakt löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie {fullName} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht
              werden.
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

// Demo wrapper
export function ContactDetailViewDemo() {
  const [currentRole, setCurrentRole] = useState<UserRole>('PLAN');

  return (
    <div className="space-y-6">
      {/* Role Switcher for Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Kontaktdetails - Rollenansicht</CardTitle>
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
              BUCH (Kein Edit)
            </Button>
            <Button
              variant={currentRole === 'ADM' ? 'default' : 'outline'}
              onClick={() => setCurrentRole('ADM')}
            >
              ADM (Basis Edit)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Contact Detail View */}
      <ContactDetailView currentUserRole={currentRole} />
    </div>
  );
}