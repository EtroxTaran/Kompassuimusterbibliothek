import { 
  Save, 
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  Pencil, 
  Eye, 
  Search,
  Filter,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Mail,
  Phone,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';

export function ButtonWithIcons() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Symbol links vom Text</h4>
        <div className="flex flex-wrap gap-3">
          <Button>
            <Save className="h-4 w-4" />
            Speichern
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Neu anlegen
          </Button>
          <Button>
            <Download className="h-4 w-4" />
            Exportieren
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4" />
            Importieren
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4" />
            Filter anwenden
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4" />
            Löschen
          </Button>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Symbol rechts vom Text</h4>
        <div className="flex flex-wrap gap-3">
          <Button>
            Weiter
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            Zurück
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button>
            Details anzeigen
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Nur Symbol (Icon-Only)</h4>
        <div className="flex flex-wrap gap-3">
          <Button size="icon" variant="outline" title="Bearbeiten">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" title="Anzeigen">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" title="Löschen">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" title="Aktualisieren">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="icon" title="Einstellungen">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-muted-foreground mt-3">
          Quadratische Buttons (40x40px) - Tooltip erforderlich für Barrierefreiheit
        </p>
      </div>

      <div>
        <h4 className="mb-4">Icon-Only in verschiedenen Größen</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="icon" variant="outline" className="h-8 w-8" title="Klein">
            <Pencil className="h-3 w-3" />
          </Button>
          <Button size="icon" variant="outline" title="Standard">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="h-12 w-12" title="Groß">
            <Pencil className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Häufige Aktionen mit Symbolen</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button variant="outline">
            <Save className="h-4 w-4" />
            Speichern
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4" />
            Hinzufügen
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4" />
            Suchen
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4" />
            Aktualisieren
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4" />
            E-Mail senden
          </Button>
          <Button variant="outline">
            <Phone className="h-4 w-4" />
            Anrufen
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4" />
            Termin planen
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4" />
            Dokument
          </Button>
          <Button variant="outline">
            <Check className="h-4 w-4" />
            Bestätigen
          </Button>
          <Button variant="outline">
            <X className="h-4 w-4" />
            Abbrechen
          </Button>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="mb-4">Tabellenaktionen (Icon-Only Gruppe)</h4>
        <div className="border border-border rounded-lg p-4 bg-background">
          <div className="flex items-center justify-between mb-3">
            <span>Hofladen Müller GmbH</span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" title="Anzeigen">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" title="Bearbeiten">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" title="Löschen">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span>Weingut Fischer</span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" title="Anzeigen">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" title="Bearbeiten">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" title="Löschen">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Café am Markt GmbH</span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" title="Anzeigen">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" title="Bearbeiten">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" title="Löschen">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
