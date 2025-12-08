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
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Star,
  AlertCircle,
  Loader2,
  Plus,
  Save,
  X,
} from 'lucide-react';

// User role type
type UserRole = 'ADM' | 'PLAN' | 'GF' | 'KALK' | 'BUCH';

// ADM users for owner selection
const admUsers = [
  { id: '1', name: 'Michael Schmidt' },
  { id: '2', name: 'Anna Becker' },
  { id: '3', name: 'Thomas Weber' },
];

// Full Customer Form
export function CustomerForm({ 
  currentUserRole = 'PLAN', 
  isEdit = false,
  customTrigger 
}: { 
  currentUserRole?: UserRole; 
  isEdit?: boolean;
  customTrigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [companyName, setCompanyName] = useState(isEdit ? 'Hofladen Müller GmbH' : '');
  const [vatId, setVatId] = useState(isEdit ? 'DE123456789' : '');
  const [customerType, setCustomerType] = useState(isEdit ? 'direktvermarkter' : '');
  const [industry, setIndustry] = useState(isEdit ? 'Lebensmitteleinzelhandel' : '');
  const [rating, setRating] = useState(isEdit ? 'A' : '');
  const [street, setStreet] = useState(isEdit ? 'Hauptstraße 15' : '');
  const [postalCode, setPostalCode] = useState(isEdit ? '80331' : '');
  const [city, setCity] = useState(isEdit ? 'München' : '');
  const [country, setCountry] = useState('Deutschland');
  const [email, setEmail] = useState(isEdit ? 'info@hofladen-mueller.de' : '');
  const [phone, setPhone] = useState(isEdit ? '+49 89 12345678' : '');
  const [website, setWebsite] = useState(isEdit ? 'https://www.hofladen-mueller.de' : '');
  const [creditLimit, setCreditLimit] = useState(isEdit ? '50000' : '');
  const [paymentTerm, setPaymentTerm] = useState(isEdit ? '30' : '');
  const [notes, setNotes] = useState(isEdit ? 'Kunde legt großen Wert auf regionale Produkte.' : '');
  const [owner, setOwner] = useState('1');
  const [gdprMarketing, setGdprMarketing] = useState(isEdit ? true : false);
  const [gdprAI, setGdprAI] = useState(false);
  const [gdprPartner, setGdprPartner] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isOwnerDisabled = currentUserRole === 'ADM';
  const isReadOnly = currentUserRole === 'KALK' || currentUserRole === 'BUCH';

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'companyName':
        if (!value || value.length < 2) return 'Firmenname muss mindestens 2 Zeichen lang sein';
        if (value.length > 200) return 'Firmenname darf maximal 200 Zeichen lang sein';
        return null;
      case 'vatId':
        if (value && !/^DE\d{9}$/.test(value)) return 'Umsatzsteuer-ID muss im Format DE123456789 sein';
        return null;
      case 'street':
        if (!value || value.length < 2) return 'Straße ist ein Pflichtfeld';
        return null;
      case 'postalCode':
        if (!value || !/^\d{5}$/.test(value)) return 'PLZ muss 5-stellig sein';
        return null;
      case 'city':
        if (!value || value.length < 2) return 'Stadt ist ein Pflichtfeld';
        return null;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
        return null;
      case 'creditLimit':
        if (value && (parseFloat(value) < 0 || parseFloat(value) > 1000000)) return 'Kreditlimit muss zwischen 0 und 1.000.000 € liegen';
        return null;
      default:
        return null;
    }
  };

  const handleBlur = (name: string, value: string) => {
    const error = validateField(name, value);
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handleSubmit = () => {
    // Validate all required fields
    const requiredFields = {
      companyName,
      street,
      postalCode,
      city,
    };

    const newErrors: Record<string, string> = {};
    Object.entries(requiredFields).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    // Validate optional fields if filled
    if (vatId) {
      const error = validateField('vatId', vatId);
      if (error) newErrors.vatId = error;
    }
    if (email) {
      const error = validateField('email', email);
      if (error) newErrors.email = error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Bitte korrigieren Sie die Fehler im Formular');
      return;
    }

    // Submit form
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(isEdit ? 'Kunde wurde erfolgreich aktualisiert' : 'Kunde wurde erfolgreich angelegt');
      setOpen(false);
      if (!isEdit) resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setCompanyName('');
    setVatId('');
    setCustomerType('');
    setIndustry('');
    setRating('');
    setStreet('');
    setPostalCode('');
    setCity('');
    setCountry('Deutschland');
    setEmail('');
    setPhone('');
    setWebsite('');
    setCreditLimit('');
    setPaymentTerm('');
    setNotes('');
    setOwner('1');
    setGdprMarketing(false);
    setGdprAI(false);
    setGdprPartner(false);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen && !isEdit) resetForm();
    }}>
      <DialogTrigger asChild>
        {customTrigger ? customTrigger : (
          <Button disabled={isReadOnly}>
            <Plus className="mr-2 h-4 w-4" />
            {isEdit ? 'Kunde bearbeiten' : 'Neuer Kunde'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Kunde bearbeiten' : 'Neuer Kunde'}</DialogTitle>
          <DialogDescription>
            Erfassen Sie die Kundendaten
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Section 1: Grunddaten */}
          <div className="space-y-4">
            <h3>Grunddaten</h3>

            {/* Company Name - Full Width */}
            <div className="space-y-2">
              <Label htmlFor="company-name">
                Firmenname <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onBlur={(e) => handleBlur('companyName', e.target.value)}
                placeholder="z.B. Hofladen Müller GmbH"
                className={errors.companyName ? 'border-destructive' : ''}
              />
              {errors.companyName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.companyName}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Der offizielle Firmenname Ihres Unternehmens
              </p>
            </div>

            {/* VAT ID & Customer Type - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vat-id">Umsatzsteuer-ID</Label>
                <Input
                  id="vat-id"
                  value={vatId}
                  onChange={(e) => setVatId(e.target.value)}
                  onBlur={(e) => handleBlur('vatId', e.target.value)}
                  placeholder="DE123456789"
                  className={errors.vatId ? 'border-destructive' : ''}
                />
                {errors.vatId && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vatId}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Deutsche USt-ID beginnt mit DE, gefolgt von 9 Ziffern
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-type">Kundentyp</Label>
                <Select value={customerType} onValueChange={setCustomerType}>
                  <SelectTrigger id="customer-type">
                    <SelectValue placeholder="Kundentyp auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direktvermarkter">Direktvermarkter</SelectItem>
                    <SelectItem value="einzelhandel">Einzelhandel</SelectItem>
                    <SelectItem value="franchise">Franchise</SelectItem>
                    <SelectItem value="genossenschaft">Genossenschaft</SelectItem>
                    <SelectItem value="sonstiges">Sonstiges</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Art des Kundengeschäfts</p>
              </div>
            </div>

            {/* Industry & Rating - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Branche</Label>
                <Input
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="z.B. Landwirtschaft, Einzelhandel"
                />
              </div>

              <div className="space-y-2">
                <Label>Kundenbewertung</Label>
                <RadioGroup value={rating} onValueChange={setRating}>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="A" id="rating-a" />
                      <Label htmlFor="rating-a" className="font-normal cursor-pointer flex items-center gap-1">
                        <Badge variant="default">A</Badge>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B" id="rating-b" />
                      <Label htmlFor="rating-b" className="font-normal cursor-pointer flex items-center gap-1">
                        <Badge variant="secondary">B</Badge>
                        <div className="flex">
                          {[...Array(3)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="C" id="rating-c" />
                      <Label htmlFor="rating-c" className="font-normal cursor-pointer flex items-center gap-1">
                        <Badge variant="outline">C</Badge>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">Bewertung der Kundenbeziehung</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 2: Rechnungsadresse */}
          <div className="space-y-4">
            <h3>Rechnungsadresse</h3>

            {/* Street - Full Width */}
            <div className="space-y-2">
              <Label htmlFor="street">
                Straße und Hausnummer <span className="text-destructive">*</span>
              </Label>
              <Input
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                onBlur={(e) => handleBlur('street', e.target.value)}
                placeholder="z.B. Hauptstraße 15"
                className={errors.street ? 'border-destructive' : ''}
              />
              {errors.street && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.street}
                </p>
              )}
            </div>

            {/* Postal Code & City */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postal-code">
                  Postleitzahl <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="postal-code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  onBlur={(e) => handleBlur('postalCode', e.target.value)}
                  placeholder="80331"
                  maxLength={5}
                  className={errors.postalCode ? 'border-destructive' : ''}
                />
                {errors.postalCode && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.postalCode}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="city">
                  Stadt <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onBlur={(e) => handleBlur('city', e.target.value)}
                  placeholder="München"
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.city}
                  </p>
                )}
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2 md:w-1/2">
              <Label htmlFor="country">Land</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Deutschland">Deutschland</SelectItem>
                  <SelectItem value="Österreich">Österreich</SelectItem>
                  <SelectItem value="Schweiz">Schweiz</SelectItem>
                  <SelectItem value="other">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Section 3: Kontaktdaten */}
          <div className="space-y-4">
            <h3>Kontaktdaten</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={(e) => handleBlur('email', e.target.value)}
                    placeholder="info@beispiel.de"
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+49-89-1234567"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Haupt-Telefonnummer</p>
              </div>
            </div>

            {/* Website - Full Width */}
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.beispiel.de"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">Firmen-Website (optional)</p>
            </div>
          </div>

          <Separator />

          {/* Section 4: Geschäftsdaten */}
          <div className="space-y-4">
            <h3>Geschäftsdaten</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Credit Limit */}
              <div className="space-y-2">
                <Label htmlFor="credit-limit">Kreditlimit</Label>
                <div className="relative">
                  <Input
                    id="credit-limit"
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    onBlur={(e) => handleBlur('creditLimit', e.target.value)}
                    placeholder="50000"
                    className={`pr-8 ${errors.creditLimit ? 'border-destructive' : ''}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    €
                  </span>
                </div>
                {errors.creditLimit && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.creditLimit}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Maximaler Kreditrahmen in Euro
                </p>
              </div>

              {/* Payment Term */}
              <div className="space-y-2">
                <Label htmlFor="payment-term">Zahlungsziel</Label>
                <Select value={paymentTerm} onValueChange={setPaymentTerm}>
                  <SelectTrigger id="payment-term">
                    <SelectValue placeholder="Auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Sofort</SelectItem>
                    <SelectItem value="7">7 Tage</SelectItem>
                    <SelectItem value="14">14 Tage</SelectItem>
                    <SelectItem value="30">30 Tage</SelectItem>
                    <SelectItem value="60">60 Tage</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Standard-Zahlungsziel für Rechnungen
                </p>
              </div>
            </div>

            {/* Notes - Full Width */}
            <RichTextEditor
              id="notes"
              label="Interne Notizen"
              value={notes}
              onChange={setNotes}
              placeholder="Besonderheiten, Präferenzen, historische Infos..."
              minHeight={150}
              maxLength={1000}
              helpText="Diese Notizen sind nur für interne Zwecke sichtbar"
              toolbar="basic"
            />
          </div>

          <Separator />

          {/* Section 5: Inhaber & DSGVO */}
          <div className="space-y-4">
            <h3>Inhaber & Datenschutz</h3>

            {/* Owner */}
            <div className="space-y-2 md:w-1/2">
              <Label htmlFor="owner">
                Verantwortlicher Mitarbeiter <span className="text-destructive">*</span>
              </Label>
              <Select value={owner} onValueChange={setOwner} disabled={isOwnerDisabled}>
                <SelectTrigger id="owner">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {admUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isOwnerDisabled && (
                <p className="text-xs text-muted-foreground">
                  ADM-Benutzer können nur eigene Kunden erstellen
                </p>
              )}
              {!isOwnerDisabled && (
                <p className="text-xs text-muted-foreground">
                  Zuständiger Außendienstmitarbeiter
                </p>
              )}
            </div>

            {/* GDPR Consents */}
            <div className="space-y-3">
              <Label>Datenschutz-Einwilligungen</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gdpr-marketing"
                    checked={gdprMarketing}
                    onCheckedChange={(checked) => setGdprMarketing(checked as boolean)}
                  />
                  <Label htmlFor="gdpr-marketing" className="font-normal cursor-pointer">
                    Marketing-Kommunikation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gdpr-ai"
                    checked={gdprAI}
                    onCheckedChange={(checked) => setGdprAI(checked as boolean)}
                  />
                  <Label htmlFor="gdpr-ai" className="font-normal cursor-pointer">
                    KI-gestützte Verarbeitung
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gdpr-partner"
                    checked={gdprPartner}
                    onCheckedChange={(checked) => setGdprPartner(checked as boolean)}
                  />
                  <Label htmlFor="gdpr-partner" className="font-normal cursor-pointer">
                    Datenfreigabe für Partner
                  </Label>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Einwilligungen gemäß DSGVO Artikel 6(1)(a)
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird gespeichert...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Speichern
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Visual Form Example (Static)
function VisualFormExample() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Visuelles Formular-Beispiel</h4>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Neuer Kunde</CardTitle>
          <CardDescription>Erfassen Sie die Kundendaten</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Grunddaten */}
          <div className="space-y-4">
            <h3>Grunddaten</h3>
            
            <div className="space-y-2">
              <Label>
                Firmenname <span className="text-destructive">*</span>
              </Label>
              <Input value="Hofladen Müller GmbH" readOnly className="bg-muted" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Umsatzsteuer-ID</Label>
                <Input value="DE123456789" readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Kundentyp</Label>
                <Input value="Direktvermarkter" readOnly className="bg-muted" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Rechnungsadresse */}
          <div className="space-y-4">
            <h3>Rechnungsadresse</h3>
            
            <div className="space-y-2">
              <Label>
                Straße und Hausnummer <span className="text-destructive">*</span>
              </Label>
              <Input value="Hauptstraße 15" readOnly className="bg-muted" />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>PLZ <span className="text-destructive">*</span></Label>
                <Input value="80331" readOnly className="bg-muted" />
              </div>
              <div className="space-y-2 col-span-3">
                <Label>Stadt <span className="text-destructive">*</span></Label>
                <Input value="München" readOnly className="bg-muted" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Kontaktdaten */}
          <div className="space-y-4">
            <h3>Kontaktdaten</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>E-Mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value="info@hofladen-mueller.de" readOnly className="bg-muted pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value="+49 89 12345678" readOnly className="bg-muted pl-10" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CustomerFormDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Vollständiges Kundenformular</CardTitle>
          <CardDescription>
            Dialog mit Validierung, Tabs, Rich Text Editor und DSGVO-Konformität
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <CustomerForm />
            <CustomerForm isEdit={true} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <VisualFormExample />

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Formular-Layout</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Dialog: 800px Breite</li>
              <li>• Sticky Header & Footer</li>
              <li>• Scrollbarer Content</li>
              <li>• Klare Sektionen mit Überschriften</li>
              <li>• Pflichtfelder mit Sternchen *</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Eingabeelemente</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Inputs: Volle Breite oder Grid</li>
              <li>• Selects: Für vordefinierte Optionen</li>
              <li>• Checkboxen: Für Ja/Nein (DSGVO)</li>
              <li>• Rich Text: Für Notizen</li>
              <li>• Icons in Inputs für Kontext</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Validierung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Live-Validierung bei Blur</li>
              <li>• Rote Umrandung bei Fehlern</li>
              <li>• Fehlermeldung unter dem Feld</li>
              <li>• Submit-Blockierung bei Fehlern</li>
              <li>• Erfolgs-Toast nach Speichern</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
