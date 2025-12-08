import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { toast } from 'sonner@2.0.3';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Eye,
  Pencil,
  MoreVertical,
  Plus,
  Crown,
  Shield,
  Star,
  Users,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  FileText,
  Trash2,
  Lock,
  HelpCircle,
} from 'lucide-react';

import { ContactForm } from './ContactFormDemo';
import { Contact, DecisionRole, AuthorityLevel, useData } from './providers/DataProvider';

// Decision role config
export const decisionRoleConfig: Record<
  DecisionRole,
  { label: string; color: string; bgColor: string; textColor: string; icon: any }
> = {
  'decision-maker': {
    label: 'Entscheidungsträger',
    color: 'bg-primary',
    bgColor: 'bg-accent/50',
    textColor: 'text-primary',
    icon: Crown,
  },
  'key-influencer': {
    label: 'Schlüsselbeeinflusser',
    color: 'bg-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    textColor: 'text-purple-700 dark:text-purple-300',
    icon: Sparkles,
  },
  recommender: {
    label: 'Empfehler',
    color: 'bg-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    textColor: 'text-green-700 dark:text-green-300',
    icon: CheckCircle2,
  },
  gatekeeper: {
    label: 'Gatekeeper',
    color: 'bg-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    textColor: 'text-amber-700 dark:text-amber-300',
    icon: Shield,
  },
  operational: {
    label: 'Operativer Kontakt',
    color: 'bg-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/20',
    textColor: 'text-gray-700 dark:text-gray-300',
    icon: FileText,
  },
  informational: {
    label: 'Informativ',
    color: 'bg-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-950/20',
    textColor: 'text-gray-600 dark:text-gray-400',
    icon: AlertCircle,
  },
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

// Format relative time
function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Heute';
  if (days === 1) return 'Gestern';
  if (days < 7) return `Vor ${days} Tagen`;
  if (days < 30) return `Vor ${Math.floor(days / 7)} Wochen`;
  return date.toLocaleDateString('de-DE');
}

// Authority level component
function AuthorityLevelDisplay({ level }: { level: AuthorityLevel }) {
  if (level === 'final') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <Crown className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-500">
                Finale Autorität
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hat die finale Entscheidungsbefugnis</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const starCount = level === 'high' ? 3 : level === 'medium' ? 2 : 1;
  const starColor =
    level === 'high'
      ? 'text-yellow-500'
      : level === 'medium'
        ? 'text-amber-500'
        : 'text-gray-400';
  const label = level === 'high' ? 'Hoch' : level === 'medium' ? 'Mittel' : 'Niedrig';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            {Array.from({ length: starCount }).map((_, i) => (
              <Star key={i} className={`h-3 w-3 fill-current ${starColor}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">{label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Entscheidungsbefugnis: {label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Contact Card Component
export function ContactCard({
  contact,
  isRestricted = false,
}: {
  contact: Contact;
  isRestricted?: boolean;
}) {
  const roleConfig = decisionRoleConfig[contact.decisionRole];
  const RoleIcon = roleConfig.icon;
  const fullName = `${contact.title ? contact.title + ' ' : ''}${contact.firstName} ${contact.lastName}`;
  const initials = `${contact.firstName[0]}${contact.lastName[0]}`;

  return (
    <Card className="hover:shadow-lg transition-shadow hover:border-primary/50">
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header with Avatar */}
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="truncate">{fullName}</h4>
              <p className="text-sm text-muted-foreground">{contact.position}</p>
            </div>
          </div>

          {/* Decision Role Badge */}
          <div className="flex items-center gap-2">
            <Badge className={`${roleConfig.color} text-white gap-1`}>
              <RoleIcon className="h-3 w-3" />
              {roleConfig.label}
            </Badge>
            {isRestricted && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Entscheidungsrolle kann nur von PLAN/GF bearbeitet werden</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Authority Level */}
          <AuthorityLevelDisplay level={contact.authorityLevel} />

          {/* Contact Information */}
          <div className="space-y-2 text-sm">
            {contact.mobile && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3 w-3 shrink-0" />
                <span className={contact.preferredContact === 'mobile' ? 'underline' : ''}>
                  {contact.mobile}
                </span>
                {contact.preferredContact === 'mobile' && (
                  <Badge variant="secondary" className="text-xs py-0">
                    Bevorzugt
                  </Badge>
                )}
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3 w-3 shrink-0" />
                <span className={contact.preferredContact === 'phone' ? 'underline' : ''}>
                  {contact.phone}
                </span>
                {contact.preferredContact === 'phone' && (
                  <Badge variant="secondary" className="text-xs py-0">
                    Bevorzugt
                  </Badge>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3 w-3 shrink-0" />
              <span
                className={`truncate ${contact.preferredContact === 'email' ? 'underline' : ''}`}
              >
                {contact.email}
              </span>
              {contact.preferredContact === 'email' && (
                <Badge variant="secondary" className="text-xs py-0 shrink-0">
                  Bevorzugt
                </Badge>
              )}
            </div>
          </div>

          {/* Approval Authority */}
          {contact.canApprove && contact.approvalLimit && (
            <div className={`${roleConfig.bgColor} rounded-lg p-3 space-y-1`}>
              <div className="flex items-center gap-2">
                <Shield className={`h-4 w-4 ${roleConfig.textColor}`} />
                <span className={`text-xs font-medium ${roleConfig.textColor}`}>
                  Kann Bestellungen genehmigen
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maximaler Auftragswert für Genehmigung</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className={`font-bold ${roleConfig.textColor}`}>
                Bis {formatCurrency(contact.approvalLimit)}
              </div>
            </div>
          )}

          {/* Functional Roles */}
          {contact.functions && contact.functions.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs uppercase text-muted-foreground">Funktionen</span>
              <div className="flex flex-wrap gap-1">
                {contact.functions.slice(0, 3).map((func, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {func}
                  </Badge>
                ))}
                {contact.functions.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{contact.functions.length - 3} weitere
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Assigned Locations */}
          {contact.assignedLocations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <div className="flex flex-wrap gap-1 items-center">
                  {contact.assignedLocations.slice(0, 2).map((location, idx) => {
                    const isPrimary =
                      contact.primaryForLocations?.includes(location) || false;
                    return (
                      <span key={idx} className="text-muted-foreground">
                        {location}
                        {isPrimary && <Star className="h-3 w-3 inline ml-1 text-yellow-500 fill-current" />}
                        {idx < Math.min(contact.assignedLocations.length - 1, 1) && ','}
                      </span>
                    );
                  })}
                  {contact.assignedLocations.length > 2 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs text-muted-foreground cursor-help">
                            +{contact.assignedLocations.length - 2} weitere
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            {contact.assignedLocations.slice(2).map((loc, idx) => (
                              <div key={idx}>{loc}</div>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              {contact.isPrimaryContact && contact.primaryForLocations && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Star className="h-3 w-3 text-yellow-600 fill-current" />
                  Hauptansprechpartner für {contact.primaryForLocations.length} Standorte
                </Badge>
              )}
            </div>
          )}

          {/* Card Footer */}
          <Separator />
          <div className="flex items-center justify-between">
            {contact.lastActivity && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Letzte Aktivität: {formatRelativeTime(contact.lastActivity)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => toast.info('Details anzeigen')}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <ContactForm 
                isEdit={true}
                customTrigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={isRestricted}
                  >
                    <Pencil className="h-4 w-4" />
                    {isRestricted && <Lock className="h-2 w-2 absolute top-1 right-1" />}
                  </Button>
                }
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Aktivität hinzufügen
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    E-Mail senden
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Phone className="mr-2 h-4 w-4" />
                    Anrufen
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" />
                    Bearbeiten
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Löschen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Full Contact List View
export function ContactListView({ initialContacts }: { initialContacts?: Contact[] }) {
  const { customers } = useData();
  // Use initialContacts if provided, otherwise fallback to first customer's contacts for demo
  const [contacts] = useState(initialContacts || (customers[0]?.contacts || []));
  const [filter, setFilter] = useState<'all' | 'decision-makers' | 'primary'>('all');
  const [sortBy, setSortBy] = useState('name');

  // Filter contacts
  const filteredContacts = contacts.filter((contact) => {
    if (filter === 'decision-makers') {
      return (
        contact.decisionRole === 'decision-maker' ||
        contact.decisionRole === 'key-influencer'
      );
    }
    if (filter === 'primary') {
      return contact.isPrimaryContact;
    }
    return true;
  });

  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (sortBy === 'name') {
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    }
    if (sortBy === 'authority') {
      const order: AuthorityLevel[] = ['final', 'high', 'medium', 'low'];
      return order.indexOf(a.authorityLevel) - order.indexOf(b.authorityLevel);
    }
    if (sortBy === 'role') {
      return a.decisionRole.localeCompare(b.decisionRole);
    }
    return 0;
  });

  const decisionMakersCount = contacts.filter(
    (c) => c.decisionRole === 'decision-maker' || c.decisionRole === 'key-influencer'
  ).length;
  const primaryContactsCount = contacts.filter((c) => c.isPrimaryContact).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3>Kontakte</h3>
          <p className="text-sm text-muted-foreground">
            Kontaktpersonen Übersicht • {contacts.length} Kontaktpersonen
          </p>
        </div>
        <ContactForm />
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">Alle ({contacts.length})</TabsTrigger>
                <TabsTrigger value="decision-makers">
                  Entscheidungsträger ({decisionMakersCount})
                </TabsTrigger>
                <TabsTrigger value="primary">
                  Hauptansprechpartner ({primaryContactsCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sortiert nach:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="authority">Autorität</SelectItem>
                  <SelectItem value="role">Rolle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Cards Grid */}
      {sortedContacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="mb-2">Noch keine Kontakte vorhanden</h3>
            <p className="text-muted-foreground text-center mb-4">
              Fügen Sie Kontaktpersonen hinzu, um Ansprechpartner zu verwalten
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ersten Kontakt hinzufügen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
}

// Decision Role Legend
export function DecisionRoleLegend() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Entscheidungsrollen</h4>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(decisionRoleConfig).map(([role, config]) => {
          const Icon = config.icon;
          return (
            <Card key={role}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-full ${config.color} flex items-center justify-center`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="text-sm font-medium">{config.label}</h4>
                  </div>
                  <Badge className={`${config.color} text-white gap-1`}>
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground">
        6 verschiedene Entscheidungsrollen für Kontaktpersonen
      </p>
    </div>
  );
}

// Authority Level Examples
export function AuthorityLevelExamples() {
  const levels: { level: AuthorityLevel; label: string; description: string }[] = [
    {
      level: 'final',
      label: 'Finale Autorität',
      description: 'Hat die finale Entscheidungsbefugnis',
    },
    { level: 'high', label: 'Hoch', description: 'Hohe Entscheidungsbefugnis (3 Sterne)' },
    { level: 'medium', label: 'Mittel', description: 'Mittlere Entscheidungsbefugnis (2 Sterne)' },
    { level: 'low', label: 'Niedrig', description: 'Niedrige Entscheidungsbefugnis (1 Stern)' },
  ];

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Autoritätsstufen</h4>

      <div className="grid gap-3 md:grid-cols-2">
        {levels.map((item) => (
          <Card key={item.level}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <AuthorityLevelDisplay level={item.level} />
                <div>
                  <h4 className="text-sm font-medium">{item.label}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        4 Autoritätsstufen: Niedrig (1 Stern), Mittel (2 Sterne), Hoch (3 Sterne), Finale
        Autorität (Krone)
      </p>
    </div>
  );
}

// Single Contact Card Demo
export function SingleContactDemo() {
  const { customers } = useData();
  const contact = customers[0]?.contacts?.[0]; // First contact of first customer

  if (!contact) return <div>Kein Kontakt verfügbar</div>;

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Einzelne Kontaktkarte</h4>

      <div className="max-w-sm">
        <ContactCard contact={contact} />
      </div>

      <p className="text-sm text-muted-foreground">
        Vollständige Kontaktkarte mit allen Informationen: Entscheidungsrolle, Autorität,
        Kontaktdaten, Genehmigungslimit, Standorte
      </p>
    </div>
  );
}

// RBAC Restricted Contact Demo
export function RestrictedContactDemo() {
  const { customers } = useData();
  const contact = customers[0]?.contacts?.[0];

  if (!contact) return <div>Kein Kontakt verfügbar</div>;

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Eingeschränkte Ansicht (ADM-Rolle)</h4>

      <div className="max-w-sm">
        <ContactCard contact={contact} isRestricted={true} />
      </div>

      <p className="text-sm text-muted-foreground">
        ADM-Benutzer sehen Lock-Icon bei Entscheidungsrolle und können Bearbeiten-Button nicht
        verwenden
      </p>
    </div>
  );
}

export function ContactListDemo() {
    return <ContactListView />;
}
