import { Crown, Briefcase, Users, Calculator, Receipt } from 'lucide-react';
import { Badge } from './ui/badge';

export function RoleBadges() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3">Benutzerrollen</h4>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Crown className="h-3.5 w-3.5" />
            GF
          </Badge>
          <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">
            <Briefcase className="h-3.5 w-3.5" />
            PLAN
          </Badge>
          <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
            <Users className="h-3.5 w-3.5" />
            ADM
          </Badge>
          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
            <Calculator className="h-3.5 w-3.5" />
            KALK
          </Badge>
          <Badge className="bg-muted text-muted-foreground border-border">
            <Receipt className="h-3.5 w-3.5" />
            BUCH
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="mb-3">Mit vollständigen Bezeichnungen</h4>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Crown className="h-3.5 w-3.5" />
            Geschäftsführung
          </Badge>
          <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">
            <Briefcase className="h-3.5 w-3.5" />
            Planung
          </Badge>
          <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
            <Users className="h-3.5 w-3.5" />
            Außendienst
          </Badge>
          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
            <Calculator className="h-3.5 w-3.5" />
            Kalkulation
          </Badge>
          <Badge className="bg-muted text-muted-foreground border-border">
            <Receipt className="h-3.5 w-3.5" />
            Buchhaltung
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="mb-3">Outline-Variante</h4>
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="border-primary text-primary">
            <Crown className="h-3.5 w-3.5" />
            GF
          </Badge>
          <Badge variant="outline" className="border-chart-1 text-chart-1">
            <Briefcase className="h-3.5 w-3.5" />
            PLAN
          </Badge>
          <Badge variant="outline" className="border-chart-2 text-chart-2">
            <Users className="h-3.5 w-3.5" />
            ADM
          </Badge>
          <Badge variant="outline" className="border-chart-3 text-chart-3">
            <Calculator className="h-3.5 w-3.5" />
            KALK
          </Badge>
          <Badge variant="outline">
            <Receipt className="h-3.5 w-3.5" />
            BUCH
          </Badge>
        </div>
      </div>
    </div>
  );
}
