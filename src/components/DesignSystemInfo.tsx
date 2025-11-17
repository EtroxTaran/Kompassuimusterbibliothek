import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function DesignSystemInfo() {
  return (
    <Alert className="bg-primary/5 border-primary/20">
      <Info className="h-5 w-5 text-primary" />
      <AlertTitle>Design System Integration</AlertTitle>
      <AlertDescription className="space-y-2 mt-2">
        <p>
          Alle Komponenten verwenden ausschließlich die Design-Tokens aus <code className="bg-muted px-1 py-0.5 rounded text-foreground">/styles/globals.css</code>:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
          <li><strong>Farben:</strong> bg-primary, text-destructive, bg-chart-3, etc.</li>
          <li><strong>Typografie:</strong> Inter-Schriftart mit semantischen HTML-Elementen (h1-h4, p, label)</li>
          <li><strong>Abstände:</strong> Keine benutzerdefinierten Tailwind-Klassen für Schriftgröße/Gewicht</li>
          <li><strong>Radius:</strong> --radius-button, --radius-card, --radius-input, --radius-checkbox</li>
          <li><strong>Schatten:</strong> --elevation-sm für Karten und Modals</li>
        </ul>
        <p className="text-muted-foreground mt-3">
          Aktualisieren Sie die CSS-Variablen, um das Design systemweit zu ändern.
        </p>
      </AlertDescription>
    </Alert>
  );
}
