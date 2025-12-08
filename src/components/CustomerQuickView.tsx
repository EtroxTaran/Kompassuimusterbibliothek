import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent } from './ui/sheet';
import { toast } from 'sonner@2.0.3';
import {
  Search,
  Phone,
  Mail,
  MapPin,
  Plus,
  Navigation,
  Building2,
  Users,
  TrendingUp,
  FileText,
  Clock,
  X,
  Mic,
  MessageSquare,
  Calendar,
  User,
  Download,
} from 'lucide-react';
import { useData, Customer } from './providers/DataProvider';

// --- Extended types for UI ---
// We map the main DataProvider Customer type to this view's needs
// or just use helper functions to get the missing stats/activities

// Extended Customer Interface for View State
interface CustomerViewData extends Customer {
  distance: number;
  stats: {
    locations: number;
    contacts: number;
    opportunities: number;
    opportunityValue: number;
  };
  lastActivity: {
    type: 'call' | 'email' | 'visit' | 'note' | 'offer';
    description: string;
    daysAgo: number;
  };
  primaryContact: {
    name: string;
    position: string;
  };
}

// Activity type
interface Activity {
  id: string;
  type: 'call' | 'email' | 'visit' | 'note';
  description: string;
  daysAgo: number;
  user: string;
}

// Opportunity type
interface Opportunity {
  id: string;
  name: string;
  value: number;
  probability: number;
  status: string;
  closeDate: string;
}

// Contact type
interface Contact {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
}

// Document type
interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  date: string;
}

// --- Mock Data Generators (Client-side enrichment) ---
// In a real app, these would come from the backend relations

function enrichCustomerData(customer: Customer): CustomerViewData {
  // Deterministic "random" data based on ID for demo stability
  const idNum = parseInt(customer.id) || 0;
  
  return {
    ...customer,
    distance: (idNum * 2.5) % 50 + 2, // Random distance 2-52km
    stats: {
      locations: customer.additionalLocations ? customer.additionalLocations + 1 : 1,
      contacts: (idNum % 5) + 1,
      opportunities: (idNum % 3),
      opportunityValue: (idNum % 3) * 15000,
    },
    lastActivity: {
      type: ['call', 'email', 'visit', 'note', 'offer'][idNum % 5] as any,
      description: ['Termin vereinbart', 'Angebot versendet', 'Jahresgespräch', 'Notiz zu Sortiment', 'Rückfrage'][idNum % 5],
      daysAgo: (idNum % 14) + 1,
    },
    primaryContact: {
      name: customer.owner.name, // Using owner as primary contact for demo if no explicit contact
      position: 'Ansprechpartner',
    }
  };
}

const mockActivities: Activity[] = [
  { id: '1', type: 'call', description: 'Angebot nachgefasst', daysAgo: 3, user: 'Michael Schmidt' },
  { id: '2', type: 'email', description: 'Angebot versendet', daysAgo: 5, user: 'Michael Schmidt' },
  { id: '3', type: 'visit', description: 'Vor-Ort-Termin durchgeführt', daysAgo: 10, user: 'Michael Schmidt' },
];

const mockOpportunities: Opportunity[] = [
  { id: '1', name: 'Ladeneinrichtung Filiale Süd', value: 125000, probability: 75, status: 'Verhandlung', closeDate: '15.12.2024' },
  { id: '2', name: 'Regalsystem Erweiterung', value: 25000, probability: 50, status: 'Angebot', closeDate: '28.02.2025' },
];

const mockContacts: Contact[] = [
  { id: '1', name: 'Hans Müller', position: 'Geschäftsführer', phone: '+49-89-1234567', email: 'h.mueller@example.com' },
  { id: '2', name: 'Maria Schmidt', position: 'Einkaufsleitung', phone: '+49-89-1234568', email: 'm.schmidt@example.com' },
  { id: '3', name: 'Peter Weber', position: 'Projektleitung', phone: '+49-89-1234569', email: 'p.weber@example.com' },
];

const mockDocuments: Document[] = [
  { id: '1', name: 'Angebot_2024.pdf', type: 'pdf', date: 'Vor 5 Tagen' },
  { id: '2', name: 'Vertrag_Signed.pdf', type: 'pdf', date: 'Vor 2 Wochen' },
  { id: '3', name: 'Grundriss.jpg', type: 'image', date: 'Vor 1 Monat' },
];


// Get activity icon
function getActivityIcon(type: Activity['type']) {
  const icons = {
    call: <Phone className="h-4 w-4" />,
    email: <Mail className="h-4 w-4" />,
    visit: <MapPin className="h-4 w-4" />,
    note: <MessageSquare className="h-4 w-4" />,
  };
  return icons[type];
}

// Format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Customer Card Component
function CustomerCard({
  customer,
  onClick,
}: {
  customer: CustomerViewData;
  onClick: () => void;
}) {
  return (
    <Card className="mb-3 cursor-pointer hover:border-primary/50 transition-colors" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Logo/Initial */}
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {customer.companyName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
                 <h3 className="mb-1 truncate font-medium">{customer.companyName}</h3>
                 <Badge variant={customer.status === 'active' ? 'default' : 'secondary'} className="text-[10px] px-1 h-5">
                    {customer.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                 </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 truncate">
              Vor {customer.lastActivity.daysAgo}{' '}
              {customer.lastActivity.daysAgo === 1 ? 'Tag' : 'Tagen'} -{' '}
              {customer.lastActivity.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {customer.city} • {Math.round(customer.distance)} km
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-1 flex-col sm:flex-row">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toast.success(`Rufe ${customer.phone} an...`);
              }}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toast.success(`E-Mail an ${customer.email}...`);
              }}
            >
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick View Bottom Sheet Component
function QuickViewSheet({
  customer,
  isOpen,
  onClose,
}: {
  customer: CustomerViewData;
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleCall = () => {
    toast.success(`Rufe ${customer.phone} an...`, {
      description: 'Anruf protokollieren?',
      action: {
        label: 'Ja',
        onClick: () => toast.info('Aktivität wird protokolliert'),
      },
    });
  };

  const handleEmail = () => {
    toast.success(`E-Mail an ${customer.email} wird geöffnet...`);
  };

  const handleNavigate = () => {
    toast.success(`Navigation zu ${customer.billingAddress.street}, ${customer.billingAddress.city}...`);
  };

  const handleAddActivity = () => {
    toast.info('Aktivität hinzufügen...');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[90vh] p-0 border-0 rounded-t-xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Handle Bar */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-muted-foreground/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="mb-2 text-xl font-semibold">{customer.companyName}</h2>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    customer.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                >
                  {customer.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">Rating: {customer.rating}</Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3">
            <Button
              className="flex-col h-auto py-3 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleCall}
            >
              <Phone className="h-6 w-6 mb-1" />
              <span className="text-xs">Anrufen</span>
            </Button>
            <Button className="flex-col h-auto py-3" variant="secondary" onClick={handleEmail}>
              <Mail className="h-6 w-6 mb-1" />
              <span className="text-xs">E-Mail</span>
            </Button>
            <Button className="flex-col h-auto py-3" variant="secondary" onClick={handleNavigate}>
              <Navigation className="h-6 w-6 mb-1" />
              <span className="text-xs">Navigation</span>
            </Button>
            <Button
              className="flex-col h-auto py-3 bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleAddActivity}
            >
              <Plus className="h-6 w-6 mb-1" />
              <span className="text-xs">Aktivität</span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(90vh-200px)] px-6 py-4">
          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="mb-3 font-medium">Kontaktdaten</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 flex justify-center"><User className="h-5 w-5 text-muted-foreground" /></div>
                <div>
                  <p className="font-medium">{customer.owner.name}</p>
                  <p className="text-muted-foreground text-sm">Betreuer</p>
                </div>
              </div>
              <button
                className="flex items-center gap-3 w-full text-left hover:bg-muted/50 p-2 rounded-lg transition-colors -ml-2"
                onClick={handleCall}
              >
                <div className="w-8 flex justify-center"><Phone className="h-5 w-5 text-muted-foreground" /></div>
                <span>{customer.phone}</span>
              </button>
              <button
                className="flex items-center gap-3 w-full text-left hover:bg-muted/50 p-2 rounded-lg transition-colors -ml-2"
                onClick={handleEmail}
              >
                <div className="w-8 flex justify-center"><Mail className="h-5 w-5 text-muted-foreground" /></div>
                <span className="truncate">{customer.email}</span>
              </button>
              <button
                className="flex items-center gap-3 w-full text-left hover:bg-muted/50 p-2 rounded-lg transition-colors -ml-2"
                onClick={handleNavigate}
              >
                <div className="w-8 flex justify-center"><MapPin className="h-5 w-5 text-muted-foreground" /></div>
                <div>
                  <p>{customer.billingAddress.street}, {customer.billingAddress.postalCode} {customer.billingAddress.city}</p>
                  <p className="text-muted-foreground text-sm">{Math.round(customer.distance)} km entfernt</p>
                </div>
              </button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Quick Info Chips */}
          <div className="mb-6">
            <h3 className="mb-3 font-medium">Schnellinfos</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Standorte</p>
                    <p className="font-medium">{customer.stats.locations}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Kontakte</p>
                    <p className="font-medium">{customer.stats.contacts}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Opportunities</p>
                    <p className="font-medium text-sm">
                      {customer.stats.opportunities} ({formatCurrency(customer.stats.opportunityValue)})
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Letzte Rechnung</p>
                    <p className="font-medium text-sm">Vor 2 Wochen</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Recent Activities */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Kürzliche Aktivitäten</h3>
              <Button variant="ghost" size="sm">
                Alle anzeigen
              </Button>
            </div>
            <div className="space-y-3">
              {mockActivities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-3 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">
                          {activity.type === 'call' && 'Anruf'}
                          {activity.type === 'email' && 'E-Mail'}
                          {activity.type === 'visit' && 'Besuch'}
                          {activity.type === 'note' && 'Notiz'}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          Vor {activity.daysAgo}{' '}
                          {activity.daysAgo === 1 ? 'Tag' : 'Tagen'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {activity.user}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Opportunities */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Offene Opportunities</h3>
              <Button variant="ghost" size="sm">
                Alle anzeigen
              </Button>
            </div>
            <div className="space-y-3">
              {mockOpportunities.map((opp) => (
                <Card key={opp.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm">{opp.name}</p>
                      <Badge variant="outline" className="text-xs">{opp.status}</Badge>
                    </div>
                    <p className="mb-2 font-semibold">{formatCurrency(opp.value)}</p>
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Wahrscheinlichkeit</span>
                        <span className="text-xs font-medium">{opp.probability}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${opp.probability}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Abschluss: {opp.closeDate}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Contacts */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Ansprechpartner</h3>
              <Button variant="ghost" size="sm">
                Alle anzeigen
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {mockContacts.map((contact) => (
                <Card key={contact.id} className="min-w-[130px] shrink-0">
                  <CardContent className="p-3 text-center">
                    <Avatar className="h-12 w-12 mx-auto mb-2">
                      <AvatarFallback>
                        {contact.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <p className="mb-1 text-sm font-medium truncate">{contact.name}</p>
                    <p className="text-xs text-muted-foreground mb-3 truncate">{contact.position}</p>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => toast.success(`Rufe ${contact.name} an...`)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => toast.success(`E-Mail an ${contact.name}...`)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Documents */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Dokumente</h3>
              <Button variant="ghost" size="sm">
                Alle Dokumente
              </Button>
            </div>
            <div className="space-y-2">
              {mockDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.date}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Main Mobile Customer Quick View Component
export function CustomerQuickView() {
  const { customers } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerViewData | null>(null);
  const [recentSearches] = useState(['Hofladen', 'REWE', 'Schmidt']);

  // Enrich customers with demo data for the view
  const enrichedCustomers = useMemo(() => {
     return customers.map(enrichCustomerData);
  }, [customers]);

  // Filter customers based on search
  const filteredCustomers = enrichedCustomers.filter((customer) =>
    customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    customer.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Search Header (Sticky) */}
      <div className="bg-background border-b border-border p-4 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Kunde suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-12"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => toast.info('Sprachsuche aktiviert...')}
          >
            <Mic className="h-5 w-5" />
          </Button>
        </div>

        {/* Recent Searches */}
        {searchQuery === '' && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-muted-foreground whitespace-nowrap text-sm flex items-center">Kürzlich:</span>
            {recentSearches.map((search) => (
              <Button
                key={search}
                variant="outline"
                size="sm"
                className="shrink-0 h-8"
                onClick={() => setSearchQuery(search)}
              >
                <Clock className="mr-2 h-3 w-3" />
                {search}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Customer List */}
      <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
        {filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="mb-2 font-semibold">Keine Kunden gefunden</h3>
            <p className="text-muted-foreground">
              Versuchen Sie einen anderen Suchbegriff
            </p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-4 text-sm font-medium px-1">
              {filteredCustomers.length} {filteredCustomers.length === 1 ? 'Kunde' : 'Kunden'}{' '}
              gefunden
            </p>
            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onClick={() => setSelectedCustomer(customer)}
              />
            ))}
          </>
        )}
      </div>

      {/* Quick View Bottom Sheet */}
      {selectedCustomer && (
        <QuickViewSheet
          customer={selectedCustomer}
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}

// Demo Component
export function CustomerQuickViewDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 text-2xl font-semibold">Kunden-Schnellansicht (Mobile)</h2>
          <p className="text-muted-foreground mb-6">
            Mobile PWA-Komponente für schnellen Kundenzugriff mit Suche, Bottom Sheet und
            One-Tap-Aktionen. Integriert jetzt Live-Daten aus dem DataProvider.
          </p>

          <div className="max-w-sm mx-auto border border-border rounded-lg overflow-hidden shadow-xl h-[800px]">
            <CustomerQuickView />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
