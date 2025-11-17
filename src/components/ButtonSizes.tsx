import { Save, Download, Plus } from 'lucide-react';
import { Button } from './ui/button';

export function ButtonSizes() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Klein (Small)</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Speichern</Button>
          <Button size="sm" variant="outline">Abbrechen</Button>
          <Button size="sm" variant="destructive">Löschen</Button>
          <Button size="sm">
            <Save className="h-3 w-3 mr-1.5" />
            Mit Symbol
          </Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Höhe: 32px | Verwendung: Tabellenaktionen, kompakte Layouts, sekundäre Aktionen
        </p>
      </div>

      <div>
        <h4 className="mb-4">Standard (Default)</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Speichern</Button>
          <Button variant="outline">Abbrechen</Button>
          <Button variant="destructive">Löschen</Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Mit Symbol
          </Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Höhe: 40px | Verwendung: Die meisten Buttons in der Anwendung
        </p>
      </div>

      <div>
        <h4 className="mb-4">Groß (Large)</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg">Speichern</Button>
          <Button size="lg" variant="outline">Abbrechen</Button>
          <Button size="lg" variant="destructive">Löschen</Button>
          <Button size="lg">
            <Save className="h-5 w-5 mr-2" />
            Mit Symbol
          </Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Höhe: 48px | Verwendung: Primäre CTAs, mobile Hauptaktionen, Formularabschlüsse
        </p>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-4">Größenvergleich - Primär</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Klein</Button>
          <Button>Standard</Button>
          <Button size="lg">Groß</Button>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Größenvergleich - Outlined</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" variant="outline">Klein</Button>
          <Button variant="outline">Standard</Button>
          <Button size="lg" variant="outline">Groß</Button>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Größenvergleich - Ghost</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" variant="ghost">Klein</Button>
          <Button variant="ghost">Standard</Button>
          <Button size="lg" variant="ghost">Groß</Button>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-4">Mit Icons in verschiedenen Größen</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground w-20">Klein:</span>
            <Button size="sm">
              <Plus className="h-3 w-3" />
              Neu
            </Button>
            <Button size="sm">
              <Download className="h-3 w-3" />
              Export
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground w-20">Standard:</span>
            <Button>
              <Plus className="h-4 w-4" />
              Neu anlegen
            </Button>
            <Button>
              <Download className="h-4 w-4" />
              Exportieren
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground w-20">Groß:</span>
            <Button size="lg">
              <Plus className="h-5 w-5" />
              Neu anlegen
            </Button>
            <Button size="lg">
              <Download className="h-5 w-5" />
              Exportieren
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
