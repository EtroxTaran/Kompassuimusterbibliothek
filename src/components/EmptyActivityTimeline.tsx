import { Clock, Plus } from 'lucide-react';
import { Button } from './ui/button';

export function EmptyActivityTimeline() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg bg-muted/20">
      <div className="mb-6 text-muted-foreground">
        <Clock className="h-24 w-24 mx-auto" strokeWidth={1} />
      </div>

      <h3 className="mb-3">Noch keine Aktivitäten protokolliert</h3>

      <p className="text-muted-foreground mb-6 max-w-md">
        Beginnen Sie mit der Erfassung von Kundenkontakten, Anrufen und Meetings.
      </p>

      <Button className="gap-2">
        <Plus className="h-4 w-4" />
        Aktivität hinzufügen
      </Button>
    </div>
  );
}
