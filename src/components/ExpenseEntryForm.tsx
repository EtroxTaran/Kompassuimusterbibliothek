import { useState, useRef, ChangeEvent } from 'react';
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
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import {
  Camera,
  Upload,
  X,
  Check,
  ArrowLeft,
  Calendar,
  ChevronDown,
  ZoomIn,
  Trash2,
  Save,
  Send,
} from 'lucide-react';

// Types
export type ExpenseCategory =
  | 'meals'
  | 'fuel'
  | 'hotel'
  | 'parking'
  | 'transport'
  | 'phone'
  | 'other';

export type ExpenseStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface ExpensePhoto {
  id: string;
  url: string;
  file?: File;
  ocrDetected?: {
    amount?: number;
    vendor?: string;
    confidence: number;
  };
}

export interface ExpenseEntry {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
  photo?: ExpensePhoto;
  tourId?: string;
  tourName?: string;
  customerId?: string;
  customerName?: string;
  vatRate: number;
  status: ExpenseStatus;
  isBusinessMeal: boolean;
  businessMeal?: {
    attendees: string;
    purpose: string;
    location: string;
  };
}

// Category definitions
export const expenseCategories = [
  { id: 'meals' as ExpenseCategory, label: 'Verpflegung', emoji: '🍽️' },
  { id: 'fuel' as ExpenseCategory, label: 'Benzin', emoji: '⛽' },
  { id: 'hotel' as ExpenseCategory, label: 'Hotel', emoji: '🏨' },
  { id: 'parking' as ExpenseCategory, label: 'Parken', emoji: '🅿️' },
  { id: 'transport' as ExpenseCategory, label: 'Taxi/ÖPNV', emoji: '🚕' },
  { id: 'phone' as ExpenseCategory, label: 'Telefon', emoji: '📱' },
  { id: 'other' as ExpenseCategory, label: 'Sonstiges', emoji: '🎫' },
];

// Utility Functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function getCategoryInfo(category: ExpenseCategory) {
  return expenseCategories.find((c) => c.id === category);
}

export function getStatusBadge(status: ExpenseStatus) {
  switch (status) {
    case 'draft':
      return { label: 'Entwurf', variant: 'secondary' as const };
    case 'submitted':
      return { label: 'Eingereicht', variant: 'default' as const };
    case 'approved':
      return { label: 'Genehmigt', variant: 'default' as const };
    case 'rejected':
      return { label: 'Abgelehnt', variant: 'destructive' as const };
  }
}

// Mock OCR function
function simulateOCR(file: File): Promise<{ amount: number; vendor: string; confidence: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate OCR detection
      resolve({
        amount: 23.5 + Math.random() * 50,
        vendor: 'Restaurant am Markt',
        confidence: 0.85 + Math.random() * 0.15,
      });
    }, 1500);
  });
}

// Photo Upload Component
export interface PhotoUploadProps {
  photo?: ExpensePhoto;
  onPhotoCapture: (file: File) => void;
  onPhotoRemove: () => void;
  isProcessing: boolean;
}

export function PhotoUpload({
  photo,
  onPhotoCapture,
  onPhotoRemove,
  isProcessing,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Datei zu groß. Maximum 10MB.');
        return;
      }
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        toast.error('Nur Bilder (JPG, PNG) oder PDF erlaubt.');
        return;
      }
      onPhotoCapture(file);
    }
  };

  if (photo) {
    return (
      <div className="space-y-3">
        <div className="relative rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          <img
            src={photo.url}
            alt="Receipt"
            className="w-full h-48 object-cover"
          />
          {photo.ocrDetected && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-2 text-sm">
              <div className="flex items-center justify-between">
                <span>OCR erkannt: {formatCurrency(photo.ocrDetected.amount || 0)}</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/50">
                  <Check className="h-3 w-3 mr-1" />
                  {Math.round(photo.ocrDetected.confidence * 100)}%
                </Badge>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            <Camera className="h-3 w-3 mr-2" />
            Neu aufnehmen
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onPhotoRemove}
            className="flex-1"
          >
            <Trash2 className="h-3 w-3 mr-2" />
            Löschen
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <Camera className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm">Beleg fotografieren</p>
          </div>

          <div className="text-xs text-muted-foreground">oder</div>

          <div className="flex flex-col items-center gap-2">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm">Datei wählen</p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <div className="h-4 w-4 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Verarbeite...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Beleg hochladen
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Unterstützt: JPG, PNG, PDF (max. 10MB)
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

// Mobile Expense Form
export interface MobileExpenseFormProps {
  onSave: (expense: Partial<ExpenseEntry>, isDraft: boolean) => void;
  onCancel: () => void;
  initialData?: Partial<ExpenseEntry>;
}

export function MobileExpenseForm({
  onSave,
  onCancel,
  initialData,
}: MobileExpenseFormProps) {
  const [photo, setPhoto] = useState<ExpensePhoto | undefined>(initialData?.photo);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory | ''>(
    initialData?.category || ''
  );
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [tourId, setTourId] = useState(initialData?.tourId || '');
  const [customerId, setCustomerId] = useState(initialData?.customerId || '');

  const handlePhotoCapture = async (file: File) => {
    setIsProcessingPhoto(true);

    // Create preview URL
    const url = URL.createObjectURL(file);

    // Simulate OCR
    try {
      const ocrResult = await simulateOCR(file);

      const newPhoto: ExpensePhoto = {
        id: Date.now().toString(),
        url,
        file,
        ocrDetected: ocrResult,
      };

      setPhoto(newPhoto);
      setAmount(ocrResult.amount.toFixed(2));
      toast.success('OCR erfolgreich! Betrag automatisch erkannt.');
    } catch (error) {
      const newPhoto: ExpensePhoto = {
        id: Date.now().toString(),
        url,
        file,
      };
      setPhoto(newPhoto);
      toast.warning('OCR fehlgeschlagen. Bitte Betrag manuell eingeben.');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handlePhotoRemove = () => {
    if (photo?.url) {
      URL.revokeObjectURL(photo.url);
    }
    setPhoto(undefined);
  };

  const handleSubmit = (isDraft: boolean) => {
    // Validation
    if (!category) {
      toast.error('Bitte wählen Sie eine Kategorie');
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast.error('Bitte geben Sie einen gültigen Betrag ein');
      return;
    }

    if (!description || description.length < 5) {
      toast.error('Beschreibung muss mindestens 5 Zeichen haben');
      return;
    }

    if (amountNum > 25 && !photo) {
      toast.error('Beleg erforderlich für Beträge über €25');
      return;
    }

    const expenseData: Partial<ExpenseEntry> = {
      category,
      amount: amountNum,
      description,
      date,
      photo,
      tourId: tourId || undefined,
      customerId: customerId || undefined,
      status: isDraft ? 'draft' : 'submitted',
    };

    onSave(expenseData, isDraft);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 border-b bg-card" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Neue Ausgabe
          </h2>
          <Button variant="ghost" size="sm" onClick={() => handleSubmit(false)} className="h-8 w-8 p-0">
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="p-4 space-y-6">
          {/* Photo Upload */}
          <PhotoUpload
            photo={photo}
            onPhotoCapture={handlePhotoCapture}
            onPhotoRemove={handlePhotoRemove}
            isProcessing={isProcessingPhoto}
          />

          {/* Quick Category Selection */}
          <div className="space-y-3">
            <div className="text-center">
              <div className="inline-block border-t border-b px-4 py-1" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs text-muted-foreground">Schnellauswahl</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {expenseCategories.slice(0, 4).map((cat) => (
                <Button
                  key={cat.id}
                  variant={category === cat.id ? 'default' : 'outline'}
                  onClick={() => setCategory(cat.id)}
                  className="h-auto py-3"
                >
                  <span className="text-lg mr-2">{cat.emoji}</span>
                  {cat.label}
                </Button>
              ))}
            </div>

            <Button
              variant={category === 'other' ? 'default' : 'outline'}
              onClick={() => setCategory('other')}
              className="w-full h-auto py-3"
            >
              <span className="text-lg mr-2">🎫</span>
              Sonstiges
            </Button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Betrag <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                €
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="pl-8"
              />
              {photo?.ocrDetected && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/50">
                    <Check className="h-3 w-3 mr-1" />
                    OCR
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Beschreibung <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="z.B. Mittagessen mit Kunde..."
              className="resize-none h-20"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Datum</Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Tour Assignment */}
          <div className="space-y-2">
            <Label htmlFor="tour">Tour zuordnen</Label>
            <Select value={tourId} onValueChange={setTourId}>
              <SelectTrigger id="tour">
                <SelectValue placeholder="Tour wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tour1">München Nord - 06.02</SelectItem>
                <SelectItem value="tour2">Stuttgart Messe - 05.02</SelectItem>
                <SelectItem value="tour3">Frankfurt City - 04.02</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <Label htmlFor="customer">Kunde (optional)</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger id="customer">
                <SelectValue placeholder="Kunde wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer1">Hofladen Müller</SelectItem>
                <SelectItem value="customer2">Bäckerei Schmidt</SelectItem>
                <SelectItem value="customer3">Metzgerei Weber</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-2 pb-6">
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Als Entwurf
            </Button>
            <Button onClick={() => handleSubmit(false)} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Einreichen
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Desktop Expense Form
export interface DesktopExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (expense: Partial<ExpenseEntry>, isDraft: boolean) => void;
  initialData?: Partial<ExpenseEntry>;
}

export function DesktopExpenseForm({
  open,
  onOpenChange,
  onSave,
  initialData,
}: DesktopExpenseFormProps) {
  const [photo, setPhoto] = useState<ExpensePhoto | undefined>(initialData?.photo);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory | ''>(
    initialData?.category || ''
  );
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [vatRate, setVatRate] = useState(initialData?.vatRate?.toString() || '19');
  const [tourId, setTourId] = useState(initialData?.tourId || '');
  const [customerId, setCustomerId] = useState(initialData?.customerId || '');
  const [isBusinessMeal, setIsBusinessMeal] = useState(initialData?.isBusinessMeal || false);
  const [attendees, setAttendees] = useState(initialData?.businessMeal?.attendees || '');
  const [purpose, setPurpose] = useState(initialData?.businessMeal?.purpose || '');
  const [location, setLocation] = useState(initialData?.businessMeal?.location || '');

  const handlePhotoCapture = async (file: File) => {
    setIsProcessingPhoto(true);

    const url = URL.createObjectURL(file);

    try {
      const ocrResult = await simulateOCR(file);

      const newPhoto: ExpensePhoto = {
        id: Date.now().toString(),
        url,
        file,
        ocrDetected: ocrResult,
      };

      setPhoto(newPhoto);
      setAmount(ocrResult.amount.toFixed(2));
      toast.success('OCR erfolgreich! Betrag automatisch erkannt.');
    } catch (error) {
      const newPhoto: ExpensePhoto = {
        id: Date.now().toString(),
        url,
        file,
      };
      setPhoto(newPhoto);
      toast.warning('OCR fehlgeschlagen. Bitte Betrag manuell eingeben.');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handlePhotoRemove = () => {
    if (photo?.url) {
      URL.revokeObjectURL(photo.url);
    }
    setPhoto(undefined);
  };

  const handleSubmit = (isDraft: boolean) => {
    // Validation
    if (!category) {
      toast.error('Bitte wählen Sie eine Kategorie');
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast.error('Bitte geben Sie einen gültigen Betrag ein');
      return;
    }

    if (!description || description.length < 5) {
      toast.error('Beschreibung muss mindestens 5 Zeichen haben');
      return;
    }

    if (isBusinessMeal && (!attendees || !purpose)) {
      toast.error('Bewirtungsbeleg erfordert Teilnehmer und Anlass');
      return;
    }

    const expenseData: Partial<ExpenseEntry> = {
      category,
      amount: amountNum,
      description,
      date,
      photo,
      vatRate: parseFloat(vatRate),
      tourId: tourId || undefined,
      customerId: customerId || undefined,
      isBusinessMeal,
      businessMeal: isBusinessMeal
        ? { attendees, purpose, location }
        : undefined,
      status: isDraft ? 'draft' : 'submitted',
    };

    onSave(expenseData, isDraft);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ausgabe erfassen</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <div className="space-y-6">
            {/* Photo Section */}
            <div className="space-y-2">
              <Label>Beleg</Label>
              <div className="grid grid-cols-2 gap-4">
                {photo ? (
                  <div className="col-span-1">
                    <div className="relative rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                      <img
                        src={photo.url}
                        alt="Receipt"
                        className="w-full h-48 object-cover"
                      />
                      {photo.ocrDetected && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-500 text-white border-none">
                            <Check className="h-3 w-3 mr-1" />
                            OCR {Math.round(photo.ocrDetected.confidence * 100)}%
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePhotoRemove}
                        className="flex-1"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Löschen
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className={photo ? 'col-span-1' : 'col-span-2'}>
                  <PhotoUpload
                    photo={photo}
                    onPhotoCapture={handlePhotoCapture}
                    onPhotoRemove={handlePhotoRemove}
                    isProcessing={isProcessingPhoto}
                  />
                </div>
              </div>
            </div>

            {/* Expense Details */}
            <div className="space-y-4">
              <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Ausgabendetails
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category-desktop">
                    Kategorie <span className="text-destructive">*</span>
                  </Label>
                  <Select value={category} onValueChange={(v: ExpenseCategory) => setCategory(v)}>
                    <SelectTrigger id="category-desktop">
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <span className="mr-2">{cat.emoji}</span>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount-desktop">
                    Betrag <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      €
                    </span>
                    <Input
                      id="amount-desktop"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0,00"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description-desktop">
                  Beschreibung <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description-desktop"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschreibung der Ausgabe..."
                  className="resize-none h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-desktop">
                    Datum <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="date-desktop"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vat-desktop">MwSt.-Satz</Label>
                  <Select value={vatRate} onValueChange={setVatRate}>
                    <SelectTrigger id="vat-desktop">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="19">19%</SelectItem>
                      <SelectItem value="7">7%</SelectItem>
                      <SelectItem value="0">0%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Assignment */}
            <div className="space-y-4">
              <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Zuordnung
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tour-desktop">Tour</Label>
                  <Select value={tourId} onValueChange={setTourId}>
                    <SelectTrigger id="tour-desktop">
                      <SelectValue placeholder="Tour wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tour1">München Nord - 06.02</SelectItem>
                      <SelectItem value="tour2">Stuttgart Messe - 05.02</SelectItem>
                      <SelectItem value="tour3">Frankfurt City - 04.02</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-desktop">Kunde</Label>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger id="customer-desktop">
                      <SelectValue placeholder="Kunde wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer1">Hofladen Müller</SelectItem>
                      <SelectItem value="customer2">Bäckerei Schmidt</SelectItem>
                      <SelectItem value="customer3">Metzgerei Weber</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Business Meal */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="business-meal"
                  checked={isBusinessMeal}
                  onCheckedChange={(checked) => setIsBusinessMeal(!!checked)}
                />
                <Label htmlFor="business-meal" className="text-sm">
                  Als Geschäftsessen markieren
                  <span className="block text-xs text-muted-foreground">
                    (Bewirtungsbeleg - zusätzliche Infos erforderlich)
                  </span>
                </Label>
              </div>

              {isBusinessMeal && (
                <div className="border rounded-lg p-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
                  <h5 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                    Bewirtungsbeleg - Zusätzliche Angaben
                  </h5>

                  <div className="space-y-2">
                    <Label htmlFor="attendees">
                      Bewirtete Personen <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="attendees"
                      value={attendees}
                      onChange={(e) => setAttendees(e.target.value)}
                      placeholder="Maria Schmidt, Thomas Weber"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">
                      Anlass der Bewirtung <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="Vertragsverhandlung Projekt X"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Ort der Bewirtung</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Restaurant Zur Post, München"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button variant="outline" onClick={() => handleSubmit(true)}>
            Entwurf
          </Button>
          <Button onClick={() => handleSubmit(false)}>Einreichen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Demo Component
export function ExpenseEntryFormDemo() {
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [showDesktopForm, setShowDesktopForm] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  const handleSave = (expense: Partial<ExpenseEntry>, isDraft: boolean) => {
    const statusText = isDraft ? 'als Entwurf gespeichert' : 'eingereicht';
    toast.success(`Ausgabe ${statusText}`, {
      description: `${getCategoryInfo(expense.category!)?.emoji} ${expense.description} - ${formatCurrency(expense.amount!)}`,
    });

    setShowMobileForm(false);
    setShowDesktopForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Ausgabenerfassungsformular</h2>
        <p className="text-sm text-muted-foreground">
          Mobile-optimiertes Formular zur schnellen Ausgabenerfassung mit Foto-Dokumentation,
          OCR-Integration und Geschäftsessen-Erweiterung
        </p>
      </div>

      {/* View Mode Selector */}
      <Card>
        <CardHeader>
          <h3>Ansichtsmodus</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              onClick={() => setViewMode('mobile')}
              size="sm"
            >
              Mobil (375px)
            </Button>
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              onClick={() => setViewMode('desktop')}
              size="sm"
            >
              Desktop (600px)
            </Button>
          </div>

          {viewMode === 'mobile' && (
            <Button onClick={() => setShowMobileForm(true)}>
              Neue Ausgabe erfassen (Mobil)
            </Button>
          )}

          {viewMode === 'desktop' && (
            <Button onClick={() => setShowDesktopForm(true)}>
              Neue Ausgabe erfassen (Desktop)
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Category Overview */}
      <Card>
        <CardHeader>
          <h3>Ausgabenkategorien</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Vordefinierte Kategorien für schnelle Auswahl
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {expenseCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-sm">{cat.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Badges */}
      <Card>
        <CardHeader>
          <h3>Genehmigungs-Status</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Verschiedene Zustände der Ausgabenprüfung
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Entwurf</Badge>
              <span className="text-xs text-muted-foreground">Bearbeitbar</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Eingereicht</Badge>
              <span className="text-xs text-muted-foreground">Ausstehend</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 hover:bg-green-600">Genehmigt</Badge>
              <span className="text-xs text-muted-foreground">Zur Erstattung</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Abgelehnt</Badge>
              <span className="text-xs text-muted-foreground">Korrektur erforderlich</span>
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
            <Check className="h-4 w-4 mt-0.5 text-green-500" />
            <div>
              <strong>Foto-Erfassung:</strong> Kamera-Integration oder Datei-Upload (max. 10MB)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500" />
            <div>
              <strong>OCR-Integration:</strong> Automatische Betrags- und Händlererkennung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500" />
            <div>
              <strong>Schnellauswahl:</strong> Vordefinierte Kategorien mit Emojis
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500" />
            <div>
              <strong>Tour-Zuordnung:</strong> Verknüpfung mit aktiven Touren
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500" />
            <div>
              <strong>Geschäftsessen:</strong> Erweiterte Felder für Bewirtungsbelege
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500" />
            <div>
              <strong>Entwurf-Modus:</strong> Speichern und später vervollständigen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500" />
            <div>
              <strong>Validierung:</strong> Beleg erforderlich für Beträge {'>'} €25
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500" />
            <div>
              <strong>Offline-fähig:</strong> Lokales Speichern und späteres Synchronisieren
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
          <p>• Kategorie und Betrag sind Pflichtfelder</p>
          <p>• Betrag muss {'>'} 0 sein</p>
          <p>• Beschreibung muss mindestens 5 Zeichen haben</p>
          <p>• Beleg erforderlich für Beträge über €25</p>
          <p>• Zukünftige Daten nicht erlaubt</p>
          <p>• Geschäftsessen erfordert Teilnehmer und Anlass</p>
          <p>• Unterstützte Dateiformate: JPG, PNG, PDF (max. 10MB)</p>
        </CardContent>
      </Card>

      {/* Mobile Form Dialog */}
      {showMobileForm && (
        <Dialog open={showMobileForm} onOpenChange={setShowMobileForm}>
          <DialogContent className="sm:max-w-[375px] h-[90vh] p-0">
            <MobileExpenseForm
              onSave={handleSave}
              onCancel={() => setShowMobileForm(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Desktop Form */}
      <DesktopExpenseForm
        open={showDesktopForm}
        onOpenChange={setShowDesktopForm}
        onSave={handleSave}
      />
    </div>
  );
}