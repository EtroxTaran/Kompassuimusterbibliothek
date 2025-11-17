import { useState } from 'react';
import { Save, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

export function ButtonStates() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAsyncAction = () => {
    setIsLoading(true);
    setIsSuccess(false);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Standard-Zustand</h4>
        <div className="flex flex-wrap gap-3">
          <Button>Speichern</Button>
          <Button variant="outline">Abbrechen</Button>
          <Button variant="destructive">Löschen</Button>
          <Button variant="ghost">Details</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Ruhezustand - bereit für Interaktion
        </p>
      </div>

      <div>
        <h4 className="mb-4">Hover-Zustand</h4>
        <div className="flex flex-wrap gap-3">
          <Button className="hover:bg-primary/90">Maus über Button</Button>
          <Button variant="outline" className="hover:bg-accent">Hover Outlined</Button>
          <Button variant="ghost" className="hover:bg-accent">Hover Ghost</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Hintergrundfarbe ändert sich beim Überfahren mit der Maus
        </p>
      </div>

      <div>
        <h4 className="mb-4">Fokus-Zustand</h4>
        <div className="flex flex-wrap gap-3">
          <Button>Tab-Navigation</Button>
          <Button variant="outline">Tastatur-Fokus</Button>
          <Button variant="destructive">Fokus sichtbar</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          2px Ring erscheint bei Tastatur-Navigation (drücken Sie Tab)
        </p>
      </div>

      <div>
        <h4 className="mb-4">Deaktiviert-Zustand</h4>
        <div className="flex flex-wrap gap-3">
          <Button disabled>Speichern</Button>
          <Button disabled variant="outline">Abbrechen</Button>
          <Button disabled variant="destructive">Löschen</Button>
          <Button disabled variant="ghost">Details</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Verblasste Erscheinung, nicht klickbar, cursor: not-allowed
        </p>
      </div>

      <div>
        <h4 className="mb-4">Ladezustand (Loading)</h4>
        <div className="flex flex-wrap gap-3">
          <Button disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
            Wird gespeichert...
          </Button>
          <Button disabled variant="outline">
            <Loader2 className="h-4 w-4 animate-spin" />
            Wird geladen...
          </Button>
          <Button disabled variant="destructive">
            <Loader2 className="h-4 w-4 animate-spin" />
            Wird gelöscht...
          </Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Spinner + geänderter Text, Button deaktiviert während des Vorgangs
        </p>
      </div>

      <div>
        <h4 className="mb-4">Interaktive Loading-Demo</h4>
        <div className="flex flex-wrap gap-3 items-center">
          <Button 
            onClick={handleAsyncAction}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Wird gespeichert...
              </>
            ) : isSuccess ? (
              <>
                <Check className="h-4 w-4 text-chart-2" />
                Gespeichert!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Speichern
              </>
            )}
          </Button>
          {isSuccess && (
            <span className="text-chart-2">Erfolgreich gespeichert!</span>
          )}
        </div>
        <p className="text-muted-foreground mt-3">
          Klicken Sie auf den Button um den Ladezustand und Erfolg zu sehen
        </p>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-4">Verschiedene Ladezustände</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-muted-foreground">Primäre Aktionen:</p>
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 animate-spin" />
              Wird gespeichert...
            </Button>
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 animate-spin" />
              Wird erstellt...
            </Button>
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 animate-spin" />
              Wird aktualisiert...
            </Button>
          </div>
          <div className="space-y-3">
            <p className="text-muted-foreground">Sekundäre Aktionen:</p>
            <Button disabled variant="outline" className="w-full">
              <Loader2 className="h-4 w-4 animate-spin" />
              Wird exportiert...
            </Button>
            <Button disabled variant="outline" className="w-full">
              <Loader2 className="h-4 w-4 animate-spin" />
              Wird importiert...
            </Button>
            <Button disabled variant="destructive" className="w-full">
              <Loader2 className="h-4 w-4 animate-spin" />
              Wird gelöscht...
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-4">Zustandsübergänge</h4>
        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4 bg-background">
            <p className="mb-3">1. Ruhezustand → Hover → Aktiv → Ruhezustand</p>
            <Button>Normale Interaktion</Button>
          </div>
          
          <div className="border border-border rounded-lg p-4 bg-background">
            <p className="mb-3">2. Ruhezustand → Ladezustand → Erfolgszustand → Ruhezustand</p>
            <div className="flex gap-3">
              <Button disabled>
                <Save className="h-4 w-4" />
                Speichern
              </Button>
              <span>→</span>
              <Button disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
                Wird gespeichert...
              </Button>
              <span>→</span>
              <Button disabled>
                <Check className="h-4 w-4" />
                Gespeichert
              </Button>
            </div>
          </div>

          <div className="border border-border rounded-lg p-4 bg-background">
            <p className="mb-3">3. Ruhezustand → Deaktiviert (z.B. ungültige Formulareingabe)</p>
            <div className="flex gap-3">
              <Button>Aktiviert</Button>
              <span>→</span>
              <Button disabled>Deaktiviert</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
