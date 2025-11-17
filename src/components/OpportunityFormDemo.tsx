import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RichTextEditor } from './RichTextEditor';
import { Slider } from './ui/slider';
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
    color: 'text-primary',
    bgColor: 'bg-accent/50',
  },
  qualifying: {
    label: 'Qualifizierung',
    icon: Loader,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
  },
  proposal: {
    label: 'Angebot erstellt',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
  },
  negotiation: {
    label: 'Verhandlung',
    icon: Handshake,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
  },
  won: {
    label: 'Gewonnen',
    icon: Check,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
  },
  lost: {
    label: 'Verloren',
    icon: X,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
  },
};

// Add initial status
statusConfig['initial'] = {
  label: 'Erstkontakt',
  icon: Circle,
  color: 'text-primary',
  bgColor: 'bg-accent/50',
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
function OpportunityForm({
  currentUserRole = 'ADM',
  isEdit = false,
}: {
  currentUserRole?: UserRole;
  isEdit?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [customerId, setCustomerId] = useState('2');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('125000');
  const [probability, setProbability] = useState([75]);
  const [status, setStatus] = useState<OpportunityStatus>('proposal');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
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
      resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setCustomerId('');
    setTitle('');
    setDescription('');
    setEstimatedValue('');
    setProbability([50]);
    setStatus('new');
    setExpectedCloseDate('');
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
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {isEdit ? 'Opportunity bearbeiten' : 'Neue Opportunity'}
        </Button>
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
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900 dark:text-amber-100">
                Hohe Wahrscheinlichkeit bei frühem Status - Status aktualisieren?
              </AlertDescription>
            </Alert>
          )}

          {showPastDateWarning && (
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900 dark:text-amber-100">
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
                      className={`text-sm ${valueDifference > 0 ? 'text-green-600' : 'text-red-600'}`}
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
              Als Entwurf speichern
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Abbrechen
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-pulse" />
                  Wird gespeichert...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Opportunity speichern
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Probability Slider Demo
function ProbabilitySliderDemo() {
  const [probability, setProbability] = useState([75]);
  const [estimatedValue] = useState(125000);
  const weightedValue = estimatedValue * (probability[0] / 100);

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Wahrscheinlichkeits-Slider</h4>

      <Card className="max-w-md">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">
                  Erfolgswahrscheinlichkeit
                </Label>
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{probability[0]}%</div>
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
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Geschätzter Wert:</span>
                <span className="font-medium">{formatCurrency(estimatedValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wahrscheinlichkeit:</span>
                <span className="font-medium">{probability[0]}%</span>
              </div>
              <Separator />
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">Gewichteter Wert:</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(weightedValue)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Slider in 5%-Schritten, Echtzeit-Berechnung des gewichteten Werts
      </p>
    </div>
  );
}

// Status Transition Indicator
function StatusTransitionDemo() {
  const [currentStatus, setCurrentStatus] = useState<OpportunityStatus>('proposal');

  const statusFlow: OpportunityStatus[] = ['new', 'qualifying', 'proposal', 'negotiation', 'won'];

  const currentIndex = statusFlow.indexOf(currentStatus);

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Status-Übergangsanzeige</h4>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Verkaufsprozess-Status</CardTitle>
          <CardDescription>Aktueller Status: {statusConfig[currentStatus].label}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Flow */}
          <div className="flex items-center justify-between">
            {statusFlow.map((status, index) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              const isCurrent = status === currentStatus;
              const isPast = index < currentIndex;
              const isNext = index === currentIndex + 1;

              return (
                <div key={status} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCurrent
                          ? `${config.bgColor} ${config.color} border-current`
                          : isPast
                            ? 'bg-green-50 dark:bg-green-950/20 text-green-600 border-green-600'
                            : isNext
                              ? 'bg-muted text-muted-foreground border-muted-foreground border-dashed'
                              : 'bg-muted text-muted-foreground border-muted'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`text-xs text-center max-w-[80px] ${
                        isCurrent ? 'font-semibold' : 'text-muted-foreground'
                      }`}
                    >
                      {config.label}
                    </span>
                  </div>

                  {index < statusFlow.length - 1 && (
                    <div className="flex items-center mx-2">
                      <ChevronRight
                        className={`h-5 w-5 ${
                          index < currentIndex ? 'text-green-600' : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Status Selector */}
          <div className="space-y-2">
            <Label>Status ändern (Demo)</Label>
            <Select value={currentStatus} onValueChange={(val) => setCurrentStatus(val as OpportunityStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusConfig)
                  .filter(([key]) => statusFlow.includes(key as OpportunityStatus))
                  .map(([key, config]) => {
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
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Visueller Fortschritt durch den Verkaufsprozess mit Status-Indikatoren
      </p>
    </div>
  );
}

// Conditional Fields Demo
function ConditionalFieldsDemo() {
  const [status, setStatus] = useState<OpportunityStatus>('proposal');

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Statusabhängige Felder</h4>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bedingte Feldanzeige</CardTitle>
          <CardDescription>Felder erscheinen basierend auf dem Status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Selector */}
          <div className="space-y-2">
            <Label>Status auswählen</Label>
            <Select value={status} onValueChange={(val) => setStatus(val as OpportunityStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proposal">Angebot erstellt</SelectItem>
                <SelectItem value="won">Gewonnen</SelectItem>
                <SelectItem value="lost">Verloren</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Conditional: Won */}
          {status === 'won' && (
            <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="font-semibold">Felder für gewonnene Opportunities</span>
              </div>

              <div className="space-y-2">
                <Label>
                  Tatsächlicher Auftragswert <span className="text-destructive">*</span>
                </Label>
                <Input type="number" placeholder="125000" />
              </div>

              <div className="space-y-2">
                <Label>
                  Auftragsdatum <span className="text-destructive">*</span>
                </Label>
                <Input type="date" />
              </div>
            </div>
          )}

          {/* Conditional: Lost */}
          {status === 'lost' && (
            <div className="space-y-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-600">
                <X className="h-4 w-4" />
                <span className="font-semibold">Felder für verlorene Opportunities</span>
              </div>

              <div className="space-y-2">
                <Label>
                  Grund für Verlust <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  placeholder="Bitte beschreiben Sie, warum die Opportunity verloren wurde..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Mindestens 10 Zeichen erforderlich</p>
              </div>

              <div className="space-y-2">
                <Label>An Wettbewerber verloren</Label>
                <Input placeholder="Name des Wettbewerbers" />
              </div>
            </div>
          )}

          {/* Default */}
          {status !== 'won' && status !== 'lost' && (
            <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
              Wählen Sie "Gewonnen" oder "Verloren", um zusätzliche Felder anzuzeigen
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Bei "Gewonnen": Tatsächlicher Wert & Auftragsdatum erforderlich. Bei "Verloren":
        Verlustgrund erforderlich (min. 10 Zeichen)
      </p>
    </div>
  );
}

// Value Calculation Demo
function ValueCalculationDemo() {
  const [estimatedValue, setEstimatedValue] = useState('125000');
  const [probability, setProbability] = useState([75]);

  const weightedValue = parseFloat(estimatedValue || '0') * (probability[0] / 100);

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Werteberechnung</h4>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gewichteter Wert (Echtzeit)</CardTitle>
          <CardDescription>
            Automatische Berechnung: Geschätzter Wert × Wahrscheinlichkeit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input: Estimated Value */}
            <div className="space-y-2">
              <Label>Geschätzter Auftragswert</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                  placeholder="125000"
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  €
                </span>
              </div>
            </div>

            {/* Input: Probability */}
            <div className="space-y-2">
              <Label>Wahrscheinlichkeit: {probability[0]}%</Label>
              <Slider
                value={probability}
                onValueChange={setProbability}
                max={100}
                step={5}
                className="mt-6"
              />
            </div>
          </div>

          <Separator />

          {/* Calculation Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Geschätzter Wert:</span>
              <span className="font-medium">{formatCurrency(parseFloat(estimatedValue || '0'))}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Wahrscheinlichkeit:</span>
              <span className="font-medium">{probability[0]}%</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Berechnung:</span>
              <span className="font-mono text-xs">
                {formatCurrency(parseFloat(estimatedValue || '0'))} × {probability[0] / 100}
              </span>
            </div>

            <Separator />

            <div className="flex justify-between items-baseline bg-accent/50 p-3 rounded-lg">
              <span className="font-semibold">Gewichteter Wert:</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(weightedValue)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Der gewichtete Wert wird in Echtzeit berechnet und automatisch aktualisiert
      </p>
    </div>
  );
}

export function OpportunityFormDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Vollständiges Opportunity-Formular</CardTitle>
          <CardDescription>
            Verkaufschance erfassen mit Wertschätzung, Wahrscheinlichkeit und statusabhängigen
            Feldern
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <OpportunityForm currentUserRole="ADM" />
            <p className="text-sm text-muted-foreground">
              4 Abschnitte: Kunde & Grunddaten, Wertermittlung, Status & Zeitplan, Zuordnung
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Wahrscheinlichkeits-Slider</CardTitle>
          <CardDescription>
            Interaktiver Slider für Erfolgswahrscheinlichkeit (0-100% in 5%-Schritten)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProbabilitySliderDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status-Übergang</CardTitle>
          <CardDescription>
            Visueller Fortschrittsindikator durch den Verkaufsprozess
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StatusTransitionDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statusabhängige Felder</CardTitle>
          <CardDescription>
            Bedingte Felder erscheinen basierend auf dem Opportunity-Status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConditionalFieldsDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Werteberechnung</CardTitle>
          <CardDescription>
            Automatische Echtzeit-Berechnung des gewichteten Werts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ValueCalculationDemo />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Formular-Layout</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Dialog: 900px Breite</li>
              <li>• 2-Spalten-Layout</li>
              <li>• Prominente Wertekarten</li>
              <li>• Bedingte Abschnitte</li>
              <li>• Footer mit Entwurf-Option</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Pflichtfelder</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Kunde *</li>
              <li>• Titel * (5-200 chars)</li>
              <li>• Geschätzter Wert *</li>
              <li>• Wahrscheinlichkeit *</li>
              <li>• Status *</li>
              <li>• Verantwortlicher *</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Wertekarten</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Geschätzter Wert (Input)</li>
              <li>• Wahrscheinlichkeit (Slider)</li>
              <li>• Gewichteter Wert (berechnet)</li>
              <li>• Icons: Euro, TrendingUp</li>
              <li>• Große Schrift (24-32px)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Status-Werte</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Neu (blau)</li>
              <li>• Qualifizierung (amber)</li>
              <li>• Angebot erstellt (lila)</li>
              <li>• Verhandlung (orange)</li>
              <li>• Gewonnen (grün)</li>
              <li>• Verloren (rot)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Bedingte Felder</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Won: Tatsächlicher Wert *</li>
              <li>• Won: Auftragsdatum *</li>
              <li>• Lost: Verlustgrund * (≥10)</li>
              <li>• Lost: Wettbewerber</li>
              <li>• Werteabweichung anzeigen</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Wahrscheinlichkeit</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Slider: 0-100%</li>
              <li>• Schritte: 5%</li>
              <li>• Große Anzeige (32px)</li>
              <li>• Echtzeit-Update</li>
              <li>• Markierungen: 0/25/50/75/100</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}