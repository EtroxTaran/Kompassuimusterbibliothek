import { CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';
import { Badge } from './ui/badge';

export function StatusBadges() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3">Erfolg (Success)</h4>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Aktiv
          </Badge>
          <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Abgeschlossen
          </Badge>
          <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Bezahlt
          </Badge>
          <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Erfolgreich
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="mb-3">Warnung (Warning)</h4>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
            <AlertCircle className="h-3.5 w-3.5" />
            Ausstehend
          </Badge>
          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
            <AlertCircle className="h-3.5 w-3.5" />
            In Bearbeitung
          </Badge>
          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
            <AlertCircle className="h-3.5 w-3.5" />
            Überfällig
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="mb-3">Fehler (Error)</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="destructive">
            <XCircle className="h-3.5 w-3.5" />
            Inaktiv
          </Badge>
          <Badge variant="destructive">
            <XCircle className="h-3.5 w-3.5" />
            Fehlgeschlagen
          </Badge>
          <Badge variant="destructive">
            <XCircle className="h-3.5 w-3.5" />
            Storniert
          </Badge>
          <Badge variant="destructive">
            <XCircle className="h-3.5 w-3.5" />
            Abgelehnt
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="mb-3">Information (Info)</h4>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">
            <Info className="h-3.5 w-3.5" />
            Neu
          </Badge>
          <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">
            <Info className="h-3.5 w-3.5" />
            Info
          </Badge>
          <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">
            <Info className="h-3.5 w-3.5" />
            Entwurf
          </Badge>
        </div>
      </div>
    </div>
  );
}
