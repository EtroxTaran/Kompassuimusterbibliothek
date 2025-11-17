import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { useState } from 'react';

export function AlertBannerError() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <div className="text-center py-8">
        <Button onClick={() => setIsVisible(true)} variant="outline">
          Alert wieder anzeigen
        </Button>
      </div>
    );
  }

  return (
    <Alert variant="destructive" className="relative">
      <AlertCircle className="h-5 w-5" />
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-destructive-foreground hover:opacity-70"
        aria-label="Schließen"
      >
        <X className="h-4 w-4" />
      </button>
      <AlertTitle>Fehler beim Laden der Kundendaten</AlertTitle>
      <AlertDescription className="mt-2">
        Die Verbindung zum Server konnte nicht hergestellt werden. Bitte überprüfen Sie Ihre
        Internetverbindung und versuchen Sie es erneut.
      </AlertDescription>
      <div className="mt-4">
        <Button variant="outline" size="sm" className="border-destructive-foreground/20 hover:bg-destructive-foreground/10">
          Erneut versuchen
        </Button>
      </div>
    </Alert>
  );
}
