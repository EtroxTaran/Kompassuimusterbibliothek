import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardHeader } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { AlertCircle, Users, Building2, FolderKanban, FileText, Clock } from 'lucide-react';

// Base Skeleton Wrapper with Accessibility
export interface SkeletonWrapperProps {
  children: React.ReactNode;
  label?: string;
  loading?: boolean;
  className?: string;
}

export function SkeletonWrapper({
  children,
  label = 'Lade Inhalte...',
  loading = true,
  className = '',
}: SkeletonWrapperProps) {
  if (!loading) return null;

  return (
    <div role="status" aria-live="polite" aria-label={label} className={className}>
      <span className="sr-only">Daten werden geladen</span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

// List Item Skeleton (Desktop)
export interface ListItemSkeletonProps {
  count?: number;
  showAvatar?: boolean;
  showMeta?: boolean;
}

export function ListItemSkeleton({
  count = 5,
  showAvatar = true,
  showMeta = true,
}: ListItemSkeletonProps) {
  return (
    <SkeletonWrapper label="Listenelement wird geladen">
      <div className="space-y-4">
        {Array(count)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border rounded-lg"
              style={{
                borderColor: 'var(--border)',
                animationDelay: `${index * 50}ms`,
              }}
            >
              {showAvatar && (
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
              )}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3.5 w-32" />
              </div>
              {showMeta && (
                <div className="flex flex-col items-end gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3.5 w-16" />
                </div>
              )}
            </div>
          ))}
      </div>
    </SkeletonWrapper>
  );
}

// Card Skeleton (Customer/Project/Opportunity)
export interface CardSkeletonProps {
  count?: number;
  showTags?: boolean;
  gridCols?: number;
}

export function CardSkeleton({
  count = 3,
  showTags = true,
  gridCols = 3,
}: CardSkeletonProps) {
  return (
    <SkeletonWrapper label="Karten werden geladen">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        }}
      >
        {Array(count)
          .fill(null)
          .map((_, index) => (
            <Card
              key={index}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {showTags && (
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                )}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </SkeletonWrapper>
  );
}

// Table Row Skeleton
export interface TableSkeletonProps {
  rows?: number;
  columns?: number[];
  showCheckbox?: boolean;
  showActions?: boolean;
}

export function TableSkeleton({
  rows = 5,
  columns = [200, 150, 120, 100, 150],
  showCheckbox = true,
  showActions = true,
}: TableSkeletonProps) {
  return (
    <SkeletonWrapper label="Tabelle wird geladen">
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-muted p-3 border-b flex items-center gap-4">
          {showCheckbox && <Skeleton className="h-4 w-4" />}
          {columns.map((width, index) => (
            <Skeleton key={index} className="h-4" style={{ width: `${width}px` }} />
          ))}
          {showActions && <Skeleton className="h-4 w-20 ml-auto" />}
        </div>

        {/* Rows */}
        {Array(rows)
          .fill(null)
          .map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="p-3 border-b last:border-b-0 flex items-center gap-4"
              style={{
                animationDelay: `${rowIndex * 50}ms`,
              }}
            >
              {showCheckbox && <Skeleton className="h-4 w-4" />}
              {columns.map((width, colIndex) => (
                <Skeleton key={colIndex} className="h-4" style={{ width: `${width}px` }} />
              ))}
              {showActions && <Skeleton className="h-8 w-8 ml-auto" />}
            </div>
          ))}
      </div>
    </SkeletonWrapper>
  );
}

// Dashboard Metric Skeleton
export interface MetricSkeletonProps {
  count?: number;
  gridCols?: number;
  showTrend?: boolean;
}

export function MetricSkeleton({
  count = 4,
  gridCols = 4,
  showTrend = true,
}: MetricSkeletonProps) {
  return (
    <SkeletonWrapper label="Metriken werden geladen">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        }}
      >
        {Array(count)
          .fill(null)
          .map((_, index) => (
            <Card
              key={index}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-24" />
                {showTrend && (
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-16" />
                    <Skeleton className="h-3.5 w-20" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </SkeletonWrapper>
  );
}

// Form Field Skeleton
export interface FormSkeletonProps {
  fields?: number;
  showButtons?: boolean;
}

export function FormSkeleton({ fields = 6, showButtons = true }: FormSkeletonProps) {
  return (
    <SkeletonWrapper label="Formular wird geladen">
      <div className="space-y-6">
        {Array(fields)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="space-y-2"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-10 w-full rounded" style={{ borderRadius: 'var(--radius-input)' }} />
            </div>
          ))}

        {showButtons && (
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        )}
      </div>
    </SkeletonWrapper>
  );
}

// Task Card Skeleton (Mobile)
export interface TaskCardSkeletonProps {
  count?: number;
}

export function TaskCardSkeleton({ count = 5 }: TaskCardSkeletonProps) {
  return (
    <SkeletonWrapper label="Aufgaben werden geladen">
      <div className="space-y-3">
        {Array(count)
          .fill(null)
          .map((_, index) => (
            <Card
              key={index}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </SkeletonWrapper>
  );
}

// Smart Loading Component with Timing
export interface SmartLoadingProps {
  loading: boolean;
  minimumDisplayTime?: number;
  skeleton: React.ReactNode;
  content: React.ReactNode;
  error?: string;
  onRetry?: () => void;
}

export function SmartLoading({
  loading,
  minimumDisplayTime = 500,
  skeleton,
  content,
  error,
  onRetry,
}: SmartLoadingProps) {
  const [showSkeleton, setShowSkeleton] = useState(loading);
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null);
  const [showSlowLoadMessage, setShowSlowLoadMessage] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoadStartTime(Date.now());
      setShowSkeleton(true);

      // Show "Still loading" message after 3s
      const slowLoadTimer = setTimeout(() => {
        setShowSlowLoadMessage(true);
      }, 3000);

      return () => clearTimeout(slowLoadTimer);
    } else if (loadStartTime) {
      const elapsed = Date.now() - loadStartTime;
      const remaining = Math.max(0, minimumDisplayTime - elapsed);

      if (remaining > 0) {
        const timer = setTimeout(() => {
          setShowSkeleton(false);
          setShowSlowLoadMessage(false);
        }, remaining);
        return () => clearTimeout(timer);
      } else {
        setShowSkeleton(false);
        setShowSlowLoadMessage(false);
      }
    }
  }, [loading, loadStartTime, minimumDisplayTime]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          {onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              Erneut versuchen
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (showSkeleton) {
    return (
      <div className="relative">
        {skeleton}
        {showSlowLoadMessage && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">Noch einen Moment...</p>
          </div>
        )}
      </div>
    );
  }

  return <div className="animate-fade-in">{content}</div>;
}

// Viewport-Based Skeleton Count Calculator
export function useSkeletonCount(itemHeight: number = 80): number {
  const [count, setCount] = useState(5);

  useEffect(() => {
    const calculateCount = () => {
      const visibleHeight = window.innerHeight;
      const calculatedCount = Math.ceil(visibleHeight / itemHeight);
      setCount(Math.min(calculatedCount, 10)); // Max 10 for performance
    };

    calculateCount();
    window.addEventListener('resize', calculateCount);
    return () => window.removeEventListener('resize', calculateCount);
  }, [itemHeight]);

  return count;
}

// Demo Component
export function SkeletonLoadersDemo() {
  const [loadingList, setLoadingList] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingForm, setLoadingForm] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [smartLoadingState, setSmartLoadingState] = useState(false);
  const [smartLoadingError, setSmartLoadingError] = useState<string | undefined>();

  const skeletonCount = useSkeletonCount(80);

  const simulateLoad = (setter: (val: boolean) => void, duration: number = 2000) => {
    setter(true);
    setTimeout(() => setter(false), duration);
  };

  const handleSmartLoad = (duration: number, shouldError: boolean = false) => {
    setSmartLoadingState(true);
    setSmartLoadingError(undefined);

    setTimeout(() => {
      if (shouldError) {
        setSmartLoadingError('Fehler beim Laden der Daten');
      }
      setSmartLoadingState(false);
    }, duration);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2">Skeleton Loaders</h2>
        <p className="text-sm text-muted-foreground">
          Umfassende Lade-Skeletons für alle wichtigen UI-Muster mit Shimmer-Animation und
          Layout-Stabilität
        </p>
      </div>

      {/* List Item Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3>Listenelement-Skeleton</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Für Kunden-, Kontakt- und Projektlisten
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateLoad(setLoadingList)}
            >
              Neu laden
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingList ? (
            <ListItemSkeleton count={3} />
          ) : (
            <div className="space-y-4">
              {[
                { name: 'Müller GmbH', type: 'Bauunternehmen', status: 'Aktiv' },
                { name: 'Schmidt & Co', type: 'Innenausbau', status: 'Lead' },
                { name: 'Weber Bau AG', type: 'Generalunternehmer', status: 'Aktiv' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border rounded-lg animate-fade-in"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                      {item.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.type}</p>
                    <p className="text-xs text-muted-foreground">Letzter Kontakt: vor 2 Tagen</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary">{item.status}</Badge>
                    <p className="text-xs text-muted-foreground">€45.000</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3>Karten-Skeleton</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Für Kunden-, Projekt- und Opportunity-Karten
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateLoad(setLoadingCards)}
            >
              Neu laden
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingCards ? (
            <CardSkeleton count={3} gridCols={3} />
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: 'Website Relaunch', company: 'Müller GmbH', value: '€25.000' },
                { title: 'Büroumbau', company: 'Schmidt & Co', value: '€45.000' },
                { title: 'Lagerhalle', company: 'Weber Bau AG', value: '€180.000' },
              ].map((project, i) => (
                <Card key={i} className="animate-fade-in">
                  <CardHeader>
                    <h4>{project.title}</h4>
                    <p className="text-sm text-muted-foreground">{project.company}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Badge variant="secondary">In Bearbeitung</Badge>
                      <Badge variant="outline">KALK</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Projektbeschreibung und weitere Details zur Opportunity...
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        {project.value}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3>Tabellen-Skeleton</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Für Datentabellen und Übersichten
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateLoad(setLoadingTable)}
            >
              Neu laden
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingTable ? (
            <TableSkeleton rows={5} columns={[200, 150, 120, 100, 150]} />
          ) : (
            <div className="border rounded-lg overflow-hidden animate-fade-in">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">
                      <Checkbox />
                    </th>
                    <th className="text-left p-3 text-sm">Kunde</th>
                    <th className="text-left p-3 text-sm">Typ</th>
                    <th className="text-left p-3 text-sm">Status</th>
                    <th className="text-left p-3 text-sm">Umsatz</th>
                    <th className="text-left p-3 text-sm">Letzte Aktivität</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: 'Müller GmbH',
                      type: 'Bauunternehmen',
                      status: 'Aktiv',
                      revenue: '€125.000',
                      activity: 'vor 2 Std.',
                    },
                    {
                      name: 'Schmidt & Co',
                      type: 'Innenausbau',
                      status: 'Lead',
                      revenue: '€45.000',
                      activity: 'vor 1 Tag',
                    },
                    {
                      name: 'Weber Bau AG',
                      type: 'Generalunternehmer',
                      status: 'Aktiv',
                      revenue: '€280.000',
                      activity: 'vor 3 Std.',
                    },
                  ].map((row, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3">
                        <Checkbox />
                      </td>
                      <td className="p-3 text-sm">{row.name}</td>
                      <td className="p-3 text-sm">{row.type}</td>
                      <td className="p-3 text-sm">
                        <Badge variant="secondary">{row.status}</Badge>
                      </td>
                      <td className="p-3 text-sm">{row.revenue}</td>
                      <td className="p-3 text-sm text-muted-foreground">{row.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metric Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3>Dashboard-Metriken-Skeleton</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Für KPI-Karten und Dashboard-Widgets
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateLoad(setLoadingMetrics)}
            >
              Neu laden
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingMetrics ? (
            <MetricSkeleton count={4} gridCols={4} />
          ) : (
            <div className="grid grid-cols-4 gap-4 animate-fade-in">
              {[
                { label: 'Gesamtumsatz', value: '€425.000', trend: '+12,5%', up: true },
                { label: 'Neue Leads', value: '47', trend: '+8,3%', up: true },
                { label: 'Offene Aufgaben', value: '23', trend: '-15,2%', up: false },
                { label: 'Abschlussrate', value: '68%', trend: '+3,1%', up: true },
              ].map((metric, i) => (
                <Card key={i}>
                  <CardContent className="pt-6 space-y-2">
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                      {metric.value}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm"
                        style={{
                          color: metric.up ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
                        }}
                      >
                        {metric.trend}
                      </span>
                      <span className="text-xs text-muted-foreground">vs. letzte Woche</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3>Formular-Skeleton</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Für Eingabeformulare während des Ladens
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateLoad(setLoadingForm)}
            >
              Neu laden
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingForm ? (
            <FormSkeleton fields={4} />
          ) : (
            <div className="space-y-6 animate-fade-in max-w-md">
              <div className="space-y-2">
                <label className="text-sm">Firmenname</label>
                <input
                  className="w-full h-10 px-3 border rounded"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="z.B. Müller GmbH"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">E-Mail</label>
                <input
                  className="w-full h-10 px-3 border rounded"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="kontakt@firma.de"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Telefon</label>
                <input
                  className="w-full h-10 px-3 border rounded"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="+49 123 456789"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Branche</label>
                <select
                  className="w-full h-10 px-3 border rounded"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <option>Bauunternehmen</option>
                  <option>Innenausbau</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button>Speichern</Button>
                <Button variant="outline">Abbrechen</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Card Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3>Aufgabenkarten-Skeleton (Mobile)</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Für mobile Aufgabenlisten
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateLoad(setLoadingTasks)}
            >
              Neu laden
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            {loadingTasks ? (
              <TaskCardSkeleton count={3} />
            ) : (
              <div className="space-y-3 animate-fade-in">
                {[
                  {
                    title: 'Angebot erstellen für Müller GmbH',
                    date: 'Heute',
                    priority: 'Hoch',
                    status: 'Offen',
                  },
                  {
                    title: 'Kundenbesuch Schmidt & Co',
                    date: 'Morgen',
                    priority: 'Mittel',
                    status: 'Geplant',
                  },
                  {
                    title: 'Follow-up Telefonat',
                    date: 'In 3 Tagen',
                    priority: 'Niedrig',
                    status: 'Offen',
                  },
                ].map((task, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          <Checkbox className="mt-0.5" />
                          <p className="text-sm">{task.title}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {task.date}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Aufgabenbeschreibung und weitere Details zur Aufgabe...
                      </p>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            task.priority === 'Hoch'
                              ? 'destructive'
                              : task.priority === 'Mittel'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">{task.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Smart Loading */}
      <Card>
        <CardHeader>
          <h3>Intelligentes Laden mit Timing</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Automatische Verwaltung von Mindestanzeigezeit und Fehlerzuständen
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => handleSmartLoad(300)}>
              Schnelles Laden (&lt;300ms)
            </Button>
            <Button size="sm" onClick={() => handleSmartLoad(1500)}>
              Normales Laden (1,5s)
            </Button>
            <Button size="sm" onClick={() => handleSmartLoad(4000)}>
              Langsames Laden (4s)
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleSmartLoad(1000, true)}>
              Mit Fehler
            </Button>
          </div>

          <SmartLoading
            loading={smartLoadingState}
            skeleton={<ListItemSkeleton count={3} />}
            content={
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Inhalte erfolgreich geladen!</p>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                      Müller GmbH
                    </p>
                    <p className="text-sm text-muted-foreground">Bauunternehmen</p>
                  </div>
                </div>
              </div>
            }
            error={smartLoadingError}
            onRetry={() => handleSmartLoad(1500)}
          />
        </CardContent>
      </Card>

      {/* Viewport-Based Count */}
      <Card>
        <CardHeader>
          <h3>Viewport-basierte Skeleton-Anzahl</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Berechnet automatisch die optimale Anzahl basierend auf der Viewporthöhe
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Berechnete Skeleton-Anzahl für Ihre Viewporthöhe: <strong>{skeletonCount}</strong> Items
            (basierend auf 80px Höhe pro Element)
          </p>
          <p className="text-xs text-muted-foreground">
            Ändern Sie die Fenstergröße, um die Anzahl neu zu berechnen.
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
          <p>
            • <strong>Shimmer-Animation:</strong> 1,5s Dauer, CSS-basiert für GPU-Beschleunigung
          </p>
          <p>
            • <strong>Mindestanzeigezeit:</strong> 500ms, um Flackern zu vermeiden
          </p>
          <p>
            • <strong>Gestaffelte Animation:</strong> 50ms Verzögerung zwischen Elementen
          </p>
          <p>
            • <strong>Max Skeleton-Anzahl:</strong> 10 Elemente für optimale Performance
          </p>
          <p>
            • <strong>Barrierefreiheit:</strong> role="status", aria-live="polite", sr-only Labels
          </p>
          <p>
            • <strong>Mobile-Optimierung:</strong> Vereinfachte Skeletons für kleine Viewports
          </p>
          <p>
            • <strong>Fade-Übergang:</strong> 200ms ease-out beim Wechsel zu echtem Inhalt
          </p>
        </CardContent>
      </Card>
    </div>
  );
}