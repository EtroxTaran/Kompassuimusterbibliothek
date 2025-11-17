import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import {
  Camera,
  FlipHorizontal,
  Zap,
  X,
  Image as ImageIcon,
  RotateCcw,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Eye,
  Save,
  Building,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  User,
  Loader2,
} from 'lucide-react';

// Scanner screen types
type ScannerScreen = 'camera' | 'preview' | 'extracting' | 'form';

// Confidence level type
type ConfidenceLevel = 'high' | 'medium' | 'low';

// Extracted contact data
interface ExtractedContact {
  firstName: string;
  lastName: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  website: string;
  notes: string;
  confidence: {
    firstName: ConfidenceLevel;
    lastName: ConfidenceLevel;
    position: ConfidenceLevel;
    company: ConfidenceLevel;
    email: ConfidenceLevel;
    phone: ConfidenceLevel;
    address: ConfidenceLevel;
  };
}

// Mock extracted data
const mockExtractedData: ExtractedContact = {
  firstName: 'Hans',
  lastName: 'Müller',
  position: 'Geschäftsführer',
  company: 'Hofladen Müller GmbH',
  email: 'h.mueller@hofladen-mueller.de',
  phone: '+49-89-1234567',
  mobile: '',
  address: 'Industriestraße 42, 81379 München',
  website: '',
  notes: '',
  confidence: {
    firstName: 'high',
    lastName: 'high',
    position: 'high',
    company: 'high',
    email: 'high',
    phone: 'medium',
    address: 'medium',
  },
};

// Mock customers for dropdown
const mockCustomers = [
  { id: 'cust-1', name: 'Hofladen Müller GmbH' },
  { id: 'cust-2', name: 'REWE München Süd' },
  { id: 'cust-3', name: 'Bäckerei Schmidt' },
];

// Get confidence badge
function getConfidenceBadge(confidence: ConfidenceLevel) {
  switch (confidence) {
    case 'high':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
          <CheckCircle className="mr-1 h-3 w-3" />
          Hoch
        </Badge>
      );
    case 'medium':
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Mittel
        </Badge>
      );
    case 'low':
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="mr-1 h-3 w-3" />
          Niedrig
        </Badge>
      );
  }
}

// Get confidence indicator icon
function getConfidenceIcon(confidence: ConfidenceLevel) {
  switch (confidence) {
    case 'high':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'medium':
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    case 'low':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
  }
}

export function BusinessCardScanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScannerScreen>('camera');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraFlipped, setCameraFlipped] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<ExtractedContact>(mockExtractedData);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');

  // Handle camera capture
  const handleCapture = () => {
    // Simulate camera capture with flash animation
    const flash = document.createElement('div');
    flash.className = 'fixed inset-0 bg-white z-[100] pointer-events-none';
    flash.style.animation = 'flash 0.3s ease-out';
    document.body.appendChild(flash);
    
    setTimeout(() => {
      document.body.removeChild(flash);
      setCapturedImage('/placeholder-business-card.jpg');
      setCurrentScreen('preview');
      toast.success('Foto aufgenommen');
    }, 300);
  };

  // Handle file upload from gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setCurrentScreen('preview');
        toast.success('Foto ausgewählt');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle proceed from preview
  const handleProceed = () => {
    setCurrentScreen('extracting');
    
    // Simulate OCR extraction
    setTimeout(() => {
      setCurrentScreen('form');
      toast.success('Kontaktinformationen extrahiert', {
        description: 'Bitte überprüfen und bearbeiten Sie die Daten',
      });
    }, 2500);
  };

  // Handle retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    setCurrentScreen('camera');
  };

  // Handle form field change
  const handleFieldChange = (field: keyof ExtractedContact, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle save contact
  const handleSave = () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error('Fehler', {
        description: 'Vor- und Nachname sind erforderlich',
      });
      return;
    }

    toast.success('Kontakt gespeichert', {
      description: `${formData.firstName} ${formData.lastName}`,
    });
    
    // Reset and close
    setTimeout(() => {
      setIsOpen(false);
      setCurrentScreen('camera');
      setCapturedImage(null);
      setFormData(mockExtractedData);
      setSelectedCustomer('');
    }, 1000);
  };

  // Handle cancel
  const handleCancel = () => {
    setIsOpen(false);
    setCurrentScreen('camera');
    setCapturedImage(null);
    setFormData(mockExtractedData);
    setSelectedCustomer('');
  };

  return (
    <>
      <style>{`
        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Entry Point Button */}
      <Button onClick={() => setIsOpen(true)}>
        <Camera className="mr-2 h-4 w-4" />
        Visitenkarte scannen
      </Button>

      {/* Scanner Sheet (Full Screen Mobile) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="bottom"
          className="h-full w-full p-0 border-0"
          onInteractOutside={(e) => e.preventDefault()}
        >
          {/* Camera View */}
          {currentScreen === 'camera' && (
            <div className="relative h-full w-full bg-black flex items-center justify-center">
              {/* Simulated Camera Preview */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <Camera className="h-24 w-24 text-white/20" />
              </div>

              {/* Card Frame Overlay */}
              <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
                <div className="relative w-full max-w-sm aspect-[1.6/1] border-4 border-primary rounded-lg">
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                </div>
              </div>

              {/* Instruction Text */}
              <div className="absolute top-24 left-0 right-0 text-center pointer-events-none">
                <p className="text-white bg-black/50 px-4 py-2 rounded-full inline-block">
                  Visitenkarte im Rahmen positionieren
                </p>
              </div>

              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={handleCancel}
                >
                  <X className="h-5 w-5" />
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-white hover:bg-white/20 ${
                      flashEnabled ? 'bg-white/20' : ''
                    }`}
                    onClick={() => setFlashEnabled(!flashEnabled)}
                  >
                    <Zap className={`h-5 w-5 ${flashEnabled ? 'fill-current' : ''}`} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setCameraFlipped(!cameraFlipped)}
                  >
                    <FlipHorizontal className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setShowTips(true)}
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-8">
                {/* Gallery Button */}
                <label htmlFor="gallery-upload">
                  <div className="h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center cursor-pointer hover:bg-white/30">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                  <input
                    id="gallery-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                {/* Capture Button */}
                <button
                  onClick={handleCapture}
                  className="h-20 w-20 rounded-full bg-white border-4 border-white/50 shadow-lg active:scale-95 transition-transform"
                >
                  <div className="h-full w-full rounded-full bg-primary" />
                </button>

                {/* Spacer for balance */}
                <div className="h-12 w-12" />
              </div>
            </div>
          )}

          {/* Preview & Confirm */}
          {currentScreen === 'preview' && (
            <div className="relative h-full w-full bg-black flex flex-col">
              {/* Image Preview */}
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="relative max-w-md w-full">
                  <div className="aspect-[1.6/1] bg-gray-800 rounded-lg overflow-hidden border-4 border-green-500">
                    <div className="h-full w-full flex items-center justify-center">
                      <ImageIcon className="h-24 w-24 text-white/20" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Visitenkarte erkannt</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 space-y-3 bg-background">
                <Button className="w-full" size="lg" onClick={handleProceed}>
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Fortfahren
                </Button>
                <Button variant="outline" className="w-full" size="lg" onClick={handleRetake}>
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Wiederholen
                </Button>
              </div>
            </div>
          )}

          {/* OCR Extracting */}
          {currentScreen === 'extracting' && (
            <div className="relative h-full w-full bg-background flex flex-col items-center justify-center p-6">
              {/* Blurred Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />

              {/* Loading Content */}
              <div className="relative z-10 text-center space-y-6">
                <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary" />
                <div>
                  <h2 className="mb-2">Extrahiere Kontaktinformationen...</h2>
                  <p className="text-muted-foreground">Bitte warten Sie einen Moment</p>
                </div>

                {/* Progress Steps */}
                <div className="space-y-2 text-left max-w-sm mx-auto">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Bild analysiert</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Text wird extrahiert...</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground opacity-50">
                    <div className="h-4 w-4 rounded-full border-2 border-current" />
                    <span>Daten werden strukturiert</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Extracted Data Form */}
          {currentScreen === 'form' && (
            <div className="h-full overflow-y-auto bg-background">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-background border-b border-border p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="mb-1">Kontakt aus Visitenkarte</h2>
                    <p className="text-muted-foreground">Bitte überprüfen Sie die extrahierten Daten</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Card Thumbnail */}
                <button
                  onClick={() => setShowImagePreview(true)}
                  className="mt-2 relative w-32 aspect-[1.6/1] bg-muted rounded border border-border overflow-hidden hover:opacity-80 transition-opacity"
                >
                  <div className="h-full w-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                    <Eye className="h-4 w-4 text-white opacity-0 hover:opacity-100" />
                  </div>
                </button>
              </div>

              {/* Form Content */}
              <div className="p-4 space-y-6 pb-32">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3>Persönliche Informationen</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        Vorname <span className="text-red-600">*</span>
                        {getConfidenceIcon(formData.confidence.firstName)}
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleFieldChange('firstName', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="flex items-center gap-2">
                        Nachname <span className="text-red-600">*</span>
                        {getConfidenceIcon(formData.confidence.lastName)}
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleFieldChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position" className="flex items-center gap-2">
                      Position
                      {getConfidenceIcon(formData.confidence.position)}
                    </Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleFieldChange('position', e.target.value)}
                      placeholder="z.B. Geschäftsführer"
                    />
                  </div>
                </div>

                <Separator />

                {/* Company Information */}
                <div className="space-y-4">
                  <h3>Firmeninformationen</h3>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center gap-2">
                      Firma
                      {getConfidenceIcon(formData.confidence.company)}
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleFieldChange('company', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer">Kunde zuordnen</Label>
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger id="customer">
                        <SelectValue placeholder="Firma wählen oder neu erstellen..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Neue Firma erstellen
                          </div>
                        </SelectItem>
                        <Separator className="my-2" />
                        {mockCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3>Kontaktinformationen</h3>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      E-Mail
                      {getConfidenceIcon(formData.confidence.email)}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder="beispiel@firma.de"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        Telefon
                        {getConfidenceIcon(formData.confidence.phone)}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        placeholder="+49..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobil</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => handleFieldChange('mobile', e.target.value)}
                        placeholder="+49..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      Adresse
                      {getConfidenceIcon(formData.confidence.address)}
                    </Label>
                    <Textarea
                      id="address"
                      rows={2}
                      value={formData.address}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      placeholder="Straße, PLZ Stadt"
                    />
                  </div>
                </div>

                {/* Advanced Fields (Collapsible) */}
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                  >
                    <span>Weitere Felder</span>
                    {showAdvancedFields ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  {showAdvancedFields && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={(e) => handleFieldChange('website', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notizen</Label>
                        <Textarea
                          id="notes"
                          rows={3}
                          value={formData.notes}
                          onChange={(e) => handleFieldChange('notes', e.target.value)}
                          placeholder="Zusätzliche Informationen..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sticky Action Buttons */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border space-y-2">
                <Button className="w-full" size="lg" onClick={handleSave}>
                  <Save className="mr-2 h-5 w-5" />
                  Kontakt speichern
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleCancel}>
                    Abbrechen
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowImagePreview(true)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Originalfoto
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* OCR Tips Dialog */}
      <Dialog open={showTips} onOpenChange={setShowTips}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tipps für bessere Genauigkeit</DialogTitle>
            <DialogDescription>
              Befolgen Sie diese Tipps für optimale OCR-Ergebnisse
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Gute Beleuchtung verwenden</p>
                <p className="text-muted-foreground">Vermeiden Sie Schatten und Reflexionen</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Karte flach auf Unterlage legen</p>
                <p className="text-muted-foreground">Verhindert Verzerrungen und Unschärfe</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Alle Ränder im Rahmen positionieren</p>
                <p className="text-muted-foreground">Komplette Karte muss sichtbar sein</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Bewegung vermeiden</p>
                <p className="text-muted-foreground">Halten Sie das Gerät ruhig beim Aufnehmen</p>
              </div>
            </div>
          </div>

          <Button onClick={() => setShowTips(false)} className="w-full">
            Verstanden
          </Button>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Originalfoto</DialogTitle>
            <DialogDescription>Gescannte Visitenkarte</DialogDescription>
          </DialogHeader>

          <div className="aspect-[1.6/1] bg-muted rounded-lg overflow-hidden border border-border">
            <div className="h-full w-full flex items-center justify-center">
              <ImageIcon className="h-24 w-24 text-muted-foreground" />
            </div>
          </div>

          <Button onClick={() => setShowImagePreview(false)} className="w-full">
            Schließen
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Demo Component
export function BusinessCardScannerDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visitenkarten-Scanner</CardTitle>
          <CardDescription>
            Mobile PWA-Komponente zum Scannen von Visitenkarten mit OCR-Texterkennung und
            automatischem Ausfüllen des Kontaktformulars
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-3">Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Kamera-Erfassung mit Rahmenführung</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>OCR-Texterkennung mit Konfidenzindikatoren</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Automatisches Ausfüllen des Kontaktformulars</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Bearbeitbare Felder mit Validierung</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Kundenzuordnung und -erstellung</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Tipps für bessere Scan-Qualität</span>
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3">Nutzungshinweis</h3>
            <p className="text-muted-foreground mb-4">
              Diese Demo simuliert den Scanner-Flow. In der Produktion würde die Kamera-API
              verwendet werden, und die OCR-Extraktion erfolgt über einen Cloud-Service (z.B.
              Google Vision API, Azure Computer Vision oder Tesseract.js).
            </p>

            <BusinessCardScanner />
          </div>

          <Separator />

          <div>
            <h3 className="mb-3">Konfidenzniveaus</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {getConfidenceBadge('high')}
                <span className="text-muted-foreground">
                  {'>'} 90% - Automatisch übernommen
                </span>
              </div>
              <div className="flex items-center gap-3">
                {getConfidenceBadge('medium')}
                <span className="text-muted-foreground">70-90% - Bitte überprüfen</span>
              </div>
              <div className="flex items-center gap-3">
                {getConfidenceBadge('low')}
                <span className="text-muted-foreground">{'<'} 70% - Manuell eingeben</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
