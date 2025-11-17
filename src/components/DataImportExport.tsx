import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Download,
  Upload,
  FileText,
  Table as TableIcon,
  Check,
  AlertTriangle,
  X,
  Calendar as CalendarIcon,
  Users,
  FileSpreadsheet,
  FileJson,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Loader2,
  CheckCircle,
  XCircle,
  Cloud,
  Mail,
} from 'lucide-react';

// Types
export type ExportEntity = 'customers' | 'contacts' | 'opportunities' | 'projects' | 'invoices' | 'protocols';
export type ExportFormat = 'csv' | 'xlsx' | 'json' | 'datev' | 'docx';
export type ImportMode = 'create' | 'update' | 'upsert';
export type ValidationStatus = 'valid' | 'warning' | 'error';
export type DateParseStatus = 'success' | 'warning' | 'error';

export interface ExportField {
  id: string;
  label: string;
  required: boolean;
  sensitive?: boolean;
}

export interface FieldMapping {
  sourceColumn: string;
  targetField: string;
  required: boolean;
}

export interface ValidationError {
  row: number;
  status: ValidationStatus;
  field: string;
  error: string;
  value: string;
}

export interface DateParseResult {
  row: number;
  originalValue: string;
  parsedValue: string | null;
  format: string | null;
  status: DateParseStatus;
  confidence?: number;
}

export interface CustomerAssignment {
  row: number;
  note: string;
  customerId: string | null;
  customerName: string | null;
  autoMatched: boolean;
  confidence?: number;
}

// Mock Data
export const exportFields: Record<ExportEntity, ExportField[]> = {
  customers: [
    { id: 'companyName', label: 'Firmenname', required: true },
    { id: 'vatNumber', label: 'VAT-Nummer', required: true },
    { id: 'email', label: 'E-Mail', required: true },
    { id: 'phone', label: 'Telefon', required: false },
    { id: 'address', label: 'Adresse', required: false },
    { id: 'creditLimit', label: 'Kreditlimit', required: false, sensitive: true },
    { id: 'internalNotes', label: 'Interne Notizen', required: false, sensitive: true },
  ],
  contacts: [
    { id: 'firstName', label: 'Vorname', required: true },
    { id: 'lastName', label: 'Nachname', required: true },
    { id: 'email', label: 'E-Mail', required: true },
    { id: 'phone', label: 'Telefon', required: false },
    { id: 'position', label: 'Position', required: false },
  ],
  opportunities: [
    { id: 'name', label: 'Name', required: true },
    { id: 'value', label: 'Wert', required: true },
    { id: 'stage', label: 'Phase', required: true },
    { id: 'probability', label: 'Wahrscheinlichkeit', required: false },
  ],
  projects: [
    { id: 'name', label: 'Projektname', required: true },
    { id: 'customer', label: 'Kunde', required: true },
    { id: 'status', label: 'Status', required: true },
    { id: 'budget', label: 'Budget', required: false },
  ],
  invoices: [
    { id: 'invoiceNumber', label: 'Rechnungsnummer', required: true },
    { id: 'customer', label: 'Kunde', required: true },
    { id: 'amount', label: 'Betrag', required: true },
    { id: 'date', label: 'Datum', required: true },
  ],
  protocols: [
    { id: 'date', label: 'Datum', required: true },
    { id: 'note', label: 'Notiz', required: true },
    { id: 'action', label: 'Aktion', required: false },
    { id: 'customer', label: 'Kunde', required: true },
    { id: 'contact', label: 'Kontakt', required: false },
    { id: 'user', label: 'Benutzer', required: false },
    { id: 'type', label: 'Protokolltyp', required: false },
  ],
};

export const mockCustomers = [
  { id: 'cust1', name: 'Hofladen Müller GmbH', rating: 'A' },
  { id: 'cust2', name: 'REWE München Süd', rating: 'B' },
  { id: 'cust3', name: 'EDEKA Garching', rating: 'A' },
];

export const mockDateParseResults: DateParseResult[] = [
  { row: 1, originalValue: '2024-01-15', parsedValue: '15.01.2024', format: 'YYYY-MM-DD', status: 'success', confidence: 1.0 },
  { row: 2, originalValue: '15.01.24', parsedValue: '15.01.2024', format: 'DD.MM.YY', status: 'success', confidence: 0.95 },
  { row: 3, originalValue: '15 Jan 24', parsedValue: '15.01.2024', format: 'DD MMM YY', status: 'success', confidence: 0.90 },
  { row: 4, originalValue: 'invalid-date', parsedValue: null, format: null, status: 'error', confidence: 0.0 },
  { row: 5, originalValue: '2026-01-15', parsedValue: '15.01.2026', format: 'YYYY-MM-DD', status: 'warning', confidence: 0.85 },
];

export const mockValidationErrors: ValidationError[] = [
  { row: 2, status: 'error', field: 'VAT-Nummer', error: 'Ungültiges Format (DE fehlt)', value: '123456789' },
  { row: 5, status: 'warning', field: 'E-Mail', error: 'Ungültige E-Mail', value: 'test@' },
  { row: 12, status: 'error', field: 'Firmenname', error: 'Pflichtfeld fehlt', value: '(leer)' },
];

// Export Dialog Component
export function ExportDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState(1);
  const [entity, setEntity] = useState<ExportEntity>('customers');
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year' | 'all' | 'custom'>('all');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [includeAuditTrail, setIncludeAuditTrail] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const fields = exportFields[entity];
  const allFieldsSelected = selectedFields.length === fields.length;

  const handleExport = () => {
    setExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          toast.success('Export abgeschlossen', {
            description: '256 Kunden exportiert',
          });
          onOpenChange(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-6 w-6 text-blue-600" />
            Daten exportieren
          </DialogTitle>
          <DialogDescription>Exportieren Sie Ihre Daten in verschiedenen Formaten</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 p-1">
            {/* Step 1: Entity Selection */}
            <div>
              <h3 className="mb-3">Exporttyp</h3>
              <RadioGroup value={entity} onValueChange={(v: ExportEntity) => setEntity(v)}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customers" id="export-customers" />
                    <Label htmlFor="export-customers">Kunden</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contacts" id="export-contacts" />
                    <Label htmlFor="export-contacts">Kontakte</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="protocols" id="export-protocols" />
                    <Label htmlFor="export-protocols">Kontaktprotokolle</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="opportunities" id="export-opportunities" />
                    <Label htmlFor="export-opportunities">Opportunities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="projects" id="export-projects" />
                    <Label htmlFor="export-projects">Projekte</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="invoices" id="export-invoices" />
                    <Label htmlFor="export-invoices">Rechnungen</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Step 2: Date Range */}
            <div>
              <h3 className="mb-3">Zeitraum</h3>
              <div className="flex flex-wrap gap-2">
                {['today', 'week', 'month', 'quarter', 'year', 'all'].map((range) => (
                  <Badge
                    key={range}
                    variant={dateRange === range ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setDateRange(range as any)}
                  >
                    {range === 'today' && 'Heute'}
                    {range === 'week' && 'Diese Woche'}
                    {range === 'month' && 'Dieser Monat'}
                    {range === 'quarter' && 'Dieses Quartal'}
                    {range === 'year' && 'Dieses Jahr'}
                    {range === 'all' && 'Alle'}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Step 3: Format */}
            <div>
              <h3 className="mb-3">Format wählen</h3>
              <Select value={format} onValueChange={(v: ExportFormat) => setFormat(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Standard)</SelectItem>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  <SelectItem value="json">JSON (API)</SelectItem>
                  <SelectItem value="datev">DATEV (GoBD-konform)</SelectItem>
                  {entity === 'protocols' && <SelectItem value="docx">Word (.docx)</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Step 4: Fields */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3>Felder auswählen</h3>
                <span className="text-sm text-muted-foreground">
                  {selectedFields.length} von {fields.length} Feldern
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="all-fields"
                    checked={allFieldsSelected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFields(fields.map((f) => f.id));
                      } else {
                        setSelectedFields([]);
                      }
                    }}
                  />
                  <Label htmlFor="all-fields">Alle Felder</Label>
                </div>
                <div className="grid grid-cols-2 gap-2 pl-6">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`field-${field.id}`}
                        checked={selectedFields.includes(field.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFields([...selectedFields, field.id]);
                          } else {
                            setSelectedFields(selectedFields.filter((f) => f !== field.id));
                          }
                        }}
                      />
                      <Label htmlFor={`field-${field.id}`} className="text-sm">
                        {field.label}
                        {field.sensitive && ' 🔒'}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Step 5: Options */}
            <div>
              <h3 className="mb-3">Optionen</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-header" checked={includeHeader} onCheckedChange={(c: boolean) => setIncludeHeader(c)} />
                  <Label htmlFor="include-header">Kopfzeile einschließen</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-deleted" checked={includeDeleted} onCheckedChange={(c: boolean) => setIncludeDeleted(c)} />
                  <Label htmlFor="include-deleted">Gelöschte Einträge einschließen</Label>
                </div>
                {format === 'datev' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-audit"
                      checked={includeAuditTrail}
                      onCheckedChange={(c: boolean) => setIncludeAuditTrail(c)}
                    />
                    <Label htmlFor="include-audit">Audit-Trail einschließen (GoBD)</Label>
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="mb-3">Vorschau (erste 5 Zeilen)</h3>
              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {selectedFields.slice(0, 4).map((fieldId) => {
                        const field = fields.find((f) => f.id === fieldId);
                        return (
                          <th key={fieldId} className="p-2 text-left">
                            {field?.label}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="border-t">
                        {selectedFields.slice(0, 4).map((fieldId) => (
                          <td key={fieldId} className="p-2">
                            Beispieldaten
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          {exporting ? (
            <div className="w-full space-y-2">
              <Progress value={exportProgress} />
              <p className="text-sm text-center text-muted-foreground">
                Exportiere... {exportProgress}%
              </p>
            </div>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleExport} disabled={selectedFields.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Exportieren
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Import Dialog Component
export function ImportDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState(1);
  const [entity, setEntity] = useState<ExportEntity>('customers');
  const [importMode, setImportMode] = useState<ImportMode>('create');
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [showValidation, setShowValidation] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    setImporting(true);
    setImportProgress(0);

    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setImporting(false);
          toast.success('Import abgeschlossen', {
            description: '487 Kunden erfolgreich importiert',
          });
          onOpenChange(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const totalSteps = 6;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6 text-blue-600" />
            Daten importieren
          </DialogTitle>
          <DialogDescription>
            Importieren Sie Daten aus CSV-, Excel- oder Word-Dateien
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step > i + 1
                    ? 'bg-green-600 text-white'
                    : step === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`h-1 w-8 ${step > i + 1 ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 p-4">
            {/* Step 1: File Upload */}
            {step === 1 && (
              <div>
                <h3 className="mb-4">Datei hochladen</h3>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="mb-2">CSV-, Excel- oder Word-Datei hier ablegen</p>
                  <p className="text-sm text-muted-foreground mb-4">oder</p>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls,.docx,.doc"
                    onChange={handleFileChange}
                    className="max-w-xs mx-auto"
                  />
                  <p className="text-xs text-muted-foreground mt-4">
                    Unterstützte Formate: CSV, XLSX, DOCX | Max. Größe: 10 MB
                  </p>
                </div>
                {file && (
                  <Alert className="mt-4">
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <p style={{ fontWeight: 'var(--font-weight-medium)' }}>{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 2: Import Type */}
            {step === 2 && (
              <div>
                <h3 className="mb-4">Importtyp</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Entität</Label>
                    <Select value={entity} onValueChange={(v: ExportEntity) => setEntity(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customers">Kunden</SelectItem>
                        <SelectItem value="contacts">Kontakte</SelectItem>
                        <SelectItem value="protocols">Kontaktprotokolle</SelectItem>
                        <SelectItem value="opportunities">Opportunities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Import-Modus</Label>
                    <RadioGroup value={importMode} onValueChange={(v: ImportMode) => setImportMode(v)}>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="create" id="mode-create" />
                          <Label htmlFor="mode-create">Neue Einträge erstellen</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="update" id="mode-update" />
                          <Label htmlFor="mode-update">Bestehende aktualisieren</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="upsert" id="mode-upsert" />
                          <Label htmlFor="mode-upsert">Beide (Upsert)</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Field Mapping */}
            {step === 3 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3>Felder zuordnen</h3>
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Automatisch zuordnen
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 text-left">CSV-Spalte</th>
                        <th className="p-3 text-center w-12">→</th>
                        <th className="p-3 text-left">KOMPASS-Feld</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['company_name', 'vat_number', 'email', 'phone'].map((col, i) => (
                        <tr key={col} className="border-t">
                          <td className="p-3">{col}</td>
                          <td className="p-3 text-center">
                            <ChevronRight className="h-4 w-4 mx-auto text-muted-foreground" />
                          </td>
                          <td className="p-3">
                            <Select defaultValue={i === 0 ? 'companyName' : i === 1 ? 'vatNumber' : ''}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Feld auswählen..." />
                              </SelectTrigger>
                              <SelectContent>
                                {exportFields.customers.map((field) => (
                                  <SelectItem key={field.id} value={field.id}>
                                    {field.label}
                                    {field.required && <span className="text-red-600 ml-1">*</span>}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Step 4: Validation */}
            {step === 4 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3>Validierung</h3>
                  <Button onClick={() => setShowValidation(true)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Vorschau & Validierung
                  </Button>
                </div>

                {showValidation && (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                            487
                          </p>
                          <p className="text-sm text-muted-foreground">Gültig ✅</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                          <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                            15
                          </p>
                          <p className="text-sm text-muted-foreground">Warnungen ⚠</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <XCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                          <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                            10
                          </p>
                          <p className="text-sm text-muted-foreground">Fehler ❌</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Error List */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="p-2 text-left">Zeile</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Feld</th>
                            <th className="p-2 text-left">Fehler</th>
                            <th className="p-2 text-left">Wert</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockValidationErrors.map((error) => (
                            <tr key={error.row} className="border-t">
                              <td className="p-2">{error.row}</td>
                              <td className="p-2">
                                {error.status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
                                {error.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                              </td>
                              <td className="p-2">{error.field}</td>
                              <td className="p-2 text-muted-foreground">{error.error}</td>
                              <td className="p-2">{error.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Error Handling Options */}
                    <div>
                      <Label className="mb-2 block">Fehlerbehandlung</Label>
                      <RadioGroup defaultValue="skip-valid">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="skip-valid" id="skip-valid" />
                            <Label htmlFor="skip-valid">Nur gültige Zeilen importieren</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="abort" id="abort" />
                            <Label htmlFor="abort">Import abbrechen bei Fehlern</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="log" id="log" />
                            <Label htmlFor="log">Fehlerhafte Zeilen überspringen und protokollieren</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Duplicate Check */}
            {step === 5 && (
              <div>
                <h3 className="mb-4">Duplikatsprüfung</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="enable-duplicate" defaultChecked />
                    <Label htmlFor="enable-duplicate">Duplikatsprüfung aktivieren</Label>
                  </div>
                  <div>
                    <Label className="mb-2 block">Abgleichfeld</Label>
                    <Select defaultValue="vatNumber">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vatNumber">VAT-Nummer</SelectItem>
                        <SelectItem value="email">E-Mail</SelectItem>
                        <SelectItem value="companyName">Firmenname</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Aktion bei Duplikat</Label>
                    <RadioGroup defaultValue="skip">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="skip" id="dup-skip" />
                          <Label htmlFor="dup-skip">Überspringen</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="update" id="dup-update" />
                          <Label htmlFor="dup-update">Aktualisieren</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ask" id="dup-ask" />
                          <Label htmlFor="dup-ask">Nachfragen</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Confirmation */}
            {step === 6 && (
              <div>
                <h3 className="mb-4">Import bestätigen</h3>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Import-Zusammenfassung</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zu importieren:</span>
                      <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }} className="text-green-600">
                        487 Kunden ✅
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Übersprungen (Fehler):</span>
                      <span className="text-red-600">10 Kunden ❌</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Übersprungen (Duplikate):</span>
                      <span className="text-amber-600">15 Kunden ⚠</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Gesamt:</span>
                      <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>512 Zeilen</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            {step < totalSteps ? (
              <Button onClick={() => setStep(step + 1)} disabled={step === 1 && !file}>
                Weiter
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : importing ? (
              <div className="w-48">
                <Progress value={importProgress} />
                <p className="text-xs text-center mt-1">{importProgress}%</p>
              </div>
            ) : (
              <Button onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import starten
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Protocol Import Wizard (Word Documents)
export function ProtocolImportWizard({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [selectedTable, setSelectedTable] = useState(1);
  const [dateParseResults, setDateParseResults] = useState<DateParseResult[]>(mockDateParseResults);
  const [customerAssignMode, setCustomerAssignMode] = useState<'single' | 'multiple'>('single');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showDateCorrection, setShowDateCorrection] = useState(false);
  const [correctionRow, setCorrectionRow] = useState<DateParseResult | null>(null);
  const [correctionDate, setCorrectionDate] = useState<Date>();

  const totalSteps = 7;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDateCorrection = (result: DateParseResult) => {
    setCorrectionRow(result);
    setShowDateCorrection(true);
  };

  const applyDateCorrection = () => {
    if (correctionRow && correctionDate) {
      setDateParseResults(
        dateParseResults.map((r) =>
          r.row === correctionRow.row
            ? {
                ...r,
                parsedValue: format(correctionDate, 'dd.MM.yyyy', { locale: de }),
                status: 'success',
                format: 'DD.MM.YYYY',
              }
            : r
        )
      );
      setShowDateCorrection(false);
      toast.success('Datum korrigiert', {
        description: format(correctionDate, 'dd.MM.yyyy', { locale: de }),
      });
    }
  };

  const successCount = dateParseResults.filter((r) => r.status === 'success').length;
  const warningCount = dateParseResults.filter((r) => r.status === 'warning').length;
  const errorCount = dateParseResults.filter((r) => r.status === 'error').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Kontaktprotokolle importieren</DialogTitle>
          <DialogDescription>Importieren Sie Kontaktprotokolle aus Word-Dokumenten</DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="px-4">
          {/* Mobile: Simple step counter */}
          <div className="sm:hidden text-center">
            <p className="text-sm text-muted-foreground">
              Schritt {step} von {totalSteps}
            </p>
            <Progress value={(step / totalSteps) * 100} className="h-2 mt-2" />
          </div>
          
          {/* Desktop: Full step indicator */}
          <div className="hidden sm:flex items-center justify-between">
            {[
              { num: 1, label: 'Upload', icon: Upload },
              { num: 2, label: 'Tabelle', icon: TableIcon },
              { num: 3, label: 'Zuordnen', icon: FileText },
              { num: 4, label: 'Parsen', icon: CalendarIcon },
              { num: 5, label: 'Kunden', icon: Users },
              { num: 6, label: 'Prüfen', icon: CheckCircle },
              { num: 7, label: 'Import', icon: Cloud },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs ${
                      step > s.num
                        ? 'bg-green-600 text-white'
                        : step === s.num
                        ? 'bg-blue-600 text-white border-2 border-blue-600'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step > s.num ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  {i < 6 && <div className={`h-1 w-6 ${step > s.num ? 'bg-green-600' : 'bg-gray-200'}`} />}
                </div>
              );
            })}
          </div>
        </div>

        <ScrollArea className="max-h-[55vh]">
          <div className="space-y-6 p-4">
            {/* Step 1: File Upload */}
            {step === 1 && (
              <div>
                <h3 className="mb-4">Datei hochladen</h3>
                <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-blue-600 hover:bg-blue-50 transition-colors">
                  <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="mb-2">Word-Dokument hier ablegen</p>
                  <p className="text-sm text-muted-foreground mb-4">oder</p>
                  <Input
                    type="file"
                    accept=".docx,.doc"
                    onChange={handleFileChange}
                    className="max-w-xs mx-auto"
                  />
                  <p className="text-xs text-muted-foreground mt-4">
                    Unterstützte Formate: DOCX, DOC | Maximale Dateigröße: 10 MB
                  </p>
                </div>
                {file && (
                  <Card className="mt-4">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div className="flex-1">
                          <p style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • 1 Tabelle gefunden • 150 Zeilen
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                          Entfernen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Step 4: Date Parsing */}
            {step === 4 && (
              <div>
                <h3 className="mb-4">Datumsparsing</h3>
                <Alert className="mb-4">
                  <CalendarIcon className="h-4 w-4" />
                  <AlertDescription>
                    Das System versucht, Datumsformate automatisch zu erkennen. Bei fehlgeschlagenem Parsing
                    können Sie das Datum manuell korrigieren.
                  </AlertDescription>
                </Alert>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                        {successCount}
                      </p>
                      <p className="text-sm text-muted-foreground">Erfolgreich ✅</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                      <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                        {warningCount}
                      </p>
                      <p className="text-sm text-muted-foreground">Warnungen ⚠️</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <XCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                      <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                        {errorCount}
                      </p>
                      <p className="text-sm text-muted-foreground">Fehler ❌</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Date Parse Results Table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Zeile</th>
                        <th className="p-2 text-left">Originalwert</th>
                        <th className="p-2 text-left">Parsed Wert</th>
                        <th className="p-2 text-left">Format</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Aktion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dateParseResults.map((result) => (
                        <tr key={result.row} className="border-t">
                          <td className="p-2">{result.row}</td>
                          <td className="p-2">{result.originalValue}</td>
                          <td className="p-2">{result.parsedValue || '(leer)'}</td>
                          <td className="p-2 text-muted-foreground">{result.format || '(unbekannt)'}</td>
                          <td className="p-2">
                            {result.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {result.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                            {result.status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
                          </td>
                          <td className="p-2">
                            {result.status === 'error' && (
                              <Button variant="outline" size="sm" onClick={() => handleDateCorrection(result)}>
                                Korrigieren
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Step 5: Customer Assignment */}
            {step === 5 && (
              <div>
                <h3 className="mb-4">Kunden zuordnen</h3>
                <Alert className="mb-4">
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    Ordnen Sie jedem Protokoll einen Kunden zu. Das System kann versuchen, Kunden automatisch aus
                    der Notiz zu erkennen.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <RadioGroup value={customerAssignMode} onValueChange={(v: any) => setCustomerAssignMode(v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id="assign-single" />
                      <Label htmlFor="assign-single">Alle Protokolle einem Kunden zuordnen</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="multiple" id="assign-multiple" />
                      <Label htmlFor="assign-multiple">Kunden pro Zeile zuordnen</Label>
                    </div>
                  </RadioGroup>

                  {customerAssignMode === 'single' && (
                    <div>
                      <Label className="mb-2 block">
                        Kunde auswählen <span className="text-red-600">*</span>
                      </Label>
                      <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                        <SelectTrigger>
                          <SelectValue placeholder="Kunde suchen..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCustomers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                              <Badge variant="outline" className="ml-2">
                                {customer.rating}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center space-x-2 mt-3">
                        <Checkbox id="auto-match" />
                        <Label htmlFor="auto-match">Automatisch Kunden aus Notiz erkennen</Label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="w-full sm:w-auto">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Abbrechen
            </Button>
            {step < totalSteps ? (
              <Button onClick={() => setStep(step + 1)} disabled={step === 1 && !file} className="w-full sm:w-auto">
                Weiter
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button className="w-full sm:w-auto">
                <Upload className="h-4 w-4 mr-2" />
                Import starten
              </Button>
            )}
          </div>
        </DialogFooter>

        {/* Date Correction Dialog */}
        <Dialog open={showDateCorrection} onOpenChange={setShowDateCorrection}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Datum korrigieren</DialogTitle>
              <DialogDescription>Wählen Sie das korrekte Datum aus</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {correctionRow && (
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Originalwert:</p>
                  <p style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>{correctionRow.originalValue}</p>
                </div>
              )}
              <div>
                <Label className="mb-2 block">Korrektes Datum</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {correctionDate ? format(correctionDate, 'dd.MM.yyyy', { locale: de }) : 'Datum wählen'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={correctionDate}
                      onSelect={setCorrectionDate}
                      locale={de}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground mt-2">Format: DD.MM.YYYY (z.B. 15.01.2024)</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDateCorrection(false)}>
                Abbrechen
              </Button>
              <Button onClick={applyDateCorrection} disabled={!correctionDate}>
                Übernehmen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

// Main Demo Component
export function DataImportExportDemo() {
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showProtocolImport, setShowProtocolImport] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Daten Import & Export</h2>
        <p className="text-sm text-muted-foreground">
          Importieren und exportieren Sie Daten in verschiedenen Formaten mit Feldmapping, Validierung und
          Fehlerbehandlung
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowExport(true)}>
          <CardContent className="p-6 text-center">
            <Download className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="mb-2">Daten exportieren</h3>
            <p className="text-sm text-muted-foreground">
              Exportieren Sie Kunden, Kontakte, Protokolle und mehr in CSV, Excel, Word oder DATEV-Format
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowImport(true)}>
          <CardContent className="p-6 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="mb-2">Daten importieren</h3>
            <p className="text-sm text-muted-foreground">
              Importieren Sie Daten aus CSV- oder Excel-Dateien mit automatischem Feldmapping und Validierung
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setShowProtocolImport(true)}
        >
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="mb-2">Protokolle importieren</h3>
            <p className="text-sm text-muted-foreground">
              Importieren Sie Kontaktprotokolle aus Word-Dokumenten mit Tabellenerkennung und Datumsparsing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Funktionen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Export:</strong> CSV, Excel, JSON, DATEV (GoBD-konform), Word (Protokolle)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Import:</strong> CSV, Excel, Word (Protokolle) mit Drag & Drop
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Feldmapping:</strong> Automatische Erkennung und manuelle Zuordnung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Datumsparsing:</strong> Mehrere Formate mit Fallback zu manueller Eingabe
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Kundenzuordnung:</strong> Einzeln oder pro Zeile mit Auto-Match aus Notizen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Validierung:</strong> Pre-Import-Prüfung mit Fehler/Warnung-Reporting
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Duplikatserkennung:</strong> Prüfung vor Import mit Benutzerentscheidung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Fortschrittsanzeige:</strong> Echtzeit-Fortschritt mit Prozentanzeige
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Fehlerbehandlung:</strong> Fehlerprotokoll mit Export-Möglichkeit
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>7-Schritt-Wizard:</strong> Für Protokoll-Import (Upload → Tabelle → Mapping → Parsen →
              Kunden → Validierung → Import)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ExportDialog open={showExport} onOpenChange={setShowExport} />
      <ImportDialog open={showImport} onOpenChange={setShowImport} />
      <ProtocolImportWizard open={showProtocolImport} onOpenChange={setShowProtocolImport} />
    </div>
  );
}
