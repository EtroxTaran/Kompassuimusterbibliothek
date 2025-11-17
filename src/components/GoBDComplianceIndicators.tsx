import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { toast } from 'sonner@2.0.3';
import {
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Edit3,
  XCircle,
  Copy,
  History,
  CheckCircle2,
  AlertTriangle,
  Database,
  Key,
  FileDown,
  Archive,
  Eye,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Types
type DocumentStatus = 'draft' | 'finalized' | 'corrected' | 'cancelled';
type UserRole = 'GF' | 'BUCH' | 'PLAN' | 'ADM' | 'KALK' | 'INNEN';

interface InvoiceData {
  number: string;
  status: DocumentStatus;
  finalizedAt?: Date;
  hash?: string;
  hashVerified?: boolean;
  lastHashCheck?: Date;
  correctedAt?: Date;
  correctedBy?: string;
  cancelledAt?: Date;
  correctionInvoice?: string;
  auditLogEntries?: number;
  archiveUntil?: Date;
}

// Mock invoice data
const mockInvoice: InvoiceData = {
  number: 'R-2024-00456',
  status: 'finalized',
  finalizedAt: new Date('2024-11-15T16:45:00'),
  hash: 'a3b5c7d9e1f2a3b5c7d9e1f2a3b5c7d9e1f2a3b5c7d9e1f2a3b5c7d9e1f2a3b5',
  hashVerified: true,
  lastHashCheck: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  auditLogEntries: 124,
  archiveUntil: new Date('2034-11-15'),
};

// Get status badge configuration
function getStatusBadgeConfig(status: DocumentStatus) {
  switch (status) {
    case 'draft':
      return {
        label: 'Entwurf',
        icon: Edit3,
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        tooltip: 'Kann noch bearbeitet werden',
      };
    case 'finalized':
      return {
        label: 'Finalisiert',
        icon: Lock,
        className: 'bg-green-100 text-green-800 border-green-200',
        tooltip: 'GoBD-konform gesichert - Unveränderlich',
      };
    case 'corrected':
      return {
        label: 'Korrigiert',
        icon: ShieldCheck,
        className: 'bg-amber-100 text-amber-800 border-amber-200',
        tooltip: 'GoBD-konforme Korrektur durch GF',
      };
    case 'cancelled':
      return {
        label: 'Storniert',
        icon: XCircle,
        className: 'bg-red-100 text-red-800 border-red-200',
        tooltip: 'Storniert am 15.11.2024 - Korrekturrechnung: R-2024-00457',
      };
  }
}

// Format timestamp
function formatTimestamp(date: Date): string {
  return format(date, "dd.MM.yyyy, HH:mm 'Uhr'", { locale: de });
}

// Format date only
function formatDate(date: Date): string {
  return format(date, 'dd.MM.yyyy', { locale: de });
}

// Get relative time
function getRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Gerade eben';
  if (minutes < 60) return `Vor ${minutes} Minute${minutes > 1 ? 'n' : ''}`;
  if (hours < 24) return `Vor ${hours} Stunde${hours > 1 ? 'n' : ''}`;
  return `Vor ${days} Tag${days > 1 ? 'en' : ''}`;
}

// Copy to clipboard
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success('In Zwischenablage kopiert', {
    description: 'Hash wurde kopiert',
  });
}

// GoBD Status Badge Component
export function GoBDStatusBadge({ status }: { status: DocumentStatus }) {
  const config = getStatusBadgeConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className} title={config.tooltip}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}

// Immutability Warning Banner Component
export function ImmutabilityWarningBanner({ invoice }: { invoice: InvoiceData }) {
  if (invoice.status !== 'finalized' && invoice.status !== 'corrected') {
    return null;
  }

  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Lock className="h-5 w-5 text-blue-600" />
      <AlertTitle className="text-blue-900">
        Diese Rechnung ist gemäß GoBD unveränderlich
      </AlertTitle>
      <AlertDescription className="text-blue-800">
        <p className="mb-2">
          Finalisiert am {invoice.finalizedAt && formatTimestamp(invoice.finalizedAt)}
        </p>
        <Button
          variant="link"
          size="sm"
          className="p-0 h-auto text-blue-700 hover:text-blue-900"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Änderungsverlauf anzeigen
        </Button>
      </AlertDescription>
    </Alert>
  );
}

// Hash Verification Component
export function HashVerificationCard({ invoice }: { invoice: InvoiceData }) {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsVerifying(false);

    // Simulate success
    toast.success('Hash stimmt überein', {
      description: 'Daten sind unverändert',
      icon: <CheckCircle2 className="h-5 w-5" />,
    });
  };

  if (invoice.status === 'draft') {
    return null;
  }

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          GoBD-Integrität
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hash Display */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">SHA-256 Hash</Label>
          <div className="flex items-center gap-2 p-3 bg-background border border-border rounded-lg">
            <code className="flex-1 text-sm font-mono truncate">{invoice.hash}</code>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 shrink-0"
              onClick={() => copyToClipboard(invoice.hash || '')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm">Integrität verifiziert</span>
        </div>

        {/* Last Check */}
        <div className="text-sm text-muted-foreground">
          Zuletzt geprüft: {invoice.lastHashCheck && getRelativeTime(invoice.lastHashCheck)}
        </div>

        {/* Verify Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full"
        >
          {isVerifying ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Verifiziere Integrität...
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Jetzt prüfen
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Change Log Link Component
export function ChangeLogLink({ invoice }: { invoice: InvoiceData }) {
  return (
    <Card className="hover:border-primary transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <History className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="mb-0.5">Änderungsprotokoll</p>
              <p className="text-sm text-muted-foreground">{invoice.auditLogEntries} Einträge</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Protokoll anzeigen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// GoBD Compliance Dashboard Component
export function GoBDComplianceDashboard() {
  const [showNonCompliant, setShowNonCompliant] = useState(false);

  return (
    <div className="space-y-6">
      {/* Non-Compliant Alert */}
      {showNonCompliant && (
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>GoBD-Konformität gefährdet</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mb-3 space-y-1">
              <li>3 Rechnungen ohne Hash</li>
              <li>1 Backup fehlt</li>
              <li>2 Änderungen ohne Protokoll</li>
            </ul>
            <Button variant="destructive" size="sm">
              Jetzt beheben
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliant Documents */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Konforme Dokumente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-green-600">452 von 452 (100%)</p>
              <p className="text-xs text-muted-foreground">Alle Rechnungen GoBD-konform</p>
            </div>
          </CardContent>
        </Card>

        {/* Hash Integrity */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Key className="h-4 w-4 text-green-600" />
              Hash-Integrität
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Alle Hashes gültig</span>
              </div>
              <p className="text-xs text-muted-foreground">Letzte Prüfung: Vor 1 Stunde</p>
            </div>
          </CardContent>
        </Card>

        {/* Audit Trail */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <History className="h-4 w-4 text-blue-600" />
              Audit Trail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-blue-600">1.248 Einträge</p>
              <p className="text-xs text-muted-foreground">Lückenlos protokolliert</p>
            </div>
          </CardContent>
        </Card>

        {/* Backup Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Database className="h-4 w-4 text-green-600" />
              Backup-Status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Aktuell</span>
              </div>
              <p className="text-xs text-muted-foreground">Letztes Backup: Vor 2 Stunden</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>GoBD-Anforderungen</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="requirements" className="border-0">
              <AccordionTrigger>Alle Anforderungen erfüllt (6/6)</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                {[
                  'Unveränderbarkeit nach Finalisierung',
                  'Lückenlose Protokollierung aller Änderungen',
                  'Maschinelle Auswertbarkeit (DATEV-Export)',
                  'Nachvollziehbarkeit (Audit Trail)',
                  'Archivierung (10 Jahre)',
                  'Datensicherung (täglich)',
                ].map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    <span className="text-sm">{requirement}</span>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Demo Toggle */}
      <Button variant="outline" onClick={() => setShowNonCompliant(!showNonCompliant)}>
        {showNonCompliant ? 'Fehler ausblenden' : 'Fehler simulieren'}
      </Button>
    </div>
  );
}

// Finalization Dialog Component
export function FinalizationDialog({
  isOpen,
  onClose,
  invoiceNumber,
}: {
  isOpen: boolean;
  onClose: () => void;
  invoiceNumber: string;
}) {
  const [checks, setChecks] = useState({
    dataCorrect: false,
    numberUnique: false,
    customerVerified: false,
  });

  const allChecked = checks.dataCorrect && checks.numberUnique && checks.customerVerified;

  const handleFinalize = () => {
    if (!allChecked) {
      toast.error('Bitte alle Bestätigungen aktivieren', {
        description: 'Sie müssen alle Checkboxen aktivieren, um fortzufahren',
      });
      return;
    }

    // Simulate finalization
    toast.success('Rechnung finalisiert', {
      description: 'GoBD-konform gesichert',
      icon: <Lock className="h-5 w-5" />,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <DialogTitle className="text-center">Rechnung finalisieren</DialogTitle>
          <DialogDescription className="text-center">
            ACHTUNG: Diese Aktion kann nicht rückgängig gemacht werden!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning Details */}
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Die Rechnung wird GoBD-konform gesichert</li>
                <li>Alle Felder werden unveränderlich</li>
                <li>Ein SHA-256-Hash wird erstellt</li>
                <li>Änderungen sind nur durch GF mit Korrekturprotokoll möglich</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Separator />

          {/* Confirmation Checklist */}
          <div className="space-y-4">
            <Label>Bitte bestätigen Sie:</Label>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="data-correct"
                  checked={checks.dataCorrect}
                  onCheckedChange={(checked) =>
                    setChecks({ ...checks, dataCorrect: !!checked })
                  }
                />
                <Label htmlFor="data-correct" className="cursor-pointer leading-normal">
                  Alle Rechnungsdaten sind korrekt
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="number-unique"
                  checked={checks.numberUnique}
                  onCheckedChange={(checked) =>
                    setChecks({ ...checks, numberUnique: !!checked })
                  }
                />
                <Label htmlFor="number-unique" className="cursor-pointer leading-normal">
                  Rechnungsnummer ist eindeutig: <code className="font-mono">{invoiceNumber}</code>
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="customer-verified"
                  checked={checks.customerVerified}
                  onCheckedChange={(checked) =>
                    setChecks({ ...checks, customerVerified: !!checked })
                  }
                />
                <Label htmlFor="customer-verified" className="cursor-pointer leading-normal">
                  Kunde und Beträge sind geprüft
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            variant="destructive"
            onClick={handleFinalize}
            disabled={!allChecked}
          >
            <Lock className="h-4 w-4 mr-2" />
            Jetzt finalisieren
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Correction Dialog Component (GF Only)
export function CorrectionDialog({
  isOpen,
  onClose,
  userRole,
}: {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}) {
  const [newValue, setNewValue] = useState('63.460,00');
  const [reason, setReason] = useState('');

  const handleCorrect = () => {
    if (reason.length < 10) {
      toast.error('Grund zu kurz', {
        description: 'Bitte geben Sie mindestens 10 Zeichen ein',
      });
      return;
    }

    toast.success('Korrektur durchgeführt', {
      description: 'GoBD-konform protokolliert',
      icon: <ShieldCheck className="h-5 w-5" />,
    });
    onClose();
  };

  if (userRole !== 'GF') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="border-b-2 border-amber-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle>GoBD-konforme Korrektur</DialogTitle>
              <DialogDescription>Nur für Geschäftsführung autorisiert</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Value */}
          <div>
            <Label className="mb-2 block">Aktueller Wert</Label>
            <div className="p-3 bg-muted rounded-lg">
              <p>Rechnungsbetrag: <span className="font-mono">€ 63.046,00</span></p>
            </div>
          </div>

          {/* New Value */}
          <div>
            <Label htmlFor="new-value" className="mb-2 block">
              Neuer Betrag
            </Label>
            <div className="flex items-center gap-2">
              <span>€</span>
              <Input
                id="new-value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <Label htmlFor="reason" className="mb-2 block">
              Grund der Korrektur <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="z.B. Tippfehler in Rechnungsbetrag"
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Mindestens 10 Zeichen ({reason.length}/10)
            </p>
          </div>

          {/* GF Approval */}
          <div>
            <Label className="mb-2 block">Genehmigt durch</Label>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-purple-900">Dr. Schmidt (GF)</p>
            </div>
          </div>

          {/* Warning */}
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Diese Korrektur wird im Änderungsprotokoll festgehalten</li>
                <li>Original-Hash bleibt erhalten</li>
                <li>Neuer Korrektur-Eintrag wird erstellt</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            className="bg-amber-600 hover:bg-amber-700"
            onClick={handleCorrect}
            disabled={reason.length < 10}
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            Korrektur durchführen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Archive Indicator Component
export function ArchiveIndicator({ archiveUntil }: { archiveUntil: Date }) {
  return (
    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
      <Archive className="h-3 w-3 mr-1" />
      Archiviert bis {formatDate(archiveUntil)} (10 Jahre)
    </Badge>
  );
}

// DATEV Export Component
export function DATEVExportCard() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsExporting(false);

    toast.success('DATEV-Export erstellt', {
      description: 'DATEV_Q4_2024_GoBD.csv wurde heruntergeladen',
      icon: <FileDown className="h-5 w-5" />,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileDown className="h-5 w-5" />
          DATEV-Export
        </CardTitle>
        <CardDescription>GoBD-konformer Export für Steuerberater</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Export-Optionen</Label>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Rechnungen (aktuelles Quartal)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Änderungsprotokolle</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Hashes und Signaturen</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm">
            <span className="text-muted-foreground">Format:</span> CSV (DATEV-kompatibel)
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Dateiname:</span>{' '}
            <code className="text-xs">DATEV_Q4_2024_GoBD.csv</code>
          </p>
        </div>

        <Button onClick={handleExport} disabled={isExporting} className="w-full">
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exportiere...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4 mr-2" />
              DATEV-Export starten
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Invoice Card with GoBD Indicators
export function InvoiceCardWithGoBD({ invoice }: { invoice: InvoiceData }) {
  const statusConfig = getStatusBadgeConfig(invoice.status);

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <code className="text-2xl font-mono">{invoice.number}</code>
              <GoBDStatusBadge status={invoice.status} />
            </div>
            {invoice.status === 'finalized' && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Integrität verifiziert</span>
              </div>
            )}
          </div>
          {invoice.status === 'finalized' && (
            <Lock className="h-6 w-6 text-gray-400" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Kunde</p>
            <p>Hofladen Müller GmbH</p>
          </div>
          <div>
            <p className="text-muted-foreground">Betrag</p>
            <p className="font-mono">€ 63.460,00</p>
          </div>
          <div>
            <p className="text-muted-foreground">Datum</p>
            <p>{invoice.finalizedAt && formatDate(invoice.finalizedAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Fälligkeit</p>
            <p>15.12.2024</p>
          </div>
        </div>

        {invoice.archiveUntil && (
          <div className="pt-2">
            <ArchiveIndicator archiveUntil={invoice.archiveUntil} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Demo Component
export function GoBDComplianceIndicatorsDemo() {
  const [showFinalizationDialog, setShowFinalizationDialog] = useState(false);
  const [showCorrectionDialog, setShowCorrectionDialog] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('BUCH');

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => setShowFinalizationDialog(true)}>
                Finalisierungs-Dialog öffnen
              </Button>
              <Button
                onClick={() => setShowCorrectionDialog(true)}
                variant="outline"
                disabled={userRole !== 'GF'}
              >
                Korrektur-Dialog öffnen (GF only)
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Label>Demo-Rolle:</Label>
              <div className="flex gap-2">
                {(['GF', 'BUCH', 'ADM'] as UserRole[]).map((role) => (
                  <Button
                    key={role}
                    variant={userRole === role ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUserRole(role)}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 bg-muted/50">
              <h3 className="mb-4">Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Status-Badges (Draft/Finalized/Corrected/Cancelled)</li>
                  <li>• Immutability Warning Banner (Blue)</li>
                  <li>• Hash Verification Card mit SHA-256</li>
                  <li>• Copy-to-Clipboard für Hash</li>
                  <li>• Hash Verification Button (Live-Prüfung)</li>
                  <li>• Change Log Link (Audit Trail)</li>
                  <li>• GoBD Compliance Dashboard</li>
                  <li>• 4 KPI-Cards (Documents/Hash/Audit/Backup)</li>
                  <li>• Compliance Checklist (6 Anforderungen)</li>
                  <li>• Non-Compliant Alert (Fehler-Demo)</li>
                </ul>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Finalization Dialog mit 3 Checkboxen</li>
                  <li>• Warning: "Nicht rückgängig machbar"</li>
                  <li>• Correction Dialog (GF-only, RBAC)</li>
                  <li>• Grund-Eingabe (min. 10 Zeichen)</li>
                  <li>• GF Approval Display</li>
                  <li>• Archive Indicator (10 Jahre)</li>
                  <li>• DATEV Export Card</li>
                  <li>• Export-Optionen (Rechnungen/Protokolle/Hashes)</li>
                  <li>• Invoice Card mit GoBD-Status</li>
                  <li>• Relative Time ("Vor 2 Minuten")</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Badge Examples */}
      <Card>
        <CardHeader>
          <CardTitle>GoBD Status-Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <GoBDStatusBadge status="draft" />
            <GoBDStatusBadge status="finalized" />
            <GoBDStatusBadge status="corrected" />
            <GoBDStatusBadge status="cancelled" />
          </div>
        </CardContent>
      </Card>

      {/* Sample Invoice */}
      <InvoiceCardWithGoBD invoice={mockInvoice} />

      {/* Immutability Banner */}
      <ImmutabilityWarningBanner invoice={mockInvoice} />

      {/* Hash Verification */}
      <HashVerificationCard invoice={mockInvoice} />

      {/* Change Log */}
      <ChangeLogLink invoice={mockInvoice} />

      {/* DATEV Export */}
      <DATEVExportCard />

      {/* Compliance Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>GoBD Compliance Dashboard</CardTitle>
          <CardDescription>Nur für GF/BUCH Rollen</CardDescription>
        </CardHeader>
        <CardContent>
          <GoBDComplianceDashboard />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <FinalizationDialog
        isOpen={showFinalizationDialog}
        onClose={() => setShowFinalizationDialog(false)}
        invoiceNumber={mockInvoice.number}
      />

      <CorrectionDialog
        isOpen={showCorrectionDialog}
        onClose={() => setShowCorrectionDialog(false)}
        userRole={userRole}
      />
    </div>
  );
}
