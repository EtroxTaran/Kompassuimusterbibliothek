import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import {
  Plus,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Star,
  FileText,
  Edit,
  TrendingDown,
  TrendingUp,
  Calendar,
  Building2,
  Image as ImageIcon,
  Upload,
  Camera,
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

// Types
export type MaterialStatus = 'not_ordered' | 'ordered' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled';
export type ProjectPhase = 'planning' | 'preparation' | 'construction' | 'installation' | 'finishing';
export type UserRole = 'INN' | 'PLAN' | 'BUCH' | 'GF' | 'KALK';
export type ViewMode = 'list' | 'phases' | 'cost_analysis';

export interface MaterialRequirement {
  id: string;
  materialCode: string;
  materialName: string;
  category: string;
  phase: ProjectPhase;
  estimatedQuantity: number;
  actualQuantity?: number;
  unit: string;
  estimatedUnitPrice: number;
  actualUnitPrice?: number;
  supplierId: string;
  supplierName: string;
  isPreferred: boolean;
  status: MaterialStatus;
  poNumber?: string;
  orderDate?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  imageUrl?: string;
}

export interface CostSummary {
  estimated: number;
  ordered: number;
  delivered: number;
  variance: number;
  variancePercentage: number;
  totalMaterials: number;
  orderedCount: number;
  deliveredCount: number;
}

// Mock Data
export const mockMaterials: MaterialRequirement[] = [
  {
    id: 'mat1',
    materialCode: 'MAT-LED-001',
    materialName: 'LED-Panel 60x60cm warmweiß',
    category: 'Beleuchtung',
    phase: 'installation',
    estimatedQuantity: 24,
    actualQuantity: 24,
    unit: 'Stk',
    estimatedUnitPrice: 145,
    actualUnitPrice: 142,
    supplierId: 'sup1',
    supplierName: 'Müller GmbH',
    isPreferred: true,
    status: 'delivered',
    poNumber: 'PO-2025-00234',
    orderDate: '25.01.2025',
    expectedDeliveryDate: '05.02.2025',
    actualDeliveryDate: '05.02.2025',
    notes: 'Panel für Deckenbeleuchtung im Verkaufsraum. Warmweiß für angenehme Atmosphäre.',
  },
  {
    id: 'mat2',
    materialCode: 'MAT-SHE-012',
    materialName: 'Ladenregal Eiche',
    category: 'Regale',
    phase: 'construction',
    estimatedQuantity: 8,
    unit: 'Stk',
    estimatedUnitPrice: 850,
    supplierId: 'sup2',
    supplierName: 'Weber KG',
    isPreferred: false,
    status: 'ordered',
    poNumber: 'PO-2025-00245',
    orderDate: '28.01.2025',
    expectedDeliveryDate: '15.02.2025',
  },
  {
    id: 'mat3',
    materialCode: 'MAT-FLR-008',
    materialName: 'Bodenbelag Vinyl',
    category: 'Bodenbeläge',
    phase: 'finishing',
    estimatedQuantity: 45,
    unit: 'm²',
    estimatedUnitPrice: 35,
    supplierId: 'sup3',
    supplierName: 'Schmidt',
    isPreferred: false,
    status: 'not_ordered',
  },
  {
    id: 'mat4',
    materialCode: 'MAT-CNT-005',
    materialName: 'Theke Edelstahl',
    category: 'Regale',
    phase: 'construction',
    estimatedQuantity: 1,
    unit: 'Stk',
    estimatedUnitPrice: 12000,
    supplierId: 'sup1',
    supplierName: 'Müller GmbH',
    isPreferred: true,
    status: 'in_transit',
    poNumber: 'PO-2025-00246',
    orderDate: '30.01.2025',
    expectedDeliveryDate: '20.02.2025',
  },
  {
    id: 'mat5',
    materialCode: 'MAT-ELE-022',
    materialName: 'Steckdosen weiß',
    category: 'Elektrik',
    phase: 'installation',
    estimatedQuantity: 40,
    actualQuantity: 50,
    unit: 'Stk',
    estimatedUnitPrice: 25,
    actualUnitPrice: 28,
    supplierId: 'sup4',
    supplierName: 'Elektro Schmidt',
    isPreferred: false,
    status: 'delivered',
    poNumber: 'PO-2025-00235',
    orderDate: '26.01.2025',
    expectedDeliveryDate: '08.02.2025',
    actualDeliveryDate: '08.02.2025',
    notes: 'Zusätzliche Steckdosen benötigt aufgrund Planänderung.',
  },
];

// Helper Functions
export function getPhaseLabel(phase: ProjectPhase): string {
  const labels: Record<ProjectPhase, string> = {
    planning: 'Planung',
    preparation: 'Vorbereitung',
    construction: 'Konstruktion',
    installation: 'Montage',
    finishing: 'Finishing',
  };
  return labels[phase];
}

export function getPhaseColor(phase: ProjectPhase): string {
  const colors: Record<ProjectPhase, string> = {
    planning: 'bg-purple-100 text-purple-800',
    preparation: 'bg-blue-100 text-blue-800',
    construction: 'bg-amber-100 text-amber-800',
    installation: 'bg-green-100 text-green-800',
    finishing: 'bg-pink-100 text-pink-800',
  };
  return colors[phase];
}

export function getStatusBadge(status: MaterialStatus) {
  const badges: Record<MaterialStatus, { label: string; variant: string; icon: any }> = {
    not_ordered: { label: 'Nicht bestellt', variant: 'bg-gray-100 text-gray-800', icon: Clock },
    ordered: { label: 'Bestellt', variant: 'bg-amber-100 text-amber-800', icon: Package },
    in_transit: { label: 'In Lieferung', variant: 'bg-blue-100 text-blue-800', icon: Truck },
    delivered: { label: 'Geliefert', variant: 'bg-green-100 text-green-800', icon: CheckCircle },
    delayed: { label: 'Verzögert', variant: 'bg-red-100 text-red-800', icon: AlertTriangle },
    cancelled: { label: 'Storniert', variant: 'bg-gray-100 text-gray-800', icon: XCircle },
  };
  return badges[status];
}

export function calculateCostSummary(materials: MaterialRequirement[]): CostSummary {
  const estimated = materials.reduce((sum, m) => sum + m.estimatedQuantity * m.estimatedUnitPrice, 0);
  const ordered = materials
    .filter((m) => ['ordered', 'in_transit', 'delivered'].includes(m.status))
    .reduce((sum, m) => sum + m.estimatedQuantity * m.estimatedUnitPrice, 0);
  const delivered = materials
    .filter((m) => m.status === 'delivered' && m.actualQuantity && m.actualUnitPrice)
    .reduce((sum, m) => sum + (m.actualQuantity || 0) * (m.actualUnitPrice || 0), 0);
  const variance = delivered - materials
    .filter((m) => m.status === 'delivered')
    .reduce((sum, m) => sum + m.estimatedQuantity * m.estimatedUnitPrice, 0);
  const variancePercentage = variance / estimated * 100;
  const orderedCount = materials.filter((m) => ['ordered', 'in_transit', 'delivered'].includes(m.status)).length;
  const deliveredCount = materials.filter((m) => m.status === 'delivered').length;

  return {
    estimated,
    ordered,
    delivered,
    variance,
    variancePercentage,
    totalMaterials: materials.length,
    orderedCount,
    deliveredCount,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}

// Cost Summary Cards Component
export interface CostSummaryCardsProps {
  summary: CostSummary;
}

export function CostSummaryCards({ summary }: CostSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Estimated Total */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Geschätzt</p>
            <p className="text-blue-600" style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-bold)' }}>
              {formatCurrency(summary.estimated)}
            </p>
            <p className="text-xs text-muted-foreground">KALK-Schätzung</p>
            <p className="text-xs text-muted-foreground">{summary.totalMaterials} Materialien</p>
          </div>
        </CardContent>
      </Card>

      {/* Ordered */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Bestellt</p>
            <p className="text-amber-600" style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-bold)' }}>
              {formatCurrency(summary.ordered)}
            </p>
            <p className="text-xs text-muted-foreground">
              {summary.orderedCount} von {summary.totalMaterials} Positionen bestellt
            </p>
            <p className="text-xs text-muted-foreground">
              {summary.totalMaterials - summary.orderedCount} Positionen offen
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Delivered */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Geliefert</p>
            <p className="text-green-600" style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-bold)' }}>
              {formatCurrency(summary.delivered)}
            </p>
            <p className="text-xs text-muted-foreground">
              {summary.deliveredCount} von {summary.totalMaterials} Positionen geliefert
            </p>
            <p className="text-xs text-muted-foreground">
              {summary.orderedCount - summary.deliveredCount} in Lieferung
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Variance */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Varianz</p>
            <p
              className={summary.variance < 0 ? 'text-green-600' : 'text-red-600'}
              style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-bold)' }}
            >
              {summary.variance < 0 ? '- ' : '+ '}
              {formatCurrency(Math.abs(summary.variance))}
            </p>
            <p className={`text-xs ${summary.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
              ({summary.variancePercentage > 0 ? '+' : ''}
              {summary.variancePercentage.toFixed(1)}%)
            </p>
            <div className="flex items-center gap-1">
              {summary.variance < 0 ? (
                <>
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <p className="text-xs text-green-600">Unter Budget</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3 text-red-600" />
                  <p className="text-xs text-red-600">Über Budget</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Material Row Component
export interface MaterialRowProps {
  material: MaterialRequirement;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  userRole: UserRole;
  onEdit: (id: string) => void;
  onRecordDelivery: (id: string) => void;
  onCreatePO: (id: string) => void;
}

export function MaterialRow({
  material,
  index,
  isExpanded,
  onToggleExpand,
  userRole,
  onEdit,
  onRecordDelivery,
  onCreatePO,
}: MaterialRowProps) {
  const statusBadge = getStatusBadge(material.status);
  const StatusIcon = statusBadge.icon;

  const estimatedTotal = material.estimatedQuantity * material.estimatedUnitPrice;
  const actualTotal = material.actualQuantity && material.actualUnitPrice
    ? material.actualQuantity * material.actualUnitPrice
    : null;
  const variance = actualTotal ? actualTotal - estimatedTotal : 0;

  const canManage = ['PLAN', 'INN'].includes(userRole);

  return (
    <>
      <tr className="border-b hover:bg-muted/50 cursor-pointer" onClick={onToggleExpand}>
        <td className="p-4 text-center">
          <Checkbox />
        </td>
        <td className="p-4 text-center text-muted-foreground">{index + 1}</td>
        <td className="p-4">
          <div className="flex items-center gap-3">
            {material.imageUrl ? (
              <img src={material.imageUrl} alt={material.materialName} className="w-10 h-10 rounded object-cover" />
            ) : (
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <p style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>{material.materialName}</p>
              <p className="text-xs text-muted-foreground">{material.materialCode}</p>
            </div>
          </div>
        </td>
        <td className="p-4">
          <Badge className={getPhaseColor(material.phase)}>{getPhaseLabel(material.phase)}</Badge>
        </td>
        <td className="p-4">
          <span className={material.actualQuantity ? 'text-green-600' : 'text-muted-foreground'}>
            {material.estimatedQuantity}
            {material.actualQuantity && `/${material.actualQuantity}`} {material.unit}
          </span>
          {material.actualQuantity && material.actualQuantity !== material.estimatedQuantity && (
            <span className={material.actualQuantity > material.estimatedQuantity ? 'text-red-600' : 'text-green-600'}>
              {' '}
              ({material.actualQuantity > material.estimatedQuantity ? '+' : ''}
              {material.actualQuantity - material.estimatedQuantity})
            </span>
          )}
        </td>
        <td className="p-4">
          <span className={material.actualUnitPrice ? (material.actualUnitPrice < material.estimatedUnitPrice ? 'text-green-600' : material.actualUnitPrice > material.estimatedUnitPrice ? 'text-red-600' : '') : 'text-muted-foreground'}>
            {formatCurrency(material.estimatedUnitPrice)}
            {material.actualUnitPrice && `/${formatCurrency(material.actualUnitPrice)}`}
          </span>
        </td>
        <td className="p-4">
          <div>
            <p
              className={actualTotal ? (actualTotal < estimatedTotal ? 'text-green-600' : actualTotal > estimatedTotal ? 'text-red-600' : 'text-blue-600') : 'text-blue-600'}
              style={{ fontWeight: 'var(--font-weight-semi-bold)' }}
            >
              {actualTotal ? formatCurrency(actualTotal) : formatCurrency(estimatedTotal)}
            </p>
            <p className="text-xs text-muted-foreground">({formatCurrency(estimatedTotal)})</p>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-1">
            <span>{material.supplierName}</span>
            {material.isPreferred && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
          </div>
        </td>
        <td className="p-4">
          <Badge className={statusBadge.variant}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusBadge.label}
          </Badge>
        </td>
        <td className="p-4">
          {material.actualDeliveryDate ? (
            <span className="text-green-600">{material.actualDeliveryDate}</span>
          ) : material.expectedDeliveryDate ? (
            <span className="text-blue-600">ETA: {material.expectedDeliveryDate}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </td>
        <td className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </td>
      </tr>

      {/* Expanded Row Details */}
      {isExpanded && (
        <tr className="bg-muted/30">
          <td colSpan={11} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Material Info */}
              <div className="space-y-4">
                <h4 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Material-Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kategorie:</span>
                    <span>{material.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phase:</span>
                    <Badge className={getPhaseColor(material.phase)}>{getPhaseLabel(material.phase)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Materialcode:</span>
                    <span>{material.materialCode}</span>
                  </div>
                </div>

                {material.poNumber && (
                  <>
                    <Separator />
                    <h4 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Beschaffung</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bestellung:</span>
                        <button className="text-blue-600 hover:underline">{material.poNumber}</button>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bestelldatum:</span>
                        <span>{material.orderDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lieferant:</span>
                        <span>{material.supplierName}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Kalkulation */}
              <div className="space-y-4">
                <h4 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Kalkulation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Geschätzte Menge:</span>
                    <span>{material.estimatedQuantity} {material.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Geschätzter Preis:</span>
                    <span>{formatCurrency(material.estimatedUnitPrice)}/{material.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Geschätzt Total:</span>
                    <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                      {formatCurrency(estimatedTotal)}
                    </span>
                  </div>
                  <Separator />
                  {material.actualQuantity && material.actualUnitPrice ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ist-Menge:</span>
                        <span>{material.actualQuantity} {material.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ist-Preis:</span>
                        <span>{formatCurrency(material.actualUnitPrice)}/{material.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ist Total:</span>
                        <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                          {formatCurrency(actualTotal!)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Varianz:</span>
                        <span className={variance < 0 ? 'text-green-600' : variance > 0 ? 'text-red-600' : ''}>
                          {variance < 0 ? '- ' : variance > 0 ? '+ ' : ''}
                          {formatCurrency(Math.abs(variance))}
                          {' '}({((variance / estimatedTotal) * 100).toFixed(1)}%)
                          {variance < 0 && ' ✓'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-xs">Noch nicht geliefert</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {material.notes && (
                <div className="md:col-span-2 space-y-2">
                  <h4 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Verwendungsnotizen</h4>
                  <p className="text-sm text-muted-foreground">{material.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="md:col-span-2 flex gap-2">
                {canManage && (
                  <Button variant="outline" size="sm" onClick={() => onEdit(material.id)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Bearbeiten
                  </Button>
                )}
                {material.status === 'not_ordered' && userRole === 'INN' && (
                  <Button size="sm" onClick={() => onCreatePO(material.id)}>
                    <FileText className="h-4 w-4 mr-1" />
                    Bestellung erstellen
                  </Button>
                )}
                {['ordered', 'in_transit'].includes(material.status) && userRole === 'INN' && (
                  <Button size="sm" onClick={() => onRecordDelivery(material.id)}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Lieferung erfassen
                  </Button>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// Delivery Recording Modal
export interface DeliveryModalProps {
  material: MaterialRequirement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function DeliveryModal({ material, open, onOpenChange, onSubmit }: DeliveryModalProps) {
  const [deliveredQuantity, setDeliveredQuantity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [condition, setCondition] = useState<'complete' | 'partial' | 'damaged'>('complete');
  const [damageDescription, setDamageDescription] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onSubmit({
      materialId: material?.id,
      deliveredQuantity: parseInt(deliveredQuantity),
      deliveryDate,
      condition,
      damageDescription: condition === 'damaged' ? damageDescription : undefined,
      notes,
    });
    onOpenChange(false);
  };

  if (!material) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Lieferung erfassen</DialogTitle>
          <DialogDescription>Material: {material.materialName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Bestellung:</span>
              <p>{material.poNumber}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Lieferant:</span>
              <p>{material.supplierName}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Bestellt: {material.estimatedQuantity} {material.unit}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Gelieferte Menge*</Label>
            <div className="flex gap-2">
              <Input
                id="quantity"
                type="number"
                value={deliveredQuantity}
                onChange={(e) => setDeliveredQuantity(e.target.value)}
                placeholder={material.estimatedQuantity.toString()}
              />
              <span className="flex items-center text-muted-foreground">{material.unit}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Lieferdatum*</Label>
            <Input
              id="date"
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Zustand*</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="complete"
                  name="condition"
                  checked={condition === 'complete'}
                  onChange={() => setCondition('complete')}
                  className="h-4 w-4"
                />
                <Label htmlFor="complete" className="cursor-pointer">
                  Vollständig und einwandfrei
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="partial"
                  name="condition"
                  checked={condition === 'partial'}
                  onChange={() => setCondition('partial')}
                  className="h-4 w-4"
                />
                <Label htmlFor="partial" className="cursor-pointer">
                  Teillieferung (weitere Lieferung folgt)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="damaged"
                  name="condition"
                  checked={condition === 'damaged'}
                  onChange={() => setCondition('damaged')}
                  className="h-4 w-4"
                />
                <Label htmlFor="damaged" className="cursor-pointer">
                  Beschädigt / Mangelhaft
                </Label>
              </div>
            </div>
          </div>

          {condition === 'damaged' && (
            <div className="space-y-2">
              <Label htmlFor="damage">Schadensbeschreibung*</Label>
              <Input
                id="damage"
                value={damageDescription}
                onChange={(e) => setDamageDescription(e.target.value)}
                placeholder="Beschreiben Sie den Schaden..."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notizen</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Zusätzliche Anmerkungen..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={!deliveredQuantity}>
            Lieferung erfassen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Cost Analysis Charts
export interface CostAnalysisProps {
  materials: MaterialRequirement[];
}

export function CostAnalysis({ materials }: CostAnalysisProps) {
  // Prepare category data for pie chart
  const categoryData = materials.reduce((acc, m) => {
    const existing = acc.find((c) => c.name === m.category);
    const cost = m.estimatedQuantity * m.estimatedUnitPrice;
    if (existing) {
      existing.value += cost;
    } else {
      acc.push({ name: m.category, value: cost });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Prepare comparison data for bar chart
  const comparisonData = categoryData.map((cat) => {
    const categoryMaterials = materials.filter((m) => m.category === cat.name);
    const estimated = categoryMaterials.reduce((sum, m) => sum + m.estimatedQuantity * m.estimatedUnitPrice, 0);
    const actual = categoryMaterials
      .filter((m) => m.actualQuantity && m.actualUnitPrice)
      .reduce((sum, m) => sum + (m.actualQuantity || 0) * (m.actualUnitPrice || 0), 0);
    return {
      name: cat.name,
      Geschätzt: estimated,
      Ist: actual,
    };
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Materialkosten nach Kategorie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${((entry.value / categoryData.reduce((sum, c) => sum + c.value, 0)) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Geschätzt vs. Ist-Kosten</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="Geschätzt" fill="#3b82f6" />
                <Bar dataKey="Ist" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Variance Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Varianzanalyse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Kategorie</th>
                  <th className="text-right p-3">Geschätzt</th>
                  <th className="text-right p-3">Ist</th>
                  <th className="text-right p-3">Varianz</th>
                  <th className="text-right p-3">%</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row) => {
                  const variance = row.Ist - row.Geschätzt;
                  const percentage = (variance / row.Geschätzt) * 100;
                  return (
                    <tr key={row.name} className="border-b">
                      <td className="p-3">{row.name}</td>
                      <td className="text-right p-3">{formatCurrency(row.Geschätzt)}</td>
                      <td className="text-right p-3">{row.Ist > 0 ? formatCurrency(row.Ist) : '—'}</td>
                      <td className={`text-right p-3 ${variance < 0 ? 'text-green-600' : variance > 0 ? 'text-red-600' : ''}`}>
                        {row.Ist > 0 ? `${variance < 0 ? '- ' : '+ '}${formatCurrency(Math.abs(variance))}` : '—'}
                      </td>
                      <td className={`text-right p-3 ${percentage < -5 ? 'text-green-600' : percentage > 5 ? 'text-red-600' : 'text-blue-600'}`}>
                        {row.Ist > 0 ? `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Project Materials View
export interface ProjectMaterialsViewProps {
  projectId?: string;
  projectName?: string;
  userRole?: UserRole;
}

export function ProjectMaterialsView({
  projectId = 'P-2025-M003',
  projectName = 'REWE München',
  userRole = 'PLAN',
}: ProjectMaterialsViewProps) {
  const [materials, setMaterials] = useState(mockMaterials);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialRequirement | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const summary = calculateCostSummary(materials);

  const handleToggleExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleRecordDelivery = (id: string) => {
    const material = materials.find((m) => m.id === id);
    setSelectedMaterial(material || null);
    setShowDeliveryModal(true);
  };

  const handleDeliverySubmit = (data: any) => {
    setMaterials(
      materials.map((m) =>
        m.id === data.materialId
          ? {
              ...m,
              actualQuantity: data.deliveredQuantity,
              actualUnitPrice: m.estimatedUnitPrice,
              status: data.condition === 'complete' ? 'delivered' : 'in_transit',
              actualDeliveryDate: data.deliveryDate,
            }
          : m
      )
    );
    toast.success('Lieferung erfasst. Projektkosten aktualisiert.');
  };

  const handleEdit = (id: string) => {
    toast.info(`Bearbeiten: ${id}`);
  };

  const handleCreatePO = (id: string) => {
    toast.info(`Bestellung erstellen für Material ${id}`);
  };

  const canManage = ['PLAN', 'INN'].includes(userRole);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <button className="hover:text-blue-600">Projekte</button>
          <span>{'>'}</span>
          <button className="hover:text-blue-600">{projectId}: {projectName}</button>
          <span>{'>'}</span>
          <span>Materialien</span>
        </div>
        <div className="flex items-center justify-between">
          <h1>Materialbedarf - Projekt {projectId}</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            {canManage && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Material hinzufügen
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cost Summary Cards */}
      <CostSummaryCards summary={summary} />

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <TabsList>
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="phases">Phasen</TabsTrigger>
          <TabsTrigger value="cost_analysis">Kosten-Analyse</TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setShowFilters(true)}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sortierung:</span>
              <Select defaultValue="phase">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phase">Nach Phase</SelectItem>
                  <SelectItem value="status">Nach Status</SelectItem>
                  <SelectItem value="variance">Nach Varianz</SelectItem>
                  <SelectItem value="delivery">Nach Lieferung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-4 w-12">
                        <Checkbox />
                      </th>
                      <th className="p-4 text-left">#</th>
                      <th className="p-4 text-left">Material</th>
                      <th className="p-4 text-left">Phase</th>
                      <th className="p-4 text-left">Menge</th>
                      <th className="p-4 text-left">Preis</th>
                      <th className="p-4 text-left">Gesamtkosten</th>
                      <th className="p-4 text-left">Lieferant</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Lieferung</th>
                      <th className="p-4 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((material, index) => (
                      <MaterialRow
                        key={material.id}
                        material={material}
                        index={index}
                        isExpanded={expandedRows.has(material.id)}
                        onToggleExpand={() => handleToggleExpand(material.id)}
                        userRole={userRole}
                        onEdit={handleEdit}
                        onRecordDelivery={handleRecordDelivery}
                        onCreatePO={handleCreatePO}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phases View */}
        <TabsContent value="phases" className="space-y-4">
          {(['planning', 'preparation', 'construction', 'installation', 'finishing'] as ProjectPhase[]).map((phase) => {
            const phaseMaterials = materials.filter((m) => m.phase === phase);
            if (phaseMaterials.length === 0) return null;

            const phaseEstimated = phaseMaterials.reduce((sum, m) => sum + m.estimatedQuantity * m.estimatedUnitPrice, 0);
            const phaseActual = phaseMaterials
              .filter((m) => m.actualQuantity && m.actualUnitPrice)
              .reduce((sum, m) => sum + (m.actualQuantity || 0) * (m.actualUnitPrice || 0), 0);

            return (
              <Card key={phase}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getPhaseColor(phase)}>{getPhaseLabel(phase)}</Badge>
                      <span className="text-muted-foreground">
                        ({phaseMaterials.length} Materialien)
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{formatCurrency(phaseEstimated)}</span>
                      {phaseActual > 0 && (
                        <>
                          <span className="text-muted-foreground">/</span>
                          <span className={phaseActual < phaseEstimated ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(phaseActual)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {phaseMaterials.map((material) => {
                      const statusBadge = getStatusBadge(material.status);
                      const StatusIcon = statusBadge.icon;
                      return (
                        <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p style={{ fontWeight: 'var(--font-weight-medium)' }}>{material.materialName}</p>
                              <p className="text-xs text-muted-foreground">
                                {material.estimatedQuantity} {material.unit}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm">
                              {formatCurrency(material.estimatedQuantity * material.estimatedUnitPrice)}
                            </span>
                            <Badge className={statusBadge.variant}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusBadge.label}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Cost Analysis View */}
        <TabsContent value="cost_analysis">
          <CostAnalysis materials={materials} />
        </TabsContent>
      </Tabs>

      {/* Delivery Modal */}
      <DeliveryModal
        material={selectedMaterial}
        open={showDeliveryModal}
        onOpenChange={setShowDeliveryModal}
        onSubmit={handleDeliverySubmit}
      />
    </div>
  );
}

// Demo Component
export function ProjectMaterialsViewDemo() {
  const [userRole, setUserRole] = useState<UserRole>('PLAN');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Projekt Materialbedarf (BOM)</h2>
        <p className="text-sm text-muted-foreground">
          Bill of Materials mit Echtzeit-Kostenverfolgung, Beschaffungsstatus und Budgetvarianzanalyse
        </p>
      </div>

      {/* Role Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Demo-Einstellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="role">Benutzerrolle:</Label>
            <Select value={userRole} onValueChange={(v: UserRole) => setUserRole(v)}>
              <SelectTrigger id="role" className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLAN">PLAN (Planung)</SelectItem>
                <SelectItem value="INN">INN (Außendienst)</SelectItem>
                <SelectItem value="KALK">KALK (Kalkulation)</SelectItem>
                <SelectItem value="BUCH">BUCH (Buchhaltung)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main View */}
      <ProjectMaterialsView userRole={userRole} />

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Funktionen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Kostenzusammenfassung:</strong> 4 KPI-Karten (Geschätzt, Bestellt, Geliefert, Varianz)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>3 Ansichten:</strong> Liste (Tabelle), Phasen (gruppiert), Kosten-Analyse (Charts)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Erweiterbarezeilen:</strong> Click um vollständige Material-Details anzuzeigen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Echtzeit-Kostenvergleich:</strong> Geschätzt vs. Ist mit Varianz-Indikatoren
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Lieferungserfassung:</strong> Modal zum Erfassen von Lieferungen mit Menge, Datum, Zustand
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Charts:</strong> Pie-Chart (Kategorien), Bar-Chart (Geschätzt vs. Ist), Varianzanalyse-Tabelle
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Status-Tracking:</strong> 6 Status-Badges mit Icons (Nicht bestellt, Bestellt, In Lieferung, Geliefert, Verzögert, Storniert)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Phasen-Groupierung:</strong> 5 Projektphasen (Planung, Vorbereitung, Konstruktion, Montage, Finishing)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Rollenbasierte Aktionen:</strong> PLAN/INN können bearbeiten, INN kann Bestellungen erstellen und Lieferungen erfassen
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mock Data Info */}
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle className="text-sm">Mock-Daten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Projekt: P-2025-M003 (REWE München Ladeneinrichtung)</p>
          <p>• 5 Materialien gesamt</p>
          <p>• Geschätzt: € 125.000 (5 Materialien)</p>
          <p>• Bestellt: € 118.450 (4 von 5 Positionen)</p>
          <p>• Geliefert: € 95.200 (2 von 5 Positionen)</p>
          <p>• Varianz: - € 6.550 (-5,2%) - unter Budget ✓</p>
          <p>• Kategorien: Beleuchtung, Regale, Bodenbeläge, Elektrik</p>
          <p>• Status: 2 geliefert, 1 in Lieferung, 1 bestellt, 1 nicht bestellt</p>
        </CardContent>
      </Card>
    </div>
  );
}
