import { Bell, Mail, Inbox, CloudOff, Users } from 'lucide-react';
import { Badge } from './ui/badge';

export function CountBadges() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3">Benachrichtigungszähler</h4>
        <div className="flex flex-wrap gap-6">
          <div className="relative">
            <Bell className="h-6 w-6 text-foreground" />
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              3
            </Badge>
          </div>

          <div className="relative">
            <Mail className="h-6 w-6 text-foreground" />
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              12
            </Badge>
          </div>

          <div className="relative">
            <Inbox className="h-6 w-6 text-foreground" />
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 px-1.5 h-5 rounded-full flex items-center justify-center min-w-[20px]"
            >
              99+
            </Badge>
          </div>

          <div className="relative">
            <CloudOff className="h-6 w-6 text-foreground" />
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-chart-3 text-white border-chart-3"
            >
              5
            </Badge>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3">Inline-Zähler</h4>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Benachrichtigungen</span>
            <Badge
              variant="destructive"
              className="h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              3
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Ausstehend</span>
            <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30 h-5 px-2">
              8
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Abgeschlossen</span>
            <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30 h-5 px-2">
              24
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Team</span>
            <Badge variant="secondary" className="h-5 px-2">
              5
            </Badge>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3">Sync-Status mit Zähler</h4>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
            <CloudOff className="h-3.5 w-3.5" />
            3 ausstehend
          </Badge>
          <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
            <CloudOff className="h-3.5 w-3.5" />
            Synchronisiert
          </Badge>
          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
            <CloudOff className="h-3.5 w-3.5" />
            15 Änderungen
          </Badge>
        </div>
      </div>
    </div>
  );
}
