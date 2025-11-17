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
  SelectGroup,
  SelectLabel,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import {
  Save,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  Upload,
  Star,
  FileText,
  Camera,
  Wand2,
} from 'lucide-react';

// Types
export type MaterialCategory =
  | 'shelving'
  | 'display_units'
  | 'counters'
  | 'seating'
  | 'tables'
  | 'storage_furniture'
  | 'ceiling_lights'
  | 'spot_lights'
  | 'led_strips'
  | 'signage_lights'
  | 'wood'
  | 'metal'
  | 'glass'
  | 'electrical'
  | 'plumbing'
  | 'flooring'
  | 'tiles'
  | 'tools'
  | 'consumables';

export type UnitOfMeasure = 'piece' | 'sqm' | 'lfm' | 'cbm' | 'kg' | 'liter' | 'package' | 'set';

export interface SupplierPrice {
  id: string;
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  minimumOrderQuantity: number;
  leadTimeDays: number;
  isPreferred: boolean;
  notes?: string;
  hasBulkDiscounts?: boolean;
  bulkDiscounts?: Array<{
    quantity: number;
    discountPercent: number;
  }>;
}

export interface MaterialFormData {
  // Basic Information
  materialName: string;
  materialCode: string;
  category: MaterialCategory;
  subcategory?: string;
  unit: UnitOfMeasure;

  // Description & Specs
  description: string;
  hasDimensions?: boolean;
  length?: number;
  width?: number;
  height?: number;
  diameter?: number;
  dimensionUnit?: 'cm' | 'mm' | 'm';
  color?: string;
  finish?: string;
  materialType?: string;
  weight?: number;

  // Manufacturer & Catalog
  manufacturer?: string;
  manufacturerSKU?: string;
  productLine?: string;
  ean?: string;

  // Supplier Prices
  supplierPrices: SupplierPrice[];

  // Inventory (Phase 2)
  trackInventory?: boolean;
  currentStock?: number;
  minimumStock?: number;
  maximumStock?: number;
  stockLocation?: string;

  // Documents
  datasheet?: File;
  installationGuide?: File;
  productImages?: File[];

  // Tags & Notes
  tags?: string[];
  internalNotes?: string;
}

// Material Categories with Icons
export const materialCategories = {
  shelving_display: {
    label: 'Regale & Präsentation',
    items: [
      { id: 'shelving' as MaterialCategory, label: 'Regale', icon: '🗄️' },
      { id: 'display_units' as MaterialCategory, label: 'Präsentationsvitrinen', icon: '📦' },
      { id: 'counters' as MaterialCategory, label: 'Theken', icon: '🏪' },
    ],
  },
  furniture: {
    label: 'Möbel',
    items: [
      { id: 'seating' as MaterialCategory, label: 'Sitzmöbel', icon: '🪑' },
      { id: 'tables' as MaterialCategory, label: 'Tische', icon: '🍽️' },
      { id: 'storage_furniture' as MaterialCategory, label: 'Lagermöbel', icon: '🗃️' },
    ],
  },
  lighting: {
    label: 'Beleuchtung',
    items: [
      { id: 'ceiling_lights' as MaterialCategory, label: 'Deckenleuchten', icon: '💡' },
      { id: 'spot_lights' as MaterialCategory, label: 'Strahler', icon: '🔦' },
      { id: 'led_strips' as MaterialCategory, label: 'LED-Bänder', icon: '💡' },
      { id: 'signage_lights' as MaterialCategory, label: 'Leuchtschriften', icon: '🪧' },
    ],
  },
  raw_materials: {
    label: 'Rohmaterialien',
    items: [
      { id: 'wood' as MaterialCategory, label: 'Holz', icon: '🪵' },
      { id: 'metal' as MaterialCategory, label: 'Metall', icon: '🔩' },
      { id: 'glass' as MaterialCategory, label: 'Glas', icon: '🪟' },
    ],
  },
  electrical_plumbing: {
    label: 'Elektrik & Sanitär',
    items: [
      { id: 'electrical' as MaterialCategory, label: 'Elektrik-Komponenten', icon: '⚡' },
      { id: 'plumbing' as MaterialCategory, label: 'Sanitär-Armaturen', icon: '🚿' },
    ],
  },
  flooring: {
    label: 'Bodenbeläge',
    items: [
      { id: 'flooring' as MaterialCategory, label: 'Bodenbeläge', icon: '🟫' },
      { id: 'tiles' as MaterialCategory, label: 'Fliesen', icon: '🧱' },
    ],
  },
  other: {
    label: 'Sonstiges',
    items: [
      { id: 'tools' as MaterialCategory, label: 'Werkzeuge', icon: '🔧' },
      { id: 'consumables' as MaterialCategory, label: 'Verbrauchsmaterial', icon: '📦' },
    ],
  },
};

// Units of Measure
export const unitsOfMeasure: { id: UnitOfMeasure; label: string }[] = [
  { id: 'piece', label: 'Stück' },
  { id: 'sqm', label: 'm²' },
  { id: 'lfm', label: 'lfm' },
  { id: 'cbm', label: 'm³' },
  { id: 'kg', label: 'kg' },
  { id: 'liter', label: 'Liter' },
  { id: 'package', label: 'Paket' },
  { id: 'set', label: 'Set' },
];

// Mock Suppliers
export const mockSuppliers = [
  { id: 'sup1', name: 'Schreinerei Müller' },
  { id: 'sup2', name: 'Holzgroßhandel Weber' },
  { id: 'sup3', name: 'Elektro Schmidt' },
  { id: 'sup4', name: 'Baumarkt Meyer' },
];

// Supplier Price Row Component
export interface SupplierPriceRowProps {
  price: SupplierPrice;
  index: number;
  unit: string;
  canRemove: boolean;
  onUpdate: (updated: SupplierPrice) => void;
  onRemove: () => void;
  onSetPreferred: () => void;
}

export function SupplierPriceRow({
  price,
  index,
  unit,
  canRemove,
  onUpdate,
  onRemove,
  onSetPreferred,
}: SupplierPriceRowProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
          Lieferant {index + 1}
        </h4>
        {canRemove && (
          <Button variant="ghost" size="sm" onClick={onRemove} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`supplier-${price.id}`}>
            Lieferant <span className="text-destructive">*</span>
          </Label>
          <Select
            value={price.supplierId}
            onValueChange={(supplierId) => {
              const supplier = mockSuppliers.find((s) => s.id === supplierId);
              onUpdate({ ...price, supplierId, supplierName: supplier?.name || '' });
            }}
          >
            <SelectTrigger id={`supplier-${price.id}`}>
              <SelectValue placeholder="Lieferant wählen..." />
            </SelectTrigger>
            <SelectContent>
              {mockSuppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`unit-price-${price.id}`}>
            Stückpreis <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={`unit-price-${price.id}`}
              type="number"
              min="0.01"
              step="0.01"
              value={price.unitPrice}
              onChange={(e) =>
                onUpdate({ ...price, unitPrice: parseFloat(e.target.value) || 0 })
              }
              placeholder="145,00"
            />
            <span className="text-sm text-muted-foreground">€</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`moq-${price.id}`}>
            Mindestbestellmenge (MOQ) <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={`moq-${price.id}`}
              type="number"
              min="1"
              value={price.minimumOrderQuantity}
              onChange={(e) =>
                onUpdate({ ...price, minimumOrderQuantity: parseInt(e.target.value) || 1 })
              }
              placeholder="10"
            />
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`lead-time-${price.id}`}>
            Lieferzeit <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={`lead-time-${price.id}`}
              type="number"
              min="0"
              max="365"
              value={price.leadTimeDays}
              onChange={(e) =>
                onUpdate({ ...price, leadTimeDays: parseInt(e.target.value) || 0 })
              }
              placeholder="14"
            />
            <span className="text-sm text-muted-foreground">Tage</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div
          onClick={onSetPreferred}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div
            className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
              price.isPreferred ? 'border-primary bg-primary' : 'border-input'
            }`}
          >
            {price.isPreferred && <div className="h-2 w-2 rounded-full bg-white" />}
          </div>
          <Label className="cursor-pointer">
            Bevorzugter Lieferant
            {price.isPreferred && <Star className="inline h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
          </Label>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`bulk-${price.id}`}
            checked={price.hasBulkDiscounts}
            onCheckedChange={(checked) =>
              onUpdate({
                ...price,
                hasBulkDiscounts: !!checked,
                bulkDiscounts: checked
                  ? [{ quantity: 50, discountPercent: 5 }]
                  : undefined,
              })
            }
          />
          <Label htmlFor={`bulk-${price.id}`} className="text-sm">
            Mengenrabatte verfügbar
          </Label>
        </div>

        {price.hasBulkDiscounts && price.bulkDiscounts && (
          <div className="pl-6 space-y-2">
            {price.bulkDiscounts.map((discount, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Ab</span>
                  <Input
                    type="number"
                    min="1"
                    value={discount.quantity}
                    onChange={(e) => {
                      const updated = [...(price.bulkDiscounts || [])];
                      updated[idx].quantity = parseInt(e.target.value) || 1;
                      onUpdate({ ...price, bulkDiscounts: updated });
                    }}
                    className="h-8 w-16 text-center"
                  />
                  <span className="text-muted-foreground">{unit}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={discount.discountPercent}
                    onChange={(e) => {
                      const updated = [...(price.bulkDiscounts || [])];
                      updated[idx].discountPercent = parseFloat(e.target.value) || 0;
                      onUpdate({ ...price, bulkDiscounts: updated });
                    }}
                    className="h-8 w-16 text-center"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
                <div className="text-muted-foreground">
                  €{' '}
                  {(
                    price.unitPrice *
                    (1 - discount.discountPercent / 100)
                  ).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`notes-${price.id}`}>Notizen</Label>
        <Input
          id={`notes-${price.id}`}
          value={price.notes || ''}
          onChange={(e) => onUpdate({ ...price, notes: e.target.value })}
          placeholder="z.B. Preis gilt bis 31.12.2025"
          maxLength={200}
        />
      </div>
    </div>
  );
}

// Main Material Catalog Form
export interface MaterialCatalogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<MaterialFormData>, addAnother: boolean) => void;
}

export function MaterialCatalogForm({ open, onOpenChange, onSave }: MaterialCatalogFormProps) {
  // Basic Information
  const [materialName, setMaterialName] = useState('');
  const [materialCode, setMaterialCode] = useState('');
  const [category, setCategory] = useState<MaterialCategory | ''>('');
  const [subcategory, setSubcategory] = useState('');
  const [unit, setUnit] = useState<UnitOfMeasure>('piece');

  // Description & Specs
  const [description, setDescription] = useState('');
  const [hasDimensions, setHasDimensions] = useState(false);
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [diameter, setDiameter] = useState('');
  const [dimensionUnit, setDimensionUnit] = useState<'cm' | 'mm' | 'm'>('cm');
  const [color, setColor] = useState('');
  const [finish, setFinish] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [weight, setWeight] = useState('');

  // Manufacturer & Catalog
  const [manufacturer, setManufacturer] = useState('');
  const [manufacturerSKU, setManufacturerSKU] = useState('');
  const [productLine, setProductLine] = useState('');
  const [ean, setEan] = useState('');

  // Supplier Prices
  const [supplierPrices, setSupplierPrices] = useState<SupplierPrice[]>([
    {
      id: '1',
      supplierId: '',
      supplierName: '',
      unitPrice: 0,
      minimumOrderQuantity: 1,
      leadTimeDays: 14,
      isPreferred: true,
    },
  ]);

  // Inventory
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [trackInventory, setTrackInventory] = useState(false);
  const [currentStock, setCurrentStock] = useState('');
  const [minimumStock, setMinimumStock] = useState('');
  const [maximumStock, setMaximumStock] = useState('');
  const [stockLocation, setStockLocation] = useState('');

  // Documents
  const [datasheet, setDatasheet] = useState<File | null>(null);
  const [installationGuide, setInstallationGuide] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);

  // Tags & Notes
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  const selectedUnitLabel =
    unitsOfMeasure.find((u) => u.id === unit)?.label || 'Stück';

  const generateMaterialCode = () => {
    if (!category) {
      toast.error('Bitte zuerst Kategorie auswählen');
      return;
    }
    // Simple code generation - in real app, check database for uniqueness
    const categoryCode = category.slice(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const code = `MAT-${categoryCode}-${randomNum}`;
    setMaterialCode(code);
    toast.success('Materialcode generiert');
  };

  const handleAddSupplier = () => {
    setSupplierPrices([
      ...supplierPrices,
      {
        id: Date.now().toString(),
        supplierId: '',
        supplierName: '',
        unitPrice: 0,
        minimumOrderQuantity: 1,
        leadTimeDays: 14,
        isPreferred: false,
      },
    ]);
  };

  const handleRemoveSupplier = (id: string) => {
    setSupplierPrices(supplierPrices.filter((p) => p.id !== id));
  };

  const handleUpdateSupplier = (id: string, updated: SupplierPrice) => {
    setSupplierPrices(supplierPrices.map((p) => (p.id === id ? updated : p)));
  };

  const handleSetPreferred = (id: string) => {
    setSupplierPrices(
      supplierPrices.map((p) => ({ ...p, isPreferred: p.id === id }))
    );
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (tags.length >= 20) {
      toast.error('Maximal 20 Tags erlaubt');
      return;
    }
    if (tags.includes(tagInput.trim())) {
      toast.error('Tag bereits vorhanden');
      return;
    }
    setTags([...tags, tagInput.trim()]);
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Datei zu groß. Maximum 5MB.');
        return;
      }
      setter(file);
      toast.success(`${file.name} hochgeladen`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (productImages.length + files.length > 5) {
      toast.error('Maximal 5 Bilder erlaubt');
      return;
    }
    setProductImages([...productImages, ...files]);
    toast.success(`${files.length} Bild(er) hochgeladen`);
  };

  const handleSubmit = (addAnother: boolean) => {
    // Validation
    if (!materialName || materialName.length < 5) {
      toast.error('Materialname ist erforderlich (5-200 Zeichen)');
      return;
    }

    if (!materialCode) {
      toast.error('Materialcode ist erforderlich');
      return;
    }

    if (!category) {
      toast.error('Kategorie ist erforderlich');
      return;
    }

    if (!description || description.length < 20) {
      toast.error('Beschreibung erforderlich (20-1000 Zeichen)');
      return;
    }

    if (supplierPrices.length === 0 || !supplierPrices.some((p) => p.supplierId)) {
      toast.error('Mindestens ein Lieferant erforderlich');
      return;
    }

    const formData: Partial<MaterialFormData> = {
      materialName,
      materialCode,
      category,
      subcategory: subcategory || undefined,
      unit,
      description,
      hasDimensions,
      length: hasDimensions && length ? parseFloat(length) : undefined,
      width: hasDimensions && width ? parseFloat(width) : undefined,
      height: hasDimensions && height ? parseFloat(height) : undefined,
      diameter: hasDimensions && diameter ? parseFloat(diameter) : undefined,
      dimensionUnit: hasDimensions ? dimensionUnit : undefined,
      color: color || undefined,
      finish: finish || undefined,
      materialType: materialType || undefined,
      weight: weight ? parseFloat(weight) : undefined,
      manufacturer: manufacturer || undefined,
      manufacturerSKU: manufacturerSKU || undefined,
      productLine: productLine || undefined,
      ean: ean || undefined,
      supplierPrices: supplierPrices.filter((p) => p.supplierId),
      trackInventory,
      currentStock: trackInventory && currentStock ? parseFloat(currentStock) : undefined,
      minimumStock: trackInventory && minimumStock ? parseFloat(minimumStock) : undefined,
      maximumStock: trackInventory && maximumStock ? parseFloat(maximumStock) : undefined,
      stockLocation: trackInventory ? stockLocation : undefined,
      datasheet: datasheet || undefined,
      installationGuide: installationGuide || undefined,
      productImages: productImages.length > 0 ? productImages : undefined,
      tags: tags.length > 0 ? tags : undefined,
      internalNotes: internalNotes || undefined,
    };

    onSave(formData, addAnother);
    
    if (addAnother) {
      // Reset form but keep category
      const keepCategory = category;
      resetForm();
      setCategory(keepCategory);
    } else {
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setMaterialName('');
    setMaterialCode('');
    setCategory('');
    setSubcategory('');
    setUnit('piece');
    setDescription('');
    setHasDimensions(false);
    setLength('');
    setWidth('');
    setHeight('');
    setDiameter('');
    setColor('');
    setFinish('');
    setMaterialType('');
    setWeight('');
    setManufacturer('');
    setManufacturerSKU('');
    setProductLine('');
    setEan('');
    setSupplierPrices([
      {
        id: '1',
        supplierId: '',
        supplierName: '',
        unitPrice: 0,
        minimumOrderQuantity: 1,
        leadTimeDays: 14,
        isPreferred: true,
      },
    ]);
    setTrackInventory(false);
    setCurrentStock('');
    setMinimumStock('');
    setMaximumStock('');
    setStockLocation('');
    setDatasheet(null);
    setInstallationGuide(null);
    setProductImages([]);
    setTags([]);
    setTagInput('');
    setInternalNotes('');
  };

  // Calculate price summary
  const validPrices = supplierPrices.filter((p) => p.supplierId && p.unitPrice > 0);
  const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices.map((p) => p.unitPrice)) : 0;
  const highestPrice = validPrices.length > 0 ? Math.max(...validPrices.map((p) => p.unitPrice)) : 0;
  const averagePrice =
    validPrices.length > 0
      ? validPrices.reduce((sum, p) => sum + p.unitPrice, 0) / validPrices.length
      : 0;
  const preferredSupplier = validPrices.find((p) => p.isPreferred);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Material erfassen</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] px-6">
          <div className="space-y-6 pb-6">
            {/* Section 1: Basic Information */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Grundinformationen
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="material-name">
                    Materialname <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="material-name"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    placeholder="z.B. LED-Panel 60x60cm warmweiß"
                    maxLength={200}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material-code">
                      Materialcode <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="material-code"
                        value={materialCode}
                        onChange={(e) => setMaterialCode(e.target.value)}
                        placeholder="MAT-LED-001"
                      />
                      <Button
                        variant="outline"
                        onClick={generateMaterialCode}
                        className="shrink-0"
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Auto
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">
                      Mengeneinheit <span className="text-destructive">*</span>
                    </Label>
                    <Select value={unit} onValueChange={(v: UnitOfMeasure) => setUnit(v)}>
                      <SelectTrigger id="unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {unitsOfMeasure.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Kategorie <span className="text-destructive">*</span>
                  </Label>
                  <Select value={category} onValueChange={(v: MaterialCategory) => setCategory(v)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Kategorie wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(materialCategories).map(([key, group]) => (
                        <SelectGroup key={key}>
                          <SelectLabel>{group.label}</SelectLabel>
                          {group.items.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              <span className="mr-2">{item.icon}</span>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Unterkategorie</Label>
                  <Input
                    id="subcategory"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="z.B. Einbaustrahler, Wandleuchte"
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    (Optional) Weitere Spezifizierung
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Description & Specs */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Beschreibung & Spezifikationen
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Beschreibung <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detaillierte Beschreibung des Materials, technische Details, Einsatzbereiche..."
                    className="resize-none h-32"
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {description.length} / 1000
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has-dimensions"
                      checked={hasDimensions}
                      onCheckedChange={(checked) => setHasDimensions(!!checked)}
                    />
                    <Label htmlFor="has-dimensions">Abmessungen angeben</Label>
                  </div>

                  {hasDimensions && (
                    <div className="pl-6 grid grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="length" className="text-xs">
                          Länge
                        </Label>
                        <Input
                          id="length"
                          type="number"
                          min="0"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          placeholder="120"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="width" className="text-xs">
                          Breite
                        </Label>
                        <Input
                          id="width"
                          type="number"
                          min="0"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          placeholder="60"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="height" className="text-xs">
                          Höhe
                        </Label>
                        <Input
                          id="height"
                          type="number"
                          min="0"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="2"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="dim-unit" className="text-xs">
                          Einheit
                        </Label>
                        <Select
                          value={dimensionUnit}
                          onValueChange={(v: 'cm' | 'mm' | 'm') => setDimensionUnit(v)}
                        >
                          <SelectTrigger id="dim-unit">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="mm">mm</SelectItem>
                            <SelectItem value="m">m</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Farbe</Label>
                    <Input
                      id="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="z.B. Weiß RAL 9010"
                      maxLength={50}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="finish">Oberfläche</Label>
                    <Select value={finish} onValueChange={setFinish}>
                      <SelectTrigger id="finish">
                        <SelectValue placeholder="Oberflächenfinish wählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matt">Matt</SelectItem>
                        <SelectItem value="glaenzend">Glänzend</SelectItem>
                        <SelectItem value="seidenmatt">Seidenmatt</SelectItem>
                        <SelectItem value="gebürstet">Gebürstet</SelectItem>
                        <SelectItem value="poliert">Poliert</SelectItem>
                        <SelectItem value="roh">Roh</SelectItem>
                        <SelectItem value="lackiert">Lackiert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material-type">Materialtyp</Label>
                    <Select value={materialType} onValueChange={setMaterialType}>
                      <SelectTrigger id="material-type">
                        <SelectValue placeholder="Materialtyp wählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="holz">Holz</SelectItem>
                        <SelectItem value="metall">Metall</SelectItem>
                        <SelectItem value="glas">Glas</SelectItem>
                        <SelectItem value="kunststoff">Kunststoff</SelectItem>
                        <SelectItem value="stein">Stein</SelectItem>
                        <SelectItem value="textil">Textil</SelectItem>
                        <SelectItem value="verbund">Verbundwerkstoff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Gewicht</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="weight"
                        type="number"
                        min="0"
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="z.B. 12,5"
                      />
                      <span className="text-sm text-muted-foreground">kg</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      (Optional) Gewicht pro Einheit
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Manufacturer & Catalog */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Hersteller & Katalogdaten
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Hersteller</Label>
                    <Input
                      id="manufacturer"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      placeholder="z.B. IKEA, Osram, Siemens"
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manufacturer-sku">Hersteller-Artikelnummer</Label>
                    <Input
                      id="manufacturer-sku"
                      value={manufacturerSKU}
                      onChange={(e) => setManufacturerSKU(e.target.value)}
                      placeholder="z.B. 123.456.78"
                      maxLength={50}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-line">Produktlinie</Label>
                    <Input
                      id="product-line"
                      value={productLine}
                      onChange={(e) => setProductLine(e.target.value)}
                      placeholder="z.B. IKEA BESTÅ Serie"
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ean">EAN / Barcode</Label>
                    <div className="flex gap-2">
                      <Input
                        id="ean"
                        value={ean}
                        onChange={(e) => setEan(e.target.value)}
                        placeholder="1234567890123"
                        maxLength={13}
                      />
                      <Button variant="outline" className="shrink-0">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Supplier Prices */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Preise & Lieferanten
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {supplierPrices.map((price, index) => (
                  <SupplierPriceRow
                    key={price.id}
                    price={price}
                    index={index}
                    unit={selectedUnitLabel}
                    canRemove={supplierPrices.length > 1}
                    onUpdate={(updated) => handleUpdateSupplier(price.id, updated)}
                    onRemove={() => handleRemoveSupplier(price.id)}
                    onSetPreferred={() => handleSetPreferred(price.id)}
                  />
                ))}

                <Button variant="outline" onClick={handleAddSupplier} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Weiteren Lieferanten hinzufügen
                </Button>

                {validPrices.length > 0 && (
                  <div className="p-4 bg-primary/5 border rounded-lg" style={{ borderColor: 'var(--primary)' }}>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Preisspanne:</span>
                        <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                          € {lowestPrice.toFixed(2)} - € {highestPrice.toFixed(2)} (
                          {validPrices.length} Lieferanten)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Durchschnitt:</span>
                        <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                          € {averagePrice.toFixed(2)}
                        </span>
                      </div>
                      {preferredSupplier && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Bevorzugt:</span>
                          <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                            {preferredSupplier.supplierName} (€{' '}
                            {preferredSupplier.unitPrice.toFixed(2)})
                            <Star className="inline h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section 5: Inventory */}
            <Collapsible open={inventoryOpen} onOpenChange={setInventoryOpen}>
              <Card>
                <CardHeader>
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                      Lagerbestand [Phase 2]
                    </h3>
                    {inventoryOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="track-inventory"
                        checked={trackInventory}
                        onCheckedChange={(checked) => setTrackInventory(!!checked)}
                      />
                      <Label htmlFor="track-inventory">
                        Lagerbestand für dieses Material verfolgen
                      </Label>
                    </div>

                    {trackInventory && (
                      <>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-stock">
                              Aktueller Bestand <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="current-stock"
                                type="number"
                                min="0"
                                value={currentStock}
                                onChange={(e) => setCurrentStock(e.target.value)}
                                placeholder="z.B. 50"
                              />
                              <span className="text-sm text-muted-foreground">
                                {selectedUnitLabel}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="min-stock">
                              Mindestbestand <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="min-stock"
                                type="number"
                                min="0"
                                value={minimumStock}
                                onChange={(e) => setMinimumStock(e.target.value)}
                                placeholder="z.B. 10"
                              />
                              <span className="text-sm text-muted-foreground">
                                {selectedUnitLabel}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Nachbestellung empfohlen
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="max-stock">Maximaler Bestand</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="max-stock"
                                type="number"
                                min="0"
                                value={maximumStock}
                                onChange={(e) => setMaximumStock(e.target.value)}
                                placeholder="z.B. 100"
                              />
                              <span className="text-sm text-muted-foreground">
                                {selectedUnitLabel}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">Lagerkapazität</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="stock-location">Lagerort</Label>
                          <Input
                            id="stock-location"
                            value={stockLocation}
                            onChange={(e) => setStockLocation(e.target.value)}
                            placeholder="z.B. Lager A, Regal 3, Fach 12"
                            maxLength={100}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Section 6: Documents */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Dokumente
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Technisches Datenblatt</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('datasheet-input')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      PDF hochladen
                    </Button>
                    <input
                      id="datasheet-input"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, setDatasheet)}
                      className="hidden"
                    />
                  </div>
                  {datasheet && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span>{datasheet.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDatasheet(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Montageanleitung</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById('installation-guide-input')?.click()
                      }
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      PDF hochladen
                    </Button>
                    <input
                      id="installation-guide-input"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, setInstallationGuide)}
                      className="hidden"
                    />
                  </div>
                  {installationGuide && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span>{installationGuide.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInstallationGuide(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Produktbilder (max. 5)</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('product-images-input')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Bilder hochladen
                    </Button>
                    <input
                      id="product-images-input"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  {productImages.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {productImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square border rounded"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <span className="text-xs">{img.name.slice(0, 8)}...</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setProductImages(productImages.filter((_, i) => i !== idx))
                            }
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-background"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Section 7: Tags & Notes */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Suchbegriffe & Notizen
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Suchbegriffe / Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Tags eingeben..."
                      maxLength={30}
                    />
                    <Button onClick={handleAddTag} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:bg-destructive/20 rounded-sm"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Beispiele: LED, Deckenleuchte, warmweiß, dimmbar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="internal-notes">Interne Notizen</Label>
                  <Textarea
                    id="internal-notes"
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Interne Hinweise zu diesem Material (nur für Team sichtbar)..."
                    className="resize-none h-24"
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nicht für Kunden sichtbar • {internalNotes.length} / 1000
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSubmit(true)}>
              <Save className="h-4 w-4 mr-2" />
              Speichern & Weiteres
            </Button>
            <Button onClick={() => handleSubmit(false)}>
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Demo Component
export function MaterialCatalogFormDemo() {
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data: Partial<MaterialFormData>, addAnother: boolean) => {
    const action = addAnother ? 'gespeichert. Weiteres Material erfassen...' : 'gespeichert';
    toast.success(`Material ${action}`, {
      description: `${data.materialName} (${data.materialCode})`,
    });
    
    if (!addAnother) {
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Materialkatalog-Formular</h2>
        <p className="text-sm text-muted-foreground">
          Umfassendes Formular zur Erfassung von Bau-/Einzelhandelsmaterialien mit Spezifikationen,
          Multi-Lieferanten-Preisen, Bestandsverwaltung und deutschen Labels
        </p>
      </div>

      {/* Form Launcher */}
      <Card>
        <CardHeader>
          <h3>Neues Material erfassen</h3>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Material erfassen
          </Button>
        </CardContent>
      </Card>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <h3>Materialkategorien</h3>
          <p className="text-sm text-muted-foreground mt-1">
            7 Hauptgruppen mit 19 Kategorien
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(materialCategories).map(([key, group]) => (
            <div key={key}>
              <h4 className="text-sm mb-2" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                {group.label}
              </h4>
              <div className="grid md:grid-cols-3 gap-2">
                {group.items.map((item) => (
                  <Badge key={item.id} variant="outline" className="justify-start">
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
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
              <strong>7 Sektionen:</strong> Grundinformationen, Beschreibung & Spezifikationen,
              Hersteller, Preise & Lieferanten, Lagerbestand, Dokumente, Suchbegriffe
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Auto-Generierung:</strong> Materialcode automatisch generieren (MAT-XXX-###)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Multi-Lieferanten:</strong> Unbegrenzte Lieferanten mit individuellen Preisen,
              MOQ, Lieferzeiten
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Bevorzugter Lieferant:</strong> Radio-Auswahl mit Stern-Icon ⭐
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Mengenrabatte:</strong> Staffelpreise pro Lieferant mit Auto-Berechnung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Preiszusammenfassung:</strong> Spanne, Durchschnitt, bevorzugter Preis
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Abmessungen:</strong> Optional mit L × B × H × Ø in cm/mm/m
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Bestandsverwaltung:</strong> Collapsible mit aktuell/min/max Bestand
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Dokumente:</strong> Datenblatt, Montageanleitung, Produktbilder (max. 5)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Tag-System:</strong> Suchbegriffe als Pills mit Enter-to-add
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Speichern & Weiteres:</strong> Formular zurücksetzen, Kategorie behalten
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
          <p>• Materialname: 5-200 Zeichen, erforderlich</p>
          <p>• Materialcode: Format MAT-XXX-###, erforderlich, eindeutig</p>
          <p>• Kategorie: Auswahl erforderlich</p>
          <p>• Mengeneinheit: Erforderlich, 8 Optionen</p>
          <p>• Beschreibung: 20-1000 Zeichen, erforderlich</p>
          <p>• Mindestens 1 Lieferant mit Preis erforderlich</p>
          <p>• Stückpreis: 0,01 - 100.000 €</p>
          <p>• MOQ: Min. 1, max. 10.000</p>
          <p>• Lieferzeit: 0-365 Tage</p>
          <p>• Nur 1 Lieferant kann bevorzugt sein</p>
          <p>• Dokumente: Max. 5MB pro Datei (PDF/Bilder)</p>
          <p>• Tags: Max. 20, max. 30 Zeichen pro Tag</p>
        </CardContent>
      </Card>

      {/* Material Catalog Form */}
      <MaterialCatalogForm
        open={showForm}
        onOpenChange={setShowForm}
        onSave={handleSave}
      />
    </div>
  );
}
