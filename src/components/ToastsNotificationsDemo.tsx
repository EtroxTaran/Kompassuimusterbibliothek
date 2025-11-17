import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  Cloud,
  Check,
  X,
  Upload,
  Download,
  Trash2,
  Save,
  RefreshCw,
} from 'lucide-react';

// Success Toast Examples
function SuccessToasts() {
  const showSimpleSuccess = () => {
    toast({
      title: 'Erfolgreich gespeichert',
      description: 'Der Kunde wurde erfolgreich angelegt.',
      duration: 5000,
    });
  };

  const showCustomerCreated = () => {
    toast({
      title: 'Kunde angelegt',
      description: 'Hofladen Müller GmbH wurde erfolgreich angelegt.',
      duration: 5000,
    });
  };

  const showChangesSaved = () => {
    toast({
      title: 'Änderungen gespeichert',
      description: 'Alle Änderungen wurden erfolgreich gespeichert.',
      duration: 5000,
    });
  };

  const showProjectCreated = () => {
    toast({
      title: 'Projekt erstellt',
      description: 'Das Projekt "REWE München Umbau" wurde erfolgreich erstellt.',
      duration: 5000,
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Erfolgs-Toasts</h4>

      <div className="flex flex-wrap gap-2">
        <Button onClick={showSimpleSuccess} variant="outline">
          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
          Einfacher Erfolg
        </Button>
        <Button onClick={showCustomerCreated} variant="outline">
          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
          Kunde angelegt
        </Button>
        <Button onClick={showChangesSaved} variant="outline">
          <Save className="mr-2 h-4 w-4 text-green-600" />
          Änderungen gespeichert
        </Button>
        <Button onClick={showProjectCreated} variant="outline">
          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
          Projekt erstellt
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Grüne Akzente, Checkmark-Icon, Auto-Dismiss nach 5 Sekunden
      </p>
    </div>
  );
}

// Error Toast Examples
function ErrorToasts() {
  const showSimpleError = () => {
    toast.error('Fehler', {
      description: 'Die Aktion ist fehlgeschlagen.',
      duration: 7000,
    });
  };

  const showSaveError = () => {
    toast.error('Speichern fehlgeschlagen', {
      description:
        'Die Kundendaten konnten nicht gespeichert werden. Bitte überprüfen Sie Ihre Internetverbindung.',
      duration: 7000,
    });
  };

  const showErrorWithRetry = () => {
    toast.error('Upload fehlgeschlagen', {
      description: 'Die Datei konnte nicht hochgeladen werden.',
      action: {
        label: 'Erneut versuchen',
        onClick: () => console.log('Retry clicked'),
      },
      duration: 7000,
    });
  };

  const showNetworkError = () => {
    toast.error('Keine Internetverbindung', {
      description: 'Bitte überprüfen Sie Ihre Netzwerkverbindung und versuchen Sie es erneut.',
      action: {
        label: 'Erneut versuchen',
        onClick: () => console.log('Retry clicked'),
      },
      duration: 7000,
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Fehler-Toasts</h4>

      <div className="flex flex-wrap gap-2">
        <Button onClick={showSimpleError} variant="outline">
          <AlertCircle className="mr-2 h-4 w-4 text-red-600" />
          Einfacher Fehler
        </Button>
        <Button onClick={showSaveError} variant="outline">
          <AlertCircle className="mr-2 h-4 w-4 text-red-600" />
          Speicherfehler
        </Button>
        <Button onClick={showErrorWithRetry} variant="outline">
          <Upload className="mr-2 h-4 w-4 text-red-600" />
          Mit Wiederholen
        </Button>
        <Button onClick={showNetworkError} variant="outline">
          <AlertCircle className="mr-2 h-4 w-4 text-red-600" />
          Netzwerkfehler
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Rote Akzente, Alert-Icon, optional "Erneut versuchen" Button, Auto-Dismiss nach 7 Sekunden
      </p>
    </div>
  );
}

// Warning Toast Examples
function WarningToasts() {
  const showUnsavedChanges = () => {
    toast.warning('Ungespeicherte Änderungen', {
      description:
        'Sie haben ungespeicherte Änderungen. Diese gehen verloren, wenn Sie die Seite verlassen.',
      action: {
        label: 'Verstanden',
        onClick: () => console.log('Understood'),
      },
      duration: 6000,
    });
  };

  const showDeleteWarning = () => {
    toast.warning('Achtung', {
      description: 'Diese Aktion kann nicht rückgängig gemacht werden.',
      action: {
        label: 'Verstanden',
        onClick: () => console.log('Understood'),
      },
      duration: 6000,
    });
  };

  const showStorageWarning = () => {
    toast.warning('Speicherplatz knapp', {
      description: 'Ihr Speicherkontingent ist zu 90% ausgelastet.',
      action: {
        label: 'Details anzeigen',
        onClick: () => console.log('Show details'),
      },
      duration: 6000,
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Warnungs-Toasts</h4>

      <div className="flex flex-wrap gap-2">
        <Button onClick={showUnsavedChanges} variant="outline">
          <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" />
          Ungespeicherte Änderungen
        </Button>
        <Button onClick={showDeleteWarning} variant="outline">
          <Trash2 className="mr-2 h-4 w-4 text-amber-600" />
          Löschwarnung
        </Button>
        <Button onClick={showStorageWarning} variant="outline">
          <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" />
          Speicherwarnung
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Amber-Akzente, Warning-Icon, "Verstanden" Button, Auto-Dismiss nach 6 Sekunden
      </p>
    </div>
  );
}

// Info Toast Examples
function InfoToasts() {
  const showUpdateAvailable = () => {
    toast.info('Update verfügbar', {
      description:
        'Eine neue Version von KOMPASS ist verfügbar. Bitte laden Sie die Seite neu, um die neueste Version zu verwenden.',
      action: {
        label: 'Neu laden',
        onClick: () => window.location.reload(),
      },
      duration: 10000,
    });
  };

  const showTipOfTheDay = () => {
    toast.info('Tipp des Tages', {
      description:
        'Sie können Kunden per Drag & Drop neu anordnen, um Ihre bevorzugte Reihenfolge zu speichern.',
      duration: 10000,
    });
  };

  const showMaintenanceNotice = () => {
    toast.info('Wartungsarbeiten geplant', {
      description: 'Am Sonntag, 15.12.2024 von 02:00-04:00 Uhr finden Wartungsarbeiten statt.',
      action: {
        label: 'Details',
        onClick: () => console.log('Show details'),
      },
      duration: 10000,
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Info-Toasts</h4>

      <div className="flex flex-wrap gap-2">
        <Button onClick={showUpdateAvailable} variant="outline">
          <Info className="mr-2 h-4 w-4 text-primary" />
          Update verfügbar
        </Button>
        <Button onClick={showTipOfTheDay} variant="outline">
          <Info className="mr-2 h-4 w-4 text-primary" />
          Tipp des Tages
        </Button>
        <Button onClick={showMaintenanceNotice} variant="outline">
          <Info className="mr-2 h-4 w-4 text-primary" />
          Wartungshinweis
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Blaue Akzente, Info-Icon, optionale Aktionen, Auto-Dismiss nach 10 Sekunden
      </p>
    </div>
  );
}

// Progress Toast Example
function ProgressToast() {
  const [isProcessing, setIsProcessing] = useState(false);

  const startProcess = () => {
    setIsProcessing(true);

    // Show initial progress toast
    const { dismiss } = toast({
      title: 'Wird verarbeitet...',
      description: 'Bitte warten Sie',
      duration: Infinity, // Don't auto-dismiss
    });

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;

      if (progress >= 100) {
        clearInterval(interval);
        dismiss();
        setIsProcessing(false);

        // Show success toast
        toast({
          title: 'Erfolgreich abgeschlossen',
          description: 'Die Verarbeitung wurde erfolgreich abgeschlossen.',
          duration: 5000,
        });
      }
    }, 500);
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Fortschritts-Toast</h4>

      <Button onClick={startProcess} disabled={isProcessing}>
        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Verarbeitung starten
      </Button>

      <p className="text-sm text-muted-foreground">
        Spinner-Icon, keine Auto-Dismiss, wird zu Erfolgs-/Fehler-Toast aktualisiert
      </p>
    </div>
  );
}

// Sync Status Toast Example
function SyncStatusToast() {
  const [isSyncing, setIsSyncing] = useState(false);

  const startSync = () => {
    setIsSyncing(true);

    const { dismiss } = toast({
      title: 'Synchronisierung läuft...',
      description: '5 Änderungen werden synchronisiert',
      duration: Infinity,
    });

    // Simulate sync
    setTimeout(() => {
      dismiss();
      setIsSyncing(false);

      toast({
        title: 'Erfolgreich synchronisiert',
        description: 'Alle Änderungen wurden synchronisiert.',
        duration: 3000,
      });
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Synchronisierungs-Toast</h4>

      <Button onClick={startSync} disabled={isSyncing} variant="outline">
        <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        Synchronisierung starten
      </Button>

      <p className="text-sm text-muted-foreground">
        Animiertes Sync-Icon, aktualisiert Status, Auto-Dismiss nach Abschluss
      </p>
    </div>
  );
}

// Multiple Toasts (Stacking)
function ToastStacking() {
  const showMultipleToasts = () => {
    toast({
      title: 'Erste Benachrichtigung',
      description: 'Dies ist die erste Toast-Nachricht.',
      duration: 5000,
    });

    setTimeout(() => {
      toast({
        title: 'Zweite Benachrichtigung',
        description: 'Dies ist die zweite Toast-Nachricht.',
        duration: 5000,
      });
    }, 500);

    setTimeout(() => {
      toast({
        title: 'Dritte Benachrichtigung',
        description: 'Dies ist die dritte Toast-Nachricht.',
        duration: 5000,
      });
    }, 1000);

    setTimeout(() => {
      toast({
        title: 'Vierte Benachrichtigung',
        description: 'Ältere Toasts werden automatisch geschlossen.',
        duration: 5000,
      });
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Toast-Stapel</h4>

      <Button onClick={showMultipleToasts} variant="outline">
        Mehrere Toasts anzeigen
      </Button>

      <p className="text-sm text-muted-foreground">
        Maximal 3 sichtbare Toasts, älteste werden automatisch geschlossen
      </p>
    </div>
  );
}

// Rich Content Toast
function RichContentToast() {
  const showImportResults = () => {
    toast({
      title: 'Import abgeschlossen',
      description: (
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm">3 Kunden erfolgreich importiert</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-red-600" />
            <span className="text-sm">2 Fehler aufgetreten</span>
          </div>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={() => console.log('Show details')}
          >
            Details anzeigen
          </Button>
        </div>
      ),
      duration: 8000,
    });
  };

  const showBulkActions = () => {
    toast({
      title: 'Aktion abgeschlossen',
      description: (
        <div className="mt-2 space-y-2">
          <p className="text-sm">5 Kunden wurden aktualisiert:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Status auf "Aktiv" gesetzt</li>
            <li>E-Mail-Benachrichtigungen aktiviert</li>
            <li>Zahlungsziel auf 30 Tage geändert</li>
          </ul>
        </div>
      ),
      duration: 8000,
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Toast mit umfangreichem Inhalt</h4>

      <div className="flex flex-wrap gap-2">
        <Button onClick={showImportResults} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Import-Ergebnisse
        </Button>
        <Button onClick={showBulkActions} variant="outline">
          <Check className="mr-2 h-4 w-4" />
          Bulk-Aktionen
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Mehrere Textzeilen, Listen, Links und Buttons in Toast-Inhalt
      </p>
    </div>
  );
}

// Visual Toast Examples (Static Display)
function VisualToastExamples() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Toast-Varianten (Visuelle Darstellung)</h4>

      <div className="space-y-3">
        {/* Success Toast */}
        <div className="w-full max-w-md border border-border rounded-lg shadow-lg bg-background p-4 border-l-4 border-l-green-600">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">Erfolgreich gespeichert</p>
              <p className="text-sm text-muted-foreground mt-1">
                Der Kunde wurde erfolgreich angelegt.
              </p>
            </div>
            <button className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Error Toast */}
        <div className="w-full max-w-md border border-border rounded-lg shadow-lg bg-background p-4 border-l-4 border-l-red-600">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">Fehler</p>
              <p className="text-sm text-muted-foreground mt-1">
                Die Kundendaten konnten nicht gespeichert werden.
              </p>
              <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-red-600">
                Erneut versuchen
              </Button>
            </div>
            <button className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Warning Toast */}
        <div className="w-full max-w-md border border-border rounded-lg shadow-lg bg-background p-4 border-l-4 border-l-amber-600">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">Achtung</p>
              <p className="text-sm text-muted-foreground mt-1">
                Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-amber-600">
                Verstanden
              </Button>
            </div>
            <button className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Info Toast */}
        <div className="w-full max-w-md border border-border rounded-lg shadow-lg bg-background p-4 border-l-4 border-l-primary">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">Information</p>
              <p className="text-sm text-muted-foreground mt-1">
                Eine neue Version ist verfügbar. Bitte laden Sie die Seite neu.
              </p>
              <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-primary">
                Neu laden
              </Button>
            </div>
            <button className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress Toast */}
        <div className="w-full max-w-md border border-border rounded-lg shadow-lg bg-background p-4 border-l-4 border-l-primary">
          <div className="flex items-start gap-3">
            <Loader2 className="h-6 w-6 text-primary shrink-0 mt-0.5 animate-spin" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">Wird verarbeitet...</p>
              <p className="text-sm text-muted-foreground mt-1">Bitte warten Sie</p>
              <Progress value={60} className="mt-2 h-1" />
            </div>
          </div>
        </div>

        {/* Sync Toast */}
        <div className="w-full max-w-md border border-border rounded-lg shadow-lg bg-background p-4 border-l-4 border-l-primary">
          <div className="flex items-start gap-3">
            <RefreshCw className="h-6 w-6 text-primary shrink-0 mt-0.5 animate-spin" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">Synchronisierung</p>
              <p className="text-sm text-muted-foreground mt-1">
                3 Änderungen werden synchronisiert...
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Statische Darstellung aller Toast-Varianten mit visuellen Details
      </p>
    </div>
  );
}

export function ToastsNotificationsDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Erfolgs-Toasts</CardTitle>
          <CardDescription>
            Grüne Akzente mit Checkmark, Auto-Dismiss nach 5 Sekunden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SuccessToasts />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fehler-Toasts</CardTitle>
          <CardDescription>
            Rote Akzente mit Alert-Icon, optional mit Wiederholen-Button, Auto-Dismiss nach 7 Sekunden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorToasts />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Warnungs-Toasts</CardTitle>
          <CardDescription>
            Amber-Akzente mit Warning-Icon, Auto-Dismiss nach 6 Sekunden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WarningToasts />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Info-Toasts</CardTitle>
          <CardDescription>
            Blaue Akzente mit Info-Icon, längere Auto-Dismiss Zeit (10 Sekunden)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InfoToasts />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Fortschritts-Toast</CardTitle>
          <CardDescription>
            Spinner-Icon, keine Auto-Dismiss, wird zu Erfolg/Fehler aktualisiert
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressToast />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Synchronisierungs-Toast</CardTitle>
          <CardDescription>
            Animiertes CloudSync-Icon, automatische Statusaktualisierung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SyncStatusToast />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Toast-Stapel</CardTitle>
          <CardDescription>
            Maximal 3 sichtbare Toasts, älteste werden automatisch geschlossen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ToastStacking />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Toast mit umfangreichem Inhalt</CardTitle>
          <CardDescription>
            Listen, mehrere Zeilen, Links und Buttons in Toast-Inhalt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichContentToast />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Visuelle Toast-Beispiele</CardTitle>
          <CardDescription>
            Statische Darstellung aller Toast-Varianten mit Design-Details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VisualToastExamples />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Toast-Struktur</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Breite: 360px (Desktop)</li>
              <li>• Border-Radius: 8px</li>
              <li>• Schatten: 0px 4px 12px</li>
              <li>• Padding: 16px</li>
              <li>• Linker Rahmen: 4px farbig</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Auto-Dismiss Zeiten</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Erfolg: 5 Sekunden</li>
              <li>• Warnung: 6 Sekunden</li>
              <li>• Fehler: 7 Sekunden</li>
              <li>• Info: 10 Sekunden</li>
              <li>• Fortschritt: Keine</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Icons</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Erfolg: CheckCircle (grün)</li>
              <li>• Fehler: AlertCircle (rot)</li>
              <li>• Warnung: AlertTriangle (amber)</li>
              <li>• Info: Info (blau)</li>
              <li>• Größe: 24px</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Typografie</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Titel: 16px, semibold</li>
              <li>• Beschreibung: 14px, regular</li>
              <li>• Farbe: foreground/muted</li>
              <li>• Zeilenabstand: normal</li>
              <li>• Inter Schriftart</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Positionierung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>��� Desktop: Oben rechts</li>
              <li>• Mobile: Oben zentriert</li>
              <li>• Stapel: Vertikal, 8px Abstand</li>
              <li>• Max: 3 sichtbare Toasts</li>
              <li>• Animation: 300ms slide-in</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Barrierefreiheit</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• role="status" oder "alert"</li>
              <li>• aria-live Regionen</li>
              <li>• Farbe nicht alleiniges Signal</li>
              <li>• Tastatur-zugänglich</li>
              <li>• Ausreichender Kontrast</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}