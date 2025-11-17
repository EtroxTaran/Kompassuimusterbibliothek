import { Lock } from 'lucide-react';
import { Badge } from './ui/badge';

export function PermissionDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
      <div className="mb-6 rounded-full bg-muted p-6">
        <Lock className="h-16 w-16 text-muted-foreground" strokeWidth={1.5} />
      </div>

      <h3 className="mb-3">Zugriff eingeschränkt</h3>

      <p className="text-muted-foreground mb-4">
        Sie haben keine Berechtigung, Rechnungen zu erstellen. Diese Funktion ist nur für
        Geschäftsführung und Buchhaltung verfügbar.
      </p>

      <Badge variant="outline" className="mb-6">
        Erforderliche Rolle: GF oder BUCH
      </Badge>

      <p className="text-muted-foreground">
        Kontaktieren Sie Ihren Administrator, um Zugriffsrechte zu beantragen.
      </p>
    </div>
  );
}
