import { Lock } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function OwnerOnlyCustomer() {
  return (
    <Alert className="bg-chart-3/10 border-l-4 border-chart-3 border-t-0 border-r-0 border-b-0">
      <Lock className="h-5 w-5 text-chart-3" />
      <AlertDescription className="text-foreground">
        Dieser Kunde gehört einem anderen Außendienstmitarbeiter. Sie haben nur Lesezugriff.
      </AlertDescription>
    </Alert>
  );
}
