import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Sheet, SheetContent } from './ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner@2.0.3';
import {
  X,
  Phone,
  MapPin,
  Mail,
  Edit3,
  Camera,
  Users,
  Mic,
  MicOff,
  Calendar as CalendarIcon,
  Clock,
  Bell,
  Image as ImageIcon,
  Plus,
  Check,
  MapPinned,
  Loader2,
  AlertCircle,
  ChevronDown,
  Upload,
} from 'lucide-react';

// Types
type ActivityType = 'call' | 'visit' | 'email' | 'note' | 'photo' | 'meeting';

interface Customer {
  id: string;
  name: string;
  distance?: number;
}

interface ActivityLog {
  id: string;
  type: ActivityType;
  customerId: string;
  customerName: string;
  description: string;
  date: Date;
  nextStep?: string;
  followUpDate?: Date;
  followUpReminder: boolean;
  photoUrl?: string;
  syncStatus: 'pending' | 'synced' | 'error';
}

// Mock data
const mockRecentCustomers: Customer[] = [
  { id: 'C001', name: 'Hofladen Müller GmbH', distance: 500 },
  { id: 'C002', name: 'REWE München Süd' },
  { id: 'C003', name: 'Bäckerei Schmidt' },
  { id: 'C004', name: 'Gasthaus Alpenblick' },
  { id: 'C005', name: 'Café Zentral' },
];

const quickTemplates = [
  'Angebot präsentiert',
  'Nachfass-Termin vereinbart',
  'Kunde hat Interesse',
  'Preis besprochen',
  'Dokumente übergeben',
  'Projektstart geplant',
];

const activityTypes: Array<{
  type: ActivityType;
  label: string;
  icon: any;
}> = [
  { type: 'call', label: 'Anruf', icon: Phone },
  { type: 'visit', label: 'Besuch', icon: MapPin },
  { type: 'email', label: 'E-Mail', icon: Mail },
  { type: 'note', label: 'Notiz', icon: Edit3 },
  { type: 'photo', label: 'Foto', icon: Camera },
  { type: 'meeting', label: 'Besprechung', icon: Users },
];

// Format date
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

// Format time
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Quick Activity Log Form
function QuickActivityLogForm({
  isOpen,
  onClose,
  onSave,
  isOffline = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<ActivityLog, 'id' | 'syncStatus'>) => void;
  isOffline?: boolean;
}) {
  const [activityType, setActivityType] = useState<ActivityType | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [nextStep, setNextStep] = useState('');
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>();
  const [showFollowUpPicker, setShowFollowUpPicker] = useState(false);
  const [followUpReminder, setFollowUpReminder] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // GPS suggested customer
  const gpsSuggestion = mockRecentCustomers.find((c) => c.distance);

  // Reset form
  const resetForm = () => {
    setActivityType(null);
    setSelectedCustomer(null);
    setDescription('');
    setDate(new Date());
    setNextStep('');
    setFollowUpDate(undefined);
    setFollowUpReminder(false);
    setPhotoUrl(undefined);
    setIsRecording(false);
  };

  // Handle save
  const handleSave = async () => {
    if (!activityType) {
      toast.error('Fehler', { description: 'Bitte wählen Sie einen Aktivitätstyp' });
      return;
    }
    if (!selectedCustomer) {
      toast.error('Fehler', { description: 'Bitte wählen Sie einen Kunden' });
      return;
    }
    if (!description.trim()) {
      toast.error('Fehler', { description: 'Bitte geben Sie eine Beschreibung ein' });
      return;
    }

    setIsSaving(true);

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const activity: Omit<ActivityLog, 'id' | 'syncStatus'> = {
      type: activityType,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      description,
      date,
      nextStep: nextStep.trim() || undefined,
      followUpDate,
      followUpReminder,
      photoUrl,
    };

    onSave(activity);
    setIsSaving(false);
    resetForm();
    onClose();

    if (isOffline) {
      toast.success('Aktivität in Warteschlange', {
        description: 'Wird synchronisiert, sobald Sie online sind',
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } else {
      toast.success('Aktivität gespeichert', {
        description: 'Die Aktivität wurde erfolgreich protokolliert',
      });
    }
  };

  // Handle voice recording
  const handleVoiceRecording = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      toast.info('Aufnahme läuft...', {
        description: 'Sprechen Sie jetzt',
        duration: 3000,
      });

      // Simulate speech recognition
      setTimeout(() => {
        const simulatedText =
          'Kunde ist sehr zufrieden mit dem Angebot. Entscheidung soll nächste Woche fallen. Follow-up am Freitag vereinbart.';
        setDescription((prev) => (prev ? prev + ' ' + simulatedText : simulatedText));
        setIsRecording(false);
        toast.success('Text transkribiert', {
          description: 'Überprüfen Sie bitte den Text',
        });
      }, 3000);
    } else {
      // Stop recording
      setIsRecording(false);
    }
  };

  // Handle template click
  const handleTemplateClick = (template: string) => {
    setDescription((prev) => (prev ? prev + ' ' + template + '.' : template + '.'));
  };

  // Handle quick time
  const handleQuickTime = (hoursAgo: number) => {
    const newDate = new Date();
    newDate.setHours(newDate.getHours() - hoursAgo);
    setDate(newDate);
  };

  // Handle photo
  const handlePhotoCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      toast.success('Foto hinzugefügt');
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[95vh] p-0 rounded-t-xl">
          {/* Handle Bar */}
          <div className="flex justify-center py-3 border-b border-border">
            <div className="w-12 h-1 bg-muted-foreground/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h2 className="mb-1">Aktivität hinzufügen</h2>
                {selectedCustomer && (
                  <p className="text-muted-foreground">{selectedCustomer.name}</p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {isOffline && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                <AlertCircle className="h-3 w-3 mr-1" />
                Offline - wird später synchronisiert
              </Badge>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="h-[calc(95vh-190px)] overflow-y-auto px-6 py-6 space-y-6">
            {/* Activity Type */}
            <div>
              <Label className="mb-3 block">Aktivitätstyp</Label>
              <div className="grid grid-cols-3 gap-3">
                {activityTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = activityType === type.type;
                  return (
                    <button
                      key={type.type}
                      className={`h-20 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-border hover:border-primary hover:bg-muted'
                      }`}
                      onClick={() => setActivityType(type.type)}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Selection */}
            <div>
              <Label>Kunde auswählen</Label>
              <Select
                value={selectedCustomer?.id}
                onValueChange={(id) => {
                  const customer = mockRecentCustomers.find((c) => c.id === id);
                  setSelectedCustomer(customer || null);
                }}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Kunde wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {gpsSuggestion && (
                    <>
                      <div className="px-2 py-1.5 text-sm text-muted-foreground flex items-center gap-2">
                        <MapPinned className="h-4 w-4" />
                        In der Nähe
                      </div>
                      <SelectItem value={gpsSuggestion.id}>
                        <div className="flex items-center gap-2">
                          <span>{gpsSuggestion.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {gpsSuggestion.distance}m
                          </Badge>
                        </div>
                      </SelectItem>
                      <Separator className="my-1" />
                    </>
                  )}
                  {mockRecentCustomers
                    .filter((c) => c.id !== gpsSuggestion?.id)
                    .map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label>Beschreibung</Label>
              <div className="relative mt-2">
                <Textarea
                  placeholder="Was wurde besprochen oder vereinbart?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="pr-14"
                />
                <Button
                  variant={isRecording ? 'destructive' : 'secondary'}
                  size="sm"
                  className={`absolute bottom-3 right-3 h-10 w-10 p-0 ${
                    isRecording ? 'animate-pulse' : ''
                  }`}
                  onClick={handleVoiceRecording}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
              </div>
              <p className="text-muted-foreground text-xs mt-1">
                {description.length} Zeichen
              </p>
            </div>

            {/* Quick Templates */}
            <div>
              <Label className="mb-2 block">Schnellvorlagen</Label>
              <div className="flex flex-wrap gap-2">
                {quickTemplates.map((template) => (
                  <Badge
                    key={template}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleTemplateClick(template)}
                  >
                    {template}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <Label className="mb-2 block">Datum & Uhrzeit</Label>
              <div className="flex gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDate(new Date())}
                >
                  Jetzt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickTime(1)}
                >
                  Vor 1 Std
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickTime(2)}
                >
                  Vor 2 Std
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(date)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        if (newDate) {
                          setDate(newDate);
                          setShowDatePicker(false);
                        }
                      }}
                      locale={undefined}
                    />
                  </PopoverContent>
                </Popover>

                <Button variant="outline" className="justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  {formatTime(date)}
                </Button>
              </div>
            </div>

            {/* Next Step */}
            <div>
              <Label>Nächster Schritt (Optional)</Label>
              <Textarea
                placeholder="Was ist der nächste Schritt?"
                value={nextStep}
                onChange={(e) => setNextStep(e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>

            {/* Follow-up Date */}
            <div>
              <Label className="mb-2 block">Follow-up Termin (Optional)</Label>
              <Popover open={showFollowUpPicker} onOpenChange={setShowFollowUpPicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {followUpDate ? formatDate(followUpDate) : 'Termin auswählen...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={followUpDate}
                    onSelect={(newDate) => {
                      setFollowUpDate(newDate);
                      setShowFollowUpPicker(false);
                    }}
                    locale={undefined}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>

              {followUpDate && (
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span>Erinnerung setzen</span>
                  </div>
                  <Switch
                    checked={followUpReminder}
                    onCheckedChange={setFollowUpReminder}
                  />
                </div>
              )}
            </div>

            {/* Photo */}
            <div>
              <Label className="mb-2 block">Foto hinzufügen (Optional)</Label>
              {photoUrl ? (
                <div className="relative">
                  <img
                    src={photoUrl}
                    alt="Captured"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => setPhotoUrl(undefined)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handlePhotoCapture}>
                    <Camera className="mr-2 h-4 w-4" />
                    Foto aufnehmen
                  </Button>
                  <Button variant="outline" onClick={handlePhotoCapture}>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Aus Galerie
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border bg-background">
            <div className="space-y-2">
              <Button
                className="w-full"
                size="lg"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isOffline ? 'Wird in Warteschlange gesetzt...' : 'Speichert...'}
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Speichern
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={onClose}
                disabled={isSaving}
              >
                Abbrechen
              </Button>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

// Main Quick Activity Log Component
export function QuickActivityLog() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  // Handle save activity
  const handleSaveActivity = (activity: Omit<ActivityLog, 'id' | 'syncStatus'>) => {
    const newActivity: ActivityLog = {
      ...activity,
      id: `activity-${Date.now()}`,
      syncStatus: isOffline ? 'pending' : 'synced',
    };
    setActivities([newActivity, ...activities]);
  };

  // Count pending activities
  const pendingCount = activities.filter((a) => a.syncStatus === 'pending').length;

  // Get activity type label
  const getActivityTypeLabel = (type: ActivityType): string => {
    const typeObj = activityTypes.find((t) => t.type === type);
    return typeObj?.label || type;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="mb-1">Schnelle Aktivitätsverwaltung</h2>
        <p className="text-muted-foreground">
          Protokollieren Sie Kundenaktivitäten mit Spracheingabe
        </p>
      </div>

      {/* Demo Controls */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between mb-3">
          <p className="text-muted-foreground">Demo-Steuerung</p>
          <div className="flex items-center gap-2">
            <Label htmlFor="offline-mode">Offline-Modus</Label>
            <Switch
              id="offline-mode"
              checked={isOffline}
              onCheckedChange={setIsOffline}
            />
          </div>
        </div>
        {isOffline && pendingCount > 0 && (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 w-full justify-center py-2">
            <Upload className="h-4 w-4 mr-2" />
            {pendingCount} Aktivität{pendingCount > 1 ? 'en' : ''} warten auf Synchronisation
          </Badge>
        )}
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto p-4">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Edit3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">Keine Aktivitäten</h3>
            <p className="text-muted-foreground mb-6">
              Tippen Sie auf den Button unten, um eine Aktivität zu protokollieren
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const typeObj = activityTypes.find((t) => t.type === activity.type);
              const Icon = typeObj?.icon || Edit3;
              return (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <p className="mb-0.5">{activity.customerName}</p>
                            <p className="text-muted-foreground text-sm">
                              {getActivityTypeLabel(activity.type)}
                            </p>
                          </div>
                          {activity.syncStatus === 'pending' && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Ausstehend
                            </Badge>
                          )}
                          {activity.syncStatus === 'synced' && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Check className="h-3 w-3 mr-1" />
                              Synchronisiert
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mb-2">{activity.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{formatDate(activity.date)}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{formatTime(activity.date)}</span>
                        </div>
                        {activity.nextStep && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            <span className="text-muted-foreground">Nächster Schritt: </span>
                            {activity.nextStep}
                          </div>
                        )}
                        {activity.followUpDate && (
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <Bell className="h-4 w-4 text-primary" />
                            <span>Follow-up: {formatDate(activity.followUpDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Quick Activity Log Form */}
      <QuickActivityLogForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveActivity}
        isOffline={isOffline}
      />
    </div>
  );
}

// Demo Component
export function QuickActivityLogDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4">Schnelle Aktivitätsverwaltung (Mobile)</h2>
          <p className="text-muted-foreground mb-6">
            Mobile PWA-Komponente für schnelles Protokollieren von Kundenaktivitäten mit
            Spracheingabe, Schnellvorlagen, Foto-Upload und Offline-Unterstützung
          </p>

          <div>
            <h3 className="mb-3">Features:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Bottom-Sheet-Modal mit Swipe-Gesten</li>
              <li>• 6 Aktivitätstypen mit großen Touch-Buttons</li>
              <li>• Kundenauswahl mit GPS-Vorschlag</li>
              <li>• Voice-to-Text mit Mikrofon-Button</li>
              <li>• 6 Schnellvorlagen als klickbare Chips</li>
              <li>• Datum/Zeit-Auswahl mit Quick-Options (Jetzt/Vor 1 Std/Vor 2 Std)</li>
              <li>• Optionales "Nächster Schritt" Feld</li>
              <li>• Follow-up-Datum mit Erinnerungsfunktion</li>
              <li>• Foto-Upload (Kamera oder Galerie)</li>
              <li>• Offline-Modus mit Warteschlange</li>
              <li>• Sync-Status-Badges (Ausstehend/Synchronisiert)</li>
              <li>• Aktivitätsliste mit Icons</li>
              <li>• FAB für schnellen Zugriff</li>
              <li>• Toast-Benachrichtigungen</li>
              <li>• Vollständige deutsche Lokalisierung</li>
              <li>• Web Speech API Integration bereit</li>
              <li>• PouchDB Offline-Support bereit</li>
            </ul>
          </div>

          <Separator className="my-6" />

          <div className="max-w-sm mx-auto border border-border rounded-lg overflow-hidden shadow-xl">
            <QuickActivityLog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
