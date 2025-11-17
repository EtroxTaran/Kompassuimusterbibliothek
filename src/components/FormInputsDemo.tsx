import { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import {
  Mail,
  Phone,
  Calendar,
  Search,
  AlertCircle,
  Globe,
  Euro,
  X,
  MapPin,
  Building2,
  User,
  CreditCard,
  Info,
} from 'lucide-react';

// Standard Text Input
function StandardTextInput() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Standard-Texteingabe</h4>
      <div className="grid gap-6 max-w-md">
        <div className="grid gap-2">
          <Label htmlFor="company-name">
            Firmenname <span className="text-destructive">*</span>
          </Label>
          <Input
            id="company-name"
            placeholder="Firmenname eingeben"
            className="h-10"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact-name">Ansprechpartner</Label>
          <Input
            id="contact-name"
            placeholder="Vor- und Nachname"
            className="h-10"
          />
          <p className="text-sm text-muted-foreground">
            Name der Hauptkontaktperson im Unternehmen
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="vat-id">
            Umsatzsteuer-ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="vat-id"
            placeholder="DE123456789"
            className="h-10"
          />
          <p className="text-sm text-muted-foreground">
            Die Umsatzsteuer-ID besteht aus DE gefolgt von 9 Ziffern
          </p>
        </div>
      </div>
      <p className="text-muted-foreground">
        Basis-Texteingabe mit Label, Placeholder und Hilfetext
      </p>
    </div>
  );
}

// Input with Icons
function InputWithIcons() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Eingaben mit Icons</h4>
      <div className="grid gap-6 max-w-md">
        <div className="grid gap-2">
          <Label htmlFor="email-icon">
            E-Mail <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email-icon"
              type="email"
              placeholder="info@beispiel.de"
              className="h-10 pl-10"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone-icon">Telefon</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone-icon"
              type="tel"
              placeholder="+49 123 456789"
              className="h-10 pl-10"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="website-icon">Website</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="website-icon"
              type="url"
              placeholder="https://www.beispiel.de"
              className="h-10 pl-10"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="search-icon">Suche</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search-icon"
              placeholder="Kunden durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="text-muted-foreground">
        Icons verdeutlichen den Eingabetyp und verbessern die Erkennbarkeit
      </p>
    </div>
  );
}

// Number Input with Suffix
function NumberInputs() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Zahleneingaben</h4>
      <div className="grid gap-6 max-w-md">
        <div className="grid gap-2">
          <Label htmlFor="credit-limit">Kreditlimit</Label>
          <div className="relative">
            <Input
              id="credit-limit"
              type="number"
              placeholder="50000"
              className="h-10 pr-10 text-right"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              €
            </span>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="discount">Rabatt</Label>
          <div className="relative">
            <Input
              id="discount"
              type="number"
              placeholder="10"
              className="h-10 pr-10 text-right"
              min="0"
              max="100"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              %
            </span>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="distance">Entfernung</Label>
          <div className="relative">
            <Input
              id="distance"
              type="number"
              placeholder="150"
              className="h-10 pr-12 text-right"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              km
            </span>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="quantity">Menge</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="1"
            min="1"
            defaultValue="1"
            className="h-10"
          />
        </div>
      </div>
      <p className="text-muted-foreground">
        Rechtsbündige Zahlen mit optionaler Einheit als Suffix
      </p>
    </div>
  );
}

// Input with Prefix
function InputWithPrefix() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Eingaben mit Präfix</h4>
      <div className="grid gap-6 max-w-md">
        <div className="grid gap-2">
          <Label htmlFor="phone-prefix">Telefon</Label>
          <div className="flex gap-2">
            <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3">
              <span className="text-sm text-muted-foreground">+49</span>
            </div>
            <Input
              id="phone-prefix"
              type="tel"
              placeholder="89 1234567"
              className="h-10 flex-1"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="url-prefix">Subdomain</Label>
          <div className="flex gap-2">
            <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3">
              <span className="text-sm text-muted-foreground">https://</span>
            </div>
            <Input
              id="url-prefix"
              placeholder="meine-firma"
              className="h-10 flex-1"
            />
            <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3">
              <span className="text-sm text-muted-foreground">.kompass.de</span>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="project-number">Projektnummer</Label>
          <div className="flex gap-2">
            <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3">
              <span className="text-sm text-muted-foreground">PRJ-</span>
            </div>
            <Input
              id="project-number"
              placeholder="2024-001"
              className="h-10 flex-1"
            />
          </div>
        </div>
      </div>
      <p className="text-muted-foreground">
        Präfixe für Telefonnummern, URLs oder standardisierte Nummern
      </p>
    </div>
  );
}

// Textarea
function TextareaInput() {
  const [notes, setNotes] = useState('');
  const maxLength = 500;

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Mehrzeilige Texteingabe</h4>
      <div className="grid gap-6 max-w-md">
        <div className="grid gap-2">
          <Label htmlFor="notes">Notizen</Label>
          <Textarea
            id="notes"
            placeholder="Zusätzliche Informationen eingeben..."
            className="min-h-[120px] resize-y"
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, maxLength))}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Optional</span>
            <span>{notes.length} / {maxLength} Zeichen</span>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">
            Beschreibung <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Projektbeschreibung..."
            className="min-h-[150px] resize-y"
          />
          <p className="text-sm text-muted-foreground">
            Detaillierte Beschreibung des Projekts
          </p>
        </div>
      </div>
      <p className="text-muted-foreground">
        Mehrzeilige Texteingabe mit Zeichenzähler und veränderbarer Höhe
      </p>
    </div>
  );
}

// Checkbox and Radio
function CheckboxRadioInputs() {
  const [customerType, setCustomerType] = useState('retail');

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-4">Checkboxen</h4>
        <div className="grid gap-4 max-w-md">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Ich akzeptiere die Datenschutzbestimmungen
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="newsletter" defaultChecked />
            <label htmlFor="newsletter" className="cursor-pointer">
              Newsletter abonnieren
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="notifications" />
            <label htmlFor="notifications" className="cursor-pointer">
              E-Mail-Benachrichtigungen erhalten
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-check" disabled />
            <label htmlFor="disabled-check" className="cursor-not-allowed opacity-50">
              Deaktivierte Option
            </label>
          </div>
        </div>
        <p className="text-muted-foreground mt-4">
          Checkboxen für Ja/Nein-Optionen und Zustimmungen
        </p>
      </div>

      <Separator />

      <div>
        <h4 className="mb-4">Radio-Buttons</h4>
        <div className="grid gap-4 max-w-md">
          <Label>
            Kundentyp auswählen <span className="text-destructive">*</span>
          </Label>
          <RadioGroup value={customerType} onValueChange={setCustomerType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="direct" id="direct" />
              <Label htmlFor="direct" className="cursor-pointer">
                Direktvermarkter
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="retail" id="retail" />
              <Label htmlFor="retail" className="cursor-pointer">
                Einzelhandel
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="franchise" id="franchise" />
              <Label htmlFor="franchise" className="cursor-pointer">
                Franchise
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other" className="cursor-pointer">
                Sonstiges
              </Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-muted-foreground">
            Ausgewählt: {customerType === 'direct' ? 'Direktvermarkter' : customerType === 'retail' ? 'Einzelhandel' : customerType === 'franchise' ? 'Franchise' : 'Sonstiges'}
          </p>
        </div>
        <p className="text-muted-foreground mt-4">
          Radio-Buttons für Einfachauswahl aus mehreren Optionen
        </p>
      </div>
    </div>
  );
}

// Input States
function InputStates() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-4">Standard-Zustand</h4>
        <div className="grid gap-6 max-w-md">
          <div className="grid gap-2">
            <Label htmlFor="default-input">Firmenname</Label>
            <Input
              id="default-input"
              placeholder="Eingeben..."
              className="h-10"
            />
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Grauer Rahmen, weiße Hintergrundfarbe, bereit für Eingabe
        </p>
      </div>

      <Separator />

      <div>
        <h4 className="mb-4">Fokus-Zustand</h4>
        <div className="grid gap-6 max-w-md">
          <div className="grid gap-2">
            <Label htmlFor="focus-input">E-Mail</Label>
            <Input
              id="focus-input"
              type="email"
              placeholder="info@beispiel.de"
              className="h-10 ring-2 ring-ring"
              autoFocus
            />
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Blauer Rahmen mit Glühen beim Fokussieren
        </p>
      </div>

      <Separator />

      <div>
        <h4 className="mb-4">Ausgefüllt</h4>
        <div className="grid gap-6 max-w-md">
          <div className="grid gap-2">
            <Label htmlFor="filled-input">Firmenname</Label>
            <Input
              id="filled-input"
              defaultValue="Hofladen Müller GmbH"
              className="h-10"
            />
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Schwarzer Text, Daten vorhanden
        </p>
      </div>

      <Separator />

      <div>
        <h4 className="mb-4">Fehlerzustand</h4>
        <div className="grid gap-6 max-w-md">
          <div className="grid gap-2">
            <Label htmlFor="error-input" className="text-destructive">
              E-Mail <span className="text-destructive">*</span>
            </Label>
            <Input
              id="error-input"
              type="email"
              defaultValue="ungültig@"
              className="h-10 border-destructive focus-visible:ring-destructive"
              aria-invalid="true"
            />
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Bitte geben Sie eine gültige E-Mail-Adresse ein
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="required-error" className="text-destructive">
              Firmenname <span className="text-destructive">*</span>
            </Label>
            <Input
              id="required-error"
              defaultValue="AB"
              className="h-10 border-destructive focus-visible:ring-destructive"
              aria-invalid="true"
            />
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Firmenname muss mindestens 3 Zeichen lang sein
            </p>
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Roter Rahmen und Fehlermeldung bei Validierungsfehlern
        </p>
      </div>

      <Separator />

      <div>
        <h4 className="mb-4">Deaktiviert</h4>
        <div className="grid gap-6 max-w-md">
          <div className="grid gap-2">
            <Label htmlFor="disabled-input" className="opacity-50">
              Kundennummer
            </Label>
            <Input
              id="disabled-input"
              defaultValue="K-2024-0042"
              disabled
              className="h-10"
            />
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Ausgegraut und nicht interaktiv
        </p>
      </div>

      <Separator />

      <div>
        <h4 className="mb-4">Nur-Lesen</h4>
        <div className="grid gap-6 max-w-md">
          <div className="grid gap-2">
            <Label htmlFor="readonly-input">Erstellungsdatum</Label>
            <Input
              id="readonly-input"
              defaultValue="15.11.2024"
              readOnly
              className="h-10 bg-muted/50"
            />
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Zeigt Daten an, aber nicht bearbeitbar
        </p>
      </div>
    </div>
  );
}

// Field Groups
function FieldGroups() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Feldgruppen</h4>
      <div className="max-w-2xl">
        <div className="rounded-lg border border-border bg-muted/20 p-6">
          <h4 className="mb-4">Rechnungsadresse</h4>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="street">
                Straße und Hausnummer <span className="text-destructive">*</span>
              </Label>
              <Input
                id="street"
                placeholder="Hauptstraße 123"
                className="h-10 bg-background"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="postal">
                  PLZ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="postal"
                  placeholder="12345"
                  className="h-10 bg-background"
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="city">
                  Stadt <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="Musterstadt"
                  className="h-10 bg-background"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">
                Land <span className="text-destructive">*</span>
              </Label>
              <Select defaultValue="de">
                <SelectTrigger id="country" className="h-10 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">Deutschland</SelectItem>
                  <SelectItem value="at">Österreich</SelectItem>
                  <SelectItem value="ch">Schweiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-muted/20 p-6 mt-6">
          <h4 className="mb-4">Zahlungsinformationen</h4>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="payment-terms">Zahlungsziel</Label>
              <Select defaultValue="30">
                <SelectTrigger id="payment-terms" className="h-10 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Tage</SelectItem>
                  <SelectItem value="14">14 Tage</SelectItem>
                  <SelectItem value="30">30 Tage</SelectItem>
                  <SelectItem value="60">60 Tage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="credit">Kreditlimit</Label>
              <div className="relative">
                <Input
                  id="credit"
                  type="number"
                  placeholder="50000"
                  className="h-10 pr-10 text-right bg-background"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  €
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-group">Standardrabatt</Label>
              <div className="relative">
                <Input
                  id="discount-group"
                  type="number"
                  placeholder="5"
                  defaultValue="5"
                  className="h-10 pr-10 text-right bg-background"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground">
        Verwandte Felder werden mit Hintergrund gruppiert
      </p>
    </div>
  );
}

// Complete Form Example
function CompleteFormExample() {
  const [formData, setFormData] = useState({
    companyName: '',
    vatId: '',
    email: '',
    phone: '',
    website: '',
    customerType: 'retail',
    newsletter: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName || formData.companyName.length < 2) {
      newErrors.companyName = 'Firmenname muss mindestens 2 Zeichen lang sein';
    }

    if (!formData.vatId || !/^DE\d{9}$/.test(formData.vatId)) {
      newErrors.vatId = 'Ungültige USt-IdNr. Format: DE123456789';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Formular erfolgreich validiert!');
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Vollständiges Formular-Beispiel</h4>
      <div className="border border-border rounded-lg p-6 bg-background">
        <div className="mb-6">
          <h4>Neuen Kunden anlegen</h4>
          <p className="text-sm text-muted-foreground">
            Erfassen Sie die Grunddaten des neuen Kunden
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="form-company" className={errors.companyName ? 'text-destructive' : ''}>
                Firmenname <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="form-company"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Firmenname eingeben"
                  className={`h-10 pl-10 ${errors.companyName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  aria-invalid={!!errors.companyName}
                />
              </div>
              {errors.companyName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.companyName}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="form-vat" className={errors.vatId ? 'text-destructive' : ''}>
                Umsatzsteuer-ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="form-vat"
                value={formData.vatId}
                onChange={(e) => setFormData({ ...formData, vatId: e.target.value })}
                placeholder="DE123456789"
                className={`h-10 ${errors.vatId ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                aria-invalid={!!errors.vatId}
              />
              {errors.vatId ? (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.vatId}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Format: DE + 9 Ziffern
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="form-email" className={errors.email ? 'text-destructive' : ''}>
                E-Mail <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="form-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@beispiel.de"
                  className={`h-10 pl-10 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="form-phone">Telefon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="form-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+49 123 456789"
                  className="h-10 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="form-website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="form-website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.beispiel.de"
                className="h-10 pl-10"
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <Label>
              Kundentyp <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={formData.customerType}
              onValueChange={(value) => setFormData({ ...formData, customerType: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="direct" id="form-direct" />
                <Label htmlFor="form-direct" className="cursor-pointer">
                  Direktvermarkter
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="retail" id="form-retail" />
                <Label htmlFor="form-retail" className="cursor-pointer">
                  Einzelhandel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="franchise" id="form-franchise" />
                <Label htmlFor="form-franchise" className="cursor-pointer">
                  Franchise
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="form-newsletter"
              checked={formData.newsletter}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, newsletter: checked as boolean })
              }
            />
            <label htmlFor="form-newsletter" className="cursor-pointer">
              Ich möchte den Newsletter abonnieren
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Kunde anlegen
            </Button>
            <Button type="button" variant="outline">
              Abbrechen
            </Button>
          </div>
        </form>
      </div>
      <p className="text-muted-foreground">
        Vollständiges Formular mit Validierung und Fehlerbehandlung
      </p>
    </div>
  );
}

export function FormInputsDemo() {
  return (
    <div className="space-y-8">
      <StandardTextInput />
      <Separator />
      <InputWithIcons />
      <Separator />
      <NumberInputs />
      <Separator />
      <InputWithPrefix />
      <Separator />
      <TextareaInput />
      <Separator />
      <CheckboxRadioInputs />
      <Separator />
      <InputStates />
      <Separator />
      <FieldGroups />
      <Separator />
      <CompleteFormExample />
      <Separator />
      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Feldgröße</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Höhe: 40px (h-10)</li>
              <li>• Padding: 12px horizontal</li>
              <li>• Border-Radius: 6px</li>
              <li>• Font: 14px</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Abstände</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Label zu Input: 8px (gap-2)</li>
              <li>• Input zu Hilfetext: 8px</li>
              <li>• Zwischen Feldern: 24px (gap-6)</li>
              <li>• Touch-Target: Min. 44px</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Zustände</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Default: Grauer Rahmen</li>
              <li>• Focus: Blauer Ring (2px)</li>
              <li>• Error: Roter Rahmen + Text</li>
              <li>• Disabled: Grauer Hintergrund</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Validierung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Pflichtfelder: Roter Stern (*)</li>
              <li>• Timing: On Blur oder Submit</li>
              <li>• Fehlermeldung: Icon + Text</li>
              <li>• Format: Klar und umsetzbar</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Barrierefreiheit</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Alle Felder mit Label</li>
              <li>• ARIA-Attribute gesetzt</li>
              <li>• Kontrast: Min. 4.5:1</li>
              <li>• Tastatur-Navigation</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Icons</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Größe: 20px (h-5 w-5)</li>
              <li>• Position: Links oder rechts</li>
              <li>• Farbe: Muted-Foreground</li>
              <li>• Padding anpassen (pl-10)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
