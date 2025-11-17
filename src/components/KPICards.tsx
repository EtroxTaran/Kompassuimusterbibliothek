import { Users, TrendingUp, TrendingDown, Euro, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function KPICards() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">KPI-Karten (Dashboard-Statistiken)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground uppercase tracking-wide">Neue Kunden</p>
                  <p className="mt-2">127</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-chart-2 mt-4">
                <TrendingUp className="h-4 w-4" />
                <span>+12%</span>
                <span className="text-muted-foreground">vs. Vormonat</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground uppercase tracking-wide">Umsatz</p>
                  <p className="mt-2">€ 2,45M</p>
                </div>
                <div className="h-12 w-12 bg-chart-2/10 rounded-full flex items-center justify-center">
                  <Euro className="h-6 w-6 text-chart-2" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-chart-2 mt-4">
                <TrendingUp className="h-4 w-4" />
                <span>+8%</span>
                <span className="text-muted-foreground">vs. Vormonat</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground uppercase tracking-wide">Projekte</p>
                  <p className="mt-2">48</p>
                </div>
                <div className="h-12 w-12 bg-chart-3/10 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-chart-3" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-destructive mt-4">
                <TrendingDown className="h-4 w-4" />
                <span>-3%</span>
                <span className="text-muted-foreground">vs. Vormonat</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground uppercase tracking-wide">Angebote</p>
                  <p className="mt-2">23</p>
                </div>
                <div className="h-12 w-12 bg-chart-4/10 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-chart-4" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-chart-2 mt-4">
                <TrendingUp className="h-4 w-4" />
                <span>+15%</span>
                <span className="text-muted-foreground">vs. Vormonat</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground mt-3">
          Kompakte KPI-Karten mit Icon, Wert und Trend-Indikator
        </p>
      </div>

      <div>
        <h4 className="mb-4">Mehrspaltige Statistik-Karte</h4>
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="pt-6 md:pt-0 md:pr-6 first:pt-0">
                <p className="text-muted-foreground uppercase tracking-wide">Gesamt-Umsatz</p>
                <p className="mt-2">€ 2.450.000</p>
                <div className="flex items-center gap-1 text-chart-2 mt-2">
                  <TrendingUp className="h-3 w-3" />
                  <span>+18%</span>
                </div>
              </div>
              <div className="pt-6 md:pt-0 md:px-6">
                <p className="text-muted-foreground uppercase tracking-wide">Durchschn. Auftragswert</p>
                <p className="mt-2">€ 51.042</p>
                <div className="flex items-center gap-1 text-chart-2 mt-2">
                  <TrendingUp className="h-3 w-3" />
                  <span>+5%</span>
                </div>
              </div>
              <div className="pt-6 md:pt-0 md:pl-6">
                <p className="text-muted-foreground uppercase tracking-wide">Conversion-Rate</p>
                <p className="mt-2">34%</p>
                <div className="flex items-center gap-1 text-destructive mt-2">
                  <TrendingDown className="h-3 w-3" />
                  <span>-2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="text-muted-foreground mt-3">
          Mehrere Statistiken in einer Karte mit Trennlinien
        </p>
      </div>

      <div>
        <h4 className="mb-4">Vierspaltige Statistik-Karte</h4>
        <Card>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-muted-foreground uppercase tracking-wide">Offen</p>
                <p className="mt-2">23</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase tracking-wide">In Bearbeitung</p>
                <p className="mt-2">48</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase tracking-wide">Abgeschlossen</p>
                <p className="mt-2">156</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase tracking-wide">Überfällig</p>
                <p className="mt-2 text-destructive">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="text-muted-foreground mt-3">
          Grid-Layout für mehrere Statuswerte ohne Trennlinien
        </p>
      </div>

      <div>
        <h4 className="mb-4">KPI mit Fortschrittsbalken</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-muted-foreground uppercase tracking-wide">Monatsziel</p>
                  <p className="mt-2">€ 180.000 / € 250.000</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-chart-3" />
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-chart-3 h-2 rounded-full" style={{ width: '72%' }} />
              </div>
              <p className="text-muted-foreground mt-2">72% erreicht</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-muted-foreground uppercase tracking-wide">Quartalsziel</p>
                  <p className="mt-2">€ 425.000 / € 750.000</p>
                </div>
                <AlertCircle className="h-8 w-8 text-chart-4" />
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-chart-4 h-2 rounded-full" style={{ width: '57%' }} />
              </div>
              <p className="text-muted-foreground mt-2">57% erreicht</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Mini-KPI-Karten (Kompakt)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="gap-2">
            <CardContent className="px-4 py-3">
              <p className="text-muted-foreground">Kunden</p>
              <p className="mt-1">1.248</p>
            </CardContent>
          </Card>
          <Card className="gap-2">
            <CardContent className="px-4 py-3">
              <p className="text-muted-foreground">Projekte</p>
              <p className="mt-1">89</p>
            </CardContent>
          </Card>
          <Card className="gap-2">
            <CardContent className="px-4 py-3">
              <p className="text-muted-foreground">Rechnungen</p>
              <p className="mt-1">456</p>
            </CardContent>
          </Card>
          <Card className="gap-2">
            <CardContent className="px-4 py-3">
              <p className="text-muted-foreground">Angebote</p>
              <p className="mt-1">34</p>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground mt-3">
          Sehr kompakte Variante für Sidebar oder Dashboard-Header
        </p>
      </div>

      <div>
        <h4 className="mb-4">KPI mit farbigem Hintergrund</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary">
            <CardContent>
              <Users className="h-8 w-8 mb-3 opacity-80" />
              <p className="opacity-90">Neue Kunden</p>
              <p className="mt-2">127</p>
              <p className="mt-2 opacity-80">+12% vs. Vormonat</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-2 to-chart-2/80 text-white border-chart-2">
            <CardContent>
              <Euro className="h-8 w-8 mb-3 opacity-80" />
              <p className="opacity-90">Umsatz</p>
              <p className="mt-2">€ 2,45M</p>
              <p className="mt-2 opacity-80">+8% vs. Vormonat</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-3 to-chart-3/80 text-white border-chart-3">
            <CardContent>
              <FileText className="h-8 w-8 mb-3 opacity-80" />
              <p className="opacity-90">Projekte</p>
              <p className="mt-2">48</p>
              <p className="mt-2 opacity-80">-3% vs. Vormonat</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-4 to-chart-4/80 text-white border-chart-4">
            <CardContent>
              <Clock className="h-8 w-8 mb-3 opacity-80" />
              <p className="opacity-90">Angebote</p>
              <p className="mt-2">23</p>
              <p className="mt-2 opacity-80">+15% vs. Vormonat</p>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground mt-3">
          Farbige Gradient-Hintergründe für visuell hervorgehobene KPIs
        </p>
      </div>
    </div>
  );
}
