import { BasicCards } from './BasicCards';
import { KPICards } from './KPICards';
import { ListItemCards } from './ListItemCards';
import { ProjectCards } from './ProjectCards';
import { SpecialCards } from './SpecialCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function CardDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grundlegende Karten</CardTitle>
          <CardDescription>
            Einfache Karten, Karten mit Header/Footer, klickbare Karten und Grid-Layouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BasicCards />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KPI- und Dashboard-Karten</CardTitle>
          <CardDescription>
            Statistik-Karten, mehrspaltige Layouts, Fortschrittsbalken und farbige Varianten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KPICards />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listen-Element-Karten</CardTitle>
          <CardDescription>
            Kundenkarten, erweiterte Listenansichten mit Kontaktinfo und Performance-Indikatoren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ListItemCards />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projekt- und Opportunity-Karten</CardTitle>
          <CardDescription>
            Portfolio-Ansichten, Kanban-Board-Karten mit Drag-and-Drop-Indikator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectCards />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spezielle Kartentypen</CardTitle>
          <CardDescription>
            Warnungen, Timeline, erweiterbare Karten, Skelette, leere Zustände
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SpecialCards />
        </CardContent>
      </Card>
    </div>
  );
}
