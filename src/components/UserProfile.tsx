import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import {
  User,
  Mail,
  Phone,
  Smartphone,
  MapPin,
  Edit3,
  MessageSquare,
  Camera,
  Calendar,
  Clock,
  Globe,
  ChevronRight,
  Check,
  X,
  PhoneCall,
  Video,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Award,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Building2,
  Eye,
  EyeOff,
  ExternalLink,
} from 'lucide-react';

// Types
type UserRole = 'GF' | 'PLAN' | 'ADM' | 'KALK' | 'BUCH' | 'INNEN';
type ViewMode = 'view' | 'edit';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  mobile: string;
  role: UserRole;
  position: string;
  department: string;
  location: string;
  joinedDate: string;
  bio: string;
  timezone: string;
  availability: string;
  preferredContact: string;
  language: string;
  isOnline: boolean;
}

interface Activity {
  id: string;
  type: 'call' | 'visit' | 'email' | 'note';
  entity: string;
  description: string;
  timestamp: string;
  duration?: string;
}

const mockProfile: UserProfile = {
  id: '1',
  name: 'Michael Schmidt',
  email: 'm.schmidt@kompass.de',
  phone: '+49-170-1234567',
  mobile: '+49-160-9876543',
  role: 'ADM',
  position: 'Senior Außendienstmitarbeiter',
  department: 'Vertrieb',
  location: 'München',
  joinedDate: '01.01.2020',
  bio: 'Verantwortlich für Kunden in München und Umgebung. Spezialisiert auf Einzelhandel und Gastronomie.',
  timezone: 'Europe/Berlin (GMT+1)',
  availability: 'Mo-Fr, 08:00-18:00',
  preferredContact: 'E-Mail',
  language: 'Deutsch',
  isOnline: true,
};

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'call',
    entity: 'Hofladen Müller',
    description: 'Angebot nachgefasst',
    timestamp: 'Vor 3 Tagen',
    duration: '15 Minuten',
  },
  {
    id: '2',
    type: 'visit',
    entity: 'REWE München',
    description: 'Präsentation vor Ort',
    timestamp: 'Vor 5 Tagen',
    duration: '45 Minuten',
  },
  {
    id: '3',
    type: 'email',
    entity: 'Edeka Schwabing',
    description: 'Vertragsentwurf gesendet',
    timestamp: 'Vor 7 Tagen',
  },
  {
    id: '4',
    type: 'note',
    entity: 'Hofladen Müller',
    description: 'Follow-up Termin vereinbart',
    timestamp: 'Vor 10 Tagen',
  },
];

const roleConfigs: Record<UserRole, { name: string; color: string; bgColor: string; borderColor: string }> = {
  GF: { name: 'Geschäftsführer', color: 'text-yellow-700', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200' },
  PLAN: { name: 'Planung', color: 'text-blue-700', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
  ADM: { name: 'Außendienst', color: 'text-green-700', bgColor: 'bg-green-100', borderColor: 'border-green-200' },
  KALK: { name: 'Kalkulation', color: 'text-amber-700', bgColor: 'bg-amber-100', borderColor: 'border-amber-200' },
  BUCH: { name: 'Buchhaltung', color: 'text-purple-700', bgColor: 'bg-purple-100', borderColor: 'border-purple-200' },
  INNEN: { name: 'Innendienst', color: 'text-gray-700', bgColor: 'bg-gray-100', borderColor: 'border-gray-200' },
};

// Profile Header Component
function ProfileHeader({
  profile,
  isOwnProfile,
  mode,
  onEditClick,
}: {
  profile: UserProfile;
  isOwnProfile: boolean;
  mode: ViewMode;
  onEditClick: () => void;
}) {
  const roleConfig = roleConfigs[profile.role];
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);

  return (
    <>
      <div className="relative mb-6">
        {/* Background Gradient */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg" />

        {/* Profile Content */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row gap-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarFallback className="text-3xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute bottom-2 right-2 h-6 w-6 rounded-full border-2 border-background ${profile.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              {isOwnProfile && (
                <button
                  onClick={() => setShowAvatarDialog(true)}
                  className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Name and Role */}
            <div className="flex-1 mt-4 md:mt-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="mb-2">{profile.name}</h1>
                  <Badge variant="outline" className={`${roleConfig.bgColor} ${roleConfig.color} ${roleConfig.borderColor}`}>
                    {roleConfig.name} ({profile.role})
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <Button variant={mode === 'edit' ? 'default' : 'outline'} onClick={onEditClick}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      {mode === 'edit' ? 'Ansicht' : 'Bearbeiten'}
                    </Button>
                  ) : (
                    <Button variant="default">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Nachricht senden
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Bar */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profile.email}</span>
            </a>
            <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profile.phone}</span>
            </a>
            <a href={`tel:${profile.mobile}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span>{profile.mobile}</span>
            </a>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Upload Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profilbild ändern</DialogTitle>
            <DialogDescription>
              Laden Sie ein neues Profilbild hoch oder verwenden Sie einen Standardavatar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-3xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Camera className="h-4 w-4 mr-2" />
                Foto hochladen
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" />
                Foto aufnehmen
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Von URL laden
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Standardavatar verwenden
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvatarDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={() => {
              toast.success('Profilbild aktualisiert');
              setShowAvatarDialog(false);
            }}>
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Overview Tab Component
function OverviewTab({ profile, mode }: { profile: UserProfile; mode: ViewMode }) {
  return (
    <div className="space-y-6">
      {/* About Me */}
      <Card>
        <CardHeader>
          <CardTitle>Über mich</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Position</Label>
              {mode === 'edit' ? (
                <Input defaultValue={profile.position} className="mt-2" />
              ) : (
                <p className="mt-2">{profile.position}</p>
              )}
            </div>
            <div>
              <Label>Abteilung</Label>
              {mode === 'edit' ? (
                <Input defaultValue={profile.department} className="mt-2" />
              ) : (
                <p className="mt-2">{profile.department}</p>
              )}
            </div>
            <div>
              <Label>Standort</Label>
              {mode === 'edit' ? (
                <Input defaultValue={profile.location} className="mt-2" />
              ) : (
                <p className="mt-2">{profile.location}, Deutschland</p>
              )}
            </div>
            <div>
              <Label>Im Team seit</Label>
              <p className="mt-2">{profile.joinedDate}</p>
            </div>
          </div>
          <div>
            <Label>Bio</Label>
            {mode === 'edit' ? (
              <Textarea defaultValue={profile.bio} className="mt-2" rows={3} maxLength={500} />
            ) : (
              <p className="mt-2 text-muted-foreground">{profile.bio}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Berechtigungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Rolle:</span>
            <Badge variant="outline" className={`${roleConfigs[profile.role].bgColor} ${roleConfigs[profile.role].color} ${roleConfigs[profile.role].borderColor}`}>
              {roleConfigs[profile.role].name} ({profile.role})
            </Badge>
          </div>
          <Separator />
          <div className="space-y-2">
            {[
              { label: 'Eigene Kunden verwalten', allowed: true },
              { label: 'Aktivitäten erstellen', allowed: true },
              { label: 'Opportunities verwalten', allowed: true },
              { label: 'Finanzdaten anzeigen', allowed: false },
              { label: 'Benutzer verwalten', allowed: false },
            ].map((permission, index) => (
              <div key={index} className="flex items-center gap-2">
                {permission.allowed ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span className={permission.allowed ? '' : 'text-muted-foreground'}>
                  {permission.label}
                </span>
              </div>
            ))}
          </div>
          <Button variant="link" className="p-0 h-auto">
            Alle Berechtigungen anzeigen
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Contact Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Kontaktpräferenzen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Bevorzugte Kontaktmethode</Label>
              {mode === 'edit' ? (
                <Select defaultValue={profile.preferredContact}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E-Mail">E-Mail</SelectItem>
                    <SelectItem value="Telefon">Telefon</SelectItem>
                    <SelectItem value="Mobil">Mobil</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-2">{profile.preferredContact}</p>
              )}
            </div>
            <div>
              <Label>Sprache</Label>
              <p className="mt-2">{profile.language}</p>
            </div>
            <div>
              <Label>Zeitzone</Label>
              {mode === 'edit' ? (
                <Select defaultValue={profile.timezone}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Berlin (GMT+1)">Europe/Berlin (GMT+1)</SelectItem>
                    <SelectItem value="Europe/London (GMT+0)">Europe/London (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-2">{profile.timezone}</p>
              )}
            </div>
            <div>
              <Label>Verfügbarkeit</Label>
              {mode === 'edit' ? (
                <Input defaultValue={profile.availability} className="mt-2" />
              ) : (
                <p className="mt-2">{profile.availability}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Customers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Meine Kunden</CardTitle>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              32 Kunden
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {['HM', 'RM', 'ES', '+29'].map((initials, index) => (
              <Avatar key={index} className={index === 3 ? 'bg-muted' : ''}>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Hofladen Müller</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>REWE München</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Edeka Schwabing</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <Button variant="link" className="p-0 h-auto">
            Alle Kunden anzeigen
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Current Opportunities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Aktuelle Opportunities</CardTitle>
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
              12 Opportunities (€ 850.000)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p>REWE München</p>
                <p className="text-sm text-muted-foreground">€ 125.000</p>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={75} className="w-20" />
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p>Edeka Schwabing</p>
                <p className="text-sm text-muted-foreground">€ 80.000</p>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={60} className="w-20" />
                <span className="text-sm text-muted-foreground">60%</span>
              </div>
            </div>
          </div>
          <Button variant="link" className="p-0 h-auto">
            Alle Opportunities anzeigen
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Activity Tab Component
function ActivityTab() {
  const [activityType, setActivityType] = useState({
    calls: true,
    visits: true,
    emails: true,
    notes: true,
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <PhoneCall className="h-4 w-4" />;
      case 'visit': return <Users className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'note': return <FileText className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-600';
      case 'visit': return 'bg-green-100 text-green-600';
      case 'email': return 'bg-purple-100 text-purple-600';
      case 'note': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'call': return 'Anruf';
      case 'visit': return 'Besuch';
      case 'email': return 'E-Mail';
      case 'note': return 'Notiz';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="mb-3 block">Aktivitätstyp</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={activityType.calls}
                    onCheckedChange={(checked) => setActivityType({ ...activityType, calls: !!checked })}
                    id="calls"
                  />
                  <Label htmlFor="calls" className="cursor-pointer">Anrufe</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={activityType.visits}
                    onCheckedChange={(checked) => setActivityType({ ...activityType, visits: !!checked })}
                    id="visits"
                  />
                  <Label htmlFor="visits" className="cursor-pointer">Besuche</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={activityType.emails}
                    onCheckedChange={(checked) => setActivityType({ ...activityType, emails: !!checked })}
                    id="emails"
                  />
                  <Label htmlFor="emails" className="cursor-pointer">E-Mails</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={activityType.notes}
                    onCheckedChange={(checked) => setActivityType({ ...activityType, notes: !!checked })}
                    id="notes"
                  />
                  <Label htmlFor="notes" className="cursor-pointer">Notizen</Label>
                </div>
              </div>
            </div>
            <div>
              <Label>Zeitraum</Label>
              <Select defaultValue="30days">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Letzte 7 Tage</SelectItem>
                  <SelectItem value="30days">Letzter Monat</SelectItem>
                  <SelectItem value="quarter">Dieses Quartal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Kunde</Label>
              <Select defaultValue="all">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kunden</SelectItem>
                  <SelectItem value="hm">Hofladen Müller</SelectItem>
                  <SelectItem value="rewe">REWE München</SelectItem>
                  <SelectItem value="edeka">Edeka Schwabing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitätszusammenfassung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl mb-1">124</p>
              <p className="text-sm text-muted-foreground">Gesamt</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl text-blue-600 mb-1">45</p>
              <p className="text-sm text-muted-foreground">Anrufe</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl text-green-600 mb-1">32</p>
              <p className="text-sm text-muted-foreground">Besuche</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl text-purple-600 mb-1">28</p>
              <p className="text-sm text-muted-foreground">E-Mails</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl text-gray-600 mb-1">19</p>
              <p className="text-sm text-muted-foreground">Notizen</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span>+12% vs. letzter Monat</span>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitätsverlauf (Letzte 30 Tage)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="mb-1">
                        <span className="mr-2">{getActivityLabel(activity.type)}</span>
                        <span className="text-muted-foreground">· {activity.entity}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <span className="text-sm text-muted-foreground shrink-0">{activity.timestamp}</span>
                  </div>
                  {activity.duration && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Clock className="h-3 w-3" />
                      <span>{activity.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Statistics Tab Component
function StatisticsTab() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-3xl mb-1">32</p>
            <p className="text-sm text-muted-foreground mb-2">Meine Kunden</p>
            <p className="text-xs text-green-600">+3 diesen Monat</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-amber-600" />
              <span className="text-xs text-muted-foreground">42%</span>
            </div>
            <p className="text-3xl mb-1">€ 850k</p>
            <p className="text-sm text-muted-foreground mb-2">Opportunities</p>
            <p className="text-xs text-muted-foreground">Conversion Rate: 42%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-5 w-5 text-green-600" />
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-3xl mb-1">8</p>
            <p className="text-sm text-muted-foreground mb-2">Gewonnene Deals</p>
            <p className="text-xs text-green-600">€ 450.000 Wert</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span className="text-xs text-muted-foreground">Ø 4,1/Tag</span>
            </div>
            <p className="text-3xl mb-1">124</p>
            <p className="text-sm text-muted-foreground mb-2">Aktivitäten</p>
            <p className="text-xs text-purple-600">Diesen Monat</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Opportunities by Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunities nach Phase</CardTitle>
            <CardDescription>Verteilung im Verkaufstrichter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { stage: 'Neu', count: 3, value: '€ 180k', width: 100 },
                { stage: 'Qualifizierung', count: 4, value: '€ 280k', width: 80 },
                { stage: 'Angebot', count: 3, value: '€ 250k', width: 60 },
                { stage: 'Verhandlung', count: 2, value: '€ 140k', width: 40 },
                { stage: 'Gewonnen', count: 8, value: '€ 450k', width: 20 },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span>{item.stage}</span>
                    <span className="text-muted-foreground">{item.count} ({item.value})</span>
                  </div>
                  <Progress value={item.width} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activities by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitäten nach Typ</CardTitle>
            <CardDescription>Letzter Monat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'Anrufe', count: 45, percent: 36, color: 'bg-blue-500' },
                { type: 'Besuche', count: 32, percent: 26, color: 'bg-green-500' },
                { type: 'E-Mails', count: 28, percent: 23, color: 'bg-purple-500' },
                { type: 'Notizen', count: 19, percent: 15, color: 'bg-gray-500' },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${item.color}`} />
                      <span>{item.type}</span>
                    </div>
                    <span className="text-muted-foreground">{item.count} ({item.percent}%)</span>
                  </div>
                  <Progress value={item.percent} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Monatlicher Umsatz</CardTitle>
          <CardDescription>Gewonnene Opportunities (letzte 12 Monate)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 52, 48, 65, 58, 72, 68, 75, 82, 78, 88, 95].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600" style={{ height: `${value}%` }} />
                <span className="text-xs text-muted-foreground">
                  {['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][index]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Leistungsvergleich</CardTitle>
          <CardDescription>Vergleich mit Team-Durchschnitt</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Metrik</th>
                  <th className="text-center p-2">Ich</th>
                  <th className="text-center p-2">Team Ø</th>
                  <th className="text-center p-2">Rang</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: 'Kunden', me: '32', avg: '28,5', rank: '3/5', trend: 'up' },
                  { metric: 'Opportunities', me: '12', avg: '8,5', rank: '2/5', trend: 'up' },
                  { metric: 'Conversion Rate', me: '42%', avg: '38%', rank: '2/5', trend: 'up' },
                  { metric: 'Aktivitäten', me: '124', avg: '95', rank: '1/5', trend: 'up' },
                ].map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{row.metric}</td>
                    <td className="text-center p-2">{row.me}</td>
                    <td className="text-center p-2 text-muted-foreground">{row.avg}</td>
                    <td className="text-center p-2">
                      <div className="flex items-center justify-center gap-1">
                        <span>{row.rank}</span>
                        {row.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Team Tab Component
function TeamTab() {
  return (
    <div className="space-y-6">
      {/* Manager */}
      <Card>
        <CardHeader>
          <CardTitle>Vorgesetzter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>AW</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="mb-1">Anna Weber</p>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 mb-2">
                Planung (PLAN)
              </Badge>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <a href="mailto:a.weber@kompass.de" className="hover:text-primary">
                  <Mail className="h-4 w-4 inline mr-1" />
                  a.weber@kompass.de
                </a>
                <a href="tel:+49-170-2345678" className="hover:text-primary">
                  <Phone className="h-4 w-4 inline mr-1" />
                  +49-170-2345678
                </a>
              </div>
            </div>
            <Button variant="outline">Kontaktieren</Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Mein Team</CardTitle>
          <CardDescription>Außendienst-Kollegen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Thomas Müller', initials: 'TM', customers: 28, opportunities: 9, online: true },
              { name: 'Sarah Fischer', initials: 'SF', customers: 25, opportunities: 11, online: false },
              { name: 'Markus Klein', initials: 'MK', customers: 30, opportunities: 7, online: true },
            ].map((member, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${member.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <p className="mb-1">{member.name}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{member.customers} Kunden</span>
                    <span>{member.opportunities} Opportunities</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Profil</Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Privacy Settings Component
function PrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    activityVisible: false,
    contactVisible: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datenschutz-Einstellungen</CardTitle>
        <CardDescription>Steuern Sie, wer Ihre Informationen sehen kann</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {privacySettings.profileVisible ? (
              <Eye className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
            <Label>Profil für Team sichtbar</Label>
          </div>
          <Checkbox
            checked={privacySettings.profileVisible}
            onCheckedChange={(checked) =>
              setPrivacySettings({ ...privacySettings, profileVisible: !!checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {privacySettings.activityVisible ? (
              <Eye className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
            <Label>Aktivitäten für Team sichtbar</Label>
          </div>
          <Checkbox
            checked={privacySettings.activityVisible}
            onCheckedChange={(checked) =>
              setPrivacySettings({ ...privacySettings, activityVisible: !!checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {privacySettings.contactVisible ? (
              <Eye className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
            <Label>Kontaktdaten für Team sichtbar</Label>
          </div>
          <Checkbox
            checked={privacySettings.contactVisible}
            onCheckedChange={(checked) =>
              setPrivacySettings({ ...privacySettings, contactVisible: !!checked })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Main Profile Component
export function UserProfileView({
  isOwnProfile = true,
  userRole = 'ADM',
}: {
  isOwnProfile?: boolean;
  userRole?: UserRole;
}) {
  const [mode, setMode] = useState<ViewMode>('view');
  const [activeTab, setActiveTab] = useState('overview');

  const handleModeToggle = () => {
    if (mode === 'edit') {
      toast.success('Änderungen gespeichert');
    }
    setMode(mode === 'view' ? 'edit' : 'view');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <ProfileHeader
        profile={mockProfile}
        isOwnProfile={isOwnProfile}
        mode={mode}
        onEditClick={handleModeToggle}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="activity">Aktivität</TabsTrigger>
          <TabsTrigger value="statistics">Statistiken</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview">
            <div className="space-y-6">
              <OverviewTab profile={mockProfile} mode={mode} />
              {isOwnProfile && <PrivacySettings />}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <ActivityTab />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsTab />
          </TabsContent>

          <TabsContent value="team">
            <TeamTab />
          </TabsContent>
        </div>
      </Tabs>

      {mode === 'edit' && (
        <div className="sticky bottom-4 mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setMode('view')}>
            Abbrechen
          </Button>
          <Button onClick={handleModeToggle}>
            Änderungen speichern
          </Button>
        </div>
      )}
    </div>
  );
}

// Demo Component
export function UserProfileDemo() {
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('ADM');

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Ansichtsmodus</Label>
                <div className="flex gap-2">
                  <Button
                    variant={isOwnProfile ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsOwnProfile(true)}
                  >
                    Eigenes Profil
                  </Button>
                  <Button
                    variant={!isOwnProfile ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsOwnProfile(false)}
                  >
                    Fremdes Profil
                  </Button>
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Benutzerrolle</Label>
                <div className="flex gap-2">
                  {(['ADM', 'GF', 'PLAN'] as UserRole[]).map((role) => (
                    <Button
                      key={role}
                      variant={userRole === role ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUserRole(role)}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div className="border border-border rounded-lg p-6 bg-muted/50">
              <h3 className="mb-4">Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Profile header (gradient background, avatar, role badge)</li>
                  <li>• Status indicator (online/offline dot)</li>
                  <li>• Quick contact bar (email, phone, mobile, location)</li>
                  <li>• 4 tabs (Übersicht/Aktivität/Statistiken/Team)</li>
                  <li>• Avatar upload dialog (4 options)</li>
                  <li>• Edit mode (inline editing)</li>
                  <li>• About me section (position, department, location, bio)</li>
                  <li>• Permissions summary (5 permissions with ✅/❌)</li>
                  <li>• Contact preferences (4 settings)</li>
                  <li>• My customers (32 with avatars)</li>
                  <li>• Current opportunities (12 with progress bars)</li>
                  <li>• Activity timeline (with filters)</li>
                  <li>• Activity summary (124 total, breakdown by type)</li>
                  <li>• Activity type filters (checkboxes)</li>
                  <li>• Date range filter (dropdown)</li>
                </ul>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Customer filter (dropdown)</li>
                  <li>• 4 KPI cards (customers, opportunities, deals, activities)</li>
                  <li>• Opportunities funnel chart</li>
                  <li>• Activities pie chart (4 types)</li>
                  <li>• Monthly revenue line chart (12 months)</li>
                  <li>• Performance comparison table (vs team avg)</li>
                  <li>• Manager card (with contact info)</li>
                  <li>• Team members list (3 colleagues)</li>
                  <li>• Privacy settings (3 toggles)</li>
                  <li>• Own profile vs public profile views</li>
                  <li>• Edit mode sticky save bar</li>
                  <li>• Auto-save toast notifications</li>
                  <li>• Mobile-responsive layout</li>
                  <li>• German labels throughout</li>
                  <li>• Design system compliance (CSS variables)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile */}
      <UserProfileView isOwnProfile={isOwnProfile} userRole={userRole} />
    </div>
  );
}
