import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Progress } from './ui/progress';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { toast } from 'sonner@2.0.3';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  Check,
  Clock,
  Zap,
  X,
  ChevronDown,
  ChevronUp,
  Signal,
} from 'lucide-react';

// Connection Status Types
export type ConnectionStatus = 'online' | 'offline' | 'syncing' | 'synced' | 'error';
export type ConnectionQuality = 'good' | 'fair' | 'poor' | 'none';
export type SyncItemStatus = 'pending' | 'syncing' | 'error' | 'success';
export type DataAgeLevel = 'fresh' | 'info' | 'warning';

// Sync Item Interface
export interface SyncItem {
  id: string;
  type: string;
  description: string;
  status: SyncItemStatus;
  timestamp: Date;
  error?: string;
}

// Connection State Interface
export interface ConnectionState {
  online: boolean;
  quality: ConnectionQuality;
  lastSync?: Date;
  syncProgress?: number;
}

// Custom Hook: useConnectionStatus
export function useConnectionStatus(): ConnectionState {
  const [state, setState] = useState<ConnectionState>({
    online: navigator.onLine,
    quality: 'good',
  });

  useEffect(() => {
    const handleOnline = () => {
      setState((prev) => ({ ...prev, online: true, quality: 'good' }));
    };

    const handleOffline = () => {
      setState((prev) => ({ ...prev, online: false, quality: 'none' }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return state;
}

// Global Offline Banner Component
export interface GlobalOfflineBannerProps {
  status: ConnectionStatus;
  syncProgress?: number;
  onDismiss?: () => void;
}

export function GlobalOfflineBanner({
  status,
  syncProgress = 0,
  onDismiss,
}: GlobalOfflineBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (status === 'synced' && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
    setIsVisible(true);
  }, [status, isVisible, onDismiss]);

  if (!isVisible && status === 'synced') return null;

  const config = {
    offline: {
      icon: Zap,
      background: 'rgba(254, 243, 199, 1)', // amber-100
      borderColor: 'rgb(252, 211, 77)', // amber-300
      textColor: 'rgb(146, 64, 14)', // amber-800
      iconColor: 'rgb(146, 64, 14)',
      message: 'Offline-Modus • Änderungen werden gespeichert und später synchronisiert',
    },
    syncing: {
      icon: RefreshCw,
      background: 'rgba(219, 234, 254, 1)', // blue-100
      borderColor: 'rgb(147, 197, 253)', // blue-300
      textColor: 'rgb(30, 64, 175)', // blue-800
      iconColor: 'rgb(59, 130, 246)', // blue-500
      message: 'Verbindung wird hergestellt...',
    },
    synced: {
      icon: Check,
      background: 'rgba(209, 250, 229, 1)', // green-100
      borderColor: 'rgb(134, 239, 172)', // green-300
      textColor: 'rgb(22, 101, 52)', // green-800
      iconColor: 'rgb(16, 185, 129)', // green-500
      message: 'Wieder online • Alle Daten aktuell',
    },
    error: {
      icon: AlertTriangle,
      background: 'rgba(254, 226, 226, 1)', // red-100
      borderColor: 'rgb(252, 165, 165)', // red-300
      textColor: 'rgb(153, 27, 27)', // red-800
      iconColor: 'rgb(239, 68, 68)', // red-500
      message: 'Synchronisierungsfehler • Bitte erneut versuchen',
    },
    online: {
      icon: Wifi,
      background: 'rgba(209, 250, 229, 1)',
      borderColor: 'rgb(134, 239, 172)',
      textColor: 'rgb(22, 101, 52)',
      iconColor: 'rgb(16, 185, 129)',
      message: 'Online',
    },
  };

  const currentConfig = config[status];
  const Icon = currentConfig.icon;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      }}
      role="status"
      aria-live="polite"
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: currentConfig.background,
          borderColor: currentConfig.borderColor,
          color: currentConfig.textColor,
          minHeight: '40px',
        }}
      >
        <div className="flex items-center gap-3 flex-1">
          <Icon
            className={`h-4 w-4 ${status === 'syncing' ? 'animate-spin' : ''}`}
            style={{ color: currentConfig.iconColor }}
          />
          <div className="flex-1">
            <span
              className="text-sm"
              style={{ fontWeight: 'var(--font-weight-medium)' }}
            >
              {currentConfig.message}
            </span>
            {status === 'syncing' && syncProgress !== undefined && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <Progress value={syncProgress} className="h-1 flex-1" />
                  <span className="text-xs" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    {Math.round(syncProgress)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        {status === 'synced' && onDismiss && (
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className="ml-2 p-1 hover:opacity-70 transition-opacity"
            aria-label="Schließen"
          >
            <X className="h-4 w-4" style={{ color: currentConfig.iconColor }} />
          </button>
        )}
      </div>
    </div>
  );
}

// Item-Level Sync Indicator
export interface SyncIndicatorProps {
  status?: SyncItemStatus | null;
  className?: string;
}

export function SyncIndicator({ status, className = '' }: SyncIndicatorProps) {
  if (!status) return null;

  const config = {
    pending: {
      icon: RefreshCw,
      color: 'rgb(59, 130, 246)', // blue-500
      label: 'Ausstehend',
      animate: false,
    },
    syncing: {
      icon: RefreshCw,
      color: 'rgb(59, 130, 246)',
      label: 'Wird synchronisiert',
      animate: true,
    },
    error: {
      icon: AlertTriangle,
      color: 'rgb(239, 68, 68)', // red-500
      label: 'Fehler',
      animate: false,
    },
    success: {
      icon: Check,
      color: 'rgb(16, 185, 129)', // green-500
      label: 'Synchronisiert',
      animate: false,
    },
  };

  const currentConfig = config[status];
  const Icon = currentConfig.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center ${className}`}>
            <Icon
              className={`h-4 w-4 ${currentConfig.animate ? 'animate-spin' : ''} ${
                status === 'success' ? 'offline-fade-out' : ''
              }`}
              style={{ color: currentConfig.color }}
              aria-label={currentConfig.label}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{currentConfig.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Data Freshness Indicator
export interface DataFreshnessProps {
  lastUpdate: Date;
  onRefresh?: () => void;
}

export function DataFreshnessIndicator({ lastUpdate, onRefresh }: DataFreshnessProps) {
  const getAgeInfo = () => {
    const age = Date.now() - lastUpdate.getTime();
    const hours = age / (1000 * 60 * 60);

    if (hours < 1) return null; // Fresh, no indicator

    if (hours < 24) {
      return {
        level: 'info' as DataAgeLevel,
        text: `Aktualisiert vor ${Math.floor(hours)} Std.`,
        icon: Clock,
        showRefresh: false,
      };
    }

    const days = Math.floor(hours / 24);
    return {
      level: 'warning' as DataAgeLevel,
      text: `Daten von ${days === 1 ? 'gestern' : `vor ${days} Tagen`}`,
      icon: AlertTriangle,
      showRefresh: true,
    };
  };

  const ageInfo = getAgeInfo();
  if (!ageInfo) return null;

  const isWarning = ageInfo.level === 'warning';
  const Icon = ageInfo.icon;

  return (
    <div className="space-y-2">
      <div
        className="flex items-center gap-2 text-sm"
        style={{
          color: isWarning ? 'rgb(146, 64, 14)' : 'var(--muted-foreground)',
        }}
      >
        <Icon className="h-3.5 w-3.5" />
        <span>{ageInfo.text}</span>
      </div>
      {ageInfo.showRefresh && onRefresh && (
        <Button size="sm" variant="outline" onClick={onRefresh}>
          Jetzt aktualisieren
        </Button>
      )}
    </div>
  );
}

// Connection Quality Badge (Mobile)
export interface ConnectionQualityBadgeProps {
  quality: ConnectionQuality;
  className?: string;
}

export function ConnectionQualityBadge({
  quality,
  className = '',
}: ConnectionQualityBadgeProps) {
  const config = {
    good: {
      label: '4G',
      bars: 4,
      color: 'rgb(16, 185, 129)', // green-500
    },
    fair: {
      label: '3G',
      bars: 2,
      color: 'rgb(245, 158, 11)', // amber-500
    },
    poor: {
      label: '2G',
      bars: 1,
      color: 'rgb(239, 68, 68)', // red-500
    },
    none: {
      label: 'Offline',
      bars: 0,
      color: 'rgb(100, 116, 139)', // slate-500
    },
  };

  const currentConfig = config[quality];

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded border ${className}`}
      style={{
        borderColor: 'var(--border)',
        background: 'var(--card)',
      }}
    >
      {quality === 'none' ? (
        <>
          <Zap className="h-3.5 w-3.5" style={{ color: currentConfig.color }} />
          <span className="text-xs" style={{ fontWeight: 'var(--font-weight-medium)' }}>
            {currentConfig.label}
          </span>
        </>
      ) : (
        <>
          <span className="text-xs" style={{ fontWeight: 'var(--font-weight-medium)' }}>
            {currentConfig.label}
          </span>
          <div className="flex items-end gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-sm transition-all duration-200"
                style={{
                  height: `${(i + 1) * 3}px`,
                  background:
                    i < currentConfig.bars ? currentConfig.color : 'rgba(0, 0, 0, 0.1)',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Sync Queue Visualization
export interface SyncQueueProps {
  items: SyncItem[];
  onSyncAll?: () => void;
  onRetry?: (id: string) => void;
  mobile?: boolean;
}

export function SyncQueue({ items, onSyncAll, onRetry, mobile = false }: SyncQueueProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pendingCount = items.filter((item) => item.status === 'pending').length;

  const getStatusIcon = (status: SyncItemStatus) => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4" style={{ color: 'rgb(16, 185, 129)' }} />;
      case 'syncing':
        return (
          <RefreshCw
            className="h-4 w-4 animate-spin"
            style={{ color: 'rgb(59, 130, 246)' }}
          />
        );
      case 'error':
        return <AlertTriangle className="h-4 w-4" style={{ color: 'rgb(239, 68, 68)' }} />;
      case 'pending':
        return <Clock className="h-4 w-4" style={{ color: 'rgb(100, 116, 139)' }} />;
    }
  };

  const content = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
          Sync-Warteschlange ({items.length})
        </h4>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between p-2 rounded border"
            style={{
              borderColor: 'var(--border)',
              minHeight: mobile ? '64px' : 'auto',
            }}
          >
            <div className="flex items-start gap-2 flex-1">
              {getStatusIcon(item.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{item.description}</p>
                {item.status === 'syncing' && (
                  <p className="text-xs text-muted-foreground">Wird synchronisiert...</p>
                )}
                {item.status === 'error' && item.error && (
                  <p className="text-xs" style={{ color: 'rgb(239, 68, 68)' }}>
                    {item.error}
                  </p>
                )}
              </div>
            </div>
            {item.status === 'error' && onRetry && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRetry(item.id)}
                className="shrink-0"
              >
                Wiederholen
              </Button>
            )}
          </div>
        ))}
      </div>

      {pendingCount > 0 && onSyncAll && (
        <Button onClick={onSyncAll} className="w-full" size="sm">
          Alle synchronisieren ({pendingCount})
        </Button>
      )}
    </div>
  );

  // Mobile: Use Sheet
  if (mobile) {
    return (
      <Sheet open={isExpanded} onOpenChange={setIsExpanded}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            {items.length} ausstehend
            {isExpanded ? (
              <ChevronUp className="ml-1 h-3 w-3" />
            ) : (
              <ChevronDown className="ml-1 h-3 w-3" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Synchronisierung</SheetTitle>
          </SheetHeader>
          <div className="mt-4">{content}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Use Popover
  return (
    <Popover open={isExpanded} onOpenChange={setIsExpanded}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          {items.length} ausstehend
          {isExpanded ? (
            <ChevronUp className="ml-1 h-3 w-3" />
          ) : (
            <ChevronDown className="ml-1 h-3 w-3" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        {content}
      </PopoverContent>
    </Popover>
  );
}

// Offline Empty State
export interface OfflineEmptyStateProps {
  hasCachedData?: boolean;
  cachedDataDate?: Date;
  onShowCachedData?: () => void;
}

export function OfflineEmptyState({
  hasCachedData = false,
  cachedDataDate,
  onShowCachedData,
}: OfflineEmptyStateProps) {
  if (hasCachedData && cachedDataDate) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 p-4 rounded-full bg-muted">
          <Zap className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2">Offline-Modus aktiv</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          Zeige gespeicherte Daten vom{' '}
          {cachedDataDate.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          Uhr
        </p>
        {onShowCachedData && (
          <Button onClick={onShowCachedData}>Gespeicherte Daten anzeigen</Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 p-4 rounded-full bg-muted">
        <WifiOff className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2">Offline - Keine Daten verfügbar</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Verbinden Sie sich mit dem Internet, um Daten zu laden
      </p>
    </div>
  );
}

// Demo Component
export function OfflineIndicatorsDemo() {
  const [bannerStatus, setBannerStatus] = useState<ConnectionStatus>('offline');
  const [syncProgress, setSyncProgress] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>('good');
  const [syncItems, setSyncItems] = useState<SyncItem[]>([
    {
      id: '1',
      type: 'customer',
      description: 'Kunde erstellt',
      status: 'success',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'opportunity',
      description: 'Opportunity aktualisiert',
      status: 'syncing',
      timestamp: new Date(),
    },
    {
      id: '3',
      type: 'project',
      description: 'Projekt geändert',
      status: 'pending',
      timestamp: new Date(),
    },
    {
      id: '4',
      type: 'document',
      description: 'Dokument hochgeladen',
      status: 'pending',
      timestamp: new Date(),
    },
    {
      id: '5',
      type: 'tour',
      description: 'Tour abgeschlossen',
      status: 'error',
      timestamp: new Date(),
      error: 'Verbindungsfehler',
    },
  ]);

  const handleSyncAll = () => {
    toast.info('Synchronisierung gestartet...');
    setBannerStatus('syncing');
    setSyncProgress(0);

    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setBannerStatus('synced');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleRetry = (id: string) => {
    toast.info('Erneut versuchen...');
    setSyncItems((items) =>
      items.map((item) => (item.id === id ? { ...item, status: 'syncing' as SyncItemStatus } : item))
    );
  };

  const simulateOffline = () => {
    setBannerStatus('offline');
    setConnectionQuality('none');
    toast.warning('Offline-Modus aktiviert');
  };

  const simulateOnline = () => {
    setBannerStatus('syncing');
    setConnectionQuality('good');
    setSyncProgress(0);
    handleSyncAll();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Offline-Indikatoren</h2>
        <p className="text-sm text-muted-foreground">
          System-Statuskomponenten für Offline-Modus, Synchronisierungsstatus und Datenaktualität
        </p>
      </div>

      {/* Global Banner */}
      <Card>
        <CardHeader>
          <h3>Globales Offline-Banner</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setBannerStatus('offline')}>
              Offline
            </Button>
            <Button size="sm" variant="outline" onClick={simulateOnline}>
              Online (mit Sync)
            </Button>
            <Button size="sm" variant="outline" onClick={() => setBannerStatus('synced')}>
              Synchronisiert
            </Button>
            <Button size="sm" variant="outline" onClick={() => setBannerStatus('error')}>
              Fehler
            </Button>
          </div>

          <div className="relative border rounded-lg overflow-hidden" style={{ height: '120px' }}>
            <GlobalOfflineBanner
              status={bannerStatus}
              syncProgress={syncProgress}
              onDismiss={() => toast.info('Banner geschlossen')}
            />
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              Vorschau des Banners (oben)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Item-Level Indicators */}
      <Card>
        <CardHeader>
          <h3>Element-Ebene Sync-Indikatoren</h3>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-sm">Kunde</th>
                  <th className="text-right p-3 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 text-sm">Müller GmbH</td>
                  <td className="p-3 text-right">
                    <span className="text-sm text-muted-foreground">Synchronisiert</span>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 text-sm">Schmidt & Co</td>
                  <td className="p-3 text-right">
                    <SyncIndicator status="pending" />
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 text-sm">Weber Bau AG</td>
                  <td className="p-3 text-right">
                    <SyncIndicator status="syncing" />
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 text-sm">Fischer GmbH</td>
                  <td className="p-3 text-right">
                    <SyncIndicator status="error" />
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 text-sm">Becker Handel</td>
                  <td className="p-3 text-right">
                    <SyncIndicator status="success" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Data Freshness */}
      <Card>
        <CardHeader>
          <h3>Datenaktualität-Indikatoren</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm mb-3">Aktuell (&lt; 1 Stunde)</h4>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm">Kunden (247)</h4>
                </div>
              </CardHeader>
              <CardContent>
                <DataFreshnessIndicator
                  lastUpdate={new Date(Date.now() - 30 * 60 * 1000)}
                  onRefresh={() => toast.success('Daten aktualisiert')}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className="text-sm mb-3">Etwas älter (3 Stunden)</h4>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm">Kunden (247)</h4>
                </div>
              </CardHeader>
              <CardContent>
                <DataFreshnessIndicator
                  lastUpdate={new Date(Date.now() - 3 * 60 * 60 * 1000)}
                  onRefresh={() => toast.success('Daten aktualisiert')}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className="text-sm mb-3">Veraltet (&gt; 24 Stunden)</h4>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm">Kunden (247)</h4>
                </div>
              </CardHeader>
              <CardContent>
                <DataFreshnessIndicator
                  lastUpdate={new Date(Date.now() - 36 * 60 * 60 * 1000)}
                  onRefresh={() => toast.success('Daten werden aktualisiert...')}
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Connection Quality Badge */}
      <Card>
        <CardHeader>
          <h3>Verbindungsqualität (Mobile)</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Gut</p>
              <ConnectionQualityBadge quality="good" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Mittel</p>
              <ConnectionQualityBadge quality="fair" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Schlecht</p>
              <ConnectionQualityBadge quality="poor" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Offline</p>
              <ConnectionQualityBadge quality="none" />
            </div>
          </div>

          <div className="pt-4">
            <h4 className="text-sm mb-3">Aktuelle Verbindung</h4>
            <div className="flex items-center gap-3">
              <ConnectionQualityBadge quality={connectionQuality} />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConnectionQuality('good')}
                >
                  4G
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConnectionQuality('fair')}
                >
                  3G
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConnectionQuality('poor')}
                >
                  2G
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConnectionQuality('none')}
                >
                  Offline
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Queue */}
      <Card>
        <CardHeader>
          <h3>Sync-Warteschlange</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <SyncQueue
              items={syncItems}
              onSyncAll={handleSyncAll}
              onRetry={handleRetry}
              mobile={false}
            />
            <SyncQueue
              items={syncItems}
              onSyncAll={handleSyncAll}
              onRetry={handleRetry}
              mobile={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Offline Empty States */}
      <Card>
        <CardHeader>
          <h3>Offline-Leerzustände</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm mb-3">Ohne gecachte Daten</h4>
            <Card>
              <CardContent className="p-0">
                <OfflineEmptyState />
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className="text-sm mb-3">Mit gecachten Daten</h4>
            <Card>
              <CardContent className="p-0">
                <OfflineEmptyState
                  hasCachedData
                  cachedDataDate={new Date(Date.now() - 2 * 60 * 60 * 1000)}
                  onShowCachedData={() => toast.info('Gecachte Daten anzeigen')}
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Demo Controls */}
      <Card className="bg-muted">
        <CardHeader>
          <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Demo-Steuerung
          </h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={simulateOffline}>
              Offline simulieren
            </Button>
            <Button size="sm" onClick={simulateOnline}>
              Online + Sync simulieren
            </Button>
            <Button size="sm" onClick={handleSyncAll}>
              Sync starten
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Verwenden Sie diese Buttons, um verschiedene Offline/Online-Szenarien zu testen
          </p>
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
          <p>• <strong>useConnectionStatus Hook:</strong> Überwacht navigator.onLine Events</p>
          <p>• <strong>Sync-Indikatoren:</strong> Zeigen nur bei geänderten Elementen</p>
          <p>• <strong>Datenalter:</strong> Berechnet dynamisch basierend auf lastUpdate</p>
          <p>• <strong>Success-Fade:</strong> Synchronisiert-Icon verschwindet nach 2s</p>
          <p>• <strong>Auto-Dismiss:</strong> Erfolgs-Banner nach 3s automatisch ausblenden</p>
          <p>• <strong>Mobile-optimiert:</strong> Sheet statt Popover auf Mobilgeräten</p>
        </CardContent>
      </Card>
    </div>
  );
}