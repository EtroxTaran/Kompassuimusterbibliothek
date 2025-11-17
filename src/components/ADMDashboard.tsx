import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import {
  MapPin,
  Cloud,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  Building2,
  Plus,
  Phone,
  FileText,
  Camera,
  Navigation,
  Mic,
  Clock,
  Euro,
  Users,
  Target,
  ChevronRight,
  ExternalLink,
  WifiOff,
  Check,
  Route,
  MessageSquare,
  Eye,
} from 'lucide-react';

// Visit type
interface Visit {
  id: string;
  time: string;
  customerName: string;
  location: string;
  distance: string;
  coordinates: { lat: number; lng: number };
}

// Task type
interface Task {
  id: string;
  description: string;
  customerName: string;
  dueTime: string;
  priority: 'overdue' | 'today' | 'upcoming';
  completed: boolean;
}

// Opportunity type
interface Opportunity {
  id: string;
  customerName: string;
  title: string;
  value: number;
  probability: number;
  closeDate: string;
  status: string;
}

// Recent customer type
interface RecentCustomer {
  id: string;
  name: string;
  location: string;
  lastVisit: string;
  lastActivity: string;
}

// Mock data
const mockVisits: Visit[] = [
  {
    id: '1',
    time: '10:00',
    customerName: 'Hofladen Müller',
    location: 'Industriestr. 42, München',
    distance: '8 km',
    coordinates: { lat: 48.1351, lng: 11.582 },
  },
  {
    id: '2',
    time: '12:30',
    customerName: 'REWE München Süd',
    location: 'Hauptstr. 15, München',
    distance: '12 km',
    coordinates: { lat: 48.1291, lng: 11.575 },
  },
  {
    id: '3',
    time: '14:00',
    customerName: 'Bäckerei Schmidt',
    location: 'Marienplatz 3, München',
    distance: '5 km',
    coordinates: { lat: 48.1374, lng: 11.5755 },
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    description: 'Angebot nachfassen',
    customerName: 'REWE München',
    dueTime: '14:00',
    priority: 'overdue',
    completed: false,
  },
  {
    id: '2',
    description: 'Vertragsunterlagen mitbringen',
    customerName: 'Hofladen Müller',
    dueTime: '10:00',
    priority: 'today',
    completed: false,
  },
  {
    id: '3',
    description: 'Produktmuster zeigen',
    customerName: 'Bäckerei Schmidt',
    dueTime: '14:00',
    priority: 'today',
    completed: false,
  },
  {
    id: '4',
    description: 'Preisanpassung besprechen',
    customerName: 'Café Müller',
    dueTime: 'Morgen',
    priority: 'upcoming',
    completed: false,
  },
];

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    customerName: 'REWE München Süd',
    title: 'Ladeneinrichtung Neueröffnung',
    value: 125000,
    probability: 75,
    closeDate: '2024-12-15',
    status: 'Verhandlung',
  },
  {
    id: '2',
    customerName: 'Hofladen Müller',
    title: 'Kühlsysteme Erweiterung',
    value: 45000,
    probability: 60,
    closeDate: '2024-11-20',
    status: 'Angebot',
  },
  {
    id: '3',
    customerName: 'Bäckerei Schmidt',
    title: 'Komplette Ausstattung',
    value: 85000,
    probability: 80,
    closeDate: '2024-11-18',
    status: 'Verhandlung',
  },
];

const mockRecentCustomers: RecentCustomer[] = [
  {
    id: '1',
    name: 'Café Münchner Freiheit',
    location: 'Münchner Freiheit 12',
    lastVisit: 'Vor 3 Tagen',
    lastActivity: 'Angebot präsentiert',
  },
  {
    id: '2',
    name: 'Restaurant Da Vinci',
    location: 'Leopoldstr. 88',
    lastVisit: 'Vor 5 Tagen',
    lastActivity: 'Bedarfsanalyse durchgeführt',
  },
  {
    id: '3',
    name: 'Supermarkt Edeka Nord',
    location: 'Schwabing 45',
    lastVisit: 'Vor 1 Woche',
    lastActivity: 'Vertragsverhandlung',
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
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ADM Dashboard
export function ADMDashboard() {
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [tasks, setTasks] = useState(mockTasks);
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(3);

  const userName = 'Michael Schmidt';
  const userRole = 'ADM';
  const currentLocation = 'München';
  const currentDate = 'Heute, 15. Nov. 2024';
  const weather = '12°C, bewölkt';

  // KPI Data
  const totalCustomers = 32;
  const activeCustomers = 28;
  const inactiveCustomers = 4;
  const totalOpportunityValue = 850000;
  const opportunityCount = 12;
  const closeThisWeek = 3;
  const plannedActivities = 5;
  const completedActivities = 2;
  const overdueActivities = 1;

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    toast.success('Aufgabe aktualisiert');
  };

  const handleAddActivity = () => {
    toast.success('Aktivität hinzugefügt', {
      description: 'Ihre Aktivität wurde erfolgreich gespeichert',
    });
    setShowActivityDialog(false);
  };

  const handleAddTask = () => {
    toast.success('Aufgabe hinzugefügt', {
      description: 'Ihre Aufgabe wurde erfolgreich erstellt',
    });
    setShowTaskDialog(false);
  };

  const handleAddContact = () => {
    toast.success('Kontakt erfasst', {
      description: 'Neuer Kontakt wurde erfolgreich angelegt',
    });
    setShowContactDialog(false);
  };

  const handleNavigate = (visit: Visit) => {
    toast.info('Navigation gestartet', {
      description: `Route zu ${visit.customerName}`,
    });
  };

  const handleCall = (customerName: string) => {
    toast.info('Anruf wird gestartet', {
      description: customerName,
    });
  };

  const handleVoiceNote = () => {
    toast.info('Sprachnotiz', {
      description: 'Sprachaufnahme gestartet...',
    });
  };

  const handleCamera = () => {
    toast.info('Kamera', {
      description: 'Kamera wird geöffnet...',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-amber-100 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WifiOff className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-amber-800 dark:text-amber-400">
                  Offline-Modus
                </span>
                <Badge variant="outline" className="ml-2">
                  {pendingSyncCount} Aktivitäten zum Synchronisieren
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOffline(false)}>
                Synchronisieren
              </Button>
            </div>
          </div>
        </div>
      )}

      {!isOffline && (
        <div className="bg-green-100 dark:bg-green-950/20 border-b border-green-200 dark:border-green-900 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-800 dark:text-green-400">Synchronisiert</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="mb-2">Meine Kunden</h1>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{currentLocation}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{currentDate}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Cloud className="h-4 w-4" />
                  <span>{weather}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>MS</AvatarFallback>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* My Customers */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Meine Kunden</p>
                <p className="text-4xl font-bold text-primary mb-2">{totalCustomers}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                    <span className="text-green-600">{activeCustomers} Aktiv</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                    <span className="text-muted-foreground">{inactiveCustomers} Inaktiv</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Opportunities */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Meine Opportunities</p>
                <p className="text-4xl font-bold text-amber-600 mb-2">
                  {formatCurrency(totalOpportunityValue)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{opportunityCount} Opportunities</span>
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
                    {closeThisWeek} diese Woche
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Activities Today */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Aktivitäten (heute)</p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{plannedActivities}</p>
                    <p className="text-muted-foreground">Geplant</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{completedActivities}</p>
                    <p className="text-muted-foreground">Erledigt</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{overdueActivities}</p>
                    <p className="text-muted-foreground">Überfällig</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Route */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    Heutige Route
                  </CardTitle>
                  <CardDescription>{mockVisits.length} geplante Besuche</CardDescription>
                </div>
                <Button size="sm" onClick={() => toast.info('Route starten')}>
                  <Navigation className="mr-2 h-4 w-4" />
                  Route starten
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Map Placeholder */}
              <div className="w-full h-[300px] bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Kartenansicht</p>
                  <p className="text-muted-foreground">
                    Zeigt aktuelle Position und geplante Besuche
                  </p>
                </div>
              </div>

              {/* Visit List */}
              <div className="space-y-3">
                {mockVisits.map((visit, index) => (
                  <div
                    key={visit.id}
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{visit.time}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="font-semibold">{visit.customerName}</span>
                      </div>
                      <p className="text-muted-foreground truncate">{visit.location}</p>
                      <p className="text-muted-foreground">{visit.distance}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleNavigate(visit)}>
                      <Navigation className="mr-2 h-4 w-4" />
                      Navigate
                    </Button>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Besuch hinzufügen
              </Button>
            </CardContent>
          </Card>

          {/* My Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meine Aufgaben</CardTitle>
                  <CardDescription>
                    {tasks.filter((t) => !t.completed).length} offene Aufgaben
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowTaskDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Aufgabe
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 border border-border rounded-lg ${
                      task.completed ? 'opacity-50' : ''
                    }`}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          task.priority === 'overdue'
                            ? 'text-red-600'
                            : task.priority === 'today'
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        } ${task.completed ? 'line-through' : ''}`}
                      >
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-muted-foreground">{task.customerName}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{task.dueTime}</span>
                        </div>
                      </div>
                    </div>
                    {task.priority === 'overdue' && (
                      <Badge variant="destructive">Überfällig</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Opportunities Closing This Week */}
          <Card>
            <CardHeader>
              <CardTitle>Opportunities (diese Woche schließend)</CardTitle>
              <CardDescription>{mockOpportunities.length} Opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{opp.customerName}</span>
                        </div>
                        <p className="font-semibold text-primary">{opp.title}</p>
                      </div>
                      <Badge>{opp.status}</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-muted-foreground">Wert</p>
                        <p className="font-semibold">{formatCurrency(opp.value)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Wahrscheinlichkeit</p>
                        <p className="font-semibold">{opp.probability}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Abschluss</p>
                        <p className="font-semibold">{formatDate(opp.closeDate)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCall(opp.customerName)}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Anrufen
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowActivityDialog(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Aktivität
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recently Visited Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Kürzlich besuchte Kunden</CardTitle>
              <CardDescription>{mockRecentCustomers.length} Kunden</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecentCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {customer.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-muted-foreground">{customer.location}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-muted-foreground">{customer.lastVisit}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="text-muted-foreground">{customer.lastActivity}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowActivityDialog(true)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCall(customer.name)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* New Contacts */}
          <Card className="border-2 border-dashed border-primary/50">
            <CardContent className="pt-6 text-center">
              <Camera className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="mb-4">Neuen Kontakt hinzugefügt?</p>
              <Button onClick={() => setShowContactDialog(true)}>
                <Camera className="mr-2 h-4 w-4" />
                Kontakt erfassen
              </Button>
              <p className="text-muted-foreground mt-2">
                Visitenkarte scannen oder manuell eingeben
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-6 md:bottom-6 md:right-6 z-50">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setShowActivityDialog(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-40">
        <div className="grid grid-cols-4 gap-1 p-2">
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => handleCall('Kunde')}
          >
            <Phone className="h-5 w-5" />
            <span className="text-xs">Anrufen</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={handleVoiceNote}
          >
            <Mic className="h-5 w-5" />
            <span className="text-xs">Notiz</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={handleCamera}
          >
            <Camera className="h-5 w-5" />
            <span className="text-xs">Foto</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => toast.info('Navigation öffnen')}
          >
            <Navigation className="h-5 w-5" />
            <span className="text-xs">Route</span>
          </Button>
        </div>
      </div>

      {/* Activity Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aktivität hinzufügen</DialogTitle>
            <DialogDescription>Schnell eine neue Aktivität erfassen</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Notiz</Label>
              <Textarea placeholder="Was ist passiert?" rows={4} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleVoiceNote}>
                <Mic className="mr-2 h-4 w-4" />
                Sprachnotiz
              </Button>
              <Button variant="outline" size="sm" onClick={handleCamera}>
                <Camera className="mr-2 h-4 w-4" />
                Foto
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivityDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleAddActivity}>
              <Plus className="mr-2 h-4 w-4" />
              Hinzufügen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aufgabe hinzufügen</DialogTitle>
            <DialogDescription>Neue Aufgabe erstellen</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Beschreibung</Label>
              <Textarea placeholder="Was muss erledigt werden?" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleAddTask}>
              <Plus className="mr-2 h-4 w-4" />
              Hinzufügen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kontakt erfassen</DialogTitle>
            <DialogDescription>Neuen Kontakt anlegen</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleCamera}>
              <Camera className="mr-2 h-4 w-4" />
              Visitenkarte scannen
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-muted-foreground">oder</span>
              </div>
            </div>
            <div>
              <Label>Manuelle Eingabe</Label>
              <Textarea placeholder="Name, Firma, Kontaktdaten..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleAddContact}>
              <Plus className="mr-2 h-4 w-4" />
              Kontakt anlegen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Demo wrapper
export function ADMDashboardDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ADM Dashboard (Außendienst)</CardTitle>
          <CardDescription>
            Mobile-first Dashboard für Verkaufsaußendienst mit Kundenmanagement, Opportunities und
            schnellen Aktionen
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator />

      <ADMDashboard />
    </div>
  );
}