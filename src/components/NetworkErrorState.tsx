import { CloudOff, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function NetworkErrorState() {
  const pendingChanges = [
    { id: 1, description: "Kunde 'Hofladen Müller' aktualisiert" },
    { id: 2, description: "Neue Aktivität für 'REWE Köln' erstellt" },
    { id: 3, description: 'Angebot #2024-045 gespeichert' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center max-w-lg mx-auto">
      <div className="mb-6 text-muted-foreground">
        <CloudOff className="h-32 w-32 mx-auto" strokeWidth={1} />
      </div>

      <h2 className="mb-3">Keine Internetverbindung</h2>

      <p className="text-muted-foreground mb-6 max-w-md">
        Sie arbeiten derzeit offline. Ihre Änderungen werden automatisch synchronisiert, sobald Sie
        wieder online sind.
      </p>

      <Badge variant="secondary" className="mb-6 bg-chart-3/10 text-chart-3 hover:bg-chart-3/20">
        Offline-Modus aktiv
      </Badge>

      <Card className="w-full mb-6 border-muted">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Ausstehende Änderungen</span>
            <Badge variant="outline">{pendingChanges.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-left">
            {pendingChanges.map((change) => (
              <li key={change.id} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-3 mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">{change.description}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Verbindung erneut prüfen
      </Button>
    </div>
  );
}
