import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RichTextEditor } from './RichTextEditor';
import { Switch } from './ui/switch';
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
  Store,
  Package,
  MapPin,
  HardHat,
  AlertTriangle,
  AlertCircle,
  Plus,
  X,
  Save,
  Navigation,
  Map,
  Star,
  Hotel,
} from 'lucide-react';

// Location types
const locationTypes = [
  { value: 'headquarter', label: 'Hauptsitz', icon: Building2 },
  { value: 'branch', label: 'Filiale', icon: Store },
  { value: 'warehouse', label: 'Lager', icon: Package },
  { value: 'project_site', label: 'Projektstandort', icon: HardHat },
  { value: 'other', label: 'Sonstige', icon: MapPin },
];

// Customer contacts
const customerContacts = [
  { id: '1', name: 'Hans Müller', position: 'Geschäftsführer' },
  { id: '2', name: 'Maria Schmidt', position: 'Einkaufsleitung' },
  { id: '3', name: 'Thomas Weber', position: 'Filialleiter' },
];

// Existing locations (for duplicate check)
const existingLocations = ['Hauptsitz München', 'Filiale Berlin', 'Lager Hamburg'];

// Full Location Form
export function LocationForm({ isEdit = false, customTrigger }: { isEdit?: boolean, customTrigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [locationName, setLocationName] = useState('');
  const [locationType, setLocationType] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [street, setStreet] = useState('');
  const [addressSupplement, setAddressSupplement] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Deutschland');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [hotelRating, setHotelRating] = useState(0);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [parkingInstructions, setParkingInstructions] = useState('');
  const [primaryContact, setPrimaryContact] = useState('');
  const [assignedContacts, setAssignedContacts] = useState<string[]>([]);
  const [locationDescription, setLocationDescription] = useState('');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'locationName':
        if (!value || value.length < 2) return 'Standortname muss mindestens 2 Zeichen lang sein';
        if (value.length > 100) return 'Standortname darf maximal 100 Zeichen lang sein';
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

    // Check for duplicate location name
    if (name === 'locationName' && value) {
      if (existingLocations.includes(value)) {
        setShowDuplicateWarning(true);
      } else {
        setShowDuplicateWarning(false);
      }
    }
  };

  const handlePrimaryContactChange = (contactId: string) => {
    setPrimaryContact(contactId);

    // LR-002: Primary contact must be in assigned contacts
    if (contactId && !assignedContacts.includes(contactId)) {
      // Auto-add to assigned contacts
      setAssignedContacts([...assignedContacts, contactId]);
      toast.info('Kontakt wurde automatisch zu zugewiesenen Kontakten hinzugefügt');
    }
  };

  const addAssignedContact = (contactId: string) => {
    if (!assignedContacts.includes(contactId)) {
      setAssignedContacts([...assignedContacts, contactId]);
    }
  };

  const removeAssignedContact = (contactId: string) => {
    setAssignedContacts(assignedContacts.filter((id) => id !== contactId));
    
    // If removing primary contact, clear it
    if (primaryContact === contactId) {
      setPrimaryContact('');
      toast.warning('Hauptansprechpartner wurde entfernt');
    }
  };

  const handleSubmit = () => {
    // Validate all required fields
    const requiredFields = {
      locationName,
      street,
      postalCode,
      city,
    };

    const newErrors: Record<string, string> = {};
    Object.entries(requiredFields).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    if (!locationType) {
      newErrors.locationType = 'Standorttyp ist ein Pflichtfeld';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Bitte korrigieren Sie die Fehler im Formular');
      return;
    }

    // Business rule validation
    if (primaryContact && !assignedContacts.includes(primaryContact)) {
      toast.error('Hauptansprechpartner muss zugewiesener Kontakt sein (Business Rule LR-002)');
      return;
    }

    // Submit
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(isEdit ? 'Standort wurde aktualisiert' : 'Standort wurde angelegt');
      setOpen(false);
      resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setLocationName('');
    setLocationType('');
    setIsActive(true);
    setStreet('');
    setAddressSupplement('');
    setPostalCode('');
    setCity('');
    setCountry('Deutschland');
    setLatitude('');
    setLongitude('');
    setHotelRating(0);
    setDeliveryNotes('');
    setOpeningHours('');
    setParkingInstructions('');
    setPrimaryContact('');
    setAssignedContacts([]);
    setLocationDescription('');
    setErrors({});
    setShowDuplicateWarning(false);
  };

  const selectedType = locationTypes.find((t) => t.value === locationType);
  const TypeIcon = selectedType?.icon || MapPin;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {customTrigger ? customTrigger : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {isEdit ? 'Standort bearbeiten' : 'Neuer Standort'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Standort bearbeiten' : 'Neuer Standort'}</DialogTitle>
          <DialogDescription>
            <Badge variant="secondary" className="mt-2">
              <Building2 className="mr-1 h-3 w-3" />
              Kunde: Hofladen Müller GmbH
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Duplicate Warning */}
          {showDuplicateWarning && (
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900 dark:text-amber-100">
                Ein Standort mit diesem Namen existiert bereits. Bitte wählen Sie einen anderen
                Namen.
              </AlertDescription>
            </Alert>
          )}

          {/* Section 1: Location Information */}
          <div className="space-y-4">
            <h4>Standortinformationen</h4>

            {/* Location Name */}
            <div className="space-y-2">
              <Label htmlFor="location-name">
                Standortname <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location-name"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                onBlur={(e) => handleBlur('locationName', e.target.value)}
                placeholder="z.B. Filiale München Süd"
                className={errors.locationName ? 'border-destructive' : ''}
              />
              {errors.locationName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.locationName}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Eindeutiger Name für diesen Standort (muss innerhalb des Kunden eindeutig sein)
              </p>
            </div>

            {/* Location Type & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location-type">
                  Standorttyp <span className="text-destructive">*</span>
                </Label>
                <Select value={locationType} onValueChange={setLocationType}>
                  <SelectTrigger id="location-type" className={errors.locationType ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Typ auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {locationTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.locationType && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.locationType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-3 h-10">
                  <Switch
                    id="status"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="status" className="cursor-pointer">
                    {isActive ? 'Aktiv' : 'Inaktiv'}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ob dieser Standort aktuell in Betrieb ist
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 2: Delivery Address */}
          <div className="space-y-4">
            <h4>Lieferadresse</h4>

            {/* Street */}
            <div className="space-y-2">
              <Label htmlFor="street">
                Straße und Hausnummer <span className="text-destructive">*</span>
              </Label>
              <Input
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                onBlur={(e) => handleBlur('street', e.target.value)}
                placeholder="z.B. Industriestraße 42"
                className={errors.street ? 'border-destructive' : ''}
              />
              {errors.street && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.street}
                </p>
              )}
            </div>

            {/* Address Supplement */}
            <div className="space-y-2">
              <Label htmlFor="address-supplement">Adresszusatz</Label>
              <Input
                id="address-supplement"
                value={addressSupplement}
                onChange={(e) => setAddressSupplement(e.target.value)}
                placeholder="z.B. Hintereingang, 2. Stock"
              />
              <p className="text-xs text-muted-foreground">
                Zusätzliche Hinweise zur Lieferadresse
              </p>
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
                  placeholder="81379"
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
                </SelectContent>
              </Select>
            </div>

            {/* Latitude & Longitude */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Breitengrad</Label>
                <Input
                  id="latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="z.B. 48.137154"
                />
                <p className="text-xs text-muted-foreground">
                  Breitengrad für GPS-Koordinaten
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Längengrad</Label>
                <Input
                  id="longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="z.B. 11.576124"
                />
                <p className="text-xs text-muted-foreground">
                  Längengrad für GPS-Koordinaten
                </p>
              </div>
            </div>

            {/* Hotel Rating */}
            <div className="space-y-2">
              <Label htmlFor="hotel-rating">Hotelbewertung</Label>
              <Input
                id="hotel-rating"
                value={hotelRating.toString()}
                onChange={(e) => setHotelRating(Number(e.target.value))}
                placeholder="z.B. 4.5"
                type="number"
                step="0.1"
                min="0"
                max="5"
              />
              <p className="text-xs text-muted-foreground">
                Bewertung des Hotels (falls zutreffend)
              </p>
            </div>
          </div>

          <Separator />

          {/* Section 3: Delivery Information */}
          <div className="space-y-4">
            <h4>Lieferinformationen</h4>

            {/* Delivery Notes */}
            <div className="space-y-2">
              <Label htmlFor="delivery-notes">Anlieferhinweise</Label>
              <Textarea
                id="delivery-notes"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="z.B. Hintereingang nutzen, Lieferung nur werktags 8-16 Uhr"
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Spezielle Hinweise für Lieferungen an diesen Standort
                </p>
                <p className="text-xs text-muted-foreground">
                  {deliveryNotes.length} / 500 Zeichen
                </p>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="space-y-2">
              <Label htmlFor="opening-hours">Öffnungszeiten</Label>
              <Input
                id="opening-hours"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="Mo-Fr 8:00-18:00, Sa 9:00-14:00"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">Betriebszeiten für Lieferungen</p>
            </div>

            {/* Parking Instructions */}
            <div className="space-y-2">
              <Label htmlFor="parking">Parkmöglichkeiten</Label>
              <Textarea
                id="parking"
                value={parkingInstructions}
                onChange={(e) => setParkingInstructions(e.target.value)}
                placeholder="z.B. Parkplätze vor dem Gebäude, Entladezone vorhanden"
                rows={2}
                maxLength={300}
              />
            </div>
          </div>

          <Separator />

          {/* Section 4: Assigned Contacts */}
          <div className="space-y-4">
            <h4>Kontakte</h4>

            {/* Primary Contact */}
            <div className="space-y-2">
              <Label htmlFor="primary-contact">Hauptansprechpartner</Label>
              <Select value={primaryContact} onValueChange={handlePrimaryContactChange}>
                <SelectTrigger id="primary-contact">
                  <SelectValue placeholder="Ansprechpartner auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {customerContacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name} - {contact.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Primärer Kontakt für diesen Standort (muss einer der zugewiesenen Kontakte sein)
              </p>
            </div>

            {/* Assigned Contacts */}
            <div className="space-y-2">
              <Label>Zugewiesene Kontakte</Label>
              
              {/* Selected contacts as chips */}
              {assignedContacts.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {assignedContacts.map((contactId) => {
                    const contact = customerContacts.find((c) => c.id === contactId);
                    return (
                      <Badge key={contactId} variant="secondary" className="gap-1">
                        {contact?.name}
                        <button
                          onClick={() => removeAssignedContact(contactId)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}

              {/* Add contact selector */}
              <Select onValueChange={addAssignedContact} value="">
                <SelectTrigger>
                  <SelectValue placeholder="Kontakt hinzufügen..." />
                </SelectTrigger>
                <SelectContent>
                  {customerContacts
                    .filter((c) => !assignedContacts.includes(c.id))
                    .map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name} - {contact.position}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              <p className="text-xs text-muted-foreground">
                Ansprechpartner, die diesem Standort zugeordnet sind
              </p>
            </div>
          </div>

          <Separator />

          {/* Section 5: Additional Information */}
          <div className="space-y-4">
            <h4>Zusätzliche Informationen</h4>

            <RichTextEditor
              id="location-description"
              label="Standortbeschreibung"
              value={locationDescription}
              onChange={setLocationDescription}
              placeholder="Besonderheiten des Standorts, Anfahrtsbeschreibung, Zugangsinformationen..."
              minHeight={150}
              maxLength={2000}
              helpText="Detaillierte Informationen zu diesem Standort fr interne Zwecke"
              toolbar="basic"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-pulse" />
                Wird gespeichert...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Standort speichern
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Validation Examples
function ValidationExamples() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Validierungsbeispiele</h4>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Required Field */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pflichtfeld-Validierung</CardTitle>
            <CardDescription>Standortname ist erforderlich</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label>
              Standortname <span className="text-destructive">*</span>
            </Label>
            <Input className="border-destructive" />
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Standortname ist ein Pflichtfeld
            </p>
          </CardContent>
        </Card>

        {/* Duplicate Name */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Duplikatsprüfung</CardTitle>
            <CardDescription>Name existiert bereits (Business Rule LR-001)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label>Standortname</Label>
            <Input value="Hauptsitz München" readOnly className="bg-muted" />
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-900 dark:text-amber-100">
                Ein Standort mit diesem Namen existiert bereits. Bitte wählen Sie einen anderen
                Namen.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Postal Code Validation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">PLZ-Validierung</CardTitle>
            <CardDescription>Muss 5-stellig sein</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label>
              Postleitzahl <span className="text-destructive">*</span>
            </Label>
            <Input value="123" className="border-destructive" readOnly />
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              PLZ muss 5-stellig sein
            </p>
          </CardContent>
        </Card>

        {/* Business Rule LR-002 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business Rule LR-002</CardTitle>
            <CardDescription>Hauptansprechpartner muss zugewiesen sein</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label>Hauptansprechpartner</Label>
            <Input value="Hans Müller" readOnly className="bg-muted" />
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Hauptansprechpartner muss einer der zugewiesenen Kontakte sein (Business Rule
              LR-002)
            </p>
            <p className="text-xs text-muted-foreground">
              System fügt Kontakt automatisch zu zugewiesenen Kontakten hinzu
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">
        Validierung erfolgt bei Blur und beim Absenden, inkl. Business Rules
      </p>
    </div>
  );
}

// Location Type Examples
function LocationTypeExamples() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Standorttypen</h4>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locationTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.value}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{type.label}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{type.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground">
        5 Standorttypen mit Icons: Hauptsitz, Filiale, Lager, Projektstandort, Sonstige
      </p>
    </div>
  );
}

// Contact Assignment Demo
function ContactAssignmentDemo() {
  const [assigned, setAssigned] = useState<string[]>(['1', '2']);
  const [primary, setPrimary] = useState('1');

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Kontaktzuweisung</h4>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Zugewiesene Kontakte</CardTitle>
          <CardDescription>Multi-Select mit Chips und automatischer Validierung</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Assigned contacts */}
          <div className="space-y-2">
            <Label>Zugewiesene Kontakte</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {assigned.map((contactId) => {
                const contact = customerContacts.find((c) => c.id === contactId);
                return (
                  <Badge key={contactId} variant="secondary" className="gap-1">
                    {contact?.name}
                    <button
                      onClick={() => setAssigned(assigned.filter((id) => id !== contactId))}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
            <Select
              onValueChange={(id) => {
                if (!assigned.includes(id)) {
                  setAssigned([...assigned, id]);
                }
              }}
              value=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Kontakt hinzufügen..." />
              </SelectTrigger>
              <SelectContent>
                {customerContacts
                  .filter((c) => !assigned.includes(c.id))
                  .map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name} - {contact.position}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Primary contact */}
          <div className="space-y-2">
            <Label>Hauptansprechpartner</Label>
            <Select value={primary} onValueChange={setPrimary}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {customerContacts
                  .filter((c) => assigned.includes(c.id))
                  .map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name} - {contact.position}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Nur zugewiesene Kontakte können als Hauptansprechpartner ausgewählt werden
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        LR-002: Hauptansprechpartner wird automatisch zu zugewiesenen Kontakten hinzugefügt
      </p>
    </div>
  );
}

// Delivery Information Demo
function DeliveryInformationDemo() {
  const [notes, setNotes] = useState(
    'Hintereingang nutzen, Lieferung nur werktags zwischen 8:00 und 16:00 Uhr'
  );

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Lieferinformationen</h4>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Anlieferhinweise & Details</CardTitle>
          <CardDescription>Spezielle Hinweise für Lieferungen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Delivery Notes */}
          <div className="space-y-2">
            <Label>Anlieferhinweise</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Spezielle Hinweise für Lieferungen an diesen Standort
              </p>
              <p className="text-xs text-muted-foreground">{notes.length} / 500 Zeichen</p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-2">
            <Label>Öffnungszeiten</Label>
            <Input value="Mo-Fr 8:00-18:00, Sa 9:00-14:00" readOnly className="bg-muted" />
            <p className="text-xs text-muted-foreground">Betriebszeiten für Lieferungen</p>
          </div>

          {/* Parking */}
          <div className="space-y-2">
            <Label>Parkmöglichkeiten</Label>
            <Textarea
              value="Parkplätze vor dem Gebäude, Entladezone im Hof vorhanden"
              rows={2}
              readOnly
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Detaillierte Lieferinformationen mit Zeichenbegrenzungen
      </p>
    </div>
  );
}

export function LocationFormDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Vollständiges Standortformular</CardTitle>
          <CardDescription>
            Formular zum Erstellen und Bearbeiten von Standorten (nested unter Kunde)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <LocationForm />
            <p className="text-sm text-muted-foreground">
              4 Abschnitte: Standortinformationen, Lieferadresse, Lieferinformationen, Kontakte
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Validierungsregeln</CardTitle>
          <CardDescription>
            Feldvalidierung, Duplikatsprüfung und Business Rules (LR-001, LR-002)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ValidationExamples />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Standorttypen</CardTitle>
          <CardDescription>
            5 Standorttypen mit Icons (Hauptsitz, Filiale, Lager, Projektstandort, Sonstige)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LocationTypeExamples />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kontaktzuweisung</CardTitle>
          <CardDescription>
            Multi-Select für zugewiesene Kontakte mit automatischer Validierung (LR-002)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactAssignmentDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lieferinformationen</CardTitle>
          <CardDescription>
            Anlieferhinweise, Öffnungszeiten und Parkmöglichkeiten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeliveryInformationDemo />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Formular-Layout</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Dialog: 700px Breite</li>
              <li>• Kundenbadge im Header</li>
              <li>• 2-Spalten wo sinnvoll</li>
              <li>• 4 Hauptabschnitte</li>
              <li>• Sticky Footer mit Buttons</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Pflichtfelder</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Standortname *</li>
              <li>• Standorttyp *</li>
              <li>• Status * (Toggle)</li>
              <li>• Straße *</li>
              <li>• PLZ * (5-stellig)</li>
              <li>• Stadt *</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Standorttypen</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Hauptsitz (Building)</li>
              <li>• Filiale (Store)</li>
              <li>• Lager (Package)</li>
              <li>• Projektstandort (HardHat)</li>
              <li>• Sonstige (MapPin)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Validierung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Echtzeit bei Blur</li>
              <li>• Duplikatsprüfung (LR-001)</li>
              <li>• Roter Rahmen bei Fehler</li>
              <li>• Fehlermeldung mit Icon</li>
              <li>• Business Rule LR-002</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Business Rules</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• LR-001: Name eindeutig</li>
              <li>• LR-002: Primary ⊆ Assigned</li>
              <li>• Auto-Add zu Assigned</li>
              <li>• Duplikats-Warnung (amber)</li>
              <li>• Toast-Benachrichtigung</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Kontaktzuweisung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Multi-Select mit Chips</li>
              <li>• X-Button zum Entfernen</li>
              <li>• Hauptansprechpartner-Select</li>
              <li>• Automatische Validierung</li>
              <li>• Toast bei Auto-Add</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}