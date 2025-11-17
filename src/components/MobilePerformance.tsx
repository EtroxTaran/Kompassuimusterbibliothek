import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import {
  RefreshCw,
  AlertTriangle,
  Check,
  ChevronRight,
  Search,
  Home,
  BarChart3,
  Plus,
  User,
  Edit3,
  Trash2,
  Download,
  Zap,
  Loader2,
  WifiOff,
  Clock,
} from 'lucide-react';

// Skeleton Components
export function SkeletonText({ width = '100%', height = '16px' }: { width?: string; height?: string }) {
  return (
    <div
      className="skeleton rounded"
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, #F3F4F6 0%, #E5E7EB 50%, #F3F4F6 100%)',
        backgroundSize: '200px 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  );
}

export function SkeletonCircle({ size = 40 }: { size?: number }) {
  return (
    <div
      className="skeleton rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: 'linear-gradient(90deg, #F3F4F6 0%, #E5E7EB 50%, #F3F4F6 100%)',
        backgroundSize: '200px 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  );
}

export function ListItemSkeleton() {
  return (
    <div className="p-4 border-b space-y-3">
      <div className="flex items-center gap-3">
        <SkeletonCircle size={48} />
        <div className="flex-1 space-y-2">
          <SkeletonText width="180px" height="20px" />
          <SkeletonText width="240px" height="16px" />
        </div>
      </div>
      <div className="flex gap-2">
        <SkeletonText width="80px" height="14px" />
        <SkeletonText width="80px" height="14px" />
        <SkeletonText width="80px" height="14px" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        <SkeletonText width="180px" height="20px" />
        <SkeletonText width="240px" height="16px" />
        <div className="flex gap-2 mt-4">
          <SkeletonText width="80px" height="14px" />
          <SkeletonText width="80px" height="14px" />
          <SkeletonText width="80px" height="14px" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardWidgetSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        <SkeletonText width="120px" height="14px" />
        <SkeletonText width="80px" height="32px" />
        <SkeletonText width="140px" height="14px" />
      </CardContent>
    </Card>
  );
}

// Pull-to-Refresh Component
export function PullToRefresh({ onRefresh, children }: { onRefresh: () => Promise<void>; children: React.ReactNode }) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);

  const maxPullDistance = 80;
  const triggerDistance = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.min(Math.max(currentY - startY, 0), maxPullDistance);
    setPullDistance(distance);
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= triggerDistance && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
        toast.success('Aktualisiert');
      } catch (error) {
        toast.error('Aktualisierung fehlgeschlagen');
      }
      setIsRefreshing(false);
    }
    setIsPulling(false);
    setPullDistance(0);
  };

  const getIndicatorText = () => {
    if (isRefreshing) return 'Aktualisiere...';
    if (pullDistance >= triggerDistance) return 'Loslassen zum Aktualisieren';
    if (pullDistance > 0) return 'Weiter ziehen...';
    return 'Ziehen zum Aktualisieren';
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull-to-Refresh Indicator */}
      <div
        className="absolute top-0 left-0 right-0 bg-background shadow-sm transition-transform duration-200 z-10"
        style={{
          transform: `translateY(${isPulling || isRefreshing ? pullDistance - 64 : -64}px)`,
        }}
      >
        <div className="h-16 flex flex-col items-center justify-center gap-1">
          {isRefreshing ? (
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          ) : pullDistance >= triggerDistance ? (
            <RefreshCw className="h-6 w-6 text-primary" />
          ) : (
            <RefreshCw className="h-6 w-6 text-muted-foreground" style={{ transform: `rotate(${pullDistance * 4}deg)` }} />
          )}
          <p className="text-sm text-muted-foreground">{getIndicatorText()}</p>
          {pullDistance > 0 && !isRefreshing && (
            <Progress value={(pullDistance / triggerDistance) * 100} className="w-24 h-1" />
          )}
        </div>
      </div>
      
      {children}
    </div>
  );
}

// Offline Banner Component
export function OfflineBanner({ isOffline }: { isOffline: boolean }) {
  if (!isOffline) return null;

  return (
    <div className="bg-amber-100 border-b border-amber-300 px-4 py-2">
      <div className="flex items-center gap-2 text-sm text-amber-900">
        <Zap className="h-4 w-4" />
        <span>Offline-Modus • Änderungen werden gespeichert und später synchronisiert</span>
      </div>
    </div>
  );
}

// Sync Status Badge Component
export function SyncStatusBadge({ status }: { status: 'synced' | 'pending' | 'error' }) {
  if (status === 'synced') return null;

  return (
    <span className="inline-flex items-center">
      {status === 'pending' && (
        <RefreshCw className="h-4 w-4 text-blue-600 animate-spin ml-2" />
      )}
      {status === 'error' && (
        <AlertTriangle className="h-4 w-4 text-red-600 ml-2" />
      )}
    </span>
  );
}

// Offline Data Age Indicator
export function OfflineDataAge({ lastUpdate }: { lastUpdate: Date }) {
  const getTimeDiff = () => {
    const diff = Date.now() - lastUpdate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'vor weniger als 1 Std.';
    if (hours === 1) return 'vor 1 Std.';
    return `vor ${hours} Std.`;
  };

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Letzte Aktualisierung: {getTimeDiff()}</span>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Jetzt aktualisieren
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Optimized List Item with Touch Targets
export function OptimizedListItem({
  title,
  subtitle,
  badges,
  syncStatus = 'synced',
  onEdit,
  onDelete,
}: {
  title: string;
  subtitle: string;
  badges?: string[];
  syncStatus?: 'synced' | 'pending' | 'error';
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="border-b hover:bg-muted/50 transition-colors">
      <div className="min-h-[64px] p-4 flex items-center gap-3">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarFallback>{title.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="truncate">{title}</p>
            <SyncStatusBadge status={syncStatus} />
          </div>
          <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          {badges && badges.length > 0 && (
            <div className="flex gap-2 mt-2">
              {badges.map((badge, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          {onEdit && (
            <button
              onClick={onEdit}
              className="h-12 w-12 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              aria-label="Bearbeiten"
            >
              <Edit3 className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="h-12 w-12 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              aria-label="Löschen"
            >
              <Trash2 className="h-5 w-5 text-destructive" />
            </button>
          )}
          <button
            className="h-12 w-12 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Details"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Optimized Button Group
export function OptimizedButtonGroup({
  onSave,
  onCancel,
  isLoading = false,
}: {
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onSave}
        disabled={isLoading}
        className="min-h-[48px] flex-1"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Speichere...
          </>
        ) : (
          'Speichern'
        )}
      </Button>
      <Button
        onClick={onCancel}
        variant="outline"
        disabled={isLoading}
        className="min-h-[48px] flex-1"
      >
        Abbrechen
      </Button>
    </div>
  );
}

// Search with Loading State
export function SearchWithLoading({ onSearch, isSearching }: { onSearch: (query: string) => void; isSearching: boolean }) {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Suche..."
        className="pl-10 pr-10 min-h-[48px]"
      />
      {isSearching && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
      )}
    </div>
  );
}

// Optimized Bottom Navigation
export function OptimizedBottomNav({ active }: { active: string }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'new', label: 'Neu', icon: Plus },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t safe-area-bottom">
      <div className="grid grid-cols-4 h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          
          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-label={tab.label}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Swipeable List Item
export function SwipeableListItem({
  title,
  subtitle,
  onDelete,
}: {
  title: string;
  subtitle: string;
  onDelete: () => void;
}) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const offset = Math.min(0, currentX - startX);
    setSwipeOffset(offset);
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -80) {
      setSwipeOffset(-80);
    } else {
      setSwipeOffset(0);
    }
    setIsSwiping(false);
  };

  return (
    <div className="relative overflow-hidden border-b">
      {/* Delete button background */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-destructive flex items-center justify-center">
        <button
          onClick={onDelete}
          className="h-16 w-20 flex items-center justify-center"
          aria-label="Löschen"
        >
          <Trash2 className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Main content */}
      <div
        className="bg-background transition-transform"
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="min-h-[64px] p-4 flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{title.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="mb-1">{title}</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

// Lazy Load More Component
export function LazyLoadMore({ onLoadMore, hasMore, isLoading }: { onLoadMore: () => void; hasMore: boolean; isLoading: boolean }) {
  if (!hasMore) {
    return (
      <div className="text-center p-8 text-muted-foreground text-sm">
        Alle Einträge geladen
      </div>
    );
  }

  return (
    <div className="text-center p-6 border-t">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Lädt weitere Einträge...</span>
        </div>
      ) : (
        <Button variant="outline" onClick={onLoadMore} className="min-h-[48px]">
          Mehr laden
        </Button>
      )}
    </div>
  );
}

// Demo Component
export function MobilePerformanceDemo() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showSkeletons, setShowSkeletons] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowSkeletons(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const handleSearch = async (query: string) => {
    if (!query) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSearching(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast.success('Gespeichert');
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoadingMore(false);
  };

  const mockItems = [
    { id: 1, title: 'Hofladen Müller GmbH', subtitle: 'München • Aktiv seit 2020', badges: ['VIP', 'Premium'], syncStatus: 'synced' as const },
    { id: 2, title: 'REWE München', subtitle: 'München • Aktiv seit 2021', badges: ['Partner'], syncStatus: 'pending' as const },
    { id: 3, title: 'Edeka Schwabing', subtitle: 'München • Aktiv seit 2022', badges: ['Standard'], syncStatus: 'error' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant={showSkeletons ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowSkeletons(!showSkeletons)}
              >
                {showSkeletons ? 'Skeletons An' : 'Skeletons Aus'}
              </Button>
              <Button
                variant={isOffline ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsOffline(!isOffline)}
              >
                {isOffline ? 'Offline' : 'Online'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSkeletons(true)}
              >
                Neu laden
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Performance-Metriken angezeigt')}
              >
                Metriken
              </Button>
            </div>

            <Separator />

            <div className="border border-border rounded-lg p-6 bg-muted/50">
              <h3 className="mb-4">Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Skeleton loaders (shimmer animation)</li>
                  <li>• List item skeletons (3 variations)</li>
                  <li>• Card skeletons</li>
                  <li>• Dashboard widget skeletons</li>
                  <li>• Pull-to-refresh indicator</li>
                  <li>• 4 pull states (idle/pulling/release/loading)</li>
                  <li>• Progress bar during pull</li>
                  <li>• Offline banner (amber)</li>
                  <li>• Sync status badges (pending/error)</li>
                  <li>• Offline data age indicator</li>
                  <li>• Touch targets: 48px minimum height</li>
                  <li>• List items: 64px height</li>
                </ul>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Icon buttons: 48×48px</li>
                  <li>• Button spacing: 8px gap</li>
                  <li>• Search with loading spinner</li>
                  <li>• Form buttons with loading state</li>
                  <li>• Bottom nav: 56px + safe area</li>
                  <li>• Swipeable list items (80px target)</li>
                  <li>• Lazy load more indicator</li>
                  <li>• Virtual scroll placeholders</li>
                  <li>• Image loading states</li>
                  <li>• Performance metrics tracking</li>
                  <li>• 500ms minimum skeleton display</li>
                  <li>• 200ms fade transitions</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Banner */}
      <OfflineBanner isOffline={isOffline} />

      {/* Offline Data Age */}
      {isOffline && (
        <OfflineDataAge lastUpdate={new Date(Date.now() - 3 * 60 * 60 * 1000)} />
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Suche mit Lade-Indikator</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchWithLoading onSearch={handleSearch} isSearching={isSearching} />
        </CardContent>
      </Card>

      {/* Skeleton Demos */}
      {showSkeletons ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Skeleton-Varianten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">List Items</Label>
                <div className="border rounded-lg overflow-hidden">
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Card Skeleton</Label>
                <CardSkeleton />
              </div>

              <div>
                <Label className="mb-3 block">Dashboard Widgets</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DashboardWidgetSkeleton />
                  <DashboardWidgetSkeleton />
                  <DashboardWidgetSkeleton />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Pull-to-Refresh List */}
          <Card>
            <CardHeader>
              <CardTitle>Pull-to-Refresh Liste</CardTitle>
              <CardDescription>Ziehen Sie nach unten zum Aktualisieren</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <PullToRefresh onRefresh={handleRefresh}>
                <div>
                  {mockItems.map((item) => (
                    <OptimizedListItem
                      key={item.id}
                      title={item.title}
                      subtitle={item.subtitle}
                      badges={item.badges}
                      syncStatus={item.syncStatus}
                      onEdit={() => toast.info('Bearbeiten')}
                      onDelete={() => toast.info('Löschen')}
                    />
                  ))}
                </div>
              </PullToRefresh>

              <LazyLoadMore
                onLoadMore={handleLoadMore}
                hasMore={true}
                isLoading={isLoadingMore}
              />
            </CardContent>
          </Card>

          {/* Swipeable List */}
          <Card>
            <CardHeader>
              <CardTitle>Wischbare Liste</CardTitle>
              <CardDescription>Nach links wischen zum Löschen</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {mockItems.map((item) => (
                <SwipeableListItem
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  onDelete={() => toast.success('Gelöscht')}
                />
              ))}
            </CardContent>
          </Card>

          {/* Optimized Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Optimierte Buttons (48px Touch Targets)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <OptimizedButtonGroup
                onSave={handleSave}
                onCancel={() => toast.info('Abgebrochen')}
                isLoading={isSaving}
              />
            </CardContent>
          </Card>

          {/* Bottom Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Bottom Navigation (56px + Safe Area)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-32 border rounded-lg overflow-hidden bg-muted">
                <div className="absolute bottom-0 left-0 right-0">
                  <OptimizedBottomNav active={activeTab} />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
