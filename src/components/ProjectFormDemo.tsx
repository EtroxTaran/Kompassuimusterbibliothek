import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RichTextEditor } from './RichTextEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  Hash,
  Building2,
  FileSignature,
  Calculator,
  Calendar,
  Users,
  Upload,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  Plus,
  Save,
  X,
  FileText,
  User,
  TrendingUp,
} from 'lucide-react';

// User role type
type UserRole = 'GF' | 'PLAN' | 'ADM' | 'KALK';

// Customers
const customers = [
  { id: '1', name: 'Hofladen Müller GmbH', location: 'München' },
  { id: '2', name: 'REWE München Süd', location: 'München' },
  { id: '3', name: 'Edeka Hamburg Nord', location: 'Hamburg' },
];

// Opportunities
const opportunities = [
  { id: '1', title: 'Ladeneinrichtung', value: 125000, customerId: '2' },
  { id: '2', title: 'Renovierung Filiale', value: 85000, customerId: '1' },
];

// Team members
const teamMembers = [
  { id: '1', name: 'Thomas Fischer', role: 'PLAN' },
  { id: '2', name: 'Michael Schmidt', role: 'ADM' },
  { id: '3', name: 'Katrin Weber', role: 'KALK' },
  { id: '4', name: 'Sarah Hoffmann', role: 'PLAN' },
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

// Calculate duration in days
function calculateDuration(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Full Project Form
function ProjectForm({
  fromOpportunity = false,
  isEdit = false,
}: {
  fromOpportunity?: boolean;
  isEdit?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('grunddaten');

  // Form fields
  const [projectNumber] = useState('P-2024-B023');
  const [projectName, setProjectName] = useState('');
  const [customerId, setCustomerId] = useState(fromOpportunity ? '2' : '');
  const [opportunityId, setOpportunityId] = useState(fromOpportunity ? '1' : '');
  const [description, setDescription] = useState('');
  
  // Budget
  const [contractValue, setContractValue] = useState(fromOpportunity ? '125000' : '');
  const [plannedBudget, setPlannedBudget] = useState('');
  
  // Timeline
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Team
  const [projectManager, setProjectManager] = useState('');
  const [teamMemberIds, setTeamMemberIds] = useState<string[]>([]);
  const [externalPartners, setExternalPartners] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  
  // Documents
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculations
  const margin = parseFloat(contractValue || '0') - parseFloat(plannedBudget || '0');
  const marginPercent = contractValue ? (margin / parseFloat(contractValue)) * 100 : 0;
  const budgetWarning = parseFloat(plannedBudget || '0') > parseFloat(contractValue || '0');
  const duration = calculateDuration(startDate, endDate);

  const selectedOpportunity = opportunities.find((o) => o.id === opportunityId);
  const selectedCustomer = customers.find((c) => c.id === customerId);

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'projectName':
        if (!value || value.length < 5) return 'Projektname muss mindestens 5 Zeichen lang sein';
        if (value.length > 200) return 'Projektname darf maximal 200 Zeichen lang sein';
        return null;
      case 'contractValue':
        const contract = parseFloat(value);
        if (isNaN(contract) || contract <= 0) return 'Auftragswert muss größer als 0 sein';
        if (contract > 10000000) return 'Auftragswert darf maximal 10.000.000 € betragen';
        return null;
      case 'plannedBudget':
        const budget = parseFloat(value);
        if (isNaN(budget) || budget <= 0) return 'Budget muss größer als 0 sein';
        return null;
      case 'startDate':
        if (!value) return null;
        const start = new Date(value);
        const today = new Date();
        const minDate = new Date(today.setDate(today.getDate() - 30));
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 365);
        if (start < minDate || start > maxDate) {
          return 'Projektstartdatum muss innerhalb von -30 bis +365 Tagen liegen';
        }
        return null;
      case 'endDate':
        if (!value || !startDate) return null;
        const end = new Date(value);
        const startD = new Date(startDate);
        if (end <= startD) return 'Projektende muss nach Projektstart liegen';
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

  const addTeamMember = (memberId: string) => {
    if (!teamMemberIds.includes(memberId)) {
      setTeamMemberIds([...teamMemberIds, memberId]);
    }
  };

  const removeTeamMember = (memberId: string) => {
    setTeamMemberIds(teamMemberIds.filter((id) => id !== memberId));
  };

  const addFile = () => {
    // Simulate file upload
    const fileName = `Dokument_${uploadedFiles.length + 1}.pdf`;
    setUploadedFiles([...uploadedFiles, fileName]);
    toast.success(`${fileName} hochgeladen`);
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f !== fileName));
  };

  const handleSubmit = () => {
    // Validate all required fields
    const requiredErrors: Record<string, string> = {};

    if (!projectName) requiredErrors.projectName = 'Projektname ist ein Pflichtfeld';
    if (!customerId) requiredErrors.customerId = 'Kunde ist ein Pflichtfeld';
    if (!contractValue) requiredErrors.contractValue = 'Auftragswert ist ein Pflichtfeld';
    if (!plannedBudget) requiredErrors.plannedBudget = 'Geplantes Budget ist ein Pflichtfeld';
    if (!startDate) requiredErrors.startDate = 'Projektstartdatum ist ein Pflichtfeld';
    if (!endDate) requiredErrors.endDate = 'Projektenddatum ist ein Pflichtfeld';
    if (!projectManager) requiredErrors.projectManager = 'Projektleiter ist ein Pflichtfeld';

    // Validate project manager is PLAN
    const pmUser = teamMembers.find((m) => m.id === projectManager);
    if (pmUser && pmUser.role !== 'PLAN') {
      requiredErrors.projectManager = 'Projektleiter muss ein Planungsmitarbeiter sein';
    }

    // Check other validations
    const nameError = validateField('projectName', projectName);
    if (nameError) requiredErrors.projectName = nameError;

    const valueError = validateField('contractValue', contractValue);
    if (valueError) requiredErrors.contractValue = valueError;

    const budgetError = validateField('plannedBudget', plannedBudget);
    if (budgetError) requiredErrors.plannedBudget = budgetError;

    const startError = validateField('startDate', startDate);
    if (startError) requiredErrors.startDate = startError;

    const endError = validateField('endDate', endDate);
    if (endError) requiredErrors.endDate = endError;

    if (Object.keys(requiredErrors).length > 0) {
      setErrors(requiredErrors);
      toast.error('Bitte korrigieren Sie die Fehler im Formular');
      return;
    }

    // Submit
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Projekt ${projectNumber} wurde erfolgreich angelegt`, {
        description: projectName,
      });
      setOpen(false);
      resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setProjectName('');
    setCustomerId('');
    setOpportunityId('');
    setDescription('');
    setContractValue('');
    setPlannedBudget('');
    setStartDate('');
    setEndDate('');
    setProjectManager('');
    setTeamMemberIds([]);
    setExternalPartners('');
    setUploadedFiles([]);
    setErrors({});
    setActiveTab('grunddaten');
  };

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
          {isEdit ? 'Projekt bearbeiten' : 'Neues Projekt'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Projekt bearbeiten' : 'Neues Projekt'}</DialogTitle>
          <DialogDescription>Projekt initialisieren und planen</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* GoBD Info */}
          <Alert className="bg-accent/50 border-accent">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              Projektnummern werden automatisch generiert und sind GoBD-konform unveränderlich
            </AlertDescription>
          </Alert>

          {/* Opportunity Link */}
          {fromOpportunity && selectedOpportunity && (
            <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900 dark:text-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      Erstellt aus gewonnener Opportunity: {selectedOpportunity.title}
                    </div>
                    <div className="text-sm mt-1">
                      Auftragswert: {formatCurrency(selectedOpportunity.value)}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Opportunity anzeigen
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Tabbed Form */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="grunddaten">Grunddaten</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="zeitplan">Zeitplan</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="dokumente">Dokumente</TabsTrigger>
            </TabsList>

            {/* Tab 1: Grunddaten */}
            <TabsContent value="grunddaten" className="space-y-4">
              {/* Project Number */}
              <div className="space-y-2">
                <Label>Projektnummer</Label>
                <div className="bg-accent/50 border border-accent rounded-lg p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/60 flex items-center justify-center">
                    <Hash className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{projectNumber}</div>
                    <p className="text-xs text-muted-foreground">
                      Automatisch generiert (GoBD-konform)
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="project-name">
                  Projektname <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onBlur={(e) => handleBlur('projectName', e.target.value)}
                  placeholder="z.B. REWE München Süd - Ladeneinrichtung"
                  className={errors.projectName ? 'border-destructive' : ''}
                />
                {errors.projectName && (
                  <p className="text-sm text-destructive">{errors.projectName}</p>
                )}
              </div>

              {/* Customer */}
              <div className="space-y-2">
                <Label htmlFor="customer">
                  Kunde <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Select
                    value={customerId}
                    onValueChange={setCustomerId}
                    disabled={fromOpportunity}
                  >
                    <SelectTrigger id="customer" className="pl-10">
                      <SelectValue placeholder="Kunde auswählen..." />
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
              </div>

              {/* Opportunity */}
              <div className="space-y-2">
                <Label htmlFor="opportunity">Zugehörige Opportunity</Label>
                <div className="relative">
                  <Select
                    value={opportunityId}
                    onValueChange={setOpportunityId}
                    disabled={fromOpportunity}
                  >
                    <SelectTrigger id="opportunity">
                      <SelectValue placeholder="Keine Opportunity" />
                    </SelectTrigger>
                    <SelectContent>
                      {opportunities
                        .filter((o) => !customerId || o.customerId === customerId)
                        .map((opp) => (
                          <SelectItem key={opp.id} value={opp.id}>
                            {opp.title} ({formatCurrency(opp.value)})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {fromOpportunity && (
                  <p className="text-xs text-muted-foreground">
                    Projekt wurde aus dieser Opportunity erstellt
                  </p>
                )}
              </div>

              {/* Description */}
              <RichTextEditor
                id="description"
                label="Projektbeschreibung"
                value={description}
                onChange={setDescription}
                placeholder="Detaillierte Beschreibung des Projekts, Leistungsumfang, besondere Anforderungen..."
                minHeight={150}
                maxLength={2000}
                toolbar="basic"
              />
            </TabsContent>

            {/* Tab 2: Budget */}
            <TabsContent value="budget" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Contract Value */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                          <FileSignature className="h-6 w-6 text-primary" />
                        </div>
                        <Label className="text-xs text-muted-foreground">
                          Vertragswert <span className="text-destructive">*</span>
                        </Label>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          value={contractValue}
                          onChange={(e) => setContractValue(e.target.value)}
                          onBlur={(e) => handleBlur('contractValue', e.target.value)}
                          placeholder="450000"
                          disabled={fromOpportunity}
                          className={`text-2xl h-14 pr-8 ${errors.contractValue ? 'border-destructive' : ''}`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">
                          €
                        </span>
                      </div>
                      {errors.contractValue && (
                        <p className="text-xs text-destructive">{errors.contractValue}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Vertraglich vereinbarter Auftragswert
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Planned Budget */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                          <Calculator className="h-6 w-6 text-primary" />
                        </div>
                        <Label className="text-xs text-muted-foreground">
                          Geplantes Budget <span className="text-destructive">*</span>
                        </Label>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          value={plannedBudget}
                          onChange={(e) => setPlannedBudget(e.target.value)}
                          onBlur={(e) => handleBlur('plannedBudget', e.target.value)}
                          placeholder="380000"
                          className={`text-2xl h-14 pr-8 ${errors.plannedBudget ? 'border-destructive' : ''}`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">
                          €
                        </span>
                      </div>
                      {errors.plannedBudget && (
                        <p className="text-xs text-destructive">{errors.plannedBudget}</p>
                      )}
                      <p className="text-xs text-muted-foreground">Geplante Projektkosten</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Planned Margin */}
                <Card
                  className={
                    margin >= 0
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                  }
                >
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          Geplante Marge
                          <Info className="h-3 w-3" />
                        </Label>
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {formatCurrency(margin)}
                        </div>
                        <div
                          className={`text-xl font-medium mt-1 ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {marginPercent.toFixed(1)}%
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center pt-4">
                        Berechnet als Auftragswert minus Budget
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Budget Warning */}
              {budgetWarning && (
                <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900 dark:text-amber-100">
                    Achtung: Budget überschreitet Auftragswert um{' '}
                    {formatCurrency(Math.abs(margin))}. Dies führt zu einer negativen Marge.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Tab 3: Zeitplan */}
            <TabsContent value="zeitplan" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="start-date">
                    Geplanter Projektstart <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      onBlur={(e) => handleBlur('startDate', e.target.value)}
                      className={`pl-10 ${errors.startDate ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="text-sm text-destructive">{errors.startDate}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Geplantes Startdatum des Projekts
                  </p>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor="end-date">
                    Geplantes Projektende <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      onBlur={(e) => handleBlur('endDate', e.target.value)}
                      className={`pl-10 ${errors.endDate ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
                  <p className="text-xs text-muted-foreground">Geplantes Abschlussdatum</p>
                </div>
              </div>

              {/* Duration Display */}
              {duration > 0 && (
                <>
                  <Card className="bg-accent/50 border-accent">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Projektdauer</Label>
                          <div className="text-2xl font-bold text-primary">
                            {duration} Tage
                            <span className="text-base font-normal text-muted-foreground ml-2">
                              ({Math.ceil(duration / 7)} Wochen)
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Visual Timeline */}
                  {startDate && endDate && duration > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Zeitstrahl</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Start: {new Date(startDate).toLocaleDateString('de-DE')}
                            </span>
                            <span className="text-muted-foreground">
                              Ende: {new Date(endDate).toLocaleDateString('de-DE')}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            {/* Tab 4: Team */}
            <TabsContent value="team" className="space-y-4">
              {/* Project Manager */}
              <div className="space-y-2">
                <Label htmlFor="project-manager">
                  Projektleiter <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Select value={projectManager} onValueChange={setProjectManager}>
                    <SelectTrigger id="project-manager" className="pl-10">
                      <SelectValue placeholder="Projektleiter auswählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers
                        .filter((m) => m.role === 'PLAN')
                        .map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} ({member.role})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.projectManager && (
                  <p className="text-sm text-destructive">{errors.projectManager}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Projektleiter muss ein Planungsmitarbeiter sein
                </p>
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <Label>Team-Mitglieder</Label>
                {teamMemberIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {teamMemberIds.map((memberId) => {
                      const member = teamMembers.find((m) => m.id === memberId);
                      return (
                        <Badge key={memberId} variant="secondary" className="gap-1">
                          {member?.name} ({member?.role})
                          <button
                            onClick={() => removeTeamMember(memberId)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
                <Select onValueChange={addTeamMember} value="">
                  <SelectTrigger>
                    <SelectValue placeholder="Team-Mitglied hinzufügen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers
                      .filter((m) => !teamMemberIds.includes(m.id) && m.id !== projectManager)
                      .map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.role})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* External Partners */}
              <RichTextEditor
                id="external-partners"
                label="Externe Partner"
                value={externalPartners}
                onChange={setExternalPartners}
                placeholder="Namen und Firmen externer Dienstleister..."
                minHeight={100}
                maxLength={500}
                toolbar="basic"
              />

              {/* Project Notes - NEW */}
              <RichTextEditor
                id="project-notes"
                label="Projektnotizen"
                value={projectNotes}
                onChange={setProjectNotes}
                placeholder="Zusätzliche Informationen, Anmerkungen, wichtige Hinweise..."
                minHeight={100}
                maxLength={1000}
                helpText="Interne Notizen zum Projekt (nur für Mitarbeiter sichtbar)"
                toolbar="basic"
              />
            </TabsContent>

            {/* Tab 5: Dokumente */}
            <TabsContent value="dokumente" className="space-y-4">
              <div className="space-y-2">
                <Label>Projekt-Dokumente</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="mb-2">Dokumente hochladen</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Verträge, Pläne, Spezifikationen hochladen
                  </p>
                  <Button variant="outline" onClick={addFile}>
                    <Plus className="mr-2 h-4 w-4" />
                    Datei auswählen
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    PDF, DOCX, XLSX, Bilder • Max. 10 MB pro Datei
                  </p>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label>Hochgeladene Dokumente ({uploadedFiles.length})</Label>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Aktueller Tab: {activeTab === 'grunddaten' ? 'Grunddaten' : activeTab === 'budget' ? 'Budget' : activeTab === 'zeitplan' ? 'Zeitplan' : activeTab === 'team' ? 'Team' : 'Dokumente'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Abbrechen
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-pulse" />
                  Wird erstellt...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Projekt erstellen
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Budget Calculation Demo
function BudgetCalculationDemo() {
  const [contractValue, setContractValue] = useState('450000');
  const [plannedBudget, setPlannedBudget] = useState('380000');

  const margin = parseFloat(contractValue || '0') - parseFloat(plannedBudget || '0');
  const marginPercent = contractValue ? (margin / parseFloat(contractValue)) * 100 : 0;

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Budget-Berechnung</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vertragswert</Label>
          <div className="relative">
            <Input
              type="number"
              value={contractValue}
              onChange={(e) => setContractValue(e.target.value)}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              €
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Geplantes Budget</Label>
          <div className="relative">
            <Input
              type="number"
              value={plannedBudget}
              onChange={(e) => setPlannedBudget(e.target.value)}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              €
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <Card
        className={
          margin >= 0
            ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
        }
      >
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Vertragswert:</span>
              <span className="font-medium">{formatCurrency(parseFloat(contractValue || '0'))}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Geplantes Budget:</span>
              <span className="font-medium">- {formatCurrency(parseFloat(plannedBudget || '0'))}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-baseline">
              <span className="font-semibold">Geplante Marge:</span>
              <div className="text-right">
                <div
                  className={`text-2xl font-bold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatCurrency(margin)}
                </div>
                <div
                  className={`text-lg font-medium ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {marginPercent.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {plannedBudget && parseFloat(plannedBudget) > parseFloat(contractValue || '0') && (
        <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900 dark:text-amber-100">
            Budget überschreitet Auftragswert - negative Marge!
          </AlertDescription>
        </Alert>
      )}

      <p className="text-sm text-muted-foreground">
        Marge wird automatisch berechnet: Vertragswert - Budget
      </p>
    </div>
  );
}

// Timeline Visualization Demo
function TimelineVisualizationDemo() {
  const [startDate, setStartDate] = useState('2024-12-01');
  const [endDate, setEndDate] = useState('2025-02-28');

  const duration = calculateDuration(startDate, endDate);

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Zeitplan-Visualisierung</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Projektstartdatum</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Projektenddatum</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      {duration > 0 && (
        <>
          <Card className="bg-accent/50 border-accent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Projektdauer</Label>
                  <div className="text-2xl font-bold text-primary">
                    {duration} Tage
                    <span className="text-base font-normal text-muted-foreground ml-2">
                      ({Math.ceil(duration / 7)} Wochen)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Visueller Zeitstrahl</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Start: {new Date(startDate).toLocaleDateString('de-DE')}
                  </span>
                  <span className="text-muted-foreground">
                    Ende: {new Date(endDate).toLocaleDateString('de-DE')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <p className="text-sm text-muted-foreground">
        Dauer wird automatisch aus Start- und Enddatum berechnet
      </p>
    </div>
  );
}

// GoBD Project Number Demo
function GoBDProjectNumberDemo() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">GoBD-konforme Projektnummer</h4>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Automatische Nummerngenerierung</CardTitle>
          <CardDescription>P-YYYY-X### Format</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-accent/50 border border-accent rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-accent/60 flex items-center justify-center">
                <Hash className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">P-2024-B023</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Automatisch generiert (GoBD-konform)
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Format:</span>
              <span className="font-medium">P-YYYY-X###</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">P:</span>
              <span className="font-medium">Projekt-Präfix</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">YYYY:</span>
              <span className="font-medium">Jahr (2024)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">X:</span>
              <span className="font-medium">Typ (B=Bau, I=Innenausbau)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">###:</span>
              <span className="font-medium">Fortlaufende Nummer</span>
            </div>
          </div>

          <Alert className="bg-accent/50 border-accent">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              Projektnummer wird bei Erstellung automatisch gemäß GoBD-Anforderungen generiert und
              ist unveränderlich
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        GoBD-konforme automatische Nummerierung für Nachvollziehbarkeit und Revisionssicherheit
      </p>
    </div>
  );
}

export function ProjectFormDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Vollständiges Projektformular</CardTitle>
          <CardDescription>
            Projekt mit 5 Tabs: Grunddaten, Budget, Zeitplan, Team, Dokumente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <ProjectForm fromOpportunity={false} />
              <ProjectForm fromOpportunity={true} />
            </div>
            <p className="text-sm text-muted-foreground">
              Links: Neues Projekt | Rechts: Aus gewonnener Opportunity erstellt
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Budget-Berechnung</CardTitle>
          <CardDescription>
            Automatische Margenberechnung: Vertragswert - Budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetCalculationDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zeitplan-Visualisierung</CardTitle>
          <CardDescription>
            Automatische Dauerberechnung und visueller Zeitstrahl
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimelineVisualizationDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GoBD-Projektnummer</CardTitle>
          <CardDescription>
            Automatische Nummerngenerierung nach GoBD-Standard (P-YYYY-X###)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoBDProjectNumberDemo />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Formular-Layout</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Dialog: 1000px Breite</li>
              <li>• Tabbed Form (5 Tabs)</li>
              <li>• GoBD Info-Banner oben</li>
              <li>• Opportunity-Link (wenn zutreffend)</li>
              <li>• Sticky Footer mit Buttons</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Pflichtfelder</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Projektname *</li>
              <li>• Kunde *</li>
              <li>• Vertragswert *</li>
              <li>• Geplantes Budget *</li>
              <li>• Projektstart *</li>
              <li>• Projektende *</li>
              <li>• Projektleiter * (PLAN)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Tabs</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Grunddaten (Basis-Info)</li>
              <li>• Budget (Finanzen)</li>
              <li>• Zeitplan (Termine)</li>
              <li>• Team (Ressourcen)</li>
              <li>• Dokumente (Uploads)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Budget-Karten</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Vertragswert (Input)</li>
              <li>• Geplantes Budget (Input)</li>
              <li>• Geplante Marge (berechnet)</li>
              <li>• Grün: Positive Marge</li>
              <li>• Rot: Negative Marge</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Zeitplan</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Start-/Enddatum</li>
              <li>• Dauer-Berechnung</li>
              <li>• Visueller Zeitstrahl</li>
              <li>• Tage & Wochen</li>
              <li>• Validierung: Ende &gt; Start</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Team</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Projektleiter (PLAN-Rolle)</li>
              <li>• Team-Mitglieder (Multi)</li>
              <li>• Chips mit Rolle</li>
              <li>• Externe Partner</li>
              <li>• Avatar-Badges</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}