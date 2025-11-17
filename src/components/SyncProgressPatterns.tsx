import { useState, useEffect, useRef } from 'react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import {
  RefreshCw,
  Check,
  AlertTriangle,
  Clock,
  X,
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
  Wifi,
} from 'lucide-react';

// Types
export type SyncItemStatus = 'pending' | 'syncing' | 'completed' | 'failed' | 'conflict';
export type SyncState = 'idle' | 'syncing' | 'paused' | 'completed' | 'error';

export interface SyncItem {
  id: string;
  type: string;
  description: string;
  status: SyncItemStatus;
  progress?: number;
  size?: number;
  error?: string;
  timestamp: Date;
}

export interface SyncProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
  pending: number;
  conflicts: number;
  bytesTransferred?: number;
  totalBytes?: number;
  estimatedTimeRemaining?: number;
}

export interface SyncCategory {
  name: string;
  total: number;
  completed: number;
}

// Utility Functions
export function calculateProgress(items: SyncItem[]): SyncProgress {
  const total = items.length;
  const completed = items.filter((i) => i.status === 'completed').length;
  const failed = items.filter((i) => i.status === 'failed').length;
  const inProgress = items.filter((i) => i.status === 'syncing').length;
  const pending = items.filter((i) => i.status === 'pending').length;
  const conflicts = items.filter((i) => i.status === 'conflict').length;

  const bytesTransferred = items
    .filter((i) => i.status === 'completed')
    .reduce((sum, i) => sum + (i.size || 0), 0);
  const totalBytes = items.reduce((sum, i) => sum + (i.size || 0), 0);

  return {
    total,
    completed,
    failed,
    inProgress,
    pending,
    conflicts,
    bytesTransferred,
    totalBytes,
  };
}

export function formatTimeRemaining(ms: number): string {
  if (ms < 60000) return 'Weniger als 1 Minute';

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `Etwa ${hours} Std. ${remainingMinutes} Min.`;
  }

  return `Etwa ${minutes} Min. ${seconds} Sek.`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Full-Screen Sync Modal (Initial Sync)
export interface InitialSyncModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: SyncCategory[];
  progress: number;
  estimatedTime?: number;
  onBackgroundSync?: () => void;
}

export function InitialSyncModal({
  open,
  onOpenChange,
  categories,
  progress,
  estimatedTime,
  onBackgroundSync,
}: InitialSyncModalProps) {
  const [canBackground, setCanBackground] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setCanBackground(true), 30000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Erste Synchronisierung</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Logo placeholder */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Wifi className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Ihre Daten werden vorbereitet...
            </p>
          </div>

          {/* Overall Progress */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm">
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {Math.round(progress)}%
              </span>
              {estimatedTime && (
                <span className="text-muted-foreground">
                  Geschätzte Zeit: {formatTimeRemaining(estimatedTime)}
                </span>
              )}
            </div>
          </div>

          {/* Category Progress */}
          <div className="space-y-3">
            {categories.map((category) => {
              const categoryProgress =
                category.total > 0 ? (category.completed / category.total) * 100 : 0;
              return (
                <div key={category.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{category.name}</span>
                    <span className="text-muted-foreground">
                      {category.completed}/{category.total}
                    </span>
                  </div>
                  <Progress value={categoryProgress} className="h-1" />
                </div>
              );
            })}
          </div>
        </div>

        {canBackground && onBackgroundSync && (
          <DialogFooter>
            <Button variant="outline" onClick={onBackgroundSync}>
              Im Hintergrund fortfahren
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Floating Sync Widget (Background Sync)
export interface FloatingSyncWidgetProps {
  syncProgress: SyncProgress;
  onShowDetails: () => void;
  onPause?: () => void;
  isPaused?: boolean;
}

export function FloatingSyncWidget({
  syncProgress,
  onShowDetails,
  onPause,
  isPaused = false,
}: FloatingSyncWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const progress =
    syncProgress.total > 0
      ? ((syncProgress.completed + syncProgress.failed) / syncProgress.total) * 100
      : 0;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 transition-all duration-200"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      role="status"
      aria-live="polite"
    >
      {!isExpanded ? (
        <button
          onClick={onShowDetails}
          className="flex items-center gap-2 px-4 py-3 bg-card border rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          style={{ borderColor: 'var(--border)' }}
        >
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
            Sync {syncProgress.completed}/{syncProgress.total}
          </span>
        </button>
      ) : (
        <Card className="w-80 shadow-xl">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Synchronisierung läuft...
              </h4>
              <button
                onClick={onShowDetails}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {syncProgress.completed + syncProgress.failed} von {syncProgress.total}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3" style={{ color: 'rgb(16, 185, 129)' }} />
                <span>{syncProgress.completed} erfolgreich</span>
              </div>
              <div className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3 text-primary" />
                <span>{syncProgress.inProgress} in Arbeit</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>{syncProgress.pending} ausstehend</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onShowDetails} className="flex-1">
                Details
              </Button>
              {onPause && (
                <Button size="sm" variant="outline" onClick={onPause}>
                  {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Sync Queue Detail View
export interface SyncQueueDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SyncItem[];
  onRetryAll?: () => void;
  onRetryFailed?: () => void;
  onResolveConflict?: (id: string) => void;
}

export function SyncQueueDetail({
  open,
  onOpenChange,
  items,
  onRetryAll,
  onRetryFailed,
  onResolveConflict,
}: SyncQueueDetailProps) {
  const [filter, setFilter] = useState<'all' | 'failed' | 'pending' | 'completed'>('all');
  const [statusFilter, setStatusFilter] = useState<SyncItemStatus | 'all'>('all');

  const filteredItems = items.filter((item) => {
    if (filter === 'all' && statusFilter === 'all') return true;
    if (statusFilter !== 'all') return item.status === statusFilter;
    if (filter === 'failed') return item.status === 'failed';
    if (filter === 'pending') return item.status === 'pending';
    if (filter === 'completed') return item.status === 'completed';
    return true;
  });

  const visibleItems = filteredItems.slice(0, 10);
  const remainingCount = filteredItems.length - visibleItems.length;

  const getStatusIcon = (status: SyncItemStatus) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4" style={{ color: 'rgb(16, 185, 129)' }} />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 animate-spin text-primary" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" style={{ color: 'rgb(239, 68, 68)' }} />;
      case 'conflict':
        return <AlertTriangle className="h-4 w-4" style={{ color: 'rgb(245, 158, 11)' }} />;
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: SyncItemStatus) => {
    switch (status) {
      case 'completed':
        return 'Erfolgreich';
      case 'syncing':
        return 'Wird synchronisiert';
      case 'failed':
        return 'Fehlgeschlagen';
      case 'conflict':
        return 'Konflikt';
      case 'pending':
        return 'Ausstehend';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Synchronisierungswarteschlange</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2">
            <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="pending">Ausstehend</SelectItem>
                <SelectItem value="failed">Fehlgeschlagen</SelectItem>
                <SelectItem value="completed">Erfolgreich</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="pending">Ausstehend</SelectItem>
                <SelectItem value="syncing">In Arbeit</SelectItem>
                <SelectItem value="completed">Erfolgreich</SelectItem>
                <SelectItem value="failed">Fehlgeschlagen</SelectItem>
                <SelectItem value="conflict">Konflikt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items List */}
          <ScrollArea className="h-96">
            <div className="space-y-3 pr-4">
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border rounded-lg space-y-2"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(item.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>
                          vor{' '}
                          {Math.floor((Date.now() - item.timestamp.getTime()) / 60000)} Min.
                        </span>
                        {item.size && <span>• {formatBytes(item.size)}</span>}
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {getStatusLabel(item.status)}
                    </Badge>
                  </div>

                  {item.status === 'syncing' && item.progress !== undefined && (
                    <Progress value={item.progress} className="h-1" />
                  )}

                  {item.status === 'conflict' && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Lokale und Server-Version unterschiedlich
                      </p>
                      {onResolveConflict && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onResolveConflict(item.id)}
                        >
                          Konflikt lösen
                        </Button>
                      )}
                    </div>
                  )}

                  {item.status === 'failed' && item.error && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-xs">{item.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}

              {remainingCount > 0 && (
                <div className="text-center p-3 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 inline mr-2" />
                  {remainingCount} weitere Einträge...
                </div>
              )}

              {filteredItems.length === 0 && (
                <div className="text-center p-8 text-sm text-muted-foreground">
                  Keine Einträge gefunden
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex gap-2">
            {onRetryAll && (
              <Button size="sm" variant="outline" onClick={onRetryAll}>
                Alle wiederholen
              </Button>
            )}
            {onRetryFailed && (
              <Button size="sm" variant="outline" onClick={onRetryFailed}>
                Fehler wiederholen
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Conflict Resolution Dialog
export interface ConflictResolutionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  fieldName: string;
  localValue: string;
  serverValue: string;
  localTimestamp: Date;
  serverTimestamp: Date;
  localAuthor: string;
  serverAuthor: string;
  onKeepLocal: () => void;
  onKeepServer: () => void;
  onMerge?: () => void;
}

export function ConflictResolutionDialog({
  open,
  onOpenChange,
  itemName,
  fieldName,
  localValue,
  serverValue,
  localTimestamp,
  serverTimestamp,
  localAuthor,
  serverAuthor,
  onKeepLocal,
  onKeepServer,
  onMerge,
}: ConflictResolutionProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Synchronisierungskonflikt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
              {itemName}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Feld: {fieldName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Local Version */}
            <div className="border rounded-lg p-4 space-y-2" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Ihre Version
              </p>
              <div className="bg-muted p-3 rounded text-sm min-h-[60px]">{localValue}</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  Geändert: vor{' '}
                  {Math.floor((Date.now() - localTimestamp.getTime()) / 60000)} Min.
                </p>
                <p>Von: {localAuthor}</p>
              </div>
            </div>

            {/* Server Version */}
            <div className="border rounded-lg p-4 space-y-2" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Server-Version
              </p>
              <div className="bg-muted p-3 rounded text-sm min-h-[60px]">{serverValue}</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  Geändert: vor{' '}
                  {Math.floor((Date.now() - serverTimestamp.getTime()) / 60000)} Min.
                </p>
                <p>Von: {serverAuthor}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onKeepLocal}>
            Meine behalten
          </Button>
          <Button variant="outline" onClick={onKeepServer}>
            Server-Version
          </Button>
          {onMerge && <Button onClick={onMerge}>Mergen</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Multi-Step Sync Progress
export interface SyncStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  progress?: number;
  detail?: string;
}

export interface MultiStepSyncProgressProps {
  steps: SyncStep[];
  overallProgress: number;
}

export function MultiStepSyncProgress({ steps, overallProgress }: MultiStepSyncProgressProps) {
  const getStepIcon = (status: SyncStep['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4" style={{ color: 'rgb(16, 185, 129)' }} />;
      case 'active':
        return <RefreshCw className="h-4 w-4 animate-spin text-primary" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" style={{ color: 'rgb(239, 68, 68)' }} />;
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <h4>Datenabgleich</h4>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{index + 1}.</span>
                <span className="text-sm">{step.label}</span>
              </div>
              {getStepIcon(step.status)}
            </div>

            {step.status === 'active' && step.progress !== undefined && (
              <div className="pl-8 space-y-1">
                <Progress value={step.progress} className="h-1" />
                {step.detail && (
                  <p className="text-xs text-muted-foreground">{step.detail}</p>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
              Gesamtfortschritt:
            </span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

// Mobile Sync Sheet (Bottom Sheet)
export interface MobileSyncSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progress: number;
  syncProgress: SyncProgress;
  categories: SyncCategory[];
  onPause?: () => void;
  onCancel?: () => void;
  onShowConflicts?: () => void;
  isPaused?: boolean;
}

export function MobileSyncSheet({
  open,
  onOpenChange,
  progress,
  syncProgress,
  categories,
  onPause,
  onCancel,
  onShowConflicts,
  isPaused = false,
}: MobileSyncSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh]">
        <div className="flex justify-center mb-4">
          <div
            className="w-12 h-1 rounded-full bg-muted"
            aria-label="Drag handle"
          />
        </div>

        <SheetHeader>
          <SheetTitle>
            {isPaused ? 'Synchronisierung pausiert' : 'Synchronisierung'}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-center">
              {syncProgress.completed} von {syncProgress.total} Einträgen
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryProgress =
                category.total > 0 ? (category.completed / category.total) * 100 : 0;
              const isComplete = category.completed === category.total;
              const isActive = category.completed < category.total && category.completed > 0;

              return (
                <div
                  key={category.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {isComplete ? (
                      <Check className="h-4 w-4" style={{ color: 'rgb(16, 185, 129)' }} />
                    ) : isActive ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {category.completed}/{category.total}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Conflicts */}
          {syncProgress.conflicts > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <p className="text-sm mb-2">
                  {syncProgress.conflicts} Konflikt{syncProgress.conflicts > 1 ? 'e' : ''}{' '}
                  gefunden
                </p>
                {onShowConflicts && (
                  <Button size="sm" variant="outline" onClick={onShowConflicts}>
                    Konflikte anzeigen
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {onPause && (
              <Button variant="outline" onClick={onPause} className="flex-1">
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Fortfahren
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pausieren
                  </>
                )}
              </Button>
            )}
            {onCancel && (
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Abbrechen
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Demo Component
export function SyncProgressPatternsDemo() {
  const [showInitialSync, setShowInitialSync] = useState(false);
  const [showQueueDetail, setShowQueueDetail] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [isPaused, setIsPaused] = useState(false);

  // Mock data
  const [syncItems, setSyncItems] = useState<SyncItem[]>([
    {
      id: '1',
      type: 'customer',
      description: 'Kunde "Hofladen Müller" erstellt',
      status: 'completed',
      size: 1200,
      timestamp: new Date(Date.now() - 2 * 60000),
    },
    {
      id: '2',
      type: 'opportunity',
      description: 'Opportunity "Projekt X" aktualisiert',
      status: 'syncing',
      progress: 85,
      size: 2400,
      timestamp: new Date(Date.now() - 1 * 60000),
    },
    {
      id: '3',
      type: 'project',
      description: 'Projekt "Website" - Konflikt',
      status: 'conflict',
      size: 3200,
      timestamp: new Date(Date.now() - 5 * 60000),
    },
    {
      id: '4',
      type: 'document',
      description: 'Dokument "Angebot_2024.pdf" hochladen',
      status: 'pending',
      size: 145000,
      timestamp: new Date(),
    },
    {
      id: '5',
      type: 'contact',
      description: 'Kontakt "Max Mustermann" synchronisieren',
      status: 'failed',
      error: 'Netzwerkfehler: Zeitüberschreitung',
      size: 800,
      timestamp: new Date(Date.now() - 3 * 60000),
    },
  ]);

  const categories: SyncCategory[] = [
    { name: 'Kunden', total: 247, completed: 247 },
    { name: 'Projekte', total: 120, completed: 89 },
    { name: 'Opportunities', total: 156, completed: 15 },
  ];

  const syncProgress = calculateProgress(syncItems);
  const overallProgress =
    syncProgress.total > 0
      ? ((syncProgress.completed + syncProgress.failed) / syncProgress.total) * 100
      : 0;

  const multiStepProgress: SyncStep[] = [
    { id: '1', label: 'Verbindung herstellen', status: 'completed' },
    { id: '2', label: 'Änderungen sammeln', status: 'completed' },
    {
      id: '3',
      label: 'Daten hochladen',
      status: 'active',
      progress: 40,
      detail: '156/389 KB',
    },
    { id: '4', label: 'Server-Antwort verarbeiten', status: 'pending' },
    { id: '5', label: 'Lokale Daten aktualisieren', status: 'pending' },
  ];

  const handleStartInitialSync = () => {
    setShowInitialSync(true);
    setSyncState('syncing');
  };

  const handleBackgroundSync = () => {
    setShowInitialSync(false);
    toast.info('Synchronisierung läuft im Hintergrund weiter');
  };

  const handleRetryAll = () => {
    toast.success('Alle Einträge werden erneut versucht');
  };

  const handleRetryFailed = () => {
    toast.success('Fehlgeschlagene Einträge werden wiederholt');
  };

  const handleResolveConflict = (id: string) => {
    setShowConflictDialog(true);
  };

  const handleKeepLocal = () => {
    setShowConflictDialog(false);
    toast.success('Lokale Version wurde beibehalten');
  };

  const handleKeepServer = () => {
    setShowConflictDialog(false);
    toast.success('Server-Version wurde übernommen');
  };

  const handleMerge = () => {
    setShowConflictDialog(false);
    toast.success('Versionen wurden zusammengeführt');
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Synchronisierung fortgesetzt' : 'Synchronisierung pausiert');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Sync Progress Patterns</h2>
        <p className="text-sm text-muted-foreground">
          Umfassende Fortschrittsanzeigen für Datensynchronisierung mit detailliertem
          Tracking, Fehlerbehandlung und Konfliktauflösung
        </p>
      </div>

      {/* Initial Sync Modal */}
      <Card>
        <CardHeader>
          <h3>Vollbild-Sync-Modal (Erste Synchronisierung)</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Modal für initiale Datensynchronisierung mit Kategorie-Fortschritt
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={handleStartInitialSync}>Erste Synchronisierung starten</Button>

          <InitialSyncModal
            open={showInitialSync}
            onOpenChange={setShowInitialSync}
            categories={categories}
            progress={45}
            estimatedTime={150000}
            onBackgroundSync={handleBackgroundSync}
          />
        </CardContent>
      </Card>

      {/* Floating Sync Widget */}
      <Card>
        <CardHeader>
          <h3>Schwebendes Sync-Widget (Hintergrund-Sync)</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Kompaktes Widget für laufende Synchronisierung im Hintergrund
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative border rounded-lg p-8 min-h-[200px]" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm text-muted-foreground text-center">
              Das Widget erscheint unten rechts. Bewegen Sie die Maus darüber, um Details zu
              sehen.
            </p>
            <FloatingSyncWidget
              syncProgress={syncProgress}
              onShowDetails={() => setShowQueueDetail(true)}
              onPause={handlePause}
              isPaused={isPaused}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sync Queue Detail */}
      <Card>
        <CardHeader>
          <h3>Sync-Warteschlangen-Detailansicht</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Vollständige Liste aller Synchronisierungsvorgänge mit Filtern
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowQueueDetail(true)}>
            Warteschlange anzeigen ({syncItems.length})
          </Button>

          <SyncQueueDetail
            open={showQueueDetail}
            onOpenChange={setShowQueueDetail}
            items={syncItems}
            onRetryAll={handleRetryAll}
            onRetryFailed={handleRetryFailed}
            onResolveConflict={handleResolveConflict}
          />
        </CardContent>
      </Card>

      {/* Conflict Resolution */}
      <Card>
        <CardHeader>
          <h3>Konfliktauflösungs-Dialog</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Zweispaltige Ansicht zur Auflösung von Datenkonflikten
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowConflictDialog(true)}>
            Konflikt auflösen
          </Button>

          <ConflictResolutionDialog
            open={showConflictDialog}
            onOpenChange={setShowConflictDialog}
            itemName='Projekt "Website Relaunch"'
            fieldName="Budget"
            localValue="€45.000"
            serverValue="€42.000"
            localTimestamp={new Date(Date.now() - 5 * 60000)}
            serverTimestamp={new Date(Date.now() - 3 * 60000)}
            localAuthor="Sie"
            serverAuthor="M. Weber"
            onKeepLocal={handleKeepLocal}
            onKeepServer={handleKeepServer}
            onMerge={handleMerge}
          />
        </CardContent>
      </Card>

      {/* Multi-Step Progress */}
      <Card>
        <CardHeader>
          <h3>Mehrstufiger Sync-Fortschritt</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Schritt-für-Schritt-Anzeige des Synchronisierungsprozesses
          </p>
        </CardHeader>
        <CardContent>
          <MultiStepSyncProgress steps={multiStepProgress} overallProgress={45} />
        </CardContent>
      </Card>

      {/* Mobile Sync Sheet */}
      <Card>
        <CardHeader>
          <h3>Mobile Sync-Sheet (Bottom Sheet)</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Mobile-optimierte Ansicht mit Wischgeste
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowMobileSheet(true)}>
            Mobile Sheet öffnen
          </Button>

          <MobileSyncSheet
            open={showMobileSheet}
            onOpenChange={setShowMobileSheet}
            progress={overallProgress}
            syncProgress={syncProgress}
            categories={categories}
            onPause={handlePause}
            onCancel={() => {
              setShowMobileSheet(false);
              toast.info('Synchronisierung abgebrochen');
            }}
            onShowConflicts={() => setShowConflictDialog(true)}
            isPaused={isPaused}
          />
        </CardContent>
      </Card>

      {/* Progress States */}
      <Card>
        <CardHeader>
          <h3>Fortschrittszustände</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Verschiedene visuelle Zustände für Fortschrittsanzeigen
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm mb-2">Nicht gestartet (0%)</p>
            <Progress value={0} className="h-2" />
          </div>

          <div>
            <p className="text-sm mb-2">In Bearbeitung (60%)</p>
            <Progress value={60} className="h-2" />
          </div>

          <div>
            <p className="text-sm mb-2 flex items-center gap-2">
              Abgeschlossen (100%)
              <Check className="h-4 w-4" style={{ color: 'rgb(16, 185, 129)' }} />
            </p>
            <Progress value={100} className="h-2" />
          </div>

          <div>
            <p className="text-sm mb-2 flex items-center gap-2">
              Fehler (60%)
              <AlertTriangle className="h-4 w-4" style={{ color: 'rgb(239, 68, 68)' }} />
            </p>
            <Progress value={60} className="h-2" />
          </div>

          <div>
            <p className="text-sm mb-2 flex items-center gap-2">
              Pausiert (60%)
              <Pause className="h-4 w-4 text-muted-foreground" />
            </p>
            <Progress value={60} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Toast Notifications Demo */}
      <Card>
        <CardHeader>
          <h3>Toast-Benachrichtigungen</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Kurze Benachrichtigungen für Sync-Status
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.success('Synchronisierung erfolgreich', {
                  description: '45 Einträge aktualisiert',
                })
              }
            >
              Erfolg
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.error('Synchronisierung teilweise fehlgeschlagen', {
                  description: '3 von 45 Einträgen mit Fehlern',
                  action: {
                    label: 'Details',
                    onClick: () => setShowQueueDetail(true),
                  },
                })
              }
            >
              Fehler
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.info('Synchronisierung gestartet', {
                  description: '45 Einträge werden synchronisiert',
                })
              }
            >
              Info
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.warning('Konflikte gefunden', {
                  description: '2 Konflikte müssen manuell aufgelöst werden',
                  action: {
                    label: 'Anzeigen',
                    onClick: () => setShowConflictDialog(true),
                  },
                })
              }
            >
              Warnung
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Notes */}
      <Card className="bg-muted">
        <CardHeader>
          <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Implementierungshinweise
          </h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            • <strong>Progress Updates:</strong> Maximal alle 500ms aktualisieren
          </p>
          <p>
            • <strong>Zeitschätzung:</strong> Basierend auf bisheriger Durchschnittsgeschwindigkeit
          </p>
          <p>
            • <strong>Exponential Backoff:</strong> Bei Fehlern automatisch wiederholen mit
            Verzögerung
          </p>
          <p>
            • <strong>Background Sync:</strong> Nach 30s Option zum Hintergrund-Modus
          </p>
          <p>
            • <strong>Konfliktauflösung:</strong> Manuelle Auswahl zwischen lokaler und
            Server-Version
          </p>
          <p>
            • <strong>Mobile-optimiert:</strong> Bottom Sheet statt Modal auf kleinen Bildschirmen
          </p>
          <p>
            • <strong>Barrierefreiheit:</strong> ARIA progressbar, live regions, Tastatursteuerung
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
