import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import {
  Wifi,
  WifiOff,
  Cloud,
  CloudOff,
  RefreshCw,
  X,
  Check,
  AlertTriangle,
  Clock,
  HardDrive,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileEdit,
  FilePlus,
  FileX,
  Users,
  TrendingUp,
  Calendar,
  FileText,
  HelpCircle,
  Loader2,
  Download,
  Upload,
  Settings,
  History,
} from 'lucide-react';

// Types
type ConnectionStatus = 'online' | 'offline' | 'syncing' | 'error';
type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';
type ChangeType = 'created' | 'updated' | 'deleted';

interface QueuedChange {
  id: string;
  type: ChangeType;
  entity: string;
  entityType: 'customer' | 'activity' | 'opportunity' | 'document';
  timestamp: Date;
}

interface Conflict {
  id: string;
  entity: string;
  entityType: string;
  message: string;
  localVersion: any;
  serverVersion: any;
}

interface SyncHistoryEvent {
  id: string;
  timestamp: Date;
  status: 'success' | 'error';
  itemsSynced: number;
  message?: string;
}

interface OfflineData {
  customers: number;
  activities: number;
  opportunities: number;
  documents: number;
}

// Mock data
const mockQueuedChanges: QueuedChange[] = [
  {
    id: '1',
    type: 'updated',
    entity: 'Besuch bei Hofladen Müller',
    entityType: 'activity',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: '2',
    type: 'created',
    entity: 'REWE München Süd',
    entityType: 'customer',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: '3',
    type: 'updated',
    entity: 'Modernisierung Backstube',
    entityType: 'opportunity',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
  },
];

const mockConflicts: Conflict[] = [
  {
    id: '1',
    entity: 'Hofladen Müller GmbH',
    entityType: 'Kunde',
    message: 'Wurde gleichzeitig geändert',
    localVersion: { name: 'Hofladen Müller GmbH', phone: '+49-89-1234567' },
    serverVersion: { name: 'Hofladen Müller GmbH', phone: '+49-89-7654321' },
  },
  {
    id: '2',
    entity: 'Projekt-Deadline',
    entityType: 'Projekt',
    message: 'Fälligkeitsdatum wurde geändert',
    localVersion: { deadline: '31.01.2025' },
    serverVersion: { deadline: '15.02.2025' },
  },
];

const mockSyncHistory: SyncHistoryEvent[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'success',
    itemsSynced: 8,
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    status: 'success',
    itemsSynced: 3,
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'error',
    itemsSynced: 0,
    message: 'Server nicht erreichbar',
  },
];

const mockOfflineData: OfflineData = {
  customers: 32,
  activities: 124,
  opportunities: 12,
  documents: 8,
};

// Get change type label
function getChangeTypeLabel(type: ChangeType): string {
  switch (type) {
    case 'created':
      return 'Erstellt';
    case 'updated':
      return 'Aktualisiert';
    case 'deleted':
      return 'Gelöscht';
  }
}

// Get change type icon
function getChangeTypeIcon(type: ChangeType) {
  switch (type) {
    case 'created':
      return <FilePlus className="h-4 w-4 text-green-600" />;
    case 'updated':
      return <FileEdit className="h-4 w-4 text-primary" />;
    case 'deleted':
      return <FileX className="h-4 w-4 text-red-600" />;
  }
}

// Get entity icon
function getEntityIcon(entityType: string) {
  switch (entityType) {
    case 'customer':
      return <Users className="h-4 w-4" />;
    case 'activity':
      return <Calendar className="h-4 w-4" />;
    case 'opportunity':
      return <TrendingUp className="h-4 w-4" />;
    case 'document':
      return <FileText className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

// Format relative time
function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000 / 60); // minutes
  
  if (diff < 1) return 'Gerade eben';
  if (diff < 60) return `Vor ${diff} Min`;
  
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `Vor ${hours} Std`;
  
  const days = Math.floor(hours / 24);
  return `Vor ${days} Tag${days > 1 ? 'en' : ''}`;
}

// Format timestamp
function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Top Banner Component
function TopBanner({
  status,
  pendingCount,
  syncProgress,
  onClick,
}: {
  status: ConnectionStatus;
  pendingCount: number;
  syncProgress?: { current: number; total: number };
  onClick: () => void;
}) {
  const getBannerStyle = () => {
    switch (status) {
      case 'online':
        return 'bg-green-100 border-green-200 text-green-900';
      case 'offline':
        return 'bg-amber-100 border-amber-200 text-amber-900';
      case 'syncing':
        return 'bg-accent/50 border-accent text-primary';
      case 'error':
        return 'bg-red-100 border-red-200 text-red-900';
    }
  };

  const getBannerIcon = () => {
    switch (status) {
      case 'online':
        return <Check className="h-4 w-4" />;
      case 'offline':
        return <WifiOff className="h-4 w-4" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getBannerText = () => {
    switch (status) {
      case 'online':
        return 'Synchronisiert ✓';
      case 'offline':
        return pendingCount > 0 ? `Offline (${pendingCount} ausstehend)` : 'Offline-Modus';
      case 'syncing':
        return syncProgress
          ? `Synchronisiere... (${syncProgress.current}/${syncProgress.total})`
          : 'Synchronisiere...';
      case 'error':
        return 'Sync-Fehler';
    }
  };

  return (
    <button
      className={`w-full px-4 py-2 border-b flex items-center justify-center gap-2 transition-all ${getBannerStyle()}`}
      onClick={onClick}
    >
      {getBannerIcon()}
      <span>{getBannerText()}</span>
    </button>
  );
}

// Conflict Resolution Dialog
function ConflictResolutionDialog({
  conflict,
  isOpen,
  onClose,
  onResolve,
}: {
  conflict: Conflict | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (resolution: 'local' | 'server' | 'manual') => void;
}) {
  if (!conflict) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Konflikt lösen</DialogTitle>
          <DialogDescription>
            {conflict.entityType}: {conflict.entity}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{conflict.message}</AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4">
            {/* Local Version */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Upload className="h-4 w-4 text-primary" />
                <h3>Meine Version (Lokal)</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(conflict.localVersion).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="text-muted-foreground">{key}:</span>
                    <p className="bg-accent/50 p-2 rounded mt-1">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Server Version */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Download className="h-4 w-4 text-green-600" />
                <h3>Server-Version</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(conflict.serverVersion).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="text-muted-foreground">{key}:</span>
                    <p className="bg-green-50 p-2 rounded mt-1">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="w-full space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => onResolve('local')}>
                Meine Version behalten
              </Button>
              <Button variant="outline" onClick={() => onResolve('server')}>
                Server-Version behalten
              </Button>
            </div>
            <Button className="w-full" variant="outline" onClick={() => onResolve('manual')}>
              Manuell zusammenführen
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Offline Sync Status Component
export function OfflineSyncStatus() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('online');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [showSyncView, setShowSyncView] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [queuedChanges, setQueuedChanges] = useState<QueuedChange[]>(mockQueuedChanges);
  const [conflicts, setConflicts] = useState<Conflict[]>(mockConflicts);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number } | undefined>();
  const [autoSyncWifi, setAutoSyncWifi] = useState(true);
  const [autoSyncMobile, setAutoSyncMobile] = useState(false);
  const [preloadData, setPreloadData] = useState(true);

  const lastSyncTime = mockSyncHistory[0]?.timestamp;
  const storageUsed = 2.3; // MB
  const storageTotal = 50; // MB
  const storagePercent = (storageUsed / storageTotal) * 100;

  // Handle manual sync
  const handleManualSync = () => {
    if (connectionStatus === 'offline') {
      toast.error('Keine Verbindung', {
        description: 'Bitte verbinden Sie sich mit dem Internet',
      });
      return;
    }

    setSyncStatus('syncing');
    setConnectionStatus('syncing');
    setSyncProgress({ current: 0, total: queuedChanges.length });

    // Simulate sync progress
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setSyncProgress({ current, total: queuedChanges.length });

      if (current >= queuedChanges.length) {
        clearInterval(interval);
        setQueuedChanges([]);
        setSyncStatus('success');
        setConnectionStatus('online');
        setSyncProgress(undefined);
        toast.success('Synchronisierung abgeschlossen', {
          description: `${queuedChanges.length} Änderungen synchronisiert`,
        });
      }
    }, 500);
  };

  // Handle conflict resolution
  const handleResolveConflict = (conflictId: string, resolution: 'local' | 'server' | 'manual') => {
    setConflicts(conflicts.filter((c) => c.id !== conflictId));
    setShowConflictDialog(false);
    setSelectedConflict(null);

    if (resolution === 'manual') {
      toast.info('Manuelle Zusammenführung', {
        description: 'Bearbeiten Sie den Eintrag, um die Änderungen zusammenzuführen',
      });
    } else {
      toast.success('Konflikt gelöst', {
        description: `${resolution === 'local' ? 'Lokale' : 'Server'}-Version wurde behalten`,
      });
    }
  };

  // Toggle connection (for demo)
  const toggleConnection = () => {
    setConnectionStatus((prev) => (prev === 'online' ? 'offline' : 'online'));
  };

  // Total offline entries
  const totalOfflineEntries =
    mockOfflineData.customers +
    mockOfflineData.activities +
    mockOfflineData.opportunities +
    mockOfflineData.documents;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Banner */}
      <TopBanner
        status={connectionStatus}
        pendingCount={queuedChanges.length}
        syncProgress={syncProgress}
        onClick={() => setShowSyncView(true)}
      />

      {/* Demo Controls */}
      <div className="p-4 border-b border-border bg-muted/50">
        <p className="text-muted-foreground mb-2 text-center">Demo-Steuerung</p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={toggleConnection}>
            {connectionStatus === 'online' ? <WifiOff className="h-4 w-4 mr-2" /> : <Wifi className="h-4 w-4 mr-2" />}
            {connectionStatus === 'online' ? 'Offline gehen' : 'Online gehen'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowSyncView(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Sync-Status öffnen
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <Cloud className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="mb-2">Offline-Synchronisation</h2>
          <p className="text-muted-foreground mb-4">
            Tippen Sie auf das Banner oben, um den Sync-Status zu öffnen
          </p>
        </div>
      </div>

      {/* Full Sync Status Sheet */}
      <Sheet open={showSyncView} onOpenChange={setShowSyncView}>
        <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-xl">
          {/* Visually Hidden Header for Accessibility */}
          <SheetHeader className="sr-only">
            <SheetTitle>Synchronisierungsstatus</SheetTitle>
          </SheetHeader>
          
          {/* Handle Bar */}
          <div className="flex justify-center py-3">
            <div className="w-12 h-1 bg-muted-foreground/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between mb-2">
              <SheetHeader>
                <SheetTitle>Offline & Synchronisation</SheetTitle>
              </SheetHeader>
              <Button variant="ghost" size="sm" onClick={() => setShowSyncView(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {lastSyncTime && (
              <p className="text-muted-foreground">
                Zuletzt synchronisiert: {formatRelativeTime(lastSyncTime)}
              </p>
            )}
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="h-[calc(90vh-120px)] px-6">
            <div className="space-y-6 pb-6">
              {/* Connection Status */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">Verbindungsstatus</h3>
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-16 w-16 rounded-full flex items-center justify-center ${
                        connectionStatus === 'online'
                          ? 'bg-green-100 text-green-600'
                          : connectionStatus === 'syncing'
                          ? 'bg-accent/60 text-primary'
                          : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      {connectionStatus === 'online' && <Wifi className="h-8 w-8" />}
                      {connectionStatus === 'offline' && <WifiOff className="h-8 w-8" />}
                      {connectionStatus === 'syncing' && <RefreshCw className="h-8 w-8 animate-spin" />}
                      {connectionStatus === 'error' && <AlertTriangle className="h-8 w-8" />}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`mb-1 ${
                          connectionStatus === 'online'
                            ? 'text-green-600'
                            : connectionStatus === 'syncing'
                            ? 'text-primary'
                            : 'text-amber-600'
                        }`}
                      >
                        {connectionStatus === 'online' && 'Online'}
                        {connectionStatus === 'offline' && 'Offline'}
                        {connectionStatus === 'syncing' && 'Synchronisiere...'}
                        {connectionStatus === 'error' && 'Fehler'}
                      </p>
                      <p className="text-muted-foreground">
                        {connectionStatus === 'online' && 'Alle Daten aktuell'}
                        {connectionStatus === 'offline' && 'Änderungen werden lokal gespeichert'}
                        {connectionStatus === 'syncing' && 'Daten werden synchronisiert'}
                        {connectionStatus === 'error' && 'Synchronisierung fehlgeschlagen'}
                      </p>
                      <p className="text-muted-foreground mt-1">
                        {connectionStatus === 'online' ? 'WLAN' : 'Keine Verbindung'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sync Queue */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3>Ausstehende Synchronisation</h3>
                    {queuedChanges.length > 0 && (
                      <Badge className="bg-amber-100 text-amber-800">
                        {queuedChanges.length} Änderungen warten
                      </Badge>
                    )}
                  </div>

                  {queuedChanges.length === 0 ? (
                    <div className="flex items-center gap-2 text-green-600 py-4">
                      <Check className="h-5 w-5" />
                      <span>Keine ausstehenden Änderungen</span>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mb-3"
                        onClick={() => setShowQueue(!showQueue)}
                      >
                        {showQueue ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                        {showQueue ? 'Verbergen' : 'Änderungen anzeigen'}
                      </Button>

                      {showQueue && (
                        <div className="space-y-2">
                          {queuedChanges.map((change) => (
                            <div key={change.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                              {getChangeTypeIcon(change.type)}
                              <div className="flex-1 min-w-0">
                                <p className="mb-1">{getChangeTypeLabel(change.type)}: {change.entity}</p>
                                <p className="text-muted-foreground">{formatRelativeTime(change.timestamp)}</p>
                              </div>
                              {getEntityIcon(change.entityType)}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Manual Sync */}
              <Card>
                <CardContent className="p-6">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleManualSync}
                    disabled={connectionStatus === 'offline' || syncStatus === 'syncing'}
                  >
                    {syncStatus === 'syncing' ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Synchronisiere...
                        {syncProgress && ` (${syncProgress.current}/${syncProgress.total})`}
                      </>
                    ) : connectionStatus === 'offline' ? (
                      <>
                        <CloudOff className="mr-2 h-5 w-5" />
                        Keine Verbindung
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Jetzt synchronisieren
                      </>
                    )}
                  </Button>
                  {syncStatus === 'success' && (
                    <div className="flex items-center gap-2 justify-center text-green-600 mt-3">
                      <Check className="h-4 w-4" />
                      <span>Synchronisierung abgeschlossen</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Storage Usage */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">Speicher-Nutzung</h3>
                  <Progress value={storagePercent} className="mb-3" />
                  <p
                    className={`mb-2 ${
                      storagePercent < 80 ? 'text-green-600' : storagePercent < 95 ? 'text-amber-600' : 'text-red-600'
                    }`}
                  >
                    {storageUsed.toFixed(1)} MB von {storageTotal} MB verwendet ({storagePercent.toFixed(1)}%)
                  </p>
                  {storagePercent > 80 && (
                    <Alert className="mb-3">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {storagePercent > 95
                          ? 'Speicher fast voll - Bitte dringend Daten bereinigen'
                          : 'Speicher fast voll - Bitte synchronisieren'}
                      </AlertDescription>
                    </Alert>
                  )}
                  {storagePercent > 95 && (
                    <Button variant="outline" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Daten bereinigen
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Offline Data */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">Offline-Daten</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        Kunden
                      </span>
                      <Badge variant="outline">{mockOfflineData.customers}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Aktivitäten
                      </span>
                      <Badge variant="outline">{mockOfflineData.activities}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        Opportunities
                      </span>
                      <Badge variant="outline">{mockOfflineData.opportunities}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Dokumente
                      </span>
                      <Badge variant="outline">{mockOfflineData.documents}</Badge>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <span>Gesamt</span>
                    <Badge>{totalOfflineEntries} Einträge offline verfügbar</Badge>
                  </div>
                  {lastSyncTime && (
                    <p className="text-muted-foreground mt-3">
                      Zuletzt aktualisiert: {formatRelativeTime(lastSyncTime)}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Conflicts */}
              {conflicts.length > 0 && (
                <Card className="border-red-200">
                  <CardContent className="p-6">
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {conflicts.length} Konflikt{conflicts.length > 1 ? 'e' : ''} muss gelöst werden
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      {conflicts.map((conflict) => (
                        <div key={conflict.id} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="mb-1">
                              {conflict.entityType} '{conflict.entity}' {conflict.message}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedConflict(conflict);
                              setShowConflictDialog(true);
                            }}
                          >
                            Lösen
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Settings */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">Einstellungen</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-sync-wifi">Auto-Sync bei WLAN</Label>
                      <Switch id="auto-sync-wifi" checked={autoSyncWifi} onCheckedChange={setAutoSyncWifi} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-sync-mobile">Auto-Sync bei Mobilfunk</Label>
                      <Switch id="auto-sync-mobile" checked={autoSyncMobile} onCheckedChange={setAutoSyncMobile} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="preload-data">Daten vorladen bei WLAN</Label>
                      <Switch id="preload-data" checked={preloadData} onCheckedChange={setPreloadData} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sync History */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3>Sync-Historie</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHistory(!showHistory)}
                    >
                      {showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  {showHistory && (
                    <div className="space-y-2">
                      {mockSyncHistory.map((event) => (
                        <div key={event.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                          {event.status === 'success' ? (
                            <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p>{formatTimestamp(event.timestamp)}</p>
                              <Badge variant={event.status === 'success' ? 'outline' : 'destructive'}>
                                {event.status === 'success' ? 'Erfolgreich' : 'Fehler'}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">
                              {event.status === 'success'
                                ? `${event.itemsSynced} ${event.itemsSynced === 1 ? 'Element' : 'Elemente'} synchronisiert`
                                : event.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Conflict Resolution Dialog */}
      <ConflictResolutionDialog
        conflict={selectedConflict}
        isOpen={showConflictDialog}
        onClose={() => {
          setShowConflictDialog(false);
          setSelectedConflict(null);
        }}
        onResolve={(resolution) => {
          if (selectedConflict) {
            handleResolveConflict(selectedConflict.id, resolution);
          }
        }}
      />
    </div>
  );
}

// Demo Component
export function OfflineSyncStatusDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4">Offline-Synchronisationsstatus (Mobile)</h2>
          <p className="text-muted-foreground mb-6">
            Mobile PWA-Komponente für Offline-Datenverwaltung mit Sync-Warteschlange, Konfliktauflösung,
            Speicherverwaltung und manueller Synchronisation
          </p>

          <div>
            <h3 className="mb-3">Features:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Persistentes Top-Banner mit Verbindungsstatus</li>
              <li>• Farbcodierte Statusanzeigen (Grün/Gelb/Blau/Rot)</li>
              <li>• Ausstehende Änderungen mit Warteschlange</li>
              <li>• Manuelle Synchronisation mit Fortschrittsanzeige</li>
              <li>• Speichernutzung mit Warnungen</li>
              <li>• Offline-Daten-Übersicht (Kunden, Aktivitäten, etc.)</li>
              <li>• Konfliktauflösung-Dialog mit Versionsvergleich</li>
              <li>• Auto-Sync-Einstellungen (WLAN/Mobilfunk)</li>
              <li>• Sync-Historie mit Zeitstempeln</li>
              <li>• Toast-Benachrichtigungen für alle Ereignisse</li>
              <li>• Bottom-Sheet mit Swipe-Gesten</li>
              <li>• Vollständige deutsche Lokalisierung</li>
              <li>• PouchDB/CouchDB Integration bereit</li>
              <li>• Responsive für alle Mobilgeräte</li>
            </ul>
          </div>

          <Separator className="my-6" />

          <div className="max-w-sm mx-auto border border-border rounded-lg overflow-hidden shadow-xl">
            <OfflineSyncStatus />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}