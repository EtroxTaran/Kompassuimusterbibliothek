import { Save, Plus, Download, Trash2, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export function ButtonVariants() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Primäre Buttons (Standard)</h4>
        <div className="flex flex-wrap gap-3">
          <Button>Speichern</Button>
          <Button>Kunde anlegen</Button>
          <Button>Weiter</Button>
          <Button>Übernehmen</Button>
          <Button>Bestätigen</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Für Hauptaktionen verwenden - blauer Hintergrund, weiße Schrift
        </p>
      </div>

      <div>
        <h4 className="mb-4">Sekundäre Buttons (Outlined)</h4>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">Abbrechen</Button>
          <Button variant="outline">Zurück</Button>
          <Button variant="outline">Filter anwenden</Button>
          <Button variant="outline">Exportieren</Button>
          <Button variant="outline">Schließen</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Für alternative Aktionen - transparenter Hintergrund mit Rahmen
        </p>
      </div>

      <div>
        <h4 className="mb-4">Tertiäre Buttons (Ghost)</h4>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost">Details anzeigen</Button>
          <Button variant="ghost">Mehr erfahren</Button>
          <Button variant="ghost">Abbrechen</Button>
          <Button variant="ghost">Bearbeiten</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Für weniger wichtige Aktionen - transparenter Hintergrund ohne Rahmen
        </p>
      </div>

      <div>
        <h4 className="mb-4">Sekundäre Buttons (Secondary)</h4>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Entwurf speichern</Button>
          <Button variant="secondary">Vorschau</Button>
          <Button variant="secondary">Importieren</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Alternative sekundäre Aktionen mit subtiler Hintergrundfarbe
        </p>
      </div>

      <div>
        <h4 className="mb-4">Destruktive Buttons</h4>
        <div className="flex flex-wrap gap-3">
          <Button variant="destructive">Löschen</Button>
          <Button variant="destructive">Stornieren</Button>
          <Button variant="destructive">Entfernen</Button>
          <Button variant="destructive">Ablehnen</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Für gefährliche Aktionen wie Löschen - roter Hintergrund
        </p>
      </div>

      <div>
        <h4 className="mb-4">Link-Buttons</h4>
        <div className="flex flex-wrap gap-4">
          <Button variant="link">Passwort vergessen?</Button>
          <Button variant="link">Zur Anmeldung</Button>
          <Button variant="link">Mehr Informationen</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Erscheint als Hyperlink - unterstrichen bei Hover
        </p>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-4">Vergleich aller Varianten</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button>Primär</Button>
          <Button variant="outline">Outlined</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="secondary">Sekundär</Button>
          <Button variant="destructive">Destruktiv</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
    </div>
  );
}
