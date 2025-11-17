import { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Info,
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Filter,
  Settings,
  Save,
  Trash2,
  Plus,
  Edit,
  ChevronRight,
  ChevronLeft,
  Loader2
} from 'lucide-react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

// Standard Form Dialog - Medium Size (600px default)
function EditCustomerDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Kunde bearbeiten
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Kunde bearbeiten</DialogTitle>
          <DialogDescription>
            Ändern Sie die Kundendaten. Klicken Sie auf Speichern, wenn Sie fertig sind.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="company">Firmenname *</Label>
            <Input id="company" defaultValue="Hofladen Müller GmbH" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vat">USt-IdNr.</Label>
            <Input id="vat" defaultValue="DE123456789" placeholder="DE123456789" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail *</Label>
              <Input id="email" type="email" defaultValue="info@hofladen-mueller.de" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" type="tel" defaultValue="+49 123 456789" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" defaultValue="Hauptstraße 123, 12345 Musterstadt" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button onClick={() => setOpen(false)}>
            <Save className="mr-2 h-4 w-4" />
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Small Dialog (400px)
function SendEmailDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Mail className="mr-2 h-4 w-4" />
          E-Mail senden
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>E-Mail senden</DialogTitle>
          <DialogDescription>
            Nachricht an Hofladen Müller GmbH
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Betreff</Label>
            <Input id="subject" placeholder="z.B. Angebotsnachfrage" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Nachricht</Label>
            <Textarea 
              id="message" 
              placeholder="Ihre Nachricht..." 
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Abbrechen</Button>
          <Button>Senden</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Large Dialog (800px) - Complex Form
function CreateProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Neues Projekt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Neues Projekt erstellen</DialogTitle>
          <DialogDescription>
            Erfassen Sie die wichtigsten Projektdaten. Weitere Details können später ergänzt werden.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="grid gap-6 py-4">
            <div className="grid gap-4">
              <h4>Projektinformationen</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-name">Projektname *</Label>
                  <Input id="project-name" placeholder="z.B. Umbau Bürogebäude" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-number">Projektnummer</Label>
                  <Input id="project-number" placeholder="PRJ-2024-001" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea id="description" placeholder="Projektbeschreibung..." rows={3} />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <h4>Kunde & Standort</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer">Kunde *</Label>
                  <Input id="customer" placeholder="Kundenname oder suchen..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Standort</Label>
                  <Input id="location" placeholder="Adresse oder Standort" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <h4>Zeitplanung</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Startdatum</Label>
                  <Input id="start-date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-date">Enddatum</Label>
                  <Input id="end-date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="budget">Budget (€)</Label>
                  <Input id="budget" type="number" placeholder="50000" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <h4>Team</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-manager">Projektleiter</Label>
                  <Input id="project-manager" placeholder="Name auswählen..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="team-members">Teammitglieder</Label>
                  <Input id="team-members" placeholder="Mehrere auswählen..." />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline">Abbrechen</Button>
          <Button>Projekt erstellen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Alert Dialog - Destructive Confirmation
function DeleteCustomerAlert() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Kunde löschen
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            Kunde löschen?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Sind Sie sicher, dass Sie <span className="font-medium text-foreground">"Hofladen Müller GmbH"</span> löschen möchten? 
            Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Success Confirmation Dialog
function SuccessDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Erfolg anzeigen
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-chart-2" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">
              Kunde erfolgreich gespeichert
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Die Kundendaten wurden erfolgreich aktualisiert und sind nun im System verfügbar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction onClick={() => setOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Warning Dialog - Unsaved Changes
function UnsavedChangesDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Warnung anzeigen</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-chart-3/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-chart-3" />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            Ungespeicherte Änderungen
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Sie haben ungespeicherte Änderungen. Möchten Sie die Änderungen speichern, bevor Sie fortfahren?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-2">
          <Button variant="ghost">
            Verwerfen
          </Button>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction>Speichern</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Filter Sheet (Right Side)
function FilterSheet() {
  const [statusFilters, setStatusFilters] = useState({
    active: true,
    inactive: false,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[480px]">
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
          <SheetDescription>
            Filtern Sie die Kundenliste nach Ihren Kriterien
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid gap-3">
            <Label>Status</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="active" 
                  checked={statusFilters.active}
                  onCheckedChange={(checked) => 
                    setStatusFilters({ ...statusFilters, active: checked as boolean })
                  }
                />
                <label htmlFor="active" className="cursor-pointer">
                  Aktiv
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="inactive"
                  checked={statusFilters.inactive}
                  onCheckedChange={(checked) => 
                    setStatusFilters({ ...statusFilters, inactive: checked as boolean })
                  }
                />
                <label htmlFor="inactive" className="cursor-pointer">
                  Inaktiv
                </label>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <Label>Zeitraum</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="from">Von</Label>
                <Input id="from" type="date" />
              </div>
              <div>
                <Label htmlFor="to">Bis</Label>
                <Input id="to" type="date" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <Label>Standort</Label>
            <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Alle Standorte</option>
              <option value="berlin">Berlin</option>
              <option value="munich">München</option>
              <option value="hamburg">Hamburg</option>
              <option value="cologne">Köln</option>
            </select>
          </div>

          <Separator />

          <div className="grid gap-3">
            <Label>Bewertung</Label>
            <RadioGroup defaultValue="all">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal">Alle</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="a" id="a" />
                <Label htmlFor="a" className="font-normal">A-Kunden</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="b" id="b" />
                <Label htmlFor="b" className="font-normal">B-Kunden</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="c" id="c" />
                <Label htmlFor="c" className="font-normal">C-Kunden</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <SheetFooter className="gap-2">
          <Button variant="ghost" className="w-full sm:w-auto">
            Filter zurücksetzen
          </Button>
          <Button className="w-full sm:w-auto">Anwenden</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Detail View Sheet
function CustomerDetailSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Details anzeigen
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle>Hofladen Müller GmbH</SheetTitle>
              <SheetDescription>Kundendetails und Aktivitäten</SheetDescription>
            </div>
            <Badge variant="secondary">Aktiv</Badge>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6 py-6">
            <div className="grid gap-3">
              <h4 className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Firmendaten
              </h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">USt-IdNr:</span>
                  <span>DE123456789</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kundennummer:</span>
                  <span>K-2024-0042</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bewertung:</span>
                  <Badge variant="secondary">A-Kunde</Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-3">
              <h4 className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Kontaktdaten
              </h4>
              <div className="grid gap-2 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>info@hofladen-mueller.de</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>+49 123 456789</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>Hauptstraße 123<br />12345 Musterstadt</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-3">
              <h4 className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Projekte
              </h4>
              <div className="space-y-2">
                {[
                  { name: 'Umbau Ladenlokal', status: 'In Bearbeitung', date: '15.11.2024' },
                  { name: 'Renovierung Lager', status: 'Abgeschlossen', date: '03.10.2024' },
                  { name: 'Neugestaltung Außenbereich', status: 'Geplant', date: '20.12.2024' },
                ].map((project, i) => (
                  <div key={i} className="border border-border rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{project.name}</span>
                      <Badge variant="secondary" className="text-xs">{project.status}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {project.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid gap-3">
              <h4>Aktivitäten</h4>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p>E-Mail gesendet: Angebotsnachfrage</p>
                    <p className="text-xs text-muted-foreground">Heute, 14:30 Uhr</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p>Telefonat: Projektstatus besprochen</p>
                    <p className="text-xs text-muted-foreground">Gestern, 11:15 Uhr</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p>Angebot erstellt: PRJ-2024-042</p>
                    <p className="text-xs text-muted-foreground">10.11.2024, 16:45 Uhr</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className="gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Edit className="mr-2 h-4 w-4" />
            Bearbeiten
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Multi-Step Dialog (Wizard)
function WizardDialog() {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else setOpen(false);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Projekt-Assistent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Neues Projekt erstellen</DialogTitle>
          <DialogDescription>
            Schritt {step} von 3
          </DialogDescription>
          <div className="flex gap-2 pt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        {step === 1 && (
          <div className="grid gap-4 py-4">
            <h4>Grunddaten</h4>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="wizard-project-name">Projektname *</Label>
                <Input id="wizard-project-name" placeholder="z.B. Umbau Bürogebäude" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="wizard-customer">Kunde *</Label>
                <Input id="wizard-customer" placeholder="Kunde auswählen..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="wizard-description">Beschreibung</Label>
                <Textarea id="wizard-description" placeholder="Kurzbeschreibung..." rows={3} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 py-4">
            <h4>Zeitplanung & Budget</h4>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="wizard-start">Startdatum</Label>
                  <Input id="wizard-start" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="wizard-end">Enddatum</Label>
                  <Input id="wizard-end" type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="wizard-budget">Budget (€)</Label>
                <Input id="wizard-budget" type="number" placeholder="50000" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="wizard-location">Standort</Label>
                <Input id="wizard-location" placeholder="Projektadresse" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 py-4">
            <h4>Zusammenfassung</h4>
            <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/20">
              <div className="grid gap-1">
                <span className="text-sm text-muted-foreground">Projektname</span>
                <span>Umbau Bürogebäude</span>
              </div>
              <Separator />
              <div className="grid gap-1">
                <span className="text-sm text-muted-foreground">Kunde</span>
                <span>Hofladen Müller GmbH</span>
              </div>
              <Separator />
              <div className="grid gap-1">
                <span className="text-sm text-muted-foreground">Zeitraum</span>
                <span>01.12.2024 - 31.03.2025</span>
              </div>
              <Separator />
              <div className="grid gap-1">
                <span className="text-sm text-muted-foreground">Budget</span>
                <span>50.000 €</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Überprüfen Sie die eingegebenen Daten und klicken Sie auf "Abschließen" um das Projekt zu erstellen.
            </p>
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
          <Button onClick={handleNext}>
            {step === 3 ? 'Abschließen' : 'Weiter'}
            {step < 3 && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Dialog with Tabs
function TabbedDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Kundendetails (Tabs)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Hofladen Müller GmbH</DialogTitle>
          <DialogDescription>
            Vollständige Kundenübersicht
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="locations">Standorte</TabsTrigger>
            <TabsTrigger value="contacts">Kontakte</TabsTrigger>
            <TabsTrigger value="activities">Aktivitäten</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label>USt-IdNr.</Label>
              <Input defaultValue="DE123456789" />
            </div>
            <div className="grid gap-2">
              <Label>Branche</Label>
              <Input defaultValue="Einzelhandel" />
            </div>
            <div className="grid gap-2">
              <Label>Notizen</Label>
              <Textarea rows={3} defaultValue="Langjähriger Kunde, bevorzugt nachhaltlige Lösungen" />
            </div>
          </TabsContent>

          <TabsContent value="locations" className="space-y-4 mt-4">
            <div className="space-y-3">
              {['Hauptsitz: Hauptstraße 123, 12345 Musterstadt', 'Filiale: Nebenstraße 45, 67890 Beispielstadt'].map((loc, i) => (
                <div key={i} className="border border-border rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{loc}</span>
                  </div>
                  <Button variant="ghost" size="sm">Bearbeiten</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Standort hinzufügen
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4 mt-4">
            <div className="space-y-3">
              {[
                { name: 'Anna Müller', role: 'Geschäftsführerin', email: 'a.mueller@hofladen.de', phone: '+49 123 456789' },
                { name: 'Thomas Schmidt', role: 'Einkaufsleiter', email: 't.schmidt@hofladen.de', phone: '+49 123 456790' },
              ].map((contact, i) => (
                <div key={i} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p>{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.role}</p>
                    </div>
                    <Button variant="ghost" size="sm">Bearbeiten</Button>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Kontakt hinzufügen
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4 mt-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {[
                  { type: 'email', title: 'Angebotsnachfrage', date: 'Heute, 14:30' },
                  { type: 'call', title: 'Projektstatus', date: 'Gestern, 11:15' },
                  { type: 'meeting', title: 'Vor-Ort-Termin', date: '10.11.2024' },
                  { type: 'email', title: 'Rechnung versendet', date: '08.11.2024' },
                ].map((activity, i) => (
                  <div key={i} className="border border-border rounded-lg p-3 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {activity.type === 'email' && <Mail className="h-4 w-4" />}
                      {activity.type === 'call' && <Phone className="h-4 w-4" />}
                      {activity.type === 'meeting' && <Calendar className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline">Schließen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Loading Dialog
function LoadingDialog() {
  const [loading, setLoading] = useState(false);

  const handleAction = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <>
      <Button variant="outline" onClick={handleAction}>
        Laden simulieren
      </Button>
      <Dialog open={loading} onOpenChange={setLoading}>
        <DialogContent className="sm:max-w-[300px]" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-center">Wird verarbeitet...</p>
            <p className="text-sm text-muted-foreground text-center">
              Bitte warten Sie einen Moment
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Info Dialog
function InfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Info className="mr-2 h-4 w-4" />
          Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Info className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">
            Über KOMPASS CRM
          </DialogTitle>
          <DialogDescription className="text-center">
            Version 2.5.0
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-center">
            KOMPASS ist Ihre professionelle CRM- und Projektmanagement-Lösung für die Bau- und Innenausbaubranche.
          </p>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lizenz:</span>
              <span>Professional</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gültig bis:</span>
              <span>31.12.2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nutzer:</span>
              <span>15 / 20</span>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button variant="outline">Schließen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DialogsModalsDemo() {
  return (
    <div className="space-y-8">
      {/* Standard Dialogs */}
      <div>
        <h4 className="mb-4">Standard-Dialoge (Formulare)</h4>
        <div className="flex flex-wrap gap-3">
          <EditCustomerDialog />
          <SendEmailDialog />
          <CreateProjectDialog />
        </div>
        <p className="text-muted-foreground mt-3">
          Verschiedene Größen: Small (400px), Medium (600px), Large (800px)
        </p>
      </div>

      <Separator />

      {/* Alert Dialogs */}
      <div>
        <h4 className="mb-4">Bestätigungsdialoge</h4>
        <div className="flex flex-wrap gap-3">
          <DeleteCustomerAlert />
          <SuccessDialog />
          <UnsavedChangesDialog />
          <InfoDialog />
        </div>
        <p className="text-muted-foreground mt-3">
          Destruktive Aktionen, Erfolgsbestätigungen, Warnungen und Informationen
        </p>
      </div>

      <Separator />

      {/* Sheets */}
      <div>
        <h4 className="mb-4">Sheets (Seitenpanels)</h4>
        <div className="flex flex-wrap gap-3">
          <FilterSheet />
          <CustomerDetailSheet />
        </div>
        <p className="text-muted-foreground mt-3">
          Slide-in-Panels von rechts für Filter und Detailansichten
        </p>
      </div>

      <Separator />

      {/* Complex Dialogs */}
      <div>
        <h4 className="mb-4">Komplexe Dialoge</h4>
        <div className="flex flex-wrap gap-3">
          <WizardDialog />
          <TabbedDialog />
          <LoadingDialog />
        </div>
        <p className="text-muted-foreground mt-3">
          Multi-Step-Wizards, Tab-Navigation und Ladezustände
        </p>
      </div>

      <Separator />

      {/* Examples in Context */}
      <div>
        <h4 className="mb-4">Dialoge im Kontext</h4>
        <div className="border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4>Kundenliste</h4>
              <p className="text-sm text-muted-foreground">Verwalten Sie Ihre Kunden</p>
            </div>
            <div className="flex gap-2">
              <FilterSheet />
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Neuer Kunde
              </Button>
            </div>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-2">
            {[
              { name: 'Hofladen Müller GmbH', type: 'A-Kunde', projects: 3 },
              { name: 'Bau AG Schmidt', type: 'B-Kunde', projects: 1 },
              { name: 'Zimmerei Weber', type: 'A-Kunde', projects: 5 },
            ].map((customer, i) => (
              <div key={i} className="border border-border rounded-lg p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p>{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.projects} Projekte</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{customer.type}</Badge>
                  <CustomerDetailSheet />
                  <EditCustomerDialog />
                  <DeleteCustomerAlert />
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Integration von Dialogen und Sheets in einer Kundenliste
        </p>
      </div>

      <Separator />

      {/* Design Patterns */}
      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Dialog-Größen</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Small (400px): Einfache Formulare</li>
              <li>• Medium (600px): Standard-Dialoge</li>
              <li>• Large (800px): Komplexe Formulare</li>
              <li>• XL (1000px): Datenvergleiche</li>
              <li>• Full-screen: Mobile Ansicht</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Verwendung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Dialog: Formulare, Dateneingabe</li>
              <li>• AlertDialog: Bestätigungen, Warnungen</li>
              <li>• Sheet: Filter, Detailansichten</li>
              <li>• Wizard: Multi-Step-Prozesse</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Tastatursteuerung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd> - Dialog schließen</li>
              <li>• <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Tab</kbd> - Navigation vorwärts</li>
              <li>• <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⇧Tab</kbd> - Navigation rückwärts</li>
              <li>• <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> - Aktion bestätigen</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Barrierefreiheit</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Focus Trap innerhalb Dialog</li>
              <li>• ARIA-Labels für Screen Reader</li>
              <li>• Keyboard-Navigation vollständig</li>
              <li>• WCAG 2.1 AA konform</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}