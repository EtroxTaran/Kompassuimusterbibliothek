import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import {
  Upload,
  FileText,
  Download,
  Trash2,
  Check,
  X,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Save,
  Users,
} from 'lucide-react';

// Sample CSV data
const sampleData = [
  { row: 1, company: 'Hofladen Müller GmbH', vat: 'DE123456789', street: 'Hauptstraße 15', zip: '80331', city: 'München', email: 'info@hofladen-mueller.de', phone: '+49-89-1234567' },
  { row: 2, company: 'REWE Köln', vat: 'DE987654321', street: 'Kölner Straße 50', zip: '50667', city: 'Köln', email: 'kontakt@rewe-koeln.de', phone: '+49-221-7654321' },
  { row: 3, company: 'Bäckerei Schmidt KG', vat: 'DE456789123', street: 'Brotweg 8', zip: '10115', city: 'Berlin', email: 'info@schmidt-baecker.de', phone: '+49-30-9876543' },
  { row: 45, company: 'A', vat: '', street: '', zip: '', city: '', email: '', phone: '' },
  { row: 78, company: 'Cafe Latte GmbH', vat: 'DE789123456', street: 'Kaffeeplatz 3', zip: '60311', city: 'Frankfurt', email: 'invalid-email', phone: '+49-69-3456789' },
];

// Field mapping options
const targetFields = [
  { value: 'none', label: '-- Nicht zuordnen --' },
  { value: 'company', label: 'Firmenname *' },
  { value: 'vat', label: 'Umsatzsteuer-ID' },
  { value: 'street', label: 'Straße *' },
  { value: 'zip', label: 'PLZ *' },
  { value: 'city', label: 'Stadt *' },
  { value: 'email', label: 'E-Mail' },
  { value: 'phone', label: 'Telefon' },
];

// Validation results
const validationResults = [
  { row: 1, status: 'valid', company: 'Hofladen Müller GmbH', message: '', icon: 'check' },
  { row: 2, status: 'valid', company: 'REWE Köln', message: '', icon: 'check' },
  { row: 3, status: 'valid', company: 'Bäckerei Schmidt KG', message: '', icon: 'check' },
  { row: 45, status: 'error', company: 'A', message: 'Firmenname zu kurz (min. 2 Zeichen)', icon: 'x' },
  { row: 78, status: 'warning', company: 'Cafe Latte GmbH', message: 'E-Mail-Format ungültig (wird übersprungen)', icon: 'warning' },
];

// Step Progress Indicator
function StepProgress({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: 'Datei hochladen' },
    { number: 2, label: 'Felder zuordnen' },
    { number: 3, label: 'Daten validieren' },
    { number: 4, label: 'Importieren' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step.number < currentStep
                    ? 'bg-primary border-primary text-primary-foreground'
                    : step.number === currentStep
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-background border-border text-muted-foreground'
                }`}
              >
                {step.number < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span
                className={`mt-2 text-sm text-center ${
                  step.number === currentStep ? 'font-medium' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 -mt-8 ${
                  step.number < currentStep ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 1: File Upload
function FileUploadStep({
  onNext,
  selectedFile,
  setSelectedFile,
}: {
  onNext: () => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      setSelectedFile(file);
      toast.success('Datei hochgeladen', {
        description: `${file.name} erfolgreich hochgeladen.`,
      });
    } else {
      toast.error('Ungültiges Dateiformat', {
        description: 'Bitte wählen Sie eine CSV- oder Excel-Datei.',
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success('Datei hochgeladen');
    }
  };

  const downloadTemplate = () => {
    toast.success('Vorlage wird heruntergeladen');
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border bg-muted/30'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h4 className="mb-2">CSV- oder Excel-Datei hier ablegen</h4>
            <p className="text-sm text-muted-foreground mb-4">oder</p>
            <label htmlFor="file-upload">
              <Button variant="outline" asChild>
                <span>Datei auswählen</span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={handleFileSelect}
            />
            <p className="text-xs text-muted-foreground mt-4">
              Maximale Dateigröße: 10 MB | Formate: .csv, .xlsx
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Button variant="link" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              CSV-Vorlage herunterladen
            </Button>
          </div>
        </>
      ) : (
        <div className="border border-border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <FileText className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <h4 className="mb-1">{selectedFile.name}</h4>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                <span>500 Zeilen erkannt</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedFile(null);
                toast.info('Datei entfernt');
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <Button variant="outline" className="mt-4" onClick={() => setSelectedFile(null)}>
            Andere Datei auswählen
          </Button>
        </div>
      )}
    </div>
  );
}

// Step 2: Field Mapping
function FieldMappingStep() {
  const [mappings, setMappings] = useState<Record<string, string>>({
    'Company Name': 'company',
    'VAT Number': 'vat',
    'Street': 'street',
    'Postal Code': 'zip',
    'City': 'city',
    'Email': 'email',
    'Phone': 'phone',
  });

  const requiredFields = ['company', 'street', 'zip', 'city'];
  const mappedRequiredFields = Object.values(mappings).filter((v) =>
    requiredFields.includes(v)
  );
  const unmappedRequired = requiredFields.filter(
    (f) => !mappedRequiredFields.includes(f)
  );

  return (
    <div className="space-y-6">
      {unmappedRequired.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {unmappedRequired.length} Pflichtfelder noch nicht zugeordnet
          </AlertDescription>
        </Alert>
      )}

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">CSV-Spalte</TableHead>
              <TableHead className="w-[35%]">Vorschau</TableHead>
              <TableHead className="w-[35%]">KOMPASS-Feld</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(mappings).map((csvColumn, index) => (
              <TableRow key={csvColumn}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {mappings[csvColumn] !== 'none' && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                    <span>{csvColumn}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {index === 0 && 'Hofladen Müller GmbH'}
                  {index === 1 && 'DE123456789'}
                  {index === 2 && 'Hauptstraße 15'}
                  {index === 3 && '80331'}
                  {index === 4 && 'München'}
                  {index === 5 && 'info@hofladen-mueller.de'}
                  {index === 6 && '+49-89-1234567'}
                </TableCell>
                <TableCell>
                  <Select
                    value={mappings[csvColumn]}
                    onValueChange={(value) =>
                      setMappings({ ...mappings, [csvColumn]: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {targetFields.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border border-border rounded-lg p-4">
        <h4 className="mb-3">Pflichtfelder</h4>
        <div className="grid grid-cols-2 gap-2">
          {targetFields
            .filter((f) => f.label.includes('*'))
            .map((field) => {
              const isMapped = Object.values(mappings).includes(field.value);
              return (
                <div key={field.value} className="flex items-center gap-2">
                  {isMapped ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                  <span
                    className={`text-sm ${
                      isMapped ? 'text-green-600' : 'text-destructive'
                    }`}
                  >
                    {field.label}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// Step 3: Data Validation
function DataValidationStep() {
  const [filter, setFilter] = useState<'all' | 'valid' | 'error' | 'warning'>('all');
  const [skipInvalid, setSkipInvalid] = useState(true);
  const [importWarnings, setImportWarnings] = useState(true);
  const [editingRow, setEditingRow] = useState<number | null>(null);

  const validCount = validationResults.filter((r) => r.status === 'valid').length;
  const errorCount = validationResults.filter((r) => r.status === 'error').length;
  const warningCount = validationResults.filter((r) => r.status === 'warning').length;

  const filteredResults = validationResults.filter((result) => {
    if (filter === 'all') return true;
    return result.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Validation Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center ${
                errorCount > 0 ? 'bg-amber-100' : 'bg-green-100'
              }`}
            >
              {errorCount > 0 ? (
                <AlertCircle className="h-6 w-6 text-amber-600" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="mb-2">
                {validCount} von {validationResults.length} Zeilen gültig
              </h4>
              <Progress
                value={(validCount / validationResults.length) * 100}
                className="mb-3"
              />
              <div className="flex gap-6 text-sm">
                <span className="text-green-600 font-medium">
                  {validCount} Gültig
                </span>
                <span className="text-destructive font-medium">
                  {errorCount} Fehler
                </span>
                <span className="text-amber-600 font-medium">
                  {warningCount} Warnungen
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Alle ({validationResults.length})
        </Button>
        <Button
          variant={filter === 'valid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('valid')}
        >
          Gültig ({validCount})
        </Button>
        <Button
          variant={filter === 'error' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('error')}
        >
          Fehler ({errorCount})
        </Button>
        <Button
          variant={filter === 'warning' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('warning')}
        >
          Warnungen ({warningCount})
        </Button>
      </div>

      {/* Validation Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Zeile</TableHead>
              <TableHead className="w-[80px]">Status</TableHead>
              <TableHead>Firmenname</TableHead>
              <TableHead>Fehler/Warnungen</TableHead>
              <TableHead className="w-[120px]">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.map((result) => (
              <TableRow key={result.row}>
                <TableCell>{result.row}</TableCell>
                <TableCell>
                  {result.status === 'valid' && (
                    <Check className="h-5 w-5 text-green-600" />
                  )}
                  {result.status === 'error' && (
                    <X className="h-5 w-5 text-destructive" />
                  )}
                  {result.status === 'warning' && (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  )}
                </TableCell>
                <TableCell>
                  {editingRow === result.row ? (
                    <Input
                      defaultValue={result.company}
                      className="h-8"
                    />
                  ) : (
                    result.company
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`text-sm ${
                      result.status === 'error'
                        ? 'text-destructive'
                        : result.status === 'warning'
                        ? 'text-amber-600'
                        : ''
                    }`}
                  >
                    {result.message}
                  </span>
                </TableCell>
                <TableCell>
                  {result.status === 'error' && (
                    <>
                      {editingRow === result.row ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingRow(null);
                            toast.success('Zeile aktualisiert');
                          }}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Speichern
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingRow(result.row)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Bearbeiten
                        </Button>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="skip-invalid"
            checked={skipInvalid}
            onCheckedChange={(checked) => setSkipInvalid(checked as boolean)}
          />
          <label
            htmlFor="skip-invalid"
            className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ungültige Zeilen überspringen
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="import-warnings"
            checked={importWarnings}
            onCheckedChange={(checked) => setImportWarnings(checked as boolean)}
          />
          <label
            htmlFor="import-warnings"
            className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Zeilen mit Warnungen importieren
          </label>
        </div>
      </div>
    </div>
  );
}

// Step 4: Import Progress & Completion
function ImportStep({ isComplete }: { isComplete: boolean }) {
  const [progress, setProgress] = useState(45);

  if (!isComplete) {
    return (
      <div className="space-y-6 py-12">
        <div className="flex flex-col items-center">
          {/* Circular Progress Simulation */}
          <div className="relative h-40 w-40 mb-6">
            <svg className="transform -rotate-90 w-40 h-40">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * progress) / 100}
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-medium">{progress}%</span>
            </div>
          </div>

          <h4 className="mb-2">225 von 500 Kunden importiert ({progress}%)</h4>
          <Progress value={progress} className="w-full max-w-md mb-4" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Wird importiert...</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Geschätzte verbleibende Zeit: 1 Minute
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => toast.info('Import wird abgebrochen...')}
          >
            Abbrechen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8">
      <div className="flex flex-col items-center">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="mb-2">Import abgeschlossen!</h3>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-medium">
                450 Kunden erfolgreich importiert
              </span>
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-destructive font-medium">
                50 Zeilen übersprungen (Fehler)
              </span>
              <X className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-amber-600 font-medium">
                20 Zeilen mit Warnungen importiert
              </span>
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => toast.success('Fehlerprotokoll wird heruntergeladen')}
        >
          <Download className="mr-2 h-4 w-4" />
          Fehlerprotokoll herunterladen
        </Button>
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline">Weiteren Import starten</Button>
        <Button>Importierte Kunden anzeigen</Button>
      </div>
    </div>
  );
}

// Full Import Wizard
function ImportWizard() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImportComplete, setIsImportComplete] = useState(false);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImport = () => {
    toast.info('Import wird gestartet...');
    setTimeout(() => {
      setIsImportComplete(true);
    }, 2000);
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setIsImportComplete(false);
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Vollständiger Import-Assistent</h4>

      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetWizard();
        }
      }}>
        <DialogTrigger asChild>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Kunden importieren
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Kunden importieren</DialogTitle>
                <DialogDescription>
                  Schritt {currentStep} von 4
                </DialogDescription>
              </div>
              <Button variant="link" size="sm">
                <HelpCircle className="mr-2 h-4 w-4" />
                Importanleitung
              </Button>
            </div>
          </DialogHeader>

          <StepProgress currentStep={currentStep} />

          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <FileUploadStep
                onNext={handleNext}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            )}
            {currentStep === 2 && <FieldMappingStep />}
            {currentStep === 3 && <DataValidationStep />}
            {currentStep === 4 && <ImportStep isComplete={isImportComplete} />}
          </div>

          {!isImportComplete && (
            <DialogFooter>
              <div className="flex justify-between w-full">
                <div>
                  {currentStep > 1 && currentStep < 4 && (
                    <Button variant="outline" onClick={handleBack}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Zurück
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Abbrechen
                  </Button>
                  {currentStep < 3 && (
                    <Button
                      onClick={handleNext}
                      disabled={currentStep === 1 && !selectedFile}
                    >
                      Weiter
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {currentStep === 3 && (
                    <Button onClick={handleImport}>
                      <Users className="mr-2 h-4 w-4" />
                      450 Kunden importieren
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <p className="text-sm text-muted-foreground">
        4-Schritte-Assistent: Hochladen → Zuordnen → Validieren → Importieren
      </p>
    </div>
  );
}

// Individual Step Demos
function FileUploadDemo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Schritt 1: Datei hochladen</h4>

      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          toast.success('Datei hochgeladen');
        }}
      >
        <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h4 className="mb-2">CSV- oder Excel-Datei hier ablegen</h4>
        <p className="text-sm text-muted-foreground mb-4">oder</p>
        <Button variant="outline">Datei auswählen</Button>
        <p className="text-xs text-muted-foreground mt-4">
          Maximale Dateigröße: 10 MB | Formate: .csv, .xlsx
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Drag-and-Drop-Zone mit Alternativbutton und Größenbeschränkung
      </p>
    </div>
  );
}

function FieldMappingDemo() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Schritt 2: Felder zuordnen</h4>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          3 Pflichtfelder noch nicht zugeordnet
        </AlertDescription>
      </Alert>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CSV-Spalte</TableHead>
              <TableHead>Vorschau</TableHead>
              <TableHead>KOMPASS-Feld</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Company Name</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                Hofladen Müller GmbH
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Firmenname *</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Street</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                Hauptstraße 15
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Straße *</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Email</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                info@example.de
              </TableCell>
              <TableCell>
                <Select defaultValue="none">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Nicht zuordnen --</SelectItem>
                    <SelectItem value="email">E-Mail</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Automatische Zuordnung mit manueller Korrekturmöglichkeit
      </p>
    </div>
  );
}

function ValidationDemo() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Schritt 3: Daten validieren</h4>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="mb-2">450 von 500 Zeilen gültig</h4>
              <Progress value={90} className="mb-3" />
              <div className="flex gap-6 text-sm">
                <span className="text-green-600 font-medium">450 Gültig</span>
                <span className="text-destructive font-medium">50 Fehler</span>
                <span className="text-amber-600 font-medium">20 Warnungen</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Zeile</TableHead>
              <TableHead className="w-20">Status</TableHead>
              <TableHead>Firmenname</TableHead>
              <TableHead>Fehler/Warnungen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>
                <Check className="h-5 w-5 text-green-600" />
              </TableCell>
              <TableCell>Hofladen Müller GmbH</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>45</TableCell>
              <TableCell>
                <X className="h-5 w-5 text-destructive" />
              </TableCell>
              <TableCell>A</TableCell>
              <TableCell className="text-sm text-destructive">
                Firmenname zu kurz (min. 2 Zeichen)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>78</TableCell>
              <TableCell>
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </TableCell>
              <TableCell>Cafe Latte GmbH</TableCell>
              <TableCell className="text-sm text-amber-600">
                E-Mail-Format ungültig (wird übersprungen)
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Validierungsergebnisse mit Fehler- und Warnungsanzeige
      </p>
    </div>
  );
}

function ImportProgressDemo() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Schritt 4: Import-Fortschritt</h4>

      <div className="border border-border rounded-lg p-8">
        <div className="flex flex-col items-center">
          <div className="relative h-32 w-32 mb-6">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={352}
                strokeDashoffset={352 - (352 * 45) / 100}
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-medium">45%</span>
            </div>
          </div>

          <h4 className="mb-2">225 von 500 Kunden importiert (45%)</h4>
          <Progress value={45} className="w-full max-w-md mb-4" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Wird importiert...</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Kreisförmiger und linearer Fortschritt mit Zeitschätzung
      </p>
    </div>
  );
}

function CompletionDemo() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Import abgeschlossen</h4>

      <div className="border border-border rounded-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h3>Import abgeschlossen!</h3>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-medium">
                  450 Kunden erfolgreich importiert
                </span>
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-destructive font-medium">
                  50 Zeilen übersprungen (Fehler)
                </span>
                <X className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-600 font-medium">
                  20 Zeilen mit Warnungen importiert
                </span>
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">
        Zusammenfassung mit Erfolgs-, Fehler- und Warnungsstatistik
      </p>
    </div>
  );
}

export function BulkImportFormDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Vollständiger Import-Assistent</CardTitle>
          <CardDescription>
            4-Schritte-Wizard für CSV/Excel-Import mit Feldmapping und Validierung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImportWizard />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Schritt 1: Datei hochladen</CardTitle>
          <CardDescription>
            Drag-and-Drop oder Dateiauswahl mit Vorlagendownload
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schritt 2: Felder zuordnen</CardTitle>
          <CardDescription>
            CSV-Spalten den KOMPASS-Feldern zuordnen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldMappingDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schritt 3: Daten validieren</CardTitle>
          <CardDescription>
            Validierungsergebnisse mit Fehler- und Warnungsanzeige
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ValidationDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schritt 4a: Import-Fortschritt</CardTitle>
          <CardDescription>
            Fortschrittsanzeige während des Imports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImportProgressDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schritt 4b: Import abgeschlossen</CardTitle>
          <CardDescription>
            Erfolgsmeldung mit Zusammenfassung und Fehlerprotokoll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompletionDemo />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Wizard-Schritte</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 4 Schritte mit Fortschrittsanzeige</li>
              <li>• Kreise: Aktuell (blau), Fertig (✓), Ausstehend (grau)</li>
              <li>• Verbindungslinien: Blau/Grau</li>
              <li>• Schritt-Labels unter Kreisen</li>
              <li>• Navigation: Zurück/Weiter</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Datei-Upload</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Drag-and-Drop-Zone (gestrichelt)</li>
              <li>• Upload-Icon 64px</li>
              <li>• Alternativ: "Datei auswählen"</li>
              <li>• Max: 10 MB (.csv, .xlsx)</li>
              <li>• Vorlage zum Download</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Feldmapping</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 3 Spalten: CSV / Vorschau / Feld</li>
              <li>• Auto-Mapping mit ✓ (grün)</li>
              <li>• Pflichtfelder mit * markiert</li>
              <li>• Dropdowns für Zuordnung</li>
              <li>• Alert bei fehlenden Pflichtfeldern</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Validierung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Zusammenfassungskarte mit Icon</li>
              <li>• Fortschrittsbalken (grün/rot)</li>
              <li>• Statistik: Gültig/Fehler/Warnungen</li>
              <li>• Tabelle mit Status-Icons</li>
              <li>• Inline-Bearbeitung bei Fehlern</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Import-Fortschritt</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Kreisförmiger Fortschritt (zentral)</li>
              <li>• Prozentanzeige in Kreis</li>
              <li>• Linearer Fortschrittsbalken</li>
              <li>• Status: "X von Y importiert"</li>
              <li>• Zeitschätzung anzeigen</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Abschluss</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Großes Checkmark-Icon (grün)</li>
              <li>• Titel: "Import abgeschlossen!"</li>
              <li>• Detaillierte Statistik</li>
              <li>• Fehlerprotokoll-Download</li>
              <li>• Aktionen: Anzeigen/Neu/Schließen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}