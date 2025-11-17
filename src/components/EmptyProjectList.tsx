import { FolderOpen, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function EmptyProjectList() {
  return (
    <div className="space-y-4">
      {/* Active filters indicator */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-border">
        <p className="text-muted-foreground">Aktive Filter:</p>
        <Badge variant="secondary" className="gap-1">
          Status: Abgeschlossen
          <button className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
            <X className="h-3 w-3" />
          </button>
        </Badge>
        <Badge variant="secondary" className="gap-1">
          Jahr: 2024
          <button className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 text-muted-foreground">
          <FolderOpen className="h-28 w-28 mx-auto" strokeWidth={1} />
        </div>

        <h3 className="mb-3">Keine Projekte mit diesen Filtern gefunden</h3>

        <p className="text-muted-foreground mb-6 max-w-md">
          Es gibt keine abgeschlossenen Projekte aus dem Jahr 2024.
        </p>

        <Button variant="outline">Filter entfernen</Button>
      </div>
    </div>
  );
}
