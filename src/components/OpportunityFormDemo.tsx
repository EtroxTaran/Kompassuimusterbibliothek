import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { RichTextEditor } from './RichTextEditor';
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
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import {
  Building2,
  Euro,
  TrendingUp,
  Circle,
  Loader,
  FileText,
  Handshake,
  Check,
  X,
  Calendar,
  AlertTriangle,
  Info,
  Plus,
  Save,
  ChevronRight,
  User,
  Loader2,
} from 'lucide-react';

// User role type
type UserRole = 'GF' | 'PLAN' | 'ADM' | 'KALK';

// Status type
type OpportunityStatus = 'new' | 'qualifying' | 'proposal' | 'negotiation' | 'won' | 'lost';

// Status config
const statusConfig: Record<
  OpportunityStatus,
  { label: string; icon: any; color: string; bgColor: string }
> = {
  new: {
    label: 'Neu',
    icon: Circle,
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10',
  },
  qualifying: {
    label: 'Qualifizierung',
    icon: Loader,
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
  },
  proposal: {
    label: 'Angebot erstellt',
    icon: FileText,
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
  },
  negotiation: {
    label: 'Verhandlung',
    icon: Handshake,
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
  },
  won: {
    label: 'Gewonnen',
    icon: Check,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  lost: {
    label: 'Verloren',
    icon: X,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
};

// Customers
const customers = [
  { id: '1', name: 'Hofladen Müller GmbH', location: 'München' },
  { id: '2', name: 'REWE Köln Süd', location: 'Köln' },
  { id: '3', name: 'Edeka Hamburg Nord', location: 'Hamburg' },
];

// Team members
const teamMembers = [
  { id: '1', name: 'Michael Schmidt', role: 'ADM' },
  { id: '2', name: 'Sarah Weber', role: 'PLAN' },
  { id: '3', name: 'Thomas Müller', role: 'ADM' },
];

// Tags
const predefinedTags = ['Großprojekt', 'Franchise', 'Neubau', 'Renovierung', 'Zeitkritisch'];

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Full Opportunity Form
export function OpportunityForm({
  currentUserRole = 'ADM',
  isEdit = false,
  customTrigger,
}: {
  currentUserRole?: UserRole;
  isEdit?: boolean;
  customTrigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [customerId, setCustomerId] = useState(isEdit ? '2' : '2');
  const [title, setTitle] = useState(isEdit ? 'Ladeneinrichtung Neueröffnung' : '');
  const [description, setDescription] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(isEdit ? '125000' : '125000');
  const [probability, setProbability] = useState([isEdit ? 75 : 50]);
  const [status, setStatus] = useState<OpportunityStatus>(isEdit ? 'proposal' : 'new');
  const [expectedCloseDate, setExpectedCloseDate] = useState(isEdit ? '2025-02-15' : '');
  const [nextStep, setNextStep] = useState('');
  const [lostReason, setLostReason] = useState('');
  const [lostCompetitor, setLostCompetitor] = useState('');
  const [actualValue, setActualValue] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('1');
  const [tags, setTags] = useState<string[]>([]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Weighted value calculation
  const weightedValue =
    parseFloat(estimatedValue || '0') * (probability[0] / 100);

  // Warnings
  const showHighProbabilityWarning =
    probability[0] > 80 && (status === 'new' || status === 'qualifying');

  const showPastDateWarning =
    expectedCloseDate &&
    new Date(expectedCloseDate) < new Date() &&
    status !== 'won' &&
    status !== 'lost';

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'title':
        if (!value || value.length < 5) return 'Titel muss mindestens 5 Zeichen lang sein';
        if (value.length > 200) return 'Titel darf maximal 200 Zeichen lang sein';
        return null;
      case 'estimatedValue':
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0)
          return 'Wert muss eine positive Zahl sein';
        if (numValue > 10000000)
          return 'Wert muss zwischen 0 € und 10.000.000 € liegen';
        return null;
      case 'lostReason':
        if (status === 'lost' && (!value || value.length < 10))
          return 'Bei verlorenen Opportunities muss ein Grund angegeben werden (min. 10 Zeichen)';
        return null;
      case 'actualValue':
        if (status === 'won') {
          const num = parseFloat(value);
          if (isNaN(num) || num <= 0)
            return 'Bei gewonnenen Opportunities muss ein tatsächlicher Wert > 0 angegeben werden';
        }
        return null;
      default:
        return null;
    }
  };

  const handleBlur = (name: string, value: string) => {
    const error = validateField(name, value);
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handleSubmit = () => {
    // Validate all required fields
    const requiredErrors: Record<string, string> = {};

    if (!customerId) requiredErrors.customerId = 'Kunde ist ein Pflichtfeld';
    if (!title) requiredErrors.title = 'Titel ist ein Pflichtfeld';
    if (!estimatedValue) requiredErrors.estimatedValue = 'Geschätzter Wert ist ein Pflichtfeld';

    // Status-specific validation
    if (status === 'lost') {
      if (!lostReason || lostReason.length < 10) {
        requiredErrors.lostReason =
          'Bei verlorenen Opportunities muss ein Grund angegeben werden (min. 10 Zeichen)';
      }
    }

    if (status === 'won') {
      if (!actualValue || parseFloat(actualValue) <= 0) {
        requiredErrors.actualValue =
          'Bei gewonnenen Opportunities muss ein tatsächlicher Wert > 0 angegeben werden';
      }
      if (!orderDate) {
        requiredErrors.orderDate = 'Auftragsdatum ist ein Pflichtfeld';
      }
    }

    // Check other validations
    const titleError = validateField('title', title);
    if (titleError) requiredErrors.title = titleError;

    const valueError = validateField('estimatedValue', estimatedValue);
    if (valueError) requiredErrors.estimatedValue = valueError;

    if (Object.keys(requiredErrors).length > 0) {
      setErrors(requiredErrors);
      toast.error('Bitte korrigieren Sie die Fehler im Formular');
      return;
    }

    // Submit
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        isEdit ? 'Opportunity wurde aktualisiert' : 'Opportunity wurde angelegt',
        {
          description: `${title} - ${formatCurrency(parseFloat(estimatedValue))}`,
        }
      );
      setOpen(false);
      if (!isEdit) resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setCustomerId(isEdit ? '2' : '2');
    setTitle(isEdit ? 'Ladeneinrichtung Neueröffnung' : '');
    setDescription('');
    setEstimatedValue(isEdit ? '125000' : '125000');
    setProbability([isEdit ? 75 : 50]);
    setStatus(isEdit ? 'proposal' : 'new');
    setExpectedCloseDate(isEdit ? '2025-02-15' : '');
    setNextStep('');
    setLostReason('');
    setLostCompetitor('');
    setActualValue('');
    setOrderDate('');
    setAssignedTo('1');
    setTags([]);
    setErrors({});
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const selectedCustomer = customers.find((c) => c.id === customerId);
  const StatusIcon = statusConfig[status].icon;

  // Calculate difference from estimated
  const valueDifference =
    actualValue && estimatedValue
      ? parseFloat(actualValue) - parseFloat(estimatedValue)
      : 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen && !isEdit) resetForm();
      }}
    >
      <DialogTrigger asChild>
        {customTrigger ? customTrigger : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {isEdit ? 'Opportunity bearbeiten' : 'Neue Opportunity'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Opportunity bearbeiten' : 'Neue Opportunity'}</DialogTitle>
          <DialogDescription>Verkaufschance erfassen und verfolgen</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section 1: Customer & Basics */}
          <div className="space-y-4">
            <h4>Kunde & Grunddaten</h4>

            {/* Customer */}
            <div className="space-y-2">
              <Label htmlFor="customer">
                Kunde <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger id="customer" className="pl-10">
                    <SelectValue placeholder="Kunde suchen oder auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} ({customer.location})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">Kunde für diese Verkaufschance</p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Titel <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={(e) => handleBlur('title', e.target.value)}
                placeholder="z.B. Ladeneinrichtung Filiale München Süd"
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Kurze Beschreibung der Verkaufschance
              </p>
            </div>

            {/* Description */}
            <RichTextEditor
              id="description"
              label="Beschreibung"
              value={description}
              onChange={setDescription}
              placeholder="Detaillierte Beschreibung des Projekts, Kundenanforderungen, besondere Umstände..."
              minHeight={120}
              maxLength={1000}
              toolbar="basic"
            />
          </div>

          <Separator />

          {/* Section 2: Value Assessment */}
          <div className="space-y-4">
            <h4>Wertermittlung</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Estimated Value */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                        <Euro className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="estimated-value" className="text-xs text-muted-foreground">
                          Geschätzter Auftragswert <span className="text-destructive">*</span>
                        </Label>
                      </div>
                    </div>
                    <div className="relative">
                      <Input
                        id="estimated-value"
                        type="number"
                        value={estimatedValue}
                        onChange={(e) => setEstimatedValue(e.target.value)}
                        onBlur={(e) => handleBlur('estimatedValue', e.target.value)}
                        placeholder="125000"
                        className={`text-2xl h-14 pr-8 ${errors.estimatedValue ? 'border-destructive' : ''}`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">
                        €
                      </span>
                    </div>
                    {errors.estimatedValue && (
                      <p className="text-xs text-destructive">{errors.estimatedValue}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Erwarteter Gesamtwert des Auftrags
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Probability */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">
                          Erfolgswahrscheinlichkeit <span className="text-destructive">*</span>
                        </Label>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{probability[0]}%</div>
                    </div>
                    <Slider
                      value={probability}
                      onValueChange={setProbability}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Geschätzte Wahrscheinlichkeit des Abschlusses
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Weighted Value */}
              <Card className="bg-accent/50 border-accent">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        Gewichteter Wert
                        <Info className="h-3 w-3" />
                      </Label>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {formatCurrency(weightedValue)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-center pt-8">
                      Berechnet als Geschätzter Wert × Wahrscheinlichkeit
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {formatCurrency(parseFloat(estimatedValue || '0'))} × {probability[0]}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Warnings */}
          {showHighProbabilityWarning && (
            <Alert className="bg-chart-4/10 border-chart-4/20 text-chart-4">
              <AlertTriangle className="h-4 w-4 text-chart-4" />
              <AlertDescription className="text-foreground">
                Hohe Wahrscheinlichkeit bei frühem Status - Status aktualisieren?
              </AlertDescription>
            </Alert>
          )}

          {showPastDateWarning && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Abschlussdatum liegt in der Vergangenheit
              </AlertDescription>
            </Alert>
          )}

          {/* Section 3: Status & Timeline */}
          <div className="space-y-4">
            <h4>Status & Zeitplan</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select value={status} onValueChange={(val) => setStatus(val as OpportunityStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${config.color}`} />
                            {config.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Aktueller Stand im Verkaufsprozess
                </p>
              </div>

              {/* Expected Close Date */}
              <div className="space-y-2">
                <Label htmlFor="expected-close">Erwartetes Abschlussdatum</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="expected-close"
                    type="date"
                    value={expectedCloseDate}
                    onChange={(e) => setExpectedCloseDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Voraussichtliches Datum der Auftragserteilung
                </p>
              </div>
            </div>

            {/* Next Step */}
            <RichTextEditor
              id="next-step"
              label="Nächster Schritt"
              value={nextStep}
              onChange={setNextStep}
              placeholder="z.B. Folgetermin vereinbaren, Angebot versenden..."
              minHeight={80}
              maxLength={300}
              toolbar="basic"
            />
          </div>

          {/* Conditional Fields - Lost */}
          {status === 'lost' && (
            <>
              <Separator />
              <div className="space-y-4">
                <RichTextEditor
                  id="lost-reason"
                  label={<>Grund für Verlust <span className="text-destructive">*</span></>}
                  value={lostReason}
                  onChange={(value) => {
                    setLostReason(value);
                    handleBlur('lostReason', value);
                  }}
                  placeholder="Bitte beschreiben Sie, warum die Opportunity verloren wurde..."
                  minHeight={100}
                  maxLength={500}
                  error={errors.lostReason}
                  toolbar="basic"
                />

                <div className="space-y-2">
                  <Label htmlFor="competitor">An Wettbewerber verloren</Label>
                  <Input
                    id="competitor"
                    value={lostCompetitor}
                    onChange={(e) => setLostCompetitor(e.target.value)}
                    placeholder="Name des Wettbewerbers"
                  />
                </div>
              </div>
            </>
          )}

          {/* Conditional Fields - Won */}
          {status === 'won' && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="actual-value">
                    Tatsächlicher Auftragswert <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="actual-value"
                      type="number"
                      value={actualValue}
                      onChange={(e) => setActualValue(e.target.value)}
                      onBlur={(e) => handleBlur('actualValue', e.target.value)}
                      placeholder="125000"
                      className={`pr-8 ${errors.actualValue ? 'border-destructive' : ''}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      €
                    </span>
                  </div>
                  {errors.actualValue && (
                    <p className="text-sm text-destructive">{errors.actualValue}</p>
                  )}
                  {actualValue && estimatedValue && valueDifference !== 0 && (
                    <p
                      className={`text-sm ${valueDifference > 0 ? 'text-primary' : 'text-destructive'}`}
                    >
                      {valueDifference > 0 ? '+' : ''} {formatCurrency(valueDifference)} vs.
                      Schätzung
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order-date">
                    Auftragsdatum <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="order-date"
                      type="date"
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                      className={`pl-10 ${errors.orderDate ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.orderDate && (
                    <p className="text-sm text-destructive">{errors.orderDate}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Datum der Auftragserteilung</p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Section 4: Assignment */}
          <div className="space-y-4">
            <h4>Zuordnung</h4>

            {/* Assigned To */}
            <div className="space-y-2">
              <Label htmlFor="assigned-to">
                Verantwortlicher Mitarbeiter <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select
                  value={assignedTo}
                  onValueChange={setAssignedTo}
                  disabled={currentUserRole === 'ADM'}
                >
                  <SelectTrigger id="assigned-to" className="pl-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {currentUserRole === 'ADM' && (
                <p className="text-xs text-muted-foreground">
                  Als ADM können Sie sich nur selbst zuweisen
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>

              {/* Selected tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add tag */}
              <Select onValueChange={addTag} value="">
                <SelectTrigger>
                  <SelectValue placeholder="Tag hinzufügen..." />
                </SelectTrigger>
                <SelectContent>
                  {predefinedTags
                    .filter((tag) => !tags.includes(tag))
                    .map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Button variant="ghost" size="sm">
              <Info className="mr-2 h-4 w-4" />
              Verlauf anzeigen
            </Button>
          </div>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Speichern' : 'Opportunity erstellen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const OpportunityFormDemo = OpportunityForm;
