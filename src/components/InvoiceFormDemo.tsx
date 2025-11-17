import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { RichTextEditor } from './RichTextEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
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
  FileText,
  Building2,
  Calendar,
  Plus,
  Trash2,
  Lock,
  AlertTriangle,
  Save,
  Check,
  Printer,
  Mail,
  ExternalLink,
} from 'lucide-react';

// User role type
type UserRole = 'GF' | 'BUCH' | 'PLAN' | 'ADM';

// Line item type
interface LineItem {
  id: string;
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  vatRate: string;
}

// Customers
const customers = [
  { id: '1', name: 'Hofladen Müller GmbH', vatId: 'DE123456789' },
  { id: '2', name: 'REWE München', vatId: 'DE987654321' },
  { id: '3', name: 'Edeka Süd', vatId: 'DE456789123' },
];

// Projects
const projects = [
  { id: '1', customerId: '1', code: 'P-2024-B023', name: 'Ladeneinrichtung München' },
  { id: '2', customerId: '2', code: 'P-2024-B024', name: 'REWE München Süd' },
];

// Calculate line item total
function calculateLineTotal(quantity: string, unitPrice: string): number {
  const qty = parseFloat(quantity) || 0;
  const price = parseFloat(unitPrice) || 0;
  return qty * price;
}

// Calculate subtotal
function calculateSubtotal(lineItems: LineItem[]): number {
  return lineItems.reduce((sum, item) => {
    return sum + calculateLineTotal(item.quantity, item.unitPrice);
  }, 0);
}

// Calculate VAT
function calculateVAT(lineItems: LineItem[], rate: string): number {
  return lineItems
    .filter((item) => item.vatRate === rate)
    .reduce((sum, item) => {
      const total = calculateLineTotal(item.quantity, item.unitPrice);
      return sum + (total * parseFloat(rate)) / 100;
    }, 0);
}

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

// Full Invoice Form
function InvoiceForm({ currentUserRole = 'BUCH', initialStatus = 'draft' }: { currentUserRole?: UserRole; initialStatus?: 'draft' | 'finalized' }) {
  const [invoiceNumber] = useState('R-2024-00456');
  const [status, setStatus] = useState<'draft' | 'finalized'>(initialStatus);
  const [customerId, setCustomerId] = useState('1');
  const [projectId, setProjectId] = useState('1');
  const [invoiceDate, setInvoiceDate] = useState('2024-11-15');
  const [dueDate, setDueDate] = useState('2024-12-15');
  const [paymentTerm, setPaymentTerm] = useState('30');
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('amount');
  const [bankAccount, setBankAccount] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [notes, setNotes] = useState('');
  const [understoodImmutability, setUnderstoodImmutability] = useState(false);
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false);
  const [lastSaved, setLastSaved] = useState('14:30');

  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: '1',
      description: 'Ladeneinrichtung Komplett',
      quantity: '1',
      unit: 'psch',
      unitPrice: '50000',
      vatRate: '19',
    },
    {
      id: '2',
      description: 'Montagearbeiten',
      quantity: '40',
      unit: 'std',
      unitPrice: '85',
      vatRate: '19',
    },
  ]);

  const isReadOnly = status === 'finalized' || currentUserRole === 'ADM';
  const canFinalize = currentUserRole === 'GF' || currentUserRole === 'BUCH';

  // Add line item
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: '1',
      unit: 'stk',
      unitPrice: '0',
      vatRate: '19',
    };
    setLineItems([...lineItems, newItem]);
  };

  // Remove line item
  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  // Update line item
  const updateLineItem = (id: string, field: keyof LineItem, value: string) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Calculate totals
  const subtotal = calculateSubtotal(lineItems);
  const vat19 = calculateVAT(lineItems, '19');
  const vat7 = calculateVAT(lineItems, '7');
  const discountAmount =
    discountType === 'percent'
      ? (subtotal * parseFloat(discount || '0')) / 100
      : parseFloat(discount || '0');
  const total = subtotal + vat19 + vat7 - discountAmount;

  // Save as draft
  const saveDraft = () => {
    const now = new Date();
    setLastSaved(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
    toast.success('Als Entwurf gespeichert');
  };

  // Finalize invoice
  const finalizeInvoice = () => {
    setStatus('finalized');
    setShowFinalizeDialog(false);
    toast.success(`Rechnung ${invoiceNumber} wurde finalisiert`, {
      description: 'SHA-256 Hash wurde erstellt',
    });
  };

  // Get available projects for selected customer
  const availableProjects = projects.filter((p) => p.customerId === customerId);

  return (
    <div className="space-y-6">
      {/* Invoice Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Invoice Number & Status */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground mb-2 block">Rechnungsnummer</Label>
                <div className="bg-accent/50 border border-accent rounded-lg p-4 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-2xl font-bold text-primary">{invoiceNumber}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Automatisch generiert (GoBD-konform, unveränderlich)
                      {status === 'finalized' && (
                        <span className="inline-flex items-center gap-1 ml-2">
                          <Lock className="h-3 w-3" />
                          Finalisiert
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <Badge variant={status === 'finalized' ? 'default' : 'secondary'} className="gap-1">
                  {status === 'finalized' && <Lock className="h-3 w-3" />}
                  {status === 'finalized' ? 'Abgeschlossen' : 'Entwurf'}
                </Badge>
              </div>
            </div>

            {/* Customer & Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">
                  Kunde <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Select value={customerId} onValueChange={setCustomerId} disabled={isReadOnly}>
                    <SelectTrigger id="customer" className="pl-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.vatId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Zugehöriges Projekt</Label>
                <div className="flex gap-2">
                  <Select value={projectId} onValueChange={setProjectId} disabled={isReadOnly}>
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Kein Projekt" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.code} - {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {projectId && (
                    <Button variant="outline" size="icon" disabled={isReadOnly}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ordnen Sie diese Rechnung einem Projekt zu
                </p>
              </div>
            </div>

            {/* Dates & Payment Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-date">
                  Rechnungsdatum <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="invoice-date"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="pl-10"
                    disabled={isReadOnly}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  GoBD: max. 7 Tage rückdatiert
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">
                  Fälligkeitsdatum <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="pl-10"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-term">Zahlungsziel</Label>
                <Select value={paymentTerm} onValueChange={setPaymentTerm} disabled={isReadOnly}>
                  <SelectTrigger id="payment-term">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sofort</SelectItem>
                    <SelectItem value="7">7 Tage</SelectItem>
                    <SelectItem value="14">14 Tage</SelectItem>
                    <SelectItem value="30">30 Tage</SelectItem>
                    <SelectItem value="60">60 Tage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Rechnungspositionen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Pos.</TableHead>
                    <TableHead className="min-w-[250px]">Bezeichnung</TableHead>
                    <TableHead className="w-24">Menge</TableHead>
                    <TableHead className="w-28">Einheit</TableHead>
                    <TableHead className="w-32">Einzelpreis</TableHead>
                    <TableHead className="w-32">Gesamtpreis</TableHead>
                    <TableHead className="w-24">MwSt.</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item, index) => {
                    const lineTotal = calculateLineTotal(item.quantity, item.unitPrice);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                            placeholder="Artikelbezeichnung oder Leistung"
                            disabled={isReadOnly}
                            className="border-0 shadow-none focus-visible:ring-0"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                            placeholder="1"
                            disabled={isReadOnly}
                            className="border-0 shadow-none focus-visible:ring-0"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.unit}
                            onValueChange={(value) => updateLineItem(item.id, 'unit', value)}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger className="border-0 shadow-none focus:ring-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="stk">Stk</SelectItem>
                              <SelectItem value="m2">m²</SelectItem>
                              <SelectItem value="lfm">lfm</SelectItem>
                              <SelectItem value="std">Std</SelectItem>
                              <SelectItem value="psch">Psch</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="relative">
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(item.id, 'unitPrice', e.target.value)}
                              placeholder="0,00"
                              disabled={isReadOnly}
                              className="border-0 shadow-none focus-visible:ring-0 pr-6"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              €
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(lineTotal)}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.vatRate}
                            onValueChange={(value) => updateLineItem(item.id, 'vatRate', value)}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger className="border-0 shadow-none focus:ring-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="19">19%</SelectItem>
                              <SelectItem value="7">7%</SelectItem>
                              <SelectItem value="0">0%</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLineItem(item.id)}
                            disabled={isReadOnly || lineItems.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {!isReadOnly && (
              <Button variant="outline" onClick={addLineItem} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Position hinzufügen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Zahlungsinformationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-account">Bankverbindung</Label>
                  <Select value={bankAccount} onValueChange={setBankAccount} disabled={isReadOnly}>
                    <SelectTrigger id="bank-account">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sparkasse München - DE89 7015 0000 1234 5678 90</SelectItem>
                      <SelectItem value="2">Deutsche Bank - DE89 7007 0010 0987 6543 21</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method">Zahlungsart</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={isReadOnly}>
                    <SelectTrigger id="payment-method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transfer">Überweisung</SelectItem>
                      <SelectItem value="debit">Lastschrift</SelectItem>
                      <SelectItem value="cash">Bar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes / Remarks with GoBD Lock */}
              <RichTextEditor
                id="notes"
                label="Bemerkungen"
                value={notes}
                onChange={setNotes}
                placeholder="Zusätzliche Hinweise für die Rechnung..."
                minHeight={100}
                maxLength={500}
                toolbar="basic"
                disabled={isReadOnly}
                locked={status === 'finalized'}
              />
            </CardContent>
          </Card>

          {/* GoBD Immutability Warning */}
          {status === 'draft' && canFinalize && (
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription>
                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                  Hinweis zur Unveränderlichkeit
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                  Nach der Finalisierung kann diese Rechnung gemäß GoBD-Vorschriften nicht mehr
                  geändert werden. Nur die Geschäftsführung kann Korrekturen vornehmen.
                </p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="understood"
                    checked={understoodImmutability}
                    onCheckedChange={(checked) => setUnderstoodImmutability(checked as boolean)}
                  />
                  <Label
                    htmlFor="understood"
                    className="text-sm text-amber-900 dark:text-amber-100 cursor-pointer"
                  >
                    Ich verstehe, dass die Rechnung nach Finalisierung unveränderlich ist
                  </Label>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Calculation Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-muted/50 sticky top-6">
            <CardHeader>
              <CardTitle>Berechnung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zwischensumme (netto)</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>

              {vat19 > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MwSt. 19%</span>
                  <span className="font-medium">{formatCurrency(vat19)}</span>
                </div>
              )}

              {vat7 > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MwSt. 7%</span>
                  <span className="font-medium">{formatCurrency(vat7)}</span>
                </div>
              )}

              {/* Discount */}
              <div className="space-y-2">
                <Label htmlFor="discount">Rabatt</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="discount"
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="0"
                      disabled={isReadOnly}
                    />
                  </div>
                  <Select
                    value={discountType}
                    onValueChange={(value) => setDiscountType(value as 'amount' | 'percent')}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amount">€</SelectItem>
                      <SelectItem value="percent">%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rabatt</span>
                    <span className="text-destructive">- {formatCurrency(discountAmount)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-baseline bg-accent/50 p-3 rounded-lg">
                <span className="font-semibold">Gesamtsumme (brutto)</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {status === 'draft' && `Als Entwurf gespeichert: ${lastSaved} Uhr`}
              {status === 'finalized' && (
                <span className="flex items-center gap-1 text-green-600">
                  <Check className="h-4 w-4" />
                  Finalisiert und unveränderlich
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {status === 'draft' && (
                <>
                  <Button variant="outline" onClick={saveDraft} disabled={isReadOnly}>
                    <Save className="mr-2 h-4 w-4" />
                    Als Entwurf speichern
                  </Button>
                  <Button variant="outline">Abbrechen</Button>
                  {canFinalize && (
                    <Button
                      onClick={() => setShowFinalizeDialog(true)}
                      disabled={!understoodImmutability}
                    >
                      Rechnung finalisieren
                    </Button>
                  )}
                </>
              )}
              {status === 'finalized' && (
                <>
                  <Button variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Drucken
                  </Button>
                  <Button variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Per E-Mail senden
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Finalization Dialog */}
      <AlertDialog open={showFinalizeDialog} onOpenChange={setShowFinalizeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <AlertDialogTitle>Rechnung finalisieren?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              Diese Rechnung wird abgeschlossen und kann anschließend nicht mehr geändert werden.
              Ein SHA-256 Hash wird zur Manipulationserkennung erstellt. Möchten Sie fortfahren?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={finalizeInvoice}>Ja, finalisieren</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Static Invoice Example (Finalized)
function FinalizedInvoiceExample() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Finalisierte Rechnung (Nur-Lesen-Ansicht)</h4>

      <InvoiceForm currentUserRole="BUCH" initialStatus="finalized" />

      <p className="text-sm text-muted-foreground">
        Nach Finalisierung: Alle Felder nur lesbar, Schloss-Icons, Drucken/E-Mail-Buttons verfügbar
      </p>
    </div>
  );
}

// Line Item Calculation Demo
function LineItemCalculationDemo() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Positionsberechnung</h4>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Echtzeitberechnung</CardTitle>
          <CardDescription>
            Gesamtpreis, MwSt. und Endsumme werden automatisch berechnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3 text-sm font-medium border-b pb-2">
              <div>Bezeichnung</div>
              <div>Berechnung</div>
              <div>MwSt.</div>
              <div className="text-right">Ergebnis</div>
            </div>

            <div className="grid grid-cols-4 gap-3 text-sm">
              <div>Ladeneinrichtung</div>
              <div className="text-muted-foreground">1 × 50.000 €</div>
              <div className="text-muted-foreground">19%</div>
              <div className="text-right font-medium">50.000,00 €</div>
            </div>

            <div className="grid grid-cols-4 gap-3 text-sm">
              <div>Montage</div>
              <div className="text-muted-foreground">40 × 85 €</div>
              <div className="text-muted-foreground">19%</div>
              <div className="text-right font-medium">3.400,00 €</div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zwischensumme (netto)</span>
                <span className="font-medium">53.400,00 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">MwSt. 19%</span>
                <span className="font-medium">10.146,00 €</span>
              </div>
              <div className="flex justify-between items-baseline bg-accent/50 p-2 rounded">
                <span className="font-semibold">Gesamtsumme</span>
                <span className="text-xl font-bold text-primary">63.546,00 €</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Alle Berechnungen erfolgen in Echtzeit während der Dateneingabe
      </p>
    </div>
  );
}

// GoBD Compliance Features
function GoBDComplianceDemo() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">GoBD-Konformität</h4>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Auto-generated Invoice Number */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Automatische Rechnungsnummer</CardTitle>
            <CardDescription>GoBD-konform, fortlaufend, unveränderlich</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-accent/50 border border-accent rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div className="text-xl font-bold text-primary">R-2024-00456</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Format: R-YYYY-##### (Jahr + fortlaufende Nummer)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Date Validation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datumsvalidierung</CardTitle>
            <CardDescription>Max. 7 Tage Rückdatierung erlaubt</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <p className="text-sm font-medium mb-1">GoBD-Anforderung</p>
                <p className="text-xs text-muted-foreground">
                  Rechnungsdatum muss innerhalb der letzten 7 Tage liegen, um
                  manipulationssichere Dokumentation zu gewährleisten.
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* SHA-256 Hash */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">SHA-256 Hash</CardTitle>
            <CardDescription>Manipulationserkennung bei Finalisierung</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-green-600" />
                <span className="font-medium">Hash erstellt bei Finalisierung</span>
              </div>
              <div className="bg-muted p-2 rounded text-xs font-mono break-all">
                a7f3d2e8b9c1f4e6d5a8b7c9...
              </div>
              <p className="text-xs text-muted-foreground">
                Hash wird zur Integritätsprüfung verwendet
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Immutability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Unveränderlichkeit</CardTitle>
            <CardDescription>Nach Finalisierung keine Änderungen möglich</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="default" className="gap-1">
                <Lock className="h-3 w-3" />
                Abgeschlossen
              </Badge>
              <p className="text-sm text-muted-foreground">
                Alle Felder sind nur lesbar. Nur GF kann Korrekturrechnungen erstellen.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">
        GoBD-Konformität durch automatische Nummerierung, Datumsvalidierung, Hash-Erstellung und
        Unveränderlichkeit
      </p>
    </div>
  );
}

// RBAC Access Control
function RBACAccessDemo() {
  const roles: { role: UserRole; description: string }[] = [
    { role: 'GF', description: 'Geschäftsführung - Voller Zugriff, kann finalisieren' },
    { role: 'BUCH', description: 'Buchhaltung - Voller Zugriff, kann finalisieren' },
    { role: 'PLAN', description: 'Planung - Kann Entwürfe erstellen, nicht finalisieren' },
    { role: 'ADM', description: 'Außendienst - Nur Lesezugriff' },
  ];

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Rollenbasierter Zugriff</h4>

      <div className="grid gap-4">
        {roles.map(({ role, description }) => (
          <Card key={role}>
            <CardHeader>
              <CardTitle className="text-base">Rolle: {role}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Rechnung erstellen</span>
                  <Badge variant={role === 'ADM' ? 'secondary' : 'default'}>
                    {role === 'ADM' ? 'Nein' : 'Ja'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Rechnung finalisieren</span>
                  <Badge variant={role === 'GF' || role === 'BUCH' ? 'default' : 'secondary'}>
                    {role === 'GF' || role === 'BUCH' ? 'Ja' : 'Nein'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Entwürfe bearbeiten</span>
                  <Badge variant={role === 'ADM' ? 'secondary' : 'default'}>
                    {role === 'ADM' ? 'Nein' : 'Ja'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Unterschiedliche Zugriffsrechte basierend auf Benutzerrolle und GoBD-Anforderungen
      </p>
    </div>
  );
}

export function InvoiceFormDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Vollständiges Rechnungsformular</CardTitle>
          <CardDescription>
            GoBD-konforme Rechnungserstellung mit Positionen, Steuerberechnung und
            Unveränderlichkeit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceForm currentUserRole="BUCH" initialStatus="draft" />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Finalisierte Rechnung</CardTitle>
          <CardDescription>
            Nur-Lesen-Ansicht nach Finalisierung mit Schloss-Indikatoren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FinalizedInvoiceExample />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Positionsberechnung</CardTitle>
          <CardDescription>
            Echtzeitberechnung von Zwischensumme, MwSt. und Gesamtsumme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineItemCalculationDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GoBD-Konformität</CardTitle>
          <CardDescription>
            Automatische Nummerierung, Datumsvalidierung, Hash-Erstellung und Unveränderlichkeit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoBDComplianceDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rollenbasierter Zugriff</CardTitle>
          <CardDescription>
            Zugriffsrechte basierend auf Benutzerrolle (GF, BUCH, PLAN, ADM)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RBACAccessDemo />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Formular-Layout</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Vollseiten-Layout (komplex)</li>
              <li>• 2-Spalten-Header</li>
              <li>• Vollbreite Positionstabelle</li>
              <li>• Sticky Berechnungskarte</li>
              <li>• Sticky Footer mit Buttons</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Pflichtfelder</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Kunde *</li>
              <li>• Rechnungsdatum *</li>
              <li>• Fälligkeitsdatum *</li>
              <li>• Mind. 1 Position</li>
              <li>• Alle Positionen vollständig</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Positionstabelle</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Bezeichnung: Text</li>
              <li>• Menge: Zahl</li>
              <li>• Einheit: Select</li>
              <li>• Einzelpreis: Zahl + €</li>
              <li>• Gesamtpreis: Berechnet</li>
              <li>• MwSt.: 19% / 7% / 0%</li>
              <li>• Löschen: Trash Icon</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Berechnung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Zwischensumme (netto)</li>
              <li>• MwSt. 19% / 7%</li>
              <li>• Rabatt (€ oder %)</li>
              <li>• Gesamtsumme (brutto)</li>
              <li>• Echtzeit-Update</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">GoBD-Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Auto-Rechnungsnummer</li>
              <li>• Max. 7 Tage Rückdatierung</li>
              <li>• SHA-256 Hash</li>
              <li>• Unveränderlichkeit</li>
              <li>• Finalisierungs-Dialog</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">RBAC-Regeln</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• GF: Voller Zugriff</li>
              <li>• BUCH: Voller Zugriff</li>
              <li>• PLAN: Nur Entwürfe</li>
              <li>• ADM: Nur Lesen</li>
              <li>• Finalisierung: GF/BUCH</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}