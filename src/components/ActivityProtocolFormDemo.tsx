import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { RichTextEditor } from './RichTextEditor';
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner@2.0.3';
import {
  Phone,
  Mail,
  Calendar as CalendarIcon,
  FileText,
  Building2,
  Mic,
  MicOff,
  User,
  Clock,
  Plus,
  X,
  CloudOff,
  ChevronDown,
  Save,
  RotateCcw,
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Activity types
const activityTypes = [
  { id: 'call', label: 'Anruf', icon: Phone },
  { id: 'email', label: 'E-Mail', icon: Mail },
  { id: 'meeting', label: 'Meeting', icon: CalendarIcon },
  { id: 'note', label: 'Notiz', icon: FileText },
];

// Customer data
const customers = [
  { id: '1', name: 'Hofladen Müller GmbH' },
  { id: '2', name: 'REWE Köln' },
  { id: '3', name: 'Bäckerei Schmidt KG' },
  { id: '4', name: 'Cafe Latte GmbH' },
];

// Contact persons
const contacts = [
  { id: '1', customerId: '1', name: 'Hans Müller', position: 'Geschäftsführer' },
  { id: '2', customerId: '1', name: 'Maria Müller', position: 'Einkaufsleitung' },
  { id: '3', customerId: '2', name: 'Thomas Weber', position: 'Filialleiter' },
];

// Templates
const templates = [
  {
    id: 'first-contact',
    label: 'Erstkontakt',
    data: {
      subject: 'Erstkontakt',
      description: 'Erstes Gespräch mit Kunde. Bedarfsermittlung...',
    },
  },
  {
    id: 'quote-sent',
    label: 'Angebot versendet',
    data: {
      subject: 'Angebot versendet',
      description: 'Angebot Nr. XXX versendet. Nächster Schritt: Rückmeldung abwarten.',
    },
  },
  {
    id: 'follow-up',
    label: 'Follow-up Anruf',
    data: {
      subject: 'Follow-up Anruf',
      description: 'Nachfassgespräch zu...',
    },
  },
  {
    id: 'meeting-protocol',
    label: 'Meeting-Protokoll',
    data: {
      subject: 'Meeting-Protokoll',
      description: 'Teilnehmer:\n\nBesprochene Themen:\n\nNächste Schritte:\n',
    },
  },
];

// Desktop Dialog Form
function DesktopActivityForm() {
  const [open, setOpen] = useState(false);
  const [activityType, setActivityType] = useState('call');
  const [customer, setCustomer] = useState('1');
  const [contactPerson, setContactPerson] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [duration, setDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState('minutes');
  const [nextSteps, setNextSteps] = useState('');
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>();
  const [isPrivate, setIsPrivate] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFollowUpPicker, setShowFollowUpPicker] = useState(false);

  const characterCount = description.length;
  const maxCharacters = 2000;

  const availableContacts = contacts.filter((c) => c.customerId === customer);

  const handleSave = () => {
    if (!subject || !description) {
      toast.error('Pflichtfelder fehlen', {
        description: 'Bitte füllen Sie alle erforderlichen Felder aus.',
      });
      return;
    }

    toast.success('Aktivität wurde protokolliert', {
      description: 'Die Aktivität wurde erfolgreich gespeichert.',
      action: {
        label: 'Rückgängig',
        onClick: () => console.log('Undo'),
      },
    });
    setOpen(false);
    resetForm();
  };

  const handleSaveAndNew = () => {
    handleSave();
    setOpen(true);
  };

  const resetForm = () => {
    setActivityType('call');
    setCustomer('1');
    setContactPerson('');
    setSubject('');
    setDescription('');
    setDate(new Date());
    setDuration('');
    setNextSteps('');
    setFollowUpDate(undefined);
    setIsPrivate(false);
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSubject(template.data.subject);
      setDescription(template.data.description);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.info('Spracheingabe gestartet', {
        description: 'Hört zu...',
      });
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false);
        setDescription(
          description +
            'Besprochen: Neue Filiale in München Süd geplant für Q1 2025. Interesse an Ladeneinrichtung. Budget ca. € 120.000.'
        );
        toast.success('Spracheingabe beendet', {
          description: 'Text wurde transkribiert.',
        });
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Desktop Dialog-Formular</h4>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Aktivität erfassen
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aktivität erfassen</DialogTitle>
            <DialogDescription>
              {customer && (
                <Badge variant="secondary" className="mt-2">
                  <Building2 className="mr-1 h-3 w-3" />
                  Kunde: {customers.find((c) => c.id === customer)?.name}
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Activity Type Selection */}
            <div className="space-y-3">
              <Label>Art der Aktivität *</Label>
              <div className="grid grid-cols-4 gap-3">
                {activityTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = activityType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setActivityType(type.id)}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:border-primary/50'
                      }`}
                    >
                      <Icon className="h-8 w-8" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Vorlage verwenden
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {templates.map((template) => (
                    <DropdownMenuItem
                      key={template.id}
                      onClick={() => applyTemplate(template.id)}
                    >
                      {template.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Separator />

            {/* Customer Selection */}
            <div className="space-y-2">
              <Label htmlFor="customer">Kunde *</Label>
              <Select value={customer} onValueChange={setCustomer}>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Kunde auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Contact Person */}
            <div className="space-y-2">
              <Label htmlFor="contact">Kontaktperson</Label>
              <Select value={contactPerson} onValueChange={setContactPerson}>
                <SelectTrigger id="contact">
                  <SelectValue placeholder="Ansprechpartner auswählen (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {availableContacts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.position})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Betreff *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="z.B. Telefonat zu neuem Projekt, Follow-up Meeting"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                Kurze Zusammenfassung der Aktivität
              </p>
            </div>

            {/* Description with Voice Input */}
            <RichTextEditor
              id="description"
              label="Beschreibung"
              value={description}
              onChange={setDescription}
              placeholder="Was wurde besprochen oder vereinbart? Nächste Schritte..."
              minHeight={200}
              maxLength={maxCharacters}
              helpText="Detaillierte Notizen zur Aktivität. Nutzen Sie Formatierung für Struktur."
              toolbar="standard"
              withVoice
              onVoiceClick={toggleRecording}
              isRecording={isRecording}
              required
            />

            {/* Date & Time */}
            <div className="space-y-2">
              <Label>Datum & Uhrzeit *</Label>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd.MM.yyyy, HH:mm 'Uhr'", { locale: de }) : 'Datum auswählen'}
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">Zeitpunkt der Aktivität</p>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Dauer</Label>
              <div className="flex gap-2">
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="30"
                  className="flex-1"
                />
                <Select value={durationUnit} onValueChange={setDurationUnit}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minuten</SelectItem>
                    <SelectItem value="hours">Stunden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Next Steps */}
            <RichTextEditor
              id="next-steps"
              label="Nächste Schritte"
              value={nextSteps}
              onChange={setNextSteps}
              placeholder="Was sind die nächsten Schritte oder Folgetermine?"
              minHeight={100}
              maxLength={500}
              helpText="Aufgabenliste für Follow-up Aktionen"
              toolbar="basicTasks"
            />

            {/* Follow-up Date */}
            <div className="space-y-2">
              <Label>Follow-up Termin</Label>
              <Popover open={showFollowUpPicker} onOpenChange={setShowFollowUpPicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {followUpDate
                      ? format(followUpDate, 'dd.MM.yyyy', { locale: de })
                      : 'TT.MM.JJJJ'}
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Automatische Erinnerung für Folgeaktion
              </p>
            </div>

            {/* Private Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox id="private" checked={isPrivate} onCheckedChange={(checked) => setIsPrivate(checked as boolean)} />
              <label
                htmlFor="private"
                className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Diese Aktivität ist privat
              </label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Privat = Nur für Sie sichtbar, nicht für andere Mitarbeiter
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="outline" onClick={handleSaveAndNew}>
              <Save className="mr-2 h-4 w-4" />
              Speichern & Neu
            </Button>
            <Button onClick={handleSave}>Aktivität speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="text-sm text-muted-foreground">
        Dialog mit allen Feldern, Vorlagenauswahl und Spracheingabe
      </p>
    </div>
  );
}

// Mobile Bottom Sheet Form
function MobileActivityForm() {
  const [open, setOpen] = useState(false);
  const [activityType, setActivityType] = useState('call');
  const [customer, setCustomer] = useState('1');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [showAllFields, setShowAllFields] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const characterCount = description.length;
  const maxCharacters = 2000;

  const handleSave = () => {
    if (!subject || !description) {
      toast.error('Pflichtfelder fehlen');
      return;
    }

    toast.success('Aktivität protokolliert', {
      description: 'Wird synchronisiert...',
    });
    setOpen(false);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.info('Hört zu...');
      setTimeout(() => {
        setIsRecording(false);
        setDescription(
          'Telefonat mit Hans Müller bezüglich neuem Projekt für Filiale Süd. Follow-up in einer Woche vereinbart.'
        );
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Mobile Bottom Sheet (Schnellerfassung)</h4>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schnellerfassung (Mobile)
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Aktivität erfassen</SheetTitle>
            <SheetDescription>
              <Badge variant="secondary" className="mt-2">
                <Building2 className="mr-1 h-3 w-3" />
                Kunde: Hofladen Müller GmbH
              </Badge>
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Activity Type Selection */}
            <div className="space-y-3">
              <Label>Art der Aktivität *</Label>
              <div className="grid grid-cols-2 gap-3">
                {activityTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = activityType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setActivityType(type.id)}
                      className={`flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background'
                      }`}
                    >
                      <Icon className="h-10 w-10" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {!showAllFields ? (
              <>
                {/* Quick Capture Mode */}
                <div className="space-y-2">
                  <Label htmlFor="mobile-subject">Betreff *</Label>
                  <Input
                    id="mobile-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="z.B. Telefonat zu neuem Projekt"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile-description">Beschreibung *</Label>
                  <div className="relative">
                    <Textarea
                      id="mobile-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Was wurde besprochen?"
                      rows={6}
                      maxLength={maxCharacters}
                      className="pr-12"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant={isRecording ? 'destructive' : 'default'}
                      className="absolute bottom-3 right-3 h-12 w-12 rounded-full"
                      onClick={toggleRecording}
                    >
                      {isRecording ? (
                        <MicOff className="h-6 w-6 animate-pulse" />
                      ) : (
                        <Mic className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {characterCount} / {maxCharacters}
                  </p>
                </div>

                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => setShowAllFields(true)}
                >
                  Mehr Felder anzeigen
                </Button>
              </>
            ) : (
              <>
                {/* All Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile-customer">Kunde *</Label>
                    <Select value={customer} onValueChange={setCustomer}>
                      <SelectTrigger id="mobile-customer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile-subject-full">Betreff *</Label>
                    <Input
                      id="mobile-subject-full"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="z.B. Telefonat zu neuem Projekt"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile-description-full">Beschreibung *</Label>
                    <div className="relative">
                      <Textarea
                        id="mobile-description-full"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Was wurde besprochen?"
                        rows={6}
                        maxLength={maxCharacters}
                        className="pr-12"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant={isRecording ? 'destructive' : 'default'}
                        className="absolute bottom-3 right-3 h-12 w-12 rounded-full"
                        onClick={toggleRecording}
                      >
                        {isRecording ? (
                          <MicOff className="h-6 w-6 animate-pulse" />
                        ) : (
                          <Mic className="h-6 w-6" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      {characterCount} / {maxCharacters}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <SheetFooter className="flex-row gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Abbrechen
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Speichern
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <p className="text-sm text-muted-foreground">
        Bottom Sheet für mobile Geräte, optimiert für schnelle Erfassung mit Spracheingabe
      </p>
    </div>
  );
}

// Offline Support Indicator
function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Offline-Unterstützung</h4>

      <div className="space-y-3">
        <Button variant="outline" onClick={() => setIsOffline(!isOffline)}>
          Offline-Modus {isOffline ? 'deaktivieren' : 'aktivieren'}
        </Button>

        {isOffline && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <CloudOff className="h-5 w-5 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Offline
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Wird synchronisiert, wenn online
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Aktivitäten werden lokal gespeichert und automatisch synchronisiert
      </p>
    </div>
  );
}

// Voice Input Demo
function VoiceInputDemo() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = () => {
    setIsRecording(true);
    toast.info('Spracheingabe gestartet', {
      description: 'Hört zu...',
    });

    // Simulate voice recognition
    setTimeout(() => {
      setIsRecording(false);
      const text =
        'Telefonat mit Hans Müller bezüglich neuem Projekt für Filiale München Süd. Interesse an Ladeneinrichtung bekundet. Budget circa einhundertzwanzigtausend Euro. Nächster Schritt: Besichtigungstermin vereinbaren für kommende Woche.';
      setTranscript(text);
      toast.success('Transkription abgeschlossen');
    }, 4000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast.info('Aufnahme gestoppt');
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Spracheingabe-Demo</h4>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? 'destructive' : 'default'}
            className="flex-1"
          >
            {isRecording ? (
              <>
                <MicOff className="mr-2 h-4 w-4 animate-pulse" />
                Aufnahme beenden
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Spracheingabe starten
              </>
            )}
          </Button>
        </div>

        {isRecording && (
          <div className="flex items-center justify-center gap-3 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <div className="h-3 w-3 bg-destructive rounded-full animate-pulse" />
            <span className="text-sm font-medium">Hört zu...</span>
          </div>
        )}

        {transcript && (
          <div className="space-y-2">
            <Label>Transkription:</Label>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={5}
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Transkription kann bearbeitet werden
            </p>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Web Speech API Simulation für deutsche Sprache
      </p>
    </div>
  );
}

// Template Application Demo
function TemplateDemo() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const applyTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.data.subject);
      setDescription(template.data.description);
      toast.success('Vorlage angewendet');
    }
  };

  const resetForm = () => {
    setSelectedTemplate(null);
    setSubject('');
    setDescription('');
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Vorlagen-System</h4>

      <div className="space-y-3">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Vorlage verwenden
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {templates.map((template) => (
                <DropdownMenuItem
                  key={template.id}
                  onClick={() => applyTemplate(template.id)}
                >
                  {template.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon" onClick={resetForm}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {selectedTemplate && (
          <Badge variant="secondary">
            Vorlage: {templates.find((t) => t.id === selectedTemplate)?.label}
          </Badge>
        )}

        <div className="space-y-2">
          <Label htmlFor="template-subject">Betreff</Label>
          <Input
            id="template-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Betreff"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-description">Beschreibung</Label>
          <Textarea
            id="template-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung"
            rows={5}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Vordefinierte Vorlagen für häufige Aktivitätstypen
      </p>
    </div>
  );
}

// Visual Form Example
function VisualFormExample() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Visuelles Formular-Beispiel</h4>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Aktivität erfassen</CardTitle>
          <CardDescription>
            <Badge variant="secondary" className="mt-2">
              <Building2 className="mr-1 h-3 w-3" />
              Kunde: Hofladen Müller GmbH
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Activity Type */}
          <div className="space-y-3">
            <Label>Art der Aktivität *</Label>
            <div className="grid grid-cols-4 gap-3">
              {activityTypes.map((type, index) => {
                const Icon = type.icon;
                const isSelected = index === 0;
                return (
                  <div
                    key={type.id}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 ${
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background'
                    }`}
                  >
                    <Icon className="h-8 w-8" />
                    <span className="text-sm">{type.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Subject */}
          <div className="space-y-2">
            <Label>Betreff *</Label>
            <Input
              value="Telefonat zu neuem Projekt"
              readOnly
              className="bg-muted"
            />
          </div>

          {/* Description with Voice Button */}
          <div className="space-y-2">
            <Label>Beschreibung *</Label>
            <div className="relative">
              <Textarea
                value="Besprochen: Neue Filiale in München Süd geplant für Q1 2025. Interesse an Ladeneinrichtung. Budget ca. € 120.000. Nächster Schritt: Besichtigungstermin vereinbaren."
                rows={4}
                readOnly
                className="bg-muted pr-12"
              />
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-2 right-2"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              150 / 2000 Zeichen
            </p>
          </div>

          {/* Date & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Datum & Uhrzeit *</Label>
              <Input
                value="15.11.2024, 14:30 Uhr"
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Dauer</Label>
              <Input value="15 Minuten" readOnly className="bg-muted" />
            </div>
          </div>

          {/* Private Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox id="static-private" />
            <label htmlFor="static-private" className="text-sm">
              Diese Aktivität ist privat
            </label>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Statische Darstellung mit ausgefüllten Beispieldaten
      </p>
    </div>
  );
}

export function ActivityProtocolFormDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Desktop Dialog-Formular</CardTitle>
          <CardDescription>
            Vollständiges Formular mit allen Feldern, Vorlagen und Spracheingabe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DesktopActivityForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mobile Bottom Sheet</CardTitle>
          <CardDescription>
            Optimiert für Schnellerfassung mit großen Touch-Buttons und Spracheingabe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MobileActivityForm />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Spracheingabe</CardTitle>
          <CardDescription>
            Web Speech API für deutsche Spracheingabe mit Live-Transkription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VoiceInputDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vorlagen-System</CardTitle>
          <CardDescription>
            Vordefinierte Vorlagen für häufige Aktivitätstypen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateDemo />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Offline-Unterstützung</CardTitle>
          <CardDescription>
            Lokale Speicherung und automatische Synchronisierung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OfflineIndicator />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Visuelles Beispiel</CardTitle>
          <CardDescription>
            Statisches Formular mit ausgefüllten Beispieldaten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VisualFormExample />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Aktivitätstypen</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 4 Typen: Anruf, E-Mail, Meeting, Notiz</li>
              <li>• Icon: 32px (Desktop), 40px (Mobile)</li>
              <li>• Button: 100×80px (Desktop)</li>
              <li>• Ausgewählt: Blauer Hintergrund</li>
              <li>• Touch-optimiert für Mobile</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Pflichtfelder</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Aktivitätstyp</li>
              <li>• Kunde (wenn nicht im Kontext)</li>
              <li>• Betreff (5-200 Zeichen)</li>
              <li>• Beschreibung (10-2000 Zeichen)</li>
              <li>• Datum & Uhrzeit</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Spracheingabe</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Web Speech API</li>
              <li>• Sprache: Deutsch (de-DE)</li>
              <li>• Icon: Mikrofon (blau/rot)</li>
              <li>• Aufnahme: Pulsierender Indikator</li>
              <li>• Editierbare Transkription</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Mobile Optimierung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Bottom Sheet (90vh)</li>
              <li>• Große Touch-Buttons (48px+)</li>
              <li>• Schnellerfassung: Weniger Felder</li>
              <li>• Mikrofon-Button: 48px rund</li>
              <li>• One-handed optimiert</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Vorlagen</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Erstkontakt</li>
              <li>• Angebot versendet</li>
              <li>• Follow-up Anruf</li>
              <li>• Meeting-Protokoll</li>
              <li>• Befüllt Betreff + Beschreibung</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Offline-Support</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Lokale Speicherung</li>
              <li>• Sync-Queue bei Offline</li>
              <li>• Amber-Indikator mit CloudOff</li>
              <li>• Auto-Sync wenn online</li>
              <li>• GoBD-konform</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}