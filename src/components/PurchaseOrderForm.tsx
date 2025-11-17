import { useState } from 'react';
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
} from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import {
  Save,
  Send,
  Plus,
  X,
  Copy,
  Wand2,
  Info,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from 'lucide-react';

// Types
export type POStatus = 'draft' | 'pending_approval' | 'approved' | 'sent_to_supplier' | 'rejected';
export type TaxRate = '19' | '7' | '0';

export interface LineItem {
  id: string;
  materialId: string;
  materialName: string;
  materialCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: TaxRate;
  netAmount: number;
}

export interface PurchaseOrderFormData {
  poNumber: string;
  projectId: string;
  supplierId: string;
  requiredByDate: string;
  createdBy: string;
  creationDate: string;
  lineItems: LineItem[];
  shippingCost: number;
  deliveryAddress: 'construction_site' | 'warehouse';
  contactPersonId: string;
  deliveryNotes: string;
  allowPartialDeliveries: boolean;
  status: POStatus;
}

// Mock Data
export const mockProjects = [
  { id: 'proj1', number: 'P-2025-M003', name: 'REWE München Ladeneinrichtung', budget: 125000, spent: 118450 },
  { id: 'proj2', number: 'P-2025-B004', name: 'Büro Neubau Frankfurt', budget: 80000, spent: 45000 },
];

export const mockSuppliers = [
  { id: 'sup1', name: 'Schreinerei Müller GmbH', location: 'München', paymentTerms: '30 Tage, 2% Skonto bei 10 Tagen' },
  { id: 'sup2', name: 'Elektro Schmidt', location: 'Frankfurt', paymentTerms: '14 Tage netto' },
];

export const mockMaterials = [
  { id: 'mat1', name: 'LED-Panel 60x60cm warmweiß', code: 'MAT-LED-001', unit: 'Stück', unitPrice: 145.00, moq: 10 },
  { id: 'mat2', name: 'Ladenregal Eiche massiv', code: 'MAT-SHE-012', unit: 'Stück', unitPrice: 850.00, moq: 2 },
  { id: 'mat3', name: 'Deckenleuchte Spot', code: 'MAT-SPO-034', unit: 'Stück', unitPrice: 67.50, moq: 5 },
];

export const mockContacts = [
  { id: 'user1', name: 'Thomas Fischer', role: 'PLAN', phone: '+49 89 987654' },
  { id: 'user2', name: 'Anna Weber', role: 'PLAN', phone: '+49 89 123456' },
];

// Line Item Component
export interface LineItemRowProps {
  item: LineItem;
  index: number;
  canRemove: boolean;
  onUpdate: (updated: LineItem) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export function LineItemRow({
  item,
  index,
  canRemove,
  onUpdate,
  onRemove,
  onDuplicate,
}: LineItemRowProps) {
  const material = mockMaterials.find((m) => m.id === item.materialId);
  const showMOQWarning = material && item.quantity < material.moq;

  return (
    <div className="border rounded-lg p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
          Position {index + 1}
        </h4>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onDuplicate} className="h-8 w-8 p-0">
            <Copy className="h-4 w-4" />
          </Button>
          {canRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`material-${item.id}`}>
            Material <span className="text-destructive">*</span>
          </Label>
          <Select
            value={item.materialId}
            onValueChange={(materialId) => {
              const mat = mockMaterials.find((m) => m.id === materialId);
              if (mat) {
                onUpdate({
                  ...item,
                  materialId: mat.id,
                  materialName: mat.name,
                  materialCode: mat.code,
                  description: mat.name,
                  unit: mat.unit,
                  unitPrice: mat.unitPrice,
                  netAmount: item.quantity * mat.unitPrice,
                });
              }
            }}
          >
            <SelectTrigger id={`material-${item.id}`}>
              <SelectValue placeholder="Material wählen..." />
            </SelectTrigger>
            <SelectContent>
              {mockMaterials.map((mat) => (
                <SelectItem key={mat.id} value={mat.id}>
                  {mat.name} ({mat.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`description-${item.id}`}>
            Beschreibung <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`description-${item.id}`}
            value={item.description}
            onChange={(e) => onUpdate({ ...item, description: e.target.value })}
            placeholder="Material-Beschreibung"
            maxLength={200}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`quantity-${item.id}`}>
            Menge <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`quantity-${item.id}`}
            type="number"
            min="0.01"
            step="1"
            value={item.quantity}
            onChange={(e) => {
              const quantity = parseFloat(e.target.value) || 0;
              onUpdate({
                ...item,
                quantity,
                netAmount: quantity * item.unitPrice,
              });
            }}
          />
          {showMOQWarning && (
            <p className="text-xs text-orange-600">
              Unter Mindestbestellmenge ({material.moq} {item.unit})
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`unit-${item.id}`}>Einheit</Label>
          <Input
            id={`unit-${item.id}`}
            value={item.unit}
            readOnly
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`unit-price-${item.id}`}>
            Stückpreis <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={`unit-price-${item.id}`}
              type="number"
              min="0.01"
              step="0.01"
              value={item.unitPrice}
              onChange={(e) => {
                const unitPrice = parseFloat(e.target.value) || 0;
                onUpdate({
                  ...item,
                  unitPrice,
                  netAmount: item.quantity * unitPrice,
                });
              }}
            />
            <span className="text-sm text-muted-foreground">€</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`tax-${item.id}`}>
            MwSt. <span className="text-destructive">*</span>
          </Label>
          <Select
            value={item.taxRate}
            onValueChange={(rate: TaxRate) => onUpdate({ ...item, taxRate: rate })}
          >
            <SelectTrigger id={`tax-${item.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="19">19%</SelectItem>
              <SelectItem value="7">7%</SelectItem>
              <SelectItem value="0">0%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Nettobetrag</Label>
          <div className="h-10 flex items-center text-blue-600" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            € {item.netAmount.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Approval Indicator Component
export interface ApprovalIndicatorProps {
  totalAmount: number;
  budgetOverrun: number;
  onJustificationChange?: (text: string) => void;
}

export function ApprovalIndicator({ totalAmount, budgetOverrun, onJustificationChange }: ApprovalIndicatorProps) {
  const [justification, setJustification] = useState('');

  const getApprovalInfo = () => {
    if (totalAmount <= 1000) {
      return {
        type: 'auto' as const,
        color: 'green',
        icon: CheckCircle,
        title: 'Automatische Freigabe',
        description: 'Bestellwert unter € 1.000. Keine manuelle Freigabe erforderlich. Die Bestellung kann direkt an den Lieferanten gesendet werden.',
        buttonText: 'An Lieferant senden',
        buttonVariant: 'default' as const,
      };
    } else if (totalAmount <= 10000) {
      return {
        type: 'buch' as const,
        color: 'amber',
        icon: AlertTriangle,
        title: 'BUCH-Freigabe erforderlich',
        description: `Bestellwert: € ${totalAmount.toLocaleString('de-DE')}. Freigabe durch Buchhaltung erforderlich. Die Bestellung wird an Anna Weber (BUCH) zur Prüfung weitergeleitet.`,
        buttonText: 'Zur Freigabe senden',
        buttonVariant: 'default' as const,
      };
    } else {
      return {
        type: 'gf' as const,
        color: 'red',
        icon: AlertTriangle,
        title: 'GF-Freigabe erforderlich',
        description: `Bestellwert: € ${totalAmount.toLocaleString('de-DE')}. Freigabe durch Geschäftsführung erforderlich. Die Bestellung wird an Dr. Schmidt (GF) zur Genehmigung weitergeleitet.`,
        buttonText: 'Zur GF-Freigabe senden',
        buttonVariant: 'destructive' as const,
        requiresJustification: budgetOverrun > 0,
      };
    }
  };

  const info = getApprovalInfo();
  const Icon = info.icon;

  const bgColor = info.color === 'green' ? 'bg-green-50' : info.color === 'amber' ? 'bg-amber-50' : 'bg-red-50';
  const borderColor = info.color === 'green' ? 'border-green-200' : info.color === 'amber' ? 'border-amber-200' : 'border-red-200';
  const textColor = info.color === 'green' ? 'text-green-800' : info.color === 'amber' ? 'text-amber-800' : 'text-red-800';

  return (
    <div className={`border rounded-lg p-4 ${bgColor} ${borderColor}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${textColor}`} />
        <div className="flex-1 space-y-3">
          <div>
            <h4 className={`text-sm ${textColor}`} style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
              {info.title}
            </h4>
            <p className={`text-sm mt-1 ${textColor}`}>{info.description}</p>
          </div>

          {info.requiresJustification && budgetOverrun > 0 && (
            <div className="space-y-2">
              <p className={`text-sm ${textColor}`} style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Budget-Überschreitung: + € {budgetOverrun.toLocaleString('de-DE')} (+
                {((budgetOverrun / (totalAmount - budgetOverrun)) * 100).toFixed(1)}%)
              </p>
              <div className="space-y-2">
                <Label htmlFor="justification" className={textColor}>
                  Bitte Begründung hinzufügen:
                </Label>
                <Textarea
                  id="justification"
                  value={justification}
                  onChange={(e) => {
                    setJustification(e.target.value);
                    onJustificationChange?.(e.target.value);
                  }}
                  placeholder="Begründung für Budget-Überschreitung..."
                  className="resize-none h-20"
                  maxLength={500}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Budget Validation Component
export interface BudgetValidationProps {
  projectBudget: number;
  alreadyOrdered: number;
  thisOrder: number;
}

export function BudgetValidation({ projectBudget, alreadyOrdered, thisOrder }: BudgetValidationProps) {
  const afterOrder = alreadyOrdered + thisOrder;
  const overBudget = afterOrder - projectBudget;
  const overBudgetPercent = (overBudget / projectBudget) * 100;

  const getColor = () => {
    const usage = (afterOrder / projectBudget) * 100;
    if (usage < 80) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: CheckCircle };
    if (usage < 100) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: Info };
    if (usage < 110) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: AlertTriangle };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: AlertTriangle };
  };

  const colors = getColor();
  const Icon = colors.icon;

  return (
    <div className={`border rounded-lg p-4 ${colors.bg} ${colors.border}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${colors.text}`} />
        <div className="flex-1 space-y-2">
          <h4 className={`text-sm ${colors.text}`} style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Budget-Information
          </h4>
          <div className={`text-sm space-y-1 ${colors.text}`}>
            <div className="flex items-center justify-between">
              <span>Projektbudget (Material):</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                € {projectBudget.toLocaleString('de-DE')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Bereits bestellt:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                € {alreadyOrdered.toLocaleString('de-DE')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Diese Bestellung:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                € {thisOrder.toLocaleString('de-DE')}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Nach Bestellung:</span>
              <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                € {afterOrder.toLocaleString('de-DE')}
              </span>
            </div>
          </div>

          {overBudget > 0 && (
            <Alert className={`${colors.bg} border-0 mt-3`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className={`text-sm ${colors.text}`} style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                WARNUNG: Budget um € {overBudget.toLocaleString('de-DE')} überschritten (
                {overBudgetPercent.toFixed(0)}%)
              </AlertDescription>
            </Alert>
          )}

          {overBudget > 0 && (
            <p className={`text-sm ${colors.text}`} style={{ fontWeight: 'var(--font-weight-medium)' }}>
              GF-Freigabe erforderlich.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Purchase Order Form
export interface PurchaseOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<PurchaseOrderFormData>, isDraft: boolean) => void;
}

export function PurchaseOrderForm({ open, onOpenChange, onSave }: PurchaseOrderFormProps) {
  // Header
  const [poNumber] = useState('PO-2025-00234');
  const [projectId, setProjectId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [requiredByDate, setRequiredByDate] = useState('');
  const createdBy = 'Claudia Weber (INN)';
  const creationDate = new Date().toLocaleDateString('de-DE');

  // Line Items
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: '1',
      materialId: '',
      materialName: '',
      materialCode: '',
      description: '',
      quantity: 1,
      unit: 'Stück',
      unitPrice: 0,
      taxRate: '19',
      netAmount: 0,
    },
  ]);

  // Totals
  const [shippingCost, setShippingCost] = useState(0);

  // Delivery
  const [deliveryAddress, setDeliveryAddress] = useState<'construction_site' | 'warehouse'>('construction_site');
  const [contactPersonId, setContactPersonId] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [allowPartialDeliveries, setAllowPartialDeliveries] = useState(true);

  // Calculations
  const subtotal = lineItems.reduce((sum, item) => sum + item.netAmount, 0);
  const taxAmount = lineItems.reduce((sum, item) => {
    const rate = parseInt(item.taxRate) / 100;
    return sum + item.netAmount * rate;
  }, 0);
  const totalAmount = subtotal + taxAmount + shippingCost;

  // Budget
  const selectedProject = mockProjects.find((p) => p.id === projectId);
  const projectBudget = selectedProject?.budget || 0;
  const alreadyOrdered = selectedProject?.spent || 0;
  const budgetOverrun = Math.max(0, alreadyOrdered + totalAmount - projectBudget);

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        materialId: '',
        materialName: '',
        materialCode: '',
        description: '',
        quantity: 1,
        unit: 'Stück',
        unitPrice: 0,
        taxRate: '19',
        netAmount: 0,
      },
    ]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleUpdateLineItem = (id: string, updated: LineItem) => {
    setLineItems(lineItems.map((item) => (item.id === id ? updated : item)));
  };

  const handleDuplicateLineItem = (id: string) => {
    const item = lineItems.find((i) => i.id === id);
    if (item) {
      setLineItems([
        ...lineItems,
        { ...item, id: Date.now().toString() },
      ]);
    }
  };

  const handleSubmit = (isDraft: boolean) => {
    // Validation
    if (!projectId) {
      toast.error('Projekt ist erforderlich');
      return;
    }

    if (!supplierId) {
      toast.error('Lieferant ist erforderlich');
      return;
    }

    if (!requiredByDate) {
      toast.error('Lieferdatum ist erforderlich');
      return;
    }

    if (lineItems.length === 0 || !lineItems.some((item) => item.materialId)) {
      toast.error('Mindestens eine Position erforderlich');
      return;
    }

    if (!contactPersonId) {
      toast.error('Ansprechpartner vor Ort ist erforderlich');
      return;
    }

    // Check for duplicate materials
    const materialIds = lineItems.map((item) => item.materialId);
    const duplicates = materialIds.filter((id, index) => materialIds.indexOf(id) !== index);
    if (duplicates.length > 0) {
      toast.error('Material bereits in Bestellung vorhanden');
      return;
    }

    const formData: Partial<PurchaseOrderFormData> = {
      poNumber,
      projectId,
      supplierId,
      requiredByDate,
      createdBy,
      creationDate,
      lineItems: lineItems.filter((item) => item.materialId),
      shippingCost,
      deliveryAddress,
      contactPersonId,
      deliveryNotes: deliveryNotes || undefined,
      allowPartialDeliveries,
      status: isDraft ? 'draft' : totalAmount <= 1000 ? 'approved' : 'pending_approval',
    };

    onSave(formData, isDraft);
    onOpenChange(false);
  };

  const supplier = mockSuppliers.find((s) => s.id === supplierId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Bestellung erstellen</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] px-6">
          <div className="space-y-6 pb-6">
            {/* Section 1: Header Information */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Kopfdaten
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="po-number">Bestellnummer</Label>
                    <div className="flex gap-2">
                      <Input
                        id="po-number"
                        value={poNumber}
                        readOnly
                        className="bg-muted"
                      />
                      <Button variant="outline" size="sm">
                        <Wand2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">(automatisch)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="required-by">
                      Benötigt bis <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="required-by"
                      type="date"
                      value={requiredByDate}
                      onChange={(e) => setRequiredByDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project">
                    Projekt <span className="text-destructive">*</span>
                  </Label>
                  <Select value={projectId} onValueChange={setProjectId}>
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Projekt wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.number}: {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier">
                    Lieferant <span className="text-destructive">*</span>
                  </Label>
                  <Select value={supplierId} onValueChange={setSupplierId}>
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Lieferant wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSuppliers.map((sup) => (
                        <SelectItem key={sup.id} value={sup.id}>
                          {sup.name} ({sup.location})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {supplier && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>Zahlungsziel: {supplier.paymentTerms}</span>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Erstellt von</Label>
                    <p className="text-sm">{createdBy}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Erstellungsdatum</Label>
                    <p className="text-sm">{creationDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Line Items */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Positionen
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {lineItems.map((item, index) => (
                  <LineItemRow
                    key={item.id}
                    item={item}
                    index={index}
                    canRemove={lineItems.length > 1}
                    onUpdate={(updated) => handleUpdateLineItem(item.id, updated)}
                    onRemove={() => handleRemoveLineItem(item.id)}
                    onDuplicate={() => handleDuplicateLineItem(item.id)}
                  />
                ))}

                <Button variant="outline" onClick={handleAddLineItem} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Weitere Position hinzufügen
                </Button>

                {/* Totals Section */}
                <div className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Label htmlFor="shipping">Versandkosten</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="shipping"
                          type="number"
                          min="0"
                          step="0.01"
                          value={shippingCost}
                          onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">€</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 min-w-[300px]" style={{ borderColor: 'var(--border)' }}>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Zwischensumme:</span>
                          <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                            € {subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">MwSt. (19%):</span>
                          <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                            € {taxAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Versandkosten:</span>
                          <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                            € {shippingCost.toFixed(2)}
                          </span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between text-lg">
                          <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Gesamtbetrag:</span>
                          <span
                            className={totalAmount > 10000 ? 'text-amber-600' : 'text-blue-600'}
                            style={{ fontWeight: 'var(--font-weight-bold)' }}
                          >
                            € {totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Validation */}
            {projectId && totalAmount > 0 && (
              <BudgetValidation
                projectBudget={projectBudget}
                alreadyOrdered={alreadyOrdered}
                thisOrder={totalAmount}
              />
            )}

            {/* Section 4: Delivery Details */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Lieferdetails
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>
                    Lieferadresse <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup value={deliveryAddress} onValueChange={(v: any) => setDeliveryAddress(v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="construction_site" id="construction-site" />
                      <Label htmlFor="construction-site">Baustelle (Projektadresse)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="warehouse" id="warehouse" />
                      <Label htmlFor="warehouse">Lager</Label>
                    </div>
                  </RadioGroup>
                  {deliveryAddress === 'construction_site' && selectedProject && (
                    <p className="text-sm text-muted-foreground pl-6">
                      Lieferadresse: {selectedProject.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-person">
                    Ansprechpartner vor Ort <span className="text-destructive">*</span>
                  </Label>
                  <Select value={contactPersonId} onValueChange={setContactPersonId}>
                    <SelectTrigger id="contact-person">
                      <SelectValue placeholder="Ansprechpartner wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockContacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name} ({contact.role}) • {contact.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery-notes">Lieferhinweise</Label>
                  <Textarea
                    id="delivery-notes"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Besondere Anweisungen für die Lieferung (z.B. Anlieferung nur vormittags)..."
                    className="resize-none h-20"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {deliveryNotes.length} / 500
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="partial-deliveries"
                    checked={allowPartialDeliveries}
                    onCheckedChange={(checked) => setAllowPartialDeliveries(!!checked)}
                  />
                  <Label htmlFor="partial-deliveries">Teillieferungen erlaubt</Label>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Lieferant darf in mehreren Teillieferungen liefern
                </p>
              </CardContent>
            </Card>

            {/* Approval Indicator */}
            {totalAmount > 0 && (
              <ApprovalIndicator
                totalAmount={totalAmount}
                budgetOverrun={budgetOverrun}
              />
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSubmit(true)}>
              <Save className="h-4 w-4 mr-2" />
              Entwurf speichern
            </Button>
            <Button onClick={() => handleSubmit(false)}>
              <Send className="h-4 w-4 mr-2" />
              {totalAmount <= 1000 ? 'An Lieferant senden' : 'Zur Freigabe senden'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Demo Component
export function PurchaseOrderFormDemo() {
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data: Partial<PurchaseOrderFormData>, isDraft: boolean) => {
    const statusText = isDraft ? 'als Entwurf gespeichert' : 
      data.status === 'approved' ? 'genehmigt und kann an Lieferanten gesendet werden' :
      'zur Freigabe gesendet';
    
    toast.success(`Bestellung ${statusText}`, {
      description: `${data.poNumber} - € ${data.lineItems?.reduce((sum, item) => sum + item.netAmount, 0).toFixed(2) || 0}`,
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Bestellformular</h2>
        <p className="text-sm text-muted-foreground">
          Umfassendes Bestellformular für Materialien mit Positionsverwaltung, automatischer
          Budgetvalidierung, Freigabe-Workflow und Lieferdetails
        </p>
      </div>

      {/* Form Launcher */}
      <Card>
        <CardHeader>
          <h3>Neue Bestellung erstellen</h3>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Bestellung erstellen
          </Button>
        </CardContent>
      </Card>

      {/* Approval Workflow */}
      <Card>
        <CardHeader>
          <h3>Freigabe-Workflow</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Automatische Routing basierend auf Bestellwert
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-green-50" style={{ borderColor: 'var(--border)' }}>
              <h4 className="text-sm mb-2" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                ≤ € 1.000
              </h4>
              <Badge variant="outline" className="mb-2 bg-green-100 text-green-800">
                Auto-Genehmigung
              </Badge>
              <p className="text-xs text-muted-foreground">
                Direkt an Lieferant senden
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-amber-50" style={{ borderColor: 'var(--border)' }}>
              <h4 className="text-sm mb-2" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                € 1.000 - € 10.000
              </h4>
              <Badge variant="outline" className="mb-2 bg-amber-100 text-amber-800">
                BUCH-Freigabe
              </Badge>
              <p className="text-xs text-muted-foreground">
                Buchhaltung prüft
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-red-50" style={{ borderColor: 'var(--border)' }}>
              <h4 className="text-sm mb-2" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                &gt; € 10.000
              </h4>
              <Badge variant="outline" className="mb-2 bg-red-100 text-red-800">
                GF-Freigabe
              </Badge>
              <p className="text-xs text-muted-foreground">
                Geschäftsführung genehmigt
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <h3>Formular-Features</h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>5 Sektionen:</strong> Kopfdaten, Positionen, Summen, Lieferdetails,
              Budget-Validierung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Auto-Berechnung:</strong> Nettobetrag, MwSt., Gesamtsumme pro Position und
              gesamt
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Line Items:</strong> Unbegrenzte Positionen mit Duplizieren-Funktion
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>MOQ-Warnung:</strong> Zeigt Warnung wenn unter Mindestbestellmenge
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Budget-Tracking:</strong> Echtzeit-Validierung gegen Projektbudget
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Farbcodierte Budgets:</strong> Grün (&lt;80%), Blau (80-100%), Gelb (100-110%),
              Rot (&gt;110%)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Freigabe-Indikatoren:</strong> Dynamische Anzeige basierend auf Gesamtwert
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Lieferanteninfos:</strong> Zeigt Zahlungsbedingungen unter Lieferantenauswahl
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Duplicate Detection:</strong> Verhindert doppelte Materialien in einer
              Bestellung
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
          <p>• Projekt: Erforderlich</p>
          <p>• Lieferant: Erforderlich</p>
          <p>• Lieferdatum: Erforderlich, ≥heute, ≤Projektende</p>
          <p>• Mindestens 1 Position erforderlich</p>
          <p>• Keine doppelten Materialien pro Bestellung</p>
          <p>• Menge muss &gt; 0 sein</p>
          <p>• Ansprechpartner vor Ort: Erforderlich</p>
          <p>• Budget-Überschreitung &gt;10%: GF-Freigabe + Begründung erforderlich</p>
          <p>• MwSt.: 19%, 7%, oder 0%</p>
          <p>• Bestellwert &gt;€10k: Farbcodiert gelb/rot</p>
        </CardContent>
      </Card>

      {/* Purchase Order Form */}
      <PurchaseOrderForm
        open={showForm}
        onOpenChange={setShowForm}
        onSave={handleSave}
      />
    </div>
  );
}