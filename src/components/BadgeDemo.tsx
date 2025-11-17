import { StatusBadges } from './StatusBadges';
import { RoleBadges } from './RoleBadges';
import { CountBadges } from './CountBadges';
import { PriorityBadges } from './PriorityBadges';
import { TagBadges } from './TagBadges';
import { BadgeSizes } from './BadgeSizes';
import { BadgesInContext } from './BadgesInContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function BadgeDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Statusabzeichen</CardTitle>
          <CardDescription>
            Farbcodierte Badges für Erfolg, Warnung, Fehler und Information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StatusBadges />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rollenabzeichen</CardTitle>
          <CardDescription>
            RBAC-Rollenkennzeichnungen für GF, PLAN, ADM, KALK und BUCH
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoleBadges />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zählabzeichen</CardTitle>
          <CardDescription>
            Benachrichtigungszähler und Inline-Zähler für Statusanzeigen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CountBadges />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prioritätsabzeichen</CardTitle>
          <CardDescription>
            Visuelle Indikatoren für hohe, mittlere und niedrige Priorität
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PriorityBadges />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tag-Abzeichen</CardTitle>
          <CardDescription>
            Kategorien, Labels und entfernbare Tags für Filterung und Organisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagBadges />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Abzeichengrößen</CardTitle>
          <CardDescription>
            Klein (20px), Standard (24px) und Groß (28px) Varianten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BadgeSizes />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Abzeichen im Kontext</CardTitle>
          <CardDescription>
            Praktische Anwendungsbeispiele in Tabellen, Karten und Profilen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BadgesInContext />
        </CardContent>
      </Card>
    </div>
  );
}
