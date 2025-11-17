import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { toast } from 'sonner@2.0.3';
import {
  Info,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';

// Anomaly Severity Types
export type AnomalySeverity = 'info' | 'warning' | 'alert' | 'success';

// Anomaly Badge Props
export interface AnomalyBadgeProps {
  severity: AnomalySeverity;
  label?: string;
  percentage?: number;
  count?: number;
  inline?: boolean;
  minimal?: boolean;
  animate?: boolean;
  showDetails?: boolean;
  details?: {
    title?: string;
    description?: string;
    normalValue?: string;
    currentValue?: string;
    causes?: string[];
    onViewDetails?: () => void;
    onDismiss?: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

// Severity Configuration
const severityConfig = {
  info: {
    label: 'Muster',
    icon: Info,
    background: 'rgba(239, 246, 255, 1)', // blue-50
    borderColor: 'rgb(59, 130, 246)', // blue-500
    textColor: 'rgb(30, 64, 175)', // blue-800
    iconColor: 'rgb(59, 130, 246)',
    animate: false,
  },
  warning: {
    label: 'Abweichung',
    icon: AlertTriangle,
    background: 'rgba(254, 243, 199, 1)', // amber-100
    borderColor: 'rgb(245, 158, 11)', // amber-500
    textColor: 'rgb(146, 64, 14)', // amber-800
    iconColor: 'rgb(245, 158, 11)',
    animate: true,
  },
  alert: {
    label: 'Anomalie',
    icon: AlertCircle,
    background: 'rgba(254, 226, 226, 1)', // red-100
    borderColor: 'rgb(239, 68, 68)', // red-500
    textColor: 'rgb(153, 27, 27)', // red-800
    iconColor: 'rgb(239, 68, 68)',
    animate: true,
  },
  success: {
    label: 'Besser',
    icon: Sparkles,
    background: 'rgba(209, 250, 229, 1)', // green-100
    borderColor: 'rgb(16, 185, 129)', // green-500
    textColor: 'rgb(22, 101, 52)', // green-800
    iconColor: 'rgb(16, 185, 129)',
    animate: false,
  },
};

// Main Anomaly Badge Component
export function AnomalyBadge({
  severity,
  label,
  percentage,
  count,
  inline = false,
  minimal = false,
  animate = true,
  showDetails = true,
  details,
  onDismiss,
  className = '',
}: AnomalyBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const config = severityConfig[severity];
  const Icon = config.icon;
  const shouldAnimate = animate && config.animate;

  // Format percentage display
  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value}%`;
  };

  // Get display text
  const getDisplayText = () => {
    if (count !== undefined) {
      return `${count} ${count === 1 ? 'Anomalie' : 'Anomalien'}`;
    }
    if (percentage !== undefined) {
      return formatPercentage(percentage);
    }
    if (label) {
      return label;
    }
    return config.label;
  };

  // Handle dismiss
  const handleDismiss = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (onDismiss) {
      onDismiss();
    }
    if (details?.onDismiss) {
      details.onDismiss();
    }
    toast.info('Anomalie ignoriert');
  };

  // Minimal inline badge
  if (minimal) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs transition-all duration-200 ${className}`}
              style={{
                background: config.background,
                borderColor: config.borderColor,
                borderWidth: '1px',
                borderStyle: 'solid',
                color: config.textColor,
                fontWeight: 'var(--font-weight-medium)',
              }}
              role="status"
              aria-label={`${config.label}: ${getDisplayText()}`}
            >
              {percentage !== undefined && (
                <span>{formatPercentage(percentage)}</span>
              )}
            </span>
          </TooltipTrigger>
          {details && (
            <TooltipContent>
              <p className="text-xs">{details.description || config.label}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Inline badge (in text/metrics)
  if (inline) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded transition-all duration-200 hover:scale-105 ${className}`}
              style={{
                background: config.background,
                borderColor: config.borderColor,
                borderWidth: '1px',
                borderStyle: 'solid',
                color: config.textColor,
                fontWeight: 'var(--font-weight-medium)',
                animation: shouldAnimate ? 'anomaly-pulse 2s ease-in-out infinite' : undefined,
              }}
              role="status"
              aria-label={`${config.label}: ${getDisplayText()}`}
            >
              <Icon className="h-3 w-3" style={{ color: config.iconColor }} />
              <span className="text-xs">{getDisplayText()}</span>
            </span>
          </TooltipTrigger>
          {details && (
            <TooltipContent>
              <p className="text-xs">{details.description || config.label}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Full badge with expandable details
  if (showDetails && details) {
    return (
      <Popover open={isExpanded} onOpenChange={setIsExpanded}>
        <PopoverTrigger asChild>
          <button
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
            style={{
              background: config.background,
              borderColor: config.borderColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              color: config.textColor,
              fontWeight: 'var(--font-weight-semi-bold)',
              boxShadow: isHovered ? 'var(--elevation-sm)' : 'none',
              animation: shouldAnimate ? 'anomaly-pulse 2s ease-in-out infinite' : undefined,
              focusRingColor: config.borderColor,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            aria-label={`${config.label}: ${getDisplayText()}. Für Details drücken Sie Enter`}
            aria-expanded={isExpanded}
          >
            <Icon className="h-4 w-4" style={{ color: config.iconColor }} />
            <span className="text-sm">{getDisplayText()}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5" style={{ color: config.iconColor }} />
                <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  {details.title || `${config.label} erkannt`}
                </h4>
              </div>
              {onDismiss && (
                <button
                  onClick={handleDismiss}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 -mt-1 -mr-1 rounded"
                  aria-label="Schließen"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Description */}
            {details.description && (
              <p className="text-sm text-muted-foreground">{details.description}</p>
            )}

            {/* Values Comparison */}
            {(details.normalValue || details.currentValue) && (
              <div className="space-y-1 text-sm">
                {details.normalValue && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Normal:</span>
                    <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                      {details.normalValue}
                    </span>
                  </div>
                )}
                {details.currentValue && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Aktuell:</span>
                    <span
                      style={{
                        fontWeight: 'var(--font-weight-semi-bold)',
                        color: config.textColor,
                      }}
                    >
                      {details.currentValue}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Possible Causes */}
            {details.causes && details.causes.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Mögliche Ursachen:</p>
                <ul className="space-y-1">
                  {details.causes.map((cause, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            {(details.onViewDetails || details.onDismiss) && (
              <div className="flex items-center gap-2 pt-2">
                {details.onDismiss && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      details.onDismiss?.();
                      setIsExpanded(false);
                    }}
                    className="flex-1"
                  >
                    Ignorieren
                  </Button>
                )}
                {details.onViewDetails && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      details.onViewDetails?.();
                      setIsExpanded(false);
                    }}
                    className="flex-1"
                  >
                    Details
                  </Button>
                )}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Standard badge
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-all duration-200 hover:scale-105 ${className}`}
            style={{
              background: config.background,
              borderColor: config.borderColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              color: config.textColor,
              fontWeight: 'var(--font-weight-semi-bold)',
              boxShadow: isHovered ? 'var(--elevation-sm)' : 'none',
              animation: shouldAnimate ? 'anomaly-pulse 2s ease-in-out infinite' : undefined,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="status"
            aria-label={`${config.label}: ${getDisplayText()}`}
          >
            <Icon className="h-4 w-4" style={{ color: config.iconColor }} />
            <span className="text-sm">{getDisplayText()}</span>
          </span>
        </TooltipTrigger>
        {details?.description && (
          <TooltipContent>
            <p className="text-xs">{details.description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

// Grouped Anomalies Component
export interface GroupedAnomaliesProps {
  anomalies: Array<{
    severity: AnomalySeverity;
    label: string;
    percentage?: number;
  }>;
  onShowAll?: () => void;
  className?: string;
}

export function GroupedAnomalies({
  anomalies,
  onShowAll,
  className = '',
}: GroupedAnomaliesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const counts = {
    info: anomalies.filter((a) => a.severity === 'info').length,
    warning: anomalies.filter((a) => a.severity === 'warning').length,
    alert: anomalies.filter((a) => a.severity === 'alert').length,
    success: anomalies.filter((a) => a.severity === 'success').length,
  };

  const totalCount = anomalies.length;
  const mostSevere = counts.alert > 0 ? 'alert' : counts.warning > 0 ? 'warning' : 'info';
  const config = severityConfig[mostSevere];

  return (
    <Popover open={isExpanded} onOpenChange={setIsExpanded}>
      <PopoverTrigger asChild>
        <button
          className={`inline-flex items-center gap-2 px-3 py-2 rounded border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
          style={{
            background: config.background,
            borderColor: config.borderColor,
            color: config.textColor,
            fontWeight: 'var(--font-weight-semi-bold)',
          }}
          aria-label={`${totalCount} Anomalien gefunden. Für Details drücken Sie Enter`}
        >
          <AlertTriangle className="h-4 w-4" style={{ color: config.iconColor }} />
          <span className="text-sm">{totalCount} Anomalien gefunden</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Erkannte Anomalien ({totalCount})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {anomalies.map((anomaly, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded border"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-2">
                  <AnomalyBadge
                    severity={anomaly.severity}
                    label={anomaly.label}
                    percentage={anomaly.percentage}
                    inline
                  />
                </div>
              </div>
            ))}
          </div>
          {onShowAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onShowAll();
                setIsExpanded(false);
              }}
              className="w-full"
            >
              Alle Details anzeigen
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Demo Component
export function AnomalyBadgeDemo() {
  const handleViewDetails = (type: string) => {
    toast.info(`Details anzeigen: ${type}`);
  };

  const handleDismiss = (type: string) => {
    toast.success(`Anomalie ignoriert: ${type}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Anomalie-Badges</h2>
        <p className="text-sm text-muted-foreground">
          KI-gestützte Anomalie-Erkennung mit Schweregradanzeigen und kontextbezogenen Informationen
        </p>
      </div>

      {/* Severity Levels */}
      <Card>
        <CardHeader>
          <h3>Schweregrade</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <AnomalyBadge severity="info" />
            <AnomalyBadge severity="warning" />
            <AnomalyBadge severity="alert" />
            <AnomalyBadge severity="success" />
          </div>
        </CardContent>
      </Card>

      {/* With Percentage */}
      <Card>
        <CardHeader>
          <h3>Mit Prozentangabe</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <AnomalyBadge severity="success" percentage={15} />
            <AnomalyBadge severity="warning" percentage={25} />
            <AnomalyBadge severity="alert" percentage={45} />
            <AnomalyBadge severity="alert" percentage={-30} />
          </div>
        </CardContent>
      </Card>

      {/* With Count */}
      <Card>
        <CardHeader>
          <h3>Mit Anzahl</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <AnomalyBadge severity="warning" count={1} />
            <AnomalyBadge severity="alert" count={3} />
            <AnomalyBadge severity="info" count={5} />
          </div>
        </CardContent>
      </Card>

      {/* Inline Variants */}
      <Card>
        <CardHeader>
          <h3>Inline-Varianten (in Metriken)</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Projektkosten:</span>
            <span className="text-sm">€45.000</span>
            <AnomalyBadge severity="warning" percentage={35} inline />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Conversion Rate:</span>
            <span className="text-sm">73%</span>
            <AnomalyBadge severity="alert" percentage={-25} inline />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Team-Produktivität:</span>
            <span className="text-sm">142%</span>
            <AnomalyBadge severity="success" percentage={18} inline />
          </div>
        </CardContent>
      </Card>

      {/* Minimal Badges */}
      <Card>
        <CardHeader>
          <h3>Minimal (in Tabellen)</h3>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-sm">Kunde</th>
                  <th className="text-right p-3 text-sm">Umsatz</th>
                  <th className="text-right p-3 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 text-sm">REWE AG</td>
                  <td className="p-3 text-sm text-right">€125.000</td>
                  <td className="p-3 text-right">
                    <AnomalyBadge
                      severity="warning"
                      percentage={45}
                      minimal
                      details={{ description: '45% über Durchschnitt' }}
                    />
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 text-sm">Hofladen Schmidt</td>
                  <td className="p-3 text-sm text-right">€23.000</td>
                  <td className="p-3 text-sm text-right text-muted-foreground">Normal</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 text-sm">Baumarkt XYZ</td>
                  <td className="p-3 text-sm text-right">€89.000</td>
                  <td className="p-3 text-right">
                    <AnomalyBadge
                      severity="success"
                      percentage={15}
                      minimal
                      details={{ description: '15% besser als erwartet' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* With Expandable Details */}
      <Card>
        <CardHeader>
          <h3>Mit erweiterbaren Details</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <AnomalyBadge
              severity="warning"
              percentage={35}
              showDetails
              details={{
                title: 'Kosten-Anomalie erkannt',
                description: '35% über Durchschnitt',
                normalValue: '€12.000',
                currentValue: '€16.200',
                causes: [
                  'Materialpreise gestiegen',
                  'Zusätzliche Anforderungen',
                  'Längere Bearbeitungszeit',
                ],
                onViewDetails: () => handleViewDetails('Kosten'),
                onDismiss: () => handleDismiss('Kosten'),
              }}
            />

            <AnomalyBadge
              severity="alert"
              label="Projektdauer"
              showDetails
              details={{
                title: 'Verzögerung erkannt',
                description: 'Projekt läuft 3 Wochen hinter Zeitplan',
                normalValue: '8 Wochen',
                currentValue: '11 Wochen',
                causes: [
                  'Verzögerte Lieferungen',
                  'Personalmangel',
                  'Scope Creep',
                ],
                onViewDetails: () => handleViewDetails('Projektdauer'),
                onDismiss: () => handleDismiss('Projektdauer'),
              }}
            />

            <AnomalyBadge
              severity="success"
              label="Teamleistung"
              showDetails
              details={{
                title: 'Überdurchschnittliche Leistung',
                description: 'Team arbeitet 20% schneller als erwartet',
                normalValue: '100%',
                currentValue: '120%',
                causes: [
                  'Optimierte Prozesse',
                  'Erfahrene Teammitglieder',
                  'Gute Zusammenarbeit',
                ],
                onViewDetails: () => handleViewDetails('Teamleistung'),
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* In Card Header */}
      <Card>
        <CardHeader>
          <h3>In Karten-Header</h3>
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h4>Projekt Phoenix</h4>
                <AnomalyBadge severity="warning" count={2} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Budget:</span>
                <span>€45.000</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Fortschritt:</span>
                <span>65%</span>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Grouped Anomalies */}
      <Card>
        <CardHeader>
          <h3>Gruppierte Anomalien</h3>
        </CardHeader>
        <CardContent>
          <GroupedAnomalies
            anomalies={[
              { severity: 'warning', label: 'Material +35%', percentage: 35 },
              { severity: 'success', label: 'Personal -12%', percentage: -12 },
              { severity: 'warning', label: 'Reisen +125%', percentage: 125 },
              { severity: 'alert', label: 'Budget überschritten', percentage: 15 },
              { severity: 'info', label: 'Ungewöhnliches Muster' },
            ]}
            onShowAll={() => toast.info('Zeige alle Anomalien')}
          />
        </CardContent>
      </Card>

      {/* Complex Dashboard Widget */}
      <Card>
        <CardHeader>
          <h3>Dashboard Widget-Integration</h3>
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h4 className="text-sm">Projektkosten diese Woche</h4>
                <div className="flex items-center gap-2">
                  <AnomalyBadge severity="warning" count={2} inline />
                  <AnomalyBadge severity="success" count={1} inline />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-2xl">€45.250</p>
                <p className="text-sm text-muted-foreground">↑15% vs. letzte Woche</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Material</span>
                  <div className="flex items-center gap-2">
                    <span>€18.500</span>
                    <AnomalyBadge severity="warning" percentage={35} minimal />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Personal</span>
                  <div className="flex items-center gap-2">
                    <span>€22.000</span>
                    <AnomalyBadge severity="success" percentage={-12} minimal />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reisen</span>
                  <div className="flex items-center gap-2">
                    <span>€4.750</span>
                    <AnomalyBadge severity="warning" percentage={125} minimal />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Accessibility Info */}
      <Card className="bg-muted">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
              Barrierefreiheit & Interaktion
            </h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Hover: Tooltip nach 500ms, leichte Vergrößerung</p>
          <p>• Klick: Erweiterte Details in Popover</p>
          <p>• Keyboard: Tab zum Fokussieren, Enter/Space zum Öffnen, Escape zum Schließen</p>
          <p>• Screen Reader: Volle Beschreibungen mit ARIA-Labels</p>
          <p>• Farbenunabhängig: Icons und Text für alle Schweregrade</p>
          <p>• Animation: Pulse nur bei Warnungen/Alarmen, reduzierte Bewegung unterstützt</p>
        </CardContent>
      </Card>

      {/* CSS Animation Note */}
      <Card className="bg-muted">
        <CardHeader>
          <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            CSS-Animation
          </h3>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">Die Pulse-Animation wird über CSS-Keyframes definiert:</p>
          <pre className="p-3 bg-background rounded border text-xs overflow-x-auto">
{`@keyframes anomaly-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
