import { CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/badge';

export function BadgeSizes() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3">Klein (Small)</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="h-5 px-2 text-[11px] bg-chart-2/20 text-chart-2 border-chart-2/30">
            <CheckCircle2 className="h-3 w-3" />
            Aktiv
          </Badge>
          <Badge className="h-5 px-2 text-[11px] bg-chart-3/20 text-chart-3 border-chart-3/30">
            Ausstehend
          </Badge>
          <Badge variant="destructive" className="h-5 px-2 text-[11px]">
            Inaktiv
          </Badge>
          <Badge variant="outline" className="h-5 px-2 text-[11px]">
            Tag
          </Badge>
        </div>
        <p className="text-muted-foreground mt-2">
          Höhe: 20px | Schriftgröße: 11px | Verwendung: Kompakte Layouts, Tabellenzellen
        </p>
      </div>

      <div>
        <h4 className="mb-3">Standard (Default)</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Aktiv
          </Badge>
          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
            Ausstehend
          </Badge>
          <Badge variant="destructive">
            Inaktiv
          </Badge>
          <Badge variant="outline">
            Tag
          </Badge>
        </div>
        <p className="text-muted-foreground mt-2">
          Höhe: 24px | Schriftgröße: 12px | Verwendung: Meiste Kontexte
        </p>
      </div>

      <div>
        <h4 className="mb-3">Groß (Large)</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="h-7 px-3 bg-chart-2/20 text-chart-2 border-chart-2/30">
            <CheckCircle2 className="h-4 w-4" />
            Aktiv
          </Badge>
          <Badge className="h-7 px-3 bg-chart-3/20 text-chart-3 border-chart-3/30">
            Ausstehend
          </Badge>
          <Badge variant="destructive" className="h-7 px-3">
            Inaktiv
          </Badge>
          <Badge variant="outline" className="h-7 px-3">
            Tag
          </Badge>
        </div>
        <p className="text-muted-foreground mt-2">
          Höhe: 28px | Schriftgröße: 13px | Verwendung: Prominente Statusanzeigen
        </p>
      </div>

      <div>
        <h4 className="mb-3">Größenvergleich</h4>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col items-center gap-2">
            <Badge className="h-5 px-2 text-[11px] bg-primary/10 text-primary border-primary/20">
              Klein
            </Badge>
            <span className="text-muted-foreground">20px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Standard
            </Badge>
            <span className="text-muted-foreground">24px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Badge className="h-7 px-3 bg-primary/10 text-primary border-primary/20">
              Groß
            </Badge>
            <span className="text-muted-foreground">28px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
