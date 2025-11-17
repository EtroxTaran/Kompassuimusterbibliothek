import { Search } from 'lucide-react';
import { Button } from './ui/button';

export function EmptySearchResults() {
  const searchTerm = 'Müller Hofladen';

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-6 text-muted-foreground">
        <Search className="h-24 w-24 mx-auto" strokeWidth={1} />
      </div>

      <h3 className="mb-3">Keine Ergebnisse für '{searchTerm}'</h3>

      <p className="text-muted-foreground mb-6 max-w-md">
        Versuchen Sie es mit anderen Suchbegriffen oder überprüfen Sie die Schreibweise.
      </p>

      <div className="space-y-2 mb-6">
        <p className="text-muted-foreground">Vorschläge:</p>
        <ul className="text-muted-foreground space-y-1">
          <li>• Suchfilter anpassen</li>
          <li>• Alle Kunden anzeigen</li>
        </ul>
      </div>

      <Button variant="outline">Filter zurücksetzen</Button>
    </div>
  );
}
