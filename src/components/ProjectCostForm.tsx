import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import {
  AlertTriangle,
  Check,
  Clock,
  X,
  Save,
  Send,
  Upload,
  Search,
  Calendar,
  Wrench,
  Users,
  Plane,
  Package,
  Plus,
  FileText,
  Camera,
  ArrowLeft,
} from 'lucide-react';

// Types
export type CostCategory = 'material' | 'subcontractor' | 'travel' | 'other';
export type CostStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'posted';

export interface Project {
  id: string;
  name: string;
  totalBudget: number;
  spentAmount: number;
  isActive: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  vendorNumber: string;
  taxNumber?: string;
  paymentTerms: string;
}

export interface ProjectCost {
  id: string;
  projectId: string;
  category: CostCategory;
  description: string;
  vendorId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  netAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  invoiceNumber?: string;
  invoiceDate: string;
  paymentDueDate?: string;
  receiptFile?: File;
  receiptFileName?: string;
  notes?: string;
  status: CostStatus;
}

// Cost Categories
export const costCategories = [
  {
    id: 'material' as CostCategory,
    label: 'Material/Lieferung',
    icon: Wrench,
    description: 'Hardware, Software, Baumaterial, Werkzeug',
  },
  {
    id: 'subcontractor' as CostCategory,
    label: 'Fremdleistung/Subunternehmer',
    icon: Users,
    description: 'Subunternehmer, Freelancer, Berater',
  },
  {
    id: 'travel' as CostCategory,
    label: 'Reise/Unterkunft',
    icon: Plane,
    description: 'Projektbezogene Reisen, Hotels, Mietwagen',
  },
  {
    id: 'other' as CostCategory,
    label: 'Sonstige Projektkosten',
    icon: Package,
    description: 'Versand, Gebühren, Sonderausgaben',
  },
];

// Mock Data
export const mockProjects: Project[] = [
  {
    id: 'proj1',
    name: 'Projekt Phoenix - Website Relaunch',
    totalBudget: 45000,
    spentAmount: 28750,
    isActive: true,
  },
  {
    id: 'proj2',
    name: 'Hofladen Müller - E-Commerce',
    totalBudget: 30000,
    spentAmount: 12500,
    isActive: true,
  },
];

export const mockVendors: Vendor[] = [
  {
    id: 'vendor1',
    name: 'TechSupply GmbH',
    vendorNumber: 'L-2025-001',
    taxNumber: 'DE123456789',
    paymentTerms: '30 Tage netto',
  },
  {
    id: 'vendor2',
    name: 'Adobe Inc.',
    vendorNumber: 'L-2025-002',
    paymentTerms: 'Sofort',
  },
  {
    id: 'vendor3',
    name: 'Max Designer (Freelance)',
    vendorNumber: 'L-2025-003',
    paymentTerms: '14 Tage netto',
  },
];

// Utility Functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function getCategoryInfo(category: CostCategory) {
  return costCategories.find((c) => c.id === category);
}

export function getApprovalLevel(amount: number): string {
  if (amount < 1000) return 'Auto-approve';
  if (amount < 5000) return 'PLAN';
  if (amount < 20000) return 'KALK';
  return 'GF';
}

export function getStatusBadge(status: CostStatus) {
  switch (status) {
    case 'draft':
      return { label: 'Entwurf', icon: FileText, color: 'text-muted-foreground' };
    case 'submitted':
      return { label: 'Eingereicht', icon: Clock, color: 'text-blue-500' };
    case 'approved':
      return { label: 'Freigegeben', icon: Check, color: 'text-green-500' };
    case 'rejected':
      return { label: 'Abgelehnt', icon: X, color: 'text-red-500' };
    case 'posted':
      return { label: 'Gebucht', icon: Check, color: 'text-green-600' };
  }
}

// Budget Overview Component
export interface BudgetOverviewProps {
  project: Project;
  additionalCost?: number;
}

export function BudgetOverview({ project, additionalCost = 0 }: BudgetOverviewProps) {
  const spent = project.spentAmount;
  const total = project.totalBudget;
  const newSpent = spent + additionalCost;
  const remaining = total - newSpent;
  const percentUsed = (newSpent / total) * 100;
  const isOverBudget = newSpent > total;

  return (
    <Card className={isOverBudget ? 'border-destructive' : ''}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Gesamt:</span>
          <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            {formatCurrency(total)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Verbraucht:</span>
          <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
            {formatCurrency(newSpent)} ({Math.round(percentUsed)}%)
          </span>
        </div>

        <Progress
          value={Math.min(percentUsed, 100)}
          className="h-2"
        />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Verbleibend:</span>
          <span
            style={{
              fontWeight: 'var(--font-weight-semi-bold)',
              color: isOverBudget ? 'rgb(239, 68, 68)' : undefined,
            }}
          >
            {formatCurrency(remaining)}
          </span>
        </div>

        {isOverBudget && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Budget überschritten um {formatCurrency(Math.abs(remaining))}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// Vendor Quick Add Dialog
export interface VendorQuickAddProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVendorAdded: (vendor: Vendor) => void;
}

export function VendorQuickAddDialog({
  open,
  onOpenChange,
  onVendorAdded,
}: VendorQuickAddProps) {
  const [name, setName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30 Tage netto');

  const handleSave = () => {
    if (!name) {
      toast.error('Bitte Firmenname eingeben');
      return;
    }

    const newVendor: Vendor = {
      id: `vendor${Date.now()}`,
      name,
      vendorNumber: `L-2025-${String(mockVendors.length + 1).padStart(3, '0')}`,
      taxNumber: taxNumber || undefined,
      paymentTerms,
    };

    onVendorAdded(newVendor);
    onOpenChange(false);
    toast.success(`Lieferant "${name}" wurde hinzugefügt`);

    // Reset form
    setName('');
    setTaxNumber('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Neuer Lieferant</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vendor-name">
              Firmenname <span className="text-destructive">*</span>
            </Label>
            <Input
              id="vendor-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Firma GmbH"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-number">Lieferantennummer</Label>
            <Input
              id="vendor-number"
              value={`L-2025-${String(mockVendors.length + 1).padStart(3, '0')}`}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax-number">Steuernummer</Label>
            <Input
              id="tax-number"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              placeholder="DE123456789"
            />
          </div>

          <div className="space-y-2">
            <Label>Kontakt</Label>
            <Input
              placeholder="Name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
            <Input
              type="tel"
              placeholder="Telefon"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-terms">Zahlungsbedingungen</Label>
            <Select value={paymentTerms} onValueChange={setPaymentTerms}>
              <SelectTrigger id="payment-terms">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sofort">Sofort</SelectItem>
                <SelectItem value="14 Tage netto">14 Tage netto</SelectItem>
                <SelectItem value="30 Tage netto">30 Tage netto</SelectItem>
                <SelectItem value="60 Tage netto">60 Tage netto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Budget Warning Dialog
export interface BudgetWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  costAmount: number;
  onConfirm: () => void;
}

export function BudgetWarningDialog({
  open,
  onOpenChange,
  project,
  costAmount,
  onConfirm,
}: BudgetWarningDialogProps) {
  const newTotal = project.spentAmount + costAmount;
  const overage = newTotal - project.totalBudget;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Budget-Warnung</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-destructive shrink-0" />
            <p className="text-sm">
              Diese Kosten würden das Projektbudget überschreiten:
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Budget:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {formatCurrency(project.totalBudget)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verbraucht:</span>
              <span>{formatCurrency(project.spentAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Diese Kosten:</span>
              <span>{formatCurrency(costAmount)}</span>
            </div>
            <div className="border-t pt-2" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between">
                <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Überschreitung:
                </span>
                <span
                  style={{
                    fontWeight: 'var(--font-weight-semi-bold)',
                    color: 'rgb(239, 68, 68)',
                  }}
                >
                  {formatCurrency(overage)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Möchten Sie fortfahren? Die Kosten benötigen eine Sonderfreigabe durch GF.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Fortfahren
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Desktop Project Cost Form
export interface DesktopProjectCostFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (cost: Partial<ProjectCost>, isDraft: boolean) => void;
}

export function DesktopProjectCostForm({
  open,
  onOpenChange,
  onSave,
}: DesktopProjectCostFormProps) {
  const [projectId, setProjectId] = useState('proj1');
  const [category, setCategory] = useState<CostCategory>('material');
  const [description, setDescription] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [showVendorAdd, setShowVendorAdd] = useState(false);
  const [vendors, setVendors] = useState(mockVendors);
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('Stück');
  const [unitPrice, setUnitPrice] = useState('');
  const [vatRate, setVatRate] = useState('19');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);

  const selectedProject = mockProjects.find((p) => p.id === projectId);

  // Calculations
  const qty = parseFloat(quantity) || 0;
  const price = parseFloat(unitPrice) || 0;
  const netAmount = qty * price;
  const vat = parseFloat(vatRate) || 0;
  const vatAmount = netAmount * (vat / 100);
  const totalAmount = netAmount + vatAmount;

  // Calculate payment due date based on invoice date
  useEffect(() => {
    if (invoiceDate && vendorId) {
      const vendor = vendors.find((v) => v.id === vendorId);
      if (vendor?.paymentTerms) {
        const days = parseInt(vendor.paymentTerms) || 30;
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + days);
        setPaymentDueDate(dueDate.toISOString().split('T')[0]);
      }
    }
  }, [invoiceDate, vendorId, vendors]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Datei zu groß. Maximum 10MB.');
        return;
      }
      setReceiptFile(file);
    }
  };

  const handleVendorAdded = (vendor: Vendor) => {
    setVendors([...vendors, vendor]);
    setVendorId(vendor.id);
  };

  const handleSubmit = (isDraft: boolean) => {
    // Validation
    if (!projectId) {
      toast.error('Bitte Projekt auswählen');
      return;
    }

    if (!description) {
      toast.error('Bitte Bezeichnung eingeben');
      return;
    }

    if (!vendorId) {
      toast.error('Bitte Lieferant auswählen');
      return;
    }

    if (totalAmount <= 0) {
      toast.error('Betrag muss größer als 0 sein');
      return;
    }

    if (!receiptFile && !isDraft) {
      toast.error('Bitte Beleg anhängen');
      return;
    }

    // Check budget
    if (selectedProject && !isDraft) {
      const newTotal = selectedProject.spentAmount + totalAmount;
      if (newTotal > selectedProject.totalBudget) {
        setShowBudgetWarning(true);
        return;
      }
    }

    submitCost(isDraft);
  };

  const submitCost = (isDraft: boolean) => {
    const costData: Partial<ProjectCost> = {
      projectId,
      category,
      description,
      vendorId,
      quantity: qty,
      unit,
      unitPrice: price,
      netAmount,
      vatRate: vat,
      vatAmount,
      totalAmount,
      invoiceNumber: invoiceNumber || undefined,
      invoiceDate,
      paymentDueDate: paymentDueDate || undefined,
      receiptFile: receiptFile || undefined,
      receiptFileName: receiptFile?.name,
      notes: notes || undefined,
      status: isDraft ? 'draft' : 'submitted',
    };

    onSave(costData, isDraft);
    onOpenChange(false);
  };

  const isBudgetWarning = selectedProject
    ? selectedProject.spentAmount + totalAmount > selectedProject.totalBudget
    : false;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Projektkosten erfassen</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
            <div className="space-y-6">
              {/* Project Selection */}
              <div className="space-y-2">
                <Label htmlFor="project">
                  Projekt <span className="text-destructive">*</span>
                </Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger id="project">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map((proj) => (
                      <SelectItem key={proj.id} value={proj.id}>
                        {proj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget Overview */}
              {selectedProject && (
                <div>
                  <Label className="mb-2 block">Budget-Übersicht</Label>
                  <BudgetOverview
                    project={selectedProject}
                    additionalCost={totalAmount}
                  />
                </div>
              )}

              {/* Cost Details */}
              <div className="space-y-4">
                <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Kostendetails
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Kostenart <span className="text-destructive">*</span>
                  </Label>
                  <Select value={category} onValueChange={(v: CostCategory) => setCategory(v)}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {costCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Bezeichnung <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="z.B. Server Hardware für Hosting"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor">
                    Lieferant/Anbieter <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Select value={vendorId} onValueChange={setVendorId}>
                      <SelectTrigger id="vendor" className="flex-1">
                        <SelectValue placeholder="Suchen oder neu anlegen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowVendorAdd(true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Quantity/Price Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Menge</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Einheit</Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger id="unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stück">Stück</SelectItem>
                        <SelectItem value="Stunden">Stunden</SelectItem>
                        <SelectItem value="Tage">Tage</SelectItem>
                        <SelectItem value="Pauschal">Pauschal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit-price">Einzelpreis</Label>
                    <Input
                      id="unit-price"
                      type="number"
                      step="0.01"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                </div>

                {/* Net/VAT Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Netto</Label>
                    <Input value={formatCurrency(netAmount)} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vat-rate">MwSt.</Label>
                    <div className="flex gap-2">
                      <Select value={vatRate} onValueChange={setVatRate}>
                        <SelectTrigger id="vat-rate" className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="7">7%</SelectItem>
                          <SelectItem value="19">19%</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={formatCurrency(vatAmount)}
                        readOnly
                        className="bg-muted flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                    Gesamtbetrag:
                  </span>
                  <span
                    className="text-lg"
                    style={{ fontWeight: 'var(--font-weight-bold)' }}
                  >
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Weitere Informationen
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="invoice-number">Rechnungsnummer</Label>
                  <Input
                    id="invoice-number"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="RE-2025-4567"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-date">
                      Rechnungsdatum <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="invoice-date"
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-due">Zahlungsziel</Label>
                    <Input
                      id="payment-due"
                      type="date"
                      value={paymentDueDate}
                      onChange={(e) => setPaymentDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipt">
                    Beleg anhängen <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('receipt-input')?.click()}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Datei auswählen
                    </Button>
                    <input
                      id="receipt-input"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  {receiptFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{receiptFile.name}</span>
                      <span>({(receiptFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notizen</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Weitere Informationen..."
                    className="resize-none h-20"
                  />
                </div>
              </div>

              {/* Budget Warning Alert */}
              {isBudgetWarning && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Diese Kosten überschreiten das verbleibende Budget um{' '}
                    {formatCurrency(
                      selectedProject.spentAmount + totalAmount - selectedProject.totalBudget
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button variant="outline" onClick={() => handleSubmit(true)}>
              Entwurf
            </Button>
            <Button onClick={() => handleSubmit(false)}>
              <Send className="h-4 w-4 mr-2" />
              Zur Freigabe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vendor Quick Add */}
      <VendorQuickAddDialog
        open={showVendorAdd}
        onOpenChange={setShowVendorAdd}
        onVendorAdded={handleVendorAdded}
      />

      {/* Budget Warning */}
      <BudgetWarningDialog
        open={showBudgetWarning}
        onOpenChange={setShowBudgetWarning}
        project={selectedProject!}
        costAmount={totalAmount}
        onConfirm={() => submitCost(false)}
      />
    </>
  );
}

// Mobile Project Cost Form
export interface MobileProjectCostFormProps {
  onSave: (cost: Partial<ProjectCost>, isDraft: boolean) => void;
  onCancel: () => void;
}

export function MobileProjectCostForm({ onSave, onCancel }: MobileProjectCostFormProps) {
  const [projectId, setProjectId] = useState('proj1');
  const [description, setDescription] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [amount, setAmount] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const selectedProject = mockProjects.find((p) => p.id === projectId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleSave = () => {
    const amountNum = parseFloat(amount);

    if (!description || !vendorId || !amountNum) {
      toast.error('Bitte alle Pflichtfelder ausfüllen');
      return;
    }

    const costData: Partial<ProjectCost> = {
      projectId,
      category: 'material',
      description,
      vendorId,
      totalAmount: amountNum,
      invoiceDate: new Date().toISOString().split('T')[0],
      receiptFile: receiptFile || undefined,
      status: 'draft',
    };

    onSave(costData, true);
  };

  const budgetPercent = selectedProject
    ? ((selectedProject.totalBudget - selectedProject.spentAmount) /
        selectedProject.totalBudget) *
      100
    : 0;

  const isBudgetWarning = selectedProject
    ? selectedProject.spentAmount + parseFloat(amount || '0') > selectedProject.totalBudget
    : false;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-card" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Neue Projektkosten
          </h2>
          <div className="w-8" />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="p-4 space-y-6">
          {/* Project */}
          <div className="space-y-2">
            <Label>Projekt</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map((proj) => (
                  <SelectItem key={proj.id} value={proj.id}>
                    {proj.name.split('-')[0].trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          {selectedProject && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Budget: {Math.round(budgetPercent)}% verfügbar</span>
                </div>
                <Progress value={budgetPercent} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(selectedProject.totalBudget - selectedProject.spentAmount)} von{' '}
                  {formatCurrency(selectedProject.totalBudget)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="desc-mobile">
              Was wurde gekauft? <span className="text-destructive">*</span>
            </Label>
            <Input
              id="desc-mobile"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="z.B. Server Hardware"
            />
          </div>

          {/* Vendor */}
          <div className="space-y-2">
            <Label htmlFor="vendor-mobile">
              Lieferant <span className="text-destructive">*</span>
            </Label>
            <Select value={vendorId} onValueChange={setVendorId}>
              <SelectTrigger id="vendor-mobile">
                <SelectValue placeholder="Lieferant wählen" />
              </SelectTrigger>
              <SelectContent>
                {mockVendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount-mobile">Betrag</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                €
              </span>
              <Input
                id="amount-mobile"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="pl-8"
              />
            </div>
            {isBudgetWarning && (
              <div className="flex items-center gap-2 text-xs text-destructive">
                <AlertTriangle className="h-3 w-3" />
                <span>Überschreitet Budget</span>
              </div>
            )}
          </div>

          {/* Receipt */}
          <Button
            variant="outline"
            onClick={() => document.getElementById('receipt-mobile')?.click()}
            className="w-full h-12"
          >
            <Camera className="h-4 w-4 mr-2" />
            Rechnung fotografieren
          </Button>
          <input
            id="receipt-mobile"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          {receiptFile && (
            <div className="text-sm text-muted-foreground text-center">
              {receiptFile.name}
            </div>
          )}

          {/* Save Button */}
          <div className="pb-6">
            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Demo Component
export function ProjectCostFormDemo() {
  const [showDesktopForm, setShowDesktopForm] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);

  const handleSave = (cost: Partial<ProjectCost>, isDraft: boolean) => {
    const project = mockProjects.find((p) => p.id === cost.projectId);
    const statusText = isDraft ? 'als Entwurf gespeichert' : 'zur Freigabe eingereicht';

    toast.success(`Projektkosten ${statusText}`, {
      description: `${cost.description} - ${formatCurrency(cost.totalAmount || 0)} für ${project?.name}`,
    });

    setShowDesktopForm(false);
    setShowMobileForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Projektkostenformular</h2>
        <p className="text-sm text-muted-foreground">
          Umfassendes Kostenerfassungsformular für Projekte mit Budget-Überwachung,
          Lieferantenverwaltung, Freigabe-Workflow und Kategorisierung
        </p>
      </div>

      {/* Form Launchers */}
      <Card>
        <CardHeader>
          <h3>Demo-Modus</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowDesktopForm(true)}>
              Desktop-Formular öffnen
            </Button>
            <Button variant="outline" onClick={() => setShowMobileForm(true)}>
              Mobile-Formular öffnen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cost Categories */}
      <Card>
        <CardHeader>
          <h3>Kostenkategorien</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Vordefinierte Kategorien für Projektkosten
          </p>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {costCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="flex gap-3 p-4 border rounded-lg"
                style={{ borderColor: 'var(--border)' }}
              >
                <Icon className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                    {cat.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Approval Matrix */}
      <Card>
        <CardHeader>
          <h3>Freigabe-Matrix</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Automatische Weiterleitung basierend auf Kostenhöhe
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  {'< €1.000'}
                </p>
                <p className="text-xs text-muted-foreground">Auto-approve</p>
              </div>
              <Badge variant="secondary">Sofort</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  {'< €5.000'}
                </p>
                <p className="text-xs text-muted-foreground">PLAN</p>
              </div>
              <Badge variant="secondary">1 Tag</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  {'< €20.000'}
                </p>
                <p className="text-xs text-muted-foreground">KALK</p>
              </div>
              <Badge variant="secondary">2 Tage</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  {'> €20.000'}
                </p>
                <p className="text-xs text-muted-foreground">GF</p>
              </div>
              <Badge variant="secondary">3 Tage</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border-2 border-destructive rounded-lg">
              <div>
                <p className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  Budget überschritten
                </p>
                <p className="text-xs text-muted-foreground">GF Sonderfreigabe</p>
              </div>
              <Badge variant="destructive">Speziell</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <h3>Features & Funktionen</h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Budget-Überwachung:</strong> Echtzeit-Anzeige mit Warnung bei Überschreitung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Lieferanten-Schnellanlage:</strong> Neuen Lieferanten direkt aus Formular erstellen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Automatische Berechnungen:</strong> Netto, MwSt., Gesamt aus Menge × Preis
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Zahlungsziel:</strong> Automatisch aus Lieferanten-Zahlungsbedingungen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Beleg-Upload:</strong> PDF oder Foto mit 10MB Limit
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Freigabe-Workflow:</strong> Automatische Weiterleitung nach Betragshöhe
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Entwurf-Modus:</strong> Speichern und später vervollständigen
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Rules */}
      <Card className="bg-muted">
        <CardHeader>
          <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Validierungsregeln
          </h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Projekt erforderlich und aktiv</p>
          <p>• Betrag muss {'>'} 0 sein</p>
          <p>• Beleg/Rechnung erforderlich (außer Entwurf)</p>
          <p>• Rechnungsdatum nicht in der Zukunft</p>
          <p>• Lieferant muss existieren</p>
          <p>• Budget-Warnung bei Überschreitung</p>
          <p>• Sonderfreigabe GF bei Budget-Überschreitung</p>
        </CardContent>
      </Card>

      {/* Desktop Form */}
      <DesktopProjectCostForm
        open={showDesktopForm}
        onOpenChange={setShowDesktopForm}
        onSave={handleSave}
      />

      {/* Mobile Form */}
      {showMobileForm && (
        <Dialog open={showMobileForm} onOpenChange={setShowMobileForm}>
          <DialogContent className="sm:max-w-[375px] h-[90vh] p-0">
            <MobileProjectCostForm
              onSave={handleSave}
              onCancel={() => setShowMobileForm(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
