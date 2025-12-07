import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Moon, Sun, Laptop, Bell, Lock, Globe, Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Einstellungen</h2>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Kontoeinstellungen und Präferenzen.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Allgemein</TabsTrigger>
          <TabsTrigger value="appearance">Erscheinungsbild</TabsTrigger>
          <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          <TabsTrigger value="account">Konto</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sprache & Region</CardTitle>
              <CardDescription>
                Passen Sie die Sprache und das regionale Format an.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Sprache</Label>
                  <Select defaultValue="de">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Sprache auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zeitzone</Label>
                  <Select defaultValue="berlin">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Zeitzone auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="berlin">Europe/Berlin (CET)</SelectItem>
                      <SelectItem value="london">Europe/London (GMT)</SelectItem>
                      <SelectItem value="newyork">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Design</CardTitle>
              <CardDescription>
                Wählen Sie das Erscheinungsbild der Anwendung.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Thema</Label>
                <div className="grid grid-cols-3 gap-4 max-w-md">
                  <div>
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      className="w-full justify-start h-auto py-4 flex-col gap-2"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-6 w-6" />
                      <span>Hell</span>
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      className="w-full justify-start h-auto py-4 flex-col gap-2"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-6 w-6" />
                      <span>Dunkel</span>
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      className="w-full justify-start h-auto py-4 flex-col gap-2"
                      onClick={() => setTheme('system')}
                    >
                      <Laptop className="h-6 w-6" />
                      <span>System</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Benachrichtigungen</CardTitle>
              <CardDescription>
                Steuern Sie, wie und wann Sie benachrichtigt werden.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="text-base">E-Mail Benachrichtigungen</Label>
                    <p className="text-sm text-muted-foreground">
                      Erhalten Sie tägliche Zusammenfassungen per E-Mail.
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-4">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Benachrichtigungen</Label>
                    <p className="text-sm text-muted-foreground">
                      Benachrichtigungen über neue Aufgaben und Termine.
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sicherheit</CardTitle>
              <CardDescription>
                Verwalten Sie Ihr Passwort und Sicherheitseinstellungen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Lock className="mr-2 h-4 w-4" />
                  Passwort ändern
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
