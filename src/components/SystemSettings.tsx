import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import {
  Settings,
  User,
  Palette,
  Bell,
  WifiOff,
  Shield,
  Server,
  Info,
  Search,
  Camera,
  Lock,
  Smartphone,
  Mail,
  Phone,
  Globe,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Download,
  Trash2,
  Clock,
  RefreshCw,
  Database,
  FileText,
  Users,
  Key,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Zap,
  Rocket,
} from 'lucide-react';

// Types
type UserRole = 'GF' | 'PLAN' | 'ADM' | 'KALK' | 'BUCH' | 'INNEN';
type Theme = 'light' | 'dark' | 'auto';

interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  position: string;
  phone: string;
  avatar?: string;
}

// Mock user data
const mockUser: UserProfile = {
  name: 'Michael Schmidt',
  email: 'm.schmidt@kompass.de',
  role: 'ADM',
  position: 'Senior Außendienstmitarbeiter',
  phone: '+49-170-1234567',
};

// Settings Header Component
function SettingsHeader({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <h1>Einstellungen</h1>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Einstellungen durchsuchen..."
          className="pl-10"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}

// Account Tab Component
function AccountTab({ user }: { user: UserProfile }) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Alle Felder sind erforderlich');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwörter stimmen nicht überein');
      return;
    }
    toast.success('Passwort erfolgreich geändert');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-muted-foreground text-sm">Klicken Sie, um das Foto zu ändern</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Hochladen</Button>
                <Button variant="ghost" size="sm">Entfernen</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input defaultValue={user.name} className="mt-2" />
            </div>
            <div>
              <Label>E-Mail</Label>
              <Input defaultValue={user.email} disabled className="mt-2 bg-muted" />
            </div>
            <div>
              <Label>Rolle</Label>
              <div className="mt-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Außendienst ({user.role})
                </Badge>
              </div>
            </div>
            <div>
              <Label>Position</Label>
              <Input defaultValue={user.position} className="mt-2" />
            </div>
            <div>
              <Label>Telefon</Label>
              <Input defaultValue={user.phone} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Passwort ändern</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Aktuelles Passwort</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Neues Passwort</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Min. 12 Zeichen, Groß-/Kleinbuchstaben, Zahl, Sonderzeichen
            </p>
          </div>
          <div>
            <Label>Passwort bestätigen</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button onClick={handlePasswordChange}>
            <Lock className="h-4 w-4 mr-2" />
            Passwort ändern
          </Button>
        </CardContent>
      </Card>

      {/* 2FA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Zwei-Faktor-Authentifizierung (2FA)</CardTitle>
          <CardDescription>Zusätzliche Sicherheit für Ihr Konto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label>2FA aktivieren</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Status: {twoFactorEnabled ? (
                  <span className="text-green-600">Aktiviert</span>
                ) : (
                  <span className="text-red-600">Nicht aktiviert</span>
                )}
              </p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>
          {twoFactorEnabled && (
            <>
              <div>
                <Label>Methode</Label>
                <Select defaultValue="app">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="app">Authentifizierungs-App (empfohlen)</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">E-Mail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Smartphone className="h-4 w-4 mr-2" />
                Jetzt einrichten
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sessions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Aktive Sitzungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Monitor className="h-5 w-5 text-green-600" />
              <div>
                <p>Diese Sitzung</p>
                <p className="text-sm text-muted-foreground">Chrome, Windows</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              Aktiv
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <div>
                <p>Mobil</p>
                <p className="text-sm text-muted-foreground">iOS, iPhone 13</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">Abmelden</Button>
          </div>
          <Button variant="outline" className="w-full">
            Alle anderen Sitzungen abmelden
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Appearance Tab Component
function AppearanceTab() {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState([50]);
  const [compactMode, setCompactMode] = useState(false);

  return (
    <div className="space-y-6">
      {/* Theme Section */}
      <Card>
        <CardHeader>
          <CardTitle>Thema</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={(v) => setTheme(v as Theme)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`border-2 rounded-lg p-4 cursor-pointer ${theme === 'light' ? 'border-primary' : 'border-border'}`}>
                <RadioGroupItem value="light" id="light" className="sr-only" />
                <label htmlFor="light" className="cursor-pointer">
                  <div className="h-24 bg-white border rounded-lg mb-3 flex items-center justify-center">
                    <Sun className="h-8 w-8 text-yellow-500" />
                  </div>
                  <p className="text-center">Hell</p>
                </label>
              </div>
              <div className={`border-2 rounded-lg p-4 cursor-pointer ${theme === 'dark' ? 'border-primary' : 'border-border'}`}>
                <RadioGroupItem value="dark" id="dark" className="sr-only" />
                <label htmlFor="dark" className="cursor-pointer">
                  <div className="h-24 bg-gray-900 border rounded-lg mb-3 flex items-center justify-center">
                    <Moon className="h-8 w-8 text-blue-300" />
                  </div>
                  <p className="text-center">Dunkel</p>
                </label>
              </div>
              <div className={`border-2 rounded-lg p-4 cursor-pointer ${theme === 'auto' ? 'border-primary' : 'border-border'}`}>
                <RadioGroupItem value="auto" id="auto" className="sr-only" />
                <label htmlFor="auto" className="cursor-pointer">
                  <div className="h-24 bg-gradient-to-b from-white to-gray-900 border rounded-lg mb-3 flex items-center justify-center">
                    <Monitor className="h-8 w-8" />
                  </div>
                  <p className="text-center">Automatisch</p>
                </label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Language Section */}
      <Card>
        <CardHeader>
          <CardTitle>Sprache</CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue="de">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
              <SelectItem value="en" disabled>🇬🇧 English (coming soon)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-2">
            MVP: Nur Deutsch verfügbar
          </p>
        </CardContent>
      </Card>

      {/* Font Size Section */}
      <Card>
        <CardHeader>
          <CardTitle>Schriftgröße</CardTitle>
          <CardDescription>Für bessere Lesbarkeit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Klein</span>
            <Slider value={fontSize} onValueChange={setFontSize} max={100} step={1} className="flex-1" />
            <span className="text-sm text-muted-foreground">Groß</span>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p style={{ fontSize: `${fontSize[0]}%` }}>
              Vorschautext: Dies ist ein Beispieltext
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Compact Mode Section */}
      <Card>
        <CardHeader>
          <CardTitle>Kompakt-Modus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label>Kompakte Ansicht</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Reduzierte Abstände, mehr Inhalte auf dem Bildschirm
              </p>
            </div>
            <Switch checked={compactMode} onCheckedChange={setCompactMode} />
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Config Section */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard-Konfiguration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {['KPI-Karten', 'Heutige Route', 'Meine Aufgaben', 'Opportunities (diese Woche)'].map((widget, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <Checkbox defaultChecked={index < 3} id={`widget-${index}`} />
                <Label htmlFor={`widget-${index}`} className="flex-1 cursor-pointer">
                  {widget}
                </Label>
                <button className="text-muted-foreground hover:text-foreground">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            Standard wiederherstellen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Notifications Tab Component
function NotificationsTab() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);

  return (
    <div className="space-y-6">
      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Push-Benachrichtigungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label>Push-Benachrichtigungen aktivieren</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Erlaubt
                </Badge>
              </div>
            </div>
            <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Benachrichtigungs-Typen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Neue Aktivität bei meinen Kunden', defaultChecked: true },
            { label: 'Opportunity schließt bald', defaultChecked: true },
            { label: 'Neue Nachricht von Team-Mitglied', defaultChecked: true },
            { label: 'Daten synchronisiert', defaultChecked: true },
            { label: 'Neue System-Updates', defaultChecked: false },
            { label: 'Marketing-Nachrichten', defaultChecked: false },
          ].map((type, index) => (
            <div key={index} className="flex items-start gap-3">
              <Checkbox defaultChecked={type.defaultChecked} id={`notif-${index}`} />
              <div className="flex-1">
                <Label htmlFor={`notif-${index}`} className="cursor-pointer">
                  {type.label}
                </Label>
                {index === 0 && (
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Sound: Ein</span>
                    <span>Badge: Ein</span>
                    <span>Banner: Ein</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>E-Mail-Benachrichtigungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>E-Mail-Benachrichtigungen</Label>
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
          </div>
          {emailEnabled && (
            <RadioGroup defaultValue="instant">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="instant" id="instant" />
                  <Label htmlFor="instant" className="cursor-pointer">Sofort</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily" className="cursor-pointer">Täglich (Zusammenfassung)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly" className="cursor-pointer">Wöchentlich</Label>
                </div>
              </div>
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Ruhezeiten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Nicht stören</Label>
            <Switch checked={quietHoursEnabled} onCheckedChange={setQuietHoursEnabled} />
          </div>
          {quietHoursEnabled && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Von</Label>
                  <Input type="time" defaultValue="20:00" className="mt-2" />
                </div>
                <div>
                  <Label>Bis</Label>
                  <Input type="time" defaultValue="07:00" className="mt-2" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
                  <div key={day} className="flex items-center gap-2">
                    <Checkbox defaultChecked id={`day-${day}`} />
                    <Label htmlFor={`day-${day}`} className="cursor-pointer">{day}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Offline & Sync Tab Component
function OfflineSyncTab() {
  const [autoSync, setAutoSync] = useState(true);
  const [preloadEnabled, setPreloadEnabled] = useState(true);

  return (
    <div className="space-y-6">
      {/* Synchronization */}
      <Card>
        <CardHeader>
          <CardTitle>Synchronisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Automatische Synchronisation</Label>
            <Switch checked={autoSync} onCheckedChange={setAutoSync} />
          </div>
          {autoSync && (
            <>
              <div>
                <Label className="mb-2 block">Netzwerk</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox defaultChecked id="wifi" />
                    <Label htmlFor="wifi" className="cursor-pointer">WLAN</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="mobile" />
                    <Label htmlFor="mobile" className="cursor-pointer">Mobilfunk</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label>Häufigkeit</Label>
                <Select defaultValue="15min">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">Alle 15 Minuten</SelectItem>
                    <SelectItem value="1hour">Jede Stunde</SelectItem>
                    <SelectItem value="manual">Manuell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Offline Data */}
      <Card>
        <CardHeader>
          <CardTitle>Offline-Daten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Speicherplatz genutzt</span>
              <span className="text-sm text-muted-foreground">2,3 MB von 50 MB</span>
            </div>
            <Progress value={4.6} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Kunden</p>
              <Badge variant="outline" className="mt-1 bg-blue-100 text-blue-800 border-blue-200">
                32 offline
              </Badge>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Aktivitäten</p>
              <Badge variant="outline" className="mt-1">124 offline</Badge>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Opportunities</p>
              <Badge variant="outline" className="mt-1">12 offline</Badge>
            </div>
          </div>
          <div>
            <Label>Offline-Zeitraum: 30 Tage</Label>
            <Slider defaultValue={[30]} max={90} step={1} className="mt-2" />
          </div>
          <Button variant="outline" className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            Daten bereinigen
          </Button>
        </CardContent>
      </Card>

      {/* Preload Data */}
      <Card>
        <CardHeader>
          <CardTitle>Daten vorladen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Daten vorladen bei WLAN</Label>
            <Switch checked={preloadEnabled} onCheckedChange={setPreloadEnabled} />
          </div>
          {preloadEnabled && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox defaultChecked id="preload-customers" />
                <Label htmlFor="preload-customers" className="cursor-pointer">Meine Kunden</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox defaultChecked id="preload-opportunities" />
                <Label htmlFor="preload-opportunities" className="cursor-pointer">Meine Opportunities</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="preload-all" />
                <Label htmlFor="preload-all" className="cursor-pointer">
                  Alle Kunden (nur GF/PLAN)
                </Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conflict Resolution */}
      <Card>
        <CardHeader>
          <CardTitle>Konfliktlösung</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="newest">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="newest" id="newest" />
                <Label htmlFor="newest" className="cursor-pointer">Neueste Version bevorzugen</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="local" id="local" />
                <Label htmlFor="local" className="cursor-pointer">Immer meine Version</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="server" id="server" />
                <Label htmlFor="server" className="cursor-pointer">Immer Server-Version</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="ask" id="ask" />
                <Label htmlFor="ask" className="cursor-pointer">Immer nachfragen</Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}

// Privacy & Security Tab Component
function PrivacySecurityTab() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  return (
    <div className="space-y-6">
      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Datenschutz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Datenschutzerklärung anzeigen
            <ExternalLink className="h-4 w-4 ml-auto" />
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Datenverarbeitungsvertrag (AVV)
            <ExternalLink className="h-4 w-4 ml-auto" />
          </Button>
        </CardContent>
      </Card>

      {/* Data Deletion */}
      <Card>
        <CardHeader>
          <CardTitle>Datenlöschung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Meine Daten herunterladen
          </Button>
          <Button variant="destructive" className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            Konto löschen
          </Button>
        </CardContent>
      </Card>

      {/* Session Timeout */}
      <Card>
        <CardHeader>
          <CardTitle>Sitzungs-Timeout</CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue="15min">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15min">Nach 15 Minuten Inaktivität abmelden</SelectItem>
              <SelectItem value="30min">Nach 30 Minuten</SelectItem>
              <SelectItem value="1hour">Nach 1 Stunde</SelectItem>
              <SelectItem value="2hours">Nach 2 Stunden</SelectItem>
              <SelectItem value="4hours">Nach 4 Stunden</SelectItem>
              <SelectItem value="never">Nie</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Biometric Auth */}
      <Card>
        <CardHeader>
          <CardTitle>Biometrische Authentifizierung</CardTitle>
          <CardDescription>Nur für mobile Geräte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label>Face ID / Touch ID</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Schneller Zugriff mit biometrischer Authentifizierung
              </p>
            </div>
            <Switch checked={biometricEnabled} onCheckedChange={setBiometricEnabled} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// System Tab Component (GF only)
function SystemTab() {
  return (
    <div className="space-y-6">
      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>Benutzer-Verwaltung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p>5 aktive Benutzer, 2 eingeladen</p>
              <p className="text-sm text-muted-foreground mt-1">Lizenz: 10 Benutzer maximum</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <Users className="h-4 w-4 mr-2" />
            Benutzer verwalten
          </Button>
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Rollen & Berechtigungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full">
            <Key className="h-4 w-4 mr-2" />
            RBAC-Matrix anzeigen
          </Button>
          <Button variant="outline" className="w-full">
            <Shield className="h-4 w-4 mr-2" />
            Rollen bearbeiten
          </Button>
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader>
          <CardTitle>Backup & Wiederherstellung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-green-900">Letztes Backup: Vor 2 Stunden</span>
            </div>
            <p className="text-sm text-green-700">Häufigkeit: Täglich, 02:00 Uhr</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Backup erstellen
            </Button>
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Wiederherstellen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle>Audit-Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Vollständigen Audit-Log anzeigen
          </Button>
          <div className="space-y-2">
            <p className="text-sm">Letzte Ereignisse:</p>
            {[
              'Benutzer angemeldet: Michael Schmidt',
              'Kunde erstellt: Hofladen Müller',
              'Einstellung geändert: 2FA aktiviert',
            ].map((event, index) => (
              <div key={index} className="text-sm text-muted-foreground p-2 bg-muted rounded">
                • {event}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GoBD Settings */}
      <Card>
        <CardHeader>
          <CardTitle>GoBD-Einstellungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>GoBD-konform</span>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Aufbewahrungsfrist:</p>
            <p>10 Jahre (gesetzlich vorgeschrieben)</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label>Rechnungen automatisch finalisieren nach 7 Tagen</Label>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Integrationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p>DATEV</p>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mt-1">
                  Verbunden
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">Konfigurieren</Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p>n8n Workflows</p>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mt-1">
                  Aktiv
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">Verwalten</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// About Tab Component
function AboutTab() {
  return (
    <div className="space-y-6">
      {/* Version */}
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Rocket className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mb-2">KOMPASS</h2>
          <div className="space-y-1 text-muted-foreground">
            <p>Version 1.0.0</p>
            <p className="text-sm">Build 2024.11.15-1234</p>
            <p className="text-sm">Letzte Aktualisierung: 15.11.2024</p>
          </div>
        </CardContent>
      </Card>

      {/* License */}
      <Card>
        <CardHeader>
          <CardTitle>Lizenz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Typ:</span>
            <Badge>Enterprise</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gültig bis:</span>
            <span>31.12.2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Benutzer:</span>
            <span>5 von 10</span>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle>Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="mailto:support@kompass.de">
              <Mail className="h-4 w-4 mr-2" />
              support@kompass.de
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="tel:+4989XXXXXXX">
              <Phone className="h-4 w-4 mr-2" />
              +49-89-XXXXXXX
            </a>
          </Button>
          <Button variant="outline" className="w-full">
            Hilfe-Center öffnen
          </Button>
          <Button variant="outline" className="w-full">
            Feedback senden
          </Button>
        </CardContent>
      </Card>

      {/* Legal */}
      <Card>
        <CardHeader>
          <CardTitle>Rechtliches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="link" className="w-full justify-start p-0">
            Nutzungsbedingungen
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="link" className="w-full justify-start p-0">
            Datenschutzerklärung
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="link" className="w-full justify-start p-0">
            Impressum
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Updates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>Ihre App ist aktuell</span>
          </div>
          <Button variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Nach Updates suchen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Settings Component
export function SystemSettings({ userRole = 'ADM' }: { userRole?: UserRole }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      toast.info(`Suche nach: ${query}`, { duration: 2000 });
    }
  };

  const handleSave = () => {
    toast.success('Einstellungen gespeichert');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <SettingsHeader onSearch={handleSearch} />

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Konto</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Darstellung</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Benachrichtigungen</span>
          </TabsTrigger>
          <TabsTrigger value="offline" className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span className="hidden sm:inline">Offline</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Datenschutz</span>
          </TabsTrigger>
          {userRole === 'GF' && (
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Über</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountTab user={mockUser} />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="offline">
          <OfflineSyncTab />
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacySecurityTab />
        </TabsContent>

        {userRole === 'GF' && (
          <TabsContent value="system">
            <SystemTab />
          </TabsContent>
        )}

        <TabsContent value="about">
          <AboutTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Demo Component
export function SystemSettingsDemo() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADM');

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Benutzerrolle (System-Tab nur für GF)</Label>
              <div className="flex gap-2">
                {(['GF', 'ADM'] as UserRole[]).map((role) => (
                  <Button
                    key={role}
                    variant={selectedRole === role ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRole(role)}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="border border-border rounded-lg p-6 bg-muted/50">
              <h3 className="mb-4">Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 7 Tabs (Account/Appearance/Notifications/Offline/Privacy/System/About)</li>
                  <li>• Search bar (top)</li>
                  <li>• Profile section (avatar upload, editable fields)</li>
                  <li>• Password change (strength indicator)</li>
                  <li>• 2FA setup (3 methods)</li>
                  <li>• Active sessions management</li>
                  <li>• Theme selector (Light/Dark/Auto) with previews</li>
                  <li>• Language dropdown (German only for MVP)</li>
                  <li>• Font size slider with preview</li>
                  <li>• Compact mode toggle</li>
                  <li>• Dashboard widget configuration</li>
                  <li>• Push notification settings</li>
                  <li>• Email notification frequency</li>
                  <li>• Quiet hours (time pickers + weekdays)</li>
                  <li>• Auto-sync settings (network + frequency)</li>
                </ul>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Offline data storage (progress bar + badges)</li>
                  <li>• Data preload settings</li>
                  <li>• Conflict resolution strategy</li>
                  <li>• Privacy links (DSGVO, AVV)</li>
                  <li>• Data download/deletion</li>
                  <li>• Session timeout dropdown</li>
                  <li>• Biometric auth toggle (mobile)</li>
                  <li>• User management (GF only)</li>
                  <li>• RBAC matrix link (GF only)</li>
                  <li>• Backup/restore (GF only)</li>
                  <li>• Audit log viewer (GF only)</li>
                  <li>• GoBD settings (GF only)</li>
                  <li>• Integrations (DATEV, n8n)</li>
                  <li>• Version info + license details</li>
                  <li>• Support contact (email/phone/help center)</li>
                  <li>• Legal links (Terms/Privacy/Imprint)</li>
                  <li>• Update checker</li>
                  <li>• Auto-save with toast notifications</li>
                  <li>• Role-based tab visibility</li>
                  <li>• Mobile-responsive layout</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <SystemSettings userRole={selectedRole} />
    </div>
  );
}