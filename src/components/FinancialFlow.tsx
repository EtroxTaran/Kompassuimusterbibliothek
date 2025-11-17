import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner@2.0.3';
import {
  FileText,
  Send,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  Plus,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  AlertCircle,
  Package,
  CreditCard,
  ExternalLink,
  Target,
} from 'lucide-react';

// Types
type DocumentType = 'offer' | 'contract' | 'invoice';
type OfferStatus = 'draft' | 'sent' | 'negotiation' | 'accepted' | 'rejected' | 'expired';
type ContractStatus = 'processing' | 'partial' | 'completed' | 'cancelled';
type InvoiceStatus = 'draft' | 'sent' | 'partial_paid' | 'paid' | 'overdue';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Offer {
  id: string;
  number: string;
  customer: string;
  date: string;
  validUntil: string;
  validityDays: number;
  status: OfferStatus;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
}

interface Contract {
  id: string;
  number: string;
  offerId: string;
  offerNumber: string;
  customer: string;
  date: string;
  status: ContractStatus;
  items: LineItem[];
  total: number;
}

interface Invoice {
  id: string;
  number: string;
  contractId: string;
  contractNumber: string;
  customer: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  type: 'full' | 'partial' | 'final';
  percentage?: number;
  total: number;
}

// Flow Indicator Component
function FlowIndicator({ currentStep }: { currentStep: DocumentType }) {
  const steps = [
    { id: 'offer' as DocumentType, label: '1) Angebot', number: 1 },
    { id: 'contract' as DocumentType, label: '2) Auftrag', number: 2 },
    { id: 'invoice' as DocumentType, label: '3) Rechnung', number: 3 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div
              className={`flex-1 h-9 px-4 rounded-full flex items-center justify-center transition-colors ${
                index <= currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <span className="text-sm">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-4 flex items-center justify-center">
                <span className="text-muted-foreground">→</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Offer Form Component
function OfferForm({ onSubmit }: { onSubmit?: (offer: Partial<Offer>) => void }) {
  const [validityDays, setValidityDays] = useState(30);
  const [items, setItems] = useState<LineItem[]>([]);
  const [showItemDialog, setShowItemDialog] = useState(false);

  const calculateValidUntil = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('de-DE');
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.19;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="space-y-6">
      <FlowIndicator currentStep="offer" />

      <Card>
        <CardHeader>
          <CardTitle>Neues Angebot erstellen</CardTitle>
          <CardDescription>Erstellen Sie ein Angebot für einen Kunden</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Document Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Angebotsnummer</Label>
              <Input value="A-2025-00123" disabled className="mt-2 bg-muted" />
              <p className="text-xs text-muted-foreground mt-1">(automatisch generiert)</p>
            </div>
            <div>
              <Label>Datum</Label>
              <div className="relative mt-2">
                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Customer Selection */}
          <div>
            <Label>Kunde *</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Kunde auswählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hm">Hofladen Müller GmbH</SelectItem>
                <SelectItem value="rewe">REWE München</SelectItem>
                <SelectItem value="edeka">Edeka Schwabing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Validity Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Gültigkeitsdauer</Label>
              <Select value={validityDays.toString()} onValueChange={(v) => setValidityDays(parseInt(v))}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="14">14 Tage</SelectItem>
                  <SelectItem value="30">30 Tage</SelectItem>
                  <SelectItem value="60">60 Tage</SelectItem>
                  <SelectItem value="90">90 Tage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Gültig bis</Label>
              <Input value={calculateValidUntil(validityDays)} disabled className="mt-2 bg-muted" />
            </div>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select defaultValue="draft">
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Entwurf</SelectItem>
                <SelectItem value="sent">Versendet</SelectItem>
                <SelectItem value="negotiation">In Verhandlung</SelectItem>
                <SelectItem value="accepted">Angenommen → Auftrag</SelectItem>
                <SelectItem value="rejected">Abgelehnt</SelectItem>
                <SelectItem value="expired">Abgelaufen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Positionen</Label>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Position hinzufügen
              </Button>
            </div>

            {items.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Beschreibung</TableHead>
                      <TableHead className="w-24">Menge</TableHead>
                      <TableHead className="w-32">Einzelpreis</TableHead>
                      <TableHead className="w-32">Gesamt</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input placeholder="Beschreibung..." />
                        </TableCell>
                        <TableCell>
                          <Input type="number" defaultValue={item.quantity} />
                        </TableCell>
                        <TableCell>
                          <Input type="number" defaultValue={item.unitPrice} />
                        </TableCell>
                        <TableCell>
                          <span>€ {item.total.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-8 bg-muted rounded-lg">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Keine Positionen hinzugefügt</p>
              </div>
            )}
          </div>

          {/* Totals */}
          {items.length > 0 && (
            <div className="flex justify-end">
              <div className="w-full md:w-1/2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zwischensumme:</span>
                  <span>€ {subtotal.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MwSt. (19%):</span>
                  <span>€ {tax.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span>Gesamtsumme:</span>
                  <span>€ {total.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label>Interne Notizen</Label>
            <Textarea placeholder="Notizen..." className="mt-2" rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline">
          Entwurf speichern
        </Button>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Angebot versenden
        </Button>
      </div>
    </div>
  );
}

// Contract Conversion Dialog
function ContractConversionDialog({ offer, onConfirm }: { offer: Offer; onConfirm: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [copyItems, setCopyItems] = useState(true);

  const handleConfirm = () => {
    toast.success('Auftrag erfolgreich erstellt');
    onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <Package className="h-4 w-4 mr-2" />
        In Auftrag umwandeln
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Angebot in Auftrag umwandeln</DialogTitle>
            <DialogDescription>
              Erstellen Sie einen Auftrag aus diesem angenommenen Angebot
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Angebot:</span>
                <span>{offer.number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kunde:</span>
                <span>{offer.customer}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Betrag:</span>
                <span>€ {offer.total.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div>
              <Label>Auftragsnummer</Label>
              <Input value="C-2025-00045" disabled className="mt-2 bg-muted" />
              <p className="text-xs text-muted-foreground mt-1">(automatisch generiert)</p>
            </div>

            <div>
              <Label>Auftragseingang</Label>
              <div className="relative mt-2">
                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox checked={copyItems} onCheckedChange={(checked) => setCopyItems(!!checked)} id="copy-items" />
                <Label htmlFor="copy-items" className="cursor-pointer">
                  Originalpositionen übernehmen
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={notifyCustomer} onCheckedChange={(checked) => setNotifyCustomer(!!checked)} id="notify" />
                <Label htmlFor="notify" className="cursor-pointer">
                  Kunde per E-Mail benachrichtigen
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleConfirm}>
              Auftrag erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Contract Form Component
function ContractForm({ contract }: { contract?: Contract }) {
  return (
    <div className="space-y-6">
      <FlowIndicator currentStep="contract" />

      <Card>
        <CardHeader>
          <CardTitle>Auftrag</CardTitle>
          <CardDescription>Auftrag aus angenommenem Angebot</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="mb-1">Auftrag aus Angebot erstellt</p>
                <p className="text-sm text-blue-700">
                  Ursprüngliches Angebot: A-2025-00123
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Auftragsnummer</Label>
              <Input value="C-2025-00045" disabled className="mt-2 bg-muted" />
            </div>
            <div>
              <Label>Auftragseingang</Label>
              <Input type="date" value={new Date().toISOString().split('T')[0]} disabled className="mt-2 bg-muted" />
            </div>
          </div>

          <div>
            <Label>Kunde</Label>
            <Input value="Hofladen Müller GmbH" disabled className="mt-2 bg-muted" />
          </div>

          <div>
            <Label>Status</Label>
            <Select defaultValue="processing">
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="processing">In Bearbeitung</SelectItem>
                <SelectItem value="partial">Teilgeliefert</SelectItem>
                <SelectItem value="completed">Abgeschlossen → Rechnung erstellen</SelectItem>
                <SelectItem value="cancelled">Storniert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <Label className="mb-3 block">Positionen</Label>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Beschreibung</TableHead>
                    <TableHead>Menge</TableHead>
                    <TableHead>Einzelpreis</TableHead>
                    <TableHead>Gesamt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Beispielprodukt A</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>€ 100,00</TableCell>
                    <TableCell>€ 1.000,00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Beispielprodukt B</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>€ 200,00</TableCell>
                    <TableCell>€ 1.000,00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zwischensumme:</span>
                <span>€ 2.000,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">MwSt. (19%):</span>
                <span>€ 380,00</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span>Gesamtsumme:</span>
                <span>€ 2.380,00</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          PDF herunterladen
        </Button>
        <Button>
          <CreditCard className="h-4 w-4 mr-2" />
          Rechnung erstellen
        </Button>
      </div>
    </div>
  );
}

// Invoice Creation Dialog
function InvoiceCreationDialog({ contract, onConfirm }: { contract: Contract; onConfirm: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [invoiceType, setInvoiceType] = useState<'full' | 'partial' | 'final'>('full');
  const [percentage, setPercentage] = useState(50);

  const calculateAmount = () => {
    if (invoiceType === 'partial') {
      return (contract.total * percentage) / 100;
    }
    return contract.total;
  };

  const handleConfirm = () => {
    toast.success('Rechnung erfolgreich erstellt');
    onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <CreditCard className="h-4 w-4 mr-2" />
        Rechnung erstellen
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rechnung aus Auftrag erstellen</DialogTitle>
            <DialogDescription>
              Erstellen Sie eine Rechnung für diesen Auftrag
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Auftrag:</span>
                <span>{contract.number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kunde:</span>
                <span>{contract.customer}</span>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Rechnungsart</Label>
              <RadioGroup value={invoiceType} onValueChange={(v) => setInvoiceType(v as any)}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="cursor-pointer">
                      Komplettrechnung (100%)
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="partial" id="partial" />
                      <Label htmlFor="partial" className="cursor-pointer">
                        Teilrechnung
                      </Label>
                    </div>
                    {invoiceType === 'partial' && (
                      <div className="ml-6 space-y-2">
                        <div>
                          <Label className="text-sm">Prozentsatz</Label>
                          <Input
                            type="number"
                            value={percentage}
                            onChange={(e) => setPercentage(parseInt(e.target.value) || 0)}
                            min={1}
                            max={100}
                            className="mt-1"
                          />
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Betrag: </span>
                          <span>€ {calculateAmount().toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="final" id="final" />
                    <Label htmlFor="final" className="cursor-pointer">
                      Schlussrechnung
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Rechnungsnummer</Label>
              <Input value="R-2025-00789" disabled className="mt-2 bg-muted" />
              <p className="text-xs text-muted-foreground mt-1">(automatisch generiert)</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleConfirm}>
              Rechnung erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Invoice Form Component
function InvoiceForm({ contract }: { contract?: Contract }) {
  return (
    <div className="space-y-6">
      <FlowIndicator currentStep="invoice" />

      <Card>
        <CardHeader>
          <CardTitle>Rechnung</CardTitle>
          <CardDescription>Rechnung aus Auftrag</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="mb-1">Rechnung aus Auftrag erstellt</p>
                <p className="text-sm text-green-700">
                  Ursprünglicher Auftrag: C-2025-00045 (aus Angebot A-2025-00123)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Rechnungsnummer</Label>
              <Input value="R-2025-00789" disabled className="mt-2 bg-muted" />
            </div>
            <div>
              <Label>Rechnungsdatum</Label>
              <Input type="date" value={new Date().toISOString().split('T')[0]} disabled className="mt-2 bg-muted" />
            </div>
          </div>

          <div>
            <Label>Kunde</Label>
            <Input value="Hofladen Müller GmbH" disabled className="mt-2 bg-muted" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Rechnungsart</Label>
              <Input value="Teilrechnung (50%)" disabled className="mt-2 bg-muted" />
            </div>
            <div>
              <Label>Fälligkeitsdatum</Label>
              <Input type="date" className="mt-2" />
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <Select defaultValue="draft">
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Entwurf</SelectItem>
                <SelectItem value="sent">Versendet</SelectItem>
                <SelectItem value="partial_paid">Teilweise bezahlt</SelectItem>
                <SelectItem value="paid">Bezahlt</SelectItem>
                <SelectItem value="overdue">Überfällig</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <Label className="mb-3 block">Positionen</Label>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Beschreibung</TableHead>
                    <TableHead>Menge</TableHead>
                    <TableHead>Einzelpreis</TableHead>
                    <TableHead>Gesamt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Beispielprodukt A (Teillieferung)</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>€ 100,00</TableCell>
                    <TableCell>€ 500,00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Beispielprodukt B (Teillieferung)</TableCell>
                    <TableCell>2,5</TableCell>
                    <TableCell>€ 200,00</TableCell>
                    <TableCell>€ 500,00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zwischensumme:</span>
                <span>€ 1.000,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">MwSt. (19%):</span>
                <span>€ 190,00</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span>Gesamtsumme:</span>
                <span>€ 1.190,00</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="mb-1 text-amber-900">GoBD-Hinweis</p>
                <p className="text-sm text-amber-700">
                  Nach Finalisierung ist diese Rechnung unveränderlich. Für Korrekturen erstellen Sie bitte eine Stornorechnung.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button variant="outline">
          Entwurf speichern
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          PDF herunterladen
        </Button>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Finalisieren & Versenden
        </Button>
      </div>
    </div>
  );
}

// Document List with Tabs
export function DocumentList() {
  const [activeTab, setActiveTab] = useState<DocumentType>('offer');

  const offers: Offer[] = [
    {
      id: '1',
      number: 'A-2025-00125',
      customer: 'Hofladen Müller GmbH',
      date: '05.02.2025',
      validUntil: '07.03.2025',
      validityDays: 30,
      status: 'sent',
      items: [],
      subtotal: 3839.50,
      tax: 729.51,
      total: 4567.89,
    },
    {
      id: '2',
      number: 'A-2025-00124',
      customer: 'Baumarkt Weber GmbH',
      date: '04.02.2025',
      validUntil: '06.03.2025',
      validityDays: 30,
      status: 'draft',
      items: [],
      subtotal: 10370.59,
      tax: 1970.41,
      total: 12340,
    },
  ];

  const getStatusBadge = (status: OfferStatus | ContractStatus | InvoiceStatus) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      draft: { label: 'Entwurf', variant: 'secondary' },
      sent: { label: 'Versendet', variant: 'default' },
      negotiation: { label: 'In Verhandlung', variant: 'outline' },
      accepted: { label: 'Angenommen', variant: 'default' },
      rejected: { label: 'Abgelehnt', variant: 'destructive' },
      expired: { label: 'Abgelaufen', variant: 'secondary' },
      processing: { label: 'In Bearbeitung', variant: 'default' },
      partial: { label: 'Teilgeliefert', variant: 'outline' },
      completed: { label: 'Abgeschlossen', variant: 'default' },
      cancelled: { label: 'Storniert', variant: 'destructive' },
      partial_paid: { label: 'Teilweise bezahlt', variant: 'outline' },
      paid: { label: 'Bezahlt', variant: 'default' },
      overdue: { label: 'Überfällig', variant: 'destructive' },
    };

    const config = statusConfig[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finanzdokumente</CardTitle>
        <CardDescription>Angebote, Aufträge und Rechnungen</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DocumentType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="offer">
              Angebote (45)
            </TabsTrigger>
            <TabsTrigger value="contract">
              Aufträge (23)
            </TabsTrigger>
            <TabsTrigger value="invoice">
              Rechnungen (15)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offer" className="space-y-4 mt-6">
            {offers.map((offer) => (
              <div key={offer.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm">{offer.number}</span>
                      {getStatusBadge(offer.status)}
                    </div>
                    <p className="mb-1">{offer.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      Erstellt: {offer.date} • Gültig bis: {offer.validUntil}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg">€ {offer.total.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                  {offer.status === 'accepted' && (
                    <ContractConversionDialog offer={offer} onConfirm={() => {}} />
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="contract" className="mt-6">
            <div className="text-center p-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Keine Aufträge vorhanden</p>
            </div>
          </TabsContent>

          <TabsContent value="invoice" className="mt-6">
            <div className="text-center p-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Keine Rechnungen vorhanden</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Pipeline Overview Widget
export function PipelineOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline-Übersicht</CardTitle>
        <CardDescription>Verkaufsprozess von Opportunity bis Rechnung</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p>Opportunities</p>
                <p className="text-sm text-muted-foreground">45 offen</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg">€ 450.000</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="text-2xl text-muted-foreground">↓</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p>Angebote</p>
                <p className="text-sm text-muted-foreground">23 aktiv</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg">€ 280.000</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="text-2xl text-muted-foreground">↓</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-amber-600" />
              <div>
                <p>Aufträge</p>
                <p className="text-sm text-muted-foreground">18 in Bearbeitung</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg">€ 125.000</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="text-2xl text-muted-foreground">↓</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-green-600" />
              <div>
                <p>Rechnungen</p>
                <p className="text-sm text-muted-foreground">15 offen</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg">€ 98.000</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Conversion Rate:</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>22% (Opp → Auftrag)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Lexware Export Dialog
export function LexwareExportDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [exportType, setExportType] = useState<DocumentType>('contract');
  const [onlyNew, setOnlyNew] = useState(true);

  const handleExport = () => {
    toast.success('Export nach Lexware erfolgreich');
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <ExternalLink className="h-4 w-4 mr-2" />
        Nach Lexware exportieren
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export nach Lexware</DialogTitle>
            <DialogDescription>
              Exportieren Sie Finanzdokumente zu Lexware Office
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p>Lexware Anbindung</p>
                <p className="text-sm text-muted-foreground">Format: Lexware Office</p>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Dokumenttyp</Label>
              <RadioGroup value={exportType} onValueChange={(v) => setExportType(v as DocumentType)}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="offer" id="export-offer" />
                    <Label htmlFor="export-offer" className="cursor-pointer">
                      Angebote exportieren
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="contract" id="export-contract" />
                    <Label htmlFor="export-contract" className="cursor-pointer">
                      Aufträge exportieren
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="invoice" id="export-invoice" />
                    <Label htmlFor="export-invoice" className="cursor-pointer">
                      Rechnungen exportieren
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox checked={onlyNew} onCheckedChange={(checked) => setOnlyNew(!!checked)} id="only-new" />
              <Label htmlFor="only-new" className="cursor-pointer">
                Nur neue seit letztem Export
              </Label>
            </div>

            <div className="text-sm text-muted-foreground">
              Letzter Export: 01.02.2025
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleExport}>
              Exportieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Demo Component
export function FinancialFlowDemo() {
  const [view, setView] = useState<'offer' | 'contract' | 'invoice' | 'list' | 'pipeline'>('list');

  const mockOffer: Offer = {
    id: '1',
    number: 'A-2025-00123',
    customer: 'Hofladen Müller GmbH',
    date: '06.02.2025',
    validUntil: '08.03.2025',
    validityDays: 30,
    status: 'accepted',
    items: [],
    subtotal: 3839.50,
    tax: 729.51,
    total: 4567.89,
  };

  const mockContract: Contract = {
    id: '1',
    number: 'C-2025-00045',
    offerId: '1',
    offerNumber: 'A-2025-00123',
    customer: 'Hofladen Müller GmbH',
    date: '06.02.2025',
    status: 'completed',
    items: [],
    total: 2380,
  };

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Ansicht wählen</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('list')}
                >
                  Dokumentenliste
                </Button>
                <Button
                  variant={view === 'offer' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('offer')}
                >
                  Angebot
                </Button>
                <Button
                  variant={view === 'contract' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('contract')}
                >
                  Auftrag
                </Button>
                <Button
                  variant={view === 'invoice' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('invoice')}
                >
                  Rechnung
                </Button>
                <Button
                  variant={view === 'pipeline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('pipeline')}
                >
                  Pipeline
                </Button>
              </div>
            </div>

            <Separator />

            <div className="border border-border rounded-lg p-6 bg-muted/50">
              <h3 className="mb-4">Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 3-step flow indicator (Angebot → Auftrag → Rechnung)</li>
                  <li>• Offer form with validity period (14/30/60/90 days)</li>
                  <li>• Offer number pattern: A-YYYY-#####</li>
                  <li>• Offer statuses (6 states)</li>
                  <li>• Contract conversion dialog</li>
                  <li>• Contract number pattern: C-YYYY-#####</li>
                  <li>• Contract statuses (4 states)</li>
                  <li>• Invoice creation from contract</li>
                  <li>• Invoice number pattern: R-YYYY-#####</li>
                  <li>• Invoice types (Komplett/Teil/Schluss)</li>
                  <li>• Percentage calculator for partial invoices</li>
                  <li>• GoBD immutability warning</li>
                </ul>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Document list with 3 tabs</li>
                  <li>• Pipeline overview widget (4 stages)</li>
                  <li>• Conversion rate tracking</li>
                  <li>• Lexware export dialog</li>
                  <li>• Export type selection (Offer/Contract/Invoice)</li>
                  <li>• "Only new" export filter</li>
                  <li>• Line items with totals calculation</li>
                  <li>• MwSt. (19%) automatic calculation</li>
                  <li>• Status badges with variants</li>
                  <li>• Document reference tracking</li>
                  <li>• Customer notification checkboxes</li>
                  <li>• German labels throughout</li>
                  <li>• Mobile-responsive design</li>
                  <li>• Design system compliance</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Views */}
      {view === 'list' && (
        <div className="space-y-6">
          <DocumentList />
          <LexwareExportDialog />
        </div>
      )}

      {view === 'offer' && <OfferForm />}

      {view === 'contract' && <ContractForm contract={mockContract} />}

      {view === 'invoice' && <InvoiceForm contract={mockContract} />}

      {view === 'pipeline' && <PipelineOverview />}
    </div>
  );
}