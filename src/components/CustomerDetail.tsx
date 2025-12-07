import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  ArrowLeft,
  Star,
  MoreVertical,
  Plus,
  FileText,
  CreditCard,
  History
} from 'lucide-react';
import { useData } from './providers/DataProvider';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface CustomerDetailProps {
  customerId: string;
  onBack: () => void;
}

export function CustomerDetail({ customerId, onBack }: CustomerDetailProps) {
  const { getCustomer, projects } = useData();
  const customer = getCustomer(customerId);
  const [activeTab, setActiveTab] = useState('overview');

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-semibold">Kunde nicht gefunden</h2>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Zurück zur Liste
        </Button>
      </div>
    );
  }

  const customerProjects = projects.filter(p => p.customer.includes(customer.companyName)); // Simple match for demo

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="mt-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{customer.companyName}</h1>
              <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                {customer.status === 'active' ? 'Aktiv' : 'Inaktiv'}
              </Badge>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-bold">{customer.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {customer.city}
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {customer.vatId}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
            <Button variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                Anrufen
            </Button>
            <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                E-Mail
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="projects">Projekte</TabsTrigger>
          <TabsTrigger value="invoices">Rechnungen</TabsTrigger>
          <TabsTrigger value="contacts">Kontakte</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Stammdaten</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Kundennummer</span>
                    <p className="font-medium">KD-{customer.id.padStart(5, '0')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Branche</span>
                    <p className="font-medium">Einzelhandel / Lebensmittel</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Webseite</span>
                    <p className="font-medium flex items-center gap-2">
                        <Globe className="h-3 w-3" /> www.beispiel-kunde.de
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Erstellt am</span>
                    <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString('de-DE')}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                    <h4 className="font-medium mb-2">Anschrift</h4>
                    <p className="text-sm text-muted-foreground">
                        Hauptstraße 123<br />
                        80331 München<br />
                        Deutschland
                    </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Betreuung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback>{customer.owner.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{customer.owner.name}</p>
                        <p className="text-sm text-muted-foreground">Key Account Manager</p>
                    </div>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Letzter Kontakt:</span>
                        <span>vor 3 Tagen</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Nächster Termin:</span>
                        <span>15.02.2025</span>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Laufende Projekte</h3>
                <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Neues Projekt</Button>
            </div>
            {customerProjects.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {customerProjects.map(project => (
                        <Card key={project.id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline">{project.status}</Badge>
                                    <span className="text-sm font-mono text-muted-foreground">{project.number}</span>
                                </div>
                                <CardTitle className="text-base mt-2">{project.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Budget:</span>
                                        <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(project.budget)}</span>
                                    </div>
                                    <div className="w-full bg-secondary h-2 rounded-full mt-2">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-muted-foreground border rounded-lg">
                    Keine aktiven Projekte gefunden.
                </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
