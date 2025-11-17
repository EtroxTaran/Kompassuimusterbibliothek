import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import {
  FileText,
  Upload,
  X,
  AlertCircle,
  Save,
  Lock,
  FileCheck,
  Shield,
} from 'lucide-react';

// Contract status type
type ContractStatus = 'draft' | 'signed' | 'in_progress' | 'completed';

// Contract form data
interface ContractFormData {
  contractNumber: string;
  customerName: string;
  offerId: string;
  projectId: string;
  contractDate: string;
  orderValue: number;
  budget: number;
  notes: string;
  status: ContractStatus;
  pdfFile: File | null;
  isGoBDLocked: boolean;
}

// Get status badge
function getStatusBadge(status: ContractStatus, isGoBDLocked: boolean) {
  switch (status) {
    case 'draft':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400">
          Entwurf
        </Badge>
      );
    case 'signed':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
          {isGoBDLocked && <Lock className="mr-1 h-3 w-3" />}
          Unterzeichnet
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400">
          {isGoBDLocked && <Lock className="mr-1 h-3 w-3" />}
          In Bearbeitung
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-950/20 dark:text-gray-400">
          {isGoBDLocked && <Lock className="mr-1 h-3 w-3" />}
          Abgeschlossen
        </Badge>
      );
  }
}

export function ContractForm() {
  const [formData, setFormData] = useState<ContractFormData>({
    contractNumber: 'VER-2024-0089',
    customerName: '',
    offerId: '',
    projectId: '',
    contractDate: new Date().toISOString().split('T')[0],
    orderValue: 0,
    budget: 0,
    notes: '',
    status: 'draft',
    pdfFile: null,
    isGoBDLocked: false,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ContractFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Fehler', {
        description: 'Nur PDF-Dateien sind erlaubt',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error('Fehler', {
        description: 'Datei ist zu groß (max. 10 MB)',
      });
      return;
    }

    setFormData((prev) => ({ ...prev, pdfFile: file }));
    toast.success('PDF hochgeladen', {
      description: file.name,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    if (formData.isGoBDLocked) {
      toast.error('Fehler', {
        description: 'GoBD-geschützte Verträge können nicht geändert werden',
      });
      return;
    }
    setFormData((prev) => ({ ...prev, pdfFile: null }));
    toast.info('PDF entfernt');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName) {
      newErrors.customerName = 'Kunde ist erforderlich';
    }
    if (!formData.orderValue || formData.orderValue <= 0) {
      newErrors.orderValue = 'Auftragswert muss größer als 0 sein';
    }
    if (!formData.budget || formData.budget <= 0) {
      newErrors.budget = 'Budget muss größer als 0 sein';
    }
    if (!formData.pdfFile && formData.status !== 'draft') {
      newErrors.pdfFile = 'PDF ist erforderlich für Unterzeichnung';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    toast.success('Entwurf gespeichert', {
      description: `Vertrag ${formData.contractNumber}`,
    });
  };

  const handleSign = () => {
    if (!validateForm()) {
      toast.error('Fehler', {
        description: 'Bitte füllen Sie alle erforderlichen Felder aus',
      });
      return;
    }

    setFormData((prev) => ({ ...prev, status: 'signed', isGoBDLocked: true }));
    toast.success('Vertrag unterzeichnet', {
      description: 'GoBD-Schutz aktiviert - Vertrag ist jetzt unveränderlich',
    });
  };

  const handleStartProgress = () => {
    if (formData.status !== 'signed') {
      toast.error('Fehler', {
        description: 'Nur unterzeichnete Verträge können in Bearbeitung gesetzt werden',
      });
      return;
    }

    setFormData((prev) => ({ ...prev, status: 'in_progress' }));
    toast.success('Projekt gestartet', {
      description: formData.contractNumber,
    });
  };

  const handleComplete = () => {
    if (formData.status !== 'in_progress') {
      toast.error('Fehler', {
        description: 'Nur Verträge in Bearbeitung können abgeschlossen werden',
      });
      return;
    }

    setFormData((prev) => ({ ...prev, status: 'completed' }));
    toast.success('Vertrag abgeschlossen', {
      description: formData.contractNumber,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2>Vertrag erstellen</h2>
          <p className="text-muted-foreground">
            Erstellen Sie einen neuen Vertrag (Auftragsbestätigung)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(formData.status, formData.isGoBDLocked)}
          <span className="font-mono">{formData.contractNumber}</span>
        </div>
      </div>

      {/* GoBD Lock Notice */}
      {formData.isGoBDLocked && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/10">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-600" />
            <span>
              Dieser Vertrag ist GoBD-konform finalisiert und kann nicht mehr bearbeitet werden.
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Grundinformationen</CardTitle>
          <CardDescription>Allgemeine Vertragsdetails</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">
                Kunde <span className="text-red-600">*</span>
              </Label>
              <Select
                value={formData.customerName}
                onValueChange={(value) => handleInputChange('customerName', value)}
                disabled={formData.isGoBDLocked}
              >
                <SelectTrigger id="customer" className={errors.customerName ? 'border-red-600' : ''}>
                  <SelectValue placeholder="Kunde auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REWE München Süd">REWE München Süd</SelectItem>
                  <SelectItem value="Hofladen Müller GmbH">Hofladen Müller GmbH</SelectItem>
                  <SelectItem value="Bäckerei Schmidt">Bäckerei Schmidt</SelectItem>
                  <SelectItem value="Café Müller">Café Müller</SelectItem>
                </SelectContent>
              </Select>
              {errors.customerName && (
                <p className="text-red-600">{errors.customerName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="offer">Angebot (Optional)</Label>
              <Select
                value={formData.offerId}
                onValueChange={(value) => handleInputChange('offerId', value)}
                disabled={formData.isGoBDLocked}
              >
                <SelectTrigger id="offer">
                  <SelectValue placeholder="Angebot verknüpfen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ang-001">ANG-2024-0123 - REWE München</SelectItem>
                  <SelectItem value="ang-002">ANG-2024-0122 - Hofladen Müller</SelectItem>
                  <SelectItem value="ang-003">ANG-2024-0121 - Bäckerei Schmidt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">Projekt (Optional)</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => handleInputChange('projectId', value)}
                disabled={formData.isGoBDLocked}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Projekt verknüpfen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proj-001">P-2024-B023 - REWE München</SelectItem>
                  <SelectItem value="proj-002">P-2024-M012 - Hofladen Müller</SelectItem>
                  <SelectItem value="proj-003">P-2024-K008 - Bäckerei Schmidt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractDate">Vertragsdatum</Label>
              <Input
                id="contractDate"
                type="date"
                value={formData.contractDate}
                onChange={(e) => handleInputChange('contractDate', e.target.value)}
                disabled={formData.isGoBDLocked}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderValue">
                Auftragswert (€) <span className="text-red-600">*</span>
              </Label>
              <Input
                id="orderValue"
                type="number"
                placeholder="0,00"
                value={formData.orderValue || ''}
                onChange={(e) => handleInputChange('orderValue', parseFloat(e.target.value) || 0)}
                className={errors.orderValue ? 'border-red-600' : ''}
                disabled={formData.isGoBDLocked}
              />
              {errors.orderValue && (
                <p className="text-red-600">{errors.orderValue}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">
                Budget (€) <span className="text-red-600">*</span>
              </Label>
              <Input
                id="budget"
                type="number"
                placeholder="0,00"
                value={formData.budget || ''}
                onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                className={errors.budget ? 'border-red-600' : ''}
                disabled={formData.isGoBDLocked}
              />
              {errors.budget && (
                <p className="text-red-600">{errors.budget}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notizen (Optional)</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Zusätzliche Anmerkungen zum Vertrag..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              disabled={formData.isGoBDLocked}
            />
          </div>
        </CardContent>
      </Card>

      {/* PDF Upload */}
      <Card>
        <CardHeader>
          <CardTitle>PDF-Dokument</CardTitle>
          <CardDescription>
            Laden Sie die Auftragsbestätigung als PDF hoch (max. 10 MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!formData.pdfFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                formData.isGoBDLocked
                  ? 'border-muted bg-muted/50 cursor-not-allowed'
                  : isDragging
                  ? 'border-primary bg-primary/5'
                  : errors.pdfFile
                  ? 'border-red-600 bg-red-50 dark:bg-red-950/10'
                  : 'border-border hover:border-primary'
              }`}
              onDrop={formData.isGoBDLocked ? undefined : handleDrop}
              onDragOver={formData.isGoBDLocked ? undefined : handleDragOver}
              onDragLeave={formData.isGoBDLocked ? undefined : handleDragLeave}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {formData.isGoBDLocked ? (
                <p className="text-muted-foreground">GoBD-geschützt - Keine Änderungen möglich</p>
              ) : (
                <>
                  <p className="mb-2">
                    PDF-Datei hierher ziehen oder{' '}
                    <label
                      htmlFor="file-upload"
                      className="text-primary cursor-pointer hover:underline"
                    >
                      durchsuchen
                    </label>
                  </p>
                  <p className="text-muted-foreground">Maximale Dateigröße: 10 MB</p>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </>
              )}
              {errors.pdfFile && (
                <p className="text-red-600 mt-2">{errors.pdfFile}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-accent">
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{formData.pdfFile.name}</p>
                    {formData.isGoBDLocked && (
                      <Lock className="h-4 w-4 text-green-600" title="GoBD-geschützt" />
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!formData.isGoBDLocked && (
                <Button variant="ghost" size="sm" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {formData.status === 'draft' && !formData.isGoBDLocked && (
            <>
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Entwurf speichern
              </Button>
              <Button onClick={handleSign}>
                <FileCheck className="mr-2 h-4 w-4" />
                Unterzeichnen & GoBD-Schutz
              </Button>
            </>
          )}

          {formData.status === 'signed' && (
            <Button onClick={handleStartProgress}>
              <FileText className="mr-2 h-4 w-4" />
              Projekt starten
            </Button>
          )}

          {formData.status === 'in_progress' && (
            <Button onClick={handleComplete}>
              <FileCheck className="mr-2 h-4 w-4" />
              Als abgeschlossen markieren
            </Button>
          )}

          {formData.status === 'completed' && (
            <Alert className="border-gray-200 bg-gray-50 dark:border-gray-900 dark:bg-gray-950/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Dieser Vertrag ist abgeschlossen.</AlertDescription>
            </Alert>
          )}
        </div>

        <Button variant="outline">Abbrechen</Button>
      </div>
    </div>
  );
}

// Demo wrapper
export function ContractFormDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vertragsformular</CardTitle>
          <CardDescription>
            Formular zum Erstellen und Verwalten von Verträgen mit GoBD-Schutz nach Unterzeichnung
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator />

      <ContractForm />
    </div>
  );
}