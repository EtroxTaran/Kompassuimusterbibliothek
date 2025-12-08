import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { RichTextEditor } from './RichTextEditor';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import {
  User,
  Mail,
  Phone,
  Smartphone,
  Building2,
  Lock,
  AlertCircle,
  Star,
  Crown,
  MapPin,
  UserPlus,
  Edit,
  CheckCircle,
  X,
} from 'lucide-react';

// User role type
type UserRole = 'ADM' | 'PLAN' | 'GF';

// Decision roles
const decisionRoles = [
  {
    value: 'decision_maker',
    label: 'Entscheidungsträger',
    description: 'Kann finale Entscheidungen treffen',
  },
  {
    value: 'key_influencer',
    label: 'Schlüsselbeeinflusser',
    description: 'Hat starken Einfluss auf Entscheidungen',
  },
  {
    value: 'recommender',
    label: 'Empfehler',
    description: 'Gibt Empfehlungen ab',
  },
  {
    value: 'gatekeeper',
    label: 'Gatekeeper',
    description: 'Kontrolliert Informationszugang',
  },
  {
    value: 'operational_contact',
    label: 'Operativer Kontakt',
    description: 'Tägliche Ansprechperson',
  },
  {
    value: 'informational',
    label: 'Informativ',
    description: 'Wird informiert, keine Entscheidungsmacht',
  },
];

// Functional roles
const functionalRoles = [
  'Inhaber/Geschäftsführer',
  'Einkaufsleiter',
  'Filialleiter',
  'Lagerleiter',
  'Projektkoordinator',
  'Finanzkontrolleur',
  'Betriebsleiter',
  'Verwaltung',
];

// Customer locations
const customerLocations = [
  { id: '1', name: 'Filiale München Süd', address: 'Industriestraße 42' },
  { id: '2', name: 'Hauptsitz München', address: 'Hauptstraße 1' },
  { id: '3', name: 'Lager Augsburg', address: 'Lagerstraße 10' },
];

// Tab 1: Basic Information
function BasicInformationTab() {
  const [salutation, setSalutation] = useState('');
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [preferredContact, setPreferredContact] = useState('email');
  const [language, setLanguage] = useState('de');

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-4">Persönliche Informationen</h4>
        
        {/* Salutation, Title row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="salutation">Anrede</Label>
            <Select value={salutation} onValueChange={setSalutation}>
              <SelectTrigger id="salutation">
                <SelectValue placeholder="Auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mr">Herr</SelectItem>
                <SelectItem value="mrs">Frau</SelectItem>
                <SelectItem value="diverse">Divers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dr., Prof."
            />
          </div>
        </div>

        {/* First name, Last name */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">Vorname *</Label>
            <Input
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Hans"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Nachname *</Label>
            <Input
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Müller"
              required
            />
          </div>
        </div>

        {/* Position */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="z.B. Geschäftsführer, Einkaufsleiter"
          />
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="mb-4">Kontaktdaten</h4>

        {/* Email, Phone, Mobile */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="h.mueller@beispiel.de"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+49-89-1234567"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobil</Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+49-170-1234567"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Preferred Contact Method */}
        <div className="space-y-2 mb-4">
          <Label>Bevorzugte Kontaktmethode</Label>
          <RadioGroup value={preferredContact} onValueChange={setPreferredContact}>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="contact-email" />
                <Label htmlFor="contact-email" className="font-normal cursor-pointer">
                  E-Mail
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="contact-phone" />
                <Label htmlFor="contact-phone" className="font-normal cursor-pointer">
                  Telefon
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mobile" id="contact-mobile" />
                <Label htmlFor="contact-mobile" className="font-normal cursor-pointer">
                  Mobil
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="language">Sprache</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language" className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="en">Englisch</SelectItem>
              <SelectItem value="fr">Französisch</SelectItem>
              <SelectItem value="it">Italienisch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// Tab 2: Decision Authority
function DecisionAuthorityTab({ currentUserRole }: { currentUserRole: UserRole }) {
  const [decisionRole, setDecisionRole] = useState('');
  const [authorityLevel, setAuthorityLevel] = useState('');
  const [canApproveOrders, setCanApproveOrders] = useState(false);
  const [approvalLimit, setApprovalLimit] = useState('');
  const [selectedFunctionalRoles, setSelectedFunctionalRoles] = useState<string[]>([]);
  const [showApprovalLimitError, setShowApprovalLimitError] = useState(false);

  const isRestricted = currentUserRole === 'ADM';

  const handleCanApproveChange = (checked: boolean) => {
    setCanApproveOrders(checked);
    if (!checked) {
      setApprovalLimit('');
      setShowApprovalLimitError(false);
    }
  };

  const validateApprovalLimit = () => {
    if (canApproveOrders && !approvalLimit) {
      setShowApprovalLimitError(true);
      return false;
    }
    setShowApprovalLimitError(false);
    return true;
  };

  return (
    <div className="space-y-6">
      {isRestricted && (
        <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <Lock className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900 dark:text-amber-100">
            Diese Felder können nur von Planung oder Geschäftsführung bearbeitet werden
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h4 className="mb-4">Entscheidungsrolle</h4>

        {/* Decision Role */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="decision-role">Entscheidungsrolle *</Label>
            {isRestricted && <Lock className="h-3 w-3 text-muted-foreground" />}
          </div>
          <Select value={decisionRole} onValueChange={setDecisionRole} disabled={isRestricted}>
            <SelectTrigger id="decision-role">
              <SelectValue placeholder="Rolle auswählen" />
            </SelectTrigger>
            <SelectContent>
              {decisionRoles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  <div>
                    <div>{role.label}</div>
                    <div className="text-xs text-muted-foreground">{role.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Authority Level */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Label>Autoritätslevel *</Label>
            {isRestricted && <Lock className="h-3 w-3 text-muted-foreground" />}
          </div>
          <RadioGroup value={authorityLevel} onValueChange={setAuthorityLevel} disabled={isRestricted}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="authority-low" disabled={isRestricted} />
                <Label htmlFor="authority-low" className="font-normal cursor-pointer flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  Niedrig
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="authority-medium" disabled={isRestricted} />
                <Label htmlFor="authority-medium" className="font-normal cursor-pointer flex items-center gap-2">
                  <div className="flex">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </div>
                  Mittel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="authority-high" disabled={isRestricted} />
                <Label htmlFor="authority-high" className="font-normal cursor-pointer flex items-center gap-2">
                  <div className="flex">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </div>
                  Hoch
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="final_authority" id="authority-final" disabled={isRestricted} />
                <Label htmlFor="authority-final" className="font-normal cursor-pointer flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-600" />
                  Finale Autorität
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Can Approve Orders */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="can-approve"
              checked={canApproveOrders}
              onCheckedChange={handleCanApproveChange}
              disabled={isRestricted}
            />
            <Label htmlFor="can-approve" className="cursor-pointer flex items-center gap-2">
              Kann Bestellungen genehmigen
              {isRestricted && <Lock className="h-3 w-3 text-muted-foreground" />}
            </Label>
          </div>
        </div>

        {/* Approval Limit (conditional) */}
        {canApproveOrders && (
          <div className="space-y-2 mb-4 ml-6">
            <Label htmlFor="approval-limit">Genehmigungslimit *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="approval-limit"
                type="number"
                value={approvalLimit}
                onChange={(e) => {
                  setApprovalLimit(e.target.value);
                  if (e.target.value) setShowApprovalLimitError(false);
                }}
                onBlur={validateApprovalLimit}
                placeholder="50000"
                className="max-w-xs"
                disabled={isRestricted}
              />
              <span className="text-sm text-muted-foreground">€</span>
            </div>
            {showApprovalLimitError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Genehmigungslimit ist erforderlich, wenn Kontakt Bestellungen genehmigen kann
                (Business Rule CO-001)
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Maximaler Auftragswert, den dieser Kontakt genehmigen kann
            </p>
          </div>
        )}
      </div>

      <Separator />

      <div>
        <h4 className="mb-4">Funktionale Rollen</h4>

        {/* Functional Roles */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Label>Funktionale Rollen</Label>
            {isRestricted && <Lock className="h-3 w-3 text-muted-foreground" />}
          </div>
          <div className="space-y-2">
            {functionalRoles.map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role}`}
                  checked={selectedFunctionalRoles.includes(role)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedFunctionalRoles([...selectedFunctionalRoles, role]);
                    } else {
                      setSelectedFunctionalRoles(
                        selectedFunctionalRoles.filter((r) => r !== role)
                      );
                    }
                  }}
                  disabled={isRestricted}
                />
                <Label htmlFor={`role-${role}`} className="font-normal cursor-pointer">
                  {role}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Funktionen, die dieser Kontakt ausübt
          </p>
        </div>
      </div>
    </div>
  );
}

// Tab 3: Location Assignment
function LocationAssignmentTab() {
  const [assignedLocations, setAssignedLocations] = useState<string[]>([]);
  const [primaryLocations, setPrimaryLocations] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const handlePrimaryLocationChange = (locationId: string, checked: boolean) => {
    if (checked && !assignedLocations.includes(locationId)) {
      setValidationError(
        `Dieser Standort muss in 'Zugewiesene Standorte' ausgewählt sein (Business Rule CO-002)`
      );
      return;
    }
    
    setValidationError(null);
    
    if (checked) {
      setPrimaryLocations([...primaryLocations, locationId]);
    } else {
      setPrimaryLocations(primaryLocations.filter((id) => id !== locationId));
    }
  };

  const autoAssignLocation = (locationId: string) => {
    setAssignedLocations([...assignedLocations, locationId]);
    setPrimaryLocations([...primaryLocations, locationId]);
    setValidationError(null);
    toast.success('Standort automatisch zugewiesen');
  };

  return (
    <div className="space-y-6">
      {/* Assigned Locations */}
      <div>
        <h4 className="mb-4">Standortzuordnung</h4>
        
        <div className="space-y-2 mb-6">
          <Label>Zugewiesene Standorte</Label>
          <div className="space-y-2">
            {customerLocations.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`assigned-${location.id}`}
                  checked={assignedLocations.includes(location.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setAssignedLocations([...assignedLocations, location.id]);
                    } else {
                      setAssignedLocations(
                        assignedLocations.filter((id) => id !== location.id)
                      );
                      // Also remove from primary if it was there
                      setPrimaryLocations(
                        primaryLocations.filter((id) => id !== location.id)
                      );
                    }
                  }}
                />
                <Label
                  htmlFor={`assigned-${location.id}`}
                  className="font-normal cursor-pointer flex-1"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div>{location.name}</div>
                      <div className="text-xs text-muted-foreground">{location.address}</div>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Standorte, an denen dieser Kontakt tätig ist
          </p>
        </div>

        <Separator className="my-6" />

        {/* Primary Contact For */}
        <div className="space-y-2">
          <Label>Hauptansprechpartner für folgende Standorte</Label>
          <div className="space-y-2">
            {customerLocations.map((location) => {
              const isAssigned = assignedLocations.includes(location.id);
              const isPrimary = primaryLocations.includes(location.id);
              
              return (
                <div key={location.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`primary-${location.id}`}
                    checked={isPrimary}
                    onCheckedChange={(checked) =>
                      handlePrimaryLocationChange(location.id, checked as boolean)
                    }
                    disabled={!isAssigned && !isPrimary}
                  />
                  <Label
                    htmlFor={`primary-${location.id}`}
                    className={`font-normal cursor-pointer flex-1 ${
                      !isAssigned && !isPrimary ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isPrimary && <CheckCircle className="h-4 w-4 text-primary" />}
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div>{location.name}</div>
                        <div className="text-xs text-muted-foreground">{location.address}</div>
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
          {validationError && (
            <div className="space-y-2">
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validationError}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Auto-assign the first non-assigned location that tried to be primary
                  const locationToAssign = customerLocations.find(
                    (loc) =>
                      primaryLocations.includes(loc.id) && !assignedLocations.includes(loc.id)
                  );
                  if (locationToAssign) {
                    autoAssignLocation(locationToAssign.id);
                  }
                }}
              >
                Automatisch zuweisen?
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Nur Standorte auswählen, die in 'Zugewiesene Standorte' enthalten sind
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Internal Notes */}
      <RichTextEditor
        id="contact-notes"
        label="Interne Notizen"
        value={notes}
        onChange={setNotes}
        placeholder="Persönliche Präferenzen, Gesprächsnotizen, Besonderheiten..."
        minHeight={150}
        maxLength={1000}
        helpText="Interne Notizen zu diesem Kontakt (nur für Mitarbeiter sichtbar)"
        toolbar="basic"
      />
    </div>
  );
}

// Full Contact Form Dialog
export function ContactForm({ isEdit = false, customTrigger }: { isEdit?: boolean, customTrigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('PLAN');
  const [activeTab, setActiveTab] = useState('basic');

  const handleSave = () => {
    toast.success(isEdit ? 'Kontakt aktualisiert' : 'Kontakt gespeichert', {
      description: 'Der Kontakt wurde erfolgreich gespeichert.',
    });
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Role Sim (Hidden in production usage, kept for demo if no trigger provided) */}
      {!customTrigger && (
      <div className="flex items-center gap-4 mb-4">
        <h4>Benutzerrolle simulieren:</h4>
        <Select value={currentUserRole} onValueChange={(value) => setCurrentUserRole(value as UserRole)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADM">ADM</SelectItem>
            <SelectItem value="PLAN">PLAN</SelectItem>
            <SelectItem value="GF">GF</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant={currentUserRole === 'ADM' ? 'secondary' : 'default'}>
          {currentUserRole === 'ADM' ? 'Eingeschränkter Zugriff' : 'Voller Zugriff'}
        </Badge>
      </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {customTrigger ? customTrigger : (
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            {isEdit ? 'Kontakt bearbeiten' : 'Neuer Kontakt'}
          </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Kontakt bearbeiten' : 'Neuer Kontakt'}</DialogTitle>
            <DialogDescription>
              <Badge variant="secondary" className="mt-2">
                <Building2 className="mr-1 h-3 w-3" />
                Kunde: Hofladen Müller GmbH
              </Badge>
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Grunddaten</TabsTrigger>
              <TabsTrigger value="authority">
                <div className="flex items-center gap-1">
                  Entscheidungsbefugnis
                  {currentUserRole === 'ADM' && <Lock className="h-3 w-3" />}
                </div>
              </TabsTrigger>
              <TabsTrigger value="location">Standortzuordnung</TabsTrigger>
            </TabsList>

            <div className="py-6">
              <TabsContent value="basic" className="mt-0">
                <BasicInformationTab />
              </TabsContent>

              <TabsContent value="authority" className="mt-0">
                <DecisionAuthorityTab currentUserRole={currentUserRole} />
              </TabsContent>

              <TabsContent value="location" className="mt-0">
                <LocationAssignmentTab />
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave}>Kontakt speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="text-sm text-muted-foreground">
        3 Tabs: Grunddaten, Entscheidungsbefugnis (RBAC-eingeschränkt), Standortzuordnung
      </p>
    </div>
  );
}

// Individual Tab Demos
function BasicInfoDemo() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Tab 1: Grunddaten</h4>

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <BasicInformationTab />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Persönliche Informationen und Kontaktdaten
      </p>
    </div>
  );
}

function DecisionAuthorityDemo() {
  const [userRole, setUserRole] = useState<UserRole>('PLAN');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <h4>Tab 2: Entscheidungsbefugnis</h4>
        <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADM">ADM</SelectItem>
            <SelectItem value="PLAN">PLAN</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <DecisionAuthorityTab currentUserRole={userRole} />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        RBAC-eingeschränkt: ADM-Benutzer sehen Sperre, PLAN/GF können bearbeiten
      </p>
    </div>
  );
}

function LocationAssignmentDemo() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Tab 3: Standortzuordnung</h4>

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <LocationAssignmentTab />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Standortzuweisung mit Validierung: Hauptansprechpartner muss Teilmenge zugewiesener
        Standorte sein
      </p>
    </div>
  );
}

// Validation Examples
function ValidationExamples() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Validierungsbeispiele</h4>

      <div className="grid gap-4 md:grid-cols-2">
        {/* CO-001 Validation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">CO-001: Genehmigungslimit erforderlich</CardTitle>
            <CardDescription>
              Wenn "Kann Bestellungen genehmigen" aktiviert ist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="co-001-demo" checked />
              <Label htmlFor="co-001-demo">Kann Bestellungen genehmigen</Label>
            </div>
            <div className="space-y-2 ml-6">
              <Label>Genehmigungslimit *</Label>
              <Input placeholder="Erforderlich" className="border-destructive" />
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Genehmigungslimit ist erforderlich, wenn Kontakt Bestellungen genehmigen kann
                (Business Rule CO-001)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CO-002 Validation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              CO-002: Hauptansprechpartner-Validierung
            </CardTitle>
            <CardDescription>
              Hauptansprechpartner muss zugewiesenem Standort entsprechen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Hauptansprechpartner für:</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="co-002-demo" checked />
                <Label htmlFor="co-002-demo" className="font-normal">
                  Filiale München Süd
                </Label>
              </div>
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Dieser Standort muss in 'Zugewiesene Standorte' ausgewählt sein (Business Rule
                CO-002)
              </p>
              <Button size="sm" variant="outline">
                Automatisch zuweisen?
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">
        Validierungsregeln mit klaren Fehlermeldungen und Lösungsvorschlägen
      </p>
    </div>
  );
}

// RBAC Indicator Examples
function RBACIndicatorExamples() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">RBAC-Indikatoren</h4>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Restricted Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Einschränkungs-Banner</CardTitle>
            <CardDescription>Für ADM-Benutzer im Entscheidungsbefugnis-Tab</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <Lock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900 dark:text-amber-100">
                Diese Felder können nur von Planung oder Geschäftsführung bearbeitet werden
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Locked Field */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gesperrtes Feld</CardTitle>
            <CardDescription>Schloss-Icon neben Label, Feld deaktiviert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="locked-field">Entscheidungsrolle *</Label>
              <Lock className="h-3 w-3 text-muted-foreground" />
            </div>
            <Select disabled>
              <SelectTrigger id="locked-field">
                <SelectValue placeholder="Nur lesbar für ADM" />
              </SelectTrigger>
            </Select>
            <p className="text-xs text-muted-foreground">
              Nur für PLAN und GF bearbeitbar
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">
        Visuelle Indikatoren für rollenbasierte Zugriffsbeschränkungen
      </p>
    </div>
  );
}

export function ContactFormDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Vollständiges Kontaktformular</CardTitle>
          <CardDescription>
            3 Tabs mit Grunddaten, Entscheidungsbefugnis (RBAC-eingeschränkt) und
            Standortzuordnung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Tab 1: Grunddaten</CardTitle>
          <CardDescription>
            Persönliche Informationen, Kontaktdaten und bevorzugte Kommunikation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BasicInfoDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tab 2: Entscheidungsbefugnis</CardTitle>
          <CardDescription>
            Entscheidungsrolle, Autoritätslevel und Genehmigungslimit (RBAC-eingeschränkt)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DecisionAuthorityDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tab 3: Standortzuordnung</CardTitle>
          <CardDescription>
            Standortzuweisung mit Hauptansprechpartner-Funktion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LocationAssignmentDemo />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Validierungsregeln</CardTitle>
          <CardDescription>
            CO-001 und CO-002 Geschäftsregeln mit Fehlermeldungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ValidationExamples />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RBAC-Indikatoren</CardTitle>
          <CardDescription>
            Visuelle Indikatoren für rollenbasierte Zugriffsbeschränkungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RBACIndicatorExamples />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Tab-Struktur</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 3 Tabs: Grunddaten / Befugnis / Standorte</li>
              <li>• Blauer Unterstrich für aktiven Tab</li>
              <li>• Schloss-Icon bei eingeschränkten Tabs</li>
              <li>• Scrollbarer Inhalt in jedem Tab</li>
              <li>• Sticky Footer mit Buttons</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Grunddaten-Tab</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Anrede: Select (Herr/Frau/Divers)</li>
              <li>• Vorname/Nachname: Pflichtfelder</li>
              <li>• Icons bei Kontaktfeldern (Mail/Phone)</li>
              <li>• Radio-Gruppe: Bevorzugte Methode</li>
              <li>• Sprachauswahl: Dropdown</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Entscheidungsbefugnis</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• RBAC: ADM = Eingeschränkt</li>
              <li>• Amber Alert-Banner für ADM</li>
              <li>• Schloss-Icons bei Labels</li>
              <li>• Sterne für Autoritätslevel</li>
              <li>• Krone für finale Autorität</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Genehmigungslimit</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Checkbox: "Kann genehmigen"</li>
              <li>• Bedingt: Limit-Feld erscheint</li>
              <li>• CO-001: Limit erforderlich wenn ✓</li>
              <li>• Euro-Suffix (€) anzeigen</li>
              <li>• Validierung: 0-10.000.000</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Standortzuordnung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Liste: Zugewiesene Standorte</li>
              <li>• Liste: Hauptansprechpartner</li>
              <li>• CO-002: Teilmengen-Validierung</li>
              <li>• MapPin-Icon bei Standorten</li>
              <li>• Auto-Zuweisen-Button bei Fehler</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Validierung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Pflichtfelder: Roter Rahmen</li>
              <li>• Fehlermeldungen: Rot mit Icon</li>
              <li>• Business Rules: CO-001, CO-002</li>
              <li>• Hilfreiche Lösungsvorschläge</li>
              <li>• Inline-Validierung (onBlur)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}