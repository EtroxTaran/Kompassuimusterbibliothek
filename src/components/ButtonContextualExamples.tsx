import { Save, X, Trash2, Plus, Edit, Download, Upload, Filter, Search, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function ButtonContextualExamples() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Kundendetailseite - Header-Aktionen</h4>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="mb-2">Hofladen Müller GmbH</h2>
                <div className="flex gap-2">
                  <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                    Aktiv
                  </Badge>
                  <Badge variant="outline">Großkunde</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Edit className="h-4 w-4" />
                  Bearbeiten
                </Button>
                <Button>
                  <Plus className="h-4 w-4" />
                  Kontakt hinzufügen
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4" />
                E-Mail senden
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
                Anrufen
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4" />
                Termin planen
              </Button>
            </div>
          </div>
          <div className="p-6 bg-muted/30">
            <p className="text-muted-foreground">Kundeninformationen...</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Listenansicht - Kopfzeilen-Buttons</h4>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
                Filtern
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
                Suchen
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Exportieren
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                Neu anlegen
              </Button>
            </div>
          </div>
          <div className="p-4">
            <p className="text-muted-foreground">Listendaten...</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Formular - Fußzeilen-Buttons</h4>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="mb-4">Kunde bearbeiten</h3>
            <div className="space-y-4">
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
              <div>
                <label className="block mb-2">Telefon</label>
                <input 
                  type="tel" 
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  defaultValue="+49 89 1234567"
                />
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-border bg-muted/30 flex justify-between">
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
        <h4 className="mb-4">Dialog / Modal</h4>
        <div className="border border-border rounded-lg overflow-hidden max-w-md mx-auto">
          <div className="p-6">
            <h3 className="mb-2">Kunde löschen</h3>
            <p className="text-muted-foreground mb-4">
              Sind Sie sicher, dass Sie "Hofladen Müller GmbH" unwiderruflich löschen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="bg-muted/50 border border-border rounded-lg p-3 mb-4">
              <p className="mb-1">Folgende Daten werden ebenfalls gelöscht:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>3 Kontakte</li>
                <li>12 Projekte</li>
                <li>48 Rechnungen</li>
              </ul>
            </div>
          </div>
          <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-2">
            <Button variant="outline">
              <X className="h-4 w-4" />
              Abbrechen
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4" />
              Unwiderruflich löschen
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Import/Export-Dialog</h4>
        <div className="border border-border rounded-lg overflow-hidden max-w-lg mx-auto">
          <div className="p-6">
            <h3 className="mb-4">Daten exportieren</h3>
            <div className="space-y-3 mb-4">
              <div className="border border-border rounded-lg p-4 bg-background hover:bg-muted/30 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p>CSV-Export</p>
                    <p className="text-muted-foreground">Alle Kundendaten als CSV</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="border border-border rounded-lg p-4 bg-background hover:bg-muted/30 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p>Excel-Export</p>
                    <p className="text-muted-foreground">Formatierte Excel-Datei</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <h4 className="mb-3">Daten importieren</h4>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-3">
                  CSV- oder Excel-Datei hierher ziehen
                </p>
                <Button variant="outline">
                  <Upload className="h-4 w-4" />
                  Datei auswählen
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-border bg-muted/30 flex justify-end">
            <Button variant="outline">Schließen</Button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Mehrstufiges Formular - Navigation</h4>
        <div className="border border-border rounded-lg overflow-hidden max-w-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>Neuen Kunden anlegen</h3>
              <div className="flex gap-2">
                <div className="h-2 w-12 rounded-full bg-primary" />
                <div className="h-2 w-12 rounded-full bg-primary" />
                <div className="h-2 w-12 rounded-full bg-muted" />
                <div className="h-2 w-12 rounded-full bg-muted" />
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-4">Schritt 2: Kontaktinformationen</h4>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">E-Mail-Adresse</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    placeholder="info@beispiel.de"
                  />
                </div>
                <div>
                  <label className="block mb-2">Telefonnummer</label>
                  <input 
                    type="tel" 
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    placeholder="+49 89 1234567"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border bg-muted/30 flex justify-between">
            <Button variant="outline">
              Zurück
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                Als Entwurf speichern
              </Button>
              <Button>
                Weiter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Leere Zustandsansicht</h4>
        <div className="border border-border rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">Noch keine Kunden vorhanden</h3>
            <p className="text-muted-foreground mb-6">
              Legen Sie Ihren ersten Kunden an, um mit KOMPASS zu starten.
            </p>
            <div className="flex gap-2 justify-center">
              <Button>
                <Plus className="h-4 w-4" />
                Ersten Kunden anlegen
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4" />
                Kunden importieren
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
