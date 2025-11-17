import { Save, X, ArrowLeft, ArrowRight, Copy, Trash2, Download, Upload, Filter, Search, Plus } from 'lucide-react';
import { Button } from './ui/button';

export function ButtonGroups() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Primär + Sekundär (Formularaktionen)</h4>
        <div className="flex gap-2">
          <Button variant="outline">Abbrechen</Button>
          <Button>Speichern</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Standard-Formularlayout - Primäre Aktion rechts
        </p>
      </div>

      <div>
        <h4 className="mb-4">Drei-Button-Gruppe</h4>
        <div className="flex gap-2">
          <Button variant="outline">Abbrechen</Button>
          <Button variant="secondary">Entwurf speichern</Button>
          <Button>Veröffentlichen</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Mehrere Optionen - klare Hierarchie von links nach rechts
        </p>
      </div>

      <div>
        <h4 className="mb-4">Zurück / Weiter Navigation</h4>
        <div className="flex gap-2">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
          <Button>
            Weiter
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Schrittweise Navigation - z.B. mehrstufige Formulare
        </p>
      </div>

      <div>
        <h4 className="mb-4">Destruktive Aktion mit Bestätigung</h4>
        <div className="flex gap-2">
          <Button variant="outline">
            <X className="h-4 w-4" />
            Abbrechen
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4" />
            Unwiderruflich löschen
          </Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Wichtige Warnung vor gefährlichen Aktionen
        </p>
      </div>

      <div>
        <h4 className="mb-4">Rechts ausgerichtete Button-Gruppe</h4>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Abbrechen</Button>
          <Button>Änderungen speichern</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Typisches Layout für Formularfußzeilen
        </p>
      </div>

      <div>
        <h4 className="mb-4">Zentrierte Button-Gruppe</h4>
        <div className="flex justify-center gap-2">
          <Button variant="outline">Nein, abbrechen</Button>
          <Button>Ja, fortfahren</Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Für Dialoge und Bestätigungsmodals
        </p>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-4">Icon-Button-Gruppe (Toolbar)</h4>
        <div className="flex gap-1 border border-border rounded-lg p-2 inline-flex">
          <Button size="icon" variant="ghost" title="Kopieren">
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" title="Download">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" title="Upload">
            <Upload className="h-4 w-4" />
          </Button>
          <div className="w-px bg-border mx-1" />
          <Button size="icon" variant="ghost" title="Löschen">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Kompakte Werkzeugleiste mit Trennlinie
        </p>
      </div>

      <div>
        <h4 className="mb-4">Segmentierte Button-Gruppe</h4>
        <div className="inline-flex rounded-lg border border-border">
          <Button variant="ghost" className="rounded-r-none border-r">
            Heute
          </Button>
          <Button variant="ghost" className="rounded-none border-r">
            Diese Woche
          </Button>
          <Button variant="ghost" className="rounded-none border-r">
            Dieser Monat
          </Button>
          <Button variant="ghost" className="rounded-l-none">
            Dieses Jahr
          </Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Zusammenhängende Button-Gruppe für Filter oder Ansichtswechsel
        </p>
      </div>

      <div>
        <h4 className="mb-4">Button-Gruppe mit Trennlinien</h4>
        <div className="flex gap-3 items-center">
          <Button>
            <Plus className="h-4 w-4" />
            Neu anlegen
          </Button>
          <div className="h-6 w-px bg-border" />
          <Button variant="outline">
            <Filter className="h-4 w-4" />
            Filtern
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4" />
            Suchen
          </Button>
          <div className="h-6 w-px bg-border" />
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Exportieren
          </Button>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-4">Vollbreite Button-Gruppe (Mobile)</h4>
        <div className="max-w-sm border border-border rounded-lg p-4 bg-background">
          <div className="space-y-3">
            <Button className="w-full">
              <Save className="h-4 w-4" />
              Kunde speichern
            </Button>
            <Button variant="outline" className="w-full">
              <X className="h-4 w-4" />
              Abbrechen
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Gestapelte Buttons für mobile Formulare
        </p>
      </div>

      <div>
        <h4 className="mb-4">Split Button-Gruppe</h4>
        <div className="flex gap-2">
          <Button className="w-full justify-start">
            <Save className="h-4 w-4" />
            Speichern und schließen
          </Button>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="outline">
              Entwurf
            </Button>
            <Button variant="outline">
              Vorschau
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-4">Anwendungsbeispiel: Kundenformular</h4>
        <div className="border border-border rounded-lg p-6 bg-background max-w-2xl">
          <h3 className="mb-4">Kunde bearbeiten</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block mb-2">Firmenname</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                defaultValue="Hofladen Müller GmbH"
              />
            </div>
            <div>
              <label className="block mb-2">E-Mail</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                defaultValue="info@hofladen-mueller.de"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="destructive" size="sm">
              <Trash2 className="h-3 w-3" />
              Kunde löschen
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">Abbrechen</Button>
              <Button>
                <Save className="h-4 w-4" />
                Änderungen speichern
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Anwendungsbeispiel: Dialog-Fußzeile</h4>
        <div className="border border-border rounded-lg overflow-hidden max-w-md">
          <div className="p-6">
            <h3 className="mb-2">Änderungen verwerfen?</h3>
            <p className="text-muted-foreground">
              Sie haben ungespeicherte Änderungen. Möchten Sie diese wirklich verwerfen?
            </p>
          </div>
          <div className="border-t border-border p-4 bg-muted/30 flex justify-end gap-2">
            <Button variant="outline">Abbrechen</Button>
            <Button variant="destructive">Änderungen verwerfen</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
