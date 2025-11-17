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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  Save,
  Send,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  Package,
  Wrench,
  Users,
  Truck,
  Boxes,
} from 'lucide-react';

// Types
export type SupplierType = 'material_supplier' | 'service_provider' | 'subcontractor' | 'craftsman' | 'logistics' | 'mixed';
export type PaymentMethod = 'invoice' | 'direct_debit' | 'bank_transfer' | 'cash';

export interface SupplierFormData {
  // Basic Information
  companyName: string;
  legalForm?: string;
  vatNumber?: string;
  taxNumber?: string;
  supplierType: SupplierType;

  // Contact Information
  email: string;
  phone: string;
  mobile?: string;
  fax?: string;
  website?: string;

  // Address
  street: string;
  zipCode: string;
  city: string;
  country: string;
  additionalAddresses?: Array<{
    street: string;
    zipCode: string;
    city: string;
    country: string;
  }>;

  // Service Categories
  serviceCategories: string[];
  serviceDescription: string;
  workingRadius?: number;

  // Business Terms
  paymentMethod: PaymentMethod;
  paymentDays: number;
  earlyPaymentDiscount?: boolean;
  discountPercent?: number;
  discountDays?: number;
  minimumOrderValue?: number;
  deliveryLeadTime?: number;
  creditLimit?: number;

  // Documents
  insuranceCertificate?: File;
  tradeLicense?: File;
  qualifications?: File[];
  references?: File[];

  // Internal Notes
  notes?: string;
  accountManagerId: string;

  status: 'draft' | 'pending_approval' | 'approved';
}

// Supplier Types
export const supplierTypes = [
  { id: 'material_supplier' as SupplierType, label: 'Materiallieferant', icon: Package },
  { id: 'service_provider' as SupplierType, label: 'Dienstleister', icon: Wrench },
  { id: 'subcontractor' as SupplierType, label: 'Subunternehmer', icon: Users },
  { id: 'craftsman' as SupplierType, label: 'Handwerker', icon: Wrench },
  { id: 'logistics' as SupplierType, label: 'Logistik', icon: Truck },
  { id: 'mixed' as SupplierType, label: 'Gemischt', icon: Boxes },
];

// Service Categories
export const serviceCategories = {
  trades: [
    { id: 'carpentry', label: 'Tischlerei' },
    { id: 'metalwork', label: 'Metallbau' },
    { id: 'electrical', label: 'Elektrik' },
    { id: 'plumbing', label: 'Sanitär' },
    { id: 'hvac', label: 'Heizung/Klima' },
    { id: 'painting', label: 'Malerei' },
    { id: 'flooring', label: 'Bodenbeläge' },
  ],
  materials: [
    { id: 'wood', label: 'Holzmaterialien' },
    { id: 'metal', label: 'Metallmaterialien' },
    { id: 'lighting', label: 'Beleuchtung' },
    { id: 'furniture', label: 'Möbel' },
    { id: 'fixtures', label: 'Einrichtungsgegenstände' },
  ],
  services: [
    { id: 'installation', label: 'Montage' },
    { id: 'transport', label: 'Transport' },
    { id: 'disposal', label: 'Entsorgung' },
    { id: 'cleaning', label: 'Reinigung' },
    { id: 'other', label: 'Sonstige' },
  ],
};

// Desktop Supplier Form
export interface DesktopSupplierFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<SupplierFormData>, isDraft: boolean) => void;
}

export function DesktopSupplierForm({
  open,
  onOpenChange,
  onSave,
}: DesktopSupplierFormProps) {
  // Basic Information
  const [companyName, setCompanyName] = useState('');
  const [legalForm, setLegalForm] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [supplierType, setSupplierType] = useState<SupplierType>('subcontractor');

  // Contact Information
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [fax, setFax] = useState('');
  const [website, setWebsite] = useState('');

  // Address
  const [street, setStreet] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Deutschland');
  const [showAdditionalAddresses, setShowAdditionalAddresses] = useState(false);
  const [additionalAddresses, setAdditionalAddresses] = useState<any[]>([]);

  // Service Categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [serviceDescription, setServiceDescription] = useState('');
  const [workingRadius, setWorkingRadius] = useState('');

  // Business Terms
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('invoice');
  const [paymentDays, setPaymentDays] = useState(30);
  const [earlyPaymentDiscount, setEarlyPaymentDiscount] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(2);
  const [discountDays, setDiscountDays] = useState(10);
  const [minimumOrderValue, setMinimumOrderValue] = useState('');
  const [deliveryLeadTime, setDeliveryLeadTime] = useState('');
  const [creditLimit, setCreditLimit] = useState('');

  // Documents
  const [insuranceCertificate, setInsuranceCertificate] = useState<File | null>(null);
  const [tradeLicense, setTradeLicense] = useState<File | null>(null);
  const [qualifications, setQualifications] = useState<File[]>([]);
  const [references, setReferences] = useState<File[]>([]);

  // Internal Notes
  const [notes, setNotes] = useState('');
  const [accountManagerId, setAccountManagerId] = useState('user1');

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Datei zu groß. Maximum 10MB.');
        return;
      }
      setter(file);
      toast.success(`${file.name} hochgeladen`);
    }
  };

  const handleMultiFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File[]>>,
    maxFiles: number
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length + (setter === setQualifications ? qualifications.length : references.length) > maxFiles) {
      toast.error(`Maximal ${maxFiles} Dateien erlaubt`);
      return;
    }
    setter((prev) => [...prev, ...files]);
    toast.success(`${files.length} Datei(en) hochgeladen`);
  };

  const handleSubmit = (isDraft: boolean) => {
    // Validation
    if (!companyName || companyName.length < 2) {
      toast.error('Firmenname ist erforderlich (2-200 Zeichen)');
      return;
    }

    if (!email || !email.includes('@')) {
      toast.error('Gültige E-Mail-Adresse erforderlich');
      return;
    }

    if (!phone) {
      toast.error('Telefonnummer ist erforderlich');
      return;
    }

    if (!street) {
      toast.error('Straße ist erforderlich');
      return;
    }

    if (!zipCode || zipCode.length !== 5) {
      toast.error('Ungültige PLZ (5 Ziffern)');
      return;
    }

    if (!city) {
      toast.error('Stadt ist erforderlich');
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error('Mindestens eine Leistungskategorie erforderlich');
      return;
    }

    if (!serviceDescription || serviceDescription.length < 50) {
      toast.error('Leistungsbeschreibung erforderlich (50-1000 Zeichen)');
      return;
    }

    if (paymentDays < 0 || paymentDays > 120) {
      toast.error('Zahlungsziel ist erforderlich (0-120 Tage)');
      return;
    }

    if (!isDraft && (supplierType === 'service_provider' || supplierType === 'subcontractor')) {
      if (!insuranceCertificate) {
        toast.error('Versicherungsnachweis erforderlich für Dienstleister/Subunternehmer');
        return;
      }
    }

    if (!accountManagerId) {
      toast.error('Account Manager ist erforderlich');
      return;
    }

    const formData: Partial<SupplierFormData> = {
      companyName,
      legalForm: legalForm || undefined,
      vatNumber: vatNumber || undefined,
      taxNumber: taxNumber || undefined,
      supplierType,
      email,
      phone,
      mobile: mobile || undefined,
      fax: fax || undefined,
      website: website || undefined,
      street,
      zipCode,
      city,
      country,
      additionalAddresses: showAdditionalAddresses ? additionalAddresses : undefined,
      serviceCategories: selectedCategories,
      serviceDescription,
      workingRadius: workingRadius ? parseInt(workingRadius) : undefined,
      paymentMethod,
      paymentDays,
      earlyPaymentDiscount,
      discountPercent: earlyPaymentDiscount ? discountPercent : undefined,
      discountDays: earlyPaymentDiscount ? discountDays : undefined,
      minimumOrderValue: minimumOrderValue ? parseFloat(minimumOrderValue) : undefined,
      deliveryLeadTime: deliveryLeadTime ? parseInt(deliveryLeadTime) : undefined,
      creditLimit: creditLimit ? parseFloat(creditLimit) : undefined,
      insuranceCertificate: insuranceCertificate || undefined,
      tradeLicense: tradeLicense || undefined,
      qualifications: qualifications.length > 0 ? qualifications : undefined,
      references: references.length > 0 ? references : undefined,
      notes: notes || undefined,
      accountManagerId,
      status: isDraft ? 'draft' : 'pending_approval',
    };

    onSave(formData, isDraft);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Lieferant / Subunternehmer erfassen</DialogTitle>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">
                      Firmenname <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="z.B. Schreinerei Müller GmbH"
                      maxLength={200}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="legal-form">Rechtsform</Label>
                    <Select value={legalForm} onValueChange={setLegalForm}>
                      <SelectTrigger id="legal-form">
                        <SelectValue placeholder="Rechtsform wählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GmbH">GmbH</SelectItem>
                        <SelectItem value="AG">AG</SelectItem>
                        <SelectItem value="eK">e.K.</SelectItem>
                        <SelectItem value="GbR">GbR</SelectItem>
                        <SelectItem value="UG">UG</SelectItem>
                        <SelectItem value="Einzelunternehmen">Einzelunternehmen</SelectItem>
                        <SelectItem value="Sonstige">Sonstige</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vat-number">USt-IdNr.</Label>
                    <Input
                      id="vat-number"
                      value={vatNumber}
                      onChange={(e) => setVatNumber(e.target.value)}
                      placeholder="DE123456789"
                      pattern="DE[0-9]{9}"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax-number">Steuernummer</Label>
                    <Input
                      id="tax-number"
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(e.target.value)}
                      placeholder="12/345/67890"
                      maxLength={20}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>
                    Lieferanten-Typ <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup value={supplierType} onValueChange={(v: SupplierType) => setSupplierType(v)}>
                    <div className="grid grid-cols-3 gap-3">
                      {supplierTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <div
                            key={type.id}
                            className="flex items-center space-x-2 border rounded-lg p-3"
                            style={{ borderColor: 'var(--border)' }}
                          >
                            <RadioGroupItem value={type.id} id={type.id} />
                            <Label htmlFor={type.id} className="flex items-center gap-2 cursor-pointer">
                              <Icon className="h-4 w-4" />
                              <span className="text-sm">{type.label}</span>
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Contact Information */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Kontaktdaten
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      E-Mail <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="info@beispiel.de"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Telefon <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+49 (0) 123 456789"
                      maxLength={20}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobil</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+49 (0) 170 1234567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.beispiel.de"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Address */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Adresse
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">
                    Straße und Hausnummer <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Hauptstraße 42"
                    maxLength={100}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip-code">
                      Postleitzahl <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="zip-code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="80331"
                      pattern="[0-9]{5}"
                      maxLength={5}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="city">
                      Stadt <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="München"
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">
                    Land <span className="text-destructive">*</span>
                  </Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger id="country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Deutschland">Deutschland</SelectItem>
                      <SelectItem value="Österreich">Österreich</SelectItem>
                      <SelectItem value="Schweiz">Schweiz</SelectItem>
                      <SelectItem value="Andere EU">Andere EU</SelectItem>
                      <SelectItem value="Andere">Andere</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="additional-addresses"
                    checked={showAdditionalAddresses}
                    onCheckedChange={(checked) => setShowAdditionalAddresses(!!checked)}
                  />
                  <Label htmlFor="additional-addresses" className="text-sm">
                    Weitere Lieferadressen hinzufügen
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Service Categories */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Leistungskategorien
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>
                    Hauptkategorien <span className="text-destructive">*</span> (min. 1, max. 10)
                  </Label>

                  <div className="space-y-4">
                    {/* Trades */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Handwerk</p>
                      <div className="grid grid-cols-3 gap-2">
                        {serviceCategories.trades.map((cat) => (
                          <div key={cat.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={cat.id}
                              checked={selectedCategories.includes(cat.id)}
                              onCheckedChange={() => handleCategoryToggle(cat.id)}
                            />
                            <Label htmlFor={cat.id} className="text-sm">
                              {cat.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Materials */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Materialien</p>
                      <div className="grid grid-cols-3 gap-2">
                        {serviceCategories.materials.map((cat) => (
                          <div key={cat.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={cat.id}
                              checked={selectedCategories.includes(cat.id)}
                              onCheckedChange={() => handleCategoryToggle(cat.id)}
                            />
                            <Label htmlFor={cat.id} className="text-sm">
                              {cat.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Dienstleistungen</p>
                      <div className="grid grid-cols-3 gap-2">
                        {serviceCategories.services.map((cat) => (
                          <div key={cat.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={cat.id}
                              checked={selectedCategories.includes(cat.id)}
                              onCheckedChange={() => handleCategoryToggle(cat.id)}
                            />
                            <Label htmlFor={cat.id} className="text-sm">
                              {cat.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service-description">
                    Leistungsbeschreibung <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="service-description"
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    placeholder="Beschreiben Sie die angebotenen Leistungen und Spezialisierungen..."
                    className="resize-none h-32"
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {serviceDescription.length} / 1000
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="working-radius">Arbeitsradius (km)</Label>
                  <Input
                    id="working-radius"
                    type="number"
                    min="0"
                    max="500"
                    value={workingRadius}
                    onChange={(e) => setWorkingRadius(e.target.value)}
                    placeholder="z.B. 50"
                  />
                  <p className="text-xs text-muted-foreground">
                    (Optional) Maximaler Einsatzradius in km
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 5: Business Terms */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Geschäftsbedingungen
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">
                      Zahlungsmethode <span className="text-destructive">*</span>
                    </Label>
                    <Select value={paymentMethod} onValueChange={(v: PaymentMethod) => setPaymentMethod(v)}>
                      <SelectTrigger id="payment-method">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invoice">Rechnung</SelectItem>
                        <SelectItem value="direct_debit">Lastschrift</SelectItem>
                        <SelectItem value="bank_transfer">Überweisung</SelectItem>
                        <SelectItem value="cash">Bar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Zahlungsziel <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                      {[14, 21, 30, 60, 90].map((days) => (
                        <Button
                          key={days}
                          variant={paymentDays === days ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPaymentDays(days)}
                        >
                          {days} Tage
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="early-discount"
                      checked={earlyPaymentDiscount}
                      onCheckedChange={(checked) => setEarlyPaymentDiscount(!!checked)}
                    />
                    <Label htmlFor="early-discount">Skonto gewährt</Label>
                  </div>

                  {earlyPaymentDiscount && (
                    <div className="pl-6 grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="discount-percent">Skonto %</Label>
                        <Input
                          id="discount-percent"
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discount-days">Skonto Tage</Label>
                        <Input
                          id="discount-days"
                          type="number"
                          min="0"
                          max="30"
                          value={discountDays}
                          onChange={(e) => setDiscountDays(parseInt(e.target.value))}
                        />
                      </div>
                      <p className="col-span-2 text-xs text-muted-foreground">
                        {discountPercent}% Skonto bei Zahlung innerhalb von {discountDays} Tagen
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-order">Mindestbestellwert (€)</Label>
                    <Input
                      id="min-order"
                      type="number"
                      min="0"
                      value={minimumOrderValue}
                      onChange={(e) => setMinimumOrderValue(e.target.value)}
                      placeholder="z.B. 500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery-time">Lieferzeit (Tage)</Label>
                    <Input
                      id="delivery-time"
                      type="number"
                      min="0"
                      max="365"
                      value={deliveryLeadTime}
                      onChange={(e) => setDeliveryLeadTime(e.target.value)}
                      placeholder="z.B. 14"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credit-limit">Kreditlimit (€)</Label>
                    <Input
                      id="credit-limit"
                      type="number"
                      min="0"
                      value={creditLimit}
                      onChange={(e) => setCreditLimit(e.target.value)}
                      placeholder="z.B. 50000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 6: Documents */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Dokumente
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance">
                    Versicherungsnachweis{' '}
                    {(supplierType === 'service_provider' || supplierType === 'subcontractor') && (
                      <span className="text-destructive">*</span>
                    )}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Pflicht für Haftungsarbeiten (Dienstleister/Subunternehmer)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('insurance-input')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Datei hochladen
                    </Button>
                    <input
                      id="insurance-input"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, setInsuranceCertificate)}
                      className="hidden"
                    />
                  </div>
                  {insuranceCertificate && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span>{insuranceCertificate.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInsuranceCertificate(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trade-license">Gewerbeanmeldung</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('trade-license-input')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Datei hochladen
                    </Button>
                    <input
                      id="trade-license-input"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, setTradeLicense)}
                      className="hidden"
                    />
                  </div>
                  {tradeLicense && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span>{tradeLicense.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTradeLicense(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Qualifikationen (Meisterbrief, Zertifikate)</Label>
                  <p className="text-xs text-muted-foreground">Maximal 10 Dateien</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('qualifications-input')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Mehrere Dateien hochladen
                    </Button>
                    <input
                      id="qualifications-input"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={(e) => handleMultiFileUpload(e, setQualifications, 10)}
                      className="hidden"
                    />
                  </div>
                  {qualifications.length > 0 && (
                    <div className="space-y-1">
                      {qualifications.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4" />
                          <span>{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setQualifications((prev) => prev.filter((_, i) => i !== index))
                            }
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

            {/* Section 7: Internal Notes */}
            <Card>
              <CardHeader>
                <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Interne Notizen
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notizen</Label>
                  <p className="text-xs text-muted-foreground">
                    Nicht für Lieferanten sichtbar
                  </p>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Interne Notizen zu diesem Lieferanten (nur für internes Team sichtbar)..."
                    className="resize-none h-32"
                    maxLength={5000}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {notes.length} / 5000
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-manager">
                    Account Manager <span className="text-destructive">*</span>
                  </Label>
                  <Select value={accountManagerId} onValueChange={setAccountManagerId}>
                    <SelectTrigger id="account-manager">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">Thomas Fischer (INN)</SelectItem>
                      <SelectItem value="user2">Anna Müller (INN)</SelectItem>
                      <SelectItem value="user3">Michael Weber (INN)</SelectItem>
                    </SelectContent>
                  </Select>
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
              Entwurf speichern
            </Button>
            <Button onClick={() => handleSubmit(false)}>
              <Send className="h-4 w-4 mr-2" />
              Zur Freigabe senden
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Demo Component
export function SupplierFormDemo() {
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data: Partial<SupplierFormData>, isDraft: boolean) => {
    const statusText = isDraft ? 'als Entwurf gespeichert' : 'zur Freigabe gesendet';
    toast.success(`Lieferant ${statusText}`, {
      description: `${data.companyName} - ${supplierTypes.find((t) => t.id === data.supplierType)?.label}`,
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Lieferantenformular</h2>
        <p className="text-sm text-muted-foreground">
          Umfassendes Formular zur Erfassung von Lieferanten und Subunternehmern mit deutschen
          Labels, Dokumenten-Upload, Leistungskategorien und Geschäftsbedingungen
        </p>
      </div>

      {/* Form Launcher */}
      <Card>
        <CardHeader>
          <h3>Neuen Lieferanten erfassen</h3>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Lieferant erfassen
          </Button>
        </CardContent>
      </Card>

      {/* Supplier Types */}
      <Card>
        <CardHeader>
          <h3>Lieferanten-Typen</h3>
          <p className="text-sm text-muted-foreground mt-1">
            6 vordefinierte Kategorien für Lieferantenklassifizierung
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {supplierTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  className="flex items-center gap-3 p-4 border rounded-lg"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    {type.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Service Categories */}
      <Card>
        <CardHeader>
          <h3>Leistungskategorien</h3>
          <p className="text-sm text-muted-foreground mt-1">
            19 Kategorien in 3 Hauptgruppen (Handwerk, Materialien, Dienstleistungen)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm mb-3" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
              Handwerk (7)
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {serviceCategories.trades.map((cat) => (
                <Badge key={cat.id} variant="outline">
                  {cat.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm mb-3" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
              Materialien (5)
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {serviceCategories.materials.map((cat) => (
                <Badge key={cat.id} variant="outline">
                  {cat.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm mb-3" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
              Dienstleistungen (5)
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {serviceCategories.services.map((cat) => (
                <Badge key={cat.id} variant="outline">
                  {cat.label}
                </Badge>
              ))}
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
              <strong>7 Sektionen:</strong> Grundinformationen, Kontaktdaten, Adresse,
              Leistungskategorien, Geschäftsbedingungen, Dokumente, Interne Notizen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Dokumenten-Upload:</strong> Versicherungsnachweis (Pflicht für
              Dienstleister), Gewerbeanmeldung, Qualifikationen, Referenzen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Geschäftsbedingungen:</strong> Zahlungsmethode, Zahlungsziel mit Quick
              Select, Skonto-Optionen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Leistungskategorien:</strong> Multi-Select aus 19 Kategorien, min. 1, max. 10
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Validierung:</strong> Echtzeit-Formatprüfung für USt-IdNr., PLZ, E-Mail
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Entwurf-Modus:</strong> Speichern mit minimaler Validierung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Freigabe-Workflow:</strong> Status 'PendingApproval' mit GF-Benachrichtigung
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
          <p>• Firmenname: 2-200 Zeichen, erforderlich</p>
          <p>• E-Mail: Gültiges Format, erforderlich</p>
          <p>• Telefon: Max 20 Zeichen, erforderlich</p>
          <p>• Straße, PLZ (5 Ziffern), Stadt: Erforderlich</p>
          <p>• USt-IdNr.: Format DE + 9 Ziffern (optional)</p>
          <p>• Leistungskategorien: Min. 1, max. 10</p>
          <p>• Leistungsbeschreibung: 50-1000 Zeichen, erforderlich</p>
          <p>• Zahlungsziel: 0-120 Tage, erforderlich</p>
          <p>• Versicherungsnachweis: Pflicht für Dienstleister/Subunternehmer</p>
          <p>• Dokumente: PDF, JPG, PNG, max. 10MB pro Datei</p>
          <p>• Account Manager: Erforderlich (INN-Rolle)</p>
        </CardContent>
      </Card>

      {/* Desktop Form */}
      <DesktopSupplierForm
        open={showForm}
        onOpenChange={setShowForm}
        onSave={handleSave}
      />
    </div>
  );
}
