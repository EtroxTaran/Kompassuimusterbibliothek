import { UserPlus, Upload } from 'lucide-react';
import { Button } from './ui/button';

export function EmptyCustomerList() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg bg-muted/20">
      <div className="mb-6 text-muted-foreground">
        <UserPlus className="h-32 w-32 mx-auto" strokeWidth={1} />
      </div>

      <h3 className="mb-3">Noch keine Kunden vorhanden</h3>

      <p className="text-muted-foreground mb-6 max-w-md">
        Beginnen Sie mit dem Hinzufügen Ihres ersten Kunden, um Ihre Kundendatenbank aufzubauen.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Ersten Kunden anlegen
        </Button>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Kunden aus CSV importieren
        </Button>
      </div>
    </div>
  );
}
