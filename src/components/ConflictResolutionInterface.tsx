import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import {
  AlertTriangle,
  GitMerge,
  Plus,
  Minus,
  Edit3,
  ChevronDown,
  ChevronRight,
  Clock,
  User,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  History,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Types
type FieldChangeType = 'added' | 'removed' | 'modified' | 'unchanged';
type ResolutionChoice = 'local' | 'server' | 'manual' | null;
type AutoResolveStrategy = 'newest' | 'always-local' | 'always-server' | 'never';

interface FieldConflict {
  field: string;
  localValue: any;
  serverValue: any;
  changeType: FieldChangeType;
  isComplex?: boolean;
  subFields?: FieldConflict[];
}

interface ConflictData {
  id: string;
  entity: string;
  entityId: string;
  entityName: string;
  localTimestamp: Date;
  localUser: string;
  serverTimestamp: Date;
  serverUser: string;
  fields: FieldConflict[];
}

interface Resolution {
  field: string;
  choice: ResolutionChoice;
  value?: any;
}

// Mock conflict data
const mockConflict: ConflictData = {
  id: 'conflict-001',
  entity: 'Kunde',
  entityId: 'C001',
  entityName: 'Hofladen Müller GmbH',
  localTimestamp: new Date('2024-11-15T10:30:00'),
  localUser: 'Sie',
  serverTimestamp: new Date('2024-11-15T10:45:00'),
  serverUser: 'Anna Weber',
  fields: [
    {
      field: 'Firmenname',
      localValue: 'Hofladen Müller',
      serverValue: 'Hofladen Müller GmbH',
      changeType: 'modified',
    },
    {
      field: 'Telefon',
      localValue: '+49-89-111111',
      serverValue: '+49-89-1234567',
      changeType: 'modified',
    },
    {
      field: 'E-Mail',
      localValue: 'alt@hofladen.de',
      serverValue: 'info@hofladen-mueller.de',
      changeType: 'modified',
    },
    {
      field: 'Status',
      localValue: 'Lead',
      serverValue: 'Lead',
      changeType: 'unchanged',
    },
    {
      field: 'Kreditlimit',
      localValue: '€ 10.000,00',
      serverValue: '€ 25.000,00',
      changeType: 'modified',
    },
    {
      field: 'Adresse',
      localValue: null,
      serverValue: null,
      changeType: 'modified',
      isComplex: true,
      subFields: [
        {
          field: 'Straße',
          localValue: 'Hauptstraße 1',
          serverValue: 'Hauptstr. 1',
          changeType: 'modified',
        },
        {
          field: 'PLZ',
          localValue: '80331',
          serverValue: '80331',
          changeType: 'unchanged',
        },
        {
          field: 'Stadt',
          localValue: 'München',
          serverValue: 'München',
          changeType: 'unchanged',
        },
      ],
    },
    {
      field: 'Webseite',
      localValue: null,
      serverValue: 'www.hofladen-mueller.de',
      changeType: 'added',
    },
    {
      field: 'Notizen',
      localValue: 'Wichtiger Kunde',
      serverValue: 'Wichtiger Kunde - Großauftrag geplant',
      changeType: 'modified',
    },
  ],
};

// Get change type icon
function getChangeTypeIcon(type: FieldChangeType) {
  switch (type) {
    case 'added':
      return <Plus className="h-3 w-3" />;
    case 'removed':
      return <Minus className="h-3 w-3" />;
    case 'modified':
      return <Edit3 className="h-3 w-3" />;
    default:
      return null;
  }
}

// Get change type color
function getChangeTypeColor(type: FieldChangeType): string {
  switch (type) {
    case 'added':
      return 'bg-green-100 border-green-200';
    case 'removed':
      return 'bg-red-100 border-red-200';
    case 'modified':
      return 'bg-amber-100 border-amber-200';
    default:
      return 'bg-background';
  }
}

// Get resolution badge
function getResolutionBadge(choice: ResolutionChoice) {
  switch (choice) {
    case 'local':
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          Meine Version
        </Badge>
      );
    case 'server':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          Server-Version
        </Badge>
      );
    case 'manual':
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
          Manuell zusammengeführt
        </Badge>
      );
    default:
      return null;
  }
}

// Format value
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return '-';
  }
  return String(value);
}

// Conflict Alert Banner Component
export function ConflictAlertBanner({
  conflictCount,
  onResolve,
}: {
  conflictCount: number;
  onResolve: () => void;
}) {
  return (
    <Alert className="bg-red-600 border-red-700 text-white mb-6">
      <AlertTriangle className="h-5 w-5 text-white" />
      <AlertDescription className="flex items-center justify-between">
        <span className="flex-1">
          <strong>{conflictCount} Konflikte gefunden</strong> - Daten wurden gleichzeitig geändert
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={onResolve}
          className="bg-white text-red-600 hover:bg-gray-100 ml-4"
        >
          Jetzt lösen
        </Button>
      </AlertDescription>
    </Alert>
  );
}

// Field Resolution Component
function FieldResolution({
  field,
  resolution,
  onResolutionChange,
}: {
  field: FieldConflict;
  resolution: Resolution | undefined;
  onResolutionChange: (field: string, choice: ResolutionChoice, value?: any) => void;
}) {
  const [manualValue, setManualValue] = useState<string>(
    resolution?.choice === 'manual' ? String(resolution.value || '') : ''
  );

  const handleChoiceChange = (choice: ResolutionChoice) => {
    if (choice === 'manual') {
      // Pre-fill with intelligent merge suggestion
      const suggested =
        field.changeType === 'added'
          ? field.serverValue
          : field.changeType === 'removed'
          ? field.localValue
          : `${field.localValue} / ${field.serverValue}`;
      setManualValue(String(suggested || ''));
      onResolutionChange(field.field, choice, suggested);
    } else {
      onResolutionChange(field.field, choice);
    }
  };

  const handleManualValueChange = (value: string) => {
    setManualValue(value);
    onResolutionChange(field.field, 'manual', value);
  };

  // Don't show unchanged fields
  if (field.changeType === 'unchanged') {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Field Name */}
      <div className="flex items-center gap-2">
        <p>{field.field}</p>
        {getChangeTypeIcon(field.changeType)}
        {field.changeType === 'added' && (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Neu
          </Badge>
        )}
        {field.changeType === 'removed' && (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Entfernt
          </Badge>
        )}
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local Version */}
        <div
          className={`border rounded-lg p-4 ${
            field.changeType !== 'added' ? getChangeTypeColor(field.changeType) : 'bg-background border-border'
          }`}
        >
          <Label className="text-xs text-blue-700 mb-2 block">Ihre Version</Label>
          <p className="text-sm break-words">{formatValue(field.localValue)}</p>
        </div>

        {/* Server Version */}
        <div
          className={`border rounded-lg p-4 ${
            field.changeType !== 'removed' ? getChangeTypeColor(field.changeType) : 'bg-background border-border'
          }`}
        >
          <Label className="text-xs text-green-700 mb-2 block">Server-Version</Label>
          <p className="text-sm break-words">{formatValue(field.serverValue)}</p>
        </div>
      </div>

      {/* Resolution Choices */}
      <RadioGroup
        value={resolution?.choice || ''}
        onValueChange={(value) => handleChoiceChange(value as ResolutionChoice)}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="local" id={`${field.field}-local`} />
            <Label htmlFor={`${field.field}-local`} className="cursor-pointer">
              Meine Version behalten
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="server" id={`${field.field}-server`} />
            <Label htmlFor={`${field.field}-server`} className="cursor-pointer">
              Server-Version behalten
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="manual" id={`${field.field}-manual`} />
            <Label htmlFor={`${field.field}-manual`} className="cursor-pointer">
              Manuell zusammenführen
            </Label>
          </div>
        </div>
      </RadioGroup>

      {/* Manual Merge Input */}
      {resolution?.choice === 'manual' && (
        <div className="mt-4">
          <Label className="mb-2 block">Zusammengeführter Wert</Label>
          <Input
            value={manualValue}
            onChange={(e) => handleManualValueChange(e.target.value)}
            placeholder="Geben Sie den zusammengeführten Wert ein..."
          />
          <p className="text-sm text-muted-foreground mt-2">
            Bearbeiten Sie den vorgeschlagenen Wert oder geben Sie einen eigenen ein
          </p>
        </div>
      )}
    </div>
  );
}

// Complex Field Resolution (Nested)
function ComplexFieldResolution({
  field,
  resolutions,
  onResolutionChange,
}: {
  field: FieldConflict;
  resolutions: Resolution[];
  onResolutionChange: (field: string, choice: ResolutionChoice, value?: any) => void;
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={field.field} className="border rounded-lg px-4">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <span>{field.field}</span>
            <Badge variant="outline">Verschachtelt</Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
          {field.subFields?.map((subField) => {
            const resolution = resolutions.find(
              (r) => r.field === `${field.field}.${subField.field}`
            );
            return (
              <FieldResolution
                key={subField.field}
                field={subField}
                resolution={resolution}
                onResolutionChange={(f, choice, value) =>
                  onResolutionChange(`${field.field}.${f}`, choice, value)
                }
              />
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// Main Conflict Resolution Dialog
export function ConflictResolutionDialog({
  conflict,
  isOpen,
  onClose,
  onResolve,
  totalConflicts = 1,
  currentIndex = 0,
}: {
  conflict: ConflictData;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (resolutions: Resolution[]) => void;
  totalConflicts?: number;
  currentIndex?: number;
}) {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Handle resolution change
  const handleResolutionChange = (field: string, choice: ResolutionChoice, value?: any) => {
    setResolutions((prev) => {
      const existing = prev.findIndex((r) => r.field === field);
      const newResolution: Resolution = { field, choice, value };

      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newResolution;
        return updated;
      }
      return [...prev, newResolution];
    });
  };

  // Auto-resolve all
  const handleAutoResolve = (strategy: 'local' | 'server' | 'newest' | 'intelligent') => {
    const newResolutions: Resolution[] = [];

    conflict.fields.forEach((field) => {
      if (field.changeType === 'unchanged') return;

      if (field.isComplex && field.subFields) {
        field.subFields.forEach((subField) => {
          if (subField.changeType === 'unchanged') return;

          let choice: ResolutionChoice = 'local';
          if (strategy === 'local') choice = 'local';
          else if (strategy === 'server') choice = 'server';
          else if (strategy === 'newest') {
            choice = conflict.serverTimestamp > conflict.localTimestamp ? 'server' : 'local';
          } else if (strategy === 'intelligent') {
            // Simple intelligent merge: prefer non-empty values
            if (!subField.localValue && subField.serverValue) choice = 'server';
            else if (subField.localValue && !subField.serverValue) choice = 'local';
            else choice = conflict.serverTimestamp > conflict.localTimestamp ? 'server' : 'local';
          }

          newResolutions.push({
            field: `${field.field}.${subField.field}`,
            choice,
          });
        });
      } else {
        let choice: ResolutionChoice = 'local';
        if (strategy === 'local') choice = 'local';
        else if (strategy === 'server') choice = 'server';
        else if (strategy === 'newest') {
          choice = conflict.serverTimestamp > conflict.localTimestamp ? 'server' : 'local';
        } else if (strategy === 'intelligent') {
          // Simple intelligent merge: prefer non-empty values
          if (!field.localValue && field.serverValue) choice = 'server';
          else if (field.localValue && !field.serverValue) choice = 'local';
          else if (field.changeType === 'added') choice = 'server';
          else choice = conflict.serverTimestamp > conflict.localTimestamp ? 'server' : 'local';
        }

        newResolutions.push({
          field: field.field,
          choice,
        });
      }
    });

    setResolutions(newResolutions);
    toast.success('Auto-Lösung angewendet', {
      description: `${newResolutions.length} Felder automatisch aufgelöst`,
    });
  };

  // Check if all conflicts resolved
  const changedFields = conflict.fields.filter((f) => {
    if (f.changeType === 'unchanged') return false;
    if (f.isComplex) {
      return f.subFields?.some((sf) => sf.changeType !== 'unchanged');
    }
    return true;
  });

  const requiredResolutions = changedFields.reduce((count, field) => {
    if (field.isComplex && field.subFields) {
      return count + field.subFields.filter((sf) => sf.changeType !== 'unchanged').length;
    }
    return count + 1;
  }, 0);

  const isResolved = resolutions.length >= requiredResolutions;

  // Handle resolve
  const handleResolve = () => {
    if (!isResolved) {
      toast.error('Nicht alle Konflikte gelöst', {
        description: 'Bitte treffen Sie eine Auswahl für alle geänderten Felder',
      });
      return;
    }

    onResolve(resolutions);
    toast.success('Konflikt gelöst', {
      description: 'Daten erfolgreich synchronisiert',
      icon: <CheckCircle2 className="h-5 w-5" />,
    });
  };

  // Count resolutions by type
  const resolutionCounts = {
    local: resolutions.filter((r) => r.choice === 'local').length,
    server: resolutions.filter((r) => r.choice === 'server').length,
    manual: resolutions.filter((r) => r.choice === 'manual').length,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <GitMerge className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <DialogTitle className="mb-1">Datenkonflikt lösen</DialogTitle>
                <p className="text-muted-foreground text-sm">
                  {conflict.entity}: {conflict.entityName}
                </p>
              </div>
            </div>
            {totalConflicts > 1 && (
              <Badge variant="outline" className="ml-4">
                Konflikt {currentIndex + 1} von {totalConflicts}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <ScrollArea className="max-h-[calc(90vh-240px)]">
          <div className="p-6 space-y-6">
            {/* Conflict Info */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm">Ihre Version</p>
                      <p className="text-xs text-muted-foreground">
                        Bearbeitet von {conflict.localUser}:{' '}
                        {format(conflict.localTimestamp, "dd.MM.yyyy, HH:mm 'Uhr'", { locale: de })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm">Server-Version</p>
                      <p className="text-xs text-muted-foreground">
                        Bearbeitet von {conflict.serverUser}:{' '}
                        {format(conflict.serverTimestamp, "dd.MM.yyyy, HH:mm 'Uhr'", { locale: de })}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-800">
                    Konfliktgrund: Zeitgleiche Änderungen während Offline-Modus
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Auto-Resolution Options */}
            <div>
              <Label className="mb-3 block">Schnelle Lösungen</Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleAutoResolve('local')}>
                  Alle meine Version
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAutoResolve('server')}>
                  Alle Server-Version
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAutoResolve('newest')}>
                  Neueste bevorzugen
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAutoResolve('intelligent')}
                  className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Intelligentes Zusammenführen
                </Button>
              </div>
            </div>

            <Separator />

            {/* Field Conflicts */}
            <div className="space-y-6">
              {conflict.fields.map((field) => {
                if (field.isComplex && field.subFields) {
                  return (
                    <ComplexFieldResolution
                      key={field.field}
                      field={field}
                      resolutions={resolutions}
                      onResolutionChange={handleResolutionChange}
                    />
                  );
                }

                const resolution = resolutions.find((r) => r.field === field.field);
                return (
                  <Card key={field.field}>
                    <CardContent className="p-4">
                      <FieldResolution
                        field={field}
                        resolution={resolution}
                        onResolutionChange={handleResolutionChange}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Review Summary */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Zusammenfassung der Auflösung</span>
                  <Badge variant="outline">
                    {resolutions.length} von {requiredResolutions} gelöst
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      {resolutionCounts.local}
                    </Badge>
                    <span className="text-muted-foreground">Meine Version</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      {resolutionCounts.server}
                    </Badge>
                    <span className="text-muted-foreground">Server-Version</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      {resolutionCounts.manual}
                    </Badge>
                    <span className="text-muted-foreground">Manuell</span>
                  </div>
                </div>

                {resolutions.length > 0 && (
                  <Accordion type="single" collapsible className="mt-4">
                    <AccordionItem value="details" className="border-0">
                      <AccordionTrigger className="py-2">
                        Details anzeigen
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 pt-2">
                        {resolutions.map((resolution) => (
                          <div
                            key={resolution.field}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-muted-foreground">{resolution.field}:</span>
                            {getResolutionBadge(resolution.choice)}
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </CardContent>
            </Card>

            {/* Conflict History */}
            <Accordion type="single" collapsible>
              <AccordionItem value="history" className="border rounded-lg px-4">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>Konfliktverlauf</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="mb-1">
                          12.11.2024, 14:30 - Gelöst von Anna Weber
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Lösung: Manuell zusammengeführt (3 Felder)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="mb-1">
                          08.11.2024, 09:15 - Gelöst von Michael Schmidt
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Lösung: Server-Version bevorzugt
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-border space-y-3">
          {!isResolved && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Bitte treffen Sie eine Auswahl für alle {requiredResolutions} geänderten Felder
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Abbrechen
            </Button>
            <Button
              className="flex-1"
              onClick={handleResolve}
              disabled={!isResolved}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Konflikt lösen
            </Button>
            {totalConflicts > 1 && currentIndex < totalConflicts - 1 && (
              <Button variant="secondary" className="flex-1">
                Weiter zum nächsten <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Auto-Resolution Settings Component
export function AutoResolutionSettings() {
  const [autoResolve, setAutoResolve] = useState(false);
  const [strategy, setStrategy] = useState<AutoResolveStrategy>('newest');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automatische Konfliktlösung</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-Merge aktivieren</Label>
            <p className="text-sm text-muted-foreground">
              Automatische Lösung bei nicht-kritischen Feldern
            </p>
          </div>
          <Switch checked={autoResolve} onCheckedChange={setAutoResolve} />
        </div>

        {autoResolve && (
          <div className="space-y-2">
            <Label>Strategie</Label>
            <RadioGroup value={strategy} onValueChange={(v) => setStrategy(v as AutoResolveStrategy)}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="newest" id="strategy-newest" />
                  <Label htmlFor="strategy-newest" className="cursor-pointer">
                    Neueste Version bevorzugen (empfohlen)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="always-local" id="strategy-local" />
                  <Label htmlFor="strategy-local" className="cursor-pointer">
                    Immer meine Version
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="always-server" id="strategy-server" />
                  <Label htmlFor="strategy-server" className="cursor-pointer">
                    Immer Server-Version
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="never" id="strategy-never" />
                  <Label htmlFor="strategy-never" className="cursor-pointer">
                    Nie automatisch - Immer fragen
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Demo Component
export function ConflictResolutionInterfaceDemo() {
  const [showDialog, setShowDialog] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const handleResolve = (resolutions: Resolution[]) => {
    console.log('Resolved with:', resolutions);
    setShowDialog(false);
    setShowBanner(false);
  };

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => setShowBanner(true)} variant="outline">
                Banner anzeigen
              </Button>
              <Button onClick={() => setShowDialog(true)}>
                Konflikt-Dialog öffnen
              </Button>
            </div>

            <div className="border border-border rounded-lg p-6 bg-muted/50">
              <h3 className="mb-4">Features:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Conflict Alert Banner (Rote Warnung mit Konflikt-Anzahl)</li>
                <li>• Full-Screen Resolution Dialog (max 6xl Breite)</li>
                <li>• Side-by-Side Vergleich (Ihre vs. Server-Version)</li>
                <li>• Field-Level Diffs (Added/Modified/Removed)</li>
                <li>• Radio-Button Auswahl (Local/Server/Manual)</li>
                <li>• Manuelle Zusammenführung mit vorgeschlagenem Wert</li>
                <li>• Auto-Resolution Optionen (4 Strategien)</li>
                <li>• Intelligentes Zusammenführen (AI-unterstützt)</li>
                <li>• Verschachtelte Felder (Adresse mit Sub-Feldern)</li>
                <li>• Review-Zusammenfassung mit Badge-Zählern</li>
                <li>• Konflikt-Verlauf (Previous resolutions)</li>
                <li>• Multiple Conflict Queue (1 von 3)</li>
                <li>• Progress-Tracking (X von Y gelöst)</li>
                <li>• Auto-Resolution Settings Component</li>
                <li>• Validation (Alle Felder müssen gelöst sein)</li>
                <li>• Success/Error Toasts mit Sonner</li>
                <li>• German Labels & Timestamps (date-fns)</li>
                <li>• Responsive Layout (Stacked on mobile)</li>
                <li>• Color-coded Badges (Blue/Green/Amber)</li>
                <li>• Scrollable Content (max 90vh)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conflict Banner */}
      {showBanner && (
        <ConflictAlertBanner conflictCount={3} onResolve={() => setShowDialog(true)} />
      )}

      {/* Sample Entity */}
      <Card>
        <CardHeader>
          <CardTitle>Kunde: Hofladen Müller GmbH</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Firmenname:</span> Hofladen Müller GmbH
            </div>
            <div>
              <span className="text-muted-foreground">Telefon:</span> +49-89-1234567
            </div>
            <div>
              <span className="text-muted-foreground">E-Mail:</span> info@hofladen-mueller.de
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span> Lead
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Resolution Settings */}
      <AutoResolutionSettings />

      {/* Conflict Dialog */}
      <ConflictResolutionDialog
        conflict={mockConflict}
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onResolve={handleResolve}
        totalConflicts={3}
        currentIndex={0}
      />
    </div>
  );
}
