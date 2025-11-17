import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import {
  Play,
  Pause,
  Square,
  Timer,
  Settings,
  StickyNote,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Star,
  Clock,
  ExternalLink,
} from 'lucide-react';

// Types
export type TimerState = 'idle' | 'running' | 'paused' | 'stopped';
export type WidgetPosition = 'floating' | 'docked-top' | 'docked-bottom';

export interface TimeEntry {
  id: string;
  projectId: string;
  projectName: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  note?: string;
  isPaused: boolean;
}

export interface Project {
  id: string;
  name: string;
  client?: string;
  isFavorite: boolean;
  recentlyUsed: boolean;
  color?: string;
}

export interface WidgetSettings {
  position: WidgetPosition;
  alwaysOnTop: boolean;
  autoPauseOnIdle: boolean;
  soundEnabled: boolean;
  idleTimeoutMinutes: number;
}

// Utility Functions
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatDurationShort(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

// Compact Floating Widget
export interface CompactTimeTrackerProps {
  currentProject?: Project;
  currentDuration: number;
  todayTotal: number;
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onExpand: () => void;
  onMinimize: () => void;
  onShowNote: () => void;
}

export function CompactTimeTracker({
  currentProject,
  currentDuration,
  todayTotal,
  timerState,
  onStart,
  onPause,
  onStop,
  onExpand,
  onMinimize,
  onShowNote,
}: CompactTimeTrackerProps) {
  return (
    <Card className="w-80 shadow-lg">
      <CardContent className="p-3 space-y-2">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative">
              <Timer className="h-4 w-4 text-primary" />
              {timerState === 'running' && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: 'rgb(59, 130, 246)', opacity: 0.4 }}
                />
              )}
            </div>
            <span
              className="text-lg tabular-nums"
              style={{ fontWeight: 'var(--font-weight-semi-bold)' }}
            >
              {formatDuration(currentDuration)}
            </span>
            <span className="text-sm text-muted-foreground truncate">
              {currentProject?.name || 'Kein Projekt'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="h-6 w-6 p-0"
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {timerState === 'idle' || timerState === 'stopped' ? (
              <Button size="sm" onClick={onStart} className="h-8 px-3">
                <Play className="h-3 w-3 mr-1" />
                Start
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={timerState === 'running' ? onPause : onStart}
                  className="h-8 px-3"
                >
                  {timerState === 'running' ? (
                    <>
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Fortfahren
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onStop}
                  className="h-8 px-3"
                >
                  <Square className="h-3 w-3 mr-1" />
                  Beenden
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Heute: {formatDurationShort(todayTotal)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowNote}
              className="h-6 w-6 p-0"
            >
              <StickyNote className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Status */}
        {timerState === 'paused' && (
          <div className="text-xs text-center py-1 rounded" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'rgb(245, 158, 11)' }}>
            Pausiert
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Expanded Floating Widget
export interface ExpandedTimeTrackerProps {
  currentProject?: Project;
  currentDuration: number;
  todayTotal: number;
  timerState: TimerState;
  note: string;
  projects: Project[];
  onProjectChange: (projectId: string) => void;
  onNoteChange: (note: string) => void;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onCollapse: () => void;
}

export function ExpandedTimeTracker({
  currentProject,
  currentDuration,
  todayTotal,
  timerState,
  note,
  projects,
  onProjectChange,
  onNoteChange,
  onStart,
  onPause,
  onStop,
  onCollapse,
}: ExpandedTimeTrackerProps) {
  return (
    <Card className="w-80 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Zeiterfassung
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCollapse}
            className="h-6 w-6 p-0"
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Project Selector */}
        <div className="space-y-2">
          <Label className="text-xs">Projekt</Label>
          <Select
            value={currentProject?.id || ''}
            onValueChange={onProjectChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Projekt wählen" />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                Zuletzt verwendet
              </div>
              {projects
                .filter((p) => p.recentlyUsed)
                .map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              <div className="px-2 py-1.5 text-xs text-muted-foreground mt-2">
                Favoriten
              </div>
              {projects
                .filter((p) => p.isFavorite)
                .map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      {project.name}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Aktuelle Sitzung:</span>
            <span
              className="tabular-nums"
              style={{ fontWeight: 'var(--font-weight-semi-bold)' }}
            >
              {formatDuration(currentDuration)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Heute gesamt:</span>
            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {formatDurationShort(todayTotal)}
            </span>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <Label className="text-xs">Notiz (optional)</Label>
          <Textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Was machen Sie gerade?"
            className="resize-none h-16 text-sm"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {timerState === 'idle' || timerState === 'stopped' ? (
            <Button onClick={onStart} className="flex-1" size="sm">
              <Play className="h-3 w-3 mr-1" />
              Start
            </Button>
          ) : (
            <>
              <Button
                onClick={timerState === 'running' ? onPause : onStart}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                {timerState === 'running' ? (
                  <>
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Fortfahren
                  </>
                )}
              </Button>
              <Button onClick={onStop} variant="outline" className="flex-1" size="sm">
                <Square className="h-3 w-3 mr-1" />
                Beenden
              </Button>
            </>
          )}
        </div>

        {/* Status Badge */}
        {timerState === 'paused' && (
          <div className="text-center">
            <Badge variant="outline" style={{ color: 'rgb(245, 158, 11)', borderColor: 'rgb(245, 158, 11)' }}>
              Pausiert
            </Badge>
          </div>
        )}
        {timerState === 'running' && (
          <div className="text-center">
            <Badge style={{ background: 'rgb(16, 185, 129)', color: 'white', border: 'none' }}>
              Läuft
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Docked Widget
export interface DockedTimeTrackerProps {
  currentProject?: Project;
  currentDuration: number;
  todayTotal: number;
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onShowNote: () => void;
  onShowSettings: () => void;
}

export function DockedTimeTracker({
  currentProject,
  currentDuration,
  todayTotal,
  timerState,
  onStart,
  onPause,
  onStop,
  onShowNote,
  onShowSettings,
}: DockedTimeTrackerProps) {
  return (
    <div
      className="w-full h-12 border-b px-4 flex items-center justify-between"
      style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Timer className="h-4 w-4 text-primary" />
            {timerState === 'running' && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: 'rgb(59, 130, 246)', opacity: 0.4 }}
              />
            )}
          </div>
          <span className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Zeiterfassung
          </span>
        </div>

        <div className="text-sm text-muted-foreground">|</div>

        <span className="text-sm truncate max-w-xs">
          {currentProject?.name || 'Kein Projekt'}
        </span>

        <div className="text-sm text-muted-foreground">|</div>

        <span
          className="text-sm tabular-nums"
          style={{ fontWeight: 'var(--font-weight-semi-bold)' }}
        >
          {formatDuration(currentDuration)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground">
          Heute: {formatDurationShort(todayTotal)}
        </span>

        <div className="flex items-center gap-1">
          {timerState === 'idle' || timerState === 'stopped' ? (
            <Button size="sm" onClick={onStart} className="h-8">
              <Play className="h-3 w-3 mr-1" />
              Start
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={timerState === 'running' ? onPause : onStart}
                className="h-8"
              >
                {timerState === 'running' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
              <Button size="sm" variant="outline" onClick={onStop} className="h-8">
                <Square className="h-3 w-3" />
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onShowNote}
            className="h-8"
          >
            <StickyNote className="h-3 w-3 mr-1" />
            Notiz
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onShowSettings}
          className="h-8 w-8 p-0"
        >
          <Settings className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// Time Summary Popover
export interface TimeSummaryProps {
  todayEntries: { projectName: string; duration: number }[];
  todayTotal: number;
  weekTotal: number;
  monthTotal: number;
  onViewDetails: () => void;
}

export function TimeSummary({
  todayEntries,
  todayTotal,
  weekTotal,
  monthTotal,
  onViewDetails,
}: TimeSummaryProps) {
  const today = new Date();
  const dateString = today.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Card className="w-72">
      <CardHeader className="pb-3">
        <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
          Heute - {dateString}
        </h4>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {todayEntries.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="truncate flex-1">{entry.projectName}</span>
              <span
                className="tabular-nums"
                style={{ fontWeight: 'var(--font-weight-medium)' }}
              >
                {formatDurationShort(entry.duration)}
              </span>
            </div>
          ))}
          {todayEntries.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Noch keine Einträge heute
            </p>
          )}
        </div>

        <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between text-sm">
            <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Gesamt:</span>
            <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
              {formatDurationShort(todayTotal)}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Diese Woche:</span>
            <span>{formatDurationShort(weekTotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Diesen Monat:</span>
            <span>{formatDurationShort(monthTotal)}</span>
          </div>
        </div>

        <Button onClick={onViewDetails} variant="outline" className="w-full" size="sm">
          Detailansicht
          <ExternalLink className="h-3 w-3 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

// Widget Settings Dialog
export interface WidgetSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: WidgetSettings;
  onSettingsChange: (settings: WidgetSettings) => void;
}

export function WidgetSettingsDialog({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: WidgetSettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onOpenChange(false);
    toast.success('Einstellungen gespeichert');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Widget-Einstellungen</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Position */}
          <div className="space-y-3">
            <Label>Position</Label>
            <RadioGroup
              value={localSettings.position}
              onValueChange={(value: WidgetPosition) =>
                setLocalSettings({ ...localSettings, position: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="floating" id="floating" />
                <Label htmlFor="floating" className="text-sm">
                  Schwebend
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="docked-top" id="docked-top" />
                <Label htmlFor="docked-top" className="text-sm">
                  Oben angedockt
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="docked-bottom" id="docked-bottom" />
                <Label htmlFor="docked-bottom" className="text-sm">
                  Unten angedockt
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Behavior */}
          <div className="space-y-3">
            <Label>Verhalten</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="always-on-top"
                  checked={localSettings.alwaysOnTop}
                  onCheckedChange={(checked) =>
                    setLocalSettings({ ...localSettings, alwaysOnTop: !!checked })
                  }
                />
                <Label htmlFor="always-on-top" className="text-sm">
                  Immer im Vordergrund
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-pause"
                  checked={localSettings.autoPauseOnIdle}
                  onCheckedChange={(checked) =>
                    setLocalSettings({ ...localSettings, autoPauseOnIdle: !!checked })
                  }
                />
                <Label htmlFor="auto-pause" className="text-sm">
                  Auto-Pause bei Inaktivität
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sound"
                  checked={localSettings.soundEnabled}
                  onCheckedChange={(checked) =>
                    setLocalSettings({ ...localSettings, soundEnabled: !!checked })
                  }
                />
                <Label htmlFor="sound" className="text-sm">
                  Ton bei Start/Stop
                </Label>
              </div>
            </div>
          </div>

          {/* Idle Timeout */}
          <div className="space-y-2">
            <Label htmlFor="idle-timeout">Inaktivität nach:</Label>
            <Select
              value={String(localSettings.idleTimeoutMinutes)}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, idleTimeoutMinutes: Number(value) })
              }
            >
              <SelectTrigger id="idle-timeout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Min.</SelectItem>
                <SelectItem value="10">10 Min.</SelectItem>
                <SelectItem value="15">15 Min.</SelectItem>
                <SelectItem value="30">30 Min.</SelectItem>
                <SelectItem value="60">60 Min.</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Demo Component
export function TimeTrackerWidgetDemo() {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [currentDuration, setCurrentDuration] = useState(0);
  const [todayTotal, setTodayTotal] = useState(20520); // 5h 42min
  const [note, setNote] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [widgetMode, setWidgetMode] = useState<'floating' | 'docked'>('floating');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [settings, setSettings] = useState<WidgetSettings>({
    position: 'floating',
    alwaysOnTop: true,
    autoPauseOnIdle: true,
    soundEnabled: true,
    idleTimeoutMinutes: 15,
  });

  const mockProjects: Project[] = [
    { id: '1', name: 'Projekt Phoenix - Phase 2', recentlyUsed: true, isFavorite: false },
    { id: '2', name: 'Hofladen Website', recentlyUsed: true, isFavorite: false },
    { id: '3', name: 'Kundenmeeting Müller', recentlyUsed: true, isFavorite: false },
    { id: '4', name: 'Interne Meetings', recentlyUsed: false, isFavorite: true },
    { id: '5', name: 'Administration', recentlyUsed: false, isFavorite: true },
  ];

  const [currentProject, setCurrentProject] = useState<Project>(mockProjects[0]);

  const todayEntries = [
    { projectName: 'Projekt Phoenix', duration: 13500 }, // 3:45
    { projectName: 'Hofladen Website', duration: 5400 }, // 1:30
    { projectName: 'Meetings', duration: 1620 }, // 0:27
  ];

  // Timer Logic
  useEffect(() => {
    if (timerState === 'running') {
      timerRef.current = setInterval(() => {
        setCurrentDuration((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerState]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        if (timerState === 'running') {
          handleStop();
        } else {
          handleStart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [timerState]);

  const handleStart = () => {
    if (!currentProject) {
      toast.error('Bitte wählen Sie zuerst ein Projekt');
      return;
    }

    setTimerState('running');
    if (settings.soundEnabled) {
      toast.success('Timer gestartet');
    }
  };

  const handlePause = () => {
    setTimerState('paused');
    if (settings.soundEnabled) {
      toast.info('Timer pausiert');
    }
  };

  const handleStop = () => {
    setTimerState('stopped');
    setTodayTotal((prev) => prev + currentDuration);
    
    if (settings.soundEnabled) {
      toast.success(`Zeit erfasst: ${formatDurationShort(currentDuration)}`);
    }
    
    // Reset
    setTimeout(() => {
      setCurrentDuration(0);
      setTimerState('idle');
      setNote('');
    }, 1000);
  };

  const handleProjectChange = (projectId: string) => {
    const project = mockProjects.find((p) => p.id === projectId);
    if (project) {
      setCurrentProject(project);
    }
  };

  const handleSettingsChange = (newSettings: WidgetSettings) => {
    setSettings(newSettings);
    if (newSettings.position === 'docked-top' || newSettings.position === 'docked-bottom') {
      setWidgetMode('docked');
    } else {
      setWidgetMode('floating');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Time Tracker Widget</h2>
        <p className="text-sm text-muted-foreground">
          Minimales Zeiterfassungs-Widget mit schwebender/angedockter Ansicht und schnellen
          Steuerungen
        </p>
      </div>

      {/* Mode Selector */}
      <Card>
        <CardHeader>
          <h3>Widget-Modus</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={widgetMode === 'floating' ? 'default' : 'outline'}
              onClick={() => setWidgetMode('floating')}
              size="sm"
            >
              Schwebend
            </Button>
            <Button
              variant={widgetMode === 'docked' ? 'default' : 'outline'}
              onClick={() => setWidgetMode('docked')}
              size="sm"
            >
              Angedockt
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
              size="sm"
            >
              <Settings className="h-3 w-3 mr-2" />
              Einstellungen
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Tastenkürzel: <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl</kbd> +{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift</kbd> +{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">S</kbd> = Start/Stop
          </p>
        </CardContent>
      </Card>

      {/* Floating Mode */}
      {widgetMode === 'floating' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3>Schwebendes Widget</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-2" />
                    Kompakt
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-2" />
                    Erweitert
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              {isExpanded ? (
                <ExpandedTimeTracker
                  currentProject={currentProject}
                  currentDuration={currentDuration}
                  todayTotal={todayTotal}
                  timerState={timerState}
                  note={note}
                  projects={mockProjects}
                  onProjectChange={handleProjectChange}
                  onNoteChange={setNote}
                  onStart={handleStart}
                  onPause={handlePause}
                  onStop={handleStop}
                  onCollapse={() => setIsExpanded(false)}
                />
              ) : (
                <CompactTimeTracker
                  currentProject={currentProject}
                  currentDuration={currentDuration}
                  todayTotal={todayTotal}
                  timerState={timerState}
                  onStart={handleStart}
                  onPause={handlePause}
                  onStop={handleStop}
                  onExpand={() => setIsExpanded(true)}
                  onMinimize={() => toast.info('Widget minimiert')}
                  onShowNote={() => setShowNoteDialog(true)}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Docked Mode */}
      {widgetMode === 'docked' && (
        <Card>
          <CardHeader>
            <h3>Angedocktes Widget</h3>
          </CardHeader>
          <CardContent className="p-0">
            <DockedTimeTracker
              currentProject={currentProject}
              currentDuration={currentDuration}
              todayTotal={todayTotal}
              timerState={timerState}
              onStart={handleStart}
              onPause={handlePause}
              onStop={handleStop}
              onShowNote={() => setShowNoteDialog(true)}
              onShowSettings={() => setShowSettings(true)}
            />
          </CardContent>
        </Card>
      )}

      {/* Time Summary */}
      <Card>
        <CardHeader>
          <h3>Zeit-Zusammenfassung</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Popover mit heutigen Einträgen und Wochenstatistiken
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Zusammenfassung anzeigen
                </Button>
              </PopoverTrigger>
              <PopoverContent align="center" className="p-0">
                <TimeSummary
                  todayEntries={todayEntries}
                  todayTotal={todayTotal}
                  weekTotal={83700} // 23:15
                  monthTotal={322200} // 89:30
                  onViewDetails={() => toast.info('Öffne Detailansicht...')}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Timer States */}
      <Card>
        <CardHeader>
          <h3>Timer-Zustände</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Verschiedene visuelle Zustände des Timers
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Idle
              </p>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary">Bereit</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Running
              </p>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Timer className="h-4 w-4 text-primary" />
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: 'rgb(59, 130, 246)', opacity: 0.4 }}
                  />
                </div>
                <Badge style={{ background: 'rgb(16, 185, 129)', color: 'white', border: 'none' }}>
                  Läuft
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Paused
              </p>
              <div className="flex items-center gap-2">
                <Pause className="h-4 w-4" style={{ color: 'rgb(245, 158, 11)' }} />
                <Badge variant="outline" style={{ color: 'rgb(245, 158, 11)', borderColor: 'rgb(245, 158, 11)' }}>
                  Pausiert
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Stopped
              </p>
              <div className="flex items-center gap-2">
                <Square className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary">Beendet</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <WidgetSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Notiz hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Was machen Sie gerade?"
              className="resize-none h-32"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={() => setShowNoteDialog(false)}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Implementation Notes */}
      <Card className="bg-muted">
        <CardHeader>
          <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Implementierungshinweise
          </h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            • <strong>Timer-Update:</strong> setInterval mit 1 Sekunde für Zeitanzeige
          </p>
          <p>
            • <strong>Tastenkürzel:</strong> Ctrl+Shift+S für Start/Stop-Toggle
          </p>
          <p>
            • <strong>Auto-Pause:</strong> Inaktivitätserkennung nach konfigurierbarer Zeit
          </p>
          <p>
            • <strong>Persistenz:</strong> Timer-Status in localStorage speichern
          </p>
          <p>
            • <strong>Batch-Writes:</strong> Datenbankschreibvorgänge jede Minute
          </p>
          <p>
            • <strong>Offline-Modus:</strong> Lokale Speicherung mit späterer Synchronisierung
          </p>
          <p>
            • <strong>Benachrichtigungen:</strong> Browser-Notifications für Timer-Events
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
