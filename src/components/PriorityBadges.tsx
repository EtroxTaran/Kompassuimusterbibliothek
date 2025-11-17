import { AlertCircle, AlertTriangle, Circle } from 'lucide-react';
import { Badge } from './ui/badge';

export function PriorityBadges() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3">Prioritätsstufen</h4>
        <div className="flex flex-wrap gap-3">
          <Badge variant="destructive">
            <AlertCircle className="h-3.5 w-3.5" />
            Hoch
          </Badge>
          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
            <AlertTriangle className="h-3.5 w-3.5" />
            Mittel
          </Badge>
          <Badge variant="secondary">
            <Circle className="h-3.5 w-3.5" />
            Niedrig
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="mb-3">Outline-Variante</h4>
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="border-destructive text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />
            Hoch
          </Badge>
          <Badge variant="outline" className="border-chart-3 text-chart-3">
            <AlertTriangle className="h-3.5 w-3.5" />
            Mittel
          </Badge>
          <Badge variant="outline">
            <Circle className="h-3.5 w-3.5" />
            Niedrig
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="mb-3">Nur Symbol</h4>
        <div className="flex flex-wrap gap-3">
          <Badge
            variant="destructive"
            className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
            aria-label="Hohe Priorität"
          >
            <AlertCircle className="h-3.5 w-3.5" />
          </Badge>
          <Badge
            className="bg-chart-3/20 text-chart-3 border-chart-3/30 h-6 w-6 rounded-full p-0 flex items-center justify-center"
            aria-label="Mittlere Priorität"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
          </Badge>
          <Badge
            variant="secondary"
            className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
            aria-label="Niedrige Priorität"
          >
            <Circle className="h-3.5 w-3.5" />
          </Badge>
        </div>
      </div>
    </div>
  );
}
