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
  Send,
  Check,
  XCircle,
  FileCheck,
} from 'lucide-react';

// Offer status type
type OfferStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

// Offer form data
interface OfferFormData {
  offerNumber: string;
  customerName: string;
  opportunityId: string;
  offerDate: string;
  validUntil: string;
  totalAmount: string;
  notes: string;
  status: OfferStatus;
  pdfFile: File | null;
}

// Get status badge
function getStatusBadge(status: OfferStatus) {
  switch (status) {
    case 'draft':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400">
          Entwurf
        </Badge>
      );
    case 'sent':
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400">
          Versendet
        </Badge>
      );
    case 'accepted':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
          Angenommen
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400">
          Abgelehnt
        </Badge>
      );
  }
}

export function OfferForm({ onCancel, onSuccess }: { onCancel?: () => void; onSuccess?: () => void }) {
  const [formData, setFormData] = useState<OfferFormData>({
    offerNumber: 'ANG-2024-0123',
    customerName: '',
    opportunityId: '',
    offerDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    totalAmount: '',
    notes: '',
    status: 'draft',
    pdfFile: null,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof OfferFormData, value: string) => {
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
    setFormData((prev) => ({ ...prev, pdfFile: null }));
    toast.info('PDF entfernt');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName) {
      newErrors.customerName = 'Kunde ist erforderlich';
    }
    if (!formData.totalAmount) {
      newErrors.totalAmount = 'Angebotssumme ist erforderlich';
    } else if (parseFloat(formData.totalAmount) <= 0) {
      newErrors.totalAmount = 'Angebotssumme muss größer als 0 sein';
    }
    if (!formData.validUntil) {
      newErrors.validUntil = 'Gültig bis ist erforderlich';
    }
    if (!formData.pdfFile && formData.status !== 'draft') {
      newErrors.pdfFile = 'PDF ist erforderlich zum Versenden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    toast.success('Entwurf gespeichert', {
      description: `Angebot ${formData.offerNumber}`,
    });
  };

  const handleSend = () => {
    if (!validateForm()) {
      toast.error('Fehler', {
        description: 'Bitte füllen Sie alle erforderlichen Felder aus',
      });
      return;
    }

    setFormData((prev) => ({ ...prev, status: 'sent' }));
    toast.success('Angebot versendet', {
      description: `${formData.offerNumber} an ${formData.customerName}`,
    });
  };

  const handleAccept = () => {
    setFormData((prev) => ({ ...prev, status: 'accepted' }));
    toast.success('Angebot angenommen', {
      description: 'Bereit zur Vertragsumwandlung',
    });
  };

  const handleReject = () => {
    setFormData((prev) => ({ ...prev, status: 'rejected' }));
    toast.error('Angebot abgelehnt', {
      description: formData.offerNumber,
    });
  };

  const handleConvertToContract = () => {
    if (formData.status !== 'accepted') {
      toast.error('Fehler', {
        description: 'Nur angenommene Angebote können in Verträge umgewandelt werden',
      });
      return;
    }

    toast.success('Vertrag erstellt', {
      description: 'Angebot wurde in Vertrag umgewandelt',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2>Angebot erstellen</h2>
          <p className="text-muted-foreground">
            Erstellen Sie ein neues Angebot für einen Kunden
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(formData.status)}
          <span className="font-mono">{formData.offerNumber}</span>
        </div>
      </div>

      {/* Status Info */}
      {formData.status === 'accepted' && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/10">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Dieses Angebot wurde angenommen und kann jetzt in einen Vertrag umgewandelt werden.
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Grundinformationen</CardTitle>
          <CardDescription>Allgemeine Angebotsdetails</CardDescription>
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
              <Label htmlFor="opportunity">Opportunity (Optional)</Label>
              <Select
                value={formData.opportunityId}
                onValueChange={(value) => handleInputChange('opportunityId', value)}
              >
                <SelectTrigger id="opportunity">
                  <SelectValue placeholder="Opportunity verknüpfen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opp-001">OPP-2024-001 - Ladeneinrichtung</SelectItem>
                  <SelectItem value="opp-002">OPP-2024-002 - Kühlsysteme</SelectItem>
                  <SelectItem value="opp-003">OPP-2024-003 - Renovierung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="offerDate">Angebotsdatum</Label>
              <Input
                id="offerDate"
                type="date"
                value={formData.offerDate}
                onChange={(e) => handleInputChange('offerDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validUntil">
                Gültig bis <span className="text-red-600">*</span>
              </Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) => handleInputChange('validUntil', e.target.value)}
                className={errors.validUntil ? 'border-red-600' : ''}
              />
              {errors.validUntil && (
                <p className="text-red-600">{errors.validUntil}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAmount">
                Angebotssumme (€) <span className="text-red-600">*</span>
              </Label>
              <Input
                id="totalAmount"
                type="number"
                placeholder="0,00"
                value={formData.totalAmount}
                onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                className={errors.totalAmount ? 'border-red-600' : ''}
              />
              {errors.totalAmount && (
                <p className="text-red-600">{errors.totalAmount}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notizen (Optional)</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Zusätzliche Anmerkungen zum Angebot..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* PDF Upload */}
      <Card>
        <CardHeader>
          <CardTitle>PDF-Dokument</CardTitle>
          <CardDescription>
            Laden Sie das Angebots-PDF hoch (max. 10 MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!formData.pdfFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : errors.pdfFile
                  ? 'border-red-600 bg-red-50 dark:bg-red-950/10'
                  : 'border-border hover:border-primary'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="mb-2">
                PDF-Datei hierher ziehen oder{' '}
                <label htmlFor="file-upload" className="text-primary cursor-pointer hover:underline">
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
              {errors.pdfFile && (
                <p className="text-red-600 mt-2">{errors.pdfFile}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-accent">
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-primary" />
                <div>
                  <p className="font-medium">{formData.pdfFile.name}</p>
                  <p className="text-muted-foreground">
                    {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {formData.status === 'draft' && (
            <>
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Entwurf speichern
              </Button>
              <Button onClick={handleSend}>
                <Send className="mr-2 h-4 w-4" />
                Angebot versenden
              </Button>
            </>
          )}

          {formData.status === 'sent' && (
            <>
              <Button variant="outline" className="border-green-600 text-green-600" onClick={handleAccept}>
                <Check className="mr-2 h-4 w-4" />
                Als angenommen markieren
              </Button>
              <Button variant="outline" className="border-red-600 text-red-600" onClick={handleReject}>
                <XCircle className="mr-2 h-4 w-4" />
                Als abgelehnt markieren
              </Button>
            </>
          )}

          {formData.status === 'accepted' && (
            <Button onClick={handleConvertToContract}>
              <FileCheck className="mr-2 h-4 w-4" />
              In Vertrag umwandeln
            </Button>
          )}

          {formData.status === 'rejected' && (
            <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/10">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                Dieses Angebot wurde abgelehnt und kann nicht mehr bearbeitet werden.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Button variant="outline" onClick={onCancel}>Abbrechen</Button>
      </div>
    </div>
  );
}

// Demo wrapper
export function OfferFormDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Angebotsformular</CardTitle>
          <CardDescription>
            Formular zum Erstellen und Verwalten von Angeboten mit PDF-Upload und Status-Workflow
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator />

      <OfferForm />
    </div>
  );
}