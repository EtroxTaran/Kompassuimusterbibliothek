import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner@2.0.3';
import {
  X,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';

// AI Insight Types
export type InsightType = 'suggestion' | 'prediction' | 'alert' | 'tip';

// AI Insight Props
export interface AIInsightCardProps {
  type: InsightType;
  title: string;
  content: string;
  details?: string[];
  metric?: string;
  confidence?: number; // 0-1
  urgency?: 'low' | 'medium' | 'high';
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  loading?: boolean;
  minimal?: boolean;
  className?: string;
}

// Confidence Label Helper
function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.9) return 'Sehr sicher';
  if (confidence >= 0.7) return 'Sicher';
  if (confidence >= 0.5) return 'Wahrscheinlich';
  return 'Unsicher';
}

// Urgency Color Helper
function getUrgencyColor(urgency: 'low' | 'medium' | 'high'): string {
  switch (urgency) {
    case 'high':
      return 'rgb(239, 68, 68)'; // red
    case 'medium':
      return 'rgb(245, 158, 11)'; // amber
    case 'low':
      return 'rgb(34, 197, 94)'; // green
  }
}

// Get Icon for Type
function getInsightIcon(type: InsightType) {
  switch (type) {
    case 'suggestion':
      return Lightbulb;
    case 'prediction':
      return TrendingUp;
    case 'alert':
      return AlertTriangle;
    case 'tip':
      return Sparkles;
  }
}

// Get Background Style for Type
function getInsightStyle(type: InsightType) {
  switch (type) {
    case 'suggestion':
      return {
        background: 'rgba(243, 232, 255, 1)', // light purple
        borderColor: 'rgba(147, 51, 234, 0.2)', // purple with opacity
        iconColor: 'rgb(147, 51, 234)', // purple
        accentColor: 'rgb(147, 51, 234)',
      };
    case 'prediction':
      return {
        background: 'rgba(219, 234, 254, 1)', // light blue
        borderColor: 'rgba(59, 130, 246, 0.2)', // blue with opacity
        iconColor: 'rgb(59, 130, 246)', // blue
        accentColor: 'rgb(59, 130, 246)',
      };
    case 'alert':
      return {
        background: 'rgba(254, 243, 199, 1)', // light amber
        borderColor: 'rgba(245, 158, 11, 0.25)', // amber with opacity
        iconColor: 'rgb(245, 158, 11)', // amber
        accentColor: 'rgb(245, 158, 11)',
      };
    case 'tip':
      return {
        background: 'rgba(220, 252, 231, 1)', // light green
        borderColor: 'rgba(34, 197, 94, 0.2)', // green with opacity
        iconColor: 'rgb(34, 197, 94)', // green
        accentColor: 'rgb(34, 197, 94)',
      };
  }
}

// Main AI Insight Card Component
export function AIInsightCard({
  type,
  title,
  content,
  details,
  metric,
  confidence,
  urgency,
  primaryAction,
  secondaryAction,
  onDismiss,
  loading = false,
  minimal = false,
  className = '',
}: AIInsightCardProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const Icon = getInsightIcon(type);
  const style = getInsightStyle(type);

  // Handle dismissal
  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      // Delay to allow animation
      setTimeout(() => {
        onDismiss();
      }, 300);
    }
  };

  // Handle swipe gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -50; // Swipe right threshold
    
    if (isRightSwipe) {
      handleDismiss();
    }
  };

  // Keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && onDismiss) {
      handleDismiss();
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card
        className={`transition-all duration-300 ${className}`}
        style={{
          background: style.background,
          borderColor: style.borderColor,
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" style={{ color: style.iconColor }} />
            <Skeleton className="h-5 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  // Minimal inline variant
  if (minimal) {
    return (
      <div
        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer ${className}`}
        style={{
          background: style.background,
          borderColor: style.borderColor,
        }}
        onClick={primaryAction?.onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            primaryAction?.onClick();
          }
        }}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: style.iconColor }} />
          <span className="text-sm">{content}</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  // Full card variant
  return (
    <Card
      className={`transition-all duration-300 hover:shadow-md ${
        isDismissed ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      } ${className}`}
      style={{
        background: style.background,
        borderColor: style.borderColor,
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      role="complementary"
      aria-label={`KI-${type === 'suggestion' ? 'Empfehlung' : type === 'prediction' ? 'Prognose' : type === 'alert' ? 'Warnung' : 'Tipp'}`}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" style={{ color: style.iconColor }} />
          <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            {title}
          </h3>
        </div>
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 -mt-1 -mr-1 rounded"
            aria-label="Einblick schließen"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Content */}
        <div className="space-y-2">
          {metric && (
            <p
              className="text-lg"
              style={{
                fontWeight: 'var(--font-weight-semi-bold)',
                color: style.accentColor,
              }}
            >
              {metric}
            </p>
          )}
          <p className="text-sm text-foreground">{content}</p>
        </div>

        {/* Details List */}
        {details && details.length > 0 && (
          <ul className="space-y-1 text-sm text-muted-foreground">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Confidence Indicator */}
        {confidence !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {type === 'alert' ? 'Dringlichkeit' : 'Vertrauen'}
              </span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {type === 'alert' && urgency
                  ? urgency === 'high'
                    ? 'Hoch'
                    : urgency === 'medium'
                    ? 'Mittel'
                    : 'Niedrig'
                  : `${Math.round(confidence * 100)}% • ${getConfidenceLabel(confidence)}`}
              </span>
            </div>
            <div className="relative h-1 bg-muted/50 rounded-full overflow-hidden">
              {type === 'alert' && urgency ? (
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                  style={{
                    width: `${urgency === 'high' ? 90 : urgency === 'medium' ? 60 : 30}%`,
                    background: `linear-gradient(to right, ${getUrgencyColor(urgency)}, ${getUrgencyColor(urgency)}99)`,
                  }}
                />
              ) : (
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                  style={{
                    width: `${confidence * 100}%`,
                    background:
                      confidence >= 0.5
                        ? `linear-gradient(to right, ${style.accentColor}, ${style.accentColor}cc)`
                        : `repeating-linear-gradient(90deg, ${style.accentColor}66 0px, ${style.accentColor}66 4px, transparent 4px, transparent 8px)`,
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Effort Indicator (for tips) */}
        {type === 'tip' && urgency && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Aufwand</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {urgency === 'low' ? 'Gering' : urgency === 'medium' ? 'Mittel' : 'Hoch'}
              </span>
            </div>
            <Progress
              value={urgency === 'low' ? 30 : urgency === 'medium' ? 60 : 90}
              className="h-1"
            />
          </div>
        )}

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div className="flex items-center gap-2 pt-2">
            {secondaryAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={secondaryAction.onClick}
                className="flex-1"
                style={{ borderColor: style.borderColor }}
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                size="sm"
                onClick={primaryAction.onClick}
                className="flex-1"
                style={{
                  backgroundColor: style.accentColor,
                  color: 'white',
                  borderColor: style.accentColor,
                }}
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Stacked Insights Summary Component
export interface StackedInsightsProps {
  count: number;
  insights: Array<{
    type: InsightType;
    label: string;
    metric?: string;
  }>;
  onShowAll: () => void;
}

export function StackedInsights({ count, insights, onShowAll }: StackedInsightsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            {count} KI-Einblicke verfügbar
          </h3>
          <Badge variant="secondary">{count}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.slice(0, 3).map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          const style = getInsightStyle(insight.type);
          
          return (
            <div
              key={index}
              className="flex items-center gap-2 text-sm p-2 rounded hover:bg-muted/50 transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" style={{ color: style.iconColor }} />
              <span className="flex-1 truncate">
                {insight.label}
                {insight.metric && (
                  <span
                    className="ml-1"
                    style={{ fontWeight: 'var(--font-weight-medium)', color: style.accentColor }}
                  >
                    ({insight.metric})
                  </span>
                )}
              </span>
            </div>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          onClick={onShowAll}
          className="w-full mt-2"
        >
          Alle anzeigen
        </Button>
      </CardContent>
    </Card>
  );
}

// Demo Component
export function AIInsightCardDemo() {
  const [dismissedCards, setDismissedCards] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    setDismissedCards([...dismissedCards, id]);
    toast.info('Einblick wurde ausgeblendet');
  };

  const handleAction = (action: string) => {
    toast.success(`Aktion ausgeführt: ${action}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">KI-Einblick-Karten</h2>
        <p className="text-sm text-muted-foreground">
          Intelligente Empfehlungen, Prognosen und Warnungen mit Vertrauensanzeigen
        </p>
      </div>

      {/* Suggestion Card */}
      {!dismissedCards.includes('suggestion') && (
        <div>
          <h3 className="mb-3">Empfehlung</h3>
          <AIInsightCard
            type="suggestion"
            title="KI-Empfehlung"
            content="Neue Reihenfolge: Kunde B → A → C statt A → B → C"
            metric="Route optimieren spart 45 Minuten"
            confidence={0.92}
            primaryAction={{
              label: 'Route optimieren',
              onClick: () => handleAction('Route optimieren'),
            }}
            secondaryAction={{
              label: 'Details',
              onClick: () => handleAction('Details anzeigen'),
            }}
            onDismiss={() => handleDismiss('suggestion')}
          />
        </div>
      )}

      {/* Prediction Card */}
      {!dismissedCards.includes('prediction') && (
        <div>
          <h3 className="mb-3">Prognose</h3>
          <AIInsightCard
            type="prediction"
            title="Umsatzprognose"
            content="Basierend auf 3 Opportunities in Endphase und historischer Abschlussrate von 73%"
            metric="€125.000 erwarteter Abschluss diese Woche"
            details={[
              '3 Opportunities in Endphase',
              'Historische Abschlussrate: 73%',
              'Durchschnittliche Bearbeitungszeit: 14 Tage',
            ]}
            confidence={0.78}
            primaryAction={{
              label: 'Forecast-Details',
              onClick: () => handleAction('Forecast anzeigen'),
            }}
            secondaryAction={{
              label: 'Opportunities ansehen',
              onClick: () => handleAction('Opportunities öffnen'),
            }}
            onDismiss={() => handleDismiss('prediction')}
          />
        </div>
      )}

      {/* Alert Card */}
      {!dismissedCards.includes('alert') && (
        <div>
          <h3 className="mb-3">Warnung</h3>
          <AIInsightCard
            type="alert"
            title="Anomalie erkannt"
            content="Normal: €12.000 | Aktuell: €16.200"
            metric="Projektkosten 35% über Durchschnitt"
            details={[
              'Projekt: Website Relaunch',
              'Bereich: Externe Dienstleistungen',
              'Abweichung seit: 3 Tagen',
            ]}
            confidence={0.85}
            urgency="high"
            primaryAction={{
              label: 'Kosten analysieren',
              onClick: () => handleAction('Kostenanalyse'),
            }}
            secondaryAction={{
              label: 'Ignorieren',
              onClick: () => handleDismiss('alert'),
            }}
            onDismiss={() => handleDismiss('alert')}
          />
        </div>
      )}

      {/* Optimization Tip */}
      {!dismissedCards.includes('tip') && (
        <div>
          <h3 className="mb-3">Optimierungstipp</h3>
          <AIInsightCard
            type="tip"
            title="Optimierungspotenzial"
            content="3 Kundenbesuche im selben Gebiet und 2 ähnliche Kalkulationen können kombiniert werden"
            metric="15% Zeitersparnis durch Aufgabengruppierung möglich"
            details={['3 Kundenbesuche im selben Gebiet', '2 ähnliche Kalkulationen']}
            confidence={0.88}
            urgency="low"
            primaryAction={{
              label: 'Jetzt optimieren',
              onClick: () => handleAction('Optimieren'),
            }}
            secondaryAction={{
              label: 'Später',
              onClick: () => handleDismiss('tip'),
            }}
            onDismiss={() => handleDismiss('tip')}
          />
        </div>
      )}

      {/* Mobile Minimal Variant */}
      <div>
        <h3 className="mb-3">Minimal Inline-Variante (Mobile)</h3>
        <div className="max-w-sm">
          <AIInsightCard
            type="suggestion"
            title="KI-Tipp"
            content="3 neue KI-Einblicke verfügbar"
            minimal
            primaryAction={{
              label: 'Anzeigen',
              onClick: () => handleAction('Einblicke öffnen'),
            }}
          />
        </div>
      </div>

      {/* Stacked Insights */}
      <div>
        <h3 className="mb-3">Gestapelte Einblicke</h3>
        <div className="max-w-md">
          <StackedInsights
            count={5}
            insights={[
              { type: 'suggestion', label: 'Route optimieren', metric: '45 min' },
              { type: 'alert', label: 'Kosten-Anomalie', metric: '€16k' },
              { type: 'tip', label: 'Team-Tipp', metric: 'Anna frei' },
            ]}
            onShowAll={() => handleAction('Alle Einblicke anzeigen')}
          />
        </div>
      </div>

      {/* Loading State */}
      <div>
        <h3 className="mb-3">Ladezustand</h3>
        <AIInsightCard
          type="suggestion"
          title=""
          content=""
          loading
        />
      </div>

      {/* Multiple Cards Grid */}
      <div>
        <h3 className="mb-3">Mehrere Einblicke</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AIInsightCard
            type="suggestion"
            title="Route-Optimierung"
            content="Neue Route spart 30 Minuten"
            confidence={0.89}
            primaryAction={{
              label: 'Anwenden',
              onClick: () => handleAction('Route anwenden'),
            }}
          />
          <AIInsightCard
            type="tip"
            title="Zeitersparnis"
            content="2 Aufgaben kombinierbar"
            confidence={0.75}
            urgency="low"
            primaryAction={{
              label: 'Kombinieren',
              onClick: () => handleAction('Kombinieren'),
            }}
          />
        </div>
      </div>

      {/* Accessibility Info */}
      <Card className="bg-muted">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
              Barrierefreiheit
            </h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Tab-Taste: Zu Aktionen navigieren</p>
          <p>• Enter/Leertaste: Hauptaktion aktivieren</p>
          <p>• Escape: Karte schließen</p>
          <p>• Wischen nach rechts: Auf Mobile verwerfen</p>
          <p>• Screen Reader: Vollständige Beschreibungen verfügbar</p>
        </CardContent>
      </Card>
    </div>
  );
}
