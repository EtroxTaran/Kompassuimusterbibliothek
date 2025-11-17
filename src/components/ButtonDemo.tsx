import { ButtonVariants } from './ButtonVariants';
import { ButtonSizes } from './ButtonSizes';
import { ButtonWithIcons } from './ButtonWithIcons';
import { ButtonStates } from './ButtonStates';
import { ButtonGroups } from './ButtonGroups';
import { SpecialButtons } from './SpecialButtons';
import { ButtonContextualExamples } from './ButtonContextualExamples';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function ButtonDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Button-Varianten</CardTitle>
          <CardDescription>
            Primär, Sekundär, Tertiär, Destruktiv, Link - alle grundlegenden Button-Typen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonVariants />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Button-Größen</CardTitle>
          <CardDescription>
            Klein (32px), Standard (40px) und Groß (48px) - für verschiedene Anwendungsfälle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonSizes />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buttons mit Symbolen</CardTitle>
          <CardDescription>
            Icons links, rechts, oder nur Symbol - visuelle Verstärkung von Aktionen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonWithIcons />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Button-Zustände</CardTitle>
          <CardDescription>
            Standard, Hover, Fokus, Deaktiviert, Ladend - alle interaktiven Zustände
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonStates />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Button-Gruppen</CardTitle>
          <CardDescription>
            Formularaktionen, Navigation, Toolbars - zusammenhängende Button-Layouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonGroups />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spezielle Button-Typen</CardTitle>
          <CardDescription>
            Dropdown, Badge, FAB, Split-Button - erweiterte Button-Komponenten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SpecialButtons />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kontextuelle Anwendungsbeispiele</CardTitle>
          <CardDescription>
            Reale Szenarien - Formulare, Dialoge, Listen, mehrstufige Workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonContextualExamples />
        </CardContent>
      </Card>
    </div>
  );
}
